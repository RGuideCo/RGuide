import { createRequire } from "module";
import fs from "fs";
import path from "path";
import vm from "vm";
import pg from "pg";
import ts from "typescript";

import {
  addPoiReferencesToGuides,
  loadEditorialGuideLists,
} from "./editorial-guides-data.mjs";
import {
  loadWeeklyEventGuideRecords,
  loadWeeklyEventRuns,
} from "./weekly-events-data.mjs";

const ROOT = process.cwd();
const nodeRequire = createRequire(import.meta.url);
const moduleCache = new Map();

const TOP_EVENT_CITIES = [
  ["Paris", "France", "Europe/Paris"],
  ["London", "United Kingdom", "Europe/London"],
  ["Istanbul", "Turkey", "Europe/Istanbul"],
  ["Rome", "Italy", "Europe/Rome"],
  ["Barcelona", "Spain", "Europe/Madrid"],
  ["Lisbon", "Portugal", "Europe/Lisbon"],
  ["Amsterdam", "Netherlands", "Europe/Amsterdam"],
  ["Madrid", "Spain", "Europe/Madrid"],
  ["Prague", "Czech Republic", "Europe/Prague"],
  ["Berlin", "Germany", "Europe/Berlin"],
  ["New York City", "United States", "America/New_York"],
  ["Miami", "United States", "America/New_York"],
  ["Los Angeles", "United States", "America/Los_Angeles"],
  ["Orlando", "United States", "America/New_York"],
  ["San Francisco", "United States", "America/Los_Angeles"],
  ["Las Vegas", "United States", "America/Los_Angeles"],
  ["Washington, D.C.", "United States", "America/New_York"],
  ["Chicago", "United States", "America/Chicago"],
  ["Boston", "United States", "America/New_York"],
  ["Honolulu", "United States", "Pacific/Honolulu"],
  ["Bangkok", "Thailand", "Asia/Bangkok"],
  ["Hong Kong", "Hong Kong", "Asia/Hong_Kong"],
  ["Macau", "Macau", "Asia/Macau"],
  ["Dubai", "United Arab Emirates", "Asia/Dubai"],
  ["Singapore", "Singapore", "Asia/Singapore"],
  ["Kuala Lumpur", "Malaysia", "Asia/Kuala_Lumpur"],
  ["Tokyo", "Japan", "Asia/Tokyo"],
  ["Seoul", "South Korea", "Asia/Seoul"],
  ["Phuket", "Thailand", "Asia/Bangkok"],
  ["Mecca", "Saudi Arabia", "Asia/Riyadh"],
  ["Cancun", "Mexico", "America/Cancun"],
  ["Cusco", "Peru", "America/Lima"],
  ["Mexico City", "Mexico", "America/Mexico_City"],
  ["Buenos Aires", "Argentina", "America/Argentina/Buenos_Aires"],
  ["Rio de Janeiro", "Brazil", "America/Sao_Paulo"],
  ["Lima", "Peru", "America/Lima"],
  ["Medellin", "Colombia", "America/Bogota"],
  ["Quito", "Ecuador", "America/Guayaquil"],
  ["Antigua Guatemala", "Guatemala", "America/Guatemala"],
  ["Bogota", "Colombia", "America/Bogota"],
];

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
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
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

function inferVenueClassification(stop, list) {
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

function transpileTs(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  return ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
      resolveJsonModule: true,
    },
    fileName: filePath,
  }).outputText;
}

function runCommonJs(code, filePath, requireImpl) {
  const module = { exports: {} };
  const context = vm.createContext({
    console,
    exports: module.exports,
    module,
    require: requireImpl,
    __filename: filePath,
    __dirname: path.dirname(filePath),
    Intl,
    Date,
    Math,
    JSON,
    String,
    Number,
    Boolean,
    Array,
    Object,
    RegExp,
    Set,
    Map,
  });
  vm.runInContext(code, context, { filename: filePath });
  return module.exports;
}

function resolveLocalModule(specifier, fromFilePath) {
  const basePath = specifier.startsWith("@/")
    ? path.join(ROOT, "src", specifier.slice(2))
    : specifier.startsWith(".")
      ? path.resolve(path.dirname(fromFilePath), specifier)
      : null;
  if (!basePath) {
    return null;
  }
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.json`,
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.tsx"),
    path.join(basePath, "index.json"),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) ?? null;
}

function loadLocalModule(filePath) {
  if (moduleCache.has(filePath)) {
    return moduleCache.get(filePath);
  }
  if (filePath.endsWith(".json")) {
    const jsonExports = JSON.parse(fs.readFileSync(filePath, "utf8"));
    moduleCache.set(filePath, jsonExports);
    return jsonExports;
  }
  const exports = runCommonJs(transpileTs(filePath), filePath, (specifier) => {
    if (specifier === "countries-list" || specifier === "clsx" || specifier === "tailwind-merge") {
      return nodeRequire(specifier);
    }
    if (specifier === "@/types") {
      return {};
    }
    const resolved = resolveLocalModule(specifier, filePath);
    if (resolved) {
      return loadLocalModule(resolved);
    }
    return nodeRequire(specifier);
  });
  moduleCache.set(filePath, exports);
  return exports;
}

function loadGeography() {
  const geography = loadLocalModule(path.join(ROOT, "src/data/geography.ts"));
  if (!Array.isArray(geography.continents)) {
    throw new Error("Expected geography.ts to export continents.");
  }
  return geography;
}

async function upsertSource(client, source, stats) {
  if (!source?.url) {
    return null;
  }
  const name = source.name?.trim() || source.publisher?.trim() || source.url;
  const { rows } = await client.query(
    `insert into public.sources (name, url, publisher, source_type, fetched_at, sourced_at, excerpt, raw_metadata)
     values ($1, $2, $3, $4, $5, coalesce($6, now()), $7, $8)
     on conflict (url) do update set
       name = coalesce(excluded.name, public.sources.name),
       publisher = coalesce(excluded.publisher, public.sources.publisher),
       source_type = coalesce(excluded.source_type, public.sources.source_type),
       fetched_at = coalesce(excluded.fetched_at, public.sources.fetched_at),
       sourced_at = greatest(public.sources.sourced_at, excluded.sourced_at),
       excerpt = coalesce(excluded.excerpt, public.sources.excerpt),
       raw_metadata = public.sources.raw_metadata || excluded.raw_metadata
     returning id`,
    [
      name,
      source.url,
      source.publisher ?? null,
      source.sourceType ?? source.source_type ?? null,
      source.fetchedAt ?? source.fetched_at ?? null,
      source.sourcedAt ?? source.sourced_at ?? null,
      source.excerpt ?? null,
      toJsonObject(source.rawMetadata ?? source.raw_metadata),
    ],
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
     on conflict (entity_type, entity_id, source_id, relationship) do update set
       sourced_at = excluded.sourced_at`,
    [entityType, entityId, sourceId, relationship],
  );
}

async function tableExists(client, qualifiedName) {
  const { rows } = await client.query("select to_regclass($1) as table_name", [qualifiedName]);
  return Boolean(rows[0]?.table_name);
}

async function upsertDestination(client, row, stats) {
  const { rows } = await client.query(
    `insert into public.destinations (
       legacy_id, slug, scope, parent_id, name, display_name, continent_name, country_name,
       incoming.country_code,
       incoming.region_name,
       incoming.state_name,
       incoming.city_name,
       incoming.neighborhood_name,
       incoming.timezone,
       incoming.coordinates,
       incoming.bounds,
       incoming.image_url,
       incoming.description,
       incoming.list_count,
       incoming.subarea_count,
       incoming.subareas,
       incoming.metadata,
       incoming.is_published
     )
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
     on conflict (legacy_id) do update set
       slug = excluded.slug,
       scope = excluded.scope,
       parent_id = excluded.parent_id,
       name = excluded.name,
       display_name = excluded.display_name,
       continent_name = excluded.continent_name,
       country_name = excluded.country_name,
       country_code = excluded.country_code,
       region_name = excluded.region_name,
       state_name = excluded.state_name,
       city_name = excluded.city_name,
       neighborhood_name = excluded.neighborhood_name,
       timezone = excluded.timezone,
       coordinates = excluded.coordinates,
       bounds = excluded.bounds,
       image_url = excluded.image_url,
       description = excluded.description,
       list_count = excluded.list_count,
       subarea_count = excluded.subarea_count,
       subareas = excluded.subareas,
       metadata = public.destinations.metadata || excluded.metadata,
       is_published = excluded.is_published
     returning id`,
    [
      row.legacyId,
      row.slug,
      row.scope,
      row.parentId ?? null,
      row.name,
      row.displayName ?? row.name,
      row.continentName ?? null,
      row.countryName ?? null,
      row.countryCode ?? null,
      row.regionName ?? null,
      row.stateName ?? null,
      row.cityName ?? null,
      row.neighborhoodName ?? null,
      row.timezone ?? null,
      toJson(row.coordinates),
      toJson(row.bounds),
      row.imageUrl ?? null,
      row.description ?? null,
      row.listCount ?? 0,
      row.subareaCount ?? 0,
      toJsonArray(row.subareas),
      toJsonObject(row.metadata),
      row.isPublished ?? true,
    ],
  );
  stats.destinations += 1;
  return rows[0].id;
}

function descriptionLegacyId(kind, ...parts) {
  return [kind, ...parts].filter(Boolean).join(":");
}

async function upsertDescription(client, destinationId, destination, stats) {
  const description = destination.description?.trim();
  if (!description) {
    return;
  }
  await client.query(
    `insert into public.destination_descriptions_v2 (
       destination_id, locale, title, summary, description, description_kind, is_primary, metadata
     )
     values ($1, 'en', $2, $3, $4, 'overview', true, $5)
     on conflict (destination_id, locale, description_kind) do update set
       title = excluded.title,
       summary = excluded.summary,
       description = excluded.description,
       is_primary = excluded.is_primary,
       metadata = public.destination_descriptions_v2.metadata || excluded.metadata`,
    [
      destinationId,
      destination.displayName ?? destination.name,
      destination.summary ?? null,
      description,
      toJsonObject({ legacyId: destination.legacyId }),
    ],
  );
  stats.destinationDescriptions += 1;
}

async function backfillDestinations(client, geography, editorialLists, stats) {
  const listCountByCity = new Map();
  for (const list of editorialLists) {
    if (list.location?.city) {
      const key = `${list.location.country}|||${list.location.city}`.toLowerCase();
      listCountByCity.set(key, (listCountByCity.get(key) ?? 0) + 1);
    }
  }

  const destinationRows = [];

  function add(row) {
    destinationRows.push(row);
  }

  function collectSubareas(subareas, context) {
    for (const subarea of subareas ?? []) {
      const isNeighborhood = context.scope === "neighborhood";
      const legacyId = isNeighborhood
        ? descriptionLegacyId("neighborhood", context.countryId, context.cityId, context.parentLegacyEntityId, subarea.id)
        : descriptionLegacyId("region", context.countryId, context.parentLegacyEntityId, subarea.id);
      add({
        legacyId,
        parentLegacyId: context.parentLegacyId,
        depth: context.depth,
        slug: subarea.id || slugify(subarea.name),
        scope: context.scope,
        name: subarea.name,
        continentName: context.continentName,
        countryName: context.countryName,
        cityName: context.cityName,
        regionName: isNeighborhood ? null : subarea.name,
        neighborhoodName: isNeighborhood ? subarea.name : null,
        coordinates: normalizeCoordinates(subarea.coordinates),
        description: subarea.description,
        subareaCount: subarea.subareas?.length ?? 0,
        subareas: subarea.subareas ?? [],
        metadata: { source: "geography", entityId: subarea.id },
      });
      collectSubareas(subarea.subareas, {
        ...context,
        parentLegacyId: legacyId,
        parentLegacyEntityId: subarea.id,
        depth: context.depth + 1,
      });
    }
  }

  for (const continent of geography.continents) {
    const continentLegacyId = descriptionLegacyId("continent", continent.id);
    add({
      legacyId: continentLegacyId,
      parentLegacyId: null,
      depth: 0,
      slug: continent.id,
      scope: "continent",
      name: continent.name,
      continentName: continent.name,
      coordinates: normalizeCoordinates(continent.coordinates),
      bounds: continent.bounds,
      subareaCount: continent.subareas?.length ?? 0,
      subareas: continent.subareas ?? [],
      metadata: { source: "geography", entityId: continent.id },
    });

    collectSubareas(continent.subareas, {
      scope: "region",
      parentLegacyId: continentLegacyId,
      parentLegacyEntityId: continent.id,
      countryId: continent.id,
      continentName: continent.name,
      depth: 1,
    });

    for (const country of continent.countries) {
      const countryLegacyId = descriptionLegacyId("country", country.id);
      add({
        legacyId: countryLegacyId,
        parentLegacyId: continentLegacyId,
        depth: 1,
        slug: country.id,
        scope: "country",
        name: country.name,
        continentName: continent.name,
        countryName: country.name,
        coordinates: null,
        bounds: country.bounds,
        description: country.description,
        subareaCount: country.subareas?.length ?? 0,
        subareas: country.subareas ?? [],
        metadata: { source: "geography", entityId: country.id },
      });

      collectSubareas(country.subareas, {
        scope: "region",
        parentLegacyId: countryLegacyId,
        parentLegacyEntityId: country.id,
        countryId: country.id,
        continentName: continent.name,
        countryName: country.name,
        depth: 2,
      });

      for (const state of country.states ?? []) {
        const parentLegacyId = state.countrySubareaId
          ? descriptionLegacyId("region", country.id, country.id, state.countrySubareaId)
          : countryLegacyId;
        add({
          legacyId: descriptionLegacyId("state", country.id, state.id),
          parentLegacyId,
          depth: 3,
          slug: state.id,
          scope: "state",
          name: state.name,
          continentName: continent.name,
          countryName: country.name,
          stateName: state.name,
          coordinates: normalizeCoordinates(state.coordinates),
          description: state.description,
          metadata: { source: "geography", entityId: state.id },
        });
      }

      for (const city of country.cities) {
        const cityLegacyId = descriptionLegacyId("city", country.id, city.id);
        const parentLegacy = city.stateId
          ? descriptionLegacyId("state", country.id, city.stateId)
          : city.countrySubareaId
            ? descriptionLegacyId("region", country.id, country.id, city.countrySubareaId)
            : countryLegacyId;
        add({
          legacyId: cityLegacyId,
          parentLegacyId: parentLegacy,
          depth: city.stateId || city.countrySubareaId ? 3 : 2,
          slug: city.id,
          scope: "city",
          name: city.name,
          continentName: continent.name,
          countryName: country.name,
          cityName: city.name,
          coordinates: normalizeCoordinates(city.coordinates),
          imageUrl: city.image,
          description: city.description,
          listCount: listCountByCity.get(`${country.name}|||${city.name}`.toLowerCase()) ?? city.listCount ?? 0,
          subareaCount: city.subareas?.length ?? 0,
          subareas: city.subareas ?? [],
          metadata: {
            source: "geography",
            entityId: city.id,
            countrySubareaId: city.countrySubareaId,
            stateId: city.stateId,
            regionKind: city.regionKind,
            isPlaceholderRegion: city.isPlaceholderRegion,
          },
        });
        collectSubareas(city.subareas, {
          scope: "neighborhood",
          parentLegacyId: cityLegacyId,
          parentLegacyEntityId: city.id,
          countryId: country.id,
          cityId: city.id,
          continentName: continent.name,
          countryName: country.name,
          cityName: city.name,
          depth: (city.stateId || city.countrySubareaId ? 4 : 3),
        });
      }
    }
  }

  const destinationPayload = destinationRows.map((row) => ({
    legacy_id: row.legacyId,
    parent_legacy_id: row.parentLegacyId ?? null,
    depth: row.depth ?? 0,
    slug: row.slug,
    scope: row.scope,
    name: row.name,
    display_name: row.displayName ?? row.name,
    continent_name: row.continentName ?? null,
    country_name: row.countryName ?? null,
    country_code: row.countryCode ?? null,
    region_name: row.regionName ?? null,
    state_name: row.stateName ?? null,
    city_name: row.cityName ?? null,
    neighborhood_name: row.neighborhoodName ?? null,
    timezone: row.timezone ?? null,
    coordinates: row.coordinates ?? null,
    bounds: row.bounds ?? null,
    image_url: row.imageUrl ?? null,
    description: row.description ?? null,
    list_count: row.listCount ?? 0,
    subarea_count: row.subareaCount ?? 0,
    subareas: row.subareas ?? [],
    metadata: row.metadata ?? {},
    is_published: row.isPublished ?? true,
  }));

  const depths = [...new Set(destinationPayload.map((row) => row.depth))].sort((a, b) => a - b);
  for (const depth of depths) {
    const depthPayload = destinationPayload.filter((row) => row.depth === depth);
    await client.query(
      `with incoming as (
       select *
       from jsonb_to_recordset($1::jsonb) as row(
         legacy_id text,
         parent_legacy_id text,
         depth integer,
         slug text,
         scope public.destination_scope,
         name text,
         display_name text,
         continent_name text,
         country_name text,
         country_code text,
         region_name text,
         state_name text,
         city_name text,
         neighborhood_name text,
         timezone text,
         coordinates jsonb,
         bounds jsonb,
         image_url text,
         description text,
         list_count integer,
         subarea_count integer,
         subareas jsonb,
         metadata jsonb,
         is_published boolean
       )
     )
     insert into public.destinations (
       legacy_id, parent_id, slug, scope, name, display_name, continent_name, country_name,
       country_code, region_name, state_name, city_name, neighborhood_name, timezone,
       coordinates, bounds, image_url, description, list_count, subarea_count, subareas,
       metadata, is_published
     )
     select
       incoming.legacy_id,
       parent.id,
       incoming.slug,
       incoming.scope,
       incoming.name,
       incoming.display_name,
       incoming.continent_name,
       incoming.country_name,
       incoming.country_code,
       incoming.region_name,
       incoming.state_name,
       incoming.city_name,
       incoming.neighborhood_name,
       incoming.timezone,
       incoming.coordinates,
       incoming.bounds,
       incoming.image_url,
       incoming.description,
       incoming.list_count,
       incoming.subarea_count,
       incoming.subareas,
       incoming.metadata,
       incoming.is_published
     from incoming
     left join public.destinations parent on parent.legacy_id = incoming.parent_legacy_id
     on conflict (legacy_id) do update set
       parent_id = excluded.parent_id,
       slug = excluded.slug,
       scope = excluded.scope,
       name = excluded.name,
       display_name = excluded.display_name,
       continent_name = excluded.continent_name,
       country_name = excluded.country_name,
       country_code = excluded.country_code,
       region_name = excluded.region_name,
       state_name = excluded.state_name,
       city_name = excluded.city_name,
       neighborhood_name = excluded.neighborhood_name,
       timezone = excluded.timezone,
       coordinates = excluded.coordinates,
       bounds = excluded.bounds,
       image_url = excluded.image_url,
       description = excluded.description,
       list_count = excluded.list_count,
       subarea_count = excluded.subarea_count,
       subareas = excluded.subareas,
       metadata = public.destinations.metadata || excluded.metadata,
       is_published = excluded.is_published`,
      [JSON.stringify(depthPayload)],
    );
  }

  await client.query(
    `with incoming as (
       select legacy_id, parent_legacy_id
       from jsonb_to_recordset($1::jsonb) as row(legacy_id text, parent_legacy_id text)
     )
     update public.destinations destination
     set parent_id = parent.id
     from incoming
     join public.destinations parent on parent.legacy_id = incoming.parent_legacy_id
     where destination.legacy_id = incoming.legacy_id
       and incoming.parent_legacy_id is not null`,
    [JSON.stringify(destinationPayload)],
  );

  await client.query(
    `update public.destinations destination
     set parent_id = null
     where destination.legacy_id in (
       select legacy_id
       from jsonb_to_recordset($1::jsonb) as row(legacy_id text, parent_legacy_id text)
       where parent_legacy_id is null
     )`,
    [JSON.stringify(destinationPayload)],
  );

  await client.query(
    `with incoming as (
       select legacy_id, display_name, description, metadata
       from jsonb_to_recordset($1::jsonb) as row(
         legacy_id text,
         display_name text,
         description text,
         metadata jsonb
       )
       where nullif(trim(description), '') is not null
     )
     insert into public.destination_descriptions_v2 (
       destination_id, locale, title, description, description_kind, is_primary, metadata
     )
     select destination.id, 'en', incoming.display_name, incoming.description, 'overview', true, incoming.metadata
     from incoming
     join public.destinations destination on destination.legacy_id = incoming.legacy_id
     on conflict (destination_id, locale, description_kind) do update set
       title = excluded.title,
       description = excluded.description,
       is_primary = excluded.is_primary,
       metadata = public.destination_descriptions_v2.metadata || excluded.metadata`,
    [JSON.stringify(destinationPayload)],
  );

  const { rows: idRows } = await client.query(
    `select legacy_id, id from public.destinations where legacy_id = any($1::text[])`,
    [destinationRows.map((row) => row.legacyId)],
  );
  const destinationByLegacy = new Map(idRows.map((row) => [row.legacy_id, row.id]));
  const cityByNameCountry = new Map();
  const cityBySlug = new Map();
  const countryByName = new Map();
  const neighborhoodByCityAndName = new Map();
  const allDestinations = [];

  for (const row of destinationRows) {
    const id = destinationByLegacy.get(row.legacyId);
    allDestinations.push({ ...row, id });
    if (row.scope === "country") {
      countryByName.set(normalizeName(row.name), id);
    }
    if (row.scope === "city") {
      cityByNameCountry.set(`${normalizeName(row.name)}|||${normalizeName(row.countryName)}`, id);
      cityBySlug.set(row.slug, id);
    }
    if (row.scope === "neighborhood") {
      const cityId = destinationByLegacy.get(row.parentLegacyId);
      if (cityId) {
        neighborhoodByCityAndName.set(`${cityId}|||${normalizeName(row.name)}`, id);
      }
    }
  }

  stats.destinations += destinationRows.length;
  stats.destinationDescriptions += destinationRows.filter((row) => row.description?.trim()).length;

  return {
    destinationByLegacy,
    cityByNameCountry,
    cityBySlug,
    countryByName,
    neighborhoodByCityAndName,
    allDestinations,
  };
}

async function resolveCityId(maps, cityName, countryName) {
  if (!cityName) {
    return null;
  }
  return maps.cityByNameCountry.get(`${normalizeName(cityName)}|||${normalizeName(countryName)}`) ?? null;
}

function resolveNeighborhoodId(maps, cityId, neighborhoodName) {
  if (!cityId || !neighborhoodName || normalizeName(neighborhoodName) === "citywide") {
    return null;
  }
  return maps.neighborhoodByCityAndName.get(`${cityId}|||${normalizeName(neighborhoodName)}`) ?? null;
}

async function upsertVenue(client, input, stats) {
  const name = input.name?.trim();
  if (!name) {
    return null;
  }
  const normalizedName = normalizeName(name);
  if (input.cityId) {
    const existing = await client.query(
      `select id from public.venues
       where city_id = $1 and normalized_name = $2 and merged_into_venue_id is null
       limit 1`,
      [input.cityId, normalizedName],
    );
    if (existing.rows[0]?.id) {
      return existing.rows[0].id;
    }
  }

  const slug = input.slug || slugify(name);
  const { rows } = await client.query(
    `insert into public.venues (
       legacy_id, slug, name, normalized_name, aliases, destination_id, city_id,
       neighborhood_id, address_line1, locality, region, country, coordinates,
       official_url, venue_kind, venue_kinds, lodging_type, food_service_type, cuisine_types,
       price_tier, nightlife_type, music_genres, attribute_tags, source_metadata
     )
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)
     on conflict (city_id, slug) do update set
       name = excluded.name,
       normalized_name = excluded.normalized_name,
       aliases = array(select distinct unnest(public.venues.aliases || excluded.aliases)),
       destination_id = coalesce(excluded.destination_id, public.venues.destination_id),
       neighborhood_id = coalesce(excluded.neighborhood_id, public.venues.neighborhood_id),
       coordinates = coalesce(excluded.coordinates, public.venues.coordinates),
       official_url = coalesce(excluded.official_url, public.venues.official_url),
       venue_kind = case
         when excluded.venue_kind = 'other' then public.venues.venue_kind
         else excluded.venue_kind
       end,
       venue_kinds = array(select distinct unnest(public.venues.venue_kinds || excluded.venue_kinds)),
       lodging_type = coalesce(excluded.lodging_type, public.venues.lodging_type),
       food_service_type = coalesce(excluded.food_service_type, public.venues.food_service_type),
       cuisine_types = array(select distinct unnest(public.venues.cuisine_types || excluded.cuisine_types)),
       price_tier = coalesce(excluded.price_tier, public.venues.price_tier),
       nightlife_type = coalesce(excluded.nightlife_type, public.venues.nightlife_type),
       music_genres = array(select distinct unnest(public.venues.music_genres || excluded.music_genres)),
       attribute_tags = array(select distinct unnest(public.venues.attribute_tags || excluded.attribute_tags)),
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
      input.addressLine1 ?? null,
      input.locality ?? null,
      input.region ?? null,
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

async function upsertEntry(client, list, context, stats) {
  const { rows } = await client.query(
    `insert into public.entries (
       legacy_id, slug, seo_slug, seo_title, seo_description, title, description,
       highlights, photo_url, canonical_url, category, submission_type, status,
       destination_id, city_id, neighborhood_id, country_name, continent_name,
       creator_id, creator_name, creator_avatar, user_id, upvotes, created_on,
       journey_start_date, journey_end_date, journal_visited_at, journal_note,
       journal_visibility, source_table, metadata
     )
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'published',$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30)
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
       user_id = excluded.user_id,
       upvotes = excluded.upvotes,
       created_on = excluded.created_on,
       journey_start_date = excluded.journey_start_date,
       journey_end_date = excluded.journey_end_date,
       journal_visited_at = excluded.journal_visited_at,
       journal_note = excluded.journal_note,
       journal_visibility = excluded.journal_visibility,
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
      list.photo ?? null,
      list.url ?? null,
      list.category,
      toSchemaSubmissionType(list.submissionType),
      context.destinationId ?? context.cityId ?? context.countryId ?? null,
      context.cityId ?? null,
      context.neighborhoodId ?? null,
      list.location?.country ?? null,
      list.location?.continent ?? null,
      list.creator?.id ?? null,
      list.creator?.name ?? null,
      list.creator?.avatar ?? null,
      context.userId ?? null,
      list.upvotes ?? 0,
      list.createdAt ?? new Date().toISOString().slice(0, 10),
      list.journey?.startDate ?? list.itinerary?.startDate ?? null,
      list.journey?.endDate ?? list.itinerary?.endDate ?? null,
      list.journal?.visitedAt ?? null,
      list.journal?.note ?? null,
      list.journal?.visibility ?? null,
      context.sourceTable,
      toJsonObject(context.metadata),
    ],
  );
  stats.entries += 1;
  return rows[0].id;
}

async function insertEntryStops(client, entryId, list, context, stats) {
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
      sourceMetadata: { source: context.sourceTable, entryId: list.id, stopId: stop.id },
    }, stats);
    await client.query(
      `insert into public.entry_stops (
         entry_id, legacy_id, stop_order, poi_legacy_id, name, description, category,
         destination_id, venue_id, event_id, event_occurrence_id, coordinates, photo_url,
         price_label, price_source, booking_url, official_url, event_time_label,
         event_venue_label, journey_date, journey_day, hours, places, metadata
       )
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)`,
      [
        entryId,
        stop.id,
        order,
        stop.poiId ?? null,
        stop.name,
        stop.description,
        stop.category ?? list.category,
        context.neighborhoodId ?? context.cityId ?? null,
        venueId,
        context.eventId ?? null,
        null,
        toJson(normalizeCoordinates(stop.coordinates)),
        stop.photo ?? null,
        stop.price ?? null,
        stop.priceSource ?? null,
        stop.bookingUrl ?? null,
        stop.officialUrl ?? null,
        stop.eventTime ?? null,
        stop.eventVenue ?? null,
        stop.journeyDate ?? stop.itineraryDate ?? null,
        stop.journeyDay ?? stop.itineraryDay ?? null,
        toJson(stop.hours),
        toJsonArray(stop.places),
        toJsonObject({ source: context.sourceTable }),
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
      "  jsonb_build_object('refreshed_from', 'backfill-normalized-schema')",
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

async function backfillList(client, maps, list, options, stats) {
  const cityId = await resolveCityId(maps, list.location?.city, list.location?.country);
  const countryId = list.location?.country ? maps.countryByName.get(normalizeName(list.location.country)) ?? null : null;
  const neighborhoodId = resolveNeighborhoodId(maps, cityId, list.location?.neighborhood);
  const destinationId = neighborhoodId ?? cityId ?? countryId;
  const entryId = await upsertEntry(client, list, {
    cityId,
    countryId,
    neighborhoodId,
    destinationId,
    sourceTable: options.sourceTable,
    userId: options.userId,
    eventId: options.eventId,
    metadata: options.metadata,
  }, stats);
  await insertEntryStops(client, entryId, list, {
    cityId,
    neighborhoodId,
    sourceTable: options.sourceTable,
    eventId: options.eventId,
  }, stats);
  for (const source of list.sources ?? []) {
    const sourceId = await upsertSource(client, source, stats);
    await linkSource(client, "entry", entryId, sourceId);
  }
  await refreshEntryRenderCache(client, entryId);
  return entryId;
}

function eventWindow(run, events) {
  const dates = events
    .flatMap((event) => [event.startsAt, event.endsAt])
    .filter(Boolean)
    .map((value) => new Date(value));
  const min = dates.length ? new Date(Math.min(...dates.map((date) => date.getTime()))) : new Date(run.sourcedAt);
  const max = dates.length ? new Date(Math.max(...dates.map((date) => date.getTime()))) : new Date(Date.parse(run.sourcedAt) + 13 * 86400000);
  return {
    start: min.toISOString().slice(0, 10),
    end: max.toISOString().slice(0, 10),
  };
}

async function upsertEventCitySetting(client, cityId, citySlug, cityName, timezone, sourceStrategy, stats) {
  const { rows } = await client.query(
    `insert into public.event_city_publishing_settings (
       city_id, destination_id, city_slug, city_name, timezone, source_strategy
     )
     values ($1, $1, $2, $3, $4, $5)
     on conflict (city_id) do update set
       city_slug = excluded.city_slug,
       city_name = excluded.city_name,
       timezone = excluded.timezone,
       source_strategy = excluded.source_strategy,
       is_active = true
     returning id`,
    [cityId, citySlug, cityName, timezone, sourceStrategy ?? []],
  );
  stats.eventCitySettings += 1;
  return rows[0].id;
}

async function upsertEventSourceRun(client, run, cityId, settingsId, stats) {
  const window = eventWindow(run, run.events);
  const legacyId = `weekly:${run.cityId}:${run.sourcedAt}:${slugify(run.weekLabel)}`;
  const { rows } = await client.query(
    `insert into public.event_source_runs (
       legacy_id, publishing_settings_id, run_type, city_id, destination_id, city_slug,
       city_name, window_start, window_end, publish_week_start, publish_week_end,
       window_label, sourced_at, timezone, source_strategy, status, events_found_count,
       events_published_count, raw_payload
     )
     values ($1,$2,'weekly_publish',$3,$3,$4,$5,$6,$7,$6,$7,$8,$9,$10,$11,'completed',$12,$12,$13)
     on conflict (legacy_id) do update set
       publishing_settings_id = excluded.publishing_settings_id,
       city_id = excluded.city_id,
       destination_id = excluded.destination_id,
       city_slug = excluded.city_slug,
       city_name = excluded.city_name,
       window_start = excluded.window_start,
       window_end = excluded.window_end,
       publish_week_start = excluded.publish_week_start,
       publish_week_end = excluded.publish_week_end,
       window_label = excluded.window_label,
       sourced_at = excluded.sourced_at,
       timezone = excluded.timezone,
       source_strategy = excluded.source_strategy,
       status = excluded.status,
       events_found_count = excluded.events_found_count,
       events_published_count = excluded.events_published_count,
       raw_payload = excluded.raw_payload
     returning id`,
    [
      legacyId,
      settingsId,
      cityId,
      run.cityId,
      run.cityName,
      window.start,
      window.end,
      run.weekLabel,
      run.sourcedAt,
      run.timezone,
      run.sourceStrategy ?? [],
      run.events.length,
      toJson(run),
    ],
  );
  stats.eventSourceRuns += 1;
  return { id: rows[0].id, window };
}

async function upsertEvent(client, maps, rawEvent, guide, run, cityId, sourceRunId, stats) {
  const neighborhoodId = resolveNeighborhoodId(maps, cityId, rawEvent.neighborhood);
  const venueId = await upsertVenue(client, {
    legacyId: `event-venue:${rawEvent.id}`,
    slug: slugify(rawEvent.venue || rawEvent.title),
    name: rawEvent.venue || rawEvent.title,
    cityId,
    neighborhoodId,
    country: guide.location?.country,
    coordinates: rawEvent.coordinates,
    officialUrl: rawEvent.url,
    sourceMetadata: { source: "weekly_event", eventId: rawEvent.id },
  }, stats);
  const { rows } = await client.query(
    `insert into public.events (
       legacy_id, slug, title, description, highlights, event_category, guide_category,
       status, destination_id, city_id, neighborhood_id, venue_id, timezone, starts_at,
       ends_at, starts_on, ends_on, price_label, official_url, photo_url, is_festival,
       is_guide_worthy, guide_reason, raw_metadata,
       discovery_source_run_id, latest_refresh_source_run_id
     )
     values ($1,$2,$3,$4,$5,$6,$7,'published',$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$24)
     on conflict (legacy_id) do update set
       slug = excluded.slug,
       title = excluded.title,
       description = excluded.description,
       highlights = excluded.highlights,
       event_category = excluded.event_category,
       guide_category = excluded.guide_category,
       destination_id = excluded.destination_id,
       city_id = excluded.city_id,
       neighborhood_id = excluded.neighborhood_id,
       venue_id = excluded.venue_id,
       timezone = excluded.timezone,
       starts_at = excluded.starts_at,
       ends_at = excluded.ends_at,
       starts_on = excluded.starts_on,
       ends_on = excluded.ends_on,
       price_label = excluded.price_label,
       official_url = excluded.official_url,
       photo_url = excluded.photo_url,
       is_festival = excluded.is_festival,
       is_guide_worthy = excluded.is_guide_worthy,
       guide_reason = excluded.guide_reason,
       raw_metadata = excluded.raw_metadata,
       latest_refresh_source_run_id = excluded.latest_refresh_source_run_id
     returning id`,
    [
      rawEvent.id,
      slugify(rawEvent.id || rawEvent.title),
      rawEvent.title,
      rawEvent.description,
      rawEvent.highlights ?? [],
      rawEvent.category,
      guide.category,
      neighborhoodId ?? cityId,
      cityId,
      neighborhoodId,
      venueId,
      rawEvent.timezone ?? run.timezone,
      rawEvent.startsAt ?? null,
      rawEvent.endsAt ?? null,
      rawEvent.startsAt?.slice(0, 10) ?? null,
      rawEvent.endsAt?.slice(0, 10) ?? rawEvent.startsAt?.slice(0, 10) ?? null,
      rawEvent.price ?? null,
      rawEvent.url ?? null,
      guide.photo ?? null,
      Boolean(rawEvent.activations?.length) || rawEvent.category === "Festivals",
      Boolean(rawEvent.isGuideWorthy),
      rawEvent.guideReason ?? null,
      toJson(rawEvent),
      sourceRunId,
    ],
  );
  stats.events += 1;
  const sourceId = await upsertSource(client, { name: rawEvent.sourceName, url: rawEvent.url, sourcedAt: run.sourcedAt }, stats);
  await linkSource(client, "event", rows[0].id, sourceId, "official");
  return { id: rows[0].id, venueId, neighborhoodId };
}

async function replaceEventOccurrences(client, maps, rawEvent, guide, run, cityId, eventId, defaultVenueId, sourceRunId, stats) {
  await client.query("delete from public.event_occurrences where event_id = $1", [eventId]);
  const activations = rawEvent.activations?.length
    ? rawEvent.activations
    : [{
        id: "main",
        title: rawEvent.title,
        venue: rawEvent.venue,
        startsAt: rawEvent.startsAt,
        description: rawEvent.description,
        coordinates: rawEvent.coordinates,
        url: rawEvent.url,
      }];
  let order = 0;
  for (const activation of activations) {
    order += 1;
    const venueId = activation.venue
      ? await upsertVenue(client, {
          legacyId: `event-venue:${rawEvent.id}:${activation.id}`,
          slug: slugify(activation.venue),
          name: activation.venue,
          cityId,
          country: guide.location?.country,
          coordinates: activation.coordinates ?? rawEvent.coordinates,
          officialUrl: activation.url ?? rawEvent.url,
          sourceMetadata: { source: "weekly_event_activation", eventId: rawEvent.id, activationId: activation.id },
        }, stats)
      : defaultVenueId;
    const { rows } = await client.query(
      `insert into public.event_occurrences (
         event_id, legacy_id, title, description, venue_id, city_id, destination_id,
         starts_at, ends_at, starts_on, ends_on, timezone, price_label, booking_url,
         official_url, coordinates, occurrence_order, raw_metadata, source_run_id,
         latest_refresh_source_run_id
       )
       values ($1,$2,$3,$4,$5,$6,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$18)
       returning id`,
      [
        eventId,
        `${rawEvent.id}:${activation.id}`,
        activation.title,
        activation.description ?? rawEvent.description,
        venueId,
        cityId,
        activation.startsAt ?? rawEvent.startsAt ?? null,
        null,
        (activation.startsAt ?? rawEvent.startsAt)?.slice(0, 10) ?? null,
        rawEvent.endsAt?.slice(0, 10) ?? (activation.startsAt ?? rawEvent.startsAt)?.slice(0, 10) ?? null,
        rawEvent.timezone ?? run.timezone,
        rawEvent.price ?? null,
        activation.url ?? rawEvent.url ?? null,
        activation.url ?? rawEvent.url ?? null,
        toJson(normalizeCoordinates(activation.coordinates ?? rawEvent.coordinates)),
        order,
        toJson(activation),
        sourceRunId,
      ],
    );
    stats.eventOccurrences += 1;
    const sourceId = await upsertSource(client, { name: rawEvent.sourceName, url: activation.url ?? rawEvent.url, sourcedAt: run.sourcedAt }, stats);
    await linkSource(client, "event_occurrence", rows[0].id, sourceId, "official");
  }
}

async function upsertWeeklyPublication(client, rawEvent, guide, run, cityId, eventId, entryId, sourceRunId, window, stats) {
  await client.query(
    `insert into public.weekly_event_publications (
       source_run_id, event_id, entry_id, city_id, destination_id, week_start, week_end,
       week_label, sourced_at, submission_type, event_category, has_schedule,
       is_festival, timezone, starts_at, ends_at, rendered_map_list, raw_event
     )
     values ($1,$2,$3,$4,$4,$5,$6,$7,$8,'event',$9,$10,$11,$12,$13,$14,$15,$16)
     on conflict (event_id, week_start) do update set
       source_run_id = excluded.source_run_id,
       entry_id = excluded.entry_id,
       city_id = excluded.city_id,
       destination_id = excluded.destination_id,
       week_end = excluded.week_end,
       week_label = excluded.week_label,
       sourced_at = excluded.sourced_at,
       submission_type = excluded.submission_type,
       event_category = excluded.event_category,
       has_schedule = excluded.has_schedule,
       is_festival = excluded.is_festival,
       timezone = excluded.timezone,
       starts_at = excluded.starts_at,
       ends_at = excluded.ends_at,
       rendered_map_list = excluded.rendered_map_list,
       raw_event = excluded.raw_event`,
    [
      sourceRunId,
      eventId,
      entryId,
      cityId,
      window.start,
      window.end,
      run.weekLabel,
      run.sourcedAt,
      rawEvent.category,
      Boolean(rawEvent.activations?.length),
      Boolean(rawEvent.activations?.length) || rawEvent.category === "Festivals",
      rawEvent.timezone ?? run.timezone,
      rawEvent.startsAt ?? null,
      rawEvent.endsAt ?? null,
      toJson(guide),
      toJson(rawEvent),
    ],
  );
  stats.weeklyEventPublications += 1;
}

async function backfillEventSettings(client, maps, stats) {
  const skipped = [];
  for (const [cityName, countryName, timezone] of TOP_EVENT_CITIES) {
    const cityId = await resolveCityId(maps, cityName, countryName);
    if (!cityId) {
      skipped.push(`${cityName}, ${countryName}`);
      continue;
    }
    await upsertEventCitySetting(client, cityId, slugify(cityName), cityName, timezone, [], stats);
  }
  return skipped;
}

async function backfillWeeklyEvents(client, maps, stats) {
  const runs = loadWeeklyEventRuns();
  const records = loadWeeklyEventGuideRecords();
  const recordsByEventId = new Map(records.map((record) => [record.eventId, record]));
  for (const run of runs) {
    const sample = run.events[0];
    if (!sample) {
      continue;
    }
    const record = recordsByEventId.get(sample.id);
    const cityId = await resolveCityId(maps, run.cityName, record?.guide?.location?.country ?? "Spain");
    if (!cityId) {
      stats.skippedWeeklyRuns.push(run.cityName);
      continue;
    }
    const settingsId = await upsertEventCitySetting(client, cityId, run.cityId, run.cityName, run.timezone, run.sourceStrategy, stats);
    const sourceRun = await upsertEventSourceRun(client, run, cityId, settingsId, stats);
    for (const event of run.events) {
      const eventRecord = recordsByEventId.get(event.id);
      if (!eventRecord) {
        continue;
      }
      const guide = { ...eventRecord.guide, submissionType: "event" };
      const eventRow = await upsertEvent(client, maps, event, guide, run, cityId, sourceRun.id, stats);
      await replaceEventOccurrences(client, maps, event, guide, run, cityId, eventRow.id, eventRow.venueId, sourceRun.id, stats);
      const entryId = await backfillList(client, maps, guide, {
        sourceTable: "weekly_event_publications",
        eventId: eventRow.id,
        metadata: { rawEventId: event.id, sourceRunId: sourceRun.id },
      }, stats);
      await upsertWeeklyPublication(client, event, guide, run, cityId, eventRow.id, entryId, sourceRun.id, sourceRun.window, stats);
    }
  }
}

async function main() {
  loadEnvFile(path.join(ROOT, ".env.local"));
  const databaseUrl = process.env.SUPABASE_DB_URL ?? process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("Missing Supabase database connection string.");
  }

  const geography = loadGeography();
  const editorialLists = addPoiReferencesToGuides(loadEditorialGuideLists());
  const stats = {
    destinations: 0,
    destinationDescriptions: 0,
    sources: 0,
    venues: 0,
    entries: 0,
    entryStops: 0,
    events: 0,
    eventOccurrences: 0,
    eventCitySettings: 0,
    eventSourceRuns: 0,
    weeklyEventPublications: 0,
    skippedTopEventCities: [],
    skippedWeeklyRuns: [],
  };

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
      ? false
      : { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    await client.query("begin");
    const maps = await backfillDestinations(client, geography, editorialLists, stats);
    stats.skippedTopEventCities = await backfillEventSettings(client, maps, stats);
    for (const list of editorialLists) {
      await backfillList(client, maps, list, {
        sourceTable: "editorial_guides",
        metadata: { editorialGuideId: list.id },
      }, stats);
    }
    await backfillWeeklyEvents(client, maps, stats);
    await client.query("commit");
    const counts = await client.query(`
      select 'destinations' as table_name, count(*)::int as count from public.destinations
      union all select 'entries', count(*)::int from public.entries
      union all select 'entry_stops', count(*)::int from public.entry_stops
      union all select 'venues', count(*)::int from public.venues
      union all select 'events', count(*)::int from public.events
      union all select 'event_occurrences', count(*)::int from public.event_occurrences
      union all select 'event_city_publishing_settings', count(*)::int from public.event_city_publishing_settings
      union all select 'event_source_runs', count(*)::int from public.event_source_runs
      union all select 'weekly_event_publications', count(*)::int from public.weekly_event_publications
      union all select 'sources', count(*)::int from public.sources
      union all select 'entity_sources', count(*)::int from public.entity_sources
    `);
    console.log(JSON.stringify({ ok: true, stats, counts: counts.rows }, null, 2));
  } catch (error) {
    await client.query("rollback").catch(() => {});
    console.error("NORMALIZED_BACKFILL_FAILED");
    console.error(error instanceof Error ? error.stack || error.message : error);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}

main();
