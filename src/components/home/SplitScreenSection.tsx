"use client";

import {
  BedDouble,
  Bookmark,
  Building2,
  Camera,
  ChevronDown,
  ChevronRight,
  CloudSun,
  Flag,
  Globe2,
  Footprints,
  Lock,
  LogOut,
  Map as MapIcon,
  MapPin,
  Plus,
  Search,
  SquareArrowOutUpRight,
  Star,
  UserRound,
  X,
} from "@/components/icons/MaterialSymbol";
import Link from "next/link";
import { startTransition, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";

import { MapListCard } from "@/components/cards/MapListCard";
import type { GuideCrossLink, GuideCrossLinkGroup } from "@/components/cards/GuideCrossLinks";
import {
  MaterialCalendarMonth,
  MaterialFavorite,
  MaterialInfo,
  MaterialMap,
  MaterialPerson,
  MaterialRoute,
} from "@/components/icons/MaterialSymbol";
import { SubmitListForm } from "@/components/list/SubmitListForm";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { ContinentList } from "@/components/map/ContinentList";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { StateShapeIcon } from "@/components/map/StateShapeIcon";
import { SearchBar } from "@/components/shared/SearchBar";
import {
  BRIAN_PROFILE_FAVORITES,
  DEFAULT_PROFILE_FAVORITES,
  FOOD_CUISINE_ANY,
  FOOD_OPEN_TIME_OPTIONS,
  FOOD_PRICE_OPTIONS,
  MORPH_GROW_MS,
  MORPH_LEFT_ALIGN_OFFSET_PX,
  MORPH_LEFT_MS,
  MORPH_TOTAL_MS,
  MORPH_UP_MS,
  NIGHTLIFE_BAR_TYPE_ANY,
  NIGHTLIFE_BAR_TYPE_OPTIONS,
  NIGHTLIFE_MUSIC_TYPE_ANY,
  NIGHTLIFE_MUSIC_TYPE_OPTIONS,
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
  doesListMatchFoodCuisine,
  doesListMatchFoodPrice,
  doesListMatchCategory,
  doesListMatchNightlifeMusicType,
  doesListMatchSubcategory,
  filterListStopsByFoodPrice,
  generalFoodCuisines,
  guideRailOptions,
  inferNightlifeBarType,
  isItineraryList,
  isPrivateJournalExperience,
  profileLeftRailOptions,
  profileRightRailOptions,
} from "@/components/home/split-screen-config";
import {
  ExitingRailIcon,
  GUIDE_CHROME_WIPE_MS,
  GUIDE_COLLAPSE_CONTENT_START_MS,
  GUIDE_CONTENT_REVEAL_DELAY_MS,
  GUIDE_DIRECT_CONTENT_REVEAL_DELAY_MS,
  GUIDE_LAYOUT_CLOSE_TOTAL_MS,
  GUIDE_LAYOUT_CLOSE_VERTICAL_OFFSET,
  GUIDE_LAYOUT_MOTION_MS,
  GUIDE_LAYOUT_OPEN_SIDEWAYS_OFFSET,
  GUIDE_LAYOUT_OPEN_TOTAL_MS,
  GUIDE_OPEN_EXPAND_START_MS,
  GUIDE_PRE_COLLAPSE_CONTENT_MS,
  useSplitScreenAnimationState,
} from "@/components/home/split-screen/animation-helpers";
import { useFilterState } from "@/components/home/split-screen/filter-state";
import { useGuideRailState } from "@/components/home/split-screen/guide-rail-state";
import { getDefaultCountryBrowseView, MapViewportInsets, useMapState } from "@/components/home/split-screen/map-state";
import {
  MOBILE_ALL_CITIES_VALUE,
  MOBILE_ALL_COUNTRIES_VALUE,
  MOBILE_ALL_NEIGHBORHOODS_VALUE,
  MOBILE_ALL_REGIONS_VALUE,
  MOBILE_ALL_STATES_VALUE,
  useMobileControlsState,
} from "@/components/home/split-screen/mobile-controls-state";
import { MobileBrowseSelect } from "@/components/home/split-screen/mobile-controls";
import {
  buildScopedCategoryDescription,
  categoryCityDescriptionOverrides,
  categoryCityDescriptionProfiles,
  cityHighlightCategoryOrder,
  getCityHighlightThemes,
} from "@/components/home/split-screen/filters";
import {
  doesGuideMatchHighlightTheme,
  getLightCategoryTextColor,
} from "@/components/home/split-screen/guide-rail";
import {
  buildCategoryInsight,
  buildCategoryInsightNotes,
} from "@/components/home/split-screen/category-insights";
import {
  getLeftPaneDefinitionTerms,
  type LeftPaneDefinitionTerm,
} from "@/components/home/split-screen/left-pane-definitions";
import { getNeighborhoodResearchStrength } from "@/components/home/split-screen/neighborhood-strength";
import { useProfilePlacesBeenState } from "@/components/home/split-screen/profile-places-been-state";
import { useRouteState } from "@/components/home/split-screen/route-state";
import { usePlacesBeenDirectory } from "@/components/home/use-places-been-directory";
import { getCountryFlagEmoji } from "@/lib/country-flag";
import { CATEGORIES, CATEGORY_STYLES } from "@/lib/constants";
import { getGuideCrossLinkGroups } from "@/lib/guide-cross-links";
import { buildAgodaStaySearchUrl, buildStay22DestinationUrl, shouldUseAgodaForStay } from "@/lib/stay22";
import {
  CityDeepLinkState,
  getGuideLastModified,
  isIndexableEditorialGuide,
  resolveContinentDeepLink,
  resolveCountryDeepLink,
  resolveCityDeepLink,
} from "@/lib/deep-link-routes";
import { ROUTE_SEGMENTS, type AppLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveLocalizedCityDeepLink } from "@/lib/i18n/deep-link-routes";
import type { DestinationRouteTranslation } from "@/lib/i18n/types";
import {
  getLocalizedCityCategoryPath,
  getLocalizedCityNeighborhoodPath,
  getLocalizedCityPath,
  getLocalizedContinentPath,
  getLocalizedCountryPath,
  getLocalizedGuidePath,
} from "@/lib/i18n/paths";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { updateSupabaseProfile, updateSupabaseProfileVisibility } from "@/lib/supabase/profile";
import { slugify } from "@/lib/utils";
import { getEditorialLists, useAppStore } from "@/store/app-store";
import type { FavoriteLocation } from "@/store/app-store";
import { Continent, ListCategory, MapList, SelectionState } from "@/types";

export interface SplitScreenSectionProps {
  continents: Continent[];
  initialEditorialGuides?: MapList[];
  initialRouteState?: CityDeepLinkState;
  seoContent?: {
    h1: string;
    intro: string;
  };
  locale?: AppLocale;
  destinationTranslations?: DestinationRouteTranslation[];
  publicProfile?: {
    creator: {
      id: string;
      name: string;
      avatar: string;
      bio: string;
      joinedAt?: string;
    };
    lists: MapList[];
    stats: {
      yearsAsUser: number;
      favoritesCount: number;
      itineraryCount: number;
      placesBeenCount: number;
    };
  };
  onGuideDataRequested?: (scope: { cityName?: string; countryName?: string; continentName?: string }) => void;
}

function areGuideStopsEquivalent(left: MapList["stops"], right: MapList["stops"]): boolean {
  return left.length === right.length && left.every((stop, index) => {
    const candidate = right[index];

    return (
      candidate?.id === stop.id &&
      candidate.photo === stop.photo &&
      areGuideStopsEquivalent(stop.places ?? [], candidate.places ?? [])
    );
  });
}

function areGuideCollectionsEquivalent(left: MapList[], right: MapList[]) {
  if (left === right) {
    return true;
  }

  if (left.length !== right.length) {
    return false;
  }

  return left.every((guide, index) => {
    const candidate = right[index];

    return (
      candidate?.id === guide.id &&
      candidate.title === guide.title &&
      candidate.description === guide.description &&
      candidate.upvotes === guide.upvotes &&
      candidate.photo === guide.photo &&
      areGuideStopsEquivalent(guide.stops, candidate.stops)
    );
  });
}

type CityWeather = {
  temperature: number;
  condition: string;
};

const weatherCodeLabels: Record<number, string> = {
  0: "Clear",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Cloudy",
  45: "Fog",
  48: "Fog",
  51: "Drizzle",
  53: "Drizzle",
  55: "Drizzle",
  56: "Freezing drizzle",
  57: "Freezing drizzle",
  61: "Rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Freezing rain",
  71: "Snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Showers",
  81: "Showers",
  82: "Heavy showers",
  85: "Snow showers",
  86: "Snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm",
  99: "Thunderstorm",
};

function getWeatherLabel(code: number) {
  return weatherCodeLabels[code] ?? "Weather";
}

function normalizeCelsiusTemperature(temperature: number, unit?: string) {
  const normalizedUnit = unit?.toLowerCase() ?? "";

  if (normalizedUnit.includes("f")) {
    return (temperature - 32) * (5 / 9);
  }

  return temperature;
}

const explorerDescriptionCharacterLimit = 320;

function capExplorerDescription(description: string, limit = explorerDescriptionCharacterLimit) {
  const normalized = description.trim().replace(/\s+/g, " ");

  if (normalized.length <= limit) {
    return normalized;
  }

  const truncated = normalized.slice(0, limit + 1);
  const lastSpaceIndex = truncated.lastIndexOf(" ");
  const capped = normalized.slice(0, lastSpaceIndex > limit * 0.7 ? lastSpaceIndex : limit).trim();

  return `${capped.replace(/[.,;:!?-]+$/, "")}...`;
}

type DescriptionNeighborhoodMention = {
  id: string;
  name: string;
  isNested: boolean;
  parentSubareaId?: string;
  start: number;
  end: number;
};

type NeighborhoodMentionCandidate = {
  id: string;
  name: string;
  isNested: boolean;
  parentSubareaId?: string;
  foldedName: string;
};

type LeftPaneDefinitionMention = {
  term: LeftPaneDefinitionTerm;
  start: number;
  end: number;
};

function foldSearchText(value: string) {
  return value
    .replace(/[øØ]/g, "o")
    .replace(/[æÆ]/g, "ae")
    .replace(/[œŒ]/g, "oe")
    .replace(/[ß]/g, "ss")
    .replace(/[łŁ]/g, "l")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function foldSearchTextWithIndexMap(value: string) {
  let folded = "";
  const indexMap: number[] = [];

  for (let index = 0; index < value.length; index += 1) {
    const foldedCharacter = foldSearchText(value[index]);
    for (const character of foldedCharacter) {
      folded += character;
      indexMap.push(index);
    }
  }

  return { folded, indexMap };
}

function isFoldedWordCharacter(value?: string) {
  return Boolean(value && /[a-z0-9]/.test(value));
}

function findNeighborhoodMentionsInText(
  text: string,
  candidates: NeighborhoodMentionCandidate[],
): DescriptionNeighborhoodMention[] {
  const { folded, indexMap } = foldSearchTextWithIndexMap(text);
  const occupied = Array.from({ length: text.length }, () => false);
  const mentions: DescriptionNeighborhoodMention[] = [];

  for (const candidate of candidates) {
    let searchFrom = 0;
    while (searchFrom < folded.length) {
      const foldedStart = folded.indexOf(candidate.foldedName, searchFrom);
      if (foldedStart === -1) {
        break;
      }

      const foldedEnd = foldedStart + candidate.foldedName.length;
      const hasWordBefore = isFoldedWordCharacter(folded[foldedStart - 1]);
      const hasWordAfter = isFoldedWordCharacter(folded[foldedEnd]);
      const start = indexMap[foldedStart];
      const end = (indexMap[foldedEnd - 1] ?? start) + 1;
      const overlaps = occupied.slice(start, end).some(Boolean);

      if (!hasWordBefore && !hasWordAfter && !overlaps) {
        mentions.push({
          id: candidate.id,
          name: candidate.name,
          isNested: candidate.isNested,
          parentSubareaId: candidate.parentSubareaId,
          start,
          end,
        });
        for (let index = start; index < end; index += 1) {
          occupied[index] = true;
        }
      }

      searchFrom = foldedEnd;
    }
  }

  return mentions.sort((left, right) => left.start - right.start);
}

function findLeftPaneDefinitionMentionsInText(
  text: string,
  terms: LeftPaneDefinitionTerm[],
  blockedMentions: Array<{ start: number; end: number }> = [],
): LeftPaneDefinitionMention[] {
  if (!terms.length) {
    return [];
  }

  const { folded, indexMap } = foldSearchTextWithIndexMap(text);
  const occupied = Array.from({ length: text.length }, () => false);
  const mentions: LeftPaneDefinitionMention[] = [];

  for (const blockedMention of blockedMentions) {
    for (let index = blockedMention.start; index < blockedMention.end; index += 1) {
      occupied[index] = true;
    }
  }

  const aliases = terms
    .flatMap((term) =>
      (term.aliases?.length ? term.aliases : [term.term]).map((alias) => ({
        term,
        foldedAlias: foldSearchText(alias),
      })),
    )
    .filter((item) => item.foldedAlias.length > 1)
    .sort((left, right) => right.foldedAlias.length - left.foldedAlias.length);

  for (const item of aliases) {
    let searchFrom = 0;
    while (searchFrom < folded.length) {
      const foldedStart = folded.indexOf(item.foldedAlias, searchFrom);
      if (foldedStart === -1) {
        break;
      }

      const foldedEnd = foldedStart + item.foldedAlias.length;
      const hasWordBefore = isFoldedWordCharacter(folded[foldedStart - 1]);
      const hasWordAfter = isFoldedWordCharacter(folded[foldedEnd]);
      const start = indexMap[foldedStart];
      const end = (indexMap[foldedEnd - 1] ?? start) + 1;
      const overlaps = occupied.slice(start, end).some(Boolean);

      if (!hasWordBefore && !hasWordAfter && !overlaps) {
        mentions.push({
          term: item.term,
          start,
          end,
        });
        for (let index = start; index < end; index += 1) {
          occupied[index] = true;
        }
      }

      searchFrom = foldedEnd;
    }
  }

  return mentions.sort((left, right) => left.start - right.start);
}

function FavoriteLocationRow({
  location,
  active,
  onSelect,
}: {
  location: FavoriteLocation;
  active?: boolean;
  onSelect: (location: FavoriteLocation) => void;
}) {
  const Icon =
    location.kind === "continent"
      ? Globe2
      : location.kind === "country"
      ? Flag
      : location.kind === "city"
        ? Building2
        : MapPin;

  return (
    <button
      type="button"
      onClick={() => onSelect(location)}
      title={`${location.name}, ${location.detail}`}
      className={`flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm transition ${
        active
          ? "bg-teal-50 text-teal-800"
          : "text-slate-700 hover:bg-stone-100"
      }`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${active ? "text-teal-700" : "text-slate-500"}`} />
      <span className="min-w-0 flex-1">
        <span className={`block truncate font-medium ${active ? "text-teal-900" : "text-slate-800"}`}>
          {location.name}
        </span>
        <span className={`block truncate text-xs ${active ? "text-teal-700" : "text-slate-500"}`}>
          {location.detail}
        </span>
      </span>
    </button>
  );
}

function CityWeatherChip({
  cityId,
  cityName,
  coordinates,
  onImage = false,
  placement = "absolute",
}: {
  cityId?: string;
  cityName?: string;
  coordinates?: [number, number];
  onImage?: boolean;
  placement?: "absolute" | "inline";
}) {
  const [weather, setWeather] = useState<CityWeather | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!cityId || !coordinates) {
      setWeather(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const endpoint = new URL("https://api.open-meteo.com/v1/forecast");
    endpoint.searchParams.set("latitude", coordinates[0].toString());
    endpoint.searchParams.set("longitude", coordinates[1].toString());
    endpoint.searchParams.set("current", "temperature_2m,weather_code");
    endpoint.searchParams.set("temperature_unit", "celsius");
    endpoint.searchParams.set("forecast_days", "1");

    setIsLoading(true);
    setWeather(null);

    fetch(endpoint.toString(), { cache: "no-store", signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Weather request failed: ${response.status}`);
        }
        return response.json() as Promise<{
          current_units?: {
            temperature_2m?: string;
          };
          current?: {
            temperature_2m?: number;
            weather_code?: number;
          };
        }>;
      })
      .then((data) => {
        const temperature = data.current?.temperature_2m;
        const code = data.current?.weather_code;
        if (typeof temperature !== "number" || typeof code !== "number") {
          setWeather(null);
          return;
        }
        setWeather({
          temperature: normalizeCelsiusTemperature(temperature, data.current_units?.temperature_2m),
          condition: getWeatherLabel(code),
        });
      })
      .catch((error) => {
        if ((error as Error).name !== "AbortError") {
          setWeather(null);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [cityId, coordinates]);

  if (!cityId || !coordinates || (!weather && !isLoading)) {
    return null;
  }

  return (
    <div
      className={`${placement === "absolute" ? "absolute right-0 top-4 z-20" : "relative"} flex max-w-[7.25rem] items-start justify-end gap-1.5 text-right text-xs ${
        onImage
          ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
          : "rounded-full bg-white/80 px-2.5 py-2 text-slate-600 shadow-sm ring-1 ring-slate-200 backdrop-blur"
      }`}
      title={weather ? `${cityName ?? "City"} weather: ${Math.round(weather.temperature)}°C, ${weather.condition}` : "Loading weather"}
      aria-live="polite"
    >
      <CloudSun className={`h-8 w-8 shrink-0 self-stretch ${onImage ? "text-amber-200" : "text-orange-500"}`} aria-hidden="true" />
      {weather ? (
        <span className="min-w-0 leading-tight">
          <span className={`block text-sm font-semibold ${onImage ? "text-white" : "text-slate-900"}`}>
            {Math.round(weather.temperature)}
            °C
          </span>
          <span className="block truncate font-medium">{weather.condition}</span>
        </span>
      ) : (
        <span className="font-medium">...</span>
      )}
    </div>
  );
}

export function SplitScreenSection({
  continents,
  initialEditorialGuides = [],
  initialRouteState,
  seoContent,
  locale = "en",
  destinationTranslations = [],
  publicProfile,
  onGuideDataRequested,
}: SplitScreenSectionProps) {
  const dictionary = getDictionary(locale);
  const browseLabels = dictionary.browse;
  const getCategoryLabel = (category: ListCategory) => dictionary.categories[category];

  useEffect(() => {
    document.documentElement.classList.remove("rguide-hydration-timeout");
    document.documentElement.classList.add("rguide-split-screen-ready");

    return () => {
      document.documentElement.classList.remove("rguide-split-screen-ready");
    };
  }, []);

  const currentUser = useAppStore((state) => state.currentUser);
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);
  const isProfileShellActive = useAppStore((state) => state.isProfileShellActive);
  const openAuthModal = useAppStore((state) => state.openAuthModal);
  const logout = useAppStore((state) => state.logout);
  const setProfileShellActive = useAppStore((state) => state.setProfileShellActive);
  const setEditorialLists = useAppStore((state) => state.setEditorialLists);
  const favoriteIds = useAppStore((state) => state.favoriteIds);
  const favoriteLocations = useAppStore((state) => state.favoriteLocations);
  const toggleFavoriteLocation = useAppStore((state) => state.toggleFavoriteLocation);
  const votedIds = useAppStore((state) => state.votedIds);
  const savedGuideIds = useMemo(() => new Set([...favoriteIds, ...votedIds]), [favoriteIds, votedIds]);
  const itineraryIds = useAppStore((state) => state.itineraryIds);
  const itineraryPlaylists = useAppStore((state) => state.itineraryPlaylists);
  const editorialLists = useAppStore((state) => state.editorialLists);
  const submittedLists = useAppStore((state) => state.submittedLists);
  const submitList = useAppStore((state) => state.submitList);
  const hydratedEditorialLists =
    initialEditorialGuides.length && !areGuideCollectionsEquivalent(editorialLists, initialEditorialGuides)
      ? initialEditorialGuides
      : editorialLists.length
        ? editorialLists
        : initialEditorialGuides;
  const activeEditorialLists = useMemo(
    () => getEditorialLists(hydratedEditorialLists),
    [hydratedEditorialLists],
  );
  const getDestinationTranslation = (
    destination: { id?: string; name: string },
    scope: DestinationRouteTranslation["scope"],
  ) => destinationTranslations.find(
    (translation) =>
      translation.scope === scope &&
      (translation.legacyId === destination.id || translation.sourceName === destination.name),
  );
  const getRouteCityPath = (city: Parameters<typeof getLocalizedCityPath>[1] & { id?: string }) =>
    getLocalizedCityPath(locale, city, getDestinationTranslation(city, "city")?.slug);
  const getRouteCountryPath = (country: Parameters<typeof getLocalizedCountryPath>[1] & { id?: string }) =>
    getLocalizedCountryPath(locale, country, getDestinationTranslation(country, "country")?.slug);
  const getRouteContinentPath = (continent: Parameters<typeof getLocalizedContinentPath>[1] & { id?: string }) =>
    getLocalizedContinentPath(locale, continent, getDestinationTranslation(continent, "continent")?.slug);
  const getRouteNeighborhoodPath = (
    city: Parameters<typeof getLocalizedCityNeighborhoodPath>[1],
    neighborhood: Parameters<typeof getLocalizedCityNeighborhoodPath>[2],
  ) => getLocalizedCityNeighborhoodPath(
    locale,
    city,
    neighborhood,
    getDestinationTranslation(city, "city")?.slug,
    getDestinationTranslation(neighborhood, "neighborhood")?.slug,
  );
  const getRouteCategoryPath = (
    city: Parameters<typeof getLocalizedCityCategoryPath>[1],
    category: Parameters<typeof getLocalizedCityCategoryPath>[2],
    neighborhood?: Parameters<typeof getLocalizedCityCategoryPath>[3],
  ) => getLocalizedCityCategoryPath(
    locale,
    city,
    category,
    neighborhood,
    getDestinationTranslation(city, "city")?.slug,
    neighborhood ? getDestinationTranslation(neighborhood, "neighborhood")?.slug : undefined,
  );
  const getRouteGuidePath = (
    city: Parameters<typeof getLocalizedGuidePath>[1],
    guide: Parameters<typeof getLocalizedGuidePath>[2],
    neighborhood?: Parameters<typeof getLocalizedGuidePath>[3],
  ) => getLocalizedGuidePath(
    locale,
    city,
    guide,
    neighborhood,
    getDestinationTranslation(city, "city")?.slug,
    neighborhood ? getDestinationTranslation(neighborhood, "neighborhood")?.slug : undefined,
  );
  const {
    selection,
    setSelection,
    focusedCountrySignal,
    setFocusedCountrySignal,
    activeCategory,
    setActiveCategory,
    continentBrowseView,
    setContinentBrowseView,
    countryBrowseView,
    setCountryBrowseView,
    stateBrowseView,
    setStateBrowseView,
    regionBrowseView,
    setRegionBrowseView,
    initialRouteStateKey,
    selectionRef,
    activeCategoryRef,
    skipInitialSelectionCleanupRef,
  } = useRouteState({ continents, initialRouteState });
  const {
    visibleSubcategoryCategory,
    setVisibleSubcategoryCategory,
    isSubcategoryClosing,
    setIsSubcategoryClosing,
    isSubcategoryCollapsing,
    setIsSubcategoryCollapsing,
    hoveredCategoryLabel,
    setHoveredCategoryLabel,
    activeSubcategory,
    setActiveSubcategory,
    activeFoodPrice,
    setActiveFoodPrice,
    activeFoodOpenTime,
    setActiveFoodOpenTime,
    isFoodOpenTimeMenuOpen,
    setIsFoodOpenTimeMenuOpen,
    activeFoodCuisine,
    setActiveFoodCuisine,
    isFoodCuisineMenuOpen,
    setIsFoodCuisineMenuOpen,
    activeNightlifeBarType,
    setActiveNightlifeBarType,
    isNightlifeBarMenuOpen,
    setIsNightlifeBarMenuOpen,
    activeNightlifeMusicType,
    setActiveNightlifeMusicType,
    isNightlifeMusicMenuOpen,
    setIsNightlifeMusicMenuOpen,
  } = useFilterState();
  const {
    hoveredGuide,
    setHoveredGuide,
    hoveredGuideMarkerId,
    setHoveredGuideMarkerId,
    hoveredStopId,
    setHoveredStopId,
    visibleNestedStopParentIds,
    setVisibleNestedStopParentIds,
    visibleGuideMarkerIds,
    setVisibleGuideMarkerIds,
    selectedGuideStopId,
    setSelectedGuideStopId,
    selectedGuideStopNonce,
    setSelectedGuideStopNonce,
    activeGuideFitNonce,
    setActiveGuideFitNonce,
    mapResizeSignal,
    setMapResizeSignal,
    mapViewportInsets,
    setMapViewportInsets,
  } = useMapState();
  const {
    activeGuideRail,
    setActiveGuideRail,
    activeGuideSource,
    setActiveGuideSource,
    isLocationFavoritesRailActive,
    setIsLocationFavoritesRailActive,
    expandedGuideId,
    setExpandedGuideId,
    pendingSourcesOpenGuideId,
    setPendingSourcesOpenGuideId,
    closingGuide,
    setClosingGuide,
    closingGuidePhase,
    setClosingGuidePhase,
    openingGuideId,
    setOpeningGuideId,
    settlingGuideContentId,
    setSettlingGuideContentId,
    expandedGuideIdRef,
    skipInitialGuideRailCleanupRef,
    categoryBeforeGuideExpandRef,
    clearCategoryBeforeGuideExpand,
    captureCategoryBeforeGuideExpand: captureCategoryBeforeGuideExpandBase,
  } = useGuideRailState({ initialRouteState });
  const {
    isDesktopSearchOpen,
    setIsDesktopSearchOpen,
    isMobileExplorerSearchOpen,
    setIsMobileExplorerSearchOpen,
    isMobileListSheetExpanded,
    setIsMobileListSheetExpanded,
    isMobileListSheetDragging,
    setIsMobileListSheetDragging,
    mobileListSheetDragHeight,
    setMobileListSheetDragHeight,
    mobileListSheetDraggingRef,
    mobileListSheetDragStartRef,
    mobileListSheetTapCandidateRef,
    mobileAllSelection,
    setMobileAllSelection,
  } = useMobileControlsState();

  useEffect(() => {
    if (!initialEditorialGuides.length) {
      return;
    }

    if (!areGuideCollectionsEquivalent(useAppStore.getState().editorialLists, initialEditorialGuides)) {
      setEditorialLists(initialEditorialGuides);
    }
  }, [initialEditorialGuides, setEditorialLists]);
  const {
    activeProfileLeftRail,
    setActiveProfileLeftRail,
    activePlacesBeenFilter,
    setActivePlacesBeenFilter,
    manualPlacesBeenCountries,
    setManualPlacesBeenCountries,
    manualPlacesBeenCities,
    setManualPlacesBeenCities,
    manualPlacesBeenPlaces,
    setManualPlacesBeenPlaces,
    isAddingPlacesBeenCountry,
    setIsAddingPlacesBeenCountry,
    draftPlacesBeenCountry,
    setDraftPlacesBeenCountry,
    expandedPlacesBeenCountries,
    setExpandedPlacesBeenCountries,
    focusedPlacesBeenStopIds,
    setFocusedPlacesBeenStopIds,
    profilePlacesBeenMapSelection,
    setProfilePlacesBeenMapSelection,
    activeProfileRightRail,
    setActiveProfileRightRail,
    profileExpandedGuideId,
    setProfileExpandedGuideId,
    isProfileSubmitting,
    setIsProfileSubmitting,
    profileEditingListId,
    setProfileEditingListId,
    profileSubmissionType,
    setProfileSubmissionType,
    profileGuideSubmissionVariant,
    setProfileGuideSubmissionVariant,
    profileSubmissionSelection,
    setProfileSubmissionSelection,
    profileSubmissionPreviewList,
    setProfileSubmissionPreviewList,
    profileMapPinnedLocation,
    setProfileMapPinnedLocation,
    profileNameDraft,
    setProfileNameDraft,
    profileBioDraft,
    setProfileBioDraft,
    profileAvatarPreview,
    setProfileAvatarPreview,
    profileAvatarFile,
    setProfileAvatarFile,
    profileEditMessage,
    setProfileEditMessage,
    isSavingProfile,
    setIsSavingProfile,
    profileAvatarInputRef,
    previousProfileLeftRailRef,
  } = useProfilePlacesBeenState(currentUser);
  const {
    continentLabelRevealKey,
    setContinentLabelRevealKey,
    countryRevealKey,
    setCountryRevealKey,
    continentTitleMorph,
    setContinentTitleMorph,
    postMorphRevealPhase,
    setPostMorphRevealPhase,
    exitingRailIcons,
    setExitingRailIcons,
    profileIntroNonce,
    setProfileIntroNonce,
    displayShellMode,
    setDisplayShellMode,
    shellTransitionPhase,
    setShellTransitionPhase,
    guideRefs,
    guideLayoutPositionsRef,
    guideLayoutTargetIdsRef,
    shouldAnimateGuideLayoutRef,
    guideLayoutMotionRef,
    guideLayoutAnimationFramesRef,
    guideLayoutAnimationsRef,
    guideLayoutCleanupTimeoutsRef,
    closingGuideTimeoutRef,
    openingGuideTimeoutRef,
    openingGuideIdRef,
    guideContentRevealTimeoutRef,
    guideContentRevealFrameRef,
    initialGuideContentRevealScheduledRef,
    morphFrameRef,
    postMorphRevealTimeoutsRef,
    shellModeTimeoutsRef,
    wasProfileModeRef,
    previousRailIconsRef,
    shellViewportRef,
    leftPaneRef,
    mapViewportPanelRef,
    rightPaneRef,
    hoveredGuideMarkerScrollRef,
    guideScrollAnimationFrameRef,
    guideScrollSettleTimeoutRef,
  } = useSplitScreenAnimationState({
    isProfileShellActive,
    hasCurrentUser: Boolean(currentUser),
  });
  const globeRailVideoRef = useRef<HTMLVideoElement | null>(null);
  const [profileInlineEditNonce, setProfileInlineEditNonce] = useState(0);
  const [isMobileInfoModalOpen, setIsMobileInfoModalOpen] = useState(false);
  const [isDesktopGuideSourceMenuOpen, setIsDesktopGuideSourceMenuOpen] = useState(false);
  const [isDesktopGuideTypeMenuOpen, setIsDesktopGuideTypeMenuOpen] = useState(false);
  const [isMobileGuideSourceMenuOpen, setIsMobileGuideSourceMenuOpen] = useState(false);
  const [isMobileGuideTypeMenuOpen, setIsMobileGuideTypeMenuOpen] = useState(false);
  const [isProfileCreateModalOpen, setIsProfileCreateModalOpen] = useState(false);
  const [profileCreateName, setProfileCreateName] = useState("");
  const [profileCreateType, setProfileCreateType] = useState<"guide" | "itinerary" | "event">("guide");
  const [profileCreateCategory, setProfileCreateCategory] = useState<ListCategory>("Food");
  const [profileCreateContinentId, setProfileCreateContinentId] = useState("");
  const [profileCreateCountryId, setProfileCreateCountryId] = useState("");
  const [profileCreateCityId, setProfileCreateCityId] = useState("");
  const [profileCreateSubareaId, setProfileCreateSubareaId] = useState("");
  const [profileCreateNestedSubareaId, setProfileCreateNestedSubareaId] = useState("");
  const [isSavingProfileVisibility, setIsSavingProfileVisibility] = useState(false);
  const [isSigningOutProfile, setIsSigningOutProfile] = useState(false);
  const [profileSettingsMessage, setProfileSettingsMessage] = useState<string | null>(null);
  const [hoveredDescriptionNeighborhoodId, setHoveredDescriptionNeighborhoodId] = useState<string | null>(null);
  const [hoveredLeftPaneDefinition, setHoveredLeftPaneDefinition] = useState<{
    term: LeftPaneDefinitionTerm;
    x: number;
    y: number;
  } | null>(null);
  const [mobileLeftPaneDefinition, setMobileLeftPaneDefinition] = useState<LeftPaneDefinitionTerm | null>(null);
  const [exitingCategoryInsight, setExitingCategoryInsight] = useState<ReturnType<typeof buildCategoryInsight> | null>(null);
  const [exitingCategoryInsightNotes, setExitingCategoryInsightNotes] = useState<ReturnType<typeof buildCategoryInsightNotes>>([]);
  const lastCategoryInsightRef = useRef<ReturnType<typeof buildCategoryInsight> | null>(null);
  const lastCategoryInsightNotesRef = useRef<ReturnType<typeof buildCategoryInsightNotes>>([]);
  const categoryInsightExitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const captureCategoryBeforeGuideExpand = (category: ListCategory | null = activeCategoryRef.current) => {
    captureCategoryBeforeGuideExpandBase(category);
  };
  const clearGuideContentRevealSchedule = () => {
    if (guideContentRevealTimeoutRef.current) {
      clearTimeout(guideContentRevealTimeoutRef.current);
      guideContentRevealTimeoutRef.current = null;
    }
    if (guideContentRevealFrameRef.current) {
      cancelAnimationFrame(guideContentRevealFrameRef.current);
      guideContentRevealFrameRef.current = null;
    }
  };
  const deferGuideContentUntilMotionSettles = (guideId: string, delayMs = GUIDE_CONTENT_REVEAL_DELAY_MS) => {
    clearGuideContentRevealSchedule();
    setSettlingGuideContentId(guideId);
    guideContentRevealTimeoutRef.current = setTimeout(() => {
      guideContentRevealTimeoutRef.current = null;
      guideContentRevealFrameRef.current = requestAnimationFrame(() => {
        guideContentRevealFrameRef.current = null;
        startTransition(() => {
          setSettlingGuideContentId((current) => (current === guideId ? null : current));
        });
      });
    }, delayMs);
  };
  useEffect(() => {
    const initialExpandedGuideId = initialRouteState?.expandedGuideId;
    if (!initialExpandedGuideId || initialGuideContentRevealScheduledRef.current) {
      return;
    }

    initialGuideContentRevealScheduledRef.current = true;
    const revealTimeout = window.setTimeout(() => {
      startTransition(() => {
        setSettlingGuideContentId((current) => (current === initialExpandedGuideId ? null : current));
      });
    }, GUIDE_DIRECT_CONTENT_REVEAL_DELAY_MS);

    return () => window.clearTimeout(revealTimeout);
  }, [initialRouteState?.expandedGuideId]);
  const isPublicProfileMode = Boolean(publicProfile);
  const [isPublicProfileEntering, setIsPublicProfileEntering] = useState(isPublicProfileMode);

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
      setIsLocationFavoritesRailActive(false);
      setSelection(initialRouteState.selection);
    }
    if (currentCategory !== nextCategory) {
      setActiveCategory(nextCategory);
      setActiveSubcategory(null);
    }
    if (currentGuideId !== nextGuideId) {
      if (!nextGuideId && closingGuideTimeoutRef.current) {
        return;
      }
      if (nextGuideId) {
        if (!categoryBeforeGuideExpandRef.current.captured) {
          captureCategoryBeforeGuideExpand(null);
        }
      } else {
        clearCategoryBeforeGuideExpand();
      }
      setExpandedGuideId(nextGuideId);
      setClosingGuide(null);
      setVisibleNestedStopParentIds([]);
    }
    if (nextGuideId && currentGuideId !== nextGuideId) {
      setActiveGuideFitNonce((current) => current + 1);
    }
  }, [initialRouteStateKey]);

  useEffect(() => {
    const handlePopState = () => {
      const rawRouteSegments = window.location.pathname.split("/").filter(Boolean);
      const routeSegments = locale === "es" && rawRouteSegments[0] === "es"
        ? rawRouteSegments.slice(1)
        : rawRouteSegments;
      if (!routeSegments.length) {
        setIsLocationFavoritesRailActive(false);
        setSelection({});
        setActiveCategory(null);
        setActiveSubcategory(null);
        clearCategoryBeforeGuideExpand();
        setExpandedGuideId(null);
        setClosingGuide(null);
        setVisibleNestedStopParentIds([]);
        return;
      }

      if (routeSegments[0] === ROUTE_SEGMENTS[locale].continent) {
        const translated = locale === "es"
          ? destinationTranslations.find(
              (translation) => translation.scope === "continent" && translation.slug === routeSegments[1],
            )
          : undefined;
        const contentSegments = routeSegments.slice(1);
        if (translated) contentSegments[0] = slugify(translated.sourceName);
        const route = resolveContinentDeepLink(contentSegments, {
          continents,
        });
        if (!route) {
          return;
        }

        setIsLocationFavoritesRailActive(false);
        setSelection(route.selection);
        setActiveCategory(null);
        setActiveSubcategory(null);
        clearCategoryBeforeGuideExpand();
        setExpandedGuideId(null);
        setClosingGuide(null);
        setVisibleNestedStopParentIds([]);
        return;
      }

      if (routeSegments[0] === ROUTE_SEGMENTS[locale].country) {
        const translated = locale === "es"
          ? destinationTranslations.find(
              (translation) => translation.scope === "country" && translation.slug === routeSegments[1],
            )
          : undefined;
        const contentSegments = routeSegments.slice(1);
        if (translated) contentSegments[0] = slugify(translated.sourceName);
        const route = resolveCountryDeepLink(contentSegments, {
          continents,
        });
        if (!route) {
          return;
        }

        setIsLocationFavoritesRailActive(false);
        setSelection(route.selection);
        setActiveCategory(null);
        setActiveSubcategory(null);
        clearCategoryBeforeGuideExpand();
        setExpandedGuideId(null);
        setClosingGuide(null);
        setVisibleNestedStopParentIds([]);
        return;
      }

      if (routeSegments[0] !== ROUTE_SEGMENTS[locale].city) {
        return;
      }
      const route = locale === "es"
        ? resolveLocalizedCityDeepLink(locale, routeSegments.slice(1), {
            continents,
            guides: activeEditorialLists,
            destinationTranslations,
          })
        : resolveCityDeepLink(routeSegments.slice(1), { continents, guides: activeEditorialLists });
      if (!route) {
        return;
      }

      const currentGuideId = expandedGuideIdRef.current;
      setIsLocationFavoritesRailActive(false);
      setSelection(route.selection);
      setActiveCategory(route.activeCategory ?? null);
      setActiveSubcategory(null);
      if (route.expandedGuideId) {
        captureCategoryBeforeGuideExpand(null);
      } else {
        clearCategoryBeforeGuideExpand();
      }
      setExpandedGuideId(route.expandedGuideId ?? null);
      setClosingGuide(null);
      setVisibleNestedStopParentIds([]);
      if (route.expandedGuideId && currentGuideId !== route.expandedGuideId) {
        setActiveGuideFitNonce((current) => current + 1);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeEditorialLists, continents, destinationTranslations, locale]);

  useEffect(() => {
    setProfileNameDraft(currentUser?.name ?? "");
    setProfileBioDraft(currentUser?.bio ?? "");
    setProfileAvatarPreview(currentUser?.avatar ?? "");
    setProfileAvatarFile(null);
    setProfileSettingsMessage(null);
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
      visibility: currentUser.visibility ?? "public",
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
      visibility: currentUser.visibility ?? "public",
    });
    setProfileEditMessage("Profile updated.");
  };

  const handleProfileVisibilityChange = async (visibility: "public" | "private") => {
    if (!currentUser || currentUser.visibility === visibility || (!currentUser.visibility && visibility === "public")) {
      return;
    }

    const previousUser = currentUser;
    setIsSavingProfileVisibility(true);
    setProfileSettingsMessage(null);
    setCurrentUser({ ...currentUser, visibility });

    const { error } = await updateSupabaseProfileVisibility(visibility);
    setIsSavingProfileVisibility(false);

    if (error) {
      setCurrentUser(previousUser);
      setProfileSettingsMessage(error.message);
      return;
    }

    setProfileSettingsMessage(visibility === "public" ? "Profile set to public." : "Profile set to private.");
  };

  const handleProfileSignOut = async () => {
    setIsSigningOutProfile(true);
    setProfileSettingsMessage(null);

    const supabase = getSupabaseBrowserClient();
    const { error } = supabase ? await supabase.auth.signOut() : { error: null };

    if (error) {
      setIsSigningOutProfile(false);
      setProfileSettingsMessage(error.message);
      return;
    }

    logout();
    setProfileShellActive(false);
    setActiveProfileLeftRail(null);
    setIsSigningOutProfile(false);
  };
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const titleTextRef = useRef<HTMLSpanElement | null>(null);
  const morphTitleRef = useRef<HTMLDivElement | null>(null);
  const morphAnimationRef = useRef<Animation | null>(null);
  const morphCommitActionRef = useRef<(() => void) | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);
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
  const cancelMorphSequence = () => {
    morphAnimationRef.current?.cancel();
    morphAnimationRef.current = null;
    morphCommitActionRef.current = null;
    if (morphFrameRef.current) {
      cancelAnimationFrame(morphFrameRef.current);
      morphFrameRef.current = null;
    }
  };
  const startMorphSequence = (commitAction: () => void) => {
    cancelMorphSequence();
    morphCommitActionRef.current = commitAction;
    clearPostMorphRevealTimeouts();
    setPostMorphRevealPhase(0);
  };

  useLayoutEffect(() => {
    const element = morphTitleRef.current;
    const morph = continentTitleMorph;
    if (!element || !morph) {
      return;
    }

    const paneRect = leftPaneRef.current?.getBoundingClientRect();
    const titleEl = titleTextRef.current ?? titleRef.current;
    const titleRect = titleEl?.getBoundingClientRect();
    const offsetParentRect = (element.offsetParent as HTMLElement | null)?.getBoundingClientRect();
    const targetTop = offsetParentRect && titleRect
      ? titleRect.top - offsetParentRect.top
      : morph.toTop;
    const targetLeft = offsetParentRect && titleRect
      ? titleRect.left - offsetParentRect.left - MORPH_LEFT_ALIGN_OFFSET_PX
      : morph.toLeft;
    const targetWidth = titleRect
      ? getMorphHeaderTargetWidth(titleRect.width)
      : morph.toWidth;

    element.style.top = `${targetTop}px`;
    element.style.left = `${targetLeft}px`;
    element.style.width = `${targetWidth}px`;

    const targetHeight = element.offsetHeight || morph.toHeight;
    const fromScale = morph.toFontSize > 0 ? morph.fromFontSize / morph.toFontSize : 1;
    const sourceX = paneRect && titleRect
      ? paneRect.left + morph.fromLeft - titleRect.left
      : morph.fromLeft - targetLeft;
    const sourceY = paneRect && titleRect
      ? paneRect.top + morph.fromTop - titleRect.top
      : morph.fromTop - targetTop;
    const grownY = paneRect && titleRect
      ? paneRect.top + morph.fromTop + morph.fromHeight - targetHeight - titleRect.top
      : morph.fromTop + morph.fromHeight - targetHeight - targetTop;
    const growOffset = MORPH_GROW_MS / MORPH_TOTAL_MS;
    const leftOffset = (MORPH_GROW_MS + MORPH_LEFT_MS) / MORPH_TOTAL_MS;
    const sourceTransform = `translate3d(${sourceX}px, ${sourceY}px, 0) scale(${fromScale})`;
    const grownTransform = `translate3d(${sourceX}px, ${grownY}px, 0) scale(1)`;
    const leftTransform = `translate3d(0, ${grownY}px, 0) scale(1)`;
    const targetTransform = "translate3d(0, 0, 0) scale(1)";

    const animation = element.animate(
      [
        { offset: 0, transform: sourceTransform, easing: "cubic-bezier(0.22,0.61,0.36,1)" },
        { offset: growOffset, transform: grownTransform, easing: "cubic-bezier(0.22,0.61,0.36,1)" },
        { offset: leftOffset, transform: leftTransform, easing: "cubic-bezier(0.22,1,0.36,1)" },
        { offset: 1, transform: targetTransform },
      ],
      {
        duration: MORPH_TOTAL_MS,
        fill: "both",
      },
    );
    morphAnimationRef.current = animation;

    animation.onfinish = () => {
      animation.onfinish = null;
      morphAnimationRef.current = null;
      const action = morphCommitActionRef.current;
      morphCommitActionRef.current = null;
      action?.();

      morphFrameRef.current = requestAnimationFrame(() => {
        morphFrameRef.current = requestAnimationFrame(() => {
          setContinentTitleMorph(null);
          startPostMorphReveal();
          morphFrameRef.current = null;
        });
      });
    };

    return () => {
      animation.onfinish = null;
      animation.cancel();
      if (morphAnimationRef.current === animation) {
        morphAnimationRef.current = null;
      }
    };
  }, [continentTitleMorph]);
  const pushExplorerPath = (path: string) => {
    if (typeof window !== "undefined" && window.location.pathname !== path) {
      window.history.pushState(null, "", path);
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
  const getGuideCityRouteContext = (guide: MapList) => {
    const currentContext = getCityRouteContext(selection);
    if (
      currentContext &&
      (!guide.location.city || normalizeRoutePlaceName(currentContext.city.name) === normalizeRoutePlaceName(guide.location.city))
    ) {
      return currentContext;
    }

    if (!guide.location.city) {
      return currentContext;
    }

    for (const continent of continents) {
      if (guide.location.continent && normalizeRoutePlaceName(continent.name) !== normalizeRoutePlaceName(guide.location.continent)) {
        continue;
      }

      for (const country of continent.countries) {
        if (guide.location.country && normalizeRoutePlaceName(country.name) !== normalizeRoutePlaceName(guide.location.country)) {
          continue;
        }

        const city = country.cities.find(
          (item) => normalizeRoutePlaceName(item.name) === normalizeRoutePlaceName(guide.location.city),
        );
        if (city) {
          return { city, neighborhood: getGuideRouteNeighborhood(city, guide) };
        }
      }
    }

    return currentContext;
  };
  const getGuideCanonicalRoutePath = (guide: MapList) => {
    const context = getGuideCityRouteContext(guide);
    if (!context) {
      return null;
    }
    return getRouteGuidePath(context.city, guide, getGuideRouteNeighborhood(context.city, guide));
  };
  const getCurrentCityRoutePath = (categoryOverride: ListCategory | null = activeCategory) => {
    const context = getCityRouteContext(selection);
    if (!context) {
      return null;
    }
    if (categoryOverride) {
      return getRouteCategoryPath(context.city, categoryOverride, context.neighborhood);
    }
    if (context.neighborhood) {
      return getRouteNeighborhoodPath(context.city, context.neighborhood);
    }
    return getRouteCityPath(context.city);
  };
  const normalizeRoutePlaceName = (value?: string | null) =>
    (value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
  const getGuideRouteNeighborhood = (city: Continent["countries"][number]["cities"][number], guide: MapList) => {
    const neighborhoodName = guide.location.neighborhood;
    if (!neighborhoodName) {
      return undefined;
    }

    const neighborhoodKey = normalizeRoutePlaceName(neighborhoodName);
    for (const subarea of city.subareas ?? []) {
      if (normalizeRoutePlaceName(subarea.name) === neighborhoodKey) {
        return subarea;
      }

      const nestedSubarea = subarea.subareas?.find(
        (item) => normalizeRoutePlaceName(item.name) === neighborhoodKey,
      );
      if (nestedSubarea) {
        return nestedSubarea;
      }
    }

    return { name: neighborhoodName };
  };
  const restoreCategoryAfterGuideCollapse = () => {
    const snapshot = categoryBeforeGuideExpandRef.current;
    const restoredCategory = snapshot.captured ? snapshot.category : null;
    clearCategoryBeforeGuideExpand();
    setActiveCategory(restoredCategory);
    return restoredCategory;
  };
  const handleSelectContinent = (continentId: string) => {
    setFocusedCountrySignal(null);
    setIsLocationFavoritesRailActive(false);
    setSelection(() => ({ continentId }));
    const continent = continents.find((item) => item.id === continentId);
    if (continent) {
      pushExplorerPath(getRouteContinentPath(continent));
    }
  };
  const handleResetToGlobalView = () => {
    if (closingGuideTimeoutRef.current) {
      clearTimeout(closingGuideTimeoutRef.current);
      closingGuideTimeoutRef.current = null;
    }
    if (openingGuideTimeoutRef.current) {
      clearTimeout(openingGuideTimeoutRef.current);
      openingGuideTimeoutRef.current = null;
    }
    openingGuideIdRef.current = null;
    clearGuideContentRevealSchedule();
    setFocusedCountrySignal(null);
    setIsLocationFavoritesRailActive(false);
    setClosingGuide(null);
    setClosingGuidePhase(null);
    setOpeningGuideId(null);
    setExpandedGuideId(null);
    clearCategoryBeforeGuideExpand();
    setSettlingGuideContentId(null);
    setVisibleNestedStopParentIds([]);
    setHoveredStopId(null);
    setSelectedGuideStopId(null);
    setSelection({});
    pushExplorerPath("/");
  };
  const handleSelectContinentSubarea = (continentId: string, continentSubareaId: string) => {
    setFocusedCountrySignal(null);
    setIsLocationFavoritesRailActive(false);
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
  const getMorphHeaderTargetWidth = (fallbackWidth: number) =>
    Math.max(fallbackWidth, titleRef.current?.getBoundingClientRect().width ?? 0);
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
  const handleSelectCountry = (
    continentId: string,
    countryId: string,
    options?: { focusMap?: boolean },
  ) => {
    if (
      isProfileMode &&
      activeProfileLeftRail === "places-been" &&
      activePlacesBeenFilter === "countries" &&
      isAddingPlacesBeenCountry
    ) {
      setIsLocationFavoritesRailActive(false);
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
      return;
    }
    setFocusedCountrySignal(options?.focusMap === false ? null : { countryId, nonce: Date.now() });
    setIsLocationFavoritesRailActive(false);
    setSelection(() => ({ continentId, countryId }));
    const country = continents
      .find((continent) => continent.id === continentId)
      ?.countries.find((item) => item.id === countryId);
    if (country) {
      setActiveCategory(null);
      setActiveSubcategory(null);
      setExpandedGuideId(null);
      clearCategoryBeforeGuideExpand();
      setClosingGuide(null);
      pushExplorerPath(getRouteCountryPath(country));
    }
  };
  const handleSelectContinentFromGlobal = (
    continentId: string,
    triggerEl?: HTMLButtonElement | null,
  ) => {
    const selectedContinent = continents.find((continent) => continent.id === continentId);
    const paneRect = leftPaneRef.current?.getBoundingClientRect();
    const titleEl = titleTextRef.current ?? titleRef.current;
    const titleRect = titleEl?.getBoundingClientRect();

    cancelMorphSequence();

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
        toWidth: getMorphHeaderTargetWidth(titleRect.width),
        toHeight: titleRect.height,
        toFontSize,
      });
      startMorphSequence(() => handleSelectContinent(continentId));
      return;
    }
    handleSelectContinent(continentId);
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

    cancelMorphSequence();

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
        toWidth: getMorphHeaderTargetWidth(titleRect.width),
        toHeight: titleRect.height,
        toFontSize,
      });
      startMorphSequence(() => handleSelectCountry(continentId, countryId));
      return;
    }
    handleSelectCountry(continentId, countryId);
  };
  const handleSelectCity = (continentId: string, countryId: string, cityId: string) => {
    setFocusedCountrySignal(null);
    if (isProfileShellActive && !isPublicProfileMode) {
      setProfileShellActive(false);
      setActiveProfileLeftRail(null);
    }
    setIsLocationFavoritesRailActive(false);
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
      clearCategoryBeforeGuideExpand();
      setClosingGuide(null);
      pushExplorerPath(getRouteCityPath(city));
    }
  };
  const handleMapViewportSelection = ({
    continentId,
    countryId,
    cityId,
  }: {
    continentId: string;
    countryId: string;
    cityId?: string;
  }) => {
    if (cityId) {
      handleSelectCity(continentId, countryId, cityId);
      return;
    }

    handleSelectCountry(continentId, countryId, { focusMap: false });
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

    cancelMorphSequence();

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
        toWidth: getMorphHeaderTargetWidth(titleRect.width),
        toHeight: titleRect.height,
        toFontSize,
      });
      startMorphSequence(() => handleSelectCity(continentId, countryId, cityId));
      return;
    }
    handleSelectCity(continentId, countryId, cityId);
  };
  const handleSelectSubarea = (
    continentId: string,
    countryId: string,
    cityId: string,
    subareaId: string,
  ) => {
    setFocusedCountrySignal(null);
    setIsLocationFavoritesRailActive(false);
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
          ? getRouteCategoryPath(context.city, activeCategory, context.neighborhood)
          : context.neighborhood
            ? getRouteNeighborhoodPath(context.city, context.neighborhood)
            : getRouteCityPath(context.city);
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
    setIsLocationFavoritesRailActive(false);
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
          ? getRouteCategoryPath(context.city, activeCategory, context.neighborhood)
          : context.neighborhood
            ? getRouteNeighborhoodPath(context.city, context.neighborhood)
            : getRouteCityPath(context.city);
      pushExplorerPath(nextPath);
    }
  };
  const handleSelectCountrySubarea = (
    continentId: string,
    countryId: string,
    countrySubareaId: string,
  ) => {
    setFocusedCountrySignal(null);
    setIsLocationFavoritesRailActive(false);
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
    setIsLocationFavoritesRailActive(false);
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
    cancelMorphSequence();

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
        toWidth: getMorphHeaderTargetWidth(titleRect.width),
        toHeight: titleRect.height,
        toFontSize,
      });
      startMorphSequence(() =>
        handleSelectState(continentId, countryId, countrySubareaId, stateId),
      );
      return;
    }
    handleSelectState(continentId, countryId, countrySubareaId, stateId);
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

  useEffect(() => {
    if (activeLocation.city?.name) {
      onGuideDataRequested?.({ cityName: activeLocation.city.name });
      return;
    }
    if (activeLocation.country?.name) {
      onGuideDataRequested?.({ countryName: activeLocation.country.name });
      return;
    }
    if (activeLocation.continent?.name) {
      onGuideDataRequested?.({ continentName: activeLocation.continent.name });
      return;
    }
    onGuideDataRequested?.({});
  }, [activeLocation.city?.name, activeLocation.country?.name, activeLocation.continent?.name, onGuideDataRequested]);
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
  const normalizeLocationName = (value?: string | null) =>
    formatBreadcrumbName(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const locationsMatch = (left?: string | null, right?: string | null) => {
    const normalizedLeft = normalizeLocationName(left);
    const normalizedRight = normalizeLocationName(right);
    return Boolean(normalizedLeft && normalizedRight && normalizedLeft === normalizedRight);
  };
  const slugifyLocationPart = (value: string) =>
    normalizeLocationName(value)
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  const formatNeighborhoodFromSlug = (value: string) => {
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
  };
  const inferListNeighborhoodName = (list: MapList) => {
    if (list.location.neighborhood?.trim()) {
      return list.location.neighborhood.trim();
    }
    if (slugifyLocationPart(list.id).includes("citywide")) {
      return null;
    }
    const cityName = activeLocation.city?.name ?? list.location.city;
    if (!cityName) {
      return null;
    }

    const escapedCityName = cityName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const candidates = [list.seoTitle, list.title, list.seoDescription]
      .filter((value): value is string => Boolean(value?.trim()));

    for (const value of candidates) {
      const match = value.match(new RegExp(`\\b(?:in|near|on)\\s+([^,]+),\\s*${escapedCityName}\\b`, "i"));
      const neighborhoodName = match?.[1]?.trim();
      if (neighborhoodName && !locationsMatch(neighborhoodName, cityName)) {
        return neighborhoodName;
      }
    }

    const citySlug = slugifyLocationPart(cityName);
    const slugCandidates = [list.seoSlug, list.slug].filter((value): value is string => Boolean(value?.trim()));
    for (const slug of slugCandidates) {
      const normalizedSlug = slugifyLocationPart(slug);
      if (normalizedSlug.includes("citywide") || !normalizedSlug.startsWith(`${citySlug}-`)) {
        continue;
      }
      const neighborhoodName = formatNeighborhoodFromSlug(normalizedSlug.slice(citySlug.length + 1));
      if (neighborhoodName && !locationsMatch(neighborhoodName, cityName)) {
        return neighborhoodName;
      }
    }

    return null;
  };
  const isListNeighborhoodGuideForActiveCity = (list: MapList) =>
    Boolean(
      activeLocation.city &&
        normalizeNeighborhoodName(inferListNeighborhoodName(list)) &&
        !locationsMatch(inferListNeighborhoodName(list), activeLocation.city.name),
    );
  const isListInActiveCity = (list: MapList) =>
    Boolean(
      activeLocation.city &&
        (list.location.scope === "city" || list.location.scope === "neighborhood") &&
        locationsMatch(list.location.city, activeLocation.city.name),
    );
  const getCollapsedLocationSubtitleHiddenParts = (list: MapList) => {
    const hiddenParts: string[] = [];
    const addHiddenPart = (value?: string | null) => {
      const trimmedValue = value?.trim();
      if (trimmedValue) {
        hiddenParts.push(trimmedValue);
      }
    };

    if (activeGuideRail === "week-events" && list.id.startsWith("event-")) {
      addHiddenPart(list.location.city);
      addHiddenPart(list.location.country);
      addHiddenPart(list.location.continent);
    }

    if (isGlobalSelection) {
      if (locationsMatch(list.location.continent, "Global")) {
        addHiddenPart("Global");
      }
      return hiddenParts;
    }

    const sameContinent = locationsMatch(list.location.continent, activeLocation.continent?.name);
    const sameCountry =
      sameContinent && locationsMatch(list.location.country, activeLocation.country?.name ?? activeLocation.city?.country);
    const sameCity = sameCountry && locationsMatch(list.location.city, activeLocation.city?.name);

    if (activeLocation.city) {
      if (sameCity) {
        const activeNeighborhood = activeLocation.nestedSubarea ?? activeLocation.subarea;
        const listNeighborhoodName = inferListNeighborhoodName(list);
        if (activeNeighborhood && locationsMatch(listNeighborhoodName, activeNeighborhood.name)) {
          addHiddenPart(activeNeighborhood.name);
        }
        if (locationsMatch(listNeighborhoodName, activeLocation.city.name)) {
          addHiddenPart(listNeighborhoodName);
        }
        if (listNeighborhoodName && !locationsMatch(listNeighborhoodName, activeLocation.city.name)) {
          addHiddenPart(activeLocation.city.name);
        }
        addHiddenPart(activeLocation.country?.name ?? activeLocation.city.country);
        addHiddenPart(activeLocation.continent?.name ?? activeLocation.country?.continent);
      }
      return hiddenParts;
    }

    if (activeLocation.state || activeCountrySubarea || activeContinentSubarea) {
      return hiddenParts;
    }

    if (activeLocation.country && sameCountry) {
      addHiddenPart(activeLocation.country.name);
      addHiddenPart(activeLocation.continent?.name ?? activeLocation.country.continent);
      return hiddenParts;
    }

    if (activeLocation.continent && sameContinent) {
      addHiddenPart(activeLocation.continent.name);
    }

    return hiddenParts;
  };
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
  const activeDestinationImage = activeLocation.city?.image ?? activeLocation.country?.image ?? null;
  const activeFavoriteLocation = useMemo<FavoriteLocation | null>(() => {
    if (!activeLocation.continent) {
      return null;
    }

    if (!activeLocation.country) {
      return {
        id: `continent:${activeLocation.continent.id}`,
        kind: "continent",
        name: activeLocation.continent.name,
        detail: "Continent",
        selection: {
          continentId: activeLocation.continent.id,
        },
        createdAt: new Date().toISOString(),
      };
    }

    if (activeLocation.city && (activeLocation.nestedSubarea || activeLocation.subarea)) {
      const neighborhood = activeLocation.nestedSubarea ?? activeLocation.subarea;
      const parentSubareaId = activeLocation.nestedSubarea ? activeLocation.subarea?.id : neighborhood?.id;
      if (!neighborhood || !parentSubareaId) {
        return null;
      }

      return {
        id: `neighborhood:${activeLocation.continent.id}:${activeLocation.country.id}:${activeLocation.city.id}:${parentSubareaId}:${activeLocation.nestedSubarea?.id ?? ""}`,
        kind: "neighborhood",
        name: formatBreadcrumbName(neighborhood.name),
        detail: [activeLocation.nestedSubarea ? formatBreadcrumbName(activeLocation.subarea?.name) : null, activeLocation.city.name, activeLocation.country.name]
          .filter(Boolean)
          .join(", "),
        selection: {
          continentId: activeLocation.continent.id,
          countryId: activeLocation.country.id,
          countrySubareaId: activeLocation.city.countrySubareaId,
          stateId: activeLocation.city.stateId,
          cityId: activeLocation.city.id,
          subareaId: parentSubareaId,
          nestedSubareaId: activeLocation.nestedSubarea?.id,
        },
        createdAt: new Date().toISOString(),
      };
    }

    if (activeLocation.city) {
      return {
        id: `city:${activeLocation.continent.id}:${activeLocation.country.id}:${activeLocation.city.id}`,
        kind: "city",
        name: activeLocation.city.name,
        detail: activeLocation.country.name,
        selection: {
          continentId: activeLocation.continent.id,
          countryId: activeLocation.country.id,
          countrySubareaId: activeLocation.city.countrySubareaId,
          stateId: activeLocation.city.stateId,
          cityId: activeLocation.city.id,
        },
        createdAt: new Date().toISOString(),
      };
    }

    return {
      id: `country:${activeLocation.continent.id}:${activeLocation.country.id}`,
      kind: "country",
      name: activeLocation.country.name,
      detail: activeLocation.continent.name,
      selection: {
        continentId: activeLocation.continent.id,
        countryId: activeLocation.country.id,
      },
      createdAt: new Date().toISOString(),
    };
  }, [
    activeLocation.city,
    activeLocation.continent,
    activeLocation.country,
    activeLocation.nestedSubarea,
    activeLocation.subarea,
  ]);
  const isActiveLocationFavorited = Boolean(
    activeFavoriteLocation && favoriteLocations.some((location) => location.id === activeFavoriteLocation.id),
  );
  const favoriteLocationSections = useMemo(
    () =>
      [
        {
          key: "continent",
          label: "Continents",
          locations: favoriteLocations.filter((location) => location.kind === "continent"),
        },
        {
          key: "country",
          label: "Countries",
          locations: favoriteLocations.filter((location) => location.kind === "country"),
        },
        {
          key: "city",
          label: "Cities",
          locations: favoriteLocations.filter((location) => location.kind === "city"),
        },
        {
          key: "neighborhood",
          label: "Neighborhoods",
          locations: favoriteLocations.filter((location) => location.kind === "neighborhood"),
        },
      ].filter((section) => section.locations.length),
    [favoriteLocations],
  );
  const savedMapLocations = useMemo(
    () =>
      isLocationFavoritesRailActive
        ? favoriteLocations.map((location) => ({
            id: location.id,
            kind: location.kind,
            selection: location.selection,
          }))
        : [],
    [favoriteLocations, isLocationFavoritesRailActive],
  );
  const savedHighlightedCountryIds = useMemo(
    () =>
      isLocationFavoritesRailActive
        ? favoriteLocations
            .map((location) => location.selection.countryId)
            .filter((countryId): countryId is string => Boolean(countryId))
        : [],
    [favoriteLocations, isLocationFavoritesRailActive],
  );
  const handleFavoriteLocationSelect = (location: FavoriteLocation) => {
    setFocusedCountrySignal(null);
    setSelection(location.selection);
    setIsLocationFavoritesRailActive(false);
    setActiveGuideRail("all-guides");
    setActiveCategory(null);
    setActiveSubcategory(null);
    setExpandedGuideId(null);
    clearCategoryBeforeGuideExpand();
    setClosingGuide(null);

    const context = getCityRouteContext(location.selection);
    if (context?.neighborhood) {
      pushExplorerPath(getRouteNeighborhoodPath(context.city, context.neighborhood));
    } else if (context?.city) {
      pushExplorerPath(getRouteCityPath(context.city));
    }
  };
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
  const neighborhoodMentionCandidates = useMemo<NeighborhoodMentionCandidate[]>(
    () =>
      activeCitySubareas
        .flatMap((subarea) => [
          {
            id: subarea.id,
            name: subarea.name,
            isNested: false,
          },
          ...(subarea.subareas ?? []).map((nestedSubarea) => ({
            id: nestedSubarea.id,
            name: nestedSubarea.name,
            isNested: true,
            parentSubareaId: subarea.id,
          })),
        ])
        .map((item) => ({
          ...item,
          foldedName: foldSearchText(formatBreadcrumbName(item.name)),
        }))
        .filter((item) => item.foldedName.length >= 3)
        .sort((left, right) => right.foldedName.length - left.foldedName.length || left.name.localeCompare(right.name)),
    [activeCitySubareas, formatBreadcrumbName],
  );
  const activeCityNeighborhoodOrder = useMemo(() => {
    const order = new Map<string, number>();
    cityListItems.forEach((item, index) => {
      order.set(normalizeNeighborhoodName(item.name), index);
    });
    return order;
  }, [cityListItems]);
  const categorySortOrder = useMemo(() => {
    const order = new Map<ListCategory, number>();
    categoryOptions.forEach((option, index) => {
      order.set(option.category, index);
    });
    return order;
  }, []);
  const getCityGuideSortParts = (list: MapList) => {
    const neighborhoodName = inferListNeighborhoodName(list);
    const normalizedNeighborhood = normalizeNeighborhoodName(neighborhoodName);
    const isNeighborhoodGuide = Boolean(
      activeLocation.city &&
        normalizedNeighborhood &&
        !locationsMatch(neighborhoodName, activeLocation.city.name),
    );
    const neighborhoodRank = isNeighborhoodGuide
      ? activeCityNeighborhoodOrder.get(normalizedNeighborhood) ?? Number.MAX_SAFE_INTEGER
      : -1;
    return {
      scopeRank: isNeighborhoodGuide ? 1 : 0,
      neighborhoodRank,
      neighborhoodName: neighborhoodName ?? "",
      categoryRank: categorySortOrder.get(list.category) ?? Number.MAX_SAFE_INTEGER,
    };
  };
  const compareActiveCityGuideOrder = (left: MapList, right: MapList) => {
    const leftParts = getCityGuideSortParts(left);
    const rightParts = getCityGuideSortParts(right);
    const rightCreatedAt = Date.parse(right.createdAt);
    const leftCreatedAt = Date.parse(left.createdAt);
    const rightCreatedTime = Number.isFinite(rightCreatedAt) ? rightCreatedAt : 0;
    const leftCreatedTime = Number.isFinite(leftCreatedAt) ? leftCreatedAt : 0;

    return (
      leftParts.scopeRank - rightParts.scopeRank ||
      leftParts.neighborhoodRank - rightParts.neighborhoodRank ||
      leftParts.neighborhoodName.localeCompare(rightParts.neighborhoodName) ||
      leftParts.categoryRank - rightParts.categoryRank ||
      right.upvotes - left.upvotes ||
      rightCreatedTime - leftCreatedTime ||
      left.title.localeCompare(right.title)
    );
  };

  const selectedCityLists = useMemo(
    () =>
      activeLocation.city
        ? activeEditorialLists.filter(
            (list) =>
              (list.location.scope === "city" || list.location.scope === "neighborhood") &&
              locationsMatch(list.location.city, activeLocation.city?.name),
          )
        : [],
    [activeEditorialLists, activeLocation.city],
  );
  const selectedCountryLists = useMemo(
    () => {
      if (!activeLocation.country) {
        return [];
      }

      const countryName = activeLocation.country.name;
      const continentName = activeLocation.continent?.name ?? activeLocation.country.continent;

      return activeEditorialLists.filter(
        (list) =>
          list.location.country === countryName &&
          list.location.continent === continentName &&
          (list.location.scope === "country" || (isCountryRootSelection && list.location.scope === "city")),
      );
    },
    [activeEditorialLists, activeLocation.continent?.name, activeLocation.country, isCountryRootSelection],
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
  const selectedGlobalLists = useMemo(
    () =>
      isGlobalSelection
        ? activeEditorialLists.filter(
            (list) => list.location.scope === "continent" && list.location.continent === "Global",
          )
        : [],
    [activeEditorialLists, isGlobalSelection],
  );
  const coreActiveLists = activeLocation.city
    ? selectedCityLists
    : activeLocation.country
      ? selectedCountryLists
      : activeLocation.continent
        ? selectedContinentLists
        : selectedGlobalLists;
  const submittedPublicLists = useMemo(
    () =>
      submittedLists.filter(
        (list) =>
          list.visibility === "public" &&
          (list.submissionType !== "journal" || list.journal?.visibility !== "private"),
      ),
    [submittedLists],
  );
  const submittedActiveLists = useMemo(
    () =>
      submittedPublicLists.filter((list) =>
        (activeLocation.city
          ? isListInActiveCity(list) ||
            (list.location.scope === "country" &&
              list.location.country === activeLocation.country?.name &&
              list.location.continent === (activeLocation.continent?.name ?? activeLocation.country?.continent))
          : activeLocation.country
            ? list.location.country === activeLocation.country.name &&
              list.location.continent === (activeLocation.continent?.name ?? activeLocation.country.continent) &&
              (list.location.scope === "country" || (isCountryRootSelection && list.location.scope === "city"))
            : activeLocation.continent
              ? list.location.scope === "continent" && list.location.continent === activeLocation.continent.name
              : isGlobalSelection
                ? list.location.scope === "continent" && list.location.continent === "Global"
                : false),
      ),
    [activeLocation.city, activeLocation.continent, activeLocation.country, isCountryRootSelection, isGlobalSelection, submittedPublicLists],
  );
  const allActiveLists = useMemo(
    () => [...coreActiveLists, ...submittedActiveLists],
    [coreActiveLists, submittedActiveLists],
  );
  const globalMergedLists = useMemo(() => {
    const merged = [...submittedPublicLists, ...activeEditorialLists];
    const seen = new Set<string>();
    return merged.filter((list) => {
      if (seen.has(list.id)) {
        return false;
      }
      seen.add(list.id);
      return true;
    });
  }, [activeEditorialLists, submittedPublicLists]);
  const profileLists = useMemo(
    () => {
      if (!currentUser) {
        return [];
      }
      const merged = [
        ...submittedLists.filter((list) => list.creator.id === currentUser.id),
        ...globalMergedLists.filter((list) => list.creator.id === currentUser.id),
      ];
      const seen = new Set<string>();
      return merged.filter((list) => {
        if (seen.has(list.id)) {
          return false;
        }
        seen.add(list.id);
        return true;
      });
    },
    [currentUser, globalMergedLists, submittedLists],
  );
  const profileGuides = useMemo(
    () => profileLists.filter((list) => list.submissionType !== "journal" && list.submissionType !== "itinerary"),
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
    const isEventList = (list: MapList) => list.id.startsWith("event-");
    const isJourneyList = (list: MapList) => isItineraryList(list, noKnownItineraryIds);
    const profileVisibleLists = [...profileLists, ...globalMergedLists].filter(
      (list, index, listSet) => listSet.findIndex((candidate) => candidate.id === list.id) === index,
    );
    const favoriteLists = profileVisibleLists.filter((list) => savedGuideIds.has(list.id));
    const sourceLists =
      activeGuideSource === "favorites"
        ? favoriteLists
        : activeGuideSource === "user-guides"
          ? profileLists
          : [...profileLists, ...favoriteLists].filter(
              (list, index, listSet) =>
                listSet.findIndex((candidate) => candidate.id === list.id) === index,
            );

    return sourceLists.filter((list) => {
      if (activeGuideRail === "all-guides") {
        if (isEventList(list) || list.submissionType === "journal" || isJourneyList(list)) {
          return false;
        }
      } else if (activeGuideRail === "week-events") {
        if (!isEventList(list)) {
          return false;
        }
      } else if (activeGuideRail === "itinerary") {
        if (list.submissionType === "journal" || !isJourneyList(list)) {
          return false;
        }
      } else if (list.submissionType === "journal") {
        return false;
      }

      if (activeCategory && !doesListMatchCategory(list, activeCategory)) {
        return false;
      }
      if (activeSubcategory && !doesListMatchSubcategory(list, activeSubcategory)) {
        return false;
      }
      if (
        activeCategory === "Nightlife" &&
        activeNightlifeBarType !== NIGHTLIFE_BAR_TYPE_ANY &&
        inferNightlifeBarType(list) !== activeNightlifeBarType
      ) {
        return false;
      }
      if (
        activeCategory === "Nightlife" &&
        activeNightlifeMusicType !== NIGHTLIFE_MUSIC_TYPE_ANY &&
        !doesListMatchNightlifeMusicType(list, activeNightlifeMusicType)
      ) {
        return false;
      }
      if (activeFoodPrice && !doesListMatchFoodPrice(list, activeFoodPrice)) {
        return false;
      }
      return true;
    });
  }, [
    activeCategory,
    activeFoodPrice,
    activeGuideRail,
    activeGuideSource,
    activeNightlifeBarType,
    activeNightlifeMusicType,
    activeSubcategory,
    globalMergedLists,
    noKnownItineraryIds,
    profileLists,
    savedGuideIds,
  ]);
  const profileFavoriteGuideLists = useMemo(
    () =>
      [...profileLists, ...globalMergedLists]
        .filter((list, index, listSet) => listSet.findIndex((candidate) => candidate.id === list.id) === index)
        .filter(
        (list) =>
          savedGuideIds.has(list.id) &&
          !list.id.startsWith("event-") &&
          list.submissionType !== "journal" &&
          !isItineraryList(list, noKnownItineraryIds),
      ),
    [globalMergedLists, noKnownItineraryIds, profileLists, savedGuideIds],
  );
  const profileUserGuideLists = useMemo(
    () =>
      profileGuides.filter(
        (list) =>
          !list.id.startsWith("event-") &&
          !isItineraryList(list, noKnownItineraryIds),
      ),
    [noKnownItineraryIds, profileGuides],
  );
  const publicProfileLists = useMemo(
    () =>
      publicProfile
        ? publicProfile.lists.filter(
            (list) => list.journal?.visibility !== "private" || list.creator.id === currentUser?.id,
          )
        : [],
    [currentUser?.id, publicProfile],
  );
  const publicProfileGuideLists = useMemo(
    () =>
      publicProfileLists.filter(
        (list) => list.submissionType !== "journal" && !isItineraryList(list, noKnownItineraryIds),
      ),
    [noKnownItineraryIds, publicProfileLists],
  );
  const publicProfilePlacesBeen = useMemo(
    () =>
      Array.from(
        new Set(
          publicProfileLists
            .flatMap((list) => [list.location.country, list.location.city])
            .filter((value): value is string => Boolean(value)),
        ),
      ),
    [publicProfileLists],
  );
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
  const canCreateStandaloneProfileEntry = currentUser?.canPublishGuides === true;
  const standaloneCreateDisabledTitle = "Add an existing venue to a guide to create one.";
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
  const mapHighlightedCountryIds = useMemo(() => {
    const profileCountryIds =
      isProfileMode && activeProfileLeftRail === "places-been" && activePlacesBeenFilter === "countries"
        ? profilePlacesBeenCountryIds
        : [];
    const countryIds = [...new Set([...profileCountryIds, ...savedHighlightedCountryIds])];
    return countryIds.length ? countryIds : undefined;
  }, [
    activePlacesBeenFilter,
    activeProfileLeftRail,
    isProfileMode,
    profilePlacesBeenCountryIds,
    savedHighlightedCountryIds,
  ]);
  const isProfileSubmitLayout = isProfileMode && isProfileSubmitting;
  useEffect(() => {
    if (!currentUser || canCreateStandaloneProfileEntry) {
      return;
    }

    setIsProfileCreateModalOpen(false);
    setIsProfileSubmitting(false);
    setProfileEditingListId(null);
  }, [
    canCreateStandaloneProfileEntry,
    currentUser,
    setIsProfileSubmitting,
    setProfileEditingListId,
  ]);
  const activeNeighborhoodKey = activeLocation.subarea
    ? normalizeNeighborhoodName(activeLocation.subarea.name)
    : null;
  const activeLists = useMemo(() => {
    if (!activeLocation.city) {
      return allActiveLists;
    }
    if (!activeNeighborhoodKey) {
      return allActiveLists.filter(
        (list) => isListInActiveCity(list),
      );
    }
    return allActiveLists.filter(
      (list) =>
        isListInActiveCity(list) &&
        normalizeNeighborhoodName(list.location.neighborhood) === activeNeighborhoodKey,
    );
  }, [activeLocation.city, activeNeighborhoodKey, allActiveLists]);
  const subcategoryScope: SubcategoryScope = activeLocation.city
    ? "city"
    : activeLocation.subarea || activeCountrySubarea || activeLocation.state
      ? "region"
      : "country";
  const contextualFoodCuisineOptions = useMemo(() => {
    const cityCuisines = activeLocation.city?.popularFoodCuisines;
    if (cityCuisines?.length) {
      return cityCuisines;
    }

    const cityName = activeLocation.city?.name;
    const countryName = activeLocation.country?.name;
    if (cityName && contextualFoodCuisinesByCity[cityName]) {
      return contextualFoodCuisinesByCity[cityName];
    }
    if (countryName && contextualFoodCuisinesByCountry[countryName]) {
      return contextualFoodCuisinesByCountry[countryName];
    }
    return contextualFoodCuisinesByScope[subcategoryScope];
  }, [activeLocation.city?.name, activeLocation.city?.popularFoodCuisines, activeLocation.country?.name, subcategoryScope]);
  const generalFoodCuisineOptions = useMemo(
    () => generalFoodCuisines.filter((cuisine) => !contextualFoodCuisineOptions.includes(cuisine)),
    [contextualFoodCuisineOptions],
  );
  const activeFoodCuisineOptions = useMemo(
    () => [...contextualFoodCuisineOptions, ...generalFoodCuisineOptions],
    [contextualFoodCuisineOptions, generalFoodCuisineOptions],
  );
  const categoryFilteredLists = activeCategory
    ? activeLists.filter((list) => doesListMatchCategory(list, activeCategory))
    : activeLists;
  const filteredLists = (
    activeCategory === "Food"
      ? categoryFilteredLists.filter((list) => {
          const matchesPrice = activeFoodPrice ? doesListMatchFoodPrice(list, activeFoodPrice) : true;
          const matchesCuisine =
            activeFoodCuisine === FOOD_CUISINE_ANY
              ? true
              : doesListMatchFoodCuisine(list, activeFoodCuisine);
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
            const matchesMusicType =
              activeNightlifeMusicType === NIGHTLIFE_MUSIC_TYPE_ANY
                ? true
                : doesListMatchNightlifeMusicType(list, activeNightlifeMusicType);
            return matchesSubcategory && matchesBarType && matchesMusicType;
          })
        : categoryFilteredLists.filter((list) =>
            activeSubcategory ? doesListMatchSubcategory(list, activeSubcategory) : true,
          )
  )
    .slice()
    .sort((left, right) => {
      if (activeLocation.city && !activeNeighborhoodKey) {
        return compareActiveCityGuideOrder(left, right);
      }

      const leftNeighborhoodRank =
        activeLocation.city && !activeNeighborhoodKey && isListNeighborhoodGuideForActiveCity(left)
          ? 1
          : 0;
      const rightNeighborhoodRank =
        activeLocation.city && !activeNeighborhoodKey && isListNeighborhoodGuideForActiveCity(right)
          ? 1
          : 0;
      const leftCountryRootRank =
        isCountryRootSelection && left.location.scope === "country"
          ? 0
          : isCountryRootSelection && left.location.scope === "city"
            ? 1
            : 0;
      const rightCountryRootRank =
        isCountryRootSelection && right.location.scope === "country"
          ? 0
          : isCountryRootSelection && right.location.scope === "city"
            ? 1
            : 0;
      const rightCreatedAt = Date.parse(right.createdAt);
      const leftCreatedAt = Date.parse(left.createdAt);
      const rightCreatedTime = Number.isFinite(rightCreatedAt) ? rightCreatedAt : 0;
      const leftCreatedTime = Number.isFinite(leftCreatedAt) ? leftCreatedAt : 0;

      return (
        leftCountryRootRank - rightCountryRootRank ||
        leftNeighborhoodRank - rightNeighborhoodRank ||
        right.upvotes - left.upvotes ||
        rightCreatedTime - leftCreatedTime ||
        left.title.localeCompare(right.title)
      );
    });
  const railFilteredLists = useMemo(() => {
    if (isPublicProfileMode) {
      return publicProfileGuideLists
        .slice()
        .sort((left, right) => right.upvotes - left.upvotes || left.title.localeCompare(right.title));
    }

    const now = new Date();
    const completedItineraryListIds = new Set(
      itineraryPlaylists
        .map((playlist) => playlist.completedListId)
        .filter((listId): listId is string => Boolean(listId)),
    );
    const playlistLinkedListIds = new Set(itineraryPlaylists.flatMap((playlist) => playlist.listIds));
    const allKnownItineraryListIds = new Set([...completedItineraryListIds, ...playlistLinkedListIds]);
    const isEventList = (list: MapList) => list.id.startsWith("event-");
    const isRGuideList = (list: MapList) => list.creator.name.startsWith("R ");
    const matchesActiveGuideSource = (list: MapList) => {
      if (activeGuideSource === "favorites") {
        return savedGuideIds.has(list.id);
      }
      if (activeGuideSource === "r-guides") {
        return isRGuideList(list);
      }
      if (activeGuideSource === "user-guides") {
        return !isRGuideList(list);
      }
      return true;
    };
    const isGuideSubmission = (list: MapList) =>
      !isEventList(list) &&
      list.submissionType !== "journal" &&
      !isItineraryList(list, allKnownItineraryListIds);
    const isUserGuideList = (list: MapList) =>
      !isRGuideList(list) &&
      list.submissionType !== "journal" &&
      !isItineraryList(list, allKnownItineraryListIds);

    if (isProfileMode) {
      const baseProfileLists =
        activeGuideSource === "favorites"
          ? profileFavoriteGuideLists
          : activeGuideSource === "user-guides"
            ? profileUserGuideLists
            : [...profileUserGuideLists, ...profileFavoriteGuideLists].filter((list, index, listSet) =>
                listSet.findIndex((candidate) => candidate.id === list.id) === index,
              );

      return baseProfileLists.filter((list) => {
        if (activeCategory && !doesListMatchCategory(list, activeCategory)) {
          return false;
        }
        if (activeSubcategory && !doesListMatchSubcategory(list, activeSubcategory)) {
          return false;
        }
        if (activeFoodPrice && !doesListMatchFoodPrice(list, activeFoodPrice)) {
          return false;
        }
        return true;
      });
    }

    if (activeGuideRail === null) {
      return filteredLists
        .filter((list) => list.submissionType !== "journal")
        .filter(matchesActiveGuideSource);
    }
    if (activeGuideRail === "all-guides") {
      return filteredLists
        .filter((list) => isGuideSubmission(list) && (isRGuideList(list) || isUserGuideList(list)))
        .filter(matchesActiveGuideSource);
    }
    if (activeGuideRail === "itinerary") {
      const playlistListIds = new Set(
        itineraryPlaylists.flatMap((playlist) => playlist.listIds),
      );
      const itineraryBaseLists = isGlobalSelection
        ? activeCategory
          ? globalMergedLists.filter((list) => doesListMatchCategory(list, activeCategory))
          : globalMergedLists
        : activeCategory
          ? categoryFilteredLists
          : filteredLists;
      const filteredListIds = new Set(itineraryBaseLists.map((list) => list.id));
      const itineraryMatchesActiveCategory = (list: MapList) => {
        if (!activeCategory) {
          return true;
        }
        return doesListMatchCategory(list, activeCategory);
      };
      const itineraryCandidateLists = itineraryBaseLists.filter((list) => !isEventList(list));
      return itineraryCandidateLists.filter(
        (list) =>
          (itineraryIds.includes(list.id) ||
            playlistListIds.has(list.id) ||
            isItineraryList(list, allKnownItineraryListIds)) &&
          (filteredListIds.has(list.id) || itineraryMatchesActiveCategory(list)) &&
          matchesActiveGuideSource(list),
      );
    }
    if (activeGuideRail === "week-events") {
      const cityEventLists = globalMergedLists.filter((list) => {
        if (!list.id.startsWith("event-")) {
          return false;
        }
        if (!activeLocation.city) {
          return true;
        }
        return (
          list.location.scope === "city" &&
          list.location.city === activeLocation.city.name
        );
      });

      return cityEventLists
        .filter(matchesActiveGuideSource)
        .filter((list) => {
          if (!activeCategory) {
            return true;
          }
          if (activeCategory === "Activities") {
            return list.category === "Activities" || list.category === "Culture" || list.category === "Nightlife";
          }
          return list.category === activeCategory;
        });
    }
    return filteredLists;
  }, [
    activeGuideRail,
    activeGuideSource,
    activeSubcategory,
    activeFoodPrice,
    filteredLists,
    globalMergedLists,
    isGlobalSelection,
    isPublicProfileMode,
    itineraryIds,
    itineraryPlaylists,
    publicProfileGuideLists,
    profileFavoriteGuideLists,
    profileUserGuideLists,
    savedGuideIds,
    isProfileMode,
    activeCategory,
    activeLists,
    activeLocation.city,
  ]);
  const orderedRailFilteredLists = useMemo(
    () =>
      railFilteredLists.slice().sort((left, right) => {
        if (activeLocation.city && !activeNeighborhoodKey) {
          return compareActiveCityGuideOrder(left, right);
        }

        const leftNeighborhoodRank =
          activeLocation.city && !activeNeighborhoodKey && isListNeighborhoodGuideForActiveCity(left) ? 1 : 0;
        const rightNeighborhoodRank =
          activeLocation.city && !activeNeighborhoodKey && isListNeighborhoodGuideForActiveCity(right) ? 1 : 0;
        const rightCreatedAt = Date.parse(right.createdAt);
        const leftCreatedAt = Date.parse(left.createdAt);
        const rightCreatedTime = Number.isFinite(rightCreatedAt) ? rightCreatedAt : 0;
        const leftCreatedTime = Number.isFinite(leftCreatedAt) ? leftCreatedAt : 0;

        return (
          leftNeighborhoodRank - rightNeighborhoodRank ||
          right.upvotes - left.upvotes ||
          rightCreatedTime - leftCreatedTime ||
          left.title.localeCompare(right.title)
        );
      }),
    [activeLocation.city, activeNeighborhoodKey, railFilteredLists],
  );
  const activeCategoryOption = activeCategory
    ? categoryOptions.find((option) => option.category === activeCategory) ?? null
    : null;
  const activeSubcategoryOptions = activeCategory
    ? categorySubcategoriesByScope[subcategoryScope][activeCategory]
    : [];
  const rankedCityListItems = useMemo(() => {
    if (!activeCategory || !activeLocation.city || !cityListItems.length) {
      return cityListItems.map((item) => ({
        ...item,
        categoryStrengthScore: 0,
        categoryStrengthStars: 0,
      }));
    }

    const listMatchesActiveField = (list: MapList) => {
      if (!doesListMatchCategory(list, activeCategory)) {
        return false;
      }
      if (activeCategory === "Food") {
        if (activeFoodPrice && !doesListMatchFoodPrice(list, activeFoodPrice)) {
          return false;
        }
        if (activeFoodCuisine !== FOOD_CUISINE_ANY && !doesListMatchFoodCuisine(list, activeFoodCuisine)) {
          return false;
        }
      }
      if (activeSubcategory && !doesListMatchSubcategory(list, activeSubcategory)) {
        return false;
      }
      if (
        activeCategory === "Nightlife" &&
        activeNightlifeBarType !== NIGHTLIFE_BAR_TYPE_ANY &&
        inferNightlifeBarType(list) !== activeNightlifeBarType
      ) {
        return false;
      }
      if (
        activeCategory === "Nightlife" &&
        activeNightlifeMusicType !== NIGHTLIFE_MUSIC_TYPE_ANY &&
        !doesListMatchNightlifeMusicType(list, activeNightlifeMusicType)
      ) {
        return false;
      }
      return true;
    };

    const cityCategoryLists = allActiveLists.filter((list) => isListInActiveCity(list) && listMatchesActiveField(list));
    const getStrengthStars = (score: number, hasResearchScore: boolean) => {
      if (hasResearchScore) {
        if (score >= 25) {
          return 3;
        }
        if (score >= 17) {
          return 2;
        }
        return score > 0 ? 1 : 0;
      }

      if (score >= 10) {
        return 3;
      }
      if (score >= 6) {
        return 2;
      }
      return score > 0 ? 1 : 0;
    };
    const scoredItems = cityListItems.map((item) => {
      const normalizedItemName = normalizeNeighborhoodName(item.name);
      const guideCoverageScore = cityCategoryLists.reduce((total, list) => {
        const listNeighborhood = normalizeNeighborhoodName(inferListNeighborhoodName(list) ?? list.location.neighborhood);
        const isNeighborhoodList = listNeighborhood === normalizedItemName;
        const listTextSignal = normalizeNeighborhoodName([list.title, list.description, list.seoTitle, list.seoDescription].join(" "))
          .includes(normalizedItemName)
          ? 2
          : 0;
        const stopSignals = list.stops
          .flatMap((stop) => [stop, ...(stop.places ?? [])])
          .filter((stop) => {
            const stopText = normalizeNeighborhoodName(
              [
                stop.name,
                stop.description,
                stop.subcategory,
                ...(stop.subcategories ?? []),
                ...(stop.attributeTags ?? []),
                ...(stop.tags ?? []),
              ].join(" "),
            );
            return stopText.includes(normalizedItemName);
          }).length;

        if (isNeighborhoodList) {
          return total + 3;
        }

        return total + listTextSignal + Math.min(stopSignals, 4);
      }, 0);
      const researchStrength = getNeighborhoodResearchStrength({
        activeSubcategory:
          activeCategory === "Food" && activeFoodCuisine !== FOOD_CUISINE_ANY
            ? activeFoodCuisine
            : activeCategory === "Nightlife" &&
                activeSubcategory === NIGHTLIFE_MUSIC_TYPE_ANY &&
                activeNightlifeMusicType !== NIGHTLIFE_MUSIC_TYPE_ANY
              ? activeNightlifeMusicType
            : activeSubcategory,
        cityId: activeLocation.city?.id,
        category: activeCategory,
        neighborhoodId: item.id,
        neighborhoodName: item.name,
        nightlifeBarType: activeNightlifeBarType,
        researchStrengths: activeLocation.city?.categoryNeighborhoodStrengths,
      });
      const score = researchStrength ? researchStrength.score * 3 + guideCoverageScore : guideCoverageScore;

      return {
        ...item,
        categoryStrengthScore: score,
        categoryStrengthStars: getStrengthStars(score, Boolean(researchStrength)),
      };
    });

    return scoredItems
      .sort((left, right) => {
        if (right.categoryStrengthScore !== left.categoryStrengthScore) {
          return right.categoryStrengthScore - left.categoryStrengthScore;
        }
        return left.name.localeCompare(right.name);
      });
  }, [
    activeCategory,
    activeFoodCuisine,
    activeFoodPrice,
    activeLocation.city,
    activeNightlifeBarType,
    activeNightlifeMusicType,
    activeSubcategory,
    allActiveLists,
    cityListItems,
  ]);
  const visibleSubcategoryOptions = visibleSubcategoryCategory
    ? categorySubcategoriesByScope[subcategoryScope][visibleSubcategoryCategory]
    : [];
  const categoryTitleLabel = activeCategory
    ? getCategoryLabel(activeCategory)
    : hoveredCategoryLabel ?? browseLabels.categories;
  const guideSourceSelectors = [
    { id: "all-guides" as const, label: browseLabels.allGuides, shortLabel: browseLabels.all, icon: null },
    { id: "r-guides" as const, label: browseLabels.rGuides, shortLabel: "R", icon: null },
    { id: "user-guides" as const, label: browseLabels.userGuides, shortLabel: browseLabels.user, icon: MaterialPerson },
    { id: "favorites" as const, label: browseLabels.favorites, shortLabel: browseLabels.favorite, icon: MaterialFavorite },
  ];
  const visibleGuideSourceSelectors = isProfileMode
    ? guideSourceSelectors.filter((selector) => selector.id !== "r-guides")
    : guideSourceSelectors;
  const guideActionSelectors = [
    { id: "all-guides" as const, label: browseLabels.guides, shortLabel: browseLabels.guide, icon: MaterialMap },
    { id: "week-events" as const, label: browseLabels.events, shortLabel: browseLabels.events, icon: MaterialCalendarMonth },
    { id: "itinerary" as const, label: browseLabels.journeys, shortLabel: browseLabels.journey, icon: MaterialRoute },
  ];
  const visibleGuideActionSelectors = guideActionSelectors;
  const guideActionActiveStyles = {
    "all-guides": {
      backgroundColor: "#0f172a",
      borderColor: "#38bdf8",
      color: "#38bdf8",
    },
    itinerary: {
      backgroundColor: "#020617",
      borderColor: "#f8fafc",
      color: "#f8fafc",
    },
    favorites: {
      backgroundColor: "#7f1d1d",
      borderColor: "#ef4444",
      color: "#ef4444",
    },
    "week-events": {
      backgroundColor: "#3b0764",
      borderColor: "#a855f7",
      color: "#c084fc",
    },
  } as const;
  const activeGuideSourceSelector =
    visibleGuideSourceSelectors.find((selector) => selector.id === activeGuideSource) ?? visibleGuideSourceSelectors[0];
  const activeGuideActionSelector =
    guideActionSelectors.find((selector) => selector.id === activeGuideRail) ?? null;
  const sourceTitlePrefixById = {
    "all-guides": browseLabels.all,
    "r-guides": "R",
    "user-guides": browseLabels.user,
    favorites: browseLabels.favorite,
  } as const;
  const sourceControlLabelById = {
    "all-guides": browseLabels.all,
    "r-guides": "R",
    "user-guides": browseLabels.user,
    favorites: browseLabels.favorite,
  } as const;
  const menuBarTitleLabel = `${sourceTitlePrefixById[activeGuideSourceSelector.id]} ${activeGuideActionSelector?.label ?? browseLabels.entries}`;
  const desktopGuideLocationLabel =
    activeLocation.nestedSubarea?.name ??
    activeLocation.subarea?.name ??
    activeLocation.city?.name ??
    activeLocation.state?.name ??
    activeCountrySubarea?.name ??
    activeLocation.country?.name ??
    activeLocation.continent?.name ??
    browseLabels.world;
  const desktopMenuBarTitleLabel = [
    formatBreadcrumbName(desktopGuideLocationLabel),
    activeCategory ? getCategoryLabel(activeCategory) : undefined,
    activeGuideActionSelector?.label ?? browseLabels.entries,
  ]
    .filter(Boolean)
    .join(" ");
  const resetCategoryFilters = () => {
    setActiveCategory(null);
    setActiveSubcategory(null);
    setActiveFoodPrice(null);
    setActiveFoodOpenTime("Now");
    setIsFoodOpenTimeMenuOpen(false);
    setActiveFoodCuisine(FOOD_CUISINE_ANY);
    setIsFoodCuisineMenuOpen(false);
    setActiveNightlifeBarType(NIGHTLIFE_BAR_TYPE_ANY);
    setIsNightlifeBarMenuOpen(false);
    setActiveNightlifeMusicType(NIGHTLIFE_MUSIC_TYPE_ANY);
    setIsNightlifeMusicMenuOpen(false);
    clearCategoryBeforeGuideExpand();
  };
  const handleLocationFavoritesRailToggle = () => {
    const nextActive = !isLocationFavoritesRailActive;
    setIsLocationFavoritesRailActive(nextActive);
    setExpandedGuideId(null);
    clearCategoryBeforeGuideExpand();
    setClosingGuide(null);
    setVisibleNestedStopParentIds([]);

    if (nextActive) {
      resetCategoryFilters();
      setActiveGuideRail("all-guides");
      setActiveGuideSource("all-guides");
    }
  };
  const handleGuideSourceSelect = (sourceId: typeof activeGuideSource) => {
    setActiveGuideSource(sourceId);
    setIsLocationFavoritesRailActive(false);
    setExpandedGuideId(null);
    clearCategoryBeforeGuideExpand();
    setClosingGuide(null);
    setVisibleNestedStopParentIds([]);
  };
  const handleGuideRailSelect = (railId: "all-guides" | "week-events" | "itinerary") => {
    const nextRail = activeGuideRail === railId ? null : railId;
    setActiveGuideRail(nextRail);
    setIsLocationFavoritesRailActive(false);
    setExpandedGuideId(null);
    clearCategoryBeforeGuideExpand();
    setClosingGuide(null);
    setVisibleNestedStopParentIds([]);

    if (railId === "week-events" || nextRail === null) {
      resetCategoryFilters();

      const neutralPath = getCurrentCityRoutePath(null);
      if (neutralPath) {
        pushExplorerPath(neutralPath);
      }
    }
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
      setIsMobileListSheetExpanded((current) => !current);
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
    setIsLocationFavoritesRailActive(false);
    setActiveSubcategory(null);
    setActiveFoodPrice(null);
    setActiveFoodOpenTime("Now");
    setIsFoodOpenTimeMenuOpen(false);
    setActiveFoodCuisine(FOOD_CUISINE_ANY);
    setIsFoodCuisineMenuOpen(false);
    setActiveNightlifeBarType(NIGHTLIFE_BAR_TYPE_ANY);
    setIsNightlifeBarMenuOpen(false);
    setActiveNightlifeMusicType(NIGHTLIFE_MUSIC_TYPE_ANY);
    setIsNightlifeMusicMenuOpen(false);
    setExpandedGuideId(null);
    clearCategoryBeforeGuideExpand();
    setClosingGuide(null);
    setActiveCategory(nextCategory);
    const nextPath = getCurrentCityRoutePath(nextCategory);
    if (nextPath) {
      pushExplorerPath(nextPath);
    }
  };
  const handleStayCategoryFilter = () => {
    if (activeCategory !== "Stay") {
      handleCategoryToggle("Stay");
    }
  };
  const explorerPaneHeight = "lg:h-[calc(100svh-1rem)]";
  const explorerBodyMaxHeight = "max-h-full lg:max-h-[calc(100svh-7.5rem)]";

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
    if (skipInitialSelectionCleanupRef.current) {
      skipInitialSelectionCleanupRef.current = false;
      return;
    }

    setHoveredCategoryLabel(null);
    setActiveSubcategory(null);
    setActiveFoodPrice(null);
    setActiveFoodOpenTime("Now");
    setIsFoodOpenTimeMenuOpen(false);
    setActiveFoodCuisine(FOOD_CUISINE_ANY);
    setIsFoodCuisineMenuOpen(false);
    setActiveNightlifeBarType(NIGHTLIFE_BAR_TYPE_ANY);
    setIsNightlifeBarMenuOpen(false);
    setActiveNightlifeMusicType(NIGHTLIFE_MUSIC_TYPE_ANY);
    setIsNightlifeMusicMenuOpen(false);
    setHoveredGuide(null);
    setHoveredStopId(null);
    setVisibleNestedStopParentIds([]);
    setSelectedGuideStopId(null);
    setExpandedGuideId(null);
    setClosingGuide(null);
    setClosingGuidePhase(null);
    clearCategoryBeforeGuideExpand();
    openingGuideIdRef.current = null;
    setOpeningGuideId(null);
    clearGuideContentRevealSchedule();
    setSettlingGuideContentId(null);

    if (closingGuideTimeoutRef.current) {
      clearTimeout(closingGuideTimeoutRef.current);
      closingGuideTimeoutRef.current = null;
    }
    if (openingGuideTimeoutRef.current) {
      clearTimeout(openingGuideTimeoutRef.current);
      openingGuideTimeoutRef.current = null;
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
    if (activeNightlifeMusicType !== NIGHTLIFE_MUSIC_TYPE_ANY) {
      setActiveNightlifeMusicType(NIGHTLIFE_MUSIC_TYPE_ANY);
    }
    if (isNightlifeMusicMenuOpen) {
      setIsNightlifeMusicMenuOpen(false);
    }
  }, [
    activeCategory,
    activeNightlifeBarType,
    activeNightlifeMusicType,
    isNightlifeBarMenuOpen,
    isNightlifeMusicMenuOpen,
  ]);

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
    setCountryBrowseView(getDefaultCountryBrowseView(activeLocation.country));
  }, [activeLocation.country, selection.countryId]);

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
      if (openingGuideTimeoutRef.current) {
        clearTimeout(openingGuideTimeoutRef.current);
      }
      if (guideContentRevealTimeoutRef.current) {
        clearTimeout(guideContentRevealTimeoutRef.current);
      }
      if (guideContentRevealFrameRef.current) {
        cancelAnimationFrame(guideContentRevealFrameRef.current);
      }
      morphAnimationRef.current?.cancel();
      morphCommitActionRef.current = null;
      if (morphFrameRef.current) {
        cancelAnimationFrame(morphFrameRef.current);
      }
      guideLayoutAnimationFramesRef.current.forEach((frame) => cancelAnimationFrame(frame));
      guideLayoutAnimationsRef.current.forEach((animation) => animation.cancel());
      guideLayoutCleanupTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      if (guideScrollAnimationFrameRef.current !== null) {
        cancelAnimationFrame(guideScrollAnimationFrameRef.current);
        guideScrollAnimationFrameRef.current = null;
      }
      if (guideScrollSettleTimeoutRef.current !== null) {
        window.clearTimeout(guideScrollSettleTimeoutRef.current);
        guideScrollSettleTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (skipInitialGuideRailCleanupRef.current) {
      skipInitialGuideRailCleanupRef.current = false;
      return;
    }

    setExpandedGuideId(null);
    clearCategoryBeforeGuideExpand();
    setClosingGuide(null);
  }, [activeGuideRail, activeGuideSource]);
  useEffect(() => {
    if (!isProfileSubmitLayout) {
      setProfileSubmissionPreviewList(null);
      setProfileMapPinnedLocation(null);
    }
  }, [isProfileSubmitLayout]);

  const expandedGuide =
    orderedRailFilteredLists.find((list) => list.id === expandedGuideId) ??
    globalMergedLists.find((list) => list.id === expandedGuideId) ??
    null;
  const displayedGuide = expandedGuide;
  const displayedGuideCrossLinkGroups = useMemo<GuideCrossLinkGroup[]>(() => {
    if (!displayedGuide) {
      return [];
    }

    return getGuideCrossLinkGroups(displayedGuide, activeEditorialLists).map((group) => ({
      id: group.id,
      title: group.title,
      links: group.guides.map((guide) => ({
        id: guide.id,
        href: getRouteGuidePath(
          { name: guide.location.city ?? displayedGuide.location.city ?? "" },
          guide,
          guide.location.neighborhood ? { name: guide.location.neighborhood } : undefined,
        ),
        title: guide.title,
        category: guide.category,
        context: guide.location.neighborhood
          ? `${guide.category} in ${guide.location.neighborhood}`
          : `${guide.category} across ${guide.location.city ?? displayedGuide.location.city ?? "the city"}`,
      })),
    }));
  }, [activeEditorialLists, displayedGuide, locale]);
  const displayedCitywideGuideLinks = useMemo<GuideCrossLink[]>(() => {
    const cityName = displayedGuide?.location.city?.trim();
    if (!displayedGuide || !cityName) {
      return [];
    }

    const cityKey = normalizeLocationName(cityName);
    return activeEditorialLists
      .filter(isIndexableEditorialGuide)
      .filter(
        (guide) =>
          guide.id !== displayedGuide.id &&
          !guide.location.neighborhood?.trim() &&
          normalizeLocationName(guide.location.city) === cityKey,
      )
      .sort(
        (left, right) => {
          const leftCategoryRank = left.category === displayedGuide.category ? -1 : CATEGORIES.indexOf(left.category);
          const rightCategoryRank = right.category === displayedGuide.category ? -1 : CATEGORIES.indexOf(right.category);

          return (
            leftCategoryRank - rightCategoryRank ||
            right.upvotes - left.upvotes ||
            left.title.localeCompare(right.title)
          );
        },
      )
      .map((guide) => ({
        id: guide.id,
        href: getRouteGuidePath({ name: cityName }, guide),
        title: guide.title,
        category: guide.category,
        context: `${guide.category} across ${cityName}`,
      }));
  }, [activeEditorialLists, displayedGuide, locale]);
  const activeMapGuide = isProfileSubmitLayout
    ? profileSubmissionPreviewList
    : expandedGuide;
  const isGuideTakingFullListPane = Boolean(expandedGuide && !isPublicProfileMode);
  const isGuideReturningToListPane = false;
  const isGuidePaneTakingFullListPane = isGuideTakingFullListPane || isGuideReturningToListPane;
  const isLeftPaneCollapsed = isProfileSubmitLayout || isGuidePaneTakingFullListPane;
  const isSubcategoryMenuOpen =
    isFoodOpenTimeMenuOpen || isFoodCuisineMenuOpen || isNightlifeBarMenuOpen || isNightlifeMusicMenuOpen;
  const isSavedPlacesRailActive = isLocationFavoritesRailActive && !expandedGuide;
  const remainingGuides = displayedGuide
    ? orderedRailFilteredLists.filter((list) => list.id !== displayedGuide.id)
    : orderedRailFilteredLists;
  const shouldGroupCityGuideList =
    Boolean(activeLocation.city) &&
    !activeNeighborhoodKey &&
    activeGuideRail === "all-guides" &&
    !activeCategory &&
    !activeSubcategory;
  const citywideRailLists = shouldGroupCityGuideList
    ? orderedRailFilteredLists.filter((list) => !isListNeighborhoodGuideForActiveCity(list))
    : orderedRailFilteredLists;
  const neighborhoodRailLists = shouldGroupCityGuideList
    ? orderedRailFilteredLists.filter((list) => isListNeighborhoodGuideForActiveCity(list))
    : [];
  const recentGuideLists = useMemo(() => {
    const continentName = activeLocation.continent && !activeLocation.country
      ? activeLocation.continent.name
      : null;
    if (
      (!isGlobalSelection && !continentName) ||
      activeGuideRail !== "all-guides" ||
      activeGuideSource === "user-guides" ||
      activeGuideSource === "favorites"
    ) {
      return [];
    }

    const activeScopeGuideIds = new Set(orderedRailFilteredLists.map((list) => list.id));
    const categoryRecentLists = activeCategory
      ? globalMergedLists.filter((list) => doesListMatchCategory(list, activeCategory))
      : globalMergedLists;
    const baseRecentLists = continentName
      ? categoryRecentLists.filter((list) => list.location.continent === continentName)
      : categoryRecentLists;

    return baseRecentLists
      .filter(
        (list) =>
          !list.id.startsWith("event-") &&
          list.creator.name.startsWith("R ") &&
          list.submissionType !== "event" &&
          list.submissionType !== "journal" &&
          list.submissionType !== "journey" &&
          list.submissionType !== "itinerary" &&
          (!activeSubcategory || doesListMatchSubcategory(list, activeSubcategory)) &&
          !activeScopeGuideIds.has(list.id),
      )
      .slice()
      .sort((left, right) => {
        const rightDate = Date.parse(getGuideLastModified(right) ?? "");
        const leftDate = Date.parse(getGuideLastModified(left) ?? "");
        const rightTime = Number.isFinite(rightDate) ? rightDate : 0;
        const leftTime = Number.isFinite(leftDate) ? leftDate : 0;
        return rightTime - leftTime || right.upvotes - left.upvotes || left.title.localeCompare(right.title);
      })
      .slice(0, 20);
  }, [activeGuideRail, activeGuideSource, activeCategory, activeSubcategory, activeLocation.continent, activeLocation.country, globalMergedLists, isGlobalSelection, orderedRailFilteredLists]);

  const visibleGuideMarkerListSignature = useMemo(
    () =>
      [
        ...orderedRailFilteredLists.map((list) => list.id),
        ...recentGuideLists.map((list) => list.id),
      ].join("|"),
    [orderedRailFilteredLists, recentGuideLists],
  );
  const visibleGuideMarkerFallbackIds = useMemo(() => {
    const seen = new Set<string>();
    const lists = [...orderedRailFilteredLists, ...recentGuideLists];
    return lists
      .filter((list) => {
        if (seen.has(list.id) || list.id === activeMapGuide?.id) {
          return false;
        }
        seen.add(list.id);
        return true;
      })
      .slice(0, 45)
      .map((list) => list.id);
  }, [activeMapGuide?.id, orderedRailFilteredLists, recentGuideLists]);

  useEffect(() => {
    if (typeof window === "undefined" || isProfileSubmitLayout || isGuidePaneTakingFullListPane) {
      setVisibleGuideMarkerIds((current) => (current.length ? [] : current));
      return;
    }

    const rightPane = rightPaneRef.current;
    if (!rightPane) {
      setVisibleGuideMarkerIds((current) => (current.length ? [] : current));
      return;
    }

    const isEffectivelyVisible = (element: HTMLElement) => {
      let current: HTMLElement | null = element;
      while (current && current !== rightPane) {
        const className = current.getAttribute("class") ?? "";
        if (className.includes("pointer-events-none") || className.includes("opacity-0")) {
          return false;
        }
        const style = window.getComputedStyle(current);
        if (style.display === "none" || style.visibility === "hidden" || style.pointerEvents === "none") {
          return false;
        }
        current = current.parentElement;
      }
      return true;
    };

    let publishFrame: number | null = null;
    const activeGuideId = activeMapGuide?.id ?? null;

    const publishVisibleGuideIds = () => {
      publishFrame = null;

      const scrollContainers = Array.from(rightPane.querySelectorAll<HTMLElement>("[data-guides-scroll]")).filter(
        (scroller) => {
          const rect = scroller.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && isEffectivelyVisible(scroller);
        },
      );

      const seen = new Set<string>();
      const markerLimit = 45;
      const markerCandidates: Array<{ id: string; order: number; isInPane: boolean }> = [];
      let cardOrder = 0;

      scrollContainers.forEach((scroller) => {
        const scrollerRect = scroller.getBoundingClientRect();
        const cards = Array.from(scroller.querySelectorAll<HTMLElement>("[data-guide-card-anchor]"));

        cards.forEach((card) => {
          const guideId = card.getAttribute("data-guide-card-anchor");
          if (!guideId || guideId === activeGuideId || seen.has(guideId) || !isEffectivelyVisible(card)) {
            return;
          }

          const cardRect = card.getBoundingClientRect();
          const isInPane = cardRect.bottom >= scrollerRect.top && cardRect.top <= scrollerRect.bottom;

          seen.add(guideId);
          markerCandidates.push({
            id: guideId,
            order: cardOrder,
            isInPane,
          });
          cardOrder += 1;
        });
      });

      const orderedCandidates = markerCandidates.sort((left, right) => left.order - right.order);
      const visibleIndexes = orderedCandidates.flatMap((candidate, index) =>
        candidate.isInPane ? [index] : [],
      );
      let markerWindow = orderedCandidates.slice(0, markerLimit);

      if (visibleIndexes.length) {
        const firstVisibleIndex = visibleIndexes[0];
        const lastVisibleIndex = visibleIndexes[visibleIndexes.length - 1];
        const visibleWindow = orderedCandidates.slice(firstVisibleIndex, lastVisibleIndex + 1);

        if (visibleWindow.length >= markerLimit) {
          markerWindow = visibleWindow.slice(0, markerLimit);
        } else {
          const availableBefore = orderedCandidates.slice(0, firstVisibleIndex);
          const availableAfter = orderedCandidates.slice(lastVisibleIndex + 1);
          const remainingSlots = markerLimit - visibleWindow.length;
          const targetBeforeCount = Math.floor(remainingSlots / 2);
          const targetAfterCount = remainingSlots - targetBeforeCount;
          let beforeCount = Math.min(targetBeforeCount, availableBefore.length);
          let afterCount = Math.min(targetAfterCount, availableAfter.length);
          const missingBeforeCount = targetBeforeCount - beforeCount;

          if (missingBeforeCount > 0) {
            afterCount += Math.min(missingBeforeCount, availableAfter.length - afterCount);
          }

          const missingAfterCount = targetAfterCount - afterCount;
          if (missingAfterCount > 0) {
            beforeCount += Math.min(missingAfterCount, availableBefore.length - beforeCount);
          }

          markerWindow = [
            ...availableBefore.slice(-beforeCount),
            ...visibleWindow,
            ...availableAfter.slice(0, afterCount),
          ];
        }
      }

      const nextIds = markerWindow.map((candidate) => candidate.id);
      const stableNextIds = nextIds.length ? nextIds : visibleGuideMarkerFallbackIds;

      setVisibleGuideMarkerIds((current) =>
        current.length === stableNextIds.length && current.every((id, index) => id === stableNextIds[index])
          ? current
          : stableNextIds,
      );
    };

    const schedulePublish = () => {
      if (publishFrame !== null) {
        return;
      }
      publishFrame = window.requestAnimationFrame(publishVisibleGuideIds);
    };

    const scrollContainers = Array.from(rightPane.querySelectorAll<HTMLElement>("[data-guides-scroll]"));
    scrollContainers.forEach((scroller) => scroller.addEventListener("scroll", schedulePublish, { passive: true }));
    window.addEventListener("resize", schedulePublish, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(schedulePublish);
      resizeObserver.observe(rightPane);
      scrollContainers.forEach((scroller) => resizeObserver?.observe(scroller));
    }

    schedulePublish();

    return () => {
      scrollContainers.forEach((scroller) => scroller.removeEventListener("scroll", schedulePublish));
      window.removeEventListener("resize", schedulePublish);
      resizeObserver?.disconnect();
      if (publishFrame !== null) {
        window.cancelAnimationFrame(publishFrame);
      }
    };
  }, [
    activeMapGuide?.id,
    isGuidePaneTakingFullListPane,
    isProfileSubmitLayout,
    visibleGuideMarkerFallbackIds,
    visibleGuideMarkerListSignature,
  ]);

  const renderGuideRailCard = (list: MapList, keyPrefix = "") => (
    <div
      key={`${keyPrefix}${list.id}`}
      data-guide-card-anchor={list.id}
      ref={(node) => {
        guideRefs.current[list.id] = node;
      }}
      className="scroll-mt-2"
    >
      <MapListCard
        list={list}
        expandable
        expanded={false}
        preserveExpandedChrome={closingGuide?.id === list.id || openingGuideId === list.id}
        retractExpandedChrome={
          closingGuide?.id === list.id &&
          (closingGuidePhase === "returning" || closingGuidePhase === "collapsing")
        }
        expandExpandedChrome={openingGuideId === list.id}
        hideExpandedContent={closingGuide?.id === list.id}
        onExpandChromeComplete={completeGuideOpening}
        onToggleExpand={handleGuideToggle}
        shouldAutoOpenSources={pendingSourcesOpenGuideId === list.id}
        onAutoOpenSourcesHandled={handleAutoOpenSourcesHandled}
        onRequestOpenSourcesWhenCollapsed={handleExpandAndOpenSources}
        onHoverStart={handleGuideCardHoverStart}
        onHoverEnd={handleGuideCardHoverEnd}
        onStopHoverChange={setHoveredStopId}
        onStopSelect={handleGuideStopSelect}
        hoveredStopId={hoveredStopId}
        isExternallyHovered={hoveredGuideMarkerId === list.id}
        forceExpandStopId={selectedGuideStopId}
        forceExpandStopNonce={selectedGuideStopNonce}
        collapsedLocationSubtitleHiddenParts={getCollapsedLocationSubtitleHiddenParts(list)}
      />
    </div>
  );
  const activeSeoPlaceLabel = activeLocation.city
    ? activeLocation.nestedSubarea?.name ?? activeLocation.subarea?.name ?? activeLocation.city.name
    : activeDirectoryMeta.title;
  const activeStayBookingQuery = activeLocation.city
    ? [
        activeLocation.nestedSubarea?.name ?? activeLocation.subarea?.name,
        activeLocation.city.name,
        activeLocation.country?.name ?? activeLocation.city.country,
      ]
        .filter(Boolean)
        .join(", ")
    : null;
  const activeStayBookingNeighborhood = activeLocation.nestedSubarea?.name ?? activeLocation.subarea?.name;
  const shouldUseAgodaStayBooking = activeLocation.city
    ? shouldUseAgodaForStay({
        category: "Stay",
        city: activeLocation.city.name,
        country: activeLocation.country?.name ?? activeLocation.city.country,
        continent: activeLocation.city.continent,
      })
    : false;
  const activeStayBookingHref = activeStayBookingQuery && activeLocation.city
    ? shouldUseAgodaStayBooking
      ? buildAgodaStaySearchUrl({
          city: activeLocation.city.name,
          country: activeLocation.country?.name ?? activeLocation.city.country,
          neighborhood: activeStayBookingNeighborhood,
          campaign: activeStayBookingNeighborhood
            ? `neighborhood_left_panel_agoda_${activeLocation.city.id}_${activeStayBookingNeighborhood}`
            : `city_left_panel_agoda_${activeLocation.city.id}`,
        })
      : activeStayBookingNeighborhood
      ? buildStay22DestinationUrl({
          city: activeLocation.city.name,
          country: activeLocation.country?.name ?? activeLocation.city.country,
          neighborhood: activeStayBookingNeighborhood,
          campaign: `neighborhood_left_panel_${activeLocation.city.id}_${activeStayBookingNeighborhood}`,
        })
      : activeLocation.city.affiliateLinks?.cityLeftPanelStayUrl ??
        buildStay22DestinationUrl({
          city: activeLocation.city.name,
          country: activeLocation.country?.name ?? activeLocation.city.country,
          campaign: `city_left_panel_${activeLocation.city.id}`,
        })
    : null;
  const visibleSeoHeading = expandedGuide
    ? `${expandedGuide.title} in ${activeSeoPlaceLabel}`
    : isSavedPlacesRailActive
      ? "Saved Places"
    : activeCategory && activeLocation.city
      ? activeSeoPlaceLabel
      : activeDirectoryMeta.title;
  const visibleSeoContextLabel =
    !expandedGuide
      ? isSavedPlacesRailActive
        ? null
        : activeCategory && activeLocation.city
        ? `${activeCategory} in`
        : "Explore"
      : null;
  const visibleLocationDetail = [
    activeLocation.city?.name,
    activeLocation.country?.name ?? activeLocation.city?.country,
  ]
    .filter(Boolean)
    .join(", ");
  const categoryCityDescriptions: Partial<Record<ListCategory, string>> = {
    Food: `${activeSeoPlaceLabel} is built around long lunches, late dinners, tapas counters, seafood rooms, market cooking, and ambitious reservations that shift by neighborhood.`,
    Nightlife: `${activeSeoPlaceLabel} runs late, with compact bar circuits, vermouth counters, cocktail rooms, music venues, and social streets that make nights easy to stretch.`,
    Culture: `${activeSeoPlaceLabel} layers Modernista architecture, medieval streets, major museums, design landmarks, and public squares into a city that rewards slow wandering.`,
    Stay: `${activeSeoPlaceLabel} has a wide stay scene, from design hotels and boutique guesthouses to social hostels and practical bases near transit, nightlife, and the old city.`,
    Nature: `${activeSeoPlaceLabel} balances dense urban neighborhoods with parks, viewpoints, waterfront walks, gardens, and easy open-air breaks between city routes.`,
    Activities: `${activeSeoPlaceLabel} is social, walkable, and high energy, with compact routes that can move from architecture and food to beach time, bars, and late-night neighborhoods.`,
    Routes: `${activeSeoPlaceLabel} rewards route-first planning: walking loops, major streets, transit hops, waterfront edges, scenic drives, and practical ways to connect stops without losing the day to movement.`,
    Essentials: `${activeSeoPlaceLabel} is easier to plan when arrival, transit, safety, money, connectivity, weather, booking rhythm, and neighborhood basics are clear before the day fills up.`,
  };
  const visibleSeoIntroCopy = activeLocation.city
    ? activeLocation.nestedSubarea || activeLocation.subarea
      ? activeCategory
        ? buildScopedCategoryDescription(
            categoryCityDescriptionProfiles[activeLocation.city.id],
            activeCategory,
            activeSeoPlaceLabel,
            activeLocation.city.name,
          ) ??
          activeLocationDescription ??
          `${activeSeoPlaceLabel} is a ${visibleLocationDetail} neighborhood shaped by its street life, dining rhythm, architecture, bars, local routes, and the way visitors move through it.`
        : activeLocationDescription ??
        `${activeSeoPlaceLabel} is a ${visibleLocationDetail} neighborhood shaped by its street life, dining rhythm, architecture, bars, local routes, and the way visitors move through it.`
      : activeCategory
        ? categoryCityDescriptionOverrides[activeLocation.city.id]?.[activeCategory] ?? categoryCityDescriptions[activeCategory]
        : activeLocationDescription
    : null;
  const visibleIntroCopy = expandedGuide
    ? expandedGuide.description
    : isSavedPlacesRailActive
      ? null
    : activeCategory && activeLocation.city
      ? visibleSeoIntroCopy
      : visibleSeoIntroCopy ?? activeLocationDescription;
  const visibleIntroCopyDisplay = visibleIntroCopy ? capExplorerDescription(visibleIntroCopy) : null;
  const descriptionNeighborhoodMentions = useMemo<DescriptionNeighborhoodMention[]>(() => {
    if (
      !visibleIntroCopyDisplay ||
      !activeLocation.city ||
      !neighborhoodMentionCandidates.length ||
      expandedGuide ||
      isSavedPlacesRailActive
    ) {
      return [];
    }

    return findNeighborhoodMentionsInText(visibleIntroCopyDisplay, neighborhoodMentionCandidates);
  }, [
    activeLocation.city,
    expandedGuide,
    isSavedPlacesRailActive,
    neighborhoodMentionCandidates,
    visibleIntroCopyDisplay,
  ]);
  const handleDescriptionNeighborhoodSelect = (mention: DescriptionNeighborhoodMention) => {
    if (!activeLocation.continent || !activeLocation.country || !activeLocation.city) {
      return;
    }

    setHoveredDescriptionNeighborhoodId(null);

    const parentSubareaId = mention.parentSubareaId ?? activeLocation.subarea?.id;

    if (mention.isNested && parentSubareaId) {
      handleSelectNestedSubarea(
        activeLocation.continent.id,
        activeLocation.country.id,
        activeLocation.city.id,
        parentSubareaId,
        mention.id,
      );
      return;
    }

    handleSelectSubarea(
      activeLocation.continent.id,
      activeLocation.country.id,
      activeLocation.city.id,
      mention.id,
    );
  };
  const activeLeftPaneDefinitionTerms =
    getLeftPaneDefinitionTerms(activeLocation.city?.id);
  const handleLeftPaneDefinitionHoverStart = (term: LeftPaneDefinitionTerm, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const tooltipWidth = 256;
    const viewportPadding = 16;
    const x = Math.min(
      window.innerWidth - tooltipWidth / 2 - viewportPadding,
      Math.max(tooltipWidth / 2 + viewportPadding, rect.left + rect.width / 2),
    );

    setHoveredLeftPaneDefinition({
      term,
      x,
      y: rect.bottom + 10,
    });
  };
  const handleLeftPaneDefinitionHoverEnd = (term: LeftPaneDefinitionTerm) => {
    setHoveredLeftPaneDefinition((current) =>
      current?.term.term === term.term ? null : current,
    );
  };
  const renderLeftPaneAnnotatedText = (
    text: string,
    mentions: DescriptionNeighborhoodMention[],
    keyPrefix: string,
  ): ReactNode => {
    const definitionMentions = findLeftPaneDefinitionMentionsInText(
      text,
      activeLeftPaneDefinitionTerms,
      mentions,
    );
    const annotationMentions = [
      ...mentions.map((mention) => ({
        kind: "neighborhood" as const,
        start: mention.start,
        end: mention.end,
        mention,
      })),
      ...definitionMentions.map((mention) => ({
        kind: "definition" as const,
        start: mention.start,
        end: mention.end,
        mention,
      })),
    ].sort((left, right) => left.start - right.start || right.end - left.end);

    if (!annotationMentions.length) {
      return text;
    }

    let cursor = 0;
    return annotationMentions.flatMap((annotation) => {
      const before = text.slice(cursor, annotation.start);
      const label = text.slice(annotation.start, annotation.end);
      cursor = annotation.end;

      if (annotation.kind === "definition") {
        const term = annotation.mention.term;

        return [
          before,
          <button
            key={`${keyPrefix}-definition-${term.term}-${annotation.start}`}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              if (window.matchMedia("(max-width: 1023px)").matches) {
                setMobileLeftPaneDefinition(term);
              }
            }}
            onMouseEnter={(event) => handleLeftPaneDefinitionHoverStart(term, event.currentTarget)}
            onMouseLeave={() => handleLeftPaneDefinitionHoverEnd(term)}
            onFocus={(event) => handleLeftPaneDefinitionHoverStart(term, event.currentTarget)}
            onBlur={() => handleLeftPaneDefinitionHoverEnd(term)}
            className={`inline rounded-sm font-semibold underline decoration-dotted underline-offset-[4px] transition ${
              activeDestinationImage
                ? "text-white decoration-white/75 hover:text-white"
                : "text-slate-700 decoration-slate-400 hover:text-slate-950"
            }`}
            aria-label={`Define ${term.term}`}
          >
            {label}
          </button>,
        ];
      }

      const mention = annotation.mention;

      return [
        before,
        <button
          key={`${keyPrefix}-${mention.id}-${mention.start}`}
          type="button"
          onClick={() => handleDescriptionNeighborhoodSelect(mention)}
          onMouseEnter={() => setHoveredDescriptionNeighborhoodId(mention.id)}
          onMouseLeave={() =>
            setHoveredDescriptionNeighborhoodId((current) =>
              current === mention.id ? null : current,
            )
          }
          onFocus={() => setHoveredDescriptionNeighborhoodId(mention.id)}
          onBlur={() =>
            setHoveredDescriptionNeighborhoodId((current) =>
              current === mention.id ? null : current,
            )
          }
          className={`inline rounded-sm underline decoration-current underline-offset-[3px] transition ${
            activeDestinationImage
              ? "text-white/95 hover:text-white"
              : "text-slate-700 hover:text-slate-950"
          }`}
          aria-label={`Open ${formatBreadcrumbName(mention.name)}`}
          title={`Open ${formatBreadcrumbName(mention.name)}`}
        >
          {label}
        </button>,
      ];
    }).concat(text.slice(cursor));
  };
  const getCategoryInsightNoteNeighborhoodMentions = (text: string) =>
    activeLocation.city && neighborhoodMentionCandidates.length
      ? findNeighborhoodMentionsInText(text, neighborhoodMentionCandidates)
      : [];
  const cityHighlightRows = useMemo(() => {
    if (!activeLocation.city || !allActiveLists.length) {
      return [];
    }

    const cityScopeLists = allActiveLists
      .filter(
        (list) =>
          list.location.scope === "city" &&
          list.location.city === activeLocation.city!.name &&
          (!activeNeighborhoodKey ||
            normalizeNeighborhoodName(list.location.neighborhood) === activeNeighborhoodKey),
      )
      .slice()
      .sort((left, right) => right.upvotes - left.upvotes || left.title.localeCompare(right.title));

    return cityHighlightCategoryOrder.flatMap((entry) => {
      const categoryGuides = cityScopeLists.filter((list) => list.category === entry.category);
      const usedGuideIds = new Set<string>();
      const themes = getCityHighlightThemes(entry.category, contextualFoodCuisineOptions);
      const items = themes.flatMap((theme) => {
        const guide =
          categoryGuides.find((list) => !usedGuideIds.has(list.id) && doesGuideMatchHighlightTheme(list, theme)) ??
          categoryGuides.find((list) => !usedGuideIds.has(list.id));

        if (!guide) {
          return [];
        }

        usedGuideIds.add(guide.id);
        return [{ label: theme, guide }];
      });

      if (!items.length) {
        return [];
      }

      return [
        {
          ...entry,
          items,
        },
      ];
    });
  }, [activeLocation.city, activeNeighborhoodKey, allActiveLists, contextualFoodCuisineOptions]);
  const activeCategoryInsight = useMemo(
    () => {
      if (!activeCategory || !activeLocation.city) {
        return null;
      }

      const destinationInsights =
        activeLocation.nestedSubarea?.categoryInsights?.length
          ? activeLocation.nestedSubarea.categoryInsights
          : activeLocation.subarea?.categoryInsights?.length
            ? activeLocation.subarea.categoryInsights
            : activeLocation.city.categoryInsights;

      return buildCategoryInsight({
        category: activeCategory,
        cityId: activeLocation.city.id,
        placeLabel: activeSeoPlaceLabel,
        cuisines: contextualFoodCuisineOptions,
        subcategories: activeSubcategoryOptions,
        categoryInsights: destinationInsights,
      });
    },
    [
      activeCategory,
      activeLocation.city,
      activeLocation.nestedSubarea,
      activeLocation.subarea,
      activeSeoPlaceLabel,
      contextualFoodCuisineOptions,
      activeSubcategoryOptions,
    ],
  );
  const activeCategoryInsightNotes = useMemo(
    () =>
      buildCategoryInsightNotes({
        categoryInsight: activeCategoryInsight,
        activeFoodCuisine,
        placeLabel: activeSeoPlaceLabel,
      }),
    [activeCategoryInsight, activeFoodCuisine, activeSeoPlaceLabel],
  );
  useEffect(() => {
    if (activeCategoryInsight) {
      lastCategoryInsightRef.current = activeCategoryInsight;
      lastCategoryInsightNotesRef.current = activeCategoryInsightNotes;
      if (categoryInsightExitTimeoutRef.current) {
        clearTimeout(categoryInsightExitTimeoutRef.current);
        categoryInsightExitTimeoutRef.current = null;
      }
      setExitingCategoryInsight(null);
      setExitingCategoryInsightNotes([]);
      return;
    }

    const previousInsight = lastCategoryInsightRef.current;
    if (!previousInsight || expandedGuide) {
      lastCategoryInsightRef.current = null;
      lastCategoryInsightNotesRef.current = [];
      setExitingCategoryInsight(null);
      setExitingCategoryInsightNotes([]);
      return;
    }

    setExitingCategoryInsight(previousInsight);
    setExitingCategoryInsightNotes(lastCategoryInsightNotesRef.current);
    lastCategoryInsightRef.current = null;
    lastCategoryInsightNotesRef.current = [];
    if (categoryInsightExitTimeoutRef.current) {
      clearTimeout(categoryInsightExitTimeoutRef.current);
    }
    categoryInsightExitTimeoutRef.current = setTimeout(() => {
      categoryInsightExitTimeoutRef.current = null;
      setExitingCategoryInsight(null);
      setExitingCategoryInsightNotes([]);
    }, 340);
  }, [activeCategoryInsight, activeCategoryInsightNotes, expandedGuide]);
  useEffect(
    () => () => {
      if (categoryInsightExitTimeoutRef.current) {
        clearTimeout(categoryInsightExitTimeoutRef.current);
      }
    },
    [],
  );
  const isCategoryInsightMode = !expandedGuide && Boolean(activeCategoryInsight);
  const isCategoryInsightExiting = !expandedGuide && !activeCategoryInsight && Boolean(exitingCategoryInsight);
  const displayCategoryInsight = activeCategoryInsight ?? exitingCategoryInsight;
  const displayCategoryInsightNotes = activeCategoryInsight ? activeCategoryInsightNotes : exitingCategoryInsightNotes;
  const handleCategoryInsightChipSelect = (chip: string) => {
    if (!activeCategoryInsight) {
      return;
    }

    if (activeCategoryInsight.category === "Food") {
      const cuisine = activeFoodCuisineOptions.find((option) => option.toLowerCase() === chip.toLowerCase());
      if (!cuisine) {
        return;
      }

      setActiveFoodCuisine((current) => (current.toLowerCase() === cuisine.toLowerCase() ? FOOD_CUISINE_ANY : cuisine));
      setActiveSubcategory(null);
      setActiveFoodPrice(null);
      setActiveFoodOpenTime("Now");
      setIsFoodCuisineMenuOpen(false);
      setIsFoodOpenTimeMenuOpen(false);
      return;
    }

    const subcategory = activeSubcategoryOptions.find((option) => option.toLowerCase() === chip.toLowerCase()) ?? chip;
    if (!subcategory) {
      return;
    }

    setActiveSubcategory((current) => (current?.toLowerCase() === subcategory.toLowerCase() ? null : subcategory));
    setActiveFoodCuisine(FOOD_CUISINE_ANY);
    setActiveFoodPrice(null);
    setActiveFoodOpenTime("Now");
    setIsFoodCuisineMenuOpen(false);
    setIsFoodOpenTimeMenuOpen(false);
    setActiveNightlifeBarType(NIGHTLIFE_BAR_TYPE_ANY);
    setIsNightlifeBarMenuOpen(false);
    setActiveNightlifeMusicType(NIGHTLIFE_MUSIC_TYPE_ANY);
    setIsNightlifeMusicMenuOpen(false);
  };
  useEffect(() => {
    if (!isGuidePaneTakingFullListPane) {
      return;
    }
    setIsFoodOpenTimeMenuOpen(false);
    setIsFoodCuisineMenuOpen(false);
    setIsNightlifeBarMenuOpen(false);
    setIsNightlifeMusicMenuOpen(false);
    setHoveredCategoryLabel(null);
    setIsMobileListSheetExpanded(true);
  }, [isGuidePaneTakingFullListPane]);
  const getVisibleGuideAnchorElements = (targetIds?: Set<string> | null) => {
    const scrollerRects = new WeakMap<HTMLElement, DOMRect>();
    return Array.from(document.querySelectorAll<HTMLDivElement>("[data-guide-card-anchor]")).filter((element) => {
      const guideId = element.dataset.guideCardAnchor;
      if (targetIds && (!guideId || !targetIds.has(guideId))) {
        return false;
      }

      const scroller = element.closest("[data-guides-scroll]");
      if (!(scroller instanceof HTMLElement)) {
        return false;
      }

      const elementRect = element.getBoundingClientRect();
      const cachedScrollerRect = scrollerRects.get(scroller);
      const scrollerRect = cachedScrollerRect ?? scroller.getBoundingClientRect();
      if (!cachedScrollerRect) {
        scrollerRects.set(scroller, scrollerRect);
      }
      return (
        elementRect.width > 0 &&
        elementRect.height > 0 &&
        scrollerRect.width > 0 &&
        scrollerRect.height > 0 &&
        elementRect.bottom >= scrollerRect.top &&
        elementRect.top <= scrollerRect.bottom
      );
    });
  };
  const getVisibleGuideAnchorElement = (guideId: string) =>
    getVisibleGuideAnchorElements().find((element) => element.dataset.guideCardAnchor === guideId) ?? null;
  const getGuideAnchorElement = (guideId: string) =>
    getVisibleGuideAnchorElement(guideId) ??
    document.querySelector<HTMLDivElement>(`[data-guide-card-anchor="${CSS.escape(guideId)}"]`);
  const cancelGuideScrollAnimation = () => {
    if (guideScrollAnimationFrameRef.current !== null) {
      cancelAnimationFrame(guideScrollAnimationFrameRef.current);
      guideScrollAnimationFrameRef.current = null;
    }
    if (guideScrollSettleTimeoutRef.current !== null) {
      window.clearTimeout(guideScrollSettleTimeoutRef.current);
      guideScrollSettleTimeoutRef.current = null;
    }
  };
  const getGuideScrollTarget = (guideId: string) => {
    const element = getGuideAnchorElement(guideId);
    const scroller = element?.closest("[data-guides-scroll]");

    if (!(element instanceof HTMLElement) || !(scroller instanceof HTMLElement)) {
      return null;
    }

    const elementRect = element.getBoundingClientRect();
    const scrollerRect = scroller.getBoundingClientRect();

    return {
      scroller,
      top: Math.max(0, scroller.scrollTop + elementRect.top - scrollerRect.top),
    };
  };
  const alignGuideToScrollerTop = (guideId: string) => {
    const target = getGuideScrollTarget(guideId);
    if (!target) {
      return;
    }

    target.scroller.scrollTo({
      top: target.top,
      behavior: "auto",
    });
  };
  const scrollGuideIntoView = (
    guideId: string,
    options: { behavior?: ScrollBehavior; defer?: boolean } = {},
  ) => {
    const { behavior = "smooth", defer = true } = options;
    const runScroll = () => {
      cancelGuideScrollAnimation();

      const target = getGuideScrollTarget(guideId);
      if (!target) {
        return;
      }

      if (behavior !== "smooth") {
        target.scroller.scrollTo({
          top: target.top,
          behavior,
        });
        return;
      }

      const scroller = target.scroller;
      const startTop = scroller.scrollTop;
      const startedAt = performance.now();
      const duration = 520;
      const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

      const animate = () => {
        const latestTarget = getGuideScrollTarget(guideId);
        if (!latestTarget || latestTarget.scroller !== scroller) {
          guideScrollAnimationFrameRef.current = null;
          return;
        }

        const progress = Math.min(1, (performance.now() - startedAt) / duration);
        const easedProgress = easeOutCubic(progress);
        const nextTop = startTop + (latestTarget.top - startTop) * easedProgress;
        scroller.scrollTo({
          top: nextTop,
          behavior: "auto",
        });

        if (progress < 1) {
          guideScrollAnimationFrameRef.current = requestAnimationFrame(animate);
          return;
        }

        guideScrollAnimationFrameRef.current = null;
        alignGuideToScrollerTop(guideId);
        guideScrollSettleTimeoutRef.current = window.setTimeout(() => {
          guideScrollSettleTimeoutRef.current = null;
          alignGuideToScrollerTop(guideId);
        }, 120);
      };

      guideScrollAnimationFrameRef.current = requestAnimationFrame(animate);
    };

    if (defer) {
      requestAnimationFrame(runScroll);
      return;
    }

    runScroll();
  };
  const handleHoverGuideMarker = (guideId: string | null) => {
    setHoveredGuideMarkerId(guideId);

    if (!guideId) {
      hoveredGuideMarkerScrollRef.current = null;
      setHoveredGuide(null);
      return;
    }

    const guide =
      activeEditorialLists.find((list) => list.id === guideId) ??
      globalMergedLists.find((list) => list.id === guideId) ??
      null;
    setHoveredGuide(guide);
    if (hoveredGuideMarkerScrollRef.current !== guideId) {
      hoveredGuideMarkerScrollRef.current = guideId;
      scrollGuideIntoView(guideId, { behavior: "smooth", defer: false });
    }
  };
  const handleGuideCardHoverStart = (list: MapList) => {
    setHoveredGuide(list);
    setHoveredGuideMarkerId(list.id);
  };
  const handleGuideCardHoverEnd = () => {
    setHoveredGuide(null);
    setHoveredGuideMarkerId(null);
  };
  const captureGuideLayoutPositions = (
    motion: "default" | "open" | "close" = "default",
    guideIds?: string | string[],
  ) => {
    guideLayoutAnimationFramesRef.current.forEach((frame) => cancelAnimationFrame(frame));
    guideLayoutAnimationFramesRef.current = [];
    guideLayoutAnimationsRef.current.forEach((animation) => animation.cancel());
    guideLayoutAnimationsRef.current = [];
    guideLayoutCleanupTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    guideLayoutCleanupTimeoutsRef.current = [];
    guideLayoutMotionRef.current = motion;
    const targetIds = guideIds
      ? new Set(Array.isArray(guideIds) ? guideIds : [guideIds])
      : null;
    guideLayoutTargetIdsRef.current = targetIds;
    guideLayoutPositionsRef.current = Object.fromEntries(
      getVisibleGuideAnchorElements(targetIds)
        .map((element) => [element.dataset.guideCardAnchor, element.getBoundingClientRect()] as const)
        .filter((entry): entry is [string, DOMRect] => Boolean(entry[0])),
    );
    shouldAnimateGuideLayoutRef.current = true;
  };

  useLayoutEffect(() => {
    if (!shouldAnimateGuideLayoutRef.current) {
      return;
    }

    shouldAnimateGuideLayoutRef.current = false;
    const guideLayoutMotion = guideLayoutMotionRef.current;
    guideLayoutMotionRef.current = "default";
    const targetIds = guideLayoutTargetIdsRef.current;
    guideLayoutTargetIdsRef.current = null;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      guideLayoutPositionsRef.current = {};
      return;
    }

    const changedElements = getVisibleGuideAnchorElements(targetIds).flatMap((element) => {
      const guideId = element.dataset.guideCardAnchor;
      if (!guideId) {
        return [];
      }

      const previousRect = guideLayoutPositionsRef.current[guideId];

      if (!previousRect) {
        return [];
      }

      const nextRect = element.getBoundingClientRect();
      const deltaX = previousRect.left - nextRect.left;
      const deltaY = previousRect.top - nextRect.top;

      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
        return [];
      }

      element.style.transition = "none";
      element.style.transformOrigin = "top left";
      element.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
      element.style.willChange = "transform";

      return [
        {
          element,
          deltaX,
          deltaY,
          motion: guideLayoutMotion,
          duration: guideLayoutMotion === "open"
            ? GUIDE_LAYOUT_OPEN_TOTAL_MS
            : guideLayoutMotion === "close"
              ? GUIDE_LAYOUT_CLOSE_TOTAL_MS
              : GUIDE_LAYOUT_MOTION_MS,
        },
      ];
    });

    guideLayoutPositionsRef.current = {};

    if (!changedElements.length) {
      return;
    }

    const animationFrame = requestAnimationFrame(() => {
      changedElements.forEach(({ deltaX, deltaY, duration, element, motion }) => {
        const easing = "cubic-bezier(0.22, 1, 0.36, 1)";
        if (motion === "open" && Math.abs(deltaX) > 8 && Math.abs(deltaY) > 8 && "animate" in element) {
          const animation = element.animate(
            [
              {
                offset: 0,
                transform: `translate3d(${deltaX}px, ${deltaY}px, 0)`,
                easing: "cubic-bezier(0.33, 1, 0.68, 1)",
              },
              {
                offset: GUIDE_LAYOUT_OPEN_SIDEWAYS_OFFSET,
                transform: `translate3d(0, ${deltaY}px, 0)`,
                easing,
              },
              {
                offset: 1,
                transform: "translate3d(0, 0, 0)",
              },
            ],
            {
              duration,
              fill: "both",
            },
          );
          guideLayoutAnimationsRef.current.push(animation);
          element.style.transform = "";
          return;
        }

        if (motion === "close" && Math.abs(deltaX) > 8 && Math.abs(deltaY) > 8 && "animate" in element) {
          const animation = element.animate(
            [
              {
                offset: 0,
                transform: `translate3d(${deltaX}px, ${deltaY}px, 0)`,
                easing,
              },
              {
                offset: GUIDE_LAYOUT_CLOSE_VERTICAL_OFFSET,
                transform: `translate3d(${deltaX}px, 0, 0)`,
                easing: "cubic-bezier(0.33, 1, 0.68, 1)",
              },
              {
                offset: 1,
                transform: "translate3d(0, 0, 0)",
              },
            ],
            {
              duration,
              fill: "both",
            },
          );
          guideLayoutAnimationsRef.current.push(animation);
          element.style.transform = "";
          return;
        }

        element.style.transition = `transform ${duration}ms ${easing}`;
        element.style.transform = "translate3d(0, 0, 0)";
      });

      const cleanupFrame = requestAnimationFrame(() => {
        const cleanupTimeout = window.setTimeout(() => {
          changedElements.forEach(({ element }) => {
            element.getAnimations().forEach((animation) => animation.cancel());
            element.style.transition = "";
            element.style.transform = "";
            element.style.transformOrigin = "";
            element.style.willChange = "";
          });
          guideLayoutAnimationsRef.current = [];
          guideLayoutCleanupTimeoutsRef.current = guideLayoutCleanupTimeoutsRef.current.filter(
            (timeoutId) => timeoutId !== cleanupTimeout,
          );
        }, Math.max(...changedElements.map((item) => item.duration)) + 64);
        guideLayoutCleanupTimeoutsRef.current.push(cleanupTimeout);
      });

      guideLayoutAnimationFramesRef.current.push(cleanupFrame);
    });

    guideLayoutAnimationFramesRef.current.push(animationFrame);
  });
  const breadcrumbButtonClass = activeDestinationImage
    ? "font-medium text-white drop-shadow-sm transition hover:text-white"
    : "font-medium text-slate-600 transition hover:text-slate-900";
  const breadcrumbSeparatorClass = activeDestinationImage ? "text-white/80 drop-shadow-sm" : "text-slate-400";
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
  const completeGuideOpening = (nextList: MapList) => {
    if (openingGuideIdRef.current !== nextList.id) {
      return;
    }
    openingGuideIdRef.current = null;
    if (openingGuideTimeoutRef.current) {
      clearTimeout(openingGuideTimeoutRef.current);
      openingGuideTimeoutRef.current = null;
    }
    captureGuideLayoutPositions("open", nextList.id);
    setOpeningGuideId(null);
    setExpandedGuideId(nextList.id);
    setHoveredStopId(null);
    setSelectedGuideStopId(null);
    if (activeGuideRail !== "itinerary") {
      setActiveCategory(nextList.category);
    }
    setMapResizeSignal((current) => current + 1);
    setActiveGuideFitNonce((current) => current + 1);
    const guidePath = getGuideCanonicalRoutePath(nextList);
    if (guidePath) {
      pushExplorerPath(guidePath);
    }
  };
  const handleGuideToggle = (nextList: MapList) => {
    if (closingGuideTimeoutRef.current) {
      clearTimeout(closingGuideTimeoutRef.current);
      closingGuideTimeoutRef.current = null;
    }
    if (openingGuideTimeoutRef.current) {
      clearTimeout(openingGuideTimeoutRef.current);
      openingGuideTimeoutRef.current = null;
    }
    openingGuideIdRef.current = null;
    clearGuideContentRevealSchedule();
    setSettlingGuideContentId(null);

    if (expandedGuideId === nextList.id && expandedGuide) {
      const restoredCategory = restoreCategoryAfterGuideCollapse();
      setClosingGuide(expandedGuide);
      setClosingGuidePhase("precollapsing");
      setOpeningGuideId(null);
      setVisibleNestedStopParentIds([]);
      setHoveredStopId(null);
      setSelectedGuideStopId(null);
      const nextPath = getCurrentCityRoutePath(restoredCategory);
      if (nextPath) {
        pushExplorerPath(nextPath);
      }
      closingGuideTimeoutRef.current = setTimeout(() => {
        captureGuideLayoutPositions("close", expandedGuide.id);
        setClosingGuidePhase("returning");
        setExpandedGuideId(null);
        setActiveCategory(restoredCategory);
        closingGuideTimeoutRef.current = setTimeout(() => {
          setClosingGuidePhase("collapsing");
          closingGuideTimeoutRef.current = setTimeout(() => {
            setClosingGuide(null);
            setClosingGuidePhase(null);
            setActiveCategory(restoredCategory);
            closingGuideTimeoutRef.current = null;
          }, GUIDE_CHROME_WIPE_MS);
        }, GUIDE_COLLAPSE_CONTENT_START_MS);
      }, GUIDE_PRE_COLLAPSE_CONTENT_MS);
      return;
    }

    captureGuideLayoutPositions("open", nextList.id);
    if (!expandedGuideId) {
      captureCategoryBeforeGuideExpand();
    }
    setClosingGuide(null);
    setClosingGuidePhase(null);
    openingGuideIdRef.current = nextList.id;
    setOpeningGuideId(nextList.id);
    deferGuideContentUntilMotionSettles(nextList.id);
    setVisibleNestedStopParentIds([]);
    setHoveredStopId(null);
    setSelectedGuideStopId(null);
    openingGuideTimeoutRef.current = setTimeout(() => completeGuideOpening(nextList), GUIDE_OPEN_EXPAND_START_MS);
  };
  const handleCityHighlightGuideSelect = (nextList: MapList) => {
    if (closingGuideTimeoutRef.current) {
      clearTimeout(closingGuideTimeoutRef.current);
      closingGuideTimeoutRef.current = null;
    }
    if (openingGuideTimeoutRef.current) {
      clearTimeout(openingGuideTimeoutRef.current);
      openingGuideTimeoutRef.current = null;
    }
    openingGuideIdRef.current = null;
    setOpeningGuideId(null);
    clearGuideContentRevealSchedule();
    setSettlingGuideContentId(null);

    setActiveGuideRail("all-guides");
    setActiveGuideSource(nextList.creator.name.startsWith("R ") ? "r-guides" : "user-guides");
    setActiveSubcategory(null);
    setActiveFoodPrice(null);
    setActiveFoodOpenTime("Now");
    setIsFoodOpenTimeMenuOpen(false);
    setActiveFoodCuisine(FOOD_CUISINE_ANY);
    setIsFoodCuisineMenuOpen(false);
    setActiveNightlifeBarType(NIGHTLIFE_BAR_TYPE_ANY);
    setIsNightlifeBarMenuOpen(false);
    setActiveNightlifeMusicType(NIGHTLIFE_MUSIC_TYPE_ANY);
    setIsNightlifeMusicMenuOpen(false);

    if (expandedGuideId === nextList.id) {
      scrollGuideIntoView(nextList.id);
      return;
    }

    scrollGuideIntoView(nextList.id, { behavior: "auto", defer: false });
    captureGuideLayoutPositions("open", nextList.id);
    if (!expandedGuideId) {
      captureCategoryBeforeGuideExpand();
    }
    setClosingGuide(null);
    setClosingGuidePhase(null);
    deferGuideContentUntilMotionSettles(nextList.id, GUIDE_DIRECT_CONTENT_REVEAL_DELAY_MS);
    setVisibleNestedStopParentIds([]);
    setHoveredStopId(null);
    setSelectedGuideStopId(null);
    setExpandedGuideId(nextList.id);
    setActiveCategory(nextList.category);
    setActiveGuideFitNonce((current) => current + 1);

    const guidePath = getGuideCanonicalRoutePath(nextList);
    if (guidePath) {
      pushExplorerPath(guidePath);
    }
  };
  const handleGuideCrossLinkSelect = (guideId: string) => {
    const nextGuide = activeEditorialLists.find((guide) => guide.id === guideId);
    if (!nextGuide) {
      return;
    }

    const guidePath = getGuideCanonicalRoutePath(nextGuide);
    const guidePathSegments = guidePath?.split("/").filter(Boolean) ?? [];
    const route = guidePath
      ? locale === "es"
        ? resolveLocalizedCityDeepLink(locale, guidePathSegments.slice(2), {
            continents,
            guides: activeEditorialLists,
          })
        : resolveCityDeepLink(guidePathSegments.slice(1), {
            continents,
            guides: activeEditorialLists,
          })
      : null;
    const nextGuideSource = nextGuide.creator.name.startsWith("R ") ? "r-guides" : "user-guides";
    const selectionWillChange = route
      ? JSON.stringify(selection) !== JSON.stringify(route.selection)
      : false;

    if (selectionWillChange && route) {
      skipInitialSelectionCleanupRef.current = true;
      setSelection(route.selection);
    }
    if (activeGuideSource !== nextGuideSource) {
      skipInitialGuideRailCleanupRef.current = true;
    }
    handleCityHighlightGuideSelect(nextGuide);
  };
  const handleProfileGuideToggle = (nextList: MapList) => {
    setProfileExpandedGuideId((current) => {
      if (current === nextList.id) {
        setVisibleNestedStopParentIds([]);
        setHoveredStopId(null);
        setSelectedGuideStopId(null);
        return null;
      }
      setVisibleNestedStopParentIds([]);
      setHoveredStopId(null);
      setSelectedGuideStopId(null);
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
  const handleSelectGuideMarker = (guideId: string) => {
    const guide =
      activeEditorialLists.find((list) => list.id === guideId) ??
      globalMergedLists.find((list) => list.id === guideId) ??
      null;

    if (!guide) {
      return;
    }

    setHoveredGuideMarkerId(guideId);
    setHoveredGuide(guide);
    hoveredGuideMarkerScrollRef.current = guideId;
    scrollGuideIntoView(guideId, { behavior: "auto", defer: false });
    handleGuideToggle(guide);
  };
  const handleGuideStopSelect = (stopId: string) => {
    setHoveredStopId(stopId);
    setSelectedGuideStopId(stopId);
    setSelectedGuideStopNonce((current) => current + 1);
  };
  const handleOpenItineraryGuide = (list: MapList) => {
    setActiveCategory(null);
    clearCategoryBeforeGuideExpand();
    setActiveSubcategory(null);
    if (expandedGuideId !== list.id) {
      handleGuideToggle(list);
      return;
    }
    scrollGuideIntoView(list.id);
  };
  const getProfileCreateDefaults = () => {
    const fallbackContinent = continents[0];
    const fallbackCountry = fallbackContinent?.countries[0];
    const fallbackCity = fallbackCountry?.cities.find((city) => !city.isPlaceholderRegion) ?? fallbackCountry?.cities[0];

    return {
      continentId: activeLocation.continent?.id ?? fallbackContinent?.id ?? "",
      countryId: activeLocation.country?.id ?? fallbackCountry?.id ?? "",
      cityId: activeLocation.city?.id ?? fallbackCity?.id ?? "",
      subareaId: activeLocation.subarea?.id ?? "",
      nestedSubareaId: activeLocation.nestedSubarea?.id ?? "",
    };
  };
  const openProfileCreateModal = () => {
    if (!currentUser) {
      openAuthModal("login");
      return;
    }
    if (!canCreateStandaloneProfileEntry) {
      return;
    }
    const defaults = getProfileCreateDefaults();
    setProfileCreateName("");
    setProfileCreateType("guide");
    setProfileCreateCategory(activeCategory ?? "Food");
    setProfileCreateContinentId(defaults.continentId);
    setProfileCreateCountryId(defaults.countryId);
    setProfileCreateCityId(defaults.cityId);
    setProfileCreateSubareaId(defaults.subareaId);
    setProfileCreateNestedSubareaId(defaults.nestedSubareaId);
    setIsProfileCreateModalOpen(true);
  };
  const getProfileDraftGuideLocation = () => {
    const selectedContinent = continents.find((continent) => continent.id === profileCreateContinentId);
    const fallbackContinent = selectedContinent ?? continents[0];
    const selectedCountry = fallbackContinent?.countries.find((country) => country.id === profileCreateCountryId);
    const fallbackCountry = selectedCountry ?? fallbackContinent?.countries[0];
    const selectedCity = profileCreateCityId
      ? fallbackCountry?.cities.find((city) => city.id === profileCreateCityId)
      : undefined;
    const selectedSubarea = selectedCity?.subareas?.find((subarea) => subarea.id === profileCreateSubareaId);
    const selectedNestedSubarea = selectedSubarea?.subareas?.find((subarea) => subarea.id === profileCreateNestedSubareaId);
    const countryBounds = fallbackCountry?.bounds;
    const fallbackCoordinates: [number, number] = countryBounds
      ? [
          (countryBounds[0][0] + countryBounds[1][0]) / 2,
          (countryBounds[0][1] + countryBounds[1][1]) / 2,
        ]
      : selectedCity?.coordinates ?? fallbackContinent?.coordinates ?? [0, 0];
    const stopCoordinates =
      selectedNestedSubarea?.coordinates ??
      selectedSubarea?.coordinates ??
      selectedCity?.coordinates ??
      fallbackCoordinates;

    return {
      continent: fallbackContinent?.name ?? "North America",
      country: fallbackCountry?.name ?? "United States",
      city: selectedCity?.name,
      neighborhood: selectedNestedSubarea?.name ?? selectedSubarea?.name,
      stopCoordinates,
    };
  };
  const handleCreateProfileGuide = () => {
    if (!currentUser) {
      openAuthModal("login");
      return;
    }
    if (!canCreateStandaloneProfileEntry) {
      return;
    }

    const draftLocation = getProfileDraftGuideLocation();
    const typeLabel =
      profileCreateType === "itinerary" ? "journey" : profileCreateType === "event" ? "event" : "guide";
    const title = profileCreateName.trim() || `Untitled ${typeLabel}`;
    const response = submitList({
      submissionType: profileCreateType,
      url: "https://www.google.com/maps",
      title,
      description:
        profileCreateType === "event"
          ? "Add event details."
          : profileCreateType === "itinerary"
            ? "Add a journey description."
            : "Add a guide description.",
      category: profileCreateCategory,
      continent: draftLocation.continent,
      country: draftLocation.country,
      city: draftLocation.city,
      neighborhood: draftLocation.neighborhood,
      stops: [
        {
          id: `manual-poi-${Date.now()}`,
          name: profileCreateType === "event" ? "Event location" : "New place",
          coordinates: draftLocation.stopCoordinates,
          description: profileCreateType === "event" ? "Add event location details." : "Add a POI description.",
          category: profileCreateCategory,
        },
      ],
    });

    if (!response.ok || !response.list) {
      return;
    }

    setActiveGuideSource("user-guides");
    setActiveGuideRail(profileCreateType === "event" ? "week-events" : profileCreateType === "itinerary" ? "itinerary" : "all-guides");
    setActiveProfileRightRail("guides");
    setProfileEditingListId(null);
    setIsProfileSubmitting(false);
    setIsProfileCreateModalOpen(false);
    setProfileExpandedGuideId(response.list.id);
    setProfileInlineEditNonce((current) => current + 1);
  };
  const handleEditGuideFromProfile = (list: MapList) => {
    if (!currentUser || list.creator.id !== currentUser.id) {
      return;
    }
    setProfileEditingListId(null);
    setIsProfileSubmitting(false);
    setProfileExpandedGuideId(list.id);
    setProfileInlineEditNonce((current) => current + 1);
  };
  useEffect(() => {
    if (isPublicProfileMode && isProfileShellActive) {
      setProfileShellActive(false);
      return;
    }
    if (isProfileShellActive && !currentUser) {
      setProfileShellActive(false);
    }
  }, [currentUser, isProfileShellActive, isPublicProfileMode, setProfileShellActive]);
  const targetShellMode: "explorer" | "profile" =
    isProfileShellActive && currentUser && !isPublicProfileMode ? "profile" : "explorer";
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
  const publicProfilePaneTransitionClass = isPublicProfileEntering ? "pane-content-enter" : "";
  const publicProfileRailTransitionClass = isPublicProfileEntering ? "rail-switch-enter" : "";
  const isProfileSettingsPane = activeProfileLeftRail === "settings";
  const isProfileOverviewPane =
    activeProfileLeftRail !== "places-been" &&
    !isProfileSettingsPane;
  const profileVisibility = currentUser?.visibility ?? "public";
  const isProfileEditDirty = Boolean(
    currentUser &&
      (profileAvatarFile ||
        profileNameDraft.trim() !== currentUser.name.trim() ||
        profileBioDraft.trim() !== currentUser.bio.trim()),
  );
  const darkPaneHeadingClass = "text-[11px] font-extrabold uppercase tracking-[0] text-[rgba(255,255,255,0.68)]";
  const darkPaneToggleClass = (active: boolean, enabled = true) =>
    `flex h-8 w-8 items-center justify-center rounded-sm border transition ${
      active
        ? "border-2 border-[#8ed8f8] bg-transparent text-[#8ed8f8]"
        : "border-white/30 bg-transparent text-white hover:border-white/70 hover:text-white"
    } ${enabled ? "" : "cursor-not-allowed opacity-55"}`;
  const darkPaneRowClass = (active: boolean) =>
    `group flex w-full items-center gap-2 border-x-0 border-b border-t-0 border-white/12 px-2 py-2.5 text-left text-sm transition ${
      active
        ? "left-pane-directory-row-active font-semibold"
        : "text-white hover:bg-white/[0.06]"
    }`;
  const darkPanePillClass = (active: boolean, size: "xs" | "sm" = "sm") =>
    `rounded-sm border transition ${
      size === "xs" ? "px-3 py-1 text-xs font-medium" : "px-3 py-1.5 text-sm"
    } ${
      active
        ? "left-pane-light-surface left-pane-light-ink font-semibold"
        : "border-white/24 text-white hover:border-white/70"
    }`;
  const darkRailCircleButtonClass = (active: boolean, extra = "") =>
    `guide-rail-button ${extra} flex h-10 w-10 items-center justify-center rounded-full border bg-transparent text-white transition hover:scale-105 hover:border-2 hover:border-white hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
      active ? "border-2 border-white text-white" : "border-white/45 text-white/78"
    }`;
  const renderProfileRailIcon = (option: (typeof profileLeftRailOptions)[number], active: boolean) => {
    if (option.id === "places-been" && active) {
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]">
          <path
            fill="#ef4444"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2.25a7.25 7.25 0 0 0-7.25 7.25c0 5.2 5.15 10.25 6.72 11.66a.8.8 0 0 0 1.06 0c1.57-1.41 6.72-6.46 6.72-11.66A7.25 7.25 0 0 0 12 2.25Zm0 10.15a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5Z"
          />
        </svg>
      );
    }

    if (option.id === "settings" && active) {
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]">
          <path
            fill="#ffffff"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.92 2.5h4.16l.58 2.36c.45.17.88.38 1.29.64l2.11-1.26 2.94 2.94-1.26 2.11c.26.41.47.84.64 1.29l2.36.58v4.16l-2.36.58c-.17.45-.38.88-.64 1.29l1.26 2.11-2.94 2.94-2.11-1.26c-.41.26-.84.47-1.29.64l-.58 2.36H9.92l-.58-2.36a8.97 8.97 0 0 1-1.29-.64l-2.11 1.26L3 19.3l1.26-2.11a8.97 8.97 0 0 1-.64-1.29l-2.36-.58v-4.16l2.36-.58c.17-.45.38-.88.64-1.29L3 7.18l2.94-2.94L8.05 5.5c.41-.26.84-.47 1.29-.64l.58-2.36ZM12 15.15a3.15 3.15 0 1 0 0-6.3 3.15 3.15 0 0 0 0 6.3Z"
          />
        </svg>
      );
    }

    if (option.id !== "edit-profile") {
      const Icon = option.icon;
      return <Icon className="h-4 w-4" />;
    }

    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <g transform="rotate(-40 12 12)">
          <rect x="9" y="3" width="6" height="4" rx="1" fill="#ef4444" />
          <rect x="9" y="6.4" width="6" height="11.2" rx="1" fill="#facc15" />
          <path d="M9 17.2h6L12 22l-3-4.8Z" fill="#f8fafc" />
          <path d="M11.05 20.48 12 22l.95-1.52h-1.9Z" fill="#111827" />
        </g>
      </svg>
    );
  };
  const railEnteringMode =
    shellTransitionPhase === "entering" ? displayShellMode : null;
  const profileRailItemStyle = (index: number) =>
    railEnteringMode === "profile"
      ? {
          animation: "rail-switch-pop 700ms cubic-bezier(0.22, 1, 0.36, 1) both",
          animationDelay: `${index * 220}ms`,
        }
      : undefined;
  const isEnteringProfileShell =
    shellTransitionPhase === "entering" && displayShellMode === "profile";
  useEffect(() => {
    if (!isPublicProfileMode) {
      setIsPublicProfileEntering(false);
      return;
    }

    setIsPublicProfileEntering(true);
    const timeoutId = window.setTimeout(() => {
      setIsPublicProfileEntering(false);
    }, 1240);

    return () => window.clearTimeout(timeoutId);
  }, [isPublicProfileMode, publicProfile?.creator.id]);
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
      setActiveGuideRail("all-guides");
      setActiveGuideSource("all-guides");
      setExpandedGuideId(null);
      setClosingGuide(null);
      setVisibleNestedStopParentIds([]);
      setProfileExpandedGuideId(null);
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
    let viewportInsetsFrame: number | null = null;
    const updateViewportInsets = () => {
      viewportInsetsFrame = null;
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
    const scheduleViewportInsetsUpdate = () => {
      if (viewportInsetsFrame !== null) {
        return;
      }
      viewportInsetsFrame = window.requestAnimationFrame(updateViewportInsets);
    };

    scheduleViewportInsetsUpdate();
    const timeoutId = window.setTimeout(scheduleViewportInsetsUpdate, 420);
    window.addEventListener("resize", scheduleViewportInsetsUpdate, { passive: true });

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(scheduleViewportInsetsUpdate);
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
      if (viewportInsetsFrame !== null) {
        window.cancelAnimationFrame(viewportInsetsFrame);
      }
      window.clearTimeout(timeoutId);
      window.removeEventListener("resize", scheduleViewportInsetsUpdate);
      observer?.disconnect();
    };
  }, [displayShellMode, isGuidePaneTakingFullListPane, isMobileListSheetExpanded, isProfileMode, isProfileSubmitLayout]);

  const profileCreateContinent = continents.find((continent) => continent.id === profileCreateContinentId) ?? null;
  const profileCreateCountry =
    profileCreateContinent?.countries.find((country) => country.id === profileCreateCountryId) ?? null;
  const profileCreateCity =
    profileCreateCountry?.cities.find((city) => city.id === profileCreateCityId) ?? null;
  const profileCreateSubarea =
    profileCreateCity?.subareas?.find((subarea) => subarea.id === profileCreateSubareaId) ?? null;
  const profileCreateNestedSubarea =
    profileCreateSubarea?.subareas?.find((subarea) => subarea.id === profileCreateNestedSubareaId) ?? null;
  const profileCreateNeighborhoodOptions =
    profileCreateCity?.subareas?.flatMap((subarea) => [
      {
        id: `subarea:${subarea.id}`,
        label: subarea.name,
      },
      ...(subarea.subareas?.map((nestedSubarea) => ({
        id: `nested:${subarea.id}:${nestedSubarea.id}`,
        label: `${subarea.name} / ${nestedSubarea.name}`,
      })) ?? []),
    ]) ?? [];
  const profileCreateTypeOptions = [
    { id: "guide" as const, label: "Guide", icon: MaterialMap },
    { id: "itinerary" as const, label: "Journey", icon: MaterialRoute },
    { id: "event" as const, label: "Event", icon: MaterialCalendarMonth },
  ];

  return (
    <section id="map-explorer" className="w-full py-0 lg:pb-0 lg:pt-2">
      <div className="flex w-full flex-col items-stretch gap-2 lg:flex-row lg:items-start lg:gap-0">
	        <div className={`z-20 hidden w-full shrink-0 flex-row items-center justify-center gap-3 overflow-x-auto px-3 py-1 sm:px-4 lg:flex lg:w-14 lg:flex-col lg:overflow-visible lg:px-0 lg:py-0 lg:pt-3 ${railTransitionClass} ${publicProfileRailTransitionClass}`}>
              <Link
                href="/"
                onClick={() => {
                  setProfileShellActive(false);
                  handleResetToGlobalView();
                  setActiveCategory(null);
                  setActiveSubcategory(null);
                }}
                className="rail-switch-item flex h-10 w-10 items-center justify-center rounded-full border border-white/55 bg-[#1a1a1a] font-mono text-sm font-semibold uppercase tracking-tight text-white shadow-sm ring-1 ring-[#1a1a1a] transition hover:scale-105 hover:border-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70"
                aria-label="RGuide home"
                title="RGuide"
              >
                R
              </Link>
	            {isProfileMode ? (
	              <>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileShellActive(false);
                      handleResetToGlobalView();
                    }}
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
                    className="guide-rail-button rail-switch-item margin-shell-pop-in flex h-10 w-10 items-center justify-center rounded-full transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70"
                    aria-label="Return to explorer"
                    title="Back to explorer"
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
                      onClick={() => {
                        setActiveProfileLeftRail(option.id);
                        if (option.id === "edit-profile") {
                          setProfileEditMessage(null);
                        }
                      }}
                      className={darkRailCircleButtonClass(activeProfileLeftRail === option.id, "relative z-10")}
                      aria-label={option.label}
                      title={option.label}
                    >
                      {renderProfileRailIcon(option, activeProfileLeftRail === option.id)}
                    </button>
	                  </div>
	                ))}
	              </>
            ) : (
              <>
              {publicProfile ? (
                <button
                  type="button"
                  className="guide-rail-button rail-switch-item flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200/90 bg-white/95 shadow-sm transition hover:scale-105 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 guide-rail-button-active"
                  aria-label={`${publicProfile.creator.name} profile`}
                  title={`${publicProfile.creator.name} profile`}
                >
                  <img
                    src={publicProfile.creator.avatar}
                    alt={publicProfile.creator.name}
                    className="h-full w-full object-cover"
                  />
                </button>
              ) : (
                <div className="rail-switch-item margin-shell-pop-in relative h-10 w-10">
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
                    className={`guide-rail-button flex h-10 w-10 items-center justify-center rounded-full transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 ${
                      activeRailLevel === "global" && !isLocationFavoritesRailActive ? "guide-rail-button-active" : ""
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
                  {!publicProfile && favoriteLocations.length ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleLocationFavoritesRailToggle();
                      }}
                      className={`absolute -right-1 -top-1 z-20 flex h-5 w-5 items-center justify-center rounded-full border shadow-sm transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 ${
                        isLocationFavoritesRailActive
                          ? "border-teal-700 bg-teal-600 text-white"
                          : "border-white bg-white text-teal-700"
                      }`}
                      aria-label={isLocationFavoritesRailActive ? "Close saved places" : "Open saved places"}
                      aria-pressed={isLocationFavoritesRailActive}
                      title="Saved places"
                    >
                      <Bookmark className={`h-3 w-3 ${isLocationFavoritesRailActive ? "fill-current" : ""}`} />
                    </button>
                  ) : null}
                </div>
              )}
	            {displayedContinentRailIcon?.kind === "continent" ? (
	              <button
                type="button"
                onClick={() => (activeMarginContinent ? handleSelectContinent(activeMarginContinent.id) : undefined)}
                className={darkRailCircleButtonClass(
                  activeRailLevel === "continent" && !isLocationFavoritesRailActive,
                  `rail-switch-item ${currentRailIcons.continent ? "margin-shell-pop-in margin-shell-pop-in-delayed" : "margin-shell-pop-out pointer-events-none"}`,
                )}
                aria-label={`Back to ${displayedContinentRailIcon.name}`}
                title={`Back to ${displayedContinentRailIcon.name}`}
              >
                <img
                  key={displayedContinentRailIcon.id}
	                  src={`/assets/continents/${displayedContinentRailIcon.id}.svg`}
	                  alt=""
	                  aria-hidden="true"
	                  className="h-7 w-auto opacity-95 brightness-0 invert"
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
                className={darkRailCircleButtonClass(
                  activeRailLevel === "country" && !isLocationFavoritesRailActive,
                  `rail-switch-item ${currentRailIcons.country ? "margin-shell-pop-in" : "margin-shell-pop-out pointer-events-none"}`,
                )}
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
                    className="inline-flex h-4 w-4 rounded-full bg-white"
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
                className={darkRailCircleButtonClass(
                  activeRailLevel === "state" && !isLocationFavoritesRailActive,
                  `rail-switch-item ${currentRailIcons.state ? "margin-shell-pop-in" : "margin-shell-pop-out pointer-events-none"}`,
                )}
                aria-label={`Back to ${displayedStateRailIcon.name}`}
                title={`Back to ${displayedStateRailIcon.name}`}
              >
                <StateShapeIcon
                  countryId={displayedStateRailIcon.countryId}
                  stateId={displayedStateRailIcon.id}
                  tone="light"
                  className="h-5 w-5"
                />
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
                className={darkRailCircleButtonClass(
                  activeRailLevel === "city" && !isLocationFavoritesRailActive,
                  `rail-switch-item ${currentRailIcons.city ? "margin-shell-pop-in" : "margin-shell-pop-out pointer-events-none"}`,
                )}
                aria-label={`Back to ${displayedCityRailIcon.name}`}
                title={`Back to ${displayedCityRailIcon.name}`}
	              >
	                <Building2 className="h-4 w-4 text-white" />
	              </button>
	            ) : null}
	                {!publicProfile ? (
	                  <>
	                    <div className="rail-switch-item h-px w-7 bg-slate-300/70" aria-hidden="true" />
	                    {currentUser ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsLocationFavoritesRailActive(false);
                          setProfileShellActive(!isProfileShellActive);
                        }}
                        className={`guide-rail-button rail-switch-item flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200/90 bg-white/95 shadow-sm transition hover:scale-105 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 ${
                          isProfileShellActive ? "guide-rail-button-active border-slate-900" : ""
                        }`}
                        aria-label={isProfileShellActive ? "Return to explorer mode" : "Open profile mode"}
                        title={isProfileShellActive ? "Return to explorer" : "Open profile"}
                      >
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsLocationFavoritesRailActive(false);
                          openAuthModal("login");
                        }}
                        className={darkRailCircleButtonClass(false, "rail-switch-item")}
                        aria-label="Log in"
                        title="Log in"
                      >
                        <UserRound className="h-4 w-4" />
                      </button>
                    )}
                  </>
                ) : null}
	              </>
	            )}
          </div>
        <div className="min-w-0 flex-1">
          <div className="w-full lg:px-2">
          <div
            ref={shellViewportRef}
            className={`relative h-[100svh] min-h-[38rem] w-full bg-[#fafaf7] lg:min-h-0 lg:rounded-lg lg:border lg:border-slate-950/15 lg:shadow-[0_18px_40px_rgba(23,23,23,0.10)] ${
              isSubcategoryMenuOpen && !isGuidePaneTakingFullListPane ? "overflow-visible" : "overflow-hidden"
            } ${explorerPaneHeight}`}
          >
          <div className="absolute inset-0 z-0">
            <InteractiveMap
              continents={continents}
              selection={mapSelection}
              focusedCountryId={focusedCountrySignal?.countryId ?? null}
              focusedCountryNonce={focusedCountrySignal?.nonce ?? 0}
              highlightedCountryIds={mapHighlightedCountryIds}
              viewportMode={isProfileSubmitLayout ? "submit" : "center"}
              viewportInsets={mapViewportInsets}
              resizeSignal={mapResizeSignal}
              guideFocus={null}
              activeGuide={activeMapGuide}
              activeGuideFitNonce={activeGuideFitNonce}
              guideLists={globalMergedLists}
              visibleGuideMarkerIds={visibleGuideMarkerIds}
              hoveredGuideMarkerId={hoveredGuideMarkerId}
              savedLocations={savedMapLocations}
              visibleNestedStopParentIds={visibleNestedStopParentIds}
              hoveredStopId={hoveredStopId}
              selectedStopId={selectedGuideStopId}
              countryToggleMode={
                isProfileMode &&
                activeProfileLeftRail === "places-been" &&
                activePlacesBeenFilter === "countries" &&
                isAddingPlacesBeenCountry
              }
              syncSelectionToViewport={!isProfileMode && !isProfileSubmitLayout}
              onHoverGuideStop={setHoveredStopId}
              onHoverGuideMarker={handleHoverGuideMarker}
              onSelectGuideMarker={handleSelectGuideMarker}
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
              onViewportSelectionChange={handleMapViewportSelection}
              onSelectSubarea={handleSelectSubarea}
              onSelectState={handleSelectState}
	            />
		          </div>
              <div
                className="pointer-events-auto absolute left-3 top-3 z-[80] flex flex-col items-center gap-1.5 lg:hidden"
                role="toolbar"
                aria-label="RGuide and profile"
              >
                <Link
                  href="/"
                  onClick={() => {
                    setProfileShellActive(false);
                    handleResetToGlobalView();
                    setActiveCategory(null);
                    setActiveSubcategory(null);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/55 bg-[#1a1a1a] font-mono text-xs font-semibold uppercase tracking-tight text-white shadow-sm ring-1 ring-[#1a1a1a] transition hover:scale-105 hover:border-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70"
                  aria-label="RGuide home"
                  title="RGuide"
                >
                  R
                </Link>
                {currentUser ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsLocationFavoritesRailActive(false);
                      setProfileShellActive(!isProfileShellActive);
                    }}
                    className={`flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white/95 shadow-sm transition hover:scale-105 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 ${
                      isProfileShellActive ? "border-slate-900 ring-2 ring-slate-900/20" : ""
                    }`}
                    aria-label={isProfileShellActive ? "Return to explorer mode" : "Open profile mode"}
                    title={isProfileShellActive ? "Return to explorer" : "Open profile"}
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsLocationFavoritesRailActive(false);
                      openAuthModal("login");
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-sm transition hover:scale-105 hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70"
                    aria-label="Log in"
                    title="Log in"
                  >
                    <UserRound className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsMobileInfoModalOpen(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/45 bg-[#1a1a1a] text-white shadow-sm ring-1 ring-[#1a1a1a] transition hover:scale-105 hover:border-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70"
                  aria-label={`Open ${visibleSeoHeading} information`}
                  title="Info"
                >
                  <MaterialInfo className="h-3.5 w-3.5" />
                </button>
              </div>
	              <div
                  className={`pointer-events-none absolute right-3 top-3 flex flex-col items-end gap-1.5 lg:hidden ${
                    isMobileExplorerSearchOpen ? "z-[180]" : "z-[80]"
                  }`}
                  role="toolbar"
                  aria-label="Menu bar"
                >
	                <div
                    className={`pointer-events-auto relative flex h-8 items-center justify-end overflow-visible rounded-lg transition-[width,background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isMobileExplorerSearchOpen
                        ? "z-[180] w-[min(22rem,calc(100vw-1.5rem))] border border-slate-200 bg-white shadow-sm"
                        : "z-10 w-8 border border-transparent bg-transparent"
                    }`}
                  >
                    {isMobileExplorerSearchOpen ? (
                      <SearchBar
                        locale={locale}
                        destinationTranslations={destinationTranslations}
                        autoFocus
                        compact
                        embedded
                        variant="square"
                        size="sm"
                        onResultSelect={() => setIsMobileExplorerSearchOpen(false)}
                        className="max-w-none flex-1"
                      />
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setIsMobileExplorerSearchOpen((current) => !current)}
                      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-700 transition hover:text-slate-900 ${
                        isMobileExplorerSearchOpen
                          ? "border border-transparent bg-transparent shadow-none"
                          : "border border-slate-200 bg-white shadow-sm hover:border-slate-300"
                      }`}
                      aria-label={isMobileExplorerSearchOpen ? "Close search" : "Open search"}
                      title={isMobileExplorerSearchOpen ? "Close search" : "Search"}
                    >
                      {isMobileExplorerSearchOpen ? <X className="h-3.5 w-3.5" /> : <Search className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="pointer-events-none h-8 w-8" aria-hidden="true" />
                    <div
                      className={`pointer-events-auto relative flex w-8 flex-col items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm transition-[box-shadow] duration-200 ${
                        isMobileGuideSourceMenuOpen ? "shadow-md" : ""
                      }`}
                      role="group"
                      aria-label="Guide source"
                    >
                      {visibleGuideSourceSelectors.map((selector) => {
                        const isActive = activeGuideSource === selector.id;
                        const isVisible = isMobileGuideSourceMenuOpen || isActive;
                        const SelectorIcon = selector.icon;
                        return isVisible ? (
                          <button
                            key={selector.id}
                            type="button"
                            onClick={() => {
                              if (!isMobileGuideSourceMenuOpen) {
                                setIsMobileGuideSourceMenuOpen(true);
                                setIsMobileGuideTypeMenuOpen(false);
                                return;
                              }
                              handleGuideSourceSelect(selector.id);
                              setIsMobileGuideSourceMenuOpen(false);
                            }}
                            className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[8px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 ${
                              isActive
                                ? "bg-slate-950 text-white shadow-sm"
                                : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                            }`}
                            aria-label={selector.label}
                            aria-pressed={isActive}
                            aria-expanded={isActive ? isMobileGuideSourceMenuOpen : undefined}
                            title={selector.label}
                          >
                            {SelectorIcon ? <SelectorIcon className="h-3.5 w-3.5" /> : selector.shortLabel}
                          </button>
                        ) : null;
                      })}
                    </div>
                    <div
                      className={`pointer-events-auto relative flex w-8 flex-col items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5 transition-[box-shadow] duration-200 ${
                        isMobileGuideTypeMenuOpen ? "shadow-md" : "shadow-sm"
                      }`}
                      role="group"
                      aria-label={browseLabels.entryType}
                    >
                      {guideActionSelectors.map((selector) => {
                        const isActive = activeGuideRail === selector.id;
                        const isVisible = isMobileGuideTypeMenuOpen || isActive;
                        const SelectorIcon = selector.icon;
                        return isVisible ? (
                          <button
                            key={selector.id}
                            type="button"
                            onClick={() => {
                              if (!isMobileGuideTypeMenuOpen) {
                                setIsMobileGuideTypeMenuOpen(true);
                                setIsMobileGuideSourceMenuOpen(false);
                                return;
                              }
                              if (isActive) {
                                setIsMobileGuideTypeMenuOpen(false);
                                return;
                              }
                              handleGuideRailSelect(selector.id);
                              setIsMobileGuideTypeMenuOpen(false);
                            }}
                            style={isActive ? guideActionActiveStyles[selector.id] : undefined}
                            className={`relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md border border-transparent text-slate-700 transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 ${
                              isActive ? "shadow-sm hover:text-current" : "bg-white"
                            }`}
                            aria-label={selector.label}
                            aria-pressed={isActive}
                            aria-expanded={isActive ? isMobileGuideTypeMenuOpen : undefined}
                            title={selector.label}
                          >
                            <SelectorIcon
                              className={`relative z-10 h-3.5 w-3.5 ${
                                isActive && selector.id === "all-guides" ? "text-sky-400" : ""
                              }`}
                            />
                          </button>
                        ) : null;
                      })}
                    </div>
                  </div>
              </div>
				          <div className={`pointer-events-auto absolute left-1/2 top-3 z-[60] w-[min(22rem,calc(100%-7.25rem))] -translate-x-1/2 space-y-2 transition-opacity duration-200 lg:hidden ${
				            isMobileExplorerSearchOpen ? "pointer-events-none opacity-0" : "opacity-100"
		          }`}>
		            <div className="grid items-start gap-2">
		              <div className="flex min-w-0 flex-wrap items-start justify-center gap-1.5">
                    {activeLocation.continent ? (
                      <button
                        type="button"
                        onClick={() => {
                          setMobileAllSelection({ country: false, region: false, state: false, city: false, neighborhood: false });
                          handleResetToGlobalView();
                        }}
                        className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white/95 text-slate-800 shadow-[0_8px_18px_rgba(15,23,42,0.08)] transition hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-orange-500/50"
                        aria-label={browseLabels.returnToGlobalView}
                        title={browseLabels.globalView}
                      >
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
                      </button>
                    ) : null}
		                <MobileBrowseSelect
		                  label={browseLabels.selectContinent}
		                  value={selection.continentId ?? ""}
		                  placeholder={browseLabels.browseDestinations}
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
		                    label={browseLabels.selectCountry}
			                    value={selection.countryId ?? (mobileAllSelection.country ? MOBILE_ALL_COUNTRIES_VALUE : "")}
			                    placeholder={browseLabels.selectCountry}
			                    showPlaceholderOption={false}
			                    options={[
			                      { value: MOBILE_ALL_COUNTRIES_VALUE, label: browseLabels.allCountries },
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
	                    label={browseLabels.selectRegion}
		                    value={selection.countrySubareaId ?? (mobileAllSelection.region ? MOBILE_ALL_REGIONS_VALUE : "")}
		                    placeholder={browseLabels.allRegions}
		                    showPlaceholderOption={false}
		                    options={[
		                      { value: MOBILE_ALL_REGIONS_VALUE, label: browseLabels.allRegions },
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
		                    label={browseLabels.selectCity}
			                    value={selection.cityId ?? (mobileAllSelection.city ? MOBILE_ALL_CITIES_VALUE : "")}
			                    placeholder={browseLabels.allCities}
		                    showPlaceholderOption={false}
		                    options={[
		                      { value: MOBILE_ALL_CITIES_VALUE, label: browseLabels.allCities },
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
	                    label={browseLabels.selectNeighborhood}
		                    value={selection.nestedSubareaId ?? selection.subareaId ?? (mobileAllSelection.neighborhood ? MOBILE_ALL_NEIGHBORHOODS_VALUE : "")}
		                    placeholder={browseLabels.allNeighborhoods}
		                    showPlaceholderOption={false}
		                    options={[
		                      { value: MOBILE_ALL_NEIGHBORHOODS_VALUE, label: browseLabels.allNeighborhoods },
		                      ...rankedCityListItems.map((item) => ({
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
            className="pointer-events-none relative z-10 grid h-full grid-rows-[minmax(0,1fr)] gap-0 lg:grid-rows-none lg:[grid-template-columns:var(--shell-cols)] min-[2560px]:[grid-template-columns:var(--shell-cols-ultrawide)]"
            style={
              {
                "--shell-cols": isLeftPaneCollapsed
                  ? "0px minmax(0,1fr) minmax(520px,1fr)"
                  : "minmax(260px,2fr) minmax(0,3.5fr) minmax(520px,4.5fr)",
                "--shell-cols-ultrawide": isLeftPaneCollapsed
                  ? "0px minmax(680px,960px) minmax(720px,960px) minmax(0,1fr)"
                  : "minmax(320px,420px) minmax(680px,960px) minmax(720px,960px) minmax(0,1fr)",
              } as React.CSSProperties
            }
          >
            <div
              ref={leftPaneRef}
              className={`frosted-pane-left left-pane-dark-preview left-pane-jp-hierarchy pointer-events-auto relative z-30 hidden min-h-0 flex-col overflow-visible p-4 transition-[transform,opacity] ease-[cubic-bezier(0.22,1,0.36,1)] lg:z-auto lg:flex lg:h-full lg:overflow-hidden lg:p-5 ${
                isLeftPaneCollapsed
                  ? "duration-[620ms] -translate-x-20 opacity-0 pointer-events-none"
                  : "duration-500 translate-x-0 opacity-100"
              } ${explorerPaneHeight} ${
                isLeftPaneCollapsed ? "max-h-0 !min-h-0 p-0 lg:max-h-none lg:p-5" : ""
              }`}
            >
              {activeDestinationImage ? (
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-[18.75rem] overflow-hidden bg-slate-950"
                  style={{
                    WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 64%, rgba(0, 0, 0, 0.28) 86%, transparent 100%)",
                    maskImage: "linear-gradient(to bottom, black 0%, black 64%, rgba(0, 0, 0, 0.28) 86%, transparent 100%)",
                  }}
                  aria-hidden="true"
                >
                  <img
                    src={activeDestinationImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.34)" }} />
                  <div
                    className="absolute inset-x-0 top-0"
                    style={{
                      height: "calc(100% + 3.5rem)",
                      background:
                        "linear-gradient(to bottom, rgba(0, 0, 0, 0.18) 0%, rgba(0, 0, 0, 0.24) 55%, rgba(0, 0, 0, 0.62) 100%)",
                      transform: isCategoryInsightMode ? "translateY(-3.5rem)" : "translateY(0)",
                      transition: "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  />
                </div>
              ) : null}
              <div className={`left-pane-content relative z-10 flex h-full min-h-0 flex-col ${paneTransitionClass}`}>
              <CityWeatherChip
                cityId={activeLocation.city?.id}
                cityName={activeLocation.city?.name}
                coordinates={activeLocation.city?.coordinates}
                onImage={Boolean(activeDestinationImage)}
              />
              {continentTitleMorph ? (
                <div
                  ref={morphTitleRef}
                  className="pointer-events-none absolute z-30 overflow-visible opacity-100"
                  style={(() => {
                    const fromScale =
                      continentTitleMorph.toFontSize > 0
                        ? continentTitleMorph.fromFontSize / continentTitleMorph.toFontSize
                        : 1;
                    const sourceX = continentTitleMorph.fromLeft - continentTitleMorph.toLeft;
                    const sourceY = continentTitleMorph.fromTop - continentTitleMorph.toTop;

                    return {
                      top: continentTitleMorph.toTop,
                      left: continentTitleMorph.toLeft,
                      width: continentTitleMorph.toWidth,
                      transform: `translate3d(${sourceX}px, ${sourceY}px, 0) scale(${fromScale})`,
                      transformOrigin: "left top",
                      willChange: "transform",
                    };
                  })()}
                >
                  <div className="min-w-0">
                    <p
                      className={`block w-full max-w-full break-words whitespace-normal text-left font-black text-white ${
                        activeDestinationImage ? "drop-shadow-sm" : ""
                      }`}
                      style={{
                        fontSize: `${continentTitleMorph.toFontSize}px`,
                        lineHeight: "1.02",
                      }}
                    >
                      {continentTitleMorph.name}
                    </p>
                  </div>
                </div>
              ) : null}
              <div
                className={`left-pane-masthead shrink-0 pb-4 transition-opacity duration-150 ${
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
                      <p className={`mb-1 max-w-[calc(100%-8rem)] text-[11px] font-extrabold uppercase tracking-[0] text-white ${activeDestinationImage ? "drop-shadow-sm" : ""}`}>
                        {visibleSeoContextLabel}
                      </p>
                    ) : null}
                    <h1
                      ref={titleRef}
                      className={`${
                        activeLocation.city || continentTitleMorph?.kind === "city"
                          ? "max-w-[calc(100%-8rem)]"
                          : "max-w-[calc(100%-3rem)]"
                      } break-words text-[30px] font-black leading-[1.02] tracking-[0] ${activeDestinationImage ? "text-white drop-shadow-sm" : "text-white"}`}
                    >
                      {activeCategory && activeLocation.city && !expandedGuide ? (
                        <button
                          type="button"
                          onClick={() => handleCategoryToggle(activeCategory)}
                          className="inline-block max-w-full text-left [font:inherit] leading-[inherit] transition hover:opacity-80"
                          aria-label={`Show all ${activeSeoPlaceLabel} guides`}
                          title={`Show all ${activeSeoPlaceLabel} guides`}
                        >
                          <span ref={titleTextRef} className="inline-block max-w-full">
                            {visibleSeoHeading}
                          </span>
                        </button>
                      ) : (
                        <span ref={titleTextRef} className="inline-block max-w-full">
                          {visibleSeoHeading}
                        </span>
                      )}
                    </h1>
                    {!isSavedPlacesRailActive ? (
                      <div
                        ref={detailRef}
                        className={`mt-2 max-w-[calc(100%-3rem)] text-[13px] font-semibold text-white transition-all duration-300 ${activeDestinationImage ? "drop-shadow-sm" : ""}`}
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
                              <span className={breadcrumbSeparatorClass}>,</span>
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
                              <span className={breadcrumbSeparatorClass}>,</span>
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
                              <span className={breadcrumbSeparatorClass}>,</span>
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
                          <span className={breadcrumbSeparatorClass}>,</span>
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
                              <span className={breadcrumbSeparatorClass}>,</span>
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
                              <span className={breadcrumbSeparatorClass}>,</span>
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
                          <span className={breadcrumbSeparatorClass}>,</span>
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
                                <span className={breadcrumbSeparatorClass}>,</span>
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
                            <span className={breadcrumbSeparatorClass}>,</span>
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
                          <span className={breadcrumbSeparatorClass}>,</span>
                          <span>{formatBreadcrumbName(activeDirectoryMeta.detail)}</span>
                        </div>
                      ) : (
                        <p>{formatBreadcrumbName(activeDirectoryMeta.detail)}</p>
                        )}
                      </div>
                    ) : null}
                    {isSavedPlacesRailActive ? (
                      <div
                        className="mt-4 transition-all duration-300"
                        style={{
                          opacity: postMorphRevealPhase >= 2 ? 1 : 0,
                          transform:
                            postMorphRevealPhase >= 2
                              ? "translateY(0px)"
                              : "translateY(-8px)",
                        }}
                      >
                        {favoriteLocations.length ? (
                          <div className="space-y-4">
                            {favoriteLocationSections.map((section) => (
                              <section key={section.key}>
                                <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                                  {section.label}
                                </p>
                                <div className="space-y-1">
                                  {section.locations.map((location) => (
                                    <FavoriteLocationRow
                                      key={location.id}
                                      location={location}
                                      active={activeFavoriteLocation?.id === location.id}
                                      onSelect={handleFavoriteLocationSelect}
                                    />
                                  ))}
                                </div>
                              </section>
                            ))}
                          </div>
                        ) : (
                          <p className="rounded-2xl border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-500">
                            No saved places yet.
                          </p>
                        )}
                      </div>
                    ) : activeLocation.city || visibleIntroCopyDisplay ? (
                      <div
                        className={`${isCategoryInsightMode ? "mt-1" : "mt-2"} transition-all duration-300`}
                        style={{
                          opacity: postMorphRevealPhase >= 2 ? 1 : 0,
                          transform:
                            postMorphRevealPhase >= 2
                              ? "translateY(0px)"
                              : "translateY(-8px)",
                        }}
                      >
                        {visibleIntroCopyDisplay ? (
                          <div
                            className={`overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                              isCategoryInsightMode
                                ? "max-h-0 -translate-y-2 opacity-0"
                                : "max-h-40 translate-y-0 opacity-100"
                            }`}
                            aria-hidden={isCategoryInsightMode}
                          >
                            <p
                              className={`ml-0 min-h-[9rem] border-l-2 pl-3 text-[13px] leading-5 ${
                                activeDestinationImage
                                  ? "border-white/38 text-white drop-shadow-sm"
                                  : "border-white/24 text-white"
                              }`}
                            >
                              {renderLeftPaneAnnotatedText(
                                visibleIntroCopyDisplay,
                                descriptionNeighborhoodMentions,
                                "intro-description",
                              )}
                            </p>
                          </div>
                        ) : null}
                        {!expandedGuide ? (
                          <div
                            className={`${
                              isCategoryInsightMode ? "mt-0 -translate-y-0.5" : "mt-3 translate-y-0"
                            } flex items-center gap-2 transition-[margin,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]`}
                          >
                            {activeStayBookingHref ? (
                              <div
                                className="inline-flex h-9 overflow-hidden rounded-sm border bg-black/24 shadow-none"
                                style={{ borderColor: CATEGORY_STYLES.Stay.mapColor }}
                              >
                                <button
                                  type="button"
                                  onClick={handleStayCategoryFilter}
                                  className="inline-flex h-9 w-9 items-center justify-center text-white transition hover:bg-white/[0.08]"
                                  style={activeCategory === "Stay" ? { backgroundColor: CATEGORY_STYLES.Stay.mapColor } : undefined}
                                  aria-label={`Show stays in ${activeSeoPlaceLabel}`}
                                  aria-pressed={activeCategory === "Stay"}
                                  title="Show stays"
                                >
                                  <BedDouble className="h-3.5 w-3.5" />
                                </button>
                                <a
                                  href={activeStayBookingHref}
                                  target="_blank"
                                  rel="noreferrer sponsored"
                                  className="inline-flex h-9 items-center gap-1 border-l px-2.5 text-[11px] font-extrabold uppercase tracking-[0] text-white transition hover:bg-white/[0.08]"
                                  style={{ borderLeftColor: CATEGORY_STYLES.Stay.mapColor }}
                                  aria-label={`Search stays in ${activeStayBookingQuery}`}
                                  title={`Book stays in ${activeStayBookingQuery}`}
                                >
                                  <span>Book</span>
                                  <SquareArrowOutUpRight className="h-3 w-3" aria-hidden="true" />
                                </a>
                              </div>
                            ) : null}
                            <div className="ml-auto flex items-center gap-2">
                              {activeFavoriteLocation ? (
                                <button
                                  type="button"
                                  onClick={() => toggleFavoriteLocation(activeFavoriteLocation)}
                                  className={`inline-flex h-9 w-9 items-center justify-center rounded-sm bg-transparent text-white shadow-none transition ${
                                    isActiveLocationFavorited
                                      ? "border-2 border-white"
                                      : "border border-white/54 hover:border-white hover:bg-white/[0.06]"
                                  }`}
                                  aria-label={`${isActiveLocationFavorited ? "Remove" : "Save"} ${activeSeoPlaceLabel} ${isActiveLocationFavorited ? "from" : "to"} saved places`}
                                  title={isActiveLocationFavorited ? "Remove saved place" : "Save place"}
                                >
                                  <Bookmark className="h-3.5 w-3.5" filled={isActiveLocationFavorited} />
                                </button>
                              ) : null}
                              {activeLocation.city ? (
                                <button
                                  type="button"
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-white/54 bg-transparent text-white shadow-none transition hover:border-white hover:bg-white/[0.06]"
                                  aria-label={`Tour ${activeSeoPlaceLabel}`}
                                  title="Neighborhood tour coming soon"
                                >
                                  <Footprints className="h-3.5 w-3.5" filled={false} />
                                </button>
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                        {!expandedGuide && displayCategoryInsight ? (
                          <div
                            className={`${
                              isCategoryInsightExiting ? "category-insight-draw-out" : "category-insight-draw-in"
                            } mt-3 border-x-0 border-y border-white/16 bg-black/32 px-0 py-3 text-white shadow-none`}
                          >
                            <div className="mb-2 flex items-center gap-2">
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: CATEGORY_STYLES[displayCategoryInsight.category].mapColor }}
                                aria-hidden="true"
                              />
                              <p
                                className="text-[10px] font-extrabold uppercase tracking-[0] text-white/58"
                              >
                                {displayCategoryInsight.label}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {displayCategoryInsight.chips.map((chip) => {
                                const isFoodCuisineChip =
                                  displayCategoryInsight.category === "Food" &&
                                  activeFoodCuisineOptions.some((option) => option.toLowerCase() === chip.toLowerCase());
                                const isSubcategoryChip = displayCategoryInsight.category !== "Food";
                                const isActiveCuisine =
                                  isFoodCuisineChip && activeFoodCuisine.toLowerCase() === chip.toLowerCase();
                                const isActiveSubcategory =
                                  isSubcategoryChip && activeSubcategory?.toLowerCase() === chip.toLowerCase();
                                const isActiveChip = isActiveCuisine || isActiveSubcategory;
                                const isFilterChip = isFoodCuisineChip || isSubcategoryChip;

                                return (
                                  <button
                                    key={chip}
                                    type="button"
                                    onClick={() => handleCategoryInsightChipSelect(chip)}
                                    disabled={!isFilterChip}
                                    className={`rounded-full border px-2 py-1 text-[11px] font-semibold leading-none transition ${
                                      isFilterChip
                                        ? "cursor-pointer hover:-translate-y-0.5"
                                        : "cursor-default"
                                    }`}
                                    style={{
                                      backgroundColor: isActiveChip
                                        ? CATEGORY_STYLES[displayCategoryInsight.category].mapColor
                                        : `${CATEGORY_STYLES[displayCategoryInsight.category].mapColor}24`,
                                      borderColor: isActiveChip
                                        ? CATEGORY_STYLES[displayCategoryInsight.category].mapColor
                                        : `${CATEGORY_STYLES[displayCategoryInsight.category].mapColor}33`,
                                      color: isActiveChip
                                        ? "rgba(255,255,255,0.96)"
                                        : CATEGORY_STYLES[displayCategoryInsight.category].mapColor,
                                    }}
                                    aria-pressed={isActiveChip}
                                    aria-label={
                                      isFoodCuisineChip
                                        ? `${isActiveCuisine ? "Clear" : "Filter"} ${activeSeoPlaceLabel} food by ${chip}`
                                        : isSubcategoryChip
                                          ? `${isActiveSubcategory ? "Clear" : "Filter"} ${activeSeoPlaceLabel} ${displayCategoryInsight.category.toLowerCase()} by ${chip}`
                                          : undefined
                                    }
                                  >
                                    {chip}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="mt-2 space-y-1.5">
                              {displayCategoryInsight.category === "Food" && activeFoodCuisine !== FOOD_CUISINE_ANY ? (
                                <p
                                  className="text-[10px] font-extrabold uppercase tracking-[0] text-white/54"
                                >
                                  {activeFoodCuisine} need to knows
                                </p>
                              ) : null}
                              {displayCategoryInsightNotes.map((note, noteIndex) => {
                                const noteMentions = getCategoryInsightNoteNeighborhoodMentions(note.body);

                                return (
                                  <div
                                    key={`${note.label ?? displayCategoryInsight.label}-${note.body}`}
                                    className="border-l border-white/24 pl-2 text-[12px] leading-5 text-white/76"
                                  >
                                    {note.label ? (
                                      <span
                                        className="mr-1.5 font-semibold uppercase tracking-[0.12em]"
                                        style={{
                                          color: "rgba(255,255,255,0.94)",
                                        }}
                                      >
                                        {note.label}
                                      </span>
                                    ) : null}
                                    <span>
                                      {renderLeftPaneAnnotatedText(
                                        note.body,
                                        noteMentions,
                                        `category-insight-${noteIndex}`,
                                      )}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : !expandedGuide && cityHighlightRows.length && !isCategoryInsightExiting ? (
                          <div className="city-summary-draw-in mt-3 overflow-hidden text-[13px] leading-5">
                            {cityHighlightRows.map((row) => {
                              const isActiveRow = activeCategory === row.category;
                              const rowColor = getLightCategoryTextColor(row.category, 0.48);
                              const contentColor = "rgba(255,255,255,0.7)";

                              return (
                                <div
                                  key={`${row.label}-${row.category}`}
                                  className="relative flex min-h-9 min-w-0 items-center gap-1.5 border-b border-white/10 py-1.5 pl-3 last:border-b-0"
                                >
                                  <span
                                    className="absolute bottom-1.5 left-0 top-1.5 w-0.5"
                                    style={{ backgroundColor: CATEGORY_STYLES[row.category].mapColor }}
                                    aria-hidden="true"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleCategoryToggle(row.category)}
                                    className="shrink-0 font-extrabold uppercase transition hover:text-white"
                                    style={{ color: rowColor }}
                                    aria-pressed={isActiveRow}
                                    aria-label={`Filter ${activeSeoPlaceLabel} guides by ${row.label}`}
                                  >
                                    {row.label}
                                  </button>
                                  <span className="shrink-0" style={{ color: contentColor }}>: </span>
                                  <span className="min-w-0 flex-1 truncate" style={{ color: contentColor }}>
                                    {row.items.map((item, index) => (
                                      <span key={`${item.guide.id}-${item.label}`}>
                                        {index > 0 ? <span>, </span> : null}
                                        <button
                                          type="button"
                                          onClick={() => handleCityHighlightGuideSelect(item.guide)}
                                          className="font-semibold transition hover:text-white"
                                          style={{ color: contentColor }}
                                          title={item.guide.title}
                                        >
                                          {item.label}
                                        </button>
                                      </span>
                                    ))}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
                {!isSavedPlacesRailActive &&
                activeLocation.country &&
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
                          className={darkPanePillClass(countryBrowseView === "cities", "xs")}
                        >
                          Cities
                        </button>
                        <button
                          type="button"
                          onClick={() => setCountryBrowseView("regions")}
                          disabled={!activeCountrySubareas.length}
                          className={`${darkPanePillClass(countryBrowseView === "regions", "xs")} ${
                            activeCountrySubareas.length ? "" : "cursor-not-allowed opacity-45"
                          }`}
                        >
                          Regions
                        </button>
                      </div>
                    ) : null}
                    <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[rgba(255,255,255,0.48)]">
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
                        ? activeNestedCitySubareas.map((nestedSubarea) => {
                            const isDescriptionHovered = hoveredDescriptionNeighborhoodId === nestedSubarea.id;
                            return (
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
                                className={darkPanePillClass(selection.nestedSubareaId === nestedSubarea.id || isDescriptionHovered)}
                              >
                                {nestedSubarea.name}
                              </button>
                            );
                          })
                        : activeLocation.city && activeCitySubareas.length
                          ? activeCitySubareas.map((subarea) => {
                              const isDescriptionHovered = hoveredDescriptionNeighborhoodId === subarea.id;
                              return (
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
                                  className={darkPanePillClass(selection.subareaId === subarea.id || isDescriptionHovered)}
                                >
                                  {formatBreadcrumbName(subarea.name)}
                                </button>
                              );
                            })
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
                              className={darkPanePillClass(selection.subareaId === subarea.id)}
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
                            className={darkPanePillClass(selection.cityId === city.id)}
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
                              className={darkPanePillClass(selection.subareaId === subarea.id)}
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
                              className={darkPanePillClass(selection.stateId === state.id)}
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
                            className={darkPanePillClass(selection.cityId === city.id)}
                          >
                            <span data-morph-origin="label" className="inline-block">
                              {city.name}
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>
                ) : null}
                {!isSavedPlacesRailActive ? (
                  <div
                    className="mt-3 space-y-1.5 lg:hidden"
                    style={{
                      opacity: postMorphRevealPhase >= 3 ? 1 : 0,
                      transform: postMorphRevealPhase >= 3 ? "translateY(0px)" : "translateY(-10px)",
                      transition: "opacity 300ms ease, transform 300ms ease",
                    }}
                  >
                  <MobileBrowseSelect
                    label={browseLabels.selectContinent}
                    value={selection.continentId ?? ""}
                    placeholder={browseLabels.browseDestinations}
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
                      label={browseLabels.selectCountry}
                      value={selection.countryId ?? ""}
                      placeholder={browseLabels.selectCountry}
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
                      label={browseLabels.selectRegion}
                      value={selection.countrySubareaId ?? ""}
                      placeholder={browseLabels.allRegions}
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
                      label={locale === "es" ? browseLabels.selectRegion : `Select ${countryStateLabelLower}`}
                      value={selection.stateId ?? ""}
                      placeholder={locale === "es" ? browseLabels.allRegions : `All ${countryStateLabelLower}`}
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
                      label={browseLabels.selectCity}
                      value={selection.cityId ?? ""}
                      placeholder={browseLabels.selectCity}
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
                      label={browseLabels.selectNeighborhood}
                      value={selection.nestedSubareaId ?? selection.subareaId ?? ""}
                      placeholder={browseLabels.allNeighborhoods}
                      options={rankedCityListItems.map((item) => ({
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
                ) : null}
              </div>
              {!isSavedPlacesRailActive ? (
                <div
                  data-directory-scroll
                  className={`left-pane-scrollbar-hidden mt-2 hidden min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 transition-opacity duration-150 lg:block ${
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
                  rankedCityListItems.length ? (
                  <div className="flex h-full min-h-0 flex-col">
                    <div className="mb-2 shrink-0 flex items-center justify-between">
                      <p
                        className="inline-flex h-8 items-center px-2.5 text-[11px] font-extrabold uppercase tracking-[0] text-white"
                        style={{
                          backgroundColor: activeCategory
                            ? CATEGORY_STYLES[activeCategory].mapColor
                            : "#f05232",
                        }}
                      >
                        {cityUsesNestedDistricts && activeLocation.subarea && activeNestedCitySubareas.length
                          ? "Neighborhoods"
                          : cityUsesNestedDistricts
                            ? "Boroughs"
                            : "Neighborhoods"}
                      </p>
                      <div className="h-8" aria-hidden="true" />
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto">
                      <div className="overflow-hidden">
                          {rankedCityListItems.map((item) => {
                            const isSelected = (item.isNested ? selection.nestedSubareaId : selection.subareaId) === item.id;
                            const isDescriptionHovered = hoveredDescriptionNeighborhoodId === item.id;
                            const strengthStars = activeCategory ? item.categoryStrengthStars : 0;

                            return (
                              <button
                                key={item.id}
                                type="button"
                                title={item.name}
                                className={`group relative flex w-full items-center gap-2 overflow-hidden border-b border-white/10 px-2 py-2.5 text-left text-sm transition last:border-b-0 ${
                                  isSelected || isDescriptionHovered
                                    ? "left-pane-directory-row-active font-semibold"
                                    : "text-white hover:bg-white/[0.06]"
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
                                <span className="relative h-4 w-4 shrink-0" aria-hidden="true">
                                  <MapPin
                                    className={`absolute inset-0 h-4 w-4 text-red-500 transition-colors ${
                                      isSelected || isDescriptionHovered ? "fill-red-500" : "fill-transparent group-hover:fill-red-500"
                                    }`}
                                  />
                                  <span
                                    className={`absolute left-1/2 top-[4px] h-1.5 w-1.5 -translate-x-1/2 rounded-full transition-opacity ${
                                      isSelected || isDescriptionHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                    }`}
                                    style={{
                                      backgroundColor: isSelected || isDescriptionHovered ? "#f1f2ef" : "#1a1a1a",
                                    }}
                                  />
                                </span>
                                <span className="min-w-0 flex-1 truncate">
                                  {formatBreadcrumbName(item.name)}
                                </span>
                                {strengthStars ? (
                                  <span
                                    className="relative ml-auto flex shrink-0 items-center gap-0.5"
                                    aria-label={`${strengthStars} ${strengthStars === 1 ? "star" : "stars"} for ${activeCategory}`}
                                    title={`${activeCategory} strength: ${strengthStars}/3`}
                                    style={{ color: CATEGORY_STYLES[activeCategory!].mapColor }}
                                  >
                                    {Array.from({ length: strengthStars }).map((_, index) => (
                                      <Star key={`${item.id}-strength-${index}`} className="h-3 w-3 fill-current" />
                                    ))}
                                  </span>
                                ) : null}
                              </button>
                            );
                            })}
                      </div>
                    </div>
                  </div>
                  ) : null
                ) : isRegionSelection ? (
                  <div className="flex h-full min-h-0 flex-col">
                    <div className="mb-2 shrink-0 flex items-center justify-between">
                      <p className={darkPaneHeadingClass}>
                        {regionBrowseView === "states" ? countryStateLabel : "Cities"}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setRegionBrowseView("cities")}
                          className={darkPaneToggleClass(regionBrowseView === "cities")}
                          aria-label="Show cities"
                        >
                          <Building2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setRegionBrowseView("states")}
                          disabled={!activeCountryStates.length}
                          className={darkPaneToggleClass(regionBrowseView === "states", Boolean(activeCountryStates.length))}
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
                                className={darkPaneRowClass(selection.stateId === state.id)}
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
                                className={darkPaneRowClass(selection.cityId === city.id)}
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
                      <p className={darkPaneHeadingClass}>
                        {stateBrowseView === "regions" ? "Regions" : "Cities"}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setStateBrowseView("cities")}
                          className={darkPaneToggleClass(stateBrowseView === "cities")}
                          aria-label="Show cities"
                        >
                          <Building2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setStateBrowseView("regions")}
                          disabled={!activeCountrySubareas.length}
                          className={darkPaneToggleClass(stateBrowseView === "regions", Boolean(activeCountrySubareas.length))}
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
                                className={darkPaneRowClass(selection.countrySubareaId === subarea.id)}
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
                                className={darkPaneRowClass(selection.cityId === city.id)}
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
                      <p className={darkPaneHeadingClass}>
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
                          className={darkPaneToggleClass(continentBrowseView === "countries")}
                          aria-label="Show countries"
                        >
                          <Flag className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setContinentBrowseView("regions")}
                          disabled={!activeContinentSubareas.length}
                          className={darkPaneToggleClass(continentBrowseView === "regions", Boolean(activeContinentSubareas.length))}
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
                      <p className={darkPaneHeadingClass}>
                        {countryBrowseView === "regions" ? "Regions" : hasStateHierarchyCountry ? countryStateLabel : "Cities"}
                      </p>
                      <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCountryBrowseView("cities")}
                        className={darkPaneToggleClass(countryBrowseView === "cities")}
                        aria-label={hasStateHierarchyCountry ? `Show ${countryStateLabelLower}` : "Show cities"}
                      >
                        {hasStateHierarchyCountry ? <Flag className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCountryBrowseView("regions")}
                        disabled={!activeCountrySubareas.length}
                        className={darkPaneToggleClass(countryBrowseView === "regions", Boolean(activeCountrySubareas.length))}
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
                      <p className={darkPaneHeadingClass}>Continents</p>
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-sm border-2 border-[#8ed8f8] bg-transparent text-[#8ed8f8]">
                          <Globe2 className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                    <div className="min-h-0 flex-1 overflow-hidden bg-transparent">
                      <div className="h-full overflow-y-auto divide-y divide-white/10">
                        {continents.map((continent) => {
                          if (continentTitleMorph?.id === continent.id) {
                            return <div key={continent.id} className="h-[66px]" aria-hidden="true" />;
                          }
                          const countryCount = continent.countries.length;
                          const guideCount = globalMergedLists.filter(
                            (list) =>
                              list.location.continent === continent.name &&
                              !list.id.startsWith("event-") &&
                              list.submissionType !== "journal" &&
                              !isItineraryList(list, noKnownItineraryIds),
                          );

                          return (
                            <button
                              key={continent.id}
                              type="button"
                              onClick={(event) =>
                                handleSelectContinentFromGlobal(continent.id, event.currentTarget)
                              }
                              className="group flex w-full items-center gap-4 px-4 py-3 text-left transition hover:bg-white/[0.08]"
                            >
                              <div
                                className="flex h-10 w-12 shrink-0 items-center justify-center"
                              >
                                <img
                                  src={`/assets/continents/${continent.id}.svg`}
                                  alt=""
                                  aria-hidden="true"
                                  className="h-7 w-auto opacity-90 brightness-0 invert"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-white">
                                  <span data-morph-origin="label" className="inline-block">
                                    {continent.name}
                                  </span>
                                </p>
                                <p className="mt-0.5 text-xs font-medium text-[rgba(255,255,255,0.68)]">
                                  {countryCount} countries • {guideCount.length} guides
                                </p>
                              </div>
                              <ChevronRight className="h-4 w-4 text-white/35 transition group-hover:translate-x-0.5 group-hover:text-white/72" />
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
              ) : null}
              </div>
              {publicProfile ? (
                <div className="profile-left-pane profile-left-intro frosted-pane-left left-pane-dark-preview absolute inset-0 z-20 p-5">
                  <div className={`left-pane-content flex h-full min-h-0 flex-col p-1 ${publicProfilePaneTransitionClass}`}>
                    <div className="flex flex-col items-center text-center">
                      <span className="profile-left-avatar inline-flex h-24 w-24 shrink-0 overflow-hidden rounded-full">
                        <img
                          src={publicProfile.creator.avatar}
                          alt={publicProfile.creator.name}
                          className="h-full w-full object-cover"
                        />
                      </span>
                      <p className="profile-left-kicker mt-4 text-sm font-medium uppercase tracking-[0.24em] text-orange-600">
                        Profile
                      </p>
                      <h2 className="profile-left-name mt-2 text-2xl font-semibold text-slate-900">
                        {publicProfile.creator.name}
                      </h2>
                      <p className="profile-left-bio mt-2 text-sm text-slate-600">
                        {publicProfile.creator.bio}
                      </p>
                    </div>
                    <div className="profile-left-stats mt-5 grid grid-cols-2 gap-2">
                      <div className="profile-left-stat-card rounded-xl border border-slate-200 bg-stone-50 px-3 py-2 text-center">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Years</p>
                        <p className="mt-1 text-base font-semibold text-slate-900">{publicProfile.stats.yearsAsUser}</p>
                      </div>
                      <div className="profile-left-stat-card rounded-xl border border-slate-200 bg-stone-50 px-3 py-2 text-center">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Favorites</p>
                        <p className="mt-1 text-base font-semibold text-slate-900">{publicProfile.stats.favoritesCount}</p>
                      </div>
                      <div className="profile-left-stat-card rounded-xl border border-slate-200 bg-stone-50 px-3 py-2 text-center">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Guides</p>
                        <p className="mt-1 text-base font-semibold text-slate-900">{publicProfileGuideLists.length}</p>
                      </div>
                      <div className="profile-left-stat-card rounded-xl border border-slate-200 bg-stone-50 px-3 py-2 text-center">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Places</p>
                        <p className="mt-1 text-base font-semibold text-slate-900">{publicProfile.stats.placesBeenCount}</p>
                      </div>
                    </div>
                    <div className="pane-cascade-item mt-3 min-h-0 flex-1 overflow-hidden rounded-xl border border-white/[0.12] bg-white/[0.07] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_24px_rgba(0,0,0,0.14)]">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-white/[0.48]">Places been</p>
                      <div className="mt-2 max-h-full space-y-1.5 overflow-y-auto pr-1">
                        {publicProfilePlacesBeen.length ? (
                          publicProfilePlacesBeen.map((place) => (
                            <div key={place} className="rounded-lg border border-white/[0.1] bg-white/[0.08] px-2.5 py-1.5 text-sm font-medium text-white/[0.86] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                              {place}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-white/[0.5]">No places shared yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              {isProfileMode && currentUser ? (
                <div
                  key={`profile-left-intro-${profileIntroNonce}`}
                  className="profile-left-pane profile-left-intro frosted-pane-left left-pane-dark-preview absolute inset-0 z-20 p-5"
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
                        accept="image/jpeg,image/png,image/webp"
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
                            onChange={(event) => {
                              setProfileNameDraft(event.target.value);
                              setProfileEditMessage(null);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                void handleProfileSave();
                              }
                            }}
                            className="profile-inline-name mx-auto block w-full max-w-[16rem] px-1 py-1 text-center text-2xl font-semibold outline-none transition"
                            aria-label="Profile name"
                          />
                        ) : (
                          <h2
                            className={`profile-left-name absolute top-0 font-semibold transition-[left,transform,font-size,color] duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                              activeProfileLeftRail === "places-been"
                                ? "left-0 translate-x-0 text-sm uppercase tracking-[0.1em] text-white/[0.58]"
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
                          onChange={(event) => {
                            setProfileBioDraft(event.target.value);
                            setProfileEditMessage(null);
                          }}
                          rows={3}
                          maxLength={220}
                          className="profile-inline-bio mt-2 w-full resize-none rounded-sm border px-3 py-2 text-center text-sm outline-none transition"
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
                      {activeProfileLeftRail === "edit-profile" ? (
                        <div className="mt-3 flex w-full flex-col items-center gap-2">
                          <button
                            type="button"
                            onClick={() => void handleProfileSave()}
                            disabled={isSavingProfile || !isProfileEditDirty}
                            className="profile-light-surface inline-flex min-h-10 w-full items-center justify-center rounded-sm border px-4 py-2 text-sm font-extrabold uppercase tracking-[0] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            {isSavingProfile ? "Saving changes..." : "Save changes"}
                          </button>
                          {profileEditMessage ? (
                            <p
                              className={`rounded-sm border px-3 py-1.5 text-xs font-semibold ${
                                profileEditMessage === "Profile updated."
                                  ? "border-emerald-300/30 bg-emerald-400/10"
                                  : "border-red-300/35 bg-red-500/10"
                              }`}
                              style={{ color: profileEditMessage === "Profile updated." ? "#86efac" : "#fb7185" }}
                              aria-live="polite"
                            >
                              {profileEditMessage}
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                      {activeProfileLeftRail === "places-been" ? (
                        <div
                          data-profile-places-been
                          className="mt-2 flex min-h-0 w-full flex-1 flex-col text-left"
                        >
                          <div className="border-b border-white/[0.1] pb-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/[0.46]">
                              Places been
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-white/[0.78]">
                              {profilePlacesBeenSummary}
                            </p>
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <div className="grid flex-1 grid-cols-3 gap-1 rounded-lg border border-white/[0.12] bg-black/20 p-1">
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
                                  className={`rounded-md border px-2 py-1.5 text-xs font-semibold transition-colors ${
                                    activePlacesBeenFilter === filter.id
                                      ? "border-white/[0.34] bg-white/[0.15] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                                      : "border-transparent text-white/[0.56] hover:bg-white/[0.07] hover:text-white"
                                  }`}
                                >
                                  {filter.label}
                                </button>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsAddingPlacesBeenCountry((current) => !current)}
                              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                                isAddingPlacesBeenCountry
                                  ? "border-orange-300/60 bg-orange-500/20 text-orange-100"
                                  : "border-white/[0.14] bg-white/[0.05] text-white/[0.66] hover:border-white/[0.28] hover:bg-white/[0.1] hover:text-white"
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
                            <div className="mt-2 flex items-center gap-2">
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
                                className="h-9 min-w-0 flex-1 rounded-lg !border-white/[0.16] !bg-black/25 px-3 text-xs !text-white outline-none transition placeholder:!text-white/[0.36] focus:!border-white/[0.4]"
                              />
                              <button
                                type="button"
                                onClick={handleAddPlacesBeenEntry}
                                className="h-9 rounded-lg border border-orange-300/50 bg-orange-500/20 px-3 text-xs font-semibold text-orange-50 transition hover:border-orange-200/70 hover:bg-orange-500/30"
                              >
                                Add
                              </button>
                            </div>
                          ) : null}
                          <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-color:rgba(255,255,255,0.18)_transparent]">
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
                                        className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-sm transition-colors ${
                                          isActive
                                            ? "border-orange-300/45 bg-orange-500/[0.16] text-orange-50"
                                            : "border-transparent bg-white/[0.035] text-white/[0.74] hover:border-white/[0.14] hover:bg-white/[0.08] hover:text-white"
                                        }`}
                                      >
                                        {countryFlag ? (
                                          <span className="inline-flex min-w-[1rem] items-center justify-center text-sm leading-none">
                                            {countryFlag}
                                          </span>
                                        ) : (
                                          <span className="h-2 w-2 rounded-full border border-cyan-200/50 bg-cyan-400/70" />
                                        )}
                                        <span className="truncate font-medium">{group.country}</span>
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
                                        className="overflow-hidden rounded-lg border border-white/[0.11] bg-white/[0.035]"
                                      >
                                        <div className="flex items-center gap-1 p-1.5">
                                          <button
                                            type="button"
                                            onClick={() => handlePlacesBeenCountryFocus(group.country)}
                                            className={`min-w-0 flex-1 rounded-lg px-2 py-1 text-left text-xs font-semibold uppercase tracking-[0.08em] transition ${
                                              isCountryFocused
                                                ? "bg-orange-500/[0.16] text-orange-100"
                                                : "text-white/[0.6] hover:bg-white/[0.07] hover:text-white"
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
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-white/[0.46] transition hover:bg-white/[0.08] hover:text-white"
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
                                          <div className="space-y-1 border-t border-white/[0.08] px-1.5 py-1.5">
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
                                                  className={`flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-sm transition-colors ${
                                                    isActive
                                                      ? "border-orange-300/40 bg-orange-500/[0.14] text-orange-50"
                                                      : "border-transparent text-white/[0.68] hover:border-white/[0.1] hover:bg-white/[0.06] hover:text-white"
                                                  }`}
                                                >
                                                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/80" />
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
                              <p className="rounded-lg border border-dashed border-white/[0.14] bg-black/10 px-3 py-4 text-center text-sm text-white/[0.46]">
                                No places added yet.
                              </p>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {isProfileSettingsPane ? (
                      <div className="profile-left-stats mt-5 space-y-3 text-left">
                        <div className="rounded-xl border border-white/[0.12] bg-white/[0.07] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_24px_rgba(0,0,0,0.14)]">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/[0.48]">
                                Profile visibility
                              </p>
                              <p className="mt-1 text-sm font-medium text-white/[0.84]">
                                {profileVisibility === "public" ? "Public profile" : "Private profile"}
                              </p>
                            </div>
                            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.16] bg-white/[0.08] text-white/[0.82]">
                              {profileVisibility === "public" ? (
                                <Globe2 className="h-4 w-4" />
                              ) : (
                                <Lock className="h-4 w-4" />
                              )}
                            </span>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-1.5 rounded-full border border-white/[0.1] bg-black/20 p-1">
                            {(["public", "private"] as const).map((visibility) => {
                              const isActive = profileVisibility === visibility;
                              return (
                                <button
                                  key={visibility}
                                  type="button"
                                  onClick={() => void handleProfileVisibilityChange(visibility)}
                                  disabled={isSavingProfileVisibility}
                                  className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                                    isActive
                                      ? "profile-light-surface shadow-sm"
                                      : "text-white/[0.58] hover:bg-white/[0.08] hover:text-white"
                                  } ${isSavingProfileVisibility ? "cursor-wait opacity-70" : ""}`}
                                >
                                  {visibility}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="rounded-xl border border-white/[0.12] bg-white/[0.07] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_24px_rgba(0,0,0,0.14)]">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/[0.48]">
                            {locale === "es" ? "Idioma del sitio" : "Site language"}
                          </p>
                          <p className="mt-1 mb-3 text-sm font-medium text-white/[0.84]">
                            {locale === "es" ? "Elige el idioma de RGuide." : "Choose your RGuide language."}
                          </p>
                          <LocaleSwitcher locale={locale} />
                        </div>

                        <div className="rounded-xl border border-white/[0.12] bg-white/[0.07] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_24px_rgba(0,0,0,0.14)]">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/[0.48]">
                            Account
                          </p>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.1] bg-white/[0.06] px-3 py-2">
                              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/[0.42]">
                                Email
                              </span>
                              <span className="min-w-0 truncate text-sm font-medium text-white/[0.84]">
                                {currentUser.email ?? "No email"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.1] bg-white/[0.06] px-3 py-2">
                              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/[0.42]">
                                Publishing
                              </span>
                              <span className="text-sm font-medium text-white/[0.84]">
                                {currentUser.canPublishGuides ? "Can publish" : "Drafts only"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {profileSettingsMessage ? (
                          <p
                            className={`rounded-sm border px-3 py-1.5 text-xs font-semibold ${
                              profileSettingsMessage.startsWith("Profile set to")
                                ? "border-emerald-300/30 bg-emerald-400/10"
                                : "border-red-300/35 bg-red-500/10"
                            }`}
                            style={{
                              color: profileSettingsMessage.startsWith("Profile set to") ? "#86efac" : "#fb7185",
                            }}
                            aria-live="polite"
                          >
                            {profileSettingsMessage}
                          </p>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => void handleProfileSignOut()}
                          disabled={isSigningOutProfile}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.18] bg-white/[0.08] px-4 py-3 text-sm font-semibold text-white/[0.82] transition hover:border-white/[0.34] hover:bg-white/[0.14] hover:text-white disabled:cursor-wait disabled:opacity-60"
                        >
                          <LogOut className="h-4 w-4" />
                          {isSigningOutProfile ? "Signing out..." : "Sign out"}
                        </button>
                      </div>
                    ) : null}
                    {isProfileOverviewPane ? (
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
                    {isProfileOverviewPane ? (
                      <div className="mt-3 rounded-xl border border-white/[0.12] bg-white/[0.07] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_24px_rgba(0,0,0,0.14)]">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-white/[0.48]">Favorites</p>
                        <div className="mt-2 space-y-1.5">
                          {profileFavoriteHighlights.map((favorite) => (
                            <div key={favorite.type} className="flex min-h-10 items-center justify-between rounded-lg border border-white/[0.1] bg-white/[0.08] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/[0.42]">
                                {favorite.type}
                              </span>
                              <span className="ml-4 truncate text-sm font-semibold text-white/[0.88]">{favorite.value}</span>
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
              className="explorer-map-pane min-h-0 min-w-0 pointer-events-none border-slate-950/15 p-0 lg:border-x lg:border-y-0"
              aria-hidden="true"
            />

            <div
              ref={rightPaneRef}
              className={`frosted-pane-right pointer-events-auto absolute inset-x-0 bottom-0 z-40 rounded-t-lg rounded-tl-none border-t border-slate-950/15 ${
                isMobileListSheetDragging ? "transition-none" : "transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
              } lg:relative lg:inset-auto lg:z-20 lg:rounded-none lg:border-t-0 lg:shadow-none ${
                isMobileListSheetExpanded ? "h-[60svh]" : "h-36"
              } ${
                isGuidePaneTakingFullListPane ? "p-0" : "p-3 lg:p-5"
              } overflow-visible ${
                isSubcategoryMenuOpen && !isGuidePaneTakingFullListPane ? "lg:overflow-visible" : "lg:overflow-hidden"
              } lg:ml-0 lg:w-full lg:h-auto ${explorerPaneHeight}`}
              style={mobileListSheetDragHeight === null ? undefined : { height: `${mobileListSheetDragHeight}px` }}
              onPointerMove={handleMobileListSheetDragMove}
              onPointerUp={handleMobileListSheetDragEnd}
              onPointerCancel={handleMobileListSheetDragEnd}
            >
              <div
                className="mobile-rguides-tab absolute left-0 -top-7 z-[80] flex h-7 min-w-[6.25rem] touch-none items-center rounded-t-lg border border-b-0 border-slate-200 bg-[#1a1a1a] px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_-5px_12px_rgba(15,23,42,0.12)] transition-opacity duration-300 lg:hidden"
                data-mobile-sheet-handle
                onPointerDown={handleMobileListSheetDragStart}
                onPointerMove={handleMobileListSheetDragMove}
                onPointerUp={handleMobileListSheetDragEnd}
                onPointerCancel={handleMobileListSheetDragEnd}
              >
                {menuBarTitleLabel}
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
              <div className="frosted-pane-right pointer-events-none absolute inset-0 z-[82] rounded-t-lg rounded-tl-none lg:rounded-none" aria-hidden="true" />
              <div className={`relative z-[85] flex h-full flex-col ${paneTransitionClass} ${publicProfilePaneTransitionClass}`}>
                <div
                  className={`relative shrink-0 transition-[height,margin-bottom,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
                    isGuidePaneTakingFullListPane || isPublicProfileMode
                      ? "mb-0 h-0 overflow-hidden opacity-0"
                      : "mb-1 h-[3.875rem] overflow-visible opacity-100"
                  }`}
                  onPointerDown={handleMobileListSheetDragStart}
                >
                  <div
                    className={`flex h-5 items-center gap-2 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isGuidePaneTakingFullListPane ? "pointer-events-none -translate-y-2 opacity-0" : "translate-y-0 opacity-100"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold uppercase tracking-[0.14em] text-white/68">
                        {categoryTitleLabel}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`mt-0.5 w-full overflow-x-auto transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isGuidePaneTakingFullListPane ? "pointer-events-none -translate-y-2 opacity-0" : "translate-y-0 opacity-100"
                    }`}
                  >
                    <div className="flex min-w-max items-center gap-2 px-0.5">
                      {categoryOptions.map((option, index) => {
                        const isActive = activeCategory === option.category;
                        return (
                          <button
                            key={option.label}
                            type="button"
                            onClick={() => handleCategoryToggle(option.category)}
                            className={`category-icon-button flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-transparent shadow-sm outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/45 ${
                              isActive ? "category-icon-button-active text-white" : "bg-white/8 text-slate-950 hover:bg-white/12 hover:text-slate-950"
                            }`}
                            style={{
                              "--category-color": CATEGORY_STYLES[option.category].mapColor,
                              transitionDelay: `${index * 18}ms`,
                            } as React.CSSProperties}
                            aria-label={isActive ? `Clear ${getCategoryLabel(option.category)}` : getCategoryLabel(option.category)}
                            aria-pressed={isActive}
                          >
                            <option.icon className="h-4 w-4" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
	                <div
	                  className={`relative hidden w-full shrink-0 lg:block ${
                    isPublicProfileMode
	                      ? "!hidden lg:!hidden"
	                      : isGuidePaneTakingFullListPane
	                        ? "pointer-events-none max-h-0 -translate-y-3 pb-0 opacity-0 transition-[opacity,transform] duration-200 ease-out"
	                        : "max-h-56 translate-y-0 pb-0 opacity-100 transition-[opacity,transform] duration-200 ease-out"
		                  } ${
                        isSubcategoryMenuOpen ||
                        isDesktopSearchOpen ||
                        isDesktopGuideSourceMenuOpen ||
                        isDesktopGuideTypeMenuOpen
                          ? "z-[140]"
                          : "z-10"
                      } overflow-visible`}
		                >
                    <div
                      className="relative left-1/2 -mt-5 w-[calc(100%+2.5rem)] -translate-x-1/2 border-b-2 bg-[#111111]/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] transition-[border-color] duration-300"
                      style={{
                        borderBottomColor: activeCategory
                          ? CATEGORY_STYLES[activeCategory].mapColor
                          : "#f05232",
                      }}
                      role="toolbar"
                      aria-label={browseLabels.menuBar}
                    >
                      <div className="relative h-[5rem]">
                        <div
                          className={`flex h-full items-center justify-between gap-4 px-5 transition-[opacity] duration-300 ${
                            isDesktopSearchOpen ? "pointer-events-none opacity-0" : "opacity-100"
                          }`}
                        >
                          <span className="min-w-0 truncate text-[22px] font-extrabold uppercase tracking-[0] text-white">
                            {desktopMenuBarTitleLabel}
                          </span>
                          <div className="flex shrink-0 items-center gap-1.5">
                            {isProfileMode ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setIsDesktopGuideSourceMenuOpen(false);
                                  setIsDesktopGuideTypeMenuOpen(false);
                                  openProfileCreateModal();
                                }}
                                disabled={!canCreateStandaloneProfileEntry}
                                className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border transition-[color,border-color,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                                  canCreateStandaloneProfileEntry
                                    ? "border-white/25 text-white hover:border-[#f05232] hover:bg-white/[0.06]"
                                    : "cursor-not-allowed border-white/10 text-white/25"
                                }`}
                                aria-label={canCreateStandaloneProfileEntry ? browseLabels.createGuide : browseLabels.createGuideUnavailable}
                                title={canCreateStandaloneProfileEntry ? browseLabels.createGuide : standaloneCreateDisabledTitle}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            ) : null}
                            <div
                              className="flex h-9 shrink-0 items-stretch overflow-hidden border-b-2 border-[#f05232] transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                              role="group"
                              aria-label={browseLabels.guideSource}
                            >
                              {visibleGuideSourceSelectors.map((selector) => {
                                const isActive = activeGuideSource === selector.id;
                                const isVisible = isDesktopGuideSourceMenuOpen || isActive;
                                return (
                                  <button
                                    key={selector.id}
                                    type="button"
                                    onClick={() => {
                                      if (!isDesktopGuideSourceMenuOpen) {
                                        setIsDesktopGuideSourceMenuOpen(true);
                                        setIsDesktopGuideTypeMenuOpen(false);
                                        return;
                                      }
                                      if (!isActive) {
                                        handleGuideSourceSelect(selector.id);
                                      }
                                      setIsDesktopGuideSourceMenuOpen(false);
                                    }}
                                    className={`flex h-9 shrink-0 items-center overflow-hidden whitespace-nowrap text-[11px] font-extrabold uppercase tracking-[0.1em] transition-[max-width,padding,opacity,color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:bg-white/[0.06] focus-visible:outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 ${
                                      isVisible ? "max-w-24 px-2 opacity-100" : "pointer-events-none max-w-0 px-0 opacity-0"
                                    } ${isActive ? "text-white" : "text-white/70 hover:bg-white/[0.05] hover:text-white"}`}
                                    aria-label={selector.label}
                                    aria-pressed={isActive}
                                    aria-expanded={isActive ? isDesktopGuideSourceMenuOpen : undefined}
                                    aria-hidden={!isVisible}
                                    tabIndex={isVisible ? 0 : -1}
                                  >
                                    {sourceControlLabelById[selector.id]}
                                  </button>
                                );
                              })}
                            </div>
                            <div
                              className="flex h-9 shrink-0 items-stretch overflow-hidden border-b-2 transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                              style={{
                                borderBottomColor: activeGuideActionSelector
                                  ? guideActionActiveStyles[activeGuideActionSelector.id].borderColor
                                  : "rgba(255,255,255,0.25)",
                              }}
                              role="group"
                              aria-label={browseLabels.entryType}
                            >
                              {visibleGuideActionSelectors.map((selector) => {
                                const isActive = activeGuideRail === selector.id;
                                const isVisible = isDesktopGuideTypeMenuOpen || isActive;
                                return (
                                  <button
                                    key={selector.id}
                                    type="button"
                                    onClick={() => {
                                      if (!isDesktopGuideTypeMenuOpen) {
                                        setIsDesktopGuideTypeMenuOpen(true);
                                        setIsDesktopGuideSourceMenuOpen(false);
                                        return;
                                      }
                                      if (!isActive) {
                                        handleGuideRailSelect(selector.id);
                                      }
                                      setIsDesktopGuideTypeMenuOpen(false);
                                    }}
                                    className={`flex h-9 shrink-0 items-center overflow-hidden whitespace-nowrap text-[11px] font-extrabold uppercase tracking-[0.1em] transition-[max-width,padding,opacity,color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:bg-white/[0.06] focus-visible:outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 ${
                                      isVisible ? "max-w-24 px-2 opacity-100" : "pointer-events-none max-w-0 px-0 opacity-0"
                                    } ${isActive ? "text-white" : "text-white/70 hover:bg-white/[0.05] hover:text-white"}`}
                                    aria-label={selector.label}
                                    aria-pressed={isActive}
                                    aria-expanded={isActive ? isDesktopGuideTypeMenuOpen : undefined}
                                    aria-hidden={!isVisible}
                                    tabIndex={isVisible ? 0 : -1}
                                  >
                                    {selector.label}
                                  </button>
                                );
                              })}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setIsDesktopGuideSourceMenuOpen(false);
                                setIsDesktopGuideTypeMenuOpen(false);
                                setIsFoodOpenTimeMenuOpen(false);
                                setIsFoodCuisineMenuOpen(false);
                                setIsNightlifeBarMenuOpen(false);
                                setIsNightlifeMusicMenuOpen(false);
                                setIsDesktopSearchOpen(true);
                              }}
                              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-white/25 bg-white/[0.035] text-white transition hover:border-[#f05232] hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                              aria-label={browseLabels.openSearch}
                              title={browseLabels.search}
                            >
                              <Search className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div
                          className={`absolute inset-x-5 top-1/2 z-[260] flex h-10 -translate-y-1/2 items-center justify-end overflow-visible rounded-sm border border-slate-200 bg-white shadow-sm transition-[clip-path,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isDesktopSearchOpen ? "opacity-100" : "pointer-events-none opacity-0"
                          }`}
                          style={{
                            clipPath: isDesktopSearchOpen ? "inset(0 0 0 0)" : "inset(0 0 0 100%)",
                          }}
                          aria-hidden={!isDesktopSearchOpen}
                        >
                          <SearchBar
                            locale={locale}
                            destinationTranslations={destinationTranslations}
                            key={isDesktopSearchOpen ? "desktop-search-open" : "desktop-search-closed"}
                            autoFocus={isDesktopSearchOpen}
                            compact
                            embedded
                            variant="square"
                            size="md"
                            onResultSelect={() => setIsDesktopSearchOpen(false)}
                            className="min-w-0 flex-1 !max-w-none"
                          />
                          <button
                            type="button"
                            onClick={() => setIsDesktopSearchOpen(false)}
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-transparent bg-transparent text-black transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70"
                            aria-label={browseLabels.closeSearch}
                            title={browseLabels.closeSearch}
                            tabIndex={isDesktopSearchOpen ? 0 : -1}
                          >
                            <X className="h-5 w-5 text-black" />
                          </button>
                        </div>
	                    </div>
                    </div>
                    {!isPublicProfileMode ? (
                      <div
                        className={`mt-0 w-full translate-y-0 space-y-3 pb-2 opacity-100 transition-[margin,max-height,opacity,transform,padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isSubcategoryMenuOpen ? "max-h-44" : "max-h-40"
                        } overflow-visible`}
                      >
                        <div
                          id="desktop-category-menu"
                          className="grid grid-rows-[1fr] translate-y-0 opacity-100 transition-[grid-template-rows,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        >
                          <div className="min-h-0 overflow-visible">
                            <div
                              className="relative left-1/2 flex h-12 w-[calc(100%+2.5rem)] -translate-x-1/2 items-stretch border-b border-slate-950/16 bg-[#f1f2ef] shadow-[0_1px_0_rgba(255,255,255,0.72)_inset]"
                            >
                              <div className="japanese-category-tape flex w-full min-w-0 flex-1 items-stretch overflow-hidden">
                                {categoryOptions.map((option) => {
                                  const isActive = activeCategory === option.category;
                                  const categoryColor = CATEGORY_STYLES[option.category].mapColor;
                                  return (
                                    <button
                                      key={option.label}
                                      type="button"
                                      onClick={() => handleCategoryToggle(option.category)}
                                      onMouseEnter={() => setHoveredCategoryLabel(getCategoryLabel(option.category))}
                                      onMouseLeave={() => setHoveredCategoryLabel(null)}
                                      className={`group relative flex h-12 min-w-0 flex-1 items-center justify-center gap-1.5 overflow-hidden border-r border-slate-950/12 px-0.5 outline-none transition-[color,border-color] duration-200 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-950/60 ${
                                        isActive
                                          ? "text-white"
                                          : "bg-transparent text-slate-950 hover:bg-white/80"
                                      }`}
                                      aria-label={getCategoryLabel(option.category)}
                                      aria-pressed={isActive}
                                    >
                                      <span
                                        className={`pointer-events-none absolute inset-0 origin-bottom transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                          isActive ? "scale-y-100" : "scale-y-0"
                                        }`}
                                        style={{ backgroundColor: categoryColor }}
                                        aria-hidden="true"
                                      />
                                      <option.icon className="relative z-10 h-[18px] w-[18px] shrink-0" />
                                      <span className="relative z-10 min-w-0 whitespace-nowrap text-[8.5px] font-bold uppercase tracking-[0]">
                                        {getCategoryLabel(option.category)}
                                      </span>
                                      {!isActive ? (
                                        <span
                                          className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100"
                                          style={{ backgroundColor: categoryColor }}
                                          aria-hidden="true"
                                        />
                                      ) : null}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                  <div
                    className={`transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      visibleSubcategoryCategory && !isSubcategoryCollapsing ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                    } ${isSubcategoryMenuOpen ? "overflow-visible" : "overflow-hidden"}`}
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
                            <div className="absolute left-1/2 top-[calc(100%+6px)] z-[120] w-full -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
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
                            <div className="absolute left-1/2 top-[calc(100%+6px)] z-[120] w-[18rem] -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
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
                        {visibleSubcategoryOptions.map((subcategory, index) =>
                          subcategory === NIGHTLIFE_MUSIC_TYPE_ANY ? (
                            <div
                              key={`${visibleSubcategoryCategory}-${subcategory}`}
                              className="subcategory-cascade-item relative w-[8.2rem] shrink-0"
                              style={{
                                animationDelay: `${(isSubcategoryClosing ? visibleSubcategoryOptions.length - index : index) * 55}ms`,
                                animationDirection: isSubcategoryClosing ? "reverse" : "normal",
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveSubcategory(NIGHTLIFE_MUSIC_TYPE_ANY);
                                  setIsNightlifeMusicMenuOpen((current) => !current);
                                  setIsNightlifeBarMenuOpen(false);
                                  setIsFoodOpenTimeMenuOpen(false);
                                  setIsFoodCuisineMenuOpen(false);
                                }}
                                className={`w-full rounded-full border px-2 py-0.5 pr-5 text-center text-[10px] font-medium uppercase tracking-[0.08em] shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-slate-400/50 ${
                                  activeSubcategory === NIGHTLIFE_MUSIC_TYPE_ANY
                                    ? "text-white"
                                    : "border-slate-200 bg-white/95 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                                }`}
                                style={
                                  activeSubcategory === NIGHTLIFE_MUSIC_TYPE_ANY
                                    ? {
                                        backgroundColor: CATEGORY_STYLES[visibleSubcategoryCategory].mapColor,
                                        borderColor: CATEGORY_STYLES[visibleSubcategoryCategory].mapColor,
                                      }
                                    : undefined
                                }
                                aria-haspopup="listbox"
                                aria-expanded={isNightlifeMusicMenuOpen}
                                aria-label="Music filter"
                              >
                                {activeNightlifeMusicType}
                              </button>
                              <ChevronDown
                                className={`pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 transition-transform ${
                                  activeSubcategory === NIGHTLIFE_MUSIC_TYPE_ANY ? "text-white/80" : "text-slate-400"
                                } ${isNightlifeMusicMenuOpen ? "rotate-180" : ""}`}
                                aria-hidden="true"
                              />
                              {isNightlifeMusicMenuOpen ? (
                                <div className="absolute left-1/2 top-[calc(100%+6px)] z-[120] w-full -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                                  <button
                                    key="nightlife-music-any"
                                    type="button"
                                    onClick={() => {
                                      const shouldClear =
                                        activeSubcategory === NIGHTLIFE_MUSIC_TYPE_ANY &&
                                        activeNightlifeMusicType === NIGHTLIFE_MUSIC_TYPE_ANY;
                                      setActiveSubcategory(shouldClear ? null : NIGHTLIFE_MUSIC_TYPE_ANY);
                                      setActiveNightlifeMusicType(NIGHTLIFE_MUSIC_TYPE_ANY);
                                      setIsNightlifeMusicMenuOpen(false);
                                    }}
                                    className={`block w-full px-3 py-2 text-left text-[11px] font-medium uppercase tracking-[0.08em] transition ${
                                      activeSubcategory === NIGHTLIFE_MUSIC_TYPE_ANY &&
                                      activeNightlifeMusicType === NIGHTLIFE_MUSIC_TYPE_ANY
                                        ? "bg-slate-100 text-slate-900"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                                  >
                                    {NIGHTLIFE_MUSIC_TYPE_ANY}
                                  </button>
                                  {NIGHTLIFE_MUSIC_TYPE_OPTIONS.map((musicType) => (
                                    <button
                                      key={`nightlife-music-${musicType}`}
                                      type="button"
                                      onClick={() => {
                                        setActiveSubcategory(NIGHTLIFE_MUSIC_TYPE_ANY);
                                        setActiveNightlifeMusicType(musicType);
                                        setIsNightlifeMusicMenuOpen(false);
                                      }}
                                      className={`block w-full px-3 py-2 text-left text-[11px] font-medium uppercase tracking-[0.08em] transition ${
                                        activeNightlifeMusicType === musicType
                                          ? "bg-slate-100 text-slate-900"
                                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                      }`}
                                    >
                                      {musicType}
                                    </button>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          ) : (
                            <button
                              key={`${visibleSubcategoryCategory}-${subcategory}`}
                              type="button"
                              onClick={() => {
                                setActiveSubcategory((current) =>
                                  current === subcategory ? null : subcategory,
                                );
                                setActiveNightlifeMusicType(NIGHTLIFE_MUSIC_TYPE_ANY);
                                setIsNightlifeMusicMenuOpen(false);
                              }}
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
                          )
                        )}
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
                              setIsNightlifeMusicMenuOpen(false);
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
                            <div className="absolute left-1/2 top-[calc(100%+6px)] z-[120] w-full -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
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
                    ) : null}
	                </div>

	                <div
                  data-guides-scroll
                  className={`relative z-0 flex min-h-0 flex-1 flex-col gap-4 ${
                    isGuidePaneTakingFullListPane
                      ? "mt-0 h-full max-h-full overflow-hidden pb-0 pr-0 overscroll-contain"
                      : `mt-2 ${explorerBodyMaxHeight} overflow-y-auto pb-0 pr-1`
                  }`}
                >
                  {displayedGuide ? (
                    <div className={isGuideTakingFullListPane ? "flex h-full min-h-0 flex-col" : "space-y-4"}>
                      <div
                        key={displayedGuide.id}
                        data-guide-card-anchor={displayedGuide.id}
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
                          deferExpandedContent={settlingGuideContentId === displayedGuide.id}
                          collapseExpandedContent={closingGuide?.id === displayedGuide.id && closingGuidePhase === "precollapsing"}
                          onToggleExpand={handleGuideToggle}
                          shouldAutoOpenSources={pendingSourcesOpenGuideId === displayedGuide.id}
                          onAutoOpenSourcesHandled={handleAutoOpenSourcesHandled}
                          onRequestOpenSourcesWhenCollapsed={handleExpandAndOpenSources}
                          onHoverStart={handleGuideCardHoverStart}
                          onHoverEnd={handleGuideCardHoverEnd}
                          onStopHoverChange={setHoveredStopId}
                          onStopSelect={handleGuideStopSelect}
                          hoveredStopId={hoveredStopId}
                          isExternallyHovered={hoveredGuideMarkerId === displayedGuide.id}
                          onExpandedStopIdsChange={setVisibleNestedStopParentIds}
                          forceExpandStopId={selectedGuideStopId}
                          forceExpandStopNonce={selectedGuideStopNonce}
                          collapsedLocationSubtitleHiddenParts={getCollapsedLocationSubtitleHiddenParts(displayedGuide)}
                          guideCrossLinkGroups={displayedGuideCrossLinkGroups}
                          guideQuickLinks={displayedCitywideGuideLinks}
                          onGuideCrossLinkSelect={handleGuideCrossLinkSelect}
                        />
                      </div>
                      {!isGuideTakingFullListPane && remainingGuides.length ? (
                        <div className="space-y-4 border-t border-slate-200 pt-4">
                        {activeGuideRail !== "itinerary" ? (
                          <p className="px-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white/62">
                            More Guides
                          </p>
                        ) : null}
                        {remainingGuides.map((list) => (
                          <div
                            key={list.id}
                            data-guide-card-anchor={list.id}
                            ref={(node) => {
                              guideRefs.current[list.id] = node;
                            }}
                            className="scroll-mt-2"
                          >
                            <MapListCard
                              list={list}
                              expandable
                              expanded={false}
                              preserveExpandedChrome={closingGuide?.id === list.id || openingGuideId === list.id}
                              retractExpandedChrome={
                                closingGuide?.id === list.id &&
                                (closingGuidePhase === "returning" || closingGuidePhase === "collapsing")
                              }
                              expandExpandedChrome={openingGuideId === list.id}
                              hideExpandedContent={closingGuide?.id === list.id}
                              onExpandChromeComplete={completeGuideOpening}
                              onToggleExpand={handleGuideToggle}
                              shouldAutoOpenSources={pendingSourcesOpenGuideId === list.id}
                              onAutoOpenSourcesHandled={handleAutoOpenSourcesHandled}
                              onRequestOpenSourcesWhenCollapsed={handleExpandAndOpenSources}
                              onHoverStart={handleGuideCardHoverStart}
                              onHoverEnd={handleGuideCardHoverEnd}
                              onStopHoverChange={setHoveredStopId}
                              onStopSelect={handleGuideStopSelect}
                              hoveredStopId={hoveredStopId}
                              isExternallyHovered={hoveredGuideMarkerId === list.id}
                              forceExpandStopId={selectedGuideStopId}
                              forceExpandStopNonce={selectedGuideStopNonce}
                              collapsedLocationSubtitleHiddenParts={getCollapsedLocationSubtitleHiddenParts(list)}
                            />
                          </div>
                        ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <>
                      {shouldGroupCityGuideList && citywideRailLists.length ? (
                        <div className="space-y-4">
                          <p className="px-1 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                            Citywide Guides
                          </p>
                          {citywideRailLists.map((list) => renderGuideRailCard(list, "citywide-"))}
                        </div>
                      ) : (
                        citywideRailLists.map((list) => renderGuideRailCard(list))
                      )}
                      {shouldGroupCityGuideList && neighborhoodRailLists.length ? (
                        <div className="space-y-4 border-t border-white/14 pt-4">
                          <p className="px-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white/62">
                            Neighborhood Guides
                          </p>
                          {neighborhoodRailLists.map((list) => renderGuideRailCard(list, "neighborhood-"))}
                        </div>
                      ) : null}
                      {recentGuideLists.length ? (
                        <div className="space-y-4 border-t border-white/14 pt-4">
                          <p className="px-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white/62">
                            Recent Guides
                          </p>
                          {recentGuideLists.map((list) => (
                            <div
                              key={`recent-rguide-${list.id}`}
                              data-guide-card-anchor={list.id}
                              ref={(node) => {
                                guideRefs.current[list.id] = node;
                              }}
                              className="scroll-mt-2"
                            >
                              <MapListCard
                                list={list}
                                expandable
                                expanded={false}
                                preserveExpandedChrome={closingGuide?.id === list.id || openingGuideId === list.id}
                                retractExpandedChrome={
                                  closingGuide?.id === list.id &&
                                  (closingGuidePhase === "returning" || closingGuidePhase === "collapsing")
                                }
                                expandExpandedChrome={openingGuideId === list.id}
                                hideExpandedContent={closingGuide?.id === list.id}
                                onExpandChromeComplete={completeGuideOpening}
                                onToggleExpand={handleGuideToggle}
                                onHoverStart={handleGuideCardHoverStart}
                                onHoverEnd={handleGuideCardHoverEnd}
                                onStopHoverChange={setHoveredStopId}
                                onStopSelect={handleGuideStopSelect}
                                hoveredStopId={hoveredStopId}
                                isExternallyHovered={hoveredGuideMarkerId === list.id}
                                forceExpandStopId={selectedGuideStopId}
                                forceExpandStopNonce={selectedGuideStopNonce}
                                collapsedLocationSubtitleHiddenParts={getCollapsedLocationSubtitleHiddenParts(list)}
                              />
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
              {isProfileMode && currentUser && isProfileSubmitting ? (
                <div
                  className={`frosted-pane-right absolute inset-0 z-20 transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
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
                              setProfileSubmissionType("itinerary");
                              setProfileGuideSubmissionVariant("itinerary");
                            }}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                              profileSubmissionType === "itinerary" && profileGuideSubmissionVariant === "itinerary"
                                ? "bg-slate-900 text-white"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            Journey
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
                          disabled={!canCreateStandaloneProfileEntry}
                          onClick={() =>
                            setIsProfileSubmitting((current) => {
                              const next = !current;
                              if (!next) {
                                setProfileEditingListId(null);
                              }
                              return next;
                            })
                          }
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-full border transition ${
                            canCreateStandaloneProfileEntry
                              ? "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900"
                              : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                          }`}
                          aria-label={
                            canCreateStandaloneProfileEntry
                              ? isProfileSubmitting
                                ? "Close guide submission"
                                : "Create guide"
                              : "Create guide unavailable"
                          }
                          title={
                            canCreateStandaloneProfileEntry
                              ? isProfileSubmitting
                                ? "Close guide submission"
                                : "Create guide"
                              : standaloneCreateDisabledTitle
                          }
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
                            onHoverStart={handleGuideCardHoverStart}
                            onHoverEnd={handleGuideCardHoverEnd}
                            onStopHoverChange={setHoveredStopId}
                            onStopSelect={handleGuideStopSelect}
                            hoveredStopId={hoveredStopId}
                            isExternallyHovered={hoveredGuideMarkerId === profileExpandedGuide?.id}
                            onExpandedStopIdsChange={setVisibleNestedStopParentIds}
                            forceExpandStopId={selectedGuideStopId}
                            forceExpandStopNonce={selectedGuideStopNonce}
                            onEditGuide={handleEditGuideFromProfile}
                            startInlineEditingNonce={profileInlineEditNonce}
                          />
                        ) : profileRailLists.length ? (
                          profileRailLists.map((list) => (
                            <MapListCard
                              key={list.id}
                              list={list}
                              expandable
                              expanded={profileExpandedGuideId === list.id}
                              onToggleExpand={handleProfileGuideToggle}
                              onHoverStart={handleGuideCardHoverStart}
                              onHoverEnd={handleGuideCardHoverEnd}
                              onStopHoverChange={setHoveredStopId}
                              onStopSelect={handleGuideStopSelect}
                              hoveredStopId={hoveredStopId}
                              isExternallyHovered={hoveredGuideMarkerId === list.id}
                              forceExpandStopId={selectedGuideStopId}
                              forceExpandStopNonce={selectedGuideStopNonce}
                              onEditGuide={handleEditGuideFromProfile}
                              startInlineEditingNonce={profileExpandedGuideId === list.id ? profileInlineEditNonce : 0}
                            />
                          ))
                        ) : (
                          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center">
                            <p className="text-sm font-medium text-slate-900">
                              No {(profileRightRailOptions.find((option) => option.id === activeProfileRightRail)?.label ?? activeProfileRightRail).toLowerCase()} yet
                            </p>
                          </div>
                        )}
                      </div>
                      <div
                        className={`frosted-pane-right absolute inset-0 z-30 min-h-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
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
      </div>
      {isMobileInfoModalOpen ? (
        <div
          className="fixed inset-0 z-[500] flex items-stretch justify-start bg-black/42 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-destination-info-title"
          onClick={() => setIsMobileInfoModalOpen(false)}
        >
          <div
            className="left-pane-solid left-pane-dark-preview relative flex h-full w-[min(22rem,calc(100vw-3.25rem))] flex-col overflow-hidden border-r border-white/14 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] text-white shadow-[16px_0_36px_rgba(0,0,0,0.34)]"
            onClick={(event) => event.stopPropagation()}
          >
              {activeDestinationImage ? (
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-[18.75rem] overflow-hidden bg-slate-950"
                  style={{
                    WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 64%, rgba(0, 0, 0, 0.28) 86%, transparent 100%)",
                    maskImage: "linear-gradient(to bottom, black 0%, black 64%, rgba(0, 0, 0, 0.28) 86%, transparent 100%)",
                  }}
                  aria-hidden="true"
                >
                  <img
                    src={activeDestinationImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.34)" }} />
                  <div
                    className="absolute inset-x-0 top-0"
                    style={{
                      height: "calc(100% + 3.5rem)",
                      background:
                        "linear-gradient(to bottom, rgba(0, 0, 0, 0.18) 0%, rgba(0, 0, 0, 0.24) 55%, rgba(0, 0, 0, 0.62) 100%)",
                      transform: isCategoryInsightMode ? "translateY(-3.5rem)" : "translateY(0)",
                      transition: "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  />
                </div>
              ) : null}
            <div className="relative z-10 flex h-full min-h-0 flex-col">
              <div className="shrink-0 px-4 pb-4 pt-4">
                <div className="mb-3 flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    {visibleSeoContextLabel ? (
                      <p className={`mb-1 max-w-[calc(100%-1rem)] text-sm font-medium ${activeDestinationImage ? "text-white drop-shadow-sm" : "text-slate-600"}`}>
                        {visibleSeoContextLabel}
                      </p>
                    ) : null}
                    <h2
                      id="mobile-destination-info-title"
                      className={`max-w-full text-2xl font-semibold ${activeDestinationImage ? "text-white drop-shadow-sm" : "text-slate-900"}`}
                    >
                      {activeCategory && activeLocation.city && !expandedGuide ? (
                        <button
                          type="button"
                          onClick={() => handleCategoryToggle(activeCategory)}
                          className="inline-block max-w-full text-left [font:inherit] leading-[inherit] transition hover:opacity-80"
                          aria-label={`Show all ${activeSeoPlaceLabel} guides`}
                          title={`Show all ${activeSeoPlaceLabel} guides`}
                        >
                          {visibleSeoHeading}
                        </button>
                      ) : (
                        visibleSeoHeading
                      )}
                    </h2>
                    {!isSavedPlacesRailActive ? (
                      <p className={`mt-1 text-sm ${activeDestinationImage ? "text-white drop-shadow-sm" : "text-slate-600"}`}>
                        {formatBreadcrumbName(activeDirectoryMeta.detail)}
                      </p>
                    ) : null}
                  </div>
                  <div className="ml-auto flex shrink-0 flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsMobileInfoModalOpen(false)}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/12 bg-black/18 text-white/72 shadow-sm transition hover:bg-black/26 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45"
                      aria-label="Close information"
                      title="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <CityWeatherChip
                      cityId={activeLocation.city?.id}
                      cityName={activeLocation.city?.name}
                      coordinates={activeLocation.city?.coordinates}
                      onImage={Boolean(activeDestinationImage)}
                      placement="inline"
                    />
                  </div>
                </div>

                {isSavedPlacesRailActive ? (
                  <div className="mt-4">
                    {favoriteLocations.length ? (
                      <div className="space-y-4">
                        {favoriteLocationSections.map((section) => (
                          <section key={`mobile-info-favorites-${section.key}`}>
                            <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                              {section.label}
                            </p>
                            <div className="space-y-1">
                              {section.locations.map((location) => (
                                <FavoriteLocationRow
                                  key={`mobile-info-favorite-${location.id}`}
                                  location={location}
                                  active={activeFavoriteLocation?.id === location.id}
                                  onSelect={(favoriteLocation) => {
                                    setIsMobileInfoModalOpen(false);
                                    handleFavoriteLocationSelect(favoriteLocation);
                                  }}
                                />
                              ))}
                            </div>
                          </section>
                        ))}
                      </div>
                    ) : (
                      <p className="rounded-2xl border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-500">
                        No saved places yet.
                      </p>
                    )}
                  </div>
                ) : activeLocation.city || visibleIntroCopyDisplay ? (
                  <div className={`${isCategoryInsightMode ? "mt-1" : "mt-2"}`}>
                    {visibleIntroCopyDisplay ? (
                      <div
                        className={`overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isCategoryInsightMode
                            ? "max-h-0 -translate-y-2 opacity-0"
                            : "max-h-40 translate-y-0 opacity-100"
                        }`}
                        aria-hidden={isCategoryInsightMode}
                      >
                        <p
                          className={`ml-3 min-h-[9rem] border-l pl-3 text-sm leading-5 ${
                            activeDestinationImage
                              ? "border-white/35 text-white drop-shadow-sm"
                              : "border-slate-200 text-slate-600"
                          }`}
                        >
                          {renderLeftPaneAnnotatedText(
                            visibleIntroCopyDisplay,
                            descriptionNeighborhoodMentions,
                            "mobile-info-intro-description",
                          )}
                        </p>
                      </div>
                    ) : null}
                    {!expandedGuide ? (
                      <div
                        className={`${
                          isCategoryInsightMode ? "mt-0 -translate-y-0.5" : "mt-3 translate-y-0"
                        } flex items-center gap-2 transition-[margin,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]`}
                      >
                        {activeStayBookingHref ? (
                          <div
                            className="inline-flex h-9 overflow-hidden rounded-sm border bg-black/24 shadow-none"
                            style={{ borderColor: CATEGORY_STYLES.Stay.mapColor }}
                          >
                            <button
                              type="button"
                              onClick={handleStayCategoryFilter}
                              className="inline-flex h-9 w-9 items-center justify-center text-white transition hover:bg-white/[0.08]"
                              style={activeCategory === "Stay" ? { backgroundColor: CATEGORY_STYLES.Stay.mapColor } : undefined}
                              aria-label={`Show stays in ${activeSeoPlaceLabel}`}
                              aria-pressed={activeCategory === "Stay"}
                              title="Show stays"
                            >
                              <BedDouble className="h-3.5 w-3.5" />
                            </button>
                            <a
                              href={activeStayBookingHref}
                              target="_blank"
                              rel="noreferrer sponsored"
                              className="inline-flex h-9 items-center gap-1 border-l px-2.5 text-[11px] font-extrabold uppercase tracking-[0] text-white transition hover:bg-white/[0.08]"
                              style={{ borderLeftColor: CATEGORY_STYLES.Stay.mapColor }}
                              aria-label={`Search stays in ${activeStayBookingQuery}`}
                              title={`Book stays in ${activeStayBookingQuery}`}
                            >
                              <span>Book</span>
                              <SquareArrowOutUpRight className="h-3 w-3" aria-hidden="true" />
                            </a>
                          </div>
                        ) : null}
                        <div className="ml-auto flex items-center gap-2">
                          {activeFavoriteLocation ? (
                            <button
                              type="button"
                              onClick={() => toggleFavoriteLocation(activeFavoriteLocation)}
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-sm bg-transparent text-white shadow-none transition ${
                                isActiveLocationFavorited
                                  ? "border-2 border-white"
                                  : "border border-white/54 hover:border-white hover:bg-white/[0.06]"
                              }`}
                              aria-label={`${isActiveLocationFavorited ? "Remove" : "Save"} ${activeSeoPlaceLabel} ${isActiveLocationFavorited ? "from" : "to"} saved places`}
                              title={isActiveLocationFavorited ? "Remove saved place" : "Save place"}
                            >
                              <Bookmark className="h-3.5 w-3.5" filled={isActiveLocationFavorited} />
                            </button>
                          ) : null}
                          {activeLocation.city ? (
                            <button
                              type="button"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-white/54 bg-transparent text-white shadow-none transition hover:border-white hover:bg-white/[0.06]"
                              aria-label={`Tour ${activeSeoPlaceLabel}`}
                              title="Neighborhood tour coming soon"
                            >
                              <Footprints className="h-3.5 w-3.5" filled={false} />
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                    {!expandedGuide && displayCategoryInsight ? (
                      <div
                        className={`${
                          isCategoryInsightExiting ? "category-insight-draw-out" : "category-insight-draw-in"
                        } mt-2 rounded-[10px] border p-3 ${
                          activeDestinationImage
                            ? "border-white/18 bg-black/24 text-white shadow-[0_12px_34px_rgba(0,0,0,0.18)]"
                            : "border-slate-200/80 bg-white/75 text-slate-800 shadow-sm"
                        }`}
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: CATEGORY_STYLES[displayCategoryInsight.category].mapColor }}
                            aria-hidden="true"
                          />
                          <p
                            className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
                              activeDestinationImage ? "text-white/58" : "text-slate-500"
                            }`}
                          >
                            {displayCategoryInsight.label}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {displayCategoryInsight.chips.map((chip) => {
                            const isFoodCuisineChip =
                              displayCategoryInsight.category === "Food" &&
                              activeFoodCuisineOptions.some((option) => option.toLowerCase() === chip.toLowerCase());
                            const isSubcategoryChip = displayCategoryInsight.category !== "Food";
                            const isActiveCuisine =
                              isFoodCuisineChip && activeFoodCuisine.toLowerCase() === chip.toLowerCase();
                            const isActiveSubcategory =
                              isSubcategoryChip && activeSubcategory?.toLowerCase() === chip.toLowerCase();
                            const isActiveChip = isActiveCuisine || isActiveSubcategory;
                            const isFilterChip = isFoodCuisineChip || isSubcategoryChip;

                            return (
                              <button
                                key={`mobile-info-chip-${chip}`}
                                type="button"
                                onClick={() => handleCategoryInsightChipSelect(chip)}
                                disabled={!isFilterChip}
                                className={`rounded-full border px-2 py-1 text-[11px] font-semibold leading-none transition ${
                                  isFilterChip ? "cursor-pointer hover:-translate-y-0.5" : "cursor-default"
                                }`}
                                style={{
                                  backgroundColor: isActiveChip
                                    ? CATEGORY_STYLES[displayCategoryInsight.category].mapColor
                                    : `${CATEGORY_STYLES[displayCategoryInsight.category].mapColor}24`,
                                  borderColor: isActiveChip
                                    ? CATEGORY_STYLES[displayCategoryInsight.category].mapColor
                                    : `${CATEGORY_STYLES[displayCategoryInsight.category].mapColor}33`,
                                  color: isActiveChip || activeDestinationImage
                                    ? "rgba(255,255,255,0.92)"
                                    : CATEGORY_STYLES[displayCategoryInsight.category].mapColor,
                                }}
                                aria-pressed={isActiveChip}
                              >
                                {chip}
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-2 space-y-1.5">
                          {displayCategoryInsight.category === "Food" && activeFoodCuisine !== FOOD_CUISINE_ANY ? (
                            <p
                              className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                                activeDestinationImage ? "text-white/54" : "text-slate-500"
                              }`}
                            >
                              {activeFoodCuisine} need to knows
                            </p>
                          ) : null}
                          {displayCategoryInsightNotes.map((note, noteIndex) => {
                            const noteMentions = getCategoryInsightNoteNeighborhoodMentions(note.body);

                            return (
                              <div
                                key={`mobile-info-${note.label ?? displayCategoryInsight.label}-${note.body}`}
                                className={`border-l pl-2 text-[12px] leading-5 ${
                                  activeDestinationImage
                                    ? "border-white/24 text-white/76"
                                    : "border-slate-200 text-slate-600"
                                }`}
                              >
                                {note.label ? (
                                  <span
                                    className="mr-1.5 font-semibold uppercase tracking-[0.12em]"
                                    style={{
                                      color: activeDestinationImage
                                        ? "rgba(255,255,255,0.92)"
                                        : CATEGORY_STYLES[displayCategoryInsight.category].mapColor,
                                    }}
                                  >
                                    {note.label}
                                  </span>
                                ) : null}
                                <span>
                                  {renderLeftPaneAnnotatedText(
                                    note.body,
                                    noteMentions,
                                    `mobile-info-category-insight-${noteIndex}`,
                                  )}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : !expandedGuide && cityHighlightRows.length && !isCategoryInsightExiting ? (
                      <div className="city-summary-draw-in mt-3 space-y-1.5 overflow-hidden text-sm leading-5">
                        {cityHighlightRows.map((row) => {
                          const isActiveRow = activeCategory === row.category;
                          const rowColor = getLightCategoryTextColor(row.category, 0.48);
                          const contentColor = getLightCategoryTextColor(row.category, 0.68);

                          return (
                            <div
                              key={`mobile-info-${row.label}-${row.category}`}
                              className="flex min-w-0 items-center gap-1.5 whitespace-nowrap"
                            >
                              <button
                                type="button"
                                onClick={() => handleCategoryToggle(row.category)}
                                className="shrink-0 font-semibold transition hover:underline"
                                style={{ color: rowColor }}
                                aria-pressed={isActiveRow}
                                aria-label={`Filter ${activeSeoPlaceLabel} guides by ${row.label}`}
                              >
                                {row.label}
                              </button>
                              <span className="shrink-0" style={{ color: contentColor }}>: </span>
                              <span className="min-w-0 flex-1 truncate" style={{ color: contentColor }}>
                                {row.items.map((item, index) => (
                                  <span key={`mobile-info-highlight-${item.guide.id}-${item.label}`}>
                                    {index > 0 ? <span>, </span> : null}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setIsMobileInfoModalOpen(false);
                                        handleCityHighlightGuideSelect(item.guide);
                                      }}
                                      className="font-medium transition hover:underline"
                                      style={{ color: contentColor }}
                                      title={item.guide.title}
                                    >
                                      {item.label}
                                    </button>
                                  </span>
                                ))}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {!isSavedPlacesRailActive ? (
                <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
                  {isCitySelection ? (
                    rankedCityListItems.length ? (
                    <div className="flex min-h-0 flex-col">
                      <div className="mb-2 shrink-0 flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-700">
                          {cityUsesNestedDistricts && activeLocation.subarea && activeNestedCitySubareas.length
                            ? "Neighborhoods"
                            : cityUsesNestedDistricts
                              ? "Boroughs"
                              : "Neighborhoods"}
                        </p>
                      </div>
                      <div className="space-y-2">
                          {rankedCityListItems.map((item) => {
                            const isSelected = (item.isNested ? selection.nestedSubareaId : selection.subareaId) === item.id;
                            const isDescriptionHovered = hoveredDescriptionNeighborhoodId === item.id;
                            const strengthStars = activeCategory ? item.categoryStrengthStars : 0;

                            return (
                              <button
                                key={`mobile-info-directory-${item.id}`}
                                type="button"
                                title={item.name}
                                className={`group relative flex w-full items-center gap-2 overflow-hidden rounded-2xl border border-transparent px-3 py-2 text-left text-sm transition ${
                                  isSelected || isDescriptionHovered
                                    ? "text-white"
                                    : "border-transparent text-slate-200 hover:text-white"
                                }`}
                                onClick={() => {
                                  setIsMobileInfoModalOpen(false);
                                  if (item.isNested) {
                                    handleSelectNestedSubarea(
                                      activeLocation.continent!.id,
                                      activeLocation.country!.id,
                                      activeLocation.city!.id,
                                      activeLocation.subarea!.id,
                                      item.id,
                                    );
                                    return;
                                  }
                                  handleSelectSubarea(
                                    activeLocation.continent!.id,
                                    activeLocation.country!.id,
                                    activeLocation.city!.id,
                                    item.id,
                                  );
                                }}
                              >
                                {isSelected ? (
                                  <span
                                    className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
                                    aria-hidden="true"
                                  >
                                    <span className="neighborhood-selection-swipe absolute inset-0 rounded-2xl border border-white/80" />
                                  </span>
                                ) : null}
                                <span className="relative h-4 w-4 shrink-0" aria-hidden="true">
                                  <MapPin
                                    className={`absolute inset-0 h-4 w-4 text-red-500 transition-colors ${
                                      isSelected || isDescriptionHovered ? "fill-red-500" : "fill-transparent group-hover:fill-red-500"
                                    }`}
                                  />
                                  <span
                                    className={`absolute left-1/2 top-[4px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#1a1a1a] transition-opacity ${
                                      isSelected || isDescriptionHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                    }`}
                                  />
                                </span>
                                <span className="min-w-0 flex-1 truncate">
                                  {formatBreadcrumbName(item.name)}
                                </span>
                                {strengthStars ? (
                                  <span
                                    className="relative ml-auto flex shrink-0 items-center gap-0.5"
                                    aria-label={`${strengthStars} ${strengthStars === 1 ? "star" : "stars"} for ${activeCategory}`}
                                    title={`${activeCategory} strength: ${strengthStars}/3`}
                                    style={{ color: CATEGORY_STYLES[activeCategory!].mapColor }}
                                  >
                                    {Array.from({ length: strengthStars }).map((_, index) => (
                                      <Star key={`mobile-info-${item.id}-strength-${index}`} className="h-3 w-3 fill-current" />
                                    ))}
                                  </span>
                                ) : null}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                    ) : null
                  ) : activeLocation.country && hasDirectoryChips ? (
                    <div className="space-y-3">
                      {showCountryFilterToggle ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setCountryBrowseView("cities")}
                            className={darkPanePillClass(countryBrowseView === "cities", "xs")}
                          >
                            Cities
                          </button>
                          <button
                            type="button"
                            onClick={() => setCountryBrowseView("regions")}
                            disabled={!activeCountrySubareas.length}
                            className={`${darkPanePillClass(countryBrowseView === "regions", "xs")} ${
                              activeCountrySubareas.length ? "" : "cursor-not-allowed opacity-45"
                            }`}
                          >
                            Regions
                          </button>
                        </div>
                      ) : null}
                      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[rgba(255,255,255,0.48)]">
                        {showCountryFilterToggle
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
                        {showCountryFilterToggle && displayCountryRegions
                          ? activeCountrySubareas.map((subarea) => (
                              <button
                                key={`mobile-info-region-${subarea.id}`}
                                type="button"
                                title={subarea.name}
                                onClick={() => {
                                  setIsMobileInfoModalOpen(false);
                                  handleSelectCountrySubarea(
                                    activeLocation.continent!.id,
                                    activeLocation.country!.id,
                                    subarea.id,
                                  );
                                }}
                                className={darkPanePillClass(selection.subareaId === subarea.id)}
                              >
                                {formatBreadcrumbName(subarea.name)}
                              </button>
                            ))
                          : showCountryFilterToggle
                            ? activeCountryCities.map((city) => (
                                <button
                                  key={`mobile-info-country-city-${city.id}`}
                                  type="button"
                                  onClick={(event) => {
                                    setIsMobileInfoModalOpen(false);
                                    handleSelectCityFromList(
                                      activeLocation.continent!.id,
                                      activeLocation.country!.id,
                                      city.id,
                                      event.currentTarget,
                                    );
                                  }}
                                  className={darkPanePillClass(selection.cityId === city.id)}
                                >
                                  <span data-morph-origin="label" className="inline-block">
                                    {city.name}
                                  </span>
                                </button>
                              ))
                          : showCountrySubareas
                            ? activeCountrySubareas.map((subarea) => (
                                <button
                                  key={`mobile-info-country-subarea-${subarea.id}`}
                                  type="button"
                                  title={subarea.name}
                                  onClick={() => {
                                    setIsMobileInfoModalOpen(false);
                                    handleSelectCountrySubarea(
                                      activeLocation.continent!.id,
                                      activeLocation.country!.id,
                                      subarea.id,
                                    );
                                  }}
                                  className={darkPanePillClass(selection.subareaId === subarea.id)}
                                >
                                  {formatBreadcrumbName(subarea.name)}
                                </button>
                              ))
                            : showCountryStates
                              ? activeCountryStates.map((state) => (
                                  <button
                                    key={`mobile-info-state-${state.id}`}
                                    type="button"
                                    onClick={(event) => {
                                      setIsMobileInfoModalOpen(false);
                                      handleSelectStateFromCountryList(
                                        activeLocation.continent!.id,
                                        activeLocation.country!.id,
                                        state.countrySubareaId,
                                        state.id,
                                        event.currentTarget,
                                      );
                                    }}
                                    className={darkPanePillClass(selection.stateId === state.id)}
                                  >
                                    <span data-morph-origin="label" className="inline-block">
                                      {state.name}
                                    </span>
                                  </button>
                                ))
                              : activeCountryCities.map((city) => (
                                  <button
                                    key={`mobile-info-city-${city.id}`}
                                    type="button"
                                    onClick={(event) => {
                                      setIsMobileInfoModalOpen(false);
                                      handleSelectCityFromList(
                                        activeLocation.continent!.id,
                                        activeLocation.country!.id,
                                        city.id,
                                        event.currentTarget,
                                      );
                                    }}
                                    className={darkPanePillClass(selection.cityId === city.id)}
                                  >
                                    <span data-morph-origin="label" className="inline-block">
                                      {city.name}
                                    </span>
                                  </button>
                                ))}
                      </div>
                    </div>
                  ) : activeLocation.continent ? (
                    <div className="space-y-3">
                      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[rgba(255,255,255,0.48)]">
                        Countries
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {activeLocation.continent.countries
                          .slice()
                          .sort((left, right) => left.name.localeCompare(right.name))
                          .map((country) => (
                            <button
                              key={`mobile-info-country-${country.id}`}
                              type="button"
                              onClick={() => {
                                setIsMobileInfoModalOpen(false);
                                handleSelectCountry(activeLocation.continent!.id, country.id);
                              }}
                              className={darkPanePillClass(selection.countryId === country.id)}
                            >
                              {country.name}
                            </button>
                          ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
      {hoveredLeftPaneDefinition ? (
        <div
          className="pointer-events-none fixed z-[650] hidden w-64 -translate-x-1/2 rounded-[10px] border border-white/18 bg-[#161616] px-3 py-2.5 text-left text-xs leading-5 text-white/80 shadow-[0_18px_42px_rgba(0,0,0,0.34)] ring-1 ring-black/40 lg:block"
          style={{ left: hoveredLeftPaneDefinition.x, top: hoveredLeftPaneDefinition.y }}
          role="tooltip"
        >
          <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Definition
          </p>
          <p className="text-sm font-semibold text-white">
            {hoveredLeftPaneDefinition.term.term}
          </p>
          <p className="mt-1 text-white/80">
            {hoveredLeftPaneDefinition.term.definition}
          </p>
        </div>
      ) : null}
      {mobileLeftPaneDefinition ? (
        <div
          className="fixed inset-0 z-[700] flex items-end bg-black/48 px-3 pb-4 pt-14 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-definition-title"
          onClick={() => setMobileLeftPaneDefinition(null)}
        >
          <div
            className="left-pane-solid left-pane-dark-preview w-full rounded-[18px] border border-white/14 bg-[#161616] p-4 text-white shadow-[0_22px_50px_rgba(0,0,0,0.42)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Definition
                </p>
                <h3 id="mobile-definition-title" className="mt-1 text-lg font-semibold text-white">
                  {mobileLeftPaneDefinition.term}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileLeftPaneDefinition(null)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/12 bg-black/18 text-white/72 shadow-sm transition hover:bg-black/26 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45"
                aria-label="Close definition"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 border-l border-white/18 pl-3 text-sm leading-6 !text-white/80">
              {mobileLeftPaneDefinition.definition}
            </p>
          </div>
        </div>
      ) : null}
      {isProfileCreateModalOpen ? (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Create new entry"
          onClick={() => setIsProfileCreateModalOpen(false)}
        >
          <form
            className="w-full max-w-xl overflow-hidden rounded-xl border border-white/16 bg-[#191919] text-white shadow-2xl ring-1 ring-black/40"
            onClick={(event) => event.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault();
              handleCreateProfileGuide();
            }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  New RGuide
                </p>
                <h2 className="mt-1 text-xl font-semibold text-white">Create entry</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileCreateModalOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/8 text-white/70 transition hover:bg-white/12 hover:text-white"
                aria-label="Close create entry"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[72vh] space-y-5 overflow-y-auto px-5 py-5">
              <label className="block">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/48">
                  Name
                </span>
                <input
                  value={profileCreateName}
                  onChange={(event) => setProfileCreateName(event.target.value)}
                  autoFocus
                  placeholder="Untitled guide"
                  className="mt-2 block w-full rounded-lg border border-white/18 bg-white px-3 py-2.5 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-white focus:bg-white"
                />
              </label>

              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/48">
                  Type
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {profileCreateTypeOptions.map((option) => {
                    const TypeIcon = option.icon;
                    const isActive = profileCreateType === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setProfileCreateType(option.id)}
                        className={`flex h-10 items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition ${
                          isActive
                            ? "border-white bg-white text-slate-950"
                            : "border-white/12 bg-white/8 text-white/70 hover:border-white/24 hover:bg-white/12 hover:text-white"
                        }`}
                      >
                        <TypeIcon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/48">
                  Location
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <label className="block">
                    <span className="sr-only">Continent</span>
                    <select
                      value={profileCreateContinentId}
                      onChange={(event) => {
                        const nextContinent = continents.find((continent) => continent.id === event.target.value) ?? null;
                        const nextCountry = nextContinent?.countries[0] ?? null;
                        const nextCity = nextCountry?.cities.find((city) => !city.isPlaceholderRegion) ?? nextCountry?.cities[0] ?? null;
                        setProfileCreateContinentId(event.target.value);
                        setProfileCreateCountryId(nextCountry?.id ?? "");
                        setProfileCreateCityId(nextCity?.id ?? "");
                        setProfileCreateSubareaId("");
                        setProfileCreateNestedSubareaId("");
                      }}
                      className="w-full rounded-lg border border-white/12 bg-[#242424] px-3 py-2.5 text-sm font-semibold text-white outline-none transition focus:border-white/35"
                    >
                      {continents.map((continent) => (
                        <option key={continent.id} value={continent.id}>
                          {continent.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="sr-only">Country</span>
                    <select
                      value={profileCreateCountryId}
                      onChange={(event) => {
                        const nextCountry = profileCreateContinent?.countries.find((country) => country.id === event.target.value) ?? null;
                        const nextCity = nextCountry?.cities.find((city) => !city.isPlaceholderRegion) ?? nextCountry?.cities[0] ?? null;
                        setProfileCreateCountryId(event.target.value);
                        setProfileCreateCityId(nextCity?.id ?? "");
                        setProfileCreateSubareaId("");
                        setProfileCreateNestedSubareaId("");
                      }}
                      className="w-full rounded-lg border border-white/12 bg-[#242424] px-3 py-2.5 text-sm font-semibold text-white outline-none transition focus:border-white/35"
                    >
                      {(profileCreateContinent?.countries ?? []).map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="sr-only">City</span>
                    <select
                      value={profileCreateCityId}
                      onChange={(event) => {
                        setProfileCreateCityId(event.target.value);
                        setProfileCreateSubareaId("");
                        setProfileCreateNestedSubareaId("");
                      }}
                      className="w-full rounded-lg border border-white/12 bg-[#242424] px-3 py-2.5 text-sm font-semibold text-white outline-none transition focus:border-white/35"
                    >
                      <option value="">Countrywide</option>
                      {(profileCreateCountry?.cities ?? []).filter((city) => !city.isPlaceholderRegion).map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="sr-only">Neighborhood</span>
                    <select
                      value={
                        profileCreateNestedSubarea
                          ? `nested:${profileCreateSubareaId}:${profileCreateNestedSubareaId}`
                          : profileCreateSubarea
                            ? `subarea:${profileCreateSubareaId}`
                            : ""
                      }
                      onChange={(event) => {
                        const [kind, subareaId, nestedSubareaId] = event.target.value.split(":");
                        if (!event.target.value) {
                          setProfileCreateSubareaId("");
                          setProfileCreateNestedSubareaId("");
                          return;
                        }
                        if (kind === "nested") {
                          setProfileCreateSubareaId(subareaId ?? "");
                          setProfileCreateNestedSubareaId(nestedSubareaId ?? "");
                          return;
                        }
                        setProfileCreateSubareaId(subareaId ?? "");
                        setProfileCreateNestedSubareaId("");
                      }}
                      disabled={!profileCreateNeighborhoodOptions.length}
                      className="w-full rounded-lg border border-white/12 bg-[#242424] px-3 py-2.5 text-sm font-semibold text-white outline-none transition disabled:opacity-45 focus:border-white/35"
                    >
                      <option value="">All neighborhoods</option>
                      {profileCreateNeighborhoodOptions.map((neighborhoodOption) => (
                        <option key={neighborhoodOption.id} value={neighborhoodOption.id}>
                          {neighborhoodOption.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/48">
                  Category
                </p>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {categoryOptions.map((option) => {
                    const isActive = profileCreateCategory === option.category;
                    return (
                      <button
                        key={`create-category-${option.category}`}
                        type="button"
                        onClick={() => setProfileCreateCategory(option.category)}
                        className={`category-icon-button flex h-10 items-center justify-center rounded-lg border border-transparent ${
                          isActive ? "category-icon-button-active shadow-sm" : "bg-white/8 text-slate-950 hover:bg-white/12 hover:text-slate-950"
                        }`}
                        style={{
                          "--category-color": CATEGORY_STYLES[option.category].mapColor,
                        } as React.CSSProperties}
                        aria-label={getCategoryLabel(option.category)}
                        title={getCategoryLabel(option.category)}
                      >
                        <option.icon className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-4">
              <p className="min-w-0 truncate text-xs font-medium text-white/45">
                {[profileCreateCountry?.name, profileCreateCity?.name, profileCreateNestedSubarea?.name ?? profileCreateSubarea?.name]
                  .filter(Boolean)
                  .join(" / ")}
              </p>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsProfileCreateModalOpen(false)}
                  className="rounded-lg border border-white/12 bg-white/8 px-3 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/12 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg border border-white bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
