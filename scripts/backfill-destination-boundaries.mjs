import fs from "fs";
import path from "path";
import pg from "pg";

const ROOT = process.cwd();
const BOUNDARY_DIR = path.join(ROOT, "src/data/boundaries");
const SIMPLIFICATION_TOLERANCE = Number.parseFloat(
  process.env.RGUIDE_BOUNDARY_SIMPLIFICATION_TOLERANCE ?? "0.00035",
);

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const key = trimmed.slice(0, trimmed.indexOf("=")).trim();
    let value = trimmed.slice(trimmed.indexOf("=") + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function isPolygonFeature(feature) {
  return feature?.type === "Feature" &&
    (feature.geometry?.type === "Polygon" || feature.geometry?.type === "MultiPolygon");
}

function sourceFromFeature(feature) {
  const source = feature?.properties?.source ?? {};
  return {
    sourceName: source.provider ?? source.sourceId ?? feature?.properties?.sourceName ?? null,
    sourceUrl: source.datasetUrl ?? source.url ?? null,
    sourceLicense: source.license ?? null,
    sourceMetadata: {
      ...source,
      cityId: feature?.properties?.cityId ?? null,
      propertyId: feature?.properties?.id ?? null,
      displayName: feature?.properties?.displayName ?? null,
      parentName: feature?.properties?.parentName ?? null,
    },
  };
}

async function getCityId(client, citySlug) {
  const { rows } = await client.query(
    `select id
     from public.destinations
     where scope = 'city'
       and slug = $1
     order by is_published desc, created_at asc
     limit 1`,
    [citySlug],
  );
  return rows[0]?.id ?? null;
}

async function getDestinationId(client, cityId, destinationSlug) {
  const { rows } = await client.query(
    `select id
     from public.destinations
     where scope = 'neighborhood'
       and parent_id = $1
       and slug = $2
     limit 1`,
    [cityId, destinationSlug],
  );
  return rows[0]?.id ?? null;
}

async function upsertBoundary(client, { cityId, destinationId, boundaryKey, feature }) {
  const { sourceName, sourceUrl, sourceLicense, sourceMetadata } = sourceFromFeature(feature);
  const geometryJson = JSON.stringify(feature.geometry);
  const sourceMetadataJson = JSON.stringify(sourceMetadata);

  await client.query(
    `with incoming as (
       select
         st_multi(st_setsrid(st_makevalid(st_geomfromgeojson($4)), 4326))::public.geometry(MultiPolygon, 4326) as geometry
     ),
     prepared as (
       select
         geometry,
         st_multi(st_simplifypreservetopology(geometry, $8))::public.geometry(MultiPolygon, 4326) as simplified_geometry,
         jsonb_build_array(
           jsonb_build_array(st_ymin(st_envelope(geometry)), st_xmin(st_envelope(geometry))),
           jsonb_build_array(st_ymax(st_envelope(geometry)), st_xmax(st_envelope(geometry)))
         ) as bounds,
         jsonb_build_array(st_y(st_pointonsurface(geometry)), st_x(st_pointonsurface(geometry))) as centroid
       from incoming
       where not st_isempty(geometry)
     )
     insert into public.destination_boundaries (
       destination_id, city_id, boundary_key, geometry, simplified_geometry,
       bounds, centroid, source_name, source_url, source_license, source_metadata,
       simplification_tolerance, is_active, verified_at
     )
     select
       $1, $2, $3, geometry, simplified_geometry,
       bounds, centroid, $5, $6, $7, $9::jsonb,
       $8, true, now()
     from prepared
     on conflict (destination_id, boundary_key) do update set
       city_id = excluded.city_id,
       geometry = excluded.geometry,
       simplified_geometry = excluded.simplified_geometry,
       bounds = excluded.bounds,
       centroid = excluded.centroid,
       source_name = excluded.source_name,
       source_url = excluded.source_url,
       source_license = excluded.source_license,
       source_metadata = excluded.source_metadata,
       simplification_tolerance = excluded.simplification_tolerance,
       is_active = true,
       verified_at = excluded.verified_at,
       updated_at = now()`,
    [
      destinationId,
      cityId,
      boundaryKey,
      geometryJson,
      sourceName,
      sourceUrl,
      sourceLicense,
      SIMPLIFICATION_TOLERANCE,
      sourceMetadataJson,
    ],
  );
}

async function backfillCityFile(client, fileName, stats) {
  const citySlug = fileName.replace(/\.json$/, "");
  const cityId = await getCityId(client, citySlug);
  if (!cityId) {
    stats.skippedCities.push({ citySlug, reason: "city destination not found" });
    return;
  }

  const boundaryMap = JSON.parse(fs.readFileSync(path.join(BOUNDARY_DIR, fileName), "utf8"));
  for (const [boundaryKey, feature] of Object.entries(boundaryMap)) {
    const parts = boundaryKey.split("::");
    const destinationSlug = parts.at(-1);
    if (!destinationSlug) {
      stats.skippedBoundaries.push({ boundaryKey, reason: "missing destination slug" });
      continue;
    }

    if (!isPolygonFeature(feature)) {
      stats.skippedBoundaries.push({
        boundaryKey,
        reason: `not a polygon (${feature?.geometry?.type ?? "missing geometry"})`,
      });
      continue;
    }

    const destinationId = await getDestinationId(client, cityId, destinationSlug);
    if (!destinationId) {
      stats.skippedBoundaries.push({ boundaryKey, reason: "neighborhood destination not found" });
      continue;
    }

    await upsertBoundary(client, { cityId, destinationId, boundaryKey, feature });
    stats.boundaries += 1;
  }
}

async function main() {
  loadEnvFile(path.join(ROOT, ".env.local"));
  const databaseUrl = process.env.SUPABASE_DB_URL ?? process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("Set SUPABASE_DB_URL, SUPABASE_DATABASE_URL, or DATABASE_URL.");
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
      ? false
      : { rejectUnauthorized: false },
  });

  const stats = {
    boundaries: 0,
    skippedCities: [],
    skippedBoundaries: [],
  };

  await client.connect();
  try {
    await client.query("begin");
    for (const fileName of fs.readdirSync(BOUNDARY_DIR).filter((name) => name.endsWith(".json")).sort()) {
      await backfillCityFile(client, fileName, stats);
    }
    await client.query("commit");
  } catch (error) {
    await client.query("rollback").catch(() => {});
    throw error;
  } finally {
    await client.end();
  }

  console.log(JSON.stringify(stats, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
