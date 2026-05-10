import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import pg from "pg";

import { loadWeeklyEventGuideRecords } from "./weekly-events-data.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MAX_SAMPLES = Number.parseInt(process.env.NORMALIZED_VERIFY_MAX_SAMPLES ?? "20", 10);

function loadEnvFile(relativePath) {
  const fullPath = path.join(repoRoot, relativePath);

  if (!fs.existsSync(fullPath)) {
    return;
  }

  for (const line of fs.readFileSync(fullPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const key = trimmed.slice(0, trimmed.indexOf("=")).trim();
    let value = trimmed.slice(trimmed.indexOf("=") + 1).trim();
    if (!key || process.env[key] !== undefined) {
      continue;
    }
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function getDatabaseUrl() {
  return (
    process.env.SUPABASE_DB_URL ??
    process.env.SUPABASE_DATABASE_URL ??
    process.env.DATABASE_URL ??
    null
  );
}

function getPgSslConfig(databaseUrl) {
  return databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
    ? false
    : { rejectUnauthorized: false };
}

function pushSample(samples, value) {
  if (samples.length < MAX_SAMPLES) {
    samples.push(value);
  }
}

function normalizeScalar(value) {
  return value === undefined ? null : value;
}

function normalizeDate(value) {
  if (!value) {
    return null;
  }
  return String(value).slice(0, 10);
}

function normalizeCoordinates(value) {
  if (!Array.isArray(value) || value.length < 2) {
    return null;
  }
  const lat = Number(value[0]);
  const lng = Number(value[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }
  return [Number(lat.toFixed(6)), Number(lng.toFixed(6))];
}

function sameJson(left, right) {
  return JSON.stringify(sortJson(left ?? null)) === JSON.stringify(sortJson(right ?? null));
}

function sortJson(value) {
  if (!value || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(sortJson);
  }
  return Object.fromEntries(
    Object.entries(value)
      .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
      .map(([key, nestedValue]) => [key, sortJson(nestedValue)]),
  );
}

function getStops(list) {
  return Array.isArray(list?.stops) ? list.stops : [];
}

function getSources(list) {
  return Array.isArray(list?.sources) ? list.sources : [];
}

function isStayGuide(list) {
  const text = [
    list?.category,
    list?.title,
    list?.slug,
    list?.seoSlug,
    list?.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return /\bstay\b|\bstays\b|\bhotel\b|\bhotels\b|\bhostel\b|\bhostels\b|where to stay/.test(text);
}

function isHotelOrHostelStop(stop) {
  const text = [stop?.name, stop?.category, stop?.description, stop?.bookingUrl]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return /\bhotel\b|\bhostel\b|\binn\b|\bsuites\b|\bresort\b|\bguesthouse\b|booking\.com|hostelworld/.test(text);
}

function compareFields({ legacy, normalized, samples }) {
  const fields = [
    "id",
    "slug",
    "seoSlug",
    "seoTitle",
    "seoDescription",
    "title",
    "description",
    "photo",
    "url",
    "category",
    "submissionType",
  ];
  let mismatchCount = 0;

  for (const field of fields) {
    if (normalizeScalar(legacy[field]) !== normalizeScalar(normalized[field])) {
      mismatchCount += 1;
      pushSample(samples.fieldMismatches, {
        id: legacy.id,
        field,
        legacy: legacy[field] ?? null,
        normalized: normalized[field] ?? null,
      });
    }
  }

  const legacyLocation = legacy.location ?? {};
  const normalizedLocation = normalized.location ?? {};
  for (const field of ["city", "neighborhood", "country", "continent", "scope"]) {
    if (normalizeScalar(legacyLocation[field]) !== normalizeScalar(normalizedLocation[field])) {
      mismatchCount += 1;
      pushSample(samples.fieldMismatches, {
        id: legacy.id,
        field: `location.${field}`,
        legacy: legacyLocation[field] ?? null,
        normalized: normalizedLocation[field] ?? null,
      });
    }
  }

  const legacyCreator = legacy.creator ?? {};
  const normalizedCreator = normalized.creator ?? {};
  for (const field of ["id", "name", "avatar"]) {
    if (normalizeScalar(legacyCreator[field]) !== normalizeScalar(normalizedCreator[field])) {
      mismatchCount += 1;
      pushSample(samples.fieldMismatches, {
        id: legacy.id,
        field: `creator.${field}`,
        legacy: legacyCreator[field] ?? null,
        normalized: normalizedCreator[field] ?? null,
      });
    }
  }

  if (Number(legacy.upvotes ?? 0) !== Number(normalized.upvotes ?? 0)) {
    mismatchCount += 1;
    pushSample(samples.fieldMismatches, {
      id: legacy.id,
      field: "upvotes",
      legacy: legacy.upvotes ?? null,
      normalized: normalized.upvotes ?? null,
    });
  }

  if (normalizeDate(legacy.createdAt) !== normalizeDate(normalized.createdAt)) {
    mismatchCount += 1;
    pushSample(samples.fieldMismatches, {
      id: legacy.id,
      field: "createdAt",
      legacy: legacy.createdAt ?? null,
      normalized: normalized.createdAt ?? null,
    });
  }

  if (!sameJson(legacy.highlights ?? [], normalized.highlights ?? [])) {
    mismatchCount += 1;
    pushSample(samples.fieldMismatches, {
      id: legacy.id,
      field: "highlights",
      legacy: legacy.highlights ?? [],
      normalized: normalized.highlights ?? [],
    });
  }

  if (!sameJson(legacy.itinerary ?? null, normalized.itinerary ?? null)) {
    mismatchCount += 1;
    pushSample(samples.fieldMismatches, {
      id: legacy.id,
      field: "itinerary",
      legacy: legacy.itinerary ?? null,
      normalized: normalized.itinerary ?? null,
    });
  }

  return mismatchCount;
}

function compareStops({ legacy, normalized, samples }) {
  const legacyStops = getStops(legacy);
  const normalizedStops = getStops(normalized);
  let mismatchCount = 0;
  let bookingUrlMismatchCount = 0;

  if (legacyStops.length !== normalizedStops.length) {
    mismatchCount += 1;
    pushSample(samples.stopCountMismatches, {
      id: legacy.id,
      title: legacy.title,
      legacy: legacyStops.length,
      normalized: normalizedStops.length,
    });
  }

  for (let index = 0; index < Math.min(legacyStops.length, normalizedStops.length); index += 1) {
    const legacyStop = legacyStops[index] ?? {};
    const normalizedStop = normalizedStops[index] ?? {};
    const stopFields = [
      "id",
      "poiId",
      "name",
      "description",
      "category",
      "photo",
      "price",
      "priceSource",
      "bookingUrl",
      "officialUrl",
      "eventTime",
      "eventVenue",
      "hours",
    ];

    for (const field of stopFields) {
      const legacyValue =
        field === "hours" ? legacyStop[field] ?? null : normalizeScalar(legacyStop[field]);
      const normalizedValue =
        field === "hours" ? normalizedStop[field] ?? null : normalizeScalar(normalizedStop[field]);

      if (!sameJson(legacyValue, normalizedValue)) {
        mismatchCount += 1;
        if (field === "bookingUrl") {
          bookingUrlMismatchCount += 1;
          pushSample(samples.bookingUrlMismatches, {
            id: legacy.id,
            stop: legacyStop.name ?? legacyStop.id ?? index,
            legacy: legacyStop.bookingUrl ?? null,
            normalized: normalizedStop.bookingUrl ?? null,
          });
        } else {
          pushSample(samples.stopFieldMismatches, {
            id: legacy.id,
            stop: legacyStop.name ?? legacyStop.id ?? index,
            field,
            legacy: legacyValue,
            normalized: normalizedValue,
          });
        }
      }
    }

    if (!sameJson(normalizeCoordinates(legacyStop.coordinates), normalizeCoordinates(normalizedStop.coordinates))) {
      mismatchCount += 1;
      pushSample(samples.stopFieldMismatches, {
        id: legacy.id,
        stop: legacyStop.name ?? legacyStop.id ?? index,
        field: "coordinates",
        legacy: legacyStop.coordinates ?? null,
        normalized: normalizedStop.coordinates ?? null,
      });
    }

    if (normalizeDate(legacyStop.itineraryDate) !== normalizeDate(normalizedStop.itineraryDate)) {
      mismatchCount += 1;
      pushSample(samples.stopFieldMismatches, {
        id: legacy.id,
        stop: legacyStop.name ?? legacyStop.id ?? index,
        field: "itineraryDate",
        legacy: legacyStop.itineraryDate ?? null,
        normalized: normalizedStop.itineraryDate ?? null,
      });
    }

    if (Number(legacyStop.itineraryDay ?? 0) !== Number(normalizedStop.itineraryDay ?? 0)) {
      mismatchCount += 1;
      pushSample(samples.stopFieldMismatches, {
        id: legacy.id,
        stop: legacyStop.name ?? legacyStop.id ?? index,
        field: "itineraryDay",
        legacy: legacyStop.itineraryDay ?? null,
        normalized: normalizedStop.itineraryDay ?? null,
      });
    }
  }

  return { mismatchCount, bookingUrlMismatchCount };
}

function countStayMetrics(lists) {
  const stayGuides = lists.filter((list) => isStayGuide(list));
  const stayStops = stayGuides.flatMap((guide) => getStops(guide));
  const lodgingStops = stayStops.filter((stop) => isHotelOrHostelStop(stop));
  const bookingUrlStops = lodgingStops.filter((stop) => Boolean(stop.bookingUrl));

  return {
    guideCount: stayGuides.length,
    stopCount: stayStops.length,
    lodgingStopCount: lodgingStops.length,
    bookingUrlCount: bookingUrlStops.length,
  };
}

async function tableExists(client, tableName) {
  const { rows } = await client.query("select to_regclass($1) as table_name", [tableName]);
  return Boolean(rows[0]?.table_name);
}

async function loadEditorialGuides(client) {
  const { rows } = await client.query(
    [
      "select id, slug, list",
      "from public.editorial_guides",
      "order by id asc",
    ].join(" "),
  );

  return rows.map((row) => ({
    legacyId: row.id,
    slug: row.slug,
    list: row.list,
  }));
}

async function loadNormalizedEditorialGuides(client) {
  const { rows } = await client.query(
    [
      "select",
      "  entry.id as normalized_id,",
      "  entry.legacy_id,",
      "  entry.slug,",
      "  entry.cached_map_list,",
      "  view.list,",
      "  (",
      "    select count(*)::int",
      "    from public.entry_stops stop",
      "    where stop.entry_id = entry.id",
      "  ) as normalized_stop_count,",
      "  (",
      "    select count(*)::int",
      "    from public.entity_sources entity_source",
      "    where entity_source.entity_type = 'entry'",
      "      and entity_source.entity_id = entry.id",
      "  ) as normalized_source_count",
      "from public.entries entry",
      "join public.entries_maplist view on view.id = entry.id",
      "where entry.source_table = 'editorial_guides'",
      "order by entry.legacy_id asc",
    ].join(" "),
  );

  return rows.map((row) => ({
    normalizedId: row.normalized_id,
    legacyId: row.legacy_id,
    slug: row.slug,
    cachedMapList: row.cached_map_list,
    list: row.list,
    normalizedStopCount: row.normalized_stop_count,
    normalizedSourceCount: row.normalized_source_count,
  }));
}

async function loadSubmittedCounts(client) {
  if (!(await tableExists(client, "public.submitted_guides"))) {
    return { legacySubmittedGuides: 0, normalizedSubmittedEntries: 0 };
  }

  const [legacyResult, normalizedResult] = await Promise.all([
    client.query("select count(*)::int as count from public.submitted_guides"),
    client.query("select count(*)::int as count from public.entries where source_table = 'submitted_guides'"),
  ]);

  return {
    legacySubmittedGuides: legacyResult.rows[0]?.count ?? 0,
    normalizedSubmittedEntries: normalizedResult.rows[0]?.count ?? 0,
  };
}

async function loadWeeklyEventGuides(client) {
  if (!(await tableExists(client, "public.weekly_event_guides"))) {
    return loadLocalWeeklyEventGuides();
  }

  const { rows } = await client.query(
    [
      "select id, guide",
      "from public.weekly_event_guides",
      "order by id asc",
    ].join(" "),
  );

  if (rows.length === 0) {
    return loadLocalWeeklyEventGuides();
  }

  return rows.map((row) => ({
    legacyId: row.id,
    list: normalizeWeeklyEventGuide(row.guide),
  }));
}

function normalizeWeeklyEventGuide(guide) {
  if (!guide?.id?.startsWith("event-")) {
    return guide;
  }

  return {
    ...guide,
    submissionType: "event",
  };
}

function loadLocalWeeklyEventGuides() {
  return loadWeeklyEventGuideRecords().map((record) => ({
    legacyId: record.id,
    list: normalizeWeeklyEventGuide(record.guide),
  }));
}

async function loadNormalizedWeeklyEvents(client) {
  if (!(await tableExists(client, "public.weekly_event_publications"))) {
    return [];
  }

  const { rows } = await client.query(
    [
      "select",
      "  publication.id as normalized_id,",
      "  publication.rendered_map_list,",
      "  publication.raw_event,",
      "  publication.submission_type,",
      "  publication.event_category,",
      "  publication.has_schedule,",
      "  publication.is_festival,",
      "  (",
      "    select count(*)::int",
      "    from public.event_occurrences occurrence",
      "    where occurrence.event_id = publication.event_id",
      "  ) as occurrence_count",
      "from public.weekly_event_publications publication",
      "order by publication.raw_event->>'id' asc",
    ].join(" "),
  );

  return rows.map((row) => ({
    normalizedId: row.normalized_id,
    legacyId: row.rendered_map_list?.id ?? row.raw_event?.id ?? null,
    list: row.rendered_map_list,
    submissionType: row.submission_type,
    eventCategory: row.event_category,
    hasSchedule: row.has_schedule,
    isFestival: row.is_festival,
    occurrenceCount: row.occurrence_count,
  }));
}

function compareGuideCollections({ legacyRows, normalizedRows, label }) {
  const samples = {
    missingNormalized: [],
    extraNormalized: [],
    fieldMismatches: [],
    stopCountMismatches: [],
    stopFieldMismatches: [],
    bookingUrlMismatches: [],
    sourceCountMismatches: [],
  };

  const normalizedByLegacyId = new Map(normalizedRows.map((row) => [row.legacyId, row]));
  const legacyById = new Map(legacyRows.map((row) => [row.legacyId, row]));
  let guideFieldMismatchCount = 0;
  let stopMismatchCount = 0;
  let bookingUrlMismatchCount = 0;
  let sourceCountMismatchCount = 0;

  for (const legacyRow of legacyRows) {
    const normalizedRow = normalizedByLegacyId.get(legacyRow.legacyId);
    if (!normalizedRow) {
      pushSample(samples.missingNormalized, {
        id: legacyRow.legacyId,
        slug: legacyRow.slug ?? legacyRow.list?.slug ?? null,
        title: legacyRow.list?.title ?? null,
      });
      continue;
    }

    guideFieldMismatchCount += compareFields({
      legacy: legacyRow.list,
      normalized: normalizedRow.list,
      samples,
    });

    const stopComparison = compareStops({
      legacy: legacyRow.list,
      normalized: normalizedRow.list,
      samples,
    });
    stopMismatchCount += stopComparison.mismatchCount;
    bookingUrlMismatchCount += stopComparison.bookingUrlMismatchCount;

    const legacyStopCount = getStops(legacyRow.list).length;
    if (normalizedRow.normalizedStopCount !== undefined && normalizedRow.normalizedStopCount !== legacyStopCount) {
      pushSample(samples.stopCountMismatches, {
        id: legacyRow.legacyId,
        title: legacyRow.list?.title ?? null,
        legacy: legacyStopCount,
        normalizedRows: normalizedRow.normalizedStopCount,
      });
    }

    const legacySourceCount = getSources(legacyRow.list).length;
    if (
      normalizedRow.normalizedSourceCount !== undefined &&
      legacySourceCount > 0 &&
      normalizedRow.normalizedSourceCount !== legacySourceCount
    ) {
      sourceCountMismatchCount += 1;
      pushSample(samples.sourceCountMismatches, {
        id: legacyRow.legacyId,
        title: legacyRow.list?.title ?? null,
        legacy: legacySourceCount,
        normalized: normalizedRow.normalizedSourceCount,
      });
    }
  }

  for (const normalizedRow of normalizedRows) {
    if (!legacyById.has(normalizedRow.legacyId)) {
      pushSample(samples.extraNormalized, {
        id: normalizedRow.legacyId,
        normalizedId: normalizedRow.normalizedId,
        slug: normalizedRow.slug ?? normalizedRow.list?.slug ?? null,
        title: normalizedRow.list?.title ?? null,
      });
    }
  }

  const legacyLists = legacyRows.map((row) => row.list);
  const normalizedLists = normalizedRows.map((row) => row.list);
  const legacyStay = countStayMetrics(legacyLists);
  const normalizedStay = countStayMetrics(normalizedLists);

  return {
    label,
    totals: {
      legacy: legacyRows.length,
      normalized: normalizedRows.length,
      missingNormalized: samples.missingNormalized.length,
      extraNormalized: samples.extraNormalized.length,
      guideFieldMismatches: guideFieldMismatchCount,
      stopFieldMismatches: stopMismatchCount,
      bookingUrlMismatches: bookingUrlMismatchCount,
      sourceCountMismatches: sourceCountMismatchCount,
      stay: {
        legacy: legacyStay,
        normalized: normalizedStay,
      },
    },
    samples,
  };
}

function summarizeCriticalFailures(report) {
  const failures = [];

  for (const collection of [report.editorialGuides, report.weeklyEvents]) {
    if (!collection) {
      continue;
    }
    const totals = collection.totals;
    if (totals.legacy !== totals.normalized) {
      failures.push(`${collection.label}: count mismatch (${totals.legacy} legacy vs ${totals.normalized} normalized)`);
    }
    if (totals.missingNormalized > 0) {
      failures.push(`${collection.label}: ${totals.missingNormalized} missing normalized records`);
    }
    if (totals.extraNormalized > 0) {
      failures.push(`${collection.label}: ${totals.extraNormalized} extra normalized records`);
    }
    if (totals.guideFieldMismatches > 0) {
      failures.push(`${collection.label}: ${totals.guideFieldMismatches} guide field mismatches`);
    }
    if (totals.stopFieldMismatches > 0) {
      failures.push(`${collection.label}: ${totals.stopFieldMismatches} stop field mismatches`);
    }
    if (totals.bookingUrlMismatches > 0) {
      failures.push(`${collection.label}: ${totals.bookingUrlMismatches} booking URL mismatches`);
    }
    if (totals.stay.legacy.guideCount !== totals.stay.normalized.guideCount) {
      failures.push(`${collection.label}: Stay guide count mismatch`);
    }
    if (totals.stay.legacy.stopCount !== totals.stay.normalized.stopCount) {
      failures.push(`${collection.label}: Stay stop count mismatch`);
    }
    if (totals.stay.legacy.bookingUrlCount !== totals.stay.normalized.bookingUrlCount) {
      failures.push(`${collection.label}: Stay booking URL count mismatch`);
    }
  }

  if (report.submittedGuides.legacySubmittedGuides !== report.submittedGuides.normalizedSubmittedEntries) {
    failures.push(
      `submitted guides: count mismatch (${report.submittedGuides.legacySubmittedGuides} legacy vs ${report.submittedGuides.normalizedSubmittedEntries} normalized)`,
    );
  }

  return failures;
}

async function main() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    throw new Error("Set SUPABASE_DB_URL, SUPABASE_DATABASE_URL, or DATABASE_URL.");
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: getPgSslConfig(databaseUrl),
  });

  await client.connect();

  try {
    await client.query("begin read only");

    const legacyEditorialRows = await loadEditorialGuides(client);
    const normalizedEditorialRows = await loadNormalizedEditorialGuides(client);
    const legacyWeeklyRows = await loadWeeklyEventGuides(client);
    const normalizedWeeklyRows = await loadNormalizedWeeklyEvents(client);
    const submittedGuides = await loadSubmittedCounts(client);

    const report = {
      ok: false,
      generatedAt: new Date().toISOString(),
      mode: "read-only",
      editorialGuides: compareGuideCollections({
        label: "editorial guides",
        legacyRows: legacyEditorialRows,
        normalizedRows: normalizedEditorialRows,
      }),
      weeklyEvents: compareGuideCollections({
        label: "weekly event guides",
        legacyRows: legacyWeeklyRows,
        normalizedRows: normalizedWeeklyRows,
      }),
      submittedGuides,
    };

    const criticalFailures = summarizeCriticalFailures(report);
    report.ok = criticalFailures.length === 0;
    report.criticalFailures = criticalFailures;

    console.log(JSON.stringify(report, null, 2));

    if (!report.ok) {
      process.exitCode = 1;
    }
  } finally {
    await client.query("rollback").catch(() => {});
    await client.end().catch(() => {});
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
