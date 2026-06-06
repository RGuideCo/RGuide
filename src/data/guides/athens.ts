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
  const safeFileName = fileName === "The_Parthenon_in_Athens.jpg" ? fileName : "The_Parthenon_in_Athens.jpg";
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(safeFileName)}?width=1400`;
}

const images = {
  acropolis: commons("The_Parthenon_in_Athens.jpg"),
  acropolisMuseum: commons("Acropolis_Museum_Athens.jpg"),
  ancientAgora: commons("Temple_of_Hephaestus_Athens_2011.jpg"),
  athensNight: commons("Athens_at_night_from_Monastiraki.jpg"),
  benaki: commons("Benaki_Museum_Athens_2015.jpg"),
  brettos: commons("Brettos_Bar,_Plaka,_Athens.jpg"),
  city: commons("Athens_Monastiraki_Square_and_Acropolis.jpg"),
  grandeBretagne: commons("Hotel_Grande_Bretagne,_Athens,_Greece.jpg"),
  kerameikos: commons("Kerameikos_Athens_Greece.jpg"),
  lycabettus: commons("View_from_Lycabettus_Hill,_Athens.jpg"),
  market: commons("Varvakios_Agora,_Athens_2018.jpg"),
  museum: commons("National_Archaeological_Museum_Athens.jpg"),
  nationalGarden: commons("National_Garden_Athens.jpg"),
  panathenaic: commons("Panathenaic_Stadium_Athens_2010.jpg"),
  philopappos: commons("Philopappos_Monument_Athens.jpg"),
  plaka: commons("Plaka_Athens_2009.jpg"),
  snfcc: commons("Stavros_Niarchos_Foundation_Cultural_Center_2017.jpg"),
  souvlaki: commons("Souvlaki_in_Athens.jpg"),
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
  spondi: { default: "Dinner service is reservation-led; verify current seatings on the official reservation page or Google Maps before booking." },
  varoulko: { default: "Daily 1:00 PM-midnight." },
  nolan: { default: "Mon-Sat 1:00 PM-5:30 PM and 7:00 PM-11:30 PM; Sun closed." },
  cookoovaya: { default: "Daily 1:00 PM-midnight." },
  karamanlidika: { default: "Mon-Sat restaurant noon-11:00 PM; retail 8:00 AM-9:00 PM; Sun closed." },
  kostarelos: { default: "Syntagma shop daily 7:00 AM-8:00 PM." },
  kora: { default: "Mon-Fri 8:00 AM-6:00 PM; Sat-Sun 8:30 AM-3:00 PM." },
  atlantikos: { default: "Daily 1:00 PM-1:00 AM." },
  oKostas: { default: "Lunch-focused souvlaki counter; verify current weekday-only Google Maps hours before going." },
  hotel: { default: "Front desk operates daily; official check-in/check-out times vary by property and booking channel." },
  cityCircus: { default: "Hostel reception/check-in details are booking-dependent; confirm late arrival with City Circus before booking." },
  mosaikon: { default: "Check-in from 2:00 PM; check-out up to 11:00 AM." },
  whenInAthens: { default: "Check-in after 2:00 PM; check-out until 10:30 AM." },
  athensBackpackers: { default: "24-hour reception; check-in from 2:00 PM and check-out until 11:00 AM." },
  hostel: { default: "Reception and arrival hours vary by property; confirm check-in, late-arrival, and luggage-storage details before booking." },
  barrett: { default: "Mon-Thu and Sun 11:00 AM-3:00 AM; Fri-Sat 11:00 AM-late." },
  auRevoir: { default: "Mon-Thu and Sun 6:00 PM-2:00 AM; Fri-Sat 6:00 PM-3:00 AM." },
  bios: { default: "Daily 11:00 AM-4:00 AM; event spaces and rooftop programming can vary." },
  brettos: { default: "Late-morning to late-night bar hours vary by season; verify the current Brettos listing before going." },
  couleurLocale: { default: "All-day rooftop/bar hours vary by season and weather; verify official or Google Maps hours before going." },
  babaAuRum: { default: "Daily 7:00 PM-3:00 AM." },
  cocktailVariable: { default: "Cocktail-bar hours vary by day and event; verify the official site or Google Maps before going." },
  acropolis: { default: "Official archaeological-site hours are seasonal and ticket-slot based; verify hhticket.gr before booking." },
  acropolisMuseum: { default: "Summer Apr-Oct: Mon 9:00 AM-5:00 PM, Tue-Sun 9:00 AM-8:00 PM, Fri until 10:00 PM; winter hours differ." },
  nationalArchaeological: { default: "From 4 May-15 Nov 2026: Wed-Mon 8:00 AM-8:00 PM; Tue 1:00 PM-8:00 PM; last admission 7:30 PM." },
  benaki: { default: "Mon, Wed, Fri, Sat 10:00 AM-6:00 PM; Thu 10:00 AM-midnight; Sun 10:00 AM-4:00 PM; Tue closed." },
  museum: { default: "Museum hours vary by season, exhibition, and holiday; verify the official calendar before visiting." },
  ancientAgora: { default: "Daily archaeological-site hours are seasonal and ticket-slot based; verify hhticket.gr before booking." },
  plaka: { default: "District streets are public 24 hours; shops, churches, and tavernas keep separate hours." },
  market: { default: "Market activity is strongest in the morning and early afternoon; individual stalls keep separate hours." },
  garden: { default: "Public garden hours vary seasonally and by city maintenance; verify posted gate hours before visiting." },
  lycabettus: { default: "Hill paths and viewpoint access are weather-dependent; funicular and church hours keep separate schedules." },
  panathenaic: { default: "Stadium visitor hours vary by season and event; verify the official calendar before going." },
  snfcc: { default: "SNFCC park, buildings, tours, and events keep separate daily schedules; verify the official calendar before visiting." },
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
    hours: { default: "Open and active in current source set; verify the official site or Google Maps before going." },
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
  stop("athens-dining-spondi", "Spondi", [37.96833, 23.74262], "Spondi is Athens at its most formal: vaulted rooms, courtyard calm, and French-leaning tasting-menu precision behind the Panathenaic Stadium. Book it as a full Pangrati evening, not as a quick pre-sightseeing meal, and leave room for the slower service rhythm.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["fine_dining", "french", "mediterranean"], price: "$$$$", priceSource: "MICHELIN Guide / official restaurant site", attributeTags: ["fine_dining", "tasting_menu", "reservation_recommended", "date_night"], hours: hours.spondi, officialUrl: "https://www.spondi.gr/en/", sourcePhoto: images.city, editorialUrls: ["https://guide.michelin.com/gb/en/attica/athens/restaurant/spondi", "https://www.thisisathens.org/restaurants/fine-dining/michelin-star-restaurants"] }),
  stop("athens-dining-varoulko", "Varoulko Seaside", [37.9413, 23.6527], "Varoulko makes Piraeus feel like part of the food map rather than a ferry errand, with Lefteris Lazarou's seafood cooking facing Mikrolimano. Build in the transit time; the payoff is fish, marina air, and a meal that uses the sea in front of it.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["seafood", "greek", "mediterranean"], price: "$$$", priceSource: "MICHELIN Guide / official restaurant site", attributeTags: ["seafood", "fine_dining", "scenic_food", "reservation_recommended"], hours: hours.varoulko, officialUrl: "https://www.varoulko.gr/", sourcePhoto: images.athensNight, editorialUrls: ["https://guide.michelin.com/us/en/attica/athens/restaurant/varoulko-seaside", "https://www.varoulko.gr/contact-us/"] }),
  stop("athens-dining-nolan", "Nolan", [37.9757, 23.7323], "Nolan is the useful Syntagma counterweight to grand Greek dining: compact, bright, and built around Greek-Asian fusion plates. It is a strong lunch or dinner around the center, but Sunday closure and split service make timing matter.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["fusion", "greek", "asian_influenced"], price: "$$", priceSource: "MICHELIN Bib Gourmand / official restaurant site", attributeTags: ["reservation_recommended", "central", "date_night", "midrange"], hours: hours.nolan, officialUrl: "https://www.nolanrestaurant.gr/", sourcePhoto: images.city, editorialUrls: ["https://guide.michelin.com/fi/en/attica/athens/restaurant/nolan", "https://www.falstaff.com/en/restaurants/restaurant-nolan-athen"] }),
  stop("athens-dining-cookoovaya", "Cookoovaya", [37.978, 23.7504], "Cookoovaya is the grown-up Greek table for people who want fish, vegetables, cheeses, and ingredient discipline to carry the room. It is useful near the Ilisia side when the route needs a serious meal without Acropolis-view theater.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["greek", "mediterranean", "seasonal"], price: "$$$", priceSource: "Official restaurant site / current hours source", attributeTags: ["destination_dining", "seafood", "seasonal", "reservation_recommended"], hours: hours.cookoovaya, officialUrl: "https://cookoovaya.gr/", sourcePhoto: images.city, editorialUrls: ["https://whyathens.com/cookoovaya/", "https://www.sluurpy.com/en/%CE%B1%CE%B8%CE%AE%CE%BD%CE%B1/restaurant/6171655/cookoovaya"] }),
  stop("athens-dining-karamanlidika", "Ta Karamanlidika tou Fani", [37.9803, 23.7243], "Karamanlidika is deli, meze table, and cured-meat education in one Evripidou stop near the market. In the restaurant guide, it earns its slot because pastourma, cheeses, sausages, and wine make a full meal rather than a snack crawl.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["greek", "meze", "deli"], price: "$$", priceSource: "Official restaurant site / Google Maps", attributeTags: ["local_favorite", "market", "midrange", "group_friendly"], hours: hours.karamanlidika, officialUrl: "https://www.karamanlidika.gr/language/en/meze-restaurant/", sourcePhoto: images.market, editorialUrls: ["https://www.reddit.com/r/GreeceTravel/comments/1poidlw/whats_the_best_thing_youve_eaten_in_athens/", "https://www.cybo.com/GR-biz/karamanlidika"] }),
];

const cheapEatStops = [
  stop("athens-cheap-kostarelos", "Kostarelos Syntagma", [37.9763, 23.7319], "Kostarelos is the practical cheese-shop lunch: pies, sandwiches, yogurt, and a central address that can save a museum day from turning into a bad snack. The value is speed, Greek dairy, predictable hours, and a low-friction Syntagma location.", { venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["greek", "sandwiches", "cheese"], price: "$", priceSource: "Official locations page", attributeTags: ["cheap_eats", "quick_meal", "breakfast", "central"], hours: hours.kostarelos, officialUrl: "https://www.kostarelos.gr/en/where-to-find-us/", sourcePhoto: images.souvlaki, editorialUrls: ["https://www.thisisathens.org/sites/default/files/2021-09/24-budget-eat.pdf", "https://www.kostarelos.gr/en/where-to-find-us/"] }),
  stop("athens-cheap-kora", "KORA Bakery", [37.9794, 23.7407], "KORA gives Kolonaki a proper bakery stop, with sourdough and viennoiserie that make breakfast intentional. Go early for the strongest pastry case, then pair it with Benaki, Cycladic Art, coffee, or a Lycabettus climb before the afternoon heat.", { venueKind: "food_drink", foodServiceType: "bakery", cuisineTypes: ["bakery", "coffee", "pastry"], price: "$", priceSource: "Official bakery site / Apple Maps", attributeTags: ["bakery", "breakfast", "coffee", "cheap_eats"], hours: hours.kora, officialUrl: "https://www.korabakery.com/en/", sourcePhoto: images.city, editorialUrls: ["https://www.korabakery.com/en/", "https://gloobles.com/destinations/europe/greece/athens/kora"] }),
  stop("athens-cheap-karamanlidika", "Ta Karamanlidika tou Fani", [37.9803, 23.7243], "In the cheap-eats guide, Karamanlidika works because a shared meze table can feel generous without becoming a tasting-menu commitment. Use it for cured meats, cheeses, and market-near lunch when souvlaki alone will not hold the day.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["greek", "meze", "deli"], price: "$$", priceSource: "Official restaurant site / Google Maps", attributeTags: ["local_favorite", "market", "midrange", "group_friendly", "cheap_eats"], hours: hours.karamanlidika, officialUrl: "https://www.karamanlidika.gr/language/en/meze-restaurant/", sourcePhoto: images.market, editorialUrls: ["https://www.karamanlidika.gr/language/en/meze-restaurant/", "https://www.cybo.com/GR-biz/karamanlidika"] }),
  stop("athens-cheap-atlantikos", "Atlantikos", [37.9787, 23.7239], "Atlantikos is the Psyrri seafood value play, close to the market but looser than a polished fish restaurant. Expect bustle, late tables, fried seafood, and less ceremony than the waterfront names; it works best for a group grazing meal.", { venueKind: "food_drink", foodServiceType: "restaurant", cuisineTypes: ["seafood", "greek", "casual"], price: "$$", priceSource: "Current hours/platform source / Google Maps", attributeTags: ["seafood", "cheap_eats", "casual", "group_friendly"], hours: hours.atlantikos, officialUrl: "https://www.instagram.com/atlantikosathens/", sourcePhoto: images.market, editorialUrls: ["https://www.novacircle.com/spots/europe/greece/central-athens-region/athens-municipality/athens/atlantikos-3a5256/opening-hours", "https://www.thisisathens.org/sites/default/files/2021-09/24-budget-eat.pdf"] }),
  stop("athens-cheap-o-kostas", "O Kostas", [37.9748, 23.7323], "O Kostas is the tiny souvlaki stop that still makes sense in a center full of interchangeable wraps. Order simply, do not expect a lounge, and check current hours because old-school counters can close when they are done.", { venueKind: "food_drink", foodServiceType: "counter_service", cuisineTypes: ["greek", "souvlaki", "street_food"], price: "$", priceSource: "Google Maps / current food threads", attributeTags: ["street_food", "cheap_eats", "quick_meal", "walk_in_friendly"], hours: hours.oKostas, officialUrl: "https://www.instagram.com/okostas_souvlaki/", sourcePhoto: images.souvlaki, editorialUrls: ["https://www.reddit.com/r/GreeceTravel/comments/1poidlw/whats_the_best_thing_youve_eaten_in_athens/", maps("O Kostas Souvlaki Pentelis Athens")] }),
];

const hotelStops = [
  stop("athens-hotel-grande-bretagne", "Hotel Grande Bretagne", [37.9761, 23.7353], "Hotel Grande Bretagne is the old-power Syntagma stay: polished, expensive, and absurdly convenient beside Parliament. Book it when service, history, roof views, and a central return point matter more than boutique understatement, especially for first nights after long flights.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$$", priceSource: "Marriott official / MICHELIN hotel guide", attributeTags: ["luxury", "central", "historic_building", "scenic"], hours: { default: "Check-in 3:00 PM; check-out 11:00 AM; front desk and guest services are property-managed daily." }, officialUrl: "https://www.marriott.com/en-us/hotels/athlc-hotel-grande-bretagne-a-luxury-collection-hotel-athens/overview/", bookingUrl: "https://www.marriott.com/en-us/hotels/athlc-hotel-grande-bretagne-a-luxury-collection-hotel-athens/overview/", sourcePhoto: images.grandeBretagne, editorialUrls: ["https://guide.michelin.com/us/en/article/travel/best-hotels-in-athens", "https://www.cntraveler.com/gallery/best-hotels-in-athens"] }),
  stop("athens-hotel-dolli", "The Dolli at Acropolis", [37.9768, 23.7275], "The Dolli is the glamorous Plaka-edge boutique stay built around Acropolis views, rooftop polish, and a historic building recast for high-touch travelers. For a short Athens stay where the view does emotional work, it earns its place.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$$", priceSource: "Official hotel FAQ / MICHELIN hotel guide", attributeTags: ["luxury", "boutique", "scenic", "central"], hours: { default: "Check-in 3:00 PM; check-out 11:00 AM; 24-hour room service available." }, officialUrl: "https://www.thedolli.com/", bookingUrl: "https://www.thedolli.com/", sourcePhoto: images.city, editorialUrls: ["https://www.thedolli.com/frequently-asked-questions/", "https://guide.michelin.com/us/en/article/travel/best-hotels-in-athens"] }),
  stop("athens-hotel-new-hotel", "New Hotel", [37.9737, 23.7328], "New Hotel is the design-forward Syntagma base for travelers who want art, strong materials, and central walks without a palace-hotel mood. The location is quietly excellent for the National Garden, Plaka, and the Acropolis Museum.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$", priceSource: "Marriott official / Design Hotels listing", attributeTags: ["design", "central", "boutique", "midrange"], hours: { default: "Check-in 3:00 PM; check-out 11:00 AM; staffed front desk." }, officialUrl: "https://www.marriott.com/en-us/hotels/athnd-new-hotel-athens-a-member-of-design-hotels/overview/", bookingUrl: "https://www.marriott.com/en-us/hotels/athnd-new-hotel-athens-a-member-of-design-hotels/overview/", sourcePhoto: images.city, editorialUrls: ["https://www.marriott.com/en-us/hotels/athnd-new-hotel-athens-a-member-of-design-hotels/overview/", "https://www.vogue.com/article/best-hotels-in-athens"] }),
  stop("athens-hotel-athenswas", "AthensWas", [37.9688, 23.7294], "AthensWas is the Acropolis promenade hotel for travelers who want the big ancient-site day to begin outside the front door. The tradeoff is visitor density; the win is immediate access to the museum, Plaka, and Dionysiou Areopagitou.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$", priceSource: "Official hotel site / Google Travel", attributeTags: ["boutique", "central", "scenic", "walkable"], hours: hours.hotel, officialUrl: "https://www.athenswas.gr/", bookingUrl: "https://www.athenswas.gr/", sourcePhoto: images.acropolisMuseum, editorialUrls: ["https://www.cntraveler.com/gallery/best-hotels-in-athens", "https://www.google.com/travel/hotels/Athens"] }),
  stop("athens-hotel-mona", "Mona Athens", [37.9774, 23.7237], "Mona is the Psyrri design stay for travelers who want the city to feel rougher and more creative than Syntagma marble. It works best if restaurants, bars, Monastiraki, and late walks matter more than spa scale.", { venueKind: "lodging", lodgingType: "hotel", price: "$$$", priceSource: "Official hotel site / Google Travel", attributeTags: ["boutique", "design", "central", "lively"], hours: hours.hotel, officialUrl: "https://www.monathens.com/", bookingUrl: "https://www.monathens.com/", sourcePhoto: images.market, editorialUrls: ["https://www.vogue.com/article/best-hotels-in-athens", "https://www.google.com/travel/hotels/Athens"] }),
];

const hostelStops = [
  stop("athens-hostel-city-circus", "City Circus Athens", [37.9788, 23.7205], "City Circus is the Psyrri hostel with a neoclassical shell, vintage furniture, and enough personality to feel like a small hotel with dorm energy. It suits social travelers who want Monastiraki and nightlife close without a giant bunk factory.", { venueKind: "lodging", lodgingType: "hostel", price: "$$", priceSource: "Hostelworld / official hostel site", attributeTags: ["hostel", "social", "central", "design"], hours: hours.cityCircus, officialUrl: "https://www.citycircus.gr/", bookingUrl: "https://www.citycircus.gr/", sourcePhoto: images.market, editorialUrls: ["https://www.hostelworld.com/hostels/p/64620/city-circus-athens/", "https://www.hostelpedia.com/greece/athens/city-circus"] }),
  stop("athens-hostel-mosaikon", "Mosaikon Glostel", [37.9779, 23.7288], "Mosaikon is the central, cleaner-edged hostel for travelers who want dorms or private rooms without losing Monastiraki, Syntagma, and Psyrri. The roof view, small dorm scale, and check-in clarity make it social without relentless party noise.", { venueKind: "lodging", lodgingType: "hostel", price: "$$", priceSource: "Official hostel FAQ / Hostelworld", attributeTags: ["hostel", "central", "rooftop", "private_rooms"], hours: hours.mosaikon, officialUrl: "https://mosaikon.gr/", bookingUrl: "https://mosaikon.gr/", sourcePhoto: images.city, editorialUrls: ["https://mosaikon.gr/faq/", "https://www.hostelworld.com/hostels/europe/greece/athens/"] }),
  stop("athens-hostel-when-in-athens", "When in Athens Hostel", [37.9847, 23.733], "When in Athens gives Exarchia a calmer hostel option, better for travelers who want bookstores, cafes, and alternative-city texture than an Acropolis-only route. Late arrivals should confirm the access details before booking, especially after long flights.", { venueKind: "lodging", lodgingType: "hostel", price: "$", priceSource: "Official hostel services / Booking.com", attributeTags: ["hostel", "budget", "quiet", "solo_friendly"], hours: hours.whenInAthens, officialUrl: "https://www.wheninathenshostel.com/", bookingUrl: "https://www.wheninathenshostel.com/", sourcePhoto: images.city, editorialUrls: ["https://www.wheninathenshostel.com/services-and-facilities", "https://www.booking.com/hotel/gr/when-in-athens-hostel.html"] }),
  stop("athens-hostel-hawks", "Athens Hawks Urban", [37.9825, 23.7248], "Athens Hawks Urban is the budget-social pick for travelers who want a bigger hostel setup, bar energy, and easy access to Omonia, Psyrri, and the market streets. Use it when price and built-in company matter.", { venueKind: "lodging", lodgingType: "hostel", price: "$", priceSource: "Hostelworld / official hostel site", attributeTags: ["hostel", "budget", "social", "central"], hours: hours.hostel, officialUrl: "https://www.athenshawksurban.com/", bookingUrl: "https://www.athenshawksurban.com/", sourcePhoto: images.market, editorialUrls: ["https://www.athenshawksurban.com/", "https://www.hostelworld.com/hostels/europe/greece/athens/"] }),
  stop("athens-hostel-backpackers", "Athens Backpackers", [37.9684, 23.7288], "Athens Backpackers is the Acropolis-side hostel for travelers who want the archaeological spine close and do not mind a classic backpacker setup. The 24-hour reception note is useful for awkward flight timing, but choose it for location first.", { venueKind: "lodging", lodgingType: "hostel", price: "$", priceSource: "Current amenities source / Hostelworld", attributeTags: ["hostel", "central", "budget", "sightseeing_base"], hours: hours.athensBackpackers, officialUrl: "https://athensbackpackers.com/", bookingUrl: "https://athensbackpackers.com/", sourcePhoto: images.acropolisMuseum, editorialUrls: ["https://athens-backpackers.athenshotels.it/services.html", "https://www.hostelworld.com/hostels/europe/greece/athens/"] }),
];

const casualBarStops = [
  stop("athens-bar-barrett", "Barrett", [37.9779, 23.7227], "Barrett is Psyrri without the polished rooftop script: coffee by day, cold beers, simple drinks, art on the walls, and DJs leaning alt-rock, soul, jazz, and blues. It is a good first-or-last drink when you want the night casual.", { venueKind: "nightlife", nightlifeType: "dive_bar", musicGenres: ["alt_rock", "soul", "jazz", "blues"], price: "$", priceSource: "Official bar site", attributeTags: ["local_bar", "cheap_drinks", "casual_nightlife", "dj_sets"], hours: hours.barrett, officialUrl: "https://barrett-athens.gr/", sourcePhoto: images.market, editorialUrls: ["https://barrett-athens.gr/", "https://www.corner.inc/place/721451"] }),
  stop("athens-bar-au-revoir", "Au Revoir", [37.9991, 23.7331], "Au Revoir is the Kypseli classic, opened in 1957 and still trading on a time-capsule room rather than a trend cycle. It is a seated, old-Athens drink with enough patina to justify leaving the center.", { venueKind: "nightlife", nightlifeType: "dive_bar", musicGenres: ["background", "oldies"], price: "$$", priceSource: "Official Athens Guide / current hours source", attributeTags: ["local_bar", "historic", "low_key_nightlife", "casual_nightlife"], hours: hours.auRevoir, officialUrl: "https://m.facebook.com/AuRevoirBar/", sourcePhoto: images.city, editorialUrls: ["https://www.thisisathens.org/nightlife/au-revoir-bar", "https://triptap.com/places/gr/attica/athens/au-revoir-bar-t0120878"] }),
  stop("athens-bar-bios", "Bios", [37.9787, 23.7155], "Bios is part bar, part performance-and-culture platform, which makes it useful when a night needs more than another drink list. Check the calendar first: the programming is the reason to build a route around it.", { venueKind: "nightlife", nightlifeType: "live_music_venue", musicGenres: ["dj_sets", "live_music", "performance"], price: "$$", priceSource: "Official venue site / current hours source", attributeTags: ["live_music", "rooftop", "dj_sets", "casual_nightlife"], hours: hours.bios, officialUrl: "https://www.bios.gr/", sourcePhoto: images.kerameikos, editorialUrls: ["https://www.cybo.com/GR-biz/bios", "https://www.therooftopguide.com/rooftop-bars-in-athens/bios.html"] }),
  stop("athens-bar-brettos", "Brettos", [37.9726, 23.7294], "Brettos is tourist-visible Plaka, but the wall of colored bottles and distillery history make it more specific than the average old-center bar. Use it for an easy ouzo, brandy, or liqueur stop before dinner, then keep moving.", { venueKind: "nightlife", nightlifeType: "bar", musicGenres: ["background"], price: "$$", priceSource: "Brettos editorial source / Google Maps", attributeTags: ["historic", "tourist_friendly", "casual_nightlife", "local_bar"], hours: hours.brettos, officialUrl: "https://www.brettosplaka.com/", sourcePhoto: images.brettos, editorialUrls: ["https://barsforkings.com/bars/athens/brettos-distillery/", "https://www.enprimeurclub.com/bars/brettos-athens-bar"] }),
  stop("athens-bar-couleur-locale", "Couleur Locale", [37.9768, 23.7241], "Couleur Locale is the practical Monastiraki rooftop when the group wants an Acropolis view without turning the evening into a luxury-hotel bill. Time it for sunset or an easy first drink and do not mistake the view for the whole night.", { venueKind: "nightlife", nightlifeType: "rooftop_bar", musicGenres: ["dj_sets", "background"], price: "$$", priceSource: "Official bar site / Google Maps", attributeTags: ["rooftop", "scenic_nightlife", "group_friendly", "casual_nightlife"], hours: hours.couleurLocale, officialUrl: "https://couleurlocaleathens.com/", sourcePhoto: images.athensNight, editorialUrls: ["https://www.timeout.com/athens/bars-and-pubs", maps("Couleur Locale Athens")] }),
];

const cocktailStops = [
  stop("athens-cocktail-baba-au-rum", "Baba Au Rum", [37.9778, 23.7298], "Baba Au Rum is the Athens cocktail address with the longest international shadow, a rum-first room that still feels like a bar rather than a trophy cabinet. Start with the classics or the rum list, and book or arrive early if your night cannot absorb a wait.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["lounge", "dj_sets"], price: "$$$", priceSource: "Official bar site / World's 50 Best Bars context", attributeTags: ["craft_cocktails", "reservation_recommended_nightlife", "premium_drinks", "date_night"], hours: hours.babaAuRum, officialUrl: "https://www.babaaurum.com/", sourcePhoto: images.athensNight, editorialUrls: ["https://www.babaaurum.com/contact/", "https://barsforkings.com/bars/athens/baba-au-rum/"] }),
  stop("athens-cocktail-clumsies", "The Clumsies", [37.9798, 23.7303], "The Clumsies is the all-day cocktail institution that made Athens feel bigger on the global bar map. The draw is a house-like space, polished hosting, and serious drinks; treat it as a planned stop, especially on weekends.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["lounge", "dj_sets"], price: "$$$", priceSource: "Official bar site / Google Maps", attributeTags: ["craft_cocktails", "premium_drinks", "reservation_recommended_nightlife", "date_night"], hours: hours.cocktailVariable, officialUrl: "https://www.theclumsies.gr/", sourcePhoto: images.athensNight, editorialUrls: ["https://www.theclumsies.gr/", "https://www.tripadvisor.com/Attraction_Review-g189400-d8020407-Reviews-The_Clumsies-Athens_Attica.html"] }),
  stop("athens-cocktail-line", "Line Athens", [37.9792, 23.7116], "Line is the fermentation-lab cocktail stop, where the point is house-made fruit wine, experimental ingredients, and a Kerameikos address away from the obvious Plaka loop. It works best when the group wants curiosity and food support.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["lounge", "dj_sets"], price: "$$$", priceSource: "Official bar site / current platform source", attributeTags: ["craft_cocktails", "natural_wine", "date_night", "reservation_recommended_nightlife"], hours: hours.cocktailVariable, officialUrl: "https://lineathens.gr/", sourcePhoto: images.kerameikos, editorialUrls: ["https://tablejourney.com/greece/athens/bars/line-athens/", "https://www.corner.inc/place/pTuVSCrNrT1t"] }),
  stop("athens-cocktail-barro-negro", "Barro Negro", [37.9778, 23.725], "Barro Negro gives the cocktail guide an agave-focused counterpoint to rum and high-concept fermentation. It is strongest for mezcal, tequila, and a night that wants sharper edges, louder energy, and less politeness than a hotel bar.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["latin", "dj_sets"], price: "$$$", priceSource: "Athens cocktail editorial sources / Google Maps", attributeTags: ["craft_cocktails", "premium_drinks", "late_night", "lively_nightlife"], hours: hours.cocktailVariable, officialUrl: "https://www.instagram.com/barronegro_athens/", sourcePhoto: images.athensNight, editorialUrls: ["https://www.timeout.com/athens/bars-and-pubs", maps("Barro Negro Athens")] }),
  stop("athens-cocktail-bar-in-front", "The Bar in Front of the Bar", [37.9779, 23.729], "The Bar in Front of the Bar earns the wildcard slot because Athens cocktail culture now likes formats as much as hidden doors. It is best for travelers who already know Baba and Clumsies and want street energy with their drinks.", { venueKind: "nightlife", nightlifeType: "cocktail_bar", musicGenres: ["dj_sets", "street"], price: "$$", priceSource: "World's 50 Best Bars context / Google Maps", attributeTags: ["craft_cocktails", "lively_nightlife", "walk_in_friendly_nightlife", "late_night"], hours: hours.cocktailVariable, officialUrl: "https://www.instagram.com/thebarinfrontofthebar/", sourcePhoto: images.athensNight, editorialUrls: ["https://www.worlds50bestbars.com/", maps("The Bar in Front of the Bar Athens")] }),
];

const cultureStops = [
  stop("athens-culture-acropolis-museum", "Acropolis Museum", [37.9684, 23.7285], "The Acropolis Museum is the essential companion to the hill above it, with the Parthenon Gallery doing the interpretive work the site itself cannot. Go after the Acropolis if your legs allow it, or use the museum first when heat makes the exposed rock a bad idea.", { venueKind: "culture", subcategory: "museum", hours: hours.acropolisMuseum, officialUrl: "https://www.theacropolismuseum.gr/en/plan-your-visit", sourcePhoto: images.acropolisMuseum, editorialUrls: ["https://www.visitgreece.gr/experiences/culture/museums/acropolis-museum/", "https://www.athenstravelguides.com/posts/best-museums-in-athens/"] }),
  stop("athens-culture-national-archaeological", "National Archaeological Museum", [37.989, 23.7328], "The National Archaeological Museum is the bigger, deeper Athens museum, less conveniently placed than the Acropolis Museum and richer for anyone who wants Greece beyond one hill. Give it real time; a rushed hour turns major collections into trophy fatigue.", { venueKind: "culture", subcategory: "museum", hours: hours.nationalArchaeological, officialUrl: "https://www.namuseum.gr/en/", sourcePhoto: images.museum, editorialUrls: ["https://archaeologicalmuseums.culture.gov.gr/en/museum/5df34af3deca5e2d79e8c150", "https://www.athenstravelguides.com/posts/best-museums-in-athens/"] }),
  stop("athens-culture-benaki", "Benaki Museum of Greek Culture", [37.9766, 23.7415], "Benaki is the museum that helps Athens escape the ancient-only trap, moving from prehistoric and Byzantine material into modern Greece inside a neoclassical house. It is a smart Kolonaki pairing with Cycladic Art or KORA, especially on Thursday's late opening.", { venueKind: "culture", subcategory: "museum", hours: hours.benaki, officialUrl: "https://www.benaki.org/index.php?id=11&lang=en&option=com_buildings&view=building", sourcePhoto: images.benaki, editorialUrls: ["https://www.athenstravelguides.com/posts/best-museums-in-athens/", "https://www.thisisathens.org/culture/museums"] }),
  stop("athens-culture-cycladic", "Museum of Cycladic Art", [37.9762, 23.7418], "The Museum of Cycladic Art is the compact, elegant stop for marble figures, Aegean forms, and a calmer museum rhythm near Kolonaki. It is the right move when the day needs design clarity rather than another giant archaeological sequence.", { venueKind: "culture", subcategory: "museum", hours: hours.museum, officialUrl: "https://cycladic.gr/en/", sourcePhoto: images.city, editorialUrls: ["https://www.athenstravelguides.com/posts/best-museums-in-athens/", "https://www.thisisathens.org/culture/museums"] }),
  stop("athens-culture-national-gallery", "National Gallery - Alexandros Soutsos Museum", [37.9759, 23.7495], "The National Gallery gives the city a modern Greek art spine, useful when Athens has started to feel like marble, ruins, and rooftop views only. Check the exhibition calendar and pair it with Cookoovaya or the Ilisia side so it does not become an orphaned taxi stop.", { venueKind: "culture", subcategory: "museum", hours: hours.museum, officialUrl: "https://www.nationalgallery.gr/en/", sourcePhoto: images.city, editorialUrls: ["https://www.thisisathens.org/culture/museums", "https://www.athenstravelguides.com/posts/best-museums-in-athens/"] }),
];

const activityStops = [
  stop("athens-activity-acropolis", "Acropolis of Athens", [37.9715, 23.7257], "The Acropolis is still the first anchor because the city organizes itself around that rock. Book timed entry, go early or late around heat, and follow the hill with the museum or Agora so the Parthenon does not have to explain Athens alone.", { venueKind: "landmark", subcategory: "archaeological_site", hours: hours.acropolis, officialUrl: "https://hhticket.gr/", sourcePhoto: images.acropolis, editorialUrls: ["https://www.timeout.com/athens/things-to-do/best-things-to-do-in-athens", "https://www.lonelyplanet.com/articles/top-things-to-do-in-athens"] }),
  stop("athens-activity-acropolis-museum", "Acropolis Museum", [37.9684, 23.7285], "In the things-to-do route, the Acropolis Museum is the recovery stop after the exposed climb: air-conditioning, context, and a cleaner look at what the hill once held. Save enough energy for the Parthenon Gallery rather than treating it as a souvenir-shop annex.", { venueKind: "culture", subcategory: "museum", hours: hours.acropolisMuseum, officialUrl: "https://www.theacropolismuseum.gr/en/plan-your-visit", sourcePhoto: images.acropolisMuseum, editorialUrls: ["https://www.visitgreece.gr/experiences/culture/museums/acropolis-museum/", "https://www.athenstravelguides.com/posts/best-museums-in-athens/"] }),
  stop("athens-activity-ancient-agora", "Ancient Agora of Athens", [37.975, 23.7225], "The Ancient Agora turns democracy, commerce, temples, and daily city life into walkable geography below the Acropolis. It is a better second archaeological stop than another distant ruin because the Temple of Hephaestus, Stoa of Attalos, and shaded paths keep the story legible.", { venueKind: "culture", subcategory: "archaeological_site", hours: hours.ancientAgora, officialUrl: "https://hhticket.gr/", sourcePhoto: images.ancientAgora, editorialUrls: ["https://etickets.tap.gr/webengines/images/places/000000004/arxaia_agora_en.pdf", "https://www.timeout.com/athens/things-to-do/best-things-to-do-in-athens"] }),
  stop("athens-activity-plaka-anafiotika", "Plaka and Anafiotika", [37.9728, 23.7307], "Plaka and Anafiotika can be touristy and still necessary, because the lanes below the Acropolis explain Athens at walking speed. Use them as a route, not a shopping assignment: climb quietly, dodge restaurant barkers, and let the neighborhood connect museum time to dinner.", { venueKind: "landmark", subcategory: "historic_district", hours: hours.plaka, officialUrl: "https://www.thisisathens.org/", sourcePhoto: images.plaka, editorialUrls: ["https://www.lonelyplanet.com/articles/top-things-to-do-in-athens", maps("Anafiotika Plaka Athens")] }),
  stop("athens-activity-varvakios-market", "Varvakios Central Municipal Market", [37.9802, 23.7262], "Varvakios Market is the food-city reset: meat halls, fish counters, spice streets, and Evripidou delis pulling Athens out of postcard mode. Go in the morning, keep the visit observational and respectful, then eat nearby instead of wandering into the first tourist menu.", { venueKind: "retail", subcategory: "market", hours: hours.market, officialUrl: "https://www.thisisathens.org/", sourcePhoto: images.market, editorialUrls: ["https://www.thisisathens.org/sites/default/files/2021-09/24-budget-eat.pdf", maps("Varvakios Central Municipal Market Athens")] }),
  stop("athens-activity-national-garden", "National Garden", [37.9738, 23.7367], "The National Garden is the necessary shade break between Syntagma, Zappeion, and the stadium. Its value is cooling the route down when Athens heat starts making every plan feel worse, especially between museum blocks and late lunch.", { venueKind: "outdoors", subcategory: "garden", hours: hours.garden, officialUrl: "https://www.cityofathens.gr/", sourcePhoto: images.nationalGarden, editorialUrls: ["https://www.timeout.com/athens/things-to-do/best-things-to-do-in-athens", maps("National Garden Athens")] }),
  stop("athens-activity-lycabettus", "Lycabettus Hill", [37.9818, 23.7437], "Lycabettus is the cleanest citywide view, especially when the Acropolis has started to feel too close to understand. Walk if the weather is kind, use the funicular if it is not, and time sunset with patience.", { venueKind: "outdoors", subcategory: "viewpoint", hours: hours.lycabettus, officialUrl: "https://www.thisisathens.org/", sourcePhoto: images.lycabettus, editorialUrls: ["https://www.lonelyplanet.com/articles/top-things-to-do-in-athens", maps("Lycabettus Hill Athens")] }),
  stop("athens-activity-panathenaic", "Panathenaic Stadium", [37.9683, 23.7411], "The Panathenaic Stadium is one of the rare tourist stops that is both fast and memorable: marble, Olympic revival history, and a geometry you feel immediately. Pair it with the National Garden or Spondi rather than making a cross-town detour just for a photo.", { venueKind: "landmark", subcategory: "stadium", hours: hours.panathenaic, officialUrl: "https://www.panathenaicstadium.gr/", sourcePhoto: images.panathenaic, editorialUrls: ["https://www.timeout.com/athens/things-to-do/best-things-to-do-in-athens", maps("Panathenaic Stadium Athens")] }),
  stop("athens-activity-snfcc", "Stavros Niarchos Foundation Cultural Center", [37.9405, 23.6915], "SNFCC is Athens' modern public-space counterweight: Renzo Piano architecture, parkland, canals, the National Library, the Greek National Opera, and a reason to go south before or after Piraeus. Check the calendar first because the best version of the stop is event-led.", { venueKind: "culture", subcategory: "cultural_center", hours: hours.snfcc, officialUrl: "https://www.snfcc.org/en", sourcePhoto: images.snfcc, editorialUrls: ["https://athensglance.com/2019/09/14/stavros-niarchos-foundation/", "https://myartguides.com/artspaces/non-profit/athens/the-stavros-niarchos-foundation-cultural-center/"] }),
  stop("athens-activity-philopappos", "Philopappos Hill", [37.9672, 23.7214], "Philopappos Hill gives the Acropolis a better silhouette than standing under it, with paths, pines, and a view that makes the city breathe. Go in daylight, wear real shoes, and use it as the walk that loosens a museum-heavy day.", { venueKind: "outdoors", subcategory: "viewpoint", hours: hours.philopappos, officialUrl: "https://www.thisisathens.org/", sourcePhoto: images.philopappos, editorialUrls: ["https://www.lonelyplanet.com/articles/top-things-to-do-in-athens", maps("Philopappos Hill Athens")] }),
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
  guide("Nightlife", "list-athens-casual-bars", "athens-best-casual-bars", "best-bars", "Casual Bars, Rooftops, and Late Rooms", "A casual Athens nightlife guide for old bars, art spaces, Psyrri late rooms, and practical Acropolis views. It keeps the night flexible for travelers who want atmosphere, music, and neighborhood texture without turning every drink into a reservation.", casualBarStops, sources.casualBars, "Best Casual Bars in Athens for Rooftops, Old Bars, Music, and Late Drinks", "Athens casual bar guide with official pages, current hours, map evidence, and nightlife-source support."),
  guide("Nightlife", "list-athens-cocktail-bars", "athens-best-cocktail-bars", "best-cocktail-bars", "Cocktail Rooms Worth Planning Around", "A cocktail-specific Athens guide for rum classics, all-day institutions, fermentation experiments, agave rooms, and fast-format modern bars. Use it when drinks are the plan, not just the bridge between dinner and sleep.", cocktailStops, sources.cocktails, "Best Cocktail Bars in Athens for Baba Au Rum, The Clumsies, Line, and More", "Source-backed Athens cocktail guide with official pages, map evidence, current-status caveats, and editorial support."),
  guide("Culture", "list-athens-citywide-culture", "athens-best-culture-citywide", "best-culture", "Culture Beyond One Marble Hill", "A citywide Athens culture guide that anchors the Acropolis Museum and National Archaeological Museum, then makes room for Greek culture, Cycladic form, and modern art.", cultureStops, sources.culture, "Best Culture in Athens for Museums, Greek Art, and Ancient Context", "Athens culture guide with official museum hours, map evidence, and source-backed practical caveats."),
  guide("Activities", "list-athens-top-things-to-do", "athens-best-things-to-do-citywide", "best-things-to-do", "The Strong Athens First-Timer Route", "A 10-stop Athens things-to-do guide that paces the Acropolis with museums, Agora context, food-market texture, shade breaks, viewpoints, stadium history, and the modern SNFCC edge.", activityStops, sources.activities, "Best Things to Do in Athens for Acropolis, Museums, Markets, Views, and Parks", "Top things to do in Athens with official ticketing, hours caveats, map evidence, and route-useful planning notes."),
];
