import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

const createdAt = "2026-06-06T00:00:00.000Z";
const checkedAt = "2026-06-06";

const location = {
  city: "Hanoi",
  country: "Vietnam",
  continent: "Asia",
  scope: "city" as const,
};

type StopHours = NonNullable<GuideStop["hours"]>;

type StopInput = {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  officialUrl: string;
  photo: string;
  hours: StopHours;
  bookingUrl?: string;
  editorialUrls?: string[];
  mapQuery?: string;
  price?: GuideStop["price"];
  priceSource?: string;
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

function commons(fileName: string) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=1600`;
}

const hotelHours: StopHours = "Hotel operates daily with 24-hour guest services; verify check-in, restaurant, spa, and holiday schedules on the official booking page before committing.";
const hostelHours: StopHours = "Accommodation operates daily; verify reception hours, late check-in rules, and dorm/private-room availability on the official or Hostelworld page.";

const images = {
  gia: commons("Vietnamese spring rolls (24037331555).jpg"),
  tamVi: commons("Bun-cha-hanoi.jpg"),
  chaCa: commons("Grilled fish @ Cha Ca La Vong.jpg"),
  bunCha: commons("Bun-cha-hanoi.jpg"),
  pho: commons("Street vendor pho ga Hanoi.jpg"),
  banhMi: commons("Banh mi and cuon.jpg"),
  eggCoffee: commons("Egg coffee in Hanoi.jpg"),
  xoi: commons("Bananas-with-sticky-rice-2376741 960 720.jpg"),
  banhCuon: commons("Banh cuon.jpg"),
  metropole: commons("Sofitel Metropole, Lý Thái Tổ - 2022-09-02 02.jpg"),
  capella: commons("Capella Hanoi Vietnam.jpg"),
  operaHouse: commons("Hanoi Opera House 1.jpg"),
  hoanKiem: commons("Hoan Kiem Lake.jpg"),
  oldQuarter: commons("Old Quarter, Hanoi (1) (37610002115).jpg"),
  biaHoi: commons("Old Quarter, Hanoi (1) (37610002115).jpg"),
  jazz: commons("Old Quarter, Hanoi (1) (37610002115).jpg"),
  cocktails: commons("Alcohol-bar-party-cocktail (24218389642).jpg"),
  templeLiterature: commons("Temple of Literature, Hanoi (5678911517).jpg"),
  hoaLo: commons("Memorial Hoa Lo prison.jpg"),
  ethnology: commons("Vietnam Museum of Ethnology, Hanoi, Vietnam (8120858382).jpg"),
  womensMuseum: commons("Vietnamese Women's Museum.jpg"),
  fineArts: commons("Paintings in Vietnam National Museum of Fine Arts.jpg"),
  waterPuppet: commons("Water Puppets in Hanoi, Vietnam (3486645827).jpg"),
  mausoleum: commons("Ho Chi Minh Mausoleum.jpg"),
  citadel: commons("Central Sector of the Imperial Citadel of Thang Long - Hanoi.jpg"),
  westLake: commons("Tran quoc pagoda.jpg"),
  batTrang: commons("Bát Tràng DSC 0091.JPG"),
};

function stop(input: StopInput): GuideStop {
  const mapUrl = maps(input.mapQuery ?? `${input.name} Hanoi Vietnam`);
  const sourceUrls = [
    input.officialUrl,
    input.bookingUrl,
    mapUrl,
    input.photo,
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
    officialUrl: input.officialUrl,
    hours: input.hours,
    photo: input.photo,
    imageSourceUrl: input.photo,
    sourceUrls: [...new Set(sourceUrls)],
    sourceEvidence: {
      officialUrl: input.officialUrl,
      mapUrl,
      currentStatusUrl: mapUrl,
      imageSourceUrl: input.photo,
      editorialUrls: input.editorialUrls ?? [],
      platformUrls: input.bookingUrl ? [input.bookingUrl] : [],
      checkedAt,
      notes: "Official/property, platform, Google Maps search, and current editorial sources checked for open-status evidence; hours are stored as official schedule summaries or source-backed caveats.",
    },
  };
}

const diningStops = [
  stop({ id: "hanoi-dining-gia", name: "Gia", coordinates: [21.03595, 105.83551], description: "Gia is the Hanoi reservation for travelers who want Vietnamese ingredients pushed through a calm, modern tasting-menu lens rather than another Old Quarter sprint. The kitchen sits near the Temple of Literature and works best as a planned dinner; book ahead and leave room in the day for the pacing.", officialUrl: "https://gia-hanoi.com/", photo: images.gia, hours: "Tasting-menu services vary by reservation date; verify the official booking calendar before going.", price: "$$$$", priceSource: "Official booking page / MICHELIN Guide", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["vietnamese", "modern_vietnamese", "tasting_menu"], attributeTags: ["fine_dining", "tasting_menu", "reservation_recommended", "splurge_food"], editorialUrls: ["https://guide.michelin.com/vn/en/ha-noi/ha-noi_2974158/restaurant/gia", "https://www.theworlds50best.com/discovery/Establishments/Vietnam/Hanoi/Gia.html"] }),
  stop({ id: "hanoi-dining-tam-vi", name: "Tam Vi", coordinates: [21.02598, 105.82661], description: "Tam Vi makes northern Vietnamese home cooking feel deliberate without sanding off its fish sauce, pickles, clay pots, and family-table rhythms. It belongs here because Hanoi dining is not only noodles and tasting menus; expect a busy room, book if possible, and order like a table rather than a solo sampler.", officialUrl: "https://www.facebook.com/nhahangtamvi/", photo: images.tamVi, hours: "Lunch and dinner hours are posted on current map/social listings; verify the same-day listing before going.", price: "$$$", priceSource: "MICHELIN Guide / Google Maps", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["vietnamese", "northern_vietnamese", "home_style"], attributeTags: ["local_favorite", "reservation_recommended", "group_friendly", "destination_dining"], editorialUrls: ["https://guide.michelin.com/vn/en/ha-noi/ha-noi_2974158/restaurant/tam-vi", "https://www.timeout.com/hanoi/restaurants/best-restaurants-in-hanoi"] }),
  stop({ id: "hanoi-dining-cha-ca-thang-long", name: "Cha Ca Thang Long", coordinates: [21.03301, 105.84651], description: "Cha Ca Thang Long is the turmeric-fish stop that turns a single Hanoi dish into dinner theater: sizzling fish, dill, herbs, noodles, peanuts, and a room built for turnover. It is famous enough to feel obvious, but the reason it stays useful is practical clarity; go hungry and do not expect a quiet tasting-room mood.", officialUrl: "https://guide.michelin.com/us/en/ha-noi/ha-noi_2974158/restaurant/cha-ca-thang-long", photo: images.chaCa, hours: "Daily lunch and dinner service is listed by MICHELIN and current map platforms; verify the Google Maps listing before going.", price: "$$", priceSource: "MICHELIN Guide / Google Maps", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["vietnamese", "seafood", "cha_ca"], attributeTags: ["local_favorite", "walk_in_friendly", "lively_food", "seafood"], editorialUrls: ["https://www.falstaff.com/en/restaurants/cha-ca-thang-long", "https://danielfooddiary.com/2025/12/07/chacathanglong/"] }),
  stop({ id: "hanoi-dining-bun-cha-huong-lien", name: "Bun Cha Huong Lien", coordinates: [21.01891, 105.85491], description: "Bun Cha Huong Lien will always carry the Obama-Bourdain footnote, but the better reason to go is the dish itself: grilled pork, smoky patties, herbs, noodles, and dipping sauce that explain Hanoi lunch in one bowl. Treat it as a focused meal, not a celebrity shrine, and check current service windows before crossing town.", officialUrl: "https://bunchahuonglien.vn/", photo: images.bunCha, hours: "Daily lunch-through-evening hours are listed on the official and map pages; verify holidays and last orders before going.", price: "$", priceSource: "Official site / Google Maps", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["vietnamese", "bun_cha", "grilled_pork"], attributeTags: ["budget_food", "local_favorite", "lunch", "walk_in_friendly"], editorialUrls: ["https://guide.michelin.com/vn/en/ha-noi/ha-noi_2974158/restaurants", "https://www.lonelyplanet.com/vietnam/hanoi/restaurants/bun-cha-huong-lien/a/poi-eat/1548632/357880"] }),
  stop({ id: "hanoi-dining-pho-thin", name: "Pho Thin 13 Lo Duc", coordinates: [21.01843, 105.85592], description: "Pho Thin is the beef-pho counter for people who want Hanoi breakfast with heat, scallions, quick decisions, and very little ceremony. The stir-fried beef style is richer than the gentler old-school bowls, so use it when the day needs momentum and check the current listing before assuming late service.", officialUrl: "https://phothin13loduc.com/", photo: images.pho, hours: "Daily daytime-to-evening service is posted by the official/map listing; verify same-day hours before routing around it.", price: "$", priceSource: "Official site / Google Maps", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["vietnamese", "pho", "beef_noodles"], attributeTags: ["budget_food", "breakfast", "local_favorite", "walk_in_friendly"], editorialUrls: ["https://guide.michelin.com/vn/en/ha-noi/ha-noi_2974158/restaurants", "https://www.timeout.com/hanoi/restaurants/best-restaurants-in-hanoi"] }),
];

const cheapEatStops = [
  stop({ id: "hanoi-cheap-banh-mi-25", name: "Banh Mi 25", coordinates: [21.0352, 105.84925], description: "Banh Mi 25 is tourist-friendly for a reason: it gives first-timers a clean, quick Old Quarter sandwich stop without making the route feel like a scavenger hunt. The bread, pate, herbs, and fillings are the point; go off peak if you want the sandwich more than the line.", officialUrl: "https://banhmi25.net/", photo: images.banhMi, hours: "Daily counter hours are listed on the official site and map profile; verify current closing time before going.", price: "$", priceSource: "Official site / Google Maps", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["vietnamese", "banh_mi", "sandwiches"], attributeTags: ["budget_food", "lunch", "walk_in_friendly", "street_food"], editorialUrls: ["https://bestbanhmivietnam.com/cities/hanoi/restaurants/hanoi-banh-mi-25", "https://www.vibrantlyvietnam.com/banh-mi-25-hanoi-vietnam-restaurant-review/"] }),
  stop({ id: "hanoi-cheap-cafe-giang", name: "Cafe Giang", coordinates: [21.03359, 105.85229], description: "Cafe Giang is the egg-coffee stop with enough history and sweetness to count as dessert, caffeine, and Hanoi folklore at once. The room is tight and busy, but that is part of the bargain; order the egg coffee and do not overcomplicate a cheap classic.", officialUrl: "https://cafegiang.vn/", photo: images.eggCoffee, hours: "Daily cafe hours are posted by the official site and map listing; verify holiday hours before going.", price: "$", priceSource: "Official site / Google Maps", venueKind: "food_drink", foodServiceType: "cafe", cuisineTypes: ["vietnamese", "coffee", "dessert"], attributeTags: ["coffee", "budget_food", "local_favorite", "walk_in_friendly"], editorialUrls: ["https://www.lonelyplanet.com/vietnam/hanoi/restaurants/cafe-giang/a/poi-eat/1135688/357880", "https://www.atlasobscura.com/places/cafe-giang"] }),
  stop({ id: "hanoi-cheap-xoi-yen", name: "Xoi Yen", coordinates: [21.03435, 105.84964], description: "Xoi Yen is sticky rice made into a meal instead of a side: mung bean, shallots, meat, pate, eggs, and enough density to carry a long walk through Hoan Kiem. It is best for breakfast or a cheap reset, with the caveat that the room moves quickly and comfort is not the selling point.", officialUrl: "https://www.facebook.com/xoyenhanoi/", photo: images.xoi, hours: "Current opening windows are maintained on Google Maps/social listings; verify same-day hours before going.", price: "$", priceSource: "Google Maps / social listing", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["vietnamese", "sticky_rice", "breakfast"], attributeTags: ["budget_food", "breakfast", "walk_in_friendly", "local_favorite"], editorialUrls: ["https://www.lonelyplanet.com/vietnam/hanoi/restaurants/xoi-yen/a/poi-eat/1147439/357880", "https://www.vietnamonline.com/restaurant/hanoi/xoi-yen.html"] }),
  stop({ id: "hanoi-cheap-bun-cha-dac-kim", name: "Bun Cha Dac Kim", coordinates: [21.03232, 105.84813], description: "Bun Cha Dac Kim is an Old Quarter bun cha room where the grill smoke, herbs, pork, and crowd make lunch feel happily unromantic. Portions run generous and the pace is brisk, so it belongs in cheap eats for travelers who want a full meal without dragging the afternoon into a reservation.", officialUrl: "https://www.facebook.com/bunchadackim/", photo: images.bunCha, hours: "Lunch and dinner hours are listed on map/social platforms; verify same-day service before going.", price: "$", priceSource: "Google Maps / social listing", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["vietnamese", "bun_cha", "grilled_pork"], attributeTags: ["budget_food", "lunch", "local_favorite", "walk_in_friendly"], editorialUrls: ["https://www.vietnamonline.com/restaurant/hanoi/bun-cha-dac-kim.html", "https://guide.michelin.com/vn/en/ha-noi/ha-noi_2974158/restaurants"] }),
  stop({ id: "hanoi-cheap-banh-cuon-ba-hoanh", name: "Banh Cuon Ba Hoanh", coordinates: [21.00879, 105.84935], description: "Banh Cuon Ba Hoanh is where thin steamed rice rolls become a proper breakfast or lunch rather than a snack between bigger names. Come for the soft sheets, pork filling, herbs, fried shallots, and dipping sauce; the practical move is to go early and trust the turnover.", officialUrl: "https://www.facebook.com/banhcuonbahoanh/", photo: images.banhCuon, hours: "Daytime service is posted on current map/social listings; verify opening and closing before going.", price: "$", priceSource: "Google Maps / social listing", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["vietnamese", "banh_cuon", "breakfast"], attributeTags: ["budget_food", "breakfast", "local_favorite", "walk_in_friendly"], editorialUrls: ["https://guide.michelin.com/vn/en/ha-noi/ha-noi_2974158/restaurants", "https://www.vietnamonline.com/restaurant/hanoi/banh-cuon-ba-hoanh.html"] }),
];

const hotelStops = [
  stop({ id: "hanoi-hotel-metropole", name: "Sofitel Legend Metropole Hanoi", coordinates: [21.02553, 105.85558], description: "The Metropole is the grand old Hanoi hotel, useful when the trip wants French Quarter calm, Hoan Kiem access, polished service, and a building with real colonial-era weight. It is expensive and not subtle; book it when heritage atmosphere matters more than chasing the newest design room.", officialUrl: "https://www.sofitel-legend-metropole-hanoi.com/", bookingUrl: "https://all.accor.com/hotel/1555/index.en.shtml", photo: images.metropole, hours: hotelHours, price: "$$$$", priceSource: "Official Accor booking page / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "historic", "central", "romantic"], editorialUrls: ["https://www.cntraveler.com/hotels/hanoi/sofitel-legend-metropole-hanoi", "https://guide.michelin.com/us/en/hotels-stays/hanoi/sofitel-legend-metropole-hanoi-13323"] }),
  stop({ id: "hanoi-hotel-capella", name: "Capella Hanoi", coordinates: [21.02578, 105.85668], description: "Capella Hanoi is the theatrical splurge beside the Opera House, with Bill Bensley design, a small room count, and a hospitality style that feels staged in the best sense. Choose it for a special-occasion base near the French Quarter; the caveat is simple, the hotel can dominate the budget fast.", officialUrl: "https://capellahotels.com/en/capella-hanoi", bookingUrl: "https://capellahotels.com/en/capella-hanoi/offers", photo: images.capella, hours: hotelHours, price: "$$$$", priceSource: "Official booking page / MICHELIN Keys", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "design", "romantic", "central"], editorialUrls: ["https://www.cntraveler.com/hotels/hanoi/capella-hanoi", "https://guide.michelin.com/us/en/hotels-stays/hanoi/capella-hanoi-12803"] }),
  stop({ id: "hanoi-hotel-opera", name: "Hotel de l'Opera Hanoi", coordinates: [21.02467, 105.85619], description: "Hotel de l'Opera gives the French Quarter a more compact MGallery option, close to the Opera House, Hoan Kiem, and evening walks without the Metropole price theater. It is best for travelers who want central polish and Accor reliability; compare room categories because the drama is stronger in public spaces than in every room.", officialUrl: "https://all.accor.com/hotel/7832/index.en.shtml", bookingUrl: "https://all.accor.com/hotel/7832/index.en.shtml", photo: images.operaHouse, hours: hotelHours, price: "$$$", priceSource: "Official Accor booking page / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["central", "design", "romantic", "work_friendly"], editorialUrls: ["https://www.mgallery.accor.com/lien_externe.svlt?goto=fiche_hotel&code_hotel=7832", "https://www.booking.com/hotel/vn/de-l-opera-hanoi.html"] }),
  stop({ id: "hanoi-hotel-apricot", name: "Apricot Hotel", coordinates: [21.02822, 105.85098], description: "Apricot Hotel works when lake proximity matters: it puts Hoan Kiem at the front door and wraps the stay in Vietnamese art rather than anonymous business-hotel language. Book it for walkability and views, then check room orientation carefully because the best version of the hotel faces the water.", officialUrl: "https://apricothotels.com/", bookingUrl: "https://apricothotels.com/rooms-suites/", photo: images.hoanKiem, hours: hotelHours, price: "$$$", priceSource: "Official booking page / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["central", "scenic", "design", "romantic"], editorialUrls: ["https://www.booking.com/hotel/vn/apricot.html", "https://www.cntraveler.com/hotels/hanoi/apricot-hotel"] }),
  stop({ id: "hanoi-hotel-la-siesta", name: "La Siesta Classic Ma May", coordinates: [21.03463, 105.85321], description: "La Siesta Classic Ma May is the Old Quarter boutique answer for travelers who want to step straight into food streets, shops, and lake walks without surrendering to a dorm scene. The tradeoff is neighborhood noise and density; book higher room categories if sleep quality is the priority.", officialUrl: "https://lasiestahotels.vn/ma-may/", bookingUrl: "https://lasiestahotels.vn/ma-may/rooms-suites/", photo: images.oldQuarter, hours: hotelHours, price: "$$", priceSource: "Official booking page / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["boutique", "central", "midrange", "walkable"], editorialUrls: ["https://www.booking.com/hotel/vn/hanoi-elegance-diamond.html", "https://www.tripadvisor.com/Hotel_Review-g293924-d1792678-Reviews-La_Siesta_Classic_Ma_May-Hanoi.html"] }),
];

const hostelStops = [
  stop({ id: "hanoi-hostel-old-quarter-view", name: "Old Quarter View Hanoi Hostel", coordinates: [21.03541, 105.85068], description: "Old Quarter View Hanoi Hostel is the practical dorm choice when the trip is built around walking the old streets, meeting people, and keeping the bed budget low. It belongs in this guide for location and social ease; verify room mix and quiet expectations before booking.", officialUrl: "https://www.hostelworld.com/hostels/p/271861/old-quarter-view-hanoi-hostel/", bookingUrl: "https://www.hostelworld.com/hostels/p/271861/old-quarter-view-hanoi-hostel/", photo: images.oldQuarter, hours: hostelHours, price: "$", priceSource: "Hostelworld / Booking.com", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "social", "central", "solo_friendly"], editorialUrls: ["https://www.nomadicmatt.com/travel-blogs/best-hostels-hanoi/", "https://www.thebrokebackpacker.com/best-hostels-in-hanoi-vietnam/"] }),
  stop({ id: "hanoi-hostel-nexy", name: "Nexy Hostel", coordinates: [21.03241, 105.85003], description: "Nexy Hostel is an Old Quarter budget base with a more polished, flashpacker feel than the cheapest party beds. Use it when you want dorm pricing, private-room options, and a central address; still check reception and room-type rules because the experience changes by booking category.", officialUrl: "https://www.nexyhostels.com/", bookingUrl: "https://www.hostelworld.com/hostels/p/278171/nexy-hostel/", photo: images.oldQuarter, hours: hostelHours, price: "$", priceSource: "Official site / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "central", "social", "solo_friendly"], editorialUrls: ["https://www.nomadicmatt.com/travel-blogs/best-hostels-hanoi/", "https://www.hostelworld.com/hostels/Hanoi/Vietnam"] }),
  stop({ id: "hanoi-hostel-little-charm", name: "Little Charm Hanoi Hostel", coordinates: [21.03357, 105.84987], description: "Little Charm Hanoi Hostel suits travelers who want Old Quarter access with a softer landing than a pure party hostel. The indoor pool and private-room options make it more comfortable than the rock-bottom tier; compare dorm layouts and late-arrival policies before choosing it.", officialUrl: "https://littlecharmhanoihostel.com/", bookingUrl: "https://www.hostelworld.com/hostels/p/277775/little-charm-hanoi-hostel/", photo: images.oldQuarter, hours: hostelHours, price: "$", priceSource: "Official site / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "central", "social", "midrange"], editorialUrls: ["https://www.hostelworld.com/hostels/Hanoi/Vietnam", "https://www.thebrokebackpacker.com/best-hostels-in-hanoi-vietnam/"] }),
  stop({ id: "hanoi-hostel-buffalo", name: "Hanoi Buffalo Hostel", coordinates: [21.03584, 105.85213], description: "Hanoi Buffalo Hostel is the Old Quarter pick when meeting people is part of the plan and sleep is only one job the property needs to do. It is central and social, which also means you should check noise, bar programming, and private-room options before treating it as a quiet base.", officialUrl: "https://hanoibuffalohostel.com/", bookingUrl: "https://www.hostelworld.com/hostels/p/277772/hanoi-buffalo-hostel/", photo: images.oldQuarter, hours: hostelHours, price: "$", priceSource: "Official site / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "party", "social", "central"], editorialUrls: ["https://www.hostelworld.com/hostels/Hanoi/Vietnam", "https://www.vietnamonline.com/destination/hanoi/hotel-guide/best-budget-hotels-hanoi.html"] }),
  stop({ id: "hanoi-hostel-the-one", name: "The One Hostel Hanoi", coordinates: [21.03504, 105.85021], description: "The One Hostel Hanoi is for travelers who want a lively Old Quarter base with rooftop-and-bar energy rather than a monkish dorm. It belongs here as a social-first hostel; the caveat is to book a private or quieter room if early tours and sleep matter.", officialUrl: "https://theonehostel.com/hanoi/", bookingUrl: "https://www.hostelworld.com/hostels/p/315719/the-one-hostel-hanoi/", photo: images.oldQuarter, hours: hostelHours, price: "$", priceSource: "Official site / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "party", "social", "central"], editorialUrls: ["https://www.thebrokebackpacker.com/best-hostels-in-hanoi-vietnam/", "https://www.hostelworld.com/hostels/Hanoi/Vietnam"] }),
];

const casualBarStops = [
  stop({ id: "hanoi-bar-bia-hoi-corner", name: "Bia Hoi Corner", coordinates: [21.03515, 105.85239], description: "Bia Hoi Corner is less a bar than a nightly Hanoi sidewalk argument: fresh beer, plastic stools, backpackers, locals, vendors, and a traffic ballet that makes no promises about elegance. Go for one or two cheap glasses and the scene, then move on before the novelty turns into exhaustion.", officialUrl: "https://www.arrivalguides.com/en/Travelguide/HANOI/barsandnightlife/bia-hoi-corner-111358", photo: images.biaHoi, hours: "Evening street-bar activity varies by vendor, weather, and enforcement; verify current Google Maps activity before going.", price: "$", priceSource: "ArrivalGuides / Google Maps", venueKind: "nightlife", nightlifeType: "beer_bar", musicGenres: ["street", "casual"], attributeTags: ["cheap_drinks", "social", "lively", "walk_in_friendly"], editorialUrls: ["https://thediscreetgentleman.com/countries/vietnam/hanoi/ta-hien-street/bia-hoi-corner", "https://www.timeout.com/hanoi/bars/best-bars-in-hanoi"] }),
  stop({ id: "hanoi-bar-pasteur-street", name: "Pasteur Street Brewing Hanoi Taproom", coordinates: [21.03329, 105.85274], description: "Pasteur Street Brewing gives Hanoi a craft-beer stop with more structure than the sidewalk beer scene, useful when the group wants air conditioning, flights, and Vietnamese-leaning beer flavors. It is not the cheapest drink in town, but it solves the night when comfort and conversation matter.", officialUrl: "https://pasteurstreet.com/", photo: images.biaHoi, hours: "Taproom hours vary by branch and date; verify the official location page or Google Maps listing before going.", price: "$$", priceSource: "Official site / Google Maps", venueKind: "nightlife", nightlifeType: "beer_bar", musicGenres: ["background"], attributeTags: ["craft_beer", "group_friendly", "casual", "walk_in_friendly"], editorialUrls: ["https://www.timeout.com/hanoi/bars/best-bars-in-hanoi", "https://vietcetera.com/en/best-craft-beer-spots-in-vietnam"] }),
  stop({ id: "hanoi-bar-standing", name: "Standing Bar", coordinates: [21.04601, 105.83659], description: "Standing Bar is the Truc Bach craft-beer counter that lets the night breathe away from Old Quarter density. The appeal is simple: taps, lake-adjacent wandering, and a less frantic crowd; check the current beer list and hours before making it the whole evening.", officialUrl: "https://www.facebook.com/standingbarhanoi/", photo: images.westLake, hours: "Evening taproom hours are posted on current social/map listings; verify same-day opening before going.", price: "$$", priceSource: "Social listing / Google Maps", venueKind: "nightlife", nightlifeType: "beer_bar", musicGenres: ["background"], attributeTags: ["craft_beer", "casual", "group_friendly", "scenic"], editorialUrls: ["https://www.timeout.com/hanoi/bars/best-bars-in-hanoi", "https://vietcetera.com/en/best-craft-beer-spots-in-vietnam"] }),
  stop({ id: "hanoi-bar-binh-minh-jazz", name: "Binh Minh Jazz Club", coordinates: [21.02455, 105.85626], description: "Binh Minh Jazz Club is the easy Hanoi live-music answer: a small room near the Opera House where the plan can stay loose but still feel like a real night out. Check the performance schedule rather than wandering in blind, because the room works best when the music is the point.", officialUrl: "https://binhminhjazzclub.com/", photo: images.jazz, hours: "Shows and opening times vary by performance calendar; verify the official schedule before going.", price: "$$", priceSource: "Official site / Google Maps", venueKind: "nightlife", nightlifeType: "live_music_venue", musicGenres: ["jazz", "live_music"], attributeTags: ["live_music", "date_night", "casual", "central"], editorialUrls: ["https://www.timeout.com/hanoi/bars/best-bars-in-hanoi", "https://www.lonelyplanet.com/vietnam/hanoi/nightlife/binh-minh-jazz-club/a/poi-dri/1183833/357880"] }),
  stop({ id: "hanoi-bar-social-club", name: "The Hanoi Social Club", coordinates: [21.03009, 105.84434], description: "The Hanoi Social Club is the low-key cafe-bar hybrid for travelers who want dinner, drinks, conversation, and a break from Old Quarter pressure. It is more mellow than a dedicated bar crawl stop, which is exactly why it earns a place in a casual-night guide.", officialUrl: "https://www.facebook.com/thehanoisocialclub/", photo: images.oldQuarter, hours: "Cafe, food, and bar hours are posted on current social/map listings; verify before going for late drinks.", price: "$$", priceSource: "Social listing / Google Maps", venueKind: "nightlife", nightlifeType: "lounge", musicGenres: ["acoustic", "background"], attributeTags: ["casual", "quiet", "date_night", "vegetarian_friendly"], editorialUrls: ["https://www.timeout.com/hanoi/bars/best-bars-in-hanoi", "https://www.lonelyplanet.com/vietnam/hanoi/restaurants/the-hanoi-social-club/a/poi-eat/1282928/357880"] }),
];

const cocktailStops = [
  stop({ id: "hanoi-cocktail-haflington", name: "The Haflington", coordinates: [21.03401, 105.85283], description: "The Haflington is the Hanoi cocktail room with the awards heat, hidden-upstairs drama, and a vintage-museum mood that could feel silly if the drinks were not serious. It is best as a destination round, not a random nightcap; book or arrive early when bar lists are drawing crowds.", officialUrl: "https://www.facebook.com/thehaflington/", photo: images.cocktails, hours: "Evening cocktail hours are posted on current social/map listings; verify same-day opening before going.", price: "$$$", priceSource: "Asia's 50 Best Bars / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["lounge"], attributeTags: ["premium_drinks", "date_night", "reservation_recommended", "design"], editorialUrls: ["https://www.theworlds50best.com/bars/asia/the-list/the-haflington.html", "https://www.asia-bars.com/2026/05/top-12-hanoi-cocktail-bars-visit-2026/"] }),
  stop({ id: "hanoi-cocktail-polite", name: "Polite & Co", coordinates: [21.03314, 105.85051], description: "Polite & Co carries old Hanoi bar DNA into a polished whisky-and-cocktail room, the kind of place where one good drink can replace a messy crawl. Go when you want bartenders, classics, and conversation; verify hours because the night is built around evening service.", officialUrl: "https://www.politeandco.com/", photo: images.cocktails, hours: "Evening cocktail hours are posted by the official/social and map listings; verify same-day opening before going.", price: "$$$", priceSource: "Official site / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["lounge"], attributeTags: ["premium_drinks", "date_night", "central", "reservation_recommended"], editorialUrls: ["https://vietcetera.com/en/cocktail-bars-to-know-in-hanoi", "https://www.timeout.com/hanoi/bars/best-bars-in-hanoi"] }),
  stop({ id: "hanoi-cocktail-kumquat-tree", name: "Kumquat Tree", coordinates: [21.03468, 105.85022], description: "Kumquat Tree is the Old Quarter speakeasy-style stop where the fun is partly finding the door and partly letting the drinks lean local. It belongs here for mood and route value, but it is small enough that timing matters; check current reservations or message before going late.", officialUrl: "https://www.facebook.com/kumquattreehanoi/", photo: images.cocktails, hours: "Evening cocktail hours and reservation rules are posted on social/map listings; verify before going.", price: "$$$", priceSource: "Social listing / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["lounge"], attributeTags: ["premium_drinks", "date_night", "reservation_recommended", "central"], editorialUrls: ["https://vietcetera.com/en/cocktail-bars-to-know-in-hanoi", "https://www.asia-bars.com/2026/05/top-12-hanoi-cocktail-bars-visit-2026/"] }),
  stop({ id: "hanoi-cocktail-workshop14", name: "Workshop14", coordinates: [21.03429, 105.8511], description: "Workshop14 gives Hanoi cocktail culture an experimental edge without turning the night into homework. The draw is Vietnamese ingredients and bartender-led curiosity; go with people who want to taste, ask questions, and stay flexible if the menu has changed.", officialUrl: "https://www.workshop14.vn/", photo: images.cocktails, hours: "Evening cocktail hours and guest shifts vary; verify the official/social calendar before going.", price: "$$$", priceSource: "Official site / Asia Bars", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["lounge"], attributeTags: ["premium_drinks", "date_night", "design", "reservation_recommended"], editorialUrls: ["https://www.asia-bars.com/2026/05/top-12-hanoi-cocktail-bars-visit-2026/", "https://vietcetera.com/en/cocktail-bars-to-know-in-hanoi"] }),
  stop({ id: "hanoi-cocktail-hudson", name: "The Hudson Rooms", coordinates: [21.02578, 105.85668], description: "The Hudson Rooms brings the Capella version of a cocktail night: rooftop polish, hotel service, and New York references filtered through a Hanoi luxury address. It is not where to save money, but it is useful when the night needs a dressier, weather-safe finale near the Opera House.", officialUrl: "https://capellahotels.com/en/capella-hanoi/dining/the-hudson-rooms", photo: images.capella, hours: "Bar hours and terrace operations vary by date, weather, and private events; verify the official dining page before going.", price: "$$$$", priceSource: "Official Capella page / Asia's 50 Best Bars extended list", venueKind: "nightlife", nightlifeType: "rooftop_bar", musicGenres: ["lounge"], attributeTags: ["premium_drinks", "luxury", "scenic", "date_night"], editorialUrls: ["https://capellahotels.com/assets/docs/hanoi/2025.02_%28Press_Release_-_English%29_CAPELLA_HANOI_SOLIDIFIES_STATUS_AS_VIETNAMS_PREMIER_GASTRONOMIC_DESTINATION_WITH_TRIO_OF_DISTINGUISHED_ACCOLADES_.pdf", "https://www.asia-bars.com/2026/05/top-12-hanoi-cocktail-bars-visit-2026/"] }),
];

const cultureStops = [
  stop({ id: "hanoi-culture-temple-literature", name: "Temple of Literature", coordinates: [21.02881, 105.83552], description: "The Temple of Literature is Hanoi's education-and-ritual anchor: courtyards, stelae, Confucian architecture, and enough calm to reset after the Old Quarter. Go early for shade and space, and dress with the respect a functioning heritage site deserves.", officialUrl: "https://vanmieu.gov.vn/", photo: images.templeLiterature, hours: "Visitor hours and ticket rules vary by season and holiday; verify the official heritage-site page before going.", venueKind: "culture", subcategory: "historic_site", attributeTags: ["historic", "museum", "walking", "tickets_required"], editorialUrls: ["https://www.godiscovervietnam.com/attractions/temple-of-literature", "https://revitrip.com/blog/temple-of-literature-hanoi"] }),
  stop({ id: "hanoi-culture-hoa-lo", name: "Hoa Lo Prison Relic", coordinates: [21.02531, 105.84658], description: "Hoa Lo is the hard stop that keeps Hanoi from becoming only cafes, lakes, and lantern photos. The French colonial prison and later wartime layers deserve time and attention; do not squeeze it between lunch and a spa booking if you actually want context.", officialUrl: "https://hoalo.vn/", photo: images.hoaLo, hours: "Museum hours and night-tour schedules vary; verify the official relic site before going.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "historic", "tickets_required", "rainy_day"], editorialUrls: ["https://vietnam.travel/places-to-go/northern-vietnam/ha-noi", "https://www.lonelyplanet.com/vietnam/hanoi/attractions/hoa-lo-prison-museum/a/poi-sig/1135683/357880"] }),
  stop({ id: "hanoi-culture-ethnology", name: "Vietnam Museum of Ethnology", coordinates: [21.04039, 105.79832], description: "The Vietnam Museum of Ethnology is worth the ride west because it makes Vietnam's cultural variety tangible through houses, textiles, tools, and outdoor structures rather than a flat national story. Plan transport both ways and give the grounds time, especially if traveling with kids.", officialUrl: "https://vme.org.vn/", photo: images.ethnology, hours: "Museum opening days, outdoor areas, and holiday closures vary; verify the official museum page before going.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "family_friendly", "tickets_required", "educational"], editorialUrls: ["https://www.lonelyplanet.com/vietnam/hanoi/attractions/vietnam-museum-of-ethnology/a/poi-sig/1135682/357880", "https://vietnam.travel/things-to-do/top-museums-vietnam"] }),
  stop({ id: "hanoi-culture-womens-museum", name: "Vietnamese Women's Museum", coordinates: [21.02435, 105.85239], description: "The Vietnamese Women's Museum is one of Hanoi's most useful cultural stops because it connects daily life, family, fashion, labor, and war through stories that are often missing from monument routes. It is central, manageable, and better if you slow down for the captions.", officialUrl: "https://baotangphunu.org.vn/", photo: images.womensMuseum, hours: "Museum hours and special exhibitions vary; verify the official museum page before going.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "rainy_day", "educational", "central"], editorialUrls: ["https://vietnam.travel/things-to-do/top-museums-vietnam", "https://www.lonelyplanet.com/vietnam/hanoi/attractions/vietnamese-women-s-museum/a/poi-sig/1135681/357880"] }),
  stop({ id: "hanoi-culture-fine-arts", name: "Vietnam National Fine Arts Museum", coordinates: [21.03011, 105.83737], description: "The Vietnam National Fine Arts Museum gives a compact art-history route beside the Temple of Literature, with lacquer, sculpture, propaganda art, and modern Vietnamese painting in one building. Pair it with the temple, but check hours first because a closed museum breaks that tidy half-day plan.", officialUrl: "https://vnfam.vn/", photo: images.fineArts, hours: "Museum hours and gallery closures vary; verify the official museum page before going.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "art", "rainy_day", "central"], editorialUrls: ["https://vietnam.travel/things-to-do/top-museums-vietnam", "https://www.lonelyplanet.com/vietnam/hanoi/attractions/vietnam-fine-arts-museum/a/poi-sig/1135684/357880"] }),
];

const activityStops = [
  stop({ id: "hanoi-activity-hoan-kiem", name: "Hoan Kiem Lake and Ngoc Son Temple", coordinates: [21.02878, 105.85224], description: "Start at Hoan Kiem because Hanoi's old center teaches itself around the lake: morning exercise, temple visits, weekend walking streets, coffee stops, and traffic practice in one loop. The lake is public, but Ngoc Son Temple has its own ticket and hours, so check the temple schedule if entering matters.", officialUrl: "https://vietnam.travel/places-to-go/northern-vietnam/ha-noi", photo: images.hoanKiem, hours: "Lake paths are public daily; Ngoc Son Temple ticket hours vary and should be verified before entering.", venueKind: "landmark", subcategory: "lake_temple", attributeTags: ["walking", "scenic", "central", "free_entry"], editorialUrls: ["https://www.godiscovervietnam.com/attractions/hoan-kiem-lake", "https://www.lonelyplanet.com/vietnam/hanoi/attractions/hoan-kiem-lake/a/poi-sig/1135680/357880"] }),
  stop({ id: "hanoi-activity-old-quarter", name: "Hanoi Old Quarter", coordinates: [21.03589, 105.85071], description: "The Old Quarter is the practical base layer of Hanoi: guild streets, food counters, cafes, shops, guesthouses, and crossings that slowly teach you the city's rhythm. Wander by area instead of checklist, and save your sharpest attention for traffic, bags, and vendor pressure.", officialUrl: "https://vietnam.travel/places-to-go/northern-vietnam/ha-noi", photo: images.oldQuarter, hours: "Public streets are accessible daily; shops, markets, restaurants, and weekend pedestrian zones keep separate schedules.", venueKind: "landmark", subcategory: "neighborhood_walk", attributeTags: ["walking", "shopping_street", "central", "food"], editorialUrls: ["https://commons.wikimedia.org/wiki/Category:Hanoi%27s_Old_Quarter", "https://www.lonelyplanet.com/vietnam/hanoi/attractions/old-quarter/a/poi-sig/1135686/357880"] }),
  stop({ id: "hanoi-activity-temple-literature", name: "Temple of Literature", coordinates: [21.02881, 105.83552], description: "Use the Temple of Literature as the cultural pause in a first Hanoi itinerary: it is beautiful, readable, and close enough to pair with museums without exhausting the day. Go early or late for softer light, and verify hours because seasonal changes are common.", officialUrl: "https://vanmieu.gov.vn/", photo: images.templeLiterature, hours: "Visitor hours and ticket rules vary by season and holiday; verify the official heritage-site page before going.", venueKind: "culture", subcategory: "historic_site", attributeTags: ["historic", "walking", "tickets_required", "family_friendly"], editorialUrls: ["https://www.godiscovervietnam.com/attractions/temple-of-literature", "https://revitrip.com/blog/temple-of-literature-hanoi"] }),
  stop({ id: "hanoi-activity-mausoleum", name: "Ho Chi Minh Mausoleum Complex", coordinates: [21.03675, 105.83466], description: "The Ho Chi Minh Mausoleum Complex is the ceremonial stop where dress code, security, lines, and national memory all matter. Treat it as a morning plan with rules rather than a casual detour, and check closures before going because access can change around maintenance and official events.", officialUrl: "https://bqllang.gov.vn/", photo: images.mausoleum, hours: "Mausoleum viewing, museum, stilt-house, and security schedules vary by day, season, and official events; verify the official management board.", venueKind: "landmark", subcategory: "mausoleum_complex", attributeTags: ["historic", "tickets_required", "family_friendly", "central"], editorialUrls: ["https://vietnam.travel/places-to-go/northern-vietnam/ha-noi", "https://www.lonelyplanet.com/vietnam/hanoi/attractions/ho-chi-minh-mausoleum/a/poi-sig/1135685/357880"] }),
  stop({ id: "hanoi-activity-hoa-lo", name: "Hoa Lo Prison Relic", coordinates: [21.02531, 105.84658], description: "Hoa Lo belongs in the top-things guide because it gives emotional and historical weight to a city that can otherwise feel consumed by food and street life. Budget enough time to read, then decompress afterward; this is not filler before cocktails.", officialUrl: "https://hoalo.vn/", photo: images.hoaLo, hours: "Museum hours and night-tour schedules vary; verify the official relic site before going.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "historic", "tickets_required", "rainy_day"], editorialUrls: ["https://vietnam.travel/places-to-go/northern-vietnam/ha-noi", "https://www.lonelyplanet.com/vietnam/hanoi/attractions/hoa-lo-prison-museum/a/poi-sig/1135683/357880"] }),
  stop({ id: "hanoi-activity-water-puppet", name: "Thang Long Water Puppet Theatre", coordinates: [21.03157, 105.85313], description: "Thang Long Water Puppet Theatre is tourist-facing but still worthwhile because the form is northern Vietnamese, musical, compact, and easy to understand without turning the night into a lecture. Buy tickets early if you care about sightlines, and check the official show schedule before planning dinner around it.", officialUrl: "https://thanglongwaterpuppet.com/", photo: images.waterPuppet, hours: "Showtimes vary by date and demand; verify the official performance calendar before going.", venueKind: "event_venue", subcategory: "theatre", attributeTags: ["theatre_show", "family_friendly", "tickets_required", "central"], editorialUrls: ["https://travelhanoi.org/place/thang-long-water-puppet/", "https://vietnam.travel/things-to-do/water-puppetry-vietnam"] }),
  stop({ id: "hanoi-activity-citadel", name: "Imperial Citadel of Thang Long", coordinates: [21.03546, 105.84045], description: "The Imperial Citadel of Thang Long gives Hanoi's deep capital history more space than the Old Quarter can provide, with archaeology, gates, bunkers, and palace remnants in a walkable compound. It rewards a slower visitor, so check open areas and exhibitions before treating it as a quick photo stop.", officialUrl: "https://hoangthanhthanglong.vn/", photo: images.citadel, hours: "Site hours, exhibitions, and holiday closures vary; verify the official citadel page before going.", venueKind: "culture", subcategory: "unesco_site", attributeTags: ["historic", "walking", "tickets_required", "family_friendly"], editorialUrls: ["https://whc.unesco.org/en/list/1328/", "https://vietnam.travel/places-to-go/northern-vietnam/ha-noi"] }),
  stop({ id: "hanoi-activity-ethnology", name: "Vietnam Museum of Ethnology", coordinates: [21.04039, 105.79832], description: "The Vietnam Museum of Ethnology earns a top-things slot because it widens the trip beyond Hanoi's central monuments and noodle lanes. The outdoor architecture exhibits make it especially good with kids or visual learners, but the location needs a deliberate taxi or ride-hail plan.", officialUrl: "https://vme.org.vn/", photo: images.ethnology, hours: "Museum opening days, outdoor areas, and holiday closures vary; verify the official museum page before going.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "family_friendly", "tickets_required", "educational"], editorialUrls: ["https://vietnam.travel/things-to-do/top-museums-vietnam", "https://www.lonelyplanet.com/vietnam/hanoi/attractions/vietnam-museum-of-ethnology/a/poi-sig/1135682/357880"] }),
  stop({ id: "hanoi-activity-west-lake", name: "West Lake and Tran Quoc Pagoda", coordinates: [21.04798, 105.83695], description: "West Lake changes the scale of Hanoi, trading Old Quarter compression for water, cafes, temples, villas, and a longer evening walk. Tran Quoc Pagoda gives the route a historic anchor, but dress and timing still matter because this is not just a backdrop.", officialUrl: "https://vietnam.travel/places-to-go/northern-vietnam/ha-noi", photo: images.westLake, hours: "Lake paths are public daily; Tran Quoc Pagoda visiting hours and religious closures vary, so verify before entering.", venueKind: "outdoors", subcategory: "lake_pagoda", attributeTags: ["scenic", "walking", "historic", "free_entry"], editorialUrls: ["https://www.lonelyplanet.com/vietnam/hanoi/attractions/west-lake/a/poi-sig/1135687/357880", "https://vietnam.travel/things-to-do/vietnam-temples-pagodas"] }),
  stop({ id: "hanoi-activity-bat-trang", name: "Bat Trang Ceramic Village", coordinates: [20.97787, 105.91271], description: "Bat Trang is the easiest craft escape from central Hanoi, useful when you want clay, kilns, market browsing, and a break from museum glass. It takes transit planning and works better as a half-day than a rushed add-on; verify workshop and market hours before going.", officialUrl: "https://vietnam.travel/things-to-do/bat-trang-ceramic-village", photo: images.batTrang, hours: "Village access is daily, but market, workshop, and demonstration hours vary by operator; verify current listings before going.", venueKind: "retail", subcategory: "craft_village", attributeTags: ["shopping_street", "family_friendly", "market", "day_trip"], editorialUrls: ["https://vietnam.travel/things-to-do/bat-trang-ceramic-village", "https://www.lonelyplanet.com/vietnam/hanoi/attractions/bat-trang-ceramic-village/a/poi-sig/1374952/357880"] }),
];

const editorial = {
  dining: [
    source("Top organic result: MICHELIN Guide Hanoi restaurants", "https://guide.michelin.com/vn/en/ha-noi/ha-noi_2974158/restaurants"),
    source("Time Out Hanoi - best restaurants", "https://www.timeout.com/hanoi/restaurants/best-restaurants-in-hanoi"),
    source("World's 50 Best Discovery - Hanoi", "https://www.theworlds50best.com/discovery/sitemap/Vietnam/Hanoi"),
    source("Lonely Planet Hanoi restaurants", "https://www.lonelyplanet.com/vietnam/hanoi/restaurants"),
    source("Google Maps - Hanoi best restaurants", maps("best restaurants Hanoi Vietnam")),
  ],
  cheap: [
    source("Top organic result: MICHELIN Guide Hanoi street food", "https://guide.michelin.com/vn/en/article/dining-out/guide-to-hanoi-street-food"),
    source("Vietnam Online - Hanoi restaurants", "https://www.vietnamonline.com/restaurant/hanoi.html"),
    source("Best Banh Mi Vietnam - Hanoi", "https://bestbanhmivietnam.com/cities/hanoi"),
    source("Lonely Planet Hanoi restaurants", "https://www.lonelyplanet.com/vietnam/hanoi/restaurants"),
    source("Google Maps - Hanoi cheap eats", maps("best cheap eats Hanoi Vietnam")),
  ],
  hotels: [
    source("Top organic result: CN Traveler Hanoi hotels", "https://www.cntraveler.com/gallery/best-hotels-in-hanoi"),
    source("MICHELIN Guide Hanoi hotels", "https://guide.michelin.com/us/en/hotels-stays/hanoi"),
    source("Google Travel - Hanoi hotels", "https://www.google.com/travel/hotels/Hanoi"),
    source("Booking.com Hanoi hotels", "https://www.booking.com/city/vn/hanoi.html"),
    source("Travel + Leisure World's Best Vietnam hotels", "https://www.travelandleisure.com/worlds-best/hotels-in-vietnam"),
  ],
  hostels: [
    source("Top organic result: Hostelworld Hanoi hostels", "https://www.hostelworld.com/hostels/Hanoi/Vietnam"),
    source("Nomadic Matt - best hostels in Hanoi", "https://www.nomadicmatt.com/travel-blogs/best-hostels-hanoi/"),
    source("The Broke Backpacker - Hanoi hostels", "https://www.thebrokebackpacker.com/best-hostels-in-hanoi-vietnam/"),
    source("Booking.com Hanoi hostels", "https://www.booking.com/hostels/city/vn/hanoi.html"),
    source("Google Travel - Hanoi hostels", "https://www.google.com/travel/hotels/Hanoi?q=hostels%20hanoi"),
  ],
  bars: [
    source("Top organic result: Time Out Hanoi bars", "https://www.timeout.com/hanoi/bars/best-bars-in-hanoi"),
    source("ArrivalGuides - Bia Hoi Corner", "https://www.arrivalguides.com/en/Travelguide/HANOI/barsandnightlife/bia-hoi-corner-111358"),
    source("Vietcetera craft beer Vietnam", "https://vietcetera.com/en/best-craft-beer-spots-in-vietnam"),
    source("Lonely Planet Hanoi nightlife", "https://www.lonelyplanet.com/vietnam/hanoi/nightlife"),
    source("Google Maps - Hanoi casual bars", maps("best casual bars Hanoi Vietnam")),
  ],
  cocktails: [
    source("Top organic result: Asia Bars Hanoi cocktail bars 2026", "https://www.asia-bars.com/2026/05/top-12-hanoi-cocktail-bars-visit-2026/"),
    source("Vietcetera - cocktail bars to know in Hanoi", "https://vietcetera.com/en/cocktail-bars-to-know-in-hanoi"),
    source("Asia's 50 Best Bars - The Haflington", "https://www.theworlds50best.com/bars/asia/the-list/the-haflington.html"),
    source("Capella Hanoi bar awards press", "https://capellahotels.com/assets/docs/hanoi/2025.02_%28Press_Release_-_English%29_CAPELLA_HANOI_SOLIDIFIES_STATUS_AS_VIETNAMS_PREMIER_GASTRONOMIC_DESTINATION_WITH_TRIO_OF_DISTINGUISHED_ACCOLADES_.pdf"),
    source("Google Maps - Hanoi cocktail bars", maps("best cocktail bars Hanoi Vietnam")),
  ],
  culture: [
    source("Top organic result: Vietnam Travel - Hanoi", "https://vietnam.travel/places-to-go/northern-vietnam/ha-noi"),
    source("Vietnam Travel - top museums in Vietnam", "https://vietnam.travel/things-to-do/top-museums-vietnam"),
    source("Lonely Planet Hanoi attractions", "https://www.lonelyplanet.com/vietnam/hanoi/attractions"),
    source("Go Discover Vietnam - Temple of Literature", "https://www.godiscovervietnam.com/attractions/temple-of-literature"),
    source("Google Maps - Hanoi museums culture", maps("best museums cultural sites Hanoi Vietnam")),
  ],
  activities: [
    source("Top organic result: Vietnam Travel - Hanoi", "https://vietnam.travel/places-to-go/northern-vietnam/ha-noi"),
    source("Lonely Planet Hanoi attractions", "https://www.lonelyplanet.com/vietnam/hanoi/attractions"),
    source("UNESCO - Central Sector of the Imperial Citadel of Thang Long", "https://whc.unesco.org/en/list/1328/"),
    source("Go Discover Vietnam - Hoan Kiem Lake", "https://www.godiscovervietnam.com/attractions/hoan-kiem-lake"),
    source("Google Maps - Hanoi things to do", maps("best things to do Hanoi Vietnam")),
  ],
};

const sources = {
  dining: [...editorial.dining, ...diningStops.map((item) => source(`${item.name} source`, item.officialUrl ?? maps(item.name)))],
  cheap: [...editorial.cheap, ...cheapEatStops.map((item) => source(`${item.name} source`, item.officialUrl ?? maps(item.name)))],
  hotels: [...editorial.hotels, ...hotelStops.map((item) => source(`${item.name} source`, item.officialUrl ?? maps(item.name)))],
  hostels: [...editorial.hostels, ...hostelStops.map((item) => source(`${item.name} source`, item.bookingUrl ?? item.officialUrl ?? maps(item.name)))],
  bars: [...editorial.bars, ...casualBarStops.map((item) => source(`${item.name} source`, item.officialUrl ?? maps(item.name)))],
  cocktails: [...editorial.cocktails, ...cocktailStops.map((item) => source(`${item.name} source`, item.officialUrl ?? maps(item.name)))],
  culture: [...editorial.culture, ...cultureStops.map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  activities: [...editorial.activities, ...activityStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
};

function guide(category: ListCategory, id: string, slug: string, seoSlug: string, title: string, description: string, stops: GuideStop[], guideSources: ListSource[], seoTitle: string, seoDescription: string): MapList {
  return {
    id,
    slug,
    seoSlug,
    seoTitle,
    seoDescription,
    title,
    description,
    url: maps(`${title} Hanoi Vietnam`),
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

export const hanoiCitywideGuides: MapList[] = [
  guide("Food", "list-hanoi-best-restaurants", "hanoi-best-restaurants", "best-restaurants", "Destination Dining & Modern Vietnamese", "A citywide Hanoi dining guide for tasting menus, northern home cooking, cha ca, bun cha, and pho, with source-backed hours caveats and route-useful judgment instead of a generic Old Quarter checklist.", diningStops, sources.dining, "Best Restaurants in Hanoi for Modern Vietnamese, Cha Ca, Bun Cha, and Pho", "Source-backed Hanoi restaurant guide with MICHELIN picks, northern Vietnamese cooking, classic noodle rooms, and practical booking notes."),
  guide("Food", "list-hanoi-cheap-eats", "hanoi-best-cheap-eats", "best-cheap-eats", "Iconic Street Food & Cafe Culture", "A cheap-to-medium Hanoi food guide for banh mi, egg coffee, sticky rice, bun cha, and banh cuon, built around useful stops that keep a walking day fed without turning every meal into a reservation.", cheapEatStops, sources.cheap, "Best Cheap Eats in Hanoi for Banh Mi, Egg Coffee, Bun Cha, Pho, and Street Food", "Budget Hanoi food guide with current-status evidence, source-backed hours, and practical stop descriptions for Old Quarter and central routes."),
  guide("Stay", "list-hanoi-best-hotels", "hanoi-best-hotels", "best-hotels", "Curated Hotels & Boutique Stays", "A hotel-only Hanoi stay guide that separates French Quarter splurges, lake-facing comfort, Old Quarter boutiques, and Accor reliability so travelers can choose a base by route, budget, and sleep needs.", hotelStops, sources.hotels, "Best Hotels in Hanoi for French Quarter Luxury, Hoan Kiem Views, and Old Quarter Access", "Hotel-only Hanoi guide with official booking evidence, neighborhood tradeoffs, price context, and source-backed property notes."),
  guide("Stay", "list-hanoi-best-hostels", "hanoi-best-hostels", "best-hostels", "Old Quarter Hostels", "A hostel-only Hanoi stay guide for social dorms, flashpacker comfort, private-room options, and Old Quarter beds that make early tours, food walks, and cheap nights easier to plan.", hostelStops, sources.hostels, "Best Hostels in Hanoi for Old Quarter Dorms, Private Rooms, and Social Budget Stays", "Hanoi hostel guide with Hostelworld and official booking evidence, room-type caveats, and practical noise and check-in notes."),
  guide("Nightlife", "list-hanoi-best-bars", "hanoi-best-bars", "best-bars", "Bia Hoi Corners & Live Jazz", "A casual Hanoi nightlife guide for sidewalk bia hoi, craft beer, lake-adjacent taprooms, jazz, and low-key cafe-bars that work before or instead of a cocktail reservation.", casualBarStops, sources.bars, "Best Bars in Hanoi for Bia Hoi, Craft Beer, Jazz, and Casual Nights", "Source-backed Hanoi casual bar guide with current-status evidence, price context, and route-useful caveats."),
  guide("Nightlife", "list-hanoi-best-cocktail-bars", "hanoi-best-cocktail-bars", "best-cocktail-bars", "Craft Cocktails & Hidden Bars", "A cocktail-focused Hanoi guide for award-listed rooms, Old Quarter speakeasy energy, Vietnamese ingredient-driven menus, and hotel-bar polish, with booking and timing caveats where the night depends on them.", cocktailStops, sources.cocktails, "Best Cocktail Bars in Hanoi for Award-Winning Drinks, Speakeasy Rooms, and Rooftop Nights", "Hanoi cocktail guide with Asia Bars, Vietcetera, Asia's 50 Best Bars, official pages, and current map evidence."),
  guide("Culture", "list-hanoi-best-culture", "hanoi-best-culture", "best-culture", "Heritage: Old Capital Texture", "A Hanoi culture guide for the Temple of Literature, Hoa Lo, ethnology, women's history, and Vietnamese art, built to give the city more depth than food crawls and lake photos alone.", cultureStops, sources.culture, "Best Culture in Hanoi for Museums, Historic Sites, Art, and Vietnamese Memory", "Source-backed Hanoi culture guide with official museum evidence, ticket-hour caveats, and practical pairing notes."),
  guide("Activities", "list-hanoi-best-things-to-do", "hanoi-best-things-to-do", "best-things-to-do", "The Essential 10 Stops", "A top-things Hanoi guide with 10 strong stops across lakes, old streets, monuments, museums, performance, UNESCO history, West Lake, and Bat Trang, paced for real routing rather than attraction dumping.", activityStops, sources.activities, "Top Things to Do in Hanoi With 10 Strong Stops", "Ten source-backed Hanoi things to do, from Hoan Kiem and the Old Quarter to Hoa Lo, Thang Long water puppets, West Lake, and Bat Trang."),
];
