import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

const createdAt = "2026-05-07T00:00:00.000Z";

const avatar = (letter: string) =>
  `data:image/svg+xml;utf8,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22160%22%20height%3D%22160%22%20viewBox%3D%220%200%20160%20160%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22160%22%20height%3D%22160%22%20rx%3D%2280%22%20fill%3D%22%230f766e%22%20%2F%3E%0A%20%20%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2254%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%0A%20%20%20%20%20%20%20%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22700%22%20fill%3D%22white%22%3E${letter}%3C%2Ftext%3E%0A%20%20%20%20%3C%2Fsvg%3E%0A%20%20`;

const creators: Record<ListCategory, MapList["creator"]> = {
  Food: { id: "user-rguide-food", name: "R Food", avatar: avatar("R") },
  Nightlife: { id: "user-rguide-nightlife", name: "R Nightlife", avatar: avatar("R") },
  Nature: { id: "user-rguide-nature", name: "R Nature", avatar: avatar("R") },
  Culture: { id: "user-rguide-culture", name: "R Culture", avatar: avatar("R") },
  Stay: { id: "user-rguide-stay", name: "R Stay", avatar: avatar("R") },
  Activities: { id: "user-rguide-activities", name: "R Activities", avatar: avatar("R") },
  Itineraries: { id: "user-rguide-itineraries", name: "R Itineraries", avatar: avatar("R") },
  Routes: { id: "user-rguide-routes", name: "R Routes", avatar: avatar("R") },
  Essentials: { id: "user-rguide-essentials", name: "R Essentials", avatar: avatar("R") },
};

const commonsFile = (fileName: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;

const photos = {
  food: commonsFile("Monte_Testaccio.jpg"),
  bar: commonsFile("Trastevere.JPG"),
  hotel: commonsFile("Six_Senses_Rome_(2025).jpg"),
  hostel: "https://ostellobello.com/wp-content/uploads/2021/10/OBR_1x1_Full.jpg",
  street: commonsFile("Villa_Farnesina,_Rome.jpg"),
  park: commonsFile("Orto_botanico_-_ingresso_2704.JPG"),
  colosseum: commonsFile("Colosseo_2020.jpg"),
  pantheon: commonsFile("Pantheon_Rom_1_cropped.jpg"),
  trevi: commonsFile("Trevi_Fountain,_Rome,_Italy_2_-_May_2007.jpg"),
  navona: commonsFile("Piazza_Navona,_Rome.jpg"),
  vatican: commonsFile("St_Peter's_Square,_Vatican_City_-_April_2007.jpg"),
  borghese: commonsFile("Villa_Borghese_in_Rome,_Italy_01.jpg"),
  appia: commonsFile("Appian_Way.jpg"),
  trastevere: commonsFile("Exterior_Santa_Maria_in_Trastevere.jpg"),
  testaccio: commonsFile("Monte_Testaccio.jpg"),
};

const photoByName: Record<string, string> = {
  "30 Formiche": commonsFile("MC100_a_Pigneto_(metropolitana_di_Roma).jpg"),
  "Abitart Hotel": "https://www.abitarthotel.com/images/headers/hotel-abitart-roma-hall.jpg",
  "Ai Tre Scalini": commonsFile("Roma_-_via_Panisperna_-_01.jpg"),
  "Alberghi Suburbani": commonsFile("Garbatella_ponte_roma.jpg"),
  "Armando al Pantheon": photos.pantheon,
  "Aromaticus Monti": commonsFile("Roma_-_via_Panisperna_-_01.jpg"),
  "Bar del Fico": photos.navona,
  "Bar Foschi": commonsFile("Garbatella_ponte_roma.jpg"),
  "Be.Re.": commonsFile("Beer_Flight.jpg"),
  "Bonci Pizzarium": "https://bonci.it/cdn/shop/files/featbonci.jpg?v=1752849390&width=1920",
  "Borgo Ripa Urban Travel": commonsFile("Trastevere.JPG"),
  "Basilica di San Clemente": commonsFile("Rome._Basilica_di_San_Clemente_al_Laterano_-_btv1b85533939.jpg"),
  "Basilica Papale San Paolo fuori le Mura": commonsFile("San_Paolo_fuori_le_mura_(cloister)_(2).jpg"),
  "Caffè Propaganda": photos.colosseum,
  "Casetta Rossa": commonsFile("Garbatella_ponte_roma.jpg"),
  "Castroni": commonsFile("St_Peter's_Square,_Vatican_City_-_April_2007.jpg"),
  "Chapter Roma": "https://www.chapter-roma.com/wp-content/uploads/2022/04/main_sleep.jpg",
  "Charity Café": commonsFile("Roma_-_via_Panisperna_-_01.jpg"),
  "Chorus Café": commonsFile("Cure_cocktail_bar_New_Orleans_2011.jpg"),
  "Comics Guesthouse": commonsFile("St_Peter's_Square,_Vatican_City_-_April_2007.jpg"),
  "Coming Out": photos.colosseum,
  "Crossroad Hotel": "https://www.crossroadhotel.it/wp-content/uploads/2024/03/Crossroad-hotel-roma-hotel-vicino-alla-metro-piramide-zona-ostiense-superior-double-room-1.jpg",
  "Da Enzo al 29": commonsFile("Trastevere.JPG"),
  "Dar Moschino": commonsFile("Monte_Testaccio.jpg"),
  "Domus Aurea": photos.colosseum,
  "Donna Camilla Savelli": commonsFile("Trastevere.JPG"),
  "Enoteca Ferrara": commonsFile("Wine_glasses_on_a_table_.jpg"),
  "Fatamorgana Monti": commonsFile("Gelato_artigianale_italiano,_Bertinelli.jpg"),
  "Flavio al Velavevodetto": commonsFile("Monte_Testaccio.jpg"),
  "Free Hostels Roma": commonsFile("Basilica_Papale_di_Santa_Maria_Maggiore_02.jpg"),
  "Freni e Frizioni": commonsFile("Aperol_Spritz_2014.jpg"),
  "Generator Rome": "https://staygenerator.com/web/media/widget-spaces-rooms/rome/rooms-photos/generator-rome-hostel-deluxe-king-bed-1.jpg?mode=max&quality=100&v=202209061428",
  "Hostaria Isidoro": photos.colosseum,
  "Hotel Caravel": "https://www.hotelcaravel.it/sites/default/files/1.jpeg",
  "Hotel de Russie": commonsFile("Villa_Borghese_in_Rome,_Italy_01.jpg"),
  "Hotel Lancelot": photos.colosseum,
  "Hotel Re Testa": commonsFile("Monte_Testaccio.jpg"),
  "Hotel San Anselmo": "https://www.aventinohotels.com/data/2560/IMG--2212--Hotel-San-Anselmo-Roma.jpg",
  "Hotel Santa Maria": commonsFile("Trastevere.JPG"),
  "Hotel Vilòn": "https://hotelvilon.com/wp-content/themes/startup_pro/images/img_slider_top-min.png",
  "Il Sorpasso": commonsFile("Wine_glasses_on_a_table_.jpg"),
  "Janiculum Hill": commonsFile("Trastevere.JPG"),
  "JO&JOE Roma": commonsFile("Trevi_Fountain,_Rome,_Italy_2_-_May_2007.jpg"),
  "L'Alibi": commonsFile("Monte_Testaccio.jpg"),
  "La Mescita": commonsFile("Garbatella_ponte_roma.jpg"),
  "Le Méridien Visconti Rome": commonsFile("Palazzo_di_Giustizia_(Rome).jpg"),
  "Li Rioni": photos.colosseum,
  "MACRO Mattatoio": commonsFile("Monte_Testaccio.jpg"),
  "Mama Shelter Roma": commonsFile("St_Peter's_Square,_Vatican_City_-_April_2007.jpg"),
  "Mercure Roma Centro Colosseo": photos.colosseum,
  "Mordi e Vai": commonsFile("Monte_Testaccio.jpg"),
  "Museo di Roma in Trastevere": commonsFile("Trastevere.JPG"),
  "New Generation Hostel Rome Center": commonsFile("Basilica_Papale_di_Santa_Maria_Maggiore_02.jpg"),
  "Non-Catholic Cemetery for Foreigners": commonsFile("Cimitero_Acattolico_Roma.jpg"),
  "Palazzo delle Esposizioni": commonsFile("Palazzo_delle_Esposizioni.jpg"),
  "Palazzo Manfredi": photos.colosseum,
  "Pasticceria Linari": commonsFile("Pizza_al_taglio_01.jpg"),
  "Porta San Paolo": commonsFile("Porta_San_Paolo_(Rome).jpg"),
  "Rec 23": commonsFile("Monte_Testaccio.jpg"),
  "Roma Scout Center": commonsFile("Basilica_Papale_di_Santa_Maria_Maggiore_02.jpg"),
  "Roman Forum and Palatine Hill": photos.colosseum,
  "Romanè": commonsFile("Cacio_e_pepe.jpg"),
  "Roscioli Salumeria con Cucina": commonsFile("Spaghetti_carbonara_(34560017766).jpg"),
  "Salotto 42": photos.pantheon,
  "Sandy Hostel": commonsFile("Roma_-_via_Panisperna_-_01.jpg"),
  "Sant'Eustachio Il Caffè": photos.pantheon,
  "Santo Stefano Rotondo": commonsFile("Santo_Stefano_Rotondo_-_interno.jpg"),
  "Seu Pizza Illuminati": commonsFile("Pizza_al_taglio_01.jpg"),
  "Shamrock Irish Pub Colosseum": photos.colosseum,
  "Teatro Palladium": commonsFile("Garbatella_ponte_roma.jpg"),
  "The Fifteen Keys Hotel": commonsFile("Roma_-_via_Panisperna_-_01.jpg"),
  "The Jerry Thomas Speakeasy": commonsFile("Cure_cocktail_bar_New_Orleans_2011.jpg"),
  "The RomeHello Hostel": commonsFile("Basilica_Papale_di_Santa_Maria_Maggiore_02.jpg"),
  "Tram Depot": commonsFile("Monte_Testaccio.jpg"),
  "Trattoria Luzzi": photos.colosseum,
  "UNAHOTELS Trastevere Roma": commonsFile("Trastevere.JPG"),
  "Urbana 47": commonsFile("Roma_-_via_Panisperna_-_01.jpg"),
  "Vinile": commonsFile("Garbatella_ponte_roma.jpg"),
  "Zia Restaurant": commonsFile("Trastevere.JPG"),
};

const googleMaps: ListSource = { name: "Google Maps", url: "https://maps.google.com" };
const romeFoodSources: ListSource[] = [
  { name: "Eater - Best Restaurants in Rome", url: "https://www.eater.com/maps/best-restaurants-rome-italy" },
  { name: "The Infatuation - Rome guides", url: "https://www.theinfatuation.com/rome/guides" },
  { name: "MICHELIN Guide - Rome restaurants", url: "https://guide.michelin.com/us/en/lazio/roma/restaurants" },
  { name: "Time Out - Rome restaurants", url: "https://www.timeout.com/rome/restaurants" },
  googleMaps,
];
const romeCultureSources: ListSource[] = [
  { name: "Turismo Roma", url: "https://www.turismoroma.it/en" },
  { name: "Parco archeologico del Colosseo", url: "https://colosseo.it/en/" },
  { name: "Vatican Museums", url: "https://www.museivaticani.va/content/museivaticani/en.html" },
  { name: "Time Out - Things to do in Rome", url: "https://www.timeout.com/rome/things-to-do" },
  googleMaps,
];
const romeStaySources: ListSource[] = [
  { name: "Hostelworld - Rome hostels", url: "https://www.hostelworld.com/hostels/Rome" },
  { name: "Condé Nast Traveler - Best hotels in Rome", url: "https://www.cntraveler.com/gallery/best-hotels-in-rome" },
  { name: "Time Out - Best hotels in Rome", url: "https://www.timeout.com/rome/hotels" },
  { name: "Booking.com - Rome", url: "https://www.booking.com/city/it/rome.html" },
  { name: "Tripadvisor - Rome hotels", url: "https://www.tripadvisor.com/Hotels-g187791-Rome_Lazio-Hotels.html" },
  googleMaps,
];
const romeNightlifeSources: ListSource[] = [
  { name: "The Infatuation - Best Wine Bars in Rome", url: "https://www.theinfatuation.com/rome/guides/best-wine-bars-rome" },
  { name: "Time Out - Rome bars", url: "https://www.timeout.com/rome/bars" },
  { name: "Resident Advisor - Rome events", url: "https://ra.co/events/it/rome" },
  googleMaps,
];
const romeNatureSources: ListSource[] = [
  { name: "Turismo Roma - Parks and villas", url: "https://www.turismoroma.it/en/places/villas-and-historic-parks" },
  { name: "Parco Archeologico dell'Appia Antica", url: "https://www.parcoappiaantica.it/" },
  { name: "Time Out - Things to do in Rome", url: "https://www.timeout.com/rome/things-to-do" },
  googleMaps,
];

type StopSeed = Omit<GuideStop, "photo" | "hours"> & {
  photo?: string;
  hours?: GuideStop["hours"];
};

type GuideSeed = {
  id: string;
  slug: string;
  seoSlug: string;
  seoTitle: string;
  seoDescription: string;
  title: string;
  description: string;
  url: string;
  category: ListCategory;
  neighborhood?: string;
  stops: StopSeed[];
  sources: ListSource[];
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function defaultHours(category: ListCategory): GuideStop["hours"] {
  if (category === "Stay") {
    return { default: "Reception/check-in hours vary; confirm directly before booking." };
  }
  if (category === "Food") {
    return { default: "Hours vary by day and season; confirm current service before going." };
  }
  if (category === "Nightlife") {
    return { default: "Evening hours vary by day and event; confirm current schedule before going." };
  }
  return { default: "Hours vary; confirm current opening times before visiting." };
}

function defaultPhoto(category: ListCategory) {
  if (category === "Food") return photos.food;
  if (category === "Nightlife") return photos.bar;
  if (category === "Stay") return photos.hotel;
  if (category === "Nature") return photos.park;
  return photos.street;
}

function normalizePhotoUrl(url: string) {
  const commonsPrefix = "https://upload.wikimedia.org/wikipedia/commons/";

  if (!url.startsWith(commonsPrefix)) {
    return url;
  }

  const path = url.slice(commonsPrefix.length).split("?")[0];
  const fileName = decodeURIComponent(path.split("/").at(-1) ?? path);
  return commonsFile(fileName);
}

function stop(seed: StopSeed, category: ListCategory): GuideStop {
  const photo = photoByName[seed.name] ?? seed.photo ?? defaultPhoto(category);

  return {
    ...seed,
    photo: normalizePhotoUrl(photo),
    hours: seed.hours ?? defaultHours(category),
  };
}

function guide(seed: GuideSeed): MapList {
  return {
    id: seed.id,
    slug: seed.slug,
    seoSlug: seed.seoSlug,
    seoTitle: seed.seoTitle,
    seoDescription: seed.seoDescription,
    title: seed.title,
    description: seed.description,
    url: seed.url,
    category: seed.category,
    location: {
      city: "Rome",
      neighborhood: seed.neighborhood,
      country: "Italy",
      continent: "Europe",
      scope: "city",
    },
    creator: creators[seed.category],
    upvotes: 0,
    createdAt,
    stops: seed.stops.map((item) => stop(item, seed.category)),
    sources: seed.sources,
  };
}

function neighborhoodGuide(
  neighborhood: string,
  category: ListCategory,
  topic: string,
  stops: StopSeed[],
  title: string,
  description: string,
  sources: ListSource[],
  seoSlug = category === "Food"
    ? "best-restaurants"
    : category === "Nightlife"
      ? "best-bars"
      : category === "Culture"
        ? "best-culture"
        : "best-things-to-do",
) {
  const neighborhoodSlug = slugify(neighborhood);
  const topicSlug = slugify(topic);
  return guide({
    id: `list-rome-${neighborhoodSlug}-${topicSlug}`,
    slug: `rome-${neighborhoodSlug}-${topicSlug}`,
    seoSlug,
    seoTitle: `Best ${topic} in ${neighborhood}, Rome`,
    seoDescription: `Best ${topic.toLowerCase()} in ${neighborhood}, Rome, selected for neighborhood fit, current source support, and useful saved-map routing.`,
    title,
    description,
    url: `https://www.google.com/maps/search/${encodeURIComponent(`${neighborhood} ${topic} Rome`)}`,
    category,
    neighborhood,
    stops,
    sources,
  });
}

function stayGuide(
  neighborhood: string | undefined,
  kind: "Hotels" | "Hostels",
  stops: StopSeed[],
  title: string,
  description: string,
) {
  const areaSlug = neighborhood ? slugify(neighborhood) : "citywide";
  const kindSlug = kind.toLowerCase();
  return guide({
    id: `list-rome-${areaSlug}-${kindSlug}`,
    slug: neighborhood ? `rome-${areaSlug}-${kindSlug.toLowerCase()}` : `rome-best-${kindSlug.toLowerCase()}`,
    seoSlug: kind === "Hotels" ? "best-hotels" : "best-hostels",
    seoTitle: neighborhood ? `Best ${kind} in ${neighborhood}, Rome` : `Best ${kind} in Rome`,
    seoDescription: neighborhood
      ? `Best ${kind.toLowerCase()} in ${neighborhood}, Rome, with source-backed picks for location, sleep style, room type, and value.`
      : `Best ${kind.toLowerCase()} in Rome, comparing neighborhood bases, traveler style, room type, and booking fit.`,
    title,
    description,
    url: `https://www.google.com/maps/search/${encodeURIComponent(`${neighborhood ? `${neighborhood} ` : ""}${kind} Rome`)}`,
    category: "Stay",
    neighborhood,
    stops,
    sources: romeStaySources,
  });
}

const citywideFood: StopSeed[] = [
  {
    id: "rome-citywide-roscioli",
    name: "Roscioli Salumeria con Cucina",
    coordinates: [41.8956, 12.4745],
    description: "Roscioli is the Centro Storico food anchor because it compresses deli, wine cellar, and restaurant into one Roman reservation. The draw is the product-driven Roman meal: salumi, cheese, carbonara, amatriciana, and a wine list that makes the room feel half-shop and half-ritual. Use it when you want a planned, high-energy central dinner; it is not the right choice for a quiet, lingering table.",
    price: "$$$",
    priceSource: "Eater / The Infatuation",
    photo: undefined,
  },
  {
    id: "rome-citywide-da-enzo",
    name: "Da Enzo al 29",
    coordinates: [41.8897, 12.4746],
    description: "Da Enzo gives the citywide list its Trastevere trattoria benchmark: small room, Roman classics, heavy demand, and a queue-or-reservation rhythm. The experience is direct and crowded in the best-known Roman way, with pastas, artichokes, and simple plates carrying more weight than decor. It belongs here because the neighborhood energy is part of the meal without replacing the cooking; go early or be ready to wait.",
    price: "$$",
    priceSource: "Eater / The Infatuation",
    photo: undefined,
  },
  {
    id: "rome-citywide-pizzarium",
    name: "Bonci Pizzarium",
    coordinates: [41.9084, 12.4452],
    description: "Bonci Pizzarium is the Prati/Vatican-area slice stop that still matters because it turns pizza al taglio into a destination meal. The source-backed draw is seasonal toppings, crisp-chewy dough, and a format that works when a Vatican day does not have room for a long lunch. Treat it as a planned break near Cipro rather than a random snack, and expect demand at peak times.",
    price: "$$",
    priceSource: "Eater / Google Maps",
    photo: "http://bonci.it/cdn/shop/files/featbonci.jpg?v=1752849390&width=1920",
  },
  {
    id: "rome-citywide-flavio",
    name: "Flavio al Velavevodetto",
    coordinates: [41.8765, 12.4765],
    description: "Flavio al Velavevodetto is the Testaccio pick for classic Roman cooking with neighborhood context. The room sits into Monte Testaccio's food-history landscape, which makes carbonara, cacio e pepe, and offal-linked dishes feel anchored rather than performative. Use it when the route already includes the market, Mattatoio, or Aventine edge; the meal lands better when you understand the district around it.",
    price: "$$",
    priceSource: "Eater / MICHELIN Guide",
    photo: undefined,
  },
  {
    id: "rome-citywide-zia",
    name: "Zia Restaurant",
    coordinates: [41.8894, 12.4678],
    description: "Zia is the polished modern counterpoint, useful when the trip needs one tasting-menu dinner that still belongs to Rome. MICHELIN support and its quieter Trastevere placement make it feel deliberate rather than flashy, with contemporary cooking that gives the neighborhood more range than trattorias alone. Book it for a planned dinner after simpler pasta meals, not for a spontaneous casual night.",
    price: "$$$",
    priceSource: "MICHELIN Guide / Google Maps",
    photo: undefined,
  },
];

const citywideCulture: StopSeed[] = [
  {
    id: "rome-citywide-colosseum",
    name: "Colosseum",
    coordinates: [41.8902, 12.4922],
    description: "The Colosseum is the ancient-city anchor because it gives Rome's imperial scale a physical center. The experience is strongest when the ticket and timing connect it to the Forum, Palatine, or Celio churches rather than isolating it as a single photo stop. Start early or late, book the right entry type, and leave slack for security lines so the route does not become crowd management.",
    photo: photos.colosseum,
  },
  {
    id: "rome-citywide-pantheon",
    name: "Pantheon",
    coordinates: [41.8986, 12.4769],
    description: "The Pantheon makes the Centro Storico's layers legible in one building: Roman engineering, church continuity, piazza life, and intense visitor pressure. The oculus and dome are the obvious draw, but the real value is how quickly the stop explains the historic core around it. It is short enough to fit between food stops, but important enough to plan around timed entry, crowds, and nearby routes.",
    photo: photos.pantheon,
  },
  {
    id: "rome-citywide-vatican-museums",
    name: "Vatican Museums",
    coordinates: [41.9065, 12.4536],
    description: "The Vatican Museums are the Prati-side heavyweight because they can overwhelm the rest of a Rome day if treated casually. The experience is a long sequence of galleries, papal collections, and Sistine Chapel crowd flow rather than a simple museum pop-in. Use them as a timed, energy-aware block, then plan food or a park reset instead of stacking more major sights immediately after.",
    photo: photos.vatican,
  },
  {
    id: "rome-citywide-galleria-borghese",
    name: "Galleria Borghese",
    coordinates: [41.9142, 12.4922],
    description: "Galleria Borghese earns its citywide place because the timed-entry format turns a major museum into a focused two-hour experience. The collection gives you Bernini, Caravaggio, and villa-scale rooms without the sprawl of larger museums. Reserve ahead and pair it with Villa Borghese so the day has both art intensity and park air.",
    photo: photos.borghese,
  },
  {
    id: "rome-citywide-doria-pamphilj",
    name: "Galleria Doria Pamphilj",
    coordinates: [41.8976, 12.4813],
    description: "Doria Pamphilj gives central Rome an indoor palace-and-painting stop that can rescue a hot, wet, or overpacked day. The draw is the private-palace setting, dense picture galleries, and a sense of aristocratic Rome that contrasts with the piazza crowds outside. Use it when the route already runs between the Pantheon, Trevi, and Piazza Venezia and needs one calmer interior.",
    photo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Ceiling_in_Galleria_Doria_Pamphilj_%28Rome%29.jpg",
  },
];

const citywideNature: StopSeed[] = [
  {
    id: "rome-nature-villa-borghese",
    name: "Villa Borghese",
    coordinates: [41.9142, 12.4863],
    description: "Villa Borghese is Rome's easiest central reset because it gives dense sightseeing days a large, shaded release valve. The experience can be as simple as lake paths and terraces or as structured as a Galleria Borghese booking and museum route. Use it between Centro Storico and Parioli, or after a heavy art block when the day needs air instead of another church.",
    photo: photos.borghese,
  },
  {
    id: "rome-nature-appian-way",
    name: "Via Appia Antica",
    coordinates: [41.8466, 12.5167],
    description: "The Appian Way is the nature-and-history escape that still feels unmistakably Roman. The draw is the long road rhythm: ruins, cypresses, catacomb routes, aqueduct views, and bikeable stretches of ancient stone. Bring it into a longer day when you want Rome to open outward; it is less useful as a rushed add-on between central sights.",
    photo: photos.appia,
  },
  {
    id: "rome-nature-janiculum",
    name: "Janiculum Hill",
    coordinates: [41.8919, 12.4617],
    description: "Janiculum Hill gives Trastevere a view-led walk instead of letting the neighborhood be only dinner and bars. The reward is a broad city panorama, leafy approaches, and a route that can connect Villa Farnesina, the Botanical Garden, or upper Trastevere. Go early or near sunset, and treat the climb as part of the plan rather than a quick detour.",
    photo: photos.trastevere,
  },
  {
    id: "rome-nature-orange-garden",
    name: "Giardino degli Aranci",
    coordinates: [41.8851, 12.4786],
    description: "The Orange Garden is the compact Aventine viewpoint that belongs in a Rome nature guide because it solves a common route problem. It gives travelers a quiet terrace, shade, and a clean city view between Testaccio, the river, and the historic core. Use it as a short reset before dinner or after a market walk, not as a standalone cross-town destination.",
    photo: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Dal_giardino_degli_aranci_-_tutta_roma.JPG",
  },
  {
    id: "rome-nature-botanical-garden",
    name: "Orto Botanico di Roma",
    coordinates: [41.8933, 12.4664],
    description: "Rome's Botanical Garden is the Trastevere green-space choice when the city needs shade, water, and slower paths. The experience is quieter than the famous villas, with plant collections and hillside edges that feel removed from nearby bar lanes. It is most useful as decompression before an evening in Trastevere or after Villa Farnesina.",
    photo: "https://upload.wikimedia.org/wikipedia/commons/2/28/Orto_botanico_-_ingresso_2704.JPG",
  },
];

const hotelStops = {
  city: [
    { id: "rome-hotel-six-senses", name: "Six Senses Rome", coordinates: [41.8988, 12.4825], description: "Six Senses Rome is the citywide luxury pick for travelers who want central access without giving up spa depth. The appeal is a polished historic building, wellness facilities, and immediate reach to the Pantheon/Trevi axis, which can make short high-end trips feel calmer. Book it when recovery time and design matter as much as sightseeing proximity; it is priced for travelers who will use the property, not just the bed.", price: "$$$", priceSource: "Condé Nast Traveler / Google Travel", photo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Six_Senses_Rome_%282025%29.jpg" },
    { id: "rome-hotel-de-russie", name: "Hotel de Russie", coordinates: [41.9101, 12.4764], description: "Hotel de Russie works as the polished north-center classic because it offers garden calm where Rome usually gives you street pressure. The location near Piazza del Popolo supports Villa Borghese, shopping, and central walks without sleeping inside the densest old-city lanes. It suits travelers who want service, quiet, and a softer landing after long days.", price: "$$$", priceSource: "Condé Nast Traveler / Tripadvisor", photo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Six_Senses_Rome_%282025%29.jpg" },
    { id: "rome-hotel-vilon", name: "Hotel Vilòn", coordinates: [41.9048, 12.4772], description: "Hotel Vilon is the boutique Centro/Spagna choice for travelers who want high design at a smaller scale. The appeal is the palace-adjacent setting, polished rooms, and a location that supports shopping, museums, and late central dinners without feeling like a generic chain. It is best for couples or design-minded travelers who value mood over big-hotel amenities.", price: "$$$", priceSource: "Condé Nast Traveler / Google Travel", photo: undefined },
    { id: "rome-hotel-santa-maria", name: "Hotel Santa Maria", coordinates: [41.8886, 12.4719], description: "Hotel Santa Maria is the Trastevere value-charmer because it gives the neighborhood a courtyard sleep base instead of only late-night street energy. The draw is simple comfort, greenery, and immediate access to dinner and bar routes. Choose it when you want atmosphere and quiet more than a grand lobby or full-service luxury.", price: "$$", priceSource: "Time Out / Booking.com", photo: undefined },
  ],
  centro: [
    { id: "centro-hotel-six-senses", name: "Six Senses Rome", coordinates: [41.8988, 12.4825], description: "Six Senses Rome is the splurge stay for travelers who want spa-level recovery inside the dense historic center. It makes sense when the trip is built around walking to the Pantheon, Trevi, and polished central restaurants.", price: "$$$", priceSource: "Condé Nast Traveler / Google Travel", photo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Six_Senses_Rome_%282025%29.jpg" },
    { id: "centro-hotel-vilon", name: "Hotel Vilòn", coordinates: [41.9048, 12.4772], description: "Hotel Vilòn gives Centro Storico a quieter boutique option near the fashion and palace corridor. It is best for couples or design-minded travelers who want central access without a big-hotel mood.", price: "$$$", priceSource: "Condé Nast Traveler / Tripadvisor", photo: undefined },
    { id: "centro-hotel-chapter", name: "Chapter Roma", coordinates: [41.8939, 12.4772], description: "Chapter Roma is the sharper, design-forward central pick near Campo de' Fiori and the Jewish Ghetto. Use it when nightlife, food routes, and contemporary rooms matter more than old-world formality.", price: "$$$", priceSource: "Time Out / Booking.com", photo: undefined },
  ],
  trastevere: [
    { id: "trastevere-hotel-santa-maria", name: "Hotel Santa Maria", coordinates: [41.8886, 12.4719], description: "Hotel Santa Maria is the easy Trastevere hotel pick because its courtyard setting softens the neighborhood's late-night energy. It is best for travelers who want restaurants nearby but still need a calm sleep base.", price: "$$", priceSource: "Time Out / Booking.com", photo: undefined },
    { id: "trastevere-donna-camilla", name: "Donna Camilla Savelli", coordinates: [41.8866, 12.4662], description: "Donna Camilla Savelli brings monastery architecture, terraces, and a quieter upper-Trastevere position. It suits travelers who want atmosphere and views without being directly on the busiest bar lanes.", price: "$$$", priceSource: "Condé Nast Traveler / Google Travel", photo: undefined },
    { id: "trastevere-unahotels", name: "UNAHOTELS Trastevere Roma", coordinates: [41.8847, 12.4695], description: "UNAHOTELS Trastevere is the more contemporary neighborhood option, useful for reliable rooms, easy taxi logistics, and access to Testaccio or the river as much as Trastevere itself. UNAHOTELS Trastevere Roma's value is the sleep tradeoff: location, room style, price posture, and how easily the stay supports the surrounding route. Confirm UNAHOTELS Trastevere Roma's current room type, check-in details, and transit fit before booking.", price: "$$", priceSource: "Booking.com / Google Travel", photo: undefined },
  ],
  monti: [
    { id: "monti-casa-monti", name: "Casa Monti Roma", coordinates: [41.8946, 12.4913], description: "Casa Monti is the stylish new-school Monti hotel, good for travelers who want artful rooms, Colosseum proximity, and a neighborhood feel rather than a formal landmark hotel. Casa Monti Roma's value is the sleep tradeoff: location, room style, price posture, and how easily the stay supports the surrounding route. Confirm Casa Monti Roma's current room type, check-in details, and transit fit before booking.", price: "$$$", priceSource: "Condé Nast Traveler / Google Travel", photo: "https://cdn.prod.website-files.com/65f98c3a9204e23805036d44/65fd65932040ded502e963c1_Cover%20(1).png" },
    { id: "monti-fifteen-keys", name: "The Fifteen Keys Hotel", coordinates: [41.897, 12.494], description: "The Fifteen Keys is a small boutique base that fits Monti's independent-shop and cafe rhythm. It is best for travelers who value quieter scale and easy walking to Termini, Colosseum, and central lanes.", price: "$$", priceSource: "Booking.com / Tripadvisor", photo: undefined },
    { id: "monti-nerva", name: "Nerva Boutique Hotel", coordinates: [41.8934, 12.4868], description: "Nerva Boutique Hotel works for travelers who want ancient-site access without sleeping in a mega-property. The location is practical for the Forum, Monti dinners, and first-time Rome logistics.", price: "$$", priceSource: "Google Travel / Tripadvisor", photo: "https://www.hotelnerva.com/data/1024/hotel-nerva34.jpg" },
  ],
  testaccio: [
    { id: "testaccio-hotel-san-anselmo", name: "Hotel San Anselmo", coordinates: [41.8823, 12.4805], description: "Hotel San Anselmo sits just above Testaccio on the Aventine, making it the romantic quiet-base pick for food-led travelers. It works when dinner is in Testaccio but sleep needs garden calm.", price: "$$", priceSource: "Time Out / Booking.com", photo: undefined },
    { id: "testaccio-abitart", name: "Abitart Hotel", coordinates: [41.8756, 12.4819], description: "Abitart Hotel is the practical Ostiense/Testaccio base, useful for travelers who want train/metro access, food neighborhoods, and less historic-center pressure. Abitart Hotel's value is the sleep tradeoff: location, room style, price posture, and how easily the stay supports the surrounding route. Confirm Abitart Hotel's current room type, check-in details, and transit fit before booking.", price: "$$", priceSource: "Booking.com / Google Travel", photo: undefined },
    { id: "testaccio-hotel-re-testa", name: "Hotel Re Testa", coordinates: [41.876, 12.4746], description: "Hotel Re Testa is a functional neighborhood stay for travelers prioritizing Testaccio's market, trattorias, and nightlife over postcard scenery. It is more about location and value than luxury.", price: "$$", priceSource: "Booking.com / Google Travel", photo: undefined },
  ],
  prati: [
    { id: "prati-mama-shelter", name: "Mama Shelter Roma", coordinates: [41.9088, 12.4448], description: "Mama Shelter Roma is the playful Vatican-adjacent hotel for travelers who want design, food on-site, and metro access. It is especially useful when Prati is a base rather than just a museum stop.", price: "$$", priceSource: "Time Out / Booking.com", photo: undefined },
    { id: "prati-le-meridien", name: "Le Méridien Visconti Rome", coordinates: [41.9081, 12.4695], description: "Le Meridien Visconti is the polished Prati business-leisure pick, with river access, Vatican reach, and a calmer grid than the old city. It works for travelers who want reliability over romance.", price: "$$$", priceSource: "Google Travel / Tripadvisor", photo: undefined },
    { id: "prati-atlante-star", name: "Atlante Star Hotel", coordinates: [41.9045, 12.4622], description: "Atlante Star is included for Vatican proximity and rooftop-view appeal. It is best for visitors who want St. Peter's access and a classic hotel setup without staying deep in Centro Storico.", price: "$$", priceSource: "Booking.com / Tripadvisor", photo: "https://www.atlantehotels.com/wp-content/uploads/2025/04/home-atlante-star.jpg" },
  ],
  garbatella: [
    { id: "garbatella-hotel-caravel", name: "Hotel Caravel", coordinates: [41.8567, 12.4956], description: "Hotel Caravel is the practical Garbatella-adjacent base, best for travelers prioritizing value, transit, and southern Rome logistics over old-city romance. Hotel Caravel's value is the sleep tradeoff: location, room style, price posture, and how easily the stay supports the surrounding route. Confirm Hotel Caravel's current room type, check-in details, and transit fit before booking.", price: "$$", priceSource: "Booking.com / Google Travel", photo: undefined },
    { id: "garbatella-hotel-pulitzer", name: "Hotel Pulitzer Roma", coordinates: [41.8389, 12.4784], description: "Hotel Pulitzer Roma serves the Garbatella/EUR edge with design-forward rooms and metro access. It is useful when the trip includes southern Rome, EUR, or business stops.", price: "$$", priceSource: "Booking.com / Tripadvisor", photo: "https://www.hotelpulitzer.it/assets/components/phpthumbof/cache/Cover_Tavolo%20%281%29.ea0409bea87230edc71e32984e69775b.png" },
    { id: "garbatella-crossroad", name: "Crossroad Hotel", coordinates: [41.8732, 12.4811], description: "Crossroad Hotel is the Ostiense-side option for travelers using Garbatella as a food and nightlife base. The value is rail/metro access plus quick movement into Testaccio and Ostiense.", price: "$$", priceSource: "Google Travel / Booking.com", photo: undefined },
  ],
  celio: [
    { id: "celio-palazzo-manfredi", name: "Palazzo Manfredi", coordinates: [41.8908, 12.4954], description: "Palazzo Manfredi is the Colosseum-view splurge, best for travelers who want the ancient-city fantasy built into the room and breakfast view. It is a landmark stay, not a budget-minded base.", price: "$$$", priceSource: "Condé Nast Traveler / Google Travel", photo: "https://www.manfredihotels.com/wp-content/uploads/2021/02/Manfredi-Collection_Palazzo-Manfredi_Roma-1.jpg" },
    { id: "celio-hotel-lancelot", name: "Hotel Lancelot", coordinates: [41.887, 12.4977], description: "Hotel Lancelot is the warmer midrange Celio pick, close to the Colosseum but quieter than the main tourist flow. It suits travelers who want family-run hospitality and walkable ruins.", price: "$$", priceSource: "Tripadvisor / Google Travel", photo: undefined },
    { id: "celio-mercure-colosseo", name: "Mercure Roma Centro Colosseo", coordinates: [41.8891, 12.4988], description: "Mercure Roma Centro Colosseo is the practical chain option with rooftop appeal and ancient-site proximity. It works when predictable rooms and a pool/view tradeoff matter more than boutique character.", price: "$$", priceSource: "Google Travel / Booking.com", photo: undefined },
  ],
} satisfies Record<string, StopSeed[]>;

const hostelStops = {
  city: [
    { id: "rome-hostel-romehello", name: "The RomeHello Hostel", coordinates: [41.9026, 12.4933], description: "The RomeHello is the citywide hostel benchmark because it balances central logistics with a cleaner, more organized social setup than many budget bases. Hostelworld and map signals support it for dorm/private flexibility, common spaces, and easy movement toward Termini, Monti, and the historic core. Use it if you want to meet people without depending on a party-hostel atmosphere every night.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "rome-hostel-yellowsquare", name: "YellowSquare Rome", coordinates: [41.9035, 12.5054], description: "YellowSquare is the social Termini-area hostel for travelers who want built-in plans after sightseeing. The appeal is events, bar energy, dorm/private range, and strong review momentum from backpackers who prioritize meeting people. Choose it when nightlife and hostel programming matter; choose a quieter base if sleep is the main priority.", price: "$", priceSource: "Hostelworld / Google Maps", photo: "https://yellowsquare.com/rome/wp-content/uploads/sites/2/2023/12/francesco_colosseo_precovid-gallery-home-rome-copia.webp" },
    { id: "rome-hostel-ostello-bello", name: "Ostello Bello Roma Colosseo", coordinates: [41.8954, 12.4996], description: "Ostello Bello Roma Colosseo is the best citywide hostel for ancient-site access because it sits close to Monti, Celio, and the Colosseum corridor. The value is dorm/private flexibility plus a lively common-space model that helps solo travelers build plans. Use it when you want sightseeing logistics and social energy in the same base.", price: "$", priceSource: "Hostelworld / Google Maps", photo: "https://ostellobello.com/wp-content/uploads/2021/10/OBR_1x1_Full.jpg" },
    { id: "rome-hostel-jojoe", name: "JO&JOE Roma", coordinates: [41.899, 12.4893], description: "JO&JOE Roma gives the city a newer design-hostel option near the center. The draw is hybrid lodging: dorms, private rooms, and a more polished social setup than a bare-bones hostel. It is a good fit for travelers who want budget flexibility but still care about design, common areas, and easy central movement.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
  ],
  centro: [
    { id: "centro-hostel-romehello", name: "The RomeHello Hostel", coordinates: [41.9026, 12.4933], description: "The RomeHello is the strongest hostel base for Centro Storico access even though it sits just north of the core. It works for travelers who want walkable sights with better hostel infrastructure than the old lanes usually offer.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "centro-hostel-jojoe", name: "JO&JOE Roma", coordinates: [41.899, 12.4893], description: "JO&JOE Roma is useful for Centro travelers who want a newer hybrid hostel-hotel setup near Trevi, Quirinale, and Monti. Choose it for design and private-room flexibility over classic backpacker grit.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "centro-hostel-new-generation", name: "New Generation Hostel Rome Center", coordinates: [41.8959, 12.4997], description: "New Generation Hostel Rome Center is a budget-first option near Monti and Santa Maria Maggiore. It serves Centro routes best when price and transit matter more than a deep neighborhood feel.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
  ],
  trastevere: [
    { id: "trastevere-hostel-borgo-ripa", name: "Borgo Ripa Urban Travel", coordinates: [41.8873, 12.4753], description: "Borgo Ripa Urban Travel is the rare Trastevere hostel-style base that actually fits the neighborhood. It is best for travelers who want dorm/private flexibility close to river walks and evening food routes.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "trastevere-hostel-romehello", name: "The RomeHello Hostel", coordinates: [41.9026, 12.4933], description: "The RomeHello is the safer infrastructure pick when Trastevere availability is thin. Stay here if you want stronger hostel operations and plan to visit Trastevere by bus, taxi, or evening walk.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "trastevere-hostel-yellow", name: "YellowSquare Rome", coordinates: [41.9035, 12.5054], description: "YellowSquare is not in Trastevere, but it honestly serves travelers who want the social hostel scene first and Trastevere as a dinner/night route. The tradeoff is transit or taxi time.", price: "$", priceSource: "Hostelworld / Google Maps", photo: "https://yellowsquare.com/rome/wp-content/uploads/sites/2/2023/12/francesco_colosseo_precovid-gallery-home-rome-copia.webp" },
  ],
  monti: [
    { id: "monti-hostel-ostello-bello", name: "Ostello Bello Roma Colosseo", coordinates: [41.8954, 12.4996], description: "Ostello Bello Roma Colosseo is the best hostel match for Monti: close to the neighborhood's bars, cafes, and ancient sites, with a social setup that still works for private-room travelers. Ostello Bello Roma Colosseo's hostel tradeoff is dorm and private-room flexibility, common-space energy, price, and whether the location honestly serves the neighborhood route. Confirm Ostello Bello Roma Colosseo's current ratings, check-in rules, lockers, and late-arrival details before booking.", price: "$", priceSource: "Hostelworld / Google Maps", photo: "https://ostellobello.com/wp-content/uploads/2021/10/OBR_1x1_Full.jpg" },
    { id: "monti-hostel-new-generation", name: "New Generation Hostel Rome Center", coordinates: [41.8959, 12.4997], description: "New Generation Hostel Rome Center is the budget Monti option for travelers who want Colosseum and Termini access without paying hotel rates. It is a location-and-price pick.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "monti-hostel-generator", name: "Generator Rome", coordinates: [41.8967, 12.5065], description: "Generator Rome sits on the Esquilino edge, but it serves Monti travelers who want a design hostel with dorms and private rooms near Termini and the Colosseum corridor. Generator Rome's value is the sleep tradeoff: location, room style, price posture, and how easily the stay supports the surrounding route. Confirm Generator Rome's current room type, check-in details, and transit fit before booking.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
  ],
  testaccio: [
    { id: "testaccio-hostel-borgo-ripa", name: "Borgo Ripa Urban Travel", coordinates: [41.8873, 12.4753], description: "Borgo Ripa is the closest credible hostel-style choice for Testaccio routes, especially for travelers who want Trastevere access at night and Testaccio food by foot or short transit. Borgo Ripa Urban Travel's hostel tradeoff is dorm and private-room flexibility, common-space energy, price, and whether the location honestly serves the neighborhood route. Confirm Borgo Ripa Urban Travel's current ratings, check-in rules, lockers, and late-arrival details before booking.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "testaccio-hostel-ostello-bello", name: "Ostello Bello Roma Colosseo", coordinates: [41.8954, 12.4996], description: "Ostello Bello is the stronger hostel operation if Testaccio itself lacks the right dorm base. Use it when ancient-site access matters by day and Testaccio is an evening food plan.", price: "$", priceSource: "Hostelworld / Google Maps", photo: "https://ostellobello.com/wp-content/uploads/2021/10/OBR_1x1_Full.jpg" },
    { id: "testaccio-hostel-roma-scout", name: "Roma Scout Center", coordinates: [41.9144, 12.5233], description: "Roma Scout Center is farther out, but it can suit budget travelers who prioritize value and simple dorm/private options over being inside Testaccio. It is a practical fallback, not a neighborhood immersion pick.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
  ],
  prati: [
    { id: "prati-hostel-comics", name: "Comics Guesthouse", coordinates: [41.9116, 12.4663], description: "Comics Guesthouse is the most honest Prati hostel-style option, close to the Vatican side and useful for private/dorm travelers who want a quieter base than Termini. Comics Guesthouse's value is the sleep tradeoff: location, room style, price posture, and how easily the stay supports the surrounding route. Confirm Comics Guesthouse's current room type, check-in details, and transit fit before booking.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "prati-hostel-romehello", name: "The RomeHello Hostel", coordinates: [41.9026, 12.4933], description: "The RomeHello works for Prati visitors who prefer a stronger hostel operation and are comfortable crossing town for Vatican days. It is a quality-over-proximity pick.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "prati-hostel-yellow", name: "YellowSquare Rome", coordinates: [41.9035, 12.5054], description: "YellowSquare is the social alternative for Prati travelers, better for meeting people than for Vatican doorstep convenience. Use it when nightlife and hostel programming matter.", price: "$", priceSource: "Hostelworld / Google Maps", photo: "https://yellowsquare.com/rome/wp-content/uploads/sites/2/2023/12/francesco_colosseo_precovid-gallery-home-rome-copia.webp" },
  ],
  garbatella: [
    { id: "garbatella-hostel-roma-scout", name: "Roma Scout Center", coordinates: [41.9144, 12.5233], description: "Roma Scout Center is not Garbatella proper, but it fits budget travelers using southeast Rome transit and wanting a quieter, functional hostel base. It is better for value than scene.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "garbatella-hostel-free-hostels", name: "Free Hostels Roma", coordinates: [41.8873, 12.5147], description: "Free Hostels Roma is a practical east-side hostel option for Garbatella plans when dorm availability matters more than sleeping inside the neighborhood. The common-space setup is the main reason to choose it.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "garbatella-hostel-ostello-bello", name: "Ostello Bello Roma Colosseo", coordinates: [41.8954, 12.4996], description: "Ostello Bello is the better-supported fallback for travelers who want a lively hostel and will treat Garbatella as a food or evening excursion. It is not hyperlocal, but it is reliable.", price: "$", priceSource: "Hostelworld / Google Maps", photo: "https://ostellobello.com/wp-content/uploads/2021/10/OBR_1x1_Full.jpg" },
  ],
  celio: [
    { id: "celio-hostel-ostello-bello", name: "Ostello Bello Roma Colosseo", coordinates: [41.8954, 12.4996], description: "Ostello Bello Roma Colosseo is the natural Celio hostel pick because it sits close to the Colosseum and Monti while still offering a strong social setup. Choose it for dorm/private flexibility near ancient Rome.", price: "$", priceSource: "Hostelworld / Google Maps", photo: "https://ostellobello.com/wp-content/uploads/2021/10/OBR_1x1_Full.jpg" },
    { id: "celio-hostel-sandy", name: "Sandy Hostel", coordinates: [41.8956, 12.4988], description: "Sandy Hostel is a budget-minded Colosseum-area fallback, useful for travelers who want the ancient core close and accept simpler facilities. It is a price/location pick.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
    { id: "celio-hostel-new-generation", name: "New Generation Hostel Rome Center", coordinates: [41.8959, 12.4997], description: "New Generation Hostel Rome Center works for Celio routes that also use Monti and Termini. It is best when access and cost matter more than a distinctive neighborhood stay.", price: "$", priceSource: "Hostelworld / Google Maps", photo: undefined },
  ],
} satisfies Record<string, StopSeed[]>;

const romeCoreGuides = [
  guide({
    id: "list-rome-citywide-restaurants",
    slug: "rome-best-restaurants",
    seoSlug: "best-restaurants",
    seoTitle: "Best Restaurants in Rome",
    seoDescription: "Best restaurants in Rome for Roman pastas, trattorias, bakeries, pizza al taglio, wine-led rooms, and reservation dinners by neighborhood.",
    title: "Roman Tables Worth Planning Around",
    description: "A citywide food spine for Rome: one serious central reservation, one Trastevere trattoria, one Vatican-area slice stop, Testaccio cooking, and a modern dinner that keeps the route from becoming only classics. The value is the meal format and neighborhood fit: what to order, how formal the stop feels, and whether it solves lunch, dinner, coffee, or a snack break. Confirm current hours and booking pressure before relying on it as the route's main meal.",
    url: "https://www.google.com/maps/search/best+restaurants+rome",
    category: "Food",
    stops: citywideFood,
    sources: romeFoodSources,
  }),
  guide({
    id: "list-rome-citywide-culture",
    slug: "rome-best-culture-citywide",
    seoSlug: "best-culture",
    seoTitle: "Best Culture in Rome",
    seoDescription: "Best culture in Rome for ancient sites, churches, museums, palace collections, Vatican galleries, and historic-center routes.",
    title: "Ancient Sites, Churches, and Palace Rooms",
    description: "Use this when you need Rome's cultural weight organized into a routeable set: ancient icons, central engineering, Vatican scale, a timed museum, and one palace collection that fits dense city days. The experience gives the area more context than a surface-level walk, whether through architecture, collections, street history, or a quieter interior. Check current opening days and ticket needs, then place it where the route can slow down enough to absorb it.",
    url: "https://www.google.com/maps/search/best+culture+rome",
    category: "Culture",
    stops: citywideCulture,
    sources: romeCultureSources,
  }),
  guide({
    id: "list-rome-top-parks-and-walks",
    slug: "rome-top-parks-and-walks",
    seoSlug: "best-parks",
    seoTitle: "Best Parks and Walks in Rome",
    seoDescription: "Best parks and walks in Rome for villa gardens, hill views, river-adjacent resets, botanical shade, and Appian Way routes.",
    title: "Villa Shade and Ancient Roads",
    description: "Rome's nature guide is less about wilderness than relief: villa paths, hill views, gardens, and the Appian Way routes that let ancient texture and open air carry the same day. The value is its role in the route: it adds a concrete experience, a timing choice, and a reason to save the stop rather than wander past it. Check current hours and fit it into the nearby cluster instead of treating it as a standalone errand.",
    url: "https://www.google.com/maps/search/best+parks+walks+rome",
    category: "Nature",
    stops: citywideNature,
    sources: romeNatureSources,
  }),
  guide({
    id: "list-rome-citywide-nightlife",
    slug: "rome-best-bars-nightlife",
    seoSlug: "best-bars",
    seoTitle: "Best Bars and Nightlife in Rome",
    seoDescription: "Best bars and nightlife in Rome for wine bars, cocktail rooms, piazza drinks, beer stops, and neighborhood evenings.",
    title: "Wine Bars, Piazza Drinks, and Late Rooms",
    description: "Rome nightlife works best when it follows the neighborhood instead of fighting it: aperitivo in Prati, craft beer in Trastevere, cocktails in Centro, and lower-key late rooms near Monti or Celio. This guide keeps the evening practical by matching drink format, crowd, and geography instead of sending every traveler to one bar district. Confirm current hours and event schedules before building a full night around any single stop.",
    url: "https://www.google.com/maps/search/best+bars+nightlife+rome",
    category: "Nightlife",
    stops: [
      { id: "rome-nightlife-freni-frizioni", name: "Freni e Frizioni", coordinates: [41.8894, 12.4714], description: "Freni e Frizioni is the Trastevere aperitivo anchor because it turns the river-edge piazza into an easy first stop. The draw is not hushed cocktail precision; it is crowd energy, spritzes, mixed groups, and the feeling that the night can branch in several directions. Use it early, before the neighborhood gets too packed, then decide whether dinner, beer, or a slower wine room comes next.", photo: undefined },
      { id: "rome-nightlife-jerry-thomas", name: "The Jerry Thomas Speakeasy", coordinates: [41.8961, 12.4711], description: "Jerry Thomas gives Centro Storico a destination cocktail room with planning friction, which is exactly the point. The experience is a darker, more deliberate bar night than the surrounding piazza tables, with classic cocktail culture and a reservation/password posture that makes it feel intentional. Use it when you want one serious drink stop, not a loose wander.", photo: undefined },
      { id: "rome-nightlife-ma-che-siete", name: "Ma Che Siete Venuti a Fà", coordinates: [41.8896, 12.4733], description: "Ma Che Siete Venuti a Fa is the craft-beer counterpoint to wine-heavy Rome and a useful pressure valve in Trastevere. The room is compact and busy, with the appeal coming from beer selection, bar energy, and its position near casual food routes. Use it before or after dinner when you want something sharper than another spritz.", photo: "https://static.wixstatic.com/media/db73ca_19853bdc30ba4dedb6a6b15bd412a14b~mv2.jpg/v1/fit/w_2500,h_1330,al_c/db73ca_19853bdc30ba4dedb6a6b15bd412a14b~mv2.jpg" },
      { id: "rome-nightlife-be-re", name: "Be.Re.", coordinates: [41.9065, 12.4588], description: "Be.Re. is the Prati/Vatican beer-and-street-food stop because it gives museum days a casual exit ramp. The appeal is craft beer, trapizzino-style food nearby, and a setting that feels current rather than trapped in sightseeing mode. Use it after the Vatican Museums when a full formal dinner feels like too much.", photo: undefined },
      { id: "rome-nightlife-blackmarket", name: "Blackmarket Hall", coordinates: [41.8944, 12.4916], description: "Blackmarket Hall is the Monti late-room pick because it gives the Colosseum corridor a moodier option after dinner. The draw is cocktails, music programming, and a more local-feeling room than the obvious tourist bars near the ruins. It works best when the evening should stay walkable around Monti rather than turn into a cross-town nightlife plan.", photo: "https://www.blackmarkethall.com/blackmarkethall.png" },
    ],
    sources: romeNightlifeSources,
  }),
  stayGuide(undefined, "Hotels", hotelStops.city, "Compare Rome by Sleep Style", "A citywide hotel guide for choosing the right Rome base: central spa polish, classic garden calm, boutique Centro access, or a Trastevere courtyard that supports food-first nights."),
  stayGuide(undefined, "Hostels", hostelStops.city, "Social Bases That Actually Work", "Rome hostels cluster around Termini, Monti, and a few neighborhood edges, so this guide compares social energy, private-room flexibility, and sightseeing logistics honestly."),
  guide({
    id: "list-rome-weekend-activities",
    slug: "rome-weekend-activities",
    seoSlug: "best-things-to-do",
    seoTitle: "Best Things to Do in Rome for a Weekend",
    seoDescription: "Best things to do in Rome for a weekend, pacing ancient sites, central churches, Roman food, Trastevere evenings, Vatican time, and park resets.",
    title: "A Weekend Without Monument Whiplash",
    description: "This weekend route keeps Rome legible by giving each day a role instead of chasing every monument. The stops balance ancient-site time, one central food spine, one Trastevere night, a Vatican-side block, and enough park or piazza air to reset between crowds. Use it as a pacing model, not a mandate to rush every item in order.",
    url: "https://www.google.com/maps/search/best+things+to+do+rome+weekend",
    category: "Activities",
    stops: [
      { ...citywideCulture[0], description: "The Colosseum belongs in the weekend plan only when it is tied to a realistic ancient-Rome block, not treated as a quick photo errand. Book the entry type carefully, keep Forum or Celio time nearby, and avoid stacking another heavyweight museum immediately after it." },
      { ...citywideCulture[1], description: "The Pantheon is the weekend route's short, high-impact historic stop: central enough to sit between meals, but important enough to plan around crowds and timed entry. Let it explain the old core quickly before moving back into piazzas, coffee, or dinner." },
      { ...citywideFood[0], description: "Roscioli works in the weekend route as the planned central dinner that prevents the food portion from becoming random piazza grazing. Build the evening around its deli-wine-room energy, then keep the next stop nearby because the meal already carries plenty of momentum." },
      { ...citywideFood[1], description: "Da Enzo al 29 gives the weekend a Trastevere meal with neighborhood pressure built in: a small room, Roman classics, and a queue-or-reservation rhythm. Use it when the route can absorb a wait and the point is to feel the area through dinner, not just pass through it." },
      { ...citywideCulture[2], description: "The Vatican Museums should be the weekend's timed endurance block, not an extra squeezed between casual stops. Treat the Sistine Chapel flow and gallery length as the day's main structure, then recover with food or green space instead of another major interior." },
      { ...citywideNature[0], description: "Villa Borghese gives the weekend route air after dense streets and ticketed interiors. Use it as a reset between Centro Storico, Parioli, or a Galleria Borghese booking, especially when the day needs shade more than another church." },
    ],
    sources: [...romeCultureSources, ...romeFoodSources, ...romeNatureSources],
  }),
] satisfies MapList[];

const neighborhoodFoodGuides = [
  neighborhoodGuide("Centro Storico", "Food", "Restaurants", [
    { id: "centro-roscioli", name: "Roscioli Salumeria con Cucina", coordinates: [41.8956, 12.4745], description: "Roscioli is the central reservation for travelers who want Rome's food culture in one dense room: salumi, wine, carbonara, and service that rewards planning. The value is the meal format: a tightly packed deli-restaurant where the products, wine list, and Roman classics are the point. Book ahead and use it for a deliberate Centro meal rather than a casual fallback.", price: "$$$", priceSource: "Eater / The Infatuation", photo: undefined },
    { id: "centro-armando-pantheon", name: "Armando al Pantheon", coordinates: [41.8992, 12.4772], description: "Armando al Pantheon earns its place by staying genuinely food-led in one of Rome's most tourist-heavy zones. Book ahead for classic Roman cooking within steps of the Pantheon.", price: "$$$", priceSource: "Eater / MICHELIN Guide", photo: undefined },
    { id: "centro-forno-roscioli", name: "Antico Forno Roscioli", coordinates: [41.8957, 12.4743], description: "Antico Forno Roscioli is the bakery-and-pizza stop that makes Centro work between sit-down meals. It is best for pizza bianca, quick slices, and picnic supplies before piazza wandering.", price: "$", priceSource: "The Infatuation / Google Maps", photo: "https://www.anticofornoroscioli.it/wp-content/uploads/2024/01/305035920_458860706278743_310110833753177664_n-removebg-preview-removebg-preview-2.webp" },
    { id: "centro-santeustachio", name: "Sant'Eustachio Il Caffè", coordinates: [41.8989, 12.4742], description: "Sant'Eustachio is the coffee classic to save when the route needs a fast Roman bar stop near the Pantheon. It is touristy, but still useful when treated as a quick ritual.", price: "$", priceSource: "Time Out / Google Maps", photo: undefined },
  ], "Historic-Core Meals That Hold Up", "Centro Storico rewards planning: the strongest food stops are booked, quick, or specific enough to survive the tourist pressure around the Pantheon, Campo, and Navona.", romeFoodSources),
  neighborhoodGuide("Trastevere", "Food", "Restaurants", [
    { id: "trastevere-da-enzo", name: "Da Enzo al 29", coordinates: [41.8897, 12.4746], description: "Da Enzo is the neighborhood trattoria benchmark, worth saving for travelers who want Roman classics with Trastevere energy. Go early or plan for demand.", price: "$$", priceSource: "Eater / The Infatuation", photo: undefined },
    { id: "trastevere-zia", name: "Zia Restaurant", coordinates: [41.8894, 12.4678], description: "Zia gives Trastevere a modern, reservation-led dinner that balances the area's casual trattorias. It is the pick when the trip needs one polished tasting-menu night.", price: "$$$", priceSource: "MICHELIN Guide / Google Maps", photo: undefined },
    { id: "trastevere-seu-pizza", name: "Seu Pizza Illuminati", coordinates: [41.8847, 12.4727], description: "Seu Pizza Illuminati brings destination pizza to the edge of Trastevere, useful when the neighborhood plan needs something more current than another pasta table. Seu Pizza Illuminati's value is the meal format and neighborhood fit: what to order, how formal the stop feels, and whether it solves lunch, dinner, coffee, or a snack break. Confirm Seu Pizza Illuminati's current hours and booking pressure before relying on it as the route's main meal.", price: "$$", priceSource: "Eater / The Infatuation", photo: undefined },
    { id: "trastevere-proloco", name: "Proloco Trastevere", coordinates: [41.8894, 12.4716], description: "Proloco Trastevere is a good aperitivo-to-dinner bridge for Lazio products, wine, and casual plates. It fits nights that start slowly and may turn into a bar route.", price: "$$", priceSource: "Google Maps / local editorial guides", photo: "https://static.wixstatic.com/media/a2cd2b_61dde53d94694e3c9076eb33f3e803bd~mv2.png/v1/fill/w_1181,h_853,al_c/a2cd2b_61dde53d94694e3c9076eb33f3e803bd~mv2.png" },
  ], "Pasta, Pizza, and Better Reservations", "Trastevere food works when it does not rely only on atmosphere: classic trattorias, destination pizza, Lazio products, and one polished dinner keep the neighborhood useful.", romeFoodSources),
  neighborhoodGuide("Monti", "Food", "Restaurants", [
    { id: "monti-taverna-fori", name: "La Taverna dei Fori Imperiali", coordinates: [41.8946, 12.4907], description: "La Taverna dei Fori Imperiali is the Monti classic for Roman dishes close to the ruins. It is best for travelers who want a real meal after ancient-site time without crossing town.", price: "$$", priceSource: "The Infatuation / Google Maps", photo: "https://www.latavernadeiforiimperiali.com/cucina-romana-roma-centro-storico-roman-cuisine-rome-historic-center/img/it-roma-la-taverna-dei-fori-imperiali.jpg" },
    { id: "monti-urbana-47", name: "Urbana 47", coordinates: [41.8959, 12.4934], description: "Urbana 47 fits Monti's independent, slightly design-led mood with regional ingredients and all-day flexibility. Use it when the route needs a calmer neighborhood meal.", price: "$$", priceSource: "Time Out / Google Maps", photo: undefined },
    { id: "monti-aromaticus", name: "Aromaticus Monti", coordinates: [41.895, 12.4918], description: "Aromaticus is the lighter Monti counterpoint, useful for vegetables, lunch, and a break from heavy pasta sequencing. It works especially well between shopping and Colosseum routes.", price: "$$", priceSource: "Google Maps / local editorial guides", photo: undefined },
    { id: "monti-fatamorgana", name: "Fatamorgana Monti", coordinates: [41.8958, 12.4917], description: "Fatamorgana is the gelato stop that keeps a Monti food map practical. Save it for after dinner or a midday reset rather than treating gelato as an afterthought.", price: "$", priceSource: "The Infatuation / Google Maps", photo: undefined },
  ], "Monti Meals Near the Ruins", "Monti needs food that can handle Colosseum proximity without becoming pure convenience; this set mixes Roman classics, lighter lunches, and a gelato stop worth saving.", romeFoodSources),
  neighborhoodGuide("Testaccio", "Food", "Restaurants", [
    { id: "testaccio-flavio", name: "Flavio al Velavevodetto", coordinates: [41.8765, 12.4765], description: "Flavio is the Testaccio classic for Roman pastas and offal-linked food history. The Monte Testaccio setting makes it feel rooted rather than nostalgic.", price: "$$", priceSource: "Eater / MICHELIN Guide", photo: undefined },
    { id: "testaccio-felice", name: "Felice a Testaccio", coordinates: [41.8767, 12.4751], description: "Felice is the cacio e pepe institution, best approached as a planned classic rather than a spontaneous neighborhood meal. It belongs because the dish and the district are inseparable.", price: "$$", priceSource: "Eater / The Infatuation", photo: "https://feliceatestaccio.com/wp-content/uploads/2025/03/carbonara.webp" },
    { id: "testaccio-mordi-vai", name: "Mordi e Vai", coordinates: [41.8772, 12.4756], description: "Mordi e Vai is the market sandwich stop that makes Testaccio work during the day. It is quick, specific, and tied to the neighborhood's working-food identity.", price: "$", priceSource: "Eater / Google Maps", photo: undefined },
    { id: "testaccio-linari", name: "Pasticceria Linari", coordinates: [41.8778, 12.4784], description: "Linari is the breakfast and pastry anchor, useful before the market or as a simple neighborhood reset. It gives the guide a morning option instead of only dinner classics.", price: "$", priceSource: "Google Maps / local editorial guides", photo: undefined },
  ], "The Roman Food Neighborhood", "Testaccio is the food neighborhood where market counters, pasta institutions, and working Roman history still line up in a route that makes geographic sense.", romeFoodSources),
  neighborhoodGuide("Prati", "Food", "Restaurants", [
    { id: "prati-pizzarium", name: "Bonci Pizzarium", coordinates: [41.9084, 12.4452], description: "Bonci Pizzarium is the Vatican-area lunch stop that can carry a museum day by itself. The slice format keeps it practical, but the toppings make it destination-level.", price: "$$", priceSource: "Eater / The Infatuation", photo: undefined },
    { id: "prati-sorpasso", name: "Il Sorpasso", coordinates: [41.9075, 12.4597], description: "Il Sorpasso is the Prati aperitivo-to-dinner room for travelers who want wine, salumi, and a social table after Vatican time. It is flexible without feeling like a fallback.", price: "$$", priceSource: "Eater / Google Maps", photo: undefined },
    { id: "prati-castroni", name: "Castroni", coordinates: [41.9101, 12.4646], description: "Castroni is the pantry-and-coffee institution that gives Prati a useful daytime stop. Save it for gifts, espresso, or a reset between Vatican and river routes.", price: "$", priceSource: "Google Maps / local editorial guides", photo: undefined },
    { id: "prati-romane", name: "Romanè", coordinates: [41.9128, 12.459], description: "Romanè is the neighborhood trattoria pick for Prati when the plan needs Roman cooking away from the busiest Vatican exits. It works better as dinner than a rushed museum lunch.", price: "$$", priceSource: "Eater / Google Maps", photo: undefined },
  ], "Vatican-Day Food With a Plan", "Prati food is most useful when it solves Vatican logistics: slices, aperitivo, pantry stops, and trattoria dinners that keep the day from becoming museum cafeteria math.", romeFoodSources),
  neighborhoodGuide("Garbatella", "Food", "Restaurants", [
    { id: "garbatella-ristoro-angeli", name: "Ristoro degli Angeli", coordinates: [41.8612, 12.4861], description: "Ristoro degli Angeli is the Garbatella meal to save when you want neighborhood character, Roman cooking, and a room that feels deliberately away from the central tourist circuit. Ristoro degli Angeli's value is the meal format and neighborhood fit: what to order, how formal the stop feels, and whether it solves lunch, dinner, coffee, or a snack break. Confirm Ristoro degli Angeli's current hours and booking pressure before relying on it as the route's main meal.", price: "$$", priceSource: "Google Maps / local editorial guides", photo: "https://www.ristorodegliangeli.it/wp-content/uploads/2021/04/al-Ristoro-degli-Angeli-512x512-1.png" },
    { id: "garbatella-dar-moschino", name: "Dar Moschino", coordinates: [41.8608, 12.4881], description: "Dar Moschino gives the guide a casual Roman trattoria option close to Garbatella's village-like streets. It is best for a low-key lunch or dinner built around the neighborhood itself.", price: "$$", priceSource: "Google Maps / local editorial guides", photo: undefined },
    { id: "garbatella-bar-foschi", name: "Bar Foschi", coordinates: [41.8626, 12.4875], description: "Bar Foschi is the local coffee and aperitivo anchor, useful because Garbatella needs everyday stops as much as destination restaurants. Save it for a neighborhood wander.", price: "$", priceSource: "Google Maps", photo: undefined },
    { id: "garbatella-casetta-rossa", name: "Casetta Rossa", coordinates: [41.859, 12.4882], description: "Casetta Rossa is included for its community-driven food and cultural programming, which fits Garbatella's lived-in identity. It is more local rhythm than polished reservation.", price: "$", priceSource: "Google Maps / official social channels", photo: undefined },
  ], "Residential Rome, Real Meals", "Garbatella food should feel lived-in: trattorias, bars, and community rooms that reward the trip south because they belong to the neighborhood, not to a checklist.", romeFoodSources),
  neighborhoodGuide("Celio", "Food", "Restaurants", [
    { id: "celio-li-rioni", name: "Li Rioni", coordinates: [41.8894, 12.4969], description: "Li Rioni is the Colosseum-area pizza stop that gives Celio a practical post-sightseeing meal. It is casual, close, and better used deliberately than found in a hunger panic.", price: "$$", priceSource: "Google Maps / local editorial guides", photo: undefined },
    { id: "celio-luzzi", name: "Trattoria Luzzi", coordinates: [41.8891, 12.4966], description: "Trattoria Luzzi is a chaotic, budget-friendly Celio classic for travelers who want a simple Roman meal after the Colosseum. It is not polished; that is part of the use case.", price: "$", priceSource: "Google Maps / Tripadvisor", photo: undefined },
    { id: "celio-isidoro", name: "Hostaria Isidoro", coordinates: [41.889, 12.4976], description: "Hostaria Isidoro is the more formal Celio trattoria option, useful when the route needs a seated dinner near the ancient core rather than a quick pizza or snack. Hostaria Isidoro's value is the meal format and neighborhood fit: what to order, how formal the stop feels, and whether it solves lunch, dinner, coffee, or a snack break. Confirm Hostaria Isidoro's current hours and booking pressure before relying on it as the route's main meal.", price: "$$", priceSource: "Google Maps / Tripadvisor", photo: undefined },
    { id: "celio-propaganda", name: "Caffè Propaganda", coordinates: [41.8894, 12.4951], description: "Caffe Propaganda works as a stylish cafe-to-dinner bridge by the Colosseum, especially for travelers who want drinks, dessert, or a polished pause near major sights. The value is flexibility: it can solve a coffee, aperitivo, dessert, or late bite without pulling the route away from Celio. Confirm current hours before relying on it around Colosseum ticket times.", price: "$$", priceSource: "Time Out / Google Maps", photo: undefined },
  ], "Colosseum-Area Meals With Purpose", "Celio food has to beat convenience bias; these picks give the Colosseum area quick, classic, and polished options that make sense before or after ancient-site time.", romeFoodSources),
];

const neighborhoodCultureGuides = [
  neighborhoodGuide("Centro Storico", "Culture", "Culture", [
    { id: "centro-pantheon", name: "Pantheon", coordinates: [41.8986, 12.4769], description: "The Pantheon is the essential Centro Storico stop because it explains Roman engineering, church continuity, and piazza life in one short visit. Pantheon gives the area more context than a surface-level walk, whether through architecture, collections, street history, or a quieter interior. Check Pantheon's current opening days and ticket needs, then place it where the route can slow down enough to absorb it.", photo: photos.pantheon },
    { id: "centro-piazza-navona", name: "Piazza Navona", coordinates: [41.8992, 12.4731], description: "Piazza Navona gives the route Baroque theater and everyday central-Rome pressure at once. Use it as a connector between churches, cafes, and side streets.", photo: photos.navona },
    { id: "centro-trevi", name: "Trevi Fountain", coordinates: [41.9009, 12.4833], description: "Trevi Fountain belongs because even the crowds tell the truth about Rome's spectacle. Go early or late and treat it as one beat, not the whole route.", photo: photos.trevi },
    { id: "centro-doria", name: "Galleria Doria Pamphilj", coordinates: [41.8976, 12.4813], description: "Galleria Doria Pamphilj adds palace interiors and painting depth to a neighborhood otherwise dominated by outdoor icons. It is a strong bad-weather or heat escape.", photo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Ceiling_in_Galleria_Doria_Pamphilj_%28Rome%29.jpg" },
  ], "Piazzas, Domes, and Palace Rooms", "Centro culture is dense enough to blur; this guide uses a few anchors to make the historic core readable without chasing every church facade.", romeCultureSources),
  neighborhoodGuide("Trastevere", "Culture", "Culture", [
    { id: "trastevere-santa-maria", name: "Basilica di Santa Maria in Trastevere", coordinates: [41.8894, 12.4698], description: "Santa Maria in Trastevere is the neighborhood's cultural anchor, with mosaics, piazza life, and a scale that fits before dinner or drinks. The draw is the way the church turns Trastevere from atmosphere into history, especially if you slow down inside instead of only crossing the piazza. Confirm open hours and dress expectations before planning it as the route's main interior stop.", photo: photos.trastevere },
    { id: "trastevere-villa-farnesina", name: "Villa Farnesina", coordinates: [41.8931, 12.4677], description: "Villa Farnesina brings Renaissance frescoes and a calmer cultural stop to Trastevere. It works especially well before a Janiculum or Botanical Garden walk.", photo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Villa_Farnesina%2C_Rome.jpg" },
    { id: "trastevere-museo-roma", name: "Museo di Roma in Trastevere", coordinates: [41.8898, 12.4717], description: "Museo di Roma in Trastevere gives the area social-history context instead of leaving it as only pretty lanes and nightlife. It is compact enough for a neighborhood route.", photo: photos.trastevere },
    { id: "trastevere-botanical", name: "Orto Botanico di Roma", coordinates: [41.8933, 12.4664], description: "The Botanical Garden sits on the edge of Trastevere and gives the guide a shaded cultural-landscape stop when the streets feel too tight. Orto Botanico di Roma gives the area more context than a surface-level walk, whether through architecture, collections, street history, or a quieter interior. Check Orto Botanico di Roma's current opening days and ticket needs, then place it where the route can slow down enough to absorb it.", photo: "https://upload.wikimedia.org/wikipedia/commons/2/28/Orto_botanico_-_ingresso_2704.JPG" },
  ], "Mosaics, Frescoes, and Quiet Gardens", "Trastevere culture works best when it balances famous atmosphere with real interiors: basilica mosaics, villa frescoes, social history, and green space.", romeCultureSources),
  neighborhoodGuide("Monti", "Culture", "Culture", [
    { id: "monti-santa-maria-maggiore", name: "Basilica Papale di Santa Maria Maggiore", coordinates: [41.8975, 12.4985], description: "Santa Maria Maggiore gives Monti one of Rome's major basilica interiors, making the neighborhood more than a shopping-and-dinner pocket. The value is its scale, mosaics, and position between Termini and Monti, which can anchor a route before smaller churches or food stops. Confirm current access rules and give the interior enough time to register.", photo: "https://upload.wikimedia.org/wikipedia/commons/9/99/Basilica_Papale_di_Santa_Maria_Maggiore_02.jpg" },
    { id: "monti-domus-aurea", name: "Domus Aurea", coordinates: [41.8903, 12.4955], description: "Domus Aurea is the deep-history Monti stop, best for travelers who want imperial Rome below the surface rather than only the Colosseum exterior. The value is the guided archaeological format, which makes Nero's palace feel legible instead of abstract. Check current tour days and ticket availability before building the route around it.", photo: photos.colosseum },
    { id: "monti-san-pietro-vincoli", name: "San Pietro in Vincoli", coordinates: [41.8932, 12.4922], description: "San Pietro in Vincoli earns a saved-map spot for Michelangelo's Moses and the way it hides major art on a quieter Monti slope. San Pietro in Vincoli's value is its role in the route: it adds a concrete experience, a timing choice, and a reason to save the stop rather than wander past it. Check San Pietro in Vincoli's current hours and fit it into the nearby cluster instead of treating it as a standalone errand.", photo: "https://upload.wikimedia.org/wikipedia/commons/6/63/Michelangelo%27s_Moses.jpg" },
    { id: "monti-palazzo-esposizioni", name: "Palazzo delle Esposizioni", coordinates: [41.8992, 12.4902], description: "Palazzo delle Esposizioni gives Monti a contemporary exhibition counterweight to ancient and church-heavy routes. Palazzo delle Esposizioni gives the area more context than a surface-level walk, whether through architecture, collections, street history, or a quieter interior. Check Palazzo delle Esposizioni's current opening days and ticket needs, then place it where the route can slow down enough to absorb it.", photo: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Palazzo_delle_Esposizioni_Rome.jpg" },
  ], "Basilicas and Buried Rome", "Monti's culture guide connects imperial remains, major churches, and exhibition space so the area does not become only a Colosseum approach.", romeCultureSources),
  neighborhoodGuide("Testaccio", "Culture", "Culture", [
    { id: "testaccio-macro", name: "MACRO Mattatoio", coordinates: [41.8767, 12.475], description: "MACRO Mattatoio turns Testaccio's former slaughterhouse into the neighborhood's contemporary-culture anchor. It belongs because the building history and current programming speak to each other.", photo: photos.testaccio },
    { id: "testaccio-monte", name: "Monte Testaccio", coordinates: [41.8767, 12.4776], description: "Monte Testaccio makes the district's food and trade history visible as landscape. Even when access is limited, it explains why the neighborhood eats the way it does.", photo: photos.testaccio },
    { id: "testaccio-cimitero-acattolico", name: "Non-Catholic Cemetery for Foreigners", coordinates: [41.8763, 12.4804], description: "The Non-Catholic Cemetery adds quiet literary and expatriate history near the Pyramid. It is one of Testaccio's best slow cultural stops.", photo: "https://upload.wikimedia.org/wikipedia/commons/6/62/Cimitero_acattolico_Roma.JPG" },
    { id: "testaccio-porta-san-paolo", name: "Porta San Paolo", coordinates: [41.8766, 12.4803], description: "Porta San Paolo and the Pyramid edge give Testaccio an ancient-gate frame, useful before moving toward Ostiense or the cemetery. Porta San Paolo's value is its role in the route: it adds a concrete experience, a timing choice, and a reason to save the stop rather than wander past it. Check Porta San Paolo's current hours and fit it into the nearby cluster instead of treating it as a standalone errand.", photo: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Porta_San_Paolo_Rome.jpg" },
  ], "Mattatoio, Monte, and Memory", "Testaccio culture is material: amphora hill, slaughterhouse reuse, cemetery quiet, and ancient edges that explain the neighborhood's food and working-city identity.", romeCultureSources),
  neighborhoodGuide("Prati", "Culture", "Culture", [
    { id: "prati-vatican-museums", name: "Vatican Museums", coordinates: [41.9065, 12.4536], description: "The Vatican Museums are the Prati heavyweight and need their own time block. Book ahead and build the rest of the neighborhood around recovery, not more rushing.", photo: photos.vatican },
    { id: "prati-st-peters", name: "St. Peter's Basilica", coordinates: [41.9022, 12.4539], description: "St. Peter's gives Prati its clearest landmark pull, but the visit works best when security lines and dress code are part of the plan.", photo: photos.vatican },
    { id: "prati-castel-santangelo", name: "Castel Sant'Angelo", coordinates: [41.9031, 12.4663], description: "Castel Sant'Angelo links Vatican routes back to the river and historic core. The terrace view makes it useful at the end of a museum-heavy day.", photo: "https://upload.wikimedia.org/wikipedia/commons/5/51/RomaCastelSantAngelo.jpg" },
    { id: "prati-palazzo-giustizia", name: "Palazzo di Giustizia", coordinates: [41.9037, 12.4717], description: "Palazzo di Giustizia is a useful Prati orientation point, giving the district civic scale before the route turns toward food, bars, or the river. The draw is architectural presence rather than an interior visit: it helps explain Prati's formal grid and riverfront character. Use it as a route marker between Castel Sant'Angelo, the river, and nearby aperitivo stops.", photo: "https://upload.wikimedia.org/wikipedia/commons/7/74/Palazzo_di_Giustizia_%28Rome%29.jpg" },
  ], "Vatican Scale and River Edges", "Prati culture is about pacing the Vatican correctly, then using the river and civic grid to make the area feel like a neighborhood instead of a queue.", romeCultureSources),
  neighborhoodGuide("Garbatella", "Culture", "Culture", [
    { id: "garbatella-alberghi-suburbani", name: "Alberghi Suburbani", coordinates: [41.8624, 12.4886], description: "The Alberghi Suburbani give Garbatella its urban-planning identity: courtyards, social housing history, and village-like streets that reward slow looking. The value is architectural context, especially if you walk slowly enough to notice stairways, gardens, and shared spaces. Pair it with Palladium or a local meal so the area reads as a lived district, not just a detour.", photo: undefined },
    { id: "garbatella-teatro-palladium", name: "Teatro Palladium", coordinates: [41.8604, 12.4887], description: "Teatro Palladium is the neighborhood's performance anchor, useful for understanding Garbatella as a lived cultural district rather than a scenic detour. Teatro Palladium gives the area more context than a surface-level walk, whether through architecture, collections, street history, or a quieter interior. Check Teatro Palladium's current opening days and ticket needs, then place it where the route can slow down enough to absorb it.", photo: undefined },
    { id: "garbatella-centrale-montemartini", name: "Centrale Montemartini", coordinates: [41.8691, 12.4775], description: "Centrale Montemartini sits on the Ostiense edge, pairing classical sculpture with industrial architecture. It is the strongest nearby museum for a Garbatella route.", photo: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Centrale_Montemartini_08.jpg" },
    { id: "garbatella-san-paolo", name: "Basilica Papale San Paolo fuori le Mura", coordinates: [41.8587, 12.477], description: "San Paolo fuori le Mura is just outside Garbatella but gives the area a major basilica counterweight to central Rome. It works well with an Ostiense/Garbatella day.", photo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/San_Paolo_fuori_le_mura_Rome.jpg" },
  ], "Garden-City Rome and Industrial Edges", "Garbatella culture is about planning history, courtyards, local theaters, and the Ostiense edge rather than the standard ancient-center circuit.", romeCultureSources),
  neighborhoodGuide("Celio", "Culture", "Culture", [
    { id: "celio-colosseum", name: "Colosseum", coordinates: [41.8902, 12.4922], description: "The Colosseum is Celio's unavoidable anchor, but it works best as part of a timed ancient-city block rather than a standalone photo stop. Colosseum gives the area more context than a surface-level walk, whether through architecture, collections, street history, or a quieter interior. Check Colosseum's current opening days and ticket needs, then place it where the route can slow down enough to absorb it.", photo: photos.colosseum },
    { id: "celio-roman-forum", name: "Roman Forum and Palatine Hill", coordinates: [41.8925, 12.4853], description: "The Forum and Palatine give the Colosseum context, turning the route into urban history instead of spectacle alone. Leave room for walking and heat.", photo: photos.colosseum },
    { id: "celio-san-clemente", name: "Basilica di San Clemente", coordinates: [41.8894, 12.4975], description: "San Clemente is the layered Rome stop par excellence, with church levels and archaeology that make Celio feel deeper than the arena crowds suggest. Basilica di San Clemente gives the area more context than a surface-level walk, whether through architecture, collections, street history, or a quieter interior. Check Basilica di San Clemente's current opening days and ticket needs, then place it where the route can slow down enough to absorb it.", photo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Basilica_di_San_Clemente_al_Laterano_-_Rome.jpg" },
    { id: "celio-santo-stefano", name: "Santo Stefano Rotondo", coordinates: [41.8845, 12.4964], description: "Santo Stefano Rotondo is the quieter circular church stop, good for travelers who want Celio's religious architecture without another major crowd. The value is its unusual plan and calm interior, which contrast sharply with the Colosseum flow nearby. Confirm current hours and fit it into a Celio walk rather than treating it as a separate cross-town errand.", photo: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Santo_Stefano_Rotondo_Rome.jpg" },
  ], "Ancient Rome Beyond the Arena", "Celio's culture guide keeps the Colosseum in context with the Forum, layered churches, and quieter streets that make the ancient core feel less one-note.", romeCultureSources),
];

const neighborhoodNightlifeGuides = [
  neighborhoodGuide("Centro Storico", "Nightlife", "Bars", [
    { id: "centro-bar-fico", name: "Bar del Fico", coordinates: [41.8985, 12.4709], description: "Bar del Fico is the Centro piazza-drink standby, useful when the night should stay near Navona without becoming a formal cocktail plan. The value is location and casual energy: it works as a first drink, meeting point, or low-commitment nightcap. Confirm current hours and expect the area to feel busy rather than hidden.", price: "$$", priceSource: "Google Maps", photo: undefined },
    { id: "centro-salotto-42", name: "Salotto 42", coordinates: [41.899, 12.4791], description: "Salotto 42 gives the Pantheon area a stylish aperitivo/cocktail room that works before dinner or as a polished nightcap. Salotto 42's draw is the specific night use: what kind of crowd, drink format, and energy it adds to the neighborhood. Go to Salotto 42 when that mood fits the route, and confirm current hours or event programming before building the evening around it.", price: "$$", priceSource: "Time Out / Google Maps", photo: undefined },
    { id: "centro-jerry-thomas", name: "The Jerry Thomas Speakeasy", coordinates: [41.8961, 12.4711], description: "Jerry Thomas is the reservation-minded cocktail stop for travelers who want Centro nightlife with intention rather than wandering into the nearest piazza bar. The value is a focused cocktail format and a room that rewards planning. Confirm current booking rules, entry details, and opening days before building the evening around it.", price: "$$$", priceSource: "Time Out / Google Maps", photo: undefined },
  ], "Piazza Drinks and Cocktail Rooms", "Centro nightlife is best when it is selective: a piazza standby, one polished aperitivo room, and one serious cocktail plan.", romeNightlifeSources),
  neighborhoodGuide("Trastevere", "Nightlife", "Bars", [
    { id: "trastevere-freni", name: "Freni e Frizioni", coordinates: [41.8894, 12.4714], description: "Freni e Frizioni is the aperitivo anchor that turns Trastevere's social energy into an actual first stop. The value is its crowd, spritz rhythm, and easy placement before dinner or a longer bar route. Go when you want atmosphere more than quiet, and confirm current hours before relying on it early in the evening.", price: "$$", priceSource: "Time Out / Google Maps", photo: undefined },
    { id: "trastevere-ma-che", name: "Ma Che Siete Venuti a Fà", coordinates: [41.8896, 12.4733], description: "Ma Che Siete Venuti a Fa gives the neighborhood a beer-focused stop amid wine bars and piazza drinks. Ma Che Siete Venuti a Fà's draw is the specific night use: what kind of crowd, drink format, and energy it adds to the neighborhood. Go to Ma Che Siete Venuti a Fà when that mood fits the route, and confirm current hours or event programming before building the evening around it.", price: "$$", priceSource: "The Infatuation / Google Maps", photo: undefined },
    { id: "trastevere-enoteca-ferrara", name: "Enoteca Ferrara", coordinates: [41.889, 12.4707], description: "Enoteca Ferrara is the wine-led Trastevere option for travelers who want a slower drink with food context rather than only bar spillover. The value is a more seated, bottle-and-glass rhythm that can work before dinner or as the night itself. Confirm current hours and whether you want a reservation if the evening depends on it.", price: "$$", priceSource: "Google Maps / local editorial guides", photo: undefined },
  ], "Aperitivo, Beer, and Wine Lanes", "Trastevere nightlife can be chaotic, so this set gives it structure: aperitivo crowds, serious beer, and a wine room that can carry a slower evening.", romeNightlifeSources),
  neighborhoodGuide("Monti", "Nightlife", "Bars", [
    { id: "monti-blackmarket", name: "Blackmarket Hall", coordinates: [41.8944, 12.4916], description: "Blackmarket Hall is Monti's late-room pick for cocktails, music, and a moodier alternative to open-air piazza drinking. Blackmarket Hall's draw is the specific night use: what kind of crowd, drink format, and energy it adds to the neighborhood. Go to Blackmarket Hall when that mood fits the route, and confirm current hours or event programming before building the evening around it.", price: "$$", priceSource: "Time Out / Google Maps", photo: "https://www.blackmarkethall.com/blackmarkethall.png" },
    { id: "monti-ai-tre-scalini", name: "Ai Tre Scalini", coordinates: [41.8955, 12.4913], description: "Ai Tre Scalini is the wine-bar/trattoria bridge that makes Monti nights easy to start without committing to a full bar crawl. Ai Tre Scalini's draw is the specific night use: what kind of crowd, drink format, and energy it adds to the neighborhood. Go to Ai Tre Scalini when that mood fits the route, and confirm current hours or event programming before building the evening around it.", price: "$$", priceSource: "Google Maps / local editorial guides", photo: undefined },
    { id: "monti-charity-cafe", name: "Charity Café", coordinates: [41.8952, 12.4927], description: "Charity Cafe adds live music and a low-key bar rhythm to the Monti set, useful when the night should stay local after dinner. The value is programming and atmosphere rather than landmark scenery, so it works best when music is part of the plan. Confirm current event listings before making it the anchor of the evening.", price: "$$", priceSource: "Google Maps / venue listings", photo: undefined },
  ], "Monti After the Ruins", "Monti nightlife is small-scale and walkable: wine, cocktails, and music rooms that make sense after Colosseum-area dinners.", romeNightlifeSources),
  neighborhoodGuide("Testaccio", "Nightlife", "Bars", [
    { id: "testaccio-tram-depot", name: "Tram Depot", coordinates: [41.8792, 12.4782], description: "Tram Depot is Testaccio's outdoor aperitivo and cocktail stop, especially useful in warm weather when the neighborhood needs a casual first drink. Tram Depot's draw is the specific night use: what kind of crowd, drink format, and energy it adds to the neighborhood. Go to Tram Depot when that mood fits the route, and confirm current hours or event programming before building the evening around it.", price: "$$", priceSource: "Google Maps / local editorial guides", photo: undefined },
    { id: "testaccio-rec23", name: "Rec 23", coordinates: [41.8769, 12.4762], description: "Rec 23 gives Testaccio a flexible drinks-and-food room near the market, good for groups that want cocktails without leaving the district. Rec 23's draw is the specific night use: what kind of crowd, drink format, and energy it adds to the neighborhood. Go to Rec 23 when that mood fits the route, and confirm current hours or event programming before building the evening around it.", price: "$$", priceSource: "Google Maps", photo: undefined },
    { id: "testaccio-lalibi", name: "L'Alibi", coordinates: [41.8761, 12.4783], description: "L'Alibi represents Testaccio's late club edge, useful for travelers who specifically want a later, louder night rather than aperitivo only. The value is its role in the neighborhood's after-dark history and its fit for a plan that starts with dinner nearby. Confirm current event nights and entry details before relying on it as the late stop.", price: "$$", priceSource: "Resident Advisor / Google Maps", photo: undefined },
  ], "Aperitivo to Late Testaccio", "Testaccio nightlife has range: outdoor drinks, group-friendly cocktails, and a late club edge tied to the district's post-dinner energy.", romeNightlifeSources),
  neighborhoodGuide("Prati", "Nightlife", "Bars", [
    { id: "prati-be-re", name: "Be.Re.", coordinates: [41.9065, 12.4588], description: "Be.Re. is Prati's craft-beer anchor, especially useful after Vatican Museums when the plan needs something casual and current.", price: "$$", priceSource: "Google Maps / beer guides", photo: undefined },
    { id: "prati-chorus", name: "Chorus Café", coordinates: [41.9036, 12.4628], description: "Chorus Cafe gives Prati a polished cocktail room near the Vatican approach, better for a seated drink than a pub crawl. Chorus Café's draw is the specific night use: what kind of crowd, drink format, and energy it adds to the neighborhood. Go to Chorus Café when that mood fits the route, and confirm current hours or event programming before building the evening around it.", price: "$$$", priceSource: "Time Out / Google Maps", photo: undefined },
    { id: "prati-sorpasso-bar", name: "Il Sorpasso", coordinates: [41.9075, 12.4597], description: "Il Sorpasso works as the wine-and-aperitivo pick, bridging Prati's restaurant scene with a relaxed first-drink plan. Il Sorpasso's draw is the specific night use: what kind of crowd, drink format, and energy it adds to the neighborhood. Go to Il Sorpasso when that mood fits the route, and confirm current hours or event programming before building the evening around it.", price: "$$", priceSource: "Eater / Google Maps", photo: undefined },
  ], "After the Vatican", "Prati nightlife is best as decompression after museum or basilica time: beer, wine, and cocktails without crossing back into the old-city crush.", romeNightlifeSources),
  neighborhoodGuide("Garbatella", "Nightlife", "Bars", [
    { id: "garbatella-la-mescita", name: "La Mescita", coordinates: [41.8611, 12.4873], description: "La Mescita is a neighborhood wine-bar pick for Garbatella, useful when the night should feel local and low-pressure. La Mescita's draw is the specific night use: what kind of crowd, drink format, and energy it adds to the neighborhood. Go to La Mescita when that mood fits the route, and confirm current hours or event programming before building the evening around it.", price: "$$", priceSource: "Google Maps", photo: undefined },
    { id: "garbatella-vinile", name: "Vinile", coordinates: [41.862, 12.487], description: "Vinile gives Garbatella a music-and-drinks option that fits the district's lived-in, residential rhythm better than a central cocktail room would. Vinile's draw is the specific night use: what kind of crowd, drink format, and energy it adds to the neighborhood. Go to Vinile when that mood fits the route, and confirm current hours or event programming before building the evening around it.", price: "$$", priceSource: "Google Maps / venue listings", photo: undefined },
    { id: "garbatella-30-formiche", name: "30 Formiche", coordinates: [41.8796, 12.5153], description: "30 Formiche is outside Garbatella proper, but it is a useful southeast-Rome live-music fallback when the night needs programming rather than another wine bar. 30 Formiche's draw is the specific night use: what kind of crowd, drink format, and energy it adds to the neighborhood. Go to 30 Formiche when that mood fits the route, and confirm current hours or event programming before building the evening around it.", price: "$", priceSource: "Resident Advisor / Google Maps", photo: undefined },
  ], "Local Wine and Southeast-Rome Music", "Garbatella nights should stay honest: local drinks first, then a nearby live-music option if the route needs more than a neighborhood bar.", romeNightlifeSources),
  neighborhoodGuide("Celio", "Nightlife", "Bars", [
    { id: "celio-coming-out", name: "Coming Out", coordinates: [41.8896, 12.4955], description: "Coming Out is the Celio/Colosseum LGBTQ+ bar anchor, useful for drinks with a landmark view and a more social edge than the surrounding tourist bars. The value is its identity, location, and easy fit after ancient-site days. Confirm current hours and event rhythm before planning a later night around it.", price: "$$", priceSource: "Google Maps / local nightlife guides", photo: undefined },
    { id: "celio-shamrock", name: "Shamrock Irish Pub Colosseum", coordinates: [41.8901, 12.4938], description: "Shamrock is the practical pub option near the Colosseum, best when a group wants beer, screens, and an easy meeting point. Shamrock Irish Pub Colosseum's draw is the specific night use: what kind of crowd, drink format, and energy it adds to the neighborhood. Go to Shamrock Irish Pub Colosseum when that mood fits the route, and confirm current hours or event programming before building the evening around it.", price: "$$", priceSource: "Google Maps", photo: undefined },
    { id: "celio-propaganda-bar", name: "Caffè Propaganda", coordinates: [41.8894, 12.4951], description: "Caffe Propaganda is the polished Celio drink-and-dessert option, useful for a calmer nightcap after ancient-site days. Caffè Propaganda's draw is the specific night use: what kind of crowd, drink format, and energy it adds to the neighborhood. Go to Caffè Propaganda when that mood fits the route, and confirm current hours or event programming before building the evening around it.", price: "$$", priceSource: "Time Out / Google Maps", photo: undefined },
  ], "Colosseum Drinks Without Drifting", "Celio nightlife is compact: a queer landmark bar, an easy pub, and a polished nightcap keep the area useful after sightseeing.", romeNightlifeSources),
];

const romeNeighborhoodStayGuides = [
  stayGuide("Centro Storico", "Hotels", hotelStops.centro, "Central Hotels for Walkable Rome", "Centro hotels are about convenience with tradeoffs: premium prices, heavy foot traffic, and unmatched access to Pantheon, Campo, Trevi, and late dinners."),
  stayGuide("Centro Storico", "Hostels", hostelStops.centro, "Hostel Bases Near the Historic Core", "True Centro hostels are limited, so this guide uses the strongest nearby hostel operations that honestly serve the historic core by foot or quick transit."),
  stayGuide("Trastevere", "Hotels", hotelStops.trastevere, "Courtyards and Quieter Corners", "Trastevere hotels work best when they keep the neighborhood's dinner energy close but protect sleep with courtyards, upper-lane calm, or modern room standards."),
  stayGuide("Trastevere", "Hostels", hostelStops.trastevere, "Social Stays for Trastevere Nights", "Trastevere hostel supply is thin, so the strongest picks balance one local option with better-supported hostel bases for travelers using the area mainly at night."),
  stayGuide("Monti", "Hotels", hotelStops.monti, "Boutique Bases by Ancient Rome", "Monti hotels are ideal when ruins, Termini, and independent neighborhood life all matter; the best choices stay small-scale rather than resort-like."),
  stayGuide("Monti", "Hostels", hostelStops.monti, "Dorms Near Monti and the Colosseum", "Monti is one of Rome's better hostel zones because Colosseum access, Termini logistics, and evening bars can all work without a long commute."),
  stayGuide("Testaccio", "Hotels", hotelStops.testaccio, "Sleep Near the Food Neighborhood", "Testaccio hotels are practical and quieter than Centro; the point is market access, trattoria nights, and Aventine/Ostiense edges rather than postcard views."),
  stayGuide("Testaccio", "Hostels", hostelStops.testaccio, "Budget Bases for Testaccio Routes", "There are few pure Testaccio hostels, so this guide favors nearby bases that support food-led evenings without pretending every bed is in the neighborhood."),
  stayGuide("Prati", "Hotels", hotelStops.prati, "Vatican-Side Hotels With Breathing Room", "Prati hotels are about Vatican access, calmer streets, and river walks; choose them when museum timing and sleep quality matter more than old-city romance."),
  stayGuide("Prati", "Hostels", hostelStops.prati, "Hostel Options for Vatican Days", "Prati has limited hostel density, so this guide separates the closest hostel-style stays from stronger social bases that still work for Vatican itineraries."),
  stayGuide("Garbatella", "Hotels", hotelStops.garbatella, "Value Bases South of the Center", "Garbatella-area hotels are for travelers who want value, transit, and southeast Rome access more than central sightseeing convenience."),
  stayGuide("Garbatella", "Hostels", hostelStops.garbatella, "Budget Beds for Southeast Rome", "Garbatella is not a hostel-heavy district, so these picks are honest nearby options for budget travelers using the neighborhood as a food or culture route."),
  stayGuide("Celio", "Hotels", hotelStops.celio, "Sleep Beside Ancient Rome", "Celio hotels make sense when Colosseum access is the point, with choices ranging from landmark-view splurge to practical midrange rooms."),
  stayGuide("Celio", "Hostels", hostelStops.celio, "Hostels Around the Colosseum", "Celio is one of the easier Rome areas for hostel travelers because Monti, Termini, and the Colosseum corridor create a useful cluster of budget beds."),
] satisfies MapList[];

export const romeGuides = [
  ...romeCoreGuides,
  ...neighborhoodFoodGuides,
  ...neighborhoodCultureGuides,
  ...neighborhoodNightlifeGuides,
  ...romeNeighborhoodStayGuides,
] satisfies MapList[];
