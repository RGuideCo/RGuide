import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import pg from "pg";

import { getPgSslConfig } from "./database-ssl.mjs";
import {
  createR2ImageRenditions,
  serializeR2ImageRenditions,
} from "./lib/r2-image-renditions.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE_CONTROL = "public, max-age=31536000, immutable";

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

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Set ${name}.`);
  return value;
}

function parseArgs(argv) {
  const options = {
    city: null,
    limit: 250,
    concurrency: 3,
    force: false,
    allActive: false,
    dryRun: false,
    quiet: false,
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
    else if (arg === "--limit") options.limit = Number(readValue());
    else if (arg === "--concurrency") options.concurrency = Number(readValue());
    else if (arg === "--force") options.force = true;
    else if (arg === "--all-active") options.allActive = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--quiet") options.quiet = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  if (!Number.isInteger(options.limit) || options.limit < 1) {
    throw new Error("--limit must be a positive integer.");
  }
  if (!Number.isInteger(options.concurrency) || options.concurrency < 1 || options.concurrency > 16) {
    throw new Error("--concurrency must be an integer from 1 to 16.");
  }
  return options;
}

async function loadCandidates(client, options) {
  const conditions = [
    "media.is_active = true",
    "media.media_type = 'image'",
    "media.storage_provider = 'cloudflare_r2'",
    "media.storage_key is not null",
    "media.ingestion_status = 'stored'",
    "venue.primary_photo_id = media.id",
  ];
  const values = [];

  if (!options.force) {
    conditions.push("coalesce(media.raw_metadata #>> '{responsive_renditions,version}', '') <> '1'");
  }
  if (options.city) {
    values.push(options.city);
    conditions.push(`city.name ilike $${values.length}`);
  }
  if (!options.allActive) {
    conditions.push(`exists (
      select 1
      from public.entry_stops stop
      join public.entries entry on entry.id = stop.entry_id
      where stop.venue_id = venue.id
        and entry.status = 'published'::public.rguide_entry_status
    )`);
  }

  values.push(options.limit);
  const { rows } = await client.query(
    `select
       media.id as media_id,
       media.storage_key,
       media.storage_bucket,
       venue.name as venue_name,
       city.name as city_name
     from public.venue_media media
     join public.venues venue on venue.id = media.venue_id
     left join public.destinations city on city.id = venue.city_id
     where ${conditions.join(" and ")}
     order by media.updated_at desc, media.id
     limit $${values.length}`,
    values,
  );
  return rows;
}

async function processCandidate({ runDbQuery, r2, defaultBucket, row, dryRun, quiet }) {
  const bucket = row.storage_bucket || defaultBucket;
  if (dryRun) {
    console.log(JSON.stringify({
      phase: "would_backfill",
      mediaId: row.media_id,
      venue: row.venue_name,
      city: row.city_name,
      key: row.storage_key,
    }));
    return { originalBytes: 0, renditionBytes: 0 };
  }

  const object = await r2.send(new GetObjectCommand({
    Bucket: bucket,
    Key: row.storage_key,
  }));
  if (!object.Body) throw new Error("R2 object has no response body");
  const sourceBytes = await object.Body.transformToByteArray();
  const renditions = await createR2ImageRenditions(sourceBytes, row.storage_key);

  await Promise.all(renditions.variants.map((rendition) => r2.send(new PutObjectCommand({
    Bucket: bucket,
    Key: rendition.key,
    Body: rendition.bytes,
    ContentType: rendition.contentType,
    CacheControl: CACHE_CONTROL,
    Metadata: {
      "rendition-version": "1",
      "rendition-width": String(rendition.requestedWidth),
    },
  }))));

  await runDbQuery(
    `update public.venue_media
     set width = $2,
         height = $3,
         raw_metadata = (raw_metadata - 'responsive_rendition_error') || jsonb_build_object(
           'responsive_renditions', $4::jsonb
         ),
         updated_at = now()
     where id = $1`,
    [
      row.media_id,
      renditions.original.width,
      renditions.original.height,
      JSON.stringify(serializeR2ImageRenditions(renditions)),
    ],
  );

  const renditionBytes = renditions.variants.reduce((total, rendition) => total + rendition.byteSize, 0);
  if (!quiet) {
    console.log(JSON.stringify({
      phase: "backfilled",
      mediaId: row.media_id,
      venue: row.venue_name,
      city: row.city_name,
      originalBytes: sourceBytes.length,
      renditionBytes,
      variants: renditions.variants.map((rendition) => ({
        width: rendition.width,
        bytes: rendition.byteSize,
        key: rendition.key,
      })),
    }));
  }
  return { originalBytes: sourceBytes.length, renditionBytes };
}

async function runPool(items, concurrency, worker) {
  let cursor = 0;
  const results = [];
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index]);
    }
  });
  await Promise.all(runners);
  return results;
}

function isUnsupportedImageError(error) {
  return /unsupported image format|bitstream not supported|invalid input|could not read image dimensions/i.test(
    error.message,
  );
}

async function main() {
  loadEnvFile(path.join(ROOT, ".env.local"));
  const options = parseArgs(process.argv.slice(2));
  const databaseUrl =
    process.env.SUPABASE_DB_URL ??
    process.env.SUPABASE_DATABASE_URL ??
    process.env.DATABASE_URL ??
    requiredEnv("SUPABASE_DB_URL");
  const defaultBucket = requiredEnv("CLOUDFLARE_R2_BUCKET");
  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: getPgSslConfig(databaseUrl),
    connectionTimeoutMillis: 15000,
    query_timeout: 30000,
    statement_timeout: 30000,
  });
  const r2 = new S3Client({
    region: "auto",
    endpoint: requiredEnv("CLOUDFLARE_R2_ENDPOINT"),
    credentials: {
      accessKeyId: requiredEnv("CLOUDFLARE_R2_ACCESS_KEY_ID"),
      secretAccessKey: requiredEnv("CLOUDFLARE_R2_SECRET_ACCESS_KEY"),
    },
  });

  await client.connect();
  try {
    const rows = await loadCandidates(client, options);
    console.log(JSON.stringify({
      phase: "selected",
      count: rows.length,
      city: options.city,
      allActive: options.allActive,
      dryRun: options.dryRun,
    }));

    let failed = 0;
    let processed = 0;
    let dbWriteQueue = Promise.resolve();
    const runDbQuery = (...queryArgs) => {
      const task = dbWriteQueue.then(() => client.query(...queryArgs));
      dbWriteQueue = task.then(() => undefined, () => undefined);
      return task;
    };
    const results = await runPool(rows, options.concurrency, async (row) => {
      try {
        return await processCandidate({
          runDbQuery,
          r2,
          defaultBucket,
          row,
          dryRun: options.dryRun,
          quiet: options.quiet,
        });
      } catch (error) {
        failed += 1;
        console.error(JSON.stringify({
          phase: "failed",
          mediaId: row.media_id,
          venue: row.venue_name,
          city: row.city_name,
          error: error.message,
        }));
        if (!options.dryRun) {
          try {
            const unsupported = isUnsupportedImageError(error);
            await runDbQuery(
              `update public.venue_media
               set raw_metadata = raw_metadata || jsonb_build_object(
                 'responsive_rendition_error', $2::text,
                 'responsive_rendition_failed_at', now(),
                 'responsive_renditions', case
                   when $3::boolean then jsonb_build_object(
                     'version', 1,
                     'available', false,
                     'reason', $2::text
                   )
                   else coalesce(raw_metadata -> 'responsive_renditions', '{}'::jsonb)
                 end
               ),
               updated_at = now()
               where id = $1`,
              [row.media_id, error.message.slice(0, 500), unsupported],
            );
          } catch (metadataError) {
            console.error(JSON.stringify({
              phase: "failed_to_record_error",
              mediaId: row.media_id,
              error: metadataError.message,
            }));
          }
        }
        return { originalBytes: 0, renditionBytes: 0 };
      } finally {
        processed += 1;
        if (options.quiet && (processed % 100 === 0 || processed === rows.length)) {
          console.log(JSON.stringify({ phase: "progress", processed, total: rows.length, failed }));
        }
      }
    });

    console.log(JSON.stringify({
      phase: "complete",
      selected: rows.length,
      succeeded: rows.length - failed,
      failed,
      originalBytes: results.reduce((total, result) => total + result.originalBytes, 0),
      renditionBytes: results.reduce((total, result) => total + result.renditionBytes, 0),
    }));
    if (failed) process.exitCode = 1;
  } finally {
    await client.end();
    r2.destroy();
  }
}

await main();
