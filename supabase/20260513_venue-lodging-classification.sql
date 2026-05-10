-- Add first-class lodging classification and filterable venue attributes.
--
-- `venue_kind` answers: what broad kind of place is this?
-- `lodging_type` answers: what kind of stay is it?
-- `attribute_tags` and the venue tag tables answer: what searchable/filterable
-- qualities does this place have, such as relaxing, lively, party, or scenic?

do $$
begin
  create type public.venue_kind as enum (
    'lodging',
    'food_drink',
    'nightlife',
    'culture',
    'outdoors',
    'event_venue',
    'transport',
    'retail',
    'service',
    'landmark',
    'other'
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type public.lodging_type as enum (
    'hotel',
    'hostel',
    'resort',
    'airbnb',
    'apartment_hotel',
    'guesthouse',
    'camping',
    'holiday_park'
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type public.venue_tag_group as enum (
    'vibe',
    'setting',
    'budget',
    'audience',
    'amenity',
    'style',
    'accessibility',
    'booking',
    'other'
  );
exception
  when duplicate_object then null;
end;
$$;

alter table public.venues
  add column if not exists venue_kind public.venue_kind not null default 'other',
  add column if not exists lodging_type public.lodging_type,
  add column if not exists attribute_tags text[] not null default '{}';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'venues_lodging_type_requires_lodging_kind'
      and conrelid = 'public.venues'::regclass
  ) then
    alter table public.venues
      add constraint venues_lodging_type_requires_lodging_kind
      check (lodging_type is null or venue_kind = 'lodging');
  end if;
end;
$$;

create table if not exists public.venue_tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  tag_group public.venue_tag_group not null default 'other',
  description text,
  applies_to public.venue_kind,
  is_filterable boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists venue_tags_set_updated_at on public.venue_tags;
create trigger venue_tags_set_updated_at
before update on public.venue_tags
for each row
execute function public.set_updated_at();

create table if not exists public.venue_taggings (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete cascade,
  tag_id uuid not null references public.venue_tags(id) on delete cascade,
  source_id uuid references public.sources(id) on delete set null,
  confidence numeric(4,3) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  raw_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (venue_id, tag_id)
);

insert into public.venue_tags (slug, label, tag_group, applies_to, description)
values
  ('relaxing', 'Relaxing', 'vibe', 'lodging', 'Calm, restorative, or low-key stay.'),
  ('quiet', 'Quiet', 'vibe', 'lodging', 'Low-noise stay suited to rest.'),
  ('lively', 'Lively', 'vibe', 'lodging', 'Energetic stay with social atmosphere nearby or on-site.'),
  ('party', 'Party', 'vibe', 'lodging', 'Strong nightlife or party-forward stay.'),
  ('social', 'Social', 'vibe', 'lodging', 'Good for meeting other travelers.'),
  ('scenic', 'Scenic', 'setting', 'lodging', 'Notable views or landscape setting.'),
  ('beach', 'Beach', 'setting', 'lodging', 'Beach, waterfront, or coastal access.'),
  ('nature', 'Nature', 'setting', 'lodging', 'Close to parks, forests, mountains, or outdoor escapes.'),
  ('central', 'Central', 'setting', 'lodging', 'Central base for city exploration.'),
  ('budget', 'Budget', 'budget', 'lodging', 'Budget-conscious stay.'),
  ('midrange', 'Midrange', 'budget', 'lodging', 'Moderate price positioning.'),
  ('luxury', 'Luxury', 'budget', 'lodging', 'Premium or luxury stay.'),
  ('family_friendly', 'Family-Friendly', 'audience', 'lodging', 'Useful for families or groups with children.'),
  ('romantic', 'Romantic', 'audience', 'lodging', 'Good for couples or special trips.'),
  ('work_friendly', 'Work-Friendly', 'amenity', 'lodging', 'Practical for remote work or business travel.'),
  ('wellness', 'Wellness', 'amenity', 'lodging', 'Spa, wellness, retreat, or restorative amenities.'),
  ('design', 'Design-Led', 'style', 'lodging', 'Design, boutique, or architecture-led property.'),
  ('accessible', 'Accessible', 'accessibility', 'lodging', 'Has accessibility-related evidence or features.'),
  ('pet_friendly', 'Pet-Friendly', 'amenity', 'lodging', 'Accepts pets or is positioned for pet travel.')
on conflict (slug) do update set
  label = excluded.label,
  tag_group = excluded.tag_group,
  applies_to = excluded.applies_to,
  description = excluded.description,
  is_filterable = true,
  is_active = true;

create index if not exists venues_city_kind_idx
on public.venues (city_id, venue_kind);

create index if not exists venues_city_lodging_type_idx
on public.venues (city_id, lodging_type)
where venue_kind = 'lodging';

create index if not exists venues_attribute_tags_gin_idx
on public.venues using gin (attribute_tags);

create index if not exists venue_tags_group_idx
on public.venue_tags (tag_group, is_active, is_filterable);

create index if not exists venue_tags_applies_to_idx
on public.venue_tags (applies_to)
where applies_to is not null;

create index if not exists venue_taggings_tag_venue_idx
on public.venue_taggings (tag_id, venue_id);

create index if not exists venue_taggings_venue_idx
on public.venue_taggings (venue_id);

alter table public.venue_tags enable row level security;
alter table public.venue_taggings enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'venue_tags'
      and policyname = 'Public can read active venue tags'
  ) then
    create policy "Public can read active venue tags"
    on public.venue_tags
    for select
    using (is_active = true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'venue_taggings'
      and policyname = 'Public can read venue taggings'
  ) then
    create policy "Public can read venue taggings"
    on public.venue_taggings
    for select
    using (true);
  end if;
end;
$$;

create or replace view public.stay_venues
with (security_invoker = true) as
select
  venue.id,
  venue.name,
  venue.slug,
  venue.city_id,
  city.name as city_name,
  venue.neighborhood_id,
  neighborhood.name as neighborhood_name,
  venue.lodging_type,
  venue.attribute_tags,
  venue.coordinates,
  venue.official_url,
  venue.source_metadata,
  venue.created_at,
  venue.updated_at
from public.venues venue
left join public.destinations city on city.id = venue.city_id
left join public.destinations neighborhood on neighborhood.id = venue.neighborhood_id
where venue.venue_kind = 'lodging';
