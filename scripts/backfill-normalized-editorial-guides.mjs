import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import pg from "pg";

import {
  addPoiReferencesToGuides,
  describeEditorialGuideFilters,
  filterEditorialGuides,
  hasEditorialGuideFilters,
  loadEditorialGuideLists,
  parseEditorialGuideArgs,
} from "./editorial-guides-data.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

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

function slugify(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeName(value) {
  return slugify(value).replace(/-/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeCoordinates(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    return null;
  }
  const lat = Number(coordinates[0]);
  const lng = Number(coordinates[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }
  return [Number(lat.toFixed(6)), Number(lng.toFixed(6))];
}

function toJson(value) {
  return value === undefined || value === null ? null : JSON.stringify(value);
}

function toJsonObject(value) {
  return JSON.stringify(value ?? {});
}

function toJsonArray(value) {
  return JSON.stringify(value ?? []);
}

function requireScopedFilters(filters) {
  if (!hasEditorialGuideFilters(filters)) {
    throw new Error("Refusing to backfill all normalized editorial guides. Pass --city, --neighborhood, --id, or --slug.");
  }
}

async function loadDestinationMaps(client) {
  const { rows } = await client.query(
    "select id, scope, name, slug, parent_id, country_name, city_name, legacy_id from public.destinations",
  );
  const cityByName = new Map();
  const countryByName = new Map();
  const neighborhoodsByCity = new Map();

  for (const row of rows) {
    if (row.scope === "country") {
      countryByName.set(normalizeName(row.name), row.id);
    }
    if (row.scope === "city") {
      cityByName.set(`${normalizeName(row.name)}|${normalizeName(row.country_name)}`, row.id);
    }
    if (row.scope === "neighborhood" && row.parent_id) {
      const items = neighborhoodsByCity.get(row.parent_id) ?? new Map();
      items.set(normalizeName(row.name), row.id);
      if (row.legacy_id) {
        items.set(normalizeName(row.legacy_id.split("::").at(-1)), row.id);
      }
      neighborhoodsByCity.set(row.parent_id, items);
    }
  }

  return { cityByName, countryByName, neighborhoodsByCity };
}

function resolveCityId(maps, city, country) {
  if (!city) {
    return null;
  }
  return maps.cityByName.get(`${normalizeName(city)}|${normalizeName(country)}`) ?? null;
}

function resolveNeighborhoodId(maps, cityId, neighborhood) {
  if (!cityId || !neighborhood) {
    return null;
  }
  const neighborhoods = maps.neighborhoodsByCity.get(cityId);
  return neighborhoods?.get(normalizeName(neighborhood)) ?? null;
}

async function upsertSource(client, source, stats) {
  if (!source?.url) {
    return null;
  }
  const name = source.name?.trim() || source.url;
  const { rows } = await client.query(
    `insert into public.sources (name, url, publisher, source_type, sourced_at, raw_metadata)
     values ($1, $2, $3, $4, now(), '{}'::jsonb)
     on conflict (url) do update set
       name = coalesce(excluded.name, public.sources.name),
       publisher = coalesce(excluded.publisher, public.sources.publisher),
       source_type = coalesce(excluded.source_type, public.sources.source_type),
       sourced_at = greatest(public.sources.sourced_at, excluded.sourced_at)
     returning id`,
    [name, source.url, source.publisher ?? null, source.sourceType ?? source.source_type ?? null],
  );
  stats.sources += 1;
  return rows[0].id;
}

async function linkSource(client, entityType, entityId, sourceId, relationship = "reference") {
  if (!entityId || !sourceId) {
    return;
  }
  await client.query(
    `insert into public.entity_sources (entity_type, entity_id, source_id, relationship)
     values ($1, $2, $3, $4)
     on conflict (entity_type, entity_id, source_id, relationship) do update set sourced_at = excluded.sourced_at`,
    [entityType, entityId, sourceId, relationship],
  );
}

async function upsertVenue(client, input, stats) {
  const name = input.name?.trim();
  if (!name) {
    return null;
  }
  const slug = input.slug || slugify(name);
  const normalizedName = normalizeName(name);
  const { rows } = await client.query(
    `insert into public.venues (
       legacy_id, slug, name, normalized_name, aliases, destination_id, city_id,
       neighborhood_id, country, coordinates, official_url, source_metadata
     )
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     on conflict (city_id, slug) do update set
       legacy_id = coalesce(public.venues.legacy_id, excluded.legacy_id),
       slug = excluded.slug,
       name = excluded.name,
       aliases = array(select distinct unnest(public.venues.aliases || excluded.aliases)),
       destination_id = coalesce(excluded.destination_id, public.venues.destination_id),
       neighborhood_id = coalesce(excluded.neighborhood_id, public.venues.neighborhood_id),
       coordinates = coalesce(excluded.coordinates, public.venues.coordinates),
       official_url = coalesce(excluded.official_url, public.venues.official_url),
       source_metadata = public.venues.source_metadata || excluded.source_metadata
     returning id`,
    [
      input.legacyId ?? null,
      slug,
      name,
      normalizedName,
      input.aliases ?? [],
      input.destinationId ?? input.cityId ?? null,
      input.cityId ?? null,
      input.neighborhoodId ?? null,
      input.country ?? null,
      toJson(normalizeCoordinates(input.coordinates)),
      input.officialUrl ?? null,
      toJsonObject(input.sourceMetadata),
    ],
  );
  stats.venues += 1;
  return rows[0].id;
}

async function upsertEntry(client, list, context, stats) {
  const { rows } = await client.query(
    `insert into public.entries (
       legacy_id, slug, seo_slug, seo_title, seo_description, title, description,
       highlights, photo_url, canonical_url, category, submission_type, status,
       destination_id, city_id, neighborhood_id, country_name, continent_name,
       creator_id, creator_name, creator_avatar, upvotes, created_on,
       source_table, metadata
     )
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'published',$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)
     on conflict (legacy_id) do update set
       slug = excluded.slug,
       seo_slug = excluded.seo_slug,
       seo_title = excluded.seo_title,
       seo_description = excluded.seo_description,
       title = excluded.title,
       description = excluded.description,
       highlights = excluded.highlights,
       photo_url = excluded.photo_url,
       canonical_url = excluded.canonical_url,
       category = excluded.category,
       submission_type = excluded.submission_type,
       status = excluded.status,
       destination_id = excluded.destination_id,
       city_id = excluded.city_id,
       neighborhood_id = excluded.neighborhood_id,
       country_name = excluded.country_name,
       continent_name = excluded.continent_name,
       creator_id = excluded.creator_id,
       creator_name = excluded.creator_name,
       creator_avatar = excluded.creator_avatar,
       upvotes = excluded.upvotes,
       created_on = excluded.created_on,
       source_table = excluded.source_table,
       metadata = public.entries.metadata || excluded.metadata
     returning id`,
    [
      list.id,
      list.slug,
      list.seoSlug ?? null,
      list.seoTitle ?? null,
      list.seoDescription ?? null,
      list.title,
      list.description,
      list.highlights ?? [],
      list.photo ?? null,
      list.url ?? null,
      list.category,
      list.submissionType ?? "guide",
      context.destinationId ?? null,
      context.cityId ?? null,
      context.neighborhoodId ?? null,
      list.location?.country ?? null,
      list.location?.continent ?? null,
      list.creator?.id ?? null,
      list.creator?.name ?? null,
      list.creator?.avatar ?? null,
      list.upvotes ?? 0,
      list.createdAt ?? new Date().toISOString().slice(0, 10),
      "editorial_guides",
      toJsonObject({ editorialGuideId: list.id }),
    ],
  );
  stats.entries += 1;
  return rows[0].id;
}

async function replaceEntryStops(client, entryId, list, context, stats) {
  await client.query("delete from public.entry_stops where entry_id = $1", [entryId]);
  let order = 0;
  for (const stop of list.stops ?? []) {
    order += 1;
    const venueId = await upsertVenue(client, {
      legacyId: stop.poiId ?? `${list.id}:${stop.id}`,
      slug: stop.poiId ? slugify(stop.poiId) : slugify(stop.name),
      name: stop.name,
      cityId: context.cityId,
      neighborhoodId: context.neighborhoodId,
      country: list.location?.country,
      coordinates: stop.coordinates,
      officialUrl: stop.officialUrl ?? stop.bookingUrl,
      sourceMetadata: { source: "editorial_guides", entryId: list.id, stopId: stop.id },
    }, stats);
    await client.query(
      `insert into public.entry_stops (
         entry_id, legacy_id, stop_order, poi_legacy_id, name, description, category,
         destination_id, venue_id, coordinates, photo_url, price_label, price_source,
         booking_url, official_url, hours, places, metadata
       )
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
      [
        entryId,
        stop.id,
        order,
        stop.poiId ?? null,
        stop.name,
        stop.description,
        stop.category ?? list.category,
        context.neighborhoodId ?? context.cityId ?? null,
        venueId,
        toJson(normalizeCoordinates(stop.coordinates)),
        stop.photo ?? null,
        stop.price ?? null,
        stop.priceSource ?? null,
        stop.bookingUrl ?? null,
        stop.officialUrl ?? null,
        toJson(stop.hours),
        toJsonArray(stop.places),
        toJsonObject({ source: "editorial_guides" }),
      ],
    );
    stats.entryStops += 1;
  }
}

async function refreshEntryRenderCache(client, entryId) {
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
      "  jsonb_build_object('refreshed_from', 'backfill-normalized-editorial-guides')",
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

async function backfillGuide(client, maps, list, stats) {
  const cityId = resolveCityId(maps, list.location?.city, list.location?.country);
  const countryId = list.location?.country ? maps.countryByName.get(normalizeName(list.location.country)) ?? null : null;
  const neighborhoodId = resolveNeighborhoodId(maps, cityId, list.location?.neighborhood);
  const destinationId = neighborhoodId ?? cityId ?? countryId;
  if (!destinationId) {
    throw new Error(`Could not resolve destination for ${list.id}`);
  }
  const entryId = await upsertEntry(client, list, { cityId, neighborhoodId, destinationId }, stats);
  await replaceEntryStops(client, entryId, list, { cityId, neighborhoodId }, stats);
  for (const source of list.sources ?? []) {
    const sourceId = await upsertSource(client, source, stats);
    await linkSource(client, "entry", entryId, sourceId);
  }
  await refreshEntryRenderCache(client, entryId);
}

async function main() {
  loadEnvFile(path.join(ROOT, ".env.local"));
  loadEnvFile(path.join(ROOT, ".env"));

  const filters = parseEditorialGuideArgs(process.argv.slice(2));
  requireScopedFilters(filters);

  const databaseUrl = process.env.SUPABASE_DB_URL ?? process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("Set SUPABASE_DB_URL, SUPABASE_DATABASE_URL, or DATABASE_URL.");
  }

  const allGuides = addPoiReferencesToGuides(loadEditorialGuideLists());
  const selectedGuides = filterEditorialGuides(allGuides, filters);
  if (!selectedGuides.length) {
    throw new Error(`No editorial guides matched ${describeEditorialGuideFilters(filters)}.`);
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1") ? false : { rejectUnauthorized: false },
  });
  const stats = { entries: 0, entryStops: 0, venues: 0, sources: 0 };

  await client.connect();
  try {
    await client.query("begin");
    const maps = await loadDestinationMaps(client);
    for (const list of selectedGuides) {
      await backfillGuide(client, maps, list, stats);
    }
    await client.query("commit");
    console.log(JSON.stringify({ ok: true, scope: describeEditorialGuideFilters(filters), selectedGuides: selectedGuides.length, stats }, null, 2));
  } catch (error) {
    await client.query("rollback").catch(() => {});
    console.error("NORMALIZED_EDITORIAL_GUIDES_BACKFILL_FAILED");
    console.error(error instanceof Error ? error.stack || error.message : error);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}

main();
