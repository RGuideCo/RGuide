-- Seed Amsterdam category notes and category-level neighborhood strengths.

with seed_insights(destination_legacy_id, category, label, chips, notes, sort_order) as (
  values
    (
      'city:netherlands:amsterdam',
      'Food',
      'Food notes',
      array['Dutch', 'Indonesian', 'Brown Cafes', 'Surinamese', 'Street Food']::text[],
      '[
        {"label":"Breakfast","body":"Bakeries, canal-side cafes, pannenkoeken (pancake) houses, and quick espresso stops before the early museum slots."},
        {"label":"Lunch","body":"Broodjes (sandwiches), herring stands (haringhandels), cafe terraces, and indoor food halls like Foodhallen when you need quick variety."},
        {"label":"Dinner","body":"Indonesian rijsttafel is the must-do feast; modern European dining, cozy neighborhood bistros, and hearty pub food in bruine kroegen (brown cafes) work when the weather turns."}
      ]'::jsonb,
      10
    ),
    (
      'city:netherlands:amsterdam',
      'Nightlife',
      'Nightlife notes',
      array['Electronic/Clubs', 'Brown Cafes', 'Live Music', 'Craft Beer']::text[],
      '[
        {"label":"Districts","body":"Leidseplein and Rembrandtplein hold the heavy, loud tourist nightlife; Jordaan and De Pijp are better for neighborhood bars and relaxed drinks; Amsterdam Noord is the hub for industrial clubs and electronic music."},
        {"label":"Transport","body":"Trams stop running shortly after midnight, replaced by night buses. Bikes remain the ultimate late-night transit, but only if you are sober enough to ride safely."},
        {"label":"Room type","body":"Historic candlelit brown cafes, waterside brewery terraces, massive techno venues, and intimate cocktail bars dictate the night. Choose the vibe before you pick the neighborhood."}
      ]'::jsonb,
      20
    ),
    (
      'city:netherlands:amsterdam',
      'Culture',
      'Culture notes',
      array['Museums', 'Golden Age Architecture', 'Art Galleries', 'Historic Canals']::text[],
      '[
        {"label":"Clusters","body":"Museumplein handles the heavy-hitting art (Rijksmuseum, Van Gogh), the Canal Ring delivers Golden Age architecture, and the Jewish Cultural Quarter holds vital WWII history."},
        {"label":"Pairing","body":"Morning, pre-booked museum tickets are essential; pair them with afternoon canal walks or browsing the Nine Streets (De Negen Straatjes) when museum fatigue sets in."},
        {"label":"Scale","body":"Amsterdam culture is deeply woven into its layout. The UNESCO-listed canal ring is the museum. Leave time to simply cross bridges, dodge bicycles, and observe the tilted gable houses."}
      ]'::jsonb,
      30
    ),
    (
      'city:netherlands:amsterdam',
      'Stay',
      'Stay notes',
      array['Canal Houses', 'Boutique Hotels', 'Houseboats', 'Hostels']::text[],
      '[
        {"label":"Location logic","body":"Inside the Canal Ring (Grachtengordel) maximizes charm but raises prices; De Pijp and Oud-West offer local energy and great food; Amsterdam Noord gives industrial edge and breathing room."},
        {"label":"Pace","body":"The Red Light District (De Wallen) and central squares are loud and chaotic at night; Jordaan and Plantage trade the nightlife access for quiet, leafy mornings."},
        {"label":"Sleep style","body":"Narrow canal hotels, modern design spots, traditional hostels, and floating houseboats solve different trips. Historic canal houses have notoriously steep, narrow stairs, so factor that in with heavy luggage."}
      ]'::jsonb,
      40
    ),
    (
      'city:netherlands:amsterdam',
      'Nature',
      'Nature notes',
      array['Urban Parks', 'Canals', 'Botanical Gardens', 'Forests']::text[],
      '[
        {"label":"Quiet","body":"Vondelpark is the social artery, but smaller spots like Oosterpark, the Hortus Botanicus, or the quiet stretches of the Amstel river provide better resets between crowds."},
        {"label":"Season","body":"Summer brings out the massive terrace and park-picnic culture; winter forces you indoors but makes the canals moody and striking. Rain is a constant, so nature here is best enjoyed with an umbrella handy."},
        {"label":"Edges","body":"Renting a bike to ride into Amsterdamse Bos (the Amsterdam Forest) or taking the free ferry across the IJ to the rural north breaks up the dense brick-and-water urban feel."}
      ]'::jsonb,
      50
    ),
    (
      'city:netherlands:amsterdam',
      'Activities',
      'Activity notes',
      array['Cycling', 'Boat Tours', 'Shopping', 'Vintage Markets']::text[],
      '[
        {"label":"Clusters","body":"Activities flow best by neighborhood: Museumplein/Vondelpark for high culture, Jordaan/Nine Streets for boutique shopping, and De Pijp for the Albert Cuyp Market and street food."},
        {"label":"Queues","body":"The Anne Frank House and Van Gogh Museum sell out weeks in advance; book these before you book your flights. Canal cruises are plentiful, but smaller, open-air boat tours are better and often require booking a day ahead."},
        {"label":"Energy","body":"Mix the heavy pedestrian traffic of the center with a boat ride or a bike ride out to a quieter district. Amsterdam heavily rewards those who step just two streets away from the main tourist arteries."}
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
    jsonb_build_object('source', 'amsterdam_category_insight_seed')
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
    jsonb_build_object('source', 'amsterdam_category_insight_seed')
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
  jsonb_build_object('source', 'amsterdam_category_insight_seed')
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
      'city:netherlands:amsterdam',
      array[
        'https://www.iamsterdam.com/en',
        'https://www.iamsterdam.com/en/whats-on/museums-and-galleries',
        'https://www.iamsterdam.com/en/see-and-do/eating-and-drinking',
        'https://www.timeout.com/amsterdam',
        'https://www.gvb.nl/en/customer-service/travel-rules/night-bus'
      ]::text[]
    )
),
strength_seed(parent_legacy_id, category, rationale, scores) as (
  values
    (
      'city:netherlands:amsterdam',
      'Food',
      'General food usefulness across bakeries, brown cafes, Indonesian rijsttafel, markets, neighborhood bistros, and quick street food.',
      '{"de-pijp":8.8,"jordaan":8.5,"centrum":8.0,"de-wallen":7.2,"amsterdam-noord-ndsm":7.0,"museum-quarter":6.8}'::jsonb
    ),
    (
      'city:netherlands:amsterdam',
      'Nightlife',
      'General nightlife strength across brown cafes, relaxed neighborhood bars, electronic clubs, live music, craft beer, and late transit practicality.',
      '{"de-wallen":8.4,"amsterdam-noord-ndsm":8.3,"de-pijp":8.0,"jordaan":7.8,"centrum":7.4,"museum-quarter":5.2}'::jsonb
    ),
    (
      'city:netherlands:amsterdam',
      'Culture',
      'Culture strength across major museums, Golden Age architecture, canal history, galleries, WWII memory, and historic urban fabric.',
      '{"museum-quarter":9.4,"centrum":9.0,"jordaan":8.5,"de-wallen":7.8,"amsterdam-noord-ndsm":7.2,"de-pijp":6.6}'::jsonb
    ),
    (
      'city:netherlands:amsterdam',
      'Stay',
      'Stay usefulness across canal charm, sleep quality, food access, nightlife noise, hostels, houseboats, and transit or ferry logic.',
      '{"jordaan":8.8,"centrum":8.2,"de-pijp":8.0,"museum-quarter":7.8,"amsterdam-noord-ndsm":7.2,"de-wallen":5.8}'::jsonb
    ),
    (
      'city:netherlands:amsterdam',
      'Nature',
      'Outdoor usefulness across canals, parks, botanical gardens, bike escapes, IJ ferry routes, Amstel stretches, and weather-aware resets.',
      '{"museum-quarter":8.4,"amsterdam-noord-ndsm":8.0,"jordaan":7.8,"centrum":7.5,"de-pijp":7.2,"de-wallen":5.8}'::jsonb
    ),
    (
      'city:netherlands:amsterdam',
      'Activities',
      'Activity strength across cycling, boat tours, museum slots, boutique shopping, markets, vintage browsing, and neighborhood route density.',
      '{"centrum":8.8,"jordaan":8.6,"museum-quarter":8.5,"de-pijp":8.2,"amsterdam-noord-ndsm":7.8,"de-wallen":6.8}'::jsonb
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
    on neighborhood_destination.legacy_id = 'neighborhood:netherlands:amsterdam:amsterdam:' || score.key
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
  jsonb_build_object('source', 'amsterdam_category_strength_seed')
from expanded_strengths
on conflict (parent_destination_id, neighborhood_destination_id, category, field_key) do update set
  score = excluded.score,
  rationale = excluded.rationale,
  source_urls = excluded.source_urls,
  source_metadata = public.destination_category_neighborhood_strengths.source_metadata || excluded.source_metadata,
  is_active = true,
  updated_at = now();
