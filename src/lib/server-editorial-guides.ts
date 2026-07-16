import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import pg from "pg";
import type { Client } from "pg";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { mapLists } from "@/data/lists";
import { weeklyCityEventRuns, weeklyEventToGuideList } from "@/data/weekly-events";
import type { MapList } from "@/types";

interface WeeklyEventGuideRow {
  guide: MapList;
}

interface NormalizedGuideRow {
  list: MapList;
  updated_at: string | null;
}

interface RenderCacheRow {
  rendered_payload: MapList;
  updated_at: string | null;
}

interface DataApiGuideRow {
  list: MapList;
  updated_at: string | null;
}

interface DataApiRenderCacheRow {
  rendered_payload: MapList;
  updated_at: string | null;
}

interface DataApiWeeklyEventGuideRow {
  guide: MapList;
}

interface EditorialGuideScope {
  cityName?: string;
  countryName?: string;
  continentName?: string;
  bypassCache?: boolean;
}

function getLocalWeeklyEventGuides() {
  return weeklyCityEventRuns.flatMap((run) =>
    run.events.map((event) => weeklyEventToGuideList(event, run)),
  );
}

function getEndOfDateTimestamp(dateKey: string) {
  return Date.parse(`${dateKey}T23:59:59.999Z`);
}

function getEventGuideEndTimestamp(guide: MapList) {
  if (guide.eventEndsAt) {
    return Date.parse(guide.eventEndsAt);
  }
  if (guide.eventStartsAt) {
    return Date.parse(guide.eventStartsAt);
  }
  if (guide.itinerary?.endDate) {
    return getEndOfDateTimestamp(guide.itinerary.endDate);
  }
  if (guide.itinerary?.startDate) {
    return getEndOfDateTimestamp(guide.itinerary.startDate);
  }

  const itineraryDates = guide.stops
    .map((stop) => stop.itineraryDate)
    .filter((date): date is string => Boolean(date));

  if (itineraryDates.length) {
    return Math.max(...itineraryDates.map(getEndOfDateTimestamp));
  }

  return null;
}

function isCurrentOrUpcomingEventGuide(guide: MapList, now = new Date()) {
  if (!guide.id.startsWith("event-")) {
    return true;
  }

  const endTimestamp = getEventGuideEndTimestamp(guide);
  return endTimestamp === null || endTimestamp >= now.getTime();
}

function filterCurrentEventGuides(guides: MapList[]) {
  return guides.filter((guide) => isCurrentOrUpcomingEventGuide(guide));
}

function filterGuidesByScope(guides: MapList[], scope: EditorialGuideScope = {}) {
  if (scope.cityName) {
    return guides.filter((guide) => guide.location.city === scope.cityName);
  }
  if (scope.countryName) {
    return guides.filter((guide) => guide.location.country === scope.countryName);
  }
  if (scope.continentName) {
    return guides.filter((guide) => guide.location.continent === scope.continentName);
  }

  return guides;
}

function getDatabaseScopeFilter(
  scope: EditorialGuideScope,
  cityExpression: string,
  countryExpression: string,
  continentExpression: string,
) {
  if (scope.cityName) {
    return { clause: `and ${cityExpression} = $1`, values: [scope.cityName] };
  }
  if (scope.countryName) {
    return { clause: `and ${countryExpression} = $1`, values: [scope.countryName] };
  }
  if (scope.continentName) {
    return { clause: `and ${continentExpression} = $1`, values: [scope.continentName] };
  }

  return { clause: "", values: [] as string[] };
}

function normalizeWeeklyEventGuide(guide: MapList): MapList {
  if (!guide.id.startsWith("event-")) {
    return guide;
  }

  return {
    ...guide,
    submissionType: "event",
  };
}

function attachGuideUpdatedAt(guide: MapList, updatedAt?: string | null): MapList {
  const normalizedGuide = normalizeWeeklyEventGuide(guide);

  return updatedAt
    ? {
        ...normalizedGuide,
        updatedAt,
      }
    : normalizedGuide;
}

const EDITORIAL_GUIDES_CACHE_SECONDS = Number.parseInt(
  process.env.EDITORIAL_GUIDES_CACHE_SECONDS ?? "86400",
  10,
);

function getDatabaseUrl() {
  return (
    process.env.SUPABASE_DB_URL ??
    process.env.SUPABASE_DATABASE_URL ??
    process.env.DATABASE_URL ??
    null
  );
}

function getSupabaseDataApiConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    null;

  return url && key ? { url, key } : null;
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

function getPgSslConfig(databaseUrl: string) {
  return databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
    ? false
    : { rejectUnauthorized: false };
}

async function loadEditorialGuidesFromSupabase(scope: EditorialGuideScope = {}): Promise<MapList[] | null> {
  if (shouldSkipDatabaseConnection()) {
    return loadEditorialGuidesFromDataApi(scope);
  }

  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    return loadEditorialGuidesFromDataApi(scope);
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: getPgSslConfig(databaseUrl),
  });

  try {
    await client.connect();
    if (process.env.RGUIDE_FORCE_RENDER_CACHE === "1") {
      return loadRenderCacheGuides(client, scope);
    }

    const normalizedGuides = await loadNormalizedGuides(client, scope);

    if (normalizedGuides) {
      return normalizedGuides;
    }

    return loadRenderCacheGuides(client, scope);
  } catch (error) {
    console.error("Failed to load server editorial guides", error);
    return loadEditorialGuidesFromDataApi(scope);
  } finally {
    await client.end().catch(() => {});
  }
}

async function getCityIdFromDataApi(supabase: SupabaseClient, cityName?: string) {
  if (!cityName) {
    return null;
  }

  const { data, error } = await supabase
    .from("destinations")
    .select("id")
    .eq("scope", "city")
    .eq("name", cityName)
    .maybeSingle<{ id: string }>();

  if (error) {
    return null;
  }

  return data?.id ?? null;
}

async function loadEditorialGuidesFromDataApi(scope: EditorialGuideScope = {}): Promise<MapList[] | null> {
  const config = getSupabaseDataApiConfig();

  if (!config) {
    return null;
  }

  const supabase = createClient(config.url, config.key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  if (process.env.RGUIDE_FORCE_RENDER_CACHE === "1") {
    return loadRenderCacheGuidesFromDataApi(supabase, scope);
  }

  const cityId = await getCityIdFromDataApi(supabase, scope.cityName);
  let query = supabase
    .from("entries_maplist")
    .select("list,updated_at");

  if (scope.cityName) {
    if (!cityId) {
      return null;
    }
    query = query.eq("city_id", cityId);
  } else if (scope.countryName) {
    query = query.eq("list->location->>country", scope.countryName);
  } else if (scope.continentName) {
    query = query.eq("list->location->>continent", scope.continentName);
  }

  const { data, error } = await query.returns<DataApiGuideRow[]>();

  if (!error && data?.length) {
    return filterCurrentEventGuides([
      ...data.map((row) => attachGuideUpdatedAt(row.list, row.updated_at)),
      ...(await loadWeeklyEventsFromDataApi(supabase, scope)),
    ]);
  }

  return loadRenderCacheGuidesFromDataApi(supabase, scope);
}

async function loadWeeklyEventsFromDataApi(
  supabase: SupabaseClient,
  scope: EditorialGuideScope = {},
): Promise<MapList[]> {
  const cityId = await getCityIdFromDataApi(supabase, scope.cityName);
  const nowIso = new Date().toISOString();
  const currentEventFilter = `ends_at.gte.${nowIso},and(ends_at.is.null,starts_at.gte.${nowIso})`;
  let normalizedQuery = supabase
    .from("weekly_events_maplist")
    .select("guide")
    .gte("sourced_at", new Date(Date.now() - 14 * 86400000).toISOString())
    .or(currentEventFilter);

  if (scope.cityName) {
    if (!cityId) {
      return [];
    }
    normalizedQuery = normalizedQuery.eq("city_id", cityId);
  } else if (scope.countryName) {
    normalizedQuery = normalizedQuery.eq("guide->location->>country", scope.countryName);
  } else if (scope.continentName) {
    normalizedQuery = normalizedQuery.eq("guide->location->>continent", scope.continentName);
  }

  const normalized = await normalizedQuery
    .order("starts_at", { ascending: true })
    .returns<DataApiWeeklyEventGuideRow[]>();

  if (!normalized.error && normalized.data?.length) {
    return filterCurrentEventGuides(normalized.data.map((row) => normalizeWeeklyEventGuide(row.guide)));
  }

  let publicationQuery = supabase
    .from("weekly_event_publications")
    .select("guide:rendered_map_list")
    .gte("sourced_at", new Date(Date.now() - 14 * 86400000).toISOString())
    .or(currentEventFilter);

  if (scope.cityName) {
    publicationQuery = publicationQuery.eq("city_id", cityId);
  } else if (scope.countryName) {
    publicationQuery = publicationQuery.eq("rendered_map_list->location->>country", scope.countryName);
  } else if (scope.continentName) {
    publicationQuery = publicationQuery.eq("rendered_map_list->location->>continent", scope.continentName);
  }

  const publication = await publicationQuery
    .order("starts_at", { ascending: true })
    .returns<DataApiWeeklyEventGuideRow[]>();

  if (!publication.error && publication.data?.length) {
    return filterCurrentEventGuides(publication.data.map((row) => normalizeWeeklyEventGuide(row.guide)));
  }

  let legacyQuery = supabase
    .from("weekly_event_guides")
    .select("guide")
    .gte("sourced_at", new Date(Date.now() - 14 * 86400000).toISOString())
    .or(currentEventFilter);

  if (scope.cityName) {
    legacyQuery = legacyQuery.eq("city_id", cityId);
  } else if (scope.countryName) {
    legacyQuery = legacyQuery.eq("guide->location->>country", scope.countryName);
  } else if (scope.continentName) {
    legacyQuery = legacyQuery.eq("guide->location->>continent", scope.continentName);
  }

  const legacy = await legacyQuery.returns<DataApiWeeklyEventGuideRow[]>();

  if (!legacy.error && legacy.data?.length) {
    return filterCurrentEventGuides(legacy.data.map((row) => normalizeWeeklyEventGuide(row.guide)));
  }

  return filterGuidesByScope(getLocalWeeklyEventGuides(), scope);
}

async function loadRenderCacheGuidesFromDataApi(
  supabase: SupabaseClient,
  scope: EditorialGuideScope = {},
): Promise<MapList[] | null> {
  const cityId = await getCityIdFromDataApi(supabase, scope.cityName);
  let query = supabase
    .from("entry_render_cache")
    .select("rendered_payload,updated_at")
    .eq("render_format", "maplist")
    .eq("render_version", 1)
    .eq("is_current", true);

  if (scope.cityName) {
    if (!cityId) {
      return null;
    }
    query = query.eq("rendered_payload->location->>city", scope.cityName);
  } else if (scope.countryName) {
    query = query.eq("rendered_payload->location->>country", scope.countryName);
  } else if (scope.continentName) {
    query = query.eq("rendered_payload->location->>continent", scope.continentName);
  }

  const { data, error } = await query.returns<DataApiRenderCacheRow[]>();

  if (error || !data?.length) {
    return null;
  }

  return filterCurrentEventGuides([
    ...data.map((row) => attachGuideUpdatedAt(row.rendered_payload, row.updated_at)),
    ...(await loadWeeklyEventsFromDataApi(supabase, scope)),
  ]);
}

async function loadNormalizedGuides(client: Client, scope: EditorialGuideScope = {}): Promise<MapList[] | null> {
  try {
    const { clause: locationFilter, values } = getDatabaseScopeFilter(
      scope,
      "city.name",
      "entry.country_name",
      "entry.continent_name",
    );

    const { rows } = await client.query<NormalizedGuideRow>(
      [
        "select view.list, entry.updated_at",
        "from public.entries entry",
        "join public.entries_maplist view on view.id = entry.id",
        "left join public.destinations city on city.id = entry.city_id",
        "where entry.source_table = 'editorial_guides'",
        locationFilter,
        "order by entry.category asc, entry.country_name asc nulls last,",
        "  (view.list->'location'->>'city') asc nulls last,",
        "  (view.list->'location'->>'neighborhood') asc nulls last,",
        "  view.list->>'title' asc",
      ].join(" "),
      values,
    );

    if (!rows.length) {
      return null;
    }

    const weeklyEventRows = await loadWeeklyEventsFromDatabase(client, scope);
    const weeklyEventGuides = weeklyEventRows.length
      ? weeklyEventRows.map((row) => normalizeWeeklyEventGuide(row.guide))
      : filterGuidesByScope(getLocalWeeklyEventGuides(), scope);

    return filterCurrentEventGuides([
      ...rows.map((row) => attachGuideUpdatedAt(row.list, row.updated_at)),
      ...weeklyEventGuides,
    ]);
  } catch {
    return null;
  }
}

async function loadRenderCacheGuides(client: Client, scope: EditorialGuideScope = {}): Promise<MapList[]> {
  const { clause: locationFilter, values } = getDatabaseScopeFilter(
    scope,
    "city.name",
    "entry.country_name",
    "entry.continent_name",
  );

  const { rows } = await client.query<RenderCacheRow>(
    [
      "select cache.rendered_payload, cache.updated_at",
      "from public.entry_render_cache cache",
      "join public.entries entry on entry.id = cache.entry_id",
      "left join public.destinations city on city.id = entry.city_id",
      "where cache.render_format = 'maplist'",
      "  and cache.render_version = 1",
      "  and cache.is_current = true",
      "  and entry.source_table = 'editorial_guides'",
      "  and entry.status = 'published'",
      locationFilter,
      "order by entry.category asc, entry.country_name asc nulls last,",
      "  cache.rendered_payload->'location'->>'city' asc nulls last,",
      "  cache.rendered_payload->'location'->>'neighborhood' asc nulls last,",
      "  cache.rendered_payload->>'title' asc",
    ].join(" "),
    values,
  );

  const weeklyEventRows = await loadWeeklyEventsFromDatabase(client, scope);
  const weeklyEventGuides = weeklyEventRows.length
    ? weeklyEventRows.map((row) => normalizeWeeklyEventGuide(row.guide))
    : filterGuidesByScope(getLocalWeeklyEventGuides(), scope);

  return filterCurrentEventGuides([
    ...rows.map((row) => attachGuideUpdatedAt(row.rendered_payload, row.updated_at)),
    ...weeklyEventGuides,
  ]);
}

async function loadWeeklyEventsFromDatabase(client: Client, scope: EditorialGuideScope = {}) {
  const normalizedRows = await loadNormalizedWeeklyEvents(client, scope);
  if (normalizedRows.length) {
    return normalizedRows;
  }

  const publicationRows = await loadWeeklyEventPublicationCache(client, scope);
  if (publicationRows.length) {
    return publicationRows;
  }

  return loadLegacyWeeklyEventGuides(client, scope);
}

async function loadNormalizedWeeklyEvents(client: Client, scope: EditorialGuideScope = {}) {
  try {
    const { clause: locationFilter, values } = getDatabaseScopeFilter(
      scope,
      "city.name",
      "guide->'location'->>'country'",
      "guide->'location'->>'continent'",
    );

    const result = await client.query<WeeklyEventGuideRow>(
      [
        "select guide",
        "from public.weekly_events_maplist event",
        "left join public.destinations city on city.id = event.city_id",
        "where sourced_at >= current_date - interval '14 days'",
        "  and coalesce(ends_at, starts_at) >= now()",
        locationFilter,
        "order by guide->'location'->>'city' asc, starts_at asc, guide->>'title' asc",
      ].join(" "),
      values,
    );
    return result.rows;
  } catch {
    return [];
  }
}

async function loadWeeklyEventPublicationCache(client: Client, scope: EditorialGuideScope = {}) {
  try {
    const { clause: locationFilter, values } = getDatabaseScopeFilter(
      scope,
      "city.name",
      "rendered_map_list->'location'->>'country'",
      "rendered_map_list->'location'->>'continent'",
    );

    const { rows } = await client.query<WeeklyEventGuideRow>(
      [
        "select rendered_map_list as guide",
        "from public.weekly_event_publications publication",
        "left join public.destinations city on city.id = publication.city_id",
        "where sourced_at >= current_date - interval '14 days'",
        "  and coalesce(ends_at, starts_at) >= now()",
        locationFilter,
        "order by rendered_map_list->'location'->>'city' asc, starts_at asc, rendered_map_list->>'title' asc",
      ].join(" "),
      values,
    );
    return rows;
  } catch {
    return [];
  }
}

async function loadLegacyWeeklyEventGuides(client: Client, scope: EditorialGuideScope = {}) {
  try {
    const { clause: locationFilter, values } = getDatabaseScopeFilter(
      scope,
      "city.name",
      "guide->'location'->>'country'",
      "guide->'location'->>'continent'",
    );

    const { rows } = await client.query<WeeklyEventGuideRow>(
      [
        "select guide",
        "from public.weekly_event_guides guide",
        "left join public.destinations city on city.id = guide.city_id",
        "where sourced_at >= current_date - interval '14 days'",
        "  and coalesce(ends_at, starts_at) >= now()",
        locationFilter,
        "order by guide->'location'->>'city' asc, guide->>'title' asc",
      ].join(" "),
      values,
    );
    return rows;
  } catch {
    return [];
  }
}

const getCachedCityEditorialGuidesFromSupabase = unstable_cache(
  async (cityName: string) => {
    return loadEditorialGuidesFromSupabase({ cityName });
  },
  ["server-editorial-guides", "city-scoped"],
  {
    revalidate: Number.isFinite(EDITORIAL_GUIDES_CACHE_SECONDS)
      ? EDITORIAL_GUIDES_CACHE_SECONDS
      : 86400,
    tags: ["editorial-guides"],
  },
);

const getCachedCountryEditorialGuidesFromSupabase = unstable_cache(
  async (countryName: string) => {
    return loadEditorialGuidesFromSupabase({ countryName });
  },
  ["server-editorial-guides", "country-scoped"],
  {
    revalidate: Number.isFinite(EDITORIAL_GUIDES_CACHE_SECONDS)
      ? EDITORIAL_GUIDES_CACHE_SECONDS
      : 86400,
    tags: ["editorial-guides"],
  },
);

const getCachedContinentEditorialGuidesFromSupabase = unstable_cache(
  async (continentName: string) => {
    return loadEditorialGuidesFromSupabase({ continentName });
  },
  ["server-editorial-guides", "continent-scoped"],
  {
    revalidate: Number.isFinite(EDITORIAL_GUIDES_CACHE_SECONDS)
      ? EDITORIAL_GUIDES_CACHE_SECONDS
      : 86400,
    tags: ["editorial-guides"],
  },
);

const getRequestMemoizedAllEditorialGuides = cache(async () => loadEditorialGuidesFromSupabase());

export async function getServerEditorialGuides(scope: EditorialGuideScope = {}) {
  const supabaseGuideLoader = scope.bypassCache
    ? loadEditorialGuidesFromSupabase(scope)
    : scope.cityName
      ? getCachedCityEditorialGuidesFromSupabase(scope.cityName)
      : scope.countryName
        ? getCachedCountryEditorialGuidesFromSupabase(scope.countryName)
        : scope.continentName
          ? getCachedContinentEditorialGuidesFromSupabase(scope.continentName)
          : getRequestMemoizedAllEditorialGuides();

  const supabaseGuides = await supabaseGuideLoader.catch((error) => {
    console.error("Failed to load cached server editorial guides", error);
    return null;
  });

  if (supabaseGuides) {
    return supabaseGuides;
  }

  return filterCurrentEventGuides(filterGuidesByScope(
    [...mapLists.map(normalizeWeeklyEventGuide), ...getLocalWeeklyEventGuides()],
    scope,
  ));
}
