import type { CSSProperties, ReactNode } from "react";

import type { ListCategory, MapList } from "@/types";

export type GuideStopItem = MapList["stops"][number];
export type GuideSource = NonNullable<MapList["sources"]>[number];

export type GuideCardMode = "guide" | "journey" | "event";

export interface GuideStopSelectionState {
  expandedStopIds: string[];
  expandedPlaceIds: string[];
  activeStopId?: string | null;
  hoveredStopId?: string | null;
}

export interface GuideStopHandlers {
  onStopToggle?: (stopId: string) => void;
  onPlaceToggle?: (placeId: string) => void;
  onPlaceHeaderActivate?: (placeId: string) => void;
  onStopSelect?: (stopId: string) => void;
  onNestedStopSelect?: (stopId: string, parentStopId: string) => void;
  onStopHoverChange?: (stopId: string | null) => void;
  onOpenPhoto?: (photo: { src: string; title: string }) => void;
}

export interface GuideCardChromeProps {
  list: MapList;
  mode: GuideCardMode;
  expanded?: boolean;
  fillPane?: boolean;
  accentColor: string;
  titleMeta: string;
  children: ReactNode;
  actions?: ReactNode;
  onToggleExpand?: (list: MapList) => void;
  onHoverStart?: (list: MapList) => void;
  onHoverEnd?: () => void;
}

export interface GuideBodyProps {
  list: MapList;
  accentColor: string;
  activeStopId?: string | null;
  stopSelection: GuideStopSelectionState;
  stopHandlers: GuideStopHandlers;
  deferStops?: boolean;
}

export interface GuideStopCardProps {
  list: MapList;
  stop: GuideStopItem;
  index: number;
  category: ListCategory;
  accentColor: string;
  isExpanded: boolean;
  isActive: boolean;
  isHovered?: boolean;
  children?: ReactNode;
  handlers: GuideStopHandlers;
}

export interface NestedPoiCardProps {
  place: GuideStopItem;
  parentStopId: string;
  index: number;
  category: ListCategory;
  isExpanded: boolean;
  isActive: boolean;
  attributeTags?: string[];
  handlers: GuideStopHandlers;
}

export type GuideCardStyle = CSSProperties & {
  "--guide-accent"?: string;
  "--guide-poi-accent"?: string;
};
