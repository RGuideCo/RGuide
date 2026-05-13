-- Add normalized affiliate links for destinations, venues, and entry stops.
--
-- Affiliate links are source-of-truth records that can be rendered into cards,
-- city panels, and booking buttons without hardcoding provider URLs in the app.

do $$
begin
  create type public.rguide_affiliate_entity_type as enum (
    'destination',
    'venue',
    'entry_stop'
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type public.rguide_affiliate_placement as enum (
    'city_left_panel',
    'stay_card',
    'venue_booking_button'
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type public.rguide_affiliate_provider as enum (
    'stay22',
    'booking',
    'agoda',
    'hotels'
  );
exception
  when duplicate_object then null;
end;
$$;

create table if not exists public.affiliate_links (
  id uuid primary key default gen_random_uuid(),
  entity_type public.rguide_affiliate_entity_type not null,
  entity_id uuid not null,
  placement public.rguide_affiliate_placement not null,
  provider public.rguide_affiliate_provider not null,
  url text not null,
  campaign_id text,
  label text,
  priority integer not null default 100 check (priority >= 0),
  is_active boolean not null default true,
  valid_from timestamptz,
  valid_until timestamptz,
  notes text,
  raw_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint affiliate_links_url_not_blank check (btrim(url) <> ''),
  constraint affiliate_links_validity_window check (
    valid_from is null
    or valid_until is null
    or valid_until > valid_from
  )
);

drop trigger if exists affiliate_links_set_updated_at on public.affiliate_links;
create trigger affiliate_links_set_updated_at
before update on public.affiliate_links
for each row
execute function public.set_updated_at();

create or replace function public.validate_affiliate_link_entity()
returns trigger
language plpgsql
as $$
begin
  if new.entity_type = 'destination' then
    if not exists (select 1 from public.destinations where id = new.entity_id) then
      raise exception 'affiliate_links entity_id % does not reference a destination', new.entity_id;
    end if;
  elsif new.entity_type = 'venue' then
    if not exists (select 1 from public.venues where id = new.entity_id) then
      raise exception 'affiliate_links entity_id % does not reference a venue', new.entity_id;
    end if;
  elsif new.entity_type = 'entry_stop' then
    if not exists (select 1 from public.entry_stops where id = new.entity_id) then
      raise exception 'affiliate_links entity_id % does not reference an entry_stop', new.entity_id;
    end if;
  else
    raise exception 'unsupported affiliate_links entity_type %', new.entity_type;
  end if;

  return new;
end;
$$;

drop trigger if exists affiliate_links_validate_entity on public.affiliate_links;
create trigger affiliate_links_validate_entity
before insert or update of entity_type, entity_id
on public.affiliate_links
for each row
execute function public.validate_affiliate_link_entity();

create unique index if not exists affiliate_links_active_entity_placement_provider_idx
on public.affiliate_links (entity_type, entity_id, placement, provider)
where is_active = true;

create index if not exists affiliate_links_entity_idx
on public.affiliate_links (entity_type, entity_id, is_active, priority);

create index if not exists affiliate_links_placement_idx
on public.affiliate_links (placement, provider, is_active, priority);

create index if not exists affiliate_links_provider_campaign_idx
on public.affiliate_links (provider, campaign_id)
where campaign_id is not null;

alter table public.affiliate_links enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'affiliate_links'
      and policyname = 'Active affiliate links are readable'
  ) then
    create policy "Active affiliate links are readable"
    on public.affiliate_links
    for select
    using (
      is_active = true
      and (valid_from is null or valid_from <= now())
      and (valid_until is null or valid_until > now())
    );
  end if;
end;
$$;
