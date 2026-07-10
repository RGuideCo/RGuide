begin;

insert into public.entity_sources (
  entity_type, entity_id, source_id, relationship, sourced_at,
  excerpt, raw_metadata
)
select distinct on (
  occurrence.activation_id,
  source_link.source_id,
  source_link.relationship
)
  'event_activation'::public.rguide_source_entity_type,
  occurrence.activation_id,
  source_link.source_id,
  source_link.relationship,
  source_link.sourced_at,
  source_link.excerpt,
  source_link.raw_metadata || jsonb_build_object(
    'backfilled_from', 'event_occurrence',
    'source_occurrence_id', occurrence.id
  )
from public.event_occurrences occurrence
join public.entity_sources source_link
  on source_link.entity_type = 'event_occurrence'
 and source_link.entity_id = occurrence.id
where occurrence.activation_id is not null
order by
  occurrence.activation_id,
  source_link.source_id,
  source_link.relationship,
  source_link.sourced_at desc
on conflict (entity_type, entity_id, source_id, relationship) do update set
  sourced_at = excluded.sourced_at,
  excerpt = coalesce(excluded.excerpt, public.entity_sources.excerpt),
  raw_metadata = public.entity_sources.raw_metadata || excluded.raw_metadata;

commit;
