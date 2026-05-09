import fs from "fs";
import path from "path";
import vm from "vm";
import ts from "typescript";

const ROOT = process.cwd();
const WEEKLY_EVENTS_PATH = path.join(ROOT, "src/data/weekly-events.ts");
const moduleCache = new Map();

function transpileTs(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const result = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: filePath,
  });
  return result.outputText;
}

function runCommonJs(code, filePath, requireImpl) {
  const module = { exports: {} };
  const context = vm.createContext({
    console,
    exports: module.exports,
    module,
    require: requireImpl,
    __filename: filePath,
    __dirname: path.dirname(filePath),
    Intl,
    Date,
    Math,
    JSON,
    String,
    Number,
    Boolean,
    Array,
    Object,
    RegExp,
    Set,
    Map,
  });
  vm.runInContext(code, context, { filename: filePath });
  return module.exports;
}

function resolveLocalModule(specifier, fromFilePath) {
  const basePath = specifier.startsWith("@/")
    ? path.join(ROOT, "src", specifier.slice(2))
    : specifier.startsWith(".")
      ? path.resolve(path.dirname(fromFilePath), specifier)
      : null;

  if (!basePath) {
    return null;
  }

  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.json`,
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.tsx"),
    path.join(basePath, "index.json"),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) ?? null;
}

function loadLocalModule(filePath) {
  if (moduleCache.has(filePath)) {
    return moduleCache.get(filePath);
  }

  if (filePath.endsWith(".json")) {
    const jsonExports = JSON.parse(fs.readFileSync(filePath, "utf8"));
    moduleCache.set(filePath, jsonExports);
    return jsonExports;
  }

  const exports = runCommonJs(transpileTs(filePath), filePath, (specifier) => {
    const resolved = resolveLocalModule(specifier, filePath);
    if (resolved) {
      return loadLocalModule(resolved);
    }
    throw new Error(`Unexpected require from ${path.relative(ROOT, filePath)}: ${specifier}`);
  });

  moduleCache.set(filePath, exports);
  return exports;
}

function sqlString(value) {
  if (value === null || value === undefined) {
    return "null";
  }
  return `'${String(value).replace(/'/g, "''")}'`;
}

function normalizeFilterValue(value) {
  return String(value ?? "").trim().toLowerCase();
}

function splitFilterValues(value) {
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function addFilterValue(filters, key, value) {
  for (const item of splitFilterValues(value)) {
    filters[key].push(item);
  }
}

export function parseWeeklyEventArgs(argv) {
  const filters = {
    cities: [],
    ids: [],
    weeks: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const [rawKey, inlineValue] = arg.includes("=") ? arg.split(/=(.*)/s, 2) : [arg, undefined];

    if (rawKey === "--all") {
      continue;
    }

    const keyMap = {
      "--city": "cities",
      "--id": "ids",
      "--week": "weeks",
    };
    const filterKey = keyMap[rawKey];

    if (!filterKey) {
      throw new Error(`Unknown weekly event option: ${arg}`);
    }

    const value = inlineValue ?? argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${rawKey}`);
    }

    addFilterValue(filters, filterKey, value);
    if (inlineValue === undefined) {
      index += 1;
    }
  }

  return filters;
}

export function hasWeeklyEventFilters(filters) {
  return Object.values(filters).some((values) => values.length > 0);
}

export function describeWeeklyEventFilters(filters) {
  if (!hasWeeklyEventFilters(filters)) {
    return "all weekly event guides";
  }

  return [
    filters.cities.length ? `cities: ${filters.cities.join(", ")}` : null,
    filters.ids.length ? `ids: ${filters.ids.join(", ")}` : null,
    filters.weeks.length ? `weeks: ${filters.weeks.join(", ")}` : null,
  ]
    .filter(Boolean)
    .join("; ");
}

export function loadWeeklyEventRuns() {
  const weeklyEventsExports = loadLocalModule(WEEKLY_EVENTS_PATH);
  const runs = weeklyEventsExports.weeklyCityEventRuns;

  if (!Array.isArray(runs)) {
    throw new Error("Expected src/data/weekly-events.ts to export weeklyCityEventRuns.");
  }

  return runs;
}

export function loadWeeklyEventGuideRecords() {
  const weeklyEventsExports = loadLocalModule(WEEKLY_EVENTS_PATH);
  const runs = weeklyEventsExports.weeklyCityEventRuns;
  const toGuide = weeklyEventsExports.weeklyEventToGuideList;

  if (!Array.isArray(runs) || typeof toGuide !== "function") {
    throw new Error("Expected weeklyCityEventRuns and weeklyEventToGuideList exports.");
  }

  return runs.flatMap((run) =>
    run.events.map((event) => {
      const guide = toGuide(event, run);
      return {
        id: guide.id,
        cityId: run.cityId,
        cityName: run.cityName,
        country: guide.location?.country ?? null,
        continent: guide.location?.continent ?? null,
        weekLabel: run.weekLabel,
        sourcedAt: run.sourcedAt,
        timezone: run.timezone,
        refreshCadence: run.refreshCadence,
        eventId: event.id,
        eventTitle: event.title,
        startsAt: event.startsAt,
        endsAt: event.endsAt ?? null,
        isGuideWorthy: Boolean(event.isGuideWorthy),
        guide,
        rawEvent: event,
        sourceRun: run,
      };
    }),
  );
}

export function filterWeeklyEventRecords(records, filters) {
  const citySet = new Set(filters.cities.map(normalizeFilterValue));
  const idSet = new Set(filters.ids.map(normalizeFilterValue));
  const weekSet = new Set(filters.weeks.map(normalizeFilterValue));

  return records.filter((record) => {
    if (citySet.size && !citySet.has(normalizeFilterValue(record.cityId)) && !citySet.has(normalizeFilterValue(record.cityName))) {
      return false;
    }
    if (idSet.size && !idSet.has(normalizeFilterValue(record.id)) && !idSet.has(normalizeFilterValue(record.eventId))) {
      return false;
    }
    if (weekSet.size && !weekSet.has(normalizeFilterValue(record.weekLabel))) {
      return false;
    }
    return true;
  });
}

export function buildWeeklyEventGuidesSchemaSql() {
  return `create table if not exists public.weekly_event_guides (
  id text primary key,
  city_id text not null,
  city_name text not null,
  country text,
  continent text,
  week_label text not null,
  sourced_at date not null,
  timezone text not null,
  refresh_cadence text not null default 'weekly',
  event_id text not null,
  event_title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  is_guide_worthy boolean not null default false,
  guide jsonb not null,
  raw_event jsonb not null,
  source_run jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.weekly_event_guides enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  create trigger weekly_event_guides_set_updated_at
  before update on public.weekly_event_guides
  for each row
  execute function public.set_updated_at();
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Weekly event guides are readable"
  on public.weekly_event_guides
  for select
  using (true);
exception
  when duplicate_object then null;
end;
$$;

create index if not exists weekly_event_guides_city_week_idx on public.weekly_event_guides (city_id, sourced_at desc);
create index if not exists weekly_event_guides_starts_at_idx on public.weekly_event_guides (starts_at);
create index if not exists weekly_event_guides_guide_gin_idx on public.weekly_event_guides using gin (guide);`;
}

export function buildWeeklyEventGuidesInsertSql(records) {
  if (!records.length) {
    return "-- No weekly event guides selected.";
  }

  const rows = records
    .map((record) => {
      const guideJson = JSON.stringify(record.guide).replace(/'/g, "''");
      const rawJson = JSON.stringify(record.rawEvent).replace(/'/g, "''");
      const runJson = JSON.stringify(record.sourceRun).replace(/'/g, "''");
      return `  (${sqlString(record.id)}, ${sqlString(record.cityId)}, ${sqlString(record.cityName)}, ${sqlString(record.country)}, ${sqlString(record.continent)}, ${sqlString(record.weekLabel)}, ${sqlString(record.sourcedAt)}::date, ${sqlString(record.timezone)}, ${sqlString(record.refreshCadence)}, ${sqlString(record.eventId)}, ${sqlString(record.eventTitle)}, ${sqlString(record.startsAt)}::timestamptz, ${sqlString(record.endsAt)}::timestamptz, ${record.isGuideWorthy ? "true" : "false"}, '${guideJson}'::jsonb, '${rawJson}'::jsonb, '${runJson}'::jsonb)`;
    })
    .join(",\n");

  return `insert into public.weekly_event_guides (
  id,
  city_id,
  city_name,
  country,
  continent,
  week_label,
  sourced_at,
  timezone,
  refresh_cadence,
  event_id,
  event_title,
  starts_at,
  ends_at,
  is_guide_worthy,
  guide,
  raw_event,
  source_run
)
values
${rows}
on conflict (id) do update set
  city_id = excluded.city_id,
  city_name = excluded.city_name,
  country = excluded.country,
  continent = excluded.continent,
  week_label = excluded.week_label,
  sourced_at = excluded.sourced_at,
  timezone = excluded.timezone,
  refresh_cadence = excluded.refresh_cadence,
  event_id = excluded.event_id,
  event_title = excluded.event_title,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  is_guide_worthy = excluded.is_guide_worthy,
  guide = excluded.guide,
  raw_event = excluded.raw_event,
  source_run = excluded.source_run;`;
}

export function buildWeeklyEventGuidesSql(records, { includeSchema = true } = {}) {
  const sections = [];

  if (includeSchema) {
    sections.push(buildWeeklyEventGuidesSchemaSql());
  }

  sections.push(buildWeeklyEventGuidesInsertSql(records));

  return `-- Generated by scripts/export-weekly-events-sql.mjs
-- Canonical seed for R Guide weekly event guides.

${sections.join("\n\n")}
`;
}
