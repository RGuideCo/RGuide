import fs from "node:fs";
import dns from "node:dns/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getCountryCode } from "countries-list";
import pg from "pg";

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
const USER_AGENT = "rGuide-media-ingest/1.0 (https://rguide.co; media@rguide.co)";

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
    slug: null,
    id: null,
    limit: 25,
    dryRun: false,
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

    if (arg === "--city") options.city = readValue();
    else if (arg === "--slug") options.slug = readValue();
    else if (arg === "--id") options.id = readValue();
    else if (arg === "--limit") options.limit = Number(readValue());
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--force") options.force = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  if (!Number.isInteger(options.limit) || options.limit < 1) {
    throw new Error("--limit must be a positive integer.");
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

function getPgSslConfig(databaseUrl) {
  return databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
    ? false
    : { rejectUnauthorized: false };
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
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "accept": "image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8,*/*;q=0.1",
      "user-agent": USER_AGENT,
    },
  });

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

async function fetchSourceImage(sourceUrl) {
  const wikimedia = await resolveWikimediaSource(sourceUrl);
  const image = await fetchImage(wikimedia?.downloadUrl ?? sourceUrl);
  return {
    ...image,
    resolvedSourceUrl: wikimedia?.canonicalUrl ?? sourceUrl,
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

async function loadCandidates(client, options, publicBaseUrl) {
  const conditions = [
    "media.is_active = true",
    "media.media_type = 'image'",
    "media.url is not null",
    "btrim(media.url) <> ''",
  ];
  const values = [];

  if (!options.force) {
    values.push(publicBaseUrl.replace(/\/$/, "") + "/%");
    conditions.push("(media.public_url is null or media.public_url not like $" + values.length + ")");
    conditions.push("(media.storage_provider is null or media.storage_provider <> 'cloudflare_r2')");
  }
  if (options.city) {
    values.push(options.city);
    conditions.push("city.name ilike $" + values.length);
  }
  if (options.slug) {
    values.push(options.slug);
    conditions.push("entry.slug = $" + values.length);
  }
  if (options.id) {
    values.push(options.id);
    conditions.push("(entry.legacy_id = $" + values.length + " or entry.id::text = $" + values.length + ")");
  }

  values.push(options.limit);
  const limitPlaceholder = "$" + values.length;

  const { rows } = await client.query(
    [
      "select distinct on (media.id)",
      "  media.id as media_id,",
      "  media.url,",
      "  media.source_url,",
      "  media.role,",
      "  venue.slug as venue_slug,",
      "  venue.name as venue_name,",
      "  city.country_code,",
      "  city.country_name,",
      "  city.name as city_name,",
      "  entry.id as entry_id,",
      "  entry.slug as entry_slug,",
      "  coalesce(nullif(media.source_url, ''), media.url) as source_image_url",
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

  return rows.filter((row) => !isR2Url(row.source_image_url, publicBaseUrl));
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

async function updateMediaRow(client, row, storage, bucket, publicBaseUrl) {
  const publicUrl = `${publicBaseUrl.replace(/\/$/, "")}/${storage.key}`;
  await client.query(
    `update public.venue_media
     set source_url = coalesce($7, nullif(source_url, ''), url),
         url = $2,
         public_url = $2,
         storage_provider = 'cloudflare_r2',
         storage_bucket = $3,
         storage_key = $4,
         content_type = $5,
         byte_size = $6,
         ingestion_status = 'stored',
         ingestion_error = null,
         validation_status = 'valid',
         validation_error = null,
         last_validated_at = now(),
         ingested_at = now(),
         source_type = coalesce(source_type, $8),
         credit = coalesce(credit, $9),
         license = coalesce(license, $10),
         raw_metadata = raw_metadata || $11::jsonb,
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
      JSON.stringify(storage.sourceMetadata ? { source_resolver: storage.sourceMetadata } : {}),
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
  const touchedEntryIds = new Set();

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
        const image = await fetchSourceImage(row.source_image_url);
        const key = buildStorageKey(row, image.contentType);
        const publicUrl = `${publicBaseUrl.replace(/\/$/, "")}/${key}`;
        console.log(JSON.stringify({
          phase: options.dryRun ? "would_upload" : "upload",
          mediaId: row.media_id,
          venue: row.venue_name,
          bytes: image.bytes.length,
          contentType: image.contentType,
          publicUrl,
        }));

        if (!options.dryRun) {
          await r2.send(new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: image.bytes,
            ContentType: image.contentType,
            CacheControl: "public, max-age=31536000, immutable",
          }));
          await updateMediaRow(client, row, { key, ...image }, bucket, publicBaseUrl);
          if (row.entry_id) touchedEntryIds.add(row.entry_id);
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
      stats.cacheRefreshed = await refreshRenderCaches(client, touchedEntryIds);
    }

    console.log(JSON.stringify({ ok: true, stats }, null, 2));
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
