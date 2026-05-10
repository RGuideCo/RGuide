# rGuide Supabase Normalized Schema

This is the source-of-truth reference for the move away from JSON blob tables.

Primary migrations:

- [supabase/20260510_normalized-content-schema.sql](/Users/brodriguez/Projects/rGuide/supabase/20260510_normalized-content-schema.sql)
- [supabase/20260511_normalized-render-cache.sql](/Users/brodriguez/Projects/rGuide/supabase/20260511_normalized-render-cache.sql)

## Schema Overview

The model separates normalized source-of-truth tables from rendered app payloads.

Source-of-truth tables:

- `destinations`: canonical continent, continent-region, country, country-region/state, city, and neighborhood entities.
- `destination_descriptions_v2`: destination copy keyed by `destination_id`.
- `venues`: reusable places where events happen and entry stops can point.
- `entries`: normalized editorial guides, journals, itineraries, and event cards.
- `entry_stops`: ordered normalized stops.
- `events`: canonical event records.
- `event_occurrences`: dated schedule items, screenings, activations, and festival items.
- `sources`, `entity_sources`: reusable attribution for destinations, entries, stops, venues, events, and occurrences.
- `event_city_publishing_settings`: per-city event populator cadence and source configuration.
- `event_source_runs`: city-scoped monthly discovery, weekly publishing, daily refresh, and manual backfill runs.

Rendered/cache compatibility surfaces:

- `entries_maplist`: view that emits the frontend `MapList` shape from normalized `entries`, `entry_stops`, and source joins.
- `entry_render_cache`: schema-owned cached `MapList` payloads for stable fallback and static HTML protection.
- `weekly_events_maplist`: view that emits weekly event `MapList` cards.
- `weekly_event_publications`: rendered weekly event publishing cache with explicit query columns.

The legacy blob tables `editorial_guides`, `destination_descriptions`, and `weekly_event_guides` are no longer runtime fallbacks. They may remain temporarily as archival/backfill inputs until destructive cleanup is approved.

## Table Notes

`destinations`

Canonical destination hierarchy. `scope` supports `continent`, `country`, `region`, `state`, `city`, and `neighborhood`. A `region` can sit directly under a continent or under a country. Venue-like areas such as Waterfront, Museum District, or Old Town are modeled as neighborhoods, not venues. `legacy_id` maps old app IDs like `barcelona`, `country:usa`, or generated neighborhood IDs.

`destination_descriptions_v2`

Normalized descriptions keyed by `destination_id`. Runtime reads prefer this table only. Build-time HTML may use local static descriptions so Awin and other crawlers still see stable readable pages if the database is unavailable during build.

`venues`

Reusable venue/place entities with city and neighborhood links, address, coordinates, official URL, and source metadata. `events`, `event_occurrences`, and `entry_stops` can reference venues. Venue dedupe uses `city_id + normalized_name` for active venues, with `aliases` and `merged_into_venue_id` available for manual merges.

`entries`

First-class records for editorial guides, journals, itineraries, and event cards. `submission_type` is an enum with `guide`, `journal`, `itinerary`, and `event`; events are a submission type, not just a category. Current card fields are preserved as normalized columns: title, slug, SEO fields, description, highlights, photo, URL, category, creator, upvotes, created date, itinerary dates, and journal fields.

`entry_stops`

Ordered normalized stops. Stops can reference a destination, venue, event, or event occurrence. It preserves stop fields including coordinates, photo, price, booking URL, official URL, event time/venue labels, itinerary date/day, hours, and nested `places`.

`entry_render_cache`

Schema-correct fallback cache for rendered app payloads. This replaces the old `entries.cached_map_list` column and avoids falling back to `editorial_guides`. It stores current `MapList` JSON generated from `entries_maplist`, with `render_format`, `render_version`, `source_hash`, `is_current`, and stale metadata.

`events`

Canonical event records for weekly city publishing and future event pages. Events carry event category, guide category, timezone, date range, price, official URL, highlights, source metadata, `is_festival`, and `is_guide_worthy`. Events always use `submission_type = 'event'`; display grouping can still be itinerary-like through occurrences.

`event_occurrences`

Schedule items and activations. Use this for festival screenings, stage times, workshops, multi-venue activations, or repeated dates. This makes “has schedule” queryable instead of inferred from rendered JSON.

`sources`, `entity_sources`

`sources` deduplicates source name, URL, publisher, fetched/sourced times, excerpts, and raw metadata. `entity_sources` is the generic attribution table for destination descriptions, entries, entry stops, venues, events, and occurrences.

`event_source_runs`

One row per city event populator execution. Recommended cadence is monthly discovery for a 90-day lookahead, weekly publish for the next 14 days, and daily refresh for active published windows.

`event_city_publishing_settings`

One row per supported event city, including the top 40 city set. It ties the populator to `destinations.city_id`, stores timezone, source strategy, priority, and cadence/window settings.

`weekly_event_publications`

Rendered weekly event publishing cache. It has explicit query columns: `submission_type`, `event_category`, `has_schedule`, `is_festival`, `city_id`, `destination_id`, `timezone`, `source_run_id`, `starts_at`, and `ends_at`, plus `rendered_map_list`.

## Indexes And Constraints

Common query paths are indexed:

- Destination lookup: `(scope, slug)`, `(parent_id, scope)`, `(country_name, city_name)`.
- City entry pages: `entries(city_id, category, status)`, `entries(submission_type, status)`.
- Entry rendering: `entry_stops(entry_id, stop_order)`.
- Render cache fallback: `entry_render_cache(entry_id, render_format, render_version)` and current rendered payload lookups.
- City event feeds: `events(city_id, starts_at, status)`, `events(city_id, event_category, starts_at)`.
- Festival and guide-worthy filters: partial indexes on `events(city_id, is_festival)` and `events(city_id, is_guide_worthy)`.
- Schedules: `event_occurrences(event_id, starts_at)`.
- Event populator scheduling: `event_city_publishing_settings(is_active, city_priority, city_slug)` and source-run window indexes.
- Weekly publishing: `weekly_event_publications(city_id, week_start desc)`, `(city_id, event_category, starts_at)`, `(city_id, has_schedule, is_festival)`, and `source_run_id`.

Constraints keep important shape guarantees:

- Destination, venue, entry stop, and occurrence coordinates must be two-item JSON arrays.
- Event and occurrence `ends_at` cannot be before `starts_at`.
- Events must have `submission_type = 'event'`.
- Entry submission type is constrained by enum, not by category text.

## RLS Recommendations

The migration enables RLS on new tables and adds public read policies because rGuide content is publicly browsable. Entries, entry stops, source joins, and source rows are scoped so private journals are only readable by their owner.

Recommended write model:

- Service role only for `destinations`, `destination_descriptions_v2`, `venues`, `events`, `event_occurrences`, `sources`, source joins, event city publishing settings, source runs, render caches, and weekly publications.
- Authenticated users may insert/update/delete only their own rows in `entries`.
- Authenticated users may insert/update/delete `entry_stops` only when the parent `entries.user_id = auth.uid()`.
- Browser/user submission writes should go directly to normalized `entries` and `entry_stops`; `submitted_guides` should not remain the active write path.
- Ingestion scripts should stay server-side with the service role or direct Postgres connection.

## Backfill And Publishing

Backfill order:

1. Populate `destinations` from local geography.
2. Link and copy descriptions into `destination_descriptions_v2`.
3. Insert editorial content into `entries` and `entry_stops`.
4. Link venues and sources.
5. Generate `entry_render_cache` from `entries_maplist`.
6. Insert event city settings, source runs, canonical events, venues, occurrences, sources, and weekly publications.

Ongoing publishing should write normalized tables first, then refresh render caches:

- Editorial guide publish: upsert `entries`, `entry_stops`, `entity_sources`, then refresh `entry_render_cache`.
- Weekly event publish: upsert `events`, `event_occurrences`, `venues`, `sources`, `entity_sources`, `event_source_runs`, then refresh `weekly_event_publications`.
- Build-time HTML should stay stable using local/static payloads unless `RGUIDE_ALLOW_BUILD_DB=1` is explicitly set.

## App Integration

Current runtime reads:

- [src/lib/server-editorial-guides.ts](/Users/brodriguez/Projects/rGuide/src/lib/server-editorial-guides.ts): reads `entries_maplist` and `weekly_events_maplist`, with schema-owned fallback to `entry_render_cache` and `weekly_event_publications`.
- [src/lib/destination-descriptions.ts](/Users/brodriguez/Projects/rGuide/src/lib/destination-descriptions.ts): reads `destination_descriptions_v2`.
- [src/lib/supabase/editorial-guides.ts](/Users/brodriguez/Projects/rGuide/src/lib/supabase/editorial-guides.ts): browser fallback reads `entries_maplist`, then `entry_render_cache`.
- [src/lib/supabase/submitted-guides.ts](/Users/brodriguez/Projects/rGuide/src/lib/supabase/submitted-guides.ts): should be migrated to normalized writes before user submissions are enabled.

Important scale rule:

- Weekly event reads must be city-scoped for app views. Use `weekly_events_maplist` or `weekly_event_publications` filtered by selected `city_id`/`city_slug` and the active week instead of loading all cities at once.

## Cleanup Plan

1. Keep the old blob tables as archival inputs until production has run on normalized reads and render caches.
2. Move content publishing scripts to normalized-first writes.
3. Export a final backup of `editorial_guides`, `destination_descriptions`, and `weekly_event_guides`.
4. Apply a destructive cleanup migration only after approval.
5. Remove old SQL seed files and legacy push scripts once the normalized publishing path is the only path.
