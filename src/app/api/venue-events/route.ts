import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import type { VenueEvent } from "@/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type VenueEventRow = VenueEvent & {
  city_id?: string | null;
};

function getSupabaseDataApiConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    null;

  return url && key ? { url, key } : null;
}

function parseBoolean(value: string | null) {
  if (!value) {
    return false;
  }
  return ["1", "true", "yes"].includes(value.toLowerCase());
}

export async function GET(request: NextRequest) {
  const config = getSupabaseDataApiConfig();

  if (!config) {
    return NextResponse.json(
      { events: [], error: "Supabase configuration is missing." },
      { status: 500 },
    );
  }

  const { searchParams } = request.nextUrl;
  const venueId = searchParams.get("venue_id");

  if (!venueId) {
    return NextResponse.json(
      { events: [], error: "venue_id is required." },
      { status: 400 },
    );
  }

  const cityId = searchParams.get("city_id");
  const startsAfter = searchParams.get("starts_after");
  const startsBefore = searchParams.get("starts_before");
  const eventCategory = searchParams.get("event_category");
  const includePast = parseBoolean(searchParams.get("include_past"));
  const nowIso = new Date().toISOString();

  const supabase = createClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let query = supabase
    .from("venue_events")
    .select("*")
    .eq("venue_id", venueId);

  if (cityId) {
    query = query.eq("city_id", cityId);
  }

  if (eventCategory) {
    query = query.eq("event_category", eventCategory);
  }

  if (startsAfter) {
    query = query.gte("next_occurrence_at_venue", startsAfter);
  } else if (!includePast) {
    query = query.gte("latest_occurrence_at_venue", nowIso);
  }

  if (startsBefore) {
    query = query.lte("next_occurrence_at_venue", startsBefore);
  }

  const { data, error } = await query
    .order("next_occurrence_at_venue", { ascending: true, nullsFirst: false })
    .order("starts_at", { ascending: true, nullsFirst: false })
    .returns<VenueEventRow[]>();

  if (error) {
    console.error("Failed to load venue events", error);
    return NextResponse.json({ events: [], error: error.message }, { status: 500 });
  }

  return NextResponse.json({ events: data ?? [] });
}
