"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { MapList } from "@/types";

interface SubmittedGuideRecord {
  list: MapList;
  updated_at: string;
}

interface DestinationRecord {
  id: string;
}

interface EntryRecord {
  id: string;
}

interface VenueRecord {
  id: string;
}

interface VenueMediaRecord {
  id: string;
}

function dateOnly(value: string | undefined) {
  return value ? value.slice(0, 10) : null;
}

function toSchemaSubmissionType(value: MapList["submissionType"]) {
  return value === "itinerary" ? "journey" : value ?? "guide";
}

function slugify(value: string | undefined) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeName(value: string | undefined) {
  return slugify(value).replace(/-/g, " ").replace(/\s+/g, " ").trim();
}

async function upsertSubmittedVenue(
  list: MapList,
  stop: MapList["stops"][number],
  cityId: string | null,
  neighborhoodId: string | null,
) {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return { venueId: null as string | null, error: null };
  }

  const name = stop.name.trim();
  const slug = stop.poiId ? slugify(stop.poiId) : slugify(name);
  const { data, error } = await supabase
    .from("venues")
    .upsert(
      {
        legacy_id: stop.poiId ?? `${list.id}:${stop.id}`,
        slug,
        name,
        normalized_name: normalizeName(name),
        aliases: [],
        destination_id: neighborhoodId ?? cityId,
        city_id: cityId,
        neighborhood_id: neighborhoodId,
        country: list.location.country,
        coordinates: stop.coordinates ?? null,
        official_url: stop.officialUrl ?? stop.bookingUrl ?? null,
        venue_kind: "other",
        venue_kinds: ["other"],
        source_metadata: { source: "submitted_guides", entryId: list.id, stopId: stop.id },
      },
      { onConflict: "city_id,slug" },
    )
    .select("id")
    .returns<VenueRecord[]>();

  return { venueId: data?.[0]?.id ?? null, error };
}

async function upsertSubmittedVenueMedia(
  venueId: string | null,
  list: MapList,
  stop: MapList["stops"][number],
) {
  const supabase = getSupabaseBrowserClient();
  const url = stop.photo?.trim();

  if (!supabase || !venueId || !url) {
    return { error: null };
  }

  const { data, error } = await supabase
    .from("venue_media")
    .upsert(
      {
        venue_id: venueId,
        url,
        role: "primary",
        source_type: "submitted_guides",
        source_entity_type: "entry_stop",
        source_legacy_id: stop.id,
        raw_metadata: { source: "submitted_guides", entryId: list.id, stopId: stop.id },
        sort_order: 0,
      },
      { onConflict: "venue_id,url" },
    )
    .select("id")
    .returns<VenueMediaRecord[]>();

  if (error || !data?.[0]) {
    return { error };
  }

  const { error: updateVenueError } = await supabase
    .from("venues")
    .update({ primary_photo_id: data[0].id })
    .eq("id", venueId);

  return { error: updateVenueError };
}

async function resolveSubmittedDestinationIds(list: MapList) {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return {
      destinationId: null as string | null,
      cityId: null as string | null,
      neighborhoodId: null as string | null,
    };
  }

  let cityId: string | null = null;
  let neighborhoodId: string | null = null;

  if (list.location.city) {
    const { data: cityRows } = await supabase
      .from("destinations")
      .select("id")
      .eq("scope", "city")
      .eq("name", list.location.city)
      .eq("country_name", list.location.country)
      .limit(1)
      .returns<DestinationRecord[]>();

    cityId = cityRows?.[0]?.id ?? null;
  }

  if (cityId && list.location.neighborhood) {
    const { data: neighborhoodRows } = await supabase
      .from("destinations")
      .select("id")
      .eq("scope", "neighborhood")
      .eq("name", list.location.neighborhood)
      .eq("parent_id", cityId)
      .limit(1)
      .returns<DestinationRecord[]>();

    neighborhoodId = neighborhoodRows?.[0]?.id ?? null;
  }

  return {
    destinationId: neighborhoodId ?? cityId,
    cityId,
    neighborhoodId,
  };
}

export async function loadSubmittedGuides() {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return { guides: [] as MapList[], error: null };
  }

  const { data, error } = await supabase
    .from("entries_maplist")
    .select("list,updated_at")
    .eq("source_table", "submitted_guides")
    .order("updated_at", { ascending: false })
    .returns<SubmittedGuideRecord[]>();

  if (error) {
    return { guides: [] as MapList[], error };
  }

  return {
    guides: (data ?? []).map((record) => record.list),
    error: null,
  };
}

export async function saveSubmittedGuide(list: MapList) {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return { error: null };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: userError };
  }

  const { destinationId, cityId, neighborhoodId } = await resolveSubmittedDestinationIds(list);
  const { data: entryRows, error: entryError } = await supabase
    .from("entries")
    .upsert(
      {
        legacy_id: list.id,
        slug: list.slug,
        seo_slug: list.seoSlug ?? null,
        seo_title: list.seoTitle ?? null,
        seo_description: list.seoDescription ?? null,
        title: list.title,
        description: list.description,
        highlights: list.highlights ?? [],
        photo_url: list.photo ?? null,
        canonical_url: list.url,
        category: list.category,
        submission_type: toSchemaSubmissionType(list.submissionType),
        status: list.journal?.visibility === "private" ? "draft" : "published",
        destination_id: destinationId,
        city_id: cityId,
        neighborhood_id: neighborhoodId,
        country_name: list.location.country,
        continent_name: list.location.continent,
        creator_id: list.creator.id,
        creator_name: list.creator.name,
        creator_avatar: list.creator.avatar,
        user_id: user.id,
        upvotes: list.upvotes,
        created_on: dateOnly(list.createdAt),
        journey_start_date: dateOnly(list.journey?.startDate ?? list.itinerary?.startDate),
        journey_end_date: dateOnly(list.journey?.endDate ?? list.itinerary?.endDate),
        journal_visited_at: dateOnly(list.journal?.visitedAt),
        journal_note: list.journal?.note ?? null,
        journal_visibility: list.journal?.visibility ?? null,
        source_table: "submitted_guides",
        metadata: { submittedFrom: "browser" },
      },
      { onConflict: "legacy_id" },
    )
    .select("id")
    .returns<EntryRecord[]>();

  if (entryError || !entryRows?.[0]) {
    return { error: entryError };
  }

  const entryId = entryRows[0].id;
  const { error: deleteStopsError } = await supabase.from("entry_stops").delete().eq("entry_id", entryId);

  if (deleteStopsError) {
    return { error: deleteStopsError };
  }

  const stops = [];
  for (const [index, stop] of list.stops.entries()) {
    const { venueId, error: venueError } = await upsertSubmittedVenue(list, stop, cityId, neighborhoodId);

    if (venueError) {
      return { error: venueError };
    }

    const { error: mediaError } = await upsertSubmittedVenueMedia(venueId, list, stop);

    if (mediaError) {
      return { error: mediaError };
    }

    stops.push({
      entry_id: entryId,
      legacy_id: stop.id,
      stop_order: index,
      poi_legacy_id: stop.poiId ?? null,
      name: stop.name,
      description: stop.description,
      category: stop.category ?? null,
      subcategory: stop.subcategory ?? null,
      subcategories: stop.subcategories ?? [],
      destination_id: neighborhoodId ?? cityId,
      venue_id: venueId,
      coordinates: stop.coordinates,
      price_label: stop.price ?? null,
      price_source: stop.priceSource ?? null,
      booking_url: stop.bookingUrl ?? null,
      official_url: stop.officialUrl ?? null,
      event_time_label: stop.eventTime ?? null,
      event_venue_label: stop.eventVenue ?? null,
      journey_date: dateOnly(stop.journeyDate ?? stop.itineraryDate),
      journey_day: stop.journeyDay ?? stop.itineraryDay ?? null,
      hours: stop.hours ?? null,
      places: stop.places ?? [],
      metadata: {},
    });
  }

  if (!stops.length) {
    return { error: null };
  }

  const { error } = await supabase.from("entry_stops").insert(stops);

  return { error };
}

export async function deleteSubmittedGuide(listId: string) {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return { error: null };
  }

  const { error } = await supabase
    .from("entries")
    .delete()
    .eq("legacy_id", listId)
    .eq("source_table", "submitted_guides");

  return { error };
}
