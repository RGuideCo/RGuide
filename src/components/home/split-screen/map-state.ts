import { useState } from "react";

import type { Country, MapList } from "@/types";

export type MapViewportInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export const getDefaultCountryBrowseView = (country?: Country | null): "cities" | "regions" => {
  if (country?.id === "united-kingdom") {
    return "cities";
  }

  return country?.states?.length ? "regions" : "cities";
};

export function useMapState() {
  const [hoveredGuide, setHoveredGuide] = useState<MapList | null>(null);
  const [hoveredGuideMarkerId, setHoveredGuideMarkerId] = useState<string | null>(null);
  const [hoveredStopId, setHoveredStopId] = useState<string | null>(null);
  const [visibleNestedStopParentIds, setVisibleNestedStopParentIds] = useState<string[]>([]);
  const [visibleGuideMarkerIds, setVisibleGuideMarkerIds] = useState<string[]>([]);
  const [selectedGuideStopId, setSelectedGuideStopId] = useState<string | null>(null);
  const [selectedGuideStopNonce, setSelectedGuideStopNonce] = useState(0);
  const [activeGuideFitNonce, setActiveGuideFitNonce] = useState(0);
  const [mapResizeSignal, setMapResizeSignal] = useState(0);
  const [mapViewportInsets, setMapViewportInsets] = useState<MapViewportInsets>({
    top: 8,
    right: 0,
    bottom: 8,
    left: 0,
  });

  return {
    hoveredGuide,
    setHoveredGuide,
    hoveredGuideMarkerId,
    setHoveredGuideMarkerId,
    hoveredStopId,
    setHoveredStopId,
    visibleNestedStopParentIds,
    setVisibleNestedStopParentIds,
    visibleGuideMarkerIds,
    setVisibleGuideMarkerIds,
    selectedGuideStopId,
    setSelectedGuideStopId,
    selectedGuideStopNonce,
    setSelectedGuideStopNonce,
    activeGuideFitNonce,
    setActiveGuideFitNonce,
    mapResizeSignal,
    setMapResizeSignal,
    mapViewportInsets,
    setMapViewportInsets,
  };
}
