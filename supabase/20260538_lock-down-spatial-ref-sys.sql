-- Lock down PostGIS spatial reference metadata exposed in the public schema.
--
-- `spatial_ref_sys` is installed by PostGIS and contains public coordinate
-- system definitions. It can be readable, but app roles should never be able
-- to insert, update, delete, truncate, or trigger against it.

do $$
begin
  if to_regclass('public.spatial_ref_sys') is not null then
    revoke all on table public.spatial_ref_sys from anon;
    revoke all on table public.spatial_ref_sys from authenticated;

    grant select on table public.spatial_ref_sys to anon;
    grant select on table public.spatial_ref_sys to authenticated;

    alter table public.spatial_ref_sys enable row level security;

    if not exists (
      select 1
      from pg_policies
      where schemaname = 'public'
        and tablename = 'spatial_ref_sys'
        and policyname = 'Spatial reference metadata is readable'
    ) then
      create policy "Spatial reference metadata is readable"
      on public.spatial_ref_sys
      for select
      using (true);
    end if;
  end if;
end;
$$;
