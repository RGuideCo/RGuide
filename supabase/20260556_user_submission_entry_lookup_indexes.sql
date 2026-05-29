-- Cover foreign-key lookups used by normalized guide reads and user guide saves.

create index if not exists entries_neighborhood_id_fk_idx
on public.entries (neighborhood_id);

create index if not exists entry_stops_destination_id_fk_idx
on public.entry_stops (destination_id);
