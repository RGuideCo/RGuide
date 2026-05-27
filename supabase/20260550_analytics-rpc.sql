-- Allow the app to record and summarize analytics without exposing table access.

create or replace function public.record_analytics_click(p_event jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
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
  ) values (
    p_event->>'event_type',
    p_event->>'session_id',
    p_event->>'ip_hash',
    p_event->>'user_agent',
    p_event->>'referrer',
    p_event->>'country',
    p_event->>'region',
    p_event->>'metro',
    p_event->>'current_path',
    p_event->>'destination_host',
    p_event->>'destination_path',
    p_event->>'link_text',
    p_event->>'city_slug',
    p_event->>'neighborhood_slug',
    p_event->>'category_slug',
    p_event->>'guide_slug',
    p_event->>'button_text',
    p_event->>'button_label',
    p_event->>'affiliate',
    p_event->>'affiliate_aid',
    p_event->>'affiliate_campaign',
    p_event->>'affiliate_hotel_name',
    coalesce(p_event->'raw_properties', '{}'::jsonb)
  );
end;
$$;

create or replace function public.analytics_dashboard_summary()
returns jsonb
language sql
security definer
set search_path = public
as $$
  with recent_events as (
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
    from public.analytics_click_events
    order by created_at desc
    limit 5000
  ),
  metrics as (
    select jsonb_build_object(
      'total', count(*)::int,
      'affiliate_clicks', count(*) filter (where event_type = 'affiliate_click')::int,
      'unique_sessions', count(distinct session_id)::int,
      'clicks_24h', count(*) filter (where created_at >= now() - interval '24 hours')::int
    ) as value
    from public.analytics_click_events
  ),
  daily as (
    select jsonb_agg(row_to_json(day_row)::jsonb order by sort_day) as value
    from (
      select
        day as sort_day,
        to_char(day, 'Mon DD') as day,
        coalesce(count(event.id), 0)::int as total,
        coalesce(count(event.id) filter (where event.event_type = 'affiliate_click'), 0)::int as affiliate_clicks
      from generate_series(current_date - interval '13 days', current_date, interval '1 day') day
      left join public.analytics_click_events event
        on event.created_at >= day
       and event.created_at < day + interval '1 day'
      group by day
    ) day_row
  ),
  event_types as (
    select coalesce(jsonb_agg(row_to_json(row_data)::jsonb), '[]'::jsonb) as value
    from (
      select event_type as label, count(*)::int as count
      from public.analytics_click_events
      group by event_type
      order by count desc
    ) row_data
  ),
  campaigns as (
    select coalesce(jsonb_agg(row_to_json(row_data)::jsonb), '[]'::jsonb) as value
    from (
      select coalesce(affiliate_campaign, '(no campaign)') as label, count(*)::int as count
      from public.analytics_click_events
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
      from public.analytics_click_events
      group by current_path
      order by count desc
      limit 12
    ) row_data
  ),
  hotels as (
    select coalesce(jsonb_agg(row_to_json(row_data)::jsonb), '[]'::jsonb) as value
    from (
      select coalesce(affiliate_hotel_name, '(no hotel name)') as label, count(*)::int as count
      from public.analytics_click_events
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
      from public.analytics_click_events
      group by country
      order by count desc
      limit 12
    ) row_data
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
      from recent_events
      order by created_at desc
      limit 30
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
    'recent', recent.value
  )
  from metrics, daily, event_types, campaigns, pages, hotels, countries, recent;
$$;

grant execute on function public.record_analytics_click(jsonb) to anon, authenticated, service_role;
grant execute on function public.analytics_dashboard_summary() to anon, authenticated, service_role;
