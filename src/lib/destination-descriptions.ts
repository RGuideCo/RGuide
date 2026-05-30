import pg from "pg";
import type { Client } from "pg";
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

interface CityAffiliateLinkRow {
  id: string;
  cityLeftPanelStayUrl: string;
}

interface CityFoodCuisineRow {
  id: string;
  cuisines: string[];
}

interface CityImageRow {
  id: string;
  imageUrl: string;
  imageUpdatedAt: string | null;
}

interface DestinationContentRows {
  descriptions: DestinationDescriptionRow[];
  cityAffiliateLinks: CityAffiliateLinkRow[];
  cityFoodCuisines: CityFoodCuisineRow[];
  cityImages: CityImageRow[];
}

const DESTINATION_DESCRIPTIONS_CACHE_SECONDS = Number.parseInt(
  process.env.DESTINATION_DESCRIPTIONS_CACHE_SECONDS ?? "900",
  10,
);

function descriptionId(...parts: string[]) {
  return parts.filter(Boolean).join(":");
}

function versionedImageUrl(imageUrl: string | undefined, imageUpdatedAt: string | null | undefined) {
  if (!imageUrl || !imageUpdatedAt || imageUrl.startsWith("/")) {
    return imageUrl;
  }

  const separator = imageUrl.includes("?") ? "&" : "?";
  const version = encodeURIComponent(imageUpdatedAt);
  return `${imageUrl}${separator}v=${version}`;
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

function shouldSkipDatabaseConnection() {
  if (process.env.RGUIDE_ALLOW_BUILD_DB === "1") {
    return false;
  }

  if (process.env.RGUIDE_SKIP_DATABASE === "1") {
    return true;
  }

  const isProductionBuild =
    process.env.NEXT_PHASE === "phase-production-build" || process.env.npm_lifecycle_event === "build";

  return isProductionBuild;
}

async function loadDestinationContentRows(): Promise<DestinationContentRows> {
  if (shouldSkipDatabaseConnection()) {
    return { descriptions: [], cityAffiliateLinks: [], cityFoodCuisines: [], cityImages: [] };
  }

  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    return { descriptions: [], cityAffiliateLinks: [], cityFoodCuisines: [], cityImages: [] };
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
    const [descriptions, cityAffiliateLinks, cityFoodCuisines, cityImages] = await Promise.all([
      loadNormalizedDestinationDescriptionRows(client),
      loadCityLeftPanelAffiliateLinkRows(client),
      loadCityFoodCuisineRows(client),
      loadCityImageRows(client),
    ]);

    return { descriptions, cityAffiliateLinks, cityFoodCuisines, cityImages };
  } catch (error) {
    console.error("Failed to load destination content", error);
    return { descriptions: [], cityAffiliateLinks: [], cityFoodCuisines: [], cityImages: [] };
  } finally {
    await client.end().catch(() => {});
  }
}

async function loadNormalizedDestinationDescriptionRows(client: Client) {
  try {
    const { rows } = await client.query<DestinationDescriptionRow>(
      [
        "select destination.legacy_id as id, description.description",
        "from public.destination_descriptions_v2 description",
        "join public.destinations destination on destination.id = description.destination_id",
        "where description.description <> ''",
        "  and destination.legacy_id is not null",
        "  and description.locale = 'en'",
        "  and description.description_kind = 'overview'",
      ].join(" "),
    );
    return rows;
  } catch {
    return [];
  }
}

async function loadCityLeftPanelAffiliateLinkRows(client: Client) {
  try {
    const { rows } = await client.query<CityAffiliateLinkRow>(
      [
        "select destination.legacy_id as id, affiliate.url as \"cityLeftPanelStayUrl\"",
        "from public.affiliate_links affiliate",
        "join public.destinations destination on destination.id = affiliate.entity_id",
        "where affiliate.entity_type = 'destination'::public.rguide_affiliate_entity_type",
        "  and affiliate.placement = 'city_left_panel'::public.rguide_affiliate_placement",
        "  and affiliate.provider = 'stay22'::public.rguide_affiliate_provider",
        "  and affiliate.is_active = true",
        "  and (affiliate.valid_from is null or affiliate.valid_from <= now())",
        "  and (affiliate.valid_until is null or affiliate.valid_until > now())",
        "  and destination.scope = 'city'::public.destination_scope",
        "  and destination.legacy_id is not null",
        "order by affiliate.priority asc, affiliate.updated_at desc",
      ].join(" "),
    );
    return rows;
  } catch {
    return [];
  }
}

async function loadCityFoodCuisineRows(client: Client) {
  try {
    const { rows } = await client.query<CityFoodCuisineRow>(
      [
        "select destination.legacy_id as id, array_agg(cuisine.label order by cuisine.sort_order, cuisine.label) as cuisines",
        "from public.destination_food_cuisines cuisine",
        "join public.destinations destination on destination.id = cuisine.destination_id",
        "where cuisine.is_active = true",
        "  and cuisine.is_featured = true",
        "  and destination.scope = 'city'::public.destination_scope",
        "  and destination.legacy_id is not null",
        "  and destination.is_published = true",
        "group by destination.legacy_id",
      ].join(" "),
    );
    return rows;
  } catch {
    return [];
  }
}

async function loadCityImageRows(client: Client) {
  try {
    const { rows } = await client.query<CityImageRow>(
      [
        "select destination.legacy_id as id,",
        "       destination.image_url as \"imageUrl\",",
        "       coalesce(destination.metadata #>> '{destination_image,ingested_at}', destination.updated_at::text) as \"imageUpdatedAt\"",
        "from public.destinations destination",
        "where destination.scope = 'city'::public.destination_scope",
        "  and destination.legacy_id is not null",
        "  and nullif(destination.image_url, '') is not null",
        "  and destination.is_published = true",
      ].join(" "),
    );
    return rows;
  } catch {
    return [];
  }
}

const getCachedDestinationContentRows = unstable_cache(
  async () => {
    return loadDestinationContentRows();
  },
  ["destination-content-rows", "city-images-v2"],
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

function cloneCityWithDescription(
  countryId: string,
  city: City,
  descriptions: Map<string, string>,
  cityAffiliateLinks: Map<string, CityAffiliateLinkRow>,
  cityFoodCuisines: Map<string, CityFoodCuisineRow>,
  cityImages: Map<string, CityImageRow>,
) {
  const cityDescriptionId = descriptionId("city", countryId, city.id);
  const affiliateLink = cityAffiliateLinks.get(cityDescriptionId);
  const foodCuisines = cityFoodCuisines.get(cityDescriptionId)?.cuisines.filter(Boolean);
  const cityImage = cityImages.get(cityDescriptionId);
  const imageUrl = versionedImageUrl(cityImage?.imageUrl, cityImage?.imageUpdatedAt);
  const cityLeftPanelStayUrl = affiliateLink?.cityLeftPanelStayUrl;

  return {
    ...city,
    description: descriptions.get(cityDescriptionId) ?? city.description,
    image: imageUrl ?? city.image,
    affiliateLinks: cityLeftPanelStayUrl
      ? {
          ...city.affiliateLinks,
          cityLeftPanelStayUrl,
        }
      : city.affiliateLinks,
    popularFoodCuisines: foodCuisines?.length ? foodCuisines : city.popularFoodCuisines,
    subareas: cloneSubareasWithDescriptions(city.subareas, descriptions, {
      type: "neighborhood",
      parentId: city.id,
      countryId,
      cityId: city.id,
    }),
  };
}

function cloneCountryWithDescription(
  country: Country,
  descriptions: Map<string, string>,
  cityAffiliateLinks: Map<string, CityAffiliateLinkRow>,
  cityFoodCuisines: Map<string, CityFoodCuisineRow>,
  cityImages: Map<string, CityImageRow>,
) {
  return {
    ...country,
    description: descriptions.get(descriptionId("country", country.id)) ?? country.description,
    subareas: cloneSubareasWithDescriptions(country.subareas, descriptions, {
      type: "region",
      parentId: country.id,
      countryId: country.id,
    }),
    states: country.states?.map((state) => cloneStateWithDescription(country.id, state, descriptions)),
    cities: country.cities.map((city) =>
      cloneCityWithDescription(country.id, city, descriptions, cityAffiliateLinks, cityFoodCuisines, cityImages),
    ),
  };
}

export function applyDestinationDescriptions(
  continents: Continent[],
  rows: DestinationDescriptionRow[],
  cityAffiliateRows: CityAffiliateLinkRow[] = [],
  cityFoodCuisineRows: CityFoodCuisineRow[] = [],
  cityImageRows: CityImageRow[] = [],
) {
  const descriptions = new Map(rows.map((row) => [row.id, row.description.trim()]));
  const cityAffiliateLinks = new Map(cityAffiliateRows.map((row) => [row.id, row]));
  const cityFoodCuisines = new Map(cityFoodCuisineRows.map((row) => [row.id, row]));
  const cityImages = new Map(cityImageRows.map((row) => [row.id, row]));

  return continents.map((continent) => ({
    ...continent,
    countries: continent.countries.map((country) =>
      cloneCountryWithDescription(country, descriptions, cityAffiliateLinks, cityFoodCuisines, cityImages),
    ),
  }));
}

export async function getContinentsWithDestinationDescriptions() {
  const continents = getContinents();
  const loadRows =
    process.env.NODE_ENV === "development"
      ? loadDestinationContentRows
      : getCachedDestinationContentRows;
  const rows = await loadRows().catch((error) => {
    console.error("Failed to load cached destination content", error);
    return { descriptions: [], cityAffiliateLinks: [], cityFoodCuisines: [], cityImages: [] };
  });
  return applyDestinationDescriptions(
    continents,
    rows.descriptions,
    rows.cityAffiliateLinks,
    rows.cityFoodCuisines,
    rows.cityImages,
  );
}
