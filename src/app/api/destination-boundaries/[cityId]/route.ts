import { NextResponse } from "next/server";
import pg from "pg";
import type { Feature, FeatureCollection, Geometry } from "geojson";

import londonBoundaries from "@/data/boundaries/london.json";
import tokyoBoundaries from "@/data/boundaries/tokyo.json";
import type { NeighborhoodBoundaryProperties } from "@/data/boundary-loaders";
import { getPgSslConfig } from "@/lib/database-ssl";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const revalidate = 86400;
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

function emptyCollection(): FeatureCollection<Geometry, NeighborhoodBoundaryProperties> {
  return {
    type: "FeatureCollection",
    features: [],
  };
}

function isPolygonFeature(
  feature: unknown,
): feature is Feature<Geometry, NeighborhoodBoundaryProperties> {
  const geometryType = (feature as Feature<Geometry, NeighborhoodBoundaryProperties> | null)?.geometry?.type;
  return geometryType === "Polygon" || geometryType === "MultiPolygon";
}

function localFallbackCollection(cityId: string): FeatureCollection<Geometry, NeighborhoodBoundaryProperties> {
  const localBoundaryMaps: Record<string, Record<string, unknown>> = {
    london: londonBoundaries as Record<string, unknown>,
    tokyo: tokyoBoundaries as Record<string, unknown>,
  };
  const boundaryMap = localBoundaryMaps[cityId];

  if (!boundaryMap) {
    return emptyCollection();
  }

  return {
    type: "FeatureCollection",
    features: Object.values(boundaryMap).filter(isPolygonFeature),
  };
}

function boundaryResponse(collection: FeatureCollection<Geometry, NeighborhoodBoundaryProperties>) {
  return NextResponse.json(collection, {
    headers: {
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
    },
  });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ cityId: string }> },
) {
  const rateLimit = await checkRateLimit(request, {
    namespace: "destination-boundaries",
    limit: 120,
    windowMs: 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit);
  }

  const { cityId } = await context.params;
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    return boundaryResponse(localFallbackCollection(cityId));
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
    return boundaryResponse(localFallbackCollection(cityId));
  } finally {
    await client.end().catch(() => {});
  }
}
