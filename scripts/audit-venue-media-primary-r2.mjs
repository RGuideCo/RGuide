import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import pg from "pg";

import { addPoiReferencesToGuides, loadEditorialGuideLists } from "./editorial-guides-data.mjs";

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

function normalizeName(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeUrl(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    url.hash = "";
    url.hostname = url.hostname.toLowerCase();
    if ((url.protocol === "https:" && url.port === "443") || (url.protocol === "http:" && url.port === "80")) {
      url.port = "";
    }
    return url.toString();
  } catch {
    return raw;
  }
}

function normalizeWikimediaFilename(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    const parts = url.pathname.split("/").filter(Boolean).map((part) => decodeURIComponent(part));
    let filename = null;

    if (host === "commons.wikimedia.org") {
      const filePart = parts.find((part) => part.startsWith("File:"));
      if (filePart) filename = filePart.slice("File:".length);
      const filePathIndex = parts.findIndex((part) => part === "Special:FilePath" || part === "FilePath" || part === "file");
      if (!filename && filePathIndex >= 0) filename = parts[filePathIndex + 1] ?? null;
    }

    if (host === "upload.wikimedia.org") {
      const commonsIndex = parts.findIndex((part) => part === "commons");
      if (commonsIndex >= 0) {
        if (parts[commonsIndex + 1] === "thumb") {
          filename = parts.at(-2) ?? null;
        } else {
          filename = parts.at(-1) ?? null;
        }
      }
    }

    if (!filename) return null;
    return filename
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/_/g, " ")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  } catch {
    return null;
  }
}

function sourceKeys(value) {
  const keys = new Set();
  const normalized = normalizeUrl(value);
  if (normalized) keys.add(normalized);
  const wikimediaFilename = normalizeWikimediaFilename(value);
  if (wikimediaFilename) keys.add(`wikimedia:${wikimediaFilename}`);
  return keys;
}

function venueKey(country, city, name) {
  return [country, city, name].map(normalizeName).join("|");
}

function parseArgs(argv) {
  const options = {
    city: null,
    json: false,
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
    else if (arg === "--json") options.json = true;
    else throw new Error(`Unknown option: ${arg}`);
  }

  return options;
}

function getDatabaseUrl() {
  return process.env.SUPABASE_DB_URL ?? process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL ?? null;
}

function getPgSslConfig(databaseUrl) {
  return databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
    ? false
    : { rejectUnauthorized: false };
}

function addIntent(intents, list, stop) {
  const photo = normalizeUrl(stop.photo);
  if (!photo) return;
  const key = venueKey(list.location?.country, list.location?.city, stop.name);
  const existing = intents.get(key) ?? {
    country: list.location?.country ?? null,
    city: list.location?.city ?? null,
    name: stop.name,
    urls: new Set(),
    guides: new Set(),
  };
  existing.urls.add(photo);
  existing.guides.add(list.slug ?? list.id);
  intents.set(key, existing);
}

function visitStops(list, callback, stops = list.stops ?? []) {
  for (const stop of stops) {
    callback(stop, list);
    if (Array.isArray(stop.places)) visitStops(list, callback, stop.places);
  }
}

function loadContentIntents(options) {
  const guides = addPoiReferencesToGuides(loadEditorialGuideLists());
  const intents = new Map();
  for (const list of guides) {
    if (options.city && normalizeName(list.location?.city) !== normalizeName(options.city)) continue;
    visitStops(list, (stop) => addIntent(intents, list, stop));
  }
  return intents;
}

async function loadDuplicateRows(client, options, publicBaseUrl) {
  const values = [`${publicBaseUrl.replace(/\/$/, "")}/%`];
  const conditions = ["true"];
  if (options.city) {
    values.push(options.city);
    conditions.push(`city.name ilike $${values.length}`);
  }

  const { rows } = await client.query(
    `with active_primary_r2 as (
       select
         venue.id as venue_id,
         venue.name as venue_name,
         city.name as city_name,
         city.country_name,
         venue.primary_photo_id,
         media.id as media_id,
         media.source_url,
         media.public_url,
         media.ingested_at,
         media.updated_at
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
     ),
     duplicate_venues as (
       select venue_id
       from active_primary_r2
       group by venue_id
       having count(*) > 1
     )
     select *
     from active_primary_r2
     where venue_id in (select venue_id from duplicate_venues)
     order by country_name, city_name, venue_name, ingested_at desc nulls last, updated_at desc nulls last`,
    values,
  );

  const grouped = new Map();
  for (const row of rows) {
    const group = grouped.get(row.venue_id) ?? {
      venueId: row.venue_id,
      venueName: row.venue_name,
      cityName: row.city_name,
      countryName: row.country_name,
      primaryPhotoId: row.primary_photo_id,
      media: [],
    };
    group.media.push({
      id: row.media_id,
      sourceUrl: normalizeUrl(row.source_url),
      publicUrl: row.public_url,
      isCurrentPrimaryPointer: row.media_id === row.primary_photo_id,
    });
    grouped.set(row.venue_id, group);
  }
  return [...grouped.values()];
}

function classifyDuplicate(group, intents) {
  const intent = intents.get(venueKey(group.countryName, group.cityName, group.venueName));
  const intendedUrls = [...(intent?.urls ?? [])];
  const intendedKeys = new Set(intendedUrls.flatMap((url) => [...sourceKeys(url)]));
  const matchingRows = group.media.filter((media) => {
    const mediaKeys = sourceKeys(media.sourceUrl);
    return [...mediaKeys].some((key) => intendedKeys.has(key));
  });
  const pointedRow = group.media.find((media) => media.isCurrentPrimaryPointer) ?? null;

  let status = "no_content_photo_match";
  if (intendedUrls.length > 1) status = "ambiguous_content_sources";
  else if (matchingRows.length === 1) {
    status = matchingRows[0].isCurrentPrimaryPointer ? "safe_current_primary_matches_content" : "safe_needs_primary_switch";
  } else if (matchingRows.length > 1) {
    status = "ambiguous_duplicate_source_match";
  }

  return {
    ...group,
    status,
    intendedUrls,
    guideSlugs: [...(intent?.guides ?? [])],
    matchingMediaIds: matchingRows.map((media) => media.id),
    currentPrimaryMediaId: pointedRow?.id ?? null,
  };
}

async function main() {
  loadEnvFile(path.join(ROOT, ".env.local"));
  loadEnvFile(path.join(ROOT, ".env"));

  const options = parseArgs(process.argv.slice(2));
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) throw new Error("Set SUPABASE_DB_URL, SUPABASE_DATABASE_URL, or DATABASE_URL.");
  const publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL?.trim() || "https://media.rguide.co";

  const intents = loadContentIntents(options);
  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: getPgSslConfig(databaseUrl),
  });

  await client.connect();
  try {
    const groups = await loadDuplicateRows(client, options, publicBaseUrl);
    const classified = groups.map((group) => classifyDuplicate(group, intents));
    const summary = classified.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1;
      return acc;
    }, {});

    const report = {
      ok: true,
      scope: options.city ? `city: ${options.city}` : "all",
      duplicateVenues: classified.length,
      summary,
      reviewNeeded: classified
        .filter((item) => !item.status.startsWith("safe_"))
        .slice(0, 30)
        .map((item) => ({
          venue: item.venueName,
          city: item.cityName,
          country: item.countryName,
          status: item.status,
          intendedUrls: item.intendedUrls,
          media: item.media.map((media) => ({
            id: media.id,
            sourceUrl: media.sourceUrl,
            publicUrl: media.publicUrl,
            isCurrentPrimaryPointer: media.isCurrentPrimaryPointer,
          })),
        })),
    };

    console.log(JSON.stringify(options.json ? { ...report, venues: classified } : report, null, 2));
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
