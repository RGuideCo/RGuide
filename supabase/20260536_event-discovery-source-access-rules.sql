-- Add source-specific access/compliance instructions for event discovery.
--
-- Some event sources can be consumed through feeds or public structured data;
-- others need manual review, partner access, or source-specific limits. These
-- fields keep those rules in the database instead of burying them in scraper
-- code.

do $$
begin
  create type public.event_discovery_access_method as enum (
    'official_api',
    'rss',
    'ical',
    'json_ld_page',
    'html_page',
    'manual',
    'partner_feed',
    'search_engine_index',
    'unknown'
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type public.event_discovery_access_status as enum (
    'allowed',
    'restricted',
    'manual_review',
    'blocked',
    'unknown'
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type public.event_discovery_target_kind as enum (
    'event_page',
    'venue_page',
    'artist_page',
    'guide_page',
    'calendar_page',
    'feed',
    'api_endpoint',
    'other'
  );
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create type public.event_discovery_target_status as enum (
    'queued',
    'approved',
    'processed',
    'skipped',
    'failed',
    'blocked',
    'needs_review'
  );
exception
  when duplicate_object then null;
end;
$$;

alter table public.event_discovery_sources
  add column if not exists access_method public.event_discovery_access_method not null default 'unknown',
  add column if not exists access_status public.event_discovery_access_status not null default 'unknown',
  add column if not exists extraction_strategy text,
  add column if not exists allowed_paths text[] not null default '{}',
  add column if not exists disallowed_paths text[] not null default '{}',
  add column if not exists robots_url text,
  add column if not exists terms_url text,
  add column if not exists max_requests_per_run integer not null default 25,
  add column if not exists min_delay_seconds numeric(8,3) not null default 3,
  add column if not exists stop_on_status_codes integer[] not null default array[403, 429],
  add column if not exists requires_javascript boolean not null default false,
  add column if not exists allows_automated_fetch boolean not null default false,
  add column if not exists compliance_notes text,
  add column if not exists access_reviewed_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'event_discovery_sources_access_limits'
      and conrelid = 'public.event_discovery_sources'::regclass
  ) then
    alter table public.event_discovery_sources
      add constraint event_discovery_sources_access_limits
      check (
        max_requests_per_run >= 0
        and min_delay_seconds >= 0
      );
  end if;
end;
$$;

create index if not exists event_discovery_sources_access_status_idx
on public.event_discovery_sources (access_status, access_method, is_active, priority)
where is_active = true;

create table if not exists public.event_discovery_source_targets (
  id uuid primary key default gen_random_uuid(),
  discovery_source_id uuid not null references public.event_discovery_sources(id) on delete cascade,
  city_id uuid not null references public.destinations(id) on delete cascade,
  venue_id uuid references public.venues(id) on delete set null,
  url text not null,
  target_kind public.event_discovery_target_kind not null default 'event_page',
  target_status public.event_discovery_target_status not null default 'queued',
  priority integer not null default 100 check (priority >= 0),
  discovered_at timestamptz not null default now(),
  approved_at timestamptz,
  processed_at timestamptz,
  last_attempted_at timestamptz,
  failure_count integer not null default 0 check (failure_count >= 0),
  error_message text,
  expected_event_start date,
  raw_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (discovery_source_id, url),
  constraint event_discovery_source_targets_url_not_blank check (btrim(url) <> '')
);

drop trigger if exists event_discovery_source_targets_set_updated_at on public.event_discovery_source_targets;
create trigger event_discovery_source_targets_set_updated_at
before update on public.event_discovery_source_targets
for each row
execute function public.set_updated_at();

create index if not exists event_discovery_source_targets_queue_idx
on public.event_discovery_source_targets (target_status, priority, discovered_at)
where target_status in ('queued', 'approved', 'needs_review');

create index if not exists event_discovery_source_targets_source_idx
on public.event_discovery_source_targets (discovery_source_id, target_status, priority);

create index if not exists event_discovery_source_targets_city_idx
on public.event_discovery_source_targets (city_id, target_status, expected_event_start);

create index if not exists event_discovery_source_targets_venue_idx
on public.event_discovery_source_targets (venue_id)
where venue_id is not null;

alter table public.event_discovery_source_targets enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'event_discovery_source_targets'
      and policyname = 'Approved event discovery targets are readable'
  ) then
    create policy "Approved event discovery targets are readable"
    on public.event_discovery_source_targets
    for select
    using (target_status in ('approved', 'processed'));
  end if;
end;
$$;

drop view if exists public.event_discovery_queue;
drop view if exists public.active_event_discovery_sources;

create view public.active_event_discovery_sources
with (security_invoker = true) as
select
  discovery_source.id,
  discovery_source.city_id,
  city.slug as city_slug,
  city.name as city_name,
  discovery_source.destination_id,
  discovery_source.publishing_settings_id,
  discovery_source.source_id,
  discovery_source.venue_id,
  venue.name as venue_name,
  discovery_source.name,
  discovery_source.slug,
  discovery_source.url,
  discovery_source.publisher,
  discovery_source.source_kind,
  discovery_source.category_focus,
  discovery_source.search_url_template,
  discovery_source.rss_url,
  discovery_source.api_url,
  discovery_source.crawl_frequency,
  discovery_source.priority,
  discovery_source.requires_manual_review,
  discovery_source.access_method,
  discovery_source.access_status,
  discovery_source.extraction_strategy,
  discovery_source.allowed_paths,
  discovery_source.disallowed_paths,
  discovery_source.robots_url,
  discovery_source.terms_url,
  discovery_source.max_requests_per_run,
  discovery_source.min_delay_seconds,
  discovery_source.stop_on_status_codes,
  discovery_source.requires_javascript,
  discovery_source.allows_automated_fetch,
  discovery_source.compliance_notes,
  discovery_source.access_reviewed_at,
  discovery_source.last_checked_at,
  discovery_source.last_success_at,
  discovery_source.last_failure_at,
  discovery_source.failure_count,
  settings.discovery_cadence,
  settings.discovery_window_days,
  settings.publish_cadence,
  settings.publish_window_days,
  settings.refresh_cadence,
  settings.refresh_window_days,
  settings.next_discovery_run_at,
  settings.next_publish_run_at,
  settings.next_refresh_run_at,
  settings.timezone,
  discovery_source.raw_metadata
from public.event_discovery_sources discovery_source
join public.destinations city on city.id = discovery_source.city_id
left join public.venues venue on venue.id = discovery_source.venue_id
left join public.event_city_publishing_settings settings
  on settings.id = discovery_source.publishing_settings_id
where discovery_source.is_active = true;

create view public.event_discovery_queue
with (security_invoker = true) as
select *
from public.active_event_discovery_sources source
where source.discovery_cadence <> 'none'
  and source.access_status in ('allowed', 'manual_review', 'restricted')
  and (
    source.access_status = 'allowed'
    or source.requires_manual_review = true
  )
  and (
    source.next_discovery_run_at is null
    or source.next_discovery_run_at <= now()
  )
order by source.priority asc, source.city_slug asc, source.source_kind asc, source.name asc;

drop view if exists public.event_discovery_target_queue;

create view public.event_discovery_target_queue
with (security_invoker = true) as
select
  target.id,
  target.discovery_source_id,
  source.city_id,
  source.city_slug,
  source.city_name,
  target.venue_id,
  venue.name as venue_name,
  source.name as discovery_source_name,
  source.slug as discovery_source_slug,
  source.source_kind,
  source.access_method,
  source.access_status,
  source.extraction_strategy,
  source.stop_on_status_codes,
  source.requires_javascript,
  source.allows_automated_fetch,
  source.requires_manual_review,
  target.url,
  target.target_kind,
  target.target_status,
  target.priority,
  target.expected_event_start,
  target.failure_count,
  target.raw_metadata
from public.event_discovery_source_targets target
join public.active_event_discovery_sources source on source.id = target.discovery_source_id
left join public.venues venue on venue.id = target.venue_id
where target.target_status in ('queued', 'approved', 'needs_review')
order by target.priority asc, target.discovered_at asc;

update public.event_discovery_sources
set access_method = case
      when source_kind = 'official_city_calendar' then 'html_page'::public.event_discovery_access_method
      when rss_url is not null then 'rss'::public.event_discovery_access_method
      when api_url is not null then 'official_api'::public.event_discovery_access_method
      else 'json_ld_page'::public.event_discovery_access_method
    end,
    access_status = case
      when requires_manual_review then 'manual_review'::public.event_discovery_access_status
      else 'unknown'::public.event_discovery_access_status
    end,
    extraction_strategy = coalesce(extraction_strategy, 'Prefer official structured data or clearly published event details; preserve source attribution.'),
    allowed_paths = case
      when cardinality(allowed_paths) = 0 then array[url]
      else allowed_paths
    end,
    robots_url = coalesce(robots_url, split_part(url, '/', 1) || '//' || split_part(url, '/', 3) || '/robots.txt'),
    max_requests_per_run = least(max_requests_per_run, 25),
    min_delay_seconds = greatest(min_delay_seconds, 3),
    compliance_notes = coalesce(compliance_notes, 'Check source terms/robots before automated collection; stop on blocked/rate-limited responses.'),
    access_reviewed_at = coalesce(access_reviewed_at, now()),
    updated_at = now()
where raw_metadata->>'source' = 'event_discovery_sources_seed';

update public.event_discovery_sources
set access_method = 'json_ld_page'::public.event_discovery_access_method,
    access_status = 'restricted'::public.event_discovery_access_status,
    extraction_strategy = 'High-value electronic music source. Do not crawl RA search pages or bypass access controls. Use manually approved RA event/venue/guide URLs in event_discovery_source_targets, partner/feed access if established, or manual curation. Prefer machine-readable structured data on approved target pages when accessible; stop immediately on blocked/rate-limited responses.',
    allowed_paths = array['/events/es/barcelona', '/events/', '/clubs/', '/guide/'],
    disallowed_paths = array['bulk search result scraping', '/login', '/promoters', '/tickets', 'captcha-protected pages'],
    robots_url = 'https://ra.co/robots.txt',
    terms_url = 'https://ra.co/terms',
    max_requests_per_run = 3,
    min_delay_seconds = 10,
    stop_on_status_codes = array[403, 429],
    requires_javascript = true,
    allows_automated_fetch = false,
    requires_manual_review = true,
    compliance_notes = 'Keep RA as a priority electronic-events source, but only through approved target URLs, manual review, or permitted/partner access. No CAPTCHA bypassing, no anti-detection evasion, no repeated search-page crawling.',
    access_reviewed_at = now(),
    updated_at = now()
where slug = 'resident-advisor-barcelona';
