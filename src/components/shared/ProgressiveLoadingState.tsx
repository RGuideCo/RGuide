"use client";

import { useLayoutEffect } from "react";

const HYDRATION_TIMEOUT_MS = 8000;

export function ProgressiveLoadingState() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.remove("rguide-split-screen-ready", "rguide-hydration-timeout");

    const timeoutId = window.setTimeout(() => {
      if (!root.classList.contains("rguide-split-screen-ready")) {
        root.classList.add("rguide-hydration-timeout");
      }
    }, HYDRATION_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return null;
}
