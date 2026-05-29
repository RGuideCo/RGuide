import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServiceClient } from "@/lib/supabase/server";
import type { ExternalPlaceReference } from "@/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DEFAULT_LIMIT = 8;

type Coordinates = [number, number];

type VenueRow = {
  id: string;
  legacy_id: string | null;
  slug: string;
  name: string;
  normalized_name: string;
  city_id: string | null;
  country: string | null;
  coordinates: unknown;
  address_line1: string | null;
  locality: string | null;
  region: string | null;
  official_url: string | null;
  venue_kind: string | null;
  lodging_type: string | null;
  food_service_type: string | null;
  cuisine_types: string[] | null;
  nightlife_type: string | null;
  music_genres: string[] | null;
  attribute_tags: string[] | null;
  primary_photo_id: string | null;
};

type DestinationRow = {
  id: string;
  name: string;
  coordinates: unknown;
};

type ExternalRefRow = {
  provider_place_id: string;
  venue_id: string;
};

type GeoapifyResult = {
  place_id?: string;
  formatted?: string;
  name?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
  lat?: number;
  lon?: number;
};

function slugish(value: string | undefined | null) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeName(value: string | undefined | null) {
  return slugish(value).replace(/-/g, " ").replace(/\s+/g, " ").trim();
}

function toCoordinates(value: unknown): Coordinates | undefined {
  if (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  ) {
    return [value[0], value[1]];
  }

  return undefined;
}

function distanceMeters(a?: Coordinates, b?: Coordinates) {
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

function isDuplicateVenue(
  internal: Array<{ label?: string; name?: string; coordinates?: Coordinates }>,
  candidate: { label?: string; name?: string; coordinates?: Coordinates },
) {
  const candidateName = normalizeName(candidate.label ?? candidate.name);

  return internal.some((venue) => {
    const venueName = normalizeName(venue.label ?? venue.name);
    if (candidateName && venueName === candidateName) return true;
    if (candidateName && venueName.includes(candidateName)) return true;
    if (candidateName && candidateName.includes(venueName)) return true;
    return distanceMeters(venue.coordinates, candidate.coordinates) < 75;
  });
}

function scoreVenue(row: VenueRow, query: string) {
  const normalizedQuery = normalizeName(query);
  const normalizedVenue = row.normalized_name || normalizeName(row.name);

  if (normalizedVenue === normalizedQuery) return 100;
  if (normalizedVenue.startsWith(normalizedQuery)) return 80;
  if (normalizedVenue.includes(normalizedQuery)) return 60;
  return 20;
}

function toInternalSuggestion(row: VenueRow) {
  const coordinates = toCoordinates(row.coordinates);
  const helperParts = [row.address_line1, row.locality, row.region, row.country].filter(Boolean);

  return {
    id: `venue:${row.id}`,
    provider: "rguide" as const,
    source: "internal" as const,
    venueId: row.id,
    poiId: row.legacy_id ?? undefined,
    label: row.name,
    helperText: helperParts.join(" • "),
    city: row.locality ?? undefined,
    state: row.region ?? undefined,
    country: row.country ?? undefined,
    coordinates,
    officialUrl: row.official_url ?? undefined,
    venueKind: row.venue_kind ?? undefined,
    lodgingType: row.lodging_type ?? undefined,
    foodServiceType: row.food_service_type ?? undefined,
    cuisineTypes: row.cuisine_types ?? [],
    nightlifeType: row.nightlife_type ?? undefined,
    musicGenres: row.music_genres ?? [],
    attributeTags: row.attribute_tags ?? [],
  };
}

function toExternalSuggestion(result: GeoapifyResult) {
  const label = (result.name || result.formatted || result.address_line1)?.trim();
  const coordinates =
    typeof result.lat === "number" && typeof result.lon === "number"
      ? ([result.lat, result.lon] as Coordinates)
      : undefined;

  if (!label || !result.place_id) {
    return null;
  }

  const externalPlace: ExternalPlaceReference = {
    provider: "geoapify",
    providerPlaceId: result.place_id,
    label,
    addressLine1: result.address_line1,
    addressLine2: result.address_line2,
    city: result.city,
    state: result.state,
    country: result.country,
    postcode: result.postcode,
    coordinates,
  };

  return {
    id: `geoapify:${result.place_id}`,
    provider: "geoapify" as const,
    source: "external" as const,
    label,
    helperText: [result.address_line1, result.city, result.state, result.country]
      .filter(Boolean)
      .join(" • "),
    city: result.city,
    state: result.state,
    country: result.country,
    coordinates,
    externalPlace,
  };
}

async function resolveCity(cityName: string | null, countryName: string | null) {
  const supabase = getSupabaseServiceClient();

  if (!supabase || !cityName) {
    return null;
  }

  let query = supabase
    .from("destinations")
    .select("id,name,coordinates")
    .eq("scope", "city")
    .eq("name", cityName)
    .limit(1);

  if (countryName) {
    query = query.eq("country_name", countryName);
  }

  const { data } = await query.returns<DestinationRow[]>();
  return data?.[0] ?? null;
}

async function loadInternalSuggestions(params: {
  query: string;
  cityId: string | null;
  country: string | null;
  limit: number;
}) {
  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return [];
  }

  const normalizedQuery = normalizeName(params.query);
  if (!normalizedQuery) {
    return [];
  }

  let query = supabase
    .from("venues")
    .select(
      [
        "id",
        "legacy_id",
        "slug",
        "name",
        "normalized_name",
        "city_id",
        "country",
        "coordinates",
        "address_line1",
        "locality",
        "region",
        "official_url",
        "venue_kind",
        "lodging_type",
        "food_service_type",
        "cuisine_types",
        "nightlife_type",
        "music_genres",
        "attribute_tags",
        "primary_photo_id",
      ].join(","),
    )
    .is("merged_into_venue_id", null)
    .ilike("normalized_name", `%${normalizedQuery}%`)
    .limit(Math.max(params.limit * 3, 12));

  if (params.cityId) {
    query = query.eq("city_id", params.cityId);
  } else if (params.country) {
    query = query.eq("country", params.country);
  }

  const { data, error } = await query.returns<VenueRow[]>();

  if (error) {
    console.error("Failed to search internal venues", error);
    return [];
  }

  return (data ?? [])
    .sort((left, right) => scoreVenue(right, params.query) - scoreVenue(left, params.query))
    .slice(0, params.limit)
    .map(toInternalSuggestion);
}

async function loadExternalSuggestions(params: {
  query: string;
  city: string | null;
  country: string | null;
  cityCoordinates?: Coordinates;
  limit: number;
}) {
  const apiKey = process.env.GEOAPIFY_API_KEY ?? process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

  if (!apiKey) {
    return [];
  }

  const endpoint = new URL("https://api.geoapify.com/v1/geocode/autocomplete");
  endpoint.searchParams.set("text", [params.query, params.city, params.country].filter(Boolean).join(", "));
  endpoint.searchParams.set("format", "json");
  endpoint.searchParams.set("limit", String(params.limit));
  endpoint.searchParams.set("apiKey", apiKey);

  if (params.cityCoordinates) {
    endpoint.searchParams.set("bias", `proximity:${params.cityCoordinates[1]},${params.cityCoordinates[0]}`);
  }

  const response = await fetch(endpoint.toString(), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    console.error("Geoapify place search failed", response.status);
    return [];
  }

  const payload = (await response.json()) as { results?: GeoapifyResult[] };
  return (payload.results ?? []).map(toExternalSuggestion).filter(Boolean);
}

async function getKnownExternalVenueIds(providerPlaceIds: string[]) {
  const supabase = getSupabaseServiceClient();

  if (!supabase || !providerPlaceIds.length) {
    return new Map<string, string>();
  }

  const { data } = await supabase
    .from("venue_external_refs")
    .select("provider_place_id,venue_id")
    .eq("provider", "geoapify")
    .in("provider_place_id", providerPlaceIds)
    .returns<ExternalRefRow[]>();

  return new Map((data ?? []).map((row) => [row.provider_place_id, row.venue_id]));
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("query")?.trim() ?? "";
  const city = searchParams.get("city")?.trim() || null;
  const country = searchParams.get("country")?.trim() || null;
  const requestedLimit = Number.parseInt(searchParams.get("limit") ?? "", 10);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 12)
    : DEFAULT_LIMIT;

  if (query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const cityRecord = await resolveCity(city, country);
  const cityCoordinates = toCoordinates(cityRecord?.coordinates);
  const internal = await loadInternalSuggestions({
    query,
    cityId: cityRecord?.id ?? null,
    country,
    limit,
  });

  const external = await loadExternalSuggestions({
    query,
    city,
    country,
    cityCoordinates,
    limit,
  });
  const knownExternalVenueIds = await getKnownExternalVenueIds(
    external
      .map((suggestion) => suggestion?.externalPlace?.providerPlaceId)
      .filter((id): id is string => Boolean(id)),
  );

  const externalWithKnownRefs = external
    .filter((suggestion): suggestion is NonNullable<typeof suggestion> => Boolean(suggestion))
    .filter((suggestion) => !isDuplicateVenue(internal, suggestion))
    .map((suggestion) => {
      const knownVenueId = suggestion.externalPlace?.providerPlaceId
        ? knownExternalVenueIds.get(suggestion.externalPlace.providerPlaceId)
        : null;

      return knownVenueId
        ? {
            ...suggestion,
            source: "internal" as const,
            provider: "rguide" as const,
            venueId: knownVenueId,
          }
        : suggestion;
    });

  return NextResponse.json(
    {
      suggestions: [...internal, ...externalWithKnownRefs].slice(0, limit),
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
