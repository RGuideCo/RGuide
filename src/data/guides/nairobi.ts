import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

const createdAt = "2026-08-11T00:00:00.000Z";
const checkedAt = "2026-08-11";

const nairobiLocation = {
  city: "Nairobi",
  country: "Kenya",
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
    sourceEvidence?.mapUrl ?? maps(mapQuery ?? `${name} Nairobi Kenya`);
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
        "Official, property, editorial, and current map evidence checked on 2026-08-11.",
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
  dining: "https://bestkenya.ke/blog/food-dining/where-to-eat-nairobi",
  value: "https://bestkenya.ke/blog/food-dining/nairobi-street-food-cheap-eats",
  nightlife:
    "https://bestkenya.ke/blog/nightlife-entertainment/nairobi-nightlife-guide",
  creativeCity: "https://www.wallpaper.com/travel/nairobi-kenya-navigator",
  hotels: "https://www.tripadvisor.com/Hotels-g294207-Nairobi-Hotels.html",
  hostels: "https://www.hostelworld.com/hostels/africa/kenya/nairobi/",
  museums: "https://nmk.go.ke/museums-and-sites/",
  city: "https://nairobi.go.ke/explore-nairobi",
};

const venues = {
  cultiva: {
    name: "Cultiva Farm Kenya",
    coordinates: [-1.3569615, 36.7393021],
    description:
      "Cultiva cooks on a working organic farm in Karen, turning its own and nearby growers' seasonal produce into fire-led, Latin American-inflected plates in leafy gardens.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Farm-to-table", "Latin American", "Contemporary"],
      attributeTags: [
        "farm_to_table",
        "seasonal",
        "garden",
        "reservation_recommended",
      ],
      price: "$$$",
      hours: {
        mon: "Closed",
        tue: "12:00 PM-10:00 PM",
        wed: "8:00 AM-10:00 PM",
        thu: "8:00 AM-10:00 PM",
        fri: "8:00 AM-10:00 PM",
        sat: "8:00 AM-10:00 PM",
        sun: "8:00 AM-10:00 PM",
      },
      officialUrl: "https://cultivakenya.com/",
      bookingUrl: "https://cultivakenya.com/reservations/",
      sourcePhoto:
        "https://cultivakenya.com/wp-content/uploads/2023/07/Cultiva-Farm-Picture-2.jpg",
      editorialUrls: [editorial.creativeCity],
    },
  },
  hero: {
    name: "HERO Restaurant",
    coordinates: [-1.2305686, 36.8044251],
    description:
      "Hidden behind a comic-shop entrance on Trademark Hotel's ninth floor, HERO combines sushi and pan-Asian dishes with pop-culture design, skyline views, and unusually playful drinks.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Japanese", "Pan-Asian", "Sushi"],
      attributeTags: ["design", "rooftop", "cocktails", "late_night"],
      price: "$$$",
      hours: {
        mon: "5:00 PM-12:00 AM",
        tue: "5:00 PM-12:00 AM",
        wed: "5:00 PM-12:00 AM",
        thu: "5:00 PM-12:00 AM",
        fri: "5:00 PM-1:00 AM",
        sat: "12:00 PM-1:00 AM",
        sun: "12:00 PM-11:00 PM",
      },
      officialUrl: "https://www.hero-kenya.com/",
      bookingUrl: "https://www.hero-kenya.com/reservations",
      sourcePhoto:
        "https://images.squarespace-cdn.com/content/v1/5d5d24dcf6e1930001a125c3/1567770579452-30KKPVKYSRVV9QX5TRQR/HERO%2BWeb-66.jpg",
      editorialUrls: [editorial.creativeCity],
    },
  },
  talisman: {
    name: "The Talisman",
    coordinates: [-1.3230815, 36.7031939],
    description:
      "The Talisman's converted Karen house and garden frame a broad but disciplined menu, best known for feta-and-coriander samosas, seafood, grills, and an enduring neighborhood following.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["International", "Kenyan", "Asian-inspired"],
      attributeTags: [
        "garden",
        "local_favorite",
        "date_night",
        "reservation_recommended",
      ],
      price: "$$$",
      hours: {
        mon: "Closed",
        tue: "11:00 AM-1:00 AM",
        wed: "11:00 AM-1:00 AM",
        thu: "11:00 AM-1:00 AM",
        fri: "11:00 AM-1:00 AM",
        sat: "9:00 AM-1:00 AM",
        sun: "9:00 AM-9:00 PM",
      },
      officialUrl: "https://thetalismanrestaurant.com/",
      bookingUrl: "https://thetalismanrestaurant.com/reservations/",
      sourcePhoto:
        "https://placelisted.com/wp-content/uploads/job-manager-uploads/main_image/2018/03/thetalisman_placelisted_nairobi_10.jpg",
      imagePage:
        "https://placelisted.com/listings/the-talisman-restaurant-320-ngong-road-nairobi-kenya-the-talisman/",
      editorialUrls: [editorial.dining],
    },
  },
  inti: {
    name: "INTI – A Nikkei Experience",
    coordinates: [-1.2653801, 36.8017428],
    description:
      "INTI occupies the twentieth floor of One Africa Place, pairing Japanese-Peruvian Nikkei cooking, sushi, pisco-led drinks, and broad Westlands views in one polished room.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Nikkei", "Japanese", "Peruvian"],
      attributeTags: [
        "scenic_food",
        "date_night",
        "cocktails",
        "reservation_recommended",
      ],
      price: "$$$",
      hours: { default: "Daily 12:00 PM-10:00 PM" },
      officialUrl: "https://www.thefoodlibrary.co.ke/inti/",
      bookingUrl: "https://www.thefoodlibrary.co.ke/inti/",
      sourcePhoto:
        "https://www.thefoodlibrary.co.ke/wp-content/uploads/2023/11/391470690_712804453525170_5803389753133694913_n.jpg",
      editorialUrls: [editorial.dining],
    },
  },
  mawimbi: {
    name: "Mawimbi Seafood Restaurant",
    coordinates: [-1.2774163, 36.8154431],
    description:
      "Mawimbi builds a coastal escape around a courtyard pool, with Indian Ocean seafood, a crudo counter, sushi, and live music close to Nairobi's central business district.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Seafood", "Sushi", "International"],
      attributeTags: [
        "seafood",
        "poolside",
        "live_music",
        "reservation_recommended",
      ],
      price: "$$$",
      hours: {
        default:
          "Daily 6:00 AM-11:00 PM; breakfast ends 11:45 AM, lunch runs 12:00 PM-4:30 PM, and dinner service runs 5:00 PM-10:00 PM",
      },
      officialUrl: "https://www.mawimbirestaurant.com/",
      bookingUrl: "https://www.mawimbirestaurant.com/reservations",
      sourcePhoto:
        "https://www.mawimbirestaurant.com/wp-content/uploads/2022/11/px-KSK_0664.webp",
      editorialUrls: [editorial.dining],
    },
  },
  seven: {
    name: "Seven Seafood & Grill",
    coordinates: [-1.2598936, 36.7763258],
    description:
      "Seven makes its case with Indian Ocean fish and shellfish beside dry-aged Kenyan beef, giving mixed groups a reliable upscale table at ABC Place.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Seafood", "Steakhouse", "Contemporary"],
      attributeTags: [
        "seafood",
        "steak",
        "group_friendly",
        "reservation_recommended",
      ],
      price: "$$$",
      hours: { default: "Daily 11:00 AM-12:00 AM" },
      officialUrl: "https://www.experienceseven.com/contact-us/",
      bookingUrl: "https://www.experienceseven.com/contact-us/",
      sourcePhoto:
        "https://www.experienceseven.com/wp-content/uploads/2019/05/38730523_m.jpg",
      editorialUrls: [editorial.dining],
    },
  },
  aboutThyme: {
    name: "About Thyme",
    coordinates: [-1.2527646, 36.8030622],
    description:
      "About Thyme hides a series of lantern-lit tables in a Westlands garden, serving an eclectic seasonal menu whose brunches, vegetarian choices, and desserts justify lingering.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["International", "Mediterranean", "Brunch"],
      attributeTags: ["garden", "brunch", "vegetarian_friendly", "date_night"],
      price: "$$",
      hours: {
        default: "Daily 12:00 PM-11:00 PM; kitchen orders close at 10:00 PM",
      },
      officialUrl: "https://about-thyme.com/",
      sourcePhoto:
        "https://www.nairobirestaurants.co.ke/storage/public/restaurants/493-about-thyme-restaurant/profile/gallery/About_Thyme_Interior.jpg.800x0_q85.jpg",
      imagePage:
        "https://www.nairobirestaurants.co.ke/restaurant/about-thyme-restaurant/profile",
      editorialUrls: [editorial.dining],
    },
  },
  harvest: {
    name: "Harvest",
    coordinates: [-1.2301, 36.8041],
    description:
      "Harvest's open grill anchors a modern brasserie at Village Market, with Kenyan-grown produce, carefully sourced meat, and a wine program suited to long group meals.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Brasserie", "Grill", "Contemporary"],
      attributeTags: ["open_kitchen", "steak", "wine", "group_friendly"],
      price: "$$$",
      hours: { default: "Daily 6:30 AM-9:00 PM" },
      officialUrl: "https://www.harvestkenya.com/contact",
      bookingUrl: "https://www.harvestkenya.com/contact",
      sourcePhoto:
        "https://images.squarespace-cdn.com/content/v1/5b467735fcf7fd30f2b80143/1542216036864-5M4FENJ4U10EJUJM9M32/TRADEMARK+F%26B+print-22.jpg",
      editorialUrls: [editorial.dining],
    },
  },
  carnivore: {
    name: "The Carnivore",
    coordinates: [-1.3292266, 36.8009021],
    description:
      "Carnivore remains Nairobi's theatrical charcoal-grill institution, circulating skewers of farmed meat such as beef, lamb, chicken, ostrich, and crocodile until diners lower the table flag.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Kenyan", "Barbecue", "Meat"],
      attributeTags: [
        "nyama_choma",
        "group_friendly",
        "fixed_price",
        "destination_dining",
      ],
      price: "$$$",
      hours: { default: "Daily 12:00 PM-11:00 PM" },
      officialUrl: "https://tamarind.co.ke/locations/carnivore/",
      bookingUrl: "https://tamarind.co.ke/locations/carnivore/",
      sourcePhoto:
        "https://s3.tamarind.michaelgift.cloud/live/locations/carnivore/food/01.jpeg",
      editorialUrls: [editorial.dining],
    },
  },
  theView: {
    name: "The View",
    coordinates: [-1.2610371, 36.8050072],
    description:
      "The View revolves slowly on Mövenpick's twenty-fourth floor, making its Mediterranean menu secondary to a continuously changing panorama of Westlands, Karura, and the Ngong Hills.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Mediterranean", "International"],
      attributeTags: [
        "rooftop",
        "panoramic",
        "date_night",
        "reservation_recommended",
      ],
      price: "$$$",
      hours: { default: "Daily 12:00 PM-10:00 PM" },
      officialUrl:
        "https://movenpick.accor.com/en/africa/kenya/nairobi/hotel-residences-nairobi/restaurants/the-view.html",
      bookingUrl:
        "https://movenpick.accor.com/en/africa/kenya/nairobi/hotel-residences-nairobi/restaurants/the-view.html",
      sourcePhoto:
        "https://m.ahstatic.com/is/image/accorhotels/Nairobi_xxxxxxxxxx_i125435%3A8by10?dpr=on%2C2.625&hei=475&icc=sRGB&iccEmbed=true&op_usm=0.5%2C0.3%2C2%2C0&qlt=75&resMode=sharp2&wid=380",
      editorialUrls: [editorial.dining],
    },
  },
  kosewe: {
    name: "K'Osewe Ranalo Foods — Kimathi Street",
    coordinates: [-1.2827876, 36.8218028],
    description:
      "At this CBD institution, order whole tilapia with ugali and greens or ask what Luo stews are ready; the rooftop tables add live music on selected nights.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Luo", "Kenyan", "African"],
      attributeTags: ["budget", "local_food", "fish", "late_night"],
      price: "$",
      hours: {
        mon: "10:30 AM-11:00 PM",
        tue: "10:30 AM-11:00 PM",
        wed: "10:30 AM-11:00 PM",
        thu: "10:30 AM-11:00 PM",
        fri: "10:30 AM-11:00 PM",
        sat: "10:30 AM-3:00 AM",
        sun: "10:30 AM-3:00 AM",
      },
      officialUrl:
        "https://www.africabizinfo.com/KE/kosewe-ranalo-foods-0721-323238",
      sourcePhoto:
        "https://www.upkenya.com/wp-content/uploads/2020/11/filename-cimg0186-jpg.jpg",
      imagePage: "https://www.upkenya.com/place/kosewe-ranalo-foods/",
      editorialUrls: [editorial.value],
    },
  },
  alyusra: {
    name: "Al-Yusra — Jamia",
    coordinates: [-1.2834015, 36.8215751],
    description:
      "Beside Jamia Mosque, Al-Yusra serves halal Somali, Swahili, Arabian, and Ethiopian dishes from breakfast onward; mandi, camel pilau, biryani, and fresh juices are the focus.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Somali", "Swahili", "Arabian"],
      attributeTags: ["halal", "budget", "breakfast", "local_food"],
      price: "$$",
      hours: { default: "Daily 6:00 AM-9:00 PM" },
      officialUrl: "https://www.alyusra.co.ke/",
      sourcePhoto:
        "https://publish.eastleighvoice.co.ke/mugera_lock/uploads/2024/08/Al-Yusra.jpg",
      imagePage:
        "https://eastleighvoice.co.ke/food/71764/camel-meat-makes-al-yusra-menu-a-welcome-relief-for-nairobi-dining",
      editorialUrls: [editorial.value],
    },
  },
  cafeDeli: {
    name: "Café Deli — Moi Avenue",
    coordinates: [-1.2841896, 36.8248345],
    description:
      "Café Deli is a dependable early-start CBD canteen for Kenyan breakfasts, pastries, cakes, grilled plates, and quick lunches without hotel pricing or a lengthy detour.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "cafe",
      cuisineTypes: ["Kenyan", "Cafe", "Bakery"],
      attributeTags: ["budget", "breakfast", "central", "quick_meal"],
      price: "$",
      hours: { default: "Daily 6:30 AM-10:00 PM" },
      officialUrl: "https://cafe-deli.co.ke/",
      sourcePhoto: "https://cafe-deli.co.ke/images/sliders/slider3.jpg",
      editorialUrls: [editorial.value],
    },
  },
  mamaAshanti: {
    name: "Mama Ashanti — Lavington",
    coordinates: [-1.2883504, 36.7689921],
    description:
      "Mama Ashanti brings West African home cooking to a garden compound, with jollof, egusi, pepper soup, suya, and large sharing portions that work best for groups.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["West African", "Ghanaian", "Nigerian"],
      attributeTags: [
        "group_friendly",
        "garden",
        "local_favorite",
        "comfort_food",
      ],
      price: "$$",
      hours: { default: "Daily 9:00 AM-11:00 PM" },
      officialUrl: "https://mamaashanti.co.ke/",
      sourcePhoto:
        "https://mamaashanti.co.ke/wp-content/uploads/2022/06/home-banner.jpg",
      editorialUrls: [editorial.value],
    },
  },
  habesha: {
    name: "Habesha Ethiopian Restaurant",
    coordinates: [-1.2939319, 36.7935937],
    description:
      "Habesha's shaded compound on Argwings Kodhek Road is built for shared injera platters, with a deep range of meat stews, shiro, lentils, and vegetable combinations.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Ethiopian", "East African"],
      attributeTags: [
        "budget",
        "vegetarian_friendly",
        "group_friendly",
        "garden",
      ],
      price: "$$",
      hours: { default: "Daily 9:00 AM-11:00 PM" },
      officialUrl:
        "https://www.tripadvisor.com/Restaurant_Review-g294207-d1082842-Reviews-Habesha-Nairobi.html",
      sourcePhoto:
        "https://images.happycow.net/venues/1024/42/44/hcmp424486_2965842.jpeg",
      imagePage:
        "https://www.happycow.net/reviews/habesha-ethiopian-restaurant-nairobi-424486",
      editorialUrls: [editorial.value],
    },
  },
  regis: {
    name: "Regis Café & Restaurant",
    coordinates: [-1.2897773, 36.7873424],
    description:
      "Regis fills Mihrab Tower with Somali breakfasts, goat and chicken mandi, rice platters, grilled fish, and fruit drinks across an exceptionally broad all-day schedule.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Somali", "Middle Eastern", "Grill"],
      attributeTags: ["halal", "breakfast", "late_night", "group_friendly"],
      price: "$$",
      hours: { default: "Daily 7:00 AM-2:00 AM" },
      officialUrl: "https://www.regisrestaurant.co.ke/",
      sourcePhoto:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Full%20Mandi%20with%20rice-NzTYJjG1sECfS7Jtr3rYUWtImWNXbm.jpg",
      editorialUrls: [editorial.value],
    },
  },
  wasp: {
    name: "Wasp & Sprout",
    coordinates: [-1.251967, 36.7565588],
    description:
      "Wasp & Sprout pairs a Loresho café with locally made furniture and homewares, making it useful for coffee, brunch, salads, and a slower browse beyond the center.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "cafe",
      cuisineTypes: ["Cafe", "Brunch", "International"],
      attributeTags: ["brunch", "design", "quiet", "vegetarian_friendly"],
      price: "$$",
      hours: {
        mon: "8:00 AM-4:00 PM",
        tue: "8:00 AM-9:00 PM",
        wed: "8:00 AM-9:00 PM",
        thu: "8:00 AM-9:00 PM",
        fri: "8:00 AM-9:00 PM",
        sat: "8:00 AM-9:00 PM",
        sun: "8:00 AM-5:00 PM",
      },
      officialUrl: "https://www.waspandsprout.com/contact",
      sourcePhoto:
        "https://static.wixstatic.com/media/214018_c715f486522b4e7e8026de364e7d2f88~mv2.jpg",
      editorialUrls: [editorial.value],
    },
  },
  tinRoof: {
    name: "Tin Roof Café — Karen",
    coordinates: [-1.3174986, 36.7039175],
    description:
      "Tin Roof's garden at The Souk is an easy daytime stop for salads, wraps, burgers, smoothies, and clearly marked vegan or gluten-free choices beside small local shops.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "cafe",
      cuisineTypes: ["Cafe", "Healthy", "International"],
      attributeTags: [
        "garden",
        "family_friendly",
        "vegan_friendly",
        "gluten_free",
      ],
      price: "$$",
      hours: { default: "Daily 7:30 AM-5:30 PM" },
      officialUrl: "https://www.tinroof.cafe/tin-roof-cafe-karen",
      sourcePhoto:
        "https://images.squarespace-cdn.com/content/v1/5a127d79017db2e2b0be7947/1512483909845-JAXSKRLBFNDO55HOIUBE/Tin%2BRoof%2BCafe%2Bgarden.jpg",
      editorialUrls: [editorial.value],
    },
  },
  roadhouse: {
    name: "Road House Grill — Kilimani",
    coordinates: [-1.2849401, 36.7931569],
    description:
      "Road House is strongest as a no-fuss nyama choma and mutura stop, with Kenyan grills, cold beer, football screens, and enough outdoor space for groups.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "pub",
      cuisineTypes: ["Kenyan", "Barbecue", "Pub food"],
      attributeTags: ["budget", "nyama_choma", "sports", "group_friendly"],
      price: "$$",
      hours: { default: "Daily 11:00 AM-11:00 PM" },
      officialUrl: "https://roadhouse.co.ke/",
      sourcePhoto: "https://roadhouse.co.ke/img/hero_bg_1.jpg",
      editorialUrls: [editorial.value, editorial.nightlife],
    },
  },
  nsk: {
    name: "Nairobi Street Kitchen",
    coordinates: [-1.2654934, 36.8043092],
    description:
      "Nairobi Street Kitchen turns a Westlands warehouse into a multi-vendor food and drink hall, letting groups mix tacos, Indian plates, burgers, desserts, cocktails, and live programming.",
    options: {
      venueKind: "food_drink",
      foodServiceType: "fast_casual",
      cuisineTypes: ["Global street food", "International"],
      attributeTags: [
        "food_hall",
        "group_friendly",
        "late_night",
        "live_music",
      ],
      price: "$$",
      hours: {
        mon: "8:00 AM-10:00 PM",
        tue: "8:00 AM-11:00 PM",
        wed: "8:00 AM-11:00 PM",
        thu: "8:00 AM-4:00 AM",
        fri: "8:00 AM-4:00 AM",
        sat: "8:00 AM-4:00 AM",
        sun: "8:00 AM-11:00 PM",
      },
      officialUrl: "https://nairobistreetkitchen.com/",
      sourcePhoto:
        "https://i0.wp.com/observer.ug/wp-content/uploads/2023/01/Nairobi-Street-Kitchen.jpg?fit=760%2C493&ssl=1",
      imagePage:
        "https://observer.ug/lifestyle-entertainment/if-only-nairobi-street-kitchen-actually-had-kenyan-flavours/",
      editorialUrls: [editorial.value, editorial.nightlife],
    },
  },

  giraffeManor: {
    name: "Giraffe Manor",
    coordinates: [-1.3753869, 36.744518],
    description:
      "This twelve-room Karen manor is reserved for staying guests during its signature giraffe breakfasts and afternoon visits, linking a high-cost hotel ritual to the adjacent conservation program.",
    options: {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: [
        "boutique",
        "wildlife",
        "all_inclusive",
        "advance_booking",
      ],
      price: "$$$$",
      hours: {
        default:
          "Guest access daily; check-in from 12:00 PM and check-out by 10:00 AM according to the official property page",
      },
      officialUrl:
        "https://www.thesafaricollection.com/properties/giraffe-manor/",
      bookingUrl:
        "https://www.thesafaricollection.com/properties/giraffe-manor/rates/",
      sourcePhoto:
        "https://atta.travel/static/86755122-0145-4399-8118348e95ee6584/slideshowgallery_0c1be35008bd5371800693e388002979_f719d893132e/Giraffe-Manor-Photographed-by-Brian-Siambi-108.jpg",
      imagePage: "https://atta.travel/organisation/the-safari-collection.html",
    },
  },
  hemingways: {
    name: "Hemingways Nairobi",
    coordinates: [-1.3430551, 36.7038654],
    description:
      "Hemingways is a quiet Karen all-suite hotel with terraces facing the Ngong Hills, dedicated butler service, a spa, and convenient access to the area's wildlife circuit.",
    options: {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["luxury", "quiet", "spa", "butler_service"],
      price: "$$$$",
      hours: {
        default:
          "Guest access daily; check-in from 1:00 PM and check-out by 10:00 AM according to the current property page",
      },
      officialUrl: "https://www.hemingways-collection.com/nairobi/stay/",
      bookingUrl:
        "https://www.booking.com/hotel/ke/hemingways-nairobi.en-gb.html",
      sourcePhoto:
        "https://www.hemingways-collection.com/wp-content/uploads/2025/07/stay-Banner.webp",
    },
  },
  tribe: {
    name: "Tribe Hotel",
    coordinates: [-1.2303, 36.804],
    description:
      "Tribe folds a substantial African art collection, strong contemporary design, Jiko restaurant, and Kaya Spa into a Gigiri base directly connected to Village Market.",
    options: {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["design", "art", "spa", "shopping"],
      price: "$$$$",
      hours: {
        default:
          "Guest access daily; check-in from 2:00 PM and check-out by 12:00 PM according to the current property page",
      },
      officialUrl:
        "https://www.marriott.com/en-us/hotels/nbods-tribe-hotel-nairobi-a-member-of-design-hotels/overview/",
      bookingUrl: "https://www.booking.com/hotel/ke/tribe-nairobi.html",
      sourcePhoto:
        "https://cache.marriott.com/is/image/marriotts7prod/ds-nbods-exterior-2-20743%3AClassic-Hor?fit=constrain&wid=1336",
      editorialUrls: [editorial.creativeCity],
    },
  },
  jw: {
    name: "JW Marriott Hotel Nairobi",
    coordinates: [-1.2672, 36.8084],
    description:
      "JW Marriott's twin Westlands towers provide a full urban-resort setup: spacious rooms, two pools, a serious spa, four restaurants, and quick access to Museum Hill.",
    options: {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["luxury", "spa", "business", "rooftop_pool"],
      price: "$$$$",
      hours: {
        default:
          "Guest access daily; check-in from 3:00 PM and check-out by 12:00 PM according to the current property page",
      },
      officialUrl:
        "https://www.marriott.com/en-us/hotels/nbojw-jw-marriott-hotel-nairobi/overview/",
      bookingUrl:
        "https://www.booking.com/hotel/ke/jw-marriott-nairobi.en-gb.html",
      sourcePhoto:
        "https://cache.marriott.com/is/image/marriotts7prod/jw-nbojw-exterior-36813-20037%3AWide-Ver?fit=constrain&wid=750",
    },
  },
  kempinski: {
    name: "Villa Rosa Kempinski",
    coordinates: [-1.2714834, 36.8090925],
    description:
      "The pink Chiromo Road tower works as a traditional full-service luxury choice, with a broad spa, multiple restaurants, and direct access to Westlands without sitting inside its busiest blocks.",
    options: {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["luxury", "spa", "business", "full_service"],
      price: "$$$$",
      hours: {
        default:
          "Guest access daily; check-in from 2:00 PM and check-out by 12:30 PM according to the current booking page",
      },
      officialUrl: "https://www.kempinski.com/en/hotel-villa-rosa",
      bookingUrl: "https://www.booking.com/hotel/ke/villa-rosa-kempinski.html",
      sourcePhoto:
        "https://storage.kempinski.com/cdn-cgi/image/w=1920,f=auto,fit=scale-down/ki-cms-prod/images/2/7/3/7/16957372-2-eng-GB/bc27c397b83f-84100099_4K.jpg",
    },
  },
  norfolk: {
    name: "Fairmont The Norfolk",
    coordinates: [-1.2781088, 36.8164987],
    description:
      "The Norfolk's early-twentieth-century buildings and tropical courtyards place a complicated colonial-era landmark beside the university, National Theatre, and central museums; the location rewards historical context.",
    options: {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["historic", "garden", "central", "full_service"],
      price: "$$$$",
      hours: {
        default:
          "Guest access daily; check-in 12:00 PM-midnight and check-out by 10:00 AM according to the official property page",
      },
      officialUrl:
        "https://www.fairmont.com/en/hotels/nairobi/fairmont-the-norfolk.html",
      bookingUrl: "https://www.booking.com/hotel/ke/fairmont-the-norfolk.html",
      sourcePhoto: "https://m.ahstatic.com/is/image/accorhotels/aja_p_6435-06",
    },
  },
  serena: {
    name: "Nairobi Serena Hotel",
    coordinates: [-1.2872567, 36.8143511],
    description:
      "Serena sits in gardens beside Central Park, using pan-African art and architectural references throughout a substantial business hotel with a respected spa and outdoor pool.",
    options: {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["central", "garden", "spa", "business"],
      price: "$$$$",
      hours: {
        default:
          "Guest access daily; check-in from 2:00 PM and check-out by 11:00 AM according to the current property booking page",
      },
      officialUrl: "https://www.serenahotels.com/nairobi/",
      bookingUrl: "https://www.booking.com/hotel/ke/nairobi-serena.html",
      sourcePhoto:
        "https://image-tc.galaxy.tf/wijpeg-48gx6z79oos6l57ssfktald6r/hotel-front-exterior.jpg?height=1066&width=1600",
    },
  },
  socialHouse: {
    name: "The Social House Nairobi",
    coordinates: [-1.28072, 36.7681169],
    description:
      "The Social House treats the hotel as a sociable Lavington address, with expressive contemporary rooms and four distinct restaurants and bars that draw non-guests throughout the week.",
    options: {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["design", "boutique", "food_focused", "lively"],
      price: "$$$",
      hours: {
        default:
          "Guest access daily; check-in 2:00 PM-12:00 AM and check-out 10:00 AM-11:00 AM according to the booking page",
      },
      officialUrl: "https://thesocialhouse.ke/",
      bookingUrl:
        "https://www.booking.com/hotel/ke/the-social-house.en-gb.html",
      sourcePhoto:
        "https://thesocialhouse.ke/assets/images/homepage/sliders/exterior.webp",
    },
  },
  kwetu: {
    name: "Kwetu Nairobi, Curio Collection by Hilton",
    coordinates: [-1.2420381, 36.79155],
    description:
      "Kwetu spreads 102 rooms across five low-rise blocks by Karura Forest, favoring residential calm, canopy views, a landscaped pool, and several food-and-drink spaces over tower-hotel scale.",
    options: {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["design", "quiet", "nature_access", "pool"],
      price: "$$$$",
      hours: {
        default:
          "Guest access daily; check-in from 2:00 PM and check-out by 12:00 PM according to the official property page",
      },
      officialUrl: "https://www.hilton.com/en/hotels/nboknqq-kwetu-nairobi/",
      bookingUrl:
        "https://www.booking.com/hotel/ke/kwetu-nairobi-curio-collection-by-hilton.html",
      sourcePhoto:
        "https://www.americanexpress.com/en-us/travel/discover/photos/483442/135709/1200/2.jpg",
      imagePage:
        "https://www.americanexpress.com/en-us/travel/discover/property/Kenya/Nairobi/Kwetu-Nairobi-Curio-Collection-By-Hilton",
    },
  },
  stanley: {
    name: "Sarova Stanley",
    coordinates: [-1.2843832, 36.82274],
    description:
      "Nairobi's oldest operating luxury hotel keeps travelers directly in the CBD, with heritage tours, the Thorn Tree Café, Exchange Bar, Thai Chi, and a compact rooftop pool.",
    options: {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["historic", "central", "heritage", "business"],
      price: "$$$",
      hours: {
        default:
          "Guest access daily; check-in from 2:00 PM and check-out by 11:00 AM according to the official property page",
      },
      officialUrl: "https://www.sarovahotels.com/stanley-nairobi/",
      bookingUrl: "https://www.booking.com/hotel/ke/sarova-stanley.html",
      sourcePhoto:
        "https://www.sarovahotels.com/assets/images/Sarova-Stanley-blog.jpg",
    },
  },

  jabulani: {
    name: "Jabulani Backpackers Hostels",
    coordinates: [-1.2616032, 36.7967688],
    description:
      "Jabulani is the most overtly social Westlands option, pairing dorms and lockers with daily group activities, breakfast, tour help, and a location walkable to major malls.",
    options: {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: [
        "social",
        "solo_traveller",
        "events",
        "breakfast_included",
      ],
      price: "$",
      hours: {
        default:
          "Guest access daily; check-in 3:00 PM-10:00 PM and check-out by 11:00 AM",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/322779/jabulani-backpackers-hostels/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/322779/jabulani-backpackers-hostels/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/322779/fdrquj1u21mqoptx7cfj.jpg",
      imagePage:
        "https://www.hostelworld.com/hostels/p/322779/jabulani-backpackers-hostels/",
    },
  },
  madVervet: {
    name: "Mad Vervet Nairobi Backpackers Hostel",
    coordinates: [-1.2956, 36.7681],
    description:
      "Mad Vervet is a small Lavington backpacker base with dorms, a garden, shared kitchen, board games, and city-tour help, better suited to sociable budget travelers than polished facilities.",
    options: {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["social", "garden", "shared_kitchen", "budget"],
      price: "$",
      hours: {
        default:
          "Guest access daily; check-in 2:00 PM-12:00 AM and check-out by 12:00 PM",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/320662/mad-vervet-nairobi-backpackers-hostel/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/320662/mad-vervet-nairobi-backpackers-hostel/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/320662/j03cbqy5ao1aysn4cnhv.jpg",
      imagePage:
        "https://www.hostelworld.com/hostels/p/320662/mad-vervet-nairobi-backpackers-hostel/",
    },
  },
  libraryHostel: {
    name: "The Library Hostel",
    coordinates: [-1.2744974, 36.7903709],
    description:
      "This women-founded Kileleshwa hostel centers a real reading room and supports a literacy foundation, while its garden, generous beds, kitchen, and quiet street favor decompression over parties.",
    options: {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["quiet", "books", "garden", "breakfast_included"],
      price: "$",
      hours: {
        default:
          "Guest access daily; check-in 2:00 PM-10:00 PM and check-out by 11:00 AM; reception is open 24 hours",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/326779/the-library-hostel/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/326779/the-library-hostel/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/326779/fer7obxmdtp4lkbzfvdn.jpg",
      imagePage:
        "https://www.hostelworld.com/hostels/p/326779/the-library-hostel/",
    },
  },
  xenia: {
    name: "Xenia Backpackers",
    coordinates: [-1.3098, 36.7878],
    description:
      "Xenia is a compact Ngong Road budget hostel whose strongest practical assets are security lockers, luggage storage, a travel desk, and balcony views toward Ngong Hills.",
    options: {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "balcony", "lockers", "travel_desk"],
      price: "$",
      hours: {
        default:
          "Guest access daily; check-in 1:00 PM-10:00 PM and check-out by 11:00 AM",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/339223/xenia-backpackers/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/339223/xenia-backpackers/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/339223/s9eizrtepl6ivmrlg2tj.jpg",
      imagePage:
        "https://www.hostelworld.com/hostels/p/339223/xenia-backpackers/",
    },
  },
  zzz: {
    name: "ZZZ Hostel Limited — Lavington",
    coordinates: [-1.3001, 36.7507],
    description:
      "ZZZ is a newer, lightly reviewed hostel-and-restaurant at The Werks on Hatheru Road; its broad arrival window helps late transfers, but facilities remain basic and evolving.",
    options: {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "late_check_in", "basic", "pet_friendly"],
      price: "$",
      hours: {
        default:
          "Guest access daily; check-in 12:00 AM-11:00 PM and check-out by 9:00 AM",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/335519/zzz-hostel-limited-lavinton/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/335519/zzz-hostel-limited-lavinton/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/335519/y3lnmookwtxk8jnhdito.jpg",
      imagePage:
        "https://www.hostelworld.com/hostels/p/335519/zzz-hostel-limited-lavinton/",
    },
  },
  indovu: {
    name: "Indovu Back Packers",
    coordinates: [-1.3605, 36.6812],
    description:
      "Indovu is a far-out Karen hostel with two-person shared rooms, lockers, breakfast, common spaces, and twenty-four-hour reception; choose it for calm rather than central access.",
    options: {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["quiet", "breakfast_included", "lockers", "remote"],
      price: "$",
      hours: {
        default:
          "Guest access daily; check-in 3:00 PM-11:00 PM and check-out 8:00 AM-11:00 AM; reception is open 24 hours",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/325323/indovu-back-packers/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/325323/indovu-back-packers/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/325323/etuokb1lkuo5umbhieix.jpg",
      imagePage:
        "https://www.hostelworld.com/hostels/p/325323/indovu-back-packers/",
    },
  },
  wenizani: {
    name: "WeniZani Backpackers Hostel Nairobi",
    coordinates: [-1.2895814, 36.7767969],
    description:
      "WeniZani is a small Kileleshwa hostel with a shared kitchen, bar, luggage storage, and cash-only policy, useful for travelers prioritizing residential calm near central districts.",
    options: {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["shared_kitchen", "quiet", "budget", "pet_friendly"],
      price: "$",
      hours: {
        default:
          "Guest access daily; check-in 12:00 PM-10:00 PM and check-out by 10:00 AM",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/338409/wenizani-backpackers-hostel-nairobi/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/338409/wenizani-backpackers-hostel-nairobi/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/338409/yklyyhve77dw5gz1ktor.jpg",
      imagePage:
        "https://www.hostelworld.com/hostels/p/338409/wenizani-backpackers-hostel-nairobi/",
    },
  },
  mlango: {
    name: "Mlango Farm — Ngecha Village",
    coordinates: [-1.1723251, 36.6838734],
    description:
      "Mlango is an all-inclusive farm hostel outside Nairobi proper, with camping-style facilities, organic communal meals, bicycle storage, and a markedly slower rhythm than city accommodation.",
    options: {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["farm_stay", "quiet", "meals_included", "remote"],
      price: "$",
      hours: {
        default:
          "Guest access daily; check-in 10:00 AM-6:00 PM and check-out by 11:00 AM",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/334714/mlango-farm-all-inclusive-ngecha-village-near-nairobi/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/334714/mlango-farm-all-inclusive-ngecha-village-near-nairobi/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/334714/gt9fqzowhpwdgnbkljlv.jpg",
      imagePage:
        "https://www.hostelworld.com/hostels/p/334714/mlango-farm-all-inclusive-ngecha-village-near-nairobi/",
    },
  },
  pinkRoses: {
    name: "PinkRoses Gardens Hostel",
    coordinates: [-1.3151214, 36.8257999],
    description:
      "PinkRoses is a very basic garden hostel near Wilson Airport, with shared kitchen, breakfast, pool table, and family facilities; recent feedback makes expectations management essential.",
    options: {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "airport_access", "shared_kitchen", "basic"],
      price: "$",
      hours: {
        default:
          "Guest access daily; check-in 6:00 AM-10:00 PM and check-out by 9:00 PM",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/313956/pinkroses-gardens-hostel/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/313956/pinkroses-gardens-hostel/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/313956/unfsh5x9ort4a1p0ivgz.jpg",
      imagePage:
        "https://www.hostelworld.com/hostels/p/313956/pinkroses-gardens-hostel/",
    },
  },
  wildebeest: {
    name: "Wildebeest Eco Camp",
    coordinates: [-1.3276294, 36.7556615],
    description:
      "Wildebeest is a three-and-a-half-acre Karen camp with one mixed dorm alongside camping and private tents, plus a pool, garden, meals, lockers, and an established travel desk.",
    options: {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["dorm", "camping", "pool", "garden"],
      price: "$",
      hours: {
        default:
          "Guest access daily; check-in 2:00 PM-11:00 PM and check-out by 11:00 AM",
      },
      officialUrl:
        "https://www.hostelworld.com/bed-and-breakfasts/p/22117/wildebeest-eco-camp/",
      bookingUrl:
        "https://www.hostelworld.com/bed-and-breakfasts/p/22117/wildebeest-eco-camp/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/22117/1.jpg",
      imagePage:
        "https://www.hostelworld.com/bed-and-breakfasts/p/22117/wildebeest-eco-camp/",
    },
  },
} satisfies Record<string, VenueSeed>;

const moreVenues = {
  k1: {
    name: "K1 Klub House",
    coordinates: [-1.26846, 36.8118717],
    description:
      "K1 is a long-running Parklands clubhouse where football, DJs, bands, a Sunday flea market, food, and several bar zones coexist without a tightly managed dress-up ritual.",
    options: {
      venueKind: "nightlife",
      nightlifeType: "pub",
      musicGenres: ["Afrobeats", "reggae", "live bands"],
      attributeTags: ["casual_nightlife", "sports", "live_music", "market"],
      price: "$$",
      hours: {
        default:
          "Daily 10:00 AM-12:00 AM; later programming follows the official event calendar",
      },
      officialUrl: "https://www.klubhouse.co.ke/",
      sourcePhoto:
        "https://pub-5bcc3edf34304d04b59dc91e1ad9d2fd.r2.dev/kenya.tortoisepath.com/uploads/2024/06/13182541/K1-Klub-House-Nairobi-Kenya-TortoisePathcom-10-1024x768.jpeg",
      imagePage: "https://kenya.tortoisepath.com/place/k1-klub-house/",
      editorialUrls: [editorial.nightlife],
    },
  },
  alchemist: {
    name: "The Alchemist",
    coordinates: [-1.2626794, 36.8038886],
    description:
      "The Alchemist is an open-air Westlands compound rather than a single bar, combining rotating food counters, shops, film, art, DJs, and concerts around a large shared yard.",
    options: {
      venueKind: "nightlife",
      nightlifeType: "live_music_venue",
      musicGenres: ["Afrobeats", "electronic", "hip-hop"],
      attributeTags: ["live_music", "open_air", "creative_crowd", "late_night"],
      price: "$$",
      hours: {
        default:
          "Daily from 12:00 PM; closing and ticketed-night access follow the official event calendar",
      },
      officialUrl: "https://www.alchemist254.com/",
      sourcePhoto:
        "https://guide.en-vols.com/wp-content/uploads/aftg/2022/06/NBO-the-alchemist-bar-une-chimie-reussie-2_1-1920x960-3.jpg",
      imagePage:
        "https://guide.en-vols.com/en/adresse/the-alchemist-bar-for-successful-chemistry/",
      editorialUrls: [editorial.nightlife],
    },
  },
  brew: {
    name: "Brew Bistro Fortis",
    coordinates: [-1.2648361, 36.8040795],
    description:
      "Brew Bistro puts a local microbrewery, pub menu, sports screens, salsa nights, and a late rooftop party in Fortis Tower, with the mood changing sharply after dinner.",
    options: {
      venueKind: "nightlife",
      nightlifeType: "brewery",
      musicGenres: ["DJs", "salsa", "Afrobeats"],
      attributeTags: ["craft_beer", "rooftop", "sports", "late_night"],
      price: "$$",
      hours: { default: "Daily 11:00 AM-5:00 AM" },
      officialUrl: "https://brewbistrokenya.co.ke/",
      sourcePhoto:
        "https://innairobi.com/wp-content/uploads/2024/04/brew-bistro-and-lounge-600-1-jpg.webp",
      imagePage: "https://innairobi.com/brew-bistro-rooftop/",
      editorialUrls: [editorial.nightlife],
    },
  },
  geco: {
    name: "Geco Café",
    coordinates: [-1.2930725, 36.7621693],
    description:
      "Geco is a book-lined Lavington café-bar built around a compact stage, with recurring jazz, reggae, and acoustic sets that keep the music closer than at larger clubs.",
    options: {
      venueKind: "nightlife",
      nightlifeType: "live_music_venue",
      musicGenres: ["jazz", "reggae", "acoustic"],
      attributeTags: ["live_music", "intimate", "casual_nightlife", "books"],
      price: "$$",
      hours: {
        default:
          "Daily 8:00 AM-11:00 PM; performance times follow Geco's official event calendar",
      },
      officialUrl: "http://www.gecotribe.com/",
      sourcePhoto:
        "https://www.upkenya.com/wp-content/uploads/2020/11/geco-819x1024.jpg",
      imagePage: "https://www.upkenya.com/place/geco-cafe/",
      editorialUrls: [editorial.nightlife],
    },
  },
  havana: {
    name: "Havana Bar & Restaurant",
    coordinates: [-1.2641774, 36.8044091],
    description:
      "Havana's Woodvale Grove terrace is a durable late-night Westlands choice for mojitos, pub food, football, and dancing, with progressively later closing toward the weekend.",
    options: {
      venueKind: "nightlife",
      nightlifeType: "pub",
      musicGenres: ["Latin", "Afrobeats", "DJs"],
      attributeTags: ["late_night", "terrace", "sports", "casual_nightlife"],
      price: "$$",
      hours: {
        mon: "12:00 PM-1:00 AM",
        tue: "12:00 PM-2:00 AM",
        wed: "12:00 PM-3:00 AM",
        thu: "12:00 PM-2:00 AM",
        fri: "12:00 PM-4:00 AM",
        sat: "12:00 PM-4:00 AM",
        sun: "12:00 PM-12:00 AM",
      },
      officialUrl: "https://havana.co.ke/",
      sourcePhoto:
        "https://www.upkenya.com/wp-content/uploads/2020/11/havana-bar-1024x703.jpg",
      imagePage: "https://www.upkenya.com/place/havana-bar-2/",
      editorialUrls: [editorial.nightlife],
    },
  },
  livingRooms: {
    name: "The Living Rooms",
    coordinates: [-1.27653, 36.8245358],
    description:
      "This Ngara house-gallery feels deliberately domestic, bringing a creative crowd together for cocktails, art sales, conversation, and small live sets rather than a conventional club night.",
    options: {
      venueKind: "nightlife",
      nightlifeType: "live_music_venue",
      musicGenres: ["soul", "jazz", "acoustic"],
      attributeTags: ["creative_crowd", "art", "intimate", "live_music"],
      price: "$$",
      hours: {
        default:
          "Opening nights and performance times follow The Living Rooms' dated official event calendar",
      },
      officialUrl: "https://www.instagram.com/thelivingroomsnairobi/",
      sourcePhoto:
        "https://image.okayafrica.com/1419168.webp?format=jpg&height=548&imageId=1419168&width=960",
      imagePage:
        "https://www.okayafrica.com/whimsy-in-the-city-what-ngaras-revival-reveals-about-nairobi/1419156",
      editorialUrls: [editorial.creativeCity, editorial.nightlife],
    },
  },
  crafty: {
    name: "Crafty Chameleon Brewery",
    coordinates: [-1.2820678, 36.7664316],
    description:
      "Crafty Chameleon brews on site in Lavington and backs the taps with weekend brunch, barbecue, pizza, cigars, games, and an unhurried garden-like compound.",
    options: {
      venueKind: "nightlife",
      nightlifeType: "brewery",
      musicGenres: ["DJs", "live bands"],
      attributeTags: [
        "craft_beer",
        "casual_nightlife",
        "garden",
        "group_friendly",
      ],
      price: "$$",
      hours: {
        mon: "12:00 PM-11:30 PM",
        tue: "12:00 PM-11:30 PM",
        wed: "12:00 PM-11:30 PM",
        thu: "12:00 PM-11:30 PM",
        fri: "12:00 PM-11:30 PM",
        sat: "10:00 AM-11:30 PM",
        sun: "10:00 AM-11:30 PM",
      },
      officialUrl: "https://craftychameleon.co.ke/our-menu/",
      sourcePhoto:
        "https://craftychameleon.co.ke/wp-content/uploads/2026/07/Beer-Website64.jpg",
      editorialUrls: [editorial.nightlife],
    },
  },
  barNextDoor: {
    name: "The Bar Next Door — Kileleshwa",
    coordinates: [-1.2873714, 36.7727904],
    description:
      "The Othaya Road branch starts as an easy indoor-outdoor neighborhood bar, then turns louder around its nightly DJ themes, communal tables, screens, and late crowd.",
    options: {
      venueKind: "nightlife",
      nightlifeType: "lounge",
      musicGenres: ["Afrobeats", "hip-hop", "DJs"],
      attributeTags: ["open_air", "group_friendly", "late_night", "djs"],
      price: "$$",
      hours: {
        default:
          "Daily 12:00 PM-5:00 AM; each themed night follows the official event calendar",
      },
      officialUrl: "https://thebarnexdoorkenya.com/",
      sourcePhoto:
        "https://thebarnexdoorkenya.com/wp-content/uploads/2026/02/best-clubs-near-me-1024x576.webp",
      editorialUrls: [editorial.nightlife],
    },
  },

  balcony: {
    name: "The Balcony Bar",
    coordinates: [-1.2714834, 36.8090925],
    description:
      "Villa Rosa's lobby-level terrace specializes in infused cocktails, whisky, and cigars, offering a quieter open-air option before the hotel's later rooftop venues gather momentum.",
    options: {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      musicGenres: ["lounge"],
      attributeTags: ["hotel_bar", "terrace", "whisky", "quiet"],
      price: "$$$",
      hours: { default: "Daily 12:00 PM-1:00 AM" },
      officialUrl:
        "https://www.kempinski.com/en/hotel-villa-rosa/restaurants-bars/balcony-bar",
      sourcePhoto:
        "https://storage.kempinski.com/cdn-cgi/image/w=1920,f=auto,fit=scale-down/ki-cms-prod/images/0/3/1/2/202130-1-eng-GB/4ab1cddd4b1d-73657539_4K.jpg",
    },
  },
  tambourin: {
    name: "Tambourin",
    coordinates: [-1.2714834, 36.8090925],
    description:
      "Tambourin occupies Villa Rosa's rooftop with cabanas, Middle Eastern snacks, shisha, and sunset cocktails; it is more relaxed lounge than precision drinking room.",
    options: {
      venueKind: "nightlife",
      nightlifeType: "rooftop_bar",
      musicGenres: ["lounge", "DJs"],
      attributeTags: ["rooftop", "hotel_bar", "sunset", "shisha"],
      price: "$$$",
      hours: {
        mon: "5:00 PM-12:00 AM",
        tue: "5:00 PM-12:00 AM",
        wed: "5:00 PM-12:00 AM",
        thu: "5:00 PM-12:00 AM",
        fri: "5:00 PM-12:00 AM",
        sat: "5:00 PM-12:00 AM",
        sun: "Closed",
      },
      officialUrl:
        "https://www.kempinski.com/en/hotel-villa-rosa/restaurants-bars/tambourin",
      sourcePhoto:
        "https://storage.kempinski.com/cdn-cgi/image/w=1920,f=auto,fit=scale-down/ki-cms-prod/images/0/0/1/2/202100-1-eng-GB/4d50d0e4b6bd-73657583_4K.jpg",
    },
  },
  sarabi: {
    name: "Sarabi Rooftop",
    coordinates: [-1.2624009, 36.8023845],
    description:
      "Sarabi wraps Sankara's rooftop pool with city views, cocktails, tapas, and scheduled DJs or bands, working best around sunset before Westlands shifts into club hours.",
    options: {
      venueKind: "nightlife",
      nightlifeType: "rooftop_bar",
      musicGenres: ["DJs", "live bands"],
      attributeTags: ["rooftop", "poolside", "sunset", "hotel_bar"],
      price: "$$$",
      hours: {
        default:
          "Daily 12:00 PM-12:00 AM; live sets follow the official event calendar",
      },
      officialUrl: "https://sankara.com/dining/sarabi-rooftop-restaurant-bar/",
      sourcePhoto:
        "https://sankara.com/media/images/Pool.2e16d0ba.fill-1200x630.jpg",
    },
  },
  upepo: {
    name: "Upepo",
    coordinates: [-1.2420381, 36.79155],
    description:
      "Upepo rises into the trees at Kwetu, using Karura Forest views, East African-inflected plates, and a cocktail list to create one of Nairobi's calmest rooftop evenings.",
    options: {
      venueKind: "nightlife",
      nightlifeType: "rooftop_bar",
      musicGenres: ["lounge", "DJs"],
      attributeTags: ["rooftop", "forest_view", "hotel_bar", "sunset"],
      price: "$$$",
      hours: {
        mon: "5:00 PM-11:00 PM",
        tue: "5:00 PM-11:00 PM",
        wed: "5:00 PM-11:00 PM",
        thu: "5:00 PM-11:00 PM",
        fri: "3:00 PM-1:00 AM",
        sat: "12:00 PM-1:00 AM",
        sun: "12:00 PM-11:00 PM",
      },
      officialUrl:
        "https://www.hilton.com/en/hotels/nboknqq-kwetu-nairobi/dining/",
      sourcePhoto:
        "https://www.americanexpress.com/en-us/travel/discover/photos/483442/117464/1200/UPEPO%2Ejpg",
      imagePage:
        "https://www.americanexpress.com/en-us/travel/discover/property/Kenya/Nairobi/Kwetu-Nairobi-Curio-Collection-By-Hilton",
      editorialUrls: [
        "https://www.tripadvisor.com/Restaurant_Review-g294207-d27497618-Reviews-Upepo-Nairobi.html",
      ],
    },
  },
  inca: {
    name: "Inca",
    coordinates: [-1.28072, 36.7681169],
    description:
      "Inca gives The Social House a color-saturated Peruvian rooftop, built around ceviche, anticuchos, pisco cocktails, weekend DJs, and a later social pulse than the hotel's other restaurants.",
    options: {
      venueKind: "nightlife",
      nightlifeType: "rooftop_bar",
      musicGenres: ["Latin", "DJs"],
      attributeTags: ["rooftop", "pisco", "hotel_bar", "djs"],
      price: "$$$",
      hours: {
        mon: "1:00 PM-11:00 PM",
        tue: "1:00 PM-11:00 PM",
        wed: "1:00 PM-11:00 PM",
        thu: "1:00 PM-11:00 PM",
        fri: "1:00 PM-11:00 PM",
        sat: "1:00 PM-1:00 AM",
        sun: "1:00 PM-1:00 AM",
      },
      officialUrl: "https://thesocialhouse.ke/restaurants/",
      bookingUrl: "https://www.opentable.com/r/inca-the-social-house-nairobi",
      sourcePhoto:
        "https://www.thesocialhouse.ke/assets/images/restaurants/restaurants.jpg",
    },
  },
  botanica: {
    name: "Botanica Kitchen & Gin Bar",
    coordinates: [-1.2653801, 36.8017428],
    description:
      "Botanica uses the seventh floor of One Africa Place for a garden-like gin bar, broad botanical list, contemporary food, and a calmer date-night tempo than higher-energy rooftops.",
    options: {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      musicGenres: ["lounge"],
      attributeTags: ["gin", "garden", "date_night", "terrace"],
      price: "$$$",
      hours: { default: "Daily 9:00 AM-10:00 PM" },
      officialUrl:
        "https://www.thefoodlibrary.co.ke/botanica-kitchen-and-gin-bar/",
      sourcePhoto:
        "https://www.thefoodlibrary.co.ke/wp-content/uploads/2023/11/400063509_18052801741497728_414489179681841678_n.jpg",
    },
  },

  nationalMuseum: {
    name: "Nairobi National Museum",
    coordinates: [-1.2739492, 36.8150071],
    description:
      "Kenya's flagship museum puts early-human fossils, natural history, contemporary art, and cultural collections in one complex; the adjacent Snake Park requires its own time and ticket choice.",
    options: {
      venueKind: "culture",
      subcategory: "museum",
      attributeTags: ["history", "archaeology", "art", "family_friendly"],
      hours: {
        default:
          "Daily 8:30 AM-5:30 PM; pre-booked night tours for groups of at least ten run 6:00 PM-10:00 PM",
      },
      officialUrl: "https://nmk.go.ke/nairobi-national-museum/",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Nairobi_Museum_entrance_2.JPG/960px-Nairobi_Museum_entrance_2.JPG",
      imagePage:
        "https://commons.wikimedia.org/wiki/File:Nairobi_Museum_entrance_2.JPG",
      editorialUrls: [editorial.museums],
    },
  },
  nairobiGallery: {
    name: "Nairobi Gallery",
    coordinates: [-1.2867778, 36.817874],
    description:
      "The compact former Provincial Commissioner's office at Point Zero houses works and objects from Joseph and Sheila Murumbi's Pan-African collection, making close looking more useful than rushing.",
    options: {
      venueKind: "culture",
      subcategory: "art museum",
      attributeTags: [
        "pan_african_art",
        "historic_building",
        "central",
        "small_museum",
      ],
      hours: { default: "Daily 8:30 AM-5:30 PM" },
      officialUrl: "https://museums.or.ke/nairobi-gallery/",
      sourcePhoto:
        "https://museums.or.ke/wp-content/uploads/2024/02/nairobi-gallery.jpg",
      editorialUrls: [editorial.museums],
    },
  },
  karenBlixen: {
    name: "Karen Blixen Museum",
    coordinates: [-1.3519707, 36.7125131],
    description:
      "Blixen's former coffee-farm house preserves rooms, farm machinery, and film-era objects; visit critically, placing the author's literary legacy inside colonial land and labor history.",
    options: {
      venueKind: "culture",
      subcategory: "historic house museum",
      attributeTags: [
        "literary_history",
        "colonial_history",
        "garden",
        "guided_tour",
      ],
      hours: { default: "Daily 8:30 AM-5:30 PM" },
      officialUrl: "https://museums.or.ke/karen-blixen/",
      sourcePhoto:
        "https://museums.or.ke/wp-content/uploads/2024/02/Karen-Blixen-Museum.jpg",
      editorialUrls: [editorial.museums],
    },
  },
  bomas: {
    name: "Bomas of Kenya",
    coordinates: [-1.3375894, 36.7686673],
    description:
      "Bomas combines reconstructed homesteads with a large performance program representing communities across Kenya; the villages and the dance show run on different clocks, so plan both explicitly.",
    options: {
      venueKind: "culture",
      subcategory: "cultural centre",
      attributeTags: ["dance", "music", "architecture", "family_friendly"],
      hours: {
        mon: "Traditional villages 10:00 AM-6:00 PM; performance 2:30 PM-4:00 PM",
        tue: "Traditional villages 10:00 AM-6:00 PM; performances 11:00 AM-12:15 PM and 2:30 PM-4:00 PM",
        wed: "Traditional villages 10:00 AM-6:00 PM; performance 2:30 PM-4:00 PM",
        thu: "Traditional villages 10:00 AM-6:00 PM; performance 2:30 PM-4:00 PM",
        fri: "Traditional villages 10:00 AM-6:00 PM; performances 11:00 AM-12:15 PM and 2:30 PM-4:00 PM",
        sat: "Traditional villages 10:00 AM-6:00 PM; performance 3:30 PM-5:15 PM",
        sun: "Traditional villages 10:00 AM-6:00 PM; performance 3:30 PM-5:15 PM",
      },
      officialUrl: "https://bomasofkenya.go.ke/live-cultural-performances/",
      bookingUrl: "https://bomasofkenya.go.ke/live-cultural-performances/",
      sourcePhoto:
        "https://bomasofkenya.go.ke/wp-content/uploads/2024/03/Optimized-Cultural-performances-2.jpg",
    },
  },
  circle: {
    name: "Circle Art Gallery",
    coordinates: [-1.2985793, 36.7677935],
    description:
      "Circle's white-cube program at Victoria Square gives a focused read on contemporary East African painting, photography, and sculpture, with exhibitions changing often enough to consult the current page.",
    options: {
      venueKind: "culture",
      subcategory: "contemporary art gallery",
      attributeTags: [
        "contemporary_art",
        "east_african_art",
        "free_entry",
        "design",
      ],
      hours: {
        mon: "10:00 AM-5:00 PM",
        tue: "10:00 AM-5:00 PM",
        wed: "10:00 AM-5:00 PM",
        thu: "10:00 AM-5:00 PM",
        fri: "10:00 AM-5:00 PM",
        sat: "12:00 PM-5:00 PM",
        sun: "12:00 PM-5:00 PM; public holidays closed or by appointment",
      },
      officialUrl: "https://circleartagency.com/contact/",
      sourcePhoto:
        "https://static-assets.artlogic.net/w_750,c_limit,f_auto,fl_lossy,q_auto/ws-artlogicwebsite1254/usr/images/feature_panels/image/items/f8/f8be8efaa6524958bec8d41f12b7d513/danda-jaroljmek-portrait-viewing-room.jpg",
      editorialUrls: [editorial.creativeCity],
    },
  },
  ncai: {
    name: "Nairobi Contemporary Art Institute",
    coordinates: [-1.2160562, 36.7994355],
    description:
      "NCAI is a nonprofit exhibition and research space in Rosslyn Riviera, pairing current East African shows with an expanding art library and free admission.",
    options: {
      venueKind: "culture",
      subcategory: "contemporary art institute",
      attributeTags: ["contemporary_art", "research", "free_entry", "library"],
      hours: {
        mon: "10:00 AM-6:00 PM",
        tue: "10:00 AM-6:00 PM",
        wed: "10:00 AM-6:00 PM",
        thu: "10:00 AM-6:00 PM",
        fri: "10:00 AM-6:00 PM",
        sat: "10:00 AM-6:00 PM",
        sun: "12:00 PM-5:00 PM; public holidays closed",
      },
      officialUrl: "https://www.ncai254.com/",
      sourcePhoto:
        "https://static.wixstatic.com/media/7b6770_f66600c4168746d8ae73977aa5767b35%7Emv2.png/v1/fit/w_2500,h_1330,al_c/7b6770_f66600c4168746d8ae73977aa5767b35%7Emv2.png",
    },
  },
  heritageHouse: {
    name: "African Heritage House",
    coordinates: [-1.4007172, 36.9391632],
    description:
      "Alan Donovan's monumental house above Nairobi National Park brings architecture, textiles, jewelry, sculpture, and the Murumbi legacy together; every visit is guided and pre-arranged.",
    options: {
      venueKind: "culture",
      subcategory: "house museum",
      attributeTags: [
        "pan_african_art",
        "architecture",
        "guided_tour",
        "advance_booking",
      ],
      hours: {
        default:
          "Daily tours, meals, and events require advance booking through the official reservation page; the sundowner dinner tour begins 4:30 PM",
      },
      officialUrl:
        "https://africanheritagehouse.info/portfolio-item/tours-meals-events/",
      bookingUrl:
        "https://africanheritagehouse.info/portfolio-item/tours-meals-events/",
      sourcePhoto:
        "https://africanheritagehouse.info/wp-content/uploads/2016/10/RIFT-VALLEY-RAILWAYS-WANJIRAS-WEDDING-001-e1481018818146-1030x433.jpg",
    },
  },
  nationalTheatre: {
    name: "Kenya National Theatre",
    coordinates: [-1.2786144, 36.8155817],
    description:
      "The Kenya Cultural Centre's main auditorium remains Nairobi's essential stage for plays, dance, spoken word, and music; choose a dated production rather than treating the building as a walk-in museum.",
    options: {
      venueKind: "event_venue",
      subcategory: "theatre",
      attributeTags: ["theatre", "dance", "music", "ticketed"],
      hours: {
        default:
          "Performance access follows the dated programme on the official event calendar; every ticket lists its exact curtain and box-office time",
      },
      officialUrl: "https://www.kenyaculturalcentre.go.ke/",
      bookingUrl: "https://kenyaculturalcentre.ecitizen.go.ke/",
      sourcePhoto:
        "https://www.kenyaculturalcentre.go.ke/wp-content/uploads/2022/07/IMG_79822-e1656924899519.jpeg",
    },
  },
  kazuri: {
    name: "Kazuri Beads Workshop",
    coordinates: [-1.3486919, 36.7054056],
    description:
      "Kazuri's Karen workshop lets pre-booked visitors follow ceramic clay from shaping and firing through painting, then meet makers and buy jewelry at the source.",
    options: {
      venueKind: "culture",
      subcategory: "craft workshop",
      attributeTags: ["craft", "workshop", "shopping", "guided_tour"],
      hours: {
        default:
          "Monday-Saturday workshop tours are by advance arrangement through the official booking page; Sunday closed",
      },
      officialUrl: "https://kazuri.co.ke/pages/our-workshop",
      bookingUrl: "https://kazuri.co.ke/pages/our-workshop",
      sourcePhoto:
        "https://kazuri.co.ke/cdn/shop/files/our_workshop.jpg?v=1724154047&width=2048",
    },
  },
  godown: {
    name: "The GoDown Arts Centre",
    coordinates: [-1.2989783, 36.8293886],
    description:
      "A converted Industrial Area warehouse supports studios, rehearsals, exhibitions, training, and performance, making GoDown most rewarding when a public program opens its working arts ecosystem.",
    options: {
      venueKind: "culture",
      subcategory: "arts centre",
      attributeTags: [
        "working_studios",
        "performance",
        "visual_art",
        "industrial_architecture",
      ],
      hours: {
        mon: "9:00 AM-5:00 PM",
        tue: "9:00 AM-5:00 PM",
        wed: "9:00 AM-5:00 PM",
        thu: "9:00 AM-5:00 PM",
        fri: "9:00 AM-5:00 PM",
        sat: "Public access follows the official event calendar",
        sun: "Closed",
      },
      officialUrl: "https://thegodown.org/",
      sourcePhoto:
        "https://thegodown.org/wp-content/uploads/2022/10/thegodown_banner04.jpg",
    },
  },
  nationalPark: {
    name: "Nairobi National Park",
    coordinates: [-1.3385084, 36.865244],
    description:
      "Kenya's first national park puts black rhino, lion, giraffe, plains game, and hundreds of bird species against the city skyline; an early guided drive materially improves wildlife sightings.",
    options: {
      venueKind: "outdoors",
      subcategory: "national park",
      attributeTags: ["wildlife", "safari", "birding", "advance_booking"],
      hours: {
        default:
          "Daily 6:00 AM-6:00 PM; entry and vehicle payment follow the official KWS booking page",
      },
      officialUrl: "https://kws.go.ke/park/nairobi-national-park/",
      bookingUrl: "https://kws.ecitizen.go.ke/",
      sourcePhoto:
        "https://static.wixstatic.com/media/b9a05c_3cac97acfd2a4a648c7b0bd67533e616~mv2.jpg/v1/fill/w_1000%2Ch_733%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01/b9a05c_3cac97acfd2a4a648c7b0bd67533e616~mv2.jpg",
      imagePage:
        "https://www.beyondforest.org/post/about-nairobi-national-park",
      editorialUrls: [editorial.creativeCity],
    },
  },
  sheldrick: {
    name: "Sheldrick Wildlife Trust Nairobi Nursery",
    coordinates: [-1.3777819, 36.7730492],
    description:
      "The one-hour public visit introduces orphaned elephants during their mud bath and milk feed while staff explain rehabilitation; a confirmed SWT booking and separate KWS park fee are mandatory.",
    options: {
      venueKind: "outdoors",
      subcategory: "wildlife rehabilitation centre",
      attributeTags: [
        "elephants",
        "conservation",
        "timed_entry",
        "advance_booking",
      ],
      hours: {
        default:
          "Daily except December 25, 11:00 AM-12:00 PM; advance booking through the official Nursery page is mandatory",
      },
      officialUrl: "https://www.sheldrickwildlifetrust.org/nursery-visit",
      bookingUrl: "https://www.sheldrickwildlifetrust.org/nursery-visit",
      sourcePhoto:
        "https://artofsafari.travel/wp-content/uploads/2019/08/Stock_Kenya_Nairobi_GaryLotter_ShedrickWildlifeTrust_ElephantOrphanage1.jpg",
      imagePage:
        "https://artofsafari.travel/what-to-do/best-kenya-safaris/nairobi/day-trip/",
    },
  },
  giraffeCentre: {
    name: "Giraffe Centre",
    coordinates: [-1.3765618, 36.7445949],
    description:
      "AFEW's education centre allows close feeding encounters with endangered Nubian giraffes while explaining the breeding and reintroduction program; the short forest nature trail adds useful breathing room.",
    options: {
      venueKind: "outdoors",
      subcategory: "conservation centre",
      attributeTags: [
        "giraffes",
        "conservation",
        "family_friendly",
        "nature_trail",
      ],
      hours: { default: "Daily 9:00 AM-5:00 PM" },
      officialUrl: "https://www.giraffecentre.org/",
      sourcePhoto:
        "https://www.giraffecentre.org/wp-content/uploads/2016/11/giraffe_centre-get-involved-homepage-compressed.jpg",
    },
  },
  karura: {
    name: "Karura Forest",
    coordinates: [-1.2387026, 36.8326048],
    description:
      "Karura's marked walking and cycling routes connect waterfalls, caves, wetlands, picnic areas, and indigenous forest inside the city; use an official gate and photograph the route map.",
    options: {
      venueKind: "outdoors",
      subcategory: "urban forest",
      attributeTags: ["walking", "cycling", "waterfall", "birding"],
      hours: {
        default:
          "Daily 6:00 AM-6:00 PM; last entry 5:45 PM and gates lock 7:00 PM",
      },
      officialUrl: "https://friendsofkarura.org/forest-activities/",
      sourcePhoto:
        "https://friendsofkarura.org/wp-content/uploads/2026/03/FKF-Open-Graph-Thumbnail.jpg",
    },
  },
  arboretum: {
    name: "Nairobi Arboretum",
    coordinates: [-1.2773122, 36.7999011],
    description:
      "Founded in 1907, the arboretum is a central green refuge for labeled tree collections, birding, jogging, and picnics, with a simpler layout than Karura's longer trails.",
    options: {
      venueKind: "outdoors",
      subcategory: "arboretum",
      attributeTags: ["walking", "trees", "birding", "picnic"],
      hours: { default: "Daily 6:00 AM-6:00 PM" },
      officialUrl: "https://nairobiarboretum.org/",
      sourcePhoto:
        "https://nairobiarboretum.org/wp-content/uploads/2025/05/Kinyua-in-Arbo-2.png",
    },
  },
  oloolua: {
    name: "Oloolua Nature Trail",
    coordinates: [-1.3627582, 36.7139348],
    description:
      "A five-kilometer forest loop in Karen passes a waterfall, cave, bamboo stands, and picnic clearings; muddy sections and limited wayfinding make daylight and proper shoes important.",
    options: {
      venueKind: "outdoors",
      subcategory: "nature trail",
      attributeTags: ["walking", "waterfall", "forest", "picnic"],
      hours: {
        default:
          "Daily 9:00 AM-6:00 PM; camping access follows the official booking page",
      },
      officialUrl: "https://nairobipark.org/oloolua-nature-trail/",
      sourcePhoto:
        "https://nairobipark.org/wp-content/uploads/2025/11/Oloolua-Nature-Trail-%E2%80%93-Complete-Guide-to-Nairobis-Hidden-Forest-Escape4.jpg",
    },
  },
} satisfies Record<string, VenueSeed>;

const allVenues = { ...venues, ...moreVenues };
type VenueKey = keyof typeof allVenues;

function venueStop(
  id: string,
  key: VenueKey,
  overrides: Partial<StopOptions> & { description?: string } = {},
) {
  const seed = allVenues[key];
  const { description, ...optionOverrides } = overrides;
  const merged = { ...seed.options, ...optionOverrides };
  return stop(
    id,
    seed.name,
    seed.coordinates,
    description ?? seed.description,
    {
      ...merged,
      officialUrl: merged.officialUrl,
      sourcePhoto: merged.sourcePhoto,
    },
  );
}

const diningStops = [
  venueStop("nairobi-dining-cultiva", "cultiva"),
  venueStop("nairobi-dining-hero", "hero"),
  venueStop("nairobi-dining-talisman", "talisman"),
  venueStop("nairobi-dining-inti", "inti"),
  venueStop("nairobi-dining-mawimbi", "mawimbi"),
  venueStop("nairobi-dining-seven", "seven"),
  venueStop("nairobi-dining-about-thyme", "aboutThyme"),
  venueStop("nairobi-dining-harvest", "harvest"),
  venueStop("nairobi-dining-carnivore", "carnivore"),
  venueStop("nairobi-dining-the-view", "theView"),
];

const cheapEatStops = [
  venueStop("nairobi-value-kosewe", "kosewe"),
  venueStop("nairobi-value-alyusra", "alyusra"),
  venueStop("nairobi-value-cafe-deli", "cafeDeli"),
  venueStop("nairobi-value-mama-ashanti", "mamaAshanti"),
  venueStop("nairobi-value-habesha", "habesha"),
  venueStop("nairobi-value-regis", "regis"),
  venueStop("nairobi-value-wasp-and-sprout", "wasp"),
  venueStop("nairobi-value-tin-roof", "tinRoof"),
  venueStop("nairobi-value-roadhouse-grill", "roadhouse"),
  venueStop("nairobi-value-nairobi-street-kitchen", "nsk"),
];

const hotelStops = [
  venueStop("nairobi-hotel-giraffe-manor", "giraffeManor"),
  venueStop("nairobi-hotel-hemingways", "hemingways"),
  venueStop("nairobi-hotel-tribe", "tribe"),
  venueStop("nairobi-hotel-jw-marriott", "jw"),
  venueStop("nairobi-hotel-villa-rosa-kempinski", "kempinski"),
  venueStop("nairobi-hotel-fairmont-norfolk", "norfolk"),
  venueStop("nairobi-hotel-nairobi-serena", "serena"),
  venueStop("nairobi-hotel-social-house", "socialHouse"),
  venueStop("nairobi-hotel-kwetu", "kwetu"),
  venueStop("nairobi-hotel-sarova-stanley", "stanley"),
];

const hostelStops = [
  venueStop("nairobi-hostel-jabulani", "jabulani"),
  venueStop("nairobi-hostel-mad-vervet", "madVervet"),
  venueStop("nairobi-hostel-library", "libraryHostel"),
  venueStop("nairobi-hostel-xenia", "xenia"),
  venueStop("nairobi-hostel-zzz", "zzz"),
  venueStop("nairobi-hostel-indovu", "indovu"),
  venueStop("nairobi-hostel-wenizani", "wenizani"),
  venueStop("nairobi-hostel-mlango", "mlango"),
  venueStop("nairobi-hostel-pink-roses", "pinkRoses"),
  venueStop("nairobi-hostel-wildebeest", "wildebeest"),
];

const casualBarStops = [
  venueStop("nairobi-bar-k1-klub-house", "k1"),
  venueStop("nairobi-bar-alchemist", "alchemist"),
  venueStop("nairobi-bar-brew-bistro", "brew"),
  venueStop("nairobi-bar-geco-cafe", "geco"),
  venueStop("nairobi-bar-havana", "havana"),
  venueStop("nairobi-bar-roadhouse-grill", "roadhouse", {
    venueKind: "nightlife",
    nightlifeType: "sports_bar",
    musicGenres: ["sports broadcasts", "popular music"],
    attributeTags: ["sports", "grill", "casual", "late_night"],
  }),
  venueStop("nairobi-bar-living-rooms", "livingRooms"),
  venueStop("nairobi-bar-crafty-chameleon", "crafty"),
  venueStop("nairobi-bar-nairobi-street-kitchen", "nsk", {
    venueKind: "nightlife",
    nightlifeType: "live_music_venue",
    musicGenres: ["DJ sets", "live music"],
    attributeTags: ["food_hall", "live_music", "groups", "late_night"],
  }),
  venueStop("nairobi-bar-bar-next-door", "barNextDoor"),
];

const cocktailStops = [
  venueStop("nairobi-cocktail-hero", "hero", {
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["lounge", "DJ sets"],
    attributeTags: ["cocktails", "rooftop", "design", "late_night"],
  }),
  venueStop("nairobi-cocktail-balcony", "balcony"),
  venueStop("nairobi-cocktail-tambourin", "tambourin"),
  venueStop("nairobi-cocktail-sarabi", "sarabi"),
  venueStop("nairobi-cocktail-upepo", "upepo"),
  venueStop("nairobi-cocktail-inca", "inca"),
  venueStop("nairobi-cocktail-inti", "inti", {
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["lounge"],
    attributeTags: ["pisco", "cocktails", "panoramic", "date_night"],
  }),
  venueStop("nairobi-cocktail-mawimbi", "mawimbi", {
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["live music", "lounge"],
    attributeTags: ["cocktails", "poolside", "live_music", "date_night"],
  }),
  venueStop("nairobi-cocktail-botanica", "botanica"),
  venueStop("nairobi-cocktail-the-view", "theView", {
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["lounge"],
    attributeTags: ["cocktails", "panoramic", "date_night", "rooftop"],
  }),
];

const cultureStops = [
  venueStop("nairobi-culture-national-museum", "nationalMuseum"),
  venueStop("nairobi-culture-nairobi-gallery", "nairobiGallery"),
  venueStop("nairobi-culture-karen-blixen", "karenBlixen"),
  venueStop("nairobi-culture-bomas", "bomas"),
  venueStop("nairobi-culture-circle-art", "circle"),
  venueStop("nairobi-culture-ncai", "ncai"),
  venueStop("nairobi-culture-african-heritage-house", "heritageHouse"),
  venueStop("nairobi-culture-national-theatre", "nationalTheatre"),
  venueStop("nairobi-culture-kazuri", "kazuri"),
  venueStop("nairobi-culture-godown", "godown"),
];

const activityStops = [
  venueStop("nairobi-activity-national-park", "nationalPark"),
  venueStop("nairobi-activity-sheldrick", "sheldrick"),
  venueStop("nairobi-activity-giraffe-centre", "giraffeCentre"),
  venueStop("nairobi-activity-karura", "karura"),
  venueStop("nairobi-activity-arboretum", "arboretum"),
  venueStop("nairobi-activity-oloolua", "oloolua"),
  venueStop("nairobi-activity-bomas", "bomas"),
  venueStop("nairobi-activity-national-museum", "nationalMuseum"),
  venueStop("nairobi-activity-circle-art", "circle"),
  venueStop("nairobi-activity-kazuri", "kazuri"),
];

function source(name: string, url: string): ListSource {
  return { name, url };
}

function sourcesFor(
  stops: GuideStop[],
  editorialSource: ListSource,
): ListSource[] {
  return [
    editorialSource,
    ...stops.map((item) =>
      source(`${item.name} official or property page`, item.officialUrl!),
    ),
  ];
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
    url: maps(`${title} Nairobi Kenya`),
    category,
    location: nairobiLocation,
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

export const nairobiCitywideGuides: MapList[] = [
  guide(
    "Food",
    "list-nairobi-dining",
    "nairobi-best-restaurants",
    "best-restaurants",
    "Nairobi Restaurants Worth Crossing the City For",
    "A citywide dining guide balancing farm-led cooking, Kenyan institutions, Indian Ocean seafood, Japanese-Peruvian technique, skyline rooms, and serious grills across Nairobi's distinct neighborhoods.",
    diningStops,
    sourcesFor(
      diningStops,
      source("Best Kenya Nairobi dining guide", editorial.dining),
    ),
    "Best Restaurants in Nairobi for Kenyan Cooking, Seafood, and Destination Dining",
    "A source-backed Nairobi restaurant guide to Cultiva, HERO, Talisman, INTI, Mawimbi, Carnivore, and other tables worth planning around.",
  ),
  guide(
    "Food",
    "list-nairobi-cheap-eats",
    "nairobi-best-cheap-eats",
    "best-cheap-eats",
    "Nairobi Value: Fish, Pilau, Injera, and Everyday Plates",
    "Ten accessible places for Luo fish, Somali rice, Ghanaian stews, Ethiopian platters, bakery lunches, garden cafés, nyama choma, and sociable food-hall grazing.",
    cheapEatStops,
    sourcesFor(
      cheapEatStops,
      source("Best Kenya Nairobi cheap-eats guide", editorial.value),
    ),
    "Best Cheap Eats in Nairobi for Kenyan, Somali, Ethiopian, and West African Food",
    "Current Nairobi value guide to K'Osewe, Al-Yusra, Café Deli, Mama Ashanti, Habesha, Roadhouse Grill, and useful neighborhood alternatives.",
  ),
  guide(
    "Stay",
    "list-nairobi-hotels",
    "nairobi-best-hotels",
    "best-hotels",
    "Nairobi Hotels with Gardens, Design, and City Perspective",
    "A hotel-only guide spanning wildlife-facing heritage stays, quiet Karen retreats, ambitious new towers, design-led neighborhood properties, and polished landmarks for a first or repeat visit.",
    hotelStops,
    sourcesFor(
      hotelStops,
      source("Tripadvisor Nairobi hotel inventory", editorial.hotels),
    ),
    "Best Hotels in Nairobi from Giraffe Manor to Design-Led City Stays",
    "Source-backed Nairobi hotel guide with direct property pages, current check-in information, and clear neighborhood and experience tradeoffs.",
  ),
  guide(
    "Stay",
    "list-nairobi-hostels",
    "nairobi-best-hostels",
    "best-hostels",
    "Nairobi Hostels for Social, Quiet, and Long-Stay Travelers",
    "A hostel-only guide separating dorm-led social bases, compact city hostels, garden compounds, quiet home-style stays, and practical airport-side choices, with check-in limits stated clearly.",
    hostelStops,
    sourcesFor(
      hostelStops,
      source("Hostelworld Nairobi hostel inventory", editorial.hostels),
    ),
    "Best Hostels in Nairobi for Solo Travelers, Gardens, and Budget Stays",
    "Current Nairobi hostel guide with direct inventory pages, check-in windows, dorm and private-room context, and neighborhood tradeoffs.",
  ),
  guide(
    "Nightlife",
    "list-nairobi-casual-bars",
    "nairobi-best-casual-bars",
    "best-casual-bars",
    "Nairobi Pubs, Beer Gardens, and Unfussy Nightlife",
    "A citywide route through courtyard venues, local taprooms, sports bars, live-music stages, Cuban-inspired rooms, and group-friendly food halls where the night can stay flexible.",
    casualBarStops,
    sourcesFor(
      casualBarStops,
      source("Best Kenya Nairobi nightlife guide", editorial.nightlife),
    ),
    "Best Casual Bars and Pubs in Nairobi for Beer, Sport, and Live Music",
    "Source-backed Nairobi nightlife guide to K1 Klub House, The Alchemist, Brew Bistro, Geco Café, Roadhouse Grill, and more.",
  ),
  guide(
    "Nightlife",
    "list-nairobi-cocktails",
    "nairobi-best-cocktail-bars",
    "best-cocktail-bars",
    "Nairobi Cocktail Bars with Rooftops, Gardens, and Detail",
    "Ten distinct drinking rooms pairing pisco, gin, tropical signatures, hotel-bar polish, rooftop views, poolside music, and ambitious food without collapsing every option into one mood.",
    cocktailStops,
    sourcesFor(
      cocktailStops,
      source("Best Kenya Nairobi nightlife guide", editorial.nightlife),
    ),
    "Best Cocktail Bars in Nairobi for Rooftops, Pisco, Gin, and Date Nights",
    "Current Nairobi cocktail guide to HERO, Balcony Bar, Tambourin, Sarabi, Upepo, INCA, INTI, Botanica, and more.",
  ),
  guide(
    "Culture",
    "list-nairobi-culture",
    "nairobi-essential-culture",
    "essential-culture",
    "Nairobi Museums, Galleries, and Working Cultural Spaces",
    "A culture guide connecting Kenya's deep history and contested colonial record with contemporary East African art, live performance, architecture, craft, and active artist workspaces.",
    cultureStops,
    sourcesFor(
      cultureStops,
      source("National Museums of Kenya museums and sites", editorial.museums),
    ),
    "Best Museums and Cultural Sites in Nairobi for Art, History, and Performance",
    "Source-backed Nairobi culture guide to the National Museum, Nairobi Gallery, Bomas, Circle Art, NCAI, African Heritage House, and more.",
  ),
  guide(
    "Activities",
    "list-nairobi-things-to-do",
    "nairobi-best-things-to-do",
    "best-things-to-do",
    "Nairobi's Essential Wildlife, Forest, and City Experiences",
    "A first-visit activity guide built around the national park, ethical conservation visits, urban forests, a museum, contemporary art, living cultural performance, and hands-on craft.",
    activityStops,
    sourcesFor(
      activityStops,
      source("Nairobi County explore Nairobi portal", editorial.city),
    ),
    "Best Things to Do in Nairobi: Wildlife, Forests, Museums, and Art",
    "Current Nairobi activities guide with exact opening hours, booking dependencies, conservation context, and practical choices for a well-paced first visit.",
  ),
];
