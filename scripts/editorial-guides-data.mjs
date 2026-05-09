import fs from "fs";
import path from "path";
import vm from "vm";
import ts from "typescript";

const ROOT = process.cwd();
const LISTS_PATH = path.join(ROOT, "src/data/lists.ts");
const moduleCache = new Map();
const VALID_CATEGORIES = new Set(["Food", "Nightlife", "Nature", "Culture", "Stay", "Activities", "Itineraries"]);

function slugify(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeCoordinates(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    return null;
  }

  const lat = Number(coordinates[0]);
  const lng = Number(coordinates[1]);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return [Number(lat.toFixed(6)), Number(lng.toFixed(6))];
}

function buildPoiId(list, stop) {
  const location = list.location ?? {};
  const parts = [
    "poi",
    location.country,
    location.city,
    stop.name,
  ]
    .map(slugify)
    .filter(Boolean);

  return parts.join("-");
}

function visitStops(list, callback, stops = list.stops ?? []) {
  for (const stop of stops) {
    callback(stop, list);
    if (Array.isArray(stop.places)) {
      visitStops(list, callback, stop.places);
    }
  }
}

function cloneStopWithPoi(stop, list, poiById) {
  const poiId = stop.poiId || buildPoiId(list, stop);
  const poi = poiById.get(poiId);
  const nextStop = {
    ...stop,
    poiId,
    photo: poi?.photo || stop.photo,
  };

  if (Array.isArray(stop.places)) {
    nextStop.places = stop.places.map((place) => cloneStopWithPoi(place, list, poiById));
  }

  return nextStop;
}

export function collectEditorialPois(lists) {
  const poiById = new Map();

  for (const list of lists) {
    visitStops(list, (stop) => {
      const poiId = stop.poiId || buildPoiId(list, stop);
      const existing = poiById.get(poiId);
      const coordinates = normalizeCoordinates(stop.coordinates);
      const guideIds = new Set(existing?.guideIds ?? []);
      guideIds.add(list.id);
      const categories = new Set(existing?.categories ?? []);
      categories.add(list.category);
      const slugs = new Set(existing?.guideSlugs ?? []);
      slugs.add(list.slug);

      poiById.set(poiId, {
        id: poiId,
        name: existing?.name || stop.name,
        country: existing?.country || list.location?.country || null,
        city: existing?.city || list.location?.city || null,
        neighborhood: existing?.neighborhood || list.location?.neighborhood || null,
        coordinates: existing?.coordinates || coordinates,
        photo: existing?.photo || stop.photo || null,
        guideIds,
        guideSlugs: slugs,
        categories,
      });
    });
  }

  return [...poiById.values()]
    .map((poi) => ({
      ...poi,
      guideIds: [...poi.guideIds].sort(),
      guideSlugs: [...poi.guideSlugs].sort(),
      categories: [...poi.categories].sort(),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function addPoiReferencesToGuides(lists, pois = collectEditorialPois(lists)) {
  const poiById = new Map(pois.map((poi) => [poi.id, poi]));

  return lists.map((list) => ({
    ...list,
    stops: (list.stops ?? []).map((stop) => cloneStopWithPoi(stop, list, poiById)),
  }));
}

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

  return (
    candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) ??
    null
  );
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

export function parseEditorialGuideArgs(argv) {
  const filters = {
    countries: [],
    cities: [],
    neighborhoods: [],
    ids: [],
    slugs: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const [rawKey, inlineValue] = arg.includes("=") ? arg.split(/=(.*)/s, 2) : [arg, undefined];

    if (rawKey === "--all") {
      continue;
    }

    const keyMap = {
      "--country": "countries",
      "--city": "cities",
      "--neighborhood": "neighborhoods",
      "--id": "ids",
      "--slug": "slugs",
    };
    const filterKey = keyMap[rawKey];

    if (!filterKey) {
      throw new Error(`Unknown editorial guide option: ${arg}`);
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

export function hasEditorialGuideFilters(filters) {
  return Object.values(filters).some((values) => values.length > 0);
}

export function describeEditorialGuideFilters(filters) {
  if (!hasEditorialGuideFilters(filters)) {
    return "all editorial guides";
  }

  return [
    filters.countries.length ? `countries: ${filters.countries.join(", ")}` : null,
    filters.cities.length ? `cities: ${filters.cities.join(", ")}` : null,
    filters.neighborhoods.length ? `neighborhoods: ${filters.neighborhoods.join(", ")}` : null,
    filters.ids.length ? `ids: ${filters.ids.join(", ")}` : null,
    filters.slugs.length ? `slugs: ${filters.slugs.join(", ")}` : null,
  ]
    .filter(Boolean)
    .join("; ");
}

export function filterEditorialGuides(lists, filters) {
  const countrySet = new Set(filters.countries.map(normalizeFilterValue));
  const citySet = new Set(filters.cities.map(normalizeFilterValue));
  const neighborhoodSet = new Set(filters.neighborhoods.map(normalizeFilterValue));
  const idSet = new Set(filters.ids.map(normalizeFilterValue));
  const slugSet = new Set(filters.slugs.map(normalizeFilterValue));

  return lists.filter((list) => {
    if (countrySet.size && !countrySet.has(normalizeFilterValue(list.location?.country))) {
      return false;
    }
    if (citySet.size && !citySet.has(normalizeFilterValue(list.location?.city))) {
      return false;
    }
    if (neighborhoodSet.size && !neighborhoodSet.has(normalizeFilterValue(list.location?.neighborhood))) {
      return false;
    }
    if (idSet.size && !idSet.has(normalizeFilterValue(list.id))) {
      return false;
    }
    if (slugSet.size && !slugSet.has(normalizeFilterValue(list.slug))) {
      return false;
    }
    return true;
  });
}

function collectDuplicates(lists, key) {
  const seen = new Map();
  const duplicates = [];

  for (const list of lists) {
    const value = list[key];
    if (!value) {
      continue;
    }
    const first = seen.get(value);
    if (first) {
      duplicates.push(`${value} (${first.id}, ${list.id})`);
      continue;
    }
    seen.set(value, list);
  }

  return duplicates;
}

export function validateEditorialGuides(lists) {
  const errors = [];

  for (const list of lists) {
    const label = list?.id || list?.slug || "<unknown guide>";

    if (!list?.id?.trim()) {
      errors.push(`${label}: missing id`);
    }
    if (!list?.slug?.trim()) {
      errors.push(`${label}: missing slug`);
    }
    if (!VALID_CATEGORIES.has(list?.category)) {
      errors.push(`${label}: invalid category ${JSON.stringify(list?.category)}`);
    }
    if (!list?.location?.country?.trim()) {
      errors.push(`${label}: missing location.country`);
    }
    if (list?.location?.scope === "city" && !list?.location?.city?.trim()) {
      errors.push(`${label}: city-scoped guide is missing location.city`);
    }
    if (!Array.isArray(list?.stops)) {
      errors.push(`${label}: stops must be an array`);
    }
  }

  for (const duplicate of collectDuplicates(lists, "id")) {
    errors.push(`duplicate id: ${duplicate}`);
  }
  for (const duplicate of collectDuplicates(lists, "slug")) {
    errors.push(`duplicate slug: ${duplicate}`);
  }

  return errors;
}

export function assertValidEditorialGuides(lists) {
  const errors = validateEditorialGuides(lists);
  if (errors.length) {
    throw new Error(`Editorial guide validation failed:\n${errors.map((error) => `- ${error}`).join("\n")}`);
  }
}

export function loadEditorialGuideLists() {
  const listsExports = loadLocalModule(LISTS_PATH);
  const mapLists = listsExports.mapLists;

  if (!Array.isArray(mapLists)) {
    throw new Error("Expected src/data/lists.ts to export mapLists.");
  }

  assertValidEditorialGuides(mapLists);
  return mapLists;
}

function sqlString(value) {
  if (value === null || value === undefined) {
    return "null";
  }
  return `'${String(value).replace(/'/g, "''")}'`;
}

export function buildEditorialGuidesSchemaSql() {
  return `create table if not exists public.editorial_guides (
  id text primary key,
  slug text not null unique,
  category text not null,
  country text not null,
  city text,
  neighborhood text,
  list jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.editorial_guides enable row level security;

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
  create trigger editorial_guides_set_updated_at
  before update on public.editorial_guides
  for each row
  execute function public.set_updated_at();
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Editorial guides are readable"
  on public.editorial_guides
  for select
  using (true);
exception
  when duplicate_object then null;
end;
$$;

create index if not exists editorial_guides_category_idx on public.editorial_guides (category);
create index if not exists editorial_guides_country_city_idx on public.editorial_guides (country, city);
create index if not exists editorial_guides_neighborhood_idx on public.editorial_guides (neighborhood);
create index if not exists editorial_guides_list_gin_idx on public.editorial_guides using gin (list);`;
}

export function buildEditorialPoisSchemaSql() {
  return `create table if not exists public.editorial_pois (
  id text primary key,
  name text not null,
  country text,
  city text,
  neighborhood text,
  coordinates jsonb,
  photo text,
  guide_ids text[] not null default '{}',
  guide_slugs text[] not null default '{}',
  categories text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.editorial_pois enable row level security;

do $$
begin
  create trigger editorial_pois_set_updated_at
  before update on public.editorial_pois
  for each row
  execute function public.set_updated_at();
exception
  when duplicate_object then null;
end;
$$;

do $$
begin
  create policy "Editorial POIs are readable"
  on public.editorial_pois
  for select
  using (true);
exception
  when duplicate_object then null;
end;
$$;

create index if not exists editorial_pois_country_city_idx on public.editorial_pois (country, city);
create index if not exists editorial_pois_name_idx on public.editorial_pois (name);
create index if not exists editorial_pois_categories_gin_idx on public.editorial_pois using gin (categories);`;
}

function sqlTextArray(values) {
  const items = (values ?? []).map((value) => `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`);
  return `'{${items.join(",")}}'`;
}

export function buildEditorialPoisInsertSql(pois) {
  if (!pois.length) {
    return "-- No editorial POIs selected.";
  }

  const rows = pois
    .map((poi) => {
      const coordinates = poi.coordinates ? `'${JSON.stringify(poi.coordinates).replace(/'/g, "''")}'::jsonb` : "null";
      return `  (${sqlString(poi.id)}, ${sqlString(poi.name)}, ${sqlString(poi.country)}, ${sqlString(poi.city)}, ${sqlString(poi.neighborhood)}, ${coordinates}, ${sqlString(poi.photo)}, ${sqlTextArray(poi.guideIds)}, ${sqlTextArray(poi.guideSlugs)}, ${sqlTextArray(poi.categories)})`;
    })
    .join(",\n");

  return `insert into public.editorial_pois (
  id,
  name,
  country,
  city,
  neighborhood,
  coordinates,
  photo,
  guide_ids,
  guide_slugs,
  categories
)
values
${rows}
on conflict (id) do update set
  name = excluded.name,
  country = excluded.country,
  city = excluded.city,
  neighborhood = excluded.neighborhood,
  coordinates = excluded.coordinates,
  photo = coalesce(excluded.photo, public.editorial_pois.photo),
  guide_ids = excluded.guide_ids,
  guide_slugs = excluded.guide_slugs,
  categories = excluded.categories;`;
}

export function buildEditorialGuidesInsertSql(lists) {
  const pois = collectEditorialPois(lists);
  const guidesWithPoiReferences = addPoiReferencesToGuides(lists, pois);

  assertValidEditorialGuides(guidesWithPoiReferences);

  if (!guidesWithPoiReferences.length) {
    return "-- No editorial guides selected.";
  }

  const rows = guidesWithPoiReferences
    .map((list) => {
      const json = JSON.stringify(list).replace(/'/g, "''");
      return `  (${sqlString(list.id)}, ${sqlString(list.slug)}, ${sqlString(list.category)}, ${sqlString(list.location.country)}, ${sqlString(list.location.city)}, ${sqlString(list.location.neighborhood)}, '${json}'::jsonb)`;
    })
    .join(",\n");

  return `insert into public.editorial_guides (
  id,
  slug,
  category,
  country,
  city,
  neighborhood,
  list
)
values
${rows}
on conflict (id) do update set
  slug = excluded.slug,
  category = excluded.category,
  country = excluded.country,
  city = excluded.city,
  neighborhood = excluded.neighborhood,
  list = excluded.list;`;
}

export function buildEditorialGuidesSql(lists, { includeSchema = true } = {}) {
  const sections = [];
  const pois = collectEditorialPois(lists);

  if (includeSchema) {
    sections.push(buildEditorialGuidesSchemaSql());
    sections.push(buildEditorialPoisSchemaSql());
  }

  sections.push(buildEditorialPoisInsertSql(pois));
  sections.push(buildEditorialGuidesInsertSql(lists));

  return `-- Generated by scripts/export-editorial-guides-sql.mjs
-- Canonical seed for R Guide editorial lists.

${sections.join("\n\n")}
`;
}
