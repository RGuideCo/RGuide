-- Normalized rGuide content schema.
-- Additive migration: keeps existing JSON/cache tables readable while adding
-- source-of-truth tables for destinations, venues, entries, events, schedules,
-- and source attribution.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  create type public.destination_scope as enum (
    'continent',
    'country',
    'region',
    'state',
    'city',
    'neighborhood'
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type public.rguide_submission_type as enum (
    'guide',
    'journal',
    'itinerary',
    'event'
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type public.rguide_entry_status as enum (
    'draft',
    'published',
    'archived'
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type public.rguide_event_status as enum (
    'draft',
    'published',
    'cancelled',
    'archived'
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type public.rguide_source_entity_type as enum (
    'destination',
    'destination_description',
    'venue',
    'entry',
    'entry_stop',
    'event',
    'event_occurrence',
    'weekly_event_guide'
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type public.rguide_event_source_run_type as enum (
    'monthly_discovery',
    'weekly_publish',
    'daily_refresh',
    'manual_backfill'
  );
exception
  when duplicate_object then null;
end;
$$;

create table if not exists public.destinations (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  slug text not null,
  scope public.destination_scope not null,
  parent_id uuid references public.destinations(id) on delete set null,
  name text not null,
  display_name text,
  continent_name text,
  country_name text,
  country_code text,
  region_name text,
  state_name text,
  city_name text,
  neighborhood_name text,
  timezone text,
  coordinates jsonb,
  bounds jsonb,
  image_url text,
  description text,
  list_count integer not null default 0 check (list_count >= 0),
  subarea_count integer not null default 0 check (subarea_count >= 0),
  subareas jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint destinations_coordinates_shape check (
    coordinates is null
    or (
      jsonb_typeof(coordinates) = 'array'
      and jsonb_array_length(coordinates) = 2
    )
  ),
  constraint destinations_bounds_shape check (
    bounds is null
    or (
      jsonb_typeof(bounds) = 'array'
      and jsonb_array_length(bounds) = 2
    )
  )
);

drop trigger if exists destinations_set_updated_at on public.destinations;
create trigger destinations_set_updated_at
before update on public.destinations
for each row
execute function public.set_updated_at();

create table if not exists public.destination_descriptions_v2 (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid not null references public.destinations(id) on delete cascade,
  locale text not null default 'en',
  title text,
  summary text,
  description text not null,
  description_kind text not null default 'overview',
  is_primary boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (destination_id, locale, description_kind)
);

drop trigger if exists destination_descriptions_v2_set_updated_at on public.destination_descriptions_v2;
create trigger destination_descriptions_v2_set_updated_at
before update on public.destination_descriptions_v2
for each row
execute function public.set_updated_at();

alter table if exists public.destination_descriptions
  add column if not exists destination_id uuid references public.destinations(id) on delete set null;

create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  publisher text,
  source_type text,
  fetched_at timestamptz,
  sourced_at timestamptz not null default now(),
  excerpt text,
  raw_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (url)
);

drop trigger if exists sources_set_updated_at on public.sources;
create trigger sources_set_updated_at
before update on public.sources
for each row
execute function public.set_updated_at();

create table if not exists public.entity_sources (
  id uuid primary key default gen_random_uuid(),
  entity_type public.rguide_source_entity_type not null,
  entity_id uuid not null,
  source_id uuid not null references public.sources(id) on delete cascade,
  relationship text not null default 'reference',
  confidence numeric(4,3) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  excerpt text,
  raw_metadata jsonb not null default '{}'::jsonb,
  sourced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (entity_type, entity_id, source_id, relationship)
);

create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  slug text not null,
  name text not null,
  normalized_name text not null,
  aliases text[] not null default '{}',
  merged_into_venue_id uuid references public.venues(id) on delete set null,
  destination_id uuid references public.destinations(id) on delete set null,
  city_id uuid references public.destinations(id) on delete set null,
  neighborhood_id uuid references public.destinations(id) on delete set null,
  address_line1 text,
  address_line2 text,
  locality text,
  region text,
  postal_code text,
  country text,
  coordinates jsonb,
  official_url text,
  phone text,
  source_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city_id, slug),
  constraint venues_not_self_merged check (
    merged_into_venue_id is null or merged_into_venue_id <> id
  ),
  constraint venues_coordinates_shape check (
    coordinates is null
    or (
      jsonb_typeof(coordinates) = 'array'
      and jsonb_array_length(coordinates) = 2
    )
  )
);

drop trigger if exists venues_set_updated_at on public.venues;
create trigger venues_set_updated_at
before update on public.venues
for each row
execute function public.set_updated_at();

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  slug text not null unique,
  seo_slug text,
  seo_title text,
  seo_description text,
  title text not null,
  description text not null,
  highlights text[] not null default '{}',
  photo_url text,
  canonical_url text,
  category text not null,
  submission_type public.rguide_submission_type not null default 'guide',
  status public.rguide_entry_status not null default 'published',
  destination_id uuid references public.destinations(id) on delete set null,
  city_id uuid references public.destinations(id) on delete set null,
  neighborhood_id uuid references public.destinations(id) on delete set null,
  country_name text,
  continent_name text,
  creator_id text,
  creator_name text,
  creator_avatar text,
  user_id uuid references auth.users(id) on delete set null,
  upvotes integer not null default 0 check (upvotes >= 0),
  created_on date not null default current_date,
  itinerary_start_date date,
  itinerary_end_date date,
  journal_visited_at date,
  journal_note text,
  journal_visibility text check (journal_visibility is null or journal_visibility in ('public', 'private')),
  source_table text,
  cached_map_list jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint entries_event_submission_category check (
    submission_type <> 'event'
    or category is not null
  )
);

drop trigger if exists entries_set_updated_at on public.entries;
create trigger entries_set_updated_at
before update on public.entries
for each row
execute function public.set_updated_at();

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  slug text not null unique,
  title text not null,
  description text not null,
  highlights text[] not null default '{}',
  event_category text not null,
  guide_category text not null default 'Activities',
  status public.rguide_event_status not null default 'published',
  destination_id uuid references public.destinations(id) on delete set null,
  city_id uuid not null references public.destinations(id) on delete restrict,
  neighborhood_id uuid references public.destinations(id) on delete set null,
  venue_id uuid references public.venues(id) on delete set null,
  timezone text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  starts_on date,
  ends_on date,
  price_label text,
  official_url text,
  photo_url text,
  is_festival boolean not null default false,
  is_guide_worthy boolean not null default false,
  guide_reason text,
  submission_type public.rguide_submission_type not null default 'event',
  cached_map_list jsonb,
  raw_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_submission_type_event check (submission_type = 'event'),
  constraint events_published_has_date check (
    status <> 'published'
    or starts_at is not null
    or starts_on is not null
  ),
  constraint events_date_order check (
    ends_at is null or starts_at is null or ends_at >= starts_at
  )
);

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
before update on public.events
for each row
execute function public.set_updated_at();

create table if not exists public.event_occurrences (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  legacy_id text unique,
  title text,
  description text,
  venue_id uuid references public.venues(id) on delete set null,
  city_id uuid references public.destinations(id) on delete set null,
  destination_id uuid references public.destinations(id) on delete set null,
  starts_at timestamptz,
  ends_at timestamptz,
  starts_on date,
  ends_on date,
  timezone text,
  price_label text,
  booking_url text,
  official_url text,
  coordinates jsonb,
  occurrence_order integer not null default 0,
  raw_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint event_occurrences_date_order check (
    ends_at is null or starts_at is null or ends_at >= starts_at
  ),
  constraint event_occurrences_has_date check (
    starts_at is not null
    or starts_on is not null
  ),
  constraint event_occurrences_coordinates_shape check (
    coordinates is null
    or (
      jsonb_typeof(coordinates) = 'array'
      and jsonb_array_length(coordinates) = 2
    )
  )
);

drop trigger if exists event_occurrences_set_updated_at on public.event_occurrences;
create trigger event_occurrences_set_updated_at
before update on public.event_occurrences
for each row
execute function public.set_updated_at();

create table if not exists public.entry_stops (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries(id) on delete cascade,
  legacy_id text,
  stop_order integer not null default 0,
  poi_legacy_id text,
  name text not null,
  description text not null,
  category text,
  destination_id uuid references public.destinations(id) on delete set null,
  venue_id uuid references public.venues(id) on delete set null,
  event_id uuid references public.events(id) on delete set null,
  event_occurrence_id uuid references public.event_occurrences(id) on delete set null,
  coordinates jsonb,
  photo_url text,
  price_label text,
  price_source text,
  booking_url text,
  official_url text,
  event_time_label text,
  event_venue_label text,
  itinerary_date date,
  itinerary_day integer,
  hours jsonb,
  places jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (entry_id, legacy_id),
  constraint entry_stops_coordinates_shape check (
    coordinates is null
    or (
      jsonb_typeof(coordinates) = 'array'
      and jsonb_array_length(coordinates) = 2
    )
  )
);

drop trigger if exists entry_stops_set_updated_at on public.entry_stops;
create trigger entry_stops_set_updated_at
before update on public.entry_stops
for each row
execute function public.set_updated_at();

create table if not exists public.event_city_publishing_settings (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.destinations(id) on delete cascade,
  destination_id uuid references public.destinations(id) on delete set null,
  city_slug text not null unique,
  city_name text not null,
  timezone text not null,
  is_active boolean not null default true,
  city_priority integer not null default 100,
  discovery_cadence text not null default 'monthly',
  discovery_window_days integer not null default 90 check (discovery_window_days between 1 and 366),
  publish_cadence text not null default 'weekly',
  publish_window_days integer not null default 14 check (publish_window_days between 1 and 60),
  refresh_cadence text not null default 'daily',
  refresh_window_days integer not null default 14 check (refresh_window_days between 1 and 60),
  source_strategy text[] not null default '{}',
  last_discovery_run_at timestamptz,
  last_publish_run_at timestamptz,
  last_refresh_run_at timestamptz,
  next_discovery_run_at timestamptz,
  next_publish_run_at timestamptz,
  next_refresh_run_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city_id),
  constraint event_city_publishing_settings_cadences check (
    discovery_cadence in ('monthly', 'none')
    and publish_cadence in ('weekly', 'none')
    and refresh_cadence in ('daily', 'none')
  )
);

drop trigger if exists event_city_publishing_settings_set_updated_at on public.event_city_publishing_settings;
create trigger event_city_publishing_settings_set_updated_at
before update on public.event_city_publishing_settings
for each row
execute function public.set_updated_at();

create table if not exists public.event_source_runs (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  publishing_settings_id uuid references public.event_city_publishing_settings(id) on delete set null,
  run_type public.rguide_event_source_run_type not null,
  city_id uuid not null references public.destinations(id) on delete restrict,
  destination_id uuid references public.destinations(id) on delete set null,
  city_slug text not null,
  city_name text not null,
  window_start date not null,
  window_end date not null,
  publish_week_start date,
  publish_week_end date,
  window_label text not null,
  sourced_at timestamptz not null default now(),
  timezone text not null,
  source_strategy text[] not null default '{}',
  status text not null default 'completed' check (status in ('queued', 'running', 'completed', 'failed')),
  events_found_count integer not null default 0 check (events_found_count >= 0),
  events_published_count integer not null default 0 check (events_published_count >= 0),
  error_message text,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city_slug, run_type, window_start, sourced_at),
  constraint event_source_runs_window_order check (window_end >= window_start),
  constraint event_source_runs_publish_week_order check (
    publish_week_end is null
    or publish_week_start is null
    or publish_week_end >= publish_week_start
  )
);

drop trigger if exists event_source_runs_set_updated_at on public.event_source_runs;
create trigger event_source_runs_set_updated_at
before update on public.event_source_runs
for each row
execute function public.set_updated_at();

alter table public.events
  add column if not exists discovery_source_run_id uuid references public.event_source_runs(id) on delete set null,
  add column if not exists latest_refresh_source_run_id uuid references public.event_source_runs(id) on delete set null;

alter table public.event_occurrences
  add column if not exists source_run_id uuid references public.event_source_runs(id) on delete set null,
  add column if not exists latest_refresh_source_run_id uuid references public.event_source_runs(id) on delete set null;

create table if not exists public.weekly_event_publications (
  id uuid primary key default gen_random_uuid(),
  source_run_id uuid not null references public.event_source_runs(id) on delete restrict,
  event_id uuid references public.events(id) on delete cascade,
  entry_id uuid references public.entries(id) on delete set null,
  city_id uuid not null references public.destinations(id) on delete restrict,
  destination_id uuid references public.destinations(id) on delete set null,
  week_start date not null,
  week_end date not null,
  week_label text not null,
  sourced_at timestamptz not null default now(),
  submission_type public.rguide_submission_type not null default 'event',
  event_category text not null,
  has_schedule boolean not null default false,
  is_festival boolean not null default false,
  timezone text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  rendered_map_list jsonb not null,
  raw_event jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, week_start)
);

drop trigger if exists weekly_event_publications_set_updated_at on public.weekly_event_publications;
create trigger weekly_event_publications_set_updated_at
before update on public.weekly_event_publications
for each row
execute function public.set_updated_at();

alter table if exists public.weekly_event_guides
  add column if not exists submission_type text not null default 'event',
  add column if not exists event_category text,
  add column if not exists has_schedule boolean not null default false,
  add column if not exists is_festival boolean not null default false,
  add column if not exists destination_id uuid references public.destinations(id) on delete set null,
  add column if not exists city_destination_id uuid references public.destinations(id) on delete set null,
  add column if not exists source_run_id uuid references public.event_source_runs(id) on delete set null;

create or replace view public.destination_tree
with (security_invoker = true) as
select
  destination.*,
  parent.slug as parent_slug,
  parent.name as parent_name
from public.destinations destination
left join public.destinations parent on parent.id = destination.parent_id
where destination.is_published = true;

create or replace view public.entries_maplist
with (security_invoker = true) as
select
  entry.id,
  coalesce(
    entry.cached_map_list,
    jsonb_build_object(
      'id', coalesce(entry.legacy_id, entry.id::text),
      'slug', entry.slug,
      'seoSlug', entry.seo_slug,
      'seoTitle', entry.seo_title,
      'seoDescription', entry.seo_description,
      'title', entry.title,
      'description', entry.description,
      'highlights', to_jsonb(entry.highlights),
      'photo', entry.photo_url,
      'url', coalesce(entry.canonical_url, '/guides/' || entry.slug),
      'category', entry.category,
      'submissionType', entry.submission_type::text,
      'itinerary', case
        when entry.itinerary_start_date is null and entry.itinerary_end_date is null then null
        else jsonb_build_object(
          'startDate', entry.itinerary_start_date,
          'endDate', entry.itinerary_end_date
        )
      end,
      'journal', case
        when entry.journal_visited_at is null and entry.journal_note is null then null
        else jsonb_build_object(
          'visitedAt', entry.journal_visited_at,
          'note', entry.journal_note,
          'visibility', entry.journal_visibility
        )
      end,
      'location', jsonb_build_object(
        'city', coalesce(city.name, entry.country_name),
        'neighborhood', neighborhood.name,
        'country', coalesce(entry.country_name, city.country_name),
        'continent', coalesce(entry.continent_name, city.continent_name),
        'scope', case when city.id is null then 'country' else 'city' end
      ),
      'creator', jsonb_build_object(
        'id', entry.creator_id,
        'name', entry.creator_name,
        'avatar', entry.creator_avatar
      ),
      'upvotes', entry.upvotes,
      'createdAt', entry.created_on,
      'stops', coalesce(stops.items, '[]'::jsonb),
      'sources', coalesce(sources.items, '[]'::jsonb)
    )
  ) as list,
  entry.submission_type,
  entry.category,
  entry.city_id,
  entry.neighborhood_id,
  entry.destination_id,
  entry.status,
  entry.created_at,
  entry.updated_at
from public.entries entry
left join public.destinations city on city.id = entry.city_id
left join public.destinations neighborhood on neighborhood.id = entry.neighborhood_id
left join lateral (
  select jsonb_agg(
    jsonb_strip_nulls(
      jsonb_build_object(
        'id', coalesce(stop.legacy_id, stop.id::text),
        'poiId', stop.poi_legacy_id,
        'name', stop.name,
        'coordinates', stop.coordinates,
        'description', stop.description,
        'category', stop.category,
        'photo', stop.photo_url,
        'price', stop.price_label,
        'priceSource', stop.price_source,
        'bookingUrl', stop.booking_url,
        'officialUrl', stop.official_url,
        'eventTime', stop.event_time_label,
        'eventVenue', stop.event_venue_label,
        'places', stop.places,
        'itineraryDate', stop.itinerary_date,
        'itineraryDay', stop.itinerary_day,
        'hours', stop.hours
      )
    )
    order by stop.stop_order, stop.created_at
  ) as items
  from public.entry_stops stop
  where stop.entry_id = entry.id
) stops on true
left join lateral (
  select jsonb_agg(
    jsonb_build_object('name', source.name, 'url', source.url)
    order by entity_source.sourced_at desc
  ) as items
  from public.entity_sources entity_source
  join public.sources source on source.id = entity_source.source_id
  where entity_source.entity_type = 'entry'
    and entity_source.entity_id = entry.id
) sources on true
where entry.status = 'published'
  and (
    entry.submission_type <> 'journal'
    or coalesce(entry.journal_visibility, 'public') = 'public'
  );

create or replace view public.weekly_events_maplist
with (security_invoker = true) as
select
  publication.id,
  publication.city_id,
  publication.destination_id,
  publication.week_start,
  publication.week_end,
  publication.week_label,
  publication.sourced_at,
  publication.submission_type,
  publication.event_category,
  publication.has_schedule,
  publication.is_festival,
  publication.timezone,
  publication.starts_at,
  publication.ends_at,
  publication.rendered_map_list as guide
from public.weekly_event_publications publication;

create unique index if not exists destinations_root_scope_slug_uidx
on public.destinations (scope, slug)
where parent_id is null;
create unique index if not exists destinations_parent_scope_slug_uidx
on public.destinations (parent_id, scope, slug)
where parent_id is not null;
create index if not exists destinations_scope_slug_idx on public.destinations (scope, slug);
create index if not exists destinations_parent_scope_idx on public.destinations (parent_id, scope);
create index if not exists destinations_city_country_idx on public.destinations (country_name, city_name);
create index if not exists destinations_published_idx on public.destinations (is_published) where is_published = true;
create index if not exists destinations_metadata_gin_idx on public.destinations using gin (metadata);
create index if not exists destination_descriptions_v2_destination_idx on public.destination_descriptions_v2 (destination_id, locale);

create index if not exists sources_url_idx on public.sources (url);
create index if not exists sources_publisher_idx on public.sources (publisher);
create index if not exists entity_sources_entity_idx on public.entity_sources (entity_type, entity_id);
create index if not exists entity_sources_source_idx on public.entity_sources (source_id);

create index if not exists venues_city_slug_idx on public.venues (city_id, slug);
create index if not exists venues_destination_idx on public.venues (destination_id);
create index if not exists venues_name_idx on public.venues (name);
create unique index if not exists venues_city_normalized_name_idx
on public.venues (city_id, normalized_name)
where city_id is not null and merged_into_venue_id is null;
create index if not exists venues_aliases_gin_idx on public.venues using gin (aliases);

create index if not exists entries_city_category_idx on public.entries (city_id, category, status);
create index if not exists entries_submission_type_idx on public.entries (submission_type, status);
create index if not exists entries_destination_idx on public.entries (destination_id, status);
create index if not exists entries_created_on_idx on public.entries (created_on desc);
create index if not exists entries_cached_map_list_gin_idx on public.entries using gin (cached_map_list);

create index if not exists entry_stops_entry_order_idx on public.entry_stops (entry_id, stop_order);
create index if not exists entry_stops_venue_idx on public.entry_stops (venue_id);
create index if not exists entry_stops_event_idx on public.entry_stops (event_id);

create index if not exists events_city_start_idx on public.events (city_id, starts_at, status);
create index if not exists events_city_category_start_idx on public.events (city_id, event_category, starts_at);
create index if not exists events_destination_idx on public.events (destination_id, status);
create index if not exists events_venue_idx on public.events (venue_id);
create index if not exists events_guide_worthy_idx on public.events (city_id, is_guide_worthy) where is_guide_worthy = true;
create index if not exists events_festival_idx on public.events (city_id, is_festival) where is_festival = true;

create index if not exists event_occurrences_event_start_idx on public.event_occurrences (event_id, starts_at);
create index if not exists event_occurrences_city_window_idx on public.event_occurrences (city_id, starts_at, ends_at);
create index if not exists event_occurrences_destination_window_idx on public.event_occurrences (destination_id, starts_at, ends_at);
create index if not exists event_city_publishing_settings_active_idx
on public.event_city_publishing_settings (is_active, city_priority, city_slug)
where is_active = true;
create index if not exists event_city_publishing_settings_next_discovery_idx
on public.event_city_publishing_settings (next_discovery_run_at)
where is_active = true;
create index if not exists event_city_publishing_settings_next_publish_idx
on public.event_city_publishing_settings (next_publish_run_at)
where is_active = true;
create index if not exists event_city_publishing_settings_next_refresh_idx
on public.event_city_publishing_settings (next_refresh_run_at)
where is_active = true;

create index if not exists event_source_runs_city_type_window_idx on public.event_source_runs (city_slug, run_type, window_start desc, sourced_at desc);
create index if not exists event_source_runs_settings_idx on public.event_source_runs (publishing_settings_id, run_type, sourced_at desc);
create index if not exists events_discovery_source_run_idx on public.events (discovery_source_run_id);
create index if not exists events_latest_refresh_source_run_idx on public.events (latest_refresh_source_run_id);
create index if not exists event_occurrences_source_run_idx on public.event_occurrences (source_run_id);
create index if not exists weekly_event_publications_city_week_idx on public.weekly_event_publications (city_id, week_start desc);
create index if not exists weekly_event_publications_category_idx on public.weekly_event_publications (city_id, event_category, starts_at);
create index if not exists weekly_event_publications_schedule_idx on public.weekly_event_publications (city_id, has_schedule, is_festival);
create index if not exists weekly_event_publications_source_run_idx on public.weekly_event_publications (source_run_id);
create index if not exists weekly_event_publications_rendered_gin_idx on public.weekly_event_publications using gin (rendered_map_list);

do $$
begin
  if to_regclass('public.weekly_event_guides') is not null then
    create index if not exists weekly_event_guides_city_destination_idx on public.weekly_event_guides (city_destination_id, sourced_at desc);
    create index if not exists weekly_event_guides_submission_type_idx on public.weekly_event_guides (submission_type);
    create index if not exists weekly_event_guides_event_category_idx on public.weekly_event_guides (event_category);
    create index if not exists weekly_event_guides_schedule_idx on public.weekly_event_guides (has_schedule, is_festival);
    create index if not exists weekly_event_guides_source_run_idx on public.weekly_event_guides (source_run_id);
  end if;
end;
$$;

alter table public.destinations enable row level security;
alter table public.destination_descriptions_v2 enable row level security;
alter table public.sources enable row level security;
alter table public.entity_sources enable row level security;
alter table public.venues enable row level security;
alter table public.entries enable row level security;
alter table public.entry_stops enable row level security;
alter table public.events enable row level security;
alter table public.event_occurrences enable row level security;
alter table public.event_city_publishing_settings enable row level security;
alter table public.event_source_runs enable row level security;
alter table public.weekly_event_publications enable row level security;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'destinations',
    'destination_descriptions_v2',
    'venues',
    'events',
    'event_occurrences',
    'event_city_publishing_settings',
    'event_source_runs',
    'weekly_event_publications'
  ]
  loop
    begin
      execute format(
        'create policy %I on public.%I for select using (true)',
        table_name || ' are readable',
        table_name
      );
    exception
      when duplicate_object then null;
    end;
  end loop;
end;
$$;

do $$
begin
  create policy "Public sources are readable"
  on public.sources
  for select
  using (
    exists (
      select 1
      from public.entity_sources entity_source
      where entity_source.source_id = sources.id
        and (
          entity_source.entity_type not in ('entry', 'entry_stop')
          or (
            entity_source.entity_type = 'entry'
            and exists (
              select 1
              from public.entries entry
              where entry.id = entity_source.entity_id
                and entry.status = 'published'
                and (
                  entry.submission_type <> 'journal'
                  or coalesce(entry.journal_visibility, 'public') = 'public'
                )
            )
          )
          or (
            entity_source.entity_type = 'entry_stop'
            and exists (
              select 1
              from public.entry_stops stop
              join public.entries entry on entry.id = stop.entry_id
              where stop.id = entity_source.entity_id
                and entry.status = 'published'
                and (
                  entry.submission_type <> 'journal'
                  or coalesce(entry.journal_visibility, 'public') = 'public'
                )
            )
          )
        )
    )
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can read sources for their own entries"
  on public.sources
  for select
  using (
    exists (
      select 1
      from public.entity_sources entity_source
      where entity_source.source_id = sources.id
        and (
          (
            entity_source.entity_type = 'entry'
            and exists (
              select 1
              from public.entries entry
              where entry.id = entity_source.entity_id
                and entry.user_id = auth.uid()
            )
          )
          or (
            entity_source.entity_type = 'entry_stop'
            and exists (
              select 1
              from public.entry_stops stop
              join public.entries entry on entry.id = stop.entry_id
              where stop.id = entity_source.entity_id
                and entry.user_id = auth.uid()
            )
          )
        )
    )
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Public entity sources are readable"
  on public.entity_sources
  for select
  using (
    entity_type not in ('entry', 'entry_stop')
    or (
      entity_type = 'entry'
      and exists (
        select 1
        from public.entries entry
        where entry.id = entity_sources.entity_id
          and entry.status = 'published'
          and (
            entry.submission_type <> 'journal'
            or coalesce(entry.journal_visibility, 'public') = 'public'
          )
      )
    )
    or (
      entity_type = 'entry_stop'
      and exists (
        select 1
        from public.entry_stops stop
        join public.entries entry on entry.id = stop.entry_id
        where stop.id = entity_sources.entity_id
          and entry.status = 'published'
          and (
            entry.submission_type <> 'journal'
            or coalesce(entry.journal_visibility, 'public') = 'public'
          )
      )
    )
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can read entity sources for their own entries"
  on public.entity_sources
  for select
  using (
    (
      entity_type = 'entry'
      and exists (
        select 1
        from public.entries entry
        where entry.id = entity_sources.entity_id
          and entry.user_id = auth.uid()
      )
    )
    or (
      entity_type = 'entry_stop'
      and exists (
        select 1
        from public.entry_stops stop
        join public.entries entry on entry.id = stop.entry_id
        where stop.id = entity_sources.entity_id
          and entry.user_id = auth.uid()
      )
    )
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Published public entries are readable"
  on public.entries
  for select
  using (
    status = 'published'
    and (
      submission_type <> 'journal'
      or coalesce(journal_visibility, 'public') = 'public'
    )
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can read their own normalized entries"
  on public.entries
  for select
  using (auth.uid() = user_id);
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Stops for published public entries are readable"
  on public.entry_stops
  for select
  using (
    exists (
      select 1
      from public.entries entry
      where entry.id = entry_stops.entry_id
        and entry.status = 'published'
        and (
          entry.submission_type <> 'journal'
          or coalesce(entry.journal_visibility, 'public') = 'public'
        )
    )
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can read stops for their own entries"
  on public.entry_stops
  for select
  using (
    exists (
      select 1
      from public.entries entry
      where entry.id = entry_stops.entry_id
        and entry.user_id = auth.uid()
    )
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can insert their own normalized entries"
  on public.entries
  for insert
  with check (auth.uid() = user_id);
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can update their own normalized entries"
  on public.entries
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can delete their own normalized entries"
  on public.entries
  for delete
  using (auth.uid() = user_id);
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can insert stops for their own entries"
  on public.entry_stops
  for insert
  with check (
    exists (
      select 1
      from public.entries entry
      where entry.id = entry_stops.entry_id
        and entry.user_id = auth.uid()
    )
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can update stops for their own entries"
  on public.entry_stops
  for update
  using (
    exists (
      select 1
      from public.entries entry
      where entry.id = entry_stops.entry_id
        and entry.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.entries entry
      where entry.id = entry_stops.entry_id
        and entry.user_id = auth.uid()
    )
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Users can delete stops for their own entries"
  on public.entry_stops
  for delete
  using (
    exists (
      select 1
      from public.entries entry
      where entry.id = entry_stops.entry_id
        and entry.user_id = auth.uid()
    )
  );
exception
  when duplicate_object then null;
end;
$$;
