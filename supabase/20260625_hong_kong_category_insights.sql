-- Seed Hong Kong category notes and category-level neighborhood strengths.

with seed_neighborhoods(
  destination_legacy_id,
  parent_legacy_id,
  slug,
  name,
  country_name,
  city_name,
  latitude,
  longitude,
  description
) as (
  values
    (
      'neighborhood:hong-kong:hong-kong:hong-kong:central',
      'city:hong-kong:hong-kong',
      'central',
      'Central',
      'Hong Kong',
      'Hong Kong',
      22.2819,
      114.1589,
      'Finance-tower Hong Kong with polished Cantonese rooms, hotel dining, cocktail bars, escalators, ferries, and colonial fragments in compressed vertical layers.'
    ),
    (
      'neighborhood:hong-kong:hong-kong:hong-kong:sheung-wan',
      'city:hong-kong:hong-kong',
      'sheung-wan',
      'Sheung Wan',
      'Hong Kong',
      'Hong Kong',
      22.2854,
      114.1501,
      'A west-of-Central district of dried seafood shops, temples, roast meat, tea, small restaurants, galleries, and quieter bars.'
    ),
    (
      'neighborhood:hong-kong:hong-kong:hong-kong:tsim-sha-tsui',
      'city:hong-kong:hong-kong',
      'tsim-sha-tsui',
      'Tsim Sha Tsui',
      'Hong Kong',
      'Hong Kong',
      22.2976,
      114.1722,
      'Kowloon harbor-front Hong Kong, with classic hotels, museums, shopping streets, Cantonese dining, and skyline views facing Hong Kong Island.'
    ),
    (
      'neighborhood:hong-kong:hong-kong:hong-kong:wan-chai',
      'city:hong-kong:hong-kong',
      'wan-chai',
      'Wan Chai',
      'Hong Kong',
      'Hong Kong',
      22.2770,
      114.1733,
      'A dense island district where old streets, convention-center polish, bars, live music, noodles, and late practical meals overlap.'
    ),
    (
      'neighborhood:hong-kong:hong-kong:hong-kong:causeway-bay',
      'city:hong-kong:hong-kong',
      'causeway-bay',
      'Causeway Bay',
      'Hong Kong',
      'Hong Kong',
      22.2797,
      114.1850,
      'A retail-heavy district of malls, street food, bakeries, late dining, tram movement, and constant foot traffic.'
    ),
    (
      'neighborhood:hong-kong:hong-kong:hong-kong:west-kowloon',
      'city:hong-kong:hong-kong',
      'west-kowloon',
      'West Kowloon',
      'Hong Kong',
      'Hong Kong',
      22.3027,
      114.1599,
      'A major cultural waterfront anchored by M+, the Hong Kong Palace Museum, performance spaces, harbor lawns, and a wider Kowloon view.'
    ),
    (
      'neighborhood:hong-kong:hong-kong:hong-kong:peak-mid-levels',
      'city:hong-kong:hong-kong',
      'peak-mid-levels',
      'The Peak & Mid-Levels',
      'Hong Kong',
      'Hong Kong',
      22.2708,
      114.1498,
      'The steep, view-driven Hong Kong above Central, shaped by escalators, hillside streets, tram routes, gardens, and skyline overlooks.'
    )
)
insert into public.destinations (
  legacy_id,
  parent_id,
  slug,
  scope,
  name,
  display_name,
  continent_name,
  country_name,
  city_name,
  neighborhood_name,
  coordinates,
  description,
  metadata,
  is_published
)
select
  seed.destination_legacy_id,
  parent_destination.id,
  seed.slug,
  'neighborhood'::public.destination_scope,
  seed.name,
  seed.name,
  parent_destination.continent_name,
  seed.country_name,
  seed.city_name,
  seed.name,
  jsonb_build_array(seed.latitude, seed.longitude),
  seed.description,
  jsonb_build_object('source', 'hong_kong_category_insight_seed', 'entityId', seed.slug),
  true
from seed_neighborhoods seed
join public.destinations parent_destination on parent_destination.legacy_id = seed.parent_legacy_id
on conflict (legacy_id) do update set
  parent_id = excluded.parent_id,
  slug = excluded.slug,
  scope = excluded.scope,
  name = excluded.name,
  display_name = excluded.display_name,
  continent_name = excluded.continent_name,
  country_name = excluded.country_name,
  city_name = excluded.city_name,
  neighborhood_name = excluded.neighborhood_name,
  coordinates = excluded.coordinates,
  description = coalesce(nullif(public.destinations.description, ''), excluded.description),
  metadata = public.destinations.metadata || excluded.metadata,
  is_published = true,
  updated_at = now();

with seed_insights(destination_legacy_id, category, label, chips, notes, sort_order) as (
  values
    (
      'city:hong-kong:hong-kong',
      'Food',
      'Food notes',
      array['Chinese', 'Seafood', 'Street Food', 'Noodles']::text[],
      '[
        {"label":"Breakfast","body":"Cha chaan teng, congee, pineapple buns, milk tea, and early dim sum are the right first move when the day starts old-school."},
        {"label":"Lunch","body":"Roast meat, wonton noodles, market counters, and quick Cantonese rooms work best around Central, Sheung Wan, Wan Chai, or Tsim Sha Tsui."},
        {"label":"Dinner","body":"Central is for polished Cantonese, tasting menus, and hotel rooms; Sheung Wan is better for smaller restaurants and wine-led nights; Tsim Sha Tsui is classic dining with harbor polish; Wan Chai and Causeway Bay work when dinner needs to turn into late noodles, hot pot, or another bar."}
      ]'::jsonb,
      10
    ),
    (
      'city:hong-kong:hong-kong',
      'Nightlife',
      'Nightlife notes',
      array['Live Music', 'Late Night', 'Rooftops']::text[],
      '[
        {"label":"Districts","body":"Central is cocktails and rooftops; Sheung Wan is smaller bars and second drinks; Wan Chai is louder and later; Tsim Sha Tsui works when the harbor view is part of the night."},
        {"label":"Skyline","body":"Start with the view if you want it, then move somewhere with a stronger room: a cocktail bar, music venue, or late street that gives the night more than glass and altitude."},
        {"label":"Late","body":"Keep late plans near transit, tram, ferry, or hotel logic. Hong Kong feels compact until the last crossing starts mattering."}
      ]'::jsonb,
      20
    ),
    (
      'city:hong-kong:hong-kong',
      'Nature',
      'Nature notes',
      array['Views', 'Urban Parks', 'Waterfront', 'Gardens']::text[],
      '[
        {"label":"Elevation","body":"The Peak is the obvious view, but ridge walks and island edges are where the city finally exhales."},
        {"label":"Water","body":"Ferries are not decoration. Star Ferry, harbor walks, and island routes reset the day better than another taxi."},
        {"label":"Weather","body":"Heat, haze, and rain decide whether the smart move is a trail, a tram, or an indoor pause before dinner."}
      ]'::jsonb,
      30
    ),
    (
      'city:hong-kong:hong-kong',
      'Culture',
      'Culture notes',
      array['Architecture', 'Museums', 'Galleries', 'Historic Streets']::text[],
      '[
        {"label":"Layers","body":"Central and Sheung Wan carry temples, markets, colonial fragments, galleries, and finance-tower pressure in the same walk."},
        {"label":"Kowloon","body":"Tsim Sha Tsui and West Kowloon are stronger for museums, harbor scale, and cultural institutions than they look from across the water."},
        {"label":"Street life","body":"Hong Kong culture shows up in the everyday machinery of the city: wet markets, tram stops, ferry piers, covered walkways, old shopfronts, incense-heavy temples, and food rooms packed above street level."}
      ]'::jsonb,
      40
    ),
    (
      'city:hong-kong:hong-kong',
      'Stay',
      'Stay notes',
      array['Hotels', 'Hostels', 'Vacation Rentals']::text[],
      '[
        {"label":"Base","body":"Central is efficient and expensive; Sheung Wan is better for food and bars; Tsim Sha Tsui is hotel-rich with harbor payoff; Causeway Bay works for shopping and transit."},
        {"label":"Tradeoff","body":"The best view can put you slightly outside the night you actually want. Choose repeat movement over balcony fantasy."},
        {"label":"Comfort","body":"Hills, elevators, humidity, and luggage matter here. A good MTR or ferry position saves real energy."}
      ]'::jsonb,
      50
    ),
    (
      'city:hong-kong:hong-kong',
      'Activities',
      'Activity notes',
      array['Walking Tours', 'Shopping', 'Family Spots', 'Wellness']::text[],
      '[
        {"label":"Movement","body":"Build days by crossing and elevation: tram, ferry, escalator, market lane, ridge, dinner."},
        {"label":"Shopping","body":"Causeway Bay is retail overload, Central is polished, Sheung Wan is more textured, and Kowloon gives a different street rhythm."},
        {"label":"Pace","body":"Hong Kong rewards compression, but do not make every hour vertical. Add one waterfront or green reset before night."}
      ]'::jsonb,
      60
    )
),
upserted_insights as (
  insert into public.destination_category_insights (
    destination_id,
    category,
    locale,
    label,
    sort_order,
    source_type,
    source_metadata
  )
  select
    destination.id,
    seed.category,
    'en',
    seed.label,
    seed.sort_order,
    'editorial',
    jsonb_build_object('source', 'hong_kong_category_insight_seed')
  from seed_insights seed
  join public.destinations destination on destination.legacy_id = seed.destination_legacy_id
  on conflict (destination_id, category, locale) do update set
    label = excluded.label,
    sort_order = excluded.sort_order,
    source_metadata = public.destination_category_insights.source_metadata || excluded.source_metadata,
    is_active = true,
    updated_at = now()
  returning id, destination_id, category, locale
),
upserted_chips as (
  insert into public.destination_category_insight_chips (
    insight_id,
    chip_slug,
    label,
    filter_kind,
    filter_value,
    sort_order,
    source_metadata
  )
  select
    insight.id,
    lower(regexp_replace(chip.label, '[^a-zA-Z0-9]+', '_', 'g')),
    chip.label,
    case when insight.category = 'Food' then 'cuisine' else 'subcategory' end,
    chip.label,
    (chip.sort_order::integer * 10),
    jsonb_build_object('source', 'hong_kong_category_insight_seed')
  from upserted_insights insight
  join public.destinations destination on destination.id = insight.destination_id
  join seed_insights seed
    on seed.destination_legacy_id = destination.legacy_id
   and seed.category = insight.category
  cross join lateral unnest(seed.chips) with ordinality as chip(label, sort_order)
  on conflict (insight_id, chip_slug) do update set
    label = excluded.label,
    filter_kind = excluded.filter_kind,
    filter_value = excluded.filter_value,
    sort_order = excluded.sort_order,
    source_metadata = public.destination_category_insight_chips.source_metadata || excluded.source_metadata,
    is_active = true,
    updated_at = now()
  returning insight_id
)
insert into public.destination_category_insight_notes (
  insight_id,
  note_key,
  label,
  body,
  sort_order,
  source_metadata
)
select
  insight.id,
  coalesce(nullif(lower(regexp_replace(note.value ->> 'label', '[^a-zA-Z0-9]+', '_', 'g')), ''), 'note_' || note.sort_order::text),
  note.value ->> 'label',
  note.value ->> 'body',
  (note.sort_order::integer * 10),
  jsonb_build_object('source', 'hong_kong_category_insight_seed')
from upserted_insights insight
join public.destinations destination on destination.id = insight.destination_id
join seed_insights seed
  on seed.destination_legacy_id = destination.legacy_id
 and seed.category = insight.category
cross join (select count(*) from upserted_chips) chip_guard
cross join lateral jsonb_array_elements(seed.notes) with ordinality as note(value, sort_order)
where nullif(note.value ->> 'body', '') is not null
on conflict (insight_id, note_key) do update set
  label = excluded.label,
  body = excluded.body,
  sort_order = excluded.sort_order,
  source_metadata = public.destination_category_insight_notes.source_metadata || excluded.source_metadata,
  is_active = true,
  updated_at = now();

with city_sources(parent_legacy_id, source_urls) as (
  values
    (
      'city:hong-kong:hong-kong',
      array[
        'https://www.discoverhongkong.com/eng/explore/dining.html',
        'https://www.discoverhongkong.com/eng/explore/nightlife.html',
        'https://www.discoverhongkong.com/eng/explore/arts.html',
        'https://www.discoverhongkong.com/eng/explore/great-outdoor.html',
        'https://www.timeout.com/hong-kong'
      ]::text[]
    )
),
strength_seed(parent_legacy_id, category, rationale, scores) as (
  values
    (
      'city:hong-kong:hong-kong',
      'Food',
      'General food usefulness across Cantonese dining, roast meat, noodle counters, seafood, markets, and late practical meals.',
      '{"central":9.2,"sheung-wan":8.8,"tsim-sha-tsui":8.5,"wan-chai":8.0,"causeway-bay":7.8,"west-kowloon":6.6,"peak-mid-levels":5.6}'::jsonb
    ),
    (
      'city:hong-kong:hong-kong',
      'Nightlife',
      'General nightlife strength across cocktail rooms, rooftop usefulness, live music, late streets, second drinks, and transit-safe concentration.',
      '{"central":9.2,"wan-chai":8.6,"sheung-wan":8.4,"tsim-sha-tsui":7.8,"causeway-bay":7.2,"west-kowloon":6.8,"peak-mid-levels":5.8}'::jsonb
    ),
    (
      'city:hong-kong:hong-kong',
      'Nature',
      'Outdoor usefulness across elevation, harbor walks, ferries, gardens, waterfront space, and weather-aware resets.',
      '{"peak-mid-levels":9.2,"tsim-sha-tsui":8.4,"west-kowloon":8.2,"central":7.4,"sheung-wan":6.5,"causeway-bay":6.2,"wan-chai":6.0}'::jsonb
    ),
    (
      'city:hong-kong:hong-kong',
      'Culture',
      'Culture strength across museums, temples, colonial fragments, galleries, wet markets, historic streets, and harbor institutions.',
      '{"west-kowloon":9.2,"central":8.8,"sheung-wan":8.6,"tsim-sha-tsui":8.0,"wan-chai":7.2,"causeway-bay":6.4,"peak-mid-levels":6.0}'::jsonb
    ),
    (
      'city:hong-kong:hong-kong',
      'Stay',
      'Stay usefulness across hotel depth, transit, ferry access, dining proximity, view payoff, hill friction, and repeat movement.',
      '{"central":9.0,"tsim-sha-tsui":8.7,"sheung-wan":8.2,"causeway-bay":8.0,"wan-chai":7.6,"west-kowloon":7.4,"peak-mid-levels":6.6}'::jsonb
    ),
    (
      'city:hong-kong:hong-kong',
      'Activities',
      'Activity strength across tram and ferry movement, shopping, museums, markets, harbor walks, elevation, and compact route density.',
      '{"central":9.0,"tsim-sha-tsui":8.8,"west-kowloon":8.5,"sheung-wan":8.3,"peak-mid-levels":8.0,"causeway-bay":7.7,"wan-chai":7.5}'::jsonb
    )
),
expanded_strengths as (
  select
    parent_destination.id as parent_destination_id,
    neighborhood_destination.id as neighborhood_destination_id,
    strength.category,
    'default' as field_key,
    (score.value)::numeric(4,2) as score,
    strength.rationale,
    city_sources.source_urls
  from strength_seed strength
  join city_sources on city_sources.parent_legacy_id = strength.parent_legacy_id
  cross join lateral jsonb_each_text(strength.scores) as score(key, value)
  join public.destinations parent_destination on parent_destination.legacy_id = strength.parent_legacy_id
  join public.destinations neighborhood_destination
    on neighborhood_destination.legacy_id = 'neighborhood:hong-kong:hong-kong:hong-kong:' || score.key
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
  field_key,
  score,
  rationale,
  source_urls,
  jsonb_build_object('source', 'hong_kong_category_strength_seed')
from expanded_strengths
on conflict (parent_destination_id, neighborhood_destination_id, category, field_key) do update set
  score = excluded.score,
  rationale = excluded.rationale,
  source_urls = excluded.source_urls,
  source_metadata = public.destination_category_neighborhood_strengths.source_metadata || excluded.source_metadata,
  is_active = true,
  updated_at = now();
