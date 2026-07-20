import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import {
  createDatabaseClient,
  loadProjectEnv,
  repoRoot,
} from "./i18n-utils.mjs";
import { getTranslationInstructions } from "./translation-guidance.mjs";

function parseOptions(argv) {
  const options = { locale: "es", limit: 5, type: null, output: null };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--locale") options.locale = argv[++index];
    else if (value === "--limit") options.limit = Number.parseInt(argv[++index], 10);
    else if (value === "--type") options.type = argv[++index];
    else if (value === "--output") options.output = argv[++index];
    else throw new Error(`Unknown argument: ${value}`);
  }
  if (!/^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(options.locale)) throw new Error("Invalid --locale.");
  if (!Number.isInteger(options.limit) || options.limit < 1 || options.limit > 100) {
    throw new Error("--limit must be between 1 and 100. Use balanced shards for batches above 25 roots.");
  }
  if (options.type && !["destination", "entry", "event"].includes(options.type)) {
    throw new Error("--type must be destination, entry, or event.");
  }
  options.output ??= `translation-batches/work/${options.locale}-next.json`;
  return options;
}

function buildEntryItem(source, stopRows, locale) {
  const input = {
    locale,
    guide: {
      title: source.list.title,
      description: source.list.description,
      highlights: source.list.highlights ?? [],
      seoSlug: source.list.seoSlug,
      seoTitle: source.list.seoTitle,
      seoDescription: source.list.seoDescription,
      category: source.list.category,
      submissionType: source.list.submissionType,
      location: source.list.location,
    },
    normalizedStops: stopRows.map((stop) => ({
      entryStopId: stop.id,
      legacyId: stop.legacy_id,
      order: stop.stop_order,
      name: stop.name,
      description: stop.description,
      placesJson: JSON.stringify(stop.places ?? []),
    })),
  };
  return {
    input,
    translation: {
      title: "",
      description: "",
      highlights: [],
      seoSlug: "",
      seoTitle: "",
      seoDescription: "",
      stops: input.normalizedStops.map((stop) => ({
        entryStopId: stop.entryStopId,
        name: "",
        description: "",
        placesJson: stop.placesJson,
      })),
    },
  };
}

async function loadEntryItems(client, jobs) {
  if (jobs.length === 0) return new Map();
  const entryIds = jobs.map((job) => job.root_entity_id);
  const { rows: entryRows } = await client.query(
    "select entry.id,view.list from public.entries entry join public.entries_maplist view on view.id=entry.id where entry.id=any($1::uuid[]) and entry.status='published'",
    [entryIds],
  );
  const { rows: stopRows } = await client.query(
    "select entry_id,id,legacy_id,stop_order,name,description,places from public.entry_stops where entry_id=any($1::uuid[]) order by entry_id,stop_order,id",
    [entryIds],
  );
  const entriesById = new Map(entryRows.map((entry) => [entry.id, entry]));
  const stopsByEntryId = new Map();
  for (const stop of stopRows) {
    const stops = stopsByEntryId.get(stop.entry_id) ?? [];
    stops.push(stop);
    stopsByEntryId.set(stop.entry_id, stops);
  }
  const itemsByJobId = new Map();
  for (const job of jobs) {
    const source = entriesById.get(job.root_entity_id);
    if (!source) throw new Error(`Published entry ${job.root_entity_id} was not found.`);
    itemsByJobId.set(job.id, buildEntryItem(source, stopsByEntryId.get(job.root_entity_id) ?? [], job.locale));
  }
  return itemsByJobId;
}

async function loadDestinationItem(client, job) {
  const { rows } = await client.query(
    [
      "select destination.id,destination.name,destination.display_name,destination.slug,destination.scope,",
      "coalesce(description_rows.descriptions,'[]'::jsonb) as descriptions,coalesce(insight_rows.insights,'[]'::jsonb) as insights",
      "from public.destinations destination",
      "left join lateral (select jsonb_agg(jsonb_build_object('kind',item.description_kind,'title',item.title,'summary',item.summary,'description',item.description) order by item.description_kind) as descriptions",
      "from public.destination_descriptions_v2 item where item.destination_id=destination.id and item.locale='en') description_rows on true",
      "left join lateral (select jsonb_agg(jsonb_build_object('category',insight.category,'label',insight.label,'summary',insight.summary,'sortOrder',insight.sort_order,",
      "'sourceType',insight.source_type,'sourceMetadata',insight.source_metadata,",
      "'chips',coalesce((select jsonb_agg(jsonb_build_object('slug',chip.chip_slug,'label',chip.label,'filterKind',chip.filter_kind,'filterValue',chip.filter_value,'sortOrder',chip.sort_order) order by chip.sort_order,chip.chip_slug) from public.destination_category_insight_chips chip where chip.insight_id=insight.id and chip.is_active),'[]'::jsonb),",
      "'notes',coalesce((select jsonb_agg(jsonb_build_object('key',note.note_key,'label',note.label,'body',note.body,'sortOrder',note.sort_order) order by note.sort_order,note.note_key) from public.destination_category_insight_notes note where note.insight_id=insight.id and note.is_active),'[]'::jsonb)) order by insight.sort_order,insight.category) as insights",
      "from public.destination_category_insights insight where insight.destination_id=destination.id and insight.locale='en' and insight.is_active) insight_rows on true",
      "where destination.id=$1 and destination.is_published",
    ].join(" "),
    [job.root_entity_id],
  );
  const source = rows[0];
  if (!source) throw new Error(`Published destination ${job.root_entity_id} was not found.`);
  return {
    input: { locale: job.locale, destination: source },
    translation: {
      displayName: "",
      slug: "",
      seoTitle: "",
      seoDescription: "",
      descriptions: (source.descriptions ?? []).map((description) => ({
        kind: description.kind,
        title: description.title === null ? null : "",
        summary: description.summary === null ? null : "",
        description: "",
      })),
      insights: (source.insights ?? []).map((insight) => ({
        category: insight.category,
        label: insight.label === null ? null : "",
        summary: insight.summary === null ? null : "",
        chips: (insight.chips ?? []).map((chip) => ({ slug: chip.slug, label: "" })),
        notes: (insight.notes ?? []).map((note) => ({
          key: note.key,
          label: note.label === null ? null : "",
          body: "",
        })),
      })),
    },
  };
}

async function loadEventItem(client, job) {
  const { rows: eventRows } = await client.query(
    "select * from public.events where id=$1 and status='published'",
    [job.root_entity_id],
  );
  const { rows: activationRows } = await client.query(
    "select id,legacy_id,title,description from public.event_activations where event_id=$1 order by sort_order,id",
    [job.root_entity_id],
  );
  const { rows: occurrenceRows } = await client.query(
    "select id,legacy_id,title,description from public.event_occurrences where event_id=$1 order by occurrence_order,id",
    [job.root_entity_id],
  );
  const source = eventRows[0];
  if (!source) throw new Error(`Published event ${job.root_entity_id} was not found.`);
  const input = {
    locale: job.locale,
    event: {
      title: source.title,
      description: source.description,
      highlights: source.highlights ?? [],
      eventCategory: source.event_category,
      seoSlug: source.slug,
      seoTitle: source.title,
      seoDescription: source.description,
    },
    activations: activationRows,
    occurrences: occurrenceRows,
  };
  return {
    input,
    translation: {
      title: "",
      description: "",
      highlights: [],
      seoSlug: "",
      seoTitle: "",
      seoDescription: "",
      activations: activationRows.map((activation) => ({
        id: activation.id,
        title: "",
        description: activation.description === null ? null : "",
      })),
      occurrences: occurrenceRows.map((occurrence) => ({
        id: occurrence.id,
        title: occurrence.title === null ? null : "",
        description: occurrence.description === null ? null : "",
      })),
    },
  };
}

async function main() {
  loadProjectEnv();
  const options = parseOptions(process.argv.slice(2));
  const client = createDatabaseClient();
  await client.connect();
  try {
    const { rows: locales } = await client.query(
      "select code,english_name,native_name from public.content_locales where code=$1 and is_active and not is_default",
      [options.locale],
    );
    const targetLocale = locales[0];
    if (!targetLocale) throw new Error(`Locale ${options.locale} is missing or inactive.`);
    const values = [options.locale, options.limit];
    const typeFilter = options.type ? "and root_entity_type=$3" : "";
    if (options.type) values.push(options.type);
    const { rows: jobs } = await client.query(
      [
        "select * from public.translation_jobs",
        "where locale=$1 and status in ('pending','failed')",
        typeFilter,
        "order by priority desc,created_at,id limit $2",
      ].filter(Boolean).join(" "),
      values,
    );
    const items = [];
    const entryItems = await loadEntryItems(
      client,
      jobs.filter((job) => job.root_entity_type === "entry"),
    );
    for (const job of jobs) {
      const content = job.root_entity_type === "entry"
        ? entryItems.get(job.id)
        : job.root_entity_type === "destination"
          ? await loadDestinationItem(client, job)
          : await loadEventItem(client, job);
      items.push({
        jobId: job.id,
        entityType: job.root_entity_type,
        entityId: job.root_entity_id,
        locale: job.locale,
        sourceHash: job.source_hash,
        ...content,
      });
    }
    if (items.length === 0) throw new Error("No pending translation jobs matched this batch scope.");
    const outputPath = path.resolve(repoRoot, options.output);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify({
      schemaVersion: 1,
      locale: options.locale,
      generatedAt: new Date().toISOString(),
      instructions: getTranslationInstructions(targetLocale),
      items,
    }, null, 2)}\n`);
    console.log(JSON.stringify({ ok: true, locale: options.locale, count: items.length, output: path.relative(repoRoot, outputPath) }, null, 2));
  } finally {
    await client.end().catch(() => {});
  }
}

main().catch((error) => {
  console.error("TRANSLATION_BATCH_EXPORT_FAILED");
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exitCode = 1;
});
