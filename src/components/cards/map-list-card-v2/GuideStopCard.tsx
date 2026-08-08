"use client";

import { CATEGORY_STYLES } from "@/lib/constants";

import { GuideStopBody } from "./GuideStopBody";
import { GuideStopCardChrome } from "./GuideStopCardChrome";
import { GuideStopMedia } from "./GuideStopMedia";
import { NestedPoiCard } from "./NestedPoiCard";
import type { GuideStopCardProps } from "./types";
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
  const stopPhoto = getPoiPhoto(stop.photo, stop.officialUrl, stop.id);

  return (
    <GuideStopCardChrome
      listId={list.id}
      stop={stop}
      index={index}
      totalStops={list.stops.length}
      category={category}
      isExpanded={isExpanded}
      isActive={isActive}
      isHovered={isHovered}
      handlers={handlers}
    >
      <GuideStopBody
        hasMedia={Boolean(stopPhoto)}
        media={
          stopPhoto ? (
            <GuideStopMedia
              name={stop.name}
              index={index}
              photo={stopPhoto}
              accentColor={categoryStyle.mapColor || accentColor}
              onSelect={() => handlers.onStopSelect?.(stop.id)}
              onOpenPhoto={() => handlers.onOpenPhoto?.({ src: stopPhoto, title: stop.name })}
            />
          ) : null
        }
        copy={
          <div className="expanded-poi-copy min-w-0">
            <p>{stop.description}</p>
          </div>
        }
        footer={children}
        nestedPlaces={
          stop.places?.length ? (
            <div className="expanded-guide-stop-nested-places">
              <div className="expanded-guide-stop-nested-heading">
                <p>POI</p>
                <div aria-hidden="true" />
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
          ) : null
        }
      />
    </GuideStopCardChrome>
  );
}
