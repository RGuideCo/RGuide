-- Seed Copenhagen category notes and chips.
-- Copenhagen does not currently have neighborhood destination records in geography.ts,
-- so category-level neighborhood strengths should be added after those records exist.

with seed_insights(destination_legacy_id, category, label, chips, notes, sort_order) as (
  values
    (
      'city:denmark:copenhagen',
      'Food',
      'Food notes',
      array['Smørrebrød', 'New Nordic', 'Bakeries', 'Hot Dogs', 'Street Food']::text[],
      '[
        {"label":"Breakfast","body":"World-class cardamom buns and intricate pastries from legendary local bakeries, often with a line out the door by 8 AM, paired with third-wave coffee."},
        {"label":"Lunch","body":"Traditional smorrebrod, intricate open-faced sandwiches on dense rye bread, or a quick, cheap polser (Danish hot dog) from a street-side cart."},
        {"label":"Dinner","body":"Copenhagen runs from Michelin-starred New Nordic tasting menus to trendy neighborhood bistros in Vesterbro. In summer, Reffen offers a massive outdoor street food market on the water."}
      ]'::jsonb,
      10
    ),
    (
      'city:denmark:copenhagen',
      'Nightlife',
      'Nightlife notes',
      array['Meatpacking District', 'Bodegas', 'Craft Beer', 'Wine Bars']::text[],
      '[
        {"label":"Districts","body":"Vesterbro and Kodbyen, the Meatpacking District, are the hub for loud industrial restaurants that turn into clubs; Norrebro is the king of relaxed natural wine bars and cozy local spots; Indre By handles polished, high-end cocktails."},
        {"label":"Pacing","body":"Danes love a Friday bar right after work, which can spiral into a long night. Clubs stay open late, but casual drinking in parks or by the water is just as popular when the weather is good."},
        {"label":"Room type","body":"Smoky traditional bodegas, where cheap beer flows and smoking is often still allowed, sleek minimalist natural wine bars, or massive craft beer havens like Mikkeller."}
      ]'::jsonb,
      20
    ),
    (
      'city:denmark:copenhagen',
      'Culture',
      'Culture notes',
      array['Royal Palaces', 'Scandinavian Design', 'Fairy Tales', 'Cycling Culture']::text[],
      '[
        {"label":"Clusters","body":"Indre By holds the royal palaces, including Amalienborg and Christiansborg, plus classic museums; Christianshavn brings maritime history and the famous alternative Freetown Christiania; design museums and galleries are scattered through the center."},
        {"label":"Pairing","body":"Balance a heavy historical morning at Rosenborg Castle with a relaxed afternoon browsing modern Danish interior design shops or simply sitting by the harbor."},
        {"label":"Scale","body":"The city is incredibly compact and heavily designed for two wheels. Cycling is not just transit here; it is the primary cultural lens through which to experience Copenhagen."}
      ]'::jsonb,
      30
    ),
    (
      'city:denmark:copenhagen',
      'Stay',
      'Stay notes',
      array['Boutique Design', 'Meatpacking Edge', 'Historic Center', 'Neighborhood Vibe']::text[],
      '[
        {"label":"Location logic","body":"Indre By, the city center, is postcard-perfect for first-timers but can be tourist-heavy. Vesterbro offers grit, nightlife, and incredible food. Norrebro provides a multicultural, younger, and slightly more budget-friendly energy."},
        {"label":"Pace","body":"If you want a quiet, leafy, family-friendly retreat, look to Osterbro or Frederiksberg. If you want to be in the middle of the best restaurants and bars, stick to Vesterbro."},
        {"label":"Sleep style","body":"Expect sleek, minimalist Scandinavian design across the board, from eco-friendly hybrid hostels to ultra-luxurious historic hotels. Space can be tight in older buildings."}
      ]'::jsonb,
      40
    ),
    (
      'city:denmark:copenhagen',
      'Nature',
      'Nature notes',
      array['Harbor Baths', 'Historic Gardens', 'The Lakes', 'Tivoli']::text[],
      '[
        {"label":"Quiet","body":"The King''s Garden (Kongens Have) and Frederiksberg Gardens offer massive green escapes right in the city. Assistens Cemetery in Norrebro doubles as a tranquil, heavily used public park where Hans Christian Andersen is buried."},
        {"label":"Season","body":"Summer completely transforms the city: locals practically live outdoors, swimming in the clean harbor baths and lounging in parks. Winter is bitterly cold and dark, when indoor, candlelit hygge takes over."},
        {"label":"Edges","body":"Take a short train ride out to Dyrehaven, the Deer Park, for sprawling woodlands and roaming deer, or head to Amager Beach Park for sweeping sand and windsurfing."}
      ]'::jsonb,
      50
    ),
    (
      'city:denmark:copenhagen',
      'Activities',
      'Activity notes',
      array['Cycling', 'Canal Tours', 'Bakeries', 'Vintage Shopping']::text[],
      '[
        {"label":"Clusters","body":"Stroget handles mainstream flagship shopping; Jaegersborggade in Norrebro is better for independent boutiques, ceramics, and coffee; Nyhavn gives you the classic, though crowded, canal boat tours."},
        {"label":"Queues","body":"Tivoli Gardens gets incredibly busy, especially during summer weekends or the Christmas season, so buy skip-the-line tickets in advance. The most famous bakeries will require waiting in line."},
        {"label":"Energy","body":"Copenhagen runs on a highly efficient, relaxed energy. Rent a bike to truly see the city, but learn the hand signals first; Danish bike lanes function like highways and locals move fast."}
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
    jsonb_build_object('source', 'copenhagen_category_insight_seed')
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
    jsonb_build_object('source', 'copenhagen_category_insight_seed')
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
  jsonb_build_object('source', 'copenhagen_category_insight_seed')
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
