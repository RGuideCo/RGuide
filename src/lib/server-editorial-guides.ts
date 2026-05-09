import "server-only";

import { unstable_cache } from "next/cache";
import pg from "pg";

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

function getLocalWeeklyEventGuides() {
  return weeklyCityEventRuns.flatMap((run) =>
    run.events.map((event) => weeklyEventToGuideList(event, run)),
  );
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
    const { rows } = await client.query<EditorialGuideRow>(
      [
        "select list",
        "from public.editorial_guides",
        "order by category asc, country asc nulls last, city asc nulls last, neighborhood asc nulls last, list->>'title' asc",
      ].join(" "),
    );

    let poiRows: EditorialPoiPhotoRecord[] = [];
    try {
      const result = await client.query<EditorialPoiPhotoRecord>(
        "select id, photo from public.editorial_pois",
      );
      poiRows = result.rows;
    } catch {
      poiRows = [];
    }

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
      ? weeklyEventRows.map((row) => row.guide)
      : getLocalWeeklyEventGuides();

    return applyEditorialPoiPhotos([...rows.map((row) => row.list), ...weeklyEventGuides], poiRows);
  } catch (error) {
    console.error("Failed to load server editorial guides", error);
    return null;
  } finally {
    await client.end().catch(() => {});
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

  return [...mapLists, ...getLocalWeeklyEventGuides()];
}
