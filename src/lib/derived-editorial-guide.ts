import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

type DerivedEditorialGuideSpec = {
  id: string;
  slug: string;
  seoSlug: string;
  seoTitle: string;
  seoDescription: string;
  title: string;
  description: string;
  category: ListCategory;
  city: string;
  country: string;
  continent: string;
  stopIds: string[];
  sourceGuides: MapList[];
  extraStops?: GuideStop[];
  sources?: ListSource[];
  createdAt?: string;
};

type StopEvidence = NonNullable<GuideStop["sourceEvidence"]>;

export type ResearchedEditorialStopInput = Omit<
  GuideStop,
  "imageSourceUrl" | "sourceEvidence" | "sourceUrls"
> & {
  officialUrl: string;
  mapQuery: string;
  photo: string;
  hours: NonNullable<GuideStop["hours"]>;
  imageSourceUrl?: string;
  sourceEvidence?: StopEvidence;
  sourceUrls?: string[];
  currentStatusUrl?: string;
  editorialUrls?: string[];
  platformUrls?: string[];
  evidenceNotes?: string;
  checkedAt?: string;
};

type VenueVariantInput = Pick<
  ResearchedEditorialStopInput,
  "officialUrl" | "mapQuery" | "hours"
> & Partial<
  Omit<
    ResearchedEditorialStopInput,
    "coordinates" | "photo" | "officialUrl" | "mapQuery" | "hours"
  >
> & {
  sourceGuides: MapList[];
  sourceStopId: string;
  coordinates?: [number, number];
  photo?: string;
};

function maps(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function createResearchedEditorialStop(input: ResearchedEditorialStopInput): GuideStop {
  const {
    mapQuery,
    currentStatusUrl,
    editorialUrls = [],
    platformUrls = [],
    evidenceNotes,
    checkedAt = "2026-07-18",
    imageSourceUrl,
    sourceEvidence,
    sourceUrls = [],
    ...stop
  } = input;
  const mapUrl = sourceEvidence?.mapUrl ?? maps(mapQuery);
  const imageUrl = imageSourceUrl ?? stop.photo;
  const officialUrl = sourceEvidence?.officialUrl ?? stop.officialUrl;

  return {
    ...stop,
    poiId: stop.poiId ?? `${stop.id}-venue`,
    ...(stop.price ? { priceSource: stop.priceSource ?? "Official venue menu" } : {}),
    imageSourceUrl: imageUrl,
    imageSourceName: stop.imageSourceName ?? "Official venue media",
    sourceUrls: [...new Set([
      officialUrl,
      mapUrl,
      currentStatusUrl ?? officialUrl,
      imageUrl,
      ...editorialUrls,
      ...platformUrls,
      ...sourceUrls,
    ].filter((url): url is string => Boolean(url)))],
    sourceEvidence: {
      officialUrl,
      mapUrl,
      currentStatusUrl: currentStatusUrl ?? officialUrl,
      imageSourceUrl: imageUrl,
      editorialUrls,
      platformUrls,
      notes: evidenceNotes ?? `Official venue details, current status, hours, and media checked ${checkedAt}.`,
      checkedAt,
      ...sourceEvidence,
    },
  };
}

export function createVenueVariantFromGuideStop(input: VenueVariantInput): GuideStop {
  const {
    sourceGuides,
    sourceStopId,
    coordinates,
    photo,
    sourceUrls = [],
    sourceEvidence,
    ...variant
  } = input;
  const sourceStop = sourceGuides
    .flatMap((guide) => guide.stops)
    .find((stop) => stop.id === sourceStopId);
  if (!sourceStop) {
    throw new Error(`${variant.name ?? sourceStopId} references missing source stop ${sourceStopId}.`);
  }
  const resolvedPhoto = photo ?? sourceStop.photo;
  if (!resolvedPhoto) {
    throw new Error(`${variant.name ?? sourceStop.name} has no source photo.`);
  }

  const {
    lodgingType: _lodgingType,
    sourceEvidence: _sourceEvidence,
    sourceUrls: _sourceUrls,
    imageSourceUrl: _imageSourceUrl,
    imageSourceName: _imageSourceName,
    ...sourceBase
  } = sourceStop;

  return createResearchedEditorialStop({
    ...sourceBase,
    ...variant,
    coordinates: coordinates ?? sourceStop.coordinates,
    photo: resolvedPhoto,
    sourceUrls: [...(sourceStop.sourceUrls ?? []), ...sourceUrls],
    sourceEvidence: {
      editorialUrls: sourceStop.sourceEvidence?.editorialUrls,
      platformUrls: sourceStop.sourceEvidence?.platformUrls,
      ...sourceEvidence,
    },
  });
}

function uniqueSources(sources: ListSource[]) {
  return [...new Map(
    sources
      .filter((source) => /^https?:\/\//i.test(source.url))
      .map((source) => [source.url, source]),
  ).values()];
}

function stopSources(stop: GuideStop): ListSource[] {
  const urls = new Set([
    stop.officialUrl,
    stop.bookingUrl,
    stop.imageSourceUrl,
    ...(stop.sourceUrls ?? []),
    stop.sourceEvidence?.officialUrl,
    stop.sourceEvidence?.mapUrl,
    stop.sourceEvidence?.currentStatusUrl,
    stop.sourceEvidence?.imageSourceUrl,
    ...(stop.sourceEvidence?.editorialUrls ?? []),
    ...(stop.sourceEvidence?.platformUrls ?? []),
  ].filter((url): url is string => Boolean(url)));

  return [...urls].map((url, index) => ({
    name: `${stop.name} ${index === 0 ? "source" : `source ${index + 1}`}`,
    url,
  }));
}

export function createDerivedEditorialGuide(spec: DerivedEditorialGuideSpec): MapList {
  if (spec.stopIds.length < 10) {
    throw new Error(`${spec.seoTitle} needs at least 10 stop ids.`);
  }

  const stopPool = new Map<string, GuideStop>();
  for (const guide of spec.sourceGuides) {
    for (const stop of guide.stops) {
      if (!stopPool.has(stop.id)) {
        stopPool.set(stop.id, stop);
      }
    }
  }
  for (const stop of spec.extraStops ?? []) {
    stopPool.set(stop.id, stop);
  }

  const stops = spec.stopIds.map((stopId) => {
    const stop = stopPool.get(stopId);
    if (!stop) {
      throw new Error(`${spec.seoTitle} references missing stop ${stopId}.`);
    }
    return { ...stop };
  });
  const duplicateStopIds = stops.filter((stop, index) => stops.findIndex((candidate) => candidate.id === stop.id) !== index);
  if (duplicateStopIds.length) {
    throw new Error(`${spec.seoTitle} repeats stop ids: ${duplicateStopIds.map((stop) => stop.id).join(", ")}.`);
  }

  const selectedStopIds = new Set(spec.stopIds);
  const contributingGuides = spec.sourceGuides.filter((guide) =>
    guide.stops.some((stop) => selectedStopIds.has(stop.id)),
  );
  const creator =
    spec.sourceGuides.find((guide) => guide.category === spec.category && !guide.location.neighborhood)?.creator ??
    spec.sourceGuides.find((guide) => guide.category === spec.category)?.creator;
  if (!creator) {
    throw new Error(`${spec.seoTitle} has no ${spec.category} creator in its source guides.`);
  }

  const sources = uniqueSources([
    ...(spec.sources ?? []),
    ...contributingGuides.flatMap((guide) => guide.sources ?? []),
    ...stops.flatMap(stopSources),
  ]);
  if (sources.length < 10) {
    throw new Error(`${spec.seoTitle} has only ${sources.length} unique sources.`);
  }

  const createdAt = spec.createdAt ?? "2026-07-18T09:00:00.000Z";
  return {
    id: spec.id,
    slug: spec.slug,
    seoSlug: spec.seoSlug,
    seoTitle: spec.seoTitle,
    seoDescription: spec.seoDescription,
    title: spec.title,
    description: spec.description,
    url: `https://www.google.com/maps/search/${encodeURIComponent(spec.seoTitle.toLowerCase())}`,
    category: spec.category,
    location: {
      city: spec.city,
      country: spec.country,
      continent: spec.continent,
      scope: "city",
    },
    creator,
    upvotes: 0,
    createdAt,
    updatedAt: createdAt,
    photo: stops.find((stop) => Boolean(stop.photo))?.photo,
    stops,
    sources,
  };
}
