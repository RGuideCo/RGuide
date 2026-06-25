-- Seed Athens category notes and category-level neighborhood strengths.

with seed_insights(destination_legacy_id, category, label, chips, notes, sort_order) as (
  values
    (
      'city:greece:athens',
      'Food',
      'Food notes',
      array['Souvlaki', 'Tavernas', 'Meze', 'Bakeries', 'Rooftop Dining']::text[],
      '[
        {"label":"Breakfast","body":"Koulouri (sesame bread rings) from street carts, strong coffee like freddo espresso at local cafes, and traditional bakeries for tiropita (cheese pie)."},
        {"label":"Lunch","body":"Casual souvlaki spots, bustling meze joints in Monastiraki, or a relaxed taverna meal in Koukaki. Fast and flavorful is the midday rule."},
        {"label":"Dinner","body":"Late and lively. Athenians do not usually eat dinner until 9 PM or 10 PM. Opt for traditional tavernas with outdoor seating in Plaka or high-end dining with Acropolis views."}
      ]'::jsonb,
      10
    ),
    (
      'city:greece:athens',
      'Nightlife',
      'Nightlife notes',
      array['Rooftop Bars', 'Wine Bars', 'Rebetiko', 'All-Night Clubs']::text[],
      '[
        {"label":"Districts","body":"Psyrri is the absolute epicenter of late-night energy with bars and live music; Monastiraki offers iconic rooftop bars with Acropolis views; Gazi handles the heavy, industrial late-night clubbing."},
        {"label":"Pacing","body":"Much like the dining, nightlife starts incredibly late. Bars fill up around midnight, and true clubs will not peak until 2 AM or 3 AM."},
        {"label":"Room type","body":"Polished rooftops overlooking the Parthenon, small natural wine bars in Koukaki, or traditional Rebetiko (Greek blues) in cozy, lively tavernas. Choose the energy before the neighborhood."}
      ]'::jsonb,
      20
    ),
    (
      'city:greece:athens',
      'Culture',
      'Culture notes',
      array['Ancient Antiquities', 'Byzantine Churches', 'Street Art', 'Neoclassical Architecture']::text[],
      '[
        {"label":"Clusters","body":"The Historic Triangle, from Plaka to Monastiraki and Syntagma, holds the heavy-hitters like the Acropolis and Ancient Agora; Exarchia and Psyrri serve as canvases for raw, political street art; Kolonaki houses upscale galleries and the Benaki Museum."},
        {"label":"Pairing","body":"Tackle the exposed ancient ruins, including the Acropolis and Roman Agora, right at opening time to beat the intense sun and cruise-ship crowds, then escape into the air-conditioned Acropolis Museum during the heat of the day."},
        {"label":"Scale","body":"History here is layered. You will literally walk over glass floors revealing ancient ruins beneath modern sidewalks. The juxtaposition of a 5th-century BC temple, 19th-century neoclassical buildings, and modern street art is the city signature."}
      ]'::jsonb,
      30
    ),
    (
      'city:greece:athens',
      'Stay',
      'Stay notes',
      array['Historic Center', 'Boutique Hotels', 'Local Neighborhoods', 'Riviera']::text[],
      '[
        {"label":"Location logic","body":"Plaka is the postcard-perfect, tourist-heavy center with unmatched convenience; Koukaki offers a calmer, lived-in local vibe just south of the Acropolis; Kolonaki provides an upscale, polished retreat."},
        {"label":"Pace","body":"Stay in Psyrri or Monastiraki if you want to be right in the middle of the noise and nightlife. If you prefer quiet mornings and sleeping through the night, look toward Thissio or Pangrati."},
        {"label":"Sleep style","body":"Neoclassical boutique hotels, modern apartments with Acropolis views, and budget hostels solve different trips. Athens can be hilly, so if you book in Kolonaki or the upper edges of Plaka, expect steep walks with luggage."}
      ]'::jsonb,
      40
    ),
    (
      'city:greece:athens',
      'Nature',
      'Nature notes',
      array['City Hills', 'National Gardens', 'Coastal Riviera', 'Sunsets']::text[],
      '[
        {"label":"Quiet","body":"The National Garden right behind Parliament offers a massive, shaded oasis in the middle of the concrete sprawl. The tree-lined paths of Filopappou Hill provide quiet walks and incredible angles of the Parthenon."},
        {"label":"Season","body":"Summer heat radiating off the marble and concrete can be punishing, so seek shade by midday. The Athens Riviera, a quick tram or taxi ride south, offers sea breezes and beach clubs during the hottest months."},
        {"label":"Edges","body":"Mount Lycabettus is the highest point in the center. Hike up, or take the funicular, for sweeping sunset views spanning all the way to the port of Piraeus."}
      ]'::jsonb,
      50
    ),
    (
      'city:greece:athens',
      'Activities',
      'Activity notes',
      array['Historical Sites', 'Flea Markets', 'Island Day Trips', 'Open-Air Cinemas']::text[],
      '[
        {"label":"Clusters","body":"Monastiraki works for Sunday flea market haggling; Ermou Street handles mainstream shopping; Syntagma gives you the changing of the guards."},
        {"label":"Queues","body":"The Acropolis is notorious for massive lines in the summer. Buy time-slotted tickets online well in advance, or book a guided tour to navigate the complex efficiently."},
        {"label":"Energy","body":"Treat Athens like a local to survive it: early morning exploring, a long late lunch, a siesta during the afternoon heat, and then heading back out as the city comes alive again after sunset."}
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
    jsonb_build_object('source', 'athens_category_insight_seed')
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
    jsonb_build_object('source', 'athens_category_insight_seed')
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
  jsonb_build_object('source', 'athens_category_insight_seed')
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
      'city:greece:athens',
      array[
        'https://www.thisisathens.org/',
        'https://www.thisisathens.org/restaurants',
        'https://www.thisisathens.org/nightlife',
        'https://www.thisisathens.org/arts-entertainment',
        'https://www.oasa.gr/en/'
      ]::text[]
    )
),
strength_seed(parent_legacy_id, category, rationale, scores) as (
  values
    (
      'city:greece:athens',
      'Food',
      'General food usefulness across souvlaki, meze, bakeries, tavernas, rooftop dining, late dinners, and casual neighborhood eating.',
      '{"monastiraki":8.8,"pangrati":8.4,"makrygianni":8.0,"mets":7.8,"kolonaki":7.7,"exarchia":7.4}'::jsonb
    ),
    (
      'city:greece:athens',
      'Nightlife',
      'General nightlife strength across rooftop bars, wine bars, live music, Rebetiko rooms, late pacing, and all-night club access.',
      '{"monastiraki":8.8,"exarchia":8.2,"kolonaki":7.8,"pangrati":7.5,"makrygianni":7.2,"mets":6.6}'::jsonb
    ),
    (
      'city:greece:athens',
      'Culture',
      'Culture strength across ancient antiquities, Byzantine churches, museums, neoclassical architecture, street art, and layered historic streets.',
      '{"makrygianni":9.5,"monastiraki":9.2,"kolonaki":8.5,"exarchia":8.0,"mets":7.5,"pangrati":7.4}'::jsonb
    ),
    (
      'city:greece:athens',
      'Stay',
      'Stay usefulness across historic access, Acropolis proximity, quiet mornings, boutique hotels, local neighborhood feel, and luggage practicality.',
      '{"makrygianni":8.9,"kolonaki":8.5,"pangrati":8.2,"monastiraki":7.8,"mets":7.6,"exarchia":6.8}'::jsonb
    ),
    (
      'city:greece:athens',
      'Nature',
      'Outdoor usefulness across city hills, National Garden access, shaded walks, Lycabettus views, Filopappou paths, and heat-aware resets.',
      '{"kolonaki":8.8,"makrygianni":8.6,"mets":8.2,"pangrati":7.8,"monastiraki":7.2,"exarchia":6.8}'::jsonb
    ),
    (
      'city:greece:athens',
      'Activities',
      'Activity strength across historical sites, flea markets, shopping streets, open-air cinemas, ticket logistics, and sunset-to-night pacing.',
      '{"monastiraki":9.0,"makrygianni":8.9,"kolonaki":8.0,"pangrati":7.8,"exarchia":7.6,"mets":7.4}'::jsonb
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
    on neighborhood_destination.legacy_id = 'neighborhood:greece:athens:athens:' || score.key
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
  jsonb_build_object('source', 'athens_category_strength_seed')
from expanded_strengths
on conflict (parent_destination_id, neighborhood_destination_id, category, field_key) do update set
  score = excluded.score,
  rationale = excluded.rationale,
  source_urls = excluded.source_urls,
  source_metadata = public.destination_category_neighborhood_strengths.source_metadata || excluded.source_metadata,
  is_active = true,
  updated_at = now();
