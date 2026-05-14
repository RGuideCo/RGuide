import type { ListCategory, MapList } from "@/types";

import type { GuideSource, GuideStopItem } from "./types";

export function isEventList(list: MapList) {
  return list.submissionType === "event" || list.id.startsWith("event-");
}

export function isJourneyList(list: MapList) {
  if (list.submissionType === "itinerary" || list.submissionType === "journey") {
    return true;
  }

  if (isEventList(list)) {
    return Boolean(list.itinerary || list.journey);
  }

  return list.stops.some((stop) => stop.id.startsWith("itinerary-stop-"));
}

export function getGuideMode(list: MapList) {
  if (isEventList(list)) {
    return "event" as const;
  }

  if (isJourneyList(list)) {
    return "journey" as const;
  }

  return "guide" as const;
}

export function getGuideMeta(list: MapList) {
  const typeLabel =
    getGuideMode(list) === "event"
      ? "Event"
      : getGuideMode(list) === "journey"
        ? "Journey"
        : list.category;
  const placeLabel = `${list.stops.length} ${list.stops.length === 1 ? "place" : "places"}`;
  const locationLabel = [
    list.location.neighborhood,
    list.location.city,
    list.location.country,
    list.location.continent,
  ]
    .filter(Boolean)
    .join(" • ");

  return [typeLabel, placeLabel, locationLabel].filter(Boolean).join(" • ");
}

export function getSourceDisplayName(source: GuideSource) {
  return source.name
    .replace(/\s+[-–|].*$/, "")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .trim();
}

export function getSourceSummary(sources: GuideSource[]) {
  const uniqueNames = sources
    .map(getSourceDisplayName)
    .filter(Boolean)
    .filter((name, index, all) => all.findIndex((item) => item.toLowerCase() === name.toLowerCase()) === index);
  const visibleNames = uniqueNames.slice(0, 2);
  const extraCount = uniqueNames.length - visibleNames.length;

  if (!visibleNames.length) {
    return `${sources.length} ${sources.length === 1 ? "source" : "sources"}`;
  }

  return `${visibleNames.join(", ")}${extraCount > 0 ? ` +${extraCount}` : ""}`;
}

export function getPoiPhoto(photo?: string) {
  return photo?.trim() || null;
}

export function getAlphaMarker(index: number) {
  return String.fromCharCode(65 + (index % 26));
}

export function inferJourneyStopCategory(stop: GuideStopItem, fallback: ListCategory): ListCategory {
  if (stop.category && stop.category !== fallback) {
    return stop.category;
  }

  const text = `${stop.name} ${stop.description}`.toLowerCase();
  if (/\b(hostel|hotel|stay|guesthouse|rooms?|check[- ]?in|sleep|base)\b/.test(text)) {
    return "Stay";
  }
  if (/\b(restaurant|burger|lunch|dinner|breakfast|brunch|tapas|seafood|counter|cafe|coffee|market|food|meal|bakery|wine)\b/.test(text)) {
    return "Food";
  }
  if (/\b(bar|cocktail|club|nightlife|vermouth|cava|drinks?|music|late|dance)\b/.test(text)) {
    return "Nightlife";
  }
  if (/\b(park|beach|garden|hill|viewpoint|waterfront|walk|hike|trail|nature|mountain)\b/.test(text)) {
    return "Nature";
  }
  if (/\b(museum|architecture|modernista|cathedral|gallery|palace|monument|historic|culture|casa|church)\b/.test(text)) {
    return "Culture";
  }
  return fallback;
}

export function getJourneyDateKey(list: MapList, stop: GuideStopItem, index: number) {
  if (stop.itineraryDate || stop.journeyDate) {
    return stop.itineraryDate ?? stop.journeyDate ?? "";
  }
  if (list.itinerary?.startDate || list.journey?.startDate) {
    return list.itinerary?.startDate ?? list.journey?.startDate ?? "";
  }
  return `day-${stop.itineraryDay ?? stop.journeyDay ?? index + 1}`;
}

export function formatJourneyDayLabel(dateKey: string, index: number) {
  const dayLabel = `Day ${index + 1}`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return dayLabel;
  }

  const formatted = new Intl.DateTimeFormat(undefined, {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dateKey}T00:00:00`));

  return `${dayLabel} - ${formatted}`;
}
