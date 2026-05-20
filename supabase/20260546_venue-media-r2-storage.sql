-- Add Cloudflare R2 storage metadata to canonical venue media.
-- `url` remains the app-facing image URL. For migrated images, it should be
-- the R2/custom-domain URL while `source_url` preserves the original source.

alter table public.venue_media
  add column if not exists storage_provider text,
  add column if not exists storage_bucket text,
  add column if not exists storage_key text,
  add column if not exists public_url text,
  add column if not exists content_type text,
  add column if not exists byte_size bigint,
  add column if not exists ingested_at timestamptz,
  add column if not exists ingestion_status text not null default 'external',
  add column if not exists ingestion_error text;

do $$
begin
  alter table public.venue_media
    add constraint venue_media_storage_provider_check
    check (
      storage_provider is null
      or storage_provider in ('cloudflare_r2')
    );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  alter table public.venue_media
    add constraint venue_media_ingestion_status_check
    check (
      ingestion_status in ('external', 'pending', 'stored', 'failed', 'skipped')
    );
exception
  when duplicate_object then null;
end;
$$;

create unique index if not exists venue_media_storage_key_uidx
on public.venue_media (storage_provider, storage_bucket, storage_key)
where storage_provider is not null
  and storage_bucket is not null
  and storage_key is not null;

create index if not exists venue_media_ingestion_status_idx
on public.venue_media (ingestion_status, storage_provider)
where is_active = true;

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
        'venueKind', venue.venue_kind,
        'lodgingType', venue.lodging_type,
        'foodServiceType', venue.food_service_type,
        'nightlifeType', venue.nightlife_type,
        'attributeTags', to_jsonb(venue.attribute_tags),
        'tags', to_jsonb(venue.attribute_tags),
        'photo', coalesce(primary_media.public_url, primary_media.url),
        'price', stop.price_label,
        'priceSource', stop.price_source,
        'bookingUrl', stop.booking_url,
        'officialUrl', stop.official_url,
        'eventTime', stop.event_time_label,
        'eventVenue', stop.event_venue_label,
        'places', stop.places,
        'routeCoordinates', stop.metadata -> 'routeCoordinates',
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
