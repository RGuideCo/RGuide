import type { GuideStop } from "@/types";

export const STAY22_AID = process.env.NEXT_PUBLIC_STAY22_AID ?? "rguide";
export const STAY22_LMA_ID = process.env.NEXT_PUBLIC_STAY22_LMA_ID?.trim() || "6a16094744a8f50eb135b857";

const STAY22_BOOKING_BASE_URL = "https://www.stay22.com/allez/booking";
const STAY22_AGODA_BASE_URL = "https://www.stay22.com/allez/agoda";

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
  targetUrl?: string | null;
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

type AgodaStaySearchUrlInput = {
  stop?: GuideStop | null;
  city?: string | null;
  country?: string | null;
  neighborhood?: string | null;
  campaign?: string | null;
};

type StayAffiliatePreferenceInput = {
  stop?: Pick<GuideStop, "venueKind" | "lodgingType"> | null;
  category?: string | null;
  city?: string | null;
  country?: string | null;
  continent?: string | null;
};

function hasText(value?: string | null): value is string {
  return Boolean(value?.trim());
}

function normalizeKey(value?: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
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

const AGODA_ASIA_COUNTRIES = new Set([
  "afghanistan",
  "armenia",
  "azerbaijan",
  "bahrain",
  "bangladesh",
  "bhutan",
  "brunei",
  "cambodia",
  "china",
  "georgia",
  "hong-kong",
  "india",
  "indonesia",
  "iran",
  "iraq",
  "israel",
  "japan",
  "jordan",
  "kazakhstan",
  "kuwait",
  "kyrgyzstan",
  "laos",
  "lebanon",
  "macau",
  "malaysia",
  "maldives",
  "mongolia",
  "myanmar",
  "nepal",
  "north-korea",
  "oman",
  "pakistan",
  "palestine",
  "philippines",
  "qatar",
  "saudi-arabia",
  "singapore",
  "south-korea",
  "sri-lanka",
  "syria",
  "taiwan",
  "tajikistan",
  "thailand",
  "timor-leste",
  "turkey",
  "turkmenistan",
  "uae",
  "united-arab-emirates",
  "uzbekistan",
  "vietnam",
  "yemen",
]);

const COMMERCIAL_LODGING_SOURCE_HOSTS = new Set([
  "booking.com",
  "hostelworld.com",
]);

function isAgodaAsiaDestination({ continent, country }: Pick<StayAffiliatePreferenceInput, "continent" | "country">) {
  return normalizeKey(continent) === "asia" || AGODA_ASIA_COUNTRIES.has(normalizeKey(country));
}

export function shouldUseAgodaForStay(input: StayAffiliatePreferenceInput) {
  const isStayCategory = input.category === "Stay";
  const isLodgingStop = input.stop?.venueKind === "lodging" || Boolean(input.stop?.lodgingType);

  return (
    (isStayCategory || isLodgingStop) &&
    isAgodaAsiaDestination(input)
  );
}

export function buildAgodaStaySearchUrl(input: AgodaStaySearchUrlInput) {
  const { stop, city, country, neighborhood, campaign } = input;
  const [latitude, longitude] = stop?.coordinates ?? [];
  const url = new URL(STAY22_AGODA_BASE_URL);
  const address = [neighborhood, city, country].filter(hasText).join(", ");

  url.searchParams.set("aid", STAY22_AID);
  url.searchParams.set("campaign", normalizeCampaign(campaign || `agoda_asia_stay_${city ?? "destination"}`));
  appendTextParam(url, "address", address);
  appendTextParam(url, "hotelname", stop?.name);
  appendNumberParam(url, "lat", latitude);
  appendNumberParam(url, "lng", longitude);

  return url.toString();
}

export function isCommercialLodgingSourceUrl(url?: string | null) {
  if (!url) {
    return false;
  }

  try {
    const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    return (
      COMMERCIAL_LODGING_SOURCE_HOSTS.has(hostname) ||
      Array.from(COMMERCIAL_LODGING_SOURCE_HOSTS).some((host) => hostname.endsWith(`.${host}`))
    );
  } catch {
    return false;
  }
}

export function buildStay22AllezUrl(input: Stay22AllezUrlInput) {
  const url = new URL(STAY22_BOOKING_BASE_URL);

  url.searchParams.set("aid", STAY22_AID);
  url.searchParams.set("campaign", normalizeCampaign(input.campaign));
  if (hasText(input.targetUrl)) {
    url.searchParams.set("link", input.targetUrl.trim());
  } else {
    appendTextParam(url, "address", input.address);
    appendTextParam(url, "hotelname", input.hotelName);
    appendNumberParam(url, "lat", input.latitude);
    appendNumberParam(url, "lng", input.longitude);
  }
  appendTextParam(url, "checkin", input.checkIn);
  appendTextParam(url, "checkout", input.checkOut);
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
    targetUrl: isBookingComUrl(stop.bookingUrl) ? stop.bookingUrl : undefined,
  });
}

function isBookingComUrl(url?: string | null) {
  if (!url) {
    return false;
  }

  try {
    const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    return hostname === "booking.com" || hostname.endsWith(".booking.com");
  } catch {
    return false;
  }
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
