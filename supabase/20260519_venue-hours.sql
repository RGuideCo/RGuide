-- Add canonical venue operating hours.
--
-- `entry_stops.hours` remains a guide-specific display override.
-- These tables make hours reusable, sourceable, and queryable per venue.

do $migration$
begin
  create type public.venue_operating_status as enum (
    'open',
    'temporarily_closed',
    'permanently_closed',
    'seasonal',
    'unknown'
  );
exception
  when duplicate_object then null;
end;
$migration$;

do $migration$
begin
  alter type public.rguide_source_entity_type add value if not exists 'venue_hours';
  alter type public.rguide_source_entity_type add value if not exists 'venue_special_hours';
exception
  when duplicate_object then null;
end;
$migration$;

alter table public.venues
  add column if not exists timezone text,
  add column if not exists operating_status public.venue_operating_status not null default 'unknown',
  add column if not exists hours_last_verified_at timestamptz,
  add column if not exists hours_note text;

create table if not exists public.venue_hours (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  interval_order integer not null default 0 check (interval_order >= 0),
  is_closed boolean not null default false,
  is_24_hours boolean not null default false,
  opens_at time,
  closes_at time,
  opens_next_day boolean not null default false,
  valid_from date not null default '1900-01-01',
  valid_to date,
  source_id uuid references public.sources(id) on delete set null,
  confidence numeric(4,3) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  raw_text text,
  raw_metadata jsonb not null default '{}'::jsonb,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (venue_id, day_of_week, interval_order, valid_from),
  constraint venue_hours_valid_range check (valid_to is null or valid_to >= valid_from),
  constraint venue_hours_shape check (
    is_closed
    or is_24_hours
    or raw_text is not null
    or (opens_at is not null and closes_at is not null)
  ),
  constraint venue_hours_closed_shape check (
    not is_closed
    or (opens_at is null and closes_at is null and is_24_hours = false)
  ),
  constraint venue_hours_24_shape check (
    not is_24_hours
    or (opens_at is null and closes_at is null and is_closed = false)
  )
);

drop trigger if exists venue_hours_set_updated_at on public.venue_hours;
create trigger venue_hours_set_updated_at
before update on public.venue_hours
for each row
execute function public.set_updated_at();

create table if not exists public.venue_special_hours (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete cascade,
  special_date date not null,
  interval_order integer not null default 0 check (interval_order >= 0),
  is_closed boolean not null default false,
  is_24_hours boolean not null default false,
  opens_at time,
  closes_at time,
  opens_next_day boolean not null default false,
  reason text,
  source_id uuid references public.sources(id) on delete set null,
  confidence numeric(4,3) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  raw_text text,
  raw_metadata jsonb not null default '{}'::jsonb,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (venue_id, special_date, interval_order),
  constraint venue_special_hours_shape check (
    is_closed
    or is_24_hours
    or raw_text is not null
    or (opens_at is not null and closes_at is not null)
  ),
  constraint venue_special_hours_closed_shape check (
    not is_closed
    or (opens_at is null and closes_at is null and is_24_hours = false)
  ),
  constraint venue_special_hours_24_shape check (
    not is_24_hours
    or (opens_at is null and closes_at is null and is_closed = false)
  )
);

drop trigger if exists venue_special_hours_set_updated_at on public.venue_special_hours;
create trigger venue_special_hours_set_updated_at
before update on public.venue_special_hours
for each row
execute function public.set_updated_at();

create index if not exists venue_hours_venue_day_idx
on public.venue_hours (venue_id, day_of_week, interval_order);

create index if not exists venue_hours_day_open_idx
on public.venue_hours (day_of_week, is_closed, opens_at);

create index if not exists venue_hours_source_idx
on public.venue_hours (source_id)
where source_id is not null;

create index if not exists venue_special_hours_venue_date_idx
on public.venue_special_hours (venue_id, special_date, interval_order);

create index if not exists venue_special_hours_date_idx
on public.venue_special_hours (special_date, is_closed, opens_at);

create index if not exists venue_special_hours_source_idx
on public.venue_special_hours (source_id)
where source_id is not null;

create index if not exists venues_operating_status_idx
on public.venues (operating_status);

create index if not exists venues_hours_last_verified_idx
on public.venues (hours_last_verified_at)
where hours_last_verified_at is not null;

alter table public.venue_hours enable row level security;
alter table public.venue_special_hours enable row level security;

do $migration$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'venue_hours'
      and policyname = 'Public can read venue hours'
  ) then
    create policy "Public can read venue hours"
    on public.venue_hours
    for select
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'venue_special_hours'
      and policyname = 'Public can read venue special hours'
  ) then
    create policy "Public can read venue special hours"
    on public.venue_special_hours
    for select
    using (true);
  end if;
end;
$migration$;

create or replace view public.venue_hours_current
with (security_invoker = true) as
select
  venue.id as venue_id,
  venue.name as venue_name,
  venue.city_id,
  city.name as city_name,
  venue.timezone,
  venue.operating_status,
  venue.hours_last_verified_at,
  coalesce(hours.items, '[]'::jsonb) as weekly_hours,
  coalesce(special.items, '[]'::jsonb) as upcoming_special_hours
from public.venues venue
left join public.destinations city on city.id = venue.city_id
left join lateral (
  select jsonb_agg(
    jsonb_strip_nulls(
      jsonb_build_object(
        'dayOfWeek', hour.day_of_week,
        'intervalOrder', hour.interval_order,
        'isClosed', hour.is_closed,
        'is24Hours', hour.is_24_hours,
        'opensAt', hour.opens_at,
        'closesAt', hour.closes_at,
        'opensNextDay', hour.opens_next_day,
        'validFrom', hour.valid_from,
        'validTo', hour.valid_to,
        'rawText', hour.raw_text,
        'lastVerifiedAt', hour.last_verified_at
      )
    )
    order by hour.day_of_week, hour.interval_order
  ) as items
  from public.venue_hours hour
  where hour.venue_id = venue.id
    and hour.valid_from <= current_date
    and (hour.valid_to is null or hour.valid_to >= current_date)
) hours on true
left join lateral (
  select jsonb_agg(
    jsonb_strip_nulls(
      jsonb_build_object(
        'date', special_hour.special_date,
        'intervalOrder', special_hour.interval_order,
        'isClosed', special_hour.is_closed,
        'is24Hours', special_hour.is_24_hours,
        'opensAt', special_hour.opens_at,
        'closesAt', special_hour.closes_at,
        'opensNextDay', special_hour.opens_next_day,
        'reason', special_hour.reason,
        'rawText', special_hour.raw_text,
        'lastVerifiedAt', special_hour.last_verified_at
      )
    )
    order by special_hour.special_date, special_hour.interval_order
  ) as items
  from public.venue_special_hours special_hour
  where special_hour.venue_id = venue.id
    and special_hour.special_date >= current_date
    and special_hour.special_date < current_date + interval '90 days'
) special on true;
