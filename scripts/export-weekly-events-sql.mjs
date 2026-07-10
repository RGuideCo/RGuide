import process from "node:process";
import { createHash } from "node:crypto";

import {
  describeWeeklyEventFilters,
  filterWeeklyEventRecords,
  loadWeeklyEventGuideRecords,
  parseWeeklyEventArgs,
} from "./weekly-events-data.mjs";

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

function sqlLiteral(value) {
  if (value === null || value === undefined) {
    return "null";
  }
  return `'${String(value).replaceAll("'", "''")}'`;
}

function jsonLiteral(value) {
  return `${sqlLiteral(JSON.stringify(value ?? null))}::jsonb`;
}

function arrayLiteral(values) {
  return `array[${(values ?? []).map(sqlLiteral).join(", ")}]::text[]`;
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

function runLegacyId(run) {
  return `${run.cityId}:${slugify(run.weekLabel)}:${run.sourcedAt}`;
}

function cityIdSql(citySlug) {
  return `(select id from public.destinations where scope = 'city' and slug = ${sqlLiteral(citySlug)} limit 1)`;
}

function sourceRunIdSql(run) {
  return `(select id from public.event_source_runs where legacy_id = ${sqlLiteral(runLegacyId(run))})`;
}

function eventIdSql(eventId) {
  return `(select id from public.events where legacy_id = ${sqlLiteral(eventId)})`;
}

function activationLegacyId(event, activation) {
  const identity = String(activation.title ?? event.title).trim().toLowerCase();
  const hash = createHash("md5").update(identity).digest("hex");
  return `${event.id}:activation:${hash}`;
}

function activationIdSql(event, activation) {
  return `(select id from public.event_activations where event_id = ${eventIdSql(event.id)} and legacy_id = ${sqlLiteral(activationLegacyId(event, activation))})`;
}

function sourceIdSql(url) {
  return `(select id from public.sources where url = ${sqlLiteral(url)})`;
}

function venueIdSql(citySlug, venueName) {
  return `(select id from public.venues where city_id = ${cityIdSql(citySlug)} and slug = ${sqlLiteral(slugify(venueName))} limit 1)`;
}

function publicationIdSql(eventId, weekStart) {
  return `(select id from public.weekly_event_publications where event_id = ${eventIdSql(eventId)} and week_start = ${sqlLiteral(weekStart)}::date)`;
}

function collectRuns(records) {
  const runsByKey = new Map();
  for (const record of records) {
    runsByKey.set(runLegacyId(record.sourceRun), record.sourceRun);
  }
  return [...runsByKey.values()];
}

function collectVenues(records) {
  const venues = new Map();
  for (const record of records) {
    const addVenue = (name, coordinates, url, eventId) => {
      const key = `${record.cityId}:${slugify(name)}`;
      venues.set(key, {
        cityId: record.cityId,
        name,
        slug: slugify(name),
        normalizedName: normalizeName(name),
        coordinates: normalizeCoordinates(coordinates),
        country: record.country,
        officialUrl: url,
        metadata: { source: "weekly_events", eventId },
      });
    };
    addVenue(record.rawEvent.venue, record.rawEvent.coordinates, record.rawEvent.url, record.rawEvent.id);
    for (const activation of record.rawEvent.activations ?? []) {
      addVenue(activation.venue, activation.coordinates ?? record.rawEvent.coordinates, activation.url ?? record.rawEvent.url, record.rawEvent.id);
    }
  }
  return [...venues.values()];
}

function collectSources(records) {
  const sources = new Map();
  for (const record of records) {
    sources.set(record.rawEvent.url, {
      name: record.rawEvent.sourceName,
      url: record.rawEvent.url,
      publisher: record.rawEvent.sourceName,
      type: "weekly_event",
      sourcedAt: record.sourceRun.sourcedAt,
      metadata: { source: "weekly_events", eventId: record.rawEvent.id },
    });
    for (const activation of record.rawEvent.activations ?? []) {
      if (!activation.url) {
        continue;
      }
      sources.set(activation.url, {
        name: record.rawEvent.sourceName,
        url: activation.url,
        publisher: record.rawEvent.sourceName,
        type: "weekly_event_activation",
        sourcedAt: record.sourceRun.sourcedAt,
        metadata: { source: "weekly_events", eventId: record.rawEvent.id, activationId: activation.id },
      });
    }
  }
  return [...sources.values()];
}

function printHeader(records, filters) {
  console.log("-- Normalized weekly event export for rGuide.");
  console.log(`-- Scope: ${describeWeeklyEventFilters(filters)}`);
  console.log(`-- Records: ${records.length}`);
  console.log("-- Source-of-truth tables: event_city_publishing_settings, event_source_runs, venues, events, event_occurrences, sources, entity_sources, weekly_event_publications.");
  console.log("-- Rendered MapList JSON is written only to weekly_event_publications.rendered_map_list as frontend cache.");
  console.log("begin;");
}

function printRuns(runs, records) {
  for (const run of runs) {
    const { weekStart, weekEnd } = parseWeekLabel(run);
    const selectedCount = records.filter((record) => record.sourceRun === run).length;
    console.log(`
insert into public.event_city_publishing_settings (
  city_id, destination_id, city_slug, city_name, timezone, is_active,
  publish_cadence, refresh_cadence, discovery_cadence, source_strategy, metadata, last_publish_run_at
) values (
  ${cityIdSql(run.cityId)}, ${cityIdSql(run.cityId)}, ${sqlLiteral(run.cityId)}, ${sqlLiteral(run.cityName)}, ${sqlLiteral(run.timezone)}, true,
  'weekly', 'daily', 'monthly', ${arrayLiteral(run.sourceStrategy)}, ${jsonLiteral({ source: "weekly_events", weekLabel: run.weekLabel })}, now()
)
on conflict (city_slug) do update set
  city_id = excluded.city_id,
  destination_id = excluded.destination_id,
  city_name = excluded.city_name,
  timezone = excluded.timezone,
  is_active = true,
  source_strategy = excluded.source_strategy,
  metadata = public.event_city_publishing_settings.metadata || excluded.metadata,
  last_publish_run_at = now(),
  updated_at = now();

insert into public.event_source_runs (
  legacy_id, publishing_settings_id, run_type, city_id, destination_id, city_slug, city_name,
  window_start, window_end, publish_week_start, publish_week_end, window_label, sourced_at,
  timezone, source_strategy, status, events_found_count, events_published_count, raw_payload
) values (
  ${sqlLiteral(runLegacyId(run))},
  (select id from public.event_city_publishing_settings where city_slug = ${sqlLiteral(run.cityId)}),
  'weekly_publish', ${cityIdSql(run.cityId)}, ${cityIdSql(run.cityId)}, ${sqlLiteral(run.cityId)}, ${sqlLiteral(run.cityName)},
  ${sqlLiteral(weekStart)}::date, ${sqlLiteral(weekEnd)}::date, ${sqlLiteral(weekStart)}::date, ${sqlLiteral(weekEnd)}::date,
  ${sqlLiteral(run.weekLabel)}, ${sqlLiteral(run.sourcedAt)}::timestamptz, ${sqlLiteral(run.timezone)}, ${arrayLiteral(run.sourceStrategy)},
  'completed', ${run.events.length}, ${selectedCount}, ${jsonLiteral({ source: "weekly_events", cityId: run.cityId, weekLabel: run.weekLabel })}
)
on conflict (legacy_id) do update set
  publishing_settings_id = excluded.publishing_settings_id,
  city_id = excluded.city_id,
  destination_id = excluded.destination_id,
  window_start = excluded.window_start,
  window_end = excluded.window_end,
  publish_week_start = excluded.publish_week_start,
  publish_week_end = excluded.publish_week_end,
  window_label = excluded.window_label,
  sourced_at = excluded.sourced_at,
  timezone = excluded.timezone,
  source_strategy = excluded.source_strategy,
  status = 'completed',
  events_found_count = excluded.events_found_count,
  events_published_count = excluded.events_published_count,
  raw_payload = public.event_source_runs.raw_payload || excluded.raw_payload,
  updated_at = now();`);
  }
}

function printVenues(records) {
  for (const venue of collectVenues(records)) {
    console.log(`
insert into public.venues (
  slug, name, normalized_name, city_id, destination_id, country, coordinates, official_url, venue_kind, source_metadata
) values (
  ${sqlLiteral(venue.slug)}, ${sqlLiteral(venue.name)}, ${sqlLiteral(venue.normalizedName)},
  ${cityIdSql(venue.cityId)}, ${cityIdSql(venue.cityId)}, ${sqlLiteral(venue.country)},
  ${jsonLiteral(venue.coordinates)}, ${sqlLiteral(venue.officialUrl)}, 'event_venue', ${jsonLiteral(venue.metadata)}
)
on conflict (city_id, slug) do update set
  name = excluded.name,
  normalized_name = excluded.normalized_name,
  coordinates = coalesce(excluded.coordinates, public.venues.coordinates),
  official_url = coalesce(excluded.official_url, public.venues.official_url),
  venue_kind = case when public.venues.venue_kind = 'other' then 'event_venue'::public.venue_kind else public.venues.venue_kind end,
  source_metadata = public.venues.source_metadata || excluded.source_metadata,
  updated_at = now();`);
  }
}

function printSources(records) {
  for (const source of collectSources(records)) {
    console.log(`
insert into public.sources (name, url, publisher, source_type, fetched_at, sourced_at, raw_metadata)
values (
  ${sqlLiteral(source.name)}, ${sqlLiteral(source.url)}, ${sqlLiteral(source.publisher)}, ${sqlLiteral(source.type)},
  ${sqlLiteral(source.sourcedAt)}::timestamptz, ${sqlLiteral(source.sourcedAt)}::timestamptz, ${jsonLiteral(source.metadata)}
)
on conflict (url) do update set
  name = excluded.name,
  publisher = excluded.publisher,
  source_type = excluded.source_type,
  fetched_at = coalesce(excluded.fetched_at, public.sources.fetched_at),
  sourced_at = excluded.sourced_at,
  raw_metadata = public.sources.raw_metadata || excluded.raw_metadata,
  updated_at = now();`);
  }
}

function printEvents(records) {
  for (const record of records) {
    const event = record.rawEvent;
    const guide = { ...record.guide, submissionType: "event" };
    console.log(`
insert into public.events (
  legacy_id, slug, title, description, highlights, event_category, guide_category, status,
  city_id, destination_id, venue_id, timezone, starts_at, ends_at, starts_on, ends_on,
  price_label, official_url, photo_url, is_festival, is_guide_worthy, guide_reason,
  submission_type, raw_metadata, discovery_source_run_id, latest_refresh_source_run_id
) values (
  ${sqlLiteral(event.id)}, ${sqlLiteral(guide.slug)}, ${sqlLiteral(event.title)}, ${sqlLiteral(event.description)}, ${arrayLiteral(event.highlights)},
  ${sqlLiteral(event.category)}, ${sqlLiteral(guide.category)}, 'published',
  ${cityIdSql(record.cityId)}, ${cityIdSql(record.cityId)}, ${venueIdSql(record.cityId, event.venue)}, ${sqlLiteral(event.timezone ?? record.sourceRun.timezone)},
  ${sqlLiteral(event.startsAt)}::timestamptz, ${sqlLiteral(event.endsAt)}::timestamptz, ${sqlLiteral(event.startsAt.slice(0, 10))}::date, ${sqlLiteral(event.endsAt?.slice(0, 10))}::date,
  ${sqlLiteral(event.price)}, ${sqlLiteral(event.url)}, ${sqlLiteral(guide.photo)}, ${Boolean(event.activations?.length && event.activations.length > 1)},
  ${Boolean(event.isGuideWorthy)}, ${sqlLiteral(event.guideReason)}, 'event', ${jsonLiteral({ source: "weekly_events", rawEvent: event })},
  ${sourceRunIdSql(record.sourceRun)}, ${sourceRunIdSql(record.sourceRun)}
)
on conflict (legacy_id) do update set
  slug = excluded.slug,
  title = excluded.title,
  description = excluded.description,
  highlights = excluded.highlights,
  event_category = excluded.event_category,
  guide_category = excluded.guide_category,
  status = 'published',
  city_id = excluded.city_id,
  destination_id = excluded.destination_id,
  venue_id = excluded.venue_id,
  timezone = excluded.timezone,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  starts_on = excluded.starts_on,
  ends_on = excluded.ends_on,
  price_label = excluded.price_label,
  official_url = excluded.official_url,
  photo_url = excluded.photo_url,
  is_festival = excluded.is_festival,
  is_guide_worthy = excluded.is_guide_worthy,
  guide_reason = excluded.guide_reason,
  raw_metadata = public.events.raw_metadata || excluded.raw_metadata,
  latest_refresh_source_run_id = excluded.latest_refresh_source_run_id,
  updated_at = now();`);
  }
}

function printActivations(records) {
  for (const record of records) {
    const event = record.rawEvent;
    const activations = event.activations?.length
      ? event.activations
      : [{ id: `${event.id}-venue`, title: event.title, venue: event.venue, description: event.description, url: event.url }];
    const emitted = new Set();

    activations.forEach((activation, index) => {
      const legacyId = activationLegacyId(event, activation);
      if (emitted.has(legacyId)) {
        return;
      }
      emitted.add(legacyId);
      const hash = legacyId.slice(legacyId.lastIndexOf(":") + 1);
      console.log(`
insert into public.event_activations (
  event_id, legacy_id, slug, title, description, activation_category, venue_id,
  official_url, booking_url, price_label, sort_order, raw_metadata
) values (
  ${eventIdSql(event.id)}, ${sqlLiteral(legacyId)}, ${sqlLiteral(`${slugify(activation.title) || "activation"}-${hash.slice(0, 8)}`)},
  ${sqlLiteral(activation.title)}, ${sqlLiteral(activation.description)}, ${sqlLiteral(event.category)},
  ${venueIdSql(record.cityId, activation.venue ?? event.venue)}, ${sqlLiteral(activation.url ?? event.url)},
  ${sqlLiteral(activation.url ?? event.url)}, ${sqlLiteral(event.price)}, ${index + 1},
  ${jsonLiteral({ source: "weekly_events", eventId: event.id, activationIds: [activation.id] })}
)
on conflict (event_id, legacy_id) do update set
  slug = excluded.slug,
  title = excluded.title,
  description = excluded.description,
  activation_category = excluded.activation_category,
  venue_id = excluded.venue_id,
  official_url = excluded.official_url,
  booking_url = excluded.booking_url,
  price_label = excluded.price_label,
  sort_order = least(public.event_activations.sort_order, excluded.sort_order),
  raw_metadata = public.event_activations.raw_metadata || excluded.raw_metadata,
  updated_at = now();`);
    });
  }
}

function printOccurrences(records) {
  for (const record of records) {
    const event = record.rawEvent;
    console.log(`delete from public.event_occurrences where event_id = ${eventIdSql(event.id)};`);
    const activations = event.activations?.length
      ? event.activations
      : [{ id: `${event.id}-venue`, title: event.title, venue: event.venue, startsAt: event.startsAt, description: event.description, coordinates: event.coordinates, url: event.url }];

    activations.forEach((activation, index) => {
      const startsAt = activation.startsAt ?? event.startsAt;
      console.log(`
insert into public.event_occurrences (
  event_id, activation_id, legacy_id, title, description, venue_id, city_id, destination_id,
  starts_at, starts_on, timezone, price_label, booking_url, official_url,
  coordinates, occurrence_order, raw_metadata, source_run_id, latest_refresh_source_run_id
) values (
  ${eventIdSql(event.id)}, ${activationIdSql(event, activation)}, ${sqlLiteral(activation.id)}, ${sqlLiteral(activation.title)}, ${sqlLiteral(activation.description)},
  ${venueIdSql(record.cityId, activation.venue)}, ${cityIdSql(record.cityId)}, ${cityIdSql(record.cityId)},
  ${sqlLiteral(startsAt)}::timestamptz, ${sqlLiteral(startsAt.slice(0, 10))}::date, ${sqlLiteral(event.timezone ?? record.sourceRun.timezone)},
  ${sqlLiteral(event.price)}, ${sqlLiteral(activation.url ?? event.url)}, ${sqlLiteral(activation.url ?? event.url)},
  ${jsonLiteral(normalizeCoordinates(activation.coordinates ?? event.coordinates))}, ${index + 1},
  ${jsonLiteral({ source: "weekly_events", eventId: event.id, activationId: activation.id })},
  ${sourceRunIdSql(record.sourceRun)}, ${sourceRunIdSql(record.sourceRun)}
);`);
    });
  }
}

function printEventMedia(records) {
  const printPrimary = (event, activation, photo) => {
    if (!photo) return;
    const eventId = eventIdSql(event.id);
    const activationId = activation ? activationIdSql(event, activation) : "null";
    const isR2 = photo.startsWith("https://media.rguide.co/");
    console.log(`
update public.event_media
set
  url = case when ${Boolean(isR2)} or public_url is null then ${sqlLiteral(photo)} else url end,
  public_url = coalesce(${isR2 ? sqlLiteral(photo) : "null"}, public_url),
  source_url = coalesce(${sqlLiteral(photo)}, source_url),
  storage_provider = coalesce(${isR2 ? sqlLiteral("cloudflare_r2") : "null"}, storage_provider),
  ingestion_status = case when ${Boolean(isR2)} then 'uploaded' else ingestion_status end,
  raw_metadata = raw_metadata || ${jsonLiteral({ source: "weekly_events_sql_export", eventId: event.id })},
  updated_at = now()
where event_id = ${eventId}
  and activation_id is not distinct from ${activationId}
  and occurrence_id is null and role = 'primary' and is_active;

insert into public.event_media (
  event_id, activation_id, url, public_url, role, source_url,
  storage_provider, ingestion_status, raw_metadata
)
select
  ${eventId}, ${activationId}, ${sqlLiteral(photo)}, ${isR2 ? sqlLiteral(photo) : "null"}, 'primary',
  ${sqlLiteral(photo)}, ${isR2 ? sqlLiteral("cloudflare_r2") : "null"}, ${sqlLiteral(isR2 ? "uploaded" : "external")},
  ${jsonLiteral({ source: "weekly_events_sql_export", eventId: event.id })}
where not exists (
  select 1 from public.event_media media
  where media.event_id = ${eventId}
    and media.activation_id is not distinct from ${activationId}
    and media.occurrence_id is null and media.role = 'primary' and media.is_active
);`);
  };

  for (const record of records) {
    const event = record.rawEvent;
    printPrimary(event, null, record.guide.photo);
    for (const [index, activation] of (event.activations ?? []).entries()) {
      printPrimary(event, activation, record.guide.stops?.[index]?.photo);
    }
  }
}

function printPublications(records) {
  for (const record of records) {
    const event = record.rawEvent;
    const guide = { ...record.guide, submissionType: "event" };
    const { weekStart, weekEnd } = parseWeekLabel(record.sourceRun);
    console.log(`
insert into public.weekly_event_publications (
  source_run_id, event_id, city_id, destination_id, week_start, week_end, week_label, sourced_at,
  submission_type, event_category, has_schedule, is_festival, timezone, starts_at, ends_at,
  rendered_map_list, raw_event
) values (
  ${sourceRunIdSql(record.sourceRun)}, ${eventIdSql(event.id)}, ${cityIdSql(record.cityId)}, ${cityIdSql(record.cityId)},
  ${sqlLiteral(weekStart)}::date, ${sqlLiteral(weekEnd)}::date, ${sqlLiteral(record.sourceRun.weekLabel)}, ${sqlLiteral(record.sourceRun.sourcedAt)}::timestamptz,
  'event', ${sqlLiteral(event.category)}, ${Boolean(event.activations?.length)}, ${Boolean(event.activations?.length && event.activations.length > 1)},
  ${sqlLiteral(event.timezone ?? record.sourceRun.timezone)}, ${sqlLiteral(event.startsAt)}::timestamptz, ${sqlLiteral(event.endsAt)}::timestamptz,
  ${jsonLiteral(guide)}, ${jsonLiteral(event)}
)
on conflict (event_id, week_start) do update set
  source_run_id = excluded.source_run_id,
  city_id = excluded.city_id,
  destination_id = excluded.destination_id,
  week_end = excluded.week_end,
  week_label = excluded.week_label,
  sourced_at = excluded.sourced_at,
  submission_type = 'event',
  event_category = excluded.event_category,
  has_schedule = excluded.has_schedule,
  is_festival = excluded.is_festival,
  timezone = excluded.timezone,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  rendered_map_list = excluded.rendered_map_list,
  raw_event = excluded.raw_event,
  updated_at = now();`);
  }
}

function printSourceLinks(records) {
  for (const record of records) {
    const event = record.rawEvent;
    const { weekStart } = parseWeekLabel(record.sourceRun);
    console.log(`
insert into public.entity_sources (entity_type, entity_id, source_id, relationship, sourced_at, raw_metadata)
values
  ('event', ${eventIdSql(event.id)}, ${sourceIdSql(event.url)}, 'official', ${sqlLiteral(record.sourceRun.sourcedAt)}::timestamptz, ${jsonLiteral({ source: "weekly_events", eventId: event.id })}),
  ('weekly_event_publication', ${publicationIdSql(event.id, weekStart)}, ${sourceIdSql(event.url)}, 'official', ${sqlLiteral(record.sourceRun.sourcedAt)}::timestamptz, ${jsonLiteral({ source: "weekly_events", eventId: event.id })})
on conflict (entity_type, entity_id, source_id, relationship) do update set
  sourced_at = excluded.sourced_at,
  raw_metadata = public.entity_sources.raw_metadata || excluded.raw_metadata;`);
    const sourceableActivations = event.activations?.length
      ? event.activations
      : [{ id: `${event.id}-venue`, title: event.title, url: event.url }];
    for (const activation of sourceableActivations) {
      console.log(`
insert into public.entity_sources (entity_type, entity_id, source_id, relationship, sourced_at, raw_metadata)
values (
  'event_activation', ${activationIdSql(event, activation)}, ${sourceIdSql(activation.url ?? event.url)}, 'official',
  ${sqlLiteral(record.sourceRun.sourcedAt)}::timestamptz,
  ${jsonLiteral({ source: "weekly_events", eventId: event.id, activationId: activation.id })}
)
on conflict (entity_type, entity_id, source_id, relationship) do update set
  sourced_at = excluded.sourced_at,
  raw_metadata = public.entity_sources.raw_metadata || excluded.raw_metadata;

insert into public.entity_sources (entity_type, entity_id, source_id, relationship, sourced_at, raw_metadata)
select
  'event_occurrence',
  occurrence.id,
  ${sourceIdSql(activation.url ?? event.url)},
  'official',
  ${sqlLiteral(record.sourceRun.sourcedAt)}::timestamptz,
  ${jsonLiteral({ source: "weekly_events", eventId: event.id, activationId: activation.id })}
from public.event_occurrences occurrence
where occurrence.legacy_id = ${sqlLiteral(activation.id)}
on conflict (entity_type, entity_id, source_id, relationship) do update set
  sourced_at = excluded.sourced_at,
  raw_metadata = public.entity_sources.raw_metadata || excluded.raw_metadata;`);
    }
  }
}

function main() {
  const filters = parseWeeklyEventArgs(process.argv.slice(2));
  const records = filterWeeklyEventRecords(loadWeeklyEventGuideRecords(), filters);
  if (!records.length) {
    throw new Error("No weekly events matched the selected filters.");
  }

  printHeader(records, filters);
  printRuns(collectRuns(records), records);
  printVenues(records);
  printSources(records);
  printEvents(records);
  printActivations(records);
  printOccurrences(records);
  printEventMedia(records);
  printPublications(records);
  printSourceLinks(records);
  console.log("commit;");
}

main();
