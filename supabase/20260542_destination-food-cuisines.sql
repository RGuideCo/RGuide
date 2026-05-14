-- Attach ranked food cuisine filters to destinations.
--
-- Venue-level cuisine lives on `venues.cuisine_types`; this table answers the
-- city-level product question: which cuisines should appear first when a
-- traveler opens Food in a specific destination.

create table if not exists public.destination_food_cuisines (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid not null references public.destinations(id) on delete cascade,
  cuisine_slug text not null,
  label text not null,
  sort_order integer not null default 100 check (sort_order >= 0),
  popularity_score numeric(6,3) check (
    popularity_score is null
    or (popularity_score >= 0 and popularity_score <= 100)
  ),
  is_featured boolean not null default true,
  is_active boolean not null default true,
  source_type text not null default 'editorial',
  source_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint destination_food_cuisines_slug_not_blank check (btrim(cuisine_slug) <> ''),
  constraint destination_food_cuisines_label_not_blank check (btrim(label) <> ''),
  unique (destination_id, cuisine_slug)
);

drop trigger if exists destination_food_cuisines_set_updated_at on public.destination_food_cuisines;
create trigger destination_food_cuisines_set_updated_at
before update on public.destination_food_cuisines
for each row
execute function public.set_updated_at();

create index if not exists destination_food_cuisines_destination_idx
on public.destination_food_cuisines (destination_id, is_active, sort_order);

create index if not exists destination_food_cuisines_slug_idx
on public.destination_food_cuisines (cuisine_slug)
where is_active = true;

alter table public.destination_food_cuisines enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'destination_food_cuisines'
      and policyname = 'Active destination food cuisines are readable'
  ) then
    create policy "Active destination food cuisines are readable"
    on public.destination_food_cuisines
    for select
    using (
      is_active = true
      and exists (
        select 1
        from public.destinations destination
        where destination.id = destination_food_cuisines.destination_id
          and destination.is_published = true
      )
    );
  end if;
end;
$$;

create or replace view public.active_destination_food_cuisines
with (security_invoker = true) as
select
  cuisine.id,
  cuisine.destination_id,
  destination.legacy_id as destination_legacy_id,
  destination.slug as destination_slug,
  destination.name as destination_name,
  destination.scope as destination_scope,
  destination.country_name,
  destination.city_name,
  cuisine.cuisine_slug,
  cuisine.label,
  cuisine.sort_order,
  cuisine.popularity_score,
  cuisine.is_featured,
  cuisine.source_type,
  cuisine.source_metadata,
  cuisine.updated_at
from public.destination_food_cuisines cuisine
join public.destinations destination on destination.id = cuisine.destination_id
where cuisine.is_active = true
  and destination.is_published = true;

with seed_rows(city_name, country_name, cuisines) as (
  values
    ('Barcelona', 'Spain', array['Tapas', 'Catalan', 'Seafood', 'Paella']::text[]),
    ('Madrid', 'Spain', array['Tapas', 'Spanish', 'Steakhouse', 'Seafood']::text[]),
    ('Miami', 'United States', array['Cuban', 'Latin', 'Seafood', 'Steakhouse']::text[]),
    ('Tokyo', 'Japan', array['Sushi', 'Ramen', 'Izakaya', 'Japanese']::text[]),
    ('Bangkok', 'Thailand', array['Thai', 'Street Food', 'Seafood', 'Noodles']::text[]),
    ('Rome', 'Italy', array['Pasta', 'Italian', 'Pizza', 'Gelato']::text[])
),
expanded as (
  select
    destination.id as destination_id,
    lower(regexp_replace(cuisine.label, '[^a-zA-Z0-9]+', '_', 'g')) as cuisine_slug,
    cuisine.label,
    cuisine.sort_order,
    greatest(100 - ((cuisine.sort_order - 1) * 10), 0)::numeric(6,3) as popularity_score
  from seed_rows seed
  join public.destinations destination
    on destination.scope = 'city'::public.destination_scope
   and lower(destination.name) = lower(seed.city_name)
   and lower(coalesce(destination.country_name, '')) = lower(seed.country_name)
  cross join lateral unnest(seed.cuisines) with ordinality as cuisine(label, sort_order)
)
insert into public.destination_food_cuisines (
  destination_id,
  cuisine_slug,
  label,
  sort_order,
  popularity_score,
  is_featured,
  is_active,
  source_type,
  source_metadata
)
select
  destination_id,
  cuisine_slug,
  label,
  sort_order::integer,
  popularity_score,
  true,
  true,
  'editorial',
  jsonb_build_object('source', 'split_screen_config_seed')
from expanded
on conflict (destination_id, cuisine_slug) do update set
  label = excluded.label,
  sort_order = excluded.sort_order,
  popularity_score = excluded.popularity_score,
  is_featured = true,
  is_active = true,
  source_type = excluded.source_type,
  source_metadata = public.destination_food_cuisines.source_metadata || excluded.source_metadata,
  updated_at = now();
