-- Indexes for user-submitted venue lookup, moderation queues, and merge checks.

create index if not exists venues_created_by_fk_idx
on public.venues (created_by);

create index if not exists venues_merged_into_venue_id_fk_idx
on public.venues (merged_into_venue_id);

create index if not exists venues_neighborhood_id_fk_idx
on public.venues (neighborhood_id);
