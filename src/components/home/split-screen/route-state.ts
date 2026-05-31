import { useRef, useState } from "react";

import { getDefaultSelection } from "@/components/home/split-screen-config";
import type { CityDeepLinkState } from "@/lib/deep-link-routes";
import type { Continent, ListCategory, SelectionState } from "@/types";

export function useRouteState({
  continents,
  initialRouteState,
}: {
  continents: Continent[];
  initialRouteState?: CityDeepLinkState;
}) {
  const [selection, setSelection] = useState<SelectionState>(() => initialRouteState?.selection ?? getDefaultSelection(continents));
  const [focusedCountrySignal, setFocusedCountrySignal] = useState<{
    countryId: string;
    nonce: number;
  } | null>(null);
  const [activeCategory, setActiveCategory] = useState<ListCategory | null>(initialRouteState?.activeCategory ?? null);
  const [continentBrowseView, setContinentBrowseView] = useState<"countries" | "regions">("countries");
  const [countryBrowseView, setCountryBrowseView] = useState<"cities" | "regions">("cities");
  const [stateBrowseView, setStateBrowseView] = useState<"cities" | "regions">("cities");
  const [regionBrowseView, setRegionBrowseView] = useState<"cities" | "states">("cities");

  const initialRouteStateKey = JSON.stringify(initialRouteState ?? null);
  const selectionRef = useRef(selection);
  const activeCategoryRef = useRef(activeCategory);
  const skipInitialSelectionCleanupRef = useRef(Boolean(initialRouteState?.expandedGuideId));

  return {
    selection,
    setSelection,
    focusedCountrySignal,
    setFocusedCountrySignal,
    activeCategory,
    setActiveCategory,
    continentBrowseView,
    setContinentBrowseView,
    countryBrowseView,
    setCountryBrowseView,
    stateBrowseView,
    setStateBrowseView,
    regionBrowseView,
    setRegionBrowseView,
    initialRouteStateKey,
    selectionRef,
    activeCategoryRef,
    skipInitialSelectionCleanupRef,
  };
}
