"use client";

import type { CSSProperties } from "react";

import { CATEGORY_STYLES } from "@/lib/constants";
import { ResponsiveR2Image } from "@/components/media/ResponsiveR2Image";
import type { ListCategory } from "@/types";

import type { GuideCardStyle, GuideStopHandlers, GuideStopItem } from "./types";
import { getAlphaMarker, getPoiPhoto } from "./utils";

interface GuidePhotoStripProps {
  stops: GuideStopItem[];
  title?: string;
  activeStopId?: string | null;
  hoveredStopId?: string | null;
  fallbackCategory: ListCategory;
  getStopCategory?: (stop: GuideStopItem, index: number) => ListCategory;
  handlers: GuideStopHandlers;
  style?: CSSProperties;
}

export function GuidePhotoStrip({
  stops,
  title = "Places of Interest",
  activeStopId,
  hoveredStopId,
  fallbackCategory,
  getStopCategory,
  handlers,
  style,
}: GuidePhotoStripProps) {
  if (!stops.length) {
    return null;
  }

  return (
    <div className="guide-content-cascade-item guide-photo-strip-block relative z-10 mt-3" style={style} aria-label="POI photos">
      <div className="mb-2 flex items-center gap-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">{title}</p>
        <div className="h-px flex-1 bg-slate-200" aria-hidden="true" />
      </div>
      <div className="ordered-poi-photo-strip">
        {stops.map((stop, index) => {
          const stopPhoto = getPoiPhoto(stop.photo);
          const stopCategory = getStopCategory?.(stop, index) ?? stop.category ?? fallbackCategory;
          const categoryStyle = CATEGORY_STYLES[stopCategory];
          const isActive = activeStopId === stop.id || Boolean(stop.places?.some((place) => place.id === activeStopId));
          const isHovered = hoveredStopId === stop.id || Boolean(stop.places?.some((place) => place.id === hoveredStopId));

          return (
            <button
              key={stop.id}
              type="button"
              onClick={() => handlers.onStopSelect?.(stop.id)}
              onMouseEnter={() => handlers.onStopHoverChange?.(stop.id)}
              onMouseLeave={() => handlers.onStopHoverChange?.(null)}
              className={`ordered-poi-photo ${isActive ? "ordered-poi-photo-active" : ""} ${
                isHovered ? "ordered-poi-photo-hovered" : ""
              }`}
              style={{ "--guide-accent": categoryStyle.mapColor } as GuideCardStyle}
              aria-label={`Open ${stop.name}`}
              title={stop.name}
            >
              {stopPhoto ? (
                <ResponsiveR2Image
                  src={stopPhoto}
                  sizes="60px"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="ordered-poi-photo-fallback" aria-hidden="true">
                  {getAlphaMarker(index)}
                </span>
              )}
              <span className="ordered-poi-photo-index">{index + 1}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
