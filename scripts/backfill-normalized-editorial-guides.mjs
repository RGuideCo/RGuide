import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import pg from "pg";

import {
  addPoiReferencesToGuides,
  collectEditorialPois,
  describeEditorialGuideFilters,
  filterEditorialGuides,
  hasEditorialGuideFilters,
  loadEditorialGuideLists,
  parseEditorialGuideArgs,
} from "./editorial-guides-data.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CITY_TIMEZONE_FALLBACKS = new Map([
  ["tokyo|japan", "Asia/Tokyo"],
]);

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }
    const key = trimmed.slice(0, trimmed.indexOf("=")).trim();
    let value = trimmed.slice(trimmed.indexOf("=") + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function slugify(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeName(value) {
  return slugify(value).replace(/-/g, " ").replace(/\s+/g, " ").trim();
}

function cityTimezoneKey(city, country) {
  return `${normalizeName(city)}|${normalizeName(country)}`;
}

function fallbackCityTimezone(city, country) {
  return CITY_TIMEZONE_FALLBACKS.get(cityTimezoneKey(city, country)) ?? null;
}

function normalizeCoordinates(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    return null;
  }
  const lat = Number(coordinates[0]);
  const lng = Number(coordinates[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }
  return [Number(lat.toFixed(6)), Number(lng.toFixed(6))];
}

function toJson(value) {
  return value === undefined || value === null ? null : JSON.stringify(value);
}

function toJsonObject(value) {
  return JSON.stringify(value ?? {});
}

function toJsonArray(value) {
  return JSON.stringify(value ?? []);
}

function toSchemaSubmissionType(value) {
  return value === "itinerary" ? "journey" : value ?? "guide";
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

const VALID_VENUE_KINDS = new Set([
  "lodging",
  "food_drink",
  "nightlife",
  "culture",
  "outdoors",
  "event_venue",
  "transport",
  "retail",
  "service",
  "landmark",
  "other",
]);
const VALID_LODGING_TYPES = new Set(["hotel", "hostel", "resort", "airbnb", "apartment_hotel", "guesthouse", "camping", "holiday_park"]);
const VALID_FOOD_SERVICE_TYPES = new Set(["restaurant", "cafe", "fast_food", "stall", "food_truck", "food_cart"]);
const VALID_NIGHTLIFE_TYPES = new Set([
  "dive_bar",
  "cocktail_bar",
  "pub",
  "sports_bar",
  "gaming_bar",
  "wine_bar",
  "beer_bar",
  "rooftop_bar",
  "lounge",
  "club",
  "live_music_venue",
  "theatre",
  "concert_hall",
  "comedy_club",
  "karaoke_bar",
  "casino",
  "brewery",
  "other",
]);
const VALID_PRICE_TIERS = new Set(["$", "$$", "$$$", "$$$$"]);

function cleanEnumValue(value, allowed) {
  return typeof value === "string" && allowed.has(value) ? value : null;
}

function mergeUniqueValues(...groups) {
  return uniqueValues(groups.flatMap((group) => group ?? []));
}

function inferVenueClassification(stop, list) {
  const explicitVenueKind = cleanEnumValue(stop?.venueKind, VALID_VENUE_KINDS);
  const explicitLodgingType = cleanEnumValue(stop?.lodgingType, VALID_LODGING_TYPES);
  const explicitFoodServiceType = cleanEnumValue(stop?.foodServiceType, VALID_FOOD_SERVICE_TYPES);
  const explicitNightlifeType = cleanEnumValue(stop?.nightlifeType, VALID_NIGHTLIFE_TYPES);
  const explicitAttributeTags = Array.isArray(stop?.attributeTags) ? stop.attributeTags : [];
  const explicitTags = Array.isArray(stop?.tags) ? stop.tags : [];
  if (explicitVenueKind || explicitLodgingType || explicitFoodServiceType || explicitNightlifeType || explicitAttributeTags.length || explicitTags.length) {
    return {
      venueKind: explicitVenueKind ?? (explicitLodgingType ? "lodging" : explicitFoodServiceType ? "food_drink" : explicitNightlifeType ? "nightlife" : "other"),
      lodgingType: explicitLodgingType,
      foodServiceType: explicitFoodServiceType,
      cuisineTypes: Array.isArray(stop?.cuisineTypes) ? uniqueValues(stop.cuisineTypes) : [],
      priceTier: cleanEnumValue(stop?.price, VALID_PRICE_TIERS),
      nightlifeType: explicitNightlifeType,
      musicGenres: Array.isArray(stop?.musicGenres) ? uniqueValues(stop.musicGenres) : [],
      attributeTags: mergeUniqueValues(explicitAttributeTags, explicitTags),
    };
  }

  const isNightlife = list?.category === "Nightlife" || stop?.category === "Nightlife";
  if (isNightlife) {
    const text = [
      stop?.name,
      stop?.description,
      stop?.category,
      stop?.price,
      stop?.bookingUrl,
      stop?.officialUrl,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    let nightlifeType = "other";
    if (/\bdive\s+bars?\b/.test(text)) nightlifeType = "dive_bar";
    else if (/\bsports?\s+bars?\b|watch\s+the\s+game|screen(s|ing)?\b/.test(text)) nightlifeType = "sports_bar";
    else if (/\bgaming\s+bars?\b|arcade|board\s+game|pool\s+table|darts?\b/.test(text)) nightlifeType = "gaming_bar";
    else if (/\bcocktail|mixology|speakeasy\b/.test(text)) nightlifeType = "cocktail_bar";
    else if (/\bpubs?\b|public\s+house\b/.test(text)) nightlifeType = "pub";
    else if (/\bwine\s+bars?\b|natural\s+wine\b/.test(text)) nightlifeType = "wine_bar";
    else if (/\bbeer\s+bars?\b|brewery|taproom|craft\s+beer\b/.test(text)) nightlifeType = "beer_bar";
    else if (/\brooftop\b/.test(text)) nightlifeType = "rooftop_bar";
    else if (/\bcomedy\s+clubs?\b|stand[-\s]?up\b/.test(text)) nightlifeType = "comedy_club";
    else if (/\bconcert\s+halls?\b/.test(text)) nightlifeType = "concert_hall";
    else if (/\btheatres?\b|theaters?\b|stage|show\b/.test(text)) nightlifeType = "theatre";
    else if (/\blive\s+music|jazz\s+club|music\s+venue\b/.test(text)) nightlifeType = "live_music_venue";
    else if (/\bclubs?\b|nightclubs?\b|dance\s+floor|dj\b/.test(text)) nightlifeType = "club";
    else if (/\bkaraoke\b/.test(text)) nightlifeType = "karaoke_bar";
    else if (/\bcasino\b/.test(text)) nightlifeType = "casino";
    else if (/\blounge\b/.test(text)) nightlifeType = "lounge";
    else if (/\bbars?\b/.test(text)) nightlifeType = "cocktail_bar";

    const genrePatterns = [
      ["house", /\bhouse\b/],
      ["techno", /\btechno\b/],
      ["electronic", /\belectronic|edm|dance\s+music\b/],
      ["hip_hop", /\bhip[-\s]?hop|rap\b/],
      ["r_and_b", /\br&b|rnb\b/],
      ["latin", /\blatin|reggaeton|salsa|bachata|cumbia\b/],
      ["jazz", /\bjazz\b/],
      ["blues", /\bblues\b/],
      ["rock", /\brock|indie\b/],
      ["pop", /\bpop\b/],
      ["disco", /\bdisco\b/],
      ["funk", /\bfunk\b/],
      ["soul", /\bsoul\b/],
      ["reggae", /\breggae|dancehall\b/],
      ["metal", /\bmetal\b/],
      ["punk", /\bpunk\b/],
      ["classical", /\bclassical|orchestra|symphony\b/],
      ["flamenco", /\bflamenco\b/],
      ["fado", /\bfado\b/],
      ["samba", /\bsamba\b/],
      ["tango", /\btango\b/],
    ];
    const musicGenres = uniqueValues(genrePatterns.filter(([, pattern]) => pattern.test(text)).map(([genre]) => genre));

    const attributeTags = [];
    if (/\bcheap|budget|affordable|dive\b/.test(text) || stop?.price === "$") attributeTags.push("cheap_drinks");
    if (/\bpremium|luxury|expensive|champagne|high[-\s]?end\b/.test(text) || stop?.price === "$$$" || stop?.price === "$$$$") attributeTags.push("premium_drinks");
    if (/\bdance\s+floor|dancing|club|dj\b/.test(text)) attributeTags.push("dance_floor");
    if (/\blate[-\s]?late|after[-\s]?hours|all[-\s]?night|late\s+night\b/.test(text)) attributeTags.push("late_late");
    if (/\blow[-\s]?key|quiet|chill|conversation|calm\b/.test(text)) attributeTags.push("low_key_nightlife");
    if (/\blively|buzz|busy|scene|energetic|packed\b/.test(text)) attributeTags.push("lively_nightlife");
    if (/\bparty|wild|club|nightclub\b/.test(text)) attributeTags.push("party_nightlife");
    if (/\bromantic|date|couples?|intimate\b/.test(text)) attributeTags.push("romantic_nightlife");
    if (/\bscenic|view|views|rooftop|waterfront|terrace|patio|skyline\b/.test(text)) attributeTags.push("scenic_nightlife");
    if (/\blocal|neighborhood|regulars?|dive\b/.test(text)) attributeTags.push("local_bar");
    if (/\bspeakeasy|hidden|reservation[-\s]?only\b/.test(text)) attributeTags.push("speakeasy");
    if (/\bcraft\s+cocktail|cocktail|mixology\b/.test(text)) attributeTags.push("craft_cocktails");
    if (/\bcraft\s+beer|brewery|taproom\b/.test(text)) attributeTags.push("craft_beer");
    if (/\bnatural\s+wine|wine\s+bar\b/.test(text)) attributeTags.push("natural_wine");
    if (/\blive\s+music|jazz|band|concert\b/.test(text)) attributeTags.push("live_music");
    if (/\bdj|club\s+night|sets?\b/.test(text)) attributeTags.push("dj_sets");
    if (/\bcomedy|stand[-\s]?up\b/.test(text)) attributeTags.push("comedy");
    if (/\btheatre|theater|stage|show|performance\b/.test(text)) attributeTags.push("theatre_show");
    if (/\bkaraoke\b/.test(text)) attributeTags.push("karaoke");
    if (/\barcade|games?|pool\s+table|darts?|gaming\b/.test(text)) attributeTags.push("games");
    if (/\bsports?|watch\s+the\s+game|screen(s|ing)?\b/.test(text)) attributeTags.push("sports_screening");
    if (/\bqueer|lgbtq|gay\s+bar\b/.test(text)) attributeTags.push("queer_friendly");
    if (/\btourist|visitor|traveler|traveller\b/.test(text)) attributeTags.push("tourist_friendly");
    if (/\bdressy|upscale|polished|smart\s+casual\b/.test(text)) attributeTags.push("dressy");
    if (/\bcasual|no[-\s]?fuss|pub|dive\b/.test(text)) attributeTags.push("casual_nightlife");
    if (/\breservation|guestlist|tickets?|book\b/.test(text)) attributeTags.push("reservation_recommended_nightlife");
    if (/\bwalk[-\s]?in|drop[-\s]?in|no\s+reservation\b/.test(text)) attributeTags.push("walk_in_friendly_nightlife");

    return {
      venueKind: "nightlife",
      lodgingType: null,
      foodServiceType: null,
      cuisineTypes: [],
      priceTier: stop?.price ?? null,
      nightlifeType,
      musicGenres,
      attributeTags: uniqueValues(attributeTags),
    };
  }

  const isFood = list?.category === "Food" || stop?.category === "Food";
  if (isFood) {
    const text = [
      stop?.name,
      stop?.description,
      stop?.category,
      stop?.price,
      stop?.bookingUrl,
      stop?.officialUrl,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    let foodServiceType = "restaurant";
    if (/\bfood\s+trucks?\b/.test(text)) {
      foodServiceType = "food_truck";
    } else if (/\bfood\s+carts?\b/.test(text)) {
      foodServiceType = "food_cart";
    } else if (/\b(stall|stand|kiosk|market\s+counter)\b/.test(text)) {
      foodServiceType = "stall";
    } else if (/\b(fast\s+food|quick\s+service|counter[-\s]?service)\b/.test(text)) {
      foodServiceType = "fast_food";
    } else if (/\b(cafe|café|coffee|espresso|bakery|patisserie|pastry)\b/.test(text)) {
      foodServiceType = "cafe";
    }

    const cuisinePatterns = [
      ["american", /\bamerican\b/],
      ["argentine", /\bargentine|argentinian|parrilla|asado\b/],
      ["asian", /\basian\b/],
      ["bakery", /\bbakery|bakeries|pastry|patisserie|bread\b/],
      ["barbecue", /\bbarbecue|bbq|smoked\s+meat\b/],
      ["bistro", /\bbistro\b/],
      ["brazilian", /\bbrazilian|churrasco|boteco\b/],
      ["british", /\bbritish|english|pub\s+food\b/],
      ["cafe", /\bcafe|café|coffee|espresso\b/],
      ["caribbean", /\bcaribbean|jamaican|haitian\b/],
      ["catalan", /\bcatalan\b/],
      ["chinese", /\bchinese|cantonese|sichuan|szechuan|dim\s+sum\b/],
      ["colombian", /\bcolombian|arepa\b/],
      ["contemporary", /\bcontemporary|modern\b/],
      ["cuban", /\bcuban\b/],
      ["dessert", /\bdessert|ice\s+cream|gelato|chocolate\b/],
      ["ecuadorian", /\becuadorian\b/],
      ["emirati", /\bemirati\b/],
      ["filipino", /\bfilipino\b/],
      ["french", /\bfrench|brasserie|boulangerie\b/],
      ["german", /\bgerman|biergarten|beer\s+hall\b/],
      ["greek", /\bgreek\b/],
      ["guatemalan", /\bguatemalan\b/],
      ["hawaiian", /\bhawaiian|poke|plate\s+lunch\b/],
      ["indian", /\bindian|south\s+asian|curry|dosa\b/],
      ["indonesian", /\bindonesian\b/],
      ["italian", /\bitalian|pizza|pizzeria|pasta|trattoria|osteria\b/],
      ["japanese", /\bjapanese|sushi|ramen|izakaya|yakitori|omakase\b/],
      ["korean", /\bkorean|bbq|barbecue\b/],
      ["latin_american", /\blatin\s+american\b/],
      ["malaysian", /\bmalaysian\b/],
      ["mediterranean", /\bmediterranean\b/],
      ["mexican", /\bmexican|taco|taqueria|mezcal\b/],
      ["middle_eastern", /\bmiddle\s+eastern|levantine|falafel|shawarma\b/],
      ["nikkei", /\bnikkei\b/],
      ["peranakan", /\bperanakan|nyonya\b/],
      ["peruvian", /\bperuvian|ceviche|pisco\b/],
      ["portuguese", /\bportuguese|tasca|pastel\s+de\s+nata\b/],
      ["seafood", /\bseafood|fish|oyster|ceviche\b/],
      ["singaporean", /\bsingaporean|hawker\b/],
      ["spanish", /\bspanish|tapas|pintxos\b/],
      ["steakhouse", /\bsteakhouse|steak\b/],
      ["street_food", /\bstreet\s+food|hawker|stall|cart|food\s+truck\b/],
      ["thai", /\bthai\b/],
      ["turkish", /\bturkish|kebab|meyhane\b/],
      ["vegan", /\bvegan\b/],
      ["vegetarian", /\bvegetarian\b/],
      ["vietnamese", /\bvietnamese|pho|banh\s+mi\b/],
    ];
    const cuisineTypes = uniqueValues(cuisinePatterns.filter(([, pattern]) => pattern.test(text)).map(([cuisine]) => cuisine));

    const attributeTags = [];
    if (/\bcasual|easygoing|low[-\s]?key\b/.test(text) || ["stall", "food_truck", "food_cart", "fast_food"].includes(foodServiceType)) attributeTags.push("casual");
    if (/\bdate\s+night|date|romantic|couples?\b/.test(text)) attributeTags.push("date_night", "romantic_food");
    if (/\bgroup|shared|family[-\s]?style|large\s+tables?\b/.test(text)) attributeTags.push("group_friendly");
    if (/\bsolo|counter|bar\s+seat|counter\s+seat\b/.test(text)) attributeTags.push("solo_friendly");
    if (/\bfamily|kids|children\b/.test(text)) attributeTags.push("family_friendly_food");
    if (/\blocal\s+favorite|neighborhood|regulars?\b/.test(text)) attributeTags.push("local_favorite");
    if (/\bdestination|worth\s+planning|michelin|world'?s\s+50|la\s+liste\b/.test(text)) attributeTags.push("destination_dining");
    if (/\bfine\s+dining|michelin|tasting\s+menu|chef[-\s]?led|omakase\b/.test(text)) attributeTags.push("fine_dining");
    if (/\btasting\s+menu|omakase\b/.test(text)) attributeTags.push("tasting_menu");
    if (/\bstreet\s+food|hawker|stall|cart|food\s+truck\b/.test(text) || ["stall", "food_truck", "food_cart"].includes(foodServiceType)) attributeTags.push("street_food");
    if (/\bmarket|food\s+hall\b/.test(text)) attributeTags.push("market");
    if (/\blate[-\s]?night|after[-\s]?hours|all[-\s]?night\b/.test(text)) attributeTags.push("late_night");
    if (/\bbreakfast|morning\b/.test(text)) attributeTags.push("breakfast");
    if (/\bbrunch\b/.test(text)) attributeTags.push("brunch");
    if (/\bcoffee|espresso|cafe|café\b/.test(text)) attributeTags.push("coffee");
    if (/\bbakery|patisserie|pastry|bread|dessert\b/.test(text)) attributeTags.push("bakery");
    if (/\bseafood|fish|oyster|ceviche\b/.test(text)) attributeTags.push("seafood");
    if (/\bvegetarian\b/.test(text)) attributeTags.push("vegetarian_friendly");
    if (/\bvegan\b/.test(text)) attributeTags.push("vegan_friendly");
    if (/\bgluten[-\s]?free\b/.test(text)) attributeTags.push("gluten_free_friendly");
    if (/\breservation|book|booking|hard\s+to\s+get\b/.test(text)) attributeTags.push("reservation_recommended");
    if (/\bwalk[-\s]?in|no\s+reservation|counter\b/.test(text)) attributeTags.push("walk_in_friendly");
    if (/\bscenic|view|views|rooftop|waterfront|terrace|patio\b/.test(text)) attributeTags.push("scenic_food");
    if (/\blively|buzz|busy|scene|energetic\b/.test(text)) attributeTags.push("lively_food");
    if (/\bquiet|calm|peaceful\b/.test(text)) attributeTags.push("quiet_food");
    if (/\bbudget|cheap|affordable|value\b/.test(text) || stop?.price === "$") attributeTags.push("budget_food");
    if (/\bsplurge|expensive|luxury|premium\b/.test(text) || stop?.price === "$$$" || stop?.price === "$$$$") attributeTags.push("splurge_food");

    return {
      venueKind: "food_drink",
      lodgingType: null,
      foodServiceType,
      cuisineTypes,
      priceTier: stop?.price ?? null,
      nightlifeType: null,
      musicGenres: [],
      attributeTags: uniqueValues(attributeTags),
    };
  }

  const isOtherClassified =
    ["Culture", "Nature", "Activities", "Routes", "Essentials"].includes(list?.category) ||
    ["Culture", "Nature", "Activities", "Routes", "Essentials"].includes(stop?.category);
  if (isOtherClassified) {
    const text = [
      list?.category,
      stop?.name,
      stop?.description,
      stop?.category,
      stop?.price,
      stop?.bookingUrl,
      stop?.officialUrl,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    let venueKind = "other";
    if (/\b(airport|station|terminal|ferry|train|metro|tram|bus|transit|transport)\b/.test(text) || list?.category === "Essentials" || stop?.category === "Essentials") {
      venueKind = "transport";
    } else if (/\b(shop|shopping|market|boutique|vintage|bookstore|store|retail|souvenir|makers?)\b/.test(text)) {
      venueKind = "retail";
    } else if (/\b(stadium|arena|theatre|theater|concert|performance|festival|show|tickets?|class|workshop|spa|bathhouse|tour)\b/.test(text) || list?.category === "Activities" || stop?.category === "Activities") {
      venueKind = "event_venue";
    } else if (/\b(landmark|monument|memorial|tower|bridge|palace|castle|cathedral|basilica|church|temple|mosque|synagogue|unesco|iconic)\b/.test(text)) {
      venueKind = "landmark";
    } else if (list?.category === "Nature" || stop?.category === "Nature" || /\b(park|garden|beach|waterfront|river|canal|lake|harbor|harbour|trail|hike|walk|viewpoint|lookout|forest|mountain|hill|outdoor|nature)\b/.test(text)) {
      venueKind = "outdoors";
    } else if (list?.category === "Culture" || stop?.category === "Culture" || /\b(museum|gallery|art|exhibition|historic|history|culture|library|architecture|public\s+art)\b/.test(text)) {
      venueKind = "culture";
    } else if (list?.category === "Routes" || stop?.category === "Routes") {
      venueKind = "outdoors";
    }

    const attributeTags = [];
    if (/\b(museum|collection|collections)\b/.test(text)) attributeTags.push("museum");
    if (/\b(gallery|exhibition|contemporary\s+art)\b/.test(text)) attributeTags.push("gallery");
    if (/\b(historic|history|heritage|old\s+town|ancient|archaeolog)\b/.test(text)) attributeTags.push("historic_site", "historic_landmark");
    if (/\b(architecture|architectural|design|built\s+form)\b/.test(text)) attributeTags.push("architecture", "architectural_landmark");
    if (/\b(public\s+art|mural|sculpture|street\s+art)\b/.test(text)) attributeTags.push("public_art");
    if (/\b(church|cathedral|basilica|mosque|temple|synagogue|chapel|sacred|religious)\b/.test(text)) attributeTags.push("religious_site");
    if (/\b(literary|library|book|writer|poet)\b/.test(text)) attributeTags.push("literary");
    if (/\b(learn|learning|educational|interpretation|context)\b/.test(text)) attributeTags.push("educational");
    if (/\b(family|kids|children)\b/.test(text)) attributeTags.push("family_culture", "family_outdoors", "family_activity");
    if (/\b(indoor|rainy|weather)\b/.test(text)) attributeTags.push("rainy_day", "indoor_activity");
    if (/\b(free|no\s+ticket|open\s+access)\b/.test(text)) attributeTags.push("free_entry");
    if (/\b(ticket|timed\s+entry|admission|book|booking|reservation)\b/.test(text)) attributeTags.push("ticketed", "ticketed_activity");
    if (/\b(tour|guided)\b/.test(text)) attributeTags.push("guided_tour");
    if (/\b(quiet|calm|contemplative|slow)\b/.test(text)) attributeTags.push("quiet_culture");
    if (/\b(immersive|interactive|experiential|hands[-\s]?on)\b/.test(text)) attributeTags.push("immersive", "hands_on");
    if (/\b(park|square|green\s+space)\b/.test(text)) attributeTags.push("park");
    if (/\b(garden|botanical|landscaped)\b/.test(text)) attributeTags.push("garden");
    if (/\b(waterfront|river|canal|lake|harbor|harbour|beach|coast|seaside)\b/.test(text)) attributeTags.push("waterfront");
    if (/\b(view|views|viewpoint|lookout|panorama|skyline|scenic)\b/.test(text)) attributeTags.push("scenic_view", "viewpoint");
    if (/\b(walk|walking|route|stroll|promenade)\b/.test(text)) attributeTags.push("walking_route");
    if (/\b(hike|hiking|trail|mountain|hill)\b/.test(text)) attributeTags.push("hiking");
    if (/\b(easy|gentle|low[-\s]?effort)\b/.test(text)) attributeTags.push("easy_walk");
    if (/\b(cycling|bike|bicycle)\b/.test(text)) attributeTags.push("cycling");
    if (/\b(picnic|lawns?)\b/.test(text)) attributeTags.push("picnic");
    if (/\b(wildlife|bird|deer|animals?)\b/.test(text)) attributeTags.push("wildlife");
    if (/\b(sunset|golden[-\s]?hour)\b/.test(text)) attributeTags.push("sunset");
    if (/\b(active|run|climb|sport|surf|swim|cycle)\b/.test(text)) attributeTags.push("active_outdoors");
    if (/\b(nature|escape|forest|woods?|mountain|countryside)\b/.test(text)) attributeTags.push("nature_escape");
    if (/\b(iconic|symbol|famous|must[-\s]?see)\b/.test(text)) attributeTags.push("iconic_landmark", "must_see");
    if (/\b(monument|memorial|statue)\b/.test(text)) attributeTags.push("monument");
    if (/\b(photo|photograph|visual|picturesque)\b/.test(text)) attributeTags.push("photo_spot");
    if (/\bunesco\b/.test(text)) attributeTags.push("unesco");
    if (/\b(quick|short|route\s+marker|orientation\s+point)\b/.test(text)) attributeTags.push("quick_stop");
    if (/\b(market|bazaar|flea)\b/.test(text)) attributeTags.push("market_retail");
    if (/\b(boutique|independent\s+shop)\b/.test(text)) attributeTags.push("boutique");
    if (/\b(vintage|thrift|antique|secondhand)\b/.test(text)) attributeTags.push("vintage");
    if (/\b(luxury|designer|premium)\b/.test(text)) attributeTags.push("luxury_shopping");
    if (/\b(local\s+makers?|artisan|craft)\b/.test(text)) attributeTags.push("local_makers");
    if (/\b(design\s+shop|homeware|design[-\s]?led)\b/.test(text)) attributeTags.push("design_shopping");
    if (/\b(bookstore|books?|print)\b/.test(text)) attributeTags.push("bookstore");
    if (/\b(shopping\s+street|retail\s+district)\b/.test(text)) attributeTags.push("shopping_street");
    if (/\b(souvenir|gift)\b/.test(text)) attributeTags.push("souvenir");
    if (/\b(performance|show|stage|theatre|theater|concert)\b/.test(text)) attributeTags.push("performance_venue");
    if (/\b(stadium|arena|sports?|match[-\s]?day)\b/.test(text)) attributeTags.push("sports_venue");
    if (/\b(festival|seasonal|activation)\b/.test(text)) attributeTags.push("festival_site");
    if (/\b(adventure|adrenaline|thrill)\b/.test(text)) attributeTags.push("adventure");
    if (/\b(wellness|spa|bathhouse|thermal|restorative)\b/.test(text)) attributeTags.push("wellness_activity");
    if (/\b(outdoor|open[-\s]?air)\b/.test(text)) attributeTags.push("outdoor_activity");
    if (/\b(station|terminal|transit|transport|airport)\b/.test(text)) attributeTags.push("transit_hub");
    if (/\bferry\b/.test(text)) attributeTags.push("ferry");
    if (/\b(train|rail|metro|tram)\b/.test(text)) attributeTags.push("train");
    if (/\bairport\b/.test(text)) attributeTags.push("airport");
    if (/\b(practical|logistics|orientation|essential)\b/.test(text)) attributeTags.push("practical");

    return {
      venueKind,
      lodgingType: null,
      foodServiceType: null,
      cuisineTypes: [],
      priceTier: null,
      nightlifeType: null,
      musicGenres: [],
      attributeTags: uniqueValues(attributeTags),
    };
  }

  const isStay = list?.category === "Stay" || stop?.category === "Stay";
  if (!isStay) {
    return {
      venueKind: null,
      lodgingType: null,
      foodServiceType: null,
      cuisineTypes: [],
      priceTier: null,
      nightlifeType: null,
      musicGenres: [],
      attributeTags: [],
    };
  }

  const text = [
    stop?.name,
    stop?.description,
    stop?.category,
    stop?.price,
    stop?.bookingUrl,
    stop?.officialUrl,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  let lodgingType = null;
  if (/\bholiday\s+parks?\b/.test(text)) {
    lodgingType = "holiday_park";
  } else if (/\bcamp(ing|ground|site)?\b|\bglamp(ing)?\b/.test(text)) {
    lodgingType = "camping";
  } else if (/\bresorts?\b/.test(text)) {
    lodgingType = "resort";
  } else if (/\bhostels?\b|\bhostelworld\b/.test(text)) {
    lodgingType = "hostel";
  } else if (/\b(aparthotel|apartment[-\s]?hotel|serviced apartments?)\b/.test(text)) {
    lodgingType = "apartment_hotel";
  } else if (/\bguest\s*houses?\b|\bguesthouses?\b|\bhostals?\b|\bbed\s+and\s+breakfast\b|\bb&b\b/.test(text)) {
    lodgingType = "guesthouse";
  } else if (/\bairbnb\b|\bvacation rentals?\b|\bshort[-\s]?term rentals?\b/.test(text)) {
    lodgingType = "airbnb";
  } else if (/\bhotels?\b|\binn\b|\bsuites?\b/.test(text)) {
    lodgingType = "hotel";
  }

  const attributeTags = [];
  if (/\b(relax|relaxing|calm|restful|retreat|spa|wellness)\b/.test(text)) attributeTags.push("relaxing");
  if (/\bquiet|peaceful|low[-\s]?key\b/.test(text)) attributeTags.push("quiet");
  if (/\blively|buzz|busy|energetic\b/.test(text)) attributeTags.push("lively");
  if (/\bparty|club|nightlife|bar\s+crawl\b/.test(text)) attributeTags.push("party");
  if (/\bsocial|meet\s+people|communal|backpacker\b/.test(text) || lodgingType === "hostel") attributeTags.push("social");
  if (/\bscenic|views?|rooftop|panoramic|lookout\b/.test(text)) attributeTags.push("scenic");
  if (/\bbeach|waterfront|seaside|coast|ocean\b/.test(text)) attributeTags.push("beach");
  if (/\bnature|forest|mountain|park|lake|countryside\b/.test(text) || lodgingType === "camping") attributeTags.push("nature");
  if (/\bcentral|downtown|city\s+center|city\s+centre\b/.test(text)) attributeTags.push("central");
  if (/\bbudget|cheap|affordable|value\b/.test(text) || lodgingType === "hostel") attributeTags.push("budget");
  if (/\bluxury|five[-\s]?star|5[-\s]?star|premium\b/.test(text) || lodgingType === "resort") attributeTags.push("luxury");
  if (/\bfamily|kids|children\b/.test(text) || lodgingType === "holiday_park") attributeTags.push("family_friendly");
  if (/\bromantic|couples?|honeymoon\b/.test(text)) attributeTags.push("romantic");
  if (/\bwork|cowork|business|desk|remote\b/.test(text)) attributeTags.push("work_friendly");
  if (/\bdesign|boutique|stylish|architecture|minimalist\b/.test(text)) attributeTags.push("design");
  if (/\baccessible|wheelchair|step[-\s]?free\b/.test(text)) attributeTags.push("accessible");
  if (/\bpet[-\s]?friendly|dogs?\s+welcome\b/.test(text)) attributeTags.push("pet_friendly");

  return {
    venueKind: "lodging",
    lodgingType,
    foodServiceType: null,
    cuisineTypes: [],
    priceTier: null,
    nightlifeType: null,
    musicGenres: [],
    attributeTags: uniqueValues(attributeTags),
  };
}

function requireScopedFilters(filters) {
  if (!hasEditorialGuideFilters(filters)) {
    throw new Error("Refusing to backfill all normalized editorial guides. Pass --city, --neighborhood, --id, or --slug.");
  }
}

async function loadDestinationMaps(client) {
  const { rows } = await client.query(
    "select id, scope, name, slug, parent_id, country_name, city_name, legacy_id, timezone from public.destinations",
  );
  const cityByName = new Map();
  const cityTimezoneById = new Map();
  const countryByName = new Map();
  const neighborhoodsByCity = new Map();

  for (const row of rows) {
    if (row.scope === "country") {
      countryByName.set(normalizeName(row.name), row.id);
    }
    if (row.scope === "city") {
      cityByName.set(`${normalizeName(row.name)}|${normalizeName(row.country_name)}`, row.id);
      cityTimezoneById.set(row.id, row.timezone ?? fallbackCityTimezone(row.name, row.country_name));
    }
    if (row.scope === "neighborhood" && row.parent_id) {
      const items = neighborhoodsByCity.get(row.parent_id) ?? new Map();
      items.set(normalizeName(row.name), row.id);
      if (row.legacy_id) {
        items.set(normalizeName(row.legacy_id.split("::").at(-1)), row.id);
      }
      neighborhoodsByCity.set(row.parent_id, items);
    }
  }

  return { cityByName, cityTimezoneById, countryByName, neighborhoodsByCity };
}

function resolveCityId(maps, city, country) {
  if (!city) {
    return null;
  }
  return maps.cityByName.get(`${normalizeName(city)}|${normalizeName(country)}`) ?? null;
}

function resolveNeighborhoodId(maps, cityId, neighborhood) {
  if (!cityId || !neighborhood) {
    return null;
  }
  const neighborhoods = maps.neighborhoodsByCity.get(cityId);
  return neighborhoods?.get(normalizeName(neighborhood)) ?? null;
}

function parsePublishArgs(argv) {
  const dryRun = argv.includes("--dry-run") || argv.includes("--check");
  const copyOnly = argv.includes("--copy-only");
  const titleOnly = argv.includes("--title-only");
  if (copyOnly && titleOnly) {
    throw new Error("Use either --copy-only or --title-only, not both.");
  }
  const filterArgs = argv.filter(
    (arg) => !["--dry-run", "--check", "--copy-only", "--title-only"].includes(arg),
  );
  return { dryRun, copyOnly, titleOnly, filters: parseEditorialGuideArgs(filterArgs) };
}

function logPhase(message, metadata = undefined) {
  const suffix = metadata ? ` ${JSON.stringify(metadata)}` : "";
  console.log(`[editorial-push] ${message}${suffix}`);
}

function elapsedMs(startedAt) {
  return Math.round(Number(process.hrtime.bigint() - startedAt) / 1_000_000);
}

function buildGuideContexts(maps, selectedGuides) {
  const contexts = new Map();
  for (const list of selectedGuides) {
    const cityId = resolveCityId(maps, list.location?.city, list.location?.country);
    const countryId = list.location?.country ? maps.countryByName.get(normalizeName(list.location.country)) ?? null : null;
    const neighborhoodId = resolveNeighborhoodId(maps, cityId, list.location?.neighborhood);
    const destinationId = neighborhoodId ?? cityId ?? countryId;
    if (!destinationId) {
      throw new Error(`Could not resolve destination for ${list.id}`);
    }
    const timezone =
      maps.cityTimezoneById.get(cityId) ??
      fallbackCityTimezone(list.location?.city, list.location?.country);
    contexts.set(list.id, { cityId, countryId, neighborhoodId, destinationId, timezone });
  }
  return contexts;
}

async function ensureSelectedDestinationTimezones(client, selectedGuides) {
  const rowsByKey = new Map();
  for (const list of selectedGuides) {
    const city = list.location?.city;
    const country = list.location?.country;
    const timezone = fallbackCityTimezone(city, country);
    if (!city || !country || !timezone) {
      continue;
    }
    rowsByKey.set(cityTimezoneKey(city, country), {
      city_slug: slugify(city),
      country_name: country,
      timezone,
    });
  }

  const rows = [...rowsByKey.values()];
  if (!rows.length) {
    return 0;
  }

  const result = await client.query(
    `with incoming as (
       select *
       from jsonb_to_recordset($1::jsonb) as row(
         city_slug text,
         country_name text,
         timezone text
       )
     )
     update public.destinations destination
     set timezone = incoming.timezone
     from incoming
     where destination.scope = 'city'::public.destination_scope
       and destination.slug = incoming.city_slug
       and destination.country_name = incoming.country_name
       and destination.timezone is distinct from incoming.timezone`,
    [JSON.stringify(rows)],
  );
  return result.rowCount ?? 0;
}

function getGuideCoverPhoto(list) {
  const explicitPhoto = list.photo?.trim();
  if (explicitPhoto) return explicitPhoto;

  for (const stop of list.stops ?? []) {
    const stopPhoto = stop.photo?.trim();
    if (stopPhoto) return stopPhoto;

    for (const place of stop.places ?? []) {
      const placePhoto = place.photo?.trim();
      if (placePhoto) return placePhoto;
    }
  }

  return null;
}

function buildEntryRows(selectedGuides, contexts) {
  return selectedGuides.map((list) => {
    const context = contexts.get(list.id);
    return {
      legacy_id: list.id,
      slug: list.slug,
      seo_slug: list.seoSlug ?? null,
      seo_title: list.seoTitle ?? null,
      seo_description: list.seoDescription ?? null,
      title: list.title,
      description: list.description,
      highlights: list.highlights ?? [],
      photo_url: getGuideCoverPhoto(list),
      canonical_url: list.url ?? null,
      category: list.category,
      submission_type: toSchemaSubmissionType(list.submissionType),
      destination_id: context.destinationId,
      city_id: context.cityId,
      neighborhood_id: context.neighborhoodId,
      country_name: list.location?.country ?? null,
      continent_name: list.location?.continent ?? null,
      creator_id: list.creator?.id ?? null,
      creator_name: list.creator?.name ?? null,
      creator_avatar: list.creator?.avatar ?? null,
      upvotes: list.upvotes ?? 0,
      created_on: list.createdAt ?? new Date().toISOString().slice(0, 10),
      metadata: { editorialGuideId: list.id },
    };
  });
}

function mergeVenueRows(existing, incoming) {
  if (!existing) {
    return {
      ...incoming,
      aliases: incoming.aliases ?? [],
      venue_kinds: incoming.venue_kinds ?? [],
      cuisine_types: incoming.cuisine_types ?? [],
      music_genres: incoming.music_genres ?? [],
      attribute_tags: incoming.attribute_tags ?? [],
      source_metadata: incoming.source_metadata ?? {},
    };
  }

  return {
    ...existing,
    legacy_id: existing.legacy_id ?? incoming.legacy_id,
    name: incoming.name || existing.name,
    normalized_name: incoming.normalized_name || existing.normalized_name,
    aliases: mergeUniqueValues(existing.aliases, incoming.aliases),
    destination_id: incoming.destination_id ?? existing.destination_id,
    city_id: incoming.city_id ?? existing.city_id,
    neighborhood_id: incoming.neighborhood_id ?? existing.neighborhood_id,
    country: incoming.country ?? existing.country,
    timezone: incoming.timezone ?? existing.timezone,
    coordinates: incoming.coordinates ?? existing.coordinates,
    official_url: incoming.official_url ?? existing.official_url,
    venue_kind: incoming.venue_kind !== "other" ? incoming.venue_kind : existing.venue_kind,
    venue_kinds: mergeUniqueValues(existing.venue_kinds, incoming.venue_kinds),
    lodging_type: incoming.lodging_type ?? existing.lodging_type,
    food_service_type: incoming.food_service_type ?? existing.food_service_type,
    cuisine_types: mergeUniqueValues(existing.cuisine_types, incoming.cuisine_types),
    price_tier: incoming.price_tier ?? existing.price_tier,
    nightlife_type: incoming.nightlife_type ?? existing.nightlife_type,
    music_genres: mergeUniqueValues(existing.music_genres, incoming.music_genres),
    attribute_tags: mergeUniqueValues(incoming.attribute_tags, existing.attribute_tags),
    source_metadata: { ...existing.source_metadata, ...incoming.source_metadata },
  };
}

function buildStopPayload(selectedGuides, contexts) {
  const venueRowsByKey = new Map();
  const stopRows = [];
  const mediaRowsByKey = new Map();
  const hoursRows = [];
  let stopOrder = 0;

  for (const list of selectedGuides) {
    const context = contexts.get(list.id);
    let order = 0;
    for (const stop of list.stops ?? []) {
      order += 1;
      stopOrder += 1;
      const classification = inferVenueClassification(stop, list);
      const slug = stop.poiId ? slugify(stop.poiId) : slugify(stop.name);
      const venueKey = `${context.cityId ?? "null"}|${slug}`;
      const venueRow = {
        row_key: venueKey,
        legacy_id: stop.poiId ?? `${list.id}:${stop.id}`,
        slug,
        name: stop.name,
        normalized_name: normalizeName(stop.name),
        aliases: [],
        destination_id: context.cityId,
        city_id: context.cityId,
        neighborhood_id: context.neighborhoodId,
        country: list.location?.country ?? null,
        timezone: context.timezone ?? null,
        coordinates: normalizeCoordinates(stop.coordinates),
        official_url: stop.officialUrl ?? stop.bookingUrl ?? null,
        venue_kind: classification.venueKind ?? "other",
        venue_kinds: mergeUniqueValues(
          classification.venueKind ? [classification.venueKind] : [],
          classification.lodgingType ? ["lodging"] : [],
          classification.foodServiceType ? ["food_drink"] : [],
          classification.nightlifeType ? ["nightlife"] : [],
        ),
        lodging_type: classification.lodgingType ?? null,
        food_service_type: classification.foodServiceType ?? null,
        cuisine_types: classification.cuisineTypes ?? [],
        price_tier: classification.priceTier ?? null,
        nightlife_type: classification.nightlifeType ?? null,
        music_genres: classification.musicGenres ?? [],
        attribute_tags: classification.attributeTags ?? [],
        source_metadata: { source: "editorial_guides", entryId: list.id, stopId: stop.id },
      };
      venueRowsByKey.set(venueKey, mergeVenueRows(venueRowsByKey.get(venueKey), venueRow));

      const stopHours = isPublishableVenueHours(stop.hours) ? stop.hours : null;
      stopRows.push({
        entry_legacy_id: list.id,
        legacy_id: stop.id,
        stop_order: order,
        poi_legacy_id: stop.poiId ?? null,
        name: stop.name,
        description: stop.description,
        category: stop.category ?? list.category,
        subcategory: stop.subcategory ?? null,
        subcategories: stop.subcategories ?? [],
        destination_id: context.neighborhoodId ?? context.cityId ?? null,
        venue_key: venueKey,
        coordinates: normalizeCoordinates(stop.coordinates),
        price_label: stop.price ?? null,
        price_source: stop.priceSource ?? null,
        booking_url: stop.bookingUrl ?? null,
        official_url: stop.officialUrl ?? null,
        journey_date: stop.journeyDate ?? stop.itineraryDate ?? null,
        journey_day: stop.journeyDay ?? stop.itineraryDay ?? null,
        hours: stopHours,
        places: stop.places ?? [],
        metadata: {
          source: "editorial_guides",
          ...(stop.routeCoordinates ? { routeCoordinates: stop.routeCoordinates } : {}),
        },
      });

      if (stop.photo?.trim()) {
        mediaRowsByKey.set(`${venueKey}|${stop.photo.trim()}`, {
          venue_key: venueKey,
          url: stop.photo.trim(),
          role: "primary",
          source_type: "editorial_guides",
          source_entity_type: "entry_stop",
          source_legacy_id: stop.id,
          raw_metadata: { source: "guide_stop_photo", entryId: list.id, stopId: stop.id, poiId: stop.poiId ?? null },
          sort_order: 0,
        });
      }

      if (stopHours) {
        hoursRows.push({ venue_key: venueKey, stop });
      }
    }
  }

  return {
    venueRows: [...venueRowsByKey.values()],
    stopRows,
    mediaRows: [...mediaRowsByKey.values()],
    hoursRows,
    stopCount: stopOrder,
  };
}

async function upsertEditorialPoisBatch(client, pois) {
  if (!pois.length) {
    return 0;
  }
  const result = await client.query(
    `with incoming as (
       select *
       from jsonb_to_recordset($1::jsonb) as row(
         id text,
         name text,
         country text,
         city text,
         neighborhood text,
         coordinates jsonb,
         photo text,
         guide_ids text[],
         guide_slugs text[],
         categories text[]
       )
     )
     insert into public.editorial_pois (
       id, name, country, city, neighborhood, coordinates, photo,
       guide_ids, guide_slugs, categories
     )
     select
       id, name, country, city, neighborhood, coordinates, photo,
       guide_ids, guide_slugs, categories
     from incoming
     on conflict (id) do update set
       name = excluded.name,
       country = excluded.country,
       city = excluded.city,
       neighborhood = excluded.neighborhood,
       coordinates = excluded.coordinates,
       photo = coalesce(excluded.photo, public.editorial_pois.photo),
       guide_ids = excluded.guide_ids,
       guide_slugs = excluded.guide_slugs,
       categories = excluded.categories`,
    [JSON.stringify(pois.map((poi) => ({
      id: poi.id,
      name: poi.name,
      country: poi.country ?? null,
      city: poi.city ?? null,
      neighborhood: poi.neighborhood ?? null,
      coordinates: normalizeCoordinates(poi.coordinates),
      photo: poi.photo ?? null,
      guide_ids: poi.guideIds ?? [],
      guide_slugs: poi.guideSlugs ?? [],
      categories: poi.categories ?? [],
    })))],
  );
  return result.rowCount ?? 0;
}

async function upsertEntriesBatch(client, rows) {
  const result = await client.query(
    `with incoming as (
       select *
       from jsonb_to_recordset($1::jsonb) as row(
         legacy_id text,
         slug text,
         seo_slug text,
         seo_title text,
         seo_description text,
         title text,
         description text,
         highlights text[],
         photo_url text,
         canonical_url text,
         category text,
         submission_type public.rguide_submission_type,
         destination_id uuid,
         city_id uuid,
         neighborhood_id uuid,
         country_name text,
         continent_name text,
         creator_id text,
         creator_name text,
         creator_avatar text,
         upvotes integer,
         created_on date,
         metadata jsonb
       )
     ),
     upserted as (
       insert into public.entries (
         legacy_id, slug, seo_slug, seo_title, seo_description, title, description,
         highlights, photo_url, canonical_url, category, submission_type, status,
         destination_id, city_id, neighborhood_id, country_name, continent_name,
         creator_id, creator_name, creator_avatar, upvotes, created_on,
         source_table, metadata
       )
       select
         legacy_id, slug, seo_slug, seo_title, seo_description, title, description,
         highlights, photo_url, canonical_url, category, submission_type, 'published',
         destination_id, city_id, neighborhood_id, country_name, continent_name,
         creator_id, creator_name, creator_avatar, upvotes, created_on,
         'editorial_guides', metadata
       from incoming
       on conflict (legacy_id) do update set
         slug = excluded.slug,
         seo_slug = excluded.seo_slug,
         seo_title = excluded.seo_title,
         seo_description = excluded.seo_description,
         title = excluded.title,
         description = excluded.description,
         highlights = excluded.highlights,
         photo_url = excluded.photo_url,
         canonical_url = excluded.canonical_url,
         category = excluded.category,
         submission_type = excluded.submission_type,
         status = excluded.status,
         destination_id = excluded.destination_id,
         city_id = excluded.city_id,
         neighborhood_id = excluded.neighborhood_id,
         country_name = excluded.country_name,
         continent_name = excluded.continent_name,
         creator_id = excluded.creator_id,
         creator_name = excluded.creator_name,
         creator_avatar = excluded.creator_avatar,
         upvotes = excluded.upvotes,
         created_on = excluded.created_on,
         source_table = excluded.source_table,
         metadata = public.entries.metadata || excluded.metadata
       returning id, legacy_id
     )
     select id, legacy_id from upserted`,
    [JSON.stringify(rows)],
  );
  return new Map(result.rows.map((row) => [row.legacy_id, row.id]));
}

async function upsertVenuesBatch(client, venueRows) {
  if (!venueRows.length) {
    return new Map();
  }
  const result = await client.query(
    `with incoming as (
       select *
       from jsonb_to_recordset($1::jsonb) as row(
         row_key text,
         legacy_id text,
         slug text,
         name text,
         normalized_name text,
         aliases text[],
         destination_id uuid,
         city_id uuid,
         neighborhood_id uuid,
         country text,
         timezone text,
         coordinates jsonb,
         official_url text,
         venue_kind public.venue_kind,
         venue_kinds public.venue_kind[],
         lodging_type public.lodging_type,
         food_service_type public.food_service_type,
         cuisine_types text[],
         price_tier public.price_tier,
         nightlife_type public.nightlife_type,
         music_genres text[],
         attribute_tags text[],
         source_metadata jsonb
       )
     ),
     upserted as (
       insert into public.venues (
         legacy_id, slug, name, normalized_name, aliases, destination_id, city_id,
         neighborhood_id, country, timezone, coordinates, official_url, venue_kind,
         venue_kinds, lodging_type, food_service_type, cuisine_types, price_tier,
         nightlife_type, music_genres, attribute_tags, source_metadata
       )
       select
         legacy_id, slug, name, normalized_name, coalesce(aliases, '{}'), destination_id, city_id,
         neighborhood_id, country, timezone, coordinates, official_url, coalesce(venue_kind, 'other'),
         coalesce(venue_kinds, '{}'), lodging_type, food_service_type, coalesce(cuisine_types, '{}'), price_tier,
         nightlife_type, coalesce(music_genres, '{}'), coalesce(attribute_tags, '{}'), coalesce(source_metadata, '{}'::jsonb)
       from incoming
       on conflict (city_id, slug) do update set
         legacy_id = coalesce(public.venues.legacy_id, excluded.legacy_id),
         slug = excluded.slug,
         name = excluded.name,
         normalized_name = excluded.normalized_name,
         aliases = array(select distinct unnest(public.venues.aliases || excluded.aliases)),
         destination_id = coalesce(excluded.destination_id, public.venues.destination_id),
         neighborhood_id = coalesce(excluded.neighborhood_id, public.venues.neighborhood_id),
         country = coalesce(excluded.country, public.venues.country),
         timezone = coalesce(excluded.timezone, public.venues.timezone),
         coordinates = coalesce(excluded.coordinates, public.venues.coordinates),
         official_url = coalesce(excluded.official_url, public.venues.official_url),
         venue_kind = case
           when excluded.venue_kind = 'other' then public.venues.venue_kind
           else excluded.venue_kind
         end,
         venue_kinds = array(
           select distinct unnest(
             public.venues.venue_kinds || excluded.venue_kinds ||
             array[public.venues.venue_kind, excluded.venue_kind]::public.venue_kind[]
           )
         ),
         lodging_type = coalesce(excluded.lodging_type, public.venues.lodging_type),
         food_service_type = coalesce(excluded.food_service_type, public.venues.food_service_type),
         cuisine_types = array(select distinct unnest(public.venues.cuisine_types || excluded.cuisine_types)),
         price_tier = coalesce(excluded.price_tier, public.venues.price_tier),
         nightlife_type = coalesce(excluded.nightlife_type, public.venues.nightlife_type),
         music_genres = array(select distinct unnest(public.venues.music_genres || excluded.music_genres)),
         attribute_tags = array(
           select tag
           from unnest(excluded.attribute_tags || public.venues.attribute_tags) with ordinality as merged(tag, ord)
           where tag is not null and tag <> ''
           group by tag
           order by min(ord)
         ),
         source_metadata = public.venues.source_metadata || excluded.source_metadata
       returning id, city_id, slug
     )
     select incoming.row_key, upserted.id
     from incoming
     join upserted
       on upserted.city_id is not distinct from incoming.city_id
      and upserted.slug = incoming.slug`,
    [JSON.stringify(venueRows)],
  );
  return new Map(result.rows.map((row) => [row.row_key, row.id]));
}

async function replaceEntryStopsBatch(client, stopRows, entryIdByLegacyId, venueIdByKey) {
  const entryIds = [...entryIdByLegacyId.values()];
  if (!entryIds.length) {
    return 0;
  }
  await client.query("delete from public.entry_stops where entry_id = any($1::uuid[])", [entryIds]);
  if (!stopRows.length) {
    return 0;
  }
  const rows = stopRows.map((row) => ({
    ...row,
    entry_id: entryIdByLegacyId.get(row.entry_legacy_id),
    venue_id: venueIdByKey.get(row.venue_key) ?? null,
  }));
  const result = await client.query(
    `with incoming as (
       select *
       from jsonb_to_recordset($1::jsonb) as row(
         entry_id uuid,
         legacy_id text,
         stop_order integer,
         poi_legacy_id text,
         name text,
         description text,
         category text,
         subcategory text,
         subcategories jsonb,
         destination_id uuid,
         venue_id uuid,
         coordinates jsonb,
         price_label text,
         price_source text,
         booking_url text,
         official_url text,
         journey_date date,
         journey_day integer,
         hours jsonb,
         places jsonb,
         metadata jsonb
       )
     )
     insert into public.entry_stops (
       entry_id, legacy_id, stop_order, poi_legacy_id, name, description, category,
       subcategory, subcategories, destination_id, venue_id, coordinates, price_label,
       price_source, booking_url, official_url, journey_date, journey_day, hours,
       places, metadata
     )
     select
       entry_id, legacy_id, stop_order, poi_legacy_id, name, description, category,
       subcategory, coalesce(subcategories, '[]'::jsonb), destination_id, venue_id, coordinates, price_label,
       price_source, booking_url, official_url, journey_date, journey_day, hours,
       coalesce(places, '[]'::jsonb), coalesce(metadata, '{}'::jsonb)
     from incoming`,
    [JSON.stringify(rows)],
  );
  return result.rowCount ?? 0;
}

async function upsertVenueMediaBatch(client, mediaRows, venueIdByKey) {
  const rows = mediaRows
    .map((row) => ({ ...row, venue_id: venueIdByKey.get(row.venue_key) ?? null }))
    .filter((row) => row.venue_id && row.url);
  if (!rows.length) {
    return 0;
  }
  const result = await client.query(
    `with incoming as (
       select *
       from jsonb_to_recordset($1::jsonb) as row(
         venue_id uuid,
         url text,
         role text,
         source_type text,
         source_entity_type text,
         source_legacy_id text,
         raw_metadata jsonb,
         sort_order integer
       )
     ),
     source_matched as (
       update public.venue_media media
       set role = case
             when media.role = 'gallery' then incoming.role
             else media.role
           end,
           source_type = coalesce(media.source_type, incoming.source_type),
           source_entity_type = coalesce(media.source_entity_type, incoming.source_entity_type),
           source_legacy_id = coalesce(media.source_legacy_id, incoming.source_legacy_id),
           raw_metadata = media.raw_metadata || coalesce(incoming.raw_metadata, '{}'::jsonb),
           is_active = true,
           updated_at = now()
       from incoming
       where media.venue_id = incoming.venue_id
         and media.source_url = incoming.url
       returning media.id, media.venue_id, media.storage_provider, media.public_url, media.ingestion_status
     ),
     inserted as (
       insert into public.venue_media (
         venue_id, url, source_url, role, source_type, source_entity_type, source_legacy_id,
         raw_metadata, sort_order
       )
       select
         venue_id, url, url, role, source_type, source_entity_type, source_legacy_id,
         coalesce(raw_metadata, '{}'::jsonb), coalesce(sort_order, 0)
       from incoming
       where not exists (
         select 1
         from public.venue_media existing
         where existing.venue_id = incoming.venue_id
           and (existing.url = incoming.url or existing.source_url = incoming.url)
       )
       on conflict (venue_id, url) do update set
         role = case
           when public.venue_media.role = 'gallery' then excluded.role
           else public.venue_media.role
         end,
         source_url = coalesce(public.venue_media.source_url, excluded.source_url),
         source_type = coalesce(public.venue_media.source_type, excluded.source_type),
         source_entity_type = coalesce(public.venue_media.source_entity_type, excluded.source_entity_type),
         source_legacy_id = coalesce(public.venue_media.source_legacy_id, excluded.source_legacy_id),
         raw_metadata = public.venue_media.raw_metadata || excluded.raw_metadata,
         is_active = true,
         updated_at = now()
       returning id, venue_id, storage_provider, public_url, ingestion_status
     ),
     upserted as (
       select * from source_matched
       union all
       select * from inserted
     ),
     ranked as (
       select id, venue_id, row_number() over (partition by venue_id order by id) as rank
       from upserted
       where storage_provider = 'cloudflare_r2'
         and ingestion_status = 'stored'
         and public_url is not null
     ),
     updated as (
       update public.venues venue
       set primary_photo_id = ranked.id
       from ranked
       where venue.id = ranked.venue_id
         and ranked.rank = 1
         and venue.primary_photo_id is distinct from ranked.id
       returning venue.id
     ),
     retired as (
       update public.venue_media media
       set is_active = false,
           raw_metadata = media.raw_metadata || jsonb_build_object(
             'retired_by_media_id', ranked.id::text,
             'retired_reason', 'primary_photo_replaced_by_revision',
             'retired_at', now()
           ),
           updated_at = now()
       from ranked
       where ranked.rank = 1
         and media.venue_id = ranked.venue_id
         and media.id <> ranked.id
         and media.is_active = true
         and media.media_type = 'image'
         and media.role = 'primary'
       returning media.id
     )
     select count(*)::int as affected from upserted`,
    [JSON.stringify(rows)],
  );
  return Number(result.rows[0]?.affected ?? 0);
}

function buildVenueHoursPayload(hoursRows, venueIdByKey) {
  const noteRowsByVenue = new Map();
  const intervalRowsByKey = new Map();

  const addNote = (venueId, rawText) => {
    const normalized = normalizeHoursText(rawText);
    if (venueId && normalized && isPublishableVenueHours(normalized) && !noteRowsByVenue.has(venueId)) {
      noteRowsByVenue.set(venueId, { venue_id: venueId, raw_text: normalized });
    }
    return normalized;
  };

  const addInterval = (venueId, dayOfWeek, rawText, source) => {
    const normalized = normalizeHoursText(rawText);
    if (!venueId || dayOfWeek === undefined || !normalized || !isPublishableVenueHoursInterval(normalized)) {
      return;
    }
    const lowered = normalized.toLowerCase();
    const key = `${venueId}|${dayOfWeek}|0`;
    intervalRowsByKey.set(key, {
      venue_id: venueId,
      day_of_week: dayOfWeek,
      interval_order: 0,
      is_closed: ["closed", "closed today"].includes(lowered),
      is_24_hours: isTwentyFourHoursText(normalized),
      raw_text: normalized,
      raw_metadata: { source },
    });
  };

  for (const row of hoursRows) {
    const venueId = venueIdByKey.get(row.venue_key);
    const hours = row.stop?.hours;
    if (!venueId || !hours) {
      continue;
    }

    if (typeof hours === "string") {
      addNote(venueId, hours);
      continue;
    }

    if (typeof hours !== "object" || Array.isArray(hours)) {
      continue;
    }

    const defaultRawText = addNote(venueId, hours.default);
    if (defaultRawText && isDefaultWeeklyHoursText(defaultRawText)) {
      for (let dayOfWeek = 0; dayOfWeek <= 6; dayOfWeek += 1) {
        addInterval(venueId, dayOfWeek, defaultRawText, "entry_stops.hours.default");
      }
    }

    for (const [dayKey, value] of Object.entries(hours)) {
      const dayOfWeek = HOURS_DAY_MAP.get(String(dayKey).toLowerCase());
      addInterval(venueId, dayOfWeek, value, "entry_stops.hours");
    }
  }

  return {
    noteRows: [...noteRowsByVenue.values()],
    intervalRows: [...intervalRowsByKey.values()],
  };
}

async function upsertVenueHoursBatch(client, hoursRows, venueIdByKey) {
  const { noteRows, intervalRows } = buildVenueHoursPayload(hoursRows, venueIdByKey);
  const venueIds = [
    ...new Set(
      hoursRows
        .map((row) => venueIdByKey.get(row.venue_key))
        .filter(Boolean),
    ),
  ];
  let affected = 0;
  let clearedIntervals = 0;
  let clearedVenueNotes = 0;

  if (venueIds.length) {
    const intervalClearResult = await client.query("delete from public.venue_hours where venue_id = any($1::uuid[])", [venueIds]);
    clearedIntervals = intervalClearResult.rowCount ?? 0;
    const noteClearResult = await client.query(
      `update public.venues
       set hours_note = null,
           hours_last_verified_at = now()
       where id = any($1::uuid[])`,
      [venueIds],
    );
    clearedVenueNotes = noteClearResult.rowCount ?? 0;
  }

  if (noteRows.length) {
    const result = await client.query(
      `with incoming as (
         select *
         from jsonb_to_recordset($1::jsonb) as row(
           venue_id uuid,
           raw_text text
         )
       )
       update public.venues venue
       set hours_note = incoming.raw_text,
           hours_last_verified_at = now()
       from incoming
       where venue.id = incoming.venue_id`,
      [JSON.stringify(noteRows)],
    );
    affected += result.rowCount ?? 0;
  }

  if (intervalRows.length) {
    const result = await client.query(
      `with incoming as (
         select *
         from jsonb_to_recordset($1::jsonb) as row(
           venue_id uuid,
           day_of_week smallint,
           interval_order integer,
           is_closed boolean,
           is_24_hours boolean,
           raw_text text,
           raw_metadata jsonb
         )
       )
       insert into public.venue_hours (
         venue_id, day_of_week, interval_order, is_closed, is_24_hours,
         raw_text, raw_metadata, last_verified_at
       )
       select
         venue_id, day_of_week, coalesce(interval_order, 0), coalesce(is_closed, false), coalesce(is_24_hours, false),
         raw_text, coalesce(raw_metadata, '{}'::jsonb), now()
       from incoming
       on conflict (venue_id, day_of_week, interval_order, valid_from) do update set
         is_closed = excluded.is_closed,
         is_24_hours = excluded.is_24_hours,
         raw_text = excluded.raw_text,
         raw_metadata = public.venue_hours.raw_metadata || excluded.raw_metadata,
         last_verified_at = excluded.last_verified_at,
         updated_at = now()`,
      [JSON.stringify(intervalRows)],
    );
    affected += result.rowCount ?? 0;
  }

  return {
    affected,
    noteRows: noteRows.length,
    intervalRows: intervalRows.length,
    clearedVenueNotes,
    clearedIntervals,
  };
}

async function upsertSourcesBatch(client, selectedGuides) {
  const sourceUrls = new Set();
  const sourcesByCanonicalUrl = new Map();
  for (const list of selectedGuides) {
    for (const source of list.sources ?? []) {
      if (!source?.url) {
        continue;
      }
      const canonicalUrl = source.url.replace(/\/+$/, "");
      sourceUrls.add(source.url);
      sourcesByCanonicalUrl.set(canonicalUrl, {
        name: source.name?.trim() || source.url,
        url: canonicalUrl,
        publisher: source.publisher ?? null,
        source_type: source.sourceType ?? source.source_type ?? null,
      });
    }
  }
  const sources = [...sourcesByCanonicalUrl.values()];
  if (!sources.length) {
    return new Map();
  }
  const result = await client.query(
    `with incoming as (
       select *
       from jsonb_to_recordset($1::jsonb) as row(
         name text,
         url text,
         publisher text,
         source_type text
       )
     ),
     upserted as (
       insert into public.sources (name, url, publisher, source_type, sourced_at, raw_metadata)
       select name, url, publisher, source_type, now(), '{}'::jsonb
       from incoming
       on conflict ((regexp_replace(url, '/+$', ''))) do update set
         name = coalesce(excluded.name, public.sources.name),
         publisher = coalesce(excluded.publisher, public.sources.publisher),
         source_type = coalesce(excluded.source_type, public.sources.source_type),
         sourced_at = greatest(public.sources.sourced_at, excluded.sourced_at)
       returning id, regexp_replace(url, '/+$', '') as canonical_url
     )
     select id, canonical_url from upserted`,
    [JSON.stringify(sources)],
  );
  const sourceIdByCanonicalUrl = new Map(result.rows.map((row) => [row.canonical_url, row.id]));
  return new Map(
    [...sourceUrls].map((url) => [url, sourceIdByCanonicalUrl.get(url.replace(/\/+$/, ""))]),
  );
}

async function linkEntrySourcesBatch(client, selectedGuides, entryIdByLegacyId, sourceIdByUrl) {
  const rowsByKey = new Map();
  for (const list of selectedGuides) {
    const entryId = entryIdByLegacyId.get(list.id);
    for (const source of list.sources ?? []) {
      const sourceId = sourceIdByUrl.get(source.url);
      if (entryId && sourceId) {
        rowsByKey.set(`entry|${entryId}|${sourceId}|reference`, {
          entity_type: "entry",
          entity_id: entryId,
          source_id: sourceId,
          relationship: "reference",
        });
      }
    }
  }
  const rows = [...rowsByKey.values()];
  if (!rows.length) {
    return 0;
  }
  const result = await client.query(
    `with incoming as (
       select *
       from jsonb_to_recordset($1::jsonb) as row(
         entity_type public.rguide_source_entity_type,
         entity_id uuid,
         source_id uuid,
         relationship text
       )
     )
     insert into public.entity_sources (entity_type, entity_id, source_id, relationship)
     select entity_type, entity_id, source_id, relationship
     from incoming
     on conflict (entity_type, entity_id, source_id, relationship) do update set
       sourced_at = excluded.sourced_at`,
    [JSON.stringify(rows)],
  );
  return result.rowCount ?? 0;
}

async function refreshEntryRenderCacheBatch(client, entryIds) {
  if (!entryIds.length) {
    return 0;
  }
  const result = await client.query(
    [
      "insert into public.entry_render_cache (",
      "  entry_id, render_format, render_version, rendered_payload, source_hash,",
      "  rendered_at, stale_at, is_current, metadata",
      ")",
      "select",
      "  entry.id,",
      "  'maplist',",
      "  1,",
      "  view.list,",
      "  encode(digest(view.list::text, 'sha256'), 'hex'),",
      "  now(),",
      "  null,",
      "  true,",
      "  jsonb_build_object('refreshed_from', 'backfill-normalized-editorial-guides')",
      "from public.entries entry",
      "join public.entries_maplist view on view.id = entry.id",
      "where entry.id = any($1::uuid[])",
      "on conflict (entry_id, render_format, render_version) do update set",
      "  rendered_payload = excluded.rendered_payload,",
      "  source_hash = excluded.source_hash,",
      "  rendered_at = excluded.rendered_at,",
      "  stale_at = null,",
      "  is_current = true,",
      "  metadata = public.entry_render_cache.metadata || excluded.metadata",
    ].join(" "),
    [entryIds],
  );
  return result.rowCount ?? 0;
}

async function verifyPublishedScope(client, entryIdByLegacyId) {
  const entryIds = [...entryIdByLegacyId.values()];
  const { rows } = await client.query(
    `select
       count(distinct entry.id)::int as entry_count,
       count(stop.id)::int as stop_count,
       count(distinct stop.venue_id)::int as venue_count,
       count(distinct cache.id)::int as render_cache_count
     from public.entries entry
     left join public.entry_stops stop on stop.entry_id = entry.id
     left join public.entry_render_cache cache
       on cache.entry_id = entry.id
      and cache.render_format = 'maplist'
      and cache.render_version = 1
      and cache.is_current = true
     where entry.id = any($1::uuid[])`,
    [entryIds],
  );
  const mixed = await client.query(
    `select
       entry.legacy_id,
       entry.slug,
       entry.title,
       array_remove(array_agg(distinct venue.lodging_type::text), null) as lodging_types
     from public.entries entry
     join public.entry_stops stop on stop.entry_id = entry.id
     left join public.venues venue on venue.id = stop.venue_id
     where entry.id = any($1::uuid[])
       and entry.category = 'Stay'
     group by entry.id
     having array['hotel','hostel']::text[] <@ array_remove(array_agg(distinct venue.lodging_type::text), null)`,
    [entryIds],
  );
  return { counts: rows[0], mixedStayGuides: mixed.rows };
}

async function publishBatched(client, maps, selectedGuides, stats) {
  const contexts = buildGuideContexts(maps, selectedGuides);
  const entryRows = buildEntryRows(selectedGuides, contexts);
  const stopPayload = buildStopPayload(selectedGuides, contexts);

  logPhase("phase editorial_pois:start", { rows: collectEditorialPois(selectedGuides).length });
  stats.editorialPois = await upsertEditorialPoisBatch(client, collectEditorialPois(selectedGuides));
  logPhase("phase editorial_pois:done", { affected: stats.editorialPois });

  logPhase("phase entries:start", { rows: entryRows.length });
  const entryIdByLegacyId = await upsertEntriesBatch(client, entryRows);
  stats.entries = entryIdByLegacyId.size;
  logPhase("phase entries:done", { affected: stats.entries });

  logPhase("phase venues:start", { rows: stopPayload.venueRows.length });
  const venueIdByKey = await upsertVenuesBatch(client, stopPayload.venueRows);
  stats.venues = venueIdByKey.size;
  logPhase("phase venues:done", { affected: stats.venues });

  logPhase("phase venue_media:start", { rows: stopPayload.mediaRows.length });
  stats.venueMedia = await upsertVenueMediaBatch(client, stopPayload.mediaRows, venueIdByKey);
  logPhase("phase venue_media:done", { affected: stats.venueMedia });

  logPhase("phase venue_hours:start", { rows: stopPayload.hoursRows.length });
  const venueHoursResult = await upsertVenueHoursBatch(client, stopPayload.hoursRows, venueIdByKey);
  stats.venueHours = venueHoursResult.affected;
  logPhase("phase venue_hours:done", venueHoursResult);

  logPhase("phase entry_stops:start", { rows: stopPayload.stopRows.length });
  stats.entryStops = await replaceEntryStopsBatch(client, stopPayload.stopRows, entryIdByLegacyId, venueIdByKey);
  logPhase("phase entry_stops:done", { affected: stats.entryStops });

  logPhase("phase sources:start");
  const sourceIdByUrl = await upsertSourcesBatch(client, selectedGuides);
  stats.sources = sourceIdByUrl.size;
  stats.sourceLinks = await linkEntrySourcesBatch(client, selectedGuides, entryIdByLegacyId, sourceIdByUrl);
  logPhase("phase sources:done", { sources: stats.sources, links: stats.sourceLinks });

  logPhase("phase render_cache:start", { entries: entryIdByLegacyId.size });
  stats.renderCaches = await refreshEntryRenderCacheBatch(client, [...entryIdByLegacyId.values()]);
  logPhase("phase render_cache:done", { affected: stats.renderCaches });

  logPhase("phase verification:start");
  const verification = await verifyPublishedScope(client, entryIdByLegacyId);
  logPhase("phase verification:done", {
    counts: verification.counts,
    mixedStayGuides: verification.mixedStayGuides.length,
  });
  if (verification.mixedStayGuides.length) {
    const details = verification.mixedStayGuides
      .map((guide) => `${guide.slug}: ${guide.lodging_types.join(", ")}`)
      .join("; ");
    throw new Error(`Stay guide lodging type verification failed: ${details}`);
  }

  return verification;
}

async function publishCopyOnly(client, selectedGuides, stats) {
  const entryRows = selectedGuides.map((list) => ({
    legacy_id: list.id,
    description: list.description,
  }));
  logPhase("phase copy_entries:start", { rows: entryRows.length });
  const entryResult = await client.query(
    `with incoming as (
       select *
       from jsonb_to_recordset($1::jsonb) as row(
         legacy_id text,
         description text
       )
     )
     update public.entries entry
     set description = incoming.description
     from incoming
     where entry.legacy_id = incoming.legacy_id
     returning entry.id, entry.legacy_id`,
    [JSON.stringify(entryRows)],
  );
  const entryIdByLegacyId = new Map(entryResult.rows.map((row) => [row.legacy_id, row.id]));
  stats.entries = entryIdByLegacyId.size;
  logPhase("phase copy_entries:done", { affected: stats.entries });
  if (entryIdByLegacyId.size !== selectedGuides.length) {
    throw new Error(`Copy-only publish found ${entryIdByLegacyId.size}/${selectedGuides.length} live entries. Run the full normalized publisher for missing guides.`);
  }

  const stopRows = selectedGuides.flatMap((list) =>
    (list.stops ?? []).map((stop) => ({
      entry_id: entryIdByLegacyId.get(list.id),
      legacy_id: stop.id,
      description: stop.description,
      places: stop.places ?? [],
    })),
  );
  logPhase("phase copy_entry_stops:start", { rows: stopRows.length });
  const stopResult = await client.query(
    `with incoming as (
       select *
       from jsonb_to_recordset($1::jsonb) as row(
         entry_id uuid,
         legacy_id text,
         description text,
         places jsonb
       )
     )
     update public.entry_stops stop
     set description = incoming.description,
         places = coalesce(incoming.places, '[]'::jsonb)
     from incoming
     where stop.entry_id = incoming.entry_id
       and stop.legacy_id = incoming.legacy_id
     returning stop.id`,
    [JSON.stringify(stopRows)],
  );
  stats.entryStops = stopResult.rowCount ?? 0;
  logPhase("phase copy_entry_stops:done", { affected: stats.entryStops });
  if (stats.entryStops !== stopRows.length) {
    throw new Error(`Copy-only publish found ${stats.entryStops}/${stopRows.length} live entry stops. Run the full normalized publisher for missing stops.`);
  }

  logPhase("phase render_cache:start", { entries: entryIdByLegacyId.size });
  stats.renderCaches = await refreshEntryRenderCacheBatch(client, [...entryIdByLegacyId.values()]);
  logPhase("phase render_cache:done", { affected: stats.renderCaches });

  logPhase("phase verification:start");
  const verification = await verifyPublishedScope(client, entryIdByLegacyId);
  logPhase("phase verification:done", {
    counts: verification.counts,
    mixedStayGuides: verification.mixedStayGuides.length,
  });
  if (verification.mixedStayGuides.length) {
    const details = verification.mixedStayGuides
      .map((guide) => `${guide.slug}: ${guide.lodging_types.join(", ")}`)
      .join("; ");
    throw new Error(`Stay guide lodging type verification failed: ${details}`);
  }

  return verification;
}

async function publishTitleOnly(client, selectedGuides, stats) {
  const entryRows = selectedGuides.map((list) => ({
    legacy_id: list.id,
    title: list.title,
  }));
  logPhase("phase title_entries:start", { rows: entryRows.length });
  const entryResult = await client.query(
    `with incoming as (
       select *
       from jsonb_to_recordset($1::jsonb) as row(
         legacy_id text,
         title text
       )
     )
     update public.entries entry
     set title = incoming.title
     from incoming
     where entry.legacy_id = incoming.legacy_id
     returning entry.id, entry.legacy_id`,
    [JSON.stringify(entryRows)],
  );
  const entryIdByLegacyId = new Map(entryResult.rows.map((row) => [row.legacy_id, row.id]));
  stats.entries = entryIdByLegacyId.size;
  logPhase("phase title_entries:done", { affected: stats.entries });
  if (entryIdByLegacyId.size !== selectedGuides.length) {
    throw new Error(
      `Title-only publish found ${entryIdByLegacyId.size}/${selectedGuides.length} live entries. Run the full normalized publisher for missing guides.`,
    );
  }

  logPhase("phase render_cache:start", { entries: entryIdByLegacyId.size });
  stats.renderCaches = await refreshEntryRenderCacheBatch(client, [...entryIdByLegacyId.values()]);
  logPhase("phase render_cache:done", { affected: stats.renderCaches });

  const { rows: titleRows } = await client.query(
    `select
       entry.legacy_id,
       entry.title,
       cache.rendered_payload->>'title' as rendered_title
     from public.entries entry
     left join public.entry_render_cache cache
       on cache.entry_id = entry.id
      and cache.render_format = 'maplist'
      and cache.render_version = 1
      and cache.is_current = true
     where entry.id = any($1::uuid[])`,
    [[...entryIdByLegacyId.values()]],
  );
  const titleByLegacyId = new Map(titleRows.map((row) => [row.legacy_id, row]));
  const mismatches = selectedGuides.flatMap((guide) => {
    const row = titleByLegacyId.get(guide.id);
    if (row?.title === guide.title && row?.rendered_title === guide.title) {
      return [];
    }
    return [
      `${guide.id}: expected ${JSON.stringify(guide.title)}, entry=${JSON.stringify(row?.title)}, render=${JSON.stringify(row?.rendered_title)}`,
    ];
  });
  if (mismatches.length) {
    throw new Error(`Title-only publish verification failed:\n${mismatches.join("\n")}`);
  }

  logPhase("phase verification:start");
  const verification = await verifyPublishedScope(client, entryIdByLegacyId);
  logPhase("phase verification:done", {
    counts: verification.counts,
    mixedStayGuides: verification.mixedStayGuides.length,
    titleMismatches: 0,
  });
  if (verification.mixedStayGuides.length) {
    const details = verification.mixedStayGuides
      .map((guide) => `${guide.slug}: ${guide.lodging_types.join(", ")}`)
      .join("; ");
    throw new Error(`Stay guide lodging type verification failed: ${details}`);
  }

  return { ...verification, titleMismatches: [] };
}

async function upsertSource(client, source, stats) {
  if (!source?.url) {
    return null;
  }
  const name = source.name?.trim() || source.url;
  const { rows } = await client.query(
    `insert into public.sources (name, url, publisher, source_type, sourced_at, raw_metadata)
     values ($1, $2, $3, $4, now(), '{}'::jsonb)
     on conflict (url) do update set
       name = coalesce(excluded.name, public.sources.name),
       publisher = coalesce(excluded.publisher, public.sources.publisher),
       source_type = coalesce(excluded.source_type, public.sources.source_type),
       sourced_at = greatest(public.sources.sourced_at, excluded.sourced_at)
     returning id`,
    [name, source.url, source.publisher ?? null, source.sourceType ?? source.source_type ?? null],
  );
  stats.sources += 1;
  return rows[0].id;
}

async function linkSource(client, entityType, entityId, sourceId, relationship = "reference") {
  if (!entityId || !sourceId) {
    return;
  }
  await client.query(
    `insert into public.entity_sources (entity_type, entity_id, source_id, relationship)
     values ($1, $2, $3, $4)
     on conflict (entity_type, entity_id, source_id, relationship) do update set sourced_at = excluded.sourced_at`,
    [entityType, entityId, sourceId, relationship],
  );
}

async function upsertVenue(client, input, stats) {
  const name = input.name?.trim();
  if (!name) {
    return null;
  }
  const slug = input.slug || slugify(name);
  const normalizedName = normalizeName(name);
  const { rows } = await client.query(
    `insert into public.venues (
       legacy_id, slug, name, normalized_name, aliases, destination_id, city_id,
       neighborhood_id, country, coordinates, official_url, venue_kind,
       venue_kinds, lodging_type, food_service_type, cuisine_types, price_tier,
       nightlife_type, music_genres, attribute_tags, source_metadata
     )
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
     on conflict (city_id, slug) do update set
       legacy_id = coalesce(public.venues.legacy_id, excluded.legacy_id),
       slug = excluded.slug,
       name = excluded.name,
       aliases = array(select distinct unnest(public.venues.aliases || excluded.aliases)),
       destination_id = coalesce(excluded.destination_id, public.venues.destination_id),
       neighborhood_id = coalesce(excluded.neighborhood_id, public.venues.neighborhood_id),
       coordinates = coalesce(excluded.coordinates, public.venues.coordinates),
       official_url = coalesce(excluded.official_url, public.venues.official_url),
       venue_kind = case
         when excluded.venue_kind = 'other' then public.venues.venue_kind
         else excluded.venue_kind
       end,
       venue_kinds = array(
         select distinct unnest(
           public.venues.venue_kinds || excluded.venue_kinds ||
           array[public.venues.venue_kind, excluded.venue_kind]::public.venue_kind[]
         )
       ),
       lodging_type = coalesce(excluded.lodging_type, public.venues.lodging_type),
       food_service_type = coalesce(excluded.food_service_type, public.venues.food_service_type),
       cuisine_types = array(select distinct unnest(public.venues.cuisine_types || excluded.cuisine_types)),
       price_tier = coalesce(excluded.price_tier, public.venues.price_tier),
       nightlife_type = coalesce(excluded.nightlife_type, public.venues.nightlife_type),
       music_genres = array(select distinct unnest(public.venues.music_genres || excluded.music_genres)),
       attribute_tags = array(
         select tag
         from unnest(excluded.attribute_tags || public.venues.attribute_tags) with ordinality as merged(tag, ord)
         where tag is not null and tag <> ''
         group by tag
         order by min(ord)
       ),
       source_metadata = public.venues.source_metadata || excluded.source_metadata
     returning id`,
    [
      input.legacyId ?? null,
      slug,
      name,
      normalizedName,
      input.aliases ?? [],
      input.destinationId ?? input.cityId ?? null,
      input.cityId ?? null,
      input.neighborhoodId ?? null,
      input.country ?? null,
      toJson(normalizeCoordinates(input.coordinates)),
      input.officialUrl ?? null,
      input.venueKind ?? "other",
      input.venueKind ? [input.venueKind] : [],
      input.lodgingType ?? null,
      input.foodServiceType ?? null,
      input.cuisineTypes ?? [],
      input.priceTier ?? null,
      input.nightlifeType ?? null,
      input.musicGenres ?? [],
      input.attributeTags ?? [],
      toJsonObject(input.sourceMetadata),
    ],
  );
  stats.venues += 1;
  return rows[0].id;
}

async function upsertVenueMedia(client, input, stats) {
  const url = input.url?.trim();
  if (!input.venueId || !url) {
    return null;
  }

  let { rows } = await client.query(
    `update public.venue_media
     set role = case
           when role = 'gallery' then $3
           else role
         end,
         source_type = coalesce(source_type, $4),
         source_entity_type = coalesce(source_entity_type, $5),
         source_legacy_id = coalesce(source_legacy_id, $6),
         raw_metadata = raw_metadata || $7,
         is_active = true,
         updated_at = now()
     where venue_id = $1
       and source_url = $2
     returning id, storage_provider, public_url, ingestion_status`,
    [
      input.venueId,
      url,
      input.role ?? "primary",
      input.sourceType ?? "editorial_guides",
      input.sourceEntityType ?? "entry_stop",
      input.sourceLegacyId ?? null,
      toJsonObject(input.rawMetadata),
    ],
  );

  if (!rows.length) {
    ({ rows } = await client.query(
    `insert into public.venue_media (
       venue_id, url, source_url, role, source_type, source_entity_type, source_legacy_id,
       raw_metadata, sort_order
     )
     values ($1,$2,$2,$3,$4,$5,$6,$7,$8)
     on conflict (venue_id, url) do update set
       role = case
         when public.venue_media.role = 'gallery' then excluded.role
         else public.venue_media.role
       end,
       source_url = coalesce(public.venue_media.source_url, excluded.source_url),
       source_type = coalesce(public.venue_media.source_type, excluded.source_type),
       source_entity_type = coalesce(public.venue_media.source_entity_type, excluded.source_entity_type),
       source_legacy_id = coalesce(public.venue_media.source_legacy_id, excluded.source_legacy_id),
       raw_metadata = public.venue_media.raw_metadata || excluded.raw_metadata,
       is_active = true,
       updated_at = now()
     returning id, storage_provider, public_url, ingestion_status`,
    [
      input.venueId,
      url,
      input.role ?? "primary",
      input.sourceType ?? "editorial_guides",
      input.sourceEntityType ?? "entry_stop",
      input.sourceLegacyId ?? null,
      toJsonObject(input.rawMetadata),
      input.sortOrder ?? 0,
    ],
    ));
  }

  if (
    rows[0]?.storage_provider === "cloudflare_r2" &&
    rows[0]?.ingestion_status === "stored" &&
    rows[0]?.public_url
  ) {
    await client.query(
      `update public.venues
       set primary_photo_id = $2
       where id = $1
         and primary_photo_id is distinct from $2`,
      [input.venueId, rows[0].id],
    );
  }
  stats.venueMedia += 1;
  return rows[0].id;
}

const HOURS_DAY_MAP = new Map([
  ["sun", 0],
  ["sunday", 0],
  ["mon", 1],
  ["monday", 1],
  ["tue", 2],
  ["tues", 2],
  ["tuesday", 2],
  ["wed", 3],
  ["wednesday", 3],
  ["thu", 4],
  ["thur", 4],
  ["thurs", 4],
  ["thursday", 4],
  ["fri", 5],
  ["friday", 5],
  ["sat", 6],
  ["saturday", 6],
]);

function isTwentyFourHoursText(value) {
  const normalized = normalizeHoursText(value)?.toLowerCase().replace(/\.$/, "");
  if (!normalized) {
    return false;
  }
  return (
    ["24 hours", "open 24 hours", "24/7"].includes(normalized) ||
    /(^|[^a-z])(open |operates |ferry operates )?24[- ]?hours( daily)?([^a-z]|$)/.test(normalized)
  );
}

function isDefaultWeeklyHoursText(value) {
  const normalized = normalizeHoursText(value)?.toLowerCase().replace(/\.$/, "");
  if (!normalized) {
    return false;
  }
  return (
    isTwentyFourHoursText(normalized) ||
    normalized.startsWith("daily ") ||
    normalized.includes(" daily") ||
    normalized.startsWith("park open daily") ||
    normalized.startsWith("pedestrian path open daily") ||
    normalized.startsWith("terminal open daily")
  );
}

function normalizeHoursText(value) {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value === "string") {
    return value.trim() || null;
  }
  return String(value).trim() || null;
}

function hoursValueToText(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(hoursValueToText).join(" ");
  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, item]) => `${key} ${hoursValueToText(item)}`)
      .join(" ");
  }
  return String(value);
}

function hasConcreteHours(value) {
  const text = hoursValueToText(value);
  const hasDayContext = /\b(mon|monday|tue|tues|tuesday|wed|wednesday|thu|thur|thurs|thursday|fri|friday|sat|saturday|sun|sunday|daily|weekday|weekdays|weekend|weekends)\b/i.test(text);
  const hasTime = /\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\b/i.test(text) || /\b\d{1,2}:\d{2}\b/.test(text);
  const hasClosed = /\bclosed\b/i.test(text);
  const hasTwentyFourHours = /\b(?:24\s*hours?|open\s+24)\b/i.test(text);
  return hasTwentyFourHours || (hasDayContext && (hasTime || hasClosed));
}

function hasInlineHours(value) {
  const text = hoursValueToText(value);
  return /\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\b/i.test(text) || /\b\d{1,2}:\d{2}\b/.test(text) || /\b(?:24\s*hours?|open\s+24)\b/i.test(text);
}

function hasNamedScheduleDependency(value) {
  return /\b(official calendar|booking calendar|reservation page|booking page|property page|official site|official page|show calendar|event calendar|timetable|market day|market days|seasonal|season|weather|vendor|stall|performance schedule|exhibition page|timed ticket|last admission)\b/i.test(
    hoursValueToText(value),
  );
}

function hasGenericSourceControlCaveat(value) {
  const text = hoursValueToText(value);
  return (
    /\b(official venue page|official property|official site|property or booking page|google maps|map listing|booking page|reservation page|event calendar|official [^.]{0,40}calendar|official [^.]{0,40}(?:page|site)|official notices?)\b[^.]{0,140}\bcontrols?\b/i.test(
      text,
    ) ||
    /\bfollow property schedules\b/i.test(text)
  );
}

function hasUnresolvedDaypartHours(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  for (const [key, item] of Object.entries(value)) {
    if (!/^(mon|monday|tue|tues|tuesday|wed|wednesday|thu|thur|thurs|thursday|fri|friday|sat|saturday|sun|sunday)$/i.test(key)) continue;
    const text = hoursValueToText(item);
    if (!text.trim() || /\bclosed\b/i.test(text)) continue;
    if (!hasInlineHours(text) && !hasNamedScheduleDependency(text)) return true;
  }
  return false;
}

function looksLikePlaceholderHours(value) {
  const text = hoursValueToText(value);
  const normalized = text.toLowerCase().replace(/\s+/g, " ").trim();
  if (!normalized) return true;

  if (
    /\b(current-status evidence is map-based|open and active in the current source set|open and active|hours should be confirmed|verify current hours|verify official hours|confirm current hours|confirm before going|check current hours)\b/i.test(
      normalized,
    )
  ) {
    return true;
  }

  if (hasGenericSourceControlCaveat(value) && !hasConcreteHours(value)) {
    return true;
  }

  if (hasUnresolvedDaypartHours(value)) {
    return true;
  }

  const hasVagueCaveat = /\b(hours?\s+var(?:y|ies)|varies by|variable|subject to change|may change|can change|verify|confirm|check before|check current|current hours|same-day|generally|usually|typically)\b/i.test(
    text,
  );

  return !hasConcreteHours(value) && (!hasNamedScheduleDependency(value) || hasVagueCaveat);
}

function isPublishableVenueHours(value) {
  return Boolean(hoursValueToText(value).trim()) && !looksLikePlaceholderHours(value);
}

function isPublishableVenueHoursInterval(value) {
  const text = normalizeHoursText(value);
  if (!text) return false;
  return hasInlineHours(text) || /\bclosed\b/i.test(text) || isPublishableVenueHours(text);
}

async function upsertVenueHoursFromStop(client, venueId, stop) {
  if (!venueId || !isPublishableVenueHours(stop?.hours)) {
    return;
  }

  if (typeof stop.hours === "string") {
    const rawText = normalizeHoursText(stop.hours);
    if (!rawText || !isPublishableVenueHours(rawText)) {
      return;
    }
    await client.query(
      `update public.venues
       set hours_note = $2,
           hours_last_verified_at = now()
       where id = $1`,
      [venueId, rawText],
    );
    return;
  }

  if (typeof stop.hours !== "object" || Array.isArray(stop.hours)) {
    return;
  }

  const defaultRawText = normalizeHoursText(stop.hours.default);
  if (defaultRawText && isPublishableVenueHours(defaultRawText)) {
    await client.query(
      `update public.venues
       set hours_note = $2,
           hours_last_verified_at = now()
       where id = $1`,
      [venueId, defaultRawText],
    );

    if (isDefaultWeeklyHoursText(defaultRawText)) {
      for (let dayOfWeek = 0; dayOfWeek <= 6; dayOfWeek += 1) {
        await client.query(
          `insert into public.venue_hours (
             venue_id, day_of_week, interval_order, is_closed, is_24_hours,
             raw_text, raw_metadata, last_verified_at
           )
           values ($1,$2,0,false,$3,$4,$5,now())
           on conflict (venue_id, day_of_week, interval_order, valid_from) do update set
             is_closed = excluded.is_closed,
             is_24_hours = excluded.is_24_hours,
             raw_text = excluded.raw_text,
             raw_metadata = public.venue_hours.raw_metadata || excluded.raw_metadata,
             last_verified_at = excluded.last_verified_at,
             updated_at = now()`,
          [
            venueId,
            dayOfWeek,
            isTwentyFourHoursText(defaultRawText),
            defaultRawText,
            toJsonObject({ source: "entry_stops.hours.default" }),
          ],
        );
      }
    }
  }

  for (const [dayKey, value] of Object.entries(stop.hours)) {
    const dayOfWeek = HOURS_DAY_MAP.get(String(dayKey).toLowerCase());
    const rawText = normalizeHoursText(value);
    if (dayOfWeek === undefined || !rawText || !isPublishableVenueHoursInterval(rawText)) {
      continue;
    }
    const normalized = rawText.toLowerCase();
    await client.query(
      `insert into public.venue_hours (
         venue_id, day_of_week, interval_order, is_closed, is_24_hours,
         raw_text, raw_metadata, last_verified_at
       )
       values ($1,$2,0,$3,$4,$5,$6,now())
       on conflict (venue_id, day_of_week, interval_order, valid_from) do update set
         is_closed = excluded.is_closed,
         is_24_hours = excluded.is_24_hours,
         raw_text = excluded.raw_text,
         raw_metadata = public.venue_hours.raw_metadata || excluded.raw_metadata,
         last_verified_at = excluded.last_verified_at,
         updated_at = now()`,
      [
        venueId,
        dayOfWeek,
        ["closed", "closed today"].includes(normalized),
        isTwentyFourHoursText(rawText),
        rawText,
        toJsonObject({ source: "entry_stops.hours" }),
      ],
    );
  }

  await client.query(
    "update public.venues set hours_last_verified_at = now() where id = $1",
    [venueId],
  );
}

async function upsertEntry(client, list, context, stats) {
  const { rows } = await client.query(
    `insert into public.entries (
       legacy_id, slug, seo_slug, seo_title, seo_description, title, description,
       highlights, photo_url, canonical_url, category, submission_type, status,
       destination_id, city_id, neighborhood_id, country_name, continent_name,
       creator_id, creator_name, creator_avatar, upvotes, created_on,
       source_table, metadata
     )
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'published',$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)
     on conflict (legacy_id) do update set
       slug = excluded.slug,
       seo_slug = excluded.seo_slug,
       seo_title = excluded.seo_title,
       seo_description = excluded.seo_description,
       title = excluded.title,
       description = excluded.description,
       highlights = excluded.highlights,
       photo_url = excluded.photo_url,
       canonical_url = excluded.canonical_url,
       category = excluded.category,
       submission_type = excluded.submission_type,
       status = excluded.status,
       destination_id = excluded.destination_id,
       city_id = excluded.city_id,
       neighborhood_id = excluded.neighborhood_id,
       country_name = excluded.country_name,
       continent_name = excluded.continent_name,
       creator_id = excluded.creator_id,
       creator_name = excluded.creator_name,
       creator_avatar = excluded.creator_avatar,
       upvotes = excluded.upvotes,
       created_on = excluded.created_on,
       source_table = excluded.source_table,
       metadata = public.entries.metadata || excluded.metadata
     returning id`,
    [
      list.id,
      list.slug,
      list.seoSlug ?? null,
      list.seoTitle ?? null,
      list.seoDescription ?? null,
      list.title,
      list.description,
      list.highlights ?? [],
      getGuideCoverPhoto(list),
      list.url ?? null,
      list.category,
      toSchemaSubmissionType(list.submissionType),
      context.destinationId ?? null,
      context.cityId ?? null,
      context.neighborhoodId ?? null,
      list.location?.country ?? null,
      list.location?.continent ?? null,
      list.creator?.id ?? null,
      list.creator?.name ?? null,
      list.creator?.avatar ?? null,
      list.upvotes ?? 0,
      list.createdAt ?? new Date().toISOString().slice(0, 10),
      "editorial_guides",
      toJsonObject({ editorialGuideId: list.id }),
    ],
  );
  stats.entries += 1;
  return rows[0].id;
}

async function replaceEntryStops(client, entryId, list, context, stats) {
  await client.query("delete from public.entry_stops where entry_id = $1", [entryId]);
  let order = 0;
  for (const stop of list.stops ?? []) {
    order += 1;
    const classification = inferVenueClassification(stop, list);
    const venueId = await upsertVenue(client, {
      legacyId: stop.poiId ?? `${list.id}:${stop.id}`,
      slug: stop.poiId ? slugify(stop.poiId) : slugify(stop.name),
      name: stop.name,
      cityId: context.cityId,
      neighborhoodId: context.neighborhoodId,
      country: list.location?.country,
      coordinates: stop.coordinates,
      officialUrl: stop.officialUrl ?? stop.bookingUrl,
      venueKind: classification.venueKind,
      lodgingType: classification.lodgingType,
      foodServiceType: classification.foodServiceType,
      cuisineTypes: classification.cuisineTypes,
      priceTier: classification.priceTier,
      nightlifeType: classification.nightlifeType,
      musicGenres: classification.musicGenres,
      attributeTags: classification.attributeTags,
      sourceMetadata: { source: "editorial_guides", entryId: list.id, stopId: stop.id },
    }, stats);
    await upsertVenueMedia(client, {
      venueId,
      url: stop.photo,
      role: "primary",
      sourceType: "editorial_guides",
      sourceEntityType: "entry_stop",
      sourceLegacyId: stop.id,
      rawMetadata: { source: "guide_stop_photo", entryId: list.id, stopId: stop.id, poiId: stop.poiId ?? null },
      sortOrder: 0,
    }, stats);
    await upsertVenueHoursFromStop(client, venueId, stop);
    await client.query(
      `insert into public.entry_stops (
         entry_id, legacy_id, stop_order, poi_legacy_id, name, description, category,
         subcategory, subcategories,
         destination_id, venue_id, coordinates, price_label, price_source,
         booking_url, official_url, journey_date, journey_day, hours, places, metadata
       )
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
      [
        entryId,
        stop.id,
        order,
        stop.poiId ?? null,
        stop.name,
        stop.description,
        stop.category ?? list.category,
        stop.subcategory ?? null,
        toJsonArray(stop.subcategories),
        context.neighborhoodId ?? context.cityId ?? null,
        venueId,
        toJson(normalizeCoordinates(stop.coordinates)),
        stop.price ?? null,
        stop.priceSource ?? null,
        stop.bookingUrl ?? null,
        stop.officialUrl ?? null,
        stop.journeyDate ?? stop.itineraryDate ?? null,
        stop.journeyDay ?? stop.itineraryDay ?? null,
        toJson(stop.hours),
        toJsonArray(stop.places),
        toJsonObject({
          source: "editorial_guides",
          ...(stop.routeCoordinates ? { routeCoordinates: stop.routeCoordinates } : {}),
        }),
      ],
    );
    stats.entryStops += 1;
  }
}

async function refreshEntryRenderCache(client, entryId) {
  await client.query(
    [
      "insert into public.entry_render_cache (",
      "  entry_id, render_format, render_version, rendered_payload, source_hash,",
      "  rendered_at, stale_at, is_current, metadata",
      ")",
      "select",
      "  entry.id,",
      "  'maplist',",
      "  1,",
      "  view.list,",
      "  encode(digest(view.list::text, 'sha256'), 'hex'),",
      "  now(),",
      "  null,",
      "  true,",
      "  jsonb_build_object('refreshed_from', 'backfill-normalized-editorial-guides')",
      "from public.entries entry",
      "join public.entries_maplist view on view.id = entry.id",
      "where entry.id = $1",
      "on conflict (entry_id, render_format, render_version) do update set",
      "  rendered_payload = excluded.rendered_payload,",
      "  source_hash = excluded.source_hash,",
      "  rendered_at = excluded.rendered_at,",
      "  stale_at = null,",
      "  is_current = true,",
      "  metadata = public.entry_render_cache.metadata || excluded.metadata",
    ].join(" "),
    [entryId],
  );
}

async function upsertEditorialPois(client, pois, stats) {
  for (const poi of pois) {
    await client.query(
      `insert into public.editorial_pois (
         id, name, country, city, neighborhood, coordinates, photo,
         guide_ids, guide_slugs, categories
       )
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       on conflict (id) do update set
         name = excluded.name,
         country = excluded.country,
         city = excluded.city,
         neighborhood = excluded.neighborhood,
         coordinates = excluded.coordinates,
         photo = coalesce(excluded.photo, public.editorial_pois.photo),
         guide_ids = excluded.guide_ids,
         guide_slugs = excluded.guide_slugs,
         categories = excluded.categories`,
      [
        poi.id,
        poi.name,
        poi.country ?? null,
        poi.city ?? null,
        poi.neighborhood ?? null,
        toJson(normalizeCoordinates(poi.coordinates)),
        poi.photo ?? null,
        poi.guideIds ?? [],
        poi.guideSlugs ?? [],
        poi.categories ?? [],
      ],
    );
    stats.editorialPois += 1;
  }
}

async function backfillGuide(client, maps, list, stats) {
  const cityId = resolveCityId(maps, list.location?.city, list.location?.country);
  const countryId = list.location?.country ? maps.countryByName.get(normalizeName(list.location.country)) ?? null : null;
  const neighborhoodId = resolveNeighborhoodId(maps, cityId, list.location?.neighborhood);
  const destinationId = neighborhoodId ?? cityId ?? countryId;
  if (!destinationId) {
    throw new Error(`Could not resolve destination for ${list.id}`);
  }
  const entryId = await upsertEntry(client, list, { cityId, neighborhoodId, destinationId }, stats);
  await replaceEntryStops(client, entryId, list, { cityId, neighborhoodId }, stats);
  for (const source of list.sources ?? []) {
    const sourceId = await upsertSource(client, source, stats);
    await linkSource(client, "entry", entryId, sourceId);
  }
  await refreshEntryRenderCache(client, entryId);
}

async function main() {
  const startedAt = process.hrtime.bigint();
  loadEnvFile(path.join(ROOT, ".env.local"));
  loadEnvFile(path.join(ROOT, ".env"));

  const { dryRun, copyOnly, titleOnly, filters } = parsePublishArgs(process.argv.slice(2));
  requireScopedFilters(filters);

  const databaseUrl = process.env.SUPABASE_DB_URL ?? process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("Set SUPABASE_DB_URL, SUPABASE_DATABASE_URL, or DATABASE_URL.");
  }

  const allGuides = addPoiReferencesToGuides(loadEditorialGuideLists());
  const selectedGuides = filterEditorialGuides(allGuides, filters);
  if (!selectedGuides.length) {
    throw new Error(`No editorial guides matched ${describeEditorialGuideFilters(filters)}.`);
  }
  const scope = describeEditorialGuideFilters(filters);
  logPhase("selected guides", {
    scope,
    count: selectedGuides.length,
    stops: selectedGuides.reduce((sum, list) => sum + (list.stops?.length ?? 0), 0),
    dryRun,
    copyOnly,
    titleOnly,
  });

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1") ? false : { rejectUnauthorized: false },
  });
  const stats = {
    entries: 0,
    entryStops: 0,
    venues: 0,
    venueMedia: 0,
    venueHours: 0,
    sources: 0,
    sourceLinks: 0,
    editorialPois: 0,
    renderCaches: 0,
  };

  await client.connect();
  try {
    await client.query("begin");
    let verification;
    if (titleOnly) {
      verification = await publishTitleOnly(client, selectedGuides, stats);
    } else if (copyOnly) {
      verification = await publishCopyOnly(client, selectedGuides, stats);
    } else {
      const timezoneUpdates = await ensureSelectedDestinationTimezones(client, selectedGuides);
      if (timezoneUpdates) {
        logPhase("phase destination_timezones:done", { affected: timezoneUpdates });
      }
      logPhase("phase destination_maps:start");
      const maps = await loadDestinationMaps(client);
      logPhase("phase destination_maps:done");
      verification = await publishBatched(client, maps, selectedGuides, stats);
    }
    if (dryRun) {
      await client.query("rollback");
      logPhase("dry run rolled back");
    } else {
      await client.query("commit");
    }
    console.log(JSON.stringify({
      ok: true,
      scope,
      dryRun,
      copyOnly,
      titleOnly,
      selectedGuides: selectedGuides.length,
      stats,
      verification,
      elapsedMs: elapsedMs(startedAt),
    }, null, 2));
  } catch (error) {
    await client.query("rollback").catch(() => {});
    console.error("NORMALIZED_EDITORIAL_GUIDES_BACKFILL_FAILED");
    console.error(error instanceof Error ? error.stack || error.message : error);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}

main();
