-- Cover event-related foreign keys that the Supabase performance advisor
-- flagged after normalized weekly event publishing was wired up.

create index if not exists event_city_publishing_settings_destination_idx
on public.event_city_publishing_settings (destination_id)
where destination_id is not null;

create index if not exists event_source_runs_city_idx
on public.event_source_runs (city_id);

create index if not exists event_source_runs_destination_idx
on public.event_source_runs (destination_id)
where destination_id is not null;

create index if not exists events_neighborhood_idx
on public.events (neighborhood_id)
where neighborhood_id is not null;

create index if not exists event_occurrences_venue_idx
on public.event_occurrences (venue_id)
where venue_id is not null;

create index if not exists event_occurrences_latest_refresh_source_run_idx
on public.event_occurrences (latest_refresh_source_run_id)
where latest_refresh_source_run_id is not null;

create index if not exists weekly_event_publications_destination_idx
on public.weekly_event_publications (destination_id)
where destination_id is not null;

create index if not exists weekly_event_publications_entry_idx
on public.weekly_event_publications (entry_id)
where entry_id is not null;
