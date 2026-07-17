begin;

do $$
begin
  if (
    select count(*)
    from public.destinations
    where legacy_id in (
      'city:ireland:ireland-dublin',
      'city:japan:kyoto',
      'city:japan:osaka'
    )
  ) <> 3 then
    raise exception 'Expected all three populated city destinations to exist';
  end if;
end
$$;

with replacements (
  destination_legacy_id,
  venue_id,
  venue_name,
  media_id,
  source_metadata
) as (
  values
    (
      'city:ireland:ireland-dublin',
      'd0b28d70-d011-4270-853a-1c8a2c3d0cce'::uuid,
      'Dublinia',
      '9136c3f2-9379-4757-8a1e-8f0a6e851723'::uuid,
      jsonb_build_object(
        'provider', 'wikimedia_commons',
        'file_title', 'File:Dublinia in Dublin, Ireland.jpg',
        'credit', 'Mari Avetisyan',
        'license', 'CC BY-SA 4.0',
        'license_url', 'https://creativecommons.org/licenses/by-sa/4.0',
        'width', 4000,
        'height', 3000,
        'mime', 'image/jpeg',
        'canonical_url', 'https://commons.wikimedia.org/wiki/File:Dublinia_in_Dublin,_Ireland.jpg'
      )
    ),
    (
      'city:japan:kyoto',
      '0de2bf65-7d3e-4303-bbd0-b1b44ea87364'::uuid,
      'Fushimi Inari Taisha',
      'ca3d253a-8b07-48c5-9def-4aed72e93178'::uuid,
      null::jsonb
    ),
    (
      'city:japan:osaka',
      'f077244c-cd3b-4047-8a6d-65d84cfd3bfb'::uuid,
      'Osaka Castle Museum',
      'db02ec7e-3231-42e3-9895-f290ca5b7900'::uuid,
      null::jsonb
    )
),
resolved as (
  select
    replacement.destination_legacy_id,
    replacement.venue_id,
    replacement.venue_name,
    media.id as media_id,
    media.public_url,
    media.storage_provider,
    media.storage_bucket,
    media.storage_key,
    media.content_type,
    media.byte_size,
    media.source_url,
    media.ingested_at,
    coalesce(media.raw_metadata->'source_resolver', replacement.source_metadata) as source_metadata
  from replacements replacement
  join public.venue_media media
    on media.id = replacement.media_id
   and media.venue_id = replacement.venue_id
   and media.is_active is true
   and media.storage_provider = 'cloudflare_r2'
   and media.public_url like 'https://media.rguide.co/%'
)
update public.destinations destination
set
  image_url = resolved.public_url,
  metadata = coalesce(destination.metadata, '{}'::jsonb) || jsonb_build_object(
    'destination_image',
    jsonb_build_object(
      'storage_provider', resolved.storage_provider,
      'storage_bucket', resolved.storage_bucket,
      'storage_key', resolved.storage_key,
      'public_url', resolved.public_url,
      'content_type', resolved.content_type,
      'byte_size', resolved.byte_size,
      'source_url', resolved.source_url,
      'ingested_at', resolved.ingested_at,
      'source', resolved.source_metadata,
      'reused_from_venue_id', resolved.venue_id,
      'reused_from_venue_media_id', resolved.media_id,
      'reused_from_venue_name', resolved.venue_name
    ),
    'destination_image_ingestion',
    jsonb_build_object(
      'status', 'stored',
      'mode', 'existing_venue_media',
      'stored_at', now()
    )
  ),
  updated_at = now()
from resolved
where destination.legacy_id = resolved.destination_legacy_id;

do $$
begin
  if exists (
    select 1
    from public.destinations
    where legacy_id in (
      'city:ireland:ireland-dublin',
      'city:japan:kyoto',
      'city:japan:osaka'
    )
      and (
        image_url not like 'https://media.rguide.co/venues/%'
        or metadata #>> '{destination_image,source,provider}' <> 'wikimedia_commons'
        or metadata #>> '{destination_image,storage_provider}' <> 'cloudflare_r2'
      )
  ) then
    raise exception 'Populated city cultural image replacement verification failed';
  end if;
end
$$;

commit;
