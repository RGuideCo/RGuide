create or replace function private.queue_entry_translation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_entry_id uuid;
  target_status text;
  source_value text;
begin
  if tg_table_name = 'entry_stops' then
    if tg_op = 'DELETE' then
      target_entry_id := old.entry_id;
    else
      target_entry_id := new.entry_id;
    end if;
  elsif tg_table_name = 'entry_render_cache' then
    target_entry_id := new.entry_id;
  elsif tg_table_name = 'entries' then
    if tg_op = 'DELETE' then
      target_entry_id := old.id;
    else
      target_entry_id := new.id;
    end if;
  else
    raise exception 'Unsupported trigger table for queue_entry_translation: %', tg_table_name;
  end if;
  select entry.status::text into target_status
  from public.entries entry
  where entry.id = target_entry_id;

  if target_status <> 'published' then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;

  if tg_table_name = 'entry_render_cache' then
    source_value := new.source_hash;
  else
    select encode(
      extensions.digest(
        coalesce((select view.list::text from public.entries_maplist view where view.id = target_entry_id), target_entry_id::text),
        'sha256'
      ),
      'hex'
    ) into source_value;
  end if;

  perform private.queue_translation_job('entry', target_entry_id, source_value, 200);
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create or replace function private.queue_destination_translation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_destination_id uuid;
  target_locale text;
  source_value text;
begin
  if tg_table_name in ('destination_category_insight_chips', 'destination_category_insight_notes') then
    if tg_op = 'DELETE' then
      select insight.destination_id, insight.locale
      into target_destination_id, target_locale
      from public.destination_category_insights insight
      where insight.id = old.insight_id;
    else
      select insight.destination_id, insight.locale
      into target_destination_id, target_locale
      from public.destination_category_insights insight
      where insight.id = new.insight_id;
    end if;

    if target_locale is distinct from 'en' then
      if tg_op = 'DELETE' then return old; end if;
      return new;
    end if;
  elsif tg_table_name = 'destination_category_insights' then
    if tg_op = 'DELETE' then
      target_destination_id := old.destination_id;
      target_locale := old.locale;
    else
      target_destination_id := new.destination_id;
      target_locale := new.locale;
    end if;

    if target_locale <> 'en' then
      if tg_op = 'DELETE' then return old; end if;
      return new;
    end if;
  elsif tg_table_name = 'destination_descriptions_v2' then
    if tg_op = 'DELETE' then
      target_destination_id := old.destination_id;
      target_locale := old.locale;
    else
      target_destination_id := new.destination_id;
      target_locale := new.locale;
    end if;

    if target_locale <> 'en' then
      if tg_op = 'DELETE' then return old; end if;
      return new;
    end if;
  elsif tg_table_name = 'destinations' then
    if tg_op = 'DELETE' then
      target_destination_id := old.id;
    else
      target_destination_id := new.id;
    end if;
  else
    raise exception 'Unsupported trigger table for queue_destination_translation: %', tg_table_name;
  end if;

  select encode(
    extensions.digest(
      concat_ws('|', destination.name, destination.display_name, destination.slug, destination.updated_at::text,
        coalesce((
          select string_agg(description.description, '|' order by description.description_kind)
          from public.destination_descriptions_v2 description
          where description.destination_id = destination.id and description.locale = 'en'
        ), ''),
        coalesce((
          select jsonb_agg(jsonb_build_object(
            'category', insight.category,
            'label', insight.label,
            'summary', insight.summary,
            'chips', (select jsonb_agg(jsonb_build_object('slug', chip.chip_slug, 'label', chip.label, 'value', chip.filter_value) order by chip.sort_order, chip.chip_slug) from public.destination_category_insight_chips chip where chip.insight_id = insight.id and chip.is_active),
            'notes', (select jsonb_agg(jsonb_build_object('key', note.note_key, 'label', note.label, 'body', note.body) order by note.sort_order, note.note_key) from public.destination_category_insight_notes note where note.insight_id = insight.id and note.is_active)
          ) order by insight.sort_order, insight.category)::text
          from public.destination_category_insights insight
          where insight.destination_id = destination.id
            and insight.locale = 'en'
            and insight.is_active
        ), '')
      ),
      'sha256'
    ),
    'hex'
  ) into source_value
  from public.destinations destination
  where destination.id = target_destination_id
    and destination.is_published;

  if source_value is not null then
    perform private.queue_translation_job('destination', target_destination_id, source_value, 100);
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create or replace function private.queue_event_translation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_event_id uuid;
  target_status text;
  source_value text;
begin
  if tg_table_name in ('event_occurrences', 'event_activations') then
    if tg_op = 'DELETE' then
      target_event_id := old.event_id;
    else
      target_event_id := new.event_id;
    end if;
  elsif tg_table_name = 'weekly_event_publications' then
    if tg_op = 'DELETE' then
      target_event_id := old.event_id;
    else
      target_event_id := new.event_id;
    end if;
  elsif tg_table_name = 'events' then
    if tg_op = 'DELETE' then
      target_event_id := old.id;
    else
      target_event_id := new.id;
    end if;
  else
    raise exception 'Unsupported trigger table for queue_event_translation: %', tg_table_name;
  end if;

  select event.status::text,
         encode(extensions.digest(concat_ws('|', event.title, event.description, event.highlights::text,
           event.event_category, event.updated_at::text,
           coalesce((select jsonb_agg(jsonb_build_object('id', activation.id, 'title', activation.title, 'description', activation.description) order by activation.sort_order, activation.id)::text from public.event_activations activation where activation.event_id = event.id), ''),
           coalesce((select jsonb_agg(jsonb_build_object('id', occurrence.id, 'title', occurrence.title, 'description', occurrence.description) order by occurrence.occurrence_order, occurrence.id)::text from public.event_occurrences occurrence where occurrence.event_id = event.id), ''),
           coalesce((select publication.rendered_map_list::text from public.weekly_event_publications publication where publication.event_id = event.id order by publication.sourced_at desc, publication.updated_at desc limit 1), '')
         ), 'sha256'), 'hex')
  into target_status, source_value
  from public.events event
  where event.id = target_event_id;

  if target_status = 'published' then
    perform private.queue_translation_job('event', target_event_id, source_value, 250);
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

revoke all on function private.queue_entry_translation() from public, anon, authenticated;
revoke all on function private.queue_destination_translation() from public, anon, authenticated;
revoke all on function private.queue_event_translation() from public, anon, authenticated;
