# rGuide Supabase Normalized Schema

This is the source-of-truth reference for the move away from JSON blob tables.

Primary migrations:

- [supabase/20260510_normalized-content-schema.sql](/Users/brodriguez/Projects/rGuide/supabase/20260510_normalized-content-schema.sql)
- [supabase/20260511_normalized-render-cache.sql](/Users/brodriguez/Projects/rGuide/supabase/20260511_normalized-render-cache.sql)
- [supabase/20260513_venue-lodging-classification.sql](/Users/brodriguez/Projects/rGuide/supabase/20260513_venue-lodging-classification.sql)
- [supabase/20260514_backfill-stay-venue-classification.sql](/Users/brodriguez/Projects/rGuide/supabase/20260514_backfill-stay-venue-classification.sql)
- [supabase/20260515_food-venue-classification.sql](/Users/brodriguez/Projects/rGuide/supabase/20260515_food-venue-classification.sql)
- [supabase/20260516_backfill-food-venue-classification.sql](/Users/brodriguez/Projects/rGuide/supabase/20260516_backfill-food-venue-classification.sql)
- [supabase/20260517_nightlife-venue-classification.sql](/Users/brodriguez/Projects/rGuide/supabase/20260517_nightlife-venue-classification.sql)
- [supabase/20260518_backfill-nightlife-venue-classification.sql](/Users/brodriguez/Projects/rGuide/supabase/20260518_backfill-nightlife-venue-classification.sql)
- [supabase/20260519_venue-hours.sql](/Users/brodriguez/Projects/rGuide/supabase/20260519_venue-hours.sql)
- [supabase/20260520_backfill-venue-hours.sql](/Users/brodriguez/Projects/rGuide/supabase/20260520_backfill-venue-hours.sql)
- [supabase/20260710_schema_hardening.sql](/Users/brodriguez/Projects/rGuide/supabase/20260710_schema_hardening.sql)
- [supabase/20260710_event_entry_links.sql](/Users/brodriguez/Projects/rGuide/supabase/20260710_event_entry_links.sql)
- [supabase/20260710_event_activations_media.sql](/Users/brodriguez/Projects/rGuide/supabase/20260710_event_activations_media.sql)
- [supabase/20260710_event_fk_indexes.sql](/Users/brodriguez/Projects/rGuide/supabase/20260710_event_fk_indexes.sql)
- [supabase/20260710_event_primary_media_backfill.sql](/Users/brodriguez/Projects/rGuide/supabase/20260710_event_primary_media_backfill.sql)
- [supabase/20260710_entity_sources_policy_cleanup.sql](/Users/brodriguez/Projects/rGuide/supabase/20260710_entity_sources_policy_cleanup.sql)
- [supabase/20260710_legacy_archive_constraints_cleanup.sql](/Users/brodriguez/Projects/rGuide/supabase/20260710_legacy_archive_constraints_cleanup.sql)
- [supabase/20260710_event_activation_sources_backfill.sql](/Users/brodriguez/Projects/rGuide/supabase/20260710_event_activation_sources_backfill.sql)

## Schema Overview

The model separates normalized source-of-truth tables from rendered app payloads.

Source-of-truth tables:

- `destinations`: canonical continent, continent-region, country, country-region/state, city, and neighborhood entities.
- `destination_descriptions_v2`: destination copy keyed by `destination_id`.
- `destination_category_insights`, `destination_category_insight_chips`, `destination_category_insight_notes`: category-specific city and neighborhood notes for the left pane.
- `destination_category_neighborhood_strengths`: researched category/subcategory strength scores from a parent destination to child neighborhoods.
- `venues`: reusable places where events happen and entry stops can point.
- `venue_hours`, `venue_special_hours`: canonical weekly and date-specific venue hours.
- `venue_tags`, `venue_taggings`: normalized, filterable venue attributes.
- `entries`: normalized editorial guides, journals, journeys, and event cards.
- `entry_stops`: ordered normalized stops.
- `events`: canonical event records.
- `event_activations`: stable films, performances, sessions, workshops, and other nested event program items.
- `event_occurrences`: dated times and venue assignments for activations.
- `event_media`: canonical event, activation, and occurrence artwork.
- `sources`, `entity_sources`: reusable attribution for destinations, entries, stops, venues, events, activations, and occurrences.
- `event_city_publishing_settings`: per-city event populator cadence and source configuration.
- `event_source_runs`: city-scoped monthly discovery, weekly publishing, daily refresh, and manual backfill runs.

Rendered/cache compatibility surfaces:

- `entries_maplist`: view that emits the frontend `MapList` shape from normalized `entries`, `entry_stops`, and source joins.
- `event_schedule_items`: security-invoker view for expanded festival cards, with activations, occurrences, physical venues, and canonical media.
- `entry_render_cache`: schema-owned cached `MapList` payloads for stable fallback and static HTML protection.
- `weekly_events_maplist`: view that emits weekly event `MapList` cards.
- `weekly_event_publications`: rendered weekly event publishing cache with explicit query columns.
- `stay_venues`: city-scoped lodging search view for hotels, hostels, resorts, rentals, apartment hotels, guesthouses, camping, and holiday parks.
- `food_venues`: city-scoped food search view for restaurants, cafes, fast food, stalls, food trucks, food carts, cuisine, price, and attributes.
- `nightlife_venues`: city-scoped nightlife search view for bars, clubs, music venues, theatres, concert halls, comedy clubs, genres, price, and attributes.
- `venue_hours_current`: current weekly and upcoming special hours for venue detail/search surfaces.

The legacy blob tables `editorial_guides`, `destination_descriptions`, `weekly_event_guides`, and `submitted_guides` are archived in the locked `legacy_archive` schema. They are no longer in the public runtime schema.

## Table Notes

`destinations`

Canonical destination hierarchy. `scope` supports `continent`, `country`, `region`, `state`, `city`, and `neighborhood`. A `region` can sit directly under a continent or under a country. Venue-like areas such as Waterfront, Museum District, or Old Town are modeled as neighborhoods, not venues. `legacy_id` maps old app IDs like `barcelona`, `country:usa`, or generated neighborhood IDs.

Hierarchy writes are validated in the database: continents are roots, cities must sit below a country/region/state, neighborhoods must sit below a city/neighborhood, and cycles are rejected. `location` is a generated PostGIS geography point derived from the compatibility `[latitude, longitude]` JSON coordinates. `description` and `subareas` remain deprecated compatibility caches only; canonical copy and hierarchy live in `destination_descriptions_v2` and `destinations.parent_id`.

`destination_descriptions_v2`

Normalized descriptions keyed by `destination_id`. Runtime reads prefer this table only. Build-time HTML may use local static descriptions so Awin and other crawlers still see stable readable pages if the database is unavailable during build.

`destination_category_insights`, `destination_category_insight_chips`, `destination_category_insight_notes`

Source-of-truth category guidance for destinations. Use these for the left-pane notes shown after a category is selected. `destination_category_insights.destination_id` can point to a city or a neighborhood, so neighborhood-specific notes can override city-level notes without changing guide render caches. Chips are child rows with an explicit `filter_kind` (`cuisine`, `subcategory`, `attribute`, or `freeform`) and `filter_value` so UI chips can become filters without guessing from display text. Notes are child rows with a short label and body, ordered by `sort_order`.

`destination_category_neighborhood_strengths`

Researched category strength from a parent destination, usually a city, to child neighborhood destinations. Use `field_key = 'default'` for general category strength and filter-specific field keys such as `sushi`, `cocktail bar`, `dive bar`, `hotels`, or `museums` for more specific ranking. Scores are `0-10`, with researched rationale and source URLs. Guide coverage can still be used as a secondary signal in the app, but the DB score is the editorial source of truth.

`venues`

Reusable venue/place entities with city and neighborhood links, address, coordinates, official URL, and source metadata. `events`, `event_occurrences`, and `entry_stops` can reference venues. Venue dedupe uses `city_id + normalized_name` for active venues, with `aliases` and `merged_into_venue_id` available for manual merges. `venue_kind` stores a primary broad kind, while `venue_kinds` supports overlapping real-world uses such as a pub that should be searchable as both Food and Nightlife.

Stay places are classified on the venue itself, not just on a guide stop. `venue_kind = 'lodging'` marks a Stay venue, while `lodging_type` supports `hotel`, `hostel`, `resort`, `airbnb`, `apartment_hotel`, `guesthouse`, `camping`, and `holiday_park`. `attribute_tags` stores fast filter tags such as `relaxing`, `lively`, `party`, `scenic`, `budget`, `luxury`, `family_friendly`, `romantic`, `central`, `beach`, `nature`, and `work_friendly`.

Food places are also classified on the venue itself. `venue_kind = 'food_drink'` marks a Food venue, while `food_service_type` supports `restaurant`, `cafe`, `fast_food`, `stall`, `food_truck`, and `food_cart`. `cuisine_types` is a searchable array for cuisine filters such as `mexican`, `japanese`, `italian`, `seafood`, `bakery`, `street_food`, `vegetarian`, and `vegan`. `price_tier` stores `$`, `$$`, `$$$`, or `$$$$`. Food-specific `attribute_tags` cover filters such as `casual`, `date_night`, `group_friendly`, `solo_friendly`, `local_favorite`, `destination_dining`, `fine_dining`, `tasting_menu`, `street_food`, `market`, `late_night`, `breakfast`, `brunch`, `coffee`, `bakery`, `reservation_recommended`, `walk_in_friendly`, and `scenic_food`.

Nightlife places use `venue_kind = 'nightlife'`. `nightlife_type` supports `dive_bar`, `cocktail_bar`, `pub`, `sports_bar`, `gaming_bar`, `wine_bar`, `beer_bar`, `rooftop_bar`, `lounge`, `club`, `live_music_venue`, `theatre`, `concert_hall`, `comedy_club`, `karaoke_bar`, `casino`, `brewery`, and `other`. `music_genres` is a searchable array for club/music filters such as `house`, `techno`, `electronic`, `hip_hop`, `latin`, `jazz`, `rock`, `classical`, `flamenco`, and `fado`. Nightlife uses the shared `price_tier` column and nightlife-specific `attribute_tags` such as `cheap_drinks`, `premium_drinks`, `dance_floor`, `late_late`, `low_key_nightlife`, `party_nightlife`, `scenic_nightlife`, `speakeasy`, `craft_cocktails`, `craft_beer`, `natural_wine`, `live_music`, `dj_sets`, `comedy`, `theatre_show`, `games`, `sports_screening`, `queer_friendly`, and `reservation_recommended_nightlife`.

`venue_hours` and `venue_special_hours`

Canonical operating hours for real venues. `venue_hours` stores reusable weekly hours by day of week and interval order, supporting split service windows, closed days, 24-hour venues, seasonal validity, source links, raw source text, and last verification timestamps. `venue_special_hours` stores holiday closures, one-off hours, seasonal exceptions, and temporary changes by date. `venues.hours_note` stores source-backed schedule caveats when exact structured hours are not available. `entry_stops.hours` remains available as an import/display fallback, but the venue tables and columns are the source of truth for live guide rendering, search, and filtering.

`venue_external_refs`

Provider identifiers for canonical venues. Google place ids live here with `provider = 'google'`; they should be reused by hours/media/search ingestion instead of rediscovering the same place repeatedly.

`external_api_usage_events`

Server-side quota ledger for paid or rate-limited API calls. Google Places hours fallback writes one row per Text Search or Place Details request before calling Google, then updates the status after the response. Agents use this table to enforce shared daily/monthly caps across terminals and worktrees.

`venue_tags` and `venue_taggings`

Curated filter vocabulary and sourceable tag assignments for venues. `venues.attribute_tags` remains the authored fast search/render cache and may contain non-filter editorial context. Any authored tag that matches an active `venue_tags.slug` is automatically mirrored into `venue_taggings`; normalized taggings hold confidence/source attribution and are the reliable vocabulary for filter construction.

`stay_venues`

Read view for Stay search and filtering. It exposes lodging venues with city, neighborhood, `lodging_type`, `attribute_tags`, coordinates, official URL, and source metadata, so the app can filter by selected city without scanning unrelated cities.

`food_venues`

Read view for Food search and filtering. It exposes food venues with city, neighborhood, `food_service_type`, `cuisine_types`, `price_tier`, `attribute_tags`, coordinates, official URL, and source metadata, so the app can query one selected city instead of scanning all food guide stops.

`nightlife_venues`

Read view for Nightlife search and filtering. It exposes nightlife venues with city, neighborhood, `nightlife_type`, `music_genres`, `price_tier`, `attribute_tags`, coordinates, official URL, and source metadata, so bar, club, theatre, comedy, and music filters stay city-scoped.

`venue_hours_current`

Read view for current venue hours. It emits active weekly hours and upcoming 90-day special hours as JSON arrays, scoped per venue with city, timezone, operating status, and `hours_last_verified_at`.

`entries`

First-class records for editorial guides, journals, journeys, and event cards. `submission_type` is an enum with `guide`, `journal`, `journey`, and `event`; events are a submission type, not just a category. Current card fields are preserved as normalized columns: title, slug, SEO fields, description, highlights, photo, URL, category, creator, upvotes, created date, journey dates, and journal fields.

An event entry also carries `event_id`. This makes the entry an explicit render/card representation of the canonical `events` row instead of a second event identity. Its stops carry matching `event_id` and `event_occurrence_id` links when the event has schedule items.

`entry_stops`

Ordered normalized stops. Stops can reference a destination, venue, event, or event occurrence. It preserves stop fields including coordinates, photo, price, booking URL, official URL, event time/venue labels, journey date/day, hours, and nested `places`.

`entry_render_cache`

Schema-correct fallback cache for rendered app payloads. This replaces the old `entries.cached_map_list` column and avoids falling back to `editorial_guides`. It stores current `MapList` JSON generated from `entries_maplist`, with `render_format`, `render_version`, `source_hash`, `is_current`, and stale metadata.

`events`

Canonical event records for weekly city publishing and future event pages. Events carry event category, guide category, timezone, date range, price, official URL, highlights, source metadata, `is_festival`, and `is_guide_worthy`. Events always use `submission_type = 'event'`; display grouping can still be journey-like through occurrences.

`event_occurrences`

Scheduled times for an activation. Repeated screenings or performances point to one stable activation instead of duplicating its content identity.

`event_activations` and `event_media`

An activation is a stable nested program item inside an event: a film, performance, race session, workshop, or festival feature. One activation may have several `event_occurrences` at different times or venues. This prevents program items from being stored as fake venues. `event_media` owns event/activation/occurrence imagery, while `venue_media` remains exclusively for physical places. `event_schedule_items` exposes activation, occurrence, physical venue, and canonical photo fields for expanded festival cards.

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
- Spatial lookup: GiST indexes on generated `destinations.location` and active `venues.location` geography points.
- Destination category notes: `destination_category_insights(destination_id, is_active, category, locale, sort_order)` plus child note/chip indexes by `insight_id`.
- Destination category neighborhood strengths: `(parent_destination_id, category, field_key, is_active)` and `(neighborhood_destination_id, category, is_active)`.
- City entry pages: `entries(city_id, category, status)`, `entries(submission_type, status)`.
- Entry rendering: `entry_stops(entry_id, stop_order)`.
- Stay search: `venues(city_id, lodging_type)` for lodging venues, `venues(city_id, venue_kind)`, and GIN on `venues.attribute_tags`.
- Food search: `venues(city_id, food_service_type)`, `venues(city_id, price_tier)`, and GIN on `venues.cuisine_types` plus `venues.attribute_tags`.
- Nightlife search: `venues(city_id, nightlife_type)`, `venues(city_id, price_tier)`, and GIN on `venues.music_genres` plus `venues.attribute_tags`.
- Venue hours: `venue_hours(venue_id, day_of_week, interval_order)`, `venue_hours(day_of_week, is_closed, opens_at)`, `venue_special_hours(venue_id, special_date, interval_order)`, and `venues(operating_status)`.
- External API quota: `external_api_usage_events(provider, sku, created_at desc)`.
- Venue tag filters: `venue_tags(tag_group, is_active, is_filterable)` and `venue_taggings(tag_id, venue_id)`.
- Render cache fallback: `entry_render_cache(entry_id, render_format, render_version)` and current rendered payload lookups.
- City event feeds: `events(city_id, starts_at, status)`, `events(city_id, event_category, starts_at)`.
- Festival and guide-worthy filters: partial indexes on `events(city_id, is_festival)` and `events(city_id, is_guide_worthy)`.
- Schedules: `event_occurrences(event_id, starts_at)`.
- Event populator scheduling: `event_city_publishing_settings(is_active, city_priority, city_slug)` and source-run window indexes.
- Weekly publishing: `weekly_event_publications(city_id, week_start desc)`, `(city_id, event_category, starts_at)`, `(city_id, has_schedule, is_festival)`, and `source_run_id`.

Constraints keep important shape guarantees:

- Destination, venue, entry stop, and occurrence coordinates must be two-item JSON arrays.
- `lodging_type` can only be set when `venue_kind = 'lodging'`.
- `food_service_type` can only be set when `venue_kind = 'food_drink'`.
- `nightlife_type` can only be set when `venue_kind = 'nightlife'`.
- Venue hours and special hours must be closed, 24-hour, raw sourced text, or have both open and close times.
- Event and occurrence `ends_at` cannot be before `starts_at`.
- Events must have `submission_type = 'event'`.
- Entry submission type is constrained by enum, not by category text.

## RLS Recommendations

The migration enables RLS on new tables and adds public read policies because rGuide content is publicly browsable. Entries, entry stops, source joins, and source rows are scoped so private journals are only readable by their owner.

Recommended write model:

- Service role only for `destinations`, `destination_descriptions_v2`, destination category insight tables, destination category neighborhood strengths, `venues`, `venue_hours`, `venue_special_hours`, `venue_external_refs`, `external_api_usage_events`, `venue_tags`, `venue_taggings`, `events`, `event_occurrences`, `sources`, source joins, event city publishing settings, source runs, render caches, and weekly publications.
- Authenticated users may insert/update/delete only their own rows in `entries`.
- Authenticated users may insert/update/delete `entry_stops` only when the parent `entries.user_id = auth.uid()`.
- Browser/user submission writes should go directly to normalized `entries` and `entry_stops`; `submitted_guides` should not remain the active write path.
- Ingestion scripts should stay server-side with the service role or direct Postgres connection.

The hardening migration revokes blanket table privileges from `anon` and `authenticated`, then grants only the explicit read surfaces above plus owned `entries`/`entry_stops` mutations. Internal ingestion configuration, source-run logs, API quota ledgers, provider IDs, analytics rows, and `editorial_pois` compatibility data are service-role only. Public views use `security_invoker` so underlying RLS remains authoritative.

`entity_sources` is polymorphic by design because one attribution model spans many entity tables. A validation trigger now rejects nonexistent entity IDs, and delete triggers clean source/affiliate joins so the convenience does not trade away referential integrity.

## Backfill And Publishing

Backfill order:

1. Populate `destinations` from local geography, then run `npm run ingest:destination-images-r2 -- --scope city --published-entries-only` or use `npm run sync:destinations` so populated city rows get a real Openverse/Wikimedia image copied into R2.
2. Link and copy descriptions into `destination_descriptions_v2`.
3. Insert destination category notes into `destination_category_insights`, `destination_category_insight_chips`, and `destination_category_insight_notes`.
4. Insert researched category/neighborhood scores into `destination_category_neighborhood_strengths`.
5. Insert editorial content into `entries` and `entry_stops`.
6. Link venues, classifications, hours, tags, and sources.
7. Generate `entry_render_cache` from `entries_maplist`.
8. Insert event city settings, source runs, canonical events, venues, occurrences, sources, and weekly publications.

Ongoing publishing should write normalized tables first, then refresh render caches:

- Editorial guide publish: upsert `entries`, `entry_stops`, `entity_sources`, then refresh `entry_render_cache`.
- Weekly event publish: upsert `events`, `event_occurrences`, `venues`, `sources`, `entity_sources`, `event_source_runs`, then refresh `weekly_event_publications`.
- Build-time HTML should stay stable using local/static payloads unless `RGUIDE_ALLOW_BUILD_DB=1` is explicitly set.

## App Integration

Current runtime reads:

- [src/lib/server-editorial-guides.ts](/Users/brodriguez/Projects/rGuide/src/lib/server-editorial-guides.ts): reads `entries_maplist` and `weekly_events_maplist`, with schema-owned fallback to `entry_render_cache` and `weekly_event_publications`.
- [src/lib/destination-descriptions.ts](/Users/brodriguez/Projects/rGuide/src/lib/destination-descriptions.ts): reads `destination_descriptions_v2`, destination category insights, destination category neighborhood strengths, city affiliate links, food cuisine chips, and destination images.
- [src/lib/supabase/editorial-guides.ts](/Users/brodriguez/Projects/rGuide/src/lib/supabase/editorial-guides.ts): browser fallback reads `entries_maplist`, then `entry_render_cache`.
- [src/lib/supabase/submitted-guides.ts](/Users/brodriguez/Projects/rGuide/src/lib/supabase/submitted-guides.ts): should be migrated to normalized writes before user submissions are enabled.

Important scale rule:

- Weekly event reads must be city-scoped for app views. Use `weekly_events_maplist` or `weekly_event_publications` filtered by selected `city_id`/`city_slug` and the active week instead of loading all cities at once.

## Ongoing Schema Audit

Run `npm run audit:schema` after migrations or publisher changes. It checks RLS, security-invoker views, foreign-key indexes, destination hierarchy, source URL duplication, normalized known tags, render-cache coverage, internal Data API grants, canonical descriptions, hours, and remaining photo hotlinks. Use `npm run audit:schema -- --strict` when warnings should also fail the run.

## Cleanup Plan

1. Keep archived copies only in `legacy_archive`.
2. Keep public runtime reads and writes on normalized tables.
3. Do not regenerate legacy blob SQL seed files.
4. Remove the `legacy_archive` copies only after an explicit final deletion request.
