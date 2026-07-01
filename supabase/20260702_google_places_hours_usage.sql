-- Track external API calls that ingestion scripts make so concurrent agents
-- share one quota budget instead of each guessing locally.

create table if not exists public.external_api_usage_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  api_name text not null,
  sku text not null,
  purpose text not null,
  city_id uuid references public.destinations(id) on delete set null,
  venue_id uuid references public.venues(id) on delete set null,
  status text not null default 'started',
  billable_units integer not null default 1 check (billable_units >= 0),
  request_metadata jsonb not null default '{}'::jsonb,
  response_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint external_api_usage_events_provider_not_blank check (btrim(provider) <> ''),
  constraint external_api_usage_events_api_name_not_blank check (btrim(api_name) <> ''),
  constraint external_api_usage_events_sku_not_blank check (btrim(sku) <> ''),
  constraint external_api_usage_events_purpose_not_blank check (btrim(purpose) <> ''),
  constraint external_api_usage_events_status_check check (
    status in ('started', 'success', 'not_found', 'no_hours', 'skipped', 'failed')
  )
);

drop trigger if exists external_api_usage_events_set_updated_at on public.external_api_usage_events;
create trigger external_api_usage_events_set_updated_at
before update on public.external_api_usage_events
for each row
execute function public.set_updated_at();

create index if not exists external_api_usage_events_provider_sku_created_idx
on public.external_api_usage_events (provider, sku, created_at desc);

create index if not exists external_api_usage_events_city_created_idx
on public.external_api_usage_events (city_id, created_at desc)
where city_id is not null;

create index if not exists external_api_usage_events_venue_created_idx
on public.external_api_usage_events (venue_id, created_at desc)
where venue_id is not null;

alter table public.external_api_usage_events enable row level security;

-- No public policy is intentional. Service/maintenance scripts write these rows;
-- browser clients should not read or mutate quota ledgers.
