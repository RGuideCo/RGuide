import crypto from "node:crypto";

import { NextRequest, NextResponse } from "next/server";
import pg from "pg";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED_EVENT_TYPES = new Set([
  "affiliate_click",
  "outbound_click",
  "guide_link_click",
  "internal_link_click",
  "button_click",
]);

type ClickPayload = {
  eventType?: unknown;
  sessionId?: unknown;
  referrer?: unknown;
  properties?: unknown;
};

type ClickProperties = Record<string, string | undefined>;

type AnalyticsClickRow = {
  event_type: string;
  session_id: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  referrer: string | null;
  country: string | null;
  region: string | null;
  metro: string | null;
  current_path: string | null;
  destination_host: string | null;
  destination_path: string | null;
  link_text: string | null;
  city_slug: string | null;
  neighborhood_slug: string | null;
  category_slug: string | null;
  guide_slug: string | null;
  button_text: string | null;
  button_label: string | null;
  affiliate: string | null;
  affiliate_aid: string | null;
  affiliate_campaign: string | null;
  affiliate_hotel_name: string | null;
  raw_properties: ClickProperties;
};

function getSupabaseAnalyticsConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;

  return url && key ? { url, key } : null;
}

function getDatabaseUrl() {
  return (
    process.env.SUPABASE_DB_URL ??
    process.env.SUPABASE_DATABASE_URL ??
    process.env.DATABASE_URL ??
    null
  );
}

function getPgSslConfig(databaseUrl: string) {
  return databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
    ? false
    : { rejectUnauthorized: false };
}

function truncate(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized ? normalized.slice(0, maxLength) : null;
}

function getProperties(payload: ClickPayload): ClickProperties {
  if (!payload.properties || typeof payload.properties !== "object" || Array.isArray(payload.properties)) {
    return {};
  }

  return payload.properties as ClickProperties;
}

function getHeader(request: NextRequest, name: string) {
  return truncate(request.headers.get(name), 255);
}

function getIpHash(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const ip = forwardedFor || realIp;

  if (!ip) {
    return null;
  }

  const salt = process.env.ANALYTICS_IP_HASH_SALT ?? "rguide";
  return crypto.createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

async function insertWithDataApi(row: AnalyticsClickRow) {
  const config = getSupabaseAnalyticsConfig();

  if (!config) {
    return false;
  }

  const supabase = createClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from("analytics_click_events").insert(row);

  if (error) {
    throw error;
  }

  return true;
}

async function insertWithDatabaseUrl(row: AnalyticsClickRow) {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    return false;
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: getPgSslConfig(databaseUrl),
  });

  await client.connect();

  try {
    await client.query(
      [
        "insert into public.analytics_click_events (",
        "  event_type, session_id, ip_hash, user_agent, referrer, country, region, metro,",
        "  current_path, destination_host, destination_path, link_text, city_slug, neighborhood_slug,",
        "  category_slug, guide_slug, button_text, button_label, affiliate, affiliate_aid,",
        "  affiliate_campaign, affiliate_hotel_name, raw_properties",
        ") values (",
        "  $1, $2, $3, $4, $5, $6, $7, $8,",
        "  $9, $10, $11, $12, $13, $14,",
        "  $15, $16, $17, $18, $19, $20,",
        "  $21, $22, $23::jsonb",
        ")",
      ].join(" "),
      [
        row.event_type,
        row.session_id,
        row.ip_hash,
        row.user_agent,
        row.referrer,
        row.country,
        row.region,
        row.metro,
        row.current_path,
        row.destination_host,
        row.destination_path,
        row.link_text,
        row.city_slug,
        row.neighborhood_slug,
        row.category_slug,
        row.guide_slug,
        row.button_text,
        row.button_label,
        row.affiliate,
        row.affiliate_aid,
        row.affiliate_campaign,
        row.affiliate_hotel_name,
        JSON.stringify(row.raw_properties),
      ],
    );
  } finally {
    await client.end().catch(() => {});
  }

  return true;
}

export async function POST(request: NextRequest) {
  let payload: ClickPayload;

  try {
    payload = (await request.json()) as ClickPayload;
  } catch {
    return NextResponse.json({ error: "Invalid analytics payload." }, { status: 400 });
  }

  const eventType = truncate(payload.eventType, 80);

  if (!eventType || !ALLOWED_EVENT_TYPES.has(eventType)) {
    return NextResponse.json({ error: "Unsupported analytics event." }, { status: 400 });
  }

  const properties = getProperties(payload);
  const row: AnalyticsClickRow = {
    event_type: eventType,
    session_id: truncate(payload.sessionId, 120),
    ip_hash: getIpHash(request),
    user_agent: getHeader(request, "user-agent"),
    referrer: truncate(payload.referrer, 500),
    country: getHeader(request, "x-vercel-ip-country") ?? getHeader(request, "cf-ipcountry"),
    region: getHeader(request, "x-vercel-ip-country-region"),
    metro: getHeader(request, "x-vercel-ip-city"),
    current_path: truncate(properties.currentPath, 500),
    destination_host: truncate(properties.destinationHost, 255),
    destination_path: truncate(properties.destinationPath, 700),
    link_text: truncate(properties.linkText, 160),
    city_slug: truncate(properties.city, 120),
    neighborhood_slug: truncate(properties.neighborhood, 180),
    category_slug: truncate(properties.category, 120),
    guide_slug: truncate(properties.guideSlug, 180),
    button_text: truncate(properties.buttonText, 160),
    button_label: truncate(properties.buttonLabel, 160),
    affiliate: truncate(properties.affiliate, 80),
    affiliate_aid: truncate(properties.aid, 120),
    affiliate_campaign: truncate(properties.campaign, 180),
    affiliate_hotel_name: truncate(properties.hotelName, 255),
    raw_properties: properties,
  };

  try {
    const inserted = await insertWithDataApi(row);

    if (!inserted) {
      await insertWithDatabaseUrl(row);
    }
  } catch (error) {
    console.error("Failed to store analytics click", error);
    return NextResponse.json({ error: "Analytics event could not be stored." }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
