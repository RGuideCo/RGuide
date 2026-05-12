-- Link seeded Barcelona venue-calendar discovery sources to canonical venues
-- after venue slug normalization.

update public.event_discovery_sources discovery_source
set venue_id = venue.id,
    updated_at = now()
from public.venues venue
join public.destinations city on city.id = venue.city_id
where city.slug = 'barcelona'
  and venue.slug = 'poi-spain-barcelona-sala-apolo'
  and discovery_source.city_id = city.id
  and discovery_source.slug = 'sala-apolo-calendar';
