import "server-only";

import { unstable_cache } from "next/cache";
import pg from "pg";
import type { Client } from "pg";

import { mapLists } from "@/data/lists";
import { weeklyCityEventRuns, weeklyEventToGuideList } from "@/data/weekly-events";
import { applyEditorialPoiPhotos } from "@/lib/editorial-guides-shared";
import type { EditorialPoiPhotoRecord } from "@/lib/editorial-guides-shared";
import type { MapList } from "@/types";

interface EditorialGuideRow {
  list: MapList;
}

interface WeeklyEventGuideRow {
  guide: MapList;
}

interface NormalizedGuideRow {
  list: MapList;
}

function getLocalWeeklyEventGuides() {
  return weeklyCityEventRuns.flatMap((run) =>
    run.events.map((event) => weeklyEventToGuideList(event, run)),
  );
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

const EDITORIAL_GUIDES_CACHE_SECONDS = Number.parseInt(
  process.env.EDITORIAL_GUIDES_CACHE_SECONDS ?? "900",
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

function shouldSkipDatabaseConnection() {
  if (process.env.RGUIDE_ALLOW_BUILD_DB === "1") {
    return false;
  }

  if (process.env.RGUIDE_SKIP_DATABASE === "1") {
    return true;
  }

  const isLocalProductionBuild =
    process.env.VERCEL !== "1" &&
    (process.env.NEXT_PHASE === "phase-production-build" ||
      process.env.npm_lifecycle_event === "build");

  return isLocalProductionBuild;
}

function getPgSslConfig(databaseUrl: string) {
  return databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
    ? false
    : { rejectUnauthorized: false };
}

async function loadEditorialGuidesFromSupabase(): Promise<MapList[] | null> {
  if (shouldSkipDatabaseConnection()) {
    return null;
  }

  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    return null;
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: getPgSslConfig(databaseUrl),
  });

  try {
    await client.connect();
    const normalizedGuides = await loadNormalizedGuides(client);

    if (normalizedGuides) {
      return normalizedGuides;
    }

    return loadLegacyGuides(client);
  } catch (error) {
    console.error("Failed to load server editorial guides", error);
    return null;
  } finally {
    await client.end().catch(() => {});
  }
}

async function loadNormalizedGuides(client: Client): Promise<MapList[] | null> {
  try {
    const { rows } = await client.query<NormalizedGuideRow>(
      [
        "select view.list",
        "from public.entries entry",
        "join public.entries_maplist view on view.id = entry.id",
        "where entry.source_table = 'editorial_guides'",
        "order by entry.category asc, entry.country_name asc nulls last,",
        "  (view.list->'location'->>'city') asc nulls last,",
        "  (view.list->'location'->>'neighborhood') asc nulls last,",
        "  view.list->>'title' asc",
      ].join(" "),
    );

    let weeklyEventRows: WeeklyEventGuideRow[] = [];
    try {
      const result = await client.query<WeeklyEventGuideRow>(
        [
          "select guide",
          "from public.weekly_events_maplist",
          "where sourced_at >= current_date - interval '14 days'",
          "order by guide->'location'->>'city' asc, starts_at asc, guide->>'title' asc",
        ].join(" "),
      );
      weeklyEventRows = result.rows;
    } catch {
      weeklyEventRows = [];
    }

    if (!rows.length) {
      return null;
    }

    const weeklyEventGuides = weeklyEventRows.length
      ? weeklyEventRows.map((row) => normalizeWeeklyEventGuide(row.guide))
      : getLocalWeeklyEventGuides();

    const poiRows = await loadEditorialPoiRows(client);

    return applyEditorialPoiPhotos(
      [...rows.map((row) => normalizeWeeklyEventGuide(row.list)), ...weeklyEventGuides],
      poiRows,
    );
  } catch {
    return null;
  }
}

async function loadLegacyGuides(client: Client): Promise<MapList[]> {
  const { rows } = await client.query<EditorialGuideRow>(
    [
      "select list",
      "from public.editorial_guides",
      "order by category asc, country asc nulls last, city asc nulls last, neighborhood asc nulls last, list->>'title' asc",
    ].join(" "),
  );

  const poiRows = await loadEditorialPoiRows(client);

  let weeklyEventRows: WeeklyEventGuideRow[] = [];
  try {
    const result = await client.query<WeeklyEventGuideRow>(
      [
        "select guide",
        "from public.weekly_event_guides",
        "where sourced_at >= current_date - interval '14 days'",
        "order by city_name asc, starts_at asc, event_title asc",
      ].join(" "),
    );
    weeklyEventRows = result.rows;
  } catch {
    weeklyEventRows = [];
  }

  const weeklyEventGuides = weeklyEventRows.length
    ? weeklyEventRows.map((row) => normalizeWeeklyEventGuide(row.guide))
    : getLocalWeeklyEventGuides();

  return applyEditorialPoiPhotos(
    [...rows.map((row) => normalizeWeeklyEventGuide(row.list)), ...weeklyEventGuides],
    poiRows,
  );
}

async function loadEditorialPoiRows(client: Client) {
  try {
    const result = await client.query<EditorialPoiPhotoRecord>(
      "select id, photo from public.editorial_pois",
    );
    return result.rows;
  } catch {
    return [];
  }
}

const getCachedEditorialGuidesFromSupabase = unstable_cache(
  loadEditorialGuidesFromSupabase,
  ["server-editorial-guides"],
  {
    revalidate: Number.isFinite(EDITORIAL_GUIDES_CACHE_SECONDS)
      ? EDITORIAL_GUIDES_CACHE_SECONDS
      : 900,
    tags: ["editorial-guides"],
  },
);

export async function getServerEditorialGuides() {
  const supabaseGuides = await getCachedEditorialGuidesFromSupabase();

  if (supabaseGuides) {
    return supabaseGuides;
  }

  return [...mapLists.map(normalizeWeeklyEventGuide), ...getLocalWeeklyEventGuides()];
}
