import { NextResponse } from "next/server";
import pg from "pg";

import type { GuideStop, MapList } from "@/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface EditorialGuideRow {
  list: MapList;
}

interface EditorialPoiRow {
  id: string;
  photo: string | null;
}

function applyPoiPhotos(guides: MapList[], pois: EditorialPoiRow[]) {
  const photoByPoiId = new Map(
    pois
      .filter((poi) => poi.photo)
      .map((poi) => [poi.id, poi.photo as string]),
  );

  const applyStopPhoto = (stop: GuideStop): GuideStop => ({
    ...stop,
    photo: stop.poiId ? photoByPoiId.get(stop.poiId) ?? stop.photo : stop.photo,
    places: stop.places?.map(applyStopPhoto),
  });

  return guides.map((guide) => ({
    ...guide,
    stops: guide.stops.map(applyStopPhoto),
  }));
}

function getDatabaseUrl() {
  return (
    process.env.SUPABASE_DB_URL ??
    process.env.SUPABASE_DATABASE_URL ??
    process.env.DATABASE_URL ??
    null
  );
}

export async function GET() {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    return NextResponse.json({ guides: [] });
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
    const { rows } = await client.query<EditorialGuideRow>(
      [
        "select list",
        "from public.editorial_guides",
        "order by category asc, country asc nulls last, city asc nulls last, neighborhood asc nulls last, list->>'title' asc",
      ].join(" "),
    );
    let poiRows: EditorialPoiRow[] = [];
    try {
      const result = await client.query<EditorialPoiRow>(
        "select id, photo from public.editorial_pois",
      );
      poiRows = result.rows;
    } catch {
      poiRows = [];
    }

    return NextResponse.json(
      { guides: applyPoiPhotos(rows.map((row) => row.list), poiRows) },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Failed to load editorial guides", error);
    return NextResponse.json({ guides: [] }, { status: 500 });
  } finally {
    await client.end().catch(() => {});
  }
}
