"use client";

import type { ReactNode } from "react";

import { GuideCardBody } from "./GuideCardBody";
import type { GuideBodyProps } from "./types";

type ProductionEventCardBodyProps = Partial<GuideBodyProps> & {
  children?: ReactNode;
};

export function EventCardBody({ children, ...props }: ProductionEventCardBodyProps) {
  if (children) {
    return (
      <div className="contents" data-guide-card-body="event">
        {children}
      </div>
    );
  }

  return (
    <div>
      <p className="px-8 pt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Event schedule
      </p>
      <GuideCardBody {...props} />
    </div>
  );
}
