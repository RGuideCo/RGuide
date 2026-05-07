import "server-only";

import pg from "pg";

import { mapLists } from "@/data/lists";
import { applyEditorialPoiPhotos } from "@/lib/editorial-guides-shared";
import type { EditorialPoiPhotoRecord } from "@/lib/editorial-guides-shared";
import type { MapList } from "@/types";

interface EditorialGuideRow {
  list: MapList;
}

function getDatabaseUrl() {
  return (
    process.env.SUPABASE_DB_URL ??
    process.env.SUPABASE_DATABASE_URL ??
    process.env.DATABASE_URL ??
    null
  );
}

function getPgSslConfig(databaseUrl: string) {
  return databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
    ? false
    : { rejectUnauthorized: false };
}

async function loadEditorialGuidesFromSupabase(): Promise<MapList[] | null> {
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

    return applyEditorialPoiPhotos(rows.map((row) => row.list), poiRows);
  } catch (error) {
    console.error("Failed to load server editorial guides", error);
    return null;
  } finally {
    await client.end().catch(() => {});
  }
}

export async function getServerEditorialGuides() {
  const supabaseGuides = await loadEditorialGuidesFromSupabase();

  if (supabaseGuides) {
    return supabaseGuides;
  }

  return mapLists;
}
