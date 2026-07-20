import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import pg from "pg";
import { getPgSslConfig } from "./database-ssl.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const key = trimmed.slice(0, trimmed.indexOf("=")).trim();
    let value = trimmed.slice(trimmed.indexOf("=") + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

function parseArgs(argv) {
  const options = {
    city: null,
    slugs: [],
    id: null,
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const readValue = () => {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`Missing value for ${arg}`);
      index += 1;
      return value;
    };

    if (arg === "--city") options.city = readValue();
    else if (arg === "--slug") {
      options.slugs.push(...readValue().split(",").map((value) => value.trim()).filter(Boolean));
    }
    else if (arg === "--id") options.id = readValue();
    else if (arg === "--dry-run") options.dryRun = true;
  }

  return options;
}

function getDatabaseUrl() {
  return process.env.SUPABASE_DB_URL ?? process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL ?? null;
}

function scopedWhereClause(options, values) {
  const conditions = ["true"];

  if (options.city) {
    values.push(options.city);
    conditions.push(`city.name ilike $${values.length}`);
  }
  if (options.slugs.length) {
    values.push(options.slugs);
    conditions.push(`entry.slug = any($${values.length}::text[])`);
  }
  if (options.id) {
    values.push(options.id);
    conditions.push(`(entry.legacy_id = $${values.length} or entry.id::text = $${values.length})`);
  }

  return conditions.join(" and ");
}

const PLACEHOLDER_SOURCE_ORDER = [
  "case when (",
  "  media.source_url ilike '%Bellas_Artes_01%'",
  "  or media.source_url ilike '%Palacio_de_Bellas_Artes%'",
  "  or media.raw_metadata::text ilike '%Bellas_Artes_01%'",
  "  or media.raw_metadata::text ilike '%Palacio_de_Bellas_Artes%'",
  ") then 1 else 0 end asc",
].join(" ");

async function promoteR2PrimaryPhotos(client, options, publicBaseUrl) {
  const values = [];
  const where = scopedWhereClause(options, values);
  values.push(`${publicBaseUrl.replace(/\/$/, "")}/%`);
  const r2PatternIndex = values.length;

  const { rows } = await client.query(
    `with scoped_venues as (
       select distinct venue.id, venue.primary_photo_id
       from public.venues venue
       left join public.destinations city on city.id = venue.city_id
       left join public.entry_stops stop on stop.venue_id = venue.id
       left join public.entries entry on entry.id = stop.entry_id
       where ${where}
     ),
     ranked_media as (
       select
         media.id,
         media.venue_id,
         row_number() over (
           partition by media.venue_id
           order by
             (media.id = venue.primary_photo_id) desc,
             ${PLACEHOLDER_SOURCE_ORDER},
             (media.role = 'primary') desc,
             media.sort_order nulls last,
             media.ingested_at desc nulls last,
             media.updated_at desc nulls last,
             media.id
         ) as rank
       from public.venue_media media
       join scoped_venues venue on venue.id = media.venue_id
       where media.is_active = true
         and media.media_type = 'image'
         and media.storage_provider = 'cloudflare_r2'
         and media.ingestion_status = 'stored'
         and coalesce(media.public_url, media.url) like $${r2PatternIndex}
     ),
     promoted as (
       update public.venues venue
       set primary_photo_id = ranked_media.id,
           updated_at = now()
       from ranked_media
       where venue.id = ranked_media.venue_id
         and ranked_media.rank = 1
         and venue.primary_photo_id is distinct from ranked_media.id
       returning venue.id
     )
     select id from promoted`,
    values,
  );

  return rows.map((row) => row.id);
}

async function findEntriesForVenues(client, venueIds) {
  if (!venueIds.length) return [];
  const { rows } = await client.query(
    `select distinct stop.entry_id
     from public.entry_stops stop
     join public.entries entry on entry.id = stop.entry_id
     where stop.venue_id = any($1::uuid[])
       and entry.status = 'published'::public.rguide_entry_status`,
    [venueIds],
  );
  return rows.map((row) => row.entry_id);
}

async function promoteEntryCoverPhotos(client, options, publicBaseUrl) {
  const values = [];
  const where = scopedWhereClause(options, values);
  values.push(`${publicBaseUrl.replace(/\/$/, "")}/%`);
  const r2PatternIndex = values.length;

  const { rows } = await client.query(
    `with scoped_entries as (
       select entry.id
       from public.entries entry
       left join public.destinations city on city.id = entry.city_id
       where ${where}
         and entry.status = 'published'::public.rguide_entry_status
     ),
     ranked_photos as (
       select
         entry.id as entry_id,
         coalesce(media.public_url, media.url) as photo_url,
         row_number() over (
           partition by entry.id
           order by
             stop.stop_order asc,
             (media.id = venue.primary_photo_id) desc,
             ${PLACEHOLDER_SOURCE_ORDER},
             (media.role = 'primary') desc,
             media.sort_order nulls last,
             media.ingested_at desc nulls last,
             media.updated_at desc nulls last,
             media.id
         ) as rank
       from scoped_entries entry
       join public.entry_stops stop on stop.entry_id = entry.id
       join public.venues venue on venue.id = stop.venue_id
       join public.venue_media media
         on media.venue_id = venue.id
        and media.is_active = true
        and media.media_type = 'image'
        and media.storage_provider = 'cloudflare_r2'
        and media.ingestion_status = 'stored'
        and coalesce(media.public_url, media.url) like $${r2PatternIndex}
     ),
     updated as (
       update public.entries entry
       set photo_url = ranked_photos.photo_url
       from ranked_photos
       where entry.id = ranked_photos.entry_id
         and ranked_photos.rank = 1
         and entry.photo_url is distinct from ranked_photos.photo_url
       returning entry.id
     )
     select id from updated`,
    values,
  );

  return rows.map((row) => row.id);
}

async function refreshRenderCaches(client, entryIds) {
  if (!entryIds.length) return 0;
  const { rowCount } = await client.query(
    [
      "insert into public.entry_render_cache (",
      "  entry_id, render_format, render_version, rendered_payload, source_hash,",
      "  rendered_at, stale_at, is_current, metadata",
      ")",
      "select",
      "  entry.id,",
      "  'maplist',",
      "  1,",
      "  view.list,",
      "  encode(digest(view.list::text, 'sha256'), 'hex'),",
      "  now(),",
      "  null,",
      "  true,",
      "  jsonb_build_object('refreshed_from', 'enforce-r2-venue-photos')",
      "from public.entries entry",
      "join public.entries_maplist view on view.id = entry.id",
      "where entry.id = any($1::uuid[])",
      "on conflict (entry_id, render_format, render_version) do update set",
      "  rendered_payload = excluded.rendered_payload,",
      "  source_hash = excluded.source_hash,",
      "  rendered_at = excluded.rendered_at,",
      "  stale_at = null,",
      "  is_current = true,",
      "  metadata = public.entry_render_cache.metadata || excluded.metadata",
    ].join(" "),
    [entryIds],
  );
  return rowCount ?? 0;
}

async function verifyR2Rendering(client, venueIds, publicBaseUrl) {
  if (!venueIds.length) return [];
  const { rows } = await client.query(
    `with rendered_stops as (
       select
         entry.slug as entry_slug,
         stop.name as stop_name,
         stop_payload ->> 'photo' as rendered_photo
       from public.entry_stops stop
       join public.entries entry on entry.id = stop.entry_id
       join public.entry_render_cache cache
         on cache.entry_id = entry.id
        and cache.render_format = 'maplist'
        and cache.is_current = true
       cross join lateral jsonb_array_elements(
         coalesce(cache.rendered_payload -> 'pois', '[]'::jsonb)
       ) as stop_payload
       where stop.venue_id = any($1::uuid[])
         and stop.poi_legacy_id = stop_payload ->> 'poiId'
     )
     select entry_slug, stop_name, rendered_photo
     from rendered_stops
     where coalesce(rendered_photo, '') not like $2
     limit 20`,
    [venueIds, `${publicBaseUrl.replace(/\/$/, "")}/%`],
  );
  return rows;
}

async function main() {
  loadEnvFile(path.join(ROOT, ".env.local"));
  loadEnvFile(path.join(ROOT, ".env"));

  const options = parseArgs(process.argv.slice(2));
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) throw new Error("Set SUPABASE_DB_URL, SUPABASE_DATABASE_URL, or DATABASE_URL.");
  const publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL?.trim() || "https://media.rguide.co";

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: getPgSslConfig(databaseUrl),
  });

  await client.connect();
  try {
    await client.query("begin");
    const promotedVenueIds = await promoteR2PrimaryPhotos(client, options, publicBaseUrl);
    const entryIds = await findEntriesForVenues(client, promotedVenueIds);
    const coverEntryIds = await promoteEntryCoverPhotos(client, options, publicBaseUrl);
    const affectedEntryIds = [...new Set([...entryIds, ...coverEntryIds])];
    const cacheRefreshed = await refreshRenderCaches(client, affectedEntryIds);
    const failures = await verifyR2Rendering(client, promotedVenueIds, publicBaseUrl);

    if (options.dryRun) {
      await client.query("rollback");
    } else if (failures.length) {
      await client.query("rollback");
      console.error(JSON.stringify({ phase: "r2_render_verification_failed", failures }, null, 2));
      throw new Error("Some promoted R2 venue photos still render as non-R2 URLs.");
    } else {
      await client.query("commit");
    }

    console.log(JSON.stringify({
      ok: true,
      dryRun: options.dryRun,
      promotedVenues: promotedVenueIds.length,
      promotedEntryCovers: coverEntryIds.length,
      affectedEntries: affectedEntryIds.length,
      cacheRefreshed,
    }, null, 2));
  } catch (error) {
    await client.query("rollback").catch(() => {});
    throw error;
  } finally {
    await client.end().catch(() => {});
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
