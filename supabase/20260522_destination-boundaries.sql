-- Store real destination boundary polygons separately from lightweight
-- destination records so map geometry can be queried city-by-city.

create extension if not exists postgis;
create extension if not exists pgcrypto;

do $$
begin
  alter type public.rguide_source_entity_type add value if not exists 'destination_boundary';
exception
  when undefined_object then null;
end;
$$;

create table if not exists public.destination_boundaries (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid not null references public.destinations(id) on delete cascade,
  city_id uuid not null references public.destinations(id) on delete cascade,
  boundary_key text not null,
  geometry public.geometry(MultiPolygon, 4326) not null,
  simplified_geometry public.geometry(MultiPolygon, 4326) not null,
  bounds jsonb not null,
  centroid jsonb not null,
  source_name text,
  source_url text,
  source_license text,
  source_metadata jsonb not null default '{}'::jsonb,
  quality_score numeric(4,3) check (quality_score is null or (quality_score >= 0 and quality_score <= 1)),
  simplification_tolerance numeric(12,8) not null default 0.00035,
  is_active boolean not null default true,
  fetched_at timestamptz,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint destination_boundaries_key_not_blank check (length(trim(boundary_key)) > 0),
  constraint destination_boundaries_geometry_valid check (st_isvalid(geometry)),
  constraint destination_boundaries_simplified_geometry_valid check (st_isvalid(simplified_geometry)),
  constraint destination_boundaries_bounds_shape check (
    jsonb_typeof(bounds) = 'array'
    and jsonb_array_length(bounds) = 2
  ),
  constraint destination_boundaries_centroid_shape check (
    jsonb_typeof(centroid) = 'array'
    and jsonb_array_length(centroid) = 2
  ),
  unique (destination_id, boundary_key)
);

drop trigger if exists destination_boundaries_set_updated_at on public.destination_boundaries;
create trigger destination_boundaries_set_updated_at
before update on public.destination_boundaries
for each row
execute function public.set_updated_at();

create index if not exists destination_boundaries_city_active_idx
on public.destination_boundaries (city_id, is_active);

create unique index if not exists destination_boundaries_active_destination_idx
on public.destination_boundaries (destination_id)
where is_active;

create index if not exists destination_boundaries_geometry_gist_idx
on public.destination_boundaries
using gist (geometry);

create index if not exists destination_boundaries_simplified_geometry_gist_idx
on public.destination_boundaries
using gist (simplified_geometry);

create or replace view public.destination_boundaries_geojson
with (security_invoker = true) as
select
  boundary.id,
  boundary.destination_id,
  boundary.city_id,
  city.slug as city_slug,
  destination.slug as destination_slug,
  boundary.boundary_key,
  destination.name,
  boundary.bounds,
  boundary.centroid,
  boundary.source_name,
  boundary.source_url,
  boundary.source_license,
  boundary.source_metadata,
  boundary.quality_score,
  boundary.fetched_at,
  boundary.verified_at,
  boundary.is_active,
  st_asgeojson(boundary.simplified_geometry)::jsonb as simplified_geometry_geojson,
  st_asgeojson(boundary.geometry)::jsonb as geometry_geojson
from public.destination_boundaries boundary
join public.destinations destination on destination.id = boundary.destination_id
join public.destinations city on city.id = boundary.city_id;

alter table public.destination_boundaries enable row level security;

do $migration$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'destination_boundaries'
      and policyname = 'Public can read active destination boundaries'
  ) then
    create policy "Public can read active destination boundaries"
    on public.destination_boundaries
    for select
    using (is_active);
  end if;
end;
$migration$;
