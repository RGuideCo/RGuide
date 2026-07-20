-- Security remediation for public RPCs, distributed API throttling, and
-- extension-owned PostGIS metadata exposed through PostgREST.

create table if not exists private.api_rate_limit_buckets (
  key_hash text not null,
  window_start timestamptz not null,
  request_count integer not null default 1 check (request_count > 0),
  expires_at timestamptz not null,
  primary key (key_hash, window_start),
  check (key_hash ~ '^[0-9a-f]{64}$')
);

alter table private.api_rate_limit_buckets enable row level security;
revoke all on table private.api_rate_limit_buckets from public, anon, authenticated;

create or replace function public.consume_api_rate_limit(
  p_key_hash text,
  p_limit integer,
  p_window_seconds integer
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_window_start timestamptz;
  v_count integer;
  v_reset_at timestamptz;
begin
  if p_key_hash is null or p_key_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid rate-limit key' using errcode = '22023';
  end if;

  if p_limit < 1 or p_limit > 10000 then
    raise exception 'Invalid rate limit' using errcode = '22023';
  end if;

  if p_window_seconds < 1 or p_window_seconds > 86400 then
    raise exception 'Invalid rate-limit window' using errcode = '22023';
  end if;

  v_window_start := to_timestamp(
    floor(extract(epoch from v_now) / p_window_seconds) * p_window_seconds
  );
  v_reset_at := v_window_start + make_interval(secs => p_window_seconds);

  insert into private.api_rate_limit_buckets (
    key_hash,
    window_start,
    request_count,
    expires_at
  )
  values (
    p_key_hash,
    v_window_start,
    1,
    v_reset_at + interval '5 minutes'
  )
  on conflict (key_hash, window_start) do update
  set request_count = private.api_rate_limit_buckets.request_count + 1,
      expires_at = excluded.expires_at
  returning request_count into v_count;

  if random() < 0.01 then
    delete from private.api_rate_limit_buckets
    where expires_at < v_now;
  end if;

  return jsonb_build_object(
    'allowed', v_count <= p_limit,
    'count', v_count,
    'resetAt', floor(extract(epoch from v_reset_at) * 1000)::bigint
  );
end;
$$;

revoke all on function public.consume_api_rate_limit(text, integer, integer)
from public, anon, authenticated;
grant execute on function public.consume_api_rate_limit(text, integer, integer)
to service_role;

revoke all on function public.record_analytics_batch(jsonb)
from public;
grant execute on function public.record_analytics_batch(jsonb)
to anon, authenticated, service_role;

drop policy if exists entry_localized_render_cache_public_read
on public.entry_localized_render_cache;
create policy entry_localized_render_cache_public_read
on public.entry_localized_render_cache for select
to anon, authenticated
using (
  is_current
  and exists (
    select 1
    from public.entries entry
    where entry.id = entry_localized_render_cache.entry_id
      and entry.status = 'published'
      and (
        entry.submission_type <> 'journal'
        or coalesce(entry.journal_visibility, 'public') = 'public'
      )
  )
);

create or replace function private.block_postgis_app_role_mutation()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if current_user in ('anon', 'authenticated') then
    raise exception 'PostGIS metadata is read-only for application roles'
      using errcode = '42501';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

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
  elsif tg_op = 'DELETE' then
    target_entry_id := old.id;
  else
    target_entry_id := new.id;
  end if;

  select entry.status::text into target_status
  from public.entries entry
  where entry.id = target_entry_id;

  if target_status <> 'published' then
    if tg_op = 'DELETE' then
      return old;
    end if;
    return new;
  end if;

  if tg_table_name = 'entry_render_cache' then
    source_value := new.source_hash;
  else
    select encode(
      extensions.digest(
        coalesce(
          (select view.list::text from public.entries_maplist view where view.id = target_entry_id),
          target_entry_id::text
        ),
        'sha256'
      ),
      'hex'
    ) into source_value;
  end if;

  perform private.queue_translation_job('entry', target_entry_id, source_value, 200);

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke all on function private.queue_entry_translation() from public, anon, authenticated;

do $$
begin
  if to_regclass('public.spatial_ref_sys') is not null
     and not exists (
       select 1
       from pg_trigger
       where tgrelid = 'public.spatial_ref_sys'::regclass
         and tgname = 'block_postgis_app_role_mutation'
         and not tgisinternal
     ) then
    execute $trigger$
      create trigger block_postgis_app_role_mutation
      before insert or update or delete or truncate
      on public.spatial_ref_sys
      for each statement
      execute function private.block_postgis_app_role_mutation()
    $trigger$;
  end if;
exception
  when insufficient_privilege then
    raise warning 'Could not install spatial_ref_sys mutation guard; owner-level remediation is required';
end;
$$;

create or replace function private.block_postgis_metadata_view_mutation()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  raise exception 'PostGIS metadata views are read-only'
    using errcode = '42501';
end;
$$;

do $$
declare
  v_view_name text;
begin
  foreach v_view_name in array array['geometry_columns', 'geography_columns']
  loop
    if to_regclass(format('public.%I', v_view_name)) is not null
       and not exists (
         select 1
         from pg_trigger
         where tgrelid = format('public.%I', v_view_name)::regclass
           and tgname = 'block_postgis_metadata_view_mutation'
           and not tgisinternal
       ) then
      begin
        execute format(
          'create trigger block_postgis_metadata_view_mutation instead of insert or update or delete on public.%I for each row execute function private.block_postgis_metadata_view_mutation()',
          v_view_name
        );
      exception
        when insufficient_privilege then
          raise warning 'Could not install mutation guard on public.%', v_view_name;
      end;
    end if;
  end loop;
end;
$$;
