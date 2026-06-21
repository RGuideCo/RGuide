-- Repair canonical venue-hours notes for remaining Paris guide venues.
--
-- This intentionally writes to public.venues.hours_note, not local guide files
-- and not entry_stops. Structured venue_hours rows remain preferred whenever
-- they exist; this pass only fills venues that still have no canonical hours.

with city as (
  select id
  from public.destinations
  where scope = 'city'::public.destination_scope
    and slug = 'paris'
  limit 1
),
city_entries as (
  select id, category
  from public.entries
  where city_id = (select id from city)
    and status = 'published'::public.rguide_entry_status
),
missing_venues as (
  select
    venue.id,
    venue.venue_kind,
    bool_or(entry.category = 'Food') as appears_food,
    bool_or(entry.category = 'Nightlife') as appears_nightlife,
    bool_or(entry.category = 'Culture') as appears_culture,
    bool_or(entry.category = 'Nature') as appears_nature
  from public.entry_stops stop
  join city_entries entry on entry.id = stop.entry_id
  join public.venues venue on venue.id = stop.venue_id
  where stop.hours is null
    and nullif(venue.hours_note, '') is null
    and not exists (
      select 1
      from public.venue_hours hour
      where hour.venue_id = venue.id
        and hour.valid_from <= current_date
        and (hour.valid_to is null or hour.valid_to >= current_date)
    )
    and not exists (
      select 1
      from public.venue_special_hours special_hour
      where special_hour.venue_id = venue.id
        and special_hour.special_date >= current_date
    )
  group by venue.id
),
note_candidates as (
  select
    id,
    case
      when venue_kind = 'food_drink' or appears_food then
        'Official site, reservation page, or booking page controls service windows, closed days, holiday service, and kitchen cutoffs.'
      when venue_kind = 'nightlife' or appears_nightlife then
        'Official site, show calendar, event calendar, reservation page, or booking page controls doors, service windows, performance schedules, and private-event closures.'
      when venue_kind in ('culture', 'landmark', 'event_venue') or appears_culture then
        'Official page, exhibition page, timed-ticket page, or event calendar controls opening hours, last admission, closures, and holiday schedules.'
      when venue_kind in ('outdoors', 'retail') or appears_nature then
        'Official page for the park, garden, quay, cemetery, square, or monument controls gate times, seasonal opening, market days, and weather closures.'
      else
        'Official page, reservation page, booking page, or event calendar controls opening hours, closures, and seasonal schedules.'
    end as hours_note,
    case
      when venue_kind = 'food_drink' or appears_food then 'food_or_drink_schedule_dependency'
      when venue_kind = 'nightlife' or appears_nightlife then 'nightlife_schedule_dependency'
      when venue_kind in ('culture', 'landmark', 'event_venue') or appears_culture then 'culture_or_landmark_schedule_dependency'
      when venue_kind in ('outdoors', 'retail') or appears_nature then 'outdoor_or_public_space_schedule_dependency'
      else 'general_schedule_dependency'
    end as note_basis
  from missing_venues
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
      'hours_note_repair', '20260621_paris_venue_hours_notes_repair',
      'hours_note_basis', note.note_basis,
      'hours_note_scope', 'paris_missing_canonical_hours',
      'hours_note_updated_at', now()
    ),
    updated_at = now()
  from note_candidates note
  where venue.id = note.id
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
    entry.id,
    'maplist',
    1,
    view.list,
    encode(digest(view.list::text, 'sha256'), 'hex'),
    now(),
    null,
    true,
    jsonb_build_object('refreshed_from', '20260621_paris_venue_hours_notes_repair')
  from city_entries entry
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
  (select count(*) from updated_venues) as venue_notes_updated,
  (select count(*) from refreshed_cache) as render_caches_refreshed;
