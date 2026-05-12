-- Align Barcelona weekly event taxonomy with the normalized event model.
-- These updates keep event_category filterable on events/publications while
-- preserving the frontend guide category used by MapList cards.

with category_updates (legacy_id, event_category, guide_category) as (
  values
    ('barcelona-2026-05-docsbarcelona', 'Culture', 'Culture'),
    ('barcelona-2026-05-handmade-festival', 'Maker Fair', 'Culture'),
    ('barcelona-2026-05-matsuri', 'Culture Festival', 'Culture'),
    ('barcelona-2026-05-retrobarcelona', 'Gaming', 'Activities')
),
updated_events as (
  update public.events event
  set event_category = category_updates.event_category,
      guide_category = category_updates.guide_category,
      raw_metadata = jsonb_set(
        coalesce(event.raw_metadata, '{}'::jsonb),
        '{rawEvent,category}',
        to_jsonb(category_updates.event_category),
        true
      ),
      updated_at = now()
  from category_updates
  where event.legacy_id = category_updates.legacy_id
  returning event.id, category_updates.event_category, category_updates.guide_category
)
update public.weekly_event_publications publication
set event_category = updated_events.event_category,
    rendered_map_list = jsonb_set(
      jsonb_set(
        coalesce(publication.rendered_map_list, '{}'::jsonb),
        '{category}',
        to_jsonb(updated_events.guide_category)
      ),
      '{submissionType}',
      to_jsonb('event'::text)
    ),
    raw_event = jsonb_set(
      coalesce(publication.raw_event, '{}'::jsonb),
      '{category}',
      to_jsonb(updated_events.event_category),
      true
    ),
    updated_at = now()
from updated_events
where publication.event_id = updated_events.id;
