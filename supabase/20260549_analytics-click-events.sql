-- First-party click analytics for affiliate proof and site behavior reporting.
--
-- This table is intentionally private. The public app sends events to a server
-- route, and the server writes with the Supabase service-role key.

create table if not exists public.analytics_click_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_type text not null check (
    event_type in (
      'affiliate_click',
      'outbound_click',
      'guide_link_click',
      'internal_link_click',
      'button_click'
    )
  ),
  session_id text,
  ip_hash text,
  user_agent text,
  referrer text,
  country text,
  region text,
  metro text,
  current_path text,
  destination_host text,
  destination_path text,
  link_text text,
  city_slug text,
  neighborhood_slug text,
  category_slug text,
  guide_slug text,
  button_text text,
  button_label text,
  affiliate text,
  affiliate_aid text,
  affiliate_campaign text,
  affiliate_hotel_name text,
  raw_properties jsonb not null default '{}'::jsonb
);

create index if not exists analytics_click_events_created_at_idx
on public.analytics_click_events (created_at desc);

create index if not exists analytics_click_events_event_type_created_at_idx
on public.analytics_click_events (event_type, created_at desc);

create index if not exists analytics_click_events_affiliate_campaign_idx
on public.analytics_click_events (affiliate, affiliate_campaign, created_at desc)
where affiliate is not null;

create index if not exists analytics_click_events_city_category_idx
on public.analytics_click_events (city_slug, category_slug, created_at desc)
where city_slug is not null;

create index if not exists analytics_click_events_session_idx
on public.analytics_click_events (session_id, created_at desc)
where session_id is not null;

alter table public.analytics_click_events enable row level security;
