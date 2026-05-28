import crypto from "node:crypto";

import { NextRequest, NextResponse } from "next/server";
import pg from "pg";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BATCH_SIZE = 25;
const ALLOWED_EVENT_TYPES = new Set([
  "affiliate_click",
  "outbound_click",
  "guide_link_click",
  "internal_link_click",
  "button_click",
]);

type ClickPayload = {
  eventType?: unknown;
  event_type?: unknown;
  sessionId?: unknown;
  session_id?: unknown;
  referrer?: unknown;
  properties?: unknown;
  raw_properties?: unknown;
};

type BatchPayload = ClickPayload & {
  event?: unknown;
  events?: unknown;
};

type AnalyticsRpcResult = {
  received?: number;
  accepted?: number;
  dropped?: number;
  rawInserted?: number;
  rollupGroups?: number;
};

function getSupabaseAnalyticsConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
  const publicKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    null;
  const key = serviceKey ?? publicKey;

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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getEvents(payload: BatchPayload): ClickPayload[] {
  if (Array.isArray(payload.events)) {
    return payload.events.filter(isPlainObject).slice(0, MAX_BATCH_SIZE) as ClickPayload[];
  }

  if (isPlainObject(payload.event)) {
    return [payload.event as ClickPayload];
  }

  return [payload];
}

function enrichEvent(event: ClickPayload, request: NextRequest) {
  const eventType = truncate(event.eventType ?? event.event_type, 80);

  if (!eventType || !ALLOWED_EVENT_TYPES.has(eventType)) {
    return null;
  }

  return {
    ...event,
    eventType,
    event_type: eventType,
    sessionId: truncate(event.sessionId ?? event.session_id, 120) ?? undefined,
    session_id: truncate(event.sessionId ?? event.session_id, 120) ?? undefined,
    referrer: truncate(event.referrer, 500) ?? undefined,
    ip_hash: getIpHash(request),
    user_agent: getHeader(request, "user-agent"),
    country: getHeader(request, "x-vercel-ip-country") ?? getHeader(request, "cf-ipcountry"),
    region: getHeader(request, "x-vercel-ip-country-region"),
    metro: getHeader(request, "x-vercel-ip-city"),
  };
}

async function recordWithDataApi(events: ReturnType<typeof enrichEvent>[]) {
  const config = getSupabaseAnalyticsConfig();

  if (!config) {
    return null;
  }

  const supabase = createClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.rpc("record_analytics_batch", { p_events: events });

  if (error) {
    throw error;
  }

  return data as AnalyticsRpcResult;
}

async function recordWithDatabaseUrl(events: ReturnType<typeof enrichEvent>[]) {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    return null;
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: getPgSslConfig(databaseUrl),
  });

  await client.connect();

  try {
    const result = await client.query<{ result: AnalyticsRpcResult }>(
      "select public.record_analytics_batch($1::jsonb) as result",
      [JSON.stringify(events)],
    );

    return result.rows[0]?.result ?? null;
  } finally {
    await client.end().catch(() => {});
  }
}

export async function POST(request: NextRequest) {
  let payload: BatchPayload;

  try {
    payload = (await request.json()) as BatchPayload;
  } catch {
    return NextResponse.json({ error: "Invalid analytics payload." }, { status: 400 });
  }

  const events = getEvents(payload)
    .map((event) => enrichEvent(event, request))
    .filter(Boolean);

  if (!events.length) {
    return NextResponse.json({ received: 0, accepted: 0, dropped: 0, rawInserted: 0, rollupGroups: 0 });
  }

  try {
    const result = (await recordWithDataApi(events)) ?? (await recordWithDatabaseUrl(events));

    if (!result) {
      return NextResponse.json({ error: "Analytics storage is not configured." }, { status: 500 });
    }

    return NextResponse.json({
      received: result.received ?? events.length,
      accepted: result.accepted ?? 0,
      dropped: result.dropped ?? 0,
      rawInserted: result.rawInserted ?? 0,
      rollupGroups: result.rollupGroups ?? 0,
    });
  } catch (error) {
    console.error("Failed to store analytics batch", error);
    return NextResponse.json({ error: "Analytics batch could not be stored." }, { status: 500 });
  }
}
