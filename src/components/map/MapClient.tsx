"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Feature, FeatureCollection, Geometry, LineString, Point } from "geojson";
import type { ExpressionSpecification } from "@maplibre/maplibre-gl-style-spec";
import maplibregl, { GeoJSONSource, LngLatBounds } from "maplibre-gl";

import { mapLists } from "@/data/lists";
import { countryBoundaryFeatures } from "@/data/map-boundaries";
import laNeighborhoodBoundaryFeatures from "@/data/la-neighborhood-boundaries.json";
import neighborhoodBoundaryFeatures from "@/data/neighborhood-boundaries.json";
import nycBoroughBoundaryFeatures from "@/data/nyc-borough-boundaries.json";
import nycNeighborhoodBoundaryFeatures from "@/data/nyc-neighborhood-boundaries.json";
import worldCountries from "@/data/world-countries.json";
import { CATEGORY_STYLES } from "@/lib/constants";
import { Continent, MapList, SelectionState } from "@/types";

interface MapClientProps {
  continents: Continent[];
  selection: SelectionState;
  focusedCountryId?: string | null;
  focusedCountryNonce?: number;
  highlightedCountryIds?: string[];
  viewportMode?: "full" | "center" | "submit";
  viewportInsets?: MapViewportInsets;
  resizeSignal?: number;
  guideFocus?: MapList | null;
  activeGuide?: MapList | null;
  activeGuideFitNonce?: number;
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

type WorldCountrySeed = {
  id: string;
  coordinates: [number, number];
  feature: {
    id?: string;
  };
};

type CountryFeatureProperties = {
  id: string;
  name: string;
  continentId: string;
  selected: boolean;
  active: boolean;
  continentActive: boolean;
  guideHighlighted: boolean;
};

type LabelFeatureProperties = {
  id: string;
  name: string;
  hidden?: boolean;
};

type CityFeatureProperties = {
  id: string;
  name: string;
  continentId: string;
  countryId: string;
  score: number;
  isPlaceholderRegion: boolean;
  guideHighlighted: boolean;
};

type GuideStopFeatureProperties = {
  id: string;
  name: string;
  rank: number;
  rankLabel: string;
  markerImage: string;
  category: MapList["category"];
  isNested: boolean;
  placesBeenKind: "countries" | "cities" | "places" | "default";
};

type GuideRouteFeatureProperties = {
  id: string;
  category: MapList["category"];
};

type NeighborhoodBoundaryProperties = {
  id: string;
  name: string;
};

type MapViewportInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

const worldCountrySeeds = worldCountries as unknown as WorldCountrySeed[];
const worldCountryCenters = new Map(worldCountrySeeds.map((country) => [country.id, country.coordinates]));
const worldCountryIso3 = new Map(
  worldCountrySeeds
    .filter((country) => typeof country.feature?.id === "string")
    .map((country) => [country.id, country.feature.id as string]),
);

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";
const COUNTRY_SOURCE_ID = "countries";
const CONTINENT_LABEL_SOURCE_ID = "continent-labels";
const CITY_SOURCE_ID = "cities";
const GUIDE_ROUTE_SOURCE_ID = "guide-route";
const GUIDE_STOP_SOURCE_ID = "guide-stops";
const STATE_LABEL_SOURCE_ID = "state-labels";
const NEIGHBORHOOD_BOUNDARY_SOURCE_ID = "neighborhood-boundaries";
const SELECTED_BOUNDARY_LAYER_ID = "selected-country-boundary";
const SUBNATIONAL_BOUNDARY_LAYER_ID = "selected-country-subnational-boundary";
const STATE_LABEL_LAYER_ID = "state-label-layer";
const BASE_COUNTRY_LABEL_LAYER_IDS = ["label_country_1", "label_country_2", "label_country_3"] as const;
const GUIDE_STOP_COLOR_MATCH = [
  "match",
  ["get", "category"],
  "Food",
  CATEGORY_STYLES.Food.mapColor,
  "Nightlife",
  CATEGORY_STYLES.Nightlife.mapColor,
  "Culture",
  CATEGORY_STYLES.Culture.mapColor,
  "Stay",
  CATEGORY_STYLES.Stay.mapColor,
  "Nature",
  CATEGORY_STYLES.Nature.mapColor,
  "Activities",
  CATEGORY_STYLES.Activities.mapColor,
  CATEGORY_STYLES.Activities.mapColor,
] as ExpressionSpecification;
const GUIDE_STOP_NESTED_COLOR_MATCH = [
  "match",
  ["get", "category"],
  "Food",
  CATEGORY_STYLES.Food.poiColor,
  "Nightlife",
  CATEGORY_STYLES.Nightlife.poiColor,
  "Culture",
  CATEGORY_STYLES.Culture.poiColor,
  "Stay",
  CATEGORY_STYLES.Stay.poiColor,
  "Nature",
  CATEGORY_STYLES.Nature.poiColor,
  "Activities",
  CATEGORY_STYLES.Activities.poiColor,
  CATEGORY_STYLES.Activities.poiColor,
] as ExpressionSpecification;
const GUIDE_STOP_GLOW_COLOR_MATCH = [
  "match",
  ["get", "category"],
  "Food",
  CATEGORY_STYLES.Food.mapGlowColor,
  "Nightlife",
  CATEGORY_STYLES.Nightlife.mapGlowColor,
  "Culture",
  CATEGORY_STYLES.Culture.mapGlowColor,
  "Stay",
  CATEGORY_STYLES.Stay.mapGlowColor,
  "Nature",
  CATEGORY_STYLES.Nature.mapGlowColor,
  "Activities",
  CATEGORY_STYLES.Activities.mapGlowColor,
  CATEGORY_STYLES.Activities.mapGlowColor,
] as ExpressionSpecification;
const GUIDE_STOP_GLOW_BASE_RADIUS = { lowZoom: 15, highZoom: 21 } as const;
const GUIDE_STOP_DOT_BASE_RADIUS = { lowZoom: 8.2, highZoom: 10.4 } as const;
const GUIDE_STOP_CITY_GLOW_SCALE = 11 / 15;
const GUIDE_STOP_CITY_DOT_SCALE = 0.794;
const POI_DIAMOND_IMAGE_PREFIX = "poi-diamond";
const GUIDE_STOP_MARKER_IMAGE_PREFIX = "guide-stop-marker";
const continentFocusPresets: Record<
  string,
  {
    center: [number, number];
    zoom: number;
  }
> = {
  "north-america": { center: [-100, 42], zoom: 2.45 },
  "south-america": { center: [-61, -18], zoom: 2.8 },
  europe: { center: [15, 54], zoom: 3.1 },
  africa: { center: [20, 2], zoom: 2.65 },
  asia: { center: [95, 30], zoom: 2.3 },
  oceania: { center: [146, -24], zoom: 2.75 },
};
const countryFocusPresets: Record<string, { center: [number, number]; zoom: number }> = {
  usa: { center: [-96, 38.5], zoom: 4.2 },
};
const trendingCityIds = new Set(
  [...mapLists]
    .filter((list) => list.location.scope === "city" && list.location.city)
    .sort((left, right) => right.upvotes - left.upvotes)
    .slice(0, 16)
    .map((list) => list.location.city as string),
);
const usStateLabels = [
  { id: "al", name: "Alabama", coordinates: [32.806671, -86.79113] },
  { id: "ak", name: "Alaska", coordinates: [61.370716, -152.404419] },
  { id: "az", name: "Arizona", coordinates: [33.729759, -111.431221] },
  { id: "ar", name: "Arkansas", coordinates: [34.969704, -92.373123] },
  { id: "ca", name: "California", coordinates: [36.116203, -119.681564] },
  { id: "co", name: "Colorado", coordinates: [39.059811, -105.311104] },
  { id: "ct", name: "Connecticut", coordinates: [41.597782, -72.755371] },
  { id: "de", name: "Delaware", coordinates: [39.318523, -75.507141] },
  { id: "fl", name: "Florida", coordinates: [27.766279, -81.686783] },
  { id: "ga", name: "Georgia", coordinates: [33.040619, -83.643074] },
  { id: "hi", name: "Hawaii", coordinates: [21.094318, -157.498337] },
  { id: "id", name: "Idaho", coordinates: [44.240459, -114.478828] },
  { id: "il", name: "Illinois", coordinates: [40.349457, -88.986137] },
  { id: "in", name: "Indiana", coordinates: [39.849426, -86.258278] },
  { id: "ia", name: "Iowa", coordinates: [42.011539, -93.210526] },
  { id: "ks", name: "Kansas", coordinates: [38.5266, -96.726486] },
  { id: "ky", name: "Kentucky", coordinates: [37.66814, -84.670067] },
  { id: "la", name: "Louisiana", coordinates: [31.169546, -91.867805] },
  { id: "me", name: "Maine", coordinates: [44.693947, -69.381927] },
  { id: "md", name: "Maryland", coordinates: [39.063946, -76.802101] },
  { id: "ma", name: "Massachusetts", coordinates: [42.230171, -71.530106] },
  { id: "mi", name: "Michigan", coordinates: [43.326618, -84.536095] },
  { id: "mn", name: "Minnesota", coordinates: [45.694454, -93.900192] },
  { id: "ms", name: "Mississippi", coordinates: [32.741646, -89.678696] },
  { id: "mo", name: "Missouri", coordinates: [38.456085, -92.288368] },
  { id: "mt", name: "Montana", coordinates: [46.921925, -110.454353] },
  { id: "ne", name: "Nebraska", coordinates: [41.12537, -98.268082] },
  { id: "nv", name: "Nevada", coordinates: [38.313515, -117.055374] },
  { id: "nh", name: "New Hampshire", coordinates: [43.452492, -71.563896] },
  { id: "nj", name: "New Jersey", coordinates: [40.298904, -74.521011] },
  { id: "nm", name: "New Mexico", coordinates: [34.840515, -106.248482] },
  { id: "ny", name: "New York", coordinates: [42.165726, -74.948051] },
  { id: "nc", name: "North Carolina", coordinates: [35.630066, -79.806419] },
  { id: "nd", name: "North Dakota", coordinates: [47.528912, -99.784012] },
  { id: "oh", name: "Ohio", coordinates: [40.388783, -82.764915] },
  { id: "ok", name: "Oklahoma", coordinates: [35.565342, -96.928917] },
  { id: "or", name: "Oregon", coordinates: [44.572021, -122.070938] },
  { id: "pa", name: "Pennsylvania", coordinates: [40.590752, -77.209755] },
  { id: "ri", name: "Rhode Island", coordinates: [41.680893, -71.51178] },
  { id: "sc", name: "South Carolina", coordinates: [33.856892, -80.945007] },
  { id: "sd", name: "South Dakota", coordinates: [44.299782, -99.438828] },
  { id: "tn", name: "Tennessee", coordinates: [35.747845, -86.692345] },
  { id: "tx", name: "Texas", coordinates: [31.054487, -97.563461] },
  { id: "ut", name: "Utah", coordinates: [40.150032, -111.862434] },
  { id: "vt", name: "Vermont", coordinates: [44.045876, -72.710686] },
  { id: "va", name: "Virginia", coordinates: [37.769337, -78.169968] },
  { id: "wa", name: "Washington", coordinates: [47.400902, -121.490494] },
  { id: "wv", name: "West Virginia", coordinates: [38.491226, -80.954453] },
  { id: "wi", name: "Wisconsin", coordinates: [44.268543, -89.616508] },
  { id: "wy", name: "Wyoming", coordinates: [42.755966, -107.30249] },
] as const;
const neighborhoodBoundaryLookup = neighborhoodBoundaryFeatures as Record<
  string,
  Feature<Geometry, NeighborhoodBoundaryProperties>
>;
const laNeighborhoodBoundaryLookup = laNeighborhoodBoundaryFeatures as Record<
  string,
  Feature<Geometry, NeighborhoodBoundaryProperties>
>;
const nycNeighborhoodBoundaryLookup = nycNeighborhoodBoundaryFeatures as Record<
  string,
  Feature<Geometry, NeighborhoodBoundaryProperties>
>;
const nycBoroughBoundaryLookup = nycBoroughBoundaryFeatures as Record<
  string,
  Feature<Geometry, NeighborhoodBoundaryProperties>
>;

function extendBoundsFromCoordinates(
  bounds: LngLatBounds,
  coordinates: number[] | number[][] | number[][][] | number[][][][],
) {
  if (typeof coordinates[0] === "number") {
    const [lng, lat] = coordinates as number[];
    bounds.extend([lng, lat]);
    return;
  }

  for (const coordinate of coordinates as number[][] | number[][][] | number[][][][]) {
    extendBoundsFromCoordinates(bounds, coordinate);
  }
}

function getPolygonBounds(coordinates: number[][][]): LngLatBounds {
  const bounds = new LngLatBounds();
  extendBoundsFromCoordinates(bounds, coordinates);
  return bounds;
}

function getBoundsArea(bounds: LngLatBounds) {
  const southWest = bounds.getSouthWest();
  const northEast = bounds.getNorthEast();
  return Math.abs((northEast.lng - southWest.lng) * (northEast.lat - southWest.lat));
}

function normalizeLabelName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function nameMatches(normalizedClickedName: string, normalizedTargetName: string) {
  if (!normalizedClickedName || !normalizedTargetName) {
    return false;
  }
  if (normalizedClickedName === normalizedTargetName) {
    return true;
  }
  return (
    normalizedClickedName.includes(normalizedTargetName) ||
    normalizedTargetName.includes(normalizedClickedName)
  );
}

function getCountryFocusBounds(countryId: string, fallbackBounds: [[number, number], [number, number]]) {
  const geometry = countryBoundaryFeatures[countryId]?.geometry;

  if (geometry?.type === "Polygon") {
    return getPolygonBounds(geometry.coordinates);
  }

  if (geometry?.type === "MultiPolygon") {
    const primaryPolygonBounds = geometry.coordinates
      .map((polygon) => getPolygonBounds(polygon))
      .sort((left, right) => getBoundsArea(right) - getBoundsArea(left))[0];

    if (primaryPolygonBounds) {
      return primaryPolygonBounds;
    }
  }

  return new LngLatBounds(
    [fallbackBounds[0][1], fallbackBounds[0][0]],
    [fallbackBounds[1][1], fallbackBounds[1][0]],
  );
}

function getBoundsCenter(bounds: LngLatBounds) {
  const southWest = bounds.getSouthWest();
  const northEast = bounds.getNorthEast();

  return [
    (southWest.lng + northEast.lng) / 2,
    (southWest.lat + northEast.lat) / 2,
  ] as [number, number];
}

function getCountrySubareaFocusBounds(countryId: string, subareaId: string): LngLatBounds | null {
  const geometry = countryBoundaryFeatures[countryId]?.geometry;
  if (!geometry || geometry.type !== "MultiPolygon") {
    return null;
  }

  if (countryId !== "new-zealand") {
    return null;
  }

  const polygonBounds = geometry.coordinates.map((polygon) => getPolygonBounds(polygon));
  if (!polygonBounds.length) {
    return null;
  }

  if (subareaId === "south-island") {
    return polygonBounds.reduce((best, candidate) =>
      getBoundsCenter(candidate)[1] < getBoundsCenter(best)[1] ? candidate : best,
    );
  }

  if (subareaId === "north-island") {
    return polygonBounds.reduce((best, candidate) =>
      getBoundsCenter(candidate)[1] > getBoundsCenter(best)[1] ? candidate : best,
    );
  }

  return null;
}

function mergePadding(base: MapViewportInsets, insets: MapViewportInsets): MapViewportInsets {
  return {
    top: base.top + insets.top,
    right: base.right + insets.right,
    bottom: base.bottom + insets.bottom,
    left: base.left + insets.left,
  };
}

function clampPaddingToMap(map: maplibregl.Map, padding: MapViewportInsets): MapViewportInsets {
  const container = map.getContainer();
  const maxHorizontalPadding = Math.max(0, container.clientWidth - 160);
  const maxVerticalPadding = Math.max(0, container.clientHeight - 140);
  const horizontalPadding = padding.left + padding.right;
  const verticalPadding = padding.top + padding.bottom;
  const horizontalScale =
    horizontalPadding > maxHorizontalPadding && horizontalPadding > 0
      ? maxHorizontalPadding / horizontalPadding
      : 1;
  const verticalScale =
    verticalPadding > maxVerticalPadding && verticalPadding > 0
      ? maxVerticalPadding / verticalPadding
      : 1;

  return {
    top: Math.round(padding.top * verticalScale),
    right: Math.round(padding.right * horizontalScale),
    bottom: Math.round(padding.bottom * verticalScale),
    left: Math.round(padding.left * horizontalScale),
  };
}

function getGuideBoundsZoom(bounds: LngLatBounds) {
  const southWest = bounds.getSouthWest();
  const northEast = bounds.getNorthEast();
  const maxSpan = Math.max(Math.abs(northEast.lng - southWest.lng), Math.abs(northEast.lat - southWest.lat));

  if (maxSpan > 20) {
    return 2.4;
  }
  if (maxSpan > 5) {
    return 4.6;
  }
  if (maxSpan > 1) {
    return 7.2;
  }
  if (maxSpan > 0.35) {
    return 9.2;
  }
  if (maxSpan > 0.12) {
    return 11.2;
  }
  if (maxSpan > 0.04) {
    return 12.2;
  }
  return 13.1;
}

const smoothCameraEasing = (t: number) => 1 - Math.pow(1 - t, 3);

function getViewportInsets(
  map: maplibregl.Map,
  viewportMode: "full" | "center" | "submit",
  viewportInsets?: MapViewportInsets,
): MapViewportInsets {
  if (viewportInsets) {
    return viewportInsets;
  }
  const width = map.getContainer().clientWidth;
  if (width < 1024 || viewportMode === "full") {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  if (viewportMode === "submit") {
    const rightPaneBaseWidth = Math.max(576, Math.round(width * 0.4));
    return {
      top: 4,
      right: Math.max(640, Math.round(rightPaneBaseWidth * 1.25)),
      bottom: 6,
      left: Math.max(18, Math.round(width * 0.03)),
    };
  }

  const leftPaneWidth = Math.max(280, Math.round(width * 0.22));
  const rightPaneWidth = Math.max(576, Math.round(width * 0.4));
  return {
    top: 4,
    right: Math.max(560, rightPaneWidth),
    bottom: 6,
    left: Math.max(260, leftPaneWidth),
  };
}

function fitMapToCountry(
  map: maplibregl.Map,
  countryId: string,
  bounds: [[number, number], [number, number]],
  viewportInsets: MapViewportInsets,
  options?: { duration?: number },
) {
  const preset = countryFocusPresets[countryId];

  if (preset) {
    map.easeTo({
      center: preset.center,
      zoom: preset.zoom,
      padding: mergePadding({ top: 28, right: 28, bottom: 28, left: 28 }, viewportInsets),
      duration: options?.duration ?? 2200,
      easing: smoothCameraEasing,
      essential: true,
    });
    return;
  }

  const focusBounds = getCountryFocusBounds(countryId, bounds);
  map.fitBounds(focusBounds, {
    padding: mergePadding({ top: 28, right: 28, bottom: 28, left: 28 }, viewportInsets),
    duration: options?.duration ?? 2200,
    easing: smoothCameraEasing,
    essential: true,
    maxZoom: 8.8,
  });
}

function fitMapToContinent(
  map: maplibregl.Map,
  continent: Pick<Continent, "id" | "bounds">,
  viewportInsets: MapViewportInsets,
  options?: { duration?: number },
) {
  const preset = continentFocusPresets[continent.id];

  if (preset) {
    map.easeTo({
      center: preset.center,
      zoom: preset.zoom,
      padding: mergePadding({ top: 24, right: 24, bottom: 24, left: 24 }, viewportInsets),
      duration: options?.duration ?? 2200,
      easing: smoothCameraEasing,
      essential: true,
    });
    return;
  }

  map.fitBounds(
    new LngLatBounds(
      [continent.bounds[0][1], continent.bounds[0][0]],
      [continent.bounds[1][1], continent.bounds[1][0]],
    ),
    {
      padding: mergePadding({ top: 24, right: 24, bottom: 24, left: 24 }, viewportInsets),
      duration: options?.duration ?? 2200,
      easing: smoothCameraEasing,
      essential: true,
      maxZoom: 4.2,
    },
  );
}

function createCountryData(
  continents: Continent[],
  selection: SelectionState,
  highlightedCountryIds?: string[],
  guideFocus?: MapList | null,
): FeatureCollection<Geometry, CountryFeatureProperties> {
  const highlightedCountryIdSet = new Set(highlightedCountryIds ?? []);
  const features = continents.flatMap((continent) =>
    continent.countries.map((country) => {
      const geometry = countryBoundaryFeatures[country.id]?.geometry;
      const selected = selection.countryId === country.id;
      const continentActive = selection.continentId === continent.id && !selection.countryId;
      const active = selected || continentActive;
      const guideHighlighted =
        highlightedCountryIdSet.has(country.id) ||
        (guideFocus?.location.scope === "continent"
          ? guideFocus.location.continent === continent.name
          : guideFocus?.location.scope === "country"
            ? guideFocus.location.country === country.name
            : false);

      return {
        type: "Feature" as const,
        properties: {
          id: country.id,
          name: country.name,
          continentId: continent.id,
          selected,
          active,
          continentActive,
          guideHighlighted,
        },
        geometry,
      };
    }),
  );

  return {
    type: "FeatureCollection",
    features: features.filter(
      (feature): feature is Feature<Geometry, CountryFeatureProperties> => feature.geometry !== undefined,
    ),
  };
}

function createContinentLabelData(
  continents: Continent[],
  selection: SelectionState,
): FeatureCollection<Point, LabelFeatureProperties> {
  return {
    type: "FeatureCollection",
    features: continents.map((continent) => ({
      type: "Feature" as const,
      properties: {
        id: continent.id,
        name: continent.name,
        hidden: Boolean(selection.countryId),
      },
      geometry: {
        type: "Point" as const,
        coordinates: [continent.coordinates[1], continent.coordinates[0]],
      },
    })),
  };
}

function configureBaseCountryLabels(map: maplibregl.Map) {
  BASE_COUNTRY_LABEL_LAYER_IDS.forEach((layerId) => {
    if (!map.getLayer(layerId)) {
      return;
    }

    map.setLayoutProperty(layerId, "text-field", ["coalesce", ["get", "name_en"], ["get", "name"]]);
    map.setPaintProperty(layerId, "text-color", "#0f172a");
    map.setPaintProperty(layerId, "text-halo-color", "rgba(248, 250, 252, 0.96)");
    map.setPaintProperty(layerId, "text-halo-width", 1.25);
  });
}

function hideBasePlaceDots(map: maplibregl.Map) {
  const styleLayers = map.getStyle().layers ?? [];

  for (const layer of styleLayers) {
    const layerSpec = layer as { source?: string; type?: string; id: string; ["source-layer"]?: string };
    const sourceLayer = (layerSpec["source-layer"] ?? "").toLowerCase();
    const layerId = layerSpec.id.toLowerCase();
    const looksLikePlaceLayer =
      sourceLayer.includes("place") ||
      sourceLayer.includes("settlement") ||
      layerId.includes("place") ||
      layerId.includes("settlement") ||
      layerId.includes("city") ||
      layerId.includes("town");

    // Only touch basemap layers, never app-owned sources like "cities".
    if (layerSpec.source !== "openmaptiles" || !looksLikePlaceLayer) {
      continue;
    }

    if (layerSpec.type === "symbol") {
      map.setPaintProperty(layerSpec.id, "icon-opacity", 0);
      continue;
    }

    if (layerSpec.type === "circle") {
      map.setPaintProperty(layerSpec.id, "circle-opacity", 0);
    }
  }
}

function softenBaseReliefAndBuildings(map: maplibregl.Map) {
  const styleLayers = map.getStyle().layers ?? [];

  // Remove 3D terrain if the style defines it.
  map.setTerrain(null);

  for (const layer of styleLayers) {
    const layerSpec = layer as { source?: string; type?: string; id: string; ["source-layer"]?: string };
    const sourceLayer = (layerSpec["source-layer"] ?? "").toLowerCase();
    const layerId = layerSpec.id.toLowerCase();
    const isBaseLayer = layerSpec.source === "openmaptiles";
    const isBuildingLayer =
      layerSpec.type === "fill-extrusion" ||
      sourceLayer.includes("building") ||
      layerId.includes("building") ||
      layerId.includes("3d");
    const isReliefLayer =
      layerSpec.type === "hillshade" ||
      sourceLayer.includes("hillshade") ||
      sourceLayer.includes("terrain") ||
      sourceLayer.includes("contour") ||
      layerId.includes("hillshade") ||
      layerId.includes("terrain") ||
      layerId.includes("contour");

    if (!isBaseLayer || (!isBuildingLayer && !isReliefLayer)) {
      continue;
    }

    map.setLayoutProperty(layerSpec.id, "visibility", "none");
  }
}

function getPoiDiamondImageName(category: string) {
  return `${POI_DIAMOND_IMAGE_PREFIX}-${category.toLowerCase()}`;
}

function getGuideStopMarkerImageName(category: string, label: string) {
  return `${GUIDE_STOP_MARKER_IMAGE_PREFIX}-${category.toLowerCase()}-${label.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`;
}

function createGuideStopMarkerImage(color: string, label: string) {
  const size = 56;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { width: size, height: size, data: new Uint8Array(size * size * 4) };
  }

  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.fillStyle = color;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.font = label.length > 1 ? "700 20px 'Noto Sans', Arial, sans-serif" : "700 23px 'Noto Sans', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, size / 2, size / 2 + 0.5);
  ctx.restore();

  return ctx.getImageData(0, 0, size, size);
}

function addGuideStopMarkerImage(
  map: maplibregl.Map,
  imageName: string,
  category: MapList["category"],
  label: string,
) {
  if (map.hasImage(imageName)) {
    return;
  }
  map.addImage(
    imageName,
    createGuideStopMarkerImage(CATEGORY_STYLES[category].mapColor, label),
    { pixelRatio: 2 },
  );
}

function ensureGuideStopMarkerImages(map: maplibregl.Map, guideStopData: FeatureCollection<Point, GuideStopFeatureProperties>) {
  for (const feature of guideStopData.features) {
    if (feature.properties.isNested) {
      continue;
    }
    addGuideStopMarkerImage(
      map,
      feature.properties.markerImage,
      feature.properties.category,
      feature.properties.rankLabel,
    );
  }
}

function addMissingGuideStopMarkerImage(
  map: maplibregl.Map,
  imageName: string,
  guideStopData: FeatureCollection<Point, GuideStopFeatureProperties>,
) {
  const markerFeature = guideStopData.features.find(
    (feature) => !feature.properties.isNested && feature.properties.markerImage === imageName,
  );
  if (!markerFeature) {
    return;
  }
  addGuideStopMarkerImage(
    map,
    imageName,
    markerFeature.properties.category,
    markerFeature.properties.rankLabel,
  );
}

function createPoiDiamondImage(color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 68;
  canvas.height = 68;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { width: 68, height: 68, data: new Uint8Array(68 * 68 * 4) };
  }

  ctx.save();
  ctx.translate(34, 34);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = color;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;

  const size = 38;
  const radius = 6;
  const half = size / 2;
  ctx.beginPath();
  ctx.moveTo(-half + radius, -half);
  ctx.lineTo(half - radius, -half);
  ctx.quadraticCurveTo(half, -half, half, -half + radius);
  ctx.lineTo(half, half - radius);
  ctx.quadraticCurveTo(half, half, half - radius, half);
  ctx.lineTo(-half + radius, half);
  ctx.quadraticCurveTo(-half, half, -half, half - radius);
  ctx.lineTo(-half, -half + radius);
  ctx.quadraticCurveTo(-half, -half, -half + radius, -half);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  return ctx.getImageData(0, 0, 68, 68);
}

function addPoiDiamondImages(map: maplibregl.Map) {
  Object.entries(CATEGORY_STYLES).forEach(([category, style]) => {
    const imageName = getPoiDiamondImageName(category);
    if (!map.hasImage(imageName)) {
      map.addImage(imageName, createPoiDiamondImage(style.poiColor), { pixelRatio: 2 });
    }
  });
}

function createGuideStopData(
  activeGuide?: MapList | null,
  visibleNestedStopParentIds: string[] = [],
): FeatureCollection<Point, GuideStopFeatureProperties> {
  const visibleNestedParentSet = new Set(visibleNestedStopParentIds);
  const features = (activeGuide?.stops ?? []).flatMap((stop, index) => {
    const placesBeenKind: GuideStopFeatureProperties["placesBeenKind"] = stop.id.startsWith("places-been-cities-")
      ? "cities"
      : stop.id.startsWith("places-been-countries-")
        ? "countries"
        : stop.id.startsWith("places-been-places-")
          ? "places"
          : "default";
    const parentFeature = {
      type: "Feature" as const,
      properties: {
        id: stop.id,
        name: stop.name,
        rank: index + 1,
        rankLabel: String(index + 1),
        markerImage: getGuideStopMarkerImageName(activeGuide?.category ?? "Activities", String(index + 1)),
        category: activeGuide?.category ?? "Activities",
        isNested: false,
        placesBeenKind,
      },
      geometry: {
        type: "Point" as const,
        coordinates: [stop.coordinates[1], stop.coordinates[0]],
      },
    };
    const nestedFeatures = visibleNestedParentSet.has(stop.id) ? (stop.places ?? []).map((place, placeIndex) => ({
      type: "Feature" as const,
      properties: {
        id: place.id,
        name: place.name,
        rank: index + 1 + (placeIndex + 1) / 100,
        rankLabel: String.fromCharCode(65 + (placeIndex % 26)),
        markerImage: "",
        category: activeGuide?.category ?? "Activities",
        isNested: true,
        placesBeenKind: "default" as const,
      },
      geometry: {
        type: "Point" as const,
        coordinates: [place.coordinates[1], place.coordinates[0]],
      },
    })) : [];
    return [parentFeature, ...nestedFeatures];
  });
  return {
    type: "FeatureCollection",
    features,
  };
}

function splitRouteSegmentAtAntimeridian(
  start: [number, number],
  end: [number, number],
): Array<[[number, number], [number, number]]> {
  const [startLng, startLat] = start;
  const [endLng, endLat] = end;
  const deltaLng = endLng - startLng;

  if (Math.abs(deltaLng) <= 180) {
    return [[start, end]];
  }

  const crossingLng = deltaLng > 0 ? -180 : 180;
  const wrappedEndLng = deltaLng > 0 ? endLng - 360 : endLng + 360;
  const interpolation = (crossingLng - startLng) / (wrappedEndLng - startLng);
  const crossingLat = startLat + (endLat - startLat) * interpolation;
  const pairedCrossingLng = crossingLng === -180 ? 180 : -180;

  return [
    [start, [crossingLng, crossingLat]],
    [[pairedCrossingLng, crossingLat], end],
  ];
}

function getMagellanElcanoRouteCoordinates(activeGuide: MapList): Array<[number, number]> {
  const stopCoordinates = new Map(
    activeGuide.stops.map((stop) => [stop.id, [stop.coordinates[1], stop.coordinates[0]] as [number, number]]),
  );
  const seaAnchors: Record<string, [number, number]> = {
    "magellan-sanlucar-departure": [-6.35, 36.78],
    "magellan-canary-islands": [-16.35, 28.35],
    "magellan-santa-lucia-bay": [-43.12, -22.83],
    "magellan-rio-de-solis": [-56.1, -35.0],
    "magellan-puerto-san-julian": [-67.63, -49.28],
    "magellan-cabo-virgenes": [-68.35, -52.33],
    "magellan-cabo-deseado": [-74.35, -53.0],
    "magellan-sharks-islands": [-138.8, -14.8],
    "magellan-san-pablo-island": [-152.3, -10.1],
    "magellan-ladrones-islands": [144.75, 13.35],
    "magellan-samar": [125.2, 11.35],
    "magellan-homonhon": [125.75, 10.75],
    "magellan-limasawa": [125.12, 9.95],
    "magellan-cebu": [123.91, 10.27],
    "magellan-mactan": [123.98, 10.27],
    "magellan-palawan": [118.75, 9.78],
    "magellan-brunei": [115.02, 5.05],
    "magellan-tidore": [127.43, 0.76],
    "magellan-ambon": [128.18, -3.65],
    "magellan-timor": [124.35, -9.45],
    "magellan-cape-good-hope": [18.44, -34.42],
    "magellan-cape-verde": [-24.99, 16.88],
    "magellan-sanlucar-return": [-6.35, 36.78],
  };
  const routePoint = (stopId: string) => seaAnchors[stopId] ?? stopCoordinates.get(stopId)!;
  const requiredStops = [
    "magellan-sanlucar-departure",
    "magellan-canary-islands",
    "magellan-santa-lucia-bay",
    "magellan-rio-de-solis",
    "magellan-puerto-san-julian",
    "magellan-cabo-virgenes",
    "magellan-strait",
    "magellan-cabo-deseado",
    "magellan-sharks-islands",
    "magellan-san-pablo-island",
    "magellan-ladrones-islands",
    "magellan-samar",
    "magellan-homonhon",
    "magellan-limasawa",
    "magellan-cebu",
    "magellan-mactan",
    "magellan-palawan",
    "magellan-brunei",
    "magellan-tidore",
    "magellan-ambon",
    "magellan-timor",
    "magellan-cape-good-hope",
    "magellan-cape-verde",
    "magellan-sanlucar-return",
  ];

  if (requiredStops.some((stopId) => !stopCoordinates.has(stopId))) {
    return activeGuide.stops.map((stop) => [stop.coordinates[1], stop.coordinates[0]] as [number, number]);
  }

  return [
    routePoint("magellan-sanlucar-departure"),
    routePoint("magellan-canary-islands"),
    [-20.2, 20.0],
    [-26.8, 5.5],
    [-34.2, -11.2],
    [-40.8, -20.4],
    routePoint("magellan-santa-lucia-bay"),
    [-45.3, -28.8],
    routePoint("magellan-rio-de-solis"),
    [-60.8, -42.6],
    routePoint("magellan-puerto-san-julian"),
    routePoint("magellan-cabo-virgenes"),
    routePoint("magellan-strait"),
    routePoint("magellan-cabo-deseado"),
    [-88.0, -45.5],
    [-106.0, -34.0],
    [-124.0, -23.5],
    routePoint("magellan-sharks-islands"),
    routePoint("magellan-san-pablo-island"),
    [-170.0, -2.5],
    [178.0, 5.2],
    [160.0, 10.5],
    routePoint("magellan-ladrones-islands"),
    [138.0, 12.7],
    [131.0, 12.0],
    routePoint("magellan-samar"),
    routePoint("magellan-homonhon"),
    routePoint("magellan-limasawa"),
    routePoint("magellan-cebu"),
    routePoint("magellan-mactan"),
    [123.55, 9.65],
    [121.4, 9.55],
    routePoint("magellan-palawan"),
    [116.6, 7.6],
    routePoint("magellan-brunei"),
    [117.4, 5.6],
    [120.2, 5.2],
    [123.2, 4.4],
    [125.5, 2.8],
    [127.1, 1.35],
    routePoint("magellan-tidore"),
    routePoint("magellan-ambon"),
    routePoint("magellan-timor"),
    [102.0, -16.0],
    [78.0, -25.0],
    [54.0, -32.0],
    [32.0, -36.0],
    routePoint("magellan-cape-good-hope"),
    [13.5, -34.8],
    [4.5, -27.5],
    [-4.8, -14.8],
    [-13.6, -1.4],
    [-19.6, 12.0],
    routePoint("magellan-cape-verde"),
    [-23.8, 22.4],
    [-21.2, 30.8],
    [-15.0, 36.3],
    routePoint("magellan-sanlucar-return"),
  ];
}

function normalizeRouteLongitudes(coordinates: Array<[number, number]>): Array<[number, number]> {
  if (!coordinates.length) {
    return coordinates;
  }

  const normalized: Array<[number, number]> = [coordinates[0]];

  for (let index = 1; index < coordinates.length; index += 1) {
    const [rawLng, lat] = coordinates[index];
    const previousLng = normalized[index - 1][0];
    let lng = rawLng;

    while (lng - previousLng > 180) {
      lng -= 360;
    }
    while (lng - previousLng < -180) {
      lng += 360;
    }

    normalized.push([lng, lat]);
  }

  return normalized;
}

function wrapLongitude(lng: number) {
  if (lng < -180 || lng > 180) {
    return ((((lng + 180) % 360) + 360) % 360) - 180;
  }

  return lng;
}

function smoothRouteCoordinates(coordinates: Array<[number, number]>): Array<[number, number]> {
  if (coordinates.length < 3) {
    return coordinates;
  }

  const normalized = normalizeRouteLongitudes(coordinates);
  const smoothed: Array<[number, number]> = [];

  for (let index = 0; index < normalized.length - 1; index += 1) {
    const previous = normalized[Math.max(0, index - 1)];
    const current = normalized[index];
    const next = normalized[index + 1];
    const afterNext = normalized[Math.min(normalized.length - 1, index + 2)];
    const segmentDistance = Math.hypot(next[0] - current[0], next[1] - current[1]);
    const steps = Math.min(18, Math.max(5, Math.ceil(segmentDistance / 4)));

    for (let step = 0; step < steps; step += 1) {
      const t = step / steps;
      const t2 = t * t;
      const t3 = t2 * t;
      const lng =
        0.5 *
        ((2 * current[0]) +
          (-previous[0] + next[0]) * t +
          (2 * previous[0] - 5 * current[0] + 4 * next[0] - afterNext[0]) * t2 +
          (-previous[0] + 3 * current[0] - 3 * next[0] + afterNext[0]) * t3);
      const lat =
        0.5 *
        ((2 * current[1]) +
          (-previous[1] + next[1]) * t +
          (2 * previous[1] - 5 * current[1] + 4 * next[1] - afterNext[1]) * t2 +
          (-previous[1] + 3 * current[1] - 3 * next[1] + afterNext[1]) * t3);

      smoothed.push([wrapLongitude(lng), lat]);
    }
  }

  const last = normalized[normalized.length - 1];
  smoothed.push([wrapLongitude(last[0]), last[1]]);

  return smoothed;
}

function createGuideRouteData(activeGuide?: MapList | null): FeatureCollection<LineString, GuideRouteFeatureProperties> {
  const shouldShowRoute = activeGuide?.creator.id === "user-rguide-history" && (activeGuide.stops?.length ?? 0) > 1;

  if (!shouldShowRoute || !activeGuide) {
    return {
      type: "FeatureCollection",
      features: [],
    };
  }

  const routeSegments: Array<Array<[number, number]>> = [];
  const baseRouteCoordinates =
    activeGuide.id === "list-r-history-magellan-elcano-circumnavigation"
      ? getMagellanElcanoRouteCoordinates(activeGuide)
      : activeGuide.stops.map((stop) => [stop.coordinates[1], stop.coordinates[0]] as [number, number]);
  const routeCoordinates =
    activeGuide.id === "list-r-history-magellan-elcano-circumnavigation"
      ? baseRouteCoordinates
      : smoothRouteCoordinates(baseRouteCoordinates);

  for (let index = 1; index < routeCoordinates.length; index += 1) {
    const splitSegments = splitRouteSegmentAtAntimeridian(routeCoordinates[index - 1], routeCoordinates[index]);
    for (const [segmentStart, segmentEnd] of splitSegments) {
      const currentSegment = routeSegments[routeSegments.length - 1];
      if (
        currentSegment &&
        currentSegment[currentSegment.length - 1][0] === segmentStart[0] &&
        currentSegment[currentSegment.length - 1][1] === segmentStart[1]
      ) {
        currentSegment.push(segmentEnd);
      } else {
        routeSegments.push([segmentStart, segmentEnd]);
      }
    }
  }

  return {
    type: "FeatureCollection",
    features: routeSegments.map((coordinates, index) => ({
      type: "Feature" as const,
      properties: {
        id: `${activeGuide.id}-route-${index + 1}`,
        category: activeGuide.category,
      },
      geometry: {
        type: "LineString" as const,
        coordinates,
      },
    })),
  };
}

function createNeighborhoodBoundaryData(
  activeFeature?: Feature<Geometry, NeighborhoodBoundaryProperties> | null,
): FeatureCollection<Geometry, NeighborhoodBoundaryProperties> {
  return {
    type: "FeatureCollection",
    features: activeFeature ? [activeFeature] : [],
  };
}

function getGeometryCoordinates(
  geometry: Geometry,
): number[] | number[][] | number[][][] | number[][][][] | null {
  if ("coordinates" in geometry) {
    return geometry.coordinates as number[] | number[][] | number[][][] | number[][][][];
  }

  return null;
}

function createStateLabelData(selection: SelectionState): FeatureCollection<Point, LabelFeatureProperties> {
  return {
    type: "FeatureCollection",
    features:
      selection.countryId === "usa"
        ? usStateLabels.map((state) => ({
            type: "Feature" as const,
            properties: {
              id: state.id,
              name: state.name,
            },
            geometry: {
              type: "Point" as const,
              coordinates: [state.coordinates[1], state.coordinates[0]],
            },
          }))
        : [],
  };
}

function createCityData(
  continents: Continent[],
  selection: SelectionState,
  guideFocus?: MapList | null,
): FeatureCollection<Point, CityFeatureProperties> {
  const cityScoreLookup = new Map(
    continents.flatMap((continent) =>
      continent.countries.flatMap((country) =>
        country.cities.map((city) => {
          const cityLists = mapLists.filter(
            (list) =>
              list.location.scope === "city" &&
              list.location.city === city.name &&
              list.location.country === country.name,
          );
          const guideCount = cityLists.length;
          const totalUpvotes = cityLists.reduce((total, list) => total + list.upvotes, 0);
          const interestScore = guideCount * 22 + totalUpvotes * 0.18;
          const trendingBoost = trendingCityIds.has(city.name) ? 14 : 0;

          return [city.id, Math.max(8, interestScore + trendingBoost)] as const;
        }),
      ),
    ),
  );

  return {
    type: "FeatureCollection",
    features: continents.flatMap((continent) =>
      continent.countries.flatMap((country) =>
        country.cities
          .filter(
            (city) =>
              !city.isPlaceholderRegion &&
              (selection.countryId === country.id ||
                selection.cityId === city.id ||
                (selection.continentId === continent.id && !selection.countryId)) &&
              (!selection.countrySubareaId || city.countrySubareaId === selection.countrySubareaId) &&
              (!selection.stateId || city.stateId === selection.stateId),
          )
          .map((city) => ({
            type: "Feature" as const,
            properties: {
              id: city.id,
              name: city.name,
              continentId: continent.id,
              countryId: country.id,
              score: cityScoreLookup.get(city.id) ?? 8,
              isPlaceholderRegion: Boolean(city.isPlaceholderRegion),
              guideHighlighted:
                guideFocus?.location.scope === "city" &&
                guideFocus.location.city === city.name &&
                guideFocus.location.country === country.name,
            },
            geometry: {
              type: "Point" as const,
              coordinates: [city.coordinates[1], city.coordinates[0]],
            },
          })),
      ),
    ),
  };
}

function addMapLayers(map: maplibregl.Map) {
  addPoiDiamondImages(map);

  const countryLabelLayerId = BASE_COUNTRY_LABEL_LAYER_IDS.find((layerId) => map.getLayer(layerId));
  const cityDotBeforeLayerId = map.getLayer("label_other") ? "label_other" : countryLabelLayerId;

  map.addLayer({
    id: "country-fills",
    type: "fill",
    source: COUNTRY_SOURCE_ID,
    paint: {
      "fill-color": [
        "case",
        ["get", "guideHighlighted"],
        "#22d3ee",
        ["get", "selected"],
        "#14b8a6",
        ["get", "continentActive"],
        "#fb923c",
        ["get", "active"],
        "#bfdbfe",
        "#f8fafc",
      ],
      "fill-opacity": [
        "case",
        ["get", "guideHighlighted"],
        0.34,
        ["get", "selected"],
        0,
        ["get", "continentActive"],
        0,
        ["get", "active"],
        0,
        0,
      ],
    },
  });

  map.addLayer({
    id: "country-borders",
    type: "line",
    source: COUNTRY_SOURCE_ID,
    paint: {
      "line-color": [
        "case",
        ["get", "guideHighlighted"],
        "#0891b2",
        ["get", "selected"],
        "#0f766e",
        ["get", "continentActive"],
        "#f97316",
        ["get", "active"],
        "#60a5fa",
        "#cbd5e1",
      ],
      "line-opacity": [
        "case",
        ["get", "guideHighlighted"],
        0.92,
        ["get", "selected"],
        0,
        ["get", "continentActive"],
        0,
        ["get", "active"],
        0,
        0,
      ],
      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        1.5,
        [
          "case",
          ["get", "guideHighlighted"],
          1.15,
          ["get", "selected"],
          0.8,
          ["get", "continentActive"],
          0.7,
          ["get", "active"],
          0.6,
          0.45,
        ],
        6,
        [
          "case",
          ["get", "guideHighlighted"],
          2.8,
          ["get", "selected"],
          2.4,
          ["get", "continentActive"],
          2,
          ["get", "active"],
          1.4,
          0.85,
        ],
      ],
    },
  });

  map.addLayer({
    id: SELECTED_BOUNDARY_LAYER_ID,
    type: "line",
    source: "openmaptiles",
    "source-layer": "boundary",
    filter: [
      "all",
      ["==", ["get", "admin_level"], 2],
      ["!=", ["get", "maritime"], 1],
      ["!=", ["get", "disputed"], 1],
      ["!", ["has", "claimed_by"]],
      ["==", ["get", "adm0_l"], "__none__"],
    ],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#06b6d4",
      "line-opacity": 1,
      "line-blur": 0.2,
      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        1.5,
        3.2,
        4.5,
        4.1,
        8,
        5.4,
      ],
    },
  }, "label_other");

  map.addLayer({
    id: SUBNATIONAL_BOUNDARY_LAYER_ID,
    type: "line",
    source: "openmaptiles",
    "source-layer": "boundary",
    filter: [
      "all",
      ["match", ["get", "admin_level"], [3, 4], true, false],
      ["!=", ["get", "maritime"], 1],
      ["!=", ["get", "disputed"], 1],
      ["!", ["has", "claimed_by"]],
      ["==", ["get", "adm0_l"], "__none__"],
    ],
    layout: {
      "line-cap": "round",
      "line-join": "round",
      visibility: "none",
    },
    paint: {
      "line-color": "rgba(51, 65, 85, 0.78)",
      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        3,
        1.1,
        6,
        1.8,
        9,
        2.4,
      ],
      "line-opacity": 0.95,
    },
  }, "label_other");

  map.addLayer({
    id: "continent-labels",
    type: "symbol",
    source: CONTINENT_LABEL_SOURCE_ID,
    minzoom: 0,
    maxzoom: 3.2,
    layout: {
      "text-field": ["get", "name"],
      "text-size": ["interpolate", ["linear"], ["zoom"], 0, 12, 3, 18],
      "text-font": ["Noto Sans Bold"],
      "text-letter-spacing": 0.12,
      "text-transform": "uppercase",
      "text-allow-overlap": false,
    },
    paint: {
      "text-color": "#475569",
      "text-halo-color": "rgba(248, 250, 252, 0.92)",
      "text-halo-width": 1.5,
      "text-opacity": ["case", ["get", "hidden"], 0, 1],
    },
  });

  map.addLayer({
    id: STATE_LABEL_LAYER_ID,
    type: "symbol",
    source: STATE_LABEL_SOURCE_ID,
    minzoom: 2.2,
    layout: {
      visibility: "none",
      "text-field": ["get", "name"],
      "text-size": ["interpolate", ["linear"], ["zoom"], 2.2, 8.5, 3.35, 9.5, 6, 11.5, 9, 13],
      "text-font": ["Noto Sans Medium"],
      "text-letter-spacing": 0.01,
      "text-allow-overlap": true,
      "text-ignore-placement": true,
    },
    paint: {
      "text-color": "#334155",
      "text-halo-color": "rgba(255, 255, 255, 0.96)",
      "text-halo-width": 1.2,
    },
  }, "continent-labels");

  map.addLayer({
    id: "selected-neighborhood-fill",
    type: "fill",
    source: NEIGHBORHOOD_BOUNDARY_SOURCE_ID,
    paint: {
      "fill-color": "#5b8dee",
      "fill-opacity": 0.15,
    },
  }, "continent-labels");

  map.addLayer({
    id: "selected-neighborhood-point-glow",
    type: "circle",
    source: NEIGHBORHOOD_BOUNDARY_SOURCE_ID,
    filter: ["==", ["geometry-type"], "Point"],
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        9,
        28,
        12,
        46,
        15,
        72,
      ],
      "circle-color": "#5b8dee",
      "circle-opacity": 0.12,
      "circle-blur": 0.75,
      "circle-stroke-width": 0,
    },
  }, "continent-labels");

  map.addLayer({
    id: "selected-neighborhood-point-outline",
    type: "circle",
    source: NEIGHBORHOOD_BOUNDARY_SOURCE_ID,
    filter: ["==", ["geometry-type"], "Point"],
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        9,
        12,
        12,
        18,
        15,
        24,
      ],
      "circle-color": "rgba(91, 141, 238, 0.03)",
      "circle-stroke-color": "#6f96dc",
      "circle-stroke-opacity": 0.88,
      "circle-stroke-width": 0.9,
    },
  }, "continent-labels");

  map.addLayer({
    id: "selected-neighborhood-outline",
    type: "line",
    source: NEIGHBORHOOD_BOUNDARY_SOURCE_ID,
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#6f96dc",
      "line-opacity": 0.86,
      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        6,
        0.8,
        10,
        1.25,
        14,
        1.9,
      ],
    },
  }, "continent-labels");

  map.addLayer({
    id: "city-points",
    type: "circle",
    source: CITY_SOURCE_ID,
    filter: ["==", ["get", "isPlaceholderRegion"], false],
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        2,
        1.8,
        8,
        3.0,
      ],
      "circle-color": [
        "interpolate",
        ["linear"],
        ["get", "score"],
        8,
        "#94a3b8",
        40,
        "#4c9f9a",
        90,
        "#0f766e",
      ],
      "circle-stroke-width": 1,
      "circle-stroke-color": "#ffffff",
      "circle-opacity": 0.9,
      "circle-translate": [0, -1],
      "circle-translate-anchor": "viewport",
    },
  }, cityDotBeforeLayerId);

  map.addLayer({
    id: "guide-route-casing",
    type: "line",
    source: GUIDE_ROUTE_SOURCE_ID,
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "rgba(15, 23, 42, 0.42)",
      "line-opacity": 0.24,
      "line-width": ["interpolate", ["linear"], ["zoom"], 1.5, 3.2, 4, 4.1, 8, 5.2],
      "line-blur": 0.45,
      "line-dasharray": [1.2, 1.4],
    },
  }, "continent-labels");

  map.addLayer({
    id: "guide-route-line",
    type: "line",
    source: GUIDE_ROUTE_SOURCE_ID,
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": GUIDE_STOP_COLOR_MATCH,
      "line-opacity": 0.46,
      "line-width": ["interpolate", ["linear"], ["zoom"], 1.5, 1.6, 4, 2.2, 8, 3.2],
      "line-dasharray": [1.2, 1.6],
    },
  }, "continent-labels");

  map.addLayer({
    id: "guide-stop-glow",
    type: "circle",
    source: GUIDE_STOP_SOURCE_ID,
    filter: ["!=", ["get", "isNested"], true],
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        3,
        GUIDE_STOP_GLOW_BASE_RADIUS.lowZoom,
        8,
        GUIDE_STOP_GLOW_BASE_RADIUS.highZoom,
      ],
      "circle-color": GUIDE_STOP_GLOW_COLOR_MATCH,
      "circle-opacity": 0.18,
      "circle-blur": 0.9,
      "circle-stroke-width": 0,
      "circle-radius-transition": { duration: 0, delay: 0 },
      "circle-opacity-transition": { duration: 0, delay: 0 },
    },
  }, "continent-labels");

  map.addLayer({
    id: "guide-stop-points",
    type: "symbol",
    source: GUIDE_STOP_SOURCE_ID,
    layout: {
      "icon-image": ["get", "markerImage"],
      "icon-size": ["interpolate", ["linear"], ["zoom"], 3, 0.8, 8, 0.96],
      "symbol-sort-key": ["*", -1, ["get", "rank"]],
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
    },
    filter: ["!=", ["get", "isNested"], true],
    paint: {
      "icon-opacity": 0.98,
      "icon-opacity-transition": { duration: 280, delay: 0 },
    },
  }, "continent-labels");

  map.addLayer({
    id: "guide-stop-hover",
    type: "circle",
    source: GUIDE_STOP_SOURCE_ID,
    filter: ["==", ["get", "id"], "__none__"],
    layout: {
      "circle-sort-key": ["*", -1, ["get", "rank"]],
    },
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        3,
        GUIDE_STOP_DOT_BASE_RADIUS.lowZoom,
        8,
        GUIDE_STOP_DOT_BASE_RADIUS.highZoom,
      ],
      "circle-color": GUIDE_STOP_COLOR_MATCH,
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 1.6,
      "circle-opacity": 1,
      "circle-radius-transition": { duration: 0, delay: 0 },
      "circle-opacity-transition": { duration: 0, delay: 0 },
      "circle-stroke-width-transition": { duration: 0, delay: 0 },
    },
  }, "continent-labels");

  map.addLayer({
    id: "guide-stop-burst",
    type: "circle",
    source: GUIDE_STOP_SOURCE_ID,
    filter: ["==", ["get", "id"], "__none__"],
    layout: {
      "circle-sort-key": ["*", -1, ["get", "rank"]],
    },
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        3,
        0,
        8,
        0,
      ],
      "circle-color": GUIDE_STOP_GLOW_COLOR_MATCH,
      "circle-opacity": 0,
      "circle-blur": 0.35,
      "circle-stroke-width": 0,
      "circle-radius-transition": { duration: 0, delay: 0 },
      "circle-opacity-transition": { duration: 0, delay: 0 },
    },
  }, "continent-labels");

  map.addLayer({
    id: "guide-stop-labels",
    type: "symbol",
    source: GUIDE_STOP_SOURCE_ID,
    minzoom: 3,
    filter: ["==", ["get", "id"], "__none__"],
    layout: {
      "text-field": ["get", "rankLabel"],
      "text-size": ["interpolate", ["linear"], ["zoom"], 3, 10.8, 8, 12.6],
      "text-font": ["Noto Sans Bold"],
      "text-anchor": "center",
      "symbol-sort-key": ["*", -1, ["get", "rank"]],
      "text-allow-overlap": true,
      "text-ignore-placement": true,
    },
    paint: {
      "text-color": "#ffffff",
      "text-halo-color": "rgba(15, 23, 42, 0.22)",
      "text-halo-width": 0.6,
    },
  }, "continent-labels");

  map.addLayer({
    id: "guide-stop-diamonds",
    type: "symbol",
    source: GUIDE_STOP_SOURCE_ID,
    minzoom: 3,
    filter: ["==", ["get", "isNested"], true],
    layout: {
      "icon-image": [
        "match",
        ["get", "category"],
        "Food",
        getPoiDiamondImageName("Food"),
        "Nightlife",
        getPoiDiamondImageName("Nightlife"),
        "Culture",
        getPoiDiamondImageName("Culture"),
        "Stay",
        getPoiDiamondImageName("Stay"),
        "Nature",
        getPoiDiamondImageName("Nature"),
        "Activities",
        getPoiDiamondImageName("Activities"),
        getPoiDiamondImageName("Activities"),
      ],
      "icon-size": ["interpolate", ["linear"], ["zoom"], 3, 1.02, 8, 1.08],
      "symbol-sort-key": ["*", -1, ["get", "rank"]],
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
    },
    paint: {
      "icon-opacity": 0.98,
    },
  }, "guide-stop-labels");

  map.addLayer({
    id: "guide-stop-diamond-labels",
    type: "symbol",
    source: GUIDE_STOP_SOURCE_ID,
    minzoom: 3,
    filter: ["==", ["get", "isNested"], true],
    layout: {
      "text-field": ["get", "rankLabel"],
      "text-size": ["interpolate", ["linear"], ["zoom"], 3, 10.2, 8, 11.6],
      "text-font": ["Noto Sans Bold"],
      "text-anchor": "center",
      "symbol-sort-key": ["*", -1, ["get", "rank"]],
      "text-allow-overlap": true,
      "text-ignore-placement": true,
    },
    paint: {
      "text-color": "#ffffff",
      "text-halo-color": "rgba(15, 23, 42, 0.16)",
      "text-halo-width": 0.4,
    },
  }, "continent-labels");

  if (map.getLayer("guide-stop-points") && map.getLayer("guide-stop-labels")) {
    map.moveLayer("guide-stop-points", "guide-stop-labels");
  }
}

export function MapClient({
  continents,
  selection,
  focusedCountryId,
  focusedCountryNonce = 0,
  highlightedCountryIds,
  viewportMode = "full",
  viewportInsets,
  resizeSignal = 0,
  guideFocus,
  activeGuide,
  activeGuideFitNonce = 0,
  visibleNestedStopParentIds = [],
  hoveredStopId,
  selectedStopId,
  onHoverGuideStop,
  onSelectGuideStop,
  onSubmitMapClick,
  onSelectContinent,
  onSelectCountry,
  onSelectCity,
  onSelectSubarea,
  onSelectState,
}: MapClientProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const isStyleReadyRef = useRef(false);
  const [styleReadyTick, setStyleReadyTick] = useState(0);
  const hoverAnimationFrameRef = useRef<number | null>(null);
  const hoverVisualStateRef = useRef<{
    activeId: string | null;
    target: number;
    amount: number;
    burstTriggered: boolean;
    burstActive: boolean;
    burstT: number;
    frame: number;
  }>({
    activeId: null,
    target: 0,
    amount: 0,
    burstTriggered: false,
    burstActive: false,
    burstT: 0,
    frame: 0,
  });
  const handlersRef = useRef({
    onSelectContinent,
    onSelectCountry,
    onSelectCity,
    onSelectSubarea,
    onSelectState,
    onHoverGuideStop,
    onSelectGuideStop,
    onSubmitMapClick,
    continents,
    selection,
  });
  const viewportModeRef = useRef<"full" | "center" | "submit">(viewportMode);
  const viewportInsetsRef = useRef<MapViewportInsets | undefined>(viewportInsets);
  const activeGuideCameraKeyRef = useRef<string | null>(null);
  const selectionCameraKeyRef = useRef<string | null>(null);

  const countryData = useMemo(
    () => createCountryData(continents, selection, highlightedCountryIds, guideFocus),
    [continents, guideFocus, highlightedCountryIds, selection],
  );
  const continentLabelData = useMemo(
    () => createContinentLabelData(continents, selection),
    [continents, selection],
  );
  const cityData = useMemo(
    () => createCityData(continents, selection, guideFocus),
    [continents, guideFocus, selection],
  );
  const stateLabelData = useMemo(() => createStateLabelData(selection), [selection]);
  const guideStopData = useMemo(
    () => createGuideStopData(activeGuide, visibleNestedStopParentIds),
    [activeGuide, visibleNestedStopParentIds],
  );
  const guideRouteData = useMemo(
    () => createGuideRouteData(activeGuide),
    [activeGuide],
  );
  const guideStopDataRef = useRef(guideStopData);
  const activeGuideStopSignature = useMemo(
    () =>
      (activeGuide?.stops ?? [])
        .flatMap((stop) => [
          `${stop.id}:${stop.coordinates[0].toFixed(5)},${stop.coordinates[1].toFixed(5)}`,
          ...(stop.places ?? []).map((place) =>
            `${place.id}:${place.coordinates[0].toFixed(5)},${place.coordinates[1].toFixed(5)}`,
          ),
        ])
        .join("|"),
    [activeGuide],
  );
  const activeNeighborhoodBoundary = useMemo(() => {
    if (selection.cityId && selection.subareaId && selection.nestedSubareaId) {
      return (
        nycNeighborhoodBoundaryLookup[
          `${selection.cityId}::${selection.subareaId}::${selection.nestedSubareaId}`
        ] ??
        neighborhoodBoundaryLookup[
          `${selection.cityId}::${selection.subareaId}::${selection.nestedSubareaId}`
        ] ?? null
      );
    }

    if (selection.cityId && selection.subareaId) {
      return (
        laNeighborhoodBoundaryLookup[`${selection.cityId}::${selection.subareaId}`] ??
        nycBoroughBoundaryLookup[`${selection.cityId}::${selection.subareaId}`] ??
        nycNeighborhoodBoundaryLookup[`${selection.cityId}::${selection.subareaId}`] ??
        neighborhoodBoundaryLookup[`${selection.cityId}::${selection.subareaId}`] ??
        null
      );
    }

    return null;
  }, [selection.cityId, selection.nestedSubareaId, selection.subareaId]);
  const neighborhoodBoundaryData = useMemo(
    () => createNeighborhoodBoundaryData(activeNeighborhoodBoundary),
    [activeNeighborhoodBoundary],
  );
  const selectionCameraKey = useMemo(
    () =>
      [
        viewportMode,
        selection.continentId ?? "",
        selection.continentSubareaId ?? "",
        selection.countryId ?? "",
        selection.countrySubareaId ?? "",
        selection.stateId ?? "",
        selection.cityId ?? "",
        selection.subareaId ?? "",
        selection.nestedSubareaId ?? "",
        activeNeighborhoodBoundary?.properties.name ?? "",
      ].join("|"),
    [
      activeNeighborhoodBoundary,
      selection.cityId,
      selection.continentId,
      selection.continentSubareaId,
      selection.countryId,
      selection.countrySubareaId,
      selection.nestedSubareaId,
      selection.stateId,
      selection.subareaId,
      viewportMode,
    ],
  );
  const selectedBoundaryIso3 = useMemo(() => {
    const iso3Set = new Set<string>();

    if (highlightedCountryIds?.length) {
      for (const countryId of highlightedCountryIds) {
        const iso3 = worldCountryIso3.get(countryId);
        if (iso3) {
          iso3Set.add(iso3);
        }
      }
    }

    if (selection.continentId && !selection.countryId) {
      const continent = continents.find((item) => item.id === selection.continentId);
      for (const country of continent?.countries ?? []) {
        const iso3 = worldCountryIso3.get(country.id);
        if (iso3) {
          iso3Set.add(iso3);
        }
      }
    }

    if (selection.countryId) {
      const iso3 = worldCountryIso3.get(selection.countryId);
      if (iso3) {
        iso3Set.add(iso3);
      }
    }

    return Array.from(iso3Set);
  }, [continents, highlightedCountryIds, selection.continentId, selection.countryId]);
  const selectedCountryIso3 = useMemo(
    () => (selection.countryId ? worldCountryIso3.get(selection.countryId) ?? null : null),
    [selection.countryId],
  );

  useEffect(() => {
    handlersRef.current = {
      onSelectContinent,
      onSelectCountry,
      onSelectCity,
      onSelectSubarea,
      onSelectState,
      onHoverGuideStop,
      onSelectGuideStop,
      onSubmitMapClick,
      continents,
      selection,
    };
  }, [continents, onHoverGuideStop, onSelectCity, onSelectContinent, onSelectCountry, onSelectGuideStop, onSelectSubarea, onSelectState, onSubmitMapClick, selection]);
  useEffect(() => {
    guideStopDataRef.current = guideStopData;
  }, [guideStopData]);
  useEffect(() => {
    viewportModeRef.current = viewportMode;
  }, [viewportMode]);
  useEffect(() => {
    viewportInsetsRef.current = viewportInsets;
  }, [viewportInsets]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [10, 20],
      zoom: 1.8,
      minZoom: 1.5,
      maxZoom: 16,
      attributionControl: {},
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;

    map.on("load", () => {
      isStyleReadyRef.current = true;
      setStyleReadyTick((current) => current + 1);

      map.addSource(COUNTRY_SOURCE_ID, {
        type: "geojson",
        data: countryData,
      });

      map.addSource(CONTINENT_LABEL_SOURCE_ID, {
        type: "geojson",
        data: continentLabelData,
      });

      map.addSource(CITY_SOURCE_ID, {
        type: "geojson",
        data: cityData,
      });

      map.addSource(STATE_LABEL_SOURCE_ID, {
        type: "geojson",
        data: stateLabelData,
      });

      map.addSource(GUIDE_ROUTE_SOURCE_ID, {
        type: "geojson",
        data: guideRouteData,
      });

      map.addSource(GUIDE_STOP_SOURCE_ID, {
        type: "geojson",
        data: guideStopData,
      });

      map.addSource(NEIGHBORHOOD_BOUNDARY_SOURCE_ID, {
        type: "geojson",
        data: neighborhoodBoundaryData,
      });

      map.on("styleimagemissing", (event: { id: string }) => {
        addMissingGuideStopMarkerImage(map, event.id, guideStopDataRef.current);
      });
      ensureGuideStopMarkerImages(map, guideStopData);

      try {
        addMapLayers(map);
      } catch (error) {
        console.error("Map layer initialization failed", error);
      }
      configureBaseCountryLabels(map);
      hideBasePlaceDots(map);
      softenBaseReliefAndBuildings(map);

      map.on("mouseenter", "country-fills", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "country-fills", () => {
        map.getCanvas().style.cursor = "";
      });

      map.on("mouseenter", "city-points", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "city-points", () => {
        map.getCanvas().style.cursor = "";
      });

      const syncHoveredGuideStop = (event: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
        const feature = event.features?.[0];
        const stopId = typeof feature?.properties?.id === "string" ? feature.properties.id : null;
        handlersRef.current.onHoverGuideStop?.(stopId);
      };

      map.on("mousemove", "guide-stop-points", syncHoveredGuideStop);
      map.on("mousemove", "guide-stop-hover", syncHoveredGuideStop);
      map.on("mousemove", "guide-stop-labels", syncHoveredGuideStop);
      map.on("mousemove", "guide-stop-diamonds", syncHoveredGuideStop);
      map.on("mousemove", "guide-stop-diamond-labels", syncHoveredGuideStop);
      map.on("mouseleave", "guide-stop-points", () => handlersRef.current.onHoverGuideStop?.(null));
      map.on("mouseleave", "guide-stop-hover", () => handlersRef.current.onHoverGuideStop?.(null));
      map.on("mouseleave", "guide-stop-labels", () => handlersRef.current.onHoverGuideStop?.(null));
      map.on("mouseleave", "guide-stop-diamonds", () => handlersRef.current.onHoverGuideStop?.(null));
      map.on("mouseleave", "guide-stop-diamond-labels", () => handlersRef.current.onHoverGuideStop?.(null));

      map.on("click", (event) => {
        const clickedGuideStopFeature = map
          .queryRenderedFeatures(event.point, {
            layers: ["guide-stop-diamond-labels", "guide-stop-diamonds", "guide-stop-labels", "guide-stop-hover", "guide-stop-points"],
          })
          .find((feature) => typeof feature.properties?.id === "string");
        const clickedGuideStopId =
          typeof clickedGuideStopFeature?.properties?.id === "string"
            ? clickedGuideStopFeature.properties.id
            : null;
        if (clickedGuideStopId) {
          handlersRef.current.onHoverGuideStop?.(clickedGuideStopId);
          handlersRef.current.onSelectGuideStop?.(clickedGuideStopId);
          return;
        }

        if (viewportModeRef.current === "submit" && handlersRef.current.onSubmitMapClick) {
          handlersRef.current.onSubmitMapClick([event.lngLat.lat, event.lngLat.lng]);
          return;
        }

        const features = map.queryRenderedFeatures(event.point, {
          layers: ["city-points", "country-fills", "continent-labels", STATE_LABEL_LAYER_ID],
        });
        const allFeaturesAtPoint = map.queryRenderedFeatures(event.point);
        const clickedNames = new Set(
          allFeaturesAtPoint
            .flatMap((feature) => {
              const props = feature.properties ?? {};
              const names = [
                typeof props.name === "string" ? props.name : null,
                typeof props.name_en === "string" ? props.name_en : null,
                typeof props.name_int === "string" ? props.name_int : null,
                typeof props["name:en"] === "string" ? props["name:en"] : null,
              ].filter((value): value is string => Boolean(value));
              return names.map(normalizeLabelName);
            })
            .filter((value): value is string => Boolean(value)),
        );

        const currentSelection = handlersRef.current.selection;
        if (currentSelection.continentId && currentSelection.countryId) {
          const activeContinent = handlersRef.current.continents.find(
            (continent) => continent.id === currentSelection.continentId,
          );
          const activeCountry = activeContinent?.countries.find(
            (country) => country.id === currentSelection.countryId,
          );
          const activeCity = currentSelection.cityId
            ? activeCountry?.cities.find((city) => city.id === currentSelection.cityId)
            : undefined;
          const citySubareas = activeCity?.subareas ?? [];
          const matchingCountryCity = (activeCountry?.cities ?? []).find((city) =>
            Array.from(clickedNames).some((clickedName) =>
              nameMatches(clickedName, normalizeLabelName(city.name)),
            ),
          );

          if (matchingCountryCity) {
            handlersRef.current.onSelectCity(
              currentSelection.continentId,
              currentSelection.countryId,
              matchingCountryCity.id,
            );
            return;
          }

          const matchingState = (activeCountry?.states ?? []).find((state) => {
            if (
              currentSelection.countrySubareaId &&
              state.countrySubareaId !== currentSelection.countrySubareaId
            ) {
              return false;
            }
            return Array.from(clickedNames).some((clickedName) =>
              nameMatches(clickedName, normalizeLabelName(state.name)),
            );
          });

          if (
            matchingState &&
            handlersRef.current.onSelectState &&
            currentSelection.continentId &&
            currentSelection.countryId
          ) {
            handlersRef.current.onSelectState(
              currentSelection.continentId,
              currentSelection.countryId,
              matchingState.countrySubareaId,
              matchingState.id,
            );
            return;
          }

          if (
            currentSelection.countrySubareaId &&
            (activeCountry?.states?.length ?? 0) > 0 &&
            handlersRef.current.onSelectState
          ) {
            const scopedStates = (activeCountry?.states ?? []).filter(
              (state) => state.countrySubareaId === currentSelection.countrySubareaId,
            );
            if (scopedStates.length) {
              const nearest = scopedStates.reduce<{
                id: string;
                countrySubareaId: string;
                distanceSquared: number;
              } | null>((best, state) => {
                const dLat = event.lngLat.lat - state.coordinates[0];
                const dLng = event.lngLat.lng - state.coordinates[1];
                const distanceSquared = dLat * dLat + dLng * dLng;
                if (!best || distanceSquared < best.distanceSquared) {
                  return { id: state.id, countrySubareaId: state.countrySubareaId, distanceSquared };
                }
                return best;
              }, null);

              const zoom = map.getZoom();
              const maxAngularDistance =
                zoom >= 8 ? 1.4 : zoom >= 6 ? 2.2 : zoom >= 4 ? 3.4 : 4.6;
              const maxDistanceSquared = maxAngularDistance * maxAngularDistance;

              if (nearest && nearest.distanceSquared <= maxDistanceSquared) {
                handlersRef.current.onSelectState(
                  currentSelection.continentId,
                  currentSelection.countryId,
                  nearest.countrySubareaId,
                  nearest.id,
                );
                return;
              }
            }
          }

          if (citySubareas.length && handlersRef.current.onSelectSubarea) {
            const matchingSubarea = citySubareas.find((subarea) =>
              Array.from(clickedNames).some((clickedName) =>
                nameMatches(clickedName, normalizeLabelName(subarea.name)),
              ),
            );

            if (matchingSubarea && currentSelection.cityId) {
              handlersRef.current.onSelectSubarea(
                currentSelection.continentId,
                currentSelection.countryId,
                currentSelection.cityId,
                matchingSubarea.id,
              );
              return;
            }
          }
        }

        const cityFeature = features.find((feature) => feature.layer.id === "city-points");
        if (cityFeature) {
          const cityId =
            typeof cityFeature.properties?.id === "string" ? cityFeature.properties.id : undefined;
          const countryId =
            typeof cityFeature.properties?.countryId === "string"
              ? cityFeature.properties.countryId
              : undefined;
          const continentId =
            typeof cityFeature.properties?.continentId === "string"
              ? cityFeature.properties.continentId
              : undefined;

          if (cityId && countryId && continentId) {
            handlersRef.current.onSelectCity(continentId, countryId, cityId);
          }
          return;
        }

        const stateLabelFeature = features.find((feature) => feature.layer.id === STATE_LABEL_LAYER_ID);
        if (
          stateLabelFeature &&
          handlersRef.current.onSelectState &&
          handlersRef.current.selection.continentId &&
          handlersRef.current.selection.countryId
        ) {
          const stateLabelName =
            typeof stateLabelFeature.properties?.name === "string"
              ? normalizeLabelName(stateLabelFeature.properties.name)
              : null;
          const activeContinent = handlersRef.current.continents.find(
            (continent) => continent.id === handlersRef.current.selection.continentId,
          );
          const activeCountry = activeContinent?.countries.find(
            (country) => country.id === handlersRef.current.selection.countryId,
          );
          const matchingState = (activeCountry?.states ?? []).find((state) =>
            stateLabelName ? nameMatches(stateLabelName, normalizeLabelName(state.name)) : false,
          );
          if (matchingState) {
            handlersRef.current.onSelectState(
              handlersRef.current.selection.continentId,
              handlersRef.current.selection.countryId,
              matchingState.countrySubareaId,
              matchingState.id,
            );
            return;
          }
        }

        const currentSelectionAfterCityCheck = handlersRef.current.selection;
        if (
          currentSelectionAfterCityCheck.continentId &&
          currentSelectionAfterCityCheck.countryId &&
          currentSelectionAfterCityCheck.cityId &&
          handlersRef.current.onSelectSubarea
        ) {
          const activeContinent = handlersRef.current.continents.find(
            (continent) => continent.id === currentSelectionAfterCityCheck.continentId,
          );
          const activeCountry = activeContinent?.countries.find(
            (country) => country.id === currentSelectionAfterCityCheck.countryId,
          );
          const activeCity = activeCountry?.cities.find(
            (city) => city.id === currentSelectionAfterCityCheck.cityId,
          );
          const citySubareas = activeCity?.subareas ?? [];

          if (citySubareas.length) {
            const nearest = citySubareas.reduce<{
              id: string;
              distanceSquared: number;
            } | null>((best, subarea) => {
              const dLat = event.lngLat.lat - subarea.coordinates[0];
              const dLng = event.lngLat.lng - subarea.coordinates[1];
              const distanceSquared = dLat * dLat + dLng * dLng;
              if (!best || distanceSquared < best.distanceSquared) {
                return { id: subarea.id, distanceSquared };
              }
              return best;
            }, null);

            const zoom = map.getZoom();
            const maxAngularDistance =
              zoom >= 11 ? 0.22 : zoom >= 9 ? 0.42 : zoom >= 7 ? 0.75 : 1.1;
            const maxDistanceSquared = maxAngularDistance * maxAngularDistance;

            if (nearest && nearest.distanceSquared <= maxDistanceSquared) {
              handlersRef.current.onSelectSubarea(
                currentSelectionAfterCityCheck.continentId,
                currentSelectionAfterCityCheck.countryId,
                currentSelectionAfterCityCheck.cityId,
                nearest.id,
              );
              return;
            }
          }
        }

        const countryFeature = features.find((feature) => feature.layer.id === "country-fills");
        if (countryFeature) {
          const countryId =
            typeof countryFeature.properties?.id === "string"
              ? countryFeature.properties.id
              : undefined;
          const continentId =
            typeof countryFeature.properties?.continentId === "string"
              ? countryFeature.properties.continentId
              : undefined;

          if (countryId && continentId) {
            const currentSelection = handlersRef.current.selection;
            const isSameCountryAsCurrent =
              currentSelection.countryId === countryId &&
              currentSelection.continentId === continentId;
            const hasLocalSelection = Boolean(
              currentSelection.countrySubareaId ||
                currentSelection.stateId ||
              currentSelection.cityId ||
                currentSelection.subareaId ||
                currentSelection.nestedSubareaId,
            );
            if (
              isSameCountryAsCurrent &&
              hasLocalSelection
            ) {
              // When deeply zoomed in, ignore same-country polygon fallback so local labels/city targets can win.
              return;
            } else {
              const continent = handlersRef.current.continents.find((item) => item.id === continentId);
              const country = continent?.countries.find((item) => item.id === countryId);
              if (country) {
                fitMapToCountry(
                  map,
                  countryId,
                  country.bounds,
                  getViewportInsets(map, viewportModeRef.current, viewportInsetsRef.current),
                  { duration: 2200 },
                );
              }
              handlersRef.current.onSelectCountry(continentId, countryId);
              return;
            }
          }
        }

        const continentFeature = features.find((feature) => feature.layer.id === "continent-labels");
        const continentId =
          typeof continentFeature?.properties?.id === "string"
            ? continentFeature.properties.id
            : undefined;

        if (continentId) {
          handlersRef.current.onSelectContinent(continentId);
        }
      });
    });

    return () => {
      if (hoverAnimationFrameRef.current !== null) {
        cancelAnimationFrame(hoverAnimationFrameRef.current);
        hoverAnimationFrameRef.current = null;
      }
      isStyleReadyRef.current = false;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }
    const syncViewportChrome = () => {
      const insets = getViewportInsets(map, viewportModeRef.current, viewportInsetsRef.current);
      const controlRight = Math.max(12, insets.right + 14);
      map.getContainer().style.setProperty("--rguide-map-controls-right", `${controlRight}px`);
    };
    const onWindowResize = () => {
      map.resize();
      syncViewportChrome();
    };
    syncViewportChrome();
    window.addEventListener("resize", onWindowResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }
    const insets = getViewportInsets(map, viewportMode, viewportInsets);
    const controlRight = Math.max(12, insets.right + 14);
    map.getContainer().style.setProperty("--rguide-map-controls-right", `${controlRight}px`);
    map.resize();
  }, [viewportMode, viewportInsets]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }
    let rafIdOne: number | null = null;
    let rafIdTwo: number | null = null;
    rafIdOne = window.requestAnimationFrame(() => {
      rafIdTwo = window.requestAnimationFrame(() => {
        map.resize();
      });
    });
    return () => {
      if (rafIdOne !== null) {
        window.cancelAnimationFrame(rafIdOne);
      }
      if (rafIdTwo !== null) {
        window.cancelAnimationFrame(rafIdTwo);
      }
    };
  }, [resizeSignal]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isStyleReadyRef.current) {
      return;
    }

    (map.getSource(COUNTRY_SOURCE_ID) as GeoJSONSource).setData(countryData);
    (map.getSource(CONTINENT_LABEL_SOURCE_ID) as GeoJSONSource).setData(continentLabelData);
    (map.getSource(CITY_SOURCE_ID) as GeoJSONSource).setData(cityData);
    (map.getSource(STATE_LABEL_SOURCE_ID) as GeoJSONSource).setData(stateLabelData);
    (map.getSource(GUIDE_ROUTE_SOURCE_ID) as GeoJSONSource).setData(guideRouteData);
    ensureGuideStopMarkerImages(map, guideStopData);
    (map.getSource(GUIDE_STOP_SOURCE_ID) as GeoJSONSource).setData(guideStopData);
    (map.getSource(NEIGHBORHOOD_BOUNDARY_SOURCE_ID) as GeoJSONSource).setData(neighborhoodBoundaryData);
  }, [cityData, continentLabelData, countryData, guideRouteData, guideStopData, neighborhoodBoundaryData, stateLabelData]);

  const activeGuidePulseStopId = useMemo(() => {
    const renderedStopIds = new Set(guideStopData.features.map((feature) => feature.properties.id));
    const candidateStopIds = [hoveredStopId, selectedStopId, visibleNestedStopParentIds[0] ?? null];

    return candidateStopIds.find((stopId): stopId is string => Boolean(stopId && renderedStopIds.has(stopId))) ?? null;
  }, [guideStopData, hoveredStopId, selectedStopId, visibleNestedStopParentIds]);

  useEffect(() => {
    const map = mapRef.current;
    if (
      !map ||
      !isStyleReadyRef.current ||
      !map.getLayer("guide-stop-hover") ||
      !map.getLayer("guide-stop-burst") ||
      !map.getLayer("guide-stop-glow")
    ) {
      return;
    }

    const visualState = hoverVisualStateRef.current;
    if (activeGuidePulseStopId) {
      if (visualState.activeId !== activeGuidePulseStopId) {
        visualState.activeId = activeGuidePulseStopId;
        visualState.burstTriggered = false;
        visualState.burstActive = false;
        visualState.burstT = 0;
      }
      visualState.target = 1;
      map.setFilter("guide-stop-hover", ["==", ["get", "id"], activeGuidePulseStopId]);
      map.setFilter("guide-stop-burst", ["==", ["get", "id"], activeGuidePulseStopId]);
    } else {
      visualState.target = 0;
      visualState.burstActive = false;
      visualState.burstT = 0;
    }

    const tick = () => {
      const state = hoverVisualStateRef.current;
      state.frame += 1;
      state.amount += (state.target - state.amount) * 0.32;

      const hoverScale = state.amount;
      if (state.target === 1 && !state.burstTriggered && hoverScale >= 0.94) {
        state.burstTriggered = true;
        state.burstActive = true;
        state.burstT = 0;
      }

      if (state.burstActive) {
        state.burstT = Math.min(1, state.burstT + 0.18);
        if (state.burstT >= 1) {
          state.burstActive = false;
        }
      }

      const continuousPulse = state.target === 1 ? (Math.sin(state.frame * 0.12) + 1) / 2 : 0;
      const burstGrow = state.target === 1 ? continuousPulse : state.burstT;
      const burstFade = state.target === 1 ? 1 - continuousPulse : state.burstActive ? 1 - state.burstT : 0;

      const hoverRadiusAtLowZoom = 6 + 3.5 * hoverScale + 1.7 * continuousPulse;
      const hoverRadiusAtHighZoom = 7.8 + 4.5 * hoverScale + 2.2 * continuousPulse;
      const burstRadiusAtLowZoom = 9 + 14 * burstGrow;
      const burstRadiusAtHighZoom = 12 + 20 * burstGrow;
      const burstOpacity = state.target === 1 ? 0.26 * burstFade : 0.32 * burstFade;

      map.setPaintProperty("guide-stop-hover", "circle-radius", [
        "interpolate",
        ["linear"],
        ["zoom"],
        3,
        hoverRadiusAtLowZoom,
        8,
        hoverRadiusAtHighZoom,
      ]);
      map.setPaintProperty("guide-stop-burst", "circle-radius", [
        "interpolate",
        ["linear"],
        ["zoom"],
        3,
        burstRadiusAtLowZoom,
        8,
        burstRadiusAtHighZoom,
      ]);
      map.setPaintProperty("guide-stop-burst", "circle-opacity", burstOpacity);

      const done = Math.abs(state.target - state.amount) < 0.01;
      if (done) {
        state.amount = state.target;
        if (state.target === 0) {
          state.activeId = null;
          state.burstTriggered = false;
          state.burstActive = false;
          state.burstT = 0;
          state.frame = 0;
          map.setFilter("guide-stop-hover", ["==", ["get", "id"], "__none__"]);
          map.setFilter("guide-stop-burst", ["==", ["get", "id"], "__none__"]);
          map.setPaintProperty("guide-stop-burst", "circle-opacity", 0);
        }
        if (state.target === 1) {
          hoverAnimationFrameRef.current = requestAnimationFrame(tick);
          return;
        }
        hoverAnimationFrameRef.current = null;
        return;
      }

      hoverAnimationFrameRef.current = requestAnimationFrame(tick);
    };

    if (hoverAnimationFrameRef.current !== null) {
      cancelAnimationFrame(hoverAnimationFrameRef.current);
      hoverAnimationFrameRef.current = null;
    }
    hoverAnimationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (hoverAnimationFrameRef.current !== null) {
        cancelAnimationFrame(hoverAnimationFrameRef.current);
        hoverAnimationFrameRef.current = null;
      }
    };
  }, [activeGuidePulseStopId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isStyleReadyRef.current || !map.getLayer("city-points")) {
      return;
    }

    const baseFilter: maplibregl.FilterSpecification = ["==", ["get", "isPlaceholderRegion"], false];
    const selectedCityFilter: maplibregl.FilterSpecification | null = selection.cityId
      ? ["!=", ["get", "id"], selection.cityId]
      : null;

    map.setFilter(
      "city-points",
      selectedCityFilter ? ["all", baseFilter, selectedCityFilter] : baseFilter,
    );
  }, [selection.cityId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isStyleReadyRef.current || !map.getLayer(SELECTED_BOUNDARY_LAYER_ID)) {
      return;
    }

    if (selectedBoundaryIso3.length === 0) {
      map.setFilter(SELECTED_BOUNDARY_LAYER_ID, [
        "all",
        ["==", ["get", "admin_level"], 2],
        ["!=", ["get", "maritime"], 1],
        ["!=", ["get", "disputed"], 1],
        ["!", ["has", "claimed_by"]],
        ["==", ["get", "adm0_l"], "__none__"],
      ]);
      return;
    }

    map.setFilter(SELECTED_BOUNDARY_LAYER_ID, [
      "all",
      ["==", ["get", "admin_level"], 2],
      ["!=", ["get", "maritime"], 1],
      ["!=", ["get", "disputed"], 1],
      ["!", ["has", "claimed_by"]],
      [
        "any",
        ["match", ["get", "adm0_l"], selectedBoundaryIso3, true, false],
        ["match", ["get", "adm0_r"], selectedBoundaryIso3, true, false],
      ],
    ]);
  }, [selectedBoundaryIso3]);

  useEffect(() => {
    const map = mapRef.current;
    if (
      !map ||
      !isStyleReadyRef.current ||
      !map.getLayer(SUBNATIONAL_BOUNDARY_LAYER_ID) ||
      !map.getLayer(STATE_LABEL_LAYER_ID)
    ) {
      return;
    }

    if (!selectedCountryIso3) {
      map.setLayoutProperty(SUBNATIONAL_BOUNDARY_LAYER_ID, "visibility", "none");
      map.setLayoutProperty(STATE_LABEL_LAYER_ID, "visibility", "none");
      return;
    }

    map.setLayoutProperty(SUBNATIONAL_BOUNDARY_LAYER_ID, "visibility", "visible");
    map.setLayoutProperty(
      STATE_LABEL_LAYER_ID,
      "visibility",
      selectedCountryIso3 === "USA" ? "visible" : "none",
    );
    const subnationalAdminLevels = selectedCountryIso3 === "USA" ? [4] : [3, 4];
      map.setFilter(SUBNATIONAL_BOUNDARY_LAYER_ID, [
        "all",
        ["match", ["get", "admin_level"], subnationalAdminLevels, true, false],
        ["!=", ["get", "maritime"], 1],
        ["!=", ["get", "disputed"], 1],
        ["!", ["has", "claimed_by"]],
        [
        "any",
        ["==", ["get", "adm0_l"], selectedCountryIso3],
        ["==", ["get", "adm0_r"], selectedCountryIso3],
      ],
    ]);
  }, [selectedCountryIso3]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isStyleReadyRef.current) {
      return;
    }
    if (!activeGuide?.stops?.length || !activeGuideStopSignature) {
      activeGuideCameraKeyRef.current = null;
      return;
    }
    const nextCameraKey = [
      activeGuide.id,
      activeGuideFitNonce,
      activeGuideStopSignature,
      visibleNestedStopParentIds.join(","),
      viewportModeRef.current,
      viewportInsetsRef.current
        ? `${viewportInsetsRef.current.top},${viewportInsetsRef.current.right},${viewportInsetsRef.current.bottom},${viewportInsetsRef.current.left}`
        : "",
    ].join("|");
    if (activeGuideCameraKeyRef.current === nextCameraKey) {
      return;
    }
    activeGuideCameraKeyRef.current = nextCameraKey;
    selectionCameraKeyRef.current = selectionCameraKey;
    const activeViewportInsets = getViewportInsets(map, viewportModeRef.current, viewportInsetsRef.current);
    const focusedStopId = visibleNestedStopParentIds[visibleNestedStopParentIds.length - 1] ?? null;
    const focusedStop = focusedStopId
      ? activeGuide.stops.find((stop) => stop.id === focusedStopId)
      : null;

    if (focusedStop) {
      const [lat, lng] = focusedStop.coordinates;
      const focusedBounds = new LngLatBounds([lng, lat], [lng, lat]);
      for (const place of focusedStop.places ?? []) {
        const [placeLat, placeLng] = place.coordinates;
        focusedBounds.extend([placeLng, placeLat]);
      }
      const focusPadding = clampPaddingToMap(
        map,
        mergePadding({ top: 48, right: 52, bottom: 56, left: 52 }, activeViewportInsets),
      );

      if ((focusedStop.places ?? []).length === 0 || getBoundsArea(focusedBounds) < 0.000001) {
        map.easeTo({
          center: [lng, lat],
          zoom: Math.max(map.getZoom(), 14.2),
          padding: focusPadding,
          duration: 1150,
          easing: smoothCameraEasing,
          essential: true,
        });
        return;
      }

      map.fitBounds(focusedBounds, {
        padding: focusPadding,
        maxZoom: 15.4,
        duration: 1250,
        easing: smoothCameraEasing,
        essential: true,
      });
      return;
    }

    if (activeGuide.stops.length === 1) {
      const [lat, lng] = activeGuide.stops[0].coordinates;
      map.easeTo({
        center: [lng, lat],
        zoom: Math.max(map.getZoom(), 12.4),
        padding: clampPaddingToMap(
          map,
          mergePadding({ top: 36, right: 36, bottom: 36, left: 36 }, activeViewportInsets),
        ),
        duration: 1550,
        easing: smoothCameraEasing,
        essential: true,
      });
      return;
    }

    const guideBounds = new LngLatBounds();
    for (const stop of activeGuide.stops) {
      const [lat, lng] = stop.coordinates;
      guideBounds.extend([lng, lat]);
      for (const place of stop.places ?? []) {
        const [placeLat, placeLng] = place.coordinates;
        guideBounds.extend([placeLng, placeLat]);
      }
    }

    if (guideBounds.isEmpty()) {
      return;
    }

    map.easeTo({
      center: guideBounds.getCenter(),
      zoom: getGuideBoundsZoom(guideBounds),
      padding: clampPaddingToMap(
        map,
        mergePadding({ top: 40, right: 40, bottom: 48, left: 40 }, activeViewportInsets),
      ),
      duration: 1700,
      easing: smoothCameraEasing,
      essential: true,
    });
  }, [
    activeGuide,
    activeGuideFitNonce,
    activeGuideStopSignature,
    selectionCameraKey,
    styleReadyTick,
    visibleNestedStopParentIds,
    viewportInsets,
  ]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isStyleReadyRef.current) {
      return;
    }
    if (viewportMode !== "submit" && activeGuide?.stops?.length) {
      return;
    }
    const nextCameraKey = selectionCameraKey;
    if (selectionCameraKeyRef.current === nextCameraKey) {
      return;
    }
    selectionCameraKeyRef.current = nextCameraKey;
    const activeViewportInsets = getViewportInsets(map, viewportModeRef.current, viewportInsetsRef.current);

    const activeContinent = continents.find((continent) => continent.id === selection.continentId);
    const activeCountryFromContinent = activeContinent?.countries.find(
      (country) => country.id === selection.countryId,
    );
    const activeCountry =
      activeCountryFromContinent ??
      (selection.countryId
        ? continents.flatMap((continent) => continent.countries).find((country) => country.id === selection.countryId)
        : undefined);
    const activeCountrySubarea = activeCountry?.subareas?.find(
      (subarea) => subarea.id === selection.countrySubareaId,
    );
    const activeState = activeCountry?.states?.find((state) => state.id === selection.stateId);
    const activeCity = activeCountry?.cities.find((city) => city.id === selection.cityId);
    const activeSubarea = activeCity?.subareas?.find((subarea) => subarea.id === selection.subareaId);
    const activeNestedSubarea = activeSubarea?.subareas?.find(
      (subarea) => subarea.id === selection.nestedSubareaId,
    );

    if (activeNeighborhoodBoundary?.geometry) {
      const geometryCoordinates = getGeometryCoordinates(activeNeighborhoodBoundary.geometry);

      if (!geometryCoordinates) {
        return;
      }

      const geometryBounds = new LngLatBounds();
      extendBoundsFromCoordinates(geometryBounds, geometryCoordinates);

      if (!geometryBounds.isEmpty()) {
        map.fitBounds(geometryBounds, {
          padding: mergePadding({ top: 36, right: 36, bottom: 36, left: 36 }, activeViewportInsets),
          duration: 2200,
          easing: smoothCameraEasing,
          essential: true,
          maxZoom: activeNestedSubarea ? 13.8 : 12.9,
        });
        return;
      }
    }

    if (activeNestedSubarea) {
      map.easeTo({
        center: [activeNestedSubarea.coordinates[1], activeNestedSubarea.coordinates[0]],
        zoom: activeCity?.name === "New York City" ? 13.2 : 13.4,
        padding: mergePadding({ top: 28, right: 28, bottom: 28, left: 28 }, activeViewportInsets),
        duration: 2100,
        easing: smoothCameraEasing,
        essential: true,
      });
      return;
    }

    if (activeSubarea) {
      map.easeTo({
        center: [activeSubarea.coordinates[1], activeSubarea.coordinates[0]],
        zoom: activeCity?.name === "New York City" ? 11.6 : 12.6,
        padding: mergePadding({ top: 28, right: 28, bottom: 28, left: 28 }, activeViewportInsets),
        duration: 2100,
        easing: smoothCameraEasing,
        essential: true,
      });
      return;
    }

    if (activeCity) {
      if (activeCity.isPlaceholderRegion) {
        if (activeCountry) {
          fitMapToCountry(map, activeCountry.id, activeCountry.bounds, activeViewportInsets, { duration: 2200 });
          return;
        }
      }

      map.easeTo({
        center: [activeCity.coordinates[1], activeCity.coordinates[0]],
        zoom: 11.8,
        padding: mergePadding({ top: 28, right: 28, bottom: 28, left: 28 }, activeViewportInsets),
        duration: 2100,
        easing: smoothCameraEasing,
        essential: true,
      });
      return;
    }

    if (activeState) {
      map.easeTo({
        center: [activeState.coordinates[1], activeState.coordinates[0]],
        zoom: 5.85,
        padding: mergePadding({ top: 28, right: 28, bottom: 28, left: 28 }, activeViewportInsets),
        duration: 2100,
        easing: smoothCameraEasing,
        essential: true,
      });
      return;
    }

    if (activeCountrySubarea) {
      const subareaBounds = activeCountry
        ? getCountrySubareaFocusBounds(activeCountry.id, activeCountrySubarea.id)
        : null;
      if (subareaBounds && !subareaBounds.isEmpty()) {
        map.fitBounds(subareaBounds, {
          padding: mergePadding({ top: 30, right: 30, bottom: 30, left: 30 }, activeViewportInsets),
          duration: 2100,
          easing: smoothCameraEasing,
          essential: true,
          maxZoom: 6.2,
        });
        return;
      }

      map.easeTo({
        center: [activeCountrySubarea.coordinates[1], activeCountrySubarea.coordinates[0]],
        zoom: activeCountry?.id === "usa" ? 4.95 : 6,
        padding: mergePadding({ top: 28, right: 28, bottom: 28, left: 28 }, activeViewportInsets),
        duration: 2100,
        easing: smoothCameraEasing,
        essential: true,
      });
      return;
    }

    if (activeCountry) {
      fitMapToCountry(map, activeCountry.id, activeCountry.bounds, activeViewportInsets);
      return;
    }

    if (activeContinent) {
      fitMapToContinent(map, activeContinent, activeViewportInsets);
      return;
    }

    map.easeTo({
      center: [10, 20],
      zoom: 1.8,
      padding: mergePadding({ top: 24, right: 24, bottom: 24, left: 24 }, activeViewportInsets),
      duration: 2200,
      easing: smoothCameraEasing,
      essential: true,
    });
  }, [
    activeNeighborhoodBoundary,
    activeGuide,
    continents,
    selection,
    styleReadyTick,
    viewportMode,
  ]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isStyleReadyRef.current || !focusedCountryId) {
      return;
    }
    if (activeGuide?.stops?.length) {
      return;
    }
    const isCountryLevelSelection = Boolean(selection.continentId && selection.countryId) &&
      !selection.countrySubareaId &&
      !selection.stateId &&
      !selection.cityId &&
      !selection.subareaId &&
      !selection.nestedSubareaId;
    if (!isCountryLevelSelection || focusedCountryId !== selection.countryId) {
      return;
    }
    const matchedCountry = continents
      .flatMap((continent) => continent.countries)
      .find((country) => country.id === focusedCountryId);
    if (!matchedCountry) {
      return;
    }
    const focusBounds = getCountryFocusBounds(matchedCountry.id, matchedCountry.bounds);
    map.fitBounds(focusBounds, {
      padding: { top: 28, right: 28, bottom: 28, left: 28 },
      duration: 1900,
      easing: smoothCameraEasing,
      essential: true,
      maxZoom: 7.8,
    });
  }, [
    activeGuide,
    continents,
    focusedCountryId,
    focusedCountryNonce,
    selection.cityId,
    selection.continentId,
    selection.countryId,
    selection.countrySubareaId,
    selection.nestedSubareaId,
    selection.stateId,
    selection.subareaId,
    styleReadyTick,
  ]);

  return <div ref={containerRef} className="rguide-map-layer min-h-[60vh] overflow-hidden lg:min-h-[calc(100vh-15rem)]" />;
}
