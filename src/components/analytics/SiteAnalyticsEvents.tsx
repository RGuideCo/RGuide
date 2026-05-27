"use client";

import { track } from "@vercel/analytics";
import { useEffect } from "react";

const MAX_TEXT_LENGTH = 80;

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
      name: "affiliate_click",
      properties: {
        ...baseProperties,
        affiliate: "stay22",
        ...getStay22Params(url),
      },
    };
  }

  if (!isInternal) {
    return {
      name: "outbound_click",
      properties: baseProperties,
    };
  }

  if (url.pathname.startsWith("/city/") || url.pathname.startsWith("/list/")) {
    return {
      name: "guide_link_click",
      properties: baseProperties,
    };
  }

  return {
    name: "internal_link_click",
    properties: baseProperties,
  };
}

function getEventForButton(button: HTMLButtonElement) {
  const text = getLinkText(button);

  if (!text) {
    return null;
  }

  return {
    name: "button_click",
    properties: {
      currentPath: getCurrentPath(),
      buttonText: text,
      buttonLabel: truncate(button.getAttribute("aria-label") || ""),
    },
  };
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
          track(analyticsEvent.name, analyticsEvent.properties);
        }

        return;
      }

      const button = target.closest("button");

      if (button instanceof HTMLButtonElement) {
        const analyticsEvent = getEventForButton(button);

        if (analyticsEvent) {
          track(analyticsEvent.name, analyticsEvent.properties);
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
