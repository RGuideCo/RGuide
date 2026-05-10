-- Normalize the app fallback layer.
-- Rendered MapList JSON remains available for stable HTML, but it lives in an
-- explicit derived cache table instead of legacy source-of-truth blob tables.

create extension if not exists pgcrypto;

create table if not exists public.entry_render_cache (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries(id) on delete cascade,
  render_format text not null default 'maplist',
  render_version integer not null default 1 check (render_version > 0),
  rendered_payload jsonb not null,
  source_hash text not null,
  rendered_at timestamptz not null default now(),
  stale_at timestamptz,
  is_current boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (entry_id, render_format, render_version)
);

drop trigger if exists entry_render_cache_set_updated_at on public.entry_render_cache;
create trigger entry_render_cache_set_updated_at
before update on public.entry_render_cache
for each row
execute function public.set_updated_at();

insert into public.entry_render_cache (
  entry_id,
  render_format,
  render_version,
  rendered_payload,
  source_hash,
  rendered_at,
  is_current,
  metadata
)
select
  entry.id,
  'maplist',
  1,
  view.list,
  encode(digest(view.list::text, 'sha256'), 'hex'),
  now(),
  true,
  jsonb_build_object('seeded_from', 'entries_maplist')
from public.entries entry
join public.entries_maplist view on view.id = entry.id
where entry.status = 'published'
on conflict (entry_id, render_format, render_version) do update set
  rendered_payload = excluded.rendered_payload,
  source_hash = excluded.source_hash,
  rendered_at = excluded.rendered_at,
  stale_at = null,
  is_current = true,
  metadata = public.entry_render_cache.metadata || excluded.metadata;

create index if not exists entry_render_cache_entry_idx
on public.entry_render_cache (entry_id, render_format, render_version);

create index if not exists entry_render_cache_current_idx
on public.entry_render_cache (render_format, render_version, is_current)
where is_current = true;

create index if not exists entry_render_cache_payload_gin_idx
on public.entry_render_cache using gin (rendered_payload);

create or replace view public.entries_maplist
with (security_invoker = true) as
select
  entry.id,
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
      'city', city.name,
      'neighborhood', neighborhood.name,
      'country', coalesce(entry.country_name, city.country_name, destination.country_name),
      'continent', coalesce(
        entry.continent_name,
        city.continent_name,
        destination.continent_name,
        case when destination.scope = 'continent' then destination.name end
      ),
      'scope', coalesce(
        case when city.id is not null then 'city' end,
        destination.scope::text,
        case when entry.country_name = 'World' and entry.continent_name = 'Global' then 'continent' end,
        case when entry.country_name is not null then 'country' end
      )
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
  ) as list,
  entry.submission_type,
  entry.category,
  entry.city_id,
  entry.neighborhood_id,
  entry.destination_id,
  entry.status,
  entry.created_at,
  entry.updated_at,
  entry.user_id,
  entry.source_table
from public.entries entry
left join public.destinations destination on destination.id = entry.destination_id
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

alter table public.entries drop column if exists cached_map_list;
alter table public.events drop column if exists cached_map_list;
alter table public.entry_render_cache enable row level security;

do $$
begin
  create policy "Current public entry render cache is readable"
  on public.entry_render_cache
  for select
  using (
    is_current = true
    and exists (
      select 1
      from public.entries entry
      where entry.id = entry_render_cache.entry_id
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
