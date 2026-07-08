"use client";

import { ChevronDown } from "@/components/icons/MaterialSymbol";

import { CATEGORY_STYLES } from "@/lib/constants";

import { NestedPoiCard } from "./NestedPoiCard";
import type { GuideCardStyle, GuideStopCardProps } from "./types";
import { getPoiPhoto } from "./utils";

export function GuideStopCard({
  list,
  stop,
  index,
  category,
  accentColor,
  isExpanded,
  isActive,
  isHovered,
  children,
  handlers,
}: GuideStopCardProps) {
  const categoryStyle = CATEGORY_STYLES[category];
  const stopPhoto = getPoiPhoto(stop.photo);

  return (
    <li id={`guide-stop-item-${list.id}-${stop.id}`} className="guide-content-cascade-item list-none">
      <section
        data-active={isActive}
        data-hovered={isHovered}
        data-expanded={isExpanded}
        className="expanded-guide-stop-card transition-[border-color,box-shadow,background-color] duration-150"
        style={{ "--guide-accent": categoryStyle.mapColor || accentColor } as GuideCardStyle}
        onMouseEnter={() => handlers.onStopHoverChange?.(stop.id)}
        onMouseLeave={() => handlers.onStopHoverChange?.(null)}
      >
        <div className="expanded-guide-stop-title-row flex w-full items-center gap-2 px-3 py-2.5 pl-4 text-left text-sm text-slate-700">
          <button
            type="button"
            onClick={() => handlers.onStopSelect?.(stop.id)}
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-xs font-semibold text-white shadow-sm transition hover:brightness-95"
            style={{ backgroundColor: categoryStyle.mapColor }}
            aria-label={`Select ${stop.name} on map`}
          >
            {index + 1}
          </button>
          <button
            type="button"
            onClick={() => handlers.onStopSelect?.(stop.id)}
            className="min-w-0 flex-1 select-text text-left text-base font-semibold leading-5 text-slate-900"
          >
            {stop.name}
          </button>
          {stop.price ? (
            <span className="rounded-md bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-950/10">
              {stop.price}
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => handlers.onStopToggle?.(stop.id)}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-950/[0.04] hover:text-slate-600"
            aria-expanded={isExpanded}
            aria-controls={`guide-stop-panel-${list.id}-${stop.id}`}
            aria-label={`${isExpanded ? "Collapse" : "Expand"} ${stop.name}`}
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>
        </div>
        <div
          id={`guide-stop-panel-${list.id}-${stop.id}`}
          className={`guide-stop-panel grid transition-[grid-template-rows,opacity] duration-150 ease-out ${
            isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="expanded-guide-stop-body border-t border-slate-950/10 px-4 py-3">
              <div className={`expanded-poi-bio ${stopPhoto ? "" : "expanded-poi-bio-no-photo"}`}>
                {stopPhoto ? (
                  <button
                    type="button"
                    onClick={() => handlers.onOpenPhoto?.({ src: stopPhoto, title: stop.name })}
                    className="expanded-poi-bio-photo"
                    aria-label={`Open photo of ${stop.name}`}
                  >
                    <img src={stopPhoto} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </button>
                ) : null}
                <div className="expanded-poi-copy min-w-0">
                  <p>{stop.description}</p>
                </div>
              </div>
              {stop.places?.length ? (
                <div className="mt-3">
                  <div className="mb-2 flex items-center gap-2">
                    <p className="ml-[3.75rem] font-mono text-[10px] font-semibold uppercase text-slate-500">POI</p>
                    <div className="h-px flex-1 bg-slate-950/10" />
                  </div>
                  <div className="space-y-2">
                    {stop.places.map((place, placeIndex) => (
                      <NestedPoiCard
                        key={place.id}
                        place={place}
                        parentStopId={stop.id}
                        index={placeIndex}
                        category={category}
                        isExpanded={false}
                        isActive={false}
                        handlers={handlers}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
              {children}
            </div>
          </div>
        </div>
      </section>
    </li>
  );
}
