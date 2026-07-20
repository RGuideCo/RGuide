import pg from "pg";
import type { Client } from "pg";
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";

import { getPgSslConfig } from "@/lib/database-ssl";
import { getContinents } from "@/lib/mock-data";
import { normalizeLocale, type AppLocale } from "@/lib/i18n/config";
import { getServerDatabaseUrl } from "@/lib/server-database-url";
import type {
  City,
  Continent,
  Country,
  CountryState,
  DestinationCategoryInsight,
  DestinationCategoryInsightChip,
  DestinationCategoryInsightNote,
  DestinationCategoryNeighborhoodStrength,
  ListCategory,
  SubArea,
} from "@/types";

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

interface DestinationImageRow {
  id: string;
  imageUrl: string;
  imageUpdatedAt: string | null;
}

interface DestinationCategoryInsightRow {
  id: string;
  category: ListCategory;
  label: string | null;
  summary: string | null;
  chips: unknown;
  notes: unknown;
}

interface DestinationCategoryNeighborhoodStrengthRow {
  parentId: string;
  neighborhoodId: string;
  neighborhoodName: string | null;
  category: ListCategory;
  fieldKey: string;
  score: number;
  rationale: string | null;
  sourceUrls: string[] | null;
}

interface DestinationDataApiImageRow {
  legacy_id: string | null;
  image_url: string | null;
  updated_at: string | null;
  metadata: {
    destination_image?: {
      ingested_at?: string;
    };
  } | null;
}

interface DestinationDataApiDescriptionRow {
  description: string;
  destination: { legacy_id: string | null } | { legacy_id: string | null }[] | null;
}

interface DestinationContentRows {
  descriptions: DestinationDescriptionRow[];
  cityAffiliateLinks: CityAffiliateLinkRow[];
  cityFoodCuisines: CityFoodCuisineRow[];
  destinationImages: DestinationImageRow[];
  categoryInsights: DestinationCategoryInsightRow[];
  neighborhoodStrengths: DestinationCategoryNeighborhoodStrengthRow[];
}

interface DestinationContentLoadOptions {
  forceDatabase?: boolean;
  locale?: AppLocale;
}

const DESTINATION_DESCRIPTIONS_CACHE_SECONDS = Number.parseInt(
  process.env.DESTINATION_DESCRIPTIONS_CACHE_SECONDS ?? "86400",
  10,
);
const DESTINATION_IMAGE_DATA_API_PAGE_SIZE = 1000;

function descriptionId(...parts: string[]) {
  return parts.filter(Boolean).join(":");
}

function destinationContentLookupIds(id: string) {
  const [scope, countryId, entityId, ...rest] = id.split(":");

  if (
    scope !== "city" ||
    !countryId ||
    !entityId ||
    rest.length > 0 ||
    !entityId.startsWith(`${countryId}-`)
  ) {
    return [id];
  }

  const cityId = entityId.slice(countryId.length + 1);
  return cityId ? [id, descriptionId("city", countryId, cityId)] : [id];
}

function mapDestinationContentRows<Row extends { id: string }, Value>(
  rows: Row[],
  valueForRow: (row: Row) => Value,
) {
  const values = new Map<string, Value>();

  for (const row of rows) {
    const value = valueForRow(row);
    for (const id of destinationContentLookupIds(row.id)) {
      values.set(id, value);
    }
  }

  return values;
}

function versionedImageUrl(imageUrl: string | undefined, imageUpdatedAt: string | null | undefined) {
  if (!imageUrl || !imageUpdatedAt || imageUrl.startsWith("/")) {
    return imageUrl;
  }

  const separator = imageUrl.includes("?") ? "&" : "?";
  const version = encodeURIComponent(imageUpdatedAt);
  return `${imageUrl}${separator}v=${version}`;
}

function emptyDestinationContentRows(): DestinationContentRows {
  return {
    descriptions: [],
    cityAffiliateLinks: [],
    cityFoodCuisines: [],
    destinationImages: [],
    categoryInsights: [],
    neighborhoodStrengths: [],
  };
}

function isListCategory(value: unknown): value is ListCategory {
  return (
    value === "Food" ||
    value === "Nightlife" ||
    value === "Nature" ||
    value === "Culture" ||
    value === "Stay" ||
    value === "Activities" ||
    value === "Routes" ||
    value === "Essentials"
  );
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeInsightChips(value: unknown): DestinationCategoryInsightChip[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!isPlainObject(item)) {
      return [];
    }

    const label = typeof item.label === "string" ? item.label.trim() : "";
    const filterValue = typeof item.filterValue === "string" ? item.filterValue.trim() : label;
    const filterKind = item.filterKind;

    if (!label || !filterValue) {
      return [];
    }

    return [
      {
        slug: typeof item.slug === "string" && item.slug.trim() ? item.slug.trim() : label.toLowerCase(),
        label,
        filterKind:
          filterKind === "subcategory" ||
          filterKind === "cuisine" ||
          filterKind === "attribute" ||
          filterKind === "freeform"
            ? filterKind
            : "subcategory",
        filterValue,
      },
    ];
  });
}

function normalizeInsightNotes(value: unknown): DestinationCategoryInsightNote[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!isPlainObject(item)) {
      return [];
    }

    const body = typeof item.body === "string" ? item.body.trim() : "";

    if (!body) {
      return [];
    }

    return [
      {
        key: typeof item.key === "string" && item.key.trim() ? item.key.trim() : undefined,
        label: typeof item.label === "string" && item.label.trim() ? item.label.trim() : undefined,
        body,
      },
    ];
  });
}

function normalizeCategoryInsightRow(row: DestinationCategoryInsightRow): DestinationCategoryInsight | null {
  if (!isListCategory(row.category)) {
    return null;
  }

  const notes = normalizeInsightNotes(row.notes);

  if (!notes.length) {
    return null;
  }

  return {
    category: row.category,
    label: row.label?.trim() || undefined,
    summary: row.summary?.trim() || undefined,
    chips: normalizeInsightChips(row.chips),
    notes,
  };
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

function getSupabaseDataApiConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    null;

  return url && key ? { url, key } : null;
}

function shouldSkipDatabaseConnection(options: DestinationContentLoadOptions = {}) {
  if (options.forceDatabase) {
    return false;
  }

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

async function loadDestinationContentRows(options: DestinationContentLoadOptions = {}): Promise<DestinationContentRows> {
  const locale = normalizeLocale(options.locale);
  if (shouldSkipDatabaseConnection(options)) {
    return loadDestinationContentRowsFromDataApi(locale);
  }

  const databaseUrl = getServerDatabaseUrl();

  if (!databaseUrl) {
    return loadDestinationContentRowsFromDataApi(locale);
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: getPgSslConfig(databaseUrl),
  });

  try {
    await client.connect();
    const descriptions = await loadNormalizedDestinationDescriptionRows(client, locale);
    const cityAffiliateLinks = await loadCityLeftPanelAffiliateLinkRows(client);
    const cityFoodCuisines = await loadCityFoodCuisineRows(client);
    const destinationImages = await loadDestinationImageRows(client);
    const categoryInsights = await loadDestinationCategoryInsightRows(client, locale);
    const neighborhoodStrengths = await loadDestinationCategoryNeighborhoodStrengthRows(client);

    return {
      descriptions,
      cityAffiliateLinks,
      cityFoodCuisines,
      destinationImages,
      categoryInsights,
      neighborhoodStrengths,
    };
  } catch (error) {
    console.error("Failed to load destination content", error);
    return loadDestinationContentRowsFromDataApi(locale);
  } finally {
    await client.end().catch(() => {});
  }
}

async function loadDestinationContentRowsFromDataApi(locale: AppLocale): Promise<DestinationContentRows> {
  const config = getSupabaseDataApiConfig();

  if (!config) {
    return emptyDestinationContentRows();
  }

  const supabase = createClient(config.url, config.key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const destinationImages: DestinationImageRow[] = [];
  let destinationImageOffset = 0;

  while (true) {
    const { data, error } = await supabase
      .from("destinations")
      .select("legacy_id,image_url,updated_at,metadata")
      .in("scope", ["city", "country"])
      .eq("is_published", true)
      .not("legacy_id", "is", null)
      .not("image_url", "is", null)
      .order("legacy_id", { ascending: true })
      .range(
        destinationImageOffset,
        destinationImageOffset + DESTINATION_IMAGE_DATA_API_PAGE_SIZE - 1,
      )
      .returns<DestinationDataApiImageRow[]>();

    if (error) {
      console.error("Failed to load destination images from the Supabase data API", error);
      break;
    }

    const page = data ?? [];
    destinationImages.push(
      ...page.flatMap((row) => {
        if (!row.legacy_id || !row.image_url) {
          return [];
        }

        return [
          {
            id: row.legacy_id,
            imageUrl: row.image_url,
            imageUpdatedAt: row.metadata?.destination_image?.ingested_at ?? row.updated_at,
          },
        ];
      }),
    );

    if (page.length < DESTINATION_IMAGE_DATA_API_PAGE_SIZE) {
      break;
    }

    destinationImageOffset += page.length;
  }

  const [{ data: descriptionData }, { data: insightData }, { data: strengthData }] = await Promise.all([
    supabase
      .from("destination_descriptions_v2")
      .select("description,destination:destinations!inner(legacy_id)")
      .eq("locale", locale)
      .eq("translation_status", "published")
      .eq("description_kind", "overview")
      .neq("description", "")
      .returns<DestinationDataApiDescriptionRow[]>(),
    supabase
      .from("active_destination_category_insights")
      .select("destination_legacy_id,category,label,summary,chips,notes")
      .eq("locale", locale)
      .not("destination_legacy_id", "is", null),
    supabase
      .from("active_destination_category_neighborhood_strengths")
      .select(
        "parent_destination_legacy_id,neighborhood_destination_legacy_id,neighborhood_destination_name,category,field_key,score,rationale,source_urls",
      )
      .not("parent_destination_legacy_id", "is", null)
      .not("neighborhood_destination_legacy_id", "is", null),
  ]);

  const descriptions: DestinationDescriptionRow[] = (descriptionData ?? []).flatMap((row) => {
    const destination = Array.isArray(row.destination) ? row.destination[0] : row.destination;
    return destination?.legacy_id ? [{ id: destination.legacy_id, description: row.description }] : [];
  });

  const categoryInsights: DestinationCategoryInsightRow[] = (insightData ?? []).flatMap((row) => {
    const id = typeof row.destination_legacy_id === "string" ? row.destination_legacy_id : "";
    const category = row.category;

    if (!id || !isListCategory(category)) {
      return [];
    }

    return [
      {
        id,
        category,
        label: typeof row.label === "string" ? row.label : null,
        summary: typeof row.summary === "string" ? row.summary : null,
        chips: row.chips,
        notes: row.notes,
      },
    ];
  });

  const neighborhoodStrengths: DestinationCategoryNeighborhoodStrengthRow[] = (strengthData ?? []).flatMap((row) => {
    const parentId = typeof row.parent_destination_legacy_id === "string" ? row.parent_destination_legacy_id : "";
    const neighborhoodId =
      typeof row.neighborhood_destination_legacy_id === "string" ? row.neighborhood_destination_legacy_id : "";
    const category = row.category;
    const score = typeof row.score === "number" ? row.score : Number(row.score);

    if (!parentId || !neighborhoodId || !isListCategory(category) || !Number.isFinite(score)) {
      return [];
    }

    return [
      {
        parentId,
        neighborhoodId,
        neighborhoodName:
          typeof row.neighborhood_destination_name === "string" ? row.neighborhood_destination_name : null,
        category,
        fieldKey: typeof row.field_key === "string" ? row.field_key : "default",
        score,
        rationale: typeof row.rationale === "string" ? row.rationale : null,
        sourceUrls: Array.isArray(row.source_urls) ? row.source_urls.filter((url): url is string => typeof url === "string") : null,
      },
    ];
  });

  return {
    descriptions,
    cityAffiliateLinks: [],
    cityFoodCuisines: [],
    destinationImages,
    categoryInsights,
    neighborhoodStrengths,
  };
}

async function loadNormalizedDestinationDescriptionRows(client: Client, locale: AppLocale) {
  try {
    const { rows } = await client.query<DestinationDescriptionRow>(
      [
        "select destination.legacy_id as id, description.description",
        "from public.destination_descriptions_v2 description",
        "join public.destinations destination on destination.id = description.destination_id",
        "where description.description <> ''",
        "  and destination.legacy_id is not null",
        "  and description.locale = $1",
        "  and description.translation_status = 'published'",
        "  and description.description_kind = 'overview'",
      ].join(" "),
      [locale],
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

async function loadDestinationImageRows(client: Client) {
  try {
    const { rows } = await client.query<DestinationImageRow>(
      [
        "select destination.legacy_id as id,",
        "       destination.image_url as \"imageUrl\",",
        "       coalesce(destination.metadata #>> '{destination_image,ingested_at}', destination.updated_at::text) as \"imageUpdatedAt\"",
        "from public.destinations destination",
        "where destination.scope in ('city'::public.destination_scope, 'country'::public.destination_scope)",
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

async function loadDestinationCategoryInsightRows(client: Client, locale: AppLocale) {
  try {
    const { rows } = await client.query<DestinationCategoryInsightRow>(
      [
        "select destination_legacy_id as id,",
        "       category,",
        "       label,",
        "       summary,",
        "       chips,",
        "       notes",
        "from public.active_destination_category_insights",
        "where locale = $1",
        "  and destination_legacy_id is not null",
        "order by destination_legacy_id, sort_order, category",
      ].join(" "),
      [locale],
    );
    return rows;
  } catch {
    return [];
  }
}

async function loadDestinationCategoryNeighborhoodStrengthRows(client: Client) {
  try {
    const { rows } = await client.query<DestinationCategoryNeighborhoodStrengthRow>(
      [
        "select parent_destination_legacy_id as \"parentId\",",
        "       neighborhood_destination_legacy_id as \"neighborhoodId\",",
        "       neighborhood_destination_name as \"neighborhoodName\",",
        "       category,",
        "       field_key as \"fieldKey\",",
        "       score::float8 as score,",
        "       rationale,",
        "       source_urls as \"sourceUrls\"",
        "from public.active_destination_category_neighborhood_strengths",
        "where parent_destination_legacy_id is not null",
        "  and neighborhood_destination_legacy_id is not null",
        "order by parent_destination_legacy_id, category, field_key, score desc",
      ].join(" "),
    );
    return rows;
  } catch {
    return [];
  }
}

const getCachedDestinationContentRows = unstable_cache(
  async (locale: AppLocale) => {
    return loadDestinationContentRows({ locale });
  },
  ["destination-content-rows", "city-images-v3-paginated"],
  {
    revalidate: Number.isFinite(DESTINATION_DESCRIPTIONS_CACHE_SECONDS)
      ? DESTINATION_DESCRIPTIONS_CACHE_SECONDS
      : 86400,
    tags: ["destination-descriptions"],
  },
);

const getCachedRuntimeDestinationContentRows = unstable_cache(
  async (locale: AppLocale) => {
    return loadDestinationContentRows({ forceDatabase: true, locale });
  },
  ["destination-content-rows", "city-images-runtime-v2-paginated"],
  {
    revalidate: Number.isFinite(DESTINATION_DESCRIPTIONS_CACHE_SECONDS)
      ? DESTINATION_DESCRIPTIONS_CACHE_SECONDS
      : 86400,
    tags: ["destination-descriptions"],
  },
);

function cloneSubareasWithDescriptions(
  subareas: SubArea[] | undefined,
  descriptions: Map<string, string>,
  categoryInsights: Map<string, DestinationCategoryInsight[]>,
  neighborhoodStrengths: Map<string, DestinationCategoryNeighborhoodStrength[]>,
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
      categoryInsights: categoryInsights.get(id) ?? subarea.categoryInsights,
      categoryNeighborhoodStrengths: neighborhoodStrengths.get(id) ?? subarea.categoryNeighborhoodStrengths,
      subareas: cloneSubareasWithDescriptions(
        subarea.subareas,
        descriptions,
        categoryInsights,
        neighborhoodStrengths,
        {
          ...context,
          parentId: subarea.id,
        },
      ),
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
  destinationImages: Map<string, DestinationImageRow>,
  categoryInsights: Map<string, DestinationCategoryInsight[]>,
  neighborhoodStrengths: Map<string, DestinationCategoryNeighborhoodStrength[]>,
) {
  const cityDescriptionId = descriptionId("city", countryId, city.id);
  const affiliateLink = cityAffiliateLinks.get(cityDescriptionId);
  const foodCuisines = cityFoodCuisines.get(cityDescriptionId)?.cuisines.filter(Boolean);
  const cityImage = destinationImages.get(cityDescriptionId);
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
    categoryInsights: categoryInsights.get(cityDescriptionId) ?? city.categoryInsights,
    categoryNeighborhoodStrengths: neighborhoodStrengths.get(cityDescriptionId) ?? city.categoryNeighborhoodStrengths,
    subareas: cloneSubareasWithDescriptions(
      city.subareas,
      descriptions,
      categoryInsights,
      neighborhoodStrengths,
      {
        type: "neighborhood",
        parentId: city.id,
        countryId,
        cityId: city.id,
      },
    ),
  };
}

function cloneCountryWithDescription(
  country: Country,
  descriptions: Map<string, string>,
  cityAffiliateLinks: Map<string, CityAffiliateLinkRow>,
  cityFoodCuisines: Map<string, CityFoodCuisineRow>,
  destinationImages: Map<string, DestinationImageRow>,
  categoryInsights: Map<string, DestinationCategoryInsight[]>,
  neighborhoodStrengths: Map<string, DestinationCategoryNeighborhoodStrength[]>,
) {
  const countryImage = destinationImages.get(descriptionId("country", country.id));
  const imageUrl = versionedImageUrl(countryImage?.imageUrl, countryImage?.imageUpdatedAt);

  return {
    ...country,
    description: descriptions.get(descriptionId("country", country.id)) ?? country.description,
    image: imageUrl ?? country.image,
    subareas: cloneSubareasWithDescriptions(
      country.subareas,
      descriptions,
      categoryInsights,
      neighborhoodStrengths,
      {
        type: "region",
        parentId: country.id,
        countryId: country.id,
      },
    ),
    states: country.states?.map((state) => cloneStateWithDescription(country.id, state, descriptions)),
    cities: country.cities.map((city) =>
      cloneCityWithDescription(
        country.id,
        city,
        descriptions,
        cityAffiliateLinks,
        cityFoodCuisines,
        destinationImages,
        categoryInsights,
        neighborhoodStrengths,
      ),
    ),
  };
}

export function applyDestinationDescriptions(
  continents: Continent[],
  rows: DestinationDescriptionRow[],
  cityAffiliateRows: CityAffiliateLinkRow[] = [],
  cityFoodCuisineRows: CityFoodCuisineRow[] = [],
  destinationImageRows: DestinationImageRow[] = [],
  categoryInsightRows: DestinationCategoryInsightRow[] = [],
  neighborhoodStrengthRows: DestinationCategoryNeighborhoodStrengthRow[] = [],
) {
  const descriptions = mapDestinationContentRows(rows, (row) => row.description.trim());
  const cityAffiliateLinks = mapDestinationContentRows(cityAffiliateRows, (row) => row);
  const cityFoodCuisines = mapDestinationContentRows(cityFoodCuisineRows, (row) => row);
  const destinationImages = mapDestinationContentRows(destinationImageRows, (row) => row);
  const categoryInsights = new Map<string, DestinationCategoryInsight[]>();
  const neighborhoodStrengths = new Map<string, DestinationCategoryNeighborhoodStrength[]>();

  for (const row of categoryInsightRows) {
    const insight = normalizeCategoryInsightRow(row);

    if (!insight) {
      continue;
    }

    for (const id of destinationContentLookupIds(row.id)) {
      categoryInsights.set(id, [...(categoryInsights.get(id) ?? []), insight]);
    }
  }

  for (const row of neighborhoodStrengthRows) {
    if (!isListCategory(row.category) || !Number.isFinite(row.score)) {
      continue;
    }

    for (const parentId of destinationContentLookupIds(row.parentId)) {
      neighborhoodStrengths.set(parentId, [
        ...(neighborhoodStrengths.get(parentId) ?? []),
        {
          neighborhoodId: row.neighborhoodId,
          neighborhoodName: row.neighborhoodName ?? undefined,
          category: row.category,
          fieldKey: row.fieldKey,
          score: row.score,
          rationale: row.rationale ?? undefined,
          sourceUrls: row.sourceUrls ?? undefined,
        },
      ]);
    }
  }

  return continents.map((continent) => ({
    ...continent,
    countries: continent.countries.map((country) =>
      cloneCountryWithDescription(
        country,
        descriptions,
        cityAffiliateLinks,
        cityFoodCuisines,
        destinationImages,
        categoryInsights,
        neighborhoodStrengths,
      ),
    ),
  }));
}

export async function getContinentsWithDestinationDescriptions(options: DestinationContentLoadOptions = {}) {
  const locale = normalizeLocale(options.locale);
  const continents = getContinents();
  const loadRows =
    process.env.NODE_ENV === "development"
      ? () => loadDestinationContentRows({ ...options, locale })
      : options.forceDatabase
      ? () => getCachedRuntimeDestinationContentRows(locale)
      : () => getCachedDestinationContentRows(locale);
  const rows = await loadRows().catch((error) => {
    console.error("Failed to load cached destination content", error);
    return emptyDestinationContentRows();
  });
  return applyDestinationDescriptions(
    continents,
    rows.descriptions,
    rows.cityAffiliateLinks,
    rows.cityFoodCuisines,
    rows.destinationImages,
    rows.categoryInsights,
    rows.neighborhoodStrengths,
  );
}
