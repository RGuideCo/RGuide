import {
  BadgeInfo,
  BedDouble,
  BookOpen,
  CalendarDays,
  Flame,
  Heart,
  Landmark,
  LucideIcon,
  Map as MapIcon,
  MapPin,
  MoonStar,
  Pencil,
  Road,
  Route,
  Settings,
  Sparkles,
  Trees,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import { CATEGORY_STYLES } from "@/lib/constants";
import { Continent, ListCategory, MapList, SelectionState } from "@/types";

export type SubcategoryScope = "country" | "region" | "city";
export type FoodPriceTier = "$" | "$$" | "$$$";
export type PlacesBeenFilter = "countries" | "cities" | "places";
export type PlacesBeenEntry = {
  id: string;
  name: string;
  country: string;
  kind: PlacesBeenFilter;
  coordinates?: [number, number];
};

export const categoryOptions: { label: string; category: ListCategory; icon: LucideIcon }[] = [
  { label: "Food", category: "Food", icon: UtensilsCrossed },
  { label: "Nightlife", category: "Nightlife", icon: MoonStar },
  { label: "Culture", category: "Culture", icon: Landmark },
  { label: "Stay", category: "Stay", icon: BedDouble },
  { label: "Scenic", category: "Nature", icon: Trees },
  { label: "Activities", category: "Activities", icon: Sparkles },
  { label: "Routes", category: "Routes", icon: Road },
  { label: "Essentials", category: "Essentials", icon: BadgeInfo },
];

export const COUNTRY_INPUT_ALIASES: Record<string, string> = {
  usa: "United States",
  us: "United States",
  uk: "United Kingdom",
  uae: "United Arab Emirates",
};

export function normalizePlacesBeenToken(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function toTitleCase(value: string) {
  const smallWords = new Set(["and", "or", "of", "the", "de", "da", "di", "la", "le", "el"]);
  return value
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) => {
      if (index > 0 && smallWords.has(word)) {
        return word;
      }
      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    })
    .join(" ");
}

export function getLevenshteinDistance(left: string, right: string) {
  const rows = left.length + 1;
  const cols = right.length + 1;
  const matrix = Array.from({ length: rows }, () => Array<number>(cols).fill(0));

  for (let row = 0; row < rows; row += 1) {
    matrix[row][0] = row;
  }
  for (let col = 0; col < cols; col += 1) {
    matrix[0][col] = col;
  }

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      const substitutionCost = left[row - 1] === right[col - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + substitutionCost,
      );
    }
  }

  return matrix[rows - 1][cols - 1];
}

export const FOOD_PRICE_OPTIONS: FoodPriceTier[] = ["$", "$$", "$$$"];
export const FOOD_OPEN_TIME_OPTIONS = ["Now", "Morning", "Afternoon", "Evening", "Late Night"] as const;
export const FOOD_CUISINE_ANY = "Cuisine";
export const NIGHTLIFE_BAR_TYPE_ANY = "Bars";
export const NIGHTLIFE_BAR_TYPE_OPTIONS = ["Dive Bar", "Cocktail Bar", "Sports Bar", "Pub", "Uni Bar"] as const;

export const contextualFoodCuisinesByScope: Record<SubcategoryScope, string[]> = {
  country: ["Regional", "Local", "Seafood", "Street Food"],
  region: ["Regional", "Local", "Seafood", "Street Food"],
  city: ["Local", "Street Food", "Seafood", "Regional"],
};

export const contextualFoodCuisinesByCountry: Record<string, string[]> = {
  Spain: ["Tapas", "Catalan", "Seafood", "Paella"],
  Italy: ["Italian", "Pasta", "Pizza", "Seafood"],
  Japan: ["Japanese", "Sushi", "Ramen", "Izakaya"],
  Mexico: ["Mexican", "Tacos", "Seafood", "Street Food"],
  Thailand: ["Thai", "Street Food", "Seafood", "Noodles"],
  France: ["French", "Bistro", "Bakery", "Seafood"],
  Portugal: ["Portuguese", "Seafood", "Grilled", "Pastry"],
  Greece: ["Greek", "Mediterranean", "Seafood", "Mezze"],
  Turkey: ["Turkish", "Kebab", "Mezze", "Seafood"],
  Morocco: ["Moroccan", "Tagine", "Grilled", "Street Food"],
  Egypt: ["Egyptian", "Grilled", "Street Food", "Seafood"],
  "South Africa": ["South African", "Braai", "Seafood", "Steakhouse"],
  Kenya: ["Kenyan", "Grilled", "Street Food", "Seafood"],
  Nigeria: ["Nigerian", "West African", "Street Food", "Grilled"],
  India: ["Indian", "Curry", "Street Food", "Vegetarian"],
  China: ["Chinese", "Noodles", "Street Food", "Seafood"],
  "South Korea": ["Korean", "BBQ", "Noodles", "Street Food"],
  Vietnam: ["Vietnamese", "Noodles", "Street Food", "Seafood"],
  Indonesia: ["Indonesian", "Street Food", "Seafood", "Grilled"],
  Malaysia: ["Malaysian", "Noodles", "Street Food", "Seafood"],
  Singapore: ["Hawker", "Chinese", "Indian", "Seafood"],
  Philippines: ["Filipino", "Street Food", "Seafood", "Grilled"],
  Australia: ["Australian", "Brunch", "Seafood", "Steakhouse"],
  "New Zealand": ["New Zealand", "Brunch", "Seafood", "Grilled"],
  "United States": ["American", "BBQ", "Burgers", "Seafood"],
  USA: ["American", "BBQ", "Burgers", "Seafood"],
  Canada: ["Canadian", "Brunch", "Seafood", "Steakhouse"],
  "United Kingdom": ["British", "Pub Food", "Indian", "Seafood"],
  UK: ["British", "Pub Food", "Indian", "Seafood"],
  Ireland: ["Irish", "Pub Food", "Seafood", "Stew"],
  Germany: ["German", "Sausage", "Bakery", "Beer Hall"],
  Austria: ["Austrian", "Bakery", "Central European", "Steakhouse"],
  Switzerland: ["Swiss", "Alpine", "French", "Italian"],
  Netherlands: ["Dutch", "Indonesian", "Seafood", "Street Food"],
  Belgium: ["Belgian", "French", "Seafood", "Bakery"],
  Sweden: ["Swedish", "Nordic", "Seafood", "Bakery"],
  Norway: ["Nordic", "Seafood", "Grilled", "Brunch"],
  Denmark: ["Nordic", "Bakery", "Seafood", "Smorrebrod"],
  Finland: ["Nordic", "Seafood", "Grilled", "Bakery"],
  Poland: ["Polish", "Eastern European", "Bakery", "Grilled"],
  "Czech Republic": ["Czech", "Central European", "Pub Food", "Grilled"],
  Hungary: ["Hungarian", "Central European", "Grilled", "Bakery"],
  Romania: ["Romanian", "Eastern European", "Grilled", "Bakery"],
  Croatia: ["Croatian", "Seafood", "Mediterranean", "Grilled"],
  Serbia: ["Serbian", "Balkan", "Grilled", "Bakery"],
  Brazil: ["Brazilian", "Churrasco", "Seafood", "Street Food"],
  Argentina: ["Argentinian", "Steakhouse", "Italian", "Seafood"],
  Chile: ["Chilean", "Seafood", "Grilled", "Steakhouse"],
  Peru: ["Peruvian", "Ceviche", "Street Food", "Seafood"],
  Colombia: ["Colombian", "Street Food", "Seafood", "Grilled"],
  Ecuador: ["Ecuadorian", "Seafood", "Street Food", "Grilled"],
  Bolivia: ["Bolivian", "Street Food", "Grilled", "Andean"],
  Uruguay: ["Uruguayan", "Steakhouse", "Seafood", "Grilled"],
  Paraguay: ["Paraguayan", "Grilled", "Street Food", "South American"],
  Venezuela: ["Venezuelan", "Street Food", "Seafood", "Grilled"],
};

export const contextualFoodCuisinesByCity: Record<string, string[]> = {
  Barcelona: ["Tapas", "Catalan", "Seafood", "Paella"],
  Madrid: ["Tapas", "Spanish", "Steakhouse", "Seafood"],
  Miami: ["Cuban", "Latin", "Seafood", "Steakhouse"],
  Tokyo: ["Sushi", "Ramen", "Izakaya", "Japanese"],
  Bangkok: ["Thai", "Street Food", "Seafood", "Noodles"],
  Rome: ["Pasta", "Italian", "Pizza", "Gelato"],
};

export const generalFoodCuisines = [
  "Italian",
  "Japanese",
  "Chinese",
  "Mexican",
  "Thai",
  "Indian",
  "Mediterranean",
  "French",
  "American",
  "Vegetarian",
  "Vegan",
  "Steakhouse",
  "BBQ",
  "Burgers",
  "Pizza",
];

export const categorySubcategoriesByScope: Record<SubcategoryScope, Record<ListCategory, string[]>> = {
  country: {
    Food: [],
    Nightlife: ["Live Music", "Late Night", "Rooftops"],
    Culture: ["UNESCO Sites", "National Museums", "Historic Centers", "Festivals"],
    Stay: ["Hostels", "Hotels", "Resorts", "Vacation Rentals"],
    Nature: ["Hikes", "Coastal Walks", "National Parks", "Scenic Drives"],
    Activities: ["Rail Journeys", "Road Trips", "Adventure Sports", "Wellness"],
    Routes: ["Road Trips", "Rail Routes", "Walking Routes", "Scenic Drives"],
    Essentials: ["Entry Basics", "Getting Around", "Money", "Safety"],
  },
  region: {
    Food: [],
    Nightlife: ["Live Music", "Late Night", "Rooftops"],
    Culture: ["Heritage Towns", "Craft Districts", "Landmarks", "Local Museums"],
    Stay: ["Hostels", "Hotels", "Resorts", "Vacation Rentals"],
    Nature: ["Hikes", "Coastal Walks", "Waterfalls", "Viewpoints"],
    Activities: ["Day Trips", "Boat Tours", "Outdoor Adventure", "Wildlife"],
    Routes: ["Walking Routes", "Major Streets", "Transit Hops", "Scenic Drives"],
    Essentials: ["Transit Hubs", "Base Towns", "Seasonal Notes", "Road Conditions"],
  },
  city: {
    Food: [],
    Nightlife: ["Live Music", "Late Night", "Rooftops"],
    Culture: ["Architecture", "Museums", "Galleries", "Historic Streets"],
    Stay: ["Hostels", "Hotels", "Resorts", "Vacation Rentals"],
    Nature: ["Views", "Urban Parks", "Waterfront", "Gardens"],
    Activities: ["Walking Tours", "Shopping", "Family Spots", "Wellness"],
    Routes: ["Walking Routes", "Major Streets", "Transit Hops", "Scenic Loops"],
    Essentials: ["Transit", "Arrival", "Neighborhood Basics", "Safety"],
  },
};

export function inferFoodPrice(list: MapList): FoodPriceTier {
  const stopPrices = list.stops.map((stop) => stop.price).filter((price): price is FoodPriceTier => Boolean(price));
  if (stopPrices.length) {
    if (stopPrices.includes("$$")) {
      return "$$";
    }
    return stopPrices.includes("$") ? "$" : "$$$";
  }

  const text = `${list.title} ${list.description}`.toLowerCase();
  if (/(michelin|tasting|chef'?s table|omakase|fine dining|luxury|degustation|signature menu)/.test(text)) {
    return "$$$";
  }
  if (/(street|food truck|market|budget|cheap|casual|quick bite|local eats)/.test(text)) {
    return "$";
  }
  return "$$";
}

export function doesListMatchFoodPrice(list: MapList, priceTier: FoodPriceTier): boolean {
  const stopPrices = list.stops.map((stop) => stop.price).filter(Boolean);
  return stopPrices.length ? stopPrices.includes(priceTier) : inferFoodPrice(list) === priceTier;
}

export function filterListStopsByFoodPrice(list: MapList, priceTier: FoodPriceTier | null): MapList {
  if (!priceTier) {
    return list;
  }

  const pricedStops = list.stops.filter((stop) => stop.price === priceTier);
  if (!pricedStops.length) {
    return list;
  }

  return {
    ...list,
    stops: pricedStops,
  };
}

function normalizeFilterValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[_-]/g, " ")
    .replace(/[^a-z0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function singularizeFilterValue(value: string) {
  return value
    .split(" ")
    .map((token) => {
      if (token.endsWith("ies")) {
        return `${token.slice(0, -3)}y`;
      }
      if (token.endsWith("s") && token.length > 3) {
        return token.slice(0, -1);
      }
      return token;
    })
    .join(" ");
}

function filterValuesMatch(left: string, right: string) {
  const normalizedLeft = normalizeFilterValue(left);
  const normalizedRight = normalizeFilterValue(right);

  if (!normalizedLeft || !normalizedRight) {
    return false;
  }

  return (
    normalizedLeft === normalizedRight ||
    singularizeFilterValue(normalizedLeft) === singularizeFilterValue(normalizedRight)
  );
}

function valuesFromMaybeArray(value: string | string[] | null | undefined) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  return value ? [value] : [];
}

function getPoiSubcategories(stop: MapList["stops"][number]) {
  return [
    ...valuesFromMaybeArray(stop.subcategory),
    ...valuesFromMaybeArray(stop.subcategories),
    ...valuesFromMaybeArray(stop.lodgingType),
    ...valuesFromMaybeArray(stop.foodServiceType),
    ...valuesFromMaybeArray(stop.nightlifeType),
    ...valuesFromMaybeArray(stop.venueKind),
  ];
}

function getListPoiStops(list: MapList) {
  return list.stops.flatMap((stop) => [stop, ...(stop.places ?? [])]);
}

export function doesListMatchCategory(list: MapList, category: ListCategory): boolean {
  if (list.category === category) {
    return true;
  }

  return getListPoiStops(list).some((stop) => stop.category === category);
}

function getStructuredSubcategories(list: MapList) {
  return getListPoiStops(list).flatMap(getPoiSubcategories);
}

function getSubcategoryFilterAliases(subcategory: string) {
  switch (subcategory) {
    case "Hotels":
      return ["Hotels", "Hotel", "hotel", "guesthouse", "apartment_hotel"];
    case "Hostels":
      return ["Hostels", "Hostel", "hostel"];
    case "Resorts":
      return ["Resorts", "Resort", "resort"];
    case "Vacation Rentals":
      return ["Vacation Rentals", "Vacation Rental", "airbnb", "short term rental"];
    case "Dive Bar":
    case "Dive Bars":
      return ["Dive Bar", "Dive Bars", "dive_bar", "dive_bars"];
    case "Live Music":
      return ["Live Music", "live_music_venue", "concert_hall"];
    case "Late Night":
      return ["Late Night", "club", "lounge"];
    case "Rooftops":
      return ["Rooftops", "Rooftop", "rooftop_bar"];
    default:
      return [subcategory];
  }
}

export function inferFoodCuisine(list: MapList, cuisineOptions: string[]): string {
  const stops = getListPoiStops(list);
  const structuredCuisineValues = stops.flatMap((stop) => [
    ...valuesFromMaybeArray(stop.cuisineTypes),
    ...valuesFromMaybeArray(stop.subcategory),
    ...valuesFromMaybeArray(stop.subcategories),
    ...valuesFromMaybeArray(stop.attributeTags),
    ...valuesFromMaybeArray(stop.tags),
  ]);
  const structuredMatch = cuisineOptions.find((cuisine) =>
    structuredCuisineValues.some((value) => filterValuesMatch(value, cuisine)),
  );

  if (structuredMatch) {
    return structuredMatch;
  }

  const text = `${list.title} ${list.description} ${stops
    .map((stop) =>
      [
        stop.name,
        stop.description,
        stop.subcategory,
        ...(stop.subcategories ?? []),
        ...(stop.cuisineTypes ?? []),
        ...(stop.attributeTags ?? []),
        ...(stop.tags ?? []),
      ].join(" "),
    )
    .join(" ")}`.toLowerCase();
  const has = (pattern: RegExp) => pattern.test(text);
  const matchers: Array<{ cuisine: string; pattern: RegExp }> = [
    { cuisine: "Street Food", pattern: /street|food truck|market|stall|night market/ },
    { cuisine: "Seafood", pattern: /seafood|fish|oyster|coastal catch/ },
    { cuisine: "Tapas", pattern: /tapas|pinchos/ },
    { cuisine: "Catalan", pattern: /catalan|catalonia/ },
    { cuisine: "Paella", pattern: /paella|arroz/ },
    { cuisine: "Spanish", pattern: /spanish|iberian/ },
    { cuisine: "Cuban", pattern: /cuban|havana/ },
    { cuisine: "Latin", pattern: /latin|latino|ceviche/ },
    { cuisine: "Sushi", pattern: /sushi|nigiri|sashimi/ },
    { cuisine: "Ramen", pattern: /ramen|tonkotsu|noodle soup/ },
    { cuisine: "Izakaya", pattern: /izakaya|yakitori/ },
    { cuisine: "Japanese", pattern: /japanese|omakase|tempura/ },
    { cuisine: "Thai", pattern: /thai|pad thai|tom yum/ },
    { cuisine: "Noodles", pattern: /noodles?|udon|soba/ },
    { cuisine: "Mexican", pattern: /mexican|taco|taqueria/ },
    { cuisine: "Italian", pattern: /italian|trattoria|ristorante/ },
    { cuisine: "Pasta", pattern: /pasta|carbonara|cacio e pepe/ },
    { cuisine: "Pizza", pattern: /pizza|pizzeria/ },
    { cuisine: "French", pattern: /french|bistro|brasserie/ },
    { cuisine: "Chinese", pattern: /chinese|dim sum|sichuan|cantonese/ },
    { cuisine: "Indian", pattern: /indian|curry|tandoor/ },
    { cuisine: "Mediterranean", pattern: /mediterranean|mezze|greek|levant/ },
    { cuisine: "American", pattern: /american|diner/ },
    { cuisine: "Steakhouse", pattern: /steakhouse|steak|asado|churrasco/ },
    { cuisine: "BBQ", pattern: /bbq|barbecue|smokehouse/ },
    { cuisine: "Burgers", pattern: /burger|burgers/ },
    { cuisine: "Vegetarian", pattern: /vegetarian|veggie/ },
    { cuisine: "Vegan", pattern: /vegan|plant-based/ },
    { cuisine: "Regional", pattern: /regional|local classic|traditional/ },
    { cuisine: "Local", pattern: /local|neighborhood|classic/ },
  ];

  for (const matcher of matchers) {
    if (cuisineOptions.includes(matcher.cuisine) && has(matcher.pattern)) {
      return matcher.cuisine;
    }
  }

  return FOOD_CUISINE_ANY;
}

function getFoodCuisineFilterAliases(cuisine: string) {
  switch (cuisine) {
    case "Sushi":
      return ["sushi", "omakase", "nigiri", "sashimi", "edomae", "conveyor_sushi", "kaitenzushi", "standing_sushi"];
    case "Ramen":
      return ["ramen", "tonkotsu", "shoyu", "shio", "miso", "tsukemen", "noodle soup"];
    case "Izakaya":
      return ["izakaya", "yakitori", "small plates", "drinking food"];
    case "Street Food":
      return ["street_food", "street food", "stall", "market", "food_truck", "food_cart", "night market"];
    case "Seafood":
      return ["seafood", "fish", "oyster", "sushi"];
    case "Matcha":
      return ["matcha", "green_tea", "green tea", "wagashi", "tea_room", "tea_salon"];
    case "Japanese":
      return ["japanese", "washoku", "kaiseki", "tempura", "tonkatsu", "soba", "udon", "curry", "set_meal"];
    default:
      return [cuisine];
  }
}

export function doesListMatchFoodCuisine(list: MapList, cuisine: string): boolean {
  if (cuisine === FOOD_CUISINE_ANY) {
    return true;
  }

  const aliases = getFoodCuisineFilterAliases(cuisine);
  const stops = getListPoiStops(list);
  const structuredCuisineValues = stops.flatMap((stop) => [
    ...valuesFromMaybeArray(stop.cuisineTypes),
    ...valuesFromMaybeArray(stop.subcategory),
    ...valuesFromMaybeArray(stop.subcategories),
    ...valuesFromMaybeArray(stop.attributeTags),
    ...valuesFromMaybeArray(stop.tags),
  ]);

  if (
    structuredCuisineValues.some((value) =>
      aliases.some((alias) => filterValuesMatch(value, alias)),
    )
  ) {
    return true;
  }

  const text = `${list.title} ${list.seoTitle ?? ""} ${list.seoDescription ?? ""} ${list.description} ${stops
    .map((stop) => `${stop.name} ${stop.description}`)
    .join(" ")}`.toLowerCase();
  const fallbackMatchers: Record<string, RegExp> = {
    Sushi: /\b(sushi|omakase|nigiri|sashimi|edomae|conveyor sushi|kaitenzushi)\b/,
    Ramen: /\b(ramen|tonkotsu|shoyu|shio|miso|tsukemen|noodle soup)\b/,
    Izakaya: /\b(izakaya|yakitori|drinking food|small plates)\b/,
    "Street Food": /\b(street food|food truck|market|stall|night market)\b/,
    Seafood: /\b(seafood|fish|oyster|coastal catch)\b/,
    Matcha: /\b(matcha|green tea|wagashi|tea room|tea salon)\b/,
  };

  return fallbackMatchers[cuisine]?.test(text) ?? text.includes(cuisine.toLowerCase());
}

export function inferNightlifeBarType(list: MapList): (typeof NIGHTLIFE_BAR_TYPE_OPTIONS)[number] {
  const text = `${list.title} ${list.description} ${list.stops
    .map((stop) => `${stop.name} ${stop.description}`)
    .join(" ")}`.toLowerCase();
  if (/(dive bar|dive|grunge|no-frills|cheap pours)/.test(text)) {
    return "Dive Bar";
  }
  if (/(sports bar|game day|watch party|big screens|match night|football|soccer|rugby|nba|nfl)/.test(text)) {
    return "Sports Bar";
  }
  if (/(pub|gastropub|alehouse|irish bar|pints?)/.test(text)) {
    return "Pub";
  }
  if (/(uni bar|student|campus|college|loud music|big crowd|young crowd)/.test(text)) {
    return "Uni Bar";
  }
  return "Cocktail Bar";
}

export function doesListMatchSubcategory(list: MapList, subcategory: string): boolean {
  const text = [
    list.title,
    list.slug,
    list.seoSlug,
    list.seoTitle,
    list.seoDescription,
    list.url,
    list.description,
    ...list.stops.map((stop) => `${stop.name} ${stop.description}`),
  ]
    .filter((value): value is string => Boolean(value))
    .join(" ")
    .toLowerCase();
  const isDiveBarFilter = subcategory === "Dive Bar" || subcategory === "Dive Bars";
  if (isDiveBarFilter && /(best[-\s+]*dive[-\s+]*bars?|dive[-\s+]*bars?|dive bar|dive|no-frills|grunge|cheap pours|neighborhood bar)/.test(text)) {
    return true;
  }

  const structuredSubcategories = getStructuredSubcategories(list);

  if (structuredSubcategories.length) {
    const subcategoryAliases = getSubcategoryFilterAliases(subcategory);
    return structuredSubcategories.some((value) =>
      subcategoryAliases.some((alias) => filterValuesMatch(value, alias)),
    );
  }

  switch (subcategory) {
    case "Hotels": {
      const hasHostelLanguage = /\b(hostels?|dorms?|backpackers?|hostelworld|social-hostel)\b/.test(text);
      const hasResortLanguage = /\b(resorts?|all-inclusive|beach resort)\b/.test(text);
      const hasRentalLanguage = /\b(vacation rentals?|apartments?|airbnb|short-term rental)\b/.test(text);
      const hasHotelLanguage = /\b(hotels?|boutique stays?|boutique bases?|palace|guesthouses?|rooms?|sleep|sleeping|stay|stays|base|bases|lodging)\b/.test(text);

      return hasHotelLanguage && !hasHostelLanguage && !hasResortLanguage && !hasRentalLanguage;
    }
    case "Hostels":
      return /\b(hostels?|dorms?|backpackers?|hostelworld|social-hostel|social hostels?)\b/.test(text);
    case "Resorts":
      return /\b(resorts?|all-inclusive|beach resort|resort zone)\b/.test(text);
    case "Vacation Rentals":
      return /\b(vacation rentals?|apartments?|airbnb|short-term rental|self-catering)\b/.test(text);
    case "Dive Bar":
    case "Dive Bars":
      return /(dive bar|dive|no-frills|grunge|cheap pours|neighborhood bar)/.test(text);
    case "Live Music":
      return /(live music|jazz|concert|dj|dance|club|venue)/.test(text);
    case "Late Night":
      return /(late night|nightlife|after-hours|party|club)/.test(text);
    case "Rooftops":
      return /(rooftop|terrace|skyline|view)/.test(text);
    default: {
      const tokens = subcategory
        .toLowerCase()
        .split(/\s+/)
        .filter((token) => token.length > 2);
      return tokens.length > 0 && tokens.every((token) => text.includes(token));
    }
  }
}

export function isItineraryList(list: MapList, itineraryListIds: Set<string>): boolean {
  if (list.submissionType === "itinerary") {
    return true;
  }
  if (itineraryListIds.has(list.id)) {
    return true;
  }
  const hasGeneratedItineraryStops = list.stops.some((stop) => stop.id.startsWith("itinerary-stop-"));
  if (hasGeneratedItineraryStops) {
    return true;
  }
  const hasItineraryTitle = /\b(itinerary|journey)\b/i.test(list.title);
  const hasCompiledItineraryDescription = /^compiled (itinerary|journey) with \d+ saved locations\.?$/i.test(
    list.description.trim(),
  );
  return hasItineraryTitle && hasCompiledItineraryDescription;
}

export function isPrivateJournalExperience(list: MapList): boolean {
  return list.submissionType === "journal" && list.journal?.visibility === "private";
}

export function getDefaultSelection(_continents: Continent[]): SelectionState {
  return {};
}

export const MORPH_GROW_MS = 340;
export const MORPH_LEFT_MS = 280;
export const MORPH_UP_MS = 320;
export const MORPH_LEFT_SETTLE_MS = 24;
export const MORPH_UP_START_MS = MORPH_GROW_MS + MORPH_LEFT_MS + MORPH_LEFT_SETTLE_MS;
export const MORPH_SETTLE_MS = 20;
export const MORPH_TOTAL_MS = MORPH_UP_START_MS + MORPH_UP_MS;
export const MORPH_LEFT_ALIGN_OFFSET_PX = 0;
export const REVEAL_SUBTITLE_MS = 0;
export const REVEAL_DESCRIPTION_MS = 70;
export const REVEAL_BODY_MS = 140;

export const guideRailOptions = [
  { id: "all-guides", label: "All Guides", shortLabel: "All", icon: MapIcon },
  { id: "r-guides", label: "R Guides", shortLabel: "R", icon: null },
  { id: "user-guides", label: "User Guides", shortLabel: "User", icon: Users },
  { id: "itinerary", label: "Journeys", shortLabel: "Journey", icon: Route },
  { id: "favorites", label: "Favorites", shortLabel: "Fav", icon: Heart },
  { id: "trending", label: "Trending", shortLabel: "Trend", icon: Flame },
  { id: "week-events", label: "This Week", shortLabel: "Week", icon: CalendarDays },
] as const satisfies { id: string; label: string; shortLabel: string; icon: LucideIcon | null }[];

export const guideRailActiveColorById: Record<(typeof guideRailOptions)[number]["id"], string> = {
  "all-guides": "#0f172a",
  "r-guides": "#14b8a6",
  "user-guides": "#0ea5e9",
  favorites: "#f97316",
  itinerary: "#10b981",
  trending: "#ef4444",
  "week-events": "#8b5cf6",
};

export const guideRailFillOnActiveIds = new Set<(typeof guideRailOptions)[number]["id"]>([
  "user-guides",
  "favorites",
  "trending",
]);

export const profileLeftRailOptions = [
  { id: "places-been", label: "Places Been", icon: MapPin },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "edit-profile", label: "Edit Profile", icon: Pencil },
] as const;

export const profileRightRailOptions = [
  { id: "guides", label: "Guides", icon: MapIcon },
  { id: "experiences", label: "Experiences", icon: BookOpen },
  { id: "itineraries", label: "Journeys", icon: Route },
  { id: "favorites", label: "Favorites", icon: Heart },
] as const;

export const BRIAN_PROFILE_FAVORITES = [
  { type: "Food", value: "Late-night ramen" },
  { type: "Beverage", value: "Iced oat flat white" },
  { type: "Song", value: "Midnight City - M83" },
] as const;

export const DEFAULT_PROFILE_FAVORITES = [
  { type: "Food", value: "Street tacos" },
  { type: "Beverage", value: "Sparkling water + lime" },
  { type: "Song", value: "Sunset Lover - Petit Biscuit" },
] as const;
