-- Backfill source rows and publication-level source links for normalized
-- weekly event publications that were inserted before weekly_event_publication
-- became a sourceable entity type.

with publication_sources as (
  select distinct
    publication.id as publication_id,
    publication.event_id,
    publication.raw_event->>'url' as url,
    coalesce(publication.raw_event->>'sourceName', publication.raw_event->>'url') as name,
    publication.sourced_at,
    publication.raw_event
  from public.weekly_event_publications publication
  where publication.submission_type = 'event'
    and publication.raw_event ? 'url'
    and btrim(publication.raw_event->>'url') <> ''
),
upserted_sources as (
  insert into public.sources (
    name,
    url,
    publisher,
    source_type,
    fetched_at,
    sourced_at,
    raw_metadata
  )
  select
    name,
    url,
    name,
    'weekly_event',
    sourced_at,
    sourced_at,
    jsonb_build_object(
      'source', 'weekly_event_publications',
      'eventId', raw_event->>'id'
    )
  from publication_sources
  on conflict (url) do update set
    name = excluded.name,
    publisher = coalesce(excluded.publisher, public.sources.publisher),
    source_type = coalesce(public.sources.source_type, excluded.source_type),
    fetched_at = coalesce(public.sources.fetched_at, excluded.fetched_at),
    sourced_at = greatest(public.sources.sourced_at, excluded.sourced_at),
    raw_metadata = public.sources.raw_metadata || excluded.raw_metadata,
    updated_at = now()
  returning id, url
),
source_lookup as (
  select id, url from upserted_sources
  union
  select source.id, source.url
  from public.sources source
  join publication_sources publication_source on publication_source.url = source.url
),
publication_links as (
  insert into public.entity_sources (
    entity_type,
    entity_id,
    source_id,
    relationship,
    sourced_at,
    raw_metadata
  )
  select
    'weekly_event_publication'::public.rguide_source_entity_type,
    publication_source.publication_id,
    source_lookup.id,
    'official',
    publication_source.sourced_at,
    jsonb_build_object(
      'source', 'weekly_event_publications',
      'eventId', publication_source.raw_event->>'id'
    )
  from publication_sources publication_source
  join source_lookup on source_lookup.url = publication_source.url
  on conflict (entity_type, entity_id, source_id, relationship) do update set
    sourced_at = excluded.sourced_at,
    raw_metadata = public.entity_sources.raw_metadata || excluded.raw_metadata
  returning 1
)
insert into public.entity_sources (
  entity_type,
  entity_id,
  source_id,
  relationship,
  sourced_at,
  raw_metadata
)
select
  'event'::public.rguide_source_entity_type,
  publication_source.event_id,
  source_lookup.id,
  'official',
  publication_source.sourced_at,
  jsonb_build_object(
    'source', 'weekly_event_publications',
    'eventId', publication_source.raw_event->>'id'
  )
from publication_sources publication_source
join source_lookup on source_lookup.url = publication_source.url
where publication_source.event_id is not null
on conflict (entity_type, entity_id, source_id, relationship) do update set
  sourced_at = excluded.sourced_at,
  raw_metadata = public.entity_sources.raw_metadata || excluded.raw_metadata;
