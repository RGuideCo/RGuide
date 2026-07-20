import process from "node:process";

import { createDatabaseClient, loadProjectEnv, parseArgs } from "./i18n-utils.mjs";

async function main() {
  loadProjectEnv();
  const options = parseArgs(process.argv.slice(2));
  const client = createDatabaseClient();
  await client.connect();

  try {
    await client.query("begin");
    const localeResult = await client.query(
      "select code, is_active from public.content_locales where code = $1 and not is_default",
      [options.locale],
    );
    if (!localeResult.rows[0]?.is_active) {
      throw new Error(`Locale ${options.locale} is missing or inactive.`);
    }

    const entryResult = await client.query(
      [
        "insert into public.translation_jobs (root_entity_type, root_entity_id, locale, source_hash, status, priority)",
        "select 'entry', entry.id, $1, encode(digest(view.list::text, 'sha256'), 'hex'), 'pending', 200",
        "from public.entries entry",
        "join public.entries_maplist view on view.id = entry.id",
        "where entry.status = 'published'",
        options.id ? "and (entry.id::text = $2 or entry.legacy_id = $2 or entry.slug = $2)" : "",
        "on conflict (root_entity_type, root_entity_id, locale) do update set",
        "source_hash = excluded.source_hash,",
        "status = case when public.translation_jobs.source_hash is distinct from excluded.source_hash then 'pending' else public.translation_jobs.status end,",
        "attempts = case when public.translation_jobs.source_hash is distinct from excluded.source_hash then 0 else public.translation_jobs.attempts end,",
        "next_attempt_at = case when public.translation_jobs.source_hash is distinct from excluded.source_hash then now() else public.translation_jobs.next_attempt_at end,",
        "updated_at = now()",
      ].filter(Boolean).join(" "),
      options.id ? [options.locale, options.id] : [options.locale],
    );

    const destinationResult = options.id ? { rowCount: 0 } : await client.query(
      [
        "insert into public.translation_jobs (root_entity_type, root_entity_id, locale, source_hash, status, priority)",
        "select 'destination', destination.id, $1,",
        "encode(digest(concat_ws('|', destination.name, destination.display_name, destination.slug, destination.updated_at::text,",
        "coalesce(string_agg(description.description, '|' order by description.description_kind), ''),",
        "coalesce((select jsonb_agg(jsonb_build_object(",
        "  'category', insight.category, 'label', insight.label, 'summary', insight.summary,",
        "  'chips', (select jsonb_agg(jsonb_build_object('slug', chip.chip_slug, 'label', chip.label, 'value', chip.filter_value) order by chip.sort_order, chip.chip_slug) from public.destination_category_insight_chips chip where chip.insight_id=insight.id and chip.is_active),",
        "  'notes', (select jsonb_agg(jsonb_build_object('key', note.note_key, 'label', note.label, 'body', note.body) order by note.sort_order, note.note_key) from public.destination_category_insight_notes note where note.insight_id=insight.id and note.is_active)",
        ") order by insight.sort_order, insight.category)::text from public.destination_category_insights insight where insight.destination_id=destination.id and insight.locale='en' and insight.is_active), '')",
        "), 'sha256'), 'hex'),",
        "'pending', 100",
        "from public.destinations destination",
        "left join public.destination_descriptions_v2 description",
        "on description.destination_id = destination.id and description.locale = 'en'",
        "where destination.is_published",
        "group by destination.id",
        "on conflict (root_entity_type, root_entity_id, locale) do update set",
        "source_hash = excluded.source_hash,",
        "status = case when public.translation_jobs.source_hash is distinct from excluded.source_hash then 'pending' else public.translation_jobs.status end,",
        "attempts = case when public.translation_jobs.source_hash is distinct from excluded.source_hash then 0 else public.translation_jobs.attempts end,",
        "updated_at = now()",
      ].join(" "),
      [options.locale],
    );

    const eventResult = options.id ? { rowCount: 0 } : await client.query(
      [
        "insert into public.translation_jobs (root_entity_type, root_entity_id, locale, source_hash, status, priority)",
        "select 'event', event.id, $1,",
        "encode(digest(concat_ws('|', event.title, event.description, event.highlights::text, event.event_category, event.updated_at::text,",
        "coalesce((select jsonb_agg(jsonb_build_object('id', activation.id, 'title', activation.title, 'description', activation.description) order by activation.sort_order, activation.id)::text from public.event_activations activation where activation.event_id=event.id), ''),",
        "coalesce((select jsonb_agg(jsonb_build_object('id', occurrence.id, 'title', occurrence.title, 'description', occurrence.description) order by occurrence.occurrence_order, occurrence.id)::text from public.event_occurrences occurrence where occurrence.event_id=event.id), ''),",
        "coalesce((select publication.rendered_map_list::text from public.weekly_event_publications publication where publication.event_id=event.id order by publication.sourced_at desc, publication.updated_at desc limit 1), '')",
        "), 'sha256'), 'hex'),",
        "'pending', 250",
        "from public.events event where event.status = 'published'",
        "on conflict (root_entity_type, root_entity_id, locale) do update set",
        "source_hash = excluded.source_hash,",
        "status = case when public.translation_jobs.source_hash is distinct from excluded.source_hash then 'pending' else public.translation_jobs.status end,",
        "attempts = case when public.translation_jobs.source_hash is distinct from excluded.source_hash then 0 else public.translation_jobs.attempts end,",
        "updated_at = now()",
      ].join(" "),
      [options.locale],
    );

    if (options.dryRun) await client.query("rollback");
    else await client.query("commit");

    console.log(JSON.stringify({
      ok: true,
      dryRun: options.dryRun,
      locale: options.locale,
      queued: {
        entries: entryResult.rowCount,
        destinations: destinationResult.rowCount,
        events: eventResult.rowCount,
      },
    }, null, 2));
  } catch (error) {
    await client.query("rollback").catch(() => {});
    throw error;
  } finally {
    await client.end().catch(() => {});
  }
}

main().catch((error) => {
  console.error("TRANSLATION_BACKFILL_FAILED");
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exitCode = 1;
});
