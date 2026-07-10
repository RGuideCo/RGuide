"use client";

import type { DragEvent, ReactNode } from "react";

import { CATEGORY_STYLES } from "@/lib/constants";
import type { ListCategory } from "@/types";

import { GuideStopHeader } from "./GuideStopHeader";
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
  isHovered?: boolean;
  showAddAction?: boolean;
  isStopInItinerary?: boolean;
  isStopAddedToGuide?: boolean;
  animationDelay?: string;
  onHeaderActivate?: (stopId: string) => void;
  onAddStop?: () => void;
  editActions?: ReactNode;
  titleContent?: ReactNode;
  isEditing?: boolean;
  onReorderDragOver?: (event: DragEvent<HTMLElement>) => void;
  onReorderDrop?: (stopId: string) => void;
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
  isHovered = false,
  showAddAction = false,
  isStopInItinerary = false,
  isStopAddedToGuide = false,
  animationDelay,
  onHeaderActivate,
  onAddStop,
  editActions,
  titleContent,
  isEditing = false,
  onReorderDragOver,
  onReorderDrop,
  handlers,
  children,
}: GuideStopCardChromeProps) {
  const categoryStyle = CATEGORY_STYLES[category];
  const panelId = `guide-stop-panel-${listId}-${stop.id}`;

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
        onDragOver={isEditing ? onReorderDragOver : undefined}
        onDrop={
          isEditing
            ? (event) => {
                event.preventDefault();
                onReorderDrop?.(stop.id);
              }
            : undefined
        }
        data-active={isActive}
        data-hovered={isHovered}
        data-expanded={isExpanded}
        className="expanded-guide-stop-card"
        style={{ "--guide-accent": categoryStyle.mapColor } as GuideCardStyle}
      >
        <GuideStopHeader
          panelId={panelId}
          name={stop.name}
          index={index}
          eventTime={stop.eventTime}
          placeCount={stop.places?.length}
          price={stop.price}
          priceSource={stop.priceSource}
          showStopNumbers={showStopNumbers}
          isExpanded={isExpanded}
          isEditing={isEditing}
          isAddActive={isStopInItinerary || isStopAddedToGuide}
          showAddAction={showAddAction}
          titleContent={titleContent}
          editActions={editActions}
          onStopSelect={() => handlers.onStopSelect?.(stop.id)}
          onHeaderActivate={() => onHeaderActivate?.(stop.id) ?? handlers.onStopSelect?.(stop.id)}
          onHoverChange={(isHovered) => handlers.onStopHoverChange?.(isHovered ? stop.id : null)}
          onAddStop={onAddStop}
          onToggle={() => handlers.onStopToggle?.(stop.id)}
        />
        <div
          id={panelId}
          className="guide-stop-panel"
          data-stop-panel="stop"
          data-open={isExpanded ? "true" : "false"}
        >
          <div className="guide-stop-panel-inner">{children}</div>
        </div>
      </section>
    </li>
  );
}
