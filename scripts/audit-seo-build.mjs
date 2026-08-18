import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const SITEMAP_PATH = ".next/server/app/sitemap.xml.body";
const SITEMAP_ROUTE_PATH = ".next/server/app/sitemap.xml/route.js";
const SITEMAP_URL = process.env.SEO_AUDIT_SITEMAP_URL?.trim();
const CANONICAL_ORIGIN = "https://www.rguide.co";
const FORBIDDEN_PATH_PREFIXES = ["/api/", "/admin/", "/auth/", "/events/", "/favorites", "/list/", "/mobile", "/submit", "/venues/"];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function getRouteClass(pathname) {
  if (pathname === "/") return "home";
  return pathname.split("/").filter(Boolean)[0] ?? "other";
}

async function readBuiltSitemap() {
  if (SITEMAP_URL) {
    const response = await fetch(SITEMAP_URL);
    assert(response.ok, `Sitemap returned HTTP ${response.status}: ${SITEMAP_URL}`);
    return response.text();
  }

  try {
    return await readFile(SITEMAP_PATH, "utf8");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;

    const builtRoute = await import(pathToFileURL(resolve(SITEMAP_ROUTE_PATH)).href);
    const routeExports = await builtRoute.default;
    const response = await routeExports.routeModule.userland.GET();

    assert(response.ok, `Built sitemap returned HTTP ${response.status}.`);
    return response.text();
  }
}

const xml = await readBuiltSitemap();
const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const lastModifiedValues = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((match) => match[1]);
const uniqueLocations = new Set(locations);
const sitemapEntries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => {
  const entry = match[1];
  return {
    location: entry.match(/<loc>([^<]+)<\/loc>/)?.[1],
    english: entry.match(/hreflang="en" href="([^"]+)"/)?.[1],
    spanish: entry.match(/hreflang="es" href="([^"]+)"/)?.[1],
    default: entry.match(/hreflang="x-default" href="([^"]+)"/)?.[1],
  };
});

assert(locations.length > 0, "The built sitemap is empty.");
assert(uniqueLocations.size === locations.length, "The built sitemap contains duplicate URLs.");
assert(!xml.includes("<changefreq>"), "Google ignores changefreq; remove it from the sitemap.");
assert(!xml.includes("<priority>"), "Google ignores priority; remove it from the sitemap.");

for (const location of locations) {
  const url = new URL(location);
  assert(url.origin === CANONICAL_ORIGIN, `Non-canonical sitemap origin: ${location}`);
  assert(!url.search && !url.hash, `Sitemap URL contains query or hash data: ${location}`);
  assert(
    !FORBIDDEN_PATH_PREFIXES.some((prefix) => url.pathname === prefix || url.pathname.startsWith(prefix)),
    `Non-indexable route found in sitemap: ${location}`,
  );
}

const entriesByLocation = new Map(sitemapEntries.map((entry) => [entry.location, entry]));
const spanishEntries = sitemapEntries.filter((entry) => entry.location?.includes("/es/"));

for (const entry of spanishEntries) {
  assert(entry.spanish === entry.location, `Spanish sitemap entry is not self-referential: ${entry.location}`);
  assert(entry.english, `Spanish sitemap entry is missing an English alternate: ${entry.location}`);
  assert(entry.default === entry.english, `Spanish sitemap entry has an invalid x-default alternate: ${entry.location}`);

  const englishEntry = entriesByLocation.get(entry.english);
  assert(englishEntry, `Spanish sitemap entry points to an English URL outside the sitemap: ${entry.location}`);
  assert(englishEntry.english === entry.english, `English alternate is not self-referential: ${entry.english}`);
  assert(englishEntry.spanish === entry.location, `English and Spanish sitemap alternates are not reciprocal: ${entry.location}`);
  assert(englishEntry.default === entry.english, `English sitemap entry has an invalid x-default alternate: ${entry.english}`);
}

const tomorrow = Date.now() + 86_400_000;
for (const value of lastModifiedValues) {
  const timestamp = Date.parse(value);
  assert(Number.isFinite(timestamp), `Invalid sitemap lastmod value: ${value}`);
  assert(timestamp < tomorrow, `Future sitemap lastmod value: ${value}`);
}

const routeCounts = locations.reduce((counts, location) => {
  const routeClass = getRouteClass(new URL(location).pathname);
  counts[routeClass] = (counts[routeClass] ?? 0) + 1;
  return counts;
}, {});

console.log(
  JSON.stringify(
    {
      sitemapUrls: locations.length,
      spanishUrls: spanishEntries.length,
      urlsWithLastModified: lastModifiedValues.length,
      routeCounts,
    },
    null,
    2,
  ),
);
