-- Venue-level event discovery.
--
-- This view exposes published events associated with a venue either directly via
-- events.venue_id or through schedule/festival items in event_occurrences.
-- It intentionally reads only normalized source-of-truth tables.

create index if not exists events_venue_idx
on public.events (venue_id)
where venue_id is not null;

create index if not exists events_venue_start_status_idx
on public.events (venue_id, starts_at, status)
where venue_id is not null;

create index if not exists events_city_venue_start_status_idx
on public.events (city_id, venue_id, starts_at, status)
where venue_id is not null;

create index if not exists event_occurrences_venue_idx
on public.event_occurrences (venue_id)
where venue_id is not null;

create index if not exists event_occurrences_venue_start_event_idx
on public.event_occurrences (venue_id, starts_at, event_id)
where venue_id is not null;

create index if not exists event_occurrences_event_venue_start_idx
on public.event_occurrences (event_id, venue_id, starts_at)
where venue_id is not null;

drop view if exists public.venue_events;

create or replace view public.venue_events
with (security_invoker = true) as
with event_venue_pairs as (
  select distinct
    event.venue_id,
    event.id as event_id
  from public.events event
  where event.venue_id is not null
    and event.status = 'published'

  union

  select distinct
    occurrence.venue_id,
    occurrence.event_id
  from public.event_occurrences occurrence
  join public.events event on event.id = occurrence.event_id
  where occurrence.venue_id is not null
    and event.status = 'published'
),
occurrence_stats as (
  select
    occurrence.venue_id,
    occurrence.event_id,
    count(*)::integer as occurrence_count_at_venue,
    min(coalesce(occurrence.starts_at, occurrence.starts_on::timestamptz)) filter (
      where coalesce(occurrence.starts_at, occurrence.starts_on::timestamptz) >= now()
    ) as next_occurrence_at_venue,
    max(coalesce(occurrence.ends_at, occurrence.starts_at, occurrence.ends_on::timestamptz, occurrence.starts_on::timestamptz))
      as latest_occurrence_at_venue
  from public.event_occurrences occurrence
  where occurrence.venue_id is not null
  group by occurrence.venue_id, occurrence.event_id
)
select
  venue.id as venue_id,
  event.city_id,
  event.id as event_id,
  event.slug as event_slug,
  event.title as event_title,
  event.event_category,
  event.guide_category,
  event.starts_at,
  event.ends_at,
  event.starts_on,
  event.ends_on,
  event.timezone,
  event.official_url,
  event.photo_url,
  event.is_festival,
  event.is_guide_worthy,
  coalesce(stats.occurrence_count_at_venue, 0) as occurrence_count_at_venue,
  coalesce(
    stats.next_occurrence_at_venue,
    case
      when coalesce(event.starts_at, event.starts_on::timestamptz) >= now()
        then coalesce(event.starts_at, event.starts_on::timestamptz)
      else null
    end
  ) as next_occurrence_at_venue,
  coalesce(
    stats.latest_occurrence_at_venue,
    coalesce(event.ends_at, event.starts_at, event.ends_on::timestamptz, event.starts_on::timestamptz)
  ) as latest_occurrence_at_venue
from public.venues venue
join event_venue_pairs pair on pair.venue_id = venue.id
join public.events event on event.id = pair.event_id
left join occurrence_stats stats
  on stats.venue_id = venue.id
 and stats.event_id = event.id
where event.status = 'published';

drop view if exists public.weekly_events_maplist;

create or replace view public.weekly_events_maplist
with (security_invoker = true) as
select
  publication.id,
  publication.city_id,
  publication.destination_id,
  publication.week_start,
  publication.week_end,
  publication.week_label,
  publication.sourced_at,
  publication.submission_type,
  publication.event_category,
  publication.has_schedule,
  publication.is_festival,
  publication.timezone,
  publication.starts_at,
  publication.ends_at,
  publication.source_run_id,
  publication.event_id,
  event.venue_id,
  event.official_url,
  event.is_guide_worthy,
  event.guide_reason,
  publication.rendered_map_list || jsonb_build_object(
    'submissionType', 'event',
    'schemaSubmissionType', publication.submission_type::text,
    'eventCategory', publication.event_category,
    'hasSchedule', publication.has_schedule,
    'isFestival', publication.is_festival,
    'sourceRunId', publication.source_run_id,
    'eventId', publication.event_id,
    'eventVenueId', event.venue_id,
    'timezone', publication.timezone
  ) as guide
from public.weekly_event_publications publication
left join public.events event on event.id = publication.event_id
where publication.submission_type = 'event';
