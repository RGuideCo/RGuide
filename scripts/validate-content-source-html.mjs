import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import pg from "pg";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

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

    const [key, ...valueParts] = trimmed.split("=");
    if (!key || process.env[key]) {
      continue;
    }

    process.env[key] = valueParts.join("=").replace(/^['"]|['"]$/g, "");
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

function normalizeHtmlText(value) {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, "\"")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function isStayGuide(guide) {
  const text = [guide.category, guide.title, guide.slug, guide.seoSlug, guide.description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return /\bstay\b|\bstays\b|\bhotel\b|\bhotels\b|\bhostel\b|\bhostels\b|where to stay/.test(text);
}

function validateSourceArchitecture() {
  const homeServerContent = read("src/components/home/HomeServerContent.tsx");
  const homePage = read("src/app/page.tsx");
  const cityPage = read("src/app/city/[...segments]/page.tsx");
  const splitScreen = read("src/components/home/SplitScreenSection.tsx");
  const appStore = read("src/store/app-store.ts");
  const proxy = read("src/proxy.ts");
  const destinationDescriptions = read("src/lib/destination-descriptions.ts");
  const normalizedEditorialPush = read("scripts/backfill-normalized-editorial-guides.mjs");
  const poiPhotoSync = read("scripts/sync-editorial-poi-photos.mjs");

  assert(!homeServerContent.includes("mapLists"), "HomeServerContent must not import or read hardcoded mapLists.");
  assert(homePage.includes("getServerEditorialGuides"), "Homepage must load editorial guides on the server.");
  assert(homePage.includes("HomeServerContent continents={continents} editorialGuides={editorialGuides}"), "Homepage fallback must receive server editorial guides.");
  assert(
    read("src/components/home/SplitScreenClientLoader.tsx").includes("initialEditorialGuides={data.guides}"),
    "SplitScreenSection must hydrate from server app-data guides.",
  );
  assert(cityPage.includes("guides: editorialGuides"), "City route resolution must use server editorial guides.");
  assert(cityPage.includes("CityRouteSeoIndex route={route} guides={editorialGuides}"), "City no-JS fallback must receive server editorial guides.");
  assert(splitScreen.includes("initialEditorialGuides") && splitScreen.includes("getEditorialLists(hydratedEditorialLists)"), "SplitScreenSection must seed and render from initial editorial guides.");
  assert(appStore.includes("return editorialLists;") && !appStore.includes("localOnlyLists"), "Client guide merge must not append local mapLists when remote guides exist.");
  assert(!proxy.includes("resolveCityDeepLink"), "Proxy must not redirect city guide paths using local guide data.");
  assert(destinationDescriptions.includes("cloneCountryWithDescription") && destinationDescriptions.includes("cloneCityWithDescription"), "Destination description loader must apply Supabase rows to both countries and cities.");
  assert(
    read("src/lib/server-editorial-guides.ts").includes("entries_maplist") &&
      read("src/lib/server-editorial-guides.ts").includes("weekly_events_maplist"),
    "Server guide loader must prefer normalized MapList views.",
  );
  assert(
    read("src/lib/server-editorial-guides.ts").includes("entry_render_cache") &&
      !read("src/lib/server-editorial-guides.ts").includes("public.editorial_guides") &&
      !read("src/lib/server-editorial-guides.ts").includes("public.weekly_event_guides"),
    "Server guide loader must fall back to normalized render caches, not legacy blob tables.",
  );
  assert(
    destinationDescriptions.includes("destination_descriptions_v2"),
    "Destination description loader must prefer normalized destination descriptions.",
  );
  assert(
    normalizedEditorialPush.includes("collectEditorialPois") &&
      normalizedEditorialPush.includes("upsertEditorialPois"),
    "Normalized guide pushes must also sync canonical editorial_pois rows.",
  );
  assert(
    poiPhotoSync.includes("drift") &&
      poiPhotoSync.includes("entry_stops") &&
      poiPhotoSync.includes("entry_render_cache"),
    "Editorial POI photo sync must detect drift and refresh normalized stops/render cache.",
  );
}

async function loadSupabaseContent() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    throw new Error("Set SUPABASE_DB_URL, SUPABASE_DATABASE_URL, or DATABASE_URL to run live HTML validation.");
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: getPgSslConfig(databaseUrl),
  });

  try {
    await client.connect();
    const guideResult = await client.query(
      [
        "select view.list",
        "from public.entries entry",
        "join public.entries_maplist view on view.id = entry.id",
        "where entry.source_table = 'editorial_guides'",
        "order by entry.category asc, entry.country_name asc nulls last,",
        "  view.list->'location'->>'city' asc nulls last,",
        "  view.list->'location'->>'neighborhood' asc nulls last,",
        "  view.list->>'title' asc",
      ].join(" "),
    );
    const cityDescriptionResult = await client.query(
      [
        "select destination.city_name as city, destination.country_name as country, description.description",
        "from public.destination_descriptions_v2 description",
        "join public.destinations destination on destination.id = description.destination_id",
        "join (",
        "  select city_id, count(*) as guide_count",
        "  from public.entries",
        "  where source_table = 'editorial_guides'",
        "    and city_id is not null",
        "  group by city_id",
        ") g on g.city_id = destination.id",
        "where destination.scope = 'city'",
        "  and description.locale = 'en'",
        "  and description.description_kind = 'overview'",
        "  and description.description <> ''",
        "order by g.guide_count desc, destination.city_name asc",
        "limit 9",
      ].join(" "),
    );
    const countryDescriptionResult = await client.query(
      [
        "select destination.country_name as country, description.description",
        "from public.destination_descriptions_v2 description",
        "join public.destinations destination on destination.id = description.destination_id",
        "join (",
        "  select country_name, count(*) as guide_count",
        "  from public.entries",
        "  where source_table = 'editorial_guides'",
        "    and country_name is not null",
        "  group by country_name",
        ") g on g.country_name = destination.country_name",
        "where destination.scope = 'country'",
        "  and description.locale = 'en'",
        "  and description.description_kind = 'overview'",
        "  and description.description <> ''",
        "order by g.guide_count desc, destination.country_name asc",
        "limit 9",
      ].join(" "),
    );

    return {
      guides: guideResult.rows.map((row) => row.list),
      cityDescriptions: cityDescriptionResult.rows,
      countryDescriptions: countryDescriptionResult.rows,
    };
  } finally {
    await client.end().catch(() => {});
  }
}

async function validateRenderedHtml(origin) {
  const { guides, cityDescriptions, countryDescriptions } = await loadSupabaseContent();
  assert(guides.length > 0, "Supabase normalized entries have no rows to validate against.");
  assert(cityDescriptions.length > 0, "Supabase destination_descriptions has no city rows to validate against.");
  assert(countryDescriptions.length > 0, "Supabase destination_descriptions has no country rows to validate against.");

  const response = await fetch(origin, { cache: "no-store" });
  assert(response.ok, `Homepage returned HTTP ${response.status}.`);

  const pageText = normalizeHtmlText(await response.text());
  const featuredGuides = guides
    .filter((guide) => guide.location?.scope === "city" && guide.location?.city)
    .sort((left, right) => (right.upvotes ?? 0) - (left.upvotes ?? 0) || left.title.localeCompare(right.title))
    .slice(0, 8);

  assert(
    featuredGuides.some((guide) => pageText.includes(normalizeHtmlText(guide.description))),
    "Homepage no-JS fallback HTML did not include any featured guide description from Supabase.",
  );
  assert(
    cityDescriptions.some((row) => pageText.includes(normalizeHtmlText(row.description))),
    "Homepage server HTML did not include a featured city description from destination_descriptions.",
  );

  if (!process.argv.includes("--homepage-only")) {
    const stayGuides = guides.filter(isStayGuide);
    assert(stayGuides.length > 0, "No Stay/hotel/hostel guides found to validate.");

    for (const guide of stayGuides) {
      const guideResponse = await fetch(new URL(`/list/${guide.slug}`, origin), { cache: "no-store" });
      assert(guideResponse.ok, `Stay guide ${guide.slug} returned HTTP ${guideResponse.status}.`);

      const guideText = normalizeHtmlText(await guideResponse.text());
      assert(guideText.includes(normalizeHtmlText(guide.title)), `Stay guide ${guide.slug} HTML is missing its title.`);
      assert(
        guideText.includes(normalizeHtmlText(guide.description)),
        `Stay guide ${guide.slug} HTML is missing its description.`,
      );

      for (const stop of (guide.stops ?? []).slice(0, 3)) {
        assert(
          guideText.includes(normalizeHtmlText(stop.name)),
          `Stay guide ${guide.slug} HTML is missing stop ${stop.name}.`,
        );
      }
    }
  }

  console.log(`Validated source architecture and rendered HTML against ${origin}.`);
}

const originArg = process.argv.find((arg) => arg.startsWith("--origin="));
const origin = originArg?.slice("--origin=".length) ?? process.env.CONTENT_SOURCE_VALIDATE_ORIGIN;

validateSourceArchitecture();

if (process.argv.includes("--static-only")) {
  console.log("Validated source architecture.");
} else {
  await validateRenderedHtml(origin ?? "http://127.0.0.1:3000");
}
