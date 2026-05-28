-- Add range filters and pagination to the private analytics dashboard summary.

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
  filtered_events as (
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
      'total', count(*)::int,
      'affiliate_clicks', count(*) filter (where event_type = 'affiliate_click')::int,
      'unique_sessions', count(distinct session_id)::int,
      'clicks_24h', count(*) filter (where created_at >= now() - interval '24 hours')::int
    ) as value
    from filtered_events
  ),
  daily as (
    select jsonb_agg(row_to_json(day_row)::jsonb order by sort_day) as value
    from (
      select
        chart_days.day as sort_day,
        to_char(chart_days.day, 'Mon DD') as day,
        coalesce(count(event.created_at), 0)::int as total,
        coalesce(count(event.created_at) filter (where event.event_type = 'affiliate_click'), 0)::int as affiliate_clicks
      from chart_days
      left join filtered_events event
        on event.created_at >= chart_days.day
       and event.created_at < chart_days.day + interval '1 day'
      group by chart_days.day
    ) day_row
  ),
  event_types as (
    select coalesce(jsonb_agg(row_to_json(row_data)::jsonb), '[]'::jsonb) as value
    from (
      select event_type as label, count(*)::int as count
      from filtered_events
      group by event_type
      order by count desc
    ) row_data
  ),
  campaigns as (
    select coalesce(jsonb_agg(row_to_json(row_data)::jsonb), '[]'::jsonb) as value
    from (
      select coalesce(affiliate_campaign, '(no campaign)') as label, count(*)::int as count
      from filtered_events
      where event_type = 'affiliate_click'
      group by affiliate_campaign
      order by count desc
      limit 12
    ) row_data
  ),
  pages as (
    select coalesce(jsonb_agg(row_to_json(row_data)::jsonb), '[]'::jsonb) as value
    from (
      select coalesce(current_path, '(unknown page)') as label, count(*)::int as count
      from filtered_events
      group by current_path
      order by count desc
      limit 12
    ) row_data
  ),
  hotels as (
    select coalesce(jsonb_agg(row_to_json(row_data)::jsonb), '[]'::jsonb) as value
    from (
      select coalesce(affiliate_hotel_name, '(no hotel name)') as label, count(*)::int as count
      from filtered_events
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
      from filtered_events
      group by country
      order by count desc
      limit 12
    ) row_data
  ),
  recent_total as (
    select count(*)::int as value
    from filtered_events
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
      from filtered_events
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
