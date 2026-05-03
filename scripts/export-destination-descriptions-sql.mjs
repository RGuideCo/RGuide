import { createRequire } from "module";
import fs from "fs";
import path from "path";
import vm from "vm";
import ts from "typescript";

const ROOT = process.cwd();
const GEOGRAPHY_PATH = path.join(ROOT, "src/data/geography.ts");
const UTILS_PATH = path.join(ROOT, "src/lib/utils.ts");
const OUTPUT_PATH = path.join(ROOT, "supabase/destination-descriptions.sql");
const nodeRequire = createRequire(import.meta.url);

function transpileTs(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const result = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
      resolveJsonModule: true,
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

const utilsExports = runCommonJs(transpileTs(UTILS_PATH), UTILS_PATH, (specifier) => {
  if (specifier === "clsx") {
    return nodeRequire("clsx");
  }
  throw new Error(`Unexpected require from utils.ts: ${specifier}`);
});

const geographyExports = runCommonJs(transpileTs(GEOGRAPHY_PATH), GEOGRAPHY_PATH, (specifier) => {
  if (specifier === "countries-list") {
    return nodeRequire("countries-list");
  }
  if (specifier === "@/lib/utils") {
    return utilsExports;
  }
  if (specifier === "@/types") {
    return {};
  }
  if (specifier.startsWith("@/data/")) {
    return nodeRequire(path.join(ROOT, "src/data", specifier.slice("@/data/".length)));
  }
  throw new Error(`Unexpected require from geography.ts: ${specifier}`);
});

const continents = geographyExports.continents;
if (!Array.isArray(continents)) {
  throw new Error("Expected src/data/geography.ts to export continents.");
}

function descriptionId(...parts) {
  return parts.filter(Boolean).join(":");
}

function collectSubareaDescriptions(subareas, context) {
  return (subareas ?? []).flatMap((subarea) => {
    const id =
      context.type === "neighborhood"
        ? descriptionId("neighborhood", context.countryId, context.cityId, context.parentId, subarea.id)
        : descriptionId("region", context.countryId, context.parentId, subarea.id);
    const current = subarea.description?.trim()
      ? [
          {
            id,
            entity_type: context.type,
            entity_id: subarea.id,
            parent_entity_id: context.parentId,
            continent: context.continent,
            country: context.country,
            city: context.city,
            name: subarea.name,
            description: subarea.description.trim(),
          },
        ]
      : [];
    return [
      ...current,
      ...collectSubareaDescriptions(subarea.subareas, {
        ...context,
        parentId: subarea.id,
      }),
    ];
  });
}

function collectDestinationDescriptions() {
  return continents.flatMap((continent) =>
    continent.countries.flatMap((country) => [
      {
        id: descriptionId("country", country.id),
        entity_type: "country",
        entity_id: country.id,
        parent_entity_id: continent.id,
        continent: continent.name,
        country: country.name,
        city: null,
        name: country.name,
        description: country.description,
      },
      ...collectSubareaDescriptions(country.subareas, {
        type: "region",
        parentId: country.id,
        countryId: country.id,
        continent: continent.name,
        country: country.name,
        city: null,
      }),
      ...(country.states ?? []).map((state) => ({
        id: descriptionId("state", country.id, state.id),
        entity_type: "state",
        entity_id: state.id,
        parent_entity_id: state.countrySubareaId,
        continent: continent.name,
        country: country.name,
        city: null,
        name: state.name,
        description: state.description ?? "",
      })),
      ...country.cities.flatMap((city) => [
        {
          id: descriptionId("city", country.id, city.id),
          entity_type: "city",
          entity_id: city.id,
          parent_entity_id: city.stateId ?? city.countrySubareaId ?? country.id,
          continent: continent.name,
          country: country.name,
          city: city.name,
          name: city.name,
          description: city.description,
        },
        ...collectSubareaDescriptions(city.subareas, {
          type: "neighborhood",
          parentId: city.id,
          countryId: country.id,
          cityId: city.id,
          continent: continent.name,
          country: country.name,
          city: city.name,
        }),
      ]),
    ]),
  );
}

function sqlString(value) {
  if (value === null || value === undefined) {
    return "null";
  }
  return `'${String(value).replace(/'/g, "''")}'`;
}

const rows = collectDestinationDescriptions()
  .filter((row) => row.description?.trim())
  .map(
    (row) =>
      `  (${sqlString(row.id)}, ${sqlString(row.entity_type)}, ${sqlString(row.entity_id)}, ${sqlString(row.parent_entity_id)}, ${sqlString(row.continent)}, ${sqlString(row.country)}, ${sqlString(row.city)}, ${sqlString(row.name)}, ${sqlString(row.description.trim())})`,
  )
  .join(",\n");

const sql = `-- Generated by scripts/export-destination-descriptions-sql.mjs
-- Canonical seed for R Guide destination metadata copy.

create table if not exists public.destination_descriptions (
  id text primary key,
  entity_type text not null check (entity_type in ('country', 'region', 'state', 'city', 'neighborhood')),
  entity_id text not null,
  parent_entity_id text,
  continent text,
  country text,
  city text,
  name text not null,
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.destination_descriptions enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists destination_descriptions_set_updated_at on public.destination_descriptions;

create trigger destination_descriptions_set_updated_at
before update on public.destination_descriptions
for each row
execute function public.set_updated_at();

drop policy if exists "Destination descriptions are readable" on public.destination_descriptions;

create policy "Destination descriptions are readable"
on public.destination_descriptions
for select
using (true);

create index if not exists destination_descriptions_entity_idx on public.destination_descriptions (entity_type, entity_id);
create index if not exists destination_descriptions_country_city_idx on public.destination_descriptions (country, city);
create index if not exists destination_descriptions_parent_idx on public.destination_descriptions (parent_entity_id);

insert into public.destination_descriptions (
  id,
  entity_type,
  entity_id,
  parent_entity_id,
  continent,
  country,
  city,
  name,
  description
)
values
${rows}
on conflict (id) do update set
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id,
  parent_entity_id = excluded.parent_entity_id,
  continent = excluded.continent,
  country = excluded.country,
  city = excluded.city,
  name = excluded.name,
  description = excluded.description;
`;

fs.writeFileSync(OUTPUT_PATH, sql);
console.log(`Exported ${rows ? rows.split("\n").length : 0} destination descriptions to ${path.relative(ROOT, OUTPUT_PATH)}`);
