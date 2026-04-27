import type { Feature, Geometry } from "geojson";

import worldCountriesHighRes from "@/data/world-countries-highres-collection.json";
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

function normalizeCountryName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

const worldCountrySeeds = worldCountries as unknown as WorldCountrySeed[];
const highResFeatures = (worldCountriesHighRes as HighResFeatureCollection).features ?? [];

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

for (const feature of highResFeatures) {
  const properties = feature.properties ?? {};
  const iso3Raw =
    typeof properties["ISO3166-1-Alpha-3"] === "string"
      ? properties["ISO3166-1-Alpha-3"]
      : typeof properties.iso_a3 === "string"
        ? properties.iso_a3
        : typeof properties.ISO_A3 === "string"
          ? properties.ISO_A3
          : null;
  const iso3Candidate = iso3Raw ? iso3Raw.toUpperCase() : null;
  const iso3 =
    iso3Candidate && /^[A-Z]{3}$/.test(iso3Candidate) ? iso3Candidate : null;
  const nameRaw =
    typeof properties.name === "string"
      ? properties.name
      : typeof properties.NAME === "string"
        ? properties.NAME
        : "";
  const countryId =
    (iso3 ? countryIdByIso3.get(iso3) : undefined) ??
    (nameRaw ? countryIdByName.get(normalizeCountryName(nameRaw)) : undefined);

  if (countryId && !countryBoundaryFeatures[countryId]) {
    countryBoundaryFeatures[countryId] = feature;
  }
}

for (const country of worldCountrySeeds) {
  if (countryBoundaryFeatures[country.id]) {
    continue;
  }
  if (country.feature) {
    countryBoundaryFeatures[country.id] = country.feature;
  }
}
