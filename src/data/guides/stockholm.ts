import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

const createdAt = "2026-08-25T00:00:00.000Z";
const checkedAt = "2026-08-25";

const location = {
  city: "Stockholm",
  country: "Sweden",
  continent: "Europe",
  scope: "city" as const,
};

type StopHours = NonNullable<GuideStop["hours"]>;

type StopInput = {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  officialUrl: string;
  hours: StopHours;
  imageSourceUrl?: string;
  editorialUrls?: string[];
  mapQuery?: string;
  price?: GuideStop["price"];
  priceSource?: string;
  bookingUrl?: string;
  timetableUrl?: string;
  venueKind?: GuideStop["venueKind"];
  foodServiceType?: GuideStop["foodServiceType"];
  cuisineTypes?: string[];
  nightlifeType?: GuideStop["nightlifeType"];
  musicGenres?: string[];
  lodgingType?: GuideStop["lodgingType"];
  subcategory?: string;
  attributeTags?: string[];
};

const colors: Record<ListCategory, string> = {
  Food: "b45309",
  Nightlife: "7c3aed",
  Nature: "15803d",
  Culture: "0f766e",
  Stay: "0369a1",
  Activities: "be123c",
  Routes: "475569",
  Essentials: "475569",
};

function avatar(category: ListCategory) {
  const fill = colors[category] ?? "475569";
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <rect width="160" height="160" rx="80" fill="#${fill}" />
      <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Arial, sans-serif" font-size="76" font-weight="700" fill="white">R</text>
    </svg>
  `)}`;
}

function source(name: string, url: string): ListSource {
  return { name, url };
}

function maps(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function stop(input: StopInput): GuideStop {
  const mapUrl = maps(input.mapQuery ?? `${input.name} Stockholm Sweden`);
  const imageSourceUrl = input.imageSourceUrl ?? input.officialUrl;
  const sourceUrls = [
    input.officialUrl,
    input.bookingUrl,
    input.timetableUrl,
    mapUrl,
    imageSourceUrl,
    ...(input.editorialUrls ?? []),
  ].filter(Boolean) as string[];

  return {
    id: input.id,
    name: input.name,
    coordinates: input.coordinates,
    description: input.description,
    venueKind: input.venueKind,
    foodServiceType: input.foodServiceType,
    cuisineTypes: input.cuisineTypes,
    nightlifeType: input.nightlifeType,
    musicGenres: input.musicGenres,
    lodgingType: input.lodgingType,
    subcategory: input.subcategory,
    attributeTags: input.attributeTags,
    price: input.price,
    priceSource: input.priceSource,
    bookingUrl: input.bookingUrl,
    timetableUrl: input.timetableUrl,
    officialUrl: input.officialUrl,
    hours: input.hours,
    photo: imageSourceUrl,
    imageSourceUrl,
    sourceUrls: [...new Set(sourceUrls)],
    sourceEvidence: {
      officialUrl: input.officialUrl,
      mapUrl,
      currentStatusUrl: mapUrl,
      imageSourceUrl,
      editorialUrls: input.editorialUrls ?? [],
      checkedAt,
      notes:
        "Official venue, property, museum, operator, or ticketing evidence was checked with a current map query. Hours reproduce the published schedule or identify the exact reservation, event, seasonal, weather, or transport-calendar dependency.",
    },
  };
}

const diningStops: GuideStop[] = [
  stop({
    id: "stockholm-dining-frantzen",
    name: "Frantzén",
    coordinates: [59.3338913, 18.0585444],
    description:
      "Björn Frantzén's 23-seat restaurant unfolds across three townhouse floors, combining Nordic ingredients with Japanese technique in a long tasting menu that requires a serious budget and advance reservation.",
    officialUrl: "https://www.restaurantfrantzen.com/",
    imageSourceUrl:
      "https://www.frantzengroup.com/wp/wp-content/uploads/2023/10/5D4_0712-HDR-scaled.jpeg",
    bookingUrl: "https://www.frantzen-reservation.org/",
    hours: {
      default:
        "Tuesday-Friday lunch and dinner by timed reservation; exact seating times are published in the official booking calendar.",
    },
    price: "$$$$",
    priceSource: "Official tasting-menu and reservation pages",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["nordic", "japanese", "contemporary"],
    subcategory: "fine_dining",
    attributeTags: [
      "fine_dining",
      "tasting_menu",
      "reservation_required",
      "splurge_food",
    ],
    editorialUrls: [
      "https://guide.michelin.com/en/stockholm-region/stockholm/restaurant/frantzen",
    ],
  }),
  stop({
    id: "stockholm-dining-aira",
    name: "AIRA",
    coordinates: [59.3208237, 18.123711],
    description:
      "Tommy Myllymäki's waterfront dining room occupies Jonas Bohlin's timber-and-stone building on Royal Djurgården, turning seasonal Nordic produce into precise two-star tasting menus with unusually calm service.",
    officialUrl: "https://aira.se/restaurant/",
    imageSourceUrl:
      "https://aira.se/wp-content/uploads/2023/09/aira_hero_restaurant.jpg",
    bookingUrl: "https://aira.se/restaurant/",
    hours: {
      default:
        "Dinner Tuesday-Saturday; lunch Thursday-Saturday, with exact timed seatings published in the official reservation page.",
    },
    price: "$$$$",
    priceSource: "Official menu and reservation page; MICHELIN Guide 2026",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["nordic", "swedish", "contemporary"],
    subcategory: "fine_dining",
    attributeTags: [
      "fine_dining",
      "tasting_menu",
      "waterfront",
      "reservation_required",
    ],
    editorialUrls: [
      "https://guide.michelin.com/en/stockholm-region/stockholm/restaurant/aira",
    ],
  }),
  stop({
    id: "stockholm-dining-ekstedt",
    name: "Ekstedt",
    coordinates: [59.3367361, 18.0748442],
    description:
      "Niklas Ekstedt's kitchen works without gas or electricity for cooking, using flame, soot, smoke, cast iron, and Scandinavian wood to give the tasting menu its distinct structure.",
    officialUrl: "https://ekstedt.nu/",
    imageSourceUrl:
      "https://ekstedt.nu/wp-content/uploads/2025/04/image1-scaled.jpg",
    bookingUrl: "https://ekstedt.nu/book-a-table/",
    hours: {
      mon: "Closed",
      tue: "5:00 PM-1:00 AM",
      wed: "5:00 PM-1:00 AM",
      thu: "5:00 PM-1:00 AM",
      fri: "5:00 PM-1:00 AM",
      sat: "3:30 PM-1:00 AM",
      sun: "Closed",
    },
    price: "$$$$",
    priceSource: "Official menu and reservation page",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["nordic", "fire_cooking", "contemporary"],
    subcategory: "fine_dining",
    attributeTags: [
      "fine_dining",
      "open_fire",
      "tasting_menu",
      "reservation_recommended",
    ],
    editorialUrls: [
      "https://guide.michelin.com/en/stockholm-region/stockholm/restaurant/ekstedt",
    ],
  }),
  stop({
    id: "stockholm-dining-sushi-sho",
    name: "Sushi Sho",
    coordinates: [59.3412889, 18.0496718],
    description:
      "This compact omakase counter serves roughly fifteen courses of carefully sourced Scandinavian seafood through Edomae technique, with twelve bar seats and a handful of sofa places keeping service focused.",
    officialUrl: "https://www.sushisho.se/",
    imageSourceUrl:
      "https://images.squarespace-cdn.com/content/v1/6604787a39b88e5a32192069/d0410c43-e9e2-41cd-b478-f136ce11315a/sushi_sho_0693.jpg",
    bookingUrl: "https://www.sushisho.se/reservations",
    hours: {
      mon: "Closed",
      tue: "5:00 PM-11:00 PM timed seatings",
      wed: "5:00 PM-11:00 PM timed seatings",
      thu: "5:00 PM-11:00 PM timed seatings",
      fri: "1:00 PM-11:00 PM timed seatings",
      sat: "1:00 PM-11:00 PM timed seatings",
      sun: "Closed",
    },
    price: "$$$$",
    priceSource: "Official reservations and menu pages",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["japanese", "sushi", "scandinavian_seafood"],
    subcategory: "omakase",
    attributeTags: [
      "omakase",
      "counter_seating",
      "reservation_required",
      "seafood",
    ],
    editorialUrls: [
      "https://guide.michelin.com/en/stockholm-region/stockholm/restaurant/sushi-sho",
    ],
  }),
  stop({
    id: "stockholm-dining-adam-albin",
    name: "Adam/Albin",
    coordinates: [59.3298047, 18.0687823],
    description:
      "Adam Dahlberg and Albin Wessman's rebuilt Regeringsgatan restaurant spreads seasonal Swedish cooking across three floors, adding global seasoning and a less ceremonial rhythm to Michelin-level dining.",
    officialUrl: "https://www.adamalbin.se/",
    imageSourceUrl:
      "https://www.adamalbin.se/img/asset/YXNzZXRzLzEtbGVmdC5qcGc/1-left.jpg?p=hero_slideshow_square&s=6e786f5962e6828e42d62e7e16663aeb",
    bookingUrl: "https://www.adamalbin.se/",
    hours: {
      mon: "6:00 PM-1:00 AM",
      tue: "6:00 PM-1:00 AM",
      wed: "6:00 PM-1:00 AM",
      thu: "6:00 PM-1:00 AM",
      fri: "6:00 PM-1:00 AM",
      sat: "6:00 PM-1:00 AM",
      sun: "Closed",
    },
    price: "$$$$",
    priceSource: "Official menu; current 2026 venue listing",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["swedish", "nordic", "international"],
    subcategory: "modern_swedish",
    attributeTags: [
      "fine_dining",
      "seasonal_menu",
      "reservation_recommended",
      "date_night",
    ],
    editorialUrls: [
      "https://www.visitstockholm.com/o/adamalbin/",
      "https://guide.michelin.com/en/stockholm-region/stockholm/restaurant/adam-albin",
    ],
  }),
  stop({
    id: "stockholm-dining-nour",
    name: "Nour",
    coordinates: [59.3358045, 18.071231],
    description:
      "Seven tables distributed through three intimate rooms let chef Sayan Isaksson merge Nordic produce with Japanese precision, producing a tasting menu that feels personal rather than theatrical.",
    officialUrl: "https://restaurantnour.se/",
    imageSourceUrl:
      "https://restaurantnour.se/wp-content/uploads/2026/03/NOUR_2026_BohmanSjostrand2601168495-kopiera.webp",
    bookingUrl: "https://restaurantnour.se/book/",
    hours: {
      mon: "Closed",
      tue: "Closed",
      wed: "5:30 PM-1:00 AM",
      thu: "5:30 PM-1:00 AM",
      fri: "5:00 PM-1:00 AM",
      sat: "5:00 PM-1:00 AM",
      sun: "Closed",
    },
    price: "$$$$",
    priceSource: "Official menu, news, and booking pages",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["nordic", "japanese", "contemporary"],
    subcategory: "fine_dining",
    attributeTags: [
      "fine_dining",
      "intimate",
      "tasting_menu",
      "reservation_required",
    ],
    editorialUrls: [
      "https://guide.michelin.com/en/stockholm-region/stockholm/restaurant/nour",
    ],
  }),
  stop({
    id: "stockholm-dining-lilla-ego",
    name: "Lilla Ego",
    coordinates: [59.3436602, 18.0454747],
    description:
      "Chefs Tom Sjöstedt and Daniel Räms run a deliberately informal room where contemporary Swedish plates follow the market, pairing serious sauces and careful sourcing with handwritten-menu energy.",
    officialUrl: "https://www.lillaego.com/",
    imageSourceUrl:
      "https://static.thatsup.co/content/img/place/stockholm/li/85513b26-2551-11e9-8e76-f23c919fea3e/user-photo/7e22b904.jpg?2026-03-27T11:03:44.739035Z",
    bookingUrl: "https://www.lillaego.com/",
    hours: {
      mon: "Closed",
      tue: "5:00 PM-11:30 PM",
      wed: "5:00 PM-11:30 PM",
      thu: "5:00 PM-11:30 PM",
      fri: "5:00 PM-11:30 PM",
      sat: "5:00 PM-11:30 PM",
      sun: "Closed",
    },
    price: "$$$",
    priceSource: "Official site and current June 2026 venue listing",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["swedish", "nordic", "seasonal"],
    subcategory: "neighborhood_restaurant",
    attributeTags: [
      "local_favorite",
      "seasonal_menu",
      "reservation_recommended",
      "casual_fine_dining",
    ],
    editorialUrls: [
      "https://www.visitstockholm.com/o/lilla-ego/",
      "https://thatsup.se/stockholm/restaurang/lilla-ego/",
    ],
  }),
  stop({
    id: "stockholm-dining-babette",
    name: "Babette",
    coordinates: [59.344931, 18.061578],
    description:
      "Babette combines a daily-changing board of small plates with thin, blistered pizzas and a deep natural-leaning wine list, making repeat visits more rewarding than menu reconnaissance.",
    officialUrl: "http://babette.se/",
    imageSourceUrl:
      "https://static.thatsup.co/content/img/place/stockholm/re/855285f7-2551-11e9-8e76-f23c919fea3e/user-photo/0077f616.jpg?2025-10-14T08:21:17.142282Z",
    hours: { default: "Daily 5:00 PM-1:00 AM." },
    price: "$$$",
    priceSource: "Official site and current MICHELIN Guide service listing",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["european", "pizza", "small_plates"],
    subcategory: "wine_restaurant",
    attributeTags: ["wine_list", "pizza", "small_plates", "date_night"],
    editorialUrls: [
      "https://guide.michelin.com/gb/en/stockholm-region/stockholm/restaurant/babette",
      "https://www.visitstockholm.com/o/babette/",
      "https://thatsup.se/stockholm/restaurang/babette/",
    ],
  }),
  stop({
    id: "stockholm-dining-pelikan",
    name: "Pelikan",
    coordinates: [59.3105695, 18.0761722],
    description:
      "A soaring Södermalm beer hall, serious Swedish art collection, and dependable husmanskost make Pelikan the place for herring, meatballs, kroppkakor, and a long convivial table.",
    officialUrl: "https://pelikan.se/",
    imageSourceUrl:
      "https://static.thatsup.website/123/4745/responsive-images/FUJI6328___media_library_original_6240_4160.jpg?v=1631139006",
    bookingUrl: "https://pelikan.se/boka-bord/",
    hours: {
      default: "Daily 11:30 AM-1:00 AM; weekday lunch 11:30 AM-1:30 PM.",
    },
    price: "$$$",
    priceSource: "Official menu and opening-hours pages",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["swedish", "husmanskost", "traditional"],
    subcategory: "historic_restaurant",
    attributeTags: ["historic", "swedish_classics", "groups", "late_dining"],
    editorialUrls: ["https://www.visitstockholm.com/o/pelikan/"],
  }),
  stop({
    id: "stockholm-dining-sturehof",
    name: "Sturehof",
    coordinates: [59.3358585, 18.073306],
    description:
      "Operating since 1887, Sturehof treats seafood-brasserie scale as a civic institution, sourcing much of its own produce while keeping oysters, fish, and culture programming available late.",
    officialUrl: "https://sturehof.com/",
    imageSourceUrl:
      "https://sturehof.b-cdn.net/wp-content/uploads/2023/10/sturehof-meny-638x280-1.jpg",
    bookingUrl: "https://sturehof.com/boka-bord/",
    hours: {
      mon: "11:30 AM-2:00 AM",
      tue: "11:30 AM-2:00 AM",
      wed: "11:30 AM-2:00 AM",
      thu: "11:30 AM-2:00 AM",
      fri: "11:30 AM-2:00 AM",
      sat: "11:30 AM-2:00 AM",
      sun: "12:00 PM-2:00 AM",
    },
    price: "$$$",
    priceSource: "Official menu and opening-hours pages",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["swedish", "seafood", "brasserie"],
    subcategory: "historic_brasserie",
    attributeTags: ["seafood", "historic", "late_dining", "people_watching"],
    editorialUrls: ["https://www.visitstockholm.com/o/sturehof/"],
  }),
];

const cheapEatStops: GuideStop[] = [
  stop({
    id: "stockholm-cheap-gunters",
    name: "Günter's Korvar",
    coordinates: [59.3425155, 18.0323294],
    description:
      "This tiny Vasastan kiosk loads grilled international sausages into warm bread with sauerkraut, mustard, and chimichurri; queues move steadily, but popular links can sell out.",
    officialUrl: "https://www.krogen.se/restauranger/view/gnters",
    imageSourceUrl:
      "https://www.krogen.se/upload/images/image_8725_fb_w1200.png?v=1768942638188",
    hours: {
      mon: "11:00 AM-8:00 PM",
      tue: "11:00 AM-8:00 PM",
      wed: "11:00 AM-8:00 PM",
      thu: "11:00 AM-8:00 PM",
      fri: "11:00 AM-6:00 PM",
      sat: "11:00 AM-5:00 PM",
      sun: "Closed",
    },
    price: "$",
    priceSource: "Current 2026 venue listing and menu",
    venueKind: "food_drink",
    foodServiceType: "stall",
    cuisineTypes: ["sausages", "street_food", "central_european"],
    subcategory: "sausage_kiosk",
    attributeTags: ["budget_food", "takeaway", "quick_lunch", "local_favorite"],
    editorialUrls: ["https://www.visitstockholm.com/o/gunters-korvar/"],
  }),
  stop({
    id: "stockholm-cheap-la-neta",
    name: "La Neta City",
    coordinates: [59.3366245, 18.0582381],
    description:
      "La Neta keeps its city branch focused on Mexico City-style tacos and quesadillas, with house salsas, counter ordering, and prices that make a mixed plate practical.",
    officialUrl: "https://www.laneta.se/restaurants/bar",
    imageSourceUrl: "https://www.laneta.se/api/media/file/LaNeta-42.jpg",
    hours: {
      mon: "11:00 AM-9:00 PM",
      tue: "11:00 AM-9:00 PM",
      wed: "11:00 AM-9:00 PM",
      thu: "11:00 AM-9:00 PM",
      fri: "11:00 AM-9:00 PM",
      sat: "12:00 PM-9:00 PM",
      sun: "12:00 PM-9:00 PM",
    },
    price: "$",
    priceSource: "Official locations and current menu; current venue hours",
    venueKind: "food_drink",
    foodServiceType: "fast_casual",
    cuisineTypes: ["mexican", "tacos", "street_food"],
    subcategory: "taco_counter",
    attributeTags: [
      "budget_food",
      "quick_lunch",
      "vegetarian_options",
      "counter_service",
    ],
    editorialUrls: ["https://www.visitstockholm.com/o/la-neta/"],
  }),
  stop({
    id: "stockholm-cheap-kajsas-fisk",
    name: "Kajsas Fisk",
    coordinates: [59.3345312, 18.0622264],
    description:
      "Inside Hötorgshallen, Kajsas serves its rich fish soup alongside fried and baked daily seafood plates, delivering a proper market lunch without restaurant-evening prices.",
    officialUrl: "https://kajsasfisk.se/om-oss/",
    imageSourceUrl:
      "https://kajsasfisk.se/wp-content/uploads/elementor/thumbs/Skarmavbild-2023-04-26-kl.-14.26.19-q5kyfoanjp54qfvzht3y5n7kfztqef3v195qo4um60.png",
    hours: {
      mon: "11:00 AM-6:00 PM",
      tue: "11:00 AM-6:00 PM",
      wed: "11:00 AM-6:00 PM",
      thu: "11:00 AM-6:00 PM",
      fri: "11:00 AM-7:00 PM",
      sat: "11:00 AM-4:00 PM",
      sun: "Closed",
    },
    price: "$",
    priceSource: "Official menu and opening-hours page",
    venueKind: "food_drink",
    foodServiceType: "counter_service",
    cuisineTypes: ["swedish", "seafood", "soup"],
    subcategory: "market_counter",
    attributeTags: ["budget_food", "seafood", "market_hall", "lunch"],
    editorialUrls: ["https://www.visitstockholm.com/o/kajsas-fisk/"],
  }),
  stop({
    id: "stockholm-cheap-falafelbaren",
    name: "Falafelbaren Hornsgatan",
    coordinates: [59.3183482, 18.0594013],
    description:
      "Falafel is fried to order and folded into bread with crisp vegetables, hummus, and sharp sauces; börek and plates broaden this compact Hornsgatan counter's range.",
    officialUrl: "https://www.falafelbaren.se/location/hornsgatan/",
    imageSourceUrl:
      "https://static.thatsup.co/content/img/place/stockholm/fa/85527674-2551-11e9-8e76-f23c919fea3e/user-photo/48a2beba.jpg?2026-04-08T11:30:48.019776Z",
    hours: {
      mon: "11:00 AM-7:00 PM",
      tue: "11:00 AM-7:00 PM",
      wed: "11:00 AM-7:00 PM",
      thu: "11:00 AM-7:00 PM",
      fri: "11:00 AM-7:00 PM",
      sat: "11:00 AM-4:00 PM",
      sun: "12:00 PM-4:00 PM",
    },
    price: "$",
    priceSource: "Official location page and current April 2026 venue hours",
    venueKind: "food_drink",
    foodServiceType: "fast_food",
    cuisineTypes: ["middle_eastern", "falafel", "vegetarian"],
    subcategory: "falafel_counter",
    attributeTags: ["budget_food", "vegetarian", "vegan_options", "takeaway"],
    editorialUrls: [
      "https://www.visitstockholm.com/o/falafelbaren/",
      "https://thatsup.se/stockholm/restaurang/falafelbaren/",
    ],
  }),
  stop({
    id: "stockholm-cheap-amida",
    name: "Amida Kolgrill Södermalm",
    coordinates: [59.3147242, 18.0783935],
    description:
      "Amida's charcoal grill turns out generous Turkish kebab, köfte, chicken, bread, and salads from morning through late evening, making it useful beyond the lunch rush.",
    officialUrl: "https://app.amida.se/restaurant/amida-kolgrill-sodermalm",
    imageSourceUrl:
      "https://www.visitstockholm.com/media/images/amida.width-1280.jpg",
    hours: {
      mon: "10:00 AM-11:00 PM",
      tue: "10:00 AM-11:00 PM",
      wed: "10:00 AM-11:00 PM",
      thu: "10:00 AM-11:00 PM",
      fri: "10:00 AM-11:00 PM",
      sat: "12:00 PM-11:00 PM",
      sun: "12:00 PM-11:00 PM",
    },
    price: "$",
    priceSource: "Official ordering page and current menu",
    venueKind: "food_drink",
    foodServiceType: "fast_casual",
    cuisineTypes: ["turkish", "charcoal_grill", "kebab"],
    subcategory: "grill",
    attributeTags: [
      "budget_food",
      "late_food",
      "generous_portions",
      "takeaway",
    ],
    editorialUrls: ["https://www.visitstockholm.com/o/amida-kolgrill/"],
  }),
  stop({
    id: "stockholm-cheap-kalf-hansen",
    name: "Kalf & Hansen Mariatorget",
    coordinates: [59.3185171, 18.0620102],
    description:
      "Organic ingredients and Nordic seasonality shape meatballs, vegetable balls, grain bowls, and compact plates at this bright fast-casual room beside Mariatorget.",
    officialUrl: "https://www.kalfochhansen.se/",
    imageSourceUrl:
      "https://images.squarespace-cdn.com/content/v1/57952e1e9f7456b10f4c177e/8429b38e-618b-4602-95f0-ce53faf2f4e3/IMG_4709.png",
    hours: {
      mon: "11:00 AM-8:00 PM",
      tue: "11:00 AM-8:00 PM",
      wed: "11:00 AM-8:00 PM",
      thu: "11:00 AM-8:00 PM",
      fri: "11:00 AM-10:00 PM",
      sat: "11:00 AM-10:00 PM",
      sun: "12:00 PM-4:00 PM",
    },
    price: "$",
    priceSource: "Official menu and opening-hours page",
    venueKind: "food_drink",
    foodServiceType: "fast_casual",
    cuisineTypes: ["nordic", "organic", "vegetarian_friendly"],
    subcategory: "fast_casual",
    attributeTags: ["budget_food", "organic", "vegetarian_options", "healthy"],
    editorialUrls: ["https://www.visitstockholm.com/o/kalf-hansen/"],
  }),
  stop({
    id: "stockholm-cheap-vetekatten",
    name: "Vete-Katten",
    coordinates: [59.334112, 18.058346],
    description:
      "The Kungsgatan flagship preserves the labyrinthine rooms and old-school service of a 1928 konditori, with cinnamon buns, cakes, pralines, and savory open sandwiches.",
    officialUrl: "https://vetekatten.se/en/butiker-konditorier/kungsgatan-55/",
    imageSourceUrl:
      "https://vetekatten.se/wp-content/uploads/2021/09/Exterior_Kategori-1344x936-1.jpg",
    hours: {
      mon: "7:30 AM-8:00 PM",
      tue: "7:30 AM-8:00 PM",
      wed: "7:30 AM-8:00 PM",
      thu: "7:30 AM-8:00 PM",
      fri: "7:30 AM-8:00 PM",
      sat: "9:00 AM-7:00 PM",
      sun: "9:00 AM-7:00 PM",
    },
    price: "$",
    priceSource: "Official shop page and menu",
    venueKind: "food_drink",
    foodServiceType: "cafe",
    cuisineTypes: ["swedish", "bakery", "fika"],
    subcategory: "historic_cafe",
    attributeTags: ["fika", "historic", "pastries", "breakfast"],
    editorialUrls: ["https://www.visitstockholm.com/o/vete-katten/"],
  }),
  stop({
    id: "stockholm-cheap-lillebrors",
    name: "Lillebrors Bageri",
    coordinates: [59.340068, 18.0341139],
    description:
      "Lillebrors laminates notably crisp croissants and cardamom buns in its open bakery, then adds seasonal pastries and sandwiches that reward an early visit.",
    officialUrl: "https://www.lillebrors.se/",
    imageSourceUrl:
      "https://static.thatsup.co/content/img/place/stockholm/li/8563196c-2551-11e9-8e76-f23c919fea3e/user-photo/d525f079.jpg?2026-06-14T12:43:05.042136Z",
    hours: {
      mon: "Closed",
      tue: "8:00 AM-7:00 PM",
      wed: "8:00 AM-7:00 PM",
      thu: "8:00 AM-7:00 PM",
      fri: "8:00 AM-7:00 PM",
      sat: "8:00 AM-5:00 PM",
      sun: "8:00 AM-5:00 PM",
    },
    price: "$",
    priceSource: "Official opening-hours and product page",
    venueKind: "food_drink",
    foodServiceType: "bakery",
    cuisineTypes: ["swedish", "bakery", "pastries"],
    subcategory: "artisan_bakery",
    attributeTags: ["fika", "pastries", "breakfast", "takeaway"],
    editorialUrls: ["https://www.visitstockholm.com/o/lillebrors-bageri/"],
  }),
  stop({
    id: "stockholm-cheap-omnipollos-hatt",
    name: "Omnipollos Hatt",
    coordinates: [59.318061, 18.0722336],
    description:
      "Omnipollo's tiny taproom pairs experimental beer with deliberately unconventional pizzas, letting one modestly priced pie carry flavors as playful as the rotating pours.",
    officialUrl: "https://www.omnipolloshatt.com/",
    imageSourceUrl:
      "https://www.omnipolloshatt.com/wp-content/plugins/beercam/pics/beercam2026-08-25_14:30:26.jpg",
    hours: { default: "Daily 12:00 PM-1:00 AM; walk-ins only." },
    price: "$$",
    priceSource: "Official menu and opening-hours page updated August 2026",
    venueKind: "food_drink",
    foodServiceType: "pub",
    cuisineTypes: ["pizza", "craft_beer", "contemporary"],
    subcategory: "pizza_pub",
    attributeTags: ["pizza", "craft_beer", "late_food", "walk_ins"],
    editorialUrls: ["https://www.visitstockholm.com/o/omnipollos-hatt/"],
  }),
  stop({
    id: "stockholm-cheap-800-grader",
    name: "800 Grader Slice Shop Södermalm",
    coordinates: [59.3136528, 18.0744869],
    description:
      "The Södermalm slice shop serves large New York-style wedges with a crisp base, simple combinations, and quick counter turnover from lunch into late evening.",
    officialUrl: "https://800grader.se/sodermalm",
    imageSourceUrl:
      "https://static.thatsup.co/content/img/place/stockholm/80/228059f0-12af-11ea-aad5-f23c919fea3e/user-photo/2ba4c7ed.jpg?2026-01-12T18:25:48.475919Z",
    hours: {
      mon: "11:30 AM-10:00 PM",
      tue: "11:30 AM-10:00 PM",
      wed: "11:30 AM-11:00 PM",
      thu: "11:30 AM-11:00 PM",
      fri: "11:30 AM-11:00 PM",
      sat: "11:30 AM-11:00 PM",
      sun: "12:00 PM-9:00 PM",
    },
    price: "$",
    priceSource: "Official location, menu, and opening-hours page",
    venueKind: "food_drink",
    foodServiceType: "counter_service",
    cuisineTypes: ["pizza", "new_york_style", "street_food"],
    subcategory: "pizza_by_the_slice",
    attributeTags: ["budget_food", "pizza", "quick_lunch", "late_food"],
    editorialUrls: ["https://www.visitstockholm.com/o/800-grader/"],
  }),
];

const hotelStops: GuideStop[] = [
  stop({
    id: "stockholm-hotel-grand",
    name: "Grand Hôtel",
    coordinates: [59.3296107, 18.0754902],
    description:
      "Stockholm's 1874 waterfront grand dame combines harbor-facing rooms, the Cadier Bar, Nordic Spa, and round-the-clock staff opposite the Royal Palace; views command a pronounced premium.",
    officialUrl: "https://grandhotel.se/en/",
    imageSourceUrl:
      "https://grandhotel.se/sites/default/files/styles/max_1300x1300/public/images/2023/01/fasad.jpeg?itok=jfAkrZAP",
    bookingUrl: "https://www.booking.com/hotel/se/grand-stockholm.html",
    hours: {
      default:
        "Open daily with staff available 24 hours; check-in 3:00 PM, check-out 12:00 PM.",
    },
    price: "$$$$",
    priceSource: "Direct Booking.com property page and official room pages",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "luxury_hotel",
    attributeTags: ["luxury", "waterfront", "spa", "historic"],
    editorialUrls: [
      "https://www.cntraveller.com/gallery/best-hotels-in-stockholm",
    ],
  }),
  stop({
    id: "stockholm-hotel-ett-hem",
    name: "Ett Hem",
    coordinates: [59.3454456, 18.0677652],
    description:
      "Ilse Crawford turned a 1910 Arts and Crafts townhouse into a residential-feeling hotel where guests use the kitchen, library, garden, and sitting rooms as part of the stay.",
    officialUrl: "https://www.etthem.se/",
    imageSourceUrl:
      "https://images.dwell.com/photos/6108729469055270912/6204708271322583040/large.jpg",
    bookingUrl: "https://www.booking.com/hotel/se/ett-hem.html",
    hours: {
      default:
        "Open daily with a 24-hour front desk; check-in from 3:00 PM and check-out by 11:00 AM.",
    },
    price: "$$$$",
    priceSource: "Direct Booking.com property page and official reservations",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "boutique_hotel",
    attributeTags: ["luxury", "boutique", "quiet", "design"],
    editorialUrls: [
      "https://guide.michelin.com/en/hotels-stays/stockholm/ett-hem-6834",
      "https://www.dwell.com/article/a-visual-journey-through-stockholms-hotel-ett-hem-2186eb0c",
    ],
  }),
  stop({
    id: "stockholm-hotel-bank",
    name: "Bank Hotel",
    coordinates: [59.331394, 18.0746346],
    description:
      "A former bank hall supplies architectural drama while rooftop Le Hibou, Bonnie's restaurant, and compact design-led rooms place guests between Nybroviken and the central shopping grid.",
    officialUrl: "https://bankhotel.se/",
    imageSourceUrl:
      "https://bankhotel.se/wp-content/uploads/2025/02/johannesmaxweller_160220-bank-07690-varm-1.png",
    bookingUrl: "https://www.booking.com/hotel/se/bank.html",
    hours: { default: "Open daily; check-in 3:00 PM, check-out 12:00 PM." },
    price: "$$$$",
    priceSource: "Direct Booking.com property page and official FAQ",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "luxury_hotel",
    attributeTags: ["luxury", "rooftop_bar", "design", "central"],
    editorialUrls: [
      "https://www.cntraveller.com/gallery/best-hotels-in-stockholm",
    ],
  }),
  stop({
    id: "stockholm-hotel-villa-dagmar",
    name: "Villa Dagmar",
    coordinates: [59.3355692, 18.077954],
    description:
      "A glass-roofed courtyard, spa, florist, and art-filled Art Nouveau setting make Villa Dagmar an intimate luxury base beside Östermalm's market hall and restaurant district.",
    officialUrl: "https://hotelvilladagmar.com/en/",
    imageSourceUrl:
      "https://hotelvilladagmar.com/wp-content/uploads/2021/05/dagmar-suite.jpg",
    bookingUrl: "https://www.booking.com/hotel/se/villa-dagmar.html",
    hours: {
      default:
        "Open daily; check-in 3:00 PM-midnight and check-out by 12:00 PM.",
    },
    price: "$$$$",
    priceSource: "Direct Booking.com property page and official booking page",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "boutique_hotel",
    attributeTags: ["luxury", "spa", "boutique", "courtyard"],
    editorialUrls: [
      "https://guide.michelin.com/en/hotels-stays/stockholm/villa-dagmar-11829",
      "https://hotelvilladagmar.com/en/gallery/",
    ],
  }),
  stop({
    id: "stockholm-hotel-diplomat",
    name: "Hotel Diplomat",
    coordinates: [59.3319653, 18.0805298],
    description:
      "This family-run 1911 Art Nouveau hotel faces Nybroviken, pairing Svenskt Tenn-style interiors with water views and quick walks to Djurgården ferries, galleries, and Östermalm.",
    officialUrl: "https://www.diplomathotel.com/",
    imageSourceUrl:
      "https://www.diplomathotel.com/wp-content/uploads/2026/03/marding6536-1000x1499.jpg",
    bookingUrl: "https://www.booking.com/hotel/se/diplomat.html",
    hours: {
      default:
        "Open daily; standard arrival and departure times are stated on the selected rate's official booking page, with flexible options by availability.",
    },
    price: "$$$$",
    priceSource: "Direct Booking.com property page and official booking terms",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "historic_hotel",
    attributeTags: ["luxury", "waterfront", "historic", "family_owned"],
    editorialUrls: [
      "https://www.cntraveller.com/gallery/best-hotels-in-stockholm",
    ],
  }),
  stop({
    id: "stockholm-hotel-at-six",
    name: "At Six",
    coordinates: [59.3313646, 18.0669698],
    description:
      "At Six uses contemporary art, dark Nordic interiors, a large gym, and central Brunkebergstorg access to make a polished base for design-minded city stays and business trips.",
    officialUrl: "https://hotelatsix.com/",
    imageSourceUrl:
      "https://static.thatsup.website/574/71473/at_six_lobby.jpg?v=1762436069",
    bookingUrl: "https://www.booking.com/hotel/se/at-six.html",
    hours: {
      default:
        "Open daily with facilities available 24 hours; check-in 3:00 PM, check-out 12:00 PM.",
    },
    price: "$$$",
    priceSource: "Direct Booking.com property page and official FAQ",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "design_hotel",
    attributeTags: ["design", "art", "gym", "business_friendly"],
    editorialUrls: [
      "https://www.cntraveller.com/gallery/best-hotels-in-stockholm",
    ],
  }),
  stop({
    id: "stockholm-hotel-nobis",
    name: "Nobis Hotel Stockholm",
    coordinates: [59.3334572, 18.0738859],
    description:
      "Two landmark Norrmalmstorg buildings hold Claesson Koivisto Rune interiors, a soaring lounge, DUX beds, and strong access to galleries, shopping, and Nybroviken transport.",
    officialUrl: "https://www.nobishotel.se/",
    imageSourceUrl:
      "https://nobis-2.s3.eu-central-1.amazonaws.com/Nobis%20Hotel%20Stockholm/Hotel/_1200x630_crop_center-center_82_none/33611/NobisStockholm_Lounge_Beatrice%20Graalheim_1.jpg?v=1776068045",
    bookingUrl: "https://www.booking.com/hotel/se/nobis.html",
    hours: {
      default:
        "Open daily with 24-hour front desk; check-in 2:00 PM, check-out 12:00 PM.",
    },
    price: "$$$$",
    priceSource:
      "Direct Booking.com property page and official Marriott property page",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "design_hotel",
    attributeTags: ["luxury", "design", "historic_building", "central"],
    editorialUrls: [
      "https://www.marriott.com/en-us/hotels/stonb-nobis-hotel-stockholm-a-member-of-design-hotels/overview/",
    ],
  }),
  stop({
    id: "stockholm-hotel-lydmar",
    name: "Lydmar Hotel",
    coordinates: [59.3289891, 18.0770973],
    description:
      "Lydmar's 46-room scale, rotating art, waterfront terrace, and individual interiors give the service more personality than a chain hotel while keeping Grand Hôtel facilities nearby.",
    officialUrl: "https://lydmar.com/",
    imageSourceUrl:
      "https://lydmar.com/content/uploads/2025/12/8V0A9013-copy-800x800.jpg",
    bookingUrl: "https://www.booking.com/hotel/se/lydmar.html",
    hours: { default: "Open daily; check-in 3:00 PM, check-out 12:00 PM." },
    price: "$$$$",
    priceSource:
      "Direct Booking.com property page and official Hilton/SLH property page",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "boutique_hotel",
    attributeTags: ["luxury", "waterfront", "art", "boutique"],
    editorialUrls: ["https://www.hilton.com/en/hotels/stolylx-lydmar-hotel/"],
  }),
  stop({
    id: "stockholm-hotel-skeppsholmen",
    name: "Hotel Skeppsholmen",
    coordinates: [59.3247487, 18.0875948],
    description:
      "Claesson Koivisto Rune converted 1699 naval barracks into a restrained 78-room hotel, trading nightlife immediacy for island quiet, waterside walks, and museum access.",
    officialUrl: "https://www.hotelskeppsholmen.se/en/",
    imageSourceUrl:
      "https://nobis-2.s3.eu-central-1.amazonaws.com/Hotel-Skeppsholmen/Hotel/_1200x630_crop_center-center_82_none/HotelSkeppsholmen_Entrance_Summer_BeatriceGraalheim_3_2025-03-10-154339_acfs.jpg?v=1776068379",
    bookingUrl: "https://www.booking.com/hotel/se/skeppsholmen.html",
    hours: { default: "Open daily; check-in 2:00 PM, check-out 12:00 PM." },
    price: "$$$",
    priceSource:
      "Direct Booking.com property page and official opening-hours page",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "historic_design_hotel",
    attributeTags: ["quiet", "historic_building", "design", "island"],
    editorialUrls: [
      "https://www.cntraveller.com/gallery/best-hotels-in-stockholm",
    ],
  }),
  stop({
    id: "stockholm-hotel-stadshotell",
    name: "Stockholm Stadshotell",
    coordinates: [59.3151965, 18.0668529],
    description:
      "A sensitive conversion of a 19th-century Södermalm landmark created 32 rooms, Swedish craft details, a courtyard, and ambitious dining without erasing the building's institutional history.",
    officialUrl: "https://stockholmstadshotell.com/",
    imageSourceUrl:
      "https://media.stockholmstadshotell.com/uploads/2026/07/stockholm-stadshotell-dimmed-v2-1800x.jpg",
    bookingUrl: "https://www.booking.com/hotel/se/stockholm-stadshotell.html",
    hours: {
      default:
        "Open daily with reception staffed 24 hours; check-in 2:00 PM, check-out 12:00 PM.",
    },
    price: "$$$$",
    priceSource: "Direct Booking.com property page and official contact page",
    venueKind: "lodging",
    lodgingType: "hotel",
    subcategory: "boutique_hotel",
    attributeTags: ["luxury", "historic_building", "boutique", "new_opening"],
    editorialUrls: [
      "https://www.cntraveller.com/gallery/best-hotels-in-stockholm",
    ],
  }),
];

const hostelStops: GuideStop[] = [
  stop({
    id: "stockholm-hostel-langholmen",
    name: "Långholmen Hostel",
    coordinates: [59.3213599, 18.0253855],
    description:
      "Original Crown Prison cells now hold simple bunk rooms on a green island with a beach, museum, pub, and restaurant; atmosphere favors history and quiet over parties.",
    officialUrl: "https://langholmen.com/en/hostel/",
    imageSourceUrl:
      "https://langholmen.com/wp-content/uploads/2020/11/lh-ute-flygfoto-anlg1-960x451-1.jpg",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/10766/langholmen-hostel/",
    hours: {
      default:
        "Hostel and reception open 24 hours daily; check-in from 3:00 PM, check-out by 10:00 AM.",
    },
    price: "$$",
    priceSource: "Direct Hostelworld property page and official hostel page",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "historic_hostel",
    attributeTags: ["hostel", "historic", "quiet", "beach"],
    editorialUrls: [
      "https://www.hostelworld.com/hostels/europe/sweden/stockholm/",
    ],
  }),
  stop({
    id: "stockholm-hostel-rygerfjord",
    name: "Rygerfjord Hotel & Hostel",
    coordinates: [59.3214101, 18.0590604],
    description:
      "Three moored ships provide small cabins, shared-kitchen access on one vessel, and broad Riddarfjärden views; thin walls and compact bunks are the honest tradeoff.",
    officialUrl: "https://rygerfjord.se/en/rygerfjord-2/",
    imageSourceUrl:
      "https://rygerfjord.se/wp-content/uploads/2016/05/boat-view2.jpg?id=13320",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/329479/rygerfjord-hotel-and-hostel/",
    hours: {
      default:
        "Reception open 24 hours daily; check-in 3:00 PM-11:00 PM, check-out by 11:00 AM.",
    },
    price: "$",
    priceSource: "Direct Hostelworld property page and official hostel page",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "boat_hostel",
    attributeTags: ["hostel", "boat_stay", "waterfront", "budget"],
    editorialUrls: [
      "https://www.hostelworld.com/hostels/europe/sweden/stockholm/",
    ],
  }),
  stop({
    id: "stockholm-hostel-stf-skeppsholmen",
    name: "STF Stockholm Skeppsholmen",
    coordinates: [59.3251826, 18.0812714],
    description:
      "Beds split between the landmark af Chapman sailing ship and the yellow Hantverkshuset building, with Old Town views, a café, and exceptionally central island calm.",
    officialUrl:
      "https://www.swedishtouristassociation.com/facilities/stf-stockholm-af-chapman-skeppsholmen/",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Af_Chapman_and_Skeppsholmen.jpg",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/32555/stf-af-chapman-skeppsholmen/",
    hours: {
      default:
        "Reception open 24 hours daily; check-in 3:00 PM-11:00 PM, check-out by 11:00 AM.",
    },
    price: "$$",
    priceSource: "Direct Hostelworld property page and STF property page",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "island_hostel",
    attributeTags: ["hostel", "boat_stay", "island", "central"],
    editorialUrls: [
      "https://www.hostelworld.com/hostels/europe/sweden/stockholm/",
    ],
  }),
  stop({
    id: "stockholm-hostel-castanea",
    name: "Castanea Old Town Hostel",
    coordinates: [59.3247393, 18.0727208],
    description:
      "A small, personal hostel in a centuries-old Gamla Stan house offers bright dorms, a guest kitchen, no curfew, and quiet common rooms after 11 PM.",
    officialUrl: "https://castaneahostel.com/en/",
    imageSourceUrl:
      "https://castaneahostel.com/wp-content/gallery/start-001/castanea-front-525x400px.jpg?t=1553062490",
    bookingUrl:
      "https://www.hostelworld.com/st/hotels/p/18034/castanea-old-town-hostel/",
    hours: {
      default:
        "Daily reception service runs until 6:00 PM; check-in from 3:00 PM and check-out by 11:00 AM, with arranged code arrival after reception closes.",
    },
    price: "$$",
    priceSource:
      "Direct Hostelworld property page and official practical-information page",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "old_town_hostel",
    attributeTags: ["hostel", "old_town", "guest_kitchen", "quiet"],
    editorialUrls: [
      "https://www.hostelworld.com/hostels/europe/sweden/stockholm/",
    ],
  }),
  stop({
    id: "stockholm-hostel-city-backpackers",
    name: "City Backpackers Hostel",
    coordinates: [59.3359019, 18.0552614],
    description:
      "Free pasta, scheduled social events, evening sauna access, a busy guest kitchen, and a central base make this the strongest choice for solo travelers seeking conversation.",
    officialUrl: "https://www.citybackpackers.se/",
    imageSourceUrl:
      "https://static.wixstatic.com/media/aabf63_9ca11f84714d43b48a8285fefa5898cc~mv2.jpg/v1/fill/w_1381,h_921,al_c/aabf63_9ca11f84714d43b48a8285fefa5898cc~mv2.jpg",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/1190/city-backpackers-hostel/",
    hours: {
      default:
        "Open 365 days with no curfew; check-in 2:00 PM-12:00 AM, check-out by 11:00 AM; phone service daily 9:00 AM-8:00 PM.",
    },
    price: "$",
    priceSource: "Direct Hostelworld property page and official hostel page",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "social_hostel",
    attributeTags: ["hostel", "social", "sauna", "solo_travel"],
    editorialUrls: [
      "https://www.hostelworld.com/hostels/europe/sweden/stockholm/",
    ],
  }),
  stop({
    id: "stockholm-hostel-red-boat",
    name: "The Red Boat Mälaren",
    coordinates: [59.3213851, 18.0614008],
    description:
      "Two red-and-green vessels hold simple wood-lined cabins, shared bathrooms, a breakfast room, and sun decks near Slussen; lake views compensate for close quarters.",
    officialUrl: "https://www.theredboat.com/",
    imageSourceUrl:
      "https://www.theredboat.com/wp-content/uploads/2016/10/8-Lana-scaled.jpg",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/5720/the-red-boat-malaren/",
    hours: {
      default:
        "Open daily; check-in 3:00 PM-11:00 PM, check-out 4:00 AM-11:00 AM; arrivals after 11:00 PM require booking-confirmation instructions.",
    },
    price: "$",
    priceSource: "Direct Hostelworld and Booking.com property pages",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "boat_hostel",
    attributeTags: ["hostel", "boat_stay", "waterfront", "budget"],
    editorialUrls: ["https://www.booking.com/hotel/se/den-rapda-bay-ten.html"],
  }),
  stop({
    id: "stockholm-hostel-crafoord",
    name: "Crafoord Place",
    coordinates: [59.3373495, 18.0462204],
    description:
      "An eighth-floor common room, broad city-and-canal views, included linens, and a useful kitchen define this homey hostel; the final staircase follows the elevator ride.",
    officialUrl: "https://crafoordplace.se/",
    imageSourceUrl:
      "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/25953/ne3lcczrwaoylmowpdaq.jpg",
    bookingUrl: "https://www.hostelworld.com/hostels/p/25953/crafoord-place/",
    hours: {
      default: "Open daily; check-in 2:00 PM-12:00 AM, check-out by 11:00 AM.",
    },
    price: "$",
    priceSource: "Direct Hostelworld property page and official hostel page",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "budget_hostel",
    attributeTags: ["hostel", "budget", "guest_kitchen", "views"],
    editorialUrls: [
      "https://www.hostelworld.com/hostels/europe/sweden/stockholm/",
    ],
  }),
  stop({
    id: "stockholm-hostel-dockside",
    name: "Dockside Hostel Old Town",
    coordinates: [59.3229268, 18.07471],
    description:
      "Forty beds, a practical kitchen, and a Skeppsbron waterfront address keep this compact hostel functional; alcohol is prohibited and late arrivals need advance code arrangements.",
    officialUrl: "https://www.docksidehostel.se/en/",
    imageSourceUrl:
      "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/1/18101/7.jpg",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/18101/dockside-hostel-old-town/",
    hours: {
      default:
        "Open 24 hours daily; reception check-in 3:00 PM-6:00 PM, check-out by 11:00 AM; earlier or later arrivals require advance instructions.",
    },
    price: "$",
    priceSource:
      "Direct Hostelworld property page and official guest-information page",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "old_town_hostel",
    attributeTags: ["hostel", "old_town", "guest_kitchen", "quiet"],
    editorialUrls: [
      "https://www.hostelworld.com/hostels/europe/sweden/stockholm/",
    ],
  }),
  stop({
    id: "stockholm-hostel-city-hostel",
    name: "City Hostel - Central Station",
    coordinates: [59.3327325, 18.0449179],
    description:
      "Clean dorms, free linens, a large kitchen, and key-code access suit travelers prioritizing sleep and transport; the quiet social atmosphere is less useful for party seekers.",
    officialUrl: "https://cityhostel.se/en/",
    imageSourceUrl:
      "https://cityhostel.se/wp-content/uploads/2024/06/Vardagsrum-1.webp",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/18098/city-hostel-central-station/",
    hours: {
      default:
        "Check-in from 2:00 PM with 24-hour code access; check-out by 11:00 AM; luggage storage daily 9:00 AM-4:00 PM.",
    },
    price: "$",
    priceSource: "Direct Hostelworld property page and official FAQ",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "central_hostel",
    attributeTags: ["hostel", "quiet", "guest_kitchen", "transport_access"],
    editorialUrls: [
      "https://www.hostelworld.com/hostels/europe/sweden/stockholm/",
    ],
  }),
  stop({
    id: "stockholm-hostel-generator",
    name: "Generator Stockholm",
    coordinates: [59.3358575, 18.0507213],
    description:
      "A large design hostel adds Hilma bar, games, laundry, bike rental, and round-the-clock reception; scale brings reliable facilities but a more commercial social scene.",
    officialUrl: "https://staygenerator.com/hostels/stockholm",
    imageSourceUrl:
      "https://staygenerator.com/web/media/room-images/stockholm/generator-sthlm-02-aug-2016-_66_7119.jpg?mode=max&quality=100&v=201804230957",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/267266/generator-stockholm/",
    hours: {
      default:
        "Reception open 24 hours daily; check-in from 3:00 PM, check-out by 10:00 AM.",
    },
    price: "$",
    priceSource: "Direct Hostelworld property page and official Generator FAQ",
    venueKind: "lodging",
    lodgingType: "hostel",
    subcategory: "design_hostel",
    attributeTags: ["hostel", "social", "design", "bar"],
    editorialUrls: [
      "https://www.hostelworld.com/hostels/europe/sweden/stockholm/",
    ],
  }),
];

const casualBarStops: GuideStop[] = [
  stop({
    id: "stockholm-bar-akkurat",
    name: "Akkurat",
    coordinates: [59.3198089, 18.0688539],
    description:
      "Akkurat backs more than fifty taps with an exceptional whisky cellar, vintage beer, cask ale, mussels, and regular live sets in a Södermalm room built for serious but sociable drinking.",
    officialUrl: "https://akkurat.se/",
    imageSourceUrl:
      "https://static.thatsup.co/content/img/place/stockholm/ak/854619a7-2551-11e9-8e76-f23c919fea3e/akkurat-restaurang-bar-9d90c1e9.jpg",
    hours: {
      mon: "4:00 PM-midnight",
      tue: "4:00 PM-midnight",
      wed: "4:00 PM-1:00 AM",
      thu: "4:00 PM-1:00 AM",
      fri: "3:00 PM-1:00 AM",
      sat: "3:00 PM-1:00 AM",
      sun: "3:00 PM-11:00 PM",
    },
    price: "$$",
    priceSource: "Official bar and menu pages",
    venueKind: "nightlife",
    nightlifeType: "beer_bar",
    musicGenres: ["blues", "rock", "folk"],
    subcategory: "beer_bar",
    attributeTags: ["craft_beer", "whisky", "live_music", "local_bar"],
    editorialUrls: [
      "https://thatsup.se/stockholm/restaurang/akkurat-bar-restaurang/photos/",
    ],
  }),
  stop({
    id: "stockholm-bar-zum-franziskaner",
    name: "Zum Franziskaner",
    coordinates: [59.3224045, 18.0741533],
    description:
      "Founded in 1889, this tile-and-dark-wood beer hall draws Bavarian and Swedish brewing traditions together through Franconian taps, house selections, schnitzel, sausages, and herring.",
    officialUrl: "https://zumen.se/",
    imageSourceUrl: "https://zumen.se/onewebmedia/_MG_2902-edit-Stene.jpg",
    hours: {
      mon: "4:00 PM-11:00 PM",
      tue: "4:00 PM-midnight",
      wed: "4:00 PM-midnight",
      thu: "4:00 PM-midnight",
      fri: "3:00 PM-midnight",
      sat: "3:00 PM-midnight",
      sun: "3:00 PM-11:00 PM",
    },
    price: "$$",
    priceSource: "Official opening-hours and menu pages",
    venueKind: "nightlife",
    nightlifeType: "beer_bar",
    musicGenres: ["background", "traditional"],
    subcategory: "historic_beer_hall",
    attributeTags: ["craft_beer", "historic", "group_friendly", "pub_food"],
  }),
  stop({
    id: "stockholm-bar-oliver-twist",
    name: "Oliver Twist",
    coordinates: [59.3181568, 18.0699538],
    description:
      "Twenty-four taps, hundreds of bottles and cans, three rotating real ales, and an American-leaning kitchen make Oliver Twist a dependable place to compare Swedish and imported craft beer.",
    officialUrl: "https://www.olivertwist.se/",
    imageSourceUrl:
      "https://static.wixstatic.com/media/2cc9bc_95f91ccec34047f5ae567e05251b2358~mv2.webp",
    hours: {
      mon: "11:00 AM-10:00 PM",
      tue: "11:00 AM-midnight",
      wed: "11:00 AM-midnight",
      thu: "11:00 AM-1:00 AM",
      fri: "11:00 AM-1:00 AM",
      sat: "12:00 PM-1:00 AM",
      sun: "1:00 PM-10:00 PM",
    },
    price: "$$",
    priceSource: "Official opening-hours and beer pages",
    venueKind: "nightlife",
    nightlifeType: "beer_bar",
    musicGenres: ["rock", "background"],
    subcategory: "craft_beer_pub",
    attributeTags: [
      "craft_beer",
      "real_ale",
      "pub_food",
      "walk_in_friendly_nightlife",
    ],
  }),
  stop({
    id: "stockholm-bar-kvarnen",
    name: "Kvarnen",
    coordinates: [59.3148739, 18.0743313],
    description:
      "Kvarnen has served Södermalm since 1908, preserving a broad, high-ceilinged beer-hall atmosphere while adding Swedish comfort food, football crowds, DJs, and a late basement club.",
    officialUrl: "https://www.kvarnen.com/en",
    imageSourceUrl:
      "https://customer-if70hhxb5jzoq51a.cloudflarestream.com/0b19783159a460b66b01662084e0859b/thumbnails/thumbnail.jpg?time=0.6s&width=1920",
    bookingUrl: "https://www.kvarnen.com/en",
    hours: {
      mon: "11:00 AM-11:00 PM",
      tue: "11:00 AM-11:00 PM",
      wed: "11:00 AM-midnight",
      thu: "11:00 AM-midnight",
      fri: "11:00 AM-3:00 AM",
      sat: "11:30 AM-3:00 AM",
      sun: "11:30 AM-11:00 PM",
    },
    price: "$$",
    priceSource: "Official hours and menu pages",
    venueKind: "nightlife",
    nightlifeType: "pub",
    musicGenres: ["pop", "electronic", "dj_sets"],
    subcategory: "historic_pub",
    attributeTags: [
      "historic",
      "swedish_classics",
      "late_night",
      "group_friendly",
    ],
  }),
  stop({
    id: "stockholm-bar-tudor-arms",
    name: "Tudor Arms",
    coordinates: [59.3348944, 18.0853465],
    description:
      "Opened in 1969 as Sweden's first British-style pub, Tudor Arms retains patterned carpet, darts, pies, cask-minded beer, and a genial football-watching crowd in Östermalm.",
    officialUrl: "https://www.tudorarms.com/main.html",
    imageSourceUrl: "https://www.tudorarms.com/100815_01.JPG",
    hours: {
      mon: "4:00 PM-10:00 PM",
      tue: "4:00 PM-10:00 PM",
      wed: "4:00 PM-11:00 PM",
      thu: "4:00 PM-11:00 PM",
      fri: "3:00 PM-11:00 PM",
      sat: "3:00 PM-11:00 PM",
      sun: "3:00 PM-8:00 PM",
    },
    price: "$$",
    priceSource: "Official opening-hours page updated July 21, 2026",
    venueKind: "nightlife",
    nightlifeType: "pub",
    musicGenres: ["background", "sports"],
    subcategory: "british_pub",
    attributeTags: ["historic", "football", "pub_food", "low_key_nightlife"],
  }),
  stop({
    id: "stockholm-bar-stampen",
    name: "Stampen",
    coordinates: [59.3252169, 18.0677152],
    description:
      "Stampen fills a narrow Gamla Stan room with jazz, blues, funk, and soul bands, preserving the close-range club feeling that has defined the venue since 1968.",
    officialUrl: "https://www.stampen.se/",
    imageSourceUrl:
      "https://stampen.se/wp-content/uploads/2025/03/Stampen_Old_Town_Stockholm-Restaurant-Bar-Web.jpg",
    timetableUrl: "https://www.stampen.se/",
    hours: {
      default:
        "Open on programmed concert and jam dates; doors and start times are published for each show in the official event calendar.",
    },
    price: "$$",
    priceSource: "Official event and ticket calendar",
    venueKind: "nightlife",
    nightlifeType: "live_music_venue",
    musicGenres: ["jazz", "blues", "funk", "soul"],
    subcategory: "live_music_bar",
    attributeTags: ["live_music", "historic", "ticketed_events", "old_town"],
  }),
  stop({
    id: "stockholm-bar-soldaten-svejk",
    name: "Soldaten Švejk",
    coordinates: [59.3144202, 18.0767313],
    description:
      "This unfussy Czech pub pours Bernard beer beside goulash, schnitzel, and dumplings, favoring communal tables and regulars over décor; it takes a fixed July summer break.",
    officialUrl: "https://svejk.se/en/contact/",
    imageSourceUrl:
      "https://static.thatsup.co/content/img/place/stockholm/so/8545dfa9-2551-11e9-8e76-f23c919fea3e/user-photo/6803fd21.jpg?1739912988",
    hours: {
      mon: "4:00 PM-11:00 PM",
      tue: "4:00 PM-11:00 PM",
      wed: "4:00 PM-11:00 PM",
      thu: "4:00 PM-11:00 PM",
      fri: "4:00 PM-midnight",
      sat: "3:00 PM-midnight",
      sun: "4:00 PM-11:00 PM",
      default:
        "Closed annually June 30-July 31; regular service resumes August 1.",
    },
    price: "$$",
    priceSource: "Official contact and menu pages",
    venueKind: "nightlife",
    nightlifeType: "pub",
    musicGenres: ["background", "traditional"],
    subcategory: "czech_pub",
    attributeTags: ["local_bar", "czech_beer", "pub_food", "low_key_nightlife"],
  }),
  stop({
    id: "stockholm-bar-savant",
    name: "Savant Bar",
    coordinates: [59.3405662, 18.0633471],
    description:
      "Savant pours more than ten natural wines by the glass from a cellar of roughly five hundred bottles, pairing them with Swedish vegetables, careful snacks, and walk-in spontaneity.",
    officialUrl: "https://www.savantbar.se/",
    imageSourceUrl:
      "https://static1.squarespace.com/static/5dcfbd9af1a7771855d1d15d/t/694710c11b8bb9172c3db989/1766265025596/Savant+bar+outside+2.jpg?format=1500w",
    hours: {
      mon: "2:00 PM-11:00 PM",
      tue: "2:00 PM-midnight",
      wed: "2:00 PM-midnight",
      thu: "2:00 PM-midnight",
      fri: "2:00 PM-midnight",
      sat: "1:00 PM-midnight",
      sun: "1:00 PM-11:00 PM",
    },
    price: "$$$",
    priceSource: "Official wine, food, and opening-hours pages",
    venueKind: "nightlife",
    nightlifeType: "wine_bar",
    musicGenres: ["soul", "jazz", "eclectic"],
    subcategory: "natural_wine_bar",
    attributeTags: [
      "natural_wine",
      "small_plates",
      "walk_in_friendly_nightlife",
      "date_night",
    ],
  }),
  stop({
    id: "stockholm-bar-omnipollos-hatt",
    name: "Omnipollos Hatt",
    coordinates: [59.318061, 18.0722336],
    description:
      "Omnipollo's compact Södermalm taproom turns its own playful, high-impact beers and rotating collaborations into the main event, with unconventional pizza and walk-in-only seating supporting the pours.",
    officialUrl: "https://www.omnipolloshatt.com/",
    imageSourceUrl:
      "https://www.omnipolloshatt.com/wp-content/plugins/beercam/pics/beercam2026-08-25_14:30:26.jpg",
    hours: { default: "Daily 12:00 PM-1:00 AM; walk-ins only." },
    price: "$$",
    priceSource: "Official menu and opening-hours page updated August 2026",
    venueKind: "nightlife",
    nightlifeType: "beer_bar",
    musicGenres: ["hip_hop", "electronic", "eclectic"],
    subcategory: "brewery_taproom",
    attributeTags: [
      "craft_beer",
      "pizza",
      "walk_in_friendly_nightlife",
      "late_night",
    ],
  }),
  stop({
    id: "stockholm-bar-stigbergets-fot",
    name: "Stigbergets Fot",
    coordinates: [59.3191365, 18.0709544],
    description:
      "Stigbergets' Stockholm taproom keeps twenty-four taps for house and guest beer, adds a full kitchen, and shifts toward DJs on Friday and Saturday nights.",
    officialUrl: "https://www.stigbergetsfot.se/",
    imageSourceUrl:
      "https://www.stigbergetsfot.se/images/photo-beer-taps-1920.jpg",
    hours: {
      mon: "4:00 PM-midnight",
      tue: "4:00 PM-midnight",
      wed: "11:30 AM-midnight",
      thu: "11:30 AM-midnight",
      fri: "11:30 AM-1:00 AM",
      sat: "12:00 PM-1:00 AM",
      sun: "12:00 PM-midnight",
    },
    price: "$$",
    priceSource: "Official food, beer, and opening-hours pages",
    venueKind: "nightlife",
    nightlifeType: "beer_bar",
    musicGenres: ["electronic", "hip_hop", "dj_sets"],
    subcategory: "brewery_taproom",
    attributeTags: ["craft_beer", "dj_sets", "pub_food", "late_night"],
  }),
];

const cocktailStops: GuideStop[] = [
  stop({
    id: "stockholm-cocktail-roda-huset",
    name: "Röda Huset",
    coordinates: [59.3326849, 18.0661748],
    description:
      "Röda Huset translates Swedish forests, berries, dairy, and pantry techniques into assured cocktails, with a focused tasting format available for drinkers wanting the menu's full argument.",
    officialUrl: "https://rodahuset.nu/",
    imageSourceUrl:
      "https://rodahuset.nu/wp-content/uploads/2026/05/RH_FACADE02-scaled.webp",
    bookingUrl: "https://rodahuset.nu/",
    hours: {
      mon: "Closed",
      tue: "5:00 PM-midnight",
      wed: "5:00 PM-midnight",
      thu: "5:00 PM-midnight",
      fri: "4:00 PM-1:00 AM",
      sat: "4:00 PM-1:00 AM",
      sun: "Closed",
    },
    price: "$$$",
    priceSource: "Official bar, menu, and reservation pages",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["soul", "jazz", "eclectic"],
    subcategory: "cocktail_bar",
    attributeTags: [
      "craft_cocktails",
      "tasting_menu",
      "premium_drinks",
      "date_night",
    ],
    editorialUrls: ["https://www.worlds50bestbars.com/the-list/rodahuset.html"],
  }),
  stop({
    id: "stockholm-cocktail-tjoget",
    name: "Tjoget",
    coordinates: [59.316191, 18.034937],
    description:
      "Tjoget anchors a five-part Hornstull venue with cocktails inspired by southern Europe and North Africa, backed by a wine bar, dining room, beer counter, and barbershop.",
    officialUrl: "https://tjoget.com/",
    imageSourceUrl:
      "https://tjoget.com/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Ftjoget%2F218f14f0-9fbc-427e-9bb4-2813f0a20ff1_05042022-IMG_0366.jpg%3Fauto%3Dformat&w=1200&q=90",
    bookingUrl: "https://tjoget.com/",
    hours: {
      mon: "5:00 PM-1:00 AM",
      tue: "5:00 PM-1:00 AM",
      wed: "5:00 PM-1:00 AM",
      thu: "5:00 PM-1:00 AM",
      fri: "5:00 PM-3:00 AM",
      sat: "5:00 PM-3:00 AM",
      sun: "5:00 PM-1:00 AM",
    },
    price: "$$$",
    priceSource: "Official venue and reservation pages",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["soul", "funk", "electronic"],
    subcategory: "cocktail_complex",
    attributeTags: [
      "craft_cocktails",
      "lively_nightlife",
      "late_night",
      "reservation_recommended_nightlife",
    ],
    editorialUrls: ["https://www.worlds50bestbars.com/the-list/tjoget.html"],
  }),
  stop({
    id: "stockholm-cocktail-le-hibou",
    name: "Le Hibou",
    coordinates: [59.3314856, 18.0746988],
    description:
      "Bank Hotel's top-floor bar feels like an opulent Parisian apartment, then opens to terraces above Nybroviken; the cocktails and city views are polished, priced accordingly, and walk-in only.",
    officialUrl: "https://bankhotel.se/sv/restaurants/le-hibou/",
    imageSourceUrl:
      "https://bankhotel.se/wp-content/uploads/2026/06/bank-hotel_2026_emil-lif-9825-scaled.jpg",
    hours: {
      mon: "4:00 PM-11:00 PM",
      tue: "4:00 PM-11:00 PM",
      wed: "3:00 PM-1:00 AM",
      thu: "3:00 PM-1:00 AM",
      fri: "3:00 PM-1:00 AM",
      sat: "3:00 PM-1:00 AM",
      sun: "4:00 PM-11:00 PM",
    },
    price: "$$$",
    priceSource: "Official hotel bar page and drinks menu",
    venueKind: "nightlife",
    nightlifeType: "rooftop_bar",
    musicGenres: ["lounge", "soul", "jazz"],
    subcategory: "rooftop_cocktail_bar",
    attributeTags: [
      "craft_cocktails",
      "rooftop",
      "scenic_nightlife",
      "walk_in_friendly_nightlife",
    ],
  }),
  stop({
    id: "stockholm-cocktail-lucys",
    name: "Lucy's Flower Shop",
    coordinates: [59.336632, 18.0719567],
    description:
      "A discreet flower-shop entrance leads below ground to a velvet-lined, low-lit room where tightly composed cocktails and attentive table service reward booking, though a few seats remain for walk-ins.",
    officialUrl: "https://lucysstockholm.se/",
    imageSourceUrl:
      "https://www.visitstockholm.com/media/images/51dae0818aec424e8b4c996c3d705ed4.width-1280.jpg",
    bookingUrl: "https://lucysstockholm.se/",
    hours: {
      mon: "Closed",
      tue: "5:00 PM-1:00 AM",
      wed: "5:00 PM-1:00 AM",
      thu: "5:00 PM-1:00 AM",
      fri: "5:00 PM-1:00 AM",
      sat: "5:00 PM-1:00 AM",
      sun: "5:00 PM-1:00 AM",
    },
    price: "$$$",
    priceSource: "Official venue and booking pages",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["jazz", "soul", "lounge"],
    subcategory: "speakeasy",
    attributeTags: [
      "craft_cocktails",
      "speakeasy",
      "date_night",
      "reservation_recommended_nightlife",
    ],
    editorialUrls: ["https://www.visitstockholm.com/o/lucys-flower-shop/"],
  }),
  stop({
    id: "stockholm-cocktail-gemma",
    name: "A Bar Called Gemma",
    coordinates: [59.3371061, 18.0771224],
    description:
      "Gemma balances precise classics with inventive seasonal drinks and notably warm hosting, avoiding the stiffness that can accompany its award-heavy reputation and compact Östermalm room.",
    officialUrl: "https://www.instagram.com/abarcalledgemma/",
    imageSourceUrl:
      "https://static.thatsup.co/content/img/place/stockholm/a-/20e7dc06-4c06-11e9-9f78-f23c919fea3e/user-photo/afb4b6fd.jpg?1697967839",
    hours: {
      mon: "3:00 PM-12:30 AM",
      tue: "3:00 PM-12:30 AM",
      wed: "3:00 PM-12:30 AM",
      thu: "3:00 PM-12:30 AM",
      fri: "3:00 PM-12:30 AM",
      sat: "3:00 PM-12:30 AM",
      sun: "Closed",
    },
    price: "$$$",
    priceSource: "Official menu and current August 2026 venue hours",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["soul", "funk", "jazz"],
    subcategory: "cocktail_bar",
    attributeTags: [
      "craft_cocktails",
      "date_night",
      "premium_drinks",
      "walk_in_friendly_nightlife",
    ],
    editorialUrls: ["https://thatsup.se/stockholm/bar/a-bar-called-gemma/"],
  }),
  stop({
    id: "stockholm-cocktail-pharmarium",
    name: "Pharmarium",
    coordinates: [59.324869, 18.0709908],
    description:
      "Set where Stockholm's first pharmacy opened in 1575, Pharmarium uses herbs, tinctures, seasonal produce, and apothecary references in cocktails that remain balanced rather than merely theatrical.",
    officialUrl: "https://pharmarium.se/",
    imageSourceUrl:
      "https://pharmarium.se/wp-content/uploads/2026/05/Pharmarium-mars-38-scaled.jpg",
    bookingUrl: "https://pharmarium.se/",
    hours: {
      mon: "5:00 PM-11:00 PM",
      tue: "5:00 PM-11:00 PM",
      wed: "4:00 PM-midnight",
      thu: "4:00 PM-midnight",
      fri: "3:00 PM-1:00 AM",
      sat: "3:00 PM-1:00 AM",
      sun: "5:00 PM-11:00 PM",
    },
    price: "$$$",
    priceSource: "Official site and current August 2026 venue hours",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["lounge", "jazz", "soul"],
    subcategory: "apothecary_cocktail_bar",
    attributeTags: [
      "craft_cocktails",
      "historic_setting",
      "old_town",
      "date_night",
    ],
  }),
  stop({
    id: "stockholm-cocktail-herno",
    name: "Hernö Gin Bar",
    coordinates: [59.3197365, 18.0703815],
    description:
      "Sweden's first dedicated gin-distillery bar puts Hernö expressions into flights, highballs, and cocktails, with northern Swedish plates and guided tastings adding useful context beyond tonic choices.",
    officialUrl: "https://www.hernogin.com/herno-gin-bar/stockholm",
    imageSourceUrl:
      "https://files.hernogin.com/app/uploads/2026/01/19091716/Herno-Gin-Bar-Sthlm-1024x696.jpg",
    bookingUrl: "https://www.hernogin.com/herno-gin-bar/stockholm",
    hours: {
      mon: "Closed",
      tue: "4:00 PM-11:00 PM",
      wed: "4:00 PM-midnight",
      thu: "4:00 PM-midnight",
      fri: "4:00 PM-1:00 AM",
      sat: "2:00 PM-1:00 AM",
      sun: "Closed",
    },
    price: "$$$",
    priceSource: "Official bar, menu, and tasting pages",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["soul", "pop", "lounge"],
    subcategory: "gin_bar",
    attributeTags: ["gin", "craft_cocktails", "tastings", "premium_drinks"],
  }),
  stop({
    id: "stockholm-cocktail-stjartilleriet",
    name: "Stjärtilleriet",
    coordinates: [59.3346504, 18.081421],
    description:
      "Stjärtilleriet builds a playful, technically exact drinks list inside restaurant Artilleriet, with the 2026 Bartenders' Choice award for best menu reflecting more than cheeky naming.",
    officialUrl: "https://stjartilleriet.se/",
    imageSourceUrl:
      "https://static.thatsup.website/138/7286/hero.jpg?v=1646394265",
    hours: {
      mon: "Closed",
      tue: "4:00 PM-midnight",
      wed: "4:00 PM-midnight",
      thu: "4:00 PM-midnight",
      fri: "4:00 PM-1:00 AM",
      sat: "3:00 PM-1:00 AM",
      sun: "Closed",
    },
    price: "$$$",
    priceSource: "Official bar page and 2026 Bartenders' Choice Awards",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["funk", "soul", "electronic"],
    subcategory: "cocktail_bar",
    attributeTags: [
      "craft_cocktails",
      "award_winning",
      "lively_nightlife",
      "date_night",
    ],
    editorialUrls: ["https://bartenderschoiceawards.com/"],
  }),
  stop({
    id: "stockholm-cocktail-cadierbaren",
    name: "Cadierbaren",
    coordinates: [59.329552, 18.0756112],
    description:
      "Grand Hôtel's long-running salon faces the Royal Palace and harbor, serving polished classics, afternoon tea, and late drinks with the service and prices of a formal grand hotel.",
    officialUrl:
      "https://grandhotel.se/en/food-beverage/the-cadier-bar/opening-hours-and-contact",
    imageSourceUrl:
      "https://grandhotel.se/sites/default/files/styles/max_1300x1300/public/images/2025/09/Cadierbaren.JPG?itok=jPjSVUDd",
    bookingUrl: "https://grandhotel.se/en/food-beverage/the-cadier-bar",
    hours: {
      mon: "7:00 AM-1:00 AM",
      tue: "7:00 AM-1:00 AM",
      wed: "7:00 AM-1:00 AM",
      thu: "7:00 AM-2:00 AM",
      fri: "7:00 AM-2:00 AM",
      sat: "8:00 AM-2:00 AM",
      sun: "8:00 AM-1:00 AM",
    },
    price: "$$$",
    priceSource: "Official bar hours and drinks menu",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["piano", "jazz", "lounge"],
    subcategory: "hotel_bar",
    attributeTags: [
      "classic_cocktails",
      "scenic_nightlife",
      "premium_drinks",
      "dressy",
    ],
  }),
  stop({
    id: "stockholm-cocktail-afterglow",
    name: "Bar Afterglow",
    coordinates: [59.3143772, 18.090349],
    description:
      "Afterglow brings inventive cocktails and an easy living-room mood to eastern Södermalm, making experimentation feel approachable through playful flavors, relaxed service, and a neighborhood-scale room.",
    officialUrl: "https://www.instagram.com/bar.afterglow/",
    imageSourceUrl:
      "https://static.thatsup.co/content/img/place/stockholm/ba/be474035-2187-11ee-930c-86d7fdd99ed5/user-photo/b48b29a4.jpg?1739032637",
    hours: {
      mon: "Closed",
      tue: "5:00 PM-midnight",
      wed: "5:00 PM-midnight",
      thu: "5:00 PM-midnight",
      fri: "4:00 PM-midnight",
      sat: "3:00 PM-midnight",
      sun: "Closed",
    },
    price: "$$$",
    priceSource:
      "Official social profile and current 2026 Stockholm venue listing",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["soul", "funk", "eclectic"],
    subcategory: "neighborhood_cocktail_bar",
    attributeTags: [
      "craft_cocktails",
      "local_bar",
      "low_key_nightlife",
      "walk_in_friendly_nightlife",
    ],
    editorialUrls: ["https://thatsup.se/stockholm/bar/bar-afterglow/"],
  }),
];

const cultureStops: GuideStop[] = [
  stop({
    id: "stockholm-culture-vasa",
    name: "Vasa Museum",
    coordinates: [59.3280594, 18.0913656],
    description:
      "The nearly intact 1628 warship Vasa dominates a purpose-built museum that explains its brief maiden voyage, three-century recovery, conservation science, crew, and contested imperial context.",
    officialUrl: "https://www.vasamuseet.se/en/visit/hours--admission",
    imageSourceUrl:
      "https://www.vasamuseet.se/globalassets/vasamuseet/pressgenrebilder/press-images-eng/the-ship/vasa-01-2020.jpg",
    hours: {
      default:
        "June-August daily 8:30 AM-6:00 PM; September-May daily 10:00 AM-5:00 PM, Wednesday until 8:00 PM.",
    },
    venueKind: "culture",
    subcategory: "maritime_museum",
    attributeTags: ["maritime", "history", "family_friendly", "rainy_day"],
    editorialUrls: [
      "https://www.vasamuseet.se/en/about-the-vasa-museum/press/press-images",
    ],
  }),
  stop({
    id: "stockholm-culture-nationalmuseum",
    name: "Nationalmuseum",
    coordinates: [59.3284983, 18.0781214],
    description:
      "Sweden's national collection ranges from medieval painting to modern design, with Rembrandt, French eighteenth-century art, Nordic decorative arts, and a carefully restored waterfront building sharing equal weight.",
    officialUrl: "https://www.nationalmuseum.se/en",
    imageSourceUrl:
      "https://www.nationalmuseum.se/imager/1840fb061599927392a7a02c6ff293ec/nm-exteri%C3%B6r-2417_5d3b5a89a91d99f5838a19126bef32af.jpg",
    hours: {
      mon: "Closed",
      tue: "11:00 AM-5:00 PM",
      wed: "11:00 AM-5:00 PM",
      thu: "11:00 AM-8:00 PM",
      fri: "11:00 AM-5:00 PM",
      sat: "11:00 AM-5:00 PM",
      sun: "11:00 AM-5:00 PM",
    },
    venueKind: "culture",
    subcategory: "art_museum",
    attributeTags: ["art", "design", "central", "rainy_day"],
  }),
  stop({
    id: "stockholm-culture-moderna",
    name: "Moderna Museet",
    coordinates: [59.3263494, 18.0840004],
    description:
      "Moderna Museet places Picasso, Matisse, Dali, photography, film, and strong Nordic contemporary work in Rafael Moneo's Skeppsholmen building, with temporary shows often justifying repeat visits.",
    officialUrl: "https://www.modernamuseet.se/stockholm/en/visit/",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Moderna_museet_2014.jpg",
    hours: {
      mon: "Closed",
      tue: "10:00 AM-8:00 PM",
      wed: "10:00 AM-6:00 PM",
      thu: "10:00 AM-6:00 PM",
      fri: "10:00 AM-8:00 PM",
      sat: "10:00 AM-6:00 PM",
      sun: "10:00 AM-6:00 PM",
    },
    venueKind: "culture",
    subcategory: "modern_art_museum",
    attributeTags: ["modern_art", "photography", "island", "rainy_day"],
  }),
  stop({
    id: "stockholm-culture-fotografiska",
    name: "Fotografiska Stockholm",
    coordinates: [59.3180039, 18.0847007],
    description:
      "Fotografiska rotates major documentary, fashion, portrait, and conceptual photography shows through a converted customs house, then extends the visit with broad water views and late closing hours.",
    officialUrl: "https://stockholm.fotografiska.com/en/visit/",
    imageSourceUrl:
      "https://cdn.sanity.io/images/2xi539qp/production/2d5584d1ca51cfd4bd7a7c28c05b3fc9266e9b56-1500x1000.jpg?w=1200&q=80",
    hours: {
      default:
        "Daily 10:00 AM-11:00 PM; closed Midsummer Eve and open 10:00 AM-8:00 PM on Christmas Eve.",
    },
    venueKind: "culture",
    subcategory: "photography_museum",
    attributeTags: ["photography", "late_opening", "waterfront", "rainy_day"],
  }),
  stop({
    id: "stockholm-culture-skansen",
    name: "Skansen",
    coordinates: [59.3266228, 18.1052823],
    description:
      "The world's oldest open-air museum brings historic buildings, craft demonstrations, seasonal celebrations, gardens, and Nordic animals together across a large Djurgården hilltop rather than a quick indoor circuit.",
    officialUrl:
      "https://www.skansen.se/en/plan-your-visit/opening-hours-and-prices/",
    imageSourceUrl:
      "https://www.skansen.se/wp-content/uploads/2026/02/Hos-faren-pa-Lill-Skansen.jpg",
    hours: {
      default:
        "June 1-August 30 daily 10:00 AM-6:00 PM; August 31-September 27 daily 10:00 AM-5:00 PM; late September-January generally weekdays 10:00 AM-3:00 PM and weekends 10:00 AM-4:00 PM, with exact holiday hours in the official calendar.",
    },
    venueKind: "culture",
    subcategory: "open_air_museum",
    attributeTags: ["history", "family_friendly", "animals", "outdoors"],
  }),
  stop({
    id: "stockholm-culture-nobel",
    name: "Nobel Prize Museum",
    coordinates: [59.3252155, 18.0708309],
    description:
      "The former Stock Exchange explains Alfred Nobel, laureates, contested discoveries, and the prize process through artifacts, short films, changing exhibitions, and public talks in Stortorget.",
    officialUrl:
      "https://www.nobelprizemuseum.se/en/plan-your-visit/opening-hours/",
    imageSourceUrl:
      "https://www.nobelprizemuseum.se/images/158420-hero-desktop-thin-2x.jpg",
    hours: {
      default:
        "August daily 10:00 AM-7:00 PM, Friday until 9:00 PM; September Monday closed, Tuesday-Thursday 11:00 AM-5:00 PM, Friday 11:00 AM-9:00 PM, weekends 10:00 AM-6:00 PM; later seasonal and holiday hours are dated on the official page.",
    },
    venueKind: "culture",
    subcategory: "science_history_museum",
    attributeTags: ["science", "history", "old_town", "rainy_day"],
  }),
  stop({
    id: "stockholm-culture-royal-palace",
    name: "The Royal Palace",
    coordinates: [59.3268648, 18.0703216],
    description:
      "The working royal palace opens state apartments, the Treasury, Tre Kronor Museum, and changing exhibitions, revealing both Bernadotte ceremonial life and the medieval castle beneath the current baroque complex.",
    officialUrl:
      "https://www.royalpalaces.se/english/royal-palaces-and-sites/the-royal-palace/opening-hours.html",
    imageSourceUrl:
      "https://www.kungligaslotten.se/images/18.49cfdbce19197411a8a2fcfc/1725356767757/Kungliga%20slottet%20ext%20foto%20Raphael%20Stecksen.webp",
    hours: {
      default:
        "May-September daily 10:00 AM-5:00 PM; October-April daily 10:00 AM-4:00 PM. Royal receptions can close individual rooms, with dated notices published on the official opening-hours page.",
    },
    venueKind: "culture",
    subcategory: "royal_palace",
    attributeTags: [
      "royal_history",
      "architecture",
      "old_town",
      "changing_of_guard",
    ],
  }),
  stop({
    id: "stockholm-culture-nordiska",
    name: "Nordiska museet",
    coordinates: [59.3291464, 18.09389],
    description:
      "Nordiska museet examines everyday life across Sweden and the Nordic region through clothing, interiors, traditions, Indigenous Sámi material, photography, and the monumental Great Hall itself.",
    officialUrl: "https://www.nordiskamuseet.se/en/visit-us/opening-hours/",
    imageSourceUrl:
      "https://www.nordiskamuseet.se/wp-content/uploads/2023/12/nordiska-museet-besokare-audioguide-2.webp",
    hours: {
      default:
        "June-August daily 10:00 AM-5:00 PM; September-May daily 10:00 AM-5:00 PM, Wednesday until 8:00 PM.",
    },
    venueKind: "culture",
    subcategory: "cultural_history_museum",
    attributeTags: ["nordic_culture", "design", "family_friendly", "rainy_day"],
    editorialUrls: [
      "https://www.nordiskamuseet.se/en/exhibitions/discover-the-building/",
    ],
  }),
  stop({
    id: "stockholm-culture-hallwyl",
    name: "Hallwyl Museum",
    coordinates: [59.3332518, 18.0743998],
    description:
      "Countess Wilhelmina von Hallwyl documented nearly every object in this lavishly preserved 1898 home, turning armor, art, plumbing, kitchens, servants' spaces, and collecting habits into one unusually complete social record.",
    officialUrl: "https://hallwylskamuseet.se/en/visit-us/opening-hours/",
    imageSourceUrl:
      "https://hallwylskamuseet.se/wp-content/uploads/2021/12/HWY_DIG39929-scaled.jpg",
    hours: {
      mon: "Closed",
      tue: "12:00 PM-4:00 PM",
      wed: "12:00 PM-7:00 PM",
      thu: "12:00 PM-4:00 PM",
      fri: "12:00 PM-4:00 PM",
      sat: "11:00 AM-5:00 PM",
      sun: "11:00 AM-5:00 PM",
    },
    venueKind: "culture",
    subcategory: "historic_house_museum",
    attributeTags: [
      "historic_interiors",
      "decorative_arts",
      "central",
      "rainy_day",
    ],
  }),
  stop({
    id: "stockholm-culture-historiska",
    name: "Swedish History Museum",
    coordinates: [59.3348166, 18.0894885],
    description:
      "Historiska traces Sweden from prehistory through the medieval period with Viking objects, church art, the Gold Room, archaeological context, and enough interpretive depth to outgrow the usual treasure-display format.",
    officialUrl: "https://historiska.se/en/visit/opening-hours/",
    imageSourceUrl:
      "https://historiska.se/wp-content/uploads/2025/06/Historiska-museet_besokare-information_675x580.webp",
    hours: {
      default:
        "June-August daily 10:00 AM-5:00 PM; September-December Monday closed, Tuesday 11:00 AM-5:00 PM, Wednesday 11:00 AM-8:00 PM, Thursday-Sunday 11:00 AM-5:00 PM.",
    },
    venueKind: "culture",
    subcategory: "history_museum",
    attributeTags: [
      "viking_history",
      "archaeology",
      "family_friendly",
      "rainy_day",
    ],
  }),
];

const activityStops: GuideStop[] = [
  stop({
    id: "stockholm-activity-city-hall",
    name: "Stockholm City Hall Guided Tour",
    coordinates: [59.3274556, 18.0543454],
    description:
      "A guided visit is the only way inside Ragnar Östberg's City Hall, connecting the Nobel banquet's Blue Hall, the mosaic-lined Golden Hall, civic chambers, and architectural compromises.",
    officialUrl:
      "https://stadshuset.stockholm/en/visit-stockholm-city-hall/guided-tours/",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Stockholms_stadshus_February_2026_02.jpg",
    bookingUrl:
      "https://stadshuset.stockholm/en/visit-stockholm-city-hall/guided-tours/",
    timetableUrl:
      "https://stadshuset.stockholm/en/visit-stockholm-city-hall/guided-tours/",
    hours: {
      default:
        "Entry only on a scheduled guided tour; current languages and exact departure times are published in the official calendar, with tickets released about one week ahead.",
    },
    venueKind: "landmark",
    subcategory: "guided_architecture_tour",
    attributeTags: [
      "architecture",
      "guided_tour",
      "nobel_history",
      "reservation_recommended",
    ],
  }),
  stop({
    id: "stockholm-activity-abba",
    name: "ABBA The Museum",
    coordinates: [59.3249254, 18.0965825],
    description:
      "Original costumes, studio equipment, interviews, and interactive singing and mixing stations turn ABBA's career into an energetic participatory visit rather than a sequence of glass cases.",
    officialUrl: "https://abbathemuseum.com/en/prices-opening-hours",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Abba_the_Museum_2019.jpg",
    bookingUrl: "https://abbathemuseum.com/en/prices-opening-hours",
    hours: {
      default:
        "August 17-31 daily 10:00 AM-8:00 PM; September-December 23 daily 10:00 AM-6:00 PM; exact holiday changes are dated on the official 2026 calendar.",
    },
    venueKind: "culture",
    subcategory: "music_museum",
    attributeTags: ["music", "interactive", "family_friendly", "rainy_day"],
  }),
  stop({
    id: "stockholm-activity-grona-lund",
    name: "Gröna Lund",
    coordinates: [59.3233062, 18.0958344],
    description:
      "Stockholm's compact waterfront amusement park layers roller coasters, historic rides, games, restaurants, and major summer concerts into a remarkably small Djurgården footprint with admission rules that change by event.",
    officialUrl: "https://www.gronalund.com/en",
    bookingUrl: "https://www.gronalund.com/en/tickets",
    timetableUrl: "https://www.gronalund.com/en/calendar",
    hours: {
      default:
        "Open on published 2026 park dates; exact opening and closing times, concert nights, and admission conditions are listed for each date in the official calendar.",
    },
    venueKind: "outdoors",
    subcategory: "amusement_park",
    attributeTags: ["rides", "family_friendly", "live_music", "seasonal"],
  }),
  stop({
    id: "stockholm-activity-stromma",
    name: "Strömma Guided Archipelago Tour",
    coordinates: [59.3322, 18.0816],
    description:
      "A live guide and classic passenger boat make Strömma's central-departure cruise the straightforward introduction to skerries, summer houses, channels, and island history without planning independent ferries.",
    officialUrl:
      "https://www.stromma.com/en-se/stockholm/sightseeing/sightseeing-by-boat/archipelago-tour-with-guide/",
    bookingUrl:
      "https://www.stromma.com/en-se/stockholm/sightseeing/sightseeing-by-boat/archipelago-tour-with-guide/",
    imageSourceUrl:
      "https://www.stromma.com/globalassets/sweden/stockholm/product_slideshows/sightseeing/boat/archipelago-tour-with-guide/summer/stockholm-archipelago-tour-with-guide-01.jpg",
    timetableUrl:
      "https://www.stromma.com/en-se/stockholm/sightseeing/sightseeing-by-boat/archipelago-tour-with-guide/",
    hours: {
      default:
        "August 17-31: 1.5-hour tours daily at 10:00 AM, noon, 2:30 PM, and 4:30 PM, with Thursday-Sunday extras; 2.5-hour tours daily at 10:30 AM and 2:00 PM; 3-hour tours daily at noon and 3:00 PM through September 13. Selected departure governs the schedule.",
    },
    venueKind: "transport",
    subcategory: "guided_boat_tour",
    attributeTags: [
      "archipelago",
      "guided_tour",
      "waterfront",
      "reservation_recommended",
    ],
  }),
  stop({
    id: "stockholm-activity-vaxholm",
    name: "Vaxholm by Waxholmsbolaget Ferry",
    coordinates: [59.3286835, 18.076587],
    description:
      "The public archipelago ferry turns Vaxholm into a self-directed day trip with deck views and local commuters, while leaving travelers responsible for matching outbound and return sailings.",
    officialUrl:
      "https://waxholmsbolaget.se/in-english/plan-a-journey/where-to-start",
    imageSourceUrl:
      "https://images.ctfassets.net/4l7cjdaypzcu/62In6arnASzNmjuR0vx85w/88f672318c8a9b233c6aa3a919f81765/og_image_waxholm.jpg?w=1200&h=630&f=center",
    timetableUrl: "https://waxholmsbolaget.se/reseplanering",
    hours: {
      default:
        "Sailings operate on dated seasonal timetables; exact Strömkajen-Vaxholm departure, vessel, and return times must be selected in the official Waxholmsbolaget journey planner.",
    },
    venueKind: "transport",
    subcategory: "independent_ferry_trip",
    attributeTags: ["archipelago", "day_trip", "public_transport", "scenic"],
  }),
  stop({
    id: "stockholm-activity-hellasgarden",
    name: "Hellasgården Sauna and Lake Swim",
    coordinates: [59.2892759, 18.160774],
    description:
      "A wood-fired lakeside sauna and year-round Källtorpssjön swim make Hellasgården Stockholm's most accessible nature reset; timed, gendered, mixed, and summer schedules require deliberate booking.",
    officialUrl: "https://hellasgarden.se/en/aktiviteter/bastu/",
    imageSourceUrl:
      "https://hellasgarden.se/wp-content/uploads/2022/09/lugn-afton-bastu-manga-lyktor.jpg",
    bookingUrl: "https://hellasgarden.se/en/aktiviteter/bastu/",
    hours: {
      default:
        "Regular sauna slots run weekdays 8:45 AM-8:45 PM and weekends 9:15 AM-5:45 PM in 90-minute sessions; June 22-August 16 uses an evening-only summer schedule. Book the exact mixed or gender-specific slot on the official page.",
    },
    venueKind: "outdoors",
    subcategory: "sauna_and_swimming",
    attributeTags: [
      "sauna",
      "lake_swimming",
      "outdoors",
      "reservation_required",
    ],
  }),
  stop({
    id: "stockholm-activity-kayak",
    name: "Stockholm Adventures City Kayak Tour",
    coordinates: [59.3337709, 18.047306],
    description:
      "A guide leads paddlers around Kungsholmen's canals and shoreline, supplying equipment and city context; traffic, wind, and weather make this more rewarding with an experienced operator than alone.",
    officialUrl:
      "https://www.stockholmadventures.com/kayaking/city-kayak-tour/",
    imageSourceUrl:
      "https://www.stockholmadventures.com/wp-content/uploads/sites/3906/2020/03/2018-06-15-at-09-57-35-Version-2-copy.jpg",
    bookingUrl: "https://www.stockholmadventures.com/kayaking/city-kayak-tour/",
    hours: {
      default:
        "During the published paddling season, daily tours depart at 10:30 AM, 1:30 PM, or 4:00 PM when listed; check in 15 minutes early. Unsafe weather can cancel a tour.",
    },
    venueKind: "outdoors",
    subcategory: "guided_kayak_tour",
    attributeTags: ["kayaking", "guided_tour", "active", "weather_dependent"],
  }),
  stop({
    id: "stockholm-activity-monteliusvagen",
    name: "Monteliusvägen",
    coordinates: [59.3207312, 18.0604556],
    description:
      "This narrow cliffside path delivers the classic sightline across Riddarfjärden to City Hall and Gamla Stan, with benches and sunrise light but potentially slippery winter paving.",
    officialUrl: "https://www.visitstockholm.com/o/monteliusvagen/",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Monteliusv%C3%A4gen_2015.jpg",
    hours: {
      default:
        "Public pedestrian path open 24 hours daily; use extra caution during snow and ice.",
    },
    venueKind: "outdoors",
    subcategory: "scenic_walk",
    attributeTags: ["viewpoint", "free", "sunrise", "walking"],
  }),
  stop({
    id: "stockholm-activity-skansen",
    name: "Skansen",
    coordinates: [59.3266228, 18.1052823],
    description:
      "Treat Skansen as a half-day outdoor activity: historic farms and workshops, Nordic animals, children's areas, seasonal festivals, and hilltop walking demand more time than a conventional museum.",
    officialUrl:
      "https://www.skansen.se/en/plan-your-visit/opening-hours-and-prices/",
    imageSourceUrl:
      "https://www.skansen.se/wp-content/uploads/2026/02/Hos-faren-pa-Lill-Skansen.jpg",
    bookingUrl:
      "https://www.skansen.se/en/plan-your-visit/opening-hours-and-prices/",
    hours: {
      default:
        "June 1-August 30 daily 10:00 AM-6:00 PM; August 31-September 27 daily 10:00 AM-5:00 PM; late September-January generally weekdays 10:00 AM-3:00 PM and weekends 10:00 AM-4:00 PM, with exact holiday hours in the official calendar.",
    },
    venueKind: "culture",
    subcategory: "open_air_museum_day",
    attributeTags: ["history", "family_friendly", "animals", "outdoors"],
  }),
  stop({
    id: "stockholm-activity-vasa",
    name: "Vasa Museum",
    coordinates: [59.3280594, 18.0913656],
    description:
      "Circling the full-scale Vasa across multiple gallery levels reveals rigging, carved symbolism, forensic crew stories, and the conservation engineering required to keep a seventeenth-century ship intact.",
    officialUrl: "https://www.vasamuseet.se/en/visit/hours--admission",
    imageSourceUrl:
      "https://www.vasamuseet.se/globalassets/vasamuseet/pressgenrebilder/press-images-eng/the-ship/vasa-01-2020.jpg",
    bookingUrl: "https://www.vasamuseet.se/en/visit/hours--admission",
    hours: {
      default:
        "June-August daily 8:30 AM-6:00 PM; September-May daily 10:00 AM-5:00 PM, Wednesday until 8:00 PM.",
    },
    venueKind: "culture",
    subcategory: "maritime_museum_visit",
    attributeTags: ["maritime", "history", "family_friendly", "rainy_day"],
    editorialUrls: [
      "https://www.vasamuseet.se/en/about-the-vasa-museum/press/press-images",
    ],
  }),
];

function completeSources(
  label: string,
  overviewUrls: ListSource[],
  stops: GuideStop[],
): ListSource[] {
  return [
    ...overviewUrls,
    ...stops.map((item) =>
      source(`${item.name} official or property source`, item.officialUrl!),
    ),
  ];
}

const guideSources = {
  dining: completeSources(
    "Stockholm dining",
    [
      source(
        "Visit Stockholm restaurant overview",
        "https://www.visitstockholm.com/eat-drink/restaurants/",
      ),
      source(
        "Visit Stockholm Michelin restaurant guide",
        "https://www.visitstockholm.com/eat-drink/restaurants/michelin-star-restaurants/",
      ),
      source(
        "MICHELIN Guide Stockholm restaurants",
        "https://guide.michelin.com/en/stockholms-region/stockholm/restaurants",
      ),
      source(
        "Visit Sweden food and drink overview",
        "https://visitsweden.com/what-to-do/food-drink/",
      ),
    ],
    diningStops,
  ),
  cheapEats: completeSources(
    "Stockholm affordable food",
    [
      source(
        "Visit Stockholm restaurant overview",
        "https://www.visitstockholm.com/eat-drink/restaurants/",
      ),
      source(
        "Visit Stockholm café overview",
        "https://www.visitstockholm.com/eat-drink/cafes/",
      ),
      source(
        "Visit Stockholm food-hall guide",
        "https://www.visitstockholm.com/eat-drink/restaurants/food-halls-in-stockholm/",
      ),
      source(
        "Visit Sweden fika guide",
        "https://visitsweden.com/what-to-do/food-drink/swedish-kitchen/all-about-swedish-fika/",
      ),
    ],
    cheapEatStops,
  ),
  hotels: completeSources(
    "Stockholm hotels",
    [
      source(
        "Visit Stockholm accommodation overview",
        "https://www.visitstockholm.com/stay/",
      ),
      source(
        "Condé Nast Traveller best Stockholm hotels",
        "https://www.cntraveller.com/gallery/best-hotels-in-stockholm",
      ),
      source(
        "MICHELIN Guide Stockholm hotels",
        "https://guide.michelin.com/en/hotels-stays/stockholm",
      ),
      source(
        "Booking.com Stockholm properties",
        "https://www.booking.com/city/se/stockholm.html",
      ),
    ],
    hotelStops,
  ),
  hostels: completeSources(
    "Stockholm hostels",
    [
      source(
        "Hostelworld Stockholm inventory",
        "https://www.hostelworld.com/hostels/europe/sweden/stockholm/",
      ),
      source(
        "Booking.com Stockholm hostels",
        "https://www.booking.com/hostels/city/se/stockholm.html",
      ),
      source(
        "Visit Stockholm accommodation overview",
        "https://www.visitstockholm.com/stay/",
      ),
      source(
        "STF Stockholm accommodation",
        "https://www.swedishtouristassociation.com/discover-sweden/regions/stockholm/",
      ),
    ],
    hostelStops,
  ),
  bars: completeSources(
    "Stockholm casual nightlife",
    [
      source(
        "Visit Stockholm bars and nightlife",
        "https://www.visitstockholm.com/eat-drink/bars-nightlife/",
      ),
      source(
        "Visit Stockholm live music guide",
        "https://www.visitstockholm.com/eat-drink/nightlife/live-music-in-stockholm/",
      ),
      source(
        "Time Out Stockholm bars and pubs",
        "https://www.timeout.com/stockholm/bars-and-pubs/best-bars-in-stockholm",
      ),
      source(
        "Visit Sweden Stockholm nightlife overview",
        "https://visitsweden.com/where-to-go/middle-sweden/stockholm/stockholm-nightlife/",
      ),
    ],
    casualBarStops,
  ),
  cocktails: completeSources(
    "Stockholm cocktail bars",
    [
      source(
        "Visit Stockholm cocktail-bar guide",
        "https://www.visitstockholm.com/eat-drink/bars-nightlife/cocktail-bars/",
      ),
      source(
        "Bartenders' Choice Awards",
        "https://bartenderschoiceawards.com/",
      ),
      source(
        "The World's 50 Best Bars",
        "https://www.worlds50bestbars.com/list/1-50",
      ),
      source(
        "Visit Stockholm bars and nightlife",
        "https://www.visitstockholm.com/eat-drink/bars-nightlife/",
      ),
    ],
    cocktailStops,
  ),
  culture: completeSources(
    "Stockholm culture",
    [
      source(
        "Visit Stockholm museums",
        "https://www.visitstockholm.com/see-do/attractions/museums/",
      ),
      source(
        "Visit Stockholm attractions",
        "https://www.visitstockholm.com/see-do/attractions/",
      ),
      source(
        "Swedish National Heritage Board museums overview",
        "https://www.raa.se/in-english/",
      ),
      source(
        "Time Out Stockholm attractions",
        "https://www.timeout.com/stockholm/things-to-do/best-things-to-do-in-stockholm",
      ),
    ],
    cultureStops,
  ),
  activities: completeSources(
    "Stockholm activities",
    [
      source(
        "Visit Stockholm attractions",
        "https://www.visitstockholm.com/see-do/attractions/",
      ),
      source(
        "Visit Stockholm archipelago guide",
        "https://www.visitstockholm.com/see-do/excursions/discover-the-stockholm-archipelago/",
      ),
      source(
        "Visit Sweden Stockholm guide",
        "https://visitsweden.com/where-to-go/middle-sweden/stockholm/",
      ),
      source(
        "Time Out Stockholm things to do",
        "https://www.timeout.com/stockholm/things-to-do/best-things-to-do-in-stockholm",
      ),
    ],
    activityStops,
  ),
};

function guide(
  category: ListCategory,
  id: string,
  slug: string,
  seoSlug: string,
  title: string,
  description: string,
  stops: GuideStop[],
  sources: ListSource[],
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
    photo: stops[0]?.photo,
    url: maps(`${title} Stockholm Sweden`),
    category,
    location,
    creator: {
      id: `user-rguide-${category.toLowerCase()}`,
      name: `R ${category}`,
      avatar: avatar(category),
    },
    upvotes: 0,
    createdAt,
    stops,
    sources,
  };
}

export const stockholmCitywideGuides: MapList[] = [
  guide(
    "Food",
    "list-stockholm-citywide-dining",
    "stockholm-best-restaurants-citywide",
    "best-restaurants",
    "Restaurants That Make Stockholm Worth Tasting",
    "Stockholm's strongest restaurants connect ambitious Nordic tasting menus, Japanese precision, live-fire cooking, natural wine, historic beer halls, and seafood institutions. These ten choices explain both the city's modern confidence and its durable appetites.",
    diningStops,
    guideSources.dining,
    "Best Restaurants in Stockholm for Nordic, Seafood, and Fine Dining",
    "Ten source-backed Stockholm restaurants, from Frantzén, AIRA, Ekstedt, and Sushi Sho to Lilla Ego, Babette, Pelikan, and Sturehof.",
  ),
  guide(
    "Food",
    "list-stockholm-medium-cheap-eats",
    "stockholm-best-cheap-eats-medium-budget",
    "best-cheap-eats",
    "Tacos, Fish Soup, Falafel, Fika, and Pizza",
    "Affordable Stockholm is more convincing when it moves beyond one cuisine: sausage kiosks, Mexican tacos, market-hall fish soup, Turkish grills, falafel, organic Nordic bowls, landmark fika, and excellent pizza all fit here.",
    cheapEatStops,
    guideSources.cheapEats,
    "Best Cheap Eats in Stockholm for Tacos, Fika, Falafel, and Pizza",
    "Ten source-backed Stockholm cheap and medium-price meals, including Günter's, La Neta, Kajsas Fisk, Falafelbaren, Vete-Katten, Lillebrors, and 800 Grader.",
  ),
  guide(
    "Stay",
    "list-stockholm-citywide-hotels",
    "stockholm-best-hotels-citywide",
    "best-hotels",
    "Hotels for Waterfront Grandeur, Design, and Quiet",
    "Stockholm's best hotels range from palace-facing grand luxury to townhouse intimacy, art-led central bases, island calm, and sensitive historic conversions. Each property earns its premium through location, service, architecture, or a genuinely useful amenity.",
    hotelStops,
    guideSources.hotels,
    "Best Hotels in Stockholm for Luxury, Design, and Waterfront Stays",
    "Hotel-only Stockholm guide with direct property links for Grand Hôtel, Ett Hem, Bank Hotel, Villa Dagmar, Hotel Diplomat, At Six, Nobis, Lydmar, Skeppsholmen, and Stadshotell.",
  ),
  guide(
    "Stay",
    "list-stockholm-citywide-hostels",
    "stockholm-best-hostels-citywide",
    "best-hostels",
    "Hostels for Ships, Islands, Social Rooms, and Sleep",
    "Stockholm's hostels include converted prison cells, historic ships, quiet Old Town houses, highly social backpacker rooms, and efficient central dorms. This hostel-only list states the atmosphere and practical tradeoff behind every low-cost bed.",
    hostelStops,
    guideSources.hostels,
    "Best Hostels in Stockholm for Budget Beds, Boats, and Social Stays",
    "Hostel-only Stockholm guide with direct property links for Långholmen, Rygerfjord, STF Skeppsholmen, Castanea, City Backpackers, Red Boat, Crafoord, Dockside, City Hostel, and Generator.",
  ),
  guide(
    "Nightlife",
    "list-stockholm-pubs-casual-bars",
    "stockholm-best-pubs-casual-bars",
    "best-pubs-and-casual-bars",
    "Beer Halls, Taprooms, Live Music, and Local Pubs",
    "Stockholm's casual night works through exceptional beer cellars, historic halls, Czech and British pubs, natural wine, compact taprooms, and close-range jazz. These are places where the room and regulars matter as much as the drinks list.",
    casualBarStops,
    guideSources.bars,
    "Best Pubs and Casual Bars in Stockholm for Beer and Live Music",
    "Ten source-backed Stockholm pubs and casual bars, including Akkurat, Zum Franziskaner, Oliver Twist, Kvarnen, Tudor Arms, Stampen, Savant, Omnipollo, and Stigbergets Fot.",
  ),
  guide(
    "Nightlife",
    "list-stockholm-cocktail-bars",
    "stockholm-best-cocktail-bars",
    "best-cocktail-bars",
    "Cocktail Bars with Swedish Ingredients and Global Technique",
    "Stockholm's cocktail scene moves from Scandinavian pantry flavors and formal hotel classics to basement intimacy, rooftops, gin tastings, and playful neighborhood rooms. Every selection has a distinct idea beyond simply serving expensive mixed drinks.",
    cocktailStops,
    guideSources.cocktails,
    "Best Cocktail Bars in Stockholm for Creative Drinks and Classic Service",
    "A source-backed Stockholm cocktail guide covering Röda Huset, Tjoget, Le Hibou, Lucy's, Gemma, Pharmarium, Hernö Gin Bar, Stjärtilleriet, Cadierbaren, and Afterglow.",
  ),
  guide(
    "Culture",
    "list-stockholm-citywide-culture",
    "stockholm-best-museums-cultural-sites-citywide",
    "best-museums-and-cultural-sites",
    "Ships, Art, Royal History, Photography, and Nordic Life",
    "Stockholm's cultural range becomes clear through a preserved warship, national art and design, contemporary work, photography, royal rooms, open-air history, Nobel stories, and deeply documented domestic life. These ten institutions reward more than a photo stop.",
    cultureStops,
    guideSources.culture,
    "Best Museums and Cultural Sites in Stockholm",
    "Ten source-backed Stockholm cultural stops covering Vasa, Nationalmuseum, Moderna, Fotografiska, Skansen, the Nobel Prize Museum, Royal Palace, Nordiska, Hallwyl, and Historiska.",
  ),
  guide(
    "Activities",
    "list-stockholm-top-things-to-do",
    "stockholm-top-things-to-do",
    "best-things-to-do",
    "Ten Experiences That Make Stockholm Legible",
    "Stockholm is best understood through water, islands, civic architecture, outdoor traditions, and participatory museums. These ten experiences combine guided and independent choices, with seasonal schedules stated clearly enough to build an actual day around them.",
    activityStops,
    guideSources.activities,
    "Top Things to Do in Stockholm With 10 Source-Backed Stops",
    "Ten practical Stockholm things to do, from City Hall, ABBA, Gröna Lund, archipelago boats, and kayaking to Hellasgården, Monteliusvägen, Skansen, and Vasa.",
  ),
];
