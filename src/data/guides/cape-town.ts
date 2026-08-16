import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

const createdAt = "2026-08-11T00:00:00.000Z";
const checkedAt = "2026-08-11";

const capeTownLocation = {
  city: "Cape Town",
  country: "South Africa",
  continent: "Africa",
  scope: "city" as const,
};

const colors: Record<ListCategory, string> = {
  Food: "b45309",
  Nightlife: "7c3aed",
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
    sourceEvidence?.mapUrl ??
    maps(mapQuery ?? `${name} Cape Town South Africa`);
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
      currentStatusUrl: mapUrl,
      imageSourceUrl: imageEvidence,
      editorialUrls,
      checkedAt,
      notes:
        "Official, editorial, booking, and current map evidence checked on 2026-08-11.",
      ...sourceEvidence,
    },
    officialUrl,
    ...(bookingUrl ? { bookingUrl } : {}),
    ...(rest.price ? { priceSource: priceSource ?? officialUrl } : {}),
    ...rest,
  };
}

const editorial = {
  timeOutRestaurants:
    "https://www.timeout.com/cape-town/restaurants/best-restaurants-in-cape-town",
  timeOutAffordable:
    "https://www.timeout.com/cape-town/restaurants/best-affordable-restaurants-in-cape-town",
  infatuation:
    "https://www.theinfatuation.com/cape-town/guides/best-cape-town-restaurants",
  timeOutBars: "https://www.timeout.com/cape-town/bars/best-bars-in-cape-town",
  capeTownBars:
    "https://www.capetown.travel/50-of-the-best-clubs-and-bars-in-cape-town/",
  condeHotels: "https://www.cntraveler.com/gallery/best-hotels-in-cape-town",
  hostelworld:
    "https://www.hostelworld.com/hostels/africa/south-africa/cape-town/?ShowAll=1",
  capeTownAttractions: "https://www.capetown.travel/top-attractions/",
  capeTownMaps:
    "https://www.capetown.travel/plan-your-trip/cape-town-maps-and-guides/",
};

const diningStops: GuideStop[] = [
  stop(
    "cape-town-dining-la-colombe",
    "La Colombe",
    [-34.015116, 18.403291],
    "At Silvermist above Constantia, this long-form tasting room pairs technically precise contemporary cooking with valley views; reserve transport and several hours for the full menu.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Contemporary", "French", "South African"],
      attributeTags: [
        "fine_dining",
        "tasting_menu",
        "scenic_food",
        "reservation_recommended",
      ],
      price: "$$$$",
      hours: {
        mon: "12:00 PM-1:00 PM and 6:00 PM-8:00 PM",
        tue: "12:00 PM-1:00 PM and 6:00 PM-8:00 PM",
        wed: "12:00 PM-1:00 PM and 6:00 PM-8:00 PM",
        thu: "12:00 PM-1:00 PM and 6:00 PM-8:00 PM",
        fri: "12:00 PM-1:00 PM and 6:00 PM-8:00 PM",
        sat: "12:00 PM-1:00 PM and 6:00 PM-8:00 PM",
        sun: "12:00 PM-1:00 PM and 6:00 PM-8:00 PM",
      },
      officialUrl: "https://www.lacolombe.restaurant/la-colombe",
      bookingUrl: "https://www.lacolombe.restaurant/la-colombe",
      sourcePhoto:
        "https://media.timeout.com/images/106308026/750/562/image.jpg",
      imagePage: editorial.timeOutRestaurants,
      editorialUrls: [editorial.timeOutRestaurants, editorial.infatuation],
    },
  ),
  stop(
    "cape-town-dining-salsify",
    "Salsify at the Roundhouse",
    [-33.9527, 18.377],
    "Ryan Cole's restaurant occupies the historic Roundhouse above Camps Bay, using Cape produce in composed tasting menus while the dining rooms retain their mountain-and-ocean sense of place.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Contemporary", "South African"],
      attributeTags: [
        "fine_dining",
        "tasting_menu",
        "romantic",
        "reservation_recommended",
      ],
      price: "$$$$",
      hours: {
        mon: "6:30 PM-8:30 PM",
        tue: "12:30 PM-2:00 PM and 6:30 PM-8:30 PM",
        wed: "12:30 PM-2:00 PM and 6:30 PM-8:30 PM",
        thu: "12:30 PM-2:00 PM and 6:30 PM-8:30 PM",
        fri: "12:30 PM-2:00 PM and 6:30 PM-8:30 PM",
        sat: "12:30 PM-2:00 PM and 6:30 PM-8:30 PM",
        sun: "Closed",
      },
      officialUrl: "https://salsify.co.za/reservations/",
      bookingUrl: "https://salsify.co.za/reservations/",
      sourcePhoto:
        "https://media.timeout.com/images/106173583/750/562/image.jpg",
      imagePage: editorial.timeOutRestaurants,
      editorialUrls: [editorial.timeOutRestaurants, editorial.infatuation],
    },
  ),
  stop(
    "cape-town-dining-fyn",
    "FYN",
    [-33.92465, 18.421747],
    "Peter Tempelhoff's central-city dining room brings Japanese technique into conversation with indigenous and South African ingredients, with a tasting sequence framed by the open kitchen and city views.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Japanese", "South African", "Contemporary"],
      attributeTags: [
        "fine_dining",
        "tasting_menu",
        "design",
        "reservation_recommended",
      ],
      price: "$$$$",
      hours: {
        mon: "12:00 PM-2:00 PM and 6:00 PM-8:30 PM",
        tue: "12:00 PM-2:00 PM and 6:00 PM-8:30 PM",
        wed: "12:00 PM-2:00 PM and 6:00 PM-8:30 PM",
        thu: "12:00 PM-2:00 PM and 6:00 PM-8:30 PM",
        fri: "12:00 PM-2:00 PM and 6:00 PM-8:30 PM",
        sat: "12:00 PM-2:00 PM and 6:00 PM-8:30 PM",
        sun: "Closed",
      },
      officialUrl: "https://www.fynrestaurant.com/",
      bookingUrl: "https://www.fynrestaurant.com/reservations",
      sourcePhoto:
        "https://media.timeout.com/images/106308028/750/562/image.jpg",
      imagePage: editorial.timeOutRestaurants,
      editorialUrls: [editorial.timeOutRestaurants, editorial.infatuation],
    },
  ),
  stop(
    "cape-town-dining-pier",
    "PIER",
    [-33.905672, 18.42107],
    "The La Colombe group's waterside tasting room builds its menu around fish, shellfish, and oceanic detail, with tightly staged courses and harbour views from the Pierhead building.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Seafood", "Contemporary", "South African"],
      attributeTags: [
        "fine_dining",
        "tasting_menu",
        "seafood",
        "scenic_food",
        "reservation_recommended",
      ],
      price: "$$$$",
      hours: {
        default:
          "Daily lunch reservation arrivals are 12:00 PM-1:00 PM and dinner arrivals 6:00 PM-8:00 PM; the official dated booking calendar sets remaining tables.",
      },
      officialUrl: "https://www.lacolombe.restaurant/pier",
      bookingUrl: "https://www.lacolombe.restaurant/pier",
      sourcePhoto:
        "https://media.timeout.com/images/106308029/750/562/image.jpg",
      imagePage: editorial.timeOutRestaurants,
      editorialUrls: [editorial.timeOutRestaurants],
    },
  ),
  stop(
    "cape-town-dining-belly-of-the-beast",
    "Belly of the Beast",
    [-33.929411, 18.422625],
    "This Harrington Street counter serves one surprise menu to the room, drawing on whole-animal butchery and seasonal produce; the format rewards diners comfortable surrendering course choices.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["South African", "Contemporary"],
      attributeTags: [
        "tasting_menu",
        "destination_dining",
        "reservation_recommended",
        "central",
      ],
      price: "$$$",
      hours: {
        mon: "Dinner seating 6:45 PM",
        tue: "Lunch seating 12:30 PM and dinner seating 6:45 PM",
        wed: "Lunch seating 12:30 PM and dinner seating 6:45 PM",
        thu: "Lunch seating 12:30 PM and dinner seating 6:45 PM",
        fri: "Lunch seating 12:30 PM and dinner seating 6:45 PM",
        sat: "Lunch seating 12:30 PM and dinner seating 6:45 PM",
        sun: "Closed",
      },
      officialUrl: "https://bellyofthebeast.co.za/",
      bookingUrl: "https://bellyofthebeast.co.za/pages/bookings",
      sourcePhoto:
        "https://cdn.shopify.com/s/files/1/2009/2293/files/Pot-Belly.jpg?v=1749033068",
      editorialUrls: [editorial.infatuation],
    },
  ),
  stop(
    "cape-town-dining-galjoen",
    "Galjoen",
    [-33.92952, 18.42269],
    "Galjoen serves only responsibly sourced South African seafood, translating the day's local catch into a fixed progression rather than importing species to fill a static menu.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Seafood", "South African", "Contemporary"],
      attributeTags: [
        "seafood",
        "tasting_menu",
        "destination_dining",
        "reservation_recommended",
      ],
      price: "$$$",
      hours: {
        mon: "Dinner seating 6:45 PM",
        tue: "Dinner seating 6:45 PM",
        wed: "Dinner seating 6:45 PM",
        thu: "Lunch seating 12:30 PM and dinner seating 6:45 PM",
        fri: "Lunch seating 12:30 PM and dinner seating 6:45 PM",
        sat: "Lunch seating 12:30 PM and dinner seating 6:45 PM",
        sun: "Closed",
      },
      officialUrl: "https://www.galjoencpt.co.za/",
      bookingUrl: "https://www.galjoencpt.co.za/pages/bookings",
      sourcePhoto:
        "https://media.timeout.com/images/106059627/750/562/image.jpg",
      imagePage: editorial.timeOutRestaurants,
      editorialUrls: [editorial.timeOutRestaurants],
    },
  ),
  stop(
    "cape-town-dining-pot-luck-club",
    "The Pot Luck Club",
    [-33.927306, 18.45738],
    "High in the Old Biscuit Mill's former silo, Luke Dale Roberts' small-plate room moves across sweet, salty, sour, bitter, and umami dishes designed for sharing.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Contemporary", "Asian-inspired", "South African"],
      attributeTags: [
        "group_friendly",
        "scenic_food",
        "destination_dining",
        "reservation_recommended",
      ],
      price: "$$$",
      hours: {
        mon: "12:30 PM-2:00 PM and 6:00 PM-10:00 PM",
        tue: "12:30 PM-2:00 PM and 6:00 PM-10:00 PM",
        wed: "12:30 PM-2:00 PM and 6:00 PM-10:00 PM",
        thu: "12:30 PM-2:00 PM and 6:00 PM-10:00 PM",
        fri: "12:30 PM-2:00 PM and 6:00 PM-10:00 PM",
        sat: "12:30 PM-2:00 PM and 6:00 PM-10:00 PM",
        sun: "Brunch seatings 11:00 AM-12:30 PM",
      },
      officialUrl: "https://thepotluckclub.co.za/",
      bookingUrl: "https://thepotluckclub.co.za/contact/",
      sourcePhoto:
        "https://media.timeout.com/images/106313292/750/562/image.jpg",
      imagePage: editorial.timeOutRestaurants,
      editorialUrls: [editorial.timeOutRestaurants],
    },
  ),
  stop(
    "cape-town-dining-ouzeri",
    "Ouzeri",
    [-33.922703, 18.41724],
    "Chef Nic Charalambous draws on Cypriot and broader eastern Mediterranean foodways, serving handmade breads, vegetables, and charcoal-led plates in a spare Wale Street room.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Cypriot", "Mediterranean"],
      attributeTags: [
        "destination_dining",
        "date_night",
        "vegetarian_friendly",
        "reservation_recommended",
      ],
      price: "$$$",
      hours: {
        tue: "Dinner 6:00 PM-10:00 PM",
        wed: "Dinner 6:00 PM-10:00 PM",
        thu: "Dinner 6:00 PM-10:00 PM",
        fri: "Dinner 6:00 PM-10:00 PM",
        sat: "Dinner 6:00 PM-10:00 PM",
        sun: "Closed",
        mon: "Closed",
      },
      officialUrl: "https://www.ouzeri.co.za/",
      bookingUrl: "https://www.ouzeri.co.za/reservations",
      sourcePhoto:
        "https://media.timeout.com/images/106135639/750/562/image.jpg",
      imagePage: editorial.timeOutRestaurants,
      editorialUrls: [editorial.timeOutRestaurants],
    },
  ),
  stop(
    "cape-town-dining-chefs-warehouse-beau",
    "Chef's Warehouse at Beau Constantia",
    [-34.0224, 18.4027],
    "Ivor Jones' kitchen sends out a produce-led sequence of sharing plates above Beau Constantia's vines, balancing serious cooking with a relaxed, view-heavy lunch or early dinner.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Contemporary", "South African"],
      attributeTags: [
        "scenic_food",
        "destination_dining",
        "group_friendly",
        "reservation_recommended",
      ],
      price: "$$$",
      hours: {
        mon: "12:00 PM-2:00 PM and 5:30 PM-8:00 PM",
        tue: "Closed",
        wed: "12:00 PM-2:00 PM and 5:30 PM-8:00 PM",
        thu: "12:00 PM-2:00 PM and 5:30 PM-8:00 PM",
        fri: "12:00 PM-2:00 PM and 5:30 PM-8:00 PM",
        sat: "12:00 PM-2:00 PM and 5:30 PM-8:00 PM",
        sun: "12:00 PM-2:00 PM and 5:30 PM-8:00 PM",
      },
      officialUrl: "https://www.chefswarehouse.co.za/beau-constantia",
      bookingUrl: "https://www.chefswarehouse.co.za/beau-constantia",
      sourcePhoto:
        "https://media.timeout.com/images/106059636/750/562/image.jpg",
      imagePage: editorial.timeOutRestaurants,
      editorialUrls: [editorial.timeOutRestaurants],
    },
  ),
  stop(
    "cape-town-dining-seven-colours",
    "Seven Colours Eatery",
    [-33.9038, 18.4209],
    "Chef Nolukhanyo Dube-Cele's cooking celebrates South African home-table abundance through seven-colour plates, samp, slow-cooked meats, and vegetables at the Waterfront's Time Out Market.",
    {
      venueKind: "food_drink",
      foodServiceType: "counter_service",
      cuisineTypes: ["South African", "African"],
      attributeTags: ["local_favorite", "casual", "group_friendly", "central"],
      price: "$$",
      hours: {
        mon: "11:00 AM-10:00 PM",
        tue: "11:00 AM-10:00 PM",
        wed: "11:00 AM-10:00 PM",
        thu: "11:00 AM-10:00 PM",
        fri: "11:00 AM-11:00 PM",
        sat: "11:00 AM-11:00 PM",
        sun: "11:00 AM-10:00 PM",
      },
      officialUrl:
        "https://www.timeout.com/time-out-market-cape-town/restaurants/seven-colours-eatery",
      sourcePhoto:
        "https://media.timeout.com/images/106135630/750/562/image.jpg",
      imagePage: editorial.timeOutRestaurants,
      editorialUrls: [editorial.timeOutRestaurants],
    },
  ),
];

const cheapEatStops: GuideStop[] = [
  stop(
    "cape-town-cheap-clarkes",
    "Clarke's Bar & Dining Room",
    [-33.9228, 18.4167],
    "Clarke's keeps Bree Street useful from breakfast onward, with burgers on brioche, grilled-cheese-and-tomato-soup lunches, and a bar that works equally well for a quick solo meal.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["American", "Cafe"],
      attributeTags: ["budget", "breakfast", "casual", "walk_in_friendly"],
      price: "$$",
      hours: {
        mon: "8:00 AM-11:00 PM",
        tue: "8:00 AM-11:00 PM",
        wed: "8:00 AM-11:00 PM",
        thu: "8:00 AM-11:00 PM",
        fri: "8:00 AM-11:00 PM",
        sat: "9:00 AM-11:00 PM",
        sun: "9:00 AM-5:00 PM",
      },
      officialUrl: "https://www.clarkesdining.co.za/",
      sourcePhoto:
        "https://media.timeout.com/images/106010345/750/562/image.jpg",
      imagePage: editorial.timeOutAffordable,
      editorialUrls: [editorial.timeOutAffordable],
    },
  ),
  stop(
    "cape-town-cheap-marias",
    "Maria's Greek Café",
    [-33.9321, 18.4167],
    "A Dunkley Square fixture since the 1950s, Maria's is strongest as a shared table of mezethes, spanakopita, grilled halloumi, and chicken souvlaki rather than a formal multicourse outing.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Greek", "Mediterranean"],
      attributeTags: ["budget", "casual", "group_friendly", "local_favorite"],
      price: "$$",
      hours: {
        tue: "12:00 PM-10:00 PM",
        wed: "12:00 PM-10:00 PM",
        thu: "12:00 PM-10:00 PM",
        fri: "12:00 PM-10:00 PM",
        sat: "12:00 PM-10:00 PM",
        sun: "Closed",
        mon: "Closed",
      },
      officialUrl: "https://www.facebook.com/MariasGreekCafe/",
      sourcePhoto:
        "https://media.timeout.com/images/106008060/750/562/image.jpg",
      imagePage: editorial.timeOutAffordable,
      editorialUrls: [editorial.timeOutAffordable],
    },
  ),
  stop(
    "cape-town-cheap-mariams",
    "Mariam's Kitchen — St Georges Mall",
    [-33.9233, 18.4204],
    "This family-run counter is a practical introduction to Cape Town fast food: order a masala steak Gatsby or curry-filled salomie and expect generous portions rather than ceremony.",
    {
      venueKind: "food_drink",
      foodServiceType: "counter_service",
      cuisineTypes: ["Cape Malay", "South African", "Indian"],
      attributeTags: ["budget", "street_food", "local_favorite", "halal"],
      price: "$",
      hours: {
        mon: "6:30 AM-5:00 PM",
        tue: "6:30 AM-5:00 PM",
        wed: "6:30 AM-5:00 PM",
        thu: "6:30 AM-5:00 PM",
        fri: "9:00 AM-5:00 PM",
        sat: "8:00 AM-2:00 PM",
        sun: "Closed",
      },
      officialUrl: "https://mariamskitchen.co.za/",
      sourcePhoto:
        "https://img.restaurantguru.com/w550/h367/rf69-Mariams-Kitchen-St-Georges-Mall-interior-2024-12-1.jpg",
      imagePage: "https://restaurantguru.com/Mariams-Kitchen-Cape-Town-4",
      editorialUrls: [
        editorial.timeOutAffordable,
        "https://wanderlog.com/place/details/1173871/mariams-kitchen-st-georges-mall",
      ],
    },
  ),
  stop(
    "cape-town-cheap-biesmiellah",
    "Biesmiellah",
    [-33.920146, 18.414046],
    "Biesmiellah anchors a Bo-Kaap food day with denningvleis, bobotie, bredies, and rotis, serving alcohol-free Cape Malay cooking in an unfussy dining room on Wale Street.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Cape Malay", "South African"],
      attributeTags: [
        "budget",
        "halal",
        "local_favorite",
        "family_friendly_food",
      ],
      price: "$$",
      hours: {
        mon: "11:00 AM-10:00 PM",
        tue: "11:00 AM-10:00 PM",
        wed: "11:00 AM-10:00 PM",
        thu: "11:00 AM-10:00 PM",
        fri: "11:00 AM-10:00 PM",
        sat: "11:00 AM-10:00 PM",
        sun: "11:00 AM-10:00 PM",
      },
      officialUrl: "https://www.biesmiellah.co.za/",
      sourcePhoto:
        "https://img.restaurantguru.com/w550/h367/rf5c-design-Biesmiellah-Restaurant-2024-12-3.jpg",
      imagePage: "https://restaurantguru.com/Biesmiellah-Cape-Town",
      editorialUrls: [editorial.infatuation],
    },
  ),
  stop(
    "cape-town-cheap-eastern-food-bazaar",
    "Eastern Food Bazaar",
    [-33.924628, 18.422326],
    "The long canteen links several counters under one roof, making it easy to compare dosa, biryani, kebabs, and bunny chow while keeping a central-city meal firmly inexpensive.",
    {
      venueKind: "food_drink",
      foodServiceType: "cafeteria",
      cuisineTypes: ["Indian", "Middle Eastern", "South African"],
      attributeTags: ["budget", "street_food", "halal", "group_friendly"],
      price: "$",
      hours: {
        mon: "10:00 AM-9:00 PM",
        tue: "10:00 AM-9:00 PM",
        wed: "10:00 AM-9:00 PM",
        thu: "10:00 AM-9:00 PM",
        fri: "10:00 AM-9:00 PM",
        sat: "10:00 AM-9:00 PM",
        sun: "10:00 AM-9:00 PM",
      },
      officialUrl: "https://easternfoodbazaar.co.za/",
      sourcePhoto:
        "https://media.timeout.com/images/106010340/750/562/image.jpg",
      imagePage: editorial.timeOutAffordable,
      editorialUrls: [
        editorial.timeOutAffordable,
        "https://www.cntraveler.com/shops/cape-town/eastern-food-bazaar",
      ],
    },
  ),
  stop(
    "cape-town-cheap-kalkys",
    "Kalky's",
    [-34.129129, 18.448803],
    "Inside the working Kalk Bay harbour, Kalky's delivers hake, snoek, calamari, and slap chips on paper-lined plates; queues and gulls are part of the experience.",
    {
      venueKind: "food_drink",
      foodServiceType: "counter_service",
      cuisineTypes: ["Seafood", "South African"],
      attributeTags: ["budget", "seafood", "casual", "local_favorite"],
      price: "$",
      hours: {
        mon: "10:00 AM-7:00 PM",
        tue: "10:00 AM-7:00 PM",
        wed: "10:00 AM-7:00 PM",
        thu: "10:00 AM-7:00 PM",
        fri: "10:00 AM-7:00 PM",
        sat: "10:00 AM-7:00 PM",
        sun: "10:00 AM-7:00 PM",
      },
      officialUrl: "https://www.facebook.com/KalkysOfficial/",
      sourcePhoto:
        "https://media.timeout.com/images/106010341/750/562/image.jpg",
      imagePage: editorial.timeOutAffordable,
      editorialUrls: [
        editorial.timeOutAffordable,
        "https://restaurantguru.com/Kalkys-Cape-Town",
      ],
    },
  ),
  stop(
    "cape-town-cheap-fish-rocks",
    "Fish on the Rocks",
    [-34.055141, 18.348027],
    "At Hout Bay's harbour edge, this halal kitchen fries hake and snoek to order and adds calamari or prawns without turning the meal into a polished waterfront production.",
    {
      venueKind: "food_drink",
      foodServiceType: "counter_service",
      cuisineTypes: ["Seafood", "South African"],
      attributeTags: ["budget", "seafood", "halal", "family_friendly_food"],
      price: "$",
      hours: {
        default:
          "Daily 9:00 AM-6:30 PM; daily 9:00 AM-8:30 PM in November, December, and January.",
      },
      officialUrl: "https://fishontherocks.com/contact-us/",
      sourcePhoto:
        "https://fishontherocks.com/wp-content/uploads/2020/11/fish-on-the-rocks-home-header.jpg",
      editorialUrls: [editorial.timeOutAffordable],
    },
  ),
  stop(
    "cape-town-cheap-cousins",
    "The Cousins Trattoria",
    [-33.927, 18.4229],
    "Three cousins from Romagna make fresh pasta in a compact CBD room; the signature tagliolini is tossed tableside in a Grana Padano wheel, but simpler plates keep lunch approachable.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Italian", "Emilia-Romagna"],
      attributeTags: [
        "budget",
        "casual",
        "local_favorite",
        "reservation_recommended",
      ],
      price: "$$",
      hours: {
        mon: "12:00 PM-3:00 PM and 6:00 PM-10:00 PM",
        tue: "12:00 PM-3:00 PM and 6:00 PM-10:00 PM",
        wed: "12:00 PM-3:00 PM and 6:00 PM-10:00 PM",
        thu: "12:00 PM-3:00 PM and 6:00 PM-10:00 PM",
        fri: "12:00 PM-3:00 PM and 6:00 PM-10:00 PM",
        sat: "6:00 PM-10:00 PM",
        sun: "Closed",
      },
      officialUrl: "https://www.thecousinsrestaurant.com/",
      sourcePhoto:
        "https://media.timeout.com/images/106010339/750/562/image.jpg",
      imagePage: editorial.timeOutAffordable,
      editorialUrls: [editorial.timeOutAffordable],
    },
  ),
  stop(
    "cape-town-cheap-arnolds",
    "Arnold's",
    [-33.9283, 18.4111],
    "Arnold's is a dependable Kloof Street breakfast stop for eggs, game sausage, French toast, and café staples, with an early start that suits hikers and jet-lagged arrivals.",
    {
      venueKind: "food_drink",
      foodServiceType: "cafe",
      cuisineTypes: ["South African", "Cafe"],
      attributeTags: ["budget", "breakfast", "casual", "walk_in_friendly"],
      price: "$$",
      hours: {
        mon: "6:45 AM-10:00 PM",
        tue: "6:45 AM-10:00 PM",
        wed: "6:45 AM-10:00 PM",
        thu: "6:45 AM-10:00 PM",
        fri: "6:45 AM-10:00 PM",
        sat: "6:45 AM-10:00 PM",
        sun: "6:45 AM-10:00 PM",
      },
      officialUrl: "https://www.arnolds.co.za/",
      sourcePhoto:
        "https://media.timeout.com/images/106005218/750/562/image.jpg",
      imagePage: editorial.timeOutAffordable,
      editorialUrls: [editorial.timeOutAffordable],
    },
  ),
  stop(
    "cape-town-cheap-dunes",
    "Dunes Beach Restaurant & Bar",
    [-34.045558, 18.358372],
    "Dunes earns its place for practical family dining beside Hout Bay beach: pizzas, grills, seafood, terraces, and a playground make mixed-age groups straightforward.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Seafood", "Pizza", "South African"],
      attributeTags: ["budget", "beach", "family_friendly_food", "scenic_food"],
      price: "$$",
      hours: {
        mon: "9:00 AM-11:00 PM",
        tue: "9:00 AM-11:00 PM",
        wed: "9:00 AM-11:00 PM",
        thu: "9:00 AM-11:00 PM",
        fri: "9:00 AM-11:00 PM",
        sat: "9:00 AM-11:00 PM",
        sun: "9:00 AM-11:00 PM",
      },
      officialUrl: "https://www.dunesrestaurant.co.za/",
      sourcePhoto:
        "https://static.wixstatic.com/media/87ec8e_24ea0ebf7ac84adc86140a6754482be0.jpg",
      editorialUrls: [
        editorial.timeOutAffordable,
        "https://www.tripadvisor.com/Restaurant_Review-g469392-d2421791-Reviews-Dunes_Beach_Restaurant_Bar-Hout_Bay_Western_Cape.html",
      ],
    },
  ),
];

const hotelStops: GuideStop[] = [
  stop(
    "cape-town-hotel-mount-nelson",
    "Mount Nelson, A Belmond Hotel",
    [-33.931816, 18.411391],
    "The pink 1899 landmark sits in nine acres between the city centre and Table Mountain, combining resort-scale gardens, two pools, afternoon tea, and a strong local art programme.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["luxury", "historic", "wellness", "family_friendly"],
      price: "$$$$",
      hours: {
        default:
          "Front desk and registered-guest access operate 24 hours daily; room check-in starts at 3:00 PM and check-out is by 11:00 AM.",
      },
      officialUrl:
        "https://www.belmond.com/hotels/africa/south-africa/cape-town/belmond-mount-nelson-hotel/",
      bookingUrl:
        "https://www.booking.com/hotel/za/mount-nelson-a-belmond-cape-town.html",
      sourcePhoto:
        "https://img.belmond.com/f_auto/t_2580x1299/photos/BEL/bel-cam-01-the-arrival01.jpg",
      imagePage: editorial.condeHotels,
      editorialUrls: [editorial.condeHotels],
    },
  ),
  stop(
    "cape-town-hotel-morea-house",
    "Morea House, Autograph Collection",
    [-33.953, 18.3785],
    "This newer Camps Bay hotel uses warm timber, stone, and bronze across 90 rooms, with Atlantic and mountain outlooks, a spa, and Lebanese cooking at Omri.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["luxury", "design", "beach", "wellness"],
      price: "$$$$",
      hours: {
        default:
          "Front desk and registered-guest access operate 24 hours daily; the property's dated reservation page controls room availability and arrival terms.",
      },
      officialUrl:
        "https://www.marriott.com/en-us/hotels/cptak-morea-house-autograph-collection/overview/",
      bookingUrl:
        "https://www.booking.com/hotel/za/morea-house-autograph-collection.html",
      sourcePhoto:
        "https://media.cntraveler.com/photos/6a4eb5c038ba60a142d26e4a/4:3/w_1280,c_limit/exterior-morea-house-cape-town-april-2026-pr.jpg",
      imagePage: editorial.condeHotels,
      editorialUrls: [editorial.condeHotels],
    },
  ),
  stop(
    "cape-town-hotel-cape-grace",
    "Cape Grace, A Fairmont Managed Hotel",
    [-33.908701, 18.420494],
    "Reopened after a major 2024 redesign, Cape Grace pairs a private marina position with South African art, 112 rooms, Heirloom restaurant, and the whisky-focused Bascule bar.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["luxury", "waterfront", "wellness", "romantic"],
      price: "$$$$",
      hours: {
        default:
          "Front desk and registered-guest access operate 24 hours daily; check-in starts at 2:00 PM and check-out is by 12:00 PM.",
      },
      officialUrl: "https://www.capegrace.com/",
      bookingUrl: "https://www.booking.com/hotel/za/cape-grace.html",
      sourcePhoto:
        "https://media.cntraveler.com/photos/664ba8bd00a9e0c4ecb7367f/4:3/w_1280,c_limit/Cape%20Grace_Copy%20of%20Cape_Grace_Exterior.jpg",
      imagePage: editorial.condeHotels,
      editorialUrls: [editorial.condeHotels],
    },
  ),
  stop(
    "cape-town-hotel-one-only",
    "One&Only Cape Town",
    [-33.908731, 18.416314],
    "A large Waterfront resort with marina-facing rooms, an island spa, family facilities, and immediate aquarium access, best for travellers who want a self-contained base near the harbour.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["luxury", "waterfront", "wellness", "family_friendly"],
      price: "$$$$",
      hours: {
        default:
          "Front desk and registered-guest access operate 24 hours daily; check-in starts at 2:00 PM and check-out is by 11:00 AM.",
      },
      officialUrl: "https://www.oneandonlyresorts.com/cape-town",
      bookingUrl: "https://www.booking.com/hotel/za/one-only-cape-town.html",
      sourcePhoto:
        "https://media.cntraveler.com/photos/635c502c97ca929c00ca709a/4:3/w_1280,c_limit/One&Only%20Cape%20Town_OO_CapeTown_Marina_Grand_Suite_Balcony_1334.jpg",
      imagePage: editorial.condeHotels,
      editorialUrls: [editorial.condeHotels],
    },
  ),
  stop(
    "cape-town-hotel-pod",
    "POD Camps Bay",
    [-33.949192, 18.379747],
    "POD is a compact 17-room boutique hotel close to Camps Bay beach, with water-conscious contemporary design, attentive service, and a narrow lap pool facing the Atlantic side.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["luxury", "design", "beach", "romantic"],
      price: "$$$$",
      hours: {
        default:
          "Front desk service operates 24 hours daily; check-in starts at 2:00 PM and check-out is by 11:00 AM.",
      },
      officialUrl: "https://www.pod.co.za/",
      bookingUrl: "https://www.booking.com/hotel/za/pod-camps-bay.html",
      sourcePhoto:
        "https://media.cntraveler.com/photos/5b7d9462fa15be1dd2c1a14f/4:3/w_1280,c_limit/POD_2018_Deluxe-Suite-1.jpg",
      imagePage: editorial.condeHotels,
      editorialUrls: [editorial.condeHotels],
    },
  ),
  stop(
    "cape-town-hotel-ellerman-house",
    "Ellerman House",
    [-33.931, 18.3786],
    "An Edwardian mansion in Bantry Bay holds just 13 rooms plus two private villas, backed by a major South African art collection, deep wine cellar, gardens, and ocean pool.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["luxury", "art", "romantic", "scenic"],
      price: "$$$$",
      hours: {
        default:
          "Front desk and registered-guest access operate 24 hours daily; the official booking page controls the property's arrival and minimum-stay terms.",
      },
      officialUrl: "https://www.ellerman.co.za/",
      bookingUrl: "https://www.booking.com/hotel/za/ellerman-house.html",
      sourcePhoto:
        "https://media.cntraveler.com/photos/5806387db5529ddf55125b5a/4:3/w_1280,c_limit/Pool-EllermanHouse-SouthAfrica-CRHotel.jpg",
      imagePage: editorial.condeHotels,
      editorialUrls: [editorial.condeHotels],
    },
  ),
  stop(
    "cape-town-hotel-cape-cadogan",
    "Cape Cadogan Boutique Hotel",
    [-33.931831, 18.408305],
    "A Georgian-era townhouse gives this 15-room Gardens hotel residential scale, while its courtyard pool and proximity to Kloof Street keep restaurants and nightlife close without a resort footprint.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["luxury", "historic", "central", "design"],
      price: "$$$$",
      hours: {
        default:
          "Front desk and registered-guest access operate 24 hours daily; check-in starts at 2:00 PM and check-out is by 11:00 AM.",
      },
      officialUrl: "https://www.capecadogan.co.za/",
      bookingUrl: "https://www.booking.com/hotel/za/cape-cadogan-boutique.html",
      sourcePhoto:
        "https://media.cntraveler.com/photos/53dac62a6dec627b14a01dfb/4:3/w_1280,c_limit/cape-cadogan-cape-town-south-africa-107951-1.jpg",
      imagePage: editorial.condeHotels,
      editorialUrls: [editorial.condeHotels],
    },
  ),
  stop(
    "cape-town-hotel-compass-house",
    "Compass House",
    [-33.92777, 18.379513],
    "Eight rooms and an Atlantic-facing infinity pool make Compass House a quiet Bantry Bay retreat, better for privacy and sea views than for a full-service resort programme.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["luxury", "quiet", "romantic", "scenic"],
      price: "$$$$",
      hours: {
        default:
          "Reception supports registered guests 24 hours daily; standard check-in starts at 2:00 PM and check-out is by 11:00 AM.",
      },
      officialUrl: "https://www.compasshouse.co.za/",
      bookingUrl: "https://www.booking.com/hotel/za/compass-house.html",
      sourcePhoto:
        "https://media.cntraveler.com/photos/5b7d8cc91be29d572c024fdd/4:3/w_1280,c_limit/Compass-House_2018_photo_20161203_131821_.jpg",
      imagePage: editorial.condeHotels,
      editorialUrls: [editorial.condeHotels],
    },
  ),
  stop(
    "cape-town-hotel-silo",
    "The Silo Hotel",
    [-33.9085, 18.4236],
    "Thomas Heatherwick's grain-silo conversion places bulging pillowed windows above Zeitz MOCAA, with individually designed rooms, a rooftop pool, and art woven through the hotel.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["luxury", "design", "art", "waterfront"],
      price: "$$$$",
      hours: {
        default:
          "Front desk and registered-guest access operate 24 hours daily; check-in starts at 2:00 PM and check-out is by 11:00 AM.",
      },
      officialUrl: "https://www.theroyalportfolio.com/the-silo/",
      bookingUrl: "https://www.booking.com/hotel/za/the-silo.html",
      sourcePhoto:
        "https://media.cntraveler.com/photos/59c937e49f6d54234e5c223f/4:3/w_1280,c_limit/Exterior-TheSiloHotel-CapeTownSA-CRHotel.jpg",
      imagePage: editorial.condeHotels,
      editorialUrls: [editorial.condeHotels],
    },
  ),
  stop(
    "cape-town-hotel-labotessa",
    "Labotessa Luxury Boutique Hotel",
    [-33.9252, 18.4225],
    "Six suites and a Governor's Suite overlook historic Church Square, combining high ceilings, restrained European interiors, and an unusually intimate city-centre hotel scale.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["luxury", "central", "historic", "design"],
      price: "$$$$",
      hours: {
        default:
          "Front desk and registered-guest access operate 24 hours daily; check-in starts at 2:00 PM and check-out is by 11:00 AM.",
      },
      officialUrl: "https://www.labotessa.com/",
      bookingUrl: "https://www.booking.com/hotel/za/labotessa.html",
      sourcePhoto:
        "https://wp.labotessa.com/app/uploads/2023/04/HOME-PAGE-SIGNATURE.jpg",
      editorialUrls: [editorial.condeHotels],
    },
  ),
];

const hostelStops: GuideStop[] = [
  stop(
    "cape-town-hostel-the-big",
    "The BIG",
    [-33.9126, 18.4106],
    "A converted Green Point house with a pool, communal kitchen, and included breakfast, The BIG suits travellers who want an easy social base without a full party-hostel programme.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "social", "breakfast", "central"],
      price: "$",
      hours: {
        default:
          "Reception operates 24 hours daily; check-in is 2:00 PM-11:00 PM and later arrivals require the property's booking instructions.",
      },
      officialUrl: "https://www.hostelworld.com/hostels/p/59426/the-big/",
      bookingUrl: "https://www.hostelworld.com/hostels/p/59426/the-big/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/5/59426/qsfrtk4lacafvccelhqu.jpg",
      imagePage: "https://www.hostelworld.com/hostels/p/59426/the-big/",
      editorialUrls: [editorial.hostelworld],
    },
  ),
  stop(
    "cape-town-hostel-curiocity",
    "CURIOCITY Green Point",
    [-33.9133, 18.4096],
    "CURIOCITY combines dorms and private suites with a café-bar, pool, kitchen, and organised experiences on Green Point's Main Road, close to the stadium and Waterfront.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "social", "lively", "central"],
      price: "$$",
      hours: {
        default:
          "Reception operates 24 hours daily; check-in is 2:00 PM-11:00 PM and overnight access follows registered-guest controls.",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/302857/curiocity-green-point/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/302857/curiocity-green-point/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/302857/lverug0dw4wgqj3cmvwm.jpg",
      imagePage:
        "https://www.hostelworld.com/hostels/p/302857/curiocity-green-point/",
      editorialUrls: [editorial.hostelworld],
    },
  ),
  stop(
    "cape-town-hostel-never-green",
    "Never at Home Green Point",
    [-33.907755, 18.409105],
    "The larger Green Point branch is built for sociability, with dorms, private rooms, a pool, bar, and frequent activities within walking distance of the Waterfront.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "party", "social", "central"],
      price: "$$",
      hours: {
        default:
          "Reception operates 24 hours daily; check-in is 2:00 PM-12:00 AM and registered guests retain controlled overnight access.",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/90106/never-at-home-green-point/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/90106/never-at-home-green-point/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/9/90106/e8tlymbcdznrbwm0zcw8.jpg",
      imagePage:
        "https://www.hostelworld.com/hostels/p/90106/never-at-home-green-point/",
      editorialUrls: [editorial.hostelworld],
    },
  ),
  stop(
    "cape-town-hostel-villa-viva",
    "Villa Viva Cape Town",
    [-33.927128, 18.410436],
    "Villa Viva's garden, pool, bar, and communal areas give the backpacker house a relaxed social rhythm near Kloof Street, with private rooms alongside dorm beds.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "social", "relaxing", "central"],
      price: "$",
      hours: {
        default:
          "Reception check-in is 2:00 PM-12:00 AM daily; arrivals outside that window follow the instructions on the confirmed property booking.",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/984/villa-viva-cape-town/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/984/villa-viva-cape-town/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/9/984/jecymkrdy7gjfovft1y5.jpg",
      imagePage:
        "https://www.hostelworld.com/hostels/p/984/villa-viva-cape-town/",
      editorialUrls: [editorial.hostelworld],
    },
  ),
  stop(
    "cape-town-hostel-never-kloof",
    "Never at Home Kloof Street",
    [-33.930116, 18.410843],
    "This branch puts dorms and private rooms directly on Kloof Street above an active bar scene, a useful trade-off for nightlife-focused travellers who accept evening noise.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "party", "late_night", "central"],
      price: "$$",
      hours: {
        default:
          "Reception operates 24 hours daily; check-in is 2:00 PM-12:00 AM and registered guests retain controlled overnight access.",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/312791/never-at-home-kloof-street/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/312791/never-at-home-kloof-street/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/312791/jghmziwrwxh98yrsmqdr.jpg",
      imagePage:
        "https://www.hostelworld.com/hostels/p/312791/never-at-home-kloof-street/",
      editorialUrls: [editorial.hostelworld],
    },
  ),
  stop(
    "cape-town-hostel-91-loop",
    "91 Loop",
    [-33.922, 18.418],
    "Purpose-built pod beds, private rooms, a central courtyard, and the Honey Badger bar make 91 Loop convenient for solo travellers who want the CBD at the door.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "social", "central", "solo_friendly"],
      price: "$",
      hours: {
        default:
          "Front desk operates 24 hours daily; check-in is 3:00 PM-11:00 PM and overnight entry follows guest key-card controls.",
      },
      officialUrl: "https://www.hostelworld.com/hostels/p/100300/91-loop/",
      bookingUrl: "https://www.hostelworld.com/hostels/p/100300/91-loop/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/1/100300/lehhg4jnr9mlvza9hioz.jpg",
      imagePage: "https://www.hostelworld.com/hostels/p/100300/91-loop/",
      editorialUrls: [editorial.hostelworld],
    },
  ),
  stop(
    "cape-town-hostel-sunflower",
    "A Sunflower Stop",
    [-33.912, 18.406],
    "A smaller Green Point backpackers with a pool, kitchen, and braai-led social events, Sunflower Stop feels more residential than the area's high-capacity party properties.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "social", "relaxing", "group_friendly"],
      price: "$",
      hours: {
        default:
          "Reception check-in is 2:00 PM-8:00 PM daily; later arrivals must use the timing arranged on the confirmed property booking.",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/1733/a-sunflower-stop/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/1733/a-sunflower-stop/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/1/1733/a0avsyybypxsir4ur411.jpg",
      imagePage: "https://www.hostelworld.com/hostels/p/1733/a-sunflower-stop/",
      editorialUrls: [editorial.hostelworld],
    },
  ),
  stop(
    "cape-town-hostel-urban-hive",
    "Urban Hive Backpackers",
    [-33.9259, 18.4137],
    "Urban Hive occupies a Victorian Long Street building with balconies and an on-site bar; triple bunks and weekend noise suit short, nightlife-centred stays best.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "party", "late_night", "central"],
      price: "$",
      hours: {
        default:
          "Reception operates 24 hours daily; check-in is 1:00 PM-11:00 PM and registered guests retain controlled overnight access.",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/282233/urban-hive-backpackers/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/282233/urban-hive-backpackers/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/282233/39.jpg",
      imagePage:
        "https://www.hostelworld.com/hostels/p/282233/urban-hive-backpackers/",
      editorialUrls: [editorial.hostelworld],
    },
  ),
  stop(
    "cape-town-hostel-green-elephant",
    "Green Elephant Backpackers",
    [-33.9383, 18.469],
    "An Observatory institution with a pool, kitchen, and mixed room formats, Green Elephant is useful for UCT, Groote Schuur, and Lower Main Road rather than Waterfront access.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "social", "local_favorite", "relaxing"],
      price: "$",
      hours: {
        default:
          "Reception operates 24 hours daily; check-in is 1:00 PM-10:00 PM and registered guests retain controlled overnight access.",
      },
      officialUrl: "https://www.hostelworld.com/hostels/p/977/green-elephant/",
      bookingUrl: "https://www.hostelworld.com/hostels/p/977/green-elephant/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/9/977/wbnb5yjji8aeruni7a5i.jpg",
      imagePage: "https://www.hostelworld.com/hostels/p/977/green-elephant/",
      editorialUrls: [editorial.hostelworld],
    },
  ),
  stop(
    "cape-town-hostel-zebra-crossing",
    "Zebra Crossing",
    [-33.9286, 18.4101],
    "Zebra Crossing favours a calmer garden-and-courtyard atmosphere near Kloof Street, making it a better fit for quiet nights than dedicated bar-led hostel programming.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "quiet", "relaxing", "central"],
      price: "$",
      hours: {
        default:
          "Reception check-in is 10:00 AM-6:00 PM daily; arrivals outside that window require the property's confirmed booking instructions.",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/13430/zebra-crossing/",
      bookingUrl: "https://www.hostelworld.com/hostels/p/13430/zebra-crossing/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/1/13430/aj48rq5ieu8a2foo348u.jpg",
      imagePage: "https://www.hostelworld.com/hostels/p/13430/zebra-crossing/",
      editorialUrls: [editorial.hostelworld],
    },
  ),
];

const casualBarStops: GuideStop[] = [
  stop(
    "cape-town-bar-tommys",
    "Tommy's Chop Shop",
    [-33.9283, 18.4295],
    "What began as friends drinking whisky in a motorcycle workshop remains a deliberately rough-edged District Six bar, with bourbon, loud music, and an upside-down car overhead.",
    {
      venueKind: "nightlife",
      nightlifeType: "dive_bar",
      attributeTags: ["casual", "lively", "local_favorite", "late_night"],
      price: "$$",
      hours: {
        mon: "Closed",
        tue: "4:00 PM-12:00 AM",
        wed: "4:00 PM-12:00 AM",
        thu: "4:00 PM-12:00 AM",
        fri: "4:00 PM-12:00 AM",
        sat: "2:00 PM-12:00 AM",
        sun: "Closed",
      },
      officialUrl: "https://justlikepapa.com/pages/tommys-chop-shop",
      sourcePhoto:
        "https://media.timeout.com/images/106352695/750/562/image.jpg",
      imagePage: editorial.timeOutBars,
      editorialUrls: [
        editorial.timeOutBars,
        "https://www.capetowncocktailweek.com/tommys-chop-shop/",
      ],
    },
  ),
  stop(
    "cape-town-bar-talking-strangers",
    "Talking to Strangers",
    [-33.9216, 18.418],
    "A narrow Loop Street room with unfussy food, DJs, and cocktails served without speakeasy theatre, Talking to Strangers works best when conversation can turn into a later night.",
    {
      venueKind: "nightlife",
      nightlifeType: "dive_bar",
      musicGenres: ["DJs", "Eclectic"],
      attributeTags: ["casual", "social", "late_night", "central"],
      price: "$$",
      hours: {
        mon: "6:00 PM-12:00 AM",
        tue: "6:00 PM-12:00 AM",
        wed: "6:00 PM-12:00 AM",
        thu: "6:00 PM-12:00 AM",
        fri: "6:00 PM-2:00 AM",
        sat: "6:00 PM-2:00 AM",
        sun: "Closed",
      },
      officialUrl: "https://cocktailbarcapetowntalkingtostrangers.capetown/",
      sourcePhoto:
        "https://cocktailbarcapetowntalkingtostrangers.capetown/wp-content/uploads/2024/03/Cape-Town-Cocktail-Bar-Talking-To-Strangers-Website-Image.png",
      editorialUrls: [
        editorial.capeTownBars,
        "https://www.capetowncocktailweek.com/talking-to-strangers/",
      ],
    },
  ),
  stop(
    "cape-town-bar-house-machines",
    "The House of Machines",
    [-33.921323, 18.418771],
    "Motorcycles, Evil Twin coffee, barrel spirits, and a compact live-music stage share this Shortmarket Street workshop-bar, shifting from daytime café to high-volume evenings.",
    {
      venueKind: "nightlife",
      nightlifeType: "live_music_venue",
      musicGenres: ["Rock", "Live music", "DJs"],
      attributeTags: ["casual", "lively", "late_night", "local_favorite"],
      price: "$$",
      hours: {
        mon: "7:00 AM-2:00 AM",
        tue: "7:00 AM-2:00 AM",
        wed: "7:00 AM-2:00 AM",
        thu: "7:00 AM-2:00 AM",
        fri: "7:00 AM-2:00 AM",
        sat: "9:00 AM-2:00 AM",
        sun: "Closed",
      },
      officialUrl: "https://www.thehouseofmachines.com/",
      sourcePhoto:
        "https://media.timeout.com/images/106001513/750/562/image.jpg",
      imagePage: editorial.timeOutBars,
      editorialUrls: [editorial.timeOutBars, editorial.capeTownBars],
    },
  ),
  stop(
    "cape-town-bar-firemans",
    "The Fireman's Arms",
    [-33.9166, 18.421],
    "Trading since 1864, Fireman's is a proper city pub for draught beer, pies, and live sport, with multiple screens and enough rooms to absorb a match-day crowd.",
    {
      venueKind: "nightlife",
      nightlifeType: "sports_bar",
      attributeTags: ["casual", "historic", "group_friendly", "local_favorite"],
      price: "$$",
      hours: {
        mon: "Closed",
        tue: "11:00 AM-12:00 AM",
        wed: "11:00 AM-12:00 AM",
        thu: "11:00 AM-12:00 AM",
        fri: "11:00 AM-12:00 AM",
        sat: "11:00 AM-12:00 AM",
        sun: "12:00 PM-8:00 PM",
      },
      officialUrl: "https://firemansarms.co.za/contact-us/",
      sourcePhoto:
        "https://firemansarms.co.za/wp-content/uploads/2015/08/Firemans-Arms-Front.jpg",
      editorialUrls: [
        editorial.capeTownBars,
        "https://www.timeout.com/cape-town/bars-and-pubs/best-pubs-in-cape-town",
      ],
    },
  ),
  stop(
    "cape-town-bar-forries",
    "Foresters Arms",
    [-33.9744, 18.4581],
    "Forries is Newlands' historic rugby pub, combining a sprawling shaded beer garden, fireplaces, draughts, wood-fired pizza, and the reliably partisan energy of a major match.",
    {
      venueKind: "nightlife",
      nightlifeType: "pub",
      attributeTags: [
        "casual",
        "historic",
        "group_friendly",
        "family_friendly",
      ],
      price: "$$",
      hours: {
        mon: "11:30 AM-11:00 PM",
        tue: "11:30 AM-11:00 PM",
        wed: "11:30 AM-11:00 PM",
        thu: "11:30 AM-11:00 PM",
        fri: "11:30 AM-11:00 PM",
        sat: "9:00 AM-11:00 PM",
        sun: "9:00 AM-9:00 PM",
      },
      officialUrl: "https://forries.co.za/",
      sourcePhoto:
        "https://forries.co.za/wp-content/uploads/2023/10/Outside-of-Foresters-Arms.jpeg",
      editorialUrls: [
        "https://www.timeout.com/cape-town/bars-and-pubs/foresters-arms",
        editorial.capeTownBars,
      ],
    },
  ),
  stop(
    "cape-town-bar-cape-cuba",
    "Cape to Cuba",
    [-34.127209, 18.448726],
    "This maximalist Kalk Bay institution layers beach sand, chandeliers, Cuban posters, and rum drinks beside the railway, making the setting more important than cocktail precision.",
    {
      venueKind: "nightlife",
      nightlifeType: "pub",
      attributeTags: ["casual", "beach", "lively", "group_friendly"],
      price: "$$",
      hours: {
        mon: "11:00 AM-11:00 PM",
        tue: "11:00 AM-11:00 PM",
        wed: "11:00 AM-11:00 PM",
        thu: "11:00 AM-11:00 PM",
        fri: "11:00 AM-12:00 AM",
        sat: "11:00 AM-12:00 AM",
        sun: "11:00 AM-12:00 AM",
      },
      officialUrl: "https://www.capetocuba.com/",
      sourcePhoto:
        "https://media.timeout.com/images/106350171/750/562/image.jpg",
      imagePage: editorial.timeOutAffordable,
      editorialUrls: [editorial.timeOutAffordable, editorial.capeTownBars],
    },
  ),
  stop(
    "cape-town-bar-aegir",
    "Aegir Project Brewery",
    [-34.1029, 18.372],
    "Noordhoek's independent taproom pours its own lagers, pale ales, and seasonal releases beside wood-fired pizza and mountain views, making the journey worthwhile before or after the beach.",
    {
      venueKind: "nightlife",
      nightlifeType: "brewery",
      attributeTags: ["casual", "group_friendly", "scenic", "family_friendly"],
      price: "$$",
      hours: {
        mon: "9:00 AM-11:00 PM",
        tue: "9:00 AM-11:00 PM",
        wed: "9:00 AM-11:00 PM",
        thu: "9:00 AM-11:00 PM",
        fri: "9:00 AM-11:00 PM",
        sat: "9:00 AM-11:00 PM",
        sun: "9:00 AM-11:00 PM",
      },
      officialUrl: "https://aegirprojectbrewery.com/contact/",
      sourcePhoto:
        "https://img4.restaurantguru.com/rests/small/w310/1101_501498382.jpg",
      imagePage: "https://restaurantguru.com/Aegir-Project-Brewery-Cape-Town",
      editorialUrls: [editorial.capeTownBars],
    },
  ),
  stop(
    "cape-town-bar-dark-horse",
    "The Dark Horse",
    [-33.9355, 18.4071],
    "The upstairs deck and dim ground-floor bar give this Kloof Street local two speeds, with affordable drinks, compact food, and occasional ticketed live-music evenings.",
    {
      venueKind: "nightlife",
      nightlifeType: "pub",
      musicGenres: ["Live music"],
      attributeTags: ["casual", "local_favorite", "date_night", "lively"],
      price: "$$",
      hours: {
        mon: "Closed",
        tue: "4:00 PM-12:00 AM",
        wed: "4:00 PM-12:00 AM",
        thu: "4:00 PM-12:00 AM",
        fri: "1:00 PM-12:00 AM",
        sat: "1:00 PM-12:00 AM",
        sun: "Closed",
      },
      officialUrl: "https://darkhorsebar.co.za/contact_and_address/",
      sourcePhoto:
        "https://media.timeout.com/images/106363643/750/562/image.jpg",
      imagePage: editorial.timeOutBars,
      editorialUrls: [editorial.timeOutBars, editorial.capeTownBars],
    },
  ),
  stop(
    "cape-town-bar-ricks",
    "Rick's Café Américain",
    [-33.932, 18.409],
    "Rick's spreads a Casablanca theme across a ground-floor bar, lounges, wraparound balcony, and mountain-facing roof terrace, backed by a deep spirits list and weekend jazz.",
    {
      venueKind: "nightlife",
      nightlifeType: "live_music_venue",
      musicGenres: ["Jazz"],
      attributeTags: ["casual", "rooftop", "group_friendly", "late_night"],
      price: "$$",
      hours: {
        default:
          "Current winter schedule: Tuesday-Sunday 11:00 AM-2:00 AM through August; Monday closed.",
        summer: "Daily 11:00 AM-2:00 AM.",
        winter:
          "Tuesday-Sunday 11:00 AM-2:00 AM from June through August; Monday closed.",
      },
      officialUrl: "https://rickscafe.co.za/",
      sourcePhoto:
        "https://www.capetownmagazine.com//media_lib/r2/2c9c2d0dbf9249a004f9cddb67e70105.img.jpg",
      imagePage: "https://www.capetownmagazine.com/ricks",
      editorialUrls: [editorial.capeTownBars],
    },
  ),
  stop(
    "cape-town-bar-banana-jam",
    "Banana Jam Café",
    [-33.938028, 18.468458],
    "Kenilworth's Caribbean-leaning neighborhood bar brings together jerk dishes, rum, house-brewed beer, a leafy courtyard, and an upstairs events space without CBD prices.",
    {
      venueKind: "nightlife",
      nightlifeType: "pub",
      musicGenres: ["Reggae", "DJs"],
      attributeTags: ["casual", "group_friendly", "local_favorite", "budget"],
      price: "$$",
      hours: {
        mon: "Closed",
        tue: "11:00 AM-11:00 PM",
        wed: "11:00 AM-11:00 PM",
        thu: "11:00 AM-11:00 PM",
        fri: "11:00 AM-11:00 PM",
        sat: "11:00 AM-11:00 PM",
        sun: "11:00 AM-9:00 PM",
      },
      officialUrl: "https://www.bananajamcafe.co.za/contact",
      sourcePhoto:
        "https://static-prod.dineplan.com/restaurant/restaurants/images/3689/cropped-banana-jam-cafe-1680687150.jpg?d=1779381555",
      imagePage: "https://www.dineplan.com/restaurants/banana-jam-cafe",
      editorialUrls: [
        editorial.capeTownBars,
        "https://www.eatout.co.za/venue/banana-jam-caf%C3%A9/",
      ],
    },
  ),
];

const cocktailStops: GuideStop[] = [
  stop(
    "cape-town-cocktail-anthm",
    "ANTHM",
    [-33.9217, 18.418],
    "Japanese bartending precision, vintage glassware, vinyl, and small plates meet at ANTHM, where Tetsuo Hasegawa builds drinks around music, Cape produce, and Japanese technique.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      musicGenres: ["Jazz", "Blues", "Rock"],
      attributeTags: ["date_night", "design", "late_night", "central"],
      price: "$$$",
      hours: {
        mon: "Closed",
        tue: "5:30 PM-12:00 AM",
        wed: "5:30 PM-12:00 AM",
        thu: "4:30 PM-12:00 AM",
        fri: "4:30 PM-12:00 AM",
        sat: "5:30 PM-12:00 AM",
        sun: "Closed",
      },
      officialUrl: "https://cocktailbarcapetownanthm.capetown/",
      sourcePhoto:
        "https://media.timeout.com/images/106239418/750/562/image.jpg",
      imagePage: editorial.timeOutBars,
      editorialUrls: [
        editorial.timeOutBars,
        "https://www.capetowncocktailweek.com/anthm/",
      ],
    },
  ),
  stop(
    "cape-town-cocktail-cause-effect",
    "Cause Effect Cocktail Kitchen",
    [-33.905222, 18.419236],
    "Cape botanicals, fynbos, ocean references, and theatrical modernist techniques drive the menu at this Waterfront laboratory, with local brandy and interactive flights adding substance beyond presentation.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      attributeTags: ["lively", "group_friendly", "waterfront", "late_night"],
      price: "$$$",
      hours: {
        mon: "10:00 AM-1:00 AM",
        tue: "10:00 AM-1:00 AM",
        wed: "10:00 AM-1:00 AM",
        thu: "10:00 AM-1:00 AM",
        fri: "9:00 AM-1:00 AM",
        sat: "9:00 AM-1:00 AM",
        sun: "9:00 AM-1:00 AM",
      },
      officialUrl: "https://causeandeffect.co.za/",
      sourcePhoto:
        "https://media.timeout.com/images/106001511/750/562/image.jpg",
      imagePage: editorial.timeOutBars,
      editorialUrls: [
        editorial.timeOutBars,
        "https://www.waterfront.co.za/eat-and-drink/cause-effect-cocktail-kitchen",
      ],
    },
  ),
  stop(
    "cape-town-cocktail-fable",
    "Fable",
    [-33.9222, 18.4167],
    "Fable turns local myths into multi-part drinks and backs them with DJs and a full late-night room; arrive early for close attention, later for the energetic crowd.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      musicGenres: ["DJs"],
      attributeTags: ["party", "lively", "late_night", "date_night"],
      price: "$$$",
      hours: {
        mon: "Closed",
        tue: "5:00 PM-2:00 AM",
        wed: "5:00 PM-2:00 AM",
        thu: "5:00 PM-2:00 AM",
        fri: "4:30 PM-2:00 AM",
        sat: "4:30 PM-2:00 AM",
        sun: "4:30 PM-2:00 AM",
      },
      officialUrl: "https://fablecocktailbar.capetown/",
      bookingUrl: "https://fablecocktailbar.capetown/",
      sourcePhoto:
        "https://media.timeout.com/images/105999085/750/562/image.jpg",
      imagePage: editorial.timeOutBars,
      editorialUrls: [editorial.timeOutBars, editorial.capeTownBars],
    },
  ),
  stop(
    "cape-town-cocktail-drinkery",
    "The Drinkery",
    [-33.9215, 18.4183],
    "Up one flight on Shortmarket Street, this compact contemporary speakeasy handles classics and original drinks without a hidden-door routine, with art and low lighting setting the pace.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      attributeTags: ["date_night", "central", "late_night", "design"],
      price: "$$$",
      hours: {
        mon: "5:00 PM-1:00 AM",
        tue: "5:00 PM-1:00 AM",
        wed: "5:00 PM-1:00 AM",
        thu: "5:00 PM-1:00 AM",
        fri: "5:00 PM-1:00 AM",
        sat: "5:00 PM-1:00 AM",
        sun: "Closed",
      },
      officialUrl: "https://thedrinkery.co.za/",
      sourcePhoto:
        "https://media.timeout.com/images/106072518/750/562/image.jpg",
      imagePage: editorial.timeOutBars,
      editorialUrls: [editorial.timeOutBars],
    },
  ),
  stop(
    "cape-town-cocktail-duplicity",
    "The Art of Duplicity",
    [-33.9284, 18.4246],
    "A reservation supplies the entry details for this Prohibition-styled room, where elaborate glassware, theatrical originals, and scheduled jazz make planning more important than spontaneous bar-hopping.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      musicGenres: ["Jazz"],
      attributeTags: [
        "date_night",
        "reservation_recommended",
        "design",
        "late_night",
      ],
      price: "$$$$",
      hours: {
        mon: "10:00 AM-10:00 PM",
        tue: "10:00 AM-10:00 PM",
        wed: "10:00 AM-2:00 AM",
        thu: "10:00 AM-2:00 AM",
        fri: "10:00 AM-2:00 AM",
        sat: "10:00 AM-2:00 AM",
        sun: "10:00 AM-10:00 PM",
      },
      officialUrl: "https://170120.co.za/",
      bookingUrl: "https://170120.co.za/",
      sourcePhoto:
        "https://media.timeout.com/images/106002974/750/562/image.jpg",
      imagePage: editorial.timeOutBars,
      editorialUrls: [
        editorial.timeOutBars,
        "https://www.capetownmagazine.com/art-of-duplicity",
      ],
    },
  ),
  stop(
    "cape-town-cocktail-gigi",
    "Gigi Rooftop",
    [-33.923, 18.4207],
    "On Gorgeous George's sixth floor, Gigi combines a small rooftop pool, maximal interiors, all-day dining, and cocktails, making reservations useful when events or sunset compress capacity.",
    {
      venueKind: "nightlife",
      nightlifeType: "rooftop_bar",
      musicGenres: ["DJs"],
      attributeTags: ["rooftop", "lively", "design", "group_friendly"],
      price: "$$$",
      hours: {
        mon: "12:00 PM-12:00 AM",
        tue: "12:00 PM-12:00 AM",
        wed: "12:00 PM-12:00 AM",
        thu: "12:00 PM-12:00 AM",
        fri: "12:00 PM-12:00 AM",
        sat: "12:00 PM-12:00 AM",
        sun: "12:00 PM-12:00 AM",
      },
      officialUrl: "https://www.gigirooftop.com/",
      bookingUrl: "https://www.gigirooftop.com/",
      sourcePhoto:
        "https://media.timeout.com/images/105999077/750/562/image.jpg",
      imagePage: editorial.timeOutBars,
      editorialUrls: [editorial.timeOutBars],
    },
  ),
  stop(
    "cape-town-cocktail-bascule",
    "Bascule Bar",
    [-33.9088, 18.4197],
    "Cape Grace's marina-level bar holds more than 500 whiskies alongside Cape-inspired cocktails, guided tastings, social plates, and weekend live music in a polished waterfront setting.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      musicGenres: ["Jazz", "Live music"],
      attributeTags: ["luxury", "waterfront", "date_night", "scenic"],
      price: "$$$",
      hours: {
        mon: "12:00 PM-12:00 AM",
        tue: "12:00 PM-12:00 AM",
        wed: "12:00 PM-12:00 AM",
        thu: "12:00 PM-12:00 AM",
        fri: "12:00 PM-12:00 AM",
        sat: "12:00 PM-12:00 AM",
        sun: "12:00 PM-12:00 AM",
      },
      officialUrl: "https://www.capegrace.com/restaurant/bascule-bar/",
      bookingUrl: "https://www.capegrace.com/restaurant/bascule-bar/",
      sourcePhoto:
        "https://media.timeout.com/images/106165947/750/562/image.jpg",
      imagePage: editorial.timeOutBars,
      editorialUrls: [editorial.timeOutBars],
    },
  ),
  stop(
    "cape-town-cocktail-gin-bar",
    "The Gin Bar",
    [-33.922603, 18.41723],
    "Entered through Honest Chocolate, this plant-filled courtyard bar offers a deep gin list, house cocktails named for emotions, and a separate bubbly room without mandatory reservations.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      attributeTags: [
        "date_night",
        "walk_in_friendly",
        "central",
        "late_night",
      ],
      price: "$$$",
      hours: {
        mon: "5:00 PM-1:00 AM",
        tue: "5:00 PM-1:00 AM",
        wed: "5:00 PM-1:00 AM",
        thu: "3:00 PM-1:00 AM",
        fri: "3:00 PM-1:00 AM",
        sat: "3:00 PM-1:00 AM",
        sun: "Closed",
      },
      officialUrl: "https://www.theginbar.co.za/",
      sourcePhoto:
        "https://media.timeout.com/images/105999093/750/562/image.jpg",
      imagePage: editorial.timeOutBars,
      editorialUrls: [editorial.timeOutBars],
    },
  ),
  stop(
    "cape-town-cocktail-athletic",
    "The Athletic Club & Social",
    [-33.91952, 18.41888],
    "Three levels move from Mediterranean dining and vintage sporting memorabilia to terrace drinks, jazz, and a basement dance floor, so the experience changes with hour and room.",
    {
      venueKind: "nightlife",
      nightlifeType: "lounge",
      musicGenres: ["Jazz", "DJs"],
      attributeTags: ["lively", "group_friendly", "late_night", "design"],
      price: "$$$",
      hours: {
        mon: "4:00 PM-11:00 PM",
        tue: "4:00 PM-11:00 PM",
        wed: "4:00 PM-12:00 AM",
        thu: "12:00 PM-2:00 AM",
        fri: "12:00 PM-2:00 AM",
        sat: "12:00 PM-2:00 AM",
        sun: "Closed",
      },
      officialUrl: "https://theathletic.co.za/",
      sourcePhoto:
        "https://media.timeout.com/images/105999092/750/562/image.jpg",
      imagePage: editorial.timeOutBars,
      editorialUrls: [editorial.timeOutBars, editorial.capeTownBars],
    },
  ),
  stop(
    "cape-town-cocktail-una-mas",
    "Una Más Mezcaleria",
    [-33.921572, 18.382578],
    "The Sea Point original pairs more than 200 agave spirits with Mexican small plates, balancing serious tequila and mezcal exploration against a sociable neighbourhood-room energy.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      attributeTags: ["social", "lively", "group_friendly", "local_favorite"],
      price: "$$$",
      hours: {
        mon: "12:00 PM-12:00 AM",
        tue: "12:00 PM-12:00 AM",
        wed: "12:00 PM-12:00 AM",
        thu: "12:00 PM-12:00 AM",
        fri: "12:00 PM-12:00 AM",
        sat: "12:00 PM-12:00 AM",
        sun: "12:00 PM-12:00 AM",
      },
      officialUrl: "https://unamas.co.za/",
      sourcePhoto:
        "https://media.timeout.com/images/105999081/750/562/image.jpg",
      imagePage: editorial.timeOutBars,
      editorialUrls: [
        editorial.timeOutBars,
        "https://www.timeout.com/cape-town/restaurants/una-mas",
      ],
    },
  ),
];

const cultureStops: GuideStop[] = [
  stop(
    "cape-town-culture-zeitz",
    "Zeitz MOCAA",
    [-33.908399, 18.423001],
    "Heatherwick Studio carved this museum through the Waterfront's 1920s grain silo, creating a vast atrium and galleries dedicated to contemporary art from Africa and its diaspora.",
    {
      venueKind: "culture",
      subcategory: "art museum",
      attributeTags: ["art", "architecture", "accessible", "waterfront"],
      hours: {
        mon: "10:00 AM-6:00 PM",
        tue: "10:00 AM-6:00 PM",
        wed: "10:00 AM-6:00 PM",
        thu: "10:00 AM-6:00 PM",
        fri: "10:00 AM-6:00 PM",
        sat: "10:00 AM-6:00 PM",
        sun: "10:00 AM-6:00 PM",
      },
      officialUrl: "https://zeitzmocaa.museum/plan-your-visit/",
      sourcePhoto:
        "https://zeitzmocaa.museum/wp-content/uploads/2017/08/MW170727zeitzmocaa_32_pano_lo.jpg",
      editorialUrls: [editorial.capeTownAttractions],
    },
  ),
  stop(
    "cape-town-culture-district-six",
    "District Six Museum",
    [-33.927816, 18.423752],
    "Oral histories, family photographs, street signs, and a floor map document District Six before and after apartheid forced removals, centring residents rather than abstracting the neighborhood's loss.",
    {
      venueKind: "culture",
      subcategory: "history museum",
      attributeTags: ["history", "social_history", "central", "guided_tours"],
      hours: {
        mon: "9:00 AM-4:00 PM",
        tue: "9:00 AM-4:00 PM",
        wed: "9:00 AM-4:00 PM",
        thu: "9:00 AM-4:00 PM",
        fri: "9:00 AM-4:00 PM",
        sat: "9:00 AM-4:00 PM",
        sun: "Closed",
      },
      officialUrl: "https://www.districtsix.co.za/museum-information/",
      bookingUrl: "https://www.districtsix.co.za/museum-information/",
      sourcePhoto:
        "https://www.districtsix.co.za/wp-content/uploads/2018/11/1920-x-1024-8.jpg",
      editorialUrls: [editorial.capeTownAttractions],
    },
  ),
  stop(
    "cape-town-culture-sa-museum",
    "Iziko South African Museum",
    [-33.928903, 18.414918],
    "Founded in 1825, the museum spans fossils, archaeology, rock art, marine life, and natural history; its breadth rewards choosing a few galleries rather than rushing every floor.",
    {
      venueKind: "culture",
      subcategory: "natural history museum",
      attributeTags: ["history", "science", "family_friendly", "central"],
      hours: {
        mon: "9:00 AM-5:00 PM",
        tue: "9:00 AM-5:00 PM",
        wed: "9:00 AM-5:00 PM",
        thu: "9:00 AM-5:00 PM",
        fri: "9:00 AM-5:00 PM",
        sat: "8:00 AM-4:00 PM",
        sun: "8:00 AM-4:00 PM",
      },
      officialUrl: "https://www.iziko.org.za/museums/south-african-museum/",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/4/48/Iziko_South_African_Museum.JPG",
      imagePage: "https://en.wikipedia.org/wiki/Iziko_South_African_Museum",
      editorialUrls: ["https://www.iziko.org.za/visit/"],
    },
  ),
  stop(
    "cape-town-culture-national-gallery",
    "Iziko South African National Gallery",
    [-33.929149, 18.417544],
    "The Company’s Garden gallery holds historic, modern, and contemporary Southern African art, with changing displays that complicate how the national collection was assembled and interpreted.",
    {
      venueKind: "culture",
      subcategory: "art museum",
      attributeTags: ["art", "central", "quiet", "accessible"],
      hours: {
        mon: "9:00 AM-5:00 PM",
        tue: "9:00 AM-5:00 PM",
        wed: "9:00 AM-5:00 PM",
        thu: "9:00 AM-5:00 PM",
        fri: "9:00 AM-5:00 PM",
        sat: "8:00 AM-4:00 PM",
        sun: "8:00 AM-4:00 PM",
      },
      officialUrl:
        "https://www.iziko.org.za/museums/south-african-national-gallery/",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/c/c6/South_Africa_National_Gallery.jpg",
      imagePage:
        "https://en.wikipedia.org/wiki/Iziko_South_African_National_Gallery",
      editorialUrls: ["https://www.iziko.org.za/visit/"],
    },
  ),
  stop(
    "cape-town-culture-slave-lodge",
    "Iziko Slave Lodge",
    [-33.92515, 18.420568],
    "One of the city's oldest buildings confronts the Cape's history of enslavement, forced labour, and colonial power through the site where thousands of enslaved people were confined.",
    {
      venueKind: "culture",
      subcategory: "history museum",
      attributeTags: ["history", "social_history", "central", "historic"],
      hours: {
        mon: "9:00 AM-5:00 PM",
        tue: "9:00 AM-5:00 PM",
        wed: "9:00 AM-5:00 PM",
        thu: "9:00 AM-5:00 PM",
        fri: "9:00 AM-5:00 PM",
        sat: "8:00 AM-4:00 PM",
        sun: "Closed",
      },
      officialUrl: "https://www.iziko.org.za/museums/slave-lodge/",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/4/44/Slave_Lodge_museum.jpg",
      imagePage: "https://en.wikipedia.org/wiki/Slave_Lodge,_Cape_Town",
      editorialUrls: ["https://www.iziko.org.za/visit/"],
    },
  ),
  stop(
    "cape-town-culture-bo-kaap",
    "Iziko Bo-Kaap Museum",
    [-33.921415, 18.414913],
    "Set in a restored 1768 house, this small museum focuses on Muslim social history and domestic life in Bo-Kaap; pair it with a respectful neighborhood walk.",
    {
      venueKind: "culture",
      subcategory: "history museum",
      attributeTags: ["history", "historic", "architecture", "central"],
      hours: {
        mon: "9:00 AM-5:00 PM",
        tue: "9:00 AM-5:00 PM",
        wed: "9:00 AM-5:00 PM",
        thu: "9:00 AM-5:00 PM",
        fri: "9:00 AM-5:00 PM",
        sat: "8:00 AM-4:00 PM",
        sun: "Closed",
      },
      officialUrl: "https://www.iziko.org.za/museums/bo-kaap-museum/",
      sourcePhoto:
        "https://www.iziko.org.za/wp-content/uploads/2022/03/Iziko-Bo-Kaap-Museum-min.jpg",
      editorialUrls: [
        "https://www.iziko.org.za/visit/",
        editorial.capeTownAttractions,
      ],
    },
  ),
  stop(
    "cape-town-culture-castle",
    "Castle of Good Hope",
    [-33.925851, 18.426726],
    "Built by the Dutch East India Company from 1666, the pentagonal fort now combines military collections, architecture, ceremonies, and exhibitions that require critical colonial context.",
    {
      venueKind: "culture",
      subcategory: "historic site",
      attributeTags: ["history", "architecture", "historic", "guided_tours"],
      hours: {
        default:
          "Daily 9:00 AM-4:00 PM; last ticket is sold at 3:15 PM; closed on Christmas Day and New Year's Day.",
      },
      officialUrl: "https://www.castleofgoodhope.co.za/index.php/visitors-info",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/a/ae/Castle_of_Good_Hope%2C_Cape_Town_01.jpg",
      imagePage: "https://en.wikipedia.org/wiki/Castle_of_Good_Hope",
      editorialUrls: [editorial.capeTownAttractions],
    },
  ),
  stop(
    "cape-town-culture-robben",
    "Robben Island Museum",
    [-33.9067, 18.4188],
    "The official ferry-and-bus visit connects the island's layered banishment and prison history with guides who include former political prisoners; weather and boat operations shape every visit.",
    {
      venueKind: "culture",
      subcategory: "historic site",
      attributeTags: [
        "history",
        "guided_tours",
        "reservation_recommended",
        "waterfront",
      ],
      hours: {
        default:
          "Scheduled ferries depart the Nelson Mandela Gateway daily at 9:00 AM, 11:00 AM, 1:00 PM, and 3:00 PM; the official ferry timetable and weather notices control operation.",
      },
      timetableUrl: "https://www.robben-island.org.za/tours/",
      officialUrl: "https://www.robben-island.org.za/",
      bookingUrl: "https://www.robben-island.org.za/tours/",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/2/24/Robben_Island_-_Cape_Town%2C_South_Africa_%283883849594%29.jpg",
      imagePage: "https://en.wikipedia.org/wiki/Robben_Island",
      editorialUrls: [editorial.capeTownAttractions],
    },
  ),
  stop(
    "cape-town-culture-norval",
    "Norval Foundation",
    [-34.076476, 18.428906],
    "Purpose-built galleries, a sculpture garden, wetland, library, and rotating modern African exhibitions make Norval a substantial cultural detour in the Constantia wine valley.",
    {
      venueKind: "culture",
      subcategory: "art museum",
      attributeTags: ["art", "architecture", "scenic", "accessible"],
      hours: {
        mon: "Closed",
        tue: "Closed",
        wed: "10:00 AM-5:00 PM",
        thu: "10:00 AM-5:00 PM",
        fri: "10:00 AM-5:00 PM",
        sat: "10:00 AM-5:00 PM",
        sun: "10:00 AM-4:00 PM",
      },
      officialUrl: "https://www.norvalfoundation.org/visitors-information/",
      bookingUrl: "https://www.norvalfoundation.org/visitors-information/",
      sourcePhoto:
        "https://www.norvalfoundation.org/wp-content/uploads/2026/05/Norval-Foundation.jpg",
      editorialUrls: [editorial.capeTownAttractions],
    },
  ),
  stop(
    "cape-town-culture-holocaust",
    "Cape Town Holocaust & Genocide Centre",
    [-33.9302, 18.4149],
    "The permanent exhibition connects Holocaust history with racism, propaganda, and later genocides, adding a South African frame and survivor testimony; entry is free and identification is required.",
    {
      venueKind: "culture",
      subcategory: "history museum",
      attributeTags: ["history", "education", "free_entry", "central"],
      hours: {
        mon: "10:00 AM-5:00 PM",
        tue: "10:00 AM-5:00 PM",
        wed: "10:00 AM-5:00 PM",
        thu: "10:00 AM-5:00 PM",
        fri: "10:00 AM-2:00 PM",
        sat: "Closed",
        sun: "10:00 AM-5:00 PM",
      },
      officialUrl: "https://ctholocaust.co.za/contact-us/",
      sourcePhoto:
        "https://ctholocaust.co.za/wp-content/uploads/2020/07/Donate-Cape-Town-Holocaust-and-Genocide-Centre.jpg",
      editorialUrls: [editorial.capeTownMaps],
    },
  ),
];

const activityStops: GuideStop[] = [
  stop(
    "cape-town-activity-table-mountain",
    "Table Mountain Aerial Cableway",
    [-33.9508, 18.403],
    "The rotating cable car reaches the summit in minutes, but wind and cloud shut it quickly; buy a dated ticket and keep the operating-status page open before travelling uphill.",
    {
      venueKind: "outdoors",
      subcategory: "cableway",
      attributeTags: [
        "scenic",
        "nature",
        "reservation_recommended",
        "accessible",
      ],
      hours: {
        default:
          "Current May-August schedule: first car up 8:30 AM, last car up 5:00 PM, last car down 6:00 PM; the official weather status controls daily operation.",
        summer:
          "December-January: first car up 8:00 AM, last car up 8:00 PM, last car down 9:00 PM; February-March and November: 8:00 AM, 7:00 PM, and 8:00 PM.",
        winter:
          "May-August: first car up 8:30 AM, last car up 5:00 PM, last car down 6:00 PM; the official weather status controls daily operation.",
        spring:
          "September-October: first car up 8:30 AM, last car up 6:00 PM, last car down 7:00 PM.",
        fall: "April: first car up 8:00 AM, last car up 6:30 PM, last car down 7:30 PM.",
      },
      timetableUrl:
        "https://www.tablemountain.net/plan-your-visit/operating-hours/",
      officialUrl:
        "https://www.tablemountain.net/plan-your-visit/operating-hours/",
      bookingUrl: "https://www.tablemountain.net/",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/4/4e/TableMountainAerialCableway2018.jpg",
      imagePage: "https://en.wikipedia.org/wiki/Table_Mountain_Aerial_Cableway",
      editorialUrls: [editorial.capeTownAttractions],
    },
  ),
  stop(
    "cape-town-activity-kirstenbosch",
    "Kirstenbosch National Botanical Garden",
    [-33.985611, 18.430143],
    "Paths climb through indigenous flora on Table Mountain's eastern slope, with the Tree Canopy Walkway, seasonal fynbos, lawns, and conservatory supporting anything from one hour to a full day.",
    {
      venueKind: "outdoors",
      subcategory: "botanical garden",
      attributeTags: ["nature", "scenic", "family_friendly", "accessible"],
      hours: {
        default:
          "Current April-August schedule: daily 8:00 AM-6:00 PM; the conservatory is open 9:00 AM-5:00 PM.",
        summer:
          "Daily 8:00 AM-7:00 PM from September through March; the conservatory is open 9:00 AM-5:00 PM.",
        winter:
          "Daily 8:00 AM-6:00 PM from April through August; the conservatory is open 9:00 AM-5:00 PM.",
      },
      officialUrl:
        "https://www.sanbi.org/gardens/kirstenboch/visitor-information/information/",
      sourcePhoto:
        "https://www.sanbi.org/wp-content/uploads/2018/03/garden-kirstenbosch.jpg",
      editorialUrls: [editorial.capeTownAttractions],
    },
  ),
  stop(
    "cape-town-activity-boulders",
    "Boulders Penguin Colony",
    [-34.197, 18.451],
    "Boardwalks protect a breeding colony of endangered African penguins while keeping close views possible; arrive early because the small Simon's Town access points can reach capacity.",
    {
      venueKind: "outdoors",
      subcategory: "wildlife",
      attributeTags: [
        "nature",
        "wildlife",
        "family_friendly",
        "reservation_recommended",
      ],
      hours: {
        mon: "8:00 AM-5:00 PM",
        tue: "8:00 AM-5:00 PM",
        wed: "8:00 AM-5:00 PM",
        thu: "8:00 AM-5:00 PM",
        fri: "8:00 AM-5:00 PM",
        sat: "8:00 AM-5:00 PM",
        sun: "8:00 AM-5:00 PM",
      },
      officialUrl:
        "https://www.sanparks.org/parks/table-mountain/what-to-do/attractions/boulders-penguin-colony",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/9/95/Boulders_Beach_Suedafrika.jpg",
      imagePage: "https://en.wikipedia.org/wiki/Boulders_Beach",
      editorialUrls: [editorial.capeTownAttractions],
    },
  ),
  stop(
    "cape-town-activity-cape-point",
    "Cape Point and Cape of Good Hope",
    [-34.357395, 18.497788],
    "The reserve combines cliff paths, beaches, fynbos, shipwreck history, and the funicular below the old lighthouse; distances make a car or organised tour the practical choice.",
    {
      venueKind: "outdoors",
      subcategory: "nature reserve",
      attributeTags: ["nature", "scenic", "hiking", "wildlife"],
      hours: {
        default:
          "Current April-September schedule: Cape of Good Hope gate open daily 7:00 AM-5:00 PM; SANParks gate notices control exceptional closures.",
        summer:
          "Cape of Good Hope gate open daily 6:00 AM-6:00 PM from October through March.",
        winter:
          "Cape of Good Hope gate open daily 7:00 AM-5:00 PM from April through September; SANParks gate notices control exceptional closures.",
      },
      officialUrl:
        "https://www.sanparks.org/parks/table-mountain/what-to-do/attractions/cape-of-good-hope-cape-point",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/7/78/Goodhope2.jpg",
      imagePage: "https://en.wikipedia.org/wiki/Cape_Point",
      editorialUrls: [editorial.capeTownAttractions],
    },
  ),
  stop(
    "cape-town-activity-robben",
    "Robben Island Museum Tour",
    [-33.9067, 18.4188],
    "Allow roughly four hours for the official ferry, island bus, and prison visit, and avoid scheduling a tight connection afterward because Atlantic weather can delay or cancel sailings.",
    {
      venueKind: "culture",
      subcategory: "guided tour",
      attributeTags: [
        "history",
        "guided_tours",
        "reservation_recommended",
        "waterfront",
      ],
      hours: {
        default:
          "Scheduled ferries depart the Nelson Mandela Gateway daily at 9:00 AM, 11:00 AM, 1:00 PM, and 3:00 PM; the official ferry timetable and weather notices control operation.",
      },
      timetableUrl: "https://www.robben-island.org.za/tours/",
      officialUrl: "https://www.robben-island.org.za/",
      bookingUrl: "https://www.robben-island.org.za/tours/",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/2/24/Robben_Island_-_Cape_Town%2C_South_Africa_%283883849594%29.jpg",
      imagePage: "https://en.wikipedia.org/wiki/Robben_Island",
      editorialUrls: [editorial.capeTownAttractions],
    },
  ),
  stop(
    "cape-town-activity-lions-head",
    "Lion's Head Hike",
    [-33.935, 18.3895],
    "The exposed spiral trail delivers 360-degree city and Atlantic views, but chains, ladders, wind, heat, and full-moon crowds make daylight and conservative turnaround decisions essential.",
    {
      venueKind: "outdoors",
      subcategory: "hike",
      attributeTags: ["hiking", "nature", "scenic", "adventure"],
      hours: {
        default:
          "Current winter daylight access: daily approximately 6:30 AM-6:00 PM; SANParks closure notices and weather conditions control safe access.",
        summer:
          "Public trail access is daylight-only, approximately 5:30 AM-8:00 PM; SANParks closure notices and weather conditions control safe access.",
        winter:
          "Public trail access is daylight-only, approximately 6:30 AM-6:00 PM; SANParks closure notices and weather conditions control safe access.",
      },
      officialUrl:
        "https://www.sanparks.org/parks/table-mountain/what-to-do/attractions/lions-head-signal-hill",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/e/ef/Fynbos%2C_Lion%27s_Head_and_trees_from_Table_Mountain_trail.jpg",
      imagePage: "https://en.wikipedia.org/wiki/Lion%27s_Head_(Cape_Town)",
      editorialUrls: [editorial.capeTownAttractions],
    },
  ),
  stop(
    "cape-town-activity-chapmans",
    "Chapman's Peak Drive",
    [-34.0819, 18.3618],
    "The toll road threads 114 curves between Hout Bay and Noordhoek, with signed viewpoints above the Atlantic; rockfall, wind, or maintenance can close it at short notice.",
    {
      venueKind: "landmark",
      subcategory: "scenic drive",
      attributeTags: ["scenic", "road_trip", "nature", "photography"],
      hours: {
        default:
          "Current winter daylight toll operation: daily 7:00 AM-6:00 PM; the official live road-status page controls weather or rockfall closures.",
        summer:
          "Daily daylight toll operation 6:00 AM-8:00 PM; the official live road-status page controls access during weather or rockfall closures.",
        winter:
          "Daily daylight toll operation 7:00 AM-6:00 PM; the official live road-status page controls access during weather or rockfall closures.",
      },
      timetableUrl: "https://www.chapmanspeakdrive.co.za/",
      officialUrl: "https://www.chapmanspeakdrive.co.za/",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/d/d3/Chapmans_Peak_Drive_2.jpg",
      imagePage: "https://en.wikipedia.org/wiki/Chapman%27s_Peak",
      editorialUrls: [editorial.capeTownAttractions],
    },
  ),
  stop(
    "cape-town-activity-waterfront",
    "V&A Waterfront",
    [-33.906002, 18.419526],
    "The working harbour district groups Zeitz MOCAA, the aquarium, ferries, shops, restaurants, and public art, useful as a transport-and-attractions hub rather than one isolated sight.",
    {
      venueKind: "landmark",
      subcategory: "waterfront district",
      attributeTags: [
        "waterfront",
        "family_friendly",
        "accessible",
        "shopping",
      ],
      hours: {
        default:
          "Public precinct access is 24 hours daily; most retail operates Monday-Sunday 9:00 AM-9:00 PM, while individual attractions follow their official pages.",
      },
      officialUrl: "https://www.waterfront.co.za/",
      sourcePhoto:
        "https://cdn.sanity.io/images/wrpjy8u8/production/5e4ef65147e5b2f70b850a6e31fcccf7e247da65-1200x780.jpg?w=1200&h=630&fit=crop&fm=jpg&q=80",
      editorialUrls: [editorial.capeTownAttractions],
    },
  ),
  stop(
    "cape-town-activity-sea-point",
    "Sea Point Promenade",
    [-33.909844, 18.390131],
    "This long Atlantic edge is Cape Town's democratic outdoor living room for walking, running, public art, playgrounds, and sunset watching; the adjacent pools keep separate ticketed hours.",
    {
      venueKind: "outdoors",
      subcategory: "promenade",
      attributeTags: ["free_entry", "scenic", "running", "family_friendly"],
      hours: {
        default:
          "Promenade access is open 24 hours daily; the Sea Point Pavilion pool and concession facilities follow their own numeric City schedules.",
      },
      officialUrl:
        "https://www.capetown.gov.za/Family%20and%20home/See-all-city-facilities/Our-recreational-facilities/Beaches/Sea%20Point%20Promenade",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/e/ec/Aerial_View_of_Sea_Point%2C_Cape_Town_South_Africa.jpg",
      imagePage: "https://en.wikipedia.org/wiki/Sea_Point",
      editorialUrls: [editorial.capeTownMaps],
    },
  ),
  stop(
    "cape-town-activity-ozcf",
    "Oranjezicht City Farm Market",
    [-33.902935, 18.417831],
    "The producer-led market moved to a purpose-built Waterfront site in December 2025, bringing farm produce, prepared food, flowers, and small makers together on weekend mornings.",
    {
      venueKind: "retail",
      subcategory: "food market",
      attributeTags: [
        "market",
        "local_favorite",
        "family_friendly",
        "waterfront",
      ],
      hours: {
        wed: "Night market 4:00 PM-9:30 PM, closed during June and July",
        sat: "8:00 AM-2:30 PM",
        sun: "8:30 AM-2:30 PM",
        mon: "Closed",
        tue: "Closed",
        thu: "Closed",
        fri: "Closed",
      },
      officialUrl: "https://ozcf.co.za/",
      sourcePhoto:
        "https://ozcf.co.za/wp-content/uploads/elementor/thumbs/20160923_095035-e1782989664607-rpt8kf5vwbd8pb0rabb0ziwc76cp16zii2gmq902gs.jpg",
      editorialUrls: [
        "https://www.waterfront.co.za/articles/oranjezicht-market-a-new-chapter-at-the-va-waterfront",
        editorial.capeTownAttractions,
      ],
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
    url: maps(`${title} Cape Town South Africa`),
    category,
    location: capeTownLocation,
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

export const capeTownCitywideGuides: MapList[] = [
  guide(
    "Food",
    "list-cape-town-dining",
    "cape-town-best-restaurants",
    "best-restaurants",
    "Cape Town Restaurants Worth Planning Around",
    "A citywide dining guide balancing ambitious tasting menus, contemporary South African cooking, Mediterranean craft, sustainable local seafood, and one direct route into the country's home-table traditions.",
    diningStops,
    sourcesFor(
      diningStops,
      source(
        "Time Out Cape Town restaurant guide",
        editorial.timeOutRestaurants,
      ),
    ),
    "Best Restaurants in Cape Town for Tasting Menus, Seafood, and South African Cooking",
    "Source-backed Cape Town restaurant guide to La Colombe, Salsify, FYN, PIER, Galjoen, Ouzeri, and other destination tables.",
  ),
  guide(
    "Food",
    "list-cape-town-cheap-eats",
    "cape-town-best-cheap-eats",
    "best-cheap-eats",
    "Cape Town Value: Gatsbys, Fish, Pasta, and Cape Malay Plates",
    "A practical value guide spanning Cape Malay cooking, harbour fish and chips, fresh pasta, Greek mezethes, early breakfasts, and family-friendly beach dining across the city.",
    cheapEatStops,
    sourcesFor(
      cheapEatStops,
      source(
        "Time Out Cape Town affordable restaurants",
        editorial.timeOutAffordable,
      ),
    ),
    "Best Cheap Eats in Cape Town for Cape Malay Food, Fish and Chips, and Gatsbys",
    "Current Cape Town cheap-eats guide to Mariam's Kitchen, Biesmiellah, Kalky's, Fish on the Rocks, Eastern Food Bazaar, and more.",
  ),
  guide(
    "Stay",
    "list-cape-town-hotels",
    "cape-town-best-hotels",
    "best-hotels",
    "Cape Town Hotels with a Strong Sense of Place",
    "Ten hotels that use Cape Town's gardens, mountain, Atlantic edge, design culture, and Waterfront intelligently, from an intimate six-suite townhouse to full-service landmark resorts.",
    hotelStops,
    sourcesFor(
      hotelStops,
      source(
        "Condé Nast Traveler best Cape Town hotels",
        editorial.condeHotels,
      ),
    ),
    "Best Hotels in Cape Town from Camps Bay Boutiques to Waterfront Landmarks",
    "Source-backed Cape Town hotel guide with direct property booking links, current arrival information, and clear neighborhood tradeoffs.",
  ),
  guide(
    "Stay",
    "list-cape-town-hostels",
    "cape-town-best-hostels",
    "best-hostels",
    "Cape Town Hostels for Social, Quiet, and Nightlife-Focused Stays",
    "A hostel-only guide separating sociable pool properties, nightlife-heavy city beds, quieter garden bases, and Observatory alternatives, with reception and check-in constraints made explicit.",
    hostelStops,
    sourcesFor(
      hostelStops,
      source("Hostelworld Cape Town inventory", editorial.hostelworld),
    ),
    "Best Hostels in Cape Town for Solo Travellers, Nightlife, and Quiet Stays",
    "Current Cape Town hostel guide with direct booking pages, check-in windows, location tradeoffs, and social-style notes.",
  ),
  guide(
    "Nightlife",
    "list-cape-town-casual-bars",
    "cape-town-best-casual-bars",
    "best-dive-bars",
    "Unpolished Bars, Old Pubs & Live Rooms",
    "Cape Town's dive-bar circuit runs through historic sports pubs, motorcycle-and-whisky rooms, local breweries, live-music bars, and suburban institutions where regulars and atmosphere matter more than polish.",
    casualBarStops,
    sourcesFor(
      casualBarStops,
      source("Cape Town Tourism bars and clubs", editorial.capeTownBars),
    ),
    "Best Dive Bars in Cape Town for Beer, Sport, and Live Music",
    "Ten source-backed Cape Town dive bars and old pubs, including Fireman's Arms, Forries, Tommy's, House of Machines, Aegir, and neighborhood favourites.",
  ),
  guide(
    "Nightlife",
    "list-cape-town-cocktails",
    "cape-town-best-cocktail-bars",
    "best-cocktail-bars",
    "Cape Town Cocktail Bars with Real Point of View",
    "Ten distinct cocktail rooms covering Japanese precision, Cape botanicals, agave depth, whisky, rooftops, jazz, theatrical speakeasy service, and high-energy late-night drinking.",
    cocktailStops,
    sourcesFor(
      cocktailStops,
      source("Time Out best bars in Cape Town", editorial.timeOutBars),
    ),
    "Best Cocktail Bars in Cape Town for Creative Drinks, Rooftops, and Speakeasies",
    "Current Cape Town cocktail guide to ANTHM, Cause Effect, Fable, The Drinkery, Bascule, The Gin Bar, and more.",
  ),
  guide(
    "Culture",
    "list-cape-town-culture",
    "cape-town-essential-culture",
    "essential-culture",
    "Cape Town Museums and Cultural Sites That Explain the City",
    "A culture guide that puts apartheid and enslavement history beside contemporary African art, natural history, national collections, colonial architecture, and carefully contextualised heritage sites.",
    cultureStops,
    sourcesFor(
      cultureStops,
      source("Cape Town Tourism maps and guides", editorial.capeTownMaps),
    ),
    "Best Museums and Cultural Sites in Cape Town for Art, History, and Heritage",
    "Source-backed Cape Town culture guide to District Six Museum, Zeitz MOCAA, Robben Island, Iziko museums, Norval Foundation, and more.",
  ),
  guide(
    "Activities",
    "list-cape-town-things-to-do",
    "cape-town-best-things-to-do",
    "best-things-to-do",
    "Cape Town's Essential Outdoor and City Experiences",
    "A first-visit activity guide built around the mountain, peninsula wildlife, Atlantic drives, working harbour, major gardens, a demanding history tour, and the city's everyday public spaces.",
    activityStops,
    sourcesFor(
      activityStops,
      source(
        "Cape Town Tourism top attractions",
        editorial.capeTownAttractions,
      ),
    ),
    "Best Things to Do in Cape Town: Table Mountain, Cape Point, Penguins, and More",
    "Current Cape Town activities guide with seasonal hours, weather dependencies, booking links, and practical access notes.",
  ),
];
