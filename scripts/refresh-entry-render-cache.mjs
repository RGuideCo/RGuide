import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import pg from "pg";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

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
    await client.query("begin");
    const result = await client.query(
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
        "  jsonb_build_object('refreshed_from', 'entries_maplist')",
        "from public.entries entry",
        "join public.entries_maplist view on view.id = entry.id",
        "where entry.status = 'published'",
        "on conflict (entry_id, render_format, render_version) do update set",
        "  rendered_payload = excluded.rendered_payload,",
        "  source_hash = excluded.source_hash,",
        "  rendered_at = excluded.rendered_at,",
        "  stale_at = null,",
        "  is_current = true,",
        "  metadata = public.entry_render_cache.metadata || excluded.metadata",
      ].join(" "),
    );

    await client.query(
      [
        "update public.entry_render_cache cache",
        "set is_current = false, stale_at = coalesce(stale_at, now())",
        "where cache.render_format = 'maplist'",
        "  and cache.render_version = 1",
        "  and cache.is_current = true",
        "  and not exists (",
        "    select 1",
        "    from public.entries entry",
        "    where entry.id = cache.entry_id",
        "      and entry.status = 'published'",
        "  )",
      ].join(" "),
    );

    await client.query("commit");

    const { rows } = await client.query(
      [
        "select",
        "  count(*) filter (where is_current)::int as current_count,",
        "  count(*)::int as total_count",
        "from public.entry_render_cache",
        "where render_format = 'maplist' and render_version = 1",
      ].join(" "),
    );

    console.log(JSON.stringify({
      ok: true,
      refreshedRows: result.rowCount,
      cache: rows[0],
    }, null, 2));
  } catch (error) {
    await client.query("rollback").catch(() => {});
    console.error("REFRESH_ENTRY_RENDER_CACHE_FAILED");
    console.error(error instanceof Error ? error.stack || error.message : error);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}

main();
