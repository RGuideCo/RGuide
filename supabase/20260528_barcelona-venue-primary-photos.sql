-- Populate canonical primary venue photos for selected Barcelona POIs.
-- Uses the venue_media / venues.primary_photo_id model introduced by
-- 20260525_venue-media-primary-photos.sql.

with requested_photos as (
  select *
  from (
    values
      (
        'Cines Verdi',
        'poi-spain-barcelona-cines-verdi',
        'https://barcelona.cines-verdi.com/storage/app/uploads/public/693/1a8/9a3/6931a89a3e8c9691628751.jpg',
        'https://barcelona.cines-verdi.com/storage/app/uploads/public/693/1a8/9a3/6931a89a3e8c9691628751.jpg',
        'manual_editorial_photo'
      ),
      (
        'Chic & Basic Born Boutique Hotel',
        'poi-spain-barcelona-chic-and-basic-born-boutique-hotel',
        'https://www.chicandbasic.com/data/webp/big-cbborn-zonacomun-beyourself3-alta364.webp',
        'https://www.chicandbasic.com/en/hotel-born-barcelona/gallery/#&gid=1&pid=1',
        'manual_editorial_photo'
      ),
      (
        'Casa Gracia',
        'poi-spain-barcelona-casa-gracia',
        'https://room00hostel.com/wp-content/uploads/2026/04/053BAR-1024x576.webp',
        'https://room00hostel.com/wp-content/uploads/2026/04/053BAR-1024x576.webp',
        'manual_editorial_photo'
      ),
      (
        'Born Barcelona Hostel',
        'poi-spain-barcelona-born-barcelona-hostel',
        'https://www.bornbarcelonahostel.com/wp-content/uploads/2022/09/1221-640x480.jpg',
        'https://www.bornbarcelonahostel.com/wp-content/uploads/2022/09/1221-640x480.jpg',
        'manual_editorial_photo'
      ),
      (
        'Arc House Barcelona',
        'poi-spain-barcelona-arc-house-barcelona',
        'https://www.archousebarcelona.es/wp-content/uploads/2025/12/salon.jpg',
        'https://www.archousebarcelona.es/wp-content/uploads/2025/12/salon.jpg',
        'manual_editorial_photo'
      ),
      (
        'Black Swan Hostel',
        'poi-spain-barcelona-black-swan-hostel',
        'https://blackswanhostels.com/wp-content/uploads/2024/06/DSC03443-copy-copy-copy-scaled.jpg',
        'https://blackswanhostels.com/wp-content/uploads/2024/06/DSC03443-copy-copy-copy-scaled.jpg',
        'manual_editorial_photo'
      ),
      (
        'Factory Hostels Barcelona',
        'poi-spain-barcelona-factory-hostels-barcelona',
        'https://factorybcn.com/wp-content/uploads/2023/05/habitaciones-para-familias.png',
        'https://factorybcn.com/wp-content/uploads/2023/05/habitaciones-para-familias.png',
        'manual_editorial_photo'
      ),
      (
        'Hostal Bcn Port',
        'poi-spain-barcelona-hostal-bcn-port',
        'https://www.yomobcnport.com/idb/84500/hab-doble-twin-2-1-1200x800.jpg',
        'https://www.yomobcnport.com/idb/84500/hab-doble-twin-2-1-1200x800.jpg',
        'manual_editorial_photo'
      )
  ) as photo(name, slug, url, source_url, source_type)
),
matched_venues as (
  select
    venue.id as venue_id,
    photo.name,
    photo.url,
    photo.source_url,
    photo.source_type
  from requested_photos photo
  join public.venues venue
    on (
      lower(venue.name) = lower(photo.name)
      or venue.slug = photo.slug
    )
   and venue.merged_into_venue_id is null
  join public.destinations city
    on city.id = venue.city_id
   and lower(city.name) = 'barcelona'
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
    source_type,
    'venue',
    name,
    jsonb_build_object(
      'source', '20260528_barcelona-venue-primary-photos',
      'venue_name', name
    ),
    0,
    'unchecked',
    true
  from matched_venues
  on conflict (venue_id, url) do update set
    role = 'primary',
    source_url = coalesce(excluded.source_url, public.venue_media.source_url),
    source_type = coalesce(excluded.source_type, public.venue_media.source_type),
    source_entity_type = coalesce(excluded.source_entity_type, public.venue_media.source_entity_type),
    source_legacy_id = coalesce(excluded.source_legacy_id, public.venue_media.source_legacy_id),
    raw_metadata = public.venue_media.raw_metadata || excluded.raw_metadata,
    sort_order = least(public.venue_media.sort_order, excluded.sort_order),
    validation_status = case
      when public.venue_media.url is distinct from excluded.url then 'unchecked'
      else public.venue_media.validation_status
    end,
    validation_error = case
      when public.venue_media.url is distinct from excluded.url then null
      else public.venue_media.validation_error
    end,
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
    jsonb_build_object('refreshed_from', '20260528_barcelona_venue_primary_photos')
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
