import type { ReactNode } from "react";

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
      <div className="rguide-progressive-fallback">{fallback}</div>
      <div className="rguide-progressive-interactive">{children}</div>
    </>
  );
}
