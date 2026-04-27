"use client";

import dynamic from "next/dynamic";

import { Continent, MapList, SelectionState } from "@/types";

const DynamicMapClient = dynamic(
  () => import("@/components/map/MapClient").then((module) => module.MapClient),
  {
    ssr: false,
    loading: () => <div className="min-h-[60vh] animate-pulse bg-slate-200/70 lg:min-h-[calc(100vh-15rem)]" />,
  },
);

interface InteractiveMapProps {
  continents: Continent[];
  selection: SelectionState;
  focusedCountryId?: string | null;
  focusedCountryNonce?: number;
  highlightedCountryIds?: string[];
  viewportMode?: "full" | "center" | "submit";
  viewportInsets?: { top: number; right: number; bottom: number; left: number };
  resizeSignal?: number;
  guideFocus?: MapList | null;
  activeGuide?: MapList | null;
  activeGuideFitNonce?: number;
  visibleNestedStopParentIds?: string[];
  hoveredStopId?: string | null;
  onHoverGuideStop?: (stopId: string | null) => void;
  onSelectGuideStop?: (stopId: string) => void;
  onSubmitMapClick?: (coordinates: [number, number]) => void;
  onSelectContinent: (continentId: string) => void;
  onSelectCountry: (continentId: string, countryId: string) => void;
  onSelectCity: (continentId: string, countryId: string, cityId: string) => void;
  onSelectSubarea?: (
    continentId: string,
    countryId: string,
    cityId: string,
    subareaId: string,
  ) => void;
  onSelectState?: (
    continentId: string,
    countryId: string,
    countrySubareaId: string,
    stateId: string,
  ) => void;
}

export function InteractiveMap(props: InteractiveMapProps) {
  return <DynamicMapClient {...props} />;
}
