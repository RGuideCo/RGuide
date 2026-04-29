"use client";

import {
  Building2,
  Camera,
  ChevronDown,
  ChevronRight,
  Flag,
  Globe2,
  Heart,
  ListFilter,
  Map as MapIcon,
  MapPin,
  Plus,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";

import { MapListCard } from "@/components/cards/MapListCard";
import { SubmitListForm } from "@/components/list/SubmitListForm";
import { ContinentList } from "@/components/map/ContinentList";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { StateShapeIcon } from "@/components/map/StateShapeIcon";
import {
  BRIAN_PROFILE_FAVORITES,
  DEFAULT_PROFILE_FAVORITES,
  FOOD_CUISINE_ANY,
  FOOD_OPEN_TIME_OPTIONS,
  FOOD_PRICE_OPTIONS,
  FoodPriceTier,
  MORPH_GROW_MS,
  MORPH_LEFT_ALIGN_OFFSET_PX,
  MORPH_LEFT_MS,
  MORPH_SETTLE_MS,
  MORPH_TOTAL_MS,
  MORPH_UP_MS,
  MORPH_UP_START_MS,
  NIGHTLIFE_BAR_TYPE_ANY,
  NIGHTLIFE_BAR_TYPE_OPTIONS,
  PlacesBeenEntry,
  PlacesBeenFilter,
  REVEAL_BODY_MS,
  REVEAL_DESCRIPTION_MS,
  REVEAL_SUBTITLE_MS,
  SubcategoryScope,
  categoryOptions,
  categorySubcategoriesByScope,
  contextualFoodCuisinesByCity,
  contextualFoodCuisinesByCountry,
  contextualFoodCuisinesByScope,
  doesListMatchFoodPrice,
  doesListMatchSubcategory,
  filterListStopsByFoodPrice,
  generalFoodCuisines,
  getDefaultSelection,
  guideRailActiveColorById,
  guideRailFillOnActiveIds,
  guideRailOptions,
  inferFoodCuisine,
  inferNightlifeBarType,
  isItineraryList,
  isPrivateJournalExperience,
  profileLeftRailOptions,
  profileRightRailOptions,
} from "@/components/home/split-screen-config";
import { usePlacesBeenDirectory } from "@/components/home/use-places-been-directory";
import { usePersistedPlacesBeen } from "@/components/home/use-persisted-places-been";
import { useItineraryWorkspace } from "@/components/home/use-itinerary-workspace";
import { getCountryFlagEmoji } from "@/lib/country-flag";
import { CATEGORY_STYLES } from "@/lib/constants";
import {
  CityDeepLinkState,
  getCanonicalCityCategoryPath,
  getCanonicalCityNeighborhoodPath,
  getCanonicalCityPath,
  getCanonicalGuidePath,
} from "@/lib/deep-link-routes";
import { updateSupabaseProfile } from "@/lib/supabase/profile";
import { getEditorialLists, useAppStore } from "@/store/app-store";
import { Continent, ListCategory, MapList, SelectionState, SubmissionType } from "@/types";

interface SplitScreenSectionProps {
  continents: Continent[];
  initialRouteState?: CityDeepLinkState;
  seoContent?: {
    h1: string;
    intro: string;
  };
}

type MapViewportInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type MobileBrowseSelectOption = {
  value: string;
  label: string;
};

const MOBILE_ALL_COUNTRIES_VALUE = "__all-countries";
const MOBILE_ALL_REGIONS_VALUE = "__all-regions";
const MOBILE_ALL_STATES_VALUE = "__all-states";
const MOBILE_ALL_CITIES_VALUE = "__all-cities";
const MOBILE_ALL_NEIGHBORHOODS_VALUE = "__all-neighborhoods";

type ExitingRailIcon =
  | { kind: "continent"; id: string; name: string }
  | { kind: "country"; name: string; flag: string | null }
  | { kind: "state"; id: string; name: string; countryId?: string }
  | { kind: "city"; id: string; name: string; continentId: string; countryId: string };

function MobileBrowseSelect({
  label,
  value,
  placeholder,
  options,
  selectedIcon,
  forceIconButton = false,
  centeredMenu = false,
  showPlaceholderOption = true,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: MobileBrowseSelectOption[];
  selectedIcon?: ReactNode;
  forceIconButton?: boolean;
  centeredMenu?: boolean;
  showPlaceholderOption?: boolean;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPointerLeft, setMenuPointerLeft] = useState<number | null>(null);
  const [menuTop, setMenuTop] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const selectedOption = options.find((option) => option.value === value);
  const isIconButton = forceIconButton || Boolean(selectedOption && selectedIcon);
  const shouldCenterMenu = isIconButton && centeredMenu;
  const handleOptionSelect = (nextValue: string) => {
    onChange(nextValue);
    setIsOpen(false);
  };
  const openMenu = () => {
    if (shouldCenterMenu) {
      const triggerRect = triggerRef.current?.getBoundingClientRect();
      const menuWidth = Math.min(288, Math.max(0, window.innerWidth - 24));
      const menuLeft = (window.innerWidth - menuWidth) / 2;
      if (triggerRect) {
        const pointerLeft = triggerRect.left + triggerRect.width / 2 - menuLeft;
        setMenuPointerLeft(Math.min(menuWidth - 18, Math.max(18, pointerLeft)));
        setMenuTop(triggerRect.bottom + 10);
      }
    }
    setIsOpen((current) => !current);
  };

  return (
    <div className={isIconButton ? "relative shrink-0" : "relative mx-auto w-full max-w-[18rem] basis-full"} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) {
        setIsOpen(false);
      }
    }}>
      <button
        ref={triggerRef}
        type="button"
        onClick={openMenu}
        className={
          isIconButton
            ? "flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-800 shadow-[0_8px_18px_rgba(15,23,42,0.08)] transition hover:border-slate-300 focus-visible:ring-orange-500/50"
            : "flex h-10 w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 px-3 text-left text-sm font-semibold text-slate-900 shadow-[0_8px_18px_rgba(15,23,42,0.06)] transition hover:border-slate-300 focus-visible:ring-orange-500/50"
        }
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label}
        title={selectedOption?.label ?? placeholder}
      >
        {isIconButton ? (
          selectedIcon ?? (
            <video
              muted
              loop
              autoPlay
              playsInline
              preload="auto"
              poster="/assets/rotating-earth-still.png"
              className="h-8 w-8 rounded-full object-cover"
            >
              <source src="/assets/rotating-earth.webm" type="video/webm" />
              <source src="/assets/rotating-earth.mp4" type="video/mp4" />
            </video>
          )
        ) : (
          <>
            <span className={selectedOption ? "truncate" : "truncate text-slate-500"}>
              {selectedOption?.label ?? placeholder}
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </>
        )}
      </button>

      {isOpen ? (
        <div
          role="listbox"
          aria-label={label}
          className={`absolute top-[calc(100%+0.65rem)] z-[90] max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl ${
            shouldCenterMenu
              ? ""
              : isIconButton
                ? "left-1/2 w-56 -translate-x-1/2"
                : "left-0 right-0"
          }`}
          style={
            shouldCenterMenu
              ? {
                  position: "fixed",
                  left: "50%",
                  right: "auto",
                  top: menuTop !== null ? `${menuTop}px` : "4.25rem",
                  width: "min(18rem, calc(100vw - 1.5rem))",
                  transform: "translateX(-50%)",
                }
              : undefined
          }
        >
          <span
            className={`pointer-events-none absolute -top-1.5 h-3 w-3 rotate-45 border-l border-t border-slate-200 bg-white ${
              shouldCenterMenu
                ? ""
                : isIconButton
                  ? "left-1/2 -translate-x-1/2"
                  : "left-5"
            }`}
            style={shouldCenterMenu && menuPointerLeft !== null ? { left: `${menuPointerLeft - 6}px` } : undefined}
            aria-hidden="true"
          />
          {showPlaceholderOption ? (
            <button
              type="button"
              role="option"
              aria-selected={!value}
              onPointerDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleOptionSelect("");
              }}
              className={`mb-1 flex w-full items-center rounded-lg px-3 py-3 text-left text-base font-semibold transition ${
                !value ? "bg-orange-50 text-orange-700" : "bg-stone-50 text-slate-800 hover:bg-stone-100 hover:text-slate-950"
              }`}
            >
              <span>{placeholder}</span>
            </button>
          ) : null}
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={value === option.value}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                handleOptionSelect(option.value);
              }}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                value === option.value
                  ? "bg-orange-50 text-orange-700"
                  : "text-slate-700 hover:bg-stone-100 hover:text-slate-950"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function SplitScreenSection({ continents, initialRouteState, seoContent }: SplitScreenSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentUser = useAppStore((state) => state.currentUser);
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);
  const isProfileShellActive = useAppStore((state) => state.isProfileShellActive);
  const isMobileSearchOpen = useAppStore((state) => state.isMobileSearchOpen);
  const setProfileShellActive = useAppStore((state) => state.setProfileShellActive);
  const favoriteIds = useAppStore((state) => state.favoriteIds);
  const votedIds = useAppStore((state) => state.votedIds);
  const itineraryIds = useAppStore((state) => state.itineraryIds);
  const itineraryStopScheduleById = useAppStore((state) => state.itineraryStopScheduleById);
  const setItineraryStopSchedule = useAppStore((state) => state.setItineraryStopSchedule);
  const addListToItineraryPlaylist = useAppStore((state) => state.addListToItineraryPlaylist);
  const setItineraryPlaylistCompleted = useAppStore((state) => state.setItineraryPlaylistCompleted);
  const submitList = useAppStore((state) => state.submitList);
  const updateSubmittedList = useAppStore((state) => state.updateSubmittedList);
  const itineraryPlaylists = useAppStore((state) => state.itineraryPlaylists);
  const removeStopFromItineraryPlaylist = useAppStore((state) => state.removeStopFromItineraryPlaylist);
  const editorialLists = useAppStore((state) => state.editorialLists);
  const submittedLists = useAppStore((state) => state.submittedLists);
  const [selection, setSelection] = useState<SelectionState>(() => initialRouteState?.selection ?? getDefaultSelection(continents));
  const [focusedCountrySignal, setFocusedCountrySignal] = useState<{
    countryId: string;
    nonce: number;
  } | null>(null);
  const [activeCategory, setActiveCategory] = useState<ListCategory | null>(initialRouteState?.activeCategory ?? null);
  const [visibleSubcategoryCategory, setVisibleSubcategoryCategory] = useState<ListCategory | null>(null);
  const [isSubcategoryClosing, setIsSubcategoryClosing] = useState(false);
  const [isSubcategoryCollapsing, setIsSubcategoryCollapsing] = useState(false);
  const [continentBrowseView, setContinentBrowseView] = useState<"countries" | "regions">("countries");
  const [countryBrowseView, setCountryBrowseView] = useState<"cities" | "regions">("cities");
  const [stateBrowseView, setStateBrowseView] = useState<"cities" | "regions">("cities");
  const [regionBrowseView, setRegionBrowseView] = useState<"cities" | "states">("cities");
  const [hoveredCategoryLabel, setHoveredCategoryLabel] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [activeFoodPrice, setActiveFoodPrice] = useState<FoodPriceTier | null>(null);
  const [activeFoodOpenTime, setActiveFoodOpenTime] = useState<(typeof FOOD_OPEN_TIME_OPTIONS)[number]>("Now");
  const [isFoodOpenTimeMenuOpen, setIsFoodOpenTimeMenuOpen] = useState(false);
  const [activeFoodCuisine, setActiveFoodCuisine] = useState<string>(FOOD_CUISINE_ANY);
  const [isFoodCuisineMenuOpen, setIsFoodCuisineMenuOpen] = useState(false);
  const [activeNightlifeBarType, setActiveNightlifeBarType] = useState<string>(NIGHTLIFE_BAR_TYPE_ANY);
  const [isNightlifeBarMenuOpen, setIsNightlifeBarMenuOpen] = useState(false);
  const [hoveredGuide, setHoveredGuide] = useState<MapList | null>(null);
  const [hoveredStopId, setHoveredStopId] = useState<string | null>(null);
  const [visibleNestedStopParentIds, setVisibleNestedStopParentIds] = useState<string[]>([]);
  const [selectedGuideStopId, setSelectedGuideStopId] = useState<string | null>(null);
  const [selectedGuideStopNonce, setSelectedGuideStopNonce] = useState(0);
  const [activeGuideFitNonce, setActiveGuideFitNonce] = useState(0);
  const [activeGuideRail, setActiveGuideRail] = useState<(typeof guideRailOptions)[number]["id"]>("r-guides");
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>(initialRouteState?.expandedGuideId ?? null);
  const [pendingSourcesOpenGuideId, setPendingSourcesOpenGuideId] = useState<string | null>(null);
  const [closingGuide, setClosingGuide] = useState<MapList | null>(null);
  const [isMobileListSheetExpanded, setIsMobileListSheetExpanded] = useState(false);
  const [isMobileListSheetDragging, setIsMobileListSheetDragging] = useState(false);
  const [mobileListSheetDragHeight, setMobileListSheetDragHeight] = useState<number | null>(null);
  const [isMobileCategoryMenuOpen, setIsMobileCategoryMenuOpen] = useState(false);
  const [isMobileCategoryMenuClosing, setIsMobileCategoryMenuClosing] = useState(false);
  const mobileListSheetDraggingRef = useRef(false);
  const mobileListSheetDragStartRef = useRef({ y: 0, height: 0 });
  const mobileListSheetTapCandidateRef = useRef(false);
  const mobileCategoryCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mobileAllSelection, setMobileAllSelection] = useState({
    country: false,
    region: false,
    state: false,
    city: false,
    neighborhood: false,
  });
  const [continentLabelRevealKey, setContinentLabelRevealKey] = useState(0);
  const [countryRevealKey, setCountryRevealKey] = useState(0);
  const [continentTitleMorph, setContinentTitleMorph] = useState<{
    kind?: "continent" | "country" | "state" | "city";
    id: string;
    name: string;
    detail: string;
    iconSrc?: string;
    iconFlag?: string;
    fromTop: number;
    fromLeft: number;
    fromWidth: number;
    fromHeight: number;
    fromFontSize: number;
    toTop: number;
    toLeft: number;
    toWidth: number;
    toHeight: number;
    toFontSize: number;
    animate: boolean;
  } | null>(null);
  const [morphStage, setMorphStage] = useState<"idle" | "grow" | "left" | "settle" | "up">("idle");
  const [postMorphRevealPhase, setPostMorphRevealPhase] = useState<0 | 1 | 2 | 3>(3);
  const [activeProfileLeftRail, setActiveProfileLeftRail] = useState<
    (typeof profileLeftRailOptions)[number]["id"] | null
  >(null);
  const [activePlacesBeenFilter, setActivePlacesBeenFilter] = useState<PlacesBeenFilter>("places");
  const {
    manualPlacesBeenCountries,
    setManualPlacesBeenCountries,
    manualPlacesBeenCities,
    setManualPlacesBeenCities,
    manualPlacesBeenPlaces,
    setManualPlacesBeenPlaces,
  } = usePersistedPlacesBeen(currentUser);
  const [isAddingPlacesBeenCountry, setIsAddingPlacesBeenCountry] = useState(false);
  const [draftPlacesBeenCountry, setDraftPlacesBeenCountry] = useState("");
  const [expandedPlacesBeenCountries, setExpandedPlacesBeenCountries] = useState<string[]>([]);
  const [focusedPlacesBeenStopIds, setFocusedPlacesBeenStopIds] = useState<string[] | null>(null);
  const [profilePlacesBeenMapSelection, setProfilePlacesBeenMapSelection] = useState<SelectionState | null>(null);
  const [activeProfileRightRail, setActiveProfileRightRail] = useState<(typeof profileRightRailOptions)[number]["id"]>("guides");
  const [profileExpandedGuideId, setProfileExpandedGuideId] = useState<string | null>(null);
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [profileEditingListId, setProfileEditingListId] = useState<string | null>(null);
  const [profileSubmissionType, setProfileSubmissionType] = useState<SubmissionType>("guide");
  const [profileGuideSubmissionVariant, setProfileGuideSubmissionVariant] = useState<"guide" | "itinerary">("guide");
  const [mapResizeSignal, setMapResizeSignal] = useState(0);
  const [mapViewportInsets, setMapViewportInsets] = useState<MapViewportInsets>({
    top: 8,
    right: 0,
    bottom: 8,
    left: 0,
  });
  const [profileSubmissionSelection, setProfileSubmissionSelection] = useState<SelectionState>({});
  const [profileSubmissionPreviewList, setProfileSubmissionPreviewList] = useState<MapList | null>(null);
  const [profileMapPinnedLocation, setProfileMapPinnedLocation] = useState<{
    id: number;
    coordinates: [number, number];
  } | null>(null);
  const [profileNameDraft, setProfileNameDraft] = useState("");
  const [profileBioDraft, setProfileBioDraft] = useState("");
  const [profileAvatarPreview, setProfileAvatarPreview] = useState("");
  const [profileAvatarFile, setProfileAvatarFile] = useState<File | null>(null);
  const [profileEditMessage, setProfileEditMessage] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [exitingRailIcons, setExitingRailIcons] = useState<Partial<Record<ExitingRailIcon["kind"], ExitingRailIcon>>>({});
  const [profileIntroNonce, setProfileIntroNonce] = useState(0);
  const [displayShellMode, setDisplayShellMode] = useState<"explorer" | "profile">(
    isProfileShellActive && currentUser ? "profile" : "explorer",
  );
  const [shellTransitionPhase, setShellTransitionPhase] = useState<"idle" | "exiting" | "entering">("idle");
  const guideRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const guideLayoutPositionsRef = useRef<Record<string, DOMRect>>({});
  const shouldAnimateGuideLayoutRef = useRef(false);
  const guideLayoutAnimationFramesRef = useRef<ReturnType<typeof requestAnimationFrame>[]>([]);
  const closingGuideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const morphCommitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const morphCleanupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const morphFrameRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
  const morphStageTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const postMorphRevealTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const shellModeTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const wasProfileModeRef = useRef(false);
  const profileAvatarInputRef = useRef<HTMLInputElement | null>(null);
  const previousProfileLeftRailRef = useRef<(typeof profileLeftRailOptions)[number]["id"] | null>(null);
  const globeRailVideoRef = useRef<HTMLVideoElement | null>(null);
  const previousRailIconsRef = useRef<Record<ExitingRailIcon["kind"], ExitingRailIcon | null>>({
    continent: null,
    country: null,
    state: null,
    city: null,
  });
  const shellViewportRef = useRef<HTMLDivElement | null>(null);
  const leftPaneRef = useRef<HTMLDivElement | null>(null);
  const mapViewportPanelRef = useRef<HTMLDivElement | null>(null);
  const rightPaneRef = useRef<HTMLDivElement | null>(null);
  const initialRouteStateKey = JSON.stringify(initialRouteState ?? null);
  const selectionRef = useRef(selection);
  const activeCategoryRef = useRef(activeCategory);
  const expandedGuideIdRef = useRef(expandedGuideId);

  useEffect(() => {
    selectionRef.current = selection;
  }, [selection]);

  useEffect(() => {
    activeCategoryRef.current = activeCategory;
  }, [activeCategory]);

  useEffect(() => {
    expandedGuideIdRef.current = expandedGuideId;
  }, [expandedGuideId]);

  useEffect(() => {
    if (!initialRouteState) {
      return;
    }

    const nextCategory = initialRouteState.activeCategory ?? null;
    const nextGuideId = initialRouteState.expandedGuideId ?? null;
    const currentSelection = selectionRef.current;
    const currentCategory = activeCategoryRef.current;
    const currentGuideId = expandedGuideIdRef.current;
    const isSameSelection =
      currentSelection.continentId === initialRouteState.selection.continentId &&
      currentSelection.continentSubareaId === initialRouteState.selection.continentSubareaId &&
      currentSelection.countryId === initialRouteState.selection.countryId &&
      currentSelection.countrySubareaId === initialRouteState.selection.countrySubareaId &&
      currentSelection.stateId === initialRouteState.selection.stateId &&
      currentSelection.cityId === initialRouteState.selection.cityId &&
      currentSelection.subareaId === initialRouteState.selection.subareaId &&
      currentSelection.nestedSubareaId === initialRouteState.selection.nestedSubareaId;
    const isSameRouteState =
      isSameSelection &&
      currentCategory === nextCategory &&
      currentGuideId === nextGuideId;

    if (isSameRouteState) {
      return;
    }

    if (!isSameSelection) {
      setSelection(initialRouteState.selection);
    }
    if (currentCategory !== nextCategory) {
      setActiveCategory(nextCategory);
      setActiveSubcategory(null);
    }
    if (currentGuideId !== nextGuideId) {
      setExpandedGuideId(nextGuideId);
      setClosingGuide(null);
      setVisibleNestedStopParentIds([]);
    }
    if (nextGuideId && currentGuideId !== nextGuideId) {
      setActiveGuideFitNonce((current) => current + 1);
    }
  }, [initialRouteStateKey]);

  useEffect(() => {
    setProfileNameDraft(currentUser?.name ?? "");
    setProfileBioDraft(currentUser?.bio ?? "");
    setProfileAvatarPreview(currentUser?.avatar ?? "");
    setProfileAvatarFile(null);
    setProfileEditMessage(null);
  }, [currentUser?.avatar, currentUser?.bio, currentUser?.id, currentUser?.name]);

  const handleProfileAvatarChange = (file: File | null) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setProfileEditMessage("Choose an image file for your profile picture.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setProfileAvatarFile(file);
    setProfileAvatarPreview((current) => {
      if (current.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }
      return previewUrl;
    });
    setProfileEditMessage(null);
    void handleProfileSave(file);
  };

  const handleProfileSave = async (avatarFileOverride?: File | null) => {
    if (!currentUser) {
      return;
    }

    const nextName = profileNameDraft.trim();
    const nextBio = profileBioDraft.trim();

    if (!nextName) {
      setProfileEditMessage("Add a display name.");
      return;
    }

    setIsSavingProfile(true);
    setProfileEditMessage(null);

    const { avatarUrl, error } = await updateSupabaseProfile({
      name: nextName,
      bio: nextBio || "Building a personal city guide with RGuide.",
      avatarFile: avatarFileOverride ?? profileAvatarFile,
      fallbackAvatarUrl: currentUser.avatar,
    });

    setIsSavingProfile(false);

    if (error) {
      setProfileEditMessage(error.message);
      return;
    }

    setProfileAvatarFile(null);
    setCurrentUser({
      ...currentUser,
      name: nextName,
      bio: nextBio || "Building a personal city guide with RGuide.",
      avatar: avatarUrl,
    });
    setProfileEditMessage("Profile updated.");
  };
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const titleTextRef = useRef<HTMLSpanElement | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);
  const clearMorphStageTimeouts = () => {
    if (!morphStageTimeoutsRef.current.length) {
      return;
    }
    for (const timeoutId of morphStageTimeoutsRef.current) {
      clearTimeout(timeoutId);
    }
    morphStageTimeoutsRef.current = [];
  };
  const clearPostMorphRevealTimeouts = () => {
    if (!postMorphRevealTimeoutsRef.current.length) {
      return;
    }
    for (const timeoutId of postMorphRevealTimeoutsRef.current) {
      clearTimeout(timeoutId);
    }
    postMorphRevealTimeoutsRef.current = [];
  };
  const clearShellModeTimeouts = () => {
    if (!shellModeTimeoutsRef.current.length) {
      return;
    }
    for (const timeoutId of shellModeTimeoutsRef.current) {
      clearTimeout(timeoutId);
    }
    shellModeTimeoutsRef.current = [];
  };
  const startPostMorphReveal = () => {
    clearPostMorphRevealTimeouts();
    setPostMorphRevealPhase(0);
    postMorphRevealTimeoutsRef.current.push(
      setTimeout(() => setPostMorphRevealPhase(1), REVEAL_SUBTITLE_MS),
    );
    postMorphRevealTimeoutsRef.current.push(
      setTimeout(() => setPostMorphRevealPhase(2), REVEAL_DESCRIPTION_MS),
    );
    postMorphRevealTimeoutsRef.current.push(
      setTimeout(() => setPostMorphRevealPhase(3), REVEAL_BODY_MS),
    );
  };
  const startMorphSequence = () => {
    const syncMorphTargetToHeader = () => {
      const paneRect = leftPaneRef.current?.getBoundingClientRect();
      const titleEl = titleTextRef.current ?? titleRef.current;
      const titleRect = titleEl?.getBoundingClientRect();
      if (!paneRect || !titleRect) {
        return;
      }
      setContinentTitleMorph((current) =>
        current
          ? {
              ...current,
              toTop: titleRect.top - paneRect.top,
              toLeft: titleRect.left - paneRect.left - MORPH_LEFT_ALIGN_OFFSET_PX,
              toWidth: titleRect.width,
              toHeight: titleRect.height,
              toFontSize: (() => {
                if (!titleEl || typeof window === "undefined") {
                  return current.toFontSize;
                }
                const parsed = Number.parseFloat(window.getComputedStyle(titleEl).fontSize);
                return Number.isFinite(parsed) && parsed > 0 ? parsed : current.toFontSize;
              })(),
            }
          : current,
      );
    };

    clearMorphStageTimeouts();
    clearPostMorphRevealTimeouts();
    setPostMorphRevealPhase(0);
    setMorphStage("idle");
    morphFrameRef.current = requestAnimationFrame(() => {
      morphFrameRef.current = requestAnimationFrame(() => {
        syncMorphTargetToHeader();
        setContinentTitleMorph((current) =>
          current ? { ...current, animate: true } : current,
        );
        setMorphStage("grow");
        morphStageTimeoutsRef.current.push(
          setTimeout(() => {
            syncMorphTargetToHeader();
            setMorphStage("left");
          }, MORPH_GROW_MS),
        );
        morphStageTimeoutsRef.current.push(
          setTimeout(() => {
            syncMorphTargetToHeader();
            setMorphStage("settle");
          }, MORPH_GROW_MS + MORPH_LEFT_MS),
        );
        morphStageTimeoutsRef.current.push(
          setTimeout(() => {
            syncMorphTargetToHeader();
            setMorphStage("up");
          }, MORPH_UP_START_MS),
        );
        morphFrameRef.current = null;
      });
    });
  };
  const pushExplorerPath = (path: string) => {
    if (pathname !== path) {
      router.push(path, { scroll: false });
    }
  };
  const getCityRouteContext = (nextSelection: SelectionState) => {
    const continent = continents.find((item) => item.id === nextSelection.continentId);
    const country = continent?.countries.find((item) => item.id === nextSelection.countryId);
    const city = country?.cities.find((item) => item.id === nextSelection.cityId);
    const parentSubarea = city?.subareas?.find((item) => item.id === nextSelection.subareaId);
    const neighborhood = nextSelection.nestedSubareaId
      ? parentSubarea?.subareas?.find((item) => item.id === nextSelection.nestedSubareaId)
      : parentSubarea;

    return city ? { city, neighborhood } : null;
  };
  const getCurrentCityRoutePath = (categoryOverride: ListCategory | null = activeCategory) => {
    const context = getCityRouteContext(selection);
    if (!context) {
      return null;
    }
    if (categoryOverride) {
      return getCanonicalCityCategoryPath(context.city, categoryOverride, context.neighborhood);
    }
    if (context.neighborhood) {
      return getCanonicalCityNeighborhoodPath(context.city, context.neighborhood);
    }
    return getCanonicalCityPath(context.city);
  };
  const handleSelectContinent = (continentId: string) => {
    setFocusedCountrySignal(null);
    setSelection(() => ({ continentId }));
  };
  const handleResetToGlobalView = () => {
    setFocusedCountrySignal(null);
    setSelection({});
  };
  const handleSelectContinentSubarea = (continentId: string, continentSubareaId: string) => {
    setFocusedCountrySignal(null);
    setSelection((current) =>
      current.continentId === continentId &&
      current.continentSubareaId === continentSubareaId &&
      !current.countryId &&
      !current.cityId
        ? { continentId }
        : { continentId, continentSubareaId },
    );
  };
  const getFontSizePx = (element?: Element | null, fallback = 16) => {
    if (!element || typeof window === "undefined") {
      return fallback;
    }
    const parsed = Number.parseFloat(window.getComputedStyle(element).fontSize);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  };
  const getMorphOriginMetrics = (triggerEl?: HTMLButtonElement | null) => {
    const fallbackRect = triggerEl?.getBoundingClientRect();
    if (!triggerEl || !fallbackRect) {
      return null;
    }
    const labelEl = triggerEl.querySelector<HTMLElement>('[data-morph-origin="label"]');
    const rect = labelEl?.getBoundingClientRect() ?? fallbackRect;
    const fontSize = getFontSizePx(labelEl ?? triggerEl, 14);
    return { rect, fontSize };
  };
  const handleSelectCountry = (continentId: string, countryId: string) => {
    if (
      isProfileMode &&
      activeProfileLeftRail === "places-been" &&
      activePlacesBeenFilter === "countries" &&
      isAddingPlacesBeenCountry
    ) {
      setFocusedCountrySignal(null);
      const countryName =
        continents
          .find((continent) => continent.id === continentId)
          ?.countries.find((country) => country.id === countryId)?.name ?? "";
      if (countryName) {
        setManualPlacesBeenCountries((current) => {
          const existingIndex = current.findIndex(
            (value) => normalizePlacesBeenKey(value) === normalizePlacesBeenKey(countryName),
          );
          if (existingIndex !== -1) {
            return current.filter((_, index) => index !== existingIndex);
          }
          return [...current, countryName];
        });
      }
      setDraftPlacesBeenCountry("");
      setProfilePlacesBeenMapSelection({ continentId, countryId });
      return;
    }
    setFocusedCountrySignal({ countryId, nonce: Date.now() });
    setSelection(() => ({ continentId, countryId }));
  };
  const handleSelectContinentFromGlobal = (
    continentId: string,
    triggerEl?: HTMLButtonElement | null,
  ) => {
    const selectedContinent = continents.find((continent) => continent.id === continentId);
    const paneRect = leftPaneRef.current?.getBoundingClientRect();
    const titleEl = titleTextRef.current ?? titleRef.current;
    const titleRect = titleEl?.getBoundingClientRect();

    if (morphCommitTimeoutRef.current) {
      clearTimeout(morphCommitTimeoutRef.current);
    }
    if (morphCleanupTimeoutRef.current) {
      clearTimeout(morphCleanupTimeoutRef.current);
    }
    if (morphFrameRef.current) {
      cancelAnimationFrame(morphFrameRef.current);
    }
    clearMorphStageTimeouts();

    const triggerMetrics = getMorphOriginMetrics(triggerEl);
    const triggerRect = triggerMetrics?.rect;
    const toFontSize = getFontSizePx(titleEl, 30);
    const fromFontSize = triggerMetrics?.fontSize ?? toFontSize;

    if (selectedContinent && paneRect && titleRect && triggerRect) {
      const countryCount = selectedContinent.countries.length;
      const cityCount = selectedContinent.countries.reduce(
        (total, country) => total + country.cities.filter((city) => !city.isPlaceholderRegion).length,
        0,
      );

      setContinentTitleMorph({
        kind: "continent",
        id: selectedContinent.id,
        name: selectedContinent.name,
        detail: `${countryCount} countries • ${cityCount} cities`,
        iconSrc: `/assets/continents/${selectedContinent.id}.svg`,
        fromTop: triggerRect.top - paneRect.top,
        fromLeft: triggerRect.left - paneRect.left,
        fromWidth: triggerRect.width,
        fromHeight: triggerRect.height,
        fromFontSize,
        toTop: titleRect.top - paneRect.top,
        toLeft: titleRect.left - paneRect.left - MORPH_LEFT_ALIGN_OFFSET_PX,
        toWidth: titleRect.width,
        toHeight: titleRect.height,
        toFontSize,
        animate: false,
      });
      startMorphSequence();
    }
    morphCommitTimeoutRef.current = setTimeout(() => {
      handleSelectContinent(continentId);
      morphCommitTimeoutRef.current = null;
    }, MORPH_TOTAL_MS + MORPH_SETTLE_MS);
    morphCleanupTimeoutRef.current = setTimeout(() => {
      setContinentTitleMorph(null);
      setMorphStage("idle");
      startPostMorphReveal();
      morphCleanupTimeoutRef.current = null;
    }, MORPH_TOTAL_MS + MORPH_SETTLE_MS);
  };
  const handleSelectCountryFromContinentList = (
    continentId: string,
    countryId: string,
    triggerEl?: HTMLButtonElement | null,
  ) => {
    const selectedContinent = continents.find((continent) => continent.id === continentId);
    const selectedCountry = selectedContinent?.countries.find((country) => country.id === countryId);
    const paneRect = leftPaneRef.current?.getBoundingClientRect();
    const titleEl = titleTextRef.current ?? titleRef.current;
    const titleRect = titleEl?.getBoundingClientRect();

    if (morphCommitTimeoutRef.current) {
      clearTimeout(morphCommitTimeoutRef.current);
    }
    if (morphCleanupTimeoutRef.current) {
      clearTimeout(morphCleanupTimeoutRef.current);
    }
    if (morphFrameRef.current) {
      cancelAnimationFrame(morphFrameRef.current);
    }
    clearMorphStageTimeouts();

    const triggerMetrics = getMorphOriginMetrics(triggerEl);
    const triggerRect = triggerMetrics?.rect;
    const toFontSize = getFontSizePx(titleEl, 30);
    const fromFontSize = triggerMetrics?.fontSize ?? toFontSize;

    if (selectedContinent && selectedCountry && paneRect && titleRect && triggerRect) {
      const cityCount = selectedCountry.cities.filter((city) => !city.isPlaceholderRegion).length;

      setContinentTitleMorph({
        kind: "country",
        id: selectedCountry.id,
        name: selectedCountry.name,
        detail: `${cityCount} ${cityCount === 1 ? "city" : "cities"}`,
        iconFlag: getCountryFlagEmoji(selectedCountry.name) ?? undefined,
        fromTop: triggerRect.top - paneRect.top,
        fromLeft: triggerRect.left - paneRect.left,
        fromWidth: triggerRect.width,
        fromHeight: triggerRect.height,
        fromFontSize,
        toTop: titleRect.top - paneRect.top,
        toLeft: titleRect.left - paneRect.left - MORPH_LEFT_ALIGN_OFFSET_PX,
        toWidth: titleRect.width,
        toHeight: titleRect.height,
        toFontSize,
        animate: false,
      });
      startMorphSequence();
    }

    morphCommitTimeoutRef.current = setTimeout(() => {
      handleSelectCountry(continentId, countryId);
      morphCommitTimeoutRef.current = null;
    }, MORPH_TOTAL_MS + MORPH_SETTLE_MS);
    morphCleanupTimeoutRef.current = setTimeout(() => {
      setContinentTitleMorph(null);
      setMorphStage("idle");
      startPostMorphReveal();
      morphCleanupTimeoutRef.current = null;
    }, MORPH_TOTAL_MS + MORPH_SETTLE_MS);
  };
  const handleSelectCity = (continentId: string, countryId: string, cityId: string) => {
    setFocusedCountrySignal(null);
    const continent = continents.find((item) => item.id === continentId);
    const country = continent?.countries.find((item) => item.id === countryId);
    const city = country?.cities.find((item) => item.id === cityId);

    const nextSelection = {
      continentId,
      countryId,
      countrySubareaId: city?.countrySubareaId,
      stateId: city?.stateId,
      cityId,
    };

    setSelection((current) => {
      const isSameCitySelection =
        current.continentId === continentId &&
        current.countryId === countryId &&
        current.countrySubareaId === city?.countrySubareaId &&
        current.stateId === city?.stateId &&
        current.cityId === cityId;

      if (!isSameCitySelection) {
        return nextSelection;
      }

      if (current.subareaId || current.nestedSubareaId) {
        return nextSelection;
      }

      return current;
    });

    if (city) {
      setActiveCategory(null);
      setActiveSubcategory(null);
      setExpandedGuideId(null);
      setClosingGuide(null);
      pushExplorerPath(getCanonicalCityPath(city));
    }
  };
  const handleSelectCityFromList = (
    continentId: string,
    countryId: string,
    cityId: string,
    triggerEl?: HTMLButtonElement | null,
  ) => {
    const selectedContinent = continents.find((continent) => continent.id === continentId);
    const selectedCountry = selectedContinent?.countries.find((country) => country.id === countryId);
    const selectedCity = selectedCountry?.cities.find((city) => city.id === cityId);
    const selectedState = selectedCountry?.states?.find((state) => state.id === selectedCity?.stateId);
    const selectedCountrySubarea = selectedCountry?.subareas?.find(
      (subarea) => subarea.id === selectedCity?.countrySubareaId,
    );
    const paneRect = leftPaneRef.current?.getBoundingClientRect();
    const titleEl = titleTextRef.current ?? titleRef.current;
    const titleRect = titleEl?.getBoundingClientRect();

    if (morphCommitTimeoutRef.current) {
      clearTimeout(morphCommitTimeoutRef.current);
    }
    if (morphCleanupTimeoutRef.current) {
      clearTimeout(morphCleanupTimeoutRef.current);
    }
    if (morphFrameRef.current) {
      cancelAnimationFrame(morphFrameRef.current);
    }
    clearMorphStageTimeouts();

    const triggerMetrics = getMorphOriginMetrics(triggerEl);
    const triggerRect = triggerMetrics?.rect;
    const toFontSize = getFontSizePx(titleEl, 30);
    const fromFontSize = triggerMetrics?.fontSize ?? toFontSize;

    if (selectedCountry && selectedCity && paneRect && titleRect && triggerRect) {
      const detail = [
        selectedState?.name ? formatBreadcrumbName(selectedState.name) : null,
        selectedCountrySubarea?.name ? formatBreadcrumbName(selectedCountrySubarea.name) : null,
        selectedCountry.name,
      ]
        .filter(Boolean)
        .join(", ");

      setContinentTitleMorph({
        kind: "city",
        id: selectedCity.id,
        name: selectedCity.name,
        detail,
        fromTop: triggerRect.top - paneRect.top,
        fromLeft: triggerRect.left - paneRect.left,
        fromWidth: triggerRect.width,
        fromHeight: triggerRect.height,
        fromFontSize,
        toTop: titleRect.top - paneRect.top,
        toLeft: titleRect.left - paneRect.left - MORPH_LEFT_ALIGN_OFFSET_PX,
        toWidth: titleRect.width,
        toHeight: titleRect.height,
        toFontSize,
        animate: false,
      });
      startMorphSequence();
    }

    morphCommitTimeoutRef.current = setTimeout(() => {
      handleSelectCity(continentId, countryId, cityId);
      morphCommitTimeoutRef.current = null;
    }, MORPH_TOTAL_MS + MORPH_SETTLE_MS);
    morphCleanupTimeoutRef.current = setTimeout(() => {
      setContinentTitleMorph(null);
      setMorphStage("idle");
      startPostMorphReveal();
      morphCleanupTimeoutRef.current = null;
    }, MORPH_TOTAL_MS + MORPH_SETTLE_MS);
  };
  const handleSelectSubarea = (
    continentId: string,
    countryId: string,
    cityId: string,
    subareaId: string,
  ) => {
    setFocusedCountrySignal(null);
    const isSameSubarea =
      selection.continentId === continentId &&
      selection.countryId === countryId &&
      selection.cityId === cityId &&
      selection.subareaId === subareaId &&
      !selection.nestedSubareaId;
    const nextSelection = isSameSubarea
      ? {
          continentId,
          countryId,
          countrySubareaId: selection.countrySubareaId,
          stateId: selection.stateId,
          cityId,
        }
      : {
          continentId,
          countryId,
          countrySubareaId: selection.countrySubareaId,
          stateId: selection.stateId,
          cityId,
          subareaId,
        };
    const context = getCityRouteContext(nextSelection);
    setSelection(nextSelection);
    setExpandedGuideId(null);
    setClosingGuide(null);
    if (context) {
      const nextPath =
        activeCategory && context.neighborhood
          ? getCanonicalCityCategoryPath(context.city, activeCategory, context.neighborhood)
          : context.neighborhood
            ? getCanonicalCityNeighborhoodPath(context.city, context.neighborhood)
            : getCanonicalCityPath(context.city);
      pushExplorerPath(nextPath);
    }
  };
  const handleSelectNestedSubarea = (
    continentId: string,
    countryId: string,
    cityId: string,
    subareaId: string,
    nestedSubareaId: string,
  ) => {
    setFocusedCountrySignal(null);
    const isSameNestedSubarea =
      selection.continentId === continentId &&
      selection.countryId === countryId &&
      selection.cityId === cityId &&
      selection.subareaId === subareaId &&
      selection.nestedSubareaId === nestedSubareaId;
    const nextSelection = isSameNestedSubarea
      ? {
          continentId,
          countryId,
          countrySubareaId: selection.countrySubareaId,
          stateId: selection.stateId,
          cityId,
          subareaId,
        }
      : {
          continentId,
          countryId,
          countrySubareaId: selection.countrySubareaId,
          stateId: selection.stateId,
          cityId,
          subareaId,
          nestedSubareaId,
        };
    const context = getCityRouteContext(nextSelection);
    setSelection(nextSelection);
    setExpandedGuideId(null);
    setClosingGuide(null);
    if (context) {
      const nextPath =
        activeCategory && context.neighborhood
          ? getCanonicalCityCategoryPath(context.city, activeCategory, context.neighborhood)
          : context.neighborhood
            ? getCanonicalCityNeighborhoodPath(context.city, context.neighborhood)
            : getCanonicalCityPath(context.city);
      pushExplorerPath(nextPath);
    }
  };
  const handleSelectCountrySubarea = (
    continentId: string,
    countryId: string,
    countrySubareaId: string,
  ) => {
    setFocusedCountrySignal(null);
    setSelection((current) =>
      current.continentId === continentId &&
      current.countryId === countryId &&
      !current.cityId &&
      current.countrySubareaId === countrySubareaId &&
      !current.stateId
        ? { continentId, countryId }
        : { continentId, countryId, countrySubareaId },
    );
  };
  const handleSelectState = (
    continentId: string,
    countryId: string,
    countrySubareaId: string,
    stateId: string,
  ) => {
    setFocusedCountrySignal(null);
    setSelection((current) =>
      current.continentId === continentId &&
      current.countryId === countryId &&
      current.countrySubareaId === countrySubareaId &&
      current.stateId === stateId &&
      !current.cityId
        ? { continentId, countryId, countrySubareaId }
        : { continentId, countryId, countrySubareaId, stateId },
    );
  };
  const handleSelectStateFromCountryList = (
    continentId: string,
    countryId: string,
    countrySubareaId: string,
    stateId: string,
    triggerEl?: HTMLButtonElement | null,
  ) => {
    const selectedContinent = continents.find((continent) => continent.id === continentId);
    const selectedCountry = selectedContinent?.countries.find((country) => country.id === countryId);
    const selectedState = selectedCountry?.states?.find((state) => state.id === stateId);
    const paneRect = leftPaneRef.current?.getBoundingClientRect();
    const titleEl = titleTextRef.current ?? titleRef.current;
    const titleRect = titleEl?.getBoundingClientRect();
    if (morphCommitTimeoutRef.current) {
      clearTimeout(morphCommitTimeoutRef.current);
    }
    if (morphCleanupTimeoutRef.current) {
      clearTimeout(morphCleanupTimeoutRef.current);
    }
    if (morphFrameRef.current) {
      cancelAnimationFrame(morphFrameRef.current);
    }
    clearMorphStageTimeouts();

    const triggerMetrics = getMorphOriginMetrics(triggerEl);
    const triggerRect = triggerMetrics?.rect;
    const toFontSize = getFontSizePx(titleEl, 30);
    const fromFontSize = triggerMetrics?.fontSize ?? toFontSize;

    if (selectedCountry && selectedState && paneRect && titleRect && triggerRect) {
      const stateCityCount = selectedCountry.cities.filter(
        (city) => !city.isPlaceholderRegion && city.stateId === selectedState.id,
      ).length;

      setContinentTitleMorph({
        kind: "state",
        id: selectedState.id,
        name: selectedState.name,
        detail: `${stateCityCount} ${stateCityCount === 1 ? "city" : "cities"}`,
        iconSrc: selectedCountry.id === "usa" ? `/assets/us-states/${selectedState.id}.svg` : undefined,
        fromTop: triggerRect.top - paneRect.top,
        fromLeft: triggerRect.left - paneRect.left,
        fromWidth: triggerRect.width,
        fromHeight: triggerRect.height,
        fromFontSize,
        toTop: titleRect.top - paneRect.top,
        toLeft: titleRect.left - paneRect.left - MORPH_LEFT_ALIGN_OFFSET_PX,
        toWidth: titleRect.width,
        toHeight: titleRect.height,
        toFontSize,
        animate: false,
      });
      startMorphSequence();
    }

    morphCommitTimeoutRef.current = setTimeout(() => {
      handleSelectState(continentId, countryId, countrySubareaId, stateId);
      morphCommitTimeoutRef.current = null;
    }, MORPH_TOTAL_MS + MORPH_SETTLE_MS);
    morphCleanupTimeoutRef.current = setTimeout(() => {
      setContinentTitleMorph(null);
      setMorphStage("idle");
      startPostMorphReveal();
      morphCleanupTimeoutRef.current = null;
    }, MORPH_TOTAL_MS + MORPH_SETTLE_MS);
  };

  const activeLocation = useMemo(() => {
    const continent = continents.find((item) => item.id === selection.continentId);
    const country = continent?.countries.find((item) => item.id === selection.countryId);
    const state = country?.states?.find((item) => item.id === selection.stateId);
    const city = country?.cities.find((item) => item.id === selection.cityId);
    const subarea = city?.subareas?.find((item) => item.id === selection.subareaId);
    const nestedSubarea = subarea?.subareas?.find((item) => item.id === selection.nestedSubareaId);
    return { continent, country, state, city, subarea, nestedSubarea };
  }, [continents, selection]);
  const activeCountrySubarea = useMemo(
    () => activeLocation.country?.subareas?.find((item) => item.id === selection.countrySubareaId),
    [activeLocation.country, selection.countrySubareaId],
  );
  const activeContinentSubarea = useMemo(
    () => activeLocation.continent?.subareas?.find((item) => item.id === selection.continentSubareaId),
    [activeLocation.continent, selection.continentSubareaId],
  );
  const formatBreadcrumbName = (value?: string | null) =>
    (value ?? "").replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s{2,}/g, " ").trim();
  const formatLocationDescription = (value?: string | null) =>
    (value ?? "")
      .replace(/\s*\([^)]*\)\s*/g, " ")
      .replace(/\s{2,}/g, " ")
      .replace(/\s+([,.;:!?])/g, "$1")
      .trim();
  const normalizeNeighborhoodName = (value?: string | null) =>
    formatBreadcrumbName(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const activeDirectoryMeta = useMemo(() => {
    if (activeLocation.nestedSubarea && activeLocation.city) {
      return {
        title: formatBreadcrumbName(activeLocation.nestedSubarea.name),
        detail: `${formatBreadcrumbName(activeLocation.subarea?.name) || activeLocation.city.name}, ${activeLocation.city.name}`,
      };
    }

    if (activeLocation.subarea && activeLocation.city) {
      return {
        title: formatBreadcrumbName(activeLocation.subarea.name),
        detail: `${activeLocation.city.name}, ${activeLocation.country?.name ?? activeLocation.city.country}`,
      };
    }

    if (activeLocation.city) {
      return {
        title: activeLocation.city.name,
        detail:
          [
            formatBreadcrumbName(activeLocation.state?.name),
            formatBreadcrumbName(activeCountrySubarea?.name),
            activeLocation.country?.name ?? activeLocation.city.country,
          ]
            .filter(Boolean)
            .join(", "),
      };
    }

    if (activeLocation.state && activeLocation.country) {
      return {
        title: formatBreadcrumbName(activeLocation.state.name),
        detail: activeCountrySubarea
          ? `${formatBreadcrumbName(activeCountrySubarea.name)}, ${activeLocation.country.name}`
          : activeLocation.country.name,
      };
    }

    if (activeCountrySubarea && activeLocation.country) {
      return {
        title: formatBreadcrumbName(activeCountrySubarea.name),
        detail: activeLocation.country.name,
      };
    }

    if (activeContinentSubarea && activeLocation.continent && !activeLocation.country) {
      return {
        title: formatBreadcrumbName(activeContinentSubarea.name),
        detail: activeLocation.continent.name,
      };
    }

    if (activeLocation.country) {
      const cityCount = activeLocation.country.cities.filter((city) => !city.isPlaceholderRegion).length;
      return {
        title: activeLocation.country.name,
        detail: `${cityCount} ${cityCount === 1 ? "city" : "cities"}`,
      };
    }

    if (activeLocation.continent) {
      const countryCount = activeLocation.continent.countries.length;
      const cityCount = activeLocation.continent.countries.reduce(
        (total, country) => total + country.cities.filter((city) => !city.isPlaceholderRegion).length,
        0,
      );

      return {
        title: activeLocation.continent.name,
        detail: `${countryCount} countries • ${cityCount} cities`,
      };
    }

    return {
      title: "Browse destinations",
      detail: "Select a region to explore",
    };
  }, [
    activeCountrySubarea,
    activeContinentSubarea,
    activeLocation.city,
    activeLocation.continent,
    activeLocation.country,
    activeLocation.nestedSubarea,
    activeLocation.state,
    activeLocation.subarea,
  ]);
  const activeLocationDescriptionRaw =
    activeLocation.nestedSubarea?.description ??
    activeLocation.subarea?.description ??
    activeLocation.city?.description ??
    activeLocation.state?.description ??
    activeLocation.country?.description;
  const activeLocationDescription = formatLocationDescription(activeLocationDescriptionRaw) || null;
  const activeCountryCities = useMemo(
    () =>
      activeLocation.country?.cities.filter(
        (city) =>
          !city.isPlaceholderRegion &&
          (!activeCountrySubarea || city.countrySubareaId === activeCountrySubarea.id) &&
          (!activeLocation.state || city.stateId === activeLocation.state.id),
      ) ?? [],
    [activeCountrySubarea, activeLocation.country, activeLocation.state],
  );
  const activeCitySubareas = useMemo(() => activeLocation.city?.subareas ?? [], [activeLocation.city]);
  const activeNestedCitySubareas = useMemo(
    () => activeLocation.subarea?.subareas ?? [],
    [activeLocation.subarea],
  );
  const cityUsesNestedDistricts = activeLocation.city?.id === "new-york-city";
  const activeContinentSubareas = useMemo(
    () => activeLocation.continent?.subareas ?? [],
    [activeLocation.continent],
  );
  const activeCountrySubareas = useMemo(() => activeLocation.country?.subareas ?? [], [activeLocation.country]);
  const activeCountryStates = useMemo(
    () =>
      activeLocation.country?.states?.filter(
        (state) => !activeCountrySubarea || state.countrySubareaId === activeCountrySubarea.id,
      ) ?? [],
    [activeCountrySubarea, activeLocation.country],
  );
  const hasStateHierarchyCountry = Boolean(activeLocation.country?.states?.length);
  const showCountrySubareas =
    hasStateHierarchyCountry && !activeCountrySubarea && !activeLocation.state && !activeLocation.city;
  const showCountryStates =
    hasStateHierarchyCountry && Boolean(activeCountrySubarea) && !activeLocation.state && !activeLocation.city;
  const countryStateLabel = activeLocation.country?.id === "united-kingdom" ? "Countries" : "States";
  const countryStateLabelLower = countryStateLabel.toLowerCase();
  const isRegionSelection = Boolean(activeCountrySubarea && !activeLocation.state && !activeLocation.city);
  const isStateSelection = Boolean(activeLocation.state && !activeLocation.city);
  const isCitySelection = Boolean(activeLocation.city);
  const isContinentRootSelection = Boolean(activeLocation.continent && !activeLocation.country);
  const isCountryRootSelection = Boolean(
    activeLocation.country && !activeLocation.city && !activeLocation.state && !activeCountrySubarea,
  );
  const isCountryMorphing = continentTitleMorph?.kind === "country";
  const isStateMorphing = continentTitleMorph?.kind === "state";
  const isCityMorphing = continentTitleMorph?.kind === "city";
  const isCountryOrStateMorphing = isCountryMorphing || isStateMorphing || isCityMorphing;
  const isGlobalSelection = !selection.continentId && !selection.countryId && !selection.cityId;
  const displayContinentRegions = isContinentRootSelection && continentBrowseView === "regions";
  const continentRootRevealKey = `${selection.continentId ?? ""}|${selection.countryId ?? ""}|${selection.continentSubareaId ?? ""}|${continentBrowseView}`;
  const showCountryFilterToggle = Boolean(
    activeLocation.country && !activeLocation.city && !activeLocation.state && !activeCountrySubarea,
  );
  const displayCountryRegions = showCountryFilterToggle && countryBrowseView === "regions";
  const hasDirectoryChips =
    activeLocation.city && (activeNestedCitySubareas.length || activeCitySubareas.length)
      ? true
      : showCountryFilterToggle
        ? displayCountryRegions
          ? activeCountrySubareas.length > 0
          : activeCountryCities.length > 0
      : showCountrySubareas
        ? activeCountrySubareas.length > 0
        : showCountryStates
          ? activeCountryStates.length > 0
        : activeCountryCities.length > 0;
  const cityListItems = useMemo(() => {
    if (!activeLocation.city) {
      return [];
    }

    if (cityUsesNestedDistricts && activeLocation.subarea && activeNestedCitySubareas.length) {
      return activeNestedCitySubareas
        .map((subarea) => ({
        id: subarea.id,
        name: subarea.name,
        isNested: true,
        }))
        .sort((left, right) => left.name.localeCompare(right.name));
    }

    if (activeCitySubareas.length) {
      return activeCitySubareas
        .map((subarea) => ({
        id: subarea.id,
        name: subarea.name,
        isNested: false,
        }))
        .sort((left, right) => left.name.localeCompare(right.name));
    }

    return [];
  }, [
    activeCitySubareas,
    activeLocation.city,
    activeLocation.subarea,
    activeNestedCitySubareas,
    cityUsesNestedDistricts,
  ]);

  const activeEditorialLists = useMemo(() => getEditorialLists(editorialLists), [editorialLists]);
  const selectedCityLists = useMemo(
    () =>
      activeLocation.city
        ? activeEditorialLists.filter(
            (list) => list.location.scope === "city" && list.location.city === activeLocation.city?.name,
          )
        : [],
    [activeEditorialLists, activeLocation.city],
  );
  const selectedCountryLists = useMemo(
    () =>
      activeLocation.country
        ? activeEditorialLists.filter(
            (list) =>
              list.location.scope === "country" &&
              list.location.country === activeLocation.country?.name &&
              list.location.continent === (activeLocation.continent?.name ?? activeLocation.country?.continent),
          )
        : [],
    [activeEditorialLists, activeLocation.continent?.name, activeLocation.country],
  );
  const selectedContinentLists = useMemo(
    () =>
      activeLocation.continent
        ? activeEditorialLists.filter(
            (list) => list.location.scope === "continent" && list.location.continent === activeLocation.continent?.name,
          )
        : [],
    [activeEditorialLists, activeLocation.continent],
  );
  const coreActiveLists = activeLocation.city
    ? selectedCityLists
    : activeLocation.country
      ? selectedCountryLists
      : selectedContinentLists;
  const submittedActiveLists = useMemo(
    () =>
      submittedLists.filter((list) =>
        (isPrivateJournalExperience(list) ? list.creator.id === currentUser?.id : true) &&
        (activeLocation.city
          ? (list.location.scope === "city" && list.location.city === activeLocation.city.name) ||
            (list.location.scope === "country" &&
              list.location.country === activeLocation.country?.name &&
              list.location.continent === (activeLocation.continent?.name ?? activeLocation.country?.continent))
          : activeLocation.country
            ? list.location.scope === "country" &&
              list.location.country === activeLocation.country.name &&
              list.location.continent === (activeLocation.continent?.name ?? activeLocation.country.continent)
            : activeLocation.continent
              ? list.location.scope === "continent" && list.location.continent === activeLocation.continent.name
              : false),
      ),
    [activeLocation.city, activeLocation.continent, activeLocation.country, currentUser?.id, submittedLists],
  );
  const allActiveLists = useMemo(
    () => [...coreActiveLists, ...submittedActiveLists],
    [coreActiveLists, submittedActiveLists],
  );
  const globalMergedLists = useMemo(() => {
    const merged = [...submittedLists, ...activeEditorialLists];
    const seen = new Set<string>();
    return merged.filter((list) => {
      if (isPrivateJournalExperience(list) && list.creator.id !== currentUser?.id) {
        return false;
      }
      if (seen.has(list.id)) {
        return false;
      }
      seen.add(list.id);
      return true;
    });
  }, [activeEditorialLists, currentUser?.id, submittedLists]);
  const profileLists = useMemo(
    () => (currentUser ? globalMergedLists.filter((list) => list.creator.id === currentUser.id) : []),
    [currentUser, globalMergedLists],
  );
  const profileGuides = useMemo(
    () => profileLists.filter((list) => list.submissionType !== "journal"),
    [profileLists],
  );
  const profileJournals = useMemo(
    () => profileLists.filter((list) => list.submissionType === "journal"),
    [profileLists],
  );
  const noKnownItineraryIds = useMemo(() => new Set<string>(), []);
  const profileItineraries = useMemo(
    () =>
      profileLists.filter(
        (list) => list.submissionType !== "journal" && isItineraryList(list, noKnownItineraryIds),
      ),
    [noKnownItineraryIds, profileLists],
  );
  const profileRailLists = useMemo(() => {
    if (activeProfileRightRail === "experiences") {
      return profileJournals;
    }
    if (activeProfileRightRail === "itineraries") {
      return profileItineraries;
    }
    if (activeProfileRightRail === "favorites") {
      return globalMergedLists.filter((list) => favoriteIds.includes(list.id));
    }
    return profileGuides.filter(
      (list) => !isItineraryList(list, noKnownItineraryIds),
    );
  }, [activeProfileRightRail, favoriteIds, globalMergedLists, noKnownItineraryIds, profileGuides, profileItineraries, profileJournals]);
  const profileDisplayedGuide = useMemo(
    () => profileRailLists.find((list) => list.id === profileExpandedGuideId) ?? profileRailLists[0] ?? null,
    [profileExpandedGuideId, profileRailLists],
  );
  const profileExpandedGuide = useMemo(
    () => profileRailLists.find((list) => list.id === profileExpandedGuideId) ?? null,
    [profileExpandedGuideId, profileRailLists],
  );
  const isProfileGuideTakingFullListPane = Boolean(profileExpandedGuide && !isProfileSubmitting);
  const isProfileRightPaneFilled = isProfileGuideTakingFullListPane || isProfileSubmitting;
  const profileStats = useMemo(() => {
    if (!currentUser) {
      return {
        countriesBeenCount: 0,
        favoritesCount: 0,
        guidesCount: 0,
      };
    }
    const guidesCount = profileLists.filter(
      (list) => list.submissionType !== "journal" && !isItineraryList(list, noKnownItineraryIds),
    ).length;
    const countriesBeenCount = new Set(
      profileLists
        .flatMap((list) => [list.location.country])
        .filter((value): value is string => Boolean(value)),
    ).size;
    const favoritesCount = profileLists.reduce((total, list) => total + list.upvotes, 0);
    return {
      countriesBeenCount,
      favoritesCount,
      guidesCount,
    };
  }, [currentUser, noKnownItineraryIds, profileLists]);
  const profileFavoriteHighlights = useMemo(() => {
    if (!currentUser) {
      return DEFAULT_PROFILE_FAVORITES;
    }
    const normalizedName = currentUser.name.trim().toLowerCase();
    if (normalizedName === "brian rodriguez") {
      return BRIAN_PROFILE_FAVORITES;
    }
    return DEFAULT_PROFILE_FAVORITES;
  }, [currentUser]);
  const isProfileMode = displayShellMode === "profile" && Boolean(currentUser);
  const {
    countries: profilePlacesBeenCountries,
    countryIds: profilePlacesBeenCountryIds,
    summary: profilePlacesBeenSummary,
    byCountry: profilePlacesBeenByCountry,
    stopIdsByCountry: profilePlacesBeenStopIdsByCountry,
    mapStops: profilePlacesBeenMapStops,
    guide: profilePlacesBeenGuide,
    normalizePlacesBeenKey,
    resolveKnownCountryName,
    countrySelectionLookup,
    citySelectionLookup,
  } = usePlacesBeenDirectory({
    continents,
    profileLists,
    manualPlacesBeenCountries,
    manualPlacesBeenCities,
    manualPlacesBeenPlaces,
    activePlacesBeenFilter,
    focusedPlacesBeenStopIds,
    isProfileMode,
    activeProfileLeftRail,
    currentUser,
  });
  const isProfileSubmitLayout = isProfileMode && isProfileSubmitting;
  const {
    activeItineraryPlaylist,
    activeItineraryPlaylistId,
    setActiveItineraryPlaylistId,
    isItineraryEditing,
    setIsItineraryEditing,
    itineraryStopEntries,
    buildItineraryStops,
  } = useItineraryWorkspace({
    activeGuideRail,
    itineraryPlaylists,
    globalMergedLists,
    itineraryStopScheduleById,
  });
  const handleCompleteItineraryPlaylist = () => {
    if (!activeItineraryPlaylist || !itineraryStopEntries.length) {
      return;
    }

    const firstLocation = itineraryStopEntries[0].list.location;
    const response = submitList({
      submissionType: "guide",
      url: "https://www.google.com/maps",
      title: `${activeItineraryPlaylist.name} Itinerary`,
      description: `Compiled itinerary with ${itineraryStopEntries.length} saved locations.`,
      category: "Activities",
      continent: firstLocation.continent,
      country: firstLocation.country,
      city: firstLocation.city,
      stops: buildItineraryStops(),
    });

    if (!response.ok || !response.list) {
      return;
    }

    addListToItineraryPlaylist(activeItineraryPlaylist.id, response.list.id);
    setItineraryPlaylistCompleted(activeItineraryPlaylist.id, response.list.id);
    setIsItineraryEditing(false);
    handleOpenItineraryGuide(response.list);
  };
  const handleSaveItineraryEdits = () => {
    if (!activeItineraryPlaylist?.completedListId) {
      return;
    }
    const compiledList = globalMergedLists.find((list) => list.id === activeItineraryPlaylist.completedListId);
    if (!compiledList || !itineraryStopEntries.length) {
      return;
    }
    const firstLocation = itineraryStopEntries[0].list.location;
    const response = updateSubmittedList(activeItineraryPlaylist.completedListId, {
      submissionType: "guide",
      url: compiledList.url,
      title: compiledList.title,
      description: `Compiled itinerary with ${itineraryStopEntries.length} saved locations.`,
      category: compiledList.category,
      continent: firstLocation.continent,
      country: firstLocation.country,
      city: firstLocation.city,
      neighborhood: firstLocation.neighborhood,
      stops: buildItineraryStops(),
    });
    if (!response.ok || !response.list) {
      return;
    }
    setIsItineraryEditing(false);
    handleOpenItineraryGuide(response.list);
  };
  const activeNeighborhoodKey = activeLocation.subarea
    ? normalizeNeighborhoodName(activeLocation.subarea.name)
    : null;
  const activeLists = useMemo(() => {
    if (!activeLocation.city) {
      return allActiveLists;
    }
    if (!activeNeighborhoodKey) {
      return allActiveLists.filter(
        (list) =>
          list.location.scope === "city" &&
          list.location.city === activeLocation.city!.name &&
          !normalizeNeighborhoodName(list.location.neighborhood),
      );
    }
    return allActiveLists.filter(
      (list) =>
        list.location.scope === "city" &&
        list.location.city === activeLocation.city!.name &&
        normalizeNeighborhoodName(list.location.neighborhood) === activeNeighborhoodKey,
    );
  }, [activeLocation.city, activeNeighborhoodKey, allActiveLists]);
  const subcategoryScope: SubcategoryScope = activeLocation.city
    ? "city"
    : activeLocation.subarea || activeCountrySubarea || activeLocation.state
      ? "region"
      : "country";
  const contextualFoodCuisineOptions = useMemo(() => {
    const cityName = activeLocation.city?.name;
    const countryName = activeLocation.country?.name;
    if (cityName && contextualFoodCuisinesByCity[cityName]) {
      return contextualFoodCuisinesByCity[cityName];
    }
    if (countryName && contextualFoodCuisinesByCountry[countryName]) {
      return contextualFoodCuisinesByCountry[countryName];
    }
    return contextualFoodCuisinesByScope[subcategoryScope];
  }, [activeLocation.city?.name, activeLocation.country?.name, subcategoryScope]);
  const generalFoodCuisineOptions = useMemo(
    () => generalFoodCuisines.filter((cuisine) => !contextualFoodCuisineOptions.includes(cuisine)),
    [contextualFoodCuisineOptions],
  );
  const activeFoodCuisineOptions = useMemo(
    () => [...contextualFoodCuisineOptions, ...generalFoodCuisineOptions],
    [contextualFoodCuisineOptions, generalFoodCuisineOptions],
  );
  const categoryFilteredLists = activeCategory
    ? activeLists.filter((list) => list.category === activeCategory)
    : activeLists;
  const filteredLists = (
    activeCategory === "Food"
      ? categoryFilteredLists.filter((list) => {
          const matchesPrice = activeFoodPrice ? doesListMatchFoodPrice(list, activeFoodPrice) : true;
          const matchesCuisine =
            activeFoodCuisine === FOOD_CUISINE_ANY
              ? true
              : inferFoodCuisine(list, activeFoodCuisineOptions) === activeFoodCuisine;
          const matchesSubcategory = activeSubcategory ? doesListMatchSubcategory(list, activeSubcategory) : true;
          return matchesPrice && matchesCuisine && matchesSubcategory;
        }).map((list) => filterListStopsByFoodPrice(list, activeFoodPrice))
      : activeCategory === "Nightlife"
        ? categoryFilteredLists.filter((list) => {
            const matchesSubcategory = activeSubcategory ? doesListMatchSubcategory(list, activeSubcategory) : true;
            const matchesBarType =
              activeNightlifeBarType === NIGHTLIFE_BAR_TYPE_ANY
                ? true
                : inferNightlifeBarType(list) === activeNightlifeBarType;
            return matchesSubcategory && matchesBarType;
          })
        : categoryFilteredLists.filter((list) =>
            activeSubcategory ? doesListMatchSubcategory(list, activeSubcategory) : true,
          )
  )
    .slice()
    .sort((left, right) => right.upvotes - left.upvotes || left.title.localeCompare(right.title));
  const railFilteredLists = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    const completedItineraryListIds = new Set(
      itineraryPlaylists
        .map((playlist) => playlist.completedListId)
        .filter((listId): listId is string => Boolean(listId)),
    );
    const playlistLinkedListIds = new Set(itineraryPlaylists.flatMap((playlist) => playlist.listIds));
    const allKnownItineraryListIds = new Set([...completedItineraryListIds, ...playlistLinkedListIds]);
    const eventPattern =
      /\b(event|festival|concert|show|market|fair|parade|match|game|exhibit|exhibition|live music|night market|weekend)\b/i;

    if (activeGuideRail === "r-guides") {
      return filteredLists.filter((list) => list.creator.name.startsWith("R "));
    }
    if (activeGuideRail === "user-guides") {
      return filteredLists.filter(
        (list) =>
          !list.creator.name.startsWith("R ") &&
          list.submissionType !== "journal" &&
          !isItineraryList(list, allKnownItineraryListIds),
      );
    }
    if (activeGuideRail === "favorites") {
      return globalMergedLists.filter((list) => favoriteIds.includes(list.id));
    }
    if (activeGuideRail === "itinerary") {
      const playlistListIds = new Set(
        itineraryPlaylists.flatMap((playlist) => playlist.listIds),
      );
      return globalMergedLists.filter(
        (list) =>
          itineraryIds.includes(list.id) || playlistListIds.has(list.id),
      );
    }
    if (activeGuideRail === "trending") {
      return [...filteredLists]
        .map((list) => {
          const boostedUpvotes = list.upvotes + (votedIds.includes(list.id) ? 1 : 0);
          const createdAt = Date.parse(list.createdAt);
          const ageDays = Number.isFinite(createdAt)
            ? Math.max(0, (now.getTime() - createdAt) / 86400000)
            : 30;
          const freshness = Math.max(0, 10 - Math.min(10, ageDays));
          return { list, score: boostedUpvotes * 2 + freshness };
        })
        .sort((a, b) => b.score - a.score || b.list.upvotes - a.list.upvotes)
        .map((entry) => entry.list);
    }
    if (activeGuideRail === "week-events") {
      return filteredLists.filter((list) => {
        const text = `${list.title} ${list.description} ${list.stops.map((stop) => stop.description).join(" ")}`;
        const createdAt = Date.parse(list.createdAt);
        const isRecent = Number.isFinite(createdAt) && createdAt >= sevenDaysAgo.getTime();
        return eventPattern.test(text) || isRecent;
      });
    }
    return filteredLists;
  }, [activeGuideRail, favoriteIds, filteredLists, globalMergedLists, itineraryIds, itineraryPlaylists, votedIds]);
  const activeCategoryOption = activeCategory
    ? categoryOptions.find((option) => option.category === activeCategory) ?? null
    : null;
  const activeSubcategoryOptions = activeCategory
    ? categorySubcategoriesByScope[subcategoryScope][activeCategory]
    : [];
  const visibleSubcategoryOptions = visibleSubcategoryCategory
    ? categorySubcategoriesByScope[subcategoryScope][visibleSubcategoryCategory]
    : [];
  const categoryTitleLabel = activeCategoryOption?.label ?? hoveredCategoryLabel ?? "Categories";
  const mobileGuideSelectors = [
    { id: "r-guides" as const, label: "R Guides", shortLabel: "R", icon: null },
    { id: "user-guides" as const, label: "User Guides", shortLabel: "User", icon: User },
    { id: "favorites" as const, label: "Favorites", shortLabel: "Fav", icon: Heart },
  ];
  const activeMobileGuideSelector =
    mobileGuideSelectors.find((selector) => selector.id === activeGuideRail) ?? mobileGuideSelectors[0];
  const isMobileCategoryMenuExpanded = isMobileCategoryMenuOpen || isMobileCategoryMenuClosing;
  const openMobileCategoryMenu = () => {
    if (mobileCategoryCloseTimeoutRef.current) {
      clearTimeout(mobileCategoryCloseTimeoutRef.current);
      mobileCategoryCloseTimeoutRef.current = null;
    }
    setIsMobileCategoryMenuClosing(false);
    setIsMobileCategoryMenuOpen(true);
  };
  const closeMobileCategoryMenu = () => {
    if (!isMobileCategoryMenuOpen && !isMobileCategoryMenuClosing) {
      return;
    }
    if (mobileCategoryCloseTimeoutRef.current) {
      clearTimeout(mobileCategoryCloseTimeoutRef.current);
    }
    setIsMobileCategoryMenuOpen(false);
    setIsMobileCategoryMenuClosing(true);
    mobileCategoryCloseTimeoutRef.current = setTimeout(() => {
      setIsMobileCategoryMenuClosing(false);
      mobileCategoryCloseTimeoutRef.current = null;
    }, 260);
  };
  const toggleMobileCategoryMenu = () => {
    if (isMobileCategoryMenuOpen) {
      closeMobileCategoryMenu();
      return;
    }
    openMobileCategoryMenu();
  };
  const getMobileListSheetBounds = () => {
    if (typeof window === "undefined") {
      return { min: 144, max: 504 };
    }
    return {
      min: 144,
      max: Math.round(window.innerHeight * 0.6),
    };
  };
  const handleMobileListSheetDragStart = (event: ReactPointerEvent<HTMLElement>) => {
    if (typeof window === "undefined" || window.innerWidth >= 1024) {
      return;
    }
    const target = event.target as HTMLElement | null;
    const isSheetHandle = Boolean(target?.closest("[data-mobile-sheet-handle]"));
    if (!isSheetHandle && target?.closest("button, a, input, select, textarea")) {
      return;
    }
    const currentHeight = rightPaneRef.current?.getBoundingClientRect().height ?? getMobileListSheetBounds().min;
    mobileListSheetDragStartRef.current = {
      y: event.clientY,
      height: currentHeight,
    };
    mobileListSheetTapCandidateRef.current = true;
    mobileListSheetDraggingRef.current = true;
    setIsMobileListSheetDragging(true);
    setMobileListSheetDragHeight(currentHeight);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handleMobileListSheetDragMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!mobileListSheetDraggingRef.current) {
      return;
    }
    const { min, max } = getMobileListSheetBounds();
    const deltaY = event.clientY - mobileListSheetDragStartRef.current.y;
    if (Math.abs(deltaY) > 6) {
      mobileListSheetTapCandidateRef.current = false;
    }
    const nextHeight = Math.min(max, Math.max(min, mobileListSheetDragStartRef.current.height - deltaY));
    setMobileListSheetDragHeight(nextHeight);
  };
  const handleMobileListSheetDragEnd = (event: ReactPointerEvent<HTMLElement>) => {
    if (!mobileListSheetDraggingRef.current) {
      return;
    }
    const { min, max } = getMobileListSheetBounds();
    const finalHeight = mobileListSheetDragHeight ?? mobileListSheetDragStartRef.current.height;
    if (mobileListSheetTapCandidateRef.current) {
      if (isGuideTakingFullListPane) {
        setExpandedGuideId(null);
        setClosingGuide(null);
        setIsMobileListSheetExpanded(false);
      } else {
        setIsMobileListSheetExpanded((current) => !current);
      }
    } else {
      setIsMobileListSheetExpanded(finalHeight >= min + (max - min) * 0.42);
    }
    mobileListSheetTapCandidateRef.current = false;
    mobileListSheetDraggingRef.current = false;
    setIsMobileListSheetDragging(false);
    setMobileListSheetDragHeight(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };
  const handleCategoryToggle = (category: ListCategory) => {
    const nextCategory = activeCategory === category ? null : category;
    setActiveSubcategory(null);
    setActiveFoodPrice(null);
    setActiveFoodOpenTime("Now");
    setIsFoodOpenTimeMenuOpen(false);
    setActiveFoodCuisine(FOOD_CUISINE_ANY);
    setIsFoodCuisineMenuOpen(false);
    setActiveNightlifeBarType(NIGHTLIFE_BAR_TYPE_ANY);
    setIsNightlifeBarMenuOpen(false);
    closeMobileCategoryMenu();
    setExpandedGuideId(null);
    setClosingGuide(null);
    setActiveCategory(nextCategory);
    const nextPath = getCurrentCityRoutePath(nextCategory);
    if (nextPath) {
      pushExplorerPath(nextPath);
    }
  };
  const explorerPaneHeight = "lg:h-[calc(100svh-7.75rem)]";
  const explorerBodyMaxHeight = "max-h-full lg:max-h-[calc(100svh-13.75rem)]";

  useEffect(() => {
    if (activeCategory) {
      setVisibleSubcategoryCategory(activeCategory);
      setIsSubcategoryClosing(false);
      setIsSubcategoryCollapsing(false);
      return;
    }

    if (!visibleSubcategoryCategory) {
      setIsSubcategoryClosing(false);
      setIsSubcategoryCollapsing(false);
      return;
    }

    setIsSubcategoryClosing(true);
    setIsSubcategoryCollapsing(false);
    const collapseTimeoutId = setTimeout(() => {
      setIsSubcategoryCollapsing(true);
    }, 420);
    const cleanupTimeoutId = setTimeout(() => {
      setVisibleSubcategoryCategory(null);
      setIsSubcategoryClosing(false);
      setIsSubcategoryCollapsing(false);
    }, 820);

    return () => {
      clearTimeout(collapseTimeoutId);
      clearTimeout(cleanupTimeoutId);
    };
  }, [activeCategory, visibleSubcategoryCategory]);

  useEffect(() => {
    return () => {
      if (mobileCategoryCloseTimeoutRef.current) {
        clearTimeout(mobileCategoryCloseTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setHoveredCategoryLabel(null);
    setActiveSubcategory(null);
    setActiveFoodPrice(null);
    setActiveFoodOpenTime("Now");
    setIsFoodOpenTimeMenuOpen(false);
    setActiveFoodCuisine(FOOD_CUISINE_ANY);
    setIsFoodCuisineMenuOpen(false);
    setActiveNightlifeBarType(NIGHTLIFE_BAR_TYPE_ANY);
    setIsNightlifeBarMenuOpen(false);
    setHoveredGuide(null);
    setHoveredStopId(null);
    setVisibleNestedStopParentIds([]);
    setSelectedGuideStopId(null);
    setExpandedGuideId(null);
    setClosingGuide(null);

    if (closingGuideTimeoutRef.current) {
      clearTimeout(closingGuideTimeoutRef.current);
      closingGuideTimeoutRef.current = null;
    }
  }, [selection]);

  useEffect(() => {
    if (activeCategory !== "Food") {
      return;
    }
    if (activeFoodCuisine === FOOD_CUISINE_ANY) {
      return;
    }
    if (!activeFoodCuisineOptions.includes(activeFoodCuisine)) {
      setActiveFoodCuisine(FOOD_CUISINE_ANY);
    }
  }, [activeCategory, activeFoodCuisine, activeFoodCuisineOptions]);

  useEffect(() => {
    if (activeCategory === "Nightlife") {
      return;
    }
    if (activeNightlifeBarType !== NIGHTLIFE_BAR_TYPE_ANY) {
      setActiveNightlifeBarType(NIGHTLIFE_BAR_TYPE_ANY);
    }
    if (isNightlifeBarMenuOpen) {
      setIsNightlifeBarMenuOpen(false);
    }
  }, [activeCategory, activeNightlifeBarType, isNightlifeBarMenuOpen]);

  useEffect(() => {
    setContinentBrowseView("countries");
  }, [selection.continentId]);

  useEffect(() => {
    if (selection.continentId && !selection.countryId) {
      setContinentLabelRevealKey((current) => current + 1);
    }
  }, [selection.continentId, selection.countryId]);

  useEffect(() => {
    if (selection.countryId) {
      setCountryRevealKey((current) => current + 1);
    }
  }, [selection.countryId]);

  useEffect(() => {
    setCountryBrowseView(hasStateHierarchyCountry ? "regions" : "cities");
  }, [hasStateHierarchyCountry, selection.countryId]);

  useEffect(() => {
    setStateBrowseView("cities");
  }, [selection.stateId]);

  useEffect(() => {
    setRegionBrowseView(hasStateHierarchyCountry ? "states" : "cities");
  }, [hasStateHierarchyCountry, selection.countrySubareaId, selection.countryId]);

  useEffect(() => {
    return () => {
      if (closingGuideTimeoutRef.current) {
        clearTimeout(closingGuideTimeoutRef.current);
      }
      if (morphCommitTimeoutRef.current) {
        clearTimeout(morphCommitTimeoutRef.current);
      }
      if (morphCleanupTimeoutRef.current) {
        clearTimeout(morphCleanupTimeoutRef.current);
      }
      if (morphFrameRef.current) {
        cancelAnimationFrame(morphFrameRef.current);
      }
      guideLayoutAnimationFramesRef.current.forEach((frame) => cancelAnimationFrame(frame));
    };
  }, []);

  useEffect(() => {
    if (!expandedGuideId) {
      return;
    }

    const expandedList = railFilteredLists.find((list) => list.id === expandedGuideId);

    if (expandedList) {
      setActiveCategory(expandedList.category);
    }
  }, [expandedGuideId, railFilteredLists]);

  useEffect(() => {
    setExpandedGuideId(null);
    setClosingGuide(null);
  }, [activeGuideRail]);
  useEffect(() => {
    if (!isProfileSubmitLayout) {
      setProfileSubmissionPreviewList(null);
      setProfileMapPinnedLocation(null);
    }
  }, [isProfileSubmitLayout]);

  const expandedGuide =
    railFilteredLists.find((list) => list.id === expandedGuideId) ?? null;
  const displayedGuide = expandedGuide ?? closingGuide;
  const activeMapGuide = isProfileSubmitLayout
    ? profileSubmissionPreviewList
    : isProfileMode
      ? profileExpandedGuide
      : expandedGuide;
  const isGuideTakingFullListPane = Boolean(expandedGuide && activeGuideRail !== "itinerary");
  const isLeftPaneCollapsed = isProfileSubmitLayout || isGuideTakingFullListPane || isProfileGuideTakingFullListPane;
  const isSubcategoryMenuOpen =
    isFoodOpenTimeMenuOpen || isFoodCuisineMenuOpen || isNightlifeBarMenuOpen;
  const remainingGuides = displayedGuide
    ? railFilteredLists.filter((list) => list.id !== displayedGuide.id)
    : railFilteredLists;
  const activeSeoPlaceLabel = activeLocation.city
    ? activeLocation.nestedSubarea?.name ?? activeLocation.subarea?.name ?? activeLocation.city.name
    : activeDirectoryMeta.title;
  const visibleSeoHeading = expandedGuide
    ? `${expandedGuide.title} in ${activeSeoPlaceLabel}`
    : activeCategory && activeLocation.city
      ? activeSeoPlaceLabel
      : seoContent?.h1 ?? activeDirectoryMeta.title;
  const visibleSeoContextLabel =
    !expandedGuide && activeCategory && activeLocation.city
      ? `${activeCategory} in`
      : null;
  const visibleIntroCopy = expandedGuide
    ? expandedGuide.description
    : activeCategory && activeLocation.city
      ? `Explore ${activeCategory.toLowerCase()} guides for ${activeSeoPlaceLabel}, ranked and mapped so you can choose where to go next.`
      : seoContent?.intro ?? activeLocationDescription;
  const categoryIconLookup = useMemo(
    () => new Map(categoryOptions.map((option) => [option.category, option.icon] as const)),
    [],
  );
  useEffect(() => {
    if (!isGuideTakingFullListPane) {
      return;
    }
    setIsFoodOpenTimeMenuOpen(false);
    setIsFoodCuisineMenuOpen(false);
    setIsNightlifeBarMenuOpen(false);
    setHoveredCategoryLabel(null);
    setIsMobileListSheetExpanded(true);
    closeMobileCategoryMenu();
  }, [isGuideTakingFullListPane]);
  const scrollGuideIntoView = (guideId: string) => {
    requestAnimationFrame(() => {
      const element = guideRefs.current[guideId];
      const scroller = element?.closest("[data-guides-scroll]");

      if (!(element instanceof HTMLElement) || !(scroller instanceof HTMLElement)) {
        return;
      }

      const offsetTop = element.offsetTop - scroller.offsetTop;
      scroller.scrollTo({
        top: Math.max(0, offsetTop),
        behavior: "smooth",
      });
    });
  };
  const captureGuideLayoutPositions = () => {
    guideLayoutAnimationFramesRef.current.forEach((frame) => cancelAnimationFrame(frame));
    guideLayoutAnimationFramesRef.current = [];
    guideLayoutPositionsRef.current = Object.fromEntries(
      Object.entries(guideRefs.current)
        .filter((entry): entry is [string, HTMLDivElement] => entry[1] instanceof HTMLDivElement)
        .map(([guideId, element]) => [guideId, element.getBoundingClientRect()]),
    );
    shouldAnimateGuideLayoutRef.current = true;
  };

  useLayoutEffect(() => {
    if (!shouldAnimateGuideLayoutRef.current) {
      return;
    }

    shouldAnimateGuideLayoutRef.current = false;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      guideLayoutPositionsRef.current = {};
      return;
    }

    const changedElements = Object.entries(guideRefs.current).flatMap(([guideId, element]) => {
      const previousRect = guideLayoutPositionsRef.current[guideId];

      if (!(element instanceof HTMLDivElement) || !previousRect) {
        return [];
      }

      const nextRect = element.getBoundingClientRect();
      const deltaX = previousRect.left - nextRect.left;
      const deltaY = previousRect.top - nextRect.top;

      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
        return [];
      }

      element.style.transition = "none";
      element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      element.style.willChange = "transform";

      return [element];
    });

    guideLayoutPositionsRef.current = {};

    if (!changedElements.length) {
      return;
    }

    const animationFrame = requestAnimationFrame(() => {
      changedElements.forEach((element) => {
        element.style.transition = "transform 520ms cubic-bezier(0.22, 1, 0.36, 1)";
        element.style.transform = "translate(0, 0)";
      });

      const cleanupFrame = requestAnimationFrame(() => {
        window.setTimeout(() => {
          changedElements.forEach((element) => {
            element.style.transition = "";
            element.style.transform = "";
            element.style.willChange = "";
          });
        }, 560);
      });

      guideLayoutAnimationFramesRef.current.push(cleanupFrame);
    });

    guideLayoutAnimationFramesRef.current.push(animationFrame);
  });
  const breadcrumbButtonClass =
    "font-medium text-slate-600 transition hover:text-slate-900";
  const showGlobalViewButton = Boolean(
    selection.continentId || continentTitleMorph?.kind === "continent",
  );
  const isGlobalViewActive = !showGlobalViewButton;
  const activeMarginContinent = useMemo(
    () => continents.find((continent) => continent.id === selection.continentId) ?? null,
    [continents, selection.continentId],
  );
  const activeMarginCountry = useMemo(
    () => (activeLocation.country && activeLocation.continent ? activeLocation.country : null),
    [activeLocation.continent, activeLocation.country],
  );
  const activeMarginState = useMemo(
    () => (activeLocation.state && activeLocation.country && activeLocation.continent ? activeLocation.state : null),
    [activeLocation.continent, activeLocation.country, activeLocation.state],
  );
  const focusedLongitude = useMemo(() => {
    if (activeMarginCountry) {
      const [southWest, northEast] = activeMarginCountry.bounds;
      return (southWest[1] + northEast[1]) / 2;
    }
    if (activeMarginContinent) {
      return activeMarginContinent.coordinates[1];
    }
    return 0;
  }, [activeMarginContinent, activeMarginCountry]);
  const globeOrientationRotation = `${(-focusedLongitude / 6).toFixed(1)}deg`;
  const showContinentMarginButton = Boolean(activeMarginContinent);
  const showCountryMarginButton = Boolean(activeMarginCountry && activeLocation.continent);
  const showStateMarginButton = Boolean(activeMarginState && activeMarginCountry && activeLocation.continent);
  const morphPreviewContinent =
    continentTitleMorph?.kind === "continent"
      ? continents.find((continent) => continent.id === continentTitleMorph.id) ?? null
      : null;
  const marginContinent = morphPreviewContinent ?? activeMarginContinent;
  const showContinentMarginIcon = Boolean(marginContinent);

  const marginCountryFlag =
    continentTitleMorph?.kind === "country"
      ? (continentTitleMorph.iconFlag ?? getCountryFlagEmoji(continentTitleMorph.name) ?? null)
      : activeMarginCountry
        ? (getCountryFlagEmoji(activeMarginCountry.name) ?? null)
        : null;
  const marginCountryName =
    continentTitleMorph?.kind === "country" ? continentTitleMorph.name : activeMarginCountry?.name ?? "";
  const showCountryMarginIcon = Boolean(activeLocation.continent && (activeMarginCountry || marginCountryFlag));

  const marginStateId = continentTitleMorph?.kind === "state" ? continentTitleMorph.id : activeMarginState?.id ?? null;
  const marginStateName = continentTitleMorph?.kind === "state" ? continentTitleMorph.name : activeMarginState?.name ?? "";
  const marginStateCountryId = activeMarginCountry?.id;
  const showStateMarginIcon = Boolean(activeLocation.continent && (activeMarginState || marginStateId));
  const marginCityId = continentTitleMorph?.kind === "city" ? continentTitleMorph.id : activeLocation.city?.id ?? null;
  const marginCityName = continentTitleMorph?.kind === "city" ? continentTitleMorph.name : activeLocation.city?.name ?? "";
  const showCityMarginIcon = Boolean(activeLocation.continent && activeLocation.country && marginCityId);
  const activeRailLevel =
    activeLocation.city || continentTitleMorph?.kind === "city"
      ? "city"
      : activeLocation.state || continentTitleMorph?.kind === "state"
        ? "state"
        : activeLocation.country || continentTitleMorph?.kind === "country"
          ? "country"
          : activeLocation.continent || continentTitleMorph?.kind === "continent"
            ? "continent"
            : "global";
  const currentRailIcons = useMemo<Partial<Record<ExitingRailIcon["kind"], ExitingRailIcon>>>(() => ({
    continent: showContinentMarginIcon && marginContinent
      ? { kind: "continent", id: marginContinent.id, name: marginContinent.name }
      : undefined,
    country: showCountryMarginIcon
      ? { kind: "country", name: marginCountryName, flag: marginCountryFlag }
      : undefined,
    state: showStateMarginIcon && marginStateId
      ? { kind: "state", id: marginStateId, name: marginStateName, countryId: marginStateCountryId }
      : undefined,
    city: showCityMarginIcon && marginCityId && activeLocation.continent && activeLocation.country
      ? {
          kind: "city",
          id: marginCityId,
          name: marginCityName,
          continentId: activeLocation.continent.id,
          countryId: activeLocation.country.id,
        }
      : undefined,
  }), [
    activeLocation.continent,
    activeLocation.country,
    marginCityId,
    marginCityName,
    marginContinent,
    marginCountryFlag,
    marginCountryName,
    marginStateCountryId,
    marginStateId,
    marginStateName,
    showCityMarginIcon,
    showContinentMarginIcon,
    showCountryMarginIcon,
    showStateMarginIcon,
  ]);
  useLayoutEffect(() => {
    (["continent", "country", "state", "city"] as const).forEach((kind) => {
      const currentIcon = currentRailIcons[kind];
      const previousIcon = previousRailIconsRef.current[kind];

      if (currentIcon) {
        previousRailIconsRef.current[kind] = currentIcon;
        setExitingRailIcons((current) => {
          if (!current[kind]) {
            return current;
          }
          const next = { ...current };
          delete next[kind];
          return next;
        });
        return;
      }

      if (previousIcon && !exitingRailIcons[kind]) {
        setExitingRailIcons((current) => ({ ...current, [kind]: previousIcon }));
        setTimeout(() => {
          setExitingRailIcons((current) => {
            const next = { ...current };
            delete next[kind];
            return next;
          });
        }, 340);
      }

      previousRailIconsRef.current[kind] = null;
    });
  }, [currentRailIcons, exitingRailIcons]);
  const displayedContinentRailIcon = currentRailIcons.continent ?? exitingRailIcons.continent;
  const displayedCountryRailIcon = currentRailIcons.country ?? exitingRailIcons.country;
  const displayedStateRailIcon = currentRailIcons.state ?? exitingRailIcons.state;
  const displayedCityRailIcon = currentRailIcons.city ?? exitingRailIcons.city;
  const mapSelection =
    isProfileSubmitLayout
      ? profileSubmissionSelection
      : isProfileMode && activeProfileLeftRail === "places-been"
        ? (profilePlacesBeenMapSelection ?? {})
        : selection;
  const handlePlacesBeenFilterSelect = (nextFilter: PlacesBeenFilter) => {
    setActivePlacesBeenFilter(nextFilter);
    setIsAddingPlacesBeenCountry(false);
    setDraftPlacesBeenCountry("");
    setProfilePlacesBeenMapSelection(null);
    setFocusedPlacesBeenStopIds(null);
    setHoveredStopId(null);
    setSelectedGuideStopId(null);
  };
  const handleAddPlacesBeenEntry = () => {
    const rawInput = draftPlacesBeenCountry.trim();
    if (!rawInput) {
      return;
    }

    if (activePlacesBeenFilter === "cities") {
      setManualPlacesBeenCities((current) =>
        current.some((value) => normalizePlacesBeenKey(value) === normalizePlacesBeenKey(rawInput))
          ? current
          : [...current, rawInput],
      );
      setDraftPlacesBeenCountry("");
      return;
    }

    if (activePlacesBeenFilter === "places") {
      setManualPlacesBeenPlaces((current) =>
        current.some((value) => normalizePlacesBeenKey(value) === normalizePlacesBeenKey(rawInput))
          ? current
          : [...current, rawInput],
      );
      setDraftPlacesBeenCountry("");
      return;
    }

    const countryName = resolveKnownCountryName(rawInput);
    if (!countryName) {
      return;
    }

    setManualPlacesBeenCountries((current) =>
      current.some((value) => normalizePlacesBeenKey(value) === normalizePlacesBeenKey(countryName))
        ? current
        : [...current, countryName],
    );
    setDraftPlacesBeenCountry("");
  };
  const handlePlacesBeenCountryToggle = (country: string) => {
    setExpandedPlacesBeenCountries((current) =>
      current.includes(country) ? current.filter((value) => value !== country) : [...current, country],
    );
  };
  const handlePlacesBeenCountryFocus = (country: string) => {
    const countryStopIds = profilePlacesBeenStopIdsByCountry.get(country) ?? [];
    const canonicalCountryName = resolveKnownCountryName(country);
    setProfilePlacesBeenMapSelection(
      canonicalCountryName
        ? countrySelectionLookup.get(normalizePlacesBeenKey(canonicalCountryName)) ?? null
        : null,
    );
    setFocusedPlacesBeenStopIds(countryStopIds.length ? countryStopIds : null);
    const focusId = countryStopIds[0] ?? null;
    setHoveredStopId(focusId);
    setSelectedGuideStopId(focusId);
    if (focusId) {
      setSelectedGuideStopNonce((current) => current + 1);
    }
  };
  const handlePlacesBeenEntryFocus = (entry: PlacesBeenEntry) => {
    const stopId = `places-been-${entry.kind}-${entry.id}`;
    const canonicalCountryName = resolveKnownCountryName(entry.country);
    if (entry.kind === "countries") {
      setProfilePlacesBeenMapSelection(
        canonicalCountryName
          ? countrySelectionLookup.get(normalizePlacesBeenKey(canonicalCountryName)) ?? null
          : null,
      );
    } else if (entry.kind === "cities") {
      setProfilePlacesBeenMapSelection(
        citySelectionLookup.get(
          `${normalizePlacesBeenKey(canonicalCountryName || entry.country)}::${normalizePlacesBeenKey(entry.name)}`,
        ) ?? null,
      );
    } else {
      setProfilePlacesBeenMapSelection(null);
    }
    const hasStop = profilePlacesBeenMapStops.some((stop) => stop.id === stopId);
    if (!hasStop) {
      setFocusedPlacesBeenStopIds(null);
      setHoveredStopId(null);
      setSelectedGuideStopId(null);
      return;
    }
    setFocusedPlacesBeenStopIds([stopId]);
    setHoveredStopId(stopId);
    setSelectedGuideStopId(stopId);
    setSelectedGuideStopNonce((current) => current + 1);
  };
  const handleGuideToggle = (nextList: MapList) => {
    if (closingGuideTimeoutRef.current) {
      clearTimeout(closingGuideTimeoutRef.current);
      closingGuideTimeoutRef.current = null;
    }

    if (expandedGuideId === nextList.id && expandedGuide) {
      setClosingGuide(expandedGuide);
      setExpandedGuideId(null);
      setVisibleNestedStopParentIds([]);
      const nextPath = getCurrentCityRoutePath(nextList.category);
      if (nextPath) {
        pushExplorerPath(nextPath);
      }
      closingGuideTimeoutRef.current = setTimeout(() => {
        setClosingGuide(null);
        closingGuideTimeoutRef.current = null;
      }, 720);
      return;
    }

    captureGuideLayoutPositions();
    setClosingGuide(null);
    setVisibleNestedStopParentIds([]);
    setExpandedGuideId(nextList.id);
    setActiveCategory(nextList.category);
    setActiveGuideFitNonce((current) => current + 1);
    const context = getCityRouteContext(selection);
    if (context) {
      pushExplorerPath(getCanonicalGuidePath(context.city, nextList, context.neighborhood));
    }
    scrollGuideIntoView(nextList.id);
  };
  const handleProfileGuideToggle = (nextList: MapList) => {
    setProfileExpandedGuideId((current) => {
      if (current === nextList.id) {
        setVisibleNestedStopParentIds([]);
        return null;
      }
      setVisibleNestedStopParentIds([]);
      setActiveGuideFitNonce((nonce) => nonce + 1);
      return nextList.id;
    });
  };
  const handleExpandAndOpenSources = (nextList: MapList) => {
    setPendingSourcesOpenGuideId(nextList.id);
    handleGuideToggle(nextList);
  };
  const handleAutoOpenSourcesHandled = (listId: string) => {
    setPendingSourcesOpenGuideId((current) => (current === listId ? null : current));
  };
  const handleOpenItineraryGuide = (list: MapList) => {
    setActiveCategory(null);
    setActiveSubcategory(null);
    if (expandedGuideId !== list.id) {
      handleGuideToggle(list);
      return;
    }
    scrollGuideIntoView(list.id);
  };
  const handleEditItineraryFromGuide = (list: MapList) => {
    if (isProfileMode) {
      if (!currentUser || list.creator.id !== currentUser.id) {
        return;
      }
      setActiveProfileRightRail("itineraries");
      setProfileSubmissionType("guide");
      setProfileGuideSubmissionVariant("itinerary");
      setProfileEditingListId(list.id);
      setIsProfileSubmitting(true);
      return;
    }

    const matchingPlaylist =
      itineraryPlaylists.find((playlist) => playlist.completedListId === list.id) ??
      itineraryPlaylists.find((playlist) => playlist.listIds.includes(list.id)) ??
      null;
    if (matchingPlaylist) {
      setActiveItineraryPlaylistId(matchingPlaylist.id);
    }
    setActiveCategory(null);
    setActiveSubcategory(null);
    setExpandedGuideId(null);
    setClosingGuide(null);
    setIsItineraryEditing(true);
  };
  const handleEditGuideFromProfile = (list: MapList) => {
    if (!currentUser || list.creator.id !== currentUser.id) {
      return;
    }
    const isItineraryGuide = isItineraryList(list, noKnownItineraryIds);
    setActiveProfileRightRail(
      list.submissionType === "journal" ? "experiences" : isItineraryGuide ? "itineraries" : "guides",
    );
    setProfileSubmissionType(list.submissionType ?? "guide");
    setProfileGuideSubmissionVariant(
      list.submissionType === "guide" && isItineraryGuide ? "itinerary" : "guide",
    );
    setProfileEditingListId(list.id);
    setIsProfileSubmitting(true);
  };
  useEffect(() => {
    if (isProfileShellActive && !currentUser) {
      setProfileShellActive(false);
    }
  }, [currentUser, isProfileShellActive, setProfileShellActive]);
  const targetShellMode: "explorer" | "profile" =
    isProfileShellActive && currentUser ? "profile" : "explorer";
  const paneTransitionClass =
    shellTransitionPhase === "exiting"
      ? "pane-content-exit"
      : shellTransitionPhase === "entering"
        ? "pane-content-enter"
        : "";
  const railTransitionClass =
    shellTransitionPhase === "exiting"
      ? "rail-switch-exit"
      : shellTransitionPhase === "entering"
        ? "rail-switch-enter"
        : "";
  const railEnteringMode =
    shellTransitionPhase === "entering" ? displayShellMode : null;
  const profileRailItemStyle = (index: number) =>
    railEnteringMode === "profile"
      ? {
          animation: "rail-switch-pop 700ms cubic-bezier(0.22, 1, 0.36, 1) both",
          animationDelay: `${index * 220}ms`,
        }
      : undefined;
  const explorerRightRailItemStyle = (index: number) =>
    railEnteringMode === "explorer"
      ? {
          animation: "rail-switch-pop 700ms cubic-bezier(0.22, 1, 0.36, 1) both",
          animationDelay: `${index * 140}ms`,
        }
      : undefined;
  const isEnteringProfileShell =
    shellTransitionPhase === "entering" && displayShellMode === "profile";
  useEffect(() => {
    if (displayShellMode === targetShellMode) {
      if (shellTransitionPhase === "entering" || shellTransitionPhase === "exiting") {
        return;
      }
      setShellTransitionPhase("idle");
      return;
    }
    clearShellModeTimeouts();
    setShellTransitionPhase("exiting");
    shellModeTimeoutsRef.current.push(
      setTimeout(() => {
        setDisplayShellMode(targetShellMode);
        setShellTransitionPhase("entering");
      }, 260),
    );
    shellModeTimeoutsRef.current.push(
      setTimeout(() => {
        setShellTransitionPhase("idle");
      }, 1240),
    );
    return clearShellModeTimeouts;
  }, [displayShellMode, targetShellMode]);
  useEffect(() => clearShellModeTimeouts, []);
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setMapResizeSignal((current) => current + 1);
    }, 40);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isProfileMode]);
  useEffect(() => {
    if (isProfileMode && !wasProfileModeRef.current) {
      setProfileIntroNonce((current) => current + 1);
    }
    wasProfileModeRef.current = isProfileMode;
  }, [isProfileMode]);
  useEffect(() => {
    if (isProfileMode) {
      setActiveProfileLeftRail(null);
      setActivePlacesBeenFilter("countries");
      setExpandedPlacesBeenCountries([]);
      setIsAddingPlacesBeenCountry(false);
      setDraftPlacesBeenCountry("");
      setFocusedPlacesBeenStopIds(null);
      setProfilePlacesBeenMapSelection(null);
    }
  }, [isProfileMode]);
  useEffect(() => {
    const previousRail = previousProfileLeftRailRef.current;
    if (activeProfileLeftRail === "places-been" && previousRail !== "places-been") {
      setActivePlacesBeenFilter("countries");
    }
    previousProfileLeftRailRef.current = activeProfileLeftRail;
  }, [activeProfileLeftRail]);
  useEffect(() => {
    if (activeProfileLeftRail !== "places-been") {
      setIsAddingPlacesBeenCountry(false);
      setDraftPlacesBeenCountry("");
      setProfilePlacesBeenMapSelection(null);
      setFocusedPlacesBeenStopIds(null);
      setHoveredStopId(null);
      setSelectedGuideStopId(null);
      return;
    }
    if (activePlacesBeenFilter === "countries") {
      setExpandedPlacesBeenCountries([]);
      return;
    }
    const countryKeys = profilePlacesBeenByCountry.map((group) => group.country);
    setExpandedPlacesBeenCountries((current) => {
      if (!countryKeys.length) {
        return [];
      }
      if (!current.length) {
        return countryKeys;
      }
      const next = current.filter((country) => countryKeys.includes(country));
      if (next.length === current.length && next.every((value, index) => value === current[index])) {
        return current;
      }
      return next.length ? next : countryKeys;
    });
  }, [activePlacesBeenFilter, activeProfileLeftRail, profilePlacesBeenByCountry]);
  useEffect(() => {
    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
    const updateViewportInsets = () => {
      const shell = shellViewportRef.current;
      if (!shell) {
        return;
      }
      const shellRect = shell.getBoundingClientRect();
      if (shellRect.width <= 0) {
        return;
      }
      const viewportRect = mapViewportPanelRef.current?.getBoundingClientRect() ?? null;
      const leftRect = leftPaneRef.current?.getBoundingClientRect() ?? null;
      const rightRect = rightPaneRef.current?.getBoundingClientRect() ?? null;

      const visibleLeft = viewportRect
        ? clamp(viewportRect.left - shellRect.left, 0, shellRect.width)
        : isProfileSubmitLayout
          ? 0
          : leftRect
            ? clamp(Math.min(shellRect.right, leftRect.right) - shellRect.left, 0, shellRect.width)
            : 0;
      const visibleRight = viewportRect
        ? clamp(shellRect.right - viewportRect.right, 0, shellRect.width)
        : rightRect
          ? clamp(shellRect.right - Math.max(shellRect.left, rightRect.left), 0, shellRect.width)
          : 0;
      const visibleBottom =
        shellRect.width < 1024 && rightRect
          ? clamp(shellRect.bottom - Math.max(shellRect.top, rightRect.top), 0, shellRect.height)
          : 10;

      const nextInsets: MapViewportInsets = {
        top: 10,
        right: Math.round(visibleRight),
        bottom: Math.round(visibleBottom),
        left: Math.round(visibleLeft),
      };

      setMapViewportInsets((current) =>
        current.top === nextInsets.top &&
        current.right === nextInsets.right &&
        current.bottom === nextInsets.bottom &&
        current.left === nextInsets.left
          ? current
          : nextInsets,
      );
    };

    updateViewportInsets();
    const rafId = window.requestAnimationFrame(updateViewportInsets);
    const timeoutId = window.setTimeout(updateViewportInsets, 420);
    window.addEventListener("resize", updateViewportInsets, { passive: true });

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => updateViewportInsets());
      if (shellViewportRef.current) {
        observer.observe(shellViewportRef.current);
      }
      if (leftPaneRef.current) {
        observer.observe(leftPaneRef.current);
      }
      if (mapViewportPanelRef.current) {
        observer.observe(mapViewportPanelRef.current);
      }
      if (rightPaneRef.current) {
        observer.observe(rightPaneRef.current);
      }
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
      window.removeEventListener("resize", updateViewportInsets);
      observer?.disconnect();
    };
  }, [displayShellMode, isGuideTakingFullListPane, isMobileListSheetExpanded, isProfileMode, isProfileSubmitLayout]);

  return (
    <section id="map-explorer" className="w-full py-0 lg:pb-0 lg:pt-2">
      <div className="flex w-full flex-col items-stretch gap-2 lg:flex-row lg:items-start lg:gap-0">
        <div className={`z-20 hidden w-full shrink-0 flex-row items-center gap-3 overflow-x-auto px-3 py-1 sm:px-4 lg:flex lg:w-14 lg:translate-x-1 lg:flex-col lg:overflow-visible lg:px-0 lg:py-0 lg:pt-7 ${railTransitionClass}`}>
            {isProfileMode ? (
              <>
                {activeProfileLeftRail === "places-been" && currentUser ? (
                  <div
                    className="rail-switch-item profile-rail-item relative h-10 w-10 animate-[rail-switch-pop_520ms_cubic-bezier(0.22,1,0.36,1)]"
                    style={profileRailItemStyle(0)}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setActiveProfileLeftRail(null);
                        setFocusedPlacesBeenStopIds(null);
                        setHoveredStopId(null);
                        setSelectedGuideStopId(null);
                      }}
                      className="guide-rail-button relative z-10 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200/90 bg-white/95 shadow-sm transition hover:scale-105 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70"
                      aria-label="Back to profile overview"
                      title="Back to profile overview"
                    >
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </button>
                  </div>
                ) : null}
                {profileLeftRailOptions.map((option, index) => (
                  <div
                    key={option.id}
                    className="rail-switch-item profile-rail-item relative h-10 w-10"
                    style={profileRailItemStyle(index + (activeProfileLeftRail === "places-been" && currentUser ? 1 : 0))}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveProfileLeftRail(option.id)}
                      className={`guide-rail-button relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-700 shadow-sm transition hover:scale-105 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 ${
                        activeProfileLeftRail === option.id ? "guide-rail-button-active border-slate-900 text-slate-900" : ""
                      }`}
                      aria-label={option.label}
                      title={option.label}
                    >
                      <option.icon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </>
            ) : (
              <>
              <button
                type="button"
                onClick={handleResetToGlobalView}
                onPointerEnter={() => {
                  const video = globeRailVideoRef.current;
                  if (video) {
                    try {
                      video.currentTime = 0;
                    } catch {}
                    void video.play().catch(() => undefined);
                  }
                }}
                onPointerLeave={() => {
                  globeRailVideoRef.current?.pause();
                }}
                onBlur={() => {
                  globeRailVideoRef.current?.pause();
                }}
                className={`guide-rail-button rail-switch-item margin-shell-pop-in flex h-10 w-10 items-center justify-center rounded-full transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 ${
                  activeRailLevel === "global" ? "guide-rail-button-active" : ""
                }`}
                aria-label={isGlobalViewActive ? "Global view active" : "Return to global view"}
                title={isGlobalViewActive ? "Global view" : "Back to global view"}
              >
                <video
                  ref={globeRailVideoRef}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster="/assets/rotating-earth-still.png"
                  className="h-10 w-10 drop-shadow-[0_2px_4px_rgba(15,23,42,0.35)]"
                >
                  <source src="/assets/rotating-earth.webm" type="video/webm" />
                  <source src="/assets/rotating-earth.mp4" type="video/mp4" />
                </video>
              </button>
            {displayedContinentRailIcon?.kind === "continent" ? (
              <button
                type="button"
                onClick={() => (activeMarginContinent ? handleSelectContinent(activeMarginContinent.id) : undefined)}
                className={`guide-rail-button rail-switch-item ${currentRailIcons.continent ? "margin-shell-pop-in margin-shell-pop-in-delayed" : "margin-shell-pop-out pointer-events-none"} flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 shadow-sm transition hover:scale-105 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 ${
                  activeRailLevel === "continent" ? "guide-rail-button-active" : ""
                }`}
                aria-label={`Back to ${displayedContinentRailIcon.name}`}
                title={`Back to ${displayedContinentRailIcon.name}`}
              >
                <img
                  key={displayedContinentRailIcon.id}
                  src={`/assets/continents/${displayedContinentRailIcon.id}.svg`}
                  alt=""
                  aria-hidden="true"
                  className="h-7 w-auto opacity-85"
                />
              </button>
            ) : null}
            {displayedCountryRailIcon?.kind === "country" ? (
              <button
                type="button"
                onClick={() =>
                  activeMarginCountry
                    ? handleSelectCountry(activeLocation.continent!.id, activeMarginCountry.id)
                    : undefined
                }
                className={`guide-rail-button rail-switch-item ${currentRailIcons.country ? "margin-shell-pop-in" : "margin-shell-pop-out pointer-events-none"} flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 shadow-sm transition hover:scale-105 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 ${
                  activeRailLevel === "country" ? "guide-rail-button-active" : ""
                }`}
                aria-label={`Back to ${displayedCountryRailIcon.name}`}
                title={`Back to ${displayedCountryRailIcon.name}`}
              >
                {displayedCountryRailIcon.flag ? (
                  <span
                    key={displayedCountryRailIcon.name || "country-preview"}
                    className="inline-flex min-w-[1.25rem] items-center justify-center text-xl leading-none"
                  >
                    {displayedCountryRailIcon.flag}
                  </span>
                ) : (
                  <span
                    key={marginCountryName || activeMarginCountry?.id || "country-preview-fallback"}
                    className="inline-flex h-4 w-4 rounded-full bg-slate-300"
                    aria-hidden="true"
                  />
                )}
              </button>
            ) : null}
            {displayedStateRailIcon?.kind === "state" ? (
              <button
                type="button"
                onClick={() =>
                  activeMarginState && activeMarginCountry
                    ? handleSelectState(
                        activeLocation.continent!.id,
                        activeMarginCountry.id,
                        activeMarginState.countrySubareaId,
                        activeMarginState.id,
                      )
                    : undefined
                }
                className={`guide-rail-button rail-switch-item ${currentRailIcons.state ? "margin-shell-pop-in" : "margin-shell-pop-out pointer-events-none"} flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 shadow-sm transition hover:scale-105 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 ${
                  activeRailLevel === "state" ? "guide-rail-button-active" : ""
                }`}
                aria-label={`Back to ${displayedStateRailIcon.name}`}
                title={`Back to ${displayedStateRailIcon.name}`}
              >
                <span key={displayedStateRailIcon.id || "state-preview"} className="inline-flex items-center justify-center">
                  <StateShapeIcon
                    countryId={displayedStateRailIcon.countryId}
                    stateId={displayedStateRailIcon.id}
                    className="h-5 w-6"
                  />
                </span>
              </button>
            ) : null}
            {displayedCityRailIcon?.kind === "city" ? (
              <button
                type="button"
                onClick={() =>
                  displayedCityRailIcon.kind === "city"
                    ? handleSelectCity(displayedCityRailIcon.continentId, displayedCityRailIcon.countryId, displayedCityRailIcon.id)
                    : undefined
                }
                className={`guide-rail-button rail-switch-item ${currentRailIcons.city ? "margin-shell-pop-in" : "margin-shell-pop-out pointer-events-none"} flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-700 shadow-sm transition hover:scale-105 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 ${
                  activeRailLevel === "city" ? "guide-rail-button-active" : ""
                }`}
                aria-label={`Back to ${displayedCityRailIcon.name}`}
                title={`Back to ${displayedCityRailIcon.name}`}
              >
                <Building2 className="h-3.5 w-3.5" />
              </button>
            ) : null}
              </>
            )}
          </div>
        <div className="min-w-0 flex-1">
          <div className="w-full lg:mx-auto lg:max-w-[1600px] lg:px-2">
          <div
            ref={shellViewportRef}
            className={`relative h-[100svh] min-h-[38rem] w-full bg-white lg:min-h-0 lg:rounded-2xl lg:border lg:border-slate-200/80 lg:shadow-sm ${
              isSubcategoryMenuOpen && !isGuideTakingFullListPane ? "overflow-visible" : "overflow-hidden"
            } ${explorerPaneHeight}`}
          >
          <div className="absolute inset-0 z-0">
            <InteractiveMap
              continents={continents}
              selection={mapSelection}
              focusedCountryId={focusedCountrySignal?.countryId ?? null}
              focusedCountryNonce={focusedCountrySignal?.nonce ?? 0}
              highlightedCountryIds={
                isProfileMode &&
                activeProfileLeftRail === "places-been" &&
                activePlacesBeenFilter === "countries"
                  ? profilePlacesBeenCountryIds
                  : undefined
              }
              viewportMode={isProfileSubmitLayout ? "submit" : "center"}
              viewportInsets={mapViewportInsets}
              resizeSignal={mapResizeSignal}
              guideFocus={null}
              activeGuide={activeMapGuide}
              activeGuideFitNonce={activeGuideFitNonce}
              visibleNestedStopParentIds={visibleNestedStopParentIds}
              hoveredStopId={hoveredStopId}
              onHoverGuideStop={setHoveredStopId}
              onSelectGuideStop={(stopId) => {
                setHoveredStopId(stopId);
                setSelectedGuideStopId(stopId);
                setSelectedGuideStopNonce((current) => current + 1);
              }}
              onSubmitMapClick={
                isProfileSubmitLayout
                  ? (coordinates) =>
                      setProfileMapPinnedLocation((current) => ({
                        id: (current?.id ?? 0) + 1,
                        coordinates,
                      }))
                  : undefined
              }
              onSelectContinent={handleSelectContinent}
              onSelectCountry={handleSelectCountry}
              onSelectCity={handleSelectCityFromList}
              onSelectSubarea={handleSelectSubarea}
              onSelectState={handleSelectState}
	            />
	          </div>
			          <div className={`pointer-events-auto absolute left-1/2 top-3 z-[60] w-[min(22rem,calc(100%-7.25rem))] -translate-x-1/2 space-y-2 transition-opacity duration-200 lg:hidden ${
			            isMobileSearchOpen ? "pointer-events-none opacity-0" : "opacity-100"
			          }`}>
		            <div className="grid items-start gap-2">
		              <div className="flex min-w-0 flex-wrap items-start justify-center gap-1.5">
		                <MobileBrowseSelect
		                  label="Select continent"
		                  value={selection.continentId ?? ""}
		                  placeholder="Browse destinations"
		                  forceIconButton
		                  centeredMenu
		                  showPlaceholderOption={false}
		                  options={continents.map((continent) => ({
		                    value: continent.id,
		                    label: continent.name,
		                  }))}
		                  selectedIcon={
		                    selection.continentId ? (
		                      <img
		                        src={`/assets/continents/${selection.continentId}.svg`}
		                        alt=""
		                        aria-hidden="true"
		                        className="h-5 w-auto opacity-85"
		                      />
		                    ) : undefined
		                  }
			                  onChange={(continentId) => {
			                    if (continentId) {
			                      setMobileAllSelection({ country: false, region: false, state: false, city: false, neighborhood: false });
			                      handleSelectContinent(continentId);
		                    } else {
		                      setMobileAllSelection({ country: false, region: false, state: false, city: false, neighborhood: false });
		                      handleResetToGlobalView();
		                    }
		                  }}
	                />

	                {activeLocation.continent ? (
	                  <MobileBrowseSelect
		                    label="Select country"
			                    value={selection.countryId ?? (mobileAllSelection.country ? MOBILE_ALL_COUNTRIES_VALUE : "")}
			                    placeholder="Select country"
			                    showPlaceholderOption={false}
			                    options={[
			                      { value: MOBILE_ALL_COUNTRIES_VALUE, label: "All countries" },
			                      ...activeLocation.continent.countries
		                        .slice()
		                        .sort((left, right) => left.name.localeCompare(right.name))
		                        .map((country) => ({
		                          value: country.id,
			                          label: country.name,
			                        })),
			                    ]}
			                    selectedIcon={
			                      mobileAllSelection.country ? (
			                        <Flag className="h-3.5 w-3.5" />
			                      ) : activeLocation.country ? (
			                        <span className="inline-flex min-w-[1rem] items-center justify-center text-base leading-none">
			                          {getCountryFlagEmoji(activeLocation.country.name) ?? activeLocation.country.name.slice(0, 2)}
			                        </span>
		                      ) : undefined
		                    }
			                    centeredMenu
			                    onChange={(countryId) => {
			                      if (countryId === MOBILE_ALL_COUNTRIES_VALUE) {
			                        setMobileAllSelection({ country: true, region: false, state: false, city: false, neighborhood: false });
			                        handleSelectContinent(activeLocation.continent!.id);
			                      } else if (countryId) {
			                        setMobileAllSelection({ country: false, region: false, state: false, city: false, neighborhood: false });
			                        handleSelectCountry(activeLocation.continent!.id, countryId);
		                      } else {
		                        setMobileAllSelection({ country: false, region: false, state: false, city: false, neighborhood: false });
		                        handleSelectContinent(activeLocation.continent!.id);
		                      }
		                    }}
	                  />
	                ) : null}

	                {activeLocation.country && activeCountrySubareas.length ? (
	                  <MobileBrowseSelect
	                    label="Select region"
		                    value={selection.countrySubareaId ?? (mobileAllSelection.region ? MOBILE_ALL_REGIONS_VALUE : "")}
		                    placeholder="All regions"
		                    showPlaceholderOption={false}
		                    options={[
		                      { value: MOBILE_ALL_REGIONS_VALUE, label: "All regions" },
		                      ...activeCountrySubareas
		                        .slice()
		                        .sort((left, right) => left.name.localeCompare(right.name))
		                        .map((subarea) => ({
		                          value: subarea.id,
			                          label: formatBreadcrumbName(subarea.name),
			                        })),
		                    ]}
			                    selectedIcon={
			                      activeCountrySubarea || mobileAllSelection.region ? <MapIcon className="h-3.5 w-3.5" /> : undefined
			                    }
			                    centeredMenu
			                    onChange={(subareaId) => {
			                      if (subareaId === MOBILE_ALL_REGIONS_VALUE) {
			                        setMobileAllSelection((current) => ({ ...current, region: true, state: false, city: false, neighborhood: false }));
			                        handleSelectCountry(activeLocation.continent!.id, activeLocation.country!.id);
			                      } else if (subareaId) {
			                        setMobileAllSelection((current) => ({ ...current, region: false, state: false, city: false, neighborhood: false }));
			                        handleSelectCountrySubarea(
	                          activeLocation.continent!.id,
	                          activeLocation.country!.id,
	                          subareaId,
	                        );
		                      } else {
		                        setMobileAllSelection((current) => ({ ...current, region: false, state: false, city: false, neighborhood: false }));
		                        handleSelectCountry(activeLocation.continent!.id, activeLocation.country!.id);
		                      }
		                    }}
	                  />
	                ) : null}

	                {activeLocation.country && activeCountryStates.length ? (
	                  <MobileBrowseSelect
	                    label={`Select ${countryStateLabelLower}`}
		                    value={selection.stateId ?? (mobileAllSelection.state ? MOBILE_ALL_STATES_VALUE : "")}
		                    placeholder={`All ${countryStateLabelLower}`}
		                    showPlaceholderOption={false}
		                    options={[
		                      { value: MOBILE_ALL_STATES_VALUE, label: `All ${countryStateLabelLower}` },
		                      ...activeCountryStates
		                        .slice()
		                        .sort((left, right) => left.name.localeCompare(right.name))
		                        .map((state) => ({
		                          value: state.id,
			                          label: formatBreadcrumbName(state.name),
			                        })),
		                    ]}
			                    selectedIcon={
			                      mobileAllSelection.state ? (
			                        <Flag className="h-3.5 w-3.5" />
			                      ) : activeLocation.state ? (
			                        <StateShapeIcon
		                          countryId={activeLocation.country.id}
		                          stateId={activeLocation.state.id}
		                          className="h-4 w-5"
		                        />
		                      ) : undefined
		                    }
			                    centeredMenu
			                    onChange={(stateId) => {
			                      if (stateId === MOBILE_ALL_STATES_VALUE) {
			                        setMobileAllSelection((current) => ({ ...current, state: true, city: false, neighborhood: false }));
			                        if (activeCountrySubarea) {
			                          handleSelectCountrySubarea(
			                            activeLocation.continent!.id,
			                            activeLocation.country!.id,
			                            activeCountrySubarea.id,
			                          );
			                        } else {
			                          handleSelectCountry(activeLocation.continent!.id, activeLocation.country!.id);
			                        }
			                      } else if (stateId) {
			                        setMobileAllSelection((current) => ({ ...current, state: false, city: false, neighborhood: false }));
			                        const state = activeCountryStates.find((item) => item.id === stateId);
	                        if (state) {
	                          handleSelectState(
	                            activeLocation.continent!.id,
	                            activeLocation.country!.id,
	                            state.countrySubareaId,
	                            state.id,
	                          );
	                        }
		                      } else if (activeCountrySubarea) {
		                        setMobileAllSelection((current) => ({ ...current, state: false, city: false, neighborhood: false }));
		                        handleSelectCountrySubarea(
	                          activeLocation.continent!.id,
	                          activeLocation.country!.id,
	                          activeCountrySubarea.id,
	                        );
		                      } else {
		                        setMobileAllSelection((current) => ({ ...current, state: false, city: false, neighborhood: false }));
		                        handleSelectCountry(activeLocation.continent!.id, activeLocation.country!.id);
		                      }
		                    }}
	                  />
	                ) : null}

	                {activeLocation.country && activeCountryCities.length ? (
		                  <MobileBrowseSelect
		                    label="Select city"
			                    value={selection.cityId ?? (mobileAllSelection.city ? MOBILE_ALL_CITIES_VALUE : "")}
			                    placeholder="All cities"
		                    showPlaceholderOption={false}
		                    options={[
		                      { value: MOBILE_ALL_CITIES_VALUE, label: "All cities" },
		                      ...activeCountryCities
		                        .slice()
		                        .sort((left, right) => left.name.localeCompare(right.name))
		                        .map((city) => ({
		                          value: city.id,
			                          label: city.name,
			                        })),
		                    ]}
			                    selectedIcon={activeLocation.city || mobileAllSelection.city ? <Building2 className="h-3.5 w-3.5" /> : undefined}
			                    centeredMenu
			                    onChange={(cityId) => {
			                      if (cityId === MOBILE_ALL_CITIES_VALUE) {
			                        setMobileAllSelection((current) => ({ ...current, city: true, neighborhood: false }));
			                        if (activeLocation.state) {
			                          handleSelectState(
			                            activeLocation.continent!.id,
			                            activeLocation.country!.id,
			                            activeLocation.state.countrySubareaId,
			                            activeLocation.state.id,
			                          );
			                        } else if (activeCountrySubarea) {
			                          handleSelectCountrySubarea(
			                            activeLocation.continent!.id,
			                            activeLocation.country!.id,
			                            activeCountrySubarea.id,
			                          );
			                        } else {
			                          handleSelectCountry(activeLocation.continent!.id, activeLocation.country!.id);
			                        }
			                      } else if (cityId) {
			                        setMobileAllSelection((current) => ({ ...current, city: false, neighborhood: false }));
			                        handleSelectCity(activeLocation.continent!.id, activeLocation.country!.id, cityId);
		                      } else if (activeLocation.state) {
		                        setMobileAllSelection((current) => ({ ...current, city: false, neighborhood: false }));
		                        handleSelectState(
	                          activeLocation.continent!.id,
	                          activeLocation.country!.id,
	                          activeLocation.state.countrySubareaId,
	                          activeLocation.state.id,
	                        );
		                      } else if (activeCountrySubarea) {
		                        setMobileAllSelection((current) => ({ ...current, city: false, neighborhood: false }));
		                        handleSelectCountrySubarea(
	                          activeLocation.continent!.id,
	                          activeLocation.country!.id,
	                          activeCountrySubarea.id,
	                        );
		                      } else {
		                        setMobileAllSelection((current) => ({ ...current, city: false, neighborhood: false }));
		                        handleSelectCountry(activeLocation.continent!.id, activeLocation.country!.id);
		                      }
		                    }}
	                  />
	                ) : null}

	                {activeLocation.city && cityListItems.length ? (
	                  <MobileBrowseSelect
	                    label="Select neighborhood"
		                    value={selection.nestedSubareaId ?? selection.subareaId ?? (mobileAllSelection.neighborhood ? MOBILE_ALL_NEIGHBORHOODS_VALUE : "")}
		                    placeholder="All neighborhoods"
		                    showPlaceholderOption={false}
		                    options={[
		                      { value: MOBILE_ALL_NEIGHBORHOODS_VALUE, label: "All neighborhoods" },
		                      ...cityListItems.map((item) => ({
			                        value: item.id,
			                        label: formatBreadcrumbName(item.name),
			                      })),
		                    ]}
			                    selectedIcon={
			                      selection.nestedSubareaId || selection.subareaId || mobileAllSelection.neighborhood ? (
			                        <MapPin className="h-3.5 w-3.5" />
		                      ) : undefined
		                    }
			                    centeredMenu
			                    onChange={(itemId) => {
			                      if (itemId === MOBILE_ALL_NEIGHBORHOODS_VALUE || !itemId) {
			                        setMobileAllSelection((current) => ({ ...current, neighborhood: true }));
			                        setFocusedCountrySignal(null);
		                        setSelection({
		                          continentId: activeLocation.continent!.id,
		                          countryId: activeLocation.country!.id,
		                          countrySubareaId: activeLocation.city!.countrySubareaId,
		                          stateId: activeLocation.city!.stateId,
		                          cityId: activeLocation.city!.id,
		                        });
		                        return;
			                      }
			                      setMobileAllSelection((current) => ({ ...current, neighborhood: false }));
		                      const item = cityListItems.find((entry) => entry.id === itemId);
	                      if (item?.isNested) {
	                        handleSelectNestedSubarea(
	                          activeLocation.continent!.id,
	                          activeLocation.country!.id,
	                          activeLocation.city!.id,
	                          activeLocation.subarea!.id,
	                          item.id,
	                        );
	                      } else {
	                        handleSelectSubarea(
	                          activeLocation.continent!.id,
	                          activeLocation.country!.id,
	                          activeLocation.city!.id,
	                          itemId,
	                        );
	                      }
	                    }}
	                  />
	                ) : null}
	              </div>

		            </div>
		          </div>
		          <div
            className="pointer-events-none relative z-10 grid h-full grid-rows-[minmax(0,1fr)] gap-0 lg:grid-rows-none lg:[grid-template-columns:var(--shell-cols)]"
            style={
              {
                "--shell-cols": isLeftPaneCollapsed
                  ? "0px minmax(0,1fr) minmax(0,1fr)"
                  : "minmax(280px,0.66fr) minmax(0,1.14fr) minmax(576px,1.2fr)",
              } as React.CSSProperties
            }
          >
            <div
              ref={leftPaneRef}
              className={`pointer-events-auto relative z-30 hidden min-h-0 flex-col overflow-visible bg-slate-100 p-4 transition-[transform,opacity] ease-[cubic-bezier(0.22,1,0.36,1)] lg:z-auto lg:flex lg:h-full lg:overflow-hidden lg:p-5 ${
                isLeftPaneCollapsed
                  ? "duration-[620ms] -translate-x-20 opacity-0 pointer-events-none"
                  : "duration-500 translate-x-0 opacity-100"
              } ${explorerPaneHeight} ${
                isLeftPaneCollapsed ? "max-h-0 !min-h-0 p-0 lg:max-h-none lg:p-5" : ""
              }`}
            >
              <div className={`left-pane-content flex h-full min-h-0 flex-col ${paneTransitionClass}`}>
              {continentTitleMorph ? (
                <div
                  className="pointer-events-none absolute z-30 overflow-hidden opacity-100"
                  style={(() => {
                    const growTop =
                      continentTitleMorph.fromTop +
                      (continentTitleMorph.fromHeight - continentTitleMorph.toHeight);
                    const stage = continentTitleMorph.animate ? morphStage : "idle";
                    const top =
                      stage === "grow"
                        ? growTop
                        : stage === "left"
                          ? growTop
                          : stage === "settle"
                            ? growTop
                          : stage === "up"
                            ? continentTitleMorph.toTop
                            : continentTitleMorph.fromTop;
                    const left =
                      stage === "left" || stage === "settle" || stage === "up"
                        ? continentTitleMorph.toLeft
                        : continentTitleMorph.fromLeft;
                    const width = continentTitleMorph.toWidth;
                    const height = continentTitleMorph.toHeight;
                    const transition =
                      stage === "grow"
                        ? `top ${MORPH_GROW_MS}ms cubic-bezier(0.22,0.61,0.36,1)`
                        : stage === "left"
                          ? `left ${MORPH_LEFT_MS}ms cubic-bezier(0.22,0.61,0.36,1)`
                          : stage === "settle"
                            ? "none"
                          : stage === "up"
                            ? `top ${MORPH_UP_MS}ms cubic-bezier(0.34,1.34,0.64,1)`
                            : "none";

                    return {
                      top,
                      left,
                      width,
                      height,
                      transition,
                      transformOrigin: "left bottom",
                    };
                  })()}
                >
                  <div className="flex h-full min-w-0 items-start">
                    {(() => {
                      const stage = continentTitleMorph.animate ? morphStage : "idle";
                      const fromScale =
                        continentTitleMorph.toFontSize > 0
                          ? continentTitleMorph.fromFontSize / continentTitleMorph.toFontSize
                          : 1;
                      const scale = stage === "idle" ? fromScale : 1;
                      return (
                    <p
                      className="inline-block max-w-full whitespace-nowrap font-semibold text-slate-900"
                      style={{
                        fontSize: `${continentTitleMorph.toFontSize}px`,
                        lineHeight: "1.15",
                        transform: `scale(${scale})`,
                        transformOrigin: "left bottom",
                        willChange: stage === "grow" ? "transform" : "auto",
                        transition:
                          stage === "grow"
                            ? `transform ${MORPH_GROW_MS}ms cubic-bezier(0.22,0.61,0.36,1)`
                            : "none",
                      }}
                    >
                      {continentTitleMorph.name}
                    </p>
                      );
                    })()}
                  </div>
                </div>
              ) : null}
              <div
                className={`shrink-0 pb-4 transition-opacity duration-150 ${
                  isStateMorphing ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
              >
                <div>
                  <div
                    key={
                      isCountryRootSelection && !continentTitleMorph
                        ? `country-header-${selection.countryId}-${countryRevealKey}`
                        : "header-default"
                    }
                    className={`min-w-0 ${continentTitleMorph ? "invisible" : "visible"}`}
                    aria-hidden={continentTitleMorph ? "true" : "false"}
                  >
                    {visibleSeoContextLabel ? (
                      <p className="mb-1 text-sm font-medium text-slate-600">
                        {visibleSeoContextLabel}
                      </p>
                    ) : null}
                    <h1
                      ref={titleRef}
                      className="text-2xl font-semibold text-slate-900"
                    >
                      <span ref={titleTextRef} className="inline-block">
                        {visibleSeoHeading}
                      </span>
                    </h1>
                    <div
                      ref={detailRef}
                      className="mt-1 text-sm text-slate-600 transition-all duration-300"
                      style={{
                        opacity: postMorphRevealPhase >= 1 ? 1 : 0,
                        transform:
                          postMorphRevealPhase >= 1
                            ? "translateY(0px)"
                            : "translateY(-6px)",
                      }}
                    >
                      {!activeLocation.city && activeLocation.state && activeLocation.country && activeLocation.continent ? (
                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                          {activeCountrySubarea ? (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  handleSelectCountrySubarea(
                                    activeLocation.continent!.id,
                                    activeLocation.country!.id,
                                    activeCountrySubarea.id,
                                  )
                                }
                                className={breadcrumbButtonClass}
                              >
                                {formatBreadcrumbName(activeCountrySubarea.name)}
                              </button>
                              <span className="text-slate-400">,</span>
                            </>
                          ) : null}
                          <button
                            type="button"
                            onClick={() =>
                              handleSelectCountry(activeLocation.continent!.id, activeLocation.country!.id)
                            }
                            className={breadcrumbButtonClass}
                          >
                            {activeLocation.country.name}
                          </button>
                        </div>
                      ) : !activeLocation.city && activeCountrySubarea && activeLocation.country && activeLocation.continent ? (
                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleSelectCountry(activeLocation.continent!.id, activeLocation.country!.id)
                            }
                            className={breadcrumbButtonClass}
                          >
                            {activeLocation.country.name}
                          </button>
                        </div>
                      ) : activeLocation.nestedSubarea && activeLocation.subarea && activeLocation.city && activeLocation.country && activeLocation.continent ? (
                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                          <button
                            type="button"
                            onClick={(event) =>
                              handleSelectCityFromList(
                                activeLocation.continent!.id,
                                activeLocation.country!.id,
                                activeLocation.city!.id,
                                event.currentTarget,
                              )
                            }
                            className={breadcrumbButtonClass}
                          >
                            <span data-morph-origin="label" className="inline-block">
                              {activeLocation.city.name}
                            </span>
                          </button>
                          {activeLocation.state ? (
                            <>
                              <span className="text-slate-400">,</span>
                              <button
                                type="button"
                                onClick={(event) =>
                                  handleSelectStateFromCountryList(
                                    activeLocation.continent!.id,
                                    activeLocation.country!.id,
                                    activeLocation.state!.countrySubareaId,
                                    activeLocation.state!.id,
                                    event.currentTarget,
                                  )
                                }
                                className={breadcrumbButtonClass}
                              >
                                <span data-morph-origin="label" className="inline-block">
                                  {activeLocation.state.name}
                                </span>
                              </button>
                            </>
                          ) : null}
                          {activeCountrySubarea ? (
                            <>
                              <span className="text-slate-400">,</span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleSelectCountrySubarea(
                                    activeLocation.continent!.id,
                                    activeLocation.country!.id,
                                    activeCountrySubarea.id,
                                  )
                                }
                                className={breadcrumbButtonClass}
                              >
                                {formatBreadcrumbName(activeCountrySubarea.name)}
                              </button>
                            </>
                          ) : null}
                          <span className="text-slate-400">,</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleSelectCountry(activeLocation.continent!.id, activeLocation.country!.id)
                            }
                            className={breadcrumbButtonClass}
                          >
                            {activeLocation.country.name}
                          </button>
                        </div>
                      ) : activeLocation.subarea && activeLocation.city && activeLocation.country && activeLocation.continent ? (
                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                          <button
                            type="button"
                            onClick={(event) =>
                              handleSelectCityFromList(
                                activeLocation.continent!.id,
                                activeLocation.country!.id,
                                activeLocation.city!.id,
                                event.currentTarget,
                              )
                            }
                            className={breadcrumbButtonClass}
                          >
                            <span data-morph-origin="label" className="inline-block">
                              {activeLocation.city.name}
                            </span>
                          </button>
                          {activeLocation.state ? (
                            <>
                              <span className="text-slate-400">,</span>
                              <button
                                type="button"
                                onClick={(event) =>
                                  handleSelectStateFromCountryList(
                                    activeLocation.continent!.id,
                                    activeLocation.country!.id,
                                    activeLocation.state!.countrySubareaId,
                                    activeLocation.state!.id,
                                    event.currentTarget,
                                  )
                                }
                                className={breadcrumbButtonClass}
                              >
                                <span data-morph-origin="label" className="inline-block">
                                  {activeLocation.state.name}
                                </span>
                              </button>
                            </>
                          ) : null}
                          {activeCountrySubarea ? (
                            <>
                              <span className="text-slate-400">,</span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleSelectCountrySubarea(
                                    activeLocation.continent!.id,
                                    activeLocation.country!.id,
                                    activeCountrySubarea.id,
                                  )
                                }
                                className={breadcrumbButtonClass}
                              >
                                {formatBreadcrumbName(activeCountrySubarea.name)}
                              </button>
                            </>
                          ) : null}
                          <span className="text-slate-400">,</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleSelectCountry(activeLocation.continent!.id, activeLocation.country!.id)
                            }
                            className={breadcrumbButtonClass}
                          >
                            {activeLocation.country.name}
                          </button>
                        </div>
                      ) : activeLocation.city && activeLocation.country && activeLocation.continent ? (
                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                          {activeLocation.state ? (
                            <button
                              type="button"
                              onClick={(event) =>
                                handleSelectStateFromCountryList(
                                  activeLocation.continent!.id,
                                  activeLocation.country!.id,
                                  activeLocation.state!.countrySubareaId,
                                  activeLocation.state!.id,
                                  event.currentTarget,
                                )
                              }
                              className={breadcrumbButtonClass}
                            >
                              <span data-morph-origin="label" className="inline-block">
                                {formatBreadcrumbName(activeLocation.state.name)}
                              </span>
                            </button>
                          ) : null}
                          {activeCountrySubarea ? (
                            <>
                              {activeLocation.state ? (
                                <span className="text-slate-400">,</span>
                              ) : null}
                              <button
                                type="button"
                                onClick={() =>
                                  handleSelectCountrySubarea(
                                    activeLocation.continent!.id,
                                    activeLocation.country!.id,
                                    activeCountrySubarea.id,
                                  )
                                }
                                className={breadcrumbButtonClass}
                              >
                                {formatBreadcrumbName(activeCountrySubarea.name)}
                              </button>
                            </>
                          ) : null}
                          {(activeLocation.state || activeCountrySubarea) ? (
                            <span className="text-slate-400">,</span>
                          ) : null}
                          <button
                            type="button"
                            onClick={() =>
                              handleSelectCountry(activeLocation.continent!.id, activeLocation.country!.id)
                            }
                            className={breadcrumbButtonClass}
                          >
                            {activeLocation.country.name}
                          </button>
                        </div>
                      ) : activeLocation.country && activeLocation.continent ? (
                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                          <button
                            type="button"
                            onClick={() => handleSelectContinent(activeLocation.continent!.id)}
                            className={breadcrumbButtonClass}
                          >
                            {activeLocation.continent.name}
                          </button>
                          <span className="text-slate-400">,</span>
                          <span>{formatBreadcrumbName(activeDirectoryMeta.detail)}</span>
                        </div>
                      ) : (
                        <p>{formatBreadcrumbName(activeDirectoryMeta.detail)}</p>
                      )}
                    </div>
                    {activeLocation.city || visibleIntroCopy ? (
                      <div
                        className={`mt-2 transition-all duration-300 ${activeLocation.city ? "min-h-[3.75rem]" : ""}`}
                        style={{
                          opacity: postMorphRevealPhase >= 2 ? 1 : 0,
                          transform:
                            postMorphRevealPhase >= 2
                              ? "translateY(0px)"
                              : "translateY(-8px)",
                        }}
                      >
                        {visibleIntroCopy ? (
                          <p className="ml-3 border-l border-slate-200 pl-3 text-sm leading-5 text-slate-600">
                            {visibleIntroCopy}
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
                {activeLocation.country &&
                hasDirectoryChips &&
                !isCountryRootSelection &&
                !isCitySelection &&
                !isStateSelection &&
                !isRegionSelection ? (
                  <div
                    className="mt-4 hidden transition-all duration-300 lg:block"
                    style={{
                      opacity: postMorphRevealPhase >= 3 ? 1 : 0,
                      transform:
                        postMorphRevealPhase >= 3
                          ? "translateY(0px)"
                          : "translateY(-10px)",
                    }}
                  >
                    {showCountryFilterToggle ? (
                      <div className="mb-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCountryBrowseView("cities")}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                            countryBrowseView === "cities"
                              ? "bg-slate-900 text-white"
                              : "bg-stone-100 text-slate-700 hover:bg-stone-200"
                          }`}
                        >
                          Cities
                        </button>
                        <button
                          type="button"
                          onClick={() => setCountryBrowseView("regions")}
                          disabled={!activeCountrySubareas.length}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                            countryBrowseView === "regions"
                              ? "bg-slate-900 text-white"
                              : "bg-stone-100 text-slate-700 hover:bg-stone-200"
                          } ${activeCountrySubareas.length ? "" : "cursor-not-allowed opacity-50"}`}
                        >
                          Regions
                        </button>
                      </div>
                    ) : null}
                    <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                      {cityUsesNestedDistricts && activeLocation.city && activeNestedCitySubareas.length
                        ? "Neighborhoods"
                        : activeLocation.city && activeCitySubareas.length
                          ? cityUsesNestedDistricts
                            ? "Boroughs"
                            : "Neighborhoods"
                        : showCountryFilterToggle
                          ? displayCountryRegions
                            ? "Regions"
                            : "Cities"
                        : showCountrySubareas
                          ? "Regions"
                        : showCountryStates
                            ? countryStateLabel
                          : activeLocation.state
                            ? "Cities"
                          : "Cities"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                    {cityUsesNestedDistricts && activeLocation.city && activeNestedCitySubareas.length
                      ? activeNestedCitySubareas.map((nestedSubarea) => (
                          <button
                            key={nestedSubarea.id}
                            type="button"
                            onClick={() =>
                              handleSelectNestedSubarea(
                                activeLocation.continent!.id,
                                activeLocation.country!.id,
                                activeLocation.city!.id,
                                activeLocation.subarea!.id,
                                nestedSubarea.id,
                              )
                            }
                            className={`rounded-full px-3 py-1.5 text-sm transition ${
                              selection.nestedSubareaId === nestedSubarea.id
                                ? "bg-orange-50 text-orange-700"
                                : "bg-stone-100 text-slate-700 hover:bg-stone-200"
                            }`}
                          >
                            {nestedSubarea.name}
                          </button>
                        ))
                      : activeLocation.city && activeCitySubareas.length
                        ? activeCitySubareas.map((subarea) => (
                          <button
                            key={subarea.id}
                            type="button"
                            title={subarea.name}
                            onClick={() =>
                              handleSelectSubarea(
                                activeLocation.continent!.id,
                                activeLocation.country!.id,
                                activeLocation.city!.id,
                                subarea.id,
                              )
                            }
                            className={`rounded-full px-3 py-1.5 text-sm transition ${
                              selection.subareaId === subarea.id
                                ? "bg-orange-50 text-orange-700"
                                : "bg-stone-100 text-slate-700 hover:bg-stone-200"
                            }`}
                          >
                            {formatBreadcrumbName(subarea.name)}
                          </button>
                        ))
                      : showCountryFilterToggle && displayCountryRegions
                        ? activeCountrySubareas.map((subarea) => (
                            <button
                              key={subarea.id}
                              type="button"
                              title={subarea.name}
                              onClick={() =>
                                handleSelectCountrySubarea(
                                  activeLocation.continent!.id,
                                  activeLocation.country!.id,
                                  subarea.id,
                                )
                              }
                              className={`rounded-full px-3 py-1.5 text-sm transition ${
                                selection.subareaId === subarea.id
                                  ? "bg-orange-50 text-orange-700"
                                  : "bg-stone-100 text-slate-700 hover:bg-stone-200"
                              }`}
                            >
                              {formatBreadcrumbName(subarea.name)}
                            </button>
                          ))
                      : showCountryFilterToggle
                        ? activeCountryCities.map((city) => (
                            <button
                              key={city.id}
                              type="button"
                              onClick={(event) =>
                                handleSelectCityFromList(
                                  activeLocation.continent!.id,
                                  activeLocation.country!.id,
                                  city.id,
                                  event.currentTarget,
                                )
                              }
                            className={`rounded-full px-3 py-1.5 text-sm transition ${
                                selection.cityId === city.id
                                  ? "bg-orange-50 text-orange-700"
                                  : "bg-stone-100 text-slate-700 hover:bg-stone-200"
                              }`}
                            >
                              <span data-morph-origin="label" className="inline-block">
                                {city.name}
                              </span>
                            </button>
                          ))
                      : showCountrySubareas
                        ? activeCountrySubareas.map((subarea) => (
                            <button
                              key={subarea.id}
                              type="button"
                              title={subarea.name}
                              onClick={() =>
                                handleSelectCountrySubarea(
                                  activeLocation.continent!.id,
                                  activeLocation.country!.id,
                                  subarea.id,
                                )
                              }
                              className={`rounded-full px-3 py-1.5 text-sm transition ${
                                selection.subareaId === subarea.id
                                  ? "bg-orange-50 text-orange-700"
                                  : "bg-stone-100 text-slate-700 hover:bg-stone-200"
                              }`}
                            >
                              {formatBreadcrumbName(subarea.name)}
                            </button>
                          ))
                      : showCountryStates
                        ? activeCountryStates.map((state) => (
                            <button
                              key={state.id}
                              type="button"
                              onClick={(event) =>
                                handleSelectStateFromCountryList(
                                  activeLocation.continent!.id,
                                  activeLocation.country!.id,
                                  state.countrySubareaId,
                                  state.id,
                                  event.currentTarget,
                                )
                              }
                              className={`rounded-full px-3 py-1.5 text-sm transition ${
                                selection.stateId === state.id
                                  ? "bg-orange-50 text-orange-700"
                                  : "bg-stone-100 text-slate-700 hover:bg-stone-200"
                              }`}
                            >
                              <span data-morph-origin="label" className="inline-block">
                                {state.name}
                              </span>
                            </button>
                          ))
                      : activeCountryCities.map((city) => (
                          <button
                            key={city.id}
                            type="button"
                            onClick={(event) =>
                              handleSelectCityFromList(
                                activeLocation.continent!.id,
                                activeLocation.country!.id,
                                city.id,
                                event.currentTarget,
                              )
                            }
                            className={`rounded-full px-3 py-1.5 text-sm transition ${
                              selection.cityId === city.id
                                ? "bg-orange-50 text-orange-700"
                                : "bg-stone-100 text-slate-700 hover:bg-stone-200"
                            }`}
                          >
                            <span data-morph-origin="label" className="inline-block">
                              {city.name}
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>
                ) : null}
                <div
                  className="mt-3 space-y-1.5 lg:hidden"
                  style={{
                    opacity: postMorphRevealPhase >= 3 ? 1 : 0,
                    transform: postMorphRevealPhase >= 3 ? "translateY(0px)" : "translateY(-10px)",
                    transition: "opacity 300ms ease, transform 300ms ease",
                  }}
                >
                  <MobileBrowseSelect
                    label="Select continent"
                    value={selection.continentId ?? ""}
                    placeholder="Browse destinations"
                    options={continents.map((continent) => ({
                      value: continent.id,
                      label: continent.name,
                    }))}
                    onChange={(continentId) => {
                      if (continentId) {
                        handleSelectContinent(continentId);
                      } else {
                        handleResetToGlobalView();
                      }
                    }}
                  />

                  {activeLocation.continent ? (
                    <MobileBrowseSelect
                      label="Select country"
                      value={selection.countryId ?? ""}
                      placeholder="Select country"
                      options={activeLocation.continent.countries
                        .slice()
                        .sort((left, right) => left.name.localeCompare(right.name))
                        .map((country) => ({
                          value: country.id,
                          label: country.name,
                        }))}
                      onChange={(countryId) => {
                        if (countryId) {
                          handleSelectCountry(activeLocation.continent!.id, countryId);
                        } else {
                          handleSelectContinent(activeLocation.continent!.id);
                        }
                      }}
                    />
                  ) : null}

                  {activeLocation.country && activeCountrySubareas.length ? (
                    <MobileBrowseSelect
                      label="Select region"
                      value={selection.countrySubareaId ?? ""}
                      placeholder="All regions"
                      options={activeCountrySubareas
                        .slice()
                        .sort((left, right) => left.name.localeCompare(right.name))
                        .map((subarea) => ({
                          value: subarea.id,
                          label: formatBreadcrumbName(subarea.name),
                        }))}
                      onChange={(subareaId) => {
                        if (subareaId) {
                          handleSelectCountrySubarea(
                            activeLocation.continent!.id,
                            activeLocation.country!.id,
                            subareaId,
                          );
                        } else {
                          handleSelectCountry(activeLocation.continent!.id, activeLocation.country!.id);
                        }
                      }}
                    />
                  ) : null}

                  {activeLocation.country && activeCountryStates.length ? (
                    <MobileBrowseSelect
                      label={`Select ${countryStateLabelLower}`}
                      value={selection.stateId ?? ""}
                      placeholder={`All ${countryStateLabelLower}`}
                      options={activeCountryStates
                        .slice()
                        .sort((left, right) => left.name.localeCompare(right.name))
                        .map((state) => ({
                          value: state.id,
                          label: formatBreadcrumbName(state.name),
                        }))}
                      onChange={(stateId) => {
                        if (stateId) {
                          const state = activeCountryStates.find((item) => item.id === stateId);
                          if (state) {
                            handleSelectState(
                              activeLocation.continent!.id,
                              activeLocation.country!.id,
                              state.countrySubareaId,
                              state.id,
                            );
                          }
                        } else if (activeCountrySubarea) {
                          handleSelectCountrySubarea(
                            activeLocation.continent!.id,
                            activeLocation.country!.id,
                            activeCountrySubarea.id,
                          );
                        } else {
                          handleSelectCountry(activeLocation.continent!.id, activeLocation.country!.id);
                        }
                      }}
                    />
                  ) : null}

                  {activeLocation.country && activeCountryCities.length ? (
                    <MobileBrowseSelect
                      label="Select city"
                      value={selection.cityId ?? ""}
                      placeholder="Select city"
                      options={activeCountryCities
                        .slice()
                        .sort((left, right) => left.name.localeCompare(right.name))
                        .map((city) => ({
                          value: city.id,
                          label: city.name,
                        }))}
                      onChange={(cityId) => {
                        if (cityId) {
                          handleSelectCity(activeLocation.continent!.id, activeLocation.country!.id, cityId);
                        } else if (activeLocation.state) {
                          handleSelectState(
                            activeLocation.continent!.id,
                            activeLocation.country!.id,
                            activeLocation.state.countrySubareaId,
                            activeLocation.state.id,
                          );
                        } else if (activeCountrySubarea) {
                          handleSelectCountrySubarea(
                            activeLocation.continent!.id,
                            activeLocation.country!.id,
                            activeCountrySubarea.id,
                          );
                        } else {
                          handleSelectCountry(activeLocation.continent!.id, activeLocation.country!.id);
                        }
                      }}
                    />
                  ) : null}

                  {activeLocation.city && cityListItems.length ? (
                    <MobileBrowseSelect
                      label="Select neighborhood"
                      value={selection.nestedSubareaId ?? selection.subareaId ?? ""}
                      placeholder="All neighborhoods"
                      options={cityListItems.map((item) => ({
                        value: item.id,
                        label: formatBreadcrumbName(item.name),
                      }))}
                      onChange={(itemId) => {
                        if (!itemId) {
                          handleSelectCity(
                            activeLocation.continent!.id,
                            activeLocation.country!.id,
                            activeLocation.city!.id,
                          );
                          return;
                        }
                        const item = cityListItems.find((entry) => entry.id === itemId);
                        if (item?.isNested) {
                          handleSelectNestedSubarea(
                            activeLocation.continent!.id,
                            activeLocation.country!.id,
                            activeLocation.city!.id,
                            activeLocation.subarea!.id,
                            item.id,
                          );
                        } else {
                          handleSelectSubarea(
                            activeLocation.continent!.id,
                            activeLocation.country!.id,
                            activeLocation.city!.id,
                            itemId,
                          );
                        }
                      }}
                    />
                  ) : null}
                </div>
              </div>
              <div
                data-directory-scroll
                className={`mt-2 hidden min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 transition-opacity duration-150 lg:block ${
                  isStateMorphing ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
                style={{
                  opacity: (postMorphRevealPhase >= 3 ? 1 : 0) * (isStateMorphing ? 0 : 1),
                  transform:
                    postMorphRevealPhase >= 3
                      ? "translateY(0px)"
                      : "translateY(-10px)",
                  transition: "opacity 300ms ease, transform 300ms ease",
                  pointerEvents: postMorphRevealPhase >= 3 && !isStateMorphing ? "auto" : "none",
                }}
              >
                {isCitySelection ? (
                  <div className="flex h-full min-h-0 flex-col">
                    <div className="mb-2 shrink-0 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-700">
                        {cityUsesNestedDistricts && activeLocation.subarea && activeNestedCitySubareas.length
                          ? "Neighborhoods"
                          : cityUsesNestedDistricts
                            ? "Boroughs"
                            : "Neighborhoods"}
                      </p>
                      <div className="h-8" aria-hidden="true" />
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto">
                      {cityListItems.length ? (
                        <div className="space-y-2">
                          {cityListItems.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              title={item.name}
                              className={`flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm transition ${
                                (item.isNested ? selection.nestedSubareaId : selection.subareaId) === item.id
                                  ? "bg-orange-50 text-orange-700"
                                  : "text-slate-700 hover:bg-stone-100"
                              }`}
                              onClick={() =>
                                item.isNested
                                  ? handleSelectNestedSubarea(
                                      activeLocation.continent!.id,
                                      activeLocation.country!.id,
                                      activeLocation.city!.id,
                                      activeLocation.subarea!.id,
                                      item.id,
                                    )
                                  : handleSelectSubarea(
                                      activeLocation.continent!.id,
                                      activeLocation.country!.id,
                                      activeLocation.city!.id,
                                      item.id,
                                    )
                              }
                            >
                              <MapPin className="h-4 w-4" />
                                {formatBreadcrumbName(item.name)}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="px-3 py-2 text-sm text-slate-500">No neighborhoods available yet.</p>
                      )}
                    </div>
                  </div>
                ) : isRegionSelection ? (
                  <div className="flex h-full min-h-0 flex-col">
                    <div className="mb-2 shrink-0 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-700">
                        {regionBrowseView === "states" ? countryStateLabel : "Cities"}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setRegionBrowseView("cities")}
                          className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                            regionBrowseView === "cities"
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                          }`}
                          aria-label="Show cities"
                        >
                          <Building2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setRegionBrowseView("states")}
                          disabled={!activeCountryStates.length}
                          className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                            regionBrowseView === "states"
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                          } ${activeCountryStates.length ? "" : "cursor-not-allowed opacity-50"}`}
                          aria-label={`Show ${countryStateLabelLower}`}
                        >
                          <Flag className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto space-y-2">
                      {regionBrowseView === "states"
                        ? activeCountryStates
                            .slice()
                            .sort((left, right) => left.name.localeCompare(right.name))
                            .map((state) => (
                              <button
                                key={state.id}
                                type="button"
                                className={`flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm transition ${
                                  selection.stateId === state.id
                                    ? "bg-orange-50 text-orange-700"
                                    : "text-slate-700 hover:bg-stone-100"
                                }`}
                                onClick={(event) =>
                                  handleSelectStateFromCountryList(
                                    activeLocation.continent!.id,
                                    activeLocation.country!.id,
                                    state.countrySubareaId,
                                    state.id,
                                    event.currentTarget,
                                  )
                                }
                              >
                                <StateShapeIcon
                                  countryId={activeLocation.country!.id}
                                  stateId={state.id}
                                />
                                <span data-morph-origin="label" className="inline-block">
                                  {state.name}
                                </span>
                              </button>
                            ))
                        : activeCountryCities
                            .slice()
                            .sort((left, right) => left.name.localeCompare(right.name))
                            .map((city) => (
                              <button
                                key={city.id}
                                type="button"
                                className={`flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm transition ${
                                  selection.cityId === city.id
                                    ? "bg-orange-50 text-orange-700"
                                    : "text-slate-700 hover:bg-stone-100"
                                }`}
                                onClick={(event) =>
                                  handleSelectCityFromList(
                                    activeLocation.continent!.id,
                                    activeLocation.country!.id,
                                    city.id,
                                    event.currentTarget,
                                  )
                                }
                              >
                                <MapPin className="h-4 w-4" />
                                <span data-morph-origin="label" className="inline-block">
                                  {city.name}
                                </span>
                              </button>
                            ))}
                    </div>
                  </div>
                ) : isStateSelection ? (
                  <div className="flex h-full min-h-0 flex-col">
                    <div className="mb-2 shrink-0 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-700">
                        {stateBrowseView === "regions" ? "Regions" : "Cities"}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setStateBrowseView("cities")}
                          className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                            stateBrowseView === "cities"
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                          }`}
                          aria-label="Show cities"
                        >
                          <Building2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setStateBrowseView("regions")}
                          disabled={!activeCountrySubareas.length}
                          className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                            stateBrowseView === "regions"
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                          } ${activeCountrySubareas.length ? "" : "cursor-not-allowed opacity-50"}`}
                          aria-label="Show regions"
                        >
                          <MapIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto space-y-2">
                      {stateBrowseView === "regions"
                        ? activeCountrySubareas
                            .slice()
                            .sort((left, right) => left.name.localeCompare(right.name))
                            .map((subarea) => (
                              <button
                                key={subarea.id}
                                type="button"
                                title={subarea.name}
                                className={`flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm transition ${
                                  selection.countrySubareaId === subarea.id
                                    ? "bg-orange-50 text-orange-700"
                                    : "text-slate-700 hover:bg-stone-100"
                                }`}
                                onClick={() =>
                                  handleSelectCountrySubarea(
                                    activeLocation.continent!.id,
                                    activeLocation.country!.id,
                                    subarea.id,
                                  )
                                }
                              >
                                <MapPin className="h-4 w-4" />
                                {formatBreadcrumbName(subarea.name)}
                              </button>
                            ))
                        : activeCountryCities
                            .slice()
                            .sort((left, right) => left.name.localeCompare(right.name))
                            .map((city) => (
                              <button
                                key={city.id}
                                type="button"
                                className={`flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm transition ${
                                  selection.cityId === city.id
                                    ? "bg-orange-50 text-orange-700"
                                    : "text-slate-700 hover:bg-stone-100"
                                }`}
                                onClick={(event) =>
                                  handleSelectCityFromList(
                                    activeLocation.continent!.id,
                                    activeLocation.country!.id,
                                    city.id,
                                    event.currentTarget,
                                  )
                                }
                              >
                                <MapPin className="h-4 w-4" />
                                <span data-morph-origin="label" className="inline-block">
                                  {city.name}
                                </span>
                              </button>
                            ))}
                    </div>
                  </div>
                ) : isContinentRootSelection ? (
                  <div
                    className={`flex h-full min-h-0 flex-col transition-opacity duration-200 ${
                      isCountryOrStateMorphing ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                  >
                    <div className="mb-2 shrink-0 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-700">
                        <span
                          key={continentLabelRevealKey}
                          className={
                            !displayContinentRegions ? "continent-label-write-in inline-block overflow-hidden whitespace-nowrap align-bottom" : ""
                          }
                        >
                          {displayContinentRegions ? "Regions" : "Countries"}
                        </span>
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setContinentBrowseView("countries")}
                          className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                            continentBrowseView === "countries"
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                          }`}
                          aria-label="Show countries"
                        >
                          <Flag className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setContinentBrowseView("regions")}
                          disabled={!activeContinentSubareas.length}
                          className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                            continentBrowseView === "regions"
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                          } ${activeContinentSubareas.length ? "" : "cursor-not-allowed opacity-50"}`}
                          aria-label="Show regions"
                        >
                          <MapIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="min-h-0 flex-1 overflow-hidden">
                      <ContinentList
                        continents={continents}
                        selection={selection}
                        continentRootRevealKey={continentRootRevealKey}
                        continentBrowseView={continentBrowseView}
                        countryBrowseView={countryBrowseView}
                        onSelectContinent={handleSelectContinent}
                        onSelectContinentSubarea={handleSelectContinentSubarea}
                        onSelectCountry={handleSelectCountry}
                        onSelectCountryFromContinentRoot={handleSelectCountryFromContinentList}
                        onSelectCountrySubarea={handleSelectCountrySubarea}
                        onSelectState={handleSelectStateFromCountryList}
                        onSelectCity={handleSelectCityFromList}
                      />
                    </div>
                  </div>
                ) : isCountryRootSelection ? (
                  <div
                    key={`country-root-${selection.countryId}-${countryRevealKey}`}
                    className={`flex h-full min-h-0 flex-col ${
                      isCountryOrStateMorphing ? "opacity-0 pointer-events-none" : "country-root-reveal opacity-100"
                    }`}
                  >
                    <div className="mb-2 shrink-0 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-700">
                        {countryBrowseView === "regions" ? "Regions" : hasStateHierarchyCountry ? countryStateLabel : "Cities"}
                      </p>
                      <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCountryBrowseView("cities")}
                        className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                          countryBrowseView === "cities"
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                        }`}
                        aria-label={hasStateHierarchyCountry ? `Show ${countryStateLabelLower}` : "Show cities"}
                      >
                        {hasStateHierarchyCountry ? <Flag className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCountryBrowseView("regions")}
                        disabled={!activeCountrySubareas.length}
                        className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                          countryBrowseView === "regions"
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                        } ${activeCountrySubareas.length ? "" : "cursor-not-allowed opacity-50"}`}
                        aria-label="Show regions"
                      >
                        <MapIcon className="h-4 w-4" />
                      </button>
                      </div>
                    </div>
                    <div className="min-h-0 flex-1 overflow-hidden">
                      <ContinentList
                        continents={continents}
                        selection={selection}
                        continentBrowseView={continentBrowseView}
                        countryBrowseView={countryBrowseView}
                        onSelectContinent={handleSelectContinent}
                        onSelectContinentSubarea={handleSelectContinentSubarea}
                        onSelectCountry={handleSelectCountry}
                        onSelectCountryFromContinentRoot={handleSelectCountryFromContinentList}
                        onSelectCountrySubarea={handleSelectCountrySubarea}
                        onSelectState={handleSelectStateFromCountryList}
                        onSelectCity={handleSelectCityFromList}
                      />
                    </div>
                  </div>
                ) : isGlobalSelection ? (
                  <div
                    className={`flex h-full min-h-0 flex-col transition-opacity duration-150 ${
                      continentTitleMorph ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                  >
                    <div className="mb-2 shrink-0 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-700">Continents</p>
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-900 bg-slate-900 text-white">
                          <Globe2 className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                    <div className="min-h-0 flex-1 overflow-hidden bg-transparent">
                      <div className="h-full overflow-y-auto divide-y divide-slate-200">
                        {continents.map((continent) => {
                          if (continentTitleMorph?.id === continent.id) {
                            return <div key={continent.id} className="h-[66px]" aria-hidden="true" />;
                          }
                          const countryCount = continent.countries.length;
                          const cityCount = continent.countries.reduce(
                            (total, country) =>
                              total + country.cities.filter((city) => !city.isPlaceholderRegion).length,
                            0,
                          );

                          return (
                            <button
                              key={continent.id}
                              type="button"
                              onClick={(event) =>
                                handleSelectContinentFromGlobal(continent.id, event.currentTarget)
                              }
                              className="group flex w-full items-center gap-4 px-4 py-3 text-left transition hover:bg-stone-50"
                            >
                              <div
                                className={`flex h-10 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${continent.backgroundGradient}`}
                              >
                                <img
                                  src={`/assets/continents/${continent.id}.svg`}
                                  alt=""
                                  aria-hidden="true"
                                  className="h-7 w-auto opacity-85"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-slate-900">
                                  <span data-morph-origin="label" className="inline-block">
                                    {continent.name}
                                  </span>
                                </p>
                                <p className="mt-0.5 text-xs text-slate-600">
                                  {countryCount} countries • {cityCount} cities
                                </p>
                              </div>
                              <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-600" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <ContinentList
                    continents={continents}
                    selection={selection}
                    continentBrowseView={continentBrowseView}
                    countryBrowseView={countryBrowseView}
                    onSelectContinent={handleSelectContinent}
                    onSelectContinentSubarea={handleSelectContinentSubarea}
                    onSelectCountry={handleSelectCountry}
                    onSelectCountryFromContinentRoot={handleSelectCountryFromContinentList}
                    onSelectCountrySubarea={handleSelectCountrySubarea}
                    onSelectState={handleSelectStateFromCountryList}
                    onSelectCity={handleSelectCityFromList}
                  />
                )}
              </div>
              </div>
              {isProfileMode && currentUser ? (
                <div
                  key={`profile-left-intro-${profileIntroNonce}`}
                  className="profile-left-pane profile-left-intro absolute inset-0 z-20 bg-slate-100 p-5"
                >
                  <div className={`left-pane-content flex h-full min-h-0 flex-col p-1 ${paneTransitionClass}`}>
                    <div
                      className={`flex min-h-0 flex-col justify-start transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        activeProfileLeftRail === "places-been" ? "flex-1" : "flex-none"
                      } ${
                        activeProfileLeftRail === "places-been" ? "items-start text-left" : "items-center text-center"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (activeProfileLeftRail === "edit-profile") {
                            profileAvatarInputRef.current?.click();
                          }
                        }}
                        disabled={activeProfileLeftRail !== "edit-profile"}
                        className={`profile-left-avatar inline-flex shrink-0 overflow-hidden rounded-full ${
                          isEnteringProfileShell
                            ? "transition-none"
                            : "transition-[width,height,opacity,transform,margin] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                        } ${
                          activeProfileLeftRail === "places-been"
                            ? "mt-0 h-0 w-0 -translate-y-2 scale-75 opacity-0"
                            : "h-24 w-24 translate-y-0 scale-100 opacity-100"
                        } ${
                          activeProfileLeftRail === "edit-profile"
                            ? "group relative cursor-pointer border border-slate-200 bg-white"
                            : ""
                        }`}
                        aria-label="Change profile picture"
                      >
                        <img
                          src={profileAvatarPreview || currentUser.avatar}
                          alt={currentUser.name}
                          className="h-full w-full object-cover"
                        />
                        {activeProfileLeftRail === "edit-profile" ? (
                          <span className="absolute inset-0 flex items-center justify-center bg-slate-950/35 text-white opacity-0 transition group-hover:opacity-100">
                            <Camera className="h-5 w-5" />
                          </span>
                        ) : null}
                      </button>
                      <input
                        ref={profileAvatarInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(event) => handleProfileAvatarChange(event.target.files?.[0] ?? null)}
                        className="hidden"
                      />
                      <div
                        className={`relative w-full overflow-visible transition-[height,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          activeProfileLeftRail === "places-been" ? "mt-0 h-6" : "mt-4 h-auto min-h-10"
                        }`}
                      >
                        {activeProfileLeftRail === "edit-profile" ? (
                          <input
                            value={profileNameDraft}
                            onChange={(event) => setProfileNameDraft(event.target.value)}
                            onBlur={() => void handleProfileSave()}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.currentTarget.blur();
                              }
                            }}
                            className="mx-auto block w-full max-w-[16rem] rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-2xl font-semibold text-slate-900 outline-none transition focus:border-slate-400"
                            aria-label="Profile name"
                          />
                        ) : (
                          <h2
                            className={`profile-left-name absolute top-0 font-semibold transition-[left,transform,font-size,color] duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                              activeProfileLeftRail === "places-been"
                                ? "left-0 translate-x-0 text-sm uppercase tracking-[0.1em] text-slate-500"
                                : "left-1/2 -translate-x-1/2 text-2xl text-slate-900"
                            }`}
                          >
                            {currentUser.name}
                          </h2>
                        )}
                      </div>
                      {activeProfileLeftRail === "edit-profile" ? (
                        <textarea
                          value={profileBioDraft}
                          onChange={(event) => setProfileBioDraft(event.target.value)}
                          onBlur={() => void handleProfileSave()}
                          rows={3}
                          maxLength={220}
                          className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-sm text-slate-600 outline-none transition focus:border-slate-400"
                          aria-label="Profile bio"
                        />
                      ) : (
                        <p
                          className={`profile-left-bio w-full overflow-hidden text-sm text-slate-600 transition-[max-height,opacity,transform,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            activeProfileLeftRail === "places-been"
                              ? "mt-0 max-h-0 -translate-y-1 opacity-0"
                              : "mt-2 max-h-16 translate-y-0 opacity-100"
                          }`}
                        >
                          {currentUser.bio}
                        </p>
                      )}
                      {activeProfileLeftRail === "edit-profile" && profileEditMessage ? (
                        <p className="mt-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                          {isSavingProfile ? "Saving..." : profileEditMessage}
                        </p>
                      ) : null}
                      {activeProfileLeftRail === "places-been" ? (
                        <div className="mt-2 flex min-h-0 flex-1 w-full flex-col text-left">
                          <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Places been</p>
                          <p className="mt-1 text-sm text-slate-600">{profilePlacesBeenSummary}</p>
                          <div className="mt-3 flex items-center gap-1.5">
                            <div className="grid flex-1 grid-cols-3 gap-1.5">
                              {(
                                [
                                  { id: "countries", label: "Countries" },
                                  { id: "cities", label: "Cities" },
                                  { id: "places", label: "Places" },
                                ] as const
                              ).map((filter) => (
                                <button
                                  key={filter.id}
                                  type="button"
                                  onClick={() => handlePlacesBeenFilterSelect(filter.id)}
                                  className={`rounded-full border px-2 py-1 text-xs font-medium transition ${
                                    activePlacesBeenFilter === filter.id
                                      ? "border-slate-900 bg-slate-900 text-white"
                                      : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900"
                                  }`}
                                >
                                  {filter.label}
                                </button>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsAddingPlacesBeenCountry((current) => !current)}
                              className={`inline-flex h-7 w-7 items-center justify-center rounded-full border transition ${
                                isAddingPlacesBeenCountry
                                  ? "border-slate-900 bg-slate-900 text-white"
                                  : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900"
                              }`}
                              aria-label={`Add ${
                                activePlacesBeenFilter === "countries"
                                  ? "country"
                                  : activePlacesBeenFilter === "cities"
                                    ? "city"
                                    : "place"
                              }`}
                              title={`Add ${
                                activePlacesBeenFilter === "countries"
                                  ? "country"
                                  : activePlacesBeenFilter === "cities"
                                    ? "city"
                                    : "place"
                              }`}
                            >
                              <Plus
                                className={`h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                  isAddingPlacesBeenCountry ? "rotate-45" : "rotate-0"
                                }`}
                              />
                            </button>
                          </div>
                          {isAddingPlacesBeenCountry ? (
                            <div className="mt-2 flex items-center gap-1.5">
                              <input
                                type="text"
                                value={draftPlacesBeenCountry}
                                onChange={(event) => setDraftPlacesBeenCountry(event.target.value)}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter") {
                                    event.preventDefault();
                                    handleAddPlacesBeenEntry();
                                  }
                                  if (event.key === "Escape") {
                                    setIsAddingPlacesBeenCountry(false);
                                    setDraftPlacesBeenCountry("");
                                  }
                                }}
                                placeholder={
                                  activePlacesBeenFilter === "countries"
                                    ? "Add country"
                                    : activePlacesBeenFilter === "cities"
                                      ? "Add city (optional: City, Country)"
                                      : "Add place (optional: Place, Country)"
                                }
                                className="h-8 min-w-0 flex-1 rounded-full border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
                              />
                              <button
                                type="button"
                                onClick={handleAddPlacesBeenEntry}
                                className="h-8 rounded-full border border-slate-900 bg-slate-900 px-3 text-xs font-medium text-white transition hover:bg-slate-800"
                              >
                                Add
                              </button>
                            </div>
                          ) : null}
                          <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
                            {profilePlacesBeenByCountry.length ? (
                              activePlacesBeenFilter === "countries" ? (
                                <div className="space-y-1">
                                  {profilePlacesBeenByCountry.map((group) => {
                                    const countryEntry = group.entries[0];
                                    if (!countryEntry) {
                                      return null;
                                    }
                                    const countryStopId = `places-been-countries-${countryEntry.id}`;
                                    const countryFlag = getCountryFlagEmoji(group.country);
                                    const isActive = Boolean(
                                      focusedPlacesBeenStopIds?.includes(countryStopId),
                                    );
                                    return (
                                      <button
                                        key={group.country}
                                        type="button"
                                        onClick={() => {
                                          handlePlacesBeenEntryFocus(countryEntry);
                                        }}
                                        className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-sm transition ${
                                          isActive
                                            ? "bg-orange-50 text-orange-700"
                                            : "text-slate-700 hover:bg-stone-100"
                                        }`}
                                      >
                                        {countryFlag ? (
                                          <span className="inline-flex min-w-[1rem] items-center justify-center text-sm leading-none">
                                            {countryFlag}
                                          </span>
                                        ) : (
                                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                                        )}
                                        <span className="truncate">{group.country}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {profilePlacesBeenByCountry.map((group) => {
                                    const isExpanded = expandedPlacesBeenCountries.includes(group.country);
                                    const countryStopIds = profilePlacesBeenStopIdsByCountry.get(group.country) ?? [];
                                    const countryFlag = getCountryFlagEmoji(group.country);
                                    const isCountryFocused = countryStopIds.some((stopId) =>
                                      focusedPlacesBeenStopIds?.includes(stopId),
                                    );
                                    return (
                                      <div
                                        key={group.country}
                                        className="rounded-xl border border-slate-200 bg-white/70 px-2 py-1.5"
                                      >
                                        <div className="flex items-center gap-1">
                                          <button
                                            type="button"
                                            onClick={() => handlePlacesBeenCountryFocus(group.country)}
                                            className={`min-w-0 flex-1 rounded-lg px-2 py-1 text-left text-xs font-semibold uppercase tracking-[0.08em] transition ${
                                              isCountryFocused
                                                ? "bg-orange-50 text-orange-700"
                                                : "text-slate-600 hover:bg-stone-100"
                                            }`}
                                          >
                                            <span className="inline-flex items-center gap-2">
                                              {countryFlag ? (
                                                <span className="inline-flex min-w-[1rem] items-center justify-center text-sm leading-none">
                                                  {countryFlag}
                                                </span>
                                              ) : null}
                                              <span className="truncate">{group.country}</span>
                                            </span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handlePlacesBeenCountryToggle(group.country)}
                                            className="inline-flex h-6 w-6 items-center justify-center rounded-lg text-slate-500 transition hover:bg-stone-100 hover:text-slate-700"
                                            aria-label={`${isExpanded ? "Collapse" : "Expand"} ${group.country}`}
                                          >
                                            <ChevronRight
                                              className={`h-4 w-4 transition-transform ${
                                                isExpanded ? "rotate-90" : ""
                                              }`}
                                            />
                                          </button>
                                        </div>
                                        {isExpanded ? (
                                          <div className="mt-1 space-y-1">
                                            {group.entries.map((entry) => {
                                              const entryStopId = `places-been-${entry.kind}-${entry.id}`;
                                              const isActive = Boolean(
                                                focusedPlacesBeenStopIds?.includes(entryStopId),
                                              );
                                              return (
                                                <button
                                                  key={entry.id}
                                                  type="button"
                                                  onClick={() => handlePlacesBeenEntryFocus(entry)}
                                                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition ${
                                                    isActive
                                                      ? "bg-orange-50 text-orange-700"
                                                      : "text-slate-700 hover:bg-stone-100"
                                                  }`}
                                                >
                                                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                                                  <span className="truncate">{entry.name}</span>
                                                </button>
                                              );
                                            })}
                                          </div>
                                        ) : null}
                                      </div>
                                    );
                                  })}
                                </div>
                              )
                            ) : (
                              <p className="text-sm text-slate-500">No places added yet.</p>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {activeProfileLeftRail !== "places-been" && activeProfileLeftRail !== "edit-profile" ? (
                      <div className="profile-left-stats mt-5 grid grid-cols-3 gap-2">
                      <div className="profile-left-stat-card rounded-xl border border-slate-200 bg-stone-50 px-3 py-2 text-center">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Countries</p>
                        <p className="mt-1 text-base font-semibold text-slate-900">{profilePlacesBeenCountries.length}</p>
                      </div>
                      <div className="profile-left-stat-card rounded-xl border border-slate-200 bg-stone-50 px-3 py-2 text-center">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Favorites</p>
                        <p className="mt-1 text-base font-semibold text-slate-900">{profileStats.favoritesCount}</p>
                      </div>
                      <div className="profile-left-stat-card rounded-xl border border-slate-200 bg-stone-50 px-3 py-2 text-center">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Guides</p>
                        <p className="mt-1 text-base font-semibold text-slate-900">{profileStats.guidesCount}</p>
                      </div>
                      </div>
                    ) : null}
                    {activeProfileLeftRail !== "places-been" && activeProfileLeftRail !== "edit-profile" ? (
                      <div className="mt-3 rounded-xl border border-slate-200 bg-stone-50 p-3">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Favorites</p>
                        <div className="mt-2 space-y-1.5">
                          {profileFavoriteHighlights.map((favorite) => (
                            <div key={favorite.type} className="flex items-center justify-between rounded-lg bg-white/75 px-2.5 py-1.5">
                              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                                {favorite.type}
                              </span>
                              <span className="ml-3 truncate text-sm font-medium text-slate-800">{favorite.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>

            <div
              ref={mapViewportPanelRef}
              className="explorer-map-pane min-h-0 min-w-0 pointer-events-none border-slate-200 p-0 lg:border-x lg:border-y-0"
              aria-hidden="true"
            />

            <div
              ref={rightPaneRef}
              className={`pointer-events-auto absolute inset-x-0 bottom-0 z-40 rounded-t-xl rounded-tl-none border-t border-slate-200 bg-white shadow-[0_-12px_32px_rgba(15,23,42,0.18)] ${
                isMobileListSheetDragging ? "transition-none" : "transition-[height,padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
              } lg:relative lg:inset-auto lg:z-20 lg:rounded-none lg:border-t-0 lg:shadow-none ${
                isMobileListSheetExpanded ? "h-[60svh]" : "h-36"
              } ${
                isGuideTakingFullListPane ? "p-0" : "p-3 lg:p-5"
              } overflow-visible ${
                isSubcategoryMenuOpen && !isGuideTakingFullListPane ? "lg:overflow-visible" : "lg:overflow-hidden"
              } lg:ml-0 lg:w-full lg:h-auto ${explorerPaneHeight}`}
              style={mobileListSheetDragHeight === null ? undefined : { height: `${mobileListSheetDragHeight}px` }}
              onPointerMove={handleMobileListSheetDragMove}
              onPointerUp={handleMobileListSheetDragEnd}
              onPointerCancel={handleMobileListSheetDragEnd}
            >
              <div
                className="mobile-rguides-tab absolute left-0 -top-7 z-[80] flex h-7 min-w-[6.25rem] touch-none items-center rounded-t-lg border border-b-0 border-slate-200 bg-slate-950 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_-5px_12px_rgba(15,23,42,0.12)] transition-opacity duration-300 lg:hidden"
                data-mobile-sheet-handle
                onPointerDown={handleMobileListSheetDragStart}
                onPointerMove={handleMobileListSheetDragMove}
                onPointerUp={handleMobileListSheetDragEnd}
                onPointerCancel={handleMobileListSheetDragEnd}
              >
                {activeMobileGuideSelector.label}
              </div>
              <div
                className={`absolute right-4 -top-8 z-[90] flex h-7 items-center justify-end gap-2.5 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
                  isMobileCategoryMenuExpanded || isGuideTakingFullListPane
                    ? "pointer-events-none -translate-y-1 opacity-0"
                    : "translate-y-0 opacity-100"
                }`}
              >
                {mobileGuideSelectors.map((selector) => {
                  const isActive = activeGuideRail === selector.id;
                  const SelectorIcon = selector.icon;
                  return (
                    <button
                      key={selector.id}
                      type="button"
                      onClick={() => {
                        setActiveGuideRail(selector.id);
                        setExpandedGuideId(null);
                        setClosingGuide(null);
                      }}
                      className={`flex h-5 w-5 items-center justify-center rounded-full border text-[9px] font-semibold transition ${
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 shadow-sm"
                      }`}
                      aria-label={selector.label}
                      title={selector.label}
                    >
                      {SelectorIcon ? <SelectorIcon className="h-2.5 w-2.5" /> : selector.shortLabel}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                className="absolute left-1/2 -top-7 z-[85] flex h-7 -translate-x-1/2 touch-none items-center justify-center transition-opacity duration-300 lg:hidden"
                data-mobile-sheet-handle
                onPointerDown={handleMobileListSheetDragStart}
                onPointerMove={handleMobileListSheetDragMove}
                onPointerUp={handleMobileListSheetDragEnd}
                onPointerCancel={handleMobileListSheetDragEnd}
                aria-label="Drag guides panel"
              >
                <span className="h-1.5 w-12 rounded-full bg-slate-300/80" />
              </button>
              <div className="pointer-events-none absolute inset-0 z-[82] rounded-t-xl rounded-tl-none bg-white lg:rounded-none" aria-hidden="true" />
              <div className={`relative z-[85] flex h-full flex-col ${paneTransitionClass}`}>
                <div
                  className={`relative flex shrink-0 items-center transition-[height,margin-bottom] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
                    isGuideTakingFullListPane ? "mb-0 h-0" : "mb-2 h-8"
                  }`}
                  onPointerDown={handleMobileListSheetDragStart}
                >
                  <div className={`min-w-0 pr-12 transition-opacity duration-200 ${isMobileCategoryMenuExpanded || isGuideTakingFullListPane ? "opacity-0" : "opacity-100"}`}>
                    <p className="truncate text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {categoryTitleLabel}
                    </p>
                  </div>
                  <div
                    className={`absolute right-0 top-0 z-[95] flex h-8 items-center justify-end overflow-hidden rounded-full bg-white transition-[width,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isMobileCategoryMenuExpanded ? "w-full" : "w-8"
                    } ${
                      isGuideTakingFullListPane ? "pointer-events-none -translate-y-2 opacity-0" : "translate-y-0 opacity-100"
                    }`}
                  >
                    <div
                      className={`grid min-w-0 flex-1 items-center transition-[padding,grid-template-columns] duration-300 ${
                        isMobileCategoryMenuExpanded ? "grid-cols-6 gap-2 pl-1 pr-2" : "grid-cols-1 justify-items-end pl-1"
                      }`}
                    >
                        {categoryOptions.map((option, index) => {
                          const isActive = activeCategory === option.category;
                          return (
                            <button
                              key={option.label}
                              type="button"
                              onClick={() => handleCategoryToggle(option.category)}
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border shadow-sm transition-[opacity,transform,background-color,color,border-color] duration-300 ${
                                isMobileCategoryMenuOpen ? "translate-x-0 scale-100 opacity-100" : "pointer-events-none translate-x-8 scale-75 opacity-0"
                              } ${isActive ? "text-white" : "bg-white text-slate-600"}`}
                              style={{
                                backgroundColor: isActive ? CATEGORY_STYLES[option.category].mapColor : undefined,
                                borderColor: CATEGORY_STYLES[option.category].mapColor,
                                transitionDelay: isMobileCategoryMenuOpen ? `${120 + index * 35}ms` : "0ms",
                              }}
                              aria-label={isActive ? `Clear ${option.label}` : option.label}
                              aria-pressed={isActive}
                            >
                              <option.icon className="h-3 w-3" />
                            </button>
                          );
                        })}
                    </div>
                    <button
                      type="button"
                      onClick={toggleMobileCategoryMenu}
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border shadow-sm transition-[background-color,color,border-color] ${
                        isMobileCategoryMenuExpanded
                          ? "border-slate-200 bg-white text-slate-700"
                          : activeCategoryOption
                            ? "text-white"
                            : "border-slate-200 bg-white text-slate-700"
                      }`}
                      style={
                        activeCategoryOption && !isMobileCategoryMenuExpanded
                          ? {
                              backgroundColor: CATEGORY_STYLES[activeCategoryOption.category].mapColor,
                              borderColor: CATEGORY_STYLES[activeCategoryOption.category].mapColor,
                            }
                          : undefined
                      }
                      aria-label="Open categories"
                      aria-expanded={isMobileCategoryMenuOpen}
                    >
                      {isMobileCategoryMenuExpanded ? (
                        <X className="h-3 w-3" />
                      ) : activeCategoryOption ? (
                        <activeCategoryOption.icon className="h-3 w-3" />
                      ) : (
                        <ListFilter className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
                <div
                  className={`mx-auto hidden w-full max-w-[36rem] space-y-3 transition-[max-height,opacity,transform,padding-bottom] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block ${
                    activeGuideRail === "itinerary"
                      ? "hidden"
                      : isGuideTakingFullListPane
                        ? "pointer-events-none max-h-0 -translate-y-6 pb-0 opacity-0"
                        : "max-h-56 translate-y-0 pb-2 opacity-100"
                  } ${isSubcategoryMenuOpen ? "overflow-visible" : "overflow-hidden"}`}
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                    <div className="grid w-full grid-cols-3 justify-items-start gap-2">
                      {categoryOptions.slice(0, 3).map((option) => (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() => handleCategoryToggle(option.category)}
                          onMouseEnter={() => setHoveredCategoryLabel(option.label)}
                          onMouseLeave={() => setHoveredCategoryLabel(null)}
                          className={`flex h-9 w-9 items-center justify-center rounded-full outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition ${
                            activeCategory === option.category
                              ? "border text-white"
                              : "border bg-white text-slate-600 hover:text-slate-900"
                          }`}
                          style={
                            activeCategory === option.category
                              ? {
                                  backgroundColor: CATEGORY_STYLES[option.category].mapColor,
                                  borderColor: CATEGORY_STYLES[option.category].mapColor,
                                }
                              : {
                                  borderColor: CATEGORY_STYLES[option.category].mapColor,
                                }
                          }
                          aria-label={option.label}
                        >
                          <option.icon className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                    <span className="inline-flex w-[8.5rem] justify-center text-center text-[11px] font-medium uppercase tracking-[0.24em] text-slate-500">
                      {categoryTitleLabel}
                    </span>
                    <div className="grid w-full grid-cols-3 justify-items-end gap-2">
                      {categoryOptions.slice(3).map((option) => (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() => handleCategoryToggle(option.category)}
                          onMouseEnter={() => setHoveredCategoryLabel(option.label)}
                          onMouseLeave={() => setHoveredCategoryLabel(null)}
                          className={`flex h-9 w-9 items-center justify-center rounded-full outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition ${
                            activeCategory === option.category
                              ? "border text-white"
                              : "border bg-white text-slate-600 hover:text-slate-900"
                          }`}
                          style={
                            activeCategory === option.category
                              ? {
                                  backgroundColor: CATEGORY_STYLES[option.category].mapColor,
                                  borderColor: CATEGORY_STYLES[option.category].mapColor,
                                }
                              : {
                                  borderColor: CATEGORY_STYLES[option.category].mapColor,
                                }
                          }
                          aria-label={option.label}
                        >
                          <option.icon className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div
                    className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      visibleSubcategoryCategory && !isSubcategoryCollapsing ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div
                      key={`${visibleSubcategoryCategory ?? "no-category"}-${isSubcategoryClosing ? "closing" : "opening"}`}
                      className={isSubcategoryMenuOpen ? "overflow-visible" : "overflow-hidden"}
                    >
                      {visibleSubcategoryCategory ? (
                        visibleSubcategoryCategory === "Food" ? (
                      <div className="flex flex-nowrap items-center justify-center gap-2 pt-1">
                        {FOOD_PRICE_OPTIONS.map((priceTier, index) => (
                          <button
                            key={`food-price-${priceTier}`}
                            type="button"
                            onClick={() =>
                              setActiveFoodPrice((current) =>
                                current === priceTier ? null : priceTier,
                              )
                            }
                            className={`subcategory-cascade-item min-w-[2.25rem] rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] transition ${
                              activeFoodPrice === priceTier
                                ? "text-white"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                            }`}
                            style={{
                              animationDelay: `${(isSubcategoryClosing ? FOOD_PRICE_OPTIONS.length + 1 - index : index) * 55}ms`,
                              animationDirection: isSubcategoryClosing ? "reverse" : "normal",
                              ...(activeFoodPrice === priceTier
                                ? {
                                    backgroundColor: CATEGORY_STYLES.Food.mapColor,
                                    borderColor: CATEGORY_STYLES.Food.mapColor,
                                  }
                                : {}),
                            }}
                            aria-label={`Filter food by ${priceTier}`}
                          >
                            {priceTier}
                          </button>
                        ))}
                        <div
                          className="subcategory-cascade-item relative order-3 w-[7.4rem] shrink-0"
                          style={{
                            animationDelay: `${(isSubcategoryClosing ? 0 : FOOD_PRICE_OPTIONS.length + 1) * 55}ms`,
                            animationDirection: isSubcategoryClosing ? "reverse" : "normal",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setIsFoodOpenTimeMenuOpen((current) => !current);
                              setIsFoodCuisineMenuOpen(false);
                            }}
                            className="w-full rounded-full border border-slate-200 bg-white/95 px-2 py-0.5 pr-5 text-center text-[10px] font-medium uppercase tracking-[0.08em] text-slate-600 shadow-sm outline-none transition hover:border-slate-300 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-400/50"
                            aria-haspopup="listbox"
                            aria-expanded={isFoodOpenTimeMenuOpen}
                            aria-label="Open time filter"
                          >
                            {activeFoodOpenTime}
                          </button>
                          <ChevronDown
                            className={`pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400 transition-transform ${isFoodOpenTimeMenuOpen ? "rotate-180" : ""}`}
                            aria-hidden="true"
                          />
                          {isFoodOpenTimeMenuOpen ? (
                            <div className="absolute left-1/2 top-[calc(100%+6px)] z-30 w-full -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                              {FOOD_OPEN_TIME_OPTIONS.map((timeOption) => (
                                <button
                                  key={`open-time-${timeOption}`}
                                  type="button"
                                  onClick={() => {
                                    setActiveFoodOpenTime(timeOption);
                                    setIsFoodOpenTimeMenuOpen(false);
                                  }}
                                  className={`block w-full px-3 py-2 text-left text-[11px] font-medium uppercase tracking-[0.08em] transition ${
                                    activeFoodOpenTime === timeOption
                                      ? "bg-slate-100 text-slate-900"
                                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                  }`}
                                >
                                  {timeOption}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                        <label htmlFor="food-cuisine-filter" className="sr-only">
                          Cuisine filter
                        </label>
                        <div
                          className="subcategory-cascade-item relative order-2 w-[7.4rem] shrink-0"
                          style={{
                            animationDelay: `${(isSubcategoryClosing ? 1 : FOOD_PRICE_OPTIONS.length) * 55}ms`,
                            animationDirection: isSubcategoryClosing ? "reverse" : "normal",
                          }}
                        >
                          <button
                            id="food-cuisine-filter"
                            type="button"
                            onClick={() => {
                              setIsFoodCuisineMenuOpen((current) => !current);
                              setIsFoodOpenTimeMenuOpen(false);
                            }}
                            className="w-full rounded-full border border-slate-200 bg-white/95 px-2 py-0.5 text-center text-[10px] font-medium uppercase tracking-[0.08em] text-slate-600 shadow-sm outline-none transition hover:border-slate-300 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-400/50"
                            aria-haspopup="listbox"
                            aria-expanded={isFoodCuisineMenuOpen}
                          >
                            {activeFoodCuisine}
                          </button>
                          {isFoodCuisineMenuOpen ? (
                            <div className="absolute left-1/2 top-[calc(100%+6px)] z-30 w-[18rem] -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                              <div className="grid max-h-64 grid-cols-2 divide-x divide-slate-100 overflow-y-auto">
                                <div className="py-1">
                                  {contextualFoodCuisineOptions.map((cuisine) => (
                                    <button
                                      key={`${subcategoryScope}-cuisine-${cuisine}`}
                                      type="button"
                                      onClick={() => {
                                        setActiveFoodCuisine(cuisine);
                                        setIsFoodCuisineMenuOpen(false);
                                      }}
                                      className={`block w-full px-3 py-2 text-left text-[11px] font-medium uppercase tracking-[0.08em] transition ${
                                        activeFoodCuisine === cuisine
                                          ? "bg-slate-100 text-slate-900"
                                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                      }`}
                                    >
                                      {cuisine}
                                    </button>
                                  ))}
                                </div>
                                <div className="py-1">
                                  {generalFoodCuisineOptions.map((cuisine) => (
                                    <button
                                      key={`general-cuisine-${cuisine}`}
                                      type="button"
                                      onClick={() => {
                                        setActiveFoodCuisine(cuisine);
                                        setIsFoodCuisineMenuOpen(false);
                                      }}
                                      className={`block w-full px-3 py-2 text-left text-[11px] font-medium uppercase tracking-[0.08em] transition ${
                                        activeFoodCuisine === cuisine
                                          ? "bg-slate-100 text-slate-900"
                                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                      }`}
                                    >
                                      {cuisine}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : visibleSubcategoryCategory === "Nightlife" ? (
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                        {visibleSubcategoryOptions.map((subcategory, index) => (
                          <button
                            key={`${visibleSubcategoryCategory}-${subcategory}`}
                            type="button"
                            onClick={() =>
                              setActiveSubcategory((current) =>
                                current === subcategory ? null : subcategory,
                              )
                            }
                            className={`subcategory-cascade-item rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] transition ${
                              activeSubcategory === subcategory
                                ? "text-white"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                            }`}
                            style={{
                              animationDelay: `${(isSubcategoryClosing ? visibleSubcategoryOptions.length - index : index) * 55}ms`,
                              animationDirection: isSubcategoryClosing ? "reverse" : "normal",
                              ...(activeSubcategory === subcategory
                                ? {
                                    backgroundColor: CATEGORY_STYLES[visibleSubcategoryCategory].mapColor,
                                    borderColor: CATEGORY_STYLES[visibleSubcategoryCategory].mapColor,
                                  }
                                : {}),
                            }}
                          >
                            {subcategory}
                          </button>
                        ))}
                        <div
                          className="subcategory-cascade-item relative w-[8.2rem] shrink-0"
                          style={{
                            animationDelay: `${(isSubcategoryClosing ? 0 : visibleSubcategoryOptions.length) * 55}ms`,
                            animationDirection: isSubcategoryClosing ? "reverse" : "normal",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setIsNightlifeBarMenuOpen((current) => !current);
                              setIsFoodOpenTimeMenuOpen(false);
                              setIsFoodCuisineMenuOpen(false);
                            }}
                            className="w-full rounded-full border border-slate-200 bg-white/95 px-2 py-0.5 pr-5 text-center text-[10px] font-medium uppercase tracking-[0.08em] text-slate-600 shadow-sm outline-none transition hover:border-slate-300 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-400/50"
                            aria-haspopup="listbox"
                            aria-expanded={isNightlifeBarMenuOpen}
                            aria-label="Bars filter"
                          >
                            {activeNightlifeBarType}
                          </button>
                          <ChevronDown
                            className={`pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400 transition-transform ${isNightlifeBarMenuOpen ? "rotate-180" : ""}`}
                            aria-hidden="true"
                          />
                          {isNightlifeBarMenuOpen ? (
                            <div className="absolute left-1/2 top-[calc(100%+6px)] z-30 w-full -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                              <button
                                key="nightlife-type-any"
                                type="button"
                                onClick={() => {
                                  setActiveNightlifeBarType(NIGHTLIFE_BAR_TYPE_ANY);
                                  setIsNightlifeBarMenuOpen(false);
                                }}
                                className={`block w-full px-3 py-2 text-left text-[11px] font-medium uppercase tracking-[0.08em] transition ${
                                  activeNightlifeBarType === NIGHTLIFE_BAR_TYPE_ANY
                                    ? "bg-slate-100 text-slate-900"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                              >
                                {NIGHTLIFE_BAR_TYPE_ANY}
                              </button>
                              {NIGHTLIFE_BAR_TYPE_OPTIONS.map((barType) => (
                                <button
                                  key={`nightlife-type-${barType}`}
                                  type="button"
                                  onClick={() => {
                                    setActiveNightlifeBarType(barType);
                                    setIsNightlifeBarMenuOpen(false);
                                  }}
                                  className={`block w-full px-3 py-2 text-left text-[11px] font-medium uppercase tracking-[0.08em] transition ${
                                    activeNightlifeBarType === barType
                                      ? "bg-slate-100 text-slate-900"
                                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                  }`}
                                >
                                  {barType}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                        {visibleSubcategoryOptions.map((subcategory, index) => (
                          <button
                            key={`${visibleSubcategoryCategory}-${subcategory}`}
                            type="button"
                            onClick={() =>
                              setActiveSubcategory((current) =>
                                current === subcategory ? null : subcategory,
                              )
                            }
                            className={`subcategory-cascade-item rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] transition ${
                              activeSubcategory === subcategory
                                ? "text-white"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                            }`}
                            style={{
                              animationDelay: `${(isSubcategoryClosing ? visibleSubcategoryOptions.length - 1 - index : index) * 55}ms`,
                              animationDirection: isSubcategoryClosing ? "reverse" : "normal",
                              ...(activeSubcategory === subcategory
                                ? {
                                    backgroundColor: CATEGORY_STYLES[visibleSubcategoryCategory].mapColor,
                                    borderColor: CATEGORY_STYLES[visibleSubcategoryCategory].mapColor,
                                  }
                                : {}),
                            }}
                          >
                            {subcategory}
                          </button>
                        ))}
                      </div>
                        )
                      ) : null}
                    </div>
                  </div>
                </div>

                <div
                  data-guides-scroll
                  className={`flex min-h-0 flex-1 flex-col gap-4 transition-[margin-top,padding-bottom,padding-right] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isGuideTakingFullListPane ? "mt-0" : "mt-2"
                  } ${isGuideTakingFullListPane ? "h-full max-h-full overflow-hidden pb-0 pr-0 overscroll-contain" : `${explorerBodyMaxHeight} overflow-y-auto pb-0 pr-1`}`}
                >
                  {activeGuideRail === "itinerary" && (isItineraryEditing || (!displayedGuide && !activeItineraryPlaylist?.completedListId)) ? (
                    activeItineraryPlaylist ? (
                      <div className="space-y-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-3">
                          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                            Itineraries
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {itineraryPlaylists.map((playlist) => (
                              <button
                                key={playlist.id}
                                type="button"
                                onClick={() => setActiveItineraryPlaylistId(playlist.id)}
                                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                                  activeItineraryPlaylist.id === playlist.id
                                    ? "border-slate-900 bg-slate-900 text-white"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                                }`}
                              >
                                {playlist.name}
                              </button>
                            ))}
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {!activeItineraryPlaylist.completedListId ? (
                              <button
                                type="button"
                                onClick={handleCompleteItineraryPlaylist}
                                disabled={!itineraryStopEntries.length}
                                className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                Complete
                              </button>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={handleSaveItineraryEdits}
                                  disabled={!itineraryStopEntries.length}
                                  className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  Save itinerary edits
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setIsItineraryEditing(false)}
                                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900"
                                >
                                  Done
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {activeItineraryPlaylist.listIds.length ? (
                          <div className="rounded-2xl border border-slate-200 bg-white p-3">
                            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                              Guides in this itinerary
                            </p>
                            <div className="mt-2 space-y-2">
                              {activeItineraryPlaylist.listIds
                                .map((listId) => railFilteredLists.find((list) => list.id === listId))
                                .filter((list): list is MapList => Boolean(list))
                                .map((list) => (
                                  <button
                                    key={list.id}
                                    type="button"
                                    onClick={() => handleOpenItineraryGuide(list)}
                                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-stone-50 px-3 py-2 text-left text-sm text-slate-700 hover:border-slate-300 hover:text-slate-900"
                                  >
                                    <span className="truncate">{list.title}</span>
                                    <span className="ml-3 shrink-0 text-xs text-slate-500">Open</span>
                                  </button>
                                ))}
                            </div>
                          </div>
                        ) : null}

                        {itineraryStopEntries.length ? (
                          itineraryStopEntries.map((entry, index) => (
                            <article key={entry.key} className="rounded-2xl border border-slate-200 bg-white p-3">
                              <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                                    Stop {index + 1}
                                  </p>
                                  <p className="text-sm font-semibold text-slate-900">{entry.stop.name}</p>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                  <input
                                    type="date"
                                    value={entry.schedule?.date ?? ""}
                                    onChange={(event) =>
                                      setItineraryStopSchedule(entry.scheduleKey, {
                                        date: event.target.value || undefined,
                                      })
                                    }
                                    className="rounded-full border border-slate-200 px-2 py-1 text-[11px] text-slate-700"
                                  />
                                  <input
                                    type="time"
                                    value={entry.schedule?.time ?? ""}
                                    onChange={(event) =>
                                      setItineraryStopSchedule(entry.scheduleKey, {
                                        time: event.target.value || undefined,
                                      })
                                    }
                                    className="rounded-full border border-slate-200 px-2 py-1 text-[11px] text-slate-700"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeStopFromItineraryPlaylist(activeItineraryPlaylist.id, entry.key)
                                    }
                                    className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                              <p className="mt-1 text-xs text-slate-500">
                                {entry.list.title} • {[entry.list.location.city, entry.list.location.country].filter(Boolean).join(", ")}
                              </p>
                            </article>
                          ))
                        ) : (
                          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center">
                            <p className="text-sm font-medium text-slate-900">No locations in this itinerary yet</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center">
                        <p className="text-sm font-medium text-slate-900">No itinerary locations yet</p>
                        <p className="mt-1 text-xs text-slate-600">
                          Add locations from any expanded guide item and they will compile here with date/time controls.
                        </p>
                      </div>
                    )
                  ) : displayedGuide ? (
                    <div className={isGuideTakingFullListPane ? "flex h-full min-h-0 flex-col" : "space-y-4"}>
                      {activeGuideRail === "itinerary" && activeItineraryPlaylist ? (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => setIsItineraryEditing(true)}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900"
                          >
                            Edit itinerary
                          </button>
                        </div>
                      ) : null}
                      <div
                        key={displayedGuide.id}
                        ref={(node) => {
                          guideRefs.current[displayedGuide.id] = node;
                        }}
                        className={isGuideTakingFullListPane ? "min-h-0 flex-1 scroll-mt-2" : "scroll-mt-2"}
                      >
                        <MapListCard
                          list={displayedGuide}
                          expandable
                          expanded={Boolean(expandedGuide)}
                          fillPane={isGuideTakingFullListPane}
                          onToggleExpand={handleGuideToggle}
                          onEditItinerary={activeGuideRail === "itinerary" ? handleEditItineraryFromGuide : undefined}
                          shouldAutoOpenSources={pendingSourcesOpenGuideId === displayedGuide.id}
                          onAutoOpenSourcesHandled={handleAutoOpenSourcesHandled}
                          onRequestOpenSourcesWhenCollapsed={handleExpandAndOpenSources}
                          onHoverStart={setHoveredGuide}
                          onHoverEnd={() => setHoveredGuide(null)}
                          onStopHoverChange={setHoveredStopId}
                          hoveredStopId={hoveredStopId}
                          onExpandedStopIdsChange={setVisibleNestedStopParentIds}
                          forceExpandStopId={selectedGuideStopId}
                          forceExpandStopNonce={selectedGuideStopNonce}
                        />
                      </div>
                      {!isGuideTakingFullListPane && remainingGuides.length ? (
                        <div className="space-y-4 border-t border-slate-200 pt-4">
                        {activeGuideRail !== "itinerary" ? (
                          <p className="px-1 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                            More Guides
                          </p>
                        ) : null}
                        {remainingGuides.map((list) => (
                          <div
                            key={list.id}
                            ref={(node) => {
                              guideRefs.current[list.id] = node;
                            }}
                            className="scroll-mt-2"
                          >
                            <MapListCard
                              list={list}
                              expandable
                              expanded={false}
                              onToggleExpand={handleGuideToggle}
                              onEditItinerary={activeGuideRail === "itinerary" ? handleEditItineraryFromGuide : undefined}
                              shouldAutoOpenSources={pendingSourcesOpenGuideId === list.id}
                              onAutoOpenSourcesHandled={handleAutoOpenSourcesHandled}
                              onRequestOpenSourcesWhenCollapsed={handleExpandAndOpenSources}
                              onHoverStart={setHoveredGuide}
                              onHoverEnd={() => setHoveredGuide(null)}
                              onStopHoverChange={setHoveredStopId}
                              hoveredStopId={hoveredStopId}
                              forceExpandStopId={selectedGuideStopId}
                              forceExpandStopNonce={selectedGuideStopNonce}
                            />
                          </div>
                        ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    railFilteredLists.map((list) => (
                      <div
                        key={list.id}
                        ref={(node) => {
                          guideRefs.current[list.id] = node;
                        }}
                        className="scroll-mt-2"
                      >
                        <MapListCard
                          list={list}
                          expandable
                          expanded={false}
                          onToggleExpand={handleGuideToggle}
                          onEditItinerary={activeGuideRail === "itinerary" ? handleEditItineraryFromGuide : undefined}
                          shouldAutoOpenSources={pendingSourcesOpenGuideId === list.id}
                          onAutoOpenSourcesHandled={handleAutoOpenSourcesHandled}
                          onRequestOpenSourcesWhenCollapsed={handleExpandAndOpenSources}
                          onHoverStart={setHoveredGuide}
                          onHoverEnd={() => setHoveredGuide(null)}
                          onStopHoverChange={setHoveredStopId}
                          hoveredStopId={hoveredStopId}
                          forceExpandStopId={selectedGuideStopId}
                          forceExpandStopNonce={selectedGuideStopNonce}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
              {isProfileMode && currentUser ? (
                <div
                  className={`absolute inset-0 z-20 bg-white transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isProfileRightPaneFilled ? "p-0" : "p-5"
                  }`}
                >
                  <div className={`pane-cascade flex h-full min-h-[70vh] min-w-0 flex-1 flex-col ${paneTransitionClass}`}>
                    <div
                      className={`pane-cascade-item flex items-center justify-between overflow-hidden transition-[max-height,opacity,transform,margin-bottom] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isProfileRightPaneFilled
                          ? "mb-0 max-h-0 -translate-y-6 opacity-0 pointer-events-none"
                          : "mb-3 max-h-12 translate-y-0 opacity-100"
                      }`}
                    >
                      {isProfileSubmitting ? (
                        <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
                          <button
                            type="button"
                            onClick={() => {
                              setProfileSubmissionType("guide");
                              setProfileGuideSubmissionVariant("guide");
                            }}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                              profileSubmissionType === "guide" && profileGuideSubmissionVariant === "guide"
                                ? "bg-slate-900 text-white"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            Guide
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setProfileSubmissionType("journal");
                              setProfileGuideSubmissionVariant("guide");
                            }}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                              profileSubmissionType === "journal"
                                ? "bg-slate-900 text-white"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            Experience
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setProfileSubmissionType("guide");
                              setProfileGuideSubmissionVariant("itinerary");
                            }}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                              profileSubmissionType === "guide" && profileGuideSubmissionVariant === "itinerary"
                                ? "bg-slate-900 text-white"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            Itinerary
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                          {profileRightRailOptions.find((option) => option.id === activeProfileRightRail)?.label ?? "Guides"}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600">
                          {profileRailLists.length}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setIsProfileSubmitting((current) => {
                              const next = !current;
                              if (!next) {
                                setProfileEditingListId(null);
                              }
                              return next;
                            })
                          }
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900"
                          aria-label={isProfileSubmitting ? "Close guide submission" : "Create guide"}
                          title={isProfileSubmitting ? "Close guide submission" : "Create guide"}
                        >
                          <Plus
                            className={`h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                              isProfileSubmitting ? "rotate-45" : "rotate-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    <div
                      className={`relative min-h-0 flex-1 overflow-hidden transition-[margin-top] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isProfileRightPaneFilled ? "mt-0" : "mt-3"
                      }`}
                    >
                      <div
                        data-guides-scroll
                        className={`pane-cascade-item absolute inset-0 flex min-h-0 flex-col gap-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isProfileGuideTakingFullListPane ? "h-full overflow-hidden pr-0" : `${explorerBodyMaxHeight} overflow-y-auto pr-1`
                        } ${
                          isProfileSubmitting
                            ? "-translate-x-8 opacity-0 pointer-events-none"
                            : "translate-x-0 opacity-100 pointer-events-auto"
                        }`}
                      >
                        {isProfileGuideTakingFullListPane && profileExpandedGuide ? (
                          <MapListCard
                            key={profileExpandedGuide.id}
                            list={profileExpandedGuide}
                            expandable
                            expanded
                            fillPane
                            onToggleExpand={handleProfileGuideToggle}
                            onHoverStart={setHoveredGuide}
                            onHoverEnd={() => setHoveredGuide(null)}
                            onStopHoverChange={setHoveredStopId}
                            hoveredStopId={hoveredStopId}
                            onExpandedStopIdsChange={setVisibleNestedStopParentIds}
                            forceExpandStopId={selectedGuideStopId}
                            forceExpandStopNonce={selectedGuideStopNonce}
                            onEditGuide={handleEditGuideFromProfile}
                            onEditItinerary={handleEditItineraryFromGuide}
                          />
                        ) : profileRailLists.length ? (
                          profileRailLists.map((list) => (
                            <MapListCard
                              key={list.id}
                              list={list}
                              expandable
                              expanded={profileExpandedGuideId === list.id}
                              onToggleExpand={handleProfileGuideToggle}
                              onHoverStart={setHoveredGuide}
                              onHoverEnd={() => setHoveredGuide(null)}
                              onStopHoverChange={setHoveredStopId}
                              hoveredStopId={hoveredStopId}
                              forceExpandStopId={selectedGuideStopId}
                              forceExpandStopNonce={selectedGuideStopNonce}
                              onEditGuide={handleEditGuideFromProfile}
                              onEditItinerary={handleEditItineraryFromGuide}
                            />
                          ))
                        ) : (
                          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center">
                            <p className="text-sm font-medium text-slate-900">No {activeProfileRightRail} yet</p>
                          </div>
                        )}
                      </div>
                      <div
                        className={`absolute inset-0 z-30 min-h-0 overflow-hidden bg-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isProfileSubmitting
                            ? "translate-x-0 opacity-100 pointer-events-auto"
                            : "translate-x-10 opacity-0 pointer-events-none"
                        }`}
                      >
                        <SubmitListForm
                          onSelectionChange={setProfileSubmissionSelection}
                          onPreviewListChange={setProfileSubmissionPreviewList}
                          mapPinnedLocation={profileMapPinnedLocation}
                          editListId={profileEditingListId}
                          submissionType={profileSubmissionType}
                          guideSubmissionVariant={profileGuideSubmissionVariant}
                          onSubmissionModeChange={(nextType, nextVariant) => {
                            setProfileSubmissionType(nextType);
                            setProfileGuideSubmissionVariant(nextVariant);
                          }}
                          hideModeToggle
                          fillPane
                          onClose={() => {
                            setProfileEditingListId(null);
                            setProfileSubmissionPreviewList(null);
                            setIsProfileSubmitting(false);
                          }}
                          onSubmitted={() => {
                            setProfileEditingListId(null);
                            setProfileSubmissionPreviewList(null);
                            setIsProfileSubmitting(false);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            </div>
          </div>
        </div>
        </div>
        <div className={`z-20 hidden w-full shrink-0 flex-row items-center gap-3 overflow-x-auto px-3 py-1 sm:px-4 lg:flex lg:w-14 lg:-translate-x-1 lg:flex-col lg:overflow-visible lg:px-0 lg:py-0 lg:pt-7 ${railTransitionClass}`}>
            {isProfileMode ? (
              profileRightRailOptions.map((option, index) => (
                <div
                  key={option.id}
                  className="rail-switch-item profile-rail-item relative h-10 w-10"
                  style={profileRailItemStyle(index)}
                >
                  <button
                    type="button"
                    onClick={() => setActiveProfileRightRail(option.id)}
                    className={`guide-rail-button relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-700 shadow-sm transition hover:scale-105 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 ${
                      activeProfileRightRail === option.id ? "guide-rail-button-active border-slate-900 text-slate-900" : ""
                    }`}
                    aria-label={option.label}
                    title={option.label}
                  >
                    <option.icon className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <>
            {guideRailOptions.map((option, index) => (
              <div
                key={option.id}
                className="rail-switch-item relative h-10 w-10"
                style={explorerRightRailItemStyle(index)}
              >
                <button
                  type="button"
                  onClick={() => setActiveGuideRail(option.id)}
                  style={
                    activeGuideRail === option.id
                      ? {
                          color: guideRailActiveColorById[option.id],
                          borderColor: guideRailActiveColorById[option.id],
                        }
                      : undefined
                  }
                  className={`guide-rail-button margin-shell-pop-in relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-700 shadow-sm transition hover:scale-105 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 ${
                    activeGuideRail === option.id
                      ? "guide-rail-button-active"
                      : ""
                  }`}
                  aria-label={option.label}
                  title={option.label}
                >
                  {option.id === "r-guides" ? (
                    <span className="text-sm font-semibold tracking-tight">R</span>
                  ) : option.icon ? (
                    <option.icon
                      className={`h-4 w-4 ${
                        activeGuideRail === option.id && guideRailFillOnActiveIds.has(option.id)
                          ? "fill-current"
                          : ""
                      }`}
                    />
                  ) : null}
                </button>
              </div>
            ))}
              </>
            )}
          </div>
      </div>
    </section>
  );
}
