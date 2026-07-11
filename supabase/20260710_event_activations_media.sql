begin;

-- Festivals need a stable content layer between the parent event and scheduled times.
create table if not exists public.event_activations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  legacy_id text not null,
  slug text not null,
  title text not null,
  description text,
  activation_category text,
  venue_id uuid references public.venues(id) on delete set null,
  official_url text,
  booking_url text,
  price_label text,
  sort_order integer not null default 0 check (sort_order >= 0),
  raw_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, legacy_id),
  unique (event_id, slug),
  unique (id, event_id)
);

create index if not exists event_activations_event_order_idx
  on public.event_activations(event_id, sort_order, id);
create index if not exists event_activations_venue_idx
  on public.event_activations(venue_id) where venue_id is not null;

drop trigger if exists event_activations_set_updated_at on public.event_activations;
create trigger event_activations_set_updated_at
before update on public.event_activations
for each row execute function public.set_updated_at();

alter table public.event_occurrences
  add column if not exists activation_id uuid;

insert into public.event_activations (
  event_id, legacy_id, slug, title, description, activation_category,
  venue_id, official_url, booking_url, price_label, sort_order, raw_metadata
)
select
  occurrence.event_id,
  event.legacy_id || ':activation:' || md5(lower(btrim(occurrence.title))),
  coalesce(
    nullif(trim(both '-' from regexp_replace(lower(btrim(occurrence.title)), '[^a-z0-9]+', '-', 'g')), ''),
    'activation'
  ) || '-' || substr(md5(lower(btrim(occurrence.title))), 1, 8),
  (array_agg(occurrence.title order by occurrence.occurrence_order, occurrence.id))[1],
  (array_agg(occurrence.description order by occurrence.occurrence_order, occurrence.id))[1],
  event.event_category,
  case when count(distinct occurrence.venue_id) = 1
    then (array_agg(occurrence.venue_id order by occurrence.occurrence_order, occurrence.id)
      filter (where occurrence.venue_id is not null))[1]
    else null
  end,
  (array_agg(occurrence.official_url order by occurrence.occurrence_order, occurrence.id)
    filter (where occurrence.official_url is not null))[1],
  (array_agg(occurrence.booking_url order by occurrence.occurrence_order, occurrence.id)
    filter (where occurrence.booking_url is not null))[1],
  (array_agg(occurrence.price_label order by occurrence.occurrence_order, occurrence.id)
    filter (where occurrence.price_label is not null))[1],
  min(occurrence.occurrence_order),
  jsonb_build_object('backfilled_from', 'event_occurrences')
from public.event_occurrences occurrence
join public.events event on event.id = occurrence.event_id
group by occurrence.event_id, event.legacy_id, event.event_category, lower(btrim(occurrence.title))
on conflict (event_id, legacy_id) do update set
  title = excluded.title,
  description = excluded.description,
  activation_category = excluded.activation_category,
  venue_id = excluded.venue_id,
  official_url = excluded.official_url,
  booking_url = excluded.booking_url,
  price_label = excluded.price_label,
  sort_order = excluded.sort_order,
  raw_metadata = public.event_activations.raw_metadata || excluded.raw_metadata,
  updated_at = now();

update public.event_occurrences occurrence
set activation_id = activation.id,
    updated_at = now()
from public.events event
join public.event_activations activation on activation.event_id = event.id
where occurrence.event_id = event.id
  and activation.legacy_id = event.legacy_id || ':activation:' || md5(lower(btrim(occurrence.title)))
  and occurrence.activation_id is distinct from activation.id;

alter table public.event_occurrences
  alter column activation_id set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'event_occurrences_id_event_unique'
      and conrelid = 'public.event_occurrences'::regclass
  ) then
    alter table public.event_occurrences
      add constraint event_occurrences_id_event_unique unique (id, event_id);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'event_occurrences_activation_event_fkey'
      and conrelid = 'public.event_occurrences'::regclass
  ) then
    alter table public.event_occurrences
      add constraint event_occurrences_activation_event_fkey
      foreign key (activation_id, event_id)
      references public.event_activations(id, event_id)
      on delete cascade;
  end if;
end;
$$;

create index if not exists event_occurrences_activation_start_idx
  on public.event_occurrences(activation_id, starts_at, id);

-- Event and activation artwork is not venue media. Keep it sourceable and R2-aware.
create table if not exists public.event_media (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  activation_id uuid,
  occurrence_id uuid,
  url text not null,
  public_url text,
  media_type text not null default 'image',
  role text not null default 'gallery',
  credit text,
  source_url text,
  license text,
  attribution text,
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  content_type text,
  byte_size bigint check (byte_size is null or byte_size >= 0),
  storage_provider text,
  storage_bucket text,
  storage_key text,
  validation_status text not null default 'unchecked',
  validation_error text,
  last_validated_at timestamptz,
  ingestion_status text not null default 'external',
  ingestion_error text,
  ingested_at timestamptz,
  is_active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  raw_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (num_nonnulls(activation_id, occurrence_id) <= 1),
  foreign key (activation_id, event_id)
    references public.event_activations(id, event_id) on delete cascade,
  foreign key (occurrence_id, event_id)
    references public.event_occurrences(id, event_id) on delete cascade
);

create index if not exists event_media_event_idx
  on public.event_media(event_id, is_active, sort_order);
create index if not exists event_media_activation_idx
  on public.event_media(activation_id, is_active, sort_order)
  where activation_id is not null;
create index if not exists event_media_occurrence_idx
  on public.event_media(occurrence_id, is_active, sort_order)
  where occurrence_id is not null;
create index if not exists event_media_storage_key_idx
  on public.event_media(storage_key) where storage_key is not null;
create unique index if not exists event_media_event_primary_uidx
  on public.event_media(event_id)
  where activation_id is null and occurrence_id is null and role = 'primary' and is_active;
create unique index if not exists event_media_activation_primary_uidx
  on public.event_media(activation_id)
  where activation_id is not null and occurrence_id is null and role = 'primary' and is_active;
create unique index if not exists event_media_occurrence_primary_uidx
  on public.event_media(occurrence_id)
  where occurrence_id is not null and role = 'primary' and is_active;

drop trigger if exists event_media_set_updated_at on public.event_media;
create trigger event_media_set_updated_at
before update on public.event_media
for each row execute function public.set_updated_at();

-- Preserve event-level images already held on the canonical event row.
insert into public.event_media (
  event_id, url, public_url, role, source_url, storage_provider,
  ingestion_status, is_active, raw_metadata
)
select
  event.id,
  event.photo_url,
  case when event.photo_url like 'https://media.rguide.co/%' then event.photo_url end,
  'primary',
  event.photo_url,
  case when event.photo_url like 'https://media.rguide.co/%' then 'cloudflare_r2' end,
  case when event.photo_url like 'https://media.rguide.co/%' then 'uploaded' else 'external' end,
  true,
  jsonb_build_object('backfilled_from', 'events.photo_url')
from public.events event
where nullif(btrim(event.photo_url), '') is not null
  and not exists (
    select 1 from public.event_media media
    where media.event_id = event.id
      and media.activation_id is null
      and media.occurrence_id is null
      and media.role = 'primary'
      and media.is_active
  );

-- Locate schedule-item pseudo-venues created by the first event-card backfill.
create temporary table event_pseudo_venues on commit drop as
select distinct
  venue.id as venue_id,
  stop.event_id,
  occurrence.activation_id,
  venue.primary_photo_id as venue_media_id
from public.entries entry
join public.entry_stops stop on stop.entry_id = entry.id
join public.venues venue on venue.id = stop.venue_id
join public.event_occurrences occurrence on occurrence.id = stop.event_occurrence_id
where entry.submission_type = 'event'
  and stop.venue_id is distinct from occurrence.venue_id
  and lower(venue.name) = lower(stop.name)
  and not exists (select 1 from public.events event where event.venue_id = venue.id)
  and not exists (select 1 from public.event_occurrences other where other.venue_id = venue.id)
  and not exists (
    select 1
    from public.entry_stops other_stop
    join public.entries other_entry on other_entry.id = other_stop.entry_id
    where other_stop.venue_id = venue.id
      and other_entry.submission_type <> 'event'
  );

insert into public.event_media (
  event_id, activation_id, url, public_url, media_type, role, credit,
  source_url, license, attribution, width, height, content_type, byte_size,
  storage_provider, storage_bucket, storage_key, validation_status,
  validation_error, last_validated_at, ingestion_status, ingestion_error,
  ingested_at, is_active, sort_order, raw_metadata, created_at, updated_at
)
select
  pseudo.event_id,
  pseudo.activation_id,
  media.url,
  media.public_url,
  media.media_type,
  'primary',
  media.credit,
  media.source_url,
  media.license,
  media.attribution,
  media.width,
  media.height,
  media.content_type,
  media.byte_size,
  media.storage_provider,
  media.storage_bucket,
  media.storage_key,
  media.validation_status,
  media.validation_error,
  media.last_validated_at,
  media.ingestion_status,
  media.ingestion_error,
  media.ingested_at,
  media.is_active,
  media.sort_order,
  media.raw_metadata || jsonb_build_object(
    'migrated_from', 'venue_media',
    'source_venue_id', pseudo.venue_id,
    'source_venue_media_id', media.id
  ),
  media.created_at,
  now()
from event_pseudo_venues pseudo
join public.venue_media media on media.id = pseudo.venue_media_id
where not exists (
  select 1 from public.event_media existing
  where existing.activation_id = pseudo.activation_id
    and existing.role = 'primary'
    and existing.is_active
);

-- Render stops now point at physical venues; their content identity is the activation.
update public.entry_stops stop
set venue_id = occurrence.venue_id,
    updated_at = now()
from public.event_occurrences occurrence
where occurrence.id = stop.event_occurrence_id
  and stop.venue_id is distinct from occurrence.venue_id;

update public.venues venue
set primary_photo_id = null,
    updated_at = now()
where venue.id in (select venue_id from event_pseudo_venues);

delete from public.venues venue
where venue.id in (select venue_id from event_pseudo_venues);

alter table public.event_activations enable row level security;
alter table public.event_media enable row level security;

create policy "Published event activations are readable"
on public.event_activations for select to anon, authenticated
using (exists (
  select 1 from public.events event
  where event.id = event_activations.event_id and event.status = 'published'
));

create policy "Published event media is readable"
on public.event_media for select to anon, authenticated
using (exists (
  select 1 from public.events event
  where event.id = event_media.event_id and event.status = 'published'
));

grant select on public.event_activations, public.event_media to anon, authenticated;

create or replace view public.event_schedule_items
with (security_invoker = true) as
select
  event.id as event_id,
  event.slug as event_slug,
  event.title as event_title,
  event.event_category,
  event.guide_category,
  event.city_id,
  event.destination_id,
  event.neighborhood_id,
  event.timezone,
  event.is_festival,
  activation.id as activation_id,
  activation.slug as activation_slug,
  activation.title as activation_title,
  activation.description as activation_description,
  activation.activation_category,
  activation.sort_order as activation_order,
  occurrence.id as occurrence_id,
  occurrence.starts_at,
  occurrence.ends_at,
  occurrence.starts_on,
  occurrence.ends_on,
  occurrence.occurrence_order,
  occurrence.price_label,
  coalesce(occurrence.booking_url, activation.booking_url, event.official_url) as booking_url,
  coalesce(occurrence.official_url, activation.official_url, event.official_url) as official_url,
  occurrence.venue_id,
  venue.name as venue_name,
  coalesce(occurrence.coordinates, venue.coordinates) as coordinates,
  coalesce(media.public_url, media.url, event.photo_url) as photo_url,
  media.credit as photo_credit,
  media.source_url as photo_source_url,
  media.license as photo_license
from public.events event
join public.event_activations activation on activation.event_id = event.id
join public.event_occurrences occurrence on occurrence.activation_id = activation.id
left join public.venues venue on venue.id = occurrence.venue_id
left join lateral (
  select candidate.*
  from public.event_media candidate
  where candidate.event_id = event.id
    and candidate.is_active
    and (
      candidate.occurrence_id = occurrence.id
      or (candidate.occurrence_id is null and candidate.activation_id = activation.id)
      or (candidate.occurrence_id is null and candidate.activation_id is null)
    )
  order by
    case
      when candidate.occurrence_id = occurrence.id then 0
      when candidate.activation_id = activation.id then 1
      else 2
    end,
    case when candidate.role = 'primary' then 0 else 1 end,
    candidate.sort_order,
    candidate.created_at
  limit 1
) media on true
where event.status = 'published';

grant select on public.event_schedule_items to anon, authenticated;

alter type public.rguide_source_entity_type add value if not exists 'event_activation';

create or replace function public.validate_entity_source_reference()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
declare
  reference_exists boolean := false;
begin
  case new.entity_type::text
    when 'destination' then select exists(select 1 from public.destinations where id=new.entity_id) into reference_exists;
    when 'destination_description' then select exists(select 1 from public.destination_descriptions_v2 where id=new.entity_id) into reference_exists;
    when 'venue' then select exists(select 1 from public.venues where id=new.entity_id) into reference_exists;
    when 'entry' then select exists(select 1 from public.entries where id=new.entity_id) into reference_exists;
    when 'entry_stop' then select exists(select 1 from public.entry_stops where id=new.entity_id) into reference_exists;
    when 'event' then select exists(select 1 from public.events where id=new.entity_id) into reference_exists;
    when 'event_activation' then select exists(select 1 from public.event_activations where id=new.entity_id) into reference_exists;
    when 'event_occurrence' then select exists(select 1 from public.event_occurrences where id=new.entity_id) into reference_exists;
    when 'venue_hours' then select exists(select 1 from public.venue_hours where id=new.entity_id) into reference_exists;
    when 'venue_special_hours' then select exists(select 1 from public.venue_special_hours where id=new.entity_id) into reference_exists;
    when 'destination_boundary' then select exists(select 1 from public.destination_boundaries where id=new.entity_id) into reference_exists;
    when 'weekly_event_publication' then select exists(select 1 from public.weekly_event_publications where id=new.entity_id) into reference_exists;
    else reference_exists := false;
  end case;

  if not reference_exists then
    raise exception 'entity_sources % % does not reference an active normalized entity', new.entity_type, new.entity_id;
  end if;
  return new;
end;
$$;

revoke all on function public.validate_entity_source_reference() from public, anon, authenticated;

drop policy if exists "Public entity sources are readable" on public.entity_sources;
drop policy if exists "Public or owned entity sources are readable by users" on public.entity_sources;

create policy "Public entity sources are readable"
on public.entity_sources for select to anon
using (
  case entity_type::text
    when 'destination' then exists(select 1 from public.destinations x where x.id=entity_id and x.is_published)
    when 'destination_description' then exists(select 1 from public.destination_descriptions_v2 x join public.destinations d on d.id=x.destination_id where x.id=entity_id and d.is_published)
    when 'venue' then exists(select 1 from public.venues x where x.id=entity_id and x.moderation_status='approved' and x.merged_into_venue_id is null)
    when 'entry' then exists(select 1 from public.entries x where x.id=entity_id and x.status='published' and (x.submission_type <> 'journal' or coalesce(x.journal_visibility,'public')='public'))
    when 'entry_stop' then exists(select 1 from public.entry_stops x join public.entries e on e.id=x.entry_id where x.id=entity_id and e.status='published' and (e.submission_type <> 'journal' or coalesce(e.journal_visibility,'public')='public'))
    when 'event' then exists(select 1 from public.events x where x.id=entity_id and x.status='published')
    when 'event_activation' then exists(select 1 from public.event_activations x join public.events e on e.id=x.event_id where x.id=entity_id and e.status='published')
    when 'event_occurrence' then exists(select 1 from public.event_occurrences x join public.events e on e.id=x.event_id where x.id=entity_id and e.status='published')
    when 'venue_hours' then exists(select 1 from public.venue_hours x join public.venues v on v.id=x.venue_id where x.id=entity_id and v.moderation_status='approved' and v.merged_into_venue_id is null)
    when 'venue_special_hours' then exists(select 1 from public.venue_special_hours x join public.venues v on v.id=x.venue_id where x.id=entity_id and v.moderation_status='approved' and v.merged_into_venue_id is null)
    when 'destination_boundary' then exists(select 1 from public.destination_boundaries x where x.id=entity_id and x.is_active)
    when 'weekly_event_publication' then exists(select 1 from public.weekly_event_publications x join public.events e on e.id=x.event_id where x.id=entity_id and e.status='published')
    else false
  end
);

create policy "Public or owned entity sources are readable by users"
on public.entity_sources for select to authenticated
using (
  case entity_type::text
    when 'destination' then exists(select 1 from public.destinations x where x.id=entity_id and x.is_published)
    when 'destination_description' then exists(select 1 from public.destination_descriptions_v2 x join public.destinations d on d.id=x.destination_id where x.id=entity_id and d.is_published)
    when 'venue' then exists(select 1 from public.venues x where x.id=entity_id and ((x.moderation_status='approved' and x.merged_into_venue_id is null) or x.created_by=(select auth.uid())))
    when 'entry' then exists(select 1 from public.entries x where x.id=entity_id and (x.user_id=(select auth.uid()) or (x.status='published' and (x.submission_type <> 'journal' or coalesce(x.journal_visibility,'public')='public'))))
    when 'entry_stop' then exists(select 1 from public.entry_stops x join public.entries e on e.id=x.entry_id where x.id=entity_id and (e.user_id=(select auth.uid()) or (e.status='published' and (e.submission_type <> 'journal' or coalesce(e.journal_visibility,'public')='public'))))
    when 'event' then exists(select 1 from public.events x where x.id=entity_id and x.status='published')
    when 'event_activation' then exists(select 1 from public.event_activations x join public.events e on e.id=x.event_id where x.id=entity_id and e.status='published')
    when 'event_occurrence' then exists(select 1 from public.event_occurrences x join public.events e on e.id=x.event_id where x.id=entity_id and e.status='published')
    when 'venue_hours' then exists(select 1 from public.venue_hours x join public.venues v on v.id=x.venue_id where x.id=entity_id and ((v.moderation_status='approved' and v.merged_into_venue_id is null) or v.created_by=(select auth.uid())))
    when 'venue_special_hours' then exists(select 1 from public.venue_special_hours x join public.venues v on v.id=x.venue_id where x.id=entity_id and ((v.moderation_status='approved' and v.merged_into_venue_id is null) or v.created_by=(select auth.uid())))
    when 'destination_boundary' then exists(select 1 from public.destination_boundaries x where x.id=entity_id and x.is_active)
    when 'weekly_event_publication' then exists(select 1 from public.weekly_event_publications x join public.events e on e.id=x.event_id where x.id=entity_id and e.status='published')
    else false
  end
);

drop trigger if exists event_activations_cleanup_polymorphic_refs on public.event_activations;
create trigger event_activations_cleanup_polymorphic_refs
after delete on public.event_activations
for each row execute function private.cleanup_polymorphic_references('event_activation', '');

comment on table public.event_activations is
  'Stable nested content inside an event or festival. One activation may have multiple scheduled event_occurrences.';
comment on table public.event_media is
  'Canonical event, activation, or occurrence media. Venue media remains reserved for physical places.';

commit;
