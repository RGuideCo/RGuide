"use client";

import { ChevronDown } from "@/components/icons/MaterialSymbol";

import { CATEGORY_STYLES } from "@/lib/constants";

import type { GuideCardStyle, NestedPoiCardProps } from "./types";
import { getAlphaMarker, getPoiPhoto } from "./utils";

const NESTED_POI_DIAMOND_FILL = "#c2410c";

export function NestedPoiCard({
  place,
  parentStopId,
  index,
  category,
  isExpanded,
  isActive,
  attributeTags = [],
  handlers,
}: NestedPoiCardProps) {
  const categoryStyle = CATEGORY_STYLES[place.category ?? category];
  const placePhoto = getPoiPhoto(place.photo);

  return (
    <div
      data-active={isActive}
      data-expanded={isExpanded}
      className="expanded-guide-place-card ml-5 flex items-start gap-2 px-3 py-2 pl-3.5 transition-[border-color,background-color] duration-150 sm:ml-7"
      style={{ "--guide-poi-accent": categoryStyle.poiColor } as GuideCardStyle}
      onMouseEnter={() => handlers.onStopHoverChange?.(place.id)}
      onMouseLeave={() => handlers.onStopHoverChange?.(null)}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          if (handlers.onNestedStopSelect) {
            handlers.onNestedStopSelect(place.id, parentStopId);
            return;
          }
          handlers.onStopSelect?.(place.id);
        }}
        onFocus={() => handlers.onStopHoverChange?.(place.id)}
        onBlur={() => handlers.onStopHoverChange?.(null)}
        className="mt-0.5 inline-flex h-5 w-5 shrink-0 rotate-45 items-center justify-center rounded-[5px] border-2 font-mono text-[10px] font-semibold text-white shadow-sm"
        style={{
          backgroundColor: NESTED_POI_DIAMOND_FILL,
          borderColor: categoryStyle.mapColor,
        }}
        aria-label={`Select ${place.name} on map`}
        title={`Select ${place.name} on map`}
      >
        <span className="-rotate-45">{getAlphaMarker(index)}</span>
      </button>
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex min-h-5 w-full items-center gap-2 text-left">
          <div
            role="button"
            tabIndex={0}
            onClick={() => handlers.onPlaceHeaderActivate?.(place.id) ?? handlers.onPlaceToggle?.(place.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handlers.onPlaceToggle?.(place.id);
              }
            }}
            className="min-w-0 flex-1 cursor-pointer select-text"
            aria-expanded={isExpanded}
          >
            <span className="min-w-0 flex-1 text-[0.95rem] font-semibold leading-5 text-slate-900">{place.name}</span>
          </div>
          <button
            type="button"
            onClick={() => handlers.onPlaceToggle?.(place.id)}
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
            aria-label={`${isExpanded ? "Collapse" : "Expand"} ${place.name}`}
          >
            <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>
        </div>
        <div className="guide-stop-panel" data-stop-panel="nested" data-open={isExpanded ? "true" : "false"}>
          <div className="guide-stop-panel-inner">
            <div className={`expanded-poi-bio expanded-poi-bio-place pb-1 ${placePhoto ? "" : "expanded-poi-bio-no-photo"}`}>
              {placePhoto ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handlers.onOpenPhoto?.({ src: placePhoto, title: place.name });
                  }}
                  className="expanded-poi-bio-photo expanded-poi-bio-photo-place"
                  aria-label={`Open photo of ${place.name}`}
                  title={`Open photo of ${place.name}`}
                >
                  <img src={placePhoto} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </button>
              ) : null}
              <div className="expanded-poi-copy expanded-poi-copy-place min-w-0">
                <p>{place.description}</p>
                {attributeTags.length ? (
                  <div className="expanded-poi-tags" aria-label={`${place.name} attributes`}>
                    {attributeTags.map((tag) => (
                      <span key={`${place.id}-tag-${tag}`}>{tag}</span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
