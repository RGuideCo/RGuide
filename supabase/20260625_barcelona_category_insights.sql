-- Seed Barcelona category notes and category-level neighborhood strengths.

with seed_insights(destination_legacy_id, category, label, chips, notes, sort_order) as (
  values
    (
      'city:spain:barcelona',
      'Food',
      'Food notes',
      array['Tapas', 'Catalan', 'Seafood', 'Paella']::text[],
      '[
        {"label":"Breakfast","body":"Cafes, churrerias for churros and thick chocolate, bakeries, and hearty esmorzar de forquilla (fork breakfast) near local markets like Sant Antoni."},
        {"label":"Lunch","body":"The menu del dia (daily menu) is the best value for a heavy, multi-course meal between 2 PM and 4 PM. Save paella for lunch, especially by the water in Barceloneta or Poblenou; locals rarely eat it for dinner."},
        {"label":"Dinner","body":"Classic bodegas, tapas bars, and modern Catalan dining. The clock shifts here: vermut hour sits around 7-8 PM, and locals generally do not sit down for dinner until 9 PM or 10 PM."}
      ]'::jsonb,
      10
    ),
    (
      'city:spain:barcelona',
      'Nightlife',
      'Nightlife notes',
      array['Vermuterias', 'Cocktail Bars', 'Beach Clubs', 'Indie/Electronic']::text[],
      '[
        {"label":"Districts","body":"El Born and the Gothic Quarter are a maze of stylish cocktail dens and wine bars; Gracia is perfect for casual beers in vibrant local squares; Poblenou handles the heavy industrial clubbing, including Razzmatazz."},
        {"label":"Pacing","body":"The night starts late and ends late. Dinner stretches to midnight, bars stay lively until 2 AM or 3 AM, and the major clubs will not truly hit their stride until 2:30 AM."},
        {"label":"Room type","body":"Standing-room-only historic bodegas with barrels of vermouth, sleek rooftop bars in Eixample, underground indie venues, and massive seaside clubs. Choose the energy before you choose the neighborhood."}
      ]'::jsonb,
      20
    ),
    (
      'city:spain:barcelona',
      'Culture',
      'Culture notes',
      array['Modernisme (Gaudi)', 'Medieval Streets', 'Contemporary Art', 'Local Plazas']::text[],
      '[
        {"label":"Clusters","body":"Eixample is the open-air museum of Modernist architecture, from Sagrada Familia to Casa Batllo; the Gothic Quarter holds the Roman and medieval core; El Raval brings a gritty, contemporary edge around MACBA."},
        {"label":"Pairing","body":"Book the heavy-hitters, especially the Gaudi sites, for early morning to beat the heat and crowds, then spend the afternoon wandering the shaded, narrow alleys of El Born or the Gothic Quarter."},
        {"label":"Scale","body":"Barcelona culture lives on the street. Look down at the famous panot flower tiles on the sidewalks, and look up at the wrought-iron balconies and intricate facades. The city itself is the exhibit."}
      ]'::jsonb,
      30
    ),
    (
      'city:spain:barcelona',
      'Stay',
      'Stay notes',
      array['Boutique Hotels', 'Eixample Apartments', 'Historic Quarters', 'Beachside']::text[],
      '[
        {"label":"Grid vs. Maze","body":"Eixample offers a logical grid, wide avenues, grand architecture, and central access. The old city, including the Gothic Quarter, El Born, and El Raval, offers romantic, winding alleys but can be noisy, dark, and difficult to navigate with luggage."},
        {"label":"Pace","body":"Avoid staying directly on La Rambla unless you love chaos. Gracia or Poble Sec offer a village-like, local feel with great food right outside your door; Poblenou provides a quieter, tech-meets-beach rhythm."},
        {"label":"Sleep style","body":"Modernisme-era boutique hotels, chic apartments with interior courtyard terraces, and high-end beach resorts solve different trips. If booking an apartment in the old city, verify elevator access and summer air conditioning."}
      ]'::jsonb,
      40
    ),
    (
      'city:spain:barcelona',
      'Nature',
      'Nature notes',
      array['Beaches', 'Hills', 'Urban Parks', 'Viewpoints']::text[],
      '[
        {"label":"Quiet","body":"Montjuic is a massive green hill with botanical gardens, museums, and quiet paths away from the dense city. Parc de la Ciutadella is the central social hub for picnics, slacklining, and outdoor music."},
        {"label":"Season","body":"Summer revolves around the Mediterranean, but Barceloneta gets packed. Bike farther north to Bogatell or Mar Bella for cleaner sand and more breathing room."},
        {"label":"Edges","body":"Escape the concrete by heading up to the Collserola hills around Tibidabo for hiking trails, or hike to the Bunkers del Carmel at sunset for sweeping, un-ticketed city views."}
      ]'::jsonb,
      50
    ),
    (
      'city:spain:barcelona',
      'Activities',
      'Activity notes',
      array['Architecture Tours', 'Markets', 'Beach Days', 'Shopping']::text[],
      '[
        {"label":"Clusters","body":"Passeig de Gracia handles luxury shopping and architecture; El Born is stronger for independent artisans, boutiques, and leather goods; the waterfront works for sailing, paddleboarding, and cycling."},
        {"label":"Queues","body":"Do not attempt to walk up to the Sagrada Familia or Park Guell; they sell out weeks in advance. Book these tickets before you even pack your bags."},
        {"label":"Energy","body":"The summer heat and density of the old city can be exhausting. Plan high-energy walking and touring for the morning, embrace a late lunch and a bit of downtime, and re-emerge when the sun dips."}
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
    jsonb_build_object('source', 'barcelona_category_insight_seed')
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
    jsonb_build_object('source', 'barcelona_category_insight_seed')
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
  jsonb_build_object('source', 'barcelona_category_insight_seed')
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
      'city:spain:barcelona',
      array[
        'https://www.barcelona.cat/en/',
        'https://www.barcelonaturisme.com/wv3/en/',
        'https://www.barcelona.cat/agenda/en',
        'https://www.tmb.cat/en/barcelona',
        'https://www.timeout.com/barcelona'
      ]::text[]
    )
),
strength_seed(parent_legacy_id, category, rationale, scores) as (
  values
    (
      'city:spain:barcelona',
      'Food',
      'General food usefulness across tapas, vermut, markets, Catalan dining, bodegas, lunch menus, and late dinner timing.',
      '{"el-born":8.8,"eixample":8.7,"gracia":8.4,"poble-sec":8.2,"gothic-quarter":7.6}'::jsonb
    ),
    (
      'city:spain:barcelona',
      'Nightlife',
      'General nightlife strength across cocktail bars, wine bars, vermuterias, casual plazas, indie venues, late pacing, and club access.',
      '{"el-born":8.8,"gracia":8.4,"gothic-quarter":8.0,"poble-sec":7.9,"eixample":7.4}'::jsonb
    ),
    (
      'city:spain:barcelona',
      'Culture',
      'Culture strength across Modernisme, Roman and medieval streets, contemporary art, architecture walks, plazas, and historic fabric.',
      '{"eixample":9.5,"gothic-quarter":9.0,"el-born":8.7,"poble-sec":8.1,"gracia":7.5}'::jsonb
    ),
    (
      'city:spain:barcelona',
      'Stay',
      'Stay usefulness across grid logic, old-city atmosphere, noise control, food access, boutique hotels, apartments, and practical arrival with luggage.',
      '{"eixample":9.0,"gracia":8.3,"el-born":8.0,"poble-sec":7.8,"gothic-quarter":6.8}'::jsonb
    ),
    (
      'city:spain:barcelona',
      'Nature',
      'Outdoor usefulness across Montjuic access, central parks, hillside routes, beach access by transit, viewpoints, and summer heat relief.',
      '{"poble-sec":8.8,"gothic-quarter":7.5,"el-born":7.4,"gracia":7.3,"eixample":6.8}'::jsonb
    ),
    (
      'city:spain:barcelona',
      'Activities',
      'Activity strength across architecture tours, markets, shopping, artisan streets, waterfront outings, and ticketed landmark logistics.',
      '{"eixample":9.2,"el-born":8.7,"gothic-quarter":8.4,"poble-sec":8.0,"gracia":7.7}'::jsonb
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
    on neighborhood_destination.legacy_id = 'neighborhood:spain:barcelona:barcelona:' || score.key
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
  jsonb_build_object('source', 'barcelona_category_strength_seed')
from expanded_strengths
on conflict (parent_destination_id, neighborhood_destination_id, category, field_key) do update set
  score = excluded.score,
  rationale = excluded.rationale,
  source_urls = excluded.source_urls,
  source_metadata = public.destination_category_neighborhood_strengths.source_metadata || excluded.source_metadata,
  is_active = true,
  updated_at = now();
