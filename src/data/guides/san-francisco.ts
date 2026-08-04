import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";
import { buildNatureGuide } from "@/data/guides/nature-guide-builder";

const createdAt = "2026-06-05T00:00:00.000Z";
const checkedAt = "2026-06-05";

const sanFranciscoLocation = {
  city: "San Francisco",
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

type StopHours = NonNullable<GuideStop["hours"]>;

type StopInput = {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  officialUrl: string;
  photo: string;
  hours: StopHours;
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

function daily(text: string): StopHours {
  return { mon: text, tue: text, wed: text, thu: text, fri: text, sat: text, sun: text };
}

const images = {
  zuni: "https://zunicafe.com/wp-content/uploads/Zuni-outside-with-RG-crop-e1525309620884.jpg",
  swan: commons("Swan Oyster Depot, San Francisco 2008.jpg"),
  misterJius: "https://images.squarespace-cdn.com/content/v1/685c1dbbcccc767e394a79b0/ebd166f0-bbfa-4441-9aa8-377cb00de785/nicola-parisi_mister-jius_feb2025_0786-Edit.jpg",
  benu: "https://static1.squarespace.com/static/55d235d8e4b075ba97039186/t/60ce581168579e7a028fb957/1624135697345/22+Hawthorne+Street%2C+San+Srancisco%2C+CA+94105.jpg",
  nopa: "https://images.squarespace-cdn.com/content/v1/61e1d4f31eee3d71258a9ded/dfe4037e-3b5a-4ede-930e-93004f0655bc/021722_NOPA_2607.jpg",
  liholiho: "https://lycsf.com/cdn/shop/files/liho1103221161_720x.jpg?v=1667853280",
  laTaqueria: "https://www.lataqueriasf.com/public/media/thumb/banner-la-taqueria-1036x540.jpg",
  goodMongKok: "https://www.datocms-assets.com/55798/1649944316-good-mong-kok-bakery-exterior.jpg",
  arsicault: "https://arsicault-bakery.com/images/carousel/arguello.webp",
  saigonSandwich: "https://media.timeout.com/images/103137921/image.jpg",
  elFarolito: "https://elfarolitosf.com/hero.jpg",
  yamo: "https://s.hdnux.com/photos/12/15/20/2675715/7/rawImage.jpg",
  fairmont: "https://www.fairmont-san-francisco.com/content/uploads/2022/05/5705-82.jpg",
  palaceHotel: commons("Palace Hotel San Francisco Garden Court.jpg"),
  proper: "https://www.properhotel.com/wp-content/uploads/2021/03/SFP_5-3_Exterior_2.jpg",
  kabuki: commons("Hotel Kabuki, SF 1.JPG"),
  oneHotel: "https://cdn.bfldr.com/TU9NUD0C/at/k6wjgkqpkbhqfq7s7zv53zhr/1_Hotel_SF_-_Ferry_House_Suite_Bedroom.jpg",
  stRegis: commons("The St. Regis San Francisco 2021.jpg"),
  greenTortoise: "https://static.wixstatic.com/media/d25e04_944711b3b8f446c79e2ad6a8e697e9b0%7Emv2_d_3464_2309_s_2.jpg/v1/fit/w_2500,h_1330,al_c/d25e04_944711b3b8f446c79e2ad6a8e697e9b0%7Emv2_d_3464_2309_s_2.jpg",
  adelaide: "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_320,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/3/300815/fclqmqwspfqjklxops08.jpg",
  pacificTradewinds: "https://limg.hostelsclub.com/pics/31410/filepict-1407167563.jpg",
  hiWharf: commons("Hostelling International - Fort Mason, San Francisco, CA.jpg"),
  musicCity: "https://a.hwstatic.com/image/upload/f_auto,q_auto,h_320,c_limit,e_sharpen,e_improve,e_vibrance:60/propertyimages/3/33320/pblkxtgzloysgzygsinu.jpg",
  samesun: "https://samesun.com/wp-content/uploads/2025/02/san-francisco-tile-home.webp",
  specs: "https://images.squarespace-cdn.com/content/v1/5eb57b20029e5f2d22953e6c/1588952621366-K2JOZM4QMW5MDXAK6VF9/bar+knickknacks.jpg",
  zeitgeist: "https://static.wixstatic.com/media/c9e188_762966bac4d84af78b1e3d6b3ff24597~mv2_d_2016_1512_s_2.jpg/v1/fill/w_121,h_90,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/c9e188_762966bac4d84af78b1e3d6b3ff24597~mv2_d_2016_1512_s_2.jpg",
  liPo: "https://cdn.enprimeurclub.com/storage/v1/object/public/images/bars/6815048b-76a9-4caf-9f5c-0c6eb3ab7421/hero1.jpg?width=1200&quality=80",
  vesuvio: commons("Vesuvio Cafe San Francisco.jpg"),
  phoneBooth: commons("Phone Booth San Francisco bar.jpg"),
  mobyDick: commons("Moby Dick bar Castro San Francisco.jpg"),
  trueLaurel: "https://www.theworlds50best.com/bars/northamerica/filestore/jpg/True-Laurel-hero_NA50BB26-site.jpg",
  trickDog: "https://images.squarespace-cdn.com/content/v1/68d2c91fab34665ce537ae21/16f036df-40d2-48d8-bd7c-04a216a40156/c152bbbd-af20-43de-9d33-cee998be0f25.png",
  smugglers: "https://images.squarespace-cdn.com/content/v1/56e84c3cb654f9ada96c30ed/1462472252358-FXBGVQB8ACCYSYQYX2JB/bar.jpg",
  pch: "https://images.squarespace-cdn.com/content/v1/628aa818633a120ee99bfc4c/814e77d9-0369-4d7c-8414-234078e10997/0M0A9745-2AWebber.jpg",
  abv: "https://images.squarespace-cdn.com/content/v1/5893882c1b631b3cbfd54515/1693869432602-1Q7LF6LP6N6ATSZD7BSY/image-asset.jpeg",
  alembic: "https://media.timeout.com/images/101706979/image.jpg",
  sfmoma: commons("San Francisco Museum of Modern Art 2016.jpg"),
  deYoung: commons("De Young Museum San Francisco.jpg"),
  legion: commons("California Palace of the Legion of Honor 202 2015-01-03.JPG"),
  asianArt: commons("Asian Art Museum of San Francisco.jpg"),
  exploratorium: commons("Exploratorium entrance at Pier 15, SF (Nov 2015).jpg"),
  cityLights: commons("City Lights Bookstore, San Francisco.jpg"),
  alcatraz: commons("Alcatraz Island photo D Ramey Logan.jpg"),
  goldenGateBridge: commons("Golden Gate Bridge as seen from Fort Point.jpg"),
  ferryBuilding: commons("Ferry Building San Francisco front.jpg"),
  chinatownGate: commons("Dragon Gate, San Francisco Chinatown.jpg"),
  dolores: commons("Mission Dolores Park San Francisco skyline.jpg"),
  presidioTunnelTops: "https://wp.presidio.gov/wp-content/uploads/2023/07/tunneltops2410b-1976.jpg",
  landsEnd: commons("Lands End San Francisco coast.jpg"),
  cableCar: commons("San Francisco cable car on California Street.jpg"),
  goldenGatePark: commons("Music Concourse, Golden Gate Park, San Francisco.jpg"),
  coitTower: commons("Coit Tower San Francisco from Lombard Street.jpg"),
};

const hours = {
  zuni: { mon: "Closed", tue: "5:00 PM-9:30 PM", wed: "5:00 PM-9:30 PM", thu: "5:00 PM-9:30 PM", fri: "11:00 AM-3:00 PM; 5:00 PM-9:30 PM", sat: "11:00 AM-3:00 PM; 5:00 PM-9:30 PM", sun: "11:00 AM-3:00 PM; 5:00 PM-9:30 PM" },
  swan: { mon: "Closed", tue: "8:00 AM-2:30 PM", wed: "8:00 AM-2:30 PM", thu: "8:00 AM-2:30 PM", fri: "8:00 AM-2:30 PM", sat: "8:00 AM-2:30 PM", sun: "Closed" },
  misterJius: { mon: "Closed", tue: "5:00 PM-10:00 PM", wed: "5:00 PM-10:00 PM", thu: "5:00 PM-10:00 PM", fri: "5:00 PM-10:30 PM", sat: "5:00 PM-10:30 PM", sun: "Closed" },
  benu: { mon: "Closed", tue: "5:30 PM-8:30 PM", wed: "5:30 PM-8:30 PM", thu: "5:30 PM-8:30 PM", fri: "5:30 PM-8:30 PM", sat: "5:30 PM-8:30 PM", sun: "Closed" },
  nopa: daily("5:00 PM-10:00 PM"),
  liholiho: { mon: "Closed", tue: "5:00 PM-10:00 PM", wed: "5:00 PM-10:00 PM", thu: "5:00 PM-10:00 PM", fri: "5:00 PM-11:00 PM", sat: "5:00 PM-11:00 PM", sun: "Closed" },
  laTaqueria: { mon: "11:00 AM-8:45 PM", tue: "11:00 AM-8:45 PM", wed: "11:00 AM-8:45 PM", thu: "11:00 AM-8:45 PM", fri: "11:00 AM-8:45 PM", sat: "11:00 AM-8:45 PM", sun: "Closed" },
  goodMongKok: daily("7:00 AM-6:00 PM"),
  arsicault: daily("8:00 AM-3:00 PM"),
  saigon: daily("8:00 AM-5:00 PM"),
  elFarolito: { mon: "10:00 AM-2:00 AM", tue: "10:00 AM-2:00 AM", wed: "10:00 AM-2:00 AM", thu: "10:00 AM-2:00 AM", fri: "10:00 AM-3:00 AM", sat: "10:00 AM-3:00 AM", sun: "10:00 AM-2:00 AM" },
  yamo: { mon: "Closed", tue: "5:00 PM-9:00 PM", wed: "5:00 PM-9:00 PM", thu: "5:00 PM-9:00 PM", fri: "5:00 PM-9:00 PM", sat: "5:00 PM-9:00 PM", sun: "Closed" },
  hotels: daily("24-hour guest operation; check-in, front-desk, late-arrival, restaurant, spa, roof, and amenity schedules are controlled by the official property or booking page."),
  hostels: daily("24-hour reception or check-in support is listed by the official hostel or booking page; quiet hours, kitchen access, and luggage storage use the property rules."),
  specs: daily("4:00 PM-2:00 AM"),
  zeitgeist: daily("12:00 PM-2:00 AM"),
  liPo: daily("2:00 PM-2:00 AM"),
  vesuvio: daily("12:00 PM-2:00 AM"),
  phoneBooth: daily("12:00 PM-2:00 AM"),
  mobyDick: daily("2:00 PM-2:00 AM"),
  trueLaurel: { mon: "Closed", tue: "5:00 PM-12:00 AM", wed: "5:00 PM-12:00 AM", thu: "5:00 PM-12:00 AM", fri: "5:00 PM-1:00 AM", sat: "12:00 PM-1:00 AM", sun: "12:00 PM-12:00 AM" },
  trickDog: daily("4:00 PM-12:00 AM"),
  smugglers: { mon: "5:00 PM-12:00 AM", tue: "5:00 PM-12:00 AM", wed: "5:00 PM-12:00 AM", thu: "5:00 PM-12:00 AM", fri: "5:00 PM-1:30 AM", sat: "5:00 PM-1:30 AM", sun: "5:00 PM-12:00 AM" },
  pch: { mon: "Closed", tue: "5:00 PM-12:00 AM", wed: "5:00 PM-12:00 AM", thu: "5:00 PM-12:00 AM", fri: "5:00 PM-1:00 AM", sat: "5:00 PM-1:00 AM", sun: "Closed" },
  abv: daily("4:00 PM-12:00 AM"),
  alembic: daily("4:00 PM-12:00 AM"),
  sfmoma: { mon: "10:00 AM-5:00 PM", tue: "Closed", wed: "10:00 AM-5:00 PM", thu: "12:00 PM-8:00 PM", fri: "10:00 AM-5:00 PM", sat: "10:00 AM-5:00 PM", sun: "10:00 AM-5:00 PM" },
  deYoung: { mon: "Closed", tue: "9:30 AM-5:15 PM", wed: "9:30 AM-5:15 PM", thu: "9:30 AM-5:15 PM", fri: "9:30 AM-5:15 PM", sat: "9:30 AM-5:15 PM", sun: "9:30 AM-5:15 PM" },
  asianArt: { mon: "Closed", tue: "10:00 AM-5:00 PM", wed: "Closed", thu: "1:00 PM-8:00 PM", fri: "10:00 AM-5:00 PM", sat: "10:00 AM-5:00 PM", sun: "10:00 AM-5:00 PM" },
  cityLights: daily("10:00 AM-10:00 PM"),
  attractions: daily("Official visitor page controls outdoor access, weather closures, ticketing, park rules, facility schedules, and same-day notices."),
  alcatraz: daily("Tours and ferry departures vary by season, weather, and ticket type; book and verify the official Alcatraz City Cruises schedule."),
  ferryBuilding: daily("Official Ferry Building directory controls public hall and merchant hours; individual food stalls keep their own posted schedules."),
  cableCar: daily("SFMTA timetable controls cable car line hours, frequency, maintenance, and city service notices."),
};

function stop(input: StopInput): GuideStop {
  const mapUrl = maps(input.mapQuery ?? `${input.name} San Francisco`);
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
      checkedAt,
      notes: "Official venue/property page plus Google Maps search evidence checked for current status; no permanent-closure warning found in the selected source set.",
    },
  };
}

const editorial = {
  restaurants: [
    source("Top organic result: Eater SF - The Best Restaurants in San Francisco", "https://sf.eater.com/maps/best-restaurants-san-francisco-38"),
    source("The Infatuation - Top 25: The Best Restaurants in San Francisco", "https://www.theinfatuation.com/san-francisco/guides/best-restaurants-in-san-francisco"),
    source("MICHELIN Guide - San Francisco restaurants", "https://guide.michelin.com/us/en/california/san-francisco/restaurants"),
    source("San Francisco Chronicle - Top Restaurants", "https://www.sfchronicle.com/projects/best-san-francisco-restaurants/"),
    source("SF Travel - San Francisco restaurants", "https://www.sftravel.com/things-to-do/food-drink"),
  ],
  cheapEats: [
    source("Top organic result: Eater SF - Best Cheap and Affordable Restaurants", "https://sf.eater.com/maps/best-cheap-affordable-budget-restaurants-san-francisco"),
    source("The Infatuation - Cheap Eats San Francisco", "https://www.theinfatuation.com/san-francisco/perfect-for/cheap-eats"),
    source("The Infatuation - Dinner Under $50 in SF", "https://www.theinfatuation.com/san-francisco/guides/affordable-restaurants-san-francisco"),
    source("SF Standard - Best cheap eats according to restaurant pros", "https://sfstandard.com/2026/01/19/cheap-eats-san-francisco/"),
    source("SF Travel - Food and drink", "https://www.sftravel.com/things-to-do/food-drink"),
  ],
  hotels: [
    source("Top organic result: Conde Nast Traveler - Best Hotels in San Francisco", "https://www.cntraveler.com/gallery/best-hotels-in-san-francisco"),
    source("Travel + Leisure - San Francisco hotels", "https://www.travelandleisure.com/hotels-resorts/san-francisco-hotels"),
    source("MICHELIN Guide - San Francisco hotels", "https://guide.michelin.com/us/en/hotels-stays/california/san-francisco"),
    source("Forbes Travel Guide - San Francisco hotels", "https://www.forbestravelguide.com/destinations/san-francisco-california/travel-guide"),
    source("Google Travel - San Francisco hotels", "https://www.google.com/travel/hotels/San%20Francisco"),
  ],
  hostels: [
    source("Top organic result: Hostelworld - San Francisco hostels", "https://www.hostelworld.com/hostels/north-america/usa/san-francisco/"),
    source("Hostelgeeks - Best Hostels in San Francisco", "https://hostelgeeks.com/best-hostels-san-francisco/"),
    source("Booking.com - San Francisco hostels", "https://www.booking.com/hostels/city/us/san-francisco.html"),
    source("HI USA - San Francisco hostels", "https://www.hiusa.org/find-hostels/california/san-francisco"),
    source("Google Travel - San Francisco hostels", "https://www.google.com/travel/hotels/San%20Francisco?q=hostels%20san%20francisco"),
  ],
  casualBars: [
    source("Top organic result: Eater SF - Best Dive Bars in San Francisco", "https://sf.eater.com/maps/best-dive-bars-san-francisco"),
    source("The Infatuation - Best Bars in San Francisco", "https://www.theinfatuation.com/san-francisco/guides/best-bars-san-francisco"),
    source("Time Out - Best bars in San Francisco", "https://www.timeout.com/san-francisco/bars/best-bars-in-san-francisco"),
    source("SF Travel - Nightlife and bars", "https://www.sftravel.com/things-to-do/nightlife"),
    source("Google Maps - San Francisco dive bars", maps("best dive bars San Francisco")),
  ],
  cocktails: [
    source("Top organic result: Eater SF - Best Cocktail Bars in San Francisco", "https://sf.eater.com/maps/best-cocktail-bars-san-francisco"),
    source("The Infatuation - Best Cocktail Bars in San Francisco", "https://www.theinfatuation.com/san-francisco/guides/best-cocktail-bars-san-francisco"),
    source("North America's 50 Best Bars - True Laurel", "https://www.theworlds50best.com/bars/northamerica/the-list/true-laurel.html"),
    source("Axios San Francisco - Trick Dog 2026 menu", "https://www.axios.com/local/san-francisco/2026/02/06/trick-dogs-newest-menu-captures-soul-of-san-francisco"),
    source("Punch - San Francisco cocktail coverage", "https://punchdrink.com/tag/san-francisco/"),
  ],
  culture: [
    source("Top organic result: SF Travel - Arts and Culture", "https://www.sftravel.com/things-to-do/arts-culture"),
    source("Time Out - Best museums in San Francisco", "https://www.timeout.com/san-francisco/museums/best-museums-in-san-francisco"),
    source("San Francisco Museums Council", "https://sfmuseums.org/"),
    source("SF Arts", "https://www.sfarts.org/"),
    source("Google Maps - San Francisco museums", maps("best museums culture San Francisco")),
  ],
  activities: [
    source("Top organic result: SF Travel - Things to Do", "https://www.sftravel.com/things-to-do"),
    source("Lonely Planet - Top things to do in San Francisco", "https://www.lonelyplanet.com/usa/san-francisco/attractions"),
    source("National Park Service - Alcatraz Island", "https://www.nps.gov/alca/index.htm"),
    source("Golden Gate National Parks Conservancy", "https://www.parksconservancy.org/"),
    source("SFMTA - Cable Cars", "https://www.sfmta.com/getting-around/muni/cable-cars"),
  ],
};

const diningStops = [
  stop({ id: "sf-dining-zuni-cafe", name: "Zuni Cafe", coordinates: [37.773676, -122.421607], description: "Zuni Cafe still feels alive through its copper bar, Market Street theater, oysters, Caesar salad, and brick-oven chicken. The roast chicken is a two-person, one-hour commitment, and reservations protect the slow meal.", officialUrl: "https://zunicafe.com/", bookingUrl: "https://www.opentable.com/zuni-cafe-reservations-san-francisco", photo: images.zuni, hours: hours.zuni, price: "$$$", priceSource: "Official menu / OpenTable", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["californian", "french", "oysters"], attributeTags: ["reservation_recommended", "classic", "date_night", "local_favorite"], editorialUrls: ["https://sf.eater.com/maps/best-restaurants-san-francisco-38", "https://www.theinfatuation.com/san-francisco/reviews/zuni-cafe"] }),
  stop({ id: "sf-dining-swan-oyster-depot", name: "Swan Oyster Depot", coordinates: [37.788772, -122.420088], description: "Swan is a narrow counter where crab, oysters, smoked salmon, and cold beer make the wait part of the ritual instead of a branding exercise.", officialUrl: "https://www.sfswanoysterdepot.com/", photo: images.swan, hours: hours.swan, price: "$$$", priceSource: "Official site / Google Maps", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["seafood", "oyster_bar", "san_francisco_classic"], attributeTags: ["counter_service", "seafood", "classic", "walk_in_friendly"], editorialUrls: ["https://sf.eater.com/maps/best-restaurants-san-francisco-38", "https://www.theinfatuation.com/san-francisco/reviews/swan-oyster-depot"] }),
  stop({ id: "sf-dining-mister-jius", name: "Mister Jiu's", coordinates: [37.793819, -122.406564], description: "Mister Jiu's gives Chinatown a polished dining room without sanding down the neighborhood: banquet-house bones, California produce, Chinese technique, and a bar that can carry the night. Reserve for dinner, then leave time to walk Grant and Waverly while the lanterns do their work.", officialUrl: "https://misterjius.com/", bookingUrl: "https://www.exploretock.com/misterjius/", photo: images.misterJius, hours: hours.misterJius, price: "$$$$", priceSource: "Official menu / Tock", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["chinese", "californian", "chinatown"], attributeTags: ["reservation_recommended", "fine_dining", "date_night", "destination_dining"], editorialUrls: ["https://guide.michelin.com/us/en/california/san-francisco/restaurant/mister-jiu-s", "https://sf.eater.com/maps/best-restaurants-san-francisco-38"] }),
  stop({ id: "sf-dining-benu", name: "Benu", coordinates: [37.785382, -122.399036], description: "Benu is the SoMa tasting-menu room for precision, not noise: Korean and Cantonese references, severe calm, and service that treats tiny details as architecture.", officialUrl: "https://www.benusf.com/", bookingUrl: "https://www.exploretock.com/benu/", photo: images.benu, hours: hours.benu, price: "$$$$", priceSource: "Official menu / Tock", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["korean", "cantonese", "tasting_menu"], attributeTags: ["tasting_menu", "fine_dining", "reservation_recommended", "splurge_food"], editorialUrls: ["https://guide.michelin.com/us/en/california/san-francisco/restaurant/benu", "https://sf.eater.com/maps/best-restaurants-san-francisco-38"] }),
  stop({ id: "sf-dining-nopa", name: "Nopa", coordinates: [37.774911, -122.437797], description: "Nopa draws crowds with wood-fired cooking, late hours, a two-level room, and food that suits both dates and unfussy groups. The atmosphere is social rather than ceremonial; reserve or aim for the bar.", officialUrl: "https://www.nopasf.com/", photo: images.nopa, hours: hours.nopa, price: "$$$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["californian", "wood_fired", "american"], attributeTags: ["lively", "date_night", "local_favorite", "reservation_recommended"], editorialUrls: ["https://sf.eater.com/maps/best-restaurants-san-francisco-38", "https://www.theinfatuation.com/san-francisco/reviews/nopa"] }),
  stop({ id: "sf-dining-liholiho", name: "Liholiho Yacht Club", coordinates: [37.788053, -122.414605], description: "Liholiho turns San Francisco's Pacific wiring into dinner through tuna poke, spam, coconut, heat, and a room that understands fun without becoming careless. The lively format suits groups and high-energy dates; book early because walk-in optimism gets punished fast.", officialUrl: "https://liholihoyachtclub.com/", bookingUrl: "https://www.exploretock.com/liholihoyachtclub/", photo: images.liholiho, hours: hours.liholiho, price: "$$$", priceSource: "Official menu / Tock", venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["hawaiian", "californian", "asian_influenced"], attributeTags: ["lively_food", "group_friendly", "reservation_recommended", "date_night"], editorialUrls: ["https://sf.eater.com/maps/best-restaurants-san-francisco-38", "https://www.theinfatuation.com/san-francisco/reviews/liholiho-yacht-club"] }),
];

const cheapEatStops = [
  stop({ id: "sf-cheap-la-taqueria", name: "La Taqueria", coordinates: [37.750927, -122.418087], description: "La Taqueria is a Mission burrito counter that justifies the argument: no rice padding, excellent carne asada, and a line that moves with purpose. Go outside peak lunch, keep the order focused, and understand that this is counter-service efficiency, not a lingering dining room.", officialUrl: "https://www.lataqueriasf.com/", photo: images.laTaqueria, hours: hours.laTaqueria, price: "$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["mexican", "burritos", "mission"], attributeTags: ["budget_food", "counter_service", "local_favorite", "quick_meal"], editorialUrls: ["https://sf.eater.com/maps/best-cheap-affordable-budget-restaurants-san-francisco", "https://www.theinfatuation.com/san-francisco/reviews/la-taqueria"] }),
  stop({ id: "sf-cheap-good-mong-kok", name: "Good Mong Kok Bakery", coordinates: [37.795384, -122.408175], description: "Good Mong Kok moves steamed buns, dumplings, and dim sum from trays to the register at Chinatown speed and budget prices. Service is takeaway-focused, and the line can be abrupt during busy periods.", officialUrl: "https://www.google.com/maps/search/?api=1&query=Good%20Mong%20Kok%20Bakery%20San%20Francisco", photo: images.goodMongKok, hours: hours.goodMongKok, price: "$", priceSource: "Google Maps / posted menu evidence", venueKind: "food_drink", foodServiceType: "bakery", cuisineTypes: ["dim_sum", "chinese", "bakery"], attributeTags: ["budget_food", "takeaway", "counter_service", "chinatown"], editorialUrls: ["https://sf.eater.com/maps/best-cheap-affordable-budget-restaurants-san-francisco", "https://www.theinfatuation.com/san-francisco/reviews/good-mong-kok-bakery"] }),
  stop({ id: "sf-cheap-arsicault", name: "Arsicault Bakery", coordinates: [37.783959, -122.459245], description: "Arsicault makes the Richmond croissant pilgrimage feel rational: shatter, butter, almond paste, and a queue that smells better than most restaurants. Go early, buy for later, and build the stop into Golden Gate Park or Clement Street instead of crossing town for one pastry.", officialUrl: "https://arsicault-bakery.com/", photo: images.arsicault, hours: hours.arsicault, price: "$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "bakery", cuisineTypes: ["french_bakery", "pastry", "breakfast"], attributeTags: ["bakery", "breakfast", "budget_food", "takeaway"], editorialUrls: ["https://sf.eater.com/maps/best-bakeries-san-francisco", "https://www.theinfatuation.com/san-francisco/reviews/arsicault-bakery"] }),
  stop({ id: "sf-cheap-saigon-sandwich", name: "Saigon Sandwich", coordinates: [37.783215, -122.415372], description: "Saigon Sandwich is the Tenderloin banh mi counter that keeps the city fed for pocket change: crusty bread, pickled crunch, pate, and no ceremony.", officialUrl: "https://www.google.com/maps/search/?api=1&query=Saigon%20Sandwich%20San%20Francisco", photo: images.saigonSandwich, hours: hours.saigon, price: "$", priceSource: "Google Maps / posted menu evidence", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["vietnamese", "banh_mi", "sandwiches"], attributeTags: ["budget_food", "takeaway", "quick_meal", "solo_friendly"], editorialUrls: ["https://sf.eater.com/maps/best-cheap-affordable-budget-restaurants-san-francisco", "https://www.theinfatuation.com/san-francisco/reviews/saigon-sandwich"] }),
  stop({ id: "sf-cheap-el-farolito", name: "El Farolito", coordinates: [37.752671, -122.418401], description: "El Farolito serves oversized Mission-style burritos from a bright, fast counter that remains useful late. The super burrito is the signature order, built for appetite rather than presentation.", officialUrl: "https://elfarolitosf.com/", photo: images.elFarolito, hours: hours.elFarolito, price: "$", priceSource: "Official menu / Google Maps", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["mexican", "burritos", "late_night"], attributeTags: ["budget_food", "late_night", "counter_service", "walk_in_friendly"], editorialUrls: ["https://sf.eater.com/maps/best-burritos-san-francisco", "https://www.theinfatuation.com/san-francisco/reviews/el-farolito"] }),
  stop({ id: "sf-cheap-yamo", name: "Yamo", coordinates: [37.761694, -122.42173], description: "Yamo is a tiny Mission Burmese counter where the cooks, flames, noodles, and waiting stools are all basically in your lap. Go for tea leaf salad and noodles for flavor over comfort, and do not bring a group that needs personal space.", officialUrl: "https://www.google.com/maps/search/?api=1&query=Yamo%20San%20Francisco", photo: images.yamo, hours: hours.yamo, price: "$", priceSource: "Google Maps / posted menu evidence", venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["burmese", "noodles", "mission"], attributeTags: ["budget_food", "counter_service", "solo_friendly", "casual"], editorialUrls: ["https://sf.eater.com/maps/best-cheap-affordable-budget-restaurants-san-francisco", "https://www.theinfatuation.com/san-francisco/reviews/yamo"] }),
];

const hotelStops = [
  stop({ id: "sf-hotel-fairmont", name: "Fairmont San Francisco", coordinates: [37.792393, -122.410507], description: "The Fairmont delivers classic Nob Hill grandeur, cable cars outside, bay views from selected rooms, and a formal old-San-Francisco arrival. Its hilltop position creates excellent outlooks and a real climb on casual walks.", officialUrl: "https://www.fairmont-san-francisco.com/", bookingUrl: "https://www.fairmont-san-francisco.com/offers/", photo: images.fairmont, hours: hours.hotels, price: "$$$$", priceSource: "Official booking engine / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "historic", "central", "scenic"], editorialUrls: ["https://www.cntraveler.com/hotels/san-francisco/fairmont-san-francisco", "https://guide.michelin.com/us/en/hotels-stays/san-francisco/fairmont-san-francisco-9935"] }),
  stop({ id: "sf-hotel-palace", name: "Palace Hotel", coordinates: [37.788668, -122.401994], description: "Palace Hotel is a historic downtown grand hotel known for its glass-roofed Garden Court, formal public rooms, indoor pool, and central Market Street access. The location is convenient, though surrounding blocks deserve normal late-night awareness.", officialUrl: "https://www.marriott.com/en-us/hotels/sfolc-palace-hotel-a-luxury-collection-hotel-san-francisco/overview/", bookingUrl: "https://www.marriott.com/en-us/hotels/sfolc-palace-hotel-a-luxury-collection-hotel-san-francisco/rooms/", photo: images.palaceHotel, hours: hours.hotels, price: "$$$$", priceSource: "Official Marriott booking engine / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "historic", "central", "business"], editorialUrls: ["https://www.cntraveler.com/hotels/san-francisco/palace-hotel-a-luxury-collection-hotel", "https://guide.michelin.com/us/en/hotels-stays/san-francisco/palace-hotel-a-luxury-collection-hotel-9975"] }),
  stop({ id: "sf-hotel-proper", name: "San Francisco Proper", coordinates: [37.780878, -122.412602], description: "San Francisco Proper is a design-forward Mid-Market hotel with patterned interiors and rooftop drinks. Civic Center, Hayes Valley, and SoMa are accessible, while the immediate street scene requires realistic expectations.", officialUrl: "https://www.properhotel.com/san-francisco/", bookingUrl: "https://www.properhotel.com/san-francisco/offers/", photo: images.proper, hours: hours.hotels, price: "$$$", priceSource: "Official booking engine / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["design", "central", "rooftop", "boutique"], editorialUrls: ["https://www.cntraveler.com/hotels/san-francisco/san-francisco-proper-hotel", "https://guide.michelin.com/us/en/hotels-stays/san-francisco/san-francisco-proper-hotel-10027"] }),
  stop({ id: "sf-hotel-kabuki", name: "Hotel Kabuki", coordinates: [37.785321, -122.429669], description: "Hotel Kabuki makes Japantown a real base rather than a dinner detour, with calm design, courtyard energy, and quick access to Fillmore, Pacific Heights, and Hayes Valley.", officialUrl: "https://www.jdvhotels.com/hotels/california/san-francisco/hotel-kabuki", bookingUrl: "https://www.hyatt.com/jdv-by-hyatt/en-US/sfojd-hotel-kabuki", photo: images.kabuki, hours: hours.hotels, price: "$$$", priceSource: "Official Hyatt booking engine / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["design", "quiet", "midrange", "neighborhood"], editorialUrls: ["https://www.cntraveler.com/hotels/san-francisco/hotel-kabuki", "https://www.travelandleisure.com/hotels-resorts/san-francisco-hotels"] }),
  stop({ id: "sf-hotel-one-hotel", name: "1 Hotel San Francisco", coordinates: [37.793482, -122.392804], description: "1 Hotel San Francisco pairs bay views and a clean waterfront atmosphere with immediate access to the Ferry Building, Financial District, and Embarcadero. The location is less convenient for nightlife concentrated across town.", officialUrl: "https://www.1hotels.com/san-francisco", bookingUrl: "https://www.1hotels.com/san-francisco/offers", photo: images.oneHotel, hours: hours.hotels, price: "$$$$", priceSource: "Official booking engine / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "scenic", "waterfront", "wellness"], editorialUrls: ["https://www.cntraveler.com/hotels/san-francisco/1-hotel-san-francisco", "https://guide.michelin.com/us/en/hotels-stays/san-francisco/1-hotel-san-francisco-12498"] }),
  stop({ id: "sf-hotel-st-regis", name: "The St. Regis San Francisco", coordinates: [37.785847, -122.401006], description: "The St. Regis is a polished, expensive downtown hotel known for high-touch service and spacious rooms. SFMOMA, Yerba Buena, Moscone, and SoMa dining are close, but the experience is urban luxury rather than neighborhood intimacy.", officialUrl: "https://www.marriott.com/en-us/hotels/sfoxr-the-st-regis-san-francisco/overview/", bookingUrl: "https://www.marriott.com/en-us/hotels/sfoxr-the-st-regis-san-francisco/rooms/", photo: images.stRegis, hours: hours.hotels, price: "$$$$", priceSource: "Official Marriott booking engine / Google Travel", venueKind: "lodging", lodgingType: "hotel", attributeTags: ["luxury", "business", "central", "museum_access"], editorialUrls: ["https://www.cntraveler.com/hotels/san-francisco/the-st-regis-san-francisco", "https://guide.michelin.com/us/en/hotels-stays/san-francisco/the-st-regis-san-francisco-9999"] }),
];

const hostelStops = [
  stop({ id: "sf-hostel-green-tortoise", name: "Green Tortoise Hostel", coordinates: [37.797604, -122.406188], description: "Green Tortoise is a North Beach social hostel with communal meals, bar-crawl energy, and a location between Chinatown, City Lights, and late pizza. Conversation and budget take priority over quiet, so light sleepers should book accordingly.", officialUrl: "https://greentortoisesf.com/", bookingUrl: "https://greentortoisesf.com/rooms/", photo: images.greenTortoise, hours: hours.hostels, price: "$", priceSource: "Official booking page / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "social", "central", "party"], editorialUrls: ["https://www.hostelworld.com/hosteldetails.php/Green-Tortoise-Hostel/San-Francisco/1826", "https://hostelgeeks.com/best-hostels-san-francisco/"] }),
  stop({ id: "sf-hostel-adelaide", name: "Adelaide Hostel", coordinates: [37.787917, -122.411604], description: "Adelaide Hostel softens its Union Square location with breakfast, common spaces, and a quieter alley address at a budget price.", officialUrl: "https://www.adelaidehostel.com/", bookingUrl: "https://www.hostelworld.com/hosteldetails.php/Adelaide-Hostel/San-Francisco/1813", photo: images.adelaide, hours: hours.hostels, price: "$", priceSource: "Official site / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "central", "social", "breakfast"], editorialUrls: ["https://www.hostelworld.com/hosteldetails.php/Adelaide-Hostel/San-Francisco/1813", "https://hostelgeeks.com/best-hostels-san-francisco/"] }),
  stop({ id: "sf-hostel-pacific-tradewinds", name: "ITH Pacific Tradewinds Hostel", coordinates: [37.794485, -122.404198], description: "ITH Pacific Tradewinds is a small Financial District hostel that suits backpackers who want a tighter, more social house rather than a giant dorm factory.", officialUrl: "https://ithhostels.com/pacific-tradewinds-hostel-san-francisco/", bookingUrl: "https://www.hostelworld.com/hosteldetails.php/ITH-Pacific-Tradewinds-Hostel/San-Francisco/1853", photo: images.pacificTradewinds, hours: hours.hostels, price: "$", priceSource: "Official booking page / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "social", "central", "solo_friendly"], editorialUrls: ["https://www.hostelworld.com/hosteldetails.php/ITH-Pacific-Tradewinds-Hostel/San-Francisco/1853", "https://hostelgeeks.com/best-hostels-san-francisco/"] }),
  stop({ id: "sf-hostel-hi-fishermans-wharf", name: "HI San Francisco Fisherman's Wharf", coordinates: [37.806839, -122.430454], description: "HI Fisherman's Wharf sits in Fort Mason, which gives budget travelers grass, bay air, and an easy Marina waterfront that most cheap beds cannot touch. It is calmer than downtown hostels, but late-night nightlife plans require a longer ride back.", officialUrl: "https://www.hiusa.org/find-hostels/california/san-francisco-building-240-fort-mason", bookingUrl: "https://www.hiusa.org/find-hostels/california/san-francisco-building-240-fort-mason", photo: images.hiWharf, hours: hours.hostels, price: "$", priceSource: "Official HI USA booking page / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "scenic", "quiet", "waterfront"], editorialUrls: ["https://www.hostelworld.com/hosteldetails.php/HI-San-Francisco-Fisherman-s-Wharf/San-Francisco/1852", "https://www.hiusa.org/find-hostels/california/san-francisco-building-240-fort-mason"] }),
  stop({ id: "sf-hostel-music-city", name: "Music City Hotel", coordinates: [37.787119, -122.421919], description: "Music City is the Polk Gulch hybrid for cheap private rooms or dorms with music-history personality instead of anonymous beige corridors. It is central and useful for bars, but street noise and shared-bath tradeoffs are part of the bargain.", officialUrl: "https://musiccityhotel.com/", bookingUrl: "https://www.hostelworld.com/hosteldetails.php/Music-City-Hotel-The-San-Francisco-Music-Experience/San-Francisco/1920", photo: images.musicCity, hours: hours.hostels, price: "$", priceSource: "Official booking page / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "central", "music", "social"], editorialUrls: ["https://www.hostelworld.com/hosteldetails.php/Music-City-Hotel-The-San-Francisco-Music-Experience/San-Francisco/1920", "https://www.booking.com/hotel/us/music-city.html"] }),
  stop({ id: "sf-hostel-samesun", name: "Samesun San Francisco", coordinates: [37.800084, -122.425254], description: "Samesun puts budget beds near Lombard, Russian Hill, and Marina routes, which helps travelers who want north-side sightseeing without sleeping in the downtown core.", officialUrl: "https://samesun.com/san-francisco/", bookingUrl: "https://www.hostelworld.com/hosteldetails.php/Samesun-San-Francisco/San-Francisco/311535", photo: images.samesun, hours: hours.hostels, price: "$", priceSource: "Official booking page / Hostelworld", venueKind: "lodging", lodgingType: "hostel", attributeTags: ["budget", "central", "social", "tourist_friendly"], editorialUrls: ["https://www.hostelworld.com/hosteldetails.php/Samesun-San-Francisco/San-Francisco/311535", "https://www.booking.com/hotel/us/samesun-san-francisco.html"] }),
];

const casualBarStops = [
  stop({ id: "sf-dive-specs", name: "Specs' Twelve Adler Museum Cafe", coordinates: [37.798548, -122.406248], description: "Specs' is North Beach clutter, conversation, and accumulated weirdness in bar form, a place where the walls feel like they have been eavesdropping for decades.", officialUrl: "https://www.specsbarsf.com/", photo: images.specs, hours: hours.specs, price: "$", priceSource: "Official site / Google Maps", venueKind: "nightlife", nightlifeType: "dive_bar", musicGenres: ["jukebox"], attributeTags: ["local_bar", "cheap_drinks", "casual_nightlife", "historic"], editorialUrls: ["https://sf.eater.com/maps/best-dive-bars-san-francisco", "https://www.theinfatuation.com/san-francisco/reviews/specs"] }),
  stop({ id: "sf-dive-zeitgeist", name: "Zeitgeist", coordinates: [37.770067, -122.422746], description: "Zeitgeist is the Mission beer garden for pitchers, burgers, bikes, and an outdoor crowd that can swing from sunny afternoon to unruly night.", officialUrl: "https://zeitgeistsf.com/", photo: images.zeitgeist, hours: hours.zeitgeist, price: "$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "beer_bar", musicGenres: ["rock", "jukebox"], attributeTags: ["local_bar", "craft_beer", "lively_nightlife", "casual_nightlife"], editorialUrls: ["https://sf.eater.com/maps/best-dive-bars-san-francisco", "https://www.theinfatuation.com/san-francisco/reviews/zeitgeist"] }),
  stop({ id: "sf-dive-li-po", name: "Li Po Cocktail Lounge", coordinates: [37.795295, -122.407024], description: "Li Po is Chinatown nightlife with red glow, strong mai tais, basement energy, and a room that refuses to become tasteful for visitors. It is best as one drink in a North Beach-Chinatown crawl; pace yourself because the house drink is not subtle.", officialUrl: "https://www.lipolounge.com/", photo: images.liPo, hours: hours.liPo, price: "$$", priceSource: "Official site / Google Maps", venueKind: "nightlife", nightlifeType: "dive_bar", musicGenres: ["jukebox"], attributeTags: ["local_bar", "cheap_drinks", "lively_nightlife", "chinatown"], editorialUrls: ["https://sf.eater.com/maps/best-dive-bars-san-francisco", "https://www.theinfatuation.com/san-francisco/reviews/li-po-cocktail-lounge"] }),
  stop({ id: "sf-dive-vesuvio", name: "Vesuvio Cafe", coordinates: [37.797443, -122.406686], description: "Vesuvio is the Beat-era North Beach bar that still works when you treat the literary history as atmosphere, not homework. Sit upstairs if you can, pair it with City Lights, and remember this is a busy landmark bar as much as a neighborhood drink.", officialUrl: "https://www.vesuvio.com/", photo: images.vesuvio, hours: hours.vesuvio, price: "$$", priceSource: "Official site / Google Maps", venueKind: "nightlife", nightlifeType: "pub", musicGenres: ["jazz", "jukebox"], attributeTags: ["historic", "local_bar", "casual_nightlife", "tourist_friendly"], editorialUrls: ["https://sf.eater.com/maps/best-dive-bars-san-francisco", "https://www.sftravel.com/things-to-do/vesuvio-cafe"] }),
  stop({ id: "sf-dive-phone-booth", name: "Phone Booth", coordinates: [37.759899, -122.421053], description: "Phone Booth gives the Mission a no-frills corner bar with jukebox grit, neighborhood regulars, and the feeling that nobody is auditioning for your approval.", officialUrl: "https://www.google.com/maps/search/?api=1&query=Phone%20Booth%20San%20Francisco", photo: images.phoneBooth, hours: hours.phoneBooth, price: "$", priceSource: "Google Maps / posted menu evidence", venueKind: "nightlife", nightlifeType: "dive_bar", musicGenres: ["jukebox"], attributeTags: ["cheap_drinks", "local_bar", "low_key_nightlife", "casual_nightlife"], editorialUrls: ["https://sf.eater.com/maps/best-dive-bars-san-francisco", "https://www.theinfatuation.com/san-francisco/guides/best-bars-san-francisco"] }),
  stop({ id: "sf-dive-moby-dick", name: "Moby Dick", coordinates: [37.760789, -122.434299], description: "Moby Dick is a casual Castro bar with a pool table, aquarium glow, neighborhood regulars, and an easy queer social atmosphere. Games and conversation matter more than cocktail ceremony.", officialUrl: "https://www.mobydicksf.com/", photo: images.mobyDick, hours: hours.mobyDick, price: "$$", priceSource: "Official site / Google Maps", venueKind: "nightlife", nightlifeType: "dive_bar", musicGenres: ["pop", "jukebox"], attributeTags: ["queer_friendly", "local_bar", "casual_nightlife", "games"], editorialUrls: ["https://sf.eater.com/maps/best-dive-bars-san-francisco", "https://www.theinfatuation.com/san-francisco/guides/best-bars-san-francisco"] }),
];

const cocktailStops = [
  stop({ id: "sf-cocktail-true-laurel", name: "True Laurel", coordinates: [37.760618, -122.411754], description: "True Laurel pairs inventive cocktails, house ferments, and serious bar food in a relaxed Mission room from the team behind Lazy Bear. It can carry dinner-adjacent drinking; reserve when available or arrive early.", officialUrl: "https://www.truelaurelsf.com/", bookingUrl: "https://resy.com/cities/san-francisco-ca/venues/true-laurel", photo: images.trueLaurel, hours: hours.trueLaurel, price: "$$$", priceSource: "Official menu / Resy", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["ambient"], attributeTags: ["craft_cocktails", "reservation_recommended_nightlife", "date_night", "premium_drinks"], editorialUrls: ["https://www.theworlds50best.com/bars/northamerica/the-list/true-laurel.html", "https://sf.eater.com/maps/best-cocktail-bars-san-francisco"] }),
  stop({ id: "sf-cocktail-trick-dog", name: "Trick Dog", coordinates: [37.759996, -122.412856], description: "Trick Dog is the menu-as-art Mission room that keeps reinventing itself without losing the basic pleasure of a crowded bar and a very good drink. Go for the seasonal concept, stay for food if the timing works, and expect noise rather than hushed reverence.", officialUrl: "https://www.trickdogbar.com/", photo: images.trickDog, hours: hours.trickDog, price: "$$$", priceSource: "Official menu / Axios 2026 menu coverage", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["dj_sets"], attributeTags: ["craft_cocktails", "lively_nightlife", "date_night", "premium_drinks"], editorialUrls: ["https://www.axios.com/local/san-francisco/2026/02/06/trick-dogs-newest-menu-captures-soul-of-san-francisco", "https://sf.eater.com/maps/best-cocktail-bars-san-francisco"] }),
  stop({ id: "sf-cocktail-smugglers-cove", name: "Smuggler's Cove", coordinates: [37.779386, -122.423436], description: "Smuggler's Cove turns rum into a whole vertical world: nautical clutter, deep bottles, tiki history, and drinks that can sneak up if you treat them like decoration. It is best early or with a small group; large parties and impatient drinkers should go elsewhere.", officialUrl: "https://www.smugglerscovesf.com/", photo: images.smugglers, hours: hours.smugglers, price: "$$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["exotica"], attributeTags: ["craft_cocktails", "speakeasy", "lively_nightlife", "premium_drinks"], editorialUrls: ["https://sf.eater.com/maps/best-cocktail-bars-san-francisco", "https://www.theinfatuation.com/san-francisco/reviews/smugglers-cove"] }),
  stop({ id: "sf-cocktail-pch", name: "Pacific Cocktail Haven", coordinates: [37.788317, -122.408219], description: "Pacific Cocktail Haven gives downtown a Filipino-influenced cocktail room where pandan, calamansi, clarified textures, and hospitality do more than look clever on a menu.", officialUrl: "https://www.pacificcocktailsf.com/", bookingUrl: "https://resy.com/cities/san-francisco-ca/venues/pacific-cocktail-haven", photo: images.pch, hours: hours.pch, price: "$$$", priceSource: "Official menu / Resy", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["ambient"], attributeTags: ["craft_cocktails", "date_night", "reservation_recommended_nightlife", "premium_drinks"], editorialUrls: ["https://sf.eater.com/maps/best-cocktail-bars-san-francisco", "https://www.theinfatuation.com/san-francisco/reviews/pacific-cocktail-haven"] }),
  stop({ id: "sf-cocktail-abv", name: "ABV", coordinates: [37.765038, -122.421184], description: "ABV is the Valencia cocktail bar that solves a real travel problem: strong drinks, compact food, and enough energy to feel like a night without requiring a reservation production. Go for a focused first round and snacks, then decide whether the Mission gets another stop.", officialUrl: "https://www.abvsf.com/", photo: images.abv, hours: hours.abv, price: "$$$", priceSource: "Official menu / Google Maps", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["ambient"], attributeTags: ["craft_cocktails", "walk_in_friendly_nightlife", "lively_nightlife", "date_night"], editorialUrls: ["https://sf.eater.com/maps/best-cocktail-bars-san-francisco", "https://www.theinfatuation.com/san-francisco/reviews/abv"] }),
  stop({ id: "sf-cocktail-alembic", name: "The Alembic", coordinates: [37.769277, -122.452742], description: "The Alembic is the Haight cocktail room for serious drinks without leaving the neighborhood's rougher music-and-record-shop edge behind.", officialUrl: "https://alembicsf.com/", bookingUrl: "https://resy.com/cities/san-francisco-ca/venues/the-alembic", photo: images.alembic, hours: hours.alembic, price: "$$$", priceSource: "Official menu / Resy", venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["ambient"], attributeTags: ["craft_cocktails", "date_night", "walk_in_friendly_nightlife", "premium_drinks"], editorialUrls: ["https://sf.eater.com/maps/best-cocktail-bars-san-francisco", "https://www.theinfatuation.com/san-francisco/reviews/the-alembic"] }),
];

const cultureStops = [
  stop({ id: "sf-culture-sfmoma", name: "SFMOMA", coordinates: [37.785718, -122.400572], description: "SFMOMA fills seven floors with modern and contemporary art, including major holdings in painting, sculpture, photography, architecture, and design. The scale rewards choosing a few collections rather than treating the building as a checklist; late opening hours vary by date.", officialUrl: "https://www.sfmoma.org/", bookingUrl: "https://www.sfmoma.org/tickets/", photo: images.sfmoma, hours: hours.sfmoma, venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "art", "indoor", "tickets_required"], editorialUrls: ["https://www.sftravel.com/things-to-do/sfmoma", "https://www.timeout.com/san-francisco/museums/best-museums-in-san-francisco"] }),
  stop({ id: "sf-culture-de-young", name: "de Young Museum", coordinates: [37.771469, -122.468676], description: "The de Young holds American art, substantial textile collections, and major temporary exhibitions inside Golden Gate Park. Its observation tower turns the surrounding park and city geography into part of the visit.", officialUrl: "https://www.famsf.org/visit/de-young", bookingUrl: "https://tickets.famsf.org/", photo: images.deYoung, hours: hours.deYoung, venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "art", "park", "family_friendly"], editorialUrls: ["https://www.sftravel.com/things-to-do/de-young-museum", "https://www.timeout.com/san-francisco/museums/best-museums-in-san-francisco"] }),
  stop({ id: "sf-culture-legion-of-honor", name: "Legion of Honor", coordinates: [37.784466, -122.500842], description: "The Legion of Honor is the city's cliff-edge fine-arts pause, with European collections, Rodin, and an approach that feels removed from downtown pressure. Pair it with Lands End or Ocean Beach and check exhibition hours; the west-side trip deserves a half-day, not leftovers.", officialUrl: "https://www.famsf.org/visit/legion-of-honor", bookingUrl: "https://tickets.famsf.org/", photo: images.legion, hours: hours.deYoung, venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "art", "scenic", "quiet"], editorialUrls: ["https://www.sftravel.com/things-to-do/legion-honor", "https://www.timeout.com/san-francisco/museums/best-museums-in-san-francisco"] }),
  stop({ id: "sf-culture-asian-art", name: "Asian Art Museum", coordinates: [37.780178, -122.416193], description: "The Asian Art Museum gives Civic Center a collection with real depth: bronzes, ceramics, sculpture, contemporary shows, and enough scale to reward a focused visit. It is strongest when paired with Hayes Valley or City Hall; verify days because midweek closures can trip up loose plans.", officialUrl: "https://asianart.org/", bookingUrl: "https://calendar.asianart.org/tickets/", photo: images.asianArt, hours: hours.asianArt, venueKind: "culture", subcategory: "museum", attributeTags: ["museum", "art", "indoor", "family_friendly"], editorialUrls: ["https://www.sftravel.com/things-to-do/asian-art-museum", "https://www.timeout.com/san-francisco/museums/best-museums-in-san-francisco"] }),
  stop({ id: "sf-culture-exploratorium", name: "Exploratorium", coordinates: [37.801384, -122.397673], description: "The Exploratorium is the rare science museum that adults can enjoy without pretending it is only for kids: tactile exhibits, perception tricks, and a Pier 15 waterfront setting.", officialUrl: "https://www.exploratorium.edu/", bookingUrl: "https://www.exploratorium.edu/visit/tickets", photo: images.exploratorium, hours: { default: "Official visit calendar controls museum hours, After Dark evenings, school-calendar closures, and ticket windows." }, venueKind: "culture", subcategory: "science_museum", attributeTags: ["museum", "family_friendly", "interactive", "waterfront"], editorialUrls: ["https://www.sftravel.com/things-to-do/exploratorium", "https://www.timeout.com/san-francisco/museums/best-museums-in-san-francisco"] }),
  stop({ id: "sf-culture-city-lights", name: "City Lights Booksellers & Publishers", coordinates: [37.797606, -122.4066], description: "City Lights is not just a bookstore photo stop; it is North Beach literary infrastructure, Beat history, small-press shelves, and a reason to slow down between bars and Chinatown.", officialUrl: "https://citylights.com/", photo: images.cityLights, hours: hours.cityLights, venueKind: "retail", subcategory: "bookstore", attributeTags: ["literature", "historic", "north_beach", "indoor"], editorialUrls: ["https://www.sftravel.com/things-to-do/city-lights-booksellers-publishers", "https://www.timeout.com/san-francisco/shopping/city-lights-booksellers-publishers"] }),
];

const activityStops = [
  stop({ id: "sf-activity-alcatraz", name: "Alcatraz Island", coordinates: [37.826977, -122.422956], description: "Alcatraz combines a bay ferry, island views, prison history, and an excellent cellhouse audio tour into one coherent visit.", officialUrl: "https://www.nps.gov/alca/index.htm", bookingUrl: "https://www.cityexperiences.com/san-francisco/city-cruises/alcatraz/", photo: images.alcatraz, hours: hours.alcatraz, venueKind: "landmark", subcategory: "national_park_site", attributeTags: ["tickets_required", "history", "harbor", "family_friendly"], editorialUrls: ["https://www.sftravel.com/things-to-do/alcatraz-island", "https://www.lonelyplanet.com/usa/san-francisco/attractions"] }),
  stop({ id: "sf-activity-golden-gate-bridge", name: "Golden Gate Bridge", coordinates: [37.819929, -122.478255], description: "Check fog and wind, start from the Presidio or Fort Point, and give the bridge room to be physical.", officialUrl: "https://www.goldengate.org/bridge/visiting-the-bridge/", photo: images.goldenGateBridge, hours: hours.attractions, venueKind: "landmark", subcategory: "bridge", attributeTags: ["free_entry", "scenic", "walking", "cycling"], editorialUrls: ["https://www.sftravel.com/things-to-do/golden-gate-bridge", "https://www.lonelyplanet.com/usa/san-francisco/attractions"] }),
  stop({ id: "sf-activity-ferry-building", name: "Ferry Building Marketplace", coordinates: [37.79549, -122.393663], description: "The Ferry Building gathers coffee, oysters, bread, specialty food shops, ferry terminals, and bayfront walking inside a handsome historic hall. Market days expand the food offering onto the plaza.", officialUrl: "https://www.ferrybuildingmarketplace.com/", photo: images.ferryBuilding, hours: hours.ferryBuilding, venueKind: "landmark", subcategory: "marketplace", attributeTags: ["market", "waterfront", "food_hall", "family_friendly"], editorialUrls: ["https://www.sftravel.com/things-to-do/ferry-building-marketplace", "https://www.lonelyplanet.com/usa/san-francisco/attractions"] }),
  stop({ id: "sf-activity-chinatown", name: "San Francisco Chinatown Dragon Gate", coordinates: [37.790672, -122.405607], description: "San Francisco Chinatown extends far beyond the Dragon Gate through bakeries, alleys, temples, groceries, banquet rooms, and a neighborhood still doing daily work under tourist pressure. Walk side streets as well as Grant Avenue.", officialUrl: "https://www.sftravel.com/neighborhoods/chinatown", photo: images.chinatownGate, hours: hours.attractions, venueKind: "landmark", subcategory: "neighborhood_walk", attributeTags: ["free_entry", "walking", "history", "food"], editorialUrls: ["https://www.sftravel.com/neighborhoods/chinatown", "https://www.lonelyplanet.com/usa/san-francisco/attractions"] }),
  stop({ id: "sf-activity-dolores", name: "Mission Dolores Park", coordinates: [37.759774, -122.427063], description: "Dolores Park is the city at rest and on display: skyline slope, Mission sun when it appears, picnics, dogs, music, and a crowd that changes by hour.", officialUrl: "https://sfrecpark.org/Facilities/Facility/Details/Mission-Dolores-Park-188", photo: images.dolores, hours: daily("5:00 AM-midnight"), venueKind: "outdoors", subcategory: "park", attributeTags: ["park", "free_entry", "scenic", "local_favorite"], editorialUrls: ["https://www.sftravel.com/things-to-do/mission-dolores-park", "https://www.lonelyplanet.com/usa/san-francisco/attractions"] }),
  stop({ id: "sf-activity-presidio-tunnel-tops", name: "Presidio Tunnel Tops", coordinates: [37.803398, -122.463297], description: "Presidio Tunnel Tops gives the city a newer bay-view public space where lawns, food trucks, kid-friendly design, and Golden Gate angles are all easy to use.", officialUrl: "https://presidio.gov/explore/attractions/presidio-tunnel-tops", photo: images.presidioTunnelTops, hours: hours.attractions, venueKind: "outdoors", subcategory: "park", attributeTags: ["park", "scenic", "family_friendly", "free_entry"], editorialUrls: ["https://www.sftravel.com/things-to-do/presidio-tunnel-tops", "https://www.parksconservancy.org/parks/presidio-tunnel-tops"] }),
  stop({ id: "sf-activity-lands-end", name: "Lands End Trail", coordinates: [37.780204, -122.511669], description: "Lands End is the coastal walk that proves San Francisco is not just streets and dining rooms: cypress, shipwreck history, bridge views, and Pacific air at the edge of the city. Wear real shoes, watch wind and fog, and pair it with the Legion of Honor or Outer Richmond food.", officialUrl: "https://www.nps.gov/goga/planyourvisit/landsend.htm", photo: images.landsEnd, hours: hours.attractions, venueKind: "outdoors", subcategory: "trail", attributeTags: ["nature", "walking", "scenic", "free_entry"], editorialUrls: ["https://www.parksconservancy.org/parks/lands-end", "https://www.lonelyplanet.com/usa/san-francisco/attractions"] }),
  stop({ id: "sf-activity-cable-car", name: "San Francisco Cable Cars", coordinates: [37.805851, -122.417743], description: "Cable cars are touristy because they are genuinely strange and useful: open-air grades, mechanical grip, bells, and a moving lesson in hill geography.", officialUrl: "https://www.sfmta.com/getting-around/muni/cable-cars", photo: images.cableCar, hours: hours.cableCar, venueKind: "transport", subcategory: "transit_ride", attributeTags: ["tickets_required", "history", "scenic", "family_friendly"], editorialUrls: ["https://www.sftravel.com/things-to-do/cable-cars", "https://www.lonelyplanet.com/usa/san-francisco/attractions"] }),
  stop({ id: "sf-activity-golden-gate-park", name: "Golden Gate Park", coordinates: [37.769421, -122.486214], description: "Golden Gate Park stretches toward the ocean through museums, gardens, bison paddocks, lakes, and broad meadows. Its length is easy to underestimate, so choose a zone or rent wheels rather than treating the whole park as one compact attraction.", officialUrl: "https://sfrecpark.org/770/Golden-Gate-Park", photo: images.goldenGatePark, hours: daily("5:00 AM-midnight; gardens, museums, concessions, and attractions keep separate schedules."), venueKind: "outdoors", subcategory: "park", attributeTags: ["park", "family_friendly", "free_entry", "walking"], editorialUrls: ["https://www.sftravel.com/things-to-do/golden-gate-park", "https://www.lonelyplanet.com/usa/san-francisco/attractions"] }),
  stop({ id: "sf-activity-coit-tower", name: "Coit Tower", coordinates: [37.802398, -122.405822], description: "Coit Tower combines Depression-era murals, Telegraph Hill stairs, and broad bay views, with North Beach and the waterfront below. Check elevator and ticket hours, then descend on foot if your knees are willing; the neighborhood stairs are part of the experience.", officialUrl: "https://sfrecpark.org/Facilities/Facility/Details/Coit-Tower-290", bookingUrl: "https://sfrecpark.org/Facilities/Facility/Details/Coit-Tower-290", photo: images.coitTower, hours: { default: "SF Rec and Park controls tower elevator, gift shop, mural access, maintenance closures, and event schedules." }, venueKind: "landmark", subcategory: "viewpoint", attributeTags: ["viewpoint", "history", "tickets_required", "walking"], editorialUrls: ["https://www.sftravel.com/things-to-do/coit-tower", "https://www.lonelyplanet.com/usa/san-francisco/attractions"] }),
];

const sources = {
  dining: [...editorial.restaurants, ...diningStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  cheapEats: [...editorial.cheapEats, ...cheapEatStops.slice(0, 5).map((item) => source(`${item.name} official/current-status`, item.officialUrl ?? maps(item.name)))],
  hotels: [...editorial.hotels, ...hotelStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  hostels: [...editorial.hostels, ...hostelStops.slice(0, 5).map((item) => source(`${item.name} official`, item.officialUrl ?? maps(item.name)))],
  casualBars: [...editorial.casualBars, ...casualBarStops.slice(0, 5).map((item) => source(`${item.name} official/current-status`, item.officialUrl ?? maps(item.name)))],
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
    url: maps(`${title} San Francisco`),
    category,
    location: sanFranciscoLocation,
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

export const sanFranciscoGuides: MapList[] = [
  guide("Food", "list-sf-citywide-dining", "sf-best-restaurants-citywide", "best-restaurants", "Pacific Dining & Classics", "San Francisco dining connects old counters, Chinatown polish, Mission and Hayes-area rooms, tasting-menu precision, and Pacific flavors shaped by hills, fog, produce, and immigration.", diningStops, sources.dining, "Best Restaurants in San Francisco for Classic Dining, Seafood, Chinatown, and Tasting Menus", "Source-backed San Francisco restaurant guide with Zuni, Swan Oyster Depot, Mister Jiu's, Benu, Nopa, and Liholiho."),
  guide("Food", "list-sf-cheap-eats", "sf-best-cheap-eats", "best-cheap-eats", "Burritos, Dumplings & Bakery Lines", "San Francisco's affordable food culture spans Mission burritos, Chinatown dim sum, Richmond pastries, Tenderloin banh mi, late tacos, and tiny counters defined by flavor rather than budget-food mythology.", cheapEatStops, sources.cheapEats, "Best Cheap Eats in San Francisco for Burritos, Dim Sum, Banh Mi, Bakeries, and Late Tacos", "Budget and medium-cheap San Francisco food stops with source evidence, hours, map status, and route notes."),
  guide("Stay", "list-sf-hotels", "sf-best-hotels", "best-hotels", "Premium Stays by Neighborhood", "San Francisco hotels across Nob Hill grandeur, downtown transit, Mid-Market design, Japantown calm, waterfront views, and museum-side luxury. Rooms, service, amenities, hills, and immediate surroundings distinguish the properties.", hotelStops, sources.hotels, "Best Hotels in San Francisco for Luxury, Design, Waterfront, and Neighborhood Fit", "Hotel-only San Francisco stay guide with official booking evidence and neighborhood strategy for Nob Hill, SoMa, Japantown, and the Embarcadero."),
  guide("Stay", "list-sf-hostels", "sf-best-hostels", "best-hostels", "Hostels & Social Budget Beds", "A hostel-only San Francisco guide for backpackers choosing between North Beach social energy, Union Square budget access, Financial District small-hostel scale, Fort Mason calm, Polk Gulch value, and north-side sightseeing. It is honest about noise, safety blocks, and transit tradeoffs.", hostelStops, sources.hostels, "Best Hostels in San Francisco for Dorms, Private Rooms, Social Travel, and Budget Bases", "Hostel-only San Francisco guide with dorm/private-room evidence, booking links, and neighborhood tradeoffs."),
  guide("Nightlife", "list-sf-dive-bars-casual-pubs", "sf-best-dive-bars-casual-pubs", "best-dive-bars", "Historic Dives & Neighborhood Bars", "A casual San Francisco bar guide for North Beach relics, Mission beer gardens, Chinatown glow, Castro hangouts, and low-friction neighborhood drinking. It is deliberately not a cocktail guide, and it rewards travelers who want rooms with wear, memory, and regulars.", casualBarStops, sources.casualBars, "Best Dive Bars and Casual Bars in San Francisco", "San Francisco dive bar and casual pub guide with Specs', Zeitgeist, Li Po, Vesuvio, Phone Booth, and Moby Dick."),
  guide("Nightlife", "list-sf-cocktail-bars", "sf-best-cocktail-bars", "best-cocktail-bars", "Craft Cocktails in the Fog", "San Francisco cocktails spanning Mission experimentation, tiki maximalism, Filipino-influenced downtown drinks, Valencia rooms, and serious Haight bars. Drink style, food, room size, and peak-hour pressure shape the experience.", cocktailStops, sources.cocktails, "Best Cocktail Bars in San Francisco for Serious Drinks, Tiki, and Mission Nights", "Source-backed San Francisco cocktail guide with True Laurel, Trick Dog, Smuggler's Cove, PCH, ABV, and The Alembic."),
  guide("Culture", "list-sf-culture-museums-bookstores", "sf-best-culture-museums-bookstores", "best-culture", "Museums & Historic Bookstores", "San Francisco culture across downtown modern art, Golden Gate Park institutions, Civic Center collections, Pier 15 science, and North Beach literary history. Collections, exhibitions, architecture, and visit format define the selection.", cultureStops, sources.culture, "Best Culture in San Francisco for Museums, Art, Science, and Literary History", "San Francisco culture guide with official evidence for SFMOMA, de Young, Legion of Honor, Asian Art Museum, Exploratorium, and City Lights."),
  guide("Activities", "list-sf-top-things-to-do", "sf-top-things-to-do", "best-things-to-do", "The Essential SF 10", "A top-things San Francisco guide built around route usefulness: Alcatraz, the bridge, Ferry Building mornings, Chinatown walks, Dolores Park, Presidio lawns, Lands End, cable cars, Golden Gate Park, and Coit Tower. It keeps the city compact but physical, with fog, hills, ticketing, and timing called out.", activityStops, sources.activities, "Top Things to Do in San Francisco With 10 Strong Stops", "Ten source-backed San Francisco things to do, from Alcatraz and Golden Gate Bridge to Chinatown, Dolores Park, Presidio Tunnel Tops, Lands End, cable cars, Golden Gate Park, and Coit Tower."),
];

sanFranciscoGuides.push(buildNatureGuide({
  city: "San Francisco", country: "United States", continent: "North America",
  id: "list-san-francisco-citywide-nature", slug: "san-francisco-best-parks-and-nature-citywide", seoSlug: "best-parks",
  seoTitle: "Best Parks and Nature in San Francisco", seoDescription: "San Francisco nature guide to major parks, coastal headlands, beaches, urban peaks, canyon habitat, and botanical collections.",
  title: "Fog Forest, Coastal Cliffs, and Wind-Cut Peaks",
  description: "San Francisco nature is compressed but dramatic: planted forest, native scrub, cliff trail, dune beach, restored marsh, and steep open hills all fit inside the city. Fog, wind, surf, erosion, and temporary trail closures decide the day more than distance.",
  createdAt: "2026-07-29T00:00:00.000Z", checkedAt: "2026-08-04",
  sources: [
    { name: "Top organic result: San Francisco Recreation and Parks", url: "https://sfrecpark.org/" },
    { name: "Presidio official trails", url: "https://presidio.gov/explore/trails" },
    { name: "National Park Service Golden Gate", url: "https://www.nps.gov/goga/index.htm" },
    { name: "Google Maps - San Francisco parks and nature", url: "https://www.google.com/maps/search/best+parks+and+nature+San+Francisco" },
  ],
  stops: [
    { id: "san-francisco-nature-golden-gate", name: "Golden Gate Park", coordinates: [37.7694, -122.4862], description: "Golden Gate Park stretches planted woodland, lakes, meadows, gardens, bison paddock, and cultural institutions from the city grid to Ocean Beach. Its length rewards bicycles, while car-free roads and event closures change the easiest crossings.", hours: { default: "Park open daily 5:00 AM-midnight; gardens, lakes, roads, and facilities follow their official schedules." }, officialUrl: "https://sfrecpark.org/770/Golden-Gate-Park", subcategory: "urban_landscape_park", attributeTags: ["park", "cycling", "lake", "garden", "family_friendly"] },
    { id: "san-francisco-nature-presidio", name: "Presidio of San Francisco", coordinates: [37.7989, -122.4662], description: "The Presidio combines cypress and eucalyptus forest, restored dunes, coastal bluff, wetlands, historic military landscape, and Golden Gate overlooks. Trails cross varied terrain, with construction and habitat restoration occasionally redirecting routes.", hours: { default: "Open 24 hours daily; the Presidio Visitor Center is open daily 10:00 AM–5:00 PM." }, officialUrl: "https://presidio.gov/visit/frequently-asked-questions", subcategory: "coastal_national_park", attributeTags: ["forest", "coast", "hiking", "viewpoint", "historic"] },
    { id: "san-francisco-nature-lands-end", name: "Lands End", coordinates: [37.7848, -122.508], description: "Lands End follows cypress bluff and rocky Pacific shore above shipwreck water, with Golden Gate views and steep side routes toward Mile Rock Beach. Erosion, mud, and cliff edges make official closures non-negotiable.", hours: { default: "Daily 6:00 AM–one hour after sunset. Lands End Lookout is open daily 9:00 AM–5:00 PM." }, officialUrl: "https://www.nps.gov/goga/learn/management/superintendents-compendium.htm", subcategory: "coastal_bluff_trail", attributeTags: ["hiking", "cliffs", "ocean", "viewpoint", "free_entry"] },
    { id: "san-francisco-nature-twin-peaks", name: "Twin Peaks", coordinates: [37.7544, -122.4477], description: "Twin Peaks preserves windswept grassland and coastal scrub around two summits with a nearly complete city panorama. Fog and wind can erase comfort and visibility within minutes, while road access does not eliminate the final steep walk.", hours: { default: "Daily 5:00 AM–midnight." }, officialUrl: "https://www.sfrecpark.org/facilities/facility/details/Twin-Peaks-384", subcategory: "urban_peak", attributeTags: ["viewpoint", "grassland", "hiking", "windy", "free_entry"] },
    { id: "san-francisco-nature-ocean-beach", name: "Ocean Beach", coordinates: [37.7594, -122.5107], description: "Ocean Beach runs for miles along exposed Pacific sand and dune edge west of the city. The horizon is magnificent, but cold water, rip currents, fog, and wind make walking far more reliable than swimming.", hours: { default: "Open 24 hours daily." }, officialUrl: "https://www.nps.gov/goga/planyourvisit/oceanbeach.htm", subcategory: "urban_ocean_beach", attributeTags: ["beach", "walking", "sunset", "surf", "dangerous_currents"] },
    { id: "san-francisco-nature-crissy-field", name: "Crissy Field", coordinates: [37.804, -122.465], description: "Crissy Field restores tidal marsh and dune beside a broad bay promenade with birdlife, beach, and Golden Gate views. Wind drives the experience, while sensitive habitat areas and dog rules divide the shoreline into distinct uses.", hours: { default: "Open 24 hours daily; East Beach and West Bluff parking lots are open daily 6:00 AM–11:00 PM." }, officialUrl: "https://www.nps.gov/goga/learn/management/superintendents-compendium.htm", subcategory: "restored_tidal_marsh", attributeTags: ["wetland", "walking", "birdwatching", "viewpoint", "accessible"] },
    { id: "san-francisco-nature-bernal", name: "Bernal Heights Park", coordinates: [37.743, -122.414], description: "Bernal Heights Park climbs open grassland above the southeast city with a compact summit loop and broad skyline views. The exposed hill is windy and muddy after rain, while neighborhood access keeps it less ceremonious than Twin Peaks.", hours: { default: "Daily 5:00 AM–midnight." }, officialUrl: "https://sfrecpark.org/facilities/facility/details/Bernal-Heights-Park-151", subcategory: "grassland_hill", attributeTags: ["viewpoint", "grassland", "walking", "dogs", "free_entry"] },
    { id: "san-francisco-nature-glen-canyon", name: "Glen Canyon Park", coordinates: [37.739, -122.443], description: "Glen Canyon protects a steep creek ravine, willow habitat, grassland, and rocky slopes cutting through residential San Francisco. Short trails feel unexpectedly enclosed, though mud, erosion work, and recreation fields divide the experience.", hours: { default: "Daily 5:00 AM–midnight." }, officialUrl: "https://www.sfrecpark.org/Facilities/Facility/Details/Glen-Canyon-Park-336", subcategory: "urban_canyon", attributeTags: ["canyon", "creek", "hiking", "wildlife", "free_entry"] },
    { id: "san-francisco-nature-mount-davidson", name: "Mount Davidson", coordinates: [37.7382, -122.454], description: "Mount Davidson rises through dense eucalyptus and native understory to San Francisco’s highest natural point. The summit cross area is culturally charged, while fog and damp forest make the short climb feel more secluded than its map position.", hours: { default: "Daily 5:00 AM–midnight." }, officialUrl: "https://sfrecpark.org/Facilities/Facility/Details/Mount-Davidson-Park-298", subcategory: "forest_hill", attributeTags: ["forest", "hiking", "viewpoint", "fog", "free_entry"] },
    { id: "san-francisco-nature-botanical", name: "San Francisco Botanical Garden", coordinates: [37.7677, -122.469], description: "San Francisco Botanical Garden uses the city’s mild, foggy climate for magnolias, cloud-forest plants, Mediterranean flora, redwoods, and global collections. Bloom timing matters, while the garden’s broad paths make it one of the city’s easier nature visits.", hours: { default: "Daily from 7:30 AM. Last entry: second Sun in Mar–Sep 6:00 PM; Feb–second Sat in Mar and Oct–first Sat in Nov 5:00 PM; first Sun in Nov–Jan 4:00 PM. Garden closes one hour after last entry." }, officialUrl: "https://gggp.org/visit/admissions-hours/", subcategory: "botanical_garden", attributeTags: ["garden", "plants", "accessible", "ticketed", "seasonal"] },
  ],
}));
