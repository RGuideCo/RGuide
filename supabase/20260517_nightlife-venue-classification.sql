-- Add first-class nightlife venue classification and filterable nightlife attributes.

do $migration$
begin
  create type public.nightlife_type as enum (
    'dive_bar',
    'cocktail_bar',
    'pub',
    'sports_bar',
    'gaming_bar',
    'wine_bar',
    'beer_bar',
    'rooftop_bar',
    'lounge',
    'club',
    'live_music_venue',
    'theatre',
    'concert_hall',
    'comedy_club',
    'karaoke_bar',
    'casino',
    'brewery',
    'other'
  );
exception
  when duplicate_object then null;
end;
$migration$;

alter table public.venues
  add column if not exists venue_kinds public.venue_kind[] not null default '{}',
  add column if not exists nightlife_type public.nightlife_type,
  add column if not exists music_genres text[] not null default '{}';

update public.venues
set venue_kinds = array[venue_kind]
where cardinality(venue_kinds) = 0;

do $migration$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'venues_lodging_type_requires_lodging_kind'
      and conrelid = 'public.venues'::regclass
  ) then
    alter table public.venues drop constraint venues_lodging_type_requires_lodging_kind;
  end if;

  alter table public.venues
    add constraint venues_lodging_type_requires_lodging_kind
    check (lodging_type is null or venue_kind = 'lodging' or 'lodging' = any(venue_kinds));

  if exists (
    select 1
    from pg_constraint
    where conname = 'venues_food_service_type_requires_food_kind'
      and conrelid = 'public.venues'::regclass
  ) then
    alter table public.venues drop constraint venues_food_service_type_requires_food_kind;
  end if;

  alter table public.venues
    add constraint venues_food_service_type_requires_food_kind
    check (food_service_type is null or venue_kind = 'food_drink' or 'food_drink' = any(venue_kinds));

  if exists (
    select 1
    from pg_constraint
    where conname = 'venues_nightlife_type_requires_nightlife_kind'
      and conrelid = 'public.venues'::regclass
  ) then
    alter table public.venues drop constraint venues_nightlife_type_requires_nightlife_kind;
  end if;

  alter table public.venues
    add constraint venues_nightlife_type_requires_nightlife_kind
    check (nightlife_type is null or venue_kind = 'nightlife' or 'nightlife' = any(venue_kinds));
end;
$migration$;

insert into public.venue_tags (slug, label, tag_group, applies_to, description)
values
  ('cheap_drinks', 'Cheap Drinks', 'budget', 'nightlife', 'Budget-friendly drinks or value-oriented night out.'),
  ('premium_drinks', 'Premium Drinks', 'budget', 'nightlife', 'Premium cocktail, wine, champagne, or high-end bar context.'),
  ('dance_floor', 'Dance Floor', 'style', 'nightlife', 'Dancing is central or commonly expected.'),
  ('late_late', 'Late-Late', 'vibe', 'nightlife', 'Works especially late into the night.'),
  ('low_key_nightlife', 'Low-Key', 'vibe', 'nightlife', 'Relaxed, quieter, or conversation-friendly night out.'),
  ('lively_nightlife', 'Lively', 'vibe', 'nightlife', 'Energetic, busy, or social nightlife atmosphere.'),
  ('party_nightlife', 'Party', 'vibe', 'nightlife', 'Party-forward venue or scene.'),
  ('romantic_nightlife', 'Romantic', 'vibe', 'nightlife', 'Good for dates or polished evenings.'),
  ('scenic_nightlife', 'Scenic', 'setting', 'nightlife', 'Rooftop, waterfront, skyline, terrace, or view-led setting.'),
  ('local_bar', 'Local Bar', 'style', 'nightlife', 'Neighborhood regulars, local crowd, or non-touristy bar feel.'),
  ('speakeasy', 'Speakeasy', 'style', 'nightlife', 'Hidden, reservation-led, or speakeasy-style cocktail room.'),
  ('craft_cocktails', 'Craft Cocktails', 'style', 'nightlife', 'Cocktail program is a primary reason to go.'),
  ('craft_beer', 'Craft Beer', 'style', 'nightlife', 'Beer program, brewery, or craft beer focus.'),
  ('natural_wine', 'Natural Wine', 'style', 'nightlife', 'Natural wine or wine-bar focus.'),
  ('live_music', 'Live Music', 'style', 'nightlife', 'Live music is a primary draw.'),
  ('dj_sets', 'DJ Sets', 'style', 'nightlife', 'DJ programming or club sets are a primary draw.'),
  ('comedy', 'Comedy', 'style', 'nightlife', 'Comedy club or regular comedy programming.'),
  ('theatre_show', 'Theatre Show', 'style', 'nightlife', 'Theatre, stage, performance, or show venue.'),
  ('karaoke', 'Karaoke', 'style', 'nightlife', 'Karaoke-focused or karaoke-friendly venue.'),
  ('games', 'Games', 'style', 'nightlife', 'Arcade, pool, darts, board games, gaming, or bar games.'),
  ('sports_screening', 'Sports Screening', 'style', 'nightlife', 'Screens sports or is built around watching games.'),
  ('queer_friendly', 'Queer-Friendly', 'audience', 'nightlife', 'Explicitly LGBTQ+/queer-friendly or known queer nightlife venue.'),
  ('tourist_friendly', 'Tourist-Friendly', 'audience', 'nightlife', 'Easy for visitors or mixed traveler crowd.'),
  ('dressy', 'Dressy', 'style', 'nightlife', 'Dressier, polished, or upscale night out.'),
  ('casual_nightlife', 'Casual', 'style', 'nightlife', 'Casual, no-fuss bar or entertainment stop.'),
  ('reservation_recommended_nightlife', 'Reservation Recommended', 'booking', 'nightlife', 'Best with advance booking, guestlist, or tickets.'),
  ('walk_in_friendly_nightlife', 'Walk-In-Friendly', 'booking', 'nightlife', 'Reasonable for walk-ins or casual drop-ins.')
on conflict (slug) do update set
  label = excluded.label,
  tag_group = excluded.tag_group,
  applies_to = excluded.applies_to,
  description = excluded.description,
  is_filterable = true,
  is_active = true;

create index if not exists venues_city_nightlife_type_idx
on public.venues (city_id, nightlife_type)
where venue_kind = 'nightlife';

create index if not exists venues_music_genres_gin_idx
on public.venues using gin (music_genres);

create index if not exists venues_kinds_gin_idx
on public.venues using gin (venue_kinds);

create or replace view public.nightlife_venues
with (security_invoker = true) as
select
  venue.id,
  venue.name,
  venue.slug,
  venue.city_id,
  city.name as city_name,
  venue.neighborhood_id,
  neighborhood.name as neighborhood_name,
  venue.nightlife_type,
  venue.music_genres,
  venue.price_tier,
  venue.attribute_tags,
  venue.coordinates,
  venue.official_url,
  venue.source_metadata,
  venue.created_at,
  venue.updated_at
from public.venues venue
left join public.destinations city on city.id = venue.city_id
left join public.destinations neighborhood on neighborhood.id = venue.neighborhood_id
where venue.venue_kind = 'nightlife'
  or 'nightlife' = any(venue.venue_kinds);

create or replace view public.food_venues
with (security_invoker = true) as
select
  venue.id,
  venue.name,
  venue.slug,
  venue.city_id,
  city.name as city_name,
  venue.neighborhood_id,
  neighborhood.name as neighborhood_name,
  venue.food_service_type,
  venue.cuisine_types,
  venue.price_tier,
  venue.attribute_tags,
  venue.coordinates,
  venue.official_url,
  venue.source_metadata,
  venue.created_at,
  venue.updated_at
from public.venues venue
left join public.destinations city on city.id = venue.city_id
left join public.destinations neighborhood on neighborhood.id = venue.neighborhood_id
where venue.venue_kind = 'food_drink'
  or 'food_drink' = any(venue.venue_kinds);

create or replace view public.stay_venues
with (security_invoker = true) as
select
  venue.id,
  venue.name,
  venue.slug,
  venue.city_id,
  city.name as city_name,
  venue.neighborhood_id,
  neighborhood.name as neighborhood_name,
  venue.lodging_type,
  venue.attribute_tags,
  venue.coordinates,
  venue.official_url,
  venue.source_metadata,
  venue.created_at,
  venue.updated_at
from public.venues venue
left join public.destinations city on city.id = venue.city_id
left join public.destinations neighborhood on neighborhood.id = venue.neighborhood_id
where venue.venue_kind = 'lodging'
  or 'lodging' = any(venue.venue_kinds);
