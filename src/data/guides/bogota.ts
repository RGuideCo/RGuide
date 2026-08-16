import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";

const createdAt = "2026-08-04T00:00:00.000Z";
const checkedAt = "2026-08-04";

const bogotaLocation = {
  city: "Bogota",
  country: "Colombia",
  continent: "South America",
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
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName)}`;
}

const schedule = {
  reservation: {
    default:
      "Service days, seating times, and closure dates are published in the restaurant's official booking calendar.",
  },
  hotel: {
    default:
      "Open 24 hours daily; check-in, check-out, breakfast, restaurant, and spa windows follow the official property schedule.",
  },
  hostel: {
    default:
      "Open 24 hours daily; reception coverage, check-in, check-out, breakfast, and activity times follow the official property schedule.",
  },
  event: {
    default:
      "Door time, closing time, and ticketed programming are published for each date in the venue's official event calendar.",
  },
  ticket: {
    default:
      "Opening sessions, timed entry, and closure dates are published in the attraction's official timed-ticket calendar.",
  },
};

type StopInput = Partial<GuideStop> & {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  neighborhood: string;
  sourcePhoto: string;
  editorialUrls?: string[];
  platformUrls?: string[];
  mapQuery?: string;
};

function stop(input: StopInput): GuideStop {
  const {
    id,
    name,
    coordinates,
    description,
    neighborhood,
    sourcePhoto,
    editorialUrls = [],
    platformUrls = [],
    mapQuery,
    sourceEvidence,
    sourceUrls: extraUrls = [],
    officialUrl,
    bookingUrl,
    ...rest
  } = input;
  const mapUrl = sourceEvidence?.mapUrl ?? maps(mapQuery ?? `${name} Bogota Colombia`);
  const officialEvidence = sourceEvidence?.officialUrl ?? officialUrl ?? bookingUrl ?? platformUrls[0];
  const sourceUrls = [
    officialEvidence,
    bookingUrl,
    mapUrl,
    sourcePhoto,
    ...editorialUrls,
    ...platformUrls,
    ...extraUrls,
  ].filter(Boolean) as string[];

  return {
    id,
    poiId: input.poiId ?? `bogota-venue-${id.replace(/^bogota-/, "")}`,
    name,
    coordinates,
    description,
    subcategory: neighborhood,
    photo: sourcePhoto,
    imageSourceUrl: sourcePhoto,
    imageSourceName: sourcePhoto.includes("wikimedia")
      ? "Wikimedia Commons"
      : "Venue, government, or editorial source",
    sourceUrls: [...new Set(sourceUrls)],
    sourceEvidence: {
      officialUrl: officialEvidence,
      mapUrl,
      currentStatusUrl: mapUrl,
      imageSourceUrl: sourcePhoto,
      editorialUrls,
      platformUrls,
      checkedAt,
      notes:
        "Venue-controlled, government, current editorial, or booking evidence and a current map listing were reviewed; no permanent-closure notice was found.",
      ...sourceEvidence,
    },
    ...(officialUrl ? { officialUrl } : {}),
    ...(bookingUrl ? { bookingUrl } : {}),
    ...rest,
  };
}

function food(input: StopInput): GuideStop {
  return stop({
    category: "Food",
    venueKind: "food_drink",
    foodServiceType: "restaurant",
    cuisineTypes: ["Colombian"],
    attributeTags: ["local-flavors", "source-backed"],
    priceSource: input.officialUrl ?? input.sourceEvidence?.officialUrl,
    ...input,
  });
}

function lodging(input: StopInput): GuideStop {
  return stop({
    category: "Stay",
    venueKind: "lodging",
    attributeTags: ["bookable", "source-backed"],
    priceSource: input.bookingUrl ?? input.officialUrl ?? input.sourceEvidence?.officialUrl,
    ...input,
  });
}

function nightlife(input: StopInput): GuideStop {
  return stop({
    category: "Nightlife",
    venueKind: "nightlife",
    attributeTags: ["evening", "source-backed"],
    priceSource: input.officialUrl ?? input.sourceEvidence?.officialUrl,
    ...input,
  });
}

function place(input: StopInput): GuideStop {
  return stop({ attributeTags: ["source-backed", "daytime"], ...input });
}

const diningStops: GuideStop[] = [
  food({
    id: "bogota-dining-el-chato", name: "El Chato", neighborhood: "Chapinero Alto", coordinates: [4.6479292, -74.0570554],
    description: "Álvaro Clavijo builds a lively Colombian tasting menu from small-producer ingredients, whole-animal cooking, ferments, and wild or overlooked plants. It is polished without becoming hushed, and the shorter à la carte route keeps Latin America's 2025 number-one restaurant useful beyond milestone dinners.",
    cuisineTypes: ["Colombian", "contemporary"], attributeTags: ["tasting-menu", "small-producers", "reservation-recommended"], price: "$$$$",
    hours: { mon: "2:00 PM-11:00 PM", tue: "2:00 PM-11:00 PM", wed: "12:00 PM-11:00 PM", thu: "12:00 PM-11:00 PM", fri: "12:00 PM-11:00 PM", sat: "12:00 PM-11:00 PM", sun: "12:00 PM-5:00 PM" },
    officialUrl: "https://elchato.co/", bookingUrl: "https://elchato.co/", sourcePhoto: "https://uploads.grupodicas.com/2024/01/El-Chato.webp",
    editorialUrls: ["https://www.theworlds50best.com/discovery/Establishments/Colombia/Bogot%C3%A1/El-Chato.html"],
  }),
  food({
    id: "bogota-dining-leo", name: "LEO", neighborhood: "Chapinero Alto", coordinates: [4.6493, -74.0567],
    description: "Leonor Espinosa and Laura Hernández map Colombia's biological and cultural diversity through 5-, 8-, and 12-course experiences. Ingredients from Indigenous and rural communities arrive with context rather than spectacle, while the adjoining La Sala de Laura handles the liquid biodiversity.",
    cuisineTypes: ["Colombian", "tasting-menu"], attributeTags: ["biodiversity", "tasting-menu", "special-occasion"], price: "$$$$",
    hours: { mon: "12:00 PM-3:00 PM; 6:00 PM-11:00 PM", tue: "12:00 PM-3:00 PM; 6:00 PM-11:00 PM", wed: "12:00 PM-3:00 PM; 6:00 PM-11:00 PM", thu: "12:00 PM-3:00 PM; 6:00 PM-11:00 PM", fri: "12:00 PM-3:00 PM; 6:00 PM-11:00 PM", sat: "12:00 PM-3:00 PM; 6:00 PM-11:00 PM", sun: "Closed" },
    officialUrl: "https://restauranteleo.com/en/leo-eng/", bookingUrl: "https://restauranteleo.com/en/reservations/", sourcePhoto: "https://restauranteleo.com/wp-content/uploads/2024/04/sala-leo-02.jpg",
    editorialUrls: ["https://www.theworlds50best.com/discovery/Establishments/Colombia/Bogot%C3%A1/Leo.html"],
  }),
  food({
    id: "bogota-dining-humo-negro", name: "Humo Negro", neighborhood: "Chapinero Alto", coordinates: [4.6484, -74.0558],
    description: "Smoke, fermentation, and Japanese technique meet Colombian products in a dark, counter-focused room. The menu changes aggressively and lands best for diners who want creative small plates and controlled bitterness rather than a conventional sequence of regional classics.",
    cuisineTypes: ["Colombian", "Japanese-influenced", "contemporary"], attributeTags: ["fermentation", "wood-fire", "small-plates"], price: "$$$", hours: schedule.reservation,
    officialUrl: "https://humonegrobog.com/", bookingUrl: "https://humonegrobog.com/", sourcePhoto: "https://images.squarespace-cdn.com/content/v1/64f0e9116a1d005eda52a7b4/e644dd42-b47a-4213-b655-d5ed4a65b370/Humo+Negro+Restaurante.png?format=1500w",
    editorialUrls: ["https://www.theworlds50best.com/latinamerica/en/the-list/humo-negro.html"],
  }),
  food({
    id: "bogota-dining-prudencia", name: "Prudencia", neighborhood: "La Candelaria", coordinates: [4.5957783, -74.0706185],
    description: "A restored colonial house, glass-roofed dining room, and wood-fired kitchen frame a slow seven-course lunch. Mario Rosero and Meghan Flanigan connect preservation, smoke, low waste, and countryside techniques; reserve enough time because the meal is intentionally unhurried.",
    cuisineTypes: ["Colombian", "wood-fired", "set-menu"], attributeTags: ["lunch-only", "heritage-building", "slow-dining"], price: "$$$",
    hours: { mon: "Closed", tue: "Closed", wed: "12:00 PM-4:00 PM", thu: "12:00 PM-4:00 PM", fri: "12:00 PM-4:00 PM", sat: "12:00 PM-4:00 PM", sun: "12:00 PM-4:00 PM", default: "Prudencia posts staff-vacation and private-event closures through its official reservation channel." },
    officialUrl: "https://www.prudencia.net/english-1", bookingUrl: "https://www.prudencia.net/english-1", sourcePhoto: "https://images.squarespace-cdn.com/content/v1/563d438ee4b09984364bdbee/1576165228532-F7NDB5ULP6P7RLOV1EVS/PrudenciaEspacio8.jpg",
  }),
  food({
    id: "bogota-dining-mesa-franca", name: "Mesa Franca", neighborhood: "Chapinero Alto", coordinates: [4.6409652, -74.0619518],
    description: "A warm neighborhood dining room turns Colombian ingredients into shareable plates with confident sauces and a strong natural-wine list. The menu is contemporary but generous, making it a better choice for a sociable dinner than a choreographed tasting-menu marathon.",
    cuisineTypes: ["Colombian", "contemporary", "small-plates"], attributeTags: ["sharing-plates", "natural-wine", "neighborhood-restaurant"], price: "$$$",
    hours: { mon: "Closed", tue: "7:00 PM-10:00 PM", wed: "12:00 PM-4:00 PM; 7:00 PM-10:00 PM", thu: "12:00 PM-4:00 PM; 7:00 PM-10:00 PM", fri: "12:00 PM-4:00 PM; 7:00 PM-11:00 PM", sat: "1:00 PM-11:00 PM", sun: "1:00 PM-5:00 PM" },
    officialUrl: "https://www.restaurantemesafranca.com/", bookingUrl: "https://www.restaurantemesafranca.com/", sourcePhoto: "https://static.wixstatic.com/media/571f96_d92430fd969d4963ba530e16dee07a8d~mv2.jpg",
  }),
  food({
    id: "bogota-dining-mini-mal", name: "Mini-Mal", neighborhood: "Chapinero", coordinates: [4.6424862, -74.0603931],
    description: "Mini-Mal has spent decades connecting urban diners with ingredients and food knowledge from Colombia's Pacific, Amazonian, Caribbean, and Andean regions. It remains especially useful for first encounters with native fruits, coastal herbs, community products, and thoughtful vegetarian cooking.",
    cuisineTypes: ["Colombian", "regional", "vegetarian-friendly"], attributeTags: ["biodiversity", "community-producers", "vegetarian-friendly"], price: "$$",
    hours: { mon: "Closed", tue: "12:00 PM-3:00 PM; 7:00 PM-10:00 PM", wed: "12:00 PM-3:00 PM; 7:00 PM-10:00 PM", thu: "12:00 PM-3:00 PM; 7:00 PM-10:00 PM", fri: "12:00 PM-10:00 PM", sat: "12:00 PM-10:00 PM", sun: "12:00 PM-5:00 PM" },
    officialUrl: "https://mini-mal.org/", sourcePhoto: "https://mini-mal.org/wp-content/uploads/2019/05/fondo0.jpg",
  }),
  food({
    id: "bogota-dining-harry-sasson", name: "Harry Sasson", neighborhood: "El Nogal", coordinates: [4.6603, -74.0546],
    description: "Harry Sasson's landmark occupies a handsome red-brick mansion with a glass dining pavilion and broad Colombian-international menu. Precise grilling, seafood, local produce, and deep service experience make it dependable for mixed groups even when diners want very different things.",
    cuisineTypes: ["Colombian", "grill", "international"], attributeTags: ["special-occasion", "heritage-building", "large-groups"], price: "$$$$", hours: schedule.reservation,
    officialUrl: "https://harrysasson.com/pages/bogota", bookingUrl: "https://harrysasson.com/pages/bogota", sourcePhoto: "https://harrysasson.com/cdn/shop/files/HSASSON_30_11x9-01.png?height=628&pad_color=ffffff&v=1753873503&width=1200",
  }),
  food({
    id: "bogota-dining-salvo-patria", name: "Salvo Patria", neighborhood: "Chapinero Alto", coordinates: [4.6436, -74.0601],
    description: "Salvo Patria channels seasonal Colombian produce through a casual, chef-driven format: vegetables, seafood, ferments, and smoke share space with serious coffee. It works equally well as a substantial lunch or relaxed dinner, with fewer ceremonial edges than the city's tasting counters.",
    cuisineTypes: ["Colombian", "seasonal", "contemporary"], attributeTags: ["seasonal-menu", "specialty-coffee", "casual"], price: "$$$", hours: schedule.reservation,
    officialUrl: "https://salvopatria.com/", bookingUrl: "https://salvopatria.com/", sourcePhoto: "https://salvopatria.com/wp-content/uploads/2026/01/BannerPrincipal-scaled.jpg",
    editorialUrls: ["https://salvopatria.com/wp-content/uploads/2026/01/Carta-SP-Espanol.pdf"],
  }),
  food({
    id: "bogota-dining-abasto", name: "Abasto Quinta Camacho", neighborhood: "Quinta Camacho", coordinates: [4.6512, -74.0608],
    description: "Abasto's bright Quinta Camacho house turns small-farm produce into breakfasts and generous Colombian lunches. Arepas, eggs, soups, rice dishes, and baked goods feel rooted in the market rather than styled as nostalgia; the daytime schedule rewards an early start.",
    cuisineTypes: ["Colombian", "breakfast", "market-driven"], attributeTags: ["breakfast", "small-producers", "daytime"], price: "$$",
    hours: { mon: "7:00 AM-4:00 PM", tue: "7:00 AM-4:00 PM", wed: "7:00 AM-4:00 PM", thu: "7:00 AM-4:00 PM", fri: "7:00 AM-4:00 PM", sat: "8:00 AM-4:30 PM", sun: "8:00 AM-4:30 PM" },
    officialUrl: "https://abasto.com.co/", sourcePhoto: "https://abasto.com.co/wp-content/uploads/2024/01/IMG_3996-300x300.jpg",
  }),
  food({
    id: "bogota-dining-oda", name: "Oda Restaurante", neighborhood: "Chapinero", coordinates: [4.6533, -74.0582],
    description: "Oda treats Colombia's plant diversity as a working pantry, sourcing from an urban garden and small producers while giving vegetables genuine structural weight. The polished room and adjoining Apotecario bar make it particularly effective for dinner that can continue into cocktails.",
    cuisineTypes: ["Colombian", "plant-forward", "contemporary"], attributeTags: ["urban-garden", "plant-forward", "cocktail-bar"], price: "$$$",
    hours: { mon: "Closed", tue: "12:00 PM-10:00 PM", wed: "12:00 PM-10:00 PM", thu: "12:00 PM-10:00 PM", fri: "12:00 PM-10:00 PM", sat: "12:00 PM-10:00 PM", sun: "12:00 PM-5:00 PM" },
    officialUrl: "https://www.odarestaurante.com/en/", bookingUrl: "https://www.odarestaurante.com/en/", sourcePhoto: "https://static.wixstatic.com/media/e0504a_dc0e195b45da4f79950da4e84ca8d78f~mv2.jpg",
  }),
];

const cheapEatStops: GuideStop[] = [
  food({
    id: "bogota-cheap-la-puerta-falsa", name: "La Puerta Falsa", neighborhood: "La Candelaria", coordinates: [4.5971, -74.0753],
    description: "This narrow institution beside the cathedral is a compact primer in Bogotá comfort food: tamales, ajiaco, changua, hot chocolate, cheese, and almojábanas. Turnover is fast and the room is tiny, so treat the queue as part of a focused breakfast or lunch rather than a lingering café visit.",
    cuisineTypes: ["Bogotano", "breakfast", "traditional"], attributeTags: ["historic", "budget", "local-classic"], price: "$", hours: { default: "Daily 7:00 AM-9:00 PM; holiday adjustments are posted on the restaurant's current map listing." },
    officialUrl: "https://archivobogota.secretariageneral.gov.co/noticias/la-puerta-falsa", sourcePhoto: "https://bogota.gov.co/sites/default/files/inline-images/la-puerta-falsa.jpeg",
    platformUrls: ["https://www.waze.com/es/live-map/directions/co/bogota/bogota/la-puerta-falsa?to=place.ChIJybfDx6eZP44RYZ5QuXtKwG0"],
  }),
  food({
    id: "bogota-cheap-perseverancia", name: "Plaza de Mercado La Perseverancia", neighborhood: "La Perseverancia", coordinates: [4.6195, -74.0662],
    description: "The neighborhood market became a citywide eating destination without losing its produce stalls and everyday purpose. Come for cooks serving ajiaco, fish, soups, fruit, and regional plates, then walk the aisles before choosing—the strongest visit is broader than one famous counter.",
    cuisineTypes: ["Colombian", "market", "regional"], attributeTags: ["public-market", "budget", "lunch"], price: "$",
    hours: { mon: "8:00 AM-4:00 PM", tue: "8:00 AM-4:00 PM", wed: "8:00 AM-4:00 PM", thu: "8:00 AM-4:00 PM", fri: "8:00 AM-4:00 PM", sat: "6:00 AM-5:00 PM", sun: "6:00 AM-5:00 PM" },
    officialUrl: "https://bogota.gov.co/en/node/55230", sourcePhoto: "https://bogota.gov.co/sites/default/files/2022-04/plaza-de-mercado-la-perseverancia.jpg",
  }),
  food({
    id: "bogota-cheap-concordia", name: "Plaza Distrital de Mercado La Concordia", neighborhood: "La Candelaria", coordinates: [4.5964, -74.0687],
    description: "La Concordia combines a restored district market with produce, casual kitchens, coffee, and views toward the eastern hills. It is less overwhelming than Paloquemao and well placed for a Candelaria day, but still rewards checking stalls before committing to the most visible dining room.",
    cuisineTypes: ["Colombian", "market", "casual"], attributeTags: ["public-market", "budget", "views"], price: "$",
    hours: { mon: "7:00 AM-3:00 PM", tue: "7:00 AM-5:00 PM", wed: "7:00 AM-5:00 PM", thu: "7:00 AM-5:00 PM", fri: "7:00 AM-7:00 PM", sat: "7:00 AM-7:00 PM", sun: "7:00 AM-7:00 PM" },
    officialUrl: "https://ipes.gov.co/index.php/programas/plazas-de-mercado/reapertura-plaza-de-la-concordia", sourcePhoto: "https://photo620x400.mnstatic.com/8172b81e807db7b05eb479656f87be54/plaza-de-mercado-la-concordia.jpg",
    editorialUrls: ["https://www.ipes.gov.co/images/informes/horarios/Horario-de-atencion-Plazas-de-Mercado-septiembre-2024.pdf"],
  }),
  food({
    id: "bogota-cheap-pasteleria-florida", name: "Pastelería Florida", neighborhood: "Las Nieves", coordinates: [4.6065, -74.0716],
    description: "Operating since 1935, Florida preserves the downtown ritual of chocolate santafereño served with cheese, bread, and pastries. The long counter, layered cakes, tamales, and savory breakfasts make it practical for more than nostalgia, especially before nearby museums or theatres.",
    cuisineTypes: ["Bogotano", "bakery", "breakfast"], attributeTags: ["historic", "bakery", "hot-chocolate"], price: "$",
    hours: { mon: "8:00 AM-7:00 PM", tue: "8:00 AM-7:00 PM", wed: "8:00 AM-7:00 PM", thu: "8:00 AM-7:00 PM", fri: "8:00 AM-8:00 PM", sat: "8:00 AM-8:00 PM", sun: "8:00 AM-7:00 PM" },
    officialUrl: "https://pasteleriaflorida.com/", sourcePhoto: "https://imagenes2.eltiempo.com/files/image_1200_535/uploads/2025/10/17/68f265c1b5089.png", platformUrls: ["https://www.cylex.com.co/bogota/pasteler%C3%ADa-florida-ltda--11116738.html"],
  }),
  food({
    id: "bogota-cheap-las-margaritas", name: "Restaurante Las Margaritas", neighborhood: "La Candelaria", coordinates: [4.5969, -74.0737],
    description: "A weekend-and-holiday institution dating to 1902, Las Margaritas specializes in compact Bogotá classics: crisp empanadas, ajiaco, cuchuco, tamales, and sweets. Public service is deliberately limited, while weekdays are reserved for prearranged corporate events.",
    cuisineTypes: ["Bogotano", "traditional"], attributeTags: ["historic", "weekend-only", "empanadas"], price: "$",
    hours: { mon: "Closed to the public", tue: "Closed to the public", wed: "Closed to the public", thu: "Closed to the public", fri: "Closed to the public", sat: "7:30 AM-4:00 PM", sun: "7:30 AM-4:00 PM", default: "Public-holiday service is 7:30 AM-4:00 PM; weekday corporate events require a prearranged reservation through the official contact page." },
    officialUrl: "https://www.restaurantelasmargaritas.com/contacto.php", sourcePhoto: "https://i0.wp.com/efe.com/wp-content/uploads/2023/11/COLOMBIA-GASTRONOMIA-040506-1.jpg?resize=900%2C600&ssl=1", editorialUrls: ["https://historico.gobiernobogota.gov.co/node/50458"],
  }),
  food({
    id: "bogota-cheap-quinua-amaranto", name: "Quinua y Amaranto", neighborhood: "La Candelaria", coordinates: [4.5957, -74.0704],
    description: "A tiny vegetarian lunch room turns quinoa, amaranth, legumes, vegetables, soup, juice, and dessert into a balanced set meal. Portions are thoughtful rather than enormous and the cooking avoids mock-meat clichés, making it one of the center's most reliable low-cost lunches.",
    cuisineTypes: ["Vegetarian", "Colombian", "set-lunch"], attributeTags: ["vegetarian", "budget", "lunch"], price: "$",
    hours: { mon: "11:30 AM-7:30 PM", tue: "11:30 AM-7:30 PM", wed: "11:30 AM-7:30 PM", thu: "11:30 AM-7:30 PM", fri: "11:30 AM-7:30 PM", sat: "11:30 AM-7:30 PM", sun: "11:30 AM-4:00 PM" },
    officialUrl: "https://quinuayamaranto.com.co/contacto", sourcePhoto: "https://images.squarespace-cdn.com/content/v1/558ab6aae4b081d1c28b6f38/1438122341000-G4JCFFHP64LBBWNZINUK/restaurante_ornamentos_01.jpg", platformUrls: ["https://restaurantguru.com/Quinua-y-Amaranto-Bogota"],
  }),
  food({
    id: "bogota-cheap-el-pantera", name: "El Pantera Taquería Chapinero", neighborhood: "Chapinero", coordinates: [4.6423, -74.0626],
    description: "El Pantera's Chapinero counter delivers concise, messy-in-the-right-way tacos, tostadas, and gringas with bright salsas and good vegetarian options. This branch-specific entry avoids the common trap of following hours or addresses from one of the group's other Bogotá locations.",
    cuisineTypes: ["Mexican", "tacos"], attributeTags: ["tacos", "budget", "late-dinner"], price: "$",
    hours: { mon: "12:00 PM-10:00 PM", tue: "12:00 PM-10:00 PM", wed: "12:00 PM-10:00 PM", thu: "12:00 PM-11:00 PM", fri: "12:00 PM-11:00 PM", sat: "12:00 PM-11:00 PM", sun: "12:00 PM-10:00 PM" },
    officialUrl: "https://elpanterataqueria.com/locales", sourcePhoto: "https://cdn.prod.website-files.com/668b492837148c85229ec8e7/668f38f660ea88d8a540c4d2_Nosotros.jpg", platformUrls: ["https://restaurantguru.com/El-Pantera-Tacos-Bogota"], mapQuery: "El Pantera Calle 55 6-31 Bogota",
  }),
  food({
    id: "bogota-cheap-tropicalia", name: "Tropicalia Coffee Calle 81", neighborhood: "El Retiro", coordinates: [4.6669, -74.0528],
    description: "Tropicalia roasts upstairs and keeps the café focused on traceable Colombian coffee rather than decorative coffee-shop excess. Espresso, careful filter brews, pastries, and light food make the Calle 81 shop a useful pause between Zona T and the quieter residential streets east of Carrera Séptima.",
    foodServiceType: "cafe", cuisineTypes: ["Coffee", "bakery"], attributeTags: ["specialty-coffee", "roastery", "breakfast"], price: "$",
    hours: { mon: "7:00 AM-8:00 PM", tue: "7:00 AM-8:00 PM", wed: "7:00 AM-8:00 PM", thu: "7:00 AM-8:00 PM", fri: "7:00 AM-8:00 PM", sat: "8:00 AM-8:00 PM", sun: "8:00 AM-7:00 PM" },
    officialUrl: "https://www.tropicaliacoffee.com/", sourcePhoto: "https://www.tropicaliacoffee.com/cdn/shop/files/DSCF9390.jpg?v=1776280523", platformUrls: ["https://www.waze.com/live-map/directions/co/bogota/bogota/tropicalia-coffee?to=place.ChIJE0prjS-bP44R92imaf-A6Nw"],
  }),
  food({
    id: "bogota-cheap-cafe-cultor", name: "Café Cultor Quinta Camacho", neighborhood: "Quinta Camacho", coordinates: [4.6534, -74.0611],
    description: "Café Cultor connects named producer projects and Colombian origins to clear, approachable brewing. The Quinta Camacho house is spacious enough to compare coffees without turning the visit into a lecture, and its long hours make it useful between lunch and the neighborhood's evening venues.",
    foodServiceType: "cafe", cuisineTypes: ["Coffee", "cafe"], attributeTags: ["specialty-coffee", "producer-focused", "work-friendly"], price: "$",
    hours: { mon: "7:30 AM-8:00 PM", tue: "7:30 AM-8:00 PM", wed: "7:30 AM-8:00 PM", thu: "7:30 AM-8:00 PM", fri: "7:30 AM-9:00 PM", sat: "7:30 AM-9:00 PM", sun: "10:30 AM-6:30 PM" },
    officialUrl: "https://cafecultor.co/nuestras-tiendas/", sourcePhoto: "https://cafecultor.co/wp-content/uploads/wilborada-min.jpg", mapQuery: "Cafe Cultor Quinta Camacho Bogota",
  }),
  food({
    id: "bogota-cheap-colo", name: "Colo Coffee Quinta Camacho", neighborhood: "Quinta Camacho", coordinates: [4.6519, -74.0604],
    description: "Colo organizes its Colombian coffees by flavor profile, giving newcomers a practical route into regional differences without burying the cup in jargon. The small Quinta Camacho branch is best for a focused espresso or filter stop rather than a long laptop session.",
    foodServiceType: "cafe", cuisineTypes: ["Coffee", "cafe"], attributeTags: ["specialty-coffee", "single-origin", "quick-stop"], price: "$",
    hours: { mon: "9:00 AM-6:30 PM", tue: "9:00 AM-6:30 PM", wed: "9:00 AM-6:30 PM", thu: "9:00 AM-6:30 PM", fri: "9:00 AM-6:30 PM", sat: "9:00 AM-6:30 PM", sun: "9:00 AM-6:30 PM" },
    officialUrl: "https://colo.com.co/blogs/nuestras-tiendas/colo-quinta-camacho", sourcePhoto: "https://colo.com.co/cdn/shop/articles/DSC0069_copia.jpg?v=1781507150",
  }),
];

const hotelStops: GuideStop[] = [
  lodging({
    id: "bogota-hotel-casa-medina", name: "Four Seasons Hotel Casa Medina Bogotá", neighborhood: "Zona G", coordinates: [4.652238, -74.0564121],
    description: "Casa Medina's 1946 stone-and-brick landmark contains 62 rooms that retain timber ceilings, fireplaces, carved doors, and individual layouts. The scale feels residential, while Castanyoles' glass-covered courtyard and a compact spa supply full-service comforts without erasing the building's character.",
    lodgingType: "hotel", attributeTags: ["luxury", "heritage-building", "spa", "quiet"], price: "$$$$", hours: schedule.hotel,
    officialUrl: "https://www.fourseasons.com/casamedina/", bookingUrl: "https://www.fourseasons.com/casamedina/", sourcePhoto: "https://www.fourseasons.com/alt/img-opt/~75.701/publish/content/dam/fourseasons/images/web/BIH/BIH_069_aspect16x9.jpg",
    editorialUrls: ["https://www.cntraveler.com/hotels/bogota/four-seasons-hotel-casa-medina-bogota"],
  }),
  lodging({
    id: "bogota-hotel-four-seasons", name: "Four Seasons Hotel Bogotá", neighborhood: "Zona T", coordinates: [4.6681, -74.053],
    description: "The newer Four Seasons is the more contemporary of the brand's two Bogotá properties, with 64 rooms, dark woods, strong sound control, and immediate access to Zona T. Choose it for shopping, restaurants, and polished business-city convenience rather than Casa Medina's historic atmosphere.",
    lodgingType: "hotel", attributeTags: ["luxury", "central", "spa", "business-friendly"], price: "$$$$", hours: schedule.hotel,
    officialUrl: "https://www.fourseasons.com/bogota/", bookingUrl: "https://www.fourseasons.com/bogota/", sourcePhoto: "https://www.fourseasons.com/alt/img-opt/~75.701/publish/content/dam/fourseasons/images/web/BHA/BHA_034_aspect16x9.jpg",
    editorialUrls: ["https://www.cntraveler.com/hotels/bogota/four-seasons-hotel-bogota"],
  }),
  lodging({
    id: "bogota-hotel-sofitel", name: "Sofitel Bogotá Victoria Regia", neighborhood: "Zona T", coordinates: [4.668, -74.0556],
    description: "Sofitel pairs French service habits with Colombian materials in a compact Zona T property. Rooms are quieter than the nightlife-heavy address suggests when oriented carefully, and the walkable location works for travelers who want restaurants and retail without relying on a car for every outing.",
    lodgingType: "hotel", attributeTags: ["luxury", "walkable", "business-friendly", "restaurant"], price: "$$$$", hours: schedule.hotel,
    officialUrl: "https://all.accor.com/hotel/0561/index.en.shtml", bookingUrl: "https://all.accor.com/hotel/0561/index.en.shtml", sourcePhoto: "https://www.ahstatic.com/photos/0561_ho_00_p_2048x1536.jpg",
  }),
  lodging({
    id: "bogota-hotel-bog", name: "B.O.G. Hotel", neighborhood: "La Cabrera", coordinates: [4.669332, -74.0499946],
    description: "Gold and emerald references shape the interiors of this Colombian-design hotel without becoming literal theme décor. A rooftop pool and bar create the strongest visual payoff, while the 55-room scale and La Cabrera position suit travelers who want independent polish near Zona T.",
    lodgingType: "hotel", attributeTags: ["design", "rooftop-pool", "independent", "views"], price: "$$$$", hours: schedule.hotel,
    officialUrl: "https://www.boghotel.com/en", bookingUrl: "https://www.boghotel.com/en", sourcePhoto: "https://image-tc.galaxy.tf/wijpeg-4c64a4i4bklu2pmsc1f8u0rcc/front-desk-7-opt.jpg?width=960",
  }),
  lodging({
    id: "bogota-hotel-casa-legado", name: "Casa Legado", neighborhood: "Quinta Camacho", coordinates: [4.654, -74.0615],
    description: "Thirteen individually composed rooms and nine shared spaces turn a mid-century Quinta Camacho house into a genuinely intimate stay. Breakfast, the library, garden, bicycles, and help-yourself domestic rhythm appeal to travelers who value conversation and neighborhood texture over a conventional lobby.",
    lodgingType: "hotel", attributeTags: ["boutique", "residential", "design", "breakfast"], price: "$$$", hours: schedule.hotel,
    officialUrl: "https://casalegadobogota.com/es/inicio-2/", bookingUrl: "https://casalegadobogota.com/es/inicio-2/", sourcePhoto: "https://casalegadobogota.com/wp-content/uploads/2017/12/the-laura-1024x1024.jpg",
  }),
  lodging({
    id: "bogota-hotel-grand-hyatt", name: "Grand Hyatt Bogotá", neighborhood: "Ciudad Salitre", coordinates: [4.6487, -74.1058],
    description: "Grand Hyatt's scale brings Bogotá's most complete resort-style hotel facilities: a large indoor pool, extensive spa, multiple restaurants, club rooms, and serious meeting infrastructure. The tradeoff is location—excellent for the airport and business district, less useful for spontaneous walking in the historic or northern neighborhoods.",
    lodgingType: "hotel", attributeTags: ["luxury", "large-pool", "spa", "airport-convenient"], price: "$$$$", hours: schedule.hotel,
    officialUrl: "https://www.hyatt.com/grand-hyatt/en-US/boggh-grand-hyatt-bogota", bookingUrl: "https://www.hyatt.com/grand-hyatt/en-US/boggh-grand-hyatt-bogota", sourcePhoto: "https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2018/10/18/0616/Grand-Hyatt-Bogota-P088-Double-Beds-Closed-Curtains.jpg/Grand-Hyatt-Bogota-P088-Double-Beds-Closed-Curtains.16x9.jpg?imwidth=2560",
  }),
  lodging({
    id: "bogota-hotel-w", name: "W Bogotá", neighborhood: "Usaquén", coordinates: [4.6964, -74.0337],
    description: "W's gold-legend visual language, energetic lobby, spa, and indoor pool suit travelers who prefer a social full-service hotel. Its Usaquén address is convenient for northern offices and weekend market visits, but markedly farther from La Candelaria and central museums.",
    lodgingType: "hotel", attributeTags: ["luxury", "social", "spa", "indoor-pool"], price: "$$$$", hours: schedule.hotel,
    officialUrl: "https://www.marriott.com/en-us/hotels/bogwh-w-bogota/overview/", bookingUrl: "https://www.marriott.com/en-us/hotels/bogwh-w-bogota/overview/", sourcePhoto: "https://cache.marriott.com/content/dam/marriott-renditions/BOGWH/bogwh-entrance-4617-hor-wide.jpg?downsize=1920px%3A%2A&interpolation=progressive-bilinear&output-quality=85",
  }),
  lodging({
    id: "bogota-hotel-jw-marriott", name: "JW Marriott Hotel Bogotá", neighborhood: "Financial District", coordinates: [4.6553, -74.0557],
    description: "The JW is a deeply serviced business-luxury option with an indoor pool, substantial spa, multiple restaurants, and secure financial-district location. Its traditional rooms are less design-forward than Bogotá's boutiques, but consistency and facilities matter for longer corporate stays or poor-weather downtime.",
    lodgingType: "hotel", attributeTags: ["luxury", "business-friendly", "spa", "indoor-pool"], price: "$$$$", hours: schedule.hotel,
    officialUrl: "https://www.marriott.com/en-us/hotels/bogjw-jw-marriott-hotel-bogota/overview/", bookingUrl: "https://www.marriott.com/en-us/hotels/bogjw-jw-marriott-hotel-bogota/overview/", sourcePhoto: "https://cache.marriott.com/is/image/marriotts7prod/jw-bogjw--2024-uribe-bogjw-f-39764-26078%3AWide-Hor?fit=constrain&wid=1920",
  }),
  lodging({
    id: "bogota-hotel-opera", name: "Hotel de la Opera", neighborhood: "La Candelaria", coordinates: [4.5961, -74.0752],
    description: "Two restored colonial and republican houses place guests beside Teatro Colón, Plaza de Bolívar, and the Botero museums. Interior rooms, a small pool, and spa soften the busy center; the address is unmatched for early museum starts but quieter after the historic district closes down.",
    lodgingType: "hotel", attributeTags: ["heritage-building", "historic-center", "spa", "walkable"], price: "$$$", hours: schedule.hotel,
    officialUrl: "https://www.hotelopera.com.co/en/", bookingUrl: "https://www.hotelopera.com.co/en/", sourcePhoto: "https://www.hotelopera.com.co/uploads/cms_apps/imagenes/hotel_de_la_opera43_1.jpg",
  }),
  lodging({
    id: "bogota-hotel-click-clack", name: "The Click Clack Hotel Bogotá", neighborhood: "Parque de la 93", coordinates: [4.6765, -74.0478],
    description: "Compact rooms, playful design, and a strong rooftop social scene define the Click Clack. It is best for travelers who will use Parque 93's restaurants and accept that nightlife energy can reach the hotel; light packers should find the small-room layouts easier than long-stay guests.",
    lodgingType: "hotel", attributeTags: ["design", "rooftop", "nightlife", "compact-rooms"], price: "$$$", hours: schedule.hotel,
    officialUrl: "https://www.clickclackhotel.com/en/hotel-clickclackbogota-in-bogota/", bookingUrl: "https://www.clickclackhotel.com/en/hotel-clickclackbogota-in-bogota/", sourcePhoto: "https://www.clickclackhotel.com/media/uploads/galeriasalon/click-clack-parck-1.jpg?q=pr:sharp/rs:fill/w:1200/h:800/f:jpg",
  }),
];

const hostelStops: GuideStop[] = [
  lodging({
    id: "bogota-hostel-botanico", name: "Botanico Hostel Bogotá", neighborhood: "La Candelaria", coordinates: [4.5954, -74.069],
    description: "A plant-filled colonial house with a roof terrace and large garden creates one of La Candelaria's easiest social settings. Dorm curtains and private rooms add useful retreat, though scheduled events and courtyard conversation make this better for engaged travelers than early sleepers.",
    lodgingType: "hostel", attributeTags: ["social", "garden", "roof-terrace", "dorms"], price: "$", hours: schedule.hostel,
    officialUrl: "https://botanicohostel.com/", bookingUrl: "https://www.hostelworld.com/hostels/p/279935/botanico-hostel-bogota/", sourcePhoto: "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/279935/lnkqbe0tmfcoi0biit5j.jpg",
  }),
  lodging({
    id: "bogota-hostel-granada", name: "Granada Hostel", neighborhood: "La Candelaria", coordinates: [4.5964, -74.0693],
    description: "Granada balances a restored historic house, bar, games, and social programming with curtained bunks and calmer corners. It is a useful middle ground for travelers who want to meet people without committing to the scale or constant agenda of a large party hostel.",
    lodgingType: "hostel", attributeTags: ["social", "heritage-building", "privacy-curtains", "bar"], price: "$", hours: schedule.hostel,
    bookingUrl: "https://www.hostelworld.com/hostels/p/303271/granada-hostel/", sourcePhoto: "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/303271/mmi016oxe0nx9nttk9eu.jpg",
  }),
  lodging({
    id: "bogota-hostel-masaya", name: "Masaya Bogotá", neighborhood: "La Candelaria", coordinates: [4.5961, -74.0697],
    description: "Masaya uses a large heritage house for courtyards, live programming, communal meals, private rooms, and dorms. The professional operation and broad activity calendar are reassuring for first-time solo visitors, but the scale feels more programmed than an independent guesthouse.",
    lodgingType: "hostel", attributeTags: ["social", "heritage-building", "events", "private-rooms"], price: "$", hours: schedule.hostel,
    officialUrl: "https://www.masaya-experience.com/bogota", bookingUrl: "https://www.hostelworld.com/hostels/p/57813/masaya-bogota/", sourcePhoto: "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/5/57813/ujxaarcngimteb6dlckd.jpg",
  }),
  lodging({
    id: "bogota-hostel-cranky-croc", name: "The Cranky Croc Hostel", neighborhood: "La Candelaria", coordinates: [4.6004, -74.071],
    description: "A long-running independent hostel, the Cranky Croc combines a central courtyard, café-bar, tours, and knowledgeable local desk. Its social life is active without requiring an on-site club, making it especially practical for travelers prioritizing city orientation and walking access.",
    lodgingType: "hostel", attributeTags: ["independent", "courtyard", "tours", "social"], price: "$", hours: schedule.hostel,
    officialUrl: "https://crankycroc.com/en/", bookingUrl: "https://crankycroc.com/en/", sourcePhoto: "https://crankycroc.com/wp-content/uploads/2025/11/7Ip06Pod02-scaled.jpg",
  }),
  lodging({
    id: "bogota-hostel-viajero", name: "Viajero Bogotá Hostel & Spa", neighborhood: "La Candelaria", coordinates: [4.6045, -74.0704],
    description: "Viajero pairs a large social hostel with an unusually substantial wellness proposition: sauna, massage, and spa spaces alongside dorms, private rooms, bar, and events. Choose it when organized activity and recovery facilities outweigh the intimacy of a smaller house.",
    lodgingType: "hostel", attributeTags: ["social", "spa", "large-hostel", "events"], price: "$$", hours: schedule.hostel,
    officialUrl: "https://www.viajerohostels.com/en", bookingUrl: "https://www.hostelworld.com/hostels/p/310750/viajero-bogota-hostel-and-spa/", sourcePhoto: "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/310750/qjrkt2ykkzbbcvazvskh.jpg",
  }),
  lodging({
    id: "bogota-hostel-spotty", name: "Spotty Hostels Bogotá Centro", neighborhood: "Las Nieves", coordinates: [4.6045, -74.0748],
    description: "Spotty's tall modern building brings a rooftop pool, coworking, gym, bar, dorms, and apartments to the center. It suits digital nomads and travelers who value facilities over colonial atmosphere; the large footprint can feel closer to student residence than intimate hostel.",
    lodgingType: "hostel", attributeTags: ["rooftop-pool", "coworking", "modern", "apartments"], price: "$$", hours: schedule.hostel,
    officialUrl: "https://spottyhostels.com/", bookingUrl: "https://spottyhostels.com/", sourcePhoto: "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/305222/nmrslchxmpvi4muckkco.jpg",
  }),
  lodging({
    id: "bogota-hostel-r10", name: "Hostal R10", neighborhood: "La Candelaria", coordinates: [4.5978, -74.0725],
    description: "R10 occupies a bright republican-era building close to Plaza de Bolívar, with a roof terrace, simple dorms, private rooms, and communal kitchen. The location is the principal advantage; travelers should choose it for historic-center access rather than a heavy in-house event schedule.",
    lodgingType: "hostel", attributeTags: ["roof-terrace", "historic-center", "kitchen", "quiet-social"], price: "$", hours: schedule.hostel,
    officialUrl: "https://r10colombia.com/", bookingUrl: "https://www.hostelworld.com/es/albergues/p/293853/hostal-r10/", sourcePhoto: "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/293853/qunokc2avmgw9ormb4r5.jpg",
  }),
  lodging({
    id: "bogota-hostel-arche-noah", name: "Arche Noah Boutique Hostel", neighborhood: "La Candelaria", coordinates: [4.5988, -74.0709],
    description: "Arche Noah is a small, garden-centered hostel with sauna, terrace, private rooms, and dorms in a colonial house. The scale and domestic layout favor couples and quieter solo travelers, though old-building acoustics still make room position worth discussing at booking.",
    lodgingType: "hostel", attributeTags: ["boutique", "garden", "sauna", "quiet"], price: "$", hours: schedule.hostel,
    bookingUrl: "https://www.booking.com/hotel/co/arche-noah-guesthouse.html", sourcePhoto: "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/9/95435/5018.jpg",
  }),
  lodging({
    id: "bogota-hostel-fatima", name: "Fatima Hostel Bogotá", neighborhood: "La Candelaria", coordinates: [4.5962, -74.0705],
    description: "Fatima is a long-established backpacker base with colorful common rooms, a bar, dorms, and straightforward private rooms. It is best for price-conscious travelers who welcome a visibly social atmosphere and can accept simpler finishes than Bogotá's newer hostel compounds.",
    lodgingType: "hostel", attributeTags: ["budget", "social", "bar", "backpacker"], price: "$", hours: schedule.hostel,
    bookingUrl: "https://www.hostelworld.com/hostels/south-america/colombia/bogota/", sourcePhoto: "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/269171/nbdhgoieahrds104fqrv.jpg", mapQuery: "Fatima Hostel Bogota Colombia",
  }),
  lodging({
    id: "bogota-hostel-vecinos", name: "Vecinos by La Palmera", neighborhood: "Quinta Camacho", coordinates: [4.654, -74.062],
    description: "Vecinos offers a smaller northern alternative to the dense Candelaria hostel cluster, placing dorms and private rooms near Quinta Camacho's cafés and nightlife. The calmer residential position suits repeat visitors who understand Bogotá's distances and prefer Chapinero over the historic center.",
    lodgingType: "hostel", attributeTags: ["neighborhood-base", "small-hostel", "private-rooms", "quiet"], price: "$", hours: schedule.hostel,
    bookingUrl: "https://www.hostelworld.com/nl/hostels/p/311331/vecinos-by-la-palmera/", sourcePhoto: "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/311331/o3ieyzpss1uevkimshsd.jpg",
  }),
];

const casualBarStops: GuideStop[] = [
  nightlife({
    id: "bogota-bar-theatron", name: "Theatron", neighborhood: "Chapinero", coordinates: [4.6451837, -74.063889],
    description: "Theatron is less a single club than a multi-room queer nightlife complex, with distinct floors for pop, electronic music, Latin hits, karaoke, and spectacle. Its scale can be exhilarating or exhausting; arrive with a meeting plan and use the venue's own date listing for room openings.",
    nightlifeType: "club", musicGenres: ["pop", "electronic", "Latin"], attributeTags: ["queer-friendly", "dance-floor", "multi-room", "late-night"], price: "$$", hours: schedule.event,
    officialUrl: "https://www.portaltheatron.co/en/faq", timetableUrl: "https://www.portaltheatron.co/", sourcePhoto: "https://static.wixstatic.com/media/c4e269_e6db8c4fed044627aebd24d8e1cf5232f000.jpg",
    editorialUrls: ["https://www.idt.gov.co/noticias/bogota-es-la-casa-de-la-diversidad-los-bares-lgbti-que-no-puedes-dejar-de-visitar-en-el"],
  }),
  nightlife({
    id: "bogota-bar-latino-power", name: "Latino Power", neighborhood: "Chapinero", coordinates: [4.6446486, -74.064966],
    description: "Latino Power is a cultural room first and bar second: live bands, DJs, queer parties, spoken word, and independent Latin American projects reshape the space nightly. Read the ticket listing before going, because a concert, club night, and community event produce entirely different visits.",
    nightlifeType: "live_music_venue", musicGenres: ["Latin alternative", "cumbia", "electronic"], attributeTags: ["live-music", "independent", "queer-friendly", "events"], price: "$$", hours: schedule.event,
    officialUrl: "https://tickets.latinopower.com.co/local/latino-power-chapinero/", timetableUrl: "https://tickets.latinopower.com.co/local/latino-power-chapinero/", sourcePhoto: "https://tickets.latinopower.com.co/wp-content/uploads/sites/2/2025/09/image-011.webp",
    editorialUrls: ["https://culturarecreacionydeporte.gov.co/es/eventos/latino-power-presenta-una-programacion-especial"],
  }),
  nightlife({
    id: "bogota-bar-project-kinder", name: "Project Kinder", neighborhood: "Industrial Bogotá", coordinates: [4.631, -74.0905],
    description: "Sector 9's newer club project channels Bogotá's warehouse energy into large-scale electronic nights, scenography, and carefully announced lineups. The location, entry windows, and production format can change by event, so tickets and transport should be settled from the dated official announcement.",
    nightlifeType: "club", musicGenres: ["electronic", "techno", "house"], attributeTags: ["warehouse", "electronic", "late-night", "ticketed"], price: "$$$", hours: schedule.event,
    officialUrl: "https://www.instagram.com/projectkinder/", timetableUrl: "https://www.instagram.com/projectkinder/", sourcePhoto: "https://imagenes.elpais.com/resizer/v2/YFV7WFMAAZHMZP6FWRPEDZKRGQ.jpg?auth=762ed2a1035a86359210443105290c85096bf86b495d9e9ea5e29e2655ea92d6&width=1200",
    editorialUrls: ["https://elpais.com/america-colombia/branded/los-lideres-de-colombia/2025-12-11/sector-9-el-colectivo-que-sigue-reinventando-la-noche-bogotana.html"],
  }),
  nightlife({
    id: "bogota-bar-video-club", name: "Video Club", neighborhood: "Chapinero", coordinates: [4.6507944, -74.0634433],
    description: "A converted house gives Video Club several rooms and a patio for house, techno, disco, and visiting selectors. It is a true event-driven club rather than a dependable casual drink, so lineup, advance tickets, and final entry time should drive the decision to go.",
    nightlifeType: "club", musicGenres: ["house", "techno", "disco"], attributeTags: ["electronic", "dance-floor", "multi-room", "late-night"], price: "$$", hours: schedule.event,
    officialUrl: "https://www.instagram.com/videoclubx/", timetableUrl: "https://ra.co/clubs/131558", sourcePhoto: "https://setoftheday.com/wp-content/uploads/2018/11/Video-Club-20.jpg",
    platformUrls: ["https://www.tripadvisor.co/Attraction_Review-g294074-d10465804-Reviews-Video_Club-Bogota.html"],
  }),
  nightlife({
    id: "bogota-bar-asilo", name: "Asilo Bar", neighborhood: "Chapinero", coordinates: [4.6287546, -74.0685423],
    description: "Asilo preserves a scruffier alternative-club lane through post-punk, new wave, rock, darkwave, and live sets. The crowd and soundtrack depend heavily on the named party, and the compact room gets intense late, making the current poster more useful than any generic description.",
    nightlifeType: "club", musicGenres: ["post-punk", "new wave", "rock"], attributeTags: ["alternative", "dance-floor", "live-music", "late-night"], price: "$$", hours: schedule.event,
    officialUrl: "https://www.instagram.com/asilobar/", timetableUrl: "https://www.instagram.com/asilobar/", sourcePhoto: "https://laotravoz.co/wp-content/uploads/2019/03/7-04-19ASILO-.jpg",
  }),
  nightlife({
    id: "bogota-bar-matik-matik", name: "Matik-Matik", neighborhood: "Quinta Camacho", coordinates: [4.6529745, -74.0611539],
    description: "Matik-Matik is an intimate listening room for improvised, experimental, and hard-to-classify music, with a small bar supporting the program. Silence and attention matter during sets; check the artist listing rather than assuming a conventional drop-in bar night.",
    nightlifeType: "live_music_venue", musicGenres: ["experimental", "improvised", "jazz"], attributeTags: ["listening-room", "independent", "live-music", "intimate"], price: "$$", hours: schedule.event,
    officialUrl: "https://www.instagram.com/matikmatik/", timetableUrl: "https://www.instagram.com/matikmatik/", sourcePhoto: "https://www.idartes.gov.co/sites/default/files/inline-images/WhatsApp%20Image%202020-09-22%20at%203.08.35%20PM.jpeg",
  }),
  nightlife({
    id: "bogota-bar-quiebra-canto", name: "Quiebra Canto", neighborhood: "La Candelaria", coordinates: [4.5987, -74.072],
    description: "Quiebra Canto is a long-running salsa room where collectors, dancers, students, and musicians share a compact floor. It feels closer to a neighborhood music institution than a polished club; live sessions and guest selectors are announced date by date.",
    nightlifeType: "live_music_venue", musicGenres: ["salsa", "Afro-Caribbean"], attributeTags: ["salsa", "dance-floor", "local-bar", "live-music"], price: "$$", hours: schedule.event,
    officialUrl: "https://www.quiebracanto.com/index.html", timetableUrl: "https://www.instagram.com/quiebracantobar/", sourcePhoto: "https://www.quiebracanto.com/images/quiebra-canto1.jpg",
  }),
  nightlife({
    id: "bogota-bar-bbc-quinta", name: "Bogotá Beer Company Quinta Camacho", neighborhood: "Quinta Camacho", coordinates: [4.6517, -74.061],
    description: "BBC's Quinta Camacho pub is a straightforward branch for Colombian craft standards, pub food, and groups that want easy conversation. The brewery is now a large local institution, so come for consistency and a neighborhood meeting point rather than small-batch novelty.",
    nightlifeType: "brewery", musicGenres: [], attributeTags: ["craft-beer", "casual", "groups", "pub-food"], price: "$$",
    hours: { mon: "12:00 PM-12:00 AM", tue: "12:00 PM-12:00 AM", wed: "12:00 PM-12:00 AM", thu: "12:00 PM-1:00 AM", fri: "12:00 PM-2:00 AM", sat: "12:00 PM-2:00 AM", sun: "12:00 PM-10:00 PM", default: "Holiday changes are published on Bogotá Beer Company's official branch listing." },
    officialUrl: "https://www.bbccerveceria.com/", sourcePhoto: "https://www.bbccerveceria.com/sites/g/files/seuoyk221/files/2022-06/newbanner%20%281%29.jpg", mapQuery: "Bogota Beer Company Quinta Camacho Bogota",
  }),
  nightlife({
    id: "bogota-bar-mono-bandido", name: "El Mono Bandido Quinta Camacho", neighborhood: "Quinta Camacho", coordinates: [4.653, -74.0607],
    description: "El Mono Bandido wraps house beer, a planted courtyard, food, and playful social energy into an easy group night. Quinta Camacho is the more characterful branch; expect a lively young crowd and check the official location listing when a live set or holiday changes normal service.",
    nightlifeType: "brewery", musicGenres: ["varied live music"], attributeTags: ["craft-beer", "courtyard", "groups", "casual"], price: "$$",
    hours: { mon: "12:00 PM-11:00 PM", tue: "12:00 PM-11:00 PM", wed: "12:00 PM-12:00 AM", thu: "12:00 PM-1:00 AM", fri: "12:00 PM-2:00 AM", sat: "12:00 PM-2:00 AM", sun: "12:00 PM-10:00 PM", default: "Live sets and holiday extensions are published on the official branch calendar." },
    officialUrl: "https://elmonobandido.com/", sourcePhoto: "https://static.wixstatic.com/media/31e547_b50c62f3733f43e8a7229e88078fc4be%7Emv2.jpg", mapQuery: "El Mono Bandido Quinta Camacho Bogota",
  }),
  nightlife({
    id: "bogota-bar-odem", name: "ODEM Bar", neighborhood: "Chapinero", coordinates: [4.6482, -74.0635],
    description: "ODEM moves between house, electronic music, crossover nights, and a relaxed early-evening bar before the room turns into a club. Its published Wednesday-to-Saturday span is unusually clear, but the ticket page remains essential for the specific genre and cover.",
    nightlifeType: "club", musicGenres: ["house", "electronic", "crossover"], attributeTags: ["dance-floor", "late-night", "ticketed", "mixed-program"], price: "$$",
    hours: { mon: "Closed", tue: "Closed", wed: "4:00 PM-4:00 AM", thu: "4:00 PM-4:00 AM", fri: "4:00 PM-4:00 AM", sat: "4:00 PM-4:00 AM", sun: "Closed" },
    officialUrl: "https://www.tikipal.com.co/bogota/odem", timetableUrl: "https://www.tikipal.com.co/bogota/odem", sourcePhoto: "https://tikipal.s3.amazonaws.com/media/images/84003061_530180017594738_8808107532141104294_n.jpg",
  }),
];

const cocktailBarStops: GuideStop[] = [
  nightlife({
    id: "bogota-cocktail-sala-laura", name: "La Sala de Laura", neighborhood: "Chapinero Alto", coordinates: [4.6493, -74.0567],
    description: "Laura Hernández translates Colombian ecosystems into drinks built from local distillates, ferments, fruits, leaves, and careful nonalcoholic preparations. Sharing LEO's research foundation gives the menu unusual depth, but the intimate room remains warm rather than academic.",
    nightlifeType: "cocktail_bar", musicGenres: [], attributeTags: ["craft-cocktails", "Colombian-spirits", "reservation-recommended", "intimate"], price: "$$$",
    hours: { mon: "6:00 PM-11:00 PM", tue: "6:00 PM-11:00 PM", wed: "6:00 PM-11:00 PM", thu: "6:00 PM-11:00 PM", fri: "6:00 PM-11:00 PM", sat: "6:00 PM-11:00 PM", sun: "Closed" },
    officialUrl: "https://lasaladelaura.com/", bookingUrl: "https://lasaladelaura.com/", sourcePhoto: "https://lasaladelaura.com/wp-content/uploads/2026/04/DSC03202.webp",
  }),
  nightlife({
    id: "bogota-cocktail-huerta", name: "Huerta Bar Coctelería Artesanal", neighborhood: "Quinta Camacho", coordinates: [4.6531, -74.0612],
    description: "Huerta works garden herbs, Colombian fruit, house infusions, and a strong zero-proof sensibility into cocktails that feel fresh rather than confectionary. The planted Quinta Camacho house is relaxed enough for conversation, making it a useful first drink before later, louder rooms.",
    nightlifeType: "cocktail_bar", musicGenres: [], attributeTags: ["craft-cocktails", "garden", "zero-proof", "intimate"], price: "$$$",
    hours: { mon: "5:00 PM-12:00 AM", tue: "5:00 PM-12:00 AM", wed: "5:00 PM-12:00 AM", thu: "5:00 PM-12:00 AM", fri: "5:00 PM-12:00 AM", sat: "5:00 PM-12:00 AM", sun: "Closed" },
    officialUrl: "https://huertabar.com/", sourcePhoto: "https://img02.restaurantguru.com/cd17-Restaurant-Huerta-Cocteleria-Artesanal-interior-1.jpg", platformUrls: ["https://restaurantesenbogota.com/restaurante/huerta-bar-cocteleria-artesanal"],
  }),
  nightlife({
    id: "bogota-cocktail-aalto", name: "AALTO Bar-Bistró", neighborhood: "Chapinero Alto", coordinates: [4.6501, -74.0562],
    description: "AALTO treats cocktails and food as equal parts of a polished, music-conscious night. Precise classics, Colombian accents, a warm modernist room, and a bistro menu make it stronger for a full evening than a rushed pre-dinner stop.",
    nightlifeType: "cocktail_bar", musicGenres: ["curated DJs"], attributeTags: ["craft-cocktails", "bistro", "design", "reservation-recommended"], price: "$$$", hours: schedule.reservation,
    officialUrl: "https://aaltobistro.com/", bookingUrl: "https://aaltobistro.com/", sourcePhoto: "https://aaltobistro.com/wp-content/uploads/sites/34/2026/04/10.jpg", platformUrls: ["https://www.corner.inc/place/pDuNEadhquUS"],
  }),
  nightlife({
    id: "bogota-cocktail-apotecario", name: "Apotecario Bar at Oda", neighborhood: "Chapinero", coordinates: [4.6533, -74.0582],
    description: "Apotecario extends Oda's garden and biodiversity research into drinks with Colombian plants, ferments, tinctures, and savory structure. The bar works independently, but pairing it with dinner next door provides the clearest view of how the kitchen and liquid programs speak to each other.",
    nightlifeType: "cocktail_bar", musicGenres: [], attributeTags: ["craft-cocktails", "botanical", "zero-proof", "restaurant-bar"], price: "$$$",
    hours: { mon: "Closed", tue: "12:00 PM-10:00 PM", wed: "12:00 PM-10:00 PM", thu: "12:00 PM-10:00 PM", fri: "12:00 PM-10:00 PM", sat: "12:00 PM-10:00 PM", sun: "12:00 PM-5:00 PM" },
    officialUrl: "https://www.odarestaurante.com/en/apotecariobaroda", sourcePhoto: "https://static.wixstatic.com/media/e0504a_1d111d8208e1459baeeb588db274b0d8~mv2.jpg",
  }),
  nightlife({
    id: "bogota-cocktail-llorente", name: "Llorente Bar", neighborhood: "Quinta Camacho", coordinates: [4.6525, -74.0616],
    description: "Llorente combines a serious bar program, dinner, live music, and a handsome multi-level house. It becomes louder and more performance-driven later, so early reservations suit cocktail conversation while late arrivals should expect a dressed-up social room.",
    nightlifeType: "cocktail_bar", musicGenres: ["live music", "Latin"], attributeTags: ["craft-cocktails", "live-music", "dressy", "late-night"], price: "$$$",
    hours: { mon: "Closed", tue: "6:00 PM-1:00 AM", wed: "6:00 PM-1:00 AM", thu: "6:00 PM-3:00 AM", fri: "6:00 PM-3:00 AM", sat: "6:00 PM-3:00 AM", sun: "Closed" },
    officialUrl: "https://llorentebar.com/", sourcePhoto: "https://img.restaurantguru.com/w550/h367/r284-beverage-Llorente-Restaurante-Bar-2024-09.jpg", platformUrls: ["https://www.tripadvisor.co.nz/Restaurant_Review-g294074-d14202308-Reviews-Llorente_Bar-Bogota.html"],
  }),
  nightlife({
    id: "bogota-cocktail-apache", name: "Apache Rooftop Bar", neighborhood: "Parque de la 93", coordinates: [4.6765, -74.0478],
    description: "Apache crowns the Click Clack with broad northern-city views, burgers, DJs, and a direct party atmosphere. The cocktails are best understood as part of a rooftop night rather than quiet technical tasting; sunset reservations catch the room before the volume rises.",
    nightlifeType: "rooftop_bar", musicGenres: ["DJs", "electronic", "open-format"], attributeTags: ["rooftop", "views", "dance-floor", "reservation-recommended"], price: "$$$",
    hours: { mon: "12:00 PM-12:00 AM", tue: "12:00 PM-12:00 AM", wed: "12:00 PM-12:00 AM", thu: "12:00 PM-1:00 AM", fri: "1:00 PM-2:00 AM", sat: "1:00 PM-2:00 AM", sun: "Closed" },
    officialUrl: "https://www.clickclackhotel.com/en/hotel-clickclackbogota-in-bogota/restaurants/apache/", sourcePhoto: "https://www.clickclackhotel.com/media/uploads/cms_apps/imagenes/MSPH9729.jpg?q=pr:sharp/rs:fill/w:1920/h:1000/g:ce/f:jpg",
  }),
  nightlife({
    id: "bogota-cocktail-pedro-mandinga", name: "Pedro Mandinga Rum Bar Usaquén", neighborhood: "Usaquén", coordinates: [4.6991, -74.0313],
    description: "Pedro Mandinga centers its own Panamanian rum and a broader cane-spirit vocabulary in tropical, spice-driven drinks. The Usaquén room is colorful and convivial, ideal after the weekend market; use the branch-specific reservation page because Bogotá and Cartagena listings are easy to confuse.",
    nightlifeType: "cocktail_bar", musicGenres: ["Latin", "tropical"], attributeTags: ["rum", "craft-cocktails", "casual", "groups"], price: "$$$", hours: schedule.reservation,
    officialUrl: "https://pedromandinga.com/en/rum-bars/", bookingUrl: "https://pedromandinga.com/en/rum-bars/", sourcePhoto: "https://pedromandinga.com/wp-content/uploads/2026/07/reconocimiento-pedro-mandinga.webp", mapQuery: "Pedro Mandinga Rum Bar Calle 117 6A-05 Bogota",
  }),
  nightlife({
    id: "bogota-cocktail-continental", name: "Bar Continental", neighborhood: "Chapinero", coordinates: [4.6474, -74.0603],
    description: "Continental is a compact, warmly lit cocktail bar where classics, Colombian ingredients, vinyl-friendly atmosphere, and attentive bartenders matter more than spectacle. Its scale makes it a strong date or conversation bar, with later weekend hours but no need to chase a club mood.",
    nightlifeType: "cocktail_bar", musicGenres: ["vinyl", "soul", "jazz"], attributeTags: ["craft-cocktails", "intimate", "vinyl", "date-night"], price: "$$$",
    hours: { mon: "Closed", tue: "4:00 PM-1:00 AM", wed: "4:00 PM-1:00 AM", thu: "4:00 PM-1:00 AM", fri: "4:00 PM-2:00 AM", sat: "4:00 PM-2:00 AM", sun: "5:00 PM-12:00 AM" },
    officialUrl: "https://www.barcontinental.com/", sourcePhoto: "https://img.restaurantguru.com/w550/h367/rc67-Bar-Continental-interior-2024-12-3.jpg", platformUrls: ["https://www.tripadvisor.co/Restaurant_Review-g294074-d23289544-Reviews-Bar_Continental-Bogota.html"],
  }),
  nightlife({
    id: "bogota-cocktail-federal", name: "Federal Rooftop", neighborhood: "Chapinero", coordinates: [4.6468, -74.0638],
    description: "Federal is a high-energy rooftop built for late reservations, bottle-led groups, DJs, and a broad city view. Cocktails share attention with the party, and the dressier door makes it better for a planned night than an improvised neighborhood drink.",
    nightlifeType: "rooftop_bar", musicGenres: ["house", "open-format", "Latin"], attributeTags: ["rooftop", "views", "dance-floor", "dressy"], price: "$$$",
    hours: { mon: "9:00 PM-3:00 AM", tue: "9:00 PM-3:00 AM", wed: "9:00 PM-3:00 AM", thu: "9:00 PM-3:00 AM", fri: "8:00 PM-4:00 AM", sat: "9:00 PM-4:00 AM", sun: "9:00 PM-3:00 AM" },
    officialUrl: "https://federalrooftop.com/federal-cc/", bookingUrl: "https://federalrooftop.com/federal-cc/", sourcePhoto: "https://www.therooftopguide.com/rooftop-bars-in-bogota/Bilder/federal-rooftop-600-1.jpg",
  }),
  nightlife({
    id: "bogota-cocktail-bar-enano", name: "Bar Enano", neighborhood: "Chapinero", coordinates: [4.6492, -74.061],
    description: "Tucked into the El Bandido complex, Bar Enano compresses skilled bartending, a tiny counter, and classic proportions into a genuinely small room. It is strongest for one or two deliberate drinks before music next door; larger groups should choose somewhere designed to absorb them.",
    nightlifeType: "cocktail_bar", musicGenres: ["jazz nearby"], attributeTags: ["speakeasy", "intimate", "craft-cocktails", "date-night"], price: "$$$", hours: schedule.event,
    officialUrl: "https://www.instagram.com/barenano/", timetableUrl: "https://www.instagram.com/barenano/", sourcePhoto: "https://www.las2orillas.co/wp-content/uploads/2023/11/cocteles-en-bogota.jpg",
    editorialUrls: ["https://www.las2orillas.co/cinco-bares-de-bogota-perfectos-para-coctelear/"],
  }),
];

const cultureStops: GuideStop[] = [
  place({
    id: "bogota-culture-museo-oro", name: "Museo del Oro", neighborhood: "La Candelaria", coordinates: [4.6018403, -74.0718526],
    description: "More than a display of precious metal, the Gold Museum explains Indigenous technologies, exchange, cosmology, and the political meanings assigned to objects before and after colonization. Start upstairs and leave time for the dark, immersive Offering room rather than rushing only the most famous pieces.",
    category: "Culture", venueKind: "culture", attributeTags: ["archaeology", "Indigenous-history", "accessible", "major-museum"],
    hours: { mon: "Closed", tue: "9:00 AM-7:00 PM", wed: "9:00 AM-7:00 PM", thu: "9:00 AM-7:00 PM", fri: "9:00 AM-7:00 PM", sat: "9:00 AM-7:00 PM", sun: "10:00 AM-5:00 PM" },
    officialUrl: "https://www.banrepcultural.org/bogota/museo-del-oro/programe-su-visita", sourcePhoto: "https://upload.wikimedia.org/wikipedia/commons/5/51/Museo_Del_Oro%2C_Bogota_%2824799184280%29.jpg",
  }),
  place({
    id: "bogota-culture-museo-botero", name: "Museo Botero", neighborhood: "La Candelaria", coordinates: [4.5966918, -74.0730851],
    description: "Fernando Botero's donation places his own paintings and sculptures beside works by Picasso, Monet, Degas, Beckmann, Bacon, and Latin American peers in a gracious colonial house. Free entry encourages repeat looking; the international collection gives valuable context to Botero's distortions of volume.",
    category: "Culture", venueKind: "culture", attributeTags: ["art", "free-entry", "Botero", "colonial-architecture"],
    hours: { mon: "9:00 AM-7:00 PM", tue: "Closed", wed: "9:00 AM-7:00 PM", thu: "9:00 AM-7:00 PM", fri: "9:00 AM-7:00 PM", sat: "9:00 AM-7:00 PM", sun: "10:00 AM-5:00 PM" },
    officialUrl: "https://www.banrepcultural.org/bogota/museo-botero/programe-su-visita", sourcePhoto: "https://upload.wikimedia.org/wikipedia/commons/4/48/2019_Bogot%C3%A1_-_Entrada_del_Museo_Botero.jpg",
  }),
  place({
    id: "bogota-culture-museo-nacional", name: "Museo Nacional de Colombia", neighborhood: "San Martín", coordinates: [4.6155238, -74.0684131],
    description: "A former panopticon now holds a national collection that moves between archaeology, colonial power, Independence, art, conflict, and changing ideas of citizenship. The building's prison geometry is inseparable from the interpretation; temporary exhibitions often sharpen perspectives the older displays leave unresolved.",
    category: "Culture", venueKind: "culture", attributeTags: ["national-history", "art", "architecture", "major-museum"],
    hours: { mon: "Closed", tue: "9:00 AM-5:00 PM", wed: "9:00 AM-5:00 PM", thu: "9:00 AM-5:00 PM", fri: "9:00 AM-5:00 PM", sat: "9:00 AM-5:00 PM", sun: "9:00 AM-5:00 PM" },
    officialUrl: "https://www.museonacional.gov.co/su-visita/Paginas/su-visita.aspx", sourcePhoto: "https://upload.wikimedia.org/wikipedia/commons/1/14/Entrada_Principal_del_Museo_Nacional_de_Colombia.jpg",
  }),
  place({
    id: "bogota-culture-mambo", name: "MAMBO", neighborhood: "Centro Internacional", coordinates: [4.6100168, -74.0693026],
    description: "The Museum of Modern Art of Bogotá uses Rogelio Salmona's brick building for changing Colombian and international exhibitions rather than a fixed chronological march. Check what is installed: ambitious surveys, contemporary commissions, cinema, and periods between shows can radically alter the visit.",
    category: "Culture", venueKind: "culture", attributeTags: ["modern-art", "contemporary-art", "architecture", "temporary-exhibitions"],
    hours: { mon: "Closed", tue: "10:00 AM-6:00 PM", wed: "10:00 AM-6:00 PM", thu: "10:00 AM-6:00 PM", fri: "10:00 AM-6:00 PM", sat: "10:00 AM-6:00 PM", sun: "12:00 PM-5:00 PM" },
    officialUrl: "https://www.mambogota.com/visitanos/", sourcePhoto: "https://www.mambogota.com/wp-content/uploads/2024/07/mambo-fachada-1-min-scaled.jpg",
  }),
  place({
    id: "bogota-culture-santa-clara", name: "Museo Santa Clara", neighborhood: "La Candelaria", coordinates: [4.5968372, -74.0774643],
    description: "This former convent church preserves a dense seventeenth- and eighteenth-century interior of paintings, gilded carving, screens, and devotional objects. The compact space rewards slow looking at how images covered nearly every surface and how enclosure shaped the lives of Clarissan nuns.",
    category: "Culture", venueKind: "culture", attributeTags: ["colonial-art", "religious-history", "architecture", "compact"],
    hours: { mon: "Closed", tue: "9:00 AM-5:00 PM", wed: "9:00 AM-5:00 PM", thu: "9:00 AM-5:00 PM", fri: "9:00 AM-5:00 PM", sat: "9:00 AM-5:00 PM", sun: "9:00 AM-5:00 PM" },
    officialUrl: "https://museocolonial.gov.co/museo-santa-clara/Paginas/default.aspx", sourcePhoto: "https://upload.wikimedia.org/wikipedia/commons/2/22/Museo_Iglesia_Santa_Clara_%28Bogot%C3%A1%29_01.JPG",
  }),
  place({
    id: "bogota-culture-museo-bogota", name: "Museo de Bogotá — Casa Sámano", neighborhood: "La Candelaria", coordinates: [4.5969, -74.0703],
    description: "Casa Sámano uses maps, photographs, domestic objects, urban debates, and rotating projects to treat Bogotá itself as the collection. It is especially useful after walking the center, because its exhibitions connect street patterns and civic change to lived experience rather than presenting a simple founding myth.",
    category: "Culture", venueKind: "culture", attributeTags: ["city-history", "urbanism", "free-entry", "historic-house"],
    hours: { mon: "Closed", tue: "9:00 AM-6:00 PM", wed: "9:00 AM-6:00 PM", thu: "9:00 AM-6:00 PM", fri: "9:00 AM-6:00 PM", sat: "10:00 AM-5:00 PM", sun: "10:00 AM-5:00 PM" },
    officialUrl: "https://idpc.gov.co/servicios/actividades-educativas-y-culturales-del-museo-de-bogota/", sourcePhoto: "https://idpc.gov.co/wp-content/uploads/2019/12/IDPC_Palomar-min-scaled.jpg",
  }),
  place({
    id: "bogota-culture-quinta-bolivar", name: "Casa Museo Quinta de Bolívar", neighborhood: "Las Aguas", coordinates: [4.6056, -74.0587],
    description: "Simón Bolívar's hillside country house combines political biography with gardens, domestic rooms, period objects, and the construction of national memory. Its strongest interpretation comes from noticing what successive governments restored or invented, not treating every furnished room as untouched evidence.",
    category: "Culture", venueKind: "culture", attributeTags: ["Independence-history", "historic-house", "gardens", "political-history"],
    hours: { mon: "Closed", tue: "9:00 AM-5:00 PM", wed: "9:00 AM-5:00 PM", thu: "9:00 AM-5:00 PM", fri: "9:00 AM-5:00 PM", sat: "9:00 AM-5:00 PM", sun: "9:00 AM-5:00 PM" },
    officialUrl: "https://quintadebolivar.gov.co/programacion", sourcePhoto: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Quinta_de_Bol%C3%ADvar.JPG",
  }),
  place({
    id: "bogota-culture-fragmentos", name: "Fragmentos, Espacio de Arte y Memoria", neighborhood: "Santa Bárbara", coordinates: [4.5939, -74.0758],
    description: "Doris Salcedo's counter-monument uses melted weapons surrendered by the FARC to form a scarred floor beneath changing artworks and public conversations. The space resists triumphal monuments, centering victims and unfinished memory; allow time for the interpretation rather than treating the material as a photo fact.",
    category: "Culture", venueKind: "culture", attributeTags: ["memory", "contemporary-art", "peace-process", "free-entry"],
    hours: { mon: "Closed", tue: "10:00 AM-6:00 PM", wed: "10:00 AM-6:00 PM", thu: "10:00 AM-6:00 PM", fri: "10:00 AM-6:00 PM", sat: "10:00 AM-6:00 PM", sun: "10:00 AM-5:00 PM" },
    officialUrl: "https://www.fragmentos.gov.co/Paginas/default.aspx", sourcePhoto: "https://bogota.gov.co/sites/default/files/inline-images/inauguracion-fragmentos-de-doris-salcedo.jpg",
    editorialUrls: ["https://bogota.gov.co/que-hacer/cultura/inauguracion-de-fragmentos-espacio-de-arte-y-memoria"],
  }),
  place({
    id: "bogota-culture-delia-zapata", name: "Centro Nacional de las Artes Delia Zapata Olivella", neighborhood: "La Candelaria", coordinates: [4.5963, -74.0745],
    description: "The national arts complex links the restored Teatro Colón with new halls for theatre, dance, music, and interdisciplinary work. It is a performance destination rather than a walk-through monument: choose a dated production and confirm which entrance and hall the ticket names.",
    category: "Culture", venueKind: "event_venue", attributeTags: ["performing-arts", "theatre", "dance", "architecture"], hours: schedule.event,
    officialUrl: "https://eneldelia.gov.co/", timetableUrl: "https://eneldelia.gov.co/", sourcePhoto: "https://eneldelia.gov.co/wp-content/uploads/2026/07/lenguaje-de-las-piedras-feed-en-tamano-grande.jpeg",
  }),
  place({
    id: "bogota-culture-cinemateca", name: "Cinemateca de Bogotá", neighborhood: "Las Nieves", coordinates: [4.6036, -74.0683],
    description: "Bogotá's public cinematheque combines multiple screens with a media library, galleries, labs, talks, festivals, and Colombian film preservation. The value is in the dated program—repertory cinema, premieres, experimental work, and free exhibitions—so select a screening rather than merely touring the building.",
    category: "Culture", venueKind: "culture", attributeTags: ["film", "media-arts", "public-programming", "accessible"],
    hours: { mon: "Closed", tue: "10:00 AM-8:00 PM", wed: "10:00 AM-8:00 PM", thu: "10:00 AM-8:00 PM", fri: "10:00 AM-8:00 PM", sat: "10:00 AM-8:00 PM", sun: "11:00 AM-6:00 PM", default: "Public-holiday opening is 11:00 AM-6:00 PM; individual screenings start at the times published in the official Cinemateca agenda." },
    officialUrl: "https://cinematecadebogota.gov.co/visita/informacion-general", timetableUrl: "https://cinematecadebogota.gov.co/cartelera", sourcePhoto: "https://cinematecadebogota.gov.co/sites/default/files/2023-11/visitas_general%201.png",
  }),
];

const activityStops: GuideStop[] = [
  place({
    id: "bogota-activities-monserrate", name: "Cerro de Monserrate", neighborhood: "Eastern Hills", coordinates: [4.6057, -74.0563],
    description: "Monserrate's 3,152-meter summit gives the clearest reading of Bogotá's immense plateau and eastern mountain wall. Funicular, cable car, and the steep pilgrimage path operate differently, and altitude plus rapidly changing weather reward an early visit with layers and conservative pacing.",
    category: "Activities", venueKind: "landmark", attributeTags: ["viewpoint", "cable-car", "high-altitude", "pilgrimage"],
    hours: { mon: "6:30 AM-10:00 PM", tue: "6:30 AM-10:00 PM", wed: "6:30 AM-10:00 PM", thu: "6:30 AM-10:00 PM", fri: "6:30 AM-10:00 PM", sat: "6:30 AM-10:00 PM", sun: "5:30 AM-6:00 PM", default: "Funicular, cable-car, trail, and holiday sessions are maintained separately on Monserrate's official operating calendar." },
    officialUrl: "https://monserrate.co/", timetableUrl: "https://monserrate.co/", sourcePhoto: "https://monserrate.co/static/img/social-shared.aff78ee48389.jpg",
  }),
  place({
    id: "bogota-activities-ciclovia", name: "Ciclovía Bogotá", neighborhood: "Citywide", coordinates: [4.648, -74.06],
    description: "On Sundays and holidays, Bogotá turns a vast road network over to bicycles, skates, runners, families, aerobics stages, and snack stops. Join a central segment rather than attempting the entire system, and check the week's official route bulletin for construction or event diversions.",
    category: "Activities", venueKind: "outdoors", attributeTags: ["cycling", "free", "family-friendly", "citywide"],
    hours: { mon: "Public holidays 7:00 AM-2:00 PM", tue: "Closed", wed: "Closed", thu: "Closed", fri: "Closed", sat: "Closed", sun: "7:00 AM-2:00 PM", default: "The IDRD route bulletin publishes holiday operation, closures, and temporary segment changes." },
    officialUrl: "https://www.idrd.gov.co/ciclovia", timetableUrl: "https://www.idrd.gov.co/ciclovia", sourcePhoto: commons("Ciclovía Bogotá.jpg"),
  }),
  place({
    id: "bogota-activities-paloquemao", name: "Plaza de Mercado Paloquemao", neighborhood: "Paloquemao", coordinates: [4.6155, -74.0826],
    description: "Paloquemao is the city's most expansive food-market lesson: tropical fruit, Andean tubers, herbs, fish, meat, flowers, dairy, and prepared breakfasts move at working-market speed. Go early, ask before photographing people, taste selectively, and keep valuables unobtrusive in the crowded aisles.",
    category: "Activities", venueKind: "food_drink", attributeTags: ["public-market", "food", "flowers", "early-morning"],
    hours: { mon: "4:00 AM-4:30 PM", tue: "4:00 AM-4:30 PM", wed: "4:00 AM-4:30 PM", thu: "4:00 AM-4:30 PM", fri: "4:00 AM-4:30 PM", sat: "4:00 AM-4:30 PM", sun: "4:00 AM-2:00 PM", default: "Holy Week and public-holiday adjustments are announced by the market and city bulletins." },
    officialUrl: "https://plazadepaloquemao.com/", sourcePhoto: commons("Plaza de Mercado de Paloquemao.jpg"),
    editorialUrls: ["https://www.tropicanafm.com/2026/confirman-horarios-en-corabastos-y-paloquemao-para-semana-santa-abriran-el-viernes-santo-462287.html"],
  }),
  place({
    id: "bogota-activities-graffiti-tour", name: "Bogotá Graffiti Tour", neighborhood: "La Candelaria", coordinates: [4.6008, -74.0692],
    description: "This artist-linked walking tour explains murals through technique, neighborhood politics, Indigenous imagery, protest, commercialization, and the city's evolving street-art rules. Book the current official departure and tip responsibly; the value lies in interpretation and artist context, not just a mural backdrop.",
    category: "Activities", venueKind: "service", attributeTags: ["street-art", "walking-tour", "artist-led", "city-history"], hours: { default: "Daily tours depart at 10:00 AM and 2:00 PM; private tours and workshops use the times confirmed on the official booking page." },
    officialUrl: "https://bogotagraffiti.com/", bookingUrl: "https://bogotagraffiti.com/", sourcePhoto: "https://bogotagraffiti.com/wp-content/uploads/2026/07/Galleries_02.jpg",
  }),
  place({
    id: "bogota-activities-usaquen-market", name: "Mercado de las Pulgas de Usaquén", neighborhood: "Usaquén", coordinates: [4.695, -74.0306],
    description: "Usaquén's weekend flea market fills lanes and courtyards with independent crafts, prints, jewelry, food, vintage objects, and plenty of uneven souvenir stock. Arrive near opening for easier browsing, compare makers before buying, and combine the market with the district's brick church and side streets.",
    category: "Activities", venueKind: "retail", attributeTags: ["weekend-market", "crafts", "shopping", "walkable"],
    hours: { mon: "Public-holiday Mondays 9:00 AM-5:30 PM", tue: "Closed", wed: "Closed", thu: "Closed", fri: "Closed", sat: "9:00 AM-5:30 PM", sun: "9:00 AM-5:30 PM" },
    officialUrl: "https://www.mercadopulgasusaquen.com/", sourcePhoto: "https://www.mercadopulgasusaquen.com/wp-content/uploads/2021/07/IMG_20210613_114847-scaled.jpg",
  }),
  place({
    id: "bogota-activities-jardin-botanico", name: "Jardín Botánico de Bogotá", neighborhood: "Engativá", coordinates: [4.6686, -74.1003],
    description: "The botanical garden interprets Colombian high-Andean and páramo ecosystems through living collections, a tropicarium, wetlands, orchids, palms, and environmental programs. The modern tropicarium adds timed capacity to a spacious outdoor visit, so book it separately when the official ticket page requires.",
    category: "Activities", venueKind: "outdoors", attributeTags: ["botanical-garden", "páramo", "family-friendly", "accessible"],
    hours: { mon: "Closed", tue: "8:00 AM-5:00 PM", wed: "8:00 AM-5:00 PM", thu: "8:00 AM-5:00 PM", fri: "8:00 AM-5:00 PM", sat: "9:00 AM-5:00 PM", sun: "9:00 AM-5:00 PM", default: "Tropicarium timed entry and public-holiday maintenance changes are published in the garden's official ticket calendar." },
    officialUrl: "https://jbb.gov.co/descripcion-general/", bookingUrl: "https://jbb.gov.co/", sourcePhoto: commons("Jardín Botánico de Bogotá.jpg"),
  }),
  place({
    id: "bogota-activities-simon-bolivar", name: "Parque Metropolitano Simón Bolívar", neighborhood: "Teusaquillo", coordinates: [4.6581, -74.0934],
    description: "Bogotá's great metropolitan park provides a lake, long walking and cycling loops, lawns, playgrounds, bird habitat, and room to understand how residents use public space at altitude. Major festivals can transform or restrict entire sectors, so consult the IDRD event notice before planning a quiet circuit.",
    category: "Activities", venueKind: "outdoors", attributeTags: ["urban-park", "walking", "cycling", "family-friendly"],
    hours: { mon: "6:00 AM-6:00 PM", tue: "6:00 AM-6:00 PM", wed: "6:00 AM-6:00 PM", thu: "6:00 AM-6:00 PM", fri: "6:00 AM-6:00 PM", sat: "6:00 AM-6:00 PM", sun: "6:00 AM-6:00 PM", default: "Festival closures and extended event access are published through the IDRD venue calendar." },
    officialUrl: "https://www.idrd.gov.co/parque-metropolitano-simon-bolivar", sourcePhoto: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Bogota-_Parque_Sim%C3%B3n_Bolivar.jpg",
  }),
  place({
    id: "bogota-activities-virgilio-barco", name: "Biblioteca Pública Virgilio Barco", neighborhood: "Teusaquillo", coordinates: [4.6570563, -74.0884676],
    description: "Rogelio Salmona's circular brick library folds ramps, water, roof terraces, reading rooms, and park views into one of Bogotá's defining public buildings. Use it as a library—enter quietly and respect readers—then follow the exterior paths to understand how architecture controls horizon and movement.",
    category: "Activities", venueKind: "culture", attributeTags: ["architecture", "library", "free", "accessible"],
    hours: { mon: "Closed", tue: "8:00 AM-7:00 PM", wed: "8:00 AM-7:00 PM", thu: "8:00 AM-7:00 PM", fri: "8:00 AM-7:00 PM", sat: "8:00 AM-7:00 PM", sun: "10:00 AM-5:00 PM", default: "Public-holiday Mondays are closed; special programming follows BibloRed's dated calendar." },
    officialUrl: "https://www.biblored.gov.co/index.php/bibliotecas/biblioteca-virgilio", sourcePhoto: "https://biblored.gov.co/sites/default/files/styles/max_1200x1200/public/2022-09/VIRGILIODORN.jpg?itok=UQIi1eCV",
  }),
  place({
    id: "bogota-activities-quebrada-vieja", name: "Sendero Quebrada La Vieja", neighborhood: "Eastern Hills", coordinates: [4.6515, -74.0447],
    description: "This protected eastern-hills trail rises through recovering Andean forest to several viewpoints above Chapinero. Entry is controlled to protect the watershed: reserve an exact session, carry identification, start with the authorized group, and expect closures when rain or restoration work makes the path unsafe.",
    category: "Activities", venueKind: "outdoors", attributeTags: ["hiking", "reservation-required", "Andean-forest", "viewpoint"],
    hours: { mon: "Closed", tue: "5:45 AM-11:00 AM", wed: "5:45 AM-11:00 AM", thu: "5:45 AM-11:00 AM", fri: "5:45 AM-11:00 AM", sat: "5:45 AM-12:00 PM", sun: "5:45 AM-12:00 PM", default: "A dated reservation on the official Caminos de los Cerros Orientales platform is required; rain, fire risk, and restoration closures are posted there." },
    officialUrl: "https://caminos.eaab.gov.co/", bookingUrl: "https://caminos.eaab.gov.co/", sourcePhoto: commons("Quebrada La Vieja Bogotá.jpg"),
  }),
  place({
    id: "bogota-activities-catedral-sal", name: "Catedral de Sal de Zipaquirá", neighborhood: "Zipaquirá", coordinates: [5.018, -74.0104],
    description: "A monumental underground church and visitor route occupy chambers carved within a former salt mine beneath Zipaquirá. Lighting and religious staging dominate the experience more than industrial archaeology; allow a full half-day from Bogotá and book a timed entry around traffic and altitude.",
    category: "Activities", venueKind: "landmark", attributeTags: ["day-trip", "underground", "architecture", "timed-entry"],
    hours: { mon: "9:00 AM-4:40 PM", tue: "9:00 AM-4:40 PM", wed: "9:00 AM-4:40 PM", thu: "9:00 AM-4:40 PM", fri: "9:00 AM-4:40 PM", sat: "9:00 AM-4:40 PM", sun: "9:00 AM-4:40 PM", default: "The final ticket sale is 4:40 PM under the official operating schedule effective July 1, 2026." },
    officialUrl: "https://www.catedraldesal.gov.co/", bookingUrl: "https://www.catedraldesal.gov.co/", sourcePhoto: commons("Catedral de Sal de Zipaquirá.jpg"),
    editorialUrls: ["https://www.catedraldesal.gov.co/noticias/nuevo-horario-de-la-catedral-de-sal-de-zipaquira-desde-julio-conozca-los-cambios-para-planear-su-visita/"],
  }),
];

function guideSources(primary: ListSource[], stops: GuideStop[]): ListSource[] {
  const combined = [
    ...primary,
    ...stops.map((item) =>
      source(
        `${item.name} venue source`,
        item.officialUrl ?? item.sourceEvidence?.officialUrl ?? maps(`${item.name} Bogota Colombia`),
      ),
    ),
  ];
  return [...new Map(combined.map((item) => [item.url, item])).values()];
}

function guide(
  id: string,
  title: string,
  category: ListCategory,
  seoSlug: string,
  seoTitle: string,
  seoDescription: string,
  description: string,
  stops: GuideStop[],
  primarySources: ListSource[],
): MapList {
  return {
    id,
    slug: id,
    seoSlug,
    seoTitle,
    seoDescription,
    title,
    description,
    photo: stops[0]?.photo,
    url: `/list/${id}`,
    category,
    location: bogotaLocation,
    creator: { id: "rguide-editorial", name: "R Guide Editorial", avatar: avatar(category) },
    upvotes: 0,
    createdAt,
    stops,
    sources: guideSources(primarySources, stops),
  };
}

const officialTourism = source("Visit Bogotá official tourism guide", "https://visitbogota.co/en/what-to-do-in-bogota");
const officialDining = source("Visit Bogotá official dining guide", "https://visitbogota.co/en/where-eat");
const gastronomicZones = source("Bogotá official gastronomic zones", "https://bogota.gov.co/mi-ciudad/cultura-recreacion-y-deporte/zonas-gastronomicas-de-bogota");
const colombiaTravelDining = source("Colombia Travel: Bogotá gastronomic capital", "https://colombia.travel/en/encanto/bogota-gastronomic-capital");
const fiftyBest = source("Latin America's 50 Best Restaurants 2025", "https://www.theworlds50best.com/latinamerica/en/list/1-50");
const hostelworld = source("Hostelworld Bogotá listings and 2026 reviews", "https://www.hostelworld.com/hostels/south-america/colombia/bogota/");
const condeNastHotels = source("Condé Nast Traveler Bogotá hotel guide", "https://www.cntraveler.com/category/hotel/bogota");
const eaterBars = source("Eater Bogotá bars and clubs guide", "https://www.eater.com/maps/best-bogota-bars-clubs-drinks-salsa");
const officialNightlife = source("Bogotá official Chapinero culture and nightlife guide", "https://visitbogota.co/en/what-to-do-in-bogota/culture/chapinero");
const officialMuseums = source("Bogotá official museum hours and visitor guide", "https://bogota.gov.co/mi-ciudad/cultura-recreacion-y-deporte/horarios-y-precios-de-entrada-los-museos-de-bogota-foto");
const elPais2026 = source("El País Bogotá culture and nightlife guide, April 2026", "https://elpais.com/elviajero/2026-04-25/bogota-una-cima-del-arte-la-gastronomia-y-el-alegre-despiporre-urbanistico.html");
const elPais24Hours = source("El País: 24 hours in Bogotá, March 2026", "https://elpais.com/elviajero/guia-el-viajero/2026-03-21/que-hacer-24-horas-en-bogota-del-barrio-de-la-candelaria-a-lo-alto-del-cerro-monserrate.html");

export const bogotaCitywideGuides: MapList[] = [
  guide(
    "list-bogota-best-restaurants",
    "Biodiversity Menus, Wood Fire & Modern Colombian Tables",
    "Food",
    "best-restaurants",
    "Best Restaurants in Bogotá",
    "The best restaurants in Bogotá for Colombian biodiversity, tasting menus, wood fire, fermentation, market-driven cooking, and polished neighborhood dining.",
    "Bogotá's strongest restaurants turn the country's extraordinary biological and cultural range into specific culinary ideas. This selection balances destination tasting menus with wood-fired lunch, generous neighborhood rooms, regional ingredients, coffee, vegetables, and service styles suited to different appetites.",
    diningStops,
    [officialDining, fiftyBest, colombiaTravelDining],
  ),
  guide(
    "list-bogota-best-cheap-eats",
    "Market Lunches, Santafereño Breakfasts & Serious Coffee",
    "Food",
    "best-cheap-eats",
    "Best Cheap Eats in Bogotá",
    "The best cheap eats in Bogotá for ajiaco, tamales, empanadas, public markets, vegetarian lunch, tacos, historic pastry shops, and Colombian coffee.",
    "Affordable Bogotá is strongest when the stop has a clear specialty: market kitchens, a century-old empanada room, chocolate santafereño, a balanced vegetarian set lunch, a branch-specific taco counter, and cafés that connect the cup to Colombian producers. Go early for markets and respect their working rhythm.",
    cheapEatStops,
    [officialDining, gastronomicZones, colombiaTravelDining],
  ),
  guide(
    "list-bogota-best-hotels",
    "Historic Houses, Design Stays & Full-Service Retreats",
    "Stay",
    "best-hotels",
    "Best Hotels in Bogotá",
    "The best hotels in Bogotá for heritage architecture, independent design, rooftop pools, serious spas, business stays, and walkable northern or historic-center bases.",
    "Bogotá's hotel geography matters as much as thread count. These ten stays separate historic houses from contemporary towers, intimate local design from international full service, and museum access from northern dining and business convenience, with candid attention to room scale, nightlife noise, facilities, and long cross-city journeys.",
    hotelStops,
    [condeNastHotels, officialTourism],
  ),
  guide(
    "list-bogota-best-hostels",
    "Colonial Courtyards, Social Houses & Coworking Bases",
    "Stay",
    "best-hostels",
    "Best Hostels in Bogotá",
    "The best hostels in Bogotá for social courtyards, roof terraces, spa facilities, coworking, quiet rooms, historic-center access, and Chapinero neighborhood life.",
    "Bogotá's hostel scene clusters in La Candelaria but ranges from garden houses and long-running independent bases to large social compounds, spa hostels, and modern coworking buildings. Choose by desired noise level, neighborhood, programmed activity, room privacy, and willingness to travel north after dark.",
    hostelStops,
    [hostelworld, officialTourism],
  ),
  guide(
    "list-bogota-best-casual-bars",
    "No-Frills Dance Floors, Beer Courtyards & Independent Rooms",
    "Nightlife",
    "best-dive-bars",
    "Best Dive Bars in Bogotá",
    "The best dive bars and independent nightlife rooms in Bogotá for salsa, live music, queer parties, experimental sound, cheap beer, courtyards, and event-led nights.",
    "Bogotá's dive-bar spirit lives as much in independent stages and unvarnished dance floors as old taverns. Salsa institutions, queer rooms, experimental listening bars, warehouse projects, and brewpub courtyards change character with the night's program.",
    casualBarStops,
    [eaterBars, officialNightlife, elPais2026],
  ),
  guide(
    "list-bogota-best-cocktail-bars",
    "Colombian Spirits, Botanical Drinks & Rooftop Nights",
    "Nightlife",
    "best-cocktail-bars",
    "Best Cocktail Bars in Bogotá",
    "The best cocktail bars in Bogotá for Colombian spirits, biodiversity-driven drinks, intimate classics, live music, rooftops, rum, zero-proof menus, and late-night energy.",
    "Bogotá's best drinks can express local ecosystems, cane spirits, garden botanicals, classic technique, or the social force of a rooftop. This selection distinguishes intimate conversation bars from restaurant labs and high-volume late rooms so the setting, reservation, and music fit the night you actually want.",
    cocktailBarStops,
    [eaterBars, officialNightlife, elPais2026],
  ),
  guide(
    "list-bogota-best-culture",
    "Gold, Modern Art, Memory & Public Performance",
    "Culture",
    "best-culture",
    "Best Museums and Culture in Bogotá",
    "The best museums and cultural sites in Bogotá for Indigenous gold, Botero, national history, modern art, colonial interiors, conflict memory, architecture, performance, and film.",
    "Bogotá's cultural institutions are strongest when read together: Indigenous material knowledge, colonial devotion, national mythmaking, modern and contemporary art, urban history, conflict memory, cinema, and live performance complicate one another. Verify the closure day and choose dated programs for performance-led spaces.",
    cultureStops,
    [officialMuseums, officialTourism, elPais2026],
  ),
  guide(
    "list-bogota-best-things-to-do",
    "Mountain Views, Public Markets & Civic Bogotá",
    "Activities",
    "best-things-to-do",
    "Best Things to Do in Bogotá",
    "The best things to do in Bogotá for Monserrate views, Ciclovía, food markets, street art, botanical collections, public architecture, forest hiking, and Zipaquirá.",
    "Bogotá's most revealing activities connect high-altitude landscape with everyday civic life: a mountain pilgrimage, citywide cycling, working food markets, public libraries and parks, protected forest, and artist-led street interpretation. Weather, reservations, traffic, and Sunday schedules are practical parts of each experience.",
    activityStops,
    [officialTourism, elPais24Hours, elPais2026],
  ),
];
