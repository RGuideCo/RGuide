import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

const createdAt = "2026-08-12T00:00:00.000Z";
const checkedAt = "2026-08-12";

const aucklandLocation = {
  city: "Auckland",
  country: "New Zealand",
  continent: "Oceania",
  scope: "city" as const,
};

const colors: Record<ListCategory, string> = {
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

function commons(fileName: string) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=1600`;
}

type StopOptions = Partial<GuideStop> & {
  officialUrl: string;
  sourcePhoto: string;
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
    officialUrl,
    sourcePhoto,
    editorialUrls = [],
    mapQuery,
    bookingUrl,
    sourceEvidence,
    sourceUrls: extraSourceUrls = [],
    priceSource,
    ...rest
  } = options;
  const mapUrl = sourceEvidence?.mapUrl ?? maps(mapQuery ?? `${name} Auckland New Zealand`);
  const sourceUrls = [officialUrl, bookingUrl, mapUrl, sourcePhoto, ...editorialUrls, ...extraSourceUrls].filter(Boolean) as string[];

  return {
    id,
    name,
    coordinates,
    description,
    photo: sourcePhoto,
    imageSourceUrl: sourcePhoto,
    imageSourceName: "Official, editorial, or licensed venue image",
    sourceUrls: [...new Set(sourceUrls)],
    sourceEvidence: {
      officialUrl,
      mapUrl,
      currentStatusUrl: sourceEvidence?.currentStatusUrl ?? officialUrl,
      imageSourceUrl: sourcePhoto,
      editorialUrls,
      checkedAt,
      notes: "Official hours, current operation, map location, and venue-specific media checked on 2026-08-12.",
      ...sourceEvidence,
    },
    officialUrl,
    ...(bookingUrl ? { bookingUrl } : {}),
    ...(rest.price ? { priceSource: priceSource ?? `Official or current property page, checked ${checkedAt}.` } : {}),
    ...rest,
  };
}

const editorial = {
  dining: "https://www.timeout.com/auckland/restaurants/best-restaurants-in-auckland",
  cheap: "https://www.aucklandnz.com/inspire/22-must-try-cheap-eats-in-auckland",
  hotels: "https://www.aucklandnz.com/inspire/the-ultimate-guide-where-to-stay-in-auckland",
  hostels: "https://www.hostelworld.com/hostels/oceania/new-zealand/auckland/",
  pubs: "https://www.aucklandnz.com/explore/eat-drink/bars-nightlife",
  cocktails: "https://heartofthecity.co.nz/article/best-cocktail-bars-city-centre",
  culture: "https://www.aucklandnz.com/explore/arts-culture-heritage",
  activities: "https://www.timeout.com/auckland/things-to-do/best-things-to-do-in-auckland",
};

const diningStops: GuideStop[] = [
  stop("auckland-dining-ahi", "Ahi", [-36.8446, 174.7669], "Ben Bayly's open-kitchen dining room uses New Zealand seafood, game, native ingredients, fire, and produce from its Ahi Organic Gardens.", {
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["New Zealand", "Contemporary", "Fire cooking"], attributeTags: ["destination_dining", "local_produce", "tasting_menu", "reservation_recommended"], price: "$$$$", hours: { default: "Daily lunch 12:00 PM-2:30 PM and dinner 5:00 PM-late." }, officialUrl: "https://ahirestaurant.co.nz/", bookingUrl: "https://ahirestaurant.co.nz/book/", sourcePhoto: "https://ahirestaurant.co.nz/wp-content/uploads/2026/04/square-doorway.jpg", editorialUrls: [editorial.dining],
  }),
  stop("auckland-dining-cazador", "Cazador", [-36.8939173, 174.7453918], "This family-run Dominion Road institution has specialized in responsibly sourced game, house charcuterie, offal, and whole-animal cooking since 1987.", {
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["New Zealand", "Game", "Charcuterie"], attributeTags: ["local_favorite", "sustainable_sourcing", "meat_focused", "reservation_recommended"], price: "$$$", hours: { mon: "Closed", tue: "Closed", wed: "5:00 PM-late", thu: "5:00 PM-late", fri: "5:00 PM-late", sat: "5:00 PM-late", sun: "Closed" }, officialUrl: "https://www.cazador.co.nz/restaurant", bookingUrl: "https://www.cazador.co.nz/book", sourcePhoto: "https://www.cazador.co.nz/content/metadata/03_cazador_042cp.jpg", editorialUrls: [editorial.dining],
  }),
  stop("auckland-dining-cocoro", "Cocoro", [-36.8541, 174.7448], "Cocoro applies Japanese technique to New Zealand fish and produce through sashimi, composed plates, sake pairings, and a tightly paced degustation.", {
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["Japanese", "Sushi", "Degustation"], attributeTags: ["tasting_menu", "seafood", "date_night", "reservation_recommended"], price: "$$$$", hours: { mon: "Closed", tue: "5:30 PM-late", wed: "5:30 PM-late", thu: "5:30 PM-late", fri: "12:00 PM-2:00 PM and 5:30 PM-late", sat: "12:00 PM-2:00 PM and 5:30 PM-late", sun: "Closed" }, officialUrl: "https://www.cocoro.co.nz/", bookingUrl: "https://www.cocoro.co.nz/reservations", sourcePhoto: "https://static1.squarespace.com/static/623494552adc0608880941b0/t/63759cbf4375555b9786703f/1668652223444/nigiri-sushi-platter-on-oriental-dish-with-wasabi-and-ginger-cocoro-japanese-restaurant-auckland.jpg?format=1500w", editorialUrls: [editorial.dining],
  }),
  stop("auckland-dining-mr-morris", "Mr Morris", [-36.8447494, 174.7682977], "Michael Meredith's Britomart room brings Pacific ingredients, ethical sourcing, a charcoal grill, and relaxed service to polished contemporary cooking.", {
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["Pacific", "New Zealand", "Contemporary"], attributeTags: ["destination_dining", "fire_cooking", "design", "reservation_recommended"], price: "$$$$", hours: { mon: "Closed", tue: "5:30 PM-late", wed: "5:30 PM-late", thu: "12:00 PM-2:30 PM and 5:30 PM-late", fri: "12:00 PM-2:30 PM and 5:30 PM-late", sat: "5:30 PM-late", sun: "Closed" }, officialUrl: "https://www.mrmorris.nz/", bookingUrl: "https://www.mrmorris.nz/reservations", sourcePhoto: "https://cdn.broadsheet.com.au/cache/bf/1e/bf1ee7bbdc5c5a3c2d07d6b5482f6ce0.jpg", editorialUrls: [editorial.dining, "https://www.broadsheet.com.au/new-zealand/auckland/restaurants/mr-morris"],
  }),
  stop("auckland-dining-paris-butter", "Paris Butter", [-36.8454371, 174.7370349], "Paris Butter's tasting menu folds French technique into New Zealand produce, with playful courses, detailed sauces, and unusually attentive dietary adaptation.", {
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["French", "New Zealand", "Tasting menu"], attributeTags: ["fine_dining", "tasting_menu", "romantic_food", "reservation_required"], price: "$$$$", hours: { mon: "Closed", tue: "6:00 PM-late", wed: "6:00 PM-late", thu: "6:00 PM-late", fri: "6:00 PM-late", sat: "5:30 PM-late", sun: "Closed" }, officialUrl: "https://parisbutter.co.nz/contact-us", bookingUrl: "https://parisbutter.co.nz/reservations", sourcePhoto: "https://images.squarespace-cdn.com/content/v1/5893eec61e5b6c451d917eab/1721880503558-JZIDSTYGLO5SPAJ7POLI/240624BMPARISBUTTER06+%281%29.jpg", editorialUrls: [editorial.dining],
  }),
  stop("auckland-dining-amano", "Amano", [-36.844336, 174.770383], "Amano combines an in-house bakery, handmade pasta, seasonal Italian cooking, and a large all-day room inside Britomart's converted warehouses.", {
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["Italian", "Bakery", "Seasonal"], attributeTags: ["breakfast", "bakery", "handmade_pasta", "groups", "central"], price: "$$$", hours: { default: "Daily 7:00 AM-10:00 PM." }, officialUrl: "https://savor.co.nz/amano", bookingUrl: "https://savor.co.nz/amano/reservations", sourcePhoto: "https://savorassets.imgix.net/AMANO04-1.jpg?auto=compress%2Cformat&fit=clip&q=60&w=2000", editorialUrls: [editorial.dining],
  }),
  stop("auckland-dining-metita", "Metita", [-36.8491146, 174.7623581], "Chef Michael Meredith's Metita treats Pacific foodways as living cuisine, pairing familiar island ingredients with fine-dining technique inside SkyCity.", {
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["Pacific", "Samoan", "Contemporary"], attributeTags: ["destination_dining", "pacific_cuisine", "date_night", "reservation_recommended"], price: "$$$$", hours: { mon: "Closed", tue: "5:00 PM-9:00 PM; bar 3:00 PM-late", wed: "5:00 PM-9:00 PM; bar 3:00 PM-late", thu: "5:00 PM-9:00 PM; bar 3:00 PM-late", fri: "5:00 PM-9:00 PM; bar 3:00 PM-late", sat: "5:00 PM-9:00 PM; bar 3:00 PM-late", sun: "Closed" }, officialUrl: "https://skycityauckland.co.nz/restaurants/metita/", bookingUrl: "https://skycityauckland.co.nz/restaurants/metita/book-now/", sourcePhoto: "https://skycityauckland.co.nz/media/2294512/240403-fb_metitaapr_digital_whatson_2560x1280px_2.jpg?anchor=center&mode=crop&width=1200&height=800&format=jpg&quality=85", editorialUrls: [editorial.dining],
  }),
  stop("auckland-dining-onslow", "Onslow", [-36.8476796, 174.7699221], "Josh Emett's light-filled dining room balances polished comfort food, New Zealand ingredients, and a useful terrace beside Albert Park.", {
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["New Zealand", "Contemporary", "European"], attributeTags: ["date_night", "terrace", "business_lunch", "reservation_recommended"], price: "$$$$", hours: { mon: "5:00 PM-late", tue: "5:00 PM-late", wed: "12:00 PM-late", thu: "12:00 PM-late", fri: "12:00 PM-late", sat: "12:00 PM-late", sun: "12:00 PM-5:00 PM" }, officialUrl: "https://www.onslow.nz/location/onslow/", bookingUrl: "https://www.onslow.nz/reservations/", sourcePhoto: "https://images.getbento.com/accounts/7995f04fec5233d3e57f7aca47762bc5/media/images/78089Onslow_BW.png?w=1200&fit=fill&auto=compress,format&cs=origin&h=600&bg=EDEDF1&pad=100", editorialUrls: [editorial.dining],
  }),
  stop("auckland-dining-ada", "Ada", [-36.8672558, 174.7402067], "Ada occupies The Convent's brick-and-plaster dining room, serving Italian-leaning shared plates, handmade pasta, and a generous set-menu format.", {
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["Italian", "New Zealand", "Shared plates"], attributeTags: ["handmade_pasta", "groups", "heritage", "reservation_recommended"], price: "$$$", hours: { mon: "Closed", tue: "5:00 PM-late", wed: "5:00 PM-late", thu: "12:00 PM-3:00 PM and 5:00 PM-late", fri: "12:00 PM-3:00 PM and 5:00 PM-late", sat: "5:00 PM-late", sun: "12:00 PM-4:00 PM" }, officialUrl: "https://www.adarestaurant.co.nz/", bookingUrl: "https://www.adarestaurant.co.nz/book", sourcePhoto: "https://images.squarespace-cdn.com/content/v1/5f9a071bb075ed2a2a795a34/a733723d-e6bf-4c10-8d2d-7bf90528ed94/8A800D3C-025A-487D-BD16-9FF17D6C83B0.jpeg?format=1500w", editorialUrls: [editorial.dining],
  }),
  stop("auckland-dining-depot", "Depot Eatery", [-36.8490506, 174.7624171], "Al Brown's walk-in eatery puts wood-fired cooking, raw-bar oysters, snapper sliders, and unfussy New Zealand produce beside the Sky Tower.", {
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["New Zealand", "Seafood", "Wood-fired"], attributeTags: ["walk_in_friendly", "seafood", "lively_food", "central"], price: "$$$", hours: { mon: "7:00 AM-9:00 PM", tue: "7:00 AM-9:00 PM", wed: "7:00 AM-9:00 PM", thu: "7:00 AM-9:00 PM", fri: "7:00 AM-9:00 PM", sat: "11:00 AM-9:30 PM", sun: "11:00 AM-9:00 PM" }, officialUrl: "https://depoteatery.co.nz/", sourcePhoto: "https://welltraveledclub.sfo3.digitaloceanspaces.com/wt/media/1118/conversions/depot-eatery-auckland-5-feat-img.webp", editorialUrls: [editorial.dining],
  }),
];

const cheapEatStops: GuideStop[] = [
  stop("auckland-cheap-eden-noodles", "Eden Noodles Cafe", [-36.8719432, 174.7521571], "Eden Noodles builds its reputation on Sichuan wontons and dumplings slicked with chile oil, plus noodles calibrated across several heat levels.", {
    venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["Sichuan", "Chinese", "Noodles"], attributeTags: ["budget_food", "spicy_food", "dumplings", "quick_bite"], price: "$", hours: { default: "Daily 10:30 AM-9:30 PM." }, officialUrl: "https://www.metromag.co.nz/listings/eden-noodles", sourcePhoto: "https://www.metromag.co.nz/wp/wp-content/uploads/2022/04/eden_RETINA-IMAGE-1440x600.jpg", editorialUrls: [editorial.cheap],
  }),
  stop("auckland-cheap-xian", "Xi'an Food Bar Dominion Road", [-36.8887623, 174.747032], "Xi'an Food Bar stretches and tears noodles to order, then pairs them with cumin lamb, chile, pork, and chewy roujiamo flatbreads.", {
    venueKind: "food_drink", foodServiceType: "fast_casual", cuisineTypes: ["Xi'an", "Chinese", "Hand-pulled noodles"], attributeTags: ["budget_food", "noodles", "quick_bite", "takeaway"], price: "$", hours: { default: "Daily 11:30 AM-9:30 PM; last online order 9:00 PM." }, officialUrl: "https://xianfoods.co.nz/dominion/contact-us/", sourcePhoto: "https://xianfoods.co.nz/wp-content/uploads/sites/6/2020/07/shop_front.jpeg", editorialUrls: [editorial.cheap],
  }),
  stop("auckland-cheap-japanese-you", "Japanese Dining You", [-36.8501117, 174.7636555], "This tiny city counter keeps lunch practical with Japanese curry, donburi, udon, and combination plates priced for regular office trade.", {
    venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["Japanese", "Curry", "Donburi"], attributeTags: ["budget_food", "lunch", "quick_bite", "central"], price: "$", hours: { mon: "11:00 AM-7:00 PM", tue: "11:00 AM-7:00 PM", wed: "11:00 AM-7:00 PM", thu: "11:00 AM-7:00 PM", fri: "11:00 AM-7:00 PM", sat: "11:30 AM-5:00 PM", sun: "Closed" }, officialUrl: "https://www.hotcity.co.nz/business-directory/japanese-dining-you", sourcePhoto: "https://img.restaurantguru.com/w550/h367/r844-interior-Japanese-Dining-You.jpg", editorialUrls: [editorial.cheap, "https://restaurantguru.com/Japanese-Dining-You-Auckland"],
  }),
  stop("auckland-cheap-mamak", "Mamak Malaysian Restaurant", [-36.8482981, 174.7677609], "Mamak channels Kuala Lumpur street-food staples through roti canai, nasi lemak, laksa, and satay in Chancery Square's sheltered courtyard.", {
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["Malaysian", "Street food", "Roti"], attributeTags: ["budget_food", "street_food", "outdoor_seating", "groups"], price: "$$", hours: { mon: "Closed", tue: "11:30 AM-3:00 PM and 5:00 PM-9:30 PM", wed: "11:30 AM-3:00 PM and 5:00 PM-9:30 PM", thu: "11:30 AM-3:00 PM and 5:00 PM-9:30 PM", fri: "11:30 AM-3:00 PM and 5:00 PM-9:30 PM", sat: "11:30 AM-3:00 PM and 5:00 PM-9:30 PM", sun: "11:30 AM-3:00 PM and 5:00 PM-9:30 PM" }, officialUrl: "https://chancerysq.co.nz/tenants/", sourcePhoto: "https://static.where-e.com/New_Zealand/Auckland_Region/Parnell/Mamak-Malaysian-Restaurant_55b3ffa0e842b20e612a808c5fe2a142.jpg", editorialUrls: [editorial.cheap, "https://heartofthecity.co.nz/dining/dinner-auckland/mamak-malaysian-restaurant"],
  }),
  stop("auckland-cheap-peachs", "Peach's Hot Chicken", [-36.8988256, 174.8517484], "Peach's fries Nashville-style chicken to several heat levels, balancing the burn with pickles, white bread, waffles, and proper Southern sides.", {
    venueKind: "food_drink", foodServiceType: "fast_casual", cuisineTypes: ["American", "Nashville hot chicken"], attributeTags: ["budget_food", "fried_chicken", "spicy_food", "groups"], price: "$$", hours: { mon: "Closed", tue: "Closed", wed: "11:30 AM-9:00 PM", thu: "11:30 AM-9:00 PM", fri: "11:30 AM-10:00 PM", sat: "11:00 AM-10:00 PM", sun: "11:00 AM-9:00 PM" }, officialUrl: "https://www.peachshotchicken.com/", sourcePhoto: "https://static1.squarespace.com/static/5acddf5b3917ee2eaf493b2a/t/5acde03c03ce64a75c5e2e4d/1523441729051/Peach%27s+Hot+Chicken+1.png?format=1500w", editorialUrls: [editorial.cheap],
  }),
  stop("auckland-cheap-carmel", "Carmel Israeli Street Food", [-36.8619506, 174.7576047], "Carmel's short Thursday-to-Saturday service revolves around crisp falafel, sabich, pita, bright pickles, and market-style baking from a family-run counter.", {
    venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["Israeli", "Middle Eastern", "Street food"], attributeTags: ["budget_food", "vegetarian_friendly", "falafel", "lunch"], price: "$$", hours: { mon: "Closed", tue: "Closed", wed: "Closed", thu: "9:00 AM-2:30 PM", fri: "9:00 AM-2:30 PM", sat: "9:00 AM-2:30 PM", sun: "Closed" }, officialUrl: "https://bycarmel.co.nz/", sourcePhoto: "https://foodguide.nz/og/auckland/carmel-israeli-street-food.png", editorialUrls: [editorial.cheap, "https://foodguide.nz/auckland/carmel-israeli-street-food/"],
  }),
  stop("auckland-cheap-ramen-takara", "Ramen Takara Ponsonby", [-36.8503252, 174.7441906], "Ramen Takara makes approachable bowls with house broth and noodles, backed by gyoza, karaage, and reliable vegetarian and vegan choices.", {
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["Japanese", "Ramen"], attributeTags: ["budget_food", "ramen", "vegan_friendly", "family_friendly_food"], price: "$$", hours: { mon: "Closed", tue: "12:00 PM-2:30 PM and 5:00 PM-9:30 PM", wed: "12:00 PM-2:30 PM and 5:00 PM-9:30 PM", thu: "12:00 PM-2:30 PM and 5:00 PM-9:30 PM", fri: "12:00 PM-2:30 PM and 5:00 PM-9:30 PM", sat: "12:00 PM-2:30 PM and 5:00 PM-9:30 PM", sun: "12:00 PM-2:30 PM and 5:00 PM-9:30 PM" }, officialUrl: "https://www.ramentakara.co.nz/ponsonby.html", sourcePhoto: "https://img.restaurantguru.com/w550/h367/r439-Ramen-Takara-Ponsonby-interior.jpg", editorialUrls: [editorial.cheap],
  }),
  stop("auckland-cheap-no1-pancake", "No.1 Pancake Takapuna", [-36.7880907, 174.7733247], "No.1 Pancake fills griddled Korean hotteok with cinnamon, red bean, cheese, or savory combinations for an inexpensive beach-side snack.", {
    venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["Korean", "Hotteok", "Street food"], attributeTags: ["budget_food", "street_food", "quick_bite", "takeaway"], price: "$", hours: { mon: "Closed except public-holiday Mondays", tue: "Closed", wed: "10:30 AM-5:00 PM", thu: "10:30 AM-5:00 PM", fri: "10:30 AM-5:00 PM", sat: "10:00 AM-5:00 PM", sun: "10:00 AM-5:00 PM; service can end when batter sells out" }, officialUrl: "https://no1pancake.co.nz/takapuna/location/", sourcePhoto: "https://no1pancake.co.nz/takapuna/wp-content/uploads/2021/08/no1pancake-r.png.webp", editorialUrls: [editorial.cheap],
  }),
  stop("auckland-cheap-panda-noodle", "Panda Noodle Express", [-36.8846593, 174.7480445], "Panda Noodle Express is a no-frills Dominion Road room for Sichuan noodles, dumplings, cold dishes, and chile-heavy plates served quickly.", {
    venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["Sichuan", "Chinese", "Noodles"], attributeTags: ["budget_food", "spicy_food", "noodles", "local_favorite"], price: "$", hours: { mon: "Closed", tue: "11:30 AM-9:00 PM", wed: "11:30 AM-9:00 PM", thu: "11:30 AM-9:00 PM", fri: "11:30 AM-9:00 PM", sat: "11:30 AM-9:00 PM", sun: "11:30 AM-9:00 PM" }, officialUrl: "https://www.dominionrd.co.nz/panda-noodle-express", sourcePhoto: "https://www.dominionrd.co.nz/media/com_jbusinessdirectory/pictures/companies/50/83c2446a0896df0a1f4af01c940ae1d9_Generic-1702471848.jpg", editorialUrls: [editorial.cheap],
  }),
  stop("auckland-cheap-ralphs", "Ralph's Bar & Eatery", [-36.8757359, 174.7508611], "Ralph's serves oversized burgers, curly fries, fried pickles, and cold beer in a compact Mount Eden courtyard with neighborhood energy.", {
    venueKind: "food_drink", foodServiceType: "fast_casual", cuisineTypes: ["Burgers", "New Zealand", "Bar food"], attributeTags: ["budget_food", "burgers", "casual", "outdoor_seating"], price: "$$", hours: { mon: "Closed", tue: "5:00 PM-9:00 PM", wed: "5:00 PM-9:00 PM", thu: "12:00 PM-9:00 PM", fri: "12:00 PM-9:00 PM", sat: "5:00 PM-9:00 PM", sun: "Closed" }, officialUrl: "https://www.bestrestaurants.nz/north-island/auckland/mount-eden/restaurant/ralphs-bar-and-eatery", sourcePhoto: "https://www.bestrestaurants.nz/media/jbzhrhlz/pxl_20230609_061545456.jpg?rxy=0.47293320055086374,0.4494712085732919&width=1200&height=630&mode=crop", editorialUrls: [editorial.cheap],
  }),
];

const hotelStops: GuideStop[] = [
  stop("auckland-hotel-britomart", "The Hotel Britomart", [-36.8448619, 174.7687646], "Locally made furniture, timber-lined rooms, New Zealand art, and Britomart's pedestrian lanes give this sustainability-led hotel a strong sense of place.", {
    category: "Stay", subcategory: "hotel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "design", "central", "sustainable", "boutique"], price: "$$$$", hours: { default: "Front desk open 24 hours daily; check-in 3:00 PM-12:00 AM and check-out by 11:00 AM." }, officialUrl: "https://thehotelbritomart.com/", bookingUrl: "https://www.booking.com/hotel/nz/the-britomart.en-gb.html", sourcePhoto: "https://thehotelbritomart.com/wp-content/uploads/2023/06/R5_AD9988_89_90.jpg", editorialUrls: [editorial.hotels],
  }),
  stop("auckland-hotel-park-hyatt", "Park Hyatt Auckland", [-36.8419061, 174.7584849], "Park Hyatt fronts Wynyard Quarter with large rooms, Māori-informed interiors, a 25-metre infinity pool, spa facilities, and Waitematā Harbour outlooks.", {
    category: "Stay", subcategory: "hotel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "waterfront", "spa", "pool", "design"], price: "$$$$", hours: { default: "Front desk open 24 hours daily; check-in from 3:00 PM and check-out by 11:00 AM." }, officialUrl: "https://www.hyatt.com/park-hyatt/en-US/aklph-park-hyatt-auckland", bookingUrl: "https://www.booking.com/hotel/nz/park-hyatt-auckland.html", sourcePhoto: "https://images.squarespace-cdn.com/content/v1/5cd8d5f30490794888558614/1639008945262-XJFC1T1J8V8VM6KZY8YF/Exterior-Corner.jpg", editorialUrls: [editorial.hotels],
  }),
  stop("auckland-hotel-qt", "QT Auckland", [-36.8453887, 174.7596744], "QT mixes theatrical contemporary interiors, New Zealand art, Esther's Mediterranean dining, and a lively rooftop within easy walking distance of the Viaduct.", {
    category: "Stay", subcategory: "hotel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "design", "rooftop", "nightlife", "central"], price: "$$$$", hours: { default: "Front desk open 24 hours daily; check-in from 3:00 PM and check-out by 11:00 AM." }, officialUrl: "https://www.qthotels.com/auckland/", bookingUrl: "https://www.booking.com/hotel/nz/qt-auckland.html", sourcePhoto: "https://media.timeout.com/images/105710853/750/422/image.jpg", editorialUrls: [editorial.hotels],
  }),
  stop("auckland-hotel-debrett", "Hotel DeBrett", [-36.8467769, 174.7670123], "Twenty-five individually styled rooms, boldly striped carpets, a glass-roofed atrium, and the intimate Housebar make DeBrett Auckland's characterful Art Deco stay.", {
    category: "Stay", subcategory: "hotel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["boutique", "heritage", "design", "central", "romantic"], price: "$$$$", hours: { default: "Front desk open 24 hours daily; check-in from 3:00 PM and check-out by 11:00 AM." }, officialUrl: "https://hoteldebrett.com/", bookingUrl: "https://www.booking.com/hotel/nz/debrett.html", sourcePhoto: "https://www.aucklandnz.com/media/media/tau/tau_media/venues/superior-room-1-low-res.jpg?ext=.jpg&height=800&width=1400", editorialUrls: [editorial.hotels, "https://www.aucklandnz.com/explore/hotel-debrett"],
  }),
  stop("auckland-hotel-so", "SO/ Auckland", [-36.8458, 174.7694], "SO/ brings fashion-led rooms, a basement pool and spa, Harbour Society dining, and Hi-SO rooftop views to the Britomart edge.", {
    category: "Stay", subcategory: "hotel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "design", "spa", "indoor_pool", "rooftop"], price: "$$$$", hours: { default: "Front desk open 24 hours daily; check-in from 3:00 PM and check-out by 11:00 AM." }, officialUrl: "https://so-hotels.com/en/auckland/", bookingUrl: "https://www.booking.com/hotel/nz/so-auckland.html", sourcePhoto: "https://so-hotels.com/wp-content/uploads/sites/19/2023/03/auckland-hero-3.jpg", editorialUrls: [editorial.hotels],
  }),
  stop("auckland-hotel-cordis", "Cordis Auckland", [-36.8574207, 174.7636272], "Cordis is a full-service upper-city base with a heated rooftop pool, Chuan Spa, family rooms, and frequent shuttles down to the waterfront.", {
    category: "Stay", subcategory: "hotel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "family_friendly", "spa", "pool", "business"], price: "$$$", hours: { default: "Front desk open 24 hours daily; check-in from 3:00 PM and check-out by 11:00 AM." }, officialUrl: "https://www.cordishotels.com/en/auckland/", bookingUrl: "https://www.booking.com/hotel/nz/cordis-auckland.html", sourcePhoto: "https://www.cordishotels.com/content/dam/cordishotels/dynamicmedia/global/cordis_global/destinations/cd-destinations-auckland-exterior.jpg?wid=1400", editorialUrls: [editorial.hotels],
  }),
  stop("auckland-hotel-m-social", "M Social Auckland", [-36.8429672, 174.7645698], "Every room faces Princes Wharf, while ferry terminals, the Maritime Museum, and waterfront restaurants sit almost directly outside this energetic modern hotel.", {
    category: "Stay", subcategory: "hotel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["waterfront", "harbor_view", "central", "design", "accessible"], price: "$$$", hours: { default: "Front desk open 24 hours daily; check-in from 3:00 PM and check-out by 11:00 AM." }, officialUrl: "https://www.msocial.com/en/auckland/m-social-hotel-auckland/", bookingUrl: "https://www.booking.com/hotel/nz/m-social-auckland.en-gb.html", sourcePhoto: "https://www.msocial.com/mhb-media/msocial/version2/new-zealand/auckland/m-social-auckland/hotel-facade--interior/hotel-lobby/1040-x-1040px/lobby-3-1040x1040.jpg", editorialUrls: [editorial.hotels],
  }),
  stop("auckland-hotel-fable", "Fable Auckland, MGallery", [-36.8455475, 174.7665163], "Fable places compact, polished rooms inside a heritage Queen Street building, adding Cooke's Restaurant, a sauna, and exceptionally convenient Britomart access.", {
    category: "Stay", subcategory: "hotel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "heritage", "boutique", "central", "wellness"], price: "$$$", hours: { default: "Front desk open 24 hours daily; check-in from 2:00 PM and check-out by 11:00 AM." }, officialUrl: "https://all.accor.com/hotel/B0H7/index.en.shtml", bookingUrl: "https://www.booking.com/hotel/nz/fable-auckland-mgallery.html", sourcePhoto: "https://www.ahstatic.com/photos/b0h7_ho_00_p_2048x1536.jpg", editorialUrls: [editorial.hotels],
  }),
  stop("auckland-hotel-voco", "voco Auckland City Centre", [-36.846854, 174.7647207], "High-floor rooms and the Bar Albert rooftop supply wide harbour and skyline views, while Wyndham Street keeps the ferries and Sky Tower walkable.", {
    category: "Stay", subcategory: "hotel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["central", "rooftop", "harbor_view", "modern", "business"], price: "$$$", hours: { default: "Front desk open 24 hours daily; check-in from 3:00 PM and check-out by 11:00 AM." }, officialUrl: "https://www.ihg.com/voco/hotels/us/en/auckland/aklvo/hoteldetail", bookingUrl: "https://www.booking.com/hotel/nz/voco-auckland-city-centre.html", sourcePhoto: "https://lightforge.co.nz/wp-content/uploads/2023/03/voco-holiday-express-auckland-dennis-radermacher-24.jpg", editorialUrls: [editorial.hotels],
  }),
  stop("auckland-hotel-intercontinental", "InterContinental Auckland", [-36.8433494, 174.7665391], "InterContinental sits above Commercial Bay with contemporary harbour-facing rooms, club-lounge service, and direct access to downtown dining and ferry connections.", {
    category: "Stay", subcategory: "hotel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "waterfront", "central", "harbor_view", "business"], price: "$$$$", hours: { default: "Front desk open 24 hours daily; check-in from 3:00 PM and check-out by 11:00 AM." }, officialUrl: "https://www.ihg.com/intercontinental/hotels/us/en/auckland/aklha/hoteldetail", bookingUrl: "https://www.booking.com/hotel/nz/intercontinental-auckland.html", sourcePhoto: "https://digital.ihg.com/is/image/ihg/intercontinental-auckland-9442615075-2x1", editorialUrls: [editorial.hotels],
  }),
];

const hostelStops: GuideStop[] = [
  stop("auckland-hostel-verandahs", "Verandahs Parkside Lodge", [-36.8581722, 174.7515115], "Two restored villas, mature gardens, generous kitchens, and a quieter Ponsonby-edge setting make Verandahs especially good for independent longer stays.", {
    category: "Stay", subcategory: "hostel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "quiet", "garden", "heritage", "solo_friendly"], price: "$", hours: { default: "Reception daily 9:00 AM-5:00 PM; check-in 2:00 PM-5:00 PM, with advance instructions required for later arrival." }, officialUrl: "https://www.verandahs.co.nz/", bookingUrl: "https://www.hostelworld.com/hostels/p/14778/verandahs-park-side-lodge/", sourcePhoto: "https://static.wixstatic.com/media/1f2216_d78e9d6a75f54ba6b080fbd18da1f1cf~mv2.jpg/v1/fill/w_1063,h_591,al_c/1f2216_d78e9d6a75f54ba6b080fbd18da1f1cf~mv2.jpg", editorialUrls: [editorial.hostels],
  }),
  stop("auckland-hostel-lylo", "LyLo Auckland", [-36.8515448, 174.7587991], "LyLo pairs private sleeping pods and ensuite rooms with a large shared kitchen, work nooks, and Miss Lucy's social bar near SkyCity.", {
    category: "Stay", subcategory: "hostel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "social", "design", "central", "work_friendly"], price: "$$", hours: { default: "Front desk open 24 hours daily; check-in from 3:00 PM and check-out by 10:00 AM." }, officialUrl: "https://www.lylo.com/auckland/", bookingUrl: "https://www.hostelworld.com/hostels/p/313510/lylo-auckland/", sourcePhoto: "https://cdn.lylo.com/wp-content/uploads/sites/170/2022/11/16170235/lylo-auckland-rooms4-scaled.jpg", editorialUrls: [editorial.hostels],
  }),
  stop("auckland-hostel-jojoe", "JO&JOE Auckland", [-36.8459894, 174.7674268], "JO&JOE's Fort Street opening combines dorms and private rooms with a public restaurant, rooftop bar, frequent programming, and immediate Britomart access.", {
    category: "Stay", subcategory: "hostel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "social", "rooftop", "nightlife", "central"], price: "$$", hours: { default: "Front desk open 24 hours daily; official hotel check-in from 3:00 PM and check-out by 10:00 AM." }, officialUrl: "https://www.joandjoe.com/auckland/en/", bookingUrl: "https://all.accor.com/hotel/C0N8/index.en.shtml", sourcePhoto: "https://www.ahstatic.com/photos/c0n8_ho_00_p_2048x1536.jpg", editorialUrls: [editorial.hostels],
  }),
  stop("auckland-hostel-attic", "The Attic Backpackers", [-36.8502782, 174.7629939], "Attic favors a calm, friendly atmosphere over partying, with a rooftop terrace, large kitchen, central location, and staff present around the clock.", {
    category: "Stay", subcategory: "hostel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "quiet", "central", "rooftop", "solo_friendly"], price: "$", hours: { default: "Reception daily 9:00 AM-9:00 PM; check-in from 2:30 PM and check-out by 10:00 AM; emailed door codes cover later arrivals." }, officialUrl: "https://www.atticbackpackers.co.nz/", bookingUrl: "https://www.hostelworld.com/hostels/p/74374/the-attic-backpackers/", sourcePhoto: "https://cdn.prod.website-files.com/68b42054e85485b5aa759ee9/68b42054e85485b5aa759f7a_backpackers-playing-games.avif", editorialUrls: [editorial.hostels],
  }),
  stop("auckland-hostel-newton", "Newton Lodge", [-36.8586772, 174.7605175], "Newton Lodge offers air-conditioned dorms, compact private rooms, individual bathroom stalls, and a no-alcohol policy beside Karangahape Road.", {
    category: "Stay", subcategory: "hostel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "quiet", "central", "kitchen", "solo_friendly"], price: "$", hours: { default: "Reception daily 10:00 AM-3:00 PM; check-in after 2:00 PM and check-out by 11:00 AM; prepaid guests receive late-arrival instructions." }, officialUrl: "https://newtonlodge.co.nz/", bookingUrl: "https://www.hostelworld.com/hostels/p/31270/newton-lodge-auckland/", sourcePhoto: "https://newtonlodge.co.nz/wp-content/uploads/2022/06/NL_3660_12-edited-scaled.jpg", editorialUrls: [editorial.hostels],
  }),
  stop("auckland-hostel-haka-city", "Haka House Auckland City", [-36.8557344, 174.7632983], "This refurbished Turner Street hostel offers modern dorms, private rooms, a broad communal kitchen, and a central but calmer position above Queen Street.", {
    category: "Stay", subcategory: "hostel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "social", "central", "design", "kitchen"], price: "$", hours: { default: "Reception daily 8:00 AM-8:00 PM; check-in from 2:00 PM and check-out by 10:00 AM; after-hours arrival requires property instructions." }, officialUrl: "https://hakahouse.com/auckland-city/", bookingUrl: "https://www.hostelworld.com/hostels/p/312997/haka-house-auckland-city/", sourcePhoto: "https://www.aucklandnz.com/media/media/tau/tau_media/venues/aucklandcity-43_copy.jpg?crop=113%2C0%2C2745%2C2000&ext=.jpg", editorialUrls: [editorial.hostels],
  }),
  stop("auckland-hostel-haka-kroad", "Haka House Auckland K' Road", [-36.8579074, 174.7565965], "Haka House K' Road places contemporary bunks, shared kitchens, and relaxed common rooms directly on Auckland's most nightlife-heavy inner-city strip.", {
    category: "Stay", subcategory: "hostel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "social", "nightlife", "central", "kitchen"], price: "$", hours: { default: "Reception daily 8:00 AM-8:00 PM; check-in from 2:00 PM and check-out by 10:00 AM; after-hours arrival requires property instructions." }, officialUrl: "https://hakahouse.com/auckland-kroad/", bookingUrl: "https://www.hostelworld.com/hostels/p/82456/haka-house-auckland-k-road/", sourcePhoto: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/685539616.jpg?k=306caaf36b7647f75ab0e91f373b3609e97002a7d51aba2ec5523ee901903035&o=", editorialUrls: [editorial.hostels],
  }),
  stop("auckland-hostel-united", "United Auckland", [-36.8568809, 174.7627642], "United is a newer compact hostel with privacy-curtained bunks, a bright kitchen and lounge, and easy walking access to K' Road.", {
    category: "Stay", subcategory: "hostel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "social", "central", "design", "kitchen"], price: "$", hours: { default: "Reception daily 9:00 AM-5:00 PM; check-in from 2:00 PM and check-out by 10:00 AM; arrival outside reception follows emailed access instructions." }, officialUrl: "https://www.unitedauckland.co.nz/", bookingUrl: "https://www.hostelworld.com/hostels/p/326115/united-auckland/", sourcePhoto: "https://www.unitedauckland.co.nz/web/image/868-11079235/Screenshot%202025-08-19%20100832.png", editorialUrls: [editorial.hostels],
  }),
  stop("auckland-hostel-hobson", "Hobson Lodge", [-36.8533603, 174.7591513], "Hobson Lodge provides female and mixed dorms, private rooms, a modern communal kitchen, and limited prebooked parking near the Sky Tower.", {
    category: "Stay", subcategory: "hostel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "central", "kitchen", "female_dorm", "parking"], price: "$", hours: { default: "Reception daily 9:30 AM-5:00 PM; check-in 2:00 PM-5:00 PM, with the property handling after-hours arrivals directly." }, officialUrl: "https://www.hobsonlodge.co.nz/rooms", bookingUrl: "https://www.hostelworld.com/hostels/p/290180/hobson-lodge/", sourcePhoto: "https://www.hobsonlodge.co.nz/images/bedin8_1.jpg", editorialUrls: [editorial.hostels],
  }),
  stop("auckland-hostel-y", "The Y Hostel", [-36.8571, 174.7592], "The Y Hostel is a straightforward central backpacker base with single rooms and dorms, shared kitchens, a gym connection, and longer-stay practicality.", {
    category: "Stay", subcategory: "hostel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "central", "gym", "kitchen", "long_stay"], price: "$", hours: { default: "Reception open 24 hours daily; check-in from 2:00 PM and check-out by 10:00 AM." }, officialUrl: "https://www.ymcaaccommodation.org.nz/", bookingUrl: "https://www.hostelworld.com/hostels/p/15802/ymca-hostel/", sourcePhoto: "https://images.squarespace-cdn.com/content/v1/67f2ede9e863e5464c4c8145/b31da860-d065-458d-b0c7-5465ebb6e2be/iStock-1309618733_hero_main.jpg?format=1500w", editorialUrls: [editorial.hostels],
  }),
];

const pubStops: GuideStop[] = [
  stop("auckland-pub-occidental", "The Occidental", [-36.8470041, 174.7663116], "Auckland's Belgian beer institution fills a narrow heritage building with Trappist bottles, taps, mussel pots, and a busy Vulcan Lane terrace.", {
    venueKind: "nightlife", nightlifeType: "pub", foodServiceType: "pub", attributeTags: ["craft_beer", "casual_nightlife", "heritage", "outdoor_seating"], price: "$$", hours: { default: "Daily 9:00 AM-late; public holidays 12:00 PM-late." }, officialUrl: "https://www.occidentalbar.co.nz/contact", sourcePhoto: "https://images.squarespace-cdn.com/content/v1/5ec334f280eb5b251d1de56d/1622316633299-PF6RW4F5XZGLQ73JS8UN/theoccidental.jpg", editorialUrls: [editorial.pubs],
  }),
  stop("auckland-pub-galbraiths", "Galbraith's Alehouse", [-36.8655141, 174.7612904], "Galbraith's brews cask-conditioned real ale onsite and serves it in a former library alongside guest taps and unfussy pub meals.", {
    venueKind: "nightlife", nightlifeType: "brewery", foodServiceType: "pub", attributeTags: ["craft_beer", "local_bar", "low_key_nightlife", "heritage"], price: "$$", hours: { default: "Daily 12:00 PM-late; kitchen 12:00 PM-9:00 PM." }, officialUrl: "https://alehouse.co.nz/", sourcePhoto: "https://alehouse.co.nz/wp-content/uploads/2020/05/galbraiths-alehouse-craft-beer-pub.jpg", editorialUrls: [editorial.pubs],
  }),
  stop("auckland-pub-morningside", "Morningside Tavern", [-36.8755058, 174.7368823], "A roomy former furniture workshop now holds a neighborhood tavern, courtyard, big screens, pizzas, shared tables, and regular community events.", {
    venueKind: "nightlife", nightlifeType: "pub", foodServiceType: "pub", attributeTags: ["casual_nightlife", "group_friendly", "sports_screening", "outdoor_seating"], price: "$$", hours: { default: "Daily 11:30 AM-late; current event extensions follow the official calendar." }, officialUrl: "https://morningsidetavern.co.nz/", sourcePhoto: "https://morningsidetavern.co.nz/wp-content/uploads/2024/10/BANNER-30-1290x570.jpg", editorialUrls: [editorial.pubs],
  }),
  stop("auckland-pub-portland", "The Portland Public House", [-36.8718169, 174.7450093], "Portland Public House is a deliberately unpolished Kingsland local for craft beer, pub food, live bands, open mics, and late weekend sessions.", {
    venueKind: "nightlife", nightlifeType: "live_music_venue", foodServiceType: "pub", attributeTags: ["live_music", "local_bar", "casual_nightlife", "late_night"], price: "$$", hours: { mon: "4:00 PM-12:00 AM", tue: "4:00 PM-12:00 AM", wed: "4:00 PM-12:00 AM", thu: "4:00 PM-2:00 AM", fri: "3:00 PM-2:00 AM", sat: "12:00 PM-2:00 AM", sun: "12:00 PM-12:00 AM" }, officialUrl: "https://www.aucklandnz.com/explore/the-portland-public-house", sourcePhoto: "https://images.localista.com.au/eatingout/687882_lrg.jpg", editorialUrls: [editorial.pubs],
  }),
  stop("auckland-pub-hotel-ponsonby", "Hotel Ponsonby", [-36.8472402, 174.7445266], "Hotel Ponsonby is a modern public house with a handsome front bar, bright courtyard, strong bistro cooking, and enough space for groups.", {
    venueKind: "nightlife", nightlifeType: "pub", foodServiceType: "pub", attributeTags: ["local_bar", "casual_nightlife", "outdoor_seating", "group_friendly"], price: "$$$", hours: { default: "Daily 12:00 PM-late." }, officialUrl: "https://www.hotelponsonby.co.nz/", bookingUrl: "https://www.hotelponsonby.co.nz/bookings", sourcePhoto: "https://images.squarespace-cdn.com/content/v1/5fbcac831fffcd12c772595e/1657009419917-AD8XEBZA9MZP85WYMBHA/Ctrl-Space-Hotel-Ponsonby-Auckland-Hospitality-Photo-Jono-Parker-Yellowtrace-01.jpeg?format=1500w", editorialUrls: [editorial.pubs],
  }),
  stop("auckland-pub-whammy", "Whammy Bar", [-36.8575841, 174.7601013], "Below St Kevin's Arcade, Whammy is a crucial small room for punk, indie, electronic, experimental, and touring underground music.", {
    venueKind: "nightlife", nightlifeType: "live_music_venue", musicGenres: ["punk", "indie", "electronic", "experimental"], attributeTags: ["live_music", "late_late", "casual_nightlife", "local_favorite"], price: "$$", hours: { mon: "Closed", tue: "Closed unless the official show calendar lists an event", wed: "8:30 PM-4:00 AM", thu: "8:30 PM-4:00 AM", fri: "8:30 PM-4:00 AM", sat: "8:30 PM-4:00 AM", sun: "Closed unless the official show calendar lists an event" }, officialUrl: "https://www.undertheradar.co.nz/utr/gig_guide_auckland", sourcePhoto: "https://images.localista.com.au/eatingout/690869_lrg.jpg", editorialUrls: [editorial.pubs, "https://localista.co.nz/listing/whammy-bar?place=auckland%2C+nz"],
  }),
  stop("auckland-pub-chapel", "Chapel Bar & Bistro", [-36.855032, 174.7463617], "Chapel's broad pavement terrace, approachable bistro menu, sports screens, and late weekend hours make it an easy Ponsonby group default.", {
    venueKind: "nightlife", nightlifeType: "pub", foodServiceType: "pub", attributeTags: ["casual_nightlife", "outdoor_seating", "sports_screening", "group_friendly"], price: "$$", hours: { mon: "12:00 PM-12:00 AM", tue: "12:00 PM-12:00 AM", wed: "12:00 PM-12:00 AM", thu: "12:00 PM-12:00 AM", fri: "12:00 PM-1:00 AM", sat: "12:00 PM-1:00 AM", sun: "12:00 PM-11:00 PM" }, officialUrl: "https://www.chapel.co.nz/", sourcePhoto: "https://ponsonbynews.co.nz/cdn/shop/files/eat-drink-bars-chapel-bar.jpg?v=1739149243&width=1400", editorialUrls: [editorial.pubs],
  }),
  stop("auckland-pub-longroom", "Longroom", [-36.8572433, 174.7477832], "Longroom shifts from breakfast and coffee into a long courtyard bar, with DJs and a markedly louder crowd on Friday and Saturday nights.", {
    venueKind: "nightlife", nightlifeType: "other", foodServiceType: "pub", attributeTags: ["dj_sets", "outdoor_seating", "lively_nightlife", "late_late"], price: "$$", hours: { mon: "7:00 AM-4:00 PM", tue: "7:00 AM-4:00 PM", wed: "7:00 AM-11:00 PM", thu: "7:00 AM-1:00 AM", fri: "7:00 AM-3:00 AM", sat: "8:00 AM-3:00 AM", sun: "8:00 AM-4:00 PM" }, officialUrl: "https://www.longroom.co.nz/", sourcePhoto: "https://images.squarespace-cdn.com/content/v1/65b85e388f93145af22b64bf/3907d433-c130-45d5-bcc3-8e3507f18f2f/DSC_2418+%282%29.jpg?format=1500w", editorialUrls: [editorial.pubs],
  }),
  stop("auckland-pub-whiskey", "The Whiskey", [-36.8532473, 174.7451471], "The Whiskey keeps Ponsonby late with a dark rock-and-roll room, live music every night, an open mic, and a deep whisky shelf.", {
    venueKind: "nightlife", nightlifeType: "live_music_venue", musicGenres: ["rock", "acoustic", "blues"], attributeTags: ["live_music", "late_late", "local_bar", "casual_nightlife"], price: "$$", hours: { default: "Daily 5:00 PM-3:00 AM; Monday open-mic and nightly acts follow the official event calendar." }, officialUrl: "https://www.thewhiskey.co.nz/", sourcePhoto: "https://static.wixstatic.com/media/0a5d90_4358f64eccca46a79dcea72e296840c6%7Emv2.jpg/v1/fit/w_2500,h_1330,al_c/0a5d90_4358f64eccca46a79dcea72e296840c6%7Emv2.jpg", editorialUrls: [editorial.pubs],
  }),
  stop("auckland-pub-broken-lantern", "The Broken Lantern", [-36.8537471, 174.7453904], "Broken Lantern updates the neighborhood tavern with craft beer, natural wine, straightforward cocktails, pub plates, and a covered Ponsonby courtyard.", {
    venueKind: "nightlife", nightlifeType: "pub", foodServiceType: "pub", attributeTags: ["craft_beer", "natural_wine", "outdoor_seating", "casual_nightlife"], price: "$$", hours: { mon: "Closed", tue: "4:00 PM-1:00 AM", wed: "4:00 PM-1:00 AM", thu: "4:00 PM-1:00 AM", fri: "12:00 PM-1:00 AM", sat: "12:00 PM-1:00 AM", sun: "12:00 PM-1:00 AM" }, officialUrl: "https://www.brokenlantern.co.nz/", sourcePhoto: "https://cdn.broadsheet.com.au/cache/a1/b2/a1b2c77c25db14035e50b21d4446947b.jpg", editorialUrls: [editorial.pubs, "https://www.broadsheet.com.au/new-zealand/ponsonby/bars/broken-lantern"],
  }),
];

const cocktailStops: GuideStop[] = [
  stop("auckland-cocktail-caretaker", "Caretaker", [-36.845136, 174.7694603], "This dim Britomart basement skips a printed menu: bartenders translate preferences into classics or tailored drinks, with live jazz on Sundays.", {
    venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["craft_cocktails", "speakeasy", "late_late", "live_music"], price: "$$$", hours: { default: "Daily 5:00 PM-3:00 AM; Sunday jazz timing follows the official event calendar." }, officialUrl: "https://www.caretaker.net.nz/", sourcePhoto: "https://www.theworlds50best.com/discovery/filestore/jpg/Caretaker-Auckland-New-Zealand-01.jpg", editorialUrls: [editorial.cocktails, "https://www.theworlds50best.com/discovery/Establishments/New-Zealand/Auckland/Caretaker.html"],
  }),
  stop("auckland-cocktail-deadshot", "Deadshot", [-36.8596, 174.7502], "Deadshot's bartenders also work without a menu, building custom drinks from a short conversation inside a dark, candlelit Ponsonby room.", {
    venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["craft_cocktails", "speakeasy", "late_late", "date_night"], price: "$$$", hours: { default: "Daily 5:00 PM-2:00 AM." }, officialUrl: "https://www.deadshot.co.nz/", sourcePhoto: "https://static.wixstatic.com/media/63cb1b_24073032b95e474e9142147a593a80bc~mv2.jpg/v1/fill/w_1920,h_1200,al_c,q_90/63cb1b_24073032b95e474e9142147a593a80bc~mv2.jpg", editorialUrls: [editorial.cocktails],
  }),
  stop("auckland-cocktail-pineapple", "Pineapple on Parnell", [-36.8538, 174.7806], "A discreet brass pineapple marks this plush Parnell lounge, where table service, classic cocktails, brown spirits, and live jazz set the pace.", {
    venueKind: "nightlife", nightlifeType: "lounge", musicGenres: ["jazz"], attributeTags: ["craft_cocktails", "live_music", "romantic_nightlife", "dressy"], price: "$$$", hours: { mon: "Closed", tue: "5:00 PM-11:00 PM", wed: "5:00 PM-11:00 PM", thu: "5:00 PM-1:00 AM", fri: "5:00 PM-2:00 AM", sat: "5:00 PM-2:00 AM", sun: "Closed" }, officialUrl: "https://www.aucklandnz.com/explore/pineapple-on-parnell", sourcePhoto: "https://www.aucklandnz.com/media/media/tau/tau_media/eat%20and%20drink/bars/eat-drink-bars-pineapple-bar.jpg?ext=.jpg&crop=175,0,1873,1365", editorialUrls: [editorial.cocktails],
  }),
  stop("auckland-cocktail-panacea", "Panacea", [-36.8475406, 174.7669799], "Panacea replaces a conventional bar counter with an open cocktail kitchen, letting guests watch clarified, carbonated, and carefully prepped drinks take shape.", {
    venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["craft_cocktails", "design", "date_night", "walk_in_friendly_nightlife"], price: "$$$", hours: { mon: "4:00 PM-12:00 AM", tue: "4:00 PM-12:00 AM", wed: "4:00 PM-12:00 AM", thu: "4:00 PM-12:00 AM", fri: "4:00 PM-1:00 AM", sat: "4:00 PM-1:00 AM", sun: "Closed" }, officialUrl: "https://www.panacea.bar/", sourcePhoto: "https://panacea.bar/assets/nov-2024.png", editorialUrls: [editorial.cocktails],
  }),
  stop("auckland-cocktail-truth-or-dare", "Truth or Dare", [-36.8474, 174.7678], "Theo Tjandra's Snickel Lane bar uses local ingredients, Indonesian references, and playful technique for experimental drinks while retaining a strong classic foundation.", {
    venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["craft_cocktails", "walk_in_friendly_nightlife", "date_night", "central"], price: "$$$", hours: { mon: "4:00 PM-12:30 AM", tue: "4:00 PM-12:30 AM", wed: "4:00 PM-12:30 AM", thu: "4:00 PM-12:30 AM", fri: "4:00 PM-1:30 AM", sat: "4:00 PM-1:30 AM", sun: "Closed" }, officialUrl: "https://www.truthordarebar.com/", sourcePhoto: "https://images.squarespace-cdn.com/content/v1/686c49b43803831c5c33896d/97e483bf-a8a3-41b2-9d04-46e6aeba5036/truth+or+dare+social.png?format=1500w", editorialUrls: [editorial.cocktails],
  }),
  stop("auckland-cocktail-little-culprit", "Little Culprit", [-36.8473349, 174.7650454], "Little Culprit is an intimate wine-and-cocktail sibling to Culprit, strongest for an early aperitif, concise food, and informed hospitality downtown.", {
    venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["craft_cocktails", "natural_wine", "date_night", "central"], price: "$$$", hours: { mon: "Closed", tue: "Closed", wed: "3:00 PM-late", thu: "3:00 PM-late", fri: "3:00 PM-late", sat: "3:00 PM-late", sun: "Closed" }, officialUrl: "https://www.littleculprit.co.nz/contact", sourcePhoto: "https://images.myguide-cdn.com/auckland/companies/little-culprit/large/little-culprit-1326567.jpg", editorialUrls: [editorial.cocktails, "https://www.broadsheet.com.au/new-zealand/auckland/bars/little-culprit"],
  }),
  stop("auckland-cocktail-churchill", "The Churchill", [-36.8537295, 174.7635197], "The Churchill uses its twentieth-floor position for skyline views, a large gin collection, build-your-own G&T combinations, and polished rooftop cocktails.", {
    venueKind: "nightlife", nightlifeType: "rooftop_bar", attributeTags: ["craft_cocktails", "scenic_nightlife", "rooftop", "dressy"], price: "$$$", hours: { mon: "Closed", tue: "4:00 PM-11:00 PM", wed: "4:00 PM-11:00 PM", thu: "4:00 PM-11:00 PM", fri: "4:00 PM-late", sat: "4:00 PM-late", sun: "Closed" }, officialUrl: "https://www.thechurchillauckland.co.nz/our-menus", sourcePhoto: "https://mds-assets.marriott.com/cdn-cgi/image/f=auto/cms-platform-for-marriott/aklfp-the-churchill/thechurchill-2ndjune2026-1321564-1.jpg?cropY=2687&cropW=3694&cropH=1110&width=1800&height=541", editorialUrls: [editorial.cocktails],
  }),
  stop("auckland-cocktail-bellini", "Bellini Bar", [-36.8397472, 174.7658542], "Bellini's wall of glass turns the end of Princes Wharf into a harbour lounge for cocktails, Champagne, and a particularly well-positioned afternoon tea.", {
    venueKind: "nightlife", nightlifeType: "lounge", attributeTags: ["craft_cocktails", "waterfront", "scenic_nightlife", "hotel_bar"], price: "$$$", hours: { mon: "10:00 AM-11:00 PM", tue: "10:00 AM-11:00 PM", wed: "10:00 AM-11:00 PM", thu: "10:00 AM-11:00 PM", fri: "10:00 AM-11:00 PM", sat: "9:00 AM-late", sun: "9:00 AM-late" }, officialUrl: "https://princes-wharf.co.nz/establishment/bellini/", sourcePhoto: "https://princes-wharf.co.nz/wp-content/uploads/2026/03/bellini-tile.jpg", editorialUrls: [editorial.cocktails],
  }),
  stop("auckland-cocktail-lime", "Lime", [-36.8543967, 174.7460416], "Lime is a tiny, long-running Ponsonby cocktail bar where close quarters, classic drinks, loud conversation, and late hours matter more than spectacle.", {
    venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["craft_cocktails", "local_bar", "late_late", "walk_in_friendly_nightlife"], price: "$$", hours: { mon: "4:00 PM-12:00 AM", tue: "4:00 PM-1:00 AM", wed: "4:00 PM-1:00 AM", thu: "4:00 PM-3:00 AM", fri: "4:00 PM-3:00 AM", sat: "2:00 PM-3:00 AM", sun: "Closed" }, officialUrl: "https://www.limebar.co.nz/", sourcePhoto: "https://static1.squarespace.com/static/62748f459f07f26a6671aa80/t/6360878f174b47488d71a1c2/1667270546263/Lime-Bar-Home.jpg?format=1500w", editorialUrls: [editorial.cocktails],
  }),
  stop("auckland-cocktail-kemuri", "Kemuri Hi-Fi", [-36.8447, 174.7663], "Kemuri's basement listening room pairs a serious vinyl system and Japanese jazz-kissa mood with whisky, restrained cocktails, and charcoal-grilled snacks.", {
    venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["jazz", "soul", "electronic"], attributeTags: ["craft_cocktails", "vinyl", "design", "date_night"], price: "$$$", hours: { mon: "Closed", tue: "4:00 PM-late", wed: "4:00 PM-late", thu: "4:00 PM-late", fri: "4:00 PM-late", sat: "4:00 PM-late", sun: "Closed" }, officialUrl: "https://www.kemurihifi.co.nz/reservations", sourcePhoto: "https://images.squarespace-cdn.com/content/v1/666b93e38bc3b01bff1be156/a36fafbf-9f8e-46b6-a83e-c6dfb52ccd82/HOME+PAGE.jpg?format=1500w", editorialUrls: [editorial.cocktails],
  }),
];

const cultureStops: GuideStop[] = [
  stop("auckland-culture-museum", "Auckland War Memorial Museum", [-36.8607564, 174.77781], "Auckland's hilltop museum connects Māori and Pacific taonga, natural history, volcanic science, decorative arts, and the country's military remembrance in one monumental building.", {
    category: "Culture", subcategory: "museum", venueKind: "culture", attributeTags: ["maori_culture", "pacific_culture", "history", "architecture", "family_friendly"], hours: { default: "Daily 10:00 AM-5:00 PM; closed Christmas Day." }, officialUrl: "https://www.aucklandmuseum.com/visit", sourcePhoto: commons("Auckland War Memorial Museum in 2021.jpg"), editorialUrls: [editorial.culture],
  }),
  stop("auckland-culture-art-gallery", "Auckland Art Gallery Toi o Tāmaki", [-36.8523374, 174.7670151], "The country's largest visual-art collection gives particular weight to historic and contemporary New Zealand, Māori, and Pacific work inside a sensitive heritage-modern extension.", {
    category: "Culture", subcategory: "art_gallery", venueKind: "culture", attributeTags: ["art", "maori_culture", "pacific_culture", "architecture", "central"], hours: { default: "Daily 10:00 AM-5:00 PM; closed Christmas Day." }, officialUrl: "https://www.aucklandartgallery.com/visit", sourcePhoto: commons("Auckland Art Gallery Toi o Tāmaki - Joy of Museums - External 2.jpg"), editorialUrls: [editorial.culture],
  }),
  stop("auckland-culture-maritime", "New Zealand Maritime Museum Hui Te Ananui a Tangaroa", [-36.8415315, 174.7633964], "Voyaging canoes, immigration stories, trade, yachting, and harbour sailings explain how the sea shaped Aotearoa from Hobson Wharf itself.", {
    category: "Culture", subcategory: "maritime_museum", venueKind: "culture", attributeTags: ["maritime", "history", "family_friendly", "waterfront", "central"], hours: { default: "Daily 10:00 AM-5:00 PM; last museum entry 4:00 PM; closed Christmas Day." }, officialUrl: "https://www.maritimemuseum.co.nz/about/contact-us", sourcePhoto: commons("New Zealand Maritime Museum.jpg"), editorialUrls: [editorial.culture],
  }),
  stop("auckland-culture-motat", "MOTAT", [-36.8610722, 174.713221], "MOTAT treats transport and technology as hands-on social history, spanning trams, aviation, computing, engines, energy, and ambitious interactive family exhibitions.", {
    category: "Culture", subcategory: "science_and_transport_museum", venueKind: "culture", attributeTags: ["technology", "transport", "aviation", "family_friendly", "interactive"], hours: { default: "Daily 10:00 AM-4:00 PM; last entry 3:30 PM; closed Christmas Day." }, officialUrl: "https://motat.nz/visit/opening-hours/", sourcePhoto: commons("MOTAT 2.JPG"), editorialUrls: [editorial.culture],
  }),
  stop("auckland-culture-stardome", "Stardome Observatory and Planetarium", [-36.9060373, 174.7770935], "Stardome combines planetarium shows, telescope sessions, space science, and mātauranga Māori sky knowledge below Maungakiekie in Cornwall Park.", {
    category: "Culture", subcategory: "planetarium", venueKind: "culture", attributeTags: ["astronomy", "maori_culture", "family_friendly", "educational", "evening"], hours: { mon: "9:30 AM-5:00 PM", tue: "9:30 AM-5:00 PM and 6:00 PM-10:30 PM", wed: "9:30 AM-5:00 PM and 6:00 PM-10:30 PM", thu: "9:30 AM-5:00 PM and 6:00 PM-10:30 PM", fri: "9:30 AM-5:00 PM and 6:00 PM-10:30 PM", sat: "9:30 AM-5:00 PM and 6:00 PM-10:30 PM", sun: "9:30 AM-5:00 PM and 6:00 PM-10:30 PM" }, officialUrl: "https://www.stardome.org.nz/visit", bookingUrl: "https://www.stardome.org.nz/whats-on", sourcePhoto: commons("Stardome Observatory Cornwall Park.jpg"), editorialUrls: [editorial.culture],
  }),
  stop("auckland-culture-howick", "Howick Historical Village", [-36.9074773, 174.903224], "More than thirty relocated buildings reconstruct an 1840-1880 colonial settlement, with costumed interpretation and live days adding domestic craft and social context.", {
    category: "Culture", subcategory: "living_history_museum", venueKind: "culture", attributeTags: ["history", "architecture", "family_friendly", "living_history", "east_auckland"], hours: { mon: "Closed", tue: "10:00 AM-4:00 PM; last admission 3:00 PM", wed: "10:00 AM-4:00 PM; last admission 3:00 PM", thu: "10:00 AM-4:00 PM; last admission 3:00 PM", fri: "10:00 AM-4:00 PM; last admission 3:00 PM", sat: "10:00 AM-4:00 PM; last admission 3:00 PM", sun: "10:00 AM-4:00 PM; last admission 3:00 PM" }, officialUrl: "https://www.historicalvillage.org.nz/contact-us", sourcePhoto: commons("Howick Historical Village.jpg"), editorialUrls: [editorial.culture],
  }),
  stop("auckland-culture-te-uru", "Te Uru Waitākere Contemporary Gallery", [-36.9383566, 174.6551836], "Te Uru's Titirangi galleries foreground contemporary art, craft, and design from western Auckland and Aotearoa in a building shaped around bush views.", {
    category: "Culture", subcategory: "contemporary_art_gallery", venueKind: "culture", attributeTags: ["art", "craft", "design", "free_entry", "west_auckland"], hours: { default: "Daily 10:00 AM-4:30 PM." }, officialUrl: "https://teuru.org.nz/pages/visit", sourcePhoto: commons("Te Uru Gallery Titirangi 4.jpg"), editorialUrls: [editorial.culture],
  }),
  stop("auckland-culture-pah", "Pah Homestead", [-36.9142892, 174.7630637], "The Arts House Trust fills an 1870s Italianate mansion with changing New Zealand exhibitions, sculpture, and a café overlooking Monte Cecilia Park.", {
    category: "Culture", subcategory: "historic_house_gallery", venueKind: "culture", attributeTags: ["art", "heritage", "architecture", "garden", "free_entry"], hours: { mon: "Closed", tue: "9:00 AM-3:00 PM", wed: "9:00 AM-3:00 PM", thu: "9:00 AM-3:00 PM", fri: "9:00 AM-3:00 PM", sat: "8:00 AM-4:00 PM", sun: "8:00 AM-4:00 PM" }, officialUrl: "https://www.artshousetrust.co.nz/hours-location", sourcePhoto: commons("Circa 1877 Monte Cecilia Homestead (12215250653).jpg"), editorialUrls: [editorial.culture],
  }),
  stop("auckland-culture-navy", "Torpedo Bay Navy Museum", [-36.8288545, 174.8092387], "The Royal New Zealand Navy's official museum uses ships, uniforms, oral histories, and harbour defenses to trace naval service from a waterfront base.", {
    category: "Culture", subcategory: "military_museum", venueKind: "culture", attributeTags: ["maritime", "military_history", "free_entry", "waterfront", "devonport"], hours: { default: "Daily 10:00 AM-5:00 PM; closed Good Friday, Christmas Day, and Boxing Day." }, officialUrl: "https://navymuseum.co.nz/contact/", sourcePhoto: commons("Torpedo Bay Navy Museum June 2012.JPG"), editorialUrls: [editorial.culture],
  }),
  stop("auckland-culture-gus-fisher", "Gus Fisher Gallery", [-36.8467937, 174.7693392], "The University of Auckland programs ambitious contemporary exhibitions inside a former radio building whose restored broadcasting studio adds unusual architectural texture.", {
    category: "Culture", subcategory: "contemporary_art_gallery", venueKind: "culture", attributeTags: ["art", "architecture", "free_entry", "central", "university"], hours: { mon: "Closed", tue: "10:00 AM-5:00 PM", wed: "10:00 AM-5:00 PM", thu: "10:00 AM-5:00 PM", fri: "10:00 AM-5:00 PM", sat: "10:00 AM-4:00 PM", sun: "Closed" }, officialUrl: "https://gusfishergallery.auckland.ac.nz/visit-us/", sourcePhoto: commons("Kenneth Myers Centre.jpg"), editorialUrls: [editorial.culture],
  }),
];

const activityStops: GuideStop[] = [
  stop("auckland-activity-sky-tower", "Sky Tower", [-36.8484632, 174.762183], "The 328-metre tower supplies the city's clearest geographic overview, with observation levels, glass floors, dining, and optional SkyWalk or SkyJump experiences.", {
    category: "Activities", subcategory: "observation_tower", venueKind: "landmark", attributeTags: ["viewpoint", "architecture", "central", "family_friendly", "adventure"], hours: { default: "April-September daily: Monday-Thursday 9:30 AM-8:00 PM and Friday-Sunday 9:30 AM-8:30 PM; last entry 30 minutes before close; weather closures follow the official Sky Tower page." }, officialUrl: "https://skycityauckland.co.nz/sky-tower/", bookingUrl: "https://skycityauckland.co.nz/sky-tower/tickets/", sourcePhoto: commons("Sky Tower Auckland 01.jpg"), editorialUrls: [editorial.activities],
  }),
  stop("auckland-activity-rangitoto", "Rangitoto Island Summit Walk", [-36.7861061, 174.8611339], "A ferry and steady lava-field climb lead to Auckland's youngest volcanic cone, pōhutukawa forest, lava caves, and a broad Hauraki Gulf panorama.", {
    category: "Activities", subcategory: "island_hike", venueKind: "outdoors", attributeTags: ["hiking", "volcano", "island", "nature", "ferry"], hours: { default: "Fullers360 departures run daily from downtown Auckland, with the principal outbound sailing at 9:30 AM; return times follow the dated official ferry timetable, and there is no Christmas Day service." }, officialUrl: "https://www.fullers.co.nz/destinations-and-experiences/destinations/rangitoto-island/", timetableUrl: "https://www.fullers.co.nz/timetables-and-fares/", sourcePhoto: "https://www.freewalks.nz/wp-content/uploads/2021/05/rangitoto_island_16-2_0-1-e1623051808608.jpg", editorialUrls: [editorial.activities, "https://www.doc.govt.nz/parks-and-recreation/places-to-go/auckland/places/rangitoto-island/"],
  }),
  stop("auckland-activity-tiritiri", "Tiritiri Matangi Island", [-36.6001314, 174.8891412], "This predator-free sanctuary makes rare tīeke, kōkako, takahē, and other native wildlife unusually visible along guided and self-guided forest tracks.", {
    category: "Activities", subcategory: "wildlife_sanctuary", venueKind: "outdoors", attributeTags: ["birdwatching", "conservation", "island", "guided", "ferry"], hours: { default: "Daily when the official booking calendar operates, Explore ferry trips depart Auckland at 9:00 AM and return about 4:00 PM; weather and biosecurity rules control sailings." }, officialUrl: "https://www.tiritirimatangi.org.nz/", bookingUrl: "https://www.exploregroup.co.nz/auckland/tiritiri-matangi-island/", sourcePhoto: commons("Tui (Prosthemadera novaeseelandiae) Tiritiri Matangi 2.jpg"), editorialUrls: [editorial.activities],
  }),
  stop("auckland-activity-zoo", "Auckland Zoo", [-36.8625686, 174.7208469], "Auckland Zoo combines New Zealand conservation work with large regional habitats; the South East Asia Jungle Track and native Te Wao Nui deserve unhurried time.", {
    category: "Activities", subcategory: "zoo", venueKind: "outdoors", attributeTags: ["wildlife", "conservation", "family_friendly", "accessible", "educational"], hours: { default: "Daily 9:30 AM-4:30 PM from late April to late October and 9:30 AM-5:30 PM from late October to late April; last entry one hour before close; closed Christmas Day.", winter: "Late April to late October daily 9:30 AM-4:30 PM; last entry 3:30 PM", summer: "Late October to late April daily 9:30 AM-5:30 PM; last entry 4:30 PM; closed Christmas Day" }, officialUrl: "https://www.aucklandzoo.co.nz/visit", bookingUrl: "https://tickets.aucklandzoo.co.nz/", sourcePhoto: commons("Auckland Zoo Entrance.JPG"), editorialUrls: [editorial.activities],
  }),
  stop("auckland-activity-kelly-tarltons", "SEA LIFE Kelly Tarlton's Aquarium", [-36.8462033, 174.8171703], "Curved underwater tunnels, Antarctic penguins, sharks, rays, and New Zealand marine displays occupy Kelly Tarlton's inventive former wastewater-tank aquarium beside Tāmaki Drive.", {
    category: "Activities", subcategory: "aquarium", venueKind: "culture", attributeTags: ["marine_life", "family_friendly", "rainy_day", "accessible", "educational"], hours: { default: "Daily 9:30 AM-5:00 PM; last entry 4:00 PM; road-event opening changes are published on the official calendar." }, officialUrl: "https://www.visitsealife.com/auckland/plan-your-day/before-you-visit/opening-hours/", bookingUrl: "https://www.visitsealife.com/auckland/tickets-passes/", sourcePhoto: commons("Aquarium Tunnels, Kelly Tarlton Aquarium.jpg"), editorialUrls: [editorial.activities],
  }),
  stop("auckland-activity-maungawhau", "Maungawhau / Mount Eden", [-36.8771724, 174.7642863], "A short climb reaches the rim of a 50-metre volcanic crater and layered city views; the summit remains a culturally significant ancestral place.", {
    category: "Activities", subcategory: "volcanic_viewpoint", venueKind: "outdoors", attributeTags: ["volcano", "walking", "viewpoint", "maori_culture", "free_entry"], hours: { default: "Pedestrian access daily; summit-road vehicle gates 7:00 AM-8:30 PM in summer and 7:00 AM-7:00 PM in winter.", summer: "Pedestrian access daily; summit-road vehicle gates 7:00 AM-8:30 PM", winter: "Pedestrian access daily; summit-road vehicle gates 7:00 AM-7:00 PM" }, officialUrl: "https://www.aucklandcouncil.govt.nz/en/parks-recreation/find-park-beach/park-detail/58.html", sourcePhoto: commons("Mount Eden crater with Auckland CBD and Rangitoto skyline.jpg"), editorialUrls: [editorial.activities],
  }),
  stop("auckland-activity-coast-to-coast", "Coast to Coast Walkway", [-36.8993, 174.7851], "The 16-kilometre route crosses Auckland from Waitematā to Manukau, linking urban streets, university grounds, volcanic cones, parks, and changing harbour views.", {
    category: "Activities", subcategory: "urban_walk", venueKind: "outdoors", attributeTags: ["walking", "volcano", "parks", "free_entry", "public_transit"], hours: { default: "Public route accessible daily; plan the five-hour walk between 7:00 AM and sunset, while Auckland Council path notices control temporary sections." }, officialUrl: "https://www.aucklandnz.com/explore/coast-to-coast-walkway", sourcePhoto: commons("One Tree Hill Auckland 2010.jpg"), editorialUrls: [editorial.activities, "https://www.aucklandcouncil.govt.nz/en/parks-recreation/get-outdoors/aklpaths/path-detail/385.html"],
  }),
  stop("auckland-activity-north-head", "Maungauika / North Head", [-36.8277095, 174.8123571], "Maungauika combines layered Māori history, coastal artillery tunnels, grassy summit tracks, and close Waitematā Harbour views above Devonport's ferry village.", {
    category: "Activities", subcategory: "historic_headland", venueKind: "outdoors", attributeTags: ["walking", "military_history", "maori_culture", "viewpoint", "ferry"], hours: { default: "Reserve open daily; vehicle gate 6:00 AM-8:30 PM during daylight saving and 6:00 AM-6:00 PM outside daylight saving.", summer: "Reserve open daily; vehicle gate 6:00 AM-8:30 PM during daylight saving", winter: "Reserve open daily; vehicle gate 6:00 AM-6:00 PM outside daylight saving" }, officialUrl: "https://www.doc.govt.nz/parks-and-recreation/places-to-go/auckland/places/maungauika-north-head-historic-reserve/", sourcePhoto: "https://upload.wikimedia.org/wikipedia/commons/5/56/North_Head%2C_New_Zealand_in_2009.jpg", editorialUrls: [editorial.activities],
  }),
  stop("auckland-activity-americas-cup", "America's Cup Sailing Experience", [-36.8423203, 174.7626505], "Explore Group lets guests help grind and trim an authentic America's Cup yacht during a two-hour sail across the Waitematā Harbour.", {
    category: "Activities", subcategory: "sailing", venueKind: "outdoors", attributeTags: ["sailing", "guided", "adventure", "waterfront", "reservation_required"], hours: { default: "Daily departure 1:00 PM April-October and 11:00 AM plus 2:00 PM November-March; check in 15 minutes early and use the official tide schedule for adjustments.", winter: "April-October daily departure 1:00 PM; check in 15 minutes early", summer: "November-March daily departures 11:00 AM and 2:00 PM; check in 15 minutes early; tide schedule controls any adjustment" }, officialUrl: "https://www.exploregroup.co.nz/auckland/americas-cup-sailing-experience/", bookingUrl: "https://www.exploregroup.co.nz/auckland/americas-cup-sailing-experience/", sourcePhoto: "https://www.exploregroup.co.nz/media/bthdhfyq/02-sail-up-city-in-background.jpg?cc=0%2C0.5535203602721224%2C0%2C0.07098827407360343&height=540&v=1dbda1a18edbcc0&width=1920", editorialUrls: [editorial.activities],
  }),
  stop("auckland-activity-waiheke", "Waiheke Island by Ferry", [-36.78012, 174.9915157], "The downtown ferry opens a flexible day of beaches, coastal walks, galleries, wineries, and village buses without committing to a packaged island tour.", {
    category: "Activities", subcategory: "island_day_trip", venueKind: "transport", attributeTags: ["island", "ferry", "beach", "wine", "day_trip"], hours: { default: "Daily downtown ferries begin at 6:00 AM and continue into late evening; exact departures, reservations, and disruption notices follow the dated Fullers360 timetable." }, officialUrl: "https://www.fullers.co.nz/destinations-and-experiences/destinations/waiheke-island/", timetableUrl: "https://www.fullers.co.nz/timetables-and-fares/", sourcePhoto: commons("Hydrofoil and Car Ferry at Matiatia Wharf, Waiheke Island, Auckland (36951463195).jpg"), editorialUrls: [editorial.activities],
  }),
];

function source(name: string, url: string): ListSource {
  return { name, url };
}

function sourcesFor(stops: GuideStop[], editorialSource: ListSource): ListSource[] {
  const candidates = [
    editorialSource,
    ...stops.flatMap((item) => [
      source(`${item.name} official or property page`, item.officialUrl!),
      source(`${item.name} current map listing`, item.sourceEvidence?.mapUrl ?? maps(`${item.name} Auckland New Zealand`)),
    ]),
  ];
  return candidates.filter((item, index) => candidates.findIndex((candidate) => candidate.url === item.url) === index);
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
    url: maps(`${title} Auckland New Zealand`),
    category,
    location: aucklandLocation,
    creator: { id: `user-rguide-${category.toLowerCase()}`, name: `R ${category}`, avatar: avatar(category) },
    upvotes: 0,
    createdAt,
    stops,
    sources: guideSources,
  };
}

export const aucklandCitywideGuides: MapList[] = [
  guide("Food", "list-auckland-dining", "auckland-best-restaurants", "best-restaurants", "Auckland Restaurants for Pacific Produce, Fire, and Precision", "Ten dining rooms that explain contemporary Auckland through Māori and Pacific ingredients, New Zealand seafood and game, Japanese precision, Italian craft, live fire, and distinctive local hospitality.", diningStops, sourcesFor(diningStops, source("Time Out Auckland restaurant guide", editorial.dining)), "Best Restaurants in Auckland for Pacific Food, Seafood, and Fire", "A source-backed Auckland restaurant guide to Ahi, Cazador, Cocoro, Mr Morris, Paris Butter, Amano, Metita, Onslow, Ada, and Depot."),
  guide("Food", "list-auckland-cheap-eats", "auckland-best-cheap-eats", "best-cheap-eats", "Auckland Value: Noodles, Roti, Hot Chicken, and Hotteok", "Auckland's strongest affordable eating stretches across Dominion Road, the central city, Onehunga, Ponsonby, and Takapuna, with specific reasons to order at each counter instead of generic budget filler.", cheapEatStops, sourcesFor(cheapEatStops, source("AucklandNZ cheap-eats guide", editorial.cheap)), "Best Cheap Eats in Auckland for Noodles, Roti, Chicken, and More", "Ten current Auckland value stops for Sichuan wontons, hand-pulled noodles, Malaysian roti, Japanese curry, hot chicken, falafel, ramen, hotteok, and burgers."),
  guide("Stay", "list-auckland-hotels", "auckland-best-hotels", "best-hotels", "Auckland Hotels for Harbour Views, Design, and Downtown Ease", "This hotel-only guide balances waterfront luxury, independent character, high-rise views, spa facilities, design, and ferry access, with each property's location tradeoff made explicit.", hotelStops, sourcesFor(hotelStops, source("AucklandNZ accommodation guide", editorial.hotels)), "Best Hotels in Auckland for Waterfront Luxury and Boutique Design", "Hotel-only Auckland guide covering The Hotel Britomart, Park Hyatt, QT, DeBrett, SO, Cordis, M Social, Fable, voco, and InterContinental."),
  guide("Stay", "list-auckland-hostels", "auckland-best-hostels", "best-hostels", "Auckland Hostels for Social Pods, Quiet Villas, and Central Beds", "This hostel-only selection separates calm garden stays, design pods, nightlife bases, working-traveler rooms, and large communal kitchens, with reception windows and late-arrival rules treated as booking essentials.", hostelStops, sourcesFor(hostelStops, source("Hostelworld Auckland inventory", editorial.hostels)), "Best Hostels in Auckland for Solo Travelers and Budget Stays", "Current hostel-only Auckland guide to Verandahs, LyLo, JO&JOE, Attic, Newton Lodge, both Haka Houses, United, Hobson Lodge, and The Y."),
  guide("Nightlife", "list-auckland-casual-bars", "auckland-best-pubs-and-casual-bars", "best-pubs-and-casual-bars", "Auckland Pubs, Live Rooms, and Easy Late Bars", "A low-ceremony Auckland night can mean Belgian beer in a heritage lane, real ale, a courtyard tavern, underground bands, open-mic rock, sports, or a late Ponsonby local.", pubStops, sourcesFor(pubStops, source("AucklandNZ bar and nightlife inventory", editorial.pubs)), "Best Pubs and Casual Bars in Auckland for Beer, Music, and Late Nights", "Ten current Auckland pubs and casual bars spanning Galbraith's, the Occidental, Whammy, Portland Public House, Ponsonby locals, courtyards, and live music."),
  guide("Nightlife", "list-auckland-cocktail-bars", "auckland-best-cocktail-bars", "best-cocktail-bars", "Auckland Cocktails from Basement Precision to Harbour Views", "Auckland's serious cocktail circuit moves between menu-free basement bars, experimental local ingredients, jazz lounges, rooftops, hotel views, vinyl listening, and tiny neighborhood institutions.", cocktailStops, sourcesFor(cocktailStops, source("Heart of the City cocktail-bar guide", editorial.cocktails)), "Best Cocktail Bars in Auckland for Creative Drinks and Distinctive Rooms", "Source-backed Auckland cocktail guide to Caretaker, Deadshot, Pineapple, Panacea, Truth or Dare, Little Culprit, Churchill, Bellini, Lime, and Kemuri."),
  guide("Culture", "list-auckland-culture", "auckland-best-culture", "best-culture", "Auckland Culture through Taonga, Art, Technology, and the Sea", "Ten institutions read Tāmaki Makaurau through Māori and Pacific taonga, visual art, maritime history, technology, astronomy, living history, military memory, architecture, and ambitious contemporary exhibitions.", cultureStops, sourcesFor(cultureStops, source("AucklandNZ arts, culture, and heritage guide", editorial.culture)), "Best Culture in Auckland for Museums, Galleries, and Māori Heritage", "A source-backed Auckland culture guide with current hours for the Auckland Museum, Art Gallery, Maritime Museum, MOTAT, Stardome, Te Uru, and more."),
  guide("Activities", "list-auckland-things-to-do", "auckland-best-things-to-do", "best-things-to-do", "Auckland Things to Do across Volcanoes, Islands, and Harbours", "The best first-trip Auckland experiences use its geography: volcanic cones, wildlife islands, harbour sailing, ferry-linked walks, marine life, skyline views, and a cross-city route between two coasts.", activityStops, sourcesFor(activityStops, source("Time Out Auckland things-to-do guide", editorial.activities)), "Top Things to Do in Auckland for Islands, Volcanoes, and Harbour Views", "Ten source-backed Auckland experiences with current access details, including Rangitoto, Tiritiri Matangi, Sky Tower, the zoo, Maungawhau, Waiheke, and harbour sailing."),
];
