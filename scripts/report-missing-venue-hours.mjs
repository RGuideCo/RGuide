import fs from "node:fs";
import process from "node:process";

import pg from "pg";

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

function getDatabaseUrl() {
  return process.env.SUPABASE_DB_URL ?? process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL ?? null;
}

const args = process.argv.slice(2);
const citySlug = args.find((arg) => !arg.startsWith("--")) ?? "paris";
const allCities = args.includes("--all");
const summaryOnly = args.includes("--summary");
const compactOnly = args.includes("--compact");
const renderedSummaryOnly = args.includes("--rendered-summary");
const renderedBadOnly = args.includes("--rendered-bad");

loadEnvFile(".env.local");
const databaseUrl = getDatabaseUrl();
if (!databaseUrl) throw new Error("Missing database URL");

const client = new pg.Client({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes("localhost") ? false : { rejectUnauthorized: false },
});

await client.connect();

if (renderedSummaryOnly) {
  const { rows } = await client.query(
    `
      with city as (
        select id, slug, name
        from public.destinations
        where scope = 'city'::public.destination_scope
          and ($2::boolean or slug = $1)
      ),
      selected_entries as (
        select e.id, e.category, city.slug as city_slug, city.name as city_name
        from public.entries e
        join city on city.id = e.city_id
        where e.status = 'published'::public.rguide_entry_status
          and e.submission_type <> 'event'::public.rguide_submission_type
      ),
      rendered_pois as (
        select
          entry.city_slug,
          entry.city_name,
          entry.category,
          poi ->> 'name' as name,
          case jsonb_typeof(poi -> 'hours')
            when 'string' then poi ->> 'hours'
            when 'object' then (
              select string_agg(value #>> '{}', ' ')
              from jsonb_each(poi -> 'hours')
            )
            else ''
          end as hours_text
        from selected_entries entry
        join public.entries_maplist view on view.id = entry.id
        cross join lateral jsonb_array_elements(coalesce(view.list -> 'stops', '[]'::jsonb)) as poi
      ),
      classified as (
        select
          city_slug,
          city_name,
          category,
          name,
          hours_text,
          nullif(btrim(hours_text), '') is null as is_missing,
          (
            hours_text ~* '(current-status evidence is map-based|open and active in the current source set|open and active|hours should be confirmed|verify current hours|verify official hours|confirm current hours|confirm before going|check current hours)'
            or (
              hours_text ~* '(hours?\\s+var(y|ies)|varies by|variable|subject to change|may change|can change|verify|confirm|check before|check current|current hours|same-day|generally|usually|typically)'
              and not (
                hours_text ~* '(official calendar|booking calendar|reservation page|booking page|property page|official site|official page|show calendar|event calendar|timetable|market day|market days|seasonal|season|weather|vendor|stall|performance schedule|exhibition page|timed ticket|last admission)'
                or (
                  hours_text ~* '(mon|monday|tue|tues|tuesday|wed|wednesday|thu|thur|thurs|thursday|fri|friday|sat|saturday|sun|sunday|daily|weekday|weekdays|weekend|weekends)'
                  and hours_text ~* '(\\d{1,2}(:\\d{2})?\\s*(am|pm)|\\d{1,2}:\\d{2}|closed)'
                )
                or hours_text ~* '(24\\s*hours?|open\\s+24)'
              )
            )
          ) as is_placeholder
        from rendered_pois
      )
      select
        city_slug,
        city_name,
        count(*)::int as rendered_pois,
        count(*) filter (where is_missing)::int as missing_hours,
        count(*) filter (where not is_missing and is_placeholder)::int as placeholder_hours,
        category
      from classified
      group by grouping sets ((city_slug, city_name, category), (city_slug, city_name))
      order by city_name, category nulls first
    `,
    [citySlug, allCities],
  );
  console.log(JSON.stringify(rows, null, 2));
  await client.end();
  process.exit(0);
}

if (renderedBadOnly) {
  const { rows } = await client.query(
    `
      with city as (
        select id, slug, name
        from public.destinations
        where scope = 'city'::public.destination_scope
          and ($2::boolean or slug = $1)
      ),
      selected_entries as (
        select e.id, e.slug as entry_slug, e.category, city.slug as city_slug, city.name as city_name
        from public.entries e
        join city on city.id = e.city_id
        where e.status = 'published'::public.rguide_entry_status
          and e.submission_type <> 'event'::public.rguide_submission_type
      ),
      rendered_pois as (
        select
          entry.city_slug,
          entry.city_name,
          entry.entry_slug,
          entry.category,
          poi ->> 'name' as name,
          poi ->> 'venueId' as venue_id,
          case jsonb_typeof(poi -> 'hours')
            when 'string' then poi ->> 'hours'
            when 'object' then (
              select string_agg(value #>> '{}', ' ')
              from jsonb_each(poi -> 'hours')
            )
            else ''
          end as hours_text
        from selected_entries entry
        join public.entries_maplist view on view.id = entry.id
        cross join lateral jsonb_array_elements(coalesce(view.list -> 'stops', '[]'::jsonb)) as poi
      ),
      classified as (
        select
          *,
          nullif(btrim(hours_text), '') is null as is_missing,
          (
            hours_text ~* '(current-status evidence is map-based|open and active in the current source set|open and active|hours should be confirmed|verify current hours|verify official hours|confirm current hours|confirm before going|check current hours)'
            or (
              hours_text ~* '(hours?\\s+var(y|ies)|varies by|variable|subject to change|may change|can change|verify|confirm|check before|check current|current hours|same-day|generally|usually|typically)'
              and not (
                hours_text ~* '(official calendar|booking calendar|reservation page|booking page|property page|official site|official page|show calendar|event calendar|timetable|market day|market days|seasonal|season|weather|vendor|stall|performance schedule|exhibition page|timed ticket|last admission)'
                or (
                  hours_text ~* '(mon|monday|tue|tues|tuesday|wed|wednesday|thu|thur|thurs|thursday|fri|friday|sat|saturday|sun|sunday|daily|weekday|weekdays|weekend|weekends)'
                  and hours_text ~* '(\\d{1,2}(:\\d{2})?\\s*(am|pm)|\\d{1,2}:\\d{2}|closed)'
                )
                or hours_text ~* '(24\\s*hours?|open\\s+24)'
              )
            )
          ) as is_placeholder
        from rendered_pois
      )
      select
        city_slug,
        city_name,
        category,
        entry_slug,
        name,
        venue_id,
        case when is_missing then 'missing' else 'placeholder' end as issue,
        hours_text
      from classified
      where is_missing or is_placeholder
      order by city_name, category, entry_slug, name
      limit 300
    `,
    [citySlug, allCities],
  );
  console.log(JSON.stringify(rows, null, 2));
  await client.end();
  process.exit(0);
}

const { rows: summaryRows } = await client.query(
  `
    with city as (
      select id
      from public.destinations
      where scope = 'city'::public.destination_scope
        and slug = $1
      limit 1
    ),
    city_entries as (
      select e.id, e.category
      from public.entries e
      where e.city_id = (select id from city)
        and e.status = 'published'::public.rguide_entry_status
    ),
    missing as (
      select ce.category, v.id as venue_id
      from public.entry_stops es
      join city_entries ce on ce.id = es.entry_id
      join public.venues v on v.id = es.venue_id
      where es.hours is null
        and nullif(v.hours_note, '') is null
        and not exists (
          select 1
          from public.venue_hours vh
          where vh.venue_id = v.id
        )
    )
    select
      count(*)::int as rendered_missing,
      count(distinct venue_id)::int as unique_venues,
      category
    from missing
    group by rollup(category)
    order by category nulls first
  `,
  [citySlug],
);

if (summaryOnly) {
  console.log(JSON.stringify(summaryRows, null, 2));
  await client.end();
  process.exit(0);
}

const { rows } = await client.query(
  `
    with city as (
      select id
      from public.destinations
      where scope = 'city'::public.destination_scope
        and slug = $1
      limit 1
    ),
    city_entries as (
      select e.id, e.title, e.slug, e.category
      from public.entries e
      where e.city_id = (select id from city)
        and e.status = 'published'::public.rguide_entry_status
    ),
    missing as (
      select
        v.id as venue_id,
        v.name,
        v.slug,
        v.venue_kind,
        v.official_url,
        v.coordinates,
        count(*)::int as rendered_count,
        count(distinct ce.id)::int as guide_count,
        array_agg(distinct ce.category order by ce.category) as categories,
        array_agg(distinct es.subcategory order by es.subcategory) filter (where es.subcategory is not null) as subcategories,
        array_agg(distinct ce.slug order by ce.slug) as guide_slugs
      from public.entry_stops es
      join city_entries ce on ce.id = es.entry_id
      join public.venues v on v.id = es.venue_id
      where es.hours is null
        and nullif(v.hours_note, '') is null
        and not exists (
          select 1
          from public.venue_hours vh
          where vh.venue_id = v.id
        )
      group by v.id
    )
    select *
    from missing
    order by rendered_count desc, name
    limit 120
  `,
  [citySlug],
);

if (compactOnly) {
  for (const row of rows) {
    console.log(
      [
        row.rendered_count,
        row.venue_kind,
        row.name,
        (row.categories ?? []).join("+"),
        (row.guide_slugs ?? []).join("|"),
      ].join(" :: "),
    );
  }
  await client.end();
  process.exit(0);
}

console.log(JSON.stringify(rows, null, 2));
await client.end();
