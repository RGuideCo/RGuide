import { useRef, useState } from "react";

import type { CityDeepLinkState } from "@/lib/deep-link-routes";
import type { ListCategory, MapList } from "@/types";

export function useGuideRailState({ initialRouteState }: { initialRouteState?: CityDeepLinkState }) {
  const [activeGuideRail, setActiveGuideRail] = useState<"all-guides" | "week-events" | "itinerary" | null>("all-guides");
  const [activeGuideSource, setActiveGuideSource] = useState<"all-guides" | "r-guides" | "user-guides" | "favorites">("all-guides");
  const [isLocationFavoritesRailActive, setIsLocationFavoritesRailActive] = useState(false);
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>(initialRouteState?.expandedGuideId ?? null);
  const [pendingSourcesOpenGuideId, setPendingSourcesOpenGuideId] = useState<string | null>(null);
  const [closingGuide, setClosingGuide] = useState<MapList | null>(null);
  const [closingGuidePhase, setClosingGuidePhase] = useState<"precollapsing" | "returning" | "collapsing" | null>(null);
  const [openingGuideId, setOpeningGuideId] = useState<string | null>(null);
  const [settlingGuideContentId, setSettlingGuideContentId] = useState<string | null>(
    initialRouteState?.expandedGuideId ?? null,
  );

  const expandedGuideIdRef = useRef(expandedGuideId);
  const skipInitialGuideRailCleanupRef = useRef(Boolean(initialRouteState?.expandedGuideId));
  const categoryBeforeGuideExpandRef = useRef<{
    captured: boolean;
    category: ListCategory | null;
  }>({
    captured: Boolean(initialRouteState?.expandedGuideId),
    category: null,
  });

  const clearCategoryBeforeGuideExpand = () => {
    categoryBeforeGuideExpandRef.current = { captured: false, category: null };
  };

  const captureCategoryBeforeGuideExpand = (category: ListCategory | null) => {
    categoryBeforeGuideExpandRef.current = { captured: true, category };
  };

  return {
    activeGuideRail,
    setActiveGuideRail,
    activeGuideSource,
    setActiveGuideSource,
    isLocationFavoritesRailActive,
    setIsLocationFavoritesRailActive,
    expandedGuideId,
    setExpandedGuideId,
    pendingSourcesOpenGuideId,
    setPendingSourcesOpenGuideId,
    closingGuide,
    setClosingGuide,
    closingGuidePhase,
    setClosingGuidePhase,
    openingGuideId,
    setOpeningGuideId,
    settlingGuideContentId,
    setSettlingGuideContentId,
    expandedGuideIdRef,
    skipInitialGuideRailCleanupRef,
    categoryBeforeGuideExpandRef,
    clearCategoryBeforeGuideExpand,
    captureCategoryBeforeGuideExpand,
  };
}
