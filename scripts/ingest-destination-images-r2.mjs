import fs from "node:fs";
import dns from "node:dns/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { countries, getCountryCode } from "countries-list";
import pg from "pg";
import { getPgSslConfig } from "./database-ssl.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DESTINATION_IMAGE_FALLBACKS_PATH = path.join(
  ROOT,
  "src/data/destination-image-fallbacks.json",
);
const IMAGE_EXT_BY_TYPE = new Map([
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);
const IMAGE_TYPE_BY_EXT = new Map([
  ["jpg", "image/jpeg"],
  ["jpeg", "image/jpeg"],
  ["png", "image/png"],
  ["webp", "image/webp"],
  ["avif", "image/avif"],
]);
const FALLBACK_HOST_ADDRESSES = new Map([
  ["aws-1-us-east-2.pooler.supabase.com", ["13.58.13.125", "3.148.140.216", "3.131.201.192"]],
]);
const WIKIMEDIA_API_URL = "https://commons.wikimedia.org/w/api.php";
const OPENVERSE_API_URL = "https://api.openverse.engineering/v1/images/";
const OPENVERSE_ALLOWED_LICENSES = "by,by-sa,cc0,pdm";
const USER_AGENT = "rGuide-destination-image-ingest/1.0 (https://rguide.co; media@rguide.co)";
const DEFAULT_PUBLIC_BASE_URL = "https://media.rguide.co";
const MIN_IMAGE_WIDTH = 900;
const MIN_IMAGE_HEIGHT = 500;
const MAX_IMAGE_BYTES = 14 * 1024 * 1024;
const KNOWN_COUNTRY_NAMES = Object.entries(countries)
  .flatMap(([code, country]) => [country.name, country.native, code])
  .map((value) => normalizeSearchText(value))
  .filter((value) => value.length > 3);
const COUNTRY_SCENIC_TERMS = [
  "aerial",
  "architecture",
  "beach",
  "castle",
  "cityscape",
  "coast",
  "coastal",
  "forest",
  "harbor",
  "harbour",
  "historic",
  "island",
  "lake",
  "landmark",
  "landscape",
  "mountain",
  "national park",
  "old town",
  "panorama",
  "river",
  "scenery",
  "skyline",
  "town",
  "valley",
  "view",
  "village",
];

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const key = trimmed.slice(0, trimmed.indexOf("=")).trim();
    let value = trimmed.slice(trimmed.indexOf("=") + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

function printHelp() {
  console.log(`
Usage:
  node scripts/ingest-destination-images-r2.mjs [options]

Options:
  --scope <scope>              Destination scope to process. Defaults to city. Use "all" for all scopes.
  --slug <slug>                Process one destination slug.
  --country <country>          Filter by country name or code.
  --limit <count>              Maximum destinations to process. Defaults to 25.
  --provider <auto|openverse|wikimedia>
                               Search provider order. Defaults to auto.
  --query <text>               Override generated search queries. Can be passed multiple times.
  --source-url <url>           Use a specific image URL instead of searching Openverse/Wikimedia.
  --source-file <path>         Use a local image file instead of searching Openverse/Wikimedia.
  --source-title <text>        Title to store for a manual source URL.
  --source-credit <text>       Credit to store for a manual source URL.
  --source-license <text>      License/rights label to store for a manual source URL.
  --key-suffix <suffix>        Add a suffix to the stored image filename, useful for cache-busting replacements.
  --min-list-count <count>     Only process destinations with at least this many lists/guides.
  --published-entries-only     Only process destinations linked to at least one published entry.
  --include-placeholder-regions
                               Include generated placeholder regional city rows like "Central Spain".
  --allowed-openverse-sources <csv>
                               Defaults to flickr,wikimedia_commons for stricter city/destination matches.
  --dry-run                    Search and log matches without uploading or updating Supabase.
  --force                      Reprocess destinations even if the image_url already points at R2.
  --missing-only               Only process destinations with no image_url.
  --openverse-min-score <n>    Minimum Openverse match score. Defaults to 10.
  --wikimedia-min-score <n>    Minimum Wikimedia match score. Defaults to 10.
  --review-output <path>       Write selected candidates to JSON for pre-ingest review.
  --help                       Show this help.
`);
}

function parseArgs(argv) {
  const options = {
    scope: "city",
    slug: null,
    country: null,
    limit: 25,
    provider: "auto",
    queries: [],
    sourceUrl: null,
    sourceFile: null,
    sourceTitle: null,
    sourceCredit: null,
    sourceLicense: null,
    keySuffix: null,
    minListCount: null,
    publishedEntriesOnly: false,
    includePlaceholderRegions: false,
    allowedOpenverseSources: new Set(["flickr", "wikimedia_commons"]),
    dryRun: false,
    force: false,
    missingOnly: false,
    openverseMinScore: 10,
    wikimediaMinScore: 10,
    reviewOutput: null,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const readValue = () => {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`Missing value for ${arg}`);
      index += 1;
      return value;
    };

    if (arg === "--scope") options.scope = readValue();
    else if (arg === "--slug") options.slug = readValue();
    else if (arg === "--country") options.country = readValue();
    else if (arg === "--limit") options.limit = Number(readValue());
    else if (arg === "--provider") options.provider = readValue();
    else if (arg === "--query") options.queries.push(readValue());
    else if (arg === "--source-url") options.sourceUrl = readValue();
    else if (arg === "--source-file") options.sourceFile = readValue();
    else if (arg === "--source-title") options.sourceTitle = readValue();
    else if (arg === "--source-credit") options.sourceCredit = readValue();
    else if (arg === "--source-license") options.sourceLicense = readValue();
    else if (arg === "--key-suffix") options.keySuffix = readValue();
    else if (arg === "--min-list-count") options.minListCount = Number(readValue());
    else if (arg === "--published-entries-only") options.publishedEntriesOnly = true;
    else if (arg === "--include-placeholder-regions") options.includePlaceholderRegions = true;
    else if (arg === "--allowed-openverse-sources") {
      options.allowedOpenverseSources = new Set(
        readValue()
          .split(",")
          .map((source) => source.trim())
          .filter(Boolean),
      );
    }
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--force") options.force = true;
    else if (arg === "--missing-only") options.missingOnly = true;
    else if (arg === "--openverse-min-score") options.openverseMinScore = Number(readValue());
    else if (arg === "--wikimedia-min-score") options.wikimediaMinScore = Number(readValue());
    else if (arg === "--review-output") options.reviewOutput = readValue();
    else if (arg === "--help" || arg === "-h") options.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  const validProviders = new Set(["auto", "openverse", "wikimedia"]);
  if (!validProviders.has(options.provider)) {
    throw new Error("--provider must be auto, openverse, or wikimedia.");
  }
  if (!Number.isInteger(options.limit) || options.limit < 1) {
    throw new Error("--limit must be a positive integer.");
  }
  if (!Number.isFinite(options.openverseMinScore) || options.openverseMinScore < 0) {
    throw new Error("--openverse-min-score must be a non-negative number.");
  }
  if (!Number.isFinite(options.wikimediaMinScore) || options.wikimediaMinScore < 0) {
    throw new Error("--wikimedia-min-score must be a non-negative number.");
  }
  if (
    options.minListCount !== null
    && (!Number.isInteger(options.minListCount) || options.minListCount < 0)
  ) {
    throw new Error("--min-list-count must be a non-negative integer.");
  }

  return options;
}

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Set ${name}.`);
  return value;
}

function getDatabaseUrl() {
  return process.env.SUPABASE_DB_URL ?? process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL ?? null;
}

function createPgClient(databaseUrl) {
  return new pg.Client({
    connectionString: databaseUrl,
    ssl: getPgSslConfig(databaseUrl),
    connectionTimeoutMillis: 15000,
    query_timeout: 30000,
    statement_timeout: 30000,
  });
}

async function connectPgClient(databaseUrl) {
  const client = createPgClient(databaseUrl);
  try {
    await client.connect();
    return client;
  } catch (error) {
    try {
      await client.end();
    } catch {
      // Ignore cleanup errors after failed connection attempts.
    }

    const parsed = new URL(databaseUrl);
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
      throw error;
    }

    let addresses;
    try {
      addresses = await dns.lookup(parsed.hostname, { all: true });
    } catch (lookupError) {
      addresses = (FALLBACK_HOST_ADDRESSES.get(parsed.hostname) ?? []).map((address) => ({ address }));
      if (!addresses.length) throw lookupError;
    }

    for (const address of addresses) {
      const fallbackUrl = new URL(databaseUrl);
      fallbackUrl.hostname = address.address;
      const fallbackClient = createPgClient(fallbackUrl.toString());
      try {
        await fallbackClient.connect();
        console.log(JSON.stringify({
          phase: "database_connected_with_resolved_host",
          originalHost: parsed.hostname,
          address: address.address,
        }));
        return fallbackClient;
      } catch (fallbackError) {
        console.error(JSON.stringify({
          phase: "database_resolved_host_failed",
          originalHost: parsed.hostname,
          address: address.address,
          error: fallbackError.message,
        }));
        try {
          await fallbackClient.end();
        } catch {
          // Ignore cleanup errors after failed connection attempts.
        }
      }
    }

    throw error;
  }
}

function slugify(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function normalizeSearchText(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isR2Url(url, publicBaseUrl) {
  return Boolean(url?.startsWith(`${publicBaseUrl.replace(/\/$/, "")}/`));
}

function extensionFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.([a-z0-9]+)$/i);
    const extension = match?.[1]?.toLowerCase();
    if (["jpg", "jpeg", "png", "webp", "avif"].includes(extension)) {
      return extension === "jpeg" ? "jpg" : extension;
    }
  } catch {
    return null;
  }
  return null;
}

function contentTypeFromFilePath(filePath) {
  const extension = path.extname(filePath).replace(/^\./, "").toLowerCase();
  return IMAGE_TYPE_BY_EXT.get(extension) ?? null;
}

function cleanMetadataValue(value) {
  if (typeof value !== "string") return null;
  const cleaned = value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || null;
}

function pickWikimediaMetadata(extmetadata, key) {
  return cleanMetadataValue(extmetadata?.[key]?.value);
}

function destinationSearchName(row) {
  return row.display_name || row.name || row.slug;
}

function destinationTokens(row) {
  const stopwords = new Set([
    "and",
    "city",
    "commune",
    "county",
    "de",
    "district",
    "el",
    "greater",
    "municipality",
    "of",
    "province",
    "region",
    "state",
    "the",
  ]);
  return normalizeSearchText(destinationSearchName(row))
    .split(" ")
    .filter((token) => token.length > 2 && !stopwords.has(token));
}

function destinationSearchQueries(row, options = {}) {
  if (options.queries?.length) {
    return options.queries.filter((query, index, all) => query && all.indexOf(query) === index);
  }

  const name = destinationSearchName(row);
  const country = row.country_name || row.country_code;
  const stateOrRegion = row.state_name || row.region_name;
  if (row.scope === "country") {
    const countryName = row.country_name || name;
    const countryQueries = [
      [countryName, "landscape photograph"].filter(Boolean).join(" "),
      [countryName, "scenery photograph"].filter(Boolean).join(" "),
      [countryName, "landscape photograph", `incategory:"Landscapes of ${countryName}"`].filter(Boolean).join(" "),
      [countryName, "view photograph", `incategory:"Landscapes of ${countryName}"`].filter(Boolean).join(" "),
      [countryName, "cityscape photograph"].filter(Boolean).join(" "),
      [countryName, "landmark photograph"].filter(Boolean).join(" "),
      [countryName, "travel photograph"].filter(Boolean).join(" "),
      [countryName, "panorama photograph"].filter(Boolean).join(" "),
    ];
    return countryQueries.filter((query, index, all) => query && all.indexOf(query) === index);
  }

  const scopeQualifier = row.scope === "city" ? "city" : row.scope;
  const baseQueries = [
    [name, stateOrRegion, country, scopeQualifier].filter(Boolean).join(" "),
    [name, country, "skyline"].filter(Boolean).join(" "),
    [name, country, "travel"].filter(Boolean).join(" "),
    [name, country].filter(Boolean).join(" "),
  ];
  return baseQueries.filter((query, index, all) => query && all.indexOf(query) === index);
}

function blockedImageWords() {
  return [
    "aerial map",
    "air force",
    "aircraft",
    "army",
    "archive",
    "archivio",
    "aster",
    "base map",
    "basemap",
    "blank map",
    "bus",
    "cabinet",
    "chart",
    "climate",
    "coach",
    "coat of arms",
    "conference",
    "copernicus",
    "delegation",
    "demographic",
    "destroyed",
    "diagram",
    "drawing",
    "dust over",
    "emblem",
    "esa",
    "flag",
    "flight into",
    "flower",
    "graph",
    "helicopter",
    "indoor",
    "interior",
    "locator map",
    "location map",
    "loc",
    "logo",
    "map of",
    "meeting",
    "metro map",
    "minister",
    "modis",
    "motor",
    "museum",
    "museo",
    "nasa",
    "oil on canvas",
    "painting",
    "plant",
    "police",
    "political map",
    "president",
    "perurail",
    "railway",
    "satellite",
    "seal of",
    "secretary",
    "shop",
    "shopping",
    "show your stripes",
    "space station",
    "species",
    "stripes",
    "supermarket",
    "tessuto",
    "textile",
    "temperature",
    "transit map",
    "vehicle",
    "weapon",
  ];
}

function hasBlockedImageTerm(value) {
  const text = ` ${normalizeSearchText(value)} `;
  return blockedImageWords().some((term) => text.includes(` ${normalizeSearchText(term)} `));
}

function containsNormalizedPhrase(value, phrase) {
  const normalizedPhrase = normalizeSearchText(phrase);
  if (!normalizedPhrase) return false;
  return ` ${normalizeSearchText(value)} `.includes(` ${normalizedPhrase} `);
}

function hasOtherCountryTerm(row, value) {
  if (row.scope !== "country") return false;
  const text = ` ${normalizeSearchText(value)} `;
  const allowed = new Set([
    normalizeSearchText(row.name),
    normalizeSearchText(row.display_name),
    normalizeSearchText(row.country_name),
    normalizeSearchText(row.country_code),
    normalizeSearchText(row.slug),
  ].filter((term) => term.length > 3));

  return KNOWN_COUNTRY_NAMES.some((term) => {
    if (allowed.has(term)) return false;
    return text.includes(` ${term} `);
  });
}

function hasCountryScenicTerm(value) {
  return COUNTRY_SCENIC_TERMS.some((term) => containsNormalizedPhrase(value, term));
}

function imageLooksLikeDestination(row, image) {
  const titleText = normalizeSearchText(image.title);
  const descriptionText = normalizeSearchText(image.description);
  const landingText = normalizeSearchText(image.foreign_landing_url ?? image.canonical_url ?? image.url);
  const tagText = (image.tags ?? [])
    .map((tag) => normalizeSearchText(tag.name ?? tag))
    .filter(Boolean)
    .join(" ");
  const identityText = [titleText, descriptionText, landingText].join(" ");
  const combinedText = [identityText, tagText].join(" ");
  const destinationText = normalizeSearchText(destinationSearchName(row));
  const countryText = normalizeSearchText(row.country_name || row.country_code);
  const tokens = destinationTokens(row);
  const tokenMatches = tokens.filter((token) => identityText.includes(token));

  if (hasBlockedImageTerm(combinedText)) return false;
  if (hasOtherCountryTerm(row, identityText)) return false;
  if (row.scope === "country" && destinationText.includes(" ") && !containsNormalizedPhrase(identityText, destinationText)) {
    return false;
  }
  if (
    row.scope === "country"
    && !destinationText.includes(" ")
    && !containsNormalizedPhrase([titleText, landingText].join(" "), destinationText)
  ) {
    return false;
  }
  if (row.scope === "country" && !destinationText.includes(" ") && !hasCountryScenicTerm([titleText, landingText].join(" "))) {
    return false;
  }
  if (destinationText && containsNormalizedPhrase(identityText, destinationText)) return true;
  if (tokens.length >= 2 && tokenMatches.length >= 2) return true;
  if (tokens.length === 1 && tokenMatches.length === 1 && countryText && containsNormalizedPhrase(identityText, countryText)) return true;
  return false;
}

function scoreDestinationImage(row, image) {
  const titleText = normalizeSearchText(image.title);
  const descriptionText = normalizeSearchText(image.description);
  const landingText = normalizeSearchText(image.foreign_landing_url ?? image.canonical_url ?? image.url);
  const creatorText = normalizeSearchText(image.creator);
  const tagText = (image.tags ?? [])
    .map((tag) => normalizeSearchText(tag.name ?? tag))
    .filter(Boolean)
    .join(" ");
  const combinedText = [titleText, descriptionText, landingText, creatorText, tagText].join(" ");
  const destinationText = normalizeSearchText(destinationSearchName(row));
  const countryText = normalizeSearchText(row.country_name || row.country_code);
  const stateOrRegionText = normalizeSearchText(row.state_name || row.region_name);
  const tokens = destinationTokens(row);
  const tokenMatches = tokens.filter((token) => combinedText.includes(token));

  let score = 0;
  if (destinationText && containsNormalizedPhrase(titleText, destinationText)) score += 14;
  if (destinationText && containsNormalizedPhrase(combinedText, destinationText)) score += 8;
  if (countryText && containsNormalizedPhrase(combinedText, countryText)) score += 4;
  if (stateOrRegionText && containsNormalizedPhrase(combinedText, stateOrRegionText)) score += 2;
  score += tokenMatches.length * 3;
  if (tokens.length && tokenMatches.length === tokens.length) score += 4;
  if (image.source === "wikimedia_commons" || image.provider === "wikimedia_commons") score += 2;

  if (row.scope === "country") {
    for (const term of COUNTRY_SCENIC_TERMS) {
      if (containsNormalizedPhrase(combinedText, term)) score += 3;
    }

    const officialOrIncidentalTerms = [
      "air force",
      "aircraft",
      "army",
      "archive",
      "archivio",
      "aster",
      "base map",
      "basemap",
      "cabinet",
      "car",
      "conference",
      "copernicus",
      "delegation",
      "demographic",
      "destroyed",
      "drawing",
      "dust",
      "esa",
      "flight into",
      "flower",
      "helicopter",
      "industrial",
      "iss",
      "loc",
      "meeting",
      "minister",
      "modis",
      "museum",
      "museo",
      "nasa",
      "painting",
      "plant",
      "police",
      "president",
      "perurail",
      "railway",
      "satellite",
      "secretary",
      "shop",
      "species",
      "supermarket",
      "tessuto",
      "textile",
      "vehicle",
      "visit",
    ];
    for (const term of officialOrIncidentalTerms) {
      if (combinedText.includes(normalizeSearchText(term))) score -= 8;
    }
  }

  const width = Number(image.width ?? 0);
  const height = Number(image.height ?? 0);
  if (width && height) {
    const megapixels = (width * height) / 1_000_000;
    const aspectRatio = width / height;
    score += Math.min(4, Math.max(0, megapixels / 2));
    if (aspectRatio >= 1.15 && aspectRatio <= 2.35) score += 2;
    if (width < MIN_IMAGE_WIDTH || height < MIN_IMAGE_HEIGHT) score -= 5;
  }

  if (hasBlockedImageTerm(combinedText)) score -= 18;
  if (hasOtherCountryTerm(row, [titleText, descriptionText, landingText].join(" "))) score -= 24;
  return score;
}

function isCredibleDestinationImage(row, image, score, minScore, options = {}) {
  const effectiveMinScore = row.scope === "country" ? Math.max(minScore, 30) : minScore;
  if (score < effectiveMinScore) return false;
  if (!imageLooksLikeDestination(row, image)) return false;

  if (
    image.provider === "openverse"
    && image.source
    && options.allowedOpenverseSources?.size
    && !options.allowedOpenverseSources.has(image.source)
  ) {
    return false;
  }

  const width = Number(image.width ?? 0);
  const height = Number(image.height ?? 0);
  if (width && height && (width < MIN_IMAGE_WIDTH || height < MIN_IMAGE_HEIGHT)) return false;

  const contentType = image.mime || image.content_type;
  if (contentType && !IMAGE_EXT_BY_TYPE.has(String(contentType).split(";")[0].toLowerCase())) return false;
  return true;
}

async function searchOpenverseDestination(row, minScore, options) {
  for (const query of destinationSearchQueries(row, options)) {
    const apiUrl = new URL(OPENVERSE_API_URL);
    apiUrl.searchParams.set("q", query);
    apiUrl.searchParams.set("page_size", "20");
    apiUrl.searchParams.set("mature", "false");
    apiUrl.searchParams.set("license_type", "commercial");
    apiUrl.searchParams.set("license", OPENVERSE_ALLOWED_LICENSES);
    apiUrl.searchParams.set("category", "photograph");

    const response = await fetch(apiUrl, {
      headers: {
        "accept": "application/json",
        "user-agent": USER_AGENT,
      },
    });
    if (!response.ok) {
      throw new Error(`openverse api returned ${response.status}`);
    }

    const body = await response.json();
    const scored = (body?.results ?? [])
      .filter((result) => result?.url && /^https?:\/\//i.test(result.url))
      .map((result) => ({
        image: { ...result, provider: "openverse" },
        score: scoreDestinationImage(row, result),
      }))
      .filter(({ image, score }) => isCredibleDestinationImage(row, image, score, minScore, options))
      .sort((a, b) => b.score - a.score);

    const best = scored[0];
    if (!best) continue;

    return {
      provider: "openverse",
      resolvedSourceUrl: best.image.foreign_landing_url ?? best.image.url,
      downloadUrl: best.image.url,
      metadata: {
        provider: "openverse",
        source: best.image.source ?? null,
        title: best.image.title ?? null,
        creator: best.image.creator ?? null,
        credit: best.image.creator ?? null,
        license: best.image.license ?? null,
        license_url: best.image.license_url ?? null,
        foreign_landing_url: best.image.foreign_landing_url ?? null,
        download_url: best.image.url,
        width: best.image.width ?? null,
        height: best.image.height ?? null,
        matched_query: query,
        match_score: best.score,
      },
    };
  }

  return null;
}

function wikimediaDescriptionUrl(title) {
  return `https://commons.wikimedia.org/wiki/${encodeURIComponent(String(title).replace(/ /g, "_"))}`;
}

function wikimediaSearchExpression(row, query) {
  const expression = `${query} filetype:bitmap`;
  if (row.scope !== "country") return expression;
  return [
    expression,
    "-aircraft",
    "-aster",
    "-conference",
    "-copernicus",
    "-demographic",
    "-destroyed",
    "-flag",
    "-interior",
    "-map",
    "-minister",
    "-modis",
    "-museum",
    "-nasa",
    "-painting",
    "-president",
    "-railway",
    "-satellite",
    "-secretary",
    "-shop",
    "-supermarket",
    "-vehicle",
  ].join(" ");
}

async function searchWikimediaDestination(row, minScore, options) {
  for (const query of destinationSearchQueries(row, options)) {
    const apiUrl = new URL(WIKIMEDIA_API_URL);
    apiUrl.searchParams.set("action", "query");
    apiUrl.searchParams.set("format", "json");
    apiUrl.searchParams.set("formatversion", "2");
    apiUrl.searchParams.set("generator", "search");
    apiUrl.searchParams.set("gsrsearch", wikimediaSearchExpression(row, query));
    apiUrl.searchParams.set("gsrnamespace", "6");
    apiUrl.searchParams.set("gsrlimit", "20");
    apiUrl.searchParams.set("prop", "imageinfo");
    apiUrl.searchParams.set("iiprop", "url|mime|size|extmetadata");
    apiUrl.searchParams.set("iiurlwidth", "1920");

    const response = await fetch(apiUrl, {
      headers: {
        "accept": "application/json",
        "user-agent": USER_AGENT,
      },
    });
    if (!response.ok) {
      throw new Error(`wikimedia api returned ${response.status}`);
    }

    const body = await response.json();
    const pages = body?.query?.pages ?? [];
    const scored = pages
      .map((page) => {
        const imageInfo = page?.imageinfo?.[0];
        const extmetadata = imageInfo?.extmetadata ?? {};
        const image = {
          provider: "wikimedia_commons",
          source: "wikimedia_commons",
          title: page?.title,
          description:
            pickWikimediaMetadata(extmetadata, "ImageDescription")
            ?? pickWikimediaMetadata(extmetadata, "ObjectName"),
          creator: pickWikimediaMetadata(extmetadata, "Artist"),
          canonical_url: imageInfo?.descriptionurl ?? wikimediaDescriptionUrl(page?.title),
          url: imageInfo?.thumburl ?? imageInfo?.url,
          mime: imageInfo?.mime,
          width: imageInfo?.thumbwidth ?? imageInfo?.width,
          height: imageInfo?.thumbheight ?? imageInfo?.height,
          credit: pickWikimediaMetadata(extmetadata, "Artist") ?? pickWikimediaMetadata(extmetadata, "Credit"),
          license: pickWikimediaMetadata(extmetadata, "LicenseShortName") ?? pickWikimediaMetadata(extmetadata, "License"),
          license_url: pickWikimediaMetadata(extmetadata, "LicenseUrl"),
        };
        return {
          page,
          image,
          score: scoreDestinationImage(row, image),
        };
      })
      .filter(({ image }) => image.url && /^https?:\/\//i.test(image.url))
      .filter(({ image, score }) => isCredibleDestinationImage(row, image, score, minScore))
      .sort((a, b) => b.score - a.score);

    const best = scored[0];
    if (!best) continue;

    return {
      provider: "wikimedia_commons",
      resolvedSourceUrl: best.image.canonical_url,
      downloadUrl: best.image.url,
      metadata: {
        provider: "wikimedia_commons",
        file_title: best.page?.title ?? null,
        canonical_url: best.image.canonical_url,
        download_url: best.image.url,
        mime: best.image.mime ?? null,
        width: best.image.width ?? null,
        height: best.image.height ?? null,
        credit: best.image.credit ?? null,
        license: best.image.license ?? null,
        license_url: best.image.license_url ?? null,
        matched_query: query,
        match_score: best.score,
      },
    };
  }

  return null;
}

async function selectDestinationImage(row, options) {
  if (options.sourceFile) {
    const absolutePath = path.resolve(options.sourceFile);
    return {
      provider: "manual",
      resolvedSourceUrl: null,
      downloadUrl: `file://${absolutePath}`,
      metadata: {
        provider: "manual",
        source: "owner_provided",
        title: options.sourceTitle ?? `${destinationSearchName(row)} owner-provided image`,
        creator: options.sourceCredit ?? null,
        credit: options.sourceCredit ?? null,
        license: options.sourceLicense ?? "owner-provided",
        license_url: null,
        foreign_landing_url: null,
        source_file_name: path.basename(absolutePath),
        download_url: null,
        width: null,
        height: null,
        matched_query: null,
        match_score: null,
      },
    };
  }

  if (options.sourceUrl) {
    return {
      provider: "manual",
      resolvedSourceUrl: options.sourceUrl,
      downloadUrl: options.sourceUrl,
      metadata: {
        provider: "manual",
        source: "owner_provided",
        title: options.sourceTitle ?? `${destinationSearchName(row)} owner-provided image`,
        creator: options.sourceCredit ?? null,
        credit: options.sourceCredit ?? null,
        license: options.sourceLicense ?? "owner-provided",
        license_url: null,
        foreign_landing_url: options.sourceUrl,
        download_url: options.sourceUrl,
        width: null,
        height: null,
        matched_query: null,
        match_score: null,
      },
    };
  }

  if (options.provider === "openverse") {
    return searchOpenverseDestination(row, options.openverseMinScore, options);
  }
  if (options.provider === "wikimedia") {
    return searchWikimediaDestination(row, options.wikimediaMinScore, options);
  }

  if (row.scope === "country") {
    const wikimedia = await searchWikimediaDestination(row, options.wikimediaMinScore, options);
    if (wikimedia) return wikimedia;
    return searchOpenverseDestination(row, options.openverseMinScore, options);
  }

  const openverse = await searchOpenverseDestination(row, options.openverseMinScore, options);
  if (openverse) return openverse;
  return searchWikimediaDestination(row, options.wikimediaMinScore, options);
}

async function fetchImage(url) {
  if (url.startsWith("file://")) {
    const filePath = fileURLToPath(url);
    const contentType = contentTypeFromFilePath(filePath);
    if (!contentType) {
      throw new Error(`local source file has unsupported image extension: ${filePath}`);
    }
    const bytes = fs.readFileSync(filePath);
    if (!bytes.length) throw new Error("local source file is empty");
    if (bytes.byteLength > MAX_IMAGE_BYTES) {
      throw new Error(`local source image is too large: ${bytes.byteLength} bytes`);
    }
    return { bytes: new Uint8Array(bytes), contentType };
  }

  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "accept": "image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8,*/*;q=0.1",
      "user-agent": USER_AGENT,
    },
  });

  const contentLength = Number(response.headers.get("content-length") ?? 0);
  const contentType = response.headers.get("content-type")?.split(";")[0]?.toLowerCase() ?? "";
  if (!response.ok) {
    throw new Error(`source returned ${response.status}`);
  }
  if (contentLength > MAX_IMAGE_BYTES) {
    throw new Error(`source image is too large: ${contentLength} bytes`);
  }
  if (!IMAGE_EXT_BY_TYPE.has(contentType)) {
    throw new Error(`source returned non-image content-type ${contentType || "unknown"}`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  if (!bytes.length) throw new Error("source returned empty body");
  if (bytes.byteLength > MAX_IMAGE_BYTES) {
    throw new Error(`source image is too large: ${bytes.byteLength} bytes`);
  }
  return { bytes, contentType };
}

function normalizeCountryFolder(row) {
  if (row.country_code) return row.country_code.toLowerCase();
  if (row.country_name) {
    const code = getCountryCode(row.country_name);
    if (code) return code.toLowerCase();
    return slugify(row.country_name) || "unknown";
  }
  return "unknown";
}

function buildStorageKey(row, contentType, source, options = {}) {
  const scope = slugify(row.scope || "destination") || "destination";
  const country = normalizeCountryFolder(row);
  const destination = slugify(row.slug || row.name || row.id) || String(row.id).slice(0, 8);
  const extension = IMAGE_EXT_BY_TYPE.get(contentType) ?? extensionFromUrl(source.downloadUrl) ?? "jpg";
  const suffix = slugify(options.keySuffix);
  const filename = suffix ? `primary-${suffix}` : "primary";
  return `destinations/${scope}/${country}/${destination}/${filename}.${extension}`;
}

async function loadCandidates(client, options, publicBaseUrl) {
  const conditions = ["destination.is_published = true"];
  const values = [];

  if (options.scope !== "all") {
    values.push(options.scope);
    conditions.push(`destination.scope = $${values.length}::public.destination_scope`);
  }

  if (!options.force) {
    if (options.missingOnly) {
      conditions.push("(destination.image_url is null or btrim(destination.image_url) = '')");
    } else {
      values.push(`${publicBaseUrl.replace(/\/$/, "")}/%`);
      conditions.push("(destination.image_url is null or btrim(destination.image_url) = '' or destination.image_url not like $" + values.length + ")");
    }
  }

  if (options.slug) {
    values.push(options.slug);
    conditions.push(`destination.slug = $${values.length}`);
  }

  if (options.country) {
    values.push(options.country);
    conditions.push(`(destination.country_name ilike $${values.length} or destination.country_code ilike $${values.length})`);
  }

  if (options.minListCount !== null) {
    values.push(options.minListCount);
    conditions.push(`destination.list_count >= $${values.length}`);
  }

  if (options.publishedEntriesOnly) {
    conditions.push(`exists (
      select 1
      from public.entries entry
      where entry.status = 'published'::public.rguide_entry_status
        and (entry.city_id = destination.id or entry.destination_id = destination.id)
    )`);
  }

  if (options.scope === "city" && !options.includePlaceholderRegions) {
    conditions.push("coalesce(destination.metadata ->> 'isPlaceholderRegion', 'false') <> 'true'");
    conditions.push("not (destination.list_count = 0 and destination.name ilike 'Central %')");
  }

  values.push(options.limit);
  const limitPlaceholder = `$${values.length}`;

  const { rows } = await client.query(
    [
      "select",
      "  destination.id,",
      "  destination.legacy_id,",
      "  destination.slug,",
      "  destination.scope::text as scope,",
      "  destination.name,",
      "  destination.display_name,",
      "  destination.country_name,",
      "  destination.country_code,",
      "  destination.continent_name,",
      "  destination.region_name,",
      "  destination.state_name,",
      "  destination.city_name,",
      "  destination.neighborhood_name,",
      "  destination.image_url,",
      "  destination.metadata,",
      "  (",
      "    select count(*)::int",
      "    from public.entries entry",
      "    where entry.status = 'published'::public.rguide_entry_status",
      "      and (entry.city_id = destination.id or entry.destination_id = destination.id)",
      "  ) as published_entry_count",
      "from public.destinations destination",
      `where ${conditions.join(" and ")}`,
      "order by",
      "  published_entry_count desc,",
      "  case destination.scope when 'city' then 0 when 'country' then 1 else 2 end,",
      "  destination.list_count desc nulls last,",
      "  destination.name",
      `limit ${limitPlaceholder}`,
    ].join(" "),
    values,
  );

  return rows.filter((row) => options.force || !isR2Url(row.image_url, publicBaseUrl));
}

async function markFailed(client, row, error) {
  await client.query(
    `update public.destinations
     set metadata = metadata || jsonb_build_object(
           'destination_image_ingestion',
           jsonb_build_object(
             'status', 'failed',
             'error', $2::text,
             'attempted_at', now()
           )
         ),
         updated_at = now()
     where id = $1`,
    [row.id, error.message.slice(0, 500)],
  );
}

async function updateDestinationImage(client, row, storage, bucket, publicBaseUrl) {
  const publicUrl = `${publicBaseUrl.replace(/\/$/, "")}/${storage.key}`;
  const metadata = {
    storage_provider: "cloudflare_r2",
    storage_bucket: bucket,
    storage_key: storage.key,
    public_url: publicUrl,
    content_type: storage.contentType,
    byte_size: storage.bytes.length,
    source_url: storage.source.resolvedSourceUrl,
    ingested_at: new Date().toISOString(),
    source: storage.source.metadata,
  };

  await client.query(
    `update public.destinations
     set image_url = $2,
         metadata = metadata || jsonb_build_object(
           'destination_image', $3::jsonb,
           'destination_image_ingestion', jsonb_build_object('status', 'stored', 'stored_at', now())
         ),
         updated_at = now()
     where id = $1`,
    [row.id, publicUrl, JSON.stringify(metadata)],
  );

  return publicUrl;
}

function updateCityImageFallback(row, publicUrl) {
  if (row.scope !== "city") return;

  const fallbackKey = slugify(row.name || row.city_name || row.slug);
  if (!fallbackKey) return;

  const fallbacks = fs.existsSync(DESTINATION_IMAGE_FALLBACKS_PATH)
    ? JSON.parse(fs.readFileSync(DESTINATION_IMAGE_FALLBACKS_PATH, "utf8"))
    : {};
  const versionedPublicUrl = `${publicUrl}?v=${encodeURIComponent(new Date().toISOString())}`;
  const sortedFallbacks = Object.fromEntries(
    Object.entries({ ...fallbacks, [fallbackKey]: versionedPublicUrl }).sort(([left], [right]) =>
      left.localeCompare(right),
    ),
  );

  fs.writeFileSync(
    DESTINATION_IMAGE_FALLBACKS_PATH,
    `${JSON.stringify(sortedFallbacks, null, 2)}\n`,
  );
}

function reviewRecord(row, source, image, publicUrl, key) {
  const metadata = source.metadata ?? {};
  return {
    destinationId: row.id,
    slug: row.slug,
    scope: row.scope,
    name: destinationSearchName(row),
    country: row.country_name ?? row.country_code ?? null,
    currentImageUrl: row.image_url ?? null,
    provider: source.provider,
    publicUrl,
    storageKey: key,
    sourceUrl: source.resolvedSourceUrl,
    downloadUrl: source.downloadUrl,
    title: metadata.file_title ?? metadata.title ?? null,
    credit: metadata.credit ?? metadata.creator ?? null,
    license: metadata.license ?? null,
    width: metadata.width ?? null,
    height: metadata.height ?? null,
    contentType: image.contentType,
    byteSize: image.bytes.length,
    score: metadata.match_score ?? null,
    query: metadata.matched_query ?? null,
  };
}

function reviewFailureRecord(row, error) {
  return {
    destinationId: row.id,
    slug: row.slug,
    scope: row.scope,
    name: destinationSearchName(row),
    country: row.country_name ?? row.country_code ?? null,
    currentImageUrl: row.image_url ?? null,
    error: error.message,
  };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function writeReviewOutput(filePath, records) {
  if (!filePath) return;
  const outputPath = path.resolve(filePath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  if (outputPath.endsWith(".html")) {
    const rows = records.map((record) => `
      <tr>
        <td>${escapeHtml(record.name)}<br><small>${escapeHtml(record.slug)}</small></td>
        <td>${record.downloadUrl ? `<img src="${escapeHtml(record.downloadUrl)}" alt="${escapeHtml(record.name)}">` : ""}</td>
        <td>${record.currentImageUrl ? `<img src="${escapeHtml(record.currentImageUrl)}" alt="Current ${escapeHtml(record.name)}">` : ""}</td>
        <td>${escapeHtml(record.provider ?? "failed")}<br><small>score: ${escapeHtml(record.score ?? "")}</small><br><small>${escapeHtml(record.query ?? "")}</small></td>
        <td>${record.sourceUrl ? `<a href="${escapeHtml(record.sourceUrl)}">${escapeHtml(record.title ?? record.sourceUrl)}</a>` : escapeHtml(record.error ?? "")}</td>
      </tr>
    `).join("\n");

    fs.writeFileSync(outputPath, `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Destination Image Review</title>
  <style>
    body { font: 14px/1.4 system-ui, sans-serif; margin: 24px; color: #172033; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #d7dce5; padding: 8px; text-align: left; vertical-align: top; }
    th { background: #f3f5f8; position: sticky; top: 0; }
    img { display: block; width: 220px; height: 130px; object-fit: cover; background: #eef1f5; }
    small { color: #677387; }
  </style>
</head>
<body>
  <h1>Destination Image Review</h1>
  <p>${records.length} candidates generated ${escapeHtml(new Date().toISOString())}</p>
  <table>
    <thead><tr><th>Destination</th><th>Candidate</th><th>Current</th><th>Match</th><th>Source</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`);
    return;
  }

  fs.writeFileSync(outputPath, `${JSON.stringify(records, null, 2)}\n`);
}

async function main() {
  loadEnvFile(path.join(ROOT, ".env.local"));
  loadEnvFile(path.join(ROOT, ".env"));

  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) throw new Error("Set SUPABASE_DB_URL, SUPABASE_DATABASE_URL, or DATABASE_URL.");

  const publicBaseUrl = (process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL ?? DEFAULT_PUBLIC_BASE_URL).trim();
  const bucket = options.dryRun ? (process.env.CLOUDFLARE_R2_BUCKET?.trim() ?? "dry-run") : requiredEnv("CLOUDFLARE_R2_BUCKET");
  const r2 = options.dryRun
    ? null
    : new S3Client({
        region: "auto",
        endpoint: requiredEnv("CLOUDFLARE_R2_ENDPOINT"),
        credentials: {
          accessKeyId: requiredEnv("CLOUDFLARE_R2_ACCESS_KEY_ID"),
          secretAccessKey: requiredEnv("CLOUDFLARE_R2_SECRET_ACCESS_KEY"),
        },
      });

  const client = await connectPgClient(databaseUrl);
  const stats = { selected: 0, uploaded: 0, failed: 0, skipped: 0 };
  const reviewRecords = [];

  try {
    const candidates = await loadCandidates(client, options, publicBaseUrl);
    stats.selected = candidates.length;
    console.log(JSON.stringify({
      phase: "selected",
      count: candidates.length,
      dryRun: options.dryRun,
      scope: options.scope,
      provider: options.provider,
    }));

    for (const row of candidates) {
      try {
        const source = await selectDestinationImage(row, options);
        if (!source) {
          throw new Error("no credible Openverse or Wikimedia image match");
        }

        const image = await fetchImage(source.downloadUrl);
        const key = buildStorageKey(row, image.contentType, source, options);
        const storage = { ...image, key, source };
        const publicUrl = `${publicBaseUrl.replace(/\/$/, "")}/${key}`;
        reviewRecords.push(reviewRecord(row, source, image, publicUrl, key));

        console.log(JSON.stringify({
          phase: options.dryRun ? "would_upload" : "upload",
          destinationId: row.id,
          slug: row.slug,
          scope: row.scope,
          name: destinationSearchName(row),
          provider: source.provider,
          publicUrl,
          source: source.resolvedSourceUrl,
          score: source.metadata?.match_score,
          query: source.metadata?.matched_query,
        }));

        if (!options.dryRun) {
          await r2.send(new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: storage.bytes,
            ContentType: storage.contentType,
            CacheControl: "public, max-age=31536000, immutable",
          }));
          const storedPublicUrl = await updateDestinationImage(
            client,
            row,
            storage,
            bucket,
            publicBaseUrl,
          );
          updateCityImageFallback(row, storedPublicUrl);
        }

        stats.uploaded += 1;
      } catch (error) {
        stats.failed += 1;
        reviewRecords.push(reviewFailureRecord(row, error));
        console.error(JSON.stringify({
          phase: "failed",
          destinationId: row.id,
          slug: row.slug,
          scope: row.scope,
          name: destinationSearchName(row),
          error: error.message,
        }));
        if (!options.dryRun) {
          await markFailed(client, row, error);
        }
      }
    }
  } finally {
    await client.end();
  }

  writeReviewOutput(options.reviewOutput, reviewRecords);

  console.log(JSON.stringify({ phase: "complete", ...stats }));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
