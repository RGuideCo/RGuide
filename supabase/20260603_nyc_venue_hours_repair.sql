-- Repair canonical venue hours for the normalized New York City guides.
--
-- The NYC guide publish had entry_stops.hours populated, but venues.hours_note
-- and venue_hours were empty. Keep the stop-level guide override intact while
-- copying canonical notes/weekly rows onto the shared venues.

with nyc_entries as (
  select id
  from public.entries
  where legacy_id like 'list-nyc-%'
),
nyc_stops as (
  select
    stop.id,
    stop.entry_id,
    stop.venue_id,
    stop.stop_order,
    stop.hours,
    case
      when jsonb_typeof(stop.hours) = 'string' then nullif(btrim(stop.hours #>> '{}'), '')
      when jsonb_typeof(stop.hours) = 'object' then nullif(btrim(stop.hours ->> 'default'), '')
      else null
    end as default_hours
  from public.entry_stops stop
  join nyc_entries entry on entry.id = stop.entry_id
  where stop.venue_id is not null
    and stop.hours is not null
),
note_candidates as (
  select distinct on (venue_id)
    venue_id,
    default_hours
  from nyc_stops
  where default_hours is not null
  order by venue_id, stop_order
),
updated_notes as (
  update public.venues venue
  set hours_note = coalesce(nullif(venue.hours_note, ''), note.default_hours),
      hours_last_verified_at = coalesce(venue.hours_last_verified_at, now()),
      updated_at = now()
  from note_candidates note
  where venue.id = note.venue_id
  returning venue.id
),
day_keys(day_key, day_of_week) as (
  values
    ('sun', 0), ('sunday', 0),
    ('mon', 1), ('monday', 1),
    ('tue', 2), ('tues', 2), ('tuesday', 2),
    ('wed', 3), ('wednesday', 3),
    ('thu', 4), ('thur', 4), ('thurs', 4), ('thursday', 4),
    ('fri', 5), ('friday', 5),
    ('sat', 6), ('saturday', 6)
),
default_daily_intervals as (
  select distinct
    stop.venue_id,
    day.day_of_week,
    stop.default_hours as raw_text,
    case
      when lower(regexp_replace(stop.default_hours, '\.$', '')) in ('24 hours', 'open 24 hours', '24/7') then true
      when lower(stop.default_hours) ~ '(^|[^a-z])(open |operates |ferry operates )?24[- ]?hours( daily)?([^a-z]|$)' then true
      else false
    end as is_24_hours,
    jsonb_build_object('source', 'entry_stops.hours.default', 'repair', 'nyc_hours_pass') as raw_metadata
  from nyc_stops stop
  cross join generate_series(0, 6) as day(day_of_week)
  where stop.default_hours is not null
    and (
      lower(regexp_replace(stop.default_hours, '\.$', '')) in ('24 hours', 'open 24 hours', '24/7')
      or lower(stop.default_hours) like 'daily %'
      or lower(stop.default_hours) like '% daily%'
      or lower(stop.default_hours) like 'park open daily%'
      or lower(stop.default_hours) like 'pedestrian path open daily%'
      or lower(stop.default_hours) like 'terminal open daily%'
    )
),
explicit_day_intervals as (
  select distinct
    stop.venue_id,
    day_keys.day_of_week,
    nullif(btrim(hour_item.value #>> '{}'), '') as raw_text,
    lower(nullif(btrim(hour_item.value #>> '{}'), '')) in ('24 hours', 'open 24 hours', '24/7') as is_24_hours,
    jsonb_build_object('source', 'entry_stops.hours', 'repair', 'nyc_hours_pass') as raw_metadata
  from nyc_stops stop
  cross join lateral jsonb_each(stop.hours) as hour_item(key, value)
  join day_keys on day_keys.day_key = lower(hour_item.key)
  where jsonb_typeof(stop.hours) = 'object'
    and nullif(btrim(hour_item.value #>> '{}'), '') is not null
),
interval_candidates as (
  select * from default_daily_intervals
  union all
  select * from explicit_day_intervals
),
upserted_intervals as (
  insert into public.venue_hours (
    venue_id,
    day_of_week,
    interval_order,
    is_closed,
    is_24_hours,
    raw_text,
    raw_metadata,
    last_verified_at
  )
  select
    venue_id,
    day_of_week,
    0,
    lower(raw_text) in ('closed', 'closed today'),
    is_24_hours,
    raw_text,
    raw_metadata,
    now()
  from interval_candidates
  on conflict (venue_id, day_of_week, interval_order, valid_from) do update set
    is_closed = excluded.is_closed,
    is_24_hours = excluded.is_24_hours,
    raw_text = excluded.raw_text,
    raw_metadata = public.venue_hours.raw_metadata || excluded.raw_metadata,
    last_verified_at = excluded.last_verified_at,
    updated_at = now()
  returning venue_id
),
refreshed_cache as (
  insert into public.entry_render_cache (
    entry_id,
    render_format,
    render_version,
    rendered_payload,
    source_hash,
    rendered_at,
    stale_at,
    is_current,
    metadata
  )
  select
    entry.id,
    'maplist',
    1,
    view.list,
    encode(digest(view.list::text, 'sha256'), 'hex'),
    now(),
    null,
    true,
    jsonb_build_object('refreshed_from', 'nyc_hours_pass')
  from nyc_entries entry
  join public.entries_maplist view on view.id = entry.id
  on conflict (entry_id, render_format, render_version) do update set
    rendered_payload = excluded.rendered_payload,
    source_hash = excluded.source_hash,
    rendered_at = excluded.rendered_at,
    stale_at = null,
    is_current = true,
    metadata = public.entry_render_cache.metadata || excluded.metadata
  returning entry_id
)
select
  (select count(*) from updated_notes) as venue_notes_updated,
  (select count(*) from upserted_intervals) as venue_hour_rows_upserted,
  (select count(*) from refreshed_cache) as render_caches_refreshed;
