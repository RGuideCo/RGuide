import pg from "pg";
import { unstable_cache } from "next/cache";

import { getContinents } from "@/lib/mock-data";
import type { City, Continent, Country, CountryState, SubArea } from "@/types";

export type DestinationDescriptionEntityType =
  | "continent"
  | "country"
  | "region"
  | "state"
  | "city"
  | "neighborhood";

export interface DestinationDescriptionSeed {
  id: string;
  entityType: DestinationDescriptionEntityType;
  entityId: string;
  parentEntityId?: string;
  continent?: string;
  country?: string;
  city?: string;
  name: string;
  description: string;
}

interface DestinationDescriptionRow {
  id: string;
  description: string;
}

const DESTINATION_DESCRIPTIONS_CACHE_SECONDS = Number.parseInt(
  process.env.DESTINATION_DESCRIPTIONS_CACHE_SECONDS ?? "900",
  10,
);

function descriptionId(...parts: string[]) {
  return parts.filter(Boolean).join(":");
}

function collectSubareaDescriptions(
  subareas: SubArea[] | undefined,
  context: {
    type: "region" | "neighborhood";
    parentId: string;
    continent?: string;
    country?: string;
    city?: string;
  },
): DestinationDescriptionSeed[] {
  return (subareas ?? []).flatMap((subarea) => {
    const id =
      context.type === "neighborhood"
        ? descriptionId("neighborhood", context.country ?? "", context.city ?? "", context.parentId, subarea.id)
        : descriptionId("region", context.country ?? "", context.parentId, subarea.id);
    const current: DestinationDescriptionSeed[] = subarea.description?.trim()
      ? [
          {
            id,
            entityType: context.type,
            entityId: subarea.id,
            parentEntityId: context.parentId,
            continent: context.continent,
            country: context.country,
            city: context.city,
            name: subarea.name,
            description: subarea.description.trim(),
          },
        ]
      : [];
    return [
      ...current,
      ...collectSubareaDescriptions(subarea.subareas, {
        ...context,
        parentId: subarea.id,
      }),
    ];
  });
}

export function collectDestinationDescriptions(continents: Continent[]): DestinationDescriptionSeed[] {
  return continents.flatMap((continent) =>
    continent.countries.flatMap((country) => [
      {
        id: descriptionId("country", country.id),
        entityType: "country" as const,
        entityId: country.id,
        parentEntityId: continent.id,
        continent: continent.name,
        country: country.name,
        name: country.name,
        description: country.description,
      },
      ...collectSubareaDescriptions(country.subareas, {
        type: "region",
        parentId: country.id,
        continent: continent.name,
        country: country.name,
      }),
      ...(country.states ?? []).map((state) => ({
        id: descriptionId("state", country.id, state.id),
        entityType: "state" as const,
        entityId: state.id,
        parentEntityId: state.countrySubareaId,
        continent: continent.name,
        country: country.name,
        name: state.name,
        description: state.description ?? "",
      })),
      ...country.cities.flatMap((city) => [
        {
          id: descriptionId("city", country.id, city.id),
          entityType: "city" as const,
          entityId: city.id,
          parentEntityId: city.stateId ?? city.countrySubareaId ?? country.id,
          continent: continent.name,
          country: country.name,
          city: city.name,
          name: city.name,
          description: city.description,
        },
        ...collectSubareaDescriptions(city.subareas, {
          type: "neighborhood",
          parentId: city.id,
          continent: continent.name,
          country: country.name,
          city: city.name,
        }),
      ]),
    ]),
  );
}

function getDatabaseUrl() {
  return (
    process.env.SUPABASE_DB_URL ??
    process.env.SUPABASE_DATABASE_URL ??
    process.env.DATABASE_URL ??
    null
  );
}

async function loadDestinationDescriptionRows(): Promise<DestinationDescriptionRow[]> {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    return [];
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl:
      databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
        ? false
        : { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    const { rows } = await client.query<DestinationDescriptionRow>(
      "select id, description from public.destination_descriptions where description <> ''",
    );
    return rows;
  } catch (error) {
    console.error("Failed to load destination descriptions", error);
    return [];
  } finally {
    await client.end().catch(() => {});
  }
}

const getCachedDestinationDescriptionRows = unstable_cache(
  loadDestinationDescriptionRows,
  ["destination-description-rows"],
  {
    revalidate: Number.isFinite(DESTINATION_DESCRIPTIONS_CACHE_SECONDS)
      ? DESTINATION_DESCRIPTIONS_CACHE_SECONDS
      : 900,
    tags: ["destination-descriptions"],
  },
);

function cloneSubareasWithDescriptions(
  subareas: SubArea[] | undefined,
  descriptions: Map<string, string>,
  context: {
    type: "region" | "neighborhood";
    parentId: string;
    countryId?: string;
    cityId?: string;
  },
): SubArea[] | undefined {
  return subareas?.map((subarea) => {
    const id =
      context.type === "neighborhood"
        ? descriptionId("neighborhood", context.countryId ?? "", context.cityId ?? "", context.parentId, subarea.id)
        : descriptionId("region", context.countryId ?? "", context.parentId, subarea.id);

    return {
      ...subarea,
      description: descriptions.get(id) ?? subarea.description,
      subareas: cloneSubareasWithDescriptions(subarea.subareas, descriptions, {
        ...context,
        parentId: subarea.id,
      }),
    };
  });
}

function cloneStateWithDescription(countryId: string, state: CountryState, descriptions: Map<string, string>) {
  return {
    ...state,
    description: descriptions.get(descriptionId("state", countryId, state.id)) ?? state.description,
  };
}

function cloneCityWithDescription(countryId: string, city: City, descriptions: Map<string, string>) {
  return {
    ...city,
    description: descriptions.get(descriptionId("city", countryId, city.id)) ?? city.description,
    subareas: cloneSubareasWithDescriptions(city.subareas, descriptions, {
      type: "neighborhood",
      parentId: city.id,
      countryId,
      cityId: city.id,
    }),
  };
}

function cloneCountryWithDescription(country: Country, descriptions: Map<string, string>) {
  return {
    ...country,
    description: descriptions.get(descriptionId("country", country.id)) ?? country.description,
    subareas: cloneSubareasWithDescriptions(country.subareas, descriptions, {
      type: "region",
      parentId: country.id,
      countryId: country.id,
    }),
    states: country.states?.map((state) => cloneStateWithDescription(country.id, state, descriptions)),
    cities: country.cities.map((city) => cloneCityWithDescription(country.id, city, descriptions)),
  };
}

export function applyDestinationDescriptions(continents: Continent[], rows: DestinationDescriptionRow[]) {
  if (!rows.length) {
    return continents;
  }

  const descriptions = new Map(rows.map((row) => [row.id, row.description.trim()]));

  return continents.map((continent) => ({
    ...continent,
    countries: continent.countries.map((country) => cloneCountryWithDescription(country, descriptions)),
  }));
}

export async function getContinentsWithDestinationDescriptions() {
  const continents = getContinents();
  const rows = await getCachedDestinationDescriptionRows();
  return applyDestinationDescriptions(continents, rows);
}
