import type { GuideStop, ListSource, MapList } from "@/types";
import { US_NATURE_STOP_MEDIA } from "./us-nature-stop-media";

type NatureHours = NonNullable<GuideStop["hours"]>;

export interface NatureStopSeed {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  hours: NatureHours;
  officialUrl: string;
  photo?: string;
  imageSourceUrl?: string;
  mapQuery?: string;
  editorialUrls?: string[];
  subcategory?: string;
  attributeTags?: string[];
}

export interface NatureGuideSeed {
  city: string;
  country: string;
  continent: string;
  id: string;
  slug: string;
  seoSlug: string;
  seoTitle: string;
  seoDescription: string;
  title: string;
  description: string;
  createdAt: string;
  checkedAt: string;
  stops: NatureStopSeed[];
  sources: ListSource[];
}

export function natureStopFromExisting(
  stop: GuideStop,
  id: string,
  overrides: Partial<NatureStopSeed> = {},
): NatureStopSeed {
  const officialUrl =
    overrides.officialUrl ??
    stop.officialUrl ??
    stop.sourceEvidence?.officialUrl;
  const photo = overrides.photo ?? stop.photo;
  const hours = overrides.hours ?? stop.hours;

  if (!officialUrl || !hours) {
    throw new Error(`Cannot reuse ${stop.name}: official URL and hours are required.`);
  }

  return {
    id,
    name: stop.name,
    coordinates: stop.coordinates,
    description: stop.description,
    hours,
    officialUrl,
    photo,
    imageSourceUrl:
      overrides.imageSourceUrl ??
      stop.imageSourceUrl ??
      stop.sourceEvidence?.imageSourceUrl ??
      photo,
    editorialUrls:
      overrides.editorialUrls ??
      stop.sourceEvidence?.editorialUrls ??
      stop.sourceUrls ??
      [],
    subcategory: stop.subcategory ?? "nature",
    attributeTags: stop.attributeTags ?? ["nature", "scenic"],
    ...overrides,
  };
}

function maps(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function natureAvatar() {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <rect width="160" height="160" rx="80" fill="#15803d" />
      <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Arial, sans-serif" font-size="76" font-weight="700" fill="white">R</text>
    </svg>
  `)}`;
}

function buildNatureStop(seed: NatureStopSeed, guide: NatureGuideSeed): GuideStop {
  const mapUrl = maps(seed.mapQuery ?? `${seed.name} ${guide.city} ${guide.country}`);
  const canonicalMedia =
    guide.country === "United States" ? US_NATURE_STOP_MEDIA[seed.id] : undefined;
  const photo = canonicalMedia?.photo ?? seed.photo;
  const imageSourceUrl = seed.imageSourceUrl ?? canonicalMedia?.imageSourceUrl ?? photo;
  const editorialUrls = seed.editorialUrls ?? [];
  const sourceUrls = [
    seed.officialUrl,
    mapUrl,
    imageSourceUrl,
    ...editorialUrls,
  ].filter((url): url is string => Boolean(url));

  return {
    id: seed.id,
    name: seed.name,
    coordinates: seed.coordinates,
    description: seed.description,
    hours: seed.hours,
    ...(photo ? { photo } : {}),
    ...(imageSourceUrl ? { imageSourceUrl } : {}),
    officialUrl: seed.officialUrl,
    venueKind: "outdoors",
    subcategory: seed.subcategory ?? "nature",
    attributeTags: seed.attributeTags ?? ["nature", "scenic"],
    sourceUrls: [...new Set(sourceUrls)],
    sourceEvidence: {
      officialUrl: seed.officialUrl,
      mapUrl,
      currentStatusUrl: mapUrl,
      ...(imageSourceUrl ? { imageSourceUrl } : {}),
      editorialUrls,
      checkedAt: guide.checkedAt,
      notes: "Official authority, current map status, and source-image evidence checked for the nature-guide population pass.",
    },
  };
}

function dedupeSources(sources: ListSource[]) {
  const byUrl = new Map<string, ListSource>();
  for (const source of sources) {
    if (!byUrl.has(source.url)) byUrl.set(source.url, source);
  }
  return [...byUrl.values()];
}

export function buildNatureGuide(seed: NatureGuideSeed): MapList {
  const stops = seed.stops.map((stop) => buildNatureStop(stop, seed));
  const stopOfficialSources = seed.stops.map((stop) => ({
    name: `${stop.name} official visitor information`,
    url: stop.officialUrl,
  }));
  const stopMapSources = seed.stops.map((stop) => ({
    name: `${stop.name} map and current-status evidence`,
    url: maps(stop.mapQuery ?? `${stop.name} ${seed.city} ${seed.country}`),
  }));

  return {
    id: seed.id,
    slug: seed.slug,
    seoSlug: seed.seoSlug,
    seoTitle: seed.seoTitle,
    seoDescription: seed.seoDescription,
    title: seed.title,
    description: seed.description,
    photo: stops.find((stop) => Boolean(stop.photo))?.photo,
    url: maps(`${seed.title} ${seed.city} ${seed.country}`),
    category: "Nature",
    location: {
      city: seed.city,
      country: seed.country,
      continent: seed.continent,
      scope: "city",
    },
    creator: {
      id: "user-rguide-nature",
      name: "R Nature",
      avatar: natureAvatar(),
    },
    upvotes: 0,
    createdAt: seed.createdAt,
    stops,
    sources: dedupeSources([...seed.sources, ...stopOfficialSources, ...stopMapSources]),
  };
}
