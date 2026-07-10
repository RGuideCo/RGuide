begin;

with preferred as (
  select distinct on (activation.event_id)
    activation.event_id,
    media.url,
    media.public_url,
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
    media.last_validated_at,
    media.ingestion_status,
    media.ingested_at
  from public.event_activations activation
  join public.event_media media on media.activation_id = activation.id
  where media.is_active
    and coalesce(media.public_url, media.url) like 'https://media.rguide.co/%'
  order by activation.event_id, activation.sort_order, media.sort_order, media.created_at
)
update public.event_media cover
set
  url = preferred.url,
  public_url = preferred.public_url,
  credit = preferred.credit,
  source_url = preferred.source_url,
  license = preferred.license,
  attribution = preferred.attribution,
  width = preferred.width,
  height = preferred.height,
  content_type = preferred.content_type,
  byte_size = preferred.byte_size,
  storage_provider = preferred.storage_provider,
  storage_bucket = preferred.storage_bucket,
  storage_key = preferred.storage_key,
  validation_status = preferred.validation_status,
  validation_error = null,
  last_validated_at = preferred.last_validated_at,
  ingestion_status = preferred.ingestion_status,
  ingestion_error = null,
  ingested_at = preferred.ingested_at,
  raw_metadata = cover.raw_metadata || jsonb_build_object('cover_backfilled_from', 'first_activation_media'),
  updated_at = now()
from preferred
where cover.event_id = preferred.event_id
  and cover.activation_id is null
  and cover.occurrence_id is null
  and cover.role = 'primary'
  and cover.is_active
  and coalesce(cover.public_url, cover.url) not like 'https://media.rguide.co/%';

update public.events event
set photo_url = media.public_url,
    updated_at = now()
from public.event_media media
where media.event_id = event.id
  and media.activation_id is null
  and media.occurrence_id is null
  and media.role = 'primary'
  and media.is_active
  and media.public_url like 'https://media.rguide.co/%'
  and event.photo_url is distinct from media.public_url;

comment on column public.events.photo_url is
  'Compatibility cover cache. Canonical event and activation artwork lives in event_media.';

commit;
