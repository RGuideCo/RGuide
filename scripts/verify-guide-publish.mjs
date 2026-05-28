import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import pg from "pg";

import {
  describeEditorialGuideFilters,
  filterEditorialGuides,
  hasEditorialGuideFilters,
  loadEditorialGuideLists,
} from "./editorial-guides-data.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_R2_BASE_URL = "https://media.rguide.co";
const PAID_CATEGORIES = new Set(["Food", "Nightlife", "Stay"]);
const SOURCE_HEAVY_CATEGORIES = new Set(["Food", "Nightlife", "Stay", "Activities", "Culture"]);
const GENERIC_DESCRIPTION_PATTERNS = [
  /\bhidden gem\b/i,
  /\bmust[-\s]?see\b/i,
  /\bsomething for everyone\b/i,
  /\bunforgettable experience\b/i,
  /\bvibrant atmosphere\b/i,
  /\bworld[-\s]?class\b/i,
  /\biconic destination\b/i,
  /\bperfect for (locals|tourists|visitors) alike\b/i,
  /\boffers a unique\b/i,
  /\bis known for its delicious\b/i,
];

function usage() {
  return [
    "Usage:",
    "  npm run verify:guide-publish -- --city Paris",
    "  npm run verify:guide-publish -- --city Paris --strict",
    "  npm run verify:guide-publish -- --slug list-paris-citywide-hotels --strict --live",
    "",
    "Options:",
    "  --country <name>        Scope by country.",
    "  --city <name>           Scope by city.",
    "  --neighborhood <name>   Scope by neighborhood.",
    "  --id <legacy id>        Scope by guide id.",
    "  --slug <slug>           Scope by guide slug.",
    "  --strict                Promote research/source/R2 warnings to blocking errors.",
    "  --live                  Check Supabase entries, entry_stops, venue primary media, and render cache.",
    "  --local-only            Skip live checks even if env vars are present.",
    "  --require-r2            Require rendered and primary venue photos to use the R2 public base URL.",
    "  --r2-base <url>         R2 public base URL. Defaults to CLOUDFLARE_R2_PUBLIC_BASE_URL or media.rguide.co.",
    "  --min-sources <n>       Minimum list-level source count. Defaults to 10 in strict mode, 1 otherwise.",
    "  --min-stop-sources <n>  Minimum stop source evidence count. Defaults to 2 in strict mode, 0 otherwise.",
    "  --max-warnings <n>      Fail if warning count exceeds this value.",
    "  --json                  Print machine-readable JSON.",
  ].join("\n");
}

function parseArgs(argv) {
  const filters = {
    countries: [],
    cities: [],
    neighborhoods: [],
    ids: [],
    slugs: [],
  };
  const options = {
    strict: false,
    live: false,
    localOnly: false,
    requireR2: false,
    r2BaseUrl: process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL || DEFAULT_R2_BASE_URL,
    minSources: null,
    minStopSources: null,
    maxWarnings: null,
    json: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const rawArg = argv[index];
    const [arg, inlineValue] = rawArg.includes("=") ? rawArg.split(/=(.*)/s, 2) : [rawArg, undefined];
    const readValue = () => {
      const value = inlineValue ?? argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for ${arg}`);
      }
      if (inlineValue === undefined) index += 1;
      return value;
    };

    if (arg === "--help" || arg === "-h") {
      console.log(usage());
      process.exit(0);
    }
    if (arg === "--strict") options.strict = true;
    else if (arg === "--live") options.live = true;
    else if (arg === "--local-only") options.localOnly = true;
    else if (arg === "--require-r2") options.requireR2 = true;
    else if (arg === "--json") options.json = true;
    else if (arg === "--country") filters.countries.push(...splitValues(readValue()));
    else if (arg === "--city") filters.cities.push(...splitValues(readValue()));
    else if (arg === "--neighborhood") filters.neighborhoods.push(...splitValues(readValue()));
    else if (arg === "--id") filters.ids.push(...splitValues(readValue()));
    else if (arg === "--slug") filters.slugs.push(...splitValues(readValue()));
    else if (arg === "--r2-base") options.r2BaseUrl = readValue();
    else if (arg === "--min-sources") options.minSources = parseInteger(readValue(), arg);
    else if (arg === "--min-stop-sources") options.minStopSources = parseInteger(readValue(), arg);
    else if (arg === "--max-warnings") options.maxWarnings = parseInteger(readValue(), arg);
    else {
      throw new Error(`Unknown option: ${rawArg}`);
    }
  }

  if (options.localOnly && options.live) {
    throw new Error("Use either --live or --local-only, not both.");
  }

  if (options.strict && options.live) {
    options.requireR2 = true;
  }

  options.r2BaseUrl = options.r2BaseUrl.replace(/\/$/, "");
  options.minSources ??= options.strict ? 10 : 1;
  options.minStopSources ??= options.strict ? 2 : 0;

  return { filters, options };
}

function splitValues(value) {
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseInteger(value, label) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`${label} must be a non-negative integer.`);
  }
  return parsed;
}

function loadEnvFile(filePath) {
  const fullPath = path.join(ROOT, filePath);
  if (!fs.existsSync(fullPath)) return;

  for (const line of fs.readFileSync(fullPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const key = trimmed.slice(0, trimmed.indexOf("=")).trim();
    let value = trimmed.slice(trimmed.indexOf("=") + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function getDatabaseUrl() {
  return process.env.SUPABASE_DB_URL ?? process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL ?? null;
}

function getPgSslConfig(databaseUrl) {
  return databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
    ? false
    : { rejectUnauthorized: false };
}

function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(value) {
  return normalizeText(value).split(/\s+/).filter(Boolean).length;
}

function countSentences(value) {
  return String(value ?? "")
    .split(/[.!?]+/)
    .map((item) => item.trim())
    .filter(Boolean).length;
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function walkStops(list, callback, stops = list.stops ?? [], parentPath = []) {
  stops.forEach((stop, index) => {
    const pathParts = [...parentPath, stop.name || stop.id || `stop-${index + 1}`];
    callback(stop, list, pathParts);
    if (Array.isArray(stop.places)) {
      walkStops(list, callback, stop.places, pathParts);
    }
  });
}

function topLevelStopCount(list) {
  return Array.isArray(list.stops) ? list.stops.length : 0;
}

function evidenceUrlsFromValue(value, urls = []) {
  if (!value) return urls;
  if (typeof value === "string") {
    if (isValidUrl(value)) urls.push(value);
    return urls;
  }
  if (Array.isArray(value)) {
    for (const item of value) evidenceUrlsFromValue(item, urls);
    return urls;
  }
  if (typeof value === "object") {
    for (const item of Object.values(value)) evidenceUrlsFromValue(item, urls);
  }
  return urls;
}

function stopEvidenceUrls(stop) {
  return unique([
    ...evidenceUrlsFromValue(stop.sourceUrls),
    ...evidenceUrlsFromValue(stop.sourceEvidence),
    ...evidenceUrlsFromValue(stop.officialUrl),
    ...evidenceUrlsFromValue(stop.bookingUrl),
    ...evidenceUrlsFromValue(stop.timetableUrl),
    ...evidenceUrlsFromValue(stop.imageSourceUrl),
  ]);
}

function hasExplicitOfficialEvidence(stop) {
  return Boolean(stop.officialUrl || stop.bookingUrl || stop.sourceEvidence?.officialUrl);
}

function hasMapEvidence(stop) {
  const urls = stopEvidenceUrls(stop);
  return Boolean(
    stop.sourceEvidence?.mapUrl ||
      urls.some((url) => /(^|\/\/)(www\.)?(google\.[^/]+\/maps|maps\.app\.goo\.gl|apple\.com\/maps|tripadvisor\.)/i.test(url)),
  );
}

function hasImageEvidence(stop) {
  return Boolean(stop.imageSourceUrl || stop.sourceEvidence?.imageSourceUrl || stop.photo);
}

function looksLikePlaceholderPhoto(url) {
  if (!url) return false;
  return /placeholder|default|favicon|logo|brand|sprite|blank/i.test(url) || /images\.unsplash\.com/i.test(url);
}

function looksLikeBrokenImageUrl(url) {
  if (!url) return false;
  if (!isValidUrl(url)) return true;
  if (/\.(jpg|jpeg|png|webp|avif|gif)(\?|#|$)/i.test(url)) return false;
  if (/commons\.wikimedia\.org\/wiki\/Special:FilePath\//i.test(url)) return false;
  if (/media\.rguide\.co\//i.test(url)) return false;
  if (/[?&](format|fm|auto|image|img)=/i.test(url)) return false;
  return false;
}

function severityForStrict(options, strictSeverity = "error", defaultSeverity = "warning") {
  return options.strict ? strictSeverity : defaultSeverity;
}

function addIssue(report, severity, scope, message, extra = {}) {
  report[severity === "error" ? "errors" : "warnings"].push({ scope, message, ...extra });
}

function guideLabel(list) {
  return `${list.slug || list.id || "<unknown guide>"}`;
}

function stopLabel(list, stop, pathParts) {
  return `${guideLabel(list)} > ${pathParts.join(" > ") || stop.name || stop.id || "<unknown stop>"}`;
}

function checkGuideBasics(list, report, options) {
  const label = guideLabel(list);
  const sources = Array.isArray(list.sources) ? list.sources.filter((source) => isValidUrl(source?.url)) : [];

  for (const field of ["id", "slug", "seoTitle", "seoDescription", "title", "description", "url", "category"]) {
    if (!String(list[field] ?? "").trim()) {
      addIssue(report, "error", label, `Missing guide field: ${field}`);
    }
  }

  if (!list.location?.city && list.location?.scope === "city") {
    addIssue(report, "error", label, "City-scoped guide is missing location.city.");
  }

  if (!Array.isArray(list.stops) || !list.stops.length) {
    addIssue(report, "error", label, "Guide has no stops.");
  }

  if (sources.length < options.minSources && SOURCE_HEAVY_CATEGORIES.has(list.category)) {
    addIssue(
      report,
      severityForStrict(options),
      label,
      `Guide has ${sources.length} valid list-level sources; expected at least ${options.minSources}.`,
      { sourceCount: sources.length, expected: options.minSources },
    );
  }

  if (countWords(list.description) < (options.strict ? 18 : 8)) {
    addIssue(report, severityForStrict(options), label, "Guide description is too thin for a polished card.");
  }
}

function checkStopBasics(list, stop, pathParts, report, options) {
  const label = stopLabel(list, stop, pathParts);
  const evidenceUrls = stopEvidenceUrls(stop);

  for (const field of ["id", "name", "description"]) {
    if (!String(stop[field] ?? "").trim()) {
      addIssue(report, "error", label, `Missing stop field: ${field}`);
    }
  }

  const coordinates = stop.coordinates;
  const lat = Number(coordinates?.[0]);
  const lng = Number(coordinates?.[1]);
  if (!Array.isArray(coordinates) || coordinates.length < 2 || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    addIssue(report, "error", label, "Missing or invalid [latitude, longitude] coordinates.");
  } else if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    addIssue(report, "error", label, "Coordinates are outside valid latitude/longitude ranges.");
  }

  const wordCount = countWords(stop.description);
  const minWords = options.strict ? 35 : 18;
  if (wordCount < minWords) {
    addIssue(report, severityForStrict(options), label, `Stop description has ${wordCount} words; expected at least ${minWords}.`);
  }

  if (options.strict && countSentences(stop.description) < 2) {
    addIssue(report, "error", label, "Strict mode expects a 2-4 sentence stop description.");
  }

  for (const pattern of GENERIC_DESCRIPTION_PATTERNS) {
    if (pattern.test(stop.description ?? "")) {
      addIssue(report, severityForStrict(options), label, `Description contains generic phrasing: ${pattern.source}`);
    }
  }

  if (!stop.hours) {
    addIssue(report, severityForStrict(options), label, "Missing hours or a clear hours caveat.");
  }

  if (evidenceUrls.length < options.minStopSources) {
    addIssue(
      report,
      severityForStrict(options),
      label,
      `Stop has ${evidenceUrls.length} source evidence URLs; expected at least ${options.minStopSources}.`,
      { sourceCount: evidenceUrls.length, expected: options.minStopSources },
    );
  }

  if (options.strict && !hasExplicitOfficialEvidence(stop)) {
    addIssue(report, "error", label, "Missing explicit official/property URL evidence.");
  }

  if (options.strict && !hasMapEvidence(stop)) {
    addIssue(report, "error", label, "Missing map/current-status evidence URL.");
  }

  if (options.strict && !hasImageEvidence(stop)) {
    addIssue(report, "error", label, "Missing image source evidence.");
  }

  if (!stop.photo) {
    addIssue(report, severityForStrict(options), label, "Missing local image candidate before R2 ingestion.");
  } else {
    if (looksLikePlaceholderPhoto(stop.photo)) {
      addIssue(report, severityForStrict(options), label, "Image candidate looks like a placeholder, logo, favicon, or generic stock fallback.", { photo: stop.photo });
    }
    if (looksLikeBrokenImageUrl(stop.photo)) {
      addIssue(report, severityForStrict(options), label, "Image candidate URL looks broken or non-image-like.", { photo: stop.photo });
    }
  }

  if (PAID_CATEGORIES.has(list.category) && !stop.price) {
    addIssue(report, severityForStrict(options, "error", "warning"), label, "Missing price tier for a paid/usefully priced category.");
  }

  if (stop.price && PAID_CATEGORIES.has(list.category) && !stop.priceSource) {
    addIssue(report, severityForStrict(options), label, "Missing priceSource for price tier.");
  }

  if (options.strict && list.category === "Food") {
    if (!stop.foodServiceType) addIssue(report, "error", label, "Food stop is missing foodServiceType.");
    if (!Array.isArray(stop.cuisineTypes) || !stop.cuisineTypes.length) {
      addIssue(report, "error", label, "Food stop is missing cuisineTypes.");
    }
  }

  if (options.strict && list.category === "Nightlife") {
    if (!stop.nightlifeType) addIssue(report, "error", label, "Nightlife stop is missing nightlifeType.");
  }

  if (options.strict && ["Food", "Nightlife", "Stay"].includes(list.category)) {
    if (!Array.isArray(stop.attributeTags) || !stop.attributeTags.length) {
      addIssue(report, "error", label, "Stop is missing searchable attributeTags.");
    }
  }
}

function checkGuideConsistency(list, report, options) {
  const label = guideLabel(list);
  const stopIds = new Map();
  const descriptions = new Map();
  const lodgingTypes = new Set();

  walkStops(list, (stop, _list, pathParts) => {
    const stopId = normalizeText(stop.id);
    if (stopId) {
      const first = stopIds.get(stopId);
      if (first) {
        addIssue(report, "error", label, `Duplicate stop id ${stop.id}: ${first} and ${pathParts.join(" > ")}`);
      } else {
        stopIds.set(stopId, pathParts.join(" > "));
      }
    }

    const descriptionKey = normalizeText(stop.description);
    if (descriptionKey && descriptionKey.length > 80) {
      const first = descriptions.get(descriptionKey);
      if (first) {
        addIssue(report, severityForStrict(options), label, `Repeated stop description: ${first} and ${pathParts.join(" > ")}`);
      } else {
        descriptions.set(descriptionKey, pathParts.join(" > "));
      }
    }

    if (stop.lodgingType) lodgingTypes.add(stop.lodgingType);
  });

  if (list.category === "Stay") {
    const hasHotel = lodgingTypes.has("hotel");
    const hasHostel = lodgingTypes.has("hostel");
    if (hasHotel && hasHostel) {
      addIssue(report, "error", label, "Stay guide mixes hotel and hostel lodging types. Split them into separate guides.");
    }
    if (options.strict && lodgingTypes.size === 0) {
      addIssue(report, "error", label, "Strict Stay guides need explicit lodgingType values on stops.");
    }
    if (/\bhostels?\b/i.test(`${list.slug} ${list.title} ${list.seoTitle}`) && hasHotel) {
      addIssue(report, "error", label, "Hostel-labeled guide contains hotel lodgingType stops.");
    }
    if (/\bhotels?\b/i.test(`${list.slug} ${list.title} ${list.seoTitle}`) && hasHostel) {
      addIssue(report, "error", label, "Hotel-labeled guide contains hostel lodgingType stops.");
    }
  }
}

function runLocalChecks(guides, options) {
  const report = {
    scope: "local",
    checkedGuides: guides.length,
    checkedStops: 0,
    errors: [],
    warnings: [],
  };

  const allDescriptions = new Map();
  for (const list of guides) {
    checkGuideBasics(list, report, options);
    checkGuideConsistency(list, report, options);
    walkStops(list, (stop, currentList, pathParts) => {
      report.checkedStops += 1;
      checkStopBasics(currentList, stop, pathParts, report, options);

      const key = normalizeText(stop.description);
      if (key && key.length > 80) {
        const first = allDescriptions.get(key);
        const label = stopLabel(currentList, stop, pathParts);
        if (first && first !== label) {
          addIssue(report, severityForStrict(options), "all selected guides", `Repeated stop description across guides: ${first} and ${label}`);
        } else {
          allDescriptions.set(key, label);
        }
      }
    });
  }

  return report;
}

async function runLiveChecks(guides, options) {
  loadEnvFile(".env.local");
  loadEnvFile(".env");
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    throw new Error("Set SUPABASE_DB_URL, SUPABASE_DATABASE_URL, or DATABASE_URL to run --live checks.");
  }

  const report = {
    scope: "live",
    checkedGuides: guides.length,
    checkedStops: 0,
    errors: [],
    warnings: [],
  };

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: getPgSslConfig(databaseUrl),
  });

  await client.connect();
  try {
    const legacyIds = guides.map((guide) => guide.id);
    const slugs = guides.map((guide) => guide.slug);
    const { rows } = await client.query(
      `select
         entry.id,
         entry.legacy_id,
         entry.slug,
         entry.category,
         entry.submission_type,
         cache.rendered_payload,
         coalesce((
           select count(*)::int from public.entry_stops stop where stop.entry_id = entry.id
         ), 0) as stop_count
       from public.entries entry
       left join public.entry_render_cache cache
         on cache.entry_id = entry.id
        and cache.render_format = 'maplist'
        and cache.is_current = true
       where entry.legacy_id = any($1::text[])
          or entry.slug = any($2::text[])`,
      [legacyIds, slugs],
    );

    const rowsByLegacyId = new Map(rows.map((row) => [row.legacy_id, row]));
    const entryIds = rows.map((row) => row.id);

    for (const guide of guides) {
      const row = rowsByLegacyId.get(guide.id);
      const label = guideLabel(guide);
      if (!row) {
        addIssue(report, "error", label, "Guide was not found in public.entries after publish.");
        continue;
      }

      if (row.slug !== guide.slug) {
        addIssue(report, "error", label, `Published slug mismatch: ${row.slug}`);
      }
      if (Number(row.stop_count) !== topLevelStopCount(guide)) {
        addIssue(report, severityForStrict(options), label, `Published entry_stops count ${row.stop_count} does not match local top-level stop count ${topLevelStopCount(guide)}.`);
      }
      if (!row.rendered_payload) {
        addIssue(report, "error", label, "Missing current entry_render_cache maplist payload.");
        continue;
      }

      const pois = Array.isArray(row.rendered_payload?.pois)
        ? row.rendered_payload.pois
        : Array.isArray(row.rendered_payload?.stops)
          ? row.rendered_payload.stops
          : [];
      if (!pois.length && topLevelStopCount(guide) > 0) {
        addIssue(report, "error", label, "Rendered MapList payload has no pois/stops.");
      }
      for (const poi of pois) {
        report.checkedStops += 1;
        const photo = poi?.photo;
        const poiLabel = `${label} > ${poi?.name || poi?.poiId || "<rendered poi>"}`;
        if (!photo) {
          addIssue(report, severityForStrict(options), poiLabel, "Rendered POI is missing photo.");
        } else if (options.requireR2 && !String(photo).startsWith(`${options.r2BaseUrl}/`)) {
          addIssue(report, "error", poiLabel, "Rendered POI photo is not using the R2 public URL.", { photo });
        }
      }
    }

    if (entryIds.length) {
      const primaryResult = await client.query(
        `select
           entry.slug,
           stop.name as stop_name,
           venue.id as venue_id,
           coalesce(media.public_url, media.url) as primary_photo_url,
           media.storage_provider,
           media.ingestion_status
         from public.entries entry
         join public.entry_stops stop on stop.entry_id = entry.id
         left join public.venues venue on venue.id = stop.venue_id
         left join public.venue_media media on media.id = venue.primary_photo_id
         where entry.id = any($1::uuid[])
         order by entry.slug, stop.stop_order`,
        [entryIds],
      );

      for (const row of primaryResult.rows) {
        const label = `${row.slug} > ${row.stop_name}`;
        if (!row.venue_id) {
          addIssue(report, severityForStrict(options), label, "Published stop is not linked to a venue.");
          continue;
        }
        if (!row.primary_photo_url) {
          addIssue(report, severityForStrict(options), label, "Venue is missing primary_photo_id/media.");
          continue;
        }
        if (options.requireR2 && !String(row.primary_photo_url).startsWith(`${options.r2BaseUrl}/`)) {
          addIssue(report, "error", label, "Venue primary photo is not using R2.", {
            photo: row.primary_photo_url,
            storageProvider: row.storage_provider,
            ingestionStatus: row.ingestion_status,
          });
        }
        if (options.requireR2 && row.storage_provider !== "cloudflare_r2") {
          addIssue(report, "error", label, `Venue primary media storage_provider is ${row.storage_provider || "empty"}, expected cloudflare_r2.`);
        }
      }
    }
  } finally {
    await client.end().catch(() => {});
  }

  return report;
}

function mergeReports(reports) {
  return {
    ok: reports.every((report) => !report.errors.length),
    checkedGuides: reports.reduce((sum, report) => sum + report.checkedGuides, 0),
    checkedStops: reports.reduce((sum, report) => sum + report.checkedStops, 0),
    errors: reports.flatMap((report) => report.errors.map((issue) => ({ ...issue, phase: report.scope }))),
    warnings: reports.flatMap((report) => report.warnings.map((issue) => ({ ...issue, phase: report.scope }))),
    reports,
  };
}

function printHumanSummary(summary, filters, options, liveSkippedReason = null) {
  console.log(`Guide publish verification: ${summary.ok ? "PASS" : "FAIL"}`);
  console.log(`Scope: ${describeEditorialGuideFilters(filters)}`);
  console.log(`Strict: ${options.strict ? "yes" : "no"} | Live: ${options.live ? "yes" : "no"} | Require R2: ${options.requireR2 ? "yes" : "no"}`);
  console.log(`Checked: ${summary.checkedGuides} guide-phase rows, ${summary.checkedStops} stops/rendered POIs`);
  if (liveSkippedReason) {
    console.log(`Live checks skipped: ${liveSkippedReason}`);
  }

  if (summary.errors.length) {
    console.log("\nErrors:");
    for (const issue of summary.errors.slice(0, 80)) {
      console.log(`- [${issue.phase}] ${issue.scope}: ${issue.message}`);
    }
    if (summary.errors.length > 80) console.log(`- ...and ${summary.errors.length - 80} more errors`);
  }

  if (summary.warnings.length) {
    console.log("\nWarnings:");
    for (const issue of summary.warnings.slice(0, 80)) {
      console.log(`- [${issue.phase}] ${issue.scope}: ${issue.message}`);
    }
    if (summary.warnings.length > 80) console.log(`- ...and ${summary.warnings.length - 80} more warnings`);
  }
}

async function main() {
  const { filters, options } = parseArgs(process.argv.slice(2));
  if (!hasEditorialGuideFilters(filters)) {
    throw new Error("Refusing to verify every guide at once. Pass --city, --neighborhood, --id, --slug, or --country.");
  }

  const guides = filterEditorialGuides(loadEditorialGuideLists(), filters);
  if (!guides.length) {
    throw new Error(`No guides matched: ${describeEditorialGuideFilters(filters)}`);
  }

  const reports = [runLocalChecks(guides, options)];
  let liveSkippedReason = null;

  if (options.live) {
    reports.push(await runLiveChecks(guides, options));
  } else {
    liveSkippedReason = "pass --live after publish/R2 ingestion to check Supabase render cache and venue media.";
  }

  const summary = mergeReports(reports);
  const warningLimitExceeded = options.maxWarnings !== null && summary.warnings.length > options.maxWarnings;

  if (options.json) {
    console.log(JSON.stringify({ ...summary, filters, options, liveSkippedReason }, null, 2));
  } else {
    printHumanSummary(summary, filters, options, liveSkippedReason);
  }

  if (!summary.ok || warningLimitExceeded) {
    if (warningLimitExceeded) {
      console.error(`Warning count ${summary.warnings.length} exceeds --max-warnings ${options.maxWarnings}.`);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
