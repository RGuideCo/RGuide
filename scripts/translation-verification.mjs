export async function getTranslationVerificationReport(client, locale) {
  const { rows } = await client.query(
    [
      "with counts as (select",
      "(select count(*) from public.entries where status='published')::int as source_entries,",
      "(select count(*) from public.entry_translations where locale=$1 and translation_status='published')::int as translated_entries,",
      "(select count(*) from public.entry_localized_render_cache where locale=$1 and is_current and render_format='maplist' and render_version=1)::int as cached_entries,",
      "(select count(*) from public.entry_stops stop join public.entries entry on entry.id=stop.entry_id where entry.status='published')::int as source_stops,",
      "(select count(*) from public.entry_stop_translations translation join public.entry_stops stop on stop.id=translation.entry_stop_id join public.entries entry on entry.id=stop.entry_id where translation.locale=$1 and translation.translation_status='published' and entry.status='published')::int as translated_stops,",
      "(select count(*) from public.destinations where is_published)::int as source_destinations,",
      "(select count(*) from public.destination_translations where locale=$1 and translation_status='published')::int as translated_destinations,",
      "(select count(*) from public.destination_descriptions_v2 description join public.destinations destination on destination.id=description.destination_id where description.locale='en' and description.translation_status='published' and destination.is_published)::int as source_destination_descriptions,",
      "(select count(*) from public.destination_descriptions_v2 description join public.destinations destination on destination.id=description.destination_id where description.locale=$1 and description.translation_status='published' and destination.is_published)::int as translated_destination_descriptions,",
      "(select count(*) from public.destination_category_insights insight join public.destinations destination on destination.id=insight.destination_id where insight.locale='en' and insight.is_active and insight.translation_status='published' and destination.is_published)::int as source_insights,",
      "(select count(*) from public.destination_category_insights insight join public.destinations destination on destination.id=insight.destination_id where insight.locale=$1 and insight.is_active and insight.translation_status='published' and destination.is_published)::int as translated_insights,",
      "(select count(*) from public.destination_category_insight_chips chip join public.destination_category_insights insight on insight.id=chip.insight_id join public.destinations destination on destination.id=insight.destination_id where insight.locale='en' and insight.is_active and insight.translation_status='published' and chip.is_active and destination.is_published)::int as source_insight_chips,",
      "(select count(*) from public.destination_category_insight_chips chip join public.destination_category_insights insight on insight.id=chip.insight_id join public.destinations destination on destination.id=insight.destination_id where insight.locale=$1 and insight.is_active and insight.translation_status='published' and chip.is_active and destination.is_published)::int as translated_insight_chips,",
      "(select count(*) from public.destination_category_insight_notes note join public.destination_category_insights insight on insight.id=note.insight_id join public.destinations destination on destination.id=insight.destination_id where insight.locale='en' and insight.is_active and insight.translation_status='published' and note.is_active and destination.is_published)::int as source_insight_notes,",
      "(select count(*) from public.destination_category_insight_notes note join public.destination_category_insights insight on insight.id=note.insight_id join public.destinations destination on destination.id=insight.destination_id where insight.locale=$1 and insight.is_active and insight.translation_status='published' and note.is_active and destination.is_published)::int as translated_insight_notes,",
      "(select count(*) from public.events where status='published')::int as source_events,",
      "(select count(*) from public.event_translations where locale=$1 and translation_status='published')::int as translated_events,",
      "(select count(distinct event_id) from public.weekly_event_publications where event_id is not null and coalesce(ends_at,starts_at)>=now())::int as source_event_cards,",
      "(select count(*) from public.event_localized_render_cache cache where cache.locale=$1 and cache.is_current and cache.render_format='maplist' and cache.render_version=1 and exists(select 1 from public.weekly_event_publications publication where publication.event_id=cache.event_id and coalesce(publication.ends_at,publication.starts_at)>=now()))::int as cached_event_cards,",
      "(select count(*) from public.translation_jobs where locale=$1 and status in ('pending','processing','failed'))::int as open_jobs,",
      "(select count(*) from public.entry_localized_render_cache where locale=$1 and is_current and rendered_payload->>'url' not like ('/' || $1 || '/%'))::int as invalid_entry_urls,",
      "(select count(*) from public.event_localized_render_cache where locale=$1 and is_current and rendered_payload->>'url' not like ('/' || $1 || '/%'))::int as invalid_event_urls,",
      "(select count(*) from public.entry_localized_render_cache cache join public.entry_translations translation on translation.entry_id=cache.entry_id and translation.locale=cache.locale where cache.locale=$1 and cache.is_current and cache.source_hash is distinct from translation.source_hash)::int as stale_entry_caches,",
      "(select count(*) from public.event_localized_render_cache cache join public.event_translations translation on translation.event_id=cache.event_id and translation.locale=cache.locale where cache.locale=$1 and cache.is_current and cache.source_hash is distinct from translation.source_hash)::int as stale_event_caches,",
      "(select count(*) from public.entry_translations translation join public.translation_jobs job on job.root_entity_type='entry' and job.root_entity_id=translation.entry_id and job.locale=translation.locale where translation.locale=$1 and translation.translation_status='published' and translation.source_hash is distinct from job.source_hash)::int as stale_entry_translations,",
      "(select count(*) from public.destination_translations translation join public.translation_jobs job on job.root_entity_type='destination' and job.root_entity_id=translation.destination_id and job.locale=translation.locale where translation.locale=$1 and translation.translation_status='published' and translation.source_hash is distinct from job.source_hash)::int as stale_destination_translations,",
      "(select count(*) from public.event_translations translation join public.translation_jobs job on job.root_entity_type='event' and job.root_entity_id=translation.event_id and job.locale=translation.locale where translation.locale=$1 and translation.translation_status='published' and translation.source_hash is distinct from job.source_hash)::int as stale_event_translations,",
      "(select count(*) from public.event_localized_render_cache event_cache join public.entry_localized_render_cache entry_cache on entry_cache.locale=event_cache.locale and entry_cache.render_format='maplist' and entry_cache.render_version=1 and entry_cache.is_current and entry_cache.rendered_payload->>'id'=event_cache.rendered_payload->>'id' where event_cache.locale=$1 and event_cache.render_format='maplist' and event_cache.render_version=1 and event_cache.is_current and event_cache.rendered_payload->'stops' is distinct from entry_cache.rendered_payload->'stops')::int as mismatched_event_stop_caches",
      ") select counts.*, locale.is_indexable from counts cross join public.content_locales locale where locale.code=$1",
    ].join(" "),
    [locale],
  );
  const counts = rows[0];
  if (!counts) throw new Error(`Locale ${locale} does not exist.`);
  const issues = [];
  const compare = (sourceKey, targetKey, label) => {
    const difference = counts[sourceKey] - counts[targetKey];
    if (difference > 0) issues.push(`${difference} ${label}`);
    if (difference < 0) issues.push(`${Math.abs(difference)} unexpected extra localized rows for ${targetKey}`);
  };
  compare("source_entries", "translated_entries", "published entries lack published translations");
  compare("translated_entries", "cached_entries", "translated entries lack current localized caches");
  compare("source_stops", "translated_stops", "published stops lack published translations");
  compare("source_destinations", "translated_destinations", "destinations lack published route translations");
  compare("source_destination_descriptions", "translated_destination_descriptions", "destination descriptions lack localized rows");
  compare("source_insights", "translated_insights", "destination category insights lack localized rows");
  compare("source_insight_chips", "translated_insight_chips", "destination insight chips lack localized rows");
  compare("source_insight_notes", "translated_insight_notes", "destination insight notes lack localized rows");
  compare("source_events", "translated_events", "events lack published translations");
  compare("source_event_cards", "cached_event_cards", "current event cards lack localized caches");
  if (counts.open_jobs) issues.push(`${counts.open_jobs} translation jobs remain open`);
  if (counts.invalid_entry_urls) issues.push(`${counts.invalid_entry_urls} localized entry caches have invalid URLs`);
  if (counts.invalid_event_urls) issues.push(`${counts.invalid_event_urls} localized event caches have invalid URLs`);
  if (counts.stale_entry_caches) issues.push(`${counts.stale_entry_caches} localized entry caches are stale`);
  if (counts.stale_event_caches) issues.push(`${counts.stale_event_caches} localized event caches are stale`);
  if (counts.stale_entry_translations) issues.push(`${counts.stale_entry_translations} entry translations are stale`);
  if (counts.stale_destination_translations) issues.push(`${counts.stale_destination_translations} destination translations are stale`);
  if (counts.stale_event_translations) issues.push(`${counts.stale_event_translations} event translations are stale`);
  if (counts.mismatched_event_stop_caches) issues.push(`${counts.mismatched_event_stop_caches} localized event caches have stale stop translations`);
  return { ok: issues.length === 0, locale, indexable: counts.is_indexable, counts, issues };
}
