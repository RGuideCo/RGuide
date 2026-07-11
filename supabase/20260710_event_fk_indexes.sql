begin;

create index if not exists event_occurrences_activation_event_idx
  on public.event_occurrences(activation_id, event_id);

create index if not exists event_media_activation_event_idx
  on public.event_media(activation_id, event_id)
  where activation_id is not null;

create index if not exists event_media_occurrence_event_idx
  on public.event_media(occurrence_id, event_id)
  where occurrence_id is not null;

commit;
