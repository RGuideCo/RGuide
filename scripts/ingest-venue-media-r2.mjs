import { execFile } from "node:child_process";
import dns from "node:dns/promises";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { promisify } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getCountryCode } from "countries-list";
import pg from "pg";
import { getPgSslConfig } from "./database-ssl.mjs";
import {
  createR2ImageRenditions,
  serializeR2ImageRenditions,
} from "./lib/r2-image-renditions.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMAGE_EXT_BY_TYPE = new Map([
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);
const FALLBACK_HOST_ADDRESSES = new Map([
  ["aws-1-us-east-2.pooler.supabase.com", ["13.58.13.125", "3.148.140.216", "3.131.201.192"]],
]);
const WIKIMEDIA_API_URL = "https://commons.wikimedia.org/w/api.php";
const OPENVERSE_API_URL = "https://api.openverse.engineering/v1/images/";
const OPENVERSE_ALLOWED_LICENSES = "by,by-sa,cc0,pdm";
const USER_AGENT = "rGuide-media-ingest/1.0 (https://rguide.co; media@rguide.co)";
const BROWSER_USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36";
const IMAGE_ACCEPT_HEADER = "image/webp,image/jpeg,image/png,image/*;q=0.8,*/*;q=0.1";
const CURL_IMAGE_MAX_BYTES = 25 * 1024 * 1024;
const SOURCE_FETCH_TIMEOUT_MS = 15_000;
const execFileAsync = promisify(execFile);

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

function parseArgs(argv) {
  const options = {
    city: null,
    slugs: [],
    id: null,
    mediaIds: [],
    limit: 25,
    dryRun: false,
    force: false,
    failedOnly: false,
    quarantinedOnly: false,
    openverseFallback: false,
    openverseMinScore: 8,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const readValue = () => {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`Missing value for ${arg}`);
      index += 1;
      return value;
    };

    if (arg === "--city") options.city = readValue();
    else if (arg === "--slug") {
      options.slugs.push(...readValue().split(",").map((value) => value.trim()).filter(Boolean));
    }
    else if (arg === "--id") options.id = readValue();
    else if (arg === "--media-id") {
      options.mediaIds.push(...readValue().split(",").map((value) => value.trim()).filter(Boolean));
    }
    else if (arg === "--limit") options.limit = Number(readValue());
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--force") options.force = true;
    else if (arg === "--failed-only") options.failedOnly = true;
    else if (arg === "--quarantined-only") options.quarantinedOnly = true;
    else if (arg === "--openverse-fallback") options.openverseFallback = true;
    else if (arg === "--openverse-min-score") options.openverseMinScore = Number(readValue());
    else throw new Error(`Unknown argument: ${arg}`);
  }

  if (!Number.isInteger(options.limit) || options.limit < 1) {
    throw new Error("--limit must be a positive integer.");
  }
  if (!Number.isFinite(options.openverseMinScore) || options.openverseMinScore < 0) {
    throw new Error("--openverse-min-score must be a non-negative number.");
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
      if (!addresses.length) {
        throw lookupError;
      }
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

function isR2Url(url, publicBaseUrl) {
  return url?.startsWith(`${publicBaseUrl.replace(/\/$/, "")}/`);
}

function normalizeDedupeUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
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

function contentTypeFromPath(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  if (extension === ".avif") return "image/avif";
  return null;
}

function contentTypeFromBytes(bytes) {
  const buffer = Buffer.from(bytes);
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "image/png";
  }
  if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    return "image/webp";
  }
  if (buffer.length >= 12 && buffer.toString("ascii", 4, 8) === "ftyp") {
    const brands = buffer.toString("ascii", 8, Math.min(buffer.length, 32));
    if (brands.includes("avif") || brands.includes("avis")) {
      return "image/avif";
    }
  }
  return null;
}

async function fetchImageWithCurl(url, fetchError) {
  try {
    const protocol = new URL(url).protocol;
    if (protocol !== "http:" && protocol !== "https:") {
      throw new Error(`curl fallback does not support ${protocol || "unknown"} URLs`);
    }
    const { stdout } = await execFileAsync(
      "curl",
      [
        "--location",
        "--fail",
        "--silent",
        "--show-error",
        "--max-time",
        "30",
        "--proto",
        "=http,https",
        "--proto-redir",
        "=http,https",
        "--user-agent",
        BROWSER_USER_AGENT,
        "--header",
        `Accept: ${IMAGE_ACCEPT_HEADER}`,
        "--",
        url,
      ],
      { encoding: "buffer", maxBuffer: CURL_IMAGE_MAX_BYTES },
    );
    const bytes = new Uint8Array(stdout);
    const contentType = contentTypeFromBytes(bytes);
    if (!bytes.length) {
      throw new Error("curl returned an empty body");
    }
    if (!contentType || !IMAGE_EXT_BY_TYPE.has(contentType)) {
      throw new Error("curl returned an unsupported image body");
    }
    return { bytes, contentType };
  } catch (curlError) {
    const fetchMessage = fetchError instanceof Error ? fetchError.message : "unknown fetch error";
    const curlMessage = curlError instanceof Error ? curlError.message : "unknown curl error";
    throw new Error(`source fetch failed (${fetchMessage}); curl fallback failed (${curlMessage})`);
  }
}

function resolveLocalImagePath(url) {
  if (url.startsWith("file://")) {
    const filePath = fileURLToPath(url);
    const relative = path.relative(ROOT, filePath);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      throw new Error("local source file must be inside the repository");
    }
    return filePath;
  }

  if (url.startsWith("/")) {
    return path.join(ROOT, "public", url.replace(/^\/+/, ""));
  }

  return null;
}

function decodePathSegment(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function normalizeWikimediaFileTitle(value) {
  const title = decodePathSegment(value ?? "").replace(/_/g, " ").trim();
  if (!title) return null;
  return title.toLowerCase().startsWith("file:") ? title : `File:${title}`;
}

function getWikimediaFileTitle(sourceUrl) {
  try {
    const url = new URL(sourceUrl);
    const host = url.hostname.toLowerCase();
    const pathname = url.pathname;

    if (host === "commons.wikimedia.org") {
      const filePathMarker = "/wiki/Special:FilePath/";
      if (pathname.startsWith(filePathMarker)) {
        return normalizeWikimediaFileTitle(pathname.slice(filePathMarker.length));
      }
      const fileMarker = "/wiki/File:";
      if (pathname.startsWith(fileMarker)) {
        return normalizeWikimediaFileTitle(pathname.slice("/wiki/".length));
      }
    }

    if (host === "upload.wikimedia.org") {
      const thumbMarker = "/wikipedia/commons/thumb/";
      if (pathname.startsWith(thumbMarker)) {
        const parts = pathname.slice(thumbMarker.length).split("/");
        if (parts.length >= 4) {
          return normalizeWikimediaFileTitle(parts.slice(2, -1).join("/"));
        }
      }

      const commonsMarker = "/wikipedia/commons/";
      if (pathname.startsWith(commonsMarker)) {
        const parts = pathname.slice(commonsMarker.length).split("/");
        if (parts.length >= 3) {
          return normalizeWikimediaFileTitle(parts.slice(2).join("/"));
        }
      }
    }
  } catch {
    return null;
  }

  return null;
}

function cleanWikimediaMetadataValue(value) {
  if (typeof value !== "string") return null;
  const cleaned = value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || null;
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

function venueSearchTokens(value) {
  const stopwords = new Set([
    "a",
    "an",
    "and",
    "bar",
    "cafe",
    "club",
    "de",
    "del",
    "der",
    "el",
    "hotel",
    "hostel",
    "la",
    "le",
    "les",
    "museum",
    "of",
    "restaurant",
    "the",
  ]);
  return normalizeSearchText(value)
    .split(" ")
    .filter((token) => token.length > 2 && !stopwords.has(token));
}

function scoreOpenverseResult(row, result) {
  const venueText = normalizeSearchText(row.venue_name);
  const cityText = normalizeSearchText(row.city_name);
  const titleText = normalizeSearchText(result.title);
  const creatorText = normalizeSearchText(result.creator);
  const landingText = normalizeSearchText(result.foreign_landing_url);
  const tagText = (result.tags ?? [])
    .map((tag) => normalizeSearchText(tag.name ?? tag))
    .filter(Boolean)
    .join(" ");
  const identityText = [titleText, creatorText, landingText].join(" ");
  const combinedText = [identityText, tagText].join(" ");
  const tokens = venueSearchTokens(row.venue_name);
  const matchedTokens = tokens.filter((token) => identityText.includes(token));
  const cityMatched = Boolean(cityText && combinedText.includes(cityText));

  let score = 0;
  if (venueText && titleText.includes(venueText)) score += 12;
  if (cityMatched) score += 4;
  score += matchedTokens.length * 3;
  if (tokens.length && matchedTokens.length === tokens.length) score += 5;
  if (result.source === "wikimedia_commons" || result.source === "flickr") score += 1;
  if (result.width && result.height) {
    const megapixels = (Number(result.width) * Number(result.height)) / 1_000_000;
    score += Math.min(3, Math.max(0, megapixels / 2));
  }

  return score;
}

function isCredibleOpenverseResult(row, result, score, minScore) {
  if (score < minScore) return false;

  const venueText = normalizeSearchText(row.venue_name);
  const cityText = normalizeSearchText(row.city_name);
  const titleText = normalizeSearchText(result.title);
  const landingText = normalizeSearchText(result.foreign_landing_url);
  const identityText = [titleText, landingText].join(" ");
  const tagText = (result.tags ?? [])
    .map((tag) => normalizeSearchText(tag.name ?? tag))
    .filter(Boolean)
    .join(" ");
  const cityMatched = Boolean(cityText && [identityText, tagText].join(" ").includes(cityText));
  const tokens = venueSearchTokens(row.venue_name);
  const matchedTokens = tokens.filter((token) => identityText.includes(token));

  if (venueText && titleText.includes(venueText)) return true;
  if (tokens.length >= 2 && matchedTokens.length >= 2 && cityMatched) return true;
  if (tokens.length === 1 && matchedTokens.length === 1 && cityMatched) return true;
  return false;
}

async function searchOpenverseSource(row, originalError, minScore) {
  const queries = [
    [row.venue_name, row.city_name].filter(Boolean).join(" "),
    [row.venue_name, row.country_name].filter(Boolean).join(" "),
    row.venue_name,
  ].filter((query, index, all) => query && all.indexOf(query) === index);

  for (const query of queries) {
    const apiUrl = new URL(OPENVERSE_API_URL);
    apiUrl.searchParams.set("q", query);
    apiUrl.searchParams.set("page_size", "50");
    apiUrl.searchParams.set("mature", "false");
    apiUrl.searchParams.set("license_type", "commercial");
    apiUrl.searchParams.set("license", OPENVERSE_ALLOWED_LICENSES);
    apiUrl.searchParams.set("category", "photograph");

    const response = await fetch(apiUrl, {
      signal: AbortSignal.timeout(SOURCE_FETCH_TIMEOUT_MS),
      headers: {
        "accept": "application/json",
        "user-agent": USER_AGENT,
      },
    });
    if (!response.ok) {
      throw new Error(`openverse api returned ${response.status}`);
    }

    const body = await response.json();
    const results = (body?.results ?? [])
      .filter((result) => result?.url && /^https?:\/\//i.test(result.url))
      .filter((result) => !result.width || !result.height || (Number(result.width) >= 400 && Number(result.height) >= 300))
      .map((result) => ({
        result,
        score: scoreOpenverseResult(row, result),
      }))
      .filter(({ result, score }) => isCredibleOpenverseResult(row, result, score, minScore))
      .sort((a, b) => b.score - a.score);

    const best = results[0];
    if (!best) continue;

    return {
      resolvedSourceUrl: best.result.foreign_landing_url ?? best.result.url,
      downloadUrl: best.result.url,
      sourceMetadata: {
        provider: "openverse",
        source: best.result.source ?? null,
        title: best.result.title ?? null,
        creator: best.result.creator ?? null,
        credit: best.result.creator ?? null,
        license: best.result.license ?? null,
        license_url: best.result.license_url ?? null,
        foreign_landing_url: best.result.foreign_landing_url ?? null,
        download_url: best.result.url,
        width: best.result.width ?? null,
        height: best.result.height ?? null,
        matched_query: query,
        match_score: best.score,
        fallback_reason: originalError?.message ?? null,
      },
    };
  }

  throw originalError;
}

function pickWikimediaMetadata(extmetadata, key) {
  return cleanWikimediaMetadataValue(extmetadata?.[key]?.value);
}

async function resolveWikimediaSource(sourceUrl) {
  const title = getWikimediaFileTitle(sourceUrl);
  if (!title) return null;

  const apiUrl = new URL(WIKIMEDIA_API_URL);
  apiUrl.searchParams.set("action", "query");
  apiUrl.searchParams.set("format", "json");
  apiUrl.searchParams.set("formatversion", "2");
  apiUrl.searchParams.set("prop", "imageinfo");
  apiUrl.searchParams.set("titles", title);
  apiUrl.searchParams.set("iiprop", "url|mime|size|extmetadata");
  apiUrl.searchParams.set("iiurlwidth", "1920");

  const response = await fetch(apiUrl, {
    signal: AbortSignal.timeout(SOURCE_FETCH_TIMEOUT_MS),
    headers: {
      "accept": "application/json",
      "user-agent": USER_AGENT,
    },
  });
  if (!response.ok) {
    throw new Error(`wikimedia api returned ${response.status}`);
  }

  const body = await response.json();
  const page = body?.query?.pages?.[0];
  const imageInfo = page?.imageinfo?.[0];
  if (!imageInfo?.url && !imageInfo?.thumburl) {
    throw new Error(`wikimedia api did not return an image for ${title}`);
  }

  const extmetadata = imageInfo.extmetadata ?? {};
  return {
    downloadUrl: imageInfo.thumburl ?? imageInfo.url,
    canonicalUrl: imageInfo.descriptionurl ?? `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`,
    provider: "wikimedia_commons",
    fileTitle: page?.title ?? title,
    mime: imageInfo.mime ?? null,
    width: imageInfo.thumbwidth ?? imageInfo.width ?? null,
    height: imageInfo.thumbheight ?? imageInfo.height ?? null,
    credit: pickWikimediaMetadata(extmetadata, "Artist") ?? pickWikimediaMetadata(extmetadata, "Credit"),
    license: pickWikimediaMetadata(extmetadata, "LicenseShortName") ?? pickWikimediaMetadata(extmetadata, "License"),
    licenseUrl: pickWikimediaMetadata(extmetadata, "LicenseUrl"),
  };
}

function wikimediaSearchText(page) {
  const metadata = page?.imageinfo?.[0]?.extmetadata ?? {};
  return [
    page?.title,
    ...Object.values(metadata).map((value) => cleanWikimediaMetadataValue(value?.value)),
  ]
    .filter(Boolean)
    .join(" ");
}

function scoreWikimediaSearchResult(row, page) {
  const venueText = normalizeSearchText(row.venue_name);
  const cityText = normalizeSearchText(row.city_name);
  const countryText = normalizeSearchText(row.country_name);
  const titleText = normalizeSearchText(page.title?.replace(/^File:/i, ""));
  const combinedText = normalizeSearchText(wikimediaSearchText(page));
  const tokens = venueSearchTokens(row.venue_name);
  const matchedTokens = tokens.filter((token) => combinedText.includes(token));
  const cityMatched = Boolean(cityText && combinedText.includes(cityText));
  const countryMatched = Boolean(countryText && combinedText.includes(countryText));
  const imageInfo = page?.imageinfo?.[0];

  let score = 0;
  if (venueText && titleText.includes(venueText)) score += 12;
  if (venueText && combinedText.includes(venueText)) score += 8;
  if (cityMatched) score += 4;
  if (countryMatched) score += 2;
  score += matchedTokens.length * 3;
  if (tokens.length && matchedTokens.length === tokens.length) score += 5;
  if (imageInfo?.width && imageInfo?.height) {
    const megapixels = (Number(imageInfo.width) * Number(imageInfo.height)) / 1_000_000;
    score += Math.min(3, Math.max(0, megapixels / 2));
  }

  return {
    score,
    cityMatched,
    countryMatched,
    venueInTitle: Boolean(venueText && titleText.includes(venueText)),
    matchedTokenCount: matchedTokens.length,
    tokenCount: tokens.length,
  };
}

function isCredibleWikimediaSearchResult(result) {
  if (result.venueInTitle && (result.cityMatched || result.countryMatched || result.tokenCount >= 3)) {
    return true;
  }
  if (
    result.tokenCount >= 2 &&
    result.matchedTokenCount === result.tokenCount &&
    (result.cityMatched || result.countryMatched)
  ) {
    return true;
  }
  return (
    result.tokenCount >= 3 &&
    result.matchedTokenCount >= 2 &&
    (result.cityMatched || result.countryMatched)
  );
}

async function searchWikimediaSource(row, originalError) {
  const queries = [
    [row.venue_name, row.city_name].filter(Boolean).join(" "),
    [row.venue_name, row.country_name].filter(Boolean).join(" "),
  ].filter((query, index, all) => query && all.indexOf(query) === index);

  for (const query of queries) {
    const apiUrl = new URL(WIKIMEDIA_API_URL);
    apiUrl.searchParams.set("action", "query");
    apiUrl.searchParams.set("format", "json");
    apiUrl.searchParams.set("formatversion", "2");
    apiUrl.searchParams.set("generator", "search");
    apiUrl.searchParams.set("gsrsearch", query);
    apiUrl.searchParams.set("gsrnamespace", "6");
    apiUrl.searchParams.set("gsrlimit", "30");
    apiUrl.searchParams.set("prop", "imageinfo");
    apiUrl.searchParams.set("iiprop", "url|mime|size|extmetadata");
    apiUrl.searchParams.set("iiurlwidth", "1920");

    const response = await fetch(apiUrl, {
      signal: AbortSignal.timeout(SOURCE_FETCH_TIMEOUT_MS),
      headers: {
        "accept": "application/json",
        "user-agent": USER_AGENT,
      },
    });
    if (!response.ok) {
      throw new Error(`wikimedia api returned ${response.status}`);
    }

    const body = await response.json();
    const ranked = (body?.query?.pages ?? [])
      .filter((page) => page?.imageinfo?.[0]?.url || page?.imageinfo?.[0]?.thumburl)
      .map((page) => ({ page, ...scoreWikimediaSearchResult(row, page) }))
      .filter(isCredibleWikimediaSearchResult)
      .sort((a, b) => b.score - a.score);
    const best = ranked[0];
    if (!best) continue;

    const imageInfo = best.page.imageinfo[0];
    const extmetadata = imageInfo.extmetadata ?? {};
    const canonicalUrl =
      imageInfo.descriptionurl ??
      `https://commons.wikimedia.org/wiki/${encodeURIComponent(best.page.title.replace(/ /g, "_"))}`;
    return {
      resolvedSourceUrl: canonicalUrl,
      downloadUrl: imageInfo.thumburl ?? imageInfo.url,
      sourceMetadata: {
        provider: "wikimedia_commons",
        file_title: best.page.title,
        download_url: imageInfo.thumburl ?? imageInfo.url,
        canonical_url: canonicalUrl,
        mime: imageInfo.mime ?? null,
        width: imageInfo.thumbwidth ?? imageInfo.width ?? null,
        height: imageInfo.thumbheight ?? imageInfo.height ?? null,
        credit:
          pickWikimediaMetadata(extmetadata, "Artist") ??
          pickWikimediaMetadata(extmetadata, "Credit"),
        license:
          pickWikimediaMetadata(extmetadata, "LicenseShortName") ??
          pickWikimediaMetadata(extmetadata, "License"),
        license_url: pickWikimediaMetadata(extmetadata, "LicenseUrl"),
        matched_query: query,
        match_score: best.score,
        fallback_reason: originalError?.message ?? null,
      },
    };
  }

  throw originalError;
}

export async function searchLicensedFallbackSource(row, originalError, minScore) {
  try {
    return await searchWikimediaSource(row, originalError);
  } catch (wikimediaError) {
    return searchOpenverseSource(row, wikimediaError, minScore);
  }
}

function logFallbackSource(row, resolvedSource) {
  const sourceMetadata = resolvedSource.sourceMetadata ?? {};
  console.log(JSON.stringify({
    phase: sourceMetadata.provider === "wikimedia_commons"
      ? "wikimedia_fallback"
      : "openverse_fallback",
    mediaId: row.media_id,
    venue: row.venue_name,
    query: sourceMetadata.matched_query,
    score: sourceMetadata.match_score,
    source:
      sourceMetadata.canonical_url ??
      sourceMetadata.foreign_landing_url ??
      resolvedSource.resolvedSourceUrl,
  }));
}

function normalizeCountryFolder(row) {
  if (row.country_code) {
    return row.country_code.toLowerCase();
  }
  if (row.country_name) {
    const code = getCountryCode(row.country_name);
    if (code) {
      return code.toLowerCase();
    }
  }
  return "unknown";
}

function buildStorageKey(row, contentType) {
  const country = normalizeCountryFolder(row);
  const city = slugify(row.city_name ?? "unknown-city") || "unknown-city";
  const venue = slugify(row.venue_name ?? row.venue_slug ?? row.media_id) || row.media_id;
  const mediaId = String(row.media_id).slice(0, 8);
  const role = slugify(row.role ?? "image") || "image";
  const extension = IMAGE_EXT_BY_TYPE.get(contentType) ?? extensionFromUrl(row.source_image_url) ?? "jpg";
  return `venues/${country}/${city}/${venue}/${mediaId}-${role}.${extension}`;
}

async function fetchImage(url) {
  const localPath = resolveLocalImagePath(url);
  if (localPath) {
    const contentType = contentTypeFromPath(localPath);
    if (!contentType || !IMAGE_EXT_BY_TYPE.has(contentType)) {
      throw new Error(`local source file has unsupported image extension: ${localPath}`);
    }
    const bytes = fs.readFileSync(localPath);
    if (!bytes.length) {
      throw new Error("local source file is empty");
    }
    return { bytes: new Uint8Array(bytes), contentType };
  }

  const fetchWithUserAgent = (userAgent) => fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(SOURCE_FETCH_TIMEOUT_MS),
    headers: {
      "accept": IMAGE_ACCEPT_HEADER,
      "user-agent": userAgent,
    },
  });

  let response;
  try {
    response = await fetchWithUserAgent(USER_AGENT);
    if (response.status === 403) {
      response = await fetchWithUserAgent(BROWSER_USER_AGENT);
    }
  } catch (error) {
    return fetchImageWithCurl(url, error);
  }

  const contentType = response.headers.get("content-type")?.split(";")[0]?.toLowerCase() ?? "";
  if (!response.ok) {
    throw new Error(`source returned ${response.status}`);
  }
  if (!IMAGE_EXT_BY_TYPE.has(contentType)) {
    throw new Error(`source returned non-image content-type ${contentType || "unknown"}`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  if (!bytes.length) {
    throw new Error("source returned empty body");
  }

  return { bytes, contentType };
}

export async function resolveSource(sourceUrl) {
  const wikimedia = await resolveWikimediaSource(sourceUrl);
  return {
    resolvedSourceUrl: wikimedia?.canonicalUrl ?? sourceUrl,
    downloadUrl: wikimedia?.downloadUrl ?? sourceUrl,
    sourceMetadata: wikimedia
      ? {
          provider: wikimedia.provider,
          file_title: wikimedia.fileTitle,
          download_url: wikimedia.downloadUrl,
          canonical_url: wikimedia.canonicalUrl,
          mime: wikimedia.mime,
          width: wikimedia.width,
          height: wikimedia.height,
          credit: wikimedia.credit,
          license: wikimedia.license,
          license_url: wikimedia.licenseUrl,
        }
      : null,
  };
}

export async function fetchResolvedImage(resolvedSource) {
  const image = await fetchImage(resolvedSource.downloadUrl);
  return {
    ...image,
    resolvedSourceUrl: resolvedSource.resolvedSourceUrl,
    sourceMetadata: resolvedSource.sourceMetadata,
  };
}

async function loadCandidates(client, options, publicBaseUrl) {
  const conditions = [
    "media.media_type = 'image'",
    "media.url is not null",
    "btrim(media.url) <> ''",
  ];
  const values = [];

  if (options.quarantinedOnly) {
    conditions.push("media.raw_metadata #>> '{quarantine_reason}' = 'cross_venue_r2_dedupe'");
  } else {
    conditions.push("media.is_active = true");
  }

  if (!options.force) {
    values.push(publicBaseUrl.replace(/\/$/, "") + "/%");
    if (!options.quarantinedOnly) {
      conditions.push("(media.public_url is null or media.public_url not like $" + values.length + ")");
      conditions.push("(media.storage_provider is null or media.storage_provider <> 'cloudflare_r2')");
    }
  }
  if (options.city) {
    values.push(options.city);
    conditions.push("city.name ilike $" + values.length);
  }
  if (options.slugs.length) {
    values.push(options.slugs);
    conditions.push("entry.slug = any($" + values.length + "::text[])");
  }
  if (options.id) {
    values.push(options.id);
    conditions.push("(entry.legacy_id = $" + values.length + " or entry.id::text = $" + values.length + ")");
  }
  if (options.mediaIds.length) {
    values.push(options.mediaIds);
    conditions.push("media.id::text = any($" + values.length + "::text[])");
  }
  if (options.failedOnly) {
    conditions.push("media.ingestion_status = 'failed'");
  }

  values.push(options.limit);
  const limitPlaceholder = "$" + values.length;

  const { rows } = await client.query(
    [
      "select distinct on (media.id)",
      "  media.id as media_id,",
      "  media.venue_id,",
      "  media.url,",
      "  media.public_url,",
      "  media.source_url,",
      "  media.raw_metadata #>> '{quarantine_reason}' as quarantine_reason,",
      "  media.role,",
      "  venue.slug as venue_slug,",
      "  venue.name as venue_name,",
      "  city.country_code,",
      "  city.country_name,",
      "  city.name as city_name,",
      "  entry.id as entry_id,",
      "  entry.slug as entry_slug",
      "from public.venue_media media",
      "join public.venues venue on venue.id = media.venue_id",
      "left join public.destinations city on city.id = venue.city_id",
      "left join public.entry_stops stop on stop.venue_id = venue.id",
      "left join public.entries entry on entry.id = stop.entry_id and entry.status = 'published'::public.rguide_entry_status",
      "where " + conditions.join(" and "),
      "order by media.id, media.role = 'primary' desc, media.sort_order, media.created_at",
      "limit " + limitPlaceholder,
    ].join(" "),
    values,
  );

  return rows
    .map((row) => {
      const mediaUrl = String(row.url ?? "").trim();
      const publicUrl = String(row.public_url ?? "").trim();
      const sourceUrl = String(row.source_url ?? "").trim();
      const hasStoredR2Object = isR2Url(publicUrl, publicBaseUrl) || isR2Url(mediaUrl, publicBaseUrl);

      return {
        ...row,
        // Before ingestion, media.url is the image candidate while source_url may be a landing page.
        // Once either canonical URL identifies an R2 object, source_url is the re-ingestion source.
        source_image_url: hasStoredR2Object
          ? sourceUrl || mediaUrl
          : mediaUrl || sourceUrl,
      };
    })
    .filter((row) => !isR2Url(row.source_image_url, publicBaseUrl));
}

function isQuarantinedPlaceholder(row) {
  return row.quarantine_reason === "cross_venue_r2_dedupe";
}

async function markFailed(client, row, error) {
  await client.query(
    `update public.venue_media
     set ingestion_status = 'failed',
         ingestion_error = $2,
         updated_at = now()
     where id = $1`,
    [row.media_id, error.message.slice(0, 500)],
  );
}

function sourceDedupeKeys(row, resolvedSource) {
  return [
    row.source_image_url,
    row.source_url,
    row.url,
    resolvedSource?.resolvedSourceUrl,
    resolvedSource?.downloadUrl,
    resolvedSource?.sourceMetadata?.canonical_url,
    resolvedSource?.sourceMetadata?.download_url,
  ]
    .map(normalizeDedupeUrl)
    .filter(Boolean)
    .filter((value, index, all) => all.indexOf(value) === index);
}

async function findStoredMediaBySource(client, row, resolvedSource, publicBaseUrl) {
  const keys = sourceDedupeKeys(row, resolvedSource);
  if (!keys.length) return null;

  const { rows } = await client.query(
    `select
       media.id,
       media.url,
       media.public_url,
       media.storage_provider,
       media.storage_bucket,
       media.storage_key,
       media.content_type,
       media.byte_size,
       media.width,
       media.height,
       media.venue_id,
       media.source_url,
       media.source_type,
       media.credit,
       media.license,
       media.raw_metadata
     from public.venue_media media
     where media.id <> $1
       and media.venue_id = $4
       and media.is_active = true
       and media.media_type = 'image'
       and media.storage_provider = 'cloudflare_r2'
       and media.ingestion_status = 'stored'
       and media.public_url like $3
       and (
         media.source_url = any($2::text[])
         or media.raw_metadata #>> '{source_resolver,canonical_url}' = any($2::text[])
         or media.raw_metadata #>> '{source_resolver,download_url}' = any($2::text[])
       )
     order by media.ingested_at desc nulls last, media.updated_at desc
     limit 1`,
    [row.media_id, keys, `${publicBaseUrl.replace(/\/$/, "")}/%`, row.venue_id],
  );

  return rows[0] ?? null;
}

async function reuseStoredMediaRow(client, row, storedMedia, resolvedSource) {
  const sourceMetadata = resolvedSource?.sourceMetadata;
  const resolvedSourceUrl = resolvedSource?.resolvedSourceUrl ?? storedMedia.source_url;
  const rawMetadataPatch = {
    deduped_from_media_id: storedMedia.id,
    ...(sourceMetadata ? { source_resolver: sourceMetadata } : {}),
    ...(storedMedia.raw_metadata?.responsive_renditions
      ? { responsive_renditions: storedMedia.raw_metadata.responsive_renditions }
      : {}),
  };

  await client.query(
    `update public.venue_media
     set is_active = true,
         source_url = coalesce($9, source_url),
         url = $2,
         public_url = $2,
         storage_provider = $3,
         storage_bucket = $4,
         storage_key = $5,
         content_type = $6,
         byte_size = $7,
         width = $16,
         height = $17,
         ingestion_status = 'stored',
         ingestion_error = null,
         validation_status = 'valid',
         validation_error = null,
         last_validated_at = now(),
         ingested_at = now(),
         source_type = coalesce(source_type, $10, $11),
         credit = coalesce(credit, $12, $13),
         license = coalesce(license, $14, $15),
         raw_metadata = (
           raw_metadata
           - 'quarantined_at'
           - 'quarantine_reason'
           - 'quarantine_storage_key'
           - 'quarantine_owner_media_id'
           - 'responsive_rendition_error'
           - 'responsive_rendition_failed_at'
         ) || $8::jsonb,
         updated_at = now()
     where id = $1`,
    [
      storedMedia.id,
      storedMedia.public_url ?? storedMedia.url,
      storedMedia.storage_provider,
      storedMedia.storage_bucket,
      storedMedia.storage_key,
      storedMedia.content_type,
      storedMedia.byte_size,
      JSON.stringify(rawMetadataPatch),
      resolvedSourceUrl,
      sourceMetadata?.provider ?? null,
      storedMedia.source_type,
      sourceMetadata?.credit ?? null,
      storedMedia.credit,
      sourceMetadata?.license ?? null,
      storedMedia.license,
      storedMedia.width,
      storedMedia.height,
    ],
  );

  await client.query(
    `update public.venue_media
     set is_active = false,
         ingestion_error = null,
         raw_metadata = raw_metadata || $2::jsonb,
         updated_at = now()
     where id = $1`,
    [
      row.media_id,
      JSON.stringify({
        deduped_to_media_id: storedMedia.id,
        deduped_at: new Date().toISOString(),
      }),
    ],
  );

  return storedMedia.id;
}

async function promoteStoredMediaAsPrimary(client, row) {
  await client.query(
    `with current_media as (
       update public.venue_media
       set role = 'primary',
           is_active = true,
           updated_at = now()
       where id = $1
       returning id, venue_id
     ),
     promoted as (
       update public.venues venue
       set primary_photo_id = current_media.id,
           updated_at = now()
       from current_media
       where venue.id = current_media.venue_id
         and venue.primary_photo_id is distinct from current_media.id
       returning venue.id
     )
     update public.venue_media media
     set is_active = false,
         raw_metadata = media.raw_metadata || jsonb_build_object(
           'retired_by_media_id', $1::text,
           'retired_reason', 'primary_photo_replaced_by_revision',
           'retired_at', now()
         ),
         updated_at = now()
     from current_media
     where media.venue_id = current_media.venue_id
       and media.id <> current_media.id
       and media.is_active = true
       and media.media_type = 'image'
       and media.role = 'primary'`,
    [row.media_id],
  );
}

async function updateMediaRow(client, row, storage, bucket, publicBaseUrl) {
  const publicUrl = `${publicBaseUrl.replace(/\/$/, "")}/${storage.key}`;
  await client.query(
    `update public.venue_media
     set is_active = true,
         source_url = coalesce($7, nullif(source_url, ''), url),
         url = $2,
         public_url = $2,
         storage_provider = 'cloudflare_r2',
         storage_bucket = $3,
         storage_key = $4,
         content_type = $5,
         byte_size = $6,
         width = $12,
         height = $13,
         ingestion_status = 'stored',
         ingestion_error = null,
         validation_status = 'valid',
         validation_error = null,
         last_validated_at = now(),
         ingested_at = now(),
         source_type = coalesce(source_type, $8),
         credit = coalesce(credit, $9),
         license = coalesce(license, $10),
         raw_metadata = (
           raw_metadata
           - 'quarantined_at'
           - 'quarantine_reason'
           - 'quarantine_storage_key'
           - 'quarantine_owner_media_id'
           - 'responsive_rendition_error'
           - 'responsive_rendition_failed_at'
         ) || $11::jsonb,
         updated_at = now()
     where id = $1`,
    [
      row.media_id,
      publicUrl,
      bucket,
      storage.key,
      storage.contentType,
      storage.bytes.length,
      storage.resolvedSourceUrl,
      storage.sourceMetadata?.provider ?? null,
      storage.sourceMetadata?.credit ?? null,
      storage.sourceMetadata?.license ?? null,
      JSON.stringify({
        ...(storage.sourceMetadata ? { source_resolver: storage.sourceMetadata } : {}),
        responsive_renditions: serializeR2ImageRenditions(storage.renditions),
      }),
      storage.renditions.original.width,
      storage.renditions.original.height,
    ],
  );
  return publicUrl;
}

async function refreshRenderCaches(client, entryIds) {
  if (!entryIds.size) return 0;
  const { rowCount } = await client.query(
    [
      "insert into public.entry_render_cache (",
      "  entry_id, render_format, render_version, rendered_payload, source_hash,",
      "  rendered_at, stale_at, is_current, metadata",
      ")",
      "select",
      "  entry.id,",
      "  'maplist',",
      "  1,",
      "  view.list,",
      "  encode(digest(view.list::text, 'sha256'), 'hex'),",
      "  now(),",
      "  null,",
      "  true,",
      "  jsonb_build_object('refreshed_from', 'ingest-venue-media-r2')",
      "from public.entries entry",
      "join public.entries_maplist view on view.id = entry.id",
      "where entry.id = any($1::uuid[])",
      "on conflict (entry_id, render_format, render_version) do update set",
      "  rendered_payload = excluded.rendered_payload,",
      "  source_hash = excluded.source_hash,",
      "  rendered_at = excluded.rendered_at,",
      "  stale_at = null,",
      "  is_current = true,",
      "  metadata = public.entry_render_cache.metadata || excluded.metadata",
    ].join(" "),
    [[...entryIds]],
  );
  return rowCount ?? 0;
}

async function findPublishedEntryIdsForVenues(client, venueIds) {
  if (!venueIds.size) return new Set();

  const { rows } = await client.query(
    `select distinct stop.entry_id
     from public.entry_stops stop
     join public.entries entry on entry.id = stop.entry_id
     where stop.venue_id = any($1::uuid[])
       and entry.status = 'published'::public.rguide_entry_status`,
    [[...venueIds]],
  );

  return new Set(rows.map((row) => row.entry_id));
}

async function main() {
  loadEnvFile(path.join(ROOT, ".env.local"));
  loadEnvFile(path.join(ROOT, ".env"));

  const options = parseArgs(process.argv.slice(2));
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) throw new Error("Set SUPABASE_DB_URL, SUPABASE_DATABASE_URL, or DATABASE_URL.");

  const bucket = requiredEnv("CLOUDFLARE_R2_BUCKET");
  const publicBaseUrl = requiredEnv("CLOUDFLARE_R2_PUBLIC_BASE_URL");
  const r2 = new S3Client({
    region: "auto",
    endpoint: requiredEnv("CLOUDFLARE_R2_ENDPOINT"),
    credentials: {
      accessKeyId: requiredEnv("CLOUDFLARE_R2_ACCESS_KEY_ID"),
      secretAccessKey: requiredEnv("CLOUDFLARE_R2_SECRET_ACCESS_KEY"),
    },
  });

  const client = await connectPgClient(databaseUrl);

  const stats = { selected: 0, uploaded: 0, failed: 0, skipped: 0, cacheRefreshed: 0 };
  const touchedVenueIds = new Set();

  try {
    const candidates = await loadCandidates(client, options, publicBaseUrl);
    stats.selected = candidates.length;
    console.log(JSON.stringify({ phase: "selected", count: candidates.length, dryRun: options.dryRun }));

    for (const row of candidates) {
      try {
        if (!row.source_image_url) {
          stats.skipped += 1;
          continue;
        }
        let resolvedSource;
        try {
          if (isQuarantinedPlaceholder(row)) {
            throw new Error("quarantined placeholder source skipped");
          }
          resolvedSource = await resolveSource(row.source_image_url);
        } catch (sourceError) {
          if (!options.openverseFallback) {
            throw sourceError;
          }
          resolvedSource = await searchLicensedFallbackSource(
            row,
            sourceError,
            options.openverseMinScore,
          );
          logFallbackSource(row, resolvedSource);
        }
        const storedMedia = await findStoredMediaBySource(client, row, resolvedSource, publicBaseUrl);
        if (storedMedia) {
          const publicUrl = storedMedia.public_url ?? storedMedia.url;
          console.log(JSON.stringify({
            phase: options.dryRun ? "would_reuse" : "reuse",
            mediaId: row.media_id,
            venue: row.venue_name,
            sourceMediaId: storedMedia.id,
            publicUrl,
          }));

          if (!options.dryRun) {
            const storedMediaId = await reuseStoredMediaRow(client, row, storedMedia, resolvedSource);
            await promoteStoredMediaAsPrimary(client, { ...row, media_id: storedMediaId });
            touchedVenueIds.add(row.venue_id);
          }

          stats.uploaded += 1;
          continue;
        }

        let image;
        try {
          image = await fetchResolvedImage(resolvedSource);
        } catch (sourceError) {
          if (!options.openverseFallback) {
            throw sourceError;
          }

          resolvedSource = await searchLicensedFallbackSource(
            row,
            sourceError,
            options.openverseMinScore,
          );
          logFallbackSource(row, resolvedSource);

          const fallbackStoredMedia = await findStoredMediaBySource(client, row, resolvedSource, publicBaseUrl);
          if (fallbackStoredMedia) {
            const publicUrl = fallbackStoredMedia.public_url ?? fallbackStoredMedia.url;
            console.log(JSON.stringify({
              phase: options.dryRun ? "would_reuse" : "reuse",
              mediaId: row.media_id,
              venue: row.venue_name,
              sourceMediaId: fallbackStoredMedia.id,
              publicUrl,
            }));

            if (!options.dryRun) {
              const storedMediaId = await reuseStoredMediaRow(client, row, fallbackStoredMedia, resolvedSource);
              await promoteStoredMediaAsPrimary(client, { ...row, media_id: storedMediaId });
              touchedVenueIds.add(row.venue_id);
            }

            stats.uploaded += 1;
            continue;
          }

          image = await fetchResolvedImage(resolvedSource);
        }
        const key = buildStorageKey(row, image.contentType);
        const renditions = await createR2ImageRenditions(image.bytes, key);
        const publicUrl = `${publicBaseUrl.replace(/\/$/, "")}/${key}`;
        console.log(JSON.stringify({
          phase: options.dryRun ? "would_upload" : "upload",
          mediaId: row.media_id,
          venue: row.venue_name,
          bytes: image.bytes.length,
          contentType: image.contentType,
          renditionBytes: renditions.variants.reduce((total, rendition) => total + rendition.byteSize, 0),
          renditionCount: renditions.variants.length,
          publicUrl,
        }));

        if (!options.dryRun) {
          await Promise.all([
            r2.send(new PutObjectCommand({
              Bucket: bucket,
              Key: key,
              Body: image.bytes,
              ContentType: image.contentType,
              CacheControl: "public, max-age=31536000, immutable",
            })),
            ...renditions.variants.map((rendition) => r2.send(new PutObjectCommand({
              Bucket: bucket,
              Key: rendition.key,
              Body: rendition.bytes,
              ContentType: rendition.contentType,
              CacheControl: "public, max-age=31536000, immutable",
              Metadata: {
                "rendition-version": "1",
                "rendition-width": String(rendition.requestedWidth),
              },
            }))),
          ]);
          await updateMediaRow(client, row, { key, ...image, renditions }, bucket, publicBaseUrl);
          await promoteStoredMediaAsPrimary(client, row);
          touchedVenueIds.add(row.venue_id);
        }

        stats.uploaded += 1;
      } catch (error) {
        stats.failed += 1;
        console.error(JSON.stringify({
          phase: "failed",
          mediaId: row.media_id,
          venue: row.venue_name,
          error: error.message,
        }));
        if (!options.dryRun) await markFailed(client, row, error);
      }
    }

    if (!options.dryRun) {
      const touchedEntryIds = await findPublishedEntryIdsForVenues(client, touchedVenueIds);
      stats.cacheRefreshed = await refreshRenderCaches(client, touchedEntryIds);
    }

    console.log(JSON.stringify({ ok: true, stats }, null, 2));
  } finally {
    await client.end();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
