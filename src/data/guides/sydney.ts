import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

const createdAt = "2026-07-14T00:00:00.000Z";
const checkedAt = "2026-07-14";

const sydneyLocation = {
  city: "Sydney",
  country: "Australia",
  continent: "Oceania",
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

type StopOptions = Partial<GuideStop> & {
  sourcePhoto: string;
  officialUrl: string;
  editorialUrls?: string[];
  mapQuery?: string;
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
    officialUrl,
    editorialUrls = [],
    mapQuery,
    bookingUrl,
    sourceEvidence,
    imageSourceUrl,
    sourceUrls: extraSourceUrls = [],
    ...rest
  } = options;
  const mapUrl = sourceEvidence?.mapUrl ?? maps(mapQuery ?? `${name} Sydney Australia`);
  const imageUrl = imageSourceUrl ?? sourcePhoto;
  const officialEvidence = sourceEvidence?.officialUrl ?? officialUrl ?? bookingUrl;
  const sourceUrls = [
    officialEvidence,
    mapUrl,
    imageUrl,
    ...editorialUrls,
    ...extraSourceUrls,
  ].filter(Boolean) as string[];

  return {
    id,
    name,
    coordinates,
    description,
    photo: sourcePhoto,
    imageSourceUrl: imageUrl,
    sourceUrls: [...new Set(sourceUrls)],
    sourceEvidence: {
      officialUrl: officialEvidence,
      mapUrl,
      currentStatusUrl: sourceEvidence?.currentStatusUrl ?? officialEvidence,
      imageSourceUrl: imageUrl,
      editorialUrls,
      checkedAt,
      notes:
        "Checked against an official venue or operator page, current map evidence, and category sources on 2026-07-14; candidates with current closure notices were excluded.",
      ...sourceEvidence,
    },
    officialUrl,
    ...(bookingUrl ? { bookingUrl } : {}),
    ...rest,
  };
}

const images = {
  operaHouseExterior: commons("Exterior of Sydney Opera House.jpg"),
  operaHouse: commons("Sydney Opera House interior tour, 2023, 20.jpg"),
  artGalleryNsw:
    "https://www.datocms-assets.com/42890/1747100306-exterior-view-of-art-gallery-of-new-south-wales-south-building-photo-art-gallery-of-new-south-wales-jenni-carter-2-1.jpg?fit=max&iptc=allow&w=1500",
  australianMuseum: commons("The Australian Museum, Sydney (16156731238).jpg"),
  mca: "https://www.mca.com.au/files/uploads/images/MCA_Australia_photo_Brett_Boardman_LR.jpg",
  maritimeMuseum:
    "https://cms-web-media.seamuseum.net/public/styles/opengraph/public/2024-08/anmm20_0911009-arriving-crop_0.jpg?itok=EiOM774w&v=4d4df3260dec",
  chauChakWing:
    "https://www.sydney.edu.au/content/dam/corporate/images/chau-chak-wing-museum/the-student_001.jpg",
  whiteRabbit:
    "https://whiterabbitcollection.org/wp-content/uploads/2021/08/2015.031_chen20yu-lin-5-1125x750.jpg",
  stateLibrary: commons("Mitchell Building Reading Room State Library NSW 2023.jpg"),
  hydeParkBarracks:
    "https://images.slm.com.au/fotoweb/embed/2023/08/fc507a60bb944ec9bdfea4c69851143e.jpg",
  carriageworks:
    "https://carriageworks.com.au/wp-content/uploads/CFM-Twilight-Market-848x477.jpg",
  bridgeClimb: commons("People climbing Sydney Harbour Bridge.jpg"),
  botanicGarden: commons("Royal Botanic Garden (27646006976).jpg"),
  tarongaZoo:
    "https://www.taronga.org.au/siteassets/tzs/tiger-trek-taronga-zoo-sydney-2022_03_09_2022-08_51_24.jpg",
  coastalWalk:
    "https://www.sydney.com/sites/sydney/files/styles/open_graph_image/public/2024-02/170928_0.jpg?itok=Kco8cRgH",
  manlyFerry: commons("Sydney Ferry. (51748371442).jpg"),
  cockatooIsland:
    "https://www.harbourtrust.gov.au/media/snqbnwwp/cockatoo-island-cranes-fitzroy-dock_1920x1080.jpg",
  barangaroo:
    "https://www.barangaroo.com/getmedia/78204ed4-55c1-4dfc-943d-2cb674262e5e/barangaroo-reserve.jpg",
  bondiIcebergs: commons("Bondi Icebergs (5848281116).jpg"),
  bridgeMuseum:
    "https://www.bridgemuseum.com.au/getContentAsset/ce666df0-880d-4ab2-ab6e-8b3d03ffb535/13b2d5a9-667d-4ebd-8eb2-a38833e560ad/BridgeMuseum-HomeHero3.jpg?language=en-AU",
};

const sources = {
  dining: [
    source("Time Out — Best restaurants in Sydney", "https://www.timeout.com/sydney/restaurants/the-best-restaurants-in-sydney"),
    source("Broadsheet — Best restaurants in Sydney", "https://www.broadsheet.com.au/sydney/guides/best-restaurants"),
    source("Gourmet Traveller — Best restaurants in Sydney", "https://www.gourmettraveller.com.au/dining-out/restaurant-guide/best-restaurants-sydney-4475/"),
    source("Australian Traveller — Best Sydney restaurants", "https://www.australiantraveller.com/nsw/sydney/best-restaurants-sydney/"),
    source("The Infatuation — Best restaurants in Sydney", "https://www.theinfatuation.com/sydney/guides/best-restaurants-sydney"),
    source("Australian Good Food Guide — Sydney awards", "https://www.agfg.com.au/awards/sydney"),
    source("OpenTable — Sydney restaurants", "https://www.opentable.com.au/metro/sydney-restaurants"),
    source("OpenTable — Good Food Guide", "https://www.opentable.com.au/lists/good-food-guide"),
    source("Urban List — Best restaurants in Sydney", "https://www.theurbanlist.com/sydney/a-list/best-restaurants-sydney"),
    source("Sitchu — Best restaurants in Sydney", "https://sitchu.com.au/sydney/restaurants/best-restaurants-sydney"),
    source("Best Restaurants — Sydney fine dining", "https://www.bestrestaurants.com.au/best-guides/best-eats/best-fine-dining-in-sydney/"),
    source("World's 50 Best Discovery — Sydney", "https://www.theworlds50best.com/discovery/"),
  ],
  cheapEats: [
    source("Time Out — Best cheap eats in Sydney", "https://www.timeout.com/sydney/restaurants/the-best-cheap-eats-in-sydney"),
    source("OpenTable — Affordable Sydney restaurants", "https://www.opentable.com.au/lists/best-affordable-restaurants-sydney"),
    source("Urban List — Best cheap eats in Sydney", "https://www.theurbanlist.com/sydney/a-list/best-cheap-eats-sydney"),
    source("Sitchu — Best cheap eats in Sydney", "https://sitchu.com.au/sydney/restaurants/best-cheap-eats-sydney"),
    source("Sydney Travel Guide — Cheap eats", "https://www.sydneytravelguide.com.au/best-cheap-eats-sydney/"),
    source("Best Restaurants — Best cheap eats in Sydney", "https://www.bestrestaurants.com.au/best-guides/best-eats/best-cheap-eats-in-sydney/"),
    source("Tripadvisor — Cheap eats in Sydney", "https://www.tripadvisor.com.au/Restaurants-g255060-zfp16-Sydney_New_South_Wales.html"),
    source("Wanderlog — Affordable Sydney restaurants", "https://wanderlog.com/list/geoCategory/1529547/best-affordable-restaurants-in-sydney"),
    source("Dine Guides — Sydney cheap eats", "https://dineguides.com/sydney/cheap-eats"),
    source("The Infatuation — Best restaurants in Sydney", "https://www.theinfatuation.com/sydney/guides/best-restaurants-sydney"),
    source("Concrete Playground — Sydney CBD eats under $20", "https://concreteplayground.com/sydney/best-of/the-best-cheap-eats-under-20-you-can-find-in-sydneys-cbd/amp"),
    source("Sydney Tourism — Cheap eats", "https://www.sydneytourism.org/cheap-eats-in-sydney/"),
  ],
  culture: [
    source(
      "Time Out — Best museums in Sydney (3 February 2026)",
      "https://www.timeout.com/sydney/museums/the-best-museums-in-sydney",
    ),
    source(
      "NSW Government — Arts, culture and heritage",
      "https://www.nsw.gov.au/visiting-and-exploring-nsw/experience-arts-culture-and-heritage",
    ),
    source(
      "Sydney.com — Museums",
      "https://www.sydney.com/things-to-do/arts-and-culture/museums",
    ),
    source("Sydney Opera House — contact and opening hours", "https://www.sydneyoperahouse.com/contact-us"),
    source("Art Gallery of New South Wales — visit", "https://www.artgallery.nsw.gov.au/visit-us/"),
    source("Australian Museum — visit", "https://australian.museum/visit/"),
    source("Museum of Contemporary Art Australia — official", "https://www.mca.com.au/"),
    source("Australian National Maritime Museum — visit", "https://www.sea.museum/en/visit"),
    source(
      "Chau Chak Wing Museum — visit",
      "https://www.sydney.edu.au/museum/whats-on/visit.html",
    ),
    source("White Rabbit Gallery — visit", "https://whiterabbitcollection.org/visit/"),
    source("State Library of New South Wales — opening hours", "https://www.sl.nsw.gov.au/visit-us/opening-hours"),
    source("Hyde Park Barracks — plan your visit", "https://mhnsw.au/visit-us/hyde-park-barracks/plan-your-visit/"),
    source("Carriageworks — visit", "https://carriageworks.com.au/visit/"),
    source("Google Maps — Sydney museums and galleries", maps("best museums and galleries Sydney Australia")),
  ],
  activities: [
    source(
      "Time Out — Best things to do in Sydney (2026)",
      "https://www.timeout.com/sydney/things-to-do/things-to-do-in-sydney-at-least-once-in-your-life?mrfcid=2026040669c9e2e2f7115417d68d7faf",
    ),
    source("Sydney.com — official visitor guide", "https://www.sydney.com/?redirect=true"),
    source("Sydney Opera House — tours", "https://www.sydneyoperahouse.com/tours"),
    source("BridgeClimb Sydney — official", "https://www.bridgeclimb.com/"),
    source(
      "Royal Botanic Garden Sydney — plan your visit",
      "https://www.botanicgardens.org.au/royal-botanic-garden-sydney/plan-your-visit",
    ),
    source("Taronga Zoo Sydney — visitor information", "https://www.taronga.org.au/sydney-zoo/plan/visitor-information"),
    source(
      "Randwick City Council — Coastal Walkway",
      "https://www.randwick.nsw.gov.au/facilities-and-recreation/explore-randwick-city/coastal-walkway",
    ),
    source("Transport for NSW — F1 Manly ferry timetable", "https://transportnsw.info/routes/details/sydney-ferries/f1/090F1"),
    source("Harbour Trust — Cockatoo Island / Wareamah", "https://www.harbourtrust.gov.au/our-places/cockatoo-island/"),
    source("Barangaroo — Barangaroo Reserve", "https://www.barangaroo.com/precincts/barangaroo-reserve"),
    source("Bondi Icebergs — pool conditions", "https://icebergs.com.au/pool-conditions/"),
    source("BridgeMuseum — plan your visit", "https://www.bridgemuseum.com.au/plan-your-visit"),
    source("Google Maps — top Sydney attractions", maps("top attractions Sydney Australia")),
  ],
  hotels: [
    source(
      "Time Out — 28 Best Hotels in Sydney (26 June 2026)",
      "https://www.timeout.com/sydney/travel/the-best-hotels-in-sydney",
    ),
    source(
      "Condé Nast Traveler — 10 Best Hotels in Sydney (23 March 2026)",
      "https://www.cntraveler.com/gallery/best-hotels-in-sydney",
    ),
    source(
      "Travel + Leisure — Sydney guide (14 June 2026)",
      "https://www.travelandleisure.com/travel-guide/sydney",
    ),
    source("Sydney.com — Accommodation in Sydney", "https://www.sydney.com/accommodation"),
    source("Booking.com — Sydney hotels", "https://www.booking.com/city/au/sydney.html"),
    source("Capella Sydney — official", "https://capellahotels.com/en/capella-sydney"),
    source(
      "Park Hyatt Sydney — official",
      "https://www.hyatt.com/park-hyatt/en-US/sydph-park-hyatt-sydney",
    ),
    source(
      "Manly Pacific Sydney MGallery Collection — official",
      "https://manlypacific.com.au/",
    ),
    source("The EVE Hotel Sydney — official", "https://theevehotel.com.au/"),
    source(
      "Pier One Sydney Harbour — official",
      "https://www.pieronesydneyharbour.com.au/",
    ),
    source(
      "The Old Clare Hotel — official Ode Hotels",
      "https://www.odehotels.com/the-old-clare-hotel/",
    ),
    source(
      "25hours Hotel Sydney The Olympia — official",
      "https://25hours-hotels.com/sydney/the-olympia/",
    ),
    source("Ace Hotel Sydney — official", "https://acehotel.com/sydney/"),
    source(
      "The Langham, Sydney — official",
      "https://www.langhamhotels.com/en/the-langham/sydney/",
    ),
    source("Paramount House Hotel — official", "https://paramounthousehotel.com/"),
  ],
  hostels: [
    source(
      "Hostelworld — Sydney hostels 2026",
      "https://www.hostelworld.com/hostels/oceania/australia/sydney/",
    ),
    source(
      "Hostelz — Best Hostels in Sydney 2026",
      "https://www.hostelz.com/hostels/Australia/Sydney/best-hostels",
    ),
    source(
      "Sydney.com — Backpackers and Hostels",
      "https://www.sydney.com/accommodation/backpackers-and-hostels",
    ),
    source(
      "Nomadic Matt — Top 9 Sydney Hostels (1 April 2026)",
      "https://www.nomadicmatt.com/travel-blogs/best-hostels-sydney/",
    ),
    source(
      "Nomadic Mick — 12 Best Sydney Hostels (27 June 2026)",
      "https://www.nomadicmick.com/best-hostels-in-sydney/",
    ),
    source("Wake Up! Sydney Central — official", "https://wakeup.com.au/sydney/"),
    source("Wake Up! Bondi Beach — official", "https://wakeup.com.au/bondibeach/"),
    source(
      "YHA Sydney Harbour — official",
      "https://www.yha.com.au/hostels/nsw/sydney-surrounds/sydney-harbour/",
    ),
    source("The Pacific House — official", "https://www.thepacifichouse.com/"),
    source(
      "Mad Monkey Coogee Beach — official",
      "https://www.madmonkeycoogeebeach.com/",
    ),
    source(
      "Tequila Sunrise Sydney Central — official",
      "https://www.tequilasunrisehostels.com/sydney-central-hostel",
    ),
    source("Nate’s Place — official", "https://natesplace.com.au/"),
    source(
      "Nomads Sydney — official",
      "https://nomadsworld.com/australia/nomads-sydney/",
    ),
    source(
      "Mad Monkey Bayswater — official",
      "https://www.madmonkey.com.au/locations/australia/sydney/mad-monkey-bayswater",
    ),
    source("Stoke Beach House — official", "https://www.stokebeachhouse.com.au/"),
  ],
  pubs: [
    source("Time Out — Best pubs in Sydney", "https://www.timeout.com/sydney/bars/the-best-pubs-in-sydney"),
    source("Concrete Playground — Best Sydney pubs 2026", "https://concreteplayground.com/sydney/best-of/best-pubs-sydney"),
    source("Broadsheet — Best pubs in Sydney", "https://www.broadsheet.com.au/sydney/guides/best-pubs"),
    source("Urban List — Best pubs in Sydney", "https://www.theurbanlist.com/sydney/a-list/best-pubs-sydney"),
    source("Sydney.com — Sydney bars and pubs", "https://www.sydney.com/things-to-do/food-and-drink/bars-and-pubs"),
    source("Mary's Newtown — official", "https://www.marys.wtf/locations/newtown/"),
    source("Arcadia Liquors — official", "https://www.arcadialiquors.com/"),
    source("Tio's — official", "https://www.muchogroup.com.au/tios"),
    source("The Duke of Enmore — official", "https://www.oddculture.group/venue/duke"),
    source("The Courty — official", "https://thecourty.com.au/"),
    source("Lord Gladstone — official", "https://www.lordgladstone.com.au/menu"),
    source("The Townie — official", "https://townhallhotelnewtown.com/contact"),
    source("The Old Fitzroy Hotel — official", "https://www.oddculture.group/venue/the-old-fitzroy-hotel"),
    source("Google Maps — Sydney pubs and casual bars", maps("best pubs and casual bars Sydney Australia")),
  ],
  cocktails: [
    source("Time Out — Best bars in Sydney 2026", "https://www.timeout.com/sydney/bars/the-best-bars-in-sydney-2023"),
    source("Broadsheet — Best cocktails in Sydney", "https://www.broadsheet.com.au/sydney/guides/best-cocktails"),
    source("Concrete Playground — Best cocktail bars in Sydney", "https://concreteplayground.com/sydney/pinboard/the-best-cocktail-bars-in-sydney"),
    source("Urban List — Best bars in Sydney", "https://www.theurbanlist.com/sydney/a-list/best-bars-sydney"),
    source("Sydney.com — Best bars in Sydney", "https://www.sydney.com/articles/best-bars-in-sydney"),
    source("World's 50 Best Bars — Maybe Sammy", "https://www.theworlds50best.com/bars/best-in-the-world/the-list/maybe-sammy.html"),
    source("Maybe Sammy — official", "https://www.maybesammy.com/home"),
    source("Cantina OK! — official", "https://www.muchogroup.com.au/cantina-ok"),
    source("Razz Room — official", "https://www.oddculture.group/venue/razz-room"),
    source("Old Mate's Place — official", "https://www.oldmatesplace.com/"),
    source("Bar Planet — official", "https://www.muchogroup.com.au/bar-planet"),
    source("Bar Conte — official", "https://barconte.com.au/"),
    source("Eau-de-Vie Sydney — official", "https://eaudevie.com.au/sydney"),
    source("Apollonia — official", "https://apollonia.sydney/"),
    source("The Lobo — official", "https://www.thelobo.com.au/"),
    source("Google Maps — Sydney cocktail bars", maps("best cocktail bars Sydney Australia")),
  ],
};

const diningStops: GuideStop[] = [
  stop("sydney-dining-saint-peter", "Saint Peter", [-33.8864902, 151.2318354], "Josh Niland's Paddington dining room treats fish from fin to scale through exacting but expressive cooking, making the tasting menu a distinct Sydney seafood experience.", {
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["modern_australian", "seafood", "fine_dining"], price: "$$$$", priceSource: "Official menu: A$195 lunch choice menu and A$395 ten-course dinner", attributeTags: ["tasting_menu", "seafood", "sustainable_sourcing", "special_occasion", "reservation_required"],
    hours: { default: "Monday-Wednesday dinner reservations from 5:30 PM; Thursday-Sunday lunch reservations from 12:00 PM and dinner reservations from 5:30 PM; exact final seatings follow the official booking calendar." },
    officialUrl: "https://www.saintpeter.com.au/", bookingUrl: "https://www.saintpeter.com.au/", sourcePhoto: "https://images.squarespace-cdn.com/content/v1/56b1581001dbae20b9c6edb1/8a6805b1-c9c9-4680-9b4e-ddd1f8a3646d/THE%2BGRAND%2BNATIONAL%2BAUG-177%2B%281%29.jpg", editorialUrls: ["https://www.timeout.com/sydney/restaurants/the-best-restaurants-in-sydney", "https://www.broadsheet.com.au/sydney/guides/best-restaurants", "https://www.agfg.com.au/awards/sydney"],
  }),
  stop("sydney-dining-sixpenny", "Sixpenny", [-33.8925557, 151.1647498], "A seven-course contemporary Australian menu draws on small producers, house koji, and fermentation in an intimate Stanmore terrace where advance booking is essential.", {
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["modern_australian", "tasting_menu"], price: "$$$$", priceSource: "Official service page: A$290 menu when checked", attributeTags: ["tasting_menu", "fermentation", "local_produce", "reservation_required", "special_occasion"],
    hours: { mon: "Closed", tue: "Closed", wed: "6:00 PM-10:00 PM", thu: "6:00 PM-10:00 PM", fri: "6:00 PM-10:00 PM", sat: "12:00 PM-4:00 PM and 6:30 PM-10:00 PM", sun: "12:00 PM-4:00 PM" },
    officialUrl: "https://www.sixpenny.com.au/", bookingUrl: "https://www.sixpenny.com.au/services", sourcePhoto: "https://lirp.cdn-website.com/54e70cf0/dms3rep/multi/opt/SIX%2B120%2Btony%2Band%2BDan-1920w.jpg?dm-skip-opt=true", editorialUrls: ["https://www.opentable.com.au/r/sixpenny-stanmore", "https://www.agfg.com.au/awards/sydney", "https://www.timeout.com/sydney/restaurants/the-best-restaurants-in-sydney"],
    sourceEvidence: { notes: "Open with live reservations when checked. A planned 17 August-2 September 2026 break and post-break menu change are disclosed on the official service page." },
  }),
  stop("sydney-dining-ester", "Ester", [-33.8875268, 151.2008676], "Wood-fired, produce-led modern Australian sharing plates and natural wine fill a relaxed Chippendale warehouse that feels polished without becoming ceremonious.", {
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["modern_australian", "wood_fired"], price: "$$$", priceSource: "Official menu and current OpenTable listing", attributeTags: ["wood_fired", "share_plates", "natural_wine", "date_night", "walk_ins"],
    hours: { mon: "5:00 PM-10:00 PM", tue: "Closed", wed: "Closed", thu: "5:00 PM-10:00 PM", fri: "5:00 PM-10:00 PM", sat: "12:00 PM-4:00 PM and 5:00 PM-10:00 PM", sun: "12:00 PM-3:30 PM" },
    officialUrl: "https://ester-restaurant.com.au/", bookingUrl: "https://ester-restaurant.com.au/", sourcePhoto: "https://images.squarespace-cdn.com/content/v1/64afc9d4b8061b07b3f0f4ce/c270abc5-e6a1-4941-97a1-78314f9664a7/oven%2B2.jpg", editorialUrls: ["https://www.timeout.com/sydney/restaurants/the-best-restaurants-in-sydney", "https://www.broadsheet.com.au/sydney/guides/best-restaurants", "https://www.opentable.com.au/r/ester-chippendale"],
  }),
  stop("sydney-dining-firedoor", "Firedoor", [-33.8815728, 151.2098878], "Two wood ovens, three grills, and a hearth drive a daily changing Australian menu whose produce and fire management matter more than theatrical smoke.", {
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["modern_australian", "wood_fired", "tasting_menu"], price: "$$$$", priceSource: "Official menu: A$155 lunch when checked", attributeTags: ["wood_fired", "open_kitchen", "tasting_menu", "local_produce", "reservation_required"],
    hours: { mon: "Closed", tue: "Closed", wed: "5:00 PM-11:00 PM", thu: "5:00 PM-11:00 PM", fri: "12:00 PM-4:00 PM and 5:00 PM-11:00 PM", sat: "12:00 PM-4:00 PM and 5:00 PM-11:00 PM", sun: "Closed" },
    officialUrl: "https://firedoor.com.au/", bookingUrl: "https://firedoor.com.au/", sourcePhoto: "https://firedoor.com.au/wp-content/uploads/2026/06/2024_11_28-Firedoor-x-Buffet-Digital-T.Wholohan_068-1.jpg", editorialUrls: ["https://www.timeout.com/sydney/restaurants/firedoor", "https://www.broadsheet.com.au/sydney/surry-hills/restaurants/firedoor", "https://www.waze.com/live-map/directions/australia/new-south-wales/haymarket/firedoor-restaurant?to=place.ChIJxbaPgCKuEmsRvVMgpCiKpso"],
  }),
  stop("sydney-dining-bennelong", "Bennelong", [-33.8574844, 151.2147045], "Peter Gilmore's produce-led Australian cooking occupies the Opera House sails, pairing a singular architectural setting with a genuinely destination-worthy three-course meal.", {
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["modern_australian", "fine_dining"], price: "$$$$", priceSource: "Official and OpenTable menus: A$235 three courses when checked", attributeTags: ["harbor_view", "iconic_setting", "pre_theatre", "australian_produce", "reservation_required"],
    hours: { default: "Friday-Sunday lunch reservation arrivals 12:00 PM-2:00 PM; Sunday-Thursday dinner arrivals 5:30 PM-8:45 PM; Friday-Saturday dinner arrivals 5:30 PM-9:15 PM." },
    officialUrl: "https://www.bennelong.com.au/", bookingUrl: "https://www.bennelong.com.au/", sourcePhoto: "https://www.bennelong.com.au/wp-content/uploads/2024/08/About-AreasOfBennelong-MDR.jpg", editorialUrls: ["https://www.sydneyoperahouse.com/visit/eat-drink/bennelong", "https://www.opentable.com.au/r/bennelong-restaurant-sydney", "https://www.theworlds50best.com/discovery/Establishments/Australia/Sydney/Bennelong.html"],
  }),
  stop("sydney-dining-margaret", "Margaret", [-33.876866, 151.241543], "Neil Perry's Double Bay dining room makes traceable meat, wild seafood, and producer relationships visible across a polished menu built for sharing.", {
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["modern_australian", "steak", "seafood"], price: "$$$$", priceSource: "Official menu and current OpenTable listing", attributeTags: ["producer_led", "steak", "seafood", "special_occasion", "wheelchair_accessible"],
    hours: { mon: "Closed", tue: "Closed", wed: "6:00 PM-11:00 PM", thu: "12:00 PM-11:00 PM", fri: "12:00 PM-11:00 PM", sat: "12:00 PM-11:00 PM", sun: "12:00 PM-10:00 PM" },
    officialUrl: "https://themargaretfamily.com/venue/margaret/", bookingUrl: "https://themargaretfamily.com/venue/margaret/", sourcePhoto: "https://www.datocms-assets.com/127859/1715669450-rws_4498.jpg?auto=format&w=2048", editorialUrls: ["https://www.timeout.com/sydney/restaurants/margaret", "https://www.gourmettraveller.com.au/restaurant-reviews/margaret-sydney-review-20181/", "https://www.opentable.com/r/margaret-double-bay"],
  }),
  stop("sydney-dining-hubert", "Restaurant Hubert", [-33.8651583, 151.2103039], "A candlelit subterranean dining room serves French classics with selective Asian detail while live jazz and cabaret turn dinner into a full evening.", {
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["french", "modern_asian"], price: "$$$", priceSource: "Official restaurant menu", attributeTags: ["live_jazz", "romantic", "late_night", "walk_ins", "groups"],
    hours: { default: "Daily lunch reservations from 12:00 PM and dinner reservations from 5:00 PM; exact final seatings and event-room access follow the official reservation calendar." },
    officialUrl: "https://swillhouse.com/venues/restaurant-hubert/", bookingUrl: "https://swillhouse.com/venues/restaurant-hubert/", sourcePhoto: "https://swillhouse.com/wp-content/uploads/2023/12/venue-banner-hubert.jpg", editorialUrls: ["https://www.sydney.com/destinations/sydney/sydney-city/city-centre/food-and-drink/restaurant-hubert", "https://www.timeout.com/sydney/restaurants/restaurant-hubert", "https://www.broadsheet.com.au/sydney/cbd/restaurants/restaurant-hubert"],
  }),
  stop("sydney-dining-cafe-paci", "Cafe Paci", [-33.89303, 151.18372], "Pasi Petanen folds Finnish and Scandinavian references into Italian-leaning modern cooking, giving Newtown a neighborhood restaurant defined by inventive combinations rather than genre labels.", {
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["modern_australian", "scandinavian", "italian"], price: "$$$", priceSource: "Official reservations page: A$100 set menu for groups of six or more", attributeTags: ["neighborhood_gem", "date_night", "creative", "set_menu_groups"],
    hours: { mon: "5:30 PM-10:00 PM", tue: "5:30 PM-10:00 PM", wed: "5:30 PM-10:00 PM", thu: "5:30 PM-10:00 PM", fri: "5:30 PM-10:00 PM", sat: "12:00 PM-2:30 PM and 5:30 PM-10:00 PM", sun: "Closed" },
    officialUrl: "https://www.cafepaci.com.au/", bookingUrl: "https://www.cafepaci.com.au/reservations", sourcePhoto: "https://images.squarespace-cdn.com/content/v1/5cfe41d8a7117c0001748aeb/1590410229008-H9E18WOPK0LQQP8EHPL8/GL_Paci_DSCF5943.jpg", editorialUrls: ["https://www.broadsheet.com.au/sydney/newtown/restaurants/cafe-paci", "https://www.theurbanlist.com/sydney/directory/cafe-paci", "https://www.cafepaci.com.au/reservations"],
  }),
  stop("sydney-dining-aalia", "AALIA", [-33.8687546, 151.209326], "Historic Arabic cookbooks inform lesser-known Middle Eastern and North African dishes in a dramatic Martin Place room suited to business lunches and special occasions.", {
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["middle_eastern", "north_african"], price: "$$$", priceSource: "Official restaurant menus", attributeTags: ["business_lunch", "share_plates", "wine_room", "special_occasion"],
    hours: { mon: "12:00 PM-2:00 PM and 5:30 PM-9:00 PM", tue: "12:00 PM-2:00 PM and 5:30 PM-9:00 PM", wed: "12:00 PM-2:00 PM and 5:30 PM-9:00 PM", thu: "12:00 PM-2:00 PM and 5:30 PM-9:00 PM", fri: "12:00 PM-2:00 PM and 5:30 PM-9:00 PM", sat: "5:00 PM-9:30 PM", sun: "Closed" },
    officialUrl: "https://www.aaliarestaurant.com/", bookingUrl: "https://www.aaliarestaurant.com/", sourcePhoto: "https://cdn.sanity.io/images/quf0k1c7/production/098d6e13882ffe77ba5da171fee05eebec6c7173-1800x1200.webp?auto=format&w=2400", editorialUrls: ["https://www.timeout.com/sydney/restaurants/aalia", "https://www.broadsheet.com.au/sydney/food-and-drink/article/paul-farag-aalia-news", "https://www.tripadvisor.com.au/Restaurant_Review-g255060-d23885299-Reviews-Aalia_Restaurant-Sydney_New_South_Wales.html"],
    sourceEvidence: { notes: "Open with a current official menu and recent reviews when checked. Founding chef Paul Farag departed in March 2026, so this description does not attribute current cooking to him." },
  }),
  stop("sydney-dining-fratelli-paradiso", "Fratelli Paradiso", [-33.868808, 151.2252022], "Since 2001, this Potts Point trattoria has paired a seasonal blackboard of Italian classics with organically focused wine and dependable all-day hospitality.", {
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["italian"], price: "$$$", priceSource: "Official A$130 four-course menu and current OpenTable price band", attributeTags: ["all_day_dining", "outdoor_seating", "walk_ins", "date_night", "neighborhood_institution"],
    hours: { mon: "12:00 PM-11:00 PM", tue: "12:00 PM-11:00 PM", wed: "12:00 PM-11:00 PM", thu: "12:00 PM-11:00 PM", fri: "12:00 PM-11:00 PM", sat: "12:00 PM-11:00 PM", sun: "12:00 PM-10:00 PM" },
    officialUrl: "https://fratelliparadiso.com/", bookingUrl: "https://fratelliparadiso.com/", sourcePhoto: "https://live.staticflickr.com/5529/9717778712_a3797983ac_b.jpg", imageSourceName: "Openverse / Flickr photo by Milkbar Nick", imageCredit: "Milkbar Nick", imageLicense: "CC BY-SA 2.0", editorialUrls: ["https://www.flickr.com/photos/80383069@N00/9717778712", "https://www.opentable.com.au/r/fratelli-paradiso-potts-point", "https://www.broadsheet.com.au/sydney/potts-point/restaurants/fratelli-paradiso", "https://www.timeout.com/sydney/restaurants/fratelli-paradiso"],
  }),
];

const cheapEatStops: GuideStop[] = [
  stop(
    "sydney-cheap-mamak-haymarket",
    "Mamak Haymarket",
    [-33.8777175, 151.2042284],
    "Roti is stretched and griddled at the front window of this Malaysian-Indian dining room, where roti canai, satay, nasi lemak, and mee goreng make a practical Chinatown meal.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["malaysian", "indian_malaysian"],
      price: "$",
      priceSource: "Current Haymarket dine-in menu: roti canai A$11.50, nasi lemak A$15.50, and mee goreng A$21.50",
      attributeTags: ["roti", "late_night", "family_friendly", "takeaway", "no_reservations"],
      hours: {
        mon: "11:30 AM-2:30 PM and 5:30 PM-10:00 PM",
        tue: "11:30 AM-2:30 PM and 5:30 PM-10:00 PM",
        wed: "11:30 AM-2:30 PM and 5:30 PM-10:00 PM",
        thu: "11:30 AM-2:30 PM and 5:30 PM-10:00 PM",
        fri: "11:30 AM-2:30 PM and 5:30 PM-12:00 AM",
        sat: "11:30 AM-12:00 AM",
        sun: "11:30 AM-10:00 PM",
      },
      officialUrl: "https://mamak.com.au/",
      sourcePhoto: "https://mamak.com.au/images/content/_hero/356/home_-roti_flipper.jpg",
      mapQuery: "Mamak 15 Goulburn Street Haymarket NSW",
      editorialUrls: [
        "https://www.timeout.com/sydney/restaurants/mamak",
        "https://www.timeout.com/sydney/restaurants/the-best-cheap-eats-in-sydney",
        "https://www.broadsheet.com.au/sydney/haymarket/restaurants/mamak",
      ],
      sourceUrls: ["https://www.meandu.app/mamak-hay/dine-in/v2/food"],
    },
  ),
  stop(
    "sydney-cheap-gumshara",
    "Gumshara",
    [-33.8788096, 151.2036941],
    "Pork bones boil for fourteen hours without MSG or thickener to make Gumshara's exceptionally dense tonkotsu broth, served from a compact Kimber Lane ramen shop with frequent queues.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["japanese", "ramen"],
      price: "$$",
      priceSource: "Current delivery menu: tonkotsu ramen A$22, garlic tonkotsu A$24, and pork sparerib ramen A$33",
      attributeTags: ["ramen", "quick_bite", "takeaway", "no_reservations", "queue_likely"],
      hours: {
        mon: "Closed",
        tue: "5:00 PM-10:30 PM; last order 10:00 PM",
        wed: "5:00 PM-10:30 PM; last order 10:00 PM",
        thu: "11:30 AM-3:00 PM and 5:00 PM-10:30 PM; last orders 2:30 PM and 10:00 PM",
        fri: "11:30 AM-3:00 PM and 5:00 PM-10:30 PM; last orders 2:30 PM and 10:00 PM",
        sat: "11:30 AM-3:00 PM and 5:00 PM-10:30 PM; last orders 2:30 PM and 10:00 PM",
        sun: "11:30 AM-3:00 PM and 5:00 PM-10:30 PM; last orders 2:30 PM and 10:00 PM",
      },
      officialUrl: "https://gumshara.com/",
      sourcePhoto: "https://gumshara.com/cdn/shop/products/tonkotsu_ramen_01x_94fbce03-1e37-4ce2-97c8-4a794313dd06_530x530%402x.jpg?v=1628050356",
      mapQuery: "Gumshara 9 Kimber Lane Haymarket NSW",
      editorialUrls: [
        "https://www.timeout.com/sydney/restaurants/the-best-cheap-eats-in-sydney",
        "https://www.tripadvisor.com.au/Restaurant_Review-g255060-d3470650-Reviews-Gumshara_Restaurant-Sydney_New_South_Wales.html",
        "https://www.corner.inc/place/pwKBf7Dc7bDy",
      ],
      sourceEvidence: {
        notes: "The official page prints the Thursday-Sunday lunch opening as 11:30pm; this record normalizes the evident typo to 11:30 AM, consistent with its 3:00 PM close and 2:30 PM last order.",
      },
    },
  ),
  stop(
    "sydney-cheap-rice-face",
    "Rice Face",
    [-33.8726, 151.2076],
    "This Galeries counter pairs four rice preparations with poached or grilled chicken, char siu pork, braised beef, or mushroom-tofu gravy, using vegetables from Palisa Anderson's Boon Luck Farm.",
    {
      venueKind: "food_drink",
      foodServiceType: "counter_service",
      cuisineTypes: ["thai", "chinese_thai", "rice_bowls"],
      price: "$",
      priceSource: "Official menu: complete bowls A$15-A$18, with rice, proteins, vegetables, and sauce",
      attributeTags: ["lunch", "quick_bite", "takeaway", "vegetarian_options", "food_court"],
      hours: {
        mon: "10:00 AM-6:30 PM",
        tue: "10:00 AM-6:30 PM",
        wed: "10:00 AM-6:30 PM",
        thu: "10:00 AM-6:30 PM",
        fri: "10:00 AM-6:30 PM",
        sat: "11:00 AM-3:00 PM",
        sun: "11:00 AM-3:00 PM",
      },
      officialUrl: "https://riceface.com.au/",
      sourcePhoto: "https://storage.googleapis.com/gpt-engineer-file-uploads/1e6XAKWvhGSJy0yKlJrT5KrNBtP2/social-images/social-1777551497851-BBQ_PORK_ON_RICE.webp",
      mapQuery: "Rice Face Lower Ground The Galeries 500 George Street Sydney NSW",
      editorialUrls: [
        "https://www.broadsheet.com.au/sydney/restaurants/riceface",
        "https://www.broadsheet.com.au/sydney/food-and-drink/article/riceface-cbd-chat-thai-open",
        "https://www.timeout.com/sydney/restaurants/the-best-cheap-eats-in-sydney",
      ],
    },
  ),
  stop(
    "sydney-cheap-yok-yor",
    "Yok Yor",
    [-33.8796146, 151.2079812],
    "Family recipes anchor this Haymarket Thai room, whose useful range runs from beef or pork boat noodles to northern rice-noodle broth and spicy southern curries served late every night.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["thai"],
      price: "$",
      priceSource: "Official menu: noodle dishes A$17.90-A$19.90, including kuay teaw moo tom yum at A$17.90",
      attributeTags: ["boat_noodles", "late_night", "groups", "takeaway", "spicy_food"],
      hours: {
        mon: "11:30 AM-11:00 PM",
        tue: "11:30 AM-11:00 PM",
        wed: "11:30 AM-11:00 PM",
        thu: "11:30 AM-11:00 PM",
        fri: "11:30 AM-12:00 AM",
        sat: "11:30 AM-12:00 AM",
        sun: "11:30 AM-11:00 PM",
      },
      officialUrl: "https://www.yokyor.com.au/",
      sourcePhoto: "https://static.wixstatic.com/media/89db4b_193ae8d1061f466eaf9d22f6c43f0e89~mv2.jpeg/v1/fill/w_712%2Ch_950%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/89db4b_193ae8d1061f466eaf9d22f6c43f0e89~mv2.jpeg",
      mapQuery: "Yok Yor Shop G06 323 Castlereagh Street Haymarket NSW",
      editorialUrls: [
        "https://www.timeout.com/sydney/restaurants/yok-yor",
        "https://www.timeout.com/sydney/restaurants/the-best-cheap-eats-in-sydney",
        "https://www.tripadvisor.com.au/Restaurant_Review-g255060-d11959039-Reviews-Yok_Yor_Thai_Food_Factory-Sydney_New_South_Wales.html",
      ],
      sourceUrls: ["https://www.yokyor.com.au/menu"],
      sourceEvidence: {
        notes: "The official homepage summary says Friday-Saturday close at 12pm, while its detailed contact block says 12am; this record uses the internally consistent midnight close.",
      },
    },
  ),
  stop(
    "sydney-cheap-pauls-famous-hamburgers",
    "Paul's Famous Hamburgers",
    [-34.0067838, 151.1123836],
    "This Sylvania takeaway has made classic Australian milk-bar burgers since 1957; the Works layers egg, bacon, cheese, and pineapple over the patty and pairs naturally with fresh pineapple crush.",
    {
      venueKind: "food_drink",
      foodServiceType: "fast_food",
      cuisineTypes: ["australian", "burgers"],
      price: "$",
      priceSource: "Official menu: hamburger A$11.50, Famous Works A$15.50, chips A$5.90-A$8.90",
      attributeTags: ["burgers", "takeaway", "family_friendly", "old_school", "outdoor_seating"],
      hours: {
        mon: "Closed",
        tue: "Closed",
        wed: "11:30 AM-9:00 PM",
        thu: "11:30 AM-9:00 PM",
        fri: "11:30 AM-9:00 PM",
        sat: "11:30 AM-7:00 PM",
        sun: "11:30 AM-7:00 PM",
      },
      officialUrl: "https://paulsfamoushamburgers.com.au/",
      sourcePhoto: "https://media.timeout.com/images/106401580/750/422/image.jpg",
      imageSourceName: "Time Out Sydney",
      imageCredit: "Avril Treasure for Time Out Sydney",
      mapQuery: "Paul's Famous Hamburgers 12 Princes Highway Sylvania NSW",
      editorialUrls: [
        "https://www.timeout.com/sydney/restaurants/pauls-burgers",
        "https://www.corner.inc/place/pxFdCcGu6bRS",
        "https://www.agfg.com.au/article/60-years-of-famous-pauls-famous-burgers-in-sylvania",
      ],
      sourceUrls: ["https://paulsfamoushamburgers.com.au/menu/"],
    },
  ),
  stop(
    "sydney-cheap-al-yasmin",
    "Al Yasmin",
    [-33.9259867, 151.0566972],
    "A Punchbowl Lebanese institution of more than thirty years serves breakfast plates, shawarma, grilled meats, dips, and lemon-garlic chicken in portions designed for sharing or inexpensive takeaway.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["lebanese", "middle_eastern"],
      price: "$",
      priceSource: "Current Quandoo menu: breakfast plates A$12-A$15, mjadra A$15, and shawarma or chicken plates A$23-A$25; Time Out lists wraps around A$10",
      attributeTags: ["halal", "breakfast", "family_friendly", "groups", "takeaway"],
      hours: {
        mon: "8:00 AM-9:45 PM",
        tue: "8:00 AM-9:45 PM",
        wed: "8:00 AM-9:45 PM",
        thu: "8:00 AM-9:45 PM",
        fri: "8:00 AM-9:45 PM",
        sat: "8:00 AM-9:45 PM",
        sun: "8:00 AM-9:45 PM",
      },
      officialUrl: "https://www.instagram.com/jasmin.punchbowl/",
      sourcePhoto: "https://media.timeout.com/images/106384894/750/422/image.jpg",
      imageSourceName: "Time Out Sydney",
      imageCredit: "Alice Ellis for Time Out",
      mapQuery: "Al Yasmin 222 The Boulevarde Punchbowl NSW",
      editorialUrls: [
        "https://www.timeout.com/sydney/restaurants/al-yasmin",
        "https://www.quandoo.com.au/place/al-yasmin-restaurant-109795/about",
        "https://www.quandoo.com.au/place/al-yasmin-restaurant-109795/menu",
      ],
      sourceEvidence: {
        currentStatusUrl: "https://www.timeout.com/sydney/restaurants/al-yasmin",
        platformUrls: ["https://www.quandoo.com.au/place/al-yasmin-restaurant-109795/about"],
        notes: "Open when checked via a March 2026 Time Out review and current platform hours. The alyasmin.com.au domain returned an error, so the venue's active Instagram is used as its official link.",
      },
    },
  ),
  stop(
    "sydney-cheap-tan-viet-cabramatta",
    "Tan Viet Noodle House Cabramatta",
    [-33.8950345, 150.9341446],
    "For more than thirty years this Chinese-Vietnamese Cabramatta restaurant has specialized in crisp-skinned chicken served with tomato rice or egg, rice, clear, and drop noodles.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["vietnamese", "chinese_vietnamese"],
      price: "$",
      priceSource: "Official 2025 Cabramatta menu: crispy chicken with tomato rice or noodles A$20; crispy chicken alone A$15",
      attributeTags: ["crispy_chicken", "noodles", "family_friendly", "quick_bite", "no_reservations"],
      hours: {
        mon: "9:00 AM-8:00 PM",
        tue: "9:00 AM-8:00 PM",
        wed: "9:00 AM-8:00 PM",
        thu: "9:00 AM-8:00 PM",
        fri: "9:00 AM-8:00 PM",
        sat: "9:00 AM-8:00 PM",
        sun: "9:00 AM-8:00 PM",
      },
      officialUrl: "https://tanviet.com.au/",
      sourcePhoto: "https://media.timeout.com/images/106179254/750/422/image.jpg",
      imageSourceName: "Time Out Sydney",
      imageCredit: "Avril Treasure for Time Out Sydney",
      mapQuery: "Tan Viet Noodle House 100 John Street Cabramatta NSW",
      editorialUrls: [
        "https://www.timeout.com/sydney/restaurants/tan-viet-noodle-house",
        "https://www.agfg.com.au/restaurant/tan-viet-1301",
        "https://www.timeout.com/sydney/restaurants/the-best-cheap-eats-in-sydney",
      ],
      sourceUrls: [
        "https://tanviet.com.au/locations/",
        "https://tanviet.com.au/wp-content/uploads/2025/11/2025-Version-Cabramatta-Menu-compressed.pdf",
      ],
      sourceEvidence: {
        notes: "This record is specifically for the Cabramatta original; temporary-closure notices for the separate Darling Square branch do not apply here.",
      },
    },
  ),
  stop(
    "sydney-cheap-dosa-hut-harris-park",
    "Dosa Hut Harris Park",
    [-33.8215725, 151.0092882],
    "The sprawling menu crosses South Indian, chaat, Indo-Chinese, curry, and biryani traditions, but the strongest value lies in crisp dosas and street-food plates in Harris Park's Little India.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["south_indian", "indian", "indo_chinese"],
      price: "$",
      priceSource: "Official Harris Park menu: plain dosa A$11.95, masala dosa A$14.95, and special dosas up to A$19.95",
      attributeTags: ["dosa", "vegetarian_options", "street_food", "family_friendly", "groups"],
      hours: {
        mon: "11:00 AM-3:00 PM and 5:00 PM-10:00 PM",
        tue: "11:00 AM-3:00 PM and 5:00 PM-10:00 PM",
        wed: "11:00 AM-10:00 PM",
        thu: "11:00 AM-10:00 PM",
        fri: "11:00 AM-10:15 PM",
        sat: "11:00 AM-10:15 PM",
        sun: "11:00 AM-10:15 PM",
      },
      officialUrl: "https://www.dosahut.net.au/indian-restaurant-harris-park/",
      sourcePhoto: "https://media.timeout.com/images/106272931/750/422/image.jpg",
      imageSourceName: "Time Out Sydney",
      imageCredit: "Alison Rodericks for Time Out Sydney",
      mapQuery: "Dosa Hut 69 Wigram Street Harris Park NSW",
      editorialUrls: [
        "https://www.timeout.com/sydney/restaurants/dosa-hut",
        "https://atparramatta.com/discover/eat-and-drink/restaurants-and-cafes/dosa-hut-plaza",
        "https://www.timeout.com/sydney/restaurants/the-best-cheap-eats-in-sydney",
      ],
      sourceUrls: ["https://www.dosahut.net.au/menu/harris-park/"],
    },
  ),
  stop(
    "sydney-cheap-olympic-meats",
    "Olympic Meats",
    [-33.91159, 151.14155],
    "Peloponnese-inspired kontosouvli, chicken gyros, and grilled meats come with hand-rolled sourdough pita that ferments for two days at this small, walk-in-only Marrickville grill.",
    {
      venueKind: "food_drink",
      foodServiceType: "fast_casual",
      cuisineTypes: ["greek"],
      price: "$",
      priceSource: "Current official menu and Time Out review: gyros and small plates A$12-A$21; most plates are A$21 or less",
      attributeTags: ["walk_ins_only", "grilled_meats", "share_plates", "byo", "sold_out_risk"],
      hours: {
        mon: "Closed",
        tue: "Closed",
        wed: "5:00 PM-9:30 PM",
        thu: "5:00 PM-9:30 PM",
        fri: "5:00 PM-9:30 PM",
        sat: "12:00 PM-3:30 PM and 5:00 PM-9:30 PM",
        sun: "12:00 PM-7:30 PM",
      },
      officialUrl: "https://www.olympicmeats.shop/",
      sourcePhoto: "https://media.timeout.com/images/106251528/750/422/image.jpg",
      imageSourceName: "Time Out Sydney",
      imageCredit: "Avril Treasure for Time Out Sydney",
      mapQuery: "Olympic Meats 12 Dudley Street Marrickville NSW",
      editorialUrls: [
        "https://www.timeout.com/sydney/restaurants/olympic-meats",
        "https://www.broadsheet.com.au/sydney/marrickville/restaurants/olympic-meats",
        "https://www.sydneytravelguide.com.au/best-cheap-eats-sydney/",
      ],
      sourceEvidence: {
        notes: "Open when checked. The restaurant does not take reservations, and current coverage warns that popular items can sell out and queues can be long.",
      },
    },
  ),
  stop(
    "sydney-cheap-cairo-takeaway",
    "Cairo Takeaway",
    [-33.8984858, 151.1749241],
    "Fava-bean falafel fried to order, maalouba rice with lamb and cauliflower, and charcoal-grilled meats give this compact Enmore Road room a specifically Egyptian identity.",
    {
      venueKind: "food_drink",
      foodServiceType: "fast_casual",
      cuisineTypes: ["egyptian", "middle_eastern"],
      price: "$$",
      priceSource: "Current menu and Time Out review: filled pitas below A$15 and mixed plates approximately A$20-A$30",
      attributeTags: ["falafel", "vegetarian_options", "takeaway", "byo", "walk_ins"],
      hours: {
        mon: "12:00 PM-9:30 PM",
        tue: "12:00 PM-9:30 PM",
        wed: "12:00 PM-9:30 PM",
        thu: "12:00 PM-9:30 PM",
        fri: "12:00 PM-10:30 PM",
        sat: "11:00 AM-10:30 PM",
        sun: "11:00 AM-9:00 PM",
      },
      officialUrl: "https://www.cairotakeaway.com/",
      sourcePhoto: "https://media.timeout.com/images/106188686/750/422/image.jpg",
      imageSourceName: "Time Out Sydney",
      imageCredit: "Avril Treasure for Time Out Sydney",
      mapQuery: "Cairo Takeaway 81 Enmore Road Newtown NSW",
      editorialUrls: [
        "https://www.timeout.com/sydney/restaurants/cairo-takeaway",
        "https://www.timeout.com/sydney/restaurants/the-best-cheap-eats-in-sydney",
        "https://www.corner.inc/place/pnFLhkaabWwN",
      ],
      sourceUrls: ["https://www.cairotakeaway.com/contact"],
    },
  ),
];

const cultureStops: GuideStop[] = [
  stop(
    "sydney-culture-opera-house",
    "Sydney Opera House",
    [-33.857198, 151.2151234],
    "Jørn Utzon's UNESCO-listed harbor landmark rewards a performance ticket, but its architecture, foyers, and guided access also make a substantial cultural visit.",
    {
      venueKind: "culture",
      subcategory: "performing_arts_architecture",
      price: "$$",
      priceSource: "Official tour and event booking pages",
      attributeTags: ["unesco", "architecture", "performing_arts", "harbor"],
      hours: {
        default:
          "Welcome Centre daily 8:45 AM-5:00 PM; Box Office daily 9:00 AM-5:00 PM and later on performance nights; exact auditorium access follows the official event schedule.",
      },
      officialUrl: "https://www.sydneyoperahouse.com/contact-us",
      bookingUrl: "https://www.sydneyoperahouse.com/tours",
      sourcePhoto: images.operaHouseExterior,
      editorialUrls: [
        "https://www.sydney.com/destinations/sydney/sydney-city/circular-quay/attractions/sydney-opera-house",
      ],
    },
  ),
  stop(
    "sydney-culture-art-gallery-nsw",
    "Art Gallery of New South Wales",
    [-33.8686067, 151.2174176],
    "Historic Naala Nura and SANAA-designed Naala Badu connect Australian, First Nations, Asian, European, and contemporary collections across two complementary buildings.",
    {
      venueKind: "culture",
      subcategory: "art_museum",
      price: "$",
      priceSource: "Official gallery visit page; general collection entry is free",
      attributeTags: ["art", "first_nations", "architecture", "free_entry"],
      hours: {
        default:
          "Daily 10:00 AM-5:00 PM; Wednesday until 10:00 PM; closed Good Friday and Christmas Day.",
      },
      officialUrl: "https://www.artgallery.nsw.gov.au/visit-us/",
      sourcePhoto: images.artGalleryNsw,
      editorialUrls: ["https://www.timeout.com/sydney/museums/the-best-museums-in-sydney"],
    },
  ),
  stop(
    "sydney-culture-australian-museum",
    "Australian Museum",
    [-33.8743491, 151.2132563],
    "Australia's first museum brings natural history, dinosaurs, Pacific collections, and First Nations knowledge together beside Hyde Park in a family-friendly building.",
    {
      venueKind: "culture",
      subcategory: "natural_history_museum",
      price: "$",
      priceSource: "Official museum visit page; general admission is free",
      attributeTags: ["natural_history", "first_nations", "family_friendly", "free_entry"],
      hours: {
        default: "Daily 10:00 AM-5:00 PM; Burra play space and the cafe close at 4:30 PM; closed Christmas Day.",
      },
      officialUrl: "https://australian.museum/visit/",
      sourcePhoto: images.australianMuseum,
      editorialUrls: ["https://www.timeout.com/sydney/museums/the-best-museums-in-sydney"],
    },
  ),
  stop(
    "sydney-culture-mca",
    "Museum of Contemporary Art Australia",
    [-33.8599598, 151.2089549],
    "The Rocks' waterfront contemporary-art museum foregrounds Australian and First Nations artists while rotating international exhibitions through harbor-facing galleries and public spaces.",
    {
      venueKind: "culture",
      subcategory: "contemporary_art_museum",
      price: "$",
      priceSource: "Official museum and exhibition pages; general admission is free",
      attributeTags: ["contemporary_art", "first_nations", "free_entry", "harbor"],
      hours: {
        default:
          "Monday 10:00 AM-5:00 PM; Tuesday closed; Wednesday 10:00 AM-5:00 PM; Thursday 10:00 AM-9:00 PM; Friday-Sunday 10:00 AM-5:00 PM.",
      },
      officialUrl: "https://www.mca.com.au/",
      sourcePhoto: images.mca,
      editorialUrls: [
        "https://www.therocks.com/see-do-stay/museum-of-contemporary-art-australia",
        "https://www.timeout.com/sydney/museums/the-best-museums-in-sydney",
      ],
    },
  ),
  stop(
    "sydney-culture-maritime-museum",
    "Australian National Maritime Museum",
    [-33.8693591, 151.1986749],
    "Darling Harbour galleries extend onto historic vessels, including submarine and destroyer access when operations and heat conditions permit boarding.",
    {
      venueKind: "culture",
      subcategory: "maritime_museum",
      price: "$$",
      priceSource: "Official museum ticket page",
      attributeTags: ["maritime_history", "historic_ships", "family_friendly", "waterfront"],
      hours: {
        default:
          "Regular daily hours 10:00 AM-4:00 PM, with last vessel boarding 3:10 PM; school-holiday hours 9:30 AM-5:00 PM, last vessel boarding 4:10 PM; closed Christmas Day.",
      },
      officialUrl: "https://www.sea.museum/en/visit",
      sourcePhoto: images.maritimeMuseum,
      editorialUrls: ["https://www.timeout.com/sydney/museums/the-best-museums-in-sydney"],
      sourceEvidence: {
        currentStatusUrl: "https://www.sea.museum/en/visit",
        notes:
          "Core museum open when checked; vessel availability and gallery maintenance notices are published on the official visit page.",
      },
    },
  ),
  stop(
    "sydney-culture-chau-chak-wing",
    "Chau Chak Wing Museum",
    [-33.8852882, 151.190496],
    "The University of Sydney's free museum unites Nicholson antiquities, Macleay natural history, and university art collections in one carefully interpreted building.",
    {
      venueKind: "culture",
      subcategory: "university_museum",
      price: "$",
      priceSource: "Official museum visit page; admission is free",
      attributeTags: ["antiquities", "natural_history", "art", "free_entry"],
      hours: {
        default:
          "Monday-Friday 10:00 AM-5:00 PM; Saturday-Sunday 12:00 PM-4:00 PM; public-holiday changes are listed on the official visit page.",
      },
      officialUrl: "https://www.sydney.edu.au/museum/whats-on/visit.html",
      sourcePhoto: images.chauChakWing,
      editorialUrls: ["https://www.timeout.com/sydney/museums/the-best-museums-in-sydney"],
    },
  ),
  stop(
    "sydney-culture-white-rabbit",
    "White Rabbit Gallery",
    [-33.8864969, 151.2002609],
    "This Chippendale gallery presents ambitious twenty-first-century Chinese contemporary art in two substantial annual exhibitions rather than maintaining a static permanent display.",
    {
      venueKind: "culture",
      subcategory: "contemporary_art_gallery",
      price: "$",
      priceSource: "Official gallery visit page; admission is free",
      attributeTags: ["contemporary_art", "chinese_art", "free_entry", "chippendale"],
      hours: {
        default:
          "Wednesday-Sunday 10:00 AM-5:00 PM during exhibition periods; the gallery closes between its two annual exhibitions, with exact dates on the official exhibition calendar.",
      },
      officialUrl: "https://whiterabbitcollection.org/visit/",
      sourcePhoto: images.whiteRabbit,
      editorialUrls: [
        "https://whiterabbitcollection.org/faq/",
        "https://www.timeout.com/sydney/museums/the-best-museums-in-sydney",
      ],
      sourceEvidence: {
        currentStatusUrl: "https://whiterabbitcollection.org/visit/",
        notes:
          "The current Black Myth exhibition runs 25 June-15 November 2026; between-exhibition closures are governed by the official exhibition calendar.",
      },
    },
  ),
  stop(
    "sydney-culture-state-library",
    "State Library of New South Wales",
    [-33.866874, 151.2128494],
    "The Mitchell Wing pairs grand reading rooms with free galleries, archives, and changing exhibitions that make New South Wales history publicly accessible.",
    {
      venueKind: "culture",
      subcategory: "library_gallery",
      price: "$",
      priceSource: "Official library page; public galleries are free",
      attributeTags: ["library", "history", "architecture", "free_entry"],
      hours: {
        default:
          "Monday-Thursday 9:00 AM-8:00 PM; Friday 9:00 AM-5:00 PM; Saturday-Sunday 10:00 AM-5:00 PM.",
      },
      officialUrl: "https://www.sl.nsw.gov.au/visit-us/opening-hours",
      sourcePhoto: images.stateLibrary,
      editorialUrls: ["https://www.timeout.com/sydney/museums/the-best-museums-in-sydney"],
    },
  ),
  stop(
    "sydney-culture-hyde-park-barracks",
    "Hyde Park Barracks",
    [-33.8696194, 151.2127985],
    "An immersive audio experience turns this UNESCO-listed convict barracks into a precise account of forced migration, institutional life, and colonial Sydney.",
    {
      venueKind: "culture",
      subcategory: "historic_site",
      price: "$$",
      priceSource: "Official Museums of History NSW ticket page",
      attributeTags: ["unesco", "convict_history", "audio_guide", "historic_site"],
      hours: {
        default:
          "Daily 10:00 AM-6:00 PM, last entry 4:30 PM; closed Good Friday and Christmas Day; self-guided audio sessions begin every half hour.",
      },
      officialUrl: "https://mhnsw.au/visit-us/hyde-park-barracks/plan-your-visit/",
      sourcePhoto: images.hydeParkBarracks,
      editorialUrls: ["https://www.timeout.com/sydney/museums/the-best-museums-in-sydney"],
    },
  ),
  stop(
    "sydney-culture-carriageworks",
    "Carriageworks",
    [-33.8941553, 151.1916021],
    "A former Eveleigh railway workshop now stages contemporary art, theatre, dance, music, and a Saturday farmers market inside monumental industrial sheds.",
    {
      venueKind: "culture",
      subcategory: "multidisciplinary_arts_center",
      price: "$$",
      priceSource: "Official exhibition and event pages; many gallery visits are free",
      attributeTags: ["contemporary_art", "performing_arts", "adaptive_reuse", "farmers_market"],
      hours: {
        default:
          "Gallery Wednesday-Sunday 10:00 AM-5:00 PM; farmers market Saturday 8:00 AM-1:00 PM; ticketed performance times follow each official event page.",
      },
      officialUrl: "https://carriageworks.com.au/visit/",
      sourcePhoto: images.carriageworks,
      editorialUrls: ["https://www.timeout.com/sydney/museums/the-best-museums-in-sydney"],
    },
  ),
];

const activityStops: GuideStop[] = [
  stop(
    "sydney-activity-opera-house-tour",
    "Sydney Opera House Guided Tour",
    [-33.857198, 151.2151234],
    "A guided circuit explains Utzon's design and reaches working performance spaces when rehearsals and productions allow, adding substance beyond the harbor photograph.",
    {
      venueKind: "other",
      subcategory: "guided_architecture_tour",
      price: "$$",
      priceSource: "Official tour booking page",
      attributeTags: ["guided_tour", "architecture", "unesco", "reservation_recommended"],
      hours: {
        default:
          "Guided tours operate daily, with bookable departures from 9:00 AM to 5:00 PM; exact language and theatre-access slots are set by the official booking calendar.",
      },
      officialUrl: "https://www.sydneyoperahouse.com/tours",
      bookingUrl: "https://www.sydneyoperahouse.com/tours",
      sourcePhoto: images.operaHouse,
      editorialUrls: [
        "https://www.sydneyoperahouse.com/contact-us",
        "https://www.timeout.com/sydney/things-to-do/things-to-do-in-sydney-at-least-once-in-your-life?mrfcid=2026040669c9e2e2f7115417d68d7faf",
      ],
    },
  ),
  stop(
    "sydney-activity-bridgeclimb",
    "BridgeClimb Sydney",
    [-33.8573564, 151.2078141],
    "The guided ascent turns the Harbour Bridge into a three-hour experience, with skyline interpretation, strict safety preparation, and summit photographs included.",
    {
      venueKind: "other",
      subcategory: "guided_bridge_climb",
      price: "$$$$",
      priceSource: "Official 2026 climb rates and booking page",
      attributeTags: ["guided_tour", "viewpoint", "active", "reservation_required"],
      hours: {
        default:
          "Climbs operate daily at dawn, daytime, twilight, and night; exact departures and weather-affected availability are set by the official booking calendar.",
      },
      officialUrl: "https://www.bridgeclimb.com/",
      bookingUrl: "https://www.bridgeclimb.com/book",
      sourcePhoto: images.bridgeClimb,
      editorialUrls: [
        "https://www.bridgeclimb.com/faqs",
        "https://www.timeout.com/sydney/things-to-do/things-to-do-in-sydney-at-least-once-in-your-life?mrfcid=2026040669c9e2e2f7115417d68d7faf",
      ],
    },
  ),
  stop(
    "sydney-activity-royal-botanic-garden",
    "Royal Botanic Garden Sydney",
    [-33.8627694, 151.215711],
    "Harbor paths, themed plant collections, lawns, and First Nations interpretation make this the green connective tissue between the CBD and Mrs Macquarie's Point.",
    {
      venueKind: "outdoors",
      subcategory: "botanic_garden",
      price: "$",
      priceSource: "Official garden page; general garden access is free",
      attributeTags: ["garden", "harbor", "free_entry", "walking"],
      hours: {
        default:
          "Daily 7:00 AM-sunset: 8:00 PM January-February and November-December; 7:30 PM October; 6:30 PM March; 6:00 PM April and September; 5:30 PM May and August; 5:00 PM June-July. Extreme-weather closures follow official garden alerts.",
      },
      officialUrl: "https://www.botanicgardens.org.au/royal-botanic-garden-sydney/plan-your-visit",
      sourcePhoto: images.botanicGarden,
      editorialUrls: ["https://www.sydney.com/destinations/sydney/sydney-city/city-centre/attractions/royal-botanic-garden-and-the-domain"],
    },
  ),
  stop(
    "sydney-activity-taronga-zoo",
    "Taronga Zoo Sydney",
    [-33.8438318, 151.2413746],
    "The ferry approach, harbor-backed enclosures, Australian wildlife, and conservation programs distinguish Taronga from a generic zoo visit, especially for families.",
    {
      venueKind: "outdoors",
      subcategory: "zoo",
      price: "$$$",
      priceSource: "Official zoo ticket page",
      attributeTags: ["wildlife", "family_friendly", "ferry", "harbor_views"],
      hours: {
        default:
          "Open daily 365 days: September-April 9:30 AM-5:00 PM; May-August 9:30 AM-4:30 PM.",
      },
      officialUrl: "https://www.taronga.org.au/sydney-zoo/plan/visitor-information",
      bookingUrl: "https://tickets.taronga.org.au/",
      sourcePhoto: images.tarongaZoo,
      editorialUrls: ["https://www.sydney.com/destinations/sydney/sydney-north/mosman/attractions/taronga-zoo-sydney"],
    },
  ),
  stop(
    "sydney-activity-bondi-coogee-walk",
    "Bondi to Coogee Coastal Walk",
    [-33.8956, 151.2742],
    "Six cliff-and-beach kilometers connect Bondi, Tamarama, Bronte, Clovelly, and Coogee, with ocean pools and swim stops supporting a flexible half-day.",
    {
      venueKind: "outdoors",
      subcategory: "coastal_walk",
      price: "$",
      priceSource: "Randwick City Council public walkway information",
      attributeTags: ["coastal_walk", "beaches", "free_entry", "active"],
      hours: {
        default:
          "Open 24 hours daily; Randwick City Council weather and construction advisories govern temporary section closures, and daylight travel is safest.",
      },
      officialUrl: "https://www.randwick.nsw.gov.au/facilities-and-recreation/explore-randwick-city/coastal-walkway",
      sourcePhoto: images.coastalWalk,
      editorialUrls: ["https://www.sydney.com/articles/family-friendly-hikes-and-walks-in-sydney"],
    },
  ),
  stop(
    "sydney-activity-manly-ferry",
    "F1 Manly Ferry from Circular Quay",
    [-33.8612, 151.2107],
    "This public ferry makes the harbor crossing part of the day, passing the Opera House and headlands before reaching Manly's beach-and-wharf axis.",
    {
      venueKind: "transport",
      subcategory: "public_ferry_ride",
      price: "$",
      priceSource: "Official Transport for NSW Opal fare information",
      attributeTags: ["ferry", "harbor_views", "public_transport", "manly"],
      hours: {
        default:
          "Daily F1 departures run from early morning until after midnight; exact departure times are set by the official Transport for NSW timetable.",
      },
      officialUrl: "https://transportnsw.info/routes/details/sydney-ferries/f1/090F1",
      sourcePhoto: images.manlyFerry,
      editorialUrls: ["https://www.sydney.com/destinations/sydney/sydney-north/manly"],
      mapQuery: "Circular Quay Wharf 3 Sydney",
    },
  ),
  stop(
    "sydney-activity-cockatoo-island",
    "Cockatoo Island / Wareamah",
    [-33.8460969, 151.1728258],
    "Ferry-accessed docks, convict remains, industrial structures, and layered First Nations history make this harbor island a substantial self-guided exploration rather than a viewpoint.",
    {
      venueKind: "culture",
      subcategory: "harbor_island_historic_site",
      price: "$",
      priceSource: "Official Harbour Trust visitor information; general island access is free",
      attributeTags: ["unesco", "ferry", "industrial_history", "free_entry"],
      hours: {
        default:
          "Visitor Centre daily 10:00 AM-4:00 PM; island access is available daily around scheduled ferry services, whose exact departures are set by the official Transport for NSW timetable.",
      },
      officialUrl: "https://www.harbourtrust.gov.au/our-places/cockatoo-island/",
      sourcePhoto: images.cockatooIsland,
      editorialUrls: [
        "https://www.harbourtrust.gov.au/whats-on/tours/",
        "https://www.harbourtrust.gov.au/our-places/alerts-and-disruptions/",
      ],
      sourceEvidence: {
        currentStatusUrl: "https://www.harbourtrust.gov.au/our-places/alerts-and-disruptions/",
        notes:
          "Island open when checked; official alerts identify partial wharf or event restrictions without closing the full visitor site.",
      },
    },
  ),
  stop(
    "sydney-activity-barangaroo-reserve",
    "Barangaroo Reserve",
    [-33.8584893, 151.2011648],
    "A reconstructed headland combines sandstone coves, more than seventy-five thousand native plants, public art, and continuous waterfront paths beside the CBD.",
    {
      venueKind: "outdoors",
      subcategory: "waterfront_park",
      price: "$",
      priceSource: "Official Barangaroo public-space page; entry is free",
      attributeTags: ["waterfront", "park", "free_entry", "walking"],
      hours: { default: "Open 24 hours daily; temporary path changes are published through official Barangaroo precinct updates." },
      officialUrl: "https://www.barangaroo.com/precincts/barangaroo-reserve",
      sourcePhoto: images.barangaroo,
      editorialUrls: ["https://www.sydney.com/destinations/sydney/sydney-city/barangaroo/attractions/barangaroo-reserve"],
    },
  ),
  stop(
    "sydney-activity-bondi-icebergs",
    "Bondi Icebergs Pool",
    [-33.8950509, 151.2745714],
    "The saltwater lap pool places swimmers directly against Bondi's surf, with tide spray, changing conditions, and a grandstand view of the beach.",
    {
      venueKind: "outdoors",
      subcategory: "ocean_pool",
      price: "$",
      priceSource: "Official pool admission page",
      attributeTags: ["swimming", "ocean_pool", "bondi", "weather_dependent"],
      hours: {
        default:
          "Monday-Friday 6:00 AM-6:30 PM; Saturday-Sunday 6:30 AM-6:30 PM; Thursday cleaning closure depends on weather and tides, with summer openings published on the official pool-conditions page.",
      },
      officialUrl: "https://icebergs.com.au/pool-conditions/",
      sourcePhoto: images.bondiIcebergs,
      editorialUrls: ["https://www.sydney.com/destinations/sydney/sydney-east/bondi/attractions/bondi-icebergs-pool"],
    },
  ),
  stop(
    "sydney-activity-bridge-museum",
    "BridgeMuseum",
    [-33.8546, 151.2095],
    "The reimagined southeastern pylon museum pairs bridge engineering and worker stories with a self-guided two-hundred-step lookout, offering a lower-cost alternative to BridgeClimb.",
    {
      venueKind: "culture",
      subcategory: "engineering_museum_viewpoint",
      price: "$$",
      priceSource: "Official museum ticket page",
      attributeTags: ["engineering", "viewpoint", "self_guided", "historic_site"],
      hours: {
        default:
          "April-September daily 9:00 AM-6:30 PM, last entry 5:30 PM; October-March daily 9:00 AM-8:30 PM, last entry 7:30 PM; seasonal Thursday-Friday after-hours sessions follow the official event calendar.",
      },
      officialUrl: "https://www.bridgemuseum.com.au/plan-your-visit",
      bookingUrl: "https://www.bridgemuseum.com.au/plan-your-visit",
      sourcePhoto: images.bridgeMuseum,
      editorialUrls: [
        "https://www.bridgeclimb.com/news/bridgemuseum-officially-opens-at-the-sydney-harbour-bridge",
      ],
    },
  ),
];

const hotelStops: GuideStop[] = [
  stop(
    "sydney-hotel-capella",
    "Capella Sydney",
    [-33.86385, 151.21067],
    "Capella turns the heritage-listed former Department of Education into a 192-room luxury hotel, with Brasserie 1930, McRae Bar, and Auriga Spa inside the Sandstone Precinct. Choose it when the hotel is part of the trip rather than merely a Circular Quay base.",
    {
      category: "Stay",
      subcategory: "hotel",
      venueKind: "lodging",
      lodgingType: "hotel",
      hours: { default: "Front desk open 24 hours daily." },
      price: "$$$$",
      priceSource:
        "Time Out Sydney 26 June 2026 (from A$747) and live Booking.com listing, checked 2026-07-14",
      bookingUrl: "https://www.booking.com/hotel/au/capella-sydney.html",
      officialUrl: "https://capellahotels.com/en/capella-sydney",
      sourcePhoto:
        "https://capellahotels.com/assets/img/site_images/sydney/Capella-Sydney.jpg",
      imageSourceName: "Capella Sydney official property image",
      mapQuery: "Capella Sydney, 24 Loftus Street, Sydney NSW 2000",
      attributeTags: [
        "luxury",
        "heritage",
        "spa",
        "indoor_pool",
        "fine_dining",
        "circular_quay",
        "accessible",
      ],
      editorialUrls: [
        "https://www.timeout.com/sydney/travel/the-best-hotels-in-sydney",
        "https://www.cntraveler.com/gallery/best-hotels-in-sydney",
      ],
      sourceUrls: ["https://www.booking.com/hotel/au/capella-sydney.html"],
      sourceEvidence: {
        currentStatusUrl: "https://www.booking.com/hotel/au/capella-sydney.html",
        platformUrls: ["https://www.booking.com/hotel/au/capella-sydney.html"],
        notes:
          "Sydney CBD / Circular Quay. Official booking inventory and 2026 awards content plus the live Booking.com listing confirm current operation; Booking.com states a 24-hour front desk. Top-end rates are the main caveat. Some sources use the 35-39 Bridge Street building address, while the guest arrival address is 24 Loftus Street. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-hotel-park-hyatt",
    "Park Hyatt Sydney",
    [-33.855621, 151.209833],
    "Park Hyatt occupies the harbor edge below the bridge, with Opera House-facing balconies, 155 rooms, a year-round rooftop pool, and a five-suite spa. Its distinction is the sightline; room category determines whether guests actually receive the postcard view.",
    {
      category: "Stay",
      subcategory: "hotel",
      venueKind: "lodging",
      lodgingType: "hotel",
      hours: { default: "Front desk open 24 hours daily." },
      price: "$$$$",
      priceSource:
        "Time Out Sydney 26 June 2026 (from A$1,300) and live Booking.com listing, checked 2026-07-14",
      bookingUrl: "https://www.booking.com/hotel/au/park-hyatt-sydney.html",
      officialUrl: "https://www.hyatt.com/park-hyatt/en-US/sydph-park-hyatt-sydney",
      sourcePhoto:
        "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2017/05/12/1132/Park-Hyatt-Sydney-P113-Exterior-Cameo-Horizontal.jpg/Park-Hyatt-Sydney-P113-Exterior-Cameo-Horizontal.16x9.jpg?imwidth=2560",
      imageSourceName: "Park Hyatt Sydney official property image",
      mapQuery: "Park Hyatt Sydney, 7 Hickson Road, The Rocks NSW 2000",
      attributeTags: [
        "luxury",
        "harbor_view",
        "opera_house_view",
        "spa",
        "rooftop_pool",
        "the_rocks",
        "special_occasion",
      ],
      editorialUrls: [
        "https://www.timeout.com/sydney/travel/the-best-hotels-in-sydney",
        "https://www.cntraveler.com/gallery/best-hotels-in-sydney",
      ],
      sourceUrls: [
        "https://www.booking.com/hotel/au/park-hyatt-sydney.html",
        "https://www.expedia.com/Sydney-Hotels-Park-Hyatt-Sydney.h23356.Hotel-Information",
      ],
      sourceEvidence: {
        currentStatusUrl: "https://www.booking.com/hotel/au/park-hyatt-sydney.html",
        platformUrls: [
          "https://www.booking.com/hotel/au/park-hyatt-sydney.html",
          "https://www.expedia.com/Sydney-Hotels-Park-Hyatt-Sydney.h23356.Hotel-Information",
        ],
        notes:
          "The Rocks. Hyatt's active booking page and current Booking.com inventory confirm operation; Expedia explicitly lists a 24-hour front desk. This is the highest-priced selection, and guests should verify that the room category specifically says Opera View rather than city or harbor view. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-hotel-manly-pacific",
    "Manly Pacific Sydney MGallery Collection",
    [-33.7957, 151.2873],
    "Manly Pacific puts a rooftop pool, infrared sauna, and wellness facilities directly across from Manly Beach, with the ferry wharf walkable. It is the beach-stay counterpoint to CBD luxury, not the best base for repeated late nights south of the harbor.",
    {
      category: "Stay",
      subcategory: "hotel",
      venueKind: "lodging",
      lodgingType: "hotel",
      hours: { default: "Front desk open 24 hours daily." },
      price: "$$$",
      priceSource:
        "Time Out Sydney 26 June 2026 (from A$425) and live Booking.com listing, checked 2026-07-14",
      bookingUrl: "https://www.booking.com/hotel/au/manly-pacific-sydney.html",
      officialUrl: "https://manlypacific.com.au/",
      sourcePhoto: "https://manlypacific.com.au/wp-content/uploads/sites/44/2024/10/1-3.jpg",
      imageSourceName: "Manly Pacific official property image",
      mapQuery: "Manly Pacific Sydney MGallery, 55 North Steyne, Manly NSW 2095",
      attributeTags: [
        "beachfront",
        "rooftop_pool",
        "wellness",
        "sauna",
        "family_friendly",
        "manly",
        "ferry_access",
      ],
      editorialUrls: ["https://www.timeout.com/sydney/travel/the-best-hotels-in-sydney"],
      sourceUrls: ["https://www.booking.com/hotel/au/manly-pacific-sydney.html"],
      sourceEvidence: {
        currentStatusUrl: "https://www.booking.com/hotel/au/manly-pacific-sydney.html",
        platformUrls: ["https://www.booking.com/hotel/au/manly-pacific-sydney.html"],
        notes:
          "Manly. The official booking site and current Booking.com listing confirm operation and Booking.com states a 24-hour front desk. Formerly Novotel Sydney Manly Pacific; use only the current MGallery name. Ferry and bus dependence makes late CBD returns less convenient. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-hotel-eve",
    "The EVE Hotel Sydney",
    [-33.891627, 151.212282],
    "The EVE anchors Wunderlich Lane with 102 design-led rooms, a rooftop pool, and direct access to the precinct's restaurants and bars. It offers a neighborhood stay between Redfern and Surry Hills rather than a harbor-icons address.",
    {
      category: "Stay",
      subcategory: "hotel",
      venueKind: "lodging",
      lodgingType: "hotel",
      hours: { default: "Front desk open 24 hours daily." },
      price: "$$$",
      priceSource:
        "Time Out Sydney 26 June 2026 (from A$519) and live Booking.com listing, checked 2026-07-14",
      bookingUrl: "https://www.booking.com/hotel/au/the-eve-sydney.html",
      officialUrl: "https://theevehotel.com.au/",
      sourcePhoto:
        "https://apimedia.tfehotels.com/media-green/optimized/a3/6f/a36f0135-c639-46bb-9e08-b67d8b543edc/Header-1600w.jpg",
      imageSourceName: "The EVE Hotel official property image",
      mapQuery: "The EVE Hotel Sydney, 8 Baptist Street, Redfern NSW 2016",
      attributeTags: [
        "boutique",
        "design",
        "rooftop_pool",
        "restaurants",
        "redfern",
        "surry_hills",
        "new_hotel",
      ],
      editorialUrls: [
        "https://www.timeout.com/sydney/travel/the-best-hotels-in-sydney",
        "https://www.cntraveler.com/gallery/best-hotels-in-sydney",
      ],
      sourceUrls: ["https://www.booking.com/hotel/au/the-eve-sydney.html"],
      sourceEvidence: {
        currentStatusUrl: "https://www.booking.com/hotel/au/the-eve-sydney.html",
        platformUrls: ["https://www.booking.com/hotel/au/the-eve-sydney.html"],
        notes:
          "Redfern / Surry Hills edge. The hotel opened 13 February 2025; official 2026 booking content and the live Booking.com listing confirm operation, and Booking.com states a 24-hour front desk. Its operating history is shorter than the established luxury hotels, and the restaurant precinct can be lively. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-hotel-pier-one",
    "Pier One Sydney Harbour, Autograph Collection",
    [-33.854074, 151.208197],
    "Pier One is built over the harbor beside the bridge, trading formal palace-hotel ceremony for water-level decks, Walsh Bay access, and designated pet-friendly rooms. It is strongest for harbor atmosphere and theater nights.",
    {
      category: "Stay",
      subcategory: "hotel",
      venueKind: "lodging",
      lodgingType: "hotel",
      hours: { default: "Front desk open 24 hours daily." },
      price: "$$$",
      priceSource:
        "Time Out Sydney 26 June 2026 (from A$305) and live Booking.com listing, checked 2026-07-14",
      bookingUrl:
        "https://www.booking.com/hotel/au/autograph-collection-pier-one-sydney-harbour.html",
      officialUrl: "https://www.pieronesydneyharbour.com.au/",
      sourcePhoto:
        "https://www.pieronesydneyharbour.com.au/wp-content/uploads/2019/09/AK-SYDAK-01-Exterior-Harbour-Bridge-View-copy-copy-2-scaled.jpg",
      imageSourceName: "Pier One Sydney Harbour official property image",
      mapQuery: "Pier One Sydney Harbour, 11 Hickson Road, Dawes Point NSW 2000",
      attributeTags: [
        "waterfront",
        "harbor_view",
        "pet_friendly",
        "boutique",
        "dawes_point",
        "walsh_bay",
        "fitness_centre",
      ],
      editorialUrls: ["https://www.timeout.com/sydney/travel/the-best-hotels-in-sydney"],
      sourceUrls: [
        "https://www.booking.com/hotel/au/autograph-collection-pier-one-sydney-harbour.html",
      ],
      sourceEvidence: {
        currentStatusUrl:
          "https://www.booking.com/hotel/au/autograph-collection-pier-one-sydney-harbour.html",
        platformUrls: [
          "https://www.booking.com/hotel/au/autograph-collection-pier-one-sydney-harbour.html",
        ],
        notes:
          "Dawes Point / Walsh Bay. Marriott's official booking flow and current Booking.com inventory confirm operation, and Booking.com states a 24-hour front desk. Water and bridge views vary by room, while Walsh Bay events can increase local activity. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-hotel-old-clare",
    "The Old Clare Hotel",
    [-33.88442, 151.201429],
    "The Old Clare joins former Carlton United Brewery buildings into a heritage-design hotel with a rooftop pool beside the Kensington Street dining precinct. It is a Central-adjacent adaptive-reuse stay rather than conventional chain luxury.",
    {
      category: "Stay",
      subcategory: "hotel",
      venueKind: "lodging",
      lodgingType: "hotel",
      hours: { default: "Front desk open 24 hours daily." },
      price: "$$",
      priceSource:
        "Time Out Sydney 26 June 2026 (from A$208) and live Booking.com listing, checked 2026-07-14",
      bookingUrl: "https://www.booking.com/hotel/au/the-old-clare.html",
      officialUrl: "https://www.odehotels.com/the-old-clare-hotel/",
      sourcePhoto:
        "https://cdn.odehotels.com/wp-content/uploads/sites/214/2024/09/23211453/old-clare-featured-1.jpeg",
      imageSourceName: "The Old Clare Hotel official property image",
      mapQuery: "The Old Clare Hotel, 1 Kensington Street, Chippendale NSW 2008",
      attributeTags: [
        "boutique",
        "heritage",
        "rooftop_pool",
        "design",
        "chippendale",
        "central_station",
        "adaptive_reuse",
      ],
      editorialUrls: ["https://www.timeout.com/sydney/travel/the-best-hotels-in-sydney"],
      sourceUrls: ["https://www.booking.com/hotel/au/the-old-clare.html"],
      sourceEvidence: {
        currentStatusUrl: "https://www.booking.com/hotel/au/the-old-clare.html",
        platformUrls: ["https://www.booking.com/hotel/au/the-old-clare.html"],
        notes:
          "Chippendale. Ode Hotels' official page and current Booking.com inventory confirm operation; Booking.com states a 24-hour front desk. Booking.com currently displays 'The Old Clare by Ode Hotels,' but the property-owned public name remains 'The Old Clare Hotel'; preserve the official name and treat the suffix as platform branding. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-hotel-25hours-olympia",
    "25hours Hotel Sydney The Olympia",
    [-33.88181, 151.219223],
    "25hours brought the brand's playful design to Oxford Street with Palomar, The Mulwray, Jacob the Angel, and a rooftop bar in one hospitality stack. It suits travelers who want restaurants and nightlife downstairs more than quiet resort remove.",
    {
      category: "Stay",
      subcategory: "hotel",
      venueKind: "lodging",
      lodgingType: "hotel",
      hours: { default: "Front desk open 24 hours daily." },
      price: "$$$",
      priceSource:
        "Time Out Sydney 26 June 2026 (from A$404) and live Booking.com listing, checked 2026-07-14",
      bookingUrl: "https://www.booking.com/hotel/au/25hours-sydney-the-olympia.html",
      officialUrl: "https://25hours-hotels.com/sydney/the-olympia/",
      sourcePhoto:
        "https://25hours-hotels.com/wp-content/uploads/sites/39/2024/11/25h_theolympia_media_featuredimage_1.jpg",
      imageSourceName: "25hours Hotel Sydney The Olympia official property image",
      mapQuery: "25hours Hotel Sydney The Olympia, 1 Oxford Street, Paddington NSW 2021",
      attributeTags: [
        "boutique",
        "design",
        "nightlife",
        "rooftop_bar",
        "restaurants",
        "paddington",
        "pet_friendly",
        "new_hotel",
      ],
      editorialUrls: [
        "https://www.timeout.com/sydney/travel/the-best-hotels-in-sydney",
        "https://guide.michelin.com/en/hotels-stays/sydney/25hours-hotel-sydney-the-olympia-16399",
      ],
      sourceUrls: ["https://www.booking.com/hotel/au/25hours-sydney-the-olympia.html"],
      sourceEvidence: {
        currentStatusUrl: "https://www.booking.com/hotel/au/25hours-sydney-the-olympia.html",
        platformUrls: ["https://www.booking.com/hotel/au/25hours-sydney-the-olympia.html"],
        notes:
          "Paddington / Oxford Street. Opened 9 October 2025; active Accor and 25hours inventory, 2026 media, and current Booking.com reviews confirm operation. Booking.com states a 24-hour front desk. The very new property sits amid Oxford Street nightlife and busy on-site venues. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-hotel-ace",
    "Ace Hotel Sydney",
    [-33.87884, 151.209928],
    "Ace converts a former brickworks and ceramics site into a design hotel with local art, a busy lobby, and Kiln on the rooftop. It is the creative, social base in this set, better for Surry Hills eating than harbor views.",
    {
      category: "Stay",
      subcategory: "hotel",
      venueKind: "lodging",
      lodgingType: "hotel",
      hours: { default: "Front desk open 24 hours daily." },
      price: "$$$",
      priceSource:
        "Time Out Sydney 26 June 2026 (from A$250) and live Booking.com listing, checked 2026-07-14",
      bookingUrl: "https://www.booking.com/hotel/au/ace-sydney.html",
      officialUrl: "https://acehotel.com/sydney/",
      sourcePhoto:
        "https://acehotel.com/sydney/wp-content/uploads/sites/13/2021/09/Ace-Hotel-Sydney-Property-Images-3-Feb-2025-Anson-Smart-29.jpg",
      imageSourceName: "Ace Hotel Sydney official property image",
      mapQuery: "Ace Hotel Sydney, 47-53 Wentworth Avenue, Sydney NSW 2000",
      attributeTags: [
        "design",
        "boutique",
        "rooftop_bar",
        "restaurants",
        "bikes",
        "surry_hills",
        "creative",
      ],
      editorialUrls: [
        "https://www.timeout.com/sydney/travel/the-best-hotels-in-sydney",
        "https://www.cntraveler.com/gallery/best-hotels-in-sydney",
      ],
      sourceUrls: ["https://www.booking.com/hotel/au/ace-sydney.html"],
      sourceEvidence: {
        currentStatusUrl: "https://www.booking.com/hotel/au/ace-sydney.html",
        platformUrls: ["https://www.booking.com/hotel/au/ace-sydney.html"],
        notes:
          "Surry Hills / CBD edge. The official booking and event calendar plus current Booking.com inventory confirm operation; Booking.com explicitly states a 24-hour front desk. The lobby and rooftop are intentionally social, and entry room categories can be compact. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-hotel-langham",
    "The Langham, Sydney",
    [-33.860517, 151.203447],
    "The Langham is a low-rise Millers Point luxury hotel with an indoor pool, spa, afternoon tea, and notably large rooms. It favors quiet, traditional service over the busier design-hotel scene.",
    {
      category: "Stay",
      subcategory: "hotel",
      venueKind: "lodging",
      lodgingType: "hotel",
      hours: { default: "Front desk open 24 hours daily." },
      price: "$$$$",
      priceSource:
        "Time Out Sydney 26 June 2026 (from A$318) plus official and Booking.com live rates, checked 2026-07-14",
      bookingUrl: "https://www.booking.com/hotel/au/the-observatory.html",
      officialUrl: "https://www.langhamhotels.com/en/the-langham/sydney/",
      sourcePhoto:
        "https://www.langhamhotels.com/content/dam/lhg-dam/photo/photo-library-the-langham/hotels/sydney/rooms/tlsyd_the_residence_living_room_2025.jpg",
      imageSourceName: "The Langham, Sydney official property image",
      mapQuery: "The Langham Sydney, 89-113 Kent Street, Millers Point NSW 2000",
      attributeTags: [
        "luxury",
        "spa",
        "indoor_pool",
        "afternoon_tea",
        "pet_friendly",
        "millers_point",
        "large_rooms",
      ],
      editorialUrls: [
        "https://www.timeout.com/sydney/travel/the-best-hotels-in-sydney",
        "https://www.cntraveler.com/gallery/best-hotels-in-sydney",
      ],
      sourceUrls: [
        "https://www.booking.com/hotel/au/the-observatory.html",
        "https://www.expedia.com.au/Sydney-Hotels-The-Langham.h13927.Hotel-Information",
      ],
      sourceEvidence: {
        currentStatusUrl: "https://www.booking.com/hotel/au/the-observatory.html",
        platformUrls: [
          "https://www.booking.com/hotel/au/the-observatory.html",
          "https://www.expedia.com.au/Sydney-Hotels-The-Langham.h13927.Hotel-Information",
        ],
        notes:
          "Millers Point. The official reservation engine and current Booking.com inventory confirm operation; Expedia explicitly lists a 24-hour front desk. The neighborhood is quieter and hillier than the CBD core. Booking.com's legacy Observatory slug resolves to the current Langham property. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-hotel-paramount-house",
    "Paramount House Hotel",
    [-33.879437, 151.211155],
    "Paramount House places 29 rooms in the former Paramount Pictures building above a precinct containing Golden Age Cinema, Paramount Coffee Project, Poly, and a rooftop bakery. The appeal is the building's creative ecosystem, not full-service resort facilities.",
    {
      category: "Stay",
      subcategory: "hotel",
      venueKind: "lodging",
      lodgingType: "hotel",
      hours: { default: "Front desk open 24 hours daily." },
      price: "$$",
      priceSource:
        "Time Out Sydney 26 June 2026 (from A$260) and live Booking.com listing, checked 2026-07-14",
      bookingUrl: "https://www.booking.com/hotel/au/paramount-house.html",
      officialUrl: "https://paramounthousehotel.com/",
      sourcePhoto: "https://paramounthousehotel.com/app/uploads/2022/07/PHH22_330_web.jpg",
      imageSourceName: "Paramount House Hotel official property image",
      mapQuery: "Paramount House Hotel, 80 Commonwealth Street, Surry Hills NSW 2010",
      attributeTags: [
        "boutique",
        "design",
        "cinema",
        "coffee",
        "restaurants",
        "surry_hills",
        "small_hotel",
      ],
      editorialUrls: ["https://www.timeout.com/sydney/travel/the-best-hotels-in-sydney"],
      sourceUrls: ["https://www.booking.com/hotel/au/paramount-house.html"],
      sourceEvidence: {
        currentStatusUrl: "https://www.booking.com/hotel/au/paramount-house.html",
        platformUrls: ["https://www.booking.com/hotel/au/paramount-house.html"],
        notes:
          "Surry Hills. The official booking site and current Booking.com inventory confirm operation; Booking.com explicitly states a 24-hour front desk. This is a 29-room property with fewer conventional full-service-hotel amenities, and room size or street activity varies by category. Checked 2026-07-14.",
      },
    },
  ),
];

const hostelStops: GuideStop[] = [
  stop(
    "sydney-hostel-wake-up-central",
    "Wake Up! Sydney Central",
    [-33.882364, 151.204646],
    "Wake Up! Sydney Central is the large, high-energy base opposite Central Station, with new bunks, an on-site cafe, Side Bar nightclub, and organized activities every day. It is exceptionally easy for airport and regional trains, but the party program is a real part of the stay.",
    {
      category: "Stay",
      subcategory: "hostel",
      venueKind: "lodging",
      lodgingType: "hostel",
      hours: { default: "Reception open 24 hours daily." },
      price: "$",
      priceSource:
        "Hostelworld Sydney live lead rate of about €24.62 for a dorm when checked 2026-07-14",
      bookingUrl: "https://www.hostelworld.com/hostels/p/1704/wake-up-sydney-central/",
      officialUrl: "https://wakeup.com.au/sydney/",
      sourcePhoto: "https://wakeup.com.au/wp-content/uploads/282A4371-2-e1771475066977.jpg",
      imageSourceName: "Wake Up! Sydney Central official property image",
      mapQuery: "Wake Up Sydney Central, 509 Pitt Street, Haymarket NSW 2000",
      attributeTags: [
        "hostel",
        "social",
        "party",
        "central_station",
        "dorms",
        "private_rooms",
        "female_dorms",
        "24_hour_reception",
        "events",
        "bar",
        "accessible",
      ],
      editorialUrls: ["https://www.nomadicmatt.com/travel-blogs/best-hostels-sydney/"],
      sourceUrls: [
        "https://www.hostelworld.com/hostels/p/1704/wake-up-sydney-central/",
        "https://www.hostelworld.com/hostels/oceania/australia/sydney/",
      ],
      sourceEvidence: {
        currentStatusUrl:
          "https://www.hostelworld.com/hostels/p/1704/wake-up-sydney-central/",
        platformUrls: [
          "https://www.hostelworld.com/hostels/p/1704/wake-up-sydney-central/",
        ],
        notes:
          "Haymarket / Central Station. The official booking and facilities pages explicitly state 24/7 reception; Hostelworld has more than 10,000 reviews and current July 2026 activity. Strictly 18+, with dorm beds restricted to ages 18-40 by the official policy. Nightclub and nightly programming make this a poor quiet-stay choice. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-hostel-wake-up-bondi",
    "Wake Up! Bondi Beach",
    [-33.889445, 151.279295],
    "Wake Up! Bondi Beach sits across from the sand, with a view rooftop, free surfboard hire, yoga, an ice bath, and a sauna. It turns a hostel bed into a beach-and-wellness base, at the cost of slower trips to the CBD.",
    {
      category: "Stay",
      subcategory: "hostel",
      venueKind: "lodging",
      lodgingType: "hostel",
      hours: { default: "Reception open 24 hours daily." },
      price: "$$",
      priceSource:
        "Hostelworld Sydney live lead rate of about €36.31 for a dorm when checked 2026-07-14",
      bookingUrl: "https://www.hostelworld.com/hostels/p/274311/wake-up-bondi-beach/",
      officialUrl: "https://wakeup.com.au/bondibeach/",
      sourcePhoto: "https://wakeup.com.au/wp-content/uploads/WUH_WEB_bondi_IMAGE-7.jpg",
      imageSourceName: "Wake Up! Bondi Beach official property image",
      mapQuery: "Wake Up Bondi Beach, 110 Campbell Parade, Bondi Beach NSW 2026",
      attributeTags: [
        "hostel",
        "beachfront",
        "social",
        "surfboards",
        "sauna",
        "yoga",
        "rooftop",
        "dorms",
        "private_rooms",
        "female_dorms",
        "24_hour_reception",
      ],
      editorialUrls: ["https://www.nomadicmatt.com/travel-blogs/best-hostels-sydney/"],
      sourceUrls: [
        "https://www.hostelworld.com/hostels/p/274311/wake-up-bondi-beach/",
        "https://www.hostelworld.com/hostels/oceania/australia/sydney/",
      ],
      sourceEvidence: {
        currentStatusUrl:
          "https://www.hostelworld.com/hostels/p/274311/wake-up-bondi-beach/",
        platformUrls: [
          "https://www.hostelworld.com/hostels/p/274311/wake-up-bondi-beach/",
        ],
        notes:
          "Bondi Beach. The official FAQ and facilities page explicitly say reception is open 24/7; the current Hostelworld listing has more than 2,900 reviews. The official FAQ says the property is not suitable for accessible travel. Reaching rail and the CBD requires a bus connection. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-hostel-yha-harbour",
    "YHA Sydney Harbour",
    [-33.860151, 151.206976],
    "YHA Sydney Harbour combines all-ensuite rooms with a rooftop view over the Opera House and Harbour Bridge, built above The Big Dig archaeology site. It is the calmer, family-friendlier harbor hostel rather than a nightlife machine.",
    {
      category: "Stay",
      subcategory: "hostel",
      venueKind: "lodging",
      lodgingType: "hostel",
      hours: { default: "Reception and the guest-services team are available 24 hours daily." },
      price: "$$",
      priceSource:
        "Hostelworld Sydney live lead rate of about €30.77 for a dorm when checked 2026-07-14",
      bookingUrl: "https://www.hostelworld.com/hostels/p/38843/yha-sydney-harbour/",
      officialUrl:
        "https://www.yha.com.au/hostels/nsw/sydney-surrounds/sydney-harbour/",
      sourcePhoto:
        "https://www.yha.com.au/contentassets/5708b4fe796e49e4b65ac9adca725e4d/sydh_carousel_exterior.jpg",
      imageSourceName: "YHA Sydney Harbour official property image",
      mapQuery: "YHA Sydney Harbour, 110 Cumberland Street, The Rocks NSW 2000",
      attributeTags: [
        "hostel",
        "harbor_view",
        "quiet",
        "family_friendly",
        "dorms",
        "private_rooms",
        "ensuite",
        "kitchen",
        "24_hour_reception",
        "accessible",
        "heritage",
      ],
      editorialUrls: ["https://www.nomadicmatt.com/travel-blogs/best-hostels-sydney/"],
      sourceUrls: [
        "https://www.yha.com.au/hostels/nsw/sydney-surrounds/sydney-harbour/your-stay/",
        "https://www.hostelworld.com/hostels/p/38843/yha-sydney-harbour/",
      ],
      sourceEvidence: {
        currentStatusUrl:
          "https://www.hostelworld.com/hostels/p/38843/yha-sydney-harbour/",
        platformUrls: [
          "https://www.hostelworld.com/hostels/p/38843/yha-sydney-harbour/",
        ],
        notes:
          "The Rocks. YHA's active booking pages and official 24/7 guest-service statement plus current July 2026 Hostelworld reviews confirm operation. It is generally pricier and quieter than Sydney's party hostels. Hostelworld's listed essential works ended 3 July 2026, before this check, so that expired notice is not carried into current visitor advice. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-hostel-pacific-house",
    "The Pacific House",
    [-33.871527, 151.216683],
    "The Pacific House occupies an 1892 heritage building opposite The Domain, with free breakfast, privacy curtains, and two free social events a day. It balances design-forward rooms with a genuinely organized solo-traveler program.",
    {
      category: "Stay",
      subcategory: "hostel",
      venueKind: "lodging",
      lodgingType: "hostel",
      hours: { default: "Reception open 24 hours daily." },
      price: "$$",
      priceSource:
        "Hostelworld Sydney live lead rate of about €27.69 for a dorm when checked 2026-07-14",
      bookingUrl: "https://www.hostelworld.com/hostels/p/316269/the-pacific-house/",
      officialUrl: "https://www.thepacifichouse.com/",
      sourcePhoto:
        "https://cdn.prod.website-files.com/6327cdb8c29a37fe687fced3/6372e08959fe1c50ea0eb85c_WEB__ARC1183_64.jpg",
      imageSourceName: "The Pacific House official property image",
      mapQuery:
        "The Pacific House, 50 Sir John Young Crescent, Woolloomooloo NSW 2011",
      attributeTags: [
        "hostel",
        "social",
        "heritage",
        "free_breakfast",
        "privacy_curtains",
        "dorms",
        "private_rooms",
        "female_dorms",
        "events",
        "24_hour_reception",
        "accessible",
      ],
      editorialUrls: ["https://www.nomadicmatt.com/travel-blogs/best-hostels-sydney/"],
      sourceUrls: ["https://www.hostelworld.com/hostels/p/316269/the-pacific-house/"],
      sourceEvidence: {
        currentStatusUrl:
          "https://www.hostelworld.com/hostels/p/316269/the-pacific-house/",
        platformUrls: [
          "https://www.hostelworld.com/hostels/p/316269/the-pacific-house/",
        ],
        notes:
          "Woolloomooloo. The official site explicitly states that reception is open 24 hours, and current Hostelworld reviews confirm operation. Some mixed rooms use ceiling fans rather than air-conditioning and room setup differs within the heritage building. Free breakfast runs 7:00-9:30 AM, separate from reception hours. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-hostel-mad-monkey-coogee",
    "Mad Monkey Coogee Beach",
    [-33.92025, 151.256577],
    "Mad Monkey Coogee sits at the beach end of the Bondi-Coogee walk, with ocean-view dorms, apartment-style room layouts, and a weekly social calendar. It is a beach-community hostel with buses, not rail, as the connection back to the city.",
    {
      category: "Stay",
      subcategory: "hostel",
      venueKind: "lodging",
      lodgingType: "hostel",
      hours: {
        default:
          "Reception 8:00 AM-10:00 PM daily; email in advance to arrange arrival outside those hours.",
      },
      price: "$",
      priceSource:
        "Hostelworld Sydney live lead rate of about €19.69 for a dorm when checked 2026-07-14",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/285693/mad-monkey-coogee-beach/",
      officialUrl: "https://www.madmonkeycoogeebeach.com/",
      sourcePhoto:
        "https://www.madmonkeycoogeebeach.com/wp-content/uploads/2025/07/coogee-beach_1200x675.jpg",
      imageSourceName: "Mad Monkey Coogee Beach official property image",
      mapQuery: "Mad Monkey Coogee Beach, 186 Arden Street, Coogee NSW 2034",
      attributeTags: [
        "hostel",
        "beachfront",
        "social",
        "dorms",
        "private_rooms",
        "female_dorms",
        "events",
        "18_plus",
        "privacy_curtains",
        "limited_reception",
        "no_air_conditioning",
      ],
      editorialUrls: [
        "https://www.sydney.com/destinations/sydney/sydney-east/coogee/accommodation/mad-monkey-hostel-coogee-beach",
      ],
      sourceUrls: [
        "https://www.hostelworld.com/hostels/p/285693/mad-monkey-coogee-beach/",
      ],
      sourceEvidence: {
        currentStatusUrl:
          "https://www.hostelworld.com/hostels/p/285693/mad-monkey-coogee-beach/",
        platformUrls: [
          "https://www.hostelworld.com/hostels/p/285693/mad-monkey-coogee-beach/",
        ],
        notes:
          "Coogee Beach. The property site has current 2026 offers and content; Destination NSW and recent Hostelworld reviews confirm operation. Hostelworld gives reception as 8:00 AM-10:00 PM daily and requires advance email for arrivals outside those hours. The property is 18+, has ceiling fans rather than air-conditioning, begins quiet hours at 10:00 PM, and charges for lockers. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-hostel-tequila-sunrise",
    "Tequila Sunrise Hostel Sydney",
    [-33.877837, 151.205399],
    "Tequila Sunrise uses curtained pod-style bunks and includes both breakfast and dinner, giving solo travelers more privacy and a built-in communal meal. It is a dorm-led city-center hostel, not a conventional private-room property.",
    {
      category: "Stay",
      subcategory: "hostel",
      venueKind: "lodging",
      lodgingType: "hostel",
      hours: { default: "Reception 9:00 AM-9:00 PM daily." },
      price: "$$",
      priceSource:
        "Hostelworld Sydney live lead rate of about €32.68 for a dorm when checked 2026-07-14",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/318490/tequila-sunrise-hostel-sydney/",
      officialUrl: "https://www.tequilasunrisehostels.com/sydney-central-hostel",
      sourcePhoto:
        "https://www.tequilasunrisehostels.com/assets/img/destinations/sydney-central-hostels-tequila-sunrise.jpg",
      imageSourceName: "Tequila Sunrise Sydney Central official property image",
      mapQuery: "Tequila Sunrise Hostel Sydney, 611 George Street, Haymarket NSW 2000",
      attributeTags: [
        "hostel",
        "pod_beds",
        "privacy_curtains",
        "free_breakfast",
        "free_dinner",
        "social",
        "dorm_focused",
        "haymarket",
        "limited_reception",
      ],
      editorialUrls: ["https://www.hostelworld.com/hostels/oceania/australia/sydney/"],
      sourceUrls: [
        "https://www.hostelworld.com/hostels/p/318490/tequila-sunrise-hostel-sydney/",
      ],
      sourceEvidence: {
        currentStatusUrl:
          "https://www.hostelworld.com/hostels/p/318490/tequila-sunrise-hostel-sydney/",
        platformUrls: [
          "https://www.hostelworld.com/hostels/p/318490/tequila-sunrise-hostel-sydney/",
        ],
        notes:
          "Haymarket / Chinatown. The official Sydney Central page lists the active property, address, and reception hours of 9:00 AM-9:00 PM; current July 2026 Hostelworld reviews confirm operation. Hostelworld currently markets primarily dorm inventory, while the official site says private options are subject to availability. Recent reviews note limited bathrooms and common space. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-hostel-nates-place",
    "Nate's Place Backpackers",
    [-33.8748, 151.2183],
    "Nate's Place is a compact, dorm-focused Darlinghurst hostel with a rooftop, a deliberately social solo-travel program, and staff support for working-holiday logistics. Its smaller common areas make it more homelike than anonymous, but also easier to crowd.",
    {
      category: "Stay",
      subcategory: "hostel",
      venueKind: "lodging",
      lodgingType: "hostel",
      hours: {
        default:
          "Reception 8:00 AM-8:00 PM daily; prearranged late check-in is handled by the night warden until 2:00 AM.",
      },
      price: "$",
      priceSource:
        "Hostelworld Sydney live lead rate of about €20.46 for a dorm when checked 2026-07-14",
      bookingUrl: "https://www.hostelworld.com/hostels/p/318718/nate-s-place-backpackers/",
      officialUrl: "https://natesplace.com.au/",
      sourcePhoto:
        "https://natesplace.com.au/wp-content/uploads/2025/05/03092024-dsc02464-mejorado-nr.jpg?w=1440",
      imageSourceName: "Nate's Place official property image",
      mapQuery: "Nate's Place Backpackers, 141 William Street, Darlinghurst NSW 2010",
      attributeTags: [
        "hostel",
        "social",
        "rooftop",
        "dorm_only",
        "18_plus",
        "darlinghurst",
        "limited_reception",
        "late_check_in",
        "working_holiday",
      ],
      editorialUrls: ["https://www.hostelworld.com/hostels/oceania/australia/sydney/"],
      sourceUrls: [
        "https://www.hostelworld.com/hostels/p/318718/nate-s-place-backpackers/",
      ],
      sourceEvidence: {
        currentStatusUrl:
          "https://www.hostelworld.com/hostels/p/318718/nate-s-place-backpackers/",
        platformUrls: [
          "https://www.hostelworld.com/hostels/p/318718/nate-s-place-backpackers/",
        ],
        notes:
          "Darlinghurst. The official site's active booking flow and current July 2026 Hostelworld reviews confirm operation. Hostelworld gives reception as 8:00 AM-8:00 PM with prearranged night-warden check-in until 2:00 AM. The property is 18+, dorm-only, and has compact kitchen and common areas. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-hostel-nomads",
    "Nomads Sydney",
    [-33.87326, 151.20493],
    "Nomads is a large central hostel with dorms, private deluxe rooms, the Scary Canary bar, and free daily events. It is designed for travelers who want a ready-made party network near Town Hall, not a reliably quiet dorm.",
    {
      category: "Stay",
      subcategory: "hostel",
      venueKind: "lodging",
      lodgingType: "hostel",
      hours: { default: "Reception open 24 hours daily." },
      price: "$",
      priceSource:
        "Hostelworld Sydney live lead rate of about €23.85 for a dorm when checked 2026-07-14",
      bookingUrl: "https://www.hostelworld.com/hostels/p/905/nomads-sydney/",
      officialUrl: "https://nomadsworld.com/australia/nomads-sydney/",
      sourcePhoto:
        "https://api.nomadsworld.com/wp-content/uploads/2017/12/backpackers-sydney-nomads-hostel.jpeg",
      imageSourceName: "Nomads Sydney official property image",
      mapQuery: "Nomads Sydney, 477 Kent Street, Sydney NSW 2000",
      attributeTags: [
        "hostel",
        "party",
        "nightclub",
        "social",
        "dorms",
        "private_rooms",
        "24_hour_reception",
        "cbd",
        "18_plus",
        "cashless",
        "events",
      ],
      editorialUrls: ["https://www.nomadicmatt.com/travel-blogs/best-hostels-sydney/"],
      sourceUrls: ["https://www.hostelworld.com/hostels/p/905/nomads-sydney/"],
      sourceEvidence: {
        currentStatusUrl: "https://www.hostelworld.com/hostels/p/905/nomads-sydney/",
        platformUrls: ["https://www.hostelworld.com/hostels/p/905/nomads-sydney/"],
        notes:
          "Sydney CBD / Darling Harbour edge. The official booking site and current June 2026 Hostelworld reviews confirm operation; Hostelworld explicitly lists 24/7 reception. Formerly Base Sydney, the current public name is Nomads Sydney. The hostel is 18+, cashless, and party-led, with expected bar noise and some recent mixed cleanliness reports. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-hostel-mad-monkey-bayswater",
    "Mad Monkey Bayswater",
    [-33.876259, 151.228149],
    "Mad Monkey Bayswater uses a townhouse just behind Kings Cross for a rooftop, gaming lounge, and organized events without placing beds directly over the main nightlife strip. The small footprint creates a communal feel, with tight rooms as the tradeoff.",
    {
      category: "Stay",
      subcategory: "hostel",
      venueKind: "lodging",
      lodgingType: "hostel",
      hours: {
        default:
          "Reception 8:00 AM-8:00 PM daily; notify the property before arrival after 8:00 PM so the night manager can assist.",
      },
      price: "$",
      priceSource:
        "Hostelworld Sydney live lead rate of about £18.89 for a dorm when checked 2026-07-14",
      bookingUrl: "https://www.hostelworld.com/hostels/p/51800/mad-monkey-bayswater/",
      officialUrl:
        "https://www.madmonkey.com.au/locations/australia/sydney/mad-monkey-bayswater",
      sourcePhoto:
        "https://lirp.cdn-website.com/67d31788/dms3rep/multi/opt/untitled-0091-1-1920w.jpg",
      imageSourceName: "Mad Monkey Bayswater official property image",
      mapQuery: "Mad Monkey Bayswater, 79 Bayswater Road, Potts Point NSW 2011",
      attributeTags: [
        "hostel",
        "social",
        "rooftop",
        "events",
        "gaming",
        "dorm_focused",
        "female_dorms",
        "kings_cross",
        "18_plus",
        "limited_reception",
      ],
      editorialUrls: ["https://www.hostelworld.com/hostels/oceania/australia/sydney/"],
      sourceUrls: [
        "https://www.hostelworld.com/hostels/p/51800/mad-monkey-bayswater/",
      ],
      sourceEvidence: {
        currentStatusUrl:
          "https://www.hostelworld.com/hostels/p/51800/mad-monkey-bayswater/",
        platformUrls: [
          "https://www.hostelworld.com/hostels/p/51800/mad-monkey-bayswater/",
        ],
        notes:
          "Potts Point / Kings Cross. Official and Hostelworld pages agree on reception from 8:00 AM-8:00 PM and advance notice for the night manager after hours; current June 2026 reviews confirm operation. The property is 18+, dorms are recommended for ages 18-35, a physical passport is required, and rooms are compact. Mad Monkey Kings Cross was excluded because its official and Hostelworld hours conflict. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-hostel-stoke-beach-house",
    "Stoke Beach House",
    [-33.795379, 151.285582],
    "Stoke Beach House is a Manly surf hostel about 100 meters from the beach, bundling breakfast, yoga, and limited free surfboard, bicycle, and snorkel hire into the rate. It gives backpackers a beach-town stay with the ferry five minutes away.",
    {
      category: "Stay",
      subcategory: "hostel",
      venueKind: "lodging",
      lodgingType: "hostel",
      hours: {
        default:
          "Reception phone service 9:00 AM-7:00 PM daily; contact the night manager in advance for after-hours arrival.",
      },
      price: "$$",
      priceSource:
        "Hostelworld Sydney live lead rate of about €33.23 for a dorm when checked 2026-07-14",
      bookingUrl: "https://www.hostelworld.com/hostels/p/8779/stoke-beach-house/",
      officialUrl: "https://www.stokebeachhouse.com.au/",
      sourcePhoto:
        "https://images.squarespace-cdn.com/content/v1/67c4e385588bca377a1d431f/fc98404b-4685-4dc3-8f58-b92ff12d171b/20250122-_A0A2945+-+Edited.png?format=1500w",
      imageSourceName: "Stoke Beach House official property image",
      mapQuery: "Stoke Beach House, 24-28 Raglan Street, Manly NSW 2095",
      attributeTags: [
        "hostel",
        "beach",
        "surfboards",
        "bikes",
        "yoga",
        "free_breakfast",
        "social",
        "dorms",
        "private_rooms",
        "manly",
        "18_plus",
        "limited_reception",
      ],
      editorialUrls: [
        "https://www.sydney.com/destinations/sydney/sydney-north/manly/accommodation/stoke-beach-house-0",
      ],
      sourceUrls: [
        "https://www.stokebeachhouse.com.au/terms-of-stay",
        "https://www.stokebeachhouse.com.au/faq",
        "https://www.hostelworld.com/hostels/p/8779/stoke-beach-house/",
      ],
      sourceEvidence: {
        currentStatusUrl:
          "https://www.hostelworld.com/hostels/p/8779/stoke-beach-house/",
        platformUrls: [
          "https://www.hostelworld.com/hostels/p/8779/stoke-beach-house/",
        ],
        notes:
          "Manly. Official booking, FAQ, and terms pages plus current 2026 Hostelworld inventory confirm operation. The official terms identify 9:00 AM-7:00 PM as the daily window to call reception rather than a separately labeled building-open schedule; the FAQ confirms a night manager for after-hours arrival, and the hours wording preserves that distinction. The property is 18+, dorms target ages 18-40, an AUD 70 security preauthorization applies, and CBD nights require ferry or bus travel. Checked 2026-07-14.",
      },
    },
  ),
];

const pubStops: GuideStop[] = [
  stop(
    "sydney-pub-marys-newtown",
    "Mary's Newtown",
    [-33.8960854, 151.1797467],
    "Mary's turns a narrow former Newtown pool hall into a candlelit rock bar where loud guitars, natural wine, burgers, and buttermilk fried chicken matter more than polish. The short food menu and walk-in-only service make it an easy, rowdy neighborhood anchor rather than a formal dining stop.",
    {
      category: "Nightlife",
      subcategory: "rock_bar",
      venueKind: "nightlife",
      nightlifeType: "dive_bar",
      musicGenres: ["rock", "punk", "metal"],
      price: "$$",
      priceSource: "Official menu: core burgers A$23-A$30 when checked 2026-07-14",
      attributeTags: ["casual_nightlife", "local_bar", "loud_music", "walk_in_friendly_nightlife", "food_bar", "natural_wine"],
      hours: { mon: "4:00 PM-10:00 PM", tue: "4:00 PM-10:00 PM", wed: "4:00 PM-12:00 AM", thu: "4:00 PM-12:00 AM", fri: "12:00 PM-12:00 AM", sat: "12:00 PM-12:00 AM", sun: "12:00 PM-10:00 PM" },
      officialUrl: "https://www.marys.wtf/locations/newtown/",
      sourcePhoto: "https://www.marys.wtf/wp-content/uploads/2023/06/Marys_Newtown_1920x1080.jpg",
      imageSourceName: "Mary's Newtown official venue image",
      mapQuery: "Mary's Newtown, 6 Mary Street, Newtown NSW 2042",
      editorialUrls: ["https://concreteplayground.com/sydney/bars/marys", "https://www.timeout.com/sydney/bars/marys"],
      sourceEvidence: {
        currentStatusUrl: "https://www.marys.wtf/locations/newtown/",
        notes: "Open with exact official trading hours and current menu when checked 2026-07-14. The official page's 'exclusive hire only' wording belongs to its private-event section; normal public service remains walk-in only.",
      },
    },
  ),
  stop(
    "sydney-pub-arcadia-liquors",
    "Arcadia Liquors",
    [-33.892682, 151.20075],
    "Arcadia calls itself Redfern's community living room, and the description fits: a compact front bar, fairy-lit rear courtyard, local beer, wine, and unfussy cocktails draw neighbors without a door ritual. It is strongest for conversation and a loose courtyard session rather than a destination drinks performance.",
    {
      category: "Nightlife",
      subcategory: "neighborhood_bar",
      venueKind: "nightlife",
      nightlifeType: "beer_bar",
      musicGenres: ["indie", "background"],
      price: "$$",
      priceSource: "Official current menu and Concrete Playground venue listing, checked 2026-07-14",
      attributeTags: ["local_bar", "courtyard", "low_key_nightlife", "casual_nightlife", "walk_in_friendly_nightlife"],
      hours: { mon: "4:00 PM-12:00 AM", tue: "4:00 PM-12:00 AM", wed: "4:00 PM-12:00 AM", thu: "4:00 PM-12:00 AM", fri: "4:00 PM-12:00 AM", sat: "3:00 PM-12:00 AM", sun: "3:00 PM-10:00 PM" },
      officialUrl: "https://www.arcadialiquors.com/",
      bookingUrl: "https://www.arcadialiquors.com/",
      sourcePhoto: "https://images.squarespace-cdn.com/content/v1/68527551269d526a02561abd/b2123dd9-6a51-4d48-a403-3cf1233f584f/18%2B-%2BArcadia%2B01Jul25%2Bx%2BLast%2BMonth.jpg",
      imageSourceName: "Arcadia Liquors official venue image",
      mapQuery: "Arcadia Liquors, 7 Cope Street, Redfern NSW 2016",
      editorialUrls: ["https://concreteplayground.com/sydney/bars/arcadia-liquors", "https://www.broadsheet.com.au/sydney/redfern/bars/arcadia-liquors"],
      sourceEvidence: {
        currentStatusUrl: "https://www.arcadialiquors.com/",
        notes: "Open seven days with exact hours on the official homepage when checked 2026-07-14. This replaces Ramblin' Rascal Tavern, whose official pages materially disagreed on current trading hours.",
      },
    },
  ),
  stop(
    "sydney-pub-tios",
    "Tio's Cerveceria",
    [-33.879642, 151.210434],
    "Tio's is the deliberately loose Surry Hills agave institution built around tequila, cold margaritas, Tecate, spiced popcorn, and the long-running shot-with-the-Green-Thing ritual. More than 130,000 margaritas and a daily happy-hour offer give the room a concrete identity beyond generic Mexican-bar styling.",
    {
      category: "Nightlife",
      subcategory: "margarita_bar",
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      musicGenres: ["latin", "rock", "party"],
      price: "$$",
      priceSource: "Official happy hour: A$13 classic margaritas and A$7 tap beer, checked 2026-07-14",
      attributeTags: ["agave", "margaritas", "cheap_drinks", "free_popcorn", "casual_nightlife", "accessible"],
      hours: { mon: "Closed", tue: "Closed", wed: "5:00 PM-12:00 AM", thu: "5:00 PM-12:00 AM", fri: "4:00 PM-12:00 AM", sat: "4:00 PM-12:00 AM", sun: "4:00 PM-12:00 AM" },
      officialUrl: "https://www.muchogroup.com.au/tios",
      bookingUrl: "https://www.muchogroup.com.au/tios",
      sourcePhoto: "https://images.squarespace-cdn.com/content/v1/64509ef043e5407e4fd5eba9/f35ffba2-0ff7-4ed6-82f0-bd130be0ae98/MUCHO-Website-TIOS-Landscape-SplitScreen-1-WEB.jpg",
      imageSourceName: "Tio's official venue image",
      mapQuery: "Tio's Cerveceria, 4/14 Foster Street, Surry Hills NSW 2010",
      editorialUrls: ["https://www.broadsheet.com.au/sydney/surry-hills/bars/tios-cerveceria", "https://concreteplayground.com/sydney/bars/tios-cerveceria"],
      sourceEvidence: {
        currentStatusUrl: "https://www.muchogroup.com.au/tios",
        notes: "Official page confirms current service, exact hours, daily 4:00-6:00 PM happy hour, and street-level wheelchair access through a secondary entrance on request. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-pub-earls-juke-joint",
    "Earl's Juke Joint",
    [-33.900026, 151.177784],
    "Behind the preserved Betta Meats butcher frontage, Earl's opens into a long, dim Newtown room with New Orleans cues, American whiskey, craft beer, and cocktails made without cocktail-bar ceremony. The bar gets dense after dinner, so early happy hour is the better window for a seat and a conversation.",
    {
      category: "Nightlife",
      subcategory: "neighborhood_cocktail_bar",
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      musicGenres: ["blues", "soul", "rock"],
      price: "$$",
      priceSource: "Official happy hour: A$15 cocktails, A$10 wine, and A$8 tap beer from 5:00-7:00 PM, checked 2026-07-14",
      attributeTags: ["hidden_entrance", "local_bar", "happy_hour", "casual_nightlife", "date_night"],
      hours: { mon: "Closed", tue: "5:00 PM-12:00 AM", wed: "5:00 PM-12:00 AM", thu: "5:00 PM-12:00 AM", fri: "5:00 PM-12:00 AM", sat: "5:00 PM-12:00 AM", sun: "5:00 PM-12:00 AM" },
      officialUrl: "https://earlsjukejoint.com.au/",
      sourcePhoto: "https://images.squarespace-cdn.com/content/v1/5e7d5c9b598f9f6f7a641185/89acf095-a5d5-4cca-ab37-cc093603f676/EARLS%2BJUN-1045.jpg",
      imageSourceName: "Earl's Juke Joint official venue image",
      mapQuery: "Earl's Juke Joint, 407 King Street, Newtown NSW 2042",
      editorialUrls: ["https://concreteplayground.com/sydney/bars/earls-juke-joint", "https://www.theurbanlist.com/sydney/directory/earls-juke-joint"],
      sourceEvidence: {
        currentStatusUrl: "https://earlsjukejoint.com.au/contact",
        notes: "Official contact page confirms Tuesday-Sunday 5:00 PM-midnight and current happy-hour prices. Walk-ins can face a wait once the narrow room fills. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-pub-jacobys-tiki-bar",
    "Jacoby's Tiki Bar",
    [-33.8990989, 151.1732115],
    "Jacoby's fuses a serious rum-and-daiquiri bar with Twin Peaks references, tropical wallpaper, fishing floats, puffer fish, and genuinely oversized communal drinks. It is a compact pre- or post-Enmore-Theatre party room, not a hushed tiki museum, and Friday or Saturday can become a full singalong.",
    {
      category: "Nightlife",
      subcategory: "tiki_bar",
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      musicGenres: ["rock", "pop", "alternative"],
      price: "$$",
      priceSource: "Official drinks menu and current venue listings, checked 2026-07-14",
      attributeTags: ["tiki", "rum", "group_drinks", "lively_nightlife", "late_night", "pre_theatre"],
      hours: { mon: "Closed", tue: "Closed", wed: "6:00 PM-12:00 AM", thu: "6:00 PM-12:00 AM", fri: "5:00 PM-2:00 AM", sat: "5:00 PM-2:00 AM", sun: "5:00 PM-12:00 AM" },
      officialUrl: "https://www.jacobys-tiki-bar.com/",
      sourcePhoto: "https://images.squarespace-cdn.com/content/v1/5a03b0ad4c0dbf4a8c62cf36/1653023120712-2RTVAIPESDEOVVA108QP/_CNP4395.jpg",
      imageSourceName: "Jacoby's Tiki Bar official venue image",
      mapQuery: "Jacoby's Tiki Bar, 154 Enmore Road, Enmore NSW 2042",
      editorialUrls: ["https://www.timeout.com/sydney/bars/jacobys", "https://concreteplayground.com/sydney/bars/jacobys-tiki-bar"],
      sourceEvidence: {
        currentStatusUrl: "https://www.jacobys-tiki-bar.com/loction",
        notes: "The official visit page gives exact current hours and address. The small room is busiest around Enmore Theatre shows; arrive early if a seat matters. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-pub-duke-of-enmore",
    "The Duke of Enmore",
    [-33.89913, 151.172778],
    "The Duke is an 1880 neighborhood pub recast as a compact rock-and-live-music room, with a small stage, pizzas, pub food, and an event bill that reaches from metal to local bands. Its identity changes with the night's lineup, while the front bar still works for an ordinary beer before an Enmore Road show.",
    {
      category: "Nightlife",
      subcategory: "live_music_pub",
      venueKind: "nightlife",
      nightlifeType: "live_music_venue",
      musicGenres: ["rock", "metal", "punk", "live_music"],
      price: "$$",
      priceSource: "Official daily specials: A$7 happy-hour beer, wine, and non-alcoholic beer, checked 2026-07-14",
      attributeTags: ["live_music", "local_bar", "happy_hour", "food_bar", "late_night", "casual_nightlife"],
      hours: { mon: "Closed", tue: "4:00 PM-12:00 AM", wed: "4:00 PM-12:00 AM", thu: "4:00 PM-12:00 AM", fri: "12:00 PM-2:30 AM", sat: "12:00 PM-2:30 AM", sun: "12:00 PM-10:30 PM" },
      officialUrl: "https://www.oddculture.group/venue/duke",
      bookingUrl: "https://www.oddculture.group/venue/duke",
      sourcePhoto: "https://cdn.sanity.io/images/9lny8onv/production/bd4b9eaa2afd311cbb7282d4427adc61325492a6-1181x787.jpg?fit=max&auto=format",
      imageSourceName: "The Duke of Enmore official venue image",
      mapQuery: "The Duke of Enmore, 148 Enmore Road, Enmore NSW 2042",
      editorialUrls: ["https://www.broadsheet.com.au/sydney/enmore/bars/the-duke-of-enmore", "https://concreteplayground.com/sydney/bars/the-duke-of-enmore"],
      sourceEvidence: {
        currentStatusUrl: "https://www.oddculture.group/venue/duke",
        notes: "Open with exact hours and active official event programming when checked 2026-07-14. Show times, ticketing, and crowd intensity depend on the official What's On calendar.",
      },
    },
  ),
  stop(
    "sydney-pub-courthouse-hotel",
    "The Courthouse Hotel (The Courty)",
    [-33.8960613, 151.1782623],
    "The Courty has served Newtown from its Australia Street corner since 1859, but the draw now is practical rather than museum-like: a leafy, dog-friendly beer garden, pub nachos, taps, weekly trivia, and a cross-section of locals. It suits an unhurried afternoon far better than a tightly scheduled bar crawl.",
    {
      category: "Nightlife",
      subcategory: "neighborhood_pub",
      venueKind: "nightlife",
      nightlifeType: "pub",
      musicGenres: ["background"],
      price: "$$",
      priceSource: "Official current food and drinks menus, checked 2026-07-14",
      attributeTags: ["beer_garden", "dog_friendly", "historic", "local_bar", "food_bar", "walk_in_friendly_nightlife"],
      hours: { mon: "12:00 PM-12:00 AM", tue: "12:00 PM-12:00 AM", wed: "12:00 PM-12:00 AM", thu: "12:00 PM-12:00 AM", fri: "11:00 AM-12:00 AM", sat: "12:00 PM-12:00 AM", sun: "12:00 PM-10:00 PM" },
      officialUrl: "https://thecourty.com.au/",
      bookingUrl: "https://thecourty.com.au/",
      sourcePhoto: "https://thecourty.com.au/wp-content/uploads/2026/06/Courty-20.02.25-51-600x600.jpg",
      imageSourceName: "The Courty official venue image",
      mapQuery: "The Courthouse Hotel, 202 Australia Street, Newtown NSW 2042",
      editorialUrls: ["https://concreteplayground.com/sydney/bars/the-courthouse-hotel", "https://www.timeout.com/sydney/bars/the-courthouse-hotel"],
      sourceEvidence: {
        currentStatusUrl: "https://thecourty.com.au/",
        notes: "Official site confirms current exact hours, events, and menus. Walk-ins are welcome; children are allowed until 9:00 PM. The beer garden is wheelchair accessible but the FAQ says there is no accessible toilet. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-pub-lord-gladstone",
    "The Lord Gladstone",
    [-33.887803, 151.2013],
    "The Gladdy is a Chippendale pub whose upstairs Goodspace gallery, courtyard, murals, gigs, art openings, and parties make the cultural program as important as the schooners and pub food. Check the event before arriving: a quiet early drink and a packed late show are both plausible versions of the same building.",
    {
      category: "Nightlife",
      subcategory: "art_and_music_pub",
      venueKind: "nightlife",
      nightlifeType: "pub",
      musicGenres: ["rock", "jazz", "dj", "live_music"],
      price: "$$",
      priceSource: "Official current pub and kitchen menu, checked 2026-07-14",
      attributeTags: ["live_music", "art", "gallery", "courtyard", "local_bar", "lively_nightlife"],
      hours: { mon: "Closed", tue: "12:00 PM-12:00 AM", wed: "12:00 PM-12:00 AM", thu: "12:00 PM-3:00 AM", fri: "12:00 PM-3:00 AM", sat: "12:00 PM-3:00 AM", sun: "12:00 PM-12:00 AM" },
      officialUrl: "https://www.lordgladstone.com.au/menu",
      sourcePhoto: "https://cdn.concreteplayground.com/content/uploads/2019/05/LordGladstone-BenJohnson-MitchCrum.jpg",
      imageSourceName: "Concrete Playground venue image of The Lord Gladstone",
      mapQuery: "The Lord Gladstone, 115 Regent Street, Chippendale NSW 2008",
      editorialUrls: ["https://concreteplayground.com/sydney/bars/the-lord-gladstone", "https://www.broadsheet.com.au/sydney/chippendale/bars/lord-gladstone-hotel"],
      sourceEvidence: {
        currentStatusUrl: "https://www.lordgladstone.com.au/menu",
        notes: "Official site gives exact pub and kitchen hours and continues to list Goodspace and active functions. Upstairs events may use their own schedule and ticket rules. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-pub-town-hall-hotel-newtown",
    "Town Hall Hotel Newtown (The Townie)",
    [-33.898, 151.1786097],
    "The Townie is the King Street local that keeps several kinds of night under one roof: a street-level pub, pool lounge, outdoor spaces, Friday-Saturday original bands, and a small rooftop bar. It is less curated than Newtown's cocktail rooms and more useful when a group wants cheapish drinks, music, pool, and very late weekend hours.",
    {
      category: "Nightlife",
      subcategory: "live_music_pub",
      venueKind: "nightlife",
      nightlifeType: "pub",
      musicGenres: ["rock", "indie", "folk", "live_music"],
      price: "$$",
      priceSource: "Official current drinks and food menus, checked 2026-07-14",
      attributeTags: ["live_music", "pool_table", "rooftop", "late_night", "local_bar", "casual_nightlife"],
      hours: { mon: "10:00 AM-1:00 AM", tue: "10:00 AM-1:00 AM", wed: "10:00 AM-1:00 AM", thu: "10:00 AM-1:00 AM", fri: "10:00 AM-4:00 AM", sat: "10:00 AM-4:00 AM", sun: "10:00 AM-12:00 AM" },
      officialUrl: "https://townhallhotelnewtown.com/",
      bookingUrl: "https://townhallhotelnewtown.com/contact",
      sourcePhoto: "https://townhallhotelnewtown.com/_assets/BBBBBBBB/Page-image/CG2UBFUTT0OZ-full.jpg",
      imageSourceName: "Town Hall Hotel Newtown official venue image",
      mapQuery: "Town Hall Hotel Newtown, 326 King Street, Newtown NSW 2042",
      editorialUrls: ["https://cityhub.com.au/places/town-hall-hotel-newtown/", "https://www.starobserver.com.au/places/town-hall-hotel-newtown"],
      sourceEvidence: {
        currentStatusUrl: "https://townhallhotelnewtown.com/contact",
        notes: "Official contact page confirms exact pub hours and original live music Friday-Saturday. Midway Bar opens daily from 4:00 PM and noon on weekends; Cactus rooftop opens Friday-Saturday from 5:00 PM, so those spaces do not share every pub hour. Checked 2026-07-14.",
      },
    },
  ),
  stop(
    "sydney-pub-old-fitzroy-hotel",
    "The Old Fitzroy Hotel",
    [-33.8731172, 151.2206205],
    "The Old Fitz is a Woolloomooloo corner pub, French-leaning bistro, and seventy-seat independent theatre in one compact building. A drink before a downstairs show is the clearest reason to cross town, but the small public bar and local crowd still work without a ticket.",
    {
      category: "Nightlife",
      subcategory: "theatre_pub",
      venueKind: "nightlife",
      nightlifeType: "pub",
      musicGenres: ["theatre", "background"],
      price: "$$",
      priceSource: "Official pub and Bistro Fitz menus, checked 2026-07-14",
      attributeTags: ["theatre", "historic", "local_bar", "pre_theatre", "food_bar", "low_key_nightlife"],
      hours: { mon: "12:00 PM-11:00 PM", tue: "12:00 PM-11:00 PM", wed: "12:00 PM-12:00 AM", thu: "12:00 PM-12:00 AM", fri: "12:00 PM-12:00 AM", sat: "12:00 PM-12:00 AM", sun: "12:00 PM-10:00 PM" },
      officialUrl: "https://www.oddculture.group/venue/the-old-fitzroy-hotel",
      bookingUrl: "https://www.oddculture.group/venue/the-old-fitzroy-hotel",
      sourcePhoto: "https://cdn.sanity.io/images/9lny8onv/production/1f7a3647f0a6c75243a2da849a4992522773f6cb-2400x3000.jpg?fit=max&auto=format",
      imageSourceName: "The Old Fitzroy Hotel official venue image",
      mapQuery: "The Old Fitzroy Hotel, 129 Dowling Street, Woolloomooloo NSW 2011",
      editorialUrls: ["https://www.broadsheet.com.au/sydney/woolloomooloo/bars/old-fitzroy-hotel", "https://concreteplayground.com/sydney/bars/the-old-fitzroy-hotel"],
      sourceEvidence: {
        currentStatusUrl: "https://www.oddculture.group/venue/the-old-fitzroy-hotel",
        notes: "Official venue page confirms exact pub and bistro hours. Theatre performances, tickets, and the pre-theatre banquet follow the separate official theatre calendar. Checked 2026-07-14.",
      },
    },
  ),
];

const cocktailStops: GuideStop[] = [
  stop("sydney-cocktail-maybe-sammy", "Maybe Sammy", [-33.8617117, 151.2069141], "Maybe Sammy brings 1950s Vegas and grand European hotel-bar theater to The Rocks: pink-jacketed service, elevated classics, playful miniature drinks, and a polished room whose hospitality is as considered as its technique. It is a destination bar with destination-bar queues and prices, so reserve when the evening cannot absorb a wait.", {
    category: "Nightlife", subcategory: "destination_cocktail_bar", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["jazz", "swing", "lounge"], price: "$$$", priceSource: "Official cocktail menu and current World's 50 Best listing, checked 2026-07-14", attributeTags: ["craft_cocktails", "award_winning", "theatrical", "premium_drinks", "reservation_recommended_nightlife", "date_night"],
    hours: { mon: "Closed", tue: "Closed", wed: "4:30 PM-1:00 AM", thu: "4:30 PM-1:00 AM", fri: "4:30 PM-1:00 AM", sat: "4:30 PM-1:00 AM", sun: "Closed" }, officialUrl: "https://www.maybesammy.com/home", bookingUrl: "https://www.maybesammy.com/home", sourcePhoto: "https://media.timeout.com/images/105384519/750/422/image.jpg", imageSourceName: "Time Out venue image of Maybe Sammy", mapQuery: "Maybe Sammy, 115 Harrington Street, The Rocks NSW 2000", editorialUrls: ["https://www.theworlds50best.com/bars/best-in-the-world/the-list/maybe-sammy.html", "https://www.broadsheet.com.au/sydney/guides/best-cocktails"], sourceEvidence: { currentStatusUrl: "https://www.maybesammy.com/home", notes: "Current official page confirms Wednesday-Saturday 4:30 PM-1:00 AM; older directory hours were not used. The official menu discloses service and card surcharges. Checked 2026-07-14." },
  }),
  stop("sydney-cocktail-cantina-ok", "Cantina OK!", [-33.8703309, 151.2052792], "Cantina OK! compresses a serious agave program into a roughly twenty-person standing room in a CBD service lane. Rare mezcal, hand-shaved ice, fresh-pressed citrus, and tightly built margaritas justify the squeeze; there are no seats or reservations, so a queue is part of the format.", {
    category: "Nightlife", subcategory: "agave_bar", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["latin", "background"], price: "$$", priceSource: "Official current drinks menu, checked 2026-07-14", attributeTags: ["craft_cocktails", "agave", "mezcal", "small_room", "walk_in_only", "late_night"],
    hours: { mon: "4:00 PM-2:00 AM", tue: "4:00 PM-2:00 AM", wed: "4:00 PM-2:00 AM", thu: "4:00 PM-2:00 AM", fri: "4:00 PM-2:00 AM", sat: "4:00 PM-2:00 AM", sun: "4:00 PM-2:00 AM" }, officialUrl: "https://www.muchogroup.com.au/cantina-ok", sourcePhoto: "https://images.squarespace-cdn.com/content/v1/64509ef043e5407e4fd5eba9/651fd8e6-c403-489c-b131-96d2285fc43a/MUCHO-Website-CANTINA-OK-1.jpg", imageSourceName: "Cantina OK! official venue image", mapQuery: "Cantina OK!, Council Place, Sydney NSW 2000", editorialUrls: ["https://www.broadsheet.com.au/sydney/cbd/bars/cantina-ok", "https://www.theurbanlist.com/sydney/directory/cantina-ok"], sourceEvidence: { currentStatusUrl: "https://www.muchogroup.com.au/cantina-ok", notes: "Official page confirms daily 4:00 PM-2:00 AM operation. This is a tiny standing, walk-in-only bar with no conventional seating; arrive early or expect to wait. Checked 2026-07-14." },
  }),
  stop("sydney-cocktail-razz-room", "Razz Room", [-33.8680096, 151.2061761], "Razz Room is a 2026 York Street basement built around daiquiris, a sunken dance floor, and pre-gloss 1970s New York disco references. It begins as a cocktail lounge, then DJs and live performers take over from 7 PM and tables yield to dancing, giving Sydney a credible bridge between bar and club.", {
    category: "Nightlife", subcategory: "daiquiri_discotheque", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["disco", "house", "funk", "jazz", "dj", "live_music"], price: "$$", priceSource: "Official Velvet Hour: A$13 daiquiris, A$10 wine, and A$7 beer from 4:00-6:00 PM, checked 2026-07-14", attributeTags: ["craft_cocktails", "daiquiris", "dance_floor", "dj_sets", "live_music", "late_night", "new_opening"],
    hours: { mon: "4:00 PM-3:00 AM", tue: "4:00 PM-3:00 AM", wed: "4:00 PM-3:00 AM", thu: "4:00 PM-4:00 AM", fri: "4:00 PM-4:00 AM", sat: "4:00 PM-4:00 AM", sun: "4:00 PM-3:00 AM" }, officialUrl: "https://www.oddculture.group/venue/razz-room", sourcePhoto: "https://cdn.sanity.io/images/9lny8onv/production/2aaf558dca90eeb08f8c7aa8526a0e2c5d903dfd-1638x2048.jpg?fit=max&auto=format", imageSourceName: "Razz Room official venue image", mapQuery: "Razz Room, 18-20 York Street, Sydney NSW 2000", editorialUrls: ["https://www.broadsheet.com.au/sydney/bars/razz-room", "https://concreteplayground.com/sydney/bars/razz-room"], sourceUrls: ["https://www.oddculture.group/event/razz-room-velvet-hour"], sourceEvidence: { currentStatusUrl: "https://www.oddculture.group/venue/razz-room", notes: "Opened 14 April 2026 and remains active with exact official hours and current programming. Walk-in only except bookings for groups of 15 or more; the room changes from lounge to dance floor after performers begin around 7:00 PM. Checked 2026-07-14. This replaces PS40 because PS40's official and current Broadsheet hours conflicted." },
  }),
  stop("sydney-cocktail-old-mates-place", "Old Mate's Place", [-33.869636, 151.2051674], "A lift through a Clarence Street office building reveals Old Mate's library-like main room and leafy rooftop, where strong cocktails, local beer, and cheesesteaks feel far less formal than the hidden entrance suggests. Use the roof for skyline air or the shelves-and-leather interior for a slower late drink.", {
    category: "Nightlife", subcategory: "rooftop_cocktail_bar", venueKind: "nightlife", nightlifeType: "rooftop_bar", musicGenres: ["soul", "funk", "background"], price: "$$", priceSource: "Official current drinks and food menus, checked 2026-07-14", attributeTags: ["craft_cocktails", "hidden_entrance", "rooftop", "late_night", "food_bar", "walk_in_friendly_nightlife"],
    hours: { mon: "Closed", tue: "4:00 PM-2:00 AM", wed: "4:00 PM-2:00 AM", thu: "4:00 PM-2:00 AM", fri: "3:00 PM-2:00 AM", sat: "3:00 PM-2:00 AM", sun: "3:00 PM-2:00 AM" }, officialUrl: "https://www.oldmatesplace.com/", bookingUrl: "https://www.oldmatesplace.com/", sourcePhoto: "https://images.squarespace-cdn.com/content/v1/5b87600e7e3c3a634e42f92b/1535600927355-0MZGHTN5Z4WY44W3FNHQ/OMP_bar2_darkheader.jpg", imageSourceName: "Old Mate's Place official venue image", mapQuery: "Old Mate's Place, Level 4, 199 Clarence Street, Sydney NSW 2000", editorialUrls: ["https://www.broadsheet.com.au/sydney/cbd/bars/old-mates-place", "https://www.sydney.com/articles/best-bars-in-sydney"], sourceEvidence: { currentStatusUrl: "https://www.oldmatesplace.com/", notes: "Official site confirms exact hours and current reservations. Bookings are limited to smaller parties and the venue retains space for walk-ins; rooftop access is weather- and capacity-dependent. Checked 2026-07-14." },
  }),
  stop("sydney-cocktail-bar-planet", "Bar Planet", [-33.8982604, 151.1776339], "Bar Planet treats the martini as a laboratory rather than a dress code, using an evolving house spirit 'master stock,' very cold glassware, native ingredients, and curry popcorn in a relaxed Newtown room. It is technically ambitious but emphatically walk-in and unbuttoned.", {
    category: "Nightlife", subcategory: "martini_bar", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["disco", "electronic", "background"], price: "$$", priceSource: "Official current menu and A$13 opening-hour cocktail offer, checked 2026-07-14", attributeTags: ["craft_cocktails", "martinis", "experimental", "walk_in_only", "casual_nightlife", "late_night", "accessible"],
    hours: { mon: "4:00 PM-12:00 AM", tue: "4:00 PM-12:00 AM", wed: "4:00 PM-12:00 AM", thu: "4:00 PM-12:00 AM", fri: "4:00 PM-2:00 AM", sat: "3:00 PM-2:00 AM", sun: "3:00 PM-12:00 AM" }, officialUrl: "https://www.muchogroup.com.au/bar-planet", sourcePhoto: "https://images.squarespace-cdn.com/content/v1/64509ef043e5407e4fd5eba9/e7ef0657-905b-4c17-9853-8d37320973b0/MUCHO-Website-BAR-PLANET-Landscape-1.jpg", imageSourceName: "Bar Planet official venue image", mapQuery: "Bar Planet, 16 Enmore Road, Newtown NSW 2042", editorialUrls: ["https://www.broadsheet.com.au/sydney/newtown/bars/bar-planet", "https://www.sydney.com/articles/best-bars-in-sydney"], sourceEvidence: { currentStatusUrl: "https://www.muchogroup.com.au/bar-planet", notes: "Official page confirms exact current hours, walk-in-only service, and accessibility. The first-hour offer is time-limited each day, so use the official page for any promotional change. Checked 2026-07-14." },
  }),
  stop("sydney-cocktail-el-primo-sanchez", "El Primo Sanchez", [-33.8843554, 151.2144703], "El Primo Sanchez gives Crown Street an energetic agave bar with tequila, mezcal, bright cocktails, tacos, ceviche, DJs, and the loose rhythm of a Mexican cantina rather than a hushed speakeasy. Eduardo Conde's international competition experience shows in the drinks, but the room is designed for a social night.", {
    category: "Nightlife", subcategory: "agave_cocktail_bar", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["disco", "latin", "dj"], price: "$$", priceSource: "Official current menu and current OpenTable price band, checked 2026-07-14", attributeTags: ["craft_cocktails", "agave", "mezcal", "dj_sets", "food_bar", "lively_nightlife", "reservation_recommended_nightlife"],
    hours: { mon: "Closed", tue: "Closed", wed: "5:30 PM-12:00 AM", thu: "5:30 PM-12:00 AM", fri: "5:30 PM-1:00 AM", sat: "5:30 PM-1:00 AM", sun: "5:30 PM-11:00 PM" }, officialUrl: "https://www.elprimosanchez.com/", bookingUrl: "https://www.elprimosanchez.com/", sourcePhoto: "https://images.squarespace-cdn.com/content/v1/63e1a78e1090e463355b6258/e6e05376-8334-4794-8ff6-c13ffc1aac80/ElPrimoSanchez_December_StevenWoodburn_24.jpg", imageSourceName: "El Primo Sanchez official venue image", mapQuery: "El Primo Sanchez, 410 Crown Street, Surry Hills NSW 2010", editorialUrls: ["https://www.broadsheet.com.au/sydney/bars/el-primo-sanchez", "https://www.opentable.com/r/el-primo-sanchez-paddington"], sourceEvidence: { currentStatusUrl: "https://www.elprimosanchez.com/", notes: "Current official and booking pages place the venue at 410 Crown Street, Surry Hills, with exact hours. Older Paddington address references are stale despite surviving URL slugs. DJs and a lively room can make it loud; reservations help. Checked 2026-07-14." },
  }),
  stop("sydney-cocktail-bar-conte-surry-hills", "Bar Conte Surry Hills", [-33.8850504, 151.2129128], "Bar Conte is a focused love letter to the Negroni, with more than forty evolving variations supported by Italian vermouths, bitters, rare amari, aperitivo snacks, pasta, and an all-day Surry Hills rhythm. It is the choice for comparative drinking rather than a bar that happens to list one Negroni.", {
    category: "Nightlife", subcategory: "negroni_bar", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["lounge", "italian"], price: "$$", priceSource: "Official current menu and current Time Out listing, checked 2026-07-14", attributeTags: ["craft_cocktails", "negroni", "aperitivo", "amaro", "italian", "date_night", "reservation_recommended_nightlife"],
    hours: { mon: "7:30 AM-3:00 PM and 4:00 PM-10:00 PM", tue: "7:30 AM-3:00 PM and 4:00 PM-10:00 PM", wed: "7:30 AM-3:00 PM and 4:00 PM-10:00 PM", thu: "7:30 AM-3:00 PM and 4:00 PM-12:00 AM", fri: "7:30 AM-12:00 AM", sat: "8:00 AM-12:00 AM", sun: "Closed" }, officialUrl: "https://barconte.com.au/", bookingUrl: "https://barconte.com.au/", sourcePhoto: "https://images.squarespace-cdn.com/content/v1/6a18f1f0db4a980a5838d2fc/0d494c53-0715-4580-9fa2-3252afdad164/CONTE_StevenWoodburn_6.webp", imageSourceName: "Bar Conte official venue image", mapQuery: "Bar Conte Surry Hills, 340 Riley Street, Surry Hills NSW 2010", editorialUrls: ["https://www.theurbanlist.com/sydney/directory/bar-conte-surry-hills", "https://www.timeout.com/sydney/bars/the-best-bars-in-sydney-2023"], sourceEvidence: { currentStatusUrl: "https://barconte.com.au/", notes: "The Surry Hills location is used because its official page provides exact hours; the newer Clarence Street listing still says 'late.' Morning and lunch trading are part of the whole venue schedule, while aperitivo is the relevant cocktail window. Checked 2026-07-14." },
  }),
  stop("sydney-cocktail-eau-de-vie", "Eau-de-Vie Sydney", [-33.8654375, 151.2069375], "Eau-de-Vie's current Wynyard Lane incarnation is a fully seated, 1920s-influenced cocktail room with theatrical signatures, more than five hundred whiskies, bottle lockers, and attentive table service. It rewards a booking and a focused ninety-minute visit more than an improvised large-group drop-in.", {
    category: "Nightlife", subcategory: "whisky_cocktail_bar", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["jazz", "lounge"], price: "$$$", priceSource: "Official current cocktail and whisky menus, checked 2026-07-14", attributeTags: ["craft_cocktails", "whisky", "speakeasy", "fully_seated", "premium_drinks", "reservation_recommended_nightlife", "accessible"],
    hours: { mon: "Closed", tue: "5:00 PM-12:00 AM", wed: "5:00 PM-12:00 AM", thu: "4:30 PM-12:00 AM", fri: "4:30 PM-2:00 AM", sat: "4:30 PM-2:00 AM", sun: "Closed" }, officialUrl: "https://eaudevie.com.au/sydney", bookingUrl: "https://eaudevie.com.au/sydney", sourcePhoto: "https://eaudevie.com.au/wp-content/uploads/elementor/thumbs/3-Home-Page-Welcome-Section-Left-rffdv05bxw9ehfjhzf51xd5xfl23hmbbpe4ugy6ney.jpg", imageSourceName: "Eau-de-Vie Sydney official venue image", mapQuery: "Eau-de-Vie Sydney, Wynyard Lane, 285 George Street, Sydney NSW 2000", editorialUrls: ["https://www.broadsheet.com.au/sydney/bars/eau-de-vie", "https://www.theurbanlist.com/sydney/directory/eau-de-vie"], sourceEvidence: { currentStatusUrl: "https://eaudevie.com.au/sydney", notes: "The original Darlinghurst venue closed in 2020; this entry is the active Wynyard Lane venue, confirmed by its current official page and reservations. All patrons must be 18+, bookings run for 90 minutes, smart-casual guidance applies, and late cancellation is A$25 per person. Checked 2026-07-14." },
  }),
  stop("sydney-cocktail-apollonia", "Apollonia", [-33.8625153, 151.2109476], "Apollonia uses Hinchcliff House's sandstone basement for a romantic Sicilian drinking den: negronis, Italian spirits, strong house cocktails, candlelight, marble, and a little Godfather-inspired ritual. It feels transporting without requiring a secret knock, and both walk-ins and late-night bookings are welcomed.", {
    category: "Nightlife", subcategory: "sicilian_cocktail_bar", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["italian", "lounge"], price: "$$", priceSource: "Official Aperitivo Hour: A$14-A$18 cocktails, A$9 beer, and A$9-A$14 wine, checked 2026-07-14", attributeTags: ["craft_cocktails", "negroni", "italian", "basement", "romantic_nightlife", "date_night", "walk_in_friendly_nightlife"],
    hours: { mon: "4:00 PM-12:00 AM", tue: "4:00 PM-12:00 AM", wed: "4:00 PM-12:00 AM", thu: "4:00 PM-1:00 AM", fri: "4:00 PM-1:00 AM", sat: "4:00 PM-1:00 AM", sun: "4:00 PM-10:00 PM" }, officialUrl: "https://apollonia.sydney/", bookingUrl: "https://apollonia.sydney/", sourcePhoto: "https://media.timeout.com/images/105826144/750/422/image.jpg", imageSourceName: "Time Out interior image of Apollonia", mapQuery: "Apollonia, Basement Hinchcliff House, 5-7 Young Street, Sydney NSW 2000", editorialUrls: ["https://www.timeout.com/sydney/bars/apollonia", "https://www.theurbanlist.com/sydney/directory/apollonia"], sourceUrls: ["https://apollonia.sydney/happy-hour/"], sourceEvidence: { currentStatusUrl: "https://apollonia.sydney/", notes: "Official site confirms current exact hours, Loftus Lane entry, and walk-in or booking options. The official happy-hour page discloses a removable 3% gratuity, group, Sunday, and public-holiday surcharges. Checked 2026-07-14." },
  }),
  stop("sydney-cocktail-the-lobo", "The Lobo", [-33.8699845, 151.2050757], "The Lobo descends below Clarence Street into a Cuban- and Caribbean-inflected cellar with a collection of more than 250 rums, including rare bottles reaching back decades. Rum flights and spirit-forward house cocktails make it a useful specialist destination, while the energetic room keeps it from becoming a tasting library.", {
    category: "Nightlife", subcategory: "rum_bar", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["latin", "cuban", "funk"], price: "$$", priceSource: "Official current menu and Time Out A$10-A$50 price band, checked 2026-07-14", attributeTags: ["craft_cocktails", "rum", "rum_flights", "basement", "late_night", "lively_nightlife", "reservation_recommended_nightlife"],
    hours: { mon: "5:00 PM-2:00 AM", tue: "5:00 PM-2:00 AM", wed: "5:00 PM-2:00 AM", thu: "4:00 PM-2:00 AM", fri: "4:00 PM-2:00 AM", sat: "5:00 PM-2:00 AM", sun: "5:00 PM-2:00 AM" }, officialUrl: "https://www.thelobo.com.au/", bookingUrl: "https://www.thelobo.com.au/", sourcePhoto: "https://images.squarespace-cdn.com/content/v1/64804a989f9a3533c219ad91/f2fd5fd4-37cf-4b8f-862d-ad6cd7cae54b/The%2BLobo%2BPlantation%2BInterior%2B1.jpg", imageSourceName: "The Lobo official venue image", mapQuery: "The Lobo, Basement Lot 1, 209 Clarence Street, Sydney NSW 2000", editorialUrls: ["https://www.timeout.com/sydney/bars/the-lobo", "https://www.broadsheet.com.au/sydney/guides/best-cocktails"], sourceEvidence: { currentStatusUrl: "https://www.thelobo.com.au/", notes: "Official site confirms exact current seven-day hours and reservations. The basement is 18+; larger functions use minimum spends and service charges, while ordinary reservations suit small groups. Checked 2026-07-14." },
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
    url: maps(`${title} Sydney Australia`),
    category,
    location: sydneyLocation,
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

export const sydneyCitywideGuides: MapList[] = [
  guide(
    "Food",
    "list-sydney-citywide-dining",
    "sydney-best-restaurants-citywide",
    "best-restaurants",
    "Restaurants Worth Planning Around",
    "Sydney's strongest dining rooms express the city through Australian produce, fish, fire, immigrant food traditions, neighborhood hospitality, and landmark architecture. This list favors ten distinct reasons to reserve rather than ten versions of prestige.",
    diningStops,
    sources.dining,
    "Best Restaurants in Sydney for Seafood, Fire, and Modern Australian Dining",
    "A source-backed guide to ten Sydney restaurants, from Saint Peter, Sixpenny, Ester, and Firedoor to Bennelong, Margaret, Hubert, Cafe Paci, AALIA, and Fratelli Paradiso.",
  ),
  guide(
    "Food",
    "list-sydney-medium-cheap-eats",
    "sydney-best-cheap-eats-medium-budget",
    "best-cheap-eats",
    "Cheap Eats from Haymarket to Harris Park",
    "Affordable Sydney eating is geographically broad: Malaysian roti and ramen in Haymarket, Thai rice bowls in the CBD, Lebanese breakfast in Punchbowl, Vietnamese noodles in Cabramatta, Indian dosas in Harris Park, and neighborhood grills farther out.",
    cheapEatStops,
    sources.cheapEats,
    "Best Cheap Eats in Sydney for Roti, Ramen, Thai Food, Burgers, and More",
    "Ten source-backed cheap and medium-price Sydney meals, including Mamak, Gumshara, Rice Face, Yok Yor, Paul's Famous Hamburgers, Al Yasmin, Tan Viet, Dosa Hut, Olympic Meats, and Cairo Takeaway.",
  ),
  guide(
    "Stay",
    "list-sydney-citywide-hotels",
    "sydney-best-hotels-citywide",
    "best-hotels",
    "Hotels for Harbour Views, Beach Days & Inner-City Design",
    "Sydney hotels make travelers choose among landmark harbor views, beach access, design-heavy inner-city precincts, quiet traditional service, and social rooftops. Room category and base matter as much as the property name.",
    hotelStops,
    sources.hotels,
    "Best Hotels in Sydney for Harbor Views, Beaches, and Design",
    "Hotel-only Sydney guide covering Capella, Park Hyatt, Manly Pacific, The EVE, Pier One, The Old Clare, 25hours Olympia, Ace, The Langham, and Paramount House.",
  ),
  guide(
    "Stay",
    "list-sydney-citywide-hostels",
    "sydney-best-hostels-citywide",
    "best-hostels",
    "Hostels for Social Trips, Beach Days & Quiet Harbour Beds",
    "This hostel-only guide separates party bases from beach communities, pod beds, quiet harbor rooms, and working-holiday networks. Reception hours, age rules, transport, and noise are treated as practical booking criteria.",
    hostelStops,
    sources.hostels,
    "Best Hostels in Sydney for Social Stays, Beaches, and Budget Beds",
    "Hostel-only Sydney guide covering Wake Up Central and Bondi, YHA Sydney Harbour, Pacific House, Mad Monkey Coogee and Bayswater, Tequila Sunrise, Nate's Place, Nomads, and Stoke Beach House.",
  ),
  guide(
    "Nightlife",
    "list-sydney-casual-pubs-bars",
    "sydney-best-casual-pubs-and-bars",
    "best-dive-bars",
    "Pubs, Dive Bars & Casual Late Rooms",
    "Sydney's low-key nightlife lives in Newtown locals, Redfern courtyards, Enmore music pubs, Surry Hills agave rooms, Chippendale art walls, and old Woolloomooloo corners. These places reward atmosphere and regulars over cocktail ceremony.",
    pubStops,
    sources.pubs,
    "Best Dive Bars in Sydney",
    "Ten source-backed Sydney dive bars and casual pubs, including Mary's, Arcadia Liquors, Tio's, Earl's Juke Joint, Jacoby's, The Duke, The Courty, The Gladdy, The Townie, and The Old Fitz.",
  ),
  guide(
    "Nightlife",
    "list-sydney-cocktail-bars",
    "sydney-best-cocktail-bars",
    "best-cocktail-bars",
    "Cocktail Bars from Hotel Glamour to Agave Counters",
    "Sydney's serious cocktail rooms span hotel glamour, basement precision, agave specialization, Italian aperitivo, Japanese technique, and playful hospitality. Each selection earns its place through a distinct drinks identity and current operating evidence.",
    cocktailStops,
    sources.cocktails,
    "Best Cocktail Bars in Sydney for Precise Drinks and Distinctive Rooms",
    "Ten current, source-backed Sydney cocktail bars selected for technique, identity, atmosphere, and practical booking information.",
  ),
  guide(
    "Culture",
    "list-sydney-citywide-culture",
    "sydney-best-culture-museums-landmarks-citywide",
    "best-culture",
    "Museums, First Nations Art & the Opera House",
    "Sydney culture extends beyond the Opera House into First Nations art, natural and maritime history, university collections, Chinese contemporary work, convict history, public archives, and railway workshops reused for performance.",
    cultureStops,
    sources.culture,
    "Best Culture in Sydney for Museums, Galleries, Architecture, and History",
    "Ten source-backed Sydney cultural stops with current hours, including the Opera House, Art Gallery of NSW, Australian Museum, MCA, Maritime Museum, White Rabbit, and more.",
  ),
  guide(
    "Activities",
    "list-sydney-top-things-to-do",
    "sydney-top-things-to-do",
    "best-things-to-do",
    "Harbour Crossings, Coastal Walks & City Icons",
    "A first Sydney trip works best by moving across the harbor, coast, gardens, wildlife, industrial islands, ocean pools, bridge engineering, and landmark architecture. Ferries, tides, weather, and seasonal gates are built into the planning notes.",
    activityStops,
    sources.activities,
    "Top Things to Do in Sydney for Harbor, Coast, Wildlife, and Architecture",
    "Ten source-backed Sydney experiences, from an Opera House tour and BridgeClimb to Taronga, the Manly ferry, Bondi-Coogee walk, Cockatoo Island, Icebergs, and BridgeMuseum.",
  ),
];
