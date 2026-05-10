import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import pg from "pg";

import {
  addPoiReferencesToGuides,
  describeEditorialGuideFilters,
  filterEditorialGuides,
  hasEditorialGuideFilters,
  loadEditorialGuideLists,
  parseEditorialGuideArgs,
} from "./editorial-guides-data.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

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

function requireScopedFilters(filters) {
  if (!hasEditorialGuideFilters(filters)) {
    throw new Error("Refusing to backfill all normalized editorial guides. Pass --city, --neighborhood, --id, or --slug.");
  }
}

async function loadDestinationMaps(client) {
  const { rows } = await client.query(
    "select id, scope, name, slug, parent_id, country_name, city_name, legacy_id from public.destinations",
  );
  const cityByName = new Map();
  const countryByName = new Map();
  const neighborhoodsByCity = new Map();

  for (const row of rows) {
    if (row.scope === "country") {
      countryByName.set(normalizeName(row.name), row.id);
    }
    if (row.scope === "city") {
      cityByName.set(`${normalizeName(row.name)}|${normalizeName(row.country_name)}`, row.id);
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

  return { cityByName, countryByName, neighborhoodsByCity };
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
      list.photo ?? null,
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
    await client.query(
      `insert into public.entry_stops (
         entry_id, legacy_id, stop_order, poi_legacy_id, name, description, category,
         destination_id, venue_id, coordinates, photo_url, price_label, price_source,
         booking_url, official_url, journey_date, journey_day, hours, places, metadata
       )
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`,
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
        toJson(normalizeCoordinates(stop.coordinates)),
        stop.photo ?? null,
        stop.price ?? null,
        stop.priceSource ?? null,
        stop.bookingUrl ?? null,
        stop.officialUrl ?? null,
        stop.journeyDate ?? stop.itineraryDate ?? null,
        stop.journeyDay ?? stop.itineraryDay ?? null,
        toJson(stop.hours),
        toJsonArray(stop.places),
        toJsonObject({ source: "editorial_guides" }),
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
  loadEnvFile(path.join(ROOT, ".env.local"));
  loadEnvFile(path.join(ROOT, ".env"));

  const filters = parseEditorialGuideArgs(process.argv.slice(2));
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

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1") ? false : { rejectUnauthorized: false },
  });
  const stats = { entries: 0, entryStops: 0, venues: 0, sources: 0 };

  await client.connect();
  try {
    await client.query("begin");
    const maps = await loadDestinationMaps(client);
    for (const list of selectedGuides) {
      await backfillGuide(client, maps, list, stats);
    }
    await client.query("commit");
    console.log(JSON.stringify({ ok: true, scope: describeEditorialGuideFilters(filters), selectedGuides: selectedGuides.length, stats }, null, 2));
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
