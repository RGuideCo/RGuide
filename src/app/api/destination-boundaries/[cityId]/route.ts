import { NextResponse } from "next/server";
import pg from "pg";
import type { Feature, FeatureCollection, Geometry } from "geojson";

import type { NeighborhoodBoundaryProperties } from "@/data/boundary-loaders";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type BoundaryRow = {
  boundary_key: string;
  name: string;
  destination_slug: string;
  simplified_geometry_geojson: Geometry;
};

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

function emptyCollection(): FeatureCollection<Geometry, NeighborhoodBoundaryProperties> {
  return {
    type: "FeatureCollection",
    features: [],
  };
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ cityId: string }> },
) {
  const { cityId } = await context.params;
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    return NextResponse.json(emptyCollection());
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: getPgSslConfig(databaseUrl),
  });

  try {
    await client.connect();
    const { rows } = await client.query<BoundaryRow>(
      [
        "select boundary.boundary_key, boundary.name, boundary.destination_slug,",
        "  boundary.simplified_geometry_geojson",
        "from public.destination_boundaries_geojson boundary",
        "where boundary.city_slug = $1",
        "  and boundary.is_active = true",
        "order by boundary.destination_slug asc",
      ].join(" "),
      [cityId],
    );

    const collection: FeatureCollection<Geometry, NeighborhoodBoundaryProperties> = {
      type: "FeatureCollection",
      features: rows.map((row) => ({
        type: "Feature",
        properties: {
          id: row.boundary_key,
          name: row.name,
        },
        geometry: row.simplified_geometry_geojson,
      })),
    };

    return NextResponse.json(collection, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error(`Failed to load destination boundaries for ${cityId}`, error);
    return NextResponse.json(emptyCollection(), { status: 200 });
  } finally {
    await client.end().catch(() => {});
  }
}
