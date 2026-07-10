-- Seed Los Angeles category notes and category-level neighborhood strengths.

with seed_insights(destination_legacy_id, category, label, chips, notes, sort_order) as (
  values
    (
      'city:usa:los-angeles',
      'Food',
      'Food notes',
      array['Tacos', 'K-BBQ', 'Strip Malls', 'Health Food', 'Sushi']::text[],
      '[
        {"label":"Breakfast","body":"Third-wave coffee, legendary breakfast burritos, and health-conscious cafes in Venice or Silver Lake. Weekend mornings revolve around massive farmers markets."},
        {"label":"Lunch","body":"Taco trucks on the corner, hidden gems in unassuming strip malls, or casual sushi and noodles in Little Tokyo or Sawtelle Japantown."},
        {"label":"Dinner","body":"An all-you-can-eat marathon in Koreatown for K-BBQ, upscale dining in the Arts District, or a late-night bacon-wrapped hot dog from a street cart."}
      ]'::jsonb,
      10
    ),
    (
      'city:usa:los-angeles',
      'Nightlife',
      'Nightlife notes',
      array['Rooftop Bars', 'Dive Bars', 'Speakeasies', 'Comedy Clubs']::text[],
      '[
        {"label":"Districts","body":"West Hollywood, WeHo, is the polished hub for high-energy clubs and LGBTQ+ nightlife; Silver Lake and Echo Park are king for gritty dive bars and indie music; DTLA handles sleek rooftops and hidden speakeasies."},
        {"label":"Last call","body":"Unlike Europe, LA nightlife shuts down early. Last call is strictly between 1:30 AM and 2:00 AM. Plan your ride home before the 2 AM surge-pricing hits."},
        {"label":"Room type","body":"Iconic stand-up comedy cellars, dimly lit mezcal bars, velvet-roped hotel rooftops, and historic music venues on the Sunset Strip. Choose your vibe before crossing town."}
      ]'::jsonb,
      20
    ),
    (
      'city:usa:los-angeles',
      'Culture',
      'Culture notes',
      array['Cinema History', 'Contemporary Art', 'Architecture', 'Music Venues']::text[],
      '[
        {"label":"Clusters","body":"Miracle Mile holds Museum Row, including LACMA and the Academy Museum; DTLA is packed with contemporary art at The Broad and MOCA; Hollywood preserves the classic, tourist-heavy cinema history."},
        {"label":"Pairing","body":"LA is sprawling, so group culture by neighborhood. Pair a morning at The Broad with lunch at Grand Central Market, or the Getty Center with an afternoon in Santa Monica."},
        {"label":"Scale","body":"Culture here is highly decentralized and often hidden behind unassuming facades. The great architectural hits, from mid-century modern homes to Frank Lloyd Wright designs, are scattered across residential hillsides."}
      ]'::jsonb,
      30
    ),
    (
      'city:usa:los-angeles',
      'Stay',
      'Stay notes',
      array['Boutique Hotels', 'Beachfront Resorts', 'Hills Hideaways', 'DTLA High-Rises']::text[],
      '[
        {"label":"Location logic","body":"Pick your base strictly by itinerary to avoid spending half the trip in traffic. Stay in Santa Monica or Venice for beach access; Silver Lake or Los Feliz for local, walkable indie vibes; West Hollywood for central access."},
        {"label":"Pace","body":"The Westside offers a slower, ocean-breeze pace; DTLA brings loud, dense urban energy; the Hollywood Hills offer isolated, quiet retreats with massive views."},
        {"label":"Sleep style","body":"Mid-century modern motels, luxury coastal resorts, and quirky boutique hotels solve different trips. If renting a house in the hills, be ready for narrow winding roads and difficult parking."}
      ]'::jsonb,
      40
    ),
    (
      'city:usa:los-angeles',
      'Nature',
      'Nature notes',
      array['Hiking Trails', 'Beaches', 'Canyons', 'Botanical Gardens']::text[],
      '[
        {"label":"Quiet","body":"Griffith Park is massive, but smaller pockets like the secret staircases of Silver Lake, the Huntington Gardens in Pasadena, or the trails in Topanga Canyon offer better escapes from city noise."},
        {"label":"Season","body":"Beware of June Gloom, when early summer beach mornings stay overcast until afternoon. Late summer and fall bring intense heat and dry Santa Ana winds to the canyons."},
        {"label":"Edges","body":"Drive up the Pacific Coast Highway to Malibu for quieter stretches of sand, or hike to Griffith Observatory right before sunset for sweeping views from the mountains to the ocean."}
      ]'::jsonb,
      50
    ),
    (
      'city:usa:los-angeles',
      'Activities',
      'Activity notes',
      array['Hiking', 'Vintage Shopping', 'Studio Tours', 'Flea Markets']::text[],
      '[
        {"label":"Clusters","body":"Melrose Avenue works for fashion and vintage thrifting; the Hollywood Bowl is the quintessential outdoor summer concert; the Venice Boardwalk gives LA people-watching at full volume."},
        {"label":"Queues","body":"Angelenos will wait hours for hyped food pop-ups, sample sales, and brunch spots. Book major studio tours, museum entry, and high-end restaurant reservations weeks in advance."},
        {"label":"Energy","body":"The defining rule of LA is traffic. Never try to cross the city, like Venice to Silver Lake, between 3 PM and 7 PM. Group daily activities into one or two adjacent neighborhoods."}
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
    jsonb_build_object('source', 'los_angeles_category_insight_seed')
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
    jsonb_build_object('source', 'los_angeles_category_insight_seed')
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
  jsonb_build_object('source', 'los_angeles_category_insight_seed')
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
      'city:usa:los-angeles',
      array[
        'https://www.discoverlosangeles.com/',
        'https://www.discoverlosangeles.com/eat-drink',
        'https://www.discoverlosangeles.com/things-to-do/nightlife',
        'https://www.discoverlosangeles.com/things-to-do/arts-culture',
        'https://www.metro.net/'
      ]::text[]
    )
),
strength_seed(parent_legacy_id, category, rationale, scores) as (
  values
    (
      'city:usa:los-angeles',
      'Food',
      'General food usefulness across tacos, K-BBQ, strip-mall dining, health food, sushi, farmers markets, and late street-cart meals.',
      '{"koreatown":9.3,"downtown-la":8.8,"venice":8.4,"silver-lake":8.3,"west-hollywood":7.8}'::jsonb
    ),
    (
      'city:usa:los-angeles',
      'Nightlife',
      'General nightlife strength across rooftop bars, dive bars, speakeasies, comedy rooms, LGBTQ+ nightlife, indie music, and last-call logistics.',
      '{"west-hollywood":9.2,"downtown-la":8.7,"silver-lake":8.5,"koreatown":7.9,"venice":7.4}'::jsonb
    ),
    (
      'city:usa:los-angeles',
      'Culture',
      'Culture strength across cinema history, contemporary art, architecture, music venues, museums, and neighborhood-specific cultural routes.',
      '{"downtown-la":9.2,"west-hollywood":8.1,"silver-lake":7.8,"venice":7.6,"koreatown":7.3}'::jsonb
    ),
    (
      'city:usa:los-angeles',
      'Stay',
      'Stay usefulness across beach access, boutique hotels, central nightlife access, DTLA high-rises, local walkability, and traffic-aware base strategy.',
      '{"west-hollywood":8.9,"venice":8.6,"silver-lake":8.1,"downtown-la":7.9,"koreatown":7.6}'::jsonb
    ),
    (
      'city:usa:los-angeles',
      'Nature',
      'Outdoor usefulness across beaches, canyon access, stair walks, sunset viewpoints, parks, and traffic-aware escapes from city noise.',
      '{"venice":9.2,"silver-lake":8.4,"west-hollywood":7.4,"downtown-la":6.8,"koreatown":6.3}'::jsonb
    ),
    (
      'city:usa:los-angeles',
      'Activities',
      'Activity strength across hiking, vintage shopping, studio-tour logistics, flea markets, beach routes, music venues, and neighborhood clustering.',
      '{"venice":9.0,"downtown-la":8.6,"silver-lake":8.5,"west-hollywood":8.4,"koreatown":7.5}'::jsonb
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
    on neighborhood_destination.legacy_id = 'neighborhood:usa:los-angeles:los-angeles:' || score.key
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
  jsonb_build_object('source', 'los_angeles_category_strength_seed')
from expanded_strengths
on conflict (parent_destination_id, neighborhood_destination_id, category, field_key) do update set
  score = excluded.score,
  rationale = excluded.rationale,
  source_urls = excluded.source_urls,
  source_metadata = public.destination_category_neighborhood_strengths.source_metadata || excluded.source_metadata,
  is_active = true,
  updated_at = now();
