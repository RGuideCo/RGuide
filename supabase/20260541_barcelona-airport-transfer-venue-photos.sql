-- Populate canonical venue photos for the Barcelona airport transfer guide.

with requested_photos as (
  select *
  from (
    values
      (
        'poi-spain-barcelona-aerobus-a1-a2-airport-bus',
        'Aerobus A1/A2 Airport Bus',
        'https://aerobusbarcelona.es/wp-content/uploads/2024/09/9-Terminal-1-1024x682.jpg',
        'https://aerobusbarcelona.es/the-aerobus-route-in-photos/?lang=en'
      ),
      (
        'poi-spain-barcelona-r2-nord-airport-train',
        'R2 Nord Airport Train',
        'https://www.barcelona-airport.com/images/train-barcelona-airport.webp',
        'https://www.barcelona-airport.com/eng/barcelona-airport-train.php'
      ),
      (
        'poi-spain-barcelona-taxi-and-uber-pickup-points',
        'Taxi and Uber Pickup Points',
        'https://www.barcelonaairportbcn.com/wp-content/uploads/2025/01/barcelona-airport-taxis.jpg',
        'https://www.barcelonaairportbcn.com/taxi/'
      )
  ) as photo(venue_slug, venue_name, url, source_url)
),
matched_venues as (
  select
    venue.id as venue_id,
    photo.venue_slug,
    photo.venue_name,
    photo.url,
    photo.source_url
  from requested_photos photo
  join public.venues venue on venue.slug = photo.venue_slug
  join public.destinations city on city.id = venue.city_id
  where lower(city.name) = 'barcelona'
    and venue.merged_into_venue_id is null
),
upserted_media as (
  insert into public.venue_media (
    venue_id,
    url,
    media_type,
    role,
    source_url,
    source_type,
    source_entity_type,
    source_legacy_id,
    raw_metadata,
    sort_order,
    validation_status,
    is_active
  )
  select
    venue_id,
    url,
    'image',
    'primary',
    source_url,
    'manual_editorial_photo',
    'venue',
    venue_slug,
    jsonb_build_object(
      'source', '20260541_barcelona-airport-transfer-venue-photos',
      'venue_name', venue_name
    ),
    0,
    'valid',
    true
  from matched_venues
  on conflict (venue_id, url) do update set
    role = 'primary',
    source_url = coalesce(excluded.source_url, public.venue_media.source_url),
    source_type = coalesce(excluded.source_type, public.venue_media.source_type),
    source_entity_type = coalesce(excluded.source_entity_type, public.venue_media.source_entity_type),
    source_legacy_id = coalesce(excluded.source_legacy_id, public.venue_media.source_legacy_id),
    raw_metadata = public.venue_media.raw_metadata || excluded.raw_metadata,
    validation_status = 'valid',
    validation_error = null,
    last_validated_at = now(),
    is_active = true,
    updated_at = now()
  returning id, venue_id
),
updated_venues as (
  update public.venues venue
  set primary_photo_id = media.id,
      updated_at = now()
  from upserted_media media
  where venue.id = media.venue_id
    and venue.primary_photo_id is distinct from media.id
  returning venue.id
),
affected_entries as (
  select distinct stop.entry_id
  from public.entry_stops stop
  where stop.venue_id in (select venue_id from upserted_media)
),
refreshed_cache as (
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
    jsonb_build_object('refreshed_from', '20260541_barcelona_airport_transfer_venue_photos')
  from public.entries entry
  join affected_entries affected on affected.entry_id = entry.id
  join public.entries_maplist view on view.id = entry.id
  where entry.status = 'published'::public.rguide_entry_status
  on conflict (entry_id, render_format, render_version) do update set
    rendered_payload = excluded.rendered_payload,
    source_hash = excluded.source_hash,
    rendered_at = excluded.rendered_at,
    stale_at = null,
    is_current = true,
    metadata = public.entry_render_cache.metadata || excluded.metadata
  returning entry_id
)
select
  (select count(*) from requested_photos) as requested_photo_count,
  (select count(*) from matched_venues) as matched_venue_count,
  (select count(*) from upserted_media) as upserted_media_count,
  (select count(*) from updated_venues) as updated_venue_count,
  (select count(*) from refreshed_cache) as refreshed_entry_cache_count;
