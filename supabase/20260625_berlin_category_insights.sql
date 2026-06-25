-- Seed Berlin category notes and category-level neighborhood strengths.

with seed_insights(destination_legacy_id, category, label, chips, notes, sort_order) as (
  values
    (
      'city:germany:berlin',
      'Food',
      'Food notes',
      array['Döner', 'Currywurst', 'Vegan', 'Third-Wave Coffee', 'Street Food']::text[],
      '[
        {"label":"Breakfast","body":"Third-wave coffee shops, traditional bakeries for fresh Brotchen, and sprawling weekend brunches, especially in Neukolln and Prenzlauer Berg, that stretch well into the afternoon."},
        {"label":"Lunch","body":"Doner kebab kiosks, Currywurst stands, and casual Vietnamese or Middle Eastern spots. Fast, cheap, flavorful street food is the backbone of Berlin daytime dining."},
        {"label":"Dinner","body":"Berlin swings between laid-back neighborhood eateries, bustling indoor markets like Markthalle Neun, and boundary-pushing vegan or modern European fine dining."}
      ]'::jsonb,
      10
    ),
    (
      'city:germany:berlin',
      'Nightlife',
      'Nightlife notes',
      array['Techno/Clubs', 'Spätis', 'Dive Bars', 'Beer Gardens']::text[],
      '[
        {"label":"Districts","body":"Kreuzberg and Friedrichshain are the absolute epicenters of the heavy-hitting industrial club scene; Neukolln is packed with gritty, hip bars; Mitte offers polished cocktail lounges."},
        {"label":"Pacing","body":"Berlin nightlife is famously relentless. Clubs often do not peak until 2 AM or 3 AM and can run continuously through Monday morning. The weekend is a marathon, not a sprint."},
        {"label":"Room type","body":"Spatis (late-night convenience stores) for grabbing a cheap beer to drink on the sidewalk, smoky underground dive bars, and massive techno temples. Choose based on your stamina."}
      ]'::jsonb,
      20
    ),
    (
      'city:germany:berlin',
      'Culture',
      'Culture notes',
      array['Cold War History', 'Museum Island', 'Street Art', 'Contemporary Galleries']::text[],
      '[
        {"label":"Clusters","body":"Museum Island handles the classical and ancient antiquities; Mitte holds the major political and historical landmarks; Kreuzberg and Friedrichshain, including the East Side Gallery, serve as open-air canvases for street art."},
        {"label":"Pairing","body":"Balance the heavy, sobering historical sites, like the Holocaust Memorial or Topography of Terror, with lighter gallery hopping in Auguststrasse or a walk through a park to avoid emotional fatigue."},
        {"label":"Scale","body":"The city is massive and completely decentralized. There is no single downtown. Culture is scattered across sprawling districts, so group the day by neighborhood to avoid spending hours on the U-Bahn."}
      ]'::jsonb,
      30
    ),
    (
      'city:germany:berlin',
      'Stay',
      'Stay notes',
      array['Boutique Hotels', 'Party Hostels', 'East Berlin Edge', 'West Berlin Polish']::text[],
      '[
        {"label":"East vs. West","body":"Mitte is central and convenient for first-timers; Prenzlauer Berg is leafy, safe, and family-friendly; Kreuzberg and Neukolln are gritty and strong for nightlife; Charlottenburg offers upscale, classic European elegance."},
        {"label":"Pace","body":"The eastern neighborhoods trade quiet mornings for intense, youth-driven energy and late nights. The western districts offer a slower, more polished retreat at the end of the day."},
        {"label":"Sleep style","body":"Industrial-chic design hotels, massive social hostels, and sleek business bases solve different trips. Berlin summers can get hot, and many older apartments or budget stays lack air conditioning."}
      ]'::jsonb,
      40
    ),
    (
      'city:germany:berlin',
      'Nature',
      'Nature notes',
      array['Tempelhofer Feld', 'Massive Parks', 'Lakes', 'Spree River']::text[],
      '[
        {"label":"Quiet","body":"Tiergarten is the massive green lung in the center, perfect for losing the city noise. Treptower Park offers riverside paths mixed with monumental Soviet architecture."},
        {"label":"Season","body":"Summer in Berlin is legendary: locals practically live outdoors, swimming in surrounding lakes like Wannsee or lounging in parks. Winter is bitterly cold and grey, driving everyone indoors to cozy cafes and museums."},
        {"label":"Edges","body":"Tempelhofer Feld is an abandoned airport turned massive public park, a surreal wide-open expanse where locals skate, kite-surf, and barbecue on the old runways."}
      ]'::jsonb,
      50
    ),
    (
      'city:germany:berlin',
      'Activities',
      'Activity notes',
      array['Flea Markets', 'Cycling', 'Clubbing', 'Historical Tours']::text[],
      '[
        {"label":"Clusters","body":"Sunday flea markets are a weekly ritual. Mauerpark is the most famous, complete with outdoor karaoke. Kantstrasse is the go-to strip in the west for strong Asian food."},
        {"label":"Queues","body":"The Reichstag dome is free but requires booking weeks in advance. Famous techno clubs have notorious door policies and long lines with absolutely no guarantee of entry."},
        {"label":"Energy","body":"Berlin energy is whatever you want it to be: classical music and fine dining, or a 72-hour underground party. Build in unstructured time to sit at a cafe and just watch the city happen."}
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
    jsonb_build_object('source', 'berlin_category_insight_seed')
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
    jsonb_build_object('source', 'berlin_category_insight_seed')
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
  jsonb_build_object('source', 'berlin_category_insight_seed')
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
      'city:germany:berlin',
      array[
        'https://www.visitberlin.de/en',
        'https://www.visitberlin.de/en/berlin-food',
        'https://www.visitberlin.de/en/nightlife-berlin',
        'https://www.berlin.de/en/',
        'https://www.bvg.de/en'
      ]::text[]
    )
),
strength_seed(parent_legacy_id, category, rationale, scores) as (
  values
    (
      'city:germany:berlin',
      'Food',
      'General food usefulness across doner, currywurst, bakeries, brunch, coffee, Vietnamese and Middle Eastern spots, markets, vegan dining, and neighborhood eating.',
      '{"kreuzberg":9.0,"prenzlauer-berg":8.4,"friedrichshain":8.2,"mitte":7.8,"charlottenburg":7.5,"tiergarten":5.8}'::jsonb
    ),
    (
      'city:germany:berlin',
      'Nightlife',
      'General nightlife strength across techno clubs, Spatis, dive bars, beer gardens, cocktail rooms, late pacing, and stamina-heavy weekends.',
      '{"friedrichshain":9.5,"kreuzberg":9.3,"mitte":7.2,"prenzlauer-berg":6.8,"charlottenburg":6.3,"tiergarten":4.5}'::jsonb
    ),
    (
      'city:germany:berlin',
      'Culture',
      'Culture strength across Cold War history, Museum Island, political landmarks, street art, contemporary galleries, and open-air historic sites.',
      '{"mitte":9.6,"friedrichshain":8.6,"kreuzberg":8.4,"charlottenburg":8.0,"tiergarten":7.8,"prenzlauer-berg":7.0}'::jsonb
    ),
    (
      'city:germany:berlin',
      'Stay',
      'Stay usefulness across central convenience, east-side energy, quiet leafy bases, classic western polish, nightlife access, and sleep quality.',
      '{"mitte":8.8,"prenzlauer-berg":8.4,"kreuzberg":8.0,"charlottenburg":7.9,"friedrichshain":7.6,"tiergarten":7.3}'::jsonb
    ),
    (
      'city:germany:berlin',
      'Nature',
      'Outdoor usefulness across Tiergarten, river paths, huge parks, summer lake access, cycling, and Tempelhofer-style open-air resets.',
      '{"tiergarten":9.4,"friedrichshain":7.8,"mitte":7.4,"prenzlauer-berg":7.3,"kreuzberg":7.0,"charlottenburg":6.8}'::jsonb
    ),
    (
      'city:germany:berlin',
      'Activities',
      'Activity strength across flea markets, cycling, clubbing, historical tours, Reichstag planning, Asian food corridors, and long unstructured neighborhood days.',
      '{"mitte":8.8,"friedrichshain":8.6,"kreuzberg":8.5,"prenzlauer-berg":8.2,"charlottenburg":7.4,"tiergarten":7.2}'::jsonb
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
    on neighborhood_destination.legacy_id = 'neighborhood:germany:berlin:berlin:' || score.key
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
  jsonb_build_object('source', 'berlin_category_strength_seed')
from expanded_strengths
on conflict (parent_destination_id, neighborhood_destination_id, category, field_key) do update set
  score = excluded.score,
  rationale = excluded.rationale,
  source_urls = excluded.source_urls,
  source_metadata = public.destination_category_neighborhood_strengths.source_metadata || excluded.source_metadata,
  is_active = true,
  updated_at = now();
