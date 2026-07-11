begin;

drop policy if exists "Public entity sources are readable by visitors"
  on public.entity_sources;

commit;
