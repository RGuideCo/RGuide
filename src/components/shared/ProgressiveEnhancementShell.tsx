import type { ReactNode } from "react";

import { ProgressiveLoadingState } from "@/components/shared/ProgressiveLoadingState";

interface ProgressiveEnhancementShellProps {
  fallback: ReactNode;
  children: ReactNode;
}

export function ProgressiveEnhancementShell({ fallback, children }: ProgressiveEnhancementShellProps) {
  return (
    <>
      <noscript>
        <style>
          {`
            .rguide-progressive-fallback {
              display: block !important;
            }

            .rguide-progressive-interactive {
              display: none !important;
            }
          `}
        </style>
      </noscript>
      <div className="rguide-progressive-shell">
        <ProgressiveLoadingState />
        <div className="rguide-progressive-loading" aria-hidden="true">
          <div className="rguide-progressive-loading-mark">R</div>
          <div className="rguide-progressive-loading-copy">
            <span>RGuide</span>
            <span>Curating the map</span>
          </div>
        </div>
        <div className="rguide-progressive-fallback">{fallback}</div>
        <div className="rguide-progressive-interactive">{children}</div>
      </div>
    </>
  );
}
