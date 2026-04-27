"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { ChevronDown, Navigation, Plus, ThumbsUp } from "lucide-react";

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

function getAlphaMarker(index: number) {
  return String.fromCharCode(65 + (index % 26));
}

export function MapListCard({
  list,
  onHoverStart,
  onHoverEnd,
  onStopHoverChange,
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
  const [mounted, setMounted] = useState(false);
  const showStopNumbers = true;
  const isRGuide = list.creator.name.startsWith("R ");
  const allSources = isRGuide ? list.sources ?? [] : [];
  const sourcePreview = allSources.slice(0, 5);
  const [sourcesPinnedOpen, setSourcesPinnedOpen] = useState(false);
  const sourcesOpen = Boolean(allSources.length) && sourcesPinnedOpen;

  const toggleStop = (stopId: string) => {
    setExpandedStopIds((current) =>
      current.includes(stopId) ? current.filter((id) => id !== stopId) : [...current, stopId],
    );
  };
  const togglePlace = (placeId: string) => {
    setExpandedPlaceIds((current) =>
      current.includes(placeId) ? current.filter((id) => id !== placeId) : [...current, placeId],
    );
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

  const getSourceIconUrl = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;
    } catch {
      return "";
    }
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
      className={`group surface relative overflow-hidden transition-[background-color,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        fillPane && expanded ? "flex h-full max-h-full min-h-0 flex-col !rounded-l-none !border-0 !shadow-none" : ""
      } ${expanded ? "border border-slate-300 !bg-slate-50 px-3 pb-3 pt-0" : "p-3"}`}
      style={!expanded ? { borderColor: categoryStyle.mapColor } : undefined}
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
      <div
        className={`flex items-center justify-between gap-3 ${expanded ? "sticky top-0 z-10 -mx-3 -mt-3 min-h-14 border-b px-3 py-2 text-white backdrop-blur" : ""}`}
        style={
          expanded
            ? {
                backgroundColor: categoryStyle.mapColor,
                borderColor: categoryStyle.mapColor,
              }
            : undefined
        }
      >
        <div className="min-w-0 flex-1">
          {expandable ? (
            <button
              type="button"
              onClick={() => onToggleExpand?.(list)}
              aria-expanded={expanded}
              aria-controls={`guide-panel-${list.id}`}
              className="flex w-full items-center justify-between gap-2 text-left"
            >
              <span className="min-w-0 flex-1">
                <h3 className={`min-w-0 text-base font-semibold leading-5 ${expanded ? "text-white" : "text-slate-900"}`}>{list.title}</h3>
                {locationSubtitle ? (
                  <span className={`mt-0.5 block truncate text-xs font-medium ${expanded ? "text-white/75" : "text-slate-500"}`}>
                    {locationSubtitle}
                  </span>
                ) : null}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform ${expanded ? "rotate-180 text-white" : "text-slate-400"}`}
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
        <div className="flex shrink-0 items-center gap-1.5">
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
      {!expandable ? (
        <div className="mt-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">Description</p>
          <p className="mt-2 px-3 text-sm leading-5 text-slate-600">{list.description}</p>
        </div>
      ) : null}

      {expandable ? (
        <div
          id={`guide-panel-${list.id}`}
          className={`grid transition-[grid-template-rows,opacity,margin,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            expanded ? "mt-2 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
          } ${fillPane && expanded ? "min-h-0 flex-1 basis-0" : ""} ${
            expanded ? "bg-slate-50" : ""
          }`}
        >
          <div
            key={`${list.id}-${expanded ? "expanded" : "collapsed"}`}
            className={`${fillPane && expanded ? "min-h-0 touch-pan-y overflow-y-auto overscroll-contain pr-1 pb-3" : "overflow-hidden"}`}
          >
            <div className="pt-4">
              <p className="guide-content-cascade-item text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                Description
              </p>
              <p
                className="guide-content-cascade-item mt-2 px-3 text-sm leading-5 text-slate-600"
                style={{ animationDelay: "45ms" }}
              >
                {list.description}
              </p>
              {list.stops.length ? (
                <>
                  <p
                    className="guide-content-cascade-item mt-4 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500"
                    style={{ animationDelay: "90ms" }}
                  >
                    Places of Interest
                  </p>
                  <ol className="mt-2 grid gap-2">
                    {list.stops.map((stop, index) => (
                      (() => {
                        const stopContent = splitStopDescriptionAndHours(stop.description);
                        const resolvedStopHours = resolveStopHours(stop) ?? stopContent.hours;
                        const stopItineraryId = `${list.id}:${stop.id}`;
                        const isStopInItinerary =
                          itineraryStopIds.includes(stopItineraryId) ||
                          itineraryPlaylists.some((playlist) => playlist.stopKeys.includes(stopItineraryId));
                        return (
                      <li
                        key={stop.id}
                        className="guide-content-cascade-item list-none"
                        style={{ animationDelay: `${140 + index * 45}ms` }}
                      >
                        <section
                          onMouseEnter={() => onStopHoverChange?.(stop.id)}
                          onMouseLeave={() => onStopHoverChange?.(null)}
                          className={`rounded-2xl border border-slate-200 bg-white/80 transition-[transform,box-shadow] duration-150 will-change-transform ${
                            hoveredStopId === stop.id || expandedStopIds.includes(stop.id) ? "-translate-y-0.5 shadow-md" : ""
                          }`}
                        >
                        <div
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700"
                        >
                          <button
                            type="button"
                            onClick={() => toggleStop(stop.id)}
                            onFocus={() => onStopHoverChange?.(stop.id)}
                            onBlur={() => onStopHoverChange?.(null)}
                            aria-expanded={expandedStopIds.includes(stop.id)}
                            aria-controls={`guide-stop-panel-${list.id}-${stop.id}`}
                            className="flex min-w-0 flex-1 items-center gap-2 text-left"
                          >
                            {showStopNumbers ? (
                              <span
                                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                                style={{ backgroundColor: categoryStyle.mapColor }}
                              >
                                {index + 1}
                              </span>
                            ) : (
                              <span
                                className="inline-flex h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: categoryStyle.mapColor }}
                              />
                            )}
                            <span className="min-w-0 flex-1 font-semibold">{stop.name}</span>
                            {stop.places?.length ? (
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-slate-600">
                                {stop.places.length} places
                              </span>
                            ) : null}
                            <ChevronDown
                              className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                                expandedStopIds.includes(stop.id) ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>
                        <div
                          id={`guide-stop-panel-${list.id}-${stop.id}`}
                          className={`grid transition-[grid-template-rows,opacity] duration-150 ease-out ${
                            expandedStopIds.includes(stop.id) ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="border-t border-slate-200 px-3 py-3">
                              <p className="px-3 text-sm leading-5 text-slate-600">{stopContent.summary}</p>
                              {stop.places?.length ? (
                                <div className="mt-3">
                                  <div className="mb-2 flex items-center gap-2">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">POI</p>
                                    <div className="h-px flex-1 bg-slate-200" />
                                  </div>
                                  <div className="space-y-2 pl-4">
                                  {stop.places.map((place, placeIndex) => (
                                    <div
                                      key={place.id}
                                      onMouseEnter={() => onStopHoverChange?.(place.id)}
                                      onMouseLeave={() => onStopHoverChange?.(null)}
                                      className={`flex items-start gap-2 rounded-xl border border-slate-200 bg-stone-50 px-3 py-1.5 transition-[transform,opacity] duration-150 will-change-transform ${
                                        hoveredStopId === place.id ? "-translate-y-0.5" : ""
                                      }`}
                                    >
                                      <span
                                        className="mt-0.5 inline-flex h-5 w-5 shrink-0 rotate-45 items-center justify-center rounded-[4px] text-[10px] font-semibold text-white"
                                        style={{ backgroundColor: categoryStyle.poiColor }}
                                      >
                                        <span className="-rotate-45">{getAlphaMarker(placeIndex)}</span>
                                      </span>
                                      <div className="min-w-0 flex-1 pt-0.5">
                                        <button
                                          type="button"
                                          onClick={() => togglePlace(place.id)}
                                          className="flex min-h-5 w-full items-center gap-2 text-left"
                                          aria-expanded={expandedPlaceIds.includes(place.id)}
                                        >
                                          <span className="min-w-0 flex-1 text-xs font-semibold text-slate-800">{place.name}</span>
                                          <ChevronDown
                                            className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${
                                              expandedPlaceIds.includes(place.id) ? "rotate-180" : ""
                                            }`}
                                          />
                                        </button>
                                        <div
                                          className={`grid transition-[grid-template-rows,opacity,margin] duration-150 ease-out ${
                                            expandedPlaceIds.includes(place.id)
                                              ? "mt-1 grid-rows-[1fr] opacity-100"
                                              : "mt-0 grid-rows-[0fr] opacity-0"
                                          }`}
                                        >
                                          <div className="overflow-hidden">
                                            <p className="text-xs leading-4 text-slate-600">{place.description}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
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
                                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${
                                        isStopInItinerary
                                          ? "border-emerald-600 bg-emerald-600 text-white"
                                          : "border-slate-200 bg-white text-slate-700 hover:text-slate-900"
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
                                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-medium text-slate-700 hover:text-slate-900"
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
                                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-medium text-slate-700 hover:text-slate-900"
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
