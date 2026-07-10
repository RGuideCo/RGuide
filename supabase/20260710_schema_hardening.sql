-- Harden the normalized rGuide schema without changing the frontend MapList contract.

begin;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- Backfill canonical destination descriptions before tightening read policies.
insert into public.destination_descriptions_v2 (
  destination_id,
  locale,
  title,
  summary,
  description,
  description_kind,
  is_primary,
  metadata
)
select
  destination.id,
  'en',
  destination.display_name,
  null,
  destination.description,
  'overview',
  true,
  jsonb_build_object('backfilled_from', 'destinations.description')
from public.destinations destination
where nullif(btrim(destination.description), '') is not null
  and not exists (
    select 1
    from public.destination_descriptions_v2 description
    where description.destination_id = destination.id
      and description.locale = 'en'
      and description.description_kind = 'overview'
  );

comment on column public.destinations.description is
  'Deprecated compatibility cache. Canonical copy lives in destination_descriptions_v2.';
comment on column public.destinations.subareas is
  'Deprecated compatibility cache. Canonical hierarchy uses destinations.parent_id.';
comment on column public.destinations.list_count is
  'Denormalized publishing counter; not a content source of truth.';
comment on column public.destinations.subarea_count is
  'Denormalized direct-child counter; canonical hierarchy uses destinations.parent_id.';

-- Repair the one known orphaned city before enforcing hierarchy rules.
update public.destinations city
set parent_id = country.id,
    updated_at = now()
from public.destinations country
where city.legacy_id = 'city:mexico:cancun'
  and city.parent_id is null
  and country.scope = 'country'
  and country.name = 'Mexico';

create or replace function private.validate_destination_hierarchy()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  parent_scope public.destination_scope;
begin
  if new.scope = 'continent' then
    if new.parent_id is not null then
      raise exception 'Continent destinations cannot have a parent';
    end if;
    return new;
  end if;

  if new.parent_id is null then
    raise exception '% destinations require a parent', new.scope;
  end if;

  if new.parent_id = new.id then
    raise exception 'A destination cannot be its own parent';
  end if;

  select destination.scope
  into parent_scope
  from public.destinations destination
  where destination.id = new.parent_id;

  if parent_scope is null then
    raise exception 'Destination parent % does not exist', new.parent_id;
  end if;

  if not (
    (new.scope = 'country' and parent_scope in ('continent', 'region'))
    or (new.scope = 'region' and parent_scope in ('continent', 'country', 'region'))
    or (new.scope = 'state' and parent_scope in ('country', 'region'))
    or (new.scope = 'city' and parent_scope in ('country', 'region', 'state'))
    or (new.scope = 'neighborhood' and parent_scope in ('city', 'neighborhood'))
  ) then
    raise exception 'Invalid destination hierarchy: % cannot be a child of %', new.scope, parent_scope;
  end if;

  if exists (
    with recursive ancestors as (
      select destination.id, destination.parent_id
      from public.destinations destination
      where destination.id = new.parent_id
      union all
      select destination.id, destination.parent_id
      from public.destinations destination
      join ancestors on ancestors.parent_id = destination.id
    )
    select 1 from ancestors where id = new.id
  ) then
    raise exception 'Destination hierarchy cannot contain a cycle';
  end if;

  return new;
end;
$$;

revoke all on function private.validate_destination_hierarchy() from public, anon, authenticated;

drop trigger if exists destinations_validate_hierarchy on public.destinations;
create trigger destinations_validate_hierarchy
before insert or update of scope, parent_id
on public.destinations
for each row
execute function private.validate_destination_hierarchy();

create or replace function private.validate_destination_links()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  payload jsonb := to_jsonb(new);
  city_id uuid := nullif(payload ->> 'city_id', '')::uuid;
  neighborhood_id uuid := nullif(payload ->> 'neighborhood_id', '')::uuid;
begin
  if city_id is not null and not exists (
    select 1 from public.destinations where id = city_id and scope = 'city'
  ) then
    raise exception 'city_id % must reference a city destination', city_id;
  end if;

  if neighborhood_id is not null and not exists (
    select 1 from public.destinations where id = neighborhood_id and scope = 'neighborhood'
  ) then
    raise exception 'neighborhood_id % must reference a neighborhood destination', neighborhood_id;
  end if;

  if city_id is not null and neighborhood_id is not null and not exists (
    with recursive ancestors as (
      select destination.id, destination.parent_id
      from public.destinations destination
      where destination.id = neighborhood_id
      union all
      select destination.id, destination.parent_id
      from public.destinations destination
      join ancestors on ancestors.parent_id = destination.id
    )
    select 1 from ancestors where id = city_id
  ) then
    raise exception 'Neighborhood % is not inside city %', neighborhood_id, city_id;
  end if;

  return new;
end;
$$;

revoke all on function private.validate_destination_links() from public, anon, authenticated;

drop trigger if exists entries_validate_destination_links on public.entries;
create trigger entries_validate_destination_links
before insert or update of city_id, neighborhood_id
on public.entries
for each row execute function private.validate_destination_links();

drop trigger if exists venues_validate_destination_links on public.venues;
create trigger venues_validate_destination_links
before insert or update of city_id, neighborhood_id
on public.venues
for each row execute function private.validate_destination_links();

drop trigger if exists events_validate_destination_links on public.events;
create trigger events_validate_destination_links
before insert or update of city_id, neighborhood_id
on public.events
for each row execute function private.validate_destination_links();

-- Add spatial points for scalable proximity queries while preserving [lat, lon] JSON compatibility.
alter table public.destinations
  add column if not exists location public.geography(Point, 4326)
  generated always as (
    case
      when coordinates is null then null
      else public.st_setsrid(
        public.st_makepoint(
          (coordinates ->> 1)::double precision,
          (coordinates ->> 0)::double precision
        ),
        4326
      )::public.geography
    end
  ) stored;

alter table public.venues
  add column if not exists location public.geography(Point, 4326)
  generated always as (
    case
      when coordinates is null then null
      else public.st_setsrid(
        public.st_makepoint(
          (coordinates ->> 1)::double precision,
          (coordinates ->> 0)::double precision
        ),
        4326
      )::public.geography
    end
  ) stored;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'destinations_coordinates_range_check'
      and conrelid = 'public.destinations'::regclass
  ) then
    alter table public.destinations
      add constraint destinations_coordinates_range_check check (
        coordinates is null or (
          jsonb_typeof(coordinates) = 'array'
          and jsonb_array_length(coordinates) = 2
          and (coordinates ->> 0)::double precision between -90 and 90
          and (coordinates ->> 1)::double precision between -180 and 180
        )
      ) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'venues_coordinates_range_check'
      and conrelid = 'public.venues'::regclass
  ) then
    alter table public.venues
      add constraint venues_coordinates_range_check check (
        coordinates is null or (
          jsonb_typeof(coordinates) = 'array'
          and jsonb_array_length(coordinates) = 2
          and (coordinates ->> 0)::double precision between -90 and 90
          and (coordinates ->> 1)::double precision between -180 and 180
        )
      ) not valid;
  end if;
end;
$$;

alter table public.destinations validate constraint destinations_coordinates_range_check;
alter table public.venues validate constraint venues_coordinates_range_check;

create index if not exists destinations_location_gist_idx
on public.destinations using gist (location)
where location is not null and is_published = true;

create index if not exists venues_location_gist_idx
on public.venues using gist (location)
where location is not null and merged_into_venue_id is null;

-- Same-name branches are valid when their coordinates differ.
drop index if exists public.venues_city_normalized_name_idx;

create index if not exists venues_city_normalized_name_idx
on public.venues (city_id, normalized_name)
where city_id is not null and merged_into_venue_id is null;

create unique index if not exists venues_city_name_coordinates_uidx
on public.venues (city_id, normalized_name, coordinates)
where city_id is not null
  and coordinates is not null
  and merged_into_venue_id is null;

create unique index if not exists venues_city_name_without_coordinates_uidx
on public.venues (city_id, normalized_name)
where city_id is not null
  and coordinates is null
  and merged_into_venue_id is null;

-- Add the foreign-key indexes reported by the Supabase advisor.
create index if not exists entry_stops_event_occurrence_id_fk_idx
on public.entry_stops (event_occurrence_id)
where event_occurrence_id is not null;

create index if not exists event_discovery_sources_destination_id_fk_idx
on public.event_discovery_sources (destination_id)
where destination_id is not null;

create index if not exists venue_taggings_source_id_fk_idx
on public.venue_taggings (source_id)
where source_id is not null;

-- Remove exact duplicate indexes; the unique indexes already cover these reads.
drop index if exists public.entry_render_cache_entry_idx;
drop index if exists public.sources_url_idx;
drop index if exists public.venue_special_hours_venue_date_idx;
drop index if exists public.venues_city_slug_idx;

-- Canonicalize the one known trailing-slash source duplicate and prevent recurrence.
with duplicate_sources as (
  select
    source.id,
    first_value(source.id) over (
      partition by regexp_replace(source.url, '/+$', '')
      order by (source.url !~ '/$') desc, source.created_at, source.id
    ) as canonical_id
  from public.sources source
), copied_links as (
  insert into public.entity_sources (
    entity_type,
    entity_id,
    source_id,
    relationship,
    confidence,
    excerpt,
    raw_metadata,
    sourced_at,
    created_at
  )
  select
    link.entity_type,
    link.entity_id,
    duplicate.canonical_id,
    link.relationship,
    link.confidence,
    link.excerpt,
    link.raw_metadata,
    link.sourced_at,
    link.created_at
  from public.entity_sources link
  join duplicate_sources duplicate on duplicate.id = link.source_id
  where duplicate.id <> duplicate.canonical_id
  on conflict (entity_type, entity_id, source_id, relationship) do nothing
  returning id
), removed_links as (
  delete from public.entity_sources link
  using duplicate_sources duplicate
  where link.source_id = duplicate.id
    and duplicate.id <> duplicate.canonical_id
  returning link.id
)
delete from public.sources source
using duplicate_sources duplicate
where source.id = duplicate.id
  and duplicate.id <> duplicate.canonical_id;

create unique index if not exists sources_canonical_url_uidx
on public.sources ((regexp_replace(url, '/+$', '')));

-- Polymorphic attribution needs database-level reference validation and cleanup.
create or replace function public.validate_entity_source_reference()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
declare
  reference_exists boolean := false;
begin
  case new.entity_type::text
    when 'destination' then
      select exists(select 1 from public.destinations where id = new.entity_id) into reference_exists;
    when 'destination_description' then
      select exists(select 1 from public.destination_descriptions_v2 where id = new.entity_id) into reference_exists;
    when 'venue' then
      select exists(select 1 from public.venues where id = new.entity_id) into reference_exists;
    when 'entry' then
      select exists(select 1 from public.entries where id = new.entity_id) into reference_exists;
    when 'entry_stop' then
      select exists(select 1 from public.entry_stops where id = new.entity_id) into reference_exists;
    when 'event' then
      select exists(select 1 from public.events where id = new.entity_id) into reference_exists;
    when 'event_occurrence' then
      select exists(select 1 from public.event_occurrences where id = new.entity_id) into reference_exists;
    when 'venue_hours' then
      select exists(select 1 from public.venue_hours where id = new.entity_id) into reference_exists;
    when 'venue_special_hours' then
      select exists(select 1 from public.venue_special_hours where id = new.entity_id) into reference_exists;
    when 'destination_boundary' then
      select exists(select 1 from public.destination_boundaries where id = new.entity_id) into reference_exists;
    when 'weekly_event_publication' then
      select exists(select 1 from public.weekly_event_publications where id = new.entity_id) into reference_exists;
    else
      reference_exists := false;
  end case;

  if not reference_exists then
    raise exception 'entity_sources % % does not reference an active normalized entity', new.entity_type, new.entity_id;
  end if;

  return new;
end;
$$;

revoke all on function public.validate_entity_source_reference() from public, anon, authenticated;

drop trigger if exists entity_sources_validate_reference on public.entity_sources;
create trigger entity_sources_validate_reference
before insert or update of entity_type, entity_id
on public.entity_sources
for each row
execute function public.validate_entity_source_reference();

create or replace function private.cleanup_polymorphic_references()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.entity_sources
  where entity_type::text = tg_argv[0]
    and entity_id = old.id;

  if coalesce(tg_argv[1], '') <> '' then
    delete from public.affiliate_links
    where entity_type::text = tg_argv[1]
      and entity_id = old.id;
  end if;

  return old;
end;
$$;

revoke all on function private.cleanup_polymorphic_references() from public, anon, authenticated;

drop trigger if exists destinations_cleanup_polymorphic_refs on public.destinations;
create trigger destinations_cleanup_polymorphic_refs after delete on public.destinations
for each row execute function private.cleanup_polymorphic_references('destination', 'destination');

drop trigger if exists destination_descriptions_cleanup_polymorphic_refs on public.destination_descriptions_v2;
create trigger destination_descriptions_cleanup_polymorphic_refs after delete on public.destination_descriptions_v2
for each row execute function private.cleanup_polymorphic_references('destination_description', '');

drop trigger if exists venues_cleanup_polymorphic_refs on public.venues;
create trigger venues_cleanup_polymorphic_refs after delete on public.venues
for each row execute function private.cleanup_polymorphic_references('venue', 'venue');

drop trigger if exists entries_cleanup_polymorphic_refs on public.entries;
create trigger entries_cleanup_polymorphic_refs after delete on public.entries
for each row execute function private.cleanup_polymorphic_references('entry', '');

drop trigger if exists entry_stops_cleanup_polymorphic_refs on public.entry_stops;
create trigger entry_stops_cleanup_polymorphic_refs after delete on public.entry_stops
for each row execute function private.cleanup_polymorphic_references('entry_stop', 'entry_stop');

drop trigger if exists events_cleanup_polymorphic_refs on public.events;
create trigger events_cleanup_polymorphic_refs after delete on public.events
for each row execute function private.cleanup_polymorphic_references('event', '');

drop trigger if exists event_occurrences_cleanup_polymorphic_refs on public.event_occurrences;
create trigger event_occurrences_cleanup_polymorphic_refs after delete on public.event_occurrences
for each row execute function private.cleanup_polymorphic_references('event_occurrence', '');

drop trigger if exists venue_hours_cleanup_polymorphic_refs on public.venue_hours;
create trigger venue_hours_cleanup_polymorphic_refs after delete on public.venue_hours
for each row execute function private.cleanup_polymorphic_references('venue_hours', '');

drop trigger if exists venue_special_hours_cleanup_polymorphic_refs on public.venue_special_hours;
create trigger venue_special_hours_cleanup_polymorphic_refs after delete on public.venue_special_hours
for each row execute function private.cleanup_polymorphic_references('venue_special_hours', '');

drop trigger if exists destination_boundaries_cleanup_polymorphic_refs on public.destination_boundaries;
create trigger destination_boundaries_cleanup_polymorphic_refs after delete on public.destination_boundaries
for each row execute function private.cleanup_polymorphic_references('destination_boundary', '');

drop trigger if exists weekly_event_publications_cleanup_polymorphic_refs on public.weekly_event_publications;
create trigger weekly_event_publications_cleanup_polymorphic_refs after delete on public.weekly_event_publications
for each row execute function private.cleanup_polymorphic_references('weekly_event_publication', '');

-- Keep the curated normalized filter vocabulary populated from authored fast-cache tags.
insert into public.venue_taggings (venue_id, tag_id, confidence, raw_metadata)
select
  venue.id,
  tag.id,
  1,
  jsonb_build_object('backfilled_from', 'venues.attribute_tags')
from public.venues venue
join public.venue_tags tag on tag.slug = any(venue.attribute_tags)
on conflict (venue_id, tag_id) do nothing;

create or replace function private.sync_known_venue_tags()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.venue_taggings (venue_id, tag_id, confidence, raw_metadata)
  select
    new.id,
    tag.id,
    1,
    jsonb_build_object('synced_from', 'venues.attribute_tags')
  from public.venue_tags tag
  where tag.is_active
    and tag.slug = any(new.attribute_tags)
  on conflict (venue_id, tag_id) do nothing;

  return new;
end;
$$;

revoke all on function private.sync_known_venue_tags() from public, anon, authenticated;

drop trigger if exists venues_sync_known_tags on public.venues;
create trigger venues_sync_known_tags
after insert or update of attribute_tags
on public.venues
for each row execute function private.sync_known_venue_tags();

-- Require clean SEO identity for published editorial guides.
update public.entries
set seo_slug = slug,
    updated_at = now()
where status = 'published'
  and source_table = 'editorial_guides'
  and submission_type not in ('event', 'journal')
  and nullif(btrim(seo_slug), '') is null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'entries_published_editorial_seo_slug_check'
      and conrelid = 'public.entries'::regclass
  ) then
    alter table public.entries
      add constraint entries_published_editorial_seo_slug_check check (
        status <> 'published'
        or source_table <> 'editorial_guides'
        or submission_type in ('event', 'journal')
        or nullif(btrim(seo_slug), '') is not null
      ) not valid;
  end if;
end;
$$;

alter table public.entries validate constraint entries_published_editorial_seo_slug_check;

-- Optimize mutable helper search paths.
alter function public.set_updated_at() set search_path = pg_catalog;
alter function public.validate_affiliate_link_entity() set search_path = pg_catalog;
alter function public.record_analytics_batch(jsonb) set search_path = '';
alter function public.record_analytics_click(jsonb) set search_path = '';
alter function public.analytics_dashboard_summary() set search_path = '';
alter function public.analytics_dashboard_summary(integer, integer, integer) set search_path = '';

-- Only the sanitized batch endpoint remains intentionally public.
revoke all on function public.record_analytics_batch(jsonb) from public, anon, authenticated;
grant execute on function public.record_analytics_batch(jsonb) to anon, authenticated, service_role;

revoke all on function public.record_analytics_click(jsonb) from public, anon, authenticated;
grant execute on function public.record_analytics_click(jsonb) to service_role;

revoke all on function public.analytics_dashboard_summary() from public, anon, authenticated;
grant execute on function public.analytics_dashboard_summary() to service_role;

revoke all on function public.analytics_dashboard_summary(integer, integer, integer) from public, anon, authenticated;
grant execute on function public.analytics_dashboard_summary(integer, integer, integer) to service_role;

revoke all on function public.st_estimatedextent(text, text) from public, anon, authenticated;
revoke all on function public.st_estimatedextent(text, text, text) from public, anon, authenticated;
revoke all on function public.st_estimatedextent(text, text, text, boolean) from public, anon, authenticated;

-- Consolidate ownership-aware policies so auth.uid() is evaluated once per query.
drop policy if exists "Published public entries are readable" on public.entries;
drop policy if exists "Users can read their own normalized entries" on public.entries;
drop policy if exists "Users can insert their own normalized entries" on public.entries;
drop policy if exists "Users can update their own normalized entries" on public.entries;
drop policy if exists "Users can delete their own normalized entries" on public.entries;

create policy "Published entries are readable by visitors"
on public.entries for select to anon
using (
  status = 'published'
  and (submission_type <> 'journal' or coalesce(journal_visibility, 'public') = 'public')
);

create policy "Published or owned entries are readable by users"
on public.entries for select to authenticated
using (
  (
    status = 'published'
    and (submission_type <> 'journal' or coalesce(journal_visibility, 'public') = 'public')
  )
  or user_id = (select auth.uid())
);

create policy "Users can insert owned entries"
on public.entries for insert to authenticated
with check (user_id = (select auth.uid()));

create policy "Users can update owned entries"
on public.entries for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "Users can delete owned entries"
on public.entries for delete to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Stops for published public entries are readable" on public.entry_stops;
drop policy if exists "Users can read stops for their own entries" on public.entry_stops;
drop policy if exists "Users can insert stops for their own entries" on public.entry_stops;
drop policy if exists "Users can update stops for their own entries" on public.entry_stops;
drop policy if exists "Users can delete stops for their own entries" on public.entry_stops;

create policy "Published stops are readable by visitors"
on public.entry_stops for select to anon
using (exists (
  select 1 from public.entries entry
  where entry.id = entry_stops.entry_id
    and entry.status = 'published'
    and (entry.submission_type <> 'journal' or coalesce(entry.journal_visibility, 'public') = 'public')
));

create policy "Published or owned stops are readable by users"
on public.entry_stops for select to authenticated
using (exists (
  select 1 from public.entries entry
  where entry.id = entry_stops.entry_id
    and (
      (
        entry.status = 'published'
        and (entry.submission_type <> 'journal' or coalesce(entry.journal_visibility, 'public') = 'public')
      )
      or entry.user_id = (select auth.uid())
    )
));

create policy "Users can insert stops for owned entries"
on public.entry_stops for insert to authenticated
with check (exists (
  select 1 from public.entries entry
  where entry.id = entry_stops.entry_id
    and entry.user_id = (select auth.uid())
));

create policy "Users can update stops for owned entries"
on public.entry_stops for update to authenticated
using (exists (
  select 1 from public.entries entry
  where entry.id = entry_stops.entry_id
    and entry.user_id = (select auth.uid())
))
with check (exists (
  select 1 from public.entries entry
  where entry.id = entry_stops.entry_id
    and entry.user_id = (select auth.uid())
));

create policy "Users can delete stops for owned entries"
on public.entry_stops for delete to authenticated
using (exists (
  select 1 from public.entries entry
  where entry.id = entry_stops.entry_id
    and entry.user_id = (select auth.uid())
));

drop policy if exists "Public entity sources are readable" on public.entity_sources;
drop policy if exists "Users can read entity sources for their own entries" on public.entity_sources;

create policy "Public entity sources are readable by visitors"
on public.entity_sources for select to anon
using (
  case entity_type::text
    when 'destination' then exists(select 1 from public.destinations x where x.id=entity_id and x.is_published)
    when 'destination_description' then exists(
      select 1 from public.destination_descriptions_v2 x
      join public.destinations d on d.id=x.destination_id
      where x.id=entity_id and d.is_published
    )
    when 'venue' then exists(select 1 from public.venues x where x.id=entity_id and x.moderation_status='approved' and x.merged_into_venue_id is null)
    when 'entry' then exists(select 1 from public.entries x where x.id=entity_id and x.status='published' and (x.submission_type <> 'journal' or coalesce(x.journal_visibility,'public')='public'))
    when 'entry_stop' then exists(
      select 1 from public.entry_stops x join public.entries e on e.id=x.entry_id
      where x.id=entity_id and e.status='published' and (e.submission_type <> 'journal' or coalesce(e.journal_visibility,'public')='public')
    )
    when 'event' then exists(select 1 from public.events x where x.id=entity_id and x.status='published')
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
  (
    case entity_type::text
      when 'destination' then exists(select 1 from public.destinations x where x.id=entity_id and x.is_published)
      when 'destination_description' then exists(select 1 from public.destination_descriptions_v2 x join public.destinations d on d.id=x.destination_id where x.id=entity_id and d.is_published)
      when 'venue' then exists(select 1 from public.venues x where x.id=entity_id and ((x.moderation_status='approved' and x.merged_into_venue_id is null) or x.created_by=(select auth.uid())))
      when 'entry' then exists(select 1 from public.entries x where x.id=entity_id and (x.user_id=(select auth.uid()) or (x.status='published' and (x.submission_type <> 'journal' or coalesce(x.journal_visibility,'public')='public'))))
      when 'entry_stop' then exists(select 1 from public.entry_stops x join public.entries e on e.id=x.entry_id where x.id=entity_id and (e.user_id=(select auth.uid()) or (e.status='published' and (e.submission_type <> 'journal' or coalesce(e.journal_visibility,'public')='public'))))
      when 'event' then exists(select 1 from public.events x where x.id=entity_id and x.status='published')
      when 'event_occurrence' then exists(select 1 from public.event_occurrences x join public.events e on e.id=x.event_id where x.id=entity_id and e.status='published')
      when 'venue_hours' then exists(select 1 from public.venue_hours x join public.venues v on v.id=x.venue_id where x.id=entity_id and ((v.moderation_status='approved' and v.merged_into_venue_id is null) or v.created_by=(select auth.uid())))
      when 'venue_special_hours' then exists(select 1 from public.venue_special_hours x join public.venues v on v.id=x.venue_id where x.id=entity_id and ((v.moderation_status='approved' and v.merged_into_venue_id is null) or v.created_by=(select auth.uid())))
      when 'destination_boundary' then exists(select 1 from public.destination_boundaries x where x.id=entity_id and x.is_active)
      when 'weekly_event_publication' then exists(select 1 from public.weekly_event_publications x join public.events e on e.id=x.event_id where x.id=entity_id and e.status='published')
      else false
    end
  )
);

drop policy if exists "Public sources are readable" on public.sources;
drop policy if exists "Users can read sources for their own entries" on public.sources;

create policy "Sources follow readable entity links"
on public.sources for select to anon, authenticated
using (exists (
  select 1 from public.entity_sources link
  where link.source_id = sources.id
));

-- Public content policies expose published/approved rows only.
drop policy if exists "destinations are readable" on public.destinations;
create policy "Published destinations are readable"
on public.destinations for select to anon, authenticated
using (is_published);

drop policy if exists "destination_descriptions_v2 are readable" on public.destination_descriptions_v2;
create policy "Published destination descriptions are readable"
on public.destination_descriptions_v2 for select to anon, authenticated
using (exists (
  select 1 from public.destinations destination
  where destination.id = destination_descriptions_v2.destination_id
    and destination.is_published
));

drop policy if exists "venues are readable" on public.venues;
create policy "Approved venues are readable"
on public.venues for select to anon
using (moderation_status='approved' and merged_into_venue_id is null);
create policy "Approved or owned venues are readable"
on public.venues for select to authenticated
using ((moderation_status='approved' and merged_into_venue_id is null) or created_by=(select auth.uid()));

drop policy if exists "events are readable" on public.events;
create policy "Published events are readable"
on public.events for select to anon, authenticated
using (status='published');

drop policy if exists "event_occurrences are readable" on public.event_occurrences;
create policy "Published event occurrences are readable"
on public.event_occurrences for select to anon, authenticated
using (exists(select 1 from public.events event where event.id=event_occurrences.event_id and event.status='published'));

drop policy if exists "weekly_event_publications are readable" on public.weekly_event_publications;
create policy "Published weekly events are readable"
on public.weekly_event_publications for select to anon, authenticated
using (exists(select 1 from public.events event where event.id=weekly_event_publications.event_id and event.status='published'));

-- Internal ingestion/configuration tables are service-role only.
drop policy if exists "Editorial POIs are readable" on public.editorial_pois;
drop policy if exists "event_city_publishing_settings are readable" on public.event_city_publishing_settings;
drop policy if exists "Active event discovery sources are readable" on public.event_discovery_sources;
drop policy if exists "Approved event discovery targets are readable" on public.event_discovery_source_targets;
drop policy if exists "event_source_runs are readable" on public.event_source_runs;
drop policy if exists "Event source run source logs are readable" on public.event_source_run_sources;

-- Scope every remaining public-schema policy to the API roles instead of PUBLIC.
do $$
declare
  policy_row record;
begin
  for policy_row in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and roles = array['public'::name]
  loop
    execute format(
      'alter policy %I on %I.%I to anon, authenticated',
      policy_row.policyname,
      policy_row.schemaname,
      policy_row.tablename
    );
  end loop;
end;
$$;

-- Remove obsolete archive policies; the schema remains service-role only.
do $$
declare
  policy_row record;
begin
  for policy_row in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'legacy_archive'
  loop
    execute format(
      'drop policy %I on %I.%I',
      policy_row.policyname,
      policy_row.schemaname,
      policy_row.tablename
    );
  end loop;
end;
$$;

revoke all on all tables in schema legacy_archive from public, anon, authenticated;

-- Public avatar URLs do not require a broad storage SELECT policy.
drop policy if exists "Avatar images are public" on storage.objects;
drop policy if exists "Users can upload their own avatar" on storage.objects;
drop policy if exists "Users can update their own avatar" on storage.objects;
drop policy if exists "Users can delete their own avatar" on storage.objects;

create policy "Users can upload their own avatar"
on storage.objects for insert to authenticated
with check (bucket_id='avatars' and (select auth.uid())::text=(storage.foldername(name))[1]);
create policy "Users can update their own avatar"
on storage.objects for update to authenticated
using (bucket_id='avatars' and (select auth.uid())::text=(storage.foldername(name))[1])
with check (bucket_id='avatars' and (select auth.uid())::text=(storage.foldername(name))[1]);
create policy "Users can delete their own avatar"
on storage.objects for delete to authenticated
using (bucket_id='avatars' and (select auth.uid())::text=(storage.foldername(name))[1]);

-- Explicit Data API grants replace the previous blanket privileges.
revoke all on all tables in schema public from anon, authenticated;

grant select on table
  public.destinations,
  public.destination_descriptions_v2,
  public.destination_category_insights,
  public.destination_category_insight_chips,
  public.destination_category_insight_notes,
  public.destination_category_neighborhood_strengths,
  public.destination_food_cuisines,
  public.destination_boundaries,
  public.entries,
  public.entry_stops,
  public.entry_render_cache,
  public.venues,
  public.venue_media,
  public.venue_hours,
  public.venue_special_hours,
  public.venue_tags,
  public.venue_taggings,
  public.sources,
  public.entity_sources,
  public.events,
  public.event_occurrences,
  public.weekly_event_publications,
  public.affiliate_links
to anon, authenticated;

grant select on table
  public.destination_tree,
  public.destination_boundaries_geojson,
  public.active_destination_category_insights,
  public.active_destination_category_neighborhood_strengths,
  public.active_destination_food_cuisines,
  public.entries_maplist,
  public.stay_venues,
  public.food_venues,
  public.nightlife_venues,
  public.other_venues,
  public.venue_hours_current,
  public.venue_events,
  public.weekly_events_maplist
to anon, authenticated;

grant insert, update, delete on table public.entries, public.entry_stops to authenticated;

alter default privileges in schema public revoke all on tables from anon, authenticated;

-- Restore the MapList view with normalized subcategories and optimized auth lookup.
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
    'submissionType', case when entry.submission_type='journey' then 'itinerary' else entry.submission_type::text end,
    'schemaSubmissionType', entry.submission_type::text,
    'journey', case when entry.journey_start_date is null and entry.journey_end_date is null then null else jsonb_build_object('startDate',entry.journey_start_date,'endDate',entry.journey_end_date) end,
    'itinerary', case when entry.journey_start_date is null and entry.journey_end_date is null then null else jsonb_build_object('startDate',entry.journey_start_date,'endDate',entry.journey_end_date) end,
    'journal', case when entry.journal_visited_at is null and entry.journal_note is null then null else jsonb_build_object('visitedAt',entry.journal_visited_at,'note',entry.journal_note,'visibility',entry.journal_visibility) end,
    'location', jsonb_build_object(
      'city',city.name,'neighborhood',neighborhood.name,
      'country',coalesce(entry.country_name,city.country_name,destination.country_name),
      'continent',coalesce(entry.continent_name,city.continent_name,destination.continent_name,case when destination.scope='continent' then destination.name end),
      'scope',coalesce(case when city.id is not null then 'city' end,destination.scope::text,case when entry.country_name='World' and entry.continent_name='Global' then 'continent' end,case when entry.country_name is not null then 'country' end)
    ),
    'creator',jsonb_build_object('id',entry.creator_id,'name',entry.creator_name,'avatar',entry.creator_avatar),
    'upvotes',entry.upvotes,
    'createdAt',entry.created_on,
    'stops',coalesce(stops.items,'[]'::jsonb),
    'sources',coalesce(sources.items,'[]'::jsonb)
  ) list,
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
left join public.destinations destination on destination.id=entry.destination_id
left join public.destinations city on city.id=entry.city_id
left join public.destinations neighborhood on neighborhood.id=entry.neighborhood_id
left join lateral (
  select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
    'id',coalesce(stop.legacy_id,stop.id::text),
    'poiId',stop.poi_legacy_id,
    'venueId',stop.venue_id,
    'sourceKind',stop.metadata->>'sourceKind',
    'sourceListId',stop.metadata->>'sourceListId',
    'sourceStopId',stop.metadata->>'sourceStopId',
    'sourceVenueId',stop.metadata->>'sourceVenueId',
    'externalPlace',stop.metadata->'externalPlace',
    'defaultDescription',stop.metadata->>'defaultDescription',
    'name',stop.name,
    'coordinates',stop.coordinates,
    'description',stop.description,
    'category',stop.category,
    'subcategory',stop.subcategory,
    'subcategories',to_jsonb(stop.subcategories),
    'venueKind',venue.venue_kind,
    'lodgingType',venue.lodging_type,
    'foodServiceType',venue.food_service_type,
    'cuisineTypes',to_jsonb(venue.cuisine_types),
    'nightlifeType',venue.nightlife_type,
    'musicGenres',to_jsonb(venue.music_genres),
    'attributeTags',to_jsonb(venue.attribute_tags),
    'tags',to_jsonb(venue.attribute_tags),
    'photo',coalesce(primary_media.public_url,primary_media.url),
    'price',stop.price_label,
    'priceSource',stop.price_source,
    'bookingUrl',stop.booking_url,
    'officialUrl',stop.official_url,
    'eventTime',stop.event_time_label,
    'eventVenue',stop.event_venue_label,
    'places',stop.places,
    'routeCoordinates',stop.metadata->'routeCoordinates',
    'journeyDate',stop.journey_date,
    'journeyDay',stop.journey_day,
    'itineraryDate',stop.journey_date,
    'itineraryDay',stop.journey_day,
    'hours',coalesce(canonical_hours.hours,to_jsonb(nullif(venue.hours_note,'')),stop.hours)
  )) order by stop.stop_order,stop.created_at) items
  from public.entry_stops stop
  left join public.venues venue on venue.id=stop.venue_id
  left join public.venue_media primary_media on primary_media.id=venue.primary_photo_id and primary_media.is_active
  left join lateral (
    select jsonb_object_agg(day_hours.day_key,day_hours.raw_text) hours
    from (
      select hour.day_of_week,
        case hour.day_of_week when 0 then 'sun' when 1 then 'mon' when 2 then 'tue' when 3 then 'wed' when 4 then 'thu' when 5 then 'fri' when 6 then 'sat' end day_key,
        string_agg(case when hour.is_closed then 'Closed' when hour.is_24_hours then '24 hours' else hour.raw_text end,'; ' order by hour.interval_order) raw_text
      from public.venue_hours hour
      where hour.venue_id=venue.id and hour.valid_from<=current_date and (hour.valid_to is null or hour.valid_to>=current_date)
      group by hour.day_of_week
    ) day_hours
  ) canonical_hours on true
  where stop.entry_id=entry.id
) stops on true
left join lateral (
  select jsonb_agg(jsonb_build_object('name',source.name,'url',source.url) order by entity_source.sourced_at desc) items
  from public.entity_sources entity_source
  join public.sources source on source.id=entity_source.source_id
  where entity_source.entity_type='entry' and entity_source.entity_id=entry.id
) sources on true
where (
  entry.status='published'
  and (entry.submission_type<>'journal' or coalesce(entry.journal_visibility,'public')='public')
) or entry.user_id=(select auth.uid());

grant select on public.entries_maplist to anon, authenticated;

-- Refresh the compatibility cache from normalized rows after the view change.
insert into public.entry_render_cache (
  entry_id,render_format,render_version,rendered_payload,source_hash,
  rendered_at,stale_at,is_current,metadata
)
select
  entry.id,'maplist',1,view.list,
  encode(digest(view.list::text,'sha256'),'hex'),
  now(),null,true,jsonb_build_object('refreshed_from','schema_hardening_20260710')
from public.entries entry
join public.entries_maplist view on view.id=entry.id
where entry.status='published'
on conflict (entry_id,render_format,render_version) do update set
  rendered_payload=excluded.rendered_payload,
  source_hash=excluded.source_hash,
  rendered_at=excluded.rendered_at,
  stale_at=null,
  is_current=true,
  metadata=public.entry_render_cache.metadata||excluded.metadata;

commit;
