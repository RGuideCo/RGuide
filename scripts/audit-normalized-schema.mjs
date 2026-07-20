import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import pg from "pg";
import { getPgSslConfig } from "./database-ssl.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STRICT = process.argv.includes("--strict");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;

    const separator = trimmed.indexOf("=");
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (!key || process.env[key] !== undefined) continue;
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function getDatabaseUrl() {
  return process.env.SUPABASE_DB_URL ?? process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL ?? null;
}

function report(label, rows, severity, issues) {
  if (!rows.length) return;
  issues.push({ label, rows, severity });
  console.log(`\n${severity.toUpperCase()}: ${label} (${rows.length})`);
  for (const row of rows.slice(0, 20)) console.log(`- ${JSON.stringify(row)}`);
  if (rows.length > 20) console.log(`- ... ${rows.length - 20} more`);
}

async function main() {
  loadEnvFile(path.join(ROOT, ".env.local"));
  loadEnvFile(path.join(ROOT, ".env"));

  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) throw new Error("Set SUPABASE_DB_URL, SUPABASE_DATABASE_URL, or DATABASE_URL.");

  const client = new pg.Client({ connectionString: databaseUrl, ssl: getPgSslConfig(databaseUrl) });
  await client.connect();

  const issues = [];
  try {
    const checks = [];
    for (const query of [
      `
        select c.relname table_name
        from pg_class c join pg_namespace n on n.oid=c.relnamespace
        where n.nspname='public' and c.relkind in ('r','p')
          and c.relname <> 'spatial_ref_sys' and not c.relrowsecurity
        order by c.relname
      `,
      `
        select c.relname view_name
        from pg_class c join pg_namespace n on n.oid=c.relnamespace
        where n.nspname='public' and c.relkind='v'
          and c.relname not in ('geometry_columns','geography_columns')
          and not ('security_invoker=true'=any(coalesce(c.reloptions,'{}'::text[])))
        order by c.relname
      `,
      `
        with fk as (
          select c.oid table_oid,c.relname table_name,con.conname,con.conkey
          from pg_constraint con join pg_class c on c.oid=con.conrelid
          join pg_namespace n on n.oid=c.relnamespace
          where n.nspname='public' and con.contype='f'
        )
        select table_name,conname
        from fk
        where not exists (
          select 1 from pg_index i
          where i.indrelid=fk.table_oid and i.indisvalid
            and (i.indkey::smallint[])[0:cardinality(fk.conkey)-1] @> fk.conkey
        )
        order by table_name,conname
      `,
      `
        select child.id,child.name,child.scope,parent.name parent_name,parent.scope parent_scope
        from public.destinations child
        left join public.destinations parent on parent.id=child.parent_id
        where (child.scope='continent' and child.parent_id is not null)
           or (child.scope<>'continent' and child.parent_id is null)
           or (child.scope='country' and parent.scope not in ('continent','region'))
           or (child.scope='region' and parent.scope not in ('continent','country','region'))
           or (child.scope='state' and parent.scope not in ('country','region'))
           or (child.scope='city' and parent.scope not in ('country','region','state'))
           or (child.scope='neighborhood' and parent.scope not in ('city','neighborhood'))
        order by child.scope,child.name
      `,
      `
        select regexp_replace(source.url,'/+$','') canonical_url,count(*) copies
        from public.sources source
        group by regexp_replace(source.url,'/+$','')
        having count(*)>1
      `,
      `
        select venue.id,venue.name,tag.slug
        from public.venues venue
        join public.venue_tags tag on tag.slug=any(venue.attribute_tags) and tag.is_active
        where not exists (
          select 1 from public.venue_taggings tagging
          where tagging.venue_id=venue.id and tagging.tag_id=tag.id
        )
        order by venue.name,tag.slug
      `,
      `
        select entry.id,entry.legacy_id,entry.title
        from public.entries entry
        where entry.status='published' and not exists (
          select 1 from public.entry_render_cache cache
          where cache.entry_id=entry.id and cache.render_format='maplist'
            and cache.render_version=1 and cache.is_current
        )
        order by entry.title
      `,
      `
        select destination.id,destination.name,destination.scope
        from public.destinations destination
        where destination.is_published and not exists (
          select 1 from public.destination_descriptions_v2 description
          where description.destination_id=destination.id
            and description.locale='en' and description.description_kind='overview'
        )
        order by destination.scope,destination.name
      `,
      `
        select venue.id,venue.name
        from public.venues venue
        where venue.merged_into_venue_id is null
          and venue.venue_kind not in ('event_venue','other','transport','service')
          and nullif(btrim(venue.hours_note),'') is null
          and not exists (
            select 1 from public.venue_hours hours
            where hours.venue_id=venue.id and (hours.valid_to is null or hours.valid_to>=current_date)
          )
        order by venue.name
      `,
      `
        select venue.id,venue.name,coalesce(media.public_url,media.url) photo_url
        from public.venues venue join public.venue_media media on media.id=venue.primary_photo_id
        where venue.merged_into_venue_id is null
          and coalesce(media.public_url,media.url) not like 'https://media.rguide.co/%'
        order by venue.name
      `,
      `
        select relation::text table_name,role_name,privilege_type
        from (
          values
            ('public.editorial_pois'::regclass,'anon','SELECT'),
            ('public.editorial_pois'::regclass,'authenticated','SELECT'),
            ('public.event_source_runs'::regclass,'anon','SELECT'),
            ('public.event_source_runs'::regclass,'authenticated','SELECT'),
            ('public.event_discovery_sources'::regclass,'anon','SELECT'),
            ('public.event_discovery_sources'::regclass,'authenticated','SELECT'),
            ('public.external_api_usage_events'::regclass,'anon','SELECT'),
            ('public.external_api_usage_events'::regclass,'authenticated','SELECT'),
            ('public.venue_external_refs'::regclass,'anon','SELECT'),
            ('public.venue_external_refs'::regclass,'authenticated','SELECT')
        ) expected(relation,role_name,privilege_type)
        where has_table_privilege(role_name,relation,privilege_type)
      `,
      `
        select entry.id,entry.legacy_id,entry.title
        from public.entries entry
        where entry.submission_type='event'
          and entry.status='published'
          and entry.event_id is null
        order by entry.title
      `,
      `
        select entry.legacy_id entry_id,stop.legacy_id stop_id,stop.name
        from public.entries entry
        join public.entry_stops stop on stop.entry_id=entry.id
        left join public.event_occurrences occurrence on occurrence.id=stop.event_occurrence_id
        where entry.submission_type='event'
          and entry.status='published'
          and (
            stop.event_id is distinct from entry.event_id
            or occurrence.event_id is distinct from entry.event_id
            or (
              stop.event_occurrence_id is null
              and exists(select 1 from public.event_occurrences expected where expected.event_id=entry.event_id)
            )
          )
        order by entry.legacy_id,stop.stop_order
      `,
      `
        select occurrence.id,occurrence.legacy_id,occurrence.title
        from public.event_occurrences occurrence
        where occurrence.activation_id is null
        order by occurrence.legacy_id
      `,
      `
        select distinct venue.id,venue.name,entry.legacy_id entry_id
        from public.entries entry
        join public.entry_stops stop on stop.entry_id=entry.id
        join public.venues venue on venue.id=stop.venue_id
        join public.event_occurrences occurrence on occurrence.id=stop.event_occurrence_id
        where entry.submission_type='event'
          and stop.venue_id is distinct from occurrence.venue_id
          and lower(venue.name)=lower(stop.name)
        order by entry.legacy_id,venue.name
      `,
      `
        select media.id,event.legacy_id,coalesce(media.public_url,media.url) photo_url
        from public.event_media media
        join public.events event on event.id=media.event_id
        where media.is_active
          and coalesce(media.public_url,media.url) not like 'https://media.rguide.co/%'
        order by event.legacy_id,media.sort_order
      `,
      `
        select tablename,role_name,cmd,count(*) policies
        from pg_policies policy
        cross join lateral unnest(policy.roles) role_name
        where schemaname='public'
        group by tablename,role_name,cmd
        having count(*)>1
        order by tablename,role_name,cmd
      `,
      `
        with sourceable as (
          select 'event' entity_type,event.id entity_id,event.title
          from public.events event where event.status='published'
          union all
          select 'event_activation',activation.id,activation.title
          from public.event_activations activation
          join public.events event on event.id=activation.event_id
          where event.status='published'
          union all
          select 'event_occurrence',occurrence.id,occurrence.title
          from public.event_occurrences occurrence
          join public.events event on event.id=occurrence.event_id
          where event.status='published'
        )
        select sourceable.*
        from sourceable
        where not exists (
          select 1 from public.entity_sources link
          where link.entity_type::text=sourceable.entity_type
            and link.entity_id=sourceable.entity_id
        )
        order by sourceable.entity_type,sourceable.title
      `,
    ]) {
      checks.push(await client.query(query));
    }

    report("public tables without RLS", checks[0].rows, "error", issues);
    report("public views without security_invoker", checks[1].rows, "error", issues);
    report("foreign keys without covering indexes", checks[2].rows, "error", issues);
    report("invalid destination hierarchy", checks[3].rows, "error", issues);
    report("duplicate source URLs", checks[4].rows, "error", issues);
    report("known venue tags missing normalized taggings", checks[5].rows, "error", issues);
    report("published entries missing current render cache", checks[6].rows, "error", issues);
    report("published destinations missing canonical descriptions", checks[7].rows, "warning", issues);
    report("active venues missing canonical hours", checks[8].rows, "warning", issues);
    report("primary venue photos still hotlinked", checks[9].rows, "warning", issues);
    report("internal tables exposed to API roles", checks[10].rows, "error", issues);
    report("published event entries missing canonical events", checks[11].rows, "error", issues);
    report("event card stops missing canonical occurrence links", checks[12].rows, "error", issues);
    report("event occurrences missing canonical activations", checks[13].rows, "error", issues);
    report("event schedule items incorrectly stored as venues", checks[14].rows, "error", issues);
    report("event media still hotlinked", checks[15].rows, "warning", issues);
    report("duplicate permissive API policies", checks[16].rows, "error", issues);
    report("published event records missing source attribution", checks[17].rows, "error", issues);

    const errors = issues.filter((issue) => issue.severity === "error").reduce((sum, issue) => sum + issue.rows.length, 0);
    const warnings = issues.filter((issue) => issue.severity === "warning").reduce((sum, issue) => sum + issue.rows.length, 0);
    console.log(`\nSchema audit: ${errors ? "FAIL" : "PASS"} | errors=${errors} warnings=${warnings} strict=${STRICT}`);
    if (errors || (STRICT && warnings)) process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(`Schema audit failed: ${error.message}`);
  process.exitCode = 1;
});
