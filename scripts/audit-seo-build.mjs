import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const SITEMAP_PATH = ".next/server/app/sitemap.xml.body";
const SITEMAP_ROUTE_PATH = ".next/server/app/sitemap.xml/route.js";
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
      urlsWithLastModified: lastModifiedValues.length,
      routeCounts,
    },
    null,
    2,
  ),
);
