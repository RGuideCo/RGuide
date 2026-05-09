"use client";

import {
  Bookmark,
  Building2,
  CalendarDays,
  Camera,
  ChevronDown,
  ChevronRight,
  CloudSun,
  Flag,
  Globe2,
  Heart,
  Footprints,
  Map as MapIcon,
  MapPin,
  MapPinned,
  Plus,
  Route,
  Search,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { startTransition, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";

import { MapListCard } from "@/components/cards/MapListCard";
import { SubmitListForm } from "@/components/list/SubmitListForm";
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
  resolveCityDeepLink,
} from "@/lib/deep-link-routes";
import { updateSupabaseProfile } from "@/lib/supabase/profile";
import { getEditorialLists, useAppStore } from "@/store/app-store";
import type { FavoriteLocation } from "@/store/app-store";
import { Continent, ListCategory, MapList, SelectionState, SubmissionType } from "@/types";

export interface SplitScreenSectionProps {
  continents: Continent[];
  initialEditorialGuides?: MapList[];
  initialRouteState?: CityDeepLinkState;
  seoContent?: {
    h1: string;
    intro: string;
  };
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
}

type MapViewportInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

const GUIDE_CHROME_WIPE_MS = 560;
const GUIDE_OPEN_EXPAND_START_MS = GUIDE_CHROME_WIPE_MS - 48;
const GUIDE_LAYOUT_MOTION_MS = 520;
const GUIDE_LAYOUT_OPEN_SIDEWAYS_MS = 560;
const GUIDE_LAYOUT_OPEN_UP_MS = 500;
const GUIDE_LAYOUT_OPEN_UP_START_MS = GUIDE_LAYOUT_OPEN_SIDEWAYS_MS - 72;
const GUIDE_LAYOUT_OPEN_TOTAL_MS = GUIDE_LAYOUT_OPEN_UP_START_MS + GUIDE_LAYOUT_OPEN_UP_MS;
const GUIDE_LAYOUT_CLOSE_SIDEWAYS_START_MS = 260;
const GUIDE_LAYOUT_CLOSE_TOTAL_MS = GUIDE_LAYOUT_CLOSE_SIDEWAYS_START_MS + GUIDE_LAYOUT_OPEN_SIDEWAYS_MS;
const GUIDE_CONTENT_REVEAL_DELAY_MS = GUIDE_LAYOUT_OPEN_TOTAL_MS + 80;

type MobileBrowseSelectOption = {
  value: string;
  label: string;
};

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
      candidate.stops.length === guide.stops.length
    );
  });
}

function seedInitialEditorialGuides(initialEditorialGuides: MapList[]) {
  if (typeof window === "undefined" || !initialEditorialGuides.length) {
    return;
  }

  const currentEditorialGuides = useAppStore.getState().editorialLists;

  if (!areGuideCollectionsEquivalent(currentEditorialGuides, initialEditorialGuides)) {
    useAppStore.setState({ editorialLists: initialEditorialGuides });
  }
}

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

const cityHighlightCategoryOrder: Array<{ label: string; category: ListCategory }> = [
  { label: "Food", category: "Food" },
  { label: "Nightlife", category: "Nightlife" },
  { label: "Culture", category: "Culture" },
  { label: "Stay", category: "Stay" },
  { label: "Routes", category: "Routes" },
  { label: "Essentials", category: "Essentials" },
  { label: "Vibe", category: "Activities" },
];

const cityHighlightThemes: Record<ListCategory, string[]> = {
  Food: ["Tapas", "Seafood", "Michelin"],
  Nightlife: ["Late", "Bars", "Cocktails"],
  Culture: ["Architecture", "Museums", "History"],
  Stay: ["Boutique", "Hostels", "Walkable"],
  Nature: ["Views", "Urban parks", "Waterfront"],
  Activities: ["Social", "Walkable", "Energy"],
  Routes: ["Walks", "Streets", "Loops"],
  Essentials: ["Transit", "Arrival", "Basics"],
};

type CategoryDescriptionProfile = {
  city: string;
  food: string;
  nightlife: string;
  culture: string;
  stay: string;
  nature: string;
  activities: string;
  routes?: string;
  essentials?: string;
};

function buildCategoryDescriptionOverride(profile: CategoryDescriptionProfile): Partial<Record<ListCategory, string>> {
  return {
    Food: `${profile.city} food works best when it is mapped by neighborhood and meal rhythm: ${profile.food}. Use it to choose a meal that fits the route instead of chasing a generic best-of list across town.`,
    Nightlife: `${profile.city} nightlife needs the right room for the night: ${profile.nightlife}. Use it to pick the energy level, crowd, and timing before the plan turns into a long transfer or queue.`,
    Culture: `${profile.city} culture is strongest when the route connects its layers: ${profile.culture}. Use it to build days around a few anchors, with streets, meals, and quieter stops carrying the gaps.`,
    Stay: `${profile.city} stays should match the trip shape: ${profile.stay}. Use it to choose a base by transit, sleep style, nightlife reach, and the neighborhoods you will actually revisit.`,
    Nature: `${profile.city} open-air time should give the trip room to breathe: ${profile.nature}. Use it for parks, waterfronts, viewpoints, beaches, gardens, or day edges that reset dense city routes.`,
    Activities: `${profile.city} activities work best as paced routes, not checklist piles: ${profile.activities}. Use it to connect food, culture, open-air breaks, stays, and nights without fighting the city geography.`,
    Routes: `${profile.city} routes should explain movement, not just dots on a map: ${profile.routes ?? profile.activities}. Use it for walking routes, major streets, transit hops, scenic loops, and route logic that makes the day feel coherent.`,
    Essentials: `${profile.city} essentials should make the trip easier before the day gets busy: ${profile.essentials ?? profile.routes ?? profile.stay}. Use it for arrival, transit, safety, money, connectivity, weather, and other practical decisions that shape the plan.`,
  };
}

const categoryCityDescriptionProfiles: Record<string, CategoryDescriptionProfile> = {
  paris: {
    city: "Paris",
    food: "classic bistros, bakeries, wine-led rooms, market streets, modern reservations, and arrondissement-specific cafe routines",
    nightlife: "wine bars, hotel lounges, jazz rooms, cocktail bars, Pigalle nights, and late meals that depend heavily on the arrondissement",
    culture: "major museums, smaller house museums, literary streets, churches, fashion history, river walks, and neighborhood-scale galleries",
    stay: "Left Bank calm, Marais access, opera-and-shopping convenience, Pigalle edge, or quieter residential bases near useful Metro lines",
    nature: "the Seine, Luxembourg and Tuileries gardens, Buttes-Chaumont, cemeteries, canal walks, and easy day trips beyond the ring",
    activities: "museum mornings, bistro lunches, garden resets, river crossings, neighborhood shopping, wine bars, and slower evening walks",
  },
  london: {
    city: "London",
    food: "markets, pub dining, South Asian routes, modern British rooms, bakeries, Sunday roasts, and destination restaurants by transit line",
    nightlife: "pubs, cocktail rooms, clubs, live music, late Soho streets, theater-adjacent bars, and neighborhood nights south and east",
    culture: "national museums, royal sites, galleries, theaters, historic streets, music history, and village-like neighborhoods",
    stay: "West End access, museum-side calm, East London nightlife, South Bank views, or rail-friendly bases for a sprawling itinerary",
    nature: "royal parks, commons, canals, heaths, river walks, garden squares, and day trips that start from the right station",
    activities: "area-by-area days that combine museums, markets, pubs, theater, parks, and one realistic cross-town move at a time",
  },
  istanbul: {
    city: "Istanbul",
    food: "meyhanes, kebab rooms, bakeries, seafood, street food, breakfast spreads, and modern Turkish dining across both sides",
    nightlife: "Bosphorus rooftops, meyhane routes, Kadikoy bars, Beyoglu late rooms, hotel terraces, and music-led nights",
    culture: "Byzantine churches, Ottoman mosques and palaces, bazaars, ferries, contemporary galleries, and layered waterfront districts",
    stay: "Sultanahmet sightseeing, Beyoglu nightlife, Karakoy ferry access, Bosphorus calm, or Kadikoy food and bar routes",
    nature: "Bosphorus ferries, waterfront promenades, parks, islands, hill views, and breezy crossings between dense districts",
    activities: "ferry-linked days with markets, mosques, palace time, street food, old lanes, sunset views, and neighborhood dinners",
  },
  rome: {
    city: "Rome",
    food: "trattorias, pasta rooms, bakeries, market stops, aperitivo counters, wine bars, and reservation dinners by neighborhood",
    nightlife: "piazza drinks, enotecas, cocktail rooms, Trastevere crowds, Pigneto edge, and low-key late meals after long walks",
    culture: "ancient sites, churches, palazzi, fountains, museums, ruins, and street-level layers that make short walks feel dense",
    stay: "Centro convenience, Trastevere nights, Monti texture, Prati calm, or quieter bases that keep walking routes manageable",
    nature: "villa parks, river paths, hill views, the Appian Way, gardens, and open-air pauses between stone-heavy sightseeing",
    activities: "ancient anchors, church stops, piazza breaks, long lunches, gelato detours, wine bars, and evenings paced around walking",
  },
  barcelona: {
    city: "Barcelona",
    food: "Gothic taverns, Born seafood counters, Eixample tasting menus, Gracia market lunches, Poble-sec montaditos, and natural-wine rooms",
    nightlife: "cava counters, low-key bodegas, destination cocktail rooms, clubs, music venues, and Poble-sec pre-club stops",
    culture: "Roman fragments, medieval lanes, Born merchant history, Modernista houses, Gaudi landmarks, Montjuic museums, and design stops",
    stay: "old-city access, Eixample polish, Gracia calm, Poble-sec nights, beach edges, or hostels that trade quiet for social energy",
    nature: "Park Guell, Montjuic gardens, Ciutadella, hilltop viewpoints, waterfront walks, beaches, and neighborhood park breaks",
    activities: "Modernista mornings, counter meals, old-city history, beach or hill resets, neighborhood bars, and late-night finishes",
  },
  lisbon: {
    city: "Lisbon",
    food: "seafood rooms, tascas, bakeries, market halls, wine bars, modern Portuguese kitchens, and hillside neighborhood meals",
    nightlife: "fado rooms, Bairro Alto spillover, Cais do Sodre late bars, wine rooms, rooftops, and low-key plaza drinks",
    culture: "miradouros, tiled lanes, monasteries, museums, trams, old quarters, riverfront monuments, and fado context",
    stay: "Alfama atmosphere, Baixa convenience, Chiado polish, Bairro Alto nights, Principe Real calm, or flatter transit-friendly bases",
    nature: "viewpoints, riverfront paths, gardens, ferry rides, nearby beaches, and Sintra or Cascais routes that compete for time",
    activities: "hill climbs, tram rides, seafood lunches, tile-and-monastery stops, sunset viewpoints, fado nights, and river walks",
  },
  amsterdam: {
    city: "Amsterdam",
    food: "Indonesian meals, brown-cafe plates, bakeries, markets, natural-wine rooms, canal-side cafes, and reservation dinners",
    nightlife: "brown cafes, cocktail rooms, clubs, canal bars, Noord venues, music rooms, and relaxed late stops outside the busiest core",
    culture: "major museums, canal houses, design, maritime history, galleries, memorials, and neighborhood streets shaped by water",
    stay: "canal charm, museum access, tram convenience, Noord value, or quieter west and south bases away from peak old-center pressure",
    nature: "parks, canals, ferries, river edges, dunes, beaches, and day trips that make the city feel less compressed",
    activities: "museum anchors, canal walks, market meals, ferry hops, bikeable neighborhoods, park breaks, and brown-cafe evenings",
  },
  madrid: {
    city: "Madrid",
    food: "tapas streets, market halls, old taverns, modern Spanish rooms, vermouth stops, bakeries, and very late dinners",
    nightlife: "vermouth bars, cocktail rooms, Chueca nights, clubs, plaza drinks, flamenco rooms, and social streets that run late",
    culture: "Prado-triangle museums, royal sites, literary streets, galleries, plazas, markets, and neighborhood rituals",
    stay: "Gran Via access, Salamanca polish, Chueca nightlife, La Latina evenings, Chamberi calm, or Retiro-side breathing room",
    nature: "Retiro, Casa de Campo, Madrid Rio, garden walks, palace edges, and day trips that offset museum-heavy days",
    activities: "museum mornings, market lunches, plaza walks, Retiro resets, tapas crawls, vermouth pauses, and late dinners",
  },
  prague: {
    city: "Prague",
    food: "beer halls, Czech kitchens, cafes, bakeries, modern rooms, market stops, and meals that escape the old-town churn",
    nightlife: "pubs, beer gardens, cocktail rooms, clubs, jazz cellars, and Zizkov or Vinohrady nights beyond the busiest squares",
    culture: "castle routes, Jewish Quarter history, old-town lanes, museums, design stops, bridges, and Vltava viewpoints",
    stay: "Old Town access, Mala Strana charm, Vinohrady calm, Karlin practicality, or Letna views with better breathing room",
    nature: "Letna, Petrin, river islands, Vltava walks, hill views, beer gardens, and park routes between dense historic stops",
    activities: "castle mornings, bridge crossings, beer-hall meals, cafe pauses, gallery stops, river walks, and less crowded districts",
  },
  berlin: {
    city: "Berlin",
    food: "Turkish counters, modern German rooms, third-wave cafes, natural-wine bistros, market halls, bakeries, and currywurst stops",
    nightlife: "smoky kneipen, canal bars, queer dance floors, techno institutions, courtyard clubs, and low-key late rooms",
    culture: "Museum Island, Wall sites, memorials, Bauhaus traces, galleries, repurposed industrial spaces, and Cold War geography",
    stay: "Mitte museum access, Kreuzberg or Friedrichshain nightlife, Charlottenburg calm, Prenzlauer Berg apartments, or transit-first bases",
    nature: "Tiergarten, Tempelhofer Feld, canal paths, palace gardens, lakeside trips, Spree walks, and neighborhood park breaks",
    activities: "stitched districts with museums, Wall history, market halls, canal walks, park resets, galleries, dinner, and late bars",
  },
  "new-york-city": {
    city: "New York City",
    food: "borough-specific restaurants, bagel and slice stops, Chinatown counters, tasting menus, bakeries, diners, and late meals",
    nightlife: "cocktail rooms, dives, jazz clubs, dance floors, theater-adjacent bars, hotel lounges, and late food by subway line",
    culture: "major museums, theater, architecture, parks, galleries, street history, immigrant neighborhoods, and waterfront views",
    stay: "Manhattan convenience, Brooklyn nightlife, Queens food routes, downtown energy, uptown museum access, or transit-first value",
    nature: "Central Park, Prospect Park, waterfronts, islands, beaches, river paths, gardens, and skyline-facing promenades",
    activities: "landmark anchors, neighborhood walks, museum time, food detours, park resets, theater nights, and subway-linked plans",
  },
  miami: {
    city: "Miami",
    food: "Cuban counters, Caribbean rooms, seafood, hotel dining, chef-led restaurants, bakeries, late meals, and neighborhood cafes",
    nightlife: "clubs, rooftops, cocktail rooms, beach bars, hotel lounges, Wynwood nights, and Brickell rooms that run late",
    culture: "Art Deco streets, Little Havana, galleries, museums, design districts, street art, and waterfront city layers",
    stay: "South Beach access, Mid-Beach resort calm, Brickell towers, Wynwood energy, Coconut Grove quiet, or car-friendly bases",
    nature: "beaches, bayfront parks, islands, canals, Everglades edges, Keys routes, and outdoor resets between late nights",
    activities: "beach mornings, Cuban meals, gallery blocks, hotel pools, rooftop sunsets, late clubs, and day trips beyond the city",
  },
  "los-angeles": {
    city: "Los Angeles",
    food: "taco routes, Korean food, farmers market meals, sushi rooms, neighborhood cafes, tasting menus, and beachside stops",
    nightlife: "cocktail rooms, music venues, comedy clubs, hotel bars, dance floors, neighborhood dives, and late food corridors",
    culture: "film history, museums, architecture, galleries, music rooms, street scenes, studio context, and hillside landmarks",
    stay: "beach bases, Hollywood access, West Hollywood nights, Downtown arts, Beverly Hills polish, or traffic-aware neighborhood plans",
    nature: "beaches, canyon hikes, Griffith Park, coastal drives, gardens, hill views, and outdoor breaks between car-heavy routes",
    activities: "tight neighborhood clusters with beach time, tacos, museums, shopping streets, canyon resets, shows, and late bars",
  },
  orlando: {
    city: "Orlando",
    food: "park-adjacent meals, resort dining, Mills 50 rooms, Winter Park lunches, food halls, group-friendly stops, and late bites",
    nightlife: "resort bars, downtown rooms, breweries, cocktail spots, after-park lounges, and low-friction nights near the base",
    culture: "theme-park design, museums, gardens, performance venues, Winter Park context, and family-friendly indoor anchors",
    stay: "park access, resort style, convention convenience, rental-car time, pool days, or quieter neighborhoods for reset nights",
    nature: "lakes, springs, gardens, wetlands, shaded parks, and easy day trips that give park-heavy plans some air",
    activities: "ticketed days, resort breaks, local meals, outlet runs, lake time, cocktail stops, and plans before or after parks",
  },
  "san-francisco": {
    city: "San Francisco",
    food: "neighborhood restaurants, bakeries, seafood, Mission counters, dim sum, tasting menus, wine bars, and ferry-side meals",
    nightlife: "cocktail bars, dives, queer nightlife, music rooms, wine bars, hotel lounges, and neighborhood nights on steep streets",
    culture: "museums, architecture, waterfront history, Chinatown, Beat-era streets, murals, parks, and bay-facing landmarks",
    stay: "hill and transit tradeoffs, Union Square access, waterfront stays, neighborhood hotels, safety blocks, and Marin reach",
    nature: "Golden Gate Park, the Presidio, beaches, bay walks, hill viewpoints, ferry routes, and Marin day edges",
    activities: "compact walks with ferry views, park time, museums, neighborhood meals, cocktail rooms, and scenic climbs",
  },
  "las-vegas": {
    city: "Las Vegas",
    food: "casino dining, Chinatown rooms, buffets, celebrity restaurants, late meals, resort food halls, and off-Strip counters",
    nightlife: "clubs, lounges, cocktail bars, shows, downtown bars, pool parties, and reservation-heavy rooms with strict timing",
    culture: "shows, neon, museums, residencies, casino spectacle, downtown history, and desert-facing entertainment",
    stay: "Strip resort zones, downtown value, convention access, pool priorities, casino style, and budget or recovery needs",
    nature: "Red Rock, Valley of Fire, Hoover Dam, desert drives, canyon views, and early starts that beat heat and crowds",
    activities: "restaurant bookings, showtimes, pool blocks, casino walks, downtown nights, Chinatown meals, and desert resets",
  },
  "washington-dc": {
    city: "Washington, DC",
    food: "power dining, neighborhood restaurants, markets, Ethiopian and international corridors, bakeries, and museum-day meals",
    nightlife: "cocktail rooms, pubs, jazz, Adams Morgan and U Street energy, hotel bars, and post-museum social routes",
    culture: "Smithsonian museums, monuments, politics, Black history, galleries, memorials, embassies, and civic architecture",
    stay: "Metro access, museum reach, Georgetown charm, Dupont nightlife, Capitol Hill calm, or conference-friendly hotel zones",
    nature: "the National Mall, Rock Creek Park, waterfronts, gardens, river paths, and day trips that break up museum days",
    activities: "free museums, monument walks, neighborhood meals, market stops, jazz nights, waterfront breaks, and Metro-linked days",
  },
  chicago: {
    city: "Chicago",
    food: "neighborhood dining, taverns, tasting menus, Mexican food, bakeries, market halls, steakhouses, and deep-dish context",
    nightlife: "cocktail rooms, dives, blues and jazz clubs, breweries, rooftops, sports bars, and train-linked late neighborhoods",
    culture: "architecture, museums, public art, neighborhood history, theaters, music, riverfront landmarks, and lakefront identity",
    stay: "Loop convenience, River North nightlife, West Loop dining, lakefront access, neighborhood hotels, or train-first bases",
    nature: "the lakefront, beaches, parks, river walks, conservatories, skyline paths, and seasonal outdoor plans",
    activities: "architecture routes, museum blocks, lakefront time, neighborhood meals, sports nights, music rooms, and weather-aware days",
  },
  boston: {
    city: "Boston",
    food: "seafood, Italian rooms, bakeries, college-area meals, modern reservations, pubs, markets, and harbor-side stops",
    nightlife: "pubs, cocktail bars, sports nights, music rooms, Cambridge and Somerville bars, and compact after-dinner routes",
    culture: "Freedom Trail context, museums, universities, harbor history, literary sites, sports culture, and old neighborhood streets",
    stay: "Back Bay convenience, Beacon Hill charm, Seaport hotels, Cambridge access, North End evenings, or transit-first value",
    nature: "Boston Common, the Esplanade, harbor islands, river paths, gardens, coast trips, and campus green spaces",
    activities: "historic walks, seafood meals, museum time, campus detours, harbor views, pub nights, and compact transit-light days",
  },
  honolulu: {
    city: "Honolulu",
    food: "plate lunches, poke, Japanese and Hawaiian food, hotel dining, bakeries, Chinatown meals, and beach-day snacks",
    nightlife: "hotel bars, Chinatown rooms, beach drinks, live music, late food, resort lounges, and low-key island nights",
    culture: "Native Hawaiian history, palace sites, museums, surf culture, Chinatown, military context, and neighborhood markets",
    stay: "Waikiki convenience, quieter beach bases, Ala Moana access, Chinatown proximity, resort style, or car-friendly Oahu plans",
    nature: "beaches, hikes, lookouts, volcanic ridges, windward routes, North Shore drives, and oceanfront park breaks",
    activities: "surf time, plate lunches, hikes, palace context, beach resets, Chinatown nights, and weather-aware Oahu loops",
  },
  bangkok: {
    city: "Bangkok",
    food: "street food, noodles, markets, Thai fine dining, hotel rooms, mall food courts, river meals, and late-night bites",
    nightlife: "rooftops, cocktail bars, clubs, night markets, hotel lounges, Thonglor rooms, and Sukhumvit nights",
    culture: "temples, royal sites, canals, markets, shrines, contemporary art, river life, and old-city context",
    stay: "BTS/MRT access, riverside calm, Sukhumvit nightlife, Siam shopping, old-city sightseeing, or traffic-aware hotel bases",
    nature: "parks, river routes, canals, gardens, day trips, and shaded pauses that help with heat and traffic",
    activities: "temple mornings, market meals, mall breaks, river rides, rooftop sunsets, late food, and heat-aware pacing",
  },
  "hong-kong": {
    city: "Hong Kong",
    food: "dim sum, roast meats, dai pai dong, cha chaan teng, hotel dining, modern Cantonese rooms, and late Kowloon meals",
    nightlife: "cocktail bars, rooftops, live music, pub streets, hotel lounges, Central nights, and late Kowloon energy",
    culture: "temples, museums, markets, tram routes, ferries, colonial layers, Cantonese street life, and harbor history",
    stay: "Hong Kong Island access, Kowloon views, Central nightlife, Tsim Sha Tsui convenience, or MTR-first value",
    nature: "harborfronts, hikes, islands, beaches, peak views, country parks, and ferry-linked outdoor resets",
    activities: "ferry crossings, market walks, dim sum, tram rides, harbor views, hikes, cocktail rooms, and MTR-linked days",
  },
  macau: {
    city: "Macau",
    food: "Macanese kitchens, Portuguese rooms, bakeries, casino dining, street snacks, food streets, and old-town meals",
    nightlife: "casino lounges, shows, hotel bars, old-town drinks, Cotai spectacle, and low-friction late resort rooms",
    culture: "UNESCO streets, churches, temples, museums, Portuguese-Chinese layers, Senado Square, and compact old lanes",
    stay: "Cotai resorts, historic-core access, casino convenience, family suites, show logistics, or quieter Coloane edges",
    nature: "Coloane trails, beaches, hill walks, waterfronts, gardens, and open-air pauses beyond the casino floor",
    activities: "heritage walks, bakery stops, casino shows, Taipa meals, old-town wandering, and resort logistics",
  },
  dubai: {
    city: "Dubai",
    food: "hotel dining, global restaurants, Emirati context, mall meals, waterfront rooms, beach clubs, and late luxury tables",
    nightlife: "rooftops, beach clubs, lounges, hotel bars, booking-heavy clubs, marina rooms, and polished late nights",
    culture: "Al Fahidi, museums, mosques, galleries, souks, creek crossings, and old Dubai context beside the skyline",
    stay: "beach resorts, business towers, luxury malls, marina access, old Dubai texture, or drive-time-aware hotel bases",
    nature: "beaches, desert routes, creek rides, marinas, parks, mangroves, and heat-aware outdoor windows",
    activities: "mall breaks, beach time, desert evenings, heritage quarters, rooftop nights, marina walks, and booking-led days",
  },
  singapore: {
    city: "Singapore",
    food: "hawker centers, Peranakan rooms, modern dining, bakeries, hotel restaurants, neighborhood food streets, and late snacks",
    nightlife: "cocktail bars, rooftops, riverfront rooms, clubs, hotel lounges, speakeasy-style rooms, and compact late routes",
    culture: "heritage districts, museums, temples, mosques, civic architecture, shophouses, gardens, and waterfront spectacle",
    stay: "Marina Bay polish, Orchard shopping, Chinatown access, Kampong Glam texture, Sentosa resorts, or MRT-first convenience",
    nature: "Gardens by the Bay, Botanic Gardens, reservoirs, islands, waterfronts, park connectors, and humid-weather resets",
    activities: "hawker meals, heritage walks, garden time, museum stops, waterfront views, cocktail rooms, and climate-aware routing",
  },
  "kuala-lumpur": {
    city: "Kuala Lumpur",
    food: "nasi lemak, kopitiams, hawker streets, Malay, Chinese, and Indian routes, hotel dining, and modern rooms",
    nightlife: "rooftops, cocktail bars, clubs, hotel lounges, speakeasy-style rooms, and Bukit Bintang or Bangsar nights",
    culture: "mosques, temples, markets, museums, colonial streets, tower views, and layered Malay, Chinese, and Indian context",
    stay: "KLCC polish, Bukit Bintang shopping, Chinatown value, Bangsar evenings, transit access, or traffic-aware hotel bases",
    nature: "city parks, Batu Caves, gardens, hill views, day routes, and shaded breaks between malls and markets",
    activities: "tower views, hawker meals, market walks, cave trips, mall breaks, rooftop drinks, and heat-aware movement",
  },
  tokyo: {
    city: "Tokyo",
    food: "ramen counters, sushi rooms, izakaya, department-store food, neighborhood specialties, bakeries, and reservation meals",
    nightlife: "cocktail bars, izakaya lanes, clubs, jazz rooms, karaoke, hotel bars, and late districts by train line",
    culture: "temples, museums, design, anime and game culture, gardens, craft streets, and traditional-modern contrasts",
    stay: "rail-line convenience, Shinjuku energy, Ginza polish, Asakusa texture, Shibuya shopping, or quieter neighborhood bases",
    nature: "gardens, rivers, parks, shrine groves, bayfronts, mountain day trips, and seasonal blossom or foliage routes",
    activities: "station-clustered days with counter meals, shopping streets, temples, museums, gardens, izakaya nights, and train logic",
  },
  seoul: {
    city: "Seoul",
    food: "barbecue, markets, bunsik, cafes, fine dining, late-night meals, bakeries, and neighborhood food alleys",
    nightlife: "Hongdae energy, Itaewon bars, Gangnam clubs, pocha streets, cocktail rooms, live music, and all-night food",
    culture: "palaces, hanok streets, museums, design districts, markets, pop-culture areas, and mountain-backed city views",
    stay: "subway access, Myeongdong shopping, Hongdae nights, Gangnam polish, palace-area calm, or food-led neighborhood bases",
    nature: "mountains, river parks, palace gardens, city walls, day hikes, streams, and outdoor resets between dense districts",
    activities: "subway-linked clusters with palace walks, cafes, markets, barbecue nights, shopping, river parks, and late food",
  },
  phuket: {
    city: "Phuket",
    food: "old-town Thai and Peranakan food, beach seafood, resort dining, markets, casual local rooms, and sunset meals",
    nightlife: "Patong intensity, beach bars, resort lounges, sunset rooms, old-town drinks, and quieter nights by beach base",
    culture: "old-town architecture, temples, markets, local festivals, shrines, and island history beyond the resort strip",
    stay: "Patong nightlife, Kata and Karon beach ease, Rawai food routes, Bang Tao resorts, or quieter transport-aware bases",
    nature: "beaches, islands, viewpoints, parks, boat days, snorkeling routes, and weather-season choices",
    activities: "beach time, old-town meals, boat trips, viewpoint stops, night markets, resort resets, and driving-aware plans",
  },
  mecca: {
    city: "Mecca",
    food: "practical group meals, hotel dining, food courts, regional Saudi options, late service, and routes near pilgrimage movement",
    nightlife: "evening tea, hotel lounges, family-friendly late meals, shopping corridors, and post-prayer logistics rather than bar culture",
    culture: "Islamic sites, mosque access, pilgrimage history, respectful religious context, museums, and crowd-aware movement",
    stay: "Al Haram proximity, mobility needs, group size, prayer access, crowd flow, hotel services, and quieter recovery time",
    nature: "mountain views, desert context, shaded routes, regional day edges, and open-air pauses that respect pilgrimage priorities",
    activities: "pilgrimage movement, rest windows, meals near the route, shopping corridors, hotel recovery, and respectful pacing",
  },
  cancun: {
    city: "Cancun",
    food: "resort dining, seafood, taco stops, downtown meals, group-friendly rooms, beach lunches, and hotel-zone convenience",
    nightlife: "clubs, beach bars, lounges, resort rooms, hotel-zone logistics, late shows, and group nights with clear transport",
    culture: "Maya museum context, markets, downtown streets, day-trip heritage sites, and resort-city layers beyond the beach",
    stay: "all-inclusive ease, downtown value, family resorts, nightlife access, beach quality, or ferry and day-trip logistics",
    nature: "beaches, cenotes, lagoon routes, islands, reefs, mangroves, and Riviera Maya day trips",
    activities: "resort days, seafood stops, club nights, cenote trips, island ferries, Maya sites, and beach recovery time",
  },
  cusco: {
    city: "Cusco",
    food: "Andean kitchens, markets, cafes, pisco rooms, tasting menus, bakeries, and trek-friendly meals at altitude",
    nightlife: "pisco bars, traveler rooms, live music, low-key late stops, and altitude-aware nights that do not overreach",
    culture: "Inca walls, colonial churches, museums, ruins, Indigenous craft context, plazas, and Sacred Valley gateways",
    stay: "altitude, stairs, train logistics, San Blas charm, historic-center access, and recovery time before bigger routes",
    nature: "ruins, viewpoints, valley routes, trekking, mountain passes, and acclimatization-friendly outdoor plans",
    activities: "slow first days, market meals, Inca sites, pisco stops, Sacred Valley links, and Machu Picchu logistics",
  },
  "mexico-city": {
    city: "Mexico City",
    food: "tacos, markets, bakeries, contemporary Mexican rooms, seafood, fine dining, cantinas, and neighborhood cafes",
    nightlife: "mezcal bars, cocktail rooms, cantinas, clubs, Roma and Juarez energy, hotel bars, and late street food",
    culture: "museums, murals, pre-Hispanic sites, architecture, plazas, markets, canals, and layered political history",
    stay: "Roma and Condesa ease, Centro history, Polanco polish, Juarez nightlife, Coyoacan charm, or transit-aware bases",
    nature: "Chapultepec, canals, parks, volcanic edges, plazas, gardens, and day trips that balance dense neighborhoods",
    activities: "museum blocks, taco routes, market mornings, park resets, mezcal nights, canal trips, and altitude-aware pacing",
  },
  "buenos-aires": {
    city: "Buenos Aires",
    food: "parrillas, bodegones, cafes, bakeries, wine rooms, modern Argentine dining, markets, and long late dinners",
    nightlife: "tango rooms, cocktail bars, wine bars, clubs, Palermo nights, San Telmo energy, and post-dinner social routes",
    culture: "cemeteries, theaters, bookstores, museums, street art, football context, plazas, and literary cafe culture",
    stay: "Palermo nightlife, Recoleta elegance, San Telmo texture, Microcentro access, or quieter leafy residential bases",
    nature: "parks, waterfronts, gardens, plazas, the ecological reserve, and delta day trips that loosen city days",
    activities: "slow mornings, cafe time, market walks, parrilla dinners, tango nights, bookstore stops, and barrio-by-barrio routes",
  },
  "rio-de-janeiro": {
    city: "Rio de Janeiro",
    food: "botecos, seafood, churrasco, bakeries, modern Brazilian rooms, beach meals, juice bars, and neighborhood lunches",
    nightlife: "samba, Lapa bars, beach kiosks, cocktail rooms, late clubs, live music, and nights shaped by safety and transport",
    culture: "music, museums, colonial streets, architecture, football, carnival context, and neighborhood history",
    stay: "Ipanema or Copacabana beach access, Leblon polish, Santa Teresa charm, Botafogo practicality, or safety-led bases",
    nature: "beaches, mountains, gardens, lagoons, viewpoints, forest routes, and weather-dependent outdoor windows",
    activities: "viewpoint mornings, beach time, boteco meals, samba nights, garden walks, museum stops, and safety-aware routing",
  },
  lima: {
    city: "Lima",
    food: "ceviche, Nikkei, criollo rooms, markets, tasting menus, bakeries, neighborhood seafood, and lunch-led planning",
    nightlife: "Barranco bars, cocktail rooms, live music, hotel lounges, late restaurants, and coastal neighborhood nights",
    culture: "pre-Columbian museums, colonial streets, galleries, coastal history, plazas, churches, and creative Barranco routes",
    stay: "Miraflores cliff access, Barranco nights, San Isidro business calm, historic-center reach, or dining-led hotel bases",
    nature: "malecon parks, beaches, wetlands, cliffs, surf edges, and desert or coast day trips",
    activities: "ceviche lunches, museum time, cliff walks, Barranco evenings, market stops, colonial routes, and coastal pacing",
  },
  medellin: {
    city: "Medellin",
    food: "Colombian kitchens, cafes, tasting menus, arepa and bakery stops, market meals, and El Poblado or Laureles rooms",
    nightlife: "Provenza bars, rooftops, salsa rooms, clubs, low-key local bars, and late plans shaped by safe transport",
    culture: "transformation stories, museums, public transport, street art, plazas, Comuna 13 context, and valley geography",
    stay: "El Poblado nightlife, Laureles calm, Envigado local rhythm, Provenza access, or mobility and safety-led bases",
    nature: "hill views, parks, cable cars, botanical gardens, mountain day trips, and open-air routes in spring weather",
    activities: "metro rides, cafe mornings, Comuna 13 context, park resets, Colombian meals, rooftop nights, and valley views",
  },
  quito: {
    city: "Quito",
    food: "Ecuadorian kitchens, markets, cafes, chocolate, modern rooms, view-led meals, and high-altitude comfort stops",
    nightlife: "La Mariscal bars, craft beer, cocktail rooms, cultural nights, hotel lounges, and quieter altitude-aware evenings",
    culture: "churches, plazas, museums, Indigenous context, colonial streets, equator routes, and volcano-backed history",
    stay: "Centro Historico texture, La Floresta food, Mariscal nightlife, La Carolina convenience, or altitude and safety-led bases",
    nature: "volcano views, parks, Teleferico, cloud forest edges, equator trips, and weather-aware mountain routes",
    activities: "historic walks, market meals, church interiors, viewpoint rides, chocolate stops, equator context, and altitude pacing",
  },
  "antigua-guatemala": {
    city: "Antigua Guatemala",
    food: "courtyard restaurants, Guatemalan kitchens, coffee, bakeries, rooftop meals, markets, and relaxed traveler-friendly rooms",
    nightlife: "rooftop bars, mezcal and cocktail rooms, traveler pubs, live music, quiet courtyards, and early starts for hikes",
    culture: "church ruins, textiles, markets, colonial streets, Spanish-school rhythm, coffee context, and volcano-framed plazas",
    stay: "walkable historic bases, courtyard hotels, volcano views, quiet streets, hostel social energy, or day-trip logistics",
    nature: "volcano hikes, viewpoints, coffee farms, Lake Atitlan routes, gardens, and weather-aware outdoor windows",
    activities: "cobblestone walks, coffee stops, ruin visits, market browsing, rooftop sunsets, volcano plans, and slow courtyard time",
  },
  bogota: {
    city: "Bogota",
    food: "Colombian regional rooms, markets, cafes, tasting menus, bakeries, coffee stops, and neighborhood restaurants",
    nightlife: "Chapinero bars, clubs, cocktail rooms, live music, Zona T social energy, and late plans shaped by traffic and safety",
    culture: "museums, colonial streets, street art, politics, mountain context, plazas, and La Candelaria history",
    stay: "La Candelaria culture, Chapinero bars, Zona G dining, Usaquen calm, Parque 93 polish, or commute-aware bases",
    nature: "Monserrate, parks, bike routes, mountain views, wetlands, and day trips that break up the high-altitude city",
    activities: "museum mornings, coffee stops, market meals, street-art walks, Monserrate views, Chapinero nights, and traffic-aware days",
  },
};

const categoryCityDescriptionOverrides: Record<string, Partial<Record<ListCategory, string>>> = Object.fromEntries(
  Object.entries(categoryCityDescriptionProfiles).map(([cityId, profile]) => [
    cityId,
    buildCategoryDescriptionOverride(profile),
  ]),
);

function buildScopedCategoryDescription(
  profile: CategoryDescriptionProfile | undefined,
  category: ListCategory | undefined,
  placeLabel: string,
  cityName: string,
) {
  if (!profile || !category) {
    return null;
  }

  const categoryAngles: Record<ListCategory, string> = {
    Food: profile.food,
    Nightlife: profile.nightlife,
    Culture: profile.culture,
    Stay: profile.stay,
    Nature: profile.nature,
    Activities: profile.activities,
    Routes: profile.routes ?? profile.activities,
    Essentials: profile.essentials ?? profile.routes ?? profile.stay,
  };

  return `${category} in ${placeLabel} should still feel specific to ${cityName}, not like a generic category filter. Use this view for ${categoryAngles[category]}, with stops close enough to work as a real neighborhood route.`;
}
const explorerDescriptionCharacterLimit = 320;

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
}: {
  cityId?: string;
  cityName?: string;
  coordinates?: [number, number];
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
      className="absolute right-5 top-5 z-20 flex max-w-[7rem] items-start justify-end gap-1.5 text-right text-xs text-slate-600"
      title={weather ? `${cityName ?? "City"} weather: ${Math.round(weather.temperature)}°C, ${weather.condition}` : "Loading weather"}
      aria-live="polite"
    >
      <CloudSun className="h-8 w-8 shrink-0 self-stretch text-orange-500" aria-hidden="true" />
      {weather ? (
        <span className="min-w-0 leading-tight">
          <span className="block text-sm font-semibold text-slate-900">
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

function getCityHighlightSearchText(list: MapList) {
  return [
    list.title,
    list.seoTitle,
    list.seoDescription,
    list.description,
    list.slug,
    list.location.neighborhood,
    ...list.stops.map((stop) => stop.description),
  ]
    .filter((value): value is string => Boolean(value))
    .join(" ")
    .toLowerCase();
}

function doesGuideMatchHighlightTheme(list: MapList, theme: string) {
  const text = getCityHighlightSearchText(list);

  switch (theme) {
    case "Tapas":
      return /\b(tapas|pintxos|bites|counter|cava|vermouth|blai)\b/.test(text);
    case "Seafood":
      return /\b(seafood|fish|shellfish|clams|squid|rice)\b/.test(text);
    case "Michelin-level dining":
    case "Michelin":
      return /\b(michelin|tasting menu|fine dining|chef-led|destination restaurant|special-occasion)\b/.test(text);
    case "Late hours":
    case "Late":
      return /\b(late|late-night|nightlife|after-dark|party|club|apolo)\b/.test(text);
    case "Bar hopping zones":
    case "Bars":
      return /\b(bar hopping|bar circuit|bars|pub|vermouth|plaza|old-city|neighborhood)\b/.test(text);
    case "Cocktail bars":
    case "Cocktails":
      return /\b(cocktail|speakeasy|popular bars|destination nightlife)\b/.test(text);
    case "Architecture":
      return /\b(architecture|gaudi|gaudí|modernista|gothic|landmark)\b/.test(text);
    case "Museums":
      return /\b(museum|museums|gallery|galleries|collection|artist)\b/.test(text);
    case "Historic quarters":
    case "History":
      return /\b(historic|old-city|old city|quarter|cathedral|heritage|memory)\b/.test(text);
    case "Boutique hotels":
    case "Boutique":
      return /\b(boutique|hotel|design|private rooms|stylish)\b/.test(text);
    case "Social hostels":
    case "Hostels":
      return /\b(hostel|hostels|dorm|social|solo travelers|backpackers)\b/.test(text);
    case "Walkable bases":
    case "Walkable":
      return /\b(walkable|base|location|transit|neighborhood|walking)\b/.test(text);
    case "Social":
      return /\b(social|bars|nightlife|hostel|group|solo travelers)\b/.test(text);
    case "High energy":
    case "Energy":
      return /\b(high energy|weekend|nightcap|party|busy|packed|circuit)\b/.test(text);
    case "Views":
      return /\b(view|views|lookout|hilltop|scenic|panorama)\b/.test(text);
    case "Urban parks":
      return /\b(park|parks|gardens|green)\b/.test(text);
    case "Waterfront":
      return /\b(waterfront|coastal|beach|river|harbor|harbour)\b/.test(text);
    default:
      return false;
  }
}

function getDarkCategoryTextColor(category: ListCategory) {
  const color = CATEGORY_STYLES[category].mapColor;
  const normalized = color.startsWith("#") ? color.slice(1) : color;

  if (normalized.length !== 6) {
    return color;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  if (![red, green, blue].every(Number.isFinite)) {
    return color;
  }

  const mix = (channel: number) => Math.round(channel * 0.34);
  const toHex = (channel: number) => mix(channel).toString(16).padStart(2, "0");

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

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

export function SplitScreenSection({
  continents,
  initialEditorialGuides = [],
  initialRouteState,
  seoContent,
  publicProfile,
}: SplitScreenSectionProps) {
  seedInitialEditorialGuides(initialEditorialGuides);

  useEffect(() => {
    document.documentElement.classList.add("rguide-split-screen-ready");

    return () => {
      document.documentElement.classList.remove("rguide-split-screen-ready");
    };
  }, []);

  const currentUser = useAppStore((state) => state.currentUser);
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);
  const isProfileShellActive = useAppStore((state) => state.isProfileShellActive);
  const openAuthModal = useAppStore((state) => state.openAuthModal);
  const setProfileShellActive = useAppStore((state) => state.setProfileShellActive);
  const setEditorialLists = useAppStore((state) => state.setEditorialLists);
  const favoriteIds = useAppStore((state) => state.favoriteIds);
  const favoriteLocations = useAppStore((state) => state.favoriteLocations);
  const toggleFavoriteLocation = useAppStore((state) => state.toggleFavoriteLocation);
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
  const hydratedEditorialLists = editorialLists.length ? editorialLists : initialEditorialGuides;
  const activeEditorialLists = useMemo(
    () => getEditorialLists(hydratedEditorialLists),
    [hydratedEditorialLists],
  );
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
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const [isMobileExplorerSearchOpen, setIsMobileExplorerSearchOpen] = useState(false);
  const [hoveredGuide, setHoveredGuide] = useState<MapList | null>(null);
  const [hoveredStopId, setHoveredStopId] = useState<string | null>(null);
  const [visibleNestedStopParentIds, setVisibleNestedStopParentIds] = useState<string[]>([]);
  const [selectedGuideStopId, setSelectedGuideStopId] = useState<string | null>(null);
  const [selectedGuideStopNonce, setSelectedGuideStopNonce] = useState(0);
  const [activeGuideFitNonce, setActiveGuideFitNonce] = useState(0);
  const [activeGuideRail, setActiveGuideRail] = useState<(typeof guideRailOptions)[number]["id"]>("all-guides");
  const [isLocationFavoritesRailActive, setIsLocationFavoritesRailActive] = useState(false);
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>(initialRouteState?.expandedGuideId ?? null);
  const [pendingSourcesOpenGuideId, setPendingSourcesOpenGuideId] = useState<string | null>(null);
  const [closingGuide, setClosingGuide] = useState<MapList | null>(null);
  const [closingGuidePhase, setClosingGuidePhase] = useState<"returning" | "collapsing" | null>(null);
  const [openingGuideId, setOpeningGuideId] = useState<string | null>(null);
  const [settlingGuideContentId, setSettlingGuideContentId] = useState<string | null>(null);
  const [isMobileListSheetExpanded, setIsMobileListSheetExpanded] = useState(false);

  useEffect(() => {
    if (!initialEditorialGuides.length) {
      return;
    }

    if (!areGuideCollectionsEquivalent(useAppStore.getState().editorialLists, initialEditorialGuides)) {
      setEditorialLists(initialEditorialGuides);
    }
  }, [initialEditorialGuides, setEditorialLists]);
  const [isMobileListSheetDragging, setIsMobileListSheetDragging] = useState(false);
  const [mobileListSheetDragHeight, setMobileListSheetDragHeight] = useState<number | null>(null);
  const mobileListSheetDraggingRef = useRef(false);
  const mobileListSheetDragStartRef = useRef({ y: 0, height: 0 });
  const mobileListSheetTapCandidateRef = useRef(false);
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
  const guideLayoutMotionRef = useRef<"default" | "open" | "close">("default");
  const guideLayoutAnimationFramesRef = useRef<ReturnType<typeof requestAnimationFrame>[]>([]);
  const guideLayoutCleanupTimeoutsRef = useRef<number[]>([]);
  const closingGuideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openingGuideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openingGuideIdRef = useRef<string | null>(null);
  const guideContentRevealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const guideContentRevealFrameRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
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
  const deferGuideContentUntilMotionSettles = (guideId: string) => {
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
    }, GUIDE_CONTENT_REVEAL_DELAY_MS);
  };
  const isPublicProfileMode = Boolean(publicProfile);
  const [isPublicProfileEntering, setIsPublicProfileEntering] = useState(isPublicProfileMode);
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
  const categoryBeforeGuideExpandRef = useRef<ListCategory | null>(
    initialRouteState?.expandedGuideId ? initialRouteState.activeCategory ?? null : null,
  );

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
      const citySegments = window.location.pathname.split("/").filter(Boolean);
      if (citySegments[0] !== "city") {
        return;
      }
      const route = resolveCityDeepLink(citySegments.slice(1), {
        continents,
        guides: activeEditorialLists,
      });
      if (!route) {
        return;
      }

      const currentGuideId = expandedGuideIdRef.current;
      setIsLocationFavoritesRailActive(false);
      setSelection(route.selection);
      setActiveCategory(route.activeCategory ?? null);
      setActiveSubcategory(null);
      setExpandedGuideId(route.expandedGuideId ?? null);
      setClosingGuide(null);
      setVisibleNestedStopParentIds([]);
      if (route.expandedGuideId && currentGuideId !== route.expandedGuideId) {
        setActiveGuideFitNonce((current) => current + 1);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeEditorialLists, continents]);

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
  const restoreCategoryAfterGuideCollapse = () => {
    const restoredCategory = categoryBeforeGuideExpandRef.current;
    categoryBeforeGuideExpandRef.current = null;
    setActiveCategory(restoredCategory);
    return restoredCategory;
  };
  const handleSelectContinent = (continentId: string) => {
    setFocusedCountrySignal(null);
    setIsLocationFavoritesRailActive(false);
    setSelection(() => ({ continentId }));
  };
  const handleResetToGlobalView = () => {
    setFocusedCountrySignal(null);
    setIsLocationFavoritesRailActive(false);
    setSelection({});
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
      setProfilePlacesBeenMapSelection({ continentId, countryId });
      return;
    }
    setFocusedCountrySignal({ countryId, nonce: Date.now() });
    setIsLocationFavoritesRailActive(false);
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
  const getCollapsedLocationSubtitleHiddenParts = (list: MapList) => {
    const hiddenParts: string[] = [];
    const addHiddenPart = (value?: string | null) => {
      const trimmedValue = value?.trim();
      if (trimmedValue) {
        hiddenParts.push(trimmedValue);
      }
    };

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
        if (activeNeighborhood && locationsMatch(list.location.neighborhood, activeNeighborhood.name)) {
          addHiddenPart(activeNeighborhood.name);
        }
        addHiddenPart(activeLocation.city.name);
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
    setClosingGuide(null);

    const context = getCityRouteContext(location.selection);
    if (context?.neighborhood) {
      pushExplorerPath(getCanonicalCityNeighborhoodPath(context.city, context.neighborhood));
    } else if (context?.city) {
      pushExplorerPath(getCanonicalCityPath(context.city));
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
              : isGlobalSelection
                ? list.location.scope === "continent" && list.location.continent === "Global"
                : false),
      ),
    [activeLocation.city, activeLocation.continent, activeLocation.country, currentUser?.id, isGlobalSelection, submittedLists],
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
      submissionType: "itinerary",
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
      submissionType: "itinerary",
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
    if (isPublicProfileMode) {
      return publicProfileGuideLists
        .slice()
        .sort((left, right) => right.upvotes - left.upvotes || left.title.localeCompare(right.title));
    }

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
    const isRGuideList = (list: MapList) => list.creator.name.startsWith("R ");
    const isUserGuideList = (list: MapList) =>
      !isRGuideList(list) &&
      list.submissionType !== "journal" &&
      !isItineraryList(list, allKnownItineraryListIds);

    if (activeGuideRail === "all-guides") {
      return filteredLists.filter((list) => isRGuideList(list) || isUserGuideList(list));
    }
    if (activeGuideRail === "r-guides") {
      return filteredLists.filter(isRGuideList);
    }
    if (activeGuideRail === "user-guides") {
      return filteredLists.filter(isUserGuideList);
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
          itineraryIds.includes(list.id) ||
          playlistListIds.has(list.id) ||
          isItineraryList(list, allKnownItineraryListIds),
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
  }, [
    activeGuideRail,
    favoriteIds,
    filteredLists,
    globalMergedLists,
    isPublicProfileMode,
    itineraryIds,
    itineraryPlaylists,
    publicProfileGuideLists,
    votedIds,
  ]);
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
  const categoryOptionMidpoint = Math.ceil(categoryOptions.length / 2);
  const guideSourceSelectors = [
    { id: "all-guides" as const, label: "All guides", shortLabel: "All", icon: null },
    { id: "r-guides" as const, label: "R guides", shortLabel: "R", icon: null },
    { id: "user-guides" as const, label: "User guides", shortLabel: "User", icon: UserRound },
  ];
  const guideActionSelectors = [
    { id: "itinerary" as const, label: "Itineraries", shortLabel: "Trip", icon: Route },
    { id: "favorites" as const, label: "Favorites", shortLabel: "Fav", icon: Heart },
    { id: "week-events" as const, label: "This Week", shortLabel: "Week", icon: CalendarDays },
  ];
  const menuBarSelectors = [...guideSourceSelectors, ...guideActionSelectors];
  const activeGuideSourceSelector =
    guideSourceSelectors.find((selector) => selector.id === activeGuideRail) ?? guideSourceSelectors[0];
  const isGuideSourceRailActive = guideSourceSelectors.some((selector) => selector.id === activeGuideRail);
  const activeGuideSourceIndex = Math.max(
    0,
    guideSourceSelectors.findIndex((selector) => selector.id === activeGuideSourceSelector.id),
  );
  const activeMobileGuideSelector =
    menuBarSelectors.find((selector) => selector.id === activeGuideRail) ?? menuBarSelectors[0];
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
  };
  const handleLocationFavoritesRailToggle = () => {
    const nextActive = !isLocationFavoritesRailActive;
    setIsLocationFavoritesRailActive(nextActive);
    setExpandedGuideId(null);
    setClosingGuide(null);
    setVisibleNestedStopParentIds([]);

    if (nextActive) {
      resetCategoryFilters();
      setActiveGuideRail("all-guides");
    }
  };
  const handleGuideRailSelect = (railId: (typeof guideRailOptions)[number]["id"]) => {
    setActiveGuideRail(railId);
    setIsLocationFavoritesRailActive(false);
    setExpandedGuideId(null);
    setClosingGuide(null);
    setVisibleNestedStopParentIds([]);

    if (railId === "favorites") {
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
      if (isGuideTakingFullListPane) {
        setExpandedGuideId(null);
        restoreCategoryAfterGuideCollapse();
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
    setIsLocationFavoritesRailActive(false);
    setActiveSubcategory(null);
    setActiveFoodPrice(null);
    setActiveFoodOpenTime("Now");
    setIsFoodOpenTimeMenuOpen(false);
    setActiveFoodCuisine(FOOD_CUISINE_ANY);
    setIsFoodCuisineMenuOpen(false);
    setActiveNightlifeBarType(NIGHTLIFE_BAR_TYPE_ANY);
    setIsNightlifeBarMenuOpen(false);
    setExpandedGuideId(null);
    categoryBeforeGuideExpandRef.current = null;
    setClosingGuide(null);
    setActiveCategory(nextCategory);
    const nextPath = getCurrentCityRoutePath(nextCategory);
    if (nextPath) {
      pushExplorerPath(nextPath);
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
    setClosingGuidePhase(null);
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
      if (openingGuideTimeoutRef.current) {
        clearTimeout(openingGuideTimeoutRef.current);
      }
      if (guideContentRevealTimeoutRef.current) {
        clearTimeout(guideContentRevealTimeoutRef.current);
      }
      if (guideContentRevealFrameRef.current) {
        cancelAnimationFrame(guideContentRevealFrameRef.current);
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
      guideLayoutCleanupTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  useEffect(() => {
    if (!expandedGuideId) {
      return;
    }

    const expandedList =
      railFilteredLists.find((list) => list.id === expandedGuideId) ??
      globalMergedLists.find((list) => list.id === expandedGuideId);

    if (expandedList) {
      setActiveCategory(expandedList.category);
    }
  }, [expandedGuideId, globalMergedLists, railFilteredLists]);

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
    railFilteredLists.find((list) => list.id === expandedGuideId) ??
    globalMergedLists.find((list) => list.id === expandedGuideId) ??
    null;
  const displayedGuide = expandedGuide;
  const activeMapGuide = isProfileSubmitLayout
    ? profileSubmissionPreviewList
    : isProfileMode
      ? profileExpandedGuide
      : expandedGuide;
  const isGuideTakingFullListPane = Boolean(expandedGuide && activeGuideRail !== "itinerary" && !isPublicProfileMode);
  const isGuideReturningToListPane = Boolean(closingGuide && closingGuidePhase === "returning" && activeGuideRail !== "itinerary" && !isPublicProfileMode);
  const isGuidePaneTakingFullListPane = isGuideTakingFullListPane || isGuideReturningToListPane;
  const isLeftPaneCollapsed = isProfileSubmitLayout || isGuidePaneTakingFullListPane || isProfileGuideTakingFullListPane;
  const isSubcategoryMenuOpen =
    isFoodOpenTimeMenuOpen || isFoodCuisineMenuOpen || isNightlifeBarMenuOpen;
  const isSavedPlacesRailActive = isLocationFavoritesRailActive && !expandedGuide;
  const remainingGuides = displayedGuide
    ? railFilteredLists.filter((list) => list.id !== displayedGuide.id)
    : railFilteredLists;
  const recentRGuideLists = useMemo(() => {
    if (!isGlobalSelection || (activeGuideRail !== "all-guides" && activeGuideRail !== "r-guides")) {
      return [];
    }

    const worldwideGuideIds = new Set(railFilteredLists.map((list) => list.id));
    const baseRecentLists = activeCategory
      ? globalMergedLists.filter((list) => list.category === activeCategory)
      : globalMergedLists;

    return baseRecentLists
      .filter(
        (list) =>
          list.creator.name.startsWith("R ") &&
          list.location.city?.toLowerCase() === "barcelona" &&
          !worldwideGuideIds.has(list.id),
      )
      .slice()
      .sort((left, right) => {
        const rightDate = Date.parse(right.createdAt);
        const leftDate = Date.parse(left.createdAt);
        const rightTime = Number.isFinite(rightDate) ? rightDate : 0;
        const leftTime = Number.isFinite(leftDate) ? leftDate : 0;
        return rightTime - leftTime || right.upvotes - left.upvotes || left.title.localeCompare(right.title);
      })
      .slice(0, 20);
  }, [activeGuideRail, activeCategory, globalMergedLists, isGlobalSelection, railFilteredLists]);
  const activeSeoPlaceLabel = activeLocation.city
    ? activeLocation.nestedSubarea?.name ?? activeLocation.subarea?.name ?? activeLocation.city.name
    : activeDirectoryMeta.title;
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
      const items = cityHighlightThemes[entry.category].flatMap((theme) => {
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
  }, [activeLocation.city, activeNeighborhoodKey, allActiveLists]);
  useEffect(() => {
    if (!isGuidePaneTakingFullListPane) {
      return;
    }
    setIsFoodOpenTimeMenuOpen(false);
    setIsFoodCuisineMenuOpen(false);
    setIsNightlifeBarMenuOpen(false);
    setHoveredCategoryLabel(null);
    setIsMobileListSheetExpanded(true);
  }, [isGuidePaneTakingFullListPane]);
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
  const captureGuideLayoutPositions = (motion: "default" | "open" | "close" = "default") => {
    guideLayoutAnimationFramesRef.current.forEach((frame) => cancelAnimationFrame(frame));
    guideLayoutAnimationFramesRef.current = [];
    guideLayoutCleanupTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    guideLayoutCleanupTimeoutsRef.current = [];
    guideLayoutMotionRef.current = motion;
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
    const guideLayoutMotion = guideLayoutMotionRef.current;
    guideLayoutMotionRef.current = "default";

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
      const scaleX = previousRect.width > 0 && nextRect.width > 0 ? previousRect.width / nextRect.width : 1;
      const stageSidewaysFirst = (guideLayoutMotion === "open" || guideLayoutMotion === "close") && Math.abs(deltaX) > 8 && Math.abs(deltaY) > 8;

      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
        return [];
      }

      element.style.transition = "none";
      element.style.transformOrigin = stageSidewaysFirst && guideLayoutMotion === "open" ? "top left" : "";
      element.style.transform = stageSidewaysFirst && guideLayoutMotion === "open"
        ? `translate(${deltaX}px, ${deltaY}px) scaleX(${scaleX})`
        : `translate(${deltaX}px, ${deltaY}px)`;
      element.style.willChange = "transform";

      return [
        {
          deltaX,
          deltaY,
          element,
          reverseSidewaysFirst: guideLayoutMotion === "close",
          scaleX,
          stageSidewaysFirst,
        },
      ];
    });

    guideLayoutPositionsRef.current = {};

    if (!changedElements.length) {
      return;
    }

    const animationFrame = requestAnimationFrame(() => {
      changedElements.forEach(({ deltaX, deltaY, element, reverseSidewaysFirst, scaleX, stageSidewaysFirst }) => {
        if (stageSidewaysFirst) {
          if (reverseSidewaysFirst) {
            element.style.transition = `transform ${GUIDE_LAYOUT_OPEN_UP_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
            element.style.transform = `translate(${deltaX}px, 0)`;
            const sidewaysTimeout = window.setTimeout(() => {
              element.style.transition = `transform ${GUIDE_LAYOUT_OPEN_SIDEWAYS_MS}ms cubic-bezier(0.33, 1, 0.68, 1)`;
              element.style.transform = "translate(0, 0)";
              guideLayoutCleanupTimeoutsRef.current = guideLayoutCleanupTimeoutsRef.current.filter(
                (timeoutId) => timeoutId !== sidewaysTimeout,
              );
            }, GUIDE_LAYOUT_CLOSE_SIDEWAYS_START_MS);
            guideLayoutCleanupTimeoutsRef.current.push(sidewaysTimeout);
            return;
          }

          element.style.transition = `transform ${GUIDE_LAYOUT_OPEN_SIDEWAYS_MS}ms cubic-bezier(0.33, 1, 0.68, 1)`;
          element.style.transform = `translate(0, ${deltaY}px) scaleX(1)`;
          const verticalTimeout = window.setTimeout(() => {
            element.style.transition = `transform ${GUIDE_LAYOUT_OPEN_UP_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
            element.style.transform = "translate(0, 0) scaleX(1)";
            guideLayoutCleanupTimeoutsRef.current = guideLayoutCleanupTimeoutsRef.current.filter(
              (timeoutId) => timeoutId !== verticalTimeout,
            );
          }, GUIDE_LAYOUT_OPEN_UP_START_MS);
          guideLayoutCleanupTimeoutsRef.current.push(verticalTimeout);
          return;
        }

        element.style.transition = `transform ${GUIDE_LAYOUT_MOTION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
        element.style.transform = "translate(0, 0)";
      });

      const cleanupFrame = requestAnimationFrame(() => {
        const cleanupTimeout = window.setTimeout(() => {
          changedElements.forEach(({ element }) => {
            element.style.transition = "";
            element.style.transform = "";
            element.style.transformOrigin = "";
            element.style.willChange = "";
          });
          guideLayoutCleanupTimeoutsRef.current = guideLayoutCleanupTimeoutsRef.current.filter(
            (timeoutId) => timeoutId !== cleanupTimeout,
          );
        }, changedElements.some((item) => item.reverseSidewaysFirst)
          ? GUIDE_LAYOUT_CLOSE_TOTAL_MS + 80
          : changedElements.some((item) => item.stageSidewaysFirst)
            ? GUIDE_LAYOUT_OPEN_TOTAL_MS + 80
            : GUIDE_LAYOUT_MOTION_MS + 40);
        guideLayoutCleanupTimeoutsRef.current.push(cleanupTimeout);
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
  const completeGuideOpening = (nextList: MapList) => {
    if (openingGuideIdRef.current !== nextList.id) {
      return;
    }
    openingGuideIdRef.current = null;
    if (openingGuideTimeoutRef.current) {
      clearTimeout(openingGuideTimeoutRef.current);
      openingGuideTimeoutRef.current = null;
    }
    captureGuideLayoutPositions("open");
    deferGuideContentUntilMotionSettles(nextList.id);
    setOpeningGuideId(null);
    setExpandedGuideId(nextList.id);
    setActiveCategory(nextList.category);
    setActiveGuideFitNonce((current) => current + 1);
    const context = getCityRouteContext(selection);
    if (context) {
      pushExplorerPath(getCanonicalGuidePath(context.city, nextList, context.neighborhood, activeEditorialLists));
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
      captureGuideLayoutPositions("close");
      const restoredCategory = restoreCategoryAfterGuideCollapse();
      setClosingGuide(expandedGuide);
      setClosingGuidePhase("returning");
      setOpeningGuideId(null);
      setExpandedGuideId(null);
      setVisibleNestedStopParentIds([]);
      const nextPath = getCurrentCityRoutePath(restoredCategory);
      if (nextPath) {
        pushExplorerPath(nextPath);
      }
      closingGuideTimeoutRef.current = setTimeout(() => {
        setClosingGuidePhase("collapsing");
        closingGuideTimeoutRef.current = setTimeout(() => {
          setClosingGuide(null);
          setClosingGuidePhase(null);
          closingGuideTimeoutRef.current = null;
        }, GUIDE_CHROME_WIPE_MS);
      }, GUIDE_LAYOUT_CLOSE_SIDEWAYS_START_MS);
      return;
    }

    captureGuideLayoutPositions();
    if (!expandedGuideId) {
      categoryBeforeGuideExpandRef.current = activeCategory;
    }
    setClosingGuide(null);
    setClosingGuidePhase(null);
    openingGuideIdRef.current = nextList.id;
    setOpeningGuideId(nextList.id);
    setVisibleNestedStopParentIds([]);
    openingGuideTimeoutRef.current = setTimeout(() => completeGuideOpening(nextList), GUIDE_OPEN_EXPAND_START_MS);
    scrollGuideIntoView(nextList.id);
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

    setActiveGuideRail(nextList.creator.name.startsWith("R ") ? "r-guides" : "user-guides");
    setActiveSubcategory(null);
    setActiveFoodPrice(null);
    setActiveFoodOpenTime("Now");
    setIsFoodOpenTimeMenuOpen(false);
    setActiveFoodCuisine(FOOD_CUISINE_ANY);
    setIsFoodCuisineMenuOpen(false);
    setActiveNightlifeBarType(NIGHTLIFE_BAR_TYPE_ANY);
    setIsNightlifeBarMenuOpen(false);

    if (expandedGuideId === nextList.id) {
      scrollGuideIntoView(nextList.id);
      return;
    }

    captureGuideLayoutPositions();
    if (!expandedGuideId) {
      categoryBeforeGuideExpandRef.current = activeCategory;
    }
    setClosingGuide(null);
    setClosingGuidePhase(null);
    setVisibleNestedStopParentIds([]);
    deferGuideContentUntilMotionSettles(nextList.id);
    setExpandedGuideId(nextList.id);
    setActiveCategory(nextList.category);
    setActiveGuideFitNonce((current) => current + 1);

    const context = getCityRouteContext(selection);
    if (context) {
      pushExplorerPath(getCanonicalGuidePath(context.city, nextList, context.neighborhood, activeEditorialLists));
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
  const handleGuideStopSelect = (stopId: string) => {
    setHoveredStopId(stopId);
    setSelectedGuideStopId(stopId);
    setSelectedGuideStopNonce((current) => current + 1);
  };
  const handleOpenItineraryGuide = (list: MapList) => {
    setActiveCategory(null);
    categoryBeforeGuideExpandRef.current = null;
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
      setProfileSubmissionType("itinerary");
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
    setProfileSubmissionType(isItineraryGuide ? "itinerary" : list.submissionType ?? "guide");
    setProfileGuideSubmissionVariant(
      isItineraryGuide ? "itinerary" : "guide",
    );
    setProfileEditingListId(list.id);
    setIsProfileSubmitting(true);
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
                className="rail-switch-item flex h-10 w-10 items-center justify-center rounded-full border border-slate-950 bg-slate-950 font-mono text-sm font-semibold uppercase tracking-tight text-white shadow-sm transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70"
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
                  <div className="rail-switch-item h-px w-7 bg-slate-300/70" aria-hidden="true" />
                  {profileRightRailOptions.map((option, index) => (
                    <div
                      key={option.id}
                      className="rail-switch-item profile-rail-item relative h-10 w-10"
                      style={profileRailItemStyle(index + profileLeftRailOptions.length + 1)}
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
                      <MapPinned className="h-3 w-3" />
                    </button>
                  ) : null}
                </div>
              )}
                {!publicProfile ? (
                  <>
                    {activeFavoriteLocation ? (
                      <button
                        type="button"
                        onClick={() => toggleFavoriteLocation(activeFavoriteLocation)}
                        className={`guide-rail-button rail-switch-item margin-shell-pop-in flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition hover:scale-105 hover:border-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 ${
                          isActiveLocationFavorited
                            ? "border-teal-500 bg-white/95 text-teal-700"
                            : "border-slate-200/90 bg-white/95 text-teal-700"
                        }`}
                        aria-label={`${isActiveLocationFavorited ? "Remove" : "Save"} ${activeSeoPlaceLabel} ${isActiveLocationFavorited ? "from" : "to"} saved places`}
                        title={isActiveLocationFavorited ? "Remove saved place" : "Save place"}
                      >
                        <Bookmark className={`h-4 w-4 ${isActiveLocationFavorited ? "fill-current" : ""}`} />
                      </button>
                    ) : null}
                  </>
                ) : null}
	            {displayedContinentRailIcon?.kind === "continent" ? (
	              <button
                type="button"
                onClick={() => (activeMarginContinent ? handleSelectContinent(activeMarginContinent.id) : undefined)}
                className={`guide-rail-button rail-switch-item ${currentRailIcons.continent ? "margin-shell-pop-in margin-shell-pop-in-delayed" : "margin-shell-pop-out pointer-events-none"} flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 shadow-sm transition hover:scale-105 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 ${
                  activeRailLevel === "continent" && !isLocationFavoritesRailActive ? "guide-rail-button-active" : ""
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
                  activeRailLevel === "country" && !isLocationFavoritesRailActive ? "guide-rail-button-active" : ""
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
                  activeRailLevel === "state" && !isLocationFavoritesRailActive ? "guide-rail-button-active" : ""
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
                  activeRailLevel === "city" && !isLocationFavoritesRailActive ? "guide-rail-button-active" : ""
                }`}
                aria-label={`Back to ${displayedCityRailIcon.name}`}
                title={`Back to ${displayedCityRailIcon.name}`}
	              >
	                <Building2 className="h-3.5 w-3.5" />
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
                        className="guide-rail-button rail-switch-item flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-700 shadow-sm transition hover:scale-105 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70"
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
              guideLists={activeEditorialLists}
              savedLocations={savedMapLocations}
              visibleNestedStopParentIds={visibleNestedStopParentIds}
              hoveredStopId={hoveredStopId}
              selectedStopId={selectedGuideStopId}
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
	              <div
                  className="pointer-events-auto absolute right-3 top-3 z-[80] flex items-center justify-end gap-1.5 lg:hidden"
                  role="toolbar"
                  aria-label="Menu bar"
                >
                  {!isMobileExplorerSearchOpen ? (
                    <div className="flex items-center gap-1.5">
                      <div
                        className="relative flex h-8 items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm"
                        role="group"
                        aria-label="Guide source"
                      >
                        <span
                          className={`pointer-events-none absolute left-0.5 top-0.5 h-7 w-7 rounded-md bg-slate-950 shadow-sm transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isGuideSourceRailActive ? "opacity-100" : "opacity-0"
                          }`}
                          style={{ transform: `translateX(${activeGuideSourceIndex * 30}px)` }}
                          aria-hidden="true"
                        />
                        {guideSourceSelectors.map((selector) => {
                          const isActive = activeGuideRail === selector.id;
                          const SelectorIcon = selector.icon;
                          return (
                            <button
                              key={selector.id}
                              type="button"
                              onClick={() => handleGuideRailSelect(selector.id)}
                              className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-md text-[8px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 ${
                                isActive ? "text-white" : "text-slate-700 hover:text-slate-950"
                              }`}
                              aria-label={selector.label}
                              title={selector.label}
                            >
                              {SelectorIcon ? <SelectorIcon className="h-3.5 w-3.5" /> : selector.shortLabel}
                            </button>
                          );
                        })}
                      </div>
                      {guideActionSelectors.map((selector) => {
                        const isActive = activeGuideRail === selector.id;
                        const SelectorIcon = selector.icon;
                        return (
                          <button
                            key={selector.id}
                            type="button"
                            onClick={() => handleGuideRailSelect(selector.id)}
                            style={
                              isActive
                                ? {
                                    color: guideRailActiveColorById[selector.id],
                                    borderColor: guideRailActiveColorById[selector.id],
                                  }
                                : undefined
                            }
                            className={`flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 ${
                              isActive ? "bg-white" : ""
                            }`}
                            aria-label={selector.label}
                            title={selector.label}
                          >
                            <SelectorIcon
                              className={`h-3.5 w-3.5 ${
                                isActive && guideRailFillOnActiveIds.has(selector.id) ? "fill-current" : ""
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
	                <div
                  className={`flex h-8 items-center justify-end overflow-visible rounded-lg transition-[width,background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isMobileExplorerSearchOpen
                      ? "w-[min(22rem,calc(100vw-1.5rem))] border border-slate-200 bg-white shadow-sm"
                      : "w-8 border border-transparent bg-transparent"
                  }`}
                >
                  {isMobileExplorerSearchOpen ? (
                    <SearchBar
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
              </div>
				          <div className={`pointer-events-auto absolute left-1/2 top-3 z-[60] w-[min(22rem,calc(100%-7.25rem))] -translate-x-1/2 space-y-2 transition-opacity duration-200 lg:hidden ${
				            isMobileExplorerSearchOpen ? "pointer-events-none opacity-0" : "opacity-100"
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
              className={`frosted-pane-left pointer-events-auto relative z-30 hidden min-h-0 flex-col overflow-visible p-4 transition-[transform,opacity] ease-[cubic-bezier(0.22,1,0.36,1)] lg:z-auto lg:flex lg:h-full lg:overflow-hidden lg:p-5 ${
                isLeftPaneCollapsed
                  ? "duration-[620ms] -translate-x-20 opacity-0 pointer-events-none"
                  : "duration-500 translate-x-0 opacity-100"
              } ${explorerPaneHeight} ${
                isLeftPaneCollapsed ? "max-h-0 !min-h-0 p-0 lg:max-h-none lg:p-5" : ""
              }`}
            >
              <div className={`left-pane-content flex h-full min-h-0 flex-col ${paneTransitionClass}`}>
              <CityWeatherChip
                cityId={activeLocation.city?.id}
                cityName={activeLocation.city?.name}
                coordinates={activeLocation.city?.coordinates}
              />
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
                      <p className="mb-1 max-w-[calc(100%-8rem)] text-sm font-medium text-slate-600">
                        {visibleSeoContextLabel}
                      </p>
                    ) : null}
                    <h1
                      ref={titleRef}
                      className="max-w-[calc(100%-8rem)] text-2xl font-semibold text-slate-900"
                    >
                      <span ref={titleTextRef} className="inline-block">
                        {visibleSeoHeading}
                      </span>
                    </h1>
                    {!isSavedPlacesRailActive ? (
                      <div
                        ref={detailRef}
                        className="mt-1 max-w-[calc(100%-8rem)] text-sm text-slate-600 transition-all duration-300"
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
                        className="mt-2 transition-all duration-300"
                        style={{
                          opacity: postMorphRevealPhase >= 2 ? 1 : 0,
                          transform:
                            postMorphRevealPhase >= 2
                              ? "translateY(0px)"
                              : "translateY(-8px)",
                        }}
                      >
                        {visibleIntroCopyDisplay ? (
                          <p className="ml-3 min-h-[9rem] border-l border-slate-200 pl-3 text-sm leading-5 text-slate-600">
                            {visibleIntroCopyDisplay}
                          </p>
                        ) : null}
                        {!expandedGuide ? (
                          <div className="mt-3 flex justify-end gap-2">
                            {activeFavoriteLocation ? (
                              <button
                                type="button"
                                onClick={() => toggleFavoriteLocation(activeFavoriteLocation)}
                                className={`inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-sm transition ${
                                  isActiveLocationFavorited
                                    ? "border-teal-600 text-teal-700"
                                    : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                                }`}
                                aria-label={`${isActiveLocationFavorited ? "Remove" : "Save"} ${activeSeoPlaceLabel} ${isActiveLocationFavorited ? "from" : "to"} saved places`}
                                title={isActiveLocationFavorited ? "Remove saved place" : "Save place"}
                              >
                                <Bookmark className={`h-3.5 w-3.5 ${isActiveLocationFavorited ? "fill-current" : ""}`} />
                              </button>
                            ) : null}
                            {activeLocation.city ? (
                              <button
                                type="button"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
                                aria-label={`Tour ${activeSeoPlaceLabel}`}
                                title="Neighborhood tour coming soon"
                              >
                                <Footprints className="h-3.5 w-3.5" />
                              </button>
                            ) : null}
                          </div>
                        ) : null}
                        {!expandedGuide && cityHighlightRows.length ? (
                          <div className="mt-3 space-y-1.5 overflow-hidden text-sm leading-5">
                            {cityHighlightRows.map((row) => {
                              const isActiveRow = activeCategory === row.category;
                              const rowColor = CATEGORY_STYLES[row.category].mapColor;
                              const contentColor = getDarkCategoryTextColor(row.category);

                              return (
                                <div
                                  key={`${row.label}-${row.category}`}
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
                                      <span key={`${item.guide.id}-${item.label}`}>
                                        {index > 0 ? <span>, </span> : null}
                                        <button
                                          type="button"
                                          onClick={() => handleCityHighlightGuideSelect(item.guide)}
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
                ) : null}
              </div>
              {!isSavedPlacesRailActive ? (
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
              ) : null}
              </div>
              {publicProfile ? (
                <div className="profile-left-pane profile-left-intro frosted-pane-left absolute inset-0 z-20 p-5">
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
                    <div className="pane-cascade-item mt-3 min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-stone-50 p-3">
                      <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Places been</p>
                      <div className="mt-2 max-h-full space-y-1.5 overflow-y-auto pr-1">
                        {publicProfilePlacesBeen.length ? (
                          publicProfilePlacesBeen.map((place) => (
                            <div key={place} className="rounded-lg bg-white/75 px-2.5 py-1.5 text-sm font-medium text-slate-800">
                              {place}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500">No places shared yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              {isProfileMode && currentUser ? (
                <div
                  key={`profile-left-intro-${profileIntroNonce}`}
                  className="profile-left-pane profile-left-intro frosted-pane-left absolute inset-0 z-20 p-5"
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
                className="mobile-rguides-tab absolute left-0 -top-7 z-[80] flex h-7 min-w-[6.25rem] touch-none items-center rounded-t-lg border border-b-0 border-slate-200 bg-slate-950 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_-5px_12px_rgba(15,23,42,0.12)] transition-opacity duration-300 lg:hidden"
                data-mobile-sheet-handle
                onPointerDown={handleMobileListSheetDragStart}
                onPointerMove={handleMobileListSheetDragMove}
                onPointerUp={handleMobileListSheetDragEnd}
                onPointerCancel={handleMobileListSheetDragEnd}
              >
                {activeMobileGuideSelector.label}
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
                  className={`relative flex shrink-0 items-center transition-[height,margin-bottom] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
                    isGuidePaneTakingFullListPane ? "mb-0 h-0" : "mb-2 h-8"
                  }`}
                  onPointerDown={handleMobileListSheetDragStart}
                >
                  <div className={`min-w-0 pr-2 transition-opacity duration-200 ${isGuidePaneTakingFullListPane ? "opacity-0" : "opacity-100"}`}>
                    <p className="truncate text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {categoryTitleLabel}
                    </p>
                  </div>
                  <div
                    className={`ml-auto flex h-8 min-w-0 items-center justify-end overflow-x-auto rounded-full transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isGuidePaneTakingFullListPane ? "pointer-events-none -translate-y-2 opacity-0" : "translate-y-0 opacity-100"
                    }`}
                  >
                    <div
                      className="flex min-w-max items-center gap-1.5"
                    >
                        {categoryOptions.map((option, index) => {
                          const isActive = activeCategory === option.category;
                          return (
                            <button
                              key={option.label}
                              type="button"
                              onClick={() => handleCategoryToggle(option.category)}
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border shadow-sm transition-[background-color,color,border-color,transform] duration-200 hover:scale-105 ${
                                isActive ? "text-white" : "bg-white text-slate-600"
                              }`}
                              style={{
                                backgroundColor: isActive ? CATEGORY_STYLES[option.category].mapColor : undefined,
                                borderColor: CATEGORY_STYLES[option.category].mapColor,
                                transitionDelay: `${index * 18}ms`,
                              }}
                              aria-label={isActive ? `Clear ${option.label}` : option.label}
                              aria-pressed={isActive}
                            >
                              <option.icon className="h-3 w-3" />
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>
	                <div
	                  className={`relative hidden w-full shrink-0 lg:block ${
	                    isPublicProfileMode
	                      ? "hidden"
	                      : isGuidePaneTakingFullListPane
	                        ? "pointer-events-none max-h-0 -translate-y-3 pb-0 opacity-0 transition-[opacity,transform] duration-200 ease-out"
	                        : "max-h-56 translate-y-0 pb-0 opacity-100 transition-[opacity,transform] duration-200 ease-out"
		                  } ${isSubcategoryMenuOpen || isDesktopSearchOpen ? "z-[140]" : "z-10"} overflow-visible`}
		                >
                    <div
                      className="relative left-1/2 -mt-5 w-[calc(100%+2.5rem)] -translate-x-1/2 border-b border-slate-400/60 bg-slate-300/85 px-5 pb-3 pt-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]"
                      role="toolbar"
                      aria-label="Menu bar"
                    >
                      <div className="relative h-10">
                      <div
                        className={`absolute left-0 top-0 flex h-10 items-center gap-2 transition-[opacity,transform] duration-200 ${
                          isDesktopSearchOpen ? "pointer-events-none -translate-x-2 opacity-0" : "translate-x-0 opacity-100"
                        }`}
                      >
                        <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-1 shadow-sm">
                          <div
                            className="relative flex h-8 items-center gap-1"
                            role="group"
                            aria-label="Guide source"
                          >
                            <span
                              className={`pointer-events-none absolute left-0 top-0 h-8 w-8 rounded-md bg-slate-950 shadow-sm transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                isGuideSourceRailActive ? "opacity-100" : "opacity-0"
                              }`}
                              style={{ transform: `translateX(${activeGuideSourceIndex * 36}px)` }}
                              aria-hidden="true"
                            />
                            {guideSourceSelectors.map((selector) => {
                              const isActive = activeGuideRail === selector.id;
                              const SelectorIcon = selector.icon;
                              return (
                                <button
                                  key={selector.id}
                                  type="button"
                                  onClick={() => handleGuideRailSelect(selector.id)}
                                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-md text-[10px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 ${
                                    isActive ? "text-white" : "text-slate-700 hover:text-slate-950"
                                  }`}
                                  aria-label={selector.label}
                                  title={selector.label}
                                >
                                  {SelectorIcon ? <SelectorIcon className="h-4 w-4" /> : selector.shortLabel}
                                </button>
                              );
                            })}
                          </div>
                          <span className="min-w-[5.6rem] pr-1 text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            {activeMobileGuideSelector.label}
                          </span>
                        </div>
                        {guideActionSelectors.map((selector) => {
                          const isActive = activeGuideRail === selector.id;
                          const SelectorIcon = selector.icon;
                          return (
                            <button
                              key={selector.id}
                              type="button"
                              onClick={() => handleGuideRailSelect(selector.id)}
                              style={
                                isActive
                                  ? {
                                      color: guideRailActiveColorById[selector.id],
                                      borderColor: guideRailActiveColorById[selector.id],
                                    }
                                  : undefined
                              }
                              className={`flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:scale-[1.03] hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 ${
                                isActive ? "shadow-md" : ""
                              }`}
                              aria-label={selector.label}
                              title={selector.label}
                            >
                              <SelectorIcon
                                className={`h-4 w-4 ${
                                  isActive && guideRailFillOnActiveIds.has(selector.id) ? "fill-current" : ""
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
	                      <div
	                        className={`absolute right-0 top-0 flex h-10 items-center justify-end overflow-visible rounded-lg transition-[width,background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
	                          isDesktopSearchOpen
                              ? "w-full border border-slate-200 bg-white shadow-sm"
                              : "w-10 border border-transparent bg-transparent"
	                        }`}
	                      >
                        {isDesktopSearchOpen ? (
                          <SearchBar
                            autoFocus
                            compact
                            embedded
                            variant="square"
                            size="md"
                            onResultSelect={() => setIsDesktopSearchOpen(false)}
                            className="max-w-none flex-1"
                          />
                        ) : null}
                        <button
                          type="button"
                          onClick={() => {
                            setIsFoodOpenTimeMenuOpen(false);
                            setIsFoodCuisineMenuOpen(false);
                            setIsNightlifeBarMenuOpen(false);
                            setIsDesktopSearchOpen((current) => !current);
                          }}
                          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-700 transition hover:text-slate-900 ${
                            isDesktopSearchOpen
                              ? "border border-transparent bg-transparent shadow-none"
                              : "border border-slate-200 bg-white shadow-sm hover:border-slate-300"
                          }`}
                          aria-label={isDesktopSearchOpen ? "Close search" : "Open search"}
                          title={isDesktopSearchOpen ? "Close search" : "Search"}
                        >
                          {isDesktopSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
	                        </button>
	                      </div>
	                    </div>
                    </div>
                    {activeGuideRail !== "itinerary" ? (
                      <div
                        className={`mt-2 w-full translate-y-0 space-y-3 pb-2 opacity-100 transition-[margin,max-height,opacity,transform,padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isSubcategoryMenuOpen ? "max-h-44 overflow-visible" : "max-h-40 overflow-hidden"
                        }`}
                      >
                        <div
                          id="desktop-category-menu"
                          className="grid grid-rows-[1fr] translate-y-0 opacity-100 transition-[grid-template-rows,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        >
                          <div className="min-h-0 overflow-hidden">
                            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 pt-1">
                            <div className="grid w-full grid-cols-4 justify-items-start gap-2">
                              {categoryOptions.slice(0, categoryOptionMidpoint).map((option) => (
                                <button
                                  key={option.label}
                                  type="button"
                                  onClick={() => handleCategoryToggle(option.category)}
                                  onMouseEnter={() => setHoveredCategoryLabel(option.label)}
                                  onMouseLeave={() => setHoveredCategoryLabel(null)}
                                  className={`flex h-9 w-9 items-center justify-center rounded-lg outline-none transition focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 ${
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
                            <span className="inline-flex w-[8.5rem] justify-center text-center text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                              {categoryTitleLabel}
                            </span>
                            <div className="grid w-full grid-cols-4 justify-items-end gap-2">
                              {categoryOptions.slice(categoryOptionMidpoint).map((option) => (
                                <button
                                  key={option.label}
                                  type="button"
                                  onClick={() => handleCategoryToggle(option.category)}
                                  onMouseEnter={() => setHoveredCategoryLabel(option.label)}
                                  onMouseLeave={() => setHoveredCategoryLabel(null)}
                                  className={`flex h-9 w-9 items-center justify-center rounded-lg outline-none transition focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 ${
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
                          deferExpandedContent={settlingGuideContentId === displayedGuide.id}
                          onToggleExpand={handleGuideToggle}
                          onEditItinerary={activeGuideRail === "itinerary" ? handleEditItineraryFromGuide : undefined}
                          shouldAutoOpenSources={pendingSourcesOpenGuideId === displayedGuide.id}
                          onAutoOpenSourcesHandled={handleAutoOpenSourcesHandled}
                          onRequestOpenSourcesWhenCollapsed={handleExpandAndOpenSources}
                          onHoverStart={setHoveredGuide}
                          onHoverEnd={() => setHoveredGuide(null)}
                          onStopHoverChange={setHoveredStopId}
                          onStopSelect={handleGuideStopSelect}
                          hoveredStopId={hoveredStopId}
                          onExpandedStopIdsChange={setVisibleNestedStopParentIds}
                          forceExpandStopId={selectedGuideStopId}
                          forceExpandStopNonce={selectedGuideStopNonce}
                          collapsedLocationSubtitleHiddenParts={getCollapsedLocationSubtitleHiddenParts(displayedGuide)}
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
                              expanded={closingGuide?.id === list.id && closingGuidePhase === "returning"}
                              preserveExpandedChrome={closingGuide?.id === list.id || openingGuideId === list.id}
                              retractExpandedChrome={closingGuide?.id === list.id && closingGuidePhase === "collapsing"}
                              expandExpandedChrome={openingGuideId === list.id}
                              onExpandChromeComplete={completeGuideOpening}
                              onToggleExpand={handleGuideToggle}
                              onEditItinerary={activeGuideRail === "itinerary" ? handleEditItineraryFromGuide : undefined}
                              shouldAutoOpenSources={pendingSourcesOpenGuideId === list.id}
                              onAutoOpenSourcesHandled={handleAutoOpenSourcesHandled}
                              onRequestOpenSourcesWhenCollapsed={handleExpandAndOpenSources}
                              onHoverStart={setHoveredGuide}
                              onHoverEnd={() => setHoveredGuide(null)}
                              onStopHoverChange={setHoveredStopId}
                              onStopSelect={handleGuideStopSelect}
                              hoveredStopId={hoveredStopId}
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
                      {railFilteredLists.map((list) => (
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
                            expanded={closingGuide?.id === list.id && closingGuidePhase === "returning"}
                            preserveExpandedChrome={closingGuide?.id === list.id || openingGuideId === list.id}
                            retractExpandedChrome={closingGuide?.id === list.id && closingGuidePhase === "collapsing"}
                            expandExpandedChrome={openingGuideId === list.id}
                            onExpandChromeComplete={completeGuideOpening}
                            onToggleExpand={handleGuideToggle}
                            onEditItinerary={activeGuideRail === "itinerary" ? handleEditItineraryFromGuide : undefined}
                            shouldAutoOpenSources={pendingSourcesOpenGuideId === list.id}
                            onAutoOpenSourcesHandled={handleAutoOpenSourcesHandled}
                            onRequestOpenSourcesWhenCollapsed={handleExpandAndOpenSources}
                            onHoverStart={setHoveredGuide}
                            onHoverEnd={() => setHoveredGuide(null)}
                            onStopHoverChange={setHoveredStopId}
                            onStopSelect={handleGuideStopSelect}
                            hoveredStopId={hoveredStopId}
                            forceExpandStopId={selectedGuideStopId}
                            forceExpandStopNonce={selectedGuideStopNonce}
                            collapsedLocationSubtitleHiddenParts={getCollapsedLocationSubtitleHiddenParts(list)}
                          />
                        </div>
                      ))}
                      {recentRGuideLists.length ? (
                        <div className="space-y-4 border-t border-slate-200 pt-4">
                          <p className="px-1 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                            Recent Guides
                          </p>
                          {recentRGuideLists.map((list) => (
                            <div
                              key={`recent-rguide-${list.id}`}
                              ref={(node) => {
                                guideRefs.current[list.id] = node;
                              }}
                              className="scroll-mt-2"
                            >
                              <MapListCard
                                list={list}
                                expandable
                                expanded={closingGuide?.id === list.id && closingGuidePhase === "returning"}
                                preserveExpandedChrome={closingGuide?.id === list.id || openingGuideId === list.id}
                                retractExpandedChrome={closingGuide?.id === list.id && closingGuidePhase === "collapsing"}
                                expandExpandedChrome={openingGuideId === list.id}
                                onExpandChromeComplete={completeGuideOpening}
                                onToggleExpand={handleGuideToggle}
                                onHoverStart={setHoveredGuide}
                                onHoverEnd={() => setHoveredGuide(null)}
                                onStopHoverChange={setHoveredStopId}
                                onStopSelect={handleGuideStopSelect}
                                hoveredStopId={hoveredStopId}
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
              {isProfileMode && currentUser ? (
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
                            onStopSelect={handleGuideStopSelect}
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
                              onStopSelect={handleGuideStopSelect}
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
    </section>
  );
}
