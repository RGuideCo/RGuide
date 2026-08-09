import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getCountryCode } from "countries-list";

import { loadEditorialGuideLists } from "./editorial-guides-data.mjs";
import {
  fetchResolvedImage,
  resolveSource,
  searchLicensedFallbackSource,
} from "./ingest-venue-media-r2.mjs";
import {
  createR2ImageRenditions,
} from "./lib/r2-image-renditions.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_OUTPUT = path.join(ROOT, "src/data/generated/nature-stop-image-r2.json");
const DEFAULT_FAILURE_OUTPUT = path.join(ROOT, ".nature-image-r2-failures.json");
const GUIDE_IMAGE_MANIFEST = path.join(ROOT, "src/data/generated/editorial-guide-image-r2.json");
const R2_BASE_URL = "https://media.rguide.co";
const IMAGE_EXT_BY_TYPE = new Map([
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);
const REVIEWED_SOURCE_OVERRIDES = new Map([
  [
    "melbourne-nature-st-kilda",
    "https://commons.wikimedia.org/wiki/File:St_Kilda_Winter_Sunset.jpg",
  ],
  [
    "sydney-nature-spit-manly",
    "https://commons.wikimedia.org/wiki/File:Spit_Bridge_open.jpg",
  ],
]);

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Set ${name}.`);
  return value;
}

function parseArgs(argv) {
  const options = {
    cities: [],
    limit: null,
    concurrency: 3,
    minScore: 10,
    output: DEFAULT_OUTPUT,
    failureOutput: DEFAULT_FAILURE_OUTPUT,
    force: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const readValue = () => {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`Missing value for ${arg}`);
      index += 1;
      return value;
    };

    if (arg === "--city") options.cities.push(...readValue().split(",").map((value) => value.trim()).filter(Boolean));
    else if (arg === "--limit") options.limit = Number(readValue());
    else if (arg === "--concurrency") options.concurrency = Number(readValue());
    else if (arg === "--min-score") options.minScore = Number(readValue());
    else if (arg === "--output") options.output = path.resolve(ROOT, readValue());
    else if (arg === "--failure-output") options.failureOutput = path.resolve(ROOT, readValue());
    else if (arg === "--force") options.force = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  if (options.limit !== null && (!Number.isInteger(options.limit) || options.limit < 1)) {
    throw new Error("--limit must be a positive integer.");
  }
  if (!Number.isInteger(options.concurrency) || options.concurrency < 1 || options.concurrency > 8) {
    throw new Error("--concurrency must be an integer from 1 to 8.");
  }
  if (!Number.isFinite(options.minScore) || options.minScore < 0) {
    throw new Error("--min-score must be a non-negative number.");
  }
  return options;
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

function loadJson(filePath, fallback) {
  return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, "utf8")) : fallback;
}

function writeJsonAtomic(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temporary, filePath);
}

function isUsablePhoto(photo, sourceCache) {
  if (!photo) return false;
  if (photo.startsWith(`${R2_BASE_URL}/`)) return true;
  return Boolean(sourceCache[photo]);
}

function collectCandidates(guides, options, sourceCache, existingItems) {
  const existingIds = new Set(existingItems.map((item) => item.stopId));
  const cities = new Set(options.cities.map((value) => value.toLowerCase()));
  const candidates = [];

  for (const guide of guides) {
    if (guide.category !== "Nature") continue;
    if (cities.size && !cities.has(String(guide.location?.city ?? "").toLowerCase())) continue;
    for (const stop of guide.stops ?? []) {
      if (!options.force && (isUsablePhoto(stop.photo, sourceCache) || existingIds.has(stop.id))) continue;
      candidates.push({
        stopId: stop.id,
        name: stop.name,
        city: guide.location?.city,
        country: guide.location?.country,
        guideId: guide.id,
      });
    }
  }

  return options.limit ? candidates.slice(0, options.limit) : candidates;
}

function buildStorageKey(candidate, sourceUrl, contentType) {
  const countryCode = getCountryCode(candidate.country ?? "");
  const country = typeof countryCode === "string" ? countryCode.toLowerCase() : "unknown";
  const city = slugify(candidate.city ?? "unknown-city") || "unknown-city";
  const venue = slugify(candidate.name ?? candidate.stopId) || "nature-stop";
  const digest = crypto.createHash("sha256").update(`${candidate.stopId}|${sourceUrl}`).digest("hex").slice(0, 12);
  const extension = IMAGE_EXT_BY_TYPE.get(contentType) ?? "jpg";
  return `venues/${country}/${city}/${venue}/${digest}-nature-primary.${extension}`;
}

async function ingestCandidate(candidate, context) {
  const reviewedSource = REVIEWED_SOURCE_OVERRIDES.get(candidate.stopId);
  const resolved = reviewedSource
    ? await resolveSource(reviewedSource)
    : await searchLicensedFallbackSource(
        {
          venue_name: candidate.name,
          city_name: candidate.city,
          country_name: candidate.country,
        },
        new Error(`No credible licensed image found for ${candidate.name}`),
        context.minScore,
      );
  const image = await fetchResolvedImage(resolved);
  const key = buildStorageKey(candidate, resolved.resolvedSourceUrl, image.contentType);
  const publicUrl = `${context.publicBaseUrl.replace(/\/$/, "")}/${key}`;
  const renditions = await createR2ImageRenditions(image.bytes, key);

  await Promise.all([
    context.r2.send(new PutObjectCommand({
      Bucket: context.bucket,
      Key: key,
      Body: image.bytes,
      ContentType: image.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })),
    ...renditions.variants.map((rendition) => context.r2.send(new PutObjectCommand({
      Bucket: context.bucket,
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

  return {
    stopId: candidate.stopId,
    name: candidate.name,
    city: candidate.city,
    country: candidate.country,
    url: publicUrl,
    sourceUrl: resolved.resolvedSourceUrl,
  };
}

function compactOutputItem(item) {
  return {
    stopId: item.stopId,
    name: item.name,
    city: item.city,
    country: item.country,
    url: item.url,
    sourceUrl: item.sourceUrl,
  };
}

async function main() {
  loadEnvFile(path.join(ROOT, ".env.local"));
  loadEnvFile(path.join(ROOT, ".env"));
  const options = parseArgs(process.argv.slice(2));
  const output = loadJson(options.output, { version: 1, generatedAt: null, items: [] });
  output.items = (output.items ?? []).map(compactOutputItem);
  const sourceCache = loadJson(GUIDE_IMAGE_MANIFEST, { entries: {} }).entries ?? {};
  const candidates = collectCandidates(
    loadEditorialGuideLists(),
    options,
    sourceCache,
    output.items ?? [],
  );
  const publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL?.trim() || R2_BASE_URL;
  const bucket = requiredEnv("CLOUDFLARE_R2_BUCKET");
  const r2 = new S3Client({
    region: "auto",
    endpoint: requiredEnv("CLOUDFLARE_R2_ENDPOINT"),
    credentials: {
      accessKeyId: requiredEnv("CLOUDFLARE_R2_ACCESS_KEY_ID"),
      secretAccessKey: requiredEnv("CLOUDFLARE_R2_SECRET_ACCESS_KEY"),
    },
  });
  const failures = [];
  const byStopId = new Map((output.items ?? []).map((item) => [item.stopId, item]));
  let uploaded = 0;

  console.log(JSON.stringify({ phase: "selected", count: candidates.length }));
  for (let index = 0; index < candidates.length; index += options.concurrency) {
    const batch = candidates.slice(index, index + options.concurrency);
    const results = await Promise.allSettled(batch.map((candidate) => ingestCandidate(candidate, {
      bucket,
      minScore: options.minScore,
      publicBaseUrl,
      r2,
    })));

    results.forEach((result, resultIndex) => {
      const candidate = batch[resultIndex];
      if (result.status === "fulfilled") {
        uploaded += 1;
        byStopId.set(candidate.stopId, result.value);
      } else {
        failures.push({
          stopId: candidate.stopId,
          name: candidate.name,
          city: candidate.city,
          error: result.reason instanceof Error ? result.reason.message : String(result.reason),
        });
      }
    });

    output.generatedAt = new Date().toISOString();
    output.items = [...byStopId.values()].sort((a, b) => a.stopId.localeCompare(b.stopId));
    writeJsonAtomic(options.output, output);
    console.log(JSON.stringify({
      phase: "progress",
      processed: Math.min(index + batch.length, candidates.length),
      selected: candidates.length,
      uploaded,
      failed: failures.length,
    }));
  }

  writeJsonAtomic(options.failureOutput, {
    generatedAt: new Date().toISOString(),
    selected: candidates.length,
    uploaded,
    failures,
  });
  console.log(JSON.stringify({ phase: "complete", selected: candidates.length, uploaded, failed: failures.length }));
  if (failures.length) process.exitCode = 2;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
