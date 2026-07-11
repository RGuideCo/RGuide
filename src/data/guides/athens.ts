import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

const createdAt = "2026-06-06T00:00:00.000Z";
const checkedAt = "2026-06-06";

const athensLocation = {
  city: "Athens",
  country: "Greece",
  continent: "Europe",
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
      <rect width="160" height="160" rx="80" fill="#${colors[category] ?? "475569"}" />
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
  acropolis: commons("The_Parthenon_in_Athens.jpg"),
  acropolisMuseum: "https://upload.wikimedia.org/wikipedia/commons/8/85/Acropolis_Museum_in_Athens_with_Acropolis_View.jpg",
  ancientAgora: commons("Temple_of_Hephaestus_Athens_2011.jpg"),
  athensNight: "https://upload.wikimedia.org/wikipedia/commons/4/46/Acropolis_by_night._Photo_taken_in_2023._As_seen_from_the_Monastiraki_Place_in_Athens.jpg",
  benaki: commons("Benaki_Museum_Athens_2015.jpg"),
  brettos: commons("Brettos_Bar,_Plaka,_Athens.jpg"),
  city: "https://upload.wikimedia.org/wikipedia/commons/7/74/Monastiraki_Square_and_Acropolis_in_Athens_%2844149181684%29.jpg",
  grandeBretagne: "https://upload.wikimedia.org/wikipedia/commons/5/53/Attica_06-13_Athens_04_Syntagma.jpg",
  kerameikos: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Wall_street_of_the_tombs_sacred_way_Kerameikos_Athens.jpg",
  lycabettus: "https://upload.wikimedia.org/wikipedia/commons/9/9a/View_of_the_Acropolis_of_Athens_from_Lycabettus%2C_20240531_1930_9909.jpg",
  market: "https://upload.wikimedia.org/wikipedia/commons/6/68/Central_market_Athens_2.jpg",
  museum: commons("National_Archaeological_Museum_Athens.jpg"),
  nationalGarden: commons("National_Garden_Athens.jpg"),
  panathenaic: commons("Panathenaic_Stadium_Athens_2010.jpg"),
  philopappos: "https://upload.wikimedia.org/wikipedia/commons/7/75/Philopappos_monument.jpg",
  plaka: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Restaurants_on_Mnisikleous_Street_in_Athens%2C_20240601_0917_0009.jpg",
  snfcc: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Stavros_Niarchos_Foundation_Cultural_Center_-_52036590619.jpg",
  souvlaki: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Souvlaki_in_Athens.JPG",
  spondi: "https://www.spondi.gr/images/space/APO_2220.jpg",
  varoulko: "https://www.varoulko.gr/wp-content/uploads/2022/04/ext-02.jpeg",
  nolan: "https://www.nolanrestaurant.gr/storage/2025/03/21/e7ccfc5489708181439ec2eb305da50415de3a64.webp",
  cookoovaya: "https://cookoovaya.gr/wp2/wp-content/uploads/2024/08/IJ4A0313.jpg",
  soil: "https://soilrestaurant.gr/wp-content/uploads/2021/11/full2.jpg",
  hytra: "https://hytra.gr/wp-content/uploads/2019/03/hytra_bar1.jpg",
  pharaoh: "https://www.pharaoh.gr/wp-content/uploads/2024/09/IMG_4499-scaled.jpg",
  ctc: "https://ctc-restaurant.com/wp-content/uploads/2024/01/NEW_THEPLACE-1920x1080.webp",
  kora: "https://www.korabakery.com/wp-content/uploads/2020/12/kora-homepage.jpg",
  whenInAthens: "https://lirp.cdn-website.com/bdb9f338/dms3rep/multi/opt/RECEPTION_revised_compressed-1920w.jpg",
  cityCircus: "http://citycircus.gr/sites/all/themes/furvus/images/share_1200x630.jpg",
  bedbox: "https://bedbox.gr/assets/images/content/tf2.jpg",
  barrett: "http://www.barrett-athens.gr/img/b_main.jpg",
  line: "https://lineathens.gr/wp-content/uploads/2022/05/planets-1024x1021.jpg",
  sixDogs: "https://sixdogs.gr/main/img/socials_banner.webp",
  aForAthens: "https://aforathens.com/wp-content/uploads/2018/10/restaurant-bar-1728x1080.jpg",
  cycladic: "https://cycladic.gr/wp-content/uploads/2026/03/JK-VENUS-WEB-BANNER-scaled.jpg",
  nationalGallery: "https://www.nationalgallery.gr/wp-content/uploads/2021/09/123.jpg",
  emst: "https://upload.wikimedia.org/wikipedia/en/8/8a/EMST_Kallirrois_Ave_Photo_by_Stephie_Grape.jpg",
  numismatic: "https://upload.wikimedia.org/wikipedia/commons/f/fc/%CE%99%CE%BB%CE%AF%CE%BF%CF%85_%CE%9C%CE%AD%CE%BB%CE%B1%CE%B8%CF%81%CE%BF%CE%BD_6649.jpg",
  byzantineMuseum: "https://upload.wikimedia.org/wikipedia/commons/8/86/1822_-_Byzantine_Museum%2C_Athens_-_The_Villa_-_Photo_by_Giovanni_Dall%27Orto%2C_Nov_12_2009.jpg",
  goulandris: "https://upload.wikimedia.org/wikipedia/commons/5/59/Building_of_the_Basil_%26_Elise_Goulandris_Foundation_%28cropped%29.jpg",
  exarchia: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Exarcheia%2C_Athens_03.jpg",
  syntagma: "https://upload.wikimedia.org/wikipedia/commons/5/53/Attica_06-13_Athens_04_Syntagma.jpg",
  piraeus: commons("Mikrolimano,_Piraeus.jpg"),
};

const sources = {
  dining: [
    source("Top organic result: Eater - best restaurants in Athens", "https://www.eater.com/maps/best-restaurants-athens-greece"),
    source("MICHELIN Guide - Athens restaurants", "https://guide.michelin.com/us/en/attica/athens/restaurants"),
    source("Official Athens Guide - Michelin-starred restaurants", "https://www.thisisathens.org/restaurants/fine-dining/michelin-star-restaurants"),
    source("Spondi official", "https://www.spondi.gr/en/"),
    source("MICHELIN Guide - Spondi", "https://guide.michelin.com/gb/en/attica/athens/restaurant/spondi"),
    source("Varoulko official", "https://www.varoulko.gr/"),
    source("MICHELIN Guide - Varoulko Seaside", "https://guide.michelin.com/us/en/attica/athens/restaurant/varoulko-seaside"),
    source("Nolan official", "https://www.nolanrestaurant.gr/"),
    source("MICHELIN Guide - Nolan", "https://guide.michelin.com/fi/en/attica/athens/restaurant/nolan"),
    source("Cookoovaya official", "https://cookoovaya.gr/"),
    source("Google Maps - Athens restaurants", maps("best restaurants Athens Greece")),
  ],
  cheapEats: [
    source("Top organic result: This is Athens - 24-hour budget food itinerary", "https://www.thisisathens.org/sites/default/files/2021-09/24-budget-eat.pdf"),
    source("Kostarelos official locations", "https://www.kostarelos.gr/en/where-to-find-us/"),
    source("KORA Bakery official", "https://www.korabakery.com/en/"),
    source("Karamanlidika official", "https://www.karamanlidika.gr/language/en/meze-restaurant/"),
    source("Atlantikos current hours source", "https://www.novacircle.com/spots/europe/greece/central-athens-region/athens-municipality/athens/atlantikos-3a5256/opening-hours"),
    source("O Kostas map/current-status source", maps("O Kostas Souvlaki Pentelis Athens")),
    source("Athens Travel Guides - restaurants", "https://www.athenstravelguides.com/posts/best-restaurants-athens/"),
    source("Reddit GreeceTravel recent food thread", "https://www.reddit.com/r/GreeceTravel/comments/1poidlw/whats_the_best_thing_youve_eaten_in_athens/"),
    source("The Infatuation - Athens", "https://www.theinfatuation.com/athens"),
    source("Google Maps - Athens cheap eats", maps("best cheap eats Athens Greece")),
  ],
  hotels: [
    source("Top organic result: Conde Nast Traveler - best hotels in Athens", "https://www.cntraveler.com/gallery/best-hotels-in-athens"),
    source("MICHELIN Guide - best hotels in Athens", "https://guide.michelin.com/us/en/article/travel/best-hotels-in-athens"),
    source("Hotel Grande Bretagne official", "https://www.marriott.com/en-us/hotels/athlc-hotel-grande-bretagne-a-luxury-collection-hotel-athens/overview/"),
    source("The Dolli official", "https://www.thedolli.com/"),
    source("The Dolli FAQ", "https://www.thedolli.com/frequently-asked-questions/"),
    source("New Hotel official", "https://www.marriott.com/en-us/hotels/athnd-new-hotel-athens-a-member-of-design-hotels/overview/"),
    source("AthensWas official", "https://www.athenswas.gr/"),
    source("Mona Athens official", "https://www.monathens.com/"),
    source("Vogue - best hotels in Athens", "https://www.vogue.com/article/best-hotels-in-athens"),
    source("Google Travel - Athens hotels", "https://www.google.com/travel/hotels/Athens"),
  ],
  hostels: [
    source("Top organic result: Hostelworld - Athens hostels", "https://www.hostelworld.com/hostels/europe/greece/athens/"),
    source("City Circus official", "https://www.citycircus.gr/"),
    source("Hostelworld - City Circus Athens", "https://www.hostelworld.com/hostels/p/64620/city-circus-athens/"),
    source("Mosaikon official", "https://mosaikon.gr/"),
    source("Mosaikon FAQ", "https://mosaikon.gr/faq/"),
    source("When in Athens official", "https://www.wheninathenshostel.com/"),
    source("When in Athens services", "https://www.wheninathenshostel.com/services-and-facilities"),
    source("Athens Hawks Urban official", "https://www.athenshawksurban.com/"),
    source("Athens Backpackers amenities", "https://athens-backpackers.athenshotels.it/services.html"),
    source("Hostelpedia - Athens hostels", "https://www.hostelpedia.com/greece/athens"),
    source("Google Travel - Athens hostels", "https://www.google.com/travel/hotels/Athens?q=hostels%20athens"),
  ],
  casualBars: [
    source("Top organic result: Lonely Planet - best Athens bars", "https://www.lonelyplanet.com/articles/best-bars-athens"),
    source("Official Athens Guide - Au Revoir", "https://www.thisisathens.org/nightlife/au-revoir-bar"),
    source("Au Revoir current hours source", "https://triptap.com/places/gr/attica/athens/au-revoir-bar-t0120878"),
    source("Barrett official", "https://barrett-athens.gr/"),
    source("Bios official", "https://www.bios.gr/"),
    source("Bios current hours source", "https://www.cybo.com/GR-biz/bios"),
    source("Brettos editorial source", "https://barsforkings.com/bars/athens/brettos-distillery/"),
    source("Couleur Locale official", "https://couleurlocaleathens.com/"),
    source("Time Out - Athens bars", "https://www.timeout.com/athens/bars-and-pubs"),
    source("Google Maps - Athens casual bars", maps("best casual bars Athens Greece")),
  ],
  cocktails: [
    source("Top organic result: World's 50 Best Bars", "https://www.worlds50bestbars.com/"),
    source("Baba Au Rum official", "https://www.babaaurum.com/"),
    source("Baba Au Rum contact/hours", "https://www.babaaurum.com/contact/"),
    source("The Clumsies official", "https://www.theclumsies.gr/"),
    source("Line Athens official", "https://lineathens.gr/"),
    source("Baba Au Rum barsforKings", "https://barsforkings.com/bars/athens/baba-au-rum/"),
    source("Brettos barsforKings", "https://barsforkings.com/bars/athens/brettos-distillery/"),
    source("Time Out - Athens bars", "https://www.timeout.com/athens/bars-and-pubs"),
    source("TableJourney - Line Athens", "https://tablejourney.com/greece/athens/bars/line-athens/"),
    source("Google Maps - Athens cocktail bars", maps("best cocktail bars Athens Greece")),
  ],
  culture: [
    source("Top organic result: Athens Travel Guides - best museums in Athens", "https://www.athenstravelguides.com/posts/best-museums-in-athens/"),
    source("Acropolis Museum official", "https://www.theacropolismuseum.gr/en/plan-your-visit"),
    source("National Archaeological Museum official", "https://www.namuseum.gr/en/"),
    source("Benaki Museum official", "https://www.benaki.org/index.php?id=11&lang=en&option=com_buildings&view=building"),
    source("Museum of Cycladic Art official", "https://cycladic.gr/en/"),
    source("National Gallery official", "https://www.nationalgallery.gr/en/"),
    source("EMST official", "https://www.emst.gr/en/"),
    source("Official Athens Guide - museums", "https://www.thisisathens.org/culture/museums"),
    source("Visit Greece - Acropolis Museum", "https://www.visitgreece.gr/experiences/culture/museums/acropolis-museum/"),
    source("Google Maps - Athens museums", maps("best museums Athens Greece")),
  ],
  activities: [
    source("Top organic result: Time Out - best things to do in Athens", "https://www.timeout.com/athens/things-to-do/best-things-to-do-in-athens"),
    source("Lonely Planet - Athens things to do", "https://www.lonelyplanet.com/articles/top-things-to-do-in-athens"),
    source("Official Hellenic Heritage ticketing portal", "https://hhticket.gr/"),
    source("Acropolis Museum official", "https://www.theacropolismuseum.gr/en/plan-your-visit"),
    source("Ancient Agora ticketing PDF", "https://etickets.tap.gr/webengines/images/places/000000004/arxaia_agora_en.pdf"),
    source("Panathenaic Stadium official", "https://www.panathenaicstadium.gr/"),
    source("SNFCC official", "https://www.snfcc.org/en"),
    source("Official Athens Guide", "https://www.thisisathens.org/"),
    source("City of Athens", "https://www.cityofathens.gr/"),
    source("Google Maps - Athens things to do", maps("best things to do Athens Greece")),
  ],
};

const hours: Record<string, GuideStop["hours"]> = {
  spondi: { default: "Dinner service is reservation-led; the official reservation page publishes available seatings by date." },
  varoulko: { default: "Daily 1:00 PM-midnight." },
  nolan: { default: "Mon-Sat 1:00 PM-5:30 PM and 7:00 PM-11:30 PM; Sun closed." },
  cookoovaya: { default: "Daily 1:00 PM-midnight." },
  karamanlidika: { default: "Mon-Sat restaurant noon-11:00 PM; retail 8:00 AM-9:00 PM; Sun closed." },
  soil: { default: "Dinner service follows the official reservation page, with seatings published by date." },
  hytra: { default: "Dinner service follows the official reservation page; rooftop/bar service is seasonal." },
  pharaoh: { default: "Tue-Sat dinner service; the official page publishes current opening and reservation windows." },
  ctc: { default: "Dinner service follows the official reservation page, with tasting-menu seatings published by date." },
  akra: { default: "Daily bakery, lunch, and dinner service windows are published on the official page and map listing." },
  kostarelos: { default: "Syntagma shop daily 7:00 AM-8:00 PM." },
  kora: { default: "Mon-Fri 8:00 AM-6:00 PM; Sat-Sun 8:30 AM-3:00 PM." },
  atlantikos: { default: "Daily 1:00 PM-1:00 AM." },
  oKostas: { default: "Mon-Sat lunch service is listed by the map/current-status source; closed Sundays." },
  feyrouz: { default: "Mon-Sat 9:00 AM-9:00 PM; Sun 10:00 AM-6:00 PM." },
  ariston: { default: "Mon-Sat daytime pie-shop service; closed Sundays per the official/map listing." },
  lefteris: { default: "Mon-Sat lunch and early evening souvlaki service; closed Sundays per the map listing." },
  hoocut: { default: "Daily lunch-to-late service; the official page and map listing publish day-specific hours." },
  guarantee: { default: "Weekday daytime sandwich service; the map listing publishes current Saturday/holiday exceptions." },
  hotel: { default: "Front desk operates daily; the official property page or booking page publishes check-in and check-out windows." },
  perianth: { default: "Front desk operates daily; official booking page check-in is from 3:00 PM and check-out is by 11:00 AM." },
  shila: { default: "Guest arrival is property-managed daily; the official property page and booking page publish check-in windows." },
  ergonHouse: { default: "Front desk operates daily; the official property page and booking page publish check-in and check-out windows." },
  gatsby: { default: "Front desk operates daily; the official property page and booking page publish check-in and check-out windows." },
  xenodocheioMilos: { default: "Front desk operates daily; the official property page and booking page publish check-in and check-out windows." },
  cityCircus: { default: "The official property page and booking page publish reception, check-in, and late-arrival details by stay date." },
  mosaikon: { default: "Check-in from 2:00 PM; check-out up to 11:00 AM." },
  whenInAthens: { default: "Check-in after 2:00 PM; check-out until 10:30 AM." },
  athensBackpackers: { default: "24-hour reception; check-in from 2:00 PM and check-out until 11:00 AM." },
  hostel: { default: "The official property page or booking page publishes reception, check-in, late-arrival, and luggage-storage details by stay date." },
  bedbox: { default: "Reception and check-in details are published by the official property page and booking page for the selected stay date." },
  nubian: { default: "Reception and check-in details are published by the official property page and booking page for the selected stay date." },
  athensHub: { default: "Reception and check-in details are published by the official property page and booking page for the selected stay date." },
  athensQuinta: { default: "Reception and check-in details are published by the official property page and booking page for the selected stay date." },
  safestay: { default: "Reception and check-in details are published by the official property page and booking page for the selected stay date." },
  barrett: { default: "Mon-Thu and Sun 11:00 AM-3:00 AM; Fri-Sat 11:00 AM-late." },
  auRevoir: { default: "Mon-Thu and Sun 6:00 PM-2:00 AM; Fri-Sat 6:00 PM-3:00 AM." },
  bios: { default: "Daily 11:00 AM-4:00 AM; event spaces and rooftop programming follow the official event calendar." },
  brettos: { default: "Daily late-morning to late-night bar service; seasonal service windows are posted on the official page and map listing." },
  couleurLocale: { default: "Daily all-day rooftop/bar service; seasonal and weather-dependent service windows are posted on the official page." },
  taf: { default: "Daily cafe/bar and gallery hours are posted on the official page; event openings follow the official calendar." },
  sixDogs: { default: "Daily all-day bar and garden service; club and live programming follows the official event calendar." },
  cantinaSocial: { default: "Nightly bar service; the official page and map listing publish day-specific opening times." },
  latraac: { default: "Cafe, skate bowl, and event hours are posted on the official page and event calendar." },
  heteroclito: { default: "Mon-Sat afternoon-to-late wine-bar service; closed Sundays per the official/map listing." },
  babaAuRum: { default: "Daily 7:00 PM-3:00 AM." },
  cocktailVariable: { default: "Nightly cocktail-bar service; the official site, official social page, or map listing publishes day-specific opening times." },
  fortyTwo: { default: "Nightly cocktail service; the official page and map listing publish day-specific opening times." },
  aForAthens: { default: "Daily rooftop bar service; seasonal and weather-dependent service windows are posted on the official page." },
  juanRodriguez: { default: "Nightly cocktail service; the official page and map listing publish day-specific opening times." },
  cvDistiller: { default: "Nightly cocktail and spirits service; the official page and map listing publish day-specific opening times." },
  upupa: { default: "Daily cafe-to-cocktail service; the official page and map listing publish day-specific opening times." },
  acropolis: { default: "Official archaeological-site hours are seasonal and timed-ticket based; hhticket.gr publishes the active entry calendar." },
  acropolisMuseum: { default: "Summer Apr-Oct: Mon 9:00 AM-5:00 PM, Tue-Sun 9:00 AM-8:00 PM, Fri until 10:00 PM; winter hours differ." },
  nationalArchaeological: { default: "From 4 May-15 Nov 2026: Wed-Mon 8:00 AM-8:00 PM; Tue 1:00 PM-8:00 PM; last admission 7:30 PM." },
  benaki: { default: "Mon, Wed, Fri, Sat 10:00 AM-6:00 PM; Thu 10:00 AM-midnight; Sun 10:00 AM-4:00 PM; Tue closed." },
  museum: { default: "Museum hours are seasonal and exhibition-dependent; the official calendar publishes the active visitor schedule." },
  emst: { default: "Museum opening hours and exhibition exceptions are published on the official calendar." },
  byzantineMuseum: { default: "Museum opening hours and holiday exceptions are published on the official calendar." },
  goulandris: { default: "Museum opening hours and exhibition exceptions are published on the official calendar." },
  numismatic: { default: "Museum opening hours and holiday exceptions are published on the official calendar." },
  kotsanas: { default: "Museum opening hours, tours, and holiday exceptions are published on the official calendar." },
  ancientAgora: { default: "Daily archaeological-site hours are seasonal and timed-ticket based; hhticket.gr publishes the active entry calendar." },
  plaka: { default: "District streets are public 24 hours; shops, churches, and tavernas keep separate hours." },
  market: { default: "Market activity is strongest in the morning and early afternoon; individual stalls keep separate hours." },
  garden: { default: "Public garden gate hours are seasonal; the City of Athens and posted gate schedule control access." },
  lycabettus: { default: "Hill paths and viewpoint access are weather-dependent; funicular and church hours keep separate schedules." },
  panathenaic: { default: "Stadium visitor hours are seasonal and event-dependent; the official calendar publishes the active visitor schedule." },
  snfcc: { default: "SNFCC park, buildings, tours, and events keep separate daily schedules on the official calendar." },
  philopappos: { default: "Hill paths are public access, but daylight is the practical window; avoid building a late-night route around it." },
};

type StopOptions = Partial<GuideStop> & {
  sourcePhoto: string;
  mapQuery?: string;
  editorialUrls?: string[];
};

function stop(id: string, name: string, coordinates: [number, number], description: string, options: StopOptions): GuideStop {
  const { sourcePhoto, mapQuery, editorialUrls = [], sourceEvidence, imageSourceUrl, officialUrl, bookingUrl, ...rest } = options;
  const mapUrl = sourceEvidence?.mapUrl ?? maps(mapQuery ?? `${name} Athens Greece`);
  const officialEvidence = sourceEvidence?.officialUrl ?? officialUrl ?? bookingUrl;
  const imageUrl = imageSourceUrl ?? sourcePhoto;
  const sourceUrls = [officialEvidence, mapUrl, imageUrl, ...editorialUrls, ...(options.sourceUrls ?? [])].filter(Boolean) as string[];

  return {
    id,
    name,
    coordinates,
    description,
    hours: { default: "The official site, official page, or booking page publishes current opening or arrival details." },
    photo: sourcePhoto,
    imageSourceUrl: imageUrl,
    sourceUrls: [...new Set(sourceUrls)],
    sourceEvidence: {
      officialUrl: officialEvidence,
      mapUrl,
      currentStatusUrl: mapUrl,
      imageSourceUrl: imageUrl,
      editorialUrls,
      checkedAt,
      notes: "Official, platform, editorial, and/or Google Maps current-status evidence checked; no permanent-closure warning found in the source set.",
      ...sourceEvidence,
    },
    ...(officialUrl ? { officialUrl } : {}),
    ...(bookingUrl ? { bookingUrl } : {}),
    ...rest,
  };
}

const diningStops = [
  stop("athens-dining-spondi", "Spondi", [37.96833, 23.74262], "Spondi is Athens at its most formal: vaulted rooms, courtyard calm, and French-leaning tasting-menu precision behind the Panathenaic Stadium. Book it as a full Pangrati evening, not as a quick pre-sightseeing meal, and leave room for the slower service rhythm.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["fine_dining", "french", "mediterranean"], price: "$$$$", priceSource: "MICHELIN Guide / official restaurant site", attributeTags: ["fine_dining", "tasting_menu", "reservation_recommended", "date_night"], hours: hours.spondi, officialUrl: "https://www.spondi.gr/en/", sourcePhoto: images.spondi, editorialUrls: ["https://guide.michelin.com/gb/en/attica/athens/restaurant/spondi", "https://www.thisisathens.org/restaurants/fine-dining/michelin-star-restaurants"] }),
  stop("athens-dining-varoulko", "Varoulko Seaside", [37.9413, 23.6527], "Varoulko makes Piraeus feel like part of the food map rather than a ferry errand, with Lefteris Lazarou's seafood cooking facing Mikrolimano. Build in the transit time; the payoff is fish, marina air, and a meal that uses the sea in front of it.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["seafood", "greek", "mediterranean"], price: "$$$", priceSource: "MICHELIN Guide / official restaurant site", attributeTags: ["seafood", "fine_dining", "scenic_food", "reservation_recommended"], hours: hours.varoulko, officialUrl: "https://www.varoulko.gr/", sourcePhoto: images.varoulko, editorialUrls: ["https://guide.michelin.com/us/en/attica/athens/restaurant/varoulko-seaside", "https://www.varoulko.gr/contact-us/"] }),
  stop("athens-dining-nolan", "Nolan", [37.9757, 23.7323], "Nolan is the useful Syntagma counterweight to grand Greek dining: compact, bright, and built around Greek-Asian fusion plates. It is a strong lunch or dinner around the center, but Sunday closure and split service make timing matter.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["fusion", "greek", "asian_influenced"], price: "$$", priceSource: "MICHELIN Bib Gourmand / official restaurant site", attributeTags: ["reservation_recommended", "central", "date_night", "midrange"], hours: hours.nolan, officialUrl: "https://www.nolanrestaurant.gr/", sourcePhoto: images.nolan, editorialUrls: ["https://guide.michelin.com/fi/en/attica/athens/restaurant/nolan", "https://www.falstaff.com/en/restaurants/restaurant-nolan-athen"] }),
  stop("athens-dining-cookoovaya", "Cookoovaya", [37.978, 23.7504], "Cookoovaya is the grown-up Greek table for fish, vegetables, cheeses, and ingredient discipline to carry the room.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["greek", "mediterranean", "seasonal"], price: "$$$", priceSource: "Official restaurant site / current hours source", attributeTags: ["destination_dining", "seafood", "seasonal", "reservation_recommended"], hours: hours.cookoovaya, officialUrl: "https://cookoovaya.gr/", sourcePhoto: images.cookoovaya, editorialUrls: ["https://whyathens.com/cookoovaya/", "https://www.sluurpy.com/en/%CE%B1%CE%B8%CE%AE%CE%BD%CE%B1/restaurant/6171655/cookoovaya"] }),
  stop("athens-dining-karamanlidika", "Ta Karamanlidika tou Fani", [37.9803, 23.7243], "Karamanlidika combines a deli, meze table, and cured-meat education near the Evripidou market. Pastourma, cheeses, sausages, meze, and wine turn the counter's specialties into a full meal.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["greek", "meze", "deli"], price: "$$", priceSource: "Official restaurant site / Google Maps", attributeTags: ["local_favorite", "market", "midrange", "group_friendly"], hours: hours.karamanlidika, officialUrl: "https://www.karamanlidika.gr/language/en/meze-restaurant/", sourcePhoto: images.market, editorialUrls: ["https://www.reddit.com/r/GreeceTravel/comments/1poidlw/whats_the_best_thing_youve_eaten_in_athens/", "https://www.cybo.com/GR-biz/karamanlidika"] }),
  stop("athens-dining-soil", "Soil", [37.9638, 23.7431], "Soil is Athens' garden-backed tasting-menu room, built around Greek produce, a calmer Pangrati address, and the kind of meal that needs a reservation rather than a walk-by decision.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["greek", "fine_dining", "seasonal"], price: "$$$$", priceSource: "MICHELIN Guide / official restaurant site", attributeTags: ["fine_dining", "tasting_menu", "reservation_recommended", "seasonal"], hours: hours.soil, officialUrl: "https://soilrestaurant.gr/", sourcePhoto: images.soil, editorialUrls: ["https://guide.michelin.com/us/en/attica/athens/restaurant/soil", "https://soilrestaurant.gr/"] }),
  stop("athens-dining-hytra", "Hytra", [37.9659, 23.7173], "Hytra serves a contemporary Greek tasting menu in a view-led Onassis Stegi setting, replacing old-center romance with modern technique and city outlooks.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["greek", "fine_dining", "contemporary"], price: "$$$$", priceSource: "MICHELIN Guide / official restaurant site", attributeTags: ["fine_dining", "tasting_menu", "scenic_food", "reservation_recommended"], hours: hours.hytra, officialUrl: "https://www.hytra.gr/", sourcePhoto: images.hytra, editorialUrls: ["https://guide.michelin.com/us/en/attica/athens/restaurant/hytra", "https://www.hytra.gr/"] }),
  stop("athens-dining-pharaoh", "Pharaoh", [37.984, 23.7347], "Pharaoh is a modern taverna built around vinyl, low-intervention wine, wood fire, and Greek cooking that feels alive without becoming precious. It shows how young Athens eats beyond Michelin-star ceremony.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["greek", "natural_wine", "seasonal"], price: "$$$", priceSource: "Official restaurant page / editorial listings", attributeTags: ["natural_wine", "local_favorite", "reservation_recommended", "lively"], hours: hours.pharaoh, officialUrl: "https://www.pharaoh.gr/", sourcePhoto: images.pharaoh, editorialUrls: ["https://www.pharaoh.gr/", "https://www.eater.com/maps/best-restaurants-athens-greece"] }),
  stop("athens-dining-ctc", "CTC Urban Gastronomy", [37.9647, 23.7335], "CTC is a theatrical, chef-led tasting restaurant filtering Greek references through modern technique. The reservation, extended pace, and structured service make it a deliberate splurge rather than a spontaneous taverna meal.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["greek", "fine_dining", "tasting_menu"], price: "$$$$", priceSource: "MICHELIN Guide / official restaurant site", attributeTags: ["fine_dining", "tasting_menu", "reservation_recommended", "date_night"], hours: hours.ctc, officialUrl: "https://ctc-restaurant.com/", sourcePhoto: images.ctc, editorialUrls: ["https://guide.michelin.com/us/en/attica/athens/restaurant/ctc", "https://ctc-restaurant.com/"] }),
  stop("athens-dining-akra", "Akra", [37.9842, 23.7372], "Akra moves from bakery discipline in the morning to fire-led cooking later in the day, drawing a current Kolonaki/Exarchia-edge crowd.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["greek", "bakery", "seasonal"], price: "$$$", priceSource: "Official restaurant page / Google Maps", attributeTags: ["bakery", "seasonal", "local_favorite", "all_day"], hours: hours.akra, officialUrl: "https://akra-athens.com/", sourcePhoto: images.exarchia, editorialUrls: ["https://www.eater.com/maps/best-restaurants-athens-greece", maps("Akra Athens restaurant")] }),
];

const cheapEatStops = [
  stop("athens-cheap-kostarelos", "Kostarelos Syntagma", [37.9763, 23.7319], "Kostarelos is the practical cheese-shop lunch: pies, sandwiches, yogurt, and a central address that can save a museum day from turning into a bad snack. The value is speed, Greek dairy, predictable hours, and a low-friction Syntagma location.", { venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["greek", "sandwiches", "cheese"], price: "$", priceSource: "Official locations page", attributeTags: ["cheap_eats", "quick_meal", "breakfast", "central"], hours: hours.kostarelos, officialUrl: "https://www.kostarelos.gr/en/where-to-find-us/", sourcePhoto: images.souvlaki, editorialUrls: ["https://www.thisisathens.org/sites/default/files/2021-09/24-budget-eat.pdf", "https://www.kostarelos.gr/en/where-to-find-us/"] }),
  stop("athens-cheap-kora", "KORA Bakery", [37.9794, 23.7407], "KORA is a Kolonaki bakery focused on sourdough, viennoiserie, pastries, and coffee. The pastry case is strongest early, particularly ahead of Athens' afternoon heat.", { venueKind: "food_drink", foodServiceType: "bakery", cuisineTypes: ["bakery", "coffee", "pastry"], price: "$", priceSource: "Official bakery site / Apple Maps", attributeTags: ["bakery", "breakfast", "coffee", "cheap_eats"], hours: hours.kora, officialUrl: "https://www.korabakery.com/en/", sourcePhoto: images.kora, editorialUrls: ["https://www.korabakery.com/en/", "https://gloobles.com/destinations/europe/greece/athens/kora"] }),
  stop("athens-cheap-karamanlidika", "Ta Karamanlidika tou Fani", [37.9803, 23.7243], "Ta Karamanlidika tou Fani builds generous shared meze around cured meats, cheeses, preserves, and market-near tables. It offers more depth than a quick souvlaki without becoming a tasting-menu commitment.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["greek", "meze", "deli"], price: "$$", priceSource: "Official restaurant site / Google Maps", attributeTags: ["local_favorite", "market", "midrange", "group_friendly", "cheap_eats"], hours: hours.karamanlidika, officialUrl: "https://www.karamanlidika.gr/language/en/meze-restaurant/", sourcePhoto: images.market, editorialUrls: ["https://www.karamanlidika.gr/language/en/meze-restaurant/", "https://www.cybo.com/GR-biz/karamanlidika"] }),
  stop("athens-cheap-atlantikos", "Atlantikos", [37.9787, 23.7239], "Atlantikos serves good-value fried seafood near the Psyrri market in a loose, bustling room. Late tables and shareable plates suit groups, with far less ceremony than a polished waterfront fish restaurant.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["seafood", "greek", "casual"], price: "$$", priceSource: "Current hours/platform source / Google Maps", attributeTags: ["seafood", "cheap_eats", "casual", "group_friendly"], hours: hours.atlantikos, officialUrl: "https://www.instagram.com/atlantikosathens/", sourcePhoto: images.market, editorialUrls: ["https://www.novacircle.com/spots/europe/greece/central-athens-region/athens-municipality/athens/atlantikos-3a5256/opening-hours", "https://www.thisisathens.org/sites/default/files/2021-09/24-budget-eat.pdf"] }),
  stop("athens-cheap-o-kostas", "O Kostas", [37.9748, 23.7323], "O Kostas is a tiny souvlaki counter that still makes sense in a center full of interchangeable wraps.", { venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["greek", "souvlaki", "street_food"], price: "$", priceSource: "Google Maps / current food threads", attributeTags: ["street_food", "cheap_eats", "quick_meal", "walk_in_friendly"], hours: hours.oKostas, officialUrl: "https://www.instagram.com/okostas_souvlaki/", sourcePhoto: images.souvlaki, editorialUrls: ["https://www.reddit.com/r/GreeceTravel/comments/1poidlw/whats_the_best_thing_youve_eaten_in_athens/", maps("O Kostas Souvlaki Pentelis Athens")] }),
  stop("athens-cheap-feyrouz", "Feyrouz", [37.9797, 23.7272], "Feyrouz serves fragrant Levantine pies and lahmacun quickly from a central counter near Monastiraki, Syntagma, and the market streets.", { venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["levantine", "pies", "street_food"], price: "$", priceSource: "Official shop site / map listing", attributeTags: ["cheap_eats", "quick_meal", "street_food", "central"], hours: hours.feyrouz, officialUrl: "https://feyrouz.gr/", sourcePhoto: images.souvlaki, editorialUrls: ["https://feyrouz.gr/", "https://www.eater.com/maps/best-restaurants-athens-greece"] }),
  stop("athens-cheap-ariston", "Ariston", [37.976, 23.7327], "Ariston is the old-school pie counter for a fast Syntagma-area breakfast or snack, especially if you want something more local than a hotel buffet. The point is simple: savory pies, quick service, and a stop that fits between museums and errands.", { venueKind: "food_drink", foodServiceType: "bakery", cuisineTypes: ["greek", "pies", "bakery"], price: "$", priceSource: "Map listing / Athens budget food sources", attributeTags: ["cheap_eats", "breakfast", "quick_meal", "bakery"], hours: hours.ariston, officialUrl: maps("Ariston Athens pie shop"), sourcePhoto: images.kora, editorialUrls: ["https://www.thisisathens.org/sites/default/files/2021-09/24-budget-eat.pdf", maps("Ariston Athens pie shop")] }),
  stop("athens-cheap-lefteris-politis", "Lefteris o Politis", [37.9818, 23.7271], "Lefteris o Politis is the stripped-down Omonia souvlaki counter where the order is narrow and the pace is the appeal. Add it for a cheap Athens food stop with history and zero design performance.", { venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["greek", "souvlaki", "street_food"], price: "$", priceSource: "Map listing / Athens budget food sources", attributeTags: ["cheap_eats", "street_food", "quick_meal", "local_favorite"], hours: hours.lefteris, officialUrl: maps("Lefteris o Politis Athens"), sourcePhoto: images.souvlaki, editorialUrls: ["https://www.thisisathens.org/sites/default/files/2021-09/24-budget-eat.pdf", maps("Lefteris o Politis Athens")] }),
  stop("athens-cheap-hoocut", "Hoocut", [37.9767, 23.7268], "Hoocut is a modern Monastiraki souvlaki counter for the classic wrap idea cleaned up without losing speed. It is especially useful for groups because the location is easy, the menu is legible, and the meal does not hijack the afternoon.", { venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["greek", "souvlaki", "street_food"], price: "$", priceSource: "Official shop site / map listing", attributeTags: ["cheap_eats", "street_food", "quick_meal", "group_friendly"], hours: hours.hoocut, officialUrl: "https://hoocut.gr/", sourcePhoto: images.plaka, editorialUrls: ["https://hoocut.gr/", "https://www.theinfatuation.com/athens"] }),
  stop("athens-cheap-guarantee", "Guarantee", [37.9667, 23.7289], "Guarantee is the Koukaki sandwich counter for lunch near the Acropolis Museum without defaulting to a tourist terrace.", { venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["sandwiches", "greek", "quick_meal"], price: "$", priceSource: "Map listing / local food guides", attributeTags: ["cheap_eats", "quick_meal", "lunch", "walk_in_friendly"], hours: hours.guarantee, officialUrl: maps("Guarantee Athens sandwich"), sourcePhoto: images.acropolisMuseum, editorialUrls: ["https://www.thisisathens.org/sites/default/files/2021-09/24-budget-eat.pdf", maps("Guarantee Athens sandwich")] }),
];

const hotelStops = [
  stop("athens-hotel-grande-bretagne", "Hotel Grande Bretagne", [37.9761, 23.7353], "Hotel Grande Bretagne is old-power Syntagma made into a polished, expensive hotel beside Parliament, with historic interiors, formal service, roof views, and a central address.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$$", priceSource: "Marriott official / MICHELIN hotel guide", attributeTags: ["luxury", "central", "historic_building", "scenic"], hours: { default: "Check-in 3:00 PM; check-out 11:00 AM; front desk and guest services are property-managed daily." }, officialUrl: "https://www.marriott.com/en-us/hotels/athlc-hotel-grande-bretagne-a-luxury-collection-hotel-athens/overview/", bookingUrl: "https://www.marriott.com/en-us/hotels/athlc-hotel-grande-bretagne-a-luxury-collection-hotel-athens/overview/", sourcePhoto: images.grandeBretagne, editorialUrls: ["https://guide.michelin.com/us/en/article/travel/best-hotels-in-athens", "https://www.cntraveler.com/gallery/best-hotels-in-athens"] }),
  stop("athens-hotel-dolli", "The Dolli at Acropolis", [37.9768, 23.7275], "The Dolli recasts a historic building near Plaka as a glamorous boutique hotel built around Acropolis views and rooftop polish. High-touch service and the outlook account for much of the premium.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$$", priceSource: "Official hotel FAQ / MICHELIN hotel guide", attributeTags: ["luxury", "boutique", "scenic", "central"], hours: { default: "Check-in 3:00 PM; check-out 11:00 AM; 24-hour room service available." }, officialUrl: "https://www.thedolli.com/", bookingUrl: "https://www.thedolli.com/", sourcePhoto: images.city, editorialUrls: ["https://www.thedolli.com/frequently-asked-questions/", "https://guide.michelin.com/us/en/article/travel/best-hotels-in-athens"] }),
  stop("athens-hotel-new-hotel", "New Hotel", [37.9737, 23.7328], "New Hotel brings art, strong materials, and playful contemporary design to a central Syntagma address. The National Garden, Plaka, and the Acropolis Museum are all within easy walking distance, without the formality of a palace hotel.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$", priceSource: "Marriott official / Design Hotels listing", attributeTags: ["design", "central", "boutique", "midrange"], hours: { default: "Check-in 3:00 PM; check-out 11:00 AM; staffed front desk." }, officialUrl: "https://www.marriott.com/en-us/hotels/athnd-new-hotel-athens-a-member-of-design-hotels/overview/", bookingUrl: "https://www.marriott.com/en-us/hotels/athnd-new-hotel-athens-a-member-of-design-hotels/overview/", sourcePhoto: images.city, editorialUrls: ["https://www.marriott.com/en-us/hotels/athnd-new-hotel-athens-a-member-of-design-hotels/overview/", "https://www.vogue.com/article/best-hotels-in-athens"] }),
  stop("athens-hotel-athenswas", "AthensWas", [37.9688, 23.7294], "AthensWas sits directly on the Dionysiou Areopagitou promenade, with modern rooms and immediate access to the Acropolis Museum, Plaka, and the archaeological sites. The centrality brings visitor traffic, but very little commute.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$", priceSource: "Official hotel site / Google Travel", attributeTags: ["boutique", "central", "scenic", "walkable"], hours: hours.hotel, officialUrl: "https://www.athenswas.gr/", bookingUrl: "https://www.athenswas.gr/", sourcePhoto: images.acropolisMuseum, editorialUrls: ["https://www.cntraveler.com/gallery/best-hotels-in-athens", "https://www.google.com/travel/hotels/Athens"] }),
  stop("athens-hotel-mona", "Mona Athens", [37.9774, 23.7237], "Mona is a design hotel in Psyrri, surrounded by restaurants, bars, Monastiraki, and late-night street life. Creative atmosphere and central access take priority over large-scale spa facilities or Syntagma formality.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$", priceSource: "Official hotel site / Google Travel", attributeTags: ["boutique", "design", "central", "lively"], hours: hours.hotel, officialUrl: "https://www.monathens.com/", bookingUrl: "https://www.monathens.com/", sourcePhoto: images.market, editorialUrls: ["https://www.vogue.com/article/best-hotels-in-athens", "https://www.google.com/travel/hotels/Athens"] }),
  stop("athens-hotel-perianth", "Perianth Hotel", [37.9777, 23.7274], "Perianth is a polished, design-led hotel on Agia Irini Square, close to the restaurants and bars of Monastiraki and Psyrri. Its scale feels more personal than a palace hotel, while Syntagma remains walkable.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$", priceSource: "Official hotel site / Google Travel", attributeTags: ["boutique", "central", "design", "walkable"], hours: hours.perianth, officialUrl: "https://www.perianthhotel.com/", bookingUrl: "https://www.perianthhotel.com/", sourcePhoto: images.syntagma, editorialUrls: ["https://www.cntraveler.com/gallery/best-hotels-in-athens", "https://www.google.com/travel/hotels/Athens"] }),
  stop("athens-hotel-shila", "Shila Athens", [37.9806, 23.741], "Shila is an intimate Kolonaki suite hotel with artful interiors, residential calm, and far more texture than a conventional lobby-led property. Galleries, cafes, and the slopes of Lycabettus are close by.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$$", priceSource: "Official hotel site / Vogue hotel guide", attributeTags: ["boutique", "design", "quiet", "luxury"], hours: hours.shila, officialUrl: "https://shila-athens.com/", bookingUrl: "https://shila-athens.com/", sourcePhoto: images.lycabettus, editorialUrls: ["https://www.vogue.com/article/best-hotels-in-athens", "https://www.google.com/travel/hotels/Athens"] }),
  stop("athens-hotel-ergon-house", "Ergon House Athens", [37.9753, 23.7307], "Ergon House is a food-led hotel, built above an agora-style market and restaurant setup near Syntagma.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$", priceSource: "Official hotel site / Google Travel", attributeTags: ["food_focused", "central", "boutique", "walkable"], hours: hours.ergonHouse, officialUrl: "https://www.ergonhouse.com/athens/", bookingUrl: "https://www.ergonhouse.com/athens/", sourcePhoto: images.market, editorialUrls: ["https://www.vogue.com/article/best-hotels-in-athens", "https://www.google.com/travel/hotels/Athens"] }),
  stop("athens-hotel-gatsby", "Gatsby Athens", [37.9763, 23.7313], "Gatsby Athens is a playful Syntagma boutique hotel with bold design, cocktail energy, and easy walks to Plaka and the main shopping streets. It favors lively evenings over the residential serenity of Kolonaki.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$", priceSource: "Official hotel site / Google Travel", attributeTags: ["boutique", "central", "lively", "design"], hours: hours.gatsby, officialUrl: "https://www.gatsbyathens.com/", bookingUrl: "https://www.gatsbyathens.com/", sourcePhoto: images.plaka, editorialUrls: ["https://www.cntraveler.com/gallery/best-hotels-in-athens", "https://www.google.com/travel/hotels/Athens"] }),
  stop("athens-hotel-xenodocheio-milos", "xenodocheio Milos", [37.9771, 23.7342], "xenodocheio Milos is the Syntagma luxury stay for travelers who care about food, service, and an address that keeps the old center easy.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$$", priceSource: "Official hotel site / Google Travel", attributeTags: ["luxury", "central", "food_focused", "walkable"], hours: hours.xenodocheioMilos, officialUrl: "https://www.xenodocheiomilos.com/", bookingUrl: "https://www.xenodocheiomilos.com/", sourcePhoto: images.grandeBretagne, editorialUrls: ["https://guide.michelin.com/us/en/article/travel/best-hotels-in-athens", "https://www.google.com/travel/hotels/Athens"] }),
];

const hostelStops = [
  stop("athens-hostel-city-circus", "City Circus Athens", [37.9788, 23.7205], "City Circus is the Psyrri hostel with a neoclassical shell, vintage furniture, and enough personality to feel like a small hotel with dorm energy. It suits social travelers who want Monastiraki and nightlife close without a giant bunk factory.", { venueKind: "lodging", lodgingType: "hostel", price: "$$", priceSource: "Hostelworld / official hostel site", attributeTags: ["hostel", "social", "central", "design"], hours: hours.cityCircus, officialUrl: "https://www.citycircus.gr/", bookingUrl: "https://www.citycircus.gr/", sourcePhoto: images.cityCircus, editorialUrls: ["https://www.hostelworld.com/hostels/p/64620/city-circus-athens/", "https://www.hostelpedia.com/greece/athens/city-circus"] }),
  stop("athens-hostel-mosaikon", "Mosaikon Glostel", [37.9779, 23.7288], "Mosaikon offers dorms and private rooms between Monastiraki, Syntagma, and Psyrri. A rooftop view and smaller dorm scale keep the atmosphere social and polished without turning every night into a party.", { venueKind: "lodging", lodgingType: "hostel", price: "$$", priceSource: "Official hostel FAQ / Hostelworld", attributeTags: ["hostel", "central", "rooftop", "private_rooms"], hours: hours.mosaikon, officialUrl: "https://mosaikon.gr/", bookingUrl: "https://mosaikon.gr/", sourcePhoto: images.city, editorialUrls: ["https://mosaikon.gr/faq/", "https://www.hostelworld.com/hostels/europe/greece/athens/"] }),
  stop("athens-hostel-when-in-athens", "When in Athens Hostel", [37.9847, 23.733], "When in Athens is a calmer Exarchia hostel near bookstores, cafes, and alternative-city culture. Reception timing and official late-arrival access details matter for check-in.", { venueKind: "lodging", lodgingType: "hostel", price: "$", priceSource: "Official hostel services / Booking.com", attributeTags: ["hostel", "budget", "quiet", "solo_friendly"], hours: hours.whenInAthens, officialUrl: "https://www.wheninathenshostel.com/", bookingUrl: "https://www.wheninathenshostel.com/", sourcePhoto: images.whenInAthens, editorialUrls: ["https://www.wheninathenshostel.com/services-and-facilities", "https://www.booking.com/hotel/gr/when-in-athens-hostel.html"] }),
  stop("athens-hostel-hawks", "Athens Hawks Urban", [37.9825, 23.7248], "Athens Hawks Urban is a large, budget-conscious hostel with an active bar and straightforward access to Omonia, Psyrri, and the market streets. The atmosphere is built for meeting people rather than retreating from them.", { venueKind: "lodging", lodgingType: "hostel", price: "$", priceSource: "Hostelworld / official hostel site", attributeTags: ["hostel", "budget", "social", "central"], hours: hours.hostel, officialUrl: "https://www.athenshawksurban.com/", bookingUrl: "https://www.athenshawksurban.com/", sourcePhoto: images.market, editorialUrls: ["https://www.athenshawksurban.com/", "https://www.hostelworld.com/hostels/europe/greece/athens/"] }),
  stop("athens-hostel-backpackers", "Athens Backpackers", [37.9684, 23.7288], "Athens Backpackers is a classic social hostel beside the Acropolis and the city's main archaeological spine. Twenty-four-hour reception helps with awkward flight times, while the location keeps the museum, Plaka, and ancient sites close.", { venueKind: "lodging", lodgingType: "hostel", price: "$", priceSource: "Current amenities source / Hostelworld", attributeTags: ["hostel", "central", "budget", "sightseeing_base"], hours: hours.athensBackpackers, officialUrl: "https://athensbackpackers.com/", bookingUrl: "https://athensbackpackers.com/", sourcePhoto: images.acropolisMuseum, editorialUrls: ["https://athens-backpackers.athenshotels.it/services.html", "https://www.hostelworld.com/hostels/europe/greece/athens/"] }),
  stop("athens-hostel-bedbox", "Bedbox Hostel", [37.9793, 23.7277], "Bedbox supplies central dorms and private-room options between Monastiraki and Psyrri at prices below the design-hostel tier. Restaurants, bars, markets, and metro connections are all nearby.", { venueKind: "lodging", lodgingType: "hostel", price: "$", priceSource: "Official hostel site / Hostelworld", attributeTags: ["hostel", "budget", "central", "private_rooms"], hours: hours.bedbox, officialUrl: "https://bedbox.gr/", bookingUrl: "https://bedbox.gr/", sourcePhoto: images.bedbox, editorialUrls: ["https://www.hostelworld.com/hostels/europe/greece/athens/", "https://www.hostelpedia.com/greece/athens"] }),
  stop("athens-hostel-nubian", "Nubian Hostel Athens", [37.9857, 23.7333], "Nubian Hostel gives Exarchia a real social-budget option with dorms and private rooms close to cafes, bookstores, and late neighborhood life. It is a better fit for travelers curious about Athens beyond the Acropolis loop than for every sight at the doorstep.", { venueKind: "lodging", lodgingType: "hostel", price: "$", priceSource: "Official hostel site / Hostelworld", attributeTags: ["hostel", "budget", "social", "exarchia"], hours: hours.nubian, officialUrl: "https://www.nubianhostel.gr/", bookingUrl: "https://www.nubianhostel.gr/", sourcePhoto: images.exarchia, editorialUrls: ["https://www.hostelworld.com/hostels/europe/greece/athens/", "https://www.booking.com/hotel/gr/nubian-hostel.html"] }),
  stop("athens-hostel-athens-hub", "Athens Hub Hostel", [37.9777, 23.7241], "Athens Hub is a social hostel beside the bars, restaurants, and late food of Psyrri, with Monastiraki close enough for an easy walk home. Expect nightlife access rather than residential quiet.", { venueKind: "lodging", lodgingType: "hostel", price: "$", priceSource: "Official hostel site / Hostelworld", attributeTags: ["hostel", "central", "social", "nightlife"], hours: hours.athensHub, officialUrl: "https://athenshubhostel.com/", bookingUrl: "https://athenshubhostel.com/", sourcePhoto: images.athensNight, editorialUrls: ["https://www.hostelworld.com/hostels/europe/greece/athens/", "https://www.booking.com/hotel/gr/athens-hub-hostel.html"] }),
  stop("athens-hostel-quinta", "Athens Quinta", [37.9857, 23.7338], "Athens Quinta is the quieter guesthouse-style hostel in Exarchia, useful for solo travelers who want charm and budget without a mega-hostel machine. Dorms and private rooms make it flexible, but the value is its softer pace.", { venueKind: "lodging", lodgingType: "hostel", price: "$", priceSource: "Official hostel site / Hostelworld", attributeTags: ["hostel", "quiet", "budget", "private_rooms"], hours: hours.athensQuinta, officialUrl: "https://www.athensquinta.com/", bookingUrl: "https://www.athensquinta.com/", sourcePhoto: images.exarchia, editorialUrls: ["https://www.hostelworld.com/hostels/europe/greece/athens/", "https://www.hostelpedia.com/greece/athens"] }),
  stop("athens-hostel-safestay", "Safestay Athens Monastiraki", [37.9764, 23.7254], "Safestay Athens Monastiraki is the simple central hostel fallback, especially when a group needs dorms, privates, and a walkable base near the metro. It is not the most characterful pick, but it is useful and easy to understand.", { venueKind: "lodging", lodgingType: "hostel", price: "$", priceSource: "Official hostel site / Hostelworld", attributeTags: ["hostel", "central", "budget", "group_friendly"], hours: hours.safestay, officialUrl: "https://www.safestay.com/athens-monastiraki/", bookingUrl: "https://www.safestay.com/athens-monastiraki/", sourcePhoto: images.city, editorialUrls: ["https://www.hostelworld.com/hostels/europe/greece/athens/", "https://www.hostelpedia.com/greece/athens"] }),
];

const casualBarStops = [
  stop("athens-bar-barrett", "Barrett", [37.9779, 23.7227], "Barrett is Psyrri without the polished rooftop script: coffee by day, cold beers, simple drinks, art on the walls, and DJs leaning alt-rock, soul, jazz, and blues. It is a good first-or-last drink for the night casual.", { venueKind: "nightlife", nightlifeType: "dive_bar", musicGenres: ["alt_rock", "soul", "jazz", "blues"], price: "$", priceSource: "Official bar site", attributeTags: ["local_bar", "cheap_drinks", "casual_nightlife", "dj_sets"], hours: hours.barrett, officialUrl: "https://barrett-athens.gr/", sourcePhoto: images.barrett, editorialUrls: ["https://barrett-athens.gr/", "https://www.corner.inc/place/721451"] }),
  stop("athens-bar-au-revoir", "Au Revoir", [37.9991, 23.7331], "Au Revoir is the Kypseli classic, opened in 1957 and still trading on a time-capsule room rather than a trend cycle. It is a seated, old-Athens drink with enough patina to justify leaving the center.", { venueKind: "nightlife", nightlifeType: "dive_bar", musicGenres: ["background", "oldies"], price: "$$", priceSource: "Official Athens Guide / current hours source", attributeTags: ["local_bar", "historic", "low_key_nightlife", "casual_nightlife"], hours: hours.auRevoir, officialUrl: "https://m.facebook.com/AuRevoirBar/", sourcePhoto: images.city, editorialUrls: ["https://www.thisisathens.org/nightlife/au-revoir-bar", "https://triptap.com/places/gr/attica/athens/au-revoir-bar-t0120878"] }),
  stop("athens-bar-bios", "Bios", [37.9787, 23.7155], "Bios combines a bar with performance, exhibitions, screenings, and cultural programming, giving the evening more substance than another drink list.", { venueKind: "nightlife", nightlifeType: "live_music_venue", musicGenres: ["dj_sets", "live_music", "performance"], price: "$$", priceSource: "Official venue site / current hours source", attributeTags: ["live_music", "rooftop", "dj_sets", "casual_nightlife"], hours: hours.bios, officialUrl: "https://www.bios.gr/", sourcePhoto: images.kerameikos, editorialUrls: ["https://www.cybo.com/GR-biz/bios", "https://www.therooftopguide.com/rooftop-bars-in-athens/bios.html"] }),
  stop("athens-bar-brettos", "Brettos", [37.9726, 23.7294], "Brettos is tourist-visible Plaka, but the wall of colored bottles and distillery history make it more specific than the average old-center bar.", { venueKind: "nightlife", nightlifeType: "dive_bar", musicGenres: ["background"], price: "$$", priceSource: "Brettos editorial source / Google Maps", attributeTags: ["historic", "tourist_friendly", "casual_nightlife", "local_bar"], hours: hours.brettos, officialUrl: "https://www.brettosplaka.com/", sourcePhoto: images.brettos, editorialUrls: ["https://barsforkings.com/bars/athens/brettos-distillery/", "https://www.enprimeurclub.com/bars/brettos-athens-bar"] }),
  stop("athens-bar-couleur-locale", "Couleur Locale", [37.9768, 23.7241], "Couleur Locale is the practical Monastiraki rooftop when the group wants an Acropolis view without turning the evening into a luxury-hotel bill. Time it for sunset or an easy first drink and do not mistake the view for the whole night.", { venueKind: "nightlife", nightlifeType: "rooftop_bar", musicGenres: ["dj_sets", "background"], price: "$$", priceSource: "Official bar site / Google Maps", attributeTags: ["rooftop", "scenic_nightlife", "group_friendly", "casual_nightlife"], hours: hours.couleurLocale, officialUrl: "https://couleurlocaleathens.com/", sourcePhoto: images.athensNight, editorialUrls: ["https://www.timeout.com/athens/bars-and-pubs", maps("Couleur Locale Athens")] }),
  stop("athens-bar-taf", "TAF / The Art Foundation", [37.9772, 23.7251], "TAF combines a bar and contemporary art spaces around a hidden Monastiraki courtyard. Exhibitions, electronic and DJ programming, casual drinks, and a mobile crowd give the room more cultural substance than a standard rooftop bar.", { venueKind: "nightlife", nightlifeType: "other", musicGenres: ["dj_sets", "electronic", "background"], price: "$$", priceSource: "Official venue site / map listing", attributeTags: ["art_scene", "courtyard", "casual_nightlife", "dj_sets"], hours: hours.taf, officialUrl: "https://theartfoundation.metamatic.gr/", sourcePhoto: images.plaka, editorialUrls: ["https://www.timeout.com/athens/bars-and-pubs", maps("TAF The Art Foundation Athens")] }),
  stop("athens-bar-six-dogs", "six d.o.g.s", [37.9784, 23.7245], "six d.o.g.s combines a central garden bar, live gig space, and club programming under one name. Electronic music, indie shows, and DJ sets give different nights genuinely different identities.", { venueKind: "nightlife", nightlifeType: "live_music_venue", musicGenres: ["electronic", "indie", "live_music", "dj_sets"], price: "$$", priceSource: "Official venue site / event calendar", attributeTags: ["live_music", "dj_sets", "garden", "casual_nightlife"], hours: hours.sixDogs, officialUrl: "https://sixdogs.gr/", sourcePhoto: images.sixDogs, editorialUrls: ["https://www.timeout.com/athens/bars-and-pubs", "https://sixdogs.gr/"] }),
  stop("athens-bar-cantina-social", "Cantina Social", [37.9776, 23.7245], "Cantina Social is a small, loose Athens bar with simple drinks, DJs, alley energy, and a crowd that feels more local than scenic. Its appeal is deliberately unpolished and unrelated to rooftop views.", { venueKind: "nightlife", nightlifeType: "dive_bar", musicGenres: ["dj_sets", "electronic", "indie"], price: "$", priceSource: "Official social page / map listing", attributeTags: ["dive_bar", "cheap_drinks", "dj_sets", "local_bar"], hours: hours.cantinaSocial, officialUrl: "https://www.facebook.com/cantinasocial/", sourcePhoto: images.kerameikos, editorialUrls: ["https://www.timeout.com/athens/bars-and-pubs", maps("Cantina Social Athens")] }),
  stop("athens-bar-latraac", "Latraac", [37.9789, 23.7137], "Latraac combines a Kerameikos bar, skate bowl, courtyard, and event space, with DJ sets and live programming that connect the city's nightlife and independent art scenes.", { venueKind: "nightlife", nightlifeType: "live_music_venue", musicGenres: ["dj_sets", "electronic", "live_music"], price: "$$", priceSource: "Official venue site / event calendar", attributeTags: ["outdoor", "art_scene", "dj_sets", "casual_nightlife"], hours: hours.latraac, officialUrl: "https://www.latraac.com/", sourcePhoto: images.kerameikos, editorialUrls: ["https://www.timeout.com/athens/bars-and-pubs", "https://www.latraac.com/"] }),
  stop("athens-bar-heteroclito", "Heteroclito", [37.9758, 23.7297], "Heteroclito is a compact central wine bar focused on Greek bottles by the glass, conversation, and a low-key room distinct from Athens' cocktail and rooftop scene.", { venueKind: "nightlife", nightlifeType: "wine_bar", musicGenres: ["background"], price: "$$", priceSource: "Official wine-bar page / map listing", attributeTags: ["wine_bar", "low_key_nightlife", "date_night", "central"], hours: hours.heteroclito, officialUrl: "https://heteroclito.gr/", sourcePhoto: images.syntagma, editorialUrls: ["https://www.timeout.com/athens/bars-and-pubs", maps("Heteroclito Athens")] }),
];

const cocktailStops = [
  stop("athens-cocktail-baba-au-rum", "Baba Au Rum", [37.9778, 23.7298], "Baba Au Rum is the Athens cocktail address with the longest international shadow, a rum-first room that still feels like a bar rather than a trophy cabinet. Start with the classics or the rum list, and book or arrive early if your night cannot absorb a wait.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["lounge", "dj_sets"], price: "$$$", priceSource: "Official bar site / World's 50 Best Bars context", attributeTags: ["craft_cocktails", "reservation_recommended_nightlife", "premium_drinks", "date_night"], hours: hours.babaAuRum, officialUrl: "https://www.babaaurum.com/", sourcePhoto: images.athensNight, editorialUrls: ["https://www.babaaurum.com/contact/", "https://barsforkings.com/bars/athens/baba-au-rum/"] }),
  stop("athens-cocktail-clumsies", "The Clumsies", [37.9798, 23.7303], "The Clumsies is an all-day cocktail institution with a house-like interior, polished hosting, and serious drinks. Weekend demand makes reservations or deliberate timing worthwhile.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["lounge", "dj_sets"], price: "$$$", priceSource: "Official bar site / Google Maps", attributeTags: ["craft_cocktails", "premium_drinks", "reservation_recommended_nightlife", "date_night"], hours: hours.cocktailVariable, officialUrl: "https://www.theclumsies.gr/", sourcePhoto: images.athensNight, editorialUrls: ["https://www.theclumsies.gr/", "https://www.tripadvisor.com/Attraction_Review-g189400-d8020407-Reviews-The_Clumsies-Athens_Attica.html"] }),
  stop("athens-cocktail-line", "Line Athens", [37.9792, 23.7116], "Line is a fermentation-lab cocktail bar, where the point is house-made fruit wine, experimental ingredients, and a Kerameikos address away from the obvious Plaka loop.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["lounge", "dj_sets"], price: "$$$", priceSource: "Official bar site / current platform source", attributeTags: ["craft_cocktails", "natural_wine", "date_night", "reservation_recommended_nightlife"], hours: hours.cocktailVariable, officialUrl: "https://lineathens.gr/", sourcePhoto: images.line, editorialUrls: ["https://tablejourney.com/greece/athens/bars/line-athens/", "https://www.corner.inc/place/pTuVSCrNrT1t"] }),
  stop("athens-cocktail-barro-negro", "Barro Negro", [37.9778, 23.725], "Barro Negro is an agave-focused cocktail bar built around mezcal, tequila, sharper flavors, and a lively room. Its louder energy offers a clear alternative to Athens' polished hotel bars and high-concept fermentation menus.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["latin", "dj_sets"], price: "$$$", priceSource: "Athens cocktail editorial sources / Google Maps", attributeTags: ["craft_cocktails", "premium_drinks", "late_night", "lively_nightlife"], hours: hours.cocktailVariable, officialUrl: "https://www.instagram.com/barronegro_athens/", sourcePhoto: images.athensNight, editorialUrls: ["https://www.timeout.com/athens/bars-and-pubs", maps("Barro Negro Athens")] }),
  stop("athens-cocktail-bar-in-front", "The Bar in Front of the Bar", [37.9779, 23.729], "The Bar in Front of the Bar operates as a tiny street-facing cocktail counter with a concise menu and a pavement crowd. The playful format matters, but the drinks keep it from becoming only a naming joke.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["dj_sets", "street"], price: "$$", priceSource: "World's 50 Best Bars context / Google Maps", attributeTags: ["craft_cocktails", "lively_nightlife", "walk_in_friendly_nightlife", "late_night"], hours: hours.cocktailVariable, officialUrl: "https://www.instagram.com/thebarinfrontofthebar/", sourcePhoto: images.athensNight, editorialUrls: ["https://www.worlds50bestbars.com/", maps("The Bar in Front of the Bar Athens")] }),
  stop("athens-cocktail-42", "42 Barstronomy", [37.9765, 23.7302], "42 Barstronomy is the Syntagma cocktail room for a night that wants polished drinks without committing to the biggest-name rooms first. It adds food support, central convenience, and a more composed mood than the rowdier Psyrri bars.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["lounge", "background"], price: "$$$", priceSource: "Official page / map listing", attributeTags: ["craft_cocktails", "date_night", "central", "premium_drinks"], hours: hours.fortyTwo, officialUrl: "https://www.facebook.com/42barstronomy/", sourcePhoto: images.syntagma, editorialUrls: ["https://www.timeout.com/athens/bars-and-pubs", maps("42 Barstronomy Athens")] }),
  stop("athens-cocktail-a-for-athens", "A for Athens Cocktail Bar", [37.9762, 23.7258], "A for Athens is a rooftop cocktail bar whose primary attraction is the direct Acropolis view. Prices reflect the panorama, while the room has less personality than the city's strongest street-level bars.", { venueKind: "nightlife", nightlifeType: "rooftop_bar", musicGenres: ["lounge", "dj_sets"], price: "$$$", priceSource: "Official hotel/bar site / map listing", attributeTags: ["rooftop", "scenic_nightlife", "craft_cocktails", "date_night"], hours: hours.aForAthens, officialUrl: "https://aforathens.com/", sourcePhoto: images.aForAthens, editorialUrls: ["https://www.therooftopguide.com/rooftop-bars-in-athens/a-for-athens-cocktail-bar.html", maps("A for Athens Cocktail Bar")] }),
  stop("athens-cocktail-juan-rodriguez", "Juan Rodriguez Bar", [37.9788, 23.7258], "Juan Rodriguez is a theatrical, Latin-leaning cocktail room built for color, volume, and a full night rather than a quiet tasting exercise. It is more scene than sanctuary.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["latin", "dj_sets"], price: "$$", priceSource: "Official page / map listing", attributeTags: ["craft_cocktails", "lively_nightlife", "late_night", "group_friendly"], hours: hours.juanRodriguez, officialUrl: "https://juanrodriguez.gr/", sourcePhoto: images.plaka, editorialUrls: ["https://www.timeout.com/athens/bars-and-pubs", maps("Juan Rodriguez Bar Athens")] }),
  stop("athens-cocktail-cv-distiller", "CV Distiller", [37.9758, 23.7299], "CV Distiller is a spirits-first cocktail bar for drinkers who care about whisky, rum, and deep back-bar choices as much as shaken cocktails.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["lounge", "background"], price: "$$$", priceSource: "Official page / map listing", attributeTags: ["craft_cocktails", "premium_drinks", "spirits", "date_night"], hours: hours.cvDistiller, officialUrl: "https://www.facebook.com/CVdistiller/", sourcePhoto: images.syntagma, editorialUrls: ["https://www.timeout.com/athens/bars-and-pubs", maps("CV Distiller Athens")] }),
  stop("athens-cocktail-upupa", "Upupa Epops", [37.9751, 23.7107], "Upupa Epops serves cocktails and food in a handsome Petralona courtyard that moves easily from daylight coffee to a slower evening of drinks. The neighborhood setting offers atmosphere without the central Monastiraki crush.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["lounge", "dj_sets"], price: "$$", priceSource: "Official page / map listing", attributeTags: ["craft_cocktails", "courtyard", "date_night", "neighborhood_bar"], hours: hours.upupa, officialUrl: "https://upupaepops.gr/", sourcePhoto: images.philopappos, editorialUrls: ["https://www.timeout.com/athens/bars-and-pubs", maps("Upupa Epops Athens")] }),
];

const cultureStops = [
  stop("athens-culture-acropolis-museum", "Acropolis Museum", [37.9684, 23.7285], "The Acropolis Museum is the essential companion to the hill above it, with the Parthenon Gallery doing the interpretive work the site itself cannot.", { venueKind: "culture", subcategory: "museum", hours: hours.acropolisMuseum, officialUrl: "https://www.theacropolismuseum.gr/en/plan-your-visit", sourcePhoto: images.acropolisMuseum, editorialUrls: ["https://www.visitgreece.gr/experiences/culture/museums/acropolis-museum/", "https://www.athenstravelguides.com/posts/best-museums-in-athens/"] }),
  stop("athens-culture-national-archaeological", "National Archaeological Museum", [37.989, 23.7328], "The National Archaeological Museum is the bigger, deeper Athens museum, less conveniently placed than the Acropolis Museum and richer for Greece beyond one hill. Give it real time; a rushed hour turns major collections into trophy fatigue.", { venueKind: "culture", subcategory: "museum", hours: hours.nationalArchaeological, officialUrl: "https://www.namuseum.gr/en/", sourcePhoto: images.museum, editorialUrls: ["https://archaeologicalmuseums.culture.gov.gr/en/museum/5df34af3deca5e2d79e8c150", "https://www.athenstravelguides.com/posts/best-museums-in-athens/"] }),
  stop("athens-culture-benaki", "Benaki Museum of Greek Culture", [37.9766, 23.7415], "Benaki is the museum that helps Athens escape the ancient-only trap, moving from prehistoric and Byzantine material into modern Greece inside a neoclassical house. It is a smart Kolonaki pairing with Cycladic Art or KORA, especially on Thursday's late opening.", { venueKind: "culture", subcategory: "museum", hours: hours.benaki, officialUrl: "https://www.benaki.org/index.php?id=11&lang=en&option=com_buildings&view=building", sourcePhoto: images.benaki, editorialUrls: ["https://www.athenstravelguides.com/posts/best-museums-in-athens/", "https://www.thisisathens.org/culture/museums"] }),
  stop("athens-culture-cycladic", "Museum of Cycladic Art", [37.9762, 23.7418], "The Museum of Cycladic Art is a compact, elegant museum for marble figures, Aegean forms, and a calmer museum rhythm near Kolonaki.", { venueKind: "culture", subcategory: "museum", hours: hours.museum, officialUrl: "https://cycladic.gr/en/", sourcePhoto: images.cycladic, editorialUrls: ["https://www.athenstravelguides.com/posts/best-museums-in-athens/", "https://www.thisisathens.org/culture/museums"] }),
  stop("athens-culture-national-gallery", "National Gallery - Alexandros Soutsos Museum", [37.9759, 23.7495], "The National Gallery gives the city a modern Greek art spine, useful when Athens has started to feel like marble, ruins, and rooftop views only. Check the exhibition calendar and pair it with Cookoovaya or the Ilisia side so it does not become an orphaned taxi stop.", { venueKind: "culture", subcategory: "museum", hours: hours.museum, officialUrl: "https://www.nationalgallery.gr/en/", sourcePhoto: images.nationalGallery, editorialUrls: ["https://www.thisisathens.org/culture/museums", "https://www.athenstravelguides.com/posts/best-museums-in-athens/"] }),
  stop("athens-culture-emst", "EMST - National Museum of Contemporary Art", [37.9602, 23.7203], "The old Fix brewery building gives the museum an urban edge, and the exhibition calendar decides how much time it deserves.", { venueKind: "culture", subcategory: "museum", hours: hours.emst, officialUrl: "https://www.emst.gr/en/", sourcePhoto: images.emst, editorialUrls: ["https://www.emst.gr/en/", "https://www.thisisathens.org/culture/museums"] }),
  stop("athens-culture-byzantine", "Byzantine and Christian Museum", [37.9758, 23.7445], "The Byzantine and Christian Museum fills the long gap between classical Athens and the modern city, with icons, manuscripts, textiles, and religious art in a quieter Ilisia setting. It is the right museum for depth without the crowds of the Acropolis corridor.", { venueKind: "culture", subcategory: "museum", hours: hours.byzantineMuseum, officialUrl: "https://www.byzantinemuseum.gr/en/", sourcePhoto: images.byzantineMuseum, editorialUrls: ["https://www.thisisathens.org/culture/museums", "https://www.athenstravelguides.com/posts/best-museums-in-athens/"] }),
  stop("athens-culture-goulandris", "Basil & Elise Goulandris Foundation", [37.9687, 23.7431], "The collection moves from European modern masters into Greek work, so it gives Athens an art-world vocabulary beyond archaeology.", { venueKind: "culture", subcategory: "museum", hours: hours.goulandris, officialUrl: "https://goulandris.gr/en/", sourcePhoto: images.goulandris, editorialUrls: ["https://goulandris.gr/en/", "https://www.thisisathens.org/culture/museums"] }),
  stop("athens-culture-numismatic", "Numismatic Museum", [37.9783, 23.7356], "The Numismatic Museum is small but specific: coins, money, and the Iliou Melathron mansion, once Heinrich Schliemann's house.", { venueKind: "culture", subcategory: "museum", hours: hours.numismatic, officialUrl: "https://www.nummus.gr/en/", sourcePhoto: images.numismatic, editorialUrls: ["https://www.thisisathens.org/culture/museums", maps("Numismatic Museum Athens")] }),
  stop("athens-culture-kotsanas", "Kotsanas Museum of Ancient Greek Technology", [37.9782, 23.7358], "Kotsanas makes ancient Greek engineering legible through working models, which is useful for travelers who glaze over at another case of pottery. It is compact, central, and especially good when the group includes curious non-museum people.", { venueKind: "culture", subcategory: "museum", hours: hours.kotsanas, officialUrl: "https://kotsanas.com/", sourcePhoto: images.syntagma, editorialUrls: ["https://kotsanas.com/", "https://www.thisisathens.org/culture/museums"] }),
];

const activityStops = [
  stop("athens-activity-acropolis", "Acropolis of Athens", [37.9715, 23.7257], "The Acropolis rises above Athens with the Parthenon, Erechtheion, Propylaea, and a city organized around the rock. Timed entry and cooler early or late hours make the archaeological visit more legible and humane.", { venueKind: "landmark", subcategory: "archaeological_site", hours: hours.acropolis, officialUrl: "https://hhticket.gr/", sourcePhoto: images.acropolis, editorialUrls: ["https://www.timeout.com/athens/things-to-do/best-things-to-do-in-athens", "https://www.lonelyplanet.com/articles/top-things-to-do-in-athens"] }),
  stop("athens-activity-acropolis-museum", "Acropolis Museum", [37.9684, 23.7285], "The Acropolis Museum presents sculpture and archaeological finds from the hill in a modern, air-conditioned building above visible excavations. The top-floor Parthenon Gallery aligns the surviving frieze with the temple itself and deserves more than a hurried pass.", { venueKind: "culture", subcategory: "museum", hours: hours.acropolisMuseum, officialUrl: "https://www.theacropolismuseum.gr/en/plan-your-visit", sourcePhoto: images.acropolisMuseum, editorialUrls: ["https://www.visitgreece.gr/experiences/culture/museums/acropolis-museum/", "https://www.athenstravelguides.com/posts/best-museums-in-athens/"] }),
  stop("athens-activity-ancient-agora", "Ancient Agora of Athens", [37.975, 23.7225], "The Ancient Agora turns democracy, commerce, temples, and daily city life into walkable geography below the Acropolis. It is a better second archaeological archaeological site than another distant ruin because the Temple of Hephaestus, Stoa of Attalos, and shaded paths keep the story legible.", { venueKind: "culture", subcategory: "archaeological_site", hours: hours.ancientAgora, officialUrl: "https://hhticket.gr/", sourcePhoto: images.ancientAgora, editorialUrls: ["https://etickets.tap.gr/webengines/images/places/000000004/arxaia_agora_en.pdf", "https://www.timeout.com/athens/things-to-do/best-things-to-do-in-athens"] }),
  stop("athens-activity-plaka-anafiotika", "Plaka and Anafiotika", [37.9728, 23.7307], "Plaka and Anafiotika can be touristy and still necessary, because the lanes below the Acropolis explain Athens at walking speed.", { venueKind: "landmark", subcategory: "historic_district", hours: hours.plaka, officialUrl: "https://www.thisisathens.org/", sourcePhoto: images.plaka, editorialUrls: ["https://www.lonelyplanet.com/articles/top-things-to-do-in-athens", maps("Anafiotika Plaka Athens")] }),
  stop("athens-activity-varvakios-market", "Varvakios Central Municipal Market", [37.9802, 23.7262], "Varvakios Market is the food-city reset: meat halls, fish counters, spice streets, and Evripidou delis pulling Athens out of postcard mode. Go in the morning, keep the visit observational and respectful, then eat nearby instead of wandering into the first tourist menu.", { venueKind: "retail", subcategory: "market", hours: hours.market, officialUrl: "https://www.thisisathens.org/", sourcePhoto: images.market, editorialUrls: ["https://www.thisisathens.org/sites/default/files/2021-09/24-budget-eat.pdf", maps("Varvakios Central Municipal Market Athens")] }),
  stop("athens-activity-national-garden", "National Garden", [37.9738, 23.7367], "The National Garden is the necessary shade break between Syntagma, Zappeion, and the stadium. Its value is cooling the route down when Athens heat starts making every plan feel worse, especially between museum blocks and late lunch.", { venueKind: "outdoors", subcategory: "garden", hours: hours.garden, officialUrl: "https://www.cityofathens.gr/", sourcePhoto: images.nationalGarden, editorialUrls: ["https://www.timeout.com/athens/things-to-do/best-things-to-do-in-athens", maps("National Garden Athens")] }),
  stop("athens-activity-lycabettus", "Lycabettus Hill", [37.9818, 23.7437], "Lycabettus is the cleanest citywide view, especially when the Acropolis has started to feel too close to understand. Walk if the weather is kind, use the funicular if it is not, and time sunset with patience.", { venueKind: "outdoors", subcategory: "viewpoint", hours: hours.lycabettus, officialUrl: "https://www.thisisathens.org/", sourcePhoto: images.lycabettus, editorialUrls: ["https://www.lonelyplanet.com/articles/top-things-to-do-in-athens", maps("Lycabettus Hill Athens")] }),
  stop("athens-activity-panathenaic", "Panathenaic Stadium", [37.9683, 23.7411], "The Panathenaic Stadium is one of the rare tourist stops that is both fast and memorable: marble, Olympic revival history, and a geometry you feel immediately. Pair it with the National Garden or Spondi rather than making a cross-town detour just for a photo.", { venueKind: "landmark", subcategory: "stadium", hours: hours.panathenaic, officialUrl: "https://www.panathenaicstadium.gr/", sourcePhoto: images.panathenaic, editorialUrls: ["https://www.timeout.com/athens/things-to-do/best-things-to-do-in-athens", maps("Panathenaic Stadium Athens")] }),
  stop("athens-activity-snfcc", "Stavros Niarchos Foundation Cultural Center", [37.9405, 23.6915], "SNFCC brings Renzo Piano architecture, parkland, canals, the National Library, and the Greek National Opera together on Athens' southern waterfront. Concerts, opera, talks, and outdoor events change the experience, so the official calendar is essential.", { venueKind: "culture", subcategory: "cultural_center", hours: hours.snfcc, officialUrl: "https://www.snfcc.org/en", sourcePhoto: images.snfcc, editorialUrls: ["https://athensglance.com/2019/09/14/stavros-niarchos-foundation/", "https://myartguides.com/artspaces/non-profit/athens/the-stavros-niarchos-foundation-cultural-center/"] }),
  stop("athens-activity-philopappos", "Philopappos Hill", [37.9672, 23.7214], "Philopappos Hill gives the Acropolis a better silhouette than standing under it, with paths, pines, and a view that makes the city breathe.", { venueKind: "outdoors", subcategory: "viewpoint", hours: hours.philopappos, officialUrl: "https://www.thisisathens.org/", sourcePhoto: images.philopappos, editorialUrls: ["https://www.lonelyplanet.com/articles/top-things-to-do-in-athens", maps("Philopappos Hill Athens")] }),
];

function guide(category: ListCategory, id: string, slug: string, seoSlug: string, title: string, description: string, stops: GuideStop[], guideSources: ListSource[], seoTitle: string, seoDescription: string): MapList {
  return {
    id,
    slug,
    seoSlug,
    seoTitle,
    seoDescription,
    title,
    description,
    url: maps(`${title} Athens Greece`),
    category,
    location: athensLocation,
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

export const athensCitywideGuides: MapList[] = [
  guide("Food", "list-athens-citywide-dining", "athens-best-restaurants-citywide", "best-restaurants", "Restaurants With a Real Point of View", "A citywide Athens dining guide that separates Michelin-formal rooms, Piraeus seafood, central Bib Gourmand energy, ingredient-led Greek cooking, and market-side meze.", diningStops, sources.dining, "Best Restaurants in Athens for Greek Dining, Seafood, and Tasting Menus", "Source-backed Athens restaurant guide covering Spondi, Varoulko, Nolan, Cookoovaya, and Karamanlidika."),
  guide("Food", "list-athens-medium-cheap-eats", "athens-best-cheap-eats-medium-budget", "best-cheap-eats", "Cheap and Medium Eats That Carry the Day", "A practical Athens value guide for cheese-shop lunches, serious bakery mornings, market meze, casual seafood, and tiny souvlaki counters.", cheapEatStops, sources.cheapEats, "Best Cheap Eats in Athens for Bakeries, Souvlaki, Meze, and Seafood", "Budget and medium-price Athens food stops with official pages, map evidence, and current source support."),
  guide("Stay", "list-athens-citywide-hotels", "athens-best-hotels-citywide", "best-hotels", "Hotels With a Clear Athens Base Strategy", "This hotel-only Athens stay guide compares Syntagma landmark service, Plaka-view glamour, design-hotel centrality, Acropolis promenade convenience, and Psyrri creative energy.", hotelStops, sources.hotels, "Best Hotels in Athens for Syntagma, Plaka, Acropolis, and Psyrri", "Hotel-only Athens stay guide with official booking links, check-in evidence, and neighborhood tradeoffs."),
  guide("Stay", "list-athens-citywide-hostels", "athens-best-hostels-citywide", "best-hostels", "Hostels for Social Beds and Central Routes", "A hostel-only Athens guide for backpackers choosing between Psyrri social energy, central glostel polish, Exarchia character, budget party scale, and Acropolis-side logistics.", hostelStops, sources.hostels, "Best Hostels in Athens for Dorms, Private Rooms, Solo Travel, and Budget Bases", "Hostel-only Athens guide with dorm/private-room evidence, booking links, and arrival-hour caveats."),
  guide("Nightlife", "list-athens-casual-bars", "athens-best-casual-bars", "best-bars", "Casual Bars, Rooftops, and Late Rooms", "Casual Athens nightlife runs through old bars, art spaces, Psyrri late rooms, music, and Acropolis views with enough flexibility to avoid making every drink a reservation.", casualBarStops, sources.casualBars, "Best Casual Bars in Athens for Rooftops, Old Bars, Music, and Late Drinks", "Athens casual bar guide with official pages, current hours, map evidence, and nightlife-source support."),
  guide("Nightlife", "list-athens-cocktail-bars", "athens-best-cocktail-bars", "best-cocktail-bars", "Cocktail Rooms Worth Planning Around", "Athens cocktails across rum classics, all-day institutions, fermentation experiments, agave rooms, rooftops, and fast-format modern bars. Drinks, hosting, room character, and reservation pressure define the selection.", cocktailStops, sources.cocktails, "Best Cocktail Bars in Athens for Baba Au Rum, The Clumsies, Line, and More", "Source-backed Athens cocktail guide with official pages, map evidence, current-status caveats, and editorial support."),
  guide("Culture", "list-athens-citywide-culture", "athens-best-culture-citywide", "best-culture", "Culture Beyond One Marble Hill", "Athens culture extends from the Acropolis Museum and National Archaeological Museum to modern Greek history, Cycladic form, technology, and contemporary art.", cultureStops, sources.culture, "Best Culture in Athens for Museums, Greek Art, and Ancient Context", "Athens culture guide with official museum hours, map evidence, and source-backed practical caveats."),
  guide("Activities", "list-athens-top-things-to-do", "athens-best-things-to-do-citywide", "best-things-to-do", "The Strong Athens First-Timer Route", "A 10-stop Athens things-to-do guide that paces the Acropolis with museums, Agora context, food-market texture, shade breaks, viewpoints, stadium history, and the modern SNFCC edge.", activityStops, sources.activities, "Best Things to Do in Athens for Acropolis, Museums, Markets, Views, and Parks", "Top things to do in Athens with official ticketing, hours caveats, map evidence, and route-useful planning notes."),
];
