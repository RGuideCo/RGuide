import fs from "node:fs";
import path from "node:path";

export function readTranslationBatch(filePath) {
  const resolvedPath = path.resolve(filePath);
  const batch = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
  if (batch.schemaVersion !== 1) throw new Error(`Unsupported translation batch schema in ${filePath}.`);
  if (!batch.locale || !Array.isArray(batch.items) || batch.items.length === 0) {
    throw new Error(`Translation batch ${filePath} is missing locale or items.`);
  }
  return { batch, resolvedPath };
}

export function translationWorkload(item) {
  const source = item.input ?? item.source;
  if (item.entityType === "entry") return 1 + (source?.normalizedStops?.length ?? 0);
  if (item.entityType === "event") {
    return 1 + (source?.activations?.length ?? 0) + (source?.occurrences?.length ?? 0);
  }
  if (item.entityType === "destination") {
    const destination = source?.destination;
    return 1 + (destination?.descriptions?.length ?? 0) + (destination?.insights ?? []).reduce(
      (total, insight) => total + 1 + (insight.chips?.length ?? 0) + (insight.notes?.length ?? 0),
      0,
    );
  }
  throw new Error(`Unsupported translation entity type: ${item.entityType}.`);
}

export function compactTranslationItem(item) {
  const common = {
    jobId: item.jobId,
    entityType: item.entityType,
    entityId: item.entityId,
    locale: item.locale,
    sourceHash: item.sourceHash,
    translation: item.translation,
  };
  if (item.entityType === "entry") {
    return {
      ...common,
      source: {
        guide: item.input.guide,
        normalizedStops: (item.input.normalizedStops ?? []).map((stop) => ({
          entryStopId: stop.entryStopId,
          name: stop.name,
          description: stop.description,
        })),
      },
    };
  }
  return { ...common, source: item.input };
}

function assertText(value, label) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} is empty.`);
}

function assertNullableText(value, sourceValue, label) {
  if (sourceValue === null) {
    if (value !== null) throw new Error(`${label} must remain null.`);
    return;
  }
  assertText(value, label);
}

function assertSlug(value, label) {
  assertText(value, label);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) throw new Error(`${label} is not a lowercase ASCII slug.`);
  if (/(?:^|-)(?:citywide|top-10|list)(?:-|$)/.test(value)) throw new Error(`${label} contains a forbidden legacy segment.`);
}

function assertEntryTranslation(item) {
  const translation = item.translation;
  const source = item.input.guide;
  for (const field of ["title", "description", "seoTitle", "seoDescription"]) {
    assertText(translation[field], `${item.jobId}.${field}`);
  }
  assertSlug(translation.seoSlug, `${item.jobId}.seoSlug`);
  if (!Array.isArray(translation.highlights)) throw new Error(`${item.jobId}.highlights must be an array.`);
  if (translation.description === source.description || translation.seoTitle === source.seoTitle || translation.seoDescription === source.seoDescription) {
    throw new Error(`${item.jobId} contains untranslated guide copy.`);
  }
  const sourceStops = item.input.normalizedStops ?? [];
  if (!Array.isArray(translation.stops) || translation.stops.length !== sourceStops.length) {
    throw new Error(`${item.jobId} stop count does not match its source.`);
  }
  for (let index = 0; index < sourceStops.length; index += 1) {
    const sourceStop = sourceStops[index];
    const stop = translation.stops[index];
    if (stop.entryStopId !== sourceStop.entryStopId) throw new Error(`${item.jobId} stop IDs or order changed.`);
    if (stop.placesJson !== sourceStop.placesJson) throw new Error(`${sourceStop.entryStopId} placesJson changed.`);
    assertText(stop.name, `${sourceStop.entryStopId}.name`);
    assertText(stop.description, `${sourceStop.entryStopId}.description`);
    if (stop.description === sourceStop.description) throw new Error(`${sourceStop.entryStopId} description was not translated.`);
  }
}

function assertDestinationTranslation(item) {
  const translation = item.translation;
  const source = item.input.destination;
  for (const field of ["displayName", "seoTitle", "seoDescription"]) {
    assertText(translation[field], `${item.jobId}.${field}`);
  }
  assertSlug(translation.slug, `${item.jobId}.slug`);
  const sourceDescriptions = source.descriptions ?? [];
  if (translation.descriptions?.length !== sourceDescriptions.length) throw new Error(`${item.jobId} description count changed.`);
  for (let index = 0; index < sourceDescriptions.length; index += 1) {
    const sourceDescription = sourceDescriptions[index];
    const description = translation.descriptions[index];
    if (description.kind !== sourceDescription.kind) throw new Error(`${item.jobId} description kind changed.`);
    assertNullableText(description.title, sourceDescription.title, `${item.jobId}.descriptions[${index}].title`);
    assertNullableText(description.summary, sourceDescription.summary, `${item.jobId}.descriptions[${index}].summary`);
    assertText(description.description, `${item.jobId}.descriptions[${index}].description`);
  }
  const sourceInsights = source.insights ?? [];
  if (translation.insights?.length !== sourceInsights.length) throw new Error(`${item.jobId} insight count changed.`);
  for (let index = 0; index < sourceInsights.length; index += 1) {
    const sourceInsight = sourceInsights[index];
    const insight = translation.insights[index];
    if (insight.category !== sourceInsight.category) throw new Error(`${item.jobId} insight category changed.`);
    assertNullableText(insight.label, sourceInsight.label, `${item.jobId}.insights[${index}].label`);
    assertNullableText(insight.summary, sourceInsight.summary, `${item.jobId}.insights[${index}].summary`);
    if (insight.chips?.length !== (sourceInsight.chips?.length ?? 0)) throw new Error(`${item.jobId} chip count changed.`);
    for (let chipIndex = 0; chipIndex < (sourceInsight.chips?.length ?? 0); chipIndex += 1) {
      const sourceChip = sourceInsight.chips[chipIndex];
      const chip = insight.chips[chipIndex];
      if (chip.slug !== sourceChip.slug) throw new Error(`${item.jobId} chip slug changed.`);
      assertText(chip.label, `${item.jobId}.insights[${index}].chips[${chipIndex}].label`);
    }
    if (insight.notes?.length !== (sourceInsight.notes?.length ?? 0)) throw new Error(`${item.jobId} note count changed.`);
    for (let noteIndex = 0; noteIndex < (sourceInsight.notes?.length ?? 0); noteIndex += 1) {
      const sourceNote = sourceInsight.notes[noteIndex];
      const note = insight.notes[noteIndex];
      if (note.key !== sourceNote.key) throw new Error(`${item.jobId} note key changed.`);
      assertNullableText(note.label, sourceNote.label, `${item.jobId}.insights[${index}].notes[${noteIndex}].label`);
      assertText(note.body, `${item.jobId}.insights[${index}].notes[${noteIndex}].body`);
    }
  }
}

function assertEventTranslation(item) {
  const translation = item.translation;
  const source = item.input.event;
  for (const field of ["title", "description", "seoTitle", "seoDescription"]) {
    assertText(translation[field], `${item.jobId}.${field}`);
  }
  assertSlug(translation.seoSlug, `${item.jobId}.seoSlug`);
  if (translation.description === source.description) throw new Error(`${item.jobId} event description was not translated.`);
  for (const group of ["activations", "occurrences"]) {
    const sourceRows = item.input[group] ?? [];
    const rows = translation[group];
    if (!Array.isArray(rows) || rows.length !== sourceRows.length) throw new Error(`${item.jobId} ${group} count changed.`);
    for (let index = 0; index < sourceRows.length; index += 1) {
      const sourceRow = sourceRows[index];
      const row = rows[index];
      if (row.id !== sourceRow.id) throw new Error(`${item.jobId} ${group} IDs or order changed.`);
      assertNullableText(row.title, sourceRow.title, `${item.jobId}.${group}[${index}].title`);
      assertNullableText(row.description, sourceRow.description, `${item.jobId}.${group}[${index}].description`);
    }
  }
}

export function assertCompletedTranslation(item) {
  if (!item.translation || typeof item.translation !== "object" || Array.isArray(item.translation)) {
    throw new Error(`${item.jobId} has no translation object.`);
  }
  if (item.entityType === "entry") assertEntryTranslation(item);
  else if (item.entityType === "destination") assertDestinationTranslation(item);
  else if (item.entityType === "event") assertEventTranslation(item);
  else throw new Error(`Unsupported translation entity type: ${item.entityType}.`);
}

export function assertSourceIdentity(sourceItem, translatedItem) {
  for (const field of ["jobId", "entityType", "entityId", "locale", "sourceHash"]) {
    if (translatedItem[field] !== sourceItem[field]) throw new Error(`${field} changed for ${sourceItem.jobId}.`);
  }
  if (translatedItem.input) {
    if (JSON.stringify(translatedItem.input) !== JSON.stringify(sourceItem.input)) {
      throw new Error(`Source input changed for ${sourceItem.jobId}.`);
    }
    return;
  }
  const expectedCompactSource = compactTranslationItem(sourceItem).source;
  if (JSON.stringify(translatedItem.source) !== JSON.stringify(expectedCompactSource)) {
    throw new Error(`Compact source changed for ${sourceItem.jobId}.`);
  }
}

export function hydrateTranslatedItem(sourceItem, translatedItem) {
  if (translatedItem.input) return translatedItem;
  const translation = translatedItem.translation;
  if (sourceItem.entityType !== "entry") return { ...sourceItem, translation };
  const sourceStops = sourceItem.input.normalizedStops ?? [];
  const translatedStops = translation?.stops ?? [];
  return {
    ...sourceItem,
    translation: {
      ...translation,
      stops: translatedStops.map((stop, index) => ({
        ...stop,
        placesJson: sourceStops[index]?.placesJson,
      })),
    },
  };
}
