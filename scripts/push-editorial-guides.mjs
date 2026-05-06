import fs from "fs";
import path from "path";
import process from "process";
import pg from "pg";

import {
  buildEditorialPoisInsertSql,
  buildEditorialPoisSchemaSql,
  buildEditorialGuidesInsertSql,
  buildEditorialGuidesSchemaSql,
  collectEditorialPois,
  describeEditorialGuideFilters,
  filterEditorialGuides,
  hasEditorialGuideFilters,
  loadEditorialGuideLists,
  parseEditorialGuideArgs,
} from "./editorial-guides-data.mjs";

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

const filters = parseEditorialGuideArgs(process.argv.slice(2));
const allGuides = loadEditorialGuideLists();
const selectedGuides = hasEditorialGuideFilters(filters)
  ? filterEditorialGuides(allGuides, filters)
  : allGuides;

if (hasEditorialGuideFilters(filters) && !selectedGuides.length) {
  console.error(`No editorial guides matched ${describeEditorialGuideFilters(filters)}.`);
  process.exit(1);
}

async function findRemoteSlugConflicts(client, guides) {
  if (!guides.length) {
    return [];
  }

  const incoming = guides.map((guide) => ({
    id: guide.id,
    slug: guide.slug,
  }));

  const { rows } = await client.query(
    [
      "with incoming as (",
      "select * from jsonb_to_recordset($1::jsonb) as item(id text, slug text)",
      ")",
      "select incoming.id, incoming.slug, editorial_guides.id as existing_id",
      "from incoming",
      "join public.editorial_guides on editorial_guides.slug = incoming.slug",
      "where editorial_guides.id <> incoming.id",
      "order by incoming.slug asc",
    ].join(" "),
    [JSON.stringify(incoming)],
  );

  return rows;
}

function formatSlugConflict(conflict) {
  return `${conflict.slug} is already used by ${conflict.existing_id}; incoming id is ${conflict.id}`;
}

const client = new pg.Client({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
    ? false
    : { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(buildEditorialGuidesSchemaSql());
  await client.query(buildEditorialPoisSchemaSql());

  await client.query("begin");

  const slugConflicts = await findRemoteSlugConflicts(client, selectedGuides);
  if (slugConflicts.length) {
    throw new Error(
      [
        "Remote editorial guide slug conflicts found.",
        ...slugConflicts.map((conflict) => `- ${formatSlugConflict(conflict)}`),
        "Keep each guide slug globally unique, or migrate the existing row before pushing.",
      ].join("\n"),
    );
  }

  await client.query(buildEditorialPoisInsertSql(collectEditorialPois(selectedGuides)));
  await client.query(buildEditorialGuidesInsertSql(selectedGuides));
  await client.query("commit");

  const { rows } = await client.query("select count(*)::int as count from public.editorial_guides");
  console.log(
    [
      `Pushed ${selectedGuides.length} of ${allGuides.length} editorial guides to Supabase.`,
      `Scope: ${describeEditorialGuideFilters(filters)}.`,
      `editorial_guides rows: ${rows[0]?.count ?? "unknown"}`,
    ].join("\n"),
  );
} catch (error) {
  await client.query("rollback").catch(() => {});
  console.error("Failed to push editorial guides to Supabase.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
