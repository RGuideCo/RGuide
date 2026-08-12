import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

const createdAt = "2026-08-12T00:00:00.000Z";
const checkedAt = "2026-08-12";

const zanzibarLocation = {
  city: "Zanzibar",
  country: "United Republic of Tanzania",
  continent: "Africa",
  scope: "city" as const,
};

const colors: Record<ListCategory, string> = {
  Food: "a16207",
  Nightlife: "7e22ce",
  Nature: "15803d",
  Culture: "9a3412",
  Stay: "0369a1",
  Activities: "be123c",
  Routes: "475569",
  Essentials: "475569",
};

function avatar(category: ListCategory) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <rect width="160" height="160" rx="80" fill="#${colors[category]}" />
      <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Arial, sans-serif" font-size="76" font-weight="700" fill="white">R</text>
    </svg>
  `)}`;
}

function maps(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function daily(open: string, close: string): GuideStop["hours"] {
  const value = `${open}-${close}`;
  return {
    mon: value,
    tue: value,
    wed: value,
    thu: value,
    fri: value,
    sat: value,
    sun: value,
  };
}

type StopOptions = Partial<GuideStop> & {
  officialUrl: string;
  sourcePhoto: string;
  imagePage?: string;
  mapQuery?: string;
  editorialUrls?: string[];
};

function stop(
  id: string,
  name: string,
  coordinates: [number, number],
  description: string,
  options: StopOptions,
): GuideStop {
  const {
    sourcePhoto,
    imagePage,
    mapQuery,
    editorialUrls = [],
    sourceEvidence,
    sourceUrls: extraSourceUrls = [],
    officialUrl,
    bookingUrl,
    priceSource,
    ...rest
  } = options;
  const mapUrl =
    sourceEvidence?.mapUrl ?? maps(mapQuery ?? `${name} Zanzibar Tanzania`);
  const imageEvidence =
    imagePage ?? sourceEvidence?.imageSourceUrl ?? sourcePhoto;
  const evidenceUrls = [
    officialUrl,
    bookingUrl,
    mapUrl,
    imageEvidence,
    ...editorialUrls,
    ...extraSourceUrls,
  ].filter(Boolean) as string[];

  return {
    id,
    name,
    coordinates,
    description,
    photo: sourcePhoto,
    imageSourceUrl: sourcePhoto,
    imageSourceName: imagePage
      ? "Editorial or licensed venue image"
      : "Official venue image",
    sourceUrls: [...new Set(evidenceUrls)],
    sourceEvidence: {
      officialUrl,
      mapUrl,
      currentStatusUrl: officialUrl,
      imageSourceUrl: imageEvidence,
      editorialUrls,
      checkedAt,
      notes:
        "Official, property, current platform, and map evidence checked on 2026-08-12.",
      ...sourceEvidence,
    },
    officialUrl,
    ...(bookingUrl ? { bookingUrl } : {}),
    ...(rest.price ? { priceSource: priceSource ?? officialUrl } : {}),
    ...rest,
  };
}

type VenueSeed = {
  name: string;
  coordinates: [number, number];
  description: string;
  options: StopOptions;
};

const editorial = {
  dining:
    "https://www.tripadvisor.com/Restaurants-g482884-Zanzibar_Island_Zanzibar_Archipelago.html",
  value:
    "https://www.tripadvisor.com/Restaurants-g488129-zfp16-Stone_Town_Zanzibar_City_Zanzibar_Island_Zanzibar_Archipelago.html",
  hotels: "https://www.cntraveller.com/gallery/best-hotels-zanzibar",
  hostels: "https://www.hostelworld.com/hostels/africa/tanzania/r/zanzibar/",
  nightlife: "https://wearetanzania.com/zanzibar/party/zanzibar-nightlife",
  beachBars: "https://wildtosea.com/en/zanzibar/beach-bars/",
  heritage: "https://whc.unesco.org/en/list/173",
  tourism: "https://www.zanzibartourism.go.tz/things-to-do",
};

const venues = {
  rock: {
    name: "The Rock Restaurant Zanzibar",
    coordinates: [-6.1520286, 39.5194052],
    description:
      "A former fishing outpost on a coral outcrop off Michamvi Pingwe, The Rock serves seafood and Swahili-influenced plates with arrival conditions set by the tide.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Seafood", "Swahili", "Italian-influenced"],
      attributeTags: [
        "destination_dining",
        "seafood",
        "scenic_food",
        "reservation_recommended",
      ],
      price: "$$$$",
      hours: daily("12:00 PM", "10:00 PM"),
      officialUrl: "https://www.therockrestaurantzanzibar.com/",
      bookingUrl: "https://www.therockrestaurantzanzibar.com/reservation/",
      sourcePhoto:
        "https://www.therockrestaurantzanzibar.com/wp-content/uploads/2026/06/The-Rock-Zanzibar-2000-sitting-live-music-scaled.jpg",
      editorialUrls: [editorial.dining],
    },
  },
  hurumzi: {
    name: "Emerson on Hurumzi Tea House",
    coordinates: [-6.1610145, 39.1910082],
    description:
      "Hurumzi's rooftop pairs Persian-rug seating and a 360-degree Stone Town view with a fixed Swahili-Omani dinner and live taarab on most evenings.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Zanzibari", "Omani", "Persian-influenced"],
      attributeTags: [
        "destination_dining",
        "scenic_food",
        "live_music",
        "reservation_recommended",
      ],
      price: "$$$",
      hours:
        "Daily dinner guests arrive at 6:00 PM; the single reserved sitting begins at 7:00 PM, with live music tied to the official performance schedule.",
      officialUrl:
        "https://emersonzanzibar.com/restaurants-in-stone-town/emerson-on-hurumzi-tea-house-restaurant/",
      bookingUrl:
        "https://emersonzanzibar.com/restaurants-in-stone-town/restaurant-reservation/",
      sourcePhoto:
        "https://emersonzanzibar.com/wp-content/uploads/2019/10/Tea-House3.jpg",
      editorialUrls: [editorial.dining],
    },
  },
  secretGarden: {
    name: "Secret Garden at Emerson Spice",
    coordinates: [-6.1611953, 39.1920774],
    description:
      "Set in roofless merchant-house ruins, Secret Garden serves Zanzibari-inspired lunch and dinner, with local musicians taking its small stage on scheduled nights.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Zanzibari", "Seafood", "Contemporary"],
      attributeTags: [
        "garden",
        "date_night",
        "live_music",
        "reservation_recommended",
      ],
      price: "$$$",
      hours: daily("12:00 PM", "10:00 PM"),
      officialUrl:
        "https://emersonzanzibar.com/restaurants-in-stone-town/emerson-spice-secret-garden/",
      bookingUrl:
        "https://emersonzanzibar.com/restaurants-in-stone-town/restaurant-reservation/",
      sourcePhoto:
        "https://emersonzanzibar.com/wp-content/uploads/2019/10/Secret-Garden.jpg",
      editorialUrls: [editorial.dining],
    },
  },
  fifth: {
    name: "The Fifth at Upendo House",
    coordinates: [-6.1611018, 39.1904693],
    description:
      "Upendo House's compact rooftop layers an infinity pool, Stone Town roofscape, sushi-led small plates, and polished cocktails above Hurumzi's narrow lanes.",
    options: {
      venueKind: "nightlife",
      foodServiceType: "restaurant",
      cuisineTypes: ["International", "Sushi", "Small plates"],
      nightlifeType: "rooftop_bar",
      musicGenres: ["lounge", "DJ sets"],
      attributeTags: [
        "rooftop_bar",
        "scenic_nightlife",
        "craft_cocktails",
        "reservation_recommended_nightlife",
      ],
      price: "$$$",
      hours: daily("11:00 AM", "10:00 PM"),
      officialUrl: "https://upendozanzibar.com/thefifth/",
      bookingUrl: "https://upendozanzibar.com/contact-us/",
      sourcePhoto:
        "https://upendozanzibar.com/wp-content/uploads/2020/09/Screen-Shot-2020-09-14-at-7.12.27-PM.png",
      editorialUrls: [editorial.nightlife],
    },
  },
  sixDegrees: {
    name: "6 Degrees South",
    coordinates: [-6.1641, 39.1869],
    description:
      "This Shangani waterfront mainstay moves from breezy seafood lunches to sunset drinks and late dinner, with a broad menu grounded in island produce.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Seafood", "International", "Swahili"],
      nightlifeType: "lounge",
      musicGenres: ["lounge"],
      attributeTags: [
        "seafood",
        "scenic_food",
        "lively_food",
        "craft_cocktails",
      ],
      price: "$$$",
      hours: daily("10:00 AM", "12:00 AM"),
      officialUrl: "https://www.6degreessouth.co.tz/",
      sourcePhoto:
        "https://6degreessouth.co.tz/home/wp-content/uploads/elementor/thumbs/6-South-New-Slides-1-q6b43nzohculwy8kchqea0t0v4dpnbk3nanhujfozk.jpg",
      editorialUrls: [editorial.dining],
    },
  },
  beachHouse: {
    name: "Beach House Restaurant & Bar",
    coordinates: [-6.164175, 39.1864517],
    description:
      "Built into the Stone Town seawall beside Park Hyatt, Beach House combines an open Indian Ocean terrace, grills, seafood, and an unusually deep drinks list.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Seafood", "International", "Grill"],
      nightlifeType: "cocktail_bar",
      musicGenres: ["lounge"],
      attributeTags: [
        "seafood",
        "scenic_food",
        "date_night",
        "craft_cocktails",
      ],
      price: "$$$",
      hours: daily("11:00 AM", "11:00 PM"),
      officialUrl: "https://beachhousezanzibar.com/",
      sourcePhoto:
        "https://res.cloudinary.com/wejgrnjqf/image/upload/c_fill,w_1200,h_627,g_center/c_limit,w_1200/f_jpg/q_auto/v1/2cdf540e-1e99-4494-bdb7-a6df373c1e03?_a=BAVAZGID0",
      editorialUrls: [editorial.dining],
    },
  },
  bahari: {
    name: "Bahari Grill & Bar at Zuri Zanzibar",
    coordinates: [-5.7532, 39.2896],
    description:
      "Bahari occupies Zuri's Kendwa beachfront, serving grilled fish and lunch close to the sand before scheduled barbecue dinners on selected evenings.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Seafood", "Grill", "Zanzibari"],
      nightlifeType: "lounge",
      musicGenres: ["lounge"],
      attributeTags: [
        "beach",
        "seafood",
        "scenic_food",
        "reservation_recommended",
      ],
      price: "$$$",
      hours:
        "Daily drinks 10:00 AM-10:00 PM and lunch 11:00 AM-5:00 PM; booked BBQ dinner runs 7:30 PM-10:00 PM on the current property schedule.",
      officialUrl: "https://www.zurizanzibar.com/culinary/",
      bookingUrl: "https://www.zurizanzibar.com/contact/",
      sourcePhoto:
        "https://www.zurizanzibar.com/media-assets/beach-restaurant-bar-desktop-1800px.jpg",
      editorialUrls: [editorial.dining],
    },
  },
  maisha: {
    name: "Maisha Resto & Bar at Zuri Zanzibar",
    coordinates: [-5.753, 39.2899],
    description:
      "Maisha wraps Zuri's infinity pool with shaded tables, light lunches, drinks, and a rotating evening menu that changes with the resort's weekly plan.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Mediterranean", "International", "Zanzibari"],
      nightlifeType: "lounge",
      musicGenres: ["lounge"],
      attributeTags: [
        "scenic_food",
        "casual",
        "group_friendly",
        "reservation_recommended",
      ],
      price: "$$$",
      hours:
        "Daily drinks 10:00 AM-10:00 PM, lunch 11:00 AM-4:00 PM, and dinner 7:00 PM-10:00 PM under the current property schedule.",
      officialUrl: "https://www.zurizanzibar.com/culinary/",
      bookingUrl: "https://www.zurizanzibar.com/contact/",
      sourcePhoto:
        "https://www.zurizanzibar.com/media-assets/pool-restaurant-bar-desktop-1800px.jpg",
      editorialUrls: [editorial.dining],
    },
  },
  jetty: {
    name: "The Jetty at Essque Zalu",
    coordinates: [-5.7243555, 39.3070508],
    description:
      "Essque Zalu's long timber jetty projects over the Nungwi shallows for seafood, cocktails, shisha, and both sunrise and sunset views from one table.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Seafood", "International", "Grill"],
      nightlifeType: "lounge",
      musicGenres: ["lounge"],
      attributeTags: [
        "destination_dining",
        "seafood",
        "scenic_nightlife",
        "reservation_recommended",
      ],
      price: "$$$",
      hours: {
        mon: "Closed under the official low-season schedule from March 16, 2026",
        tue: "Closed under the official low-season schedule from March 16, 2026",
        wed: "Closed under the official low-season schedule from March 16, 2026",
        thu: "10:00 AM-11:00 PM",
        fri: "10:00 AM-11:00 PM",
        sat: "10:00 AM-11:00 PM",
        sun: "10:00 AM-11:00 PM",
      },
      officialUrl: "https://www.essquehotels.com/eat-drink",
      bookingUrl: "https://www.essquehotels.com/contact-us",
      sourcePhoto:
        "https://www.essquehotels.com/media/essque-zalu-zanzibar-banner39.webp",
      editorialUrls: [editorial.dining],
    },
  },
  maru: {
    name: "Maru Maru Terrace Restaurant",
    coordinates: [-6.161821, 39.1897981],
    description:
      "Maru Maru's roof terrace looks across Stone Town's minarets and waterfront while serving Swahili, Indian, and continental dishes beside its small pool.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Swahili", "Indian", "International"],
      nightlifeType: "rooftop_bar",
      musicGenres: ["taarab", "lounge"],
      attributeTags: [
        "rooftop_bar",
        "scenic_food",
        "live_music",
        "walk_in_friendly",
      ],
      price: "$$",
      hours: daily("7:00 AM", "11:00 PM"),
      officialUrl: "https://www.marumaruzanzibar.com/the-terrace-restaurant/",
      sourcePhoto:
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/155457906.jpg?k=7a5e3283c6d0c1de48914457b3dc210eb70a401c99492f29044adff05c1c6615&o=",
      imagePage: "https://www.booking.com/hotel/tz/maru-maru.html",
      editorialUrls: [editorial.dining],
    },
  },
} satisfies Record<string, VenueSeed>;

function venueStop(
  id: string,
  key: keyof typeof venues,
  override: Partial<GuideStop> = {},
) {
  const venue = venues[key];
  return stop(
    id,
    venue.name,
    venue.coordinates,
    override.description ?? venue.description,
    { ...venue.options, ...override },
  );
}

const cheapEatStops = [
  stop(
    "zanzibar-cheap-lukmaan",
    "Lukmaan Restaurant",
    [-6.1634188, 39.1916368],
    "Lukmaan's open-air counter beneath a Mkunazini baobab is built for pilau, biryani, grilled seafood, curries, and fast-moving Zanzibari lunch plates.",
    {
      venueKind: "food_drink",
      foodServiceType: "counter_service",
      cuisineTypes: ["Zanzibari", "Swahili", "East African"],
      attributeTags: [
        "local_favorite",
        "budget_food",
        "walk_in_friendly",
        "halal",
      ],
      price: "$",
      hours: daily("8:00 AM", "10:00 PM"),
      officialUrl:
        "https://www.tripadvisor.com/Restaurant_Review-g488129-d2395394-Reviews-Lukmaan_Restaurant-Stone_Town_Zanzibar_City_Zanzibar_Island_Zanzibar_Archipelago.html",
      sourcePhoto:
        "https://anjaonadventure.com/wp-content/uploads/2023/10/lukmaan-restaurant.jpg",
      imagePage:
        "https://anjaonadventure.com/best-things-to-do-in-stone-town-zanzibar/",
      editorialUrls: [editorial.value],
    },
  ),
  stop(
    "zanzibar-cheap-coffee-house",
    "Zanzibar Coffee House",
    [-6.1616812, 39.1921857],
    "This 1895 merchant house roasts Tanzanian beans downstairs and sends coffee drinkers to an antique rooftop for cakes, wraps, and Mkunazini views.",
    {
      venueKind: "food_drink",
      foodServiceType: "cafe",
      cuisineTypes: ["Cafe", "Tanzanian coffee", "Light meals"],
      attributeTags: ["coffee", "breakfast", "rooftop", "walk_in_friendly"],
      price: "$",
      hours: daily("8:30 AM", "6:00 PM"),
      officialUrl: "https://www.utengule.com/zanzibar-coffee-house",
      sourcePhoto:
        "https://static.wixstatic.com/media/7006bf_692b51b04dfe484b924631a9a173270a%7Emv2.jpg/v1/fit/w_2500,h_1330,al_c/7006bf_692b51b04dfe484b924631a9a173270a%7Emv2.jpg",
      editorialUrls: [editorial.value],
    },
  ),
  stop(
    "zanzibar-cheap-puzzle",
    "Puzzle Coffee Shop",
    [-6.1638631, 39.1871026],
    "Puzzle brings Brazilian coffee technique to a small Shangani room, with careful espresso, cheese bread, pastries, and table games for a shaded pause.",
    {
      venueKind: "food_drink",
      foodServiceType: "cafe",
      cuisineTypes: ["Cafe", "Brazilian", "Pastries"],
      attributeTags: ["coffee", "bakery", "work_friendly", "walk_in_friendly"],
      price: "$",
      hours: daily("8:00 AM", "6:00 PM"),
      officialUrl: "http://www.puzzlecoffeeshop.com/",
      sourcePhoto:
        "https://itin-dev.wanderlogstatic.com/freeImageSmall/7dExGd8uzNgLUp4PiZR3zp6ymK6Ac0Bb",
      imagePage:
        "https://wanderlog.com/place/details/1557561/puzzle-coffee-shop",
      editorialUrls: [editorial.value],
    },
  ),
  stop(
    "zanzibar-cheap-stone-town-cafe",
    "Stone Town Cafe",
    [-6.1633243, 39.1877993],
    "A long-running Kenyatta Road cafe handles breakfast, fresh juices, wraps, curries, and coffee from early morning through dinner without hotel formality.",
    {
      venueKind: "food_drink",
      foodServiceType: "cafe",
      cuisineTypes: ["Zanzibari", "Cafe", "International"],
      attributeTags: ["breakfast", "budget_food", "casual", "walk_in_friendly"],
      price: "$",
      hours: daily("8:00 AM", "11:00 PM"),
      officialUrl:
        "https://wanderlog.com/place/details/1174164/stone-town-cafe",
      sourcePhoto:
        "https://itin-dev.wanderlogstatic.com/freeImageSmall/7dExGd8uzNgLUp4PiZR3zp6ymK6Ac0Bb",
      imagePage: "https://wanderlog.com/place/details/1174164/stone-town-cafe",
      editorialUrls: [editorial.value],
    },
  ),
  stop(
    "zanzibar-cheap-forodhani",
    "Forodhani Gardens Night Market",
    [-6.1605962, 39.1887981],
    "After sunset, Forodhani's waterfront fills with independent grills selling skewers, Zanzibar pizza, cassava, sugarcane juice, and seafood at negotiable stall prices.",
    {
      venueKind: "food_drink",
      foodServiceType: "stall",
      cuisineTypes: ["Zanzibari", "Street food", "Seafood"],
      attributeTags: ["street_food", "market", "budget_food", "lively_food"],
      price: "$",
      hours:
        "Daily from 6:00 PM; individual vendor service follows the evening market and weather schedule.",
      officialUrl: "https://www.zanzibartourism.go.tz/things-to-do",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Forodhani_jubilee_gardens_Zanzibar.jpg/960px-Forodhani_jubilee_gardens_Zanzibar.jpg",
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Forodhani_jubilee_gardens_Zanzibar.jpg",
      editorialUrls: [editorial.value, editorial.heritage],
    },
  ),
  stop(
    "zanzibar-cheap-darajani",
    "Darajani Market",
    [-6.1622107, 39.1937312],
    "Stone Town's main working market is strongest early for fruit, spices, bread, fish, and butcher counters, with simple snack sellers around its edges.",
    {
      venueKind: "retail",
      foodServiceType: "stall",
      cuisineTypes: ["Market food", "Zanzibari", "Produce"],
      attributeTags: ["market", "street_food", "budget_food", "local_favorite"],
      price: "$",
      hours: daily("6:00 AM", "6:00 PM"),
      officialUrl: "https://whc.unesco.org/en/list/173",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Darajani_Market_%2CZanzibar.jpg/960px-Darajani_Market_%2CZanzibar.jpg",
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Darajani_Market_,Zanzibar.jpg",
      editorialUrls: [editorial.value, editorial.heritage],
    },
  ),
  stop(
    "zanzibar-cheap-krishna",
    "Krishna Food House",
    [-6.1614, 39.1891],
    "Krishna is a no-frills vegetarian Indian dining room near Forodhani, useful for thali, dal, paneer, roti, lassi, and Jain-friendly requests.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Indian", "Vegetarian", "Jain-friendly"],
      attributeTags: [
        "vegetarian_friendly",
        "budget_food",
        "casual",
        "walk_in_friendly",
      ],
      price: "$",
      hours: {
        mon: "8:30 AM-10:00 PM",
        tue: "8:30 AM-10:00 PM",
        wed: "8:30 AM-10:00 PM",
        thu: "8:30 AM-10:00 PM",
        fri: "8:30 AM-10:00 PM",
        sat: "8:30 AM-10:00 PM",
        sun: "8:00 AM-10:00 PM",
      },
      officialUrl:
        "https://wanderlog.com/place/details/1174206/krishna-food-house",
      sourcePhoto:
        "https://itin-dev.wanderlogstatic.com/freeImageSmall/B7mJFOmawlQF3Gm7eoZXQBg4fyDn0LMt",
      imagePage:
        "https://wanderlog.com/place/details/1174206/krishna-food-house",
      editorialUrls: [editorial.value],
    },
  ),
  stop(
    "zanzibar-cheap-ma-shaa-allah",
    "Ma Shaa Allah Cafe",
    [-6.1634016, 39.1913925],
    "Ma Shaa Allah runs as an unfussy local cafe for biryani, grilled chicken, seafood, chapati, juices, and filling rice plates near Mkunazini.",
    {
      venueKind: "food_drink",
      foodServiceType: "counter_service",
      cuisineTypes: ["Zanzibari", "Swahili", "East African"],
      attributeTags: [
        "local_favorite",
        "budget_food",
        "halal",
        "walk_in_friendly",
      ],
      price: "$",
      hours: daily("7:00 AM", "10:00 PM"),
      officialUrl:
        "https://www.booknbook.africa/restaurant/ma-shaa-allah-cafe/profile",
      sourcePhoto:
        "https://www.booknbook.africa/storage/public/restaurants/2538-ma-shaa-allah-cafe/profile/125408828_1323107078036656_268488997759862129_n.jpg",
      editorialUrls: [editorial.value],
    },
  ),
  stop(
    "zanzibar-cheap-lazuli",
    "Lazuli Cafe",
    [-6.1630602, 39.1879005],
    "Tiny Lazuli makes juices and smoothies to order, backed by salads, curries, seafood, and vegetarian plates in a colorful Shangani room.",
    {
      venueKind: "food_drink",
      foodServiceType: "cafe",
      cuisineTypes: ["Zanzibari", "Vegetarian", "Juice bar"],
      attributeTags: [
        "vegetarian_friendly",
        "budget_food",
        "casual",
        "walk_in_friendly",
      ],
      price: "$",
      hours: {
        default:
          "Open Monday–Saturday for lunch and dinner; current meal periods, including any afternoon pause, are confirmed by phone on the current Tripadvisor property page. Closed Sunday.",
      },
      officialUrl:
        "https://www.tripadvisor.com/Restaurant_Review-g488129-d1982267-Reviews-Lazuli-Stone_Town_Zanzibar_City_Zanzibar_Island_Zanzibar_Archipelago.html",
      sourcePhoto:
        "https://media-cdn.tripadvisor.com/media/photo-m/1280/16/fa/34/6b/photo0jpg.jpg",
      imagePage:
        "https://www.tripadvisor.com/Restaurant_Review-g488129-d1982267-Reviews-Lazuli-Stone_Town_Zanzibar_City_Zanzibar_Island_Zanzibar_Archipelago.html",
      editorialUrls: [editorial.value],
    },
  ),
  stop(
    "zanzibar-cheap-mapacha",
    "Mapacha Street Food Court",
    [-6.2667664, 39.5317833],
    "Eight independently run kiosks share a tree-shaded Paje court, covering fried chicken, pasta, burgers, pizza, vegan bowls, seafood, pastries, and a central bar.",
    {
      venueKind: "food_drink",
      foodServiceType: "fast_casual",
      cuisineTypes: ["Street food", "International", "Zanzibari"],
      attributeTags: [
        "street_food",
        "group_friendly",
        "budget_food",
        "walk_in_friendly",
      ],
      price: "$",
      hours: daily("7:00 AM", "11:45 PM"),
      officialUrl: "https://www.mapacha-zanzibar.com/",
      sourcePhoto:
        "https://static.wixstatic.com/media/b630f1_ed7d170846d947918234194f554cb1e2~mv2.jpeg/v1/fill/w_1000,h_1333,al_c,q_85/IMG_7823.jpeg",
      editorialUrls: [editorial.value],
    },
  ),
];

const hotelStops = [
  stop(
    "zanzibar-hotel-park-hyatt",
    "Park Hyatt Zanzibar",
    [-6.1624587, 39.1861058],
    "Park Hyatt joins the restored Mambo Msiige mansion to a contemporary seafront wing, placing 67 rooms, an infinity pool, and spa inside Stone Town.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["luxury", "central", "design", "scenic"],
      price: "$$$$",
      hours:
        "Daily lodging; check-in from 3:00 PM and check-out by 12:00 PM under the official property page.",
      officialUrl:
        "https://www.hyatt.com/park-hyatt/en-US/znzph-park-hyatt-zanzibar",
      bookingUrl:
        "https://www.hyatt.com/park-hyatt/en-US/znzph-park-hyatt-zanzibar/rooms",
      sourcePhoto:
        "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2015/02/16/1448/Park-Hyatt-Zanzibar-P040-Exterior.jpg/Park-Hyatt-Zanzibar-P040-Exterior.16x9.jpg",
      editorialUrls: [editorial.hotels],
    },
  ),
  stop(
    "zanzibar-hotel-zuri",
    "Zuri Zanzibar",
    [-5.7532, 39.2896],
    "Zuri spreads 56 design-led bungalows, suites, and villas through a dense spice garden above Kendwa's west-facing, comparatively swim-friendly beach.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["luxury", "beach", "design", "wellness"],
      price: "$$$$",
      hours:
        "Daily lodging; check-in from 2:00 PM and check-out by 11:00 AM under the official property page.",
      officialUrl: "https://www.zurizanzibar.com/",
      bookingUrl: "https://www.zurizanzibar.com/info/",
      sourcePhoto:
        "https://www.zurizanzibar.com/media-assets/poster-desktop-2-2024-1800px.jpg",
      editorialUrls: [editorial.hotels],
    },
  ),
  stop(
    "zanzibar-hotel-residence",
    "The Residence Zanzibar",
    [-6.4105436, 39.4522706],
    "The Residence is a villa-only retreat across 32 hectares of Menai Bay coast, with private pools, bicycles, a mile-long beach, and broad resort facilities.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["luxury", "beach", "quiet", "wellness"],
      price: "$$$$",
      hours:
        "Daily lodging; check-in from 3:00 PM and check-out by 12:00 PM under the property booking page.",
      officialUrl: "https://www.cenizaro.com/theresidence/zanzibar",
      sourcePhoto: "https://www.cenizaro.com/images/zanzibar/home-masthead.jpg",
      editorialUrls: [editorial.hotels],
    },
  ),
  stop(
    "zanzibar-hotel-baraza",
    "Baraza Resort & Spa",
    [-6.1907692, 39.5350425],
    "Baraza's 30 all-inclusive villas use white arches, brass lanterns, carved furniture, and plunge pools to reinterpret a Swahili sultan's palace on Bwejuu Beach.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["luxury", "beach", "romantic", "wellness"],
      price: "$$$$",
      hours:
        "Daily lodging; check-in from 2:00 PM and check-out by 10:30 AM under the property booking page.",
      officialUrl: "https://www.baraza-zanzibar.com/",
      sourcePhoto:
        "https://www.tailormadeafrica.com/wp-content/uploads/Baraza-1.jpeg",
      imagePage:
        "https://www.tailormadeafrica.com/tanzania-safari/islands-coasts/baraza/",
      editorialUrls: [editorial.hotels],
    },
  ),
  stop(
    "zanzibar-hotel-zawadi",
    "Zawadi Hotel",
    [-6.1951, 39.545],
    "Adults-only Zawadi keeps its scale to 12 large oceanfront villas, each with a plunge pool, above a coral cove that remains swimmable across tides.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["luxury", "romantic", "quiet", "beach"],
      price: "$$$$",
      hours:
        "Daily lodging; check-in from 2:00 PM and check-out by 11:00 AM under the property booking page.",
      officialUrl: "https://www.zawadihotel.com/",
      sourcePhoto:
        "https://cdn.audleytravel.com/1400/999/60/1017805-reception-area-zawadi.jpg",
      imagePage:
        "https://www.audleytravel.com/zanzibar-archipelago/accommodation/zawadi",
      editorialUrls: [editorial.hotels],
    },
  ),
  stop(
    "zanzibar-hotel-xanadu",
    "Xanadu Luxury Villas & Retreat",
    [-6.1943, 39.5366],
    "Nine individually composed villas sit around Xanadu's palm-framed pool and Dongwe beach, supported by private dining, a spa, and a traditional sailing dhow.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["luxury", "romantic", "design", "beach"],
      price: "$$$$",
      hours:
        "Daily lodging; check-in from 2:00 PM and check-out by 11:00 AM under the property booking page.",
      officialUrl: "https://xanadu-villas.com/",
      sourcePhoto:
        "https://xanadu-villas.com/files/image/video/xanadu-header-2026-poster-mobile.jpg",
      editorialUrls: [editorial.hotels],
    },
  ),
  stop(
    "zanzibar-hotel-tulia",
    "Tulia Zanzibar Unique Beach Resort",
    [-6.0346147, 39.4065287],
    "Tulia is a compact Pongwe resort with tropical gardens, a private beach section, villas, a water slide, and an all-inclusive approach to dining and activities.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["luxury", "beach", "wellness", "family_friendly"],
      price: "$$$$",
      hours:
        "Daily lodging; check-in from 2:00 PM and check-out by 11:00 AM under the property booking page.",
      officialUrl: "https://tuliazanzibar.com/",
      sourcePhoto:
        "https://tuliazanzibar.com/wp-content/uploads/2020/05/Tulia-Zanzibar-Share-Screen-square-e1588952373395.png",
      editorialUrls: [editorial.hotels],
    },
  ),
  stop(
    "zanzibar-hotel-z",
    "The Z Hotel",
    [-5.7302896, 39.2918206],
    "The Z places contemporary rooms, a narrow pool, and a popular sunset restaurant directly on Nungwi's busy western beach, close to village nightlife.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["beach", "lively", "design", "central"],
      price: "$$$",
      hours:
        "Daily lodging; check-in from 2:00 PM and check-out by 11:00 AM under the property booking page.",
      officialUrl: "https://www.thezhotel.com/",
      sourcePhoto:
        "https://assets.website-files.com/55b78a87c546b3a07fb2c763/58ad994dfa81a5c54c778893_The%20Z%20hotel%20Zanzibar%20beach%20at%20Nungwi-1.jpg",
      editorialUrls: [editorial.hotels],
    },
  ),
  stop(
    "zanzibar-hotel-emerson-spice",
    "Emerson Spice",
    [-6.1611953, 39.1920774],
    "Eleven theatrical rooms occupy a restored Stone Town merchant house, with a roof tea house, ruin garden, gallery programming, and unusually close ties to local musicians.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["design", "central", "romantic", "local_favorite"],
      price: "$$$",
      hours:
        "Daily lodging; check-in from 2:00 PM and check-out by 11:00 AM under the property booking page.",
      officialUrl:
        "https://emersonzanzibar.com/emerson-spice-hotel-stone-town/",
      bookingUrl: "https://emersonzanzibar.com/book-a-room/",
      sourcePhoto:
        "https://emersonzanzibar.com/wp-content/uploads/2021/08/1-emerson-spice.jpeg",
      editorialUrls: [editorial.hotels],
    },
  ),
  stop(
    "zanzibar-hotel-white-sand",
    "Zanzibar White Sand Luxury Villas & Spa",
    [-6.2807652, 39.5361642],
    "White Sand's freestanding Paje villas emphasize private pools, broad plots, renewable-energy systems, a spa, and direct access to one of Unguja's principal kite lagoons.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["luxury", "beach", "wellness", "design"],
      price: "$$$$",
      hours:
        "Daily lodging; check-in from 2:00 PM and check-out by 11:00 AM under the property booking page.",
      officialUrl: "https://www.whitesandvillas.com/",
      sourcePhoto: "https://whitesandvillas.com/og-image-social.jpg",
      editorialUrls: [editorial.hotels],
    },
  ),
];

const hostelStops = [
  stop(
    "zanzibar-hostel-jambiani-backpackers",
    "Jambiani Backpackers Hostel",
    [-6.3049, 39.5474],
    "This purpose-built Jambiani hostel combines curtained air-conditioned dorm beds, a pool, breakfast, keypad room access, private rooms, and an inexpensive hammock tier.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "social", "solo_friendly", "beach"],
      price: "$",
      hours:
        "Daily reception 6:00 AM-12:00 AM; check-in 2:00 PM-11:00 PM and check-out by 11:00 AM.",
      officialUrl:
        "https://www.hostelworld.com/hostels/p/317201/jambiani-backpackers-hostel/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/317201/jambiani-backpackers-hostel/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/317201/vzjza4ejvgwhn9pkwuw5.jpg",
      editorialUrls: [editorial.hostels],
    },
  ),
  stop(
    "zanzibar-hostel-new-teddys",
    "New Teddy's on the Beach",
    [-6.326, 39.5507],
    "New Teddy's is a sand-floor resort-hostel in Jambiani with beachfront dorms, private bungalows, an 18-meter pool, breakfast, hammocks, and a sociable but restrained bar.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "beach", "social", "relaxing"],
      price: "$",
      hours:
        "Daily arrivals 12:00 AM-11:00 PM through the bar reception, which serves until about 12:00 AM; check-out by 10:30 AM.",
      officialUrl: "https://newteddysonthebeach.com/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/292698/new-teddy-s-on-the-beach/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/292698/fcgeqxxblkav2tnupsdc.jpg",
      imagePage:
        "https://www.hostelworld.com/hostels/p/292698/new-teddy-s-on-the-beach/",
      editorialUrls: [editorial.hostels],
    },
  ),
  stop(
    "zanzibar-hostel-drifters",
    "Drifters Backpackers",
    [-6.2724097, 39.5361124],
    "Drifters opens directly onto Paje Beach, pairing simple dorms with a sea-facing bar, pool, regular bonfires, backup power, and an overtly social traveler crowd.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "beach", "social", "party"],
      price: "$",
      hours:
        "Daily check-in 12:00 PM-11:00 PM and check-out by 12:00 PM under the current property booking page.",
      officialUrl: "https://www.drifterszanzibar.com/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/100945/drifters-backpackers/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/1/100945/wvlvvqw2uqlrdbttjbps.jpg",
      imagePage:
        "https://www.hostelworld.com/hostels/p/100945/drifters-backpackers/",
      editorialUrls: [editorial.hostels],
    },
  ),
  stop(
    "zanzibar-hostel-your-place",
    "Your Zanzibar Place",
    [-6.2727655, 39.5354733],
    "Palm-woven bandas, shared facilities, breakfast, a bar, games, and daily social events make this Paje veteran more communal than polished, minutes from the beach.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "social", "party", "beach"],
      price: "$",
      hours:
        "Daily check-in 2:00 PM-11:30 PM, check-out by 11:00 AM, and meal service 8:00 AM-10:30 PM.",
      officialUrl:
        "https://www.hostelworld.com/hostels/p/56827/your-zanzibar-place/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/56827/your-zanzibar-place/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/5/56827/lmter5c4z7wkvmmjjfuj.jpg",
      editorialUrls: [editorial.hostels],
    },
  ),
  stop(
    "zanzibar-hostel-kameleon",
    "Kameleon Blue Arts Lodge",
    [-6.4594015, 39.4790396],
    "Kameleon Blue's Kizimkazi garden holds private villas, rooms, one social dorm, a pool, amphitheater bar, yoga, massage, and recurring live-music nights.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "quiet", "social", "live_music"],
      price: "$",
      hours:
        "Daily check-in 1:00 PM-11:00 PM and check-out by 11:00 AM under the current property booking page.",
      officialUrl:
        "https://www.hostelworld.com/hostels/p/316416/kameleon-blue-arts-lodge/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/316416/kameleon-blue-arts-lodge/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/316416/iwvrs76q1qohgkvwxah7.jpg",
      editorialUrls: [editorial.hostels],
    },
  ),
  stop(
    "zanzibar-hostel-mkunazini",
    "Mkunazini Heritage Hostels",
    [-6.1645, 39.1914],
    "This small current hostel sits deep in Stone Town near the cathedral and Darajani, prioritizing central dorm lodging, lockers, air conditioning, and a common room.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "central", "solo_friendly", "social"],
      price: "$",
      hours:
        "Daily check-in 1:00 PM-11:00 PM and check-out by 11:00 AM under the current property booking page.",
      officialUrl:
        "https://www.hostelworld.com/hostels/p/336255/mkunazini-heritage-hostels/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/336255/mkunazini-heritage-hostels/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/336255/hqqqy4mwql62uwp69c0u.jpg",
      editorialUrls: [editorial.hostels],
    },
  ),
  stop(
    "zanzibar-hostel-nomad",
    "NOMAD Hostel Stone Town",
    [-6.1628, 39.1883],
    "NOMAD's air-conditioned dorms occupy a central Baghani building with a garden courtyard, communal breakfast, kitchen access, and easy walking access to the old city's landmarks.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "central", "social", "solo_friendly"],
      price: "$",
      hours:
        "Daily check-in from 2:00 PM and check-out by 11:00 AM under the official property booking page.",
      officialUrl: "https://www.nomadhostelstonetown.com/",
      bookingUrl:
        "https://www.booking.com/hotel/tz/nomad-hostel-stone-town.html",
      sourcePhoto:
        "https://static.wixstatic.com/media/d2cfdc_ef812220653240598c92971a0c67488e~mv2.jpg/v1/fill/w_6000%2Ch_4000%2Cal_c%2Cq_90%2Cenc_auto/d2cfdc_ef812220653240598c92971a0c67488e~mv2.jpg",
      editorialUrls: [editorial.hostels],
    },
  ),
  stop(
    "zanzibar-hostel-zlife",
    "zLife Stone Town",
    [-6.1619, 39.1894],
    "A planted Gizenga Street courtyard anchors zLife's dorms and private rooms, shared kitchen, lounge, accessible facilities, and pet-friendly policy near Forodhani.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "central", "accessible", "pet_friendly"],
      price: "$",
      hours:
        "Daily check-in 2:00 PM-11:30 PM and check-out 10:00 AM-11:00 AM under the current property booking page.",
      officialUrl: "https://www.booking.com/hotel/tz/zlife-hostel.html",
      bookingUrl: "https://www.booking.com/hotel/tz/zlife-hostel.html",
      sourcePhoto:
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/331836380.jpg?k=dba364bef426a0b9ae9460764491251eb6549351b75112ebfb6b91f9d460a080&o=",
      editorialUrls: [editorial.hostels],
    },
  ),
  stop(
    "zanzibar-hostel-lost-found",
    "Lost & Found Zanzibar",
    [-6.1625958, 39.1876759],
    "Lost & Found fits curtained pod bunks and numbered lockers into a narrow Kenyatta Road property, a practical setup steps from Shangani and the waterfront.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "central", "solo_friendly", "social"],
      price: "$",
      hours:
        "Daily check-in 2:30 PM-11:00 PM and check-out by 11:00 AM under the current property booking page.",
      officialUrl:
        "https://www.booking.com/hotel/tz/lost-amp-found-zanzibar.html",
      bookingUrl:
        "https://www.booking.com/hotel/tz/lost-amp-found-zanzibar.html",
      sourcePhoto:
        "https://q-xx.bstatic.com/xdata/images/hotel/840x460/563216343.jpg?k=e894179b240104f45e3c35de11cff49525da8fc097441287422651d0358e30ee&o=",
      editorialUrls: [editorial.hostels],
    },
  ),
  stop(
    "zanzibar-hostel-bottoms-up",
    "Bottoms Up",
    [-6.1612512, 39.1907768],
    "Bottoms Up uses a central Stone Town townhouse for dorms and simple private rooms, adding a rooftop terrace with sea and old-city views.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "central", "rooftop", "social"],
      price: "$",
      hours:
        "Daily check-in 12:00 PM-10:00 PM and check-out 10:00 AM-11:00 AM under the current property booking page.",
      officialUrl: "https://www.booking.com/hotel/tz/bottoms-up.html",
      bookingUrl: "https://www.booking.com/hotel/tz/bottoms-up.html",
      sourcePhoto:
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/187740385.jpg?hp=1&k=bab66336bbaf7e6766af110f6c4d803d24b3c687de49a10febec4aa36083b94e&o=",
      imagePage: "https://housity.net/hotel/bottoms-up/",
      editorialUrls: [editorial.hostels],
    },
  ),
];

const barVenues = {
  gerrys: {
    name: "Gerry's Bar",
    coordinates: [-5.7238779, 39.2958512],
    description:
      "Gerry's is a sandy Nungwi beach bar with low-key daytime drinks, sunset happy hour, open-mic sessions, and live local bands rather than club production.",
    options: {
      venueKind: "nightlife",
      nightlifeType: "live_music_venue",
      musicGenres: ["acoustic", "reggae", "open mic"],
      attributeTags: ["local_bar", "live_music", "beach", "casual_nightlife"],
      price: "$$",
      hours: daily("10:00 AM", "12:00 AM"),
      officialUrl: "https://gerrysbar.com/",
      sourcePhoto:
        "https://gerrysbar.com/wp-content/uploads/2019/11/cropped-GB-Cocktail-O-1440-x-500.jpg",
      editorialUrls: [editorial.beachBars],
    },
  },
  b4: {
    name: "B4 Beach Club",
    coordinates: [-6.2740421, 39.5360828],
    description:
      "B4 gives Paje's electronic-music crowd a beachfront base for burgers, a pool, treehouse decks, and international or regional DJs on programmed nights.",
    options: {
      venueKind: "nightlife",
      nightlifeType: "club",
      musicGenres: ["house", "afro house", "electronic"],
      attributeTags: ["beach", "dj_sets", "party_nightlife", "dance_floor"],
      price: "$$",
      hours:
        "Daily venue service 9:00 AM-11:00 PM; ticketed and late DJ sessions follow the official event calendar.",
      officialUrl: "https://www.b4beach.club/",
      sourcePhoto:
        "https://www.zanzibar.com/media-assets/B4-Beach-Club-Paje-992-1.jpg",
      imagePage: "https://www.zanzibar.com/places/b4-beach-club/",
      editorialUrls: [editorial.nightlife],
    },
  },
  kendwaRocks: {
    name: "Kendwa Rocks",
    coordinates: [-5.7523986, 39.2878678],
    description:
      "Kendwa Rocks is the island's durable large-format party address, combining a daily beach bar, late Rocks Lounge sessions, and a monthly official Full Moon event.",
    options: {
      venueKind: "nightlife",
      nightlifeType: "club",
      musicGenres: ["afrobeats", "house", "dancehall"],
      attributeTags: ["beach", "party_nightlife", "dance_floor", "dj_sets"],
      price: "$$",
      hours: {
        mon: "10:00 AM-11:00 PM",
        tue: "10:00 AM-2:00 AM; Rocks Lounge from 10:00 PM",
        wed: "10:00 AM-11:00 PM",
        thu: "10:00 AM-2:00 AM; Rocks Lounge from 10:00 PM",
        fri: "10:00 AM-11:00 PM",
        sat: "10:00 AM-2:00 AM; Rocks Lounge from 10:00 PM",
        sun: "10:00 AM-11:00 PM",
      },
      officialUrl: "https://www.kendwarocks.com/",
      bookingUrl: "https://www.kendwarocks.com/full-moon-party",
      sourcePhoto:
        "https://www.kendwarocks.com/media/kendwa-rocks-beach-hotel-hoteldji_20250612162702_0094_d.webp",
      editorialUrls: [editorial.nightlife],
    },
  },
  driftersBar: {
    name: "Drifters Bar",
    coordinates: [-6.2724097, 39.5361124],
    description:
      "The sea-facing bar inside Drifters Backpackers is deliberately social, drawing Paje travelers to inexpensive drinks, pool time, beach bonfires, and informal late conversations.",
    options: {
      venueKind: "nightlife",
      nightlifeType: "pub",
      musicGenres: ["reggae", "acoustic", "mixed"],
      attributeTags: ["cheap_drinks", "beach", "social", "casual_nightlife"],
      price: "$",
      hours: daily("8:00 AM", "11:00 PM"),
      officialUrl: "https://www.drifterszanzibar.com/",
      sourcePhoto:
        "https://b-cdn.springnest.com/media/img/mv/img-5055db559e0.jpg?aspect_ratio=1200%3A630&width=1200",
      editorialUrls: [editorial.beachBars],
    },
  },
  pajeByNight: {
    name: "Paje by Night",
    coordinates: [-6.2685785, 39.5353554],
    description:
      "Paje by Night's pool, restaurant, and bar form a long-running village meeting point, with scheduled live sets and parties supplementing ordinary dinner evenings.",
    options: {
      venueKind: "nightlife",
      nightlifeType: "live_music_venue",
      musicGenres: ["afrobeats", "reggae", "electronic"],
      attributeTags: [
        "live_music",
        "social",
        "lively_nightlife",
        "dance_floor",
      ],
      price: "$$",
      hours:
        "Daily bar and restaurant service 7:00 AM-11:00 PM; later performances follow the official event calendar.",
      officialUrl: "https://pajebynight.net/",
      sourcePhoto:
        "https://pajebynight.net/wp-content/uploads/2026/07/dji_fly_20260711_172536_759_1783763057796_photo_optimized-2-scaled.jpg",
      editorialUrls: [editorial.nightlife],
    },
  },
  kaeFunk: {
    name: "Kae Funk Beach Bar",
    coordinates: [-6.1321, 39.4955],
    description:
      "Kae Funk faces west from Michamvi Kae, turning a mangrove-edge beach into a barefoot sunset bar with DJs, acrobatic shows, and fire performances.",
    options: {
      venueKind: "nightlife",
      nightlifeType: "live_music_venue",
      musicGenres: ["afrobeats", "reggae", "DJ sets"],
      attributeTags: [
        "beach",
        "scenic_nightlife",
        "live_music",
        "casual_nightlife",
      ],
      price: "$$",
      hours:
        "Daily beach service 11:00 AM-12:00 AM; fire shows and DJ sets follow the venue's official event calendar.",
      officialUrl: "https://members.zati.or.tz/members-list-public/download",
      sourcePhoto: "https://wildtosea.com/images/zanzibar/_dsc4798.jpg",
      imagePage: editorial.beachBars,
      editorialUrls: [editorial.beachBars, editorial.nightlife],
    },
  },
  africaHouse: {
    name: "Sunset Bar at Africa House",
    coordinates: [-6.1643921, 39.1871956],
    description:
      "Africa House's broad first-floor terrace is an old-school Stone Town sundowner: simple mixed drinks, ocean horizon, ceiling fans, and little pressure to order dinner.",
    options: {
      venueKind: "nightlife",
      nightlifeType: "lounge",
      musicGenres: ["lounge"],
      attributeTags: [
        "scenic_nightlife",
        "casual_nightlife",
        "walk_in_friendly_nightlife",
        "tourist_friendly",
      ],
      price: "$$",
      hours: daily("10:00 AM", "11:00 PM"),
      officialUrl:
        "https://www.tripadvisor.com/Restaurant_Review-g488129-d4275272-Reviews-Sunset_Bar_at_the_Africa_House-Stone_Town_Zanzibar_City_Zanzibar_Island_Zanzibar_.html",
      sourcePhoto:
        "https://images.trvl-media.com/lodging/9000000/8650000/8645300/8645289/838d555e.jpg?impolicy=resizecrop&ra=fill&rh=575&rw=575",
      imagePage:
        "https://www.expedia.com/Zanzibar-Town-Hotels-Africa-House-Hotel.h8645289.Hotel-Information",
      editorialUrls: [editorial.nightlife],
    },
  },
} satisfies Record<string, VenueSeed>;

function barStop(
  id: string,
  key: keyof typeof barVenues,
  override: Partial<GuideStop> = {},
) {
  const venue = barVenues[key];
  return stop(
    id,
    venue.name,
    venue.coordinates,
    override.description ?? venue.description,
    { ...venue.options, ...override },
  );
}

const diningStops = [
  venueStop("zanzibar-dining-rock", "rock"),
  venueStop("zanzibar-dining-hurumzi", "hurumzi"),
  venueStop("zanzibar-dining-secret-garden", "secretGarden"),
  venueStop("zanzibar-dining-fifth", "fifth", {
    venueKind: "food_drink",
    description:
      "The Fifth earns its dining place through sushi, fresh seafood, and small plates served around a rare Stone Town infinity pool with rooftop views.",
  }),
  venueStop("zanzibar-dining-six-degrees", "sixDegrees"),
  venueStop("zanzibar-dining-beach-house", "beachHouse"),
  venueStop("zanzibar-dining-bahari", "bahari"),
  venueStop("zanzibar-dining-jetty", "jetty"),
  venueStop("zanzibar-dining-maru-maru", "maru"),
  venueStop("zanzibar-dining-maisha", "maisha"),
];

const casualBarStops = [
  barStop("zanzibar-casual-gerrys", "gerrys"),
  barStop("zanzibar-casual-b4", "b4"),
  barStop("zanzibar-casual-kendwa-rocks", "kendwaRocks"),
  barStop("zanzibar-casual-drifters", "driftersBar"),
  barStop("zanzibar-casual-paje-by-night", "pajeByNight"),
  barStop("zanzibar-casual-kae-funk", "kaeFunk"),
  venueStop("zanzibar-casual-six-degrees", "sixDegrees", {
    venueKind: "nightlife",
    description:
      "At bar level, 6 Degrees South works as a dependable Shangani meeting point for waterfront beers, happy-hour cocktails, and a mixed local-traveler crowd.",
  }),
  venueStop("zanzibar-casual-jetty", "jetty", {
    venueKind: "nightlife",
    description:
      "The Jetty's appeal after dinner is physical: a long walk over the water to sunset cocktails, shisha, dhow views, and a breezy resort-bar pace.",
  }),
  venueStop("zanzibar-casual-maru", "maru", {
    venueKind: "nightlife",
    description:
      "Maru Maru's terrace is an easy Stone Town sundowner for 360-degree views, a long daily happy hour, poolside seating, and occasional taarab performances.",
  }),
  barStop("zanzibar-casual-africa-house", "africaHouse"),
];

const cocktailStops = [
  venueStop("zanzibar-cocktail-fifth", "fifth", {
    description:
      "The Fifth is Zanzibar's sharpest compact rooftop package: tropical signatures, classics, sushi, a small infinity pool, and close views across the old city's roofs.",
  }),
  venueStop("zanzibar-cocktail-six-degrees", "sixDegrees", {
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    description:
      "6 Degrees South treats cocktails as more than a sideline, with a substantial current drinks menu and a west-facing terrace timed naturally for sunset.",
  }),
  venueStop("zanzibar-cocktail-beach-house", "beachHouse", {
    venueKind: "nightlife",
    description:
      "Beach House's seawall deck supports a serious spirits and cocktail selection, best used for golden hour when the terrace looks directly across the Indian Ocean.",
  }),
  venueStop("zanzibar-cocktail-maru", "maru", {
    venueKind: "nightlife",
    nightlifeType: "rooftop_bar",
    description:
      "Maru Maru is the unfussy rooftop choice here, pairing classic mixed drinks and 4:00 PM-7:00 PM happy hour with wide Stone Town panoramas.",
  }),
  venueStop("zanzibar-cocktail-jetty", "jetty", {
    venueKind: "nightlife",
    description:
      "Essque Zalu's Jetty turns a resort cocktail into an over-water occasion, with daily sundown service and the rare ability to see both sunrise and sunset.",
  }),
  venueStop("zanzibar-cocktail-bahari", "bahari", {
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    description:
      "Bahari is Zuri's toes-near-the-sand drinks stop, useful for a polished cocktail between a Kendwa swim and one of the scheduled beachfront barbecue dinners.",
  }),
  venueStop("zanzibar-cocktail-hurumzi", "hurumzi", {
    venueKind: "nightlife",
    nightlifeType: "rooftop_bar",
    description:
      "Hurumzi's reserved sunset hour puts cocktails inside a carved historic rooftop, before the room shifts into its single-sitting dinner and live-taarab format.",
  }),
  barStop("zanzibar-cocktail-kendwa-rocks", "kendwaRocks", {
    nightlifeType: "cocktail_bar",
    description:
      "Kendwa Rocks keeps a full 2026 cocktail list alongside its party identity, making the beach bar useful before the lounge or monthly Full Moon crowd arrives.",
  }),
  barStop("zanzibar-cocktail-gerrys", "gerrys", {
    nightlifeType: "cocktail_bar",
    description:
      "Gerry's cocktails are straightforward and beach-first, strongest during its 6:00 PM-7:00 PM happy hour when musicians and sunset watchers begin to gather.",
  }),
  barStop("zanzibar-cocktail-africa-house", "africaHouse", {
    nightlifeType: "cocktail_bar",
    description:
      "Africa House is less about mixology than the ritual: order a classic sundowner, claim the deep terrace, and watch dhows cross Stone Town's western horizon.",
  }),
];

const cultureStops = [
  stop(
    "zanzibar-culture-old-fort",
    "Old Fort of Zanzibar",
    [-6.1613586, 39.1890647],
    "The Omani fort's thick coral-rag walls now enclose craft stalls, an open amphitheater, and festival activity beside Forodhani rather than a conventional collection museum.",
    {
      venueKind: "culture",
      subcategories: ["Historic site", "Architecture", "Performance venue"],
      attributeTags: ["central", "historic", "live_music"],
      hours: daily("8:00 AM", "6:00 PM"),
      officialUrl: "https://utaliismz.go.tz/tourism-sites/old-fort",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Old_Fort_of_Zanzibar.jpg/960px-Old_Fort_of_Zanzibar.jpg",
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Old_Fort_of_Zanzibar.jpg",
      editorialUrls: [editorial.heritage, editorial.tourism],
    },
  ),
  stop(
    "zanzibar-culture-christ-church",
    "Christ Church Cathedral & Former Slave Market",
    [-6.1629078, 39.1925716],
    "The Anglican cathedral stands on the former slave market, pairing Edward Steere's 1870s architecture with memorial interpretation and surviving underground holding chambers.",
    {
      venueKind: "culture",
      subcategories: ["Religious site", "History museum", "Architecture"],
      attributeTags: ["central", "historic", "educational"],
      price: "$",
      hours: daily("9:00 AM", "6:00 PM"),
      officialUrl: "https://www.zanzibaranglican.or.tz/visiting/",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Christ_Church_Stone_Town_Zanzibar.jpg/960px-Christ_Church_Stone_Town_Zanzibar.jpg",
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Christ_Church_Stone_Town_Zanzibar.jpg",
      editorialUrls: [editorial.heritage],
    },
  ),
  stop(
    "zanzibar-culture-freddie-mercury",
    "Freddie Mercury Museum",
    [-6.1628, 39.1875],
    "A small museum in the Shangani building associated with Farrokh Bulsara's childhood uses family photographs, Queen memorabilia, and a compact biographical timeline.",
    {
      venueKind: "culture",
      subcategories: ["Music museum", "Biography", "Popular culture"],
      attributeTags: ["central", "music", "indoor"],
      price: "$$",
      hours: daily("9:00 AM", "8:00 PM"),
      officialUrl: "https://freddiemercurymuseum.com/",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Photo_of_museum_in_Stone_Town.jpg/960px-Photo_of_museum_in_Stone_Town.jpg",
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Photo_of_museum_in_Stone_Town.jpg",
      editorialUrls: [editorial.heritage],
    },
  ),
  stop(
    "zanzibar-culture-palace-museum",
    "Palace Museum",
    [-6.1599704, 39.1903755],
    "The former waterfront residence of Zanzibar's sultans uses royal furniture, portraits, and rooms connected to Princess Salme to explain the Omani court and 1964 revolution.",
    {
      venueKind: "culture",
      subcategories: ["History museum", "Royal history", "Architecture"],
      attributeTags: ["central", "historic", "indoor"],
      price: "$",
      hours: {
        mon: "9:00 AM-6:00 PM",
        tue: "9:00 AM-6:00 PM",
        wed: "9:00 AM-6:00 PM",
        thu: "9:00 AM-6:00 PM",
        fri: "9:00 AM-6:00 PM",
        sat: "9:00 AM-3:00 PM",
        sun: "9:00 AM-3:00 PM",
      },
      officialUrl: "https://utaliismz.go.tz/tourism-sites/palace-museum",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Palace_museum_%2CZanzibar_2021.jpg/960px-Palace_museum_%2CZanzibar_2021.jpg",
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Palace_museum_,Zanzibar_2021.jpg",
      editorialUrls: [editorial.heritage, editorial.tourism],
    },
  ),
  stop(
    "zanzibar-culture-old-dispensary",
    "Old Dispensary",
    [-6.1582663, 39.1926335],
    "This waterfront charitable dispensary is Stone Town's most exuberant late-19th-century facade, layering carved balconies, stained glass, Indian ornament, and restored inner courtyards.",
    {
      venueKind: "landmark",
      subcategories: ["Architecture", "Historic site", "Cultural center"],
      attributeTags: ["central", "historic", "design"],
      hours: {
        mon: "8:00 AM-6:00 PM",
        tue: "8:00 AM-6:00 PM",
        wed: "8:00 AM-6:00 PM",
        thu: "8:00 AM-6:00 PM",
        fri: "8:00 AM-6:00 PM",
        sat: "8:00 AM-6:00 PM",
        sun: "Closed",
      },
      officialUrl: "https://utaliismz.go.tz/tourism-sites/old-dispensary",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Old_dispensary_%2CZanzibar_2021.jpg/960px-Old_dispensary_%2CZanzibar_2021.jpg",
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Old_dispensary_,Zanzibar_2021.jpg",
      editorialUrls: [editorial.heritage, editorial.tourism],
    },
  ),
  stop(
    "zanzibar-culture-hamamni",
    "Hamamni Persian Baths",
    [-6.1622069, 39.1909976],
    "Sultan Barghash's public bathhouse preserves domed hot and cold rooms, water channels, changing spaces, and roof access inside Stone Town's tightest lanes.",
    {
      venueKind: "culture",
      subcategories: ["Historic site", "Architecture", "Social history"],
      attributeTags: ["central", "historic", "design"],
      price: "$",
      hours: daily("8:30 AM", "6:00 PM"),
      officialUrl: "https://utaliismz.go.tz/tourism-sites/hamamni",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Hamamni_Persian_Baths_%2Cmarch_2021.jpg/960px-Hamamni_Persian_Baths_%2Cmarch_2021.jpg",
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Hamamni_Persian_Baths_,march_2021.jpg",
      editorialUrls: [editorial.heritage, editorial.tourism],
    },
  ),
  stop(
    "zanzibar-culture-dcma",
    "Dhow Countries Music Academy",
    [-6.1630566, 39.1896262],
    "DCMA trains musicians in taarab and other Indian Ocean traditions, maintaining an archive while presenting student and professional ensembles on a changing performance schedule.",
    {
      venueKind: "culture",
      subcategories: ["Music school", "Archive", "Performance venue"],
      attributeTags: ["music", "live_music", "educational"],
      hours: {
        mon: "9:00 AM-5:00 PM; performances follow the official performance schedule",
        tue: "9:00 AM-5:00 PM; performances follow the official performance schedule",
        wed: "9:00 AM-5:00 PM; performances follow the official performance schedule",
        thu: "9:00 AM-5:00 PM; performances follow the official performance schedule",
        fri: "9:00 AM-5:00 PM; performances follow the official performance schedule",
        sat: "Closed; performances only under the official performance schedule",
        sun: "Closed; performances only under the official performance schedule",
      },
      officialUrl: "https://www.zanzibarmusic.org/",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Zanzibar_Taarab_Kidumbak_Ensemble.jpg/960px-Zanzibar_Taarab_Kidumbak_Ensemble.jpg",
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Zanzibar_Taarab_Kidumbak_Ensemble.jpg",
      editorialUrls: [editorial.heritage],
    },
  ),
  stop(
    "zanzibar-culture-mtoni",
    "Mtoni Palace Ruins",
    [-6.1355421, 39.2134956],
    "The roofless seafront palace where Princess Salme grew up retains coral-stone arches, courtyards, bath traces, and enough scale to read 19th-century royal domestic life.",
    {
      venueKind: "culture",
      subcategories: ["Archaeological site", "Royal history", "Architecture"],
      attributeTags: ["historic", "outdoors", "quiet"],
      price: "$",
      hours:
        "Daily site access 9:00 AM-5:00 PM; guided visits and concert dinners follow the official booking calendar.",
      officialUrl: "https://utaliismz.go.tz/tourism-sites/mtoni",
      sourcePhoto:
        "https://utalii-pay.zmotion.co.tz/storage/sites/images/xnj4LZRpLJwj46dzhwA2sehLyMuOeKXPqh7j94ej.webp",
      editorialUrls: [editorial.tourism],
    },
  ),
  stop(
    "zanzibar-culture-kidichi",
    "Kidichi Persian Baths",
    [-6.0568, 39.2404],
    "Seyyid Said built these country baths for his Persian wife Schéhérazade, leaving domed chambers and unusual painted bird and floral decoration among spice-growing villages.",
    {
      venueKind: "culture",
      subcategories: ["Historic site", "Architecture", "Royal history"],
      attributeTags: ["historic", "quiet", "design"],
      price: "$",
      hours: daily("8:00 AM", "6:00 PM"),
      officialUrl: "https://utaliismz.go.tz/tourism-sites/kidichi",
      sourcePhoto:
        "https://images.lonelyplanetitalia.it/static/pois/kidichi-persian-baths-31594.jpg?p=social&q=90&s=dd1f4ad8228fe0dd61bfc8a2f3c45d3c",
      imagePage:
        "https://www.lonelyplanetitalia.it/destinazioni/tanzania/zanzibar-town-zanzibar-citta/poi/kidichi-persian-baths",
      editorialUrls: [editorial.tourism],
    },
  ),
  stop(
    "zanzibar-culture-darajani",
    "Darajani Market",
    [-6.1622107, 39.1937312],
    "Darajani is living culture rather than display culture: arrive early to see the island's fish, spices, produce, fabrics, household trade, and everyday bargaining converge.",
    {
      venueKind: "culture",
      subcategories: ["Market", "Living heritage", "Food culture"],
      attributeTags: ["market", "central", "local_favorite"],
      hours: daily("6:00 AM", "6:00 PM"),
      officialUrl: "https://whc.unesco.org/en/list/173",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Darajani_Market_%2CZanzibar.jpg/960px-Darajani_Market_%2CZanzibar.jpg",
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Darajani_Market_,Zanzibar.jpg",
      editorialUrls: [editorial.heritage],
    },
  ),
];

const activityStops = [
  stop(
    "zanzibar-activity-jozani",
    "Jozani Chwaka Bay National Park",
    [-6.2624536, 39.4150035],
    "Guided forest walks connect groundwater woodland, mangroves, and reliable Zanzibar red colobus sightings while keeping visitors on managed paths through the island's national park.",
    {
      venueKind: "outdoors",
      subcategories: ["National park", "Wildlife", "Guided walk"],
      attributeTags: ["nature", "wildlife", "guided"],
      price: "$$",
      hours: daily("7:30 AM", "5:00 PM"),
      officialUrl: "https://www.zanzibartourism.go.tz/things-to-do",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Zanzibar_Red_Colobus_Monkey.jpg/960px-Zanzibar_Red_Colobus_Monkey.jpg",
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Zanzibar_Red_Colobus_Monkey.jpg",
      editorialUrls: [editorial.tourism],
    },
  ),
  stop(
    "zanzibar-activity-safari-blue",
    "The Original Safari Blue",
    [-6.3177198, 39.2773715],
    "The original Fumba operator runs full-day dhow trips through Menai Bay for sailing, snorkeling, sandbanks, a seafood lunch, and baobab-framed island stops.",
    {
      venueKind: "outdoors",
      subcategories: ["Boat trip", "Snorkeling", "Sailing"],
      attributeTags: ["nature", "water", "guided"],
      price: "$$$",
      hours:
        "Daily booked departures at 9:00 AM return about 4:00 PM; the official booking calendar and weather schedule control operation.",
      officialUrl: "https://safariblue.net/",
      bookingUrl: "https://safariblue.net/online-booking/",
      sourcePhoto:
        "https://safariblue.net/wp-content/uploads/2024/02/AERIAL-SANDBAR-MD-W-1-1.jpg",
      editorialUrls: [editorial.tourism],
    },
  ),
  stop(
    "zanzibar-activity-mwani",
    "Mwani Zanzibar Seaweed Tour",
    [-6.2648, 39.5345],
    "Mwani's 90-minute Paje visit follows seaweed from women-led farming and wild harvest into a production studio, regenerative supply chain, tonic, and finished skincare.",
    {
      venueKind: "culture",
      subcategories: ["Workshop tour", "Seaweed farming", "Social enterprise"],
      attributeTags: ["educational", "local_favorite", "guided"],
      price: "$",
      hours:
        "Ninety-minute tours run in the slots on the official booking calendar; any farm portion follows the published tide schedule.",
      officialUrl: "https://mwanizanzibar.com/products/tour",
      bookingUrl: "https://mwanizanzibar.com/products/tour",
      sourcePhoto:
        "https://mwanizanzibar.com/cdn/shop/files/Mwani_Origin_DSCF0031.jpg?v=1746707895",
      editorialUrls: [editorial.tourism],
    },
  ),
  stop(
    "zanzibar-activity-kite-centre",
    "Kite Centre Zanzibar",
    [-6.2690032, 39.5363396],
    "Paje's first kite school teaches on a shallow side-onshore lagoon, with IKO-style progression, rentals, and lesson timing shaped by wind, tide, and rider level.",
    {
      venueKind: "outdoors",
      subcategories: ["Kitesurfing", "Lessons", "Equipment rental"],
      attributeTags: ["water", "sports", "guided"],
      price: "$$$",
      hours:
        "Daily school service 8:00 AM-6:00 PM during the official wind seasons; lesson slots follow the booking page, tide, and weather schedule.",
      officialUrl: "https://kitecentrezanzibar.com/",
      bookingUrl: "https://kitecentrezanzibar.com/contact",
      sourcePhoto:
        "https://kitecentrezanzibar.com/wp-content/uploads/2022/09/KCZ-kite-AERIAL-ZF-HD-202211-scaled.jpg",
      editorialUrls: [editorial.tourism],
    },
  ),
  stop(
    "zanzibar-activity-chumbe",
    "Chumbe Island Coral Park",
    [-6.2805367, 39.1766699],
    "Capacity-limited Chumbe day trips fund a protected coral sanctuary and combine guided snorkeling, forest walking, an eco-lodge visit, and environmental interpretation without mass-tour boats.",
    {
      venueKind: "outdoors",
      subcategories: ["Marine reserve", "Snorkeling", "Conservation"],
      attributeTags: ["nature", "water", "guided"],
      price: "$$$",
      hours:
        "Booked day guests depart the Mbweni Ruins meeting point at 10:00 AM and leave Chumbe at 4:30 PM under the official booking calendar and weather policy.",
      officialUrl: "https://chumbeisland.com/",
      bookingUrl: "https://chumbeisland.com/contact-us/",
      sourcePhoto:
        "https://chumbeisland.com/wp-content/uploads/2021/01/Drone-Shot-Chumbe_%C2%A9Kozanow-Productions-2-scaled.jpg",
      editorialUrls: [editorial.tourism],
    },
  ),
  stop(
    "zanzibar-activity-one-ocean",
    "One Ocean Diving: Mnemba Trip",
    [-5.8755, 39.3533],
    "One Ocean's Matemwe center uses PADI guides for two-session Mnemba reef trips, keeping groups on scheduled boats with equipment, water, and tide-aware transfers included.",
    {
      venueKind: "outdoors",
      subcategories: ["Scuba diving", "Snorkeling", "Boat trip"],
      attributeTags: ["water", "sports", "guided"],
      price: "$$$",
      hours:
        "Daily Mnemba meeting time 8:00 AM-9:00 AM with return 1:00 PM-2:00 PM; tide and sea-condition schedules set the exact departure.",
      officialUrl: "https://zanzibaroneocean.com/trips/",
      bookingUrl: "https://zanzibaroneocean.com/bookings-rates/",
      sourcePhoto:
        "https://zanzibaroneocean.com/wp-content/uploads/2018/12/MnembaTrips-300x184.jpg",
      editorialUrls: [editorial.tourism],
    },
  ),
  stop(
    "zanzibar-activity-prison-island",
    "Prison Island & Bawe Snorkel with One Ocean",
    [-6.1192184, 39.1660983],
    "One Ocean's controlled afternoon combines a Bawe reef snorkel with an hour on Changuu, using a named operator, fixed group minimum, and published return time.",
    {
      venueKind: "outdoors",
      subcategories: ["Boat trip", "Snorkeling", "Historic island"],
      attributeTags: ["water", "historic", "guided"],
      price: "$$",
      hours:
        "Booked trips meet daily at 2:00 PM, depart 2:30 PM, and return 5:30 PM; the official booking page and weather schedule control operation.",
      officialUrl: "https://zanzibaroneocean.com/trips/",
      bookingUrl: "https://zanzibaroneocean.com/bookings-rates/",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Isla_Changuu%2C_Tanzania%2C_2024-05-31%2C_DD_05.jpg/960px-Isla_Changuu%2C_Tanzania%2C_2024-05-31%2C_DD_05.jpg",
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Isla_Changuu,_Tanzania,_2024-05-31,_DD_05.jpg",
      editorialUrls: [editorial.tourism],
    },
  ),
  stop(
    "zanzibar-activity-kuza",
    "Kuza Cave Culture Centre",
    [-6.3038005, 39.5333981],
    "Kuza pairs a clear freshwater limestone pool with a forest walk, small Swahili-house museum, and optional drumming, dance, cooking, or craft sessions supporting Kibigija projects.",
    {
      venueKind: "outdoors",
      subcategories: ["Cave swimming", "Cultural workshop", "Nature"],
      attributeTags: ["nature", "water", "educational"],
      price: "$",
      hours: daily("8:00 AM", "6:30 PM"),
      officialUrl: "https://www.kuzacave.com/zanzibar/",
      sourcePhoto:
        "https://www.kuzacave.com/wp-content/uploads/2016/12/FeuerQuell-Fotografie-20171129-1024x683.jpg",
      editorialUrls: [editorial.tourism],
    },
  ),
  stop(
    "zanzibar-activity-butterfly",
    "Zanzibar Butterfly Centre",
    [-6.2855211, 39.4154326],
    "A netted tropical garden near Jozani demonstrates native butterfly life cycles while its village pupae program directs visitor income toward growers and conservation jobs.",
    {
      venueKind: "outdoors",
      subcategories: ["Conservation", "Wildlife", "Family activity"],
      attributeTags: ["nature", "family_friendly", "educational"],
      price: "$",
      hours: daily("9:00 AM", "4:30 PM"),
      officialUrl: "https://zanzibarbutterfly.com/",
      sourcePhoto: "https://img1.wsimg.com/isteam/getty/1404428823",
      editorialUrls: [editorial.tourism],
    },
  ),
  stop(
    "zanzibar-activity-kizimbani",
    "Kizimbani Spice Farm",
    [-6.043, 39.2578],
    "A guided Kizimbani walk identifies clove, nutmeg, cinnamon, pepper, vanilla, and tropical fruit in cultivation, making the spice economy legible beyond souvenir packets.",
    {
      venueKind: "outdoors",
      subcategories: ["Farm tour", "Food culture", "Guided walk"],
      attributeTags: ["nature", "educational", "guided"],
      price: "$",
      hours:
        "Daily guided visits 9:00 AM-5:00 PM; start times follow the official tourism booking page and farm schedule.",
      officialUrl: "https://www.zanzibartourism.go.tz/things-to-do",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Nutmeg_in_kizimbani_zanzibar.jpg/960px-Nutmeg_in_kizimbani_zanzibar.jpg",
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Nutmeg_in_kizimbani_zanzibar.jpg",
      editorialUrls: [editorial.tourism],
    },
  ),
];

function source(name: string, url: string): ListSource {
  return { name, url };
}

function sourcesFor(
  stops: GuideStop[],
  editorialSource: ListSource,
): ListSource[] {
  const candidates = [
    editorialSource,
    ...stops.flatMap((item) => [
      source(`${item.name} official or property page`, item.officialUrl!),
      source(
        `${item.name} current map listing`,
        item.sourceEvidence?.mapUrl ?? maps(`${item.name} Zanzibar Tanzania`),
      ),
    ]),
  ];
  return candidates.filter(
    (item, index) =>
      candidates.findIndex((candidate) => candidate.url === item.url) === index,
  );
}

function guide(
  category: ListCategory,
  id: string,
  slug: string,
  seoSlug: string,
  title: string,
  description: string,
  stops: GuideStop[],
  guideSources: ListSource[],
  seoTitle: string,
  seoDescription: string,
): MapList {
  return {
    id,
    slug,
    seoSlug,
    seoTitle,
    seoDescription,
    title,
    description,
    url: maps(`${title} Zanzibar Tanzania`),
    category,
    location: zanzibarLocation,
    creator: {
      id: `user-rguide-${category.toLowerCase()}`,
      name: `R ${category}`,
      avatar: avatar(category),
    },
    upvotes: 0,
    createdAt,
    stops,
    sources: guideSources,
  };
}

export const zanzibarCitywideGuides: MapList[] = [
  guide(
    "Food",
    "list-zanzibar-dining",
    "zanzibar-best-restaurants",
    "best-restaurants",
    "Zanzibar Restaurants for Reefs, Rooftops, and Swahili Cooking",
    "Ten island-spanning dining rooms balancing Stone Town heritage, east-coast destination tables, north-coast resort cooking, seafood, Swahili technique, and carefully timed sunset settings.",
    diningStops,
    sourcesFor(
      diningStops,
      source("Current Zanzibar restaurant inventory", editorial.dining),
    ),
    "Best Restaurants in Zanzibar for Seafood, Swahili Food, and Rooftop Dining",
    "A source-backed Zanzibar restaurant guide to The Rock, Emerson, Zuri, the Jetty, Beach House, and other reservation-worthy island tables.",
  ),
  guide(
    "Food",
    "list-zanzibar-cheap-eats",
    "zanzibar-best-cheap-eats",
    "best-cheap-eats",
    "Zanzibar Value: Markets, Cafes, Pilau, and Street Food",
    "Ten affordable counters, markets, coffee rooms, and food courts for Zanzibari rice plates, vegetarian Indian cooking, evening grills, fresh juices, breakfast, and inexpensive Paje variety.",
    cheapEatStops,
    sourcesFor(
      cheapEatStops,
      source("Stone Town cheap-eats inventory", editorial.value),
    ),
    "Best Cheap Eats in Zanzibar for Markets, Zanzibari Food, and Cafes",
    "Current value guide to Lukmaan, Forodhani, Darajani, Zanzibar Coffee House, Mapacha, and practical independent alternatives across Stone Town and Paje.",
  ),
  guide(
    "Stay",
    "list-zanzibar-hotels",
    "zanzibar-best-hotels",
    "best-hotels",
    "Zanzibar Hotels for Heritage, Villas, and Beach Seclusion",
    "A hotel-only selection spanning restored Stone Town merchant houses, design-led Kendwa and Paje stays, intimate southeast-coast villas, full-scale resorts, and clear location tradeoffs.",
    hotelStops,
    sourcesFor(
      hotelStops,
      source("Condé Nast Traveller Zanzibar hotel guide", editorial.hotels),
    ),
    "Best Hotels in Zanzibar from Stone Town Heritage to Private Beach Villas",
    "Source-backed Zanzibar hotel guide with direct property evidence, explicit check-in windows, beach context, and no hostel inventory mixed into the selection.",
  ),
  guide(
    "Stay",
    "list-zanzibar-hostels",
    "zanzibar-best-hostels",
    "best-hostels",
    "Zanzibar Hostels for Beach Socializing and Stone Town Access",
    "A hostel-only guide separating Paje and Jambiani social compounds, quiet southern dorms, and central Stone Town bases, with current booking evidence and arrival limits stated.",
    hostelStops,
    sourcesFor(
      hostelStops,
      source("Hostelworld Zanzibar inventory", editorial.hostels),
    ),
    "Best Hostels in Zanzibar for Solo Travelers, Beaches, and Stone Town",
    "Current Zanzibar hostel guide with dorm evidence, check-in windows, social-versus-quiet context, and ten actual hostel properties kept separate from hotels.",
  ),
  guide(
    "Nightlife",
    "list-zanzibar-casual-bars",
    "zanzibar-best-beach-bars",
    "best-beach-bars",
    "Zanzibar Beach Bars, Sunset Terraces, and Social Rooms",
    "Ten casual drinking places ranging from Nungwi sand bars and Paje traveler rooms to Michamvi sunset shows and Stone Town terraces, with event dependencies named clearly.",
    casualBarStops,
    sourcesFor(
      casualBarStops,
      source("Current Zanzibar beach-bar guide", editorial.beachBars),
    ),
    "Best Beach Bars in Zanzibar for Sunsets, Live Music, and DJ Nights",
    "Source-backed Zanzibar bar guide to Gerry's, B4, Kendwa Rocks, Kae Funk, Paje by Night, and lower-key Stone Town sundowners.",
  ),
  guide(
    "Nightlife",
    "list-zanzibar-cocktail-bars",
    "zanzibar-best-cocktail-bars",
    "best-cocktail-bars",
    "Zanzibar Cocktails with Rooftops, Jetties, and Ocean Horizons",
    "A cocktail-focused circuit across compact Stone Town roofs, a sea-wall deck, north-coast beach bars, and an over-water jetty, emphasizing setting and current service schedules.",
    cocktailStops,
    sourcesFor(
      cocktailStops,
      source("Current Zanzibar nightlife guide", editorial.nightlife),
    ),
    "Best Cocktail Bars in Zanzibar for Rooftops, Beaches, and Sunset Drinks",
    "Current Zanzibar cocktail guide to The Fifth, Beach House, 6 Degrees South, Hurumzi, the Jetty, and north-coast beach alternatives.",
  ),
  guide(
    "Culture",
    "list-zanzibar-culture",
    "zanzibar-best-culture",
    "best-culture",
    "Zanzibar Culture Beyond the Postcard",
    "Ten places that read the island through Omani palaces, public baths, music, religious and enslavement history, market life, architecture, and the people who keep heritage active.",
    cultureStops,
    sourcesFor(
      cultureStops,
      source("UNESCO Stone Town listing and documentation", editorial.heritage),
    ),
    "Best Cultural Sites in Zanzibar for Stone Town History, Music, and Architecture",
    "A source-backed Zanzibar culture guide to the Old Fort, Christ Church, Palace Museum, Hamamni Baths, DCMA, Mtoni, and working Darajani Market.",
  ),
  guide(
    "Activities",
    "list-zanzibar-things-to-do",
    "zanzibar-best-things-to-do",
    "best-things-to-do",
    "Zanzibar Things to Do on Reefs, Forest Trails, Farms, and Lagoons",
    "Ten bookable or timed activities balancing marine conservation, managed wildlife, sailing, diving, kitesurfing, cave swimming, seaweed work, spices, and community-linked nature visits.",
    activityStops,
    sourcesFor(
      activityStops,
      source(
        "Zanzibar Commission for Tourism activity inventory",
        editorial.tourism,
      ),
    ),
    "Best Things to Do in Zanzibar for Reefs, Forests, Sailing, and Culture",
    "Current Zanzibar activity guide with official operators, tide and weather dependencies, exact meeting windows, and alternatives to unstructured animal-contact tours.",
  ),
];
