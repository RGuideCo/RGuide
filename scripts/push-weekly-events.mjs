import fs from "fs";
import path from "path";
import process from "process";
import pg from "pg";

import {
  buildWeeklyEventGuidesInsertSql,
  buildWeeklyEventGuidesSchemaSql,
  describeWeeklyEventFilters,
  filterWeeklyEventRecords,
  hasWeeklyEventFilters,
  loadWeeklyEventGuideRecords,
  parseWeeklyEventArgs,
} from "./weekly-events-data.mjs";

const ROOT = process.cwd();

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(ROOT, ".env.local"));

const databaseUrl =
  process.env.SUPABASE_DB_URL ??
  process.env.SUPABASE_DATABASE_URL ??
  process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("Missing Supabase database connection string.");
  process.exit(1);
}

const filters = parseWeeklyEventArgs(process.argv.slice(2));
const allRecords = loadWeeklyEventGuideRecords();
const selectedRecords = hasWeeklyEventFilters(filters)
  ? filterWeeklyEventRecords(allRecords, filters)
  : allRecords;

if (hasWeeklyEventFilters(filters) && !selectedRecords.length) {
  console.error(`No weekly event guides matched ${describeWeeklyEventFilters(filters)}.`);
  process.exit(1);
}

const client = new pg.Client({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
    ? false
    : { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(buildWeeklyEventGuidesSchemaSql());
  await client.query("begin");
  await client.query(buildWeeklyEventGuidesInsertSql(selectedRecords));
  await client.query("commit");

  const { rows } = await client.query("select count(*)::int as count from public.weekly_event_guides");
  console.log(
    [
      `Pushed ${selectedRecords.length} of ${allRecords.length} weekly event guides to Supabase.`,
      `Scope: ${describeWeeklyEventFilters(filters)}.`,
      `weekly_event_guides rows: ${rows[0]?.count ?? "unknown"}`,
    ].join("\n"),
  );
} catch (error) {
  await client.query("rollback").catch(() => {});
  console.error("Failed to push weekly event guides to Supabase.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
