-- Make venue media the canonical source for venue photos.
-- `venues` stores only the selected media pointer; URLs and attribution live
-- in `venue_media`. Existing stop/event/POI photo columns are backfilled into
-- venue media and remain only as legacy migration inputs.

create table if not exists public.venue_media (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete cascade,
  url text not null,
  media_type text not null default 'image',
  role text not null default 'gallery',
  credit text,
  source_url text,
  license text,
  attribution text,
  width integer,
  height integer,
  validation_status text not null default 'unchecked',
  validation_error text,
  last_validated_at timestamptz,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  source_type text,
  source_entity_type text,
  source_entity_id uuid,
  source_legacy_id text,
  raw_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint venue_media_url_not_blank check (btrim(url) <> ''),
  constraint venue_media_media_type_check check (media_type in ('image')),
  constraint venue_media_role_check check (
    role in (
      'primary',
      'gallery',
      'exterior',
      'interior',
      'room',
      'food',
      'menu',
      'event',
      'logo'
    )
  ),
  constraint venue_media_validation_status_check check (
    validation_status in ('unchecked', 'valid', 'invalid', 'needs_review')
  ),
  constraint venue_media_dimensions_check check (
    (width is null or width > 0)
    and (height is null or height > 0)
  )
);

drop trigger if exists venue_media_set_updated_at on public.venue_media;
create trigger venue_media_set_updated_at
before update on public.venue_media
for each row
execute function public.set_updated_at();

alter table public.venues
  add column if not exists primary_photo_id uuid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'venues_primary_photo_id_fkey'
      and conrelid = 'public.venues'::regclass
  ) then
    alter table public.venues
      add constraint venues_primary_photo_id_fkey
      foreign key (primary_photo_id)
      references public.venue_media(id)
      on delete set null;
  end if;
end;
$$;

create unique index if not exists venue_media_venue_url_idx
on public.venue_media (venue_id, url);

create index if not exists venue_media_venue_role_idx
on public.venue_media (venue_id, role, sort_order)
where is_active = true;

create index if not exists venue_media_source_idx
on public.venue_media (source_type, source_entity_type, source_legacy_id);

create index if not exists venues_primary_photo_idx
on public.venues (primary_photo_id)
where primary_photo_id is not null;

alter table public.venue_media enable row level security;

do $$
begin
  create policy "Venue media is readable when venue appears in published content"
  on public.venue_media
  for select
  using (
    is_active = true
    and exists (
      select 1
      from public.entry_stops stop
      join public.entries entry on entry.id = stop.entry_id
      where stop.venue_id = venue_media.venue_id
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

with stop_photos as (
  select distinct on (stop.venue_id, btrim(stop.photo_url))
    stop.venue_id,
    btrim(stop.photo_url) as url,
    'primary'::text as role,
    'entry_stop'::text as source_type,
    'entry_stop'::text as source_entity_type,
    stop.id as source_entity_id,
    stop.legacy_id as source_legacy_id,
    jsonb_build_object(
      'source', 'entry_stops.photo_url',
      'entry_id', stop.entry_id,
      'poi_legacy_id', stop.poi_legacy_id
    ) as raw_metadata
  from public.entry_stops stop
  where stop.venue_id is not null
    and stop.photo_url is not null
    and btrim(stop.photo_url) <> ''
  order by stop.venue_id, btrim(stop.photo_url), stop.stop_order, stop.created_at
),
inserted as (
  insert into public.venue_media (
    venue_id,
    url,
    role,
    source_type,
    source_entity_type,
    source_entity_id,
    source_legacy_id,
    raw_metadata,
    sort_order
  )
  select
    venue_id,
    url,
    role,
    source_type,
    source_entity_type,
    source_entity_id,
    source_legacy_id,
    raw_metadata,
    0
  from stop_photos
  on conflict (venue_id, url) do update set
    role = case
      when public.venue_media.role = 'gallery' then excluded.role
      else public.venue_media.role
    end,
    source_type = coalesce(public.venue_media.source_type, excluded.source_type),
    source_entity_type = coalesce(public.venue_media.source_entity_type, excluded.source_entity_type),
    source_entity_id = coalesce(public.venue_media.source_entity_id, excluded.source_entity_id),
    source_legacy_id = coalesce(public.venue_media.source_legacy_id, excluded.source_legacy_id),
    raw_metadata = public.venue_media.raw_metadata || excluded.raw_metadata,
    is_active = true,
    updated_at = now()
  returning id, venue_id
)
update public.venues venue
set primary_photo_id = inserted.id,
    updated_at = now()
from inserted
where venue.id = inserted.venue_id
  and venue.primary_photo_id is null;

with editorial_poi_photos as (
  select distinct on (stop.venue_id, btrim(poi.photo))
    stop.venue_id,
    btrim(poi.photo) as url,
    'gallery'::text as role,
    'editorial_poi'::text as source_type,
    'editorial_poi'::text as source_entity_type,
    null::uuid as source_entity_id,
    poi.id as source_legacy_id,
    jsonb_build_object(
      'source', 'editorial_pois.photo',
      'poi_id', poi.id,
      'entry_stop_id', stop.id
    ) as raw_metadata
  from public.entry_stops stop
  join public.editorial_pois poi on poi.id = stop.poi_legacy_id
  where stop.venue_id is not null
    and poi.photo is not null
    and btrim(poi.photo) <> ''
  order by stop.venue_id, btrim(poi.photo), stop.stop_order, stop.created_at
),
inserted as (
  insert into public.venue_media (
    venue_id,
    url,
    role,
    source_type,
    source_entity_type,
    source_entity_id,
    source_legacy_id,
    raw_metadata,
    sort_order
  )
  select
    venue_id,
    url,
    role,
    source_type,
    source_entity_type,
    source_entity_id,
    source_legacy_id,
    raw_metadata,
    10
  from editorial_poi_photos
  on conflict (venue_id, url) do update set
    source_type = coalesce(public.venue_media.source_type, excluded.source_type),
    source_entity_type = coalesce(public.venue_media.source_entity_type, excluded.source_entity_type),
    source_legacy_id = coalesce(public.venue_media.source_legacy_id, excluded.source_legacy_id),
    raw_metadata = public.venue_media.raw_metadata || excluded.raw_metadata,
    is_active = true,
    updated_at = now()
  returning id, venue_id
)
update public.venues venue
set primary_photo_id = inserted.id,
    updated_at = now()
from inserted
where venue.id = inserted.venue_id
  and venue.primary_photo_id is null;

with event_photos as (
  select distinct on (event.venue_id, btrim(event.photo_url))
    event.venue_id,
    btrim(event.photo_url) as url,
    'event'::text as role,
    'event'::text as source_type,
    'event'::text as source_entity_type,
    event.id as source_entity_id,
    event.legacy_id as source_legacy_id,
    jsonb_build_object(
      'source', 'events.photo_url',
      'event_id', event.id
    ) as raw_metadata
  from public.events event
  where event.venue_id is not null
    and event.photo_url is not null
    and btrim(event.photo_url) <> ''
  order by event.venue_id, btrim(event.photo_url), event.created_at desc
),
inserted as (
  insert into public.venue_media (
    venue_id,
    url,
    role,
    source_type,
    source_entity_type,
    source_entity_id,
    source_legacy_id,
    raw_metadata,
    sort_order
  )
  select
    venue_id,
    url,
    role,
    source_type,
    source_entity_type,
    source_entity_id,
    source_legacy_id,
    raw_metadata,
    20
  from event_photos
  on conflict (venue_id, url) do update set
    raw_metadata = public.venue_media.raw_metadata || excluded.raw_metadata,
    is_active = true,
    updated_at = now()
  returning id, venue_id
)
update public.venues venue
set primary_photo_id = inserted.id,
    updated_at = now()
from inserted
where venue.id = inserted.venue_id
  and venue.primary_photo_id is null;

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
    'submissionType', case
      when entry.submission_type = 'journey'::public.rguide_submission_type then 'itinerary'
      else entry.submission_type::text
    end,
    'schemaSubmissionType', entry.submission_type::text,
    'journey', case
      when entry.journey_start_date is null and entry.journey_end_date is null then null
      else jsonb_build_object(
        'startDate', entry.journey_start_date,
        'endDate', entry.journey_end_date
      )
    end,
    'itinerary', case
      when entry.journey_start_date is null and entry.journey_end_date is null then null
      else jsonb_build_object(
        'startDate', entry.journey_start_date,
        'endDate', entry.journey_end_date
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
        case when destination.scope = 'continent'::public.destination_scope then destination.name end
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
        'photo', coalesce(primary_media.url, stop.photo_url),
        'price', stop.price_label,
        'priceSource', stop.price_source,
        'bookingUrl', stop.booking_url,
        'officialUrl', stop.official_url,
        'eventTime', stop.event_time_label,
        'eventVenue', stop.event_venue_label,
        'places', stop.places,
        'journeyDate', stop.journey_date,
        'journeyDay', stop.journey_day,
        'itineraryDate', stop.journey_date,
        'itineraryDay', stop.journey_day,
        'hours', stop.hours
      )
    )
    order by stop.stop_order, stop.created_at
  ) as items
  from public.entry_stops stop
  left join public.venues venue on venue.id = stop.venue_id
  left join public.venue_media primary_media
    on primary_media.id = venue.primary_photo_id
    and primary_media.is_active = true
  where stop.entry_id = entry.id
) stops on true
left join lateral (
  select jsonb_agg(
    jsonb_build_object('name', source.name, 'url', source.url)
    order by entity_source.sourced_at desc
  ) as items
  from public.entity_sources entity_source
  join public.sources source on source.id = entity_source.source_id
  where entity_source.entity_type = 'entry'::public.rguide_source_entity_type
    and entity_source.entity_id = entry.id
) sources on true
where entry.status = 'published'::public.rguide_entry_status
  and (
    entry.submission_type <> 'journal'::public.rguide_submission_type
    or coalesce(entry.journal_visibility, 'public') = 'public'
  );

insert into public.entry_render_cache (
  entry_id,
  render_format,
  render_version,
  rendered_payload,
  source_hash,
  rendered_at,
  stale_at,
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
  null,
  true,
  jsonb_build_object('refreshed_from', 'venue_media_primary_photos')
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
