"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { CATEGORY_STYLES } from "@/lib/constants";
import type { ListCategory } from "@/types";

import type { GuideCardStyle, GuideStopHandlers, GuideStopItem } from "./types";

interface GuideStopCardChromeProps {
  listId: string;
  stop: GuideStopItem;
  index: number;
  totalStops: number;
  category: ListCategory;
  showStopNumbers?: boolean;
  isExpanded: boolean;
  isActive: boolean;
  animationDelay?: string;
  onHeaderActivate?: (stopId: string) => void;
  handlers: GuideStopHandlers;
  children: ReactNode;
}

export function GuideStopCardChrome({
  listId,
  stop,
  index,
  totalStops,
  category,
  showStopNumbers = true,
  isExpanded,
  isActive,
  animationDelay,
  onHeaderActivate,
  handlers,
  children,
}: GuideStopCardChromeProps) {
  const categoryStyle = CATEGORY_STYLES[category];

  return (
    <li
      id={`guide-stop-item-${listId}-${stop.id}`}
      className="guide-content-cascade-item list-none"
      style={{ animationDelay }}
    >
      {index === totalStops - 1 ? (
        <span id={`guide-stop-top-${listId}-${stop.id}`} className="block h-0" aria-hidden="true" />
      ) : null}
      <section
        onMouseEnter={() => handlers.onStopHoverChange?.(stop.id)}
        onMouseLeave={() => handlers.onStopHoverChange?.(null)}
        data-active={isActive}
        data-expanded={isExpanded}
        className="expanded-guide-stop-card transition-[border-color,box-shadow,background-color] duration-150"
        style={{ "--guide-accent": categoryStyle.mapColor } as GuideCardStyle}
      >
        <div className="expanded-guide-stop-title-row flex w-full items-center gap-2 px-3 py-2.5 pl-4 text-left text-sm text-slate-700">
          {showStopNumbers ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handlers.onStopSelect?.(stop.id);
              }}
              onFocus={() => handlers.onStopHoverChange?.(stop.id)}
              onBlur={() => handlers.onStopHoverChange?.(null)}
              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-xs font-semibold text-white shadow-sm transition hover:brightness-95 focus-visible:ring-2 focus-visible:ring-slate-400/50"
              style={{ backgroundColor: categoryStyle.mapColor }}
              aria-label={`Select ${stop.name} on map`}
              title={`Select ${stop.name} on map`}
            >
              {index + 1}
            </button>
          ) : (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handlers.onStopSelect?.(stop.id);
              }}
              onFocus={() => handlers.onStopHoverChange?.(stop.id)}
              onBlur={() => handlers.onStopHoverChange?.(null)}
              className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: categoryStyle.mapColor }}
              aria-label={`Select ${stop.name} on map`}
              title={`Select ${stop.name} on map`}
            />
          )}
          <div
            role="button"
            tabIndex={0}
            onClick={() => onHeaderActivate?.(stop.id) ?? handlers.onStopSelect?.(stop.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handlers.onStopSelect?.(stop.id);
              }
            }}
            onFocus={() => handlers.onStopHoverChange?.(stop.id)}
            onBlur={() => handlers.onStopHoverChange?.(null)}
            className="flex min-w-0 flex-1 cursor-pointer select-text items-center gap-2 text-left"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-base font-semibold leading-5 text-slate-900">{stop.name}</span>
              {stop.eventTime ? (
                <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500">
                  {stop.eventTime}
                </span>
              ) : null}
            </span>
            {stop.price ? (
              <span
                title={stop.priceSource ? `Price source: ${stop.priceSource}` : "Restaurant price tier"}
                className="rounded-md bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-950/10"
              >
                {stop.price}
              </span>
            ) : null}
            {stop.places?.length ? (
              <span className="rounded-md bg-slate-950/[0.04] px-2 py-0.5 text-[10px] font-medium uppercase text-slate-600 ring-1 ring-slate-950/[0.04]">
                {stop.places.length} places
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => handlers.onStopToggle?.(stop.id)}
            onFocus={() => handlers.onStopHoverChange?.(stop.id)}
            onBlur={() => handlers.onStopHoverChange?.(null)}
            aria-expanded={isExpanded}
            aria-controls={`guide-stop-panel-${listId}-${stop.id}`}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-950/[0.04] hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-slate-300"
            aria-label={`${isExpanded ? "Collapse" : "Expand"} ${stop.name}`}
            title={`${isExpanded ? "Collapse" : "Expand"} ${stop.name}`}
          >
            <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>
        </div>
        <div
          id={`guide-stop-panel-${listId}-${stop.id}`}
          className={`guide-stop-panel grid transition-[grid-template-rows,opacity] duration-150 ease-out ${
            isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">{children}</div>
        </div>
      </section>
    </li>
  );
}
