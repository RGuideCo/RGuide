-- City-specific event discovery source registry.
--
-- event_city_publishing_settings answers when a city should be searched.
-- event_discovery_sources answers where that city should be searched.
-- event_source_runs remains the run log, with event_source_run_sources recording
-- which configured sources were checked in a run.

do $$
begin
  create type public.event_discovery_source_kind as enum (
    'official_city_calendar',
    'venue_calendar',
    'ticketing_platform',
    'editorial_calendar',
    'festival_site',
    'music_calendar',
    'sports_calendar',
    'museum_calendar',
    'fair_calendar',
    'community_calendar',
    'other'
  );
exception
  when duplicate_object then null;
end;
$$;

alter table public.event_city_publishing_settings
  add column if not exists discovery_day_of_month smallint not null default 1,
  add column if not exists discovery_hour_local smallint not null default 8,
  add column if not exists publish_weekday smallint not null default 1,
  add column if not exists publish_hour_local smallint not null default 8,
  add column if not exists refresh_hour_local smallint not null default 8;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'event_city_publishing_settings_schedule_bounds'
      and conrelid = 'public.event_city_publishing_settings'::regclass
  ) then
    alter table public.event_city_publishing_settings
      add constraint event_city_publishing_settings_schedule_bounds
      check (
        discovery_day_of_month between 1 and 28
        and discovery_hour_local between 0 and 23
        and publish_weekday between 0 and 6
        and publish_hour_local between 0 and 23
        and refresh_hour_local between 0 and 23
      );
  end if;
end;
$$;

create table if not exists public.event_discovery_sources (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.destinations(id) on delete cascade,
  destination_id uuid references public.destinations(id) on delete set null,
  publishing_settings_id uuid references public.event_city_publishing_settings(id) on delete set null,
  source_id uuid references public.sources(id) on delete set null,
  venue_id uuid references public.venues(id) on delete set null,
  name text not null,
  slug text not null,
  url text not null,
  publisher text,
  source_kind public.event_discovery_source_kind not null default 'other',
  category_focus text[] not null default '{}',
  search_url_template text,
  rss_url text,
  api_url text,
  crawl_frequency text not null default 'monthly',
  priority integer not null default 100,
  is_active boolean not null default true,
  requires_manual_review boolean not null default true,
  last_checked_at timestamptz,
  last_success_at timestamptz,
  last_failure_at timestamptz,
  failure_count integer not null default 0 check (failure_count >= 0),
  notes text,
  raw_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city_id, slug),
  constraint event_discovery_sources_url_not_blank check (btrim(url) <> ''),
  constraint event_discovery_sources_crawl_frequency check (
    crawl_frequency in ('daily', 'weekly', 'monthly', 'manual')
  ),
  constraint event_discovery_sources_priority check (priority >= 0)
);

drop trigger if exists event_discovery_sources_set_updated_at on public.event_discovery_sources;
create trigger event_discovery_sources_set_updated_at
before update on public.event_discovery_sources
for each row
execute function public.set_updated_at();

create table if not exists public.event_source_run_sources (
  id uuid primary key default gen_random_uuid(),
  source_run_id uuid not null references public.event_source_runs(id) on delete cascade,
  discovery_source_id uuid references public.event_discovery_sources(id) on delete set null,
  source_id uuid references public.sources(id) on delete set null,
  status text not null default 'completed',
  checked_at timestamptz not null default now(),
  events_found_count integer not null default 0 check (events_found_count >= 0),
  events_published_count integer not null default 0 check (events_published_count >= 0),
  error_message text,
  raw_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (source_run_id, discovery_source_id),
  constraint event_source_run_sources_status check (
    status in ('queued', 'running', 'completed', 'failed', 'skipped')
  )
);

create index if not exists event_discovery_sources_city_active_idx
on public.event_discovery_sources (city_id, is_active, priority, source_kind)
where is_active = true;

create index if not exists event_discovery_sources_settings_idx
on public.event_discovery_sources (publishing_settings_id, is_active, priority)
where is_active = true;

create index if not exists event_discovery_sources_kind_idx
on public.event_discovery_sources (source_kind, is_active, priority)
where is_active = true;

create index if not exists event_discovery_sources_venue_idx
on public.event_discovery_sources (venue_id)
where venue_id is not null;

create index if not exists event_discovery_sources_source_idx
on public.event_discovery_sources (source_id)
where source_id is not null;

create index if not exists event_discovery_sources_category_focus_gin_idx
on public.event_discovery_sources using gin (category_focus);

create index if not exists event_source_run_sources_run_idx
on public.event_source_run_sources (source_run_id, status);

create index if not exists event_source_run_sources_discovery_source_idx
on public.event_source_run_sources (discovery_source_id, checked_at desc)
where discovery_source_id is not null;

create index if not exists event_source_run_sources_source_idx
on public.event_source_run_sources (source_id)
where source_id is not null;

alter table public.event_discovery_sources enable row level security;
alter table public.event_source_run_sources enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'event_discovery_sources'
      and policyname = 'Active event discovery sources are readable'
  ) then
    create policy "Active event discovery sources are readable"
    on public.event_discovery_sources
    for select
    using (is_active = true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'event_source_run_sources'
      and policyname = 'Event source run source logs are readable'
  ) then
    create policy "Event source run source logs are readable"
    on public.event_source_run_sources
    for select
    using (true);
  end if;
end;
$$;

drop view if exists public.active_event_discovery_sources;

create view public.active_event_discovery_sources
with (security_invoker = true) as
select
  discovery_source.id,
  discovery_source.city_id,
  city.slug as city_slug,
  city.name as city_name,
  discovery_source.destination_id,
  discovery_source.publishing_settings_id,
  discovery_source.source_id,
  discovery_source.venue_id,
  venue.name as venue_name,
  discovery_source.name,
  discovery_source.slug,
  discovery_source.url,
  discovery_source.publisher,
  discovery_source.source_kind,
  discovery_source.category_focus,
  discovery_source.search_url_template,
  discovery_source.rss_url,
  discovery_source.api_url,
  discovery_source.crawl_frequency,
  discovery_source.priority,
  discovery_source.requires_manual_review,
  discovery_source.last_checked_at,
  discovery_source.last_success_at,
  discovery_source.last_failure_at,
  discovery_source.failure_count,
  settings.discovery_cadence,
  settings.discovery_window_days,
  settings.publish_cadence,
  settings.publish_window_days,
  settings.refresh_cadence,
  settings.refresh_window_days,
  settings.next_discovery_run_at,
  settings.next_publish_run_at,
  settings.next_refresh_run_at,
  settings.timezone,
  discovery_source.raw_metadata
from public.event_discovery_sources discovery_source
join public.destinations city on city.id = discovery_source.city_id
left join public.venues venue on venue.id = discovery_source.venue_id
left join public.event_city_publishing_settings settings
  on settings.id = discovery_source.publishing_settings_id
where discovery_source.is_active = true;

drop view if exists public.event_discovery_queue;

create view public.event_discovery_queue
with (security_invoker = true) as
select *
from public.active_event_discovery_sources source
where source.discovery_cadence <> 'none'
  and (
    source.next_discovery_run_at is null
    or source.next_discovery_run_at <= now()
  )
order by source.priority asc, source.city_slug asc, source.source_kind asc, source.name asc;

with barcelona_city as (
  select id
  from public.destinations
  where scope = 'city'
    and slug = 'barcelona'
  limit 1
),
barcelona_settings as (
  select settings.id
  from public.event_city_publishing_settings settings
  join barcelona_city on barcelona_city.id = settings.city_id
  limit 1
),
seed_sources as (
  select *
  from (
    values
      ('barcelona-city-agenda', 'Barcelona city agenda', 'https://www.barcelona.cat/agenda/', 'Barcelona City Council', 'official_city_calendar'::public.event_discovery_source_kind, array['Culture', 'Activities']::text[], null::text, 10),
      ('docsbarcelona-calendar', 'DocsBarcelona official calendar', 'https://docsbarcelona.com/en/festival/calendar/', 'DocsBarcelona', 'festival_site'::public.event_discovery_source_kind, array['Culture', 'Film']::text[], null::text, 20),
      ('sala-apolo-calendar', 'Sala Apolo calendar', 'https://www.sala-apolo.com/en/programming', 'Sala Apolo', 'venue_calendar'::public.event_discovery_source_kind, array['Music', 'Nightlife']::text[], 'poi-spain-barcelona-sala-apolo', 20),
      ('resident-advisor-barcelona', 'Resident Advisor Barcelona', 'https://ra.co/events/es/barcelona', 'Resident Advisor', 'music_calendar'::public.event_discovery_source_kind, array['Music', 'Nightlife']::text[], null::text, 30),
      ('fira-barcelona-events', 'Fira Barcelona events', 'https://www.firabarcelona.com/en/calendar/', 'Fira Barcelona', 'fair_calendar'::public.event_discovery_source_kind, array['Maker Fair', 'Culture', 'Activities']::text[], null::text, 35),
      ('circuitcat-events', 'Circuit de Barcelona-Catalunya events', 'https://www.circuitcat.com/en/events/', 'Circuit de Barcelona-Catalunya', 'sports_calendar'::public.event_discovery_source_kind, array['Sports']::text[], null::text, 35),
      ('macba-activities', 'MACBA activities', 'https://www.macba.cat/en/activities/', 'MACBA', 'museum_calendar'::public.event_discovery_source_kind, array['Culture']::text[], 'macba', 40),
      ('matsuri-barcelona-program', 'Matsuri Barcelona program', 'https://matsuribcn.es/program.html', 'Matsuri Barcelona', 'festival_site'::public.event_discovery_source_kind, array['Culture Festival', 'Culture']::text[], null::text, 45)
  ) as seed(slug, name, url, publisher, source_kind, category_focus, venue_slug, priority)
),
upserted_sources as (
  insert into public.sources (
    name,
    url,
    publisher,
    source_type,
    sourced_at,
    raw_metadata
  )
  select
    seed.name,
    seed.url,
    seed.publisher,
    'event_discovery_source',
    now(),
    jsonb_build_object('source', 'event_discovery_sources_seed', 'city', 'barcelona')
  from seed_sources seed
  on conflict (url) do update set
    name = excluded.name,
    publisher = coalesce(excluded.publisher, public.sources.publisher),
    source_type = coalesce(public.sources.source_type, excluded.source_type),
    raw_metadata = public.sources.raw_metadata || excluded.raw_metadata,
    updated_at = now()
  returning id, url
)
insert into public.event_discovery_sources (
  city_id,
  destination_id,
  publishing_settings_id,
  source_id,
  venue_id,
  name,
  slug,
  url,
  publisher,
  source_kind,
  category_focus,
  crawl_frequency,
  priority,
  requires_manual_review,
  raw_metadata
)
select
  barcelona_city.id,
  barcelona_city.id,
  barcelona_settings.id,
  coalesce(upserted_sources.id, existing_source.id),
  venue.id,
  seed.name,
  seed.slug,
  seed.url,
  seed.publisher,
  seed.source_kind,
  seed.category_focus,
  case
    when seed.source_kind in ('venue_calendar', 'music_calendar', 'official_city_calendar') then 'weekly'
    else 'monthly'
  end,
  seed.priority,
  true,
  jsonb_build_object('source', 'event_discovery_sources_seed', 'city', 'barcelona')
from seed_sources seed
cross join barcelona_city
left join barcelona_settings on true
left join upserted_sources on upserted_sources.url = seed.url
left join public.sources existing_source on existing_source.url = seed.url
left join public.venues venue
  on venue.city_id = barcelona_city.id
  and venue.slug = seed.venue_slug
on conflict (city_id, slug) do update set
  destination_id = excluded.destination_id,
  publishing_settings_id = excluded.publishing_settings_id,
  source_id = coalesce(excluded.source_id, public.event_discovery_sources.source_id),
  venue_id = coalesce(excluded.venue_id, public.event_discovery_sources.venue_id),
  name = excluded.name,
  url = excluded.url,
  publisher = excluded.publisher,
  source_kind = excluded.source_kind,
  category_focus = excluded.category_focus,
  crawl_frequency = excluded.crawl_frequency,
  priority = excluded.priority,
  is_active = true,
  requires_manual_review = excluded.requires_manual_review,
  raw_metadata = public.event_discovery_sources.raw_metadata || excluded.raw_metadata,
  updated_at = now();
