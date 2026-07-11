begin;

-- Event cards are entries for rendering, but the event row remains canonical.
alter table public.entries
  add column if not exists event_id uuid references public.events(id) on delete set null;

create unique index if not exists entries_event_id_unique_idx
  on public.entries(event_id)
  where event_id is not null;

update public.entries entry
set event_id = event.id
from public.events event
where entry.submission_type = 'event'
  and entry.event_id is null
  and event.legacy_id = regexp_replace(entry.legacy_id, '^event-', '');

alter table public.entries
  drop constraint if exists entries_event_type_check;
alter table public.entries
  add constraint entries_event_type_check
  check (event_id is null or submission_type = 'event') not valid;
alter table public.entries validate constraint entries_event_type_check;

alter table public.entries
  drop constraint if exists entries_published_event_link_check;
alter table public.entries
  add constraint entries_published_event_link_check
  check (submission_type <> 'event' or status <> 'published' or event_id is not null) not valid;
alter table public.entries validate constraint entries_published_event_link_check;

-- The original Barcelona backfill created matching entry stops and occurrences,
-- but omitted the foreign-key links between the rendered and canonical records.
with exact_matches as (
  select
    stop.id as stop_id,
    event.id as event_id,
    occurrence.id as occurrence_id
  from public.entries entry
  join public.entry_stops stop on stop.entry_id = entry.id
  join public.events event on event.id = entry.event_id
  join public.event_occurrences occurrence
    on occurrence.event_id = event.id
   and replace(occurrence.legacy_id, ':', '-') = stop.legacy_id
  where entry.submission_type = 'event'
)
update public.entry_stops stop
set
  event_id = match.event_id,
  event_occurrence_id = match.occurrence_id,
  updated_at = now()
from exact_matches match
where stop.id = match.stop_id
  and (stop.event_id is distinct from match.event_id
    or stop.event_occurrence_id is distinct from match.occurrence_id);

with single_occurrence_events as (
  select event_id, (array_agg(id order by id))[1] as occurrence_id
  from public.event_occurrences
  group by event_id
  having count(*) = 1
)
update public.entry_stops stop
set
  event_id = entry.event_id,
  event_occurrence_id = occurrence.occurrence_id,
  updated_at = now()
from public.entries entry
join single_occurrence_events occurrence on occurrence.event_id = entry.event_id
where stop.entry_id = entry.id
  and entry.submission_type = 'event'
  and stop.event_occurrence_id is null;

alter table public.entry_stops
  drop constraint if exists entry_stops_event_reference_check;
alter table public.entry_stops
  add constraint entry_stops_event_reference_check
  check (event_occurrence_id is null or event_id is not null) not valid;
alter table public.entry_stops validate constraint entry_stops_event_reference_check;

create or replace function private.validate_entry_stop_event_links()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  parent_entry public.entries%rowtype;
  occurrence_event_id uuid;
begin
  select * into parent_entry
  from public.entries
  where id = new.entry_id;

  if parent_entry.submission_type = 'event'
     and parent_entry.status = 'published'
     and new.event_id is null then
    raise exception 'Published event entry stops must reference their canonical event';
  end if;

  if parent_entry.event_id is not null
     and new.event_id is distinct from parent_entry.event_id then
    raise exception 'Entry stop event_id must match its parent event entry';
  end if;

  if new.event_occurrence_id is not null then
    select event_id into occurrence_event_id
    from public.event_occurrences
    where id = new.event_occurrence_id;

    if occurrence_event_id is distinct from new.event_id then
      raise exception 'Entry stop occurrence must belong to its referenced event';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function private.validate_entry_stop_event_links() from public;

drop trigger if exists entry_stops_validate_event_links on public.entry_stops;
create trigger entry_stops_validate_event_links
before insert or update of entry_id, event_id, event_occurrence_id
on public.entry_stops
for each row execute function private.validate_entry_stop_event_links();

comment on column public.entries.event_id is
  'Canonical event represented by an entry whose submission_type is event. The entry is a render surface, not the event source of truth.';

commit;
