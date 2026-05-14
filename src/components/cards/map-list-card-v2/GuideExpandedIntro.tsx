"use client";

import type { ReactNode } from "react";

import type { MapList } from "@/types";

interface GuideExpandedIntroProps {
  list: MapList;
  sourceAction?: ReactNode;
}

export function GuideExpandedIntro({ list, sourceAction }: GuideExpandedIntroProps) {
  const dateRange = [list.itinerary?.startDate ?? list.journey?.startDate, list.itinerary?.endDate ?? list.journey?.endDate]
    .filter(Boolean)
    .join(" to ");

  return (
    <>
      <div className="guide-content-cascade-item relative z-10 flex items-center gap-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
          Description
        </p>
        {sourceAction}
      </div>
      {dateRange ? (
        <p
          className="guide-content-cascade-item relative z-10 mt-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500"
          style={{ animationDelay: "35ms" }}
        >
          {dateRange}
        </p>
      ) : null}
      <p
        className="guide-content-cascade-item expanded-guide-description relative z-10 mt-2 px-4"
        style={{ animationDelay: "45ms" }}
      >
        {list.description}
      </p>
      {list.highlights?.length ? (
        <div
          className="guide-content-cascade-item relative z-10 mt-3 rounded-2xl border border-slate-200 bg-white px-3 py-3"
          style={{ animationDelay: "55ms" }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Highlights
          </p>
          <ul className="mt-2 space-y-1.5">
            {list.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-2 text-sm leading-5 text-slate-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" aria-hidden="true" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
