"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, MapPin, Pencil, Plus, Route, Settings, User } from "lucide-react";

import { MapListCard } from "@/components/cards/MapListCard";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { useAppStore } from "@/store/app-store";
import { Continent, MapList, SelectionState } from "@/types";

interface CreatorHubContentProps {
  creatorId: string;
  guides: MapList[];
  journals: MapList[];
  continents: Continent[];
  paneTransitionClass?: string;
  creator: {
    name: string;
    avatar: string;
    bio: string;
  };
  stats: {
    yearsAsUser: number;
    favoritesCount: number;
    itineraryCount: number;
    placesBeenCount: number;
  };
}

type CreatorRailId = "guides" | "experiences" | "itineraries";
type CreatorLeftRailId = "places-been" | "settings" | "edit-profile";

function isItineraryGuide(list: MapList) {
  const hasGeneratedItineraryStops = list.stops.some((stop) => stop.id.startsWith("itinerary-stop-"));
  const hasItineraryTitle = /\bitinerary\b/i.test(list.title);
  const hasCompiledItineraryDescription = /^compiled itinerary with \d+ saved locations\.?$/i.test(
    list.description.trim(),
  );
  return hasGeneratedItineraryStops || (hasItineraryTitle && hasCompiledItineraryDescription);
}

const creatorRailOptions: Array<{
  id: CreatorRailId;
  label: string;
  icon: typeof User;
  addHref: string;
  addLabel: string;
}> = [
  { id: "guides", label: "Guides", icon: User, addHref: "/submit?type=guide", addLabel: "Add guide" },
  { id: "experiences", label: "Experiences", icon: BookOpen, addHref: "/submit?type=journal", addLabel: "Add experience" },
  { id: "itineraries", label: "Itineraries", icon: Route, addHref: "/submit?type=guide", addLabel: "Add itinerary" },
];

const creatorLeftRailOptions: Array<{
  id: CreatorLeftRailId;
  label: string;
  icon: typeof MapPin;
}> = [
  { id: "places-been", label: "Places Been", icon: MapPin },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "edit-profile", label: "Edit Profile", icon: Pencil },
];

export function CreatorHubContent({
  creatorId,
  guides,
  journals,
  continents,
  paneTransitionClass = "",
  creator,
  stats,
}: CreatorHubContentProps) {
  const submittedLists = useAppStore((state) => state.submittedLists);
  const currentUser = useAppStore((state) => state.currentUser);
  const setJournalVisibility = useAppStore((state) => state.setJournalVisibility);
  const [activeRail, setActiveRail] = useState<CreatorRailId>("guides");
  const [activeLeftRail, setActiveLeftRail] = useState<CreatorLeftRailId>("places-been");
  const [expandedListId, setExpandedListId] = useState<string | null>(null);
  const [focusedListId, setFocusedListId] = useState<string | null>(null);
  const [hoveredStopId, setHoveredStopId] = useState<string | null>(null);
  const [selectedGuideStopId, setSelectedGuideStopId] = useState<string | null>(null);
  const [selectedGuideStopNonce, setSelectedGuideStopNonce] = useState(0);

  const creatorSubmittedLists = useMemo(
    () => submittedLists.filter((list) => list.creator.id === creatorId),
    [creatorId, submittedLists],
  );

  const mergedGuides = useMemo(() => {
    const seededIds = new Set(guides.map((list) => list.id));
    const submittedGuides = creatorSubmittedLists.filter(
      (list) => list.submissionType !== "journal" && !isItineraryGuide(list) && !seededIds.has(list.id),
    );
    return [...submittedGuides, ...guides.filter((list) => !isItineraryGuide(list))];
  }, [creatorSubmittedLists, guides]);

  const mergedItineraries = useMemo(
    () =>
      creatorSubmittedLists.filter(
        (list) => list.submissionType !== "journal" && isItineraryGuide(list),
      ),
    [creatorSubmittedLists],
  );

  const mergedJournals = useMemo(() => {
    const seededIds = new Set(journals.map((list) => list.id));
    const submittedJournals = creatorSubmittedLists.filter(
      (list) => list.submissionType === "journal" && !seededIds.has(list.id),
    );
    return [...submittedJournals, ...journals].filter(
      (list) => list.journal?.visibility !== "private" || list.creator.id === currentUser?.id,
    );
  }, [creatorSubmittedLists, currentUser?.id, journals]);

  const activeLists = useMemo(() => {
    if (activeRail === "guides") {
      return mergedGuides;
    }
    if (activeRail === "experiences") {
      return mergedJournals;
    }
    return mergedItineraries;
  }, [activeRail, mergedGuides, mergedItineraries, mergedJournals]);

  const focusedList = useMemo(
    () => activeLists.find((list) => list.id === focusedListId) ?? activeLists[0] ?? null,
    [activeLists, focusedListId],
  );

  const activeRailMeta = creatorRailOptions.find((option) => option.id === activeRail) ?? creatorRailOptions[0];

  useEffect(() => {
    if (!activeLists.length) {
      setExpandedListId(null);
      setFocusedListId(null);
      return;
    }
    if (!focusedListId || !activeLists.some((list) => list.id === focusedListId)) {
      setFocusedListId(activeLists[0].id);
    }
    if (expandedListId && !activeLists.some((list) => list.id === expandedListId)) {
      setExpandedListId(null);
    }
  }, [activeLists, expandedListId, focusedListId]);

  const handleToggleExpand = (target: MapList) => {
    setFocusedListId(target.id);
    setExpandedListId((current) => (current === target.id ? null : target.id));
  };

  const noopSelection: SelectionState = {};
  const noopSelectContinent = () => {};
  const noopSelectCountry = () => {};
  const noopSelectCity = () => {};
  const noopSelectSubarea = () => {};
  const noopSelectState = () => {};

  return (
    <div className="flex w-full items-start">
      <div className="z-20 flex w-14 shrink-0 translate-x-[6px] flex-col items-center gap-3 pt-4 sm:w-16 sm:translate-x-2 lg:w-[88px] lg:translate-x-3 lg:pt-7">
        {creatorLeftRailOptions.map((option) => (
          <div key={option.id} className="relative h-10 w-10">
            <button
              type="button"
              onClick={() => setActiveLeftRail(option.id)}
              className={`guide-rail-button margin-shell-pop-in relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-700 shadow-sm transition hover:scale-105 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 ${
                activeLeftRail === option.id ? "guide-rail-button-active border-slate-900 text-slate-900" : ""
              }`}
              aria-label={option.label}
              title={option.label}
            >
              <option.icon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-4 lg:px-6">
          <div className="w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[minmax(280px,0.66fr)_minmax(0,1.14fr)_minmax(576px,1.2fr)]">
              <div className={`relative flex h-full min-h-0 flex-col overflow-hidden bg-slate-100 p-5 transition-all duration-500 lg:max-h-[calc(100vh-15rem)] ${paneTransitionClass}`}>
            <div className="h-full p-1">
              <div className="flex flex-col items-center text-center">
                <span className="inline-flex h-24 w-24 shrink-0 overflow-hidden rounded-full">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="h-full w-full object-cover"
                  />
                </span>
                <p className="mt-4 text-sm font-medium uppercase tracking-[0.24em] text-orange-600">Profile</p>
                <h1 className="mt-2 text-2xl font-semibold text-slate-900">{creator.name}</h1>
                <p className="mt-2 text-sm text-slate-600">{creator.bio}</p>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-slate-200 bg-stone-50 px-3 py-2 text-center">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Years as user</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{stats.yearsAsUser}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-stone-50 px-3 py-2 text-center">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Favorites</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{stats.favoritesCount}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-stone-50 px-3 py-2 text-center">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Itineraries</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{stats.itineraryCount}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-stone-50 px-3 py-2 text-center">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Places been</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{stats.placesBeenCount}</p>
                </div>
              </div>
            </div>
          </div>

              <div className="explorer-map-pane min-w-0 overflow-hidden border-y border-slate-200 p-0 transition-all duration-500 lg:border-x lg:border-y-0">
                <InteractiveMap
                  continents={continents}
                  selection={noopSelection}
                  guideFocus={null}
                  activeGuide={focusedList}
                  hoveredStopId={hoveredStopId}
                  onHoverGuideStop={setHoveredStopId}
                  onSelectGuideStop={(stopId) => {
                    setHoveredStopId(stopId);
                    setSelectedGuideStopId(stopId);
                    setSelectedGuideStopNonce((current) => current + 1);
                    if (focusedList) {
                      setExpandedListId(focusedList.id);
                    }
                  }}
                  onSelectContinent={noopSelectContinent}
                  onSelectCountry={noopSelectCountry}
                  onSelectCity={noopSelectCity}
                  onSelectSubarea={noopSelectSubarea}
                  onSelectState={noopSelectState}
                />
              </div>

              <div className={`overflow-hidden p-5 transition-all duration-500 lg:max-h-[calc(100vh-15rem)] ${paneTransitionClass}`}>
                <div className="flex h-full min-h-[70vh] min-w-0 flex-1 flex-col">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{activeRailMeta.label}</p>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600">
                        {activeLists.length}
                      </span>
                      <Link
                        href={activeRailMeta.addHref}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900"
                        aria-label={activeRailMeta.addLabel}
                        title={activeRailMeta.addLabel}
                      >
                        <Plus className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  <div
                    data-guides-scroll
                    className="mt-4 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1 max-h-[calc(100vh-21rem)]"
                  >
                    {activeLists.length ? (
                      activeLists.map((list) => (
                        <div key={list.id} className="space-y-2">
                          {activeRail === "experiences" ? (
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                                {[list.location.city, list.location.country].filter(Boolean).join(", ")}
                              </p>
                              {currentUser?.id === list.creator.id ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setJournalVisibility(
                                      list.id,
                                      list.journal?.visibility === "private" ? "public" : "private",
                                    )
                                  }
                                  className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] transition ${
                                    list.journal?.visibility === "private"
                                      ? "border-slate-900 bg-slate-900 text-white"
                                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                                  }`}
                                >
                                  {list.journal?.visibility === "private" ? "Private" : "Public"}
                                </button>
                              ) : null}
                            </div>
                          ) : null}
                          <MapListCard
                            list={list}
                            expandable
                            expanded={expandedListId === list.id}
                            onToggleExpand={handleToggleExpand}
                            onHoverEnd={() => setHoveredStopId(null)}
                            onStopHoverChange={setHoveredStopId}
                            hoveredStopId={hoveredStopId}
                            forceExpandStopId={selectedGuideStopId}
                            forceExpandStopNonce={selectedGuideStopNonce}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                        No {activeRailMeta.label.toLowerCase()} yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="z-20 flex w-14 shrink-0 -translate-x-[6px] flex-col items-center gap-3 pt-4 sm:w-16 sm:-translate-x-2 lg:w-[88px] lg:-translate-x-3 lg:pt-7">
        {creatorRailOptions.map((option) => (
          <div key={option.id} className="relative h-10 w-10">
            <button
              type="button"
              onClick={() => setActiveRail(option.id)}
              className={`guide-rail-button margin-shell-pop-in relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-700 shadow-sm transition hover:scale-105 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 ${
                activeRail === option.id ? "guide-rail-button-active border-slate-900 text-slate-900" : ""
              }`}
              aria-label={option.label}
              title={option.label}
            >
              <option.icon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
