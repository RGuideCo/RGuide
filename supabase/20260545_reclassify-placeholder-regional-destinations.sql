-- Reclassify generated regional placeholders that were accidentally stored
-- as city destinations. Real cities should remain scope = 'city'; regional
-- placeholders such as "North Albania" belong under their country as
-- scope = 'region' and should stay unpublished until they have real copy.

with placeholder_city_regions as (
  select distinct
    destination.id,
    destination.slug,
    destination.name,
    destination.country_name,
    destination.country_code,
    country.id as country_id,
    existing_region.id as existing_region_id
  from public.destinations destination
  join public.destination_descriptions_v2 description
    on description.destination_id = destination.id
  join public.destinations country
    on country.scope = 'country'::public.destination_scope
   and (
     (
       destination.country_code is not null
       and country.country_code is not null
       and lower(country.country_code) = lower(destination.country_code)
     )
     or (
       destination.country_name is not null
       and lower(country.name) = lower(destination.country_name)
     )
   )
  left join public.destinations existing_region
    on existing_region.parent_id = country.id
   and existing_region.scope = 'region'::public.destination_scope
   and existing_region.slug = destination.slug
   and existing_region.id <> destination.id
  where destination.scope = 'city'::public.destination_scope
    and destination.country_name is not null
    and destination.name ~* '^(north|south|east|west|central|northeast|northwest|southeast|southwest|northern|southern|eastern|western)\\s+'
    and (
      destination.description ilike 'Placeholder regional guide data for %'
      or description.description ilike 'Placeholder regional guide data for %'
      or description.summary ilike 'Placeholder regional guide data for %'
    )
),
promoted_regions as (
  update public.destinations destination
  set
    scope = 'region'::public.destination_scope,
    parent_id = placeholder.country_id,
    region_name = destination.name,
    city_name = null,
    neighborhood_name = null,
    is_published = false,
    metadata = destination.metadata || jsonb_build_object(
      'reclassified_from_scope', 'city',
      'reclassified_to_scope', 'region',
      'reclassified_reason', 'generated regional placeholder stored as city',
      'reclassified_at', now()
    ),
    updated_at = now()
  from placeholder_city_regions placeholder
  where destination.id = placeholder.id
    and placeholder.existing_region_id is null
  returning destination.id
),
copied_duplicate_descriptions as (
  insert into public.destination_descriptions_v2 (
    destination_id,
    locale,
    title,
    summary,
    description,
    description_kind,
    is_primary,
    metadata
  )
  select
    placeholder.existing_region_id,
    description.locale,
    description.title,
    description.summary,
    description.description,
    description.description_kind,
    description.is_primary,
    description.metadata || jsonb_build_object(
      'copied_from_placeholder_destination_id', placeholder.id,
      'copied_reason', 'duplicate placeholder city matched existing region',
      'copied_at', now()
    )
  from placeholder_city_regions placeholder
  join public.destination_descriptions_v2 description
    on description.destination_id = placeholder.id
  where placeholder.existing_region_id is not null
  on conflict (destination_id, locale, description_kind) do nothing
  returning destination_id
),
archived_duplicate_placeholders as (
  update public.destinations destination
  set
    is_published = false,
    metadata = destination.metadata || jsonb_build_object(
      'archived_reason', 'duplicate placeholder city matched existing region',
      'duplicate_of_region_id', placeholder.existing_region_id,
      'archived_at', now()
    ),
    updated_at = now()
  from placeholder_city_regions placeholder
  where destination.id = placeholder.id
    and placeholder.existing_region_id is not null
  returning destination.id
)
select
  (select count(*) from placeholder_city_regions) as placeholder_city_region_count,
  (select count(*) from promoted_regions) as promoted_region_count,
  (select count(*) from copied_duplicate_descriptions) as copied_duplicate_description_count,
  (select count(*) from archived_duplicate_placeholders) as archived_duplicate_placeholder_count;
