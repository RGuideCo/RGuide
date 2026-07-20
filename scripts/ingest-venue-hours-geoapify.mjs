import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import pg from "pg";
import { getPgSslConfig } from "./database-ssl.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DAY_CODES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const CITY_TIMEZONE_FALLBACKS = new Map([
  ["tokyo", "Asia/Tokyo"],
]);
const DAY_INDEX = new Map([
  ["Su", 0],
  ["Mo", 1],
  ["Tu", 2],
  ["We", 3],
  ["Th", 4],
  ["Fr", 5],
  ["Sa", 6],
]);

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
  const args = { city: "paris", dryRun: false, limit: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--city") args.city = slugify(argv[++index] ?? args.city);
    else if (arg === "--limit") args.limit = Number(argv[++index] ?? 0) || null;
  }
  return args;
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

function fallbackCityTimezone(citySlug) {
  return CITY_TIMEZONE_FALLBACKS.get(slugify(citySlug)) ?? null;
}

function normalizeName(value) {
  return slugify(value)
    .replace(/\b(l|le|la|les|de|du|des|d|the|and|hotel|bar|restaurant|cafe|café|musee|museum|jardin|square|paris)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSet(value) {
  return new Set(normalizeName(value).split(/[-\s]+/).filter((token) => token.length > 2));
}

function scoreCandidate(venueName, candidateName, distance) {
  if (!candidateName || distance > 180) return 0;
  const venueNorm = normalizeName(venueName);
  const candidateNorm = normalizeName(candidateName);
  if (!venueNorm || !candidateNorm) return 0;
  if (venueNorm.length < 3 || candidateNorm.length < 3) return 0;
  if (candidateNorm === venueNorm) return 1;
  if (
    venueNorm.length >= 4 &&
    candidateNorm.length >= 4 &&
    (candidateNorm.includes(venueNorm) || venueNorm.includes(candidateNorm))
  ) {
    return distance <= 120 ? 0.92 : 0.75;
  }

  const venueTokens = tokenSet(venueName);
  const candidateTokens = tokenSet(candidateName);
  if (!venueTokens.size || !candidateTokens.size) return 0;
  const overlap = [...venueTokens].filter((token) => candidateTokens.has(token)).length;
  const ratio = overlap / Math.max(venueTokens.size, candidateTokens.size);
  if (ratio >= 0.67 && distance <= 120) return 0.82;
  if (ratio >= 0.5 && distance <= 75) return 0.72;
  return 0;
}

function expandDays(dayExpr) {
  const days = new Set();
  for (const part of dayExpr.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const [start, end] = trimmed.split("-").map((value) => value.trim());
    const startIndex = DAY_INDEX.get(start);
    const endIndex = DAY_INDEX.get(end);
    if (startIndex === undefined) continue;
    if (endIndex === undefined) {
      days.add(startIndex);
      continue;
    }
    let current = startIndex;
    while (true) {
      days.add(current);
      if (current === endIndex) break;
      current = (current + 1) % 7;
    }
  }
  return [...days];
}

function normalizeTimeText(value) {
  return value
    .replace(/\b24:00\b/g, "00:00")
    .replace(/\s+/g, " ")
    .trim();
}

function parseOpeningHours(rawText) {
  const days = new Map();
  const normalizedRawText = String(rawText ?? "").trim();
  if (!normalizedRawText) return { note: null, intervals: [] };
  if (/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b|\[|\]/i.test(normalizedRawText)) {
    return { note: normalizedRawText, intervals: [] };
  }
  if (/^(24\/7|Mo-Su 00:00-24:00)$/i.test(normalizedRawText)) {
    return {
      note: "24 hours daily",
      intervals: DAY_CODES.map((_, dayOfWeek) => ({ dayOfWeek, rawText: "24 hours" })),
    };
  }

  if (/^\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}(?:\s*,\s*\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2})*$/.test(normalizedRawText)) {
    return {
      note: normalizedRawText,
      intervals: DAY_CODES.map((_, dayOfWeek) => ({ dayOfWeek, rawText: normalizeTimeText(normalizedRawText) })),
    };
  }

  for (const segment of normalizedRawText.split(";")) {
    const trimmed = segment.trim().replace(/,\s*PH\b/gi, "").replace(/\bPH,\s*/gi, "");
    if (!trimmed || /\bPH\b/i.test(trimmed)) continue;
    const match = trimmed.match(/^((?:Mo|Tu|We|Th|Fr|Sa|Su)(?:\s*-\s*(?:Mo|Tu|We|Th|Fr|Sa|Su))?(?:\s*,\s*(?:Mo|Tu|We|Th|Fr|Sa|Su)(?:\s*-\s*(?:Mo|Tu|We|Th|Fr|Sa|Su))?)*)\s+(.+)$/);
    if (!match) continue;
    const dayNumbers = expandDays(match[1].replace(/\s+/g, ""));
    let hoursText = normalizeTimeText(match[2]);
    if (/^(off|closed)$/i.test(hoursText)) hoursText = "Closed";
    for (const dayOfWeek of dayNumbers) {
      const existing = days.get(dayOfWeek);
      days.set(dayOfWeek, existing ? `${existing}; ${hoursText}` : hoursText);
    }
  }

  return {
    note: normalizedRawText,
    intervals: [...days.entries()].map(([dayOfWeek, rawText]) => ({ dayOfWeek, rawText })),
  };
}

function getDatabaseUrl() {
  return process.env.SUPABASE_DB_URL ?? process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL ?? null;
}

async function getParisVenues(client, citySlug, limit) {
  const fallbackTimezone = fallbackCityTimezone(citySlug);
  const { rows } = await client.query(
    `
      with city as (
        select id
        from public.destinations
        where scope = 'city'::public.destination_scope
          and slug = $1
        limit 1
      ),
      city_entries as (
        select id
        from public.entries
        where city_id = (select id from city)
          and status = 'published'::public.rguide_entry_status
      )
      select
        venue.id,
        venue.name,
        venue.slug,
        venue.coordinates,
        venue.official_url,
        venue.venue_kind,
        coalesce((select timezone from city), $${limit ? "3" : "2"}) as city_timezone,
        count(distinct stop.entry_id)::int as guide_count
      from public.entry_stops stop
      join city_entries entry on entry.id = stop.entry_id
      join public.venues venue on venue.id = stop.venue_id
      where venue.coordinates is not null
      group by venue.id
      order by guide_count desc, venue.name
      ${limit ? "limit $2" : ""}
    `,
    limit ? [citySlug, limit, fallbackTimezone] : [citySlug, fallbackTimezone],
  );
  return rows;
}

function categoriesForVenue(venue) {
  if (venue.venue_kind === "lodging") return "accommodation.hotel,accommodation.hostel";
  if (venue.venue_kind === "nightlife") return "catering.bar,entertainment";
  if (venue.venue_kind === "food_drink") return "catering.restaurant,catering.cafe,catering.fast_food,catering.bar";
  if (venue.venue_kind === "outdoors") return "leisure.park,tourism.attraction,natural";
  if (venue.venue_kind === "culture" || venue.venue_kind === "landmark") return "tourism.sights,entertainment.museum,building.historic";
  return "catering,tourism,entertainment,accommodation,leisure";
}

async function findOpeningHours(apiKey, venue) {
  const [lat, lng] = Array.isArray(venue.coordinates) ? venue.coordinates.map(Number) : [];
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const url = new URL("https://api.geoapify.com/v2/places");
  url.searchParams.set("categories", categoriesForVenue(venue));
  url.searchParams.set("name", venue.name);
  url.searchParams.set("filter", `circle:${lng},${lat},180`);
  url.searchParams.set("bias", `proximity:${lng},${lat}`);
  url.searchParams.set("limit", "20");
  url.searchParams.set("apiKey", apiKey);

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Geoapify HTTP ${response.status} for ${venue.name}`);
  const json = await response.json();
  const candidates = (json.features ?? [])
    .map((feature) => {
      const properties = feature.properties ?? {};
      const rawOpeningHours = properties.opening_hours ?? properties.datasource?.raw?.opening_hours;
      const name = properties.name ?? properties.datasource?.raw?.name;
      const distance = Number(properties.distance ?? 9999);
      const confidence = scoreCandidate(venue.name, name, distance);
      return { feature, name, distance, rawOpeningHours, confidence };
    })
    .filter((candidate) => candidate.rawOpeningHours && candidate.confidence >= 0.82)
    .sort((left, right) => right.confidence - left.confidence || left.distance - right.distance);

  return candidates[0] ?? null;
}

async function upsertSource(client) {
  const { rows } = await client.query(
    `
      insert into public.sources (name, url, publisher, source_type, sourced_at, raw_metadata)
      values (
        'Geoapify Places API / OpenStreetMap opening_hours',
        'https://www.geoapify.com/places-api/',
        'Geoapify / OpenStreetMap contributors',
        'venue_hours',
        now(),
        jsonb_build_object('license', 'Open Database License', 'source', 'geoapify_places_api')
      )
      on conflict (url) do update set
        name = excluded.name,
        publisher = excluded.publisher,
        source_type = excluded.source_type,
        sourced_at = now(),
        raw_metadata = public.sources.raw_metadata || excluded.raw_metadata,
        updated_at = now()
      returning id
    `,
  );
  return rows[0].id;
}

async function upsertVenueHours(client, sourceId, venue, candidate) {
  const parsed = parseOpeningHours(candidate.rawOpeningHours);
  if (!parsed.intervals.length) return { skippedUnparsed: true, noteOnly: false, intervals: 0 };

  await client.query(
    `
      update public.venues
      set hours_note = $2,
          hours_last_verified_at = now(),
          timezone = coalesce($3, timezone, 'UTC'),
          operating_status = case when operating_status = 'unknown'::public.venue_operating_status then 'open'::public.venue_operating_status else operating_status end,
          updated_at = now()
      where id = $1
    `,
    [venue.id, parsed.note, venue.city_timezone],
  );

  const rows = parsed.intervals.map((interval, index) => ({
    venue_id: venue.id,
    day_of_week: interval.dayOfWeek,
    interval_order: 0,
    is_closed: interval.rawText.toLowerCase() === "closed",
    is_24_hours: /^(24 hours|24\/7)$/i.test(interval.rawText),
    raw_text: interval.rawText,
    raw_metadata: {
      source: "geoapify_places_api",
      upstreamSource: "openstreetmap",
      osmName: candidate.name,
      osmDistanceMeters: candidate.distance,
      confidence: candidate.confidence,
      originalOpeningHours: candidate.rawOpeningHours,
      intervalIndex: index,
    },
  }));

  const result = await client.query(
    `
      with incoming as (
        select *
        from jsonb_to_recordset($1::jsonb) as row(
          venue_id uuid,
          day_of_week smallint,
          interval_order integer,
          is_closed boolean,
          is_24_hours boolean,
          raw_text text,
          raw_metadata jsonb
        )
      )
      insert into public.venue_hours (
        venue_id,
        day_of_week,
        interval_order,
        is_closed,
        is_24_hours,
        raw_text,
        raw_metadata,
        source_id,
        confidence,
        last_verified_at
      )
      select
        venue_id,
        day_of_week,
        interval_order,
        is_closed,
        is_24_hours,
        raw_text,
        raw_metadata,
        $2,
        coalesce((raw_metadata->>'confidence')::numeric, 0.75),
        now()
      from incoming
      on conflict (venue_id, day_of_week, interval_order, valid_from) do update set
        is_closed = excluded.is_closed,
        is_24_hours = excluded.is_24_hours,
        raw_text = excluded.raw_text,
        raw_metadata = public.venue_hours.raw_metadata || excluded.raw_metadata,
        source_id = excluded.source_id,
        confidence = excluded.confidence,
        last_verified_at = excluded.last_verified_at,
        updated_at = now()
    `,
    [JSON.stringify(rows), sourceId],
  );
  return { noteOnly: false, intervals: result.rowCount ?? 0 };
}

async function refreshCityRenderCache(client, citySlug) {
  const result = await client.query(
    `
      with city as (
        select id
        from public.destinations
        where scope = 'city'::public.destination_scope
          and slug = $1
        limit 1
      ),
      city_entries as (
        select id
        from public.entries
        where city_id = (select id from city)
          and status = 'published'::public.rguide_entry_status
      )
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
        jsonb_build_object('refreshed_from', 'venue_hours_geoapify_ingest', 'city', $1)
      from city_entries entry
      join public.entries_maplist view on view.id = entry.id
      on conflict (entry_id, render_format, render_version) do update set
        rendered_payload = excluded.rendered_payload,
        source_hash = excluded.source_hash,
        rendered_at = excluded.rendered_at,
        stale_at = null,
        is_current = true,
        metadata = public.entry_render_cache.metadata || excluded.metadata
    `,
    [citySlug],
  );
  return result.rowCount ?? 0;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  loadEnvFile(path.join(ROOT, ".env.local"));
  loadEnvFile(path.join(ROOT, ".env"));

  const databaseUrl = getDatabaseUrl();
  const geoapifyKey = process.env.GEOAPIFY_API_KEY;
  if (!databaseUrl) throw new Error("Set SUPABASE_DB_URL, SUPABASE_DATABASE_URL, or DATABASE_URL.");
  if (!geoapifyKey) throw new Error("Set GEOAPIFY_API_KEY.");

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: getPgSslConfig(databaseUrl),
  });
  await client.connect();

  const stats = { checked: 0, matched: 0, skipped: 0, unparsed: 0, noteOnly: 0, intervals: 0 };
  const matches = [];
  try {
    const venues = await getParisVenues(client, args.city, args.limit);
    const sourceId = args.dryRun ? null : await upsertSource(client);
    for (const venue of venues) {
      stats.checked += 1;
      const candidate = await findOpeningHours(geoapifyKey, venue);
      if (!candidate) {
        stats.skipped += 1;
        continue;
      }
      const parsed = parseOpeningHours(candidate.rawOpeningHours);
      if (!parsed.intervals.length) {
        stats.unparsed += 1;
        stats.skipped += 1;
        continue;
      }
      matches.push({
        venue: venue.name,
        matchedName: candidate.name,
        distance: candidate.distance,
        confidence: candidate.confidence,
        openingHours: candidate.rawOpeningHours,
        parsedDays: parsed.intervals.length,
      });
      stats.matched += 1;
      if (args.dryRun) continue;
      const result = await upsertVenueHours(client, sourceId, venue, candidate);
      if (result.skippedUnparsed) {
        stats.unparsed += 1;
        continue;
      }
      stats.intervals += result.intervals;
      if (result.noteOnly) stats.noteOnly += 1;
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    const refreshedCaches = args.dryRun ? 0 : await refreshCityRenderCache(client, args.city);
    console.log(JSON.stringify({ ok: true, dryRun: args.dryRun, city: args.city, stats, refreshedCaches, matches }, null, 2));
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exitCode = 1;
});
