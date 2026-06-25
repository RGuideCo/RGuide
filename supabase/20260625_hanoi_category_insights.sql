-- Seed Hanoi category notes and chips.
-- Hanoi does not currently have neighborhood destination records in geography.ts,
-- so category-level neighborhood strengths should be added after those records exist.

with seed_insights(destination_legacy_id, category, label, chips, notes, sort_order) as (
  values
    (
      'city:vietnam:vietnam-hanoi',
      'Food',
      'Food notes',
      array['Pho', 'Bun Cha', 'Street Food', 'Cafes', 'Bia Hoi']::text[],
      '[
        {"label":"Breakfast","body":"Steaming bowls of pho bo (beef noodle soup), banh mi from street carts, or banh cuon (steamed rice rolls) eaten on low plastic stools on the sidewalk."},
        {"label":"Lunch","body":"Bun cha at smoky midday joints, or com bin dan, rice with various side dishes, where workers crowd around fresh displays."},
        {"label":"Dinner","body":"Cha ca (turmeric fish with dill), hotpot (lau) shared over beers on the sidewalk, or the endless maze of night street food stalls in the Old Quarter."}
      ]'::jsonb,
      10
    ),
    (
      'city:vietnam:vietnam-hanoi',
      'Nightlife',
      'Nightlife notes',
      array['Bia Hoi', 'Cocktail Bars', 'Live Music', 'Night Markets']::text[],
      '[
        {"label":"Districts","body":"The Old Quarter is the epicenter of street-level drinking, especially around Ta Hien, Beer Street; Tay Ho, around West Lake, skews more international with cocktail bars and expat pubs; Ba Dinh is quieter and more upscale."},
        {"label":"Pacing","body":"Street nightlife wraps up relatively early due to local midnight curfews, though speakeasies and hidden clubs keep going. The night starts right at dusk with street-side eating and drinking."},
        {"label":"Room type","body":"Sidewalk plastic stools serving fresh bia hoi, hidden rooftop bars overlooking chaotic traffic, speakeasies tucked behind old shopfronts, and live jazz rooms."}
      ]'::jsonb,
      20
    ),
    (
      'city:vietnam:vietnam-hanoi',
      'Culture',
      'Culture notes',
      array['Temples', 'French Colonial', 'War History', 'Traditional Arts']::text[],
      '[
        {"label":"Clusters","body":"Ba Dinh holds the political and historical heavyweight sites, including the Ho Chi Minh Mausoleum and One Pillar Pagoda; the Old Quarter delivers ancient merchant history; the French Quarter features grand colonial architecture and the Opera House."},
        {"label":"Pairing","body":"Visit the Temple of Literature or the Ho Chi Minh Mausoleum complex early to beat the heat, then pair them with a late afternoon water puppet show or a gallery visit near Hoan Kiem Lake."},
        {"label":"Scale","body":"Hanoi culture is loud, sensory, and woven into daily life: communal temples hidden down residential alleys, incense burning on storefront sidewalks, and the chaotic ballet of motorbike traffic."}
      ]'::jsonb,
      30
    ),
    (
      'city:vietnam:vietnam-hanoi',
      'Stay',
      'Stay notes',
      array['Boutique Hotels', 'Homestays', 'Hostels', 'Heritage Stays']::text[],
      '[
        {"label":"Location logic","body":"The Old Quarter maximizes atmosphere, street food access, and chaos; the French Quarter offers high-end luxury and wider, quieter streets; Tay Ho, around West Lake, provides a breezy retreat away from the intense center."},
        {"label":"Pace","body":"Stay in the Old Quarter if you want to step directly into the action and noise. If you need quiet mornings and space to breathe, look for hotels on the outer edges of Ba Dinh or tucked deeper into the French Quarter."},
        {"label":"Sleep style","body":"French-colonial heritage hotels, narrow Old Quarter boutique stays with strong hospitality, and social hostels solve different trips. Traditional tube houses in the center can be narrow and lack windows in central rooms, so check the room layout when booking."}
      ]'::jsonb,
      40
    ),
    (
      'city:vietnam:vietnam-hanoi',
      'Nature',
      'Nature notes',
      array['Lakes', 'Urban Parks', 'Rivers', 'Day Trips']::text[],
      '[
        {"label":"Quiet","body":"Hoan Kiem Lake is the emotional heart of the city, perfect for early morning walks before traffic builds. Truc Bach and West Lake offer massive waterfront views and a much slower, breezier pace."},
        {"label":"Season","body":"Autumn and winter bring cooler, misty, atmospheric weather. Summer is intensely hot, humid, and prone to sudden torrential downpours that turn streets into temporary rivers."},
        {"label":"Edges","body":"Take a day trip out to the towering limestone peaks of Ninh Binh or the incense-making villages on the city limits to break up the intense concrete and motorbike density of the capital."}
      ]'::jsonb,
      50
    ),
    (
      'city:vietnam:vietnam-hanoi',
      'Activities',
      'Activity notes',
      array['Train Street', 'Cooking Classes', 'Markets', 'Cyclo Tours']::text[],
      '[
        {"label":"Clusters","body":"Dong Xuan Market works for intense wholesale shopping; the Hoan Kiem perimeter handles weekend pedestrian-only walking streets; Tay Ho is better for weekend artisan markets and lakeside cycling."},
        {"label":"Queues","body":"Train Street has strict safety regulations; you generally need to be escorted to a cafe seat by a local shop owner to watch the train pass. The Hoan Kiem lake path gets incredibly packed on weekend nights."},
        {"label":"Energy","body":"Hanoi is a high-stimulation city. Balance a frantic morning of crosswalks and markets with a long, slow afternoon hiding in a multi-story cafe with egg coffee or coconut coffee."}
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
    jsonb_build_object('source', 'hanoi_category_insight_seed')
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
    jsonb_build_object('source', 'hanoi_category_insight_seed')
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
  jsonb_build_object('source', 'hanoi_category_insight_seed')
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
