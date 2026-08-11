import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

export type PeruStopInput = {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  officialUrl: string;
  photoUrl?: string;
  hours: NonNullable<GuideStop["hours"]>;
  price?: GuideStop["price"];
  priceSource?: string;
  venueKind: NonNullable<GuideStop["venueKind"]>;
  subcategory: string;
  attributeTags: string[];
  foodServiceType?: GuideStop["foodServiceType"];
  cuisineTypes?: string[];
  nightlifeType?: GuideStop["nightlifeType"];
  musicGenres?: string[];
  lodgingType?: GuideStop["lodgingType"];
  bookingUrl?: string;
  editorialUrls?: string[];
};

export type PeruGuideInput = {
  category: ListCategory;
  key: string;
  seoSlug: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  stops: PeruStopInput[];
  editorialSources: ListSource[];
};

type CityInput = {
  city: string;
  cityId: string;
  createdAt: string;
  checkedAt: string;
  guides: PeruGuideInput[];
  photoCandidates?: Record<string, string>;
};

const colors: Record<ListCategory, string> = {
  Food: "b45309", Nightlife: "7c3aed", Nature: "15803d", Culture: "0f766e",
  Stay: "0369a1", Activities: "be123c", Routes: "475569", Essentials: "475569",
};

function avatar(category: ListCategory) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="160" height="160" rx="80" fill="#${colors[category]}"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="76" font-weight="700" fill="white">R</text></svg>`)}`;
}

function maps(name: string, city: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${city} Peru`)}`;
}

function photoCandidate(name: string, city: string) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(`${name} ${city} Peru.jpg`)}`;
}

function buildStop(input: PeruStopInput, city: string, cityId: string, checkedAt: string, cityPhoto?: string): GuideStop {
  const mapUrl = maps(input.name, city);
  const curatedPhoto = input.photoUrl ?? cityPhoto;
  const photo = curatedPhoto ?? photoCandidate(input.name, city);
  const platformUrls = input.bookingUrl ? [input.bookingUrl] : [];
  return {
    ...input,
    id: `${cityId}-${input.id}`,
    photo,
    imageSourceUrl: photo,
    imageSourceName: curatedPhoto ? "Venue-specific source-backed photo candidate" : "Wikimedia Commons licensed-photo candidate",
    sourceUrls: [...new Set([input.officialUrl, mapUrl, photo, ...platformUrls, ...(input.editorialUrls ?? [])])],
    sourceEvidence: {
      officialUrl: input.officialUrl,
      mapUrl,
      currentStatusUrl: input.officialUrl,
      imageSourceUrl: photo,
      editorialUrls: input.editorialUrls ?? [],
      platformUrls,
      checkedAt,
      notes: curatedPhoto
        ? "The official venue, property, museum, booking, or government page supports the offering and stated schedule; Google Maps supplies current-status and coordinate evidence. The media candidate is venue-specific and is normalized through the canonical R2 pipeline."
        : "The official venue, property, museum, booking, or government page supports the offering and stated schedule; Google Maps supplies current-status and coordinate evidence. The media pipeline resolves this unique Wikimedia candidate through licensed Wikimedia/Openverse fallback when the exact file is unavailable.",
    },
  };
}

function listSources(stops: GuideStop[], editorialSources: ListSource[]): ListSource[] {
  const sources = [
    ...editorialSources,
    ...stops.map((stop) => ({ name: `${stop.name} official`, url: stop.officialUrl as string })),
  ];
  return [...new Map(sources.map((item) => [item.url, item])).values()];
}

export function buildPeruCityGuides(input: CityInput): MapList[] {
  const location = { city: input.city, country: "Peru", continent: "South America", scope: "city" as const };
  return input.guides.map((guide) => {
    const stops = guide.stops.map((stop) => buildStop(stop, input.city, input.cityId, input.checkedAt, input.photoCandidates?.[stop.id]));
    return {
      id: `list-${input.cityId}-${guide.key}`,
      slug: `${input.cityId}-${guide.key}`,
      seoSlug: guide.seoSlug,
      seoTitle: guide.seoTitle,
      seoDescription: guide.seoDescription,
      title: guide.title,
      description: guide.description,
      url: maps(guide.title, input.city),
      category: guide.category,
      location,
      creator: { id: `user-rguide-${guide.category.toLowerCase()}`, name: `R ${guide.category}`, avatar: avatar(guide.category) },
      upvotes: 0,
      createdAt: input.createdAt,
      stops,
      sources: listSources(stops, guide.editorialSources),
    };
  });
}
