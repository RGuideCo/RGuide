import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import pg from "pg";

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function loadEnvFile(relativePath) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) return;

  for (const line of fs.readFileSync(fullPath, "utf8").split(/\r?\n/)) {
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

export function loadProjectEnv() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");
}

export function getDatabaseUrl() {
  return process.env.SUPABASE_DB_URL ?? process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL ?? null;
}

export function createDatabaseClient() {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    throw new Error("Set SUPABASE_DB_URL, SUPABASE_DATABASE_URL, or DATABASE_URL.");
  }
  return new pg.Client({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
      ? false
      : { rejectUnauthorized: false },
  });
}

export function parseArgs(argv) {
  const options = {
    locale: "es",
    limit: 25,
    dryRun: false,
    autoPublish: false,
    disable: false,
    id: null,
    batch: null,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--locale") options.locale = argv[++index];
    else if (value === "--limit") options.limit = Number.parseInt(argv[++index], 10);
    else if (value === "--id") options.id = argv[++index];
    else if (value === "--batch") options.batch = argv[++index];
    else if (value === "--dry-run") options.dryRun = true;
    else if (value === "--auto-publish") options.autoPublish = true;
    else if (value === "--disable") options.disable = true;
    else throw new Error(`Unknown argument: ${value}`);
  }
  if (!/^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(options.locale)) throw new Error("Invalid --locale.");
  if (!Number.isInteger(options.limit) || options.limit < 1 || options.limit > 500) {
    throw new Error("--limit must be between 1 and 500.");
  }
  return options;
}

export function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const LOCALIZED_ROUTE_CONFIG = {
  es: {
    citySegment: "ciudad",
    eventSegment: "eventos",
    categories: {
      Food: "comida",
      Nightlife: "vida-nocturna",
      Nature: "naturaleza",
      Culture: "cultura",
      Stay: "alojamiento",
      Activities: "actividades",
      Routes: "rutas",
      Essentials: "informacion-esencial",
    },
  },
};

export function buildLocalizedGuideUrl(locale, guide, localizedDestinations = {}) {
  const routeConfig = LOCALIZED_ROUTE_CONFIG[locale];
  if (!routeConfig) {
    throw new Error(`Add ${locale} route segments to LOCALIZED_ROUTE_CONFIG before publishing localized caches.`);
  }
  const city = localizedDestinations.citySlug ?? slugify(guide.location?.city ?? "");
  const neighborhoodSlug = localizedDestinations.neighborhoodSlug ?? slugify(guide.location?.neighborhood ?? "");
  const neighborhood = neighborhoodSlug ? `/${neighborhoodSlug}` : "";
  const category = routeConfig.categories[guide.category];
  if (!category) throw new Error(`Missing ${locale} route category for ${guide.category}.`);
  const routeRoot = `/${locale}/${routeConfig.citySegment}`;
  return `${routeRoot}/${city}${neighborhood}/${category}/${guide.seoSlug ?? guide.slug}`;
}

export function buildLocalizedEventUrl(locale, seoSlug) {
  const routeConfig = LOCALIZED_ROUTE_CONFIG[locale];
  if (!routeConfig) {
    throw new Error(`Add ${locale} route segments to LOCALIZED_ROUTE_CONFIG before publishing localized caches.`);
  }
  return `/${locale}/${routeConfig.eventSegment}/${seoSlug}`;
}
