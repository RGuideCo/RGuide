-- Add Ueno as a published Tokyo neighborhood destination and seed its
-- researched category strengths for the left-pane category stars.

with city as (
  select id
  from public.destinations
  where legacy_id = 'city:japan:tokyo'
  limit 1
)
insert into public.destinations (
  legacy_id,
  slug,
  scope,
  parent_id,
  name,
  display_name,
  continent_name,
  country_name,
  city_name,
  neighborhood_name,
  coordinates,
  bounds,
  description,
  list_count,
  subarea_count,
  subareas,
  metadata,
  is_published
)
select
  'neighborhood:japan:tokyo:tokyo:ueno',
  'ueno',
  'neighborhood',
  city.id,
  'Ueno',
  'Ueno',
  'Asia',
  'Japan',
  'Tokyo',
  'Ueno',
  '[35.7138,139.777]'::jsonb,
  '[[35.7026198,139.7697841],[35.7206031,139.7815102]]'::jsonb,
  'Ueno is Tokyo''s north-side museum, park, market, and rail hub, where Ueno Park, Ameyoko, Okachimachi, and old-school dining make a compact visitor base. It works especially well for culture-heavy days, value stays, casual food, and easy east-side routing.',
  0,
  0,
  '[]'::jsonb,
  jsonb_build_object(
    'source', 'tokyo_ueno_destination_seed',
    'entityId', 'ueno',
    'boundarySource', 'OpenStreetMap relation 18158684 via Nominatim'
  ),
  true
from city
on conflict (legacy_id) do update set
  slug = excluded.slug,
  scope = excluded.scope,
  parent_id = excluded.parent_id,
  name = excluded.name,
  display_name = excluded.display_name,
  continent_name = excluded.continent_name,
  country_name = excluded.country_name,
  city_name = excluded.city_name,
  neighborhood_name = excluded.neighborhood_name,
  coordinates = excluded.coordinates,
  bounds = excluded.bounds,
  description = excluded.description,
  metadata = public.destinations.metadata || excluded.metadata,
  is_published = excluded.is_published,
  updated_at = now();

with strength_seed(category, score, rationale, source_urls) as (
  values
    (
      'Food',
      7.80,
      'Strong old-north food usefulness across Ameyoko market eating, ramen, tonkatsu, unagi, soba, yoshoku, sweets, and station-adjacent casual meals; not Tokyo''s deepest fine-dining district.',
      array[
        'https://www.gotokyo.org/en/destinations/northern-tokyo/ueno/index.html',
        'https://tabelog.com/en/tokyo/A1311/A131101/'
      ]::text[]
    ),
    (
      'Nightlife',
      7.00,
      'Useful casual nightlife for Ameyoko standing bars, izakayas, sake pubs, beer stops, and Yushima-adjacent counters, with less late-night club depth than Shinjuku or Shibuya.',
      array[
        'https://www.gotokyo.org/en/destinations/northern-tokyo/ueno/index.html',
        'https://tabelog.com/en/tokyo/A1311/A131101/'
      ]::text[]
    ),
    (
      'Stay',
      7.30,
      'Strong east-side logistics for Ueno Station, park museums, family apartment hotels, and relative value; hostel depth is thinner than Asakusa.',
      array[
        'https://www.gotokyo.org/en/destinations/northern-tokyo/ueno/index.html',
        'https://www.google.com/travel/hotels/Tokyo?q=Ueno%20Tokyo%20hotels'
      ]::text[]
    ),
    (
      'Culture',
      9.60,
      'City-defining culture strength because Ueno Park concentrates major museums, Tokyo National Museum, art institutions, historic park routes, and old-north Tokyo context.',
      array[
        'https://www.gotokyo.org/en/destinations/northern-tokyo/ueno/index.html',
        'https://www.tnm.jp/?lang=en',
        'https://www.japan.travel/en/spot/1650/'
      ]::text[]
    ),
    (
      'Nature',
      8.50,
      'Very strong central nature reset through Ueno Park, Shinobazu Pond, seasonal blossoms, and easy pairing with museums and market streets.',
      array[
        'https://www.gotokyo.org/en/destinations/northern-tokyo/ueno/index.html',
        'https://www.tokyo-park.or.jp/park/ueno/index.html',
        'https://www.japan.travel/en/spot/1650/'
      ]::text[]
    ),
    (
      'Activities',
      8.80,
      'High visitor activity density: museums, zoo/park time, Ameyoko, Okachimachi, station food, and walkable links toward Yanaka or Asakusa.',
      array[
        'https://www.gotokyo.org/en/destinations/northern-tokyo/ueno/index.html',
        'https://www.japan.travel/en/spot/1650/'
      ]::text[]
    ),
    (
      'Routes',
      8.60,
      'Excellent routing node for compact north/east Tokyo days linking Ueno Park, Ameyoko, Okachimachi, Yanaka, Asakusa, and Yamanote/JR access.',
      array[
        'https://www.gotokyo.org/en/destinations/northern-tokyo/ueno/index.html',
        'https://www.japan.travel/en/spot/1650/'
      ]::text[]
    ),
    (
      'Essentials',
      7.80,
      'Practical visitor base with major rail access, food density, hotels, luggage-friendly station logic, and easier east-side pacing than the busiest west-side districts.',
      array[
        'https://www.gotokyo.org/en/destinations/northern-tokyo/ueno/index.html',
        'https://www.google.com/travel/hotels/Tokyo?q=Ueno%20Tokyo%20hotels'
      ]::text[]
    )
),
resolved as (
  select
    city.id as parent_destination_id,
    ueno.id as neighborhood_destination_id,
    strength_seed.category,
    strength_seed.score::numeric(4,2) as score,
    strength_seed.rationale,
    strength_seed.source_urls
  from strength_seed
  join public.destinations city on city.legacy_id = 'city:japan:tokyo'
  join public.destinations ueno on ueno.legacy_id = 'neighborhood:japan:tokyo:tokyo:ueno'
)
insert into public.destination_category_neighborhood_strengths (
  parent_destination_id,
  neighborhood_destination_id,
  category,
  field_key,
  score,
  rationale,
  source_urls,
  source_metadata
)
select
  parent_destination_id,
  neighborhood_destination_id,
  category,
  'default',
  score,
  rationale,
  source_urls,
  jsonb_build_object('source', 'tokyo_ueno_category_strength_seed')
from resolved
on conflict (parent_destination_id, neighborhood_destination_id, category, field_key) do update set
  score = excluded.score,
  rationale = excluded.rationale,
  source_urls = excluded.source_urls,
  source_metadata = public.destination_category_neighborhood_strengths.source_metadata || excluded.source_metadata,
  is_active = true,
  updated_at = now();
