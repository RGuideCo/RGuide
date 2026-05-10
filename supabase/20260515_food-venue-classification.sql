-- Add first-class food venue classification and filterable food attributes.

do $migration$
begin
  create type public.food_service_type as enum (
    'restaurant',
    'cafe',
    'fast_food',
    'stall',
    'food_truck',
    'food_cart'
  );
exception
  when duplicate_object then null;
end;
$migration$;

do $migration$
begin
  create type public.price_tier as enum (
    '$',
    '$$',
    '$$$',
    '$$$$'
  );
exception
  when duplicate_object then null;
end;
$migration$;

alter table public.venues
  add column if not exists food_service_type public.food_service_type,
  add column if not exists cuisine_types text[] not null default '{}',
  add column if not exists price_tier public.price_tier;

do $migration$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'venues_food_service_type_requires_food_kind'
      and conrelid = 'public.venues'::regclass
  ) then
    alter table public.venues
      add constraint venues_food_service_type_requires_food_kind
      check (food_service_type is null or venue_kind = 'food_drink');
  end if;
end;
$migration$;

insert into public.venue_tags (slug, label, tag_group, applies_to, description)
values
  ('casual', 'Casual', 'vibe', 'food_drink', 'Easygoing, low-pressure food stop.'),
  ('date_night', 'Date Night', 'audience', 'food_drink', 'Good for a date or more polished night out.'),
  ('group_friendly', 'Group-Friendly', 'audience', 'food_drink', 'Good for groups or shared ordering.'),
  ('solo_friendly', 'Solo-Friendly', 'audience', 'food_drink', 'Comfortable for solo diners.'),
  ('family_friendly_food', 'Family-Friendly', 'audience', 'food_drink', 'Useful for families or children.'),
  ('local_favorite', 'Local Favorite', 'style', 'food_drink', 'Strong local reputation or neighborhood regulars.'),
  ('destination_dining', 'Destination Dining', 'style', 'food_drink', 'Worth planning around as a destination meal.'),
  ('fine_dining', 'Fine Dining', 'style', 'food_drink', 'Formal, chef-led, tasting-menu, or Michelin-level dining.'),
  ('tasting_menu', 'Tasting Menu', 'style', 'food_drink', 'Offers or is known for tasting-menu dining.'),
  ('street_food', 'Street Food', 'style', 'food_drink', 'Street-food format, stall, cart, or market counter.'),
  ('market', 'Market', 'setting', 'food_drink', 'Inside or tied to a market or food hall.'),
  ('late_night', 'Late Night', 'vibe', 'food_drink', 'Useful for late meals or after-hours eating.'),
  ('breakfast', 'Breakfast', 'style', 'food_drink', 'Strong breakfast or morning use case.'),
  ('brunch', 'Brunch', 'style', 'food_drink', 'Strong brunch use case.'),
  ('coffee', 'Coffee', 'style', 'food_drink', 'Coffee-focused cafe or coffee stop.'),
  ('bakery', 'Bakery', 'style', 'food_drink', 'Bakery, pastry, bread, or dessert-forward stop.'),
  ('seafood', 'Seafood', 'style', 'food_drink', 'Seafood-forward stop.'),
  ('vegetarian_friendly', 'Vegetarian-Friendly', 'style', 'food_drink', 'Good vegetarian options.'),
  ('vegan_friendly', 'Vegan-Friendly', 'style', 'food_drink', 'Good vegan options.'),
  ('gluten_free_friendly', 'Gluten-Free-Friendly', 'style', 'food_drink', 'Useful gluten-free options.'),
  ('reservation_recommended', 'Reservation Recommended', 'booking', 'food_drink', 'Best with advance booking.'),
  ('walk_in_friendly', 'Walk-In-Friendly', 'booking', 'food_drink', 'Reasonable walk-in odds or counter format.'),
  ('scenic_food', 'Scenic', 'setting', 'food_drink', 'View, waterfront, rooftop, or notably scenic setting.'),
  ('romantic_food', 'Romantic', 'vibe', 'food_drink', 'Romantic food or room context.'),
  ('lively_food', 'Lively', 'vibe', 'food_drink', 'Energetic room or social dining atmosphere.'),
  ('quiet_food', 'Quiet', 'vibe', 'food_drink', 'Quieter meal setting.'),
  ('budget_food', 'Budget', 'budget', 'food_drink', 'Budget-conscious food stop.'),
  ('splurge_food', 'Splurge', 'budget', 'food_drink', 'Premium or expensive food stop.')
on conflict (slug) do update set
  label = excluded.label,
  tag_group = excluded.tag_group,
  applies_to = excluded.applies_to,
  description = excluded.description,
  is_filterable = true,
  is_active = true;

create index if not exists venues_city_food_service_type_idx
on public.venues (city_id, food_service_type)
where venue_kind = 'food_drink';

create index if not exists venues_cuisine_types_gin_idx
on public.venues using gin (cuisine_types);

create index if not exists venues_city_price_tier_idx
on public.venues (city_id, price_tier)
where venue_kind = 'food_drink';

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
where venue.venue_kind = 'food_drink';
