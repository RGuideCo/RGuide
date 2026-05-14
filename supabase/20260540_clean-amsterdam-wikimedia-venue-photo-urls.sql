-- Clean Amsterdam Wikimedia primary venue photo URLs.
-- The image files are valid, but the imported Wikimedia tracking query strings
-- can return 429 HTML instead of an image from some validators/clients.

with old_media as (
  select
    venue.id as venue_id,
    media.id as old_media_id,
    media.url as old_url,
    split_part(media.url, '?', 1) as clean_url,
    media.role,
    media.credit,
    media.source_url,
    media.license,
    media.attribution,
    media.width,
    media.height,
    media.source_type,
    media.source_entity_type,
    media.source_entity_id,
    media.source_legacy_id,
    media.raw_metadata,
    media.sort_order
  from public.venues venue
  join public.destinations city on city.id = venue.city_id
  join public.venue_media media on media.id = venue.primary_photo_id
  where lower(city.name) = 'amsterdam'
    and media.url like 'https://upload.wikimedia.org/%?%'
    and split_part(media.url, '?', 1) <> media.url
),
upserted_media as (
  insert into public.venue_media (
    venue_id,
    url,
    media_type,
    role,
    credit,
    source_url,
    license,
    attribution,
    width,
    height,
    validation_status,
    validation_error,
    last_validated_at,
    is_active,
    sort_order,
    source_type,
    source_entity_type,
    source_entity_id,
    source_legacy_id,
    raw_metadata
  )
  select
    venue_id,
    clean_url,
    'image',
    role,
    credit,
    coalesce(source_url, old_url),
    license,
    attribution,
    width,
    height,
    'unchecked',
    null,
    null,
    true,
    sort_order,
    source_type,
    source_entity_type,
    source_entity_id,
    source_legacy_id,
    raw_metadata || jsonb_build_object(
      'source', '20260540_clean-amsterdam-wikimedia-venue-photo-urls',
      'replaced_url', old_url
    )
  from old_media
  on conflict (venue_id, url) do update set
    role = case
      when public.venue_media.role = 'gallery' then excluded.role
      else public.venue_media.role
    end,
    source_url = coalesce(public.venue_media.source_url, excluded.source_url),
    source_type = coalesce(public.venue_media.source_type, excluded.source_type),
    source_entity_type = coalesce(public.venue_media.source_entity_type, excluded.source_entity_type),
    source_entity_id = coalesce(public.venue_media.source_entity_id, excluded.source_entity_id),
    source_legacy_id = coalesce(public.venue_media.source_legacy_id, excluded.source_legacy_id),
    raw_metadata = public.venue_media.raw_metadata || excluded.raw_metadata,
    validation_status = 'unchecked',
    validation_error = null,
    last_validated_at = null,
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
deactivated_old_media as (
  update public.venue_media media
  set is_active = false,
      updated_at = now()
  from old_media old
  join upserted_media new_media on new_media.venue_id = old.venue_id
  where media.id = old.old_media_id
    and media.id <> new_media.id
  returning media.id
),
affected_entries as (
  select distinct stop.entry_id
  from public.entry_stops stop
  where stop.venue_id in (select venue_id from old_media)
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
    jsonb_build_object('refreshed_from', '20260540_clean_amsterdam_wikimedia_venue_photo_urls')
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
  (select count(*) from old_media) as cleaned_media_count,
  (select count(*) from upserted_media) as upserted_media_count,
  (select count(*) from updated_venues) as updated_venue_count,
  (select count(*) from deactivated_old_media) as deactivated_old_media_count,
  (select count(*) from refreshed_cache) as refreshed_entry_cache_count;
