import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

const createdAt = "2026-06-05T00:00:00.000Z";
const checkedAt = "2026-06-05";

const bangkokLocation = {
  city: "Bangkok",
  country: "Thailand",
  continent: "Asia",
  scope: "city" as const,
};

const categoryColors: Record<ListCategory, string> = {
  Food: "0f766e",
  Nightlife: "7c3aed",
  Nature: "15803d",
  Culture: "b45309",
  Stay: "0369a1",
  Activities: "be123c",
  Routes: "475569",
  Essentials: "475569",
};

function avatar(category: ListCategory) {
  const fill = categoryColors[category] ?? "475569";
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

function commons(fileName: string) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=1600`;
}

const images = {
  sorn: "https://www.theworlds50best.com/discovery/filestore/jpg/Sorn-Bangkok-Thailand-03.jpg",
  gaggan: "https://gaggan.com/wp-content/uploads/2023/09/Menu-1920x756-1-1.png",
  leDu: "https://www.ledubkk.com/assets/img/temp/about-chef.webp",
  thipsamai: commons("Thipsamai (September 2016).jpeg"),
  pier21: commons("Terminal 21 Asok.jpg"),
  orTorKor: commons("Thai mango (yellow).jpg"),
  mandarinOriental: commons("Hotel The Oriental Bangkok.JPG"),
  capella: "https://capellahotels.com/assets/img/site_images/bangkok/Capella-Bangkok-Top-01.jpg",
  theSiam: commons("TheSiam7.jpg"),
  lubD: "https://th-bangkok.com/data/Photos/OriginalPhoto/17583/1758323/1758323008.JPEG",
  theYard: "https://cdn.prod.website-files.com/62f5bf7bfc22850018b36726/62fb4348762c660a52475e86_Private%20Loft%20Room%20at%20the%20Yard%20Bangkok-1.jpg",
  onceAgain: "https://onceagainhostel.co/images/banner.jpg",
  tepBar: "https://siam2nite.media/8hvBduOpKy2yq8S_OhS_NyCHC5k=/locations/2532/meta_29fe0d16668fccb84b0c3a21e7f9f340.jpg",
  saxophone: "https://siam2nite.media/ae17mfgOLB7XXmrLYG_Qqyq27dk=/locations/524/meta_ccb41c7b3ba1124a74a8738caf165964.jpg",
  mikkeller: "https://siam2nite.media/AYIrpH2l3AQ2-jI-3tr37LoaLvQ=/locations/965/meta_c267694d4dddb77b6faca131d6a9a42c.jpg",
  bkkSocialClub: "https://arewabxlefttuhzucoxx.supabase.co/storage/v1/object/public/bar_attachments/0e773d31-000b-4e1e-af2a-66a9d89ca6c4/BKK-Social-Club-Interior.jpg",
  barUs: "https://arewabxlefttuhzucoxx.supabase.co/storage/v1/object/public/bar_attachments/b2138a31-d3aa-4bb0-a772-cfa152b8712c/Bar%20Us%20team.jpg",
  vesper: "https://arewabxlefttuhzucoxx.supabase.co/storage/v1/object/public/bar_attachments/bfcfb714-2c3c-487d-8b4e-b65d3b92f36d/vesper-bar.jpg",
  grandPalace: commons("Grand Palace Bangkok.jpg"),
  watPho: commons("Wat Pho (Temple of the Reclining Buddha, Bangkok) 02.jpg"),
  watArun: commons("Wat Arun (Temple Of Dawn).jpg"),
  jimThompson: commons("Jim Thompson House Bangkok P1110303.JPG"),
  moca: commons("Museum of Contemporary Art (MOCA), Bangkok, Thailand - 20161201-08.jpg"),
  chatuchak: commons("Chatuchak Weekend Market.jpg"),
  lumphini: commons("Lumphini Park, Bangkok.jpg"),
  chaoPhraya: commons("Bangkok, Chao Phraya Express Boat (6223565866).jpg"),
};

const sources = {
  dining: [
    source("Top organic result: MICHELIN Guide - Bangkok restaurants", "https://guide.michelin.com/en/bangkok-region/bangkok/restaurants"),
    source("Asia's 50 Best Restaurants 2026 Bangkok news", "https://www.theworlds50best.com/stories/News/asias-50-best-restaurants-2026-list-in-pictures.html"),
    source("Time Out Bangkok - best restaurants", "https://www.timeout.com/bangkok/restaurants/best-restaurants-in-bangkok"),
    source("Friday Bangkok - Sorn", "https://fridaybangkok.com/en/v/sorn"),
    source("Sorn official", "https://www.sornfinesouthern.com/"),
    source("MICHELIN Guide - Sorn", "https://guide.michelin.com/en/bangkok-region/bangkok/restaurant/sorn"),
    source("Gaggan official", "https://gaggan.com/"),
    source("MICHELIN Guide - Gaggan", "https://guide.michelin.com/en/bangkok-region/bangkok/restaurant/gaggan"),
    source("Le Du official", "https://www.ledubkk.com/"),
    source("MICHELIN Guide - Le Du", "https://guide.michelin.com/en/bangkok-region/bangkok/restaurant/le-du"),
    source("Google Maps - Bangkok fine dining", maps("best restaurants Bangkok Thailand")),
  ],
  cheapEats: [
    source("Top organic result: Time Out Bangkok - cheap eats", "https://www.timeout.com/bangkok/restaurants/best-cheap-eats-in-bangkok"),
    source("Thaiest - Terminal 21 Food Court Pier 21", "https://thaiest.com/thai-food/reviews/terminal-21-food-court-best-cheap-eats-in-bangkok"),
    source("Visit Thailand Today - Pier 21", "https://www.visitthailandtoday.com/restaurants/bangkok/pier-21"),
    source("Thipsamai official menu", "https://thipsamai.com/menu-padthai/?language=en"),
    source("Thipsamai official reservation", "https://thipsamai.com/open-table-reservation/"),
    source("Or Tor Kor Market - Friday Bangkok", "https://fridaybangkok.com/en/v/or-tor-kor-market"),
    source("The Finest Thai - Or Tor Kor Market guide", "https://www.thefinestthai.com/2026/04/16/or-tor-kor-market-bangkoks-finest-fresh-market-and-a-world-class-food-destination/"),
    source("Bangkok street food guide", "https://www.bangkok-travel-guide.com/food/bangkok-street-food/"),
    source("DineGuides - cheap eats Bangkok", "https://dineguides.com/bangkok/cheap-eats"),
    source("Google Maps - Bangkok cheap eats", maps("best cheap eats Bangkok Thailand")),
  ],
  hotels: [
    source("Top organic result: Conde Nast Traveler - best hotels Bangkok", "https://www.cntraveler.com/gallery/best-hotels-in-bangkok"),
    source("MICHELIN Guide - Bangkok hotels", "https://guide.michelin.com/us/en/hotels-stays/bangkok"),
    source("The World's 50 Best Hotels 2025", "https://www.theworlds50best.com/hotels/the-list.html"),
    source("Mandarin Oriental Bangkok official", "https://www.mandarinoriental.com/en/bangkok/chao-phraya-river"),
    source("Mandarin Oriental Bangkok stay", "https://www.mandarinoriental.com/en/bangkok/chao-phraya-river/stay"),
    source("Capella Bangkok official", "https://capellahotels.com/en/capella-bangkok"),
    source("Capella Bangkok factsheet", "https://capellahotels.com/assets/docs/bangkok/Capella_Bangkok_Resort_Factsheet.pdf"),
    source("The Siam official", "https://www.thesiamhotel.com/"),
    source("The Siam Conde Nast Traveler review", "https://www.cntraveler.com/hotels/bangkok/the-siam"),
    source("Google Travel - Bangkok hotels", "https://www.google.com/travel/hotels/Bangkok"),
  ],
  hostels: [
    source("Top organic result: Nomadic Matt - best hostels Bangkok", "https://www.nomadicmatt.com/travel-blogs/best-hostels-bangkok/"),
    source("Hostelworld - Bangkok hostels", "https://www.hostelworld.com/hostels/asia/thailand/bangkok/"),
    source("Lub d Bangkok Siam Hostelworld", "https://www.hostelworld.com/st/hostels/p/42690/lub-d-bangkok-siam/"),
    source("Lub d Bangkok Siam official", "https://lubd.com/destinations/bangkok-siam/"),
    source("The Yard Hostel official", "https://www.theyardhostels.com/bangkok"),
    source("The Yard directions", "https://www.theyardhostels.com/bangkok/directions"),
    source("Once Again Hostel official", "https://onceagainhostel.com/"),
    source("Once Again HostelsCentral", "https://www.hostelscentral.com/en/hostels/thailand/bangkok/once-again-hostel"),
    source("Hostelgeeks - Bangkok hostels", "https://hostelgeeks.com/best-hostels-bangkok/"),
    source("Google Travel - Bangkok hostels", "https://www.google.com/travel/hotels/Bangkok?q=hostels%20bangkok"),
  ],
  casualBars: [
    source("Top organic result: Time Out Bangkok - bars", "https://www.timeout.com/bangkok/bars/best-bars-in-bangkok"),
    source("Time Out Bangkok - Tep Bar", "https://www.timeout.com/bangkok/bars/tep-bar"),
    source("Siam2nite - Tep Bar", "https://www.siam2nite.com/en/locations/bars/tep-bar"),
    source("Tep Bar official social", "https://www.facebook.com/TEPBARBKK/"),
    source("Tripadvisor - Saxophone Pub", "https://www.tripadvisor.com/Restaurant_Review-g293916-d946573-Reviews-Saxophone_Pub-Bangkok.html"),
    source("Siam2nite - Saxophone Pub", "https://www.siam2nite.com/en/locations/bars/saxophone-pub-and-restaurant"),
    source("Saxophone Pub official", "http://www.saxophonepub.com/"),
    source("Mikkeller Bar Bangkok official", "https://www.mikkeller.com/locations/mikkeller-bar-bangkok"),
    source("Time Out Bangkok - Mikkeller Bangkok", "https://www.timeout.com/bangkok/restaurants/mikkeller-bangkok"),
    source("Google Maps - Bangkok casual bars", maps("best casual bars Bangkok Thailand")),
  ],
  cocktails: [
    source("Top organic result: Asia's 50 Best Bars 2025", "https://www.theworlds50best.com/bars/asia/list/1-50"),
    source("The World's 50 Best Bars - BKK Social Club", "https://www.theworlds50best.com/bars/the-list/bkk-social-club.html"),
    source("Four Seasons - BKK Social Club", "https://www.fourseasons.com/bangkok/dining/lounges/bkk-social-club/"),
    source("Four Seasons press - BKK Social Club Asia's 50 Best", "https://press.fourseasons.com/bangkok/hotel-news/2025/asias-50-best-bars-bkk-social-club"),
    source("Asia's 50 Best Bars - Bar Us", "https://www.theworlds50best.com/bars/asia/the-list/bar-us.html"),
    source("Bar Us official", "https://www.us-bar.com/contact"),
    source("BK Magazine - Asia's 50 Best Bars 2025 Bangkok", "https://www.bkmagazine.com/nightlife/news/7-bangkok-bars-rank-asias-50-best-bars-2025-barus-and-dry-wave-earn-top-5-rankings"),
    source("Vesper official hours", "https://www.vesperbar.co/hours"),
    source("Falstaff - Vesper Cocktail Bar", "https://www.falstaff.com/en/bars/vesper-cocktail-bar"),
    source("Google Maps - Bangkok cocktail bars", maps("best cocktail bars Bangkok Thailand")),
  ],
  culture: [
    source("Top organic result: Time Out - best things to do Bangkok", "https://www.timeout.com/bangkok/things-to-do/best-things-to-do-in-bangkok"),
    source("Grand Palace official", "https://www.royalgrandpalace.th/en/home"),
    source("Grand Palace official practical information", "https://www.royalgrandpalace.th/en/visit/practical-information"),
    source("Wat Pho official visit plan", "https://www.watpho.com/en/contact/plan"),
    source("Wat Arun official", "https://www.wat-arun.com/home"),
    source("Jim Thompson House official", "https://jimthompsonhouse.org/"),
    source("MOCA Bangkok official contact", "https://www.mocabangkok.com/contact-us/"),
    source("MOCA Bangkok official admission", "https://www.mocabangkok.com/admission/"),
    source("Bangkok Travel Guide - temples", "https://www.bangkok-travel-guide.com/attractions/temples-in-bangkok/"),
    source("Google Maps - Bangkok museums temples", maps("best museums temples Bangkok Thailand")),
  ],
  activities: [
    source("Top organic result: Time Out - things to do Bangkok", "https://www.timeout.com/bangkok/things-to-do/best-things-to-do-in-bangkok"),
    source("Grand Palace official practical information", "https://www.royalgrandpalace.th/en/visit/practical-information"),
    source("Wat Pho official visit plan", "https://www.watpho.com/en/contact/plan"),
    source("Wat Arun official", "https://www.wat-arun.com/home"),
    source("Jim Thompson House official", "https://jimthompsonhouse.org/"),
    source("MOCA Bangkok official contact", "https://www.mocabangkok.com/contact-us/"),
    source("Chatuchak Weekend Market guide", "https://www.odynovotours.com/thailand/bangkok/chatuchak-weekend-market.html"),
    source("Lumphini Park Wikimedia/BMA operator reference", "https://commons.wikimedia.org/wiki/Category:Lumphini_Park"),
    source("Chao Phraya Tourist Boat official", "https://www.chaophrayatouristboat.com/tourist_boat"),
    source("Thaiest - Chao Phraya river boats timetable", "https://thaiest.com/thailand/bangkok/river-boats"),
    source("Google Maps - Bangkok things to do", maps("best things to do Bangkok Thailand")),
  ],
};

type StopInput = Partial<GuideStop> & {
  id: string;
  poiId: string;
  name: string;
  coordinates: [number, number];
  description: string;
  sourcePhoto?: string;
  officialUrl: string;
  mapQuery?: string;
  editorialUrls?: string[];
  platformUrls?: string[];
};

function stop(input: StopInput): GuideStop {
  const {
    id,
    poiId,
    name,
    coordinates,
    description,
    sourcePhoto,
    mapQuery,
    editorialUrls = [],
    platformUrls = [],
    sourceEvidence,
    imageSourceUrl,
    officialUrl,
    bookingUrl,
    ...rest
  } = input;
  const mapUrl = sourceEvidence?.mapUrl ?? maps(mapQuery ?? `${name} Bangkok Thailand`);
  const imageUrl = imageSourceUrl ?? sourcePhoto;
  const officialEvidence = sourceEvidence?.officialUrl ?? officialUrl ?? bookingUrl;
  const sourceUrls = [
    officialEvidence,
    mapUrl,
    imageUrl,
    ...editorialUrls,
    ...platformUrls,
    ...(input.sourceUrls ?? []),
  ].filter(Boolean) as string[];

  return {
    id,
    poiId,
    name,
    coordinates,
    description,
    photo: imageUrl,
    imageSourceUrl: imageUrl,
    sourceUrls: [...new Set(sourceUrls)],
    sourceEvidence: {
      officialUrl: officialEvidence,
      mapUrl,
      currentStatusUrl: mapUrl,
      imageSourceUrl: imageUrl,
      editorialUrls,
      platformUrls,
      checkedAt,
      notes: "Official/property page and Google Maps search/listing checked for current status; no permanent-closure warning found in the source set.",
      ...sourceEvidence,
    },
    officialUrl,
    ...(bookingUrl ? { bookingUrl } : {}),
    ...rest,
  };
}

const diningStops = [
  stop({
    id: "bangkok-dining-sorn",
    poiId: "bangkok-venue-sorn",
    name: "Sorn",
    coordinates: [13.7247, 100.5698],
    description:
      "Sorn is the Bangkok dinner to plan around when you want Southern Thai cooking treated with full ceremony rather than hotel gloss. Chef Ice's menu works through the south's heat, seafood, fermented notes, and old techniques in a quiet Sukhumvit house; the caveat is brutal but useful: reservations are the trip, not an afterthought.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["southern_thai", "thai", "tasting_menu"],
    price: "$$$$",
    priceSource: "Friday Bangkok / MICHELIN Guide",
    attributeTags: ["fine_dining", "tasting_menu", "reservation_required", "southern_thai"],
    hours: { default: "Mon-Fri and Sun 6:00 PM-10:00 PM; reservation calendar may control availability." },
    officialUrl: "https://www.sornfinesouthern.com/",
    bookingUrl: "https://www.tablecheck.com/en/sorn/reserve/message",
    sourcePhoto: images.sorn,
    editorialUrls: ["https://fridaybangkok.com/en/v/sorn", "https://guide.michelin.com/en/bangkok-region/bangkok/restaurant/sorn"],
  }),
  stop({
    id: "bangkok-dining-gaggan",
    poiId: "bangkok-venue-gaggan",
    name: "Gaggan",
    coordinates: [13.7376, 100.5679],
    description:
      "Gaggan belongs because Bangkok fine dining is not only reverent Thai heritage; it is also performance, mischief, and technical chaos made deliberate. The official site frames it as progressive Indian food theater, so book it when the group wants a long, loud, high-concept night rather than a quiet tasting-menu whisper.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["progressive_indian", "fine_dining", "tasting_menu"],
    price: "$$$$",
    priceSource: "Official booking / MICHELIN Guide",
    attributeTags: ["fine_dining", "theatrical", "reservation_required", "date_night"],
    hours: { default: "Thu-Mon dinner service; closed Tue-Wed. Check the official reservation calendar for seating times." },
    officialUrl: "https://gaggan.com/",
    bookingUrl: "https://gaggan.com/",
    sourcePhoto: images.gaggan,
    editorialUrls: ["https://guide.michelin.com/en/bangkok-region/bangkok/restaurant/gaggan", "https://www.theworlds50best.com/discovery/Establishments/Thailand/Bangkok/Gaggan.html"],
  }),
  stop({
    id: "bangkok-dining-le-du",
    poiId: "bangkok-venue-le-du",
    name: "Le Du",
    coordinates: [13.7252, 100.5292],
    description:
      "Le Du is the cleaner, ingredient-led counterweight to Bangkok's louder destination dinners. The official restaurant copy leans into Thai seasonality and local farms, and that is exactly why it works here: go for modern Thai cooking with structure, wine, and enough restraint to leave Silom still feeling like part of the night.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["modern_thai", "thai", "seasonal"],
    price: "$$$",
    priceSource: "Official restaurant site / MICHELIN Guide",
    attributeTags: ["fine_dining", "seasonal", "wine_pairing", "reservation_recommended"],
    hours: { default: "Dinner-focused tasting-menu service; verify current seating times on the official reservation page." },
    officialUrl: "https://www.ledubkk.com/",
    bookingUrl: "https://www.ledubkk.com/",
    sourcePhoto: images.leDu,
    editorialUrls: ["https://guide.michelin.com/en/bangkok-region/bangkok/restaurant/le-du", "https://www.timeout.com/bangkok/restaurants/le-du"],
  }),
];

const cheapEatsStops = [
  stop({
    id: "bangkok-cheap-thipsamai",
    poiId: "bangkok-venue-thipsamai",
    name: "Thipsamai",
    coordinates: [13.7527, 100.5048],
    description:
      "Thipsamai is famous enough to make cynics roll their eyes, but the original Maha Chai address still solves a real Bangkok problem: a focused pad thai stop near the old-city temple route. Order the shrimp-oil version if you want the house signature, and remember the official hours include a Tuesday closure.",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["pad_thai", "thai", "street_food"],
    price: "$$",
    priceSource: "Official menu / Google Maps",
    attributeTags: ["classic", "old_city", "queue_likely", "solo_friendly"],
    hours: { default: "Wed-Mon 9:00 AM-12:00 AM; closed Tue." },
    officialUrl: "https://thipsamai.com/menu-padthai/?language=en",
    sourcePhoto: images.thipsamai,
    editorialUrls: ["https://thipsamai.com/open-table-reservation/", "https://www.timeout.com/bangkok/restaurants/thipsamai"],
  }),
  stop({
    id: "bangkok-cheap-pier-21",
    poiId: "bangkok-venue-pier-21-terminal-21",
    name: "Pier 21 Food Court",
    coordinates: [13.7373, 100.5601],
    description:
      "Pier 21 is not romantic, and that is the point: it is Sukhumvit's clean, air-conditioned answer to cheap street-food pricing when heat or rain has beaten everyone down. Load the stored-value card, split up for boat noodles or rice plates, and avoid the lunch crush if you want a table without circling.",
    venueKind: "food_drink",
    foodServiceType: "cafeteria",
    cuisineTypes: ["thai", "food_court", "street_food"],
    price: "$",
    priceSource: "Thaiest / Visit Thailand Today",
    attributeTags: ["budget", "food_court", "rainy_day", "group_friendly"],
    hours: { default: "Daily 10:00 AM-10:00 PM; individual stalls can vary." },
    officialUrl: "https://www.terminal21.co.th/asok/",
    sourcePhoto: images.pier21,
    editorialUrls: ["https://thaiest.com/thai-food/reviews/terminal-21-food-court-best-cheap-eats-in-bangkok", "https://www.visitthailandtoday.com/restaurants/bangkok/pier-21"],
  }),
  stop({
    id: "bangkok-cheap-or-tor-kor",
    poiId: "bangkok-venue-or-tor-kor-market",
    name: "Or Tor Kor Market",
    coordinates: [13.7986, 100.5484],
    description:
      "Or Tor Kor is the market to use when you want Bangkok produce, curry trays, fruit, and snack stalls without the full weekend-market crush. It is cleaner and pricier than the roughest street-food lanes, but the quality and easy MRT access make it a smarter food stop than pretending every cheap meal has to be chaotic.",
    venueKind: "food_drink",
    foodServiceType: "stall",
    cuisineTypes: ["thai", "market", "street_food"],
    price: "$$",
    priceSource: "Friday Bangkok / The Finest Thai",
    attributeTags: ["market", "lunch", "fruit", "walk_in_friendly"],
    hours: { default: "Daily 6:00 AM-6:00 PM; food-court and individual stall hours can vary." },
    officialUrl: "https://www.facebook.com/ortorkormarket/",
    sourcePhoto: images.orTorKor,
    editorialUrls: ["https://fridaybangkok.com/en/v/or-tor-kor-market", "https://www.thefinestthai.com/2026/04/16/or-tor-kor-market-bangkoks-finest-fresh-market-and-a-world-class-food-destination/"],
  }),
];

const hotelStops = [
  stop({
    id: "bangkok-hotel-mandarin-oriental",
    poiId: "bangkok-venue-mandarin-oriental",
    name: "Mandarin Oriental, Bangkok",
    coordinates: [13.723, 100.5142],
    description:
      "Mandarin Oriental is the river grande dame for travelers who want Bangkok history to be part of the room, not just the lobby copy. The official hotel traces more than 150 years on the Chao Phraya, and the tradeoff is clear: you pay for ceremony, service, and river identity rather than new-build minimalism.",
    venueKind: "lodging",
    lodgingType: "hotel",
    price: "$$$$",
    priceSource: "Official hotel site / Google Travel",
    attributeTags: ["luxury", "historic", "riverfront", "service"],
    hours: { default: "Hotel operates daily with 24-hour front desk; check-in, check-out, dining, and spa hours vary by booking." },
    officialUrl: "https://www.mandarinoriental.com/en/bangkok/chao-phraya-river",
    bookingUrl: "https://www.mandarinoriental.com/en/bangkok/chao-phraya-river",
    sourcePhoto: images.mandarinOriental,
    editorialUrls: ["https://www.cntraveler.com/gallery/best-hotels-in-bangkok", "https://guide.michelin.com/us/en/hotels-stays/bangkok/mandarin-oriental-bangkok"],
  }),
  stop({
    id: "bangkok-hotel-capella",
    poiId: "bangkok-venue-capella-bangkok",
    name: "Capella Bangkok",
    coordinates: [13.7107, 100.5106],
    description:
      "Capella is Bangkok luxury with a lower, quieter pulse: 101 suites and villas facing the river instead of a tower trying to dominate it. It belongs in the hotel guide for travelers who want contemporary river calm, serious dining, and culturalist-style service, but the price only makes sense if the hotel is a central part of the trip.",
    venueKind: "lodging",
    lodgingType: "hotel",
    price: "$$$$",
    priceSource: "Official hotel site / World's 50 Best Hotels",
    attributeTags: ["luxury", "riverfront", "wellness", "design"],
    hours: { default: "Hotel operates daily with 24-hour guest services; check-in, check-out, dining, and spa schedules vary by booking." },
    officialUrl: "https://capellahotels.com/en/capella-bangkok",
    bookingUrl: "https://capellahotels.com/en/capella-bangkok",
    sourcePhoto: images.capella,
    editorialUrls: ["https://www.cntraveler.com/hotels/bangkok/capella-bangkok", "https://www.theworlds50best.com/hotels/the-list/capella-bangkok.html"],
  }),
  stop({
    id: "bangkok-hotel-the-siam",
    poiId: "bangkok-venue-the-siam",
    name: "The Siam",
    coordinates: [13.7792, 100.5057],
    description:
      "The Siam is the art-and-antiques hotel for travelers who would rather be in Dusit's slower river mood than in the Sukhumvit machine. The rooms and villas feel like a private collection turned into a stay; book it when boat transfers, spa time, and quiet are assets, not inconveniences.",
    venueKind: "lodging",
    lodgingType: "hotel",
    price: "$$$$",
    priceSource: "Official hotel site / Conde Nast Traveler",
    attributeTags: ["luxury", "boutique", "riverfront", "quiet"],
    hours: { default: "Hotel operates daily with guest services; check-in, check-out, dining, spa, and shuttle schedules vary by booking." },
    officialUrl: "https://www.thesiamhotel.com/",
    bookingUrl: "https://www.thesiamhotel.com/",
    sourcePhoto: images.theSiam,
    editorialUrls: ["https://www.cntraveler.com/hotels/bangkok/the-siam", "https://www.cntraveller.com/hotels/the-siam-bangkok"],
  }),
];

const hostelStops = [
  stop({
    id: "bangkok-hostel-lub-d-siam",
    poiId: "bangkok-venue-lub-d-siam",
    name: "Lub d Bangkok Siam",
    coordinates: [13.7466, 100.5297],
    description:
      "Lub d Bangkok Siam is the hostel pick when transit and first-day orientation matter more than Khao San mythology. It sits by National Stadium and the shopping core, with private rooms, dorms, and 24-hour reception evidence on platform listings; use it for easy BTS movement rather than a quiet retreat.",
    venueKind: "lodging",
    lodgingType: "hostel",
    price: "$$",
    priceSource: "Hostelworld / booking platforms",
    attributeTags: ["budget", "central", "social", "transit"],
    hours: { default: "Hostel operates daily with 24-hour reception; check-in is generally from 2:00 PM and check-out by noon on platform listings." },
    officialUrl: "https://lubd.com/destinations/bangkok-siam/",
    bookingUrl: "https://www.hostelworld.com/st/hostels/p/42690/lub-d-bangkok-siam/",
    sourcePhoto: images.lubD,
    editorialUrls: ["https://www.nomadicmatt.com/travel-blogs/best-hostels-bangkok/", "https://www.hostelworld.com/st/hostels/p/42690/lub-d-bangkok-siam/"],
  }),
  stop({
    id: "bangkok-hostel-the-yard",
    poiId: "bangkok-venue-the-yard-hostel",
    name: "The Yard Bangkok",
    coordinates: [13.7805, 100.5421],
    description:
      "The Yard is the Ari hostel for people who want green space, bikes, coffee, and a social yard instead of a bunk bed beside a party strip. It earns the guide slot because it gives Bangkok's backpacker stay a neighborhood rhythm; confirm late arrival with the hostel if your flight lands after normal reception hours.",
    venueKind: "lodging",
    lodgingType: "hostel",
    price: "$$",
    priceSource: "Official hostel site / Hostelworld",
    attributeTags: ["budget", "social", "eco", "ari"],
    hours: { default: "Arrival and reception details vary by booking; confirm check-in and late-arrival instructions with the property before travel." },
    officialUrl: "https://www.theyardhostels.com/bangkok",
    bookingUrl: "https://www.hostelworld.com/",
    sourcePhoto: images.theYard,
    editorialUrls: ["https://www.nomadicmatt.com/travel-blogs/best-hostels-bangkok/", "https://www.theyardhostels.com/bangkok/directions"],
  }),
  stop({
    id: "bangkok-hostel-once-again",
    poiId: "bangkok-venue-once-again-hostel",
    name: "Once Again Hostel",
    coordinates: [13.7526, 100.5012],
    description:
      "Once Again Hostel works when the plan is Old City temples by day and a calmer roof or cafe reset at night. Platform evidence lists 24/7 reception and check-in from 2:00 PM to midnight, which makes it practical for late arrivals; the caveat is that the old-city location is less BTS-friendly than Siam or Sukhumvit.",
    venueKind: "lodging",
    lodgingType: "hostel",
    price: "$",
    priceSource: "HostelsCentral / booking platforms",
    attributeTags: ["budget", "old_city", "rooftop", "temple_route"],
    hours: { default: "Reception listed as 24/7; check-in from 2:00 PM to midnight and check-out before 11:00 AM on HostelsCentral." },
    officialUrl: "https://onceagainhostel.com/",
    bookingUrl: "https://www.hostelscentral.com/en/hostels/thailand/bangkok/once-again-hostel",
    sourcePhoto: images.onceAgain,
    editorialUrls: ["https://www.hostelscentral.com/en/hostels/thailand/bangkok/once-again-hostel", "https://www.hostelworld.com/hostels/asia/thailand/bangkok/"],
  }),
];

const casualBarStops = [
  stop({
    id: "bangkok-casual-tep-bar",
    poiId: "bangkok-venue-tep-bar",
    name: "Tep Bar",
    coordinates: [13.7394, 100.5137],
    description:
      "Tep Bar is the casual-nightlife stop with a Thai identity rather than another imported pub template. Time Out points to Thai spirits, herbal drinks, and live semi-traditional music that turns louder after about 10:00 PM; go early for conversation or late when Chinatown wants to sing back.",
    venueKind: "nightlife",
    nightlifeType: "dive_bar",
    musicGenres: ["thai_traditional", "live_music"],
    price: "$$",
    priceSource: "Time Out Bangkok / Siam2nite",
    attributeTags: ["live_music", "chinatown", "casual", "local_spirits"],
    hours: { default: "Mon-Thu 6:00 PM-12:00 AM; Fri 6:00 PM-1:00 AM; Sat 5:00 PM-1:00 AM; Sun 5:00 PM-12:00 AM." },
    officialUrl: "https://www.facebook.com/TEPBARBKK/",
    sourcePhoto: images.tepBar,
    editorialUrls: ["https://www.timeout.com/bangkok/bars/tep-bar", "https://www.siam2nite.com/en/locations/bars/tep-bar"],
  }),
  stop({
    id: "bangkok-casual-saxophone",
    poiId: "bangkok-venue-saxophone-pub",
    name: "Saxophone Pub",
    coordinates: [13.7625, 100.5376],
    description:
      "Saxophone Pub is the Victory Monument room for live music without rooftop preening. The long-running pub has jazz, blues, Thai food, and a crowd that actually came for the stage; it is best when you want Bangkok's night to feel played by humans, not mixed by a hotel playlist.",
    venueKind: "nightlife",
    nightlifeType: "live_music_venue",
    musicGenres: ["jazz", "blues", "rock"],
    price: "$$",
    priceSource: "Tripadvisor / Siam2nite",
    attributeTags: ["live_music", "pub", "late_night", "casual"],
    hours: { default: "Daily 6:00 PM-1:30 AM or later; band schedules can vary." },
    officialUrl: "http://www.saxophonepub.com/",
    sourcePhoto: images.saxophone,
    editorialUrls: ["https://www.tripadvisor.com/Restaurant_Review-g293916-d946573-Reviews-Saxophone_Pub-Bangkok.html", "https://www.siam2nite.com/en/locations/bars/saxophone-pub-and-restaurant"],
  }),
  stop({
    id: "bangkok-casual-mikkeller",
    poiId: "bangkok-venue-mikkeller-bangkok",
    name: "Mikkeller Bar Bangkok",
    coordinates: [13.7264, 100.5883],
    description:
      "Mikkeller is the Ekkamai craft-beer yard when a night needs conversation, hops, and a little distance from the main Sukhumvit churn. The official location sits on a quiet side street off Ekkamai Road, so plan the ride rather than assuming a quick stumble from BTS; the reward is a more relaxed drinking session.",
    venueKind: "nightlife",
    nightlifeType: "beer_bar",
    price: "$$",
    priceSource: "Official Mikkeller page / Google Maps",
    attributeTags: ["craft_beer", "garden", "casual", "ekkamai"],
    hours: { default: "Opening hours vary by day and event; verify the official Mikkeller location page or Google Maps before going." },
    officialUrl: "https://www.mikkeller.com/locations/mikkeller-bar-bangkok",
    sourcePhoto: images.mikkeller,
    editorialUrls: ["https://www.timeout.com/bangkok/restaurants/mikkeller-bangkok", "https://www.tripadvisor.com/Restaurant_Review-g293916-d6153980-Reviews-Mikkeller_Bangkok-Bangkok.html"],
  }),
];

const cocktailStops = [
  stop({
    id: "bangkok-cocktail-bkk-social-club",
    poiId: "bangkok-venue-bkk-social-club",
    name: "BKK Social Club",
    coordinates: [13.7105, 100.5106],
    description:
      "BKK Social Club is the polished hotel-bar benchmark, and the official Four Seasons page backs the useful details: daily evening hours, smart-casual dress, and a 20-plus age rule. It belongs here because the Mexico City-inspired menu and 50 Best recognition make the price feel intentional, not just expensive.",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    price: "$$$$",
    priceSource: "Four Seasons official / World's 50 Best Bars",
    attributeTags: ["hotel_bar", "award_winning", "reservation_recommended", "dressy"],
    hours: { default: "Daily 5:00 PM-12:00 AM; smart-casual dress and 20+ minimum age." },
    officialUrl: "https://www.fourseasons.com/bangkok/dining/lounges/bkk-social-club/",
    sourcePhoto: images.bkkSocialClub,
    editorialUrls: ["https://www.theworlds50best.com/bars/the-list/bkk-social-club.html", "https://press.fourseasons.com/bangkok/hotel-news/2025/asias-50-best-bars-bkk-social-club"],
  }),
  stop({
    id: "bangkok-cocktail-bar-us",
    poiId: "bangkok-venue-bar-us",
    name: "Bar Us",
    coordinates: [13.725, 100.5686],
    description:
      "Bar Us is the cocktail room for people who want Bangkok's drinking scene to feel experimental without losing hospitality. Asia's 50 Best named it Thailand's best bar in 2025, and the official hours show a controlled evening window; reserve when you care where the night lands.",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    price: "$$$",
    priceSource: "Bar Us official / Asia's 50 Best Bars",
    attributeTags: ["award_winning", "experimental", "reservation_recommended", "date_night"],
    hours: { default: "Sun-Thu 6:00 PM-12:00 AM; Fri-Sat 6:00 PM onwards." },
    officialUrl: "https://www.us-bar.com/contact",
    sourcePhoto: images.barUs,
    editorialUrls: ["https://www.theworlds50best.com/bars/asia/the-list/bar-us.html", "https://www.bkmagazine.com/nightlife/news/7-bangkok-bars-rank-asias-50-best-bars-2025-barus-and-dry-wave-earn-top-5-rankings"],
  }),
  stop({
    id: "bangkok-cocktail-vesper",
    poiId: "bangkok-venue-vesper",
    name: "Vesper",
    coordinates: [13.7285, 100.5334],
    description:
      "Vesper is the Silom cocktail staple to use when the plan needs competence, location, and less ceremony than the big hotel rooms. Current listings show daily evening service, with Sunday closing earlier than the rest of the week; it is a strong first or last drink around Convent Road and Sala Daeng.",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    price: "$$$",
    priceSource: "Official hours / Falstaff",
    attributeTags: ["cocktails", "silom", "date_night", "award_winning"],
    hours: { default: "Mon-Sat 6:00 PM-1:00 AM; Sun 6:00 PM-12:00 AM." },
    officialUrl: "https://www.vesperbar.co/hours",
    sourcePhoto: images.vesper,
    editorialUrls: ["https://www.falstaff.com/en/bars/vesper-cocktail-bar", "https://www.timeout.com/bangkok/bars/vesper"],
  }),
];

const cultureStops = [
  stop({
    id: "bangkok-culture-grand-palace",
    poiId: "bangkok-venue-grand-palace",
    name: "The Grand Palace and Wat Phra Kaew",
    coordinates: [13.7501, 100.4915],
    description:
      "The Grand Palace is Bangkok's royal-civic overload: gold, mirrored mosaics, state architecture, and Wat Phra Kaew in one high-friction compound. The official site confirms ticketing, dress rules, and daily hours, so the practical move is simple: arrive early, dress correctly, and ignore anyone outside telling you it is closed.",
    venueKind: "landmark",
    subcategory: "palace_temple",
    attributeTags: ["historic_site", "ticketed", "dress_code", "old_city"],
    hours: { default: "Daily 8:30 AM-4:30 PM; tickets sold 8:30 AM-3:30 PM; royal ceremonies can affect access." },
    officialUrl: "https://www.royalgrandpalace.th/en/visit/practical-information",
    sourcePhoto: images.grandPalace,
    editorialUrls: ["https://www.royalgrandpalace.th/en/home", "https://www.bangkok-travel-guide.com/guide/wat-phra-kaew-guide/"],
  }),
  stop({
    id: "bangkok-culture-wat-pho",
    poiId: "bangkok-venue-wat-pho",
    name: "Wat Pho",
    coordinates: [13.7465, 100.493],
    description:
      "Wat Pho is the old-city stop that rewards slowing down after the Grand Palace glare. The reclining Buddha is the headline, but the inscriptions, courtyards, and massage-school history make it more than a photo queue; dress respectfully and leave time for the temple to breathe.",
    venueKind: "culture",
    subcategory: "temple",
    attributeTags: ["temple", "historic_site", "ticketed", "old_city"],
    hours: { default: "Daily 8:00 AM-7:30 PM; Thai massage service follows posted temple-school hours." },
    officialUrl: "https://www.watpho.com/en/contact/plan",
    sourcePhoto: images.watPho,
    editorialUrls: ["https://www.bangkok-travel-guide.com/guide/wat-pho-guide/", "https://commons.wikimedia.org/wiki/File:Wat_Pho_(Temple_of_the_Reclining_Buddha,_Bangkok)_02.jpg"],
  }),
  stop({
    id: "bangkok-culture-wat-arun",
    poiId: "bangkok-venue-wat-arun",
    name: "Wat Arun",
    coordinates: [13.7437, 100.4889],
    description:
      "Wat Arun changes the old-city route by putting you across the river, where porcelain, steep prang lines, and Chao Phraya air cut through temple fatigue. The official visitor page lists daily daytime hours and a dress code; go by ferry and think about light, not only checklist order.",
    venueKind: "culture",
    subcategory: "temple",
    attributeTags: ["temple", "riverfront", "ticketed", "viewpoint"],
    hours: { default: "Daily 8:00 AM-6:00 PM; ticketed temple areas and photography rules can vary." },
    officialUrl: "https://www.wat-arun.com/home",
    sourcePhoto: images.watArun,
    editorialUrls: ["https://www.bangkok-travel-guide.com/attractions/temples-in-bangkok/", "https://commons.wikimedia.org/wiki/File:Wat_Arun_(Temple_Of_Dawn).jpg"],
  }),
  stop({
    id: "bangkok-culture-jim-thompson-house",
    poiId: "bangkok-venue-jim-thompson-house",
    name: "Jim Thompson House Museum",
    coordinates: [13.7492, 100.5284],
    description:
      "Jim Thompson House gives Bangkok culture a domestic scale: teak houses, silk-industry history, and an Asian art collection set inside garden shade near Siam. The official site requires guided entry to the main house, which is a good thing; it keeps the visit focused instead of becoming another overheated wander.",
    venueKind: "culture",
    subcategory: "museum",
    attributeTags: ["museum", "guided_tour", "art", "siam"],
    hours: { default: "Daily 10:00 AM-5:00 PM; last guided tour at 5:00 PM." },
    officialUrl: "https://jimthompsonhouse.org/",
    sourcePhoto: images.jimThompson,
    editorialUrls: ["https://commons.wikimedia.org/wiki/File:Jim_Thompson_House_Bangkok_P1110303.JPG", "https://www.timeout.com/bangkok/museums/jim-thompson-house"],
  }),
  stop({
    id: "bangkok-culture-moca",
    poiId: "bangkok-venue-moca-bangkok",
    name: "MOCA Bangkok",
    coordinates: [13.8523, 100.5631],
    description:
      "MOCA Bangkok is the deliberate half-day museum for repeat visitors or anyone who wants Thai modern and contemporary work away from the old-city temple axis. The location is less effortless than Siam or Rattanakosin, but the official hours and quieter galleries make it a strong heat-escape culture stop.",
    venueKind: "culture",
    subcategory: "museum",
    attributeTags: ["museum", "contemporary_art", "rainy_day", "quiet"],
    hours: { default: "Tue-Sun 10:00 AM-6:00 PM; closed Mon." },
    officialUrl: "https://www.mocabangkok.com/contact-us/",
    sourcePhoto: images.moca,
    editorialUrls: ["https://www.mocabangkok.com/admission/", "https://www.thefinestthai.com/2026/05/08/moca-bangkok-museum-guide/"],
  }),
];

const activityStops = [
  stop({
    ...cultureStops[0],
    id: "bangkok-activity-grand-palace",
    description:
      "Start with the Grand Palace when the day is still cooler, because this compound punishes casual pacing. The official visitor page makes the rules plain: dress correctly, buy through the official channel or gate, and build the morning around the ticket window instead of listening to sidewalk closure stories.",
  }),
  stop({
    ...cultureStops[1],
    id: "bangkok-activity-wat-pho",
    description:
      "Wat Pho is the best second old-city stop because it gives the route a lower, more human pulse after the palace. The reclining Buddha is only one part of the case; the courtyards, inscriptions, and massage-school context make it worth lingering before crossing toward the river.",
  }),
  stop({
    ...cultureStops[2],
    id: "bangkok-activity-wat-arun",
    description:
      "Crossing to Wat Arun turns sightseeing into geography: ferry, river, porcelain tower, and the old city seen from another bank. Use the official daytime hours and dress guidance, then time the visit for morning clarity or late light rather than baking on the steps at noon.",
  }),
  stop({
    ...cheapEatsStops[0],
    id: "bangkok-activity-thipsamai",
    description:
      "Thipsamai is useful in a top-things route because it gives the old-city evening a food anchor with clear official hours and a known dish. It is famous, crowded, and no longer cheap in the romantic street-food sense, but the shrimp-oil pad thai still makes sense after temples.",
  }),
  stop({
    ...cultureStops[3],
    id: "bangkok-activity-jim-thompson-house",
    description:
      "Jim Thompson House belongs in the ten because it changes the texture of a Bangkok day: shade, teak, silk history, and a guided museum rhythm near Siam. Use it between shopping or transit-heavy stops, and do not expect to self-wander the main house without the official tour structure.",
  }),
  stop({
    ...cultureStops[4],
    id: "bangkok-activity-moca",
    description:
      "MOCA Bangkok is the art stop for travelers who have already seen the obvious temple loop or need an indoor reset. It sits away from the easiest tourist corridors, so treat it as a planned half-day with the official Tuesday-Sunday hours rather than a quick detour.",
  }),
  stop({
    id: "bangkok-activity-chatuchak",
    poiId: "bangkok-venue-chatuchak-weekend-market",
    name: "Chatuchak Weekend Market",
    coordinates: [13.7999, 100.5501],
    description:
      "Chatuchak is Bangkok retail as endurance sport: dense lanes, heat, bargaining, snacks, vintage, housewares, and more decision fatigue than a spreadsheet can solve. Go early on Saturday or Sunday, carry cash and water, and understand that weekday openings are partial rather than the full market spectacle.",
    venueKind: "retail",
    subcategory: "market",
    attributeTags: ["market", "shopping", "street_food", "weekend"],
    hours: { default: "Main market Sat-Sun 9:00 AM-6:00 PM; Friday evening wholesale and weekday plant sections vary." },
    officialUrl: "https://www.facebook.com/chatuchakweekendmarket1",
    sourcePhoto: images.chatuchak,
    editorialUrls: ["https://www.odynovotours.com/thailand/bangkok/chatuchak-weekend-market.html", "https://www.thaiholidayguide.com/attraction/chatuchak-weekend-market/"],
  }),
  stop({
    id: "bangkok-activity-lumphini",
    poiId: "bangkok-venue-lumphini-park",
    name: "Lumphini Park",
    coordinates: [13.7313, 100.5418],
    description:
      "Lumphini Park is the necessary green reset in a city that can make every hour feel paved and amplified. Use it early for walkers, monitor-lizard sightings, and shade before the heat rises; facilities, events, and gates can vary, so verify current park access before a late visit.",
    venueKind: "outdoors",
    subcategory: "park",
    attributeTags: ["park", "morning", "walking_route", "free_entry"],
    hours: { default: "Park access is generally daily daytime to evening; verify current BMA/Google Maps hours before a late visit." },
    officialUrl: "https://www.bangkok.go.th/",
    sourcePhoto: images.lumphini,
    editorialUrls: ["https://commons.wikimedia.org/wiki/Category:Lumphini_Park", "https://en.wikipedia.org/wiki/Lumphini_Park"],
  }),
  stop({
    id: "bangkok-activity-chao-phraya-tourist-boat",
    poiId: "bangkok-venue-chao-phraya-tourist-boat",
    name: "Chao Phraya Tourist Boat",
    coordinates: [13.7187, 100.5143],
    description:
      "The Chao Phraya Tourist Boat turns Bangkok's river from backdrop into transit, linking Sathorn, ICONSIAM, Chinatown, Wat Arun, Tha Tien, Tha Chang, and Phra Arthit without fighting road traffic. Check the official timetable before building the day, because boat frequency and last departures matter more than ambition.",
    venueKind: "transport",
    subcategory: "river_boat",
    attributeTags: ["riverfront", "transit", "sightseeing", "ticketed_activity"],
    hours: { default: "Boats generally run daily with departures about every 30 minutes; verify the official timetable for current first and last boats." },
    officialUrl: "https://www.chaophrayatouristboat.com/tourist_boat",
    sourcePhoto: images.chaoPhraya,
    editorialUrls: ["https://chaophrayatouristboat.com/tourist_boat.html", "https://thaiest.com/thailand/bangkok/river-boats"],
  }),
  stop({
    ...cocktailStops[0],
    id: "bangkok-activity-bkk-social-club",
    description:
      "End one Bangkok day at BKK Social Club when the route deserves a polished landing instead of another anonymous rooftop. The official dress and age rules are part of the planning, not trivia; change after sightseeing, reserve if the night matters, and let the river hotel setting do its work.",
  }),
];

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
    url: maps(`${title} Bangkok Thailand`),
    category,
    location: bangkokLocation,
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

export const bangkokCitywideGuides: MapList[] = [
  guide(
    "Food",
    "list-bangkok-citywide-dining",
    "bangkok-best-restaurants-citywide",
    "best-restaurants",
    "Thai Fine Dining With Heat and Nerve",
    "A citywide Bangkok dining guide for Southern Thai ceremony, progressive Indian theater, and seasonal modern Thai cooking. Use it when reservations, budget, and one serious dinner are worth planning before the rest of the night.",
    diningStops,
    sources.dining,
    "Best Restaurants in Bangkok for Thai Fine Dining",
    "Source-backed Bangkok restaurant guide covering Sorn, Gaggan, and Le Du with official pages, map evidence, hours, and booking caveats.",
  ),
  guide(
    "Food",
    "list-bangkok-medium-cheap-eats",
    "bangkok-best-cheap-eats-medium-budget",
    "best-cheap-eats",
    "Cheap and Medium Eats That Beat the Heat",
    "Bangkok cheap and medium eats for old-city pad thai, an air-conditioned Sukhumvit food court, and a produce-market food crawl by Chatuchak. The guide is built for heat-aware routing, not street-food fantasy.",
    cheapEatsStops,
    sources.cheapEats,
    "Best Cheap Eats in Bangkok",
    "Best cheap and medium eats in Bangkok, including Thipsamai, Pier 21 Food Court, and Or Tor Kor Market with current source evidence.",
  ),
  guide(
    "Stay",
    "list-bangkok-citywide-hotels",
    "bangkok-best-hotels-citywide",
    "best-hotels",
    "River Hotels With a Point of View",
    "A Bangkok hotel guide for riverfront stays with real identity: Mandarin Oriental heritage, Capella's contemporary calm, and The Siam's art-filled Dusit retreat. Pick by pace and geography before price alone.",
    hotelStops,
    sources.hotels,
    "Best Hotels in Bangkok",
    "Best hotels in Bangkok for riverfront luxury, heritage service, design stays, and quieter bases along the Chao Phraya.",
  ),
  guide(
    "Stay",
    "list-bangkok-citywide-hostels",
    "bangkok-best-hostels-citywide",
    "best-hostels",
    "Hostels by Transit, Yard, and Old City",
    "A Bangkok hostel guide that separates Siam transit, Ari social calm, and Old City temple access. It keeps hostels out of the hotel guide and focuses on check-in reality, neighborhood fit, and sleep style.",
    hostelStops,
    sources.hostels,
    "Best Hostels in Bangkok",
    "Best hostels in Bangkok for solo travelers, social stays, BTS access, Ari calm, and Old City temple routes.",
  ),
  guide(
    "Nightlife",
    "list-bangkok-citywide-casual-bars",
    "bangkok-best-casual-bars-citywide",
    "best-bars",
    "Casual Nights With Music, Beer, and Thai Spirit",
    "A Bangkok casual bar guide for live Thai music in Chinatown, Victory Monument jazz, and Ekkamai craft beer. Use it when the night should feel local, social, and unpolished without turning into club logistics.",
    casualBarStops,
    sources.casualBars,
    "Best Casual Bars in Bangkok",
    "Best casual bars in Bangkok for live music, Thai spirits, jazz pubs, craft beer, and lower-pressure nights.",
  ),
  guide(
    "Nightlife",
    "list-bangkok-citywide-cocktail-bars",
    "bangkok-best-cocktail-bars-citywide",
    "best-cocktail-bars",
    "Cocktail Rooms Worth Dressing For",
    "A Bangkok cocktail guide for serious bar nights: BKK Social Club's hotel polish, Bar Us's experimental tasting-room energy, and Vesper's Silom reliability. Reserve when the night has stakes.",
    cocktailStops,
    sources.cocktails,
    "Best Cocktail Bars in Bangkok",
    "Best cocktail bars in Bangkok, including BKK Social Club, Bar Us, and Vesper with current hours, official pages, and bar-award context.",
  ),
  guide(
    "Culture",
    "list-bangkok-citywide-culture",
    "bangkok-best-culture-citywide",
    "best-culture",
    "Temples, Teak Houses, and Modern Art",
    "A Bangkok culture guide that moves from royal-temple intensity to teak-house shade and contemporary art. It is built around dress codes, ticket windows, heat, and the difference between a sacred site and a museum pause.",
    cultureStops,
    sources.culture,
    "Best Culture in Bangkok",
    "Best culture in Bangkok, covering the Grand Palace, Wat Pho, Wat Arun, Jim Thompson House, and MOCA with official visitor evidence.",
  ),
  guide(
    "Activities",
    "list-bangkok-citywide-things-to-do",
    "bangkok-best-things-to-do-citywide",
    "best-things-to-do",
    "Ten Bangkok Moves That Actually Route",
    "A top-things-to-do guide for Bangkok that respects heat, ferries, temple dress codes, market timing, museums, food, and one serious cocktail landing. It is a route-useful set, not a random attraction dump.",
    activityStops,
    sources.activities,
    "Best Things to Do in Bangkok",
    "Best things to do in Bangkok, including temples, river boats, markets, museums, parks, food stops, and cocktail bars with current source evidence.",
  ),
];
