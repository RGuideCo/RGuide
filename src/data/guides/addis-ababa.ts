import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

const createdAt = "2026-08-26T00:00:00.000Z";
const checkedAt = "2026-08-26";
const location = {
  city: "Addis Ababa",
  country: "Ethiopia",
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
  return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="160" height="160" rx="80" fill="#${colors[category]}"/><text x="80" y="92" text-anchor="middle" font-family="Arial" font-size="76" font-weight="700" fill="white">R</text></svg>`)}`;
}
function maps(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
function commons(file: string) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1400`;
}

type Seed = Partial<GuideStop> & {
  name: string;
  coordinates: [number, number];
  description: string;
  hours: NonNullable<GuideStop["hours"]>;
  officialUrl: string;
  image: string;
  imagePage?: string;
  editorialUrls?: string[];
};

const tourism = "https://visitethiopia.et/space/addis-ababa";
const restaurantEditorial =
  "https://selamta.ethiopianairlines.com/destination/a-super-quick-guide-to-addis-ababa/";
const foodEditorial =
  "https://www.thenonmad.com/2026/06/24/addis-ababa-ethiopia-coffee-jazz-food-guide/";
const hotelEditorial = "https://www.booking.com/city/et/addis-ababa.html";
const budgetEditorial =
  "https://www.booking.com/guest-house/city/et/addis-ababa.html";
const hostelEditorial =
  "https://www.hostelworld.com/hostels/africa/ethiopia/addis-ababa/";
const nightlifeEditorial = foodEditorial;
const cultureEditorial =
  "https://discoveraddis.gov.et/English_pages/destinations.php";

const venueSeeds = {
  yod: {
    name: "Yod Abyssinia",
    coordinates: [8.991249, 38.793496],
    description:
      "Yod serves regional Ethiopian platters, tej, and coffee around a nightly stage of music and shoulder-shaking dance. The large hall is unabashedly theatrical, but the regional repertoire and kitchen make it more than a tourist show.",
    hours: {
      default:
        "Daily 6:00 AM-11:00 PM; performance times follow the official nightly show calendar.",
    },
    officialUrl:
      "https://www.tripadvisor.com/Restaurant_Review-g293791-d1477419-Reviews-Yod_Abyssinia_Traditional_Food-Addis_Ababa.html",
    image:
      "https://cdn.sanity.io/images/rizm0do5/production/4b769f1bc9cfec4ca613fab4cd78807c2e8c64d7-4032x3024.jpg",
    imagePage: "https://trippin.world/spot/yod-abyssinia",
    editorialUrls: [restaurantEditorial],
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["Ethiopian", "regional Ethiopian"],
    price: "$$",
    priceSource: "Current property and restaurant listings",
    attributeTags: [
      "live_music",
      "cultural_show",
      "group_friendly",
      "traditional",
    ],
  },
  kategna: {
    name: "Kategna Café & Restaurant — Bole",
    coordinates: [8.981677, 38.792598],
    description:
      "Kategna presents Ethiopian staples with unusual precision: crisp kategna, generous fasting platters, tibs, kitfo, and properly handled coffee. The polished Bole room suits travelers who want regional range without sacrificing reliable service.",
    hours: { default: "Daily 7:00 AM-10:30 PM." },
    officialUrl: "https://addissinia.com/dine/",
    image:
      "https://cdn.enprimeurclub.com/storage/v1/object/public/images/restaurants/c80f6647-9042-42f9-b5e5-05565966cfe2/hero1.jpg?aspect_ratio=1.91%3A1&crop_gravity=center&quality=85&width=1200",
    imagePage:
      "https://www.enprimeurclub.com/restaurants/kategna-addis-ababa-restaurant",
    editorialUrls: [foodEditorial],
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["Ethiopian", "vegetarian-friendly"],
    price: "$$",
    priceSource: "Current menu and restaurant listings",
    attributeTags: [
      "traditional",
      "vegetarian_friendly",
      "group_friendly",
      "breakfast",
    ],
  },
  habesha2000: {
    name: "2000 Habesha Cultural Restaurant",
    coordinates: [9.001372, 38.781472],
    description:
      "2000 Habesha lays Ethiopian stews, tibs, and fasting dishes over broad rounds of injera while musicians and dancers rotate through regional traditions. Its scale favors groups, yet the long-running kitchen keeps the food central.",
    hours: {
      default:
        "Daily 9:00 AM-midnight; cultural performances follow the official evening program.",
    },
    officialUrl: "https://2000habesha.net/",
    image:
      "https://2000habesha.net/wp-content/uploads/2025/06/Cultural-Dining-Experience.jpg",
    editorialUrls: [restaurantEditorial],
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["Ethiopian", "regional Ethiopian"],
    price: "$$",
    priceSource: "Official property page and current listings",
    attributeTags: [
      "live_music",
      "cultural_show",
      "group_friendly",
      "traditional",
    ],
  },
  marcus: {
    name: "Marcus Addis",
    coordinates: [9.0096, 38.7527],
    description:
      "Marcus Samuelsson's 47th-floor dining room folds Ethiopian ingredients into food from across Africa and beyond, with contemporary art, DJs, and commanding city views. Reserve near sunset; the elevation is part of the bill.",
    hours: {
      default:
        "Mon-Wed 11:00 AM-11:00 PM; Thu-Sat 11:00 AM-2:00 AM; Sun brunch 11:00 AM-4:00 PM and dinner 7:00 PM-11:00 PM.",
    },
    officialUrl:
      "https://www.marcusaddis.com/location/hyatt-ethiopia-marcus-addis/",
    bookingUrl: "https://www.marcusaddis.com/reservations/",
    image:
      "https://d3fphkxyf5o5bm.cloudfront.net/image-resize/format%3Dwebp%2Cw%3D720/Q524tReNnAnmuqp47frjRMOVOJCNRZZE6tbnyEpuLk",
    imagePage:
      "https://mindtrip.ai/restaurant/addis-ababa-ethiopia/marcus-addis-restaurant-sky-bar/re-QZZTv7wZ",
    editorialUrls: [foodEditorial],
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["Pan-African", "Ethiopian-inspired", "international"],
    price: "$$$$",
    priceSource: "Official menus and reservation page",
    attributeTags: [
      "scenic_food",
      "rooftop",
      "date_night",
      "reservation_recommended",
    ],
  },
  hotto: {
    name: "Hotto",
    coordinates: [9.0032, 38.7833],
    description:
      "Hotto centers Japanese technique in a calm Bole room, moving from sushi and robata-style plates to cocktails without diluting the menu into generic hotel Asian food. The split weekday service rewards a deliberate reservation.",
    hours: {
      default:
        "Mon-Fri lunch noon-4:00 PM and dinner 5:30 PM-11:00 PM; Sat-Sun noon-11:00 PM.",
    },
    officialUrl: "https://www.hottoaddis.com/about/",
    bookingUrl: "https://www.hottoaddis.com/reservations/",
    image:
      "https://www.hottoaddis.com/wp-content/uploads/2023/01/Clear-About-e1674174858338.jpeg",
    editorialUrls: [foodEditorial],
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["Japanese", "sushi", "Asian"],
    price: "$$$",
    priceSource: "Official menu and reservation page",
    attributeTags: [
      "date_night",
      "cocktails",
      "reservation_recommended",
      "design",
    ],
  },
  sishu: {
    name: "Sishu Kera",
    coordinates: [8.987318, 38.744699],
    description:
      "Sishu's burgers arrive on house-baked buns with crisp fries, alongside sandwiches and bakery work in a leafy converted warehouse. The spacious Kera setting feels casual, but the kitchen's control explains its enduring local following.",
    hours: { default: "Tue-Sun 8:00 AM-midnight; closed Mon." },
    officialUrl: "https://map.et/n2304583464/sishu",
    image:
      "https://static.where-e.com/Ethiopia/Addis_Ababa/Nefassilk_Lafto/Sishu-Kera_5a0264b857bca737a0634dbdb6d391ca.jpg",
    imagePage: "https://sishu-kera.wheree.com/",
    editorialUrls: [foodEditorial],
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["Burgers", "bakery", "international"],
    price: "$$",
    priceSource: "Current restaurant and map listings",
    attributeTags: ["local_favorite", "casual", "group_friendly", "bakery"],
  },
  fiveLoaves: {
    name: "Five Loaves Bistro and Bakery",
    coordinates: [9.023226, 38.777615],
    description:
      "Five Loaves combines serious bread and pastry work with composed breakfasts, salads, steaks, and desserts in a quiet residential pocket. It is polished without becoming stiff, and especially useful for breakfast or an unhurried lunch.",
    hours: { default: "Daily 7:30 AM-9:30 PM." },
    officialUrl:
      "https://restaurantguru.com/Five-Loaves-Bistro-and-Bakery-Addis-Ababa",
    image: "https://ak-d.tripcdn.com/images/1tx6112000rmhwqi1F3E5.jpg",
    imagePage:
      "https://in.trip.com/restaurant/ethiopia/addis-ababa/detail/five-loaves-bistro-and-bakery-34893376/",
    editorialUrls: [foodEditorial],
    venueKind: "food_drink",
    foodServiceType: "bakery",
    cuisineTypes: ["Bakery", "European", "breakfast"],
    price: "$$",
    priceSource: "Current menu and restaurant listings",
    attributeTags: ["bakery", "breakfast", "quiet", "date_night"],
  },
  mandoline: {
    name: "La Mandoline",
    coordinates: [9.010794, 38.78201],
    description:
      "La Mandoline has kept a loyal Addis audience with French bistro cooking: pâté, onion soup, steak, fish, and careful desserts in a warm, plant-filled room. The intimacy calls for a reservation at peak dinner hours.",
    hours: { default: "Daily 7:00 AM-9:00 PM." },
    officialUrl:
      "https://www.tripadvisor.com/Restaurant_Review-g293791-d2260243-Reviews-La_Mandoline-Addis_Ababa.html",
    image:
      "https://itin-dev.wanderlogstatic.com/freeImage/Ev1zZDaAEIGrYXZgRl8G8kVt6vSPN6gz",
    imagePage:
      "https://wanderlog.com/place/details/1162000/la-mandoline-french-restaurant",
    editorialUrls: [foodEditorial],
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["French", "European", "bistro"],
    price: "$$$",
    priceSource: "Current restaurant listings",
    attributeTags: [
      "date_night",
      "reservation_recommended",
      "quiet",
      "classic",
    ],
  },
  castelli: {
    name: "Ristorante Castelli",
    coordinates: [9.031883, 38.75275],
    description:
      "Castelli has served Piassa since 1957, preserving a formal Italian dining room, imported wine culture, handmade pasta, and restrained service through decades of city change. Go for continuity and history, not contemporary reinvention.",
    hours: {
      default:
        "Mon-Sat lunch 12:30 PM-2:30 PM and dinner 7:00 PM-10:30 PM; closed Sun.",
    },
    officialUrl: "https://map.et/n923943171/castelli",
    image:
      "https://www.impressionidiviaggio.com/wp-content/uploads/2019/11/P1120564.jpg",
    imagePage:
      "https://www.impressionidiviaggio.com/addis-abeba-il-ristorante-castelli-mette-nel-piatto-leccellenza-culinaria-italiana/",
    editorialUrls: [foodEditorial],
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["Italian", "pasta", "classic European"],
    price: "$$$",
    priceSource: "Current map and restaurant listings",
    attributeTags: ["historic", "classic", "reservation_recommended", "wine"],
  },
  union: {
    name: "Union Cocktail Bar & Restaurant",
    coordinates: [9.009355, 38.762279],
    description:
      "Union spreads contemporary international cooking and cocktails across a glass-walled dining room and one of central Addis's most inviting tree-shaded terraces. The garden softens the city, while breakfast-to-midnight hours make it unusually flexible.",
    hours: { default: "Daily 8:00 AM-midnight." },
    officialUrl:
      "https://restaurantguru.com/Union-Restaurant-and-Cocktail-Bar-Addis-Ababa",
    image:
      "https://i0.wp.com/www.ethiopiaobserver.com/wp-content/uploads/2026/05/Union-2.jpg?resize=960%2C450&ssl=1",
    imagePage:
      "https://www.ethiopiaobserver.com/2026/05/02/addis-restaurant-offering-food-and-a-view/",
    editorialUrls: [foodEditorial],
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["International", "Ethiopian", "cocktail bar"],
    price: "$$$",
    priceSource: "Current restaurant and map listings",
    attributeTags: ["garden", "cocktails", "date_night", "breakfast"],
  },
  tomoca: {
    name: "Tomoca Coffee — Piazza",
    coordinates: [9.030898, 38.750832],
    description:
      "Tomoca's original Piazza counter turns dark-roasted Ethiopian beans into short macchiatos with speed and ceremony. There is little reason to linger over a large meal; come for coffee history, standing-room rhythm, and beans to take home.",
    hours: { default: "Daily 7:00 AM-9:00 PM." },
    officialUrl: "https://tomocacoffee.et/",
    image:
      "https://www.tomocacoffeeafrica.com/wp-content/uploads/2023/10/tomoca-about-02.jpg",
    imagePage: "https://www.tomocacoffeeafrica.com/about-us/",
    editorialUrls: [restaurantEditorial],
    venueKind: "food_drink",
    foodServiceType: "cafe",
    cuisineTypes: ["Ethiopian coffee", "pastries"],
    price: "$",
    priceSource: "Official menu and current listings",
    attributeTags: ["budget_food", "coffee", "historic", "walk_in_friendly"],
  },
  cade: {
    name: "Ca'De Burger",
    coordinates: [9.0046, 38.7679],
    description:
      "Ca'De makes substantial beef burgers, mortadella-and-egg sandwiches, and fries to order on Zimbabwe Street. The compact menu and direct prices are the point; Wednesday closure is the only planning trap.",
    hours: { default: "Mon-Tue and Thu-Sun 9:00 AM-9:00 PM; closed Wed." },
    officialUrl: "https://cadeburger.com/",
    image: "https://cadeburger.com/images/food-1.jpg",
    editorialUrls: [foodEditorial],
    venueKind: "food_drink",
    foodServiceType: "fast_casual",
    cuisineTypes: ["Burgers", "sandwiches"],
    price: "$",
    priceSource: "Official current menu",
    attributeTags: ["budget_food", "casual", "takeaway", "walk_in_friendly"],
  },
  patisserie: {
    name: "La Patisserie",
    coordinates: [9.011436, 38.762367],
    description:
      "La Patisserie is an old-school central bakery for cakes, croissants, savory pastries, coffee, and uncomplicated breakfasts. Its broad opening span and modest counter format matter more than polish when you need a quick, inexpensive pause.",
    hours: { default: "Daily 7:00 AM-9:30 PM." },
    officialUrl: "https://wanderlog.com/place/details/2621598/la-patisserie",
    image:
      "https://itin-dev.wanderlogstatic.com/freeImage/iTtf46ywOtHXURFw4LzGxuVEVPptjg9q",
    imagePage: "https://wanderlog.com/place/details/2621598/la-patisserie",
    editorialUrls: [foodEditorial],
    venueKind: "food_drink",
    foodServiceType: "bakery",
    cuisineTypes: ["Bakery", "pastries", "cafe"],
    price: "$",
    priceSource: "Current bakery listings",
    attributeTags: ["budget_food", "bakery", "breakfast", "central"],
  },
  effoi: {
    name: "Effoi Pizza — Bole",
    coordinates: [9.002438, 38.779737],
    description:
      "Effoi builds thin-crust pizzas with local toppings and an easy shared-table format, then lets the Bole branch run later on weekend nights. It is inexpensive by central Addis standards and dependable for mixed groups.",
    hours: { default: "Sun-Wed 11:00 AM-10:00 PM; Thu-Sat 11:00 AM-2:00 AM." },
    officialUrl: "https://www.effoipizza.com/",
    image:
      "https://images.squarespace-cdn.com/content/v1/5afca232ee175963c27f7afe/1549961801069-QZBV9XOD6W5Q6JDV39GB/image-asset.jpeg",
    editorialUrls: [foodEditorial],
    venueKind: "food_drink",
    foodServiceType: "fast_casual",
    cuisineTypes: ["Pizza", "Ethiopian-inspired"],
    price: "$",
    priceSource: "Official menu and delivery listings",
    attributeTags: ["budget_food", "group_friendly", "late_night", "casual"],
  },
  wanofi: {
    name: "Wanofi Coffee — Sar Bet",
    coordinates: [8.9949, 38.7418],
    description:
      "Wanofi pairs Ethiopian coffee with chechebsa, firfir, eggs, sandwiches, and cakes in a bright neighborhood cafe. The Sar Bet branch is strongest at breakfast, when local dishes remain more useful than another international pastry case.",
    hours: { default: "Daily 7:00 AM-10:00 PM." },
    officialUrl: "https://wanofi.et/",
    image: "https://wanofi.et/images/new%20wanofi/chechebsa.jpg",
    editorialUrls: [foodEditorial],
    venueKind: "food_drink",
    foodServiceType: "cafe",
    cuisineTypes: ["Ethiopian", "breakfast", "coffee"],
    price: "$",
    priceSource: "Official menu and branch page",
    attributeTags: ["budget_food", "breakfast", "coffee", "work_friendly"],
  },
  ithiopica: {
    name: "Ithiopica Coffee & Eatery",
    coordinates: [9.0112, 38.7486],
    description:
      "Ithiopica treats coffee as a traceable agricultural product while serving Ethiopian breakfasts, sandwiches, and light plates near the Vatican Embassy. The quieter room favors conversation or laptop time over a rushed espresso hit.",
    hours: { default: "Mon-Fri 7:00 AM-9:00 PM; Sat-Sun 8:00 AM-9:00 PM." },
    officialUrl: "https://ithiopica.com/location/",
    image: "https://ithiopica.com/images/food-hero.jpg",
    editorialUrls: [foodEditorial],
    venueKind: "food_drink",
    foodServiceType: "cafe",
    cuisineTypes: ["Ethiopian coffee", "breakfast", "cafe"],
    price: "$",
    priceSource: "Official menu and location page",
    attributeTags: ["budget_food", "coffee", "work_friendly", "breakfast"],
  },
  savor: {
    name: "Savor Addis",
    coordinates: [9.000194, 38.781755],
    description:
      "Savor covers breakfast through late dinner with Ethiopian plates, burgers, pasta, baked goods, and coffee in Bole Atlas. The long day and wide menu solve group logistics; specialists elsewhere do individual dishes better.",
    hours: { default: "Daily 7:00 AM-11:00 PM." },
    officialUrl: "https://savoraddis.com/",
    image: "https://savoraddis.com/images/24af78affa5bb571b3d6d58c43d2e955.jpg",
    editorialUrls: [foodEditorial],
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["Ethiopian", "international", "breakfast"],
    price: "$",
    priceSource: "Official current menu",
    attributeTags: ["budget_food", "group_friendly", "breakfast", "late_night"],
  },
  akkoo: {
    name: "Akkoo Coffee — Bole Milkomi",
    coordinates: [8.995757, 38.787172],
    description:
      "Akkoo's Bole Milkomi branch runs around the clock, pouring Ethiopian espresso drinks beside light meals and pastries. The real advantage is dependable late-night coffee near the airport corridor, not an elaborate dining program.",
    hours: { default: "Open 24 hours daily." },
    officialUrl: "https://www.akkoocoffee.com/our-locations",
    image:
      "https://static1.squarespace.com/static/5e96fc5ccb31dd25c33f3c7b/t/64a5bb19fecfa957a3c0fdf9/1688582937667/ac.png?format=1500w",
    editorialUrls: [foodEditorial],
    venueKind: "food_drink",
    foodServiceType: "cafe",
    cuisineTypes: ["Ethiopian coffee", "cafe", "pastries"],
    price: "$",
    priceSource: "Official branch and menu pages",
    attributeTags: ["budget_food", "coffee", "open_24_hours", "airport_area"],
  },
  galani: {
    name: "Galani Coffee — Jackross",
    coordinates: [9.006867, 38.817847],
    description:
      "Galani roasts Ethiopian coffee and serves it in a spacious Jackross compound with breakfast, pastries, and retail beans. It sits outside the usual visitor core, rewarding people who care about origin, processing, and a slower cafe visit.",
    hours: { default: "Tue-Sun 8:00 AM-7:00 PM; closed Mon." },
    officialUrl: "https://www.galanicoffee.com/about-us",
    image:
      "https://static.wixstatic.com/media/6b97f7_1cd6b60029ce466797fe53f574cce1f5~mv2.jpg/v1/crop/x_0,y_1851,w_5464,h_4490/fill/w_488,h_401,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/097A7024.jpg",
    editorialUrls: [foodEditorial],
    venueKind: "food_drink",
    foodServiceType: "cafe",
    cuisineTypes: ["Ethiopian coffee", "breakfast", "bakery"],
    price: "$",
    priceSource: "Official cafe and roastery pages",
    attributeTags: ["budget_food", "coffee", "roastery", "work_friendly"],
  },
  sheraton: {
    name: "Sheraton Addis, a Luxury Collection Hotel",
    coordinates: [9.020485, 38.759598],
    description:
      "Sheraton Addis is a resort-like diplomatic-quarter compound with extensive gardens, heated pools, a spa, multiple restaurants, and long-serving staff. Renovation affects parts of the property through 2027, so room placement deserves a direct question.",
    hours: {
      default:
        "Reception and guest services operate 24 hours; check-in from 3:00 PM and check-out by 1:00 PM.",
    },
    officialUrl:
      "https://www.marriott.com/en-us/hotels/addlc-sheraton-addis-a-luxury-collection-hotel-addis-ababa/overview/",
    bookingUrl:
      "https://www.marriott.com/en-us/hotels/addlc-sheraton-addis-a-luxury-collection-hotel-addis-ababa/overview/",
    image:
      "https://www.fivestaralliance.com/files/fivestaralliance.com/field/image/nodes/2009/11723/1952_0_sheraton-addis_fsa-g.jpg",
    imagePage:
      "https://www.fivestaralliance.com/luxury-hotels/addis/sheraton-addis",
    editorialUrls: [hotelEditorial],
    venueKind: "lodging",
    lodgingType: "hotel",
    price: "$$$$",
    priceSource: "Official booking page",
    attributeTags: ["luxury", "pool", "spa", "garden", "business_travel"],
  },
  hyatt: {
    name: "Hyatt Regency Addis Ababa",
    coordinates: [9.010087, 38.764068],
    description:
      "Hyatt Regency faces Meskel Square with 188 contemporary rooms, a courtyard pool, strong public spaces, and Fendika's current cultural residency inside the hotel. Ask for a square-facing room only if event noise will not trouble you.",
    hours: {
      default:
        "Reception operates 24 hours; daily check-in from 2:00 PM and check-out by noon.",
    },
    officialUrl:
      "https://www.hyatt.com/hyatt-regency/en-US/addra-hyatt-regency-addis-ababa",
    bookingUrl:
      "https://www.hyatt.com/hyatt-regency/en-US/addra-hyatt-regency-addis-ababa/rooms",
    image:
      "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2019/02/20/0822/Hyatt-Regency-Addis-Ababa-P001-Exterior-Day.jpg/Hyatt-Regency-Addis-Ababa-P001-Exterior-Day.16x9.jpg?imwidth=2560",
    editorialUrls: [hotelEditorial],
    venueKind: "lodging",
    lodgingType: "hotel",
    price: "$$$$",
    priceSource: "Official booking page",
    attributeTags: [
      "luxury",
      "pool",
      "central",
      "business_travel",
      "cultural_program",
    ],
  },
  skylight: {
    name: "Ethiopian Skylight Hotel",
    coordinates: [8.986954, 38.789093],
    description:
      "Ethiopian Skylight is the city's large airport machine: more than a thousand rooms, broad conference facilities, several dining rooms, pools, and a frequent transfer connection. Its scale favors reliable transit logistics over intimate neighborhood character.",
    hours: {
      default:
        "Reception, reservations, and airport-transfer coordination operate 24 hours; daily room access follows the official booking page.",
    },
    officialUrl: "https://www.ethiopianskylighthotel.com/",
    bookingUrl: "https://www.ethiopianskylighthotel.com/",
    image:
      "https://www.tourismupdate.com/files/styles/article_large/public/article/headline/2023-05/ethiopianskylighthotel.jpg?itok=QDHhkcjw",
    imagePage:
      "https://www.tourismupdate.com/article/ethiopian-airlines-opens-expansion-skylight-hotel",
    editorialUrls: [hotelEditorial],
    venueKind: "lodging",
    lodgingType: "hotel",
    price: "$$$",
    priceSource: "Official booking portal",
    attributeTags: [
      "airport_area",
      "airport_shuttle",
      "pool",
      "business_travel",
      "large_hotel",
    ],
  },
  radisson: {
    name: "Radisson Blu Hotel, Addis Ababa",
    coordinates: [9.016183, 38.767747],
    description:
      "Radisson Blu places 212 business-ready rooms close to the UN complex, with dependable workspaces, a spa, and an efficient restaurant-and-bar setup. It is a pragmatic Kazanchis base rather than a resort, and that clarity is useful.",
    hours: {
      default:
        "Reception operates 24 hours; daily check-in from 3:00 PM and check-out by noon.",
    },
    officialUrl:
      "https://www.radissonhotels.com/en-us/hotels/radisson-blu-addis-ababa",
    bookingUrl:
      "https://www.radissonhotels.com/en-us/hotels/radisson-blu-addis-ababa/deals",
    image:
      "https://radissonhotels.iceportal.com/image/radisson-blu-hotel-addis-ababa/exterior/16256-116427-f87799852_3XL.jpg",
    editorialUrls: [hotelEditorial],
    venueKind: "lodging",
    lodgingType: "hotel",
    price: "$$$",
    priceSource: "Official booking page",
    attributeTags: [
      "business_travel",
      "spa",
      "central",
      "restaurant",
      "accessible",
    ],
  },
  hilton: {
    name: "Hilton Addis Ababa",
    coordinates: [9.018725, 38.765028],
    description:
      "Hilton Addis Ababa trades new-build gloss for mature gardens, a geothermal pool, tennis courts, and a central government-quarter location. Some rooms show their age, but the outdoor space and deep local operational experience remain difficult to copy.",
    hours: {
      default:
        "Reception operates 24 hours; daily check-in from 2:00 PM and check-out by noon.",
    },
    officialUrl: "https://www.hilton.com/en/hotels/addhitw-hilton-addis-ababa/",
    bookingUrl:
      "https://www.hilton.com/en/hotels/addhitw-hilton-addis-ababa/rooms/",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Hotel_Hilton_in_Addis_Abeba.jpg/1280px-Hotel_Hilton_in_Addis_Abeba.jpg",
    imagePage:
      "https://commons.wikimedia.org/wiki/File:Hotel_Hilton_in_Addis_Abeba.jpg",
    editorialUrls: [hotelEditorial],
    venueKind: "lodging",
    lodgingType: "hotel",
    price: "$$$",
    priceSource: "Official booking page",
    attributeTags: [
      "pool",
      "garden",
      "business_travel",
      "historic",
      "family_friendly",
    ],
  },
  marriottExec: {
    name: "Marriott Executive Apartments Addis Ababa",
    coordinates: [9.010443, 38.765113],
    description:
      "Marriott Executive Apartments gives longer stays actual kitchens, separate living areas, laundry practicality, and hotel-level staffing near Meskel Square. The apartment format costs more than a guesthouse but prevents weeks of room-service fatigue.",
    hours: {
      default:
        "Reception operates 24 hours; daily check-in from 3:00 PM and check-out by noon.",
    },
    officialUrl:
      "https://www.marriott.com/en-us/hotels/adder-marriott-executive-apartments-addis-ababa/overview/",
    bookingUrl:
      "https://www.marriott.com/en-us/hotels/adder-marriott-executive-apartments-addis-ababa/rooms/",
    image:
      "https://cache.marriott.com/content/dam/marriott-digital/er/emea/hws/a/adder/en_us/photo/unlimited/assets/adder-exterior-0001.jpg",
    editorialUrls: [hotelEditorial],
    venueKind: "lodging",
    lodgingType: "apartment_hotel",
    price: "$$$$",
    priceSource: "Official booking page",
    attributeTags: [
      "long_stay",
      "kitchen",
      "business_travel",
      "central",
      "pool",
    ],
  },
  goldenTulip: {
    name: "Golden Tulip Addis Ababa",
    coordinates: [8.995539, 38.787001],
    description:
      "Golden Tulip offers a compact full-service operation near Bole Medhanealem, with 90 rooms, airport access, meeting facilities, and dining that does not require a taxi. Its strength is a controlled short stay in a busy district.",
    hours: {
      default:
        "Reception operates 24 hours; daily check-in from 2:00 PM and check-out by noon.",
    },
    officialUrl: "https://addis-ababa.goldentulip.com/",
    bookingUrl: "https://addis-ababa.goldentulip.com/en-us/",
    image: "https://media.iceportal.com/65845/photos/74309877_XXL.jpg",
    editorialUrls: [hotelEditorial],
    venueKind: "lodging",
    lodgingType: "hotel",
    price: "$$$",
    priceSource: "Official booking page",
    attributeTags: [
      "airport_area",
      "business_travel",
      "restaurant",
      "fitness",
      "central",
    ],
  },
  capital: {
    name: "Capital Hotel & Spa",
    coordinates: [9.013403, 38.779765],
    description:
      "Capital combines 114 rooms with a serious spa, outdoor pool, fitness facilities, and conference infrastructure in Yeka. The self-contained setup helps on work trips, though people seeking street life may find the compound too insulated.",
    hours: {
      default:
        "Reception operates 24 hours; daily check-in from 2:00 PM and check-out by noon.",
    },
    officialUrl: "https://www.capitalhotelandspa.com/",
    bookingUrl: "https://www.capitalhotelandspa.com/",
    image:
      "https://images.trvl-media.com/lodging/7000000/6600000/6600000/6599955/8ae37275.jpg?impolicy=resizecrop&ra=fill&rh=575&rw=575",
    imagePage:
      "https://www.hotels.com/ho441042/capital-hotel-spa-addis-ababa-ethiopia/",
    editorialUrls: [hotelEditorial],
    venueKind: "lodging",
    lodgingType: "hotel",
    price: "$$$",
    priceSource: "Official and current property booking pages",
    attributeTags: [
      "spa",
      "pool",
      "business_travel",
      "fitness",
      "airport_shuttle",
    ],
  },
  bestWestern: {
    name: "Best Western Plus Addis Ababa",
    coordinates: [8.996894, 38.785971],
    description:
      "Best Western Plus puts 160 straightforward rooms beside Edna Mall, with an airport shuttle, breakfast, gym, and predictable chain standards. Pick it for a busy Bole itinerary; nearby traffic and nightlife can outlast light sleepers.",
    hours: {
      default:
        "Reception operates 24 hours; daily check-in from 2:00 PM and check-out by noon.",
    },
    officialUrl: "https://bwplusaddisababa.com/",
    bookingUrl: "https://bwplusaddisababa.com/rooms/",
    image:
      "https://bwplusaddisababa.com/wp-content/uploads/2025/04/Best-Western-Plus-Addis-Ababa-Exterior-Image-e1745216621409.jpg",
    editorialUrls: [hotelEditorial],
    venueKind: "lodging",
    lodgingType: "hotel",
    price: "$$$",
    priceSource: "Official booking page",
    attributeTags: [
      "airport_area",
      "airport_shuttle",
      "business_travel",
      "fitness",
      "central",
    ],
  },
  grandPalace: {
    name: "Grand Palace Suites Hotel",
    coordinates: [9.0169, 38.7684],
    description:
      "Grand Palace Suites favors large rooms, suites, polished marble public areas, and a Kazanchis location close to international institutions. It serves travelers who value space and formal service more than a strong independent design identity.",
    hours: {
      default:
        "Reception and guest services operate 24 hours; daily room access follows the official booking page.",
    },
    officialUrl: "https://grandpalaceaddis.com/home/",
    bookingUrl: "https://grandpalaceaddis.com/home/",
    image:
      "https://grandpalaceaddis.com/wp-content/uploads/2020/09/Watermarked-scaled-e1598998976915.jpg?id=472",
    editorialUrls: [hotelEditorial],
    venueKind: "lodging",
    lodgingType: "hotel",
    price: "$$$",
    priceSource: "Official property booking page",
    attributeTags: [
      "business_travel",
      "suites",
      "central",
      "spa",
      "restaurant",
    ],
  },
  madVervet: {
    name: "Mad Vervet Backpackers Hostel",
    coordinates: [9.008274, 38.800308],
    description:
      "Mad Vervet is Addis's clearest social-hostel choice, with mixed and women-only dorms, a shared kitchen, bar, terrace, and help arranging onward travel. Recent reviews praise atmosphere and security while noting that reception can be intermittently unattended.",
    hours: {
      default:
        "Reception operates 24 hours; daily check-in 3:00 PM-11:00 PM and check-out by noon.",
    },
    officialUrl:
      "https://www.hostelworld.com/hostels/p/307690/mad-vervet-hostel/",
    bookingUrl: "https://www.booking.com/hotel/et/mad-vervet-hostel.html",
    image:
      "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/321403/lvtokxfads6w6mjezfrq.jpg",
    editorialUrls: [hostelEditorial],
    venueKind: "lodging",
    lodgingType: "hostel",
    price: "$",
    priceSource: "Current Hostelworld dorm rates",
    attributeTags: [
      "budget_stay",
      "dorms",
      "social",
      "shared_kitchen",
      "solo_travel",
    ],
  },
  newSilk: {
    name: "New Silk Road Hostel",
    coordinates: [8.988571, 38.803636],
    description:
      "New Silk Road is a simple Bole hostel with dorm inventory, free breakfast, Wi-Fi, washing facilities, and airport proximity. Amenities are limited and the listing language shifts between hostel and hotel, so book the exact room type carefully.",
    hours: {
      default:
        "Daily check-in 2:00 PM-11:00 PM; check-out by noon; security operates 24 hours.",
    },
    officialUrl:
      "https://www.hostelworld.com/hostels/p/334809/new-silk-road-hostel/",
    bookingUrl:
      "https://www.hostelworld.com/hostels/p/334809/new-silk-road-hostel/",
    image:
      "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/334809/c7qxhfvxqifpqmezddim.jpg",
    editorialUrls: [hostelEditorial],
    venueKind: "lodging",
    lodgingType: "hostel",
    price: "$",
    priceSource: "Current Hostelworld dorm rates",
    attributeTags: [
      "budget_stay",
      "dorms",
      "free_breakfast",
      "airport_area",
      "solo_travel",
    ],
  },
  simple: {
    name: "Simple Hostel",
    coordinates: [8.994, 38.773],
    description:
      "Simple Hostel lists a ten-bed mixed dorm, shared kitchen, balcony, and very low current rate near the light-rail corridor. It has no guest score yet and owner-supplied photos are weak, so treat it as a functional inventory lead rather than a proven social base.",
    hours: {
      default:
        "Daily check-in and check-out are available 24 hours through the current Booking.com property page.",
    },
    officialUrl: "https://www.booking.com/hotel/et/simple-hostel.html",
    bookingUrl: "https://www.booking.com/hotel/et/simple-hostel.html",
    image:
      "https://content.skyscnr.com/available/2531857239/2531857239_WxH.jpg",
    imagePage:
      "https://www.skyscanner.gg/hotels/ethiopia/addis-ababa-hotels/simple-hostel/ht-228275389",
    editorialUrls: [hostelEditorial],
    venueKind: "lodging",
    lodgingType: "hostel",
    price: "$",
    priceSource: "Current Booking.com dorm rate",
    attributeTags: [
      "budget_stay",
      "dorms",
      "shared_kitchen",
      "central",
      "no_review_score",
    ],
  },
  wib: {
    name: "Wib Guesthouse",
    coordinates: [9.020433, 38.793776],
    description:
      "Wib is a small garden guesthouse with private rooms, free transfers, parking, and unusually strong verified feedback for staff and value. Its Yeka setting is quieter than central Bole, so ride time is the tradeoff.",
    hours: {
      default: "Daily check-in 10:00 AM-11:00 PM; check-out 11:00 AM-noon.",
    },
    officialUrl:
      "https://www.booking.com/hotel/et/sholla-guesthouse.en-gb.html",
    bookingUrl: "https://www.booking.com/hotel/et/sholla-guesthouse.en-gb.html",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/354661641.jpg?k=c76402bb6a05f5dad5f9fb52c96f21b449c58665aab3681d3f12a869c8e07d6f&o=",
    editorialUrls: [budgetEditorial],
    venueKind: "lodging",
    lodgingType: "guesthouse",
    price: "$",
    priceSource: "Current Booking.com property rates",
    attributeTags: [
      "budget_stay",
      "highly_rated",
      "garden",
      "airport_shuttle",
      "quiet",
    ],
  },
  daylin: {
    name: "Daylin Guest House",
    coordinates: [9.002029, 38.785694],
    description:
      "Daylin delivers new, compact rooms with private bathrooms, breakfast, fast airport access, and attentive service behind Bole Tele. Current guests consistently reward cleanliness and value; street-level neighborhood texture is thinner than in older districts.",
    hours: {
      default:
        "Reception operates 24 hours; daily check-in from 2:00 PM and check-out by 11:00 AM.",
    },
    officialUrl: "https://daylinguesthouse.com/",
    bookingUrl:
      "https://www.booking.com/hotel/et/daylin-guest-house.en-gb.html",
    image:
      "https://daylinguesthouse.com/wp-content/uploads/2025/01/daylin-building-image.jpg",
    editorialUrls: [budgetEditorial],
    venueKind: "lodging",
    lodgingType: "guesthouse",
    price: "$",
    priceSource: "Current Booking.com property rates",
    attributeTags: [
      "budget_stay",
      "highly_rated",
      "free_breakfast",
      "airport_area",
      "new_property",
    ],
  },
  hammer: {
    name: "Hammer Luxury Guesthouse",
    coordinates: [9.011152, 38.78321],
    description:
      "Hammer offers large, soundproofed rooms, strong Wi-Fi, breakfast, a lift, and round-the-clock staff on Mickey Leland Street. Despite the name, verified rates and a 9-plus score make it one of Bole's strongest value comparisons.",
    hours: {
      default:
        "Reception operates 24 hours; daily check-in 10:00 AM-11:00 PM and check-out by 10:00 AM.",
    },
    officialUrl: "https://hammerluxuryaddis.com/",
    bookingUrl:
      "https://www.booking.com/hotel/et/hammer-luxury-guesthouse-addis-ababa1.en-gb.html",
    image: "https://hammerluxuryaddis.com/images/hammer-luxury-guesthouse.jpg",
    editorialUrls: [budgetEditorial],
    venueKind: "lodging",
    lodgingType: "guesthouse",
    price: "$",
    priceSource: "Current Booking.com property rates",
    attributeTags: [
      "budget_stay",
      "highly_rated",
      "fast_wifi",
      "airport_area",
      "breakfast",
    ],
  },
  ecco: {
    name: "ECCO Modern Guest House",
    coordinates: [9.002472, 38.791178],
    description:
      "ECCO pairs balcony rooms, accessible features, a sun terrace, breakfast, and a 24-hour desk near Bole Medhanealem. Verified guests rate cleanliness and comfort above the overall score, a useful distinction for a no-frills stay.",
    hours: {
      default:
        "Reception operates 24 hours; daily check-in at noon and check-out by 10:00 AM.",
    },
    officialUrl:
      "https://www.booking.com/hotel/et/ecco-modern-guest-house.en-gb.html",
    bookingUrl:
      "https://www.booking.com/hotel/et/ecco-modern-guest-house.en-gb.html",
    image:
      "https://q-xx.bstatic.com/xdata/images/hotel/840x460/467297223.jpg?k=493ec031e499f8a89f39fe2de41b7e3113891cc82f774a7a669c88092a7f3f91&o=",
    editorialUrls: [budgetEditorial],
    venueKind: "lodging",
    lodgingType: "guesthouse",
    price: "$",
    priceSource: "Current Booking.com property rates",
    attributeTags: [
      "budget_stay",
      "highly_rated",
      "accessible",
      "airport_area",
      "balcony",
    ],
  },
  abat: {
    name: "Abaት Guest House",
    coordinates: [8.9925, 38.7905],
    description:
      "Abaት has 16 furnished rooms, balconies, a coffee shop, and airport transfers within walking distance of central Bole services. Its verified score is solid rather than exceptional, but location and 24-hour support carry real value on short connections.",
    hours: {
      default:
        "Front desk and daily check-in operate 24 hours; check-out by 11:30 AM.",
    },
    officialUrl: "https://abatguesthouse.com/",
    bookingUrl:
      "https://www.booking.com/hotel/et/abaate-guest-house.en-gb.html",
    image:
      "https://abatguesthouse.com/wp-content/uploads/2025/02/guest-house-4.jpg",
    editorialUrls: [budgetEditorial],
    venueKind: "lodging",
    lodgingType: "guesthouse",
    price: "$",
    priceSource: "Current official and Booking.com rates",
    attributeTags: [
      "budget_stay",
      "airport_area",
      "airport_shuttle",
      "coffee",
      "balcony",
    ],
  },
  brighton: {
    name: "Brighton Guest House and Cafe",
    coordinates: [9.0077, 38.786678],
    description:
      "Brighton combines private rooms, a small cafe, parking, and a quiet Djibouti Street position with hundreds of strong verified reviews. It is especially persuasive for travelers who want Bole access without paying for a full-service hotel lobby.",
    hours: {
      default: "Daily check-in 2:00 PM-6:00 PM; check-out 11:00 AM-noon.",
    },
    officialUrl:
      "https://www.booking.com/hotel/et/brighton-guest-house-and-cafe.html",
    bookingUrl:
      "https://www.booking.com/hotel/et/brighton-guest-house-and-cafe.html",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/675599004.jpg?k=347201f39ab8c9001e34f1c3401a664fd64e0e492e464a8f5cffd79c98cfaf9c&o=",
    editorialUrls: [budgetEditorial],
    venueKind: "lodging",
    lodgingType: "guesthouse",
    price: "$",
    priceSource: "Current Booking.com property rates",
    attributeTags: [
      "budget_stay",
      "highly_rated",
      "quiet",
      "cafe",
      "airport_area",
    ],
  },
  fbk: {
    name: "FBK Guest House",
    coordinates: [9.0098, 38.77999],
    description:
      "FBK gives Bole guests spacious balcony rooms, refrigerators, a rooftop breakfast room, laundry, and a 24-hour desk. Recent verified reviews repeatedly praise staff and value, though English communication can vary at check-in.",
    hours: {
      default:
        "Reception operates 24 hours; daily check-in from noon and check-out by 11:00 AM.",
    },
    officialUrl: "https://www.booking.com/hotel/et/fbk-guest-house.html",
    bookingUrl: "https://www.booking.com/hotel/et/fbk-guest-house.html",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/632778421.jpg?k=e89f9d99364b0a11b352008230fbe6fde47aff8accd586443695e3b79fbf07ec&o=",
    editorialUrls: [budgetEditorial],
    venueKind: "lodging",
    lodgingType: "guesthouse",
    price: "$",
    priceSource: "Current Booking.com property rates",
    attributeTags: [
      "budget_stay",
      "highly_rated",
      "balcony",
      "rooftop",
      "breakfast",
    ],
  },
} satisfies Record<string, Seed>;

function stop(
  key: keyof typeof venueSeeds,
  id: string,
  overrides: Partial<GuideStop> = {},
): GuideStop {
  const seed: Seed = venueSeeds[key];
  const {
    image,
    imagePage,
    editorialUrls = [],
    sourceUrls = [],
    ...rest
  } = seed;
  const mapUrl = maps(`${seed.name} Addis Ababa Ethiopia`);
  const imageEvidence = imagePage ?? image;
  return {
    ...rest,
    id,
    photo: image,
    imageSourceUrl: image,
    imageSourceName: imagePage
      ? "Editorial or licensed venue image"
      : "Official or property image",
    sourceUrls: [
      ...new Set(
        [
          seed.officialUrl,
          seed.bookingUrl,
          mapUrl,
          imageEvidence,
          ...editorialUrls,
          ...sourceUrls,
        ].filter(Boolean) as string[],
      ),
    ],
    sourceEvidence: {
      officialUrl: seed.officialUrl,
      mapUrl,
      currentStatusUrl: seed.bookingUrl ?? seed.officialUrl,
      imageSourceUrl: imageEvidence,
      editorialUrls,
      checkedAt,
      notes:
        "Official, property, booking, editorial, current-status, hours, category, and image evidence checked on 2026-08-26; closed and placeholder candidates were rejected.",
    },
    ...overrides,
  };
}

const extraSeeds = {
  fendika: {
    name: "Fendika Cultural Center",
    coordinates: [9.010087, 38.764068],
    description:
      "Fendika is dancer Melaku Belay's intimate home for azmari performance, Ethio-jazz, poetry, and visual art. Come for close-up musicianship and a mixed local-international crowd; the room fills quickly on headline nights.",
    hours: {
      default:
        "Weekly program Wednesday-Friday; doors at 7:00 PM. Wednesday concerts start at 9:00 PM, Thursday at 8:00 PM, and Friday at 9:30 PM; extra dates follow the official calendar.",
    },
    officialUrl: "https://fendika.org/",
    bookingUrl: "https://fendika.org/events/",
    image:
      "https://pub-76a38779606744ecacbdbee9bdb1c584.r2.dev/images/20251030_185028_738eb920979686b8.webp",
    imagePage: "https://addistoday.com/listings/addis-jazz-festival-2026/",
    venueKind: "nightlife",
    nightlifeType: "live_music_venue",
    musicGenres: ["Ethio-jazz", "Azmari", "Traditional Ethiopian"],
    price: "$$",
    priceSource: "Official event calendar",
    attributeTags: [
      "live_music",
      "local_favorite",
      "cultural_performance",
      "lively_nightlife",
    ],
  },
  africanJazz: {
    name: "African Jazz Village",
    coordinates: [9.013381, 38.761032],
    description:
      "Mulatu Astatke's club inside Ghion Hotel anchors Addis's Ethio-jazz circuit with the African Jazz Village Band and visiting players. The dated program matters more than the room itself, so choose a concert rather than dropping in blind.",
    hours: {
      default:
        "Regular concerts Monday and Friday; doors at 7:00 PM and music at 9:00 PM. Confirm the dated program with Ghion Hotel before visiting.",
    },
    officialUrl: "https://ghionhotel.com.et/",
    bookingUrl: "https://ghionhotel.com.et/events/",
    image:
      "https://ak-d.tripcdn.com/images/0584f12000cscnanxC474_R_960_660_R5_D.jpg",
    imagePage:
      "https://www.trip.com/hotels/addis-ababa-hotel-detail-2199628/ghion-hotel/",
    venueKind: "nightlife",
    nightlifeType: "live_music_venue",
    musicGenres: ["Ethio-jazz", "Jazz"],
    price: "$$",
    priceSource: "Current venue program",
    attributeTags: ["live_music", "jazz", "cultural_performance", "seated"],
  },
  gaslight: {
    name: "Gaslight Night Club",
    coordinates: [9.020585, 38.759698],
    description:
      "Sheraton Addis's long-running club provides a polished dance floor, DJs, cocktails, and hotel-level security. It is a late, dressier option with premium prices; the hotel's event calendar determines actual operating nights.",
    hours: {
      default:
        "The official calendar is the complete opening timetable: Gaslight opens only for the dated club nights and special events published there.",
    },
    officialUrl:
      "https://www.marriott.com/en-us/hotels/addlc-sheraton-addis-a-luxury-collection-hotel-addis-ababa/experiences/",
    image:
      "https://cache.marriott.com/content/dam/marriott-renditions/ADDLC/addlc-gaslight-nightclub-7451-hor-clsc.jpg?downsize=1920px%3A%2A&interpolation=progressive-bilinear&output-quality=70",
    venueKind: "nightlife",
    nightlifeType: "club",
    musicGenres: ["Afrobeats", "Dance", "International"],
    price: "$$$",
    priceSource: "Official hotel venue page",
    attributeTags: [
      "dance_floor",
      "party_nightlife",
      "premium_drinks",
      "late_night",
    ],
  },
  mamas: {
    name: "Mama's Kitchen",
    coordinates: [8.995792, 38.78753],
    description:
      "Mama's Kitchen combines Ethiopian and international plates with a bar and recurring band nights near Edna Mall. The all-hours restaurant is dependable, but the live-music reason to visit follows its dated performance listings.",
    hours: {
      default:
        "Restaurant service is listed 24 hours daily; live performances run only on dates announced through the official venue schedule.",
    },
    officialUrl: "https://map.et/listing/mamas-kitchen/",
    image: "https://s2.dmcdn.net/v/Dg55_1Mmlev9zX1Zd/x1080",
    imagePage: "https://www.dailymotion.com/video/x8l4n5j",
    venueKind: "nightlife",
    nightlifeType: "live_music_venue",
    musicGenres: ["Ethiopian", "African", "Popular"],
    price: "$$",
    priceSource: "Current venue menu",
    attributeTags: ["live_music", "dinner", "group_friendly", "central"],
  },
  gazebo: {
    name: "Gazebo Bar & Restaurant",
    coordinates: [9.018825, 38.764928],
    description:
      "Gazebo sits beside Hilton Addis Ababa's pool for open-air drinks, grills, and a relaxed Sunday brunch. It is better for conversation than clubbing, with hotel pricing offset by greenery and dependable service.",
    hours: {
      mon: "Closed",
      tue: "Closed",
      wed: "12:00 PM-11:00 PM",
      thu: "12:00 PM-11:00 PM",
      fri: "12:00 PM-11:00 PM",
      sat: "12:00 PM-11:00 PM",
      sun: "12:30 PM-11:00 PM; official Sunday brunch 12:30 PM-3:30 PM",
    },
    officialUrl:
      "https://www.hilton.com/en/hotels/addhitw-hilton-addis-ababa/dining/",
    image:
      "https://img.easemytrip.com/EMTHOTEL-2564/70/2/na/s/15374816_241.jpg",
    imagePage: "https://www.easemytrip.com/hotels/hilton-addis-ababa-2564/",
    venueKind: "nightlife",
    nightlifeType: "lounge",
    price: "$$$",
    priceSource: "Official hotel dining page",
    attributeTags: [
      "outdoor_seating",
      "low_key_nightlife",
      "scenic_nightlife",
      "brunch",
    ],
  },
  berlin: {
    name: "Berlin Bar & Restaurant",
    coordinates: [9.000346, 38.781085],
    description:
      "Berlin is a broad-hours Bole bar-restaurant for Ethiopian food, beer, cocktails, sport, and groups that want flexibility rather than a specialist drinks list. Its very late official hours make it a practical fallback.",
    hours: {
      default:
        "Daily 7:00 AM-6:00 AM the following day, according to the official venue site.",
    },
    officialUrl: "https://www.berlin-addis.com/",
    image:
      "https://itin-dev.wanderlogstatic.com/freeImage/LrcK76LFqGQI7GSaA90i90EERWSMmkq9",
    imagePage:
      "https://wanderlog.com/place/details/4114505/berlin-bar--restaurant--atlas--%E1%89%A0%E1%88%AD%E1%88%8A%E1%8A%95-%E1%89%A3%E1%88%AD%E1%8A%93-%E1%88%AC%E1%88%B5%E1%89%B6%E1%88%AB%E1%8A%95%E1%89%B5--%E1%8A%A0%E1%89%B5%E1%88%8B%E1%88%B5",
    venueKind: "nightlife",
    nightlifeType: "pub",
    price: "$$",
    priceSource: "Official venue menu",
    attributeTags: ["late_late", "group_friendly", "casual", "sports"],
  },
  velvet: {
    name: "Velvet Addis",
    coordinates: [8.988449, 38.79196],
    description:
      "Velvet pairs a contemporary Bole dining room with cocktails, rooftop seating, DJ sessions, and salsa events. It works best as an early-evening social stop; check the calendar before expecting dancing.",
    hours: {
      default:
        "Daily 10:00 AM-10:00 PM; salsa, DJ, and other special sessions follow the official events calendar.",
    },
    officialUrl: "https://www.velvetaddis.com/",
    bookingUrl: "https://www.velvetaddis.com/events",
    image: "https://www.velvetaddis.com/images/velvet-dining-space.jpg",
    venueKind: "nightlife",
    nightlifeType: "rooftop_bar",
    price: "$$",
    priceSource: "Official venue menu",
    attributeTags: ["rooftop", "cocktails", "dance_floor", "date_night"],
  },
  moodz: {
    name: "Moodz Lounge",
    coordinates: [8.987054, 38.789193],
    description:
      "Moodz at Ethiopian Skylight Hotel is a sleek airport-area lounge for cocktails, DJs, and planned theme nights. Service and security are polished, while the atmosphere depends heavily on the hotel's dated event schedule.",
    hours: {
      default:
        "The official event calendar in Ethiopian Skylight Hotel's dining portal is the complete timetable; Moodz operates only for the dated lounge nights published there.",
    },
    officialUrl: "https://skyflip.ethiopianskylighthotel.com/",
    image:
      "https://www.hotelscombined.com/himg/ec/7b/a3/expedia_group-4745611-66283738-785263.jpg",
    imagePage:
      "https://www.hotelscombined.com/Hotel/Ethiopian_Skylight_Hotel.htm",
    venueKind: "nightlife",
    nightlifeType: "lounge",
    price: "$$$",
    priceSource: "Official hotel menu portal",
    attributeTags: [
      "premium_drinks",
      "party_nightlife",
      "airport_area",
      "hotel_bar",
    ],
  },
  stanleys: {
    name: "Stanley's Bar",
    coordinates: [9.020385, 38.759498],
    description:
      "Stanley's is Sheraton Addis's wood-paneled cocktail bar, strong on classic drinks, whisky, and quiet table service. The polished setting suits business conversations and nightcaps better than a high-energy bar crawl.",
    hours: { default: "Daily 5:00 PM-2:00 AM." },
    officialUrl:
      "https://www.marriott.com/en-us/hotels/addlc-sheraton-addis-a-luxury-collection-hotel-addis-ababa/dining/",
    image:
      "https://www.marriott.com/content/dam/marriott-renditions/ADDLC/addlc-stanleys-cocktail-9396-hor-pano.jpg",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    price: "$$$$",
    priceSource: "Official hotel bar menu",
    attributeTags: ["cocktails", "premium_drinks", "quiet", "hotel_bar"],
  },
  cascara: {
    name: "Cascara Coffee & Cocktails",
    coordinates: [9.010187, 38.763968],
    description:
      "Cascara, in Hyatt Regency's courtyard, moves from Ethiopian coffee into carefully built cocktails and light plates. The garden outlook and measured service make it one of the city's calmer upscale drinks choices.",
    hours: { default: "Daily noon-11:00 PM." },
    officialUrl:
      "https://www.hyatt.com/hyatt-regency/en-US/addra-hyatt-regency-addis-ababa/dining",
    image:
      "https://i.pinimg.com/736x/16/d4/7b/16d47ba9448cbffcb55be018ef3af8f3.jpg",
    imagePage:
      "https://www.pinterest.com/pin/cascara-caf-cocktails-photos-vidos--612559986828168276/",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    price: "$$$$",
    priceSource: "Official hotel bar menu",
    attributeTags: ["cocktails", "garden", "date_night", "premium_drinks"],
  },
  signature: {
    name: "Signature Bar",
    coordinates: [9.016083, 38.767647],
    description:
      "Signature is Radisson Blu's lobby-level bar for classic cocktails, wine, coffee, and compact plates. Its central Kazanchis address and long daily schedule favor meetings and a controlled pre-dinner drink.",
    hours: { default: "Daily 6:30 AM-10:30 PM." },
    officialUrl:
      "https://www.radissonhotels.com/en-us/hotels/radisson-blu-addis-ababa/restaurants-and-bars/signature-bar",
    image:
      "https://media.radissonhotels.net/image/radisson-blu-hotel-addis-ababa/barlounge/16256-116427-f87504688_3XL.jpg?impolicy=HomeHero",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    price: "$$$",
    priceSource: "Official hotel bar menu",
    attributeTags: ["cocktails", "business_travel", "central", "hotel_bar"],
  },
  terrace: {
    name: "The Terrace",
    coordinates: [9.016283, 38.767847],
    description:
      "Radisson Blu's Terrace offers open-air cocktails and light food above Kazanchis. Choose it for sunset and conversation; seasonal rain and cool highland evenings can make the indoor Signature Bar the safer backup.",
    hours: {
      default:
        "Daily 6:30 AM-10:30 PM; outdoor seating depends on weather and the official hotel dining notice.",
    },
    officialUrl:
      "https://www.radissonhotels.com/en-us/hotels/radisson-blu-addis-ababa/restaurants-and-bars/the-terrace",
    image:
      "https://media.radissonhotels.net/image/radisson-blu-hotel-addis-ababa/barlounge/16256-116427-f63879032_3XL.jpg?impolicy=HomeHero",
    venueKind: "nightlife",
    nightlifeType: "rooftop_bar",
    price: "$$$",
    priceSource: "Official hotel bar menu",
    attributeTags: [
      "cocktails",
      "outdoor_seating",
      "scenic_nightlife",
      "central",
    ],
  },
  blackRose: {
    name: "Black Rose Lounge",
    coordinates: [8.990582, 38.783954],
    description:
      "Black Rose is a late Bole lounge with cocktails, DJs, hookah, and a dressier crowd. It is an after-dinner option rather than a craft-cocktail pilgrimage, strongest when a promoted event supplies the energy.",
    hours: {
      mon: "5:00 PM-12:30 AM",
      tue: "5:00 PM-2:00 AM",
      wed: "5:00 PM-2:00 AM",
      thu: "5:00 PM-2:00 AM",
      fri: "5:00 PM-2:00 AM",
      sat: "5:00 PM-2:00 AM",
      sun: "5:00 PM-12:30 AM",
    },
    officialUrl: "https://www.blkroseaddis.com/",
    image:
      "https://itin-dev.wanderlogstatic.com/freeImage/3fF4oP8H65yMso4tRSzNcjcGHKRGuYNt",
    imagePage: "https://wanderlog.com/place/details/90946/black-rose-lounge",
    venueKind: "nightlife",
    nightlifeType: "lounge",
    price: "$$$",
    priceSource: "Current venue menu",
    attributeTags: ["cocktails", "late_night", "party_nightlife", "dressy"],
  },
  table5: {
    name: "Table 5 Restaurant",
    coordinates: [9.0151, 38.7719],
    description:
      "Table 5 is a small Kazanchis restaurant-bar known for burgers, steaks, cocktails, and attentive owner-led service. It lacks the depth of a dedicated cocktail room but rewards a relaxed meal-and-drink evening.",
    hours: {
      mon: "7:00 AM-10:00 PM",
      tue: "7:00 AM-10:00 PM",
      wed: "7:00 AM-10:00 PM",
      thu: "7:00 AM-10:00 PM",
      fri: "7:00 AM-10:00 PM",
      sat: "7:00 AM-10:00 PM",
      sun: "Closed",
    },
    officialUrl: "https://www.facebook.com/table5restaurant/",
    image:
      "https://img4.restaurantguru.com/w550/h367/r3a8-interior-TABLE-5-RESTAURANT-2026-04-1.jpg",
    imagePage: "https://restaurantguru.com/Table-5-Restaurant-Addis-Ababa",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    price: "$$",
    priceSource: "Current venue menu",
    attributeTags: ["cocktails", "casual", "walk_in_friendly", "central"],
  },
} satisfies Record<string, Seed>;

function extraStop(
  key: keyof typeof extraSeeds,
  id: string,
  overrides: Partial<GuideStop> = {},
): GuideStop {
  const seed: Seed = extraSeeds[key];
  const {
    image,
    imagePage,
    editorialUrls = [],
    sourceUrls = [],
    ...rest
  } = seed;
  const mapUrl = maps(`${seed.name} Addis Ababa Ethiopia`);
  const imageEvidence = imagePage ?? image;
  return {
    ...rest,
    id,
    photo: image,
    imageSourceUrl: image,
    imageSourceName: imagePage
      ? "Editorial or licensed venue image"
      : "Official or property image",
    sourceUrls: [
      ...new Set(
        [
          seed.officialUrl,
          seed.bookingUrl,
          mapUrl,
          imageEvidence,
          ...editorialUrls,
          ...sourceUrls,
        ].filter(Boolean) as string[],
      ),
    ],
    sourceEvidence: {
      officialUrl: seed.officialUrl,
      mapUrl,
      currentStatusUrl: seed.bookingUrl ?? seed.officialUrl,
      imageSourceUrl: imageEvidence,
      editorialUrls,
      checkedAt,
      notes:
        "Official, editorial, hours, category, and image evidence checked on 2026-08-26.",
    },
    ...overrides,
  };
}

const cultureSeeds = {
  nationalMuseum: {
    name: "National Museum of Ethiopia",
    coordinates: [9.037978, 38.761861],
    description:
      "The newly renovated National Museum frames Ethiopia's long history through Lucy and other hominin fossils, Aksumite objects, imperial regalia, and modern art. Labels are improving, but a guide still adds useful archaeological context.",
    hours: {
      default: "Daily 8:30 AM-5:30 PM; closed on major national holidays.",
    },
    officialUrl: "https://www.facebook.com/NationalMuseumofEthiopia/",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/National_museum_of_Ethiopia_New_facility.JPG/1280px-National_museum_of_Ethiopia_New_facility.JPG",
    imagePage:
      "https://commons.wikimedia.org/wiki/File:National_museum_of_Ethiopia_New_facility.JPG",
    venueKind: "culture",
    attributeTags: ["museum", "archaeology", "history", "family_friendly"],
  },
  ethnological: {
    name: "Ethnological Museum",
    coordinates: [9.046703, 38.758278],
    description:
      "Set in Haile Selassie's former palace at Addis Ababa University, the Ethnological Museum links material culture, religious art, music, and imperial rooms. The campus setting and well-shaped narrative justify the trip north of the center.",
    hours: {
      mon: "8:00 AM-5:00 PM",
      tue: "8:00 AM-5:00 PM",
      wed: "8:00 AM-5:00 PM",
      thu: "8:00 AM-5:00 PM",
      fri: "8:00 AM-5:00 PM",
      sat: "9:00 AM-5:00 PM",
      sun: "9:00 AM-5:00 PM",
    },
    officialUrl: "https://www.aau.edu.et/ies/ethnological-museum",
    image: commons("Ethnographic Museum, Addis Ababa.jpg"),
    imagePage:
      "https://commons.wikimedia.org/wiki/File:Ethnographic_Museum,_Addis_Ababa.jpg",
    venueKind: "culture",
    attributeTags: ["museum", "history", "architecture", "university"],
  },
  redTerror: {
    name: "Red Terror Martyrs Memorial Museum",
    coordinates: [9.010205, 38.762929],
    description:
      "This compact, survivor-founded museum documents the Derg's Red Terror through photographs, personal objects, testimony, and human remains. The material is harrowing and direct; allow quiet time and consider the on-site guides' lived perspective.",
    hours: { default: "Daily 8:00 AM-6:30 PM." },
    officialUrl: "https://semaetate.org/",
    image: commons("ET Addis asv2018-02 img7.jpg"),
    imagePage:
      "https://commons.wikimedia.org/wiki/File:ET_Addis_asv2018-02_img7.jpg",
    venueKind: "culture",
    attributeTags: ["museum", "modern_history", "memorial", "educational"],
  },
  holyTrinity: {
    name: "Holy Trinity Cathedral",
    coordinates: [9.030801, 38.766491],
    description:
      "Holy Trinity Cathedral combines murals, stained glass, imperial tombs, and the graves of figures including Sylvia Pankhurst. Respect worship in progress, dress conservatively, and use the small museum to decode the political history around the compound.",
    hours: {
      default:
        "Daily 8:30 AM-5:00 PM; visitor access may pause during liturgy and church ceremonies.",
    },
    officialUrl: "https://visitethiopia.et/attractions/holy-trinity-cathedral",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Holy_Trinity_Cathedral%2C_Addis_Ababa_%283434312871%29.jpg/1280px-Holy_Trinity_Cathedral%2C_Addis_Ababa_%283434312871%29.jpg",
    imagePage:
      "https://commons.wikimedia.org/wiki/File:Holy_Trinity_Cathedral,_Addis_Ababa_(3434312871).jpg",
    venueKind: "culture",
    attributeTags: [
      "religious_site",
      "architecture",
      "history",
      "active_worship",
    ],
  },
  stGeorge: {
    name: "St. George Cathedral and Museum",
    coordinates: [9.03741, 38.751304],
    description:
      "The octagonal St. George Cathedral preserves works by Afewerk Tekle and a museum of vestments, manuscripts, and imperial objects tied to the Battle of Adwa. Visit outside services for the clearest museum access.",
    hours: {
      default:
        "Daily 8:00 AM-noon and 3:00 PM-6:00 PM; worship services can alter visitor access.",
    },
    officialUrl: "https://map.et/listing/st-george-cathedral-museum/",
    image: commons("Addis abeba, cattedrale di san giorgio, esterno 05.jpg"),
    imagePage:
      "https://commons.wikimedia.org/wiki/File:Addis_abeba,_cattedrale_di_san_giorgio,_esterno_05.jpg",
    venueKind: "culture",
    attributeTags: ["religious_site", "museum", "architecture", "history"],
  },
  addisMuseum: {
    name: "Addis Ababa Museum",
    coordinates: [9.0107, 38.7612],
    description:
      "Inside a former imperial residence, the city museum traces Addis through maps, photographs, domestic objects, and urban change. Displays can feel old-fashioned, but they give valuable grounding before exploring Menelik II Square and newer civic monuments.",
    hours: { default: "Daily 8:30 AM-5:30 PM." },
    officialUrl:
      "https://discoveraddis.gov.et/English_pages/detail_museum.php?id=1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/f/f6/Addis_Ababa_Museum_%2811243068196%29.jpg",
    imagePage:
      "https://commons.wikimedia.org/wiki/File:Addis_Ababa_Museum_(11243068196).jpg",
    venueKind: "culture",
    attributeTags: ["museum", "city_history", "architecture", "central"],
  },
  zoma: {
    name: "Zoma Museum",
    coordinates: [8.97901, 38.731002],
    description:
      "Zoma is a living art and ecology project built from sculpted mud, straw, gardens, studios, and rotating exhibitions. The architecture is the constant draw, while lunch on site and the current exhibition program can turn the cross-town trip into a half-day.",
    hours: {
      mon: "Closed",
      tue: "10:00 AM-8:00 PM",
      wed: "10:00 AM-8:00 PM",
      thu: "10:00 AM-8:00 PM",
      fri: "10:00 AM-8:00 PM",
      sat: "10:00 AM-8:00 PM",
      sun: "10:00 AM-8:00 PM",
    },
    officialUrl: "https://www.zomamuseum.org/",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/ZCAC_Addis_Compound.jpeg/1280px-ZCAC_Addis_Compound.jpeg",
    imagePage:
      "https://commons.wikimedia.org/wiki/File:ZCAC_Addis_Compound.jpeg",
    venueKind: "culture",
    attributeTags: ["contemporary_art", "architecture", "garden", "design"],
  },
  adwa: {
    name: "Adwa Victory Memorial Museum",
    coordinates: [9.034375, 38.752461],
    description:
      "This large new memorial interprets Ethiopia's 1896 victory at Adwa through monumental sculpture, documents, multimedia, and Pan-African framing. Its scale can overwhelm, so begin with the historical galleries before walking the plaza and amphitheater.",
    hours: {
      default:
        "Daily 9:00 AM-6:30 PM; ticketing and guided-entry availability follow the official booking portal.",
    },
    officialUrl: "https://adwavictorymemorial.gov.et/about",
    bookingUrl: "https://adwavictorymemorial.gov.et/tickets",
    image:
      "https://pub-76a38779606744ecacbdbee9bdb1c584.r2.dev/images/adwa_3.2e16d0ba.fill-1200x600.jpg",
    imagePage:
      "https://addistoday.com/pages/blog/the-drum-of-defiance-rediscovering-adwa-in-the-heart-of-piassa/",
    venueKind: "culture",
    attributeTags: ["museum", "history", "monument", "pan_african"],
  },
  unityPark: {
    name: "Unity Park",
    coordinates: [9.024545, 38.763015],
    description:
      "Unity Park opens parts of the National Palace grounds through restored imperial buildings, gardens, regional pavilions, wildlife enclosures, and exhibitions. Security and timed admission add friction, but the site explains state symbolism unusually well.",
    hours: {
      mon: "Closed",
      tue: "9:00 AM-4:00 PM",
      wed: "9:00 AM-4:00 PM",
      thu: "9:00 AM-4:00 PM",
      fri: "9:00 AM-4:00 PM",
      sat: "9:00 AM-4:00 PM",
      sun: "9:00 AM-4:00 PM",
    },
    officialUrl: "https://visitethiopia.et/attractions/unity-park",
    bookingUrl: "https://www.unitypark.et/",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Unity_Park_Addis_Ababa_Ethiopia_3.jpg/1280px-Unity_Park_Addis_Ababa_Ethiopia_3.jpg",
    imagePage:
      "https://commons.wikimedia.org/wiki/File:Unity_Park_Addis_Ababa_Ethiopia_3.jpg",
    venueKind: "culture",
    attributeTags: ["park", "history", "family_friendly", "garden"],
  },
  scienceMuseum: {
    name: "Ethiopian Science Museum",
    coordinates: [9.020017, 38.762959],
    description:
      "The Science Museum is a striking domed complex for technology exhibitions, public programs, and national innovation showcases. Exhibitions rotate and can be uneven in depth, making the architecture and current program the reasons to plan a stop.",
    hours: {
      default:
        "Daily 1:00 PM-6:00 PM; special exhibitions and closures follow the museum's official program.",
    },
    officialUrl: "https://ethiopiansciencemuseum.org/",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Top_floor_of_the_first_science_museum_in_Ethiopia.jpg/1280px-Top_floor_of_the_first_science_museum_in_Ethiopia.jpg",
    imagePage:
      "https://commons.wikimedia.org/wiki/File:Top_floor_of_the_first_science_museum_in_Ethiopia.jpg",
    venueKind: "culture",
    attributeTags: [
      "science",
      "architecture",
      "family_friendly",
      "rotating_exhibitions",
    ],
  },
  entoto: {
    name: "Entoto Natural Park",
    coordinates: [9.08545, 38.737191],
    description:
      "Entoto Natural Park combines highland forest, marked walking and cycling routes, viewpoints, horse riding, and cafes above the capital. Altitude, afternoon rain, and weekend crowds matter; go early and use the official booking and weather guidance.",
    hours: {
      default:
        "Daily 6:00 AM-6:00 PM; riding, cycling, and other paid activities follow the official booking schedule and weather policy.",
    },
    officialUrl: "https://entotopark.gov.et/",
    bookingUrl: "https://entotopark.gov.et/booking/",
    image:
      "https://alladdisevents.com/wp-content/uploads/2022/05/Entoto-park-Entrance-worqamba-tour-870x555-2.jpg",
    imagePage: "https://alladdisevents.com/venue-tag/park/?post_type=venue",
    venueKind: "outdoors",
    attributeTags: ["nature", "hiking", "cycling", "scenic"],
  },
  mercato: {
    name: "Addis Mercato",
    coordinates: [9.029628, 38.739604],
    description:
      "Mercato is a dense commercial district rather than a single attraction, organized loosely by goods from spices and coffee to metalwork and textiles. Visit in daylight with minimal valuables and a clear shopping target or local guide.",
    hours: {
      default:
        "Daily 9:00 AM-6:00 PM for the main market; individual vendors and market sections follow their own trading days and may close earlier.",
    },
    officialUrl: "https://visitethiopia.et/attractions/merkato",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Addis_Mercato%2C_Ad%C3%ADs_Abeba%2C_Etiop%C3%ADa%2C_2024-01-19%2C_DD_27.jpg/1280px-Addis_Mercato%2C_Ad%C3%ADs_Abeba%2C_Etiop%C3%ADa%2C_2024-01-19%2C_DD_27.jpg",
    imagePage:
      "https://commons.wikimedia.org/wiki/File:Addis_Mercato,_Ad%C3%ADs_Abeba,_Etiop%C3%ADa,_2024-01-19,_DD_27.jpg",
    venueKind: "retail",
    attributeTags: ["market", "shopping", "local_life", "guided_recommended"],
  },
} satisfies Record<string, Seed>;

function cultureStop(
  key: keyof typeof cultureSeeds,
  id: string,
  overrides: Partial<GuideStop> = {},
): GuideStop {
  const seed: Seed = cultureSeeds[key];
  const {
    image,
    imagePage,
    editorialUrls = [],
    sourceUrls = [],
    ...rest
  } = seed;
  const mapUrl = maps(`${seed.name} Addis Ababa Ethiopia`);
  const imageEvidence = imagePage ?? image;
  return {
    ...rest,
    id,
    photo: image,
    imageSourceUrl: image,
    imageSourceName: imagePage
      ? "Editorial or licensed venue image"
      : "Official or property image",
    sourceUrls: [
      ...new Set(
        [
          seed.officialUrl,
          seed.bookingUrl,
          mapUrl,
          imageEvidence,
          ...editorialUrls,
          ...sourceUrls,
        ].filter(Boolean) as string[],
      ),
    ],
    sourceEvidence: {
      officialUrl: seed.officialUrl,
      mapUrl,
      currentStatusUrl: seed.bookingUrl ?? seed.officialUrl,
      imageSourceUrl: imageEvidence,
      editorialUrls,
      checkedAt,
      notes:
        "Official, institutional, editorial, hours, current-status, and image evidence checked on 2026-08-26.",
    },
    ...overrides,
  };
}

const diningStops = [
  stop("yod", "addis-dining-yod"),
  stop("kategna", "addis-dining-kategna"),
  stop("habesha2000", "addis-dining-2000-habesha"),
  stop("marcus", "addis-dining-marcus"),
  stop("hotto", "addis-dining-hotto"),
  stop("sishu", "addis-dining-sishu"),
  stop("fiveLoaves", "addis-dining-five-loaves"),
  stop("mandoline", "addis-dining-la-mandoline"),
  stop("castelli", "addis-dining-castelli"),
  stop("union", "addis-dining-union"),
];

const cheapEatStops = [
  stop("tomoca", "addis-value-tomoca"),
  stop("cade", "addis-value-cade"),
  stop("patisserie", "addis-value-la-patisserie"),
  stop("effoi", "addis-value-effoi"),
  stop("wanofi", "addis-value-wanofi"),
  stop("ithiopica", "addis-value-ithiopica"),
  stop("savor", "addis-value-savor"),
  stop("akkoo", "addis-value-akkoo"),
  stop("galani", "addis-value-galani"),
  stop("fiveLoaves", "addis-value-five-loaves", {
    price: "$",
    description:
      "Five Loaves is particularly useful at breakfast and lunch, when eggs, pastries, soups, sandwiches, and coffee deliver better value than its dinner service. Go early for the strongest bakery selection.",
  }),
];

const hotelStops = [
  stop("sheraton", "addis-hotel-sheraton"),
  stop("hyatt", "addis-hotel-hyatt"),
  stop("skylight", "addis-hotel-skylight"),
  stop("radisson", "addis-hotel-radisson"),
  stop("hilton", "addis-hotel-hilton"),
  stop("marriottExec", "addis-hotel-marriott-executive"),
  stop("goldenTulip", "addis-hotel-golden-tulip"),
  stop("capital", "addis-hotel-capital"),
  stop("bestWestern", "addis-hotel-best-western"),
  stop("grandPalace", "addis-hotel-grand-palace"),
];

const budgetStayStops = [
  stop("madVervet", "addis-budget-mad-vervet"),
  stop("newSilk", "addis-budget-new-silk"),
  stop("simple", "addis-budget-simple"),
  stop("wib", "addis-budget-wib"),
  stop("daylin", "addis-budget-daylin"),
  stop("hammer", "addis-budget-hammer"),
  stop("ecco", "addis-budget-ecco"),
  stop("abat", "addis-budget-abat"),
  stop("brighton", "addis-budget-brighton"),
  stop("fbk", "addis-budget-fbk"),
];

const casualNightlifeStops = [
  extraStop("fendika", "addis-night-fendika"),
  extraStop("africanJazz", "addis-night-african-jazz"),
  extraStop("gaslight", "addis-night-gaslight"),
  stop("yod", "addis-night-yod", {
    venueKind: "nightlife",
    nightlifeType: "live_music_venue",
    musicGenres: ["Traditional Ethiopian", "Regional dance"],
    attributeTags: [
      "live_music",
      "cultural_performance",
      "group_friendly",
      "lively_nightlife",
    ],
  }),
  stop("habesha2000", "addis-night-2000-habesha", {
    venueKind: "nightlife",
    nightlifeType: "live_music_venue",
    musicGenres: ["Traditional Ethiopian", "Regional dance"],
    attributeTags: [
      "live_music",
      "cultural_performance",
      "group_friendly",
      "lively_nightlife",
    ],
  }),
  extraStop("mamas", "addis-night-mamas"),
  extraStop("gazebo", "addis-night-gazebo"),
  extraStop("berlin", "addis-night-berlin"),
  extraStop("velvet", "addis-night-velvet"),
  extraStop("moodz", "addis-night-moodz"),
];

const cocktailStops = [
  extraStop("stanleys", "addis-cocktail-stanleys"),
  extraStop("cascara", "addis-cocktail-cascara"),
  extraStop("signature", "addis-cocktail-signature"),
  extraStop("terrace", "addis-cocktail-terrace"),
  extraStop("velvet", "addis-cocktail-velvet"),
  extraStop("blackRose", "addis-cocktail-black-rose"),
  extraStop("berlin", "addis-cocktail-berlin", {
    nightlifeType: "cocktail_bar",
  }),
  extraStop("table5", "addis-cocktail-table-5"),
  stop("hotto", "addis-cocktail-hotto", {
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    musicGenres: ["Lounge"],
    attributeTags: [
      "cocktails",
      "design",
      "date_night",
      "reservation_recommended",
    ],
  }),
  stop("marcus", "addis-cocktail-marcus", {
    venueKind: "nightlife",
    nightlifeType: "rooftop_bar",
    musicGenres: ["DJ sets", "Lounge"],
    attributeTags: [
      "cocktails",
      "rooftop",
      "scenic_nightlife",
      "premium_drinks",
    ],
  }),
];

const cultureStops = [
  cultureStop("nationalMuseum", "addis-culture-national-museum"),
  cultureStop("ethnological", "addis-culture-ethnological"),
  cultureStop("redTerror", "addis-culture-red-terror"),
  cultureStop("holyTrinity", "addis-culture-holy-trinity"),
  cultureStop("stGeorge", "addis-culture-st-george"),
  cultureStop("addisMuseum", "addis-culture-city-museum"),
  cultureStop("zoma", "addis-culture-zoma"),
  cultureStop("adwa", "addis-culture-adwa"),
  cultureStop("unityPark", "addis-culture-unity-park"),
  cultureStop("scienceMuseum", "addis-culture-science-museum"),
];

const activityStops = [
  cultureStop("nationalMuseum", "addis-activity-national-museum"),
  cultureStop("ethnological", "addis-activity-ethnological"),
  cultureStop("unityPark", "addis-activity-unity-park"),
  cultureStop("adwa", "addis-activity-adwa"),
  cultureStop("entoto", "addis-activity-entoto"),
  cultureStop("zoma", "addis-activity-zoma"),
  stop("tomoca", "addis-activity-tomoca", {
    description:
      "Use Tomoca's Piazza counter as a short tasting lesson in Ethiopian coffee: order a macchiato and a straight brew, watch the fast local rhythm, and compare how the roast reads in each.",
  }),
  extraStop("fendika", "addis-activity-fendika", {
    description:
      "Plan Fendika as a performance rather than a bar stop: choose a dated Wednesday, Thursday, or Friday program, arrive for the 7:00 PM doors, and leave room for the spontaneous exchanges around the stage.",
  }),
  cultureStop("mercato", "addis-activity-mercato"),
  cultureStop("holyTrinity", "addis-activity-holy-trinity"),
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
    url: maps(`${title} Addis Ababa Ethiopia`),
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
    sources: guideSources,
  };
}

export const addisAbabaCitywideGuides: MapList[] = [
  guide(
    "Food",
    "list-addis-ababa-dining",
    "addis-ababa-best-restaurants",
    "best-restaurants",
    "Addis Ababa Restaurants with a Point of View",
    "Ten kitchens that explain the capital through regional Ethiopian cooking, coffee, long-running Italian rooms, contemporary African ambition, Japanese technique, French bistro work, and serious neighborhood value.",
    diningStops,
    sourcesFor(
      diningStops,
      source("Selamta Addis Ababa guide", restaurantEditorial),
    ),
    "Best Restaurants in Addis Ababa for Ethiopian Food and Destination Dining",
    "A current, source-backed Addis Ababa restaurant guide to Yod, Kategna, 2000 Habesha, Marcus Addis, Hotto, Castelli, and other tables worth planning around.",
  ),
  guide(
    "Food",
    "list-addis-ababa-cheap-eats",
    "addis-ababa-best-cheap-eats",
    "best-cheap-eats",
    "Addis Ababa Value: Coffee, Pizza, Tibs, and Bakery Stops",
    "A practical spread of coffee counters, local burger and pizza rooms, bakeries, Ethiopian plates, breakfast cafes, and all-hours Bole options where modest budgets still buy character.",
    cheapEatStops,
    sourcesFor(
      cheapEatStops,
      source("Addis coffee, jazz, and food guide", foodEditorial),
    ),
    "Best Cheap Eats in Addis Ababa for Coffee, Ethiopian Food, and Quick Meals",
    "Ten current Addis Ababa value stops, including Tomoca, Ca'De Burger, Effoi, Wanofi, Ithiopica, Akkoo, Galani, and useful bakery breakfasts.",
  ),
  guide(
    "Stay",
    "list-addis-ababa-hotels",
    "addis-ababa-best-hotels",
    "best-hotels",
    "Addis Ababa Hotels for Landmark Stays and Smooth Arrivals",
    "A hotel-only guide spanning historic gardens, polished international brands, airport convenience, apartment-style space, dependable business bases, and newer suites across Bole and Kazanchis.",
    hotelStops,
    sourcesFor(
      hotelStops,
      source("Booking.com Addis Ababa hotel inventory", hotelEditorial),
    ),
    "Best Hotels in Addis Ababa for Luxury, Business, and Airport Access",
    "Compare ten source-checked Addis Ababa hotels, from Sheraton and Hyatt Regency to Ethiopian Skylight, Hilton, Radisson Blu, and strong Bole alternatives.",
  ),
  guide(
    "Stay",
    "list-addis-ababa-budget-stays",
    "addis-ababa-budget-stays",
    "budget-stays",
    "Addis Ababa Budget Stays: Dorms and Well-Rated Guesthouses",
    "Three verifiable dorm hostels plus seven clearly labeled guesthouses with strong recent feedback, useful Bole or Yeka locations, and rates that stay below the city's full-service hotel tier.",
    budgetStayStops,
    sourcesFor(
      budgetStayStops,
      source("Booking.com Addis Ababa guesthouse inventory", budgetEditorial),
    ),
    "Best Budget Stays in Addis Ababa: Hostels and Guesthouses",
    "A candid guide to Addis Ababa's limited dorm-hostel supply and seven well-rated private-room guesthouses, with room type, location, reception, and check-in tradeoffs.",
  ),
  guide(
    "Nightlife",
    "list-addis-ababa-live-nightlife",
    "addis-ababa-live-music-nightlife",
    "live-music-nightlife",
    "Addis Ababa after Dark: Ethio-Jazz, Dance, and Easy Drinks",
    "Ten evening options weighted toward the city's real strength: live Ethio-jazz and cultural performance, then hotel clubs, outdoor drinks, salsa sessions, and flexible Bole bars.",
    casualNightlifeStops,
    sourcesFor(
      casualNightlifeStops,
      source("Current Addis coffee, jazz, and food guide", nightlifeEditorial),
    ),
    "Best Nightlife in Addis Ababa for Ethio-Jazz, Live Music, and Dancing",
    "Plan an Addis Ababa night around Fendika, African Jazz Village, Yod, 2000 Habesha, Gaslight, Velvet, and lower-key outdoor drinks.",
  ),
  guide(
    "Nightlife",
    "list-addis-ababa-cocktails",
    "addis-ababa-best-cocktail-bars",
    "best-cocktail-bars",
    "Addis Ababa Cocktails: Hotel Classics and Newer Rooftops",
    "The city's more reliable mixed drinks concentrate in polished hotel bars and ambitious restaurant lounges; these ten choices balance technique, view, setting, late hours, and price honestly.",
    cocktailStops,
    sourcesFor(
      cocktailStops,
      source("Addis nightlife and dining guide", nightlifeEditorial),
    ),
    "Best Cocktail Bars in Addis Ababa for Rooftops, Classics, and Nightcaps",
    "A source-checked cocktail guide to Stanley's, Cascara, Signature, The Terrace, Velvet, Black Rose, Marcus Addis, Hotto, Berlin, and Table 5.",
  ),
  guide(
    "Culture",
    "list-addis-ababa-culture",
    "addis-ababa-best-museums-culture",
    "best-museums-culture",
    "Addis Ababa Culture from Lucy to Contemporary Art",
    "Ten institutions and monuments that connect early humanity, Orthodox art, imperial power, the Red Terror, Adwa, contemporary practice, urban history, and Ethiopia's technology ambitions.",
    cultureStops,
    sourcesFor(
      cultureStops,
      source("Discover Addis museums and destinations", cultureEditorial),
    ),
    "Best Museums and Cultural Sites in Addis Ababa",
    "Visit Addis Ababa's National and Ethnological museums, Red Terror memorial, cathedrals, Zoma, Adwa memorial, Unity Park, city museum, and Science Museum.",
  ),
  guide(
    "Activities",
    "list-addis-ababa-activities",
    "addis-ababa-best-things-to-do",
    "best-things-to-do",
    "Ten Addis Ababa Experiences Worth Structuring a Day Around",
    "A first-visit plan built from essential museums, palace grounds, highland walking, contemporary architecture, coffee, live performance, Mercato, and active religious heritage rather than checklist sightseeing.",
    activityStops,
    sourcesFor(
      activityStops,
      source("Visit Ethiopia Addis Ababa destination page", tourism),
    ),
    "Best Things to Do in Addis Ababa: Museums, Coffee, Music, and Entoto",
    "Ten source-backed Addis Ababa activities spanning Lucy, the Ethnological Museum, Unity Park, Adwa, Entoto, Zoma, Tomoca, Fendika, Mercato, and Holy Trinity.",
  ),
];
