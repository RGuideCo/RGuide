"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { getCreatorHref } from "@/lib/routes";
import type { MapList } from "@/types";

interface GuideExpandedIntroProps {
  list: MapList;
  sourceAction?: ReactNode;
  afterDescription?: ReactNode;
  isEditing?: boolean;
  onDescriptionChange?: (description: string) => void;
}

export function GuideExpandedIntro({
  list,
  sourceAction,
  afterDescription,
  isEditing = false,
  onDescriptionChange,
}: GuideExpandedIntroProps) {
  const dateRange = [list.itinerary?.startDate ?? list.journey?.startDate, list.itinerary?.endDate ?? list.journey?.endDate]
    .filter(Boolean)
    .join(" to ");

  return (
    <>
      <div className="guide-content-cascade-item guide-expanded-intro-row relative z-10 flex items-center gap-3">
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
      {isEditing ? (
        <textarea
          key={`${list.id}-description-${list.description}`}
          defaultValue={list.description}
          rows={3}
          onClick={(event) => event.stopPropagation()}
          onBlur={(event) => onDescriptionChange?.(event.currentTarget.value)}
          onKeyDown={(event) => event.stopPropagation()}
          className="guide-content-cascade-item expanded-guide-description relative z-10 mt-2 w-full resize-y rounded-md border border-slate-950/10 bg-white/85 px-4 py-3 text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
          style={{ animationDelay: "45ms" }}
          aria-label="Edit guide description"
        />
      ) : (
        <p
          className="guide-content-cascade-item expanded-guide-description relative z-10 mt-2 px-4"
          style={{ animationDelay: "45ms" }}
        >
          {list.description}
        </p>
      )}
      {list.routeLegend ? (
        <div
          className="guide-content-cascade-item relative z-10 mt-3 flex items-center gap-3 px-4"
          style={{ animationDelay: "48ms" }}
          aria-label={[list.routeLegend.label, list.routeLegend.dateRange].filter(Boolean).join(", ")}
        >
          <span className="w-12 shrink-0 border-t-2 border-dashed border-blue-600 sm:w-16" aria-hidden="true" />
          <span className="flex min-w-0 flex-wrap items-baseline gap-x-2 text-xs leading-4 text-slate-600">
            <span className="font-semibold text-slate-800">{list.routeLegend.label}</span>
            {list.routeLegend.dateRange ? (
              <span className="text-slate-500">{list.routeLegend.dateRange}</span>
            ) : null}
          </span>
        </div>
      ) : null}
      {afterDescription}
      <Link
        href={getCreatorHref({ name: list.creator.name })}
        className="guide-content-cascade-item relative z-10 mt-2 block px-4 text-sm font-bold text-slate-900 lg:hidden"
        style={{ animationDelay: "50ms" }}
      >
        <span className="mr-1 text-slate-400">-</span>
        {list.creator.name}
      </Link>
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
