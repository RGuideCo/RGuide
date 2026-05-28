"use client";

import { useEffect } from "react";

const MAX_TEXT_LENGTH = 80;
const ANALYTICS_SESSION_KEY = "rguide_analytics_session_id";
const ANALYTICS_QUEUE_KEY = "rguide_analytics_event_queue_v2";
const MAX_QUEUE_SIZE = 80;
const MAX_BATCH_SIZE = 25;
const FLUSH_INTERVAL_MS = 45_000;
const LOW_VALUE_SAMPLE_RATE = 0.1;
const GUIDE_LINK_SAMPLE_RATE = 0.35;
const DIRECT_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "")}/rest/v1/rpc/record_analytics_batch`
  : null;
const DIRECT_SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  null;
const ENABLE_VERCEL_FALLBACK = process.env.NEXT_PUBLIC_ANALYTICS_ENABLE_VERCEL_FALLBACK === "true";

type AnalyticsEventType =
  | "affiliate_click"
  | "outbound_click"
  | "guide_link_click"
  | "internal_link_click"
  | "button_click";

type AnalyticsEvent = {
  eventType: AnalyticsEventType;
  sessionId?: string;
  referrer?: string;
  sampleRate?: number;
  sampleWeight?: number;
  properties: Record<string, string | number | undefined>;
};

type QueuedAnalyticsEvent = AnalyticsEvent & {
  queuedAt: string;
};

function truncate(value: string, maxLength = MAX_TEXT_LENGTH) {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1)}...` : normalized;
}

function getCurrentPath() {
  return `${window.location.pathname}${window.location.search}`;
}

function isAdminOrDevTraffic() {
  const host = window.location.hostname;

  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".local") ||
    window.location.pathname.startsWith("/admin")
  );
}

function isLikelyBot() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|whatsapp|telegram|bingpreview/.test(
    userAgent,
  );
}

function getLinkText(element: HTMLElement) {
  return truncate(element.innerText || element.getAttribute("aria-label") || element.getAttribute("title") || "");
}

function getRouteParts(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);

  if (parts[0] !== "city") {
    return {};
  }

  const city = parts[1];
  const category = parts.length >= 4 ? parts[parts.length - 2] : parts[2];
  const guideSlug = parts.length >= 4 ? parts[parts.length - 1] : undefined;
  const neighborhood = parts.length >= 5 ? parts.slice(2, -2).join("/") : undefined;

  return {
    city,
    neighborhood,
    category,
    guideSlug,
  };
}

function getStay22Params(url: URL) {
  return {
    aid: url.searchParams.get("aid") ?? undefined,
    campaign: url.searchParams.getAll("campaign").join(",") || undefined,
    hotelName: url.searchParams.get("hotelname") ?? undefined,
  };
}

function isMeaningfulButton(text: string) {
  return /book|reserve|hotel|stay|open|submit|save|share|favorite|view|map|directions/i.test(text);
}

function shouldSample(rate: number) {
  return Math.random() < rate;
}

function withSampling(event: AnalyticsEvent, rate: number) {
  return {
    ...event,
    sampleRate: rate,
    sampleWeight: Math.round(1 / rate),
  };
}

function prioritizeEvent(event: AnalyticsEvent) {
  if (event.eventType === "affiliate_click" || event.eventType === "outbound_click") {
    return event;
  }

  if (event.eventType === "guide_link_click") {
    return shouldSample(GUIDE_LINK_SAMPLE_RATE) ? withSampling(event, GUIDE_LINK_SAMPLE_RATE) : null;
  }

  if (event.eventType === "internal_link_click") {
    return shouldSample(LOW_VALUE_SAMPLE_RATE) ? withSampling(event, LOW_VALUE_SAMPLE_RATE) : null;
  }

  if (event.eventType === "button_click") {
    const buttonText = String(event.properties.buttonText ?? "");
    return isMeaningfulButton(buttonText) && shouldSample(LOW_VALUE_SAMPLE_RATE)
      ? withSampling(event, LOW_VALUE_SAMPLE_RATE)
      : null;
  }

  return null;
}

function getEventForAnchor(anchor: HTMLAnchorElement) {
  const rawHref = anchor.getAttribute("href");

  if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) {
    return null;
  }

  const url = new URL(rawHref, window.location.href);
  const isInternal = url.hostname === window.location.hostname;
  const isStay22 = url.hostname === "stay22.com" || url.hostname.endsWith(".stay22.com");
  const currentPath = getCurrentPath();
  const destinationPath = `${url.pathname}${url.search}`;
  const routeParts = getRouteParts(url.pathname);
  const linkText = getLinkText(anchor);
  const baseProperties = {
    currentPath,
    destinationHost: url.hostname,
    destinationPath: truncate(destinationPath, 160),
    linkText,
    ...routeParts,
  };

  if (!linkText && !isStay22) {
    return null;
  }

  if (isStay22) {
    return {
      eventType: "affiliate_click",
      properties: {
        ...baseProperties,
        affiliate: "stay22",
        ...getStay22Params(url),
      },
    } satisfies AnalyticsEvent;
  }

  if (!isInternal) {
    return {
      eventType: "outbound_click",
      properties: baseProperties,
    } satisfies AnalyticsEvent;
  }

  if (url.pathname.startsWith("/city/") || url.pathname.startsWith("/list/")) {
    return {
      eventType: "guide_link_click",
      properties: baseProperties,
    } satisfies AnalyticsEvent;
  }

  return {
    eventType: "internal_link_click",
    properties: baseProperties,
  } satisfies AnalyticsEvent;
}

function getEventForButton(button: HTMLButtonElement) {
  const text = getLinkText(button);

  if (!text) {
    return null;
  }

  return {
    eventType: "button_click",
    properties: {
      currentPath: getCurrentPath(),
      buttonText: text,
      buttonLabel: truncate(button.getAttribute("aria-label") || ""),
    },
  } satisfies AnalyticsEvent;
}

function getSessionId() {
  try {
    const existing = window.localStorage.getItem(ANALYTICS_SESSION_KEY);

    if (existing) {
      return existing;
    }

    const next = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(ANALYTICS_SESSION_KEY, next);
    return next;
  } catch {
    return undefined;
  }
}

function readQueue(): QueuedAnalyticsEvent[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(ANALYTICS_QUEUE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.slice(-MAX_QUEUE_SIZE) : [];
  } catch {
    return [];
  }
}

function writeQueue(queue: QueuedAnalyticsEvent[]) {
  try {
    window.localStorage.setItem(ANALYTICS_QUEUE_KEY, JSON.stringify(queue.slice(-MAX_QUEUE_SIZE)));
  } catch {
    // Storage can be unavailable in private contexts; analytics should never break UX.
  }
}

function clearSentEvents(sentCount: number) {
  const queue = readQueue();
  writeQueue(queue.slice(sentCount));
}

function buildPayload(events: QueuedAnalyticsEvent[]) {
  return JSON.stringify({ events });
}

async function sendDirectToSupabase(events: QueuedAnalyticsEvent[]) {
  if (!DIRECT_SUPABASE_URL || !DIRECT_SUPABASE_KEY) {
    return false;
  }

  const response = await fetch(DIRECT_SUPABASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: DIRECT_SUPABASE_KEY,
      Authorization: `Bearer ${DIRECT_SUPABASE_KEY}`,
    },
    body: JSON.stringify({ p_events: events }),
    keepalive: true,
  });

  return response.ok;
}

function sendFallbackToVercel(events: QueuedAnalyticsEvent[]) {
  const payload = buildPayload(events);

  if (navigator.sendBeacon) {
    return navigator.sendBeacon(
      "/api/analytics/click",
      new Blob([payload], { type: "application/json" }),
    );
  }

  void fetch("/api/analytics/click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);

  return true;
}

function flushAnalyticsQueue({ allowVercelFallback = false } = {}) {
  const queue = readQueue();

  if (!queue.length) {
    return;
  }

  const batch = queue.slice(0, MAX_BATCH_SIZE);

  void sendDirectToSupabase(batch)
    .then((sent) => {
      if (sent) {
        clearSentEvents(batch.length);
        return;
      }

      if (allowVercelFallback && ENABLE_VERCEL_FALLBACK && sendFallbackToVercel(batch)) {
        clearSentEvents(batch.length);
      }
    })
    .catch(() => {
      if (allowVercelFallback && ENABLE_VERCEL_FALLBACK && sendFallbackToVercel(batch)) {
        clearSentEvents(batch.length);
      }
    });
}

function queueAnalyticsEvent(analyticsEvent: AnalyticsEvent) {
  const event = prioritizeEvent({
    ...analyticsEvent,
    sessionId: getSessionId(),
    referrer: document.referrer || undefined,
  });

  if (!event) {
    return;
  }

  const queue = readQueue();
  const nextQueue = [...queue, { ...event, queuedAt: new Date().toISOString() }].slice(-MAX_QUEUE_SIZE);
  writeQueue(nextQueue);

  if (event.eventType === "affiliate_click" || nextQueue.length >= MAX_BATCH_SIZE) {
    flushAnalyticsQueue();
  }
}

export function SiteAnalyticsEvents() {
  useEffect(() => {
    if (isAdminOrDevTraffic() || isLikelyBot()) {
      return;
    }

    function handleClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target : null;

      if (!target) {
        return;
      }

      const anchor = target.closest("a");

      if (anchor instanceof HTMLAnchorElement) {
        const analyticsEvent = getEventForAnchor(anchor);

        if (analyticsEvent) {
          queueAnalyticsEvent(analyticsEvent);
        }

        return;
      }

      const button = target.closest("button");

      if (button instanceof HTMLButtonElement) {
        const analyticsEvent = getEventForButton(button);

        if (analyticsEvent) {
          queueAnalyticsEvent(analyticsEvent);
        }
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        flushAnalyticsQueue({ allowVercelFallback: true });
      }
    }

    function handlePageHide() {
      flushAnalyticsQueue({ allowVercelFallback: true });
    }

    document.addEventListener("click", handleClick, { capture: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    const interval = window.setInterval(() => flushAnalyticsQueue(), FLUSH_INTERVAL_MS);
    flushAnalyticsQueue();

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.clearInterval(interval);
    };
  }, []);

  return null;
}
