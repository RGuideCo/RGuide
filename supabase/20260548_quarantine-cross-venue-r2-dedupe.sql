-- Quarantine broad cross-venue R2 dedupe mistakes from the first venue media
-- ingestion pass. The owner row for each shared storage key stays active; all
-- other rows in clusters shared by 3+ venues are marked inactive so the app
-- does not render one venue's placeholder image across unrelated venues.

create temporary table tmp_quarantined_venue_media on commit drop as
with shared as (
  select storage_key, count(distinct venue_id)::int venues
  from public.venue_media
  where is_active = true
    and storage_provider = 'cloudflare_r2'
    and storage_key is not null
  group by storage_key
  having count(distinct venue_id) >= 3
),
ranked as (
  select
    media.id,
    media.storage_key,
    media.venue_id,
    venue.slug as venue_slug,
    case when media.storage_key ilike '%' || venue.slug || '/%' then 0 else 1 end as owner_rank,
    media.created_at
  from public.venue_media media
  join public.venues venue on venue.id = media.venue_id
  join shared on shared.storage_key = media.storage_key
  where media.is_active = true
),
owners as (
  select distinct on (storage_key)
    storage_key,
    id as owner_media_id
  from ranked
  order by storage_key, owner_rank, created_at nulls last, id
)
select ranked.id as media_id, ranked.venue_id, ranked.storage_key, owners.owner_media_id
from ranked
join owners on owners.storage_key = ranked.storage_key
where ranked.id <> owners.owner_media_id;

update public.venue_media media
set is_active = false,
    ingestion_status = 'failed',
    ingestion_error = 'quarantined: cross-venue R2 dedupe reused this image for an unrelated venue',
    validation_status = 'invalid',
    validation_error = 'quarantined cross-venue dedupe',
    raw_metadata = media.raw_metadata || jsonb_build_object(
      'quarantined_at', now(),
      'quarantine_reason', 'cross_venue_r2_dedupe',
      'quarantine_storage_key', media.storage_key,
      'quarantine_owner_media_id', (
        select owner_media_id::text
        from tmp_quarantined_venue_media q
        where q.media_id = media.id
      )
    ),
    updated_at = now()
from tmp_quarantined_venue_media q
where media.id = q.media_id;

with affected_venues as (
  select distinct venue_id from tmp_quarantined_venue_media
),
replacements as (
  select distinct on (media.venue_id)
    media.venue_id,
    media.id as media_id
  from public.venue_media media
  join affected_venues affected on affected.venue_id = media.venue_id
  where media.is_active = true
    and media.media_type = 'image'
    and media.validation_status <> 'invalid'
  order by media.venue_id, (media.role = 'primary') desc, media.sort_order, media.updated_at desc
)
update public.venues venue
set primary_photo_id = replacements.media_id,
    updated_at = now()
from replacements
where venue.id = replacements.venue_id
  and venue.primary_photo_id in (select media_id from tmp_quarantined_venue_media);

update public.venues venue
set primary_photo_id = null,
    updated_at = now()
where venue.primary_photo_id in (select media_id from tmp_quarantined_venue_media)
  and not exists (
    select 1
    from public.venue_media media
    where media.venue_id = venue.id
      and media.is_active = true
      and media.media_type = 'image'
      and media.validation_status <> 'invalid'
  );

insert into public.entry_render_cache (
  entry_id, render_format, render_version, rendered_payload, source_hash,
  rendered_at, stale_at, is_current, metadata
)
select distinct
  entry.id,
  'maplist',
  1,
  view.list,
  encode(digest(view.list::text, 'sha256'), 'hex'),
  now(),
  null::timestamptz,
  true,
  jsonb_build_object('refreshed_from', 'quarantine-cross-venue-r2-dedupe')
from public.entries entry
join public.entries_maplist view on view.id = entry.id
join public.entry_stops stop on stop.entry_id = entry.id
join tmp_quarantined_venue_media q on q.venue_id = stop.venue_id
where entry.status = 'published'::public.rguide_entry_status
on conflict (entry_id, render_format, render_version) do update set
  rendered_payload = excluded.rendered_payload,
  source_hash = excluded.source_hash,
  rendered_at = excluded.rendered_at,
  stale_at = null,
  is_current = true,
  metadata = public.entry_render_cache.metadata || excluded.metadata;
