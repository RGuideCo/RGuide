"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ChevronRight, GripVertical, Navigation, Pencil, Trash2, X } from "lucide-react";

import { continents } from "@/data";
import { CATEGORIES, CATEGORY_STYLES } from "@/lib/constants";
import { getListHref } from "@/lib/routes";
import { slugify } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { MapList, SelectionState, SubmissionType } from "@/types";

const urlPattern = /^https:\/\/((www\.)?google\.[a-z.]+\/maps|maps\.app\.goo\.gl)/i;
const DRAFT_PLACE_SEARCH_TARGET = "__draft-location__";
const DRAFT_NESTED_PLACE_PARENT_ID = "__draft-poi-parent__";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function textMatches(input: string, candidate: string) {
  const left = normalizeText(input);
  const right = normalizeText(candidate);
  if (!left || !right) return false;
  return left.includes(right) || right.includes(left);
}

function getAlphaMarker(index: number) {
  return String.fromCharCode(65 + (index % 26));
}

function decodeMapsToken(value: string) {
  return decodeURIComponent(value.replace(/\+/g, " ")).trim();
}

function extractGoogleMapsAutofill(rawUrl: string) {
  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.toLowerCase();
    const isGoogleMapsHost =
      host === "maps.app.goo.gl" ||
      (host.includes("google.") && parsed.pathname.toLowerCase().includes("/maps"));

    if (!isGoogleMapsHost) {
      return null;
    }

    const candidates: string[] = [];
    const searchKeys = ["q", "query", "destination", "daddr", "near", "ll"];
    for (const key of searchKeys) {
      const value = parsed.searchParams.get(key);
      if (value) {
        candidates.push(decodeMapsToken(value));
      }
    }

    const placeMatch = parsed.pathname.match(/\/place\/([^/]+)/i);
    if (placeMatch?.[1]) {
      candidates.push(decodeMapsToken(placeMatch[1]));
    }

    const rawLocation = candidates.find(Boolean) ?? "";
    if (!rawLocation) {
      return {
        title: "",
        locationText: "",
      };
    }

    const title = rawLocation
      .split(",")[0]
      .replace(/\s{2,}/g, " ")
      .trim();

    return {
      title,
      locationText: rawLocation,
    };
  } catch {
    return null;
  }
}

function inferLocationIds(locationText: string) {
  if (!locationText) {
    return null;
  }

  const normalizedLocation = normalizeText(locationText);
  const cityFromAnyCountry =
    continents
      .flatMap((continent) => continent.countries)
      .flatMap((country) => country.cities.map((city) => ({ city, country })))
      .find(({ city }) => textMatches(normalizedLocation, city.name)) ?? null;
  const byContinent = continents.find((continent) =>
    textMatches(normalizedLocation, continent.name),
  );
  const continentCandidate = byContinent ?? null;
  const countryCandidate =
    continentCandidate?.countries.find((country) =>
      textMatches(normalizedLocation, country.name),
    ) ??
    continents.flatMap((continent) => continent.countries).find((country) =>
      textMatches(normalizedLocation, country.name),
    ) ??
    cityFromAnyCountry?.country ??
    null;
  const countrySubareaCandidate =
    countryCandidate?.subareas?.find((subarea) =>
      textMatches(normalizedLocation, subarea.name),
    ) ?? null;
  const cityCandidate =
    countryCandidate?.cities.find((city) =>
      textMatches(normalizedLocation, city.name) &&
      (!countrySubareaCandidate || city.countrySubareaId === countrySubareaCandidate.id),
    ) ??
    cityFromAnyCountry?.city ??
    null;

  if (!countryCandidate) {
    return null;
  }

  const matchedContinent =
    continents.find((continent) => continent.id === countryCandidate.continent) ??
    continents.find((continent) =>
      continent.countries.some((country) => country.id === countryCandidate.id),
    ) ??
    continentCandidate;

  if (!matchedContinent) {
    return null;
  }

  return {
    continentId: matchedContinent.id,
    countryId: countryCandidate.id,
    regionId: countrySubareaCandidate?.id ?? cityCandidate?.countrySubareaId ?? "",
    cityId:
      cityCandidate?.country === countryCandidate.name
      ? cityCandidate.id
      : "",
    continentName: matchedContinent.name,
    countryName: countryCandidate.name,
    cityName: cityCandidate?.name,
    coordinates: cityCandidate?.coordinates,
  };
}

interface SubmitListFormProps {
  onSelectionChange?: (selection: SelectionState) => void;
  onSubmitted?: (list: MapList) => void;
  onPreviewListChange?: (list: MapList | null) => void;
  mapPinnedLocation?: { id: number; coordinates: [number, number] } | null;
  editListId?: string | null;
  submissionType?: SubmissionType;
  guideSubmissionVariant?: GuideSubmissionVariant;
  onSubmissionModeChange?: (
    submissionType: SubmissionType,
    guideSubmissionVariant: GuideSubmissionVariant,
  ) => void;
  hideModeToggle?: boolean;
  fillPane?: boolean;
  onClose?: () => void;
}

interface GeoapifySuggestion {
  id: string;
  label: string;
  helperText: string;
  city?: string;
  state?: string;
  country?: string;
  coordinates?: [number, number];
}

interface ManualGuideLocation {
  id: string;
  name: string;
  context: string;
  description: string;
  country?: string;
  continent?: string;
  coordinates?: [number, number];
  places?: ManualGuideLocation[];
}

interface DraftManualLocation {
  name: string;
  context: string;
  country?: string;
  continent?: string;
  coordinates?: [number, number];
  places?: ManualGuideLocation[];
}

type GuideSubmissionVariant = "guide" | "itinerary";
type PreviewGuideStop = {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  places: ManualGuideLocation[] | undefined;
  rank: number;
};

export function SubmitListForm({
  onSelectionChange,
  onSubmitted,
  onPreviewListChange,
  mapPinnedLocation,
  editListId: controlledEditListId = null,
  submissionType: controlledSubmissionType,
  guideSubmissionVariant: controlledGuideSubmissionVariant,
  onSubmissionModeChange,
  hideModeToggle = false,
  fillPane = false,
  onClose,
}: SubmitListFormProps) {
  const geoapifyApiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
  const searchParams = useSearchParams();
  const { currentUser, submittedLists, submitList, updateSubmittedList, deleteSubmittedList, openAuthModal } = useAppStore();
  const [submissionType, setSubmissionType] = useState<SubmissionType>("guide");
  const [guideSubmissionVariant, setGuideSubmissionVariant] = useState<GuideSubmissionVariant>("guide");
  const [guideInputMode, setGuideInputMode] = useState<"manual" | "google">("manual");
  const [continentId, setContinentId] = useState("");
  const [countryId, setCountryId] = useState("");
  const [regionId, setRegionId] = useState("");
  const [cityId, setCityId] = useState("");
  const [neighborhoodId, setNeighborhoodId] = useState("");
  const [regionStepCompleted, setRegionStepCompleted] = useState(false);
  const [cityStepCompleted, setCityStepCompleted] = useState(false);
  const [neighborhoodStepCompleted, setNeighborhoodStepCompleted] = useState(false);
  const [animatedStepTitle, setAnimatedStepTitle] = useState("Continent");
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<GeoapifySuggestion[]>([]);
  const [isLocationSearching, setIsLocationSearching] = useState(false);
  const [showPlaceSearch, setShowPlaceSearch] = useState(false);
  const [placeSearchTargetId, setPlaceSearchTargetId] = useState<string | null>(null);
  const [placeSearch, setPlaceSearch] = useState("");
  const [placeSuggestions, setPlaceSuggestions] = useState<GeoapifySuggestion[]>([]);
  const [isPlaceSearching, setIsPlaceSearching] = useState(false);
  const [manualGuideLocations, setManualGuideLocations] = useState<ManualGuideLocation[]>([]);
  const [expandedManualLocationIds, setExpandedManualLocationIds] = useState<string[]>([]);
  const [expandedNestedPlaceIds, setExpandedNestedPlaceIds] = useState<string[]>([]);
  const [draggingManualLocationId, setDraggingManualLocationId] = useState<string | null>(null);
  const [dragOverManualLocationId, setDragOverManualLocationId] = useState<string | null>(null);
  const [draggingNestedPlace, setDraggingNestedPlace] = useState<{
    parentId: string;
    placeId: string;
  } | null>(null);
  const [dragOverNestedPlaceId, setDragOverNestedPlaceId] = useState<string | null>(null);
  const [editingManualLocationId, setEditingManualLocationId] = useState<string | null>(null);
  const [editingManualLocationDescription, setEditingManualLocationDescription] = useState("");
  const [closingManualLocationEditId, setClosingManualLocationEditId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<null | {
    kind: "guide" | "entry";
    id?: string;
    name: string;
  }>(null);
  const [draftManualLocation, setDraftManualLocation] = useState<DraftManualLocation | null>(null);
  const [draftManualDescription, setDraftManualDescription] = useState("");
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [lastSubmittedList, setLastSubmittedList] = useState<MapList | null>(null);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionApplied, setDescriptionApplied] = useState(false);
  const [journalNote, setJournalNote] = useState("");
  const [visitedAt, setVisitedAt] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [message, setMessage] = useState<string | null>(null);
  const [appliedAddQueryKey, setAppliedAddQueryKey] = useState<string | null>(null);
  const manualLocationRowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const previousManualLocationRectsRef = useRef<Record<string, DOMRect>>({});
  const resetFormState = () => {
    setEditingListId(null);
    setUrl("");
    setTitle("");
    setDescription("");
    setDescriptionApplied(false);
    setJournalNote("");
    setVisitedAt("");
    setContinentId("");
    setCountryId("");
    setRegionId("");
    setCityId("");
    setNeighborhoodId("");
    setRegionStepCompleted(false);
    setCityStepCompleted(false);
    setNeighborhoodStepCompleted(false);
    setShowLocationSearch(false);
    setLocationSearch("");
    setLocationSuggestions([]);
    setManualGuideLocations([]);
    setExpandedManualLocationIds([]);
    setExpandedNestedPlaceIds([]);
    setDraggingManualLocationId(null);
    setDragOverManualLocationId(null);
    setDraggingNestedPlace(null);
    setDragOverNestedPlaceId(null);
    setEditingManualLocationId(null);
    setEditingManualLocationDescription("");
    setDraftManualLocation(null);
    setDraftManualDescription("");
    setCategory(CATEGORIES[0]);
    setGuideInputMode("manual");
  };

  const selectedContinent = useMemo(
    () => continents.find((continent) => continent.id === continentId),
    [continentId],
  );
  const selectedCountry = useMemo(
    () => selectedContinent?.countries.find((country) => country.id === countryId),
    [countryId, selectedContinent],
  );
  const selectedCity = useMemo(
    () => selectedCountry?.cities.find((city) => city.id === cityId),
    [cityId, selectedCountry],
  );
  const selectedRegion = useMemo(
    () =>
      selectedCountry?.subareas?.find(
        (subarea) => (subarea.id ? String(subarea.id) : subarea.name) === regionId,
      ),
    [regionId, selectedCountry],
  );
  const selectableCities = useMemo(
    () => (selectedCountry?.cities ?? []).filter((city) => !city.isPlaceholderRegion),
    [selectedCountry],
  );
  const selectedNeighborhood = useMemo(
    () => selectedCity?.subareas?.find((subarea) => subarea.id === neighborhoodId),
    [neighborhoodId, selectedCity],
  );
  const activePlaceSearchLocation = useMemo(() => {
    if (placeSearchTargetId === DRAFT_PLACE_SEARCH_TARGET) {
      return draftManualLocation;
    }
    return manualGuideLocations.find((location) => location.id === placeSearchTargetId) ?? null;
  }, [draftManualLocation, manualGuideLocations, placeSearchTargetId]);
  const shouldShowPlaceSuggestionsPanel = Boolean(
    !geoapifyApiKey ||
      isPlaceSearching ||
      placeSuggestions.length > 0 ||
      (placeSearch.trim().length >= 2 && !isPlaceSearching),
  );
  const regionSelectionValue = regionStepCompleted
    ? (regionId || "__none__")
    : "__unselected__";
  const citySelectionValue = cityStepCompleted
    ? (cityId || "__none__")
    : "__unselected__";
  const neighborhoodSelectionValue = neighborhoodStepCompleted
    ? (neighborhoodId || "__none__")
    : "__unselected__";
  const canShowDetailsStep = Boolean(
    continentId &&
      countryId &&
      regionStepCompleted &&
      cityStepCompleted &&
      (!cityId || neighborhoodStepCompleted),
  );
  const isEditingExistingGuide = Boolean(editingListId);
  const hasTitleStep = isEditingExistingGuide || Boolean(title.trim());
  const canShowPostDescriptionStep =
    isEditingExistingGuide || (Boolean(description.trim()) && descriptionApplied);
  const currentStepTitle = !continentId
    ? "Continent"
    : !countryId
      ? "Country"
      : !regionStepCompleted
        ? "Region"
        : !cityStepCompleted
          ? "City"
          : cityId && !neighborhoodStepCompleted
            ? "Neighborhood"
            : "Description";
  const dropdownClassName = "h-12 w-full rounded-2xl border border-slate-200 px-4";
  const previewStops = useMemo(() => {
    const fallbackCoordinates = selectedCity?.coordinates ?? null;
    const committedStops = manualGuideLocations
      .map((location, index) => {
        const coordinates = location.coordinates ?? fallbackCoordinates;
        if (!coordinates) {
          return null;
        }
        return {
          id: `preview-stop-${location.id}`,
          name: location.name,
          coordinates,
          description: location.description.trim() || `${location.name} stop`,
          places: location.places,
          rank: index + 1,
        };
      })
      .filter((stop): stop is PreviewGuideStop => Boolean(stop));
    if (draftManualLocation) {
      const draftCoordinates = draftManualLocation.coordinates ?? fallbackCoordinates;
      if (!draftCoordinates) {
        return committedStops;
      }
      committedStops.push({
        id: "preview-stop-draft",
        name: draftManualLocation.name,
        coordinates: draftCoordinates,
        description: draftManualDescription.trim() || `${draftManualLocation.name} stop`,
        places: draftManualLocation.places,
        rank: committedStops.length + 1,
      });
    }
    return committedStops;
  }, [draftManualDescription, draftManualLocation, manualGuideLocations, selectedCity?.coordinates]);

  useEffect(() => {
    let tick: ReturnType<typeof setTimeout> | null = null;
    let startDelay: ReturnType<typeof setTimeout> | null = null;
    setAnimatedStepTitle("");
    let index = 0;
    startDelay = setTimeout(() => {
      const write = () => {
        index += 1;
        setAnimatedStepTitle(currentStepTitle.slice(0, index));
        if (index < currentStepTitle.length) {
          tick = setTimeout(write, 18);
        }
      };
      write();
    }, 90);
    return () => {
      if (tick) clearTimeout(tick);
      if (startDelay) clearTimeout(startDelay);
    };
  }, [currentStepTitle]);
  const locationTrail = useMemo(() => {
    const trail: Array<{
      id: "continent" | "country" | "region" | "city" | "neighborhood";
      label: string;
    }> = [];
    if (selectedContinent?.name) {
      trail.push({ id: "continent", label: selectedContinent.name });
    }
    if (selectedCountry?.name) {
      trail.push({ id: "country", label: selectedCountry.name });
    }
    if (selectedRegion?.name) {
      trail.push({ id: "region", label: selectedRegion.name });
    }
    if (selectedCity?.name) {
      trail.push({ id: "city", label: selectedCity.name });
    }
    if (selectedNeighborhood?.name) {
      trail.push({ id: "neighborhood", label: selectedNeighborhood.name });
    }
    return trail;
  }, [
    selectedCity?.name,
    selectedContinent?.name,
    selectedCountry?.name,
    selectedNeighborhood?.name,
    selectedRegion?.name,
  ]);
  const handleEditLocationStep = (
    step: "continent" | "country" | "region" | "city" | "neighborhood",
  ) => {
    if (step === "continent") {
      setContinentId("");
      setCountryId("");
      setRegionId("");
      setCityId("");
      setNeighborhoodId("");
      setRegionStepCompleted(false);
      setCityStepCompleted(false);
      setNeighborhoodStepCompleted(false);
      return;
    }
    if (step === "country") {
      setCountryId("");
      setRegionId("");
      setCityId("");
      setNeighborhoodId("");
      setRegionStepCompleted(false);
      setCityStepCompleted(false);
      setNeighborhoodStepCompleted(false);
      return;
    }
    if (step === "region") {
      setRegionId("");
      setCityId("");
      setNeighborhoodId("");
      setRegionStepCompleted(false);
      setCityStepCompleted(false);
      setNeighborhoodStepCompleted(false);
      return;
    }
    if (step === "city") {
      setCityId("");
      setNeighborhoodId("");
      setCityStepCompleted(false);
      setNeighborhoodStepCompleted(false);
      return;
    }
    setNeighborhoodId("");
    setNeighborhoodStepCompleted(false);
  };

  useEffect(() => {
    onSelectionChange?.({
      continentId: continentId || undefined,
      countryId: countryId || undefined,
      countrySubareaId: regionId || undefined,
      cityId: cityId || undefined,
      subareaId: neighborhoodId || undefined,
    });
  }, [cityId, continentId, countryId, neighborhoodId, onSelectionChange, regionId]);

  const activeSubmissionType = controlledSubmissionType ?? submissionType;
  const activeGuideSubmissionVariant = controlledGuideSubmissionVariant ?? guideSubmissionVariant;
  const setSubmissionMode = (
    nextSubmissionType: SubmissionType,
    nextGuideSubmissionVariant: GuideSubmissionVariant,
  ) => {
    if (controlledSubmissionType === undefined) {
      setSubmissionType(nextSubmissionType);
    }
    if (controlledGuideSubmissionVariant === undefined) {
      setGuideSubmissionVariant(nextGuideSubmissionVariant);
    }
    onSubmissionModeChange?.(nextSubmissionType, nextGuideSubmissionVariant);
  };
  const isUrlValid = !url || urlPattern.test(url);
  const isGuideSubmission = activeSubmissionType === "guide";
  const isExperienceSubmission = activeSubmissionType === "journal";
  const isGuideStyleSubmission = isGuideSubmission || isExperienceSubmission;
  const isItinerarySubmission = isGuideSubmission && activeGuideSubmissionVariant === "itinerary";
  const submissionNoun = isItinerarySubmission
    ? "itinerary"
    : isExperienceSubmission
      ? "experience"
      : "guide";
  const categoryStyle = CATEGORY_STYLES[category];
  const formTitle = title.trim() || (editingListId ? `Edit ${submissionNoun}` : `New ${submissionNoun}`);
  const formSubtitle = editingListId ? `Editing ${submissionNoun}` : `Create ${submissionNoun}`;

  useEffect(() => {
    if (!onPreviewListChange) {
      return;
    }
    if (!isGuideStyleSubmission || guideInputMode !== "manual" || previewStops.length === 0) {
      onPreviewListChange(null);
      return;
    }

    const fallbackCountry = selectedCountry?.name ?? selectedContinent?.name ?? "Global";
    const fallbackContinent = selectedContinent?.name ?? "Global";
    const previewList: MapList = {
      id: "draft-submit-preview",
      slug: "draft-submit-preview",
      title: title.trim() || `Draft ${submissionNoun}`,
      description: description.trim() || `Draft ${submissionNoun} in progress.`,
      url: "https://www.google.com/maps",
      category,
      submissionType: activeSubmissionType,
      location: {
        scope: selectedCity?.name ? "city" : selectedCountry?.name ? "country" : "continent",
        continent: fallbackContinent,
        country: fallbackCountry,
        city: selectedCity?.name,
        neighborhood: selectedNeighborhood?.name ?? (!selectedCity ? selectedRegion?.name : undefined),
      },
      creator: {
        id: currentUser?.id ?? "draft-user",
        name: currentUser?.name ?? "You",
        avatar: currentUser?.avatar ?? "",
      },
      upvotes: 0,
      createdAt: "1970-01-01T00:00:00.000Z",
      stops: previewStops.map((stop) => ({
        id: stop.id,
        name: stop.name,
        coordinates: stop.coordinates,
        description: stop.description,
        places: stop.places?.map((place, placeIndex) => ({
          id: `preview-place-${place.id}-${placeIndex}`,
          name: place.name.trim() || `Place ${placeIndex + 1}`,
          coordinates: place.coordinates ?? stop.coordinates,
          description: place.description.trim() || `${place.name || `Place ${placeIndex + 1}`} stop`,
        })),
      })),
    };

    onPreviewListChange(previewList);
  }, [
    activeSubmissionType,
    category,
    currentUser?.avatar,
    currentUser?.id,
    currentUser?.name,
    description,
    guideInputMode,
    isGuideStyleSubmission,
    onPreviewListChange,
    previewStops,
    selectedCity,
    selectedContinent?.name,
    selectedCountry?.name,
    selectedNeighborhood?.name,
    selectedRegion?.name,
    submissionNoun,
    title,
  ]);

  useEffect(() => {
    if (!mapPinnedLocation || !isGuideStyleSubmission || guideInputMode !== "manual") {
      return;
    }

    const locationName = `Dropped pin ${manualGuideLocations.length + 1}`;
    const context = [
      selectedCity?.name,
      selectedRegion?.name,
      selectedCountry?.name,
      selectedContinent?.name,
    ]
      .filter((part): part is string => Boolean(part))
      .filter((part, index, all) => all.indexOf(part) === index)
      .join(" • ");

    setDraftManualLocation({
      name: locationName,
      context,
      country: selectedCountry?.name,
      continent: selectedContinent?.name,
      coordinates: mapPinnedLocation.coordinates,
    });
    setDraftManualDescription("");
    setShowLocationSearch(false);
    setLocationSuggestions([]);
    setLocationSearch(locationName);
    setMessage(`${locationName} selected from the map. Add a description and submit it.`);
  }, [
    guideInputMode,
    isGuideStyleSubmission,
    manualGuideLocations.length,
    mapPinnedLocation,
    selectedCity?.name,
    selectedContinent?.name,
    selectedCountry?.name,
    selectedRegion?.name,
  ]);

  useEffect(() => {
    const mode = searchParams.get("type");
    if (mode === "journal") {
      setSubmissionMode("journal", "guide");
      setGuideInputMode("manual");
      return;
    }
    if (mode === "itinerary") {
      setSubmissionMode("guide", "itinerary");
      setGuideInputMode("manual");
      return;
    }
    if (mode === "guide") {
      setSubmissionMode("guide", "guide");
    }
  }, [searchParams]);

  useEffect(() => {
    if (isItinerarySubmission) {
      setGuideInputMode("manual");
    }
  }, [isItinerarySubmission]);
  useEffect(() => {
    if (
      (activeSubmissionType === "guide" || activeSubmissionType === "journal") &&
      activeGuideSubmissionVariant === "guide"
    ) {
      setGuideInputMode("manual");
    }
  }, [activeGuideSubmissionVariant, activeSubmissionType]);
  useEffect(() => {
    const addName = searchParams.get("add_name")?.trim() ?? "";
    if (!addName) {
      return;
    }
    const addCountry = searchParams.get("add_country")?.trim() ?? "";
    const addContinent = searchParams.get("add_continent")?.trim() ?? "";
    const addLatRaw = searchParams.get("add_lat");
    const addLngRaw = searchParams.get("add_lng");
    const addLat = addLatRaw ? Number(addLatRaw) : NaN;
    const addLng = addLngRaw ? Number(addLngRaw) : NaN;
    const queryKey = [addName, addCountry, addContinent, addLatRaw ?? "", addLngRaw ?? ""].join("|");
    if (appliedAddQueryKey === queryKey) {
      return;
    }

    const queryType = searchParams.get("type");
    const modeFromQuery = queryType === "journal" ? "journal" : queryType === "itinerary" ? "itinerary" : "guide";
    if (modeFromQuery === "journal" || modeFromQuery === "guide" || modeFromQuery === "itinerary") {
      if (modeFromQuery === "journal") {
        setSubmissionMode("journal", "guide");
      } else {
        setSubmissionMode("guide", modeFromQuery === "itinerary" ? "itinerary" : "guide");
      }
      setGuideInputMode("manual");
      setManualGuideLocations((current) => {
        const alreadyExists = current.some((location) => location.name === addName);
        if (alreadyExists) {
          return current;
        }
        return [
          ...current,
          {
            id: `manual-location-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name: addName,
            context: [addCountry, addContinent].filter(Boolean).join(" • "),
            description: "",
            country: addCountry || undefined,
            continent: addContinent || undefined,
            coordinates:
              Number.isFinite(addLat) && Number.isFinite(addLng)
                ? [addLat, addLng]
                : undefined,
          },
        ];
      });
      if (!title.trim()) {
        setTitle(
          `${addName} ${
            modeFromQuery === "itinerary" ? "Itinerary" : modeFromQuery === "journal" ? "Experience" : "Guide"
          }`,
        );
      }
      setMessage(
        `${addName} added to this ${
          modeFromQuery === "itinerary" ? "itinerary" : modeFromQuery === "journal" ? "experience" : "guide"
        }.`,
      );
    }
    setAppliedAddQueryKey(queryKey);
  }, [appliedAddQueryKey, description, searchParams, title]);

  useEffect(() => {
    const query = locationSearch.trim();
    if (!showLocationSearch || !geoapifyApiKey || query.length < 2) {
      setLocationSuggestions([]);
      setIsLocationSearching(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setIsLocationSearching(true);
      try {
        const endpoint = new URL("https://api.geoapify.com/v1/geocode/autocomplete");
        endpoint.searchParams.set("text", query);
        endpoint.searchParams.set("format", "json");
        endpoint.searchParams.set("limit", "6");
        endpoint.searchParams.set("apiKey", geoapifyApiKey);

        const response = await fetch(endpoint.toString(), { signal: controller.signal });
        if (!response.ok) {
          throw new Error("Geoapify request failed");
        }
        const payload = (await response.json()) as {
          results?: Array<{
            place_id?: string;
            formatted?: string;
            city?: string;
            state?: string;
            country?: string;
            lat?: number;
            lon?: number;
          }>;
        };

        const suggestions = (payload.results ?? [])
          .map((result) => {
            const label = result.formatted?.trim();
            if (!label) return null;
            const helperParts = [result.city, result.state, result.country].filter(Boolean);
            return {
              id: result.place_id ?? label,
              label,
              helperText: helperParts.join(" • "),
              city: result.city,
              state: result.state,
              country: result.country,
              coordinates:
                typeof result.lat === "number" && typeof result.lon === "number"
                  ? [result.lat, result.lon]
                  : undefined,
            } as GeoapifySuggestion;
          })
          .filter((item): item is GeoapifySuggestion => Boolean(item));

        setLocationSuggestions(suggestions);
      } catch {
        setLocationSuggestions([]);
      } finally {
        setIsLocationSearching(false);
      }
    }, 220);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [geoapifyApiKey, locationSearch, showLocationSearch]);

  useEffect(() => {
    const query = placeSearch.trim();
    if (!placeSearchTargetId || !activePlaceSearchLocation || !geoapifyApiKey || query.length < 2) {
      setPlaceSuggestions([]);
      setIsPlaceSearching(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setIsPlaceSearching(true);
      try {
        const endpoint = new URL("https://api.geoapify.com/v1/geocode/autocomplete");
        endpoint.searchParams.set("text", query);
        endpoint.searchParams.set("format", "json");
        endpoint.searchParams.set("limit", "6");
        endpoint.searchParams.set("apiKey", geoapifyApiKey);

        const response = await fetch(endpoint.toString(), { signal: controller.signal });
        if (!response.ok) {
          throw new Error("Geoapify request failed");
        }
        const payload = (await response.json()) as {
          results?: Array<{
            place_id?: string;
            formatted?: string;
            city?: string;
            state?: string;
            country?: string;
            lat?: number;
            lon?: number;
          }>;
        };

        const suggestions = (payload.results ?? [])
          .map((result) => {
            const label = result.formatted?.trim();
            if (!label) return null;
            const helperParts = [result.city, result.state, result.country].filter(Boolean);
            return {
              id: result.place_id ?? label,
              label,
              helperText: helperParts.join(" • "),
              city: result.city,
              state: result.state,
              country: result.country,
              coordinates:
                typeof result.lat === "number" && typeof result.lon === "number"
                  ? [result.lat, result.lon]
                  : undefined,
            } as GeoapifySuggestion;
          })
          .filter((item): item is GeoapifySuggestion => Boolean(item));

        setPlaceSuggestions(suggestions);
      } catch {
        setPlaceSuggestions([]);
      } finally {
        setIsPlaceSearching(false);
      }
    }, 220);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [activePlaceSearchLocation, geoapifyApiKey, placeSearch, placeSearchTargetId]);

  const handleAutofillFromLink = () => {
    if (!url.trim()) {
      setMessage("Paste a Google Maps URL first, then click autofill.");
      return;
    }

    const extracted = extractGoogleMapsAutofill(url.trim());
    if (!extracted) {
      setMessage("That link is not recognized as a Google Maps URL.");
      return;
    }

    if (extracted.title) {
      setTitle(extracted.title);
      if (!description.trim()) {
        setDescription(
          isExperienceSubmission
            ? `Experience inspired by ${extracted.title}.`
            : `${isItinerarySubmission ? "Itinerary" : "Guide"} inspired by ${extracted.title}.`,
        );
      }
    }

    if (extracted.locationText) {
      const inferred = inferLocationIds(extracted.locationText);
      if (inferred) {
        setContinentId(inferred.continentId);
        setCountryId(inferred.countryId);
        setRegionId(inferred.regionId ?? "");
        if (inferred.cityId) {
          setCityId(inferred.cityId);
        }
      }
    }

    setMessage(
      extracted.title || extracted.locationText
        ? "Autofill applied from link."
        : "Link saved. No metadata found in URL, so fill details manually.",
    );
  };

  const handleApplyLocationSearch = (
    queryOverride?: string,
    suggestionOverride?: GeoapifySuggestion,
  ) => {
    const query = (queryOverride ?? suggestionOverride?.label ?? locationSearch).trim();
    if (!query) {
      setMessage("Type a location to search.");
      return;
    }
    const inferred = inferLocationIds(query);
    const allowSuggestionDirectAdd =
      Boolean(suggestionOverride) && isGuideStyleSubmission && guideInputMode === "manual";
    if (!inferred && !allowSuggestionDirectAdd) {
      setMessage("No matching location found. Try city, country, or continent.");
      return;
    }

    if (isGuideStyleSubmission && guideInputMode === "manual") {
      const locationName = suggestionOverride?.label.split(",")[0]?.trim() || query;
      const locationCountry = suggestionOverride?.country ?? inferred?.countryName ?? selectedCountry?.name;
      const locationContinent = inferred?.continentName ?? selectedContinent?.name;
      const rawContextParts = suggestionOverride
        ? [suggestionOverride.city, suggestionOverride.state, suggestionOverride.country, locationContinent]
        : [locationCountry, locationContinent];
      const context = rawContextParts
        .map((part) => part?.trim())
        .filter((part): part is string => Boolean(part))
        .filter((part, index, all) => all.findIndex((item) => normalizeText(item) === normalizeText(part)) === index)
        .filter((part) => normalizeText(part) !== normalizeText(locationName))
        .filter((part) => normalizeText(part) !== normalizeText(selectedCountry?.name ?? ""))
        .filter((part) => normalizeText(part) !== normalizeText(selectedContinent?.name ?? ""))
        .join(" • ");

      setDraftManualLocation({
        name: locationName,
        context,
        country: locationCountry,
        continent: locationContinent,
        coordinates: suggestionOverride?.coordinates ?? inferred?.coordinates,
      });
      setDraftManualDescription("");
      setLocationSearch(locationName);
      setLocationSuggestions([]);
      setShowLocationSearch(false);
      setMessage(`Selected ${locationName}. Add a description and submit it.`);
      return;
    }

    if (!inferred) {
      setMessage("No matching location found. Try city, country, or continent.");
      return;
    }

    setContinentId(inferred.continentId);
    setCountryId(inferred.countryId);
    setRegionId(inferred.regionId ?? "");
    setCityId(inferred.cityId ?? "");
    setNeighborhoodId("");
    setRegionStepCompleted(true);
    setCityStepCompleted(Boolean(inferred.cityId));
    setNeighborhoodStepCompleted(false);
    setLocationSearch(query);
    setShowLocationSearch(false);
    setLocationSuggestions([]);
    setMessage("Location applied.");
  };

  const handleSubmitDraftManualLocation = () => {
    if (!draftManualLocation) {
      setMessage("Pick a location first.");
      return;
    }
    if (!draftManualLocation.name.trim()) {
      setMessage("Name this location first.");
      return;
    }
    if (!draftManualDescription.trim()) {
      setMessage("Add a description for this location first.");
      return;
    }
    const nextId = `manual-location-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setManualGuideLocations((current) => [
      ...current,
      {
        id: nextId,
        name: draftManualLocation.name.trim(),
        context: draftManualLocation.context,
        description: draftManualDescription.trim(),
        country: draftManualLocation.country,
        continent: draftManualLocation.continent,
        coordinates: draftManualLocation.coordinates,
        places: draftManualLocation.places?.filter((place) => place.name.trim() || place.description.trim()),
      },
    ]);
    setExpandedManualLocationIds((current) => [...current, nextId]);
    setMessage(`${draftManualLocation.name} added to this ${submissionNoun}.`);
    setDraftManualLocation(null);
    setDraftManualDescription("");
    setLocationSearch("");
    setLocationSuggestions([]);
    setShowPlaceSearch(false);
    setPlaceSearchTargetId(null);
    setPlaceSearch("");
    setPlaceSuggestions([]);
  };
  const handleApplyPlaceSearch = (
    queryOverride?: string,
    suggestionOverride?: GeoapifySuggestion,
  ) => {
    const parentLocation = activePlaceSearchLocation;
    if (!parentLocation || !placeSearchTargetId) {
      setMessage("Pick a location before adding a place.");
      return;
    }
    const query = (queryOverride ?? suggestionOverride?.label ?? placeSearch).trim();
    if (!query) {
      setMessage("Type a place to search.");
      return;
    }
    const inferred = inferLocationIds(query);
    const placeName = suggestionOverride?.label.split(",")[0]?.trim() || query;
    const placeCountry = suggestionOverride?.country ?? inferred?.countryName ?? parentLocation.country;
    const placeContinent = inferred?.continentName ?? parentLocation.continent;
    const rawContextParts = suggestionOverride
      ? [suggestionOverride.city, suggestionOverride.state, suggestionOverride.country, parentLocation.name]
      : [parentLocation.name, placeCountry, placeContinent];
    const context = rawContextParts
      .map((part) => part?.trim())
      .filter((part): part is string => Boolean(part))
      .filter((part, index, all) => all.findIndex((item) => normalizeText(item) === normalizeText(part)) === index)
      .filter((part) => normalizeText(part) !== normalizeText(placeName))
      .join(" • ");
    const nextPlace: ManualGuideLocation = {
      id: `nested-place-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: placeName,
      context,
      description: "",
      country: placeCountry,
      continent: placeContinent,
      coordinates: suggestionOverride?.coordinates ?? inferred?.coordinates ?? parentLocation.coordinates,
    };
    setPlaceSearch("");
    setPlaceSuggestions([]);
    setShowPlaceSearch(false);
    setPlaceSearchTargetId(null);
    if (placeSearchTargetId === DRAFT_PLACE_SEARCH_TARGET) {
      setDraftManualLocation((current) =>
        current ? { ...current, places: [...(current.places ?? []), nextPlace] } : current,
      );
    } else {
      setManualGuideLocations((current) =>
        current.map((location) =>
          location.id === placeSearchTargetId
            ? { ...location, places: [...(location.places ?? []), nextPlace] }
            : location,
        ),
      );
    }
    setMessage(`Selected ${placeName}. Add a description for this place.`);
  };
  const handleAddPlaceToDraftLocation = () => {
    if (!draftManualLocation) {
      setMessage("Pick a location before adding a place.");
      return;
    }
    setPlaceSearchTargetId(DRAFT_PLACE_SEARCH_TARGET);
    setPlaceSearch("");
    setPlaceSuggestions([]);
  };
  const handleAddPlaceToManualLocation = (locationId: string) => {
    setPlaceSearchTargetId(locationId);
    setPlaceSearch("");
    setPlaceSuggestions([]);
  };
  const toggleNestedPlace = (placeId: string) => {
    setExpandedNestedPlaceIds((current) =>
      current.includes(placeId) ? current.filter((id) => id !== placeId) : [...current, placeId],
    );
  };
  const getManualDirectionsHref = (locationName: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`;
  const reorderManualLocations = (dragId: string, dropId: string) => {
    if (!dragId || !dropId || dragId === dropId) return;
    setManualGuideLocations((current) => {
      const fromIndex = current.findIndex((item) => item.id === dragId);
      const toIndex = current.findIndex((item) => item.id === dropId);
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return current;
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };
  const reorderNestedPlaces = (parentId: string, dragId: string, dropId: string) => {
    if (!parentId || !dragId || !dropId || dragId === dropId) return;

    if (parentId === DRAFT_NESTED_PLACE_PARENT_ID) {
      setDraftManualLocation((current) => {
        if (!current?.places?.length) return current;
        const fromIndex = current.places.findIndex((place) => place.id === dragId);
        const toIndex = current.places.findIndex((place) => place.id === dropId);
        if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return current;
        const nextPlaces = [...current.places];
        const [moved] = nextPlaces.splice(fromIndex, 1);
        nextPlaces.splice(toIndex, 0, moved);
        return { ...current, places: nextPlaces };
      });
      return;
    }

    setManualGuideLocations((current) =>
      current.map((location) => {
        if (location.id !== parentId || !location.places?.length) return location;
        const fromIndex = location.places.findIndex((place) => place.id === dragId);
        const toIndex = location.places.findIndex((place) => place.id === dropId);
        if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return location;
        const nextPlaces = [...location.places];
        const [moved] = nextPlaces.splice(fromIndex, 1);
        nextPlaces.splice(toIndex, 0, moved);
        return { ...location, places: nextPlaces };
      }),
    );
  };
  const removeNestedPlace = (parentId: string, placeId: string) => {
    setExpandedNestedPlaceIds((current) => current.filter((id) => id !== placeId));
    if (parentId === DRAFT_NESTED_PLACE_PARENT_ID) {
      setDraftManualLocation((current) =>
        current
          ? { ...current, places: current.places?.filter((place) => place.id !== placeId) }
          : current,
      );
      return;
    }

    setManualGuideLocations((current) =>
      current.map((location) =>
        location.id === parentId
          ? { ...location, places: location.places?.filter((place) => place.id !== placeId) }
          : location,
      ),
    );
  };
  useLayoutEffect(() => {
    const nextRects: Record<string, DOMRect> = {};
    for (const location of manualGuideLocations) {
      const node = manualLocationRowRefs.current[location.id];
      if (!node) continue;
      nextRects[location.id] = node.getBoundingClientRect();
    }

    const previousRects = previousManualLocationRectsRef.current;
    for (const location of manualGuideLocations) {
      const node = manualLocationRowRefs.current[location.id];
      const previousRect = previousRects[location.id];
      const nextRect = nextRects[location.id];
      if (!node || !previousRect || !nextRect) continue;
      const deltaY = previousRect.top - nextRect.top;
      if (Math.abs(deltaY) < 1) continue;
      node.animate(
        [
          { transform: `translateY(${deltaY}px)` },
          { transform: "translateY(0px)" },
        ],
        {
          duration: 260,
          easing: "cubic-bezier(0.22,1,0.36,1)",
        },
      );
    }

    previousManualLocationRectsRef.current = nextRects;
  }, [manualGuideLocations]);
  const startEditingManualLocation = (location: ManualGuideLocation) => {
    setClosingManualLocationEditId(null);
    setEditingManualLocationId(location.id);
    setEditingManualLocationDescription(location.description);
  };
  const commitEditingManualLocation = () => {
    if (!editingManualLocationId) return;
    const targetId = editingManualLocationId;
    const nextDescription = editingManualLocationDescription.trim();
    setClosingManualLocationEditId(targetId);
    setEditingManualLocationId(null);
    window.setTimeout(() => {
      setManualGuideLocations((current) =>
        current.map((item) =>
          item.id === targetId
            ? {
                ...item,
                description: nextDescription || item.description,
              }
            : item,
        ),
      );
      setClosingManualLocationEditId((current) => (current === targetId ? null : current));
    }, 280);
  };
  const commitEditingManualLocationImmediate = () => {
    if (!editingManualLocationId) return;
    setManualGuideLocations((current) =>
      current.map((item) =>
        item.id === editingManualLocationId
          ? {
              ...item,
              description: editingManualLocationDescription.trim() || item.description,
            }
          : item,
      ),
    );
    setEditingManualLocationId(null);
    setClosingManualLocationEditId(null);
  };

  const handleEditSubmittedList = (list: MapList) => {
    setEditingListId(list.id);
    setSubmissionMode(
      list.submissionType ?? "guide",
      /\bitinerary\b/i.test(list.title) ? "itinerary" : "guide",
    );
    setTitle(list.title);
    setDescription(list.description);
    setDescriptionApplied(true);
    setCategory(list.category);
    setUrl(list.url === "https://www.google.com/maps" ? "" : list.url);
    setMessage(null);

    const locationText = [list.location.neighborhood, list.location.city, list.location.country, list.location.continent]
      .filter(Boolean)
      .join(", ");
    const inferred = inferLocationIds(locationText);
    if (inferred) {
      setContinentId(inferred.continentId);
      setCountryId(inferred.countryId);
      setRegionId(inferred.regionId ?? "");
      setCityId(list.location.city ? inferred.cityId ?? "" : "");
      setRegionStepCompleted(true);
      setCityStepCompleted(true);
      setNeighborhoodStepCompleted(true);
    }

    const manualModeCandidate =
      (list.submissionType ?? "guide") === "guide" &&
      list.stops.length > 0;

    setGuideInputMode(manualModeCandidate ? "manual" : "google");
    if (manualModeCandidate) {
      setManualGuideLocations(
        list.stops.map((stop, index) => ({
          id: `edit-stop-${stop.id}-${index}`,
          name: stop.name,
          context: [list.location.country, list.location.continent].filter(Boolean).join(" • "),
          description: stop.description,
          coordinates: stop.coordinates,
          places: stop.places?.map((place, placeIndex) => ({
            id: `edit-place-${place.id}-${placeIndex}`,
            name: place.name,
            context: stop.name,
            description: place.description,
            coordinates: place.coordinates,
          })),
        })),
      );
    } else {
      setManualGuideLocations([]);
    }
  };
  const confirmDeleteEditingGuide = () => {
    if (!editingListId) {
      return;
    }
    const response = deleteSubmittedList(editingListId);
    setMessage(response.message);
    if (!response.ok) {
      return;
    }
    resetFormState();
  };
  const handleDeleteEditingGuide = () => {
    if (!editingListId) {
      return;
    }
    setPendingDelete({ kind: "guide", name: title.trim() || "this guide" });
  };
  const removeManualLocation = (locationId: string) => {
    setManualGuideLocations((current) => current.filter((item) => item.id !== locationId));
    setExpandedManualLocationIds((current) => current.filter((id) => id !== locationId));
    if (editingManualLocationId === locationId) {
      setEditingManualLocationId(null);
      setEditingManualLocationDescription("");
      setClosingManualLocationEditId(null);
    }
    if (placeSearchTargetId === locationId) {
      setShowPlaceSearch(false);
      setPlaceSearchTargetId(null);
    }
  };
  const handleTrashClick = () => {
    if (editingManualLocationId) {
      const target = manualGuideLocations.find((location) => location.id === editingManualLocationId);
      setPendingDelete({
        kind: "entry",
        id: editingManualLocationId,
        name: target?.name ?? "this entry",
      });
      return;
    }

    handleDeleteEditingGuide();
  };
  const handleConfirmPendingDelete = () => {
    if (!pendingDelete) {
      return;
    }
    if (pendingDelete.kind === "entry" && pendingDelete.id) {
      removeManualLocation(pendingDelete.id);
      setPendingDelete(null);
      return;
    }
    confirmDeleteEditingGuide();
    setPendingDelete(null);
  };
  const handleTrashDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (draggingNestedPlace) {
      removeNestedPlace(draggingNestedPlace.parentId, draggingNestedPlace.placeId);
      setDraggingNestedPlace(null);
      setDragOverNestedPlaceId(null);
      return;
    }
    if (draggingManualLocationId) {
      removeManualLocation(draggingManualLocationId);
      setDraggingManualLocationId(null);
      setDragOverManualLocationId(null);
    }
  };

  useEffect(() => {
    const editId = controlledEditListId ?? searchParams.get("edit");
    if (!editId || editingListId === editId) {
      return;
    }

    const target = submittedLists.find((list) => list.id === editId);
    if (!target) {
      setMessage("Could not find that guide to edit.");
      return;
    }

    if (!currentUser || target.creator.id !== currentUser.id) {
      setMessage("You can only edit your own guides.");
      return;
    }

    handleEditSubmittedList(target);
  }, [controlledEditListId, currentUser, editingListId, searchParams, submittedLists]);
  useEffect(() => {
    if (controlledEditListId === null && editingListId && hideModeToggle) {
      resetFormState();
      setMessage(null);
    }
  }, [controlledEditListId, editingListId, hideModeToggle]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setMessage("Please add a title.");
      return;
    }

    const requiresGoogleUrl = isGuideStyleSubmission && guideInputMode === "google";
    const hasValidGoogleUrl = Boolean(url.trim()) && isUrlValid;
    const isManualGuide = isGuideStyleSubmission && guideInputMode === "manual";
    const firstManualLocation = manualGuideLocations[0];
    const effectiveContinent = selectedContinent?.name || firstManualLocation?.continent;
    const effectiveCountry = selectedCountry?.name || firstManualLocation?.country;

    if ((requiresGoogleUrl && !hasValidGoogleUrl) || !effectiveContinent || !effectiveCountry) {
      setMessage("Please add a valid Google Maps URL and complete the location fields.");
      return;
    }

    if (isManualGuide && manualGuideLocations.length === 0) {
      setMessage("Add at least one location to this guide.");
      return;
    }

    const resolvedUrl =
      requiresGoogleUrl
        ? url.trim()
        : url.trim() || "https://www.google.com/maps";
    const manualStops =
      isManualGuide
        ? manualGuideLocations.map((location, index) => ({
            id: `manual-stop-${slugify(`${location.name}-${index + 1}`)}`,
            name: location.name,
            coordinates: location.coordinates ?? selectedCity?.coordinates ?? [0, 0],
            description: location.description.trim() || `${location.name} stop`,
            places: location.places?.map((place, placeIndex) => ({
              id: `nested-stop-${slugify(`${place.name}-${placeIndex + 1}`)}`,
              name: place.name.trim() || `Place ${placeIndex + 1}`,
              coordinates: place.coordinates ?? location.coordinates ?? selectedCity?.coordinates ?? [0, 0],
              description: place.description.trim() || `${place.name || `Place ${placeIndex + 1}`} stop`,
            })),
          }))
        : [];

    const submissionPayload = {
      submissionType: activeSubmissionType,
      url: resolvedUrl,
      title,
      description,
      category,
      continent: effectiveContinent,
      country: effectiveCountry,
      city: selectedCity?.name,
      neighborhood: selectedNeighborhood?.name ?? (!selectedCity ? selectedRegion?.name : undefined),
      visitedAt: activeSubmissionType === "journal" ? visitedAt : undefined,
      journalNote: activeSubmissionType === "journal" ? journalNote : undefined,
      stops: manualStops,
    };
    const response = editingListId
      ? updateSubmittedList(editingListId, submissionPayload)
      : submitList(submissionPayload);

    setMessage(response.message);
    if (response.list) {
      setLastSubmittedList(response.list);
      onSubmitted?.(response.list);
    }

    if (response.ok) {
      resetFormState();
      setSubmissionMode("guide", "guide");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`surface ${
        fillPane
          ? "relative flex h-full max-h-full min-h-0 flex-col !rounded-l-none !border-0 !bg-slate-50 px-3 pb-3 pt-0 !shadow-none"
          : "relative p-4 sm:p-5"
      }`}
    >
      {fillPane ? (
        <div
          className="sticky top-0 z-10 -mx-3 -mt-3 flex min-h-14 shrink-0 items-center justify-between gap-3 px-3 py-2 text-white backdrop-blur"
          style={{
            backgroundColor: categoryStyle.mapColor,
            borderColor: categoryStyle.mapColor,
          }}
        >
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">
              {formSubtitle}
            </p>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  if (description.trim()) {
                    setDescriptionApplied(true);
                  }
                }
              }}
              type="text"
              placeholder={formTitle}
              className="min-w-0 w-full border-0 bg-transparent p-0 text-base font-semibold leading-5 text-white placeholder:text-white/70 focus:outline-none focus:ring-0"
              aria-label="Title"
            />
            {locationTrail.length ? (
              <div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs font-medium text-white/75">
                {locationTrail.map((item, index) => (
                  <span key={item.id} className="inline-flex items-center gap-1">
                    {index > 0 ? <span className="text-white/45">•</span> : null}
                    <button
                      type="button"
                      onClick={() => handleEditLocationStep(item.id)}
                      className="rounded-full px-1 text-white/75 hover:text-white"
                    >
                      {item.label}
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-full border border-white/35 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
              {category}
            </span>
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Close"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
      <div
        className={
          fillPane
            ? "min-h-0 flex-1 basis-0 space-y-2 overflow-y-auto overscroll-contain pl-1 pr-1 pb-3 pt-4 touch-pan-y"
            : "space-y-2"
        }
      >
      {!hideModeToggle || !currentUser ? (
        <div className="flex items-center justify-between gap-3">
          {!hideModeToggle ? (
            <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setSubmissionMode("guide", "guide")}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  isGuideSubmission && activeGuideSubmissionVariant === "guide"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Guide
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmissionMode("journal", "guide");
                  setGuideInputMode("manual");
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  isExperienceSubmission
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Experience
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmissionMode("guide", "itinerary");
                  setGuideInputMode("manual");
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  isItinerarySubmission
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Itinerary
              </button>
            </div>
          ) : (
            <div />
          )}
          {!currentUser ? (
          <button
            type="button"
            onClick={() => openAuthModal("signup")}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900"
          >
            Sign in to submit
          </button>
          ) : null}
        </div>
      ) : null}

      <div className="min-w-0">
        {!fillPane ? (
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                if (description.trim()) {
                  setDescriptionApplied(true);
                }
              }
            }}
            type="text"
            placeholder="Title"
            className="min-w-0 w-full border-0 bg-transparent p-0 text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            aria-label="Title"
          />
        ) : null}
        <div className={!fillPane && locationTrail.length ? "mt-0.5 min-h-[1rem]" : "mt-0 min-h-0"}>
          {!fillPane && locationTrail.length ? (
            <div className="flex flex-wrap items-center gap-1 text-xs font-medium text-slate-500">
              {locationTrail.map((item, index) => (
                <span key={item.id} className="inline-flex items-center gap-1">
                  {index > 0 ? <span className="text-slate-400">•</span> : null}
                  <button
                    type="button"
                    onClick={() => handleEditLocationStep(item.id)}
                    className="rounded-full px-1 text-slate-500 hover:text-slate-900"
                  >
                    {item.label}
                  </button>
                </span>
              ))}
            </div>
          ) : null}
        </div>
        {descriptionApplied && description.trim() ? (
          <>
            {fillPane ? (
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                Description
              </p>
            ) : null}
            <p className="mt-2 px-3 text-sm leading-5 text-slate-600">{description.trim()}</p>
          </>
        ) : null}
      </div>

      {hasTitleStep ? (
        canShowDetailsStep || isEditingExistingGuide ? (
          descriptionApplied ? null : (
            <label className="block text-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="block font-medium text-slate-700">Description</span>
                <button
                  type="button"
                  onClick={() => setDescriptionApplied(Boolean(description.trim()))}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900"
                  aria-label="Apply description"
                  title="Apply description"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <textarea
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  setDescriptionApplied(false);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    setDescriptionApplied(Boolean(description.trim()));
                  }
                }}
                rows={4}
                required
                placeholder={`What makes this ${submissionNoun} useful?`}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              />
            </label>
          )
        ) : !continentId ? (
        <div className="grid gap-5 md:grid-cols-1">
          <label className="block text-sm">
            <span
              key={`step-title-${currentStepTitle}`}
              className="mb-2 block font-medium text-slate-700 transition-opacity duration-200"
            >
              {animatedStepTitle || "\u00A0"}
            </span>
            <select
              value={continentId}
              onChange={(event) => {
                const nextContinent = continents.find((item) => item.id === event.target.value);
                setContinentId(nextContinent?.id ?? "");
                setCountryId("");
                setRegionId("");
                setCityId("");
                setNeighborhoodId("");
                setRegionStepCompleted(false);
                setCityStepCompleted(false);
                setNeighborhoodStepCompleted(false);
              }}
              className={dropdownClassName}
            >
              <option value="">Select continent</option>
              {continents.map((continent) => (
                <option key={continent.id} value={continent.id}>
                  {continent.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : !countryId ? (
        <div className="grid gap-5 md:grid-cols-1">
          <label className="block text-sm">
            <span
              key={`step-title-${currentStepTitle}`}
              className="mb-2 block font-medium text-slate-700 transition-opacity duration-200"
            >
              {animatedStepTitle || "\u00A0"}
            </span>
            <select
              value={countryId}
              onChange={(event) => {
                const nextCountry =
                  selectedContinent?.countries.find((item) => item.id === event.target.value) ??
                  selectedContinent?.countries[0];
                setCountryId(nextCountry?.id ?? "");
                setRegionId("");
                setCityId("");
                setNeighborhoodId("");
                setRegionStepCompleted(false);
                setCityStepCompleted(false);
                setNeighborhoodStepCompleted(false);
              }}
              className={dropdownClassName}
            >
              <option value="">Select country</option>
              {selectedContinent?.countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-1">
          {!regionStepCompleted ? (
            <label className="block text-sm">
              <span
                key={`step-title-${currentStepTitle}`}
                className="mb-2 block font-medium text-slate-700 transition-opacity duration-200"
              >
                {animatedStepTitle || "\u00A0"}
              </span>
              <select
                value={regionSelectionValue}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  if (nextValue === "__unselected__") {
                    setRegionStepCompleted(false);
                    setRegionId("");
                    setCityId("");
                    setNeighborhoodId("");
                    setCityStepCompleted(false);
                    setNeighborhoodStepCompleted(false);
                    return;
                  }
                  if (nextValue === "__none__") {
                    setRegionStepCompleted(true);
                    setRegionId("");
                    setCityId("");
                    setNeighborhoodId("");
                    setCityStepCompleted(false);
                    setNeighborhoodStepCompleted(false);
                    return;
                  }
                  setRegionStepCompleted(true);
                  setRegionId(nextValue);
                  setCityId("");
                  setNeighborhoodId("");
                  setCityStepCompleted(false);
                  setNeighborhoodStepCompleted(false);
                }}
                className={dropdownClassName}
              >
                <option value="__unselected__">Select region</option>
                <option value="__none__">No region</option>
                {(selectedCountry?.subareas ?? []).map((subarea) => {
                  const regionValue = subarea.id ? String(subarea.id) : subarea.name;
                  return (
                    <option key={regionValue} value={regionValue}>
                      {subarea.name}
                    </option>
                  );
                })}
              </select>
            </label>
          ) : !cityStepCompleted ? (
            <label className="block text-sm">
              <span
                key={`step-title-${currentStepTitle}`}
                className="mb-2 block font-medium text-slate-700 transition-opacity duration-200"
              >
                {animatedStepTitle || "\u00A0"}
              </span>
              <select
                value={citySelectionValue}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  if (nextValue === "__unselected__") {
                    setCityStepCompleted(false);
                    setCityId("");
                    setNeighborhoodId("");
                    setNeighborhoodStepCompleted(false);
                    return;
                  }
                  if (nextValue === "__none__") {
                    setCityStepCompleted(true);
                    setCityId("");
                    setNeighborhoodId("");
                    setNeighborhoodStepCompleted(false);
                    return;
                  }
                  setCityStepCompleted(true);
                  setCityId(nextValue);
                  setNeighborhoodId("");
                  setNeighborhoodStepCompleted(false);
                }}
                className={dropdownClassName}
              >
                <option value="__unselected__">Select city</option>
                <option value="__none__">No city</option>
                {selectableCities
                  .filter((city) =>
                    regionId
                      ? city.countrySubareaId === regionId || !city.countrySubareaId
                      : true,
                  )
                  .map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
              </select>
            </label>
          ) : null}

          {cityStepCompleted && cityId && !neighborhoodStepCompleted ? (
            <label className="block text-sm">
              <span
                key={`step-title-${currentStepTitle}`}
                className="mb-2 block font-medium text-slate-700 transition-opacity duration-200"
              >
                {animatedStepTitle || "\u00A0"}
              </span>
              <select
                value={neighborhoodSelectionValue}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  if (nextValue === "__unselected__") {
                    setNeighborhoodStepCompleted(false);
                    setNeighborhoodId("");
                    return;
                  }
                  if (nextValue === "__none__") {
                    setNeighborhoodStepCompleted(true);
                    setNeighborhoodId("");
                    return;
                  }
                  setNeighborhoodStepCompleted(true);
                  setNeighborhoodId(nextValue);
                }}
                disabled={!selectedCity}
                className={`${dropdownClassName} disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-slate-400`}
              >
                <option value="__unselected__">Select neighborhood</option>
                <option value="__none__">No neighborhood</option>
                {(selectedCity?.subareas ?? []).map((subarea) => (
                  <option key={subarea.id} value={subarea.id}>
                    {subarea.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      )
      ) : null}

      {canShowDetailsStep || isEditingExistingGuide ? (
        <>
          {canShowPostDescriptionStep ? (
            <>
              <div className="grid gap-5 md:grid-cols-1">
                <div className="block text-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="block font-medium text-slate-700">Add location</span>
                    {isGuideStyleSubmission ? (
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setGuideInputMode("google")}
                          disabled={isItinerarySubmission}
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition ${
                            guideInputMode === "google"
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900"
                          } ${isItinerarySubmission ? "cursor-not-allowed opacity-40" : ""}`}
                          aria-label="Google Maps input"
                          title="Google Maps input"
                        >
                          <span className="text-sm font-semibold leading-none">G</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setGuideInputMode("manual")}
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition ${
                            guideInputMode === "manual"
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900"
                          }`}
                          aria-label="Manual input"
                          title="Manual input"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                    ) : null}
                  </div>
                  {guideInputMode !== "manual" ? (
                    <>
                      <div className="flex gap-2">
                        <input
                          value={url}
                          onChange={(event) => setUrl(event.target.value)}
                          type="url"
                          required={guideInputMode === "google"}
                          placeholder="https://maps.app.goo.gl/... or https://www.google.com/maps/..."
                          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                        />
                        <button
                          type="button"
                          onClick={handleAutofillFromLink}
                          className="shrink-0 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium uppercase tracking-[0.08em] text-slate-700 hover:border-slate-300 hover:text-slate-900"
                        >
                          Autofill
                        </button>
                      </div>
                      {!isUrlValid ? (
                        <span className="mt-2 block text-xs text-red-600">
                          Enter a valid Google Maps URL (`https://maps.app.goo.gl/...` or `https://www.google.../maps`).
                        </span>
                      ) : null}
                    </>
                  ) : (
                    <div className="relative w-full">
                      {showLocationSearch ? (
                        <>
                          <div className="flex w-full gap-2">
                            <input
                              value={locationSearch}
                              onChange={(event) => setLocationSearch(event.target.value)}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  handleApplyLocationSearch();
                                  return;
                                }
                                if (event.key === "Escape") {
                                  setShowLocationSearch(false);
                                  setLocationSuggestions([]);
                                }
                              }}
                              type="text"
                              placeholder="Search location..."
                              autoFocus
                              className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3"
                            />
                            <button
                              type="button"
                              onClick={() => handleApplyLocationSearch()}
                              className="shrink-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900"
                            >
                              Apply
                            </button>
                          </div>
                          <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                            {!geoapifyApiKey ? (
                              <div className="px-4 py-3 text-xs text-slate-500">
                                Add `NEXT_PUBLIC_GEOAPIFY_API_KEY` to enable live location suggestions.
                              </div>
                            ) : null}
                            {geoapifyApiKey && isLocationSearching ? (
                              <div className="px-4 py-3 text-xs text-slate-500">Searching locations...</div>
                            ) : null}
                            {geoapifyApiKey &&
                            !isLocationSearching &&
                            locationSuggestions.length === 0 &&
                            locationSearch.trim().length >= 2 ? (
                              <div className="px-4 py-3 text-xs text-slate-500">No suggestions found.</div>
                            ) : null}
                            {geoapifyApiKey &&
                              locationSuggestions.map((suggestion) => (
                                <button
                                  key={suggestion.id}
                                  type="button"
                                  onClick={() => handleApplyLocationSearch(suggestion.label, suggestion)}
                                  className="block w-full border-0 border-t border-slate-100 px-4 py-3 text-left first:border-t-0 hover:bg-slate-50"
                                >
                                  <span className="block text-sm font-medium text-slate-900">{suggestion.label}</span>
                                  {suggestion.helperText ? (
                                    <span className="mt-1 block text-xs text-slate-500">{suggestion.helperText}</span>
                                  ) : null}
                                </button>
                              ))}
                          </div>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowLocationSearch(true)}
                          className="inline-flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900"
                        >
                          <span className="text-base leading-none">+</span>
                          <span>Add location</span>
                        </button>
                      )}
                      {manualGuideLocations.length > 0 ? (
                        <div className="mt-3 space-y-2">
                          {manualGuideLocations.map((location, index) => (
                            <div
                              key={location.id}
                              ref={(node) => {
                                manualLocationRowRefs.current[location.id] = node;
                              }}
                              className={`list-none transition-opacity duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                draggingManualLocationId === location.id ? "opacity-85" : "opacity-100"
                              }`}
                              onDragOver={(event) => {
                                event.preventDefault();
                                event.dataTransfer.dropEffect = "move";
                              }}
                              onDragEnter={(event) => {
                                event.preventDefault();
                                if (
                                  draggingManualLocationId &&
                                  draggingManualLocationId !== location.id &&
                                  dragOverManualLocationId !== location.id
                                ) {
                                  reorderManualLocations(draggingManualLocationId, location.id);
                                  setDragOverManualLocationId(location.id);
                                }
                              }}
                              onDrop={(event) => {
                                event.preventDefault();
                                const dragId = event.dataTransfer.getData("text/plain");
                                reorderManualLocations(dragId, location.id);
                                setDraggingManualLocationId(null);
                                setDragOverManualLocationId(null);
                              }}
                            >
                              <section
                                className={`rounded-2xl border bg-white/80 transition-[transform,border-color,box-shadow,opacity] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
                                  draggingManualLocationId === location.id
                                    ? "z-20 scale-[1.015] border-slate-300 shadow-lg"
                                    : dragOverManualLocationId === location.id
                                      ? "border-slate-300 shadow-sm"
                                      : expandedManualLocationIds.includes(location.id)
                                        ? "-translate-y-0.5 border-slate-200 shadow-md"
                                        : "border-slate-200"
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedManualLocationIds((current) =>
                                      current.includes(location.id)
                                        ? current.filter((id) => id !== location.id)
                                        : [...current, location.id],
                                    )
                                  }
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700"
                                >
                                  <span
                                    draggable
                                    onClick={(event) => event.stopPropagation()}
                                    onDragStart={(event) => {
                                      setDraggingManualLocationId(location.id);
                                      setDragOverManualLocationId(location.id);
                                      event.dataTransfer.effectAllowed = "move";
                                      event.dataTransfer.setData("text/plain", location.id);
                                      const rowNode = manualLocationRowRefs.current[location.id];
                                      if (rowNode) {
                                        event.dataTransfer.setDragImage(rowNode, 24, 24);
                                      }
                                    }}
                                    onDragEnd={() => {
                                      setDraggingManualLocationId(null);
                                      setDragOverManualLocationId(null);
                                    }}
                                    className="inline-flex h-5 w-5 shrink-0 cursor-grab items-center justify-center rounded text-slate-400 hover:text-slate-600 active:cursor-grabbing"
                                    title="Drag to reorder"
                                    aria-label="Drag to reorder"
                                  >
                                    <GripVertical className="h-4 w-4" />
                                  </span>
                                  <span
                                    className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                                    style={{ backgroundColor: categoryStyle.mapColor }}
                                  >
                                    {index + 1}
                                  </span>
                                  <span className="min-w-0 flex-1 truncate font-semibold">{location.name}</span>
                                  {location.places?.length ? (
                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-slate-600">
                                      {location.places.length} places
                                    </span>
                                  ) : null}
                                  <ChevronDown
                                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                                      expandedManualLocationIds.includes(location.id) ? "rotate-180" : ""
                                    }`}
                                  />
                                </button>
                                <div
                                  className={`grid transition-[grid-template-rows,opacity] duration-150 ease-out ${
                                    expandedManualLocationIds.includes(location.id)
                                      ? "grid-rows-[1fr] opacity-100"
                                      : "grid-rows-[0fr] opacity-0"
                                  }`}
                                >
                                  <div className="overflow-hidden">
                                    <div className="border-t border-slate-200 px-3 py-3">
                                      <p
                                        className={`cursor-text overflow-hidden px-3 text-sm leading-5 text-slate-600 transition-[max-height,opacity,transform,margin] duration-180 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                          editingManualLocationId === location.id
                                            ? "mb-0 max-h-0 -translate-y-1 opacity-0"
                                            : closingManualLocationEditId === location.id
                                              ? "mb-0 max-h-32 translate-y-1 opacity-0"
                                              : "mb-0 max-h-32 translate-y-0 opacity-100"
                                        }`}
                                        onClick={(event) => {
                                          event.preventDefault();
                                          event.stopPropagation();
                                          startEditingManualLocation(location);
                                        }}
                                      >
                                        {location.description}
                                      </p>
                                      <div
                                        className={`grid transition-[grid-template-rows,opacity,margin] duration-180 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                          editingManualLocationId === location.id
                                            ? "mt-0 grid-rows-[1fr] opacity-100"
                                            : closingManualLocationEditId === location.id
                                              ? "mt-0 grid-rows-[0fr] opacity-0"
                                              : "mt-0 grid-rows-[0fr] opacity-0"
                                        }`}
                                      >
                                        <div className="overflow-hidden">
                                          <textarea
                                            value={editingManualLocationDescription}
                                            onChange={(event) =>
                                              setEditingManualLocationDescription(event.target.value)
                                            }
                                            onClick={(event) => event.stopPropagation()}
                                            onBlur={commitEditingManualLocationImmediate}
                                            onKeyDown={(event) => {
                                              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                                                event.preventDefault();
                                                commitEditingManualLocation();
                                              }
                                            }}
                                            rows={3}
                                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm leading-5 text-slate-700"
                                          />
                                        </div>
                                      </div>
                                      {placeSearchTargetId === location.id ? (
                                        <div className="relative mt-3">
                                          <div className="flex w-full gap-2">
                                            <input
                                              value={placeSearch}
                                              onChange={(event) => setPlaceSearch(event.target.value)}
                                              onKeyDown={(event) => {
                                                if (event.key === "Enter") {
                                                  event.preventDefault();
                                                  handleApplyPlaceSearch();
                                                  return;
                                                }
                                                if (event.key === "Escape") {
                                                  setShowPlaceSearch(false);
                                                  setPlaceSearchTargetId(null);
                                                  setPlaceSuggestions([]);
                                                }
                                              }}
                                              type="text"
                                              placeholder="Search place..."
                                              autoFocus
                                              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => handleApplyPlaceSearch()}
                                              className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900"
                                            >
                                              Apply
                                            </button>
                                          </div>
                                          {shouldShowPlaceSuggestionsPanel ? (
                                          <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                                            {!geoapifyApiKey ? (
                                              <div className="px-3 py-2 text-xs text-slate-500">
                                                Add `NEXT_PUBLIC_GEOAPIFY_API_KEY` to enable live place suggestions.
                                              </div>
                                            ) : null}
                                            {geoapifyApiKey && isPlaceSearching ? (
                                              <div className="px-3 py-2 text-xs text-slate-500">Searching places...</div>
                                            ) : null}
                                            {geoapifyApiKey &&
                                            !isPlaceSearching &&
                                            placeSuggestions.length === 0 &&
                                            placeSearch.trim().length >= 2 ? (
                                              <div className="px-3 py-2 text-xs text-slate-500">No suggestions found.</div>
                                            ) : null}
                                            {geoapifyApiKey &&
                                              placeSuggestions.map((suggestion) => (
                                                <button
                                                  key={suggestion.id}
                                                  type="button"
                                                  onClick={() => handleApplyPlaceSearch(suggestion.label, suggestion)}
                                                  className="block w-full border-0 px-3 py-2 text-left hover:bg-slate-50"
                                                >
                                                  <span className="block text-sm font-medium text-slate-900">{suggestion.label}</span>
                                                  {suggestion.helperText ? (
                                                    <span className="mt-1 block text-xs text-slate-500">{suggestion.helperText}</span>
                                                  ) : null}
                                                </button>
                                              ))}
                                          </div>
                                          ) : null}
                                        </div>
                                      ) : null}
                                      {location.places?.length ? (
                                        <div className="mt-3">
                                          <div className="mb-2 flex items-center gap-2">
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">POI</p>
                                            <div className="h-px flex-1 bg-slate-200" />
                                          </div>
                                          <div className="space-y-3 pl-4">
                                          {location.places.map((place, placeIndex) => (
                                            <div
                                              key={place.id}
                                              className={`flex items-start gap-2 rounded-xl border border-slate-200 bg-stone-50 px-3 py-1.5 transition-opacity duration-150 ${
                                                dragOverNestedPlaceId === place.id ? "opacity-70" : "opacity-100"
                                              }`}
                                              onDragOver={(event) => {
                                                event.preventDefault();
                                                event.dataTransfer.dropEffect = "move";
                                              }}
                                              onDragEnter={(event) => {
                                                event.preventDefault();
                                                if (
                                                  draggingNestedPlace &&
                                                  draggingNestedPlace.parentId === location.id &&
                                                  draggingNestedPlace.placeId !== place.id
                                                ) {
                                                  reorderNestedPlaces(location.id, draggingNestedPlace.placeId, place.id);
                                                  setDragOverNestedPlaceId(place.id);
                                                }
                                              }}
                                              onDrop={(event) => {
                                                event.preventDefault();
                                                setDraggingNestedPlace(null);
                                                setDragOverNestedPlaceId(null);
                                              }}
                                            >
                                              <span
                                                draggable
                                                onClick={(event) => event.stopPropagation()}
                                                onDragStart={(event) => {
                                                  setDraggingNestedPlace({ parentId: location.id, placeId: place.id });
                                                  setDragOverNestedPlaceId(place.id);
                                                  event.dataTransfer.effectAllowed = "move";
                                                  event.dataTransfer.setData("text/plain", place.id);
                                                }}
                                                onDragEnd={() => {
                                                  setDraggingNestedPlace(null);
                                                  setDragOverNestedPlaceId(null);
                                                }}
                                                className="mt-0.5 inline-flex h-5 w-5 shrink-0 cursor-grab items-center justify-center rounded text-slate-400 hover:text-slate-600 active:cursor-grabbing"
                                                title="Drag to reorder"
                                                aria-label="Drag to reorder"
                                              >
                                                <GripVertical className="h-4 w-4" />
                                              </span>
                                              <span
                                                className="mt-0.5 inline-flex h-5 w-5 shrink-0 rotate-45 items-center justify-center rounded-[4px] text-[10px] font-semibold text-white"
                                                style={{ backgroundColor: categoryStyle.poiColor }}
                                              >
                                                <span className="-rotate-45">{getAlphaMarker(placeIndex)}</span>
                                              </span>
                                              <div className="min-w-0 flex-1 pt-0.5">
                                                <div className="flex min-h-5 items-center gap-2">
                                                  <input
                                                    value={place.name}
                                                    onChange={(event) =>
                                                      setManualGuideLocations((current) =>
                                                        current.map((item) =>
                                                          item.id === location.id
                                                            ? {
                                                                ...item,
                                                                places: item.places?.map((nestedPlace) =>
                                                                  nestedPlace.id === place.id
                                                                    ? { ...nestedPlace, name: event.target.value }
                                                                    : nestedPlace,
                                                                ),
                                                              }
                                                            : item,
                                                        ),
                                                      )
                                                    }
                                                    className="min-w-0 flex-1 border-0 bg-transparent p-0 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-0"
                                                  />
                                                  <button
                                                    type="button"
                                                    onClick={() => toggleNestedPlace(place.id)}
                                                    className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-slate-400 hover:text-slate-600"
                                                    aria-label="Toggle POI details"
                                                    title="Toggle POI details"
                                                  >
                                                    <ChevronDown
                                                      className={`h-3.5 w-3.5 transition-transform ${
                                                        expandedNestedPlaceIds.includes(place.id) ? "rotate-180" : ""
                                                      }`}
                                                    />
                                                  </button>
                                                </div>
                                                <div
                                                  className={`grid transition-[grid-template-rows,opacity,margin] duration-150 ease-out ${
                                                    expandedNestedPlaceIds.includes(place.id)
                                                      ? "mt-0.5 grid-rows-[1fr] opacity-100"
                                                      : "mt-0 grid-rows-[0fr] opacity-0"
                                                  }`}
                                                >
                                                  <div className="overflow-hidden">
                                                    <textarea
                                                      value={place.description}
                                                      onChange={(event) =>
                                                        setManualGuideLocations((current) =>
                                                          current.map((item) =>
                                                            item.id === location.id
                                                              ? {
                                                                  ...item,
                                                                  places: item.places?.map((nestedPlace) =>
                                                                    nestedPlace.id === place.id
                                                                      ? { ...nestedPlace, description: event.target.value }
                                                                      : nestedPlace,
                                                                  ),
                                                                }
                                                              : item,
                                                          ),
                                                        )
                                                      }
                                                      rows={1}
                                                      placeholder="Place description..."
                                                      className="w-full resize-none border-0 bg-transparent p-0 text-xs leading-4 text-slate-600 focus:outline-none focus:ring-0"
                                                    />
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
                                          {location.context ? (
                                            <p className="text-[11px] leading-4 text-slate-500">{location.context}</p>
                                          ) : null}
                                        </div>
                                        <div className="flex shrink-0 items-center gap-2">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (editingManualLocationId === location.id) {
                                                commitEditingManualLocation();
                                                return;
                                              }
                                              startEditingManualLocation(location);
                                            }}
                                            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-700 hover:text-slate-900"
                                          >
                                            {editingManualLocationId === location.id ? "Submit" : "Edit"}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleAddPlaceToManualLocation(location.id)}
                                            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-700 hover:text-slate-900"
                                          >
                                            Add place
                                          </button>
                                          <Link
                                            href={getManualDirectionsHref(location.name)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-medium text-slate-700 hover:text-slate-900"
                                            aria-label="Directions"
                                            title="Directions"
                                          >
                                            <Navigation className="h-3.5 w-3.5" />
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </section>
                            </div>
                          ))}
                        </div>
                      ) : null}
                      {draftManualLocation ? (
                        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
                          <input
                            value={draftManualLocation.name}
                            onChange={(event) =>
                              setDraftManualLocation((current) =>
                                current ? { ...current, name: event.target.value } : current,
                              )
                            }
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900"
                          />
                          {draftManualLocation.context ? (
                            <p className="mt-0.5 text-xs text-slate-500">{draftManualLocation.context}</p>
                          ) : null}
                          <textarea
                            value={draftManualDescription}
                            onChange={(event) => setDraftManualDescription(event.target.value)}
                            rows={2}
                            placeholder="Add a short description..."
                            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                          />
                          {placeSearchTargetId === DRAFT_PLACE_SEARCH_TARGET ? (
                            <div className="relative mt-3">
                              <div className="flex w-full gap-2">
                                <input
                                  value={placeSearch}
                                  onChange={(event) => setPlaceSearch(event.target.value)}
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                      event.preventDefault();
                                      handleApplyPlaceSearch();
                                      return;
                                    }
                                    if (event.key === "Escape") {
                                      setShowPlaceSearch(false);
                                      setPlaceSearchTargetId(null);
                                      setPlaceSuggestions([]);
                                    }
                                  }}
                                  type="text"
                                  placeholder="Search place..."
                                  autoFocus
                                  className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleApplyPlaceSearch()}
                                  className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900"
                                >
                                  Apply
                                </button>
                              </div>
                              {shouldShowPlaceSuggestionsPanel ? (
                              <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                                {!geoapifyApiKey ? (
                                  <div className="px-3 py-2 text-xs text-slate-500">
                                    Add `NEXT_PUBLIC_GEOAPIFY_API_KEY` to enable live place suggestions.
                                  </div>
                                ) : null}
                                {geoapifyApiKey && isPlaceSearching ? (
                                  <div className="px-3 py-2 text-xs text-slate-500">Searching places...</div>
                                ) : null}
                                {geoapifyApiKey &&
                                !isPlaceSearching &&
                                placeSuggestions.length === 0 &&
                                placeSearch.trim().length >= 2 ? (
                                  <div className="px-3 py-2 text-xs text-slate-500">No suggestions found.</div>
                                ) : null}
                                {geoapifyApiKey &&
                                  placeSuggestions.map((suggestion) => (
                                    <button
                                      key={suggestion.id}
                                      type="button"
                                      onClick={() => handleApplyPlaceSearch(suggestion.label, suggestion)}
                                      className="block w-full border-0 px-3 py-2 text-left hover:bg-slate-50"
                                    >
                                      <span className="block text-sm font-medium text-slate-900">{suggestion.label}</span>
                                      {suggestion.helperText ? (
                                        <span className="mt-1 block text-xs text-slate-500">{suggestion.helperText}</span>
                                      ) : null}
                                    </button>
                                  ))}
                              </div>
                              ) : null}
                            </div>
                          ) : null}
                          {draftManualLocation.places?.length ? (
                            <div className="mt-3">
                              <div className="mb-2 flex items-center gap-2">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">POI</p>
                                <div className="h-px flex-1 bg-slate-200" />
                              </div>
                              <div className="space-y-3 pl-4">
                              {draftManualLocation.places.map((place, placeIndex) => (
                                <div
                                  key={place.id}
                                  className={`flex items-start gap-2 rounded-xl border border-slate-200 bg-stone-50 px-3 py-1.5 transition-opacity duration-150 ${
                                    dragOverNestedPlaceId === place.id ? "opacity-70" : "opacity-100"
                                  }`}
                                  onDragOver={(event) => {
                                    event.preventDefault();
                                    event.dataTransfer.dropEffect = "move";
                                  }}
                                  onDragEnter={(event) => {
                                    event.preventDefault();
                                    if (
                                      draggingNestedPlace &&
                                      draggingNestedPlace.parentId === DRAFT_NESTED_PLACE_PARENT_ID &&
                                      draggingNestedPlace.placeId !== place.id
                                    ) {
                                      reorderNestedPlaces(DRAFT_NESTED_PLACE_PARENT_ID, draggingNestedPlace.placeId, place.id);
                                      setDragOverNestedPlaceId(place.id);
                                    }
                                  }}
                                  onDrop={(event) => {
                                    event.preventDefault();
                                    setDraggingNestedPlace(null);
                                    setDragOverNestedPlaceId(null);
                                  }}
                                >
                                  <span
                                    draggable
                                    onClick={(event) => event.stopPropagation()}
                                    onDragStart={(event) => {
                                      setDraggingNestedPlace({
                                        parentId: DRAFT_NESTED_PLACE_PARENT_ID,
                                        placeId: place.id,
                                      });
                                      setDragOverNestedPlaceId(place.id);
                                      event.dataTransfer.effectAllowed = "move";
                                      event.dataTransfer.setData("text/plain", place.id);
                                    }}
                                    onDragEnd={() => {
                                      setDraggingNestedPlace(null);
                                      setDragOverNestedPlaceId(null);
                                    }}
                                    className="mt-0.5 inline-flex h-5 w-5 shrink-0 cursor-grab items-center justify-center rounded text-slate-400 hover:text-slate-600 active:cursor-grabbing"
                                    title="Drag to reorder"
                                    aria-label="Drag to reorder"
                                  >
                                    <GripVertical className="h-4 w-4" />
                                  </span>
                                  <span
                                    className="mt-0.5 inline-flex h-5 w-5 shrink-0 rotate-45 items-center justify-center rounded-[4px] text-[10px] font-semibold text-white"
                                    style={{ backgroundColor: categoryStyle.poiColor }}
                                  >
                                    <span className="-rotate-45">{getAlphaMarker(placeIndex)}</span>
                                  </span>
                                  <div className="min-w-0 flex-1 pt-0.5">
                                  <div className="flex min-h-5 items-center gap-2">
                                    <input
                                      value={place.name}
                                      onChange={(event) =>
                                        setDraftManualLocation((current) =>
                                          current
                                            ? {
                                                ...current,
                                                places: current.places?.map((item) =>
                                                  item.id === place.id ? { ...item, name: event.target.value } : item,
                                                ),
                                              }
                                            : current,
                                        )
                                      }
                                      className="min-w-0 flex-1 border-0 bg-transparent p-0 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-0"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => toggleNestedPlace(place.id)}
                                      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-slate-400 hover:text-slate-600"
                                      aria-label="Toggle POI details"
                                      title="Toggle POI details"
                                    >
                                      <ChevronDown
                                        className={`h-3.5 w-3.5 transition-transform ${
                                          expandedNestedPlaceIds.includes(place.id) ? "rotate-180" : ""
                                        }`}
                                      />
                                    </button>
                                  </div>
                                  <div
                                    className={`grid transition-[grid-template-rows,opacity,margin] duration-150 ease-out ${
                                      expandedNestedPlaceIds.includes(place.id)
                                        ? "mt-0.5 grid-rows-[1fr] opacity-100"
                                        : "mt-0 grid-rows-[0fr] opacity-0"
                                    }`}
                                  >
                                    <div className="overflow-hidden">
                                      <textarea
                                        value={place.description}
                                        onChange={(event) =>
                                          setDraftManualLocation((current) =>
                                            current
                                              ? {
                                                  ...current,
                                                  places: current.places?.map((item) =>
                                                    item.id === place.id ? { ...item, description: event.target.value } : item,
                                                  ),
                                                }
                                              : current,
                                          )
                                        }
                                        rows={1}
                                        placeholder="Place description..."
                                        className="w-full resize-none border-0 bg-transparent p-0 text-xs leading-4 text-slate-600 focus:outline-none focus:ring-0"
                                      />
                                    </div>
                                  </div>
                                  </div>
                                </div>
                              ))}
                              </div>
                            </div>
                          ) : null}
                          <div className="mt-2 flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setDraftManualLocation(null);
                                setDraftManualDescription("");
                                setShowPlaceSearch(false);
                                setPlaceSearchTargetId(null);
                                setPlaceSearch("");
                                setPlaceSuggestions([]);
                              }}
                              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleSubmitDraftManualLocation}
                              className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                            >
                              Submit
                            </button>
                            <button
                              type="button"
                              onClick={handleAddPlaceToDraftLocation}
                              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900"
                            >
                              Add place
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-1">
                <label className="block text-sm">
                  <span className="mb-2 block font-medium text-slate-700">Category</span>
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value as (typeof CATEGORIES)[number])}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  >
                    {CATEGORIES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2">
                {editingListId ? (
                  <button
                    type="button"
                    onClick={handleTrashClick}
                    onDragOver={(event) => {
                      if (draggingNestedPlace || draggingManualLocationId) {
                        event.preventDefault();
                        event.dataTransfer.dropEffect = "move";
                      }
                    }}
                    onDrop={handleTrashDrop}
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-red-200 bg-white text-red-600 hover:border-red-300 hover:text-red-700 ${
                      draggingNestedPlace || draggingManualLocationId ? "shadow-md ring-2 ring-red-100" : ""
                    }`}
                    aria-label={editingManualLocationId ? "Delete entry" : "Delete guide"}
                    title={editingManualLocationId ? "Delete entry" : "Delete guide"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : null}
                <button
                  type="submit"
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                >
                  {editingListId ? "Save changes" : `Submit ${submissionNoun}`}
                </button>
              </div>
            </>
          ) : null}
        </>
      ) : null}

      {message ? (
        <div className="rounded-2xl border border-slate-200 bg-stone-50 px-4 py-3 text-sm text-slate-700">
          {message}
        </div>
      ) : null}

      </div>
      {pendingDelete ? (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/10 px-6 backdrop-blur-[1px]">
          <div className="w-full max-w-xs rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-xl">
            <p className="text-sm font-semibold text-slate-900">
              Delete {pendingDelete.kind === "entry" ? pendingDelete.name : "this guide"}?
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              This removes {pendingDelete.kind === "entry" ? "this entry from the guide" : pendingDelete.name}.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPendingDelete}
                className="rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-medium text-red-600 hover:border-red-300 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </form>
  );
}
