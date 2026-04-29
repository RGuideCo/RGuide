import { NextResponse } from "next/server";
import pg from "pg";

import type { MapList } from "@/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

    return NextResponse.json(
      { guides: rows.map((row) => row.list) },
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
