-- Replace placeholder-like structured venue_hours rows with canonical notes.
--
-- Some older guide publishes expanded vague notes into seven venue_hours rows,
-- so the rendered payload repeated placeholder text once per weekday. Because
-- entries_maplist correctly prefers venue_hours over hours_note, those bad
-- structured rows must be removed before the cleaner canonical note can render.

with placeholder_hour_venues as (
  select
    venue.id as venue_id,
    venue.venue_kind,
    bool_or(entry.category = 'Food') as appears_food,
    bool_or(entry.category = 'Nightlife') as appears_nightlife,
    bool_or(entry.category = 'Culture') as appears_culture,
    bool_or(entry.category = 'Stay') as appears_stay
  from public.venue_hours hour
  join public.venues venue on venue.id = hour.venue_id
  join public.entry_stops stop on stop.venue_id = venue.id
  join public.entries entry on entry.id = stop.entry_id
  where entry.status = 'published'::public.rguide_entry_status
    and entry.submission_type <> 'event'::public.rguide_submission_type
    and hour.valid_from <= current_date
    and (hour.valid_to is null or hour.valid_to >= current_date)
    and (
      hour.raw_text ~* '(current-status evidence is map-based|open and active in the current source set|open and active|hours should be confirmed|verify current hours|verify official hours|confirm current hours|confirm before going|check current hours)'
      or (
        hour.raw_text ~* '(hours?\s+var(y|ies)|varies by|variable|subject to change|may change|can change|verify|confirm|check before|check current|current hours|same-day|generally|usually|typically)'
        and not (
          hour.raw_text ~* '(official calendar|booking calendar|reservation page|booking page|property page|official site|official page|show calendar|event calendar|timetable|market day|market days|seasonal|season|weather|vendor|stall|performance schedule|exhibition page|timed ticket|last admission)'
          or (
            hour.raw_text ~* '(mon|monday|tue|tues|tuesday|wed|wednesday|thu|thur|thurs|thursday|fri|friday|sat|saturday|sun|sunday|daily|weekday|weekdays|weekend|weekends)'
            and hour.raw_text ~* '(\d{1,2}(:\d{2})?\s*(am|pm)|\d{1,2}:\d{2}|closed)'
          )
          or hour.raw_text ~* '(24\s*hours?|open\s+24)'
        )
      )
    )
  group by venue.id
),
affected_entries as (
  select distinct entry.id as entry_id
  from public.entries entry
  join public.entry_stops stop on stop.entry_id = entry.id
  join placeholder_hour_venues bad on bad.venue_id = stop.venue_id
  where entry.status = 'published'::public.rguide_entry_status
    and entry.submission_type <> 'event'::public.rguide_submission_type
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
      else
        'Official page, reservation page, booking page, or event calendar controls opening hours, closures, and seasonal schedules.'
    end as hours_note,
    case
      when venue_kind = 'lodging' or appears_stay then 'lodging_schedule_dependency'
      when venue_kind = 'food_drink' or appears_food then 'food_or_drink_schedule_dependency'
      when venue_kind = 'nightlife' or appears_nightlife then 'nightlife_schedule_dependency'
      when venue_kind in ('culture', 'landmark', 'event_venue') or appears_culture then 'culture_or_landmark_schedule_dependency'
      else 'general_schedule_dependency'
    end as note_basis
  from placeholder_hour_venues
),
deleted_placeholder_hours as (
  delete from public.venue_hours hour
  using placeholder_hour_venues bad
  where hour.venue_id = bad.venue_id
    and hour.valid_from <= current_date
    and (hour.valid_to is null or hour.valid_to >= current_date)
  returning hour.venue_id
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
      'hours_note_repair', '20260621_cleanup_placeholder_venue_hours',
      'hours_note_basis', note.note_basis,
      'hours_note_scope', 'placeholder_venue_hours_cleanup',
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
    jsonb_build_object('refreshed_from', '20260621_cleanup_placeholder_venue_hours')
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
  (select count(distinct venue_id) from placeholder_hour_venues) as venues_targeted,
  (select count(*) from deleted_placeholder_hours) as venue_hour_rows_deleted,
  (select count(*) from updated_venues) as venue_notes_updated,
  (select count(*) from refreshed_cache) as render_caches_refreshed;
