import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

const createdAt = "2026-08-12T00:00:00.000Z";
const checkedAt = "2026-08-12";

const wellingtonLocation = {
  city: "Wellington",
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
  return (
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">' +
        '<rect width="160" height="160" rx="80" fill="#' +
        colors[category] +
        '" />' +
        '<text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="76" font-weight="700" fill="white">R</text></svg>',
    )
  );
}

function maps(query: string) {
  return (
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(query)
  );
}

function commons(fileName: string) {
  return (
    "https://commons.wikimedia.org/wiki/Special:FilePath/" +
    encodeURIComponent(fileName) +
    "?width=1600"
  );
}

function foodGuide(slug: string) {
  return "https://foodguide.nz/og/wellington/" + slug + ".png";
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
  const mapUrl =
    sourceEvidence?.mapUrl ??
    maps(mapQuery ?? name + " Wellington New Zealand");
  const sourceUrls = [
    officialUrl,
    bookingUrl,
    mapUrl,
    sourcePhoto,
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
    imageSourceName: "Official, editorial, or licensed venue image",
    sourceUrls: [...new Set(sourceUrls)],
    sourceEvidence: {
      officialUrl,
      mapUrl,
      currentStatusUrl: sourceEvidence?.currentStatusUrl ?? officialUrl,
      imageSourceUrl: sourcePhoto,
      editorialUrls,
      checkedAt,
      notes:
        "Official hours, current operation, map location, and venue-specific media checked on 2026-08-12.",
      ...sourceEvidence,
    },
    officialUrl,
    ...(bookingUrl ? { bookingUrl } : {}),
    ...(rest.price
      ? {
          priceSource:
            priceSource ??
            "Official or current property page, checked " + checkedAt + ".",
        }
      : {}),
    ...rest,
  };
}

const editorial = {
  dining:
    "https://www.theurbanlist.com/new-zealand/a-list/best-restaurants-wellington",
  cheap: "https://www.klook.com/blog/wellington-affordable-eats/",
  hotels: "https://www.theurbanlist.com/wellington/a-list/hotels-wellington",
  hostels:
    "https://www.hostelworld.com/hostels/oceania/new-zealand/wellington/",
  pubs: "https://www.wellingtonnz.com/visit/eat-and-drink/craft-beer",
  cocktails: "https://www.theurbanlist.com/new-zealand/a-list/bars-wellington",
  culture:
    "https://www.wellingtonnz.com/visit/live-like-a-local/arts-and-culture-guide",
  activities:
    "https://www.wellingtonnz.com/visit/see-and-do/top-10-wellington-must-dos",
};

const diningStops: GuideStop[] = [
  stop(
    "wellington-dining-logan-brown",
    "Logan Brown",
    [-41.2948332, 174.7746896],
    "A domed former bank chamber frames polished New Zealand cooking built around Māori ingredients, regional produce, and three decades of Wellington hospitality.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["New Zealand", "Contemporary", "Māori ingredients"],
      attributeTags: [
        "destination_dining",
        "heritage",
        "local_produce",
        "reservation_recommended",
      ],
      price: "$$$$",
      hours: {
        mon: "Closed",
        tue: "Closed",
        wed: "5:00 PM-late",
        thu: "5:00 PM-late",
        fri: "12:00 PM-late",
        sat: "5:00 PM-late",
        sun: "5:00 PM-late",
      },
      officialUrl: "https://www.loganbrown.co.nz/logan-brown-wellington",
      bookingUrl: "https://www.loganbrown.co.nz/reservations",
      sourcePhoto:
        "https://www.loganbrown.co.nz/images/2000/700/contact-logan-brown-700?h=1352bf4a",
      editorialUrls: [
        editorial.dining,
        "https://www.wellingtonnz.com/visit/eat-and-drink/michelin-guide",
      ],
    },
  ),
  stop(
    "wellington-dining-ortega",
    "Ortega Fish Shack",
    [-41.2943754, 174.7848526],
    "Ortega pairs a warm, nautical dining room with market fish, careful seafood cooking, and one of the city's most useful broad wine lists.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Seafood", "New Zealand", "European"],
      attributeTags: [
        "seafood",
        "date_night",
        "wine_list",
        "reservation_recommended",
      ],
      price: "$$$$",
      hours: {
        mon: "Closed",
        tue: "5:00 PM-late",
        wed: "5:00 PM-late",
        thu: "5:00 PM-late",
        fri: "5:00 PM-late",
        sat: "5:00 PM-late",
        sun: "Closed",
      },
      officialUrl: "https://www.ortega.co.nz/contact.html",
      bookingUrl: "https://www.ortega.co.nz/reservations.html",
      sourcePhoto:
        "https://www.ortega.co.nz/uploads/1/0/4/1/104146336/ortega-72.jpg",
      editorialUrls: [editorial.dining],
    },
  ),
  stop(
    "wellington-dining-jano",
    "Jano Bistro",
    [-41.2946533, 174.7714616],
    "Pierre-Alain Fenoux's small yellow cottage uses fire, foraging, fermentation, and close farm relationships to shape highly personal tasting menus.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["New Zealand", "French", "Degustation"],
      attributeTags: [
        "tasting_menu",
        "farm_to_table",
        "heritage",
        "reservation_required",
      ],
      price: "$$$$",
      hours: {
        mon: "Closed",
        tue: "Closed",
        wed: "5:30 PM-11:00 PM",
        thu: "5:30 PM-11:00 PM",
        fri: "5:30 PM-11:00 PM",
        sat: "5:30 PM-11:00 PM",
        sun: "Closed",
      },
      officialUrl: "https://www.janobistro.co.nz/contact",
      bookingUrl: "https://www.janobistro.co.nz/book",
      sourcePhoto: foodGuide("jano-bistro"),
      editorialUrls: [editorial.dining],
    },
  ),
  stop(
    "wellington-dining-koji",
    "Koji",
    [-41.2943325, 174.784717],
    "Koji layers smoke, pickling, and fermentation over Asian flavours and New Zealand produce rather than narrowing itself to one national cuisine.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Asian", "New Zealand", "Contemporary"],
      attributeTags: [
        "sharing_plates",
        "fermentation",
        "date_night",
        "reservation_recommended",
      ],
      price: "$$$",
      hours: {
        mon: "5:00 PM-late",
        tue: "5:00 PM-late",
        wed: "5:00 PM-late",
        thu: "5:00 PM-late",
        fri: "11:30 AM-2:30 PM and 5:00 PM-late",
        sat: "11:30 AM-2:30 PM and 5:00 PM-late",
        sun: "Closed",
      },
      officialUrl: "https://kojirestaurant.co.nz/visit/",
      bookingUrl: "https://kojirestaurant.co.nz/book/",
      sourcePhoto: foodGuide("koji"),
      editorialUrls: [editorial.dining],
    },
  ),
  stop(
    "wellington-dining-highwater",
    "Highwater Eatery",
    [-41.2907427, 174.776939],
    "An owner-operated room makes bread, ferments, and much else in-house, cooking sustainably sourced produce over charcoal in a calm all-day space.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["New Zealand", "Contemporary", "Fire cooking"],
      attributeTags: [
        "sustainable_sourcing",
        "fire_cooking",
        "local_produce",
        "reservation_recommended",
      ],
      price: "$$$",
      hours: {
        mon: "Closed",
        tue: "5:00 PM-late",
        wed: "5:00 PM-late",
        thu: "5:00 PM-late",
        fri: "5:00 PM-late",
        sat: "11:00 AM-late",
        sun: "Closed",
      },
      officialUrl: "https://www.highwatereatery.co.nz/reservations",
      bookingUrl: "https://www.highwatereatery.co.nz/reservations",
      sourcePhoto:
        "https://images.squarespace-cdn.com/content/v1/5c9c83fd755be24f58fc322f/1564131156819-OYHX7RSRIO71GKXZWESI/bar-dayshot-1200px.jpg",
      editorialUrls: [editorial.dining],
    },
  ),
  stop(
    "wellington-dining-kisa",
    "Kisa",
    [-41.2947267, 174.7751173],
    "Kisa drives generous Middle Eastern sharing plates through a Josper and mangal, using New Zealand vegetables, seafood, and meat without sanding away the smoke.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Middle Eastern", "New Zealand", "Grill"],
      attributeTags: [
        "sharing_plates",
        "fire_cooking",
        "group_friendly",
        "lively_food",
      ],
      price: "$$$",
      hours: {
        mon: "4:00 PM-10:00 PM",
        tue: "4:00 PM-10:00 PM",
        wed: "12:00 PM-10:00 PM",
        thu: "12:00 PM-10:00 PM",
        fri: "12:00 PM-10:30 PM",
        sat: "11:30 AM-10:30 PM",
        sun: "11:30 AM-10:00 PM",
      },
      officialUrl: "https://kisarestaurant.co.nz/",
      bookingUrl: "https://kisarestaurant.co.nz/bookings/",
      sourcePhoto:
        "https://framerusercontent.com/images/1V0vEi3Doq3IljAVBlRCHvpL2A.jpg?width=1920&height=1280",
      editorialUrls: [
        editorial.dining,
        "https://restaurantguru.com/Kisa-Wellington",
      ],
    },
  ),
  stop(
    "wellington-dining-damascus",
    "Damascus",
    [-41.2955022, 174.7798037],
    "Damascus turns a family's Syrian recipes into bright mezze, crisp falafel, grilled meats, and the market food that first built its Wellington following.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Syrian", "Middle Eastern", "Mezze"],
      attributeTags: [
        "family_run",
        "sharing_plates",
        "vegetarian_friendly",
        "reservation_recommended",
      ],
      price: "$$$",
      hours: {
        mon: "Closed",
        tue: "Closed",
        wed: "5:00 PM-late",
        thu: "5:00 PM-late",
        fri: "5:00 PM-late",
        sat: "12:00 PM-2:00 PM and 5:00 PM-late",
        sun: "Closed",
      },
      officialUrl: "https://www.damascusnz.com/",
      bookingUrl: "https://www.damascusnz.com/bookings",
      sourcePhoto: foodGuide("damascus"),
      editorialUrls: [editorial.dining],
    },
  ),
  stop(
    "wellington-dining-ombra",
    "Ombra",
    [-41.2948954, 174.7749712],
    "Ombra models a Venetian bacaro through cicchetti, spritzes, risotto, polenta, and a useful walk-in allocation that keeps the room informal.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Italian", "Venetian", "Small plates"],
      attributeTags: [
        "sharing_plates",
        "walk_in_friendly",
        "aperitivo",
        "lively_food",
      ],
      price: "$$$",
      hours: {
        mon: "12:00 PM-9:00 PM",
        tue: "4:00 PM-9:00 PM",
        wed: "12:00 PM-9:00 PM",
        thu: "12:00 PM-9:00 PM",
        fri: "12:00 PM-9:30 PM",
        sat: "12:00 PM-9:30 PM",
        sun: "12:00 PM-9:00 PM",
      },
      officialUrl: "https://www.ombra.co.nz/",
      bookingUrl: "https://www.ombra.co.nz/book",
      sourcePhoto: foodGuide("ombra"),
      editorialUrls: [editorial.dining],
    },
  ),
  stop(
    "wellington-dining-charley-noble",
    "Charley Noble",
    [-41.2851125, 174.7775437],
    "An open wood fire anchors this large central dining room, giving local seafood, vegetables, and meat a direct line through smoke and char.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["New Zealand", "Seafood", "Wood-fired"],
      attributeTags: [
        "fire_cooking",
        "central",
        "group_friendly",
        "business_lunch",
      ],
      price: "$$$$",
      hours: {
        mon: "11:30 AM-late",
        tue: "11:30 AM-late",
        wed: "11:30 AM-late",
        thu: "11:30 AM-late",
        fri: "11:30 AM-late",
        sat: "5:00 PM-late",
        sun: "5:00 PM-late",
      },
      officialUrl: "https://www.charleynoble.co.nz/who-we-are",
      bookingUrl: "https://www.charleynoble.co.nz/book-a-table",
      sourcePhoto:
        "https://images.squarespace-cdn.com/content/v1/5d6b39018a813e0001f8e692/d2fc4675-f1c7-4e74-a6f4-318ff0a89afb/FDC06A65-035F-47DB-BA91-00778ECD244A.JPG",
      editorialUrls: [editorial.dining],
    },
  ),
  stop(
    "wellington-dining-supra",
    "Supra",
    [-41.2922269, 174.777758],
    "This tiny natural-wine room fits Georgian and wider regional influences around an 18-seat counter, a Josper grill, and a short menu that changes often.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Georgian", "New Zealand", "Contemporary"],
      attributeTags: [
        "natural_wine",
        "small_room",
        "fire_cooking",
        "reservation_recommended",
      ],
      price: "$$$",
      hours: {
        mon: "Closed",
        tue: "5:00 PM-9:00 PM",
        wed: "5:00 PM-9:00 PM",
        thu: "5:00 PM-9:00 PM",
        fri: "5:00 PM-10:30 PM",
        sat: "5:00 PM-10:30 PM",
        sun: "Closed",
      },
      officialUrl: "https://suprarestaurant.co.nz/",
      bookingUrl: "https://suprarestaurant.co.nz/bookings",
      sourcePhoto:
        "https://img1.wsimg.com/isteam/ip/5200ca7f-8919-43c5-b653-aedd59a8ea32/IMG_9821.jpeg",
      editorialUrls: [
        editorial.dining,
        "https://neatplaces.co.nz/places/wellington/eat-drink/supra",
      ],
    },
  ),
];

const cheapEatStops: GuideStop[] = [
  stop(
    "wellington-cheap-kc-cafe",
    "KC Café & Takeaway",
    [-41.2937771, 174.781745],
    "KC's enormous Cantonese and Malaysian-leaning menu, fast wok cooking, roast meats, and late service make it a durable Courtenay Place value anchor.",
    {
      venueKind: "food_drink",
      foodServiceType: "fast_casual",
      cuisineTypes: ["Cantonese", "Chinese", "Malaysian"],
      attributeTags: [
        "budget_food",
        "late_food",
        "group_friendly",
        "quick_bite",
      ],
      price: "$",
      hours: { default: "Daily 11:00 AM-10:00 PM." },
      officialUrl: "https://www.kccafeandtakeaway.co.nz/",
      sourcePhoto: foodGuide("k-c-cafe-takeaway"),
      editorialUrls: [editorial.cheap],
    },
  ),
  stop(
    "wellington-cheap-taste-home",
    "A Taste of Home",
    [-41.2951296, 174.7763855],
    "A compact Vivian Street counter focuses on chewy hand-pulled noodles, cumin lamb, chile oil, and deeply savoury Chinese comfort food.",
    {
      venueKind: "food_drink",
      foodServiceType: "counter_service",
      cuisineTypes: ["Chinese", "Hand-pulled noodles"],
      attributeTags: ["budget_food", "noodles", "quick_bite", "spicy_food"],
      price: "$",
      hours: {
        mon: "Closed",
        tue: "11:30 AM-2:30 PM and 5:00 PM-8:00 PM",
        wed: "11:30 AM-2:30 PM and 5:00 PM-8:00 PM",
        thu: "11:30 AM-2:30 PM and 5:00 PM-8:00 PM",
        fri: "11:30 AM-2:30 PM and 5:00 PM-8:00 PM",
        sat: "11:30 AM-2:30 PM and 5:00 PM-8:00 PM",
        sun: "Closed",
      },
      officialUrl: "https://tasteofhome.co.nz/pages/delivery",
      sourcePhoto:
        "https://tasteofhome.co.nz/cdn/shop/files/Header_taste_of_home_copy_3ff63540-b677-4100-8e91-8ab49224d69a.jpg?v=1746083453",
      editorialUrls: [editorial.cheap],
    },
  ),
  stop(
    "wellington-cheap-soul-shack",
    "Soul Shack",
    [-41.2906542, 174.7753906],
    "Rick Traylor's Nashville-style chicken comes in clearly marked heat levels, backed by pickles, white bread, waffles, and proper Southern sides.",
    {
      venueKind: "food_drink",
      foodServiceType: "fast_casual",
      cuisineTypes: ["American", "Nashville hot chicken"],
      attributeTags: ["budget_food", "fried_chicken", "spicy_food", "takeaway"],
      price: "$$",
      hours: {
        mon: "11:30 AM-2:30 PM and 4:30 PM-9:00 PM",
        tue: "11:30 AM-2:30 PM and 4:30 PM-9:00 PM",
        wed: "11:30 AM-2:30 PM and 4:30 PM-9:00 PM",
        thu: "11:30 AM-2:30 PM and 4:30 PM-9:00 PM",
        fri: "11:30 AM-9:00 PM",
        sat: "11:30 AM-9:00 PM",
        sun: "4:30 PM-9:00 PM",
      },
      officialUrl: "https://soulshackhotchicken.co.nz/",
      sourcePhoto: foodGuide("soul-shack"),
      editorialUrls: [
        editorial.cheap,
        "https://www.wellingtonnz.com/visit/eat-and-drink",
      ],
    },
  ),
  stop(
    "wellington-cheap-satay-kingdom",
    "Satay Kingdom",
    [-41.2925, 174.7752778],
    "Hidden in the Left Bank arcade, this Malaysian institution keeps laksa, nasi goreng, roti, and smoky satay inexpensive and reliably fast.",
    {
      venueKind: "food_drink",
      foodServiceType: "fast_casual",
      cuisineTypes: ["Malaysian", "Satay", "Laksa"],
      attributeTags: ["budget_food", "street_food", "quick_bite", "central"],
      price: "$",
      hours: {
        mon: "11:00 AM-9:00 PM",
        tue: "11:00 AM-9:00 PM",
        wed: "11:00 AM-9:00 PM",
        thu: "11:00 AM-9:00 PM",
        fri: "11:00 AM-9:30 PM",
        sat: "11:00 AM-9:00 PM",
        sun: "11:00 AM-9:00 PM",
      },
      officialUrl: "https://www.sataykingdomcafe.co.nz/",
      sourcePhoto: foodGuide("satay-kingdom-cafe"),
      editorialUrls: [editorial.cheap],
    },
  ),
  stop(
    "wellington-cheap-pizza-pomodoro",
    "Pizza Pomodoro",
    [-41.292533, 174.7768129],
    "The narrow Leeds Street kitchen turns out thin, blistered Neapolitan-style pizzas with a focused topping list and straightforward takeaway value.",
    {
      venueKind: "food_drink",
      foodServiceType: "counter_service",
      cuisineTypes: ["Italian", "Pizza"],
      attributeTags: [
        "budget_food",
        "pizza",
        "takeaway",
        "vegetarian_friendly",
      ],
      price: "$$",
      hours: {
        mon: "Closed",
        tue: "12:00 PM-9:00 PM",
        wed: "12:00 PM-9:00 PM",
        thu: "12:00 PM-9:00 PM",
        fri: "12:00 PM-9:00 PM",
        sat: "1:00 PM-9:00 PM",
        sun: "Closed",
      },
      officialUrl: "https://www.pizzapomodoro.co.nz/faqs",
      sourcePhoto: foodGuide("pizza-pomodoro"),
      editorialUrls: [editorial.cheap],
    },
  ),
  stop(
    "wellington-cheap-macha",
    "Macha Jom Tapau",
    [-41.2924392, 174.775501],
    "Macha Jom Tapau concentrates Malaysian street-food energy into nasi lemak, curries, fried chicken, and roti from a tiny Left Bank room.",
    {
      venueKind: "food_drink",
      foodServiceType: "fast_casual",
      cuisineTypes: ["Malaysian", "Street food"],
      attributeTags: ["budget_food", "street_food", "quick_bite", "takeaway"],
      price: "$",
      hours: {
        mon: "11:30 AM-8:30 PM",
        tue: "11:30 AM-8:30 PM",
        wed: "11:30 AM-8:30 PM",
        thu: "11:30 AM-8:30 PM",
        fri: "11:30 AM-8:30 PM",
        sat: "11:30 AM-8:30 PM",
        sun: "11:30 AM-4:30 PM",
      },
      officialUrl: "https://www.machajomtapau.co.nz/",
      sourcePhoto: foodGuide("macha-jom-tapau"),
      editorialUrls: [editorial.cheap],
    },
  ),
  stop(
    "wellington-cheap-basin-noodle",
    "Basin Noodle House",
    [-41.3019804, 174.7793806],
    "Near the cricket ground, Basin Noodle House is strongest on dumplings, chile-oil noodles, lamb, and substantial northern Chinese plates.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Chinese", "Dumplings", "Noodles"],
      attributeTags: ["budget_food", "dumplings", "noodles", "local_favorite"],
      price: "$",
      hours: {
        mon: "Closed",
        tue: "11:00 AM-3:00 PM and 5:00 PM-9:00 PM",
        wed: "11:00 AM-3:00 PM and 5:00 PM-9:00 PM",
        thu: "11:00 AM-3:00 PM and 5:00 PM-9:00 PM",
        fri: "11:00 AM-3:00 PM and 5:00 PM-9:00 PM",
        sat: "11:00 AM-3:00 PM and 5:00 PM-9:00 PM",
        sun: "5:00 PM-9:00 PM",
      },
      officialUrl: "https://foodguide.nz/wellington/basin-noodle-house/",
      sourcePhoto: foodGuide("basin-noodle-house"),
      editorialUrls: [editorial.cheap],
    },
  ),
  stop(
    "wellington-cheap-puku-pies",
    "Puku Pies Grey Street",
    [-41.2849484, 174.7764087],
    "Puku gives the New Zealand pie a polished but still practical treatment, with flaky pastry around braised meat, seafood, and vegetarian fillings.",
    {
      venueKind: "food_drink",
      foodServiceType: "bakery",
      cuisineTypes: ["New Zealand", "Bakery", "Pies"],
      attributeTags: ["budget_food", "breakfast", "takeaway", "quick_bite"],
      price: "$",
      hours: {
        mon: "7:00 AM-4:00 PM",
        tue: "7:00 AM-4:00 PM",
        wed: "7:00 AM-4:00 PM",
        thu: "7:00 AM-4:00 PM",
        fri: "7:00 AM-4:00 PM",
        sat: "8:00 AM-4:00 PM",
        sun: "8:00 AM-4:00 PM",
      },
      officialUrl: "https://www.pukupies.co.nz/",
      sourcePhoto:
        "https://images.squarespace-cdn.com/content/v1/67897bf84d55fd07d646442d/15f77dd2-1d90-42c1-841f-69b465342dc8/IMG_6192+2.JPG",
      editorialUrls: [editorial.cheap],
    },
  ),
  stop(
    "wellington-cheap-mother-coffee",
    "Mother of Coffee",
    [-41.2924275, 174.7751141],
    "Injera carries Ethiopian stews, lentils, greens, and chile across large shared platters, with strong vegetarian value in the Left Bank arcade.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Ethiopian", "East African"],
      attributeTags: [
        "budget_food",
        "vegetarian_friendly",
        "sharing_plates",
        "central",
      ],
      price: "$$",
      hours: {
        mon: "Closed",
        tue: "5:00 PM-9:30 PM",
        wed: "12:30 PM-11:00 PM",
        thu: "12:30 PM-10:00 PM",
        fri: "5:00 PM-10:00 PM",
        sat: "12:30 PM-10:00 PM",
        sun: "Closed",
      },
      officialUrl: "https://motherofcoffee.co.nz/",
      sourcePhoto: foodGuide("mother-of-coffee"),
      editorialUrls: [
        editorial.cheap,
        "https://foodguide.nz/wellington/mother-of-coffee/",
      ],
      sourceEvidence: {
        currentStatusUrl: "https://foodguide.nz/wellington/mother-of-coffee/",
        notes:
          "Current weekly hours are taken from the active FoodGuide listing because the official landing page does not publish a complete timetable; checked 2026-08-12.",
      },
    },
  ),
  stop(
    "wellington-cheap-ramen-shop",
    "The Ramen Shop Newtown",
    [-41.3141069, 174.7800879],
    "Newtown's compact ramen specialist makes broths and noodles the centre of a menu rounded out by gyoza, karaage, and vegetarian bowls.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["Japanese", "Ramen"],
      attributeTags: [
        "budget_food",
        "ramen",
        "local_favorite",
        "vegetarian_friendly",
      ],
      price: "$$",
      hours: { default: "Daily 11:30 AM-9:00 PM." },
      officialUrl: "https://theramenshop.co.nz/",
      sourcePhoto:
        "https://theramenshop.co.nz/wp-content/uploads/2021/11/ramen-shop-main-image-1024x1024.jpg",
      editorialUrls: [editorial.cheap],
    },
  ),
];

const hotelStops: GuideStop[] = [
  stop(
    "wellington-hotel-intrepid",
    "The Intrepid Hotel",
    [-41.2929152, 174.7752734],
    "Eighteen rooms in a restored Cuba-quarter building trade full-service scale for strong design, a library-like lounge, and the excellent Puffin wine bar downstairs.",
    {
      category: "Stay",
      subcategory: "boutique_hotel",
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["boutique", "design", "central", "wine_bar", "heritage"],
      price: "$$$",
      hours: {
        default:
          "Guest access daily; staffed check-in 3:00 PM-5:00 PM and check-out by 11:00 AM; after-hours arrival follows the property's booking instructions.",
      },
      officialUrl: "https://www.theintrepidhotel.com/",
      bookingUrl:
        "https://www.booking.com/hotel/nz/the-intrepid-wellington.en-gb.html",
      sourcePhoto:
        "https://images.squarespace-cdn.com/content/v1/5f0fa92edec85004bb9d965b/d46cce33-2cc4-4377-8c41-35cf043b24d4/IMG_1906.jpg",
      editorialUrls: [editorial.hotels],
    },
  ),
  stop(
    "wellington-hotel-naumi",
    "Naumi Hotel Wellington",
    [-41.2952707, 174.7749555],
    "Naumi layers saturated colour, local art, Lola Rouge dining, and pool access into a theatrical Cuba Street base that suits travellers who prefer personality to restraint.",
    {
      category: "Stay",
      subcategory: "design_hotel",
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["design", "art", "pool", "central", "restaurant"],
      price: "$$$",
      hours: {
        default:
          "Front desk open 24 hours daily; check-in from 3:00 PM and check-out by 10:00 AM.",
      },
      officialUrl: "https://www.naumihotels.com/naumi-hotel-wellington",
      bookingUrl:
        "https://www.booking.com/hotel/nz/cq-quality-hotel-wellington.en-gb.html",
      sourcePhoto:
        "https://d18slle4wlf9ku.cloudfront.net/naumihotels.com-1365503697/cms/cache/v2/68d26d1032ea6.png/1200x630/fit/80/2a9d802e5728c142d485cc1cd34ca5b4.png",
      editorialUrls: [editorial.hotels],
    },
  ),
  stop(
    "wellington-hotel-qt",
    "QT Wellington",
    [-41.2918623, 174.7827025],
    "Across from Te Papa, QT combines a substantial private art collection, a darkly theatrical lobby, an indoor pool, and a genuinely useful waterfront position.",
    {
      category: "Stay",
      subcategory: "design_hotel",
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["art", "design", "pool", "waterfront", "central"],
      price: "$$$$",
      hours: {
        default:
          "Front desk open 24 hours daily; check-in from 3:00 PM and check-out by 10:00 AM.",
      },
      officialUrl: "https://www.qthotels.com/wellington/",
      bookingUrl: "https://www.booking.com/hotel/nz/museum.en-gb.html",
      sourcePhoto:
        "https://cdn.qthotels.com/wp-content/uploads/sites/103/2020/03/16154331/QTMW-Exterior-Hero-2-MB-1-2080x1120.jpg",
      editorialUrls: [editorial.hotels],
    },
  ),
  stop(
    "wellington-hotel-bolton",
    "Bolton Hotel",
    [-41.2792887, 174.7747345],
    "Beside Parliament and the Botanic Garden, Bolton's studios and suites add kitchens, an indoor lap pool, and a quieter business-district position.",
    {
      category: "Stay",
      subcategory: "apartment_hotel",
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["suites", "kitchen", "pool", "quiet", "central"],
      price: "$$$$",
      hours: {
        default:
          "Front desk open 24 hours daily; check-in from 3:00 PM and check-out by 11:00 AM.",
      },
      officialUrl: "https://www.boltonhotel.co.nz/",
      bookingUrl: "https://www.booking.com/hotel/nz/bolton.en-gb.html",
      sourcePhoto:
        "https://bolton-web.s3.ap-southeast-2.amazonaws.com/public/Uploads/bolton-hotel-alt.jpg",
      editorialUrls: [editorial.hotels],
    },
  ),
  stop(
    "wellington-hotel-intercontinental",
    "InterContinental Wellington",
    [-41.28453, 174.7767999],
    "A harbour-edge downtown address, indoor pool, club lounge, and broad room inventory make this the practical full-service choice for short central stays.",
    {
      category: "Stay",
      subcategory: "luxury_hotel",
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["luxury", "pool", "harbour", "club_lounge", "central"],
      price: "$$$$",
      hours: {
        default:
          "Front desk open 24 hours daily; check-in from 3:00 PM and check-out by 11:00 AM.",
      },
      officialUrl: "https://wellington.intercontinental.com/",
      bookingUrl:
        "https://www.booking.com/hotel/nz/intercontinental-wellington.en-gb.html",
      sourcePhoto:
        "https://d6iw278enlcdh.cloudfront.net/wellington.intercontinental.com-1721584214/cms/cache/v2/6a3b36e46bba9.jpg/1200x630/fit;c:368,0,1448,1080/80/632ee41ddccd6f6ead2f958c76dbec11.jpg",
      editorialUrls: [editorial.hotels],
    },
  ),
  stop(
    "wellington-hotel-ohtel",
    "Ohtel Wellington",
    [-41.2923006, 174.786184],
    "Ohtel's small set of individually composed mid-century rooms gives Oriental Bay a more intimate design stay within an easy waterfront walk of the centre.",
    {
      category: "Stay",
      subcategory: "boutique_hotel",
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["boutique", "design", "waterfront", "quiet", "walkable"],
      price: "$$$$",
      hours: {
        default:
          "Reception daily 7:00 AM-10:00 PM; check-in from 2:00 PM and check-out by 11:00 AM; late arrival requires property instructions.",
      },
      officialUrl: "https://ohtel.nz/wellington/",
      bookingUrl: "https://www.booking.com/hotel/nz/ohtel.en-gb.html",
      sourcePhoto:
        "https://ohtel.nz/wp-content/uploads/2023/07/KP9915-WEB-1024x683.jpg",
      editorialUrls: [editorial.hotels],
    },
  ),
  stop(
    "wellington-hotel-cobbler",
    "The Cobbler Hotel",
    [-41.2923265, 174.7773662],
    "A former shoe factory now holds handsome apartment-style rooms with kitchens, exposed structure, and a tucked-away laneway entrance off Hannahs Laneway.",
    {
      category: "Stay",
      subcategory: "apartment_hotel",
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: [
        "boutique",
        "kitchen",
        "heritage",
        "central",
        "self_check_in",
      ],
      price: "$$$",
      hours: {
        default:
          "Guest access daily through virtual reception; check-in from 3:00 PM and check-out by 10:00 AM, with staffed support next door and after-hours instructions in the booking confirmation.",
      },
      officialUrl: "https://www.thecobblerhotel.co.nz/",
      bookingUrl: "https://www.booking.com/hotel/nz/the-cobbler.en-gb.html",
      sourcePhoto:
        "https://images.squarespace-cdn.com/content/v1/63c3342e4a14a311024d7117/3bc92eca-505d-40b8-b8ee-5ac93d95a05a/DSC03394.jpg",
      editorialUrls: [editorial.hotels],
    },
  ),
  stop(
    "wellington-hotel-tryp",
    "TRYP by Wyndham Wellington",
    [-41.2929086, 174.7817866],
    "Inside a restored 1925 building, TRYP mixes Art Deco references with compact rooms, larger kitchen-equipped options, and unusually useful in-room laundry choices.",
    {
      category: "Stay",
      subcategory: "design_hotel",
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["heritage", "design", "kitchen", "laundry", "central"],
      price: "$$$",
      hours: {
        default:
          "Front desk open 24 hours daily; check-in from 3:00 PM and check-out by 10:00 AM.",
      },
      officialUrl: "https://trypwellington.co.nz/",
      bookingUrl:
        "https://www.booking.com/hotel/nz/tryp-by-wyndham-wellington-tory-street.en-gb.html",
      sourcePhoto:
        "https://trypwellington.co.nz/wp-content/uploads/2023/04/Tryp_Wellington_4k_v2-112-11.jpg",
      editorialUrls: [editorial.hotels],
    },
  ),
  stop(
    "wellington-hotel-movenpick",
    "Mövenpick Hotel Wellington",
    [-41.2938015, 174.7697464],
    "The Terrace hillside location buys broad city views, while the indoor pool, sauna, restaurant, and daily chocolate hour make the hotel work beyond the room.",
    {
      category: "Stay",
      subcategory: "full_service_hotel",
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: [
        "pool",
        "views",
        "family_friendly",
        "restaurant",
        "hillside",
      ],
      price: "$$$",
      hours: {
        default:
          "Front desk open 24 hours daily; check-in from 2:00 PM and check-out by 11:00 AM; daily chocolate hour follows the property's current programme.",
      },
      officialUrl:
        "https://movenpick.accor.com/en/australia-pacific/new-zealand/wellington/hotel-wellington.html",
      bookingUrl:
        "https://www.booking.com/hotel/nz/movenpick-wellington.en-gb.html",
      sourcePhoto: commons("Grand Mercure Wellington August 2020 03.jpg"),
      editorialUrls: [editorial.hotels],
    },
  ),
  stop(
    "wellington-hotel-sofitel",
    "Sofitel Wellington",
    [-41.279745, 174.7746984],
    "French styling, a polished restaurant, and a position between Parliament and the Botanic Garden suit travellers who want a quieter luxury base near the government quarter.",
    {
      category: "Stay",
      subcategory: "luxury_hotel",
      venueKind: "lodging",
      lodgingType: "hotel",
      attributeTags: ["luxury", "design", "restaurant", "quiet", "central"],
      price: "$$$$",
      hours: {
        default:
          "Front desk open 24 hours daily; check-in from 2:00 PM and check-out by 11:00 AM.",
      },
      officialUrl: "https://sofitel.accor.com/en/hotels/9051.html",
      bookingUrl:
        "https://www.booking.com/hotel/nz/sofitel-wellington.en-gb.html",
      sourcePhoto: "https://www.ahstatic.com/photos/9051_ho_00_p_1024x768.jpg",
      editorialUrls: [editorial.hotels],
    },
  ),
];

const hostelStops: GuideStop[] = [
  stop(
    "wellington-hostel-haka",
    "Haka House Wellington",
    [-41.293133, 174.7839102],
    "A modern central hostel balances privacy-curtained dorms, private rooms, a large kitchen, and social common space without building the whole stay around parties.",
    {
      category: "Stay",
      subcategory: "hostel",
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: [
        "budget",
        "social",
        "central",
        "kitchen",
        "privacy_bunks",
      ],
      price: "$",
      hours: {
        default:
          "Reception and check-in daily 2:00 PM-11:00 PM; check-out by 10:00 AM; arrivals outside the window require property instructions.",
      },
      officialUrl: "https://hakahouse.com/wellington/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/317185/haka-house-wellington/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/317185/aq5ijv7p0yvihlvnzpzn.jpg",
      editorialUrls: [editorial.hostels],
    },
  ),
  stop(
    "wellington-hostel-trek-global",
    "Trek Global Backpackers",
    [-41.28895, 174.7729],
    "Trek Global is a large, sociable city hostel with mixed and female dorms, private rooms, multiple kitchens, a bar, and an outdoor deck.",
    {
      category: "Stay",
      subcategory: "hostel",
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "social", "central", "female_dorm", "kitchen"],
      price: "$",
      hours: {
        default:
          "Reception and check-in daily 2:00 PM-10:00 PM; check-out by 10:00 AM; late arrival must be arranged with the property.",
      },
      officialUrl: "https://trekglobalbackpackers.nz/",
      bookingUrl: "https://www.hostelworld.com/hostels/p/56883/trek-global/",
      sourcePhoto:
        "https://trekglobalbackpackers.nz/wp-content/uploads/2025/01/Exterior-Trek-Global-Backpackers-scaled.jpg",
      editorialUrls: [editorial.hostels],
    },
  ),
  stop(
    "wellington-hostel-marion",
    "The Marion Hostel",
    [-41.2942232, 174.7766114],
    "The Marion gives a small design hostel unusually thoughtful bunks, roof space, a polished kitchen, and a social atmosphere that remains calmer than a party property.",
    {
      category: "Stay",
      subcategory: "hostel",
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: [
        "budget",
        "design",
        "roof_terrace",
        "privacy_bunks",
        "solo_friendly",
      ],
      price: "$$",
      hours: {
        default:
          "Reception daily 6:30 AM-7:00 PM; check-in 2:00 PM-7:00 PM and check-out by 10:00 AM; late arrivals follow emailed access instructions.",
      },
      officialUrl: "https://www.themarionhostel.com/",
      bookingUrl: "https://www.hostelworld.com/hostels/p/287010/the-marion/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/287010/krzhdaef08aucxadx5lt.jpg",
      editorialUrls: [editorial.hostels],
    },
  ),
  stop(
    "wellington-hostel-worldwide",
    "Worldwide Backpackers",
    [-41.2911921, 174.771081],
    "This independent, compact hostel keeps the emphasis on a communal kitchen, courtyard, and smaller-scale social contact rather than tour-bus volume.",
    {
      category: "Stay",
      subcategory: "hostel",
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: [
        "budget",
        "independent",
        "kitchen",
        "courtyard",
        "solo_friendly",
      ],
      price: "$",
      hours: {
        default:
          "Check-in daily 2:00 PM-12:00 AM and check-out by 10:00 AM; exact reception cover and late access follow the property's arrival message.",
      },
      officialUrl: "https://www.worldwidebackpackers.co.nz/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/323159/worldwide-backpackers/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto%2Cq_auto%2Ct_40/propertyimages/3/323159/k3ofiloql5mnetckyvcx.jpg",
      editorialUrls: [editorial.hostels],
    },
  ),
  stop(
    "wellington-hostel-waterloo",
    "Hotel Waterloo & Backpackers",
    [-41.2803145, 174.7800478],
    "A large heritage property opposite the railway station offers dorms and private rooms; its strength is transit convenience, scale, and a full communal kitchen rather than boutique intimacy.",
    {
      category: "Stay",
      subcategory: "hostel",
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: [
        "budget",
        "heritage",
        "transit",
        "kitchen",
        "large_hostel",
      ],
      price: "$",
      hours: {
        default:
          "Reception open 24 hours daily; check-in 2:00 PM-11:00 PM and check-out by 10:00 AM.",
      },
      officialUrl: "https://www.hotelwaterloo.co.nz/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/1987/hotel-waterloo-and-backpackers/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/1/1987/mr1hietcuc6knsqrxqde.jpg",
      editorialUrls: [editorial.hostels],
    },
  ),
  stop(
    "wellington-hostel-cambridge",
    "The Cambridge Hotel & Backpackers",
    [-41.2951329, 174.7828783],
    "This 1883 pub-hotel mixes hostel dorms, simple private rooms, communal kitchens, and an active ground-floor bar close to Courtenay Place.",
    {
      category: "Stay",
      subcategory: "hostel",
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "heritage", "pub", "central", "kitchen"],
      price: "$",
      hours: {
        default:
          "Reception open 24 hours daily; check-in 2:00 PM-11:00 PM and check-out by 10:00 AM.",
      },
      officialUrl:
        "https://cambridgehotel.co.nz/cambridge-hotel-wellington/wellington-backpackers/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/36869/the-cambridge-hotel-and-backpackers/",
      sourcePhoto:
        "https://cambridgehotel.co.nz/wp-content/uploads/2024/08/cambridge-hotel-backpackers-carousel.jpg",
      editorialUrls: [editorial.hostels],
    },
  ),
  stop(
    "wellington-hostel-nomads",
    "Nomads Capital Backpackers",
    [-41.2896929, 174.7769071],
    "Nomads is a central, high-capacity social base with a bar, communal kitchen, dorms, and private rooms between the waterfront and Cuba Street.",
    {
      category: "Stay",
      subcategory: "hostel",
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "social", "bar", "central", "kitchen"],
      price: "$",
      hours: {
        default:
          "Reception open 24 hours daily; check-in from 2:00 PM and check-out by 10:00 AM.",
      },
      officialUrl: "https://nomadsworld.com/new-zealand/nomads-wellington/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/12490/capital-hostel-wellington/",
      sourcePhoto:
        "https://api.nomadsworld.com/wp-content/uploads/2017/08/nomads-capital-blend-bar.jpg",
      editorialUrls: [editorial.hostels],
    },
  ),
  stop(
    "wellington-hostel-rosemeres",
    "Rosemere Backpackers",
    [-41.2908793, 174.7725048],
    "A long-running, home-like hostel near Cuba Street offers dorms, female-only rooms, weekly rates, simple common areas, and a lower-key atmosphere.",
    {
      category: "Stay",
      subcategory: "hostel",
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "quiet", "female_dorm", "long_stay", "central"],
      price: "$",
      hours: {
        default:
          "Booking and arrival desk daily 8:00 AM-8:00 PM; late arrival must be arranged through the official booking enquiry before travel.",
      },
      officialUrl:
        "https://www.backpackerswellington.co.nz/hostel-accommodation-wellington/",
      bookingUrl: "https://www.backpackerswellington.co.nz/contact-booking.htm",
      sourcePhoto:
        "https://www.backpackerswellington.co.nz/images/backpackers-accommodation-wellington.jpg",
      editorialUrls: [editorial.hostels],
    },
  ),
  stop(
    "wellington-hostel-dwellington",
    "The Dwellington",
    [-41.2733734, 174.7793464],
    "The Dwellington uses a Thorndon villa setting, generous shared kitchens, a cinema room, tennis access, and design-conscious dorms to create a calmer stay.",
    {
      category: "Stay",
      subcategory: "hostel",
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: ["budget", "quiet", "design", "kitchen", "thorndon"],
      price: "$$",
      hours: {
        default:
          "Reception daily 6:30 AM-9:00 PM; check-in within the confirmed booking window and check-out by 10:00 AM; late arrival requires property instructions.",
      },
      officialUrl:
        "https://www.newzealand.com/us/plan/business/the-dwellington/",
      bookingUrl:
        "https://app-apac.thebookingbutton.com/properties/dwellingtondirect",
      sourcePhoto:
        "https://www.newzealand.com/assets/externally-managed-assets/tbd-assets/tbd-folder-10018557/img-1713750576-4926-1821549-tbd-asset__aWxvdmVrZWxseQo_CropResizeWzE5MDAsMTAwMCw3NSwianBnIl0.jpg",
      editorialUrls: [editorial.hostels],
    },
  ),
  stop(
    "wellington-hostel-house-pirie",
    "House of Pirie",
    [-41.298291, 174.7854168],
    "A small Mount Victoria property offers simple private and shared accommodation away from the busiest hostel cluster, within walking distance of Courtenay Place.",
    {
      category: "Stay",
      subcategory: "hostel",
      venueKind: "lodging",
      lodgingType: "hostel",
      attributeTags: [
        "budget",
        "quiet",
        "small_property",
        "walkable",
        "mount_victoria",
      ],
      price: "$",
      hours: {
        default:
          "Check-in daily 4:00 PM-11:00 PM and check-out 10:00 AM-11:00 AM; arrival details follow the active property booking page.",
      },
      officialUrl:
        "https://www.booking.com/hotel/nz/house-of-pirie-wellington.en-gb.html",
      bookingUrl:
        "https://www.booking.com/hotel/nz/house-of-pirie-wellington.en-gb.html",
      sourcePhoto:
        "https://hostel-house-of-pirie.wellingtonnzhotels.com/data/Imgs/1920x1080w/16227/1622771/1622771459/img-house-of-pirie-wellington-1.JPEG",
      editorialUrls: [editorial.hostels],
    },
  ),
];

const pubStops: GuideStop[] = [
  stop(
    "wellington-pub-welsh-dragon",
    "The Welsh Dragon Bar",
    [-41.2936799, 174.7840651],
    "A former public toilet has become Wellington's proudly Welsh pub, with red-dragon clutter, cask beer, live music, and a genuinely eccentric neighbourhood feel.",
    {
      venueKind: "nightlife",
      nightlifeType: "pub",
      foodServiceType: "pub",
      attributeTags: [
        "local_bar",
        "live_music",
        "heritage",
        "casual_nightlife",
      ],
      price: "$$",
      hours: {
        mon: "5:00 PM-3:00 AM",
        tue: "5:00 PM-3:00 AM",
        wed: "4:00 PM-3:00 AM",
        thu: "4:00 PM-3:00 AM",
        fri: "4:00 PM-3:00 AM",
        sat: "4:00 PM-3:00 AM",
        sun: "3:00 PM-3:00 AM",
      },
      officialUrl: "https://welshdragonbar.co.nz/",
      sourcePhoto:
        "https://static.wixstatic.com/media/c5a42c_a45fd88d0e6440189dcbd96f106a3b1e~mv2.jpg/v1/fill/w_1600,h_1000,al_c,q_85/c5a42c_a45fd88d0e6440189dcbd96f106a3b1e~mv2.jpg",
      editorialUrls: [
        editorial.pubs,
        "https://localista.co.nz/listing/the-welsh-dragon-bar?place=mount+victoria%2C+nz",
      ],
    },
  ),
  stop(
    "wellington-pub-rogue",
    "The Rogue & Vagabond",
    [-41.29336, 174.7745002],
    "Craft beer, dogs, pizza, and frequent live bands spill from this easy-going bar onto Glover Park, making it one of the city's least formal music rooms.",
    {
      venueKind: "nightlife",
      nightlifeType: "live_music_venue",
      foodServiceType: "pub",
      musicGenres: ["indie", "jazz", "rock"],
      attributeTags: [
        "craft_beer",
        "live_music",
        "outdoor_seating",
        "casual_nightlife",
      ],
      price: "$$",
      hours: {
        mon: "2:00 PM-10:00 PM",
        tue: "2:00 PM-1:00 AM",
        wed: "2:00 PM-1:00 AM",
        thu: "12:00 PM-1:00 AM",
        fri: "12:00 PM-3:00 AM",
        sat: "12:00 PM-3:00 AM",
        sun: "12:00 PM-1:00 AM",
      },
      officialUrl: "https://rogueandvagabond.co.nz/",
      sourcePhoto: foodGuide("the-rogue-vagabond"),
      editorialUrls: [
        editorial.pubs,
        "https://www.bestrestaurants.nz/north-island/wellington/te-aro/restaurant/the-rogue-and-vagabond",
      ],
    },
  ),
  stop(
    "wellington-pub-goldings",
    "Golding's Free Dive",
    [-41.2927839, 174.7770679],
    "Golding's treats beer with care but the room with humour: rotating independent taps, Star Wars debris, pizzas from next door, and no trace of beer-snob ceremony.",
    {
      venueKind: "nightlife",
      nightlifeType: "beer_bar",
      foodServiceType: "pub",
      attributeTags: ["craft_beer", "local_bar", "casual_nightlife", "central"],
      price: "$$",
      hours: {
        mon: "3:00 PM-11:00 PM",
        tue: "12:00 PM-11:00 PM",
        wed: "12:00 PM-11:00 PM",
        thu: "12:00 PM-11:00 PM",
        fri: "12:00 PM-12:00 AM",
        sat: "12:00 PM-12:00 AM",
        sun: "12:00 PM-11:00 PM",
      },
      officialUrl: "https://goldingsfreedive.co.nz/",
      sourcePhoto: foodGuide("goldings-free-dive"),
      editorialUrls: [
        editorial.pubs,
        "https://neatplaces.co.nz/places/wellington/eat-drink/goldings-free-dive-bar",
      ],
    },
  ),
  stop(
    "wellington-pub-parrotdog",
    "Parrotdog Bar",
    [-41.3273056, 174.8001291],
    "Parrotdog's Lyall Bay home combines the brewery's full range with a large timber hall, sunny garden, burgers, and enough space for families and groups.",
    {
      venueKind: "nightlife",
      nightlifeType: "brewery",
      foodServiceType: "pub",
      attributeTags: [
        "craft_beer",
        "brewery",
        "outdoor_seating",
        "group_friendly",
      ],
      price: "$$",
      hours: {
        mon: "Closed",
        tue: "Closed",
        wed: "11:00 AM-9:00 PM",
        thu: "11:00 AM-9:00 PM",
        fri: "11:00 AM-10:00 PM",
        sat: "11:00 AM-10:00 PM",
        sun: "11:00 AM-9:00 PM",
      },
      officialUrl: "https://parrotdog.co.nz/pages/parrotdog-bar",
      sourcePhoto:
        "https://parrotdog.co.nz/cdn/shop/files/AVP4866_1200x1200.jpg?v=1757540937",
      editorialUrls: [editorial.pubs],
    },
  ),
  stop(
    "wellington-pub-mean-doses",
    "Mean Doses",
    [-41.2945523, 174.7804071],
    "This small Tory Street taproom pours its own bright, hop-forward beers alongside guest taps and board games, with the brewer often close to the bar.",
    {
      venueKind: "nightlife",
      nightlifeType: "brewery",
      attributeTags: [
        "craft_beer",
        "brewery",
        "board_games",
        "low_key_nightlife",
      ],
      price: "$$",
      hours: {
        mon: "Closed",
        tue: "4:00 PM-9:00 PM",
        wed: "4:00 PM-9:00 PM",
        thu: "4:00 PM-10:00 PM",
        fri: "2:00 PM-11:00 PM",
        sat: "2:00 PM-11:00 PM",
        sun: "2:00 PM-8:00 PM",
      },
      officialUrl: "https://www.meandoses.co.nz/contact",
      sourcePhoto:
        "https://images.squarespace-cdn.com/content/v1/64bf4839e1c44a61f84c1256/d1228ac0-2efb-476a-b566-be7f644c72c0/meandoses-landing.jpg",
      editorialUrls: [editorial.pubs],
    },
  ),
  stop(
    "wellington-pub-heyday",
    "Heyday Beer Co",
    [-41.2966834, 174.7734708],
    "Heyday brews behind a colourful Cuba-quarter taproom whose courtyard, approachable core range, and full kitchen work well for mixed groups.",
    {
      venueKind: "nightlife",
      nightlifeType: "brewery",
      foodServiceType: "pub",
      attributeTags: [
        "craft_beer",
        "brewery",
        "outdoor_seating",
        "group_friendly",
      ],
      price: "$$",
      hours: {
        mon: "Closed",
        tue: "4:00 PM-close",
        wed: "4:00 PM-close",
        thu: "4:00 PM-close",
        fri: "12:00 PM-close",
        sat: "12:00 PM-close",
        sun: "12:00 PM-7:00 PM; kitchen closes 6:00 PM",
      },
      officialUrl: "https://www.heydaybeer.com/contact",
      sourcePhoto: foodGuide("heyday-beer-co"),
      editorialUrls: [editorial.pubs],
    },
  ),
  stop(
    "wellington-pub-sprig-fern",
    "Sprig + Fern Thorndon",
    [-41.2787875, 174.7690205],
    "The Thorndon tavern pours a deep Nelson-brewed range in a relaxed, television-light local where conversation and takeaway riggers matter more than spectacle.",
    {
      venueKind: "nightlife",
      nightlifeType: "pub",
      attributeTags: [
        "craft_beer",
        "local_bar",
        "low_key_nightlife",
        "thorndon",
      ],
      price: "$$",
      hours: {
        mon: "4:00 PM-9:00 PM",
        tue: "2:00 PM-10:00 PM",
        wed: "2:00 PM-10:00 PM",
        thu: "2:00 PM-10:00 PM",
        fri: "12:00 PM-11:00 PM",
        sat: "12:00 PM-10:00 PM",
        sun: "12:00 PM-9:00 PM",
      },
      officialUrl: "https://sprigandfern.co.nz/pages/thorndon",
      sourcePhoto:
        "https://sprigandfern.co.nz/cdn/shop/files/sprig-fern-thorndon-03.webp?v=1771884377&width=1200",
      editorialUrls: [editorial.pubs],
    },
  ),
  stop(
    "wellington-pub-malthouse",
    "The Malthouse",
    [-41.2880735, 174.775113],
    "A long Victoria Street bar has spent decades treating New Zealand beer as the point, with dozens of taps and a staff able to navigate styles without fuss.",
    {
      venueKind: "nightlife",
      nightlifeType: "beer_bar",
      foodServiceType: "pub",
      attributeTags: [
        "craft_beer",
        "beer_selection",
        "central",
        "casual_nightlife",
      ],
      price: "$$",
      hours: {
        mon: "11:30 AM-10:00 PM",
        tue: "11:30 AM-11:00 PM",
        wed: "11:30 AM-11:00 PM",
        thu: "11:30 AM-late",
        fri: "11:30 AM-late",
        sat: "10:30 AM-late",
        sun: "Closed",
      },
      officialUrl: "https://themalthouse.co.nz/",
      sourcePhoto: foodGuide("the-malthouse"),
      editorialUrls: [editorial.pubs],
    },
  ),
  stop(
    "wellington-pub-garage-project",
    "Garage Project Aro Taproom",
    [-41.2954292, 174.7669136],
    "The brewery's original Aro Valley site remains its best tasting room: small pours, frequent releases, experimental styles, and beer taken straight from the source.",
    {
      venueKind: "nightlife",
      nightlifeType: "brewery",
      attributeTags: [
        "craft_beer",
        "brewery",
        "tasting_flight",
        "local_favorite",
      ],
      price: "$$",
      hours: {
        mon: "Closed",
        tue: "3:00 PM-9:00 PM",
        wed: "3:00 PM-9:00 PM",
        thu: "4:00 PM-9:00 PM",
        fri: "3:00 PM-9:00 PM",
        sat: "12:00 PM-9:00 PM",
        sun: "12:00 PM-8:00 PM",
      },
      officialUrl: "https://garageproject.co.nz/locations/aro-taproom",
      sourcePhoto: foodGuide("garage-project-aro-taproom"),
      editorialUrls: [editorial.pubs],
    },
  ),
  stop(
    "wellington-pub-fork-brewer",
    "Fork & Brewer",
    [-41.2892871, 174.7755308],
    "A brewery inside a central pub supplies an unusually broad tap wall, tasting flights, hearty food, and enough space for large groups or sports nights.",
    {
      venueKind: "nightlife",
      nightlifeType: "brewery",
      foodServiceType: "pub",
      attributeTags: [
        "craft_beer",
        "brewery",
        "group_friendly",
        "sports_screening",
      ],
      price: "$$",
      hours: {
        mon: "11:30 AM-late",
        tue: "11:30 AM-late",
        wed: "11:30 AM-late",
        thu: "11:30 AM-late",
        fri: "11:30 AM-late",
        sat: "11:30 AM-late",
        sun: "Closed",
      },
      officialUrl: "https://forkandbrewer.co.nz/",
      sourcePhoto: foodGuide("fork-and-brewer"),
      editorialUrls: [editorial.pubs],
    },
  ),
];

const cocktailStops: GuideStop[] = [
  stop(
    "wellington-cocktail-hawthorn",
    "Hawthorn Lounge",
    [-41.2947923, 174.7801938],
    "Upstairs and deliberately dim, Hawthorn is the city's classic serious cocktail room: tailored service, no rush, and bartenders comfortable working beyond the menu.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      attributeTags: ["cocktails", "date_night", "late_night", "table_service"],
      price: "$$$",
      hours: {
        mon: "Closed",
        tue: "5:00 PM-3:00 AM",
        wed: "5:00 PM-3:00 AM",
        thu: "5:00 PM-3:00 AM",
        fri: "5:00 PM-3:00 AM",
        sat: "5:00 PM-3:00 AM",
        sun: "Closed",
      },
      officialUrl: "https://hawthornlounge.co.nz/",
      sourcePhoto: foodGuide("hawthorn-lounge"),
      editorialUrls: [editorial.cocktails],
    },
  ),
  stop(
    "wellington-cocktail-hanging-ditch",
    "Hanging Ditch",
    [-41.2927911, 174.7773141],
    "Bottles literally hang above this tiny Hannahs Laneway bar, where the team builds theatrical but balanced cocktails in an intimate walk-in room.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      attributeTags: ["cocktails", "small_room", "central", "date_night"],
      price: "$$$",
      hours: { default: "Daily 4:00 PM-12:00 AM." },
      officialUrl: "https://hangingditch.co.nz/home",
      sourcePhoto: foodGuide("hanging-ditch"),
      editorialUrls: [editorial.cocktails],
    },
  ),
  stop(
    "wellington-cocktail-the-ram",
    "The Ram",
    [-41.2923854, 174.7763553],
    "The Ram combines natural wine, sharp cocktails, unfussy food, and vinyl in a compact Cuba Street room that feels more like a well-run local than a themed bar.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      attributeTags: ["cocktails", "natural_wine", "vinyl", "local_bar"],
      price: "$$$",
      hours: {
        mon: "Closed",
        tue: "Closed",
        wed: "3:30 PM-late",
        thu: "3:30 PM-late",
        fri: "12:00 PM-late",
        sat: "12:00 PM-late",
        sun: "12:00 PM-late",
      },
      officialUrl: "https://www.theramwellington.co.nz/",
      sourcePhoto: foodGuide("the-ram"),
      editorialUrls: [editorial.cocktails],
    },
  ),
  stop(
    "wellington-cocktail-havana",
    "Havana Bar",
    [-41.2958494, 174.7751211],
    "Two colourful cottages hide a long-running Cuban-inflected bar where rum cocktails, tapas, live music, and a leafy courtyard turn dinner into a late night.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      foodServiceType: "restaurant",
      musicGenres: ["latin", "jazz", "world"],
      attributeTags: ["cocktails", "live_music", "heritage", "outdoor_seating"],
      price: "$$$",
      hours: {
        mon: "Closed",
        tue: "4:00 PM-late",
        wed: "4:00 PM-late",
        thu: "4:00 PM-late",
        fri: "4:00 PM-late",
        sat: "4:00 PM-late",
        sun: "Closed",
      },
      officialUrl: "https://www.havanabar.co.nz/",
      sourcePhoto: foodGuide("havana-bar"),
      editorialUrls: [editorial.cocktails],
    },
  ),
  stop(
    "wellington-cocktail-dees",
    "Dee's Place",
    [-41.2938904, 174.7843284],
    "A neighbourhood-sized Kent Terrace room delivers concise seasonal cocktails, vinyl, and warm hosting without the performance of a large destination bar.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      attributeTags: ["cocktails", "local_bar", "vinyl", "small_room"],
      price: "$$$",
      hours: {
        mon: "Closed",
        tue: "5:00 PM-12:00 AM",
        wed: "5:00 PM-12:00 AM",
        thu: "5:00 PM-12:00 AM",
        fri: "5:30 PM-2:00 AM",
        sat: "5:30 PM-2:00 AM",
        sun: "Closed",
      },
      officialUrl: "https://www.instagram.com/deesplace.wgtn/",
      sourcePhoto: foodGuide("dees-place"),
      editorialUrls: [
        editorial.cocktails,
        "https://restaurantguru.com/Dees-Place-Wellington",
      ],
      sourceEvidence: {
        currentStatusUrl: "https://restaurantguru.com/Dees-Place-Wellington",
        notes:
          "Current hours are corroborated by the active Restaurant Guru listing because the venue publishes primarily through Instagram; checked 2026-08-12.",
      },
    },
  ),
  stop(
    "wellington-cocktail-ascot",
    "Ascot",
    [-41.2932743, 174.7754565],
    "Ascot's unmarked upstairs room keeps things loose with natural wine, clean cocktails, grilled snacks, and a walk-in-only policy that suits spontaneous nights.",
    {
      venueKind: "nightlife",
      nightlifeType: "wine_bar",
      attributeTags: [
        "natural_wine",
        "cocktails",
        "walk_in_only",
        "small_room",
      ],
      price: "$$$",
      hours: {
        default:
          "Wednesday-Saturday 4:00 PM-late; walk-ins only, with holiday changes published on the official page.",
      },
      officialUrl: "https://www.ascotbar.com/",
      sourcePhoto: "https://www.ascotbar.com/assets/images/card.jpg?v=2a47454c",
      editorialUrls: [editorial.cocktails],
    },
  ),
  stop(
    "wellington-cocktail-regent",
    "Regent",
    [-41.2930657, 174.7753922],
    "Regent gives Ghuznee Street a compact spirits-led bar with thoughtful cocktails, a serious whisky shelf, and enough daylight on weekends for a quieter first round.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      attributeTags: ["cocktails", "whisky", "small_room", "date_night"],
      price: "$$$",
      hours: {
        mon: "Closed",
        tue: "Closed",
        wed: "4:00 PM-12:00 AM",
        thu: "4:00 PM-12:00 AM",
        fri: "2:00 PM-12:00 AM",
        sat: "2:00 PM-12:00 AM",
        sun: "2:00 PM-10:00 PM",
      },
      officialUrl: "https://www.instagram.com/regentbar_wgtn/",
      sourcePhoto:
        "https://wellingtonnz.bynder.com/transform/a58ee79e-5217-45a7-8e09-98435465a283/Regent-01?io=transform%3Afill%2Cwidth%3A1200%2Cheight%3A900",
      editorialUrls: [
        editorial.cocktails,
        "https://thewhiskyclub.co.nz/storelocator/index/view/storelocator_id/299",
      ],
      sourceEvidence: {
        currentStatusUrl:
          "https://thewhiskyclub.co.nz/storelocator/index/view/storelocator_id/299",
        notes:
          "Current opening hours are corroborated by the active Whisky Club venue listing because the bar's official channel is Instagram; checked 2026-08-12.",
      },
    },
  ),
  stop(
    "wellington-cocktail-dirty-little-secret",
    "Dirty Little Secret",
    [-41.2926421, 174.7783275],
    "A rooftop above Courtenay Place supplies broad city views, uncomplicated cocktails, DJs, and a lively crowd; go for sunset and energy rather than hushed precision.",
    {
      venueKind: "nightlife",
      nightlifeType: "rooftop_bar",
      attributeTags: ["rooftop", "views", "cocktails", "lively_nightlife"],
      price: "$$",
      hours: {
        mon: "Closed",
        tue: "4:00 PM-late",
        wed: "4:00 PM-late",
        thu: "4:00 PM-late",
        fri: "12:00 PM-late",
        sat: "12:00 PM-late",
        sun: "12:00 PM-late",
      },
      officialUrl: "https://dirtylittlesecret.co.nz/",
      sourcePhoto: foodGuide("dirty-little-secret"),
      editorialUrls: [editorial.cocktails],
    },
  ),
  stop(
    "wellington-cocktail-rosella",
    "Rosella Wine Bar",
    [-41.2943936, 174.7849216],
    "Rosella keeps Kent Terrace bright with natural wine, well-built cocktails, polished small plates, and a sunny frontage that transitions easily into evening.",
    {
      venueKind: "nightlife",
      nightlifeType: "wine_bar",
      foodServiceType: "restaurant",
      attributeTags: [
        "natural_wine",
        "cocktails",
        "small_plates",
        "date_night",
      ],
      price: "$$$",
      hours: {
        mon: "Closed",
        tue: "4:00 PM-late",
        wed: "4:00 PM-late",
        thu: "4:00 PM-late",
        fri: "12:00 PM-late",
        sat: "12:00 PM-late",
        sun: "12:00 PM-late",
      },
      officialUrl: "https://www.rosellawinebar.nz/",
      sourcePhoto: foodGuide("rosella"),
      editorialUrls: [editorial.cocktails],
    },
  ),
  stop(
    "wellington-cocktail-library",
    "The Library",
    [-41.2936333, 174.7813049],
    "Bookshelves, low lamps, desserts, and a deep cocktail list make this upstairs Courtenay Place veteran useful for a seated late drink rather than a standing-room circuit.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      attributeTags: ["cocktails", "dessert", "date_night", "late_night"],
      price: "$$$",
      hours: { default: "Daily 5:00 PM-late." },
      officialUrl: "https://www.thelibrary.co.nz/",
      sourcePhoto: foodGuide("the-library"),
      editorialUrls: [editorial.cocktails],
    },
  ),
];

const cultureStops: GuideStop[] = [
  stop(
    "wellington-culture-te-papa",
    "Museum of New Zealand Te Papa Tongarewa",
    [-41.2903326, 174.7819275],
    "The national museum connects taonga Māori, natural history, art, Pacific cultures, and contemporary Aotearoa through large, free core galleries on the waterfront.",
    {
      category: "Culture",
      subcategory: "national_museum",
      venueKind: "culture",
      attributeTags: [
        "maori_culture",
        "art",
        "history",
        "family_friendly",
        "free_entry",
      ],
      hours: { default: "Daily 10:00 AM-6:00 PM; closed Christmas Day." },
      officialUrl: "https://www.tepapa.govt.nz/visit",
      sourcePhoto:
        "https://tepapa.govt.nz/assets/76067/1658185372-our-building_tile.jpeg",
      editorialUrls: [editorial.culture],
    },
  ),
  stop(
    "wellington-culture-city-museum",
    "Wellington Museum",
    [-41.2852862, 174.7780957],
    "Inside the 1892 Bond Store, compact galleries tell the city's maritime, civic, Māori, disaster, and social histories with more personality than their footprint suggests.",
    {
      category: "Culture",
      subcategory: "city_museum",
      venueKind: "culture",
      attributeTags: [
        "history",
        "maritime",
        "heritage",
        "family_friendly",
        "free_entry",
      ],
      hours: {
        default:
          "Daily 10:00 AM-5:00 PM; holiday closures follow the Museums Wellington calendar.",
      },
      officialUrl: "https://www.museumswellington.org.nz/wellington-museum-sh/",
      sourcePhoto: commons("Museum of Wellington City & Sea.jpg"),
      editorialUrls: [editorial.culture],
    },
  ),
  stop(
    "wellington-culture-portrait-gallery",
    "New Zealand Portrait Gallery Te Pūkenga Whakaata",
    [-41.2835657, 174.7782112],
    "The Shed 11 gallery reads national history through people, using historic and contemporary portraiture rather than a single chronological narrative.",
    {
      category: "Culture",
      subcategory: "art_gallery",
      venueKind: "culture",
      attributeTags: [
        "art",
        "portraiture",
        "waterfront",
        "free_entry",
        "new_zealand_history",
      ],
      hours: {
        default:
          "Daily 10:00 AM-4:30 PM; closed Christmas Day and Good Friday.",
      },
      officialUrl: "https://www.nzportraitgallery.org.nz/visit",
      sourcePhoto: commons("NZ Portrait Gallery.jpg"),
      editorialUrls: [editorial.culture],
    },
  ),
  stop(
    "wellington-culture-adam",
    "Adam Art Gallery Te Pātaka Toi",
    [-41.2885879, 174.7690318],
    "Victoria University uses an unusually vertical Ian Athfield building for ambitious contemporary exhibitions, research-led projects, talks, and commissions.",
    {
      category: "Culture",
      subcategory: "contemporary_art_gallery",
      venueKind: "culture",
      attributeTags: [
        "art",
        "architecture",
        "free_entry",
        "university",
        "contemporary",
      ],
      hours: {
        mon: "Closed",
        tue: "11:00 AM-5:00 PM",
        wed: "11:00 AM-5:00 PM",
        thu: "11:00 AM-5:00 PM",
        fri: "11:00 AM-5:00 PM",
        sat: "11:00 AM-5:00 PM",
        sun: "11:00 AM-5:00 PM",
      },
      officialUrl: "https://www.adamartgallery.nz/visit",
      sourcePhoto:
        "https://cdn.sanity.io/images/h84sqrxf/production/75a12d07d0766dbec968dfa695e1d2afbfb84b3b-1133x473.png",
      editorialUrls: [editorial.culture],
    },
  ),
  stop(
    "wellington-culture-mansfield",
    "Katherine Mansfield House & Garden",
    [-41.2701568, 174.7798246],
    "The writer's 1888 birthplace restores the scale and texture of colonial family life while using objects and exhibitions to reconnect Mansfield's work to Wellington.",
    {
      category: "Culture",
      subcategory: "historic_house_museum",
      venueKind: "culture",
      attributeTags: [
        "literature",
        "history",
        "heritage",
        "garden",
        "thorndon",
      ],
      hours: {
        mon: "Closed",
        tue: "10:00 AM-4:00 PM",
        wed: "10:00 AM-4:00 PM",
        thu: "10:00 AM-4:00 PM",
        fri: "10:00 AM-4:00 PM",
        sat: "10:00 AM-4:00 PM",
        sun: "10:00 AM-4:00 PM; most public holidays closed",
      },
      officialUrl:
        "https://www.katherinemansfield.com/visit-katherine-mansfield-house-and-garden/hours-and-admission",
      sourcePhoto:
        "https://cdn-asset-mel-2.airsquare.com/katherinemansfield/managed/image/share-preview-image.jpg?20150608101432",
      editorialUrls: [editorial.culture],
    },
  ),
  stop(
    "wellington-culture-space-place",
    "Space Place at Carter Observatory",
    [-41.2843239, 174.7671563],
    "A digital planetarium, historic telescopes, and Māori star knowledge turn the Botanic Garden observatory into an evening-focused introduction to southern skies.",
    {
      category: "Culture",
      subcategory: "planetarium",
      venueKind: "culture",
      attributeTags: [
        "astronomy",
        "maori_culture",
        "family_friendly",
        "evening",
        "educational",
      ],
      hours: {
        default:
          "School term: Monday closed; Tuesday-Wednesday 5:00 PM-10:30 PM, Thursday 10:00 AM-10:30 PM, Friday-Saturday 10:00 AM-11:00 PM, Sunday 10:00 AM-5:00 PM. School and public holidays use the dated official calendar.",
      },
      officialUrl:
        "https://www.museumswellington.org.nz/space-place-opening-hours/",
      bookingUrl: "https://www.museumswellington.org.nz/space-place/",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/e/e1/Space_Place_Entrance.jpg",
      editorialUrls: [editorial.culture],
    },
  ),
  stop(
    "wellington-culture-cable-car-museum",
    "Wellington Cable Car Museum",
    [-41.2852526, 174.7675231],
    "Beside the Kelburn terminus, restored cars and winding machinery explain how the cable route reshaped hillside Wellington and its suburban growth.",
    {
      category: "Culture",
      subcategory: "transport_museum",
      venueKind: "culture",
      attributeTags: [
        "transport",
        "history",
        "family_friendly",
        "free_entry",
        "kelburn",
      ],
      hours: {
        default:
          "Daily 9:30 AM-5:00 PM; holiday changes follow the museum's official page.",
      },
      officialUrl: "https://museumofwellington.co.nz/cable-car-museum/",
      sourcePhoto:
        "https://www.newzealand.com/assets/externally-managed-assets/tbd-assets/tbd-folder-10053670/img-1713945752-1378-2661017-tbd-asset__aWxvdmVrZWxseQo_CropResizeWzE5MDAsMTAwMCw3NSwianBnIl0.jpg",
      editorialUrls: [editorial.culture],
    },
  ),
  stop(
    "wellington-culture-nairn",
    "Nairn Street Cottage",
    [-41.2992956, 174.7699627],
    "The city's oldest identified house is now interpreted through Unsettling Nairn Street, a guided domestic history that brings Māori and colonial stories into the same rooms.",
    {
      category: "Culture",
      subcategory: "historic_house_museum",
      venueKind: "culture",
      attributeTags: [
        "history",
        "heritage",
        "guided",
        "maori_history",
        "architecture",
      ],
      hours: {
        default:
          "Through 31 October 2026, Saturday-Sunday 12:00 PM-4:00 PM; guided tours at 12:00 PM and 3:00 PM, with dated sessions controlled by the official booking page.",
      },
      officialUrl:
        "https://www.museumswellington.org.nz/unsettling-nairn-street/",
      bookingUrl:
        "https://www.museumswellington.org.nz/unsettling-nairn-street/",
      sourcePhoto:
        "https://wellingtonnz.bynder.com/transform/f2a4aae9-4c5f-467d-8cee-554d1dbb6d5c/Nairn-Street-Cottage-07?io=transform%3Afill%2Cwidth%3A1500%2Cheight%3A1500",
      editorialUrls: [editorial.culture],
    },
  ),
  stop(
    "wellington-culture-holocaust",
    "Holocaust Centre of New Zealand",
    [-41.2971887, 174.7723492],
    "Testimony, personal objects, and New Zealand stories make this small centre a focused place for Holocaust education, remembrance, and confronting antisemitism.",
    {
      category: "Culture",
      subcategory: "history_museum",
      venueKind: "culture",
      attributeTags: [
        "history",
        "education",
        "remembrance",
        "guided",
        "accessible",
      ],
      hours: {
        mon: "10:00 AM-1:00 PM",
        tue: "10:00 AM-1:00 PM",
        wed: "10:00 AM-1:00 PM",
        thu: "10:00 AM-1:00 PM",
        fri: "10:00 AM-1:00 PM",
        sat: "Closed",
        sun: "10:00 AM-1:00 PM; public and Jewish holidays closed, and booked groups can affect access",
      },
      officialUrl: "https://www.holocaustcentre.org.nz/plan-your-visit",
      sourcePhoto:
        "https://images.squarespace-cdn.com/content/v1/69f27c4c9a8c3e488f7bd2ab/cae17a2c-6667-4324-9d1f-ce60d94d7899/plan-your-visit.webp?format=1500w",
      editorialUrls: [editorial.culture],
    },
  ),
  stop(
    "wellington-culture-old-st-pauls",
    "Old St Paul's",
    [-41.2762647, 174.7801017],
    "Native timbers, Gothic Revival structure, military memorials, and luminous stained glass make this former cathedral one of Wellington's most affecting historic interiors.",
    {
      category: "Culture",
      subcategory: "historic_church",
      venueKind: "culture",
      attributeTags: [
        "architecture",
        "heritage",
        "religious_history",
        "thorndon",
        "free_entry",
      ],
      hours: {
        default:
          "Daily 10:00 AM-4:00 PM; Christmas Day, Good Friday, Anzac morning, and private-event closures follow the official heritage calendar.",
      },
      officialUrl:
        "https://www.visitheritage.co.nz/visit/wellington/old-st-pauls",
      sourcePhoto:
        "https://hnzpt-rpod-assets.azureedge.net/3nvjragl/hnzpt_osp_43.jpg",
      editorialUrls: [editorial.culture],
    },
  ),
];

const activityStops: GuideStop[] = [
  stop(
    "wellington-activity-cable-car",
    "Wellington Cable Car",
    [-41.2849117, 174.7705423],
    "The five-minute climb from Lambton Quay to Kelburn is useful transport and an essential first geographic read, ending beside the Botanic Garden and city lookout.",
    {
      category: "Activities",
      subcategory: "funicular",
      venueKind: "transport",
      attributeTags: [
        "views",
        "transport",
        "family_friendly",
        "central",
        "accessible",
      ],
      hours: {
        mon: "7:30 AM-8:00 PM",
        tue: "7:30 AM-8:00 PM",
        wed: "7:30 AM-8:00 PM",
        thu: "7:30 AM-8:00 PM",
        fri: "7:30 AM-9:00 PM",
        sat: "8:30 AM-9:00 PM",
        sun: "8:30 AM-7:00 PM; public holidays 8:30 AM-7:00 PM",
      },
      officialUrl: "https://www.wellingtoncablecar.co.nz/timetable-fares",
      bookingUrl: "https://www.wellingtoncablecar.co.nz/tickets",
      sourcePhoto:
        "https://www.wellingtoncablecar.co.nz/sites/default/files/2026-06/Wellington_Cable_Car_Social_Sharing_Image.png",
      editorialUrls: [editorial.activities],
    },
  ),
  stop(
    "wellington-activity-zealandia",
    "Zealandia Te Māra a Tāne",
    [-41.3030069, 174.7425175],
    "A predator-fenced valley has restored native forest, wetlands, and birdlife close to the centre; slow walkers can see kākā, takahē, tuatara, and wētā.",
    {
      category: "Activities",
      subcategory: "wildlife_sanctuary",
      venueKind: "outdoors",
      attributeTags: [
        "wildlife",
        "conservation",
        "birdwatching",
        "family_friendly",
        "guided",
      ],
      hours: {
        default:
          "Daily 9:00 AM-5:00 PM; last admission 4:00 PM. Night tours and seasonal experiences follow the dated official booking calendar.",
      },
      officialUrl: "https://www.visitzealandia.com/",
      bookingUrl: "https://www.visitzealandia.com/visit",
      sourcePhoto: commons(
        "Boat - Zealandia (Karori Wildlife Sanctuary) - Wellington - New Zealand - DSC00207.jpg",
      ),
      editorialUrls: [editorial.activities],
    },
  ),
  stop(
    "wellington-activity-weta",
    "Wētā Workshop Experience",
    [-41.3043466, 174.8245283],
    "Guided Miramar tours unpack practical effects through armour, creatures, miniatures, and model-making, with working artists explaining how screen ideas become physical objects.",
    {
      category: "Activities",
      subcategory: "studio_tour",
      venueKind: "culture",
      attributeTags: [
        "film",
        "guided",
        "craft",
        "family_friendly",
        "reservation_recommended",
      ],
      hours: {
        default:
          "Daily 8:45 AM-4:45 PM except Christmas Day; individual tour departures follow the dated official booking calendar.",
      },
      officialUrl:
        "https://www.wetaworkshop.com/tours/wellington/plan-your-visit",
      bookingUrl: "https://www.wetaworkshop.com/tours/wellington/",
      sourcePhoto:
        "https://www.wetaworkshop.com/web/image/122279-41644a0c/2T2A1900_090125.jpg",
      editorialUrls: [editorial.activities],
    },
  ),
  stop(
    "wellington-activity-botanic",
    "Wellington Botanic Garden ki Paekākā",
    [-41.2825382, 174.7668639],
    "Hillside paths connect native bush, formal flower beds, sculpture, the rose garden, Space Place, and cable-car views in a free route back toward the centre.",
    {
      category: "Activities",
      subcategory: "botanic_garden",
      venueKind: "outdoors",
      attributeTags: [
        "garden",
        "walking",
        "free_entry",
        "views",
        "family_friendly",
      ],
      hours: {
        default:
          "Garden grounds daily dawn-dusk; Treehouse visitor centre in winter Monday-Friday 9:00 AM-4:00 PM and closed weekends. Seasonal facility hours follow the official garden page.",
      },
      officialUrl:
        "https://wellingtongardens.nz/our-gardens/wellington-botanic-garden-ki-paekaka",
      sourcePhoto:
        "https://wellingtongardens.nz/assets/BannerImages/8d68faaea3/20181231_150-cake-bedding__ScaleWidthWzkwMF0.jpg",
      editorialUrls: [editorial.activities],
    },
  ),
  stop(
    "wellington-activity-mount-victoria",
    "Mount Victoria Lookout",
    [-41.2960371, 174.7943249],
    "Walk or drive to the 196-metre summit for a compact survey of the harbour, airport, central grid, green belt, and hills that make Wellington's weather so visible.",
    {
      category: "Activities",
      subcategory: "viewpoint_walk",
      venueKind: "outdoors",
      attributeTags: [
        "viewpoint",
        "walking",
        "free_entry",
        "sunset",
        "city_views",
      ],
      hours: {
        default:
          "Daily 6:00 AM-10:00 PM; temporary road and track closures follow Wellington City Council notices.",
      },
      officialUrl:
        "https://wellington.govt.nz/recreation/outdoors/walks-and-walkways/across-the-city/mount-victoria-loop",
      sourcePhoto: commons("Wellington from Mount Victoria 2026-06-13.jpg"),
      editorialUrls: [editorial.activities],
    },
  ),
  stop(
    "wellington-activity-red-rocks",
    "Red Rocks Coastal Walk",
    [-41.3576186, 174.7270535],
    "A rough south-coast track crosses exposed beaches, rust-red geological formations, seal habitat, and big Cook Strait weather within an easy city excursion.",
    {
      category: "Activities",
      subcategory: "coastal_walk",
      venueKind: "outdoors",
      attributeTags: ["walking", "coast", "wildlife", "geology", "free_entry"],
      hours: {
        default:
          "Public track accessible daily in daylight; the vehicle gate is closed Sunday 9:00 AM-6:00 PM. Weather, fire, and track-status notices on the official pages control access.",
      },
      officialUrl:
        "https://www.wellingtonnz.com/visit/trails/waimapihi-reserve-brooklyn-turbine-and-te-kopahou-reserve/red-rocks-coastal-walk",
      sourcePhoto:
        "https://wellingtonnz.bynder.com/transform/3fa42acf-96b0-4353-8bd4-d6043a1e3b2f/Red-Rocks-Coastal-Walkway-14",
      editorialUrls: [
        editorial.activities,
        "https://wellington.govt.nz/recreation/outdoors/beaches-and-coast/southern-suburbs/red-rocks-pariwhero",
      ],
    },
  ),
  stop(
    "wellington-activity-zoo",
    "Wellington Zoo",
    [-41.3219892, 174.7845935],
    "New Zealand's first zoo now centres conservation, animal care, and close-scale habitats; native species and the veterinary hospital make the strongest case for a visit.",
    {
      category: "Activities",
      subcategory: "zoo",
      venueKind: "outdoors",
      attributeTags: [
        "wildlife",
        "conservation",
        "family_friendly",
        "accessible",
        "educational",
      ],
      hours: {
        default:
          "Daily 9:30 AM-5:00 PM except Christmas Day; last entry 4:15 PM.",
      },
      officialUrl: "https://www.wellingtonzoo.com/plan-your-visit/",
      bookingUrl: "https://tickets.wellingtonzoo.com/",
      sourcePhoto: commons("Wellington Zoo Monkey Island.JPG"),
      editorialUrls: [editorial.activities],
    },
  ),
  stop(
    "wellington-activity-otari",
    "Ōtari-Wilton's Bush",
    [-41.2681884, 174.7567619],
    "New Zealand's only public botanic garden devoted entirely to native plants joins curated collections to mature forest, canopy walkways, and longer streamside tracks.",
    {
      category: "Activities",
      subcategory: "native_botanic_garden",
      venueKind: "outdoors",
      attributeTags: [
        "native_plants",
        "walking",
        "free_entry",
        "forest",
        "birdwatching",
      ],
      hours: {
        default:
          "Reserve grounds daily dawn-dusk; Te Marae o Tāne visitor centre daily 7:30 AM-4:00 PM.",
      },
      officialUrl:
        "https://wellingtongardens.nz/our-gardens/otari-wiltons-bush",
      sourcePhoto:
        "https://wellingtongardens.nz/assets/BannerImages/Otari-Banner-New/Otari-forest-walk-Helen-Nelson-1__ScaleWidthWzkwMF0.jpg",
      editorialUrls: [editorial.activities],
    },
  ),
  stop(
    "wellington-activity-parliament",
    "New Zealand Parliament Tour",
    [-41.2784404, 174.7780408],
    "Free guided tours connect the Beehive, debating chamber, parliamentary art, earthquake engineering, and the mechanics of New Zealand's democracy.",
    {
      category: "Activities",
      subcategory: "government_tour",
      venueKind: "landmark",
      attributeTags: [
        "architecture",
        "politics",
        "guided",
        "free_entry",
        "reservation_recommended",
      ],
      hours: {
        default:
          "Visitor Centre daily 9:30 AM-4:30 PM; guided tours generally depart between 10:00 AM and 4:00 PM according to the dated official booking calendar.",
      },
      officialUrl: "https://www.parliament.nz/visit/what-to-see/tours?lang=en",
      bookingUrl: "https://www.parliament.nz/visit/what-to-see/tours?lang=en",
      sourcePhoto:
        "https://prod-win-client-home.azurewebsites.net/api/Content/media/i0gbxr2y/pnz-mobile.png",
      editorialUrls: [editorial.activities],
    },
  ),
  stop(
    "wellington-activity-writers-walk",
    "Wellington Writers Walk",
    [-41.2884, 174.7809],
    "Sculpted quotations embedded along the waterfront turn a harbour walk into a literary route through Katherine Mansfield, James K Baxter, Patricia Grace, and other local voices.",
    {
      category: "Activities",
      subcategory: "literary_walk",
      venueKind: "outdoors",
      attributeTags: [
        "walking",
        "literature",
        "waterfront",
        "free_entry",
        "public_art",
      ],
      hours: {
        default:
          "Public waterfront route accessible 24 hours daily; construction detours and waterfront closures follow Wellington City Council notices.",
      },
      officialUrl: "https://wellingtonwriterswalk.co.nz/",
      sourcePhoto:
        "https://wellingtonwriterswalk.co.nz/wp-content/uploads/2022/07/sculpture-knox2-1024x427.jpg",
      editorialUrls: [
        editorial.activities,
        "https://wellington.govt.nz/recreation/outdoors/beaches-and-coast/waterfront",
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
  const candidates = [
    editorialSource,
    ...stops.flatMap((item) => [
      source(item.name + " official or property page", item.officialUrl!),
      source(
        item.name + " current map listing",
        item.sourceEvidence?.mapUrl ??
          maps(item.name + " Wellington New Zealand"),
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
    url: maps(title + " Wellington New Zealand"),
    category,
    location: wellingtonLocation,
    creator: {
      id: "user-rguide-" + category.toLowerCase(),
      name: "R " + category,
      avatar: avatar(category),
    },
    upvotes: 0,
    createdAt,
    stops,
    sources: guideSources,
  };
}

export const wellingtonCitywideGuides: MapList[] = [
  guide(
    "Food",
    "list-wellington-dining",
    "wellington-best-restaurants",
    "best-restaurants",
    "Wellington Restaurants for Fire, Seafood, and Character",
    "Ten dining rooms that explain contemporary Wellington through New Zealand produce, Māori ingredients, seafood, Syrian family cooking, Middle Eastern fire, natural wine, and rooms with a strong sense of place.",
    diningStops,
    sourcesFor(
      diningStops,
      source("Urban List Wellington restaurant guide", editorial.dining),
    ),
    "Best Restaurants in Wellington for Seafood, Fire, and Local Produce",
    "A source-backed Wellington restaurant guide to Logan Brown, Ortega, Jano Bistro, Koji, Highwater, Kisa, Damascus, Ombra, Charley Noble, and Supra.",
  ),
  guide(
    "Food",
    "list-wellington-cheap-eats",
    "wellington-best-cheap-eats",
    "best-cheap-eats",
    "Wellington Value: Noodles, Satay, Pies, and Hot Chicken",
    "The strongest affordable eating crosses Left Bank arcades, Cuba-quarter counters, Newtown, and the Basin, with specific orders and current hours replacing generic budget filler.",
    cheapEatStops,
    sourcesFor(
      cheapEatStops,
      source("Klook Wellington affordable-eats guide", editorial.cheap),
    ),
    "Best Cheap Eats in Wellington for Noodles, Satay, Pies, and More",
    "Ten current Wellington value stops for hand-pulled noodles, Cantonese wok cooking, Malaysian street food, Nashville chicken, ramen, injera, pizza, and pies.",
  ),
  guide(
    "Stay",
    "list-wellington-hotels",
    "wellington-best-hotels",
    "best-hotels",
    "Wellington Hotels for Art, Harbour Access, and Design",
    "This hotel-only guide balances independent character, full-service luxury, apartment kitchens, pools, art, heritage buildings, and the real location tradeoff between the waterfront, Cuba quarter, and government district.",
    hotelStops,
    sourcesFor(
      hotelStops,
      source("Urban List Wellington hotel guide", editorial.hotels),
    ),
    "Best Hotels in Wellington for Boutique Design and Waterfront Access",
    "Hotel-only Wellington guide covering Intrepid, Naumi, QT, Bolton, InterContinental, Ohtel, Cobbler, TRYP, Mövenpick, and Sofitel.",
  ),
  guide(
    "Stay",
    "list-wellington-hostels",
    "wellington-best-hostels",
    "best-hostels",
    "Wellington Hostels for Social Kitchens and Quiet Bunks",
    "This hostel-only selection separates polished privacy bunks, large social bases, heritage transit stays, quiet villas, long-stay rooms, and small independent properties, with every arrival window treated as a booking essential.",
    hostelStops,
    sourcesFor(
      hostelStops,
      source("Hostelworld Wellington inventory", editorial.hostels),
    ),
    "Best Hostels in Wellington for Solo Travellers and Budget Stays",
    "Current hostel-only Wellington guide to Haka House, Trek Global, The Marion, Worldwide, Waterloo, Cambridge, Nomads, Rosemere, Dwellington, and House of Pirie.",
  ),
  guide(
    "Nightlife",
    "list-wellington-casual-bars",
    "wellington-best-pubs-and-casual-bars",
    "best-dive-bars",
    "Taprooms, Live Rooms & No-Frills Pints",
    "Wellington's dive-bar nights run through brewery taprooms, deep beer lists, a Welsh oddity, outdoor live music, neighbourhood taverns, and rooms where the person pouring usually knows the beer.",
    pubStops,
    sourcesFor(
      pubStops,
      source("WellingtonNZ craft-beer guide", editorial.pubs),
    ),
    "Best Dive Bars in Wellington for Beer and Live Music",
    "Ten current Wellington dive bars and low-key pubs spanning Welsh Dragon, Rogue & Vagabond, Golding's, Parrotdog, Mean Doses, Heyday, Sprig + Fern, Malthouse, Garage Project, and Fork & Brewer.",
  ),
  guide(
    "Nightlife",
    "list-wellington-cocktail-bars",
    "wellington-best-cocktail-bars",
    "best-cocktail-bars",
    "Wellington Cocktails from Hidden Rooms to Rooftop Views",
    "The city's serious drinks circuit moves between tailored classics, laneway theatrics, natural wine, vinyl locals, rum and live music, a rooftop, and veteran late rooms that still justify sitting down.",
    cocktailStops,
    sourcesFor(
      cocktailStops,
      source("Urban List Wellington bar guide", editorial.cocktails),
    ),
    "Best Cocktail Bars in Wellington for Hidden Rooms, Wine, and Views",
    "Source-backed Wellington cocktail guide to Hawthorn, Hanging Ditch, The Ram, Havana, Dee's Place, Ascot, Regent, Dirty Little Secret, Rosella, and The Library.",
  ),
  guide(
    "Culture",
    "list-wellington-culture",
    "wellington-best-culture",
    "best-culture",
    "Wellington Culture through Taonga, Writers, Art, and Memory",
    "Ten institutions read the capital through Māori taonga, national and city history, portraiture, contemporary art, literature, astronomy, transport, domestic life, Holocaust memory, and native-timber architecture.",
    cultureStops,
    sourcesFor(
      cultureStops,
      source("WellingtonNZ arts and culture guide", editorial.culture),
    ),
    "Best Culture in Wellington for Museums, Galleries, and Heritage",
    "A source-backed Wellington culture guide with current hours for Te Papa, Wellington Museum, the Portrait Gallery, Adam Art Gallery, Space Place, Old St Paul's, and more.",
  ),
  guide(
    "Activities",
    "list-wellington-things-to-do",
    "wellington-best-things-to-do",
    "best-things-to-do",
    "Wellington Things to Do across Hills, Harbour, and Native Bush",
    "The best first-trip experiences use Wellington's compact geography: a cable-car climb, restored wildlife valley, film craft, botanic and native gardens, exposed coastal tracks, summit views, Parliament, the zoo, and literature along the harbour.",
    activityStops,
    sourcesFor(
      activityStops,
      source("WellingtonNZ top-ten must-dos guide", editorial.activities),
    ),
    "Top Things to Do in Wellington for Wildlife, Views, and Film",
    "Ten source-backed Wellington experiences with current access details, including Zealandia, Wētā Workshop, the Cable Car, Mount Victoria, Red Rocks, Parliament, the zoo, and waterfront Writers Walk.",
  ),
];
