import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import {
  buildLocalizedEventUrl,
  buildLocalizedGuideUrl,
  createDatabaseClient,
  loadProjectEnv,
  parseArgs,
  repoRoot,
  slugify,
} from "./i18n-utils.mjs";
import { getTranslationInstructions } from "./translation-guidance.mjs";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
let activeBatch = null;

function outputText(response) {
  for (const item of response.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && typeof content.text === "string") return content.text;
    }
  }
  throw new Error("Translation provider returned no output_text payload.");
}

async function requestStructuredTranslation({ name, schema, input, targetLocale, job }) {
  if (activeBatch) {
    const item = activeBatch.itemsByJobId.get(job.id);
    if (!item) throw new Error(`Translation batch does not contain job ${job.id}.`);
    if (item.entityType !== job.root_entity_type || item.entityId !== job.root_entity_id || item.locale !== job.locale) {
      throw new Error(`Translation batch identity does not match job ${job.id}.`);
    }
    if (item.sourceHash !== job.source_hash) {
      throw new Error(`Translation batch source hash is stale for job ${job.id}. Export a new batch.`);
    }
    if (!item.translation || typeof item.translation !== "object" || Array.isArray(item.translation)) {
      throw new Error(`Translation batch item ${job.id} has no completed translation object.`);
    }
    return item.translation;
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Set OPENAI_API_KEY to process translation jobs.");
  const model = process.env.OPENAI_TRANSLATION_MODEL?.trim() || "gpt-5-mini";
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions: [...getTranslationInstructions(targetLocale), "Return only data matching the provided JSON schema."].join(" "),
      input: JSON.stringify(input),
      text: {
        format: {
          type: "json_schema",
          name,
          strict: true,
          schema,
        },
      },
    }),
  });
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(`Translation provider failed (${response.status}): ${responseBody.error?.message ?? "unknown error"}`);
  }
  return JSON.parse(outputText(responseBody));
}

const entrySchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "description", "highlights", "seoSlug", "seoTitle", "seoDescription", "stops"],
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    highlights: { type: "array", items: { type: "string" } },
    seoSlug: { type: "string" },
    seoTitle: { type: "string" },
    seoDescription: { type: "string" },
    stops: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["entryStopId", "name", "description", "placesJson"],
        properties: {
          entryStopId: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          placesJson: { type: "string" },
        },
      },
    },
  },
};

const destinationSchema = {
  type: "object",
  additionalProperties: false,
  required: ["displayName", "slug", "seoTitle", "seoDescription", "descriptions", "insights"],
  properties: {
    displayName: { type: "string" },
    slug: { type: "string" },
    seoTitle: { type: "string" },
    seoDescription: { type: "string" },
    descriptions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["kind", "title", "summary", "description"],
        properties: {
          kind: { type: "string" },
          title: { type: ["string", "null"] },
          summary: { type: ["string", "null"] },
          description: { type: "string" },
        },
      },
    },
    insights: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["category", "label", "summary", "chips", "notes"],
        properties: {
          category: { type: "string" },
          label: { type: ["string", "null"] },
          summary: { type: ["string", "null"] },
          chips: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["slug", "label"],
              properties: { slug: { type: "string" }, label: { type: "string" } },
            },
          },
          notes: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["key", "label", "body"],
              properties: {
                key: { type: "string" },
                label: { type: ["string", "null"] },
                body: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
};

const eventSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "description", "highlights", "seoSlug", "seoTitle", "seoDescription", "activations", "occurrences"],
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    highlights: { type: "array", items: { type: "string" } },
    seoSlug: { type: "string" },
    seoTitle: { type: "string" },
    seoDescription: { type: "string" },
    activations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "title", "description"],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: ["string", "null"] },
        },
      },
    },
    occurrences: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "title", "description"],
        properties: {
          id: { type: "string" },
          title: { type: ["string", "null"] },
          description: { type: ["string", "null"] },
        },
      },
    },
  },
};

function assertText(value, label) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} is empty.`);
  return value.trim();
}

function parsePlaces(value, label) {
  if (!value) return [];
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed)) throw new Error(`${label} must contain a JSON array.`);
  return parsed;
}

function hashTranslationInput(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function loadTranslationBatch(batchPath, locale) {
  const resolvedPath = path.resolve(repoRoot, batchPath);
  const batch = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
  if (batch.schemaVersion !== 1) throw new Error("Unsupported translation batch schema version.");
  if (batch.locale !== locale) {
    throw new Error(`Translation batch locale ${batch.locale ?? "missing"} does not match --locale ${locale}.`);
  }
  if (!Array.isArray(batch.items) || batch.items.length === 0) {
    throw new Error("Translation batch contains no items.");
  }
  const itemsByJobId = new Map();
  for (const item of batch.items) {
    if (!item?.jobId || !item?.entityType || !item?.entityId || !item?.sourceHash) {
      throw new Error("Every translation batch item requires jobId, entityType, entityId, and sourceHash.");
    }
    if (itemsByJobId.has(item.jobId)) throw new Error(`Duplicate translation batch job: ${item.jobId}.`);
    itemsByJobId.set(item.jobId, item);
  }
  return { path: resolvedPath, itemsByJobId };
}

function localizeEventPayload(value, activationTranslations, occurrenceTranslations) {
  if (Array.isArray(value)) {
    return value.map((item) => localizeEventPayload(item, activationTranslations, occurrenceTranslations));
  }
  if (!value || typeof value !== "object") return value;

  const localized = Object.fromEntries(
    Object.entries(value).map(([key, child]) => [key, localizeEventPayload(child, activationTranslations, occurrenceTranslations)]),
  );
  const identifiers = [value.id, value.activationId, value.eventActivationId, value.occurrenceId, value.eventOccurrenceId]
    .filter((identifier) => typeof identifier === "string");
  const activation = identifiers.map((identifier) => activationTranslations.get(identifier)).find(Boolean);
  const occurrence = identifiers.map((identifier) => occurrenceTranslations.get(identifier)).find(Boolean);
  const translation = occurrence ?? activation;
  if (!translation) return localized;
  if (translation.title) {
    if ("name" in localized) localized.name = translation.title;
    if ("title" in localized) localized.title = translation.title;
  }
  if (translation.description !== null && translation.description !== undefined && "description" in localized) {
    localized.description = translation.description;
  }
  return localized;
}

async function processEntry(client, job, autoPublish, targetLocale) {
  const { rows: entryRows } = await client.query(
    [
      "select entry.id, entry.legacy_id, entry.slug, entry.category, entry.city_id, entry.neighborhood_id, view.list,",
      "city_translation.slug as localized_city_slug, neighborhood_translation.slug as localized_neighborhood_slug",
      "from public.entries entry join public.entries_maplist view on view.id = entry.id",
      "left join public.destination_translations city_translation on city_translation.destination_id=entry.city_id and city_translation.locale=$2 and city_translation.translation_status='published'",
      "left join public.destination_translations neighborhood_translation on neighborhood_translation.destination_id=entry.neighborhood_id and neighborhood_translation.locale=$2 and neighborhood_translation.translation_status='published'",
      "where entry.id = $1 and entry.status = 'published'",
    ].join(" "),
    [job.root_entity_id, job.locale],
  );
  const { rows: stopRows } = await client.query(
    "select id, legacy_id, stop_order, name, description, places from public.entry_stops where entry_id = $1 order by stop_order, id",
    [job.root_entity_id],
  );
  const { rows: existingEntryRows } = await client.query(
    "select * from public.entry_translations where entry_id=$1 and locale=$2",
    [job.root_entity_id, job.locale],
  );
  const { rows: existingStopRows } = await client.query(
    "select translation.* from public.entry_stop_translations translation join public.entry_stops stop on stop.id=translation.entry_stop_id where stop.entry_id=$1 and translation.locale=$2 order by stop.stop_order,stop.id",
    [job.root_entity_id, job.locale],
  );
  const source = entryRows[0];
  if (!source) throw new Error("Published entry was not found.");

  const input = {
    locale: job.locale,
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
  const translationInputHash = hashTranslationInput(input);
  const existingEntry = existingEntryRows[0];
  const existingStopsById = new Map(existingStopRows.map((stop) => [stop.entry_stop_id, stop]));
  const canReuseTranslation =
    existingEntry?.metadata?.translation_input_hash === translationInputHash &&
    (!autoPublish || existingEntry.translation_status === "published") &&
    stopRows.length === existingStopRows.length &&
    stopRows.every((stop) => existingStopsById.has(stop.id));
  const translated = canReuseTranslation
    ? {
        title: existingEntry.title,
        description: existingEntry.description,
        highlights: existingEntry.highlights ?? [],
        seoSlug: existingEntry.seo_slug,
        seoTitle: existingEntry.seo_title,
        seoDescription: existingEntry.seo_description,
        stops: stopRows.map((stop) => {
          const localized = existingStopsById.get(stop.id);
          return {
            entryStopId: stop.id,
            name: localized.name,
            description: localized.description,
            placesJson: JSON.stringify(localized.places ?? []),
          };
        }),
      }
    : await requestStructuredTranslation({ name: "rguide_entry_translation", schema: entrySchema, input, targetLocale, job });
  const seoSlug = slugify(assertText(translated.seoSlug, "seoSlug"));
  if (!seoSlug) throw new Error("Translated SEO slug is invalid.");
  if (!Array.isArray(translated.stops) || translated.stops.length !== stopRows.length) {
    throw new Error(`Expected ${stopRows.length} translated stops, received ${translated.stops?.length ?? 0}.`);
  }

  const sourceStopIds = new Set(stopRows.map((stop) => stop.id));
  const translatedStopIds = new Set(translated.stops.map((stop) => stop.entryStopId));
  if (sourceStopIds.size !== translatedStopIds.size || [...sourceStopIds].some((id) => !translatedStopIds.has(id))) {
    throw new Error("Translated stop IDs do not match the normalized entry stops.");
  }

  const status = autoPublish || (canReuseTranslation && existingEntry.translation_status === "published")
    ? "published"
    : "review";
  await client.query(
    [
      "insert into public.entry_translations (entry_id, locale, title, description, highlights, seo_slug, seo_title, seo_description, translation_status, source_hash, translation_method, translated_at, published_at, metadata)",
      "values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'machine',now(),case when $9 = 'published' then now() else null end,jsonb_build_object('translation_input_hash',$11::text))",
      "on conflict (entry_id, locale) do update set title=excluded.title, description=excluded.description, highlights=excluded.highlights,",
      "seo_slug=excluded.seo_slug, seo_title=excluded.seo_title, seo_description=excluded.seo_description, translation_status=excluded.translation_status,",
      "source_hash=excluded.source_hash, translation_method=excluded.translation_method, translated_at=excluded.translated_at, published_at=excluded.published_at, metadata=public.entry_translations.metadata || excluded.metadata, updated_at=now()",
    ].join(" "),
    [job.root_entity_id, job.locale, assertText(translated.title, "title"), assertText(translated.description, "description"), translated.highlights ?? [], seoSlug, assertText(translated.seoTitle, "seoTitle"), assertText(translated.seoDescription, "seoDescription"), status, job.source_hash, translationInputHash],
  );

  const stopTranslations = translated.stops.map((stop) => ({
    entry_stop_id: stop.entryStopId,
    name: assertText(stop.name, "stop name"),
    description: assertText(stop.description, "stop description"),
    places: parsePlaces(stop.placesJson, `places for ${stop.entryStopId}`),
  }));
  await client.query(
    [
      "insert into public.entry_stop_translations (entry_stop_id, locale, name, description, places, translation_status, source_hash, translation_method, translated_at, published_at, metadata)",
      "select item.entry_stop_id,$2,item.name,item.description,item.places,$3,$4,'machine',now(),case when $3 = 'published' then now() else null end,jsonb_build_object('translation_input_hash',$5::text)",
      "from jsonb_to_recordset($1::jsonb) as item(entry_stop_id uuid,name text,description text,places jsonb)",
      "on conflict (entry_stop_id, locale) do update set name=excluded.name, description=excluded.description, places=excluded.places,",
      "translation_status=excluded.translation_status, source_hash=excluded.source_hash, translation_method=excluded.translation_method,",
      "translated_at=excluded.translated_at, published_at=excluded.published_at, metadata=public.entry_stop_translations.metadata || excluded.metadata, updated_at=now()",
    ].join(" "),
    [JSON.stringify(stopTranslations), job.locale, status, job.source_hash, translationInputHash],
  );

  if (autoPublish) {
    const translatedById = new Map(translated.stops.map((stop) => [stop.entryStopId, stop]));
    const translatedByLegacyId = new Map(stopRows.map((stop) => [stop.legacy_id, translatedById.get(stop.id)]));
    const payload = {
      ...source.list,
      title: translated.title.trim(),
      description: translated.description.trim(),
      highlights: translated.highlights ?? [],
      seoSlug,
      seoTitle: translated.seoTitle.trim(),
      seoDescription: translated.seoDescription.trim(),
      stops: source.list.stops.map((stop, index) => {
        const normalizedStop = stopRows[index];
        const localized = translatedByLegacyId.get(stop.id) ?? translatedById.get(normalizedStop?.id);
        return localized ? {
          ...stop,
          name: localized.name.trim(),
          description: localized.description.trim(),
          places: parsePlaces(localized.placesJson, `places for ${localized.entryStopId}`),
        } : stop;
      }),
    };
    payload.url = buildLocalizedGuideUrl(job.locale, payload, {
      citySlug: source.localized_city_slug,
      neighborhoodSlug: source.localized_neighborhood_slug,
    });
    await client.query(
      [
        "insert into public.entry_localized_render_cache (entry_id, locale, render_format, render_version, rendered_payload, source_hash, rendered_at, stale_at, is_current, metadata)",
        "values ($1,$2,'maplist',1,$3,$4,now(),null,true,jsonb_build_object('translator',$5::text,'source','entries_maplist'))",
        "on conflict (entry_id, locale, render_format, render_version) do update set rendered_payload=excluded.rendered_payload, source_hash=excluded.source_hash,",
        "rendered_at=excluded.rendered_at, stale_at=null, is_current=true, metadata=public.entry_localized_render_cache.metadata || excluded.metadata, updated_at=now()",
      ].join(" "),
      [job.root_entity_id, job.locale, JSON.stringify(payload), job.source_hash, canReuseTranslation ? "existing-translation" : activeBatch ? "codex-batch" : "openai"],
    );
  }
}

async function processDestination(client, job, autoPublish, targetLocale) {
  const { rows } = await client.query(
    [
      "select destination.id, destination.name, destination.display_name, destination.slug, destination.scope,",
      "coalesce(description_rows.descriptions, '[]'::jsonb) as descriptions,",
      "coalesce(insight_rows.insights, '[]'::jsonb) as insights",
      "from public.destinations destination",
      "left join lateral (",
      "  select jsonb_agg(jsonb_build_object('kind', item.description_kind, 'title', item.title, 'summary', item.summary, 'description', item.description) order by item.description_kind) as descriptions",
      "  from public.destination_descriptions_v2 item where item.destination_id=destination.id and item.locale='en'",
      ") description_rows on true",
      "left join lateral (",
      "  select jsonb_agg(jsonb_build_object(",
      "    'category', insight.category, 'label', insight.label, 'summary', insight.summary, 'sortOrder', insight.sort_order,",
      "    'sourceType', insight.source_type, 'sourceMetadata', insight.source_metadata,",
      "    'chips', coalesce((select jsonb_agg(jsonb_build_object('slug', chip.chip_slug, 'label', chip.label, 'filterKind', chip.filter_kind, 'filterValue', chip.filter_value, 'sortOrder', chip.sort_order) order by chip.sort_order, chip.chip_slug) from public.destination_category_insight_chips chip where chip.insight_id=insight.id and chip.is_active), '[]'::jsonb),",
      "    'notes', coalesce((select jsonb_agg(jsonb_build_object('key', note.note_key, 'label', note.label, 'body', note.body, 'sortOrder', note.sort_order) order by note.sort_order, note.note_key) from public.destination_category_insight_notes note where note.insight_id=insight.id and note.is_active), '[]'::jsonb)",
      "  ) order by insight.sort_order, insight.category) as insights",
      "  from public.destination_category_insights insight where insight.destination_id=destination.id and insight.locale='en' and insight.is_active",
      ") insight_rows on true",
      "where destination.id=$1 and destination.is_published",
    ].join(" "),
    [job.root_entity_id],
  );
  const source = rows[0];
  if (!source) throw new Error("Published destination was not found.");
  const translated = await requestStructuredTranslation({
    name: "rguide_destination_translation",
    schema: destinationSchema,
    input: { locale: job.locale, destination: source },
    targetLocale,
    job,
  });
  const sourceDescriptionKinds = new Set((source.descriptions ?? []).map((description) => description.kind));
  const translatedDescriptionKinds = new Set((translated.descriptions ?? []).map((description) => description.kind));
  if (
    sourceDescriptionKinds.size !== translatedDescriptionKinds.size ||
    [...sourceDescriptionKinds].some((kind) => !translatedDescriptionKinds.has(kind))
  ) {
    throw new Error("Translated destination description kinds do not match the English source.");
  }
  const sourceInsightCategories = new Set((source.insights ?? []).map((insight) => insight.category));
  const translatedInsightCategories = new Set((translated.insights ?? []).map((insight) => insight.category));
  if (
    sourceInsightCategories.size !== translatedInsightCategories.size ||
    [...sourceInsightCategories].some((category) => !translatedInsightCategories.has(category))
  ) {
    throw new Error("Translated destination insight categories do not match the English source.");
  }
  const status = autoPublish ? "published" : "review";
  const translatedDisplayName = assertText(translated.displayName, "destination displayName");
  const translatedSlug = slugify(assertText(translated.slug, "destination slug"));
  const translatedSeoTitle = assertText(translated.seoTitle, "destination seoTitle");
  const translatedSeoDescription = assertText(translated.seoDescription, "destination seoDescription");
  await client.query(
    [
      "insert into public.destination_translations (destination_id, locale, display_name, slug, seo_title, seo_description, translation_status, source_hash, translation_method, translated_at, published_at)",
      "values ($1,$2,$3,$4,$5,$6,$7,$8,'machine',now(),case when $7='published' then now() else null end)",
      "on conflict (destination_id, locale) do update set display_name=excluded.display_name, slug=excluded.slug, seo_title=excluded.seo_title, seo_description=excluded.seo_description,",
      "translation_status=excluded.translation_status, source_hash=excluded.source_hash, translated_at=excluded.translated_at, published_at=excluded.published_at, updated_at=now()",
    ].join(" "),
    [job.root_entity_id, job.locale, translatedDisplayName, translatedSlug, translatedSeoTitle, translatedSeoDescription, status, job.source_hash],
  );
  const expectedKinds = new Set((source.descriptions ?? []).map((description) => description.kind));
  for (const description of translated.descriptions ?? []) {
    if (!expectedKinds.has(description.kind)) continue;
    const sourceDescription = (source.descriptions ?? []).find((item) => item.kind === description.kind);
    const title = sourceDescription?.title === null ? null : assertText(description.title, "destination description title");
    const summary = sourceDescription?.summary === null ? null : assertText(description.summary, "destination description summary");
    await client.query(
      [
        "insert into public.destination_descriptions_v2 (destination_id, locale, title, summary, description, description_kind, is_primary, translation_status, source_hash, translation_method, translated_at, published_at, metadata)",
        "values ($1,$2,$3,$4,$5,$6,true,$7,$8,'machine',now(),case when $7='published' then now() else null end,jsonb_build_object('source_locale','en'))",
        "on conflict (destination_id, locale, description_kind) do update set title=excluded.title, summary=excluded.summary, description=excluded.description,",
        "translation_status=excluded.translation_status, source_hash=excluded.source_hash, translation_method=excluded.translation_method, translated_at=excluded.translated_at, published_at=excluded.published_at,",
        "metadata=public.destination_descriptions_v2.metadata || excluded.metadata, updated_at=now()",
      ].join(" "),
      [job.root_entity_id, job.locale, title, summary, assertText(description.description, "destination description"), description.kind, status, job.source_hash],
    );
  }

  const sourceInsights = new Map((source.insights ?? []).map((insight) => [insight.category, insight]));
  for (const insight of translated.insights ?? []) {
    const sourceInsight = sourceInsights.get(insight.category);
    if (!sourceInsight) continue;
    const insightLabel = sourceInsight.label === null ? null : assertText(insight.label, "destination insight label");
    const insightSummary = sourceInsight.summary === null ? null : assertText(insight.summary, "destination insight summary");
    const { rows: localizedInsightRows } = await client.query(
      [
        "insert into public.destination_category_insights (destination_id, category, locale, label, summary, sort_order, source_type, source_metadata, is_active, translation_status, source_hash, translation_method, translated_at, published_at)",
        "values ($1,$2,$3,$4,$5,$6,'translated',jsonb_build_object('source_locale','en'),true,$7,$8,'machine',now(),case when $7='published' then now() else null end)",
        "on conflict (destination_id, category, locale) do update set label=excluded.label, summary=excluded.summary, sort_order=excluded.sort_order,",
        "source_type=excluded.source_type, source_metadata=public.destination_category_insights.source_metadata || excluded.source_metadata, is_active=true,",
        "translation_status=excluded.translation_status, source_hash=excluded.source_hash, translation_method=excluded.translation_method, translated_at=excluded.translated_at, published_at=excluded.published_at, updated_at=now()",
        "returning id",
      ].join(" "),
      [job.root_entity_id, insight.category, job.locale, insightLabel, insightSummary, sourceInsight.sortOrder ?? 100, status, job.source_hash],
    );
    const localizedInsightId = localizedInsightRows[0]?.id;
    if (!localizedInsightId) throw new Error(`Failed to upsert ${insight.category} destination insight.`);

    const translatedChips = new Map((insight.chips ?? []).map((chip) => [chip.slug, chip]));
    const translatedNotes = new Map((insight.notes ?? []).map((note) => [note.key, note]));
    await client.query("delete from public.destination_category_insight_chips where insight_id=$1", [localizedInsightId]);
    await client.query("delete from public.destination_category_insight_notes where insight_id=$1", [localizedInsightId]);

    for (const sourceChip of sourceInsight.chips ?? []) {
      const localizedChip = translatedChips.get(sourceChip.slug);
      if (!localizedChip) throw new Error(`Missing translated insight chip ${insight.category}/${sourceChip.slug}.`);
      await client.query(
        "insert into public.destination_category_insight_chips (insight_id, chip_slug, label, filter_kind, filter_value, sort_order, is_active, source_metadata) values ($1,$2,$3,$4,$5,$6,true,jsonb_build_object('translation_method','machine','source_locale','en'))",
        [localizedInsightId, sourceChip.slug, assertText(localizedChip.label, "insight chip label"), sourceChip.filterKind, sourceChip.filterValue, sourceChip.sortOrder ?? 100],
      );
    }
    for (const sourceNote of sourceInsight.notes ?? []) {
      const localizedNote = translatedNotes.get(sourceNote.key);
      if (!localizedNote) throw new Error(`Missing translated insight note ${insight.category}/${sourceNote.key}.`);
      const noteLabel = sourceNote.label === null ? null : assertText(localizedNote.label, "insight note label");
      await client.query(
        "insert into public.destination_category_insight_notes (insight_id, note_key, label, body, sort_order, is_active, source_metadata) values ($1,$2,$3,$4,$5,true,jsonb_build_object('translation_method','machine','source_locale','en'))",
        [localizedInsightId, sourceNote.key, noteLabel, assertText(localizedNote.body, "insight note body"), sourceNote.sortOrder ?? 100],
      );
    }
  }
}

async function processEvent(client, job, autoPublish, targetLocale) {
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
  const { rows: publicationRows } = await client.query(
    "select rendered_map_list from public.weekly_event_publications where event_id=$1 order by sourced_at desc, updated_at desc limit 1",
    [job.root_entity_id],
  );
  const { rows: existingEventRows } = await client.query(
    "select * from public.event_translations where event_id=$1 and locale=$2",
    [job.root_entity_id, job.locale],
  );
  const { rows: existingActivationRows } = await client.query(
    "select translation.* from public.event_activation_translations translation join public.event_activations activation on activation.id=translation.event_activation_id where activation.event_id=$1 and translation.locale=$2",
    [job.root_entity_id, job.locale],
  );
  const { rows: existingOccurrenceRows } = await client.query(
    "select translation.* from public.event_occurrence_translations translation join public.event_occurrences occurrence on occurrence.id=translation.event_occurrence_id where occurrence.event_id=$1 and translation.locale=$2",
    [job.root_entity_id, job.locale],
  );
  const source = eventRows[0];
  if (!source) throw new Error("Published event was not found.");
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
  const translationInputHash = hashTranslationInput(input);
  const existingEvent = existingEventRows[0];
  const existingActivationsById = new Map(existingActivationRows.map((row) => [row.event_activation_id, row]));
  const existingOccurrencesById = new Map(existingOccurrenceRows.map((row) => [row.event_occurrence_id, row]));
  const canReuseTranslation =
    existingEvent?.metadata?.translation_input_hash === translationInputHash &&
    (!autoPublish || existingEvent.translation_status === "published") &&
    activationRows.length === existingActivationRows.length &&
    occurrenceRows.length === existingOccurrenceRows.length &&
    activationRows.every((row) => existingActivationsById.has(row.id)) &&
    occurrenceRows.every((row) => existingOccurrencesById.has(row.id));
  const translated = canReuseTranslation
    ? {
        title: existingEvent.title,
        description: existingEvent.description,
        highlights: existingEvent.highlights ?? [],
        seoSlug: existingEvent.seo_slug,
        seoTitle: existingEvent.seo_title,
        seoDescription: existingEvent.seo_description,
        activations: activationRows.map((row) => {
          const localized = existingActivationsById.get(row.id);
          return { id: row.id, title: localized.title, description: localized.description };
        }),
        occurrences: occurrenceRows.map((row) => {
          const localized = existingOccurrencesById.get(row.id);
          return { id: row.id, title: localized.title, description: localized.description };
        }),
      }
    : await requestStructuredTranslation({ name: "rguide_event_translation", schema: eventSchema, input, targetLocale, job });
  const translatedActivationIds = new Set((translated.activations ?? []).map((item) => item.id));
  const translatedOccurrenceIds = new Set((translated.occurrences ?? []).map((item) => item.id));
  if (
    translatedActivationIds.size !== activationRows.length ||
    activationRows.some((row) => !translatedActivationIds.has(row.id)) ||
    translatedOccurrenceIds.size !== occurrenceRows.length ||
    occurrenceRows.some((row) => !translatedOccurrenceIds.has(row.id))
  ) {
    throw new Error("Translated event schedule IDs do not match the normalized source rows.");
  }
  const status = autoPublish || (canReuseTranslation && existingEvent.translation_status === "published")
    ? "published"
    : "review";
  await client.query(
    [
      "insert into public.event_translations (event_id, locale, title, description, highlights, seo_slug, seo_title, seo_description, translation_status, source_hash, translation_method, translated_at, published_at, metadata)",
      "values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'machine',now(),case when $9='published' then now() else null end,jsonb_build_object('translation_input_hash',$11::text))",
      "on conflict (event_id, locale) do update set title=excluded.title, description=excluded.description, highlights=excluded.highlights, seo_slug=excluded.seo_slug,",
      "seo_title=excluded.seo_title, seo_description=excluded.seo_description, translation_status=excluded.translation_status, source_hash=excluded.source_hash, translated_at=excluded.translated_at, published_at=excluded.published_at, metadata=public.event_translations.metadata || excluded.metadata, updated_at=now()",
    ].join(" "),
    [job.root_entity_id, job.locale, assertText(translated.title, "event title"), assertText(translated.description, "event description"), translated.highlights ?? [], slugify(translated.seoSlug), assertText(translated.seoTitle, "event seoTitle"), assertText(translated.seoDescription, "event seoDescription"), status, job.source_hash, translationInputHash],
  );
  for (const activation of translated.activations ?? []) {
    const sourceActivation = activationRows.find((row) => row.id === activation.id);
    if (!sourceActivation) continue;
    const activationTitle = assertText(activation.title, "event activation title");
    const activationDescription = sourceActivation.description === null
      ? null
      : assertText(activation.description, "event activation description");
    await client.query(
      [
        "insert into public.event_activation_translations (event_activation_id, locale, title, description, translation_status, source_hash, translation_method, translated_at, published_at, metadata)",
        "values ($1,$2,$3,$4,$5,$6,'machine',now(),case when $5='published' then now() else null end,jsonb_build_object('translation_input_hash',$7::text))",
        "on conflict (event_activation_id, locale) do update set title=excluded.title, description=excluded.description, translation_status=excluded.translation_status, source_hash=excluded.source_hash, translated_at=excluded.translated_at, published_at=excluded.published_at, metadata=public.event_activation_translations.metadata || excluded.metadata, updated_at=now()",
      ].join(" "),
      [activation.id, job.locale, activationTitle, activationDescription, status, job.source_hash, translationInputHash],
    );
  }
  for (const occurrence of translated.occurrences ?? []) {
    const sourceOccurrence = occurrenceRows.find((row) => row.id === occurrence.id);
    if (!sourceOccurrence) continue;
    const occurrenceTitle = sourceOccurrence.title === null
      ? null
      : assertText(occurrence.title, "event occurrence title");
    const occurrenceDescription = sourceOccurrence.description === null
      ? null
      : assertText(occurrence.description, "event occurrence description");
    await client.query(
      [
        "insert into public.event_occurrence_translations (event_occurrence_id, locale, title, description, translation_status, source_hash, translation_method, translated_at, published_at, metadata)",
        "values ($1,$2,$3,$4,$5,$6,'machine',now(),case when $5='published' then now() else null end,jsonb_build_object('translation_input_hash',$7::text))",
        "on conflict (event_occurrence_id, locale) do update set title=excluded.title, description=excluded.description, translation_status=excluded.translation_status, source_hash=excluded.source_hash, translated_at=excluded.translated_at, published_at=excluded.published_at, metadata=public.event_occurrence_translations.metadata || excluded.metadata, updated_at=now()",
      ].join(" "),
      [occurrence.id, job.locale, occurrenceTitle, occurrenceDescription, status, job.source_hash, translationInputHash],
    );
  }

  if (autoPublish && publicationRows[0]?.rendered_map_list) {
    const translatedActivations = new Map();
    for (const translation of translated.activations ?? []) {
      const sourceActivation = activationRows.find((row) => row.id === translation.id);
      if (!sourceActivation) continue;
      translatedActivations.set(sourceActivation.id, translation);
      translatedActivations.set(sourceActivation.legacy_id, translation);
    }
    const translatedOccurrences = new Map();
    for (const translation of translated.occurrences ?? []) {
      const sourceOccurrence = occurrenceRows.find((row) => row.id === translation.id);
      if (!sourceOccurrence) continue;
      translatedOccurrences.set(sourceOccurrence.id, translation);
      translatedOccurrences.set(sourceOccurrence.legacy_id, translation);
    }
    const seoSlug = slugify(assertText(translated.seoSlug, "event seoSlug"));
    const payload = {
      ...localizeEventPayload(publicationRows[0].rendered_map_list, translatedActivations, translatedOccurrences),
      title: assertText(translated.title, "event title"),
      description: assertText(translated.description, "event description"),
      highlights: translated.highlights ?? [],
      seoSlug,
      seoTitle: assertText(translated.seoTitle, "event seoTitle"),
      seoDescription: assertText(translated.seoDescription, "event seoDescription"),
      submissionType: "event",
      url: buildLocalizedEventUrl(job.locale, seoSlug),
    };
    await client.query(
      [
        "insert into public.event_localized_render_cache (event_id, locale, render_format, render_version, rendered_payload, source_hash, rendered_at, stale_at, is_current, metadata)",
        "values ($1,$2,'maplist',1,$3,$4,now(),null,true,jsonb_build_object('translator',$5::text,'source','weekly_event_publications'))",
        "on conflict (event_id, locale, render_format, render_version) do update set rendered_payload=excluded.rendered_payload, source_hash=excluded.source_hash,",
        "rendered_at=excluded.rendered_at, stale_at=null, is_current=true, metadata=public.event_localized_render_cache.metadata || excluded.metadata, updated_at=now()",
      ].join(" "),
      [job.root_entity_id, job.locale, JSON.stringify(payload), job.source_hash, canReuseTranslation ? "existing-translation" : activeBatch ? "codex-batch" : "openai"],
    );
  }
}

async function claimJob(client, options, workerId) {
  if (options.batchJobIds?.length && options.claimableBatchJobIds.length === 0) return null;
  const values = [options.locale, workerId];
  let explicitFilter = "";
  if (options.batchJobIds?.length) {
    values.push(options.claimableBatchJobIds);
    explicitFilter = "and job.id = any($3::uuid[])";
  } else if (options.id) {
    values.push(options.id);
    explicitFilter = "and (job.id::text=$3 or job.root_entity_id::text=$3)";
  }
  const availabilityFilter = options.batchJobIds?.length
    ? "((job.status in ('pending','failed')) or (job.status='processing' and job.leased_at < now() - interval '30 minutes'))"
    : "((job.status in ('pending','failed') and job.next_attempt_at <= now()) or (job.status='processing' and job.leased_at < now() - interval '30 minutes'))";
  const attemptsFilter = options.batchJobIds?.length ? "" : "and job.attempts < job.max_attempts";
  const { rows } = await client.query(
    [
      "with candidate as (",
      "select job.id from public.translation_jobs job",
      `where job.locale=$1 ${attemptsFilter} and ${availabilityFilter}`,
      explicitFilter,
      "order by job.priority desc, job.created_at for update skip locked limit 1",
      ") update public.translation_jobs job set status='processing', attempts=job.attempts+1, leased_at=now(), leased_by=$2, updated_at=now()",
      "from candidate where job.id=candidate.id returning job.*",
    ].filter(Boolean).join(" "),
    values,
  );
  return rows[0] ?? null;
}

async function main() {
  loadProjectEnv();
  const options = parseArgs(process.argv.slice(2));
  if (options.batch) {
    activeBatch = loadTranslationBatch(options.batch, options.locale);
    options.batchJobIds = [...activeBatch.itemsByJobId.keys()];
    options.claimableBatchJobIds = [...options.batchJobIds];
    options.limit = options.batchJobIds.length;
  }
  if (options.dryRun) {
    console.log(JSON.stringify({
      ok: true,
      dryRun: true,
      locale: options.locale,
      batchItems: options.batchJobIds?.length ?? 0,
      message: "No provider or database writes were attempted.",
    }, null, 2));
    return;
  }
  const client = createDatabaseClient();
  const workerId = `local-${process.pid}-${crypto.randomUUID().slice(0, 8)}`;
  await client.connect();
  const summary = { completed: 0, failed: 0, batchIncomplete: 0, byType: {} };
  try {
    const { rows: localeRows } = await client.query(
      "select code, english_name, native_name from public.content_locales where code=$1 and is_active and not is_default",
      [options.locale],
    );
    const targetLocale = localeRows[0];
    if (!targetLocale) throw new Error(`Locale ${options.locale} is missing, inactive, or is the default locale.`);
    for (let index = 0; index < options.limit; index += 1) {
      const job = await claimJob(client, options, workerId);
      if (!job) break;
      if (options.batchJobIds?.length) {
        options.claimableBatchJobIds = options.claimableBatchJobIds.filter((jobId) => jobId !== job.id);
      }
      const startedAt = Date.now();
      console.log(`[${index + 1}/${options.limit}] ${job.root_entity_type} ${job.root_entity_id} (${job.locale})`);
      try {
        await client.query("begin");
        if (job.root_entity_type === "entry") await processEntry(client, job, options.autoPublish, targetLocale);
        else if (job.root_entity_type === "destination") await processDestination(client, job, options.autoPublish, targetLocale);
        else if (job.root_entity_type === "event") await processEvent(client, job, options.autoPublish, targetLocale);
        else throw new Error(`Unsupported job type: ${job.root_entity_type}`);
        await client.query(
          "update public.translation_jobs set status='completed', completed_at=now(), leased_at=null, leased_by=null, last_error=null, updated_at=now() where id=$1",
          [job.id],
        );
        await client.query("commit");
        summary.completed += 1;
        summary.byType[job.root_entity_type] = (summary.byType[job.root_entity_type] ?? 0) + 1;
        console.log(`  completed in ${((Date.now() - startedAt) / 1000).toFixed(1)}s`);
      } catch (error) {
        await client.query("rollback").catch(() => {});
        const message = error instanceof Error ? error.message : String(error);
        await client.query(
          "update public.translation_jobs set status='failed', next_attempt_at=now() + make_interval(secs => least(21600, 60 * power(2, attempts)::int)), leased_at=null, leased_by=null, last_error=$2, updated_at=now() where id=$1",
          [job.id, message.slice(0, 4000)],
        );
        summary.failed += 1;
        console.error(`  failed: ${message}`);
      }
    }
    if (options.batchJobIds?.length) {
      const { rows: batchJobRows } = await client.query(
        "select id::text as id,status,source_hash from public.translation_jobs where id=any($1::uuid[])",
        [options.batchJobIds],
      );
      const jobsById = new Map(batchJobRows.map((job) => [job.id, job]));
      const incompleteIds = options.batchJobIds.filter((jobId) => {
        const job = jobsById.get(jobId);
        const batchItem = activeBatch.itemsByJobId.get(jobId);
        return !job || job.status !== "completed" || job.source_hash !== batchItem.sourceHash;
      });
      summary.batchIncomplete = incompleteIds.length;
      if (incompleteIds.length) console.error(`Incomplete translation batch jobs: ${incompleteIds.join(", ")}`);
    }
  } finally {
    await client.end().catch(() => {});
  }
  const ok = summary.failed === 0 && summary.batchIncomplete === 0;
  console.log(JSON.stringify({ ok, locale: options.locale, autoPublish: options.autoPublish, ...summary }, null, 2));
  if (!ok) process.exitCode = 1;
}

main().catch((error) => {
  console.error("TRANSLATION_PROCESSOR_FAILED");
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exitCode = 1;
});
