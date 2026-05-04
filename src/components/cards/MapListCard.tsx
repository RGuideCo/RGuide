"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { ChevronDown, Navigation, Plus, ThumbsUp, X } from "lucide-react";

import { getCreatorHref, getListHref } from "@/lib/routes";
import { resolveStopHours } from "@/lib/seasonal-hours";
import { formatNumber } from "@/lib/utils";
import { CATEGORY_STYLES } from "@/lib/constants";
import { useAppStore } from "@/store/app-store";
import { MapList } from "@/types";

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
  expandable?: boolean;
  fillPane?: boolean;
  onToggleExpand?: (list: MapList) => void;
  shouldAutoOpenSources?: boolean;
  onAutoOpenSourcesHandled?: (listId: string) => void;
  onRequestOpenSourcesWhenCollapsed?: (list: MapList) => void;
  onEditItinerary?: (list: MapList) => void;
  onEditGuide?: (list: MapList) => void;
  onExpandedStopIdsChange?: (stopIds: string[]) => void;
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
  const hasGeneratedItineraryStops = list.stops.some((stop) => stop.id.startsWith("itinerary-stop-"));
  const hasItineraryTitle = /\bitinerary\b/i.test(list.title);
  const hasCompiledItineraryDescription = /^compiled itinerary with \d+ saved locations\.?$/i.test(
    list.description.trim(),
  );
  return hasGeneratedItineraryStops || (hasItineraryTitle && hasCompiledItineraryDescription);
}

function buildLocationSubtitle(list: MapList) {
  return [
    list.location.neighborhood,
    list.location.city,
    list.location.country,
    list.location.continent,
  ]
    .filter((part): part is string => Boolean(part?.trim()))
    .filter((part, index, all) => all.findIndex((item) => item.toLowerCase() === part.toLowerCase()) === index)
    .join(" • ");
}

type GuideSource = NonNullable<MapList["sources"]>[number];

function buildGuideMeta(list: MapList) {
  const placeCount = list.stops.length;
  const placeLabel = `${placeCount} ${placeCount === 1 ? "place" : "places"}`;
  return `${list.category} • ${placeLabel}`;
}

const SAMPLE_POI_PHOTOS = [
  "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
];

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

function getSamplePoiPhoto(index: number) {
  return SAMPLE_POI_PHOTOS[index % SAMPLE_POI_PHOTOS.length];
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
  expandable = false,
  fillPane = false,
  onToggleExpand,
  shouldAutoOpenSources = false,
  onAutoOpenSourcesHandled,
  onRequestOpenSourcesWhenCollapsed,
  onEditItinerary,
  onEditGuide,
  onExpandedStopIdsChange,
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
  const canEditOwnItinerary = isOwnGuide && isItineraryGuide && Boolean(onEditItinerary);
  const categoryStyle = CATEGORY_STYLES[list.category];
  const locationSubtitle = buildLocationSubtitle(list);
  const guideMeta = buildGuideMeta(list);
  const visibleUpvotes = list.upvotes + (hasVoted ? 1 : 0);
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
  const showStopNumbers = true;
  const isRGuide = list.creator.name.startsWith("R ");
  const allSources = isRGuide ? list.sources ?? [] : [];
  const sourcePreview = allSources.slice(0, 5);
  const sourceStripPreview = allSources.slice(0, 3);
  const sourceSummary = allSources.length ? buildSourceSummary(allSources) : null;
  const [sourcesPinnedOpen, setSourcesPinnedOpen] = useState(false);
  const sourcesOpen = Boolean(allSources.length) && sourcesPinnedOpen;

  const togglePlace = (placeId: string) => {
    setExpandedPlaceIds((current) =>
      current.includes(placeId) ? current.filter((id) => id !== placeId) : [...current, placeId],
    );
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
      const listElement = document.getElementById(`guide-stop-list-${list.id}`);

      if (!stopElement || !listElement) {
        return;
      }

      const stopRect = stopElement.getBoundingClientRect();
      const listRect = listElement.getBoundingClientRect();
      const targetTop = listElement.scrollTop + stopRect.top - listRect.top;

      listElement.scrollTo({
        top: targetTop,
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

  useEffect(() => {
    if (!expanded || !fillPane || !list.stops.length) {
      setStopListEndPadding(0);
      setStopListMaxScrollTop(null);
      return;
    }

    const updateEndPadding = () => {
      const listElement = document.getElementById(`guide-stop-list-${list.id}`);
      const lastStop = list.stops[list.stops.length - 1];
      const lastStopSentinel = lastStop
        ? document.getElementById(`guide-stop-top-${list.id}-${lastStop.id}`)
        : null;

      if (!listElement || !lastStopSentinel) {
        setStopListEndPadding(0);
        setStopListMaxScrollTop(null);
        return;
      }

      const listRect = listElement.getBoundingClientRect();
      const sentinelRect = lastStopSentinel.getBoundingClientRect();
      const previousPadding = Number.parseFloat(window.getComputedStyle(listElement).paddingBottom) || 0;
      const sentinelTop = listElement.scrollTop + sentinelRect.top - listRect.top;
      const naturalScrollHeight = listElement.scrollHeight - previousPadding;
      const nextPadding = Math.max(0, Math.ceil(sentinelTop + listElement.clientHeight - naturalScrollHeight));

      setStopListEndPadding(nextPadding);
      setStopListMaxScrollTop(Math.max(0, Math.ceil(sentinelTop)));
    };

    const scheduleUpdate = () => {
      requestAnimationFrame(updateEndPadding);
    };

    scheduleUpdate();
    const updateTimeouts = [180, 360].map((delay) => window.setTimeout(updateEndPadding, delay));
    window.addEventListener("resize", updateEndPadding);
    return () => {
      updateTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      window.removeEventListener("resize", updateEndPadding);
    };
  }, [expanded, expandedStopIds, fillPane, list.id, list.stops]);

  useEffect(() => {
    if (!expanded || !pendingScrollStopId || !expandedStopIds.includes(pendingScrollStopId)) {
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
  }, [expanded, expandedStopIds, pendingScrollStopId]);

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
    price: stop.price,
    priceSource: stop.priceSource,
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
          price: stop.price,
          priceSource: stop.priceSource,
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

  return (
    <article
      className={`group surface relative overflow-hidden transition-[background-color,border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        fillPane && expanded ? "flex h-full max-h-full min-h-0 flex-col !rounded-tr-lg !rounded-l-none !rounded-b-none !border-0 !shadow-none lg:!rounded-l-none lg:!rounded-r-lg" : ""
      } ${
        expanded
          ? "border border-slate-300 !bg-slate-50 px-3 pb-3 pt-0"
          : "collapsed-guide-card p-3 hover:border-slate-950/30 hover:shadow-[0_18px_34px_rgba(23,23,23,0.13)] focus-within:border-slate-950/30 focus-within:shadow-[0_18px_34px_rgba(23,23,23,0.13)]"
      }`}
      style={!expanded ? ({ "--guide-accent": categoryStyle.mapColor, borderColor: categoryStyle.mapColor } as React.CSSProperties) : undefined}
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
      {!expanded ? (
        <>
          <div
            className="pointer-events-none absolute left-0 top-3 z-20 h-[calc(100%-1.5rem)] w-1 origin-left rounded-r-full opacity-75 transition-[width,opacity] duration-300 group-hover:w-1.5 group-hover:opacity-100 group-focus-within:w-1.5 group-focus-within:opacity-100"
            style={{ backgroundColor: categoryStyle.mapColor }}
            aria-hidden="true"
          />
          <span className="pointer-events-none absolute bottom-2 right-3 z-20 translate-y-1 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            Open
          </span>
        </>
      ) : null}
      <div
        className={`relative z-10 flex items-center justify-between gap-3 overflow-hidden ${
          expanded
            ? `sticky top-0 z-10 -mx-3 min-h-14 border-b px-3 py-2 text-white backdrop-blur ${
                fillPane ? "" : "-mt-3"
              }`
            : ""
        }`}
        style={
          expanded
            ? {
                backgroundColor: categoryStyle.mapColor,
                borderColor: categoryStyle.mapColor,
              }
            : undefined
        }
      >
        <div className="relative z-10 min-w-0 flex-1">
          {expandable ? (
            <button
              type="button"
              onClick={() => onToggleExpand?.(list)}
              aria-expanded={expanded}
              aria-controls={`guide-panel-${list.id}`}
              className="flex w-full items-center justify-between gap-2 text-left"
            >
              <span className="min-w-0 flex-1">
                <h3 className={`min-w-0 text-base font-semibold leading-5 transition-colors ${expanded ? "text-white" : "text-slate-900 group-hover:text-slate-950"}`}>{list.title}</h3>
                <span className={`mt-0.5 block truncate font-mono text-[10px] font-medium uppercase tracking-[0.1em] ${expanded ? "text-white/75" : "text-slate-500"}`}>
                  {guideMeta}
                </span>
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform duration-300 ${expanded ? "rotate-180 text-white" : "text-slate-400 group-hover:translate-y-0.5 group-hover:text-slate-900 group-focus-within:translate-y-0.5 group-focus-within:text-slate-900"}`}
              />
            </button>
          ) : (
            <>
              <h3 className="min-w-0 text-base font-semibold leading-5 text-slate-900">
                <Link href={getListHref(list)}>{list.title}</Link>
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
                href={`/submit?edit=${encodeURIComponent(list.id)}&type=${list.submissionType === "journal" ? "journal" : "guide"}`}
                onClick={(event) => event.stopPropagation()}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900"
                aria-label="Edit guide"
                title="Edit guide"
              >
                Edit
              </Link>
            )
          ) : null}
          {canEditOwnItinerary ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onEditItinerary?.(list);
              }}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900"
              aria-label="Edit itinerary"
              title="Edit itinerary"
            >
              Edit itinerary
            </button>
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
      {!expandable ? (
        <div className="mt-3">
          <p className="te-kicker text-[11px] font-medium text-slate-500">Description</p>
          <p className="mt-2 px-3 text-sm leading-5 text-slate-600">{list.description}</p>
        </div>
      ) : null}

      {expandable && !expanded ? (
        <p className="mt-0 max-h-0 overflow-hidden px-3 text-xs leading-5 text-slate-500 opacity-0 transition-[max-height,margin,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:mt-2 group-hover:max-h-10 group-hover:opacity-100 group-focus-within:mt-2 group-focus-within:max-h-10 group-focus-within:opacity-100">
          {list.description}
        </p>
      ) : null}

      {expandable ? (
        <div
          id={`guide-panel-${list.id}`}
          className={`grid transition-[grid-template-rows,opacity,margin,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            expanded ? "mt-2 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
          } ${fillPane && expanded ? "min-h-0 flex-1 basis-0" : ""} ${
            expanded ? "relative -mx-3 bg-slate-50 px-3" : ""
          }`}
        >
          <div
            key={`${list.id}-${expanded ? "expanded" : "collapsed"}`}
            className={`${fillPane && expanded ? "flex min-h-0 flex-1 flex-col overflow-hidden pb-3" : "overflow-hidden"}`}
          >
            <div className={`${fillPane && expanded ? "flex min-h-0 flex-1 flex-col" : ""} relative pt-2`}>
              <p className="guide-content-cascade-item relative z-10 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                Description
              </p>
              <p
                className="guide-content-cascade-item relative z-10 mt-2 px-3 text-sm leading-5 text-slate-600"
                style={{ animationDelay: "45ms" }}
              >
                {list.description}
              </p>
              {list.stops.length ? (
                <div
                  className="guide-content-cascade-item relative z-10 mt-3"
                  style={{ animationDelay: "65ms" }}
                  aria-label="POI photos"
                >
                  <div className="ordered-poi-photo-strip">
                    {list.stops.map((stop, index) => {
                      const stopPhoto = stop.photo ?? getSamplePoiPhoto(index);
                      const isStopExpanded = expandedStopIds.includes(stop.id);
                      return (
                        <button
                          key={`${list.id}-photo-nav-${stop.id}`}
                          type="button"
                          onClick={() => activateGuideStop(stop.id)}
                          onMouseEnter={() => onStopHoverChange?.(stop.id)}
                          onMouseLeave={() => onStopHoverChange?.(null)}
                          className={`ordered-poi-photo ${isStopExpanded ? "ordered-poi-photo-active" : ""}`}
                          style={{ "--guide-accent": categoryStyle.mapColor } as React.CSSProperties}
                          aria-label={`Open ${stop.name}`}
                          title={stop.name}
                        >
                          <img src={stopPhoto} alt="" className="h-full w-full object-cover" />
                          <span className="ordered-poi-photo-index">{index + 1}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              {sourceSummary ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    openSourcesFromCard();
                  }}
                  className="guide-content-cascade-item relative z-10 mt-3 flex w-full items-center gap-2 border-t border-slate-200/80 pt-2 pl-0.5 text-left transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                  style={{ animationDelay: "70ms" }}
                  aria-label="Show guide sources"
                  aria-expanded={sourcesOpen}
                >
                  <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Sourced
                  </span>
                  <span className="h-px w-4 shrink-0 bg-slate-300/80" aria-hidden="true" />
                  <span className="flex shrink-0 items-center gap-1">
                    {sourceStripPreview.map((source, index) => (
                      <span
                        key={`${list.id}-expanded-source-strip-${source.name}-${index}`}
                        className="inline-flex h-4 w-4 items-center justify-center overflow-hidden bg-white ring-1 ring-slate-200"
                        title={source.name}
                      >
                        <img
                          src={getSourceIconUrl(source.url)}
                          alt=""
                          className="h-3 w-3"
                        />
                      </span>
                    ))}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[11px] font-medium leading-none text-slate-600">
                    {sourceSummary}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${
                      sourcesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : null}
              {list.stops.length ? (
                <>
                  <p
                    className="guide-content-cascade-item relative z-10 mt-4 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500"
                    style={{ animationDelay: sourceSummary ? "115ms" : "90ms" }}
                  >
                    Places of Interest
                  </p>
                  <ol
                    id={`guide-stop-list-${list.id}`}
                    onScroll={(event) => {
                      if (stopListMaxScrollTop === null) {
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
                        ? "guide-stop-list min-h-0 flex-1 touch-pan-y auto-rows-max overflow-y-auto overscroll-contain pr-1"
                        : ""
                    }`}
                  >
                    {list.stops.map((stop, index) => (
                      (() => {
                        const stopContent = splitStopDescriptionAndHours(stop.description);
                        const resolvedStopHours = resolveStopHours(stop) ?? stopContent.hours;
                        const stopItineraryId = `${list.id}:${stop.id}`;
                        const stopPhoto = stop.photo ?? getSamplePoiPhoto(index);
                        const isStopInItinerary =
                          itineraryStopIds.includes(stopItineraryId) ||
                          itineraryPlaylists.some((playlist) => playlist.stopKeys.includes(stopItineraryId));
                        const isStopExpanded = expandedStopIds.includes(stop.id);
                        const isStopMapSelected = forceExpandStopId === stop.id;
                        return (
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
                          style={{ "--guide-accent": categoryStyle.mapColor } as React.CSSProperties}
                        >
                        <div
                          className="flex w-full items-center gap-2 px-3 py-2.5 pl-4 text-left text-sm text-slate-700"
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
                              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-[10px] font-semibold text-white shadow-sm transition hover:brightness-95 focus-visible:ring-2 focus-visible:ring-slate-400/50"
                              style={{ backgroundColor: categoryStyle.mapColor }}
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
                              style={{ backgroundColor: categoryStyle.mapColor }}
                              aria-label={`Select ${stop.name} on map`}
                              title={`Select ${stop.name} on map`}
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => toggleStopWithActivation(stop.id)}
                            onFocus={() => onStopHoverChange?.(stop.id)}
                            onBlur={() => onStopHoverChange?.(null)}
                            aria-expanded={isStopExpanded}
                            aria-controls={`guide-stop-panel-${list.id}-${stop.id}`}
                            className="flex min-w-0 flex-1 items-center gap-2 text-left"
                          >
                            <span className="min-w-0 flex-1 text-[13px] font-semibold text-slate-900">{stop.name}</span>
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
                            <ChevronDown
                              className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                                isStopExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>
                        <div
                          id={`guide-stop-panel-${list.id}-${stop.id}`}
                          className={`grid transition-[grid-template-rows,opacity] duration-150 ease-out ${
                            isStopExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="border-t border-slate-950/10 px-4 py-3">
                              <div className="expanded-poi-bio">
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
                                  <img src={stopPhoto} alt="" className="h-full w-full object-cover" />
                                </button>
                                <p className="min-w-0 text-sm leading-5 text-slate-600">{stopContent.summary}</p>
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
                                      const placePhoto = place.photo ?? getSamplePoiPhoto(index + placeIndex + 1);
                                      const isPlaceExpanded = expandedPlaceIds.includes(place.id);
                                      const isPlaceMapSelected = forceExpandStopId === place.id;
                                      return (
                                    <div
                                      key={place.id}
                                      onMouseEnter={() => onStopHoverChange?.(place.id)}
                                      onMouseLeave={() => onStopHoverChange?.(null)}
                                      data-active={isPlaceMapSelected}
                                      data-expanded={isPlaceExpanded}
                                      className="expanded-guide-place-card flex items-start gap-2 px-3 py-2 pl-3.5 transition-[border-color,background-color] duration-150"
                                      style={{ "--guide-poi-accent": categoryStyle.poiColor } as React.CSSProperties}
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
                                        style={{ backgroundColor: categoryStyle.poiColor }}
                                        aria-label={`Select ${place.name} on map`}
                                        title={`Select ${place.name} on map`}
                                      >
                                        <span className="-rotate-45">{getAlphaMarker(placeIndex)}</span>
                                      </button>
                                      <div className="min-w-0 flex-1 pt-0.5">
                                        <button
                                          type="button"
                                          onClick={() => togglePlace(place.id)}
                                          className="flex min-h-5 w-full items-center gap-2 text-left"
                                          aria-expanded={isPlaceExpanded}
                                        >
                                          <span className="min-w-0 flex-1 text-xs font-semibold text-slate-900">{place.name}</span>
                                          <ChevronDown
                                            className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${
                                              isPlaceExpanded ? "rotate-180" : ""
                                            }`}
                                          />
                                        </button>
                                        <div
                                          className={`grid transition-[grid-template-rows,opacity,margin] duration-150 ease-out ${
                                            isPlaceExpanded
                                              ? "mt-1 grid-rows-[1fr] opacity-100"
                                              : "mt-0 grid-rows-[0fr] opacity-0"
                                          }`}
                                        >
                                          <div className="overflow-hidden">
                                            <div className="expanded-poi-bio expanded-poi-bio-place pb-1">
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
                                                <img src={placePhoto} alt="" className="h-full w-full object-cover" />
                                              </button>
                                              <p className="min-w-0 text-xs leading-4 text-slate-600">{place.description}</p>
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
                              <div className="mt-3 flex items-end justify-between gap-3">
                                <div className="min-w-0">
                                  {resolvedStopHours ? (
                                    <p className="text-[11px] leading-4 text-slate-500">
                                      <span className="font-medium text-slate-600">{`Hours (${weekdayLabel}):`}</span>{" "}
                                      <span>{resolvedStopHours}</span>
                                    </p>
                                  ) : null}
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                  {!isItineraryGuide ? (
                                    <button
                                      type="button"
                                      onClick={() => openAddPickerForStop(stopItineraryId)}
                                      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition ${
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
                                  <div className="relative">
                                    {stop.places?.length ? (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setDirectionsPickerStopId((current) =>
                                            current === stop.id ? null : stop.id,
                                          )
                                        }
                                        className="inline-flex items-center rounded-md border border-slate-950/10 bg-white/80 px-2 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-950/20 hover:text-slate-900"
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
                                        className="inline-flex items-center rounded-md border border-slate-950/10 bg-white/80 px-2 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-950/20 hover:text-slate-900"
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
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        </section>
                      </li>
                        );
                      })()
                    ))}
                  </ol>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div
        className={`mt-0 max-h-0 overflow-hidden opacity-0 translate-y-1 pointer-events-none transition-[max-height,opacity,transform,margin-top] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          expanded
            ? "mt-2.5 max-h-none overflow-visible opacity-100 translate-y-0 pointer-events-auto"
            : ""
        } ${expanded ? "bg-slate-50" : ""}`}
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
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Add to itinerary</p>
                    <p className="mt-1 text-sm text-slate-700">Choose an itinerary or create a new one.</p>
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
                        placeholder="New itinerary name"
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
                        Add to itinerary
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
