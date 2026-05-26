import type { GuideStop } from "@/types";

export const STAY22_AID = process.env.NEXT_PUBLIC_STAY22_AID ?? "rguide";

const STAY22_ALLEZ_BASE_URL = "https://www.stay22.com/allez/roam";

type Stay22AllezUrlInput = {
  campaign: string;
  address?: string | null;
  hotelName?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  checkIn?: string | null;
  checkOut?: string | null;
  guests?: number | null;
  rooms?: number | null;
};

type Stay22DestinationUrlInput = {
  city?: string | null;
  country?: string | null;
  neighborhood?: string | null;
  campaign: string;
};

type Stay22StopUrlInput = {
  stop: GuideStop;
  city?: string | null;
  country?: string | null;
  neighborhood?: string | null;
  campaign: string;
};

function hasText(value?: string | null): value is string {
  return Boolean(value?.trim());
}

function normalizeCampaign(value: string) {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);

  return normalized || "rguide";
}

function appendTextParam(url: URL, key: string, value?: string | null) {
  if (hasText(value)) {
    url.searchParams.set(key, value.trim());
  }
}

function appendNumberParam(url: URL, key: string, value?: number | null) {
  if (typeof value === "number" && Number.isFinite(value)) {
    url.searchParams.set(key, String(value));
  }
}

export function buildStay22AllezUrl(input: Stay22AllezUrlInput) {
  const url = new URL(STAY22_ALLEZ_BASE_URL);

  url.searchParams.set("aid", STAY22_AID);
  url.searchParams.set("campaign", normalizeCampaign(input.campaign));
  appendTextParam(url, "address", input.address);
  appendTextParam(url, "hotelname", input.hotelName);
  appendTextParam(url, "checkin", input.checkIn);
  appendTextParam(url, "checkout", input.checkOut);
  appendNumberParam(url, "lat", input.latitude);
  appendNumberParam(url, "lng", input.longitude);
  appendNumberParam(url, "guests", input.guests);
  appendNumberParam(url, "rooms", input.rooms);

  return url.toString();
}

export function buildStay22DestinationUrl({ city, country, neighborhood, campaign }: Stay22DestinationUrlInput) {
  return buildStay22AllezUrl({
    campaign,
    address: [neighborhood, city, country].filter(hasText).join(", "),
  });
}

export function buildStay22StopUrl({ stop, city, country, neighborhood, campaign }: Stay22StopUrlInput) {
  const [latitude, longitude] = stop.coordinates ?? [];

  return buildStay22AllezUrl({
    campaign,
    hotelName: stop.name,
    address: [stop.name, neighborhood, city, country].filter(hasText).join(", "),
    latitude,
    longitude,
  });
}

export function isStay22Url(url?: string | null): url is string {
  if (!url) {
    return false;
  }

  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return hostname === "stay22.com" || hostname.endsWith(".stay22.com");
  } catch {
    return false;
  }
}
