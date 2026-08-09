import guideImageCache from "@/data/generated/editorial-guide-image-r2.json";
import natureStopImageCache from "@/data/generated/nature-stop-image-r2.json";
import type { GuideStop, MapList } from "@/types";

interface CachedGuideImage {
  url: string;
  sourceUrl: string;
}

const cachedImages = guideImageCache.entries as Record<string, string | CachedGuideImage>;
const cachedNatureStops = natureStopImageCache.items as Array<{
  stopId: string;
  name: string;
  city: string;
  country: string;
  url: string;
  sourceUrl: string;
}>;
const cachedNaturePhotoById = new Map(
  cachedNatureStops.map((item) => [item.stopId, item]),
);
const cachedNaturePhotoByPlace = new Map(
  cachedNatureStops.map((item) => [
    [item.country, item.city, item.name]
      .map((value) => value?.trim().toLowerCase())
      .filter(Boolean)
      .join("|"),
    item,
  ]),
);

function isExternalUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}

export function getCachedGuideImage(sourceUrl?: string) {
  const normalized = sourceUrl?.trim();
  if (!normalized) return null;
  const cached = cachedImages[normalized];
  if (!cached) return null;
  return typeof cached === "string"
    ? { url: cached, sourceUrl: normalized }
    : cached;
}

export function resolveCachedGuidePhoto(sourceUrl?: string) {
  const normalized = sourceUrl?.trim();
  if (!normalized) return undefined;
  if (normalized.startsWith("https://media.rguide.co/")) return normalized;
  const cached = getCachedGuideImage(normalized);
  if (cached) return cached.url;
  return isExternalUrl(normalized) ? undefined : normalized;
}

function poiKey(guide: MapList, stop: GuideStop) {
  if (stop.poiId) return stop.poiId;
  return [guide.location.country, guide.location.city, stop.name]
    .map((value) => value?.trim().toLowerCase())
    .filter(Boolean)
    .join("|");
}

function getCachedNatureStopImage(guide: MapList, stop: GuideStop) {
  return cachedNaturePhotoById.get(stop.id) ?? cachedNaturePhotoByPlace.get(poiKey(guide, stop));
}

function visitStops(stops: GuideStop[], callback: (stop: GuideStop) => void) {
  for (const stop of stops) {
    callback(stop);
    if (stop.places) visitStops(stop.places, callback);
  }
}

function applyStopMediaCache(
  guide: MapList,
  stop: GuideStop,
  photoByPoi: Map<string, string>,
): GuideStop {
  const cached = getCachedGuideImage(stop.photo);
  const cachedNature = getCachedNatureStopImage(guide, stop);
  const photo = resolveCachedGuidePhoto(stop.photo) ?? cachedNature?.url ?? photoByPoi.get(poiKey(guide, stop));
  return {
    ...stop,
    photo,
    ...(cached
      ? { imageSourceUrl: stop.imageSourceUrl ?? cached.sourceUrl }
      : {}),
    ...(!cached && cachedNature
      ? { imageSourceUrl: stop.imageSourceUrl ?? cachedNature.sourceUrl }
      : {}),
    ...(stop.places
      ? {
          places: stop.places.map((place) => applyStopMediaCache(guide, place, photoByPoi)),
        }
      : {}),
  };
}

export function applyGuideMediaCache(guides: MapList[]) {
  const photoByPoi = new Map<string, string>();
  const cacheableGuides = guides.filter((guide) => guide.submissionType !== "event");

  for (const guide of cacheableGuides) {
    visitStops(guide.stops, (stop) => {
      const photo = resolveCachedGuidePhoto(stop.photo) ?? getCachedNatureStopImage(guide, stop)?.url;
      const key = poiKey(guide, stop);
      if (photo && key && !photoByPoi.has(key)) photoByPoi.set(key, photo);
    });
  }

  return guides.map((guide) => {
    if (guide.submissionType === "event") return guide;

    const stops = guide.stops.map((stop) => applyStopMediaCache(guide, stop, photoByPoi));
    const photo = resolveCachedGuidePhoto(guide.photo) ?? stops.find((stop) => stop.photo)?.photo;
    return {
      ...guide,
      photo,
      stops,
    };
  });
}
