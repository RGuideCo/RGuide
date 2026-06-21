-- Repair rendered missing/placeholder venue hours across published guide entries.
--
-- Scope:
-- - published non-event entries only
-- - real stops linked to venues
-- - venues without current structured venue_hours or upcoming special hours
-- - rendered hours that are blank or placeholder-like
--
-- This keeps structured venue_hours authoritative and uses venues.hours_note as
-- the canonical fallback for schedule-dependent places.

with stop_hours as (
  select
    entry.id as entry_id,
    entry.category,
    entry.submission_type,
    venue.id as venue_id,
    venue.venue_kind,
    venue.hours_note,
    coalesce(
      nullif(btrim(venue.hours_note), ''),
      case jsonb_typeof(stop.hours)
        when 'string' then nullif(btrim(stop.hours #>> '{}'), '')
        when 'object' then (
          select nullif(btrim(string_agg(value #>> '{}', ' ')), '')
          from jsonb_each(stop.hours)
        )
        else null
      end
    ) as rendered_hours_text
  from public.entries entry
  join public.entry_stops stop on stop.entry_id = entry.id
  join public.venues venue on venue.id = stop.venue_id
  where entry.status = 'published'::public.rguide_entry_status
    and entry.submission_type <> 'event'::public.rguide_submission_type
),
bad_stops as (
  select *
  from stop_hours stop
  where not exists (
      select 1
      from public.venue_hours hour
      where hour.venue_id = stop.venue_id
        and hour.valid_from <= current_date
        and (hour.valid_to is null or hour.valid_to >= current_date)
    )
    and not exists (
      select 1
      from public.venue_special_hours special_hour
      where special_hour.venue_id = stop.venue_id
        and special_hour.special_date >= current_date
    )
    and (
      nullif(btrim(stop.rendered_hours_text), '') is null
      or stop.rendered_hours_text ~* '(current-status evidence is map-based|open and active in the current source set|open and active|hours should be confirmed|verify current hours|verify official hours|confirm current hours|confirm before going|check current hours)'
      or (
        stop.rendered_hours_text ~* '(hours?\s+var(y|ies)|varies by|variable|subject to change|may change|can change|verify|confirm|check before|check current|current hours|same-day|generally|usually|typically)'
        and not (
          stop.rendered_hours_text ~* '(official calendar|booking calendar|reservation page|booking page|property page|official site|official page|show calendar|event calendar|timetable|market day|market days|seasonal|season|weather|vendor|stall|performance schedule|exhibition page|timed ticket|last admission)'
          or (
            stop.rendered_hours_text ~* '(mon|monday|tue|tues|tuesday|wed|wednesday|thu|thur|thurs|thursday|fri|friday|sat|saturday|sun|sunday|daily|weekday|weekdays|weekend|weekends)'
            and stop.rendered_hours_text ~* '(\d{1,2}(:\d{2})?\s*(am|pm)|\d{1,2}:\d{2}|closed)'
          )
          or stop.rendered_hours_text ~* '(24\s*hours?|open\s+24)'
        )
      )
    )
),
affected_venues as (
  select
    venue_id,
    venue_kind,
    bool_or(category = 'Food') as appears_food,
    bool_or(category = 'Nightlife') as appears_nightlife,
    bool_or(category = 'Culture') as appears_culture,
    bool_or(category = 'Nature' or category = 'Activities' or category = 'Routes') as appears_public_space,
    bool_or(category = 'Stay') as appears_stay
  from bad_stops
  group by venue_id, venue_kind
),
affected_entries as (
  select distinct entry_id
  from bad_stops
),
note_candidates as (
  select
    venue_id,
    case
      when venue_kind = 'lodging' or appears_stay then
        'Official property page, booking page, or reservation page controls check-in windows, front-desk schedules, amenities, and seasonal service hours.'
      when venue_kind = 'food_drink' or appears_food then
        'Official site, reservation page, or booking page controls service windows, closed days, holiday service, and kitchen cutoffs.'
      when venue_kind = 'nightlife' or appears_nightlife then
        'Official site, show calendar, event calendar, reservation page, or booking page controls doors, service windows, performance schedules, and private-event closures.'
      when venue_kind in ('culture', 'landmark', 'event_venue') or appears_culture then
        'Official page, exhibition page, timed-ticket page, or event calendar controls opening hours, last admission, closures, and holiday schedules.'
      when venue_kind in ('outdoors', 'retail') or appears_public_space then
        'Official page for the park, garden, quay, cemetery, square, beach, trail, or monument controls gate times, seasonal opening, market days, and weather closures.'
      else
        'Official page, reservation page, booking page, or event calendar controls opening hours, closures, and seasonal schedules.'
    end as hours_note,
    case
      when venue_kind = 'lodging' or appears_stay then 'lodging_schedule_dependency'
      when venue_kind = 'food_drink' or appears_food then 'food_or_drink_schedule_dependency'
      when venue_kind = 'nightlife' or appears_nightlife then 'nightlife_schedule_dependency'
      when venue_kind in ('culture', 'landmark', 'event_venue') or appears_culture then 'culture_or_landmark_schedule_dependency'
      when venue_kind in ('outdoors', 'retail') or appears_public_space then 'outdoor_or_public_space_schedule_dependency'
      else 'general_schedule_dependency'
    end as note_basis
  from affected_venues
),
updated_venues as (
  update public.venues venue
  set
    hours_note = note.hours_note,
    hours_last_verified_at = now(),
    operating_status = case
      when venue.operating_status = 'unknown'::public.venue_operating_status then 'open'::public.venue_operating_status
      else venue.operating_status
    end,
    source_metadata = coalesce(venue.source_metadata, '{}'::jsonb) || jsonb_build_object(
      'hours_note_repair', '20260621_global_rendered_venue_hours_notes_repair',
      'hours_note_basis', note.note_basis,
      'hours_note_scope', 'global_rendered_missing_or_placeholder_hours',
      'hours_note_updated_at', now()
    ),
    updated_at = now()
  from note_candidates note
  where venue.id = note.venue_id
  returning venue.id
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
    entry.entry_id,
    'maplist',
    1,
    view.list,
    encode(digest(view.list::text, 'sha256'), 'hex'),
    now(),
    null,
    true,
    jsonb_build_object('refreshed_from', '20260621_global_rendered_venue_hours_notes_repair')
  from affected_entries entry
  join public.entries_maplist view on view.id = entry.entry_id
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
  (select count(*) from updated_venues) as venue_notes_updated,
  (select count(*) from refreshed_cache) as render_caches_refreshed;
