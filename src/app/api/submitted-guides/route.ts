import { NextRequest, NextResponse } from "next/server";
import type { SupabaseClient, User as SupabaseUser } from "@supabase/supabase-js";

import { checkRateLimit, rateLimitResponse, withRateLimitHeaders } from "@/lib/rate-limit";
import {
  getAuthenticatedSupabaseUser,
  getSupabaseServiceClient,
} from "@/lib/supabase/server";
import { getProfileAvatarUrl } from "@/lib/profile-avatar";
import type { ExternalPlaceProvider, ExternalPlaceReference, GuideStop, ListCategory, MapList } from "@/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Coordinates = [number, number];
type GuideVisibility = "private" | "followers" | "public";

type DestinationRow = {
  id: string;
};

type EntryRow = {
  id: string;
  slug: string;
  user_id: string | null;
  source_table: string | null;
  submission_type: string;
};

type EditorialSourceEntryRow = {
  id: string;
  legacy_id: string;
};

type EditorialSourceStopRow = {
  entry_id: string;
  legacy_id: string;
  venue_id: string | null;
  places: unknown;
};

type CanonicalNestedPlace = {
  id: string;
  venueId: string | null;
  places: CanonicalNestedPlace[];
};

type VenueRow = {
  id: string;
  legacy_id: string | null;
  slug: string;
  name: string;
  normalized_name: string;
  city_id: string | null;
  coordinates: unknown;
  merged_into_venue_id: string | null;
};

type VenueExternalRefRow = {
  venue_id: string;
};

const CATEGORY_TO_VENUE_KIND: Record<ListCategory, string> = {
  Food: "food_drink",
  Nightlife: "nightlife",
  Nature: "outdoors",
  Culture: "culture",
  Stay: "lodging",
  Activities: "landmark",
  Routes: "outdoors",
  Essentials: "service",
};

const ALLOWED_EXTERNAL_PROVIDERS = new Set<ExternalPlaceProvider>([
  "geoapify",
  "google",
  "osm",
  "rguide",
  "manual",
  "wikidata",
  "foursquare",
  "other",
]);

function getNumberEnv(key: string, fallback: number) {
  const value = Number.parseInt(process.env[key] ?? "", 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function slugify(value: string | undefined | null) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeName(value: string | undefined | null) {
  return slugify(value).replace(/-/g, " ").replace(/\s+/g, " ").trim();
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function optionalText(value: unknown, maxLength: number) {
  const cleaned = cleanText(value, maxLength);
  return cleaned || null;
}

function getAppMetadataString(user: SupabaseUser, key: string) {
  const value = user.app_metadata?.[key];
  return typeof value === "string" ? value : undefined;
}

function getUserMetadataString(user: SupabaseUser, key: string) {
  const value = user.user_metadata?.[key];
  return typeof value === "string" ? value : undefined;
}

function getAppMetadataBoolean(user: SupabaseUser, key: string) {
  const value = user.app_metadata?.[key];
  return typeof value === "boolean" ? value : undefined;
}

function canPublishPublicGuides(user: SupabaseUser) {
  if (
    getAppMetadataBoolean(user, "can_publish_guides") === true ||
    getAppMetadataBoolean(user, "rguide_can_publish_guides") === true
  ) {
    return true;
  }

  const userType =
    getAppMetadataString(user, "rguide_user_type") ??
    getAppMetadataString(user, "user_type") ??
    getAppMetadataString(user, "role");

  return ["admin", "editor", "publisher", "guide_publisher"].includes(
    userType?.toLowerCase() ?? "",
  );
}

function withAuthenticatedCreator(list: MapList, user: SupabaseUser): MapList {
  const name =
    getUserMetadataString(user, "full_name") ??
    getUserMetadataString(user, "name") ??
    user.email?.split("@")[0] ??
    "RGuide traveler";

  return {
    ...list,
    creator: {
      id: user.id,
      name,
      avatar: getProfileAvatarUrl(getUserMetadataString(user, "avatar_url")),
    },
  };
}

function getRequestedVisibility(list: MapList): GuideVisibility {
  if (list.visibility === "public") return "public";
  if (list.visibility === "private" || list.journal?.visibility === "private") return "private";
  return "private";
}

function dateOnly(value: string | undefined) {
  return value ? value.slice(0, 10) : null;
}

function toSchemaSubmissionType(value: MapList["submissionType"]) {
  return value === "itinerary" ? "journey" : value ?? "guide";
}

function isUuid(value: string | undefined | null) {
  return Boolean(
    value &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value),
  );
}

function toCoordinates(value: unknown): Coordinates | null {
  if (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number" &&
    Number.isFinite(value[0]) &&
    Number.isFinite(value[1]) &&
    Math.abs(value[0]) <= 90 &&
    Math.abs(value[1]) <= 180
  ) {
    return value[0] === 0 && value[1] === 0 ? null : [value[0], value[1]];
  }

  return null;
}

function toEntryCoordinates(value: unknown): Coordinates | null {
  if (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number" &&
    Number.isFinite(value[0]) &&
    Number.isFinite(value[1]) &&
    Math.abs(value[0]) <= 90 &&
    Math.abs(value[1]) <= 180
  ) {
    return [value[0], value[1]];
  }

  return null;
}

function distanceMeters(a?: Coordinates | null, b?: Coordinates | null) {
  if (!a || !b) return Number.POSITIVE_INFINITY;

  const radius = 6371000;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;

  return 2 * radius * Math.asin(Math.sqrt(h));
}

function sanitizeExternalPlace(value: unknown): ExternalPlaceReference | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const candidate = value as ExternalPlaceReference;
  const provider = ALLOWED_EXTERNAL_PROVIDERS.has(candidate.provider) ? candidate.provider : null;

  if (!provider) {
    return null;
  }

  return {
    provider,
    providerPlaceId: optionalText(candidate.providerPlaceId, 220) ?? undefined,
    label: optionalText(candidate.label, 220) ?? undefined,
    addressLine1: optionalText(candidate.addressLine1, 260) ?? undefined,
    addressLine2: optionalText(candidate.addressLine2, 260) ?? undefined,
    city: optionalText(candidate.city, 120) ?? undefined,
    state: optionalText(candidate.state, 120) ?? undefined,
    country: optionalText(candidate.country, 120) ?? undefined,
    postcode: optionalText(candidate.postcode, 40) ?? undefined,
    url: optionalText(candidate.url, 500) ?? undefined,
    coordinates: toCoordinates(candidate.coordinates) ?? undefined,
  };
}

function inferVenueKind(stop: GuideStop, fallbackCategory: ListCategory) {
  if (stop.venueKind) return stop.venueKind;
  if (stop.lodgingType) return "lodging";
  if (stop.foodServiceType || stop.cuisineTypes?.length) return "food_drink";
  if (stop.nightlifeType || stop.musicGenres?.length) return "nightlife";
  return CATEGORY_TO_VENUE_KIND[stop.category ?? fallbackCategory] ?? "other";
}

async function resolveDestinationIds(supabase: SupabaseClient, list: MapList) {
  let cityId: string | null = null;
  let neighborhoodId: string | null = null;

  if (list.location.city) {
    const { data } = await supabase
      .from("destinations")
      .select("id")
      .eq("scope", "city")
      .eq("name", list.location.city)
      .eq("country_name", list.location.country)
      .limit(1)
      .returns<DestinationRow[]>();

    cityId = data?.[0]?.id ?? null;
  }

  if (cityId && list.location.neighborhood) {
    const { data } = await supabase
      .from("destinations")
      .select("id")
      .eq("scope", "neighborhood")
      .eq("name", list.location.neighborhood)
      .eq("parent_id", cityId)
      .limit(1)
      .returns<DestinationRow[]>();

    neighborhoodId = data?.[0]?.id ?? null;
  }

  return {
    destinationId: neighborhoodId ?? cityId,
    cityId,
    neighborhoodId,
  };
}

async function getExistingEntry(supabase: SupabaseClient, listId: string) {
  const { data, error } = await supabase
    .from("entries")
    .select("id,slug,user_id,source_table,submission_type")
    .eq("legacy_id", listId)
    .limit(1)
    .returns<EntryRow[]>();

  if (error) throw error;
  return data?.[0] ?? null;
}

async function getAvailableEntrySlug(supabase: SupabaseClient, baseSlug: string, existingEntryId: string | null) {
  const base = slugify(baseSlug) || `guide-${Date.now()}`;

  for (let index = 0; index < 8; index += 1) {
    const slug = index === 0 ? base : `${base}-${index + 1}`;
    const { data, error } = await supabase
      .from("entries")
      .select("id")
      .eq("slug", slug)
      .limit(1)
      .returns<Array<{ id: string }>>();

    if (error) throw error;
    if (!data?.[0] || data[0].id === existingEntryId) {
      return slug;
    }
  }

  return `${base}-${Date.now()}`;
}

async function getVenueById(supabase: SupabaseClient, venueId: string | undefined) {
  if (!isUuid(venueId)) return null;

  const { data } = await supabase
    .from("venues")
    .select("id,legacy_id,slug,name,normalized_name,city_id,coordinates,merged_into_venue_id")
    .eq("id", venueId)
    .is("merged_into_venue_id", null)
    .limit(1)
    .returns<VenueRow[]>();

  return data?.[0] ?? null;
}

async function getVenueByExternalRef(supabase: SupabaseClient, externalPlace: ExternalPlaceReference | null) {
  if (!externalPlace?.providerPlaceId) return null;

  const { data: refRows } = await supabase
    .from("venue_external_refs")
    .select("venue_id")
    .eq("provider", externalPlace.provider)
    .eq("provider_place_id", externalPlace.providerPlaceId)
    .limit(1)
    .returns<VenueExternalRefRow[]>();

  return getVenueById(supabase, refRows?.[0]?.venue_id);
}

async function getVenueByLegacyId(supabase: SupabaseClient, poiId: string | undefined) {
  const cleanedPoiId = optionalText(poiId, 240);

  if (!cleanedPoiId) return null;

  const { data } = await supabase
    .from("venues")
    .select("id,legacy_id,slug,name,normalized_name,city_id,coordinates,merged_into_venue_id")
    .eq("legacy_id", cleanedPoiId)
    .is("merged_into_venue_id", null)
    .limit(1)
    .returns<VenueRow[]>();

  return data?.[0] ?? null;
}

async function getVenueByName(supabase: SupabaseClient, params: {
  cityId: string | null;
  name: string;
  coordinates: Coordinates | null;
}) {
  const normalizedName = normalizeName(params.name);
  if (!normalizedName || !params.cityId) return null;

  const { data: exactRows } = await supabase
    .from("venues")
    .select("id,legacy_id,slug,name,normalized_name,city_id,coordinates,merged_into_venue_id")
    .eq("city_id", params.cityId)
    .eq("normalized_name", normalizedName)
    .is("merged_into_venue_id", null)
    .limit(20)
    .returns<VenueRow[]>();

  if (exactRows?.length) {
    if (params.coordinates) {
      const nearbyExact = exactRows.find(
        (candidate) => distanceMeters(toCoordinates(candidate.coordinates), params.coordinates) <= 75,
      );

      if (nearbyExact) {
        return nearbyExact;
      }
    } else if (exactRows.length === 1) {
      return exactRows[0];
    }
  }

  const firstToken = normalizedName.split(" ")[0];
  if (!firstToken || firstToken.length < 3) {
    return null;
  }

  const { data: candidates } = await supabase
    .from("venues")
    .select("id,legacy_id,slug,name,normalized_name,city_id,coordinates,merged_into_venue_id")
    .eq("city_id", params.cityId)
    .is("merged_into_venue_id", null)
    .ilike("normalized_name", `%${firstToken}%`)
    .limit(20)
    .returns<VenueRow[]>();

  return (
    candidates?.find((candidate) => {
      const candidateName = candidate.normalized_name || normalizeName(candidate.name);
      if (candidateName === normalizedName) return true;
      if (distanceMeters(toCoordinates(candidate.coordinates), params.coordinates) > 75) return false;
      return candidateName.includes(normalizedName) || normalizedName.includes(candidateName);
    }) ?? null
  );
}

async function getAvailableVenueSlug(supabase: SupabaseClient, cityId: string | null, baseSlug: string) {
  const base = slugify(baseSlug) || `venue-${Date.now()}`;

  for (let index = 0; index < 8; index += 1) {
    const slug = index === 0 ? base : `${base}-${index + 1}`;
    let query = supabase
      .from("venues")
      .select("id")
      .eq("slug", slug)
      .limit(1);

    query = cityId ? query.eq("city_id", cityId) : query.is("city_id", null);

    const { data, error } = await query.returns<Array<{ id: string }>>();
    if (error) throw error;
    if (!data?.[0]) return slug;
  }

  return `${base}-${Date.now()}`;
}

async function createUserSubmittedVenue(supabase: SupabaseClient, params: {
  user: SupabaseUser;
  list: MapList;
  stop: GuideStop;
  cityId: string | null;
  neighborhoodId: string | null;
  externalPlace: ExternalPlaceReference | null;
}) {
  const name = cleanText(params.stop.name || params.externalPlace?.label, 220);
  if (!name) return null;

  const coordinates = toCoordinates(params.stop.coordinates) ?? params.externalPlace?.coordinates ?? null;
  const normalizedName = normalizeName(name);
  const venueKind = inferVenueKind(params.stop, params.list.category);
  const slug = await getAvailableVenueSlug(
    supabase,
    params.cityId,
    params.stop.poiId ?? params.externalPlace?.providerPlaceId ?? name,
  );

  const { data, error } = await supabase
    .from("venues")
    .insert({
      legacy_id: optionalText(params.stop.poiId, 240),
      slug,
      name,
      normalized_name: normalizedName,
      aliases: [],
      destination_id: params.neighborhoodId ?? params.cityId,
      city_id: params.cityId,
      neighborhood_id: params.neighborhoodId,
      address_line1: optionalText(params.externalPlace?.addressLine1, 260),
      address_line2: optionalText(params.externalPlace?.addressLine2, 260),
      locality: optionalText(params.externalPlace?.city, 120) ?? params.list.location.city ?? null,
      region: optionalText(params.externalPlace?.state, 120),
      postal_code: optionalText(params.externalPlace?.postcode, 40),
      country: optionalText(params.externalPlace?.country, 120) ?? params.list.location.country,
      coordinates,
      official_url: optionalText(params.stop.officialUrl, 500) ?? optionalText(params.externalPlace?.url, 500),
      source_metadata: {
        source: "user_submission",
        entryId: params.list.id,
        stopId: params.stop.id,
        externalPlace: params.externalPlace,
      },
      venue_kind: venueKind,
      venue_kinds: [venueKind],
      lodging_type: params.stop.lodgingType ?? null,
      food_service_type: params.stop.foodServiceType ?? null,
      cuisine_types: params.stop.cuisineTypes ?? [],
      nightlife_type: params.stop.nightlifeType ?? null,
      music_genres: params.stop.musicGenres ?? [],
      attribute_tags: params.stop.attributeTags ?? params.stop.tags ?? [],
      created_by: params.user.id,
      created_source: "user_submission",
      moderation_status: "pending",
      last_user_submitted_at: new Date().toISOString(),
    })
    .select("id,legacy_id,slug,name,normalized_name,city_id,coordinates,merged_into_venue_id")
    .returns<VenueRow[]>();

  if (error) {
    const existing = await getVenueByName(supabase, {
      cityId: params.cityId,
      name,
      coordinates,
    });

    if (existing) return existing;
    throw error;
  }

  return data?.[0] ?? null;
}

async function upsertExternalRef(supabase: SupabaseClient, params: {
  user: SupabaseUser;
  venueId: string | null;
  externalPlace: ExternalPlaceReference | null;
  listId: string;
  stopId: string;
}) {
  if (!params.venueId || !params.externalPlace?.providerPlaceId) {
    return;
  }

  const payload = {
    venue_id: params.venueId,
    provider: params.externalPlace.provider,
    provider_place_id: params.externalPlace.providerPlaceId,
    provider_url: params.externalPlace.url ?? null,
    label: params.externalPlace.label ?? null,
    confidence: 0.82,
    raw_metadata: {
      source: "user_submission",
      entryId: params.listId,
      stopId: params.stopId,
      externalPlace: params.externalPlace,
    },
    created_by: params.user.id,
  };

  const { error } = await supabase
    .from("venue_external_refs")
    .upsert(payload, { onConflict: "provider,provider_place_id", ignoreDuplicates: true });

  if (error) throw error;
}

async function resolveVenue(supabase: SupabaseClient, params: {
  user: SupabaseUser;
  list: MapList;
  stop: GuideStop;
  cityId: string | null;
  neighborhoodId: string | null;
}) {
  const externalPlace = sanitizeExternalPlace(params.stop.externalPlace);
  const coordinates = toCoordinates(params.stop.coordinates) ?? externalPlace?.coordinates ?? null;
  const directVenue =
    (await getVenueById(supabase, params.stop.venueId)) ??
    (await getVenueByExternalRef(supabase, externalPlace)) ??
    (await getVenueByLegacyId(supabase, params.stop.poiId)) ??
    (await getVenueByName(supabase, {
      cityId: params.cityId,
      name: params.stop.name,
      coordinates,
    }));

  const venue =
    directVenue ??
    (await createUserSubmittedVenue(supabase, {
      user: params.user,
      list: params.list,
      stop: params.stop,
      cityId: params.cityId,
      neighborhoodId: params.neighborhoodId,
      externalPlace,
    }));

  await upsertExternalRef(supabase, {
    user: params.user,
    venueId: venue?.id ?? null,
    externalPlace,
    listId: params.list.id,
    stopId: params.stop.id,
  });

  return { venue, externalPlace };
}

async function resolveStopTree(supabase: SupabaseClient, params: {
  user: SupabaseUser;
  list: MapList;
  stop: GuideStop;
  cityId: string | null;
  neighborhoodId: string | null;
}): Promise<GuideStop> {
  const { venue, externalPlace } = await resolveVenue(supabase, params);
  const places = params.stop.places
    ? await Promise.all(
        params.stop.places.map((place) =>
          resolveStopTree(supabase, {
            ...params,
            stop: place,
          }),
        ),
      )
    : undefined;

  return {
    ...params.stop,
    venueId: venue?.id ?? params.stop.venueId,
    sourceVenueId: params.stop.sourceVenueId ?? params.stop.venueId,
    externalPlace: externalPlace ?? params.stop.externalPlace,
    places,
  };
}

function toCanonicalNestedPlaces(value: unknown): CanonicalNestedPlace[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((candidate) => {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return [];
    const record = candidate as Record<string, unknown>;
    const id = optionalText(record.id, 240);
    if (!id) return [];
    const venueId = optionalText(record.venueId ?? record.venue_id, 40);

    return [{
      id,
      venueId: isUuid(venueId) ? venueId : null,
      places: toCanonicalNestedPlaces(record.places),
    }];
  });
}

function collectCanonicalVenueIds(places: CanonicalNestedPlace[], venueIds: Set<string>) {
  for (const place of places) {
    if (place.venueId) venueIds.add(place.venueId);
    collectCanonicalVenueIds(place.places, venueIds);
  }
}

function collectSourceReferences(stops: GuideStop[]) {
  const sourceListIds = new Set<string>();
  const sourceStopIds = new Set<string>();
  const stack = [...stops];

  while (stack.length) {
    const stop = stack.pop();
    if (!stop) continue;
    const sourceListId = optionalText(stop.sourceListId, 240);
    const sourceStopId = optionalText(stop.sourceStopId, 240);
    if (sourceListId) sourceListIds.add(sourceListId);
    if (sourceStopId) sourceStopIds.add(sourceStopId);
    if (stop.places?.length) stack.push(...stop.places);
  }

  return {
    sourceListIds: [...sourceListIds],
    sourceStopIds: [...sourceStopIds],
  };
}

async function validateRegularGuideSources(
  supabase: SupabaseClient,
  stops: GuideStop[],
): Promise<{ ok: true; stops: GuideStop[] } | { ok: false; error: string }> {
  const invalidSourceError =
    "Regular guides can only contain venues added from published RGuide guides.";
  const { sourceListIds, sourceStopIds } = collectSourceReferences(stops);

  if (!sourceListIds.length || !sourceStopIds.length) {
    return { ok: false, error: invalidSourceError };
  }

  const { data: sourceEntries, error: entryError } = await supabase
    .from("entries")
    .select("id,legacy_id")
    .eq("source_table", "editorial_guides")
    .eq("status", "published")
    .eq("submission_type", "guide")
    .in("legacy_id", sourceListIds)
    .returns<EditorialSourceEntryRow[]>();

  if (entryError) throw entryError;

  const entryByLegacyId = new Map((sourceEntries ?? []).map((entry) => [entry.legacy_id, entry]));
  if (sourceListIds.some((sourceListId) => !entryByLegacyId.has(sourceListId))) {
    return { ok: false, error: invalidSourceError };
  }

  const entryIds = (sourceEntries ?? []).map((entry) => entry.id);
  const { data: sourceStops, error: stopError } = await supabase
    .from("entry_stops")
    .select("entry_id,legacy_id,venue_id,places")
    .in("entry_id", entryIds)
    .in("legacy_id", sourceStopIds)
    .returns<EditorialSourceStopRow[]>();

  if (stopError) throw stopError;

  const sourceStopByKey = new Map(
    (sourceStops ?? []).map((stop) => [`${stop.entry_id}:${stop.legacy_id}`, stop]),
  );
  const canonicalPlacesByStopKey = new Map<string, CanonicalNestedPlace[]>();
  const canonicalVenueIds = new Set<string>();

  for (const sourceStop of sourceStops ?? []) {
    const key = `${sourceStop.entry_id}:${sourceStop.legacy_id}`;
    const canonicalPlaces = toCanonicalNestedPlaces(sourceStop.places);
    canonicalPlacesByStopKey.set(key, canonicalPlaces);
    if (sourceStop.venue_id) canonicalVenueIds.add(sourceStop.venue_id);
    collectCanonicalVenueIds(canonicalPlaces, canonicalVenueIds);
  }

  const approvedVenueIds = new Set<string>();
  if (canonicalVenueIds.size) {
    const { data: approvedVenues, error: venueError } = await supabase
      .from("venues")
      .select("id")
      .in("id", [...canonicalVenueIds])
      .eq("moderation_status", "approved")
      .is("merged_into_venue_id", null)
      .returns<Array<{ id: string }>>();

    if (venueError) throw venueError;
    for (const venue of approvedVenues ?? []) approvedVenueIds.add(venue.id);
  }

  function validateNestedStop(
    stop: GuideStop,
    sourceListId: string,
    candidates: CanonicalNestedPlace[],
  ): GuideStop | null {
    if (
      stop.sourceKind !== "stop" ||
      stop.sourceListId !== sourceListId ||
      !stop.sourceStopId
    ) {
      return null;
    }

    const candidate = candidates.find((place) => place.id === stop.sourceStopId);
    if (!candidate) return null;
    if (candidate.venueId && !approvedVenueIds.has(candidate.venueId)) return null;

    const places = stop.places?.map((place) =>
      validateNestedStop(place, sourceListId, candidate.places),
    );
    if (places?.some((place) => !place)) return null;

    return {
      ...stop,
      sourceKind: "stop",
      sourceListId,
      sourceStopId: candidate.id,
      venueId: candidate.venueId ?? undefined,
      sourceVenueId: candidate.venueId ?? undefined,
      externalPlace: undefined,
      places: places as GuideStop[] | undefined,
    };
  }

  function validateTopLevelStop(stop: GuideStop, expectedListId?: string): GuideStop | null {
    const sourceListId = optionalText(stop.sourceListId, 240);
    if (!sourceListId || (expectedListId && sourceListId !== expectedListId)) return null;

    const sourceEntry = entryByLegacyId.get(sourceListId);
    if (!sourceEntry) return null;

    if (stop.sourceKind === "guide") {
      if (!stop.places?.length || stop.sourceStopId) return null;
      const places = stop.places.map((place) => validateTopLevelStop(place, sourceListId));
      if (places.some((place) => !place)) return null;

      return {
        ...stop,
        sourceKind: "guide",
        sourceListId,
        venueId: undefined,
        sourceVenueId: undefined,
        externalPlace: undefined,
        places: places as GuideStop[],
      };
    }

    if (stop.sourceKind !== "stop" || !stop.sourceStopId) return null;
    const sourceKey = `${sourceEntry.id}:${stop.sourceStopId}`;
    const sourceStop = sourceStopByKey.get(sourceKey);
    if (!sourceStop?.venue_id || !approvedVenueIds.has(sourceStop.venue_id)) return null;

    const places = stop.places?.map((place) =>
      validateNestedStop(place, sourceListId, canonicalPlacesByStopKey.get(sourceKey) ?? []),
    );
    if (places?.some((place) => !place)) return null;

    return {
      ...stop,
      sourceKind: "stop",
      sourceListId,
      sourceStopId: sourceStop.legacy_id,
      venueId: sourceStop.venue_id,
      sourceVenueId: sourceStop.venue_id,
      externalPlace: undefined,
      places: places as GuideStop[] | undefined,
    };
  }

  const validatedStops = stops.map((stop) => validateTopLevelStop(stop));
  if (validatedStops.some((stop) => !stop)) {
    return { ok: false, error: invalidSourceError };
  }

  return { ok: true, stops: validatedStops as GuideStop[] };
}

function stopMetadata(stop: GuideStop) {
  return JSON.parse(JSON.stringify({
    submittedFrom: "browser",
    sourceKind: stop.sourceKind,
    sourceListId: stop.sourceListId,
    sourceStopId: stop.sourceStopId,
    sourceVenueId: stop.sourceVenueId ?? stop.venueId,
    externalPlace: sanitizeExternalPlace(stop.externalPlace),
    defaultDescription: stop.defaultDescription,
    routeCoordinates: stop.routeCoordinates,
  }));
}

function buildSubmittedEntryPayload(params: {
  list: MapList;
  user: SupabaseUser;
  slug: string;
  visibility: GuideVisibility;
  status: "draft" | "published";
  destinationId: string | null;
  cityId: string | null;
  neighborhoodId: string | null;
  stopCount: number;
}) {
  const { list, user, slug, visibility, status, destinationId, cityId, neighborhoodId, stopCount } = params;

  return {
    legacy_id: list.id,
    slug,
    seo_slug: list.seoSlug ?? null,
    seo_title: list.seoTitle ?? null,
    seo_description: list.seoDescription ?? null,
    title: cleanText(list.title, 140),
    description: cleanText(list.description, 2400),
    highlights: list.highlights ?? [],
    photo_url: list.photo ?? null,
    canonical_url: list.url,
    category: list.category,
    submission_type: toSchemaSubmissionType(list.submissionType),
    status,
    destination_id: destinationId,
    city_id: cityId,
    neighborhood_id: neighborhoodId,
    country_name: list.location.country,
    continent_name: list.location.continent,
    creator_id: user.id,
    creator_name: list.creator.name,
    creator_avatar: list.creator.avatar,
    user_id: user.id,
    upvotes: list.upvotes ?? 0,
    created_on: dateOnly(list.createdAt) ?? new Date().toISOString().slice(0, 10),
    journey_start_date: dateOnly(list.journey?.startDate ?? list.itinerary?.startDate),
    journey_end_date: dateOnly(list.journey?.endDate ?? list.itinerary?.endDate),
    journal_visited_at: dateOnly(list.journal?.visitedAt),
    journal_note: list.journal?.note ?? null,
    journal_visibility:
      list.submissionType === "journal"
        ? visibility === "public"
          ? "public"
          : "private"
        : null,
    metadata: {
      submittedFrom: "browser",
      savePath: "server_resolved_venues",
      visibility,
      stopCount,
    },
  };
}

function buildSubmittedStopPayload(stop: GuideStop, index: number, destinationId: string | null) {
  return {
    legacy_id: stop.id,
    stop_order: index,
    poi_legacy_id: stop.poiId ?? null,
    name: cleanText(stop.name, 220),
    description: cleanText(stop.description, 2400),
    category: stop.category ?? null,
    subcategory: stop.subcategory ?? null,
    subcategories: stop.subcategories ?? [],
    destination_id: destinationId,
    venue_id: stop.venueId ?? null,
    coordinates: toEntryCoordinates(stop.coordinates),
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
    metadata: stopMetadata(stop),
  };
}

async function saveSubmittedGuideTransaction(
  supabase: SupabaseClient,
  entryPayload: ReturnType<typeof buildSubmittedEntryPayload>,
  stopPayloads: ReturnType<typeof buildSubmittedStopPayload>[],
) {
  const { data, error } = await supabase.rpc("save_submitted_guide_transaction", {
    p_entry: entryPayload,
    p_stops: stopPayloads,
  });

  if (error) throw error;
  if (!data || typeof data !== "string") {
    throw new Error("Submitted guide transaction did not return an entry id.");
  }

  return data;
}

async function deleteSubmittedGuideTransaction(
  supabase: SupabaseClient,
  params: { entryId: string; userId: string },
) {
  const { data, error } = await supabase.rpc("delete_submitted_guide_transaction", {
    p_entry_id: params.entryId,
    p_user_id: params.userId,
  });

  if (error) throw error;
  return data === true;
}

function validateList(list: MapList) {
  const maxStops = getNumberEnv("USER_GUIDE_MAX_STOPS", 200);
  const title = cleanText(list.title, 140);
  const description = cleanText(list.description, 2400);
  const stops = Array.isArray(list.stops) ? list.stops : [];

  if (title.length < 3) {
    return { ok: false as const, error: "Give this guide a title before saving." };
  }

  if (description.length < 10) {
    return { ok: false as const, error: "Add a short description before saving." };
  }

  if (!stops.length) {
    return { ok: false as const, error: "Add at least one stop before saving." };
  }

  const stopTree: Array<{ stop: GuideStop; depth: number }> = stops.map((stop) => ({ stop, depth: 1 }));
  const allStops: GuideStop[] = [];
  let hasExcessiveDepth = false;

  while (stopTree.length && allStops.length <= maxStops) {
    const current = stopTree.pop();
    if (!current) continue;
    allStops.push(current.stop);
    if (current.depth >= 8 && current.stop.places?.length) {
      hasExcessiveDepth = true;
      break;
    }
    for (const place of current.stop.places ?? []) {
      stopTree.push({ stop: place, depth: current.depth + 1 });
    }
  }

  if (allStops.length > maxStops) {
    return { ok: false as const, error: `This guide has too many stops. Keep it under ${maxStops}.` };
  }

  if (hasExcessiveDepth) {
    return { ok: false as const, error: "This guide has too many nested stop levels." };
  }

  const emptyStop = allStops.find((stop) => !cleanText(stop.name, 220) || !cleanText(stop.description, 2400));
  if (emptyStop) {
    return { ok: false as const, error: "Every stop needs a name and description before saving." };
  }

  return { ok: true as const };
}

export async function POST(request: NextRequest) {
  const service = getSupabaseServiceClient();
  const { user, error: userError } = await getAuthenticatedSupabaseUser(request);

  if (!service) {
    return NextResponse.json({ error: "Supabase service role is not configured." }, { status: 500 });
  }

  if (!user) {
    return NextResponse.json({ error: userError ?? "Sign in before saving." }, { status: 401 });
  }

  const rateLimit = await checkRateLimit(request, {
    namespace: "submitted-guides:write",
    limit: getNumberEnv("USER_GUIDE_WRITE_LIMIT_PER_10_MINUTES", 40),
    windowMs: 10 * 60_000,
    keyParts: [user.id],
  });

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit);
  }

  const json = (body: unknown, init?: ResponseInit) =>
    withRateLimitHeaders(NextResponse.json(body, init), rateLimit);

  let list: MapList;
  try {
    const payload = (await request.json()) as { list?: MapList };
    if (!payload.list) throw new Error("Missing list.");
    list = withAuthenticatedCreator(payload.list, user);
  } catch {
    return json({ error: "Invalid guide payload." }, { status: 400 });
  }

  const validation = validateList(list);
  if (!validation.ok) {
    return json({ error: validation.error }, { status: 400 });
  }

  try {
    const existingEntry = await getExistingEntry(service, list.id);

    if (existingEntry?.source_table && existingEntry.source_table !== "submitted_guides") {
      return json({ error: "That guide id belongs to canonical content." }, { status: 409 });
    }

    if (existingEntry?.user_id && existingEntry.user_id !== user.id) {
      return json({ error: "You can only edit your own guides." }, { status: 403 });
    }

    const submissionType = toSchemaSubmissionType(list.submissionType);
    if (existingEntry && existingEntry.submission_type !== submissionType) {
      return json({ error: "A saved guide cannot be changed into a different entry type." }, { status: 409 });
    }

    if (!existingEntry) {
      const maxGuides = getNumberEnv("USER_GUIDE_MAX_GUIDES", 1000);
      const { count, error: countError } = await service
        .from("entries")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("source_table", "submitted_guides");

      if (countError) throw countError;

      if ((count ?? 0) >= maxGuides) {
        return json(
          { error: `Guide limit reached. Archive or delete a guide before creating more than ${maxGuides}.` },
          { status: 429 },
        );
      }
    }

    const requestedVisibility = getRequestedVisibility(list);
    const canPublishPublic = canPublishPublicGuides(user);

    if (requestedVisibility === "public" && !canPublishPublic) {
      return json(
        { error: "Your account is not allowed to publish public guides yet." },
        { status: 403 },
      );
    }

    const regularGuideSources =
      submissionType === "guide" && !canPublishPublic
        ? await validateRegularGuideSources(service, list.stops)
        : null;

    if (regularGuideSources && !regularGuideSources.ok) {
      return json({ error: regularGuideSources.error }, { status: 403 });
    }

    const { destinationId, cityId, neighborhoodId } = await resolveDestinationIds(service, list);
    const resolvedStops = regularGuideSources?.ok
      ? regularGuideSources.stops
      : await Promise.all(
          list.stops.map((stop) =>
            resolveStopTree(service, {
              user,
              list,
              stop,
              cityId,
              neighborhoodId,
            }),
          ),
        );
    const slug = await getAvailableEntrySlug(service, list.slug, existingEntry?.id ?? null);

    const visibility = requestedVisibility === "public" ? "public" : requestedVisibility;
    const status = visibility === "public" ? "published" : "draft";

    await saveSubmittedGuideTransaction(
      service,
      buildSubmittedEntryPayload({
        list,
        user,
        slug,
        visibility,
        status,
        destinationId,
        cityId,
        neighborhoodId,
        stopCount: resolvedStops.length,
      }),
      resolvedStops.map((stop, index) => buildSubmittedStopPayload(stop, index, neighborhoodId ?? cityId)),
    );

    return json({
      guide: {
        ...list,
        slug,
        visibility,
        journal: list.journal
          ? {
              ...list.journal,
              visibility: visibility === "public" ? "public" : "private",
            }
          : list.journal,
        stops: resolvedStops,
      },
    });
  } catch (error) {
    console.error("Failed to save submitted guide", error);
    return json({ error: "Guide could not be saved." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const service = getSupabaseServiceClient();
  const { user, error: userError } = await getAuthenticatedSupabaseUser(request);
  const listId = request.nextUrl.searchParams.get("id")?.trim();

  if (!service) {
    return NextResponse.json({ error: "Supabase service role is not configured." }, { status: 500 });
  }

  if (!user) {
    return NextResponse.json({ error: userError ?? "Sign in before deleting." }, { status: 401 });
  }

  const rateLimit = await checkRateLimit(request, {
    namespace: "submitted-guides:delete",
    limit: getNumberEnv("USER_GUIDE_DELETE_LIMIT_PER_10_MINUTES", 30),
    windowMs: 10 * 60_000,
    keyParts: [user.id],
  });

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit);
  }

  const json = (body: unknown, init?: ResponseInit) =>
    withRateLimitHeaders(NextResponse.json(body, init), rateLimit);

  if (!listId) {
    return json({ error: "Guide id is required." }, { status: 400 });
  }

  const existingEntry = await getExistingEntry(service, listId);

  if (!existingEntry) {
    return json({ ok: true });
  }

  if (existingEntry.user_id !== user.id) {
    return json({ error: "You can only delete your own guides." }, { status: 403 });
  }

  try {
    const deleted = await deleteSubmittedGuideTransaction(service, {
      entryId: existingEntry.id,
      userId: user.id,
    });

    if (!deleted) {
      return json({ error: "Guide could not be deleted." }, { status: 404 });
    }
  } catch (error) {
    console.error("Failed to delete submitted guide", error);
    return json({ error: "Guide could not be deleted." }, { status: 500 });
  }

  return json({ ok: true });
}
