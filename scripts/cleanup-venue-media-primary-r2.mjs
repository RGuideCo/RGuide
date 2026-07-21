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
    else if (arg === "--dry-run") options.dryRun = true;
    else throw new Error(`Unknown option: ${arg}`);
  }

  return options;
}

function getDatabaseUrl() {
  return process.env.SUPABASE_DB_URL ?? process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL ?? null;
}

async function cleanupDuplicatePrimaryR2(client, options, publicBaseUrl) {
  const values = [`${publicBaseUrl.replace(/\/$/, "")}/%`];
  const conditions = ["true"];
  if (options.city) {
    values.push(options.city);
    conditions.push(`city.name ilike $${values.length}`);
  }

  const { rows } = await client.query(
    `with scoped_venues as (
       select venue.id, venue.primary_photo_id
       from public.venues venue
       left join public.destinations city on city.id = venue.city_id
       where ${conditions.join(" and ")}
     ),
     active_primary_r2 as (
       select
         media.id,
         media.venue_id,
         media.ingested_at,
         media.updated_at,
         scoped_venues.primary_photo_id
       from public.venue_media media
       join scoped_venues on scoped_venues.id = media.venue_id
       where media.is_active = true
         and media.media_type = 'image'
         and media.role = 'primary'
         and media.storage_provider = 'cloudflare_r2'
         and media.ingestion_status = 'stored'
         and media.public_url like $1
     ),
     duplicate_venues as (
       select venue_id
       from active_primary_r2
       group by venue_id
       having count(*) > 1
     ),
     ranked as (
       select
         media.*,
         row_number() over (
           partition by media.venue_id
           order by
             (media.id = media.primary_photo_id) desc,
             media.ingested_at desc nulls last,
             media.updated_at desc nulls last,
             media.id desc
         ) as rank
       from active_primary_r2 media
       join duplicate_venues on duplicate_venues.venue_id = media.venue_id
     ),
     keepers as (
       select id, venue_id
       from ranked
       where rank = 1
     ),
     promoted as (
       update public.venues venue
       set primary_photo_id = keepers.id,
           updated_at = now()
       from keepers
       where venue.id = keepers.venue_id
         and venue.primary_photo_id is distinct from keepers.id
       returning venue.id
     ),
     retired as (
       update public.venue_media media
       set is_active = false,
           raw_metadata = media.raw_metadata || jsonb_build_object(
             'retired_by_media_id', keepers.id::text,
             'retired_reason', 'duplicate_active_primary_r2_cleanup',
             'retired_at', now()
           ),
           updated_at = now()
       from ranked
       join keepers on keepers.venue_id = ranked.venue_id
       where ranked.rank > 1
         and media.id = ranked.id
       returning media.id, media.venue_id
     ),
     affected_entries as (
       select distinct stop.entry_id
       from public.entry_stops stop
       join retired on retired.venue_id = stop.venue_id
       join public.entries entry on entry.id = stop.entry_id
       where entry.status = 'published'::public.rguide_entry_status
     ),
     refreshed as (
       insert into public.entry_render_cache (
         entry_id, render_format, render_version, rendered_payload, source_hash,
         rendered_at, stale_at, is_current, metadata
       )
       select
         entry.id,
         'maplist',
         1,
         view.list,
         encode(digest(view.list::text, 'sha256'), 'hex'),
         now(),
         null,
         true,
         jsonb_build_object('refreshed_from', 'cleanup-venue-media-primary-r2')
       from public.entries entry
       join public.entries_maplist view on view.id = entry.id
       join affected_entries affected on affected.entry_id = entry.id
       on conflict (entry_id, render_format, render_version) do update set
         rendered_payload = excluded.rendered_payload,
         source_hash = excluded.source_hash,
         rendered_at = excluded.rendered_at,
         stale_at = null,
         is_current = true,
         metadata = public.entry_render_cache.metadata || excluded.metadata
       returning entry_id
     )
     select
       (select count(*)::int from duplicate_venues) as duplicate_venues,
       (select count(*)::int from promoted) as promoted_venues,
       (select count(*)::int from retired) as retired_media_rows,
       (select count(*)::int from refreshed) as refreshed_entries`,
    values,
  );

  return rows[0] ?? {
    duplicate_venues: 0,
    promoted_venues: 0,
    retired_media_rows: 0,
    refreshed_entries: 0,
  };
}

async function countRemainingDuplicates(client, options, publicBaseUrl) {
  const values = [`${publicBaseUrl.replace(/\/$/, "")}/%`];
  const conditions = ["true"];
  if (options.city) {
    values.push(options.city);
    conditions.push(`city.name ilike $${values.length}`);
  }

  const { rows } = await client.query(
    `with scoped_media as (
       select media.venue_id
       from public.venue_media media
       join public.venues venue on venue.id = media.venue_id
       left join public.destinations city on city.id = venue.city_id
       where ${conditions.join(" and ")}
         and media.is_active = true
         and media.media_type = 'image'
         and media.role = 'primary'
         and media.storage_provider = 'cloudflare_r2'
         and media.ingestion_status = 'stored'
         and media.public_url like $1
     )
     select count(*)::int as venues_with_duplicate_active_primary_r2
     from (
       select venue_id
       from scoped_media
       group by venue_id
       having count(*) > 1
     ) duplicates`,
    values,
  );

  return Number(rows[0]?.venues_with_duplicate_active_primary_r2 ?? 0);
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
    const before = await countRemainingDuplicates(client, options, publicBaseUrl);
    const cleanup = await cleanupDuplicatePrimaryR2(client, options, publicBaseUrl);
    const after = await countRemainingDuplicates(client, options, publicBaseUrl);

    if (options.dryRun) {
      await client.query("rollback");
    } else {
      await client.query("commit");
    }

    console.log(JSON.stringify({
      ok: true,
      dryRun: options.dryRun,
      scope: options.city ? `city: ${options.city}` : "all",
      before,
      cleanup,
      after,
    }, null, 2));
  } catch (error) {
    await client.query("rollback").catch(() => {});
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
