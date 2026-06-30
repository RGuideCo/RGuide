-- Seed Mexico City category notes and category-level neighborhood strengths.

with seed_insights(destination_legacy_id, category, label, chips, notes, sort_order) as (
  values
    (
      'city:mexico:mexico-city',
      'Food',
      'Food notes',
      array['Street Tacos', 'Fine Dining', 'Mezcal', 'Panaderías', 'Markets']::text[],
      $json$[
        {"label":"Breakfast","body":"Tamales from street-corner carts, chilaquiles at local cafes, pan dulce from historic panaderías, and hearty plates at Mercado de Coyoacán."},
        {"label":"Lunch","body":"Comida corrida, the set daily menu, at neighborhood fondas; seafood tostadas; and midday al pastor tacos. Lunch, la comida, is traditionally the heaviest meal of the day, eaten around 2 PM to 4 PM."},
        {"label":"Dinner","body":"World-class fine dining in Polanco or Roma, trendy contemporary Mexican bistros, and late-night street food stands that stay open well past midnight."}
      ]$json$::jsonb,
      10
    ),
    (
      'city:mexico:mexico-city',
      'Nightlife',
      'Nightlife notes',
      array['Mezcalerias', 'Cantinas', 'Lucha Libre', 'Speakeasies']::text[],
      $json$[
        {"label":"Districts","body":"Roma and Condesa are the epicenters of chic cocktail bars and mezcalerias; Polanco is for upscale, exclusive clubs; Centro Histórico offers the best traditional cantinas."},
        {"label":"Pacing","body":"Nightlife starts late and runs late. Traditional cantinas are more of a daytime or early-evening affair, ideal for afternoon drinking with free snacks."},
        {"label":"Room type","body":"Swinging-door historic cantinas, hidden speakeasies behind unassuming taco shops, raucous Friday nights at Arena México for Lucha Libre, and sleek rooftops. Choose your energy before crossing town."}
      ]$json$::jsonb,
      20
    ),
    (
      'city:mexico:mexico-city',
      'Culture',
      'Culture notes',
      array['Mesoamerican Ruins', 'Murals', 'Anthropology', 'Historic Plazas']::text[],
      $json$[
        {"label":"Clusters","body":"Centro Histórico holds the Aztec Templo Mayor and massive colonial cathedrals; Chapultepec Park houses the world-class National Museum of Anthropology; Coyoacán is the hub for Frida Kahlo and Diego Rivera."},
        {"label":"Pairing","body":"Pair the heavy, hours-long Anthropology Museum with a relaxed walk through Chapultepec Park. If heading out to the Teotihuacán pyramids, go early in the morning to beat the afternoon sun and crowds."},
        {"label":"Scale","body":"Culture here is a literal layering of history. The city is sinking because colonial structures were built directly over the lakes and ruins of the Aztec capital."}
      ]$json$::jsonb,
      30
    ),
    (
      'city:mexico:mexico-city',
      'Stay',
      'Stay notes',
      array['Leafy Neighborhoods', 'Historic Centro', 'Boutique Art Deco', 'Polanco Luxury']::text[],
      $json$[
        {"label":"Location logic","body":"Roma and Condesa are highly walkable, tree-lined, safe, and packed with cafes; Polanco is the wealthy, manicured luxury district; Centro Histórico is historically dense but extremely noisy and chaotic."},
        {"label":"Pace","body":"Choose Condesa or Roma for slow, dog-walking mornings and a neighborhood feel. Avoid staying in the Zócalo area if you want quiet nights and easy Uber pickups, as traffic gets heavily gridlocked."},
        {"label":"Sleep style","body":"Art Deco boutique hotels, massive luxury chains, and lush apartment rentals with rooftop terraces solve different trips. The city sits at over 7,300 feet, or 2,240 meters, of elevation; altitude and air pollution can affect sleep the first few days."}
      ]$json$::jsonb,
      40
    ),
    (
      'city:mexico:mexico-city',
      'Nature',
      'Nature notes',
      array['Chapultepec', 'Ancient Canals', 'Urban Parks', 'Volcano Day Trips']::text[],
      $json$[
        {"label":"Quiet","body":"Parque México and Parque España in Condesa are lush social hubs, but the massive Bosque de Chapultepec, twice the size of Central Park, is where you actually escape the concrete and smog."},
        {"label":"Season","body":"The rainy season, roughly May to October, brings intense, predictable afternoon downpours. Plan outdoor walking and pyramid tours for the morning, and save museums for the afternoon."},
        {"label":"Edges","body":"Head south to Xochimilco to float down the remaining Aztec canals on colorful trajineras, or take a day trip to the edges of the Popocatépetl and Iztaccíhuatl volcanoes."}
      ]$json$::jsonb,
      50
    ),
    (
      'city:mexico:mexico-city',
      'Activities',
      'Activity notes',
      array['Markets', 'Lucha Libre', 'Artisan Crafts', 'Street Food Tours']::text[],
      $json$[
        {"label":"Clusters","body":"Mercado de San Juan works for unusual ingredients; Mercado de Artesanías La Ciudadela is the practical stop for textiles and souvenirs; the Zócalo gives the city its monumental scale and constant street theater."},
        {"label":"Queues","body":"The Frida Kahlo Museum, Casa Azul, in Coyoacán requires tickets booked weeks in advance. Do not expect to just walk up to the door."},
        {"label":"Energy","body":"The scale, altitude, and traffic of CDMX drain energy faster than expected. Take it slow, use the Metro to bypass rush-hour gridlock, and embrace the long afternoon lunch to recharge."}
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
    jsonb_build_object('source', 'mexico_city_category_insight_seed')
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
    jsonb_build_object('source', 'mexico_city_category_insight_seed')
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
  jsonb_build_object('source', 'mexico_city_category_insight_seed')
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
      'city:mexico:mexico-city',
      array[
        'https://mexicocity.cdmx.gob.mx/',
        'https://www.metro.cdmx.gob.mx/',
        'https://mna.inah.gob.mx/',
        'https://www.museofridakahlo.org.mx/'
      ]::text[]
    )
),
strength_seed(parent_legacy_id, category, rationale, scores) as (
  values
    (
      'city:mexico:mexico-city',
      'Food',
      'General food usefulness across street tacos, fine dining, mezcal, panaderías, markets, fondas, seafood tostadas, and late-night stands.',
      '{"roma-norte":9.4,"la-condesa":8.8,"polanco":8.7,"centro-historico":8.6,"coyoacan":8.2,"juarez":8.0}'::jsonb
    ),
    (
      'city:mexico:mexico-city',
      'Nightlife',
      'General nightlife strength across mezcalerias, cocktail bars, traditional cantinas, Lucha Libre, speakeasies, rooftops, and late-night logistics.',
      '{"roma-norte":9.3,"la-condesa":9.0,"juarez":8.7,"centro-historico":8.4,"polanco":8.2,"coyoacan":7.0}'::jsonb
    ),
    (
      'city:mexico:mexico-city',
      'Culture',
      'Culture strength across Mesoamerican ruins, murals, anthropology, historic plazas, Frida Kahlo and Diego Rivera sites, and layered colonial-Aztec history.',
      '{"centro-historico":9.7,"polanco":9.3,"coyoacan":9.2,"roma-norte":8.2,"juarez":7.9,"la-condesa":7.6}'::jsonb
    ),
    (
      'city:mexico:mexico-city',
      'Stay',
      'Stay usefulness across leafy neighborhood bases, historic Centro, boutique Art Deco hotels, Polanco luxury, walkability, traffic, noise, and easy pickup logistics.',
      '{"roma-norte":9.3,"la-condesa":9.2,"polanco":8.8,"juarez":8.3,"centro-historico":7.6,"coyoacan":7.4}'::jsonb
    ),
    (
      'city:mexico:mexico-city',
      'Nature',
      'Outdoor usefulness across Chapultepec, Condesa parks, ancient canals, urban shade, museum-and-park pairings, and day-trip routes toward volcano landscapes.',
      '{"polanco":9.1,"la-condesa":8.6,"coyoacan":8.2,"roma-norte":7.6,"centro-historico":6.8,"juarez":6.5}'::jsonb
    ),
    (
      'city:mexico:mexico-city',
      'Activities',
      'Activity strength across markets, Lucha Libre, artisan crafts, street food tours, Casa Azul logistics, Zócalo scale, and neighborhood clustering.',
      '{"centro-historico":9.2,"roma-norte":8.9,"coyoacan":8.8,"polanco":8.4,"la-condesa":8.3,"juarez":8.0}'::jsonb
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
    on neighborhood_destination.legacy_id = 'neighborhood:mexico:mexico-city:mexico-city:' || score.key
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
  jsonb_build_object('source', 'mexico_city_category_strength_seed')
from expanded_strengths
on conflict (parent_destination_id, neighborhood_destination_id, category, field_key) do update set
  score = excluded.score,
  rationale = excluded.rationale,
  source_urls = excluded.source_urls,
  source_metadata = public.destination_category_neighborhood_strengths.source_metadata || excluded.source_metadata,
  is_active = true,
  updated_at = now();
