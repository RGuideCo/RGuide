-- Archive legacy JSON/blob tables outside the public runtime schema.
--
-- The normalized runtime uses:
--   destinations, destination_descriptions_v2, entries, entry_stops,
--   events, event_occurrences, venues, sources, entity_sources,
--   entry_render_cache, and weekly_event_publications.
--
-- These legacy tables are retained only as database backup material.

create schema if not exists legacy_archive;

revoke all on schema legacy_archive from public;
revoke all on schema legacy_archive from anon;
revoke all on schema legacy_archive from authenticated;
grant usage on schema legacy_archive to postgres;
grant usage on schema legacy_archive to service_role;

do $$
declare
  legacy_table text;
begin
  foreach legacy_table in array array[
    'editorial_guides',
    'weekly_event_guides',
    'destination_descriptions',
    'submitted_guides'
  ]
  loop
    if to_regclass(format('public.%I', legacy_table)) is not null then
      execute format('alter table public.%I set schema legacy_archive', legacy_table);
      execute format(
        'comment on table legacy_archive.%I is %L',
        legacy_table,
        'Archived legacy rGuide JSON/blob table. Not part of the live app read/write path.'
      );
    end if;
  end loop;
end;
$$;

revoke all on all tables in schema legacy_archive from public;
revoke all on all tables in schema legacy_archive from anon;
revoke all on all tables in schema legacy_archive from authenticated;
grant select on all tables in schema legacy_archive to postgres;
grant select on all tables in schema legacy_archive to service_role;
