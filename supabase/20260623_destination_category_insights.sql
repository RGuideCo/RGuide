-- Store destination/category notes and researched neighborhood strengths.
--
-- These tables keep left-pane category guidance editable independently of
-- guide publishing. A row can be attached to a city or a neighborhood through
-- `destinations.id`; neighborhood rankings are parent-destination to child-
-- neighborhood records so category strength can be researched and sourced.

create table if not exists public.destination_category_insights (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid not null references public.destinations(id) on delete cascade,
  category text not null,
  locale text not null default 'en',
  label text,
  summary text,
  sort_order integer not null default 100 check (sort_order >= 0),
  source_type text not null default 'editorial',
  source_metadata jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint destination_category_insights_category_check check (
    category in ('Food', 'Nightlife', 'Nature', 'Culture', 'Stay', 'Activities', 'Routes', 'Essentials')
  ),
  constraint destination_category_insights_locale_not_blank check (btrim(locale) <> ''),
  unique (destination_id, category, locale)
);

drop trigger if exists destination_category_insights_set_updated_at on public.destination_category_insights;
create trigger destination_category_insights_set_updated_at
before update on public.destination_category_insights
for each row
execute function public.set_updated_at();

create table if not exists public.destination_category_insight_chips (
  id uuid primary key default gen_random_uuid(),
  insight_id uuid not null references public.destination_category_insights(id) on delete cascade,
  chip_slug text not null,
  label text not null,
  filter_kind text not null default 'subcategory',
  filter_value text not null,
  sort_order integer not null default 100 check (sort_order >= 0),
  is_active boolean not null default true,
  source_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint destination_category_insight_chips_kind_check check (
    filter_kind in ('subcategory', 'cuisine', 'attribute', 'freeform')
  ),
  constraint destination_category_insight_chips_slug_not_blank check (btrim(chip_slug) <> ''),
  constraint destination_category_insight_chips_label_not_blank check (btrim(label) <> ''),
  constraint destination_category_insight_chips_value_not_blank check (btrim(filter_value) <> ''),
  unique (insight_id, chip_slug)
);

drop trigger if exists destination_category_insight_chips_set_updated_at on public.destination_category_insight_chips;
create trigger destination_category_insight_chips_set_updated_at
before update on public.destination_category_insight_chips
for each row
execute function public.set_updated_at();

create table if not exists public.destination_category_insight_notes (
  id uuid primary key default gen_random_uuid(),
  insight_id uuid not null references public.destination_category_insights(id) on delete cascade,
  note_key text not null,
  label text,
  body text not null,
  sort_order integer not null default 100 check (sort_order >= 0),
  is_active boolean not null default true,
  source_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint destination_category_insight_notes_key_not_blank check (btrim(note_key) <> ''),
  constraint destination_category_insight_notes_body_not_blank check (btrim(body) <> ''),
  unique (insight_id, note_key)
);

drop trigger if exists destination_category_insight_notes_set_updated_at on public.destination_category_insight_notes;
create trigger destination_category_insight_notes_set_updated_at
before update on public.destination_category_insight_notes
for each row
execute function public.set_updated_at();

create table if not exists public.destination_category_neighborhood_strengths (
  id uuid primary key default gen_random_uuid(),
  parent_destination_id uuid not null references public.destinations(id) on delete cascade,
  neighborhood_destination_id uuid not null references public.destinations(id) on delete cascade,
  category text not null,
  field_key text not null default 'default',
  score numeric(4,2) not null,
  rationale text,
  source_urls text[] not null default '{}',
  source_type text not null default 'editorial_research',
  source_metadata jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint destination_category_neighborhood_strengths_category_check check (
    category in ('Food', 'Nightlife', 'Nature', 'Culture', 'Stay', 'Activities', 'Routes', 'Essentials')
  ),
  constraint destination_category_neighborhood_strengths_field_key_not_blank check (btrim(field_key) <> ''),
  constraint destination_category_neighborhood_strengths_score_check check (score >= 0 and score <= 10),
  unique (parent_destination_id, neighborhood_destination_id, category, field_key)
);

drop trigger if exists destination_category_neighborhood_strengths_set_updated_at on public.destination_category_neighborhood_strengths;
create trigger destination_category_neighborhood_strengths_set_updated_at
before update on public.destination_category_neighborhood_strengths
for each row
execute function public.set_updated_at();

create index if not exists destination_category_insights_destination_idx
on public.destination_category_insights (destination_id, is_active, category, locale, sort_order);

create index if not exists destination_category_insight_chips_insight_idx
on public.destination_category_insight_chips (insight_id, is_active, sort_order);

create index if not exists destination_category_insight_notes_insight_idx
on public.destination_category_insight_notes (insight_id, is_active, sort_order);

create index if not exists destination_category_neighborhood_strengths_parent_idx
on public.destination_category_neighborhood_strengths (parent_destination_id, category, field_key, is_active);

create index if not exists destination_category_neighborhood_strengths_child_idx
on public.destination_category_neighborhood_strengths (neighborhood_destination_id, category, is_active);

create or replace function public.validate_destination_category_neighborhood_strength()
returns trigger
language plpgsql
as $$
declare
  parent_scope public.destination_scope;
  child_scope public.destination_scope;
begin
  select scope into parent_scope
  from public.destinations
  where id = new.parent_destination_id;

  select scope into child_scope
  from public.destinations
  where id = new.neighborhood_destination_id;

  if parent_scope is null then
    raise exception 'parent_destination_id % does not reference a destination', new.parent_destination_id;
  end if;

  if child_scope is null then
    raise exception 'neighborhood_destination_id % does not reference a destination', new.neighborhood_destination_id;
  end if;

  if parent_scope not in ('city'::public.destination_scope, 'neighborhood'::public.destination_scope) then
    raise exception 'parent destination for category neighborhood strength must be city or neighborhood, got %', parent_scope;
  end if;

  if child_scope <> 'neighborhood'::public.destination_scope then
    raise exception 'category strength child destination must be a neighborhood, got %', child_scope;
  end if;

  return new;
end;
$$;

drop trigger if exists destination_category_neighborhood_strengths_validate_destinations
on public.destination_category_neighborhood_strengths;
create trigger destination_category_neighborhood_strengths_validate_destinations
before insert or update of parent_destination_id, neighborhood_destination_id
on public.destination_category_neighborhood_strengths
for each row
execute function public.validate_destination_category_neighborhood_strength();

alter table public.destination_category_insights enable row level security;
alter table public.destination_category_insight_chips enable row level security;
alter table public.destination_category_insight_notes enable row level security;
alter table public.destination_category_neighborhood_strengths enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'destination_category_insights'
      and policyname = 'Active destination category insights are readable'
  ) then
    create policy "Active destination category insights are readable"
    on public.destination_category_insights
    for select
    using (
      is_active = true
      and exists (
        select 1
        from public.destinations destination
        where destination.id = destination_category_insights.destination_id
          and destination.is_published = true
      )
    );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'destination_category_insight_chips'
      and policyname = 'Active destination category insight chips are readable'
  ) then
    create policy "Active destination category insight chips are readable"
    on public.destination_category_insight_chips
    for select
    using (
      is_active = true
      and exists (
        select 1
        from public.destination_category_insights insight
        join public.destinations destination on destination.id = insight.destination_id
        where insight.id = destination_category_insight_chips.insight_id
          and insight.is_active = true
          and destination.is_published = true
      )
    );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'destination_category_insight_notes'
      and policyname = 'Active destination category insight notes are readable'
  ) then
    create policy "Active destination category insight notes are readable"
    on public.destination_category_insight_notes
    for select
    using (
      is_active = true
      and exists (
        select 1
        from public.destination_category_insights insight
        join public.destinations destination on destination.id = insight.destination_id
        where insight.id = destination_category_insight_notes.insight_id
          and insight.is_active = true
          and destination.is_published = true
      )
    );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'destination_category_neighborhood_strengths'
      and policyname = 'Active destination category neighborhood strengths are readable'
  ) then
    create policy "Active destination category neighborhood strengths are readable"
    on public.destination_category_neighborhood_strengths
    for select
    using (
      is_active = true
      and exists (
        select 1
        from public.destinations parent_destination
        join public.destinations neighborhood_destination
          on neighborhood_destination.id = destination_category_neighborhood_strengths.neighborhood_destination_id
        where parent_destination.id = destination_category_neighborhood_strengths.parent_destination_id
          and parent_destination.is_published = true
          and neighborhood_destination.is_published = true
      )
    );
  end if;
end;
$$;

create or replace view public.active_destination_category_insights
with (security_invoker = true) as
select
  insight.id,
  insight.destination_id,
  destination.legacy_id as destination_legacy_id,
  destination.slug as destination_slug,
  destination.name as destination_name,
  destination.scope as destination_scope,
  destination.parent_id,
  parent_destination.legacy_id as parent_destination_legacy_id,
  insight.category,
  insight.locale,
  insight.label,
  insight.summary,
  coalesce(chip_agg.chips, '[]'::jsonb) as chips,
  coalesce(note_agg.notes, '[]'::jsonb) as notes,
  insight.sort_order,
  insight.source_type,
  insight.source_metadata,
  insight.updated_at
from public.destination_category_insights insight
join public.destinations destination on destination.id = insight.destination_id
left join public.destinations parent_destination on parent_destination.id = destination.parent_id
left join lateral (
  select jsonb_agg(
    jsonb_build_object(
      'slug', chip.chip_slug,
      'label', chip.label,
      'filterKind', chip.filter_kind,
      'filterValue', chip.filter_value
    )
    order by chip.sort_order, chip.label
  ) as chips
  from public.destination_category_insight_chips chip
  where chip.insight_id = insight.id
    and chip.is_active = true
) chip_agg on true
left join lateral (
  select jsonb_agg(
    jsonb_build_object(
      'key', note.note_key,
      'label', note.label,
      'body', note.body
    )
    order by note.sort_order, note.label
  ) as notes
  from public.destination_category_insight_notes note
  where note.insight_id = insight.id
    and note.is_active = true
) note_agg on true
where insight.is_active = true
  and destination.is_published = true;

create or replace view public.active_destination_category_neighborhood_strengths
with (security_invoker = true) as
select
  strength.id,
  strength.parent_destination_id,
  parent_destination.legacy_id as parent_destination_legacy_id,
  parent_destination.slug as parent_destination_slug,
  parent_destination.name as parent_destination_name,
  strength.neighborhood_destination_id,
  neighborhood_destination.legacy_id as neighborhood_destination_legacy_id,
  neighborhood_destination.slug as neighborhood_destination_slug,
  neighborhood_destination.name as neighborhood_destination_name,
  strength.category,
  strength.field_key,
  strength.score,
  strength.rationale,
  strength.source_urls,
  strength.source_type,
  strength.source_metadata,
  strength.updated_at
from public.destination_category_neighborhood_strengths strength
join public.destinations parent_destination on parent_destination.id = strength.parent_destination_id
join public.destinations neighborhood_destination on neighborhood_destination.id = strength.neighborhood_destination_id
where strength.is_active = true
  and parent_destination.is_published = true
  and neighborhood_destination.is_published = true;

-- Seed the Tokyo prototype so the current UI copy/ranking can be migrated into
-- the normalized content layer once this migration runs against a populated DB.
with seed_insights(destination_legacy_id, category, label, chips, notes, sort_order) as (
  values
    (
      'city:japan:tokyo',
      'Food',
      'Food notes',
      array['Sushi', 'Ramen', 'Izakaya', 'Japanese']::text[],
      '[
        {"label":"Breakfast","body":"Coffee shops, kissaten, bakeries, onigiri counters, and early ramen or fish breakfasts near markets and stations."},
        {"label":"Lunch","body":"Ramen, sushi sets, curry, soba, depachika food halls, and quick counters where turnover is part of the appeal."},
        {"label":"Dinner","body":"Izakaya, omakase, yakitori, tonkatsu, reservation rooms, and neighborhood counters that work better when the night has a lane."}
      ]'::jsonb,
      10
    ),
    (
      'city:japan:tokyo',
      'Nightlife',
      'Nightlife notes',
      array['Live Music', 'Late Night', 'Rooftops', 'Bars']::text[],
      '[
        {"label":"Districts","body":"Shinjuku and Shibuya carry the broadest night energy; Roppongi skews international and clubby; Ginza is better for polished cocktail rooms."},
        {"label":"Last train","body":"Tokyo nights are train-shaped until they are not. Keep late plans in one district unless the group is comfortable with taxis."},
        {"label":"Room type","body":"Tiny bars, izakaya, karaoke, jazz rooms, clubs, and hotel lounges are different nights. Pick the room type before the neighborhood."}
      ]'::jsonb,
      20
    ),
    (
      'city:japan:tokyo',
      'Culture',
      'Culture notes',
      array['Museums', 'Architecture', 'Galleries', 'Historic Streets']::text[],
      '[
        {"label":"Clusters","body":"Ueno handles museum density, Roppongi handles design and contemporary art, Asakusa handles old-city texture, and Harajuku/Omotesando handles youth and style."},
        {"label":"Pairing","body":"Temples and gardens work best early; museums and shopping streets are better as weatherproof anchors later in the day."},
        {"label":"Scale","body":"Tokyo culture is often a district mood, not only a landmark. Leave time for station exits, side streets, and small retail rituals."}
      ]'::jsonb,
      30
    ),
    (
      'city:japan:tokyo',
      'Stay',
      'Stay notes',
      array['Hotels', 'Hostels', 'Design Stays', 'Transit Bases']::text[],
      '[
        {"label":"Rail logic","body":"Choose the base by the line you will repeat: Shinjuku for west-side reach, Shibuya for nightlife and shopping, Ginza/Tokyo Station for polish and transit."},
        {"label":"Pace","body":"Asakusa and Ueno trade late-night energy for value and old-town mornings; Roppongi gives central nights and museums at higher prices."},
        {"label":"Sleep style","body":"Capsules, hostels, business hotels, design hotels, and ryokan-style rooms solve different trips. Compare the room type before the neighborhood."}
      ]'::jsonb,
      40
    ),
    (
      'city:japan:tokyo',
      'Nature',
      'Nature notes',
      array['Viewpoints', 'Parks', 'Waterfront', 'Easy Walks']::text[],
      '[
        {"label":"Quiet","body":"Shrine groves, gardens, rivers, and parks are the reset button between station-heavy routes, especially around Meiji Jingu, Ueno, and the bay."},
        {"label":"Season","body":"Cherry blossom, foliage, humidity, rain, and sunset matter more than distance. A nearby garden can beat a famous view on the wrong day."},
        {"label":"Edges","body":"Use waterfronts, canal walks, and mountain day trips when the city feels too dense, but build the return route before committing."}
      ]'::jsonb,
      50
    ),
    (
      'city:japan:tokyo',
      'Activities',
      'Activity notes',
      array['Top Picks', 'Tours', 'Shopping', 'Wellness']::text[],
      '[
        {"label":"Station clusters","body":"Tokyo activities work best by station cluster: Shibuya/Harajuku, Ueno/Asakusa, Ginza/Tsukiji, Shinjuku, or Roppongi/Akasaka."},
        {"label":"Queues","body":"Popular shops, cafes, observatories, and character stops can eat the day. Keep one flexible backup within the same area."},
        {"label":"Energy","body":"Mix one high-stimulation area with one calmer pause. Tokyo gets better when the day has pressure valves."}
      ]'::jsonb,
      60
    ),
    (
      'city:japan:tokyo',
      'Routes',
      'Route notes',
      array['Walking Loops', 'Transit Hops', 'Scenic Links', 'Day Plans']::text[],
      '[
        {"label":"Line first","body":"Build around a rail spine or adjacent districts. A clean Yamanote or subway arc beats a prettier list that zigzags across the map."},
        {"label":"Transfer cost","body":"Every transfer adds stairs, exits, and orientation. Keep meals and shops near the same station when the route is already dense."}
      ]'::jsonb,
      70
    ),
    (
      'city:japan:tokyo',
      'Essentials',
      'Essential notes',
      array['Arrival', 'Transit', 'Money', 'Safety']::text[],
      '[
        {"label":"Transit","body":"IC cards, last trains, station exits, and luggage routes shape the trip more than most first-time visitors expect."},
        {"label":"Cash","body":"Tokyo is card-friendly but not card-only. Small restaurants, bars, ticket machines, and older shops can still reward cash."},
        {"label":"Booking","body":"Reserve small restaurants early, watch closed days, and do not assume a famous room accepts walk-ins just because it is on the map."}
      ]'::jsonb,
      80
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
    jsonb_build_object('source', 'tokyo_category_insight_prototype_seed')
  from seed_insights seed
  join public.destinations destination on destination.legacy_id = seed.destination_legacy_id
  on conflict (destination_id, category, locale) do update set
    label = excluded.label,
    sort_order = excluded.sort_order,
    source_metadata = public.destination_category_insights.source_metadata || excluded.source_metadata,
    is_active = true,
    updated_at = now()
  returning id, destination_id, category, locale
)
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
  chip.sort_order::integer,
  jsonb_build_object('source', 'tokyo_category_insight_prototype_seed')
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
  updated_at = now();

with seed_insights(destination_legacy_id, category, notes) as (
  values
    ('city:japan:tokyo', 'Food', '[
      {"label":"Breakfast","body":"Coffee shops, kissaten, bakeries, onigiri counters, and early ramen or fish breakfasts near markets and stations."},
      {"label":"Lunch","body":"Ramen, sushi sets, curry, soba, depachika food halls, and quick counters where turnover is part of the appeal."},
      {"label":"Dinner","body":"Izakaya, omakase, yakitori, tonkatsu, reservation rooms, and neighborhood counters that work better when the night has a lane."}
    ]'::jsonb),
    ('city:japan:tokyo', 'Nightlife', '[
      {"label":"Districts","body":"Shinjuku and Shibuya carry the broadest night energy; Roppongi skews international and clubby; Ginza is better for polished cocktail rooms."},
      {"label":"Last train","body":"Tokyo nights are train-shaped until they are not. Keep late plans in one district unless the group is comfortable with taxis."},
      {"label":"Room type","body":"Tiny bars, izakaya, karaoke, jazz rooms, clubs, and hotel lounges are different nights. Pick the room type before the neighborhood."}
    ]'::jsonb),
    ('city:japan:tokyo', 'Culture', '[
      {"label":"Clusters","body":"Ueno handles museum density, Roppongi handles design and contemporary art, Asakusa handles old-city texture, and Harajuku/Omotesando handles youth and style."},
      {"label":"Pairing","body":"Temples and gardens work best early; museums and shopping streets are better as weatherproof anchors later in the day."},
      {"label":"Scale","body":"Tokyo culture is often a district mood, not only a landmark. Leave time for station exits, side streets, and small retail rituals."}
    ]'::jsonb),
    ('city:japan:tokyo', 'Stay', '[
      {"label":"Rail logic","body":"Choose the base by the line you will repeat: Shinjuku for west-side reach, Shibuya for nightlife and shopping, Ginza/Tokyo Station for polish and transit."},
      {"label":"Pace","body":"Asakusa and Ueno trade late-night energy for value and old-town mornings; Roppongi gives central nights and museums at higher prices."},
      {"label":"Sleep style","body":"Capsules, hostels, business hotels, design hotels, and ryokan-style rooms solve different trips. Compare the room type before the neighborhood."}
    ]'::jsonb),
    ('city:japan:tokyo', 'Nature', '[
      {"label":"Quiet","body":"Shrine groves, gardens, rivers, and parks are the reset button between station-heavy routes, especially around Meiji Jingu, Ueno, and the bay."},
      {"label":"Season","body":"Cherry blossom, foliage, humidity, rain, and sunset matter more than distance. A nearby garden can beat a famous view on the wrong day."},
      {"label":"Edges","body":"Use waterfronts, canal walks, and mountain day trips when the city feels too dense, but build the return route before committing."}
    ]'::jsonb),
    ('city:japan:tokyo', 'Activities', '[
      {"label":"Station clusters","body":"Tokyo activities work best by station cluster: Shibuya/Harajuku, Ueno/Asakusa, Ginza/Tsukiji, Shinjuku, or Roppongi/Akasaka."},
      {"label":"Queues","body":"Popular shops, cafes, observatories, and character stops can eat the day. Keep one flexible backup within the same area."},
      {"label":"Energy","body":"Mix one high-stimulation area with one calmer pause. Tokyo gets better when the day has pressure valves."}
    ]'::jsonb),
    ('city:japan:tokyo', 'Routes', '[
      {"label":"Line first","body":"Build around a rail spine or adjacent districts. A clean Yamanote or subway arc beats a prettier list that zigzags across the map."},
      {"label":"Transfer cost","body":"Every transfer adds stairs, exits, and orientation. Keep meals and shops near the same station when the route is already dense."}
    ]'::jsonb),
    ('city:japan:tokyo', 'Essentials', '[
      {"label":"Transit","body":"IC cards, last trains, station exits, and luggage routes shape the trip more than most first-time visitors expect."},
      {"label":"Cash","body":"Tokyo is card-friendly but not card-only. Small restaurants, bars, ticket machines, and older shops can still reward cash."},
      {"label":"Booking","body":"Reserve small restaurants early, watch closed days, and do not assume a famous room accepts walk-ins just because it is on the map."}
    ]'::jsonb)
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
  note.sort_order::integer,
  jsonb_build_object('source', 'tokyo_category_insight_prototype_seed')
from seed_insights seed
join public.destinations destination on destination.legacy_id = seed.destination_legacy_id
join public.destination_category_insights insight
  on insight.destination_id = destination.id
 and insight.category = seed.category
 and insight.locale = 'en'
cross join lateral jsonb_array_elements(seed.notes) with ordinality as note(value, sort_order)
where nullif(note.value ->> 'body', '') is not null
on conflict (insight_id, note_key) do update set
  label = excluded.label,
  body = excluded.body,
  sort_order = excluded.sort_order,
  source_metadata = public.destination_category_insight_notes.source_metadata || excluded.source_metadata,
  is_active = true,
  updated_at = now();

with field_seed(field_key, rationale, scores, source_urls) as (
  values
    (
      'default',
      'General nightlife strength across bar density, late districts, visitor usefulness, and range of night formats.',
      '{"shinjuku":9.4,"shibuya":9,"roppongi":8.6,"ginza":6.4,"asakusa":4}'::jsonb,
      array[
        'https://www.gotokyo.org/en/destinations/western-tokyo/shinjuku/index.html',
        'https://www.gotokyo.org/en/destinations/western-tokyo/shibuya/index.html',
        'https://www.gotokyo.org/en/destinations/southern-tokyo/roppongi/index.html',
        'https://www.gotokyo.org/en/destinations/central-tokyo/ginza/index.html',
        'https://www.gotokyo.org/en/destinations/eastern-tokyo/asakusa/index.html'
      ]::text[]
    ),
    (
      'late night',
      'Late-night usefulness after dinner, transit cutoff, bar density, and post-midnight energy.',
      '{"shinjuku":9.6,"shibuya":9.3,"roppongi":8.4,"ginza":5.6,"asakusa":3.6}'::jsonb,
      array[
        'https://www.gotokyo.org/en/destinations/western-tokyo/shinjuku/index.html',
        'https://www.gotokyo.org/en/destinations/western-tokyo/shibuya/index.html',
        'https://www.gotokyo.org/en/destinations/southern-tokyo/roppongi/index.html',
        'https://www.gotokyo.org/en/destinations/central-tokyo/ginza/index.html',
        'https://www.gotokyo.org/en/destinations/eastern-tokyo/asakusa/index.html'
      ]::text[]
    ),
    (
      'live music',
      'Music rooms, clubs, jazz/live venues, and areas where a night can be built around sound rather than only drinks.',
      '{"shibuya":8.4,"shinjuku":7.8,"roppongi":6.8,"ginza":4.6,"asakusa":3.8}'::jsonb,
      array[
        'https://www.gotokyo.org/en/destinations/western-tokyo/shinjuku/index.html',
        'https://www.gotokyo.org/en/destinations/western-tokyo/shibuya/index.html',
        'https://www.gotokyo.org/en/destinations/southern-tokyo/roppongi/index.html',
        'https://www.gotokyo.org/en/destinations/central-tokyo/ginza/index.html',
        'https://www.gotokyo.org/en/destinations/eastern-tokyo/asakusa/index.html'
      ]::text[]
    ),
    (
      'rooftops',
      'Hotel bars, skyline rooms, and elevated night views rather than general street-level nightlife.',
      '{"roppongi":8.2,"ginza":7.4,"shibuya":6.4,"shinjuku":5.8,"asakusa":3.4}'::jsonb,
      array[
        'https://www.gotokyo.org/en/destinations/western-tokyo/shinjuku/index.html',
        'https://www.gotokyo.org/en/destinations/western-tokyo/shibuya/index.html',
        'https://www.gotokyo.org/en/destinations/southern-tokyo/roppongi/index.html',
        'https://www.gotokyo.org/en/destinations/central-tokyo/ginza/index.html',
        'https://www.gotokyo.org/en/destinations/eastern-tokyo/asakusa/index.html'
      ]::text[]
    ),
    (
      'bars',
      'General bar usefulness, including tiny rooms, casual bars, cocktail rooms, and walkable backup density.',
      '{"shinjuku":9.2,"shibuya":8.8,"roppongi":8.6,"ginza":7.2,"asakusa":4.2}'::jsonb,
      array[
        'https://www.gotokyo.org/en/destinations/western-tokyo/shinjuku/index.html',
        'https://www.gotokyo.org/en/destinations/western-tokyo/shibuya/index.html',
        'https://www.gotokyo.org/en/destinations/southern-tokyo/roppongi/index.html',
        'https://www.gotokyo.org/en/destinations/central-tokyo/ginza/index.html',
        'https://www.gotokyo.org/en/destinations/eastern-tokyo/asakusa/index.html'
      ]::text[]
    ),
    (
      'cocktail bar',
      'Polished cocktail-room strength and serious drinks rather than all-purpose party energy.',
      '{"ginza":8.6,"roppongi":8.4,"shibuya":8,"shinjuku":7.8,"asakusa":4}'::jsonb,
      array[
        'https://www.gotokyo.org/en/destinations/western-tokyo/shinjuku/index.html',
        'https://www.gotokyo.org/en/destinations/western-tokyo/shibuya/index.html',
        'https://www.gotokyo.org/en/destinations/southern-tokyo/roppongi/index.html',
        'https://www.gotokyo.org/en/destinations/central-tokyo/ginza/index.html',
        'https://www.gotokyo.org/en/destinations/eastern-tokyo/asakusa/index.html'
      ]::text[]
    ),
    (
      'dive bar',
      'Tiny, loose, lower-polish, late, or counter-heavy bar energy.',
      '{"shinjuku":9.3,"shibuya":7.8,"roppongi":6,"asakusa":4.2,"ginza":3.4}'::jsonb,
      array[
        'https://www.gotokyo.org/en/destinations/western-tokyo/shinjuku/index.html',
        'https://www.gotokyo.org/en/destinations/western-tokyo/shibuya/index.html',
        'https://www.gotokyo.org/en/destinations/southern-tokyo/roppongi/index.html',
        'https://www.gotokyo.org/en/destinations/central-tokyo/ginza/index.html',
        'https://www.gotokyo.org/en/destinations/eastern-tokyo/asakusa/index.html'
      ]::text[]
    ),
    (
      'pub',
      'Casual drinking usefulness, low-friction group stops, and pub-style nights.',
      '{"shinjuku":8.4,"shibuya":8.2,"roppongi":7.2,"asakusa":5,"ginza":4.8}'::jsonb,
      array[
        'https://www.gotokyo.org/en/destinations/western-tokyo/shinjuku/index.html',
        'https://www.gotokyo.org/en/destinations/western-tokyo/shibuya/index.html',
        'https://www.gotokyo.org/en/destinations/southern-tokyo/roppongi/index.html',
        'https://www.gotokyo.org/en/destinations/central-tokyo/ginza/index.html',
        'https://www.gotokyo.org/en/destinations/eastern-tokyo/asakusa/index.html'
      ]::text[]
    )
),
expanded_strengths as (
  select
    parent_destination.id as parent_destination_id,
    neighborhood_destination.id as neighborhood_destination_id,
    field.field_key,
    field.rationale,
    field.source_urls,
    score.key as neighborhood_slug,
    (score.value)::numeric(4,2) as score
  from field_seed field
  cross join lateral jsonb_each_text(field.scores) as score(key, value)
  join public.destinations parent_destination on parent_destination.legacy_id = 'city:japan:tokyo'
  join public.destinations neighborhood_destination
    on neighborhood_destination.legacy_id = 'neighborhood:japan:tokyo:tokyo:' || score.key
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
  'Nightlife',
  field_key,
  score,
  rationale,
  source_urls,
  jsonb_build_object('source', 'tokyo_nightlife_strength_prototype_seed')
from expanded_strengths
on conflict (parent_destination_id, neighborhood_destination_id, category, field_key) do update set
  score = excluded.score,
  rationale = excluded.rationale,
  source_urls = excluded.source_urls,
  source_metadata = public.destination_category_neighborhood_strengths.source_metadata || excluded.source_metadata,
  is_active = true,
  updated_at = now();
