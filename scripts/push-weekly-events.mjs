import fs from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import pg from "pg";

import {
  describeWeeklyEventFilters,
  filterWeeklyEventRecords,
  loadWeeklyEventGuideRecords,
  parseWeeklyEventArgs,
} from "./weekly-events-data.mjs";

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

function getDatabaseUrl() {
  return (
    process.env.SUPABASE_DB_URL ??
    process.env.SUPABASE_DATABASE_URL ??
    process.env.DATABASE_URL ??
    null
  );
}

function getPgSslConfig(databaseUrl) {
  return databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
    ? false
    : { rejectUnauthorized: false };
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
  return JSON.stringify(value ?? null);
}

function toJsonArray(value) {
  return JSON.stringify(value ?? []);
}

function toJsonObject(value) {
  return JSON.stringify(value ?? {});
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

function parsePublishArgs(argv) {
  const dryRun = argv.includes("--dry-run") || argv.includes("--check");
  const filters = parseWeeklyEventArgs(argv.filter((arg) => arg !== "--dry-run" && arg !== "--check"));
  return { dryRun, filters };
}

function logPhase(message, metadata = undefined) {
  const suffix = metadata ? ` ${JSON.stringify(metadata)}` : "";
  console.log(`[weekly-events] ${message}${suffix}`);
}

function elapsedMs(startedAt) {
  return Math.round(Number(process.hrtime.bigint() - startedAt) / 1_000_000);
}

function parseWeekLabel(run) {
  const match = String(run.weekLabel ?? "").match(/^([A-Za-z]+)\s+(\d{1,2})(?:-(\d{1,2}))?,\s*(\d{4})$/);
  if (!match) {
    const starts = run.events.map((event) => event.startsAt).filter(Boolean).sort();
    const start = starts[0]?.slice(0, 10) ?? run.sourcedAt.slice(0, 10);
    const end = new Date(`${start}T00:00:00Z`);
    end.setUTCDate(end.getUTCDate() + 7);
    return { weekStart: start, weekEnd: end.toISOString().slice(0, 10) };
  }

  const [, monthName, startDay, endDay, year] = match;
  const monthIndex = new Date(`${monthName} 1, ${year} 00:00:00 UTC`).getUTCMonth();
  const start = new Date(Date.UTC(Number(year), monthIndex, Number(startDay)));
  const end = new Date(Date.UTC(Number(year), monthIndex, Number(endDay ?? startDay)));
  return {
    weekStart: start.toISOString().slice(0, 10),
    weekEnd: end.toISOString().slice(0, 10),
  };
}

function eventVenueKey(record, event) {
  return `${record.cityId}|${slugify(event.venue)}`;
}

function activationVenueKey(record, activation) {
  return `${record.cityId}|${slugify(activation.venue)}`;
}

function activationLegacyId(event, activation) {
  const identity = String(activation.title ?? event.title).trim().toLowerCase();
  const hash = createHash("md5").update(identity).digest("hex");
  return `${event.id}:activation:${hash}`;
}

function activationMapKey(event, activation) {
  return activationLegacyId(event, activation);
}

function collectRuns(records) {
  const runsByKey = new Map();
  for (const record of records) {
    const key = `${record.sourceRun.cityId}|${record.sourceRun.weekLabel}|${record.sourceRun.sourcedAt}`;
    if (!runsByKey.has(key)) {
      runsByKey.set(key, record.sourceRun);
    }
  }
  return [...runsByKey.values()];
}

function collectVenueRows(records) {
  const rowsByKey = new Map();
  for (const record of records) {
    const event = record.rawEvent;
    const addVenue = (venueName, coordinates, metadata) => {
      const slug = slugify(venueName);
      const rowKey = `${record.cityId}|${slug}`;
      const existing = rowsByKey.get(rowKey);
      rowsByKey.set(rowKey, {
        row_key: rowKey,
        slug,
        name: venueName,
        normalized_name: normalizeName(venueName),
        city_slug: record.cityId,
        coordinates: normalizeCoordinates(coordinates) ?? existing?.coordinates ?? null,
        country: record.country,
        official_url: metadata.url ?? existing?.official_url ?? null,
        source_metadata: {
          ...(existing?.source_metadata ?? {}),
          source: "weekly_events",
          eventIds: uniqueValues([...(existing?.source_metadata?.eventIds ?? []), event.id]),
          ...metadata,
        },
      });
    };

    addVenue(event.venue, event.coordinates, { sourceLegacyId: event.id, url: event.url });
    for (const activation of event.activations ?? []) {
      addVenue(activation.venue, activation.coordinates ?? event.coordinates, {
        sourceLegacyId: activation.id,
        url: activation.url ?? event.url,
      });
    }
  }
  return [...rowsByKey.values()];
}

function collectSourceRows(records) {
  const rowsByUrl = new Map();
  for (const record of records) {
    const event = record.rawEvent;
    rowsByUrl.set(event.url, {
      url: event.url,
      name: event.sourceName,
      publisher: event.sourceName,
      source_type: "weekly_event",
      fetched_at: record.sourceRun.sourcedAt,
      sourced_at: record.sourceRun.sourcedAt,
      raw_metadata: { cityId: record.cityId, eventId: event.id },
    });
    const activations = event.activations?.length
      ? event.activations
      : [{ id: `${event.id}-venue`, title: event.title, url: event.url }];
    for (const activation of activations) {
      if (!activation.url || rowsByUrl.has(activation.url)) {
        continue;
      }
      rowsByUrl.set(activation.url, {
        url: activation.url,
        name: event.sourceName,
        publisher: event.sourceName,
        source_type: "weekly_event_activation",
        fetched_at: record.sourceRun.sourcedAt,
        sourced_at: record.sourceRun.sourcedAt,
        raw_metadata: { cityId: record.cityId, eventId: event.id, activationId: activation.id },
      });
    }
  }
  return [...rowsByUrl.values()];
}

async function resolveCityIds(client, runs) {
  const slugs = uniqueValues(runs.map((run) => run.cityId));
  const { rows } = await client.query(
    [
      "select id, slug, name",
      "from public.destinations",
      "where scope = 'city'",
      "  and (slug = any($1::text[]) or legacy_id = any($1::text[]))",
    ].join(" "),
    [slugs],
  );
  const bySlug = new Map(rows.map((row) => [row.slug, row.id]));
  const missing = slugs.filter((slug) => !bySlug.has(slug));
  if (missing.length) {
    throw new Error(`Missing city destinations for weekly events: ${missing.join(", ")}`);
  }
  return bySlug;
}

async function upsertPublishingSettings(client, runs, cityIds) {
  const rows = runs.map((run) => ({
    city_id: cityIds.get(run.cityId),
    destination_id: cityIds.get(run.cityId),
    city_slug: run.cityId,
    city_name: run.cityName,
    timezone: run.timezone,
    source_strategy: run.sourceStrategy ?? [],
    metadata: { source: "weekly_events", weekLabel: run.weekLabel },
  }));

  await client.query(
    [
      "with incoming as (",
      "  select * from jsonb_to_recordset($1::jsonb) as row(",
      "    city_id uuid, destination_id uuid, city_slug text, city_name text, timezone text,",
      "    source_strategy text[], metadata jsonb",
      "  )",
      ")",
      "insert into public.event_city_publishing_settings (",
      "  city_id, destination_id, city_slug, city_name, timezone, is_active,",
      "  publish_cadence, refresh_cadence, discovery_cadence, source_strategy, metadata, last_publish_run_at",
      ")",
      "select city_id, destination_id, city_slug, city_name, timezone, true,",
      "  'weekly', 'daily', 'monthly', source_strategy, metadata, now()",
      "from incoming",
      "on conflict (city_slug) do update set",
      "  city_id = excluded.city_id,",
      "  destination_id = excluded.destination_id,",
      "  city_name = excluded.city_name,",
      "  timezone = excluded.timezone,",
      "  is_active = true,",
      "  publish_cadence = excluded.publish_cadence,",
      "  refresh_cadence = excluded.refresh_cadence,",
      "  discovery_cadence = excluded.discovery_cadence,",
      "  source_strategy = excluded.source_strategy,",
      "  metadata = public.event_city_publishing_settings.metadata || excluded.metadata,",
      "  last_publish_run_at = now(),",
      "  updated_at = now()",
    ].join(" "),
    [JSON.stringify(rows)],
  );
}

async function upsertSourceRuns(client, runs, records, cityIds) {
  const rows = runs.map((run) => {
    const { weekStart, weekEnd } = parseWeekLabel(run);
    const runRecords = records.filter((record) => record.sourceRun === run);
    const legacyId = `${run.cityId}:${slugify(run.weekLabel)}:${run.sourcedAt}`;
    return {
      legacy_id: legacyId,
      city_id: cityIds.get(run.cityId),
      destination_id: cityIds.get(run.cityId),
      city_slug: run.cityId,
      city_name: run.cityName,
      window_start: weekStart,
      window_end: weekEnd,
      publish_week_start: weekStart,
      publish_week_end: weekEnd,
      window_label: run.weekLabel,
      sourced_at: run.sourcedAt,
      timezone: run.timezone,
      source_strategy: run.sourceStrategy ?? [],
      events_found_count: run.events.length,
      events_published_count: runRecords.length,
      raw_payload: { cityId: run.cityId, weekLabel: run.weekLabel, source: "weekly_events" },
    };
  });

  const { rows: upserted } = await client.query(
    [
      "with incoming as (",
      "  select * from jsonb_to_recordset($1::jsonb) as row(",
      "    legacy_id text, city_id uuid, destination_id uuid, city_slug text, city_name text,",
      "    window_start date, window_end date, publish_week_start date, publish_week_end date,",
      "    window_label text, sourced_at timestamptz, timezone text, source_strategy text[],",
      "    events_found_count integer, events_published_count integer, raw_payload jsonb",
      "  )",
      "), settings as (",
      "  select id, city_slug from public.event_city_publishing_settings",
      "), upserted as (",
      "  insert into public.event_source_runs (",
      "    legacy_id, publishing_settings_id, run_type, city_id, destination_id, city_slug, city_name,",
      "    window_start, window_end, publish_week_start, publish_week_end, window_label, sourced_at,",
      "    timezone, source_strategy, status, events_found_count, events_published_count, raw_payload",
      "  )",
      "  select incoming.legacy_id, settings.id, 'weekly_publish', incoming.city_id, incoming.destination_id,",
      "    incoming.city_slug, incoming.city_name, incoming.window_start, incoming.window_end,",
      "    incoming.publish_week_start, incoming.publish_week_end, incoming.window_label, incoming.sourced_at,",
      "    incoming.timezone, incoming.source_strategy, 'completed', incoming.events_found_count,",
      "    incoming.events_published_count, incoming.raw_payload",
      "  from incoming",
      "  join settings on settings.city_slug = incoming.city_slug",
      "  on conflict (legacy_id) do update set",
      "    publishing_settings_id = excluded.publishing_settings_id,",
      "    city_id = excluded.city_id,",
      "    destination_id = excluded.destination_id,",
      "    city_name = excluded.city_name,",
      "    window_start = excluded.window_start,",
      "    window_end = excluded.window_end,",
      "    publish_week_start = excluded.publish_week_start,",
      "    publish_week_end = excluded.publish_week_end,",
      "    window_label = excluded.window_label,",
      "    sourced_at = excluded.sourced_at,",
      "    timezone = excluded.timezone,",
      "    source_strategy = excluded.source_strategy,",
      "    status = 'completed',",
      "    events_found_count = excluded.events_found_count,",
      "    events_published_count = excluded.events_published_count,",
      "    raw_payload = public.event_source_runs.raw_payload || excluded.raw_payload,",
      "    updated_at = now()",
      "  returning id, legacy_id",
      ")",
      "select id, legacy_id from upserted",
    ].join(" "),
    [JSON.stringify(rows)],
  );

  return new Map(upserted.map((row) => [row.legacy_id, row.id]));
}

async function upsertVenues(client, records, cityIds) {
  const rows = collectVenueRows(records).map((row) => ({
    ...row,
    city_id: cityIds.get(row.city_slug),
    destination_id: cityIds.get(row.city_slug),
  }));

  const { rows: upserted } = await client.query(
    [
      "with incoming as (",
      "  select * from jsonb_to_recordset($1::jsonb) as row(",
      "    row_key text, slug text, name text, normalized_name text, city_slug text, city_id uuid,",
      "    destination_id uuid, coordinates jsonb, country text, official_url text, source_metadata jsonb",
      "  )",
      "), upserted as (",
      "  insert into public.venues (",
      "    slug, name, normalized_name, city_id, destination_id, country, coordinates, official_url,",
      "    venue_kind, source_metadata",
      "  )",
      "  select slug, name, normalized_name, city_id, destination_id, country, coordinates, official_url,",
      "    'event_venue', source_metadata",
      "  from incoming",
      "  on conflict (city_id, slug) do update set",
      "    name = excluded.name,",
      "    normalized_name = excluded.normalized_name,",
      "    coordinates = coalesce(excluded.coordinates, public.venues.coordinates),",
      "    official_url = coalesce(excluded.official_url, public.venues.official_url),",
      "    venue_kind = case",
      "      when public.venues.venue_kind = 'other' then 'event_venue'::public.venue_kind",
      "      else public.venues.venue_kind",
      "    end,",
      "    source_metadata = public.venues.source_metadata || excluded.source_metadata,",
      "    updated_at = now()",
      "  returning id, city_id, slug",
      ")",
      "select incoming.row_key, upserted.id",
      "from incoming",
      "join upserted on upserted.city_id = incoming.city_id and upserted.slug = incoming.slug",
    ].join(" "),
    [JSON.stringify(rows)],
  );

  return new Map(upserted.map((row) => [row.row_key, row.id]));
}

async function upsertEvents(client, records, cityIds, runIds, venueIds) {
  const rows = records.map((record) => {
    const event = record.rawEvent;
    const runLegacyId = `${record.sourceRun.cityId}:${slugify(record.sourceRun.weekLabel)}:${record.sourceRun.sourcedAt}`;
    return {
      legacy_id: event.id,
      slug: `this-week-${slugify(event.cityName)}-${slugify(event.title)}`,
      title: event.title,
      description: event.description,
      highlights: event.highlights ?? [],
      event_category: event.category,
      guide_category: record.guide.category,
      city_id: cityIds.get(record.cityId),
      destination_id: cityIds.get(record.cityId),
      venue_id: venueIds.get(eventVenueKey(record, event)) ?? null,
      timezone: event.timezone ?? record.sourceRun.timezone,
      starts_at: event.startsAt,
      ends_at: event.endsAt ?? null,
      starts_on: event.startsAt.slice(0, 10),
      ends_on: event.endsAt?.slice(0, 10) ?? null,
      price_label: event.price ?? null,
      official_url: event.url,
      photo_url: record.guide.photo ?? null,
      is_festival: Boolean(event.activations?.length && event.activations.length > 1),
      is_guide_worthy: Boolean(event.isGuideWorthy),
      guide_reason: event.guideReason ?? null,
      raw_metadata: { source: "weekly_events", rawEvent: event },
      discovery_source_run_id: runIds.get(runLegacyId),
      latest_refresh_source_run_id: runIds.get(runLegacyId),
    };
  });

  const { rows: upserted } = await client.query(
    [
      "with incoming as (",
      "  select * from jsonb_to_recordset($1::jsonb) as row(",
      "    legacy_id text, slug text, title text, description text, highlights text[],",
      "    event_category text, guide_category text, city_id uuid, destination_id uuid, venue_id uuid,",
      "    timezone text, starts_at timestamptz, ends_at timestamptz, starts_on date, ends_on date,",
      "    price_label text, official_url text, photo_url text, is_festival boolean, is_guide_worthy boolean,",
      "    guide_reason text, raw_metadata jsonb,",
      "    discovery_source_run_id uuid, latest_refresh_source_run_id uuid",
      "  )",
      "), upserted as (",
      "  insert into public.events (",
      "    legacy_id, slug, title, description, highlights, event_category, guide_category, status,",
      "    city_id, destination_id, venue_id, timezone, starts_at, ends_at, starts_on, ends_on,",
      "    price_label, official_url, photo_url, is_festival, is_guide_worthy, guide_reason,",
      "    submission_type, raw_metadata, discovery_source_run_id, latest_refresh_source_run_id",
      "  )",
      "  select legacy_id, slug, title, description, highlights, event_category, guide_category, 'published',",
      "    city_id, destination_id, venue_id, timezone, starts_at, ends_at, starts_on, ends_on,",
      "    price_label, official_url, photo_url, is_festival, is_guide_worthy, guide_reason,",
      "    'event', raw_metadata, discovery_source_run_id, latest_refresh_source_run_id",
      "  from incoming",
      "  on conflict (legacy_id) do update set",
      "    slug = excluded.slug,",
      "    title = excluded.title,",
      "    description = excluded.description,",
      "    highlights = excluded.highlights,",
      "    event_category = excluded.event_category,",
      "    guide_category = excluded.guide_category,",
      "    status = 'published',",
      "    city_id = excluded.city_id,",
      "    destination_id = excluded.destination_id,",
      "    venue_id = excluded.venue_id,",
      "    timezone = excluded.timezone,",
      "    starts_at = excluded.starts_at,",
      "    ends_at = excluded.ends_at,",
      "    starts_on = excluded.starts_on,",
      "    ends_on = excluded.ends_on,",
      "    price_label = excluded.price_label,",
      "    official_url = excluded.official_url,",
      "    photo_url = excluded.photo_url,",
      "    is_festival = excluded.is_festival,",
      "    is_guide_worthy = excluded.is_guide_worthy,",
      "    guide_reason = excluded.guide_reason,",
      "    raw_metadata = public.events.raw_metadata || excluded.raw_metadata,",
      "    latest_refresh_source_run_id = excluded.latest_refresh_source_run_id,",
      "    updated_at = now()",
      "  returning id, legacy_id",
      ")",
      "select id, legacy_id from upserted",
    ].join(" "),
    [JSON.stringify(rows)],
  );

  return new Map(upserted.map((row) => [row.legacy_id, row.id]));
}

async function upsertActivations(client, records, eventIds, venueIds) {
  const grouped = new Map();

  for (const record of records) {
    const event = record.rawEvent;
    const eventId = eventIds.get(event.id);
    const activations = event.activations?.length
      ? event.activations
      : [{
          id: `${event.id}-venue`,
          title: event.title,
          venue: event.venue,
          description: event.description,
          coordinates: event.coordinates,
          url: event.url,
        }];

    activations.forEach((activation, index) => {
      const legacyId = activationLegacyId(event, activation);
      const venueId = venueIds.get(activationVenueKey(record, activation)) ?? venueIds.get(eventVenueKey(record, event)) ?? null;
      const existing = grouped.get(legacyId);
      const hash = legacyId.slice(legacyId.lastIndexOf(":") + 1);
      grouped.set(legacyId, {
        event_id: eventId,
        legacy_id: legacyId,
        slug: `${slugify(activation.title) || "activation"}-${hash.slice(0, 8)}`,
        title: activation.title,
        description: activation.description ?? existing?.description ?? null,
        activation_category: event.category,
        venue_id: existing && existing.venue_id !== venueId ? null : venueId,
        official_url: activation.url ?? event.url,
        booking_url: activation.url ?? event.url,
        price_label: event.price ?? null,
        sort_order: Math.min(existing?.sort_order ?? index + 1, index + 1),
        raw_metadata: {
          source: "weekly_events",
          eventId: event.id,
          activationIds: uniqueValues([...(existing?.raw_metadata?.activationIds ?? []), activation.id]),
        },
      });
    });
  }

  const rows = [...grouped.values()];
  if (!rows.length) {
    return new Map();
  }

  const { rows: upserted } = await client.query(
    [
      "with incoming as (",
      "  select * from jsonb_to_recordset($1::jsonb) as row(",
      "    event_id uuid, legacy_id text, slug text, title text, description text, activation_category text,",
      "    venue_id uuid, official_url text, booking_url text, price_label text, sort_order integer, raw_metadata jsonb",
      "  )",
      "), upserted as (",
      "  insert into public.event_activations (",
      "    event_id, legacy_id, slug, title, description, activation_category, venue_id,",
      "    official_url, booking_url, price_label, sort_order, raw_metadata",
      "  )",
      "  select event_id, legacy_id, slug, title, description, activation_category, venue_id,",
      "    official_url, booking_url, price_label, sort_order, raw_metadata",
      "  from incoming",
      "  on conflict (event_id, legacy_id) do update set",
      "    slug = excluded.slug, title = excluded.title, description = excluded.description,",
      "    activation_category = excluded.activation_category, venue_id = excluded.venue_id,",
      "    official_url = excluded.official_url, booking_url = excluded.booking_url,",
      "    price_label = excluded.price_label, sort_order = excluded.sort_order,",
      "    raw_metadata = public.event_activations.raw_metadata || excluded.raw_metadata, updated_at = now()",
      "  returning id, event_id, legacy_id",
      ")",
      "select id, event_id, legacy_id from upserted",
    ].join(" "),
    [JSON.stringify(rows)],
  );

  const eventIdsInScope = uniqueValues(rows.map((row) => row.event_id));
  const legacyIdsInScope = rows.map((row) => row.legacy_id);
  await client.query(
    "delete from public.event_activations where event_id = any($1::uuid[]) and not (legacy_id = any($2::text[]))",
    [eventIdsInScope, legacyIdsInScope],
  );

  return new Map(upserted.map((row) => [row.legacy_id, row.id]));
}

async function replaceOccurrences(client, records, cityIds, runIds, venueIds, eventIds, activationIds) {
  const selectedEventIds = records.map((record) => eventIds.get(record.rawEvent.id)).filter(Boolean);
  if (!selectedEventIds.length) {
    return 0;
  }

  await client.query("delete from public.event_occurrences where event_id = any($1::uuid[])", [selectedEventIds]);

  const rows = [];
  for (const record of records) {
    const event = record.rawEvent;
    const eventId = eventIds.get(event.id);
    const runLegacyId = `${record.sourceRun.cityId}:${slugify(record.sourceRun.weekLabel)}:${record.sourceRun.sourcedAt}`;
    const activations = event.activations?.length
      ? event.activations
      : [
          {
            id: `${event.id}-venue`,
            title: event.title,
            venue: event.venue,
            startsAt: event.startsAt,
            description: event.description,
            coordinates: event.coordinates,
            url: event.url,
          },
        ];

    activations.forEach((activation, index) => {
      rows.push({
        event_id: eventId,
        activation_id: activationIds.get(activationMapKey(event, activation)),
        legacy_id: activation.id,
        title: activation.title,
        description: activation.description,
        venue_id: venueIds.get(activationVenueKey(record, activation)) ?? venueIds.get(eventVenueKey(record, event)) ?? null,
        city_id: cityIds.get(record.cityId),
        destination_id: cityIds.get(record.cityId),
        starts_at: activation.startsAt ?? event.startsAt,
        ends_at: null,
        starts_on: (activation.startsAt ?? event.startsAt).slice(0, 10),
        ends_on: null,
        timezone: event.timezone ?? record.sourceRun.timezone,
        price_label: event.price ?? null,
        booking_url: activation.url ?? event.url,
        official_url: activation.url ?? event.url,
        coordinates: normalizeCoordinates(activation.coordinates ?? event.coordinates),
        occurrence_order: index + 1,
        raw_metadata: { source: "weekly_events", eventId: event.id, activationId: activation.id },
        source_run_id: runIds.get(runLegacyId),
        latest_refresh_source_run_id: runIds.get(runLegacyId),
      });
    });
  }

  if (!rows.length) {
    return 0;
  }

  const result = await client.query(
    [
      "insert into public.event_occurrences (",
      "  event_id, activation_id, legacy_id, title, description, venue_id, city_id, destination_id,",
      "  starts_at, ends_at, starts_on, ends_on, timezone, price_label, booking_url, official_url,",
      "  coordinates, occurrence_order, raw_metadata, source_run_id, latest_refresh_source_run_id",
      ")",
      "select event_id, activation_id, legacy_id, title, description, venue_id, city_id, destination_id,",
      "  starts_at, ends_at, starts_on, ends_on, timezone, price_label, booking_url, official_url,",
      "  coordinates, occurrence_order, raw_metadata, source_run_id, latest_refresh_source_run_id",
      "from jsonb_to_recordset($1::jsonb) as row(",
      "  event_id uuid, activation_id uuid, legacy_id text, title text, description text, venue_id uuid, city_id uuid, destination_id uuid,",
      "  starts_at timestamptz, ends_at timestamptz, starts_on date, ends_on date, timezone text,",
      "  price_label text, booking_url text, official_url text, coordinates jsonb, occurrence_order integer,",
      "  raw_metadata jsonb, source_run_id uuid, latest_refresh_source_run_id uuid",
      ")",
    ].join(" "),
    [JSON.stringify(rows)],
  );

  return result.rowCount;
}

async function upsertEventMedia(client, records, eventIds, activationIds) {
  const rowsByScope = new Map();

  for (const record of records) {
    const event = record.rawEvent;
    const eventId = eventIds.get(event.id);
    if (record.guide.photo) {
      rowsByScope.set(`event:${eventId}`, {
        event_id: eventId,
        activation_id: null,
        url: record.guide.photo,
        public_url: record.guide.photo.startsWith("https://media.rguide.co/") ? record.guide.photo : null,
        source_url: record.guide.photo,
        storage_provider: record.guide.photo.startsWith("https://media.rguide.co/") ? "cloudflare_r2" : null,
        ingestion_status: record.guide.photo.startsWith("https://media.rguide.co/") ? "uploaded" : "external",
        raw_metadata: { source: "weekly_events_publisher", eventId: event.id },
      });
    }

    const activations = event.activations?.length
      ? event.activations
      : [{ id: `${event.id}-venue`, title: event.title }];
    activations.forEach((activation, index) => {
      const activationId = activationIds.get(activationMapKey(event, activation));
      const photo = record.guide.stops?.[index]?.photo;
      if (!activationId || !photo) {
        return;
      }
      rowsByScope.set(`activation:${activationId}`, {
        event_id: eventId,
        activation_id: activationId,
        url: photo,
        public_url: photo.startsWith("https://media.rguide.co/") ? photo : null,
        source_url: photo,
        storage_provider: photo.startsWith("https://media.rguide.co/") ? "cloudflare_r2" : null,
        ingestion_status: photo.startsWith("https://media.rguide.co/") ? "uploaded" : "external",
        raw_metadata: {
          source: "weekly_events_publisher",
          eventId: event.id,
          activationIds: [activation.id],
        },
      });
    });
  }

  const rows = [...rowsByScope.values()];
  if (!rows.length) {
    return 0;
  }

  await client.query(
    [
      "with incoming as (",
      "  select * from jsonb_to_recordset($1::jsonb) as row(",
      "    event_id uuid, activation_id uuid, url text, public_url text, source_url text,",
      "    storage_provider text, ingestion_status text, raw_metadata jsonb",
      "  )",
      "), updated as (",
      "  update public.event_media media set",
      "    url = case when incoming.public_url is not null or media.public_url is null then incoming.url else media.url end,",
      "    public_url = coalesce(incoming.public_url, media.public_url),",
      "    source_url = coalesce(incoming.source_url, media.source_url),",
      "    storage_provider = coalesce(incoming.storage_provider, media.storage_provider),",
      "    ingestion_status = case when incoming.public_url is not null then incoming.ingestion_status else media.ingestion_status end,",
      "    raw_metadata = media.raw_metadata || incoming.raw_metadata, updated_at = now()",
      "  from incoming",
      "  where media.event_id = incoming.event_id and media.activation_id is not distinct from incoming.activation_id",
      "    and media.occurrence_id is null and media.role = 'primary' and media.is_active",
      "  returning media.id",
      ")",
      "insert into public.event_media (",
      "  event_id, activation_id, url, public_url, role, source_url, storage_provider, ingestion_status, raw_metadata",
      ")",
      "select incoming.event_id, incoming.activation_id, incoming.url, incoming.public_url, 'primary',",
      "  incoming.source_url, incoming.storage_provider, incoming.ingestion_status, incoming.raw_metadata",
      "from incoming",
      "where not exists (",
      "  select 1 from public.event_media media",
      "  where media.event_id = incoming.event_id and media.activation_id is not distinct from incoming.activation_id",
      "    and media.occurrence_id is null and media.role = 'primary' and media.is_active",
      ")",
    ].join(" "),
    [JSON.stringify(rows)],
  );

  return rows.length;
}

async function upsertSources(client, records) {
  const rows = collectSourceRows(records);
  const { rows: upserted } = await client.query(
    [
      "with incoming as (",
      "  select * from jsonb_to_recordset($1::jsonb) as row(",
      "    url text, name text, publisher text, source_type text, fetched_at timestamptz, sourced_at timestamptz, raw_metadata jsonb",
      "  )",
      "), upserted as (",
      "  insert into public.sources (name, url, publisher, source_type, fetched_at, sourced_at, raw_metadata)",
      "  select name, url, publisher, source_type, fetched_at, sourced_at, raw_metadata",
      "  from incoming",
      "  on conflict (url) do update set",
      "    name = excluded.name,",
      "    publisher = excluded.publisher,",
      "    source_type = excluded.source_type,",
      "    fetched_at = coalesce(excluded.fetched_at, public.sources.fetched_at),",
      "    sourced_at = excluded.sourced_at,",
      "    raw_metadata = public.sources.raw_metadata || excluded.raw_metadata,",
      "    updated_at = now()",
      "  returning id, url",
      ")",
      "select id, url from upserted",
    ].join(" "),
    [JSON.stringify(rows)],
  );

  return new Map(upserted.map((row) => [row.url, row.id]));
}

async function linkSources(client, records, sourceIds, eventIds, activationIds) {
  const links = [];
  const occurrenceRows = await client.query(
    [
      "select id, legacy_id, event_id",
      "from public.event_occurrences",
      "where event_id = any($1::uuid[])",
    ].join(" "),
    [records.map((record) => eventIds.get(record.rawEvent.id)).filter(Boolean)],
  );
  const occurrenceByLegacy = new Map(occurrenceRows.rows.map((row) => [row.legacy_id, row.id]));

  for (const record of records) {
    const event = record.rawEvent;
    const eventId = eventIds.get(event.id);
    const eventSourceId = sourceIds.get(event.url);
    if (eventId && eventSourceId) {
      links.push({
        entity_type: "event",
        entity_id: eventId,
        source_id: eventSourceId,
        relationship: "official",
        sourced_at: record.sourceRun.sourcedAt,
        raw_metadata: { source: "weekly_events", eventId: event.id },
      });
    }

    const sourceableActivations = event.activations?.length
      ? event.activations
      : [{ id: `${event.id}-venue`, title: event.title, url: event.url }];
    for (const activation of sourceableActivations) {
      const sourceId = sourceIds.get(activation.url ?? event.url);
      const occurrenceId = occurrenceByLegacy.get(activation.id);
      const activationId = activationIds.get(activationMapKey(event, activation));
      if (!sourceId) {
        continue;
      }
      if (activationId) {
        links.push({
          entity_type: "event_activation",
          entity_id: activationId,
          source_id: sourceId,
          relationship: "official",
          sourced_at: record.sourceRun.sourcedAt,
          raw_metadata: { source: "weekly_events", eventId: event.id, activationId: activation.id },
        });
      }
      if (occurrenceId) {
        links.push({
          entity_type: "event_occurrence",
          entity_id: occurrenceId,
          source_id: sourceId,
          relationship: "official",
          sourced_at: record.sourceRun.sourcedAt,
          raw_metadata: { source: "weekly_events", eventId: event.id, activationId: activation.id },
        });
      }
    }
  }

  const deduped = [...new Map(links.map((link) => [`${link.entity_type}:${link.entity_id}:${link.source_id}:${link.relationship}`, link])).values()];
  if (!deduped.length) {
    return 0;
  }

  const result = await client.query(
    [
      "insert into public.entity_sources (entity_type, entity_id, source_id, relationship, sourced_at, raw_metadata)",
      "select entity_type::public.rguide_source_entity_type, entity_id, source_id, relationship, sourced_at, raw_metadata",
      "from jsonb_to_recordset($1::jsonb) as row(",
      "  entity_type text, entity_id uuid, source_id uuid, relationship text, sourced_at timestamptz, raw_metadata jsonb",
      ")",
      "on conflict (entity_type, entity_id, source_id, relationship) do update set",
      "  sourced_at = excluded.sourced_at,",
      "  raw_metadata = public.entity_sources.raw_metadata || excluded.raw_metadata",
    ].join(" "),
    [JSON.stringify(deduped)],
  );

  return result.rowCount;
}

async function upsertPublications(client, records, cityIds, runIds, eventIds, sourceIds) {
  const rows = records.map((record) => {
    const event = record.rawEvent;
    const runLegacyId = `${record.sourceRun.cityId}:${slugify(record.sourceRun.weekLabel)}:${record.sourceRun.sourcedAt}`;
    const { weekStart, weekEnd } = parseWeekLabel(record.sourceRun);
    return {
      source_run_id: runIds.get(runLegacyId),
      event_id: eventIds.get(event.id),
      city_id: cityIds.get(record.cityId),
      destination_id: cityIds.get(record.cityId),
      week_start: weekStart,
      week_end: weekEnd,
      week_label: record.sourceRun.weekLabel,
      sourced_at: record.sourceRun.sourcedAt,
      event_category: event.category,
      has_schedule: Boolean(event.activations?.length),
      is_festival: Boolean(event.activations?.length && event.activations.length > 1),
      timezone: event.timezone ?? record.sourceRun.timezone,
      starts_at: event.startsAt,
      ends_at: event.endsAt ?? null,
      rendered_map_list: { ...record.guide, submissionType: "event" },
      raw_event: event,
    };
  });

  const { rows: upserted } = await client.query(
    [
      "with incoming as (",
      "  select * from jsonb_to_recordset($1::jsonb) as row(",
      "    source_run_id uuid, event_id uuid, city_id uuid, destination_id uuid, week_start date, week_end date,",
      "    week_label text, sourced_at timestamptz, event_category text, has_schedule boolean, is_festival boolean,",
      "    timezone text, starts_at timestamptz, ends_at timestamptz, rendered_map_list jsonb, raw_event jsonb",
      "  )",
      "), upserted as (",
      "  insert into public.weekly_event_publications (",
      "    source_run_id, event_id, city_id, destination_id, week_start, week_end, week_label, sourced_at,",
      "    submission_type, event_category, has_schedule, is_festival, timezone, starts_at, ends_at,",
      "    rendered_map_list, raw_event",
      "  )",
      "  select source_run_id, event_id, city_id, destination_id, week_start, week_end, week_label, sourced_at,",
      "    'event', event_category, has_schedule, is_festival, timezone, starts_at, ends_at, rendered_map_list, raw_event",
      "  from incoming",
      "  on conflict (event_id, week_start) do update set",
      "    source_run_id = excluded.source_run_id,",
      "    city_id = excluded.city_id,",
      "    destination_id = excluded.destination_id,",
      "    week_end = excluded.week_end,",
      "    week_label = excluded.week_label,",
      "    sourced_at = excluded.sourced_at,",
      "    submission_type = 'event',",
      "    event_category = excluded.event_category,",
      "    has_schedule = excluded.has_schedule,",
      "    is_festival = excluded.is_festival,",
      "    timezone = excluded.timezone,",
      "    starts_at = excluded.starts_at,",
      "    ends_at = excluded.ends_at,",
      "    rendered_map_list = excluded.rendered_map_list,",
      "    raw_event = excluded.raw_event,",
      "    updated_at = now()",
      "  returning id, event_id",
      ")",
      "select id, event_id from upserted",
    ].join(" "),
    [JSON.stringify(rows)],
  );

  const publicationLinks = [];
  const publicationByEventId = new Map(upserted.map((row) => [row.event_id, row.id]));
  for (const record of records) {
    const eventId = eventIds.get(record.rawEvent.id);
    const publicationId = publicationByEventId.get(eventId);
    const sourceId = sourceIds.get(record.rawEvent.url);
    if (!publicationId || !sourceId) {
      continue;
    }
    publicationLinks.push({
      entity_type: "weekly_event_publication",
      entity_id: publicationId,
      source_id: sourceId,
      relationship: "official",
      sourced_at: record.sourceRun.sourcedAt,
      raw_metadata: { source: "weekly_events", eventId: record.rawEvent.id },
    });
  }

  if (publicationLinks.length) {
    await client.query(
      [
        "insert into public.entity_sources (entity_type, entity_id, source_id, relationship, sourced_at, raw_metadata)",
        "select entity_type::public.rguide_source_entity_type, entity_id, source_id, relationship, sourced_at, raw_metadata",
        "from jsonb_to_recordset($1::jsonb) as row(",
        "  entity_type text, entity_id uuid, source_id uuid, relationship text, sourced_at timestamptz, raw_metadata jsonb",
        ")",
        "on conflict (entity_type, entity_id, source_id, relationship) do update set",
        "  sourced_at = excluded.sourced_at,",
        "  raw_metadata = public.entity_sources.raw_metadata || excluded.raw_metadata",
      ].join(" "),
      [JSON.stringify(publicationLinks)],
    );
  }

  return upserted.length;
}

async function verifyPublishedScope(client, records, cityIds) {
  const cityIdValues = uniqueValues(records.map((record) => cityIds.get(record.cityId)).filter(Boolean));
  const legacyIds = records.map((record) => record.rawEvent.id);
  const { rows } = await client.query(
    [
      "select",
      "  (select count(*)::int from public.events where legacy_id = any($2::text[])) as event_count,",
      "  (select count(*)::int from public.event_activations activation",
      "    join public.events event on event.id = activation.event_id",
      "    where event.legacy_id = any($2::text[])) as activation_count,",
      "  (select count(*)::int from public.event_occurrences occurrence",
      "    join public.events event on event.id = occurrence.event_id",
      "    where event.legacy_id = any($2::text[])) as occurrence_count,",
      "  (select count(*)::int from public.venues where city_id = any($1::uuid[]) and source_metadata->>'source' = 'weekly_events') as weekly_event_venue_count,",
      "  (select count(*)::int from public.weekly_event_publications where city_id = any($1::uuid[]) and rendered_map_list->>'id' = any($3::text[])) as publication_count,",
      "  (select count(*)::int from public.weekly_events_maplist where city_id = any($1::uuid[]) and guide->>'id' = any($3::text[])) as maplist_count",
    ].join(" "),
    [
      cityIdValues,
      legacyIds,
      records.map((record) => record.id),
    ],
  );

  const badSubmissionTypes = records.filter((record) => record.guide.submissionType !== "event").map((record) => record.id);
  if (badSubmissionTypes.length) {
    throw new Error(`Weekly event rendered guides missing submissionType=event: ${badSubmissionTypes.join(", ")}`);
  }

  return rows[0];
}

async function publishWeeklyEvents(client, selectedRecords, dryRun) {
  const runs = collectRuns(selectedRecords);
  logPhase("phase city_lookup:start", { runs: runs.length });
  const cityIds = await resolveCityIds(client, runs);
  logPhase("phase city_lookup:done");

  logPhase("phase publishing_settings:start", { rows: runs.length });
  await upsertPublishingSettings(client, runs, cityIds);
  logPhase("phase publishing_settings:done", { affected: runs.length });

  logPhase("phase source_runs:start", { rows: runs.length });
  const runIds = await upsertSourceRuns(client, runs, selectedRecords, cityIds);
  logPhase("phase source_runs:done", { affected: runIds.size });

  logPhase("phase venues:start");
  const venueIds = await upsertVenues(client, selectedRecords, cityIds);
  logPhase("phase venues:done", { affected: venueIds.size });

  logPhase("phase events:start", { rows: selectedRecords.length });
  const eventIds = await upsertEvents(client, selectedRecords, cityIds, runIds, venueIds);
  logPhase("phase events:done", { affected: eventIds.size });

  logPhase("phase activations:start");
  const activationIds = await upsertActivations(client, selectedRecords, eventIds, venueIds);
  logPhase("phase activations:done", { affected: activationIds.size });

  logPhase("phase occurrences:start");
  const occurrenceCount = await replaceOccurrences(
    client,
    selectedRecords,
    cityIds,
    runIds,
    venueIds,
    eventIds,
    activationIds,
  );
  logPhase("phase occurrences:done", { affected: occurrenceCount });

  logPhase("phase event_media:start");
  const eventMediaCount = await upsertEventMedia(client, selectedRecords, eventIds, activationIds);
  logPhase("phase event_media:done", { affected: eventMediaCount });

  logPhase("phase sources:start");
  const sourceIds = await upsertSources(client, selectedRecords);
  const sourceLinkCount = await linkSources(client, selectedRecords, sourceIds, eventIds, activationIds);
  logPhase("phase sources:done", { sources: sourceIds.size, links: sourceLinkCount });

  logPhase("phase publications:start", { rows: selectedRecords.length });
  const publicationCount = await upsertPublications(client, selectedRecords, cityIds, runIds, eventIds, sourceIds);
  logPhase("phase publications:done", { affected: publicationCount });

  logPhase("phase verification:start");
  const verification = await verifyPublishedScope(client, selectedRecords, cityIds);
  logPhase("phase verification:done", verification);

  if (dryRun) {
    await client.query("rollback");
    logPhase("dry run rolled back");
  } else {
    await client.query("commit");
  }

  return {
    runs: runs.length,
    events: eventIds.size,
    activations: activationIds.size,
    occurrences: occurrenceCount,
    eventMedia: eventMediaCount,
    venues: venueIds.size,
    sources: sourceIds.size,
    sourceLinks: sourceLinkCount,
    publications: publicationCount,
    verification,
  };
}

async function main() {
  const startedAt = process.hrtime.bigint();
  loadEnvFile(path.join(ROOT, ".env.local"));
  loadEnvFile(path.join(ROOT, ".env"));

  const { dryRun, filters } = parsePublishArgs(process.argv.slice(2));
  const allRecords = loadWeeklyEventGuideRecords();
  const selectedRecords = filterWeeklyEventRecords(allRecords, filters);

  logPhase("selected events", {
    scope: describeWeeklyEventFilters(filters),
    count: selectedRecords.length,
    dryRun,
  });

  if (!selectedRecords.length) {
    throw new Error("No weekly events matched the selected filters.");
  }

  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    throw new Error("Set SUPABASE_DB_URL, SUPABASE_DATABASE_URL, or DATABASE_URL.");
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: getPgSslConfig(databaseUrl),
  });

  try {
    await client.connect();
    await client.query("begin");
    const stats = await publishWeeklyEvents(client, selectedRecords, dryRun);
    console.log(JSON.stringify({
      ok: true,
      dryRun,
      scope: describeWeeklyEventFilters(filters),
      selectedEvents: selectedRecords.length,
      stats,
      elapsedMs: elapsedMs(startedAt),
    }, null, 2));
  } catch (error) {
    await client.query("rollback").catch(() => {});
    console.error("PUSH_WEEKLY_EVENTS_FAILED");
    console.error(error instanceof Error ? error.stack || error.message : error);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}

main();
