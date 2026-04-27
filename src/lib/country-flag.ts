import { getCountryCode } from "countries-list";

const COUNTRY_NAME_ALIASES: Record<string, string> = {
  "the bahamas": "BS",
  bahamas: "BS",
  "united states": "US",
  usa: "US",
  "united kingdom": "GB",
  uk: "GB",
  czechia: "CZ",
  macedonia: "MK",
  kosovo: "XK",
  "northern cyprus": "CY",
  russia: "RU",
  turkey: "TR",
  turkiye: "TR",
  "south korea": "KR",
  "north korea": "KP",
  myanmar: "MM",
  burma: "MM",
  vietnam: "VN",
  laos: "LA",
  moldova: "MD",
};

function codeToFlagEmoji(code: string) {
  const normalized = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) {
    return null;
  }

  const [first, second] = normalized;
  const base = 127397;
  return String.fromCodePoint(first.charCodeAt(0) + base, second.charCodeAt(0) + base);
}

function normalizeCountryName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

export function getCountryFlagEmoji(countryName: string) {
  const normalized = normalizeCountryName(countryName);
  const alias = COUNTRY_NAME_ALIASES[normalized] ?? null;
  const lookupName = alias ? null : countryName;
  const countryCode = alias ?? getCountryCode(lookupName ?? "") ?? null;
  return countryCode ? codeToFlagEmoji(countryCode) : null;
}
