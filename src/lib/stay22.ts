import type { GuideStop } from "@/types";

export const STAY22_AID = process.env.NEXT_PUBLIC_STAY22_AID ?? "rguide";
export const STAY22_LMA_ID = process.env.NEXT_PUBLIC_STAY22_LMA_ID?.trim() || "6a16094744a8f50eb135b857";

const STAY22_ALLEZ_BASE_URL = "https://www.stay22.com/allez/roam";
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

const AGODA_SEARCH_BASE_URL = "https://www.agoda.com/search";
const AGODA_CITY_IDS: Record<string, string> = {
  "bangkok-thailand": "9395",
  "hanoi-vietnam": "2758",
  "hong-kong-hong-kong": "16808",
  "tokyo-japan": "5085",
};

const AGODA_ASIA_COUNTRIES = new Set([
  "hong-kong",
  "japan",
  "south-korea",
  "thailand",
  "vietnam",
]);

const COMMERCIAL_LODGING_SOURCE_HOSTS = new Set([
  "booking.com",
  "hostelworld.com",
]);

function getAgodaCityId(city?: string | null, country?: string | null) {
  return AGODA_CITY_IDS[[normalizeKey(city), normalizeKey(country)].filter(Boolean).join("-")];
}

function isAgodaAsiaDestination({ continent, country }: Pick<StayAffiliatePreferenceInput, "continent" | "country">) {
  return normalizeKey(continent) === "asia" || AGODA_ASIA_COUNTRIES.has(normalizeKey(country));
}

export function shouldUseAgodaForStay(input: StayAffiliatePreferenceInput) {
  const isStayCategory = input.category === "Stay";
  const isLodgingStop = input.stop?.venueKind === "lodging" || Boolean(input.stop?.lodgingType);

  return (
    (isStayCategory || isLodgingStop) &&
    isAgodaAsiaDestination(input) &&
    Boolean(getAgodaCityId(input.city, input.country))
  );
}

function buildRawAgodaStaySearchUrl({ stop, city, country, neighborhood }: AgodaStaySearchUrlInput) {
  const url = new URL(AGODA_SEARCH_BASE_URL);
  const cityId = getAgodaCityId(city, country);
  const searchText = [stop?.name, neighborhood, city, country].filter(hasText).join(", ");

  if (cityId) {
    url.searchParams.set("city", cityId);
  }
  appendTextParam(url, "text", searchText || [neighborhood, city, country].filter(hasText).join(", "));

  return url.toString();
}

export function buildAgodaStaySearchUrl(input: AgodaStaySearchUrlInput) {
  const { stop, city, country, neighborhood, campaign } = input;
  const agodaUrl = buildRawAgodaStaySearchUrl(input);
  const url = new URL(STAY22_AGODA_BASE_URL);
  const address = [neighborhood, city, country].filter(hasText).join(", ");

  url.searchParams.set("aid", STAY22_AID);
  url.searchParams.set("campaign", normalizeCampaign(campaign || `agoda_asia_stay_${city ?? "destination"}`));
  url.searchParams.set("product", "lma");
  url.searchParams.set("source", "direct");
  url.searchParams.set("medium", "deeplink");
  appendTextParam(url, "lmaID", STAY22_LMA_ID);
  appendTextParam(url, "address", address);
  appendTextParam(url, "hotelname", stop?.name);
  url.searchParams.set("link", agodaUrl);

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
