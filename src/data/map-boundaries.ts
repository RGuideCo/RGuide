import type { Feature, Geometry } from "geojson";

import worldCountries from "@/data/world-countries.json";

type WorldCountrySeed = {
  id: string;
  name: string;
  feature?: Feature<Geometry> & {
    id?: string;
  };
};

type HighResFeatureCollection = {
  features?: Array<Feature<Geometry> & { properties?: Record<string, unknown> }>;
};

type BoundaryModule = {
  default: unknown;
};

type HighResLoader = () => Promise<BoundaryModule>;

function normalizeCountryName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

const worldCountrySeeds = worldCountries as unknown as WorldCountrySeed[];

const worldCountryHighResLoader: HighResLoader = () => import("@/data/world-countries-highres-collection.json");

const countryIdByIso3 = new Map<string, string>();
const countryIdByName = new Map<string, string>();
for (const country of worldCountrySeeds) {
  const iso3 = typeof country.feature?.id === "string" ? country.feature.id.toUpperCase() : null;
  if (iso3) {
    countryIdByIso3.set(iso3, country.id);
  }
  countryIdByName.set(normalizeCountryName(country.name), country.id);
}

export const countryBoundaryFeatures: Record<string, Feature<Geometry>> = {};
let highResLoadPromise: Promise<void> | null = null;
let highResLoaded = false;

function addFeatureBoundary(feature: Feature<Geometry>, overwrite = false) {
  const properties = feature.properties ?? {};
  const iso3Raw =
    typeof properties["ISO3166-1-Alpha-3"] === "string"
      ? properties["ISO3166-1-Alpha-3"]
      : typeof properties.iso_a3 === "string"
        ? properties.iso_a3
        : typeof properties.ISO_A3 === "string"
          ? properties.ISO_A3
          : null;
  const iso3Candidate = iso3Raw ? String(iso3Raw).toUpperCase() : null;
  const iso3 = iso3Candidate && /^[A-Z]{3}$/.test(iso3Candidate) ? iso3Candidate : null;
  const nameRaw =
    typeof properties.name === "string"
      ? properties.name
      : typeof properties.NAME === "string"
        ? properties.NAME
        : "";
  const countryId =
    (iso3 ? countryIdByIso3.get(iso3) : undefined) ??
    (nameRaw ? countryIdByName.get(normalizeCountryName(nameRaw)) : undefined);

  if (!countryId) {
    return;
  }

  if (overwrite || !countryBoundaryFeatures[countryId]) {
    countryBoundaryFeatures[countryId] = feature;
  }
}

function addSeedBoundaries() {
  for (const country of worldCountrySeeds) {
    if (countryBoundaryFeatures[country.id] || !country.feature) {
      continue;
    }
    countryBoundaryFeatures[country.id] = country.feature;
  }
}

export function ensureCountryBoundaryHighResLoaded() {
  if (highResLoadPromise) {
    return highResLoadPromise;
  }

  highResLoadPromise = worldCountryHighResLoader()
    .then((module) => {
      const moduleData = module.default as HighResFeatureCollection;
      const features = moduleData?.features ?? [];

      for (const feature of features) {
        addFeatureBoundary(feature, true);
      }
      highResLoaded = true;
    })
    .catch((error) => {
      highResLoadPromise = null;
      throw error;
    });

  return highResLoadPromise;
}

export function isCountryBoundaryHighResLoaded() {
  return highResLoaded;
}

addSeedBoundaries();
