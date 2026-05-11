"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { CalendarCheck, ChevronDown, ExternalLink, Navigation, Plus, ThumbsUp, X } from "lucide-react";

import { getCreatorHref, getGuideHref } from "@/lib/routes";
import { resolveStopHours } from "@/lib/seasonal-hours";
import { formatNumber } from "@/lib/utils";
import { CATEGORY_STYLES } from "@/lib/constants";
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
  deferExpandedContent?: boolean;
  onExpandChromeComplete?: (list: MapList) => void;
  expandable?: boolean;
  fillPane?: boolean;
  onToggleExpand?: (list: MapList) => void;
  shouldAutoOpenSources?: boolean;
  onAutoOpenSourcesHandled?: (listId: string) => void;
  onRequestOpenSourcesWhenCollapsed?: (list: MapList) => void;
  onEditGuide?: (list: MapList) => void;
  onExpandedStopIdsChange?: (stopIds: string[]) => void;
  collapsedLocationSubtitleHiddenParts?: string[];
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

function buildLocationSubtitle(list: MapList, hiddenParts: string[] = []) {
  const hiddenLocationParts = new Set(hiddenParts.map(normalizeLocationSubtitlePart).filter(Boolean));

  return [
    list.location.neighborhood,
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
  const placeLabel =
    isEventGuide
      ? `${placeCount} ${placeCount === 1 ? "event" : "events"}`
      : `${placeCount} ${placeCount === 1 ? "place" : "places"}`;
  const locationLabel = buildLocationSubtitle(list, hiddenLocationParts);
  const typeLabel =
    isEventGuide
      ? "Event"
      : list.submissionType === "itinerary"
        ? "Journey"
        : list.category;
  return [typeLabel, placeLabel, locationLabel].filter(Boolean).join(" • ");
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
  const formatted = new Intl.DateTimeFormat(undefined, {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dateKey}T00:00:00`));
  return `${dayLabel} - ${formatted}`;
}

const STOP_SCROLL_TOP_INSET = 4;

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

function formatAttributeTagLabel(tag: string) {
  return tag
    .replace(/_(food|nightlife|drinks)$/g, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getPoiAttributeTags(stop: MapList["stops"][number]) {
  return [...(stop.attributeTags ?? []), ...(stop.tags ?? [])]
    .filter(Boolean)
    .filter((tag, index, all) => all.findIndex((item) => item.toLowerCase() === tag.toLowerCase()) === index)
    .slice(0, 4)
    .map(formatAttributeTagLabel);
}

type StayBookingPlatform = "booking" | "hostelworld";

function isHostelGuide(list: MapList) {
  const slug = list.slug.toLowerCase();
  const isMixedStayGuide = slug.includes("hotels-and-hostels");
  return (
    !isMixedStayGuide &&
    (list.seoSlug === "best-hostels" ||
      slug === "hostels" ||
      slug.endsWith("-hostels") ||
      slug.includes("best-hostels"))
  );
}

function isHostelStop(list: MapList, stop: MapList["stops"][number]) {
  const stopText = [stop.name, stop.priceSource].filter(Boolean).join(" ").toLowerCase();

  return (
    isHostelGuide(list) ||
    /\bhostelworld\b/.test(stopText) ||
    /\bhostels?\b/.test(stopText) ||
    /\bhostal\b/.test(stopText) ||
    /\bostello\b/.test(stopText) ||
    /\bguesthouse\b/.test(stopText)
  );
}

function getStayBookingPlatformFromUrl(url?: string): StayBookingPlatform | null {
  if (!url) {
    return null;
  }

  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes("hostelworld.")) {
      return "hostelworld";
    }
    if (hostname.includes("booking.")) {
      return "booking";
    }
  } catch {
    return null;
  }

  return null;
}

function getStayBookingDetails(list: MapList, stop: MapList["stops"][number], resolvedCategory: ListCategory = stop.category ?? list.category) {
  if (resolvedCategory !== "Stay") {
    return null;
  }

  const platform: StayBookingPlatform =
    getStayBookingPlatformFromUrl(stop.bookingUrl) ?? (isHostelStop(list, stop) ? "hostelworld" : "booking");
  const platformLabel = platform === "hostelworld" ? "Hostelworld" : "Booking.com";

  if (stop.bookingUrl) {
    return {
      href: stop.bookingUrl,
      platformLabel,
    };
  }

  const searchQuery = [stop.name, list.location.city, list.location.country].filter(Boolean).join(", ");
  const encodedQuery = encodeURIComponent(searchQuery);

  return {
    href:
      platform === "hostelworld"
        ? `https://www.hostelworld.com/find/keywordsuggestions?internalsearch=yes&search_keywords=${encodedQuery}`
        : `https://www.booking.com/searchresults.html?ss=${encodedQuery}`,
    platformLabel,
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
  deferExpandedContent = false,
  onExpandChromeComplete,
  expandable = false,
  fillPane = false,
  onToggleExpand,
  shouldAutoOpenSources = false,
  onAutoOpenSourcesHandled,
  onRequestOpenSourcesWhenCollapsed,
  onEditGuide,
  onExpandedStopIdsChange,
  collapsedLocationSubtitleHiddenParts = [],
}: MapListCardProps) {
  const router = useRouter();
  const weekdayLabel = new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(new Date());
  const currentUser = useAppStore((state) => state.currentUser);
  const submittedLists = useAppStore((state) => state.submittedLists);
  const votedIds = useAppStore((state) => state.votedIds);
  const itineraryStopIds = useAppStore((state) => state.itineraryStopIds);
  const itineraryPlaylists = useAppStore((state) => state.itineraryPlaylists);
  const toggleUpvote = useAppStore((state) => state.toggleUpvote);
  const addListToItineraryPlaylist = useAppStore((state) => state.addListToItineraryPlaylist);
  const addStopToItineraryPlaylist = useAppStore((state) => state.addStopToItineraryPlaylist);
  const createItineraryPlaylist = useAppStore((state) => state.createItineraryPlaylist);
  const submitList = useAppStore((state) => state.submitList);
  const updateSubmittedList = useAppStore((state) => state.updateSubmittedList);

  const hasVoted = votedIds.includes(list.id);
  const isInItinerary = itineraryPlaylists.some((playlist) => playlist.listIds.includes(list.id));
  const isItineraryGuide = isInItinerary || isItineraryLikeGuide(list);
  const isOwnGuide = Boolean(currentUser && currentUser.id === list.creator.id);
  const isOwnEditableGuide = isOwnGuide && !isItineraryGuide;
  const isHistoricalGuide = list.creator.id === "user-rguide-history";
  const categoryStyle = CATEGORY_STYLES[list.category];
  const guideAccentColor = isItineraryGuide ? "#020617" : categoryStyle.mapColor;
  const guideExpandedColor = isItineraryGuide ? "#111827" : categoryStyle.mapColor;
  const visibleUpvotes = list.upvotes + (hasVoted ? 1 : 0);
  const expandedChrome = expanded || preserveExpandedChrome;
  const hiddenLocationParts = expandedChrome ? [] : collapsedLocationSubtitleHiddenParts;
  const locationSubtitle = buildLocationSubtitle(list, hiddenLocationParts);
  const guideMeta = buildGuideMeta(list, hiddenLocationParts);
  const preservingListChrome = preserveExpandedChrome && !fillPane;
  const retractingListChrome = preservingListChrome && retractExpandedChrome;
  const expandingListChrome = expandExpandedChrome && expandedChrome;
  const deferHeavyExpandedContent = expanded && deferExpandedContent;
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
  const [stopListEndPadding, setStopListEndPadding] = useState(0);
  const [stopListMaxScrollTop, setStopListMaxScrollTop] = useState<number | null>(null);
  const [pendingScrollStopId, setPendingScrollStopId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const previousExpandedGuideRef = useRef<string | null>(null);
  const showStopNumbers = true;
  const isRGuide = list.creator.name.startsWith("R ");
  const allSources = isRGuide ? list.sources ?? [] : [];
  const sourcePreview = allSources.slice(0, 5);
  const sourceStripPreview = allSources.slice(0, 3);
  const sourceSummary = allSources.length ? buildSourceSummary(allSources) : null;
  const [sourcesPinnedOpen, setSourcesPinnedOpen] = useState(false);
  const sourcesOpen = Boolean(allSources.length) && sourcesPinnedOpen;
  const itineraryStopGroups = isItineraryGuide && !deferHeavyExpandedContent
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
    : [];

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
      const nextPadding = Math.max(0, Math.ceil(sentinelTop + scrollElement.clientHeight - naturalScrollHeight));

      setStopListEndPadding(nextPadding);
      setStopListMaxScrollTop(Math.max(0, Math.ceil(sentinelTop - STOP_SCROLL_TOP_INSET)));
    };

    updateEndPadding();
    const updateFrame = window.requestAnimationFrame(updateEndPadding);
    const updateTimeouts = [360, 560].map((delay) => window.setTimeout(updateEndPadding, delay));
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
  const cloneStopForGuideAddition = (
    stop: MapList["stops"][number],
    prefix: string,
    index: number,
  ): MapList["stops"][number] => ({
    id: `${prefix}-poi-${index}-${stop.id}`,
    name: stop.name,
    coordinates: stop.coordinates,
    description: stop.description,
    category: stop.category ?? list.category,
    price: stop.price,
    priceSource: stop.priceSource,
    bookingUrl: stop.bookingUrl,
    hours: stop.hours,
  });
  const buildNestedStopFromList = (): MapList["stops"][number] => {
    const idPrefix = `manual-stop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const firstStop = list.stops[0];

    return {
      id: idPrefix,
      name: list.title,
      coordinates: firstStop?.coordinates ?? ([0, 0] as [number, number]),
      description: list.description,
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
        return {
          id: idPrefix,
          name: stop.name,
          coordinates: stop.coordinates,
          description: stop.description,
          category: stop.category ?? list.category,
          price: stop.price,
          priceSource: stop.priceSource,
          bookingUrl: stop.bookingUrl,
          hours: stop.hours,
          places: stop.places?.map((place, index) => cloneStopForGuideAddition(place, idPrefix, index)),
        };
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
      } ${expanded ? "bg-slate-50" : ""} ${className}`}
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

  return (
    <article
      className={`group surface relative overflow-hidden transition-[background-color,border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        fillPane && expanded ? "flex h-full max-h-full min-h-0 flex-col !rounded-tr-lg !rounded-l-none !rounded-b-none !border-0 !shadow-none lg:!rounded-l-none lg:!rounded-r-lg" : ""
      } ${
        expandedChrome
          ? preservingListChrome
            ? "border border-slate-300 !bg-slate-50 p-3"
            : "border border-slate-300 !bg-slate-50 px-3 pb-3 pt-0"
          : "collapsed-guide-card p-3 hover:border-slate-950/30 focus-within:border-slate-950/30"
      }`}
      style={!expandedChrome ? ({ "--guide-accent": guideAccentColor, borderColor: guideAccentColor } as React.CSSProperties) : undefined}
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
      {!expandedChrome ? (
        <>
          <div
            className="pointer-events-none absolute left-0 top-3 z-20 h-[calc(100%-1.5rem)] w-1 origin-left rounded-r-full opacity-75 transition-[width,opacity] duration-300 group-hover:w-1.5 group-hover:opacity-100 group-focus-within:w-1.5 group-focus-within:opacity-100"
            style={{ backgroundColor: guideAccentColor }}
            aria-hidden="true"
          />
        </>
      ) : null}
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
            className={`guide-chrome-wipe pointer-events-none absolute -inset-x-3 -bottom-3 -top-3 z-0 ${
              retractingListChrome ? "guide-chrome-wipe--retract" : expandingListChrome ? "guide-chrome-wipe--expand" : ""
            }`}
            style={{ backgroundColor: guideExpandedColor }}
            onAnimationEnd={(event) => {
              if (event.animationName === "guide-chrome-wipe-expand") {
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
                <h3 className={`min-w-0 text-lg font-semibold leading-6 transition-colors ${expandedChrome ? "text-white" : "text-slate-900 group-hover:text-slate-950"} ${retractingListChrome ? "guide-chrome-title--retract" : ""} ${expandingListChrome ? "guide-chrome-title--expand" : ""}`}>{list.title}</h3>
                <span className={`mt-0.5 block truncate font-mono text-[10px] font-medium uppercase tracking-[0.1em] ${expandedChrome ? "text-white/75" : "text-slate-500"} ${retractingListChrome ? "guide-chrome-meta--retract" : ""} ${expandingListChrome ? "guide-chrome-meta--expand" : ""}`}>
                  {guideMeta}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onToggleExpand?.(list)}
                aria-expanded={expanded}
                aria-controls={`guide-panel-${list.id}`}
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                aria-label={`${expanded ? "Collapse" : "Expand"} ${list.title}`}
                title={`${expanded ? "Collapse" : "Expand"} ${list.title}`}
              >
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                    expanded
                      ? `rotate-180 text-white ${expandingListChrome ? "guide-chrome-chevron--expand" : ""}`
                      : expandedChrome
                        ? `text-white/80 ${retractingListChrome ? "guide-chrome-chevron--retract" : expandingListChrome ? "guide-chrome-chevron--expand" : ""}`
                        : "text-slate-400 group-hover:translate-y-0.5 group-hover:text-slate-900 group-focus-within:translate-y-0.5 group-focus-within:text-slate-900"
                  }`}
                />
              </button>
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
          {isOwnEditableGuide ? (
            onEditGuide ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onEditGuide(list);
                }}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900"
                aria-label="Edit guide"
                title="Edit guide"
              >
                Edit
              </button>
            ) : (
              <Link
                href={`/submit?edit=${encodeURIComponent(list.id)}&type=${list.submissionType ?? "guide"}`}
                onClick={(event) => event.stopPropagation()}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900"
                aria-label="Edit guide"
                title="Edit guide"
              >
                Edit
              </Link>
            )
          ) : null}
          {!isItineraryGuide ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openAddPickerForList();
              }}
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium ${
                isInItinerary ? "bg-emerald-600 text-white" : "border border-slate-200 bg-white text-slate-700"
              }`}
              aria-label="Add"
              title="Add"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          ) : null}
          {!isItineraryGuide ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                toggleUpvote(list.id);
              }}
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium ${hasVoted ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-700"}`}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              {formatNumber(visibleUpvotes)}
            </button>
          ) : null}
        </div>
      </div>
      {expandable && !expanded && sourceSummary ? (
        <div
          className="relative z-10 mt-2 flex w-full items-center gap-2 border-t border-slate-950/15 pt-2 pl-0.5 text-left"
          aria-label="Guide sources"
        >
          <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Sourced
          </span>
          <span className="h-px w-4 shrink-0 bg-slate-300/80" aria-hidden="true" />
          <span className="flex shrink-0 items-center gap-1">
            {sourceStripPreview.map((source, index) => (
              <span
                key={`${list.id}-source-strip-${source.name}-${index}`}
                className="inline-flex h-4 w-4 items-center justify-center overflow-hidden bg-white ring-1 ring-slate-200"
                title={source.name}
              >
                <img
                  src={getSourceIconUrl(source.url)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-3 w-3"
                />
              </span>
            ))}
          </span>
          <span className="min-w-0 flex-1 truncate text-[11px] font-medium leading-none text-slate-600">
            {sourceSummary}
          </span>
        </div>
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
            expanded ? "relative -mx-3 bg-slate-50 px-3" : ""
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
              <div className="guide-content-cascade-item relative z-10 flex items-center gap-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                  Description
                </p>
                {sourceSummary ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      openSourcesFromCard();
                    }}
                    className="ml-auto flex max-w-[52%] items-center justify-end gap-2 text-right transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                    aria-label="Show guide sources"
                    aria-expanded={sourcesOpen}
                  >
                    <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Sourced
                    </span>
                    <span className="flex shrink-0 items-center gap-1">
                      {sourceStripPreview.map((source, index) => (
                        <span
                          key={`${list.id}-expanded-source-top-${source.name}-${index}`}
                          className="inline-flex h-4 w-4 items-center justify-center overflow-hidden bg-white ring-1 ring-slate-200"
                          title={source.name}
                        >
                          <img
                            src={getSourceIconUrl(source.url)}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="h-3 w-3"
                          />
                        </span>
                      ))}
                    </span>
                    <span className="min-w-0 truncate text-[11px] font-medium leading-none text-slate-600">
                      {sourceSummary}
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${
                        sourcesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : null}
              </div>
              {list.itinerary?.startDate || list.itinerary?.endDate ? (
                <p
                  className="guide-content-cascade-item relative z-10 mt-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500"
                  style={{ animationDelay: "35ms" }}
                >
                  {[list.itinerary?.startDate, list.itinerary?.endDate].filter(Boolean).join(" to ")}
                </p>
              ) : null}
              <p
                className="guide-content-cascade-item expanded-guide-description relative z-10 mt-2 px-4"
                style={{ animationDelay: "45ms" }}
              >
                {list.description}
              </p>
              {list.highlights?.length ? (
                <div
                  className="guide-content-cascade-item relative z-10 mt-3 rounded-2xl border border-slate-200 bg-white px-3 py-3"
                  style={{ animationDelay: "55ms" }}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Highlights
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {list.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-2 text-sm leading-5 text-slate-600">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" aria-hidden="true" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {list.stops.length && !deferHeavyExpandedContent ? (
                <div
                  className="guide-content-cascade-item relative z-10 mt-3"
                  style={{ animationDelay: "65ms" }}
                  aria-label="POI photos"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                      {list.submissionType === "event" || list.id.startsWith("event-") ? "Schedule" : "Places of Interest"}
                    </p>
                    <div className="h-px flex-1 bg-slate-200" aria-hidden="true" />
                  </div>
                  <div className="ordered-poi-photo-strip">
                    {list.stops.map((stop, index) => {
                      const stopPhoto = getPoiPhoto(stop.photo);
                      const isStopSelected =
                        forceExpandStopId === stop.id ||
                        Boolean(stop.places?.some((place) => place.id === forceExpandStopId));
                      const stopCategory = isItineraryGuide ? inferJourneyStopCategory(stop, list.category) : stop.category ?? list.category;
                      const stopCategoryStyle = CATEGORY_STYLES[stopCategory];
                      return (
                        <button
                          key={`${list.id}-photo-nav-${stop.id}`}
                          type="button"
                          onClick={() => activateGuideStop(stop.id)}
                          onMouseEnter={() => onStopHoverChange?.(stop.id)}
                          onMouseLeave={() => onStopHoverChange?.(null)}
                          className={`ordered-poi-photo ${isStopSelected ? "ordered-poi-photo-active" : ""}`}
                          style={{ "--guide-accent": stopCategoryStyle.mapColor } as React.CSSProperties}
                          aria-label={`Open ${stop.name}`}
                          title={stop.name}
                        >
                          {stopPhoto ? (
                            <img
                              src={stopPhoto}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="ordered-poi-photo-fallback" aria-hidden="true">
                              {getAlphaMarker(index)}
                            </span>
                          )}
                          <span className="ordered-poi-photo-index">{index + 1}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              {list.stops.length && !deferHeavyExpandedContent ? (
                <>
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
                        const stopAttributeTags = getPoiAttributeTags(stop);
                        const stayBookingDetails = getStayBookingDetails(list, stop, stopCategory);
                        const officialStopUrl = list.id.startsWith("event-") ? stop.officialUrl ?? stop.bookingUrl : stop.officialUrl;
                        const isStopInItinerary =
                          itineraryStopIds.includes(stopItineraryId) ||
                          itineraryPlaylists.some((playlist) => playlist.stopKeys.includes(stopItineraryId));
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
                          style={{ animationDelay: `${120 + index * 45}ms` }}
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
                      <li
                        id={`guide-stop-item-${list.id}-${stop.id}`}
                        key={stop.id}
                        className="guide-content-cascade-item list-none"
                        style={{ animationDelay: `${140 + index * 45}ms` }}
                      >
                        {index === list.stops.length - 1 ? (
                          <span id={`guide-stop-top-${list.id}-${stop.id}`} className="block h-0" aria-hidden="true" />
                        ) : null}
                        <section
                          onMouseEnter={() => onStopHoverChange?.(stop.id)}
                          onMouseLeave={() => onStopHoverChange?.(null)}
                          data-active={isStopMapSelected}
                          data-expanded={isStopExpanded}
                          className="expanded-guide-stop-card transition-[border-color,box-shadow,background-color] duration-150"
                          style={{ "--guide-accent": stopCategoryStyle.mapColor } as React.CSSProperties}
                        >
                        <div
                          className="expanded-guide-stop-title-row flex w-full items-center gap-2 px-3 py-2.5 pl-4 text-left text-sm text-slate-700"
                        >
                          {showStopNumbers ? (
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                activateGuideStop(stop.id);
                              }}
                              onFocus={() => onStopHoverChange?.(stop.id)}
                              onBlur={() => onStopHoverChange?.(null)}
                              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-xs font-semibold text-white shadow-sm transition hover:brightness-95 focus-visible:ring-2 focus-visible:ring-slate-400/50"
                              style={{ backgroundColor: stopCategoryStyle.mapColor }}
                              aria-label={`Select ${stop.name} on map`}
                              title={`Select ${stop.name} on map`}
                            >
                              {index + 1}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                activateGuideStop(stop.id);
                              }}
                              onFocus={() => onStopHoverChange?.(stop.id)}
                              onBlur={() => onStopHoverChange?.(null)}
                              className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{ backgroundColor: stopCategoryStyle.mapColor }}
                              aria-label={`Select ${stop.name} on map`}
                              title={`Select ${stop.name} on map`}
                            />
                          )}
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => activateStopHeader(stop.id)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                activateGuideStop(stop.id);
                              }
                            }}
                            onFocus={() => onStopHoverChange?.(stop.id)}
                            onBlur={() => onStopHoverChange?.(null)}
                            className="flex min-w-0 flex-1 cursor-pointer select-text items-center gap-2 text-left"
                          >
                            <span className="min-w-0 flex-1">
                              <span className="block text-base font-semibold leading-5 text-slate-900">{stop.name}</span>
                              {stop.eventTime ? (
                                <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500">
                                  {stop.eventTime}
                                </span>
                              ) : null}
                            </span>
                            {stop.price ? (
                              <span
                                title={stop.priceSource ? `Price source: ${stop.priceSource}` : "Restaurant price tier"}
                                className="rounded-md bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-950/10"
                              >
                                {stop.price}
                              </span>
                            ) : null}
                            {stop.places?.length ? (
                              <span className="rounded-md bg-slate-950/[0.04] px-2 py-0.5 text-[10px] font-medium uppercase text-slate-600 ring-1 ring-slate-950/[0.04]">
                                {stop.places.length} places
                              </span>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleStopWithActivation(stop.id)}
                            onFocus={() => onStopHoverChange?.(stop.id)}
                            onBlur={() => onStopHoverChange?.(null)}
                            aria-expanded={isStopExpanded}
                            aria-controls={`guide-stop-panel-${list.id}-${stop.id}`}
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-950/[0.04] hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-slate-300"
                            aria-label={`${isStopExpanded ? "Collapse" : "Expand"} ${stop.name}`}
                            title={`${isStopExpanded ? "Collapse" : "Expand"} ${stop.name}`}
                          >
                            <ChevronDown
                              className={`h-4 w-4 shrink-0 transition-transform ${
                                isStopExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>
                        <div
                          id={`guide-stop-panel-${list.id}-${stop.id}`}
                          className={`guide-stop-panel grid transition-[grid-template-rows,opacity] duration-150 ease-out ${
                            isStopExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="expanded-guide-stop-body border-t border-slate-950/10 px-4 py-3">
                              <div className={`expanded-poi-bio ${stopPhoto ? "" : "expanded-poi-bio-no-photo"}`}>
                                {stopPhoto ? (
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      openPhotoPreview({ src: stopPhoto, title: stop.name });
                                    }}
                                    className="expanded-poi-bio-photo"
                                    aria-label={`Open photo of ${stop.name}`}
                                    title={`Open photo of ${stop.name}`}
                                  >
                                    <img
                                      src={stopPhoto}
                                      alt=""
                                      loading="lazy"
                                      decoding="async"
                                      className="h-full w-full object-cover"
                                    />
                                  </button>
                                ) : null}
                                <div className="expanded-poi-copy min-w-0">
                                  <p>{stopContent.summary}</p>
                                  {stopAttributeTags.length ? (
                                    <div className="expanded-poi-tags" aria-label={`${stop.name} attributes`}>
                                      {stopAttributeTags.map((tag) => (
                                        <span key={`${stop.id}-tag-${tag}`}>{tag}</span>
                                      ))}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                              {stop.places?.length ? (
                                <div className="mt-3">
                                  <div className="mb-2 flex items-center gap-2">
                                    <p className="font-mono text-[10px] font-semibold uppercase text-slate-500">POI</p>
                                    <div className="h-px flex-1 bg-slate-950/10" />
                                  </div>
                                  <div className="space-y-2">
                                  {stop.places.map((place, placeIndex) => (
                                    (() => {
                                      const placePhoto = getPoiPhoto(place.photo);
                                      const placeAttributeTags = getPoiAttributeTags(place);
                                      const isPlaceExpanded = expandedPlaceIds.includes(place.id);
                                      const isPlaceMapSelected = forceExpandStopId === place.id;
                                      const placeCategoryStyle = CATEGORY_STYLES[place.category ?? stopCategory];
                                      return (
                                    <div
                                      key={place.id}
                                      onMouseEnter={() => onStopHoverChange?.(place.id)}
                                      onMouseLeave={() => onStopHoverChange?.(null)}
                                      data-active={isPlaceMapSelected}
                                      data-expanded={isPlaceExpanded}
                                      className="expanded-guide-place-card flex items-start gap-2 px-3 py-2 pl-3.5 transition-[border-color,background-color] duration-150"
                                      style={{ "--guide-poi-accent": placeCategoryStyle.poiColor } as React.CSSProperties}
                                    >
                                      <button
                                        type="button"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          activateNestedGuideStop(place.id, stop.id);
                                        }}
                                        onFocus={() => onStopHoverChange?.(place.id)}
                                        onBlur={() => onStopHoverChange?.(null)}
                                        className="mt-0.5 inline-flex h-5 w-5 shrink-0 rotate-45 items-center justify-center rounded-[5px] font-mono text-[10px] font-semibold text-white shadow-sm"
                                        style={{ backgroundColor: placeCategoryStyle.poiColor }}
                                        aria-label={`Select ${place.name} on map`}
                                        title={`Select ${place.name} on map`}
                                      >
                                        <span className="-rotate-45">{getAlphaMarker(placeIndex)}</span>
                                      </button>
                                      <div className="min-w-0 flex-1 pt-0.5">
                                        <div className="flex min-h-5 w-full items-center gap-2 text-left">
                                          <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => activatePlaceHeader(place.id)}
                                            onKeyDown={(event) => {
                                              if (event.key === "Enter" || event.key === " ") {
                                                event.preventDefault();
                                                togglePlace(place.id);
                                              }
                                            }}
                                            className="min-w-0 flex-1 cursor-pointer select-text"
                                            aria-expanded={isPlaceExpanded}
                                          >
                                          <span className="min-w-0 flex-1 text-[0.95rem] font-semibold leading-5 text-slate-900">{place.name}</span>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => togglePlace(place.id)}
                                            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                                            aria-expanded={isPlaceExpanded}
                                            aria-label={`${isPlaceExpanded ? "Collapse" : "Expand"} ${place.name}`}
                                            title={`${isPlaceExpanded ? "Collapse" : "Expand"} ${place.name}`}
                                          >
                                          <ChevronDown
                                            className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${
                                              isPlaceExpanded ? "rotate-180" : ""
                                            }`}
                                          />
                                          </button>
                                        </div>
                                        <div
                                          className={`guide-stop-panel grid transition-[grid-template-rows,opacity,margin] duration-150 ease-out ${
                                            isPlaceExpanded
                                              ? "mt-1 grid-rows-[1fr] opacity-100"
                                              : "mt-0 grid-rows-[0fr] opacity-0"
                                          }`}
                                        >
                                          <div className="overflow-hidden">
                                            <div
                                              className={`expanded-poi-bio expanded-poi-bio-place pb-1 ${
                                                placePhoto ? "" : "expanded-poi-bio-no-photo"
                                              }`}
                                            >
                                              {placePhoto ? (
                                                <button
                                                  type="button"
                                                  onClick={(event) => {
                                                    event.stopPropagation();
                                                    openPhotoPreview({ src: placePhoto, title: place.name });
                                                  }}
                                                  className="expanded-poi-bio-photo expanded-poi-bio-photo-place"
                                                  aria-label={`Open photo of ${place.name}`}
                                                  title={`Open photo of ${place.name}`}
                                                >
                                                  <img
                                                    src={placePhoto}
                                                    alt=""
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="h-full w-full object-cover"
                                                  />
                                                </button>
                                              ) : null}
                                              <div className="expanded-poi-copy expanded-poi-copy-place min-w-0">
                                                <p>{place.description}</p>
                                                {placeAttributeTags.length ? (
                                                  <div className="expanded-poi-tags" aria-label={`${place.name} attributes`}>
                                                    {placeAttributeTags.map((tag) => (
                                                      <span key={`${place.id}-tag-${tag}`}>{tag}</span>
                                                    ))}
                                                  </div>
                                                ) : null}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                      );
                                    })()
                                  ))}
                                  </div>
                                </div>
                              ) : null}
                              <div className="expanded-guide-stop-actions poi-footer-row mt-3 flex items-center justify-between gap-3 border-t border-slate-950/10 bg-white/80 py-2">
                                <div className="min-w-0">
                                  {resolvedStopHours ? (
                                    <p className="text-xs leading-4 text-slate-500">
                                      <span className="font-medium text-slate-600">
                                        {isHistoricalGuide ? "Date:" : `Hours (${weekdayLabel}):`}
                                      </span>{" "}
                                      <span>{resolvedStopHours}</span>
                                    </p>
                                  ) : null}
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                  {stop.eventVenue ? (
                                    <span className="max-w-[11rem] truncate rounded-md border border-slate-950/10 bg-white/80 px-2 py-1.5 text-[11px] font-medium text-slate-600">
                                      {stop.eventVenue}
                                    </span>
                                  ) : null}
                                  {!isItineraryGuide ? (
                                    <button
                                      type="button"
                                      onClick={() => openAddPickerForStop(stopItineraryId)}
                                      className={`inline-flex h-7 w-7 items-center justify-center rounded-md border text-[11px] font-medium transition ${
                                        isStopInItinerary
                                          ? "border-emerald-600 bg-emerald-600 text-white"
                                          : "border-slate-950/10 bg-white/80 text-slate-700 hover:border-slate-950/20 hover:text-slate-900"
                                      }`}
                                      aria-label="Add"
                                      title="Add"
                                    >
                                      <Plus className="h-3.5 w-3.5" />
                                    </button>
                                  ) : null}
                                  {officialStopUrl ? (
                                    <Link
                                      href={officialStopUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      onClick={(event) => event.stopPropagation()}
                                      className="inline-flex items-center gap-1.5 rounded-md border border-slate-950/10 bg-white/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-950/20 hover:text-slate-900"
                                      aria-label={`Official site for ${stop.name}`}
                                      title={`Official site for ${stop.name}`}
                                    >
                                      <ExternalLink className="h-3.5 w-3.5" />
                                      <span>Official</span>
                                    </Link>
                                  ) : null}
                                  <div className="relative">
                                    {stop.places?.length ? (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setDirectionsPickerStopId((current) =>
                                            current === stop.id ? null : stop.id,
                                          )
                                        }
                                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-950/10 bg-white/80 text-[11px] font-medium text-slate-700 hover:border-slate-950/20 hover:text-slate-900"
                                        aria-label="Directions"
                                        title="Directions"
                                      >
                                        <Navigation className="h-3.5 w-3.5" />
                                      </button>
                                    ) : (
                                      <Link
                                        href={getDirectionsHref(stop)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-950/10 bg-white/80 text-[11px] font-medium text-slate-700 hover:border-slate-950/20 hover:text-slate-900"
                                        aria-label="Directions"
                                        title="Directions"
                                      >
                                        <Navigation className="h-3.5 w-3.5" />
                                      </Link>
                                    )}
                                    {directionsPickerStopId === stop.id ? (
                                      <div className="absolute bottom-full right-0 z-30 mb-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 text-left shadow-xl">
                                        <Link
                                          href={getDirectionsHref(stop)}
                                          target="_blank"
                                          rel="noreferrer"
                                          onClick={closeDirectionsPicker}
                                          className="block px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                                        >
                                          {stop.name}
                                        </Link>
                                        {(stop.places ?? []).map((place) => (
                                          <Link
                                            key={place.id}
                                            href={getDirectionsHref(place)}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={closeDirectionsPicker}
                                            className="block border-t border-slate-100 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                          >
                                            {place.name}
                                          </Link>
                                        ))}
                                      </div>
                                    ) : null}
                                  </div>
                                  {stayBookingDetails ? (
                                    <Link
                                      href={stayBookingDetails.href}
                                      target="_blank"
                                      rel="noreferrer"
                                      onClick={(event) => event.stopPropagation()}
                                      className="inline-flex items-center gap-1.5 rounded-md border border-cyan-800 bg-cyan-800 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:border-cyan-900 hover:bg-cyan-900"
                                      aria-label={`Book ${stop.name} on ${stayBookingDetails.platformLabel}`}
                                      title={`Book ${stop.name} on ${stayBookingDetails.platformLabel}`}
                                    >
                                      <CalendarCheck className="h-3.5 w-3.5" />
                                      <span>Book</span>
                                    </Link>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        </section>
                      </li>
                      </Fragment>
                        );
                      })()
                    ))}
                  </ol>
                </>
              ) : null}
              {fillPane ? renderExpandedFooter("lg:hidden") : null}
            </div>
          </div>
        </div>
      ) : null}

      {renderExpandedFooter(fillPane ? "hidden lg:block" : "")}
      <div
        className={`absolute inset-0 z-30 flex flex-col bg-white/95 p-3 backdrop-blur-sm transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          sourcesOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        style={{
          transform: sourcesOpen ? "translateY(0%)" : "translateY(100%)",
        }}
      >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setSourcesPinnedOpen(false);
            }}
            className="mb-2 flex w-full items-center justify-between border-b border-slate-200 pb-2 text-left"
            aria-label="Collapse sources"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Sources
            </p>
            <span className="rounded-full p-1 text-slate-500 transition hover:bg-stone-100 hover:text-slate-700">
              <ChevronDown className="h-4 w-4 rotate-180" />
            </span>
          </button>
          <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
            {allSources.map((source) => (
              <Link
                key={`${list.id}-source-${source.name}`}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs text-slate-700 hover:bg-stone-100 hover:text-slate-900"
              >
                <img
                  src={getSourceIconUrl(source.url)}
                  alt={source.name}
                  loading="lazy"
                  decoding="async"
                  className="h-4 w-4 rounded-full"
                />
                <span className="min-w-0 flex-1 truncate">{source.name}</span>
              </Link>
            ))}
          </div>
        </div>
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
    </article>
  );
}
