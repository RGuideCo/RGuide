-- Seed Miami category notes and category-level neighborhood strengths.

with seed_insights(destination_legacy_id, category, label, chips, notes, sort_order) as (
  values
    (
      'city:usa:miami',
      'Food',
      'Food notes',
      array['Cuban', 'Seafood', 'Fine Dining', 'Food Halls', 'Latin American']::text[],
      $json$[
        {"label":"Breakfast","body":"Cuban coffee, cafecito, from ventanitas, guava pastelitos, and trendy lingering brunch spots in South Beach or Wynwood."},
        {"label":"Lunch","body":"Heavy Cuban sandwiches in Little Havana, fresh ceviche, stone crabs when in season, and casual waterfront spots where docking a boat is an option."},
        {"label":"Dinner","body":"High-end steakhouses, vibrant Peruvian and pan-Latin fusion, and see-and-be-seen dining in Brickell and South Beach where the ambiance matters as much as the menu."}
      ]$json$::jsonb,
      10
    ),
    (
      'city:usa:miami',
      'Nightlife',
      'Nightlife notes',
      array['Mega-Clubs', 'Cocktail Lounges', 'Latin Dance', 'Dive Bars']::text[],
      $json$[
        {"label":"Districts","body":"South Beach is the historic hub for massive mega-clubs; Wynwood offers a younger, art-focused, slightly more casual bar scene; Brickell handles upscale rooftop lounges; Little Havana is the spot for live salsa and authentic Latin energy."},
        {"label":"Pacing","body":"Late, loud, and expensive. Clubs generally do not get going until 1 AM and run until 5 AM or later; some venues hold 24-hour liquor licenses. Dress codes are strictly enforced at major venues."},
        {"label":"Room type","body":"VIP table service at massive electronic clubs, laid-back outdoor patios with craft beer, or historic dive bars like Mac's Club Deuce. Choose your budget and wardrobe before choosing the neighborhood."}
      ]$json$::jsonb,
      20
    ),
    (
      'city:usa:miami',
      'Culture',
      'Culture notes',
      array['Art Deco', 'Street Art', 'Contemporary Galleries', 'Cuban Heritage']::text[],
      $json$[
        {"label":"Clusters","body":"Wynwood is the sprawling epicenter of street art, anchored by Wynwood Walls; the Design District handles high-end contemporary galleries and fashion; Miami Beach is the open-air museum for 1930s Art Deco architecture."},
        {"label":"Pairing","body":"Do the Art Deco walking tour early in the morning before the heat and humidity peak, then hit the air-conditioned Perez Art Museum Miami, PAMM, in the afternoon."},
        {"label":"Scale","body":"Miami culture is highly visual and aesthetic-driven. It is less about ancient history and more about vibrant modern expression, immigrant heritage, and flashy design."}
      ]$json$::jsonb,
      30
    ),
    (
      'city:usa:miami',
      'Stay',
      'Stay notes',
      array['Art Deco Boutique', 'Luxury High-Rises', 'Beach Resorts', 'Tropical Hideaways']::text[],
      $json$[
        {"label":"Location logic","body":"South Beach puts you in the middle of the party and tourist action; Mid-Beach offers quieter, more luxurious oceanfront resorts; Brickell and Downtown are best for a sleek, urban, high-rise experience."},
        {"label":"Pace","body":"South Beach, especially Ocean Drive, is chaotic and heavily trafficked. For a slower, more residential beach feel, go farther north to Surfside or Bal Harbour."},
        {"label":"Sleep style","body":"Neon-lit Art Deco motels, massive resort complexes with pool cabanas, and sleek urban condos solve different trips. Resort fees are almost universal here, so factor that hidden cost into your hotel budget."}
      ]$json$::jsonb,
      40
    ),
    (
      'city:usa:miami',
      'Nature',
      'Nature notes',
      array['Beaches', 'Everglades', 'Botanical Gardens', 'Biscayne Bay']::text[],
      $json$[
        {"label":"Quiet","body":"Fairchild Tropical Botanic Garden offers a massive, lush escape from the city. The Venetian Pool in Coral Gables provides a unique, historic freshwater swim away from the salty ocean."},
        {"label":"Season","body":"Summer is brutally hot, intensely humid, and brings daily afternoon thunderstorms, plus hurricane risk. The ideal season is winter, November to April, which is exactly why it gets crowded and expensive then."},
        {"label":"Edges","body":"Head west to the Everglades for airboat tours and alligator spotting, or drive out to Key Biscayne for calmer, family-friendly waters and the historic Cape Florida Lighthouse."}
      ]$json$::jsonb,
      50
    ),
    (
      'city:usa:miami',
      'Activities',
      'Activity notes',
      array['Boating', 'Shopping', 'Beach Clubs', 'Art Fairs']::text[],
      $json$[
        {"label":"Clusters","body":"Lincoln Road works for open-air pedestrian shopping; the Design District is for ultra-luxury brands; Calle Ocho in Little Havana gives you cigar shops, domino parks, and cultural walking tours."},
        {"label":"Queues","body":"Getting into top clubs or exclusive restaurants requires serious planning, reservations weeks in advance, or spending a lot of money. Traffic on the causeways between the mainland and the beach can be a major time-sink."},
        {"label":"Energy","body":"Miami runs on a mix of laid-back tropical time and high-adrenaline hustle. The heat dictates the day: stay near the water or in the AC during the afternoon, then embrace the flashy nightlife after sunset."}
      ]$json$::jsonb,
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
    jsonb_build_object('source', 'miami_category_insight_seed')
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
    lower(regexp_replace(translate(chip.label, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun'), '[^a-zA-Z0-9]+', '_', 'g')),
    chip.label,
    case when insight.category = 'Food' then 'cuisine' else 'subcategory' end,
    chip.label,
    (chip.sort_order::integer * 10),
    jsonb_build_object('source', 'miami_category_insight_seed')
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
  returning insight_id, chip_slug
),
deactivated_stale_chips as (
  update public.destination_category_insight_chips chip
  set
    is_active = false,
    updated_at = now()
  from upserted_insights insight
  join public.destinations destination on destination.id = insight.destination_id
  join seed_insights seed
    on seed.destination_legacy_id = destination.legacy_id
   and seed.category = insight.category
  where chip.insight_id = insight.id
    and chip.chip_slug not in (
      select lower(regexp_replace(translate(seed_chip.label, 'ÁÉÍÓÚÜÑáéíóúüñ', 'AEIOUUNaeiouun'), '[^a-zA-Z0-9]+', '_', 'g'))
      from unnest(seed.chips) as seed_chip(label)
    )
  returning chip.id
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
  jsonb_build_object('source', 'miami_category_insight_seed')
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
      'city:usa:miami',
      array[
        'https://www.miamiandbeaches.com/',
        'https://www.miamiandbeaches.com/things-to-do/eat-and-drink',
        'https://www.miamiandbeaches.com/things-to-do/nightlife',
        'https://www.miamiandbeaches.com/things-to-do/arts-and-culture',
        'https://mdpl.org/'
      ]::text[]
    )
),
strength_seed(parent_legacy_id, category, rationale, scores) as (
  values
    (
      'city:usa:miami',
      'Food',
      'General food usefulness across Cuban counters, seafood, fine dining, food halls, pan-Latin dining, brunch, cafecito, and waterfront meals.',
      '{"little-havana":9.3,"brickell":8.8,"design-district":8.5,"wynwood":8.4,"coconut-grove":7.9}'::jsonb
    ),
    (
      'city:usa:miami',
      'Nightlife',
      'General nightlife strength across mega-clubs, cocktail lounges, Latin dance, dive bars, rooftops, outdoor patios, and late-night logistics.',
      '{"wynwood":8.9,"brickell":8.8,"little-havana":8.6,"coconut-grove":7.5,"design-district":7.4}'::jsonb
    ),
    (
      'city:usa:miami',
      'Culture',
      'Culture strength across Art Deco routes, street art, contemporary galleries, Cuban heritage, design, fashion, and museum pairings.',
      '{"design-district":9.3,"wynwood":9.2,"little-havana":8.8,"coconut-grove":8.1,"brickell":7.5}'::jsonb
    ),
    (
      'city:usa:miami',
      'Stay',
      'Stay usefulness across luxury high-rises, beach access strategy, tropical hideaways, boutique hotels, traffic, resort-fee realities, and base logic.',
      '{"brickell":9.1,"coconut-grove":8.5,"wynwood":7.9,"design-district":7.8,"little-havana":7.2}'::jsonb
    ),
    (
      'city:usa:miami',
      'Nature',
      'Outdoor usefulness across Biscayne Bay access, botanical gardens, beach and Key Biscayne routing, Everglades day trips, shade, heat, and storm-season planning.',
      '{"coconut-grove":9.1,"brickell":7.7,"design-district":7.1,"wynwood":6.6,"little-havana":6.5}'::jsonb
    ),
    (
      'city:usa:miami',
      'Activities',
      'Activity strength across boating, shopping, beach clubs, art fairs, Calle Ocho walks, luxury browsing, causeway logistics, and neighborhood clustering.',
      '{"wynwood":9.0,"little-havana":8.9,"design-district":8.8,"brickell":8.2,"coconut-grove":8.1}'::jsonb
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
    on neighborhood_destination.legacy_id = 'neighborhood:usa:miami:miami:' || score.key
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
  jsonb_build_object('source', 'miami_category_strength_seed')
from expanded_strengths
on conflict (parent_destination_id, neighborhood_destination_id, category, field_key) do update set
  score = excluded.score,
  rationale = excluded.rationale,
  source_urls = excluded.source_urls,
  source_metadata = public.destination_category_neighborhood_strengths.source_metadata || excluded.source_metadata,
  is_active = true,
  updated_at = now();
