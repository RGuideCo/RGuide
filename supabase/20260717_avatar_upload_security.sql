-- Keep the public avatar bucket limited to browser-safe image formats and a
-- reasonable profile-image size. Ownership remains enforced by object RLS.

update storage.buckets
set
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']::text[]
where id = 'avatars';
