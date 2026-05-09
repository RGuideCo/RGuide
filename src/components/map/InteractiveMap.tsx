"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import type { Continent, MapList, SelectionState } from "@/types";

type SavedMapLocation = {
  id: string;
  kind: "continent" | "country" | "city" | "neighborhood";
  selection: SelectionState;
};

const DynamicMapClient = dynamic(
  () => import("@/components/map/MapClient").then((module) => module.MapClient),
  {
    ssr: false,
    loading: () => <MapLoadBackdrop />,
  },
);

const MAPLIBRE_STYLESHEET_ID = "rguide-maplibre-css";
const MAPLIBRE_STYLESHEET_HREF = "/vendor/maplibre-gl.css";

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
  guideLists?: MapList[];
  savedLocations?: SavedMapLocation[];
  visibleNestedStopParentIds?: string[];
  hoveredStopId?: string | null;
  selectedStopId?: string | null;
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

function MapLoadBackdrop() {
  return (
    <div
      className="h-full min-h-[60vh] w-full overflow-hidden bg-[#d8e1dc] lg:min-h-[calc(100vh-15rem)]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 28% 22%, rgba(255,255,255,0.8), transparent 18%), radial-gradient(circle at 72% 58%, rgba(148,163,184,0.32), transparent 24%), linear-gradient(135deg, rgba(226,232,240,0.9), rgba(203,213,225,0.86))",
      }}
      aria-hidden="true"
    />
  );
}

function loadMapLibreStyles() {
  if (document.getElementById(MAPLIBRE_STYLESHEET_ID)) {
    return;
  }

  const stylesheet = document.createElement("link");
  stylesheet.id = MAPLIBRE_STYLESHEET_ID;
  stylesheet.rel = "stylesheet";
  stylesheet.href = MAPLIBRE_STYLESHEET_HREF;
  stylesheet.media = "print";
  stylesheet.onload = () => {
    stylesheet.media = "all";
  };
  document.head.appendChild(stylesheet);
}

export function InteractiveMap(props: InteractiveMapProps) {
  const [shouldLoadMap, setShouldLoadMap] = useState(false);

  useEffect(() => {
    let idleId: number | null = null;
    const scheduleMapLoad = () => {
      loadMapLibreStyles();
      setShouldLoadMap(true);
    };
    const scheduleId = window.requestAnimationFrame(() => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(scheduleMapLoad, { timeout: 450 });
        return;
      }
      scheduleMapLoad();
    });

    return () => {
      window.cancelAnimationFrame(scheduleId);
      if (idleId !== null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  if (!shouldLoadMap) {
    return <MapLoadBackdrop />;
  }

  return <DynamicMapClient {...props} />;
}
