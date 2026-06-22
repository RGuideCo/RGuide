"use client";

import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Check, ChevronDown, GripVertical, Heart, Minus, Plus, Trash2, Upload, X } from "lucide-react";

import { getPoiAttributeTags } from "@/lib/poi-tags";
import { getCreatorHref, getGuideHref, getVenueHref } from "@/lib/routes";
import { resolveStopHours } from "@/lib/seasonal-hours";
import {
  buildAgodaStaySearchUrl,
  buildStay22DestinationUrl,
  buildStay22StopUrl,
  isCommercialLodgingSourceUrl,
  isStay22Url,
  shouldUseAgodaForStay,
} from "@/lib/stay22";
import { CATEGORIES, CATEGORY_STYLES } from "@/lib/constants";
import { cities } from "@/data/geography";
import {
  EventCardBody,
  GuideCardBody,
  GuidePhotoStrip,
  GuideExpandedIntro,
  GuideSourcesOverlay,
  GuideSourceSummary,
  GuideStopCardChrome,
  GuideStopFooterActions,
  JourneyCardBody,
  MapListCardRoot,
  NestedPoiCard,
  getVariedGuideSources,
} from "@/components/cards/map-list-card-v2";
import { useAppStore } from "@/store/app-store";
import { ListCategory, MapList } from "@/types";

interface MapListCardProps {
  list: MapList;
  onHoverStart?: (list: MapList) => void;
  onHoverEnd?: () => void;
  onStopHoverChange?: (stopId: string | null) => void;
  onStopSelect?: (stopId: string) => void;
  hoveredStopId?: string | null;
  forceExpandStopId?: string | null;
  forceExpandStopNonce?: number;
  expanded?: boolean;
  preserveExpandedChrome?: boolean;
  retractExpandedChrome?: boolean;
  expandExpandedChrome?: boolean;
  collapseExpandedContent?: boolean;
  hideExpandedContent?: boolean;
  deferExpandedContent?: boolean;
  onExpandChromeComplete?: (list: MapList) => void;
  expandable?: boolean;
  fillPane?: boolean;
  onToggleExpand?: (list: MapList) => void;
  shouldAutoOpenSources?: boolean;
  onAutoOpenSourcesHandled?: (listId: string) => void;
  onRequestOpenSourcesWhenCollapsed?: (list: MapList) => void;
  onEditGuide?: (list: MapList) => void;
  startInlineEditingNonce?: number;
  onExpandedStopIdsChange?: (stopIds: string[]) => void;
  collapsedLocationSubtitleHiddenParts?: string[];
  isExternallyHovered?: boolean;
}

function usesRankedStops(title: string) {
  return /\btop\s*\d+\b/i.test(title) || /\b\d+\b/.test(title);
}

function splitStopDescriptionAndHours(description: string) {
  const marker = "Hours:";
  const markerIndex = description.indexOf(marker);

  if (markerIndex === -1) {
    return {
      summary: description.trim(),
      hours: null as string | null,
    };
  }

  const summary = description.slice(0, markerIndex).trim().replace(/\s+$/, "");
  const hours = description.slice(markerIndex + marker.length).trim();

  return {
    summary,
    hours: hours.length ? hours : null,
  };
}
function isItineraryLikeGuide(list: MapList) {
  if (list.id.startsWith("event-")) {
    return Boolean(list.itinerary);
  }
  if (list.submissionType === "itinerary") {
    return true;
  }
  if (list.submissionType === "event" && Boolean(list.itinerary)) {
    return true;
  }
  const hasGeneratedItineraryStops = list.stops.some((stop) => stop.id.startsWith("itinerary-stop-"));
  const hasItineraryTitle = /\b(itinerary|journey)\b/i.test(list.title);
  const hasCompiledItineraryDescription = /^compiled (itinerary|journey) with \d+ saved locations\.?$/i.test(
    list.description.trim(),
  );
  return hasGeneratedItineraryStops || (hasItineraryTitle && hasCompiledItineraryDescription);
}

function inferJourneyStopCategory(stop: MapList["stops"][number], fallback: ListCategory): ListCategory {
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

function normalizeLocationSubtitlePart(value?: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function slugifyLocationPart(value: string) {
  return normalizeLocationSubtitlePart(value)
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatNeighborhoodFromSlug(value: string) {
  const wordsToDrop = new Set([
    "bars",
    "culture",
    "dive",
    "food",
    "hostels",
    "hotels",
    "nightlife",
    "popular",
    "pubs",
    "restaurants",
    "stays",
  ]);
  const parts = value.split("-").filter(Boolean);

  while (parts.length && wordsToDrop.has(parts[parts.length - 1])) {
    parts.pop();
  }

  if (!parts.length || parts[0] === "best") {
    return null;
  }

  return parts
    .map((part) => (part.length <= 3 ? part.toUpperCase() : part[0].toUpperCase() + part.slice(1)))
    .join(" ");
}

function inferNeighborhoodFromGuideText(list: MapList) {
  if (slugifyLocationPart(list.id).includes("citywide")) {
    return null;
  }
  const city = list.location.city?.trim();
  if (!city) {
    return null;
  }

  const cityPattern = city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const candidates = [list.location.neighborhood, list.seoTitle, list.title, list.seoDescription]
    .filter((value): value is string => Boolean(value?.trim()));

  for (const value of candidates) {
    const match = value.match(new RegExp(`\\b(?:in|near|on)\\s+([^,]+),\\s*${cityPattern}\\b`, "i"));
    const neighborhood = match?.[1]?.trim();
    if (neighborhood && normalizeLocationSubtitlePart(neighborhood) !== normalizeLocationSubtitlePart(city)) {
      return neighborhood;
    }
  }

  const citySlug = slugifyLocationPart(city);
  const slugCandidates = [list.seoSlug, list.slug].filter((value): value is string => Boolean(value?.trim()));
  for (const slug of slugCandidates) {
    const normalizedSlug = slugifyLocationPart(slug);
    if (normalizedSlug.includes("citywide") || !normalizedSlug.startsWith(`${citySlug}-`)) {
      continue;
    }
    const inferred = formatNeighborhoodFromSlug(normalizedSlug.slice(citySlug.length + 1));
    if (inferred && normalizeLocationSubtitlePart(inferred) !== normalizeLocationSubtitlePart(city)) {
      return inferred;
    }
  }

  return null;
}

function buildLocationSubtitle(list: MapList, hiddenParts: string[] = []) {
  const hiddenLocationParts = new Set(hiddenParts.map(normalizeLocationSubtitlePart).filter(Boolean));
  const neighborhoodLabel = list.location.neighborhood?.trim() || inferNeighborhoodFromGuideText(list);

  return [
    neighborhoodLabel,
    list.location.city,
    list.location.country,
    list.location.continent,
  ]
    .filter((part): part is string => Boolean(part?.trim()))
    .filter((part) => !hiddenLocationParts.has(normalizeLocationSubtitlePart(part)))
    .filter((part, index, all) => all.findIndex((item) => item.toLowerCase() === part.toLowerCase()) === index)
    .join(" • ");
}

type GuideSource = NonNullable<MapList["sources"]>[number];

function buildGuideMeta(list: MapList, hiddenLocationParts?: string[]) {
  const placeCount = list.stops.length;
  const isEventGuide = list.submissionType === "event" || list.id.startsWith("event-");
  const placeLabel = `${placeCount} ${placeCount === 1 ? "place" : "places"}`;
  const locationLabel = buildLocationSubtitle(list, hiddenLocationParts);
  const eventVenueLabel =
    list.stops.find((stop) => stop.eventVenue)?.eventVenue ??
    locationLabel;
  const typeLabel =
    isEventGuide
      ? "Event"
      : list.submissionType === "itinerary"
        ? "Journey"
        : list.category;
  return isEventGuide
    ? [eventVenueLabel].filter(Boolean).join(" • ")
    : [typeLabel, placeLabel, locationLabel].filter(Boolean).join(" • ");
}

function buildEditableGuideMetaTail(list: MapList, hiddenLocationParts?: string[]) {
  const placeCount = list.stops.length;
  const isEventGuide = list.submissionType === "event" || list.id.startsWith("event-");
  const placeLabel = `${placeCount} ${placeCount === 1 ? "place" : "places"}`;
  const locationLabel = buildLocationSubtitle(list, hiddenLocationParts);
  const eventVenueLabel =
    list.stops.find((stop) => stop.eventVenue)?.eventVenue ??
    locationLabel;

  if (isEventGuide) {
    return eventVenueLabel;
  }

  if (list.submissionType === "itinerary") {
    return ["Journey", placeLabel, locationLabel].filter(Boolean).join(" • ");
  }

  return [placeLabel, locationLabel].filter(Boolean).join(" • ");
}

function formatChipValue(value?: string | null) {
  return (value ?? "")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function valuesFromMaybeArray(value: string | string[] | null | undefined) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  return value ? [value] : [];
}

function getAllGuideStops(list: MapList) {
  return list.stops.flatMap((stop) => [stop, ...(stop.places ?? [])]);
}

function getMostCommonValue(values: Array<string | null | undefined>) {
  const counts = new Map<string, number>();

  values.forEach((value) => {
    const label = formatChipValue(value);
    if (!label) {
      return;
    }
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });

  return [...counts.entries()].sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))[0]?.[0] ?? null;
}

function getMostCommonEntry(values: Array<string | null | undefined>) {
  const counts = new Map<string, number>();

  values.forEach((value) => {
    const label = formatChipValue(value);
    if (!label) {
      return;
    }
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });

  return [...counts.entries()].sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))[0] ?? null;
}

function pluralizeChipLabel(label: string) {
  if (!label) {
    return label;
  }
  if (/(s|x|z|ch|sh)$/i.test(label)) {
    return label;
  }
  return `${label}s`;
}

function getDominantCuisineLabel(list: MapList) {
  const stops = getAllGuideStops(list);
  const entry = getMostCommonEntry(stops.flatMap((stop) => stop.cuisineTypes ?? []));
  if (!entry) {
    return null;
  }

  const [label, count] = entry;
  const enoughStopsShareCuisine = count >= Math.max(2, Math.ceil(stops.length * 0.45));
  if (!enoughStopsShareCuisine) {
    return null;
  }

  const cuisinePriority: Record<string, string> = {
    Vegan: "Vegan",
    Vegetarian: "Vegetarian",
    "Plant Based": "Vegetarian",
    Tapas: "Tapas",
    Pinchos: "Tapas",
    Seafood: "Seafood",
    "Fine Dining": "Fine Dining",
    Michelin: "Michelin",
    "Tasting Menu": "Fine Dining",
    Market: "Markets",
    "Food Hall": "Markets",
    "Street Food": "Street Food",
    Pub: "Pub Food",
    "Pub Food": "Pub Food",
    Indian: "Indian",
    "South Asian": "South Asian",
    Thai: "Thai",
    Chinese: "Chinese",
    Japanese: "Japanese",
    Mediterranean: "Mediterranean",
    French: "French",
    Italian: "Italian",
    Dutch: "Dutch",
    German: "German",
    Portuguese: "Portuguese",
    Spanish: "Spanish",
    Catalan: "Catalan",
  };

  return cuisinePriority[label] ?? label;
}

function inferGuideSubcategory(list: MapList) {
  const stops = getAllGuideStops(list);
  const structuredSubcategory = getMostCommonValue(
    stops.flatMap((stop) => [
      ...valuesFromMaybeArray(stop.subcategory),
      ...valuesFromMaybeArray(stop.subcategories),
    ]),
  );
  if (structuredSubcategory) {
    return structuredSubcategory;
  }

  if (list.category === "Stay") {
    const lodgingType = getMostCommonValue(stops.map((stop) => stop.lodgingType));
    if (lodgingType) {
      return lodgingType.endsWith("s") ? lodgingType : `${lodgingType}s`;
    }
    return /\bhostels?\b/i.test(`${list.title} ${list.description}`) ? "Hostels" : "Hotels";
  }

  if (list.category === "Food") {
    const foodType = getMostCommonValue(stops.map((stop) => stop.foodServiceType));
    if (foodType) {
      return foodType === "Fast Food" ? foodType : foodType.endsWith("s") ? foodType : `${foodType}s`;
    }
    if (/\b(markets?|grazing)\b/i.test(`${list.title} ${list.description}`)) {
      return "Markets";
    }
    return "Restaurants";
  }

  if (list.category === "Nightlife") {
    if (/\b(pub|pubs|pints?)\b/i.test(`${list.title} ${list.description}`)) {
      return "Pubs";
    }
    return "Bars";
  }

  const titleText = `${list.title} ${list.description}`;
  if (list.category === "Culture") {
    if (/\bmuseums?\b/i.test(titleText)) return "Museums";
    if (/\bgalleries?\b/i.test(titleText)) return "Galleries";
    if (/\btheatre|stages?|opera\b/i.test(titleText)) return "Performance";
    return "Culture";
  }
  if (list.category === "Nature") {
    if (/\bparks?\b/i.test(titleText)) return "Parks";
    if (/\bwaterfront|river|canal\b/i.test(titleText)) return "Waterfront";
    return "Scenic";
  }
  if (list.category === "Activities") {
    if (/\bwalking|walks?\b/i.test(titleText)) return "Walking";
    return "Things To Do";
  }
  if (list.category === "Routes") {
    return "Routes";
  }
  if (list.category === "Essentials") {
    return "Essentials";
  }

  return null;
}

function inferGuideChipDetail(list: MapList) {
  const guideIntentText = [
    list.title,
    list.slug,
    list.seoSlug,
    list.seoTitle,
    list.seoDescription,
    list.url,
    list.description,
  ]
    .filter((value): value is string => Boolean(value))
    .join(" ");
  const text = `${guideIntentText} ${getAllGuideStops(list)
    .map((stop) => `${stop.name} ${stop.description}`)
    .join(" ")}`.toLowerCase();

  if (list.category === "Food") {
    const foodMatches: Array<[string, RegExp]> = [
      ["Tapas", /\btapas|pinchos\b/],
      ["Seafood", /\bseafood|fish|oyster|coastal catch\b/],
      ["Michelin", /\bmichelin|fine dining|tasting menu\b/],
      ["Pub Food", /\bpub food|pints? that can become meals\b/],
      ["Markets", /\bmarket|grazing|stalls?\b/],
      ["Indian", /\bindian|curry|dishoom|south asian\b/],
      ["Thai", /\bthai|kiln|smoking goat\b/],
      ["British", /\bbritish|rules|pie|game\b/],
      ["Wine", /\bwine|natural wine\b/],
    ];
    return foodMatches.find(([, pattern]) => pattern.test(text))?.[0] ?? null;
  }

  if (list.category === "Nightlife") {
    if (/\b(best[-\s+]*dive[-\s+]*bars?|dive[-\s+]*bars?)\b/i.test(guideIntentText)) {
      return "Dive Bars";
    }
    const nightlifeType = getMostCommonValue(getAllGuideStops(list).map((stop) => stop.nightlifeType));
    if (nightlifeType) {
      return nightlifeType === "Dive Bar" ? "Dive Bars" : nightlifeType;
    }
    if (/\bdive\b/i.test(text)) return "Dive Bars";
    if (/\bpub|pints?\b/i.test(text)) return "Pub";
    if (/\brooftop|skyline\b/i.test(text)) return "Rooftop";
    if (/\blive music|jazz|venue\b/i.test(text)) return "Live Music";
    return "Cocktail Bar";
  }

  return null;
}

function buildCollapsedCategoryChip(list: MapList) {
  const headingText = `${list.title} ${list.slug ?? ""} ${list.seoTitle ?? ""} ${list.seoSlug ?? ""} ${list.url ?? ""}`.toLowerCase();
  const titleText = `${headingText} ${list.description}`.toLowerCase();

  if (list.category === "Stay") {
    const lodgingType = getMostCommonValue(getAllGuideStops(list).map((stop) => stop.lodgingType));
    if (lodgingType) {
      return { label: pluralizeChipLabel(lodgingType) };
    }
    if (/\bhostels?\b/i.test(titleText)) {
      return { label: "Hostels" };
    }
    if (/\bhotels?\b/i.test(titleText)) {
      return { label: "Hotels" };
    }
    return { label: "Stay" };
  }

  if (list.category === "Food") {
    const headingFoodThemes: Array<[string, RegExp]> = [
      ["Vegetarian", /\b(vegetarian|vegan|plant[-\s]?based)\b/],
      ["Tapas", /\b(tapas|pinchos)\b/],
      ["Seafood", /\b(seafood|fish|oyster|coastal catch)\b/],
      ["Fine Dining", /\b(fine dining|tasting menu|michelin|reservations?)\b/],
      ["Markets", /\b(markets?|grazing|food hall|stalls?)\b/],
      ["Pub Food", /\b(pub food|pub lunches?|pub dinners?|pints? that can become meals)\b/],
      ["South Asian", /\b(south asian|indian|sri lankan|spice routes?)\b/],
      ["Thai", /\bthai\b/],
      ["Chinese", /\bchinese\b/],
      ["Japanese", /\b(japanese|omakase|sushi)\b/],
      ["Restaurants", /\b(restaurants?|tables?|dining|meals?)\b/],
    ];
    const headingTheme = headingFoodThemes.find(([, pattern]) => pattern.test(headingText))?.[0];
    if (headingTheme) {
      return { label: headingTheme };
    }

    const dominantCuisine = getDominantCuisineLabel(list);
    if (dominantCuisine) {
      return { label: dominantCuisine };
    }

    const descriptionThemes: Array<[string, RegExp]> = [
      ["Vegetarian", /\b(vegetarian|vegan|plant[-\s]?based)\b/],
      ["Tapas", /\b(tapas|pinchos)\b/],
      ["Fine Dining", /\b(fine dining|tasting menu|michelin|reservations?)\b/],
      ["Markets", /\b(markets?|grazing|food hall|stalls?)\b/],
      ["Pub Food", /\b(pub food|pub lunches?|pub dinners?|pints? that can become meals)\b/],
      ["South Asian", /\b(south asian|indian|sri lankan|spice routes?)\b/],
      ["Thai", /\bthai\b/],
      ["Chinese", /\bchinese\b/],
      ["Japanese", /\b(japanese|omakase|sushi)\b/],
      ["Restaurants", /\b(restaurants?|tables?|dining|meals?)\b/],
    ];
    const descriptionTheme = descriptionThemes.find(([, pattern]) => pattern.test(titleText))?.[0];
    if (descriptionTheme) {
      return { label: descriptionTheme };
    }

    const foodType = getMostCommonValue(getAllGuideStops(list).map((stop) => stop.foodServiceType));
    if (foodType) {
      if (foodType === "Fast Food") {
        return { label: foodType };
      }
      if (foodType === "Stall") {
        return { label: "Street Food" };
      }
      return { label: pluralizeChipLabel(foodType) };
    }

    return { label: "Restaurants" };
  }

  if (list.category === "Activities") {
    return { label: "Top 10" };
  }

  if (list.category === "Nightlife") {
    if (/\b(best[-\s+]*dive[-\s+]*bars?|dive[-\s+]*bars?)\b/i.test(headingText)) return { label: "Dive Bars" };
    if (/\b(lgbtq|queer)\b/i.test(titleText)) return { label: "LGBTQ+" };
    if (/\b(pub|pubs|pints?)\b/i.test(titleText)) return { label: "Pubs" };
    if (/\b(rooftop|skyline)\b/i.test(titleText)) return { label: "Rooftops" };
    if (/\b(cocktail|cocktails)\b/i.test(titleText)) return { label: "Cocktails" };
    const nightlifeType = getMostCommonValue(getAllGuideStops(list).map((stop) => stop.nightlifeType));
    return { label: nightlifeType === "Dive Bar" ? "Dive Bars" : nightlifeType ?? "Bars" };
  }

  if (list.category === "Culture") {
    if (/\bmuseums?\b/i.test(titleText)) return { label: "Museums" };
    if (/\bgalleries?\b/i.test(titleText)) return { label: "Galleries" };
    if (/\btheatre|stages?|opera\b/i.test(titleText)) return { label: "Performance" };
    if (/\blandmarks?\b/i.test(titleText)) return { label: "Landmarks" };
    return { label: "Culture" };
  }

  if (list.category === "Nature") {
    if (/\bparks?\b/i.test(titleText)) return { label: "Parks" };
    if (/\bwaterfront|river|canal\b/i.test(titleText)) return { label: "Waterfront" };
    return { label: "Scenic" };
  }

  if (list.category === "Routes") {
    return { label: "Routes" };
  }

  if (list.category === "Essentials") {
    return { label: "Essentials" };
  }

  return {
    label: inferGuideChipDetail(list) ?? inferGuideSubcategory(list) ?? list.category,
  };
}

function getEventCardVenue(list: MapList, hiddenLocationParts?: string[]) {
  const firstEventStop = list.stops.find((stop) => stop.eventVenue);
  const label = firstEventStop?.eventVenue ?? buildLocationSubtitle(list, hiddenLocationParts);
  const venueId = firstEventStop?.eventVenueId ?? list.eventVenueId;

  return {
    label,
    venueId,
  };
}

function formatEventCardDate(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  return EVENT_CARD_DATE_FORMATTER.format(new Date(`${value}T00:00:00`));
}

function buildEventCardDateLabel(list: MapList) {
  const startDate = list.itinerary?.startDate ?? list.stops.find((stop) => stop.itineraryDate)?.itineraryDate;
  const endDate = list.itinerary?.endDate ?? [...list.stops].reverse().find((stop) => stop.itineraryDate)?.itineraryDate;
  const formattedStart = formatEventCardDate(startDate);
  const formattedEnd = endDate && endDate !== startDate ? formatEventCardDate(endDate) : null;

  if (formattedStart && formattedEnd) {
    return `${formattedStart} - ${formattedEnd}`;
  }
  if (formattedStart) {
    return formattedStart;
  }

  const eventTime = list.stops.find((stop) => stop.eventTime)?.eventTime;
  return eventTime?.split(" to ")[0] ?? null;
}

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(dateKey: string, days: number) {
  const date = new Date(`${dateKey}T00:00:00`);
  date.setDate(date.getDate() + days);
  return getLocalDateKey(date);
}

function getItineraryStopDate(list: MapList, stop: MapList["stops"][number], index: number) {
  if (stop.itineraryDate) {
    return stop.itineraryDate;
  }
  if (list.itinerary?.startDate && stop.itineraryDay && stop.itineraryDay > 0) {
    return addDays(list.itinerary.startDate, stop.itineraryDay - 1);
  }
  if (list.itinerary?.startDate) {
    return list.itinerary.startDate;
  }
  return `day-${stop.itineraryDay ?? index + 1}`;
}

function formatItineraryDayLabel(dateKey: string, index: number) {
  const dayLabel = `Day ${index + 1}`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return dayLabel;
  }
  const formatted = ITINERARY_DAY_DATE_FORMATTER.format(new Date(`${dateKey}T00:00:00`));
  return `${dayLabel} - ${formatted}`;
}

const STOP_SCROLL_TOP_INSET = 4;
const MOBILE_LAST_STOP_SCROLL_EXTRA = 96;
const EXPANDED_CONTENT_LOCAL_REVEAL_MS = 180;
const TODAY_WEEKDAY_LABEL = new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(new Date());
const EVENT_CARD_DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  timeZone: "UTC",
  month: "short",
  day: "numeric",
});
const ITINERARY_DAY_DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  timeZone: "UTC",
  month: "short",
  day: "numeric",
  year: "numeric",
});
const EMPTY_HIDDEN_LOCATION_PARTS: string[] = [];
const EMPTY_SOURCES: GuideSource[] = [];

function getVisibleGuideSources(list: MapList, sources: GuideSource[]) {
  if (
    shouldUseAgodaForStay({
      category: list.category,
      city: list.location.city,
      country: list.location.country,
      continent: list.location.continent,
    })
  ) {
    return sources.filter((source) => !isCommercialLodgingSourceUrl(source.url));
  }

  return sources;
}

function getSourceDisplayName(source: GuideSource) {
  return source.name
    .replace(/\s+[-–|].*$/, "")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .trim();
}

function buildSourceSummary(sources: GuideSource[]) {
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

function getAlphaMarker(index: number) {
  return String.fromCharCode(65 + (index % 26));
}

function getPoiPhoto(photo?: string) {
  return photo?.trim() || null;
}

function sameCoordinates(
  first: MapList["stops"][number]["coordinates"] | undefined,
  second: MapList["stops"][number]["coordinates"] | undefined,
) {
  if (!first || !second) {
    return false;
  }

  return Math.abs(first[0] - second[0]) < 0.000001 && Math.abs(first[1] - second[1]) < 0.000001;
}

function isSavedStopFromSource(
  savedStop: MapList["stops"][number],
  sourceListId: string,
  sourceStop: MapList["stops"][number],
) {
  if (savedStop.sourceListId === sourceListId && savedStop.sourceStopId === sourceStop.id) {
    return true;
  }

  if (savedStop.poiId && sourceStop.poiId && savedStop.poiId === sourceStop.poiId) {
    return true;
  }

  if (savedStop.venueId && sourceStop.venueId && savedStop.venueId === sourceStop.venueId) {
    return true;
  }

  return savedStop.name === sourceStop.name && sameCoordinates(savedStop.coordinates, sourceStop.coordinates);
}

function containsSavedStopFromSource(
  savedStop: MapList["stops"][number],
  sourceListId: string,
  sourceStop: MapList["stops"][number],
): boolean {
  if (isSavedStopFromSource(savedStop, sourceListId, sourceStop)) {
    return true;
  }

  return savedStop.places?.some((place) => containsSavedStopFromSource(place, sourceListId, sourceStop)) ?? false;
}

function isSavedGuideFromSource(savedStop: MapList["stops"][number], sourceList: MapList) {
  if (savedStop.sourceKind === "guide" && savedStop.sourceListId === sourceList.id) {
    return true;
  }

  if (savedStop.sourceListId === sourceList.id && !savedStop.sourceStopId && savedStop.name === sourceList.title) {
    return true;
  }

  return (
    savedStop.name === sourceList.title &&
    Boolean(
      savedStop.places?.some((place) =>
        sourceList.stops.some((sourceStop) => isSavedStopFromSource(place, sourceList.id, sourceStop)),
      ),
    )
  );
}

function getStayBookingDetails(list: MapList, stop: MapList["stops"][number], resolvedCategory: ListCategory = stop.category ?? list.category) {
  if (resolvedCategory !== "Stay") {
    return null;
  }

  if (
    shouldUseAgodaForStay({
      stop,
      category: resolvedCategory,
      city: list.location.city,
      country: list.location.country,
      continent: list.location.continent,
    })
  ) {
    return {
      href: buildAgodaStaySearchUrl({
        stop,
        city: list.location.city,
        country: list.location.country,
        neighborhood: list.location.neighborhood,
        campaign: `guide_stop_agoda_${list.location.city ?? "destination"}_${list.id}`,
      }),
      platformLabel: "Agoda",
    };
  }

  const existingBookingUrl = stop.bookingUrl;

  if (isStay22Url(existingBookingUrl)) {
    return {
      href: existingBookingUrl,
      platformLabel: "Stay22",
    };
  }

  return {
    href: buildStay22StopUrl({
      stop,
      city: list.location.city,
      country: list.location.country,
      neighborhood: list.location.neighborhood,
      campaign: `guide_stop_${list.location.city ?? "destination"}_${list.id}`,
    }),
    platformLabel: "Stay22",
  };
}

function normalizePlaceName(value?: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

function distanceKm([latA, lonA]: [number, number], [latB, lonB]: [number, number]) {
  const earthRadiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const deltaLat = toRadians(latB - latA);
  const deltaLon = toRadians(lonB - lonA);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(latA)) * Math.cos(toRadians(latB)) * Math.sin(deltaLon / 2) ** 2;

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getClosestNeighborhoodName(list: MapList, stop: MapList["stops"][number]) {
  if (list.location.neighborhood?.trim()) {
    return list.location.neighborhood.trim();
  }

  const cityKey = normalizePlaceName(list.location.city);
  const countryKey = normalizePlaceName(list.location.country);
  const city = cities.find(
    (candidate) =>
      normalizePlaceName(candidate.name) === cityKey &&
      (!countryKey || normalizePlaceName(candidate.country) === countryKey),
  );

  const neighborhoods = (city?.subareas ?? []).flatMap((subarea) => [
    subarea,
    ...(subarea.subareas ?? []),
  ]);

  if (!neighborhoods.length) {
    return null;
  }

  return neighborhoods.reduce<{
    name: string;
    distance: number;
  } | null>((best, neighborhood) => {
    const distance = distanceKm(stop.coordinates, neighborhood.coordinates);
    if (!best || distance < best.distance) {
      return { name: neighborhood.name, distance };
    }

    return best;
  }, null)?.name ?? null;
}

function getNearbyStayDetails(list: MapList, stop: MapList["stops"][number]) {
  if (!list.location.city || !list.location.country) {
    return null;
  }

  const neighborhood = getClosestNeighborhoodName(list, stop);

  return {
    href: shouldUseAgodaForStay({
      category: "Stay",
      city: list.location.city,
      country: list.location.country,
      continent: list.location.continent,
    })
      ? buildAgodaStaySearchUrl({
          city: list.location.city,
          country: list.location.country,
          neighborhood,
          campaign: `poi_nearby_agoda_${list.location.city}_${neighborhood ?? stop.id}`,
        })
      : buildStay22DestinationUrl({
          city: list.location.city,
          country: list.location.country,
          neighborhood,
          campaign: `poi_nearby_stay_${list.location.city}_${neighborhood ?? stop.id}`,
        }),
    label: `Stay near ${stop.name}`,
  };
}

export function MapListCard({
  list,
  onHoverStart,
  onHoverEnd,
  onStopHoverChange,
  onStopSelect,
  hoveredStopId,
  forceExpandStopId,
  forceExpandStopNonce = 0,
  expanded = false,
  preserveExpandedChrome = false,
  retractExpandedChrome = false,
  expandExpandedChrome = false,
  collapseExpandedContent = false,
  hideExpandedContent = false,
  deferExpandedContent = false,
  onExpandChromeComplete,
  expandable = false,
  fillPane = false,
  onToggleExpand,
  shouldAutoOpenSources = false,
  onAutoOpenSourcesHandled,
  onRequestOpenSourcesWhenCollapsed,
  onEditGuide,
  startInlineEditingNonce = 0,
  onExpandedStopIdsChange,
  collapsedLocationSubtitleHiddenParts = [],
  isExternallyHovered = false,
}: MapListCardProps) {
  const router = useRouter();
  const weekdayLabel = TODAY_WEEKDAY_LABEL;
  const currentUser = useAppStore((state) => state.currentUser);
  const submittedLists = useAppStore((state) => state.submittedLists);
  const favoriteIds = useAppStore((state) => state.favoriteIds);
  const votedIds = useAppStore((state) => state.votedIds);
  const itineraryStopIds = useAppStore((state) => state.itineraryStopIds);
  const itineraryPlaylists = useAppStore((state) => state.itineraryPlaylists);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const addListToItineraryPlaylist = useAppStore((state) => state.addListToItineraryPlaylist);
  const addStopToItineraryPlaylist = useAppStore((state) => state.addStopToItineraryPlaylist);
  const createItineraryPlaylist = useAppStore((state) => state.createItineraryPlaylist);
  const submitList = useAppStore((state) => state.submitList);
  const updateSubmittedList = useAppStore((state) => state.updateSubmittedList);
  const deleteSubmittedList = useAppStore((state) => state.deleteSubmittedList);

  const isFavorited = favoriteIds.includes(list.id) || votedIds.includes(list.id);
  const isInItinerary = itineraryPlaylists.some((playlist) => playlist.listIds.includes(list.id));
  const isEventGuide = list.submissionType === "event" || list.id.startsWith("event-");
  const isItineraryGuide = isInItinerary || isItineraryLikeGuide(list);
  const usesGuideActions = !isItineraryGuide || isEventGuide;
  const isOwnGuide = Boolean(currentUser && currentUser.id === list.creator.id);
  const isOwnEditableGuide = isOwnGuide && usesGuideActions;
  const isHistoricalGuide = list.creator.id === "user-rguide-history";
  const categoryStyle = CATEGORY_STYLES[list.category];
  const guideAccentColor = isItineraryGuide && !isEventGuide ? "#020617" : categoryStyle.mapColor;
  const guideExpandedColor = isItineraryGuide && !isEventGuide ? "#111827" : categoryStyle.mapColor;
  const expandedChrome = expanded || preserveExpandedChrome;
  const hiddenLocationPartsKey = expandedChrome ? "" : collapsedLocationSubtitleHiddenParts.join("\u0001");
  const hiddenLocationParts = useMemo(
    () => (hiddenLocationPartsKey ? hiddenLocationPartsKey.split("\u0001") : EMPTY_HIDDEN_LOCATION_PARTS),
    [hiddenLocationPartsKey],
  );
  const locationSubtitle = useMemo(
    () => buildLocationSubtitle(list, hiddenLocationParts),
    [hiddenLocationParts, list],
  );
  const guideMeta = useMemo(
    () => buildGuideMeta(list, hiddenLocationParts),
    [hiddenLocationParts, list],
  );
  const editableGuideMetaTail = useMemo(
    () => buildEditableGuideMetaTail(list, hiddenLocationParts),
    [hiddenLocationParts, list],
  );
  const collapsedCategoryChip = useMemo(() => buildCollapsedCategoryChip(list), [list]);
  const eventCardVenue = useMemo(
    () => (isEventGuide ? getEventCardVenue(list, hiddenLocationParts) : null),
    [hiddenLocationParts, isEventGuide, list],
  );
  const eventCardDateLabel = useMemo(
    () => (isEventGuide ? buildEventCardDateLabel(list) : null),
    [isEventGuide, list],
  );
  const GuideBodyComponent = isEventGuide ? EventCardBody : isItineraryGuide ? JourneyCardBody : GuideCardBody;
  const firstPoi = list.stops[0];
  const collapsedFirstPoiPhoto = firstPoi ? getPoiPhoto(firstPoi.photo) ?? getPoiPhoto(firstPoi.places?.[0]?.photo) : null;
  const preservingListChrome = preserveExpandedChrome && !fillPane;
  const retractingListChrome = preservingListChrome && retractExpandedChrome;
  const expandingListChrome = expandExpandedChrome && expandedChrome;
  const isOutboardImageOpening = preservingListChrome && expandingListChrome && !expanded;
  const isOutboardImageClosing = preservingListChrome && retractingListChrome && !expanded;
  const shouldDeferExpandedContent = expanded && deferExpandedContent;
  const [deferredExpandedContentReady, setDeferredExpandedContentReady] = useState(false);
  useEffect(() => {
    if (!shouldDeferExpandedContent) {
      setDeferredExpandedContentReady(false);
      return;
    }

    setDeferredExpandedContentReady(false);
    let revealTimeout: number | null = null;
    const revealFrame = window.requestAnimationFrame(() => {
      revealTimeout = window.setTimeout(() => {
        setDeferredExpandedContentReady(true);
      }, EXPANDED_CONTENT_LOCAL_REVEAL_MS);
    });

    return () => {
      window.cancelAnimationFrame(revealFrame);
      if (revealTimeout) {
        window.clearTimeout(revealTimeout);
      }
    };
  }, [list.id, shouldDeferExpandedContent]);
  const deferHeavyExpandedContent = shouldDeferExpandedContent && !deferredExpandedContentReady;
  const [expandedStopIds, setExpandedStopIds] = useState<string[]>([]);
  const [expandedPlaceIds, setExpandedPlaceIds] = useState<string[]>([]);
  const [itineraryPickerTarget, setItineraryPickerTarget] = useState<null | { kind: "list" | "stop"; key: string }>(null);
  const [addTarget, setAddTarget] = useState<null | { kind: "list" | "stop"; key: string }>(null);
  const [guidePickerTarget, setGuidePickerTarget] = useState<null | { kind: "list" | "stop"; key: string }>(null);
  const [directionsPickerStopId, setDirectionsPickerStopId] = useState<string | null>(null);
  const [newItineraryName, setNewItineraryName] = useState("");
  const [newGuideName, setNewGuideName] = useState("");
  const [itineraryPickerMessage, setItineraryPickerMessage] = useState<string | null>(null);
  const [guidePickerMessage, setGuidePickerMessage] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<null | { src: string; title: string }>(null);
  const [inlineEditing, setInlineEditing] = useState(false);
  const [inlineEditMessage, setInlineEditMessage] = useState<string | null>(null);
  const [draggingInlineStopId, setDraggingInlineStopId] = useState<string | null>(null);
  const [stopListEndPadding, setStopListEndPadding] = useState(0);
  const [stopListMaxScrollTop, setStopListMaxScrollTop] = useState<number | null>(null);
  const [pendingScrollStopId, setPendingScrollStopId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const previousExpandedGuideRef = useRef<string | null>(null);
  const showStopNumbers = true;
  const isRGuide = list.creator.name.startsWith("R ");
  const allSources = isRGuide ? list.sources ?? EMPTY_SOURCES : EMPTY_SOURCES;
  const visibleSources = useMemo(() => getVisibleGuideSources(list, allSources), [allSources, list]);
  const orderedSources = useMemo(
    () => getVariedGuideSources(visibleSources, list.id),
    [visibleSources, list.id],
  );
  const sourcePreview = useMemo(() => orderedSources.slice(0, 5), [orderedSources]);
  const sourceSummary = useMemo(() => (orderedSources.length ? buildSourceSummary(orderedSources) : null), [orderedSources]);
  const [sourcesPinnedOpen, setSourcesPinnedOpen] = useState(false);
  const sourcesOpen = Boolean(visibleSources.length) && sourcesPinnedOpen;
  const itineraryStopGroups = useMemo(
    () => isItineraryGuide && !deferHeavyExpandedContent
    ? list.stops.reduce<Array<{ dateKey: string; stops: Array<{ stop: MapList["stops"][number]; index: number }> }>>(
        (groups, stop, index) => {
          const dateKey = getItineraryStopDate(list, stop, index);
          const existingGroup = groups.find((group) => group.dateKey === dateKey);
          if (existingGroup) {
            existingGroup.stops.push({ stop, index });
            return groups;
          }
          groups.push({ dateKey, stops: [{ stop, index }] });
          return groups;
        },
        [],
      )
    : [],
    [deferHeavyExpandedContent, isItineraryGuide, list],
  );
  const canInlineEditGuide = isOwnEditableGuide && expandedChrome;

  const persistInlineGuideChange = (
    overrides: Partial<Pick<MapList, "title" | "description" | "category" | "stops">> & { publishPublic?: boolean },
  ) => {
    if (!canInlineEditGuide) {
      return false;
    }
    const response = updateSubmittedList(list.id, {
      submissionType: list.submissionType ?? "guide",
      url: list.url,
      title: overrides.title ?? list.title,
      description: overrides.description ?? list.description,
      category: overrides.category ?? list.category,
      continent: list.location.continent,
      country: list.location.country,
      city: list.location.city,
      neighborhood: list.location.neighborhood,
      visitedAt: list.journal?.visitedAt,
      journalNote: list.journal?.note,
      itineraryStartDate: list.itinerary?.startDate ?? list.journey?.startDate,
      itineraryEndDate: list.itinerary?.endDate ?? list.journey?.endDate,
      publishPublic: overrides.publishPublic ?? (list.visibility === "public"),
      stops: overrides.stops ?? list.stops,
    });
    setInlineEditMessage(response.ok ? null : response.message);
    return response.ok;
  };
  const toggleInlineGuidePublish = () => {
    if (!currentUser?.canPublishGuides) {
      setInlineEditMessage("Your account is not allowed to publish public guides yet.");
      return;
    }
    persistInlineGuideChange({ publishPublic: list.visibility !== "public" });
  };

  const handleInlineGuideDelete = () => {
    if (!canInlineEditGuide) {
      return;
    }
    const confirmed = window.confirm(`Delete "${list.title}"? This cannot be undone.`);
    if (!confirmed) {
      return;
    }
    const response = deleteSubmittedList(list.id);
    setInlineEditMessage(response.ok ? null : response.message);
  };

  const updateInlineGuideDescription = (description: string) => {
    const nextDescription = description.trim();
    if (nextDescription && nextDescription !== list.description) {
      persistInlineGuideChange({ description: nextDescription });
    }
  };

  const updateInlineGuideTitle = (title: string) => {
    const nextTitle = title.trim();
    if (nextTitle && nextTitle !== list.title) {
      persistInlineGuideChange({ title: nextTitle });
    }
  };
  const updateInlineGuideCategory = (category: ListCategory) => {
    if (category !== list.category) {
      persistInlineGuideChange({ category });
    }
  };

  const updateInlineStop = (stopId: string, patch: Partial<MapList["stops"][number]>) => {
    const nextStops = list.stops.map((stop) => (stop.id === stopId ? { ...stop, ...patch } : stop));
    persistInlineGuideChange({ stops: nextStops });
  };

  const buildInlineStopDescription = (summary: string, currentDescription: string) => {
    const current = splitStopDescriptionAndHours(currentDescription);
    const nextSummary = summary.trim();
    return current.hours ? `${nextSummary}\n\nHours: ${current.hours}` : nextSummary;
  };

  const updateInlineStopDescription = (stop: MapList["stops"][number], summary: string) => {
    const nextDescription = buildInlineStopDescription(summary, stop.description);
    if (nextDescription !== stop.description) {
      updateInlineStop(stop.id, { description: nextDescription });
    }
  };

  const updateInlineStopName = (stop: MapList["stops"][number], name: string) => {
    const nextName = name.trim();
    if (nextName && nextName !== stop.name) {
      updateInlineStop(stop.id, { name: nextName });
    }
  };

  const addInlineStop = () => {
    const anchorStop = list.stops[list.stops.length - 1];
    const nextStop: MapList["stops"][number] = {
      id: `manual-poi-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: "New place",
      coordinates: anchorStop?.coordinates ?? ([0, 0] as [number, number]),
      description: "Click to add a description.",
      category: list.category,
    };
    const nextStops = [...list.stops, nextStop];
    if (persistInlineGuideChange({ stops: nextStops })) {
      setExpandedStopIds((current) => [...current, nextStop.id]);
      setPendingScrollStopId(nextStop.id);
    }
  };

  const removeInlineStop = (stopId: string) => {
    const nextStops = list.stops.filter((stop) => stop.id !== stopId);
    if (persistInlineGuideChange({ stops: nextStops })) {
      setExpandedStopIds((current) => current.filter((id) => id !== stopId));
      if (forceExpandStopId === stopId) {
        const nextActiveStopId = nextStops[0]?.id;
        if (nextActiveStopId) {
          onStopSelect?.(nextActiveStopId);
        }
      }
    }
  };

  const reorderInlineStop = (targetStopId: string) => {
    const sourceStopId = draggingInlineStopId;
    if (!sourceStopId || sourceStopId === targetStopId) {
      setDraggingInlineStopId(null);
      return;
    }
    const sourceIndex = list.stops.findIndex((stop) => stop.id === sourceStopId);
    const targetIndex = list.stops.findIndex((stop) => stop.id === targetStopId);
    if (sourceIndex < 0 || targetIndex < 0) {
      setDraggingInlineStopId(null);
      return;
    }
    const nextStops = [...list.stops];
    const [movedStop] = nextStops.splice(sourceIndex, 1);
    nextStops.splice(targetIndex, 0, movedStop);
    persistInlineGuideChange({ stops: nextStops });
    setDraggingInlineStopId(null);
  };

  const uploadInlineStopPhoto = (stopId: string, file?: File) => {
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateInlineStop(stopId, { photo: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const togglePlace = (placeId: string) => {
    setExpandedPlaceIds((current) =>
      current.includes(placeId) ? current.filter((id) => id !== placeId) : [...current, placeId],
    );
  };
  const hasActiveTextSelection = () =>
    typeof window !== "undefined" && Boolean(window.getSelection()?.toString().trim());
  const activateGuideHeader = () => {
    if (hasActiveTextSelection()) {
      return;
    }
    onToggleExpand?.(list);
  };
  const activateStopHeader = (stopId: string) => {
    if (hasActiveTextSelection()) {
      return;
    }
    activateGuideStop(stopId);
  };
  const activatePlaceHeader = (placeId: string) => {
    if (hasActiveTextSelection()) {
      return;
    }
    togglePlace(placeId);
  };
  const openPhotoPreview = (photo: { src: string; title: string }) => {
    setPhotoPreview(photo);
  };
  const closePhotoPreview = () => {
    setPhotoPreview(null);
  };
  const scrollStopToTop = (stopId: string) => {
    const runScroll = () => {
      const stopElement = document.getElementById(`guide-stop-item-${list.id}-${stopId}`);
      const mobileScrollElement = document.getElementById(`guide-scroll-container-${list.id}`);
      const desktopScrollElement = document.getElementById(`guide-stop-list-${list.id}`);
      const shouldUseMobileScroller =
        typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;
      const listElement = shouldUseMobileScroller ? mobileScrollElement : desktopScrollElement;

      if (!stopElement || !listElement) {
        return;
      }

      const stopRect = stopElement.getBoundingClientRect();
      const listRect = listElement.getBoundingClientRect();
      const targetTop = listElement.scrollTop + stopRect.top - listRect.top - STOP_SCROLL_TOP_INSET;

      listElement.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth",
      });
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        runScroll();
        window.setTimeout(runScroll, 180);
      });
    });
  };
  const openStopFromPhoto = (stopId: string) => {
    setExpandedStopIds((current) => (current.includes(stopId) ? current : [...current, stopId]));
    onStopHoverChange?.(stopId);
    setPendingScrollStopId(stopId);
  };
  const activateGuideStop = (stopId: string) => {
    onStopSelect?.(stopId);
    openStopFromPhoto(stopId);
  };
  const activateNestedGuideStop = (stopId: string, parentStopId: string) => {
    onStopSelect?.(stopId);
    setPendingScrollStopId(parentStopId);
  };
  const toggleStopWithActivation = (stopId: string) => {
    if (expandedStopIds.includes(stopId)) {
      setExpandedStopIds((current) => current.filter((id) => id !== stopId));
      return;
    }

    activateGuideStop(stopId);
  };

  useEffect(() => {
    if (!expandable) {
      return;
    }
    if (!expanded) {
      setSourcesPinnedOpen(false);
    }
  }, [expandable, expanded]);

  useEffect(() => {
    if (!canInlineEditGuide) {
      setInlineEditing(false);
      setInlineEditMessage(null);
      setDraggingInlineStopId(null);
    }
  }, [canInlineEditGuide, list.id]);

  useEffect(() => {
    if (canInlineEditGuide && startInlineEditingNonce > 0) {
      setInlineEditing(true);
      setInlineEditMessage(null);
    }
  }, [canInlineEditGuide, list.id, startInlineEditingNonce]);

  useEffect(() => {
    if (!expanded) {
      previousExpandedGuideRef.current = null;
      return;
    }

    if (previousExpandedGuideRef.current === list.id) {
      return;
    }

    previousExpandedGuideRef.current = list.id;
    setExpandedStopIds(list.stops[0]?.id ? [list.stops[0].id] : []);
    setExpandedPlaceIds([]);
  }, [expanded, list.id, list.stops]);

  useEffect(() => {
    onExpandedStopIdsChange?.(expanded ? expandedStopIds : []);
  }, [expanded, expandedStopIds, onExpandedStopIdsChange]);

  useEffect(() => {
    if (!expanded || !forceExpandStopId) {
      return;
    }
    const parentStopId =
      list.stops.find((stop) => stop.id === forceExpandStopId)?.id ??
      list.stops.find((stop) => stop.places?.some((place) => place.id === forceExpandStopId))?.id;
    if (!parentStopId) {
      return;
    }
    setExpandedStopIds((current) =>
      current.includes(parentStopId) ? current : [...current, parentStopId],
    );
    setPendingScrollStopId(parentStopId);
  }, [expanded, forceExpandStopId, forceExpandStopNonce, list.stops]);

  useEffect(() => {
    if (!shouldAutoOpenSources || !expanded || !allSources.length) {
      return;
    }

    setSourcesPinnedOpen(true);
    onAutoOpenSourcesHandled?.(list.id);
  }, [allSources.length, expanded, list.id, onAutoOpenSourcesHandled, shouldAutoOpenSources]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!expanded || !fillPane || !list.stops.length || deferHeavyExpandedContent) {
      setStopListEndPadding(0);
      setStopListMaxScrollTop(null);
      return;
    }

    const updateEndPadding = () => {
      const mobileScrollElement = document.getElementById(`guide-scroll-container-${list.id}`);
      const stopListElement = document.getElementById(`guide-stop-list-${list.id}`);
      const shouldUseMobileScroller =
        typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;
      const scrollElement = shouldUseMobileScroller ? mobileScrollElement : stopListElement;
      const lastStop = list.stops[list.stops.length - 1];
      const lastStopSentinel = lastStop
        ? document.getElementById(`guide-stop-top-${list.id}-${lastStop.id}`)
        : null;
      const lastStopElement = lastStop ? document.getElementById(`guide-stop-item-${list.id}-${lastStop.id}`) : null;

      if (!scrollElement || !stopListElement || !lastStopSentinel) {
        setStopListEndPadding(0);
        setStopListMaxScrollTop(null);
        return;
      }

      const listRect = scrollElement.getBoundingClientRect();
      const sentinelRect = lastStopSentinel.getBoundingClientRect();
      const previousPadding = Number.parseFloat(window.getComputedStyle(stopListElement).paddingBottom) || 0;
      const sentinelTop = scrollElement.scrollTop + sentinelRect.top - listRect.top;
      const naturalScrollHeight = scrollElement.scrollHeight - previousPadding;
      const desktopMaxScrollTop = Math.max(0, Math.ceil(sentinelTop - STOP_SCROLL_TOP_INSET));
      const lastStopBottom = lastStopElement
        ? scrollElement.scrollTop + lastStopElement.getBoundingClientRect().bottom - listRect.top
        : sentinelTop;
      const mobileMaxScrollTop = Math.max(
        desktopMaxScrollTop,
        Math.ceil(lastStopBottom - scrollElement.clientHeight + MOBILE_LAST_STOP_SCROLL_EXTRA),
      );
      const nextMaxScrollTop = shouldUseMobileScroller ? mobileMaxScrollTop : desktopMaxScrollTop;
      const nextPadding = shouldUseMobileScroller
        ? 0
        : Math.max(0, Math.ceil(nextMaxScrollTop + scrollElement.clientHeight - naturalScrollHeight));

      setStopListEndPadding(nextPadding);
      setStopListMaxScrollTop(nextMaxScrollTop);
    };

    const updateFrame = window.requestAnimationFrame(updateEndPadding);
    const updateTimeouts = [560, 920].map((delay) => window.setTimeout(updateEndPadding, delay));
    window.addEventListener("resize", updateEndPadding);
    return () => {
      window.cancelAnimationFrame(updateFrame);
      updateTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      window.removeEventListener("resize", updateEndPadding);
    };
  }, [deferHeavyExpandedContent, expanded, expandedStopIds, fillPane, list.id, list.stops]);

  useEffect(() => {
    if (
      !expanded ||
      deferHeavyExpandedContent ||
      !pendingScrollStopId ||
      !expandedStopIds.includes(pendingScrollStopId)
    ) {
      return;
    }

    scrollStopToTop(pendingScrollStopId);
    const scrollTimeouts = [260, 520].map((delay) =>
      window.setTimeout(() => scrollStopToTop(pendingScrollStopId), delay),
    );
    const clearPendingTimeout = window.setTimeout(() => setPendingScrollStopId(null), 620);

    return () => {
      scrollTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      window.clearTimeout(clearPendingTimeout);
    };
  }, [deferHeavyExpandedContent, expanded, expandedStopIds, pendingScrollStopId]);

  const getSourceIconUrl = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;
    } catch {
      return "";
    }
  };

  const openSourcesFromCard = () => {
    if (sourcesOpen) {
      setSourcesPinnedOpen(false);
      return;
    }

    if (expandable && !expanded) {
      if (onRequestOpenSourcesWhenCollapsed) {
        onRequestOpenSourcesWhenCollapsed(list);
      } else {
        onToggleExpand?.(list);
        setSourcesPinnedOpen(true);
      }
      return;
    }

    setSourcesPinnedOpen(true);
  };

  const getDirectionsHref = (stop: { name: string }) => {
    const placeQuery = [
      stop.name,
      list.location.city,
      list.location.country,
      list.location.continent,
    ]
      .filter(Boolean)
      .join(", ");

    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(placeQuery)}`;
  };
  const closeDirectionsPicker = () => {
    setDirectionsPickerStopId(null);
  };
  const openItineraryPickerForList = () => {
    setItineraryPickerTarget({ kind: "list", key: list.id });
    setItineraryPickerMessage(null);
  };
  const openItineraryPickerForStop = (stopKey: string) => {
    setItineraryPickerTarget({ kind: "stop", key: stopKey });
    setItineraryPickerMessage(null);
  };
  const openAddPickerForList = () => {
    setAddTarget({ kind: "list", key: list.id });
  };
  const openAddPickerForStop = (stopKey: string) => {
    setAddTarget({ kind: "stop", key: stopKey });
  };
  const closeAddPicker = () => {
    setAddTarget(null);
  };
  const closeGuidePicker = () => {
    setGuidePickerTarget(null);
    setGuidePickerMessage(null);
    setNewGuideName("");
  };
  const closeItineraryPicker = () => {
    setItineraryPickerTarget(null);
    setItineraryPickerMessage(null);
    setNewItineraryName("");
  };
  const handleAddToPlaylist = (playlistId: string) => {
    if (!itineraryPickerTarget) return;
    if (itineraryPickerTarget.kind === "list") {
      addListToItineraryPlaylist(playlistId, itineraryPickerTarget.key);
    } else {
      addStopToItineraryPlaylist(playlistId, itineraryPickerTarget.key);
    }
    closeItineraryPicker();
  };
  const handleCreatePlaylistAndAdd = () => {
    const result = createItineraryPlaylist(newItineraryName);
    if (!result.ok || !result.playlist) {
      setItineraryPickerMessage(result.message);
      return;
    }
    handleAddToPlaylist(result.playlist.id);
  };
  const ownGuideOptions = submittedLists.filter(
    (entry) =>
      Boolean(currentUser) &&
      entry.creator.id === currentUser?.id &&
      entry.id !== list.id &&
      entry.submissionType !== "journal" &&
      entry.submissionType !== "itinerary" &&
      !isItineraryLikeGuide(entry),
  );
  const isListAddedToUserGuide = ownGuideOptions.some((guide) =>
    guide.stops.some((stop) => isSavedGuideFromSource(stop, list)),
  );
  const isStopAddedToUserGuide = (sourceStop: MapList["stops"][number]) =>
    ownGuideOptions.some((guide) =>
      guide.stops.some((savedStop) => containsSavedStopFromSource(savedStop, list.id, sourceStop)),
    );
  const cloneStopForGuideAddition = (
    stop: MapList["stops"][number],
    prefix: string,
    index: number,
    sourceListId = list.id,
  ): MapList["stops"][number] => ({
    ...stop,
    id: `${prefix}-poi-${index}-${stop.id}`,
    sourceKind: "stop",
    sourceListId: stop.sourceListId ?? sourceListId,
    sourceStopId: stop.sourceStopId ?? stop.id,
    sourceVenueId: stop.sourceVenueId ?? stop.venueId,
    defaultDescription: stop.defaultDescription ?? stop.description,
    category: stop.category ?? list.category,
    places: stop.places?.map((place, placeIndex) =>
      cloneStopForGuideAddition(place, `${prefix}-nested-${index}`, placeIndex, sourceListId),
    ),
  });
  const buildNestedStopFromList = (): MapList["stops"][number] => {
    const idPrefix = `manual-stop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const firstStop = list.stops[0];

    return {
      id: idPrefix,
      sourceKind: "guide",
      sourceListId: list.id,
      name: list.title,
      coordinates: firstStop?.coordinates ?? ([0, 0] as [number, number]),
      description: list.description,
      category: list.category,
      photo: list.photo ?? firstStop?.photo ?? firstStop?.places?.[0]?.photo,
      places: list.stops.map((stop, index) => cloneStopForGuideAddition(stop, idPrefix, index)),
    };
  };
  const buildStopFromTarget = (target: { kind: "list" | "stop"; key: string }) => {
    if (target.kind === "stop") {
      const separatorIndex = target.key.indexOf(":");
      const stopId = separatorIndex >= 0 ? target.key.slice(separatorIndex + 1) : target.key;
      const stop = list.stops.find((entry) => entry.id === stopId);
      if (stop) {
        const idPrefix = `manual-stop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        return cloneStopForGuideAddition(stop, idPrefix, 0);
      }
    }
    if (target.kind === "list") {
      return buildNestedStopFromList();
    }
    return {
      id: `manual-stop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: list.title,
      coordinates: [0, 0] as [number, number],
      description: list.description,
    };
  };
  const handleAddToExistingGuide = (guideId: string) => {
    if (!guidePickerTarget) {
      return;
    }
    const targetGuide = ownGuideOptions.find((entry) => entry.id === guideId);
    if (!targetGuide) {
      setGuidePickerMessage("Guide not found.");
      return;
    }
    const nextStop = buildStopFromTarget(guidePickerTarget);
    const response = updateSubmittedList(targetGuide.id, {
      submissionType: "guide",
      url: targetGuide.url,
      title: targetGuide.title,
      description: targetGuide.description,
      category: targetGuide.category,
      continent: targetGuide.location.continent,
      country: targetGuide.location.country,
      city: targetGuide.location.city,
      neighborhood: targetGuide.location.neighborhood,
      publishPublic: targetGuide.visibility === "public",
      stops: [...targetGuide.stops, nextStop],
    });
    if (!response.ok) {
      setGuidePickerMessage(response.message);
      return;
    }
    closeGuidePicker();
  };
  const handleCreateGuideAndAdd = () => {
    if (!guidePickerTarget) {
      return;
    }
    const trimmedName = newGuideName.trim();
    if (!trimmedName) {
      setGuidePickerMessage("Enter a guide name.");
      return;
    }
    const nextStop = buildStopFromTarget(guidePickerTarget);
    const response = submitList({
      submissionType: "guide",
      url: "https://www.google.com/maps",
      title: trimmedName,
      description: "Custom guide with saved locations.",
      category: list.category,
      continent: list.location.continent,
      country: list.location.country,
      city: list.location.city,
      neighborhood: list.location.neighborhood,
      stops: [nextStop],
    });
    if (!response.ok) {
      setGuidePickerMessage(response.message);
      return;
    }
    closeGuidePicker();
  };
  const handleAddToSubmitFlow = (submissionType: "guide" | "journal") => {
    if (!addTarget) {
      return;
    }
    if (submissionType === "guide") {
      setGuidePickerTarget(addTarget);
      setGuidePickerMessage(null);
      closeAddPicker();
      return;
    }
    let targetName = list.location.city ?? list.title;
    let targetCoordinates: [number, number] | undefined;
    if (addTarget.kind === "stop") {
      const separatorIndex = addTarget.key.indexOf(":");
      const stopId = separatorIndex >= 0 ? addTarget.key.slice(separatorIndex + 1) : addTarget.key;
      const stop = list.stops.find((item) => item.id === stopId);
      if (stop) {
        targetName = stop.name;
        targetCoordinates = stop.coordinates;
      }
    } else if (list.stops[0]) {
      targetName = list.stops[0].name;
      targetCoordinates = list.stops[0].coordinates;
    }

    const params = new URLSearchParams();
    params.set("type", submissionType);
    params.set("add_name", targetName);
    if (list.location.country) {
      params.set("add_country", list.location.country);
    }
    if (list.location.continent) {
      params.set("add_continent", list.location.continent);
    }
    if (targetCoordinates) {
      params.set("add_lat", String(targetCoordinates[0]));
      params.set("add_lng", String(targetCoordinates[1]));
    }
    closeAddPicker();
    router.push(`/submit?${params.toString()}`);
  };

  const renderExpandedFooter = (className = "") => (
    <div
      className={`${
        expanded && fillPane
          ? "mt-2.5 max-h-20 overflow-visible opacity-100 translate-y-0 pointer-events-auto transition-[opacity,transform] duration-200 ease-out"
          : `mt-0 max-h-0 overflow-hidden opacity-0 translate-y-1 pointer-events-none transition-[max-height,opacity,transform,margin-top] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              expanded
                ? "mt-2.5 max-h-20 overflow-visible opacity-100 translate-y-0 pointer-events-auto"
                : ""
            }`
      } ${expanded && !fillPane ? "bg-slate-50" : ""} ${className}`}
    >
      <div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-t border-slate-200 pt-2.5">
          <div className="flex min-w-0 items-center">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${categoryStyle.badge}`}>
              {list.category}
            </span>
          </div>
          <div
            className={`relative transition-opacity duration-300 ease-out ${
              isRGuide && allSources.length
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            {isRGuide && allSources.length ? (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    openSourcesFromCard();
                  }}
                  className="flex items-center justify-center gap-1 rounded-full px-1 py-0.5 hover:bg-stone-100"
                  aria-label="Show sources"
                  aria-expanded={sourcesOpen}
                >
                  {sourcePreview.map((source, index) => (
                    <span
                      key={`${list.id}-${source.name}-${index}`}
                      className={`inline-flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border border-white bg-white shadow-sm ${
                        index === 0 ? "" : "-ml-1.5"
                      }`}
                      title={source.name}
                      aria-label={source.name}
                    >
                      <img
                        src={getSourceIconUrl(source.url)}
                        alt={source.name}
                        loading="lazy"
                        decoding="async"
                        className="h-4 w-4 rounded-full"
                      />
                    </span>
                  ))}
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-500 transition-transform ${
                      sourcesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </>
            ) : null}
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <div className="min-w-0 text-right">
              <Link href={getCreatorHref({ name: list.creator.name })} className="text-[11px] font-medium text-slate-900">
                {list.creator.name}
              </Link>
            </div>
            <span className="inline-flex h-5 w-5 shrink-0 overflow-hidden rounded-full">
              <Image
                src={list.creator.avatar}
                alt={list.creator.name}
                width={20}
                height={20}
                className="h-full w-full object-cover"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const card = (
    <MapListCardRoot
      list={list}
      fillPane={fillPane}
      expanded={expanded}
      expandedChrome={expandedChrome}
      preservingListChrome={preservingListChrome}
      guideAccentColor={guideAccentColor}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onStopHoverClear={() => onStopHoverChange?.(null)}
      isExternallyHovered={isExternallyHovered}
    >
      <div
        className={`relative z-10 flex items-center justify-between gap-3 ${preservingListChrome ? "overflow-visible" : "overflow-hidden"} ${
          expandedChrome && !preservingListChrome
            ? `${expanded ? "sticky top-0" : ""} z-10 -mx-3 min-h-14 border-b px-3 py-2 text-white backdrop-blur ${
                fillPane ? "" : "-mt-3"
              }`
            : ""
        }`}
        style={
          expandedChrome && !preservingListChrome
            ? {
                backgroundColor: expandingListChrome ? "rgb(248, 250, 252)" : guideExpandedColor,
                borderColor: guideExpandedColor,
              }
            : undefined
        }
      >
        {expandingListChrome && !preservingListChrome ? (
          <span
            className="guide-chrome-wipe guide-chrome-wipe--expand pointer-events-none absolute inset-0 z-0"
            style={{ backgroundColor: guideExpandedColor }}
            onAnimationEnd={(event) => {
              if (event.animationName === "guide-chrome-wipe-expand") {
                onExpandChromeComplete?.(list);
              }
            }}
            aria-hidden="true"
          />
        ) : null}
        {preservingListChrome ? (
          <span
            className={`guide-chrome-wipe guide-chrome-header-wipe pointer-events-none absolute z-0 ${
              retractingListChrome ? "guide-chrome-wipe--retract" : expandingListChrome ? "guide-chrome-wipe--expand" : ""
            }`}
            style={{ backgroundColor: guideExpandedColor }}
            onAnimationEnd={(event) => {
              if (
                event.animationName === "guide-chrome-wipe-expand" ||
                event.animationName === "guide-chrome-header-wipe-expand"
              ) {
                onExpandChromeComplete?.(list);
              }
            }}
            aria-hidden="true"
          />
        ) : null}
        <div className="relative z-10 min-w-0 flex-1">
          {expandable ? (
            <div className="flex w-full items-center justify-between gap-2 text-left">
              <div
                role="button"
                tabIndex={0}
                onClick={activateGuideHeader}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onToggleExpand?.(list);
                  }
                }}
                aria-expanded={expanded}
                aria-controls={`guide-panel-${list.id}`}
                className="min-w-0 flex-1 cursor-pointer select-text"
              >
                {inlineEditing ? (
                  <input
                    key={`${list.id}-title-${list.title}`}
                    defaultValue={list.title}
                    onClick={(event) => event.stopPropagation()}
                    onBlur={(event) => updateInlineGuideTitle(event.currentTarget.value)}
                    onKeyDown={(event) => {
                      event.stopPropagation();
                      if (event.key === "Enter") {
                        event.currentTarget.blur();
                      }
                    }}
                    className={`-mx-0.5 block w-[calc(100%+0.25rem)] min-w-0 rounded border border-white/35 bg-transparent px-0.5 py-0 text-lg font-semibold leading-6 text-white outline-none transition placeholder:text-white/45 focus:border-white ${retractingListChrome ? "guide-chrome-title--retract" : ""} ${expandingListChrome ? "guide-chrome-title--expand" : ""}`}
                    aria-label="Edit guide title"
                  />
                ) : (
                  <h3 className={`min-w-0 text-lg font-semibold leading-6 transition-colors ${expandedChrome ? "text-white" : "text-slate-900 group-hover:text-slate-950"} ${retractingListChrome ? "guide-chrome-title--retract" : ""} ${expandingListChrome ? "guide-chrome-title--expand" : ""}`}>{list.title}</h3>
                )}
                <span className="mt-0.5 flex min-w-0 items-center gap-2">
                  {eventCardDateLabel ? (
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] ${
                        expandedChrome
                          ? "bg-white/15 text-white"
                          : "bg-slate-500 text-white"
                      }`}
                    >
                      {eventCardDateLabel}
                    </span>
                  ) : null}
                  {eventCardVenue?.label && eventCardVenue.venueId ? (
                    <Link
                      href={getVenueHref(eventCardVenue.venueId)}
                      onClick={(event) => event.stopPropagation()}
                      className={`block min-w-0 truncate font-mono text-[10px] font-medium uppercase tracking-[0.1em] underline-offset-2 hover:underline ${
                        expandedChrome ? "text-white/75 hover:text-white" : "text-slate-500 hover:text-slate-800"
                      } ${retractingListChrome ? "guide-chrome-meta--retract" : ""} ${expandingListChrome ? "guide-chrome-meta--expand" : ""}`}
                      title={`View events at ${eventCardVenue.label}`}
                    >
                      {eventCardVenue.label}
                    </Link>
                  ) : expandedChrome ? (
                    <span className={`flex min-w-0 items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-white/75 ${retractingListChrome ? "guide-chrome-meta--retract" : ""} ${expandingListChrome ? "guide-chrome-meta--expand" : ""}`}>
                      {inlineEditing ? (
                        <>
                          <select
                            value={list.category}
                            onClick={(event) => event.stopPropagation()}
                            onChange={(event) => updateInlineGuideCategory(event.currentTarget.value as ListCategory)}
                            onKeyDown={(event) => event.stopPropagation()}
                            className="-ml-0.5 max-w-[7.5rem] rounded border border-white/30 bg-transparent px-0.5 py-0 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-white outline-none transition focus:border-white"
                            aria-label="Edit guide category"
                            title="Edit guide category"
                          >
                            {CATEGORIES.map((category) => (
                              <option key={category} value={category} className="bg-white text-slate-950">
                                {category}
                              </option>
                            ))}
                          </select>
                          {editableGuideMetaTail ? (
                            <>
                              <span className="text-white/55" aria-hidden="true">•</span>
                              <span className="min-w-0 truncate">{editableGuideMetaTail}</span>
                            </>
                          ) : null}
                        </>
                      ) : (
                        <span className="min-w-0 truncate">{guideMeta}</span>
                      )}
                    </span>
                  ) : (
                    <span className={`flex min-w-0 items-center gap-2 ${retractingListChrome ? "guide-chrome-meta--retract" : ""} ${expandingListChrome ? "guide-chrome-meta--expand" : ""}`}>
                      <span
                        className="inline-flex max-w-full shrink-0 items-center overflow-hidden rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-white shadow-sm"
                        style={{ backgroundColor: guideAccentColor }}
                        title={collapsedCategoryChip.label}
                      >
                        <span className="truncate">{collapsedCategoryChip.label}</span>
                      </span>
                      <span className="min-w-0 truncate font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-slate-500">
                        {[`${list.stops.length} ${list.stops.length === 1 ? "place" : "places"}`, locationSubtitle]
                          .filter(Boolean)
                          .join(" • ")}
                      </span>
                    </span>
                  )}
                </span>
              </div>
            </div>
          ) : (
            <>
              <h3 className="min-w-0 text-lg font-semibold leading-6 text-slate-900">
                <Link href={getGuideHref(list)}>{list.title}</Link>
              </h3>
              {locationSubtitle ? (
                <p className="mt-0.5 truncate text-xs font-medium text-slate-500">{locationSubtitle}</p>
              ) : null}
            </>
          )}
        </div>
        <div className="relative z-10 flex shrink-0 items-center gap-1.5">
          {canInlineEditGuide && currentUser?.canPublishGuides ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                toggleInlineGuidePublish();
              }}
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-medium transition ${
                list.visibility === "public"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:border-emerald-400"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900"
              }`}
              aria-label={list.visibility === "public" ? "Unpublish guide" : "Publish guide"}
              title={list.visibility === "public" ? "Published" : "Draft"}
            >
              <span>{list.visibility === "public" ? "Public" : "Draft"}</span>
            </button>
          ) : null}
          {canInlineEditGuide ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setInlineEditing((current) => !current);
                setInlineEditMessage(null);
              }}
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-medium transition ${
                inlineEditing
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900"
              }`}
              aria-label={inlineEditing ? "Finish editing guide" : "Edit guide"}
              title={inlineEditing ? "Finish editing guide" : "Edit guide"}
            >
              {inlineEditing ? <Check className="h-3 w-3" /> : null}
              <span>{inlineEditing ? "Done" : "Edit"}</span>
            </button>
          ) : null}
          {canInlineEditGuide && inlineEditing ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleInlineGuideDelete();
              }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-700 transition hover:border-rose-400 hover:bg-rose-50 hover:text-rose-800"
              aria-label="Delete guide"
              title="Delete guide"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          ) : null}
          {usesGuideActions ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openAddPickerForList();
              }}
              className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-medium ${
                isInItinerary || isListAddedToUserGuide
                  ? "bg-emerald-600 text-white"
                  : "border border-slate-200 bg-white text-slate-700"
              }`}
              aria-label="Add"
              title="Add"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          ) : null}
          {usesGuideActions ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                toggleFavorite(list.id);
              }}
              className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-medium ${
                isFavorited ? "bg-rose-950 text-rose-50" : "border border-slate-200 bg-white text-slate-700"
              }`}
              aria-label={isFavorited ? "Remove favorite" : "Favorite guide"}
              title={isFavorited ? "Remove favorite" : "Favorite guide"}
            >
              <Heart className={`h-3.5 w-3.5 ${isFavorited ? "fill-current" : ""}`} />
            </button>
          ) : null}
          {expandable && expandedChrome ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleExpand?.(list);
              }}
              aria-expanded={expanded}
              aria-controls={`guide-panel-${list.id}`}
              className="inline-flex h-7 w-5 shrink-0 items-center justify-center text-white/85 transition hover:text-white"
              aria-label={`${expanded ? "Collapse" : "Expand"} ${list.title}`}
              title={`${expanded ? "Collapse" : "Expand"} ${list.title}`}
            >
              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                  expanded
                    ? `rotate-180 ${expandingListChrome ? "guide-chrome-chevron--expand" : ""}`
                    : retractingListChrome
                      ? "guide-chrome-chevron--retract"
                      : expandingListChrome
                        ? "guide-chrome-chevron--expand"
                        : ""
                }`}
              />
            </button>
          ) : null}
          {expandable && !expandedChrome ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleExpand?.(list);
              }}
              aria-expanded={expanded}
              aria-controls={`guide-panel-${list.id}`}
              className="inline-flex h-7 w-5 shrink-0 items-center justify-center text-slate-500 transition hover:text-slate-900"
              aria-label={`Expand ${list.title}`}
              title={`Expand ${list.title}`}
            >
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-y-0.5 group-focus-within:translate-y-0.5" />
            </button>
          ) : null}
        </div>
      </div>
      {expandable && !expanded && sourceSummary ? (
        <GuideSourceSummary
          listId={list.id}
          sources={visibleSources}
          sourceSummary={sourceSummary}
          getSourceIconUrl={getSourceIconUrl}
          variant="collapsed"
        />
      ) : null}
      {expandable && !expanded ? (
        <p className="collapsed-guide-hover-description relative z-10 px-3 text-xs leading-4 text-slate-600">
          {list.description}
        </p>
      ) : null}
      {!expandable ? (
        <div className="mt-3">
          <p className="te-kicker text-[11px] font-medium text-slate-500">Description</p>
          <p className="mt-2 px-3 text-sm leading-5 text-slate-600">{list.description}</p>
        </div>
      ) : null}

      {expandable ? (
        <div
          id={`guide-panel-${list.id}`}
          className={`guide-expand-panel grid transition-[grid-template-rows,opacity,margin,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            expanded ? "mt-2 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
          } ${fillPane && expanded ? "min-h-0 flex-1 basis-0" : ""} ${
            expanded ? `relative -mx-3 px-3 ${fillPane ? "bg-transparent" : "bg-slate-50"}` : ""
          }`}
        >
          <div
            className={`guide-expand-panel-content ${fillPane && expanded ? "flex min-h-0 flex-1 flex-col overflow-hidden pb-3" : "overflow-hidden"}`}
          >
            <div
              id={`guide-scroll-container-${list.id}`}
              onScroll={(event) => {
                if (stopListMaxScrollTop === null) {
                  return;
                }
                const shouldClampMobileScroller =
                  typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;
                if (!shouldClampMobileScroller) {
                  return;
                }
                const element = event.currentTarget;
                if (element.scrollTop > stopListMaxScrollTop) {
                  element.scrollTop = stopListMaxScrollTop;
                }
              }}
              className={`${fillPane && expanded ? "mobile-guide-scroll-container flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pb-3 pr-1 lg:overflow-hidden lg:pb-0 lg:pr-0" : ""} relative pt-2`}
            >
              <GuideBodyComponent>
              <div
                className={
                  collapseExpandedContent
                    ? "guide-expanded-content-collapse-bottom-up"
                    : hideExpandedContent
                      ? "guide-expanded-content-collapsed"
                      : "contents"
                }
              >
                <div className={collapseExpandedContent || hideExpandedContent ? "guide-expanded-content-collapse-content" : "contents"}>
              <GuideExpandedIntro
                list={list}
                isEditing={inlineEditing}
                onDescriptionChange={updateInlineGuideDescription}
                sourceAction={
                  sourceSummary ? (
                  <GuideSourceSummary
                    listId={list.id}
                    sources={visibleSources}
                    sourceSummary={sourceSummary}
                    getSourceIconUrl={getSourceIconUrl}
                    variant="expanded-top"
                    open={sourcesOpen}
                    onToggle={(event) => {
                      event.stopPropagation();
                      openSourcesFromCard();
                    }}
                  />
                  ) : null
                }
              />
              {inlineEditing && inlineEditMessage ? (
                <p className="guide-content-cascade-item relative z-10 mt-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                  {inlineEditMessage}
                </p>
              ) : null}
              {(list.stops.length > 0 || inlineEditing) && !deferHeavyExpandedContent ? (
                <div className="contents">
                  <div className="contents">
                    <GuidePhotoStrip
                      stops={list.stops}
                      title={isEventGuide ? "Schedule" : "Places of Interest"}
                      activeStopId={forceExpandStopId}
                      fallbackCategory={list.category}
                      getStopCategory={(stop) =>
                        isItineraryGuide ? inferJourneyStopCategory(stop, list.category) : stop.category ?? list.category
                      }
                      handlers={{
                        onStopSelect: activateGuideStop,
                        onStopHoverChange,
                      }}
                      style={{ animationDelay: "65ms" }}
                    />
                    <ol
                      id={`guide-stop-list-${list.id}`}
                      onScroll={(event) => {
                        if (stopListMaxScrollTop === null) {
                          return;
                        }
                        const shouldClampDesktopScroller =
                          typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
                        if (!shouldClampDesktopScroller) {
                          return;
                        }
                        const element = event.currentTarget;
                        if (element.scrollTop > stopListMaxScrollTop) {
                          element.scrollTop = stopListMaxScrollTop;
                        }
                      }}
                      style={
                        fillPane && expanded && stopListEndPadding > 0
                          ? { paddingBottom: stopListEndPadding }
                          : undefined
                      }
                      className={`relative z-10 mt-2 grid gap-2 ${
                        fillPane && expanded
                          ? "guide-stop-list min-h-0 touch-pan-y auto-rows-max pt-0.5 pr-1 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain"
                          : ""
                      }`}
                    >
                      {list.stops.map((stop, index) => (
                        (() => {
                        const stopContent = splitStopDescriptionAndHours(stop.description);
                        const resolvedStopHours = resolveStopHours(stop) ?? stopContent.hours;
                        const stopItineraryId = `${list.id}:${stop.id}`;
                        const stopCategory = isItineraryGuide ? inferJourneyStopCategory(stop, list.category) : stop.category ?? list.category;
                        const stopCategoryStyle = CATEGORY_STYLES[stopCategory];
                        const stopPhoto = getPoiPhoto(stop.photo);
                        const stopAttributeTags = getPoiAttributeTags(stop, stopCategory);
                        const hasStopCopy = stopContent.summary.trim().length > 0 || stopAttributeTags.length > 0;
                        const stayBookingDetails = getStayBookingDetails(list, stop, stopCategory);
                        const nearbyStayDetails = getNearbyStayDetails(list, stop);
                        const timetableUrl = stop.timetableUrl;
                        const officialStopUrl = list.id.startsWith("event-")
                          ? stop.officialUrl ?? stop.bookingUrl
                          : stop.officialUrl && stop.officialUrl !== timetableUrl
                            ? stop.officialUrl
                            : null;
                        const isStopInItinerary =
                          itineraryStopIds.includes(stopItineraryId) ||
                          itineraryPlaylists.some((playlist) => playlist.stopKeys.includes(stopItineraryId));
                        const isStopAddedToGuide = isStopAddedToUserGuide(stop);
                        const isStopExpanded = expandedStopIds.includes(stop.id);
                        const isStopMapSelected = forceExpandStopId === stop.id;
                        const itineraryDateKey = isItineraryGuide ? getItineraryStopDate(list, stop, index) : "";
                        const previousItineraryDateKey =
                          isItineraryGuide && index > 0
                            ? getItineraryStopDate(list, list.stops[index - 1], index - 1)
                            : "";
                        const itineraryGroupIndex = itineraryStopGroups.findIndex(
                          (group) => group.dateKey === itineraryDateKey,
                        );
                        const shouldShowItineraryDay =
                          isItineraryGuide && itineraryDateKey !== previousItineraryDateKey;
                        return (
                      <Fragment key={`${list.id}-stop-row-${stop.id}`}>
                      {shouldShowItineraryDay ? (
                        <li
                          key={`${list.id}-itinerary-day-${itineraryDateKey}`}
                          className="guide-content-cascade-item list-none pt-2 first:pt-0"
                          style={{ animationDelay: `${90 + Math.min(index, 4) * 24}ms` }}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white"
                              style={{ backgroundColor: guideAccentColor }}
                            >
                              {formatItineraryDayLabel(itineraryDateKey, itineraryGroupIndex)}
                            </span>
                            <div className="h-px flex-1 bg-slate-200" />
                          </div>
                        </li>
                      ) : null}
                      <GuideStopCardChrome
                        key={stop.id}
                        listId={list.id}
                        stop={stop}
                        index={index}
                        totalStops={list.stops.length}
                        category={stopCategory}
                        showStopNumbers={showStopNumbers}
                        isExpanded={isStopExpanded}
                        isActive={isStopMapSelected}
                        showAddAction={!isItineraryGuide}
                        isStopInItinerary={isStopInItinerary}
                        isStopAddedToGuide={isStopAddedToGuide}
                        animationDelay={`${110 + Math.min(index, 4) * 24}ms`}
                        onHeaderActivate={activateStopHeader}
                        onAddStop={() => openAddPickerForStop(stopItineraryId)}
                        titleContent={
                          inlineEditing ? (
                            <input
                              key={`${stop.id}-name-${stop.name}`}
                              defaultValue={stop.name}
                              onClick={(event) => event.stopPropagation()}
                              onBlur={(event) => updateInlineStopName(stop, event.currentTarget.value)}
                              onKeyDown={(event) => {
                                event.stopPropagation();
                                if (event.key === "Enter") {
                                  event.currentTarget.blur();
                                }
                              }}
                              className="-mx-0.5 block w-[calc(100%+0.25rem)] rounded border border-slate-950/16 bg-transparent px-0.5 py-0 text-base font-semibold leading-5 text-slate-900 outline-none transition focus:border-slate-500"
                              aria-label={`Edit ${stop.name} name`}
                            />
                          ) : null
                        }
                        editActions={
                          inlineEditing ? (
                            <div className="flex shrink-0 items-center gap-1">
                              <button
                                type="button"
                                draggable
                                onDragStart={(event) => {
                                  event.stopPropagation();
                                  setDraggingInlineStopId(stop.id);
                                  event.dataTransfer.effectAllowed = "move";
                                }}
                                onDragEnd={() => setDraggingInlineStopId(null)}
                                className="inline-flex h-7 w-7 cursor-grab items-center justify-center rounded-md border border-slate-950/10 bg-white/80 text-slate-500 transition hover:border-slate-950/20 hover:text-slate-800 active:cursor-grabbing"
                                aria-label={`Reorder ${stop.name}`}
                                title="Drag to reorder"
                              >
                                <GripVertical className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  removeInlineStop(stop.id);
                                }}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-rose-200 bg-white/80 text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
                                aria-label={`Remove ${stop.name}`}
                                title={`Remove ${stop.name}`}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : null
                        }
                        isEditing={inlineEditing}
                        onReorderDragOver={(event) => {
                          event.preventDefault();
                          event.dataTransfer.dropEffect = "move";
                        }}
                        onReorderDrop={reorderInlineStop}
                        handlers={{
                          onStopSelect: activateGuideStop,
                          onStopToggle: toggleStopWithActivation,
                          onStopHoverChange,
                        }}
                      >
                            <div className="expanded-guide-stop-body border-t border-slate-950/10 px-4 py-3">
                              <div className={`expanded-poi-bio ${stopPhoto || inlineEditing ? "" : "expanded-poi-bio-no-photo"}`}>
                                {stopPhoto || inlineEditing ? (
                                  inlineEditing ? (
                                    <label
                                      className="expanded-poi-bio-photo group relative cursor-pointer overflow-hidden"
                                      onClick={(event) => event.stopPropagation()}
                                      title={`Upload photo for ${stop.name}`}
                                    >
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="sr-only"
                                        onChange={(event) => uploadInlineStopPhoto(stop.id, event.currentTarget.files?.[0])}
                                      />
                                      {stopPhoto ? (
                                        <img
                                          src={stopPhoto ?? ""}
                                          alt=""
                                          loading="lazy"
                                          decoding="async"
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <span className="flex h-full w-full flex-col items-center justify-center gap-1 bg-slate-100 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                                          <Upload className="h-4 w-4" />
                                          Photo
                                        </span>
                                      )}
                                      <span className="absolute inset-x-0 bottom-0 bg-slate-950/75 px-2 py-1 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-white opacity-0 transition group-hover:opacity-100">
                                        Upload
                                      </span>
                                    </label>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        openPhotoPreview({ src: stopPhoto ?? "", title: stop.name });
                                      }}
                                      className="expanded-poi-bio-photo"
                                      aria-label={`Open photo of ${stop.name}`}
                                      title={`Open photo of ${stop.name}`}
                                    >
                                      <img
                                        src={stopPhoto ?? ""}
                                        alt=""
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-cover"
                                      />
                                    </button>
                                  )
                                ) : null}
                                {hasStopCopy || inlineEditing ? (
                                  <div className="expanded-poi-copy min-w-0">
                                    {inlineEditing ? (
                                      <textarea
                                        key={`${stop.id}-description-${stop.description}`}
                                        defaultValue={stopContent.summary}
                                        rows={4}
                                        onClick={(event) => event.stopPropagation()}
                                        onBlur={(event) => updateInlineStopDescription(stop, event.currentTarget.value)}
                                        onKeyDown={(event) => event.stopPropagation()}
                                        className="w-full resize-y rounded-md border border-slate-950/10 bg-white/85 px-3 py-2 text-base leading-7 text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
                                        aria-label={`Edit ${stop.name} description`}
                                      />
                                    ) : stopContent.summary.trim().length ? (
                                      <p>{stopContent.summary}</p>
                                    ) : null}
                                    {stopAttributeTags.length ? (
                                      <div className="expanded-poi-tags" aria-label={`${stop.name} attributes`}>
                                        {stopAttributeTags.map((tag) => (
                                          <span key={`${stop.id}-tag-${tag}`}>{tag}</span>
                                        ))}
                                      </div>
                                    ) : null}
                                  </div>
                                ) : null}
                              </div>
                              {stop.places?.length ? (
                                <div className="mt-3">
                                  <div className="mb-2 flex items-center gap-2">
                                    <p className="ml-[3.75rem] font-mono text-[10px] font-semibold uppercase text-slate-500">POI</p>
                                    <div className="h-px flex-1 bg-slate-950/10" />
                                  </div>
                                  <div className="space-y-2">
                                    {stop.places.map((place, placeIndex) => (
                                      <NestedPoiCard
                                        key={place.id}
                                        place={place}
                                        parentStopId={stop.id}
                                        index={placeIndex}
                                        category={place.category ?? stopCategory}
                                        isExpanded={expandedPlaceIds.includes(place.id)}
                                        isActive={forceExpandStopId === place.id}
                                        attributeTags={getPoiAttributeTags(place, place.category ?? stopCategory)}
                                        handlers={{
                                          onNestedStopSelect: activateNestedGuideStop,
                                          onPlaceHeaderActivate: activatePlaceHeader,
                                          onPlaceToggle: togglePlace,
                                          onStopHoverChange,
                                          onOpenPhoto: openPhotoPreview,
                                        }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              ) : null}
                              <GuideStopFooterActions
                                stop={stop}
                                resolvedStopHours={resolvedStopHours}
                                isHistoricalGuide={isHistoricalGuide}
                                weekdayLabel={weekdayLabel}
                                officialStopUrl={officialStopUrl}
                                timetableUrl={timetableUrl}
                                directionsPickerOpen={directionsPickerStopId === stop.id}
                                stayBookingDetails={stayBookingDetails}
                                nearbyStayDetails={nearbyStayDetails}
                                getDirectionsHref={getDirectionsHref}
                                onToggleDirectionsPicker={() =>
                                  setDirectionsPickerStopId((current) => (current === stop.id ? null : stop.id))
                                }
                                onCloseDirectionsPicker={closeDirectionsPicker}
                              />
                            </div>
                      </GuideStopCardChrome>
                      </Fragment>
                        );
                      })()
                      ))}
                      {inlineEditing ? (
                        <li className="guide-content-cascade-item list-none pt-1">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              addInlineStop();
                            }}
                            className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-white hover:text-slate-900"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add place</span>
                          </button>
                        </li>
                      ) : null}
                    </ol>
                  </div>
                </div>
              ) : null}
                </div>
              </div>
              </GuideBodyComponent>
            </div>
          </div>
        </div>
      ) : null}

      {renderExpandedFooter(fillPane ? "hidden lg:block" : "")}
      <GuideSourcesOverlay
        listId={list.id}
        sources={visibleSources}
        open={sourcesOpen}
        getSourceIconUrl={getSourceIconUrl}
        onClose={() => setSourcesPinnedOpen(false)}
      />
      {mounted
        ? createPortal(
            <>
              {photoPreview ? (
                <div
                  className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
                  onClick={closePhotoPreview}
                >
                  <div
                    className="relative w-full max-w-3xl overflow-hidden rounded-lg border border-white/20 bg-slate-950 shadow-2xl"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={closePhotoPreview}
                      className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/90 text-slate-700 shadow-sm transition hover:bg-white hover:text-slate-950"
                      aria-label="Close photo"
                      title="Close photo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <img
                      src={photoPreview.src}
                      alt={photoPreview.title}
                      decoding="async"
                      className="max-h-[78vh] w-full object-contain"
                    />
                    <div className="border-t border-white/10 bg-slate-950 px-4 py-3">
                      <p className="text-sm font-semibold text-white">{photoPreview.title}</p>
                    </div>
                  </div>
                </div>
              ) : null}
              {itineraryPickerTarget ? (
                <div
                  className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/35 p-4"
                  onClick={closeItineraryPicker}
                >
                  <div
                    className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Add to journey</p>
                    <p className="mt-1 text-sm text-slate-700">Choose a journey or create a new one.</p>
                    <div className="mt-3 space-y-2">
                      {itineraryPlaylists.map((playlist) => (
                        <button
                          key={playlist.id}
                          type="button"
                          onClick={() => handleAddToPlaylist(playlist.id)}
                          className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 hover:border-slate-300 hover:text-slate-900"
                        >
                          {playlist.name}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={newItineraryName}
                        onChange={(event) => setNewItineraryName(event.target.value)}
                        placeholder="New journey name"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleCreatePlaylistAndAdd}
                        className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900"
                      >
                        Create
                      </button>
                    </div>
                    {itineraryPickerMessage ? (
                      <p className="mt-2 text-xs text-slate-600">{itineraryPickerMessage}</p>
                    ) : null}
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={closeItineraryPicker}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:border-slate-300 hover:text-slate-900"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
              {addTarget ? (
                <div
                  className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/35 p-4"
                  onClick={closeAddPicker}
                >
                  <div
                    className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Add to</p>
                    <div className="mt-3 space-y-2">
                      <Link
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();
                          handleAddToSubmitFlow("guide");
                        }}
                        className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 hover:border-slate-300 hover:text-slate-900"
                      >
                        Add to guide
                      </Link>
                      <Link
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();
                          handleAddToSubmitFlow("journal");
                        }}
                        className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 hover:border-slate-300 hover:text-slate-900"
                      >
                        Add to experience
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          if (addTarget.kind === "list") {
                            openItineraryPickerForList();
                          } else {
                            openItineraryPickerForStop(addTarget.key);
                          }
                          closeAddPicker();
                        }}
                        className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 hover:border-slate-300 hover:text-slate-900"
                      >
                        Add to journey
                      </button>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={closeAddPicker}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:border-slate-300 hover:text-slate-900"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
              {guidePickerTarget ? (
                <div
                  className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/35 p-4"
                  onClick={closeGuidePicker}
                >
                  <div
                    className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Add to guide</p>
                    <p className="mt-1 text-sm text-slate-700">Choose an existing guide or create a new one.</p>
                    <div className="mt-3 space-y-2">
                      {ownGuideOptions.map((guide) => (
                        <button
                          key={guide.id}
                          type="button"
                          onClick={() => handleAddToExistingGuide(guide.id)}
                          className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 hover:border-slate-300 hover:text-slate-900"
                        >
                          {guide.title}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={newGuideName}
                        onChange={(event) => setNewGuideName(event.target.value)}
                        placeholder="New guide name"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleCreateGuideAndAdd}
                        className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900"
                      >
                        Create
                      </button>
                    </div>
                    {guidePickerMessage ? (
                      <p className="mt-2 text-xs text-slate-600">{guidePickerMessage}</p>
                    ) : null}
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={closeGuidePicker}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:border-slate-300 hover:text-slate-900"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </>,
            document.body,
          )
        : null}
    </MapListCardRoot>
  );

  if (!collapsedFirstPoiPhoto || expanded || fillPane) {
    return card;
  }

  return (
    <div
      className="collapsed-guide-card-with-outboard-image"
      data-guide-opening={isOutboardImageOpening ? "true" : undefined}
      data-guide-closing={isOutboardImageClosing ? "true" : undefined}
      data-guide-chrome-preserved={preservingListChrome ? "true" : undefined}
      style={{ "--guide-accent": guideAccentColor } as React.CSSProperties}
      onMouseEnter={() => onHoverStart?.(list)}
      onMouseLeave={() => {
        onStopHoverChange?.(null);
        onHoverEnd?.();
      }}
      onFocus={() => onHoverStart?.(list)}
      onBlur={() => {
        onStopHoverChange?.(null);
        onHoverEnd?.();
      }}
    >
      <button
        type="button"
        className="collapsed-guide-outboard-image"
        style={{ borderColor: guideAccentColor }}
        onClick={(event) => {
          event.stopPropagation();
          if (expandable) {
            onToggleExpand?.(list);
          }
        }}
        aria-expanded={expanded}
        aria-controls={`guide-panel-${list.id}`}
        aria-label={`Expand ${list.title}`}
        title={`Expand ${list.title}`}
      >
        <img
          src={collapsedFirstPoiPhoto}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </button>
      {card}
    </div>
  );
}
