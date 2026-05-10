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

function toJson(value) {
  return value === undefined ? null : JSON.stringify(value);
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

  const stats = {
    entriesChecked: 0,
    cachedMapListsUpdated: 0,
    stopPhotosChecked: 0,
    stopPhotosUpdated: 0,
    missingNormalizedEntries: [],
  };

  await client.connect();

  try {
    await client.query("begin");
    const { rows } = await client.query(
      [
        "select legacy.id, legacy.list, entry.id as entry_id, entry.cached_map_list",
        "from public.editorial_guides legacy",
        "left join public.entries entry",
        "  on entry.source_table = 'editorial_guides'",
        " and entry.legacy_id = legacy.id",
        "order by legacy.id asc",
      ].join(" "),
    );

    for (const row of rows) {
      stats.entriesChecked += 1;
      if (!row.entry_id) {
        stats.missingNormalizedEntries.push(row.id);
        continue;
      }

      const legacyListJson = JSON.stringify(row.list);
      if (JSON.stringify(row.cached_map_list) !== legacyListJson) {
        await client.query(
          "update public.entries set cached_map_list = $1::jsonb where id = $2",
          [legacyListJson, row.entry_id],
        );
        stats.cachedMapListsUpdated += 1;
      }

      let order = 0;
      for (const stop of row.list?.stops ?? []) {
        order += 1;
        stats.stopPhotosChecked += 1;
        const result = await client.query(
          [
            "update public.entry_stops",
            "set photo_url = $1",
            "where entry_id = $2",
            "  and (legacy_id = $3 or stop_order = $4)",
            "  and photo_url is distinct from $1",
          ].join(" "),
          [stop.photo ?? null, row.entry_id, stop.id ?? null, order],
        );
        stats.stopPhotosUpdated += result.rowCount;
      }
    }

    if (stats.missingNormalizedEntries.length > 0) {
      throw new Error(
        `Missing normalized entries: ${stats.missingNormalizedEntries.slice(0, 10).join(", ")}`,
      );
    }

    await client.query("commit");
    console.log(JSON.stringify({ ok: true, stats }, null, 2));
  } catch (error) {
    await client.query("rollback").catch(() => {});
    console.error("SYNC_NORMALIZED_FROM_LEGACY_GUIDES_FAILED");
    console.error(error instanceof Error ? error.stack || error.message : error);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}

main();
