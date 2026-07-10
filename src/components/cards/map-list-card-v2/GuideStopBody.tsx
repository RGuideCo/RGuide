"use client";

import type { ReactNode } from "react";

interface GuideStopBodyProps {
  hasMedia: boolean;
  media?: ReactNode;
  copy?: ReactNode;
  footer?: ReactNode;
  nestedPlaces?: ReactNode;
}

/** Shared visual frame for an expanded venue stop. State stays with the guide card. */
export function GuideStopBody({ hasMedia, media, copy, footer, nestedPlaces }: GuideStopBodyProps) {
  return (
    <div className="expanded-guide-stop-body">
      <div className={`expanded-poi-bio ${hasMedia ? "" : "expanded-poi-bio-no-photo"}`}>
        {hasMedia ? <div className="expanded-poi-photo-frame">{media}</div> : null}
        <div className="expanded-poi-panel min-w-0">
          {copy}
          {footer}
        </div>
      </div>
      {nestedPlaces}
    </div>
  );
}
