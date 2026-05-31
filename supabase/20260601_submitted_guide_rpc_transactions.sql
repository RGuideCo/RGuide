-- Make submitted-guide entry mutations atomic.
--
-- The API still resolves/dedupes venues before calling these functions, but
-- the entry, stops, and render-cache write now succeed or roll back together.

create extension if not exists pgcrypto;

create or replace function public.save_submitted_guide_transaction(
  p_entry jsonb,
  p_stops jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_entry_id uuid;
  v_legacy_id text := nullif(p_entry->>'legacy_id', '');
  v_user_id uuid := nullif(p_entry->>'user_id', '')::uuid;
  v_stop jsonb;
  v_rendered_payload jsonb;
begin
  if v_legacy_id is null then
    raise exception 'Submitted guide legacy_id is required';
  end if;

  if v_user_id is null then
    raise exception 'Submitted guide user_id is required';
  end if;

  insert into public.entries (
    legacy_id,
    slug,
    seo_slug,
    seo_title,
    seo_description,
    title,
    description,
    highlights,
    photo_url,
    canonical_url,
    category,
    submission_type,
    status,
    destination_id,
    city_id,
    neighborhood_id,
    country_name,
    continent_name,
    creator_id,
    creator_name,
    creator_avatar,
    user_id,
    upvotes,
    created_on,
    journey_start_date,
    journey_end_date,
    journal_visited_at,
    journal_note,
    journal_visibility,
    source_table,
    metadata
  )
  values (
    v_legacy_id,
    nullif(p_entry->>'slug', ''),
    nullif(p_entry->>'seo_slug', ''),
    nullif(p_entry->>'seo_title', ''),
    nullif(p_entry->>'seo_description', ''),
    nullif(p_entry->>'title', ''),
    nullif(p_entry->>'description', ''),
    case
      when jsonb_typeof(p_entry->'highlights') = 'array' then
        array(select jsonb_array_elements_text(p_entry->'highlights'))
      else '{}'::text[]
    end,
    nullif(p_entry->>'photo_url', ''),
    nullif(p_entry->>'canonical_url', ''),
    nullif(p_entry->>'category', ''),
    coalesce(nullif(p_entry->>'submission_type', '')::public.rguide_submission_type, 'guide'::public.rguide_submission_type),
    coalesce(nullif(p_entry->>'status', '')::public.rguide_entry_status, 'draft'::public.rguide_entry_status),
    nullif(p_entry->>'destination_id', '')::uuid,
    nullif(p_entry->>'city_id', '')::uuid,
    nullif(p_entry->>'neighborhood_id', '')::uuid,
    nullif(p_entry->>'country_name', ''),
    nullif(p_entry->>'continent_name', ''),
    nullif(p_entry->>'creator_id', ''),
    nullif(p_entry->>'creator_name', ''),
    nullif(p_entry->>'creator_avatar', ''),
    v_user_id,
    coalesce(nullif(p_entry->>'upvotes', '')::integer, 0),
    coalesce(nullif(p_entry->>'created_on', '')::date, current_date),
    nullif(p_entry->>'journey_start_date', '')::date,
    nullif(p_entry->>'journey_end_date', '')::date,
    nullif(p_entry->>'journal_visited_at', '')::date,
    nullif(p_entry->>'journal_note', ''),
    nullif(p_entry->>'journal_visibility', ''),
    'submitted_guides',
    case
      when jsonb_typeof(p_entry->'metadata') = 'object' then p_entry->'metadata'
      else '{}'::jsonb
    end
  )
  on conflict (legacy_id) do update set
    slug = excluded.slug,
    seo_slug = excluded.seo_slug,
    seo_title = excluded.seo_title,
    seo_description = excluded.seo_description,
    title = excluded.title,
    description = excluded.description,
    highlights = excluded.highlights,
    photo_url = excluded.photo_url,
    canonical_url = excluded.canonical_url,
    category = excluded.category,
    submission_type = excluded.submission_type,
    status = excluded.status,
    destination_id = excluded.destination_id,
    city_id = excluded.city_id,
    neighborhood_id = excluded.neighborhood_id,
    country_name = excluded.country_name,
    continent_name = excluded.continent_name,
    creator_id = excluded.creator_id,
    creator_name = excluded.creator_name,
    creator_avatar = excluded.creator_avatar,
    user_id = excluded.user_id,
    upvotes = excluded.upvotes,
    created_on = excluded.created_on,
    journey_start_date = excluded.journey_start_date,
    journey_end_date = excluded.journey_end_date,
    journal_visited_at = excluded.journal_visited_at,
    journal_note = excluded.journal_note,
    journal_visibility = excluded.journal_visibility,
    source_table = excluded.source_table,
    metadata = excluded.metadata,
    updated_at = now()
  where public.entries.source_table = 'submitted_guides'
    and public.entries.user_id = v_user_id
  returning id into v_entry_id;

  if v_entry_id is null then
    raise exception 'Submitted guide ownership conflict for %', v_legacy_id;
  end if;

  delete from public.entry_stops
  where entry_id = v_entry_id;

  for v_stop in
    select value
    from jsonb_array_elements(
      case
        when jsonb_typeof(p_stops) = 'array' then p_stops
        else '[]'::jsonb
      end
    )
  loop
    insert into public.entry_stops (
      entry_id,
      legacy_id,
      stop_order,
      poi_legacy_id,
      name,
      description,
      category,
      subcategory,
      subcategories,
      destination_id,
      venue_id,
      coordinates,
      price_label,
      price_source,
      booking_url,
      official_url,
      event_time_label,
      event_venue_label,
      journey_date,
      journey_day,
      hours,
      places,
      metadata
    )
    values (
      v_entry_id,
      nullif(v_stop->>'legacy_id', ''),
      coalesce(nullif(v_stop->>'stop_order', '')::integer, 0),
      nullif(v_stop->>'poi_legacy_id', ''),
      nullif(v_stop->>'name', ''),
      nullif(v_stop->>'description', ''),
      nullif(v_stop->>'category', ''),
      nullif(v_stop->>'subcategory', ''),
      case
        when jsonb_typeof(v_stop->'subcategories') = 'array' then v_stop->'subcategories'
        else '[]'::jsonb
      end,
      nullif(v_stop->>'destination_id', '')::uuid,
      nullif(v_stop->>'venue_id', '')::uuid,
      case
        when jsonb_typeof(v_stop->'coordinates') = 'array' then v_stop->'coordinates'
        else null
      end,
      nullif(v_stop->>'price_label', ''),
      nullif(v_stop->>'price_source', ''),
      nullif(v_stop->>'booking_url', ''),
      nullif(v_stop->>'official_url', ''),
      nullif(v_stop->>'event_time_label', ''),
      nullif(v_stop->>'event_venue_label', ''),
      nullif(v_stop->>'journey_date', '')::date,
      nullif(v_stop->>'journey_day', '')::integer,
      case
        when v_stop ? 'hours' and jsonb_typeof(v_stop->'hours') <> 'null' then v_stop->'hours'
        else null
      end,
      case
        when jsonb_typeof(v_stop->'places') = 'array' then v_stop->'places'
        else '[]'::jsonb
      end,
      case
        when jsonb_typeof(v_stop->'metadata') = 'object' then v_stop->'metadata'
        else '{}'::jsonb
      end
    );
  end loop;

  select view.list
  into v_rendered_payload
  from public.entries_maplist view
  where view.id = v_entry_id
  limit 1;

  if v_rendered_payload is null then
    update public.entry_render_cache
    set
      is_current = false,
      stale_at = now(),
      metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('stale_reason', 'submitted_guides_transaction')
    where entry_id = v_entry_id
      and render_format = 'maplist'
      and render_version = 1;
  else
    insert into public.entry_render_cache (
      entry_id,
      render_format,
      render_version,
      rendered_payload,
      source_hash,
      rendered_at,
      stale_at,
      is_current,
      metadata
    )
    values (
      v_entry_id,
      'maplist',
      1,
      v_rendered_payload,
      encode(digest(v_rendered_payload::text, 'sha256'), 'hex'),
      now(),
      null,
      true,
      jsonb_build_object('refreshed_from', 'submitted_guides_transaction')
    )
    on conflict (entry_id, render_format, render_version) do update set
      rendered_payload = excluded.rendered_payload,
      source_hash = excluded.source_hash,
      rendered_at = excluded.rendered_at,
      stale_at = null,
      is_current = true,
      metadata = public.entry_render_cache.metadata || excluded.metadata;
  end if;

  return v_entry_id;
end;
$$;

create or replace function public.delete_submitted_guide_transaction(
  p_entry_id uuid,
  p_user_id uuid
)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_deleted integer;
begin
  delete from public.entries
  where id = p_entry_id
    and user_id = p_user_id
    and source_table = 'submitted_guides';

  get diagnostics v_deleted = row_count;
  return v_deleted > 0;
end;
$$;

revoke all on function public.save_submitted_guide_transaction(jsonb, jsonb) from public;
revoke all on function public.save_submitted_guide_transaction(jsonb, jsonb) from anon;
revoke all on function public.save_submitted_guide_transaction(jsonb, jsonb) from authenticated;
grant execute on function public.save_submitted_guide_transaction(jsonb, jsonb) to service_role;

revoke all on function public.delete_submitted_guide_transaction(uuid, uuid) from public;
revoke all on function public.delete_submitted_guide_transaction(uuid, uuid) from anon;
revoke all on function public.delete_submitted_guide_transaction(uuid, uuid) from authenticated;
grant execute on function public.delete_submitted_guide_transaction(uuid, uuid) to service_role;
