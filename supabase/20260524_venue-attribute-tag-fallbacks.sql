-- Ensure every venue has at least one searchable/filterable attribute tag.
-- These are conservative fallbacks for sparse records where richer text-based
-- classifiers did not find a more specific attribute.

update public.venues venue
set
  attribute_tags = case
    when venue.venue_kind = 'lodging' and venue.lodging_type = 'hostel' then array['social', 'budget']::text[]
    when venue.venue_kind = 'lodging' and venue.lodging_type = 'resort' then array['luxury', 'relaxing']::text[]
    when venue.venue_kind = 'lodging' then array['central']::text[]
    when venue.venue_kind = 'food_drink' then array['casual']::text[]
    when venue.venue_kind = 'nightlife' then array['casual_nightlife']::text[]
    when venue.venue_kind = 'culture' then array['educational']::text[]
    when venue.venue_kind = 'outdoors' then array['walking_route']::text[]
    when venue.venue_kind = 'landmark' then array['quick_stop']::text[]
    when venue.venue_kind = 'retail' then array['local_makers']::text[]
    when venue.venue_kind = 'transport' then array['practical']::text[]
    when venue.venue_kind = 'event_venue' then array['ticketed_activity']::text[]
    when venue.venue_kind = 'service' then array['practical']::text[]
    else array['practical']::text[]
  end,
  updated_at = now()
where venue.merged_into_venue_id is null
  and (venue.attribute_tags is null or cardinality(venue.attribute_tags) = 0);

insert into public.venue_taggings (venue_id, tag_id, confidence, raw_metadata)
select
  venue.id,
  tag.id,
  0.500,
  jsonb_build_object('source', 'venue_attribute_fallback')
from public.venues venue
join public.venue_tags tag on tag.slug = any(venue.attribute_tags)
where venue.merged_into_venue_id is null
on conflict (venue_id, tag_id) do nothing;
