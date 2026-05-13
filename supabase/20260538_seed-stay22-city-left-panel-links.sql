-- Seed Stay22 affiliate links for top Europe city left-panel booking buttons.

do $$
declare
  matched_count integer;
begin
  with seed(slug, country_name, campaign_id, url, label) as (
    values
      ('london', 'United Kingdom', 'LondonLP', 'https://booking.stay22.com/rguide/hN0aP0djwf', 'Find stays in London'),
      ('paris', 'France', 'ParisLP', 'https://booking.stay22.com/rguide/aPYDwK9gOi', 'Find stays in Paris'),
      ('rome', 'Italy', 'RomeLP', 'https://booking.stay22.com/rguide/weXiuuw22U', 'Find stays in Rome'),
      ('barcelona', 'Spain', 'BarcelonaLP', 'https://booking.stay22.com/rguide/9lhd2N64ak', 'Find stays in Barcelona'),
      ('madrid', 'Spain', 'MadridLP', 'https://booking.stay22.com/rguide/4Da8kg-_5x', 'Find stays in Madrid'),
      ('milan', 'Italy', 'MilanLP', 'https://booking.stay22.com/rguide/NeNvTrxffp', 'Find stays in Milan'),
      ('amsterdam', 'Netherlands', 'AmsterdamLP', 'https://booking.stay22.com/rguide/ahy9--8FTa', 'Find stays in Amsterdam'),
      ('berlin', 'Germany', 'BerlinLP', 'https://booking.stay22.com/rguide/rWuh7Tdo5z', 'Find stays in Berlin'),
      ('prague', 'Czech Republic', 'PragueLP', 'https://booking.stay22.com/rguide/U4Q5S4mgTN', 'Find stays in Prague'),
      ('istanbul', 'Turkey', 'IstanbulLP', 'https://booking.stay22.com/rguide/NuUJCj4Ldx', 'Find stays in Istanbul')
  ),
  matched as (
    select destination.id
    from seed
    join public.destinations destination
      on destination.slug = seed.slug
     and destination.country_name = seed.country_name
     and destination.scope = 'city'::public.destination_scope
  )
  select count(*) into matched_count
  from matched;

  if matched_count <> 10 then
    raise exception 'Expected 10 city destinations for Stay22 seed, found %', matched_count;
  end if;

  with seed(slug, country_name, campaign_id, url, label) as (
    values
      ('london', 'United Kingdom', 'LondonLP', 'https://booking.stay22.com/rguide/hN0aP0djwf', 'Find stays in London'),
      ('paris', 'France', 'ParisLP', 'https://booking.stay22.com/rguide/aPYDwK9gOi', 'Find stays in Paris'),
      ('rome', 'Italy', 'RomeLP', 'https://booking.stay22.com/rguide/weXiuuw22U', 'Find stays in Rome'),
      ('barcelona', 'Spain', 'BarcelonaLP', 'https://booking.stay22.com/rguide/9lhd2N64ak', 'Find stays in Barcelona'),
      ('madrid', 'Spain', 'MadridLP', 'https://booking.stay22.com/rguide/4Da8kg-_5x', 'Find stays in Madrid'),
      ('milan', 'Italy', 'MilanLP', 'https://booking.stay22.com/rguide/NeNvTrxffp', 'Find stays in Milan'),
      ('amsterdam', 'Netherlands', 'AmsterdamLP', 'https://booking.stay22.com/rguide/ahy9--8FTa', 'Find stays in Amsterdam'),
      ('berlin', 'Germany', 'BerlinLP', 'https://booking.stay22.com/rguide/rWuh7Tdo5z', 'Find stays in Berlin'),
      ('prague', 'Czech Republic', 'PragueLP', 'https://booking.stay22.com/rguide/U4Q5S4mgTN', 'Find stays in Prague'),
      ('istanbul', 'Turkey', 'IstanbulLP', 'https://booking.stay22.com/rguide/NuUJCj4Ldx', 'Find stays in Istanbul')
  ),
  matched as (
    select
      destination.id as destination_id,
      seed.campaign_id,
      seed.url,
      seed.label
    from seed
    join public.destinations destination
      on destination.slug = seed.slug
     and destination.country_name = seed.country_name
     and destination.scope = 'city'::public.destination_scope
  )
  insert into public.affiliate_links (
    entity_type,
    entity_id,
    placement,
    provider,
    url,
    campaign_id,
    label,
    priority,
    is_active,
    notes,
    raw_metadata
  )
  select
    'destination'::public.rguide_affiliate_entity_type,
    matched.destination_id,
    'city_left_panel'::public.rguide_affiliate_placement,
    'stay22'::public.rguide_affiliate_provider,
    matched.url,
    matched.campaign_id,
    matched.label,
    10,
    true,
    'Stay22 Allez link generated for the city left-panel Book button.',
    jsonb_build_object(
      'source', 'manual_stay22_allez_generator',
      'provider_domain', 'booking.stay22.com'
    )
  from matched
  on conflict (entity_type, entity_id, placement, provider)
  where is_active = true
  do update set
    url = excluded.url,
    campaign_id = excluded.campaign_id,
    label = excluded.label,
    priority = excluded.priority,
    notes = excluded.notes,
    raw_metadata = public.affiliate_links.raw_metadata || excluded.raw_metadata,
    updated_at = now();
end;
$$;
