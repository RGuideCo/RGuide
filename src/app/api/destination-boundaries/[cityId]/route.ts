import { NextResponse } from "next/server";
import pg from "pg";
import type { Feature, FeatureCollection, Geometry } from "geojson";

import {
  loadNeighborhoodBoundaryMap,
  type NeighborhoodBoundaryMap,
  type NeighborhoodBoundaryProperties,
} from "@/data/boundary-loaders";

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

function collectionFromBoundaryMap(
  boundaryMap: NeighborhoodBoundaryMap,
): FeatureCollection<Geometry, NeighborhoodBoundaryProperties> {
  return {
    type: "FeatureCollection",
    features: Object.values(boundaryMap),
  };
}

function boundaryResponse(collection: FeatureCollection<Geometry, NeighborhoodBoundaryProperties>) {
  return NextResponse.json(collection, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ cityId: string }> },
) {
  const { cityId } = await context.params;
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    return boundaryResponse(collectionFromBoundaryMap(await loadNeighborhoodBoundaryMap(cityId)));
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

    return boundaryResponse(collection);
  } catch (error) {
    console.error(`Failed to load destination boundaries for ${cityId}`, error);
    return boundaryResponse(collectionFromBoundaryMap(await loadNeighborhoodBoundaryMap(cityId)));
  } finally {
    await client.end().catch(() => {});
  }
}
