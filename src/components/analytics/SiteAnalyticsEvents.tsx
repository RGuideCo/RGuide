"use client";

import { useEffect } from "react";

const MAX_TEXT_LENGTH = 80;
const ANALYTICS_SESSION_KEY = "rguide_analytics_session_id";

type AnalyticsEvent = {
  eventType: string;
  properties: Record<string, string | undefined>;
};

function truncate(value: string, maxLength = MAX_TEXT_LENGTH) {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1)}...` : normalized;
}

function getCurrentPath() {
  return `${window.location.pathname}${window.location.search}`;
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
  const baseProperties = {
    currentPath,
    destinationHost: url.hostname,
    destinationPath: truncate(destinationPath, 160),
    linkText: getLinkText(anchor),
    ...routeParts,
  };

  if (isStay22) {
    return {
      eventType: "affiliate_click",
      properties: {
        ...baseProperties,
        affiliate: "stay22",
        ...getStay22Params(url),
      },
    };
  }

  if (!isInternal) {
    return {
      eventType: "outbound_click",
      properties: baseProperties,
    };
  }

  if (url.pathname.startsWith("/city/") || url.pathname.startsWith("/list/")) {
    return {
      eventType: "guide_link_click",
      properties: baseProperties,
    };
  }

  return {
    eventType: "internal_link_click",
    properties: baseProperties,
  };
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
  };
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

function sendAnalyticsEvent(analyticsEvent: AnalyticsEvent) {
  const payload = JSON.stringify({
    ...analyticsEvent,
    sessionId: getSessionId(),
    referrer: document.referrer || undefined,
  });

  if (navigator.sendBeacon) {
    const sent = navigator.sendBeacon(
      "/api/analytics/click",
      new Blob([payload], { type: "application/json" }),
    );

    if (sent) {
      return;
    }
  }

  void fetch("/api/analytics/click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}

export function SiteAnalyticsEvents() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target : null;

      if (!target) {
        return;
      }

      const anchor = target.closest("a");

      if (anchor instanceof HTMLAnchorElement) {
        const analyticsEvent = getEventForAnchor(anchor);

        if (analyticsEvent) {
          sendAnalyticsEvent(analyticsEvent);
        }

        return;
      }

      const button = target.closest("button");

      if (button instanceof HTMLButtonElement) {
        const analyticsEvent = getEventForButton(button);

        if (analyticsEvent) {
          sendAnalyticsEvent(analyticsEvent);
        }
      }
    }

    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  return null;
}
