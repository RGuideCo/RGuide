"use client";

import { Fragment, type ReactNode } from "react";

import { GuidePhotoStrip } from "./GuidePhotoStrip";
import { GuideSourceRow } from "./GuideSourceRow";
import { GuideStopCard } from "./GuideStopCard";
import type { GuideBodyProps } from "./types";
import { formatJourneyDayLabel, getJourneyDateKey, inferJourneyStopCategory } from "./utils";

type ProductionJourneyCardBodyProps = Partial<GuideBodyProps> & {
  children?: ReactNode;
};

export function JourneyCardBody({
  list,
  accentColor = "",
  activeStopId,
  stopSelection,
  stopHandlers,
  deferStops,
  children,
}: ProductionJourneyCardBodyProps) {
  if (children) {
    return (
      <div className="contents" data-guide-card-body="journey">
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
            const dateKey = getJourneyDateKey(list, stop, index);
            const previousDateKey = index > 0 ? getJourneyDateKey(list, list.stops[index - 1], index - 1) : "";
            const shouldShowDay = dateKey !== previousDateKey;
            const stopCategory = inferJourneyStopCategory(stop, list.category);

            return (
              <Fragment key={stop.id}>
                {shouldShowDay ? (
                  <li className="guide-content-cascade-item list-none pt-2 first:pt-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white" style={{ backgroundColor: accentColor }}>
                        {formatJourneyDayLabel(dateKey, index)}
                      </span>
                      <div className="h-px flex-1 bg-slate-200" />
                    </div>
                  </li>
                ) : null}
                <GuideStopCard
                  list={list}
                  stop={stop}
                  index={index}
                  category={stopCategory}
                  accentColor={accentColor}
                  isExpanded={stopSelection.expandedStopIds.includes(stop.id)}
                  isActive={activeStopId === stop.id}
                  isHovered={stopSelection.hoveredStopId === stop.id}
                  handlers={stopHandlers}
                />
              </Fragment>
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}
