-- Let rendered guide payloads prefer canonical venue hours.
--
-- public.entries_maplist now resolves hours from venue_hours first, then
-- venues.hours_note, then entry_stops.hours as a legacy/import fallback.

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
        'venueId', stop.venue_id,
        'sourceKind', stop.metadata ->> 'sourceKind',
        'sourceListId', stop.metadata ->> 'sourceListId',
        'sourceStopId', stop.metadata ->> 'sourceStopId',
        'sourceVenueId', stop.metadata ->> 'sourceVenueId',
        'externalPlace', stop.metadata -> 'externalPlace',
        'defaultDescription', stop.metadata ->> 'defaultDescription',
        'name', stop.name,
        'coordinates', stop.coordinates,
        'description', stop.description,
        'category', stop.category,
        'venueKind', venue.venue_kind,
        'lodgingType', venue.lodging_type,
        'foodServiceType', venue.food_service_type,
        'cuisineTypes', to_jsonb(venue.cuisine_types),
        'nightlifeType', venue.nightlife_type,
        'musicGenres', to_jsonb(venue.music_genres),
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
        'hours', coalesce(canonical_hours.hours, to_jsonb(nullif(venue.hours_note, '')), stop.hours)
      )
    )
    order by stop.stop_order, stop.created_at
  ) as items
  from public.entry_stops stop
  left join public.venues venue on venue.id = stop.venue_id
  left join public.venue_media primary_media
    on primary_media.id = venue.primary_photo_id
    and primary_media.is_active = true
  left join lateral (
    select jsonb_object_agg(day_hours.day_key, day_hours.raw_text) as hours
    from (
      select
        hour.day_of_week,
        case hour.day_of_week
          when 0 then 'sun'
          when 1 then 'mon'
          when 2 then 'tue'
          when 3 then 'wed'
          when 4 then 'thu'
          when 5 then 'fri'
          when 6 then 'sat'
        end as day_key,
        string_agg(
          case
            when hour.is_closed then 'Closed'
            when hour.is_24_hours then '24 hours'
            else hour.raw_text
          end,
          '; '
          order by hour.interval_order
        ) as raw_text
      from public.venue_hours hour
      where hour.venue_id = venue.id
        and hour.valid_from <= current_date
        and (hour.valid_to is null or hour.valid_to >= current_date)
      group by hour.day_of_week
    ) day_hours
  ) canonical_hours on true
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
where (
    entry.status = 'published'::public.rguide_entry_status
    and (
      entry.submission_type <> 'journal'::public.rguide_submission_type
      or coalesce(entry.journal_visibility, 'public') = 'public'
    )
  )
  or entry.user_id = auth.uid();
