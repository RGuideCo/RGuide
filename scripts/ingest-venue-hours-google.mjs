import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import pg from "pg";
import { getPgSslConfig } from "./database-ssl.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GOOGLE_DETAILS_SKU = "places_api_place_details_enterprise";
const GOOGLE_TEXT_SEARCH_SKU = "places_api_text_search";
const DAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_ALIASES = new Map(DAY_KEYS.map((day, index) => [day, index]));

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
  const args = {
    city: null,
    dryRun: false,
    planOnly: false,
    limit: 25,
    allowSearch: true,
    force: false,
    dailyLimit: numberFromEnv("GOOGLE_PLACES_DAILY_LIMIT", 25),
    monthlyLimit: numberFromEnv("GOOGLE_PLACES_MONTHLY_LIMIT", 750),
    searchDailyLimit: numberFromEnv("GOOGLE_PLACES_SEARCH_DAILY_LIMIT", null),
    searchMonthlyLimit: numberFromEnv("GOOGLE_PLACES_SEARCH_MONTHLY_LIMIT", null),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--city") args.city = slugify(argv[++index] ?? "");
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--plan-only") args.planOnly = true;
    else if (arg === "--limit") args.limit = Math.max(0, Number(argv[++index] ?? 0) || 0);
    else if (arg === "--no-search") args.allowSearch = false;
    else if (arg === "--force") args.force = true;
    else if (arg === "--daily-limit") args.dailyLimit = Math.max(0, Number(argv[++index] ?? 0) || 0);
    else if (arg === "--monthly-limit") args.monthlyLimit = Math.max(0, Number(argv[++index] ?? 0) || 0);
    else if (arg === "--search-daily-limit") args.searchDailyLimit = Math.max(0, Number(argv[++index] ?? 0) || 0);
    else if (arg === "--search-monthly-limit") args.searchMonthlyLimit = Math.max(0, Number(argv[++index] ?? 0) || 0);
    else if (!arg.startsWith("--") && !args.city) args.city = slugify(arg);
  }

  args.searchDailyLimit ??= args.dailyLimit;
  args.searchMonthlyLimit ??= args.monthlyLimit;
  return args;
}

function numberFromEnv(key, fallback) {
  const value = process.env[key];
  if (value === undefined || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
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
  return slugify(value)
    .replace(/\b(l|le|la|les|de|du|des|d|the|and|hotel|hostel|bar|restaurant|cafe|café|museum)\b/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSet(value) {
  return new Set(normalizeName(value).split(/\s+/).filter((token) => token.length > 2));
}

function distanceMeters(left, right) {
  if (!left || !right) return Number.POSITIVE_INFINITY;
  const lat1 = Number(left.latitude ?? left.lat ?? left[0]);
  const lon1 = Number(left.longitude ?? left.lng ?? left.lon ?? left[1]);
  const lat2 = Number(right.latitude ?? right.lat ?? right[0]);
  const lon2 = Number(right.longitude ?? right.lng ?? right.lon ?? right[1]);
  if (![lat1, lon1, lat2, lon2].every(Number.isFinite)) return Number.POSITIVE_INFINITY;

  const radius = 6371000;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const dPhi = ((lat2 - lat1) * Math.PI) / 180;
  const dLambda = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function scoreCandidate(venue, place) {
  const displayName = place.displayName?.text ?? "";
  const venueNorm = normalizeName(venue.name);
  const placeNorm = normalizeName(displayName);
  if (!venueNorm || !placeNorm) return 0;

  const distance = distanceMeters(coordinatesToPoint(venue.coordinates), place.location);
  if (venueNorm === placeNorm && distance <= 250) return 0.98;
  if ((placeNorm.includes(venueNorm) || venueNorm.includes(placeNorm)) && distance <= 250) return 0.9;

  const venueTokens = tokenSet(venue.name);
  const placeTokens = tokenSet(displayName);
  if (!venueTokens.size || !placeTokens.size) return 0;
  const overlap = [...venueTokens].filter((token) => placeTokens.has(token)).length;
  const ratio = overlap / Math.max(venueTokens.size, placeTokens.size);
  if (ratio >= 0.75 && distance <= 250) return 0.86;
  if (ratio >= 0.5 && distance <= 120) return 0.74;
  return 0;
}

function coordinatesToPoint(value) {
  if (!Array.isArray(value)) return null;
  const latitude = Number(value[0]);
  const longitude = Number(value[1]);
  return Number.isFinite(latitude) && Number.isFinite(longitude) ? { latitude, longitude } : null;
}

function getDatabaseUrl() {
  return process.env.SUPABASE_DB_URL ?? process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL ?? null;
}

function enabledGoogleHours(args) {
  return args.force || String(process.env.GOOGLE_PLACES_HOURS_ENABLED ?? "").toLowerCase() === "true";
}

async function ensureUsageLedger(client) {
  const { rows } = await client.query("select to_regclass('public.external_api_usage_events') as table_name");
  if (!rows[0]?.table_name) {
    throw new Error("Missing public.external_api_usage_events. Apply supabase/20260702_google_places_hours_usage.sql before running Google hours ingestion.");
  }
}

async function usageCount(client, sku, windowName) {
  const windowExpression = windowName === "month" ? "date_trunc('month', now())" : "date_trunc('day', now())";
  const { rows } = await client.query(
    `
      select coalesce(sum(billable_units), 0)::int as calls
      from public.external_api_usage_events
      where provider = 'google'
        and sku = $1
        and created_at >= ${windowExpression}
    `,
    [sku],
  );
  return rows[0]?.calls ?? 0;
}

async function assertBudget(client, sku, dailyLimit, monthlyLimit) {
  const [today, month] = await Promise.all([
    usageCount(client, sku, "day"),
    usageCount(client, sku, "month"),
  ]);
  if (dailyLimit !== null && today >= dailyLimit) {
    throw new Error(`Google ${sku} daily limit reached: ${today}/${dailyLimit}.`);
  }
  if (monthlyLimit !== null && month >= monthlyLimit) {
    throw new Error(`Google ${sku} monthly limit reached: ${month}/${monthlyLimit}.`);
  }
}

async function recordApiStart(client, { sku, cityId, venueId, requestMetadata }) {
  const { rows } = await client.query(
    `
      insert into public.external_api_usage_events (
        provider, api_name, sku, purpose, city_id, venue_id, status, billable_units, request_metadata
      )
      values ('google', 'places_api_new', $1, 'venue_hours_fallback', $2, $3, 'started', 1, $4::jsonb)
      returning id
    `,
    [sku, cityId, venueId, JSON.stringify(requestMetadata ?? {})],
  );
  return rows[0].id;
}

async function updateApiUsage(client, id, status, responseMetadata = {}) {
  await client.query(
    `
      update public.external_api_usage_events
      set status = $2,
          response_metadata = response_metadata || $3::jsonb,
          updated_at = now()
      where id = $1
    `,
    [id, status, JSON.stringify(responseMetadata)],
  );
}

async function googleFetchJson(client, args, { url, method = "GET", body = null, fieldMask, sku, cityId, venueId, requestMetadata }) {
  const dailyLimit = sku === GOOGLE_DETAILS_SKU ? args.dailyLimit : args.searchDailyLimit;
  const monthlyLimit = sku === GOOGLE_DETAILS_SKU ? args.monthlyLimit : args.searchMonthlyLimit;
  await assertBudget(client, sku, dailyLimit, monthlyLimit);

  const usageId = await recordApiStart(client, {
    sku,
    cityId,
    venueId,
    requestMetadata: {
      ...requestMetadata,
      method,
      fieldMask,
    },
  });

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY,
      "X-Goog-FieldMask": fieldMask,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!response.ok) {
    await updateApiUsage(client, usageId, "failed", {
      httpStatus: response.status,
      error: json?.error?.message ?? text.slice(0, 240),
    });
    throw new Error(`Google Places HTTP ${response.status}: ${json?.error?.message ?? text.slice(0, 240)}`);
  }

  return { json, usageId };
}

async function getMissingHourVenues(client, citySlug, limit) {
  const { rows } = await client.query(
    `
      with city as (
        select id, name, slug, timezone
        from public.destinations
        where scope = 'city'::public.destination_scope
          and slug = $1
        limit 1
      ),
      city_entries as (
        select id, slug, category
        from public.entries
        where city_id = (select id from city)
          and status = 'published'::public.rguide_entry_status
          and submission_type <> 'event'::public.rguide_submission_type
      ),
      used_venues as (
        select
          venue.id,
          venue.name,
          venue.slug,
          venue.coordinates,
          venue.official_url,
          venue.venue_kind,
          venue.operating_status,
          venue.timezone,
          (select id from city) as city_id,
          (select name from city) as city_name,
          coalesce(venue.timezone, (select timezone from city)) as city_timezone,
          google_ref.provider_place_id as google_place_id,
          google_ref.provider_url as google_provider_url,
          count(distinct stop.entry_id)::int as guide_count,
          array_agg(distinct entry.slug order by entry.slug) as guide_slugs
        from public.entry_stops stop
        join city_entries entry on entry.id = stop.entry_id
        join public.venues venue on venue.id = stop.venue_id
        left join public.venue_external_refs google_ref
          on google_ref.venue_id = venue.id
         and google_ref.provider = 'google'
        where venue.coordinates is not null
          and venue.merged_into_venue_id is null
          and venue.operating_status <> 'permanently_closed'::public.venue_operating_status
          and nullif(venue.hours_note, '') is null
          and not exists (
            select 1
            from public.venue_hours hour
            where hour.venue_id = venue.id
              and hour.valid_from <= current_date
              and (hour.valid_to is null or hour.valid_to >= current_date)
          )
          and (
            stop.hours is null
            or stop.hours::text ~* '(current-status evidence is map-based|open and active in the current source set|open and active|hours should be confirmed|verify current hours|verify official hours|confirm current hours|confirm before going|check current hours|hours?\\s+var(y|ies)|current hours)'
          )
        group by venue.id, google_ref.provider_place_id, google_ref.provider_url
      )
      select *
      from used_venues
      order by guide_count desc, name
      limit $2
    `,
    [citySlug, limit],
  );
  return rows;
}

async function upsertGoogleExternalRef(client, venue, place, confidence) {
  const placeId = place.id;
  if (!placeId) return;
  await client.query(
    `
      insert into public.venue_external_refs (
        venue_id, provider, provider_place_id, provider_url, label, confidence, raw_metadata
      )
      values ($1, 'google', $2, $3, $4, $5, $6::jsonb)
      on conflict (provider, provider_place_id) do update set
        provider_url = coalesce(excluded.provider_url, public.venue_external_refs.provider_url),
        label = coalesce(excluded.label, public.venue_external_refs.label),
        confidence = greatest(coalesce(public.venue_external_refs.confidence, 0), coalesce(excluded.confidence, 0)),
        raw_metadata = public.venue_external_refs.raw_metadata || excluded.raw_metadata,
        updated_at = now()
      where public.venue_external_refs.venue_id = excluded.venue_id
    `,
    [
      venue.id,
      placeId,
      place.googleMapsUri ?? null,
      place.displayName?.text ?? venue.name,
      confidence,
      JSON.stringify({
        source: "google_places_text_search",
        businessStatus: place.businessStatus ?? null,
        location: place.location ?? null,
      }),
    ],
  );
}

async function findGooglePlace(client, args, venue) {
  if (venue.google_place_id) {
    return {
      id: venue.google_place_id,
      googleMapsUri: venue.google_provider_url,
      displayName: { text: venue.name },
      confidence: 1,
      refSource: "venue_external_refs",
    };
  }
  if (!args.allowSearch) return null;

  const point = coordinatesToPoint(venue.coordinates);
  const body = {
    textQuery: `${venue.name}, ${venue.city_name}`,
    maxResultCount: 5,
  };
  if (point) {
    body.locationBias = {
      circle: {
        center: point,
        radius: 250,
      },
    };
  }

  const { json, usageId } = await googleFetchJson(client, args, {
    url: "https://places.googleapis.com/v1/places:searchText",
    method: "POST",
    body,
    fieldMask: "places.id,places.displayName,places.location,places.googleMapsUri,places.businessStatus",
    sku: GOOGLE_TEXT_SEARCH_SKU,
    cityId: venue.city_id,
    venueId: venue.id,
    requestMetadata: {
      venueName: venue.name,
      city: venue.city_name,
    },
  });

  const scored = (json?.places ?? [])
    .map((place) => ({ place, confidence: scoreCandidate(venue, place) }))
    .filter((candidate) => candidate.confidence >= 0.74)
    .sort((left, right) => right.confidence - left.confidence);

  if (!scored.length) {
    await updateApiUsage(client, usageId, "not_found", {
      resultCount: json?.places?.length ?? 0,
    });
    return null;
  }

  const best = scored[0];
  await updateApiUsage(client, usageId, "success", {
    resultCount: json?.places?.length ?? 0,
    selectedPlaceId: best.place.id,
    selectedName: best.place.displayName?.text ?? null,
    confidence: best.confidence,
  });
  if (!args.dryRun) await upsertGoogleExternalRef(client, venue, best.place, best.confidence);
  return { ...best.place, confidence: best.confidence, refSource: "text_search" };
}

async function getGooglePlaceDetails(client, args, venue, place) {
  const { json, usageId } = await googleFetchJson(client, args, {
    url: `https://places.googleapis.com/v1/places/${encodeURIComponent(place.id)}`,
    fieldMask: "id,displayName,googleMapsUri,businessStatus,regularOpeningHours,currentOpeningHours,timeZone",
    sku: GOOGLE_DETAILS_SKU,
    cityId: venue.city_id,
    venueId: venue.id,
    requestMetadata: {
      venueName: venue.name,
      googlePlaceId: place.id,
      refSource: place.refSource,
    },
  });
  return { place: json, usageId };
}

function mapBusinessStatus(status) {
  if (status === "CLOSED_PERMANENTLY") return "permanently_closed";
  if (status === "CLOSED_TEMPORARILY") return "temporarily_closed";
  if (status === "OPERATIONAL") return "open";
  return "unknown";
}

function normalizeTimezone(value, fallback) {
  if (!value) return fallback ?? null;
  if (typeof value === "string") return value;
  return value.id ?? value.timeZoneId ?? value.name ?? fallback ?? null;
}

function rawTextFromWeekdayDescription(description) {
  const text = String(description ?? "").replace(/\s+/g, " ").trim();
  const match = text.match(/^([A-Za-z]+):\s*(.+)$/);
  if (!match) return null;
  const dayOfWeek = DAY_ALIASES.get(match[1].toLowerCase());
  if (dayOfWeek === undefined) return null;
  return {
    dayOfWeek,
    rawText: match[2].trim(),
  };
}

function formatGoogleTime(time) {
  if (!time) return null;
  const hour = Number(time.hour ?? 0);
  const minute = Number(time.minute ?? 0);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function rowsFromOpeningHours(openingHours) {
  const descriptions = openingHours?.weekdayDescriptions ?? [];
  const fromDescriptions = descriptions.map(rawTextFromWeekdayDescription).filter(Boolean);
  if (fromDescriptions.length) return fromDescriptions;

  const grouped = new Map();
  for (const period of openingHours?.periods ?? []) {
    const open = period.open;
    if (!open || open.day === undefined) continue;
    const dayOfWeek = Number(open.day);
    const opens = formatGoogleTime(open);
    const closes = formatGoogleTime(period.close);
    const rawText = opens && closes ? `${opens}-${closes}` : opens ? `Opens ${opens}` : null;
    if (!rawText) continue;
    const existing = grouped.get(dayOfWeek);
    grouped.set(dayOfWeek, existing ? `${existing}; ${rawText}` : rawText);
  }
  return [...grouped.entries()].map(([dayOfWeek, rawText]) => ({ dayOfWeek, rawText }));
}

function parseGoogleOpeningHours(place) {
  const openingHours = place.regularOpeningHours ?? place.currentOpeningHours ?? null;
  const rows = rowsFromOpeningHours(openingHours);
  return {
    sourceKind: place.regularOpeningHours ? "regularOpeningHours" : place.currentOpeningHours ? "currentOpeningHours" : null,
    note: rows.length
      ? rows
          .slice()
          .sort((left, right) => left.dayOfWeek - right.dayOfWeek)
          .map((row) => `${DAY_LABELS[row.dayOfWeek]}: ${row.rawText}`)
          .join("; ")
      : null,
    rows,
  };
}

async function upsertSource(client) {
  const { rows } = await client.query(
    `
      insert into public.sources (name, url, publisher, source_type, sourced_at, raw_metadata)
      values (
        'Google Places API (New) Place Details',
        'https://developers.google.com/maps/documentation/places/web-service/place-details',
        'Google Maps Platform',
        'venue_hours',
        now(),
        jsonb_build_object('source', 'google_places_api_new', 'sku', $1::text)
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
    [GOOGLE_DETAILS_SKU],
  );
  return rows[0].id;
}

async function upsertVenueHours(client, sourceId, venue, googlePlace, parsed) {
  const status = mapBusinessStatus(googlePlace.businessStatus);
  const timezone = normalizeTimezone(googlePlace.timeZone, venue.city_timezone);

  await client.query(
    `
      update public.venues
      set hours_note = coalesce($2, hours_note),
          hours_last_verified_at = now(),
          timezone = coalesce($3, timezone),
          operating_status = case
            when $4::public.venue_operating_status <> 'unknown'::public.venue_operating_status then $4::public.venue_operating_status
            else operating_status
          end,
          updated_at = now()
      where id = $1
    `,
    [venue.id, parsed.note, timezone, status],
  );

  if (!parsed.rows.length) return { intervals: 0 };

  const rows = parsed.rows.map((row, index) => ({
    venue_id: venue.id,
    day_of_week: row.dayOfWeek,
    interval_order: 0,
    is_closed: /^closed$/i.test(row.rawText),
    is_24_hours: /^(open\s*)?24\s*hours|24\/7$/i.test(row.rawText),
    raw_text: row.rawText,
    raw_metadata: {
      source: "google_places_api_new",
      sourceKind: parsed.sourceKind,
      googlePlaceId: googlePlace.id,
      googleMapsUri: googlePlace.googleMapsUri ?? null,
      googleDisplayName: googlePlace.displayName?.text ?? null,
      businessStatus: googlePlace.businessStatus ?? null,
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
        0.86,
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
  return { intervals: result.rowCount ?? 0 };
}

async function refreshAffectedRenderCache(client, venueIds) {
  if (!venueIds.length) return 0;
  const result = await client.query(
    `
      with affected_entries as (
        select distinct entry.id
        from public.entries entry
        join public.entry_stops stop on stop.entry_id = entry.id
        where stop.venue_id = any($1::uuid[])
          and entry.status = 'published'::public.rguide_entry_status
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
        jsonb_build_object('refreshed_from', 'venue_hours_google_ingest')
      from affected_entries entry
      join public.entries_maplist view on view.id = entry.id
      on conflict (entry_id, render_format, render_version) do update set
        rendered_payload = excluded.rendered_payload,
        source_hash = excluded.source_hash,
        rendered_at = excluded.rendered_at,
        stale_at = null,
        is_current = true,
        metadata = public.entry_render_cache.metadata || excluded.metadata
    `,
    [venueIds],
  );
  return result.rowCount ?? 0;
}

async function main() {
  loadEnvFile(path.join(ROOT, ".env.local"));
  loadEnvFile(path.join(ROOT, ".env"));
  const args = parseArgs(process.argv.slice(2));

  if (!args.city) throw new Error("Pass --city <city-slug>.");
  if (!enabledGoogleHours(args)) {
    throw new Error("Set GOOGLE_PLACES_HOURS_ENABLED=true or pass --force.");
  }
  if (!process.env.GOOGLE_PLACES_API_KEY) throw new Error("Set GOOGLE_PLACES_API_KEY.");

  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) throw new Error("Set SUPABASE_DB_URL, SUPABASE_DATABASE_URL, or DATABASE_URL.");

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: getPgSslConfig(databaseUrl),
  });
  await client.connect();

  const stats = {
    selected: 0,
    searched: 0,
    detailsChecked: 0,
    matched: 0,
    updated: 0,
    skippedNoPlace: 0,
    skippedNoHours: 0,
    failed: 0,
    intervals: 0,
  };
  const updatedVenueIds = [];
  const results = [];

  try {
    await ensureUsageLedger(client);
    const venues = await getMissingHourVenues(client, args.city, args.limit);
    stats.selected = venues.length;
    if (args.planOnly) {
      console.log(JSON.stringify({
        ok: true,
        planOnly: true,
        city: args.city,
        selected: venues.length,
        venues: venues.map((venue) => ({
          id: venue.id,
          name: venue.name,
          googlePlaceId: venue.google_place_id ?? null,
          guideCount: venue.guide_count,
          guideSlugs: venue.guide_slugs,
        })),
      }, null, 2));
      return;
    }
    const sourceId = args.dryRun ? null : await upsertSource(client);

    for (const venue of venues) {
      try {
        const hadGoogleRef = Boolean(venue.google_place_id);
        const place = await findGooglePlace(client, args, venue);
        if (!hadGoogleRef && place) stats.searched += 1;
        if (!place) {
          stats.skippedNoPlace += 1;
          results.push({ venue: venue.name, status: "no_google_match" });
          continue;
        }

        const details = await getGooglePlaceDetails(client, args, venue, place);
        stats.detailsChecked += 1;
        const parsed = parseGoogleOpeningHours(details.place);
        const businessStatus = details.place?.businessStatus ?? null;
        if (!parsed.rows.length) {
          stats.skippedNoHours += 1;
          await updateApiUsage(client, details.usageId, "no_hours", {
            googlePlaceId: details.place?.id ?? place.id,
            googleName: details.place?.displayName?.text ?? null,
            businessStatus,
          });
          results.push({ venue: venue.name, status: "no_hours", businessStatus });
          continue;
        }

        stats.matched += 1;
        await updateApiUsage(client, details.usageId, "success", {
          googlePlaceId: details.place.id,
          googleName: details.place.displayName?.text ?? null,
          googleMapsUri: details.place.googleMapsUri ?? null,
          businessStatus,
          sourceKind: parsed.sourceKind,
          dayCount: parsed.rows.length,
        });

        if (!args.dryRun) {
          const updateResult = await upsertVenueHours(client, sourceId, venue, details.place, parsed);
          updatedVenueIds.push(venue.id);
          stats.updated += 1;
          stats.intervals += updateResult.intervals;
        }
        results.push({
          venue: venue.name,
          status: args.dryRun ? "would_update" : "updated",
          googleName: details.place.displayName?.text ?? null,
          googlePlaceId: details.place.id,
          sourceKind: parsed.sourceKind,
          hours: parsed.note,
        });

        await new Promise((resolve) => setTimeout(resolve, 125));
      } catch (error) {
        stats.failed += 1;
        results.push({
          venue: venue.name,
          status: "failed",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    const refreshedCaches = args.dryRun ? 0 : await refreshAffectedRenderCache(client, updatedVenueIds);
    const usage = {
      details: {
        today: await usageCount(client, GOOGLE_DETAILS_SKU, "day"),
        month: await usageCount(client, GOOGLE_DETAILS_SKU, "month"),
        dailyLimit: args.dailyLimit,
        monthlyLimit: args.monthlyLimit,
      },
      search: {
        today: await usageCount(client, GOOGLE_TEXT_SEARCH_SKU, "day"),
        month: await usageCount(client, GOOGLE_TEXT_SEARCH_SKU, "month"),
        dailyLimit: args.searchDailyLimit,
        monthlyLimit: args.searchMonthlyLimit,
      },
    };

    console.log(JSON.stringify({ ok: true, dryRun: args.dryRun, city: args.city, stats, refreshedCaches, usage, results }, null, 2));
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exitCode = 1;
});
