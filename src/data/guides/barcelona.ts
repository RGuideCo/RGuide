import type { GuideStop, ListSource, MapList } from "@/types";

const BARCELONA_AIRPORT_AEROBUS_ROUTE: [number, number][] = [
  [41.28875, 2.073252],
  [41.290116, 2.072429],
  [41.290179, 2.072206],
  [41.288487, 2.067402],
  [41.288405, 2.066322],
  [41.288605, 2.065347],
  [41.289256, 2.063748],
  [41.293512, 2.055225],
  [41.294372, 2.053898],
  [41.295059, 2.0531],
  [41.295854, 2.052558],
  [41.296436, 2.052498],
  [41.297557, 2.05301],
  [41.298565, 2.053831],
  [41.298708, 2.054389],
  [41.299121, 2.054508],
  [41.299461, 2.054872],
  [41.30036, 2.05625],
  [41.300497, 2.058072],
  [41.300714, 2.05868],
  [41.301082, 2.059084],
  [41.302356, 2.059725],
  [41.302823, 2.06048],
  [41.30289, 2.061086],
  [41.302581, 2.061565],
  [41.302556, 2.061988],
  [41.302964, 2.062471],
  [41.304279, 2.066398],
  [41.303236, 2.067159],
  [41.303419, 2.067543],
  [41.303321, 2.067773],
  [41.301654, 2.068775],
  [41.301493, 2.068663],
  [41.301486, 2.068381],
  [41.301793, 2.068196],
  [41.302143, 2.068275],
  [41.302217, 2.068071],
  [41.3021, 2.067952],
  [41.301578, 2.068179],
  [41.301462, 2.068995],
  [41.3012, 2.069391],
  [41.301103, 2.069922],
  [41.301838, 2.07242],
  [41.304913, 2.081404],
  [41.304326, 2.081778],
  [41.304576, 2.08244],
  [41.305174, 2.082162],
  [41.305786, 2.08246],
  [41.306117, 2.082417],
  [41.30646, 2.081992],
  [41.306594, 2.0811],
  [41.306893, 2.08061],
  [41.310271, 2.078584],
  [41.311688, 2.078246],
  [41.314053, 2.078664],
  [41.314976, 2.078663],
  [41.31606, 2.078469],
  [41.317602, 2.077776],
  [41.320195, 2.075873],
  [41.321374, 2.075443],
  [41.322198, 2.075573],
  [41.323006, 2.075961],
  [41.323975, 2.076627],
  [41.327932, 2.079885],
  [41.329971, 2.082262],
  [41.331403, 2.084732],
  [41.332365, 2.087112],
  [41.335085, 2.095202],
  [41.335411, 2.095967],
  [41.336557, 2.097901],
  [41.350485, 2.116485],
  [41.351743, 2.118473],
  [41.355809, 2.123912],
  [41.37309, 2.146564],
  [41.374526, 2.148593],
  [41.374783, 2.149552],
  [41.375542, 2.149945],
  [41.376018, 2.150409],
  [41.382129, 2.158594],
  [41.383812, 2.156385],
  [41.384099, 2.156434],
  [41.384645, 2.157131],
  [41.384677, 2.157471],
  [41.382038, 2.160963],
  [41.378639, 2.15642],
  [41.379584, 2.155176],
  [41.388288, 2.166737],
  [41.388458, 2.167183],
  [41.389458, 2.165819],
  [41.388194, 2.164122],
  [41.387335, 2.165238],
  [41.384816, 2.161806],
  [41.384551, 2.162125],
  [41.387112, 2.165542],
  [41.385924, 2.167169],
  [41.385885, 2.167378],
  [41.386682, 2.169455],
  [41.386969, 2.169229],
  [41.387327, 2.169878],
];

const BARCELONA_AIRPORT_R2_NORD_ROUTE: [number, number][] = [
  [41.3040205, 2.072715],
  [41.3042187, 2.0732941],
  [41.3013492, 2.064863],
  [41.3011301, 2.0639425],
  [41.3009992, 2.0622075],
  [41.3011842, 2.0605892],
  [41.3014096, 2.0595889],
  [41.3020639, 2.0580064],
  [41.3028835, 2.0569327],
  [41.3040375, 2.0560107],
  [41.3083745, 2.0533939],
  [41.3099305, 2.05267],
  [41.3107664, 2.0524271],
  [41.3124384, 2.0522599],
  [41.3139534, 2.0525174],
  [41.3148237, 2.0527921],
  [41.3156553, 2.0531869],
  [41.3167061, 2.0538821],
  [41.3179797, 2.0551126],
  [41.3185168, 2.0558203],
  [41.3192157, 2.0570032],
  [41.320314, 2.0596565],
  [41.3212816, 2.0624765],
  [41.3222689, 2.0659113],
  [41.3241841, 2.0708217],
  [41.3290951, 2.0848831],
  [41.330269, 2.0878273],
  [41.331609, 2.0915303],
  [41.3328569, 2.0955753],
  [41.3352447, 2.1023909],
  [41.3369295, 2.1076787],
  [41.3382671, 2.1112774],
  [41.3388809, 2.1125118],
  [41.3395183, 2.113233],
  [41.339955, 2.1135775],
  [41.3407218, 2.1139275],
  [41.3413342, 2.114086],
  [41.3471536, 2.1147646],
  [41.3646608, 2.1164859],
  [41.3653866, 2.1166303],
  [41.3658991, 2.1168264],
  [41.3664056, 2.1171612],
  [41.3668511, 2.1175902],
  [41.367494, 2.1185989],
  [41.3679031, 2.1199758],
  [41.3679819, 2.1207698],
  [41.3679878, 2.1244027],
  [41.3681177, 2.1255189],
  [41.3683608, 2.1266766],
  [41.3688925, 2.1284043],
  [41.3696276, 2.1298056],
  [41.3706388, 2.1311379],
  [41.3746158, 2.1348254],
  [41.3763555, 2.1366499],
  [41.3772913, 2.1378418],
  [41.3784401, 2.1400636],
  [41.3799181, 2.1424815],
  [41.3804594, 2.1435786],
  [41.3862715, 2.1567562],
  [41.3867151, 2.1575929],
  [41.3879277, 2.1593273],
  [41.4003292, 2.1757392],
  [41.4083345, 2.186484],
  [41.4104445, 2.1891948],
];

type BarcelonaStopRepair = Partial<GuideStop> & {
  officialUrl: string;
  mapQuery?: string;
  editorialUrls?: string[];
  platformUrls?: string[];
  evidenceNotes?: string;
};

function barcelonaDailyHours(hours: string): NonNullable<GuideStop["hours"]> {
  return {
    mon: hours,
    tue: hours,
    wed: hours,
    thu: hours,
    fri: hours,
    sat: hours,
    sun: hours,
  };
}

const BARCELONA_LEGACY_GUIDE_IDS = new Set([
  "list-barcelona-gothic-quarter-restaurants",
  "list-barcelona-poble-sec-stays",
  "list-barcelona-gothic-popular-bars",
  "list-barcelona-gracia-dive-bars",
  "list-barcelona-gracia-popular-bars",
  "list-barcelona-citywide-dive-bars",
]);

const BARCELONA_STOP_REPAIRS = {
  "gothic-la-sosenga": {
    officialUrl: "https://www.lasosenga.es/es/",
    hours: {
      mon: "Closed",
      tue: "1:00 PM-4:45 PM",
      wed: "1:00 PM-4:45 PM",
      thu: "1:00 PM-4:45 PM; 8:00 PM-11:45 PM",
      fri: "1:00 PM-4:45 PM; 8:00 PM-11:45 PM",
      sat: "1:00 PM-4:45 PM",
      sun: "Closed",
    },
    price: "$$",
    priceSource: "Official menu",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["catalan", "seasonal", "contemporary"],
    attributeTags: ["local_favorite", "reservation_recommended", "quiet_food"],
  },
  "gothic-bistrot-levante": {
    officialUrl: "https://bistrotlevante.com/",
    hours: {
      mon: "Closed",
      tue: "Closed",
      wed: "12:30 PM-11:00 PM",
      thu: "12:30 PM-11:00 PM",
      fri: "12:30 PM-11:00 PM",
      sat: "12:00 PM-11:00 PM",
      sun: "12:00 PM-11:00 PM",
    },
    photo: "https://bistrotlevante.com/wp-content/uploads/2020/03/Levante_bistrot-2020-40.jpg",
    price: "$$",
    priceSource: "Official booking page / Barna Centre",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["mediterranean", "middle_eastern", "vegetarian"],
    attributeTags: ["vegetarian_friendly", "vegan_friendly", "quiet_food"],
    platformUrls: ["https://www.barnacentre.com/en/business/bistrot-levante"],
    evidenceNotes: "The venue and district directory publish slightly different Monday service; the structured hours use the currently bookable Wednesday-Sunday service.",
  },
  "gothic-la-plata-restaurant": {
    officialUrl: "https://barlaplata.com/",
    hours: {
      mon: "11:00 AM-3:00 PM; 6:00 PM-11:00 PM",
      tue: "11:00 AM-3:00 PM; 6:00 PM-11:00 PM",
      wed: "11:00 AM-3:00 PM; 6:00 PM-11:00 PM",
      thu: "11:00 AM-3:00 PM; 6:00 PM-11:00 PM",
      fri: "11:00 AM-3:00 PM; 6:00 PM-11:00 PM",
      sat: "11:00 AM-3:00 PM; 6:00 PM-11:00 PM",
      sun: "Closed",
    },
    price: "$",
    priceSource: "Official menu",
    venueKind: "food_drink",
    foodServiceType: "pub",
    cuisineTypes: ["catalan", "tapas", "seafood"],
    attributeTags: ["local_favorite", "budget_food", "walk_in_friendly"],
  },
  "gothic-capet": {
    officialUrl: "https://www.capetrestaurant.com/contact",
    hours: {
      mon: "Closed",
      tue: "1:00 PM-3:30 PM; 8:00 PM-11:00 PM",
      wed: "1:00 PM-3:30 PM; 8:00 PM-11:00 PM",
      thu: "1:00 PM-3:30 PM; 8:00 PM-11:00 PM",
      fri: "1:00 PM-3:30 PM; 8:00 PM-11:00 PM",
      sat: "1:00 PM-3:30 PM; 8:00 PM-11:00 PM",
      sun: "Closed",
    },
    price: "$$$",
    priceSource: "Official menu / MICHELIN Guide",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["catalan", "contemporary", "seasonal"],
    attributeTags: ["fine_dining", "reservation_recommended", "date_night"],
    editorialUrls: ["https://guide.michelin.com/es/en/catalunya/barcelona/restaurant/capet"],
  },
  "gothic-sensi-bistro": {
    officialUrl: "https://sensi.es/bistro/es/",
    hours: {
      mon: "6:15 PM-12:45 AM",
      tue: "6:15 PM-12:45 AM",
      wed: "6:15 PM-12:45 AM",
      thu: "6:15 PM-12:45 AM",
      fri: "6:15 PM-1:00 AM",
      sat: "6:15 PM-1:00 AM",
      sun: "6:15 PM-1:00 AM",
    },
    price: "$$",
    priceSource: "Official menu",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["mediterranean", "tapas", "international"],
    attributeTags: ["group_friendly", "reservation_recommended", "lively_food"],
  },
  "gothic-bar-oviso-restaurant": {
    officialUrl: "https://www.instagram.com/ovisobar/",
    hours: {
      mon: "10:00 AM-12:00 AM",
      tue: "10:00 AM-12:00 AM",
      wed: "10:00 AM-12:00 AM",
      thu: "10:00 AM-12:00 AM",
      fri: "10:00 AM-12:30 AM",
      sat: "10:00 AM-12:30 AM",
      sun: "10:00 AM-12:00 AM",
    },
    price: "$",
    priceSource: "Barna Centre / current menu listings",
    venueKind: "food_drink",
    foodServiceType: "pub",
    cuisineTypes: ["mediterranean", "tapas", "spanish"],
    attributeTags: ["budget_food", "casual", "group_friendly"],
    platformUrls: ["https://www.barnacentre.com/es/negocio/bar-oviso"],
    evidenceNotes: "The venue's social profile is its official presence; the Barna Centre business listing supplies the published hours.",
  },
  "gothic-bar-lobo-restaurant": {
    officialUrl: "https://grupotragaluz.com/ca/restaurants/bar-lobo/",
    hours: barcelonaDailyHours("9:00 AM-1:00 AM; kitchen until 12:00 AM"),
    price: "$$",
    priceSource: "Official menu",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["mediterranean", "tapas", "catalan"],
    attributeTags: ["group_friendly", "brunch", "lively_food"],
  },
  "gothic-els-quatre-gats-restaurant": {
    officialUrl: "https://4gats.com/",
    hours: barcelonaDailyHours("12:00 PM-12:00 AM"),
    price: "$$",
    priceSource: "Official menu / booking page",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["catalan", "mediterranean", "spanish"],
    attributeTags: ["historic", "reservation_recommended", "tourist_friendly"],
  },
  "gothic-milk-bar-bistro-restaurant": {
    officialUrl: "https://milkbarcelona.com/",
    hours: {
      mon: "9:00 AM-3:00 PM; 7:00 PM-11:00 PM",
      tue: "9:00 AM-3:00 PM; 7:00 PM-11:00 PM",
      wed: "9:00 AM-3:00 PM; 7:00 PM-11:00 PM",
      thu: "9:00 AM-3:00 PM; 7:00 PM-11:00 PM",
      fri: "9:00 AM-4:00 PM; 7:00 PM-11:30 PM",
      sat: "9:00 AM-4:00 PM; 7:00 PM-11:30 PM",
      sun: "9:00 AM-4:00 PM; 7:00 PM-11:00 PM",
    },
    price: "$$",
    priceSource: "Official menu",
    venueKind: "food_drink",
    foodServiceType: "cafe",
    cuisineTypes: ["brunch", "international", "comfort_food"],
    attributeTags: ["brunch", "group_friendly", "vegetarian_friendly"],
  },
  "poblesec-hotel-brummell": {
    officialUrl: "https://hotelbrummell.brummellprojects.com/",
    bookingUrl: "https://engine.witbooking.com/en/hotel/hotelbrummell.com",
    hours: barcelonaDailyHours("Reception 7:00 AM-11:00 PM; 24-hour emergency support for guests"),
    price: "$$$",
    priceSource: "Official booking page / MICHELIN Guide",
    venueKind: "lodging",
    lodgingType: "hotel",
    attributeTags: ["design", "quiet", "romantic"],
    editorialUrls: ["https://guide.michelin.com/gb/en/hotels-stays/barcelona/hotel-brummell-7975"],
  },
  "poblesec-innside-apolo": {
    officialUrl: "https://www.melia.com/en/hotels/spain/barcelona/innside-barcelona-apolo",
    bookingUrl: "https://www.booking.com/hotel/es/innside-by-melia-barcelona-apolo.en-gb.html",
    hours: barcelonaDailyHours("Open 24 hours; reception staffed at all times"),
    price: "$$$",
    priceSource: "Official booking page / Booking.com",
    venueKind: "lodging",
    lodgingType: "hotel",
    attributeTags: ["central", "work_friendly", "accessible"],
    platformUrls: ["https://www.booking.com/hotel/es/innside-by-melia-barcelona-apolo.en-gb.html"],
  },
  "poblesec-coronado": {
    officialUrl: "https://www.hotelcoronado.net/en/",
    bookingUrl: "https://www.booking.com/hotel/es/coronado.html",
    hours: barcelonaDailyHours("Open 24 hours; reception staffed at all times"),
    price: "$$",
    priceSource: "Official booking page / Booking.com",
    venueKind: "lodging",
    lodgingType: "hotel",
    attributeTags: ["budget", "central", "walkable"],
    platformUrls: ["https://www.booking.com/hotel/es/coronado.html"],
  },
  "gothic-milk": {
    officialUrl: "https://milkbarcelona.com/",
    hours: {
      mon: "9:00 AM-3:00 PM; 7:00 PM-11:00 PM",
      tue: "9:00 AM-3:00 PM; 7:00 PM-11:00 PM",
      wed: "9:00 AM-3:00 PM; 7:00 PM-11:00 PM",
      thu: "9:00 AM-3:00 PM; 7:00 PM-11:00 PM",
      fri: "9:00 AM-4:00 PM; 7:00 PM-11:30 PM",
      sat: "9:00 AM-4:00 PM; 7:00 PM-11:30 PM",
      sun: "9:00 AM-4:00 PM; 7:00 PM-11:00 PM",
    },
    price: "$$",
    priceSource: "Official menu",
    venueKind: "nightlife",
    nightlifeType: "lounge",
    attributeTags: ["casual_nightlife", "group_friendly", "cocktails"],
  },
  "gothic-harlem": {
    officialUrl: "https://www.harlemjazzclub.es/en/",
    hours: {
      mon: "Closed",
      tue: "8:00 PM-2:00 AM",
      wed: "8:00 PM-2:00 AM",
      thu: "8:00 PM-3:00 AM",
      fri: "8:00 PM-3:00 AM",
      sat: "8:00 PM-3:00 AM",
      sun: "7:30 PM-2:00 AM",
    },
    price: "$$",
    priceSource: "Official ticket calendar",
    venueKind: "nightlife",
    nightlifeType: "live_music_venue",
    musicGenres: ["jazz", "funk", "soul"],
    attributeTags: ["live_music", "tickets_required", "late_night"],
  },
  "gothic-marula-cafe": {
    name: "Marula Café",
    coordinates: [41.3787, 2.1751],
    description: "Marula Café is a compact Escudellers music room where funk, soul, Afrobeat, Latin sessions, and DJs carry concerts into late dancing. The official agenda matters more than a fixed weekly genre promise.",
    officialUrl: "https://marulacafe.com/info/",
    mapQuery: "Marula Café Barcelona",
    hours: {
      default: "Venue opening hours are fixed by day; concert formats and individual start times are published in the official agenda",
      mon: "Closed",
      tue: "Closed",
      wed: "10:30 PM-5:00 AM",
      thu: "10:30 PM-5:00 AM",
      fri: "Concerts 10:00 PM-12:00 AM; DJ sessions 12:00 AM-6:00 AM",
      sat: "Concerts 10:00 PM-12:00 AM; DJ sessions 12:00 AM-6:00 AM",
      sun: "9:30 PM-4:30 AM",
    },
    photo: "https://marulacafe.com/wp-content/uploads/2025/02/sala-home2-1.jpg",
    price: "$$",
    priceSource: "Official event ticketing / venue price range",
    venueKind: "nightlife",
    nightlifeType: "live_music_venue",
    musicGenres: ["funk", "soul", "afrobeat", "latin"],
    attributeTags: ["live_music", "dj_sets", "late_night"],
  },
  "gothic-ocana": {
    name: "Ocaña",
    coordinates: [41.3803, 2.1753],
    description: "Ocaña spreads a café, restaurant, cocktail bar, and late room across Plaça Reial, making it useful when a group wants dinner, drinks, and nightlife without changing addresses.",
    officialUrl: "https://www.ocana.cat/contact/",
    mapQuery: "Ocaña Plaça Reial Barcelona",
    hours: barcelonaDailyHours("8:30 AM-3:00 AM"),
    photo: "https://www.ocana.cat/content/uploads/2019/12/7F6A5278.jpg",
    price: "$$",
    priceSource: "Official menu",
    venueKind: "nightlife",
    nightlifeType: "lounge",
    attributeTags: ["cocktails", "group_friendly", "late_night"],
  },
  "gothic-jamboree": {
    officialUrl: "https://jamboreejazz.com/",
    hours: {
      default: "Performance, doors, and club start times are published per event on the official event calendar",
    },
    price: "$$",
    priceSource: "Official ticket calendar",
    venueKind: "nightlife",
    nightlifeType: "live_music_venue",
    musicGenres: ["jazz", "blues", "soul"],
    attributeTags: ["live_music", "tickets_required", "late_night"],
  },
  "gracia-canigo": {
    officialUrl: "https://www.barcanigo.com/index_en.html",
    hours: {
      mon: "10:00 AM-5:00 PM",
      tue: "10:00 AM-1:00 AM",
      wed: "10:00 AM-1:00 AM",
      thu: "10:00 AM-2:00 AM",
      fri: "10:00 AM-2:30 AM",
      sat: "7:00 PM-2:30 AM",
      sun: "Closed",
    },
    price: "$",
    priceSource: "Official menu",
    venueKind: "nightlife",
    nightlifeType: "dive_bar",
    attributeTags: ["dive_bars", "local_bar", "vermouth"],
  },
  "gracia-bodega-quimet": {
    officialUrl: "https://www.bodegaquimet.com/localizacion",
    hours: {
      mon: "10:00 AM-4:00 PM",
      tue: "10:00 AM-4:00 PM; 6:00 PM-11:00 PM",
      wed: "10:00 AM-4:00 PM; 6:00 PM-11:00 PM",
      thu: "10:00 AM-4:00 PM; 6:00 PM-11:00 PM",
      fri: "11:00 AM-4:00 PM; 6:00 PM-11:00 PM",
      sat: "11:00 AM-4:00 PM; 6:00 PM-11:00 PM",
      sun: "11:00 AM-4:00 PM",
    },
    price: "$",
    priceSource: "Official menu",
    venueKind: "nightlife",
    nightlifeType: "wine_bar",
    attributeTags: ["dive_bars", "local_bar", "vermouth"],
  },
  "gracia-fourmi": {
    officialUrl: "https://lafourmibarcelona.es/",
    hours: {
      mon: "6:00 PM-1:00 AM",
      tue: "6:00 PM-1:00 AM",
      wed: "6:00 PM-1:00 AM",
      thu: "6:00 PM-1:00 AM",
      fri: "6:00 PM-3:00 AM",
      sat: "6:00 PM-3:00 AM",
      sun: "6:00 PM-1:00 AM",
    },
    price: "$",
    priceSource: "Official menu",
    venueKind: "nightlife",
    nightlifeType: "dive_bar",
    attributeTags: ["dive_bars", "casual_nightlife", "late_night"],
  },
  "gracia-la-rovira": {
    name: "La Rovira",
    coordinates: [41.4063, 2.1599],
    description: "La Rovira is an all-day Gràcia bar for craft beer, vermouth, generous plates, and the easy neighborhood overlap between lunch tables and late drinks.",
    officialUrl: "https://larovirabcn.com/",
    mapQuery: "La Rovira Carrer Rabassa Barcelona",
    hours: {
      mon: "9:00 AM-12:00 AM",
      tue: "9:00 AM-12:00 AM",
      wed: "9:00 AM-12:00 AM",
      thu: "9:00 AM-12:00 AM",
      fri: "9:00 AM-1:00 AM",
      sat: "9:00 AM-1:00 AM",
      sun: "9:00 AM-12:00 AM",
    },
    photo: "https://larovirabcn.com/wp-content/uploads/2024/02/rov19.jpg",
    price: "$",
    priceSource: "Official menu",
    venueKind: "nightlife",
    nightlifeType: "beer_bar",
    attributeTags: ["dive_bars", "craft_beer", "local_bar"],
  },
  "gracia-salvatge": {
    officialUrl: "https://barsalvatge.com/",
    hours: barcelonaDailyHours("6:00 PM-12:30 AM"),
    price: "$$",
    priceSource: "Official menu",
    venueKind: "nightlife",
    nightlifeType: "wine_bar",
    attributeTags: ["dive_bars", "natural_wine", "local_bar"],
  },
  "gracia-sol-de-nit": {
    officialUrl: "https://www.cafedelsoldenit.es/",
    hours: barcelonaDailyHours("11:00 AM-3:00 AM"),
    price: "$",
    priceSource: "Official menu",
    venueKind: "nightlife",
    nightlifeType: "pub",
    attributeTags: ["terrace", "group_friendly", "casual_nightlife"],
  },
  "gracia-heliogabal": {
    officialUrl: "https://www.heliogabal.com/",
    hours: {
      mon: "Closed",
      tue: "Closed",
      wed: "Closed",
      thu: "8:30 PM-2:30 AM",
      fri: "8:30 PM-3:00 AM",
      sat: "8:30 PM-3:00 AM",
      sun: "6:30 PM-11:00 PM",
    },
    price: "$$",
    priceSource: "Official ticket calendar",
    venueKind: "nightlife",
    nightlifeType: "live_music_venue",
    musicGenres: ["indie", "alternative", "singer_songwriter"],
    attributeTags: ["live_music", "tickets_required", "local_bar"],
  },
  "gracia-bobby-gin": {
    officialUrl: "https://www.bobbygin.com/en/contacto/",
    hours: {
      mon: "7:00 PM-2:00 AM",
      tue: "7:00 PM-2:00 AM",
      wed: "7:00 PM-2:00 AM",
      thu: "7:00 PM-2:30 AM",
      fri: "7:00 PM-3:00 AM",
      sat: "7:00 PM-3:00 AM",
      sun: "7:00 PM-2:00 AM",
    },
    price: "$$",
    priceSource: "Official menu",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    attributeTags: ["craft_cocktails", "gin", "date_night"],
  },
  "gracia-14-de-la-rosa": {
    name: "14 De La Rosa",
    coordinates: [41.4008, 2.1585],
    description: "14 De La Rosa is a narrow Gràcia cocktail bar with a serious back bar, low light, and measured classics that reward sitting down instead of collecting another plaza round.",
    officialUrl: "https://www.14delarosa.com/home-motto",
    mapQuery: "14 De La Rosa Barcelona",
    hours: {
      sun: "Closed",
      mon: "5:00 PM-2:00 AM",
      tue: "5:00 PM-2:00 AM",
      wed: "5:00 PM-2:00 AM",
      thu: "5:00 PM-2:00 AM",
      fri: "5:00 PM-3:00 AM",
      sat: "5:00 PM-3:00 AM",
    },
    photo: "https://images.squarespace-cdn.com/content/v1/5beb225b55b02cd32247f7a4/1542137261737-L3LDP01VWQ6BJG3J2504/D760CC4C-FBA6-4ACA-9190-2102AA5F2046.jpeg?format=1500w",
    price: "$$",
    priceSource: "Official menu / Tripadvisor",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    attributeTags: ["craft_cocktails", "date_night", "local_bar"],
    platformUrls: [
      "https://www.tripadvisor.co.uk/Restaurant_Review-g187497-d15679118-Reviews-14_De_La_Rosa-Barcelona_Catalonia.html",
    ],
    evidenceNotes: "The claimed Tripadvisor business listing supplies exact current opening and closing times; the venue site supplies identity and contact details.",
  },
  "gracia-elephanta": {
    officialUrl: "https://elephanta.cat/es/contacto/",
    hours: {
      mon: "6:00 PM-1:30 AM",
      tue: "6:00 PM-1:30 AM",
      wed: "6:00 PM-1:30 AM",
      thu: "6:00 PM-2:30 AM",
      fri: "6:00 PM-3:00 AM",
      sat: "5:30 PM-3:00 AM",
      sun: "5:00 PM-11:30 PM",
    },
    price: "$$",
    priceSource: "Official menu",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    attributeTags: ["craft_cocktails", "gin", "local_bar"],
  },
  "gracia-old-fashioned": {
    officialUrl: "https://www.theoriginaloldfashioned.com/gallery",
    hours: {
      mon: "7:00 PM-2:00 AM",
      tue: "7:00 PM-2:00 AM",
      wed: "7:00 PM-2:00 AM",
      thu: "7:00 PM-2:00 AM",
      fri: "7:00 PM-3:00 AM",
      sat: "7:00 PM-3:00 AM",
      sun: "7:00 PM-2:00 AM",
    },
    price: "$$",
    priceSource: "Official menu",
    venueKind: "nightlife",
    nightlifeType: "cocktail_bar",
    attributeTags: ["craft_cocktails", "whisky", "date_night"],
  },
  "citywide-dive-bar-marsella": {
    officialUrl: "https://www.barcelona.cat/en/conocebcn/pics/bar-marsella-92086038702",
    hours: {
      mon: "6:00 PM-2:00 AM",
      tue: "10:00 AM-2:00 PM; 6:00 PM-2:00 AM",
      wed: "10:00 AM-2:00 PM; 6:00 PM-2:00 AM",
      thu: "10:00 AM-2:00 PM; 6:00 PM-2:00 AM",
      fri: "10:00 AM-2:00 PM; 6:00 PM-2:30 AM",
      sat: "10:00 AM-2:00 PM; 6:00 PM-2:30 AM",
      sun: "10:00 AM-2:00 PM; 6:00 PM-2:00 AM",
    },
    price: "$",
    priceSource: "Barcelona city property listing / current map listing",
    venueKind: "nightlife",
    nightlifeType: "dive_bar",
    attributeTags: ["dive_bars", "historic", "absinthe", "late_night"],
    evidenceNotes: "The city property listing is the authoritative public record because the bar has no standalone official website.",
  },
  "citywide-dive-el-xampanyet": {
    officialUrl: "https://www.elxampanyet.com/",
    hours: {
      mon: "7:00 PM-11:00 PM",
      tue: "12:00 PM-3:30 PM; 7:00 PM-11:00 PM",
      wed: "12:00 PM-3:30 PM; 7:00 PM-11:00 PM",
      thu: "12:00 PM-3:30 PM; 7:00 PM-11:00 PM",
      fri: "12:00 PM-3:30 PM; 7:00 PM-11:00 PM",
      sat: "12:00 PM-3:30 PM",
      sun: "Closed",
    },
    price: "$",
    priceSource: "Official menu",
    venueKind: "nightlife",
    nightlifeType: "wine_bar",
    attributeTags: ["dive_bars", "cava_counter", "standing_room", "old_school"],
  },
  "citywide-dive-la-plata": {
    officialUrl: "https://barlaplata.com/",
    hours: {
      mon: "11:00 AM-3:00 PM; 6:00 PM-11:00 PM",
      tue: "11:00 AM-3:00 PM; 6:00 PM-11:00 PM",
      wed: "11:00 AM-3:00 PM; 6:00 PM-11:00 PM",
      thu: "11:00 AM-3:00 PM; 6:00 PM-11:00 PM",
      fri: "11:00 AM-3:00 PM; 6:00 PM-11:00 PM",
      sat: "11:00 AM-3:00 PM; 6:00 PM-11:00 PM",
      sun: "Closed",
    },
    price: "$",
    priceSource: "Official menu",
    venueKind: "nightlife",
    nightlifeType: "dive_bar",
    attributeTags: ["dive_bars", "historic", "vermouth", "local_bar"],
  },
  "citywide-dive-canigo": {
    officialUrl: "https://www.barcanigo.com/index_en.html",
    hours: {
      mon: "10:00 AM-5:00 PM",
      tue: "10:00 AM-1:00 AM",
      wed: "10:00 AM-1:00 AM",
      thu: "10:00 AM-2:00 AM",
      fri: "10:00 AM-2:30 AM",
      sat: "7:00 PM-2:30 AM",
      sun: "Closed",
    },
    price: "$",
    priceSource: "Official menu",
    venueKind: "nightlife",
    nightlifeType: "dive_bar",
    attributeTags: ["dive_bars", "neighborhood_bar", "vermouth", "casual_nightlife"],
  },
  "citywide-dive-quimet-quimet": {
    officialUrl: "https://quimetiquimet.com/en/contact/",
    hours: {
      mon: "12:00 PM-4:00 PM; 6:00 PM-10:30 PM",
      tue: "12:00 PM-4:00 PM; 6:00 PM-10:30 PM",
      wed: "12:00 PM-4:00 PM; 6:00 PM-10:30 PM",
      thu: "12:00 PM-4:00 PM; 6:00 PM-10:30 PM",
      fri: "12:00 PM-4:00 PM; 6:00 PM-10:30 PM",
      sat: "Closed",
      sun: "Closed",
    },
    price: "$$",
    priceSource: "Official menu",
    venueKind: "nightlife",
    nightlifeType: "wine_bar",
    attributeTags: ["dive_bars", "standing_room", "montaditos", "local_bar"],
  },
  "citywide-dive-bodega-salto": {
    officialUrl: "https://bodegasalto.net/aviso-legal/",
    hours: {
      mon: "6:00 PM-1:00 AM",
      tue: "6:00 PM-1:00 AM",
      wed: "6:00 PM-1:00 AM",
      thu: "6:00 PM-1:00 AM",
      fri: "6:00 PM-3:00 AM",
      sat: "12:00 PM-3:00 AM",
      sun: "12:00 PM-8:00 PM",
    },
    price: "$",
    priceSource: "Official venue site / current map listing",
    venueKind: "nightlife",
    nightlifeType: "dive_bar",
    attributeTags: ["dive_bars", "old_school", "local_bar", "casual_nightlife"],
  },
  "citywide-dive-manchester": {
    officialUrl: "https://www.paginasamarillas.es/f/barcelona/manchester-gotico_221775794_000000002.html",
    hours: barcelonaDailyHours("6:30 PM-3:00 AM"),
    price: "$",
    priceSource: "Current business directory / map listing",
    venueKind: "nightlife",
    nightlifeType: "dive_bar",
    musicGenres: ["indie", "britpop", "rock"],
    attributeTags: ["dive_bars", "indie_bar", "late_night", "casual_nightlife"],
    evidenceNotes: "The venue has no standalone website; its current business property page and map listing provide status evidence.",
  },
  "citywide-dive-nevermind": {
    officialUrl: "http://nevermindbcn.es/",
    mapQuery: "Nevermind Bar Escudellers Blancs Barcelona",
    hours: {
      mon: "7:00 PM-2:30 AM",
      tue: "7:00 PM-2:30 AM",
      wed: "7:00 PM-2:30 AM",
      thu: "7:00 PM-2:30 AM",
      fri: "7:00 PM-3:00 AM",
      sat: "7:00 PM-3:00 AM",
      sun: "7:00 PM-2:30 AM",
    },
    price: "$",
    priceSource: "Official venue site / current map listing",
    venueKind: "nightlife",
    nightlifeType: "dive_bar",
    musicGenres: ["grunge", "punk", "rock"],
    attributeTags: ["dive_bars", "grunge_bar", "late_night", "casual_nightlife"],
  },
  "citywide-dive-bodega-quimet": {
    officialUrl: "https://www.bodegaquimet.com/localizacion",
    hours: {
      mon: "10:00 AM-4:00 PM",
      tue: "10:00 AM-4:00 PM; 6:00 PM-11:00 PM",
      wed: "10:00 AM-4:00 PM; 6:00 PM-11:00 PM",
      thu: "10:00 AM-4:00 PM; 6:00 PM-11:00 PM",
      fri: "11:00 AM-4:00 PM; 6:00 PM-11:00 PM",
      sat: "11:00 AM-4:00 PM; 6:00 PM-11:00 PM",
      sun: "11:00 AM-4:00 PM",
    },
    price: "$",
    priceSource: "Official menu",
    venueKind: "nightlife",
    nightlifeType: "wine_bar",
    attributeTags: ["dive_bars", "bodega", "vermouth", "local_bar"],
  },
  "citywide-dive-bar-malasang": {
    officialUrl: "https://barmalasang.com/",
    hours: {
      mon: "Closed",
      tue: "9:00 AM-12:30 AM",
      wed: "9:00 AM-12:30 AM",
      thu: "9:00 AM-12:30 AM",
      fri: "9:00 AM-2:30 AM",
      sat: "11:00 AM-2:30 AM",
      sun: "11:00 AM-6:30 PM",
    },
    price: "$",
    priceSource: "Official menu",
    venueKind: "nightlife",
    nightlifeType: "dive_bar",
    musicGenres: ["rock", "indie"],
    attributeTags: ["dive_bars", "neighborhood_bar", "vinyl_bar", "casual_nightlife"],
  },
} satisfies Record<string, BarcelonaStopRepair>;

const BARCELONA_EXTRA_GUIDE_SOURCES: Record<string, ListSource[]> = {
  "list-barcelona-poble-sec-stays": [
    {
      name: "Hotel Brummell guest guide",
      url: "https://hotelbrummell.brummellprojects.com/guide/",
    },
    {
      name: "MICHELIN Guide - Hotel Brummell",
      url: "https://guide.michelin.com/gb/en/hotels-stays/barcelona/hotel-brummell-7975",
    },
    {
      name: "Booking.com - INNSiDE Barcelona Apolo",
      url: "https://www.booking.com/hotel/es/innside-by-melia-barcelona-apolo.en-gb.html",
    },
    {
      name: "Booking.com - Hotel Coronado",
      url: "https://www.booking.com/hotel/es/coronado.html",
    },
  ],
};

function uniqueBarcelonaUrls(urls: Array<string | undefined>): string[] {
  return [...new Set(urls.filter((url): url is string => Boolean(url)))];
}

function barcelonaMapUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function repairLegacyBarcelonaGuides(guides: MapList[]): MapList[] {
  return guides.map((guide) => {
    if (!BARCELONA_LEGACY_GUIDE_IDS.has(guide.id)) return guide;

    const stops = guide.stops.map((stop) => {
      const repair = BARCELONA_STOP_REPAIRS[
        stop.id as keyof typeof BARCELONA_STOP_REPAIRS
      ] as BarcelonaStopRepair | undefined;
      if (!repair) return stop;

      const {
        mapQuery,
        editorialUrls = [],
        platformUrls = [],
        evidenceNotes,
        ...fields
      } = repair;
      const name = fields.name ?? stop.name;
      const mapUrl = barcelonaMapUrl(mapQuery ?? `${name} Barcelona`);
      const imageSourceUrl = fields.imageSourceUrl ?? fields.photo ?? stop.imageSourceUrl ?? stop.photo;
      const sourceUrls = uniqueBarcelonaUrls([
        ...(stop.sourceUrls ?? []),
        fields.officialUrl,
        fields.bookingUrl,
        mapUrl,
        imageSourceUrl,
        ...editorialUrls,
        ...platformUrls,
      ]);

      return {
        ...stop,
        ...fields,
        imageSourceUrl,
        sourceUrls,
        sourceEvidence: {
          ...stop.sourceEvidence,
          officialUrl: fields.officialUrl,
          mapUrl,
          currentStatusUrl: mapUrl,
          imageSourceUrl,
          editorialUrls,
          platformUrls,
          notes: evidenceNotes ?? "Official/property page and venue-specific map evidence checked for current status and published hours.",
          checkedAt: "2026-07-16",
        },
      } satisfies GuideStop;
    });

    const officialSources = stops.flatMap((stop) => {
      const repair = BARCELONA_STOP_REPAIRS[
        stop.id as keyof typeof BARCELONA_STOP_REPAIRS
      ] as BarcelonaStopRepair | undefined;
      return repair
        ? [{ name: `${stop.name} official/property page`, url: repair.officialUrl }]
        : [];
    });
    const sourceByUrl = new Map<string, ListSource>();
    for (const source of [
      ...(guide.sources ?? []),
      ...officialSources,
      ...(BARCELONA_EXTRA_GUIDE_SOURCES[guide.id] ?? []),
    ]) {
      if (source?.url && !sourceByUrl.has(source.url)) sourceByUrl.set(source.url, source);
    }

    return {
      ...guide,
      stops,
      sources: [...sourceByUrl.values()],
    };
  });
}

export const barcelonaCoreGuides = withDiveBarChips(repairLegacyBarcelonaGuides([
  {
    "id": "list-barcelona-top-parks",
    "slug": "barcelona-top-parks-in-the-city",
    "seoSlug": "best-parks",
    "seoTitle": "Best Parks in Barcelona",
    "seoDescription": "Best parks in Barcelona for Gaudi architecture, hilltop views, historic gardens, Ciutadella lawns, Montjuic walks, and green spaces worth saving.",
    "title": "Green Escapes and Hilltop Views",
    "description": "Barcelona's open air ranges from Parc Guell's tiled theatre and Ciutadella's civic lawns to Montjuic, Horta's maze, Cervantes roses, and the broad skyline from Bunkers del Carmel.",
    "url": "https://www.google.com/maps/search/top+parks+in+barcelona",
    "category": "Nature",
    "location": {
      "city": "Barcelona",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-nature",
      "name": "R Nature",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-17T00:00:00.000Z",
    "stops": [
      {
        "id": "park-guell",
        "name": "Parc Guell",
        "coordinates": [
          41.4145,
          2.1527
        ],
        "description": "Parc Guell combines Gaudi's sculptural landscape, mosaic terraces, and hillside city views across a park whose monumental zone may require timed booking. The architecture and terrain justify a planned half-day rather than a casual detour.",
        "hours": {
          "default": "Daily ~9:30 AM-7:30 PM."
        },
        "photo": "https://estatics-nasia.dtibcn.cat/nasia-pro/media/2016%2C06%2CAZ8Q8387-C%25C3%25B2pia-760x428.jpg"
      },
      {
        "id": "parc-de-la-ciutadella",
        "name": "Parc de la Ciutadella",
        "coordinates": [
          41.3888,
          2.186
        ],
        "description": "Parc de la Ciutadella is a central green space with 19th-century exhibition history, the Cascada Monumental, lake boating, and broad lawns.",
        "hours": {
          "default": "Daily ~10:00 AM-10:30 PM."
        },
        "photo": "https://estatics-nasia.dtibcn.cat/nasia-pro/media/2015%2C12%2CAZ8Q2726-760x428.jpg"
      },
      {
        "id": "montjuic-park",
        "name": "Montjuic Park",
        "coordinates": [
          41.363,
          2.1679
        ],
        "description": "Montjuic Park is a big hill-day outdoor site, linking gardens, lookouts, museums, castle approaches, Olympic-era venues, and botanical spaces.",
        "hours": {
          "default": "Park 24h; gardens/sites ~10:00 AM-sunset."
        },
        "photo": "https://www.barcelona.cat/sites/default/files/styles/facebook/public/montjuic_d_600x315_2.jpg?itok=eZrB9ZmW"
      },
      {
        "id": "parc-del-laberint-dhorta",
        "name": "Parc del Laberint d'Horta",
        "coordinates": [
          41.4397,
          2.1477
        ],
        "description": "Parc del Laberint d'Horta centers on an 18th-century cypress maze framed by neoclassical terraces and later romantic gardens. Its position near Collserola feels markedly quieter than Barcelona's central parks.",
        "hours": {
          "winter": "10:00 AM-6:00 PM",
          "spring": "10:00 AM-7:00 PM",
          "summer": "10:00 AM-8:00 PM",
          "fall": "10:00 AM-7:00 PM"
        },
        "photo": "https://estatics-nasia.dtibcn.cat/nasia-pro/media/2016%2C01%2CAZ8Q6392-760x428.jpg"
      },
      {
        "id": "parc-de-cervantes",
        "name": "Parc de Cervantes",
        "coordinates": [
          41.3871,
          2.1123
        ],
        "description": "Parc de Cervantes contains thousands of rose bushes in a broad collection that reaches peak bloom from late spring into summer.",
        "hours": {
          "default": "Daily 8:00 AM-sunset."
        },
        "photo": "https://estatics-nasia.dtibcn.cat/nasia-pro/media/2016%2C01%2CAZ8Q3185-760x428.jpg"
      },
      {
        "id": "parc-del-guinardo-bunkers-del-carmel",
        "name": "Parc del Guinardo / Bunkers del Carmel",
        "coordinates": [
          41.4183,
          2.1527
        ],
        "description": "Parc del Guinardo climbs toward the Bunkers del Carmel, where Turo de la Rovira's former anti-aircraft battery remains open onto wide skyline views.",
        "hours": {
          "default": "Park 24h; Bunkers ~8:30 AM-7:30 PM (night-restricted)."
        },
        "photo": "https://thirdeyetraveller.com/wp-content/uploads/Carmel-del-Bunkers-Barcelona-6.jpg"
      },
      {
        "id": "barcelona-parks-placa-del-sol",
        "name": "Plaça del Sol",
        "coordinates": [
          41.401,
          2.1574
        ],
        "description": "Plaça del Sol is Gràcia's neighborhood version of open air: cafe terraces, musicians, evening gatherings, and the social rhythm that makes the district feel village-like rather than monumental.",
        "hours": {
          "default": "Open public space."
        },
        "photo": "https://estatics-nasia.dtibcn.cat/nasia-pro/media/201601PlaC3A7a-del-Sol-1-web.optimized.948b1120.jpg"
      },
      {
        "id": "barcelona-parks-teatre-grec",
        "name": "Teatre Grec",
        "coordinates": [
          41.3704,
          2.1598
        ],
        "description": "Teatre Grec is an open-air amphitheater built into a former Montjuïc quarry and surrounded by leafy gardens. The grounds are pleasant by day, while summer festival programming turns the site into a working performance venue.",
        "hours": {
          "default": "Open public gardens; performances by schedule."
        },
        "photo": "https://www.teatrebarcelona.com/wp-content/uploads/2020/04/teatre_grec-scaled.jpg"
      },
      {
        "id": "barcelona-parks-montjuic-castle",
        "name": "Montjuïc Castle",
        "coordinates": [
          41.3634,
          2.1661
        ],
        "description": "Montjuïc Castle extends the hilltop-view thread with port panoramas, defensive history, and a clear endpoint for a Montjuïc walk.",
        "hours": {
          "default": "Daily ~9:00 AM-8:00 PM."
        },
        "photo": "https://www.barcelonaturisme.com/files/5445-7616-Imagen/castillo-montjuic-barcelona-pf-c1.jpg"
      },
      {
        "id": "barcelona-parks-poble-espanyol",
        "name": "Poble Espanyol",
        "coordinates": [
          41.3687,
          2.1475
        ],
        "description": "Poble Espanyol is an open-air Montjuïc complex of plazas, workshops, event spaces, and full-scale interpretations of Spanish regional architecture, originally created for the 1929 International Exhibition.",
        "hours": {
          "default": "Daily ~9:00 AM-8:00 PM."
        },
        "photo": "https://cdn.getyourguide.com/img/tour/cc7791c0d9865ff9.jpeg/68.jpg"
      }
    ],
    "sources": [
      {
        "name": "Turisme de Barcelona - Parks & Gardens",
        "url": "https://www.barcelonaturisme.com/wv3/en/page/32/parks-and-gardens.html"
      },
      {
        "name": "Ajuntament de Barcelona - Parks directory",
        "url": "https://ajuntament.barcelona.cat/ecologiaurbana/en/services/the-city-works/parks-and-gardens"
      },
      {
        "name": "Lonely Planet - Best parks in Barcelona",
        "url": "https://www.lonelyplanet.com/articles/best-parks-barcelona"
      },
      {
        "name": "Time Out - Best parks and gardens in Barcelona",
        "url": "https://www.timeout.com/barcelona/things-to-do/best-parks-in-barcelona"
      },
      {
        "name": "Conde Nast Traveler - Barcelona destination",
        "url": "https://www.cntraveler.com/destinations/barcelona"
      },
      {
        "name": "Park Guell official",
        "url": "https://parkguell.barcelona/en"
      },
      {
        "name": "UNESCO - Works of Antoni Gaudi",
        "url": "https://whc.unesco.org/en/list/320"
      },
      {
        "name": "Parc de la Ciutadella page",
        "url": "https://www.barcelonaturisme.com/wv3/en/page/117/parc-de-la-ciutadella.html"
      },
      {
        "name": "Montjuic page",
        "url": "https://www.barcelonaturisme.com/wv3/en/page/120/montjuic.html"
      },
      {
        "name": "Parc del Laberint d'Horta page",
        "url": "https://www.barcelonaturisme.com/wv3/en/page/118/parc-del-laberint-dhorta.html"
      },
      {
        "name": "Parc de Cervantes page",
        "url": "https://www.barcelonaturisme.com/wv3/en/page/119/parc-de-cervantes.html"
      },
      {
        "name": "Turo de la Rovira / Bunkers del Carmel page",
        "url": "https://www.barcelonaturisme.com/wv3/en/page/124/turo-de-la-rovira.html"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      },
      {
        "name": "Tripadvisor - Barcelona parks attractions",
        "url": "https://www.tripadvisor.com/Attractions-g187497-Activities-c57-Barcelona_Catalonia.html"
      }
    ]
  },
  {
    "id": "list-barcelona-airport-transfer-essentials",
    "slug": "barcelona-airport-transfer-essentials",
    "seoSlug": "airport-transfer-guide",
    "seoTitle": "Barcelona Airport Transfer Guide",
    "seoDescription": "Barcelona airport transfer essentials for Aerobus stops, R2 Nord train route and timetable, taxi ranks, Uber pickup, and city-side pickup points.",
    "title": "Airport Transfers Without the Guesswork",
    "description": "Barcelona airport transport is simple once you stop treating it as one option. Aerobus is the easiest city-center shuttle, the R2 Nord train is the cleanest rail move if Terminal 2 or Sants/Passeig de Gracia fit your route, and taxis or Uber make sense when luggage, late arrivals, or awkward addresses start to matter.",
    "url": "https://www.google.com/maps/search/barcelona+airport+transport",
    "category": "Essentials",
    "location": {
      "city": "Barcelona",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-essentials",
      "name": "R Essentials",
      "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' rx='80' fill='%230f766e'/%3E%3Ctext x='50%25' y='54%25' text-anchor='middle' dominant-baseline='middle' font-family='Arial,sans-serif' font-size='76' font-weight='700' fill='white'%3ER%3C/text%3E%3C/svg%3E"
    },
    "upvotes": 0,
    "createdAt": "2026-05-13T00:00:00.000Z",
    "stops": [
      {
        "id": "barcelona-airport-aerobus",
        "name": "Aerobus A1/A2 Airport Bus",
        "coordinates": [
          41.3871,
          2.1701
        ],
        "description": "Aerobus is the no-drama move between El Prat and the center: blue buses, luggage space, 24-hour service, and a route built around Placa Catalunya, Universitat, Urgell, and Placa Espanya. A1 is for Terminal 1 and A2 is for Terminal 2; check the live timetable before leaving because the route direction changes which city stops you use.",
        "category": "Essentials",
        "subcategory": "airport_bus",
        "subcategories": [
          "airport_bus",
          "public_transport"
        ],
        "venueKind": "transport",
        "attributeTags": [
          "airport",
          "bus",
          "transit_hub",
          "route"
        ],
        "officialUrl": "https://aerobusbarcelona.es/en/",
        "timetableUrl": "https://aerobusbarcelona.es/en/lines-stops-and-schedules/",
        "photo": "https://aerobusbarcelona.es/wp-content/uploads/2024/09/9-Terminal-1-1024x682.jpg",
        "hours": {
          "default": "24 hours daily; frequency varies by line and time of day."
        },
        "routeCoordinates": BARCELONA_AIRPORT_AEROBUS_ROUTE,
        "places": [
          {
            "id": "aerobus-t1-arrivals",
            "name": "Aeroport T1 - Arrivals",
            "coordinates": [
              41.2883503,
              2.0729368
            ],
            "description": "Use this stop for A1 from Terminal 1 into Barcelona. It is outside arrivals; follow the Aerobus/bus signs after baggage claim.",
            "category": "Essentials",
            "subcategory": "bus_stop",
            "venueKind": "transport"
          },
          {
            "id": "aerobus-t2b-arrivals",
            "name": "Aeroport T2B - Arrivals",
            "coordinates": [
              41.303285,
              2.0768589
            ],
            "description": "Use this A2 stop from Terminal 2B arrivals into Barcelona. It is the better marker for most T2 arrivals than a generic point in the terminal complex.",
            "category": "Essentials",
            "subcategory": "bus_stop",
            "venueKind": "transport"
          },
          {
            "id": "aerobus-t2c",
            "name": "Aeroport T2C",
            "coordinates": [
              41.3049186,
              2.0818193
            ],
            "description": "Use this A2 stop when you are closer to Terminal 2C. Terminal 2 is spread out enough that the exact stop matters with bags.",
            "category": "Essentials",
            "subcategory": "bus_stop",
            "venueKind": "transport"
          },
          {
            "id": "aerobus-placa-espanya",
            "name": "Placa Espanya",
            "coordinates": [
              41.374392,
              2.1480194
            ],
            "description": "The most useful west-side city stop, especially for Montjuic, Fira, Poble-sec, and hotels around Avinguda Paral.lel.",
            "category": "Essentials",
            "subcategory": "bus_stop",
            "venueKind": "transport"
          },
          {
            "id": "aerobus-gran-via-urgell",
            "name": "Gran Via - Comte Borrell / Urgell",
            "coordinates": [
              41.3817987,
              2.1582757
            ],
            "description": "Airport-to-city buses use the Gran Via/Comte Borrell area, while city-to-airport buses use Sepulveda - Comte d'Urgell. Both serve lower Eixample and Sant Antoni stays.",
            "category": "Essentials",
            "subcategory": "bus_stop",
            "venueKind": "transport"
          },
          {
            "id": "aerobus-placa-universitat",
            "name": "Placa Universitat",
            "coordinates": [
              41.3860627,
              2.1639593
            ],
            "description": "A central arrival stop that works well for the upper Raval, Universitat, and the west side of the Gothic Quarter when Placa Catalunya is more crowded than useful.",
            "category": "Essentials",
            "subcategory": "bus_stop",
            "venueKind": "transport"
          },
          {
            "id": "aerobus-placa-catalunya-a1",
            "name": "Placa Catalunya - A1 / Andana Central",
            "coordinates": [
              41.3875895,
              2.1704925
            ],
            "description": "The A1 city terminus is on the Plaça Catalunya bus platforms rather than in the middle of the plaza. Use this side for Terminal 1.",
            "category": "Essentials",
            "subcategory": "bus_stop",
            "venueKind": "transport"
          },
          {
            "id": "aerobus-placa-catalunya-a2",
            "name": "Placa Catalunya - A2 / Fontanella",
            "coordinates": [
              41.3872608,
              2.1708952
            ],
            "description": "The A2 city terminus sits on the Fontanella side of Plaça Catalunya, close to El Corte Inglés. Use this side for Terminal 2.",
            "category": "Essentials",
            "subcategory": "bus_stop",
            "venueKind": "transport"
          },
          {
            "id": "aerobus-sepulveda-urgell",
            "name": "Sepulveda - Comte d'Urgell",
            "coordinates": [
              41.38093,
              2.1593743
            ],
            "description": "Sepulveda - Comte d'Urgell is an outbound A1 and A2 Aerobus stop serving Sant Antoni and the lower Eixample between Placa Catalunya and Placa Espanya.",
            "category": "Essentials",
            "subcategory": "bus_stop",
            "venueKind": "transport"
          }
        ]
      },
      {
        "id": "barcelona-airport-r2-nord-train",
        "name": "R2 Nord Airport Train",
        "coordinates": [
          41.3042,
          2.0745
        ],
        "description": "It is usually the best value if you are landing at T2 or connecting to Sants, but T1 passengers must first use the free terminal shuttle to reach the train. Timetables: https://rodalies.gencat.cat/en/horaris/index.html",
        "category": "Essentials",
        "subcategory": "airport_train",
        "subcategories": [
          "airport_train",
          "public_transport"
        ],
        "venueKind": "transport",
        "attributeTags": [
          "airport",
          "train",
          "transit_hub",
          "route"
        ],
        "officialUrl": "https://rodalies.gencat.cat/en/horaris/index.html",
        "photo": "https://www.barcelona-airport.com/images/train-barcelona-airport.webp",
        "hours": {
          "default": "R2 Nord airport service generally runs from early morning until late night; check Rodalies before travel."
        },
        "routeCoordinates": BARCELONA_AIRPORT_R2_NORD_ROUTE,
        "places": [
          {
            "id": "r2-nord-aeroport",
            "name": "Aeroport Station (T2)",
            "coordinates": [
              41.3042,
              2.0745
            ],
            "description": "The airport rail station is at Terminal 2. From Terminal 1, take the free airport shuttle to T2 before using the train.",
            "category": "Essentials",
            "subcategory": "train_station",
            "venueKind": "transport"
          },
          {
            "id": "r2-nord-el-prat",
            "name": "El Prat de Llobregat",
            "coordinates": [
              41.3299,
              2.0938
            ],
            "description": "Useful mainly for local connections and contingency routing; most visitors stay on board toward Sants or Passeig de Gracia.",
            "category": "Essentials",
            "subcategory": "train_station",
            "venueKind": "transport"
          },
          {
            "id": "r2-nord-bellvitge",
            "name": "Bellvitge",
            "coordinates": [
              41.3547,
              2.1159
            ],
            "description": "Bellvitge is a suburban R2 Nord station immediately outside Barcelona's central rail corridor, with local connections for the surrounding district.",
            "category": "Essentials",
            "subcategory": "train_station",
            "venueKind": "transport"
          },
          {
            "id": "r2-nord-barcelona-sants",
            "name": "Barcelona-Sants",
            "coordinates": [
              41.3791,
              2.14
            ],
            "description": "The best stop for high-speed trains, many metro connections, and hotels around Sants, Eixample Esquerra, or Placa Espanya.",
            "category": "Essentials",
            "subcategory": "train_station",
            "venueKind": "transport"
          },
          {
            "id": "r2-nord-passeig-de-gracia",
            "name": "Passeig de Gracia",
            "coordinates": [
              41.3924,
              2.1649
            ],
            "description": "The most useful central stop for Eixample, Casa Batllo, Passeig de Gracia hotels, and a short onward move toward Placa Catalunya.",
            "category": "Essentials",
            "subcategory": "train_station",
            "venueKind": "transport"
          },
          {
            "id": "r2-nord-el-clot-arago",
            "name": "El Clot-Arago",
            "coordinates": [
              41.4102,
              2.1873
            ],
            "description": "El Clot-Arago serves Clot, Poblenou-side transfers, and northeast Barcelona rather than the old city and central Eixample.",
            "category": "Essentials",
            "subcategory": "train_station",
            "venueKind": "transport"
          }
        ]
      },
      {
        "id": "barcelona-airport-taxi-uber",
        "name": "Taxi and Uber Pickup Points",
        "coordinates": [
          41.2892,
          2.0746
        ],
        "description": "Taxi or Uber is the right answer when the address is awkward, the bags are heavy, or the arrival is late enough that saving energy matters more than saving euros. Official taxis are black and yellow and queue outside the airport arrivals areas; Uber and other VTC services use app-assigned pickup points, often in dedicated parking areas rather than directly at the nearest curb. In the city, avoid asking a driver to thread into tiny Gothic lanes if you can walk to a clearer pickup edge like Placa Catalunya, Sants, Ronda Universitat, or Gran Via.",
        "category": "Essentials",
        "subcategory": "taxi_rideshare",
        "subcategories": [
          "taxi",
          "rideshare",
          "airport_transfer"
        ],
        "venueKind": "transport",
        "attributeTags": [
          "airport",
          "taxi",
          "rideshare",
          "transit_hub"
        ],
        "officialUrl": "https://www.aena.es/en/josep-tarradellas-barcelona-el-prat/getting-there/taxi.html",
        "photo": "https://www.barcelonaairportbcn.com/wp-content/uploads/2025/01/barcelona-airport-taxis.jpg",
        "hours": {
          "default": "Official airport taxis operate 24/7; rideshare pickup depends on app availability and assigned pickup point."
        },
        "places": [
          {
            "id": "taxi-rank-airport-t1",
            "name": "Airport Taxi Rank - T1 Ground Floor",
            "coordinates": [
              41.2892,
              2.0746
            ],
            "description": "Aena lists the official T1 taxi service on the ground floor opposite arrivals. Use the signed taxi rank and the black-and-yellow official taxis.",
            "category": "Essentials",
            "subcategory": "taxi_rank",
            "venueKind": "transport"
          },
          {
            "id": "taxi-rank-airport-t2a",
            "name": "Airport Taxi Rank - T2A",
            "coordinates": [
              41.3047,
              2.0795
            ],
            "description": "The official taxi rank sits outside the T2A arrivals side; follow the signed route from baggage claim to the curb.",
            "category": "Essentials",
            "subcategory": "taxi_rank",
            "venueKind": "transport"
          },
          {
            "id": "taxi-rank-airport-t2b",
            "name": "Airport Taxi Rank - T2B",
            "coordinates": [
              41.3043,
              2.0832
            ],
            "description": "The central Terminal 2 taxi rank and often the easiest T2 pickup point to orient around.",
            "category": "Essentials",
            "subcategory": "taxi_rank",
            "venueKind": "transport"
          },
          {
            "id": "taxi-rank-airport-t2c",
            "name": "Airport Taxi Rank - T2C",
            "coordinates": [
              41.3036,
              2.0877
            ],
            "description": "Taxi rank for the T2C end of Terminal 2; useful when your flight or airline exits on this side.",
            "category": "Essentials",
            "subcategory": "taxi_rank",
            "venueKind": "transport"
          },
          {
            "id": "vtc-uber-airport-t1",
            "name": "Uber / VTC Pickup - T1",
            "coordinates": [
              41.2898,
              2.0754
            ],
            "description": "Aena says Uber and other chauffeur-driven services use exclusive parking/pickup areas by terminal. Request the ride first, then follow the app and airport VTC signage rather than guessing from the nearest exit.",
            "category": "Essentials",
            "subcategory": "rideshare_pickup",
            "venueKind": "transport",
            "officialUrl": "https://www.aena.es/en/josep-tarradellas-barcelona-el-prat/getting-there/vehicles-for-hire.html"
          },
          {
            "id": "vtc-uber-airport-t2",
            "name": "Uber / VTC Pickup - T2 Express Parking",
            "coordinates": [
              41.3044,
              2.0838
            ],
            "description": "For Terminal 2, Aena lists Uber pickup around the T2A/T2B express parking areas. The exact point can vary, so let the app route you after matching with a driver.",
            "category": "Essentials",
            "subcategory": "rideshare_pickup",
            "venueKind": "transport",
            "officialUrl": "https://www.aena.es/en/josep-tarradellas-barcelona-el-prat/airport-services/vehiculos-con-conductor/t2.html"
          },
          {
            "id": "taxi-uber-city-placa-catalunya",
            "name": "City Pickup - Placa Catalunya",
            "coordinates": [
              41.3868594,
              2.1692738
            ],
            "description": "Use the curb edge around Bergara/Ronda Universitat rather than dropping a pin in the center of the plaza. It is visible, wide, and easier for taxis or app drivers to understand.",
            "category": "Essentials",
            "subcategory": "city_pickup",
            "venueKind": "transport"
          },
          {
            "id": "taxi-uber-city-barcelona-sants",
            "name": "City Pickup - Barcelona-Sants",
            "coordinates": [
              41.3791,
              2.14
            ],
            "description": "Best city-side pickup if you are already near Sants or arriving by train. Taxi ranks are obvious, traffic flow is built for pickups, and drivers do not have to hunt through old-town streets.",
            "category": "Essentials",
            "subcategory": "city_pickup",
            "venueKind": "transport"
          },
          {
            "id": "taxi-uber-city-ronda-universitat",
            "name": "City Pickup - Ronda Universitat / Gran Via Edge",
            "coordinates": [
              41.3866,
              2.1652
            ],
            "description": "A useful edge-of-center pickup zone for Eixample, Universitat, and the upper Raval. It is easier than trying to meet a car deep inside narrow old-city blocks.",
            "category": "Essentials",
            "subcategory": "city_pickup",
            "venueKind": "transport"
          }
        ]
      }
    ],
    "sources": [
      {
        "name": "Aerobus - Lines, stops and schedules",
        "url": "https://aerobusbarcelona.es/en/lines-stops-and-schedules/"
      },
      {
        "name": "Rodalies - Timetables",
        "url": "https://rodalies.gencat.cat/en/horaris/index.html"
      },
      {
        "name": "Rodalies - Line R2 North",
        "url": "https://rodalies.gencat.cat/en/sobre-rodalies/linies-i-estacions/servei_rodalia_barcelona/r2n/index.html"
      },
      {
        "name": "Aena - Taxi",
        "url": "https://www.aena.es/en/josep-tarradellas-barcelona-el-prat/getting-there/taxi.html"
      },
      {
        "name": "Aena - Vehicles for hire",
        "url": "https://www.aena.es/en/josep-tarradellas-barcelona-el-prat/getting-there/vehicles-for-hire.html"
      },
      {
        "name": "Uber - Barcelona Airport pickup",
        "url": "https://www.uber.com/global/en/r/airports/bcn/pickup/"
      },
      {
        "name": "OpenStreetMap - Barcelona Aerobus stop platforms",
        "url": "https://www.openstreetmap.org/search?query=Aerobus%20Pla%C3%A7a%20Catalunya%20Barcelona"
      }
    ]
  },
  {
    "id": "list-barcelona-gothic-quarter-restaurants",
    "slug": "barcelona-gothic-quarter-restaurants",
    "seoSlug": "best-restaurants",
    "seoTitle": "Best Restaurants in the Gothic Quarter, Barcelona",
    "seoDescription": "Best restaurants in the Gothic Quarter, Barcelona, from historic Catalan dining rooms to modern tasting menus and old-town spots that avoid the tourist-trap pattern.",
    "title": "Old-City Tables That Hold Up",
    "description": "The Gothic Quarter demands care because heavy visitor traffic supports plenty of forgettable meals. The most reliable tables are small Catalan kitchens, historic taverns, modern Mediterranean rooms, and straightforward all-day restaurants where focused cooking counts for more than medieval-lane scenery.",
    "url": "https://www.google.com/maps/search/gothic+quarter+restaurants+barcelona",
    "category": "Food",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Gothic Quarter",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-food",
      "name": "R Food",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "gothic-la-sosenga",
        "name": "La Sosenga",
        "coordinates": [
          41.3826,
          2.1749
        ],
        "description": "La Sosenga is the Gothic Quarter safeguard against old-town sameness: a small Catalan room where seasonal cooking and regional references matter more than medieval-lane atmosphere.",
        "price": "$$",
        "priceSource": "Time Out",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-4:00 PM",
          "wed": "1:00 PM-4:00 PM",
          "thu": "1:00 PM-4:00 PM",
          "fri": "1:00 PM-4:00 PM, 8:00 PM-11:00 PM",
          "sat": "1:00 PM-4:00 PM, 8:00 PM-11:00 PM",
          "sun": "Closed"
        },
        "photo": "https://images.gestionaweb.cat/7664/pimg-1600-1600/imgi-25-506307082-18049863443578428-5950750858347318333-n.jpg"
      },
      {
        "id": "gothic-bistrot-levante",
        "name": "Bistrot Levante",
        "coordinates": [
          41.3833,
          2.1769
        ],
        "description": "Bistrot Levante is a compact bistro on Placeta de Manuel Ribé, pairing Eastern Mediterranean flavours with vegetable-led plates in a calmer room than the surrounding Gothic Quarter lanes.",
        "price": "$$",
        "priceSource": "Eater / Google Maps",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80"
      },
      {
        "id": "gothic-la-plata-restaurant",
        "name": "Bar La Plata",
        "coordinates": [
          41.3818,
          2.1799
        ],
        "description": "The value is the whole old-tavern package: fried fish, tomato salad, butifarra, house wine, fast counter service, and a room that still feels local despite being deep in the Gothic Quarter.",
        "price": "$",
        "priceSource": "Tripadvisor / Google Maps",
        "hours": {
          "mon": "Closed",
          "tue": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "wed": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "thu": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "fri": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "sat": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "sun": "Closed"
        },
        "photo": "https://barlaplata.com/wp-content/uploads/2025/11/ferran-nadeu4.png?w=4000&h="
      },
      {
        "id": "gothic-capet",
        "name": "Capet",
        "coordinates": [
          41.3816,
          2.1764
        ],
        "description": "Capet serves contemporary Catalan cooking in an intimate Gothic Quarter room. Reservation pace and serious food provide a quieter splurge than Barcelona's headline tasting-menu productions.",
        "price": "$$$",
        "priceSource": "MICHELIN Guide / Resy",
        "hours": {
          "mon": "Closed",
          "tue": "7:00 PM-10:30 PM",
          "wed": "7:00 PM-10:30 PM",
          "thu": "7:00 PM-10:30 PM",
          "fri": "7:00 PM-10:30 PM",
          "sat": "7:00 PM-10:30 PM",
          "sun": "Closed"
        },
        "photo": "https://static.wixstatic.com/media/fdc945_db48802f7a134b33a10cdf267cd9d7e1~mv2.jpg/v1/fill/w_640,h_1114,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/fdc945_db48802f7a134b33a10cdf267cd9d7e1~mv2.jpg"
      },
      {
        "id": "gothic-sensi-bistro",
        "name": "Sensi Bistro",
        "coordinates": [
          41.3803,
          2.1771
        ],
        "description": "Sensi Bistro is a polished, visitor-friendly creative tapas restaurant near Plaça Reial, useful for groups that want composed sharing plates without gambling on the Gothic Quarter lanes. It is more international bistro-tapas than hidden local tavern, which is exactly why it works for an easy dinner.",
        "price": "$$",
        "priceSource": "Tripadvisor / Google Maps",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://sensi.es/bistro/core/uploads/2022/12/events.jpg"
      },
      {
              "id": "gothic-bar-oviso-restaurant",
              "name": "Bar Oviso",
              "coordinates": [
                      41.3826,
                      2.1766
              ],
              "description": "Bar Oviso is a casual Gothic food-and-drink bar for tapas, beers, and a low-pressure old-city pause.",
              "price": "$$",
              "priceSource": "Google Maps / local listings",
              "hours": {
                      "mon": "12:00 PM-12:30 AM",
                      "tue": "12:00 PM-12:30 AM",
                      "wed": "12:00 PM-12:30 AM",
                      "thu": "12:00 PM-1:30 AM",
                      "fri": "12:00 PM-2:00 AM",
                      "sat": "12:00 PM-2:00 AM",
                      "sun": "12:00 PM-12:00 AM"
              },
              "photo": "https://www.laramblabarcelona.com/wp-content/uploads/2018/02/bar-oviso.jpg"
      },
      {
              "id": "gothic-bar-lobo-restaurant",
              "name": "Bar Lobo",
              "coordinates": [
                      41.3844,
                      2.1698
              ],
              "description": "Bar Lobo is a roomy Gothic/Raval-edge bar for Mediterranean plates, tapas, and a meal that can stretch into drinks.",
              "price": "$$",
              "priceSource": "Time Out / Google Maps",
              "hours": {
                      "mon": "12:00 PM-12:30 AM",
                      "tue": "12:00 PM-12:30 AM",
                      "wed": "12:00 PM-12:30 AM",
                      "thu": "12:00 PM-1:30 AM",
                      "fri": "12:00 PM-2:00 AM",
                      "sat": "12:00 PM-2:00 AM",
                      "sun": "12:00 PM-12:00 AM"
              },
              "photo": "https://media.timeout.com/images/100628653/image.jpg"
      },
      {
              "id": "gothic-els-quatre-gats-restaurant",
              "name": "Els Quatre Gats",
              "coordinates": [
                      41.3855,
                      2.1737
              ],
              "description": "Els Quatre Gats is an art nouveau-style cafe, restaurant, and tavern opened in 1896, useful for Barcelona art history with a meal. It is more heritage room than hidden food find, but that context is the reason to go.",
              "price": "$$",
              "priceSource": "Official site / Google Maps",
              "hours": {
                      "mon": "12:00 PM-12:30 AM",
                      "tue": "12:00 PM-12:30 AM",
                      "wed": "12:00 PM-12:30 AM",
                      "thu": "12:00 PM-1:30 AM",
                      "fri": "12:00 PM-2:00 AM",
                      "sat": "12:00 PM-2:00 AM",
                      "sun": "12:00 PM-12:00 AM"
              },
              "photo": "https://4gats.com/wp-content/uploads/2026/04/4gats-taverna.jpg"
      },
      {
              "id": "gothic-milk-bar-bistro-restaurant",
              "name": "Milk Bar & Bistro",
              "coordinates": [
                      41.3797,
                      2.1767
              ],
              "description": "Milk Bar & Bistro is a brunch-and-comfort-food bar in the Gothic Quarter, with bagels, eggs, cocktails, and an easy all-day feel near Plaça Reial.",
              "price": "$$",
              "priceSource": "Google Maps / Tripadvisor",
              "hours": {
                      "mon": "12:00 PM-12:30 AM",
                      "tue": "12:00 PM-12:30 AM",
                      "wed": "12:00 PM-12:30 AM",
                      "thu": "12:00 PM-1:30 AM",
                      "fri": "12:00 PM-2:00 AM",
                      "sat": "12:00 PM-2:00 AM",
                      "sun": "12:00 PM-12:00 AM"
              },
              "photo": "https://milkbarcelona.com/wp-content/uploads/2023/02/bagel-682x1024.jpg"
      }
    ],
    "sources": [
      {
        "name": "Time Out - Best restaurants in Barcelona",
        "url": "https://www.timeout.com/barcelona/restaurants/best-restaurants-in-barcelona"
      },
      {
        "name": "The Infatuation - Best Restaurants in Barcelona",
        "url": "https://www.theinfatuation.com/barcelona/guides/best-restaurants-hotels-barcelona"
      },
      {
        "name": "Eater - Old City restaurants",
        "url": "https://www.eater.com/maps/barcelona-old-city-gothic-quarter-best-restaurants"
      },
      {
        "name": "MICHELIN Guide - Capet",
        "url": "https://guide.michelin.com/us/en/catalunya/barcelona/restaurant/capet"
      },
      {
        "name": "Restaurants for Kings - Gothic Quarter restaurants",
        "url": "https://restaurantsforkings.com/blog/gothic-quarter-barcelona-restaurants-guide-2026.html"
      },
      {
        "name": "Tripadvisor - Gothic Quarter restaurants",
        "url": "https://www.tripadvisor.com/Restaurants-g187497-zfn7237169-Barcelona_Catalonia.html"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-barcelona-el-born-restaurants",
    "slug": "barcelona-el-born-restaurants",
    "seoSlug": "best-restaurants",
    "seoTitle": "Best Restaurants in El Born, Barcelona",
    "seoDescription": "Best restaurants in El Born, Barcelona, including seafood counters, natural-wine rooms, tapas classics, market-adjacent kitchens, and booking-worthy local favorites.",
    "title": "Cava, Counters, and Cool Rooms",
    "description": "El Born is at its best when the meal feels tangled up with the streets around it: stone lanes, museum crowds, cava glasses, and kitchens running hot behind narrow doors.",
    "url": "https://www.google.com/maps/search/el+born+restaurants+barcelona",
    "category": "Food",
    "location": {
      "city": "Barcelona",
      "neighborhood": "El Born",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-food",
      "name": "R Food",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "born-cal-pep-restaurant",
        "name": "Cal Pep",
        "coordinates": [
          41.3835,
          2.1839
        ],
        "description": "Cal Pep is an El Born seafood-counter classic serving clams, squid, fried fish, and seasonal plates through kitchen-led ordering from tight seats. Prices reflect both the seafood and the fast counter performance.",
        "price": "$$$",
        "priceSource": "The Infatuation / Google Maps",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "wed": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "thu": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "fri": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sat": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sun": "Closed"
        },
        "photo": "https://lh3.googleusercontent.com/p/AF1QipMAfpnNAXVl4nrBreCG9RCwlKezMqgrs6IiObfb=s1360-w1360-h1020-rw"
      },
      {
        "id": "born-bar-del-pla-restaurant",
        "name": "Bar del Pla",
        "coordinates": [
          41.3857,
          2.1817
        ],
        "description": "Bar del Pla is an El Born dinner bar when tapas should feel contemporary and wine-led instead of interchangeable. Expect Catalan comfort, creative small plates, close tables, and enough neighborhood buzz to justify booking rather than wandering into the nearest old-city counter.",
        "price": "$$",
        "priceSource": "The Infatuation / Google Maps",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://www.bardelpla.cat/wp-content/uploads/2023/11/BdP-31-10-23_4328-close-up-copia-2.jpg"
      },
      {
        "id": "born-fismuler",
        "name": "Fismuler",
        "coordinates": [
          41.3867,
          2.1846
        ],
        "description": "Fismuler serves seasonal Mediterranean cooking, raw seafood, serious wine, and a frequently discussed cheesecake in a stylish Born dining room. The format is a full restaurant meal rather than a quick tapas counter.",
        "price": "$$$",
        "priceSource": "The Infatuation / Google Maps",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/6c/5a/92/tartar-de-dorada-y-uva.jpg?w=1400&h=800&s=1"
      },
      {
        "id": "born-bar-brutal",
        "name": "Bar Brutal",
        "coordinates": [
          41.3849,
          2.1811
        ],
        "description": "Bar Brutal is one of Barcelona's best-known natural-wine rooms, with low-intervention bottles driving the meal as much as the salty, snackable plates. Curious drinking and lively service define the El Born room.",
        "price": "$$",
        "priceSource": "The Infatuation / Instagram",
        "hours": {
          "mon": "7:00 PM-12:00 AM",
          "tue": "7:00 PM-12:00 AM",
          "wed": "7:00 PM-12:00 AM",
          "thu": "7:00 PM-12:00 AM",
          "fri": "1:00 PM-4:00 PM, 7:00 PM-12:30 AM",
          "sat": "1:00 PM-4:00 PM, 7:00 PM-12:30 AM",
          "sun": "1:00 PM-4:00 PM, 7:00 PM-12:00 AM"
        },
        "photo": "https://starwinelist.com/storage/images/venue/1068/980x541/jJjRFvz1ZINDUp0DlOccjrIYk9gqo3ECPdjkoI0J.jpeg?signature=4ce91f3cb49a6ba0e9fb308516d5ac673cb3a5ec8cbe2266b1a48db4940fb0d0"
      },
      {
        "id": "born-cuines-santa-caterina",
        "name": "Cuines Santa Caterina",
        "coordinates": [
          41.3867,
          2.1788
        ],
        "description": "Cuines Santa Caterina is the practical market-side answer for groups, odd meal times, and mixed cravings under the Santa Caterina roof. It is not rare; it is useful, broad, central, and easier than forcing everyone into one narrow tapas format.",
        "price": "$$",
        "priceSource": "The Infatuation / Google Maps",
        "hours": {
          "mon": "12:00 PM-12:00 AM",
          "tue": "12:00 PM-12:00 AM",
          "wed": "12:00 PM-12:00 AM",
          "thu": "12:00 PM-12:00 AM",
          "fri": "12:00 PM-1:00 AM",
          "sat": "12:00 PM-1:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://966e7448.delivery.rocketcdn.me/wp-content/uploads/thumb-CUINES-DE-SANTA-CATERINA.jpg"
      },
      {
              "id": "born-bormuth-restaurant",
              "name": "Bormuth",
              "coordinates": [
                      41.3839,
                      2.1811
              ],
              "description": "Bormuth is the Born food fallback that still feels like the neighborhood: tapas, vermouth, and enough seating to turn a casual stop into dinner.",
              "price": "$$",
              "priceSource": "Google Maps / Tripadvisor",
              "hours": {
                      "mon": "12:00 PM-12:30 AM",
                      "tue": "12:00 PM-12:30 AM",
                      "wed": "12:00 PM-12:30 AM",
                      "thu": "12:00 PM-1:30 AM",
                      "fri": "12:00 PM-2:00 AM",
                      "sat": "12:00 PM-2:00 AM",
                      "sun": "12:00 PM-12:00 AM"
              },
              "photo": "https://cdn.barselona.io/cdn-cgi/imagedelivery/35dtYK6MaGFKaBcATdNk5w/6f232061-8680-44ab-8b7f-d9c79e414200/w=1500"
      },
      {
              "id": "born-casa-delfin-restaurant",
              "name": "Casa Delfín",
              "coordinates": [
                      41.3834,
                      2.1824
              ],
              "description": "Casa Delfín is a Born restaurant-and-tavern classic for tapas, rice, vermouth, and plaza-side people-watching near the market. The meal is easy, central, and rooted in the old neighborhood.",
              "price": "$$",
              "priceSource": "Google Maps / Tripadvisor",
              "hours": {
                      "mon": "12:00 PM-12:30 AM",
                      "tue": "12:00 PM-12:30 AM",
                      "wed": "12:00 PM-12:30 AM",
                      "thu": "12:00 PM-1:30 AM",
                      "fri": "12:00 PM-2:00 AM",
                      "sat": "12:00 PM-2:00 AM",
                      "sun": "12:00 PM-12:00 AM"
              },
              "photo": "https://casadelfinrestaurant.com/wp-content/uploads/2022/06/galeria-home-02.jpg"
      },
      {
        "id": "born-el-xampanyet-restaurant",
        "name": "El Xampanyet",
        "coordinates": [
          41.3847,
          2.1836
        ],
        "description": "El Xampanyet is a packed, tile-lined Born cava counter serving anchovies, conservas, and simple salty tapas. The short, loud room moves quickly and rarely feels like a slow meal.",
        "price": "$",
        "priceSource": "The Infatuation / Tripadvisor",
        "hours": {
          "mon": "7:00 PM-11:00 PM",
          "tue": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "wed": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "thu": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "fri": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "sat": "12:00 PM-3:30 PM",
          "sun": "Closed"
        },
        "photo": "https://www.elxampanyet.com/wp-content/uploads/2024/10/Iriarte_0117-2048x1352.jpg"
      }
    ],
    "sources": [
      {
        "name": "The Infatuation - El Born",
        "url": "https://www.theinfatuation.com/barcelona/neighborhoods/el-born"
      },
      {
        "name": "The Infatuation - Best Restaurants in Barcelona",
        "url": "https://www.theinfatuation.com/barcelona/guides/best-restaurants-hotels-barcelona"
      },
      {
        "name": "Eater - Old City restaurants",
        "url": "https://www.eater.com/maps/barcelona-old-city-gothic-quarter-best-restaurants"
      },
      {
        "name": "Time Out - Barcelona restaurants",
        "url": "https://www.timeout.com/barcelona/restaurants"
      },
      {
        "name": "Tripadvisor - Barcelona restaurants",
        "url": "https://www.tripadvisor.com/Restaurants-g187497-Barcelona_Catalonia.html"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-barcelona-eixample-restaurants",
    "slug": "barcelona-eixample-restaurants",
    "seoSlug": "best-restaurants",
    "seoTitle": "Best Restaurants in Eixample, Barcelona",
    "seoDescription": "Best restaurants in Eixample, Barcelona, from destination tasting menus and polished tapas counters to design-hotel dining rooms and reliable group-friendly classics.",
    "title": "Upscale Dining & Tapas",
    "description": "Eixample is where Barcelona can afford to be polished without losing its appetite. Bodega Joan and El Nacional are here for the big-table, no-mystery nights when logistics matter as much as taste.",
    "url": "https://www.google.com/maps/search/eixample+restaurants+barcelona",
    "category": "Food",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Eixample",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-food",
      "name": "R Food",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "eixample-disfrutar",
        "name": "Disfrutar",
        "coordinates": [
          41.3878,
          2.1533
        ],
        "description": "Disfrutar is Eixample’s world-stage reservation, a technical and playful tasting menu from elBulli alumni that changes the scale of an architecture day. Put it in the expensive filter and protect the evening around it.",
        "price": "$$$",
        "priceSource": "MICHELIN Guide / World's 50 Best",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-2:15 PM, 8:00 PM-9:15 PM",
          "wed": "1:00 PM-2:15 PM, 8:00 PM-9:15 PM",
          "thu": "1:00 PM-2:15 PM, 8:00 PM-9:15 PM",
          "fri": "1:00 PM-2:15 PM, 8:00 PM-9:15 PM",
          "sat": "1:00 PM-2:15 PM, 8:00 PM-9:15 PM",
          "sun": "Closed"
        },
        "photo": "https://www.disfrutarbarcelona.com/api/uploads/restaurant/slider/images/original/cd60e682ef18d378de9e38ab983d2f2b_phpup3Axy.jpg"
      },
      {
        "id": "eixample-bar-mut-restaurant",
        "name": "Bar Mut",
        "coordinates": [
          41.3917,
          2.1554
        ],
        "description": "Bar Mut pairs serious wine with seasonal Catalan plates and steakhouse-bistro comfort in a classic Eixample room. Prices suit a grown-up meal near Passeig de Gracia without tasting-menu formality.",
        "price": "$$$",
        "priceSource": "The Infatuation / Google Maps",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://barmut.com/wp-content/uploads/2026/02/Txuleton-010-15102025-4672-x-7008-Bar-Mut.jpg"
      },
      {
        "id": "eixample-bodega-bonay",
        "name": "Bodega Bonay",
        "coordinates": [
          41.3918,
          2.1746
        ],
        "description": "Bodega Bonay is a stylish Eixample food-and-wine room built around Catalan natural wine, anchovies, cecina, pastas, and long social lunches without tasting-menu formality.",
        "category": "Food",
        "venueKind": "food_drink",
        "foodServiceType": "restaurant",
        "price": "$$",
        "priceSource": "The Infatuation / Resy",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://cdn-hhbfohb.nitrocdn.com/MWVuFFQrOubRCgucqTrIdzQgXRECTcge/assets/images/optimized/rev-41ae578/casabonay.com/wp-content/uploads/2020/12/ATP9564@antp-900x1196.jpg"
      },
      {
        "id": "eixample-paco-meralgo",
        "name": "Paco Meralgo",
        "coordinates": [
          41.3915,
          2.1519
        ],
        "description": "Paco Meralgo is the reliable mid-range tapas counter for Eixample, backed more by review volume and practical usefulness than by novelty.",
        "price": "$$",
        "priceSource": "Google Maps / Tripadvisor",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://restaurantpacomeralgo.com/wp-content/uploads/2024/05/paco4.jpg"
      },
      {
        "id": "eixample-cerveceria-catalana",
        "name": "Cervecería Catalana",
        "coordinates": [
          41.3921,
          2.1602
        ],
        "description": "Cervecería Catalana is not a secret and should not be sold as one; it is a high-volume Eixample tapas machine that still works when speed, choice, and counter energy matter.",
        "price": "$$",
        "priceSource": "Google Maps / Tripadvisor",
        "hours": {
          "mon": "12:00 PM-12:00 AM",
          "tue": "12:00 PM-12:00 AM",
          "wed": "12:00 PM-12:00 AM",
          "thu": "12:00 PM-12:00 AM",
          "fri": "12:00 PM-1:00 AM",
          "sat": "12:00 PM-1:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://lh3.googleusercontent.com/p/AF1QipP14Wt5ejOwRKMNMFlYcbWhtdDHLmufLjj3SFc=s1360-w1360-h1020-rw"
      },
      {
              "id": "eixample-bodega-joan-restaurant",
              "name": "Bodega Joan",
              "coordinates": [
                      41.396,
                      2.1684
              ],
              "description": "Bodega Joan serves homestyle Catalan tapas, charcuterie boards, paellas, and sangria in a straightforward Eixample dining room.",
              "price": "$$",
              "priceSource": "Google Maps / Tripadvisor",
              "hours": {
                      "mon": "12:00 PM-12:30 AM",
                      "tue": "12:00 PM-12:30 AM",
                      "wed": "12:00 PM-12:30 AM",
                      "thu": "12:00 PM-1:30 AM",
                      "fri": "12:00 PM-2:00 AM",
                      "sat": "12:00 PM-2:00 AM",
                      "sun": "12:00 PM-12:00 AM"
              },
              "photo": "https://cdn.prod.website-files.com/649bffef1ea0320a4ff37c9f/649c01ab052368397680fa21_5_b.jpg"
      },
      {
        "id": "eixample-el-nacional-restaurant",
        "name": "El Nacional",
        "coordinates": [
          41.3917,
          2.168
        ],
        "description": "El Nacional is a logistics win, but it should be used honestly: a grand Passeig de Gracia food hall for groups, late hours, and mixed appetites rather than a hidden restaurant discovery. The best play is to choose the seafood, meat, tapas, or oyster-and-drink counter that solves the moment and enjoy the polished theater of the room.",
        "price": "$$",
        "priceSource": "Time Out / Google Maps",
        "hours": {
          "mon": "12:00 PM-12:00 AM",
          "tue": "12:00 PM-12:00 AM",
          "wed": "12:00 PM-12:00 AM",
          "thu": "12:00 PM-12:00 AM",
          "fri": "12:00 PM-1:00 AM",
          "sat": "12:00 PM-1:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://media.timeout.com/images/100628653/image.jpg"
      }
    ],
    "sources": [
      {
        "name": "The Infatuation - Best Restaurants in Eixample",
        "url": "https://www.theinfatuation.com/barcelona/guides/best-restaurants-eixample"
      },
      {
        "name": "The Infatuation - Best Restaurants in Barcelona",
        "url": "https://www.theinfatuation.com/barcelona/guides/best-restaurants-hotels-barcelona"
      },
      {
        "name": "Eater - Best Restaurants in Barcelona",
        "url": "https://www.eater.com/maps/best-restaurants-barcelona-spain"
      },
      {
        "name": "MICHELIN Guide - Disfrutar",
        "url": "https://guide.michelin.com/us/en/catalunya/barcelona/restaurant/disfrutar"
      },
      {
        "name": "World's 50 Best - Disfrutar",
        "url": "https://www.theworlds50best.com/discovery/Establishments/Spain/Barcelona/Disfrutar.html"
      },
      {
        "name": "Time Out - Best restaurants in Barcelona",
        "url": "https://www.timeout.com/barcelona/restaurants/best-restaurants-in-barcelona"
      },
      {
        "name": "Tripadvisor - Barcelona restaurants",
        "url": "https://www.tripadvisor.com/Restaurants-g187497-Barcelona_Catalonia.html"
      },
      {
        "name": "Barcelonaando - Eixample guide",
        "url": "https://barcelonando.com/eixample/"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-barcelona-gracia-restaurants",
    "slug": "barcelona-gracia-restaurants",
    "seoSlug": "best-restaurants",
    "seoTitle": "Best Restaurants in Gràcia, Barcelona",
    "seoDescription": "Best restaurants in Gràcia, Barcelona, covering chef-led rooms, market lunches, creative tapas, casual local favorites, and neighborhood dining worth booking.",
    "title": "Village Tables Worth the Walk",
    "description": "Gracia eats like a neighborhood that still believes in regulars, plazas, and taking your time. Bar Salvatge, Gut, and Shoronpo round it out for nights when Gracia should feel more lived-in than scheduled.",
    "url": "https://www.google.com/maps/search/gracia+restaurants+barcelona",
    "category": "Food",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Gràcia",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-food",
      "name": "R Food",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "gracia-bemba",
        "name": "Bemba Smash Burger",
        "coordinates": [
          41.407,
          2.1583
        ],
        "description": "Bemba is the casual Gràcia reset: a focused smash-burger counter that breaks up the parade of tapas, rice, and tasting menus.",
        "price": "$",
        "priceSource": "Eater / Instagram",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://151626694.cdn6.editmysite.com/uploads/1/5/1/6/151626694/2GGFXOEZVUBKKQX5WBXUSYAN.jpeg?width=2560&dpr=2"
      },
      {
        "id": "gracia-con-gracia",
        "name": "Con Gracia",
        "coordinates": [
          41.3979,
          2.1599
        ],
        "description": "Con Gracia gives Gràcia a quiet special-occasion lane: tasting-menu pace, wine pairing, and a more personal room than the plaza-bar circuit. It is a neighborhood restaurant for polish without going back down into Eixample.",
        "price": "$$$",
        "priceSource": "Time Out / Google Maps",
        "hours": {
          "mon": "Closed",
          "tue": "7:00 PM-10:30 PM",
          "wed": "7:00 PM-10:30 PM",
          "thu": "7:00 PM-10:30 PM",
          "fri": "7:00 PM-10:30 PM",
          "sat": "7:00 PM-10:30 PM",
          "sun": "Closed"
        },
        "photo": "https://congraciarestaurant.com/wp-content/uploads/2024/05/nuestros_menus_1-1.jpg"
      },
      {
        "id": "gracia-la-pubilla",
        "name": "La Pubilla",
        "coordinates": [
          41.4025,
          2.1534
        ],
        "description": "La Pubilla serves daily Catalan cooking beside Mercat de la Llibertat: stews, eggs, and seasonal plates in a room shared with regulars. Daytime hours make breakfast and lunch its natural services.",
        "price": "$$",
        "priceSource": "Tripadvisor / Google Maps",
        "hours": {
          "mon": "8:30 AM-4:00 PM",
          "tue": "8:30 AM-4:00 PM",
          "wed": "8:30 AM-4:00 PM",
          "thu": "8:30 AM-4:00 PM",
          "fri": "8:30 AM-4:00 PM",
          "sat": "9:00 AM-4:00 PM",
          "sun": "Closed"
        },
        "photo": "https://static3.grubbio.com/885g-albums-1.jpg"
      },
      {
              "id": "gracia-bar-canigo-restaurant",
              "name": "Bar Canigó",
              "coordinates": [
                      41.4022,
                      2.1564
              ],
              "description": "Bar Canigó is an everyday Gràcia bar for breakfast, lunch, tapas, and vermouth. Its range and neighborhood rhythm matter more than destination-dining ceremony.",
              "price": "$$",
              "priceSource": "Official site / Google Maps",
              "hours": {
                      "mon": "12:00 PM-12:30 AM",
                      "tue": "12:00 PM-12:30 AM",
                      "wed": "12:00 PM-12:30 AM",
                      "thu": "12:00 PM-1:30 AM",
                      "fri": "12:00 PM-2:00 AM",
                      "sat": "12:00 PM-2:00 AM",
                      "sun": "12:00 PM-12:00 AM"
              },
              "photo": "https://www.barcanigo.com/assets/img/BarCanigo_Back_4.jpg"
      },
      {
              "id": "gracia-bodega-quimet-restaurant",
              "name": "Bodega Quimet",
              "coordinates": [
                      41.4029,
                      2.1562
              ],
              "description": "Bodega Quimet is a Gracia tavern built around house vermouth, conservas, cheeses, anchovies, cured meats, and easy grazing. The drink may be the hook, but food is integral.",
              "price": "$$",
              "priceSource": "Official site / Google Maps",
              "hours": {
                      "mon": "12:00 PM-12:30 AM",
                      "tue": "12:00 PM-12:30 AM",
                      "wed": "12:00 PM-12:30 AM",
                      "thu": "12:00 PM-1:30 AM",
                      "fri": "12:00 PM-2:00 AM",
                      "sat": "12:00 PM-2:00 AM",
                      "sun": "12:00 PM-12:00 AM"
              },
              "photo": "https://www.bodegaquimet.com/img-trans/productos/24272/fotos/1024-67ac8f5bebe2f-bar-bodega-quimet.png"
      },
      {
              "id": "gracia-bar-salvatge-restaurant",
              "name": "Bar Salvatge",
              "coordinates": [
                      41.3993,
                      2.1584
              ],
              "description": "Bar Salvatge is a Gràcia natural-wine-and-food bar, pairing low-intervention bottles with local cuisine, cheeses, and snackable plates in a funky storefront.",
              "price": "$$",
              "priceSource": "Google Maps / local listings",
              "hours": {
                      "mon": "12:00 PM-12:30 AM",
                      "tue": "12:00 PM-12:30 AM",
                      "wed": "12:00 PM-12:30 AM",
                      "thu": "12:00 PM-1:30 AM",
                      "fri": "12:00 PM-2:00 AM",
                      "sat": "12:00 PM-2:00 AM",
                      "sun": "12:00 PM-12:00 AM"
              },
              "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFsd6zsGYD1agNYVeDH-ygggbhXVmvwxrlGPtWu9RWU49DyeBpNEZ8tZ771kvQmJbwM0xeV5L0BzV5vjjI9JkDnpcjazIQgHRMaHFvzt2imlyqDQTNslVfZDlY8-3vXqqX_R1b0E1mrnlwL=s1360-w1360-h1020-rw"
      },
      {
        "id": "gracia-gut",
        "name": "Gut",
        "coordinates": [
          41.4002,
          2.1568
        ],
        "description": "Gut is a lighter Gràcia restaurant for Mediterranean-Asian plates, vegetables, and gluten-free or health-conscious flexibility. It is the room to choose when the group wants brightness and ease instead of another fried-and-wine-heavy night.",
        "price": "$$",
        "priceSource": "Time Out / Google Maps",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://restaurantgut.com/wp-content/uploads/2024/02/Menu_migdia.jpg"
      },
      {
        "id": "gracia-la-panxa-del-bisbe",
        "name": "La Panxa del Bisbe",
        "coordinates": [
          41.4031,
          2.1549
        ],
        "description": "La Panxa del Bisbe keeps the Gràcia list intimate: creative Catalan small plates, seasonal specials, and a compact room where booking matters. It is still shareable and relaxed, but more personal than the neighborhood's default plaza tapas bars.",
        "price": "$$",
        "priceSource": "Time Out / Google Maps",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "wed": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "thu": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "fri": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sat": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sun": "Closed"
        },
        "photo": "https://media-cdn.tripadvisor.com/media/photo-s/07/3c/be/84/la-panxa-del-bisbe.jpg"
      },
      {
        "id": "gracia-shoronpo",
        "name": "Shoronpo",
        "coordinates": [
          41.3981,
          2.1572
        ],
        "description": "Shoronpo adds a non-tapas Gràcia hit with ramen, soup dumplings, tantanmen, and fried snacks in a busy, compact room.",
        "price": "$$",
        "priceSource": "Eater / Instagram",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/ca/7e/81/caption.jpg?w=1400&h=800&s=1"
      }
    ],
    "sources": [
      {
        "name": "Time Out - Gràcia guide",
        "url": "https://www.timeout.com/barcelona/things-to-do/gracia"
      },
      {
        "name": "Time Out - Con Gracia",
        "url": "https://www.timeout.com/barcelona/restaurants/con-gracia"
      },
      {
        "name": "Eater - Best Restaurants in Barcelona",
        "url": "https://www.eater.com/maps/best-restaurants-barcelona-spain"
      },
      {
        "name": "The Infatuation - Barcelona guides",
        "url": "https://www.theinfatuation.com/barcelona/guides"
      },
      {
        "name": "Tripadvisor - La Pubilla",
        "url": "https://www.tripadvisor.com/Restaurant_Review-g187497-d3800375-Reviews-La_Pubilla-Barcelona_Catalonia.html"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-barcelona-poble-sec-restaurants",
    "slug": "barcelona-poble-sec-restaurants",
    "seoSlug": "best-restaurants",
    "seoTitle": "Best Restaurants in Poble-sec, Barcelona",
    "seoDescription": "Best restaurants in Poble-sec, Barcelona, for serious tapas, Montjuic-view rice, Venetian-Catalan plates, and dinner stops near theaters and Sala Apolo.",
    "title": "Blai Bites and Montjuïc Meals",
    "description": "Poble-sec food moves from standing-room bodegas and Blai counters to rice with a view and more idiosyncratic Mediterranean dining beneath Montjuic. Small rooms and neighborhood energy matter as much as individual dishes.",
    "url": "https://www.google.com/maps/search/poble+sec+restaurants+barcelona",
    "category": "Food",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Poble-sec",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-food",
      "name": "R Food",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "poblesec-quimet-quimet-restaurant",
        "name": "Quimet & Quimet",
        "coordinates": [
          41.3738,
          2.1635
        ],
        "description": "Quimet & Quimet is a tiny standing-room Poble-sec bodega built around montaditos, conservas, smoked fish, beer, vermouth, and bottles stacked to the ceiling. Early arrival helps because the counter favors fast, focused eating over a long sit-down meal.",
        "price": "$$",
        "priceSource": "Official site / Tripadvisor",
        "hours": {
          "mon": "12:00 PM-4:00 PM, 6:00 PM-10:30 PM",
          "tue": "12:00 PM-4:00 PM, 6:00 PM-10:30 PM",
          "wed": "12:00 PM-4:00 PM, 6:00 PM-10:30 PM",
          "thu": "12:00 PM-4:00 PM, 6:00 PM-10:30 PM",
          "fri": "12:00 PM-4:00 PM, 6:00 PM-10:30 PM",
          "sat": "Closed",
          "sun": "Closed"
        },
        "photo": "https://quimetiquimet.com/wp-content/uploads/tapbg.jpg"
      },
      {
        "id": "poblesec-martinez",
        "name": "Martínez",
        "coordinates": [
          41.3692,
          2.1661
        ],
        "description": "Martínez is a planned Montjuïc lunch, not a casual neighborhood fallback: terrace views, seafood rice, fideuà, Catalan wine, and a long meal above the port. Book it when setting and pace matter as much as the paella pan.",
        "price": "$$$",
        "priceSource": "Eater / The Infatuation",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://martinezbarcelona.com/web/wp-content/uploads/2026/04/Martinez-07482-1030x687-1.jpg"
      },
      {
        "id": "poblesec-xemei",
        "name": "Xemei",
        "coordinates": [
          41.3718,
          2.1668
        ],
        "description": "Xemei gives Poble-sec a Venetian-Adriatic change of register instead of another tapas room: seafood, handmade pasta, offbeat Italian bottles, and a lively dining room that feels specific to this slope of the city.",
        "price": "$$",
        "priceSource": "Eater / El País",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "wed": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "thu": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "fri": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sat": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sun": "Closed"
        },
        "photo": "https://images.squarespace-cdn.com/content/v1/642bdd5c8f26792d3234f41f/4622d6bd-e3f6-48bf-8a20-21930382ec44/L1001642.jpg?format=1000w"
      },
      {
        "id": "poblesec-la-platilleria-restaurant",
        "name": "La Platilleria",
        "coordinates": [
          41.3746,
          2.1658
        ],
        "description": "La Platilleria is a warm small-plates restaurant for a Poble-sec dinner that does not need to become a full tasting-menu event.",
        "price": "$$",
        "priceSource": "Google Maps / Tripadvisor",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "wed": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "thu": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "fri": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sat": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sun": "Closed"
        },
        "photo": "https://media-cdn.tripadvisor.com/media/photo-o/09/24/e4/7a/la-platilleria.jpg"
      },
      {
        "id": "poblesec-margarit",
        "name": "Margarit",
        "coordinates": [
          41.3732,
          2.1646
        ],
        "description": "Margarit brings Mediterranean-Greek cooking and natural-wine energy to the Montjuic slope. Dips, grilled vegetables, seafood, and a relaxed room feel current without depending on hype alone.",
        "price": "$$",
        "priceSource": "Eater / Instagram",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://media.timeout.com/images/106162177/1024/576/image.jpg"
      }],
    "sources": [
      {
        "name": "The Infatuation - Best Restaurants in Barcelona",
        "url": "https://www.theinfatuation.com/barcelona/guides/best-restaurants-hotels-barcelona"
      },
      {
        "name": "Eater - Best Restaurants in Barcelona",
        "url": "https://www.eater.com/maps/best-restaurants-barcelona-spain"
      },
      {
        "name": "Time Out - Barcelona restaurants",
        "url": "https://www.timeout.com/barcelona/restaurants"
      },
      {
        "name": "Time Out - Poble-sec bars",
        "url": "https://www.timeout.com/barcelona/bars-and-pubs/poble-sec-bars"
      },
      {
        "name": "Quimet & Quimet official",
        "url": "https://quimetiquimet.com/en/"
      },
      {
        "name": "Tripadvisor - Quimet & Quimet",
        "url": "https://www.tripadvisor.com/Restaurant_Review-g187497-d717377-Reviews-Quimet_Quimet-Barcelona_Catalonia.html"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-barcelona-citywide-restaurants",
    "slug": "barcelona-citywide-restaurants",
    "seoSlug": "best-restaurants",
    "seoTitle": "Best Restaurants in Barcelona",
    "seoDescription": "Best restaurants in Barcelona, from world-class tasting menus and seafood counters to natural-wine rooms, tavern classics, market lunches, and neighborhood meals worth crossing town for.",
    "title": "Essential Local Spots",
    "description": "This is the cross-town list for meals that can carry a day instead of merely interrupting it. Martinez, Bar Brutal, Bar La Plata, and Bemba keep the range honest: splurge, counter, wine, burger, repeat as needed.",
    "url": "https://www.google.com/maps/search/best+restaurants+barcelona",
    "category": "Food",
    "location": {
      "city": "Barcelona",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-food",
      "name": "R Food",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-02T00:00:00.000Z",
    "stops": [
      {
        "id": "citywide-cal-pep",
        "name": "Cal Pep",
        "coordinates": [
          41.3835,
          2.1839
        ],
        "description": "Cal Pep runs like a Barcelona meal in motion: seafood arrives quickly across a tight Born counter, and the kitchen steers the order toward what is best that day. It is not cheap, but the pace and immediacy distinguish it from a standard tapas crawl.",
        "price": "$$$",
        "priceSource": "The Infatuation / Google Maps",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "wed": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "thu": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "fri": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sat": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sun": "Closed"
        },
        "photo": "https://lh3.googleusercontent.com/p/AF1QipMAfpnNAXVl4nrBreCG9RCwlKezMqgrs6IiObfb=s1360-w1360-h1020-rw"
      },
      {
        "id": "citywide-quimet-quimet",
        "name": "Quimet & Quimet",
        "coordinates": [
          41.3738,
          2.1635
        ],
        "description": "Quimet & Quimet is a tiny standing-room Poble-sec bodega built around montaditos, conservas, smoked fish, beer, vermouth, and bottles stacked to the ceiling. Early arrival helps because the counter favors fast, focused eating over a long sit-down meal.",
        "price": "$$",
        "priceSource": "Official site / Time Out / Tripadvisor",
        "hours": {
          "mon": "12:00 PM-4:00 PM, 6:00 PM-10:30 PM",
          "tue": "12:00 PM-4:00 PM, 6:00 PM-10:30 PM",
          "wed": "12:00 PM-4:00 PM, 6:00 PM-10:30 PM",
          "thu": "12:00 PM-4:00 PM, 6:00 PM-10:30 PM",
          "fri": "12:00 PM-4:00 PM, 6:00 PM-10:30 PM",
          "sat": "Closed",
          "sun": "Closed"
        },
        "photo": "https://quimetiquimet.com/wp-content/uploads/tapbg.jpg"
      },
      {
        "id": "citywide-bar-del-pla",
        "name": "Bar del Pla",
        "coordinates": [
          41.3857,
          2.1817
        ],
        "description": "Bar del Pla is a citywide bar for a real El Born dinner that still has tapas flexibility: creative Catalan plates, a wine-first mood, and enough buzz to feel current without becoming pure scene. Book it when the night should start with food and naturally roll toward drinks.",
        "price": "$$",
        "priceSource": "The Infatuation / Google Maps",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://www.bardelpla.cat/wp-content/uploads/2023/11/BdP-31-10-23_4328-close-up-copia-2.jpg"
      },
      {
        "id": "citywide-disfrutar",
        "name": "Disfrutar",
        "coordinates": [
          41.3878,
          2.1533
        ],
        "description": "Disfrutar is Barcelona's globally recognized special-occasion reservation, built around a long, inventive tasting menu and precise service. Availability leaves very little room for spontaneity.",
        "price": "$$$",
        "priceSource": "MICHELIN Guide / World's 50 Best",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-2:15 PM, 8:00 PM-9:15 PM",
          "wed": "1:00 PM-2:15 PM, 8:00 PM-9:15 PM",
          "thu": "1:00 PM-2:15 PM, 8:00 PM-9:15 PM",
          "fri": "1:00 PM-2:15 PM, 8:00 PM-9:15 PM",
          "sat": "1:00 PM-2:15 PM, 8:00 PM-9:15 PM",
          "sun": "Closed"
        },
        "photo": "https://www.disfrutarbarcelona.com/api/uploads/restaurant/slider/images/original/cd60e682ef18d378de9e38ab983d2f2b_phpup3Axy.jpg"
      },
      {
        "id": "citywide-bodega-bonay",
        "name": "Bodega Bonay",
        "coordinates": [
          41.3918,
          2.1746
        ],
        "description": "Bodega Bonay is a stylish Eixample food-and-wine room built around Catalan natural wine, anchovies, cured meats, pastas, and a social long-lunch scene without tasting-menu pricing.",
        "category": "Food",
        "venueKind": "food_drink",
        "foodServiceType": "restaurant",
        "price": "$$",
        "priceSource": "The Infatuation / TheFork",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://cdn-hhbfohb.nitrocdn.com/MWVuFFQrOubRCgucqTrIdzQgXRECTcge/assets/images/optimized/rev-41ae578/casabonay.com/wp-content/uploads/2020/12/ATP9564@antp-900x1196.jpg"
      },
      {
        "id": "citywide-la-sosenga",
        "name": "La Sosenga",
        "coordinates": [
          41.3826,
          2.1749
        ],
        "description": "La Sosenga serves seasonal Catalan cooking and regional references in a calm Gothic Quarter dining room protected from much of the old-town tourist churn.",
        "price": "$$",
        "priceSource": "Time Out / Google Maps",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-4:00 PM",
          "wed": "1:00 PM-4:00 PM",
          "thu": "1:00 PM-4:00 PM",
          "fri": "1:00 PM-4:00 PM, 8:00 PM-11:00 PM",
          "sat": "1:00 PM-4:00 PM, 8:00 PM-11:00 PM",
          "sun": "Closed"
        },
        "photo": "https://images.gestionaweb.cat/7664/pimg-1600-1600/imgi-25-506307082-18049863443578428-5950750858347318333-n.jpg"
      },
      {
        "id": "citywide-bar-la-plata",
        "name": "Bar La Plata",
        "coordinates": [
          41.3818,
          2.1799
        ],
        "description": "Bar La Plata is the cheap classic because its value is unusually clear: a short menu, fried fish, tomato salad, butifarra, house wine, and a Gothic Quarter room that has not inflated itself into a concept.",
        "price": "$",
        "priceSource": "Tripadvisor / Google Maps",
        "hours": {
          "mon": "Closed",
          "tue": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "wed": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "thu": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "fri": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "sat": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "sun": "Closed"
        },
        "photo": "https://barlaplata.com/wp-content/uploads/2025/11/ferran-nadeu4.png?w=4000&h="
      },
      {
        "id": "citywide-la-pubilla",
        "name": "La Pubilla",
        "coordinates": [
          41.4025,
          2.1534
        ],
        "description": "La Pubilla serves daily Catalan cooking beside Mercat de la Llibertat: stews, eggs, and seasonal plates in a room shared with regulars. Daytime hours make breakfast and lunch its natural services.",
        "price": "$$",
        "priceSource": "Tripadvisor / Google Maps",
        "hours": {
          "mon": "8:30 AM-4:00 PM",
          "tue": "8:30 AM-4:00 PM",
          "wed": "8:30 AM-4:00 PM",
          "thu": "8:30 AM-4:00 PM",
          "fri": "8:30 AM-4:00 PM",
          "sat": "9:00 AM-4:00 PM",
          "sun": "Closed"
        },
        "photo": "https://static3.grubbio.com/885g-albums-1.jpg"
      },
      {
        "id": "citywide-martinez",
        "name": "Martínez",
        "coordinates": [
          41.3692,
          2.1661
        ],
        "description": "Martínez is the Barcelona long-lunch splurge: seafood rice, fideuà, terrace light, and Montjuïc views over the port. It is worth crossing town for when the meal needs a setting and a slow afternoon, not just another good plate.",
        "price": "$$$",
        "priceSource": "Eater / The Infatuation",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://martinezbarcelona.com/web/wp-content/uploads/2026/04/Martinez-07482-1030x687-1.jpg"
      },
      {
        "id": "citywide-bemba",
        "name": "Bemba Smash Burger",
        "coordinates": [
          41.407,
          2.1583
        ],
        "description": "Bemba is a focused Gracia smash-burger counter offering a quick, affordable meal outside Barcelona's usual tapas, rice, and fine-dining formats.",
        "price": "$",
        "priceSource": "Eater / Instagram",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://151626694.cdn6.editmysite.com/uploads/1/5/1/6/151626694/2GGFXOEZVUBKKQX5WBXUSYAN.jpeg?width=2560&dpr=2"
      },
      {
        "id": "citywide-bar-brutal",
        "name": "Bar Brutal",
        "coordinates": [
          41.3849,
          2.1811
        ],
        "description": "Bar Brutal is a Barcelona reference point for low-intervention wine, with a deep bottle list and lively plates designed to follow what is in the glass. Dinner here is led by the wine without becoming only a tasting exercise.",
        "price": "$$",
        "priceSource": "The Infatuation / Instagram",
        "hours": {
          "mon": "7:00 PM-12:00 AM",
          "tue": "7:00 PM-12:00 AM",
          "wed": "7:00 PM-12:00 AM",
          "thu": "7:00 PM-12:00 AM",
          "fri": "1:00 PM-4:00 PM, 7:00 PM-12:30 AM",
          "sat": "1:00 PM-4:00 PM, 7:00 PM-12:30 AM",
          "sun": "1:00 PM-4:00 PM, 7:00 PM-12:00 AM"
        },
        "photo": "https://starwinelist.com/storage/images/venue/1068/980x541/jJjRFvz1ZINDUp0DlOccjrIYk9gqo3ECPdjkoI0J.jpeg?signature=4ce91f3cb49a6ba0e9fb308516d5ac673cb3a5ec8cbe2266b1a48db4940fb0d0"
      },
      {
        "id": "citywide-capet",
        "name": "Capet",
        "coordinates": [
          41.3816,
          2.1764
        ],
        "description": "Capet serves contemporary Catalan cooking in an intimate Gothic Quarter room. Reservation pace and serious food provide a quieter splurge than Barcelona's headline tasting-menu productions.",
        "price": "$$$",
        "priceSource": "MICHELIN Guide / Resy",
        "hours": {
          "mon": "Closed",
          "tue": "7:00 PM-10:30 PM",
          "wed": "7:00 PM-10:30 PM",
          "thu": "7:00 PM-10:30 PM",
          "fri": "7:00 PM-10:30 PM",
          "sat": "7:00 PM-10:30 PM",
          "sun": "Closed"
        },
        "photo": "https://static.wixstatic.com/media/fdc945_db48802f7a134b33a10cdf267cd9d7e1~mv2.jpg/v1/fill/w_640,h_1114,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/fdc945_db48802f7a134b33a10cdf267cd9d7e1~mv2.jpg"
      }
    ],
    "sources": [
      {
        "name": "Eater - Best Restaurants in Barcelona",
        "url": "https://www.eater.com/maps/best-restaurants-barcelona-spain"
      },
      {
        "name": "Eater - Old City restaurants",
        "url": "https://www.eater.com/maps/barcelona-old-city-gothic-quarter-best-restaurants"
      },
      {
        "name": "The Infatuation - Best Restaurants in Barcelona",
        "url": "https://www.theinfatuation.com/barcelona/guides/best-restaurants-hotels-barcelona"
      },
      {
        "name": "The Infatuation - Bodega Bonay",
        "url": "https://www.theinfatuation.com/barcelona/reviews/bodega-bonay"
      },
      {
        "name": "Time Out - Best restaurants in Barcelona",
        "url": "https://www.timeout.com/barcelona/restaurants/best-restaurants-in-barcelona"
      },
      {
        "name": "Time Out - Quimet i Quimet",
        "url": "https://www.timeout.com/barcelona/restaurants/quimet-i-quimet"
      },
      {
        "name": "MICHELIN Guide - Disfrutar",
        "url": "https://guide.michelin.com/us/en/catalunya/barcelona/restaurant/disfrutar"
      },
      {
        "name": "MICHELIN Guide - Capet",
        "url": "https://guide.michelin.com/us/en/catalunya/barcelona/restaurant/capet"
      },
      {
        "name": "World's 50 Best - Disfrutar",
        "url": "https://www.theworlds50best.com/discovery/Establishments/Spain/Barcelona/Disfrutar.html"
      },
      {
        "name": "Quimet & Quimet official",
        "url": "https://quimetiquimet.com/en/"
      },
      {
        "name": "Tripadvisor - Barcelona restaurants",
        "url": "https://www.tripadvisor.com/Restaurants-g187497-Barcelona_Catalonia.html"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-barcelona-citywide-tapas",
    "slug": "barcelona-citywide-tapas",
    "seoSlug": "best-tapas",
    "seoTitle": "Best Tapas in Barcelona",
    "seoDescription": "Best tapas in Barcelona, from Barceloneta classics and standing-room cava counters to Gothic taverns, vermouth bodegas, market bars, and polished small plates.",
    "title": "Old Counter Classics: Tapas & Cava",
    "description": "Barcelona tapas is less a checklist than a way of moving through the city: one counter for a bomba, another for fried fish, a glass of cava before the room fills, a vermouth bodega when Gràcia starts to loosen up.",
    "url": "https://www.google.com/maps/search/best+tapas+barcelona",
    "category": "Food",
    "location": {
      "city": "Barcelona",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-food",
      "name": "R Food",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-02T00:00:00.000Z",
    "stops": [
      {
        "id": "barcelona-tapas-la-cova-fumada",
        "name": "La Cova Fumada",
        "coordinates": [
          41.3806,
          2.1895
        ],
        "description": "La Cova Fumada is a signless Barceloneta bar with odd hours, shared tables, a blackboard menu, and the famous bomba. Go early, accept the wait, order from the board, and let the room continue what it has done since 1944: feed whoever squeezes in.",
        "price": "$",
        "priceSource": "Official site / Barcelona Food Experience",
        "officialUrl": "https://lacovafumada.com/",
        "hours": {
          "mon": "9:00 AM-3:00 PM",
          "tue": "9:00 AM-3:00 PM",
          "wed": "9:00 AM-3:00 PM",
          "thu": "9:00 AM-3:00 PM, 6:00 PM-8:00 PM",
          "fri": "9:00 AM-3:00 PM, 6:00 PM-8:00 PM",
          "sat": "9:00 AM-1:00 PM",
          "sun": "Closed"
        },
        "photo": "https://lacovafumada.com/wp-content/uploads/2019/05/la-cova-fumada-la-barceloneta.jpg"
      },
      {
        "id": "barcelona-tapas-quimet-quimet",
        "name": "Quimet & Quimet",
        "coordinates": [
          41.3738,
          2.1635
        ],
        "description": "Quimet & Quimet is a tiny standing-room Poble-sec bodega built around montaditos, conservas, smoked fish, beer, vermouth, and bottles stacked to the ceiling. Early arrival helps because the counter favors fast, focused eating over a long sit-down meal.",
        "price": "$$",
        "priceSource": "Official site / The Infatuation / Barcelona Food Experience",
        "officialUrl": "https://quimetiquimet.com/en/",
        "hours": {
          "mon": "12:00 PM-4:00 PM, 6:00 PM-10:30 PM",
          "tue": "12:00 PM-4:00 PM, 6:00 PM-10:30 PM",
          "wed": "12:00 PM-4:00 PM, 6:00 PM-10:30 PM",
          "thu": "12:00 PM-4:00 PM, 6:00 PM-10:30 PM",
          "fri": "12:00 PM-4:00 PM, 6:00 PM-10:30 PM",
          "sat": "Closed",
          "sun": "Closed"
        },
        "photo": "https://quimetiquimet.com/wp-content/uploads/tapbg.jpg"
      },
      {
        "id": "barcelona-tapas-el-xampanyet",
        "name": "El Xampanyet",
        "coordinates": [
          41.3847,
          2.1836
        ],
        "description": "El Xampanyet is a packed, tile-lined Born cava counter serving anchovies, conservas, and simple salty tapas. The short, loud room moves quickly and rarely feels like a slow meal.",
        "price": "$",
        "priceSource": "The Infatuation / Tripadvisor",
        "officialUrl": "https://www.elxampanyet.com/",
        "hours": {
          "mon": "7:00 PM-11:00 PM",
          "tue": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "wed": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "thu": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "fri": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "sat": "12:00 PM-3:30 PM",
          "sun": "Closed"
        },
        "photo": "https://www.elxampanyet.com/wp-content/uploads/2024/10/Iriarte_0117-2048x1352.jpg"
      },
      {
        "id": "barcelona-tapas-bar-la-plata",
        "name": "Bar La Plata",
        "coordinates": [
          41.3818,
          2.1799
        ],
        "description": "Bar La Plata is a Gothic Quarter corrective: four tapas, vermouth, fried fish, tomato salad, butifarra, anchovies, and not much interest in becoming anything else. Since 1945, the power here has been restraint. Drop in when the old city starts feeling too theatrical and you want a bar that wins by refusing to over-explain itself.",
        "price": "$",
        "priceSource": "Official site / Barcelona Food Experience",
        "officialUrl": "https://barlaplata.com/",
        "hours": {
          "mon": "11:00 AM-3:00 PM, 6:00 PM-11:00 PM",
          "tue": "11:00 AM-3:00 PM, 6:00 PM-11:00 PM",
          "wed": "11:00 AM-3:00 PM, 6:00 PM-11:00 PM",
          "thu": "11:00 AM-3:00 PM, 6:00 PM-11:00 PM",
          "fri": "11:00 AM-3:00 PM, 6:00 PM-11:00 PM",
          "sat": "11:00 AM-3:00 PM, 6:00 PM-11:00 PM",
          "sun": "Closed"
        },
        "photo": "https://barlaplata.com/wp-content/uploads/2025/11/ferran-nadeu4.png?w=4000&h="
      },
      {
        "id": "barcelona-tapas-can-paixano",
        "name": "Can Paixano",
        "coordinates": [
          41.3827,
          2.1831
        ],
        "description": "Can Paixano is a narrow, crowded Barceloneta counter for inexpensive cava, sandwiches, and simple tapas. The old La Xampanyeria energy is standing-room, fast-moving, and least difficult early in service.",
        "price": "$",
        "priceSource": "Official site / Barcelona Food Experience",
        "officialUrl": "https://www.canpaixano.com/",
        "photo": "https://www.canpaixano.com/content/public/collage/imagen-1630656933.3526.jpg"
      },
      {
        "id": "barcelona-tapas-el-vaso-de-oro",
        "name": "El Vaso de Oro",
        "coordinates": [
          41.3804,
          2.1891
        ],
        "description": "El Vaso de Oro is Barceloneta standing-room theater: house beer pulled with precision, cooks moving fast, and the famous solomillo with foie giving the bar its richer edge. It looks simple until you watch how tightly the room operates.",
        "price": "$$",
        "priceSource": "Official site / Barcelona Food Experience",
        "officialUrl": "https://www.vasodeoro.com/",
        "hours": {
          "default": "Daily 12:00 PM-12:00 AM. Kitchen runs continuously."
        },
        "photo": "https://www.vasodeoro.com/wp-content/uploads/go-x/u/65dfec25-755f-4d07-8ff0-f2a39a020580/image-384x576.jpg"
      },
      {
        "id": "barcelona-tapas-bar-canete",
        "name": "Bar Cañete",
        "coordinates": [
          41.3798,
          2.1736
        ],
        "description": "Bar Cañete is the Raval’s polished tapas machine, where the bar still matters but the seafood, rice, jamón, and service push it into reservation territory. It is not the cheapest or quietest stop, and that is partly the point: go when tapas should have ceremony, professional speed, and enough room energy to make the meal feel like the night’s main event.",
        "price": "$$$",
        "priceSource": "Official site / Barcelona Food Experience",
        "officialUrl": "https://barcanete.com/",
        "photo": "https://barcanete.com/wp-content/uploads/2025/12/CANETE-9-2.jpg"
      },
      {
        "id": "barcelona-tapas-bar-del-pla",
        "name": "Bar del Pla",
        "coordinates": [
          41.3857,
          2.1817
        ],
        "description": "Bar del Pla turns creative Catalan small plates into a full dinner without losing the looseness of tapas. Seasonal cooking, an attentive wine list, and a lively Born dining room make it feel current rather than preserved; reservations help at dinner.",
        "price": "$$",
        "priceSource": "The Infatuation / Google Maps",
        "officialUrl": "https://www.bardelpla.cat/",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://www.bardelpla.cat/wp-content/uploads/2023/11/BdP-31-10-23_4328-close-up-copia-2.jpg"
      },
      {
        "id": "barcelona-tapas-paco-meralgo",
        "name": "Paco Meralgo",
        "coordinates": [
          41.3915,
          2.1519
        ],
        "description": "Paco Meralgo is the Eixample tapas safety net in the best sense: polished enough for visitors, useful enough for locals, and broad enough to solve a table with mixed cravings. Croquettes, bombas, tortillas, seafood, and quick service keep it practical, especially when the city’s more romantic counters are full or too chaotic for the night you actually have.",
        "price": "$$",
        "priceSource": "Google Maps / Tripadvisor / Barcelona Food Experience",
        "officialUrl": "https://restaurantpacomeralgo.com/",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://restaurantpacomeralgo.com/wp-content/uploads/2024/05/paco4.jpg"
      },
      {
        "id": "barcelona-tapas-bodega-quimet",
        "name": "Bodega Quimet",
        "coordinates": [
          41.4029,
          2.1562
        ],
        "description": "Bodega Quimet is a Gracia tavern built around house vermouth, conservas, cheeses, anchovies, cured meats, and easy grazing. The drink may be the hook, but food is integral.",
        "price": "$$",
        "priceSource": "Official site / Google Maps / Barcelona Food Experience",
        "officialUrl": "https://www.bodegaquimet.com/",
        "hours": {
          "mon": "12:00 PM-12:30 AM",
          "tue": "12:00 PM-12:30 AM",
          "wed": "12:00 PM-12:30 AM",
          "thu": "12:00 PM-1:30 AM",
          "fri": "12:00 PM-2:00 AM",
          "sat": "12:00 PM-2:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://www.bodegaquimet.com/img-trans/productos/24272/fotos/1024-67ac8f5bebe2f-bar-bodega-quimet.png"
      },
      {
        "id": "barcelona-tapas-la-platilleria",
        "name": "La Platilleria",
        "coordinates": [
          41.3746,
          2.1658
        ],
        "description": "La Platilleria keeps Poble-sec from being reduced to one famous standing-room address. It is a kind of tapas counter that lets the neighborhood stay useful instead of turning every meal into a queue.",
        "price": "$$",
        "priceSource": "Google Maps / Tripadvisor",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "wed": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "thu": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "fri": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sat": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sun": "Closed"
        },
        "photo": "https://media-cdn.tripadvisor.com/media/photo-o/09/24/e4/7a/la-platilleria.jpg"
      }
    ],
    "sources": [
      {
        "name": "Barcelona Food Experience - Best Tapas Bars in Barcelona",
        "url": "https://www.barcelonafoodexperience.com/blog/best-tapas"
      },
      {
        "name": "The Infatuation - Best Tapas Spots in Barcelona",
        "url": "https://www.theinfatuation.com/barcelona/guides/best-tapas-spots-barcelona"
      },
      {
        "name": "Time Out - Barcelona's best tapas bars",
        "url": "https://www.timeout.com/barcelona/restaurants/barcelonas-best-tapas-bars"
      },
      {
        "name": "La Cova Fumada official",
        "url": "https://lacovafumada.com/"
      },
      {
        "name": "Bar La Plata official",
        "url": "https://barlaplata.com/"
      },
      {
        "name": "El Vaso de Oro official",
        "url": "https://www.vasodeoro.com/"
      },
      {
        "name": "Can Paixano official",
        "url": "https://www.canpaixano.com/"
      },
      {
        "name": "Bar Cañete official",
        "url": "https://barcanete.com/"
      },
      {
        "name": "Quimet & Quimet official",
        "url": "https://quimetiquimet.com/en/"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-barcelona-citywide-seafood",
    "slug": "barcelona-citywide-seafood",
    "seoSlug": "best-seafood",
    "seoTitle": "Best Seafood in Barcelona",
    "seoDescription": "Best seafood in Barcelona, from Born seafood counters and Montjuïc rice terraces to robata fish, Venetian-Catalan plates, market taverns, and polished seafood rooms.",
    "title": "Scenic Seafood",
    "description": "Cal Pep is the counter classic, Martinez gives rice and citywide panorama, and Fismuler brings a more polished, modern dining-room pace.",
    "url": "https://www.google.com/maps/search/best+seafood+barcelona",
    "category": "Food",
    "location": {
      "city": "Barcelona",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-food",
      "name": "R Food",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-02T00:00:00.000Z",
    "stops": [
      {
        "id": "barcelona-seafood-cal-pep",
        "name": "Cal Pep",
        "coordinates": [
          41.3835,
          2.1839
        ],
        "description": "Cal Pep is an El Born seafood-counter classic serving clams, squid, fried fish, and seasonal plates through kitchen-led ordering from tight seats. Prices reflect both the seafood and the fast counter performance.",
        "price": "$$$",
        "priceSource": "The Infatuation / Google Maps",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "wed": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "thu": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "fri": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sat": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sun": "Closed"
        },
        "photo": "https://lh3.googleusercontent.com/p/AF1QipMAfpnNAXVl4nrBreCG9RCwlKezMqgrs6IiObfb=s1360-w1360-h1020-rw"
      },
      {
        "id": "barcelona-seafood-martinez",
        "name": "Martínez",
        "coordinates": [
          41.3692,
          2.1661
        ],
        "description": "Martínez serves paella, fideuà, and seafood at terrace tables on a Montjuïc perch above the port. The setting does as much work as the pan, making lunch the strongest format.",
        "price": "$$$",
        "priceSource": "Eater / The Infatuation",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://martinezbarcelona.com/web/wp-content/uploads/2026/04/Martinez-07482-1030x687-1.jpg"
      },
      {
        "id": "barcelona-seafood-fismuler",
        "name": "Fismuler",
        "coordinates": [
          41.3867,
          2.1846
        ],
        "description": "Fismuler serves raw seafood, seasonal Mediterranean plates, and serious wine in a stylish Born room where dinner can stretch without becoming formal.",
        "price": "$$$",
        "priceSource": "The Infatuation / Google Maps",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/6c/5a/92/tartar-de-dorada-y-uva.jpg?w=1400&h=800&s=1"
      },
      {
        "id": "barcelona-seafood-xemei",
        "name": "Xemei",
        "coordinates": [
          41.3718,
          2.1668
        ],
        "description": "Xemei serves Adriatic seafood and pasta through Venetian flavors, lively service, and a loose Poble-sec dining room distinct from Barcelona's rice and conservas traditions.",
        "price": "$$",
        "priceSource": "Eater / El País",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "wed": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "thu": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "fri": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sat": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sun": "Closed"
        },
        "photo": "https://images.squarespace-cdn.com/content/v1/642bdd5c8f26792d3234f41f/4622d6bd-e3f6-48bf-8a20-21930382ec44/L1001642.jpg?format=1000w"
      },
      {
        "id": "barcelona-seafood-el-xampanyet",
        "name": "El Xampanyet",
        "coordinates": [
          41.3847,
          2.1836
        ],
        "description": "El Xampanyet counts here through anchovies, conservas, and cava rather than grilled fish or seafood rice. It is a salty Born seafood snack counter: fast, crowded, and better for a round than a full dinner.",
        "price": "$",
        "priceSource": "The Infatuation / Tripadvisor",
        "hours": {
          "mon": "7:00 PM-11:00 PM",
          "tue": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "wed": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "thu": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "fri": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "sat": "12:00 PM-3:30 PM",
          "sun": "Closed"
        },
        "photo": "https://www.elxampanyet.com/wp-content/uploads/2024/10/Iriarte_0117-2048x1352.jpg"
      },
      {
        "id": "barcelona-seafood-el-nacional",
        "name": "El Nacional",
        "coordinates": [
          41.3917,
          2.168
        ],
        "description": "El Nacional gathers several dining counters under one grand central roof; the seafood counter is the strongest move for shellfish and fish, while late hours and breadth absorb mixed appetites.",
        "price": "$$",
        "priceSource": "Time Out / Google Maps",
        "hours": {
          "mon": "12:00 PM-12:00 AM",
          "tue": "12:00 PM-12:00 AM",
          "wed": "12:00 PM-12:00 AM",
          "thu": "12:00 PM-12:00 AM",
          "fri": "12:00 PM-1:00 AM",
          "sat": "12:00 PM-1:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://media.timeout.com/images/100628653/image.jpg"
      },
      {
        "id": "barcelona-seafood-casa-delfin",
        "name": "Casa Delfín",
        "coordinates": [
          41.3834,
          2.1824
        ],
        "description": "Casa Delfín serves seafood tapas, rice, and vermouth in a market-adjacent Born tavern with old-neighborhood ease rather than formal dining ceremony.",
        "price": "$$",
        "priceSource": "Google Maps / Tripadvisor",
        "hours": {
          "mon": "12:00 PM-12:30 AM",
          "tue": "12:00 PM-12:30 AM",
          "wed": "12:00 PM-12:30 AM",
          "thu": "12:00 PM-1:30 AM",
          "fri": "12:00 PM-2:00 AM",
          "sat": "12:00 PM-2:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://casadelfinrestaurant.com/wp-content/uploads/2022/06/galeria-home-02.jpg",
        "foodServiceType": "restaurant",
        "cuisineTypes": [
          "tapas",
          "catalan"
        ]
      },
      {
        "id": "barcelona-seafood-cuines-santa-caterina",
        "name": "Cuines Santa Caterina",
        "coordinates": [
          41.3867,
          2.1788
        ],
        "description": "Cuines Santa Caterina is a market-side seafood and Catalan-food for groups, odd meal times, and mixed cravings under the Santa Caterina roof. It is useful, broad, central, and easier than forcing everyone into one narrow counter format.",
        "price": "$$",
        "priceSource": "The Infatuation / Google Maps",
        "hours": {
          "mon": "12:00 PM-12:00 AM",
          "tue": "12:00 PM-12:00 AM",
          "wed": "12:00 PM-12:00 AM",
          "thu": "12:00 PM-12:00 AM",
          "fri": "12:00 PM-1:00 AM",
          "sat": "12:00 PM-1:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://966e7448.delivery.rocketcdn.me/wp-content/uploads/thumb-CUINES-DE-SANTA-CATERINA.jpg",
        "foodServiceType": "restaurant",
        "cuisineTypes": [
          "tapas",
          "catalan"
        ]
      },
      {
        "id": "barcelona-seafood-la-platilleria",
        "name": "La Platilleria",
        "coordinates": [
          41.3746,
          2.1658
        ],
        "description": "La Platilleria is a warm, relaxed Poble-sec dining room centered on shareable small plates and an intimate neighborhood dinner atmosphere.",
        "price": "$$",
        "priceSource": "Google Maps / Tripadvisor",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "wed": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "thu": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "fri": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sat": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sun": "Closed"
        },
        "photo": "https://media-cdn.tripadvisor.com/media/photo-o/09/24/e4/7a/la-platilleria.jpg",
        "foodServiceType": "restaurant",
        "cuisineTypes": [
          "catalan"
        ]
      },
      {
        "id": "barcelona-seafood-bistrot-levante",
        "name": "Bistrot Levante",
        "coordinates": [
          41.3833,
          2.1769
        ],
        "description": "Bistrot Levante is the Gothic Quarter alternative to Barcelona's seafood-and-tapas staples: Eastern Mediterranean flavors, vegetable-forward plates, and a compact room that works when nearby old-city streets are packed.",
        "price": "$$",
        "priceSource": "Eater / Google Maps",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80",
        "foodServiceType": "restaurant",
        "cuisineTypes": [
          "bistro",
          "mediterranean"
        ]
      }
    ],
    "sources": [
      {
        "name": "The Infatuation - Seafood in Barcelona",
        "url": "https://www.theinfatuation.com/barcelona/cuisines/seafood"
      },
      {
        "name": "The Infatuation - Best Restaurants in Barcelona",
        "url": "https://www.theinfatuation.com/barcelona/guides/best-restaurants-hotels-barcelona"
      },
      {
        "name": "Eater - Best Restaurants in Barcelona",
        "url": "https://www.eater.com/maps/best-restaurants-barcelona-spain"
      },
      {
        "name": "Eater - Old City restaurants",
        "url": "https://www.eater.com/maps/barcelona-old-city-gothic-quarter-best-restaurants"
      },
      {
        "name": "Time Out - Best restaurants in Barcelona",
        "url": "https://www.timeout.com/barcelona/restaurants/best-restaurants-in-barcelona"
      },
      {
        "name": "Tripadvisor - Barcelona restaurants",
        "url": "https://www.tripadvisor.com/Restaurants-g187497-Barcelona_Catalonia.html"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-barcelona-citywide-catalan-food",
    "slug": "barcelona-citywide-catalan-food",
    "seoSlug": "best-catalan-food",
    "seoTitle": "Best Catalan Food in Barcelona",
    "seoDescription": "Best Catalan food in Barcelona, from old taverns and market lunches to contemporary Catalan tasting menus, polished bistros, tapas counters, and regional cooking worth booking.",
    "title": "Local Taverns & Market Bites",
    "description": "Catalan cooking can be quiet, seasonal, stubborn, and deeply satisfying when you stop chasing novelty. Bodega Bonay stretches the category just enough, letting wine, design, and familiar flavors sit at the same table.",
    "url": "https://www.google.com/maps/search/best+catalan+food+barcelona",
    "category": "Food",
    "location": {
      "city": "Barcelona",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-food",
      "name": "R Food",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-02T00:00:00.000Z",
    "stops": [
      {
        "id": "barcelona-catalan-la-sosenga",
        "name": "La Sosenga",
        "coordinates": [
          41.3826,
          2.1749
        ],
        "description": "La Sosenga is the Gothic Quarter safeguard against old-town sameness: a small Catalan room where seasonal cooking and regional references matter more than medieval-lane atmosphere.",
        "price": "$$",
        "priceSource": "Time Out / Google Maps",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-4:00 PM",
          "wed": "1:00 PM-4:00 PM",
          "thu": "1:00 PM-4:00 PM",
          "fri": "1:00 PM-4:00 PM, 8:00 PM-11:00 PM",
          "sat": "1:00 PM-4:00 PM, 8:00 PM-11:00 PM",
          "sun": "Closed"
        },
        "photo": "https://images.gestionaweb.cat/7664/pimg-1600-1600/imgi-25-506307082-18049863443578428-5950750858347318333-n.jpg"
      },
      {
        "id": "barcelona-catalan-la-pubilla",
        "name": "La Pubilla",
        "coordinates": [
          41.4025,
          2.1534
        ],
        "description": "La Pubilla serves daily Catalan cooking beside Mercat de la Llibertat: stews, eggs, and seasonal plates in a room shared with regulars. Daytime hours make breakfast and lunch its natural services.",
        "price": "$$",
        "priceSource": "Tripadvisor / Google Maps",
        "hours": {
          "mon": "8:30 AM-4:00 PM",
          "tue": "8:30 AM-4:00 PM",
          "wed": "8:30 AM-4:00 PM",
          "thu": "8:30 AM-4:00 PM",
          "fri": "8:30 AM-4:00 PM",
          "sat": "9:00 AM-4:00 PM",
          "sun": "Closed"
        },
        "photo": "https://static3.grubbio.com/885g-albums-1.jpg"
      },
      {
        "id": "barcelona-catalan-bar-la-plata",
        "name": "Bar La Plata",
        "coordinates": [
          41.3818,
          2.1799
        ],
        "description": "Bar La Plata is the cheap Catalan tavern classic: fried fish, tomato salad, butifarra, house wine, and a short menu that has stayed focused for decades. Tripadvisor and Google Maps support it as a rare Gothic Quarter room that still feels like a practical local stop.",
        "price": "$",
        "priceSource": "Tripadvisor / Google Maps",
        "hours": {
          "mon": "Closed",
          "tue": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "wed": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "thu": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "fri": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "sat": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "sun": "Closed"
        },
        "photo": "https://barlaplata.com/wp-content/uploads/2025/11/ferran-nadeu4.png?w=4000&h="
      },
      {
        "id": "barcelona-catalan-capet",
        "name": "Capet",
        "coordinates": [
          41.3816,
          2.1764
        ],
        "description": "Capet serves contemporary Catalan cooking in an intimate Gothic Quarter room. Reservation pace and serious food provide a quieter splurge than Barcelona's headline tasting-menu productions.",
        "price": "$$$",
        "priceSource": "MICHELIN Guide / Resy",
        "hours": {
          "mon": "Closed",
          "tue": "7:00 PM-10:30 PM",
          "wed": "7:00 PM-10:30 PM",
          "thu": "7:00 PM-10:30 PM",
          "fri": "7:00 PM-10:30 PM",
          "sat": "7:00 PM-10:30 PM",
          "sun": "Closed"
        },
        "photo": "https://static.wixstatic.com/media/fdc945_db48802f7a134b33a10cdf267cd9d7e1~mv2.jpg/v1/fill/w_640,h_1114,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/fdc945_db48802f7a134b33a10cdf267cd9d7e1~mv2.jpg"
      },
      {
        "id": "barcelona-catalan-bar-mut",
        "name": "Bar Mut",
        "coordinates": [
          41.3917,
          2.1554
        ],
        "description": "Bar Mut represents the polished Eixample side of Catalan eating through wine, seasonal plates, steakhouse-bistro comfort, and a classic room near Passeig de Gracia. The format favors a composed meal over a tapas crawl.",
        "price": "$$$",
        "priceSource": "The Infatuation / Google Maps",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://barmut.com/wp-content/uploads/2026/02/Txuleton-010-15102025-4672-x-7008-Bar-Mut.jpg"
      },
      {
        "id": "barcelona-catalan-paco-meralgo",
        "name": "Paco Meralgo",
        "coordinates": [
          41.3915,
          2.1519
        ],
        "description": "Paco Meralgo is a reliable mid-range tapas counter serving croquettes, bombas, seafood, tortillas, and other Catalan plates at a quick pace without fine-dining cost.",
        "price": "$$",
        "priceSource": "Google Maps / Tripadvisor",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://restaurantpacomeralgo.com/wp-content/uploads/2024/05/paco4.jpg"
      },
      {
        "id": "barcelona-catalan-bodega-bonay",
        "name": "Bodega Bonay",
        "coordinates": [
          41.3918,
          2.1746
        ],
        "description": "Bodega Bonay represents current Catalan dining through natural wine, anchovies, cured meats, pastas, and a stylish room that works for a long lunch. The Infatuation and reservation signals make it a modern food-and-wine alternative to the old taverns.",
        "category": "Food",
        "venueKind": "food_drink",
        "foodServiceType": "restaurant",
        "price": "$$",
        "priceSource": "The Infatuation / TheFork",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://cdn-hhbfohb.nitrocdn.com/MWVuFFQrOubRCgucqTrIdzQgXRECTcge/assets/images/optimized/rev-41ae578/casabonay.com/wp-content/uploads/2020/12/ATP9564@antp-900x1196.jpg"
      },
      {
        "id": "barcelona-catalan-cerveceria-catalana",
        "name": "Cervecería Catalana",
        "coordinates": [
          41.3921,
          2.1602
        ],
        "description": "Cervecería Catalana is a high-volume Eixample tapas room that still works when speed, choice, and counter energy matter. Go for montaditos, tortillas, seafood, and the busy-room rhythm when the group needs a reliable Catalan meal.",
        "price": "$$",
        "priceSource": "Google Maps / Tripadvisor",
        "hours": {
          "mon": "12:00 PM-12:00 AM",
          "tue": "12:00 PM-12:00 AM",
          "wed": "12:00 PM-12:00 AM",
          "thu": "12:00 PM-12:00 AM",
          "fri": "12:00 PM-1:00 AM",
          "sat": "12:00 PM-1:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://lh3.googleusercontent.com/p/AF1QipP14Wt5ejOwRKMNMFlYcbWhtdDHLmufLjj3SFc=s1360-w1360-h1020-rw",
        "foodServiceType": "counter_service",
        "cuisineTypes": [
          "tapas",
          "seafood",
          "catalan"
        ]
      },
      {
        "id": "barcelona-catalan-bodega-joan",
        "name": "Bodega Joan",
        "coordinates": [
          41.396,
          2.1684
        ],
        "description": "Bodega Joan is a straightforward Eixample dining room serving homestyle Catalan tapas, charcuterie, paella, sangria, and filling meals that handle groups comfortably.",
        "price": "$$",
        "priceSource": "Google Maps / Tripadvisor",
        "hours": {
          "mon": "12:00 PM-12:30 AM",
          "tue": "12:00 PM-12:30 AM",
          "wed": "12:00 PM-12:30 AM",
          "thu": "12:00 PM-1:30 AM",
          "fri": "12:00 PM-2:00 AM",
          "sat": "12:00 PM-2:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://cdn.prod.website-files.com/649bffef1ea0320a4ff37c9f/649c01ab052368397680fa21_5_b.jpg",
        "foodServiceType": "restaurant",
        "cuisineTypes": [
          "tapas",
          "catalan"
        ]
      },
      {
        "id": "barcelona-catalan-quimet-quimet",
        "name": "Quimet & Quimet",
        "coordinates": [
          41.3738,
          2.1635
        ],
        "description": "Quimet & Quimet is a tiny standing-room Poble-sec bodega built around montaditos, conservas, smoked fish, beer, vermouth, and bottles stacked to the ceiling. Early arrival helps because the counter favors fast, focused eating over a long sit-down meal.",
        "price": "$$",
        "priceSource": "Official site / Tripadvisor",
        "hours": {
          "mon": "12:00 PM-4:00 PM, 6:00 PM-10:30 PM",
          "tue": "12:00 PM-4:00 PM, 6:00 PM-10:30 PM",
          "wed": "12:00 PM-4:00 PM, 6:00 PM-10:30 PM",
          "thu": "12:00 PM-4:00 PM, 6:00 PM-10:30 PM",
          "fri": "12:00 PM-4:00 PM, 6:00 PM-10:30 PM",
          "sat": "Closed",
          "sun": "Closed"
        },
        "photo": "https://quimetiquimet.com/wp-content/uploads/tapbg.jpg",
        "foodServiceType": "counter_service",
        "cuisineTypes": [
          "street_food",
          "catalan"
        ]
      }
    ],
    "sources": [
      {
        "name": "Time Out - Best restaurants in Barcelona",
        "url": "https://www.timeout.com/barcelona/restaurants/best-restaurants-in-barcelona"
      },
      {
        "name": "Time Out - Barcelona's best tapas bars",
        "url": "https://www.timeout.com/barcelona/restaurants/barcelonas-best-tapas-bars"
      },
      {
        "name": "The Infatuation - Barcelona restaurants",
        "url": "https://www.theinfatuation.com/barcelona"
      },
      {
        "name": "The Infatuation - Best Restaurants in Barcelona",
        "url": "https://www.theinfatuation.com/barcelona/guides/best-restaurants-hotels-barcelona"
      },
      {
        "name": "MICHELIN Guide - Barcelona restaurants",
        "url": "https://guide.michelin.com/us/en/catalunya/barcelona/restaurants"
      },
      {
        "name": "Tripadvisor - Barcelona restaurants",
        "url": "https://www.tripadvisor.com/Restaurants-g187497-Barcelona_Catalonia.html"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-barcelona-citywide-fine-dining",
    "slug": "barcelona-citywide-fine-dining",
    "seoSlug": "best-fine-dining",
    "seoTitle": "Best Fine Dining in Barcelona",
    "seoDescription": "Best fine dining in Barcelona, from world-famous tasting menus and Michelin-backed rooms to chef-led Catalan dinners, seafood splurges, and polished reservations.",
    "title": "Destination Dining",
    "description": "These are the reservations that change the shape of the day around them. Bar Mut closes the loop with the kind of polished, carnivorous confidence that wants a long bottle and no rush.",
    "url": "https://www.google.com/maps/search/best+fine+dining+barcelona",
    "category": "Food",
    "location": {
      "city": "Barcelona",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-food",
      "name": "R Food",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-05-02T00:00:00.000Z",
    "stops": [
      {
        "id": "barcelona-fine-disfrutar",
        "name": "Disfrutar",
        "coordinates": [
          41.3878,
          2.1533
        ],
        "description": "Disfrutar is the fine-dining headline: technical, playful, globally recognized, and structured enough that the booking shapes the day. The cost and reservation effort are part of what makes it an occasion meal.",
        "price": "$$$",
        "priceSource": "MICHELIN Guide / World's 50 Best",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-2:15 PM, 8:00 PM-9:15 PM",
          "wed": "1:00 PM-2:15 PM, 8:00 PM-9:15 PM",
          "thu": "1:00 PM-2:15 PM, 8:00 PM-9:15 PM",
          "fri": "1:00 PM-2:15 PM, 8:00 PM-9:15 PM",
          "sat": "1:00 PM-2:15 PM, 8:00 PM-9:15 PM",
          "sun": "Closed"
        },
        "photo": "https://www.disfrutarbarcelona.com/api/uploads/restaurant/slider/images/original/cd60e682ef18d378de9e38ab983d2f2b_phpup3Axy.jpg"
      },
      {
        "id": "barcelona-fine-capet",
        "name": "Capet",
        "coordinates": [
          41.3816,
          2.1764
        ],
        "description": "Capet serves contemporary Catalan cooking in an intimate Gothic Quarter room. Reservation pace and serious food provide a quieter splurge than Barcelona's headline tasting-menu productions.",
        "price": "$$$",
        "priceSource": "MICHELIN Guide / Resy",
        "hours": {
          "mon": "Closed",
          "tue": "7:00 PM-10:30 PM",
          "wed": "7:00 PM-10:30 PM",
          "thu": "7:00 PM-10:30 PM",
          "fri": "7:00 PM-10:30 PM",
          "sat": "7:00 PM-10:30 PM",
          "sun": "Closed"
        },
        "photo": "https://static.wixstatic.com/media/fdc945_db48802f7a134b33a10cdf267cd9d7e1~mv2.jpg/v1/fill/w_640,h_1114,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/fdc945_db48802f7a134b33a10cdf267cd9d7e1~mv2.jpg"
      },
      {
        "id": "barcelona-fine-con-gracia",
        "name": "Con Gracia",
        "coordinates": [
          41.3979,
          2.1599
        ],
        "description": "Con Gracia is a fine-dining restaurant for a quieter night in Gràcia: tasting-menu pace, wine pairing, and a room that feels personal rather than grand. It is useful when the occasion calls for polish but not the city’s biggest-name reservations.",
        "price": "$$$",
        "priceSource": "Time Out / Google Maps",
        "hours": {
          "mon": "Closed",
          "tue": "7:00 PM-10:30 PM",
          "wed": "7:00 PM-10:30 PM",
          "thu": "7:00 PM-10:30 PM",
          "fri": "7:00 PM-10:30 PM",
          "sat": "7:00 PM-10:30 PM",
          "sun": "Closed"
        },
        "photo": "https://congraciarestaurant.com/wp-content/uploads/2024/05/nuestros_menus_1-1.jpg"
      },
      {
        "id": "barcelona-fine-martinez",
        "name": "Martínez",
        "coordinates": [
          41.3692,
          2.1661
        ],
        "description": "Martínez sits in fine dining as a seafood-rice splurge rather than a tasting menu: the terrace, view, and long-lunch pace are part of the bill. It is occasion dining for a sunny afternoon above the port.",
        "price": "$$$",
        "priceSource": "Eater / The Infatuation",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://martinezbarcelona.com/web/wp-content/uploads/2026/04/Martinez-07482-1030x687-1.jpg"
      },
      {
        "id": "barcelona-fine-cal-pep",
        "name": "Cal Pep",
        "coordinates": [
          41.3835,
          2.1839
        ],
        "description": "Cal Pep qualifies as a splurge because the counter is treated like a performance: seafood, pace, proximity to the kitchen, and the feeling that the meal is being steered in real time. Go for the experience, not quiet luxury.",
        "price": "$$$",
        "priceSource": "The Infatuation / Google Maps",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "wed": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "thu": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "fri": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sat": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sun": "Closed"
        },
        "photo": "https://lh3.googleusercontent.com/p/AF1QipMAfpnNAXVl4nrBreCG9RCwlKezMqgrs6IiObfb=s1360-w1360-h1020-rw"
      },
      {
        "id": "barcelona-fine-bar-mut",
        "name": "Bar Mut",
        "coordinates": [
          41.3917,
          2.1554
        ],
        "description": "Bar Mut is a fine-dining list’s classic bistro, with wine, seasonal Catalan plates, and Eixample polish in place of tasting-menu choreography. It is expensive and grown-up without being ceremonial.",
        "price": "$$$",
        "priceSource": "The Infatuation / Google Maps",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://barmut.com/wp-content/uploads/2026/02/Txuleton-010-15102025-4672-x-7008-Bar-Mut.jpg"
      },
      {
        "id": "barcelona-fine-fismuler",
        "name": "Fismuler",
        "coordinates": [
          41.3867,
          2.1846
        ],
        "description": "Fismuler serves seasonal Mediterranean cooking, raw seafood, and serious wine in a stylish Born room that feels special without tasting-menu formality.",
        "price": "$$$",
        "priceSource": "The Infatuation / Google Maps",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/6c/5a/92/tartar-de-dorada-y-uva.jpg?w=1400&h=800&s=1",
        "foodServiceType": "restaurant",
        "cuisineTypes": [
          "fine_dining",
          "seafood",
          "mediterranean"
        ]
      },
      {
        "id": "barcelona-fine-bodega-bonay",
        "name": "Bodega Bonay",
        "coordinates": [
          41.3918,
          2.1746
        ],
        "description": "Bodega Bonay is a modern Eixample food-and-wine room serving natural wine, anchovies, cured meats, and pastas without the formality or price of a tasting-menu splurge.",
        "category": "Food",
        "venueKind": "food_drink",
        "foodServiceType": "restaurant",
        "price": "$$",
        "priceSource": "The Infatuation / Resy",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://cdn-hhbfohb.nitrocdn.com/MWVuFFQrOubRCgucqTrIdzQgXRECTcge/assets/images/optimized/rev-41ae578/casabonay.com/wp-content/uploads/2020/12/ATP9564@antp-900x1196.jpg",
        "cuisineTypes": [
          "fine_dining",
          "bistro",
          "catalan"
        ]
      },
      {
        "id": "barcelona-fine-sensi-bistro",
        "name": "Sensi Bistro",
        "coordinates": [
          41.3803,
          2.1771
        ],
        "description": "Sensi Bistro serves composed creative tapas and sharing plates in a polished Gothic Quarter dining room. The accessible format handles groups without sacrificing novelty.",
        "price": "$$",
        "priceSource": "Tripadvisor / Google Maps",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://sensi.es/bistro/core/uploads/2022/12/events.jpg",
        "foodServiceType": "restaurant",
        "cuisineTypes": [
          "tapas",
          "bistro"
        ]
      },
      {
        "id": "barcelona-fine-xemei",
        "name": "Xemei",
        "coordinates": [
          41.3718,
          2.1668
        ],
        "description": "Xemei adds a Poble-sec change of register to the destination list: Venetian-Adriatic seafood, handmade pasta, offbeat Italian bottles, and a lively dining room that still feels specific to Barcelona.",
        "price": "$$",
        "priceSource": "Eater / El País",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "wed": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "thu": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "fri": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sat": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sun": "Closed"
        },
        "photo": "https://images.squarespace-cdn.com/content/v1/642bdd5c8f26792d3234f41f/4622d6bd-e3f6-48bf-8a20-21930382ec44/L1001642.jpg?format=1000w",
        "foodServiceType": "restaurant",
        "cuisineTypes": [
          "fine_dining",
          "seafood",
          "italian"
        ]
      }
    ],
    "sources": [
      {
        "name": "The Infatuation - Fine Dining in Barcelona",
        "url": "https://www.theinfatuation.com/barcelona/perfect-for/fine-dining"
      },
      {
        "name": "The Infatuation - Best Restaurants in Barcelona",
        "url": "https://www.theinfatuation.com/barcelona/guides/best-restaurants-hotels-barcelona"
      },
      {
        "name": "MICHELIN Guide - Barcelona restaurants",
        "url": "https://guide.michelin.com/us/en/catalunya/barcelona/restaurants"
      },
      {
        "name": "MICHELIN Guide - Disfrutar",
        "url": "https://guide.michelin.com/us/en/catalunya/barcelona/restaurant/disfrutar"
      },
      {
        "name": "MICHELIN Guide - Capet",
        "url": "https://guide.michelin.com/us/en/catalunya/barcelona/restaurant/capet"
      },
      {
        "name": "World's 50 Best - Disfrutar",
        "url": "https://www.theworlds50best.com/discovery/Establishments/Spain/Barcelona/Disfrutar.html"
      },
      {
        "name": "Time Out - Best restaurants in Barcelona",
        "url": "https://www.timeout.com/barcelona/restaurants/best-restaurants-in-barcelona"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-barcelona-gothic-quarter-culture",
    "slug": "barcelona-gothic-quarter-culture",
    "seoSlug": "best-museums-and-cultural-stops",
    "seoTitle": "Best Museums and Cultural Stops in the Gothic Quarter, Barcelona",
    "seoDescription": "Best museums and cultural stops in the Gothic Quarter, Barcelona, including Roman Barcino layers, cathedral streets, civic landmarks, and historic squares.",
    "title": "Roman Stones and Cathedral Shadows",
    "description": "The Gothic Quarter is best read through its Roman foundations, medieval religious architecture, civic institutions, and scarred public squares. The strongest stops explain how power and daily life accumulated inside streets that are too often treated as scenery.",
    "url": "https://www.google.com/maps/search/gothic+quarter+culture+barcelona",
    "category": "Culture",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Gothic Quarter",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-culture",
      "name": "R Culture",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "gothic-barcelona-cathedral",
        "name": "Barcelona Cathedral",
        "coordinates": [
          41.3839,
          2.1762
        ],
        "description": "Barcelona Cathedral gathers a Gothic nave, carved choir, rooftop views, and a cloister known for its resident geese inside the medieval street pattern. The surrounding square shows how religious architecture organized the old city as clearly as the building itself.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://upload.wikimedia.org/wikipedia/commons/6/63/Barcelona_Cathedral_Saint_Eulalia.jpg"
      },
      {
        "id": "gothic-muhba-placa-del-rei",
        "name": "MUHBA Plaça del Rei",
        "coordinates": [
          41.3845,
          2.1777
        ],
        "description": "MUHBA Placa del Rei layers the streets and workshops of Roman Barcino beneath the palace architecture of medieval Barcelona.",
        "hours": {
          "mon": "Closed",
          "tue": "10:00 AM-7:00 PM",
          "wed": "10:00 AM-7:00 PM",
          "thu": "10:00 AM-7:00 PM",
          "fri": "10:00 AM-7:00 PM",
          "sat": "10:00 AM-7:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://upload.wikimedia.org/wikipedia/commons/b/be/MUHBA_Casa_Padellas_Pla%C3%A7a_del_rei_2.JPG"
      },
      {
        "id": "gothic-temple-august",
        "name": "Temple of Augustus",
        "coordinates": [
          41.3842,
          2.1776
        ],
        "description": "The Temple of Augustus preserves four monumental Roman columns inside a medieval Gothic Quarter courtyard. The small, quiet site makes Barcelona's buried Roman city visible beneath the surrounding lanes.",
        "hours": {
          "mon": "Closed",
          "tue": "10:00 AM-7:00 PM",
          "wed": "10:00 AM-7:00 PM",
          "thu": "10:00 AM-7:00 PM",
          "fri": "10:00 AM-7:00 PM",
          "sat": "10:00 AM-7:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://irbarcelona.org/wp-content/uploads/2013/06/columnas-temploaugusto.jpg"
      },
      {
        "id": "gothic-placa-sant-felip-neri",
        "name": "Plaça de Sant Felip Neri",
        "coordinates": [
          41.3834,
          2.1752
        ],
        "description": "Plaça de Sant Felip Neri combines Baroque stonework, schoolyard quiet, and visible Civil War damage in one of the Gothic Quarter's most emotionally charged squares. The scars on the church facade resist the old city's prettier postcard reading.",
        "hours": {
          "mon": "Open public space",
          "tue": "Open public space",
          "wed": "Open public space",
          "thu": "Open public space",
          "fri": "Open public space",
          "sat": "Open public space",
          "sun": "Open public space"
        },
        "photo": "https://www.nomads-travel-guide.com/wp-content/uploads/2026/01/San_Felip_Neri_Square_in_Barcelona-scaled.jpg"
      },
      {
        "id": "gothic-palau-generalitat",
        "name": "Palau de la Generalitat",
        "coordinates": [
          41.3829,
          2.1771
        ],
        "description": "Palau de la Generalitat is the historic and current seat of Catalonia's government, with Gothic and Renaissance architecture facing Plaça de Sant Jaume. Exterior views connect the old city's ceremonial core to present-day Catalan political life; interior access follows limited guided schedules.",
        "hours": {
          "mon": "Exterior viewing; guided visits by schedule",
          "tue": "Exterior viewing; guided visits by schedule",
          "wed": "Exterior viewing; guided visits by schedule",
          "thu": "Exterior viewing; guided visits by schedule",
          "fri": "Exterior viewing; guided visits by schedule",
          "sat": "Exterior viewing; guided visits by schedule",
          "sun": "Exterior viewing; guided visits by schedule"
        },
        "photo": "https://irbarcelona.org/wp-content/uploads/2012/08/palau-generalitat-cat.jpg"
      }
    ],
    "sources": [
      {
        "name": "Barcelona Turisme - Gothic Quarter",
        "url": "https://www.barcelonaturisme.com"
      },
      {
        "name": "MUHBA official",
        "url": "https://www.barcelona.cat/museuhistoria/"
      },
      {
        "name": "Barcelona Cathedral official",
        "url": "https://catedralbcn.org"
      },
      {
        "name": "Time Out - Barcelona things to do",
        "url": "https://www.timeout.com/barcelona/things-to-do/best-things-to-do-in-barcelona"
      }
    ]
  },
  {
    "id": "list-barcelona-el-born-culture",
    "slug": "barcelona-el-born-culture",
    "seoSlug": "best-museums-and-cultural-stops",
    "seoTitle": "Best Museums and Cultural Stops in El Born, Barcelona",
    "seoDescription": "Best museums and cultural stops in El Born, Barcelona, from the Picasso Museum and Santa Maria del Mar to medieval memory sites and Modernista music rooms.",
    "title": "Picasso, Markets, and Memory",
    "description": "El Born compresses art, archaeology, Gothic religious architecture, merchant wealth, music, and contemporary spectacle into a few old-city streets. Medieval fabric and excavated memory keep its cultural institutions tied to the neighborhood around them.",
    "url": "https://www.google.com/maps/search/el+born+culture+barcelona",
    "category": "Culture",
    "location": {
      "city": "Barcelona",
      "neighborhood": "El Born",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-culture",
      "name": "R Culture",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "born-picasso-museum",
        "name": "Museu Picasso",
        "coordinates": [
          41.3853,
          2.1815
        ],
        "description": "Museu Picasso is El Born's essential museum because official collection material and city guides emphasize Picasso's formative Barcelona years. The five medieval palaces are part of the experience, and the strongest reason to go is the depth of early work, Blue Period context, and the Las Meninas series rather than a greatest-hits survey.",
        "hours": {
          "mon": "Closed",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-9:00 PM",
          "fri": "9:00 AM-9:00 PM",
          "sat": "9:00 AM-9:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5531-4970-imagenCAT/museu_picasso_barcelona_c1.jpg"
      },
      {
        "id": "born-santa-maria-del-mar",
        "name": "Basílica de Santa Maria del Mar",
        "coordinates": [
          41.3839,
          2.1822
        ],
        "description": "Santa Maria del Mar grew from El Born's Ribera guild community and presents Catalan Gothic architecture through clean proportions and a soaring stone interior. The basilica gives medieval merchant history an architectural form.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5445-7517-Imagen/santa-maria-mar-barcelona-pf-c1.jpg"
      },
      {
        "id": "born-ccm",
        "name": "El Born Centre de Cultura i Memòria",
        "coordinates": [
          41.3867,
          2.1833
        ],
        "description": "El Born Centre de Cultura i Memoria combines a preserved market hall with an archaeological memory site. Exposed 1700s streets make the consequences of 1714 and the neighborhood's transformation more tangible than a standard museum panel.",
        "hours": {
          "mon": "Closed",
          "tue": "10:00 AM-7:00 PM",
          "wed": "10:00 AM-7:00 PM",
          "thu": "10:00 AM-7:00 PM",
          "fri": "10:00 AM-7:00 PM",
          "sat": "10:00 AM-7:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://www.barcelona-metropolitan.com/downloads/37961/download/el-born-centre-de-cultura-i-memoria-photo-by-Vicente-Zambrano-Gonz%C3%A1lez-courtesy-of-Ajuntament-de-Barcelona-%28CC-BY-NC-ND-4.0%29.jpg?cb=0747d8202a148486c74fbadacb5ddad5&w=1200"
      },
      {
        "id": "born-palau-musica",
        "name": "Palau de la Música Catalana",
        "coordinates": [
          41.3876,
          2.1753
        ],
        "description": "Palau de la Musica Catalana is one of Barcelona's great Modernista interiors, with a stained-glass skylight, ceramic columns, sculptural facade, and an active concert program. Tours and performances reveal far more than the exterior alone.",
        "hours": {
          "mon": "9:00 AM-9:00 PM",
          "tue": "9:00 AM-9:00 PM",
          "wed": "9:00 AM-9:00 PM",
          "thu": "9:00 AM-9:00 PM",
          "fri": "9:00 AM-9:00 PM",
          "sat": "9:00 AM-9:00 PM",
          "sun": "9:00 AM-3:30 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5445-7519-Imagen/Palau_Musica_Catalana_Transparent_c1.jpg"
      },
      {
        "id": "born-moco-museum",
        "name": "Moco Museum Barcelona",
        "coordinates": [
          41.3852,
          2.181
        ],
        "description": "Moco Museum presents street art, immersive installations, and recognizable modern and contemporary names in an accessible El Born format. Its emphasis is visual immediacy rather than civic history or deep collection scholarship.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://www.mocomuseum.com/app/uploads/2025/12/FullSizeRender-scaled.jpg"
      }
    ],
    "sources": [
      {
        "name": "Museu Picasso official",
        "url": "https://museupicassobcn.cat"
      },
      {
        "name": "Palau de la Música Catalana official",
        "url": "https://www.palaumusica.cat"
      },
      {
        "name": "El Born CCM official",
        "url": "https://elbornculturaimemoria.barcelona.cat"
      },
      {
        "name": "Barcelona Turisme",
        "url": "https://www.barcelonaturisme.com"
      }
    ]
  },
  {
    "id": "list-barcelona-eixample-culture",
    "slug": "barcelona-eixample-culture",
    "seoSlug": "best-museums-and-cultural-stops",
    "seoTitle": "Best Museums and Cultural Stops in Eixample, Barcelona",
    "seoDescription": "Best museums and cultural stops in Eixample, Barcelona, focused on Gaudi houses, Sagrada Familia, Modernista architecture, and design landmarks across the grid.",
    "title": "Modernisme Power Walk",
    "description": "Eixample turns its rational street grid into a showcase for Modernisme: carved stone, colored tile, ironwork, domestic interiors, and religious architecture at radically different scales. Gaudi dominates, but his contemporaries and later modern art give the district depth.",
    "url": "https://www.google.com/maps/search/eixample+culture+barcelona",
    "category": "Culture",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Eixample",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-culture",
      "name": "R Culture",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "eixample-sagrada-familia",
        "name": "Sagrada Família",
        "coordinates": [
          41.4036,
          2.1744
        ],
        "description": "Sagrada Família is the Eixample landmark every source converges on: official material, UNESCO context, and visitor guides all frame it as Gaudí's unfinished masterwork. The reason to list it is the interior experience as much as the facade: branching columns, colored glass, symbolic towers, and the visible story of construction still unfolding.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5445-18893-Imagen/Sagrada_Familia_Unesco_Transparent_c1.jpg"
      },
      {
        "id": "eixample-casa-batllo",
        "name": "Casa Batlló",
        "coordinates": [
          41.3917,
          2.1649
        ],
        "description": "Casa Batllo shows Gaudi turning a private house into a total artwork through its tiled facade, bone-like structure, light well, and restless roofline. The interior interpretation carries the experience beyond an exterior photograph on Passeig de Gracia.",
        "hours": {
          "mon": "9:00 AM-10:00 PM",
          "tue": "9:00 AM-10:00 PM",
          "wed": "9:00 AM-10:00 PM",
          "thu": "9:00 AM-10:00 PM",
          "fri": "9:00 AM-10:00 PM",
          "sat": "9:00 AM-10:00 PM",
          "sun": "9:00 AM-10:00 PM"
        },
        "photo": "https://casa-batllo-barcelona.com/wp-content/uploads/2026/01/19944e616eb84ad3b204463508875f98.jpeg"
      },
      {
        "id": "eixample-la-pedrera",
        "name": "Casa Milà / La Pedrera",
        "coordinates": [
          41.3954,
          2.1619
        ],
        "description": "Casa Milà / La Pedrera turns Gaudí's ideas about movement and natural form into an inhabited Eixample building. Its undulating stone facade, catenary-arched attic, apartment interiors, courtyards, and sculptural rooftop chimneys reveal how the architecture works beyond the street view.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://estatics-nasia.dtibcn.cat/nasia-pro/media/2015%2C05%2C1-2-2-2-8-DISE-La-Pedrera-29-4-9-AL-01-760x428.jpg"
      },
      {
        "id": "eixample-fundacio-tapies",
        "name": "Fundació Antoni Tàpies",
        "coordinates": [
          41.391,
          2.163
        ],
        "description": "Fundacio Antoni Tapies pairs the Catalan artist's textured, material-heavy work with a Modernista industrial building and distinctive rooftop sculpture. The focused collection adds modern art to Eixample beyond Gaudi.",
        "hours": {
          "mon": "Closed",
          "tue": "10:00 AM-7:00 PM",
          "wed": "10:00 AM-7:00 PM",
          "thu": "10:00 AM-7:00 PM",
          "fri": "10:00 AM-7:00 PM",
          "sat": "10:00 AM-7:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5531-4957-imagenCAT/Fundacio_Tapies_2023_c2.jpg"
      },
      {
        "id": "eixample-casa-amatller",
        "name": "Casa Amatller",
        "coordinates": [
          41.3915,
          2.165
        ],
        "description": "Casa Amatller is a useful corrective to Gaudí-only Eixample journeys. Official and tourism sources position Puig i Cadafalch's house as a key part of the Block of Discord, with stepped gables, decorative craft, and chocolate-family history that help explain the competitive Modernista energy of Passeig de Gràcia.",
        "hours": {
          "mon": "10:00 AM-7:00 PM",
          "tue": "10:00 AM-7:00 PM",
          "wed": "10:00 AM-7:00 PM",
          "thu": "10:00 AM-7:00 PM",
          "fri": "10:00 AM-7:00 PM",
          "sat": "10:00 AM-7:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5445-7539-Imagen/casa-ametller-eixample-barcelona-pf-c1.jpg"
      }
    ],
    "sources": [
      {
        "name": "Sagrada Família official",
        "url": "https://sagradafamilia.org"
      },
      {
        "name": "Casa Batlló official",
        "url": "https://www.casabatllo.es"
      },
      {
        "name": "La Pedrera official",
        "url": "https://www.lapedrera.com"
      },
      {
        "name": "UNESCO - Works of Antoni Gaudí",
        "url": "https://whc.unesco.org/en/list/320"
      }
    ]
  },
  {
    "id": "list-barcelona-gracia-culture",
    "slug": "barcelona-gracia-culture",
    "seoSlug": "best-museums-and-cultural-stops",
    "seoTitle": "Best Museums and Cultural Stops in Gràcia, Barcelona",
    "seoDescription": "Best museums and cultural stops in Gràcia, Barcelona, balancing Park Guell and Casa Vicens with plazas, cinemas, markets, and neighborhood public life.",
    "title": "Gaudí Beginnings and Plaza Life",
    "description": "Gracia loosens Barcelona's monumental scale through plazas, market errands, benches, early Gaudi architecture, and ordinary neighborhood life around the landmarks.",
    "url": "https://www.google.com/maps/search/gracia+culture+barcelona",
    "category": "Culture",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Gràcia",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-culture",
      "name": "R Culture",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "gracia-park-guell-culture",
        "name": "Park Güell",
        "coordinates": [
          41.4145,
          2.1527
        ],
        "description": "Park Güell is listed through both official and UNESCO context because it turns Gràcia's hillside into Gaudí's large-scale urban experiment. The mosaic terrace, viaducts, gatehouses, serpentine bench, and city views make it a cultural stop, not just a park, especially when paired with the neighborhood below.",
        "hours": {
          "mon": "9:30 AM-7:30 PM",
          "tue": "9:30 AM-7:30 PM",
          "wed": "9:30 AM-7:30 PM",
          "thu": "9:30 AM-7:30 PM",
          "fri": "9:30 AM-7:30 PM",
          "sat": "9:30 AM-7:30 PM",
          "sun": "9:30 AM-7:30 PM"
        },
        "photo": "https://parkguell.barcelona/sites/default/files/2023-02/01_Benvinguts_al_Parc_Guell_v2_2.jpg"
      },
      {
        "id": "gracia-casa-vicens",
        "name": "Casa Vicens",
        "coordinates": [
          41.4035,
          2.1507
        ],
        "description": "Casa Vicens was Gaudi's first major house and an early statement of the color, ornament, and architectural imagination that would define his work.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://casa-vicens-barcelona.com/wp-content/uploads/2026/01/9528674f03c44fe0b5fad6f5a055e924-1.jpg"
      },
      {
        "id": "gracia-cines-verdi",
        "name": "Cines Verdi",
        "coordinates": [
          41.4033,
          2.1564
        ],
        "description": "Cines Verdi represents Gràcia's everyday cultural life rather than a monument. Local guides and neighborhood knowledge support it as a long-running original-language cinema, useful for festival programming, independent films, and understanding why Gràcia still feels like a lived-in village instead of only a sightseeing zone.",
        "hours": {
          "mon": "Showtimes vary",
          "tue": "Showtimes vary",
          "wed": "Showtimes vary",
          "thu": "Showtimes vary",
          "fri": "Showtimes vary",
          "sat": "Showtimes vary",
          "sun": "Showtimes vary"
        },
        "photo": "https://barcelona.cines-verdi.com/storage/app/media/salas/sala1.jpg"
      },
      {
        "id": "gracia-placa-del-sol",
        "name": "Plaça del Sol",
        "coordinates": [
          41.401,
          2.1574
        ],
        "description": "Placa del Sol is one of Gracia's clearest social stages, filled with terraces, evening gatherings, musicians, and local routines. Observation explains the district's village identity better than a formal attraction would.",
        "hours": {
          "mon": "Open public space",
          "tue": "Open public space",
          "wed": "Open public space",
          "thu": "Open public space",
          "fri": "Open public space",
          "sat": "Open public space",
          "sun": "Open public space"
        },
        "photo": "https://estatics-nasia.dtibcn.cat/nasia-pro/media/201601PlaC3A7a-del-Sol-1-web.optimized.948b1120.jpg"
      },
      {
        "id": "gracia-mercat-llibertat",
        "name": "Mercat de la Llibertat",
        "coordinates": [
          41.4002,
          2.1532
        ],
        "description": "Mercat de la Llibertat is a restored 19th-century Gracia market hall where food stalls, produce, meat, fish, and everyday neighborhood shopping remain the main attraction.",
        "hours": {
          "mon": "8:00 AM-2:00 PM",
          "tue": "8:00 AM-8:00 PM",
          "wed": "8:00 AM-2:00 PM",
          "thu": "8:00 AM-8:00 PM",
          "fri": "8:00 AM-8:00 PM",
          "sat": "8:00 AM-3:00 PM",
          "sun": "Closed"
        },
        "photo": "https://fishhotels-sites.s3.eu-west-3.amazonaws.com/uploads/abd3aef8-30d4-48d4-9244-4e801c1a130c/originals/mercat-de-la-llibertat003.jpg"
      }
    ],
    "sources": [
      {
        "name": "Park Güell official",
        "url": "https://parkguell.barcelona"
      },
      {
        "name": "Casa Vicens official",
        "url": "https://casavicens.org"
      },
      {
        "name": "Time Out - Gràcia guide",
        "url": "https://www.timeout.com/barcelona/things-to-do/gracia"
      },
      {
        "name": "Barcelona Turisme",
        "url": "https://www.barcelonaturisme.com"
      }
    ]
  },
  {
    "id": "list-barcelona-poble-sec-culture",
    "slug": "barcelona-poble-sec-culture",
    "seoSlug": "best-museums-and-cultural-stops",
    "seoTitle": "Best Museums and Cultural Stops in Poble-sec, Barcelona",
    "seoDescription": "Best museums and cultural stops in Poble-sec and Montjuic, Barcelona, including MNAC, Fundacio Joan Miro, CaixaForum, hilltop history, and performance spaces.",
    "title": "Montjuïc Museum Day",
    "description": "Montjuic turns culture into a climb through Catalan art, Miro, industrial architecture, military history, open-air performance, and broad city views. The hill's institutions feel connected to the landscape rather than sealed into a conventional museum district.",
    "url": "https://www.google.com/maps/search/poble+sec+montjuic+culture+barcelona",
    "category": "Culture",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Poble-sec",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-culture",
      "name": "R Culture",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "poblesec-mnac",
        "name": "MNAC",
        "coordinates": [
          41.3688,
          2.1536
        ],
        "description": "MNAC presents Catalan visual culture at scale inside the Palau Nacional, from exceptional Romanesque mural paintings and Gothic work to modernisme and photography. Terraces above the museum open broad views across the city.",
        "hours": {
          "mon": "Closed",
          "tue": "10:00 AM-8:00 PM",
          "wed": "10:00 AM-8:00 PM",
          "thu": "10:00 AM-8:00 PM",
          "fri": "10:00 AM-8:00 PM",
          "sat": "10:00 AM-8:00 PM",
          "sun": "10:00 AM-3:00 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5531-4863-imagenCAT/Museu_Art_Nacional_Catalunya_Barcelona_c1.jpg"
      },
      {
        "id": "poblesec-fundacio-joan-miro",
        "name": "Fundació Joan Miró",
        "coordinates": [
          41.3686,
          2.1592
        ],
        "description": "Fundacio Joan Miro combines a Sert-designed museum, sculpture terraces, works on paper, and the artist's unmistakable color language. Its focused collection is calmer and more concentrated than MNAC's encyclopedic scale.",
        "hours": {
          "mon": "Closed",
          "tue": "10:00 AM-7:00 PM",
          "wed": "10:00 AM-7:00 PM",
          "thu": "10:00 AM-7:00 PM",
          "fri": "10:00 AM-7:00 PM",
          "sat": "10:00 AM-7:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5531-4959-imagenCAT/tickets-for-fundacio-miro-museum-barcelona-c.jpg"
      },
      {
        "id": "poblesec-caixaforum",
        "name": "CaixaForum Barcelona",
        "coordinates": [
          41.3717,
          2.1491
        ],
        "description": "CaixaForum Barcelona occupies a converted Modernista textile factory near Placa d'Espanya. Industrial architecture and rotating exhibitions create a flexible cultural visit without the scale of a large permanent collection.",
        "hours": {
          "mon": "10:00 AM-7:00 PM",
          "tue": "10:00 AM-7:00 PM",
          "wed": "10:00 AM-7:00 PM",
          "thu": "10:00 AM-7:00 PM",
          "fri": "10:00 AM-7:00 PM",
          "sat": "10:00 AM-7:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5531-4951-imagenCAT/tickets-for-caixa-forum-barcelona-T24c.jpg"
      },
      {
        "id": "poblesec-montjuic-castle",
        "name": "Montjuïc Castle",
        "coordinates": [
          41.3634,
          2.1661
        ],
        "description": "Montjuic Castle combines broad city and harbor views with layered military, prison, and civic history at the top of the hill.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5445-7616-Imagen/castillo-montjuic-barcelona-pf-c1.jpg"
      },
      {
        "id": "poblesec-poble-espanyol",
        "name": "Poble Espanyol",
        "coordinates": [
          41.3687,
          2.1475
        ],
        "description": "Poble Espanyol is a 1929 exhibition-era site that sources frame as an open-air survey of Spanish regional architecture and craft. It is not a normal village, and that is the point: the value is workshops, event programming, plazas, and a compact, staged look at architectural styles from across Spain.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://cdn.getyourguide.com/img/tour/cc7791c0d9865ff9.jpeg/68.jpg"
      },
      {
        "id": "poblesec-teatre-grec",
        "name": "Teatre Grec",
        "coordinates": [
          41.3704,
          2.1598
        ],
        "description": "Teatre Grec is an open-air amphitheater built into a former Montjuic quarry and central to Barcelona's summer festival culture. Programmed performances show the space at full purpose, while the surrounding gardens remain accessible by day.",
        "hours": {
          "mon": "Open public gardens; performances by schedule",
          "tue": "Open public gardens; performances by schedule",
          "wed": "Open public gardens; performances by schedule",
          "thu": "Open public gardens; performances by schedule",
          "fri": "Open public gardens; performances by schedule",
          "sat": "Open public gardens; performances by schedule",
          "sun": "Open public gardens; performances by schedule"
        },
        "photo": "https://www.teatrebarcelona.com/wp-content/uploads/2020/04/teatre_grec-scaled.jpg"
      }
    ],
    "sources": [
      {
        "name": "MNAC official",
        "url": "https://www.museunacional.cat"
      },
      {
        "name": "Fundació Joan Miró official",
        "url": "https://www.fmirobcn.org"
      },
      {
        "name": "CaixaForum Barcelona",
        "url": "https://caixaforum.org"
      },
      {
        "name": "Barcelona Turisme - Montjuïc",
        "url": "https://www.barcelonaturisme.com"
      }
    ]
  },
  {
    "id": "list-barcelona-gothic-quarter-stays",
    "slug": "barcelona-gothic-quarter-stays",
    "seoSlug": "best-places-to-stay",
    "seoTitle": "Best Places to Stay in the Gothic Quarter, Barcelona",
    "seoDescription": "Best places to stay in the Gothic Quarter, Barcelona, for old-city hotels, boutique stays, cathedral access, and walkable historic lanes.",
    "title": "Sleep in the Old City",
    "description": "Sleeping in the Gothic Quarter is a bargain with the city: you get the old lanes at your door, and you accept the noise, the tourists, and the late-night churn. Hotel Neri and Mercer make the romance feel grown-up, while Kimpton Vividora and H10 Madison give the base more modern ease.",
    "url": "https://www.google.com/maps/search/gothic+quarter+hotels+barcelona",
    "category": "Stay",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Gothic Quarter",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "gothic-hotel-neri",
        "name": "Hotel Neri",
        "coordinates": [
          41.3833,
          2.1754
        ],
        "description": "Hotel Neri occupies a restored palace beside Sant Felip Neri, pairing Gothic Quarter texture with quiet rooms and intimate boutique comfort. Romantic old-city atmosphere replaces resort-style amenities.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.hotelneri.com/img/Hotel%20Neri%20(2).jpg.jpg"
      },
      {
        "id": "gothic-mercer-hotel",
        "name": "Mercer Hotel Barcelona",
        "coordinates": [
          41.3826,
          2.1784
        ],
        "description": "Mercer Hotel Barcelona incorporates Roman wall fragments, medieval fabric, a calm courtyard, and high-touch service into a luxury Gothic Quarter property. The old city is physically built into the hotel.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.mercerhoteles.com/imagenes/logo-og.jpg"
      },
      {
        "id": "gothic-kimpton-vividora",
        "name": "Kimpton Vividora Hotel",
        "coordinates": [
          41.3843,
          2.1741
        ],
        "description": "Kimpton Vividora is a polished lifestyle-hotel near the cathedral, backed by hotel guides and Google Travel demand. Its value is central logistics, design-forward rooms, rooftop views, and a more contemporary service model for the Gothic Quarter without staying in a small historic inn.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://kimptonvividorahotel.com/content/thumbs/800_450/content/imgsxml/galerias/panel_herohome/1/1.2home-modulo2-2-48281b2464805dda29f360f127321c7c.jpg"
      },
      {
        "id": "gothic-h10-madison",
        "name": "H10 Madison",
        "coordinates": [
          41.386,
          2.176
        ],
        "description": "H10 Madison is a straightforward central hotel with a strong rooftop, close to the cathedral, Palau de la Musica, and Placa Catalunya transit. Practical access matters more than precious boutique theater.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://pro-static.h10hotels.com/gallery/Cabecera_Fichahotel_HMD1.jpg"
      },

    ],
    "sources": [
      {
        "name": "Time Out - Best hotels in Barcelona",
        "url": "https://www.timeout.com/barcelona/hotels/best-hotels-in-barcelona"
      },
      {
        "name": "Conde Nast Traveler - Barcelona hotels",
        "url": "https://www.cntraveler.com/gallery/best-hotels-in-barcelona"
      },
      {
        "name": "Google Travel",
        "url": "https://www.google.com/travel/hotels"
      }
    ]
  },
  {
    "id": "list-barcelona-el-born-stays",
    "slug": "barcelona-el-born-stays",
    "seoSlug": "best-places-to-stay",
    "seoTitle": "Best Places to Stay in El Born, Barcelona",
    "seoDescription": "Best places to stay in El Born, Barcelona, including boutique hotels, practical hostals, museum-street bases, Ciutadella access, and lively old-town lodging.",
    "title": "Boutique Beds by the Market",
    "description": "El Born's hotel mix runs from polished rooftops and design-led rooms to straightforward hostals near Ciutadella and Franca station. The neighborhood suits travelers who want old-city streets, museums, restaurants, and late bars outside the door.",
    "url": "https://www.google.com/maps/search/el+born+hotels+hostels+barcelona",
    "category": "Stay",
    "location": {
      "city": "Barcelona",
      "neighborhood": "El Born",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "born-barcelona-edition",
        "name": "The Barcelona EDITION",
        "coordinates": [
          41.3869,
          2.1763
        ],
        "description": "The Barcelona EDITION is El Born's strongest luxury stay because hotel guides and Google Travel signals consistently point to its Santa Caterina Market location, rooftop scene, restaurants, and high-design service. It suits travelers who want old-town energy but prefer a five-star, contemporary hotel ecosystem.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://cache.marriott.com/content/dam/marriott-renditions/BCNEB/bcneb-terrace-2734-hor-wide.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=1336px:*"
      },
      {
        "id": "born-kk-picasso",
        "name": "K+K Hotel Picasso",
        "coordinates": [
          41.3867,
          2.1852
        ],
        "description": "K+K Hotel Picasso sits on El Born's quieter edge with a rooftop pool and immediate access to Parc de la Ciutadella. The Picasso Museum, Estacio de Franca, and neighborhood restaurants are easy walks.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80"
      },
      {
        "id": "born-park-hotel",
        "name": "Park Hotel Barcelona",
        "coordinates": [
          41.3847,
          2.1855
        ],
        "description": "Park Hotel Barcelona is a logistics-first Born stay: guides and map data support it for Estació de França, waterfront walks, and quick access into El Born.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://parkhotelbarcelona.com/wp-content/uploads/sites/4/2024/04/PARK_HOTEL_Habitacions-36-1-1024x683.jpg"
      },
      {
        "id": "born-chic-basic",
        "name": "chic&basic Born Boutique Hotel",
        "coordinates": [
          41.386,
          2.1838
        ],
        "description": "chic&basic Born Boutique Hotel fills a 19th-century building with playful interiors that match the neighborhood's design-shop personality. The central location offers style and walkability below the price of El Born's luxury hotels.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.chicandbasic.com/data/webp/cbborn-zonacomun-beyourself3-baja232.webp"
      },
      {
        "id": "born-hostal-orleans",
        "name": "Hostal Orleans",
        "coordinates": [
          41.3845,
          2.1863
        ],
        "description": "Hostal Orleans keeps the El Born list honest for budget travelers. Its source value is location and simplicity: near the station, park, waterfront, and Born museums, with basic rooms that make sense when the priority is spending the trip budget on food, culture, and nightlife.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80"
      }
    ],
    "sources": [
      {
        "name": "Time Out - Best hotels in Barcelona",
        "url": "https://www.timeout.com/barcelona/hotels/best-hotels-in-barcelona"
      },
      {
        "name": "Conde Nast Traveler - Barcelona hotels",
        "url": "https://www.cntraveler.com/gallery/best-hotels-in-barcelona"
      },
      {
        "name": "Google Travel",
        "url": "https://www.google.com/travel/hotels"
      }
    ]
  },
  {
    "id": "list-barcelona-eixample-stays",
    "slug": "barcelona-eixample-stays",
    "seoSlug": "best-places-to-stay",
    "seoTitle": "Best Places to Stay in Eixample, Barcelona",
    "seoDescription": "Best places to stay in Eixample, Barcelona, for design hotels, central transit, Modernista architecture, and calmer bases outside the old-city lanes.",
    "title": "Design Stays on the Grid",
    "description": "Eixample hotels pair wide streets, easier transport, and Modernista surroundings with design-led rooms, rooftop amenities, bakery mornings, and quieter conditions than the old-city lanes.",
    "url": "https://www.google.com/maps/search/eixample+hotels+barcelona",
    "category": "Stay",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Eixample",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "eixample-casa-bonay-hotel",
        "name": "Casa Bonay",
        "coordinates": [
          41.3918,
          2.1746
        ],
        "description": "Casa Bonay is an Eixample design hotel with coffee, natural wine, rooftop space, dining, and neighborhood life integrated into the property rather than separated behind a corporate lobby.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://cdn-hhbfohb.nitrocdn.com/MWVuFFQrOubRCgucqTrIdzQgXRECTcge/assets/images/optimized/rev-41ae578/casabonay.com/wp-content/uploads/2020/12/ATP9564@antp-900x1196.jpg"
      },
      {
        "id": "eixample-almanac",
        "name": "Almanac Barcelona",
        "coordinates": [
          41.3906,
          2.1683
        ],
        "description": "Almanac Barcelona is a polished luxury hotel near Passeig de Gracia with contemporary rooms, rooftop views, and immediate access to Eixample architecture without old-city density.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.almanachotels.com/wp-content/uploads/2025/07/almanac-barcelona-room-1024x683.jpg"
      },
      {
        "id": "eixample-praktik-bakery",
        "name": "Praktik Bakery",
        "coordinates": [
          41.3952,
          2.1639
        ],
        "description": "Praktik Bakery is a mid-range Eixample boutique hotel built around a working bakery. Fresh-bread mornings, walkability, and an intimate scale take priority over big-lobby luxury.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.hotelpraktikbakery.com/wp-content/uploads/sites/18/HOTEL-PRAKTIK-BAKERY-HOME-1.jpg"
      },
      {
        "id": "eixample-the-one",
        "name": "The One Barcelona",
        "coordinates": [
          41.3958,
          2.1624
        ],
        "description": "The One Barcelona is a quiet luxury hotel near La Pedrera with a rooftop pool and easy access to Passeig de Gracia. Its Eixample setting is calmer than the Gothic Quarter.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://static.hoteltreats.com/site/styles/hero/s3/2019-12/9-2-17_Terraza-piscina-de-dia_0056.jpg?itok=KLPQ2WKO"
      },

    ],
    "sources": [
      {
        "name": "Time Out - Best hotels in Barcelona",
        "url": "https://www.timeout.com/barcelona/hotels/best-hotels-in-barcelona"
      },
      {
        "name": "The Infatuation - Barcelona hotels/restaurants guide",
        "url": "https://www.theinfatuation.com/barcelona/guides/best-restaurants-hotels-barcelona"
      },
      {
        "name": "Google Travel",
        "url": "https://www.google.com/travel/hotels"
      }
    ]
  },
  {
    "id": "list-barcelona-gracia-stays",
    "slug": "barcelona-gracia-stays",
    "seoSlug": "best-places-to-stay",
    "seoTitle": "Best Places to Stay in Gràcia, Barcelona",
    "seoDescription": "Best places to stay in Gràcia, Barcelona, for village-like plazas, Park Guell access, boutique lodging, and a less tourist-saturated base.",
    "title": "Village-Base Stays",
    "description": "Gracia asks you to trade a little central convenience for a neighborhood that feels like it has its own weather. Sonder La Casa del Sol puts you near the plazas, while Hotel Ronda Lesseps and Catalonia Park Guell make the Park Guell side more practical.",
    "url": "https://www.google.com/maps/search/gracia+hotels+barcelona",
    "category": "Stay",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Gràcia",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "gracia-sonder-la-casa-del-sol",
        "name": "Sonder La Casa del Sol",
        "coordinates": [
          41.4009,
          2.1576
        ],
        "description": "Sonder La Casa del Sol is a compact boutique property beside Placa del Sol, placing guests directly in Gracia's terrace culture. The small format makes the neighborhood itself the main amenity.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/829518336.jpg?k=3f40f1675107fde48a585586b92258a7949fa829fd8f50542e39d48765ab8c02&o="
      },
      {
        "id": "gracia-hotel-ronda-lesseps",
        "name": "Hotel Ronda Lesseps",
        "coordinates": [
          41.4069,
          2.1495
        ],
        "description": "Hotel Ronda Lesseps is a good-value northern Gracia property with metro access and useful proximity to Park Guell.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.hotellesseps.com/wp-content/uploads/sites/436/2024/05/HRL-2024-Terrassa-Gran-01.jpg"
      },
      {
        "id": "gracia-catalonia-park-guell",
        "name": "Catalonia Park Güell",
        "coordinates": [
          41.4115,
          2.1459
        ],
        "description": "Catalonia Park Güell offers practical rooms, a pool, and metro access from a quieter northern position near Gràcia and Park Güell. The value lies in price and facilities rather than boutique-neighborhood charm.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://images.cataloniahotels.com/styles/talla_siete/cloud-storage/images/2024-12/highlight-instalaciones-hivern-0.jpg.webp"
      }
    ],
    "sources": [
      {
        "name": "Time Out - Barcelona hotels",
        "url": "https://www.timeout.com/barcelona/hotels"
      },
      {
        "name": "Google Travel",
        "url": "https://www.google.com/travel/hotels"
      },
      {
        "name": "Barcelona Turisme accommodation directory",
        "url": "https://www.barcelonaturisme.com"
      }
    ]
  },
  {
    "id": "list-barcelona-poble-sec-stays",
    "slug": "barcelona-poble-sec-stays",
    "seoSlug": "best-places-to-stay",
    "seoTitle": "Best Places to Stay in Poble-sec, Barcelona",
    "seoDescription": "Best places to stay in Poble-sec, Barcelona, for Montjuic access, theater nights, Sala Apolo proximity, hotels, and a base between old town and the hill.",
    "title": "Sleep Near Montjuïc",
    "description": "Poble-sec hotels sit between Avinguda del Paral·lel and Montjuïc, close to theatres, music venues, tapas streets, and direct metro links. The choice ranges from a small design property to a large full-service hotel and basic lower-cost rooms, with fewer grand-hotel amenities than the central districts.",
    "url": "https://www.google.com/maps/search/poble+sec+hotels+barcelona",
    "category": "Stay",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Poble-sec",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "poblesec-hotel-brummell",
        "name": "Hotel Brummell",
        "coordinates": [
          41.3713,
          2.166
        ],
        "description": "Hotel Brummell is a small, design-led Poble-sec property with stylish common spaces and a calm setting near Montjuic. Neighborhood food and theatre access replace the scale of a large Parallel hotel.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://hotelbrummell.brummellprojects.com/wp-content/uploads/sites/2/2023/03/1440x1480px_0001_2880x1600px_0019_BRUMMELL_EXT_H-12.jpg"
      },
      {
        "id": "poblesec-innside-apolo",
        "name": "INNSiDE by Meliá Barcelona Apolo",
        "coordinates": [
          41.3749,
          2.1701
        ],
        "description": "INNSiDE by Melia Barcelona Apolo is a large hotel beside Parallel and Sala Apolo, with metro convenience, conference-scale reliability, and easy walks toward the port, old town, and Poble-sec tapas streets.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://innsidebymeliaapolo.barcelonahotel.org/data/Photos/OriginalPhoto/17655/1765572/1765572628/photo-innside-by-melia-barcelona-apolo-barcelona-1.JPEG"
      },
      {
        "id": "poblesec-coronado",
        "name": "Hotel Coronado",
        "coordinates": [
          41.3744,
          2.1669
        ],
        "description": "Hotel Coronado is a no-frills Poble-sec hotel near Carrer de Blai, Parallel transit, tapas bars, and performance venues. Basic rooms and lower rates matter more here than boutique design or destination amenities.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.hotelcoronado.net/wp-content/uploads/2023/05/02-4.jpg"
      }
    ],
    "sources": [
      {
        "name": "Time Out - Barcelona hotels",
        "url": "https://www.timeout.com/barcelona/hotels"
      },
      {
        "name": "Google Travel",
        "url": "https://www.google.com/travel/hotels"
      },
      {
        "name": "Barcelona Turisme accommodation directory",
        "url": "https://www.barcelonaturisme.com"
      }
    ]
  },
  {
    "id": "list-barcelona-citywide-hotels",
    "slug": "barcelona-best-hotels",
    "seoSlug": "best-hotels",
    "seoTitle": "Best Hotels in Barcelona",
    "seoDescription": "Best hotels in Barcelona, comparing Gothic Quarter heritage stays, El Born boutique rooms, Eixample design hotels, Gracia village bases, and Poble-sec practical stays.",
    "title": "Hotels by Neighborhood Fit",
    "description": "Barcelona hotels change character by neighborhood: old-stone intimacy in the Gothic Quarter, nightlife and museums in El Born, polished architecture in Eixample, grand Modernisme in Gracia, and a looser Montjuic edge in Poble-sec.",
    "url": "https://www.google.com/maps/search/best+hotels+barcelona",
    "category": "Stay",
    "location": {
      "city": "Barcelona",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "barcelona-hotel-shortlist-hotel-neri",
        "name": "Hotel Neri",
        "coordinates": [
          41.3833,
          2.1754
        ],
        "description": "Hotel Neri brings boutique comfort to a restored palace on quiet Plaça de Sant Felip Neri. Its historic fabric, intimate scale, and Gothic Quarter position give the old-city setting more character than a generic central hotel.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.hotelneri.com/img/Hotel%20Neri%20(2).jpg.jpg"
      },
      {
        "id": "barcelona-hotel-shortlist-chic-and-basic-born",
        "name": "Chic & Basic Born Boutique Hotel",
        "coordinates": [
          41.3877,
          2.1832
        ],
        "description": "Chic & Basic Born Boutique Hotel is an El Born hotel for nightlife, museum streets, Ciutadella access, and boutique scale in one base.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.chicandbasic.com/data/webp/cbborn-zonacomun-beyourself3-baja232.webp"
      },
      {
        "id": "barcelona-hotel-shortlist-almanac",
        "name": "Almanac Barcelona",
        "coordinates": [
          41.3901,
          2.1688
        ],
        "description": "Almanac Barcelona is a polished Eixample design hotel near Passeig de Gracia, with contemporary rooms, a rooftop, and immediate access to architecture and shopping. It favors central-city convenience over old-quarter atmosphere.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.almanachotels.com/wp-content/uploads/2025/07/almanac-barcelona-room-1024x683.jpg"
      },
      {
        "id": "barcelona-hotel-shortlist-casa-fuster",
        "name": "Hotel Casa Fuster",
        "coordinates": [
          41.3983,
          2.1589
        ],
        "description": "Hotel Casa Fuster is the Gracia-edge grand hotel for modernista architecture, Passeig de Gracia access, and a calmer village-side return at night. It is best when the hotel building itself is part of the Barcelona experience.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://static-resources-elementor.mirai.com/wp-content/uploads/sites/343/casa-fuster_gallery.jpg"
      },
      {
        "id": "barcelona-hotel-shortlist-hotel-brummell",
        "name": "Hotel Brummell",
        "coordinates": [
          41.3719,
          2.1631
        ],
        "description": "Hotel Brummell is a small, design-led Poble-sec property with stylish common spaces and a calm setting near Montjuic. Neighborhood food, tapas streets, and hill access replace the scale of a big central lobby.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://hotelbrummell.brummellprojects.com/wp-content/uploads/sites/2/2023/03/1440x1480px_0001_2880x1600px_0019_BRUMMELL_EXT_H-12.jpg"
      },
      {
        "id": "barcelona-hotel-shortlist-edition",
        "name": "The Barcelona EDITION",
        "coordinates": [
          41.3869,
          2.1763
        ],
        "description": "The Barcelona EDITION adds a luxury El Born base beside Santa Caterina Market, with rooftop scene, restaurants, and high-design service. It suits travelers who want old-town energy but prefer a five-star contemporary hotel ecosystem.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://cache.marriott.com/content/dam/marriott-renditions/BCNEB/bcneb-terrace-2734-hor-wide.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=1336px:*"
      },
      {
        "id": "barcelona-hotel-shortlist-mercer",
        "name": "Mercer Hotel Barcelona",
        "coordinates": [
          41.3826,
          2.1784
        ],
        "description": "Mercer Hotel Barcelona is the luxury heritage stay in the Gothic core, with Roman wall fragments, medieval fabric, courtyard calm, and high-service positioning built into the property itself.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.mercerhoteles.com/imagenes/logo-og.jpg"
      },
      {
        "id": "barcelona-hotel-shortlist-kimpton-vividora",
        "name": "Kimpton Vividora Hotel",
        "coordinates": [
          41.3843,
          2.1741
        ],
        "description": "Kimpton Vividora is a polished lifestyle-hotel near the cathedral, useful for central logistics, rooftop views, contemporary rooms, and a Gothic Quarter stay that does not feel like a small historic inn.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://kimptonvividorahotel.com/content/thumbs/800_450/content/imgsxml/galerias/panel_herohome/1/1.2home-modulo2-2-48281b2464805dda29f360f127321c7c.jpg"
      },
      {
        "id": "barcelona-hotel-shortlist-casa-bonay",
        "name": "Casa Bonay",
        "coordinates": [
          41.3918,
          2.1746
        ],
        "description": "Casa Bonay is an Eixample design hotel with coffee, natural wine, rooftop space, dining, and neighborhood life integrated into the property rather than separated behind a corporate lobby.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://cdn-hhbfohb.nitrocdn.com/MWVuFFQrOubRCgucqTrIdzQgXRECTcge/assets/images/optimized/rev-41ae578/casabonay.com/wp-content/uploads/2020/12/ATP9564@antp-900x1196.jpg"
      },
      {
        "id": "barcelona-hotel-shortlist-the-one",
        "name": "The One Barcelona",
        "coordinates": [
          41.3958,
          2.1624
        ],
        "description": "The One Barcelona is a quiet luxury hotel near La Pedrera with a rooftop pool and easy access to Passeig de Gracia.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://static.hoteltreats.com/site/styles/hero/s3/2019-12/9-2-17_Terraza-piscina-de-dia_0056.jpg?itok=KLPQ2WKO"
      }
    ],
    "sources": [
      {
        "name": "Time Out - Best hotels in Barcelona",
        "url": "https://www.timeout.com/barcelona/hotels/best-hotels-in-barcelona"
      },
      {
        "name": "Conde Nast Traveler - Barcelona hotels",
        "url": "https://www.cntraveler.com/gallery/best-hotels-in-barcelona"
      },
      {
        "name": "The Infatuation - Barcelona hotels and restaurants",
        "url": "https://www.theinfatuation.com/barcelona/guides/best-restaurants-hotels-barcelona"
      },
      {
        "name": "Google Travel",
        "url": "https://www.google.com/travel/hotels"
      },
      {
        "name": "Barcelona Turisme accommodation directory",
        "url": "https://www.barcelonaturisme.com"
      }
    ]
  },
  {
    "id": "list-barcelona-citywide-hostels",
    "slug": "barcelona-best-hostels-citywide",
    "seoSlug": "best-hostels",
    "seoTitle": "Best Hostels in Barcelona",
    "seoDescription": "Best hostels in Barcelona, pulling the strongest hostel pick from each neighborhood guide for social dorms, private rooms, location, and traveler fit.",
    "title": "Social Bases Across the Map",
    "description": "Barcelona's social hostels range from full party programming to cleaner, calmer communal stays with dorms and private rooms. Location changes the experience sharply, from old-town nightlife and Eixample access to Gracia plazas and Poble-sec bars.",
    "url": "https://www.google.com/maps/search/best+hostels+barcelona",
    "category": "Stay",
    "location": {
      "city": "Barcelona",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "barcelona-hostel-shortlist-kabul",
        "name": "Kabul Party Hostel Barcelona",
        "coordinates": [
          41.3802,
          2.1758
        ],
        "description": "Hostelworld, Google Maps, and long-running backpacker coverage consistently support it for Plaça Reial location, organized social programming, rooftop/common-space energy, and fast access to the Gothic Quarter bar circuit; it is a strong fit for outgoing solo travelers, not for light sleepers.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.kabul.es/wp-content/uploads/2019/12/Barcelona-13.jpg"
      },
      {
        "id": "barcelona-hostel-shortlist-360-borne",
        "name": "360 Hostel Borne",
        "coordinates": [
          41.3898,
          2.1805
        ],
        "description": "360 Hostel Borne is a social hostel near Arc de Triomf with shared meals, organized activities, a kitchen, and useful common space. Ciutadella, El Born, and central transit are walkable without sleeping on the loudest old-town streets.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://360hostel.com/wp-content/uploads/2023/05/image00012.jpg"
      },
      {
        "id": "barcelona-hostel-shortlist-yeah",
        "name": "Yeah Barcelona Hostel",
        "coordinates": [
          41.3983,
          2.1654
        ],
        "description": "Yeah Barcelona is an Eixample hostel because it combines polished dorms, private rooms, and structured social programming in a location that works for Sagrada Familia, lower Gracia, and Eixample dining. Multiple hostel and map sources make it one of the safest all-around recommendations when travelers want social energy without sleeping in the Gothic core.",
        "category": "Stay",
        "venueKind": "lodging",
        "lodgingType": "hostel",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://images.trvl-media.com/lodging/28000000/27090000/27084800/27084729/9f0a3253.jpg?impolicy=resizecrop&ra=fit&rw=1200"
      },
      {
        "id": "barcelona-hostel-shortlist-casa-gracia",
        "name": "Casa Gracia",
        "coordinates": [
          41.3978,
          2.1578
        ],
        "description": "Casa Gracia is a Gracia hotel because it bridges hostel, hotel, and neighborhood social hub better than a pure dorm property. Source signals support it for dorm/private flexibility, Diagonal transit, communal programming, and immediate access to Gracia's plaza-and-restaurant life, making it especially useful for style and a less old-town-heavy base.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_320,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/4/45620/dcpnqaebwoizjbeaiopu.jpg"
      },
      {
        "id": "barcelona-hostel-shortlist-onefam-paralelo",
        "name": "Onefam Paralelo",
        "coordinates": [
          41.374,
          2.1658
        ],
        "description": "Onefam Paralelo is a community-first Poble-sec hostel for solo travelers, with staff-led activities, group dinners, and built-in social life near Carrer de Blai, Montjuic, and Sala Apolo.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://onefamhostels.com/wp-content/uploads/2025/09/01entrance-onefam-paralelo-barcelona.jpg"
      },
      {
        "id": "barcelona-hostel-shortlist-born-barcelona",
        "name": "Born Barcelona Hostel",
        "coordinates": [
          41.3903,
          2.1811
        ],
        "description": "Born Barcelona Hostel is a quieter, smaller-format hostel near Arc de Triomf and the upper edge of El Born. It suits travelers who want museum and park access with a practical bed-and-base setup rather than a party-hostel identity.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.bornbarcelonahostel.com/wp-content/uploads/2012/12/nuestras-habitaciones.jpg"
      },
      {
        "id": "barcelona-hostel-shortlist-arc-house",
        "name": "Arc House Barcelona",
        "coordinates": [
          41.3908,
          2.1867
        ],
        "description": "Arc House Barcelona is a simple budget hostel near Parc de la Ciutadella and Estació del Nord, with El Born within an easy walk. Location and low cost carry more weight than extensive facilities.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80"
      },
      {
        "id": "barcelona-hostel-shortlist-black-swan",
        "name": "Black Swan Hostel",
        "coordinates": [
          41.3907,
          2.1773
        ],
        "description": "Black Swan sits just west of El Born near Arc de Triomf and works for solo travelers who want tours, shared meals, social programming, and central transit reach without old-town noise directly at the door.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://blackswanhostels.com/wp-content/uploads/2024/07/IMG-20240701-WA0164.jpg"
      },
      {
        "id": "barcelona-hostel-shortlist-rock-palace",
        "name": "Sant Jordi Hostels Rock Palace",
        "coordinates": [
          41.3897,
          2.1608
        ],
        "description": "Sant Jordi Rock Palace is a music-themed Eixample hostel with stronger group energy, rooftop pool appeal, and easy reach to Passeig de Gràcia and late-night central bars.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.santjordihostels.com/wp-content/uploads/Terraza_Rock3-scaled.jpg"
      },
      {
        "id": "barcelona-hostel-shortlist-onefam-batllo",
        "name": "Onefam Batllo",
        "coordinates": [
          41.386,
          2.1604
        ],
        "description": "Onefam Batllo is a central Eixample social-hostel for solo travelers who want structured programming, staff-led activities, and easy walks to Casa Batlló and Passeig de Gràcia.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://onefamhostels.com/wp-content/uploads/2025/09/01entrance-onefam-batllo-hostel-barcelona-scaled.jpg"
      }
    ],
    "sources": [
      {
        "name": "Hostelworld - Barcelona hostels",
        "url": "https://www.hostelworld.com/st/hostels/europe/spain/barcelona/"
      },
      {
        "name": "Google Maps - Barcelona hostels",
        "url": "https://www.google.com/maps/search/best+hostels+barcelona"
      },
      {
        "name": "Casa Gracia official",
        "url": "https://www.casagraciabcn.com/"
      },
      {
        "name": "Onefam Hostels - Barcelona",
        "url": "https://onefamhostels.com/"
      }
    ]
  },
  {
    "id": "list-barcelona-gothic-quarter-hostels",
    "slug": "barcelona-gothic-quarter-hostels",
    "seoSlug": "best-hostels",
    "seoTitle": "Best Hostels in the Gothic Quarter, Barcelona",
    "seoDescription": "Best hostels in the Gothic Quarter, Barcelona, including old-city party hostels, cathedral-area dorms, budget private rooms, and walkable bases near Placa Reial and El Born.",
    "title": "Old-City Dorms and Party Bases",
    "description": "Gothic Quarter hostels range from full party programming on Placa Reial to quieter dorms and bare-bones central beds near the cathedral lanes. Old-city access is the advantage; street noise, compact rooms, and late foot traffic are the tradeoffs.",
    "url": "https://www.google.com/maps/search/gothic+quarter+hostels+barcelona",
    "category": "Stay",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Gothic Quarter",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "gothic-hostel-kabul",
        "name": "Kabul Party Hostel Barcelona",
        "coordinates": [
          41.3802,
          2.1758
        ],
        "description": "Hostelworld and long-running traveler coverage consistently frame it around Plaça Reial location, organized social programming, rooftop/common-space energy, and fast access to late bars; it is better for outgoing backpackers than for quiet sleepers.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.kabul.es/wp-content/uploads/2019/12/Barcelona-13.jpg"
      },
      {
        "id": "gothic-hostel-itaca",
        "name": "Itaca Hostel",
        "coordinates": [
          41.385,
          2.1749
        ],
        "description": "Itaca is the calmer cathedral-area counterweight to Kabul: small-scale, central, and practical for Gothic lanes, Plaça Catalunya, and old-city walking routes without committing to a party-hostel atmosphere. Hostelworld and review signals support it for location and simple dorm/private value.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://itacahostel.com/wp-content/uploads/2024/11/iteca-hostel-actividades.jpg"
      },
      {
        "id": "gothic-hostel-safestay-gothic",
        "name": "Safestay Barcelona Gothic",
        "coordinates": [
          41.3838,
          2.1786
        ],
        "description": "Safestay Barcelona Gothic sits between the Gothic Quarter and El Born, making it useful for budget beds close to Jaume I, the Picasso Museum, and cathedral lanes. It is a chain hostel rather than a boutique stay, but the value is location, scale, and predictable dorm infrastructure.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.safestay.com/wp-content/uploads/2023/07/BCNGT-2023-9-aspect-ratio-927-676.jpg"
      },
      {
        "id": "gothic-hostel-new-york",
        "name": "Hostel New York",
        "coordinates": [
          41.381,
          2.1807
        ],
        "description": "Hostel New York is a no-frills old-city hostel: basic, cheap, and positioned for travelers who care more about being near the port, Barceloneta, and Gothic nightlife than about design or a heavy social program.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80"
      }
    ],
    "sources": [
      {
        "name": "Hostelworld - Barcelona hostels",
        "url": "https://www.hostelworld.com/st/hostels/europe/spain/barcelona/"
      },
      {
        "name": "Hostelworld - Kabul Party Hostel Barcelona",
        "url": "https://www.hostelworld.com/pwa/hosteldetails.php/Kabul-Party-Hostel-Barcelona/Barcelona/722"
      },
      {
        "name": "Google Maps - Gothic Quarter hostels",
        "url": "https://www.google.com/maps/search/gothic+quarter+hostels+barcelona"
      }
    ]
  },
  {
    "id": "list-barcelona-el-born-hostels",
    "slug": "barcelona-el-born-hostels",
    "seoSlug": "best-hostels",
    "seoTitle": "Best Hostels in El Born, Barcelona",
    "seoDescription": "Best hostels in El Born, Barcelona, covering Arc de Triomf bases, social dorms, budget private rooms, and hostel stays close to Santa Maria del Mar, Ciutadella, and the Picasso Museum.",
    "title": "Dorms by Ciutadella and the Born",
    "description": "El Born hostels place dorms and private rooms near Arc de Triomf, Ciutadella, museum streets, and strong transit with less intensity than Placa Reial. Social programming ranges from relaxed to party-led.",
    "url": "https://www.google.com/maps/search/el+born+hostels+barcelona",
    "category": "Stay",
    "location": {
      "city": "Barcelona",
      "neighborhood": "El Born",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "born-hostel-360-borne",
        "name": "360 Hostel Borne",
        "coordinates": [
          41.3898,
          2.1805
        ],
        "description": "360 Hostel Borne is a social hostel near Arc de Triomf with shared meals, organized activities, a kitchen, and useful common space. Ciutadella, El Born, and central transit are walkable without sleeping on the loudest old-town streets.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://360hostel.com/wp-content/uploads/2023/05/image00012.jpg"
      },
      {
        "id": "born-hostel-born-barcelona",
        "name": "Born Barcelona Hostel",
        "coordinates": [
          41.3903,
          2.1811
        ],
        "description": "Born Barcelona Hostel is a quiet, small-format property near Arc de Triomf and the upper edge of El Born. Practical beds and access to museums and Ciutadella Park take priority over a party-hostel identity.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.bornbarcelonahostel.com/wp-content/uploads/2012/12/nuestras-habitaciones.jpg"
      },
      {
        "id": "born-hostel-arc-house",
        "name": "Arc House Barcelona",
        "coordinates": [
          41.3908,
          2.1867
        ],
        "description": "Arc House is a low-cost hostel close to Parc de la Ciutadella, Estacio del Nord, and El Born. Value and location outweigh character or extensive social programming.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80"
      },
      {
        "id": "born-hostel-black-swan",
        "name": "Black Swan Hostel",
        "coordinates": [
          41.3907,
          2.1773
        ],
        "description": "Black Swan Hostel is an activity-forward, dorm-led social hostel near Arc de Triomf and El Born. Organized events and communal energy suit solo travelers, while the location avoids having the old town's busiest nightlife directly at the door.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://blackswanhostels.com/wp-content/uploads/2024/07/IMG-20240701-WA0164.jpg"
      }
    ],
    "sources": [
      {
        "name": "Hostelworld - Barcelona hostels",
        "url": "https://www.hostelworld.com/st/hostels/europe/spain/barcelona/"
      },
      {
        "name": "Google Maps - El Born hostels",
        "url": "https://www.google.com/maps/search/el+born+hostels+barcelona"
      },
      {
        "name": "360 Hostel Borne official",
        "url": "https://360hostelbcn.com/"
      }
    ]
  },
  {
    "id": "list-barcelona-eixample-hostels",
    "slug": "barcelona-eixample-hostels",
    "seoSlug": "best-hostels",
    "seoTitle": "Best Hostels in Eixample, Barcelona",
    "seoDescription": "Best hostels in Eixample, Barcelona, including social hostels near Sagrada Familia, cocktail-friendly bases, central dorms, and calmer garden-style hostels near Passeig de Gracia.",
    "title": "Grid-Side Social Hostels",
    "description": "Eixample hostels offer social common rooms, dorms, private rooms, and strong transit without the full old-town crush. Quieter properties suit longer stays where sleep matters.",
    "url": "https://www.google.com/maps/search/eixample+hostels+barcelona",
    "category": "Stay",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Eixample",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "eixample-hostel-yeah",
        "name": "Yeah Barcelona Hostel",
        "coordinates": [
          41.3983,
          2.1654
        ],
        "description": "Yeah Barcelona is the Eixample hostel to beat for social energy without the old-city chaos. Hostelworld and traveler sources repeatedly support it for organized dinners and tours, modern dorms, private rooms, and a location that splits the difference between Sagrada Familia, Gracia, and Eixample restaurants.",
        "category": "Stay",
        "venueKind": "lodging",
        "lodgingType": "hostel",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://images.trvl-media.com/lodging/28000000/27090000/27084800/27084729/9f0a3253.jpg?impolicy=resizecrop&ra=fit&rw=1200"
      },
      {
        "id": "eixample-hostel-rock-palace",
        "name": "Sant Jordi Hostels Rock Palace",
        "coordinates": [
          41.3897,
          2.1608
        ],
        "description": "Sant Jordi Rock Palace is a music-themed Eixample hostel with stronger group energy: rooftop pool, themed interiors, and easy reach to Passeig de Gracia and late-night central bars. It is better for a polished social hostel than for anyone seeking quiet minimalism.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.santjordihostels.com/wp-content/uploads/Terraza_Rock3-scaled.jpg"
      },
      {
        "id": "eixample-hostel-onefam-batllo",
        "name": "Onefam Batllo",
        "coordinates": [
          41.386,
          2.1604
        ],
        "description": "Onefam Batllo combines structured social programming, staff-led activities, and a central Eixample location near Casa Batllo and Passeig de Gracia. Its community focus distinguishes it from larger hostels.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://onefamhostels.com/wp-content/uploads/2025/09/01entrance-onefam-batllo-hostel-barcelona-scaled.jpg"
      },
      {
        "id": "eixample-hostel-central-garden",
        "name": "Barcelona Central Garden",
        "coordinates": [
          41.3905,
          2.171
        ],
        "description": "Barcelona Central Garden is a calmer Eixample hotel, useful for a smaller hostel, terrace/garden feel, and central access without a party-hostel rhythm. It is a strong fit for couples, older backpackers, or first-time visitors who value sleep and walkability.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80"
      },
      {
        "id": "eixample-hostel-primavera",
        "name": "Primavera Hostel",
        "coordinates": [
          41.3976,
          2.164
        ],
        "description": "Primavera Hostel rounds out the Eixample list as a budget-friendly, design-light option near Verdaguer and Sagrada Familia routes. The draw is practical location, private-room/dorm flexibility, and easier access to Eixample and Gracia than hostels deep in the Gothic core.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://www.primavera-hostel.com/wp-content/uploads/2026/03/mg_4888_1.webp"
      }
    ],
    "sources": [
      {
        "name": "Hostelworld - Barcelona hostels",
        "url": "https://www.hostelworld.com/st/hostels/europe/spain/barcelona/"
      },
      {
        "name": "Hostelworld - Yeah Barcelona Hostel",
        "url": "https://www.hostelworld.com/pwa/hosteldetails.php/Yeah-Barcelona-Hostel/Barcelona/81652"
      },
      {
        "name": "Google Maps - Eixample hostels",
        "url": "https://www.google.com/maps/search/eixample+hostels+barcelona"
      },
      {
        "name": "Sant Jordi Hostels official",
        "url": "https://www.santjordihostels.com/"
      }
    ]
  },
  {
    "id": "list-barcelona-gracia-hostels",
    "slug": "barcelona-gracia-hostels",
    "seoSlug": "best-hostels",
    "seoTitle": "Best Hostels in Gracia, Barcelona",
    "seoDescription": "Best hostels in Gracia, Barcelona, for village-like plazas, Park Guell access, social dorms, quieter hillside bases, and budget stays above Diagonal.",
    "title": "Village Hostel Bases",
    "description": "Gracia hostels trade old-city sightseeing for plaza life, neighborhood bars, and easier access to Park Guell. The mix includes design-conscious social stays, traditional backpacker dorms, and Eixample-edge properties with stronger transport.",
    "url": "https://www.google.com/maps/search/gracia+hostels+barcelona",
    "category": "Stay",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Gràcia",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "gracia-hostel-casa-gracia",
        "name": "Casa Gracia",
        "coordinates": [
          41.3978,
          2.1578
        ],
        "description": "Casa Gracia is the best all-purpose Gracia hostel because it bridges hostel, hotel, and social hub. Hostelworld and hotel-platform signals support it for dorm/private flexibility, strong Diagonal transit, communal programming, and immediate access to Gracia's plaza-and-restaurant life.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_320,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/4/45620/dcpnqaebwoizjbeaiopu.jpg"
      },
      {
        "id": "gracia-hostel-rocket",
        "name": "Rocket Hostels Gracia",
        "coordinates": [
          41.4108,
          2.1514
        ],
        "description": "Rocket Hostels Gracia is a pure backpacker hostel for Park Guell access and a smaller, less central sleep base. It makes most sense for budget travelers who prefer quiet hillside nights over old-town nightlife at the door.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80"
      },
      {
        "id": "gracia-hostel-factory",
        "name": "Factory Hostels Barcelona",
        "coordinates": [
          41.4124,
          2.1555
        ],
        "description": "Factory Hostels offers a quieter hostel rhythm near Park Guell and upper Gracia, with good prices, views, and morning access to Gaudi architecture. Late-night city-center bars are less convenient.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://factorybcn.com/wp-content/uploads/2023/07/terreza-exterior-renovada.webp"
      },
      {
        "id": "gracia-hostel-yeah-edge",
        "name": "Yeah Barcelona Hostel",
        "coordinates": [
          41.3983,
          2.1654
        ],
        "description": "Yeah Barcelona sits on the Eixample-Gràcia edge with dorms, private rooms, communal dinners, tours, and a strong social atmosphere. The neighborhood's lower plazas are within easy walking distance.",
        "category": "Stay",
        "venueKind": "lodging",
        "lodgingType": "hostel",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://images.trvl-media.com/lodging/28000000/27090000/27084800/27084729/9f0a3253.jpg?impolicy=resizecrop&ra=fit&rw=1200"
      }
    ],
    "sources": [
      {
        "name": "Hostelworld - Barcelona hostels",
        "url": "https://www.hostelworld.com/st/hostels/europe/spain/barcelona/"
      },
      {
        "name": "Casa Gracia official",
        "url": "https://www.casagraciabcn.com/"
      },
      {
        "name": "Rocket Hostels Gracia official",
        "url": "https://www.rockethostels.com/"
      },
      {
        "name": "Google Maps - Gracia hostels",
        "url": "https://www.google.com/maps/search/gracia+hostels+barcelona"
      }
    ]
  },
  {
    "id": "list-barcelona-poble-sec-hostels",
    "slug": "barcelona-poble-sec-hostels",
    "seoSlug": "best-hostels",
    "seoTitle": "Best Hostels in Poble-sec, Barcelona",
    "seoDescription": "Best hostels in Poble-sec, Barcelona, for Parallel nightlife, Carrer de Blai tapas, Montjuic access, budget dorms, and social stays near Sala Apolo.",
    "title": "Parallel Backpacker Bases",
    "description": "Poble-sec hostels put social dorms and simpler private beds near Carrer de Blai, Parallel, and Sala Apolo without old-town pricing. The neighborhood suits late nights, though rooms and streets can feel busier and less polished than Eixample.",
    "url": "https://www.google.com/maps/search/poble+sec+hostels+barcelona",
    "category": "Stay",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Poble-sec",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-stay",
      "name": "R Stay",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "poblesec-hostel-onefam-paralelo",
        "name": "Onefam Paralelo",
        "coordinates": [
          41.374,
          2.1658
        ],
        "description": "Onefam Paralelo is a community-first Poble-sec hostel for solo travelers, with staff-led activities, group dinners, and built-in social life near Carrer de Blai, Montjuic, and Sala Apolo.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://onefamhostels.com/wp-content/uploads/2025/09/01entrance-onefam-paralelo-barcelona.jpg"
      },
      {
        "id": "poblesec-hostel-hellobcn",
        "name": "HelloBCN Hostel",
        "coordinates": [
          41.3752,
          2.1687
        ],
        "description": "HelloBCN is the practical Parallel base: bigger, straightforward, and well positioned for metro access, Poble-sec tapas, and Apolo nights.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://lirp.cdn-website.com/16736e71/dms3rep/multi/opt/P1020869-1920w.JPG"
      },
      {
        "id": "poblesec-hostel-pars-teatro",
        "name": "Pars Teatro Hostel",
        "coordinates": [
          41.3761,
          2.1747
        ],
        "description": "Pars Teatro sits closer to the port and Parallel edge and brings a more character-heavy backpacker feel. Source signals support it for social common spaces and a theatrical interior, making it a good fit for personality and old-town reach.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://parshostels.com/wp-content/uploads/2019/01/teatro-8798.jpg"
      },
      {
        "id": "poblesec-hostel-hostal-apolo",
        "name": "Hostal Apolo",
        "coordinates": [
          41.3747,
          2.169
        ],
        "description": "Hostal Apolo is not a classic party hostel, but it gives the Poble-sec set a low-cost private-room fallback beside Parallel and Sala Apolo.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/22/19/5f/f6/hostal-apolo.jpg?w=1100&h=-1&s=1"
      }
    ],
    "sources": [
      {
        "name": "Hostelworld - Barcelona hostels",
        "url": "https://www.hostelworld.com/st/hostels/europe/spain/barcelona/"
      },
      {
        "name": "Hostelworld - Onefam Paralelo",
        "url": "https://www.hostelworld.com/pwa/hosteldetails.php/Onefam-Paralelo/Barcelona/2962"
      },
      {
        "name": "Google Maps - Poble-sec hostels",
        "url": "https://www.google.com/maps/search/poble+sec+hostels+barcelona"
      },
      {
        "name": "Onefam Hostels official",
        "url": "https://onefamhostels.com/"
      }
    ]
  },
  {
    "id": "list-barcelona-eixample-dive-bars",
    "slug": "barcelona-eixample-dive-bars",
    "seoSlug": "best-dive-bars",
    "seoTitle": "Best Dive Bars in Eixample, Barcelona",
    "seoDescription": "Best dive bars in Eixample, Barcelona, covering local small bars, classic counters, vermouth spots, and lower-key late-night neighborhood drinking.",
    "title": "Low-Key Drinks on the Grid",
    "description": "Eixample's low-key drinking hides between the grand avenues in vermouth counters, casual neighborhood bars, and serious craft-beer rooms. These are conversation-first places where snacks and a well-poured drink matter more than spectacle.",
    "url": "https://www.google.com/maps/search/eixample+dive+bars+barcelona",
    "category": "Nightlife",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Eixample",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-nightlife",
      "name": "R Nightlife",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-21T00:00:00.000Z",
    "stops": [
      {
        "id": "eixample-morro-fi",
        "name": "Morro Fi",
        "coordinates": [
          41.3839,
          2.1576
        ],
        "description": "Morro Fi is a precise Eixample vermouth counter serving house vermouth, conservas, gildas, and other salty snacks in a compact local room.",
        "hours": {
          "mon": "12:00 PM-11:00 PM",
          "tue": "12:00 PM-11:00 PM",
          "wed": "12:00 PM-11:00 PM",
          "thu": "12:00 PM-11:30 PM",
          "fri": "12:00 PM-12:00 AM",
          "sat": "12:00 PM-12:00 AM",
          "sun": "12:00 PM-10:30 PM"
        },
        "photo": "https://morrofi.cat/img/MF3.jpg"
      },
      {
        "id": "eixample-bar-malasang",
        "name": "Bar Malasang",
        "coordinates": [
          41.3891,
          2.1591
        ],
        "description": "Bar Malasang is a low-lit Eixample room with vinyl energy and the unforced character of a neighborhood hangout rather than a destination bar.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://barmalasang.com/wp-content/uploads/2020/11/bar-malasang-f.jpg"
      },
      {
        "id": "eixample-garage-beer",
        "name": "Garage Beer Co. Universitat",
        "coordinates": [
          41.3848,
          2.1585
        ],
        "description": "Garage Beer Co. Universitat pours its own beers, rotating releases, and guest taps in a casual Consell de Cent taproom. The focus stays firmly on contemporary craft brewing rather than vermouth or cocktail ceremony.",
        "hours": {
          "mon": "5:00 PM-12:00 AM",
          "tue": "5:00 PM-12:00 AM",
          "wed": "5:00 PM-12:00 AM",
          "thu": "5:00 PM-12:00 AM",
          "fri": "5:00 PM-3:00 AM",
          "sat": "4:00 PM-3:00 AM",
          "sun": "4:00 PM-12:00 AM"
        },
        "photo": "https://lh3.googleusercontent.com/p/AF1QipNYFbL_MqcrSCQcTsvKuHpQ_AOddJBT1M2EmuYa=s1360-w1360-h1020-rw"
      },
                  {
        "id": "eixample-biercab",
        "name": "BierCab",
        "coordinates": [
          41.3853,
          2.1582
        ],
        "description": "BierCab adds a deeper tap-list option to the Eixample crawl, with casual food and enough range for groups that do not want cocktails. It is most useful as a flexible midpoint: easy to meet at, easy to linger in, and less precious than the area's famous drink rooms.",
        "hours": {
          "mon": "12:00 PM-12:30 AM",
          "tue": "12:00 PM-12:30 AM",
          "wed": "12:00 PM-12:30 AM",
          "thu": "12:00 PM-1:30 AM",
          "fri": "12:00 PM-2:00 AM",
          "sat": "12:00 PM-2:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/03/5f/c4/local.jpg?w=1800&h=1000&s=1"
      }
    ],
    "sources": [
      {
        "name": "Time Out - Best bars in Barcelona",
        "url": "https://www.timeout.com/barcelona/bars-and-pubs/best-bars-in-barcelona"
      },
      {
        "name": "Time Out - Morro Fi",
        "url": "https://www.timeout.es/barcelona/es/bares-y-pubs/morro-fi"
      },
      {
        "name": "The Infatuation - Morro Fi",
        "url": "https://www.theinfatuation.com/barcelona/reviews/morro-fi"
      },
      {
        "name": "National Geographic - Barcelona vermouth bars",
        "url": "https://www.nationalgeographic.com/travel/article/barcelona-food-guide-markets-vermouth-bars"
      },
      {
        "name": "Garage Beer Co. official",
        "url": "https://garagebeer.co/"
      },
      {
        "name": "Tripadvisor - Garage Beer Co.",
        "url": "https://www.tripadvisor.com/Restaurant_Review-g187497-d7990129-Reviews-Garage_Beer_Co-Barcelona_Catalonia.html"
      },
      {
        "name": "Time Out - BierCab",
        "url": "https://www.timeout.com/barcelona/bars-and-pubs/biercab"
      },
      {
        "name": "Barcelona Turisme",
        "url": "https://www.barcelonaturisme.com"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-barcelona-eixample-popular-bars",
    "slug": "barcelona-eixample-popular-bars",
    "seoSlug": "best-bars",
    "seoTitle": "Best Bars in Eixample, Barcelona",
    "seoDescription": "Best bars in Eixample, Barcelona, including classic cocktail rooms, speakeasy-style stops, high-demand nightlife, and central bars worth planning around.",
    "title": "Polished Nights Around Passeig",
    "description": "Eixample nightlife at its most polished: serious cocktails, historic drinking rooms, considered service, and bars whose interiors carry as much character as the glass.",
    "url": "https://www.google.com/maps/search/eixample+popular+bars+barcelona",
    "category": "Nightlife",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Eixample",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-nightlife",
      "name": "R Nightlife",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-21T00:00:00.000Z",
    "stops": [
      {
        "id": "eixample-dry-martini",
        "name": "Dry Martini",
        "coordinates": [
          41.3902,
          2.1552
        ],
        "description": "Founded in Barcelona in 1978, Dry Martini is the Eixample classic for cocktail tradition, polished service, and a proper martini served with ceremony.",
        "hours": {
          "mon": "1:00 PM-2:30 AM",
          "tue": "1:00 PM-2:30 AM",
          "wed": "1:00 PM-2:30 AM",
          "thu": "1:00 PM-2:30 AM",
          "fri": "1:00 PM-3:00 AM",
          "sat": "1:00 PM-3:00 AM",
          "sun": "4:30 PM-1:00 AM"
        },
        "photo": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/3b/d9/39/dry-martini-by-javier.jpg?w=900&h=500&s=1"
      },
      {
        "id": "eixample-sips",
        "name": "Sips",
        "coordinates": [
          41.3889,
          2.1567
        ],
        "description": "Sips is a high-demand Eixample bar where the cocktail itself becomes the main event: precise, theatrical, and internationally recognized.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://cdn.enprimeurclub.com/storage/v1/object/public/images/locations/recDakVqtmov28sO5/hero1.jpg?width=1200&quality=85&aspect_ratio=1.91%3A1&crop_gravity=center"
      },
      {
        "id": "eixample-bobbys-free",
        "name": "Bobby's Free",
        "coordinates": [
          41.3942,
          2.1595
        ],
        "description": "Bobby's Free hides a premium cocktail bar behind a playful barbershop entrance, bringing theatrical access to an otherwise polished Eixample drinks room.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://www.bobbysfree.com/wp-content/uploads/2016/10/Bobbydrink-9-683x1024.jpg"
      },
      {
        "id": "eixample-the-alchemix",
        "name": "The Alchemix",
        "coordinates": [
          41.3893,
          2.159
        ],
        "description": "The Alchemix is useful when the night should feel designed around both food and drink, not just a round of cocktails. Its gastro-cocktail format makes it a stronger planned stop for curious drinkers than for a loose crawl.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://thealchemix.com/wp-content/uploads/2022/02/slide-2-d.jpg"
      },
      {
        "id": "eixample-ideal-cocktail",
        "name": "Ideal Cocktail Bar",
        "coordinates": [
          41.3886,
          2.1575
        ],
        "description": "Ideal Cocktail Bar gives the Eixample set a classic room with old-school service, deep technique, and less spectacle than the newer destination bars.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://revolutionrockbar.es/wp-content/uploads/ideal-cocktail-bar.avif"
      }
    ],
    "sources": [
      {
        "name": "World's 50 Best Bars - Sips",
        "url": "https://www.theworlds50best.com/bars/the-list/sips.html"
      },
      {
        "name": "Sips official",
        "url": "https://sips.barcelona/"
      },
      {
        "name": "Ajuntament de Barcelona - Sips",
        "url": "https://guia.barcelona.cat/detall/cocteleria-sips-drinkery-house_75990421116.html"
      },
      {
        "name": "Condé Nast Traveler - Dry Martini",
        "url": "https://www.cntraveler.com/bars/barcelona/dry-martini"
      },
      {
        "name": "Time Out - Best bars in Barcelona",
        "url": "https://www.timeout.com/barcelona/bars-and-pubs/best-bars-in-barcelona"
      },
      {
        "name": "Time Out - Dry Martini",
        "url": "https://www.timeout.com/barcelona/music-and-nightlife/dry-martini"
      },
      {
        "name": "Time Out - Ideal Cocktail Bar",
        "url": "https://www.timeout.com/barcelona/bars-and-pubs/ideal-cocktail-bar"
      },
      {
        "name": "Time Out - The Alchemix",
        "url": "https://www.timeout.com/barcelona/bars-and-pubs/the-alchemix"
      },
      {
        "name": "Bobby's Free official",
        "url": "https://www.bobbysfree.com/en/"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-barcelona-born-dive-bars",
    "slug": "barcelona-el-born-dive-bars",
    "seoSlug": "best-dive-bars",
    "seoTitle": "Best Dive Bars in El Born, Barcelona",
    "seoDescription": "Best dive bars in El Born, Barcelona, for old-school cava, tapas counters, vermouth stops, wine bars, and smaller neighborhood drinking culture.",
    "title": "Cava Corners and Wine Dens",
    "description": "El Born drinking at a lower temperature, from cava counters and vermouth to natural wine, cocktails, and lively bars with enough food and seating to hold a group.",
    "url": "https://www.google.com/maps/search/el+born+dive+bars+barcelona",
    "category": "Nightlife",
    "location": {
      "city": "Barcelona",
      "neighborhood": "El Born",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-nightlife",
      "name": "R Nightlife",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-21T00:00:00.000Z",
    "stops": [
      {
        "id": "born-el-xampanyet",
        "name": "El Xampanyet",
        "coordinates": [
          41.3847,
          2.1836
        ],
        "description": "El Xampanyet is a packed, tile-lined Born cava counter serving anchovies, conservas, and simple salty tapas. The short, loud room moves quickly and rarely feels like a slow meal.",
        "hours": {
          "mon": "7:00 PM-11:00 PM",
          "tue": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "wed": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "thu": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "fri": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "sat": "12:00 PM-3:30 PM",
          "sun": "Closed"
        },
        "photo": "https://www.elxampanyet.com/wp-content/uploads/2024/10/Iriarte_0117-2048x1352.jpg"
      },
      {
        "id": "born-bar-del-pla",
        "name": "Bar del Pla",
        "coordinates": [
          41.3857,
          2.1817
        ],
        "description": "Bar del Pla lets wine and dinner overlap naturally through creative Catalan small plates, seasonal cooking, and a lively Born dining room.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://www.bardelpla.cat/wp-content/uploads/2023/11/BdP-31-10-23_4328-close-up-copia-2.jpg"
      },
      {
        "id": "born-bar-sauvage",
        "name": "Bar Sauvage",
        "coordinates": [
          41.3854,
          2.1813
        ],
        "description": "Bar Sauvage mixes cocktails from Latin spirits and fresh produce in a lively El Born party room. Music and movement build later in the evening.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://privateaser-media.s3.eu-west-1.amazonaws.com/etab_photos/60446/1500x750/589029.jpg"
      },
      {
        "id": "born-bormuth",
        "name": "Bormuth",
        "coordinates": [
          41.3839,
          2.1811
        ],
        "description": "Bormuth is a lively El Born bar and restaurant with tapas, drinks, and enough seating and food to support a group.",
        "hours": {
          "mon": "12:00 PM-12:30 AM",
          "tue": "12:00 PM-12:30 AM",
          "wed": "12:00 PM-12:30 AM",
          "thu": "12:00 PM-1:30 AM",
          "fri": "12:00 PM-2:00 AM",
          "sat": "12:00 PM-2:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://cdn.barselona.io/cdn-cgi/imagedelivery/35dtYK6MaGFKaBcATdNk5w/6f232061-8680-44ab-8b7f-d9c79e414200/w=1500"
      },
      {
        "id": "born-casa-delfin",
        "name": "Casa Delfín",
        "coordinates": [
          41.3834,
          2.1824
        ],
        "description": "Casa Delfin is a plaza-side El Born classic serving vermouth and tapas with a steady view of neighborhood foot traffic from afternoon into night.",
        "hours": {
          "mon": "12:00 PM-12:30 AM",
          "tue": "12:00 PM-12:30 AM",
          "wed": "12:00 PM-12:30 AM",
          "thu": "12:00 PM-1:30 AM",
          "fri": "12:00 PM-2:00 AM",
          "sat": "12:00 PM-2:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://casadelfinrestaurant.com/wp-content/uploads/2022/06/galeria-home-02.jpg"
      },
      {
        "id": "born-la-vinya",
        "name": "La Vinya del Senyor",
        "coordinates": [
          41.3836,
          2.1828
        ],
        "description": "La Vinya del Senyor is a wine-and-small-plates pause directly across from Santa Maria del Mar, ideal for a slower glass with tapas, cheese, conservas, and the basilica in view.",
        "hours": {
          "mon": "12:00 PM-11:00 PM",
          "tue": "12:00 PM-11:00 PM",
          "wed": "12:00 PM-11:00 PM",
          "thu": "12:00 PM-11:30 PM",
          "fri": "12:00 PM-12:00 AM",
          "sat": "12:00 PM-12:00 AM",
          "sun": "12:00 PM-10:30 PM"
        },
        "photo": "https://www.lavinyadelsenyor.es/img/lavinya.png"
      }
    ],
    "sources": [
      {
        "name": "Time Out - El Born bars",
        "url": "https://www.timeout.com/barcelona/bars-and-pubs/el-born-bars"
      },
      {
        "name": "Barcelona Urbana - El Born nightlife guide",
        "url": "https://barcelonaurbana.com/en/blog/el-born-barcelona-nightlife-guide/"
      },
      {
        "name": "El Born neighborhood nightlife",
        "url": "https://www.el-born.com/bars"
      },
      {
        "name": "El Xampanyet profile",
        "url": "https://barsforkings.com/bars/barcelona/el-xampanyet/"
      },
      {
        "name": "Lonely Planet - Barcelona bars",
        "url": "https://www.lonelyplanet.com/spain/barcelona/bars"
      },
      {
        "name": "The Infatuation - Barcelona bars",
        "url": "https://www.theinfatuation.com/barcelona/cuisines/bar"
      },
      {
        "name": "Tripadvisor",
        "url": "https://www.tripadvisor.com"
      }
    ]
  },
  {
    "id": "list-barcelona-born-popular-bars",
    "slug": "barcelona-el-born-popular-bars",
    "seoSlug": "best-bars",
    "seoTitle": "Best Bars in El Born, Barcelona",
    "seoDescription": "Best bars in El Born, Barcelona, including destination cocktail bars, speakeasy-style rooms, high-traffic nightlife, and late-night spots with real momentum.",
    "title": "Born After-Dark Staples",
    "description": "El Born's destination bars turn cocktails into a full evening through hidden entrances, theatrical menus, gin-focused rooms, busy counters, and serious technique. Demand can mean queues, but the neighborhood has more depth than a single famous door.",
    "url": "https://www.google.com/maps/search/el+born+popular+bars+barcelona",
    "category": "Nightlife",
    "location": {
      "city": "Barcelona",
      "neighborhood": "El Born",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-nightlife",
      "name": "R Nightlife",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-21T00:00:00.000Z",
    "stops": [
      {
        "id": "born-paradiso",
        "name": "Paradiso",
        "coordinates": [
          41.3859,
          2.1822
        ],
        "description": "Paradiso is the Born's headline cocktail attraction: a hidden-door room with theatrical drinks, global recognition, and enough demand that the visit should be treated as the night's main event rather than a quick drink between stops.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://paradiso.cat/wp-content/uploads/2020/06/bck_premios-scaled_op.jpg"
      },
      {
        "id": "born-collage",
        "name": "Collage Cocktail Bar",
        "coordinates": [
          41.385,
          2.182
        ],
        "description": "Collage Cocktail Bar is a colorful El Born craft-cocktail room with enough space and energy for groups, offering polished drinks without the neighborhood's most difficult trophy-bar queue.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://privateaser-media.s3.eu-west-1.amazonaws.com/etab_photos/49629/1500x750/462803.jpg"
      },
      {
        "id": "born-creps",
        "name": "Creps al Born",
        "coordinates": [
          41.3844,
          2.182
        ],
        "description": "Creps al Born is the lively Born staple for cocktails, crepes, and late-night looseness in one room.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://www.crepsalborn.com/wp-content/uploads/2023/11/8-04-2023-CrepsFarola@NilCalvarons-28.jpg"
      },
      {
        "id": "born-stravinsky",
        "name": "Dr. Stravinsky",
        "coordinates": [
          41.3858,
          2.1804
        ],
        "description": "Dr. Stravinsky is a serious El Born cocktail laboratory built around in-house infusions, distillations, and signatures that reward attention.",
        "hours": {
          "mon": "5:00 PM-2:00 AM",
          "tue": "5:00 PM-2:00 AM",
          "wed": "5:00 PM-2:00 AM",
          "thu": "5:00 PM-2:00 AM",
          "fri": "12:00 PM-4:30 PM, 5:00 PM-3:00 AM",
          "sat": "12:00 PM-4:30 PM, 5:00 PM-3:00 AM",
          "sun": "12:00 PM-4:30 PM, 5:00 PM-2:00 AM"
        },
        "photo": "https://drstravinsky.cat/wp-content/uploads/2022/10/08.jpg"
      },
      {
        "id": "born-mariposa-negra",
        "name": "Mariposa Negra",
        "coordinates": [
          41.3849,
          2.1819
        ],
        "description": "Mariposa Negra is a moody El Born cocktail bar with dramatic interior styling, destination-level drinks, and enough demand to create a line.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://mariposanegrabar.com/wp-content/uploads/menu-16.jpg"
      },
      {
        "id": "born-dux",
        "name": "Dux",
        "coordinates": [
          41.3863,
          2.1807
        ],
        "description": "Dux is a polished, busy El Born bar focused on gin and cocktails. Gin and tonics and familiar classics make it less theatrical than the neighborhood's high-concept tasting rooms while still feeling sharper than a casual pub.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://duxborne.com/wp-content/uploads/2024/10/Dux-gintonic-bar-3.webp"
      }
    ],
    "sources": [
      {
        "name": "World's 50 Best Bars - Paradiso",
        "url": "https://www.theworlds50best.com/bars/the-list/paradiso.html"
      },
      {
        "name": "Paradiso official",
        "url": "https://www.paradiso.cat"
      },
      {
        "name": "Condé Nast Traveler - Paradiso",
        "url": "https://www.cntraveler.com/bars/barcelona/paradiso"
      },
      {
        "name": "Time Out - El Born bars",
        "url": "https://www.timeout.com/barcelona/bars-and-pubs/el-born-bars"
      },
      {
        "name": "Barcelona Urbana - El Born nightlife guide",
        "url": "https://barcelonaurbana.com/en/blog/el-born-barcelona-nightlife-guide/"
      },
      {
        "name": "The Infatuation - Barcelona bars",
        "url": "https://www.theinfatuation.com/barcelona/cuisines/bar"
      },
      {
        "name": "Lonely Planet - Barcelona bars",
        "url": "https://www.lonelyplanet.com/spain/barcelona/bars"
      },
      {
        "name": "Tripadvisor",
        "url": "https://www.tripadvisor.com"
      }
    ]
  },
  {
    "id": "list-barcelona-gothic-dive-bars",
    "slug": "barcelona-gothic-quarter-dive-bars",
    "seoSlug": "best-dive-bars",
    "seoTitle": "Best Dive Bars in the Gothic Quarter, Barcelona",
    "seoDescription": "Best dive bars in the Gothic Quarter, Barcelona, from old-city counter bars and gritty classics to late-night locals with real neighborhood character.",
    "title": "Old-City Hideout Bars",
    "description": "Gothic Quarter nightlife is strongest in scuffed old bars, art-historical rooms, and small hideouts that retain a reason to exist beyond tourist footfall.",
    "url": "https://www.google.com/maps/search/gothic+quarter+dive+bars+barcelona",
    "category": "Nightlife",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Gothic Quarter",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-nightlife",
      "name": "R Nightlife",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-21T00:00:00.000Z",
    "stops": [
      {
        "id": "gothic-la-plata",
        "name": "Bar La Plata",
        "coordinates": [
          41.3818,
          2.1799
        ],
        "description": "Bar La Plata is the Gothic Quarter's standing-bar: short menu, fast service, and a vermouth rhythm that feels older than the surrounding tourist churn.",
        "hours": {
          "mon": "12:00 PM-12:30 AM",
          "tue": "12:00 PM-12:30 AM",
          "wed": "12:00 PM-12:30 AM",
          "thu": "12:00 PM-1:30 AM",
          "fri": "12:00 PM-2:00 AM",
          "sat": "12:00 PM-2:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://barlaplata.com/wp-content/uploads/2025/11/ferran-nadeu4.png?w=4000&h="
      },
      {
        "id": "gothic-manchester",
        "name": "Manchester Bar",
        "coordinates": [
          41.3828,
          2.1736
        ],
        "description": "Manchester Bar is a Gothic Quarter bar for indie-rock atmosphere, dark-room drinking, and a less polished old-city crowd.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://a1.elespanol.com/metropoliabierta/2024/06/03/el-pulso-de-la-ciudad/860174022_13031835_1706x960.jpg"
      },
      {
        "id": "gothic-oviso",
        "name": "Bar Oviso",
        "coordinates": [
          41.3824,
          2.1739
        ],
        "description": "Bar Oviso is a compact Gothic starter: low-key beers, easy conversation, and enough old-city location value to make the next stop simple.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://www.laramblabarcelona.com/wp-content/uploads/2018/02/bar-oviso.jpg"
      },
      {
        "id": "gothic-lobo",
        "name": "Bar Lobo",
        "coordinates": [
          41.3837,
          2.1711
        ],
        "description": "Bar Lobo is a larger all-day Gothic Quarter room serving food and drinks with enough seating to carry service from afternoon into evening.",
        "hours": {
          "mon": "12:00 PM-12:30 AM",
          "tue": "12:00 PM-12:30 AM",
          "wed": "12:00 PM-12:30 AM",
          "thu": "12:00 PM-1:30 AM",
          "fri": "12:00 PM-2:00 AM",
          "sat": "12:00 PM-2:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://media.timeout.com/images/100628653/image.jpg"
      },
      {
        "id": "gothic-nevermind",
        "name": "Nevermind",
        "coordinates": [
          41.3814,
          2.1744
        ],
        "description": "Nevermind is a skate-and-grunge late bar with loud music, casual drinks, and a rough visual identity. It delivers young, noisy dive-bar energy rather than polished cocktail service.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/72/76/ea/la-barra-mas-larga-de.jpg?w=1200&h=-1&s=1"
      },
      {
        "id": "gothic-els-quatre-gats",
        "name": "Els Quatre Gats",
        "coordinates": [
          41.3853,
          2.1756
        ],
        "description": "Els Quatre Gats is an art nouveau-style cafe, restaurant, and tavern opened in 1896, tied to Barcelona's modernista and Picasso-era history. Go earlier for the room, the heritage, and a meal or drink that feels more cultural than late-night.",
        "hours": {
          "mon": "12:00 PM-11:00 PM",
          "tue": "12:00 PM-11:00 PM",
          "wed": "12:00 PM-11:00 PM",
          "thu": "12:00 PM-11:30 PM",
          "fri": "12:00 PM-12:00 AM",
          "sat": "12:00 PM-12:00 AM",
          "sun": "12:00 PM-10:30 PM"
        },
        "photo": "https://4gats.com/wp-content/uploads/2026/04/4gats-taverna.jpg"
      }
    ],
    "sources": [
      {
        "name": "Time Out - Gothic Quarter bars",
        "url": "https://www.timeout.com/barcelona/bars-and-pubs/gothic-quarter-bars"
      },
      {
        "name": "The Culture Trip - Gothic bars",
        "url": "https://theculturetrip.com/europe/spain/articles/best-bars-in-the-gothic-quarter-barcelona"
      },
      {
        "name": "ShBarcelona - Gothic Quarter bars",
        "url": "https://www.shbarcelona.com/blog/en/best-bars-gothic-quarter/"
      },
      {
        "name": "Barcelona Turisme",
        "url": "https://www.barcelonaturisme.com"
      },
      {
        "name": "Ajuntament de Barcelona - Gothic Quarter listings",
        "url": "https://guia.barcelona.cat"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      },
      {
        "name": "Tripadvisor",
        "url": "https://www.tripadvisor.com"
      }
    ]
  },
  {
    "id": "list-barcelona-gothic-popular-bars",
    "slug": "barcelona-gothic-quarter-popular-nightlife",
    "seoSlug": "best-bars",
    "seoTitle": "Best Bars in the Gothic Quarter, Barcelona",
    "seoDescription": "Best bars in the Gothic Quarter, Barcelona, including cocktail rooms, live-music venues, busy old-city nightlife, and Plaça Reial late-night anchors.",
    "title": "Plaça Reial Night Machines",
    "description": "The Gothic Quarter’s larger nights cluster around Plaça Reial and the surrounding old-city lanes, mixing live jazz, club programming, cocktails, and all-day rooms that run late. Check the event format before arriving: the same venue may shift from a seated concert to a crowded dance floor.",
    "url": "https://www.google.com/maps/search/gothic+quarter+popular+nightlife+barcelona",
    "category": "Nightlife",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Gothic Quarter",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-nightlife",
      "name": "R Nightlife",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-21T00:00:00.000Z",
    "stops": [
      {
        "id": "gothic-milk",
        "name": "Milk Bar & Bistro",
        "coordinates": [
          41.3799,
          2.1762
        ],
        "description": "Milk Bar & Bistro is an all-day Gothic Quarter room near Placa Reial serving eggs, bagels, comfort food, brunch cocktails, and later drinks.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://milkbarcelona.com/wp-content/uploads/2023/02/bagel-682x1024.jpg"
      },
      {
        "id": "gothic-harlem",
        "name": "Harlem Jazz Club",
        "coordinates": [
          41.3819,
          2.176
        ],
        "description": "Harlem Jazz Club programs jazz, funk, and touring live sets in an intimate room in the old-city core.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://www.harlemjazzclub.es/wp-content/uploads/2020/06/Harlem-Jazz-Club-selection-153.jpg"
      },
      {
        "id": "gothic-marula-cafe",
        "name": "Marula Café",
        "coordinates": [
          41.3787,
          2.1751
        ],
        "description": "Marula Café is a compact Escudellers music room where funk, soul, Afrobeat, Latin sessions, and DJs carry concerts into late dancing. The official agenda matters more than a fixed weekly genre promise.",
        "hours": {
          "default": "Venue opening hours are fixed by day; concert formats and individual start times are published in the official agenda",
          "mon": "Closed",
          "tue": "Closed",
          "wed": "10:30 PM-5:00 AM",
          "thu": "10:30 PM-5:00 AM",
          "fri": "Concerts 10:00 PM-12:00 AM; DJ sessions 12:00 AM-6:00 AM",
          "sat": "Concerts 10:00 PM-12:00 AM; DJ sessions 12:00 AM-6:00 AM",
          "sun": "9:30 PM-4:30 AM"
        },
        "photo": "https://marulacafe.com/wp-content/uploads/2025/02/sala-home2-1.jpg"
      },
      {
        "id": "gothic-ocana",
        "name": "Ocaña",
        "coordinates": [
          41.3803,
          2.1753
        ],
        "description": "Ocaña spreads a café, restaurant, cocktail bar, and late room across Plaça Reial, making it useful when a group wants dinner, drinks, and nightlife without changing addresses.",
        "hours": {
          "mon": "8:30 AM-3:00 AM",
          "tue": "8:30 AM-3:00 AM",
          "wed": "8:30 AM-3:00 AM",
          "thu": "8:30 AM-3:00 AM",
          "fri": "8:30 AM-3:00 AM",
          "sat": "8:30 AM-3:00 AM",
          "sun": "8:30 AM-3:00 AM"
        },
        "photo": "https://www.ocana.cat/content/uploads/2019/12/7F6A5278.jpg"
      },
      {
        "id": "gothic-jamboree",
        "name": "Jamboree",
        "coordinates": [
          41.3802,
          2.1757
        ],
        "description": "Jamboree is a Plaça Reial institution with decades of jazz, live music, and late club programming behind it. Check the night's format, because the room can operate as a seated concert venue or a full dance floor.",
        "hours": {
          "default": "Performance, doors, and club start times are published per event on the official event calendar"
        },
        "photo": "https://offloadmedia.feverup.com/barcelonasecreta.com/wp-content/uploads/2025/11/07103833/d5dc3e42-58ab-11ef-9897-42b55136ae18-1.jpg"
      }],
    "sources": [
      {
        "name": "Jamboree official",
        "url": "https://jamboreejazz.com/en/"
      },
      {
        "name": "Barcelona.cat - Jamboree",
        "url": "https://www.barcelona.cat/es/que-hacer-en-bcn/cultura/detall/jamboree-92205145712"
      },
      {
        "name": "Time Out - Gothic Quarter bars",
        "url": "https://www.timeout.com/barcelona/bars-and-pubs/gothic-quarter-bars"
      },
      {
        "name": "The Culture Trip - Gothic bars",
        "url": "https://theculturetrip.com/europe/spain/articles/best-bars-in-the-gothic-quarter-barcelona"
      },
      {
        "name": "ShBarcelona - Gothic Quarter bars",
        "url": "https://www.shbarcelona.com/blog/en/best-bars-gothic-quarter/"
      },
      {
        "name": "Barcelona Secreta - Jamboree",
        "url": "https://barcelonasecreta.com/en/jamboree-barcelona-club-jazz-concerts/"
      },
      {
        "name": "Tripadvisor",
        "url": "https://www.tripadvisor.com"
      }
    ]
  },
  {
    "id": "list-barcelona-gracia-dive-bars",
    "slug": "barcelona-gracia-dive-bars",
    "seoSlug": "best-dive-bars",
    "seoTitle": "Best Dive Bars in Gràcia, Barcelona",
    "seoDescription": "Best dive bars in Gràcia, Barcelona, covering smaller neighborhood bars, bodegas, natural-wine stops, vermouth rooms, and relaxed late-night hangouts.",
    "title": "Village Bars with Regulars",
    "description": "Gràcia’s casual bars sit among residential squares and neighborhood streets, where bodegas, vermouth counters, natural-wine rooms, and relaxed late bars serve a regular local crowd. Conversation and simple food take priority over club volume; most places suit an unhurried early evening or a small group.",
    "url": "https://www.google.com/maps/search/gracia+dive+bars+barcelona",
    "category": "Nightlife",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Gràcia",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-nightlife",
      "name": "R Nightlife",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-21T00:00:00.000Z",
    "stops": [
      {
        "id": "gracia-canigo",
        "name": "Bar Canigó",
        "coordinates": [
          41.4012,
          2.1609
        ],
        "description": "Bar Canigó is a Gracia all-day staple, moving from breakfast and lunch to tapas, vermouth, and casual beer as the plaza fills. Regulars and routine matter more than destination-cocktail polish.",
        "hours": {
          "mon": "12:00 PM-11:00 PM",
          "tue": "12:00 PM-11:00 PM",
          "wed": "12:00 PM-11:00 PM",
          "thu": "12:00 PM-11:30 PM",
          "fri": "12:00 PM-12:00 AM",
          "sat": "12:00 PM-12:00 AM",
          "sun": "12:00 PM-10:30 PM"
        },
        "photo": "https://www.barcanigo.com/assets/img/bar/BarCanigo_1.jpg"
      },
      {
        "id": "gracia-bodega-quimet",
        "name": "Bodega Quimet",
        "coordinates": [
          41.4041,
          2.156
        ],
        "description": "Bodega Quimet is a Gràcia tavern that preserves the charm of an old neighborhood bodega: award-winning house vermouth, shelves of bottles, and a strong tapas menu built for anchovies, conservas, cheese, and easy early-evening grazing.",
        "hours": {
          "mon": "12:00 PM-11:00 PM",
          "tue": "12:00 PM-11:00 PM",
          "wed": "12:00 PM-11:00 PM",
          "thu": "12:00 PM-11:30 PM",
          "fri": "12:00 PM-12:00 AM",
          "sat": "12:00 PM-12:00 AM",
          "sun": "12:00 PM-10:30 PM"
        },
        "photo": "https://www.bodegaquimet.com/img-trans/productos/24272/fotos/1024-67ac8f5bebe2f-bar-bodega-quimet.png"
      },
      {
        "id": "gracia-fourmi",
        "name": "La Fourmi",
        "coordinates": [
          41.4026,
          2.1582
        ],
        "description": "La Fourmi is a relaxed Gracia social bar with low-pressure drinks, informal service, and the warmth of a neighborhood room built for conversation. It suits groups that want atmosphere without club volume or cocktail ceremony.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://www.barcelona-life.com/wp-content/uploads/2018/02/la-fourmi-barcelona.jpg"
      },
      {
        "id": "gracia-la-rovira",
        "name": "La Rovira",
        "coordinates": [
          41.4063,
          2.1599
        ],
        "description": "La Rovira is an all-day Gràcia bar for craft beer, vermouth, generous plates, and the easy neighborhood overlap between lunch tables and late drinks.",
        "hours": {
          "mon": "9:00 AM-12:00 AM",
          "tue": "9:00 AM-12:00 AM",
          "wed": "9:00 AM-12:00 AM",
          "thu": "9:00 AM-12:00 AM",
          "fri": "9:00 AM-1:00 AM",
          "sat": "9:00 AM-1:00 AM",
          "sun": "9:00 AM-12:00 AM"
        },
        "photo": "https://larovirabcn.com/wp-content/uploads/2024/02/rov19.jpg"
      },
            {
        "id": "gracia-salvatge",
        "name": "Bar Salvatge",
        "coordinates": [
          41.4021,
          2.1611
        ],
        "description": "Bar Salvatge is a funky, rustic-chic Gràcia storefront where natural wines meet local cuisine, cheeses, and snackable plates.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFsd6zsGYD1agNYVeDH-ygggbhXVmvwxrlGPtWu9RWU49DyeBpNEZ8tZ771kvQmJbwM0xeV5L0BzV5vjjI9JkDnpcjazIQgHRMaHFvzt2imlyqDQTNslVfZDlY8-3vXqqX_R1b0E1mrnlwL=s1360-w1360-h1020-rw"
      }
    ],
    "sources": [
      {
        "name": "Time Out - Gràcia bars",
        "url": "https://www.timeout.com/barcelona/bars-and-pubs/gracia-bars"
      },
      {
        "name": "Lonely Planet - Gràcia bars",
        "url": "https://www.lonelyplanet.com/spain/barcelona/gracia/bars"
      },
      {
        "name": "Bodega Quimet official",
        "url": "https://www.bodegaquimet.com/en/inicio"
      },
      {
        "name": "Fem Gràcia - Bobby Gin",
        "url": "https://www.femgracia.cat/es/negocio/bobby-gin"
      },
      {
        "name": "Barcelona Urbana - Gin and tonic bars",
        "url": "https://barcelonaurbana.com/en/blog/best-gin-tonic-bars-barcelona/"
      },
      {
        "name": "Barcelona Turisme",
        "url": "https://www.barcelonaturisme.com"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-barcelona-gracia-popular-bars",
    "slug": "barcelona-gracia-popular-nightlife",
    "seoSlug": "best-bars",
    "seoTitle": "Best Bars in Gràcia, Barcelona",
    "seoDescription": "Best bars in Gràcia, Barcelona, including plaza nightlife, independent music rooms, classic cocktail spots, and stronger destination bars with event pull.",
    "title": "Gràcia Nights That Travel",
    "description": "Gràcia’s busier bars remain smaller than central-city clubs, pairing plaza terraces and independent music rooms with polished gin, whisky, and classic-cocktail counters. Terrace tables accommodate casual groups; the smallest cocktail rooms have limited seating and are easiest for pairs.",
    "url": "https://www.google.com/maps/search/gracia+popular+nightlife+barcelona",
    "category": "Nightlife",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Gràcia",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-nightlife",
      "name": "R Nightlife",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-21T00:00:00.000Z",
    "stops": [
      {
        "id": "gracia-sol-de-nit",
        "name": "Sol de Nit",
        "coordinates": [
          41.4014,
          2.1577
        ],
        "description": "Sol de Nit is a popular Gracia plaza bar defined by terrace spill, a social crowd, and casual drinks in the open air.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/52/87/54/photo1jpg.jpg?w=1600&h=-1&s=1"
      },
      {
        "id": "gracia-heliogabal",
        "name": "Heliogàbal",
        "coordinates": [
          41.4029,
          2.1588
        ],
        "description": "Heliogàbal is a Gràcia music-room bar, pairing independent programming with a bar scale that still feels neighborhood-specific.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://www.heliogabal.com/wp-content/uploads/2021/10/Foto-Helio.jpg"
      },
      {
        "id": "gracia-bobby-gin",
        "name": "Bobby Gin",
        "coordinates": [
          41.3999,
          2.1582
        ],
        "description": "Bobby Gin gives Gràcia a destination cocktail reason beyond the center, especially for gin-and-tonic drinkers who care about the serve. It is polished enough for a planned stop but still works within a neighborhood night instead of replacing it.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://www.bobbygin.com/wp-content/uploads/2021/09/ginfonk_coleccio%CC%81n_web.jpeg"
      },
      {
        "id": "gracia-14-de-la-rosa",
        "name": "14 De La Rosa",
        "coordinates": [
          41.4008,
          2.1585
        ],
        "description": "14 De La Rosa is a narrow Gràcia cocktail bar with a serious back bar, low light, and measured classics that reward sitting down instead of collecting another plaza round.",
        "hours": {
          "sun": "Closed",
          "mon": "5:00 PM-2:00 AM",
          "tue": "5:00 PM-2:00 AM",
          "wed": "5:00 PM-2:00 AM",
          "thu": "5:00 PM-2:00 AM",
          "fri": "5:00 PM-3:00 AM",
          "sat": "5:00 PM-3:00 AM"
        },
        "photo": "https://images.squarespace-cdn.com/content/v1/5beb225b55b02cd32247f7a4/1542137261737-L3LDP01VWQ6BJG3J2504/D760CC4C-FBA6-4ACA-9190-2102AA5F2046.jpeg?format=1500w"
      },
      {
        "id": "gracia-elephanta",
        "name": "Elephanta",
        "coordinates": [
          41.4028,
          2.1576
        ],
        "description": "Elephanta gives the Gràcia list a cozy gin-and-cocktail room with softer lighting and a strong neighborhood following.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://elephanta.cat/wp-content/uploads/2022/10/slider-elephanta-2.jpg"
      },
      {
        "id": "gracia-old-fashioned",
        "name": "The Original Old Fashioned",
        "coordinates": [
          41.3981,
          2.1596
        ],
        "description": "The Original Old Fashioned is a tiny speakeasy-inspired Gràcia cocktail bar built around old-fashioneds, whisky, gin, and careful classics.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/31/55/6f/a7/smoked-old-fashioned.jpg?w=1100&h=-1&s=1"
      }
    ],
    "sources": [
      {
        "name": "Bobby Gin official",
        "url": "https://www.bobbygin.com/en/"
      },
      {
        "name": "Old Fashioned official",
        "url": "https://www.theoriginaloldfashioned.com/"
      },
      {
        "name": "Elephanta official",
        "url": "https://elephanta.cat/es/contacto/"
      },
      {
        "name": "Condé Nast Traveler - Old Fashioned",
        "url": "https://www.cntraveler.com/bars/barcelona/old-fashioned-gin-tonic-and-cocktail-bar"
      },
      {
        "name": "Condé Nast Traveler - Best bars in Barcelona",
        "url": "https://www.cntraveler.com/gallery/best-bars-in-barcelona"
      },
      {
        "name": "Time Out - Gràcia bars",
        "url": "https://www.timeout.com/barcelona/bars-and-pubs/gracia-bars"
      },
      {
        "name": "Lonely Planet - Gràcia bars",
        "url": "https://www.lonelyplanet.com/spain/barcelona/gracia/bars"
      },
      {
        "name": "Barcelona Urbana - Gin and tonic bars",
        "url": "https://barcelonaurbana.com/en/blog/best-gin-tonic-bars-barcelona/"
      },
      {
        "name": "Fem Gràcia - Elephanta",
        "url": "https://www.femgracia.cat/es/negocio/elephanta-ginbar-cocteleria"
      },
      {
        "name": "Barcelona Turisme",
        "url": "https://www.barcelonaturisme.com"
      }
    ]
  },
  {
    "id": "list-barcelona-poblesec-dive-bars",
    "slug": "barcelona-poble-sec-dive-bars",
    "seoSlug": "best-dive-bars",
    "seoTitle": "Best Dive Bars in Poble-sec, Barcelona",
    "seoDescription": "Best dive bars in Poble-sec, Barcelona, from old-school bodegas and Carrer de Blai pintxos stops to standing-room tapas bars and neighborhood drinks.",
    "title": "Bodega Crawl on Blai",
    "description": "Poble-sec nightlife lets small plates, vermouth, wine, and bar drinking share the same streets. Blai's counters stay casual while more substantial kitchens keep the area from becoming pure grazing.",
    "url": "https://www.google.com/maps/search/poble+sec+dive+bars+barcelona",
    "category": "Nightlife",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Poble-sec",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-nightlife",
      "name": "R Nightlife",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-21T00:00:00.000Z",
    "stops": [
      {
        "id": "poblesec-bodega-salto",
        "name": "Bodega Saltó",
        "coordinates": [
          41.3726,
          2.1673
        ],
        "description": "Bodega Saltó is a Poble-sec character bar, with eccentric decor, old-bodega energy, and a room that feels more bohemian than polished.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "attributeTags": [
          "dive_bars",
          "old_school",
          "local_bar",
          "casual_nightlife"
        ],
        "photo": "https://bodegasalto.net/wp-content/uploads/2023/05/milkers-bodega-vinos-salto-barcelona-poble-sec.jpeg"
      },
            {
        "id": "poblesec-tasqueta-blai",
        "name": "La Tasqueta de Blai",
        "coordinates": [
          41.3737,
          2.1669
        ],
        "description": "La Tasqueta de Blai explains Carrer de Blai through crowded counters, inexpensive pintxos, and quick turnover. The format favors several fast bites over a lingering dinner.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "attributeTags": [
          "dive_bars",
          "pintxos",
          "crawl_stop",
          "casual_nightlife"
        ],
        "photo": "https://cdn.prod.website-files.com/5ebbeb680f69fd550e86ffe0/646b2281b0cb4aa3d71740c5__DSC8523.jpg"
      },
      {
        "id": "poblesec-quimet-quimet",
        "name": "Quimet & Quimet",
        "coordinates": [
          41.3738,
          2.1635
        ],
        "description": "Go early, keep the visit compact, and let it launch the rest of the Blai or Paral·lel evening.",
        "hours": {
          "mon": "12:00 PM-11:00 PM",
          "tue": "12:00 PM-11:00 PM",
          "wed": "12:00 PM-11:00 PM",
          "thu": "12:00 PM-11:30 PM",
          "fri": "12:00 PM-12:00 AM",
          "sat": "12:00 PM-12:00 AM",
          "sun": "12:00 PM-10:30 PM"
        },
        "attributeTags": [
          "dive_bars",
          "standing_room",
          "montaditos",
          "local_bar"
        ],
        "photo": "https://quimetiquimet.com/wp-content/uploads/tapbg.jpg"
      },
      {
        "id": "poblesec-abirradero",
        "name": "Abirradero",
        "coordinates": [
          41.374,
          2.1703
        ],
        "description": "Abirradero broadens the Poble-sec crawl beyond vermouth and pintxos with craft beer, casual food, and a taproom pace.",
        "hours": {
          "mon": "12:00 PM-12:30 AM",
          "tue": "12:00 PM-12:30 AM",
          "wed": "12:00 PM-12:30 AM",
          "thu": "12:00 PM-1:30 AM",
          "fri": "12:00 PM-2:00 AM",
          "sat": "12:00 PM-2:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "attributeTags": [
          "dive_bars",
          "craft_beer",
          "taproom",
          "casual_nightlife"
        ],
        "photo": "http://static1.squarespace.com/static/612df270cb5b2832a82ac1c4/t/612df30039503c777eeea6c1/1630401280673/Abirradero+White.png?format=1500w"
      },
      {
        "id": "poblesec-platilleria",
        "name": "La Platilleria",
        "coordinates": [
          41.3746,
          2.1658
        ],
        "description": "La Platilleria gives the Poble-sec set a warmer small-plates rhythm, where dinner can stay casual and still feel chosen.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "attributeTags": [
          "dive_bars",
          "small_plates",
          "local_bar",
          "casual_nightlife"
        ],
        "photo": "https://media-cdn.tripadvisor.com/media/photo-o/09/24/e4/7a/la-platilleria.jpg"
      }
    ],
    "sources": [
      {
        "name": "Bodega Saltó official",
        "url": "https://bodegasalto.net/"
      },
      {
        "name": "Quimet & Quimet official",
        "url": "https://quimetiquimet.com/en/"
      },
      {
        "name": "Time Out - Poble-sec bars",
        "url": "https://www.timeout.com/barcelona/bars-and-pubs/poble-sec-bars"
      },
            {
        "name": "Barcelona Food Experience - Abirradero",
        "url": "https://www.barcelonafoodexperience.com/blog/abirradero"
      },
      {
        "name": "Barcelona Urbana - Poble-sec guide",
        "url": "https://barcelonaurbana.com/en/blog/poble-sec-barcelona-guide/"
      },
      {
        "name": "The Culture Trip - Poble-sec bars",
        "url": "https://theculturetrip.com/europe/spain/articles/best-bars-in-poble-sec-barcelona"
      },
      {
        "name": "Tripadvisor - Abirradero",
        "url": "https://www.tripadvisor.com/Restaurant_Review-g187497-d8738631-Reviews-Abirradero-Barcelona_Catalonia.html"
      },
      {
        "name": "Tripadvisor",
        "url": "https://www.tripadvisor.com"
      }
    ]
  },
  {
    "id": "list-barcelona-poblesec-popular-bars",
    "slug": "barcelona-poble-sec-popular-nightlife",
    "seoSlug": "best-bars",
    "seoTitle": "Best Bars in Poble-sec, Barcelona",
    "seoDescription": "Best bars in Poble-sec, Barcelona, including club anchors, queer-friendly cocktail rooms, theater-adjacent nightlife, and bigger venues with citywide draw.",
    "title": "Apolo Orbit and Big Nights",
    "description": "Poble-sec gets louder as you move toward Parallel, where the night can turn theatrical, queer, electronic, or just very late. Tinta Roja and Plataforma add cabaret, performance, and dance-floor voltage to the Apolo orbit.",
    "url": "https://www.google.com/maps/search/poble+sec+popular+nightlife+barcelona",
    "category": "Nightlife",
    "location": {
      "city": "Barcelona",
      "neighborhood": "Poble-sec",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-nightlife",
      "name": "R Nightlife",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-21T00:00:00.000Z",
    "stops": [
      {
        "id": "poblesec-federica",
        "name": "La Federica",
        "coordinates": [
          41.3736,
          2.1675
        ],
        "description": "La Federica is a laid-back LGBTQ haunt for cocktails, tapas, music, and regular exhibitions by local artists.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://static.wixstatic.com/media/aafec2_a01876c86998443b9556e126d5222a3d~mv2.jpg/v1/fill/w_640,h_364,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image-empty-state.jpg"
      },
      {
        "id": "poblesec-apolo",
        "name": "Sala Apolo",
        "coordinates": [
          41.3752,
          2.1696
        ],
        "description": "Sala Apolo is a multi-room Poble-sec club and concert institution programming electronic music, indie nights, and live shows through changing promoters. The event calendar, not casual drop-in bar service, determines the experience.",
        "hours": {
          "mon": "10:00 PM-2:30 AM",
          "tue": "10:00 PM-2:30 AM",
          "wed": "10:00 PM-3:30 AM",
          "thu": "10:00 PM-4:30 AM",
          "fri": "10:00 PM-5:00 AM",
          "sat": "10:00 PM-5:00 AM",
          "sun": "10:00 PM-2:30 AM"
        },
        "photo": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/16/c1/df/sala-apolo.jpg?w=900&h=500&s=1"
      },
      {
        "id": "poblesec-laut",
        "name": "LAUT",
        "coordinates": [
          41.3734,
          2.1686
        ],
        "description": "LAUT gives Poble-sec a smaller electronic-club option for focused late sessions and local programming. It is the better fit when Apolo feels too massive but the night still needs a proper dance-floor endpoint.",
        "hours": {
          "mon": "10:00 PM-2:30 AM",
          "tue": "10:00 PM-2:30 AM",
          "wed": "10:00 PM-3:30 AM",
          "thu": "10:00 PM-4:30 AM",
          "fri": "10:00 PM-5:00 AM",
          "sat": "10:00 PM-5:00 AM",
          "sun": "10:00 PM-2:30 AM"
        },
        "photo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3bjhFJWGM2XXZ8F-6JTgeCj11Br6jdyaTkw&s"
      },
      {
        "id": "poblesec-tinta-roja",
        "name": "Tinta Roja",
        "coordinates": [
          41.3717,
          2.1655
        ],
        "description": "Tinta Roja is a 1920s-style theater cafe in a former dairy, with tango, Latin music, cabaret, and artistic events shaping the night.",
        "hours": {
          "mon": "Event schedule (check venue)",
          "tue": "Event schedule (check venue)",
          "wed": "Event schedule (check venue)",
          "thu": "Event schedule (check venue)",
          "fri": "Event schedule (check venue)",
          "sat": "Event schedule (check venue)",
          "sun": "Event schedule (check venue)"
        },
        "photo": "https://www.tinta-roja.cat/assets/stage-efd6962d772f677e9b2745b2e3b9f3b59e18690bc7f707dad2cfdc729e512ac5.jpg"
      },
            {
        "id": "poblesec-plataforma",
        "name": "Plataforma",
        "coordinates": [
          41.3742,
          2.1673
        ],
        "description": "Plataforma is a less polished late club above Parallel, programming alternative, pop, rock, and throwback DJ nights.",
        "hours": {
          "mon": "10:00 PM-2:30 AM",
          "tue": "10:00 PM-2:30 AM",
          "wed": "10:00 PM-3:30 AM",
          "thu": "10:00 PM-4:30 AM",
          "fri": "10:00 PM-5:00 AM",
          "sat": "10:00 PM-5:00 AM",
          "sun": "10:00 PM-2:30 AM"
        },
        "photo": "https://images.ctfassets.net/a4oylpwiu3rz/1Y44Rp2be5pIEvlAMxoI2V/113ed3f50f8ba0b82b0f515161f16e41/Plataforma.jpg"
      }
    ],
    "sources": [
      {
        "name": "Sala Apolo official",
        "url": "https://www.sala-apolo.com/en/about"
      },
      {
        "name": "Time Out - Sala Apolo",
        "url": "https://www.timeout.com/barcelona/clubs/sala-apolo"
      },
      {
        "name": "LAUT official",
        "url": "https://laut.es/info"
      },
      {
        "name": "Time Out - LAUT",
        "url": "https://www.timeout.com/barcelona/clubs/laut"
      },
      {
        "name": "Barcelona.cat - Sala LAUT",
        "url": "https://www.barcelona.cat/en/what-to-do-in-bcn/culture/auditoria/sala-laut-99400669414"
      },
      {
        "name": "Tinta Roja official",
        "url": "https://www.tinta-roja.cat/en"
      },
      {
        "name": "Time Out - Tinta Roja",
        "url": "https://www.timeout.com/barcelona/music-and-nightlife/tinta-roja"
      },
      {
        "name": "La Federica - Barcelona city listing",
        "url": "https://ajuntament.barcelona.cat/dretsidiversitat/es/detail/bar-la-federica_99400738981"
      },
            {
        "name": "Plataforma - The Bar España",
        "url": "https://es.thebar.com/locales/discotecas-clubs/bacelona/plataforma"
      },
      {
        "name": "Time Out - Poble-sec bars",
        "url": "https://www.timeout.com/barcelona/bars-and-pubs/poble-sec-bars"
      },
      {
        "name": "The Culture Trip - Poble-sec bars",
        "url": "https://theculturetrip.com/europe/spain/articles/best-bars-in-poble-sec-barcelona"
      },
      {
        "name": "Barcelona Yellow - Sala Apolo",
        "url": "https://www.barcelonayellow.com/bcn/nightlife/clubs-lounges/sala-apolo"
      },
      {
        "name": "Tripadvisor",
        "url": "https://www.tripadvisor.com"
      }
    ]
  },
  {
    "id": "list-barcelona-citywide-dive-bars",
    "slug": "barcelona-best-dive-bars-citywide",
    "seoSlug": "best-dive-bars",
    "seoTitle": "Best Dive Bars in Barcelona",
    "seoDescription": "Best dive bars in Barcelona, pulling 10 smaller bar picks from Eixample, El Born, the Gothic Quarter, Gràcia, Raval, and Poble-sec.",
    "title": "Cellars, Counters, and Late-Night Regulars",
    "description": "Barcelona’s character bars are scattered from the Raval and Gothic Quarter to Gràcia, Poble-sec, and Eixample, with old bodegas, cava counters, music bars, and late rooms. Short drinks lists, conservas, vermouth, worn interiors, and standing-room crowds matter more here than cocktail polish.",
    "url": "https://www.google.com/maps/search/best+dive+bars+barcelona",
    "category": "Nightlife",
    "location": {
      "city": "Barcelona",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-nightlife",
      "name": "R Nightlife",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "citywide-dive-bar-marsella",
        "name": "Bar Marsella",
        "coordinates": [
          41.3852,
          2.1619
        ],
        "description": "Bar Marsella is a Raval-edge bar because it brings the strongest old-Barcelona dive-bar identity in the citywide set: absinthe history, worn-in rooms, late-night traffic, and enough grit to counter polished cocktail Barcelona.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "attributeTags": [
          "dive_bars",
          "historic",
          "absinthe",
          "late_night"
        ],
        "photo": "https://www.barcelona-life.com/wp-content/uploads/2018/02/marsella-barcelona.jpg"
      },
      {
        "id": "citywide-dive-el-xampanyet",
        "name": "El Xampanyet",
        "coordinates": [
          41.3847,
          2.1836
        ],
        "description": "El Xampanyet is a packed old-school El Born cava counter for anchovies, conservas, salty snacks, and quick glasses in a tile-lined room.",
        "hours": {
          "mon": "7:00 PM-11:00 PM",
          "tue": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "wed": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "thu": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "fri": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "sat": "12:00 PM-3:30 PM",
          "sun": "Closed"
        },
        "attributeTags": [
          "dive_bars",
          "cava_counter",
          "standing_room",
          "old_school"
        ],
        "photo": "https://www.elxampanyet.com/wp-content/uploads/2024/10/Iriarte_0117-2048x1352.jpg"
      },
      {
        "id": "citywide-dive-la-plata",
        "name": "Bar La Plata",
        "coordinates": [
          41.3818,
          2.1799
        ],
        "description": "Bar La Plata is a Gothic Quarter bar for an old-city bar that does not need a concept. The draw is a short historic menu, house wine/vermouth rhythm, fast service, and a room that still feels specific rather than generic despite its central location.",
        "hours": {
          "mon": "12:00 PM-12:30 AM",
          "tue": "12:00 PM-12:30 AM",
          "wed": "12:00 PM-12:30 AM",
          "thu": "12:00 PM-1:30 AM",
          "fri": "12:00 PM-2:00 AM",
          "sat": "12:00 PM-2:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "attributeTags": [
          "dive_bars",
          "historic",
          "vermouth",
          "local_bar"
        ],
        "photo": "https://barlaplata.com/wp-content/uploads/2025/11/ferran-nadeu4.png?w=4000&h="
      },
      {
        "id": "citywide-dive-canigo",
        "name": "Bar Canigó",
        "coordinates": [
          41.4012,
          2.1609
        ],
        "description": "Bar Canigó is a Gracia all-day staple, moving from breakfast and lunch to tapas, vermouth, and casual beer as the plaza fills. Regulars and routine matter more than destination-cocktail polish.",
        "hours": {
          "mon": "12:00 PM-11:00 PM",
          "tue": "12:00 PM-11:00 PM",
          "wed": "12:00 PM-11:00 PM",
          "thu": "12:00 PM-11:30 PM",
          "fri": "12:00 PM-12:00 AM",
          "sat": "12:00 PM-12:00 AM",
          "sun": "12:00 PM-10:30 PM"
        },
        "attributeTags": [
          "dive_bars",
          "neighborhood_bar",
          "vermouth",
          "casual_nightlife"
        ],
        "photo": "https://www.barcanigo.com/assets/img/bar/BarCanigo_1.jpg"
      },
      {
        "id": "citywide-dive-quimet-quimet",
        "name": "Quimet & Quimet",
        "coordinates": [
          41.3738,
          2.1635
        ],
        "description": "Quimet & Quimet is a Poble-sec bar because it is small, standing-only, and deeply tied to the neighborhood's bottle-and-montadito culture. It is more famous than hidden, but the format is still pure Barcelona: quick pours, tight space, exceptional tins, and a crowd that turns food into bar energy.",
        "hours": {
          "mon": "12:00 PM-11:00 PM",
          "tue": "12:00 PM-11:00 PM",
          "wed": "12:00 PM-11:00 PM",
          "thu": "12:00 PM-11:30 PM",
          "fri": "12:00 PM-12:00 AM",
          "sat": "12:00 PM-12:00 AM",
          "sun": "12:00 PM-10:30 PM"
        },
        "attributeTags": [
          "dive_bars",
          "standing_room",
          "montaditos",
          "local_bar"
        ],
        "photo": "https://quimetiquimet.com/wp-content/uploads/tapbg.jpg"
      },
      {
        "id": "citywide-dive-bodega-salto",
        "name": "Bodega Saltó",
        "coordinates": [
          41.3726,
          2.1673
        ],
        "description": "Bodega Saltó is a Poble-sec character bar: eccentric decor, old-bodega energy, and a room that feels bohemian instead of polished.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "attributeTags": [
          "dive_bars",
          "old_school",
          "local_bar",
          "casual_nightlife"
        ],
        "photo": "https://bodegasalto.net/wp-content/uploads/2023/05/milkers-bodega-vinos-salto-barcelona-poble-sec.jpeg"
      },
      {
        "id": "citywide-dive-manchester",
        "name": "Manchester Bar",
        "coordinates": [
          41.3828,
          2.1736
        ],
        "description": "Manchester Bar is a Gothic Quarter bar for indie-rock atmosphere, dark-room drinking, and a less polished old-city crowd.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "attributeTags": [
          "dive_bars",
          "indie_bar",
          "late_night",
          "casual_nightlife"
        ],
        "photo": "https://a1.elespanol.com/metropoliabierta/2024/06/03/el-pulso-de-la-ciudad/860174022_13031835_1706x960.jpg"
      },
      {
        "id": "citywide-dive-nevermind",
        "name": "Nevermind",
        "coordinates": [
          41.3814,
          2.1744
        ],
        "description": "Nevermind is a skate-and-grunge late bar with loud music, casual drinks, and a rough visual identity. It delivers young, noisy dive-bar energy rather than polished cocktail service.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "attributeTags": [
          "dive_bars",
          "grunge_bar",
          "late_night",
          "casual_nightlife"
        ],
        "photo": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/72/76/ea/la-barra-mas-larga-de.jpg?w=1200&h=-1&s=1"
      },
      {
        "id": "citywide-dive-bodega-quimet",
        "name": "Bodega Quimet",
        "coordinates": [
          41.4041,
          2.156
        ],
        "description": "Bodega Quimet serves house vermouth, conservas, cheese, and early-evening plates among shelves of bottles in Gràcia. The room is quieter than late-night bars and firmly neighborhood-led.",
        "hours": {
          "mon": "12:00 PM-11:00 PM",
          "tue": "12:00 PM-11:00 PM",
          "wed": "12:00 PM-11:00 PM",
          "thu": "12:00 PM-11:30 PM",
          "fri": "12:00 PM-12:00 AM",
          "sat": "12:00 PM-12:00 AM",
          "sun": "12:00 PM-10:30 PM"
        },
        "attributeTags": [
          "dive_bars",
          "bodega",
          "vermouth",
          "local_bar"
        ],
        "photo": "https://www.bodegaquimet.com/img-trans/productos/24272/fotos/1024-67ac8f5bebe2f-bar-bodega-quimet.png"
      },
      {
        "id": "citywide-dive-bar-malasang",
        "name": "Bar Malasang",
        "coordinates": [
          41.3891,
          2.1591
        ],
        "description": "Bar Malasang gives Eixample a low-lit, vinyl-leaning neighborhood hangout that behaves more like a regulars' room than a destination cocktail bar.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "attributeTags": [
          "dive_bars",
          "neighborhood_bar",
          "vinyl_bar",
          "casual_nightlife"
        ],
        "photo": "https://barmalasang.com/wp-content/uploads/2020/11/bar-malasang-f.jpg"
      }
    ],
    "sources": [
      {
        "name": "Time Out - Best bars in Barcelona",
        "url": "https://www.timeout.com/barcelona/bars-and-pubs/best-bars-in-barcelona"
      },
      {
        "name": "Lonely Planet - Barcelona bars",
        "url": "https://www.lonelyplanet.com/spain/barcelona/bars"
      },
      {
        "name": "The Culture Trip - Gothic Quarter bars",
        "url": "https://theculturetrip.com/europe/spain/articles/best-bars-in-the-gothic-quarter-barcelona"
      },
      {
        "name": "The Culture Trip - Poble-sec bars",
        "url": "https://theculturetrip.com/europe/spain/articles/best-bars-in-poble-sec-barcelona"
      },
      {
        "name": "Barcelona Turisme",
        "url": "https://www.barcelonaturisme.com"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-barcelona-citywide-popular-bars",
    "slug": "barcelona-best-popular-bars-citywide",
    "seoSlug": "best-bars",
    "seoTitle": "Best Bars in Barcelona",
    "seoDescription": "Best bars in Barcelona, aggregating the biggest destination cocktail rooms, live-music spots, and high-demand nightlife picks from each neighborhood guide.",
    "title": "Cocktails, Clubs, and Rooms With Gravity",
    "description": "Barcelona's destination nightlife spans major concert halls, multi-room clubs, listening spaces, and bars with distinctive music or drinks. Programming and room character justify the journey across town.",
    "url": "https://www.google.com/maps/search/best+bars+barcelona",
    "category": "Nightlife",
    "location": {
      "city": "Barcelona",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-nightlife",
      "name": "R Nightlife",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "citywide-popular-sips",
        "name": "Sips",
        "coordinates": [
          41.3889,
          2.1567
        ],
        "description": "Sips is the Eixample benchmark because Barcelona's modern cocktail reputation now runs through its Muntaner room. The drinks are precise and theatrical, and the global recognition makes it a planned destination rather than a casual first drink.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://cdn.enprimeurclub.com/storage/v1/object/public/images/locations/recDakVqtmov28sO5/hero1.jpg?width=1200&quality=85&aspect_ratio=1.91%3A1&crop_gravity=center"
      },
      {
        "id": "citywide-popular-paradiso",
        "name": "Paradiso",
        "coordinates": [
          41.3859,
          2.1822
        ],
        "description": "Paradiso is the Born's headline cocktail attraction: a hidden-door room with theatrical drinks, global recognition, and enough demand that the visit should be treated as the night's main event rather than a quick drink between stops.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://paradiso.cat/wp-content/uploads/2020/06/bck_premios-scaled_op.jpg"
      },
      {
        "id": "citywide-popular-jamboree",
        "name": "Jamboree",
        "coordinates": [
          41.3802,
          2.1757
        ],
        "description": "Jamboree turns Plaça Reial into a late-night music room with live sets, club programming, and decades of institutional memory. The format changes by event, from jazz and concerts to DJs and dancing.",
        "hours": {
          "mon": "10:00 PM-2:30 AM",
          "tue": "10:00 PM-2:30 AM",
          "wed": "10:00 PM-3:30 AM",
          "thu": "10:00 PM-4:30 AM",
          "fri": "10:00 PM-5:00 AM",
          "sat": "10:00 PM-5:00 AM",
          "sun": "10:00 PM-2:30 AM"
        },
        "photo": "https://offloadmedia.feverup.com/barcelonasecreta.com/wp-content/uploads/2025/11/07103833/d5dc3e42-58ab-11ef-9897-42b55136ae18-1.jpg"
      },
      {
        "id": "citywide-popular-heliogabal",
        "name": "Heliogàbal",
        "coordinates": [
          41.4029,
          2.1588
        ],
        "description": "Heliogàbal is a Gràcia bar because it brings independent music and neighborhood bar culture together in a way that feels specific to the district. It is smaller than the big old-city venues, but the event pull and local music identity make it a real destination.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://www.heliogabal.com/wp-content/uploads/2021/10/Foto-Helio.jpg"
      },
      {
        "id": "citywide-popular-apolo",
        "name": "Sala Apolo",
        "coordinates": [
          41.3752,
          2.1696
        ],
        "description": "Sala Apolo is a multi-room Poble-sec club and concert institution programming electronic music, indie nights, and live shows through changing promoters. The event calendar, not casual drop-in bar service, determines the experience.",
        "hours": {
          "mon": "10:00 PM-2:30 AM",
          "tue": "10:00 PM-2:30 AM",
          "wed": "10:00 PM-3:30 AM",
          "thu": "10:00 PM-4:30 AM",
          "fri": "10:00 PM-5:00 AM",
          "sat": "10:00 PM-5:00 AM",
          "sun": "10:00 PM-2:30 AM"
        },
        "photo": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/16/c1/df/sala-apolo.jpg?w=900&h=500&s=1"
      },
      {
        "id": "citywide-popular-dry-martini",
        "name": "Dry Martini",
        "coordinates": [
          41.3902,
          2.1552
        ],
        "description": "Dry Martini preserves old-school cocktail tradition through polished service, a properly made namesake drink, and a room that feels classic rather than theatrical.",
        "hours": {
          "mon": "1:00 PM-2:30 AM",
          "tue": "1:00 PM-2:30 AM",
          "wed": "1:00 PM-2:30 AM",
          "thu": "1:00 PM-2:30 AM",
          "fri": "1:00 PM-3:00 AM",
          "sat": "1:00 PM-3:00 AM",
          "sun": "4:30 PM-1:00 AM"
        },
        "photo": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/3b/d9/39/dry-martini-by-javier.jpg?w=900&h=500&s=1"
      },
      {
        "id": "citywide-popular-dr-stravinsky",
        "name": "Dr. Stravinsky",
        "coordinates": [
          41.3858,
          2.1804
        ],
        "description": "Dr. Stravinsky builds experimental cocktails from in-house infusions, ferments, and distillations in a compact Born room. Technique matters here, but the signatures remain focused on flavor rather than laboratory theater.",
        "hours": {
          "mon": "5:00 PM-2:00 AM",
          "tue": "5:00 PM-2:00 AM",
          "wed": "5:00 PM-2:00 AM",
          "thu": "5:00 PM-2:00 AM",
          "fri": "12:00 PM-4:30 PM, 5:00 PM-3:00 AM",
          "sat": "12:00 PM-4:30 PM, 5:00 PM-3:00 AM",
          "sun": "12:00 PM-4:30 PM, 5:00 PM-2:00 AM"
        },
        "photo": "https://drstravinsky.cat/wp-content/uploads/2022/10/08.jpg"
      },
      {
        "id": "citywide-popular-bobbys-free",
        "name": "Bobby's Free",
        "coordinates": [
          41.3942,
          2.1595
        ],
        "description": "Bobby's Free hides a premium cocktail bar behind a playful barbershop entrance, bringing theatrical access to an otherwise polished Eixample drinks room.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://www.bobbysfree.com/wp-content/uploads/2016/10/Bobbydrink-9-683x1024.jpg"
      },
      {
        "id": "citywide-popular-collage",
        "name": "Collage Cocktail Bar",
        "coordinates": [
          41.385,
          2.182
        ],
        "description": "Collage Cocktail Bar is a colorful Born craft-cocktail room that is easier to use with groups than the most in-demand trophy bars.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://privateaser-media.s3.eu-west-1.amazonaws.com/etab_photos/49629/1500x750/462803.jpg"
      },
      {
        "id": "citywide-popular-laut",
        "name": "LAUT",
        "coordinates": [
          41.3734,
          2.1686
        ],
        "description": "LAUT adds a smaller electronic-club option for focused late sessions and local programming, useful when Apolo feels too massive but the night still needs a proper dance-floor endpoint.",
        "hours": {
          "mon": "10:00 PM-2:30 AM",
          "tue": "10:00 PM-2:30 AM",
          "wed": "10:00 PM-3:30 AM",
          "thu": "10:00 PM-4:30 AM",
          "fri": "10:00 PM-5:00 AM",
          "sat": "10:00 PM-5:00 AM",
          "sun": "10:00 PM-2:30 AM"
        },
        "photo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3bjhFJWGM2XXZ8F-6JTgeCj11Br6jdyaTkw&s"
      }
    ],
    "sources": [
      {
        "name": "World's 50 Best Bars - Sips",
        "url": "https://www.theworlds50best.com/bars/the-list/sips.html"
      },
      {
        "name": "World's 50 Best Bars",
        "url": "https://www.worlds50bestbars.com"
      },
      {
        "name": "Sips official",
        "url": "https://sips.barcelona/"
      },
      {
        "name": "Condé Nast Traveler - Sips",
        "url": "https://www.cntraveler.com/story/sips-barcelona-menu"
      },
      {
        "name": "Resident Advisor - Barcelona events",
        "url": "https://ra.co/events/es/barcelona"
      },
      {
        "name": "Time Out - Best bars in Barcelona",
        "url": "https://www.timeout.com/barcelona/bars-and-pubs/best-bars-in-barcelona"
      },
      {
        "name": "Sala Apolo official",
        "url": "https://www.sala-apolo.com/en"
      },
      {
        "name": "Jamboree official",
        "url": "https://jamboreejazz.com/en/"
      },
      {
        "name": "Paradiso official",
        "url": "https://www.paradiso.cat"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-barcelona-citywide-culture",
    "slug": "barcelona-best-culture-citywide",
    "seoSlug": "best-culture",
    "seoTitle": "Best Culture in Barcelona",
    "seoDescription": "Best culture in Barcelona, aggregating the strongest museum, architecture, memory, and landmark picks from each neighborhood guide.",
    "title": "Cathedrals, Modernisme, and Museum Hills",
    "description": "Barcelona's cultural spine runs from Gothic religious architecture and old-city history to domestic Modernisme and Montjuic's modern art. The selection covers the city's major visual chapters without reducing them to postcard facades.",
    "url": "https://www.google.com/maps/search/best+culture+barcelona",
    "category": "Culture",
    "location": {
      "city": "Barcelona",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-culture",
      "name": "R Culture",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "citywide-culture-barcelona-cathedral",
        "name": "Barcelona Cathedral",
        "coordinates": [
          41.3839,
          2.1762
        ],
        "description": "Barcelona Cathedral gathers a Gothic nave, carved choir, rooftop views, and a cloister known for its resident geese inside the medieval street pattern. The surrounding square shows how religious architecture organized the old city as clearly as the building itself.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://upload.wikimedia.org/wikipedia/commons/6/63/Barcelona_Cathedral_Saint_Eulalia.jpg"
      },
      {
        "id": "citywide-culture-santa-maria-del-mar",
        "name": "Basílica de Santa Maria del Mar",
        "coordinates": [
          41.3839,
          2.1822
        ],
        "description": "Santa Maria del Mar is the El Born representative because it tells the neighborhood's merchant and guild story in stone. The cleaner Catalan Gothic interior contrasts with the cathedral and gives visitors a powerful cultural stop without needing a full museum-length visit.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5445-7517-Imagen/santa-maria-mar-barcelona-pf-c1.jpg"
      },
      {
        "id": "citywide-culture-casa-batllo",
        "name": "Casa Batlló",
        "coordinates": [
          41.3917,
          2.1649
        ],
        "description": "Casa Batlló is an Eixample cultural site because it concentrates Barcelona's Modernista fantasy into one high-impact visit. It is tourist-heavy for good reason: facade, interiors, roofline, craft detail, and Passeig de Gràcia context make it one of the city's most useful architecture stops.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://casa-batllo-barcelona.com/wp-content/uploads/2026/01/19944e616eb84ad3b204463508875f98.jpeg"
      },
      {
        "id": "citywide-culture-casa-vicens",
        "name": "Casa Vicens",
        "coordinates": [
          41.4035,
          2.1507
        ],
        "description": "Casa Vicens reveals Gaudi's early experiments through domestic scale, ceramic surfaces, geometric ornament, and garden design, offering more intimacy than his central icons.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://casa-vicens-barcelona.com/wp-content/uploads/2026/01/9528674f03c44fe0b5fad6f5a055e924-1.jpg"
      },
      {
        "id": "citywide-culture-joan-miro",
        "name": "Fundació Joan Miró",
        "coordinates": [
          41.3686,
          2.1592
        ],
        "description": "Fundació Joan Miró is a Poble-sec/Montjuïc cultural site because it combines a focused artist collection with a building and hillside setting that feel inseparable from the visit.",
        "hours": {
          "mon": "Closed",
          "tue": "10:00 AM-7:00 PM",
          "wed": "10:00 AM-7:00 PM",
          "thu": "10:00 AM-7:00 PM",
          "fri": "10:00 AM-7:00 PM",
          "sat": "10:00 AM-7:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5531-4959-imagenCAT/tickets-for-fundacio-miro-museum-barcelona-c.jpg"
      },
      {
        "id": "citywide-culture-sagrada-familia",
        "name": "Sagrada Família",
        "coordinates": [
          41.4036,
          2.1744
        ],
        "description": "Sagrada Família is the Eixample landmark every source converges on: Gaudí's unfinished masterwork, symbolic towers, branching columns, colored glass, and the visible story of construction still unfolding.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5445-18893-Imagen/Sagrada_Familia_Unesco_Transparent_c1.jpg"
      },
      {
        "id": "citywide-culture-la-pedrera",
        "name": "Casa Milà / La Pedrera",
        "coordinates": [
          41.3954,
          2.1619
        ],
        "description": "Casa Milà / La Pedrera adds Gaudí's domestic-architecture lesson: undulating stone, attic structure, apartment design, and rooftop chimneys that show how natural forms became an inhabited building.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://estatics-nasia.dtibcn.cat/nasia-pro/media/2015%2C05%2C1-2-2-2-8-DISE-La-Pedrera-29-4-9-AL-01-760x428.jpg"
      },
      {
        "id": "citywide-culture-picasso-museum",
        "name": "Museu Picasso",
        "coordinates": [
          41.3853,
          2.1815
        ],
        "description": "Museu Picasso traces the artist's formative Barcelona years through early work, Blue Period context, and the Las Meninas series displayed across medieval palace rooms.",
        "hours": {
          "mon": "Closed",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-9:00 PM",
          "fri": "9:00 AM-9:00 PM",
          "sat": "9:00 AM-9:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5531-4970-imagenCAT/museu_picasso_barcelona_c1.jpg"
      },
      {
        "id": "citywide-culture-mnac",
        "name": "MNAC",
        "coordinates": [
          41.3688,
          2.1536
        ],
        "description": "MNAC presents Catalan visual culture at scale inside the Palau Nacional, from exceptional Romanesque mural paintings and Gothic work to modernisme and photography. Terraces above the museum open broad views across the city.",
        "hours": {
          "mon": "Closed",
          "tue": "10:00 AM-8:00 PM",
          "wed": "10:00 AM-8:00 PM",
          "thu": "10:00 AM-8:00 PM",
          "fri": "10:00 AM-8:00 PM",
          "sat": "10:00 AM-8:00 PM",
          "sun": "10:00 AM-3:00 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5531-4863-imagenCAT/Museu_Art_Nacional_Catalunya_Barcelona_c1.jpg"
      },
      {
        "id": "citywide-culture-palau-musica",
        "name": "Palau de la Música Catalana",
        "coordinates": [
          41.3876,
          2.1753
        ],
        "description": "Palau de la Música Catalana adds one of Barcelona's great Modernista interiors: stained-glass skylight, ceramic columns, sculptural facade, and a concert hall best understood by tour or performance.",
        "hours": {
          "mon": "9:00 AM-9:00 PM",
          "tue": "9:00 AM-9:00 PM",
          "wed": "9:00 AM-9:00 PM",
          "thu": "9:00 AM-9:00 PM",
          "fri": "9:00 AM-9:00 PM",
          "sat": "9:00 AM-9:00 PM",
          "sun": "9:00 AM-3:30 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5445-7519-Imagen/Palau_Musica_Catalana_Transparent_c1.jpg"
      }
    ],
    "sources": [
      {
        "name": "Barcelona Turisme",
        "url": "https://www.barcelonaturisme.com"
      },
      {
        "name": "Casa Batlló official",
        "url": "https://www.casabatllo.es"
      },
      {
        "name": "Casa Vicens official",
        "url": "https://casavicens.org"
      },
      {
        "name": "Fundació Joan Miró official",
        "url": "https://www.fmirobcn.org"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  }
] satisfies MapList[]));

export const barcelonaItineraryGuides = withDiveBarChips([
  {
    "id": "list-barcelona-one-day-activities",
    "slug": "barcelona-one-day-itinerary",
    "seoSlug": "best-things-to-do",
    "seoTitle": "Best Things to Do in Barcelona in One Day",
    "seoDescription": "Best one-day Barcelona journey, combining one essential culture stop, one restaurant, one neighborhood walk, one low-key bar, and one destination nightlife option.",
    "title": "One Strong Day, No Filler",
    "description": "A strong first day moves from Modernista architecture to a lively counter lunch, then into El Born's Gothic church, cava-bar ritual, and destination cocktails. The compact geography leaves time to look closely instead of collecting landmarks at speed.",
    "url": "https://www.google.com/maps/search/best+things+to+do+barcelona+one+day",
    "category": "Activities",
    "itinerary": {},
    "submissionType": "itinerary",
    "location": {
      "city": "Barcelona",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-itineraries",
      "name": "R Journeys",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "barcelona-day-casa-batllo",
        "name": "Casa Batlló",
        "coordinates": [
          41.3917,
          2.1649
        ],
        "itineraryDay": 1,
        "description": "Casa Batlló reshapes an Eixample house through a skeletal facade, colored ceramic skin, flowing interiors, light wells, and a symbolic roofline. Timed booking gives the crowded Modernista interior a little structure.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://casa-batllo-barcelona.com/wp-content/uploads/2026/01/19944e616eb84ad3b204463508875f98.jpeg"
      },
      {
        "id": "barcelona-day-cal-pep",
        "name": "Cal Pep",
        "coordinates": [
          41.3835,
          2.1839
        ],
        "itineraryDay": 1,
        "description": "Seafood tapas and quick pace make it easy to move from architecture into the old-city afternoon.",
        "price": "$$$",
        "priceSource": "The Infatuation / Google Maps",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "wed": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "thu": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "fri": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sat": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sun": "Closed"
        },
        "photo": "https://lh3.googleusercontent.com/p/AF1QipMAfpnNAXVl4nrBreCG9RCwlKezMqgrs6IiObfb=s1360-w1360-h1020-rw"
      },
      {
        "id": "barcelona-day-santa-maria",
        "name": "Basílica de Santa Maria del Mar",
        "coordinates": [
          41.3839,
          2.1822
        ],
        "itineraryDay": 1,
        "description": "Santa Maria del Mar is a remarkably unified Catalan Gothic basilica tied to the medieval merchants and maritime workers of the Born. Slender columns and a broad, spare interior give the church an openness that its dense surrounding streets conceal.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5445-7517-Imagen/santa-maria-mar-barcelona-pf-c1.jpg"
      },
      {
        "id": "barcelona-day-xampanyet",
        "name": "El Xampanyet",
        "coordinates": [
          41.3847,
          2.1836
        ],
        "itineraryDay": 1,
        "description": "El Xampanyet works late in the one-day route as a fast cava-and-anchovy bridge between sightseeing and nightlife. Keep it short, salty, and crowded; that is exactly why it fits the day.",
        "hours": {
          "mon": "7:00 PM-11:00 PM",
          "tue": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "wed": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "thu": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "fri": "12:00 PM-3:30 PM, 7:00 PM-11:00 PM",
          "sat": "12:00 PM-3:30 PM",
          "sun": "Closed"
        },
        "photo": "https://www.elxampanyet.com/wp-content/uploads/2024/10/Iriarte_0117-2048x1352.jpg"
      },
      {
        "id": "barcelona-day-paradiso",
        "name": "Paradiso",
        "coordinates": [
          41.3859,
          2.1822
        ],
        "itineraryDay": 1,
        "description": "Paradiso is the Born's headline cocktail attraction: a hidden-door room with theatrical drinks, global recognition, and enough demand that the visit should be treated as the night's main event rather than a quick drink between stops.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://paradiso.cat/wp-content/uploads/2020/06/bck_premios-scaled_op.jpg"
      },
      {
        "id": "barcelona-day-sagrada-familia",
        "name": "Sagrada Família",
        "coordinates": [
          41.4036,
          2.1744
        ],
        "itineraryDay": 1,
        "description": "Sagrada Familia is Gaudi's unfinished basilica of colored glass, branching columns, symbolic towers, and dense religious geometry. A timed booking is necessary to understand the interior rather than settle for a casual walk-by.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5445-18893-Imagen/Sagrada_Familia_Unesco_Transparent_c1.jpg"
      },
      {
        "id": "barcelona-day-picasso-museum",
        "name": "Museu Picasso",
        "coordinates": [
          41.3853,
          2.1815
        ],
        "itineraryDay": 1,
        "description": "Museu Picasso fills out the old-city culture thread with Picasso's formative Barcelona years, early work, Blue Period context, and the Las Meninas series inside linked medieval palaces.",
        "hours": {
          "mon": "Closed",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-9:00 PM",
          "fri": "9:00 AM-9:00 PM",
          "sat": "9:00 AM-9:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5531-4970-imagenCAT/museu_picasso_barcelona_c1.jpg"
      },
      {
        "id": "barcelona-day-park-guell",
        "name": "Park Güell",
        "coordinates": [
          41.4145,
          2.1527
        ],
        "itineraryDay": 1,
        "description": "Park Güell sets Gaudi's mosaics, viaducts, and organic architecture across a steep open-air site with wide Barcelona views. The monumental zone requires a timed ticket, and the hill climb is part of the physical visit.",
        "hours": {
          "mon": "9:30 AM-7:30 PM",
          "tue": "9:30 AM-7:30 PM",
          "wed": "9:30 AM-7:30 PM",
          "thu": "9:30 AM-7:30 PM",
          "fri": "9:30 AM-7:30 PM",
          "sat": "9:30 AM-7:30 PM",
          "sun": "9:30 AM-7:30 PM"
        },
        "photo": "https://parkguell.barcelona/sites/default/files/2023-02/01_Benvinguts_al_Parc_Guell_v2_2.jpg"
      },
      {
        "id": "barcelona-day-mnac",
        "name": "MNAC",
        "coordinates": [
          41.3688,
          2.1536
        ],
        "itineraryDay": 1,
        "description": "MNAC presents Catalan art at exceptional scale, from Romanesque frescoes and Gothic work to modernisme and photography. Its Palau Nacional terraces add some of Montjuic's broadest city views.",
        "hours": {
          "mon": "Closed",
          "tue": "10:00 AM-8:00 PM",
          "wed": "10:00 AM-8:00 PM",
          "thu": "10:00 AM-8:00 PM",
          "fri": "10:00 AM-8:00 PM",
          "sat": "10:00 AM-8:00 PM",
          "sun": "10:00 AM-3:00 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5531-4863-imagenCAT/Museu_Art_Nacional_Catalunya_Barcelona_c1.jpg"
      },
      {
        "id": "barcelona-day-sala-apolo",
        "name": "Sala Apolo",
        "coordinates": [
          41.3752,
          2.1696
        ],
        "itineraryDay": 1,
        "description": "Sala Apolo is a multi-room Poble-sec club and concert institution programming electronic music, indie nights, and live shows through changing promoters. The event calendar, not casual drop-in bar service, determines the experience.",
        "hours": {
          "mon": "10:00 PM-2:30 AM",
          "tue": "10:00 PM-2:30 AM",
          "wed": "10:00 PM-3:30 AM",
          "thu": "10:00 PM-4:30 AM",
          "fri": "10:00 PM-5:00 AM",
          "sat": "10:00 PM-5:00 AM",
          "sun": "10:00 PM-2:30 AM"
        },
        "photo": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/16/c1/df/sala-apolo.jpg?w=900&h=500&s=1"
      }
    ],
    "sources": [
      {
        "name": "Barcelona Turisme",
        "url": "https://www.barcelonaturisme.com"
      },
      {
        "name": "The Infatuation - Best Restaurants in Barcelona",
        "url": "https://www.theinfatuation.com/barcelona/guides/best-restaurants-hotels-barcelona"
      },
      {
        "name": "Time Out - Best bars in Barcelona",
        "url": "https://www.timeout.com/barcelona/bars-and-pubs/best-bars-in-barcelona"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-barcelona-weekend-activities",
    "slug": "barcelona-weekend-itinerary",
    "seoSlug": "weekend-itinerary",
    "seoTitle": "Best Things to Do in Barcelona for a Weekend",
    "seoDescription": "Best Barcelona weekend journey, mixing culture, restaurants, dive bars, popular nightlife, hostel/stay context, and neighborhood pacing across two days.",
    "title": "Two Nights, Five Neighborhood Moods",
    "description": "A Barcelona weekend gains contrast from Montjuic art, old bodega counters, neighborhood streets, and a late club room rather than speed between landmarks.",
    "url": "https://www.google.com/maps/search/barcelona+weekend+itinerary",
    "category": "Activities",
    "itinerary": {},
    "submissionType": "itinerary",
    "location": {
      "city": "Barcelona",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-itineraries",
      "name": "R Journeys",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "barcelona-weekend-casa-gracia",
        "name": "Casa Gracia",
        "coordinates": [
          41.3978,
          2.1578
        ],
        "itineraryDay": 1,
        "description": "Casa Gracia combines hostel social energy, private-room flexibility, communal spaces, and useful transit in a handsome building at the top of Passeig de Gràcia.",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_320,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/4/45620/dcpnqaebwoizjbeaiopu.jpg"
      },
      {
        "id": "barcelona-weekend-casa-batllo",
        "name": "Casa Batlló",
        "coordinates": [
          41.3917,
          2.1649
        ],
        "itineraryDay": 1,
        "description": "Casa Batlló reshapes an Eixample house through a skeletal facade, colored ceramic skin, flowing interiors, light wells, and a roofline that dissolves architecture into symbolism. Timed booking gives the crowded interior a little structure.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://casa-batllo-barcelona.com/wp-content/uploads/2026/01/19944e616eb84ad3b204463508875f98.jpeg"
      },
      {
        "id": "barcelona-weekend-bodega-bonay",
        "name": "Bodega Bonay",
        "coordinates": [
          41.3918,
          2.1746
        ],
        "itineraryDay": 1,
        "description": "Bodega Bonay is a stylish but manageable weekend food-and-wine room serving natural wine, anchovies, cured meats, and pastas without tasting-menu commitment.",
        "category": "Food",
        "venueKind": "food_drink",
        "foodServiceType": "restaurant",
        "price": "$$",
        "priceSource": "The Infatuation / Resy",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://cdn-hhbfohb.nitrocdn.com/MWVuFFQrOubRCgucqTrIdzQgXRECTcge/assets/images/optimized/rev-41ae578/casabonay.com/wp-content/uploads/2020/12/ATP9564@antp-900x1196.jpg"
      },
      {
        "id": "barcelona-weekend-bar-marsella",
        "name": "Bar Marsella",
        "coordinates": [
          41.3852,
          2.1619
        ],
        "itineraryDay": 1,
        "description": "Bar Marsella is a worn-in Raval drinking room associated with absinthe, dusty chandeliers, mirrored walls, and more than a century of late-night history. The patina is real; polish is not the appeal.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://www.barcelona-life.com/wp-content/uploads/2018/02/marsella-barcelona.jpg"
      },
      {
        "id": "barcelona-weekend-joan-miro",
        "name": "Fundació Joan Miró",
        "coordinates": [
          41.3686,
          2.1592
        ],
        "itineraryDay": 2,
        "description": "Fundació Joan Miró brings the artist's paintings, sculpture, works on paper, and archive into Josep Lluís Sert's luminous Montjuïc building. Terraces, courtyards, and hillside views make the architecture part of the collection experience.",
        "hours": {
          "mon": "Closed",
          "tue": "10:00 AM-7:00 PM",
          "wed": "10:00 AM-7:00 PM",
          "thu": "10:00 AM-7:00 PM",
          "fri": "10:00 AM-7:00 PM",
          "sat": "10:00 AM-7:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5531-4959-imagenCAT/tickets-for-fundacio-miro-museum-barcelona-c.jpg"
      },
      {
        "id": "barcelona-weekend-quimet-quimet",
        "name": "Quimet & Quimet",
        "coordinates": [
          41.3738,
          2.1635
        ],
        "itineraryDay": 2,
        "description": "Quimet & Quimet is a standing-room Poble-sec bar lined with bottles and tins, known for montaditos layered with conservas, cheese, smoked fish, and sharp condiments. The tiny room gets crowded quickly, but service moves with practiced speed.",
        "hours": {
          "mon": "12:00 PM-11:00 PM",
          "tue": "12:00 PM-11:00 PM",
          "wed": "12:00 PM-11:00 PM",
          "thu": "12:00 PM-11:30 PM",
          "fri": "12:00 PM-12:00 AM",
          "sat": "12:00 PM-12:00 AM",
          "sun": "12:00 PM-10:30 PM"
        },
        "photo": "https://quimetiquimet.com/wp-content/uploads/tapbg.jpg"
      },
      {
        "id": "barcelona-weekend-apolo",
        "name": "Sala Apolo",
        "coordinates": [
          41.3752,
          2.1696
        ],
        "itineraryDay": 2,
        "description": "Sala Apolo is a multi-room Poble-sec club and concert institution programming electronic music, indie nights, and live shows through changing promoters. The event calendar, not casual drop-in bar service, determines the experience.",
        "hours": {
          "mon": "10:00 PM-2:30 AM",
          "tue": "10:00 PM-2:30 AM",
          "wed": "10:00 PM-3:30 AM",
          "thu": "10:00 PM-4:30 AM",
          "fri": "10:00 PM-5:00 AM",
          "sat": "10:00 PM-5:00 AM",
          "sun": "10:00 PM-2:30 AM"
        },
        "photo": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/16/c1/df/sala-apolo.jpg?w=900&h=500&s=1"
      },
      {
        "id": "barcelona-weekend-sagrada-familia",
        "name": "Sagrada Família",
        "coordinates": [
          41.4036,
          2.1744
        ],
        "itineraryDay": 1,
        "description": "Sagrada Família is Gaudí's unfinished basilica of symbolic facades, rising towers, branching stone columns, and stained glass that floods the nave with shifting color. Timed tickets and tower access reward advance booking.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5445-18893-Imagen/Sagrada_Familia_Unesco_Transparent_c1.jpg"
      },
      {
        "id": "barcelona-weekend-picasso-museum",
        "name": "Museu Picasso",
        "coordinates": [
          41.3853,
          2.1815
        ],
        "itineraryDay": 1,
        "description": "Museu Picasso adds a compact Born museum stop that fits naturally between old-city walks and food. The draw is Picasso's early Barcelona work, Blue Period context, and the Las Meninas series in medieval palace rooms.",
        "hours": {
          "mon": "Closed",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-9:00 PM",
          "fri": "9:00 AM-9:00 PM",
          "sat": "9:00 AM-9:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5531-4970-imagenCAT/museu_picasso_barcelona_c1.jpg"
      },
      {
        "id": "barcelona-weekend-cal-pep",
        "name": "Cal Pep",
        "coordinates": [
          41.3835,
          2.1839
        ],
        "itineraryDay": 2,
        "description": "Cal Pep serves seafood tapas and market-led small plates at a tight Born counter where dishes arrive quickly and the kitchen often steers the order toward the day's best ingredients. The meal feels improvised but never accidental.",
        "price": "$$$",
        "priceSource": "The Infatuation / Google Maps",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "wed": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "thu": "1:00 PM-3:30 PM, 8:00 PM-11:00 PM",
          "fri": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sat": "1:00 PM-3:30 PM, 8:00 PM-11:30 PM",
          "sun": "Closed"
        },
        "photo": "https://lh3.googleusercontent.com/p/AF1QipMAfpnNAXVl4nrBreCG9RCwlKezMqgrs6IiObfb=s1360-w1360-h1020-rw"
      }
    ],
    "sources": [
      {
        "name": "Barcelona Turisme",
        "url": "https://www.barcelonaturisme.com"
      },
      {
        "name": "The Infatuation - Best Restaurants in Barcelona",
        "url": "https://www.theinfatuation.com/barcelona/guides/best-restaurants-hotels-barcelona"
      },
      {
        "name": "Time Out - Best bars in Barcelona",
        "url": "https://www.timeout.com/barcelona/bars-and-pubs/best-bars-in-barcelona"
      },
      {
        "name": "Fundació Joan Miró official",
        "url": "https://www.fmirobcn.org"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  },
  {
    "id": "list-barcelona-week-activities",
    "slug": "barcelona-week-itinerary",
    "seoSlug": "one-week-itinerary",
    "seoTitle": "Best Things to Do in Barcelona for a Week",
    "seoDescription": "Best one-week Barcelona journey, using the strongest citywide picks across restaurants, culture, dive bars, popular bars, hostels, stays, neighborhoods, and Montjuïc.",
    "title": "A Week From Gràcia to the Hill",
    "description": "A full week lets Barcelona unfold by district: Gracia and Eixample architecture, old-city archaeology and taverns, ambitious dining, El Born nightlife, Montjuic museums, and a late Poble-sec finish. Each day stays geographically coherent enough to leave room for street life.",
    "url": "https://www.google.com/maps/search/barcelona+one+week+itinerary",
    "category": "Activities",
    "itinerary": {},
    "submissionType": "itinerary",
    "location": {
      "city": "Barcelona",
      "country": "Spain",
      "continent": "Europe",
      "scope": "city"
    },
    "creator": {
      "id": "user-rguide-itineraries",
      "name": "R Journeys",
      "avatar": "data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20"
    },
    "upvotes": 0,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "stops": [
      {
        "id": "barcelona-week-yeah-hostel",
        "name": "Yeah Barcelona Hostel",
        "coordinates": [
          41.3983,
          2.1654
        ],
        "itineraryDay": 1,
        "description": "Yeah Barcelona offers dorms, private rooms, communal dinners, tours, and social programming between Eixample, Gràcia, and Sagrada Família. The organized community gives longer stays more structure than a random bar crawl.",
        "category": "Stay",
        "venueKind": "lodging",
        "lodgingType": "hostel",
        "hours": {
          "mon": "24 hours",
          "tue": "24 hours",
          "wed": "24 hours",
          "thu": "24 hours",
          "fri": "24 hours",
          "sat": "24 hours",
          "sun": "24 hours"
        },
        "photo": "https://images.trvl-media.com/lodging/28000000/27090000/27084800/27084729/9f0a3253.jpg?impolicy=resizecrop&ra=fit&rw=1200"
      },
      {
        "id": "barcelona-week-casa-vicens",
        "name": "Casa Vicens",
        "coordinates": [
          41.4035,
          2.1507
        ],
        "itineraryDay": 1,
        "description": "Casa Vicens is Gaudí's first major house, a domestic-scale collision of patterned tile, ironwork, garden references, and Moorish-influenced forms in Gràcia. Its smaller rooms reveal the architect's early ideas more intimately than the later basilica and apartment blocks.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://casa-vicens-barcelona.com/wp-content/uploads/2026/01/9528674f03c44fe0b5fad6f5a055e924-1.jpg"
      },
      {
        "id": "barcelona-week-bemba",
        "name": "Bemba Smash Burger",
        "coordinates": [
          41.407,
          2.1583
        ],
        "itineraryDay": 1,
        "description": "Bemba is useful on a weeklong journey because not every good meal should be a reservation.",
        "price": "$",
        "priceSource": "Eater / Instagram",
        "hours": {
          "mon": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "tue": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "wed": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "thu": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM",
          "fri": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sat": "12:30 PM-4:00 PM, 7:30 PM-11:30 PM",
          "sun": "12:30 PM-4:00 PM, 7:30 PM-11:00 PM"
        },
        "photo": "https://151626694.cdn6.editmysite.com/uploads/1/5/1/6/151626694/2GGFXOEZVUBKKQX5WBXUSYAN.jpeg?width=2560&dpr=2"
      },
      {
        "id": "barcelona-week-casa-batllo",
        "name": "Casa Batlló",
        "coordinates": [
          41.3917,
          2.1649
        ],
        "itineraryDay": 2,
        "description": "Casa Batlló carries the major Eixample culture day with the strongest high-impact architecture stop in the central grid. Give it time rather than squeezing it into a rushed old-city morning.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://casa-batllo-barcelona.com/wp-content/uploads/2026/01/19944e616eb84ad3b204463508875f98.jpeg"
      },
      {
        "id": "barcelona-week-disfrutar",
        "name": "Disfrutar",
        "coordinates": [
          41.3878,
          2.1533
        ],
        "itineraryDay": 2,
        "description": "Disfrutar turns avant-garde technique into a long, playful tasting menu shaped by chefs who trained at elBulli. The meal occupies an evening and reservations can disappear months ahead, so the commitment is part of the experience.",
        "price": "$$$",
        "priceSource": "MICHELIN Guide / World's 50 Best",
        "hours": {
          "mon": "Closed",
          "tue": "1:00 PM-2:15 PM, 8:00 PM-9:15 PM",
          "wed": "1:00 PM-2:15 PM, 8:00 PM-9:15 PM",
          "thu": "1:00 PM-2:15 PM, 8:00 PM-9:15 PM",
          "fri": "1:00 PM-2:15 PM, 8:00 PM-9:15 PM",
          "sat": "1:00 PM-2:15 PM, 8:00 PM-9:15 PM",
          "sun": "Closed"
        },
        "photo": "https://www.disfrutarbarcelona.com/api/uploads/restaurant/slider/images/original/cd60e682ef18d378de9e38ab983d2f2b_phpup3Axy.jpg"
      },
      {
        "id": "barcelona-week-muhba",
        "name": "MUHBA Plaça del Rei",
        "coordinates": [
          41.3845,
          2.1777
        ],
        "itineraryDay": 3,
        "description": "MUHBA Plaça del Rei gives the old-city portion historical depth instead of letting the Gothic Quarter become only atmosphere.",
        "hours": {
          "mon": "Closed",
          "tue": "10:00 AM-7:00 PM",
          "wed": "10:00 AM-7:00 PM",
          "thu": "10:00 AM-7:00 PM",
          "fri": "10:00 AM-7:00 PM",
          "sat": "10:00 AM-7:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://upload.wikimedia.org/wikipedia/commons/b/be/MUHBA_Casa_Padellas_Pla%C3%A7a_del_rei_2.JPG"
      },
      {
        "id": "barcelona-week-la-plata",
        "name": "Bar La Plata",
        "coordinates": [
          41.3818,
          2.1799
        ],
        "itineraryDay": 3,
        "description": "Bar La Plata is a simple, historic Gothic Quarter tavern serving fried fish, tomato salad, butifarra, and house wine at a fast counter.",
        "hours": {
          "mon": "12:00 PM-12:30 AM",
          "tue": "12:00 PM-12:30 AM",
          "wed": "12:00 PM-12:30 AM",
          "thu": "12:00 PM-1:30 AM",
          "fri": "12:00 PM-2:00 AM",
          "sat": "12:00 PM-2:00 AM",
          "sun": "12:00 PM-12:00 AM"
        },
        "photo": "https://barlaplata.com/wp-content/uploads/2025/11/ferran-nadeu4.png?w=4000&h="
      },
      {
        "id": "barcelona-week-santa-maria",
        "name": "Basílica de Santa Maria del Mar",
        "coordinates": [
          41.3839,
          2.1822
        ],
        "itineraryDay": 4,
        "description": "Santa Maria del Mar expresses El Born's medieval merchant identity through a broad Catalan Gothic nave, restrained stonework, and exceptional spatial clarity.",
        "hours": {
          "mon": "9:00 AM-8:00 PM",
          "tue": "9:00 AM-8:00 PM",
          "wed": "9:00 AM-8:00 PM",
          "thu": "9:00 AM-8:00 PM",
          "fri": "9:00 AM-8:00 PM",
          "sat": "9:00 AM-8:00 PM",
          "sun": "9:00 AM-8:00 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5445-7517-Imagen/santa-maria-mar-barcelona-pf-c1.jpg"
      },
      {
        "id": "barcelona-week-paradiso",
        "name": "Paradiso",
        "coordinates": [
          41.3859,
          2.1822
        ],
        "itineraryDay": 4,
        "description": "Paradiso is the Born's headline cocktail attraction: a hidden-door room with theatrical drinks, global recognition, and enough demand that the visit should be treated as the night's main event rather than a quick drink between stops.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://paradiso.cat/wp-content/uploads/2020/06/bck_premios-scaled_op.jpg"
      },
      {
        "id": "barcelona-week-joan-miro",
        "name": "Fundació Joan Miró",
        "coordinates": [
          41.3686,
          2.1592
        ],
        "itineraryDay": 5,
        "description": "Fundació Joan Miró gives the Montjuïc day a focused art center before the route turns toward gardens, views, or Poble-sec. It is a smart midweek reset after denser old-city days.",
        "hours": {
          "mon": "Closed",
          "tue": "10:00 AM-7:00 PM",
          "wed": "10:00 AM-7:00 PM",
          "thu": "10:00 AM-7:00 PM",
          "fri": "10:00 AM-7:00 PM",
          "sat": "10:00 AM-7:00 PM",
          "sun": "10:00 AM-7:00 PM"
        },
        "photo": "https://www.barcelonaturisme.com/files/5531-4959-imagenCAT/tickets-for-fundacio-miro-museum-barcelona-c.jpg"
      },
      {
        "id": "barcelona-week-quimet-quimet",
        "name": "Quimet & Quimet",
        "coordinates": [
          41.3738,
          2.1635
        ],
        "itineraryDay": 6,
        "description": "Quimet & Quimet is the Poble-sec food-and-dive-bar bridge, with standing montaditos and bottles that fit a weeklong journey better than another formal dinner. Go early and let it launch a Carrer de Blai evening.",
        "hours": {
          "mon": "12:00 PM-11:00 PM",
          "tue": "12:00 PM-11:00 PM",
          "wed": "12:00 PM-11:00 PM",
          "thu": "12:00 PM-11:30 PM",
          "fri": "12:00 PM-12:00 AM",
          "sat": "12:00 PM-12:00 AM",
          "sun": "12:00 PM-10:30 PM"
        },
        "photo": "https://quimetiquimet.com/wp-content/uploads/tapbg.jpg"
      },
      {
        "id": "barcelona-week-apolo",
        "name": "Sala Apolo",
        "coordinates": [
          41.3752,
          2.1696
        ],
        "itineraryDay": 7,
        "description": "Sala Apolo closes the week with the city's bigger nightlife energy: concerts, club programming, and a real reason to stay out late.",
        "hours": {
          "mon": "10:00 PM-2:30 AM",
          "tue": "10:00 PM-2:30 AM",
          "wed": "10:00 PM-3:30 AM",
          "thu": "10:00 PM-4:30 AM",
          "fri": "10:00 PM-5:00 AM",
          "sat": "10:00 PM-5:00 AM",
          "sun": "10:00 PM-2:30 AM"
        },
        "photo": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/16/c1/df/sala-apolo.jpg?w=900&h=500&s=1"
      }
    ],
    "sources": [
      {
        "name": "Barcelona Turisme",
        "url": "https://www.barcelonaturisme.com"
      },
      {
        "name": "The Infatuation - Best Restaurants in Barcelona",
        "url": "https://www.theinfatuation.com/barcelona/guides/best-restaurants-hotels-barcelona"
      },
      {
        "name": "Eater - Best Restaurants in Barcelona",
        "url": "https://www.eater.com/maps/best-restaurants-barcelona-spain"
      },
      {
        "name": "MICHELIN Guide - Disfrutar",
        "url": "https://guide.michelin.com/us/en/catalunya/barcelona/restaurant/disfrutar"
      },
      {
        "name": "Time Out - Best bars in Barcelona",
        "url": "https://www.timeout.com/barcelona/bars-and-pubs/best-bars-in-barcelona"
      },
      {
        "name": "Hostelworld - Barcelona hostels",
        "url": "https://www.hostelworld.com/st/hostels/europe/spain/barcelona/"
      },
      {
        "name": "Google Maps",
        "url": "https://maps.google.com"
      }
    ]
  }
] satisfies MapList[]);

function withDiveBarChips(guides: MapList[]): MapList[] {
  return guides.map((guide) => {
    if (guide.seoSlug !== "best-dive-bars") return guide;

    return {
      ...guide,
      stops: guide.stops.map((stop) => ({
        ...stop,
        attributeTags: ["dive_bars", ...(stop.attributeTags ?? []).filter((tag) => tag !== "dive_bars")],
      })),
    };
  });
}

export const barcelonaGuides = withDiveBarChips([
  ...barcelonaCoreGuides,
  ...barcelonaItineraryGuides,
] satisfies MapList[]);
