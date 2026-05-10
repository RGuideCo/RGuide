-- Backfill canonical venue hours from existing guide stop hours when available.
-- This keeps the raw source text because current guide data often stores
-- human-readable hours rather than clean open/close intervals.

with raw_hours as (
  select distinct on (stop.venue_id)
    stop.venue_id,
    trim(both '"' from stop.hours::text) as raw_text
  from public.entry_stops stop
  where stop.venue_id is not null
    and stop.hours is not null
    and jsonb_typeof(stop.hours) = 'string'
  order by stop.venue_id, stop.updated_at desc nulls last, stop.created_at desc
)
update public.venues venue
set
  timezone = coalesce(venue.timezone, city.timezone),
  hours_last_verified_at = coalesce(venue.hours_last_verified_at, now()),
  hours_note = coalesce(venue.hours_note, raw_hours.raw_text)
from raw_hours
left join public.destinations city on city.id = (
  select v.city_id from public.venues v where v.id = raw_hours.venue_id
)
where venue.id = raw_hours.venue_id;

with stop_hours as (
  select distinct on (stop.venue_id, hour_key)
    stop.venue_id,
    case lower(hour_key)
      when 'sun' then 0
      when 'sunday' then 0
      when 'mon' then 1
      when 'monday' then 1
      when 'tue' then 2
      when 'tues' then 2
      when 'tuesday' then 2
      when 'wed' then 3
      when 'wednesday' then 3
      when 'thu' then 4
      when 'thur' then 4
      when 'thurs' then 4
      when 'thursday' then 4
      when 'fri' then 5
      when 'friday' then 5
      when 'sat' then 6
      when 'saturday' then 6
    end as day_of_week,
    hour_value #>> '{}' as raw_text,
    stop.updated_at,
    stop.created_at
  from public.entry_stops stop
  cross join lateral jsonb_each(stop.hours) as hour_item(hour_key, hour_value)
  where stop.venue_id is not null
    and stop.hours is not null
    and jsonb_typeof(stop.hours) = 'object'
    and lower(hour_key) in (
      'sun', 'sunday', 'mon', 'monday', 'tue', 'tues', 'tuesday',
      'wed', 'wednesday', 'thu', 'thur', 'thurs', 'thursday',
      'fri', 'friday', 'sat', 'saturday'
    )
  order by stop.venue_id, hour_key, stop.updated_at desc nulls last, stop.created_at desc
)
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
  lower(coalesce(raw_text, '')) in ('closed', 'closed today'),
  lower(coalesce(raw_text, '')) in ('24 hours', 'open 24 hours', '24/7'),
  nullif(raw_text, ''),
  jsonb_build_object('source', 'entry_stops.hours'),
  now()
from stop_hours
where day_of_week is not null
  and nullif(raw_text, '') is not null
on conflict (venue_id, day_of_week, interval_order, valid_from) do update set
  is_closed = excluded.is_closed,
  is_24_hours = excluded.is_24_hours,
  raw_text = excluded.raw_text,
  raw_metadata = public.venue_hours.raw_metadata || excluded.raw_metadata,
  last_verified_at = excluded.last_verified_at,
  updated_at = now();

update public.venues venue
set
  timezone = coalesce(venue.timezone, city.timezone),
  hours_last_verified_at = coalesce(venue.hours_last_verified_at, now())
from public.destinations city
where city.id = venue.city_id
  and exists (
    select 1
    from public.venue_hours hour
    where hour.venue_id = venue.id
  );
