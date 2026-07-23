import type { Feature, FeatureCollection, Geometry } from "geojson";

export type NeighborhoodBoundaryProperties = {
  id: string;
  name: string;
};

export type NeighborhoodBoundaryMap = Record<
  string,
  Feature<Geometry, NeighborhoodBoundaryProperties>
>;

type BoundaryModule = {
  default: unknown;
};

type BoundaryLoader = () => Promise<BoundaryModule>;

const boundaryLoaders: Record<string, BoundaryLoader> = {
  amsterdam: () => import("@/data/boundaries/amsterdam.json"),
  athens: () => import("@/data/boundaries/athens.json"),
  barcelona: () => import("@/data/boundaries/barcelona.json"),
  berlin: () => import("@/data/boundaries/berlin.json"),
  boston: () => import("@/data/boundaries/boston.json"),
  chicago: () => import("@/data/boundaries/chicago.json"),
  dallas: () => import("@/data/boundaries/dallas.json"),
  dubai: () => import("@/data/boundaries/dubai.json"),
  honolulu: () => import("@/data/boundaries/honolulu.json"),
  houston: () => import("@/data/boundaries/houston.json"),
  jacksonville: () => import("@/data/boundaries/jacksonville.json"),
  "las-vegas": () => import("@/data/boundaries/las-vegas.json"),
  lisbon: () => import("@/data/boundaries/lisbon.json"),
  london: () => import("@/data/boundaries/london.json"),
  "los-angeles": () => import("@/data/boundaries/los-angeles.json"),
  lyon: () => import("@/data/boundaries/lyon.json"),
  madrid: () => import("@/data/boundaries/madrid.json"),
  medellin: () => import("@/data/boundaries/medellin.json"),
  melbourne: () => import("@/data/boundaries/melbourne.json"),
  "mexico-city": () => import("@/data/boundaries/mexico-city.json"),
  miami: () => import("@/data/boundaries/miami.json"),
  milan: () => import("@/data/boundaries/milan.json"),
  nashville: () => import("@/data/boundaries/nashville.json"),
  "new-orleans": () => import("@/data/boundaries/new-orleans.json"),
  "new-york-city": () => import("@/data/boundaries/new-york-city.json"),
  orlando: () => import("@/data/boundaries/orlando.json"),
  paris: () => import("@/data/boundaries/paris.json"),
  philadelphia: () => import("@/data/boundaries/philadelphia.json"),
  phoenix: () => import("@/data/boundaries/phoenix.json"),
  porto: () => import("@/data/boundaries/porto.json"),
  prague: () => import("@/data/boundaries/prague.json"),
  rome: () => import("@/data/boundaries/rome.json"),
  "san-antonio": () => import("@/data/boundaries/san-antonio.json"),
  "san-diego": () => import("@/data/boundaries/san-diego.json"),
  "san-francisco": () => import("@/data/boundaries/san-francisco.json"),
  seattle: () => import("@/data/boundaries/seattle.json"),
  sydney: () => import("@/data/boundaries/sydney.json"),
  tokyo: () => import("@/data/boundaries/tokyo.json"),
  vienna: () => import("@/data/boundaries/vienna.json"),
  "washington-dc": () => import("@/data/boundaries/washington-dc.json"),
};

const priorityBoundaryLoaders: Partial<Record<string, BoundaryLoader[]>> = {
  "los-angeles": [
    () => import("@/data/la-neighborhood-boundaries.json"),
    boundaryLoaders["los-angeles"],
  ],
  "new-york-city": [
    () => import("@/data/nyc-borough-boundaries.json"),
    () => import("@/data/nyc-neighborhood-boundaries.json"),
    boundaryLoaders["new-york-city"],
  ],
};

const boundaryCache = new Map<string, Promise<NeighborhoodBoundaryMap>>();
const STATIC_BOUNDARY_ASSET_VERSION = "20260723-ueno-official";

function isPolygonBoundaryFeature(
  feature: unknown,
): feature is Feature<Geometry, NeighborhoodBoundaryProperties> {
  const geometryType = (feature as Feature<Geometry, NeighborhoodBoundaryProperties> | null)?.geometry?.type;
  return geometryType === "Polygon" || geometryType === "MultiPolygon";
}

function toBoundaryMap(module: BoundaryModule): NeighborhoodBoundaryMap {
  const boundaryMap = module.default as NeighborhoodBoundaryMap;
  return Object.fromEntries(
    Object.entries(boundaryMap).filter(([, feature]) => isPolygonBoundaryFeature(feature)),
  );
}

function mergeBoundaryMaps(maps: NeighborhoodBoundaryMap[]) {
  const merged: NeighborhoodBoundaryMap = {};

  for (const map of maps) {
    for (const [key, feature] of Object.entries(map)) {
      if (!merged[key]) {
        merged[key] = feature;
      }
    }
  }

  return merged;
}

async function loadNeighborhoodBoundaryMapUncached(cityId: string) {
  const staticBoundaryMap = await loadStaticNeighborhoodBoundaryMap(cityId);
  if (Object.keys(staticBoundaryMap).length) {
    return staticBoundaryMap;
  }

  const loaders = priorityBoundaryLoaders[cityId] ?? (
    boundaryLoaders[cityId] ? [boundaryLoaders[cityId]] : []
  );

  if (!loaders.length) {
    return {};
  }

  const maps = await Promise.all(loaders.map((loader) => loader().then(toBoundaryMap)));
  return mergeBoundaryMaps(maps);
}

async function loadStaticNeighborhoodBoundaryMap(cityId: string) {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const response = await fetch(`/data/boundaries/${encodeURIComponent(cityId)}.geojson?v=${STATIC_BOUNDARY_ASSET_VERSION}`, {
      cache: "force-cache",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      return {};
    }

    const collection = await response.json() as FeatureCollection<Geometry, NeighborhoodBoundaryProperties>;
    return Object.fromEntries(
      (collection.features ?? [])
        .filter(isPolygonBoundaryFeature)
        .map((feature) => [feature.properties.id, feature]),
    );
  } catch {
    return {};
  }
}

export function loadNeighborhoodBoundaryMap(cityId: string) {
  const cached = boundaryCache.get(cityId);
  if (cached) {
    return cached;
  }

  const loadPromise = loadNeighborhoodBoundaryMapUncached(cityId).catch((error) => {
    boundaryCache.delete(cityId);
    throw error;
  });
  boundaryCache.set(cityId, loadPromise);
  return loadPromise;
}
