-- User guide writes must pass through the authenticated application endpoint.
-- That endpoint uses service-role-only transaction functions and validates
-- ownership, publishing permission, and editorial venue provenance.

revoke insert, update, delete on table public.entries from authenticated;
revoke insert, update, delete on table public.entry_stops from authenticated;

drop policy if exists "Users can insert owned entries" on public.entries;
drop policy if exists "Users can update owned entries" on public.entries;
drop policy if exists "Users can delete owned entries" on public.entries;

drop policy if exists "Users can insert stops for owned entries" on public.entry_stops;
drop policy if exists "Users can update stops for owned entries" on public.entry_stops;
drop policy if exists "Users can delete stops for owned entries" on public.entry_stops;
