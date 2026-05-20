-- Allow multiple venue_media rows to reuse the same R2 object.
--
-- URL-level dedupe means two canonical media rows can legitimately point at
-- the same storage key when their original source image is identical. Keep a
-- lookup index for storage metadata, but remove the uniqueness requirement.

drop index if exists public.venue_media_storage_key_uidx;

create index if not exists venue_media_storage_key_idx
on public.venue_media (storage_provider, storage_bucket, storage_key)
where storage_provider is not null
  and storage_bucket is not null
  and storage_key is not null;
