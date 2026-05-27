import crypto from "node:crypto";

import { NextRequest, NextResponse } from "next/server";
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

function getSupabaseAnalyticsConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;

  return url && key ? { url, key } : null;
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

  const config = getSupabaseAnalyticsConfig();

  if (!config) {
    console.warn("Analytics click ignored because Supabase service-role configuration is missing.");
    return new NextResponse(null, { status: 204 });
  }

  const properties = getProperties(payload);
  const supabase = createClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from("analytics_click_events").insert({
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
  });

  if (error) {
    console.error("Failed to store analytics click", error);
    return NextResponse.json({ error: "Analytics event could not be stored." }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
