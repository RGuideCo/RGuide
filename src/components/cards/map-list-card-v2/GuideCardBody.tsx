"use client";

import type { ReactNode } from "react";

import { CATEGORY_STYLES } from "@/lib/constants";

import { GuidePhotoStrip } from "./GuidePhotoStrip";
import { GuideSourceRow } from "./GuideSourceRow";
import { GuideStopCard } from "./GuideStopCard";
import type { GuideBodyProps } from "./types";

type ProductionGuideCardBodyProps = Partial<GuideBodyProps> & {
  children?: ReactNode;
};

export function GuideCardBody({
  list,
  accentColor = "",
  activeStopId,
  stopSelection,
  stopHandlers,
  deferStops,
  children,
}: ProductionGuideCardBodyProps) {
  if (children) {
    return (
      <div className="contents" data-guide-card-body="guide">
        {children}
      </div>
    );
  }

  if (!list || !stopSelection || !stopHandlers) {
    return null;
  }

  return (
    <div className="expanded-guide-content px-4 pb-4">
      <p className="expanded-guide-description relative z-10 mt-2 px-4">{list.description}</p>
      <GuidePhotoStrip
        stops={list.stops}
        activeStopId={activeStopId}
        fallbackCategory={list.category}
        handlers={stopHandlers}
      />
      <GuideSourceRow listId={list.id} sources={list.sources ?? []} />
      {!deferStops ? (
        <ol className="relative z-10 mt-2 grid gap-2">
          {list.stops.map((stop, index) => {
            const stopCategory = stop.category ?? list.category;
            return (
              <GuideStopCard
                key={stop.id}
                list={list}
                stop={stop}
                index={index}
                category={stopCategory}
                accentColor={CATEGORY_STYLES[stopCategory].mapColor || accentColor}
                isExpanded={stopSelection.expandedStopIds.includes(stop.id)}
                isActive={activeStopId === stop.id}
                isHovered={stopSelection.hoveredStopId === stop.id}
                handlers={stopHandlers}
              />
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}
