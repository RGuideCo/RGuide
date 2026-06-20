import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import pg from "pg";

import {
  addPoiReferencesToGuides,
  collectEditorialPois,
  describeEditorialGuideFilters,
  filterEditorialGuides,
  loadEditorialGuideLists,
  parseEditorialGuideArgs,
} from "./editorial-guides-data.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMAGE_EXTENSION_RE = /\.(?:jpe?g|png|webp|avif)(?:$|[?#])/i;
const IMAGE_FORMAT_QUERY_RE = /(?:^|[?&;])(?:fm|format|image_format|output)=?(?:jpe?g|png|webp|avif)\b/i;
const AUTO_FORMAT_QUERY_RE = /(?:^|[?&;])auto=format\b/i;

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
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function getDatabaseUrl() {
  return process.env.SUPABASE_DB_URL ?? process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL ?? null;
}

function getPgSslConfig(databaseUrl) {
  return databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
    ? false
    : { rejectUnauthorized: false };
}

function normalizePhotoUrl(value) {
  return typeof value === "string" ? value.trim() : "";
}

function hasValidImageUrlShape(value) {
  const url = normalizePhotoUrl(value);
  if (!url) {
    return true;
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return false;
  }

  const fullUrl = parsed.toString();
  const terminalPathSegment = decodeURIComponent(parsed.pathname.split("/").filter(Boolean).at(-1) ?? "");
  return (
    IMAGE_EXTENSION_RE.test(terminalPathSegment) ||
    IMAGE_FORMAT_QUERY_RE.test(fullUrl) ||
    AUTO_FORMAT_QUERY_RE.test(fullUrl)
  );
}

function visitStops(list, callback, stops = list.stops ?? []) {
  for (const stop of stops) {
    callback(stop, list);
    if (Array.isArray(stop.places)) {
      visitStops(list, callback, stop.places);
    }
  }
}

function collectLocalPhotoCandidates(lists) {
  const candidates = new Map();
  const conflicts = [];
  const brokenLocalUrls = [];

  for (const list of lists) {
    visitStops(list, (stop) => {
      if (!stop.poiId || !stop.photo) {
        return;
      }

      const photo = normalizePhotoUrl(stop.photo);
      if (!hasValidImageUrlShape(photo)) {
        brokenLocalUrls.push({
          poiId: stop.poiId,
          stopId: stop.id,
          guideId: list.id,
          photo,
        });
      }

      const existing = candidates.get(stop.poiId);
      if (existing && existing.photo !== photo) {
        conflicts.push({
          poiId: stop.poiId,
          firstGuideId: existing.guideId,
          firstStopId: existing.stopId,
          firstPhoto: existing.photo,
          nextGuideId: list.id,
          nextStopId: stop.id,
          nextPhoto: photo,
        });
        return;
      }

      candidates.set(stop.poiId, {
        poiId: stop.poiId,
        name: stop.name,
        guideId: list.id,
        stopId: stop.id,
        photo,
      });
    });
  }

  return { candidates, conflicts, brokenLocalUrls };
}

async function upsertEditorialPoi(client, poi, localPhoto) {
  await client.query(
    `insert into public.editorial_pois (
       id, name, country, city, neighborhood, coordinates, photo,
       guide_ids, guide_slugs, categories
     )
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     on conflict (id) do update set
       name = excluded.name,
       country = excluded.country,
       city = excluded.city,
       neighborhood = excluded.neighborhood,
       coordinates = excluded.coordinates,
       photo = coalesce(excluded.photo, public.editorial_pois.photo),
       guide_ids = excluded.guide_ids,
       guide_slugs = excluded.guide_slugs,
       categories = excluded.categories`,
    [
      poi.id,
      poi.name,
      poi.country ?? null,
      poi.city ?? null,
      poi.neighborhood ?? null,
      poi.coordinates ? JSON.stringify(poi.coordinates) : null,
      localPhoto || poi.photo || null,
      poi.guideIds ?? [],
      poi.guideSlugs ?? [],
      poi.categories ?? [],
    ],
  );
}

async function upsertVenueMedia(client, venueId, candidate) {
  if (!venueId || !candidate?.photo) {
    return null;
  }

  let { rows } = await client.query(
    `update public.venue_media
     set role = 'primary',
         source_type = coalesce(source_type, 'editorial_guides'),
         source_entity_type = coalesce(source_entity_type, 'entry_stop'),
         source_legacy_id = coalesce(source_legacy_id, $3),
         raw_metadata = raw_metadata || $4,
         is_active = true,
         updated_at = now()
     where venue_id = $1
       and source_url = $2
     returning id, storage_provider, public_url, ingestion_status`,
    [
      venueId,
      candidate.photo,
      candidate.stopId ?? null,
      JSON.stringify({
        source: "sync-editorial-poi-photos",
        guideId: candidate.guideId,
        stopId: candidate.stopId,
        poiId: candidate.poiId,
      }),
    ],
  );

  if (!rows.length) {
    ({ rows } = await client.query(
    `insert into public.venue_media (
       venue_id, url, source_url, role, source_type, source_entity_type, source_legacy_id,
       raw_metadata, sort_order
     )
     values ($1,$2,$2,'primary','editorial_guides','entry_stop',$3,$4,0)
     on conflict (venue_id, url) do update set
       role = case
         when public.venue_media.role = 'gallery' then excluded.role
         else public.venue_media.role
       end,
       source_url = coalesce(public.venue_media.source_url, excluded.source_url),
       source_type = coalesce(public.venue_media.source_type, excluded.source_type),
       source_entity_type = coalesce(public.venue_media.source_entity_type, excluded.source_entity_type),
       source_legacy_id = coalesce(public.venue_media.source_legacy_id, excluded.source_legacy_id),
       raw_metadata = public.venue_media.raw_metadata || excluded.raw_metadata,
       is_active = true,
       updated_at = now()
     returning id, storage_provider, public_url, ingestion_status`,
    [
      venueId,
      candidate.photo,
      candidate.stopId ?? null,
      JSON.stringify({
        source: "sync-editorial-poi-photos",
        guideId: candidate.guideId,
        stopId: candidate.stopId,
        poiId: candidate.poiId,
      }),
    ],
    ));
  }

  if (
    rows[0]?.storage_provider === "cloudflare_r2" &&
    rows[0]?.ingestion_status === "stored" &&
    rows[0]?.public_url
  ) {
    await client.query(
      `update public.venues
       set primary_photo_id = $2
       where id = $1
         and primary_photo_id is distinct from $2`,
      [venueId, rows[0].id],
    );
  }

  return rows[0].id;
}

async function refreshRenderCachesForEntries(client, entryIds) {
  for (const entryId of entryIds) {
    await client.query(
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
        "  jsonb_build_object('refreshed_from', 'sync-editorial-poi-photos')",
        "from public.entries entry",
        "join public.entries_maplist view on view.id = entry.id",
        "where entry.id = $1",
        "on conflict (entry_id, render_format, render_version) do update set",
        "  rendered_payload = excluded.rendered_payload,",
        "  source_hash = excluded.source_hash,",
        "  rendered_at = excluded.rendered_at,",
        "  stale_at = null,",
        "  is_current = true,",
        "  metadata = public.entry_render_cache.metadata || excluded.metadata",
      ].join(" "),
      [entryId],
    );
  }
}

function parseArgs(argv) {
  const fix = argv.includes("--fix");
  const strict = argv.includes("--strict");
  const guideArgs = argv.filter((arg) => arg !== "--fix" && arg !== "--strict");
  return { fix, strict, filters: parseEditorialGuideArgs(guideArgs) };
}

async function main() {
  loadEnvFile(path.join(ROOT, ".env.local"));
  loadEnvFile(path.join(ROOT, ".env"));

  const { fix, strict, filters } = parseArgs(process.argv.slice(2));
  const allGuides = addPoiReferencesToGuides(loadEditorialGuideLists());
  const selectedGuides = filterEditorialGuides(allGuides, filters);
  const pois = collectEditorialPois(selectedGuides);
  const poiById = new Map(pois.map((poi) => [poi.id, poi]));
  const { candidates, conflicts, brokenLocalUrls } = collectLocalPhotoCandidates(selectedGuides);

  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    throw new Error("Set SUPABASE_DB_URL, SUPABASE_DATABASE_URL, or DATABASE_URL.");
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: getPgSslConfig(databaseUrl),
  });

  const drift = [];
  const brokenSupabaseUrls = [];
  const missingSupabasePois = [];
  const updatedEntryIds = new Set();
  const stats = {
    selectedGuides: selectedGuides.length,
    localPhotoCandidates: candidates.size,
    conflicts: conflicts.length,
    brokenLocalUrls: brokenLocalUrls.length,
    brokenSupabaseUrls: 0,
    missingSupabasePois: 0,
    drift: 0,
    editorialPoisUpserted: 0,
    venueMediaUpserted: 0,
    venuePrimaryPhotosUpdated: 0,
    renderCachesRefreshed: 0,
  };

  await client.connect();
  try {
    const { rows } = await client.query("select id, photo from public.editorial_pois");
    const supabasePhotoByPoiId = new Map(rows.map((row) => [row.id, normalizePhotoUrl(row.photo)]));

    for (const [poiId, candidate] of candidates) {
      const remotePhoto = supabasePhotoByPoiId.get(poiId);
      if (remotePhoto === undefined) {
        missingSupabasePois.push({ poiId, localPhoto: candidate.photo });
        continue;
      }
      if (remotePhoto && !hasValidImageUrlShape(remotePhoto)) {
        brokenSupabaseUrls.push({ poiId, supabasePhoto: remotePhoto, localPhoto: candidate.photo });
      }
      if (remotePhoto !== candidate.photo) {
        drift.push({ poiId, supabasePhoto: remotePhoto ?? null, localPhoto: candidate.photo });
      }
    }

    stats.brokenSupabaseUrls = brokenSupabaseUrls.length;
    stats.missingSupabasePois = missingSupabasePois.length;
    stats.drift = drift.length;

    if (fix) {
      await client.query("begin");
      for (const [poiId, candidate] of candidates) {
        const poi = poiById.get(poiId);
        if (!poi || !hasValidImageUrlShape(candidate.photo)) {
          continue;
        }

        await upsertEditorialPoi(client, poi, candidate.photo);
        stats.editorialPoisUpserted += 1;

        const affectedStops = await client.query(
          `select id, entry_id, venue_id
           from public.entry_stops
           where poi_legacy_id = $1
             and venue_id is not null`,
          [poiId],
        );

        const touchedVenues = new Set();
        for (const row of affectedStops.rows) {
          if (!touchedVenues.has(row.venue_id)) {
            const mediaId = await upsertVenueMedia(client, row.venue_id, candidate);
            if (mediaId) {
              stats.venueMediaUpserted += 1;
              stats.venuePrimaryPhotosUpdated += 1;
              touchedVenues.add(row.venue_id);
            }
          }
          updatedEntryIds.add(row.entry_id);
        }
      }

      await refreshRenderCachesForEntries(client, updatedEntryIds);
      stats.renderCachesRefreshed = updatedEntryIds.size;
      await client.query("commit");
    }

    const result = {
      ok: !strict || (!conflicts.length && !brokenLocalUrls.length && !brokenSupabaseUrls.length && !drift.length),
      scope: describeEditorialGuideFilters(filters),
      fix,
      stats,
      conflicts: conflicts.slice(0, 20),
      brokenLocalUrls: brokenLocalUrls.slice(0, 20),
      brokenSupabaseUrls: brokenSupabaseUrls.slice(0, 20),
      missingSupabasePois: missingSupabasePois.slice(0, 20),
      drift: drift.slice(0, 20),
    };

    console.log(JSON.stringify(result, null, 2));

    if (!result.ok) {
      process.exitCode = 1;
    }
  } catch (error) {
    await client.query("rollback").catch(() => {});
    throw error;
  } finally {
    await client.end().catch(() => {});
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
