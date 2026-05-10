# rGuide Supabase Normalized Schema

This is the source-of-truth reference for schema updates after the move away from content-blob tables. The migration is additive and lives at [supabase/20260510_normalized-content-schema.sql](/Users/brodriguez/Projects/rGuide/supabase/20260510_normalized-content-schema.sql).

## Schema Overview

The new model separates source-of-truth content from rendered app caches.

Source-of-truth tables:

- `destinations`: canonical continent, country, region/state, city, and neighborhood entities.
- `destination_descriptions_v2`: destination copy keyed by `destination_id`.
- `venues`: reusable places where events happen and entry stops can point.
- `entries`: normalized guides, journals, itineraries, and event wrappers.
- `entry_stops`: ordered entry stops with optional venue/event links.
- `events`: canonical event records.
- `event_occurrences`: dated schedule items, screenings, activations, or multi-day festival entries.
- `sources`, `entity_sources`: reusable source attribution.
- `event_city_publishing_settings`: per-city event populator cadence and source configuration.
- `event_source_runs`: city-scoped monthly discovery, weekly publishing, daily refresh, and manual backfill runs.

Rendered/cache compatibility tables and views:

- `weekly_event_publications`: rendered weekly event cards/cache, not the source of truth.
- `weekly_event_guides`: existing table kept and extended with explicit query columns.
- `entries_maplist`: emits the existing frontend `MapList` JSON shape from normalized entries.
- `weekly_events_maplist`: emits rendered weekly event `MapList` cards by city/week.
- Existing `editorial_guides`, `submitted_guides`, `destination_descriptions`, and `weekly_event_guides` remain intact during rollout.

## Table Notes

`destinations`

Canonical destination hierarchy. `scope` supports `continent`, `country`, `region`, `state`, `city`, and `neighborhood`. A `region` can sit directly under a continent, such as Europe regions, or under a country, such as Mexico's central/west/north regions. It preserves current app fields such as name, country, continent, coordinates, bounds, image, description, `list_count`, and nested `subareas` JSON. `legacy_id` maps old IDs like `barcelona`, `country:usa`, or generated neighborhood IDs.

Destination slugs are unique within their parent and scope, not globally. This avoids collisions such as multiple cities having a `downtown` or `old-town` neighborhood.

`destination_descriptions_v2`

Normalized descriptions keyed by `destination_id`. The old `destination_descriptions` table gets a nullable `destination_id` so backfill can link old rows without breaking reads.

`venues`

Reusable venue/place entities with city and neighborhood links, address, coordinates, official URL, and source metadata. `events`, `event_occurrences`, and `entry_stops` can all reference venues. Venue dedupe uses `city_id + normalized_name` for active venues, with `aliases` for alternate names and `merged_into_venue_id` for manual merges.

`entries`

First-class entry records. `submission_type` is an enum with `guide`, `journal`, `itinerary`, and `event`. Current card fields are preserved as columns or arrays: title, slug, SEO fields, description, highlights, photo, URL, category, creator, upvotes, created date, and itinerary/journal fields. `cached_map_list` is available for exact compatibility during migration.

`entry_stops`

Ordered normalized stops. Stops can reference a destination, venue, event, or event occurrence. It preserves current stop fields including coordinates, photo, price, booking/official URLs, event time/venue labels, itinerary date/day, hours, and nested `places`.

`events`

Canonical event records for weekly city publishing and regular event detail pages. Events carry event category, guide category, timezone, date range, price, official URL, highlights, source metadata, `is_festival`, and `is_guide_worthy`. City-published events require `city_id`, and published events require a start timestamp or start date. Events always use `submission_type = 'event'`; display grouping can still be itinerary-like via occurrences.

`event_occurrences`

Schedule items and activations. Use this for festival screenings, stage times, workshops, multi-venue activations, or repeated dates. This is what makes “has schedule” queryable instead of inferred from rendered JSON.

`sources`, `entity_sources`

`sources` deduplicates source name, URL, publisher, fetched/sourced times, excerpts, and raw metadata. `entity_sources` is the generic attribution table for destination descriptions, entries, entry stops, venues, events, and occurrences. Event attribution uses `entity_sources` with `entity_type = 'event'`; schedule-item attribution uses `entity_type = 'event_occurrence'`.

`event_source_runs`

One row per city event populator execution. `run_type` supports `monthly_discovery`, `weekly_publish`, `daily_refresh`, and `manual_backfill`. Monthly discovery should populate the canonical `events`, `event_occurrences`, `venues`, `sources`, and `entity_sources` tables for a longer lookahead window, typically 90 days. Weekly publish should refine the next publish window, typically 14 days, and create or update `weekly_event_publications`. Daily refresh should only re-check already-known active/published city windows for changes.

`event_city_publishing_settings`

One row per supported event city, including the top 40 city set. It ties the populator to `destinations` through `city_id`, stores timezone, source strategy, city priority, and cadence/window settings. Recommended defaults are monthly discovery with a 90-day window, weekly publishing with a 14-day window, and daily refresh with a 14-day window for active published weeks.

`weekly_event_publications`

Rendered weekly event publishing cache. It has explicit query columns: `submission_type`, `event_category`, `has_schedule`, `is_festival`, `city_id`, `destination_id`, `timezone`, `source_run_id`, `starts_at`, and `ends_at`, plus `rendered_map_list`.

## Indexes And Constraints

Common query paths are indexed:

- Destination lookup: `(scope, slug)`, `(parent_id, scope)`, `(country_name, city_name)`.
- City entry pages: `entries(city_id, category, status)`, `entries(submission_type, status)`.
- Entry rendering: `entry_stops(entry_id, stop_order)`.
- City event feeds: `events(city_id, starts_at, status)`, `events(city_id, event_category, starts_at)`.
- Festival/guide-worthy filters: partial indexes on `events(city_id, is_festival)` and `events(city_id, is_guide_worthy)`.
- Schedules: `event_occurrences(event_id, starts_at)`.
- Event populator scheduling: `event_city_publishing_settings(is_active, city_priority, city_slug)`, next-run indexes, and `event_source_runs(city_slug, run_type, window_start desc, sourced_at desc)`.
- Weekly publishing: `weekly_event_publications(city_id, week_start desc)`, `(city_id, event_category, starts_at)`, `(city_id, has_schedule, is_festival)`, and `source_run_id`.

Constraints keep important shape guarantees:

- Destination, venue, entry stop, and occurrence coordinates must be two-item JSON arrays.
- Event and occurrence `ends_at` cannot be before `starts_at`.
- Events must have `submission_type = 'event'`.
- Entry submission type is constrained by enum, not by category text.

## RLS Recommendations

The migration enables RLS on new tables and adds public read policies because rGuide content is publicly browsable. Entries, entry stops, source joins, and source rows are scoped so private journals are only readable by their owner.

Recommended write model:

- Service role only for `destinations`, `destination_descriptions_v2`, `venues`, `events`, `event_occurrences`, `sources`, source joins, event city publishing settings, source runs, and weekly publications.
- Authenticated users may insert/update/delete only their own rows in `entries` via `user_id`.
- Authenticated users may insert/update/delete `entry_stops` only when the parent `entries.user_id = auth.uid()`.
- Browser/user submission writes should go directly to normalized `entries` and `entry_stops`; `submitted_guides` should not remain the active write path.
- Keep ingestion scripts server-side with the service role or direct Postgres connection.

## Backfill Plan

1. Backfill destinations from `src/lib/mock-data.ts` and `src/data/geography.ts`.
   - Insert continents, continent-level regions, countries, country-level states/regions, cities, and neighborhoods into `destinations`.
   - Preserve old IDs in `legacy_id`.
   - Copy current app fields into coordinates, bounds, image, description, list counts, and `subareas`.

2. Link existing destination descriptions.
   - Match `destination_descriptions.entity_type + entity_id` to `destinations.legacy_id`.
   - Set `destination_descriptions.destination_id`.
   - Insert primary rows into `destination_descriptions_v2`.

3. Backfill editorial guides.
   - Read `editorial_guides.list`.
   - Insert one `entries` row per list with `legacy_id = editorial_guides.id`, `source_table = 'editorial_guides'`, and `cached_map_list = list`.
   - Resolve `city_id` and `neighborhood_id` from `list.location`.
   - Insert `entry_stops` from `list.stops`.
   - Upsert stop venues when a stop represents a named physical place.
   - Insert entry sources from `list.sources`.

4. Migrate any submitted guide leftovers.
   - There is no current user-submitted corpus expected, so do not preserve `submitted_guides` as an active write path.
   - If legacy rows appear, migrate them into `entries` and `entry_stops`, retaining `user_id`, then treat `submitted_guides` as deprecated compatibility data.

5. Backfill weekly event data.
   - Read `weekly_event_guides.raw_event` and local `src/data/weekly-events.ts`.
   - Insert one `event_city_publishing_settings` row for each supported city, starting with the top 40 event cities.
   - Insert `event_source_runs` from `source_run`, using `run_type = 'weekly_publish'` for existing weekly rows.
   - Insert one `events` row per raw event.
   - Insert venues from `venue` and activations.
   - Insert `event_occurrences` from `activations`; for single-date events, insert one occurrence for the venue/time if schedule detail is needed.
   - Insert sources from `sourceName` and `url`.
   - Insert `weekly_event_publications` with the rendered guide JSON.
   - Backfill explicit columns on `weekly_event_guides`: `submission_type = 'event'`, `event_category`, `has_schedule`, `is_festival`, city destination IDs, and `source_run_id`.

## App Integration Plan

Current files to update in stages:

- [src/lib/server-editorial-guides.ts](/Users/brodriguez/Projects/rGuide/src/lib/server-editorial-guides.ts): read from `entries_maplist` and `weekly_events_maplist` by selected city/week instead of loading all recent `weekly_event_guides`.
- [src/lib/destination-descriptions.ts](/Users/brodriguez/Projects/rGuide/src/lib/destination-descriptions.ts): prefer `destinations` and `destination_descriptions_v2`; fall back to old `destination_descriptions`.
- [src/lib/supabase/submitted-guides.ts](/Users/brodriguez/Projects/rGuide/src/lib/supabase/submitted-guides.ts): replace JSON writes to `submitted_guides` with normalized writes to `entries` and `entry_stops`.
- [src/data/weekly-events.ts](/Users/brodriguez/Projects/rGuide/src/data/weekly-events.ts): keep as local fallback, but ensure generated events use `submissionType: "event"` and map categories separately.
- [scripts/weekly-events-data.mjs](/Users/brodriguez/Projects/rGuide/scripts/weekly-events-data.mjs) and [scripts/push-weekly-events.mjs](/Users/brodriguez/Projects/rGuide/scripts/push-weekly-events.mjs): change from only writing `weekly_event_guides` JSON to upserting source runs, events, venues, occurrences, sources, and weekly publications.
- [scripts/editorial-guides-data.mjs](/Users/brodriguez/Projects/rGuide/scripts/editorial-guides-data.mjs) and [scripts/push-editorial-guides.mjs](/Users/brodriguez/Projects/rGuide/scripts/push-editorial-guides.mjs): add normalized upsert mode while continuing to refresh `editorial_guides` during rollout.
- [src/types/index.ts](/Users/brodriguez/Projects/rGuide/src/types/index.ts): no immediate breaking change. `MapList` remains the frontend compatibility contract.

Important query change:

- Current `server-editorial-guides.ts` loads all weekly rows newer than 14 days. Replace that with city-scoped reads such as `weekly_events_maplist where city_id = $1 and week_start <= current_date and week_end >= current_date`, or an RPC that takes `city_slug`.

## Staged Rollout

1. Schema first.
   - Apply the additive migration.
   - No app reads change yet.
   - Existing tables and JSON cards remain live.

2. Backfill second.
   - Populate `destinations`, `venues`, normalized entries/stops, events/occurrences, and sources.
   - Keep `cached_map_list` and `weekly_event_publications.rendered_map_list` populated so UI output stays identical.

3. App reads third.
   - Switch server reads to compatibility views.
   - Scope weekly event queries by selected city and current week.
   - Keep local weekly event seed data as fallback only.

4. Dual-write and validation.
   - Update push scripts to write both normalized source tables and rendered cache rows.
   - Compare `entries_maplist.list` against existing `editorial_guides.list` snapshots for representative cities.

5. Cleanup last.
   - Stop treating `editorial_guides`, `destination_descriptions`, and `weekly_event_guides` as source-of-truth tables.
   - Keep them as generated compatibility exports until the frontend no longer needs them.
   - Remove blob-only paths after production read traffic is fully on normalized views.
