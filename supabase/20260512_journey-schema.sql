-- Rename itinerary schema vocabulary to journey.
--
-- Compatibility note:
-- The database source of truth uses `journey`, `journey_start_date`,
-- `journey_end_date`, `journey_date`, and `journey_day`.
-- The MapList compatibility view temporarily emits both journey* and
-- itinerary* payload keys so older frontend code keeps rendering while
-- the UI rename finishes.

do $$
begin
  if exists (
    select 1
    from pg_enum enum_value
    join pg_type enum_type on enum_type.oid = enum_value.enumtypid
    join pg_namespace enum_schema on enum_schema.oid = enum_type.typnamespace
    where enum_schema.nspname = 'public'
      and enum_type.typname = 'rguide_submission_type'
      and enum_value.enumlabel = 'itinerary'
  )
  and not exists (
    select 1
    from pg_enum enum_value
    join pg_type enum_type on enum_type.oid = enum_value.enumtypid
    join pg_namespace enum_schema on enum_schema.oid = enum_type.typnamespace
    where enum_schema.nspname = 'public'
      and enum_type.typname = 'rguide_submission_type'
      and enum_value.enumlabel = 'journey'
  ) then
    alter type public.rguide_submission_type rename value 'itinerary' to 'journey';
  end if;
end;
$$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'entries' and column_name = 'itinerary_start_date'
  )
  and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'entries' and column_name = 'journey_start_date'
  ) then
    alter table public.entries rename column itinerary_start_date to journey_start_date;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'entries' and column_name = 'itinerary_end_date'
  )
  and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'entries' and column_name = 'journey_end_date'
  ) then
    alter table public.entries rename column itinerary_end_date to journey_end_date;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'entry_stops' and column_name = 'itinerary_date'
  )
  and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'entry_stops' and column_name = 'journey_date'
  ) then
    alter table public.entry_stops rename column itinerary_date to journey_date;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'entry_stops' and column_name = 'itinerary_day'
  )
  and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'entry_stops' and column_name = 'journey_day'
  ) then
    alter table public.entry_stops rename column itinerary_day to journey_day;
  end if;
end;
$$;

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
      when entry.submission_type = 'journey' then 'itinerary'
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
