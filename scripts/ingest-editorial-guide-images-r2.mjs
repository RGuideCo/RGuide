import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getCountryCode } from "countries-list";

import { loadEditorialGuideLists } from "./editorial-guides-data.mjs";
import { fetchResolvedImage, resolveSource } from "./ingest-venue-media-r2.mjs";
import {
  createR2ImageRenditions,
  serializeR2ImageRenditions,
} from "./lib/r2-image-renditions.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_MANIFEST = path.join(ROOT, "src/data/generated/editorial-guide-image-r2.json");
const DEFAULT_FAILURE_OUTPUT = path.join(ROOT, ".guide-image-r2-failures.json");
const R2_BASE_URL = "https://media.rguide.co";
const IMAGE_EXT_BY_TYPE = new Map([
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
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
    slugs: [],
    category: null,
    limit: null,
    concurrency: 6,
    dryRun: false,
    force: false,
    manifest: DEFAULT_MANIFEST,
    failureOutput: DEFAULT_FAILURE_OUTPUT,
    retryFrom: null,
    retryErrors: [],
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
    else if (arg === "--slug") options.slugs.push(...readValue().split(",").map((value) => value.trim()).filter(Boolean));
    else if (arg === "--category") options.category = readValue();
    else if (arg === "--limit") options.limit = Number(readValue());
    else if (arg === "--concurrency") options.concurrency = Number(readValue());
    else if (arg === "--manifest") options.manifest = path.resolve(ROOT, readValue());
    else if (arg === "--failure-output") options.failureOutput = path.resolve(ROOT, readValue());
    else if (arg === "--retry-from") options.retryFrom = path.resolve(ROOT, readValue());
    else if (arg === "--retry-error") options.retryErrors.push(readValue());
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--force") options.force = true;
    else if (arg !== "--all") throw new Error(`Unknown argument: ${arg}`);
  }

  if (options.limit !== null && (!Number.isInteger(options.limit) || options.limit < 1)) {
    throw new Error("--limit must be a positive integer.");
  }
  if (!Number.isInteger(options.concurrency) || options.concurrency < 1 || options.concurrency > 16) {
    throw new Error("--concurrency must be an integer from 1 to 16.");
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

function isExternalImageCandidate(value, publicBaseUrl) {
  if (typeof value !== "string" || !value.trim()) return false;
  if (value.startsWith(`${publicBaseUrl.replace(/\/$/, "")}/`)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function visitStops(stops, callback) {
  for (const stop of stops ?? []) {
    callback(stop);
    if (Array.isArray(stop.places)) visitStops(stop.places, callback);
  }
}

function matchesGuide(guide, options) {
  const normalize = (value) => String(value ?? "").trim().toLowerCase();
  if (options.cities.length && !options.cities.map(normalize).includes(normalize(guide.location?.city))) return false;
  if (options.slugs.length && !options.slugs.map(normalize).includes(normalize(guide.slug))) return false;
  if (options.category && normalize(guide.category) !== normalize(options.category)) return false;
  return true;
}

function collectCandidates(guides, options, publicBaseUrl, existingEntries, retrySources) {
  const bySource = new Map();
  const add = (sourceUrl, context) => {
    const normalized = sourceUrl?.trim();
    if (!isExternalImageCandidate(normalized, publicBaseUrl)) return;
    if (retrySources && !retrySources.has(normalized)) return;
    const existing = existingEntries[normalized];
    if (!options.force && (typeof existing === "string" ? existing : existing?.url)) return;
    if (!bySource.has(normalized)) bySource.set(normalized, { sourceUrl: normalized, ...context });
  };

  for (const guide of guides.filter((item) => matchesGuide(item, options))) {
    const common = {
      country: guide.location?.country,
      city: guide.location?.city,
      guideId: guide.id,
      guideSlug: guide.slug,
    };
    add(guide.photo, { ...common, name: guide.title, entityId: guide.id, kind: "guide" });
    visitStops(guide.stops, (stop) => add(stop.photo, {
      ...common,
      name: stop.name,
      entityId: stop.poiId ?? stop.id,
      stopId: stop.id,
      kind: "venue",
    }));
  }

  const candidates = [...bySource.values()];
  return options.limit ? candidates.slice(0, options.limit) : candidates;
}

function loadRetrySources(options) {
  if (!options.retryFrom) return null;
  const report = JSON.parse(fs.readFileSync(options.retryFrom, "utf8"));
  const failures = Array.isArray(report.failures) ? report.failures : [];
  return new Set(
    failures
      .filter((failure) => (
        !options.retryErrors.length ||
        options.retryErrors.some((value) => String(failure.error ?? "").includes(value))
      ))
      .map((failure) => failure.sourceUrl)
      .filter(Boolean),
  );
}

function loadManifest(filePath) {
  if (!fs.existsSync(filePath)) return { version: 1, generatedAt: null, entries: {} };
  const value = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const entries = Object.fromEntries(
    Object.entries(value.entries ?? {})
      .map(([sourceUrl, cached]) => [
        sourceUrl,
        typeof cached === "string" ? cached : cached?.url,
      ])
      .filter(([, publicUrl]) => Boolean(publicUrl)),
  );
  return {
    version: 1,
    generatedAt: value.generatedAt ?? null,
    entries,
  };
}

function writeJsonAtomic(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temporary, filePath);
}

function buildStorageKey(candidate, sourceUrl, contentType) {
  const countryCode = getCountryCode(candidate.country ?? "");
  const country = typeof countryCode === "string" ? countryCode.toLowerCase() : "unknown";
  const city = slugify(candidate.city ?? "unknown-city") || "unknown-city";
  const entity = slugify(candidate.name ?? candidate.entityId) || "guide-image";
  const digest = crypto.createHash("sha256").update(sourceUrl).digest("hex").slice(0, 12);
  const extension = IMAGE_EXT_BY_TYPE.get(contentType) ?? "jpg";
  const folder = candidate.kind === "guide" ? "guides" : "venues";
  return `${folder}/${country}/${city}/${entity}/${digest}-primary.${extension}`;
}

async function ingestCandidate(candidate, context) {
  const resolved = await resolveSource(candidate.sourceUrl);
  const image = await fetchResolvedImage(resolved);
  const key = buildStorageKey(candidate, resolved.resolvedSourceUrl, image.contentType);
  const publicUrl = `${context.publicBaseUrl.replace(/\/$/, "")}/${key}`;
  const renditions = await createR2ImageRenditions(image.bytes, key);

  if (!context.dryRun) {
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
  }

  return {
    url: publicUrl,
    sourceUrl: candidate.sourceUrl,
    canonicalSourceUrl: resolved.resolvedSourceUrl,
    contentType: image.contentType,
    width: renditions.original.width,
    height: renditions.original.height,
    storageKey: key,
    renditions: serializeR2ImageRenditions(renditions),
    entityId: candidate.entityId,
    guideId: candidate.guideId,
    stopId: candidate.stopId ?? null,
  };
}

async function main() {
  loadEnvFile(path.join(ROOT, ".env.local"));
  loadEnvFile(path.join(ROOT, ".env"));
  const options = parseArgs(process.argv.slice(2));
  const publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL?.trim() || R2_BASE_URL;
  const manifest = loadManifest(options.manifest);
  const guides = loadEditorialGuideLists();
  const retrySources = loadRetrySources(options);
  const candidates = collectCandidates(guides, options, publicBaseUrl, manifest.entries, retrySources);
  const bucket = options.dryRun ? "dry-run" : requiredEnv("CLOUDFLARE_R2_BUCKET");
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
  const failures = [];
  let uploaded = 0;

  console.log(JSON.stringify({ phase: "selected", count: candidates.length, dryRun: options.dryRun }));
  for (let index = 0; index < candidates.length; index += options.concurrency) {
    const batch = candidates.slice(index, index + options.concurrency);
    const results = await Promise.allSettled(batch.map((candidate) => ingestCandidate(candidate, {
      bucket,
      dryRun: options.dryRun,
      publicBaseUrl,
      r2,
    })));

    results.forEach((result, resultIndex) => {
      const candidate = batch[resultIndex];
      if (result.status === "fulfilled") {
        uploaded += 1;
        if (!options.dryRun) manifest.entries[candidate.sourceUrl] = result.value.url;
      } else {
        failures.push({
          sourceUrl: candidate.sourceUrl,
          guideId: candidate.guideId,
          stopId: candidate.stopId ?? null,
          name: candidate.name,
          error: result.reason instanceof Error ? result.reason.message : String(result.reason),
        });
      }
    });

    if (!options.dryRun) {
      manifest.generatedAt = new Date().toISOString();
      writeJsonAtomic(options.manifest, manifest);
    }
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
