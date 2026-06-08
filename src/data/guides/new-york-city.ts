import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

const createdAt = "2026-06-02T00:00:00.000Z";
const checkedAt = "2026-06-02";

const nycLocation = {
  city: "New York City",
  country: "United States",
  continent: "North America",
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
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=1400`;
}

const images = {
  katz: commons("Katz's Delicatessen, New York City.jpg"),
  russ: commons("Russ & Daughters, 179 E. Houston Street, NYC.jpg"),
  keens: commons("Keens Steakhouse.jpg"),
  peterLuger: commons("Peter Luger Steak House, Brooklyn.jpg"),
  sylvias: commons("Sylvia's Restaurant, Harlem.jpg"),
  nomWah: commons("Nom Wah Tea Parlor, Chinatown, Manhattan.jpg"),
  oysterBar: commons("Grand Central Oyster Bar, New York City.jpg"),
  tavernGreen: commons("Tavern on the Green Central Park.jpg"),
  veselka: commons("Veselka, East Village, New York City.jpg"),
  lombardis: commons("Lombardi's Pizza New York City.jpg"),
  graysPapaya: commons("Gray's Papaya, Broadway and 72nd Street.jpg"),
  joesPizza: commons("Joe's Pizza, Carmine Street.jpg"),
  mamouns: commons("Mamoun's Falafel, Greenwich Village.jpg"),
  xian: commons("Xi'an Famous Foods, New York City.jpg"),
  vanessas: commons("Vanessa's Dumpling House, Eldridge Street.jpg"),
  losTacos: "https://www.lostacos1.com/wp-content/uploads/2020/09/los-tacos-no1-adobada.jpg",
  absoluteBagels: commons("Absolute Bagels, Broadway, New York City.jpg"),
  punjabiDeli: commons("Punjabi Deli, New York City.jpg"),
  tastyNoodles: commons("Tasty Hand-Pulled Noodles, Chinatown NYC.jpg"),
  taim: commons("Taïm Falafel and Smoothie Bar, New York City.jpg"),
  plaza: commons("The Plaza Hotel from Central Park.jpg"),
  chelseaHotel: commons("Hotel Chelsea, New York City.jpg"),
  beekman: commons("Temple Court Building and Annex.jpg"),
  boweryHotel: commons("The Bowery Hotel New York.jpg"),
  standardHighLine: commons("The Standard, High Line.jpg"),
  carlyle: commons("The Carlyle Hotel, New York City.jpg"),
  ludlow: commons("Ludlow Hotel, Lower East Side.jpg"),
  ace: commons("Ace Hotel New York.jpg"),
  twa: commons("TWA Flight Center, JFK Airport.jpg"),
  marlton: commons("The Marlton Hotel Greenwich Village.jpg"),
  hiNyc: commons("Hostelling International New York City.jpg"),
  localNyc: "https://www.thelocalny.com/wp-content/uploads/2024/02/local-ny-hostel-lobby.jpg",
  q4: "https://q4hotel.com/wp-content/uploads/2020/08/q4-hotel-lobby.jpg",
  nyMoore: "https://www.nymoorehostel.com/wp-content/uploads/2024/04/ny-moore-hostel-room.jpg",
  westSideYmca: commons("West Side YMCA, Manhattan.jpg"),
  chelseaInternational: "https://www.chelseahostel.com/wp-content/uploads/2023/08/chelsea-international-hostel-nyc.jpg",
  napYork: "https://napyork.com/wp-content/uploads/2023/05/nap-york-pods.jpg",
  americanDream: "https://www.americandreamhostel.com/wp-content/uploads/2020/03/american-dream-hostel-room.jpg",
  kamaCentralPark: "https://lirp.cdn-website.com/e436dda7/dms3rep/multi/opt/KAMA_Hostel_NewYork9-1920w.jpg",
  eastHarlemHostel: "https://images.squarespace-cdn.com/content/v1/6553b8e174f54700fed98508/ad799363-587d-40df-b6e1-b42fd78cfedd/nasbk_street_intersection_in_East_Harlem_New_York_City_with_tra_47e2c1c4-4c4a-405a-9dd7-389376e76bdd%2B-%2BCopy.png",
  mcsorleys: commons("McSorley's Old Ale House, New York City.jpg"),
  whiteHorse: commons("White Horse Tavern, New York City.jpg"),
  earInn: commons("Ear Inn, New York City.jpg"),
  petesTavern: commons("Pete's Tavern, New York City.jpg"),
  julius: commons("Julius' Bar, Greenwich Village.jpg"),
  stonewall: commons("Stonewall Inn 53 Christopher Street.jpg"),
  sunnys: commons("Sunny's Bar Red Hook Brooklyn.jpg"),
  fraunces: commons("Fraunces Tavern, New York City.jpg"),
  oldTownBar: commons("Old Town Bar, New York City.jpg"),
  rudys: commons("Rudy's Bar and Grill New York City.jpg"),
  bemelmans: commons("Bemelmans Bar at The Carlyle.jpg"),
  deadRabbit: commons("The Dead Rabbit Grocery and Grog.jpg"),
  employeesOnly: commons("Employees Only, New York City.jpg"),
  pdt: commons("Please Don't Tell bar New York City.jpg"),
  attaboy: commons("Attaboy bar New York City.jpg"),
  cloverClub: commons("Clover Club, Brooklyn.jpg"),
  dante: commons("Caffe Dante, Greenwich Village.jpg"),
  deathCo: commons("Death & Company, New York City.jpg"),
  angelShare: commons("Angel's Share, East Village.jpg"),
  kingCole: commons("King Cole Bar, St. Regis New York.jpg"),
  met: commons("Metropolitan Museum of Art, New York City.jpg"),
  moma: commons("Museum of Modern Art NYC 53rd Street.jpg"),
  whitney: commons("Whitney Museum of American Art from High Line.jpg"),
  tenement: commons("Tenement Museum, Orchard Street.jpg"),
  studioMuseum: commons("Studio Museum in Harlem.jpg"),
  brooklynMuseum: commons("Brooklyn Museum Eastern Parkway.jpg"),
  lincolnCenter: commons("Lincoln Center for the Performing Arts.jpg"),
  apollo: commons("Apollo Theater, Harlem.jpg"),
  noguchi: commons("Noguchi Museum, Queens.jpg"),
  movingImage: commons("Museum of the Moving Image, Astoria.jpg"),
  statueLiberty: commons("Statue of Liberty 7.jpg"),
  ellisIsland: commons("Ellis Island Immigration Museum.jpg"),
  centralPark: commons("Central Park New York City New York 23 cropped.jpg"),
  highLine: commons("High Line 20th Street looking downtown.jpg"),
  brooklynBridge: commons("Brooklyn Bridge, New York City.jpg"),
  grandCentral: commons("Grand Central Terminal Main Concourse Jan 2006.jpg"),
  ferry: commons("Staten Island Ferry Whitehall Terminal.jpg"),
  prospectPark: commons("Prospect Park Long Meadow.jpg"),
  yankeeStadium: commons("Yankee Stadium exterior 2010.jpg"),
};

const editorial = {
  restaurants: [
    source("Top organic result: Eater NY - Best Restaurants in New York City", "https://ny.eater.com/maps/best-new-york-restaurants-38-map"),
    source("The Infatuation - The Best Restaurants in NYC", "https://www.theinfatuation.com/new-york/guides/best-restaurants-nyc"),
    source("MICHELIN Guide - New York restaurants", "https://guide.michelin.com/us/en/new-york-state/new-york/restaurants"),
    source("Time Out - Best restaurants in NYC", "https://www.timeout.com/newyork/restaurants/100-best-new-york-restaurants"),
    source("New York Magazine Grub Street", "https://www.grubstreet.com/"),
  ],
  cheapEats: [
    source("Top organic result: Eater NY - Best Cheap Eats in NYC", "https://ny.eater.com/maps/best-cheap-eats-nyc"),
    source("The Infatuation - Best Cheap Eats NYC", "https://www.theinfatuation.com/new-york/guides/best-cheap-eats-nyc"),
    source("Time Out - Best cheap eats in NYC", "https://www.timeout.com/newyork/restaurants/best-cheap-eats-in-nyc"),
    source("New York Magazine - Cheap Eats", "https://www.grubstreet.com/tags/cheap-eats/"),
    source("Serious Eats - New York", "https://www.seriouseats.com/new-york-city"),
  ],
  hotels: [
    source("Top organic result: Conde Nast Traveler - Best Hotels in New York City", "https://www.cntraveler.com/gallery/best-hotels-in-new-york-city"),
    source("Travel + Leisure - Best Hotels in New York City", "https://www.travelandleisure.com/best-hotels-in-new-york-city-7371984"),
    source("MICHELIN Guide - New York hotels", "https://guide.michelin.com/us/en/hotels-stays/new-york-state/new-york"),
    source("Forbes Travel Guide - New York City hotels", "https://www.forbestravelguide.com/destinations/new-york-new-york/travel-guide"),
    source("Google Travel - New York City hotels", "https://www.google.com/travel/hotels/New%20York%20City"),
  ],
  hostels: [
    source("Top organic result: Hostelworld - New York hostels", "https://www.hostelworld.com/hostels/north-america/usa/new-york/"),
    source("Hostelgeeks - Best Hostels in New York City", "https://hostelgeeks.com/best-hostels-in-new-york-city-usa/"),
    source("The Broke Backpacker - Best Hostels in New York", "https://www.thebrokebackpacker.com/best-hostels-in-new-york-usa/"),
    source("Booking.com - New York hostels", "https://www.booking.com/hostels/city/us/new-york.html"),
    source("Google Travel - New York hostels", "https://www.google.com/travel/hotels/New%20York%20City?q=hostels%20new%20york%20city"),
  ],
  casualBars: [
    source("Top organic result: Time Out - Best dive bars in NYC", "https://www.timeout.com/newyork/bars/best-dive-bars-in-new-york"),
    source("Eater NY - Classic bars in NYC", "https://ny.eater.com/maps/classic-bars-nyc"),
    source("The Infatuation - Best Bars in NYC", "https://www.theinfatuation.com/new-york/guides/best-bars-nyc"),
    source("NYC LGBT Historic Sites Project", "https://www.nyclgbtsites.org/"),
    source("Google Maps - NYC dive bars", maps("best dive bars New York City")),
  ],
  cocktails: [
    source("Top organic result: Time Out - Best cocktail bars in NYC", "https://www.timeout.com/newyork/bars/best-cocktail-bars-in-new-york"),
    source("Eater NY - Best cocktail bars in NYC", "https://ny.eater.com/maps/best-cocktail-bars-nyc"),
    source("The Infatuation - Best cocktail bars NYC", "https://www.theinfatuation.com/new-york/guides/best-cocktail-bars-nyc"),
    source("World's 50 Best Bars - New York", "https://www.worlds50bestbars.com/"),
    source("Punch - New York cocktail bars", "https://punchdrink.com/"),
  ],
  culture: [
    source("Top organic result: NYC Tourism - Museums and Galleries", "https://www.nyctourism.com/museums-galleries/"),
    source("Time Out - Best museums in NYC", "https://www.timeout.com/newyork/museums/best-museums-in-nyc"),
    source("New York Magazine - Museums", "https://nymag.com/tags/museums/"),
    source("NYC Arts", "https://www.nyc-arts.org/"),
    source("Google Maps - NYC museums", maps("best museums culture New York City")),
  ],
  activities: [
    source("Top organic result: NYC Tourism - Things to Do", "https://www.nyctourism.com/things-to-do/"),
    source("Time Out - Best things to do in NYC", "https://www.timeout.com/newyork/things-to-do/best-things-to-do-in-new-york"),
    source("Lonely Planet - Best things to do in New York City", "https://www.lonelyplanet.com/articles/top-things-to-do-in-new-york-city"),
    source("Central Park Conservancy", "https://www.centralparknyc.org/"),
    source("National Park Service - Statue of Liberty and Ellis Island", "https://www.nps.gov/stli/index.htm"),
  ],
};

type StopInput = {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  officialUrl: string;
  photo: string;
  hours: string;
  mapQuery?: string;
  editorialUrls?: string[];
  price?: GuideStop["price"];
  priceSource?: string;
  bookingUrl?: string;
  venueKind?: GuideStop["venueKind"];
  foodServiceType?: GuideStop["foodServiceType"];
  cuisineTypes?: string[];
  nightlifeType?: GuideStop["nightlifeType"];
  musicGenres?: string[];
  lodgingType?: GuideStop["lodgingType"];
  subcategory?: string;
  attributeTags?: string[];
};

function stop(input: StopInput): GuideStop {
  const mapUrl = maps(input.mapQuery ?? `${input.name} New York City`);
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
    hours: { default: input.hours },
    photo: input.photo,
    imageSourceUrl: input.photo,
    sourceUrls: [...new Set(sourceUrls)],
    sourceEvidence: {
      officialUrl: input.officialUrl,
      mapUrl,
      currentStatusUrl: mapUrl,
      imageSourceUrl: input.photo,
      editorialUrls: input.editorialUrls ?? [],
      checkedAt,
      notes: "Official page plus Google Maps search/listing evidence checked for current status; no permanent-closure warning found in the source set.",
    },
  };
}

const diningStops = [
  stop({
    id: "nyc-dining-katzs",
    name: "Katz's Delicatessen",
    coordinates: [40.722233, -73.987429],
    description: "Katz's is the Lower East Side deli ritual that still makes sense when the line is part of the theater: ticket in hand, cutters moving fast, pastrami doing the heavy lifting. Go early or at an off-hour, order directly at the counter, and treat it as history you can actually eat rather than a quiet meal.",
    officialUrl: "https://katzsdelicatessen.com/",
    photo: images.katz,
    hours: "Official and map listings show daily service with late-night/24-hour periods varying by day; verify same-day hours before going.",
    price: "$$",
    priceSource: "Official menu / Google Maps",
    venueKind: "food_drink",
    foodServiceType: "counter_service",
    cuisineTypes: ["jewish_deli", "sandwiches", "new_york_classic"],
    attributeTags: ["classic", "counter_service", "lively", "historic", "solo_friendly"],
    editorialUrls: ["https://ny.eater.com/venue/11022/katz-s-delicatessen", "https://www.timeout.com/newyork/restaurants/katzs-delicatessen"],
  }),
  stop({
    id: "nyc-dining-russ-daughters",
    name: "Russ & Daughters",
    coordinates: [40.722758, -73.988203],
    description: "Russ & Daughters is the appetizing-shop counter that explains a whole corner of New York food culture through smoked fish, bagels, babka, and patient ticket-number choreography. Use the shop for takeaway or the cafe for a seated version; weekends are not the moment to discover you dislike waiting.",
    officialUrl: "https://www.russanddaughters.com/",
    photo: images.russ,
    hours: "Shop and cafe schedules vary by location; check the official hours page before choosing takeaway or a seated meal.",
    price: "$$",
    priceSource: "Official menu / Google Maps",
    venueKind: "food_drink",
    foodServiceType: "counter_service",
    cuisineTypes: ["jewish_appetizing", "bagels", "smoked_fish"],
    attributeTags: ["classic", "breakfast", "takeaway", "historic", "counter_service"],
    editorialUrls: ["https://www.theinfatuation.com/new-york/reviews/russ-daughters-cafe", "https://ny.eater.com/venue/3028/russ-daughters"],
  }),
  stop({
    id: "nyc-dining-keens",
    name: "Keens Steakhouse",
    coordinates: [40.750914, -73.986688],
    description: "Keens is the steakhouse to book when you want New York density without glass-tower anonymity: low ceilings, clay pipes overhead, mutton chop mythology, and a room that feels older than your itinerary. It belongs here because the setting is as important as the beef; reserve and do not rush it before a show.",
    officialUrl: "https://www.keens.com/",
    photo: images.keens,
    hours: "Lunch and dinner service are posted by day on the official site; reservations strongly recommended.",
    price: "$$$$",
    priceSource: "Official menu / reservation platform",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["steakhouse", "american", "historic_new_york"],
    attributeTags: ["reservation_recommended", "historic", "date_night", "classic", "midtown"],
    editorialUrls: ["https://ny.eater.com/maps/classic-restaurants-nyc", "https://www.theinfatuation.com/new-york/reviews/keens-steakhouse"],
  }),
  stop({
    id: "nyc-dining-peter-luger",
    name: "Peter Luger Steak House",
    coordinates: [40.709946, -73.962302],
    description: "Peter Luger is still the Williamsburg steakhouse argument: gruff service, porterhouse rituals, and a reputation that people love either defending or dismantling. Go because it is a New York institution, not because it is subtle; bring cash awareness, reserve ahead, and let the creamed spinach do its job.",
    officialUrl: "https://peterluger.com/",
    photo: images.peterLuger,
    hours: "Official site lists lunch and dinner service by day; reservations recommended and payment rules should be checked before arrival.",
    price: "$$$$",
    priceSource: "Official menu / reservation platform",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["steakhouse", "american", "brooklyn_classic"],
    attributeTags: ["reservation_recommended", "historic", "brooklyn", "classic", "group_meal"],
    editorialUrls: ["https://ny.eater.com/maps/classic-restaurants-nyc", "https://guide.michelin.com/us/en/new-york-state/new-york/restaurant/peter-luger"],
  }),
  stop({
    id: "nyc-dining-sylvias",
    name: "Sylvia's Restaurant",
    coordinates: [40.808007, -73.944864],
    description: "Sylvia's gives the guide a Harlem anchor where fried chicken, ribs, collards, cornbread, and Sunday gospel-brunch memory sit inside one of the city's most famous Black-owned restaurants. It is best when paired with Apollo Theater or Studio Museum plans; expect crowds and a landmark mood more than quiet discovery.",
    officialUrl: "https://sylviasrestaurant.com/",
    photo: images.sylvias,
    hours: "Official site posts daily restaurant hours and special brunch/service notes; verify holiday and event schedules.",
    price: "$$",
    priceSource: "Official menu / Google Maps",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["soul_food", "american", "harlem"],
    attributeTags: ["historic", "family_friendly", "lively", "brunch", "harlem"],
    editorialUrls: ["https://ny.eater.com/maps/best-soul-food-restaurants-nyc", "https://www.timeout.com/newyork/restaurants/sylvias"],
  }),
  stop({
    id: "nyc-dining-nom-wah",
    name: "Nom Wah Tea Parlor",
    coordinates: [40.714512, -73.998235],
    description: "Nom Wah earns its spot because Doyers Street, old-school booths, and dim sum classics make the meal feel attached to Chinatown rather than airlifted into it. Order broadly, keep expectations practical during peak hours, and use it as a neighborhood hinge before walking the Lower East Side or the Manhattan Bridge approach.",
    officialUrl: "https://nomwah.com/",
    photo: images.nomWah,
    hours: "Official site and map listings show daily dim sum service; check same-day hours and location-specific notes.",
    price: "$$",
    priceSource: "Official menu / Google Maps",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["dim_sum", "cantonese", "chinatown"],
    attributeTags: ["historic", "lunch", "group_meal", "walk_in_friendly", "chinatown"],
    editorialUrls: ["https://ny.eater.com/maps/best-dim-sum-restaurants-nyc", "https://www.theinfatuation.com/new-york/reviews/nom-wah-tea-parlor"],
  }),
  stop({
    id: "nyc-dining-oyster-bar",
    name: "Grand Central Oyster Bar",
    coordinates: [40.752746, -73.977229],
    description: "Grand Central Oyster Bar is the seafood room that belongs to the terminal as much as to the menu: vaulted tile, commuters overhead, and a counter where oysters can turn transit into dinner. Go for a Midtown lunch, a pre-train martini-and-shellfish stop, or the architecture; verify hours because service is not late-night.",
    officialUrl: "https://www.oysterbarny.com/",
    photo: images.oysterBar,
    hours: "Official site posts weekday and Saturday service with Sunday closures/changes; check current hours before routing through Grand Central.",
    price: "$$$",
    priceSource: "Official menu / Google Maps",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["seafood", "oyster_bar", "american"],
    attributeTags: ["historic", "midtown", "counter_service", "lunch", "architecture"],
    editorialUrls: ["https://ny.eater.com/maps/classic-restaurants-nyc", "https://www.timeout.com/newyork/restaurants/grand-central-oyster-bar"],
  }),
  stop({
    id: "nyc-dining-tavern-green",
    name: "Tavern on the Green",
    coordinates: [40.772246, -73.977619],
    description: "Tavern on the Green is here for the Central Park setting, not because every New York meal needs chandeliers and ceremony. It works best as a planned lunch, brunch, or celebratory dinner after a west-side park route; book ahead and accept that the room and terrace are part of the bill.",
    officialUrl: "https://www.tavernonthegreen.com/",
    photo: images.tavernGreen,
    hours: "Official site posts brunch, lunch, dinner, and bar hours by day; reservations recommended.",
    price: "$$$",
    priceSource: "Official menu / reservation platform",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["american", "park_restaurant", "brunch"],
    attributeTags: ["scenic", "reservation_recommended", "brunch", "romantic", "central_park"],
    editorialUrls: ["https://www.timeout.com/newyork/restaurants/tavern-on-the-green", "https://www.nyctourism.com/restaurants/tavern-on-the-green/"],
  }),
  stop({
    id: "nyc-dining-veselka",
    name: "Veselka",
    coordinates: [40.729162, -73.986019],
    description: "Veselka gives the guide a Ukrainian East Village classic where pierogi, borscht, latkes, and late-service muscle make sense after theater, bars, or a long downtown walk. It is useful because it is democratic and durable; expect bustle, not hushed dining.",
    officialUrl: "https://www.veselka.com/",
    photo: images.veselka,
    hours: "Official site posts daily hours and location-specific updates; late hours can change, so verify before counting on a post-midnight meal.",
    price: "$$",
    priceSource: "Official menu / Google Maps",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["ukrainian", "diner", "comfort_food"],
    attributeTags: ["late_night", "east_village", "casual", "classic", "solo_friendly"],
    editorialUrls: ["https://ny.eater.com/maps/classic-restaurants-nyc", "https://www.theinfatuation.com/new-york/reviews/veselka"],
  }),
  stop({
    id: "nyc-dining-lombardis",
    name: "Lombardi's",
    coordinates: [40.72157, -73.995594],
    description: "Lombardi's is the coal-oven pizza marker that still earns a place when you frame it as New York food history rather than the city's final pizza answer. Split a pie, avoid peak tourist crush when possible, and use the stop as a Little Italy/SoHo hinge.",
    officialUrl: "https://www.firstpizza.com/",
    photo: images.lombardis,
    hours: "Official site and map listings show daily lunch and dinner service; verify same-day hours before going.",
    price: "$$",
    priceSource: "Official menu / Google Maps",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["pizza", "italian_american", "coal_oven"],
    attributeTags: ["classic", "group_meal", "historic", "casual", "nolita"],
    editorialUrls: ["https://ny.eater.com/maps/best-pizza-nyc", "https://www.timeout.com/newyork/restaurants/lombardis-pizza"],
  }),
];

const cheapEatStops = [
  stop({ id: "nyc-cheap-grays-papaya", name: "Gray's Papaya", coordinates: [40.778984, -73.981812], description: "Gray's Papaya is the Upper West Side hot-dog counter that solves the problem of eating cheaply without turning lunch into a project. Get the Recession Special if it is available, keep the order simple, and use it before or after Central Park or Lincoln Center.", officialUrl: "https://www.grayspapaya.nyc/", photo: images.graysPapaya, hours: "Official and map listings show long daily counter-service hours; verify late-night hours before relying on them.", price: "$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "fast_food", cuisineTypes: ["hot_dogs", "american", "counter_service"], attributeTags: ["budget", "quick_meal", "late_night", "classic", "solo_friendly"], editorialUrls: ["https://ny.eater.com/maps/best-cheap-eats-nyc", "https://www.timeout.com/newyork/restaurants/grays-papaya"] }),
  stop({ id: "nyc-cheap-joes-pizza", name: "Joe's Pizza", coordinates: [40.730554, -74.002142], description: "Joe's is the slice-shop baseline: hot plain slices, quick turnover, and a line that usually moves faster than it looks. It belongs in cheap eats because it is useful at almost any hour downtown; do not overthink toppings when the cheese slice is the point.", officialUrl: "https://www.joespizzanyc.com/", photo: images.joesPizza, hours: "Official site lists location-specific daily hours, including late hours at some branches; verify the Carmine Street listing.", price: "$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["pizza", "new_york_slice", "italian_american"], attributeTags: ["budget", "quick_meal", "late_night", "walk_in_friendly", "classic"], editorialUrls: ["https://ny.eater.com/maps/best-pizza-nyc", "https://www.theinfatuation.com/new-york/reviews/joes-pizza"] }),
  stop({ id: "nyc-cheap-mamouns", name: "Mamoun's Falafel", coordinates: [40.730216, -74.000087], description: "Mamoun's gives Greenwich Village a cheap, fast falafel anchor that still works when the neighborhood gets expensive around it. The move is simple: falafel sandwich, hot sauce with care, and a short stop before comedy, bars, or Washington Square Park.", officialUrl: "https://mamouns.com/", photo: images.mamouns, hours: "Official site posts location-specific daily hours; verify late-night service before planning around it.", price: "$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "fast_casual", cuisineTypes: ["falafel", "middle_eastern", "vegetarian"], attributeTags: ["budget", "quick_meal", "vegetarian", "late_night", "village"], editorialUrls: ["https://ny.eater.com/maps/best-cheap-eats-nyc", "https://www.timeout.com/newyork/restaurants/mamouns-falafel"] }),
  stop({ id: "nyc-cheap-xian-famous-foods", name: "Xi'an Famous Foods", coordinates: [40.715874, -73.997031], description: "Xi'an Famous Foods belongs here because hand-ripped noodles, cumin lamb, and spicy-sour flavors give cheap eating real force instead of filler. Use a central branch for a fast lunch, but know spice and noodle texture are the reason to go, not lingering atmosphere.", officialUrl: "https://www.xianfoods.com/", photo: images.xian, hours: "Official site posts branch-specific daily hours; check the chosen location before routing.", price: "$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "fast_casual", cuisineTypes: ["xian", "noodles", "chinese"], attributeTags: ["budget", "quick_meal", "spicy", "counter_service", "solo_friendly"], editorialUrls: ["https://ny.eater.com/maps/best-cheap-eats-nyc", "https://www.theinfatuation.com/new-york/reviews/xian-famous-foods"] }),
  stop({ id: "nyc-cheap-vanessas", name: "Vanessa's Dumpling House", coordinates: [40.718329, -73.991576], description: "Vanessa's is the dumpling-and-sesame-pancake stop that makes sense when you need real food for very little money between Chinatown and the Lower East Side. It is fast, crowded, and transactional in the best way; order for the table and move on.", officialUrl: "https://www.vanessas.com/", photo: images.vanessas, hours: "Official site and map listings show daily service by location; verify Eldridge Street hours before going.", price: "$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["dumplings", "chinese", "cheap_eats"], attributeTags: ["budget", "quick_meal", "group_meal", "counter_service", "chinatown_edge"], editorialUrls: ["https://ny.eater.com/maps/best-cheap-eats-nyc", "https://www.theinfatuation.com/new-york/reviews/vanessas-dumpling-house"] }),
  stop({ id: "nyc-cheap-los-tacos", name: "Los Tacos No. 1", coordinates: [40.742279, -74.006445], description: "Los Tacos No. 1 is popular because the adobada, carne asada, tortillas, and quick counter rhythm actually justify the line. Use Chelsea Market or Times Square when it fits the route, but do not make it your only Mexican-food plan in the city.", officialUrl: "https://www.lostacos1.com/", photo: images.losTacos, hours: "Official site lists location-specific daily hours; verify the branch before going.", price: "$$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["tacos", "mexican", "counter_service"], attributeTags: ["quick_meal", "popular", "counter_service", "chelsea", "group_meal"], editorialUrls: ["https://ny.eater.com/maps/best-cheap-eats-nyc", "https://www.theinfatuation.com/new-york/reviews/los-tacos-no-1"] }),
  stop({ id: "nyc-cheap-absolute-bagels", name: "Absolute Bagels", coordinates: [40.802546, -73.967807], description: "Absolute Bagels is the uptown bagel stop for travelers who understand breakfast can be worth a subway ride. Go early, expect cash/counter pragmatism depending on current policy, and build a park or Columbia morning around it rather than dragging a huge itinerary there at noon.", officialUrl: "https://www.google.com/maps/search/?api=1&query=Absolute%20Bagels%20New%20York%20City", photo: images.absoluteBagels, hours: "Current-status evidence is map-based; hours can change after ownership and operations shifts, so verify before going.", price: "$", priceSource: "Google Maps / posted menu evidence", venueKind: "food_drink", foodServiceType: "bakery", cuisineTypes: ["bagels", "breakfast", "bakery"], attributeTags: ["budget", "breakfast", "counter_service", "uptown", "takeaway"], editorialUrls: ["https://ny.eater.com/maps/best-bagels-nyc", "https://www.theinfatuation.com/new-york/reviews/absolute-bagels"] }),
  stop({ id: "nyc-cheap-punjabi-deli", name: "Punjabi Deli", coordinates: [40.723172, -73.996497], description: "Punjabi Deli is the taxi-driver counter that turns rice, chana, saag, samosas, and chai into one of downtown's most useful budget meals. The space is small and functional; go because it feeds you honestly between SoHo, Nolita, and the Lower East Side.", officialUrl: "https://www.punjabidelinyc.com/", photo: images.punjabiDeli, hours: "Official and map listings show long daily hours; verify late-night service before relying on it.", price: "$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["punjabi", "indian", "vegetarian"], attributeTags: ["budget", "vegetarian", "quick_meal", "counter_service", "late_night"], editorialUrls: ["https://ny.eater.com/maps/best-cheap-eats-nyc", "https://www.theinfatuation.com/new-york/reviews/punjabi-deli"] }),
  stop({ id: "nyc-cheap-tasty-hand-pulled", name: "Tasty Hand-Pulled Noodles", coordinates: [40.714119, -73.997199], description: "Tasty Hand-Pulled Noodles gives Chinatown a bare-bones noodle stop where the pull, broth, and wok-char matter more than polish. It is best for a fast, filling meal when you are already downtown; bring patience for cramped tables and simple service.", officialUrl: "https://www.tastyhandpullednoodlesnyc.com/", photo: images.tastyNoodles, hours: "Official ordering/map pages show daily service; verify hours before making it a late meal.", price: "$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["noodles", "chinese", "chinatown"], attributeTags: ["budget", "quick_meal", "casual", "chinatown", "solo_friendly"], editorialUrls: ["https://ny.eater.com/maps/best-cheap-eats-nyc", "https://www.theinfatuation.com/new-york/reviews/tasty-hand-pulled-noodles"] }),
  stop({ id: "nyc-cheap-taim", name: "Taïm", coordinates: [40.735948, -74.001522], description: "Taïm is the practical falafel-and-sabich stop for days when you need something fresh, fast, and vegetarian-friendly without turning lunch into a reservation. It is a chain now, but still useful; pick the branch that fits the walk rather than crossing town for it.", officialUrl: "https://www.taimfalafel.com/", photo: images.taim, hours: "Official site lists location-specific hours; verify the branch before going.", price: "$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "fast_casual", cuisineTypes: ["falafel", "israeli", "vegetarian"], attributeTags: ["budget", "vegetarian", "quick_meal", "healthy", "fast_casual"], editorialUrls: ["https://ny.eater.com/maps/best-cheap-eats-nyc", "https://www.timeout.com/newyork/restaurants/taim"] }),
];

const hotelStops = [
  stop({ id: "nyc-hotel-plaza", name: "The Plaza Hotel", coordinates: [40.764489, -73.974488], description: "The Plaza is the Central Park South fantasy hotel: grand public rooms, high-service ceremony, and a location that makes Fifth Avenue, the park, and Midtown feel immediately legible. Book it for occasion travel and accept that the price is partly about iconography.", officialUrl: "https://www.theplazany.com/", bookingUrl: "https://www.theplazany.com/rooms-suites/", photo: images.plaza, hours: "Hotel operates 24 hours daily; restaurants, afternoon tea, and spa keep separate schedules.", price: "$$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "central", "romantic", "historic", "family_friendly"], editorialUrls: ["https://www.cntraveler.com/hotels/new-york/the-plaza-hotel", "https://guide.michelin.com/us/en/hotels-stays/new-york/the-plaza-11724"] }),
  stop({ id: "nyc-hotel-chelsea", name: "Hotel Chelsea", coordinates: [40.744413, -73.996802], description: "Hotel Chelsea is the stay for travelers who want New York mythology with real rooms attached: artists, writers, long corridors, and a restored building that still carries downtown charge. It works best if Chelsea, galleries, and nightlife matter more than hushed corporate predictability.", officialUrl: "https://hotelchelsea.com/", bookingUrl: "https://hotelchelsea.com/rooms/", photo: images.chelseaHotel, hours: "Hotel operates 24 hours daily; restaurant and bar schedules vary.", price: "$$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["design", "historic", "central", "lively", "romantic"], editorialUrls: ["https://www.cntraveler.com/hotels/new-york/hotel-chelsea", "https://www.travelandleisure.com/hotel-chelsea-new-york-city-review-7480891"] }),
  stop({ id: "nyc-hotel-beekman", name: "The Beekman, A Thompson Hotel", coordinates: [40.711337, -74.006983], description: "The Beekman is a downtown base with a dramatic atrium, restored Temple Court bones, and easy access to City Hall, Tribeca, FiDi, and the Brooklyn Bridge. It is strongest for travelers who want architectural drama and downtown routing, not instant Central Park access.", officialUrl: "https://www.thebeekman.com/", bookingUrl: "https://www.thebeekman.com/rooms/", photo: images.beekman, hours: "Hotel operates 24 hours daily; restaurants and bars keep separate schedules.", price: "$$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "design", "historic", "downtown", "romantic"], editorialUrls: ["https://www.cntraveler.com/hotels/new-york/the-beekman-a-thompson-hotel", "https://guide.michelin.com/us/en/hotels-stays/new-york/the-beekman-a-thompson-hotel-6867"] }),
  stop({ id: "nyc-hotel-bowery", name: "The Bowery Hotel", coordinates: [40.726145, -73.991381], description: "The Bowery Hotel gives the guide a downtown stay with fireplaces, velvet, brick, and an East Village/NoHo address that feels useful after dinner and bars. It is not the cheapest downtown base; book it when atmosphere and neighborhood walking matter.", officialUrl: "https://theboweryhotel.com/", bookingUrl: "https://theboweryhotel.com/rooms/", photo: images.boweryHotel, hours: "Hotel operates 24 hours daily; restaurant and lounge hours vary.", price: "$$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["design", "romantic", "central", "nightlife_nearby", "luxury"], editorialUrls: ["https://www.cntraveler.com/hotels/new-york/the-bowery-hotel", "https://www.travelandleisure.com/hotels-resorts/boutique-hotels/bowery-hotel-new-york-review"] }),
  stop({ id: "nyc-hotel-standard-high-line", name: "The Standard, High Line", coordinates: [40.740995, -74.007652], description: "The Standard is the Meatpacking stay for views, nightlife proximity, and a High Line address that makes west-side wandering easy. It is best for travelers who want scene and skyline more than quiet retreat; check room category carefully if noise sensitivity matters.", officialUrl: "https://www.standardhotels.com/new-york/properties/high-line", bookingUrl: "https://www.standardhotels.com/new-york/properties/high-line/rooms", photo: images.standardHighLine, hours: "Hotel operates 24 hours daily; rooftop, restaurants, and clubs keep separate schedules.", price: "$$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["design", "lively", "scenic", "nightlife_nearby", "luxury"], editorialUrls: ["https://www.cntraveler.com/hotels/new-york/the-standard-high-line", "https://guide.michelin.com/us/en/hotels-stays/new-york/the-standard-high-line-5854"] }),
  stop({ id: "nyc-hotel-carlyle", name: "The Carlyle, A Rosewood Hotel", coordinates: [40.774415, -73.963301], description: "The Carlyle is the Upper East Side choice when museums, Central Park, Bemelmans, and old New York discretion are the point. It belongs in hotels because the bar, service culture, and neighborhood create a complete base; it is formal, expensive, and proudly not downtown.", officialUrl: "https://www.rosewoodhotels.com/en/the-carlyle-new-york", bookingUrl: "https://www.rosewoodhotels.com/en/the-carlyle-new-york/accommodation", photo: images.carlyle, hours: "Hotel operates 24 hours daily; Bemelmans Bar, Cafe Carlyle, and dining keep separate schedules.", price: "$$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "quiet", "historic", "romantic", "upper_east_side"], editorialUrls: ["https://www.cntraveler.com/hotels/new-york/the-carlyle-a-rosewood-hotel", "https://guide.michelin.com/us/en/hotels-stays/new-york/the-carlyle-a-rosewood-hotel-5830"] }),
  stop({ id: "nyc-hotel-ludlow", name: "The Ludlow Hotel", coordinates: [40.72194, -73.987261], description: "The Ludlow is the Lower East Side hotel for travelers who want downtown restaurants, bars, galleries, and subway reach without staying in a glass tower. Rooms can be compact, so book for neighborhood energy and views rather than square footage.", officialUrl: "https://www.ludlowhotel.com/", bookingUrl: "https://www.ludlowhotel.com/rooms/", photo: images.ludlow, hours: "Hotel operates 24 hours daily; restaurant and lounge schedules vary.", price: "$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["design", "central", "nightlife_nearby", "midrange", "downtown"], editorialUrls: ["https://www.cntraveler.com/hotels/new-york/the-ludlow-hotel", "https://guide.michelin.com/us/en/hotels-stays/new-york/the-ludlow-hotel-6444"] }),
  stop({ id: "nyc-hotel-ace", name: "Ace Hotel New York", coordinates: [40.745764, -73.988101], description: "Ace Hotel New York is the NoMad base for travelers who like lobby life, design looseness, and easy subway access more than luxury polish. It is useful for first visits because Midtown, Flatiron, Chelsea, and downtown all stay reachable.", officialUrl: "https://acehotel.com/new-york/", bookingUrl: "https://acehotel.com/new-york/rooms/", photo: images.ace, hours: "Hotel operates 24 hours daily; lobby, restaurant, and bar programming vary.", price: "$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["design", "central", "work_friendly", "lively", "midrange"], editorialUrls: ["https://www.cntraveler.com/hotels/new-york/ace-hotel-new-york", "https://guide.michelin.com/us/en/hotels-stays/new-york/ace-hotel-new-york-5820"] }),
  stop({ id: "nyc-hotel-twa", name: "TWA Hotel", coordinates: [40.645994, -73.777302], description: "TWA Hotel is not a city-center base; it is the airport stay that turns an early flight or aviation obsession into something memorable. Book it for JFK logistics, the Saarinen terminal, pool deck, and design nostalgia, then keep Manhattan expectations out of the decision.", officialUrl: "https://www.twahotel.com/", bookingUrl: "https://www.twahotel.com/rooms", photo: images.twa, hours: "Hotel operates 24 hours daily; pool, bars, and exhibits keep separate schedules.", price: "$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["design", "airport", "historic", "family_friendly", "scenic"], editorialUrls: ["https://www.cntraveler.com/hotels/new-york/twa-hotel", "https://guide.michelin.com/us/en/hotels-stays/new-york/twa-hotel-11662"] }),
  stop({ id: "nyc-hotel-marlton", name: "The Marlton Hotel", coordinates: [40.732592, -73.99725], description: "The Marlton is a Greenwich Village small-hotel choice with literary ghosts, compact rooms, and a location that makes downtown walking feel natural. It is best for travelers who value neighborhood texture over resort amenities; book room size with honest expectations.", officialUrl: "https://www.marltonhotel.com/", bookingUrl: "https://www.marltonhotel.com/rooms/", photo: images.marlton, hours: "Hotel operates 24 hours daily; restaurant and bar hours vary.", price: "$$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["design", "romantic", "central", "historic", "quiet"], editorialUrls: ["https://www.cntraveler.com/hotels/new-york/the-marlton-hotel", "https://guide.michelin.com/us/en/hotels-stays/new-york/the-marlton-hotel-5945"] }),
];

const hostelStops = [
  stop({ id: "nyc-hostel-hi-nyc", name: "HI New York City Hostel", coordinates: [40.798765, -73.966018], description: "HI New York City is the big, practical hostel option near the Upper West Side and subway lines, with dorms, private rooms, common spaces, and enough scale for solo travelers to find people. It is not downtown-cool, but it is useful, social, and close to Central Park.", officialUrl: "https://www.hiusa.org/find-hostels/new-york/new-york-891-amsterdam-ave", bookingUrl: "https://www.hiusa.org/find-hostels/new-york/new-york-891-amsterdam-ave", photo: images.hiNyc, hours: "Hostel reception/check-in runs daily; dorm and private room availability changes by date, so verify before booking.", price: "$$", priceSource: "Official booking site / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "social", "central", "solo_friendly", "family_friendly"], editorialUrls: ["https://www.hostelworld.com/hostels/p/1856/hi-new-york-city-hostel/", "https://hostelgeeks.com/best-hostels-in-new-york-city-usa/"] }),
  stop({ id: "nyc-hostel-local-ny", name: "The Local NY", coordinates: [40.747032, -73.95077], description: "The Local NY gives Queens a social hostel with dorms, private rooms, a bar, workspace energy, and quick subway access to Midtown. It belongs here because Long Island City can be a smarter base than forcing every budget traveler into Manhattan.", officialUrl: "https://www.thelocalny.com/", bookingUrl: "https://www.thelocalny.com/rooms/", photo: images.localNyc, hours: "Reception/check-in information is posted by the hostel; dorms and private rooms are date-dependent.", price: "$$", priceSource: "Official booking site / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "social", "work_friendly", "queens", "private_rooms"], editorialUrls: ["https://www.hostelworld.com/hostels/p/84599/the-local-ny/", "https://hostelgeeks.com/best-hostels-in-new-york-city-usa/"] }),
  stop({ id: "nyc-hostel-q4", name: "Q4 Hotel & Hostel", coordinates: [40.75022, -73.940943], description: "Q4 Hotel & Hostel is a Long Island City budget base with dorms, private rooms, and subway convenience for travelers who want lower rates without being stranded. The tradeoff is simple: less Manhattan romance, more practical access and price control.", officialUrl: "https://q4hotel.com/", bookingUrl: "https://q4hotel.com/rooms/", photo: images.q4, hours: "Hotel/hostel check-in runs daily; dorm and private inventory changes by date.", price: "$$", priceSource: "Official booking site / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "queens", "private_rooms", "dorms", "transit_friendly"], editorialUrls: ["https://www.hostelworld.com/hostels/p/78292/q4-hotel-and-hostel/", "https://www.booking.com/hostels/city/us/new-york.html"] }),
  stop({ id: "nyc-hostel-ny-moore", name: "NY Moore Hostel", coordinates: [40.704554, -73.933902], description: "NY Moore Hostel is the Brooklyn choice for travelers who want dorms, private rooms, bigger common areas, and Bushwick/Williamsburg access rather than Manhattan compression. It is best for budget travelers comfortable with subway time and a more residential-feeling base.", officialUrl: "https://www.nymoorehostel.com/", bookingUrl: "https://www.nymoorehostel.com/rooms/", photo: images.nyMoore, hours: "Reception/check-in runs daily; dorm and private room availability should be verified before booking.", price: "$$", priceSource: "Official booking site / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "brooklyn", "social", "private_rooms", "dorms"], editorialUrls: ["https://www.hostelworld.com/hostels/p/59834/ny-moore-hostel/", "https://hostelgeeks.com/best-hostels-in-new-york-city-usa/"] }),
  stop({ id: "nyc-hostel-west-side-ymca", name: "West Side YMCA", coordinates: [40.770826, -73.980451], description: "West Side YMCA is a bare-bones Central Park/Lincoln Center budget base with private-style rooms and shared-facility practicality rather than hostel-party energy. It belongs here because location can beat amenities for some travelers; read room and bathroom details carefully before booking.", officialUrl: "https://ymcanyc.org/locations/west-side-ymca/guest-rooms", bookingUrl: "https://ymcanyc.org/locations/west-side-ymca/guest-rooms", photo: images.westSideYmca, hours: "Guest room operations run daily; facilities and check-in policies vary, so verify before booking.", price: "$$", priceSource: "Official booking site / Booking.com", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "central", "quiet", "private_rooms", "family_friendly"], editorialUrls: ["https://www.booking.com/hostels/city/us/new-york.html", "https://www.google.com/travel/hotels/New%20York%20City?q=West%20Side%20YMCA%20guest%20rooms"] }),
  stop({ id: "nyc-hostel-chelsea-international", name: "Chelsea International Hostel", coordinates: [40.742785, -74.000129], description: "Chelsea International Hostel is a central, no-frills hostel with dorms and private rooms for travelers who want Manhattan address value over design polish. It works when Chelsea, the High Line, and Village plans matter; check current policies and room type details before booking.", officialUrl: "https://www.chelseahostel.com/", bookingUrl: "https://www.chelseahostel.com/", photo: images.chelseaInternational, hours: "Hostel operates daily; dorm and private room inventory changes by date.", price: "$$", priceSource: "Official booking site / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "central", "dorms", "private_rooms", "transit_friendly"], editorialUrls: ["https://www.hostelworld.com/hostels/p/801/chelsea-international-hostel/", "https://www.booking.com/hostels/city/us/new-york.html"] }),
  stop({ id: "nyc-hostel-nap-york", name: "Nap York Central Park Sleep Station", coordinates: [40.765092, -73.981919], description: "Nap York is the pod-style Midtown option for travelers who prioritize sleep, location, and a lower private-feeling footprint over hostel social life. It is useful for short stays and solo travelers; verify pod size, shared facilities, and check-in rules before committing.", officialUrl: "https://napyork.com/", bookingUrl: "https://napyork.com/", photo: images.napYork, hours: "Property operates daily; pod availability and check-in rules are booking-date specific.", price: "$$", priceSource: "Official booking site / Google Travel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "central", "quiet", "solo_friendly", "private_rooms"], editorialUrls: ["https://www.booking.com/hostels/city/us/new-york.html", "https://www.google.com/travel/hotels/New%20York%20City?q=Nap%20York%20Central%20Park%20Sleep%20Station"] }),
  stop({ id: "nyc-hostel-east-harlem", name: "East Harlem Hostel", coordinates: [40.797928, -73.941372], description: "East Harlem Hostel is a family-run, no-frills budget stay for travelers who want a clean uptown base near the 116th Street subway rather than a Midtown price tag. It is better framed as a simple hostel/budget-room option than a social party hostel; check whether your date has dorm-style beds, private rooms, or shared-bath private rooms before booking.", officialUrl: "https://www.theneighborhoodhostel.com/", bookingUrl: "https://www.theneighborhoodhostel.com/", photo: images.eastHarlemHostel, hours: "Open 24 hours daily; room types and self-check-in details should be verified before booking.", price: "$", priceSource: "Official booking site / Hostelworld / Google Travel", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "uptown", "private_rooms", "transit_friendly", "no_frills"], editorialUrls: ["https://www.hostelworld.com/hostels/p/323639/east-harlem-hostel/", "https://www.concerthotels.com/hotel/east-harlem-hostel/584577"] }),
  stop({ id: "nyc-hostel-american-dream", name: "American Dream Hostel", coordinates: [40.737113, -73.984344], description: "American Dream Hostel is a Gramercy/Flatiron budget base with private rooms and shared-bath practicality, better for travelers who want calm and location than a party-hostel setup. It fits this guide because Manhattan value is scarce; verify room categories and breakfast/current amenities.", officialUrl: "https://www.americandreamhostel.com/", bookingUrl: "https://www.americandreamhostel.com/", photo: images.americanDream, hours: "Property operates daily; private room availability and check-in policies are date-specific.", price: "$$", priceSource: "Official booking site / Booking.com", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "central", "quiet", "private_rooms", "transit_friendly"], editorialUrls: ["https://www.booking.com/hostels/city/us/new-york.html", "https://www.google.com/travel/hotels/New%20York%20City?q=American%20Dream%20Hostel"] }),
  stop({ id: "nyc-hostel-kama-central-park", name: "Kama Central Park Hostel", coordinates: [40.79943, -73.960558], description: "Kama Central Park Hostel is an Upper West Side pod-hostel with enclosed sleep pods, private ensuite rooms, a coffee bar, shared kitchen, rooftop garden, and Central Park access. Use it when privacy matters more than classic bunk-bed hostel energy; verify whether your date has pod dorms, private pods, or queen private rooms available.", officialUrl: "https://www.kamahostel.com/", bookingUrl: "https://hotels.cloudbeds.com/en/reservation/4kVvq7", photo: images.kamaCentralPark, hours: "Open 24 hours daily; pod, dorm, and private-room availability changes by date.", price: "$$", priceSource: "Official booking site / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "pods", "private_rooms", "central_park", "uptown"], editorialUrls: ["https://www.hostelworld.com/hostels/p/317612/kama-central-park/", "https://www.kamahostel.com/about-us"] }),
];

const casualBarStops = [
  stop({ id: "nyc-bar-mcsorleys", name: "McSorley's Old Ale House", coordinates: [40.728735, -73.989727], description: "McSorley's is a sawdust-floor beer institution where the choice is light or dark and the room is half the reason to go. It belongs in casual bars because it is loud, historic, and unpretentious; go early if you want atmosphere without the full crush.", officialUrl: "https://mcsorleysoldalehouse.nyc/", photo: images.mcsorleys, hours: "Official and map listings show daily afternoon/evening service; verify same-day hours.", price: "$$", priceSource: "Official/menu evidence / Google Maps", venueKind: "nightlife", nightlifeType: "beer_bar", attributeTags: ["historic", "lively", "casual", "beer", "east_village"], editorialUrls: ["https://www.timeout.com/newyork/bars/mcsorleys-old-ale-house", "https://ny.eater.com/maps/classic-bars-nyc"] }),
  stop({ id: "nyc-bar-white-horse", name: "White Horse Tavern", coordinates: [40.735782, -74.006741], description: "White Horse Tavern gives the West Village a literary pub anchor with enough history to survive a changing room. It is best as an early evening pint before dinner nearby; do not expect a dive untouched by fame or real estate.", officialUrl: "https://whitehorsetavern1880.com/", photo: images.whiteHorse, hours: "Official site posts daily bar and kitchen hours; verify before going late.", price: "$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "pub", attributeTags: ["historic", "casual", "west_village", "food_available", "lively"], editorialUrls: ["https://ny.eater.com/maps/classic-bars-nyc", "https://www.timeout.com/newyork/bars/white-horse-tavern"] }),
  stop({ id: "nyc-bar-ear-inn", name: "Ear Inn", coordinates: [40.725864, -74.009661], description: "Ear Inn is the far-west downtown bar that feels like the city still has corners you can miss if you only chase lists. Go for burgers, beer, and old-room texture after a Hudson River walk; the location is part of the charm and the inconvenience.", officialUrl: "https://www.earinn.com/", photo: images.earInn, hours: "Official site and map listings show daily service with kitchen/bar hours; verify same-day schedule.", price: "$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "pub", attributeTags: ["historic", "casual", "food_available", "west_side", "lively"], editorialUrls: ["https://ny.eater.com/maps/classic-bars-nyc", "https://www.timeout.com/newyork/bars/ear-inn"] }),
  stop({ id: "nyc-bar-petes-tavern", name: "Pete's Tavern", coordinates: [40.736816, -73.986772], description: "Pete's Tavern is a Gramercy survivor where the draw is continuity: old bar, neighborhood meals, and the O. Henry lore that still gets repeated over drinks. Use it for a low-pressure pint or casual dinner, not a cutting-edge cocktail night.", officialUrl: "https://www.petestavern.com/", photo: images.petesTavern, hours: "Official site posts daily bar and dining hours; verify holiday hours.", price: "$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "pub", attributeTags: ["historic", "casual", "food_available", "gramercy", "group_friendly"], editorialUrls: ["https://ny.eater.com/maps/classic-bars-nyc", "https://www.timeout.com/newyork/bars/petes-tavern"] }),
  stop({ id: "nyc-bar-julius", name: "Julius'", coordinates: [40.73345, -74.002987], description: "Julius' is essential because queer New York history is not an add-on to nightlife; it is the room itself. Go for burgers, beer, and the West Village crowd, and understand that the landmark status and the casual bar energy are inseparable.", officialUrl: "https://juliusbarny.com/", photo: images.julius, hours: "Official and map listings show daily bar service; verify current hours before going.", price: "$$", priceSource: "Official/menu evidence / Google Maps", venueKind: "nightlife", nightlifeType: "dive_bar", attributeTags: ["lgbtq", "historic", "casual", "west_village", "food_available"], editorialUrls: ["https://www.nyclgbtsites.org/site/julius-bar/", "https://www.timeout.com/newyork/bars/julius"] }),
  stop({ id: "nyc-bar-stonewall", name: "The Stonewall Inn", coordinates: [40.733824, -74.002164], description: "The Stonewall Inn belongs here as both a working bar and a civil-rights landmark, which means the visit should carry more than checklist energy. Go for a drink or event, then give the nearby monument space its due; evenings are more bar than museum.", officialUrl: "https://thestonewallinnnyc.com/", photo: images.stonewall, hours: "Official site posts bar/event hours; verify current schedule before going.", price: "$$", priceSource: "Official/event listings / Google Maps", venueKind: "nightlife", nightlifeType: "pub", musicGenres: ["dj", "drag", "karaoke"], attributeTags: ["lgbtq", "historic", "events", "west_village", "lively"], editorialUrls: ["https://www.nyclgbtsites.org/site/stonewall-inn-christopher-park/", "https://www.nps.gov/places/stonewall-inn.htm"] }),
  stop({ id: "nyc-bar-sunnys", name: "Sunny's Bar", coordinates: [40.675337, -74.016076], description: "Sunny's is the Red Hook bar that earns the trip when you want a room with music, neighborhood loyalty, and waterfront oddness instead of another downtown copy. It is best with a planned Red Hook evening; check events and transit before assuming an easy hop.", officialUrl: "https://www.sunnysredhook.com/", photo: images.sunnys, hours: "Official site posts bar and event hours; verify before making the Red Hook trip.", price: "$$", priceSource: "Official/event listings / Google Maps", venueKind: "nightlife", nightlifeType: "dive_bar", musicGenres: ["folk", "americana", "live_music"], attributeTags: ["live_music", "brooklyn", "casual", "lively", "neighborhood"], editorialUrls: ["https://ny.eater.com/maps/classic-bars-nyc", "https://www.timeout.com/newyork/bars/sunnys"] }),
  stop({ id: "nyc-bar-fraunces", name: "Fraunces Tavern", coordinates: [40.703399, -74.011356], description: "Fraunces Tavern turns a drink into a colonial-history detour without making the guide feel like homework. It works best in FiDi after the ferry, the Seaport, or Lower Manhattan sights; expect a historic complex with multiple rooms rather than a tiny dive.", officialUrl: "https://www.frauncestavern.com/", photo: images.fraunces, hours: "Official site posts restaurant, bar, and museum hours separately; verify the room you want.", price: "$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "pub", attributeTags: ["historic", "food_available", "fidi", "group_friendly", "casual"], editorialUrls: ["https://ny.eater.com/maps/classic-bars-nyc", "https://www.nyctourism.com/restaurants/fraunces-tavern/"] }),
  stop({ id: "nyc-bar-old-town", name: "Old Town Bar", coordinates: [40.737499, -73.989455], description: "Old Town Bar is a Flatiron/Union Square classic with high ceilings, old fixtures, burgers, and enough after-work energy to feel alive without becoming a club. It is a reliable casual-bar stop when your route sits between Midtown and downtown.", officialUrl: "https://www.oldtownbar.com/", photo: images.oldTownBar, hours: "Official site posts bar and kitchen hours by day; verify before going late.", price: "$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "pub", attributeTags: ["historic", "casual", "food_available", "central", "after_work"], editorialUrls: ["https://ny.eater.com/maps/classic-bars-nyc", "https://www.timeout.com/newyork/bars/old-town-bar"] }),
  stop({ id: "nyc-bar-rudys", name: "Rudy's Bar & Grill", coordinates: [40.759681, -73.991905], description: "Rudy's is the Hell's Kitchen dive-bar answer to expensive Midtown drinking: cheap beer, red booths, a pig mascot, and the famous free-hot-dog logic. It is useful before or after theater if you want the opposite of a hotel lounge; bring tolerance for crowds.", officialUrl: "https://rudysbarnyc.com/", photo: images.rudys, hours: "Official and map listings show daily bar service; verify current late hours.", price: "$", priceSource: "Official/menu evidence / Google Maps", venueKind: "nightlife", nightlifeType: "dive_bar", attributeTags: ["budget", "casual", "late_night", "theater_district", "lively"], editorialUrls: ["https://www.timeout.com/newyork/bars/rudys-bar-grill", "https://www.theinfatuation.com/new-york/reviews/rudys-bar-grill"] }),
];

const cocktailStops = [
  stop({ id: "nyc-cocktail-bemelmans", name: "Bemelmans Bar", coordinates: [40.774415, -73.963301], description: "Bemelmans is the hotel cocktail room that justifies the price through murals, piano, service, and Upper East Side theater. Go dressed for the room, expect a cover or minimum at certain times, and treat it as a planned stop rather than a casual nightcap.", officialUrl: "https://www.rosewoodhotels.com/en/the-carlyle-new-york/dining/bemelmans-bar", photo: images.bemelmans, hours: "Official site posts bar hours, entertainment schedules, covers, and dress guidance; verify before going.", price: "$$$$", priceSource: "Official bar page / menu", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["piano", "jazz"], attributeTags: ["luxury", "romantic", "live_music", "hotel_bar", "reservation_recommended"], editorialUrls: ["https://www.timeout.com/newyork/bars/bemelmans-bar", "https://www.theinfatuation.com/new-york/reviews/bemelmans-bar"] }),
  stop({ id: "nyc-cocktail-dead-rabbit", name: "The Dead Rabbit", coordinates: [40.703303, -74.011165], description: "The Dead Rabbit gives FiDi a serious cocktail anchor with Irish-pub warmth downstairs and a more composed cocktail experience upstairs. It belongs here because it can handle both a first drink and a planned session; book or time it carefully when Lower Manhattan empties out.", officialUrl: "https://thedeadrabbit.com/", photo: images.deadRabbit, hours: "Official site posts bar, kitchen, and event hours; verify same-day schedule.", price: "$$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["cocktails", "fidi", "food_available", "lively", "award_winning"], editorialUrls: ["https://ny.eater.com/maps/best-cocktail-bars-nyc", "https://www.worlds50bestbars.com/the-list/the-dead-rabbit.html"] }),
  stop({ id: "nyc-cocktail-employees-only", name: "Employees Only", coordinates: [40.733454, -74.006117], description: "Employees Only is a West Village cocktail institution where the speakeasy idea still has enough hospitality and speed to work. Go for a late drink, a bar seat if you can get one, and the old-school downtown buzz; reservations help when the night is tight.", officialUrl: "https://www.employeesonlynyc.com/", photo: images.employeesOnly, hours: "Official site posts nightly bar and kitchen hours; verify late-night service and reservations.", price: "$$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["cocktails", "late_night", "west_village", "reservation_recommended", "lively"], editorialUrls: ["https://ny.eater.com/maps/best-cocktail-bars-nyc", "https://www.theworlds50best.com/discovery/Establishments/US/New-York/Employees-Only.html"] }),
  stop({ id: "nyc-cocktail-pdt", name: "Please Don't Tell", coordinates: [40.727124, -73.983758], description: "Please Don't Tell is still useful because entering through Crif Dogs gives the night a bit of theater before the cocktails start doing the work. The room is small and reservations matter; pair it with East Village food instead of trying to make it a spontaneous group stop.", officialUrl: "https://pdtnyc.com/", photo: images.pdt, hours: "Official reservation page posts nightly availability; check same-day booking windows and hours.", price: "$$$", priceSource: "Official/reservation menu evidence", venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["speakeasy", "reservation_recommended", "east_village", "cocktails", "date_night"], editorialUrls: ["https://ny.eater.com/maps/best-cocktail-bars-nyc", "https://www.timeout.com/newyork/bars/please-dont-tell"] }),
  stop({ id: "nyc-cocktail-attaboy", name: "Attaboy", coordinates: [40.718913, -73.991306], description: "Attaboy belongs in a cocktail guide because the no-menu conversation still feels alive when the bartender listens well. It is a small Lower East Side room, so patience and party size matter; go with one or two people who know what they like.", officialUrl: "https://www.attaboy.us/nyc", photo: images.attaboy, hours: "Official site posts nightly walk-in/reservation guidance and hours; verify before going.", price: "$$$", priceSource: "Official site / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["cocktails", "small_room", "date_night", "lower_east_side", "award_winning"], editorialUrls: ["https://ny.eater.com/maps/best-cocktail-bars-nyc", "https://www.worlds50bestbars.com/the-list/attaboy.html"] }),
  stop({ id: "nyc-cocktail-clover-club", name: "Clover Club", coordinates: [40.68432, -73.993982], description: "Clover Club gives Brooklyn a grown-up cocktail room with food, booths, and a menu that works for dates as well as serious drinkers. It is less stunt-driven than many cocktail bars; reserve for Cobble Hill evenings and let the neighborhood pace shape the night.", officialUrl: "https://www.cloverclubny.com/", photo: images.cloverClub, hours: "Official site posts dinner, brunch, and bar hours; reservations recommended.", price: "$$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["brooklyn", "romantic", "food_available", "reservation_recommended", "cocktails"], editorialUrls: ["https://ny.eater.com/maps/best-cocktail-bars-nyc", "https://www.timeout.com/newyork/bars/clover-club"] }),
  stop({ id: "nyc-cocktail-dante", name: "Dante", coordinates: [40.728774, -74.001839], description: "Dante is the aperitivo bar that made negronis feel like a New York itinerary item rather than a pre-dinner afterthought. It works best in daylight or early evening when the cafe bones still show; reserve if you want the experience to be relaxed.", officialUrl: "https://www.dante-nyc.com/", photo: images.dante, hours: "Official site posts daily cafe/bar hours by location; verify the MacDougal Street schedule.", price: "$$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["aperitivo", "reservation_recommended", "west_village", "cocktails", "food_available"], editorialUrls: ["https://ny.eater.com/maps/best-cocktail-bars-nyc", "https://www.worlds50bestbars.com/the-list/dante.html"] }),
  stop({ id: "nyc-cocktail-death-co", name: "Death & Co", coordinates: [40.725821, -73.984476], description: "Death & Co remains a serious East Village cocktail stop because the room, menu, and service still reward people who care about balance and detail. It is dark, intimate, and better with a reservation or early arrival; do not bring a huge roaming group.", officialUrl: "https://www.deathandcompany.com/location/death-co-new-york/", photo: images.deathCo, hours: "Official site posts nightly service hours and reservation guidance; verify before going.", price: "$$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["cocktails", "date_night", "east_village", "reservation_recommended", "quiet"], editorialUrls: ["https://ny.eater.com/maps/best-cocktail-bars-nyc", "https://www.timeout.com/newyork/bars/death-company"] }),
  stop({ id: "nyc-cocktail-angels-share", name: "Angel's Share", coordinates: [40.731438, -73.988343], description: "Angel's Share earns its place as a reborn Japanese-influenced cocktail room whose appeal is quiet focus rather than spectacle. Use it when you want a composed drink and conversation near the East Village/Gramercy edge; check reservations because the room is compact.", officialUrl: "https://www.angelssharenyc.com/", photo: images.angelShare, hours: "Official site posts current hours and reservation guidance; verify before going.", price: "$$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["cocktails", "quiet", "date_night", "reservation_recommended", "japanese_influence"], editorialUrls: ["https://ny.eater.com/maps/best-cocktail-bars-nyc", "https://www.timeout.com/newyork/bars/angels-share"] }),
  stop({ id: "nyc-cocktail-king-cole", name: "King Cole Bar", coordinates: [40.761521, -73.974284], description: "King Cole Bar is the Midtown hotel-bar classic where the Maxfield Parrish mural, martinis, and Red Snapper lore do the heavy lifting. It belongs here for a polished pre-theater or Midtown drink; expect hotel pricing and a more formal rhythm.", officialUrl: "https://www.marriott.com/en-us/hotels/nycxr-the-st-regis-new-york/dining/", photo: images.kingCole, hours: "Official hotel dining page posts current bar hours; verify before planning around it.", price: "$$$$", priceSource: "Official hotel dining page / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", attributeTags: ["hotel_bar", "historic", "midtown", "luxury", "cocktails"], editorialUrls: ["https://www.timeout.com/newyork/bars/king-cole-bar", "https://www.theinfatuation.com/new-york/reviews/king-cole-bar"] }),
];

const cultureStops = [
  stop({ id: "nyc-culture-met", name: "The Metropolitan Museum of Art", coordinates: [40.779437, -73.963244], description: "The Met is the citywide culture anchor because it can absorb an entire day or sharpen into one focused wing if you plan honestly. Pick two priorities before entering, use the rooftop when open, and pair it with Central Park rather than pretending you can see everything.", officialUrl: "https://www.metmuseum.org/", photo: images.met, hours: "Official site posts museum hours, closed days, and exhibition-specific ticketing; verify before visiting.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "art", "classic", "upper_east_side", "family_friendly"], editorialUrls: ["https://www.nyctourism.com/museums-galleries/the-metropolitan-museum-of-art/", "https://www.timeout.com/newyork/museums/metropolitan-museum-of-art"] }),
  stop({ id: "nyc-culture-moma", name: "Museum of Modern Art", coordinates: [40.761433, -73.977622], description: "MoMA is the Midtown modern-art stop where the greatest hits are real but the crowds can flatten the experience if you drift. Go early, target specific floors or exhibitions, and use it as a strong indoor block between Midtown, Rockefeller Center, and Central Park.", officialUrl: "https://www.moma.org/", photo: images.moma, hours: "Official site posts daily hours, member hours, and ticketing notes; verify before visiting.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "modern_art", "midtown", "indoor", "family_friendly"], editorialUrls: ["https://www.nyctourism.com/museums-galleries/museum-of-modern-art-moma/", "https://www.timeout.com/newyork/museums/museum-of-modern-art-moma"] }),
  stop({ id: "nyc-culture-whitney", name: "Whitney Museum of American Art", coordinates: [40.739609, -74.008861], description: "The Whitney works because its American-art focus, terraces, and Meatpacking/High Line position make it feel connected to the city outside the galleries. It is best before or after a west-side walk; leave time for the views, not just the collection.", officialUrl: "https://whitney.org/", photo: images.whitney, hours: "Official site posts museum hours, late nights, and ticketing notes; verify current schedule.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "american_art", "scenic", "west_side", "indoor"], editorialUrls: ["https://www.nyctourism.com/museums-galleries/whitney-museum-of-american-art/", "https://www.timeout.com/newyork/museums/whitney-museum-of-american-art"] }),
  stop({ id: "nyc-culture-tenement", name: "Tenement Museum", coordinates: [40.718793, -73.99007], description: "The Tenement Museum is essential because it turns immigration, housing, labor, and Lower East Side history into specific apartments and guided stories. Book a tour in advance, choose the theme that fits your interests, and do not treat it as a drop-in museum.", officialUrl: "https://www.tenement.org/", photo: images.tenement, hours: "Official site posts tour schedules and ticket availability; advance booking recommended.", venueKind: "culture", subcategory: "history_museum", attributeTags: ["history", "guided_tour", "lower_east_side", "reservation_recommended", "indoor"], editorialUrls: ["https://www.nyctourism.com/museums-galleries/tenement-museum/", "https://www.timeout.com/newyork/museums/tenement-museum"] }),
  stop({ id: "nyc-culture-studio-museum", name: "The Studio Museum in Harlem", coordinates: [40.808163, -73.944856], description: "The Studio Museum matters because Harlem and artists of African descent should not be treated as a side note in a New York culture guide. Check current reopening/exhibition status and programming before going, then pair it with Apollo or Sylvia's rather than isolating the stop.", officialUrl: "https://studiomuseum.org/", photo: images.studioMuseum, hours: "Programming and public access are schedule-dependent during the museum's new-building period; verify current exhibitions/events before visiting.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "black_art", "harlem", "programming", "indoor"], editorialUrls: ["https://www.nyctourism.com/museums-galleries/studio-museum-in-harlem/", "https://www.timeout.com/newyork/museums/the-studio-museum-in-harlem"] }),
  stop({ id: "nyc-culture-brooklyn-museum", name: "Brooklyn Museum", coordinates: [40.671206, -73.963631], description: "Brooklyn Museum gives the guide scale outside Manhattan, with Egyptian collections, American art, fashion exhibitions, and a Prospect Park/Botanic Garden route next door. It is strongest when you give Brooklyn a real half-day instead of treating it as a token crossing.", officialUrl: "https://www.brooklynmuseum.org/", photo: images.brooklynMuseum, hours: "Official site posts museum hours, first Saturdays, and ticketed exhibition details; verify before visiting.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "brooklyn", "art", "family_friendly", "indoor"], editorialUrls: ["https://www.nyctourism.com/museums-galleries/brooklyn-museum/", "https://www.timeout.com/newyork/museums/brooklyn-museum"] }),
  stop({ id: "nyc-culture-lincoln-center", name: "Lincoln Center", coordinates: [40.772464, -73.983489], description: "Lincoln Center is the performing-arts campus that makes New York culture feel like an evening plan, not only museum hours. Choose the specific hall, company, or outdoor program before going; wandering the plaza is pleasant, but tickets are the real reason.", officialUrl: "https://www.lincolncenter.org/", photo: images.lincolnCenter, hours: "Campus is publicly accessible, while performances, box offices, tours, and restaurants keep separate schedules.", venueKind: "culture", subcategory: "performing_arts", attributeTags: ["performing_arts", "music", "dance", "upper_west_side", "tickets_required"], editorialUrls: ["https://www.nyctourism.com/venues/lincoln-center-for-the-performing-arts/", "https://www.nyc-arts.org/organizations/lincoln-center-for-the-performing-arts/"] }),
  stop({ id: "nyc-culture-apollo", name: "Apollo Theater", coordinates: [40.810033, -73.950057], description: "The Apollo belongs here because Harlem performance history, Amateur Night, and the marquee still carry cultural weight that no Midtown theater can duplicate. Check the calendar first; the building matters, but the right show turns it from photo stop into memory.", officialUrl: "https://www.apollotheater.org/", photo: images.apollo, hours: "Performance, tour, and box-office hours vary by event; verify the official calendar.", venueKind: "culture", subcategory: "theater", attributeTags: ["performing_arts", "harlem", "music", "historic", "tickets_required"], editorialUrls: ["https://www.nyctourism.com/venues/apollo-theater/", "https://www.timeout.com/newyork/music/apollo-theater"] }),
  stop({ id: "nyc-culture-noguchi", name: "The Noguchi Museum", coordinates: [40.766778, -73.938087], description: "The Noguchi Museum is the quiet Queens counterweight to Manhattan's blockbuster rooms: sculpture, garden space, and a slower encounter with one artist's world. It is best paired with Socrates Sculpture Park or Astoria plans; check hours because the trip is intentional.", officialUrl: "https://www.noguchi.org/", photo: images.noguchi, hours: "Official site posts museum hours, garden access, and ticketing notes; verify before visiting.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "sculpture", "quiet", "queens", "garden"], editorialUrls: ["https://www.nyctourism.com/museums-galleries/the-noguchi-museum/", "https://www.timeout.com/newyork/museums/noguchi-museum"] }),
  stop({ id: "nyc-culture-moving-image", name: "Museum of the Moving Image", coordinates: [40.756345, -73.92395], description: "Museum of the Moving Image gives Astoria a strong culture anchor built around film, television, games, and production craft rather than another painting wall. It is especially good for mixed-age groups; pair it with Queens food and check screening/program schedules.", officialUrl: "https://movingimage.org/", photo: images.movingImage, hours: "Official site posts museum hours, screenings, and event schedules; verify before visiting.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "film", "family_friendly", "queens", "interactive"], editorialUrls: ["https://www.nyctourism.com/museums-galleries/museum-of-the-moving-image/", "https://www.timeout.com/newyork/museums/museum-of-the-moving-image"] }),
];

const activityStops = [
  stop({ id: "nyc-activity-statue-liberty", name: "Statue of Liberty", coordinates: [40.689249, -74.0445], description: "The Statue of Liberty is the obvious icon, but it works best when handled as a ferry-and-harbor plan rather than a quick photo hope. Book official tickets, understand security and timing, and choose pedestal/crown access only if the logistics fit the day.", officialUrl: "https://www.nps.gov/stli/index.htm", bookingUrl: "https://www.cityexperiences.com/new-york/city-cruises/statue/", photo: images.statueLiberty, hours: "National Park Service and official ferry schedules vary by season, weather, and ticket type; verify before visiting.", venueKind: "landmark", subcategory: "national_monument", attributeTags: ["landmark", "harbor", "tickets_required", "family_friendly", "scenic"], editorialUrls: ["https://www.nyctourism.com/attractions-tours/statue-of-liberty/", "https://www.lonelyplanet.com/articles/top-things-to-do-in-new-york-city"] }),
  stop({ id: "nyc-activity-ellis-island", name: "Ellis Island National Museum of Immigration", coordinates: [40.699475, -74.039559], description: "Ellis Island is the companion stop that gives the harbor trip emotional weight beyond the skyline. Build time for the museum and family-history displays, and do not squeeze it after a late start; the ferry clock shapes the experience.", officialUrl: "https://www.nps.gov/elis/index.htm", bookingUrl: "https://www.cityexperiences.com/new-york/city-cruises/statue/", photo: images.ellisIsland, hours: "National Park Service and official ferry schedules vary by season, weather, and ticket type; verify before visiting.", venueKind: "culture", subcategory: "museum", attributeTags: ["history", "harbor", "tickets_required", "family_friendly", "museum"], editorialUrls: ["https://www.nyctourism.com/museums-galleries/ellis-island-national-museum-of-immigration/", "https://www.nps.gov/elis/planyourvisit/hours.htm"] }),
  stop({ id: "nyc-activity-central-park", name: "Central Park", coordinates: [40.782865, -73.965355], description: "Central Park is not one stop so much as the city breathing between neighborhoods, museums, hotels, and long walks. Pick a zone: Bethesda and the Mall for classics, the Ramble for wandering, or the north end when you want fewer people and more texture.", officialUrl: "https://www.centralparknyc.org/", photo: images.centralPark, hours: "Park open daily 6:00 AM-1:00 AM; attractions, restrooms, and concessions keep separate schedules.", venueKind: "outdoors", subcategory: "park", attributeTags: ["park", "free_entry", "scenic", "family_friendly", "walking"], editorialUrls: ["https://www.nyctourism.com/attractions-tours/central-park/", "https://www.timeout.com/newyork/things-to-do/central-park-guide"] }),
  stop({ id: "nyc-activity-high-line", name: "The High Line", coordinates: [40.747993, -74.004765], description: "The High Line is still useful when you treat it as a west-side connector through planting, architecture, Chelsea galleries, and Meatpacking crowds. Go early or in shoulder hours, then exit deliberately for the Whitney, Little Island, or dinner instead of drifting with everyone else.", officialUrl: "https://www.thehighline.org/", photo: images.highLine, hours: "Official site posts seasonal park hours and temporary closure notices; verify before visiting.", venueKind: "outdoors", subcategory: "elevated_park", attributeTags: ["park", "free_entry", "walking", "west_side", "scenic"], editorialUrls: ["https://www.nyctourism.com/attractions-tours/the-high-line/", "https://www.timeout.com/newyork/parks/high-line"] }),
  stop({ id: "nyc-activity-brooklyn-bridge", name: "Brooklyn Bridge", coordinates: [40.706086, -73.996864], description: "Brooklyn Bridge earns its place because the walk still delivers harbor, skyline, stone, and scale when timed properly. Start early or late, walk from Brooklyn toward Manhattan for the classic reveal, and avoid treating the middle of a summer afternoon as normal.", officialUrl: "https://www.nyc.gov/html/dot/html/infrastructure/brooklyn-bridge.shtml", photo: images.brooklynBridge, hours: "Pedestrian path open daily; weather, construction, and crowd conditions vary.", venueKind: "landmark", subcategory: "bridge_walk", attributeTags: ["free_entry", "walking", "scenic", "landmark", "brooklyn"], editorialUrls: ["https://www.nyctourism.com/attractions-tours/brooklyn-bridge/", "https://www.lonelyplanet.com/articles/top-things-to-do-in-new-york-city"] }),
  stop({ id: "nyc-activity-grand-central", name: "Grand Central Terminal", coordinates: [40.752726, -73.977229], description: "Grand Central is the indoor landmark that works even on a bad-weather day: celestial ceiling, ramps, Oyster Bar, whispering gallery, and trains doing actual city work around you. Visit outside peak commute if you want to look up without becoming an obstacle.", officialUrl: "https://www.grandcentralterminal.com/", photo: images.grandCentral, hours: "Terminal open daily with posted building hours; shops, dining, tours, and transit keep separate schedules.", venueKind: "transport", subcategory: "terminal", attributeTags: ["landmark", "architecture", "free_entry", "midtown", "indoor"], editorialUrls: ["https://www.nyctourism.com/attractions-tours/grand-central-terminal/", "https://www.timeout.com/newyork/attractions/grand-central-terminal"] }),
  stop({ id: "nyc-activity-staten-island-ferry", name: "Staten Island Ferry", coordinates: [40.701034, -74.013177], description: "The Staten Island Ferry is the budget harbor move: free water, skyline views, and Statue of Liberty angles without pretending it is a guided cruise. Ride outside commuter crush if possible, follow terminal flow, and plan whether you are turning around or seeing St. George.", officialUrl: "https://www.nyc.gov/html/dot/html/ferrybus/staten-island-ferry.shtml", photo: images.ferry, hours: "Ferry operates 24 hours daily, with frequency varying by time of day; verify official schedule before riding.", venueKind: "transport", subcategory: "ferry", attributeTags: ["free_entry", "scenic", "harbor", "family_friendly", "transport"], editorialUrls: ["https://www.nyctourism.com/attractions-tours/staten-island-ferry/", "https://www.lonelyplanet.com/articles/top-things-to-do-in-new-york-city"] }),
  stop({ id: "nyc-activity-prospect-park", name: "Prospect Park", coordinates: [40.660204, -73.968956], description: "Prospect Park is the Brooklyn green-space anchor that keeps the guide from making Central Park do all the work. Use it with Brooklyn Museum, the Botanic Garden, Park Slope, or a picnic day; the Long Meadow is the reset, not a checklist item.", officialUrl: "https://www.prospectpark.org/", photo: images.prospectPark, hours: "Park open daily 5:00 AM-1:00 AM; attractions and facilities keep separate schedules.", venueKind: "outdoors", subcategory: "park", attributeTags: ["park", "brooklyn", "free_entry", "family_friendly", "walking"], editorialUrls: ["https://www.nyctourism.com/attractions-tours/prospect-park/", "https://www.timeout.com/newyork/parks/prospect-park"] }),
  stop({ id: "nyc-activity-yankee-stadium", name: "Yankee Stadium", coordinates: [40.829643, -73.926175], description: "Yankee Stadium belongs in top things because a baseball night turns the Bronx into part of the trip instead of a name on the subway map. Check the schedule, arrive with time for Monument Park or pregame food, and remember the experience depends on game day.", officialUrl: "https://www.mlb.com/yankees/ballpark", bookingUrl: "https://www.mlb.com/yankees/tickets", photo: images.yankeeStadium, hours: "Game, tour, gate, and ticket-office hours vary by event; verify the official schedule.", venueKind: "event_venue", subcategory: "stadium", attributeTags: ["sports", "bronx", "tickets_required", "family_friendly", "evening"], editorialUrls: ["https://www.nyctourism.com/venues/yankee-stadium/", "https://www.mlb.com/yankees/schedule"] }),
  stop({ id: "nyc-activity-met", name: "The Metropolitan Museum of Art", coordinates: [40.779437, -73.963244], description: "The Met gets a top-things slot because even a first New York trip needs one museum that can hold the scale of the city. Limit yourself to a focused route, then leave through Central Park; the mistake is trying to conquer it all.", officialUrl: "https://www.metmuseum.org/", photo: images.met, hours: "Official site posts museum hours, closed days, and exhibition-specific ticketing; verify before visiting.", venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "art", "classic", "tickets_required", "upper_east_side"], editorialUrls: ["https://www.nyctourism.com/museums-galleries/the-metropolitan-museum-of-art/", "https://www.timeout.com/newyork/museums/metropolitan-museum-of-art"] }),
];

const sources = {
  dining: [...editorial.restaurants, ...diningStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? item.sourceEvidence?.officialUrl ?? maps(item.name)))],
  cheapEats: [...editorial.cheapEats, ...cheapEatStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  hotels: [...editorial.hotels, ...hotelStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  hostels: [...editorial.hostels, ...hostelStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  casualBars: [...editorial.casualBars, ...casualBarStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  cocktails: [...editorial.cocktails, ...cocktailStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  culture: [...editorial.culture, ...cultureStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  activities: [...editorial.activities, ...activityStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
};

function guide(category: ListCategory, id: string, slug: string, seoSlug: string, title: string, description: string, stops: GuideStop[], guideSources: ListSource[], seoTitle: string, seoDescription: string): MapList {
  const guideStops = seoSlug === "best-dive-bars"
    ? stops.map((stop) => ({
        ...stop,
        attributeTags: ["dive_bars", ...(stop.attributeTags ?? []).filter((tag) => tag !== "dive_bars")],
      }))
    : stops;

  return {
    id,
    slug,
    seoSlug,
    seoTitle,
    seoDescription,
    title,
    description,
    url: maps(`${title} New York City`),
    category,
    location: nycLocation,
    creator: {
      id: `user-rguide-${category.toLowerCase()}`,
      name: `R ${category}`,
      avatar: avatar(category),
    },
    upvotes: 0,
    createdAt,
    stops: guideStops,
    sources: guideSources,
  };
}

export const newYorkCityCitywideGuides: MapList[] = [
  guide("Food", "list-nyc-citywide-dining", "nyc-best-restaurants-citywide", "best-restaurants", "Classic Rooms, Serious Tables, and Neighborhood Icons", "A citywide New York dining guide that treats old delis, steakhouses, Chinatown dim sum, Harlem soul food, Grand Central seafood, and park-side occasion dining as different kinds of essential. It is built for travelers who want the city on the plate, not one algorithmic tasting-menu lane.", diningStops, sources.dining, "Best Restaurants in New York City for Classic Dining and Essential Tables", "Source-backed NYC restaurant guide with delis, steakhouses, dim sum, soul food, seafood, pizza, and park-side dining."),
  guide("Food", "list-nyc-cheap-eats", "nyc-best-cheap-eats", "best-cheap-eats", "Slices, Dumplings, Bagels, and Counter Meals", "A practical New York cheap-eats guide for slice counters, falafel, dumplings, noodles, hot dogs, bagels, tacos, and vegetarian-friendly fast meals. The point is not pretending cheap food is automatically romantic; it is knowing which counters actually solve a city day.", cheapEatStops, sources.cheapEats, "Best Cheap Eats in New York City for Slices, Bagels, Dumplings, and Fast Meals", "Budget and medium-price NYC food stops with source evidence, map status, and practical route notes."),
  guide("Stay", "list-nyc-hotels", "nyc-best-hotels", "best-hotels", "Hotels by Neighborhood, View, and Trip Mood", "A hotel-only New York stay guide that separates uptown ceremony, downtown design, airport logistics, west-side scene, and smaller Village bases. It keeps hostels out and frames each hotel by route usefulness, not just luxury adjectives.", hotelStops, sources.hotels, "Best Hotels in New York City for Luxury, Design, Downtown, and Park Bases", "Hotel-only NYC stay guide with official booking evidence and neighborhood strategy for Manhattan, Brooklyn access, and JFK logistics."),
  guide("Stay", "list-nyc-hostels", "nyc-best-hostels", "best-hostels", "Hostels and Budget Bases by Transit Fit", "A hostel-only New York stay guide with dorms, private rooms, pods, and no-frills budget bases split by Manhattan, Queens, Brooklyn, and uptown routing. It is honest about tradeoffs: price, social energy, room size, and subway time matter more than glossy copy.", hostelStops, sources.hostels, "Best Hostels in New York City for Dorms, Private Rooms, and Budget Bases", "Hostel-only NYC guide with dorm/private-room evidence, booking links, and neighborhood tradeoffs."),
  guide("Nightlife", "list-nyc-dive-bars-casual-pubs", "nyc-best-dive-bars-casual-pubs", "best-dive-bars", "Old Bars, Queer Landmarks, and Casual Pints", "A casual-bar guide for New York rooms where history, beer, neighborhood regulars, food, and queer nightlife landmarks matter more than mixology posture. It is deliberately not a cocktail guide, and it rewards travelers who want bars with a little wear on them.", casualBarStops, sources.casualBars, "Best Dive Bars and Casual Pubs in New York City", "NYC dive bar and casual pub guide with old ale houses, queer landmarks, Red Hook music, and Midtown budget drinking."),
  guide("Nightlife", "list-nyc-cocktail-bars", "nyc-best-cocktail-bars", "best-cocktail-bars", "Cocktail Rooms Worth Planning Around", "A cocktail-only New York guide for hotel classics, modern award rooms, speakeasy theater, Brooklyn grown-up drinking, and serious East Village bars. These are not random late rooms; they work best when you plan timing, party size, and reservation posture.", cocktailStops, sources.cocktails, "Best Cocktail Bars in New York City for Classic and Modern Drinks", "Source-backed NYC cocktail guide with Bemelmans, Dead Rabbit, Employees Only, PDT, Attaboy, Clover Club, Dante, Death & Co, Angel's Share, and King Cole Bar."),
  guide("Culture", "list-nyc-culture-museums-performance", "nyc-best-culture-museums-performance", "best-culture", "Museums, Stages, and Neighborhood Culture", "A citywide New York culture guide that refuses to keep culture only on Museum Mile. It connects major art institutions, Lower East Side history, Harlem performance, Brooklyn scale, Queens film and sculpture, and Lincoln Center nights into one usable map.", cultureStops, sources.culture, "Best Culture in New York City for Museums, Performance, and Neighborhood History", "NYC culture guide with official evidence for museums, performance venues, Harlem, Brooklyn, Queens, and the Lower East Side."),
  guide("Activities", "list-nyc-top-things-to-do", "nyc-top-things-to-do", "best-things-to-do", "Ten Stops That Make a First New York Trip Work", "A top-things New York guide built for route usefulness: harbor icons, major parks, bridge walking, Grand Central, a free ferry, one baseball night, and one museum anchor. It avoids treating the city like a postcard checklist by giving each stop a timing and logistics caveat.", activityStops, sources.activities, "Top Things to Do in New York City With 10 Strong Stops", "Ten source-backed NYC things to do, from Statue of Liberty and Central Park to Brooklyn Bridge, Grand Central, the ferry, Prospect Park, Yankee Stadium, and the Met."),
];
