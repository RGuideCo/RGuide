-- Complete normalized weekly event publishing support.
--
-- Weekly events should use events, event_occurrences, venues, sources,
-- entity_sources, and weekly_event_publications as the source of truth.
-- Rendered MapList JSON stays in weekly_event_publications only as a frontend
-- cache, while weekly_event_guides remains a temporary legacy fallback.

alter type public.rguide_source_entity_type
  add value if not exists 'weekly_event_publication';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'weekly_event_publications_submission_type_event'
      and conrelid = 'public.weekly_event_publications'::regclass
  ) then
    alter table public.weekly_event_publications
      add constraint weekly_event_publications_submission_type_event
      check (submission_type = 'event');
  end if;
end;
$$;

create index if not exists events_city_category_window_idx
on public.events (city_id, event_category, starts_at, ends_at)
where status = 'published';

create index if not exists event_occurrences_city_event_window_idx
on public.event_occurrences (city_id, event_id, starts_at, ends_at);

create index if not exists weekly_event_publications_city_week_start_idx
on public.weekly_event_publications (city_id, week_start, starts_at);

create index if not exists weekly_event_publications_city_source_run_idx
on public.weekly_event_publications (city_id, source_run_id, starts_at);

create index if not exists weekly_event_publications_city_current_idx
on public.weekly_event_publications (city_id, sourced_at desc, starts_at)
where submission_type = 'event';

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
    'timezone', publication.timezone
  ) as guide
from public.weekly_event_publications publication
left join public.events event on event.id = publication.event_id
where publication.submission_type = 'event';
