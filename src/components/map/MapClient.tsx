"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Feature, FeatureCollection, Geometry, LineString, Point } from "geojson";
import type { ExpressionSpecification } from "@maplibre/maplibre-gl-style-spec";
import maplibregl, { GeoJSONSource, LngLatBounds } from "maplibre-gl";
import { LocateFixed, SatelliteAlt } from "@/components/icons/MaterialSymbol";

import { mapLists } from "@/data/lists";
import {
  countryBoundaryFeatures,
  ensureCountryBoundaryHighResLoaded,
  isCountryBoundaryHighResLoaded,
} from "@/data/map-boundaries";
import {
  loadNeighborhoodBoundaryMap,
  type NeighborhoodBoundaryMap,
  type NeighborhoodBoundaryProperties,
} from "@/data/boundary-loaders";
import worldCountries from "@/data/world-countries.json";
import { CATEGORY_STYLES } from "@/lib/constants";
import { Continent, MapList, SelectionState } from "@/types";

type SavedMapLocation = {
  id: string;
  kind: "continent" | "country" | "city" | "neighborhood";
  selection: SelectionState;
};

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
  guideLists?: MapList[];
  visibleGuideMarkerIds?: string[];
  hoveredGuideMarkerId?: string | null;
  savedLocations?: SavedMapLocation[];
  visibleNestedStopParentIds?: string[];
  hoveredStopId?: string | null;
  selectedStopId?: string | null;
  countryToggleMode?: boolean;
  syncSelectionToViewport?: boolean;
  onHoverGuideStop?: (stopId: string | null) => void;
  onSelectGuideStop?: (stopId: string) => void;
  onHoverGuideMarker?: (guideId: string | null) => void;
  onSelectGuideMarker?: (guideId: string) => void;
  onSubmitMapClick?: (coordinates: [number, number]) => void;
  onSelectContinent: (continentId: string) => void;
  onSelectCountry: (continentId: string, countryId: string) => void;
  onSelectCity: (continentId: string, countryId: string, cityId: string) => void;
  onViewportSelectionChange?: (target: MapViewportSelectionTarget) => void;
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
  guideCount: number;
  isPlaceholderRegion: boolean;
  guideHighlighted: boolean;
};

type VisibleGuideCityMarkerFeatureProperties = {
  id: string;
  name: string;
  cityName: string;
  countryName: string;
  continentId: string;
  countryId: string;
  cityId: string;
  guideCount: number;
  categories: MapList["category"][];
  markerImage: string;
  markerDotImage: string;
  showCount: boolean;
};

type NeighborhoodMarkerFeatureProperties = {
  id: string;
  name: string;
  continentId: string;
  countryId: string;
  cityId: string;
  subareaId: string;
  selected: boolean;
};

type GuideStopFeatureProperties = {
  id: string;
  name: string;
  rank: number;
  rankLabel: string;
  markerImage: string;
  category: MapList["category"];
  isNested: boolean;
  isSelected: boolean;
  placesBeenKind: "countries" | "cities" | "places" | "default";
};

type GuideRouteFeatureProperties = {
  id: string;
  category: MapList["category"];
};

type VisibleGuideMarkerFeatureProperties = {
  id: string;
  name: string;
  category: MapList["category"];
  markerImage: string;
  markerDotImage: string;
  markerPreview: boolean;
  markerOffset: [number, number];
  markerOffsetX: number;
  markerOffsetY: number;
  renderPriority: number;
  enteredAt: number;
  popProgress: number;
  hoverProgress: number;
};

type PoiMapMarkerFeatureProperties = {
  id: string;
  stopId: string;
  name: string;
  category: MapList["category"];
  markerKind: "geometry" | "neighborhood-boundary";
  active: boolean;
};

type SavedLocationFeatureProperties = {
  id: string;
  kind: SavedMapLocation["kind"];
};

type MapViewportInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type MapViewportSelectionTarget = {
  continentId: string;
  countryId: string;
  cityId?: string;
};

type ViewportCitySelectionFeatureProperties = {
  continentId: string;
  countryId: string;
  cityId: string;
};

type RGuideMapPerfMetrics = {
  startedAt: number;
  sourceSetDataCounts: Record<string, number>;
  resizeCount: number;
  cameraCount: number;
  events: Array<{ name: string; at: number; detail?: string }>;
  maxRenderGap: number;
  lastRenderAt: number | null;
};

declare global {
  interface Window {
    __rguideMapPerf?: RGuideMapPerfMetrics;
  }
}

const worldCountrySeeds = worldCountries as unknown as WorldCountrySeed[];
const worldCountryCenters = new Map(worldCountrySeeds.map((country) => [country.id, country.coordinates]));
const worldCountryIso3 = new Map(
  worldCountrySeeds
    .filter((country) => typeof country.feature?.id === "string")
    .map((country) => [country.id, country.feature.id as string]),
);
const EMPTY_NEIGHBORHOOD_BOUNDARY_LOOKUP: NeighborhoodBoundaryMap = {};

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";
const SATELLITE_SOURCE_ID = "satellite-imagery";
const SATELLITE_LAYER_ID = "satellite-imagery-layer";
const COUNTRY_SOURCE_ID = "countries";
const CONTINENT_LABEL_SOURCE_ID = "continent-labels";
const CITY_SOURCE_ID = "cities";
const NEIGHBORHOOD_MARKER_SOURCE_ID = "neighborhood-markers";
const SAVED_LOCATION_SOURCE_ID = "saved-locations";
const GUIDE_ROUTE_SOURCE_ID = "guide-route";
const VISIBLE_GUIDE_MARKER_SOURCE_ID = "visible-guide-markers";
const VISIBLE_GUIDE_MARKER_POINT_LAYER_ID = "visible-guide-marker-point";
const VISIBLE_GUIDE_CITY_MARKER_SOURCE_ID = "visible-guide-city-markers";
const VISIBLE_GUIDE_CITY_MARKER_DOT_LAYER_ID = "visible-guide-city-marker-dot";
const VISIBLE_GUIDE_CITY_MARKER_POINT_LAYER_ID = "visible-guide-city-marker-point";
const VISIBLE_GUIDE_CITY_MARKER_HIT_LAYER_ID = "visible-guide-city-marker-hit";
const VISIBLE_GUIDE_CITY_MARKER_HOVER_LAYER_ID = "visible-guide-city-marker-hover";
const GUIDE_STOP_SOURCE_ID = "guide-stops";
const POI_MAP_MARKER_SOURCE_ID = "poi-map-markers";
const STATE_LABEL_SOURCE_ID = "state-labels";
const NEIGHBORHOOD_BOUNDARY_SOURCE_ID = "neighborhood-boundaries";
const SELECTED_BOUNDARY_LAYER_ID = "selected-country-boundary";
const SUBNATIONAL_BOUNDARY_LAYER_ID = "selected-country-subnational-boundary";
const STATE_LABEL_LAYER_ID = "state-label-layer";
const BASE_COUNTRY_LABEL_LAYER_IDS = ["label_country_1", "label_country_2", "label_country_3"] as const;
const SHOULD_RECORD_MAP_PERF = process.env.NODE_ENV !== "production";
const MAX_MAP_PERF_EVENTS = 180;
const COUNTRY_GEOJSON_SOURCE_OPTIONS = { buffer: 128, maxzoom: 6, tolerance: 0.5 } as const;
const POINT_GEOJSON_SOURCE_OPTIONS = { buffer: 0 } as const;
const VIEWPORT_CITY_ENTER_ZOOM = 8.85;
const VIEWPORT_CITY_EXIT_ZOOM = 8.15;
const VIEWPORT_SELECTION_CAMERA_SUPPRESSION_MS = 1400;
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
  "Routes",
  CATEGORY_STYLES.Routes.mapColor,
  "Essentials",
  CATEGORY_STYLES.Essentials.mapColor,
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
  "Routes",
  CATEGORY_STYLES.Routes.poiColor,
  "Essentials",
  CATEGORY_STYLES.Essentials.poiColor,
  CATEGORY_STYLES.Activities.poiColor,
] as ExpressionSpecification;
const GUIDE_STOP_DOT_BASE_RADIUS = { lowZoom: 9, highZoom: 11.4 } as const;
const GUIDE_STOP_CITY_DOT_SCALE = 0.794;
const NESTED_POI_DIAMOND_FILL = "#c2410c";
const POI_DIAMOND_IMAGE_PREFIX = "poi-diamond";
const POI_DIAMOND_PULSE_IMAGE_PREFIX = "poi-diamond-pulse";
const GUIDE_STOP_MARKER_IMAGE_PREFIX = "guide-stop-marker";
const VISIBLE_GUIDE_MARKER_IMAGE_PREFIX = "visible-guide-marker";
const VISIBLE_GUIDE_CITY_MARKER_IMAGE_PREFIX = "visible-guide-city-marker";
const VISIBLE_GUIDE_MARKER_HOVER_SIZE_BOOST = 0.26;
const POI_DIAMOND_PULSE_ICON_IMAGE_MATCH = [
  "match",
  ["get", "category"],
  "Food",
  getPoiDiamondPulseImageName("Food"),
  "Nightlife",
  getPoiDiamondPulseImageName("Nightlife"),
  "Culture",
  getPoiDiamondPulseImageName("Culture"),
  "Stay",
  getPoiDiamondPulseImageName("Stay"),
  "Nature",
  getPoiDiamondPulseImageName("Nature"),
  "Activities",
  getPoiDiamondPulseImageName("Activities"),
  "Routes",
  getPoiDiamondPulseImageName("Routes"),
  "Essentials",
  getPoiDiamondPulseImageName("Essentials"),
  getPoiDiamondPulseImageName("Activities"),
] as ExpressionSpecification;
const BASE_TRANSIT_STOP_OPACITY_BY_ZOOM = [
  "interpolate",
  ["linear"],
  ["zoom"],
  12.6,
  0,
  13.4,
  0.8,
] as const;
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

function isPointInLinearRing(point: [number, number], ring: number[][]) {
  const [lng, lat] = point;
  let inside = false;

  for (let index = 0, previousIndex = ring.length - 1; index < ring.length; previousIndex = index++) {
    const [currentLng, currentLat] = ring[index];
    const [previousLng, previousLat] = ring[previousIndex];
    const crossesLatitude = currentLat > lat !== previousLat > lat;
    const intersectionLng =
      ((previousLng - currentLng) * (lat - currentLat)) / (previousLat - currentLat) + currentLng;

    if (crossesLatitude && lng < intersectionLng) {
      inside = !inside;
    }
  }

  return inside;
}

function isPointInPolygon(point: [number, number], polygon: number[][][]) {
  const [outerRing, ...holes] = polygon;
  return Boolean(
    outerRing &&
      isPointInLinearRing(point, outerRing) &&
      !holes.some((ring) => isPointInLinearRing(point, ring)),
  );
}

function getCountryAtPoint(continents: Continent[], point: [number, number]) {
  for (const continent of continents) {
    for (const country of continent.countries) {
      const geometry = countryBoundaryFeatures[country.id]?.geometry;
      const containsPoint =
        geometry?.type === "Polygon"
          ? isPointInPolygon(point, geometry.coordinates)
          : geometry?.type === "MultiPolygon"
            ? geometry.coordinates.some((polygon) => isPointInPolygon(point, polygon))
            : false;

      if (containsPoint) {
        return { continentId: continent.id, countryId: country.id };
      }
    }
  }

  return null;
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

function getDistanceKmBetweenLngLat(
  first: [number, number],
  second: [number, number],
) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const [firstLng, firstLat] = first;
  const [secondLng, secondLat] = second;
  const deltaLat = toRadians(secondLat - firstLat);
  const deltaLng = toRadians(secondLng - firstLng);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(firstLat)) *
      Math.cos(toRadians(secondLat)) *
      Math.sin(deltaLng / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getGuideCityKey(countryName: string, cityName: string) {
  return `${normalizeLabelName(countryName)}::${normalizeLabelName(cityName)}`;
}

function getGuideCityKeys(guideLists: MapList[]) {
  return new Set(
    guideLists
      .map((list) => {
        const cityName = list.location.city;
        const countryName = list.location.country;
        return cityName && countryName ? getGuideCityKey(countryName, cityName) : null;
      })
      .filter((value): value is string => Boolean(value)),
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

function resetCameraPadding(map: maplibregl.Map) {
  map.setPadding({ top: 0, right: 0, bottom: 0, left: 0 });
}

function createMapPerfMetrics(): RGuideMapPerfMetrics {
  const now = performance.now();

  return {
    startedAt: now,
    sourceSetDataCounts: {},
    resizeCount: 0,
    cameraCount: 0,
    events: [],
    maxRenderGap: 0,
    lastRenderAt: null,
  };
}

function resetMapPerfMetrics() {
  if (!SHOULD_RECORD_MAP_PERF || typeof window === "undefined" || typeof performance === "undefined") {
    return null;
  }

  window.__rguideMapPerf = createMapPerfMetrics();
  return window.__rguideMapPerf;
}

function getMapPerfMetrics() {
  if (!SHOULD_RECORD_MAP_PERF || typeof window === "undefined" || typeof performance === "undefined") {
    return null;
  }

  if (!window.__rguideMapPerf) {
    window.__rguideMapPerf = createMapPerfMetrics();
  }

  return window.__rguideMapPerf;
}

function recordMapPerfEvent(name: string, detail?: string) {
  const metrics = getMapPerfMetrics();
  if (!metrics) {
    return;
  }

  metrics.events.push({ name, at: Math.round(performance.now() - metrics.startedAt), detail });
  if (metrics.events.length > MAX_MAP_PERF_EVENTS) {
    metrics.events.splice(0, metrics.events.length - MAX_MAP_PERF_EVENTS);
  }
}

function recordMapSourceSetData(sourceId: string) {
  const metrics = getMapPerfMetrics();
  if (!metrics) {
    return;
  }

  metrics.sourceSetDataCounts[sourceId] = (metrics.sourceSetDataCounts[sourceId] ?? 0) + 1;
}

function recordMapResize(reason: string) {
  const metrics = getMapPerfMetrics();
  if (!metrics) {
    return;
  }

  metrics.resizeCount += 1;
  recordMapPerfEvent("map:resize", reason);
}

function recordMapCamera(kind: string, detail?: string) {
  const metrics = getMapPerfMetrics();
  if (!metrics) {
    return;
  }

  metrics.cameraCount += 1;
  recordMapPerfEvent(`camera:${kind}`, detail);
}

function recordMapRenderGap() {
  const metrics = getMapPerfMetrics();
  if (!metrics) {
    return;
  }

  const now = performance.now();
  if (metrics.lastRenderAt !== null) {
    metrics.maxRenderGap = Math.max(metrics.maxRenderGap, Math.round(now - metrics.lastRenderAt));
  }
  metrics.lastRenderAt = now;
}

function setGeoJsonSourceData(
  map: maplibregl.Map,
  sourceId: string,
  data: Parameters<GeoJSONSource["setData"]>[0],
) {
  const source = map.getSource(sourceId) as GeoJSONSource | undefined;
  if (!source) {
    return;
  }

  recordMapSourceSetData(sourceId);
  source.setData(data);
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
  resetCameraPadding(map);
  const preset = countryFocusPresets[countryId];

  if (preset) {
    recordMapCamera("country:preset", countryId);
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
  recordMapCamera("country:bounds", countryId);
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
  resetCameraPadding(map);
  const preset = continentFocusPresets[continent.id];

  if (preset) {
    recordMapCamera("continent:preset", continent.id);
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

  recordMapCamera("continent:bounds", continent.id);
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

function trySetBasePaintProperty(
  map: maplibregl.Map,
  layerId: string,
  property: string,
  value: unknown,
) {
  try {
    map.setPaintProperty(layerId, property, value as never);
  } catch {
    // Basemap styles vary by layer; skip layers that do not accept a cosmetic override.
  }
}

function trySetBaseLayoutProperty(
  map: maplibregl.Map,
  layerId: string,
  property: string,
  value: unknown,
) {
  try {
    map.setLayoutProperty(layerId, property, value as never);
  } catch {
    // Basemap styles vary by layer; skip layers that do not accept a cosmetic override.
  }
}

function coolBaseMapGround(map: maplibregl.Map) {
  const styleLayers = map.getStyle().layers ?? [];

  for (const layer of styleLayers) {
    const layerSpec = layer as { source?: string; type?: string; id: string; ["source-layer"]?: string };
    const sourceLayer = (layerSpec["source-layer"] ?? "").toLowerCase();
    const layerId = layerSpec.id.toLowerCase();

    if (layerSpec.type === "background") {
      trySetBasePaintProperty(map, layerSpec.id, "background-color", "#eee9df");
      continue;
    }

    if (layerSpec.source !== "openmaptiles" || layerSpec.type !== "fill") {
      continue;
    }

    const isParkOrGreen =
      sourceLayer.includes("park") ||
      sourceLayer.includes("landcover") ||
      layerId.includes("park") ||
      layerId.includes("wood") ||
      layerId.includes("grass") ||
      layerId.includes("green");
    const isLandSurface =
      sourceLayer.includes("landuse") ||
      sourceLayer.includes("landcover") ||
      layerId.includes("land") ||
      layerId.includes("earth") ||
      layerId.includes("background");

    if (isParkOrGreen) {
      continue;
    }

    if (isLandSurface) {
      trySetBasePaintProperty(map, layerSpec.id, "fill-color", "#efe9df");
      trySetBasePaintProperty(map, layerSpec.id, "fill-opacity", 0.86);
    }
  }
}

function boostBaseRoadContrast(map: maplibregl.Map) {
  const styleLayers = map.getStyle().layers ?? [];

  for (const layer of styleLayers) {
    const layerSpec = layer as { source?: string; type?: string; id: string; ["source-layer"]?: string };
    const sourceLayer = (layerSpec["source-layer"] ?? "").toLowerCase();
    const layerId = layerSpec.id.toLowerCase();
    const isTransportationLine =
      layerSpec.source === "openmaptiles" &&
      layerSpec.type === "line" &&
      (sourceLayer.includes("transportation") ||
        layerId.includes("road") ||
        layerId.includes("street") ||
        layerId.includes("highway") ||
        layerId.includes("path"));
    const isTransitLine =
      layerId.includes("rail") ||
      layerId.includes("transit") ||
      layerId.includes("subway") ||
      layerId.includes("tram") ||
      layerId.includes("metro") ||
      layerId.includes("ferry") ||
      layerId.includes("aerialway");

    if (!isTransportationLine || isTransitLine) {
      continue;
    }

    const isMajorRoad =
      layerId.includes("highway") ||
      layerId.includes("trunk") ||
      layerId.includes("primary") ||
      layerId.includes("secondary") ||
      layerId.includes("major");
    const isRoadCasing =
      layerId.includes("case") ||
      layerId.includes("casing") ||
      layerId.includes("outline") ||
      layerId.includes("border");

    if (isRoadCasing) {
      trySetBasePaintProperty(map, layerSpec.id, "line-color", isMajorRoad ? "#d9bd78" : "#d1c7b5");
      trySetBasePaintProperty(map, layerSpec.id, "line-opacity", isMajorRoad ? 0.62 : 0.5);
      continue;
    }

    trySetBasePaintProperty(map, layerSpec.id, "line-color", isMajorRoad ? "#f4d98b" : "#f8fafc");
    trySetBasePaintProperty(map, layerSpec.id, "line-opacity", isMajorRoad ? 0.9 : 0.8);
  }
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
      trySetBasePaintProperty(map, layerSpec.id, "icon-opacity", 0);
      continue;
    }

    if (layerSpec.type === "circle") {
      trySetBasePaintProperty(map, layerSpec.id, "circle-opacity", 0);
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

    trySetBaseLayoutProperty(map, layerSpec.id, "visibility", "none");
  }
}

function softenBaseTransitStops(map: maplibregl.Map) {
  const styleLayers = map.getStyle().layers ?? [];

  for (const layer of styleLayers) {
    const layerSpec = layer as { source?: string; type?: string; id: string; ["source-layer"]?: string };
    const sourceLayer = (layerSpec["source-layer"] ?? "").toLowerCase();
    const layerId = layerSpec.id.toLowerCase();
    const isTransitStopLayer =
      sourceLayer.includes("transportation") ||
      sourceLayer.includes("transit") ||
      layerId.includes("transit") ||
      layerId.includes("station") ||
      layerId.includes("subway") ||
      layerId.includes("metro") ||
      layerId.includes("tram") ||
      layerId.includes("bus") ||
      layerId.includes("rail") ||
      layerId.includes("platform") ||
      layerId.includes("stop");

    if (layerSpec.source !== "openmaptiles" || !isTransitStopLayer) {
      continue;
    }

    if (layerSpec.type === "symbol") {
      trySetBasePaintProperty(map, layerSpec.id, "icon-opacity", BASE_TRANSIT_STOP_OPACITY_BY_ZOOM);
      trySetBasePaintProperty(map, layerSpec.id, "text-opacity", BASE_TRANSIT_STOP_OPACITY_BY_ZOOM);
      continue;
    }

    if (layerSpec.type === "circle") {
      trySetBasePaintProperty(map, layerSpec.id, "circle-opacity", BASE_TRANSIT_STOP_OPACITY_BY_ZOOM);
    }
  }
}

function getPoiDiamondImageName(category: string, label?: string) {
  const labelKey = label ? `-${label.replace(/[^a-z0-9]/gi, "-").toLowerCase()}` : "";
  return `${POI_DIAMOND_IMAGE_PREFIX}-${category.toLowerCase()}${labelKey}`;
}

function getPoiDiamondPulseImageName(category: string) {
  return `${POI_DIAMOND_PULSE_IMAGE_PREFIX}-${category.toLowerCase()}`;
}

function getGuideStopMarkerImageName(category: string, label: string) {
  return `${GUIDE_STOP_MARKER_IMAGE_PREFIX}-${category.toLowerCase()}-${label.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`;
}

function getVisibleGuideMarkerImageName(category: string) {
  return `${VISIBLE_GUIDE_MARKER_IMAGE_PREFIX}-${category.toLowerCase()}`;
}

function getVisibleGuideMarkerDotImageName(category: string) {
  return `${VISIBLE_GUIDE_MARKER_IMAGE_PREFIX}-dot-${category.toLowerCase()}`;
}

function getVisibleGuideCityMarkerImageName(guideCount: number, categories: MapList["category"][]) {
  const categoryKey = [...new Set(categories)].sort().join("-").toLowerCase() || "mixed";
  return `${VISIBLE_GUIDE_CITY_MARKER_IMAGE_PREFIX}-${Math.min(guideCount, 99)}-${categoryKey}`;
}

function getVisibleGuideCityDotImageName(categories: MapList["category"][]) {
  const categoryKey = [...new Set(categories)].sort().join("-").toLowerCase() || "mixed";
  return `${VISIBLE_GUIDE_CITY_MARKER_IMAGE_PREFIX}-dot-${categoryKey}`;
}

type LucideIconNode = Array<[
  "path" | "circle" | "line",
  Record<string, string>,
]>;

const VISIBLE_GUIDE_MARKER_ICON_NODES: Record<MapList["category"], LucideIconNode> = {
  Food: [
    ["path", { d: "m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" }],
    ["path", { d: "M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7" }],
    ["path", { d: "m2.1 21.8 6.4-6.3" }],
    ["path", { d: "m19 5-7 7" }],
  ],
  Nightlife: [
    ["path", { d: "M18 5h4" }],
    ["path", { d: "M20 3v4" }],
    ["path", { d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" }],
  ],
  Culture: [
    ["path", { d: "M10 18v-7" }],
    ["path", { d: "M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" }],
    ["path", { d: "M14 18v-7" }],
    ["path", { d: "M18 18v-7" }],
    ["path", { d: "M3 22h18" }],
    ["path", { d: "M6 18v-7" }],
  ],
  Stay: [
    ["path", { d: "M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" }],
    ["path", { d: "M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" }],
    ["path", { d: "M12 4v6" }],
    ["path", { d: "M2 18h20" }],
  ],
  Nature: [
    ["path", { d: "M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z" }],
    ["path", { d: "M7 16v6" }],
    ["path", { d: "M13 19v3" }],
    ["path", { d: "M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5" }],
  ],
  Activities: [
    ["path", { d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" }],
    ["path", { d: "M20 2v4" }],
    ["path", { d: "M22 4h-4" }],
    ["circle", { cx: "4", cy: "20", r: "2" }],
  ],
  Routes: [
    ["path", { d: "M12 17v4" }],
    ["path", { d: "M12 5V3" }],
    ["path", { d: "M12 9v3" }],
    ["path", { d: "M2.077 18.449A2 2 0 0 0 4 21h16a2 2 0 0 0 1.924-2.55l-4-14A2 2 0 0 0 16 3H8a2 2 0 0 0-1.924 1.45z" }],
  ],
  Essentials: [
    ["path", { d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" }],
    ["line", { x1: "12", x2: "12", y1: "16", y2: "12" }],
    ["line", { x1: "12", x2: "12.01", y1: "8", y2: "8" }],
  ],
};

function drawCategoryIcon(ctx: CanvasRenderingContext2D, category: MapList["category"], centerX: number, centerY: number) {
  ctx.save();
  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = 2.35;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.translate(centerX - 12, centerY - 12);
  ctx.scale(1, 1);

  for (const [tag, attrs] of VISIBLE_GUIDE_MARKER_ICON_NODES[category]) {
    if (tag === "path" && typeof Path2D !== "undefined") {
      ctx.stroke(new Path2D(attrs.d));
    } else if (tag === "circle") {
      ctx.beginPath();
      ctx.arc(Number(attrs.cx), Number(attrs.cy), Number(attrs.r), 0, Math.PI * 2);
      ctx.stroke();
    } else if (tag === "line") {
      ctx.beginPath();
      ctx.moveTo(Number(attrs.x1), Number(attrs.y1));
      ctx.lineTo(Number(attrs.x2), Number(attrs.y2));
      ctx.stroke();
    }
  }

  ctx.restore();
}

function createVisibleGuideMarkerImage(category: MapList["category"]) {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { width: size, height: size, data: new Uint8Array(size * size * 4) };
  }

  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.fillStyle = CATEGORY_STYLES[category].mapColor;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.arc(0, 0, 20.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  drawCategoryIcon(ctx, category, size / 2, size / 2);

  return ctx.getImageData(0, 0, size, size);
}

function createVisibleGuideMarkerDotImage(category: MapList["category"]) {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { width: size, height: size, data: new Uint8Array(size * size * 4) };
  }

  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.fillStyle = CATEGORY_STYLES[category].mapColor;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 9.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  return ctx.getImageData(0, 0, size, size);
}

function addVisibleGuideMarkerImages(map: maplibregl.Map) {
  Object.keys(CATEGORY_STYLES).forEach((category) => {
    const typedCategory = category as MapList["category"];
    const imageName = getVisibleGuideMarkerImageName(category);
    const imageData = createVisibleGuideMarkerImage(typedCategory);
    if (map.hasImage(imageName)) {
      map.updateImage(imageName, imageData);
    } else {
      map.addImage(imageName, imageData, { pixelRatio: 2 });
    }

    const dotImageName = getVisibleGuideMarkerDotImageName(category);
    const dotImageData = createVisibleGuideMarkerDotImage(typedCategory);
    if (map.hasImage(dotImageName)) {
      map.updateImage(dotImageName, dotImageData);
    } else {
      map.addImage(dotImageName, dotImageData, { pixelRatio: 2 });
    }
  });
}

function createVisibleGuideCityMarkerImage(guideCount: number, categories: MapList["category"][]) {
  const size = 56;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { width: size, height: size, data: new Uint8Array(size * size * 4) };
  }

  const center = size / 2;
  const radius = 18;
  const colors = [...new Set(categories)].map((category) => CATEGORY_STYLES[category].mapColor);
  const ringColors = colors.length ? colors : ["#0f172a"];
  const gap = Math.PI / 44;
  const arcSize = (Math.PI * 2) / ringColors.length;

  ctx.save();
  ctx.shadowColor = "rgba(15, 23, 42, 0.18)";
  ctx.shadowBlur = 7;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = "rgba(255, 255, 255, 0.96)";
  ctx.beginPath();
  ctx.arc(center, center, radius - 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.lineWidth = 4.2;
  ctx.lineCap = "round";
  ringColors.forEach((color, index) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(
      center,
      center,
      radius,
      -Math.PI / 2 + index * arcSize + gap,
      -Math.PI / 2 + (index + 1) * arcSize - gap,
    );
    ctx.stroke();
  });
  ctx.restore();

  ctx.fillStyle = "#0b1020";
  ctx.font = `${guideCount > 99 ? "700 11px" : guideCount > 9 ? "750 13px" : "800 14px"} Inter, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(guideCount > 99 ? "99+" : String(guideCount), center, center + 0.4);

  return ctx.getImageData(0, 0, size, size);
}

function createVisibleGuideCityDotImage(categories: MapList["category"][]) {
  const size = 32;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { width: size, height: size, data: new Uint8Array(size * size * 4) };
  }

  const center = size / 2;
  const radius = 5.6;
  const colors = [...new Set(categories)].map((category) => CATEGORY_STYLES[category].mapColor);
  const dotColors = colors.length ? colors : ["#0f172a"];

  ctx.save();
  const gradient = ctx.createRadialGradient(center - 2, center - 2, 1, center, center, radius + 2);
  dotColors.forEach((color, index) => {
    gradient.addColorStop(dotColors.length === 1 ? 0 : index / (dotColors.length - 1), color);
  });
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  return ctx.getImageData(0, 0, size, size);
}

function ensureVisibleGuideCityMarkerImages(
  map: maplibregl.Map,
  data: FeatureCollection<Point, VisibleGuideCityMarkerFeatureProperties>,
) {
  data.features.forEach((feature) => {
    const imageName = feature.properties.markerImage;
    if (!map.hasImage(imageName)) {
      map.addImage(imageName, createVisibleGuideCityMarkerImage(feature.properties.guideCount, feature.properties.categories), {
        pixelRatio: 2,
      });
    }
    const dotImageName = feature.properties.markerDotImage;
    if (!map.hasImage(dotImageName)) {
      map.addImage(dotImageName, createVisibleGuideCityDotImage(feature.properties.categories), {
        pixelRatio: 2,
      });
    }
  });
}

function ensureVisibleGuideMarkerImages(map: maplibregl.Map) {
  const hasAllImages = Object.keys(CATEGORY_STYLES).every((category) =>
    map.hasImage(getVisibleGuideMarkerImageName(category)),
  );
  if (!hasAllImages) {
    addVisibleGuideMarkerImages(map);
  }
}

function createGuideStopMarkerImage(color: string, label: string) {
  const size = 64;
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
  ctx.lineWidth = 3.4;
  ctx.beginPath();
  ctx.arc(0, 0, 23, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.font = label.length > 1 ? "700 22px 'Noto Sans', Arial, sans-serif" : "700 25px 'Noto Sans', Arial, sans-serif";
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
  const imageData = createGuideStopMarkerImage(CATEGORY_STYLES[category].mapColor, label);
  if (map.hasImage(imageName)) {
    map.updateImage(imageName, imageData);
    return;
  }
  map.addImage(imageName, imageData, { pixelRatio: 2 });
}

function ensureGuideStopMarkerImages(map: maplibregl.Map, guideStopData: FeatureCollection<Point, GuideStopFeatureProperties>) {
  for (const feature of guideStopData.features) {
    if (feature.properties.isNested) {
      const imageData = createPoiDiamondImage(
        CATEGORY_STYLES[feature.properties.category].mapColor,
        feature.properties.rankLabel,
      );
      if (map.hasImage(feature.properties.markerImage)) {
        map.updateImage(feature.properties.markerImage, imageData);
      } else {
        map.addImage(feature.properties.markerImage, imageData, { pixelRatio: 2 });
      }
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

function createPoiDiamondImage(strokeColor: string, label?: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 76;
  canvas.height = 76;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { width: 76, height: 76, data: new Uint8Array(76 * 76 * 4) };
  }

  ctx.save();
  ctx.translate(38, 38);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = NESTED_POI_DIAMOND_FILL;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 3;

  const size = 42;
  const radius = 7;
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

  if (label) {
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.font = label.length > 1 ? "700 16px 'Noto Sans', Arial, sans-serif" : "700 19px 'Noto Sans', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 38, 38.5);
    ctx.restore();
  }

  return ctx.getImageData(0, 0, 76, 76);
}

function createPoiDiamondPulseImage(color: string) {
  const size = 88;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { width: size, height: size, data: new Uint8Array(size * size * 4) };
  }

  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.rotate(Math.PI / 4);

  const drawDiamond = (diamondSize: number, radius: number) => {
    const half = diamondSize / 2;
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
  };

  ctx.globalAlpha = 0.9;
  ctx.strokeStyle = color;
  ctx.lineWidth = 4.5;
  drawDiamond(44, 8);
  ctx.stroke();

  ctx.globalAlpha = 0.34;
  ctx.lineWidth = 2.5;
  drawDiamond(50, 9);
  ctx.stroke();
  ctx.restore();

  return ctx.getImageData(0, 0, size, size);
}

function addPoiDiamondImages(map: maplibregl.Map) {
  Object.entries(CATEGORY_STYLES).forEach(([category, style]) => {
    const imageName = getPoiDiamondImageName(category);
    const imageData = createPoiDiamondImage(style.mapColor);
    if (map.hasImage(imageName)) {
      map.updateImage(imageName, imageData);
    } else {
      map.addImage(imageName, imageData, { pixelRatio: 2 });
    }

    const pulseImageName = getPoiDiamondPulseImageName(category);
    const pulseImageData = createPoiDiamondPulseImage(style.mapColor);
    if (map.hasImage(pulseImageName)) {
      map.updateImage(pulseImageName, pulseImageData);
    } else {
      map.addImage(pulseImageName, pulseImageData, { pixelRatio: 2 });
    }
  });
}

function createGuideStopData(
  activeGuide?: MapList | null,
  visibleNestedStopParentIds: string[] = [],
  selectedStopId?: string | null,
  hoveredStopId?: string | null,
): FeatureCollection<Point, GuideStopFeatureProperties> {
  const visibleNestedParentSet = new Set(visibleNestedStopParentIds);
  for (const stop of activeGuide?.stops ?? []) {
    if ((stop.places ?? []).some((place) => place.id === selectedStopId || place.id === hoveredStopId)) {
      visibleNestedParentSet.add(stop.id);
    }
  }
  const features = (activeGuide?.stops ?? []).flatMap((stop, index) => {
    const stopCategory = stop.category ?? activeGuide?.category ?? "Activities";
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
        markerImage: getGuideStopMarkerImageName(stopCategory, String(index + 1)),
        category: stopCategory,
        isNested: false,
        isSelected: stop.id === selectedStopId,
        placesBeenKind,
      },
      geometry: {
        type: "Point" as const,
        coordinates: [stop.coordinates[1], stop.coordinates[0]],
      },
    };
    const nestedPlaceCount = stop.places?.length ?? 0;
    const shouldShowNestedFeatures = visibleNestedParentSet.has(stop.id) && nestedPlaceCount > 0;
    const nestedFeatures = shouldShowNestedFeatures ? (stop.places ?? []).map((place, placeIndex) => {
      const rankLabel = String.fromCharCode(65 + (placeIndex % 26));
      const category = place.category ?? stopCategory;
      return {
        type: "Feature" as const,
        properties: {
          id: place.id,
          name: place.name,
          rank: index + 1 + (placeIndex + 1) / 100,
          rankLabel,
          markerImage: getPoiDiamondImageName(category, rankLabel),
          category,
          isNested: true,
          isSelected: place.id === selectedStopId,
          placesBeenKind: "default" as const,
        },
        geometry: {
          type: "Point" as const,
          coordinates: [place.coordinates[1], place.coordinates[0]],
        },
      };
    }) : [];
    return shouldShowNestedFeatures ? [parentFeature, ...nestedFeatures] : [parentFeature];
  });
  const nestedCoordinates = features
    .filter((feature) => feature.properties.isNested)
    .map((feature) => feature.geometry.coordinates);
  const visibleFeatures = nestedCoordinates.length
    ? features.filter((feature) => {
        if (feature.properties.isNested) {
          return true;
        }
        const [lng, lat] = feature.geometry.coordinates;
        return !nestedCoordinates.some(
          ([nestedLng, nestedLat]) => Math.abs(nestedLng - lng) < 0.00005 && Math.abs(nestedLat - lat) < 0.00005,
        );
      })
    : features;
  return {
    type: "FeatureCollection",
    features: visibleFeatures,
  };
}

function createVisibleGuideMarkerData(
  guideLists: MapList[],
  visibleGuideMarkerIds: string[] = [],
  activeGuide?: MapList | null,
  selection?: SelectionState,
  markerEnteredAt?: Map<string, number>,
  markerHoverProgress?: Map<string, number>,
): FeatureCollection<Point, VisibleGuideMarkerFeatureProperties> {
  const visibleGuideIdSet = new Set(visibleGuideMarkerIds);
  const activeGuideId = activeGuide?.id ?? null;
  const now = typeof performance !== "undefined" ? performance.now() : Date.now();
  const isCitywideView = Boolean(selection?.cityId && !selection.subareaId && !selection.nestedSubareaId);
  const features = guideLists.flatMap((guide) => {
    const firstStop = guide.stops[0];
    if (!firstStop || !visibleGuideIdSet.has(guide.id) || guide.id === activeGuideId) {
      return [];
    }

    const isNeighborhoodGuide = guide.location.scope === "neighborhood" || Boolean(guide.location.neighborhood);

    return [{
      type: "Feature" as const,
      properties: {
        id: guide.id,
        name: guide.title,
        category: guide.category,
        markerImage: getVisibleGuideMarkerImageName(guide.category),
        markerDotImage: getVisibleGuideMarkerDotImageName(guide.category),
        markerPreview: isCitywideView && isNeighborhoodGuide,
        markerOffset: [0, 0] as [number, number],
        markerOffsetX: 0,
        markerOffsetY: 0,
        renderPriority: isNeighborhoodGuide ? 10 : 20,
        enteredAt: markerEnteredAt?.get(guide.id) ?? 0,
        popProgress: Math.min(1, Math.max(0, (now - (markerEnteredAt?.get(guide.id) ?? now)) / 320)),
        hoverProgress: markerHoverProgress?.get(guide.id) ?? 0,
      },
      geometry: {
        type: "Point" as const,
        coordinates: [firstStop.coordinates[1], firstStop.coordinates[0]],
      },
    }];
  });

  const collisionGroups = new Map<string, Feature<Point, VisibleGuideMarkerFeatureProperties>[]>();
  features.forEach((feature) => {
    const [lng, lat] = feature.geometry.coordinates;
    const key = `${lng.toFixed(6)}|${lat.toFixed(6)}`;
    const group = collisionGroups.get(key);
    if (group) {
      group.push(feature);
    } else {
      collisionGroups.set(key, [feature]);
    }
  });

  collisionGroups.forEach((group) => {
    if (group.length <= 1) {
      return;
    }

    const orderedGroup = group
      .slice()
      .sort((left, right) => right.properties.renderPriority - left.properties.renderPriority);
    const hasCitywideGuide = orderedGroup.some((feature) => feature.properties.renderPriority >= 20);
    const ringCount = hasCitywideGuide ? orderedGroup.length - 1 : orderedGroup.length;
    const ringRadius = orderedGroup.length > 4 ? 20 : 16;

    orderedGroup.forEach((feature, index) => {
      const shouldCenter = hasCitywideGuide && index === 0;
      if (shouldCenter) {
        feature.properties.markerOffsetX = 0;
        feature.properties.markerOffsetY = 0;
        feature.properties.markerOffset = [0, 0];
        feature.properties.renderPriority = 100;
        return;
      }

      const ringIndex = hasCitywideGuide ? index - 1 : index;
      const angle = -Math.PI / 2 + (Math.PI * 2 * ringIndex) / Math.max(1, ringCount);
      feature.properties.markerOffsetX = Math.round(Math.cos(angle) * ringRadius);
      feature.properties.markerOffsetY = Math.round(Math.sin(angle) * ringRadius);
      feature.properties.markerOffset = [feature.properties.markerOffsetX, feature.properties.markerOffsetY];
      feature.properties.renderPriority += Math.max(0, 20 - ringIndex);
    });
  });

  return {
    type: "FeatureCollection",
    features,
  };
}

function findGuideCityRef(continents: Continent[], guide: MapList) {
  const guideCity = normalizeLabelName(guide.location.city ?? "");
  const guideCountry = normalizeLabelName(guide.location.country ?? "");
  const guideContinent = normalizeLabelName(guide.location.continent ?? "");
  if (!guideCity || !guideCountry) {
    return null;
  }

  for (const continent of continents) {
    if (guideContinent && normalizeLabelName(continent.name) !== guideContinent) {
      continue;
    }
    for (const country of continent.countries) {
      if (normalizeLabelName(country.name) !== guideCountry) {
        continue;
      }
      const city = country.cities.find(
        (candidate) => !candidate.isPlaceholderRegion && normalizeLabelName(candidate.name) === guideCity,
      );
      if (city) {
        return { continent, country, city };
      }
    }
  }

  return null;
}

function createVisibleGuideCityMarkerData(
  continents: Continent[],
  guideLists: MapList[],
  selection: SelectionState,
): FeatureCollection<Point, VisibleGuideCityMarkerFeatureProperties> {
  const citySummaries = new Map<
    string,
    {
      cityName: string;
      countryName: string;
      continentId: string;
      countryId: string;
      cityId: string;
      coordinates: [number, number];
      guideCount: number;
      categories: Set<MapList["category"]>;
    }
  >();

  for (const guide of guideLists) {
    const firstStop = guide.stops[0];
    if (!firstStop || !guide.location.city) {
      continue;
    }

    const cityRef = findGuideCityRef(continents, guide);
    const key = cityRef
      ? `${cityRef.continent.id}::${cityRef.country.id}::${cityRef.city.id}`
      : `${normalizeLabelName(guide.location.continent)}::${normalizeLabelName(guide.location.country)}::${normalizeLabelName(guide.location.city)}`;
    const coordinates: [number, number] = cityRef
      ? [cityRef.city.coordinates[1], cityRef.city.coordinates[0]]
      : [firstStop.coordinates[1], firstStop.coordinates[0]];
    const existing = citySummaries.get(key);
    if (existing) {
      existing.guideCount += 1;
      existing.categories.add(guide.category);
      continue;
    }

    citySummaries.set(key, {
      cityName: cityRef?.city.name ?? guide.location.city,
      countryName: cityRef?.country.name ?? guide.location.country,
      continentId: cityRef?.continent.id ?? "",
      countryId: cityRef?.country.id ?? "",
      cityId: cityRef?.city.id ?? "",
      coordinates,
      guideCount: 1,
      categories: new Set([guide.category]),
    });
  }

  return {
    type: "FeatureCollection",
    features: [...citySummaries.entries()].map(([key, summary]) => {
      const categories = [...summary.categories];
      const showCount = Boolean(selection.countryId);
      return {
        type: "Feature" as const,
        properties: {
          id: key,
          name: summary.cityName,
          cityName: summary.cityName,
          countryName: summary.countryName,
          continentId: summary.continentId,
          countryId: summary.countryId,
          cityId: summary.cityId,
          guideCount: summary.guideCount,
          categories,
          markerImage: getVisibleGuideCityMarkerImageName(summary.guideCount, categories),
          markerDotImage: getVisibleGuideCityDotImageName(categories),
          showCount,
        },
        geometry: {
          type: "Point" as const,
          coordinates: summary.coordinates,
        },
      };
    }),
  };
}

function createViewportCitySelectionData(
  continents: Continent[],
): FeatureCollection<Point, ViewportCitySelectionFeatureProperties> {
  return {
    type: "FeatureCollection",
    features: continents.flatMap((continent) =>
      continent.countries.flatMap((country) =>
        country.cities
          .filter(
            (city) =>
              !city.isPlaceholderRegion &&
              Number.isFinite(city.coordinates[0]) &&
              Number.isFinite(city.coordinates[1]),
          )
          .map((city) => ({
            type: "Feature" as const,
            properties: {
              continentId: continent.id,
              countryId: country.id,
              cityId: city.id,
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

function getNearestCityViewportTarget(
  map: maplibregl.Map,
  cityMarkerData: FeatureCollection<Point, ViewportCitySelectionFeatureProperties>,
  viewportInsets: MapViewportInsets,
  zoomFocusPoint?: { x: number; y: number } | null,
): MapViewportSelectionTarget | null {
  const container = map.getContainer();
  const width = container.clientWidth;
  const height = container.clientHeight;
  const insets = clampPaddingToMap(map, viewportInsets);
  const viewportWidth = Math.max(1, width - insets.left - insets.right);
  const viewportHeight = Math.max(1, height - insets.top - insets.bottom);
  const viewportCenter = {
    x: insets.left + viewportWidth / 2,
    y: insets.top + viewportHeight / 2,
  };
  const focusPoint = zoomFocusPoint ?? viewportCenter;
  const maxDistance = Math.min(210, Math.max(110, Math.min(viewportWidth, viewportHeight) * 0.32));
  const maxDistanceSquared = maxDistance * maxDistance;

  let nearest: (MapViewportSelectionTarget & { distanceSquared: number }) | null = null;
  for (const feature of cityMarkerData.features) {
    const { continentId, countryId, cityId } = feature.properties;
    if (!continentId || !countryId || !cityId) {
      continue;
    }

    const point = map.project(feature.geometry.coordinates as [number, number]);
    const isVisible =
      point.x >= insets.left &&
      point.x <= width - insets.right &&
      point.y >= insets.top &&
      point.y <= height - insets.bottom;
    if (!isVisible) {
      continue;
    }

    const distanceSquared = (point.x - focusPoint.x) ** 2 + (point.y - focusPoint.y) ** 2;
    if (distanceSquared > maxDistanceSquared || (nearest && distanceSquared >= nearest.distanceSquared)) {
      continue;
    }

    nearest = { continentId, countryId, cityId, distanceSquared };
  }

  if (!nearest) {
    return null;
  }

  return {
    continentId: nearest.continentId,
    countryId: nearest.countryId,
    cityId: nearest.cityId,
  };
}

function getUserZoomFocusPoint(
  map: maplibregl.Map,
  originalEvent: MouseEvent | TouchEvent | WheelEvent,
  viewportInsets: MapViewportInsets,
) {
  const container = map.getContainer();
  const eventTarget = originalEvent.target;
  if (
    !(eventTarget instanceof Node) ||
    !container.contains(eventTarget) ||
    (eventTarget instanceof Element && eventTarget.closest(".maplibregl-ctrl"))
  ) {
    return null;
  }

  let clientX: number | null = null;
  let clientY: number | null = null;
  if (originalEvent instanceof TouchEvent) {
    const touches = originalEvent.touches.length
      ? Array.from(originalEvent.touches)
      : Array.from(originalEvent.changedTouches);
    if (touches.length) {
      clientX = touches.reduce((sum, touch) => sum + touch.clientX, 0) / touches.length;
      clientY = touches.reduce((sum, touch) => sum + touch.clientY, 0) / touches.length;
    }
  } else {
    clientX = originalEvent.clientX;
    clientY = originalEvent.clientY;
  }

  if (clientX === null || clientY === null) {
    return null;
  }

  const rect = container.getBoundingClientRect();
  const point = { x: clientX - rect.left, y: clientY - rect.top };
  const insets = clampPaddingToMap(map, viewportInsets);
  const isInsideViewport =
    point.x >= insets.left &&
    point.x <= container.clientWidth - insets.right &&
    point.y >= insets.top &&
    point.y <= container.clientHeight - insets.bottom;

  return isInsideViewport ? point : null;
}

function selectionMatchesViewportTarget(
  selection: SelectionState,
  target: MapViewportSelectionTarget,
) {
  if (selection.continentId !== target.continentId || selection.countryId !== target.countryId) {
    return false;
  }

  if (target.cityId) {
    return (
      selection.cityId === target.cityId &&
      !selection.subareaId &&
      !selection.nestedSubareaId
    );
  }

  return (
    !selection.countrySubareaId &&
    !selection.stateId &&
    !selection.cityId &&
    !selection.subareaId &&
    !selection.nestedSubareaId
  );
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

function createGuideRouteData(
  activeGuide?: MapList | null,
  selectedStopId?: string | null,
  visibleNestedStopParentIds: string[] = [],
): FeatureCollection<LineString, GuideRouteFeatureProperties> {
  const selectedParentStop = activeGuide?.stops.find((stop) => stop.id === selectedStopId);
  const focusedNestedStop =
    selectedParentStop ??
    activeGuide?.stops.find((stop) => visibleNestedStopParentIds.includes(stop.id) && (stop.places?.length ?? 0) > 1);
  const explicitGuideRouteCoordinates =
    activeGuide?.routeCoordinates?.map(([lat, lng]) => [lng, lat] as [number, number]) ?? [];
  const explicitNestedRouteCoordinates =
    focusedNestedStop?.routeCoordinates?.map(([lat, lng]) => [lng, lat] as [number, number]) ?? [];
  const placeSequenceRouteCoordinates =
    focusedNestedStop?.category === "Routes"
      ? (focusedNestedStop.places ?? []).map((place) => [place.coordinates[1], place.coordinates[0]] as [number, number])
      : [];
  const focusedNestedRouteCoordinates =
    focusedNestedStop && (focusedNestedStop.category === "Routes" || focusedNestedStop.category === "Essentials")
      ? explicitNestedRouteCoordinates.length > 1
        ? explicitNestedRouteCoordinates
        : placeSequenceRouteCoordinates
      : [];
  const shouldShowNestedRoute = focusedNestedRouteCoordinates.length > 1;
  const shouldShowGuideRoute =
    explicitGuideRouteCoordinates.length > 1 ||
    (activeGuide?.creator.id === "user-rguide-history" && (activeGuide.stops?.length ?? 0) > 1);

  if ((!shouldShowGuideRoute && !shouldShowNestedRoute) || !activeGuide) {
    return {
      type: "FeatureCollection",
      features: [],
    };
  }

  const routeSegments: Array<Array<[number, number]>> = [];
  const baseRouteCoordinates =
    shouldShowNestedRoute
      ? focusedNestedRouteCoordinates
      : explicitGuideRouteCoordinates.length > 1
      ? explicitGuideRouteCoordinates
      : activeGuide.id === "list-r-history-magellan-elcano-circumnavigation"
      ? getMagellanElcanoRouteCoordinates(activeGuide)
      : activeGuide.stops.map((stop) => [stop.coordinates[1], stop.coordinates[0]] as [number, number]);
  const routeCoordinates =
    shouldShowNestedRoute && explicitNestedRouteCoordinates.length > 1
      ? baseRouteCoordinates
      : explicitGuideRouteCoordinates.length > 1
      ? baseRouteCoordinates
      : activeGuide.id === "list-r-history-magellan-elcano-circumnavigation"
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
        category: focusedNestedStop?.category ?? activeGuide.category,
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

function createPoiMapMarkerData(
  activeGuide: MapList | null | undefined,
  boundaryLookup: NeighborhoodBoundaryMap,
  options: {
    selectedStopId?: string | null;
    hoveredStopId?: string | null;
    visibleNestedStopParentIds?: string[];
  },
): FeatureCollection<Geometry, PoiMapMarkerFeatureProperties> {
  const visibleNestedParentIds = new Set(options.visibleNestedStopParentIds ?? []);
  const activeStopIds = new Set([options.selectedStopId, options.hoveredStopId].filter(Boolean) as string[]);
  const stops = (activeGuide?.stops ?? []).flatMap((stop) => [
    stop,
    ...(visibleNestedParentIds.has(stop.id) ? (stop.places ?? []) : []),
  ]);

  const features = stops.flatMap((stop) => {
    const marker = stop.mapMarker;
    if (!marker) {
      return [];
    }

    const geometry =
      marker.kind === "geometry"
        ? marker.geometry
        : findNeighborhoodBoundaryFeature(
            boundaryLookup,
            marker.cityId ?? activeGuide?.location.city?.toLowerCase().replace(/\s+/g, "-"),
            marker.subareaId,
            marker.nestedSubareaId,
          )?.geometry ?? null;

    if (!geometry) {
      return [];
    }

    return [{
      type: "Feature" as const,
      properties: {
        id: `${activeGuide?.id ?? "guide"}-${stop.id}-map-marker`,
        stopId: stop.id,
        name: marker.label ?? stop.name,
        category: stop.category ?? activeGuide?.category ?? "Activities",
        markerKind: marker.kind,
        active: activeStopIds.has(stop.id),
      },
      geometry,
    }];
  });

  return {
    type: "FeatureCollection",
    features,
  };
}

function findNeighborhoodBoundaryFeature(
  boundaryLookup: NeighborhoodBoundaryMap,
  cityId?: string,
  subareaId?: string,
  nestedSubareaId?: string,
): Feature<Geometry, NeighborhoodBoundaryProperties> | null {
  if (!cityId || !subareaId) {
    return null;
  }

  const exactKey = nestedSubareaId
    ? `${cityId}::${subareaId}::${nestedSubareaId}`
    : `${cityId}::${subareaId}`;
  const exactFeature = boundaryLookup[exactKey];
  if (exactFeature) {
    return exactFeature;
  }

  const selectedId = nestedSubareaId ?? subareaId;
  const keySuffix = `::${selectedId}`;
  const suffixFeature = Object.entries(boundaryLookup).find(([key]) => key.endsWith(keySuffix))?.[1];
  if (suffixFeature) {
    return suffixFeature;
  }

  const normalizedSelectedId = normalizeLabelName(selectedId);
  return Object.values(boundaryLookup).find((feature) => {
    const featureId = normalizeLabelName(feature.properties.id.split("::").at(-1) ?? "");
    const featureName = normalizeLabelName(feature.properties.name);
    return featureId === normalizedSelectedId || featureName === normalizedSelectedId;
  }) ?? null;
}

function getSubareaCoordinates(subareas: Array<{ id: string; coordinates: [number, number]; subareas?: Array<{ id: string; coordinates: [number, number] }> }> | undefined, subareaId?: string, nestedSubareaId?: string) {
  if (!subareas || !subareaId) {
    return null;
  }
  const subarea = subareas.find((item) => item.id === subareaId);
  if (!subarea) {
    return null;
  }
  if (nestedSubareaId) {
    return subarea.subareas?.find((item) => item.id === nestedSubareaId)?.coordinates ?? subarea.coordinates;
  }
  return subarea.coordinates;
}

function createSavedLocationData(
  continents: Continent[],
  savedLocations: SavedMapLocation[],
): FeatureCollection<Point, SavedLocationFeatureProperties> {
  const features = savedLocations.flatMap((location) => {
    const continent = continents.find((item) => item.id === location.selection.continentId);
    const country = continent?.countries.find((item) => item.id === location.selection.countryId);
    const city = country?.cities.find((item) => item.id === location.selection.cityId);
    const coordinates =
      location.kind === "continent"
        ? continent?.coordinates
        : location.kind === "country"
          ? country
            ? worldCountryCenters.get(country.id) ?? [
                (country.bounds[0][0] + country.bounds[1][0]) / 2,
                (country.bounds[0][1] + country.bounds[1][1]) / 2,
              ]
            : null
          : location.kind === "city"
            ? city?.coordinates
            : city
              ? getSubareaCoordinates(city.subareas, location.selection.subareaId, location.selection.nestedSubareaId)
              : null;

    if (!coordinates) {
      return [];
    }

    return [{
      type: "Feature" as const,
      properties: {
        id: location.id,
        kind: location.kind,
      },
      geometry: {
        type: "Point" as const,
        coordinates: [coordinates[1], coordinates[0]],
      },
    }];
  });

  return {
    type: "FeatureCollection",
    features,
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
  guideLists: MapList[],
  guideFocus?: MapList | null,
): FeatureCollection<Point, CityFeatureProperties> {
  const shouldRenderCityLayer =
    selection.countryId ||
    selection.cityId ||
    selection.continentId ||
    selection.countrySubareaId ||
    selection.stateId ||
    guideFocus?.location.scope === "city";

  if (!shouldRenderCityLayer) {
    return {
      type: "FeatureCollection",
      features: [],
    };
  }

  const visibleCityKeys = new Set<string>();
  const visibleCities: Array<{
    continentId: string;
    countryId: string;
    countryName: string;
    city: Continent["countries"][number]["cities"][number];
    key: string;
  }> = [];

  for (const continent of continents) {
    for (const country of continent.countries) {
      for (const city of country.cities) {
        if (
          city.isPlaceholderRegion ||
          !(
            selection.countryId === country.id ||
            selection.cityId === city.id ||
            (selection.continentId === continent.id && !selection.countryId)
          ) ||
          (selection.countrySubareaId && city.countrySubareaId !== selection.countrySubareaId) ||
          (selection.stateId && city.stateId !== selection.stateId)
        ) {
          continue;
        }

        const key = `${normalizeLabelName(country.name)}::${normalizeLabelName(city.name)}`;
        visibleCityKeys.add(key);
        visibleCities.push({
          continentId: continent.id,
          countryId: country.id,
          countryName: country.name,
          city,
          key,
        });
      }
    }
  }

  if (!visibleCities.length) {
    return {
      type: "FeatureCollection",
      features: [],
    };
  }

  const cityStats = new Map<
    string,
    {
      guideCount: number;
      totalUpvotes: number;
    }
  >();

  for (const list of guideLists) {
    if (list.location.scope !== "city" || !list.location.city || !list.location.country) {
      continue;
    }

    const cityKey = `${normalizeLabelName(list.location.country)}::${normalizeLabelName(list.location.city)}`;
    if (!visibleCityKeys.has(cityKey)) {
      continue;
    }

    const existing = cityStats.get(cityKey);
    if (existing) {
      existing.guideCount += 1;
      existing.totalUpvotes += list.upvotes;
      continue;
    }

    cityStats.set(cityKey, {
      guideCount: 1,
      totalUpvotes: list.upvotes,
    });
  }

  const trendingCityIds = new Set(
    [...cityStats.entries()]
      .sort((left, right) => right[1].totalUpvotes * 0.18 - left[1].totalUpvotes * 0.18)
      .slice(0, 16)
      .map(([key]) => key.split("::")[1]),
  );
  const cityScoreLookup = new Map<string, number>(
    visibleCities.map((entry) => {
      const stats = cityStats.get(entry.key);
      const guideCount = stats?.guideCount ?? 0;
      const totalUpvotes = stats?.totalUpvotes ?? 0;
      const interestScore = guideCount * 22 + totalUpvotes * 0.18;
      const trendingBoost = trendingCityIds.has(normalizeLabelName(entry.city.name)) ? 14 : 0;

      return [entry.city.id, Math.max(8, interestScore + trendingBoost)] as const;
    }),
  );

  return {
    type: "FeatureCollection",
    features: visibleCities.flatMap((entry) => {
      const city = entry.city;
      const guideCount = cityStats.get(entry.key)?.guideCount ?? 0;
      return {
        type: "Feature" as const,
        properties: {
          id: city.id,
          name: city.name,
          continentId: entry.continentId,
          countryId: entry.countryId,
          score: cityScoreLookup.get(city.id) ?? 8,
          guideCount,
          isPlaceholderRegion: Boolean(city.isPlaceholderRegion),
          guideHighlighted:
            guideFocus?.location.scope === "city" &&
            normalizeLabelName(guideFocus.location.city ?? "") === normalizeLabelName(city.name) &&
            normalizeLabelName(guideFocus.location.country ?? "") === normalizeLabelName(entry.countryName),
        },
        geometry: {
          type: "Point" as const,
          coordinates: [city.coordinates[1], city.coordinates[0]],
        },
      };
    }),
  };
}

function createNeighborhoodMarkerData(
  continents: Continent[],
  selection: SelectionState,
): FeatureCollection<Point, NeighborhoodMarkerFeatureProperties> {
  if (!selection.continentId || !selection.countryId || !selection.cityId) {
    return {
      type: "FeatureCollection",
      features: [],
    };
  }

  const continent = continents.find((item) => item.id === selection.continentId);
  const country = continent?.countries.find((item) => item.id === selection.countryId);
  const city = country?.cities.find((item) => item.id === selection.cityId);
  const subareas = city?.subareas ?? [];

  return {
    type: "FeatureCollection",
    features: subareas.map((subarea) => ({
      type: "Feature" as const,
      properties: {
        id: `${city?.id ?? selection.cityId}-${subarea.id}`,
        name: subarea.name,
        continentId: selection.continentId!,
        countryId: selection.countryId!,
        cityId: selection.cityId!,
        subareaId: subarea.id,
        selected: selection.subareaId === subarea.id && !selection.nestedSubareaId,
      },
      geometry: {
        type: "Point" as const,
        coordinates: [subarea.coordinates[1], subarea.coordinates[0]],
      },
    })),
  };
}

function getSelectionCountry(
  continents: Continent[],
  selection: SelectionState,
) {
  const continent = selection.continentId
    ? continents.find((item) => item.id === selection.continentId)
    : undefined;
  const country = selection.countryId
    ? continent?.countries.find((item) => item.id === selection.countryId)
    : undefined;

  return { continent, country };
}

function getNearestRealCityClickTarget(
  map: maplibregl.Map,
  point: { x: number; y: number },
  continents: Continent[],
  selection: SelectionState,
) {
  const zoom = map.getZoom();
  if (zoom < 8) {
    return null;
  }

  const { country } = getSelectionCountry(continents, selection);
  const candidateCountries = country
    ? [country]
    : selection.continentId
      ? continents.find((continent) => continent.id === selection.continentId)?.countries ?? []
      : continents.flatMap((continent) => continent.countries);
  const pixelLimit = zoom >= 11 ? 360 : zoom >= 9 ? 280 : 180;
  const pixelLimitSquared = pixelLimit * pixelLimit;

  let best:
    | {
        continentId: string;
        countryId: string;
        cityId: string;
        distanceSquared: number;
      }
    | null = null;

  for (const candidateContinent of continents) {
    for (const candidateCountry of candidateContinent.countries) {
      if (!candidateCountries.some((item) => item.id === candidateCountry.id)) {
        continue;
      }

      for (const city of candidateCountry.cities) {
        if (city.isPlaceholderRegion) {
          continue;
        }

        const projected = map.project([city.coordinates[1], city.coordinates[0]]);
        const distanceSquared = (projected.x - point.x) ** 2 + (projected.y - point.y) ** 2;
        if (distanceSquared > pixelLimitSquared) {
          continue;
        }
        if (!best || distanceSquared < best.distanceSquared) {
          best = {
            continentId: candidateContinent.id,
            countryId: candidateCountry.id,
            cityId: city.id,
            distanceSquared,
          };
        }
      }
    }
  }

  return best;
}

function getNearestLocationCityTarget(
  coordinates: [number, number],
  continents: Continent[],
  guideLists: MapList[],
) {
  const guideCityKeys = getGuideCityKeys(guideLists);
  let bestGuideCity:
    | {
        continentId: string;
        countryId: string;
        cityId: string;
        cityName: string;
        distanceKm: number;
      }
    | null = null;
  let bestKnownCity:
    | {
        continentId: string;
        countryId: string;
        cityId: string;
        cityName: string;
        distanceKm: number;
      }
    | null = null;

  for (const continent of continents) {
    for (const country of continent.countries) {
      for (const city of country.cities) {
        if (city.isPlaceholderRegion) {
          continue;
        }

        const distanceKm = getDistanceKmBetweenLngLat(
          coordinates,
          [city.coordinates[1], city.coordinates[0]],
        );
        const target = {
          continentId: continent.id,
          countryId: country.id,
          cityId: city.id,
          cityName: city.name,
          distanceKm,
        };

        if (!bestKnownCity || distanceKm < bestKnownCity.distanceKm) {
          bestKnownCity = target;
        }

        const hasGuides = city.listCount > 0 || guideCityKeys.has(getGuideCityKey(country.name, city.name));
        if (hasGuides && (!bestGuideCity || distanceKm < bestGuideCity.distanceKm)) {
          bestGuideCity = target;
        }
      }
    }
  }

  if (bestGuideCity && bestGuideCity.distanceKm <= 75) {
    return bestGuideCity;
  }

  if (bestKnownCity && bestKnownCity.distanceKm <= 30) {
    return bestKnownCity;
  }

  return null;
}

function getVisibleGuideMarkerIconSizeExpression(directHoverGuideId: string | null = null): ExpressionSpecification {
  const baseSize: ExpressionSpecification = [
    "interpolate",
    ["linear"],
    ["get", "popProgress"],
    0,
    0.72,
    1,
    0.96,
  ];
  const hoverBoost: ExpressionSpecification = directHoverGuideId
    ? [
        "case",
        ["==", ["get", "id"], directHoverGuideId],
        VISIBLE_GUIDE_MARKER_HOVER_SIZE_BOOST,
        ["*", ["get", "hoverProgress"], VISIBLE_GUIDE_MARKER_HOVER_SIZE_BOOST],
      ]
    : ["*", ["get", "hoverProgress"], VISIBLE_GUIDE_MARKER_HOVER_SIZE_BOOST];

  return ["+", baseSize, hoverBoost];
}

function getVisibleGuideMarkerIconImageExpression(directHoverGuideId: string | null = null): ExpressionSpecification {
  const defaultImage: ExpressionSpecification = [
    "case",
    ["get", "markerPreview"],
    ["get", "markerDotImage"],
    ["get", "markerImage"],
  ];

  if (!directHoverGuideId) {
    return defaultImage;
  }

  return [
    "case",
    ["==", ["get", "id"], directHoverGuideId],
    ["get", "markerImage"],
    defaultImage,
  ];
}

function getVisibleGuideCityMarkerIconSizeExpression(hoveredCityMarkerId: string | null = null): ExpressionSpecification {
  const baseSize: ExpressionSpecification = ["interpolate", ["linear"], ["zoom"], 1, 0.94, 8.7, 1.12];
  if (!hoveredCityMarkerId) {
    return baseSize;
  }

  return [
    "case",
    ["==", ["get", "id"], hoveredCityMarkerId],
    ["interpolate", ["linear"], ["zoom"], 1, 1.18, 8.7, 1.36],
    baseSize,
  ];
}

function setVisibleGuideMarkerHoverLayout(map: maplibregl.Map, guideId: string | null) {
  if (!map.getLayer(VISIBLE_GUIDE_MARKER_POINT_LAYER_ID)) {
    return;
  }

  map.setLayoutProperty(
    VISIBLE_GUIDE_MARKER_POINT_LAYER_ID,
    "icon-size",
    getVisibleGuideMarkerIconSizeExpression(guideId),
  );
  map.setLayoutProperty(
    VISIBLE_GUIDE_MARKER_POINT_LAYER_ID,
    "icon-image",
    getVisibleGuideMarkerIconImageExpression(guideId),
  );
}

function setVisibleGuideCityMarkerHoverLayout(map: maplibregl.Map, cityMarkerId: string | null) {
  if (map.getLayer(VISIBLE_GUIDE_CITY_MARKER_POINT_LAYER_ID)) {
    map.setFilter(
      VISIBLE_GUIDE_CITY_MARKER_POINT_LAYER_ID,
      cityMarkerId
        ? ["all", ["==", ["get", "showCount"], true], ["!=", ["get", "id"], cityMarkerId]]
        : ["==", ["get", "showCount"], true],
    );
  }
  if (map.getLayer(VISIBLE_GUIDE_CITY_MARKER_HOVER_LAYER_ID)) {
    map.setFilter(
      VISIBLE_GUIDE_CITY_MARKER_HOVER_LAYER_ID,
      cityMarkerId
        ? ["all", ["==", ["get", "showCount"], true], ["==", ["get", "id"], cityMarkerId]]
        : ["all", ["==", ["get", "showCount"], true], ["==", ["get", "id"], "__none__"]],
    );
  }
}

function addVisibleGuideMarkerLayers(map: maplibregl.Map) {
  ensureVisibleGuideMarkerImages(map);

  const existingCityPointLayer = map.getLayer(VISIBLE_GUIDE_CITY_MARKER_POINT_LAYER_ID);
  if (existingCityPointLayer && existingCityPointLayer.type !== "symbol") {
    map.removeLayer(VISIBLE_GUIDE_CITY_MARKER_POINT_LAYER_ID);
  }
  const existingCityDotLayer = map.getLayer(VISIBLE_GUIDE_CITY_MARKER_DOT_LAYER_ID);
  if (existingCityDotLayer && existingCityDotLayer.type !== "symbol") {
    map.removeLayer(VISIBLE_GUIDE_CITY_MARKER_DOT_LAYER_ID);
  }
  const existingCityHitLayer = map.getLayer(VISIBLE_GUIDE_CITY_MARKER_HIT_LAYER_ID);
  if (existingCityHitLayer && existingCityHitLayer.type !== "circle") {
    map.removeLayer(VISIBLE_GUIDE_CITY_MARKER_HIT_LAYER_ID);
  }
  const existingCityHoverLayer = map.getLayer(VISIBLE_GUIDE_CITY_MARKER_HOVER_LAYER_ID);
  if (existingCityHoverLayer && existingCityHoverLayer.type !== "symbol") {
    map.removeLayer(VISIBLE_GUIDE_CITY_MARKER_HOVER_LAYER_ID);
  }
  const existingPointLayer = map.getLayer(VISIBLE_GUIDE_MARKER_POINT_LAYER_ID);
  if (existingPointLayer && existingPointLayer.type !== "symbol") {
    map.removeLayer(VISIBLE_GUIDE_MARKER_POINT_LAYER_ID);
  }

  if (!map.getLayer(VISIBLE_GUIDE_CITY_MARKER_DOT_LAYER_ID)) {
    map.addLayer({
      id: VISIBLE_GUIDE_CITY_MARKER_DOT_LAYER_ID,
      type: "symbol",
      source: VISIBLE_GUIDE_CITY_MARKER_SOURCE_ID,
      filter: ["==", ["get", "showCount"], false],
      maxzoom: 8.7,
      layout: {
        "icon-image": ["get", "markerDotImage"],
        "icon-size": ["interpolate", ["linear"], ["zoom"], 0, 0.76, 4, 0.86, 8.7, 0.96],
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      },
      paint: {
        "icon-opacity": 0.98,
      },
    });
  }

  if (!map.getLayer(VISIBLE_GUIDE_CITY_MARKER_HIT_LAYER_ID)) {
    map.addLayer({
      id: VISIBLE_GUIDE_CITY_MARKER_HIT_LAYER_ID,
      type: "circle",
      source: VISIBLE_GUIDE_CITY_MARKER_SOURCE_ID,
      filter: ["==", ["get", "showCount"], true],
      maxzoom: 8.7,
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 1, 18, 8.7, 23],
        "circle-color": "rgba(15, 23, 42, 0.01)",
        "circle-translate": [0, -28],
        "circle-translate-anchor": "viewport",
      },
    });
  }

  if (!map.getLayer(VISIBLE_GUIDE_CITY_MARKER_POINT_LAYER_ID)) {
    map.addLayer({
      id: VISIBLE_GUIDE_CITY_MARKER_POINT_LAYER_ID,
      type: "symbol",
      source: VISIBLE_GUIDE_CITY_MARKER_SOURCE_ID,
      filter: ["==", ["get", "showCount"], true],
      maxzoom: 8.7,
      layout: {
        "icon-image": ["get", "markerImage"],
        "icon-size": getVisibleGuideCityMarkerIconSizeExpression(),
        "icon-offset": [0, -28],
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      },
      paint: {
        "icon-opacity": 0.98,
        "icon-opacity-transition": { duration: 180, delay: 0 },
      },
    });
  }

  if (!map.getLayer(VISIBLE_GUIDE_CITY_MARKER_HOVER_LAYER_ID)) {
    map.addLayer({
      id: VISIBLE_GUIDE_CITY_MARKER_HOVER_LAYER_ID,
      type: "symbol",
      source: VISIBLE_GUIDE_CITY_MARKER_SOURCE_ID,
      filter: ["all", ["==", ["get", "showCount"], true], ["==", ["get", "id"], "__none__"]],
      maxzoom: 8.7,
      layout: {
        "icon-image": ["get", "markerImage"],
        "icon-size": ["interpolate", ["linear"], ["zoom"], 1, 1.2, 8.7, 1.38],
        "icon-offset": [0, -23],
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      },
      paint: {
        "icon-opacity": 1,
      },
    });
  }

  if (!map.getLayer(VISIBLE_GUIDE_MARKER_POINT_LAYER_ID)) {
    map.addLayer({
      id: VISIBLE_GUIDE_MARKER_POINT_LAYER_ID,
      type: "symbol",
      source: VISIBLE_GUIDE_MARKER_SOURCE_ID,
      minzoom: 8.15,
      layout: {
        "icon-image": getVisibleGuideMarkerIconImageExpression(),
        "icon-size": getVisibleGuideMarkerIconSizeExpression(),
        "icon-offset": ["get", "markerOffset"] as unknown as [number, number],
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
        "symbol-sort-key": ["get", "renderPriority"],
      },
      paint: {
        "icon-opacity": 1,
        "icon-opacity-transition": { duration: 220, delay: 0 },
      },
    });
  }
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
      "text-font": ["Noto Sans Regular"],
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
    filter: ["all", ["==", ["get", "isPlaceholderRegion"], false], [">", ["get", "score"], 8]],
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
      "circle-opacity": 0,
      "circle-stroke-opacity": 0,
      "circle-translate": [0, -1],
      "circle-translate-anchor": "viewport",
    },
  }, cityDotBeforeLayerId);

  map.addLayer({
    id: "neighborhood-marker-hit",
    type: "circle",
    source: NEIGHBORHOOD_MARKER_SOURCE_ID,
    minzoom: 9.5,
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        9.5,
        16,
        12,
        22,
        15,
        28,
      ],
      "circle-color": "rgba(15, 23, 42, 0.01)",
    },
  });

  map.addLayer({
    id: "neighborhood-marker-halo",
    type: "circle",
    source: NEIGHBORHOOD_MARKER_SOURCE_ID,
    minzoom: 9.5,
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        9.5,
        ["case", ["get", "selected"], 7.5, 6],
        12,
        ["case", ["get", "selected"], 10, 8],
        15,
        ["case", ["get", "selected"], 12.5, 10],
      ],
      "circle-color": ["case", ["get", "selected"], "rgba(15, 23, 42, 0.14)", "rgba(255, 255, 255, 0.72)"],
      "circle-stroke-color": ["case", ["get", "selected"], "#0f172a", "#64748b"],
      "circle-stroke-width": ["case", ["get", "selected"], 1.8, 1],
      "circle-stroke-opacity": ["case", ["get", "selected"], 0.9, 0.58],
      "circle-blur": 0.06,
    },
  });

  map.addLayer({
    id: "neighborhood-marker-point",
    type: "circle",
    source: NEIGHBORHOOD_MARKER_SOURCE_ID,
    minzoom: 9.5,
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        9.5,
        ["case", ["get", "selected"], 3.8, 3],
        12,
        ["case", ["get", "selected"], 4.6, 3.6],
        15,
        ["case", ["get", "selected"], 5.4, 4.4],
      ],
      "circle-color": ["case", ["get", "selected"], "#0f172a", "#ffffff"],
      "circle-stroke-color": "#0f172a",
      "circle-stroke-width": ["case", ["get", "selected"], 1.5, 1],
      "circle-opacity": 0.96,
    },
  });

  map.addLayer({
    id: "neighborhood-marker-label",
    type: "symbol",
    source: NEIGHBORHOOD_MARKER_SOURCE_ID,
    minzoom: 10.2,
    layout: {
      "text-field": ["get", "name"],
      "text-size": ["interpolate", ["linear"], ["zoom"], 10.2, 10.5, 13, 12.5, 15, 14],
      "text-font": ["Noto Sans Regular"],
      "text-offset": [0, 1.25],
      "text-anchor": "top",
      "text-allow-overlap": false,
      "text-padding": 2,
    },
    paint: {
      "text-color": "#0f172a",
      "text-halo-color": "rgba(255, 255, 255, 0.95)",
      "text-halo-width": 1.35,
      "text-opacity": ["case", ["get", "selected"], 1, 0.82],
    },
  });

  map.addLayer({
    id: "saved-location-points",
    type: "circle",
    source: SAVED_LOCATION_SOURCE_ID,
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        2,
        3.6,
        8,
        6.2,
      ],
      "circle-color": "#0f766e",
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 1.6,
      "circle-opacity": 0.96,
    },
  }, cityDotBeforeLayerId);

  addVisibleGuideMarkerLayers(map);

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
    id: "poi-map-marker-fill",
    type: "fill",
    source: POI_MAP_MARKER_SOURCE_ID,
    filter: [
      "any",
      ["==", ["geometry-type"], "Polygon"],
      ["==", ["geometry-type"], "MultiPolygon"],
    ],
    paint: {
      "fill-color": GUIDE_STOP_COLOR_MATCH,
      "fill-opacity": ["case", ["get", "active"], 0.2, 0.1],
    },
  }, "continent-labels");

  map.addLayer({
    id: "poi-map-marker-line-casing",
    type: "line",
    source: POI_MAP_MARKER_SOURCE_ID,
    filter: [
      "any",
      ["==", ["geometry-type"], "Polygon"],
      ["==", ["geometry-type"], "MultiPolygon"],
      ["==", ["geometry-type"], "LineString"],
      ["==", ["geometry-type"], "MultiLineString"],
    ],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "rgba(255, 255, 255, 0.92)",
      "line-opacity": ["case", ["get", "active"], 0.92, 0.64],
      "line-width": ["interpolate", ["linear"], ["zoom"], 8, 5.2, 13, 9.2, 16, 13],
      "line-blur": 0.35,
    },
  }, "continent-labels");

  map.addLayer({
    id: "poi-map-marker-line",
    type: "line",
    source: POI_MAP_MARKER_SOURCE_ID,
    filter: [
      "any",
      ["==", ["geometry-type"], "Polygon"],
      ["==", ["geometry-type"], "MultiPolygon"],
      ["==", ["geometry-type"], "LineString"],
      ["==", ["geometry-type"], "MultiLineString"],
    ],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": GUIDE_STOP_COLOR_MATCH,
      "line-opacity": ["case", ["get", "active"], 0.92, 0.62],
      "line-width": ["interpolate", ["linear"], ["zoom"], 8, 2.6, 13, 5.1, 16, 7.5],
    },
  }, "continent-labels");

  map.addLayer({
    id: "poi-map-marker-point",
    type: "circle",
    source: POI_MAP_MARKER_SOURCE_ID,
    filter: ["==", ["geometry-type"], "Point"],
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 5.8, 13, 9.2, 16, 12],
      "circle-color": GUIDE_STOP_COLOR_MATCH,
      "circle-opacity": ["case", ["get", "active"], 0.94, 0.72],
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": ["case", ["get", "active"], 2, 1.35],
    },
  }, "continent-labels");

  map.addLayer({
    id: "guide-stop-points",
    type: "symbol",
    source: GUIDE_STOP_SOURCE_ID,
    layout: {
      "icon-image": ["get", "markerImage"],
      "icon-size": ["interpolate", ["linear"], ["zoom"], 3, 0.82, 8, 0.98],
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
  }, "guide-stop-points");

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
      "circle-color": "rgba(255, 255, 255, 0)",
      "circle-opacity": 0,
      "circle-blur": 0,
      "circle-stroke-color": GUIDE_STOP_COLOR_MATCH,
      "circle-stroke-opacity": 0,
      "circle-stroke-width": 2.2,
      "circle-radius-transition": { duration: 0, delay: 0 },
      "circle-opacity-transition": { duration: 0, delay: 0 },
      "circle-stroke-opacity-transition": { duration: 0, delay: 0 },
      "circle-stroke-width-transition": { duration: 0, delay: 0 },
    },
  }, "guide-stop-points");

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
    id: "guide-stop-selected-points",
    type: "symbol",
    source: GUIDE_STOP_SOURCE_ID,
    filter: ["==", ["get", "id"], "__none__"],
    layout: {
      "icon-image": ["get", "markerImage"],
      "icon-size": ["interpolate", ["linear"], ["zoom"], 3, 0.82, 8, 0.98],
      "symbol-sort-key": ["*", -1, ["get", "rank"]],
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
    },
    paint: {
      "icon-opacity": 0,
      "icon-opacity-transition": { duration: 0, delay: 0 },
    },
  }, "guide-stop-labels");

  map.addLayer({
    id: "guide-stop-diamond-burst",
    type: "symbol",
    source: GUIDE_STOP_SOURCE_ID,
    minzoom: 3,
    filter: ["==", ["get", "id"], "__none__"],
    layout: {
      "icon-image": POI_DIAMOND_PULSE_ICON_IMAGE_MATCH,
      "icon-size": ["interpolate", ["linear"], ["zoom"], 3, 0, 8, 0],
      "symbol-sort-key": ["*", -1, ["get", "rank"]],
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
    },
    paint: {
      "icon-opacity": 0,
      "icon-opacity-transition": { duration: 0, delay: 0 },
    },
  }, "guide-stop-labels");

  map.addLayer({
    id: "guide-stop-diamonds",
    type: "symbol",
    source: GUIDE_STOP_SOURCE_ID,
    minzoom: 3,
    filter: ["==", ["get", "isNested"], true],
    layout: {
      "icon-image": ["get", "markerImage"],
      "icon-size": ["interpolate", ["linear"], ["zoom"], 3, 1.04, 8, 1.12],
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
    filter: ["==", ["get", "id"], "__none__"],
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

  map.addLayer({
    id: "guide-stop-selected-diamonds",
    type: "symbol",
    source: GUIDE_STOP_SOURCE_ID,
    minzoom: 3,
    filter: ["==", ["get", "id"], "__none__"],
    layout: {
      "icon-image": ["get", "markerImage"],
      "icon-size": ["interpolate", ["linear"], ["zoom"], 3, 1.04, 8, 1.12],
      "symbol-sort-key": ["*", -1, ["get", "rank"]],
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
    },
    paint: {
      "icon-opacity": 0,
      "icon-opacity-transition": { duration: 0, delay: 0 },
    },
  }, "continent-labels");

  map.addLayer({
    id: "guide-stop-selected-diamond-labels",
    type: "symbol",
    source: GUIDE_STOP_SOURCE_ID,
    minzoom: 3,
    filter: ["==", ["get", "id"], "__none__"],
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
      "text-opacity": 0,
      "text-opacity-transition": { duration: 0, delay: 0 },
    },
  }, "continent-labels");

  if (map.getLayer("guide-stop-points") && map.getLayer("guide-stop-labels")) {
    map.moveLayer("guide-stop-points", "guide-stop-labels");
  }
  if (map.getLayer("guide-stop-selected-points") && map.getLayer("guide-stop-labels")) {
    map.moveLayer("guide-stop-selected-points", "guide-stop-labels");
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
  guideLists = mapLists,
  visibleGuideMarkerIds = [],
  hoveredGuideMarkerId,
  savedLocations = [],
  visibleNestedStopParentIds = [],
  hoveredStopId,
  selectedStopId,
  countryToggleMode = false,
  syncSelectionToViewport = false,
  onHoverGuideStop,
  onSelectGuideStop,
  onHoverGuideMarker,
  onSelectGuideMarker,
  onSubmitMapClick,
  onSelectContinent,
  onSelectCountry,
  onSelectCity,
  onViewportSelectionChange,
  onSelectSubarea,
  onSelectState,
}: MapClientProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const userLocationMarkerRef = useRef<maplibregl.Marker | null>(null);
  const guideStopHoverPopupRef = useRef<maplibregl.Popup | null>(null);
  const isStyleReadyRef = useRef(false);
  const [styleReadyTick, setStyleReadyTick] = useState(0);
  const [countryBoundaryDataVersion, setCountryBoundaryDataVersion] = useState(0);
  const [neighborhoodBoundaryLookup, setNeighborhoodBoundaryLookup] =
    useState<NeighborhoodBoundaryMap>(EMPTY_NEIGHBORHOOD_BOUNDARY_LOOKUP);
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
    onViewportSelectionChange,
    onSelectSubarea,
    onSelectState,
    onHoverGuideStop,
    onSelectGuideStop,
    onHoverGuideMarker,
    onSelectGuideMarker,
    onSubmitMapClick,
    countryToggleMode,
    syncSelectionToViewport,
    continents,
    selection,
  });
  const viewportModeRef = useRef<"full" | "center" | "submit">(viewportMode);
  const viewportInsetsRef = useRef<MapViewportInsets | undefined>(viewportInsets);
  const activeGuideIdRef = useRef<string | null>(activeGuide?.id ?? null);
  const selectedStopIdRef = useRef<string | null | undefined>(selectedStopId);
  const activeGuideCameraKeyRef = useRef<string | null>(null);
  const activeGuideCameraPendingKeyRef = useRef<string | null>(null);
  const activeGuideCameraFrameRef = useRef<number | null>(null);
  const activeGuideCameraTimeoutsRef = useRef<number[]>([]);
  const collapsedGuidesCameraKeyRef = useRef<string | null>(null);
  const collapsedGuidesCameraTimeoutRef = useRef<number | null>(null);
  const collapsedGuidesCameraSuppressedUntilRef = useRef(0);
  const previousHoveredGuideMarkerIdRef = useRef<string | null | undefined>(hoveredGuideMarkerId);
  const selectionCameraKeyRef = useRef<string | null>(null);
  const selectionCameraSettlingUntilRef = useRef(0);
  const viewportSelectionTargetRef = useRef<MapViewportSelectionTarget | null>(null);
  const countryBoundaryHighResTimeoutRef = useRef<number | null>(null);
  const visibleGuideMarkerEnteredAtRef = useRef<Map<string, number>>(new Map());
  const visibleGuideMarkerHoverProgressRef = useRef<Map<string, number>>(new Map());
  const visibleGuideMarkerAnimationFrameRef = useRef<number | null>(null);
  const visibleGuideMarkerDirectHoverIdRef = useRef<string | null>(null);
  const visibleGuideMarkerNotifiedHoverIdRef = useRef<string | null>(null);
  const [visibleGuideMarkerAnimationTick, setVisibleGuideMarkerAnimationTick] = useState(0);
  const [locationStatus, setLocationStatus] = useState<"idle" | "locating" | "located" | "error">("idle");
  const [locationMessage, setLocationMessage] = useState("Find my location");
  const [locationSelectionNonce, setLocationSelectionNonce] = useState(0);
  const [isSatelliteView, setIsSatelliteView] = useState(false);
  activeGuideIdRef.current = activeGuide?.id ?? null;
  selectedStopIdRef.current = selectedStopId;

  const focusUserLocation = () => {
    const map = mapRef.current;
    if (!map || typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationStatus("error");
      setLocationMessage("Location unavailable");
      return;
    }

    setLocationStatus("locating");
    setLocationMessage("Finding location");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates: [number, number] = [
          position.coords.longitude,
          position.coords.latitude,
        ];

        if (!userLocationMarkerRef.current) {
          const markerElement = document.createElement("div");
          markerElement.className = "rguide-user-location-marker";
          userLocationMarkerRef.current = new maplibregl.Marker({
            element: markerElement,
            anchor: "center",
          })
            .setLngLat(coordinates)
            .addTo(map);
        }

        userLocationMarkerRef.current.setLngLat(coordinates);
        const locationCityTarget = getNearestLocationCityTarget(
          coordinates,
          handlersRef.current.continents,
          guideLists,
        );

        if (locationCityTarget) {
          handlersRef.current.onSelectCity(
            locationCityTarget.continentId,
            locationCityTarget.countryId,
            locationCityTarget.cityId,
          );
          setLocationSelectionNonce((current) => current + 1);
          setLocationStatus("located");
          setLocationMessage(`Showing guides near ${locationCityTarget.cityName}`);
          return;
        }

        const accuracy = position.coords.accuracy;
        const zoom =
          accuracy <= 100 ? 15 : accuracy <= 500 ? 14.2 : accuracy <= 2_000 ? 12.8 : 11.5;

        map.stop();
        resetCameraPadding(map);
        map.easeTo({
          center: coordinates,
          zoom,
          padding: getViewportInsets(map, viewportModeRef.current, viewportInsetsRef.current),
          duration: 850,
          easing: smoothCameraEasing,
          essential: true,
        });
        setLocationStatus("located");
        setLocationMessage("Centered on your location");
      },
      (error) => {
        setLocationStatus("error");
        setLocationMessage(error.code === error.PERMISSION_DENIED ? "Location blocked" : "Could not find location");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60_000,
        timeout: 12_000,
      },
    );
  };

  useEffect(() => {
    const cityId = selection.cityId;
    if (!cityId) {
      setNeighborhoodBoundaryLookup(EMPTY_NEIGHBORHOOD_BOUNDARY_LOOKUP);
      return;
    }

    let isCurrentSelection = true;
    setNeighborhoodBoundaryLookup(EMPTY_NEIGHBORHOOD_BOUNDARY_LOOKUP);

    loadNeighborhoodBoundaryMap(cityId)
      .then((boundaryMap) => {
        if (isCurrentSelection) {
          setNeighborhoodBoundaryLookup(boundaryMap);
        }
      })
      .catch((error) => {
        if (isCurrentSelection) {
          setNeighborhoodBoundaryLookup(EMPTY_NEIGHBORHOOD_BOUNDARY_LOOKUP);
        }
        console.error(`Failed to load neighborhood boundaries for ${cityId}`, error);
      });

    return () => {
      isCurrentSelection = false;
    };
  }, [selection.cityId]);

  const countryData = useMemo(
    () => createCountryData(continents, selection, highlightedCountryIds, guideFocus),
    [continents, countryBoundaryDataVersion, guideFocus, highlightedCountryIds, selection],
  );
  const continentLabelData = useMemo(
    () => createContinentLabelData(continents, selection),
    [continents, selection],
  );
  const cityData = useMemo(
    () => createCityData(continents, selection, guideLists, guideFocus),
    [continents, guideFocus, guideLists, selection],
  );
  const neighborhoodMarkerData = useMemo(
    () => createNeighborhoodMarkerData(continents, selection),
    [continents, selection],
  );
  const stateLabelData = useMemo(() => createStateLabelData(selection), [selection]);
  const guideStopData = useMemo(
    () => createGuideStopData(activeGuide, visibleNestedStopParentIds, selectedStopId, hoveredStopId),
    [activeGuide, hoveredStopId, selectedStopId, visibleNestedStopParentIds],
  );
  const visibleGuideMarkerData = useMemo(
    () =>
      createVisibleGuideMarkerData(
        guideLists,
        visibleGuideMarkerIds,
        activeGuide,
        selection,
        visibleGuideMarkerEnteredAtRef.current,
        visibleGuideMarkerHoverProgressRef.current,
      ),
    [activeGuide, guideLists, selection, visibleGuideMarkerAnimationTick, visibleGuideMarkerIds],
  );
  const visibleGuideCityMarkerData = useMemo(
    () => createVisibleGuideCityMarkerData(continents, guideLists, selection),
    [continents, guideLists, selection],
  );
  const viewportCitySelectionData = useMemo(
    () => createViewportCitySelectionData(continents),
    [continents],
  );
  const guideRouteData = useMemo(
    () => createGuideRouteData(activeGuide, selectedStopId, visibleNestedStopParentIds),
    [activeGuide, selectedStopId, visibleNestedStopParentIds],
  );
  const savedLocationData = useMemo(
    () => createSavedLocationData(continents, savedLocations),
    [continents, savedLocations],
  );
  const guideStopDataRef = useRef(guideStopData);
  const visibleGuideCityMarkerDataRef = useRef(visibleGuideCityMarkerData);
  const viewportCitySelectionDataRef = useRef(viewportCitySelectionData);
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
    return findNeighborhoodBoundaryFeature(
      neighborhoodBoundaryLookup,
      selection.cityId,
      selection.subareaId,
      selection.nestedSubareaId,
    );
  }, [neighborhoodBoundaryLookup, selection.cityId, selection.nestedSubareaId, selection.subareaId]);
  const neighborhoodBoundaryData = useMemo(
    () => createNeighborhoodBoundaryData(activeNeighborhoodBoundary),
    [activeNeighborhoodBoundary],
  );
  const poiMapMarkerData = useMemo(
    () =>
      createPoiMapMarkerData(activeGuide, neighborhoodBoundaryLookup, {
        selectedStopId,
        hoveredStopId,
        visibleNestedStopParentIds,
      }),
    [activeGuide, hoveredStopId, neighborhoodBoundaryLookup, selectedStopId, visibleNestedStopParentIds],
  );
  const cameraPoiMapMarkerData = useMemo(
    () =>
      createPoiMapMarkerData(activeGuide, neighborhoodBoundaryLookup, {
        visibleNestedStopParentIds,
      }),
    [activeGuide, neighborhoodBoundaryLookup, visibleNestedStopParentIds],
  );
  const activeGuidePoiMarkerSignature = useMemo(
    () =>
      cameraPoiMapMarkerData.features
        .map((feature) => {
          const markerCoordinates = getGeometryCoordinates(feature.geometry);
          if (!markerCoordinates) {
            return `${feature.properties.stopId}:${feature.geometry.type}:empty`;
          }

          const markerBounds = new LngLatBounds();
          extendBoundsFromCoordinates(markerBounds, markerCoordinates);
          if (markerBounds.isEmpty()) {
            return `${feature.properties.stopId}:${feature.geometry.type}:empty`;
          }

          const southWest = markerBounds.getSouthWest();
          const northEast = markerBounds.getNorthEast();
          return [
            feature.properties.stopId,
            feature.geometry.type,
            southWest.lng.toFixed(5),
            southWest.lat.toFixed(5),
            northEast.lng.toFixed(5),
            northEast.lat.toFixed(5),
          ].join(":");
        })
        .join("|"),
    [cameraPoiMapMarkerData],
  );
  const visibleGuideBoundsSignature = useMemo(
    () =>
      visibleGuideMarkerData.features
        .map((feature) => {
          const [lng, lat] = feature.geometry.coordinates;
          return `${feature.properties.id}:${lat.toFixed(5)},${lng.toFixed(5)}`;
        })
        .join("|"),
    [visibleGuideMarkerData],
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
        locationSelectionNonce,
      ].join("|"),
    [
      activeNeighborhoodBoundary,
      selection.cityId,
      selection.continentId,
      selection.continentSubareaId,
      selection.countryId,
      selection.countrySubareaId,
      locationSelectionNonce,
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
      onViewportSelectionChange,
      onSelectSubarea,
      onSelectState,
      onHoverGuideStop,
      onSelectGuideStop,
      onHoverGuideMarker,
      onSelectGuideMarker,
      onSubmitMapClick,
      countryToggleMode,
      syncSelectionToViewport,
      continents,
      selection,
    };
  }, [continents, countryToggleMode, onHoverGuideMarker, onHoverGuideStop, onSelectCity, onSelectContinent, onSelectCountry, onSelectGuideMarker, onSelectGuideStop, onSelectSubarea, onSelectState, onSubmitMapClick, onViewportSelectionChange, selection, syncSelectionToViewport]);
  useEffect(() => {
    guideStopDataRef.current = guideStopData;
  }, [guideStopData]);
  useEffect(() => {
    visibleGuideCityMarkerDataRef.current = visibleGuideCityMarkerData;
  }, [visibleGuideCityMarkerData]);
  useEffect(() => {
    viewportCitySelectionDataRef.current = viewportCitySelectionData;
  }, [viewportCitySelectionData]);

  useEffect(() => {
    const now = performance.now();
    const nextVisibleIds = new Set(visibleGuideMarkerIds);
    const enteredAt = visibleGuideMarkerEnteredAtRef.current;
    let hasNewMarker = false;
    let hasChangedMarkers = false;

    visibleGuideMarkerIds.forEach((guideId) => {
      if (!enteredAt.has(guideId)) {
        enteredAt.set(guideId, now);
        hasNewMarker = true;
        hasChangedMarkers = true;
      }
    });

    Array.from(enteredAt.keys()).forEach((guideId) => {
      if (!nextVisibleIds.has(guideId)) {
        enteredAt.delete(guideId);
        hasChangedMarkers = true;
      }
    });

    if (!hasChangedMarkers) {
      return;
    }

    if (!hasNewMarker) {
      setVisibleGuideMarkerAnimationTick((current) => current + 1);
      return;
    }

    if (visibleGuideMarkerAnimationFrameRef.current !== null) {
      cancelAnimationFrame(visibleGuideMarkerAnimationFrameRef.current);
    }

    const animationStartedAt = now;
    const animate = () => {
      setVisibleGuideMarkerAnimationTick((current) => current + 1);
      if (performance.now() - animationStartedAt < 360) {
        visibleGuideMarkerAnimationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      visibleGuideMarkerAnimationFrameRef.current = null;
    };

    visibleGuideMarkerAnimationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (visibleGuideMarkerAnimationFrameRef.current !== null) {
        cancelAnimationFrame(visibleGuideMarkerAnimationFrameRef.current);
        visibleGuideMarkerAnimationFrameRef.current = null;
      }
    };
  }, [visibleGuideMarkerIds]);

  useEffect(() => {
    const map = mapRef.current;
    const visibleIdSet = new Set(visibleGuideMarkerIds);
    const hoverTargetId = hoveredGuideMarkerId && visibleIdSet.has(hoveredGuideMarkerId) ? hoveredGuideMarkerId : null;
    const hoverProgress = visibleGuideMarkerHoverProgressRef.current;
    if (hoverProgress.size) {
      hoverProgress.clear();
      setVisibleGuideMarkerAnimationTick((current) => current + 1);
    }

    if (!map || !isStyleReadyRef.current) {
      return;
    }

    visibleGuideMarkerDirectHoverIdRef.current = hoverTargetId;
    setVisibleGuideMarkerHoverLayout(map, hoverTargetId);
  }, [hoveredGuideMarkerId, visibleGuideMarkerIds]);

  useEffect(() => {
    if (previousHoveredGuideMarkerIdRef.current === hoveredGuideMarkerId) {
      return;
    }

    previousHoveredGuideMarkerIdRef.current = hoveredGuideMarkerId;
    // Marker hover scrolls its guide card into view. Keep those scroll-driven
    // marker-window updates from being interpreted as camera navigation.
    collapsedGuidesCameraSuppressedUntilRef.current = performance.now() + 800;
  }, [hoveredGuideMarkerId]);

  useEffect(() => {
    viewportModeRef.current = viewportMode;
  }, [viewportMode]);
  useEffect(() => {
    viewportInsetsRef.current = viewportInsets;
  }, [viewportInsets]);

  useEffect(() => {
    let isDisposed = false;
    const isCityLevelSelection = Boolean(selection.cityId || selection.subareaId || selection.nestedSubareaId);

    const shouldLoadHighRes = Boolean(
      !isCityLevelSelection && (selectedBoundaryIso3.length > 0 || focusedCountryId || selection.countryId),
    );

    if (!shouldLoadHighRes) {
      recordMapPerfEvent(
        "country-boundary-highres:skipped",
        isCityLevelSelection ? "city-level-selection" : "not-needed",
      );
      return;
    }

    if (countryBoundaryHighResTimeoutRef.current !== null) {
      window.clearTimeout(countryBoundaryHighResTimeoutRef.current);
      countryBoundaryHighResTimeoutRef.current = null;
    }

    const delayMs = isCountryBoundaryHighResLoaded()
      ? 0
      : selection.countryId
        ? 1650
        : 350;

    countryBoundaryHighResTimeoutRef.current = window.setTimeout(() => {
      if (isDisposed) {
        return;
      }

      countryBoundaryHighResTimeoutRef.current = null;
      recordMapPerfEvent("country-boundary-highres:start", delayMs ? `deferred:${delayMs}` : "ready");
      ensureCountryBoundaryHighResLoaded()
        .then(() => {
          if (!isDisposed) {
            recordMapPerfEvent("country-boundary-highres:loaded");
            setCountryBoundaryDataVersion((current) => current + 1);
          }
        })
        .catch((error) => {
          if (!isDisposed) {
            console.error("Failed to load high-resolution country boundary data", error);
          }
        });
    }, delayMs);

    return () => {
      isDisposed = true;
      if (countryBoundaryHighResTimeoutRef.current !== null) {
        window.clearTimeout(countryBoundaryHighResTimeoutRef.current);
        countryBoundaryHighResTimeoutRef.current = null;
      }
    };
  }, [
    focusedCountryId,
    selectedBoundaryIso3,
    selection.cityId,
    selection.countryId,
    selection.nestedSubareaId,
    selection.subareaId,
  ]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    let removeViewportZoomInputListeners: (() => void) | null = null;
    resetMapPerfMetrics();
    recordMapPerfEvent("map:create");
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [10, 20],
      zoom: 1.8,
      minZoom: 1.5,
      maxZoom: 16,
      attributionControl: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    mapRef.current = map;
    const recordRenderGap = () => {
      recordMapRenderGap();
    };
    map.on("render", recordRenderGap);

    map.on("load", () => {
      recordMapPerfEvent("map:load");
      map.once("idle", () => {
        recordMapPerfEvent("map:first-idle");
      });
      isStyleReadyRef.current = true;
      setStyleReadyTick((current) => current + 1);

      map.addSource(SATELLITE_SOURCE_ID, {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        maxzoom: 19,
        attribution: "Source: Esri, Vantor, Earthstar Geographics, and the GIS User Community",
      });
      map.addLayer({
        id: SATELLITE_LAYER_ID,
        type: "raster",
        source: SATELLITE_SOURCE_ID,
        layout: { visibility: "none" },
        paint: {
          "raster-opacity": 1,
          "raster-fade-duration": 180,
        },
      });

      map.addSource(COUNTRY_SOURCE_ID, {
        type: "geojson",
        data: countryData,
        ...COUNTRY_GEOJSON_SOURCE_OPTIONS,
      });

      map.addSource(CONTINENT_LABEL_SOURCE_ID, {
        type: "geojson",
        data: continentLabelData,
        ...POINT_GEOJSON_SOURCE_OPTIONS,
      });

      map.addSource(CITY_SOURCE_ID, {
        type: "geojson",
        data: cityData,
        ...POINT_GEOJSON_SOURCE_OPTIONS,
      });

      map.addSource(NEIGHBORHOOD_MARKER_SOURCE_ID, {
        type: "geojson",
        data: neighborhoodMarkerData,
        ...POINT_GEOJSON_SOURCE_OPTIONS,
      });

      map.addSource(SAVED_LOCATION_SOURCE_ID, {
        type: "geojson",
        data: savedLocationData,
        ...POINT_GEOJSON_SOURCE_OPTIONS,
      });

      map.addSource(VISIBLE_GUIDE_MARKER_SOURCE_ID, {
        type: "geojson",
        data: visibleGuideMarkerData,
        ...POINT_GEOJSON_SOURCE_OPTIONS,
      });

      map.addSource(VISIBLE_GUIDE_CITY_MARKER_SOURCE_ID, {
        type: "geojson",
        data: visibleGuideCityMarkerData,
        ...POINT_GEOJSON_SOURCE_OPTIONS,
      });

      map.addSource(STATE_LABEL_SOURCE_ID, {
        type: "geojson",
        data: stateLabelData,
        ...POINT_GEOJSON_SOURCE_OPTIONS,
      });

      map.addSource(GUIDE_ROUTE_SOURCE_ID, {
        type: "geojson",
        data: guideRouteData,
      });

      map.addSource(POI_MAP_MARKER_SOURCE_ID, {
        type: "geojson",
        data: poiMapMarkerData,
      });

      map.addSource(GUIDE_STOP_SOURCE_ID, {
        type: "geojson",
        data: guideStopData,
        ...POINT_GEOJSON_SOURCE_OPTIONS,
      });

      map.addSource(NEIGHBORHOOD_BOUNDARY_SOURCE_ID, {
        type: "geojson",
        data: neighborhoodBoundaryData,
      });

      map.on("styleimagemissing", (event: { id: string }) => {
        addMissingGuideStopMarkerImage(map, event.id, guideStopDataRef.current);
      });
      ensureGuideStopMarkerImages(map, guideStopData);
      ensureVisibleGuideCityMarkerImages(map, visibleGuideCityMarkerData);

      try {
        addMapLayers(map);
      } catch (error) {
        console.error("Map layer initialization failed", error);
      }
      recordMapPerfEvent("map:base-style-customize:start");
      coolBaseMapGround(map);
      boostBaseRoadContrast(map);
      configureBaseCountryLabels(map);
      hideBasePlaceDots(map);
      softenBaseReliefAndBuildings(map);
      softenBaseTransitStops(map);
      recordMapPerfEvent("map:base-style-customize:end");

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

      const setNeighborhoodMarkerCursor = () => {
        map.getCanvas().style.cursor = "pointer";
      };
      const clearNeighborhoodMarkerCursor = () => {
        map.getCanvas().style.cursor = "";
      };
      map.on("mouseenter", "neighborhood-marker-hit", setNeighborhoodMarkerCursor);
      map.on("mouseenter", "neighborhood-marker-label", setNeighborhoodMarkerCursor);
      map.on("mouseenter", "neighborhood-marker-point", setNeighborhoodMarkerCursor);
      map.on("mouseenter", "neighborhood-marker-halo", setNeighborhoodMarkerCursor);
      map.on("mouseleave", "neighborhood-marker-hit", clearNeighborhoodMarkerCursor);
      map.on("mouseleave", "neighborhood-marker-label", clearNeighborhoodMarkerCursor);
      map.on("mouseleave", "neighborhood-marker-point", clearNeighborhoodMarkerCursor);
      map.on("mouseleave", "neighborhood-marker-halo", clearNeighborhoodMarkerCursor);

      const setDirectHoveredGuideMarker = (guideId: string | null) => {
        if (visibleGuideMarkerDirectHoverIdRef.current === guideId) {
          return;
        }

        visibleGuideMarkerDirectHoverIdRef.current = guideId;
        setVisibleGuideMarkerHoverLayout(map, guideId);
      };

      let directHoveredGuideCityMarkerId: string | null = null;
      const setDirectHoveredGuideCityMarker = (cityMarkerId: string | null) => {
        if (directHoveredGuideCityMarkerId === cityMarkerId) {
          return;
        }

        directHoveredGuideCityMarkerId = cityMarkerId;
        setVisibleGuideCityMarkerHoverLayout(map, cityMarkerId);
      };
      const getNearestGuideCityMarkerId = (event: maplibregl.MapMouseEvent) => {
        if (map.getZoom() >= 8.7) {
          return null;
        }

        const point = event.point;
        let nearest: { id: string; distanceSquared: number } | null = null;
        for (const feature of visibleGuideCityMarkerDataRef.current.features) {
          if (!feature.properties.showCount) {
            continue;
          }
          const projected = map.project(feature.geometry.coordinates as [number, number]);
          const dx = projected.x - point.x;
          const dy = projected.y - point.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared > 34 * 34) {
            continue;
          }
          if (!nearest || distanceSquared < nearest.distanceSquared) {
            nearest = { id: feature.properties.id, distanceSquared };
          }
        }

        return nearest?.id ?? null;
      };

      const notifyHoveredGuideMarker = (guideId: string | null) => {
        if (visibleGuideMarkerNotifiedHoverIdRef.current === guideId) {
          return;
        }

        visibleGuideMarkerNotifiedHoverIdRef.current = guideId;
        handlersRef.current.onHoverGuideMarker?.(guideId);
      };

      const syncHoveredGuideMarker = (event: maplibregl.MapMouseEvent) => {
        const previousGuideId = visibleGuideMarkerDirectHoverIdRef.current;
        const previousCityMarkerId = directHoveredGuideCityMarkerId;
        const features = map.getLayer(VISIBLE_GUIDE_MARKER_POINT_LAYER_ID)
          ? map.queryRenderedFeatures(event.point, {
              layers: [VISIBLE_GUIDE_MARKER_POINT_LAYER_ID],
            })
          : [];
        const citySummaryFeatures = map.getLayer(VISIBLE_GUIDE_CITY_MARKER_POINT_LAYER_ID)
          ? map.queryRenderedFeatures(event.point, {
              layers: [
                VISIBLE_GUIDE_CITY_MARKER_HIT_LAYER_ID,
                VISIBLE_GUIDE_CITY_MARKER_POINT_LAYER_ID,
              ],
            })
          : [];
        const guideId =
          typeof features[0]?.properties?.id === "string" ? features[0].properties.id : null;
        const cityMarkerId =
          (typeof citySummaryFeatures[0]?.properties?.id === "string" ? citySummaryFeatures[0].properties.id : null) ??
          getNearestGuideCityMarkerId(event);
        setDirectHoveredGuideMarker(guideId);
        setDirectHoveredGuideCityMarker(cityMarkerId);
        if (guideId || citySummaryFeatures.length || cityMarkerId) {
          map.getCanvas().style.cursor = "pointer";
        } else if (previousGuideId || previousCityMarkerId) {
          map.getCanvas().style.cursor = "";
        }
        notifyHoveredGuideMarker(guideId);
      };

      const syncHoveredGuideStop = (event: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
        const feature = event.features?.[0];
        const stopId =
          typeof feature?.properties?.stopId === "string"
            ? feature.properties.stopId
            : typeof feature?.properties?.id === "string"
              ? feature.properties.id
              : null;
        handlersRef.current.onHoverGuideStop?.(stopId);
      };

      map.on("mousemove", syncHoveredGuideMarker);
      map.on("mouseout", () => {
        setDirectHoveredGuideMarker(null);
        setDirectHoveredGuideCityMarker(null);
        map.getCanvas().style.cursor = "";
        notifyHoveredGuideMarker(null);
      });
      map.on("mousemove", "guide-stop-points", syncHoveredGuideStop);
      map.on("mousemove", "guide-stop-selected-points", syncHoveredGuideStop);
      map.on("mousemove", "guide-stop-hover", syncHoveredGuideStop);
      map.on("mousemove", "guide-stop-labels", syncHoveredGuideStop);
      map.on("mousemove", "guide-stop-diamonds", syncHoveredGuideStop);
      map.on("mousemove", "guide-stop-selected-diamonds", syncHoveredGuideStop);
      map.on("mousemove", "guide-stop-selected-diamond-labels", syncHoveredGuideStop);
      map.on("mousemove", "guide-stop-diamond-burst", syncHoveredGuideStop);
      map.on("mousemove", "guide-stop-diamond-labels", syncHoveredGuideStop);
      map.on("mousemove", "poi-map-marker-fill", syncHoveredGuideStop);
      map.on("mousemove", "poi-map-marker-line", syncHoveredGuideStop);
      map.on("mouseleave", "guide-stop-points", () => handlersRef.current.onHoverGuideStop?.(null));
      map.on("mouseleave", "guide-stop-selected-points", () => handlersRef.current.onHoverGuideStop?.(null));
      map.on("mouseleave", "guide-stop-hover", () => handlersRef.current.onHoverGuideStop?.(null));
      map.on("mouseleave", "guide-stop-labels", () => handlersRef.current.onHoverGuideStop?.(null));
      map.on("mouseleave", "guide-stop-diamonds", () => handlersRef.current.onHoverGuideStop?.(null));
      map.on("mouseleave", "guide-stop-selected-diamonds", () => handlersRef.current.onHoverGuideStop?.(null));
      map.on("mouseleave", "guide-stop-selected-diamond-labels", () => handlersRef.current.onHoverGuideStop?.(null));
      map.on("mouseleave", "guide-stop-diamond-burst", () => handlersRef.current.onHoverGuideStop?.(null));
      map.on("mouseleave", "guide-stop-diamond-labels", () => handlersRef.current.onHoverGuideStop?.(null));
      map.on("mouseleave", "poi-map-marker-fill", () => handlersRef.current.onHoverGuideStop?.(null));
      map.on("mouseleave", "poi-map-marker-line", () => handlersRef.current.onHoverGuideStop?.(null));

      const requestViewportSelection = (target: MapViewportSelectionTarget) => {
        viewportSelectionTargetRef.current = target;
        collapsedGuidesCameraSuppressedUntilRef.current =
          performance.now() + VIEWPORT_SELECTION_CAMERA_SUPPRESSION_MS;
        handlersRef.current.onViewportSelectionChange?.(target);
      };

      let isUserZoomGesture = false;
      let lastUserZoomInputAt = 0;
      let userZoomFocusLngLat: maplibregl.LngLat | null = null;
      const rememberUserZoomFocusFromEvent = (originalEvent: MouseEvent | TouchEvent | WheelEvent) => {
        isUserZoomGesture = true;
        lastUserZoomInputAt = performance.now();
        const activeViewportInsets = getViewportInsets(
          map,
          viewportModeRef.current,
          viewportInsetsRef.current,
        );
        const point = getUserZoomFocusPoint(map, originalEvent, activeViewportInsets);
        if (point) {
          userZoomFocusLngLat = map.unproject([point.x, point.y]);
        }
      };
      const rememberMapZoomFocus = (
        event: maplibregl.MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined>,
      ) => {
        if (event.originalEvent) {
          rememberUserZoomFocusFromEvent(event.originalEvent);
        }
      };
      const mapContainer = map.getContainer();
      const handleNativeTouchZoom = (event: TouchEvent) => {
        if (event.touches.length >= 2) {
          rememberUserZoomFocusFromEvent(event);
        }
      };
      const handleNativeZoomKey = (event: KeyboardEvent) => {
        if (["+", "-", "=", "NumpadAdd", "NumpadSubtract"].includes(event.key)) {
          isUserZoomGesture = true;
          userZoomFocusLngLat = null;
        }
      };
      const nativeZoomListenerOptions = { capture: true, passive: true } as const;
      mapContainer.addEventListener("wheel", rememberUserZoomFocusFromEvent, nativeZoomListenerOptions);
      mapContainer.addEventListener("dblclick", rememberUserZoomFocusFromEvent, nativeZoomListenerOptions);
      mapContainer.addEventListener("touchstart", handleNativeTouchZoom, nativeZoomListenerOptions);
      mapContainer.addEventListener("touchmove", handleNativeTouchZoom, nativeZoomListenerOptions);
      mapContainer.addEventListener("keydown", handleNativeZoomKey, true);
      removeViewportZoomInputListeners = () => {
        mapContainer.removeEventListener("wheel", rememberUserZoomFocusFromEvent, true);
        mapContainer.removeEventListener("dblclick", rememberUserZoomFocusFromEvent, true);
        mapContainer.removeEventListener("touchstart", handleNativeTouchZoom, true);
        mapContainer.removeEventListener("touchmove", handleNativeTouchZoom, true);
        mapContainer.removeEventListener("keydown", handleNativeZoomKey, true);
      };

      map.on("zoomstart", (event) => {
        if (event.originalEvent) {
          isUserZoomGesture = true;
          userZoomFocusLngLat = null;
          rememberMapZoomFocus(event);
        } else if (!isUserZoomGesture) {
          userZoomFocusLngLat = null;
        }
      });
      map.on("zoom", rememberMapZoomFocus);

      map.on("zoomend", (event) => {
        const userZoomInputAge = performance.now() - lastUserZoomInputAt;
        const wasUserZoomGesture =
          isUserZoomGesture || Boolean(event.originalEvent) || userZoomInputAge < 1600;
        const zoomFocusLngLat = userZoomFocusLngLat;
        isUserZoomGesture = false;
        userZoomFocusLngLat = null;
        const currentHandlers = handlersRef.current;
        if (
          !wasUserZoomGesture ||
          !currentHandlers.syncSelectionToViewport ||
          !currentHandlers.onViewportSelectionChange ||
          viewportModeRef.current === "submit"
        ) {
          return;
        }

        const currentSelection = currentHandlers.selection;
        const zoom = map.getZoom();
        if (
          zoom <= VIEWPORT_CITY_EXIT_ZOOM &&
          currentSelection.cityId &&
          currentSelection.continentId &&
          currentSelection.countryId
        ) {
          requestViewportSelection({
            continentId: currentSelection.continentId,
            countryId: currentSelection.countryId,
          });
          return;
        }

        if (zoom < VIEWPORT_CITY_ENTER_ZOOM) {
          return;
        }

        const activeViewportInsets = getViewportInsets(
          map,
          viewportModeRef.current,
          viewportInsetsRef.current,
        );
        const target = getNearestCityViewportTarget(
          map,
          viewportCitySelectionDataRef.current,
          activeViewportInsets,
          zoomFocusLngLat
            ? map.project(zoomFocusLngLat)
            : event.originalEvent
              ? getUserZoomFocusPoint(map, event.originalEvent, activeViewportInsets)
              : null,
        );
        if (!target?.cityId || target.cityId === currentSelection.cityId) {
          return;
        }

        requestViewportSelection(target);
      });

      map.on("click", (event) => {
        if (handlersRef.current.countryToggleMode) {
          const countryFeature = map
            .queryRenderedFeatures(event.point, { layers: ["country-fills"] })
            .find((feature) => typeof feature.properties?.id === "string");
          const geometryCountry = getCountryAtPoint(handlersRef.current.continents, [
            event.lngLat.lng,
            event.lngLat.lat,
          ]);
          const countryId =
            typeof countryFeature?.properties?.id === "string"
              ? countryFeature.properties.id
              : geometryCountry?.countryId ?? null;
          const continentId =
            typeof countryFeature?.properties?.continentId === "string"
              ? countryFeature.properties.continentId
              : geometryCountry?.continentId ?? null;

          if (continentId && countryId) {
            handlersRef.current.onSelectCountry(continentId, countryId);
          }
          return;
        }

        const clickedGuideStopFeature = map
          .queryRenderedFeatures(event.point, {
            layers: [
              "guide-stop-selected-diamond-labels",
              "guide-stop-selected-diamonds",
              "guide-stop-diamond-labels",
              "guide-stop-diamond-burst",
              "guide-stop-diamonds",
              "guide-stop-selected-points",
              "guide-stop-labels",
              "guide-stop-hover",
              "guide-stop-points",
            ],
          })
          .find((feature) => typeof feature.properties?.id === "string");
        const clickedPoiMapMarkerFeature = map
          .queryRenderedFeatures(event.point, {
            layers: ["poi-map-marker-line", "poi-map-marker-line-casing", "poi-map-marker-fill", "poi-map-marker-point"],
          })
          .find((feature) => typeof feature.properties?.stopId === "string");
        const clickedGuideStopId =
          typeof clickedGuideStopFeature?.properties?.id === "string"
            ? clickedGuideStopFeature.properties.id
            : typeof clickedPoiMapMarkerFeature?.properties?.stopId === "string"
              ? clickedPoiMapMarkerFeature.properties.stopId
            : null;
        if (clickedGuideStopId) {
          selectedStopIdRef.current = clickedGuideStopId;
          handlersRef.current.onHoverGuideStop?.(clickedGuideStopId);
          handlersRef.current.onSelectGuideStop?.(clickedGuideStopId);
          return;
        }

        const clickedNeighborhoodMarkerFeature = map.getLayer("neighborhood-marker-hit")
          ? map
              .queryRenderedFeatures(event.point, {
                layers: [
                  "neighborhood-marker-hit",
                  "neighborhood-marker-label",
                  "neighborhood-marker-point",
                  "neighborhood-marker-halo",
                ],
              })
              .find((feature) => typeof feature.properties?.subareaId === "string")
          : null;
        if (clickedNeighborhoodMarkerFeature) {
          const markerProps = clickedNeighborhoodMarkerFeature.properties ?? {};
          const continentId = typeof markerProps.continentId === "string" ? markerProps.continentId : null;
          const countryId = typeof markerProps.countryId === "string" ? markerProps.countryId : null;
          const cityId = typeof markerProps.cityId === "string" ? markerProps.cityId : null;
          const subareaId = typeof markerProps.subareaId === "string" ? markerProps.subareaId : null;
          const currentMarkerSelection = handlersRef.current.selection;
          const isAlreadySelected =
            currentMarkerSelection.continentId === continentId &&
            currentMarkerSelection.countryId === countryId &&
            currentMarkerSelection.cityId === cityId &&
            currentMarkerSelection.subareaId === subareaId &&
            !currentMarkerSelection.nestedSubareaId;

          if (continentId && countryId && cityId && subareaId) {
            if (!isAlreadySelected) {
              handlersRef.current.onSelectSubarea?.(continentId, countryId, cityId, subareaId);
            }
            return;
          }
        }

        const clickedGuideCityFeature = map.getLayer(VISIBLE_GUIDE_CITY_MARKER_POINT_LAYER_ID)
          ? map
              .queryRenderedFeatures(event.point, {
                layers: [
                  VISIBLE_GUIDE_CITY_MARKER_HIT_LAYER_ID,
                  VISIBLE_GUIDE_CITY_MARKER_POINT_LAYER_ID,
                ],
              })
              .find((feature) => typeof feature.properties?.cityName === "string")
          : null;
        if (clickedGuideCityFeature?.geometry.type === "Point") {
          const cityProps = clickedGuideCityFeature.properties ?? {};
          const continentId = typeof cityProps.continentId === "string" ? cityProps.continentId : null;
          const countryId = typeof cityProps.countryId === "string" ? cityProps.countryId : null;
          const cityId = typeof cityProps.cityId === "string" ? cityProps.cityId : null;
          if (continentId && countryId && cityId) {
            handlersRef.current.onSelectCity(continentId, countryId, cityId);
            return;
          }

          const [lng, lat] = clickedGuideCityFeature.geometry.coordinates;
          map.easeTo({
            center: [lng, lat],
            zoom: Math.max(map.getZoom() + 2.25, 9.5),
            duration: 620,
            essential: true,
          });
          return;
        }

        const clickedGuideMarkerFeature = map.getLayer(VISIBLE_GUIDE_MARKER_POINT_LAYER_ID)
          ? map
              .queryRenderedFeatures(event.point, {
                layers: [VISIBLE_GUIDE_MARKER_POINT_LAYER_ID],
              })
              .find((feature) => typeof feature.properties?.id === "string")
          : null;
        const clickedGuideMarkerId =
          typeof clickedGuideMarkerFeature?.properties?.id === "string" ? clickedGuideMarkerFeature.properties.id : null;
        if (clickedGuideMarkerId) {
          handlersRef.current.onHoverGuideMarker?.(clickedGuideMarkerId);
          handlersRef.current.onSelectGuideMarker?.(clickedGuideMarkerId);
          return;
        }

        if (viewportModeRef.current === "submit" && handlersRef.current.onSubmitMapClick) {
          handlersRef.current.onSubmitMapClick([event.lngLat.lat, event.lngLat.lng]);
          return;
        }

        const features = map.queryRenderedFeatures(event.point, {
          layers: ["city-points", "country-fills", "continent-labels"],
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

        const clickZoom = map.getZoom();
        const currentSelection = handlersRef.current.selection;
        const { country: activeCountry } = getSelectionCountry(
          handlersRef.current.continents,
          currentSelection,
        );

        if (currentSelection.continentId && currentSelection.countryId) {
          const matchingCountryCity = (activeCountry?.cities ?? []).find((city) =>
            !city.isPlaceholderRegion &&
            Array.from(clickedNames).some((clickedName) => nameMatches(clickedName, normalizeLabelName(city.name))),
          );

          if (matchingCountryCity) {
            if (matchingCountryCity.id === currentSelection.cityId) {
              return;
            }
            handlersRef.current.onSelectCity(
              currentSelection.continentId,
              currentSelection.countryId,
              matchingCountryCity.id,
            );
            return;
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

        const countryFeature = features.find((feature) => feature.layer.id === "country-fills");
        const countryFeatureCountryId =
          typeof countryFeature?.properties?.id === "string" ? countryFeature.properties.id : undefined;
        const countryFeatureContinentId =
          typeof countryFeature?.properties?.continentId === "string"
            ? countryFeature.properties.continentId
            : undefined;

        if (
          countryFeatureCountryId &&
          countryFeatureContinentId &&
          (countryFeatureCountryId !== currentSelection.countryId ||
            countryFeatureContinentId !== currentSelection.continentId)
        ) {
          const continent = handlersRef.current.continents.find((item) => item.id === countryFeatureContinentId);
          const country = continent?.countries.find((item) => item.id === countryFeatureCountryId);
          if (country) {
            fitMapToCountry(
              map,
              countryFeatureCountryId,
              country.bounds,
              getViewportInsets(map, viewportModeRef.current, viewportInsetsRef.current),
              { duration: 2200 },
            );
          }
          handlersRef.current.onSelectCountry(countryFeatureContinentId, countryFeatureCountryId);
          return;
        }

        const nearestCityClickTarget = getNearestRealCityClickTarget(
          map,
          event.point,
          handlersRef.current.continents,
          currentSelection,
        );
        if (nearestCityClickTarget) {
          if (nearestCityClickTarget.cityId !== currentSelection.cityId) {
            handlersRef.current.onSelectCity(
              nearestCityClickTarget.continentId,
              nearestCityClickTarget.countryId,
              nearestCityClickTarget.cityId,
            );
          }
          return;
        }

        if (countryFeature) {
          const countryId = countryFeatureCountryId;
          const continentId = countryFeatureContinentId;

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
            if (isSameCountryAsCurrent && (clickZoom > 7.2 || hasLocalSelection)) {
              // At local zoom, the active country's broad polygon sits behind every click. Ignore only
              // that current country so nearby/different country polygons can still be selected.
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

        if (clickZoom > 4.2) {
          return;
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
      if (visibleGuideMarkerAnimationFrameRef.current !== null) {
        cancelAnimationFrame(visibleGuideMarkerAnimationFrameRef.current);
        visibleGuideMarkerAnimationFrameRef.current = null;
      }
      if (activeGuideCameraFrameRef.current !== null) {
        cancelAnimationFrame(activeGuideCameraFrameRef.current);
        activeGuideCameraFrameRef.current = null;
      }
      activeGuideCameraTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      activeGuideCameraTimeoutsRef.current = [];
      if (collapsedGuidesCameraTimeoutRef.current !== null) {
        window.clearTimeout(collapsedGuidesCameraTimeoutRef.current);
        collapsedGuidesCameraTimeoutRef.current = null;
      }
      activeGuideCameraPendingKeyRef.current = null;
      isStyleReadyRef.current = false;
      guideStopHoverPopupRef.current?.remove();
      guideStopHoverPopupRef.current = null;
      map.off("render", recordRenderGap);
      removeViewportZoomInputListeners?.();
      removeViewportZoomInputListeners = null;
      userLocationMarkerRef.current?.remove();
      userLocationMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }
    let resizeFrame: number | null = null;
    const syncViewportChrome = () => {
      const insets = getViewportInsets(map, viewportModeRef.current, viewportInsetsRef.current);
      const controlRight = Math.max(12, insets.right + 14);
      const controlRightValue = `${controlRight}px`;
      const mapContainer = map.getContainer();
      mapContainer.style.setProperty("--rguide-map-controls-right", controlRightValue);
      mapContainer.parentElement?.style.setProperty("--rguide-map-controls-right", controlRightValue);
    };
    const resizeAndSyncViewportChrome = () => {
      resizeFrame = null;
      recordMapResize("window");
      map.resize();
      syncViewportChrome();
    };
    const scheduleResizeAndSyncViewportChrome = () => {
      if (resizeFrame !== null) {
        return;
      }
      resizeFrame = window.requestAnimationFrame(resizeAndSyncViewportChrome);
    };
    scheduleResizeAndSyncViewportChrome();
    window.addEventListener("resize", scheduleResizeAndSyncViewportChrome, { passive: true });
    return () => {
      if (resizeFrame !== null) {
        window.cancelAnimationFrame(resizeFrame);
      }
      window.removeEventListener("resize", scheduleResizeAndSyncViewportChrome);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }
    const frameId = window.requestAnimationFrame(() => {
      const insets = getViewportInsets(map, viewportMode, viewportInsets);
      const controlRight = Math.max(12, insets.right + 14);
      const controlRightValue = `${controlRight}px`;
      const mapContainer = map.getContainer();
      mapContainer.style.setProperty("--rguide-map-controls-right", controlRightValue);
      mapContainer.parentElement?.style.setProperty("--rguide-map-controls-right", controlRightValue);
    });
    return () => {
      window.cancelAnimationFrame(frameId);
    };
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
        recordMapResize("resize-signal");
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

    setGeoJsonSourceData(map, COUNTRY_SOURCE_ID, countryData);
    setGeoJsonSourceData(map, CONTINENT_LABEL_SOURCE_ID, continentLabelData);
    setGeoJsonSourceData(map, CITY_SOURCE_ID, cityData);
    setGeoJsonSourceData(map, NEIGHBORHOOD_MARKER_SOURCE_ID, neighborhoodMarkerData);
    setGeoJsonSourceData(map, SAVED_LOCATION_SOURCE_ID, savedLocationData);
    setGeoJsonSourceData(map, STATE_LABEL_SOURCE_ID, stateLabelData);
    setGeoJsonSourceData(map, NEIGHBORHOOD_BOUNDARY_SOURCE_ID, neighborhoodBoundaryData);
  }, [
    cityData,
    continentLabelData,
    countryData,
    neighborhoodBoundaryData,
    neighborhoodMarkerData,
    savedLocationData,
    stateLabelData,
  ]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isStyleReadyRef.current) {
      return;
    }

    setGeoJsonSourceData(map, VISIBLE_GUIDE_MARKER_SOURCE_ID, visibleGuideMarkerData);
  }, [visibleGuideMarkerData]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isStyleReadyRef.current) {
      return;
    }

    ensureVisibleGuideCityMarkerImages(map, visibleGuideCityMarkerData);
    setGeoJsonSourceData(map, VISIBLE_GUIDE_CITY_MARKER_SOURCE_ID, visibleGuideCityMarkerData);
  }, [visibleGuideCityMarkerData]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isStyleReadyRef.current) {
      return;
    }

    setGeoJsonSourceData(map, GUIDE_ROUTE_SOURCE_ID, guideRouteData);
  }, [guideRouteData]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isStyleReadyRef.current) {
      return;
    }

    setGeoJsonSourceData(map, POI_MAP_MARKER_SOURCE_ID, poiMapMarkerData);
  }, [poiMapMarkerData]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isStyleReadyRef.current) {
      return;
    }

    ensureGuideStopMarkerImages(map, guideStopData);
    setGeoJsonSourceData(map, GUIDE_STOP_SOURCE_ID, guideStopData);
  }, [guideStopData]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isStyleReadyRef.current) {
      guideStopHoverPopupRef.current?.remove();
      guideStopHoverPopupRef.current = null;
      return;
    }

    const hoveredFeature = hoveredStopId
      ? guideStopData.features.find(
          (feature) => feature.properties.id === hoveredStopId && feature.geometry.type === "Point",
        )
      : null;

    if (!hoveredFeature || hoveredFeature.geometry.type !== "Point") {
      guideStopHoverPopupRef.current?.remove();
      guideStopHoverPopupRef.current = null;
      return;
    }

    const popupContent = document.createElement("div");
    popupContent.className = "rguide-guide-stop-callout";
    popupContent.textContent = hoveredFeature.properties.name;
    const calloutColor = CATEGORY_STYLES[hoveredFeature.properties.category]?.mapColor ?? "#0f172a";
    popupContent.style.setProperty("--guide-stop-callout-color", calloutColor);

    if (!guideStopHoverPopupRef.current) {
      guideStopHoverPopupRef.current = new maplibregl.Popup({
        anchor: "bottom",
        closeButton: false,
        closeOnClick: false,
        className: "rguide-guide-stop-popup",
        offset: [0, -18],
      });
    }

    guideStopHoverPopupRef.current
      .setLngLat(hoveredFeature.geometry.coordinates as [number, number])
      .setDOMContent(popupContent)
      .addTo(map);
    guideStopHoverPopupRef.current
      .getElement()
      .style.setProperty("--guide-stop-callout-color", calloutColor);
  }, [guideStopData, hoveredStopId]);

  const activeGuidePulseStopId = useMemo(() => {
    const renderedStopIds = new Set(guideStopData.features.map((feature) => feature.properties.id));
    const candidateStopIds = [hoveredStopId, selectedStopId];

    return candidateStopIds.find((stopId): stopId is string => Boolean(stopId && renderedStopIds.has(stopId))) ?? null;
  }, [guideStopData, hoveredStopId, selectedStopId]);
  const isActiveGuidePulseStopNested = useMemo(
    () =>
      activeGuidePulseStopId
        ? guideStopData.features.find((feature) => feature.properties.id === activeGuidePulseStopId)
            ?.properties.isNested === true
        : false,
    [activeGuidePulseStopId, guideStopData],
  );

  useEffect(() => {
    const map = mapRef.current;
    if (
      !map ||
      !isStyleReadyRef.current ||
      !map.getLayer("guide-stop-selected-points") ||
      !map.getLayer("guide-stop-selected-diamonds") ||
      !map.getLayer("guide-stop-selected-diamond-labels") ||
      !map.getLayer("guide-stop-hover") ||
      !map.getLayer("guide-stop-burst") ||
      !map.getLayer("guide-stop-diamond-burst")
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
        visualState.amount = 0;
        visualState.frame = 0;
      }
      visualState.target = 0;
      const activeStopFilter: maplibregl.FilterSpecification = ["==", ["get", "id"], activeGuidePulseStopId];
      const emptyStopFilter: maplibregl.FilterSpecification = ["==", ["get", "id"], "__none__"];
      map.setFilter("guide-stop-selected-points", isActiveGuidePulseStopNested ? emptyStopFilter : activeStopFilter);
      map.setFilter("guide-stop-selected-diamonds", isActiveGuidePulseStopNested ? activeStopFilter : emptyStopFilter);
      map.setFilter("guide-stop-selected-diamond-labels", emptyStopFilter);
      map.setFilter("guide-stop-hover", emptyStopFilter);
      map.setFilter("guide-stop-burst", isActiveGuidePulseStopNested ? emptyStopFilter : activeStopFilter);
      map.setFilter("guide-stop-diamond-burst", isActiveGuidePulseStopNested ? activeStopFilter : emptyStopFilter);
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

      const continuousPulse = state.target === 1 ? (state.frame % 54) / 54 : 0;
      const burstGrow = state.target === 1 ? continuousPulse : state.burstT;
      const burstFade = state.target === 1 ? 1 - continuousPulse : state.burstActive ? 1 - state.burstT : 0;

      const hoverRadiusAtLowZoom = 6 + 5.2 * hoverScale;
      const hoverRadiusAtHighZoom = 7.8 + 6.4 * hoverScale;
      const burstRadiusAtLowZoom = 9 + 14 * burstGrow;
      const burstRadiusAtHighZoom = 12 + 20 * burstGrow;
      const burstOpacity = state.target === 1 ? 0.72 * burstFade : 0.78 * burstFade;
      const burstStrokeWidth = 2.9 - 1.35 * burstGrow;
      const selectedPointLowZoom = 0.82 + 0.16 * hoverScale;
      const selectedPointHighZoom = 0.98 + 0.18 * hoverScale;
      const selectedDiamondLowZoom = 1.04 + 0.2 * hoverScale;
      const selectedDiamondHighZoom = 1.12 + 0.22 * hoverScale;
      const shouldUpdateSymbolLayout = !map.isMoving();

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
      map.setPaintProperty("guide-stop-burst", "circle-opacity", 0);
      map.setPaintProperty("guide-stop-burst", "circle-stroke-opacity", burstOpacity);
      map.setPaintProperty("guide-stop-burst", "circle-stroke-width", burstStrokeWidth);
      if (shouldUpdateSymbolLayout) {
        map.setLayoutProperty("guide-stop-selected-points", "icon-size", [
          "interpolate",
          ["linear"],
          ["zoom"],
          3,
          selectedPointLowZoom,
          8,
          selectedPointHighZoom,
        ]);
      }
      map.setPaintProperty("guide-stop-selected-points", "icon-opacity", isActiveGuidePulseStopNested ? 0 : hoverScale);
      if (shouldUpdateSymbolLayout) {
        map.setLayoutProperty("guide-stop-selected-diamonds", "icon-size", [
          "interpolate",
          ["linear"],
          ["zoom"],
          3,
          selectedDiamondLowZoom,
          8,
          selectedDiamondHighZoom,
        ]);
      }
      map.setPaintProperty("guide-stop-selected-diamonds", "icon-opacity", isActiveGuidePulseStopNested ? hoverScale : 0);
      map.setPaintProperty("guide-stop-selected-diamond-labels", "text-opacity", 0);
      if (shouldUpdateSymbolLayout) {
        map.setLayoutProperty("guide-stop-diamond-burst", "icon-size", [
          "interpolate",
          ["linear"],
          ["zoom"],
          3,
          0.82 + 0.74 * burstGrow,
          8,
          0.9 + 0.98 * burstGrow,
        ]);
      }
      map.setPaintProperty(
        "guide-stop-diamond-burst",
        "icon-opacity",
        isActiveGuidePulseStopNested ? burstOpacity : 0,
      );

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
          map.setFilter("guide-stop-selected-points", ["==", ["get", "id"], "__none__"]);
          map.setFilter("guide-stop-selected-diamonds", ["==", ["get", "id"], "__none__"]);
          map.setFilter("guide-stop-selected-diamond-labels", ["==", ["get", "id"], "__none__"]);
          map.setFilter("guide-stop-burst", ["==", ["get", "id"], "__none__"]);
          map.setFilter("guide-stop-diamond-burst", ["==", ["get", "id"], "__none__"]);
          map.setPaintProperty("guide-stop-selected-points", "icon-opacity", 0);
          map.setPaintProperty("guide-stop-selected-diamonds", "icon-opacity", 0);
          map.setPaintProperty("guide-stop-selected-diamond-labels", "text-opacity", 0);
          map.setPaintProperty("guide-stop-burst", "circle-opacity", 0);
          map.setPaintProperty("guide-stop-burst", "circle-stroke-opacity", 0);
          map.setPaintProperty("guide-stop-diamond-burst", "icon-opacity", 0);
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
    let startFrameId: number | null = null;
    let isCancelled = false;
    const startAnimation = () => {
      if (isCancelled) {
        return;
      }
      hoverVisualStateRef.current.target = activeGuidePulseStopId ? 1 : 0;
      hoverAnimationFrameRef.current = requestAnimationFrame(tick);
    };
    const waitForCameraThenStart = () => {
      if (isCancelled) {
        return;
      }
      if (activeGuidePulseStopId && map.isMoving()) {
        map.once("moveend", startAnimation);
        return;
      }
      startAnimation();
    };
    startFrameId = requestAnimationFrame(waitForCameraThenStart);

    return () => {
      isCancelled = true;
      if (startFrameId !== null) {
        cancelAnimationFrame(startFrameId);
      }
      map.off("moveend", startAnimation);
      if (hoverAnimationFrameRef.current !== null) {
        cancelAnimationFrame(hoverAnimationFrameRef.current);
        hoverAnimationFrameRef.current = null;
      }
    };
  }, [activeGuidePulseStopId, isActiveGuidePulseStopNested]);

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
      activeGuideCameraPendingKeyRef.current = null;
      if (activeGuideCameraFrameRef.current !== null) {
        cancelAnimationFrame(activeGuideCameraFrameRef.current);
        activeGuideCameraFrameRef.current = null;
      }
      activeGuideCameraTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      activeGuideCameraTimeoutsRef.current = [];
      return;
    }
    const selectedParentStop =
      selectedStopId
        ? activeGuide.stops.find((stop) => stop.id === selectedStopId)
        : null;
    const selectedNestedStop =
      selectedStopId
        ? activeGuide.stops
            .flatMap((stop) =>
              (stop.places ?? []).map((place) => ({
                parent: stop,
                place,
              })),
            )
            .find(({ place }) => place.id === selectedStopId)
        : null;
    const selectedCameraTargetId =
      selectedParentStop?.id ?? selectedNestedStop?.place.id ?? "";
    const nextCameraKey = selectedCameraTargetId
      ? [
          activeGuide.id,
          activeGuideStopSignature,
          selectedCameraTargetId,
          viewportModeRef.current,
        ].join("|")
      : [
          activeGuide.id,
          activeGuideFitNonce,
          activeGuideStopSignature,
          activeGuidePoiMarkerSignature,
          viewportModeRef.current,
        ].join("|");
    if (
      activeGuideCameraKeyRef.current === nextCameraKey ||
      activeGuideCameraPendingKeyRef.current === nextCameraKey
    ) {
      return;
    }
    selectionCameraKeyRef.current = selectionCameraKey;

    if (activeGuideCameraFrameRef.current !== null) {
      cancelAnimationFrame(activeGuideCameraFrameRef.current);
      activeGuideCameraFrameRef.current = null;
    }
    activeGuideCameraTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    activeGuideCameraTimeoutsRef.current = [];
    activeGuideCameraPendingKeyRef.current = nextCameraKey;

    const runCamera = (duration: number) => {
      activeGuideCameraFrameRef.current = null;
      const currentMap = mapRef.current;
      const isPendingCamera = activeGuideCameraPendingKeyRef.current === nextCameraKey;
      const isCurrentCamera = activeGuideCameraKeyRef.current === nextCameraKey;
      if (!currentMap || !isStyleReadyRef.current || (!isPendingCamera && !isCurrentCamera)) {
        return;
      }
      const latestSelectedStopId = selectedStopIdRef.current ?? null;
      if (
        activeGuideIdRef.current !== activeGuide.id ||
        (selectedCameraTargetId ? latestSelectedStopId !== selectedCameraTargetId : latestSelectedStopId !== null)
      ) {
        return;
      }
      const container = currentMap.getContainer();
      if (container.clientWidth < 120 || container.clientHeight < 120) {
        return;
      }

      const completeCameraRequest = () => {
        if (isPendingCamera) {
          activeGuideCameraPendingKeyRef.current = null;
        }
        activeGuideCameraKeyRef.current = nextCameraKey;
      };
      const activeViewportInsets = getViewportInsets(
        currentMap,
        viewportModeRef.current,
        viewportInsetsRef.current,
      );
      currentMap.stop();
      resetCameraPadding(currentMap);

      if (selectedParentStop || selectedNestedStop) {
        const focusedPoint = selectedParentStop ?? selectedNestedStop!.place;
        const [lat, lng] = focusedPoint.coordinates;
        completeCameraRequest();
        recordMapCamera("active-guide:selected-point", nextCameraKey);
        currentMap.easeTo({
          center: [lng, lat],
          zoom: Math.max(currentMap.getZoom(), 14.8),
          padding: clampPaddingToMap(
            currentMap,
            mergePadding({ top: 48, right: 52, bottom: 56, left: 52 }, activeViewportInsets),
          ),
          duration,
          easing: smoothCameraEasing,
          essential: true,
        });
        return;
      }

      const guideBounds = new LngLatBounds();
      let guideCoordinateCount = 0;
      let guideMarkerGeometryCount = 0;
      for (const stop of activeGuide.stops) {
        const [lat, lng] = stop.coordinates;
        guideBounds.extend([lng, lat]);
        guideCoordinateCount += 1;
        for (const place of stop.places ?? []) {
          const [placeLat, placeLng] = place.coordinates;
          guideBounds.extend([placeLng, placeLat]);
          guideCoordinateCount += 1;
        }
      }
      for (const markerFeature of cameraPoiMapMarkerData.features) {
        const markerCoordinates = getGeometryCoordinates(markerFeature.geometry);
        if (!markerCoordinates) {
          continue;
        }
        extendBoundsFromCoordinates(guideBounds, markerCoordinates);
        guideMarkerGeometryCount += 1;
      }

      if (guideCoordinateCount === 1 && guideMarkerGeometryCount === 0) {
        const [lat, lng] = activeGuide.stops[0].coordinates;
        completeCameraRequest();
        recordMapCamera("active-guide:single-stop", nextCameraKey);
        currentMap.easeTo({
          center: [lng, lat],
          zoom: Math.max(currentMap.getZoom(), 12.4),
          padding: clampPaddingToMap(
            currentMap,
            mergePadding({ top: 36, right: 36, bottom: 36, left: 36 }, activeViewportInsets),
          ),
          duration,
          easing: smoothCameraEasing,
          essential: true,
        });
        return;
      }

      if (guideBounds.isEmpty()) {
        return;
      }

      completeCameraRequest();
      recordMapCamera("active-guide:bounds", nextCameraKey);
      currentMap.fitBounds(guideBounds, {
        padding: clampPaddingToMap(
          currentMap,
          mergePadding({ top: 40, right: 40, bottom: 48, left: 40 }, activeViewportInsets),
        ),
        duration,
        easing: smoothCameraEasing,
        essential: true,
        maxZoom: Math.max(12.8, getGuideBoundsZoom(guideBounds)),
      });
    };

    const cameraDelay = selectedCameraTargetId ? 0 : 160;
    const cameraDuration = selectedCameraTargetId ? 520 : 760;
    const startTimeout = window.setTimeout(() => {
      activeGuideCameraTimeoutsRef.current = activeGuideCameraTimeoutsRef.current.filter(
        (timeoutId) => timeoutId !== startTimeout,
      );
      activeGuideCameraFrameRef.current = requestAnimationFrame(() => runCamera(cameraDuration));
    }, cameraDelay);
    activeGuideCameraTimeoutsRef.current.push(startTimeout);

    return () => {
      if (activeGuideCameraFrameRef.current !== null) {
        cancelAnimationFrame(activeGuideCameraFrameRef.current);
        activeGuideCameraFrameRef.current = null;
      }
      activeGuideCameraTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      activeGuideCameraTimeoutsRef.current = [];
      if (activeGuideCameraPendingKeyRef.current === nextCameraKey) {
        activeGuideCameraPendingKeyRef.current = null;
      }
    };
  }, [
    activeGuide,
    activeGuideFitNonce,
    activeGuidePoiMarkerSignature,
    activeGuideStopSignature,
    cameraPoiMapMarkerData,
    selectionCameraKey,
    styleReadyTick,
    selectedStopId,
    viewportMode,
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
    const viewportSelectionTarget = viewportSelectionTargetRef.current;
    if (viewportSelectionTarget) {
      if (selectionMatchesViewportTarget(selection, viewportSelectionTarget)) {
        selectionCameraKeyRef.current = nextCameraKey;
        selectionCameraSettlingUntilRef.current = 0;
        recordMapPerfEvent("camera:selection-preserved", nextCameraKey);
        return;
      }
      viewportSelectionTargetRef.current = null;
    }
    if (selectionCameraKeyRef.current === nextCameraKey) {
      return;
    }
    const isInitialSelectionCamera = selectionCameraKeyRef.current === null;
    const cameraDuration = isInitialSelectionCamera ? 0 : 1450;
    selectionCameraKeyRef.current = nextCameraKey;
    selectionCameraSettlingUntilRef.current = performance.now() + cameraDuration + 180;
    const activeViewportInsets = getViewportInsets(map, viewportModeRef.current, viewportInsetsRef.current);
    resetCameraPadding(map);
    recordMapCamera("selection", nextCameraKey);

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
          duration: cameraDuration,
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
        duration: cameraDuration,
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
        duration: cameraDuration,
        easing: smoothCameraEasing,
        essential: true,
      });
      return;
    }

    if (activeCity) {
      if (activeCity.isPlaceholderRegion) {
        if (activeCountry) {
          fitMapToCountry(map, activeCountry.id, activeCountry.bounds, activeViewportInsets, { duration: cameraDuration });
          return;
        }
      }

      map.easeTo({
        center: [activeCity.coordinates[1], activeCity.coordinates[0]],
        zoom: 11.8,
        padding: mergePadding({ top: 28, right: 28, bottom: 28, left: 28 }, activeViewportInsets),
        duration: cameraDuration,
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
        duration: cameraDuration,
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
          duration: cameraDuration,
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
        duration: cameraDuration,
        easing: smoothCameraEasing,
        essential: true,
      });
      return;
    }

    if (activeCountry) {
      fitMapToCountry(map, activeCountry.id, activeCountry.bounds, activeViewportInsets, { duration: cameraDuration });
      return;
    }

    if (activeContinent) {
      fitMapToContinent(map, activeContinent, activeViewportInsets, { duration: cameraDuration });
      return;
    }

    map.easeTo({
      center: [10, 20],
      zoom: 1.8,
      padding: mergePadding({ top: 24, right: 24, bottom: 24, left: 24 }, activeViewportInsets),
      duration: cameraDuration,
      easing: smoothCameraEasing,
      essential: true,
    });
  }, [
    activeNeighborhoodBoundary,
    activeGuide?.id,
    activeGuide?.stops?.length,
    continents,
    selection,
    styleReadyTick,
    viewportMode,
    viewportInsets,
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
    resetCameraPadding(map);
    recordMapCamera("focused-country", focusedCountryId);
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

  useEffect(() => {
    const map = mapRef.current;
    if (collapsedGuidesCameraTimeoutRef.current !== null) {
      window.clearTimeout(collapsedGuidesCameraTimeoutRef.current);
      collapsedGuidesCameraTimeoutRef.current = null;
    }
    if (activeGuide?.stops?.length) {
      collapsedGuidesCameraKeyRef.current = null;
      return;
    }
    if (
      !map ||
      !isStyleReadyRef.current ||
      viewportMode === "submit" ||
      !selection.cityId ||
      !visibleGuideBoundsSignature
    ) {
      return;
    }

    const nextCameraKey = [
      selection.cityId,
      visibleGuideBoundsSignature,
      viewportModeRef.current,
    ].join("|");
    const viewportSelectionTarget = viewportSelectionTargetRef.current;
    if (
      viewportSelectionTarget &&
      selectionMatchesViewportTarget(selection, viewportSelectionTarget)
    ) {
      collapsedGuidesCameraKeyRef.current = nextCameraKey;
      return;
    }
    if (
      hoveredGuideMarkerId ||
      performance.now() < collapsedGuidesCameraSuppressedUntilRef.current
    ) {
      collapsedGuidesCameraKeyRef.current = nextCameraKey;
      return;
    }
    if (collapsedGuidesCameraKeyRef.current === nextCameraKey) {
      return;
    }

    const runCollapsedGuidesCamera = () => {
      collapsedGuidesCameraTimeoutRef.current = null;
      if (
        collapsedGuidesCameraKeyRef.current === nextCameraKey ||
        activeGuideIdRef.current ||
        !isStyleReadyRef.current
      ) {
        return;
      }
      collapsedGuidesCameraKeyRef.current = nextCameraKey;

      resetCameraPadding(map);
      const activeViewportInsets = getViewportInsets(map, viewportModeRef.current, viewportInsetsRef.current);
      const guideBounds = new LngLatBounds();

      visibleGuideMarkerData.features.forEach((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        guideBounds.extend([lng, lat]);
      });

      if (guideBounds.isEmpty()) {
        return;
      }

      if (visibleGuideMarkerData.features.length === 1) {
        const [lng, lat] = visibleGuideMarkerData.features[0].geometry.coordinates;
        recordMapCamera("collapsed-guides:single", nextCameraKey);
        map.easeTo({
          center: [lng, lat],
          zoom: Math.max(map.getZoom(), 12.2),
          padding: clampPaddingToMap(
            map,
            mergePadding({ top: 36, right: 36, bottom: 40, left: 36 }, activeViewportInsets),
          ),
          duration: 720,
          easing: smoothCameraEasing,
          essential: true,
        });
        return;
      }

      recordMapCamera("collapsed-guides:bounds", nextCameraKey);
      map.fitBounds(guideBounds, {
        padding: clampPaddingToMap(
          map,
          mergePadding({ top: 36, right: 36, bottom: 44, left: 36 }, activeViewportInsets),
        ),
        duration: 720,
        easing: smoothCameraEasing,
        essential: true,
        maxZoom: Math.max(12.2, getGuideBoundsZoom(guideBounds)),
      });
    };

    const delay = Math.max(0, selectionCameraSettlingUntilRef.current - performance.now());
    if (delay > 40) {
      collapsedGuidesCameraTimeoutRef.current = window.setTimeout(runCollapsedGuidesCamera, delay);
      return () => {
        if (collapsedGuidesCameraTimeoutRef.current !== null) {
          window.clearTimeout(collapsedGuidesCameraTimeoutRef.current);
          collapsedGuidesCameraTimeoutRef.current = null;
        }
      };
    }

    runCollapsedGuidesCamera();
  }, [
    activeGuide,
    hoveredGuideMarkerId,
    selection.cityId,
    styleReadyTick,
    viewportMode,
    visibleGuideBoundsSignature,
    visibleGuideMarkerData,
  ]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isStyleReadyRef.current || !map.getLayer(SATELLITE_LAYER_ID)) {
      return;
    }

    map.setLayoutProperty(
      SATELLITE_LAYER_ID,
      "visibility",
      isSatelliteView ? "visible" : "none",
    );
  }, [isSatelliteView, styleReadyTick]);

  return (
    <div className="relative h-full min-h-[60vh] lg:min-h-[calc(100vh-15rem)]">
      <div
        ref={containerRef}
        className="rguide-map-layer h-full min-h-[60vh] overflow-hidden bg-slate-100 lg:min-h-[calc(100vh-15rem)]"
      />
      <button
        type="button"
        onClick={focusUserLocation}
        disabled={locationStatus === "locating"}
        className={`rguide-locate-control absolute top-[3.125rem] z-[90] flex h-8 w-8 items-center justify-center rounded-lg border bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 disabled:cursor-wait disabled:opacity-80 ${
          locationStatus === "located"
            ? "border-sky-300 text-sky-700 ring-2 ring-sky-200/80"
            : locationStatus === "error"
              ? "border-rose-300 text-rose-700"
              : "border-slate-200"
        }`}
        aria-label={locationMessage}
        title={locationMessage}
      >
        <LocateFixed className={`h-3.5 w-3.5 ${locationStatus === "locating" ? "animate-pulse" : ""}`} />
      </button>
      <button
        type="button"
        onClick={() => setIsSatelliteView((current) => !current)}
        className={`rguide-satellite-control absolute top-[5.5rem] z-[90] flex h-8 w-8 items-center justify-center rounded-lg border bg-white shadow-sm transition hover:border-slate-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 ${
          isSatelliteView
            ? "border-sky-300 text-sky-700 ring-2 ring-sky-200/80"
            : "border-slate-200 text-slate-700"
        }`}
        aria-label={isSatelliteView ? "Show standard map" : "Show satellite map"}
        aria-pressed={isSatelliteView}
        title={isSatelliteView ? "Standard map" : "Satellite map"}
      >
        <SatelliteAlt className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
