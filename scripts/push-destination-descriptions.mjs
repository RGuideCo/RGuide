import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import process from "process";
import pg from "pg";

const ROOT = process.cwd();
const SQL_PATH = path.join(ROOT, "supabase/destination-descriptions.sql");

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
  console.error(
    [
      "Missing Supabase database connection string.",
      "Add one of these to .env.local:",
      "  SUPABASE_DB_URL=postgresql://postgres.<project-ref>:<password>@aws-...pooler.supabase.com:6543/postgres",
      "  SUPABASE_DATABASE_URL=postgresql://...",
      "  DATABASE_URL=postgresql://...",
      "",
      "Use the direct or transaction-pooler Postgres URL from Supabase Project Settings > Database.",
    ].join("\n"),
  );
  process.exit(1);
}

const exportResult = spawnSync(process.execPath, ["scripts/export-destination-descriptions-sql.mjs"], {
  cwd: ROOT,
  encoding: "utf8",
  stdio: "pipe",
});

if (exportResult.status !== 0) {
  process.stderr.write(exportResult.stderr);
  process.stdout.write(exportResult.stdout);
  process.exit(exportResult.status ?? 1);
}

process.stdout.write(exportResult.stdout);

const sql = fs.readFileSync(SQL_PATH, "utf8");
const client = new pg.Client({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
    ? false
    : { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);

  const { rows } = await client.query("select count(*)::int as count from public.destination_descriptions");
  console.log(
    `Pushed destination descriptions to Supabase. destination_descriptions rows: ${rows[0]?.count ?? "unknown"}`,
  );
} catch (error) {
  console.error("Failed to push destination descriptions to Supabase.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
