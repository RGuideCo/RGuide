-- Use the reviewed manual Hackney polygon as the active neighborhood boundary.
--
-- This intentionally stores the same geometry in `geometry` and
-- `simplified_geometry` so the map API renders the reviewed shape exactly.

with selected_destination as (
  select
    neighborhood.id as destination_id,
    city.id as city_id
  from public.destinations city
  join public.destinations neighborhood
    on neighborhood.parent_id = city.id
   and neighborhood.scope = 'neighborhood'::public.destination_scope
   and neighborhood.slug = 'hackney'
  where city.scope = 'city'::public.destination_scope
    and city.slug = 'london'
  order by city.is_published desc, city.created_at asc
  limit 1
),
incoming as (
  select
    st_multi(
      st_setsrid(
        st_makevalid(
          st_geomfromgeojson(
            '{"type":"Polygon","coordinates":[[[-0.055123,51.545871],[-0.055215,51.547187],[-0.059815,51.549475],[-0.063494,51.548331],[-0.068175,51.548286],[-0.068844,51.547757],[-0.069635,51.546131],[-0.07,51.543106],[-0.070182,51.535844],[-0.062156,51.535542],[-0.060818,51.534634],[-0.059541,51.534256],[-0.05723,51.534369],[-0.056926,51.535579],[-0.044826,51.538076],[-0.045616,51.539702],[-0.046285,51.539778],[-0.047258,51.541026],[-0.047877,51.541529],[-0.04872,51.541637],[-0.048836,51.542577],[-0.047267,51.543516],[-0.046105,51.545016],[-0.046222,51.545594],[-0.046715,51.546262],[-0.047122,51.546641],[-0.047935,51.546804],[-0.049533,51.547057],[-0.050376,51.547201],[-0.052235,51.546732],[-0.054152,51.546226],[-0.05514,51.545883],[-0.055123,51.545871]]]}'
          )
        ),
        4326
      )
    )::public.geometry(MultiPolygon, 4326) as geometry
),
prepared as (
  select
    selected_destination.destination_id,
    selected_destination.city_id,
    'london::hackney'::text as boundary_key,
    incoming.geometry,
    incoming.geometry as simplified_geometry,
    jsonb_build_array(
      jsonb_build_array(st_ymin(st_envelope(incoming.geometry)), st_xmin(st_envelope(incoming.geometry))),
      jsonb_build_array(st_ymax(st_envelope(incoming.geometry)), st_xmax(st_envelope(incoming.geometry)))
    ) as bounds,
    jsonb_build_array(st_y(st_pointonsurface(incoming.geometry)), st_x(st_pointonsurface(incoming.geometry))) as centroid
  from selected_destination
  cross join incoming
  where not st_isempty(incoming.geometry)
)
insert into public.destination_boundaries (
  destination_id,
  city_id,
  boundary_key,
  geometry,
  simplified_geometry,
  bounds,
  centroid,
  source_name,
  source_url,
  source_license,
  source_metadata,
  quality_score,
  simplification_tolerance,
  is_active,
  verified_at
)
select
  destination_id,
  city_id,
  boundary_key,
  geometry,
  simplified_geometry,
  bounds,
  centroid,
  'RGuide local boundary draft tool',
  null,
  null,
  jsonb_build_object(
    'sourceId', 'user-drawn-hackney-boundary-draft',
    'provider', 'RGuide local boundary draft tool',
    'datasetUrl', null,
    'format', 'manual-draft',
    'matchField', 'user-drawn polygon',
    'notes', 'User-drawn draft export for review; not official neighborhood boundary data.',
    'labels', jsonb_build_array('Hackney'),
    'cityId', 'london',
    'propertyId', 'london::hackney',
    'displayName', 'Hackney, London, United Kingdom',
    'parentName', null,
    'boundaryNotes', 'Manual local draft drawn in the Hackney boundary tool after comparing against the map label area. Not an official neighborhood boundary source.'
  ),
  null,
  0,
  true,
  now()
from prepared
on conflict (destination_id, boundary_key) do update set
  city_id = excluded.city_id,
  geometry = excluded.geometry,
  simplified_geometry = excluded.simplified_geometry,
  bounds = excluded.bounds,
  centroid = excluded.centroid,
  source_name = excluded.source_name,
  source_url = excluded.source_url,
  source_license = excluded.source_license,
  source_metadata = excluded.source_metadata,
  quality_score = excluded.quality_score,
  simplification_tolerance = excluded.simplification_tolerance,
  is_active = true,
  verified_at = excluded.verified_at,
  updated_at = now();
