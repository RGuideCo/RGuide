-- Seed Lisbon category notes and category-level neighborhood strengths.

with seed_insights(destination_legacy_id, category, label, chips, notes, sort_order) as (
  values
    (
      'city:portugal:lisbon',
      'Food',
      'Food notes',
      array['Seafood', 'Petiscos', 'Pastelarias', 'Fado Dining', 'Bifanas']::text[],
      '[
        {"label":"Breakfast","body":"A quick bica (espresso) and a pastel de nata standing at the counter of a traditional pastelaria, or thick slices of toasted bread with butter."},
        {"label":"Lunch","body":"Casual tascas serving the prato do dia (dish of the day), often grilled fish, bacalhau (cod), or a quick bifana (pork sandwich) if you are on the move."},
        {"label":"Dinner","body":"Long, late meals of shareable petiscos or fresh seafood. If you book a Fado dinner in Alfama, expect to pay more for the music than the culinary complexity."}
      ]'::jsonb,
      10
    ),
    (
      'city:portugal:lisbon',
      'Nightlife',
      'Nightlife notes',
      array['Wine Bars', 'Kiosks', 'Rooftops', 'Electronic']::text[],
      '[
        {"label":"Districts","body":"Bairro Alto is the chaotic street-drinking hub; Cais do Sodre, especially Pink Street, is for late-night clubs; Principe Real is sophisticated, with upscale cocktail lounges and LGBT-friendly venues."},
        {"label":"Pacing","body":"Dinner rarely ends before 10 PM. The streets of Bairro Alto hit their peak around midnight, but the real clubs down by the river do not get going until 2 AM or 3 AM."},
        {"label":"Room type","body":"Open-air quiosques serving cheap beer and sangria in public squares, tiny wine bars squeezed into alleys, and massive riverside warehouses."}
      ]'::jsonb,
      20
    ),
    (
      'city:portugal:lisbon',
      'Culture',
      'Culture notes',
      array['Azulejos', 'Fado', 'Maritime History', 'Contemporary Art']::text[],
      '[
        {"label":"Clusters","body":"Alfama is the soul of Fado and Moorish history; Belem is the monument-heavy epicenter of the Age of Discovery; Parque das Nacoes is the hub for modern architecture and the oceanarium."},
        {"label":"Pairing","body":"Combine the grand monasteries of Belem with a mandatory stop for the original Pasteis de Belem, then take a breezy walk along the river to decompress."},
        {"label":"Scale","body":"Lisbon culture is tactile. You feel it in the steep calcada portuguesa, the cobblestone mosaics underfoot, and see it in the colorful azulejos covering ordinary residential buildings."}
      ]'::jsonb,
      30
    ),
    (
      'city:portugal:lisbon',
      'Stay',
      'Stay notes',
      array['Boutique Hotels', 'Guesthouses', 'River Views', 'Historic Apartments']::text[],
      '[
        {"label":"Location logic","body":"Baixa and Chiado are the flat, central hubs ideal for first-timers; Alfama is romantic but a labyrinth of steep stairs; Principe Real and Santo Antonio offer leafy, upscale tranquility."},
        {"label":"Pace","body":"Avoid booking a room in Bairro Alto or on Pink Street unless you plan to be part of the loud nightlife until 4 AM. Graca trades a steep uphill climb for incredible morning views and a quieter local feel."},
        {"label":"Sleep style","body":"Renovated palaces, charming local guesthouses (pensoes), and modern apartments solve different trips. Lisbon is the city of seven hills, so verify car access if you have heavy luggage; many historic streets are pedestrian-only stairs."}
      ]'::jsonb,
      40
    ),
    (
      'city:portugal:lisbon',
      'Nature',
      'Nature notes',
      array['Viewpoints', 'Riverfront', 'Beaches', 'Botanical Gardens']::text[],
      '[
        {"label":"Quiet","body":"The Estufa Fria greenhouse in Parque Eduardo VII is a lush, quiet escape right in the center. The botanical gardens in Principe Real offer massive shade trees and exotic plants."},
        {"label":"Season","body":"Summer is scorching and crowded, pushing locals out to the coastal beaches. Spring and autumn are ideal, with warm days and cool breezes rolling off the Atlantic."},
        {"label":"Edges","body":"The Tagus River (Tejo) provides miles of flat waterfront for walking or cycling. For actual wilderness, take a train to the forested, misty microclimate of Sintra or the surfing beaches of Cascais."}
      ]'::jsonb,
      50
    ),
    (
      'city:portugal:lisbon',
      'Activities',
      'Activity notes',
      array['Viewpoint Hopping', 'Surfing', 'Flea Markets', 'Trams']::text[],
      '[
        {"label":"Clusters","body":"Feira da Ladra, the Thieves Market, runs in Alfama on Tuesdays and Saturdays; LX Factory in Alcantara works for indie shops, street art, and Sunday markets."},
        {"label":"Queues","body":"Tram 28 is iconic but functions mostly as a crowded tourist ride; ride it extremely early or take Tram 12 instead. Jeronimos Monastery requires advance booking to avoid standing for hours in unshaded plazas."},
        {"label":"Energy","body":"Lisbon enforces a slower pace through its topography. Start at a high point, a miradouro, and walk down, using public elevators and funiculars when the incline becomes too much."}
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
    jsonb_build_object('source', 'lisbon_category_insight_seed')
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
    jsonb_build_object('source', 'lisbon_category_insight_seed')
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
  jsonb_build_object('source', 'lisbon_category_insight_seed')
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
      'city:portugal:lisbon',
      array[
        'https://www.visitlisboa.com/',
        'https://www.visitlisboa.com/en/c/food-drink',
        'https://www.visitlisboa.com/en/c/see-do',
        'https://www.visitportugal.com/en/destinos/lisboa-regiao',
        'https://www.metrolisboa.pt/en/'
      ]::text[]
    )
),
strength_seed(parent_legacy_id, category, rationale, scores) as (
  values
    (
      'city:portugal:lisbon',
      'Food',
      'General food usefulness across seafood, petiscos, pastelarias, bifanas, tascas, fado dinners, and central market access.',
      '{"chiado":8.8,"alfama":8.5,"baixa":8.2,"principe-real":8.0,"bairro-alto":7.8}'::jsonb
    ),
    (
      'city:portugal:lisbon',
      'Nightlife',
      'General nightlife strength across street drinking, wine bars, kiosks, rooftops, cocktail lounges, late clubs, and LGBT-friendly venues.',
      '{"bairro-alto":9.3,"principe-real":8.6,"chiado":8.0,"alfama":7.4,"baixa":6.8}'::jsonb
    ),
    (
      'city:portugal:lisbon',
      'Culture',
      'Culture strength across Fado, azulejos, Moorish streets, maritime history access, historic architecture, and contemporary art routes.',
      '{"alfama":9.4,"baixa":8.6,"chiado":8.5,"principe-real":7.8,"bairro-alto":7.4}'::jsonb
    ),
    (
      'city:portugal:lisbon',
      'Stay',
      'Stay usefulness across flat central access, romantic historic streets, nightlife noise, boutique hotels, guesthouses, river views, and luggage practicality.',
      '{"chiado":8.8,"baixa":8.7,"principe-real":8.5,"alfama":7.8,"bairro-alto":6.2}'::jsonb
    ),
    (
      'city:portugal:lisbon',
      'Nature',
      'Outdoor usefulness across viewpoints, shaded gardens, hill walks, riverfront access, Atlantic breezes, and day-trip launch points.',
      '{"principe-real":8.6,"alfama":8.4,"baixa":7.8,"chiado":7.4,"bairro-alto":7.0}'::jsonb
    ),
    (
      'city:portugal:lisbon',
      'Activities',
      'Activity strength across viewpoint hopping, markets, trams, funiculars, shopping streets, historic walks, and queue-heavy landmark logistics.',
      '{"alfama":8.9,"baixa":8.8,"chiado":8.4,"bairro-alto":8.0,"principe-real":7.8}'::jsonb
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
    on neighborhood_destination.legacy_id = 'neighborhood:portugal:lisbon:lisbon:' || score.key
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
  jsonb_build_object('source', 'lisbon_category_strength_seed')
from expanded_strengths
on conflict (parent_destination_id, neighborhood_destination_id, category, field_key) do update set
  score = excluded.score,
  rationale = excluded.rationale,
  source_urls = excluded.source_urls,
  source_metadata = public.destination_category_neighborhood_strengths.source_metadata || excluded.source_metadata,
  is_active = true,
  updated_at = now();
