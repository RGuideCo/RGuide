"use client";

import { ChevronDown } from "lucide-react";

import type { GuideCardChromeProps, GuideCardStyle } from "./types";

export function MapListCardShell({
  list,
  mode,
  expanded = false,
  fillPane = false,
  accentColor,
  titleMeta,
  children,
  actions,
  onToggleExpand,
  onHoverStart,
  onHoverEnd,
}: GuideCardChromeProps) {
  return (
    <article
      className={`map-list-card-v2 ${expanded ? "map-list-card-v2-expanded" : ""} ${
        fillPane ? "map-list-card-v2-fill-pane" : ""
      }`}
      data-guide-mode={mode}
      style={{ "--guide-accent": accentColor } as GuideCardStyle}
      onMouseEnter={() => onHoverStart?.(list)}
      onMouseLeave={onHoverEnd}
    >
      <header className="expanded-guide-header flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <h3 className="select-text text-lg font-semibold leading-6 text-slate-950">{list.title}</h3>
          <p className="mt-0.5 truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {titleMeta}
          </p>
        </div>
        {actions}
        <button
          type="button"
          onClick={() => onToggleExpand?.(list)}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-950/[0.04] hover:text-slate-900"
          aria-expanded={expanded}
          aria-label={`${expanded ? "Collapse" : "Expand"} ${list.title}`}
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </header>
      {children}
    </article>
  );
}
