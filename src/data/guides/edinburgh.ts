import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

const createdAt = "2026-08-13T00:00:00.000Z";
const checkedAt = "2026-08-13";

const location = {
  city: "Edinburgh",
  country: "United Kingdom",
  continent: "Europe",
  scope: "city" as const,
};

type StopSeed = {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  officialUrl: string;
  hoursUrl: string;
  hours: string;
  photo: string;
  bookingUrl?: string;
  sourceUrls?: string[];
  price?: GuideStop["price"];
  venueKind?: GuideStop["venueKind"];
  lodgingType?: GuideStop["lodgingType"];
  foodServiceType?: GuideStop["foodServiceType"];
  cuisineTypes?: string[];
  nightlifeType?: GuideStop["nightlifeType"];
  musicGenres?: string[];
  subcategory: string;
  attributeTags: string[];
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
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <rect width="160" height="160" rx="80" fill="#${colors[category]}" />
      <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Arial, sans-serif" font-size="76" font-weight="700" fill="white">R</text>
    </svg>
  `)}`;
}

function maps(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${query} Edinburgh Scotland`)}`;
}

function source(name: string, url: string): ListSource {
  return { name, url };
}

function stop(seed: StopSeed): GuideStop {
  const mapUrl = maps(seed.name);
  const sourceUrls = [
    seed.officialUrl,
    seed.hoursUrl,
    seed.bookingUrl,
    mapUrl,
    seed.photo,
    ...(seed.sourceUrls ?? []),
  ].filter(Boolean) as string[];

  return {
    id: seed.id,
    name: seed.name,
    coordinates: seed.coordinates,
    description: seed.description,
    officialUrl: seed.officialUrl,
    bookingUrl: seed.bookingUrl,
    hours: { default: seed.hours },
    photo: seed.photo,
    imageSourceUrl: seed.photo,
    price: seed.price,
    priceSource: seed.price ? seed.officialUrl : undefined,
    venueKind: seed.venueKind,
    lodgingType: seed.lodgingType,
    foodServiceType: seed.foodServiceType,
    cuisineTypes: seed.cuisineTypes,
    nightlifeType: seed.nightlifeType,
    musicGenres: seed.musicGenres,
    subcategory: seed.subcategory,
    attributeTags: seed.attributeTags,
    sourceUrls: [...new Set(sourceUrls)],
    sourceEvidence: {
      officialUrl: seed.officialUrl,
      mapUrl,
      currentStatusUrl: mapUrl,
      imageSourceUrl: seed.photo,
      editorialUrls: seed.sourceUrls ?? [],
      platformUrls: seed.bookingUrl ? [seed.bookingUrl] : [],
      checkedAt,
      notes: `The official venue or property page and the schedule source were checked on ${checkedAt}; Google Maps supplies current identity and operating-status evidence.`,
    },
  };
}

const diningStops: GuideStop[] = [
  stop({
    id: "edinburgh-dining-the-kitchin", name: "The Kitchin", coordinates: [55.977029, -3.172583],
    description: "Tom Kitchin applies classical French technique to Scottish produce in a converted Leith whisky warehouse, with seafood, game and foraged ingredients changing by season. The full tasting menu is a long, formal commitment; lunch is the more manageable way into the kitchen.",
    officialUrl: "https://thekitchin.com/", hoursUrl: "https://thekitchin.com/reservations/",
    hours: "Tuesday–Thursday 12:15–14:00 and 18:30–22:00; Friday–Saturday 12:15–14:00 and 18:30–22:30; closed Sunday–Monday.",
    photo: "https://thekitchin.com/wp-content/uploads/2021/07/home-image7.jpg", bookingUrl: "https://thekitchin.com/reservations/",
    sourceUrls: ["https://guide.michelin.com/gb/en/city-of-edinburgh/edinburgh/restaurant/the-kitchin"], price: "$$$$", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["scottish", "french", "tasting_menu"], subcategory: "fine-dining", attributeTags: ["michelin_star", "seasonal", "advance_booking", "leith", "special_occasion"],
  }),
  stop({
    id: "edinburgh-dining-martin-wishart", name: "Restaurant Martin Wishart", coordinates: [55.975446, -3.170367],
    description: "Martin Wishart’s Leith dining room was Edinburgh’s first Michelin-starred restaurant and still works in a polished French register with Scottish shellfish, meat and seasonal vegetables. Lunch delivers the same disciplined cooking with less ceremony than the evening tasting format.",
    officialUrl: "https://restaurantmartinwishart.co.uk/", hoursUrl: "https://restaurantmartinwishart.co.uk/enquiries/",
    hours: "Wednesday–Saturday lunch 12:00–13:30 and dinner 18:30–22:00; closed Sunday–Tuesday.",
    photo: "https://restaurantmartinwishart.co.uk/wp-content/uploads/sites/33/2019/08/rmw-03-highres-705x400.jpg", bookingUrl: "https://restaurantmartinwishart.co.uk/reservations/",
    sourceUrls: ["https://guide.michelin.com/gb/en/city-of-edinburgh/edinburgh/restaurant/restaurant-martin-wishart"], price: "$$$$", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["french", "scottish", "tasting_menu"], subcategory: "fine-dining", attributeTags: ["michelin_star", "leith", "lunch_available", "advance_booking", "formal_service"],
  }),
  stop({
    id: "edinburgh-dining-heron", name: "Heron", coordinates: [55.974808, -3.171951],
    description: "Heron turns Scottish fish, meat and farm produce into tightly composed tasting menus in a small room near the Shore. Counter seats look directly into the open kitchen; weekend lunch is useful when the compact dinner service is booked out.",
    officialUrl: "https://www.heron.scot/", hoursUrl: "https://www.heron.scot/contact",
    hours: "Wednesday–Friday dinner 17:30–21:00; Saturday–Sunday lunch 12:00–14:00 and dinner 17:30–21:00; closed Monday–Tuesday.",
    photo: "https://images.squarespace-cdn.com/content/v1/65e1f88bbb43aa2e57f47e8c/1709308049310-N36VKVV79YJVTHN0XLGJ/EXT-phone.jpg", bookingUrl: "https://www.heron.scot/book",
    sourceUrls: ["https://guide.michelin.com/gb/en/city-of-edinburgh/edinburgh/restaurant/heron"], price: "$$$$", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["modern_scottish", "tasting_menu", "seasonal"], subcategory: "tasting-menu", attributeTags: ["michelin_star", "open_kitchen", "leith", "advance_booking", "weekend_lunch"],
  }),
  stop({
    id: "edinburgh-dining-lyla", name: "Lyla", coordinates: [55.956802, -3.180667],
    description: "Stuart Ralston’s Royal Terrace townhouse concentrates on Scottish seafood through five- and seven-course menus, with dry-aged fish and precise sauces setting the tone. The listed Georgian building has stairs, and the longest menu is deliberately paced as a destination dinner.",
    officialUrl: "https://lylaedinburgh.co.uk/", hoursUrl: "https://lylaedinburgh.co.uk/",
    hours: "Dinner Wednesday–Sunday from 18:30; lunch Friday–Sunday, with exact five- and seven-course seating times controlled by the official reservation calendar.",
    photo: "https://images.squarespace-cdn.com/content/v1/64ac8d096fa2695aa5fe4443/66508cca-50a5-4d15-91b4-54db40d15d41/header.jpg?format=1500w", bookingUrl: "https://lylaedinburgh.co.uk/",
    sourceUrls: ["https://guide.michelin.com/gb/en/city-of-edinburgh/edinburgh/restaurant/lyla"], price: "$$$$", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["seafood", "modern_scottish", "tasting_menu"], subcategory: "seafood-tasting-menu", attributeTags: ["michelin_star", "seafood", "new_town", "advance_booking", "listed_building"],
  }),
  stop({
    id: "edinburgh-dining-timberyard", name: "Timberyard", coordinates: [55.946355, -3.201729],
    description: "A family-run kitchen fills a former timber warehouse with dishes built from local growers, foragers, wild meat and responsibly sourced fish. Michelin and Green Star recognition reflects that sourcing discipline; the leafy yard and stripped-back room keep the tasting menu from feeling stiff.",
    officialUrl: "https://www.timberyard.co/", hoursUrl: "https://www.timberyard.co/",
    hours: "Thursday 16:00–23:00; Friday–Sunday 12:00–23:00, with dinner reservations generally 17:00–20:30; closed Monday–Wednesday.",
    photo: "https://www.timberyard.co/wp-content/uploads/2025/05/MG_3770-265x398.jpg", bookingUrl: "https://www.timberyard.co/book-a-table/",
    sourceUrls: ["https://guide.michelin.com/gb/en/city-of-edinburgh/edinburgh/restaurant/timberyard"], price: "$$$$", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["modern_scottish", "seasonal", "tasting_menu"], subcategory: "sustainable-fine-dining", attributeTags: ["michelin_star", "green_star", "local_produce", "foraged", "garden"],
  }),
  stop({
    id: "edinburgh-dining-little-chartroom", name: "The Little Chartroom", coordinates: [55.972578, -3.175962],
    description: "Roberta Hall-McCarron’s Bonnington restaurant draws deeply on the Scottish larder without turning the menu into heritage theatre. The small dining room, short service windows and chef’s reputation make reservations essential, especially for Friday and Saturday lunch.",
    officialUrl: "https://www.thelittlechartroom.com/", hoursUrl: "https://www.thelittlechartroom.com/contact-opening-hours",
    hours: "Monday dinner 17:30–20:00; Thursday dinner 17:30–20:00; Friday–Saturday lunch 13:00–14:00 and dinner 18:00–20:30; Sunday lunch 13:00–14:00 and dinner 17:30–20:00; closed Tuesday–Wednesday.",
    photo: "https://images.squarespace-cdn.com/content/v1/5aae2310c3c16ac8a6d78b24/b30ddf32-45df-40b6-a1df-672222a1b11a/IMG_9242.jpeg", bookingUrl: "https://www.thelittlechartroom.com/reservations",
    sourceUrls: ["https://guide.michelin.com/gb/en/city-of-edinburgh/edinburgh/restaurant/the-little-chartroom"], price: "$$$", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["modern_scottish", "seasonal"], subcategory: "modern-scottish", attributeTags: ["chef_owned", "small_room", "advance_booking", "bonnington", "lunch_available"],
  }),
  stop({
    id: "edinburgh-dining-noto", name: "Noto", coordinates: [55.954056, -3.199346],
    description: "Noto serves compact sharing plates shaped by Scottish ingredients and Stuart Ralston’s time in New York, with bespoke cocktails and small-production wines alongside. It is less formal than the city’s tasting rooms, but the strongest dishes reward ordering broadly for the table.",
    officialUrl: "https://notoedinburgh.co.uk/", hoursUrl: "https://notoedinburgh.co.uk/",
    hours: "Daily lunch 12:00–14:30 and dinner 17:30–21:00; the kitchen and bar close between 16:30 and 17:30.",
    photo: "https://notoedinburgh.co.uk/wp-content/uploads/2019/08/DSC8180.jpg", bookingUrl: "https://notoedinburgh.co.uk/",
    sourceUrls: ["https://guide.michelin.com/gb/en/city-of-edinburgh/edinburgh/restaurant/noto"], price: "$$$", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["small_plates", "modern_european", "scottish"], subcategory: "sharing-plates", attributeTags: ["bib_gourmand", "sharing_plates", "new_town", "cocktails", "daily_opening"],
  }),
  stop({
    id: "edinburgh-dining-palmerston", name: "The Palmerston", coordinates: [55.947265, -3.215107],
    description: "The Palmerston combines a serious in-house bakery with a European dining room that buys whole animals and changes the menu around what arrives. Morning pastries disappear quickly; lunch or dinner is where the kitchen’s nose-to-tail approach and confident sauces become clear.",
    officialUrl: "https://www.thepalmerstonedinburgh.co.uk/", hoursUrl: "https://www.thepalmerstonedinburgh.co.uk/",
    hours: "Tuesday–Saturday coffee and pastries 09:00–11:00, lunch 12:00–14:30 and dinner 18:00–21:30; Sunday coffee and pastries 09:00–11:00 and lunch 12:00–15:30; closed Monday.",
    photo: "https://images.squarespace-cdn.com/content/v1/603e3517ff5db27cbd412fe4/4e382910-bac3-42f1-af5f-2c5b08922a96/DSC_8846.jpg", bookingUrl: "https://www.thepalmerstonedinburgh.co.uk/reservations",
    sourceUrls: ["https://guide.michelin.com/gb/en/city-of-edinburgh/edinburgh/restaurant/the-palmerston"], price: "$$$", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["modern_european", "bakery", "nose_to_tail"], subcategory: "bakery-restaurant", attributeTags: ["in_house_bakery", "whole_animal", "west_end", "sunday_lunch", "seasonal"],
  }),
  stop({
    id: "edinburgh-dining-eorna", name: "Eòrna", coordinates: [55.959196, -3.207043],
    description: "Eòrna seats no more than twelve guests around a counter while one chef and one sommelier deliver a single Scottish tasting menu. Everyone arrives together, so this is closer to a dinner party with exact choreography than a flexible restaurant booking.",
    officialUrl: "https://eornarestaurant.com/", hoursUrl: "https://eornarestaurant.com/",
    hours: "Tuesday–Saturday 19:00–23:00; guests arrive at 18:50 for the single shared seating; closed Sunday–Monday.",
    photo: "https://img1.wsimg.com/isteam/ip/5767575d-c6c4-4ba4-b0e7-d51cec9c0936/Eorna%20(March2026)-26.jpg", bookingUrl: "https://eornarestaurant.com/",
    sourceUrls: ["https://guide.michelin.com/gb/en/city-of-edinburgh/edinburgh/restaurant/eorna"], price: "$$$$", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["modern_scottish", "tasting_menu"], subcategory: "counter-tasting-menu", attributeTags: ["twelve_seats", "single_seating", "sommelier", "stockbridge", "advance_booking"],
  }),
  stop({
    id: "edinburgh-dining-eleanore", name: "Eleanore", coordinates: [55.96172, -3.179878],
    description: "Eleanore cooks relaxed modern British food with a concise set-menu structure, thoughtful vegetable options and desserts worth protecting room for. The Albert Place room is informal, but limited services and a strong Sunday lunch make booking ahead sensible.",
    officialUrl: "https://www.eleanore.uk/", hoursUrl: "https://www.eleanore.uk/opening-hours",
    hours: "Wednesday–Saturday lunch 12:00–14:15; Sunday lunch 12:00–16:15; Wednesday–Thursday pre-theatre 17:00–17:30 and dinner 17:45–20:30; Friday–Saturday dinner 17:00–20:30; closed Sunday evening, Monday and Tuesday.",
    photo: "https://images.squarespace-cdn.com/content/v1/60e5281e82a53d0a2c5e1dcc/a4c0ad8b-c31f-4c0b-b6fa-13c3657c05b7/IMG_1631+%281%29.JPG", bookingUrl: "https://www.eleanore.uk/book",
    sourceUrls: ["https://guide.michelin.com/gb/en/city-of-edinburgh/edinburgh/restaurant/eleanore"], price: "$$$", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["modern_british", "seasonal", "vegetarian_friendly"], subcategory: "neighborhood-restaurant", attributeTags: ["leith_walk", "sunday_lunch", "pre_theatre", "vegetarian_menu", "small_room"],
  }),
];

const cheapStops: GuideStop[] = [
  stop({
    id: "edinburgh-cheap-ting-thai", name: "TING THAI Teviot Place", coordinates: [55.945677, -3.190053],
    description: "TING THAI grew from a 2012 festival pop-up into a busy canteen for Thai noodles, curries and small plates cooked fast by a largely Thai kitchen team. Expect a queue at peak times and close-set tables; turnover is brisk enough that waiting usually beats planning around it.",
    officialUrl: "https://www.tingthai.co.uk/teviotplace/", hoursUrl: "https://www.tingthai.co.uk/teviotplace/", hours: "Sunday–Thursday 12:00–22:00; Friday–Saturday 12:00–23:00.",
    photo: "https://c-p.rmcdn.net/59c3bd64613eb0006d7f6359/866296/Screenshot-f6f0f7b3-5ff4-4661-9273-ada1a5b86f27_readyscr_1024.jpg", price: "$", venueKind: "food_drink", foodServiceType: "fast_casual", cuisineTypes: ["thai", "street_food", "noodles"], subcategory: "thai-street-food", attributeTags: ["walk_in", "fast_service", "student_area", "vegetarian_options", "late_evening"],
  }),
  stop({
    id: "edinburgh-cheap-oink", name: "Oink Victoria Street", coordinates: [55.948589, -3.194246],
    description: "Oink does one thing plainly: rolls filled with hot Scottish hog roast, crackling, sauce and optional haggis stuffing. The Victoria Street counter is tiny and shuts when the day’s pork sells out, so it works best as an early lunch rather than a late-afternoon certainty.",
    officialUrl: "https://www.oinkhogroast.co.uk/shops/victoria-street/", hoursUrl: "https://www.oinkhogroast.co.uk/shops/victoria-street/", hours: "Daily 11:00–18:00 in the summer schedule, or earlier when the day’s roast sells out; seasonal closing is controlled by the branch page.",
    photo: "https://www.oinkhogroast.co.uk/wp-content/uploads/2017/04/oink-victoria-street-landscape2.jpg", price: "$", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["scottish", "sandwiches", "hog_roast"], subcategory: "hog-roast-counter", attributeTags: ["takeaway", "quick_lunch", "haggis", "old_town", "may_sell_out"],
  }),
  stop({
    id: "edinburgh-cheap-mosque-kitchen", name: "The Mosque Kitchen", coordinates: [55.945822, -3.185124],
    description: "The Nicolson Square canteen serves substantial plates of curry, rice, kebabs and vegetable dishes with little ceremony and fast counter service. Portions and prices are the point; the dining room is functional, busy and much better suited to appetite than lingering.",
    officialUrl: "https://www.mosquekitchen.com/", hoursUrl: "https://www.mosquekitchen.com/contact-us", hours: "Daily 11:30–22:00.",
    photo: "https://upload.wikimedia.org/wikipedia/commons/0/00/Edinburgh_Mosque_kitchen_-_geograph.org.uk_-_1315877.jpg", sourceUrls: ["https://www.timeout.com/edinburgh/restaurants/the-best-cheap-eats-in-edinburgh"], price: "$", venueKind: "food_drink", foodServiceType: "cafeteria", cuisineTypes: ["indian", "middle_eastern", "curries"], subcategory: "curry-canteen", attributeTags: ["halal", "large_portions", "counter_service", "vegetarian_options", "university_area"],
  }),
  stop({
    id: "edinburgh-cheap-snax", name: "Snax Cafe", coordinates: [55.953673, -3.190592],
    description: "Snax is a no-frills breakfast café for filled rolls, fry-ups, baked potatoes and mugs of tea at prices that feel increasingly rare in central Edinburgh. The West Register Street branch opens early, fills quickly and favors speed over atmosphere.",
    officialUrl: "https://www.snaxcafe.com/", hoursUrl: "https://www.snaxcafe.com/contact", hours: "Monday–Friday 07:00–15:00; Saturday–Sunday 07:30–14:00.",
    photo: "https://static1.squarespace.com/static/5602e658e4b071d1b629a663/t/5fc3e7081972c46e3c160ebb/1606674188216/Publication1.jpg?format=1500w", price: "$", venueKind: "food_drink", foodServiceType: "cafe", cuisineTypes: ["scottish", "breakfast", "sandwiches"], subcategory: "budget-breakfast-cafe", attributeTags: ["early_opening", "full_scottish", "takeaway", "new_town", "no_frills"],
  }),
  stop({
    id: "edinburgh-cheap-pizza-posto", name: "Pizza Posto", coordinates: [55.946799, -3.185529],
    description: "Pizza Posto turns slow-risen multicereal dough into blistered Neapolitan pies in a clay oven, keeping the menu direct and the pricing accessible. The large room suits groups better than many Old Town pizza counters, though pre-theatre periods can be hectic.",
    officialUrl: "https://pizzaposto.co.uk/", hoursUrl: "https://pizzaposto.co.uk/", hours: "Daily 12:00–22:00.",
    photo: "https://images.squarespace-cdn.com/content/v1/5cf68caa3610570001240f03/1718887773354-TDEV9ZK2YFH2WMU45SW9/448173054_10160022669934150_5385295993036297086_n.jpg?format=1500w", bookingUrl: "https://pizzaposto.co.uk/book/", sourceUrls: ["https://www.tartanspoon.co.uk/home/food-pizzaposto"], price: "$", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["italian", "pizza", "neapolitan"], subcategory: "neapolitan-pizza", attributeTags: ["wood_fired", "groups", "vegetarian_options", "pre_theatre", "daily_opening"],
  }),
  stop({
    id: "edinburgh-cheap-chez-jules", name: "Chez Jules", coordinates: [55.954664, -3.197554],
    description: "Chez Jules packs tables tightly for mussels, steak-frites, pâté and generous French set menus without polishing away the bustle. The weekday lunch deal is the value play; evenings are louder and more celebratory than romantic.",
    officialUrl: "https://www.chezjulesbistro.com/", hoursUrl: "https://www.chezjulesbistro.com/contact", hours: "Monday–Thursday and Sunday 12:00–22:00; Friday–Saturday 12:00–23:00.",
    photo: "https://www.chezjulesbistro.com/img/chez-jules-restaurant.jpg", bookingUrl: "https://www.chezjulesbistro.com/reservations", sourceUrls: ["https://upload.wikimedia.org/wikipedia/commons/4/41/Chez_Jules_-_geograph.org.uk_-_7414015.jpg"], price: "$$", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["french", "bistro"], subcategory: "french-bistro", attributeTags: ["set_lunch", "lively", "central", "groups", "late_evening"],
  }),
  stop({
    id: "edinburgh-cheap-albys", name: "Alby's Leith", coordinates: [55.97787, -3.18035],
    description: "Alby’s builds oversized hot sandwiches around slow-cooked meat, fish, sharp pickles and sauces rather than deli convention. Portions are shareable for lighter appetites, and the Portland Place shop is most useful when you can sit down and let the fillings land hot.",
    officialUrl: "https://www.albysleith.co.uk/", hoursUrl: "https://www.albysleith.co.uk/", hours: "Tuesday–Wednesday 12:00–17:00; Thursday–Sunday 12:00–21:00; closed Monday.",
    photo: "https://www.albysleith.co.uk/uploads/b/b0708aa0-cdd9-11ef-8671-8f6f5182d9f8/splash_2048x4435_NTMxND.jpg?width=1536&height=2048&fit=crop", price: "$$", venueKind: "food_drink", foodServiceType: "fast_casual", cuisineTypes: ["sandwiches", "modern_british"], subcategory: "hot-sandwich-shop", attributeTags: ["large_portions", "leith", "casual", "takeaway", "walk_in"],
  }),
  stop({
    id: "edinburgh-cheap-sabzi", name: "Sabzi", coordinates: [55.974263, -3.187472],
    description: "Sabzi changes its Punjabi street-food menu weekly, drawing on family cooking for curries, chaats and abundant vegan choices. The Ferry Road room is compact and neighborhood-focused; weekend brunch broadens the offer beyond the evening menu.",
    officialUrl: "https://www.sabzistreetfood.com/", hoursUrl: "https://www.opentable.co.uk/r/sabzi-edinburgh", hours: "Wednesday–Friday 17:00–21:00; Saturday–Sunday 10:00–21:00; closed Monday–Tuesday.",
    photo: "https://flipdish.imgix.net/DWUxV8FvEfqMbj9gTgEkeRyMo7I.jpg?w=1200&h=900&fit=crop", bookingUrl: "https://www.opentable.co.uk/r/sabzi-edinburgh", price: "$$", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["punjabi", "indian", "street_food"], subcategory: "punjabi-street-food", attributeTags: ["weekly_menu", "vegan_options", "weekend_brunch", "ferry_road", "family_recipes"],
  }),
  stop({
    id: "edinburgh-cheap-edinburgh-larder", name: "Edinburgh Larder", coordinates: [55.950099, -3.186012],
    description: "Edinburgh Larder serves Scottish breakfast, brunch and lunch built around named local suppliers rather than generic tartan branding. The Blackfriars Street café is small and popular, so booking or arriving early matters more on weekends.",
    officialUrl: "https://edinburghlarder.co.uk/", hoursUrl: "https://edinburghlarder.co.uk/", hours: "Monday–Friday 07:30–15:00; Saturday–Sunday 08:00–15:00.",
    photo: "https://edinburghlarder.co.uk/wp-content/uploads/2025/07/Edinburgh-Larder-Featured-Image-v1-1.webp", bookingUrl: "https://edinburghlarder.co.uk/book-a-table/", price: "$$", venueKind: "food_drink", foodServiceType: "cafe", cuisineTypes: ["scottish", "breakfast", "brunch"], subcategory: "local-produce-cafe", attributeTags: ["local_suppliers", "breakfast", "brunch", "old_town", "small_room"],
  }),
  stop({
    id: "edinburgh-cheap-urban-angel", name: "Urban Angel", coordinates: [55.954778, -3.197613],
    description: "Urban Angel handles all-day brunch with proper attention to eggs, pancakes, coffee and dietary requests rather than treating them as afterthoughts. The basement room can feel close at peak times, while the weekday schedule is calmer and slightly longer.",
    officialUrl: "https://www.urban-angel.co.uk/", hoursUrl: "https://www.urban-angel.co.uk/", hours: "Monday–Friday 08:30–15:30; Saturday–Sunday 08:30–16:30; the kitchen closes 30 minutes before the venue.",
    photo: "https://www.urban-angel.co.uk/uploads/restaurant/_1200x630_crop_center-center_82_none/ua_exterior1.jpg?mtime=1698235053", bookingUrl: "https://www.urban-angel.co.uk/book", price: "$$", venueKind: "food_drink", foodServiceType: "cafe", cuisineTypes: ["brunch", "breakfast", "cafe"], subcategory: "all-day-brunch", attributeTags: ["dietary_options", "specialty_coffee", "new_town", "weekend_brunch", "basement"],
  }),
];

const hotelStops: GuideStop[] = [
  stop({
    id: "edinburgh-hotels-balmoral", name: "The Balmoral", coordinates: [55.953088, -3.189263],
    description: "The Balmoral pairs a landmark clock tower above Waverley with 167 rooms, a Michelin-starred restaurant, spa and one of the city’s deepest whisky collections. Rooms facing the castle justify the premium; rail-side convenience also means this is the easiest grand hotel for a short arrival-heavy stay.",
    officialUrl: "https://www.roccofortehotels.com/hotels-and-resorts/the-balmoral-hotel/", hoursUrl: "https://www.booking.com/hotel/gb/the-balmoral.en-gb.html", hours: "Hotel and front desk operate daily; check-in from 15:00 and check-out by 12:00.",
    photo: "https://www.roccofortehotels.com/media/d54dutp2/2-rfh-the-balmoral-facade-0474-jg-sep-18.jpg", bookingUrl: "https://www.booking.com/hotel/gb/the-balmoral.en-gb.html", price: "$$$$", venueKind: "lodging", lodgingType: "hotel", subcategory: "grand-luxury-hotel", attributeTags: ["waverley_station", "spa", "castle_views", "fine_dining", "historic_building"],
  }),
  stop({
    id: "edinburgh-hotels-gleneagles-townhouse", name: "Gleneagles Townhouse", coordinates: [55.954122, -3.191638],
    description: "Gleneagles compresses its country-house polish into 33 bedrooms inside the former Bank of Scotland on St Andrew Square. Guests get a serious gym, rooftop bar access and richly detailed public rooms; the club-like social energy will appeal more than hushed anonymity.",
    officialUrl: "https://gleneagles.com/townhouse/", hoursUrl: "https://gleneagles.com/townhouse/faqs/", hours: "Hotel and front desk operate daily; check-in from 15:00 and check-out by 11:00.",
    photo: "https://gleneagles.com/townhouse/wp-content/uploads/sites/8/2022/05/Glen_Townhse_Shot_12_MR_Bedroom_Master_Wide_Landscape_0241.jpg", bookingUrl: "https://www.booking.com/hotel/gb/gleneagles-townhouse.en-gb.html", price: "$$$$", venueKind: "lodging", lodgingType: "hotel", subcategory: "luxury-townhouse-hotel", attributeTags: ["st_andrew_square", "rooftop_bar", "gym", "historic_bank", "members_club"],
  }),
  stop({
    id: "edinburgh-hotels-virgin", name: "Virgin Hotels Edinburgh", coordinates: [55.948432, -3.192994],
    description: "Virgin fills the restored India Buildings with 222 chambers, bold contemporary art, several bars and restaurants, and castle-facing rooms. The location is excellent but the hotel is emphatically social; light sleepers should request a chamber away from entertainment spaces and street noise.",
    officialUrl: "https://virginhotels.com/edinburgh/the-hotel/", hoursUrl: "https://virginhotels.com/edinburgh/the-hotel/faqs/", hours: "Hotel and front desk operate daily; check-in from 15:00 and check-out by 12:00.",
    photo: "https://media.edinburgh.org/wp-content/uploads/2023/06/27171843/thumb_43685_point_of_interest_bigger.png", bookingUrl: "https://www.booking.com/hotel/gb/virgin-hotels-edinburgh.en-gb.html", sourceUrls: ["https://edinburgh.org/point-of-interest/virgin-hotels-edinburgh/"], price: "$$$$", venueKind: "lodging", lodgingType: "hotel", subcategory: "design-hotel", attributeTags: ["old_town", "castle_views", "restaurants", "nightlife", "pet_friendly"],
  }),
  stop({
    id: "edinburgh-hotels-market-street", name: "Market Street Hotel", coordinates: [55.950924, -3.189745],
    description: "Market Street puts its reception and champagne lounge on the seventh floor, turning Waverley, the Scott Monument and the Old Town skyline into the welcome. Rooms are sharply modern and transport access is exceptional; lower floors trade some outlook for easier pricing.",
    officialUrl: "https://www.marketstreethotel.co.uk/", hoursUrl: "https://www.marketstreethotel.co.uk/terms-and-conditions", hours: "Hotel operates daily; check-in after 15:00 and check-out before 11:00.",
    photo: "https://media.edinburgh.org/wp-content/uploads/2023/04/26161456/thumb_40584_point_of_interest_bigger.jpeg", bookingUrl: "https://www.booking.com/hotel/gb/market-street-hotel.en-gb.html", sourceUrls: ["https://edinburgh.org/point-of-interest/market-street-hotel/"], price: "$$$$", venueKind: "lodging", lodgingType: "hotel", subcategory: "design-boutique-hotel", attributeTags: ["waverley_station", "rooftop_lounge", "city_views", "design_hotel", "central"],
  }),
  stop({
    id: "edinburgh-hotels-kimpton", name: "Kimpton Charlotte Square", coordinates: [55.951628, -3.205748],
    description: "Kimpton joins seven Georgian townhouses around a glass-roofed inner courtyard, with 199 rooms, a compact spa and an indoor pool. Charlotte Square is quieter than the Royal Mile; book a room facing inward if late street traffic matters more than Georgian views.",
    officialUrl: "https://www.kimptoncharlottesquare.com/", hoursUrl: "https://www.kimptoncharlottesquare.com/faq/", hours: "Hotel and front desk operate daily; check-in from 15:00 and check-out by 12:00.",
    photo: "https://www.kimptoncharlottesquare.com/wp-content/uploads/2020/06/16900-20-1-fa8a5491-1.jpg", bookingUrl: "https://www.booking.com/hotel/gb/the-principal-edinburgh-charlotte-square.en-gb.html", price: "$$$$", venueKind: "lodging", lodgingType: "hotel", subcategory: "georgian-luxury-hotel", attributeTags: ["charlotte_square", "spa", "indoor_pool", "pet_friendly", "courtyard"],
  }),
  stop({
    id: "edinburgh-hotels-fingal", name: "Fingal", coordinates: [55.979203, -3.169153],
    description: "Fingal is a permanently berthed former lighthouse tender converted into 22 cabins and suites at Alexandra Dock. Brass, timber and engine-room detail create genuine maritime character; cabin dimensions and waterside distance from the centre are the tradeoffs, not gimmicks.",
    officialUrl: "https://www.fingal.co.uk/", hoursUrl: "https://www.fingal.co.uk/booking-terms/", hours: "Hotel operates daily; check-in after 15:00 and check-out before 12:00.",
    photo: "https://www.fingal.co.uk/media/1010/6-high_res_fingal029.jpg?rxy=0.48638132295719844,0.31578947368421051&width=1200&height=1200&quality=100&v=1dc1ce9d33b2a60", bookingUrl: "https://www.booking.com/hotel/gb/fingal-a-luxury-floating.en-gb.html", price: "$$$$", venueKind: "lodging", lodgingType: "hotel", subcategory: "floating-boutique-hotel", attributeTags: ["leith", "floating_hotel", "maritime", "small_property", "restaurant"],
  }),
  stop({
    id: "edinburgh-hotels-roseate", name: "The Roseate Edinburgh", coordinates: [55.946062, -3.229049],
    description: "The Roseate spreads 35 individually styled rooms across two Victorian townhouses west of the centre, with deep bathtubs, fireplaces and a whisky-led bar in the mix. It is calmer than an Old Town base, but guests should account for the walk or bus ride into the core.",
    officialUrl: "https://www.roseatehotels.com/edinburgh/theroseate/", hoursUrl: "https://www.roseatehotels.com/edinburgh/theroseate/hotel-policies/", hours: "Hotel and front desk operate daily; check-in from 15:00 and check-out by 12:00.",
    photo: "https://www.roseatehotels.com/edinburgh/theroseate/wp-content/uploads/2024/07/TRE-3.jpg", bookingUrl: "https://www.booking.com/hotel/gb/dunstane-city.en-gb.html", price: "$$$", venueKind: "lodging", lodgingType: "hotel", subcategory: "victorian-boutique-hotel", attributeTags: ["west_coates", "townhouse", "whisky_bar", "quiet", "bus_access"],
  }),
  stop({
    id: "edinburgh-hotels-witchery", name: "The Witchery by the Castle", coordinates: [55.948807, -3.195626],
    description: "The Witchery’s nine theatrical suites pile antiques, velvet, carved wood and freestanding baths into 16th-century buildings beside the castle. Privacy and atmosphere are exceptional, but narrow stairs, uneven floors and restaurant crowds make this a poor fit for accessibility or minimalist calm.",
    officialUrl: "https://www.thewitchery.com/", hoursUrl: "https://www.thewitchery.com/privacy-policy/terms-and-conditions/", hours: "Suites operate daily; check-in after 14:30 and check-out before 11:30.",
    photo: "https://www.thewitchery.com/media/zqgcnqxv/witchery-sign-1.jpg?width=1200&height=630&v=1db88686bb2fc30", bookingUrl: "https://www.booking.com/hotel/gb/the-witchery-by-the-castle.en-gb.html", price: "$$$$", venueKind: "lodging", lodgingType: "hotel", subcategory: "historic-luxury-suites", attributeTags: ["castlehill", "historic_building", "romantic", "restaurant", "stairs"],
  }),
  stop({
    id: "edinburgh-hotels-hoxton", name: "The Hoxton Edinburgh", coordinates: [55.946983, -3.217049],
    description: "The Hoxton connects Georgian townhouses across Grosvenor Street with 214 compact-to-generous rooms, an open-house lobby and restaurant. Haymarket access is excellent and the tone is lively; the smallest categories suit short stays better than travelers carrying serious luggage.",
    officialUrl: "https://thehoxton.com/edinburgh/", hoursUrl: "https://thehoxton.com/edinburgh/faqs/", hours: "Hotel and front desk operate daily; standard check-in from 14:00 and check-out by 12:00; direct bookings can request Flexy Time subject to availability.",
    photo: "https://thehoxton.com/wp-content/uploads/sites/5/2024/02/th-edinburgh-featured-1400x1000-1.jpg", bookingUrl: "https://www.booking.com/hotel/gb/the-hoxton-edinburgh.en-gb.html", price: "$$$", venueKind: "lodging", lodgingType: "hotel", subcategory: "lifestyle-hotel", attributeTags: ["haymarket", "georgian_townhouses", "restaurant", "social_lobby", "compact_rooms_available"],
  }),
  stop({
    id: "edinburgh-hotels-100-princes", name: "100 Princes Street", coordinates: [55.951594, -3.200138],
    description: "This 30-room Red Carnation hotel turns the former Royal Overseas League headquarters into a private, richly layered Scottish address. Castle-facing rooms, a hand-painted explorers’ staircase and dedicated whisky room distinguish it; the tiny key count keeps rates and availability firmly at luxury level.",
    officialUrl: "https://100princes-street.com/", hoursUrl: "https://www.booking.com/hotel/gb/over-seas-house.en-gb.html", hours: "Hotel and front desk operate daily; check-in 15:00–23:00 and check-out 07:00–11:00.",
    photo: "https://prod-media.redcarnationhotels.com/media/chtbxhuw/100-princes-street-exterior-view.jpg?width=768&height=850&format=jpg&quality=80&rxy=0.2669172932330827,0.8442087094511891&v=1dc4a4a945f9680", bookingUrl: "https://www.booking.com/hotel/gb/over-seas-house.en-gb.html", price: "$$$$", venueKind: "lodging", lodgingType: "hotel", subcategory: "ultra-luxury-boutique", attributeTags: ["princes_street", "castle_views", "small_property", "whisky_room", "historic_club"],
  }),
];

const hostelStops: GuideStop[] = [
  stop({
    id: "edinburgh-hostels-castle-rock", name: "Castle Rock Hostel", coordinates: [55.948206, -3.195937],
    description: "Castle Rock fills an atmospheric Old Town building with themed lounges, social events and direct castle views. It is built for adult backpackers who want conversation and activity, not hotel quiet; the historic stair-heavy layout is a real accessibility constraint.",
    officialUrl: "https://www.castlerockedinburgh.com/", hoursUrl: "https://www.castlerockedinburgh.com/", hours: "Reception operates 24 hours; check-in from 15:00 and check-out by 10:30; guests must be 18 or older.",
    photo: "https://static.wixstatic.com/media/7ae8ac_c20a24ff8a5f403ebbb2512daa53e25f%7Emv2.jpg/v1/fit/w_2500,h_1330,al_c/7ae8ac_c20a24ff8a5f403ebbb2512daa53e25f%7Emv2.jpg", bookingUrl: "https://www.hostelworld.com/hostels/p/551/castle-rock-hostel/", price: "$", venueKind: "lodging", lodgingType: "hostel", subcategory: "social-backpacker-hostel", attributeTags: ["adult_only", "castle_views", "social_events", "guest_kitchen", "stairs"],
  }),
  stop({
    id: "edinburgh-hostels-high-street", name: "High Street Hostel", coordinates: [55.949944, -3.186251],
    description: "Edinburgh’s long-running Old Town backpacker hostel combines a well-used kitchen, fireplace lounge and organized social events seconds from the Royal Mile. Dorm life is sociable without being club-like; the older building still means stairs and creaks.",
    officialUrl: "https://www.highstreethostel.com/", hoursUrl: "https://www.highstreethostel.com/frequently-asked-questions", hours: "Reception operates 24 hours; check-in from 15:00 and check-out by 10:30; guests must be 18 or older.",
    photo: "https://static.wixstatic.com/media/7ae8ac_dde3f82f4b0d4c49a3409fd5e4b8636d%7Emv2.jpg/v1/fit/w_2500,h_1330,al_c/7ae8ac_dde3f82f4b0d4c49a3409fd5e4b8636d%7Emv2.jpg", bookingUrl: "https://www.hostelworld.com/hostels/p/552/high-street-hostel/", price: "$", venueKind: "lodging", lodgingType: "hostel", subcategory: "historic-social-hostel", attributeTags: ["adult_only", "royal_mile", "guest_kitchen", "social_events", "fireplace_lounge"],
  }),
  stop({
    id: "edinburgh-hostels-code-court", name: "CODE The Court", coordinates: [55.949449, -3.18984],
    description: "CODE converts a former courthouse and jail into pod dorms, private cells and a basement bar just off the Royal Mile. Curtains and keypad entry add privacy beyond a standard bunk, while nightly activities keep the large property openly social.",
    officialUrl: "https://staywithcode.com/court", hoursUrl: "https://staywithcode.com/contact-us/", hours: "Reception operates 24 hours; check-in from 15:00 and check-out by 11:00.",
    photo: "https://staywithcode.com/court/wp-content/uploads/sites/3/2025/10/263551bb3598a6f38660cb5f52720ef65dadd767.jpg", bookingUrl: "https://www.hostelworld.com/hostels/p/296113/code-the-court/", price: "$", venueKind: "lodging", lodgingType: "hostel", subcategory: "pod-hostel", attributeTags: ["pod_beds", "former_courthouse", "bar", "social_events", "central"],
  }),
  stop({
    id: "edinburgh-hostels-code-loft", name: "CODE The Loft", coordinates: [55.952548, -3.199459],
    description: "The Loft is CODE’s smaller, calmer Rose Street property, using capsule-style bunks, keyless entry and a self-catering kitchen. Limited reception and a compact common room make it better for independent travelers than people seeking a programmed party hostel.",
    officialUrl: "https://staywithcode.com/loft", hoursUrl: "https://staywithcode.com/contact-us/", hours: "Daily check-in from 15:00 and check-out by 11:00; reception hours are limited and access instructions are sent after payment; guests must be 18 or older.",
    photo: "https://staywithcode.com/loft/wp-content/uploads/sites/5/2025/10/image-1.jpg", bookingUrl: "https://www.hostelworld.com/hostels/p/89285/code-the-loft/", price: "$", venueKind: "lodging", lodgingType: "hostel", subcategory: "small-pod-hostel", attributeTags: ["pod_beds", "adult_only", "self_check_in", "guest_kitchen", "quiet_social"],
  }),
  stop({
    id: "edinburgh-hostels-central-youth", name: "Edinburgh Central Youth Hostel", coordinates: [55.959859, -3.183259],
    description: "Hostelling Scotland’s modern central property offers dorms, family rooms, a guest kitchen and a licensed café in a more structured setting than the Old Town party hostels. Strong accessibility and all-age accommodation make it especially useful for families and mixed-generation groups.",
    officialUrl: "https://www.hostellingscotland.org.uk/hostels/edinburgh-central/", hoursUrl: "https://www.hostellingscotland.org.uk/hostels/edinburgh-central/", hours: "Reception operates 24 hours; check-in 16:00–23:00 and check-out 07:00–10:00.",
    photo: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Edinburgh_Central_Youth_Hostel_-_geograph.org.uk_-_1296434.jpg", bookingUrl: "https://www.hostelworld.com/hostels/p/16747/edinburgh-central-youth-hostel/", price: "$", venueKind: "lodging", lodgingType: "hostel", subcategory: "all-ages-youth-hostel", attributeTags: ["family_friendly", "accessible", "guest_kitchen", "cafe", "24_hour_reception"],
  }),
  stop({
    id: "edinburgh-hostels-backpackers", name: "Edinburgh Backpackers", coordinates: [55.950624, -3.188498],
    description: "Edinburgh Backpackers spreads dorms and private rooms across several steep historic buildings on Cockburn Street, with a kitchen, games room and direct Old Town access. Value and location are excellent; no lift and substantial stairs are non-negotiable parts of the stay.",
    officialUrl: "https://www.edinburghbackpackershostel.com/", hoursUrl: "https://www.edinburghbackpackershostel.com/terms-conditions", hours: "Daily check-in 14:00–23:00 and check-out by 10:00; no guests under 18; registered guests retain 24-hour access.",
    photo: "https://images.squarespace-cdn.com/content/v1/5a93e8beee1759706cf3d62b/1521027385538-F8KXGB8G3B2XWJLULHBG/ebh-web-10.jpg", bookingUrl: "https://www.hostelworld.com/hostels/p/5001/edinburgh-backpackers/", price: "$", venueKind: "lodging", lodgingType: "hostel", subcategory: "central-backpacker-hostel", attributeTags: ["adult_only", "guest_kitchen", "old_town", "stairs", "games_room"],
  }),
  stop({
    id: "edinburgh-hostels-princes-street", name: "Princes Street Hostel", coordinates: [55.953623, -3.190341],
    description: "This compact hostel occupies upper floors near Waverley, with privacy-curtain bunks, a small kitchen and straightforward self-catering facilities. Transport convenience is exceptional, but four storeys without a lift will outweigh the low rates for some travelers.",
    officialUrl: "https://princesstreethostel.com/", hoursUrl: "https://princesstreethostel.com/faq/", hours: "Check-in from 15:00 and check-out by 10:00; staff are available until midnight Sunday–Thursday and 02:00 Friday–Saturday; registered guests have 24-hour access.",
    photo: "https://princesstreethostel.com/assets/backpackers-1200x735.467b5e85.jpg", bookingUrl: "https://www.hostelworld.com/hostels/p/312644/princes-street-hostel/", price: "$", venueKind: "lodging", lodgingType: "hostel", subcategory: "transport-convenient-hostel", attributeTags: ["waverley_station", "privacy_curtains", "guest_kitchen", "no_lift", "compact"],
  }),
  stop({
    id: "edinburgh-hostels-royal-mile", name: "Royal Mile Backpackers", coordinates: [55.950517, -3.18617],
    description: "Royal Mile Backpackers is a small, colorful adults-only hostel with a 24-hour kitchen and a gentler social atmosphere than its larger sister properties. Events happen across the group, so it suits travelers who want company without sleeping over the main party.",
    officialUrl: "https://www.royalmilebackpackers.com/", hoursUrl: "https://www.royalmilebackpackers.com/frequently-asked-questions", hours: "Daily reception 08:00–11:00 and 15:00–23:00; check-in 15:00–22:00 and check-out by 10:00; overnight assistance is at High Street Hostel; guests must be 18 or older.",
    photo: "https://static.wixstatic.com/media/7ae8ac_eab5a90255a44501a14028fc73fbf6a9%7Emv2.jpg/v1/fit/w_2500,h_1330,al_c/7ae8ac_eab5a90255a44501a14028fc73fbf6a9%7Emv2.jpg", bookingUrl: "https://www.hostelworld.com/hostels/p/11242/royal-mile-backpackers/", price: "$", venueKind: "lodging", lodgingType: "hostel", subcategory: "small-social-hostel", attributeTags: ["adult_only", "royal_mile", "guest_kitchen", "small_property", "social_events"],
  }),
  stop({
    id: "edinburgh-hostels-kick-ass", name: "Kick Ass Grassmarket", coordinates: [55.946713, -3.197775],
    description: "Kick Ass Grassmarket is an unapologetically social adults-only hostel with pod beds, a bar, café, large common rooms and nightly events below the castle. Noise and organized partying are features rather than accidents; book elsewhere for early nights.",
    officialUrl: "https://kickasshostels.co.uk/kick-ass-grassmarket/", hoursUrl: "https://kickasshostels.co.uk/frequently-asked-questions", hours: "Reception operates 24 hours; check-in from 14:00 and check-out by 10:00; guests must be 18 or older.",
    photo: "https://kickasshostels.co.uk/wp-content/uploads/2020/02/Slider_E_2_1500x600.jpg", bookingUrl: "https://www.hostelworld.com/hostels/p/84137/kick-ass-grassmarket/", price: "$", venueKind: "lodging", lodgingType: "hostel", subcategory: "party-hostel", attributeTags: ["adult_only", "party_hostel", "bar", "pod_beds", "24_hour_reception"],
  }),
  stop({
    id: "edinburgh-hostels-ao", name: "a&o Edinburgh City", coordinates: [55.94914, -3.18623],
    description: "a&o combines large dorm inventory, private family rooms, a bar and round-the-clock reception near the Royal Mile. The scale keeps availability and pricing competitive during busy dates, though atmosphere is more functional and group-heavy than intimate.",
    officialUrl: "https://www.aohostels.com/en/edinburgh/edinburgh-city/", hoursUrl: "https://www.aohostels.com/en/infos/checkin/", hours: "Reception operates 24 hours; rooms are available from 15:00; check-out by 10:00 on weekdays and 11:00 on weekends and public holidays.",
    photo: "https://cdn.aohostels.com/img/house/gallery/edinburgh-city/53822.jpg", bookingUrl: "https://www.hostelworld.com/hostels/p/14409/a-and-o-edinburgh-city/", price: "$", venueKind: "lodging", lodgingType: "hostel", subcategory: "large-budget-hostel", attributeTags: ["family_rooms", "bar", "24_hour_reception", "groups", "central"],
  }),
];

const pubStops: GuideStop[] = [
  stop({
    id: "edinburgh-pubs-bow-bar", name: "The Bow Bar", coordinates: [55.948423, -3.194137],
    description: "The Bow Bar pours rotating cask ale and a formidable whisky selection in a narrow, wood-lined room with no music or television competing for attention. Space disappears quickly after work and during festivals; conversation and the chalkboard are the entertainment.",
    officialUrl: "https://www.thebowbar.co.uk/", hoursUrl: "https://www.thebowbar.co.uk/contact", hours: "Daily 12:00–00:00.",
    photo: "https://static.wixstatic.com/media/30f359_01dcbfc4228a4ed98e6f20ceef8db6d1~mv2.jpg/v1/crop/x_0,y_416,w_1811,h_3113/fill/w_750,h_1288,al_c,q_85/1000054098.jpg", price: "$$", venueKind: "nightlife", nightlifeType: "pub", subcategory: "whisky-and-cask-ale-pub", attributeTags: ["whisky", "cask_ale", "no_music", "old_town", "small_room"],
  }),
  stop({
    id: "edinburgh-pubs-sandy-bells", name: "Sandy Bell's", coordinates: [55.946081, -3.19129],
    description: "Sandy Bell’s is a working traditional-music pub, with musicians gathering for informal Scottish and Irish sessions rather than staged tourist sets. The front room gets dense and listening etiquette matters; arrive outside peak evening hours if you need a seat.",
    officialUrl: "https://sandybells.com/", hoursUrl: "https://sandybells.com/opening-times/", hours: "Monday–Saturday 12:00–01:00; Sunday 12:30–00:00; live sessions follow the official music schedule.",
    photo: "https://sandybells.com/wp-content/uploads/2020/09/Sandy-Bells-exterior.jpg", sourceUrls: ["https://edinburgh.org/point-of-interest/sandy-bells/"], price: "$$", venueKind: "nightlife", nightlifeType: "live_music_venue", musicGenres: ["scottish_traditional", "irish_traditional", "folk"], subcategory: "traditional-music-pub", attributeTags: ["live_music", "folk_sessions", "old_town", "small_room", "late_night"],
  }),
  stop({
    id: "edinburgh-pubs-dreadnought", name: "Dreadnought Leith", coordinates: [55.978931, -3.186494],
    description: "Dreadnought is an independent Leith local with well-kept cask beer, an inclusive door and a crowd that mixes regulars, dogs and music people without polishing the edges. CAMRA named it Edinburgh Pub of the Year for 2026; the North Fort Street location is deliberately away from the centre.",
    officialUrl: "https://www.dreadnoughtpub.com/", hoursUrl: "https://www.dreadnoughtpub.com/", hours: "Monday–Thursday 16:00–00:00; Friday–Saturday 14:00–01:00; Sunday 14:00–22:00.",
    photo: "https://images.squarespace-cdn.com/content/v1/5ffc8965ad0efe510fcb5302/1654084633166-D31D1GUT1PR6L1ITLVQQ/CAMRA+Ad+Bridge.jpg", sourceUrls: ["https://camra.org.uk/pubs/dreadnought-edinburgh-150275"], price: "$$", venueKind: "nightlife", nightlifeType: "pub", subcategory: "independent-neighborhood-pub", attributeTags: ["camra_award", "cask_ale", "inclusive", "dog_friendly", "leith"],
  }),
  stop({
    id: "edinburgh-pubs-cloisters", name: "Cloisters Bar", coordinates: [55.943272, -3.201883],
    description: "Cloisters occupies a former church parsonage and treats beer and whisky with the seriousness the vaulted stone room suggests: nine cask lines, ten keg lines and more than seventy malts. It remains a pub rather than a museum, especially when nearby theatre and university crowds arrive.",
    officialUrl: "https://www.cloisters.bar/", hoursUrl: "https://www.cloisters.bar/", hours: "Monday 13:00–23:00; Tuesday 12:00–23:00; Wednesday–Saturday 12:00–00:00; Sunday 12:30–23:00.",
    photo: "https://static.wixstatic.com/media/62459d_9158c9619fbd47e08d12a4273f805f83.jpg/v1/fit/w_2500,h_1330,al_c/62459d_9158c9619fbd47e08d12a4273f805f83.jpg", price: "$$", venueKind: "nightlife", nightlifeType: "beer_bar", subcategory: "real-ale-and-whisky-pub", attributeTags: ["cask_ale", "whisky", "historic_interior", "tollcross", "dog_friendly"],
  }),
  stop({
    id: "edinburgh-pubs-kays", name: "Kay's Bar", coordinates: [55.955714, -3.205028],
    description: "Kay’s preserves the scale and fittings of a Victorian wine merchant’s shop, pouring cask ale and whisky in two tiny rooms behind Jamaica Street. The intimacy is the appeal until every seat is taken; large groups should accept that they may be split or turned away.",
    officialUrl: "https://www.kaysbar.uk/", hoursUrl: "https://www.kaysbar.uk/contact", hours: "Monday–Thursday 11:00–23:00; Friday–Saturday 11:00–00:00; Sunday 12:30–23:00.",
    photo: "https://images.squarespace-cdn.com/content/v1/62d94d82c97f8d71d072c422/43f9ed41-3401-419a-85c3-7e105dc02520/KAY%27s-illy-scan_Layered_2880px_CROP.jpg", sourceUrls: ["https://edinburgh.camra.org.uk/viewnode.php?id=187690"], price: "$$", venueKind: "nightlife", nightlifeType: "pub", subcategory: "victorian-local", attributeTags: ["victorian_interior", "cask_ale", "whisky", "new_town", "small_room"],
  }),
  stop({
    id: "edinburgh-pubs-jolly-judge", name: "The Jolly Judge", coordinates: [55.94952, -3.193948],
    description: "The Jolly Judge hides below a Lawnmarket close, where a low ceiling, fireplace, cask ale and cider make the cellar feel genuinely snug rather than themed. It earned consecutive local CAMRA honors, and its modest size rewards an early pint.",
    officialUrl: "https://jollyjudge.co.uk/", hoursUrl: "https://jollyjudge.co.uk/", hours: "Monday 12:00–00:00; Tuesday–Wednesday 12:00–23:00; Thursday–Saturday 12:00–00:00; Sunday 12:00–23:00.",
    photo: "https://jollyjudge.co.uk/img/IMG_3564-1024x683.jpg", price: "$$", venueKind: "nightlife", nightlifeType: "pub", subcategory: "cellar-real-ale-pub", attributeTags: ["cask_ale", "cider", "fireplace", "old_town", "camra_award"],
  }),
  stop({
    id: "edinburgh-pubs-blue-blazer", name: "The Blue Blazer", coordinates: [55.945946, -3.203178],
    description: "The Blue Blazer is a broad-shouldered West Port pub for rotating cask and craft beer, whisky and late conversation, with enough room to absorb a mixed local crowd. It gets louder toward the one-o’clock close but never needs a costume or concept.",
    officialUrl: "https://kilderkingroup.co.uk/the-blue-blazer/", hoursUrl: "https://kilderkingroup.co.uk/the-blue-blazer/", hours: "Monday–Wednesday 15:00–01:00; Thursday–Saturday 12:00–01:00; Sunday 13:00–01:00.",
    photo: "https://kilderkingroup.co.uk/wp-content/uploads/2024/01/redroom1-300x200.jpg", price: "$$", venueKind: "nightlife", nightlifeType: "pub", subcategory: "late-night-beer-pub", attributeTags: ["cask_ale", "craft_beer", "whisky", "late_night", "west_port"],
  }),
  stop({
    id: "edinburgh-pubs-athletic-arms", name: "Athletic Arms", coordinates: [55.938951, -3.223844],
    description: "Known locally as Diggers, Athletic Arms keeps more than 700 whiskies and 22 taps behind a proper Gorgie pub bar. Tynecastle match days transform the room and the surrounding streets; visit outside football traffic for measured drams and easier conversation.",
    officialUrl: "https://athleticarms.co.uk/", hoursUrl: "https://athleticarms.co.uk/contact-book/", hours: "Sunday–Thursday 11:00–01:00; Friday–Saturday 12:00–01:00; football fixtures can alter crowding and service patterns.",
    photo: "https://athleticarms.co.uk/wp-content/themes/yootheme/cache/003A2364-HDR-scaled-103e8825.jpeg", sourceUrls: ["https://camra.org.uk/pubs/athletic-arms-edinburgh-150073"], price: "$$", venueKind: "nightlife", nightlifeType: "pub", subcategory: "whisky-and-football-pub", attributeTags: ["whisky", "cask_ale", "football_crowd", "gorgie", "late_night"],
  }),
  stop({
    id: "edinburgh-pubs-cafe-royal", name: "Cafe Royal", coordinates: [55.953795, -3.190484],
    description: "Cafe Royal wraps a circular island bar in stained glass, tile panels and Victorian plasterwork, then backs the architecture with oysters, seafood, cask ale and whisky. It is beautiful enough to attract sightseers, but table service and food pricing sit above the casual-pub norm.",
    officialUrl: "https://www.caferoyaledinburgh.com/", hoursUrl: "https://www.caferoyaledinburgh.com/find-us", hours: "Monday–Wednesday and Sunday 11:00–23:00; Thursday–Saturday 09:00–01:00.",
    photo: "https://gkbr-p-001.sitecorecontenthub.cloud/api/public/content/c1dc96f4bc3d4d93a8240f9390fc3c65?v=f9fd524d", price: "$$$", venueKind: "nightlife", nightlifeType: "pub", subcategory: "victorian-oyster-bar", attributeTags: ["victorian_interior", "oysters", "seafood", "whisky", "central"],
  }),
  stop({
    id: "edinburgh-pubs-stockbridge-tap", name: "The Stockbridge Tap", coordinates: [55.95895, -3.209966],
    description: "The Stockbridge Tap is an independent corner local focused on changing cask beer, Scottish breweries and unfussy conversation. It has fewer theatrical details than central historic pubs and more neighborhood rhythm; seating becomes scarce on weekend afternoons.",
    officialUrl: "https://edinburgh.org/point-of-interest/the-stockbridge-tap/", hoursUrl: "https://edinburgh.org/point-of-interest/the-stockbridge-tap/", hours: "Daily 13:00–23:00.",
    photo: "https://media.edinburgh.org/wp-content/uploads/2023/06/13113654/thumb_43560_point_of_interest_bigger.jpeg", sourceUrls: ["https://camra.org.uk/pubs/stockbridge-tap-edinburgh-150190"], price: "$$", venueKind: "nightlife", nightlifeType: "pub", subcategory: "independent-neighborhood-pub", attributeTags: ["cask_ale", "scottish_beer", "stockbridge", "independent", "dog_friendly"],
  }),
];

const cocktailStops: GuideStop[] = [
  stop({
    id: "edinburgh-cocktails-panda", name: "Panda & Sons", coordinates: [55.953207, -3.206972],
    description: "A mock barbershop and bookcase conceal Panda & Sons, where Iain McPherson’s team applies freezing, fermentation and other kitchen-minded techniques to playful drinks. The theatrics are real but the liquid earns them; reservations are prudent on Friday and Saturday.",
    officialUrl: "https://pandaandsons.com/", hoursUrl: "https://www.timeout.com/edinburgh/bars-and-pubs/the-best-cocktail-bars-in-edinburgh", hours: "Monday–Thursday 16:00–00:00; Friday 16:00–01:00; Saturday 14:00–01:00; Sunday 15:00–00:00.",
    photo: "https://c-p.rmcdn.net/63d23ac4af28d300317302fc/4126122/Screenshot-d32af6d1-17da-4c9b-b86c-30b49a9330cc_readyscr_1024.jpg", bookingUrl: "https://pandaandsons.com/", sourceUrls: ["https://www.theworlds50best.com/bars/best-in-europe/the-list/panda-and-sons.html"], price: "$$$", venueKind: "nightlife", nightlifeType: "cocktail_bar", subcategory: "experimental-speakeasy", attributeTags: ["worlds_50_best", "reservations", "new_town", "experimental_drinks", "basement"],
  }),
  stop({
    id: "edinburgh-cocktails-bramble", name: "Bramble Bar & Lounge", coordinates: [55.954852, -3.19757],
    description: "Bramble helped define Edinburgh’s modern cocktail scene with a discreet Queen Street basement, candlelit alcoves and bartenders who favor balance over spectacle. The room is small, the music can rise late and walk-ins work best near opening.",
    officialUrl: "https://www.bramblebar.co.uk/", hoursUrl: "https://www.timeout.com/edinburgh/bars-and-pubs/the-best-cocktail-bars-in-edinburgh", hours: "Daily 16:00–01:00.",
    photo: "https://irp.cdn-website.com//c7dd6640/dms3rep/multi/opt/Annotation+2019-12-18+114002-1920w.jpg", sourceUrls: ["https://edinburgh.org/blog/edinburghs-top-cocktail-bars/"], price: "$$$", venueKind: "nightlife", nightlifeType: "cocktail_bar", subcategory: "basement-cocktail-bar", attributeTags: ["basement", "walk_in", "new_town", "late_night", "intimate"],
  }),
  stop({
    id: "edinburgh-cocktails-hey-palu", name: "Hey Palu", coordinates: [55.945921, -3.202817],
    description: "Hey Palu filters Italian aperitivo culture through Edinburgh, building drinks around amari, vermouth and bitters while serving pasta, pecorino and affogato from the same small room. It is relaxed before dinner and more animated later, with no need for speakeasy theater.",
    officialUrl: "https://www.heypalu.com/", hoursUrl: "https://www.heypalu.com/", hours: "Daily 16:00–01:00.",
    photo: "https://images.squarespace-cdn.com/content/v1/5d5961aec8fcf200010cb9a0/ea20b45f-9205-4134-8fe7-303e5dd7f237/andy-galloway-making-cocktails.jpg.jpg", sourceUrls: ["https://www.timeout.com/edinburgh/bars-and-pubs/the-best-cocktail-bars-in-edinburgh"], price: "$$$", venueKind: "nightlife", nightlifeType: "cocktail_bar", subcategory: "italian-aperitivo-bar", attributeTags: ["amaro", "aperitivo", "food_available", "bread_street", "late_night"],
  }),
  stop({
    id: "edinburgh-cocktails-nauticus", name: "Nauticus", coordinates: [55.968959, -3.168088],
    description: "Nauticus treats Scottish spirits, beer and produce as a creative brief rather than a flag-waving exercise, with whisky and local ingredients running through the cocktail list. The handsome Duke Street bar feels like a pub with sharper drinks, and happy-hour periods are notably busier.",
    officialUrl: "https://nauticusbar.co.uk/", hoursUrl: "https://nauticusbar.co.uk/", hours: "Monday–Thursday 16:00–00:00; Friday 16:00–01:00; Saturday 14:00–01:00; Sunday 15:00–00:00.",
    photo: "https://nauticusbar.co.uk/i/gallery/gallery-1-2000px.jpg", price: "$$$", venueKind: "nightlife", nightlifeType: "cocktail_bar", subcategory: "scottish-spirits-bar", attributeTags: ["scottish_spirits", "whisky", "leith", "happy_hour", "food_available"],
  }),
  stop({
    id: "edinburgh-cocktails-lucky-liquor", name: "Lucky Liquor Co", coordinates: [55.954176, -3.201532],
    description: "Lucky Liquor keeps the room stripped back and puts its energy into seasonal drinks, house syrups and cordials, with a 100-percent vinyl soundtrack behind the bar. It is friendlier and brighter than a hushed speakeasy, but still compact enough to fill quickly.",
    officialUrl: "https://www.luckyliquorco.com/", hoursUrl: "https://www.timeout.com/edinburgh/bars-and-pubs/the-best-cocktail-bars-in-edinburgh", hours: "Daily 16:00–01:00.",
    photo: "https://www.luckyliquorco.com/uploads/VbFmQOCd/768x0_480x0/interior_1-min__msi___jpg.webp", sourceUrls: ["https://edinburgh.org/blog/edinburghs-top-cocktail-bars/"], price: "$$$", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["vinyl"], subcategory: "seasonal-cocktail-bar", attributeTags: ["house_cordials", "vinyl", "new_town", "late_night", "walk_in"],
  }),
  stop({
    id: "edinburgh-cocktails-last-word", name: "The Last Word Saloon", coordinates: [55.95776, -3.206599],
    description: "The Last Word brings the Bramble group’s technical confidence to a warmer Stockbridge basement lined with paraffin lamps, wood and odd taxidermy. House-made mixers and strong classics suit a proper seated drink; the neighborhood setting is calmer than Queen Street until weekends bite.",
    officialUrl: "https://www.the-last-word.co.uk/", hoursUrl: "https://www.timeout.com/edinburgh/bars-and-pubs/the-best-cocktail-bars-in-edinburgh", hours: "Daily 16:00–01:00.",
    photo: "https://media.edinburgh.org/wp-content/uploads/2023/06/19201133/The-Last-Word-Saloon-e1687201935944-1920x1042.jpg", sourceUrls: ["https://edinburgh.org/food-and-drink/bars-and-pubs-in-edinburgh/"], price: "$$$", venueKind: "nightlife", nightlifeType: "cocktail_bar", subcategory: "neighborhood-cocktail-bar", attributeTags: ["stockbridge", "basement", "house_mixers", "intimate", "late_night"],
  }),
  stop({
    id: "edinburgh-cocktails-dragonfly", name: "Dragonfly", coordinates: [55.946374, -3.199481],
    description: "Dragonfly is a veteran West Port cocktail bar with a ground-floor room, small mezzanine and an approachable list that costs less than many New Town peers. The décor shows its age, but generous hours and unpretentious service keep it useful.",
    officialUrl: "https://www.dragonflycocktailbar.com/", hoursUrl: "https://www.timeout.com/edinburgh/bars-and-pubs/the-best-cocktail-bars-in-edinburgh", hours: "Tuesday–Friday and Sunday 16:00–01:00; Saturday 14:00–01:00; closed Monday.",
    photo: "https://www.dragonflycocktailbar.com/images/lower_background.jpg", bookingUrl: "https://www.opentable.co.uk/r/dragonfly-cocktail-bar-edinburgh", price: "$$", venueKind: "nightlife", nightlifeType: "cocktail_bar", subcategory: "casual-cocktail-bar", attributeTags: ["west_port", "mezzanine", "good_value", "late_night", "reservations_available"],
  }),
  stop({
    id: "edinburgh-cocktails-devils-advocate", name: "The Devil’s Advocate", coordinates: [55.950294, -3.191671],
    description: "The Devil’s Advocate fills a 19th-century Old Town pump house with more than 300 Scottish and international whiskies, signature cocktails and seasonal Scottish cooking. The stone, wood and amber-lit room has real architectural drama; reaching it via Advocate’s Close requires stairs, and tables are worth booking at peak times.",
    officialUrl: "https://www.devilsadvocateedinburgh.co.uk/", hoursUrl: "https://www.devilsadvocateedinburgh.co.uk/find-us", hours: "Sunday–Thursday 12:00–00:00; Friday–Saturday 12:00–01:00; food served daily until 21:30 and the terrace closes at 22:00.",
    photo: "https://images.squarespace-cdn.com/content/v1/697b4001868d1d2b14f7e3d7/e0c2bfad-a4ed-4fcd-8c41-11d2e12b9df0/homepage-hero2.png?format=1500w", bookingUrl: "https://www.devilsadvocateedinburgh.co.uk/book", sourceUrls: ["https://www.timeout.com/edinburgh/bars-and-pubs/the-devils-advocate"], price: "$$$", venueKind: "nightlife", nightlifeType: "cocktail_bar", subcategory: "whisky-cocktail-bar", attributeTags: ["whisky", "historic_building", "old_town", "food_available", "advance_booking"],
  }),
  stop({
    id: "edinburgh-cocktails-raging-bull", name: "The Raging Bull", coordinates: [55.945089, -3.20492],
    description: "The Raging Bull leans into espresso-martini variations, playful signatures and a lively Lothian Road room without pretending to be austere. A private basement and cocktail classes broaden the offer, while late hours make it more animated than intimate.",
    officialUrl: "https://theragingbulledinburgh.co.uk/", hoursUrl: "https://theragingbulledinburgh.co.uk/edinburgh-cocktail-bar/", hours: "Monday–Thursday 17:00–01:00; Friday 16:00–01:00; Saturday 14:00–01:00; Sunday 17:00–01:00.",
    photo: "https://theragingbulledinburgh.co.uk/wp-content/uploads/2024/11/The-Raging-Bull-MB-Media-6.jpg", bookingUrl: "https://theragingbulledinburgh.co.uk/reservation/", price: "$$$", venueKind: "nightlife", nightlifeType: "cocktail_bar", subcategory: "lively-cocktail-bar", attributeTags: ["espresso_martini", "masterclasses", "private_room", "lothian_road", "late_night"],
  }),
  stop({
    id: "edinburgh-cocktails-little-capo", name: "Little Capo", coordinates: [55.956132, -3.20249],
    description: "Little Capo wraps an Italian-inspired cocktail list, amaro and low-intervention wine around a softly lit aperitivo counter and a concise small-plates menu. Drinks seats are walk-in only while dining tables can be reserved, so the bar works best before the evening rush.",
    officialUrl: "https://www.littlecapo.com/", hoursUrl: "https://www.timeout.com/edinburgh/bars-and-pubs/the-best-cocktail-bars-in-edinburgh", hours: "Daily 12:00–21:30 for published lunch, dinner and cocktail service.",
    photo: "https://static.wixstatic.com/media/a862a8_8966f4f5b2724db7b61b9a65b2f7fe25~mv2.jpg", bookingUrl: "https://www.littlecapo.com/", price: "$$$", venueKind: "nightlife", nightlifeType: "cocktail_bar", subcategory: "aperitivo-and-cocktails", attributeTags: ["aperitivo", "italian", "food_available", "walk_in_drinks", "new_town"],
  }),
];

const cultureStops: GuideStop[] = [
  stop({
    id: "edinburgh-culture-national-museum", name: "National Museum of Scotland", coordinates: [55.947071, -3.189335],
    description: "Scotland’s national museum moves from geology and archaeology to design, science and global cultures around a luminous Victorian Grand Gallery. Admission is free and the scale is deceptive; choose two or three collections rather than trying to clear the building.",
    officialUrl: "https://www.nms.ac.uk/national-museum-of-scotland/", hoursUrl: "https://www.nms.ac.uk/national-museum-of-scotland/plan-your-visit", hours: "Daily 10:00–17:00; closed 25 December; 26 December and 1 January 12:00–17:00.",
    photo: "https://upload.wikimedia.org/wikipedia/commons/5/55/The_Grand_Gallery_of_the_National_Museum_of_Scotland_-_geograph.org.uk_-_2561565.jpg", sourceUrls: ["https://www.visitscotland.com/info/see-do/national-museum-of-scotland-p246471"], venueKind: "culture", subcategory: "national-museum", attributeTags: ["free_entry", "scottish_history", "science", "family_friendly", "rainy_day"],
  }),
  stop({
    id: "edinburgh-culture-national-gallery", name: "Scottish National Gallery", coordinates: [55.950885, -3.195612],
    description: "The National presents European old masters and the national collection of historic Scottish art in William Playfair’s building on the Mound. The permanent galleries are free and compact enough for a focused hour, while paid exhibitions and room rotations reward checking the programme.",
    officialUrl: "https://www.nationalgalleries.org/visit/national", hoursUrl: "https://www.nationalgalleries.org/visit", hours: "Daily 10:00–17:00; last admission 16:45; some temporary exhibitions use timed tickets.",
    photo: "https://upload.wikimedia.org/wikipedia/commons/d/d6/National_Gallery_of_Scotland_2005-08-07.jpg", venueKind: "culture", subcategory: "national-art-gallery", attributeTags: ["free_entry", "old_masters", "scottish_art", "central", "accessible"],
  }),
  stop({
    id: "edinburgh-culture-portrait-gallery", name: "Scottish National Portrait Gallery", coordinates: [55.955466, -3.193592],
    description: "Portrait uses painting, photography and sculpture to tell Scottish history through its people, from Mary, Queen of Scots to contemporary scientists, performers and athletes. The red sandstone neo-Gothic building and star-covered Great Hall are part of the visit, not just a container for it.",
    officialUrl: "https://www.nationalgalleries.org/visit/scottish-national-portrait-gallery", hoursUrl: "https://www.nationalgalleries.org/visit/scottish-national-portrait-gallery", hours: "Daily 10:00–17:00; last admission 16:45; admission is free except for selected exhibitions.",
    photo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Scottish_National_Portrait_Gallery_%282013%29.jpg", venueKind: "culture", subcategory: "portrait-gallery", attributeTags: ["free_entry", "portraits", "scottish_history", "great_hall", "new_town"],
  }),
  stop({
    id: "edinburgh-culture-modern-one", name: "Modern One", coordinates: [55.950904, -3.227905],
    description: "Modern One covers major modern movements, post-1960 international work and contemporary Scottish art in a former school surrounded by sculpture and Charles Jencks’ landform. Displays change often; the walk through Dean Village or along the Water of Leith adds context but also time.",
    officialUrl: "https://www.nationalgalleries.org/visit/modern-one", hoursUrl: "https://www.nationalgalleries.org/visit/modern-one", hours: "Gallery daily 10:00–17:00; grounds daily 07:00–18:00, with the Water of Leith gate closing at dusk October–March.",
    photo: "https://upload.wikimedia.org/wikipedia/commons/6/60/Modern_One_-_rear%2C_cafe%2C_garden_MG_1144.jpeg", venueKind: "culture", subcategory: "modern-art-gallery", attributeTags: ["free_entry", "modern_art", "sculpture_park", "dean_village", "cafe"],
  }),
  stop({
    id: "edinburgh-culture-museum-edinburgh", name: "Museum of Edinburgh", coordinates: [55.95121, -3.1795],
    description: "A maze of 16th-century rooms holds the National Covenant, Greyfriars Bobby’s collar and bowl, decorative arts and evidence of the city’s rough civic life. Admission is free, but stairs and tight passages make the historic building less accessible than its subject deserves.",
    officialUrl: "https://cultureedinburgh.com/our-venues/museum-of-edinburgh", hoursUrl: "https://cultureedinburgh.com/our-venues/museum-of-edinburgh", hours: "Daily 10:00–17:00; last entry 16:30; admission is free.",
    photo: "https://cultureedinburgh.com/api/media/file/100Museums.JPG", venueKind: "culture", subcategory: "city-history-museum", attributeTags: ["free_entry", "edinburgh_history", "royal_mile", "historic_building", "stairs"],
  }),
  stop({
    id: "edinburgh-culture-writers-museum", name: "The Writers' Museum", coordinates: [55.949691, -3.193742],
    description: "Lady Stair’s House gathers manuscripts and personal objects from Robert Burns, Walter Scott and Robert Louis Stevenson, including Burns’ desk, Scott’s printing press and Stevenson’s riding boots. It is free, intimate and stair-heavy, with Makars’ Court immediately outside.",
    officialUrl: "https://cultureedinburgh.com/our-venues/writers-museum", hoursUrl: "https://cultureedinburgh.com/our-venues/writers-museum", hours: "Daily 10:00–17:00; last entry 16:30; admission is free.",
    photo: "https://cultureedinburgh.com/api/media/file/The%20Writers%20Museum_35.jpg", venueKind: "culture", subcategory: "literary-museum", attributeTags: ["free_entry", "literature", "robert_burns", "walter_scott", "robert_louis_stevenson"],
  }),
  stop({
    id: "edinburgh-culture-childhood", name: "Museum of Childhood", coordinates: [55.95033, -3.185507],
    description: "The world’s first museum devoted to childhood tracks toys, games, clothing, books and school life from the 1800s onward. Adults get social history and sharp nostalgia while children get hands-on corners; the collection includes a Kindertransport bear as well as playthings.",
    officialUrl: "https://cultureedinburgh.com/our-venues/museum-of-childhood", hoursUrl: "https://cultureedinburgh.com/our-venues/museum-of-childhood", hours: "Daily 10:00–17:00; last entry 16:30; admission is free.",
    photo: "https://cultureedinburgh.com/api/media/file/Museum%20of%20Childhood53.JPG", venueKind: "culture", subcategory: "social-history-museum", attributeTags: ["free_entry", "family_friendly", "toys", "social_history", "royal_mile"],
  }),
  stop({
    id: "edinburgh-culture-city-art-centre", name: "City Art Centre", coordinates: [55.951012, -3.189213],
    description: "City Art Centre rotates Edinburgh’s nationally recognized collection of Scottish visual and applied art through temporary shows rather than keeping a fixed permanent hang. Six accessible floors and a location opposite Waverley make it easy to sample, but the programme determines what is actually on view.",
    officialUrl: "https://cultureedinburgh.com/our-venues/city-art-centre", hoursUrl: "https://cultureedinburgh.com/our-venues/city-art-centre", hours: "Daily 10:00–17:00; last entry 16:30; admission is usually free, with charges for selected exhibitions.",
    photo: "https://cultureedinburgh.com/api/media/file/20260514%20CAC-25%20(1).jpg", venueKind: "culture", subcategory: "municipal-art-gallery", attributeTags: ["scottish_art", "temporary_exhibitions", "accessible", "waverley_station", "usually_free"],
  }),
  stop({
    id: "edinburgh-culture-surgeons-hall", name: "Surgeons' Hall Museums", coordinates: [55.946767, -3.18468],
    description: "Three museums examine surgery, dentistry and pathology through instruments, specimens and the history of the Royal College of Surgeons. Human remains are central rather than incidental, making the content absorbing but unsuitable for some visitors and generally recommended for ages ten and up.",
    officialUrl: "https://museum.rcsed.ac.uk/", hoursUrl: "https://museum.rcsed.ac.uk/visit/tickets", hours: "Daily 10:00–17:00; last entry 16:30; closed from 17:00 on 23 December 2026 through 5 January 2027 at 10:00.",
    photo: "https://upload.wikimedia.org/wikipedia/commons/0/01/Surgeons%27_Hall_Exterior_3_2022.jpg", venueKind: "culture", subcategory: "medical-history-museum", attributeTags: ["medical_history", "human_remains", "age_10_plus_recommended", "paid_entry", "rainy_day"],
  }),
  stop({
    id: "edinburgh-culture-national-library", name: "National Library of Scotland", coordinates: [55.948664, -3.192068],
    description: "Scotland’s legal-deposit library opens its visitor centre, permanent Treasures display and changing exhibitions without requiring a research agenda. Reading rooms need free registration, while public galleries reveal manuscripts, maps and printed culture in manageable, sharply curated doses.",
    officialUrl: "https://www.nls.uk/visit/george-iv-bridge/", hoursUrl: "https://www.nls.uk/visit/george-iv-bridge/", hours: "Monday–Thursday 10:00–19:00; Friday–Saturday 10:00–17:00; closed Sunday; seasonal holiday changes are published on the official hours page.",
    photo: "https://www.nls.uk/media/213jy2lx/givb-facade-entrance.jpg?rxy=0.516,0.5011851671006945&width=1200&height=630&format=webp&v=1dbcfb02ab52570", sourceUrls: ["https://www.nls.uk/whats-on/treasures-of-the-national-library-of-scotland/"], venueKind: "culture", subcategory: "national-library-and-exhibitions", attributeTags: ["free_entry", "books", "manuscripts", "exhibitions", "research_library"],
  }),
];

const activityStops: GuideStop[] = [
  stop({
    id: "edinburgh-activities-castle", name: "Edinburgh Castle", coordinates: [55.948688, -3.200418],
    description: "The castle layers royal apartments, military prisons, the Honours of Scotland and the one-o’clock gun across a steep volcanic stronghold. Timed tickets sell out in summer, and the cobbles, slopes and steps make the free mobility vehicle worth requesting when needed.",
    officialUrl: "https://www.historicenvironment.scot/visit/all/edinburgh-castle/", hoursUrl: "https://www.historicenvironment.scot/visit/all/edinburgh-castle/plan-your-visit/", hours: "Daily 09:30–18:00 from 1 April–30 September and 09:30–17:00 from 1 October–31 March; 24 December 09:30–16:00; 1 January 11:00–17:00; last entry is one hour before closing.",
    photo: "https://www.historicenvironment.scot/media/4qhfrv04/castle-from-ross-fountain.jpg?width=1200&height=630", bookingUrl: "https://www.historicenvironment.scot/visit/all/edinburgh-castle/tickets/", venueKind: "landmark", subcategory: "historic-castle", attributeTags: ["advance_booking", "crown_jewels", "military_history", "city_views", "steep_cobbles"],
  }),
  stop({
    id: "edinburgh-activities-holyroodhouse", name: "Palace of Holyroodhouse", coordinates: [55.952695, -3.171613],
    description: "The King’s official Scottish residence opens state apartments, Mary, Queen of Scots’ chambers, the Great Gallery and the roofless abbey. Royal use produces real closures, not theoretical caveats, so date-specific checking matters before walking the Royal Mile.",
    officialUrl: "https://www.rct.uk/visit/palace-of-holyroodhouse", hoursUrl: "https://media.rct.uk/sites/default/files/2026-03/02-04-2026%20Opening%20times%20and%20closure%20list.pdf", hours: "21 May–14 September 2026 daily 09:30–18:00, last admission 16:30; 17 September–31 October Thursday–Monday 09:30–18:00; 1 November–31 December Thursday–Monday 09:30–16:30, last admission 15:15; closed 25–26 December and on listed royal-use dates.",
    photo: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Edinburgh_Palace_of_Holyroodhouse_from_Salisbury_Crags_20211019.jpg", bookingUrl: "https://tickets.rct.uk/product/11/104", venueKind: "landmark", subcategory: "working-royal-palace", attributeTags: ["royal_history", "mary_queen_of_scots", "abbey", "advance_booking", "royal_closures"],
  }),
  stop({
    id: "edinburgh-activities-camera-obscura", name: "Camera Obscura & World of Illusions", coordinates: [55.949029, -3.195604],
    description: "Five floors of optical tricks, a Victorian camera obscura and a rooftop terrace make this the city’s most hands-on central attraction. The building is stair-intensive and busiest in bad weather; same-day re-entry and late opening make a quieter evening visit practical.",
    officialUrl: "https://www.camera-obscura.co.uk/", hoursUrl: "https://www.camera-obscura.co.uk/opening-hours", hours: "12–30 August daily 09:00–22:00; 31 August–10 October Sunday–Thursday 09:00–20:00, Friday 09:00–21:00, Saturday 09:00–21:30; later seasonal hours and final admission are controlled by the official dated calendar.",
    photo: "https://www.camera-obscura.co.uk/mediaLibrary/images/english/2395.jpg", bookingUrl: "https://www.camera-obscura.co.uk/view-tickets/", venueKind: "culture", subcategory: "interactive-optical-attraction", attributeTags: ["family_friendly", "interactive", "rooftop_views", "late_opening", "stairs"],
  }),
  stop({
    id: "edinburgh-activities-britannia", name: "The Royal Yacht Britannia", coordinates: [55.982146, -3.177309],
    description: "Britannia preserves the royal apartments, crew quarters, engine room and working spaces of the former royal yacht in Leith. The contrast between state rooms and below-deck labor is the substance; allow roughly two hours and enter through the Ocean Terminal visitor centre.",
    officialUrl: "https://www.royalyachtbritannia.co.uk/visit/", hoursUrl: "https://www.royalyachtbritannia.co.uk/visit/opening-hours/", hours: "Daily April–October first entry 09:30, last entry 16:00, close 18:00; daily November–March first entry 10:00, last entry 15:00, close 17:00; closed 25 December and 1 January; listed August and December dates close early.",
    photo: "https://www.royalyachtbritannia.co.uk/media/wrsgyrtq/160512-marc-millar-britannia-deck-2.jpg?width=1200&height=870&quality=100", bookingUrl: "https://www.royalyachtbritannia.co.uk/visit/tickets/", venueKind: "culture", subcategory: "historic-ship", attributeTags: ["royal_history", "maritime", "leith", "audio_tour", "accessible"],
  }),
  stop({
    id: "edinburgh-activities-mary-kings-close", name: "The Real Mary King's Close", coordinates: [55.949961, -3.190446],
    description: "Costumed guides lead hour-long tours through preserved closes sealed beneath the City Chambers, focusing on the documented residents, trades and epidemics of the 17th century. Low ceilings, uneven steps and a ban on under-fives are practical realities; peak tours sell out.",
    officialUrl: "https://www.realmarykingsclose.com/", hoursUrl: "https://www.realmarykingsclose.com/plan-your-visit/opening-times/", hours: "Tours run daily on the official demand-based booking calendar; the August 2026 schedule opens 08:30–23:30 with last standard entry at 22:00; the site opens 30 minutes before the first tour and the shop closes 90 minutes after the final tour begins.",
    photo: "https://www.realmarykingsclose.com/media/owvd5hdl/trmkc-bottom-of-close-01.webp?anchor=center&rmode=crop&width=1920&height=639&quality=80", bookingUrl: "https://bookings.realmarykingsclose.com/", venueKind: "culture", subcategory: "guided-underground-history-tour", attributeTags: ["guided_tour", "underground", "advance_booking", "age_5_plus", "stairs"],
  }),
  stop({
    id: "edinburgh-activities-whisky-experience", name: "The Scotch Whisky Experience", coordinates: [55.948743, -3.195875],
    description: "Guided experiences explain Scotch regions, production and blending before entering the Diageo Claive Vidiz collection, one of the world’s largest displays of Scotch whisky. Tour tiers determine how much is tasted; non-drinkers and drivers receive alternatives rather than being excluded.",
    officialUrl: "https://www.scotchwhiskyexperience.co.uk/", hoursUrl: "https://www.scotchwhiskyexperience.co.uk/plan-your-visit/", hours: "Daily from 10:00; last whisky tour 19:00; shop 10:00–20:00; Amber Restaurant and Whisky Bar 12:00–21:00.",
    photo: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Castlehill_School_%28Now_The_Scotch_Whisky_Experience%29%2C_354_Castlehill%2C_The_Royal_Mile%2C_Edinburgh_%281%29.jpg", bookingUrl: "https://www.scotchwhiskyexperience.co.uk/tour-experiences/", venueKind: "culture", subcategory: "whisky-tour", attributeTags: ["guided_tour", "whisky", "tasting", "castlehill", "advance_booking"],
  }),
  stop({
    id: "edinburgh-activities-arthurs-seat", name: "Arthur's Seat & Holyrood Park", coordinates: [55.944069, -3.161603],
    description: "The extinct volcano rises abruptly above Holyrood, with exposed paths reaching broad city and Firth of Forth views. Wind, mud and slick rock can turn a short climb serious; the Radical Road remains closed while Historic Environment Scotland works toward phased reopening.",
    officialUrl: "https://www.historicenvironment.scot/visit/all/holyrood-park/", hoursUrl: "https://www.historicenvironment.scot/visit/all/holyrood-park/plan-your-visit/", hours: "Pedestrian access to open park paths is ungated daily; Queen’s Drive vehicle gates follow the official monthly schedule (May 08:00–18:00) and event closures; the Radical Road closure and any weather restrictions are posted on the official plan-your-visit page.",
    photo: "https://www.historicenvironment.scot/media/ngjfmlr2/hi00004108.jpg?width=1200&height=630", venueKind: "outdoors", subcategory: "urban-hill-walk", attributeTags: ["hiking", "city_views", "free_entry", "weather_dependent", "path_closure"],
  }),
  stop({
    id: "edinburgh-activities-zoo", name: "Edinburgh Zoo", coordinates: [55.945473, -3.269589],
    description: "The conservation zoo climbs Corstorphine Hill through more than 2,500 animals, with penguins, koalas and a strong breeding and research programme. The hillside is physically demanding despite mobility routes; indoor habitats can open later or close thirty minutes before the grounds.",
    officialUrl: "https://www.edinburghzoo.org.uk/", hoursUrl: "https://www.edinburghzoo.org.uk/visit/opening-hours", hours: "Daily January–February 10:00–16:00; March and October 10:00–17:00; April–September 10:00–18:00; November–December 10:00–16:00; last entry one hour before closing; closed 25 December.",
    photo: "https://images.rzss.org.uk/media/Edinburgh_Zoo/EZ_animals/Pygmy_hippopotamus/pygmyhippo2026.png", bookingUrl: "https://www.edinburghzoo.org.uk/tickets", venueKind: "outdoors", subcategory: "conservation-zoo", attributeTags: ["family_friendly", "wildlife", "conservation", "hillside", "advance_booking"],
  }),
  stop({
    id: "edinburgh-activities-botanic-garden", name: "Royal Botanic Garden Edinburgh", coordinates: [55.965285, -3.208859],
    description: "Seventy acres of living plant collections combine woodland, rock gardens, seasonal borders and views toward the skyline at one of the world’s leading botanical institutions. Garden admission is free, but the historic glasshouses remain closed for restoration and some routes are restricted by the project.",
    officialUrl: "https://www.rbge.org.uk/visit/royal-botanic-garden-edinburgh/", hoursUrl: "https://www.rbge.org.uk/visit/royal-botanic-garden-edinburgh/", hours: "February–October daily 10:00–17:00; November and January 10:00–16:00; December 10:00–15:30; closed 25 December and 1 January; extreme-weather closures are posted on the official page.",
    photo: "https://www.rbge.org.uk/media/oowdjeoa/ec_edinburgh_landscape_001-2.jpg?rxy=0.6769468741764282,0.398087052677682&width=1400&height=1050&v=1dba545f659d350", venueKind: "outdoors", subcategory: "botanic-garden", attributeTags: ["free_entry", "plants", "accessible_routes", "glasshouses_closed", "weather_policy"],
  }),
  stop({
    id: "edinburgh-activities-parliament", name: "Scottish Parliament", coordinates: [55.952469, -3.175663],
    description: "Enric Miralles’ parliament building opens its public hall, art collection, permanent exhibition and chamber viewing to free self-guided visits. Parliamentary business can restrict rooms with little notice; a guided tour gives the architecture and political process more shape when dates align.",
    officialUrl: "https://www.parliament.scot/visit", hoursUrl: "https://www.parliament.scot/visit/plan-your-visit", hours: "Self-guided visits Monday–Saturday 10:00–17:00, last entry 16:30; on sitting Tuesday–Thursday the building may open 09:00–18:30, last entry 18:00; recess and parliamentary business can alter access on the official calendar.",
    photo: "https://www.parliament.scot//-/media/images/home/building/spinthomepagefb.jpg", bookingUrl: "https://www.parliament.scot/visit/tours", venueKind: "culture", subcategory: "working-parliament", attributeTags: ["free_entry", "architecture", "politics", "guided_tours", "accessible"],
  }),
];

const diningEditorialSources: ListSource[] = [
  source("Michelin Guide — Best restaurants in Edinburgh", "https://guide.michelin.com/gb/en/best-of/the-best-restaurants-in-edinburgh"),
  source("Michelin Guide — Edinburgh restaurants", "https://guide.michelin.com/gb/en/city-of-edinburgh/edinburgh/restaurants"),
  source("Time Out — Best restaurants in Edinburgh", "https://www.timeout.com/edinburgh/restaurants"),
  source("The Week — A foodie guide to Edinburgh", "https://theweek.com/culture-life/food-drink/a-foodie-guide-to-edinburgh"),
];

const cheapEditorialSources: ListSource[] = [
  source("Time Out — Best cheap eats in Edinburgh", "https://www.timeout.com/edinburgh/restaurants/the-best-cheap-eats-in-edinburgh"),
  source("SquareMeal — Best cheap eats in Edinburgh", "https://www.squaremeal.co.uk/restaurants/best-for/best-cheap-eats-edinburgh_9969"),
  source("Forever Edinburgh — Food and drink", "https://edinburgh.org/food-and-drink/"),
  source("Tripadvisor — Cheap eats in Edinburgh", "https://www.tripadvisor.co.uk/Restaurants-g186525-zfp16-Edinburgh_Scotland.html"),
];

const hotelEditorialSources: ListSource[] = [
  source("Time Out — Best hotels in Edinburgh", "https://www.timeout.com/edinburgh/hotels/the-best-hotels-in-edinburgh"),
  source("Condé Nast Traveler — Best hotels in Edinburgh", "https://www.cntraveler.com/gallery/the-best-hotels-in-edinburgh"),
  source("Michelin Guide — Edinburgh hotels", "https://guide.michelin.com/gb/en/hotels-stays/edinburgh"),
  source("Forever Edinburgh — Accommodation", "https://edinburgh.org/accommodation/"),
];

const hostelEditorialSources: ListSource[] = [
  source("Hostelworld — Edinburgh hostels", "https://www.hostelworld.com/hostels/europe/scotland/edinburgh/"),
  source("Hostelz — Edinburgh hostels", "https://www.hostelz.com/hostels/Scotland/Edinburgh"),
  source("Hostelling Scotland — Edinburgh", "https://www.hostellingscotland.org.uk/destinations/edinburgh/"),
  source("Forever Edinburgh — Budget accommodation", "https://edinburgh.org/accommodation/"),
];

const pubEditorialSources: ListSource[] = [
  source("Forever Edinburgh — Bars and pubs", "https://edinburgh.org/food-and-drink/bars-and-pubs-in-edinburgh/"),
  source("CAMRA — Edinburgh pubs", "https://camra.org.uk/pubs/place/Edinburgh"),
  source("Time Out — Bars and pubs in Edinburgh", "https://www.timeout.com/edinburgh/bars-and-pubs"),
  source("Edinburgh Spirit — Best pubs 2026", "https://www.edinburgh-spirit.com/guides/best-pubs-edinburgh/"),
];

const cocktailEditorialSources: ListSource[] = [
  source("Time Out — Best cocktail bars in Edinburgh 2026", "https://www.timeout.com/edinburgh/bars-and-pubs/the-best-cocktail-bars-in-edinburgh"),
  source("Forever Edinburgh — Top cocktail bars 2026", "https://edinburgh.org/blog/edinburghs-top-cocktail-bars/"),
  source("The World's 50 Best Bars — Panda & Sons", "https://www.theworlds50best.com/bars/best-in-europe/the-list/panda-and-sons.html"),
  source("Top 50 Cocktail Bars — Scotland", "https://www.top50cocktailbars.com/"),
];

const cultureEditorialSources: ListSource[] = [
  source("Forever Edinburgh — Museums", "https://edinburgh.org/things-to-do/museums/"),
  source("VisitScotland — Museums and galleries in Edinburgh", "https://www.visitscotland.com/things-to-do/attractions/museums-galleries/edinburgh-lothians"),
  source("Culture Edinburgh — Venues", "https://cultureedinburgh.com/our-venues"),
  source("National Galleries of Scotland — Visit", "https://www.nationalgalleries.org/visit"),
];

const activityEditorialSources: ListSource[] = [
  source("VisitScotland — Things to do in Edinburgh", "https://www.visitscotland.com/places-to-go/edinburgh/things-to-do"),
  source("Forever Edinburgh — All things to do", "https://edinburgh.org/all-things-to-do/"),
  source("Tripadvisor — Edinburgh attractions", "https://www.tripadvisor.co.uk/Attractions-g186525-Activities-Edinburgh_Scotland.html"),
  source("Historic Environment Scotland — Edinburgh", "https://www.historicenvironment.scot/visit-a-place/places/?region=edinburgh-and-the-lothians"),
];

function completeSources(editorial: ListSource[], stops: GuideStop[]) {
  return [
    ...editorial,
    ...stops.map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name))),
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
    url: maps(title),
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

const diningGuide = guide(
  "Food",
  "list-edinburgh-citywide-dining",
  "edinburgh-citywide-dining",
  "best-restaurants",
  "Scottish Produce, Seafood & Precise Cooking",
  "Edinburgh’s strongest dining rooms move between rigorous tasting menus, seafood-led kitchens and relaxed modern bistros without losing sight of Scotland’s larder. These ten restaurants make the time, price and reservation commitment clear.",
  diningStops,
  completeSources(diningEditorialSources, diningStops),
  "Best Restaurants in Edinburgh for Destination Dining",
  "Ten source-backed Edinburgh restaurants spanning Michelin tasting menus, Scottish seafood, modern bistros and serious neighborhood dining.",
);

const cheapGuide = guide(
  "Food",
  "list-edinburgh-citywide-cheap-eats",
  "edinburgh-citywide-cheap-eats",
  "best-cheap-eats",
  "Curries, Hot Rolls & Proper Budget Lunches",
  "Edinburgh’s good-value food is strongest when it stays specific: Punjabi street food, Thai canteen cooking, hot roast rolls, Neapolitan pizza and locally sourced breakfast. These ten places balance price with real character and useful branch-level hours.",
  cheapStops,
  completeSources(cheapEditorialSources, cheapStops),
  "Best Cheap Eats in Edinburgh for Curries, Pizza and Big Sandwiches",
  "Ten verified Edinburgh cheap eats covering Thai street food, curry, pizza, hot sandwiches, brunch, French set lunches and Scottish breakfast.",
);

const hotelGuide = guide(
  "Stay",
  "list-edinburgh-citywide-hotels",
  "edinburgh-citywide-hotels",
  "best-hotels",
  "Grand Landmarks, Townhouses & Design Hotels",
  "Edinburgh’s most distinctive hotels occupy clock towers, Georgian terraces, a former bank, a royal yacht tender and the city’s historic closes. These ten stays explain where design and service justify the rate—and where room size, stairs or nightlife complicate it.",
  hotelStops,
  completeSources(hotelEditorialSources, hotelStops),
  "Best Hotels in Edinburgh for Luxury, Design and Location",
  "Ten source-backed Edinburgh hotels spanning grand landmarks, intimate townhouses, contemporary design, castle views and a floating Leith stay.",
);

const hostelGuide = guide(
  "Stay",
  "list-edinburgh-citywide-hostels",
  "edinburgh-citywide-hostels",
  "best-hostels",
  "Pod Beds, Social Lounges & Central Dorms",
  "Edinburgh’s hostel field ranges from castle-facing party bases and historic backpacker rooms to quiet pods and all-age youth accommodation. These ten current dorm properties state check-in limits, age rules, kitchens, stairs and social intensity plainly.",
  hostelStops,
  completeSources(hostelEditorialSources, hostelStops),
  "Best Hostels in Edinburgh for Dorms, Social Stays and Value",
  "Ten verified Edinburgh hostels with dorm inventory, direct booking links and practical notes on kitchens, privacy, age limits, reception and noise.",
);

const pubGuide = guide(
  "Nightlife",
  "list-edinburgh-citywide-pubs",
  "edinburgh-citywide-pubs",
  "best-pubs",
  "Cask Ale, Whisky & Traditional Sessions",
  "Edinburgh’s pub culture lives in tiny Victorian rooms, Leith locals, whisky-heavy bars and spontaneous folk sessions. These ten pubs distinguish the beer, music, crowd and architecture without confusing genuine character with tartan decoration.",
  pubStops,
  completeSources(pubEditorialSources, pubStops),
  "Best Pubs in Edinburgh for Whisky, Real Ale and Live Folk Music",
  "Ten verified Edinburgh pubs covering cask ale, deep whisky lists, traditional music, historic interiors and independent neighborhood locals.",
);

const cocktailGuide = guide(
  "Nightlife",
  "list-edinburgh-citywide-cocktail-bars",
  "edinburgh-citywide-cocktail-bars",
  "best-cocktail-bars",
  "Inventive Drinks, Aperitivo & Basement Rooms",
  "Edinburgh’s cocktail bars range from technical, globally recognized experiments to Italian aperitivo counters and friendly neighborhood basements. These ten rooms have a point of view, current schedules and an honest account of booking, noise and late-night access.",
  cocktailStops,
  completeSources(cocktailEditorialSources, cocktailStops),
  "Best Cocktail Bars in Edinburgh for Creative Drinks and Classics",
  "Ten source-backed Edinburgh cocktail bars spanning experimental drinks, Italian aperitivo, Scottish spirits, intimate basements and late-night service.",
);

const cultureGuide = guide(
  "Culture",
  "list-edinburgh-citywide-culture",
  "edinburgh-citywide-culture",
  "best-museums-and-culture",
  "Scottish Art, Literature & Difficult History",
  "Edinburgh’s cultural institutions hold national art, surgical specimens, children’s social history, literary relics and the material record of the city itself. These ten venues balance famous collections with smaller rooms that reward precise curiosity.",
  cultureStops,
  completeSources(cultureEditorialSources, cultureStops),
  "Best Museums and Cultural Sights in Edinburgh",
  "Ten essential Edinburgh museums, galleries and cultural institutions with current hours and practical context for art, literature, science and social history.",
);

const activityGuide = guide(
  "Activities",
  "list-edinburgh-citywide-activities",
  "edinburgh-citywide-activities",
  "best-things-to-do",
  "Castles, Crags & Stories Under the Royal Mile",
  "Edinburgh rewards a mix of royal buildings, volcanic walks, guided underground history, whisky, wildlife and interactive attractions. These ten experiences include the bookings, closures, terrain and seasonal schedules that materially shape a visit.",
  activityStops,
  completeSources(activityEditorialSources, activityStops),
  "Best Things to Do in Edinburgh: Sights, Tours and Outdoor Views",
  "Ten essential Edinburgh activities with source-backed hours for the castle, palace, Royal Yacht, underground tours, whisky, Arthur’s Seat and more.",
);

export const edinburghCitywideGuides: MapList[] = [
  diningGuide,
  cheapGuide,
  hotelGuide,
  hostelGuide,
  pubGuide,
  cocktailGuide,
  cultureGuide,
  activityGuide,
];
