-- Batch analytics ingestion so normal click tracking can bypass Vercel Functions.

create table if not exists public.analytics_click_event_rollups (
  hour timestamptz not null,
  event_type text not null check (
    event_type in (
      'guide_link_click',
      'internal_link_click',
      'button_click'
    )
  ),
  current_path text not null default '(unknown page)',
  destination_host text not null default '(none)',
  city_slug text not null default '(none)',
  guide_slug text not null default '(none)',
  event_count integer not null default 0,
  sampled_count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (hour, event_type, current_path, destination_host, city_slug, guide_slug)
);

create index if not exists analytics_click_event_rollups_hour_idx
on public.analytics_click_event_rollups (hour desc);

create index if not exists analytics_click_event_rollups_event_type_hour_idx
on public.analytics_click_event_rollups (event_type, hour desc);

alter table public.analytics_click_event_rollups enable row level security;

create or replace function public.record_analytics_batch(p_events jsonb)
returns jsonb
language sql
security definer
set search_path = public
as $$
  with input_events as (
    select value as event
    from jsonb_array_elements(
      case
        when jsonb_typeof(coalesce(p_events, '[]'::jsonb)) = 'array' then coalesce(p_events, '[]'::jsonb)
        else '[]'::jsonb
      end
    )
    limit 25
  ),
  normalized as (
    select
      left(coalesce(event->>'eventType', event->>'event_type'), 80) as event_type,
      left(coalesce(event->>'sessionId', event->>'session_id'), 120) as session_id,
      left(coalesce(event->>'referrer', event->>'referrer'), 500) as referrer,
      case
        when coalesce(event->>'sampleWeight', '1') ~ '^[0-9]+$'
          then least(greatest((event->>'sampleWeight')::int, 1), 100)
        else 1
      end as sample_weight,
      coalesce(event->'properties', event->'raw_properties', '{}'::jsonb) as properties,
      event
    from input_events
  ),
  mapped as (
    select
      event_type,
      session_id,
      referrer,
      sample_weight,
      nullif(left(coalesce(properties->>'currentPath', event->>'current_path'), 500), '') as current_path,
      nullif(left(coalesce(properties->>'destinationHost', event->>'destination_host'), 255), '') as destination_host,
      nullif(left(coalesce(properties->>'destinationPath', event->>'destination_path'), 700), '') as destination_path,
      nullif(left(coalesce(properties->>'linkText', event->>'link_text'), 160), '') as link_text,
      nullif(left(coalesce(properties->>'city', event->>'city_slug'), 120), '') as city_slug,
      nullif(left(coalesce(properties->>'neighborhood', event->>'neighborhood_slug'), 180), '') as neighborhood_slug,
      nullif(left(coalesce(properties->>'category', event->>'category_slug'), 120), '') as category_slug,
      nullif(left(coalesce(properties->>'guideSlug', event->>'guide_slug'), 180), '') as guide_slug,
      nullif(left(coalesce(properties->>'buttonText', event->>'button_text'), 160), '') as button_text,
      nullif(left(coalesce(properties->>'buttonLabel', event->>'button_label'), 160), '') as button_label,
      nullif(left(coalesce(properties->>'affiliate', event->>'affiliate'), 80), '') as affiliate,
      nullif(left(coalesce(properties->>'aid', event->>'affiliate_aid'), 120), '') as affiliate_aid,
      nullif(left(coalesce(properties->>'campaign', event->>'affiliate_campaign'), 180), '') as affiliate_campaign,
      nullif(left(coalesce(properties->>'hotelName', event->>'affiliate_hotel_name'), 255), '') as affiliate_hotel_name,
      left(event->>'ip_hash', 255) as ip_hash,
      left(event->>'user_agent', 255) as user_agent,
      left(event->>'country', 255) as country,
      left(event->>'region', 255) as region,
      left(event->>'metro', 255) as metro,
      properties
    from normalized
  ),
  valid_events as (
    select *
    from mapped
    where event_type in (
      'affiliate_click',
      'outbound_click',
      'guide_link_click',
      'internal_link_click',
      'button_click'
    )
      and coalesce(current_path, '') <> ''
      and current_path not like '/admin%'
      and current_path not like 'http://localhost%'
      and current_path not like 'http://127.0.0.1%'
      and (
        event_type = 'button_click'
        or coalesce(destination_host, '') <> ''
      )
  ),
  raw_events as (
    select *
    from valid_events
    where event_type in ('affiliate_click', 'outbound_click')
       or (event_type = 'guide_link_click' and affiliate is not null)
  ),
  rollup_events as (
    select *
    from valid_events
    where event_type in ('guide_link_click', 'internal_link_click', 'button_click')
      and not (event_type = 'guide_link_click' and affiliate is not null)
  ),
  inserted_raw as (
    insert into public.analytics_click_events (
      event_type,
      session_id,
      ip_hash,
      user_agent,
      referrer,
      country,
      region,
      metro,
      current_path,
      destination_host,
      destination_path,
      link_text,
      city_slug,
      neighborhood_slug,
      category_slug,
      guide_slug,
      button_text,
      button_label,
      affiliate,
      affiliate_aid,
      affiliate_campaign,
      affiliate_hotel_name,
      raw_properties
    )
    select
      event_type,
      session_id,
      ip_hash,
      user_agent,
      referrer,
      country,
      region,
      metro,
      current_path,
      destination_host,
      destination_path,
      link_text,
      city_slug,
      neighborhood_slug,
      category_slug,
      guide_slug,
      button_text,
      button_label,
      affiliate,
      affiliate_aid,
      affiliate_campaign,
      affiliate_hotel_name,
      properties
    from raw_events
    returning 1
  ),
  rollup_groups as (
    select
      date_trunc('hour', now()) as hour,
      event_type,
      coalesce(current_path, '(unknown page)') as current_path,
      coalesce(destination_host, '(none)') as destination_host,
      coalesce(city_slug, '(none)') as city_slug,
      coalesce(guide_slug, '(none)') as guide_slug,
      sum(sample_weight)::int as event_count,
      count(*)::int as sampled_count
    from rollup_events
    group by 1, 2, 3, 4, 5, 6
  ),
  upserted_rollups as (
    insert into public.analytics_click_event_rollups (
      hour,
      event_type,
      current_path,
      destination_host,
      city_slug,
      guide_slug,
      event_count,
      sampled_count,
      updated_at
    )
    select
      hour,
      event_type,
      current_path,
      destination_host,
      city_slug,
      guide_slug,
      event_count,
      sampled_count,
      now()
    from rollup_groups
    on conflict (hour, event_type, current_path, destination_host, city_slug, guide_slug)
    do update set
      event_count = public.analytics_click_event_rollups.event_count + excluded.event_count,
      sampled_count = public.analytics_click_event_rollups.sampled_count + excluded.sampled_count,
      updated_at = now()
    returning 1
  ),
  counts as (
    select
      (select count(*) from input_events)::int as received,
      (select count(*) from valid_events)::int as accepted,
      (select count(*) from inserted_raw)::int as raw_inserted,
      (select count(*) from upserted_rollups)::int as rollup_groups
  )
  select jsonb_build_object(
    'received', received,
    'accepted', accepted,
    'dropped', greatest(received - accepted, 0),
    'rawInserted', raw_inserted,
    'rollupGroups', rollup_groups
  )
  from counts;
$$;

create or replace function public.record_analytics_click(p_event jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.record_analytics_batch(jsonb_build_array(p_event));
end;
$$;

grant execute on function public.record_analytics_batch(jsonb) to anon, authenticated, service_role;
grant execute on function public.record_analytics_click(jsonb) to anon, authenticated, service_role;

create or replace function public.analytics_dashboard_summary(
  p_days integer default 30,
  p_recent_limit integer default 50,
  p_recent_offset integer default 0
)
returns jsonb
language sql
security definer
set search_path = public
as $$
  with params as (
    select
      greatest(coalesce(p_days, 30), 0) as days,
      greatest(coalesce(p_recent_limit, 50), 1) as recent_limit,
      greatest(coalesce(p_recent_offset, 0), 0) as recent_offset
  ),
  filtered_raw as (
    select
      created_at,
      event_type,
      session_id,
      current_path,
      destination_host,
      destination_path,
      link_text,
      affiliate_campaign,
      affiliate_hotel_name,
      country
    from public.analytics_click_events, params
    where params.days = 0
       or created_at >= now() - (params.days * interval '1 day')
  ),
  filtered_rollups as (
    select
      hour,
      event_type,
      current_path,
      destination_host,
      city_slug,
      guide_slug,
      event_count
    from public.analytics_click_event_rollups, params
    where params.days = 0
       or hour >= date_trunc('hour', now() - (params.days * interval '1 day'))
  ),
  chart_days as (
    select generate_series(
      current_date - ((case when params.days = 0 then 90 else least(params.days, 90) end - 1) * interval '1 day'),
      current_date,
      interval '1 day'
    ) as day
    from params
  ),
  metrics as (
    select jsonb_build_object(
      'total', ((select count(*) from filtered_raw) + coalesce((select sum(event_count) from filtered_rollups), 0))::int,
      'affiliate_clicks', (select count(*) from filtered_raw where event_type = 'affiliate_click')::int,
      'unique_sessions', (select count(distinct session_id) from filtered_raw)::int,
      'clicks_24h', (
        (select count(*) from filtered_raw where created_at >= now() - interval '24 hours') +
        coalesce((select sum(event_count) from filtered_rollups where hour >= date_trunc('hour', now() - interval '24 hours')), 0)
      )::int
    ) as value
  ),
  daily_raw as (
    select
      chart_days.day,
      count(event.created_at)::int as total,
      count(event.created_at) filter (where event.event_type = 'affiliate_click')::int as affiliate_clicks
    from chart_days
    left join filtered_raw event
      on event.created_at >= chart_days.day
     and event.created_at < chart_days.day + interval '1 day'
    group by chart_days.day
  ),
  daily_rollups as (
    select
      chart_days.day,
      coalesce(sum(rollup.event_count), 0)::int as total
    from chart_days
    left join filtered_rollups rollup
      on rollup.hour >= chart_days.day
     and rollup.hour < chart_days.day + interval '1 day'
    group by chart_days.day
  ),
  daily as (
    select jsonb_agg(row_to_json(day_row)::jsonb order by sort_day) as value
    from (
      select
        daily_raw.day as sort_day,
        to_char(daily_raw.day, 'Mon DD') as day,
        (daily_raw.total + daily_rollups.total)::int as total,
        daily_raw.affiliate_clicks::int as affiliate_clicks
      from daily_raw
      join daily_rollups using (day)
    ) day_row
  ),
  event_type_counts as (
    select event_type as label, count(*)::int as count
    from filtered_raw
    group by event_type
    union all
    select event_type as label, sum(event_count)::int as count
    from filtered_rollups
    group by event_type
  ),
  event_types as (
    select coalesce(jsonb_agg(row_to_json(row_data)::jsonb order by count desc), '[]'::jsonb) as value
    from (
      select label, sum(count)::int as count
      from event_type_counts
      group by label
      order by count desc
    ) row_data
  ),
  campaigns as (
    select coalesce(jsonb_agg(row_to_json(row_data)::jsonb), '[]'::jsonb) as value
    from (
      select coalesce(affiliate_campaign, '(no campaign)') as label, count(*)::int as count
      from filtered_raw
      where event_type = 'affiliate_click'
      group by affiliate_campaign
      order by count desc
      limit 12
    ) row_data
  ),
  page_counts as (
    select coalesce(current_path, '(unknown page)') as label, count(*)::int as count
    from filtered_raw
    group by current_path
    union all
    select coalesce(current_path, '(unknown page)') as label, sum(event_count)::int as count
    from filtered_rollups
    group by current_path
  ),
  pages as (
    select coalesce(jsonb_agg(row_to_json(row_data)::jsonb), '[]'::jsonb) as value
    from (
      select label, sum(count)::int as count
      from page_counts
      group by label
      order by count desc
      limit 12
    ) row_data
  ),
  hotels as (
    select coalesce(jsonb_agg(row_to_json(row_data)::jsonb), '[]'::jsonb) as value
    from (
      select coalesce(affiliate_hotel_name, '(no hotel name)') as label, count(*)::int as count
      from filtered_raw
      where event_type = 'affiliate_click'
      group by affiliate_hotel_name
      order by count desc
      limit 12
    ) row_data
  ),
  countries as (
    select coalesce(jsonb_agg(row_to_json(row_data)::jsonb), '[]'::jsonb) as value
    from (
      select coalesce(country, '(unknown)') as label, count(*)::int as count
      from filtered_raw
      group by country
      order by count desc
      limit 12
    ) row_data
  ),
  recent_total as (
    select count(*)::int as value
    from filtered_raw
  ),
  recent as (
    select coalesce(jsonb_agg(row_to_json(row_data)::jsonb), '[]'::jsonb) as value
    from (
      select
        created_at,
        event_type,
        current_path,
        destination_host,
        destination_path,
        link_text,
        affiliate_campaign,
        affiliate_hotel_name,
        country
      from filtered_raw
      order by created_at desc
      limit (select recent_limit from params)
      offset (select recent_offset from params)
    ) row_data
  )
  select jsonb_build_object(
    'metrics', metrics.value,
    'daily', daily.value,
    'eventTypes', event_types.value,
    'campaigns', campaigns.value,
    'pages', pages.value,
    'hotels', hotels.value,
    'countries', countries.value,
    'recent', recent.value,
    'recentTotal', recent_total.value
  )
  from metrics, daily, event_types, campaigns, pages, hotels, countries, recent_total, recent;
$$;

grant execute on function public.analytics_dashboard_summary(integer, integer, integer) to anon, authenticated, service_role;
