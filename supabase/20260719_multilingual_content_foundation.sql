begin;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists public.content_locales (
  code text primary key,
  hreflang_code text not null unique,
  english_name text not null,
  native_name text not null,
  direction text not null default 'ltr' check (direction in ('ltr', 'rtl')),
  fallback_locale text references public.content_locales(code) on delete restrict,
  is_default boolean not null default false,
  is_active boolean not null default false,
  is_indexable boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint content_locales_code_format check (code ~ '^[a-z]{2,3}(-[A-Z]{2})?$'),
  constraint content_locales_default_has_no_fallback check (not is_default or fallback_locale is null)
);

create unique index if not exists content_locales_one_default_idx
  on public.content_locales ((is_default))
  where is_default;

drop trigger if exists content_locales_set_updated_at on public.content_locales;
create trigger content_locales_set_updated_at
before update on public.content_locales
for each row execute function public.set_updated_at();

insert into public.content_locales (
  code, hreflang_code, english_name, native_name, direction,
  fallback_locale, is_default, is_active, is_indexable, sort_order
)
values
  ('en', 'en', 'English', 'English', 'ltr', null, true, true, true, 0),
  ('es', 'es', 'Spanish', 'Español', 'ltr', 'en', false, true, false, 10)
on conflict (code) do update set
  hreflang_code = excluded.hreflang_code,
  english_name = excluded.english_name,
  native_name = excluded.native_name,
  direction = excluded.direction,
  fallback_locale = excluded.fallback_locale,
  is_default = excluded.is_default,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

alter table public.destination_descriptions_v2
  add column if not exists translation_status text not null default 'published',
  add column if not exists source_hash text,
  add column if not exists translation_method text not null default 'source',
  add column if not exists translated_at timestamptz,
  add column if not exists published_at timestamptz;

alter table public.destination_category_insights
  add column if not exists translation_status text not null default 'published',
  add column if not exists source_hash text,
  add column if not exists translation_method text not null default 'source',
  add column if not exists translated_at timestamptz,
  add column if not exists published_at timestamptz;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'destination_descriptions_v2_translation_status_check') then
    alter table public.destination_descriptions_v2
      add constraint destination_descriptions_v2_translation_status_check
      check (translation_status in ('draft', 'review', 'published', 'stale', 'rejected'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'destination_descriptions_v2_translation_method_check') then
    alter table public.destination_descriptions_v2
      add constraint destination_descriptions_v2_translation_method_check
      check (translation_method in ('machine', 'human', 'hybrid', 'source'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'destination_category_insights_translation_status_check') then
    alter table public.destination_category_insights
      add constraint destination_category_insights_translation_status_check
      check (translation_status in ('draft', 'review', 'published', 'stale', 'rejected'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'destination_category_insights_translation_method_check') then
    alter table public.destination_category_insights
      add constraint destination_category_insights_translation_method_check
      check (translation_method in ('machine', 'human', 'hybrid', 'source'));
  end if;
end;
$$;

create or replace view public.active_destination_category_insights
with (security_invoker = true) as
select
  insight.id,
  insight.destination_id,
  destination.legacy_id as destination_legacy_id,
  destination.slug as destination_slug,
  destination.name as destination_name,
  destination.scope as destination_scope,
  destination.parent_id,
  parent_destination.legacy_id as parent_destination_legacy_id,
  insight.category,
  insight.locale,
  insight.label,
  insight.summary,
  coalesce(chip_agg.chips, '[]'::jsonb) as chips,
  coalesce(note_agg.notes, '[]'::jsonb) as notes,
  insight.sort_order,
  insight.source_type,
  insight.source_metadata,
  insight.updated_at
from public.destination_category_insights insight
join public.destinations destination on destination.id = insight.destination_id
left join public.destinations parent_destination on parent_destination.id = destination.parent_id
left join lateral (
  select jsonb_agg(
    jsonb_build_object(
      'slug', chip.chip_slug,
      'label', chip.label,
      'filterKind', chip.filter_kind,
      'filterValue', chip.filter_value
    )
    order by chip.sort_order, chip.label
  ) as chips
  from public.destination_category_insight_chips chip
  where chip.insight_id = insight.id
    and chip.is_active
) chip_agg on true
left join lateral (
  select jsonb_agg(
    jsonb_build_object(
      'key', note.note_key,
      'label', note.label,
      'body', note.body
    )
    order by note.sort_order, note.label
  ) as notes
  from public.destination_category_insight_notes note
  where note.insight_id = insight.id
    and note.is_active
) note_agg on true
where insight.is_active
  and insight.translation_status = 'published'
  and destination.is_published;

create table if not exists public.destination_translations (
  destination_id uuid not null references public.destinations(id) on delete cascade,
  locale text not null references public.content_locales(code) on delete restrict,
  display_name text not null,
  slug text not null,
  seo_title text,
  seo_description text,
  translation_status text not null default 'draft'
    check (translation_status in ('draft', 'review', 'published', 'stale', 'rejected')),
  source_hash text not null,
  translation_method text not null default 'machine'
    check (translation_method in ('machine', 'human', 'hybrid', 'source')),
  translated_at timestamptz,
  reviewed_at timestamptz,
  published_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (destination_id, locale),
  constraint destination_translations_non_default check (locale <> 'en'),
  constraint destination_translations_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.entry_translations (
  entry_id uuid not null references public.entries(id) on delete cascade,
  locale text not null references public.content_locales(code) on delete restrict,
  title text not null,
  description text not null,
  highlights text[] not null default '{}',
  seo_slug text not null,
  seo_title text not null,
  seo_description text not null,
  translation_status text not null default 'draft'
    check (translation_status in ('draft', 'review', 'published', 'stale', 'rejected')),
  source_hash text not null,
  translation_method text not null default 'machine'
    check (translation_method in ('machine', 'human', 'hybrid', 'source')),
  translated_at timestamptz,
  reviewed_at timestamptz,
  published_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (entry_id, locale),
  constraint entry_translations_non_default check (locale <> 'en'),
  constraint entry_translations_seo_slug_format check (seo_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint entry_translations_published_fields check (
    translation_status <> 'published'
    or (btrim(title) <> '' and btrim(description) <> '' and btrim(seo_title) <> '' and btrim(seo_description) <> '')
  )
);

create index if not exists destination_translations_slug_idx
  on public.destination_translations(locale, slug);

create table if not exists public.entry_stop_translations (
  entry_stop_id uuid not null references public.entry_stops(id) on delete cascade,
  locale text not null references public.content_locales(code) on delete restrict,
  name text not null,
  description text not null,
  places jsonb not null default '[]'::jsonb,
  translation_status text not null default 'draft'
    check (translation_status in ('draft', 'review', 'published', 'stale', 'rejected')),
  source_hash text not null,
  translation_method text not null default 'machine'
    check (translation_method in ('machine', 'human', 'hybrid', 'source')),
  translated_at timestamptz,
  reviewed_at timestamptz,
  published_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (entry_stop_id, locale),
  constraint entry_stop_translations_non_default check (locale <> 'en'),
  constraint entry_stop_translations_published_fields check (
    translation_status <> 'published' or (btrim(name) <> '' and btrim(description) <> '')
  )
);

create table if not exists public.venue_translations (
  venue_id uuid not null references public.venues(id) on delete cascade,
  locale text not null references public.content_locales(code) on delete restrict,
  display_name text not null,
  description text,
  translation_status text not null default 'draft'
    check (translation_status in ('draft', 'review', 'published', 'stale', 'rejected')),
  source_hash text not null,
  translation_method text not null default 'machine'
    check (translation_method in ('machine', 'human', 'hybrid', 'source')),
  translated_at timestamptz,
  reviewed_at timestamptz,
  published_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (venue_id, locale),
  constraint venue_translations_non_default check (locale <> 'en')
);

create table if not exists public.event_translations (
  event_id uuid not null references public.events(id) on delete cascade,
  locale text not null references public.content_locales(code) on delete restrict,
  title text not null,
  description text not null,
  highlights text[] not null default '{}',
  seo_slug text not null,
  seo_title text not null,
  seo_description text not null,
  translation_status text not null default 'draft'
    check (translation_status in ('draft', 'review', 'published', 'stale', 'rejected')),
  source_hash text not null,
  translation_method text not null default 'machine'
    check (translation_method in ('machine', 'human', 'hybrid', 'source')),
  translated_at timestamptz,
  reviewed_at timestamptz,
  published_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (event_id, locale),
  constraint event_translations_non_default check (locale <> 'en'),
  constraint event_translations_seo_slug_format check (seo_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.event_activation_translations (
  event_activation_id uuid not null references public.event_activations(id) on delete cascade,
  locale text not null references public.content_locales(code) on delete restrict,
  title text not null,
  description text,
  translation_status text not null default 'draft'
    check (translation_status in ('draft', 'review', 'published', 'stale', 'rejected')),
  source_hash text not null,
  translation_method text not null default 'machine'
    check (translation_method in ('machine', 'human', 'hybrid', 'source')),
  translated_at timestamptz,
  reviewed_at timestamptz,
  published_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (event_activation_id, locale),
  constraint event_activation_translations_non_default check (locale <> 'en')
);

create table if not exists public.event_occurrence_translations (
  event_occurrence_id uuid not null references public.event_occurrences(id) on delete cascade,
  locale text not null references public.content_locales(code) on delete restrict,
  title text,
  description text,
  translation_status text not null default 'draft'
    check (translation_status in ('draft', 'review', 'published', 'stale', 'rejected')),
  source_hash text not null,
  translation_method text not null default 'machine'
    check (translation_method in ('machine', 'human', 'hybrid', 'source')),
  translated_at timestamptz,
  reviewed_at timestamptz,
  published_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (event_occurrence_id, locale),
  constraint event_occurrence_translations_non_default check (locale <> 'en')
);

create table if not exists public.entry_localized_render_cache (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries(id) on delete cascade,
  locale text not null references public.content_locales(code) on delete restrict,
  render_format text not null default 'maplist',
  render_version integer not null default 1 check (render_version > 0),
  rendered_payload jsonb not null,
  source_hash text not null,
  rendered_at timestamptz not null default now(),
  stale_at timestamptz,
  is_current boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (entry_id, locale, render_format, render_version),
  constraint entry_localized_render_cache_non_default check (locale <> 'en')
);

create table if not exists public.event_localized_render_cache (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  locale text not null references public.content_locales(code) on delete restrict,
  render_format text not null default 'maplist',
  render_version integer not null default 1 check (render_version > 0),
  rendered_payload jsonb not null,
  source_hash text not null,
  rendered_at timestamptz not null default now(),
  stale_at timestamptz,
  is_current boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, locale, render_format, render_version),
  constraint event_localized_render_cache_non_default check (locale <> 'en')
);

create table if not exists public.translation_jobs (
  id uuid primary key default gen_random_uuid(),
  root_entity_type text not null
    check (root_entity_type in ('destination', 'entry', 'event')),
  root_entity_id uuid not null,
  locale text not null references public.content_locales(code) on delete restrict,
  source_hash text not null,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  priority integer not null default 100 check (priority >= 0),
  attempts integer not null default 0 check (attempts >= 0),
  max_attempts integer not null default 5 check (max_attempts > 0),
  next_attempt_at timestamptz not null default now(),
  leased_at timestamptz,
  leased_by text,
  last_error text,
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (root_entity_type, root_entity_id, locale),
  constraint translation_jobs_non_default check (locale <> 'en')
);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'destination_translations',
    'entry_translations',
    'entry_stop_translations',
    'venue_translations',
    'event_translations',
    'event_activation_translations',
    'event_occurrence_translations',
    'entry_localized_render_cache',
    'event_localized_render_cache',
    'translation_jobs'
  ] loop
    execute format('drop trigger if exists %I_set_updated_at on public.%I', table_name, table_name);
    execute format(
      'create trigger %I_set_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      table_name,
      table_name
    );
  end loop;
end;
$$;

create index if not exists destination_translations_published_idx
  on public.destination_translations(locale, destination_id)
  where translation_status = 'published';
create index if not exists entry_translations_published_idx
  on public.entry_translations(locale, entry_id)
  where translation_status = 'published';
create index if not exists entry_stop_translations_published_idx
  on public.entry_stop_translations(locale, entry_stop_id)
  where translation_status = 'published';
create index if not exists venue_translations_published_idx
  on public.venue_translations(locale, venue_id)
  where translation_status = 'published';
create index if not exists event_translations_published_idx
  on public.event_translations(locale, event_id)
  where translation_status = 'published';
create index if not exists entry_localized_render_cache_current_idx
  on public.entry_localized_render_cache(locale, render_format, render_version, entry_id)
  where is_current;
create index if not exists entry_localized_render_cache_payload_gin_idx
  on public.entry_localized_render_cache using gin (rendered_payload);
create index if not exists event_localized_render_cache_current_idx
  on public.event_localized_render_cache(locale, render_format, render_version, event_id)
  where is_current;
create index if not exists translation_jobs_claim_idx
  on public.translation_jobs(status, next_attempt_at, priority desc, created_at)
  where status in ('pending', 'failed', 'processing');

create or replace function private.queue_translation_job(
  target_type text,
  target_id uuid,
  target_source_hash text,
  target_priority integer default 100
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.translation_jobs (
    root_entity_type,
    root_entity_id,
    locale,
    source_hash,
    status,
    priority,
    attempts,
    next_attempt_at,
    leased_at,
    leased_by,
    last_error,
    completed_at
  )
  select
    target_type,
    target_id,
    locale.code,
    target_source_hash,
    'pending',
    target_priority,
    0,
    now(),
    null,
    null,
    null,
    null
  from public.content_locales locale
  where locale.is_active
    and not locale.is_default
  on conflict (root_entity_type, root_entity_id, locale) do update set
    source_hash = excluded.source_hash,
    status = 'pending',
    priority = greatest(public.translation_jobs.priority, excluded.priority),
    attempts = 0,
    next_attempt_at = now(),
    leased_at = null,
    leased_by = null,
    last_error = null,
    completed_at = null,
    updated_at = now()
  where public.translation_jobs.source_hash is distinct from excluded.source_hash
     or public.translation_jobs.status in ('failed', 'cancelled');
end;
$$;

revoke all on function private.queue_translation_job(text, uuid, text, integer)
  from public, anon, authenticated;

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
  target_entry_id := case
    when tg_table_name = 'entry_stops' and tg_op = 'DELETE' then old.entry_id
    when tg_table_name = 'entry_stops' then new.entry_id
    when tg_table_name = 'entry_render_cache' then new.entry_id
    when tg_op = 'DELETE' then old.id
    else new.id
  end;
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
      public.digest(
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
  target_destination_id := case
    when tg_table_name = 'destination_descriptions_v2' and tg_op = 'DELETE' then old.destination_id
    when tg_table_name = 'destination_descriptions_v2' then new.destination_id
    when tg_table_name = 'destination_category_insights' and tg_op = 'DELETE' then old.destination_id
    when tg_table_name = 'destination_category_insights' then new.destination_id
    when tg_table_name in ('destination_category_insight_chips', 'destination_category_insight_notes') then null
    when tg_op = 'DELETE' then old.id
    else new.id
  end;

  if tg_table_name = 'destination_descriptions_v2'
     and (case when tg_op = 'DELETE' then old.locale else new.locale end) <> 'en' then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;

  if tg_table_name = 'destination_category_insights'
     and (case when tg_op = 'DELETE' then old.locale else new.locale end) <> 'en' then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;

  if tg_table_name in ('destination_category_insight_chips', 'destination_category_insight_notes') then
    select insight.destination_id, insight.locale
    into target_destination_id, target_locale
    from public.destination_category_insights insight
    where insight.id = case when tg_op = 'DELETE' then old.insight_id else new.insight_id end;
    if target_locale <> 'en' then
      if tg_op = 'DELETE' then return old; end if;
      return new;
    end if;
  end if;

  select encode(
    public.digest(
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
  target_event_id := case
    when tg_table_name in ('event_occurrences', 'event_activations') and tg_op = 'DELETE' then old.event_id
    when tg_table_name in ('event_occurrences', 'event_activations') then new.event_id
    when tg_table_name = 'weekly_event_publications' and tg_op = 'DELETE' then old.event_id
    when tg_table_name = 'weekly_event_publications' then new.event_id
    when tg_op = 'DELETE' then old.id
    else new.id
  end;

  select event.status::text,
         encode(public.digest(concat_ws('|', event.title, event.description, event.highlights::text,
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

create or replace function private.validate_entry_translation_route()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (
    select 1
    from public.entry_translations candidate_translation
    join public.entries candidate_entry on candidate_entry.id = candidate_translation.entry_id
    join public.entries target_entry on target_entry.id = new.entry_id
    where candidate_translation.locale = new.locale
      and candidate_translation.seo_slug = new.seo_slug
      and candidate_translation.entry_id <> new.entry_id
      and candidate_entry.city_id is not distinct from target_entry.city_id
      and candidate_entry.neighborhood_id is not distinct from target_entry.neighborhood_id
      and candidate_entry.category = target_entry.category
  ) then
    raise exception 'Localized entry route already exists for locale %, slug %', new.locale, new.seo_slug
      using errcode = '23505';
  end if;
  return new;
end;
$$;

revoke all on function private.validate_entry_translation_route() from public, anon, authenticated;

drop trigger if exists validate_entry_translation_route on public.entry_translations;
create trigger validate_entry_translation_route
before insert or update of locale, seo_slug, entry_id
on public.entry_translations for each row execute function private.validate_entry_translation_route();

drop trigger if exists queue_entry_translation_on_entry on public.entries;
create trigger queue_entry_translation_on_entry
after insert or update of title, description, highlights, seo_slug, seo_title, seo_description, status
on public.entries for each row execute function private.queue_entry_translation();

drop trigger if exists queue_entry_translation_on_stop on public.entry_stops;
create trigger queue_entry_translation_on_stop
after insert or update of name, description, places, metadata
on public.entry_stops for each row execute function private.queue_entry_translation();

drop trigger if exists queue_entry_translation_on_stop_delete on public.entry_stops;
create trigger queue_entry_translation_on_stop_delete
after delete on public.entry_stops for each row execute function private.queue_entry_translation();

drop trigger if exists queue_entry_translation_on_render_cache on public.entry_render_cache;
create trigger queue_entry_translation_on_render_cache
after insert or update of rendered_payload, source_hash, is_current
on public.entry_render_cache for each row
when (new.is_current)
execute function private.queue_entry_translation();

drop trigger if exists queue_destination_translation_on_destination on public.destinations;
create trigger queue_destination_translation_on_destination
after insert or update of name, display_name, slug, is_published
on public.destinations for each row execute function private.queue_destination_translation();

drop trigger if exists queue_destination_translation_on_description on public.destination_descriptions_v2;
create trigger queue_destination_translation_on_description
after insert or update of title, summary, description, metadata
on public.destination_descriptions_v2 for each row execute function private.queue_destination_translation();

drop trigger if exists queue_destination_translation_on_description_delete on public.destination_descriptions_v2;
create trigger queue_destination_translation_on_description_delete
after delete on public.destination_descriptions_v2 for each row execute function private.queue_destination_translation();

drop trigger if exists queue_destination_translation_on_insight on public.destination_category_insights;
create trigger queue_destination_translation_on_insight
after insert or update of label, summary, is_active
on public.destination_category_insights for each row execute function private.queue_destination_translation();

drop trigger if exists queue_destination_translation_on_insight_delete on public.destination_category_insights;
create trigger queue_destination_translation_on_insight_delete
after delete on public.destination_category_insights for each row execute function private.queue_destination_translation();

drop trigger if exists queue_destination_translation_on_insight_chip on public.destination_category_insight_chips;
create trigger queue_destination_translation_on_insight_chip
after insert or update of label, filter_value, is_active
on public.destination_category_insight_chips for each row execute function private.queue_destination_translation();

drop trigger if exists queue_destination_translation_on_insight_chip_delete on public.destination_category_insight_chips;
create trigger queue_destination_translation_on_insight_chip_delete
after delete on public.destination_category_insight_chips for each row execute function private.queue_destination_translation();

drop trigger if exists queue_destination_translation_on_insight_note on public.destination_category_insight_notes;
create trigger queue_destination_translation_on_insight_note
after insert or update of label, body, is_active
on public.destination_category_insight_notes for each row execute function private.queue_destination_translation();

drop trigger if exists queue_destination_translation_on_insight_note_delete on public.destination_category_insight_notes;
create trigger queue_destination_translation_on_insight_note_delete
after delete on public.destination_category_insight_notes for each row execute function private.queue_destination_translation();

drop trigger if exists queue_event_translation_on_event on public.events;
create trigger queue_event_translation_on_event
after insert or update of title, description, highlights, event_category, status
on public.events for each row execute function private.queue_event_translation();

drop trigger if exists queue_event_translation_on_activation on public.event_activations;
create trigger queue_event_translation_on_activation
after insert or update of title, description
on public.event_activations for each row execute function private.queue_event_translation();

drop trigger if exists queue_event_translation_on_activation_delete on public.event_activations;
create trigger queue_event_translation_on_activation_delete
after delete on public.event_activations for each row execute function private.queue_event_translation();

drop trigger if exists queue_event_translation_on_occurrence on public.event_occurrences;
create trigger queue_event_translation_on_occurrence
after insert or update of title, description
on public.event_occurrences for each row execute function private.queue_event_translation();

drop trigger if exists queue_event_translation_on_occurrence_delete on public.event_occurrences;
create trigger queue_event_translation_on_occurrence_delete
after delete on public.event_occurrences for each row execute function private.queue_event_translation();

drop trigger if exists queue_event_translation_on_publication on public.weekly_event_publications;
create trigger queue_event_translation_on_publication
after insert or update of rendered_map_list, event_category, has_schedule, is_festival, starts_at, ends_at
on public.weekly_event_publications for each row execute function private.queue_event_translation();

drop trigger if exists queue_event_translation_on_publication_delete on public.weekly_event_publications;
create trigger queue_event_translation_on_publication_delete
after delete on public.weekly_event_publications for each row execute function private.queue_event_translation();

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'content_locales',
    'destination_translations',
    'entry_translations',
    'entry_stop_translations',
    'venue_translations',
    'event_translations',
    'event_activation_translations',
    'event_occurrence_translations',
    'entry_localized_render_cache',
    'event_localized_render_cache',
    'translation_jobs'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end;
$$;

drop policy if exists "Published destination descriptions are readable" on public.destination_descriptions_v2;
create policy "Published destination descriptions are readable"
on public.destination_descriptions_v2 for select
to anon, authenticated
using (
  translation_status = 'published'
  and exists (
    select 1 from public.destinations destination
    where destination.id = destination_descriptions_v2.destination_id
      and destination.is_published
  )
);

drop policy if exists "Active destination category insights are readable" on public.destination_category_insights;
create policy "Active destination category insights are readable"
on public.destination_category_insights for select
to anon, authenticated
using (
  is_active
  and translation_status = 'published'
  and exists (
    select 1 from public.destinations destination
    where destination.id = destination_category_insights.destination_id
      and destination.is_published
  )
);

drop policy if exists "Active destination category insight chips are readable" on public.destination_category_insight_chips;
create policy "Active destination category insight chips are readable"
on public.destination_category_insight_chips for select
to anon, authenticated
using (
  is_active
  and exists (
    select 1
    from public.destination_category_insights insight
    join public.destinations destination on destination.id = insight.destination_id
    where insight.id = destination_category_insight_chips.insight_id
      and insight.is_active
      and insight.translation_status = 'published'
      and destination.is_published
  )
);

drop policy if exists "Active destination category insight notes are readable" on public.destination_category_insight_notes;
create policy "Active destination category insight notes are readable"
on public.destination_category_insight_notes for select
to anon, authenticated
using (
  is_active
  and exists (
    select 1
    from public.destination_category_insights insight
    join public.destinations destination on destination.id = insight.destination_id
    where insight.id = destination_category_insight_notes.insight_id
      and insight.is_active
      and insight.translation_status = 'published'
      and destination.is_published
  )
);

drop policy if exists content_locales_public_read on public.content_locales;
create policy content_locales_public_read
on public.content_locales for select
to anon, authenticated
using (is_active);

drop policy if exists destination_translations_public_read on public.destination_translations;
create policy destination_translations_public_read
on public.destination_translations for select
to anon, authenticated
using (
  translation_status = 'published'
  and exists (
    select 1 from public.destinations destination
    where destination.id = destination_translations.destination_id
      and destination.is_published
  )
);

drop policy if exists entry_translations_public_read on public.entry_translations;
create policy entry_translations_public_read
on public.entry_translations for select
to anon, authenticated
using (
  translation_status = 'published'
  and exists (
    select 1 from public.entries entry
    where entry.id = entry_translations.entry_id
      and entry.status = 'published'
  )
);

drop policy if exists entry_stop_translations_public_read on public.entry_stop_translations;
create policy entry_stop_translations_public_read
on public.entry_stop_translations for select
to anon, authenticated
using (
  translation_status = 'published'
  and exists (
    select 1
    from public.entry_stops stop
    join public.entries entry on entry.id = stop.entry_id
    where stop.id = entry_stop_translations.entry_stop_id
      and entry.status = 'published'
  )
);

drop policy if exists venue_translations_public_read on public.venue_translations;
create policy venue_translations_public_read
on public.venue_translations for select
to anon, authenticated
using (translation_status = 'published');

drop policy if exists event_translations_public_read on public.event_translations;
create policy event_translations_public_read
on public.event_translations for select
to anon, authenticated
using (
  translation_status = 'published'
  and exists (select 1 from public.events event where event.id = event_translations.event_id and event.status = 'published')
);

drop policy if exists event_activation_translations_public_read on public.event_activation_translations;
create policy event_activation_translations_public_read
on public.event_activation_translations for select
to anon, authenticated
using (
  translation_status = 'published'
  and exists (
    select 1
    from public.event_activations activation
    join public.events event on event.id = activation.event_id
    where activation.id = event_activation_translations.event_activation_id
      and event.status = 'published'
  )
);

drop policy if exists event_occurrence_translations_public_read on public.event_occurrence_translations;
create policy event_occurrence_translations_public_read
on public.event_occurrence_translations for select
to anon, authenticated
using (
  translation_status = 'published'
  and exists (
    select 1
    from public.event_occurrences occurrence
    join public.events event on event.id = occurrence.event_id
    where occurrence.id = event_occurrence_translations.event_occurrence_id
      and event.status = 'published'
  )
);

drop policy if exists entry_localized_render_cache_public_read on public.entry_localized_render_cache;
create policy entry_localized_render_cache_public_read
on public.entry_localized_render_cache for select
to anon, authenticated
using (
  is_current
  and exists (
    select 1 from public.entries entry
    where entry.id = entry_localized_render_cache.entry_id
      and entry.status = 'published'
  )
);

drop policy if exists event_localized_render_cache_public_read on public.event_localized_render_cache;
create policy event_localized_render_cache_public_read
on public.event_localized_render_cache for select
to anon, authenticated
using (
  is_current
  and exists (
    select 1 from public.events event
    where event.id = event_localized_render_cache.event_id
      and event.status = 'published'
  )
);

revoke all on table
  public.content_locales,
  public.destination_translations,
  public.entry_translations,
  public.entry_stop_translations,
  public.venue_translations,
  public.event_translations,
  public.event_activation_translations,
  public.event_occurrence_translations,
  public.entry_localized_render_cache,
  public.event_localized_render_cache,
  public.translation_jobs
from anon, authenticated;

grant select on table
  public.content_locales,
  public.destination_translations,
  public.entry_translations,
  public.entry_stop_translations,
  public.venue_translations,
  public.event_translations,
  public.event_activation_translations,
  public.event_occurrence_translations,
  public.entry_localized_render_cache,
  public.event_localized_render_cache
to anon, authenticated;

grant all on table
  public.content_locales,
  public.destination_translations,
  public.entry_translations,
  public.entry_stop_translations,
  public.venue_translations,
  public.event_translations,
  public.event_activation_translations,
  public.event_occurrence_translations,
  public.entry_localized_render_cache,
  public.event_localized_render_cache,
  public.translation_jobs
to service_role;

comment on table public.entry_translations is
  'Normalized localized entry copy. English remains canonical in public.entries.';
comment on table public.entry_stop_translations is
  'Localized guide-stop copy keyed to the canonical normalized entry stop.';
comment on table public.entry_localized_render_cache is
  'Derived locale-aware MapList payloads. Never use this table as authored content.';
comment on table public.translation_jobs is
  'Private operational queue. Public clients receive no privileges or policies.';

commit;
