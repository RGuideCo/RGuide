import type { GuideStop, ListCategory, ListSource, MapList } from "@/types";
import { buildNatureGuide } from "@/data/guides/nature-guide-builder";

const createdAt = "2026-08-26T00:00:00.000Z";
const checkedAt = "2026-08-26";

const valenciaLocation = {
  city: "Valencia",
  country: "Spain",
  continent: "Europe",
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

type StopOptions = Partial<GuideStop> & {
  sourcePhoto: string;
  officialUrl: string;
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
    sourcePhoto,
    officialUrl,
    editorialUrls = [],
    mapQuery,
    bookingUrl,
    sourceEvidence,
    imageSourceUrl,
    sourceUrls: extraSourceUrls = [],
    ...rest
  } = options;
  const mapUrl =
    sourceEvidence?.mapUrl ?? maps(mapQuery ?? `${name} Valencia Spain`);
  const imageUrl = imageSourceUrl ?? sourcePhoto;
  const sourceUrls = [
    officialUrl,
    bookingUrl,
    mapUrl,
    imageUrl,
    ...editorialUrls,
    ...extraSourceUrls,
  ].filter((url): url is string => Boolean(url));

  return {
    id,
    name,
    coordinates,
    description,
    photo: sourcePhoto,
    imageSourceUrl: imageUrl,
    sourceUrls: [...new Set(sourceUrls)],
    sourceEvidence: {
      officialUrl,
      mapUrl,
      currentStatusUrl: mapUrl,
      imageSourceUrl: imageUrl,
      editorialUrls,
      checkedAt,
      notes:
        "Valencia source ledger checked the official or booking page, current map-status evidence, category coverage, hours, and a venue-specific image candidate on 2026-08-26; weaker or closed candidates were excluded.",
      ...sourceEvidence,
    },
    officialUrl,
    ...(bookingUrl ? { bookingUrl } : {}),
    ...rest,
  };
}

function guideSources(overviews: ListSource[], stops: GuideStop[]) {
  const combined = [
    ...overviews,
    ...stops.flatMap((item) => [
      source(
        `${item.name} official visitor information`,
        item.officialUrl ?? item.sourceEvidence?.officialUrl ?? "",
      ),
      ...(item.bookingUrl
        ? [source(`${item.name} booking page`, item.bookingUrl)]
        : []),
    ]),
  ].filter((item) => item.url);
  return [...new Map(combined.map((item) => [item.url, item])).values()];
}

const diningStops: GuideStop[] = [
  stop(
    "valencia-dining-ricard-camarena",
    "Ricard Camarena Restaurant",
    [39.4852238, -0.3851157],
    "Ricard Camarena's two-star flagship at Bombas Gens builds long tasting menus around Valencian vegetables, seafood, and produce from the restaurant's own agricultural research. The room is formal, but the cooking keeps returning to the huerta rather than luxury for its own sake.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["valencian", "creative", "tasting_menu"],
      price: "$$$$",
      priceSource: "Official tasting-menu and reservation pages",
      attributeTags: [
        "fine_dining",
        "tasting_menu",
        "destination_dining",
        "reservation_recommended",
      ],
      hours: {
        mon: "Closed",
        tue: "Dinner arrivals 8:00 PM-9:30 PM",
        wed: "Dinner arrivals 8:00 PM-9:30 PM",
        thu: "Dinner arrivals 8:00 PM-9:30 PM",
        fri: "Lunch arrivals 1:30 PM-3:00 PM; dinner arrivals 8:00 PM-9:30 PM",
        sat: "Lunch arrivals 1:30 PM-3:00 PM; dinner arrivals 8:00 PM-9:30 PM",
        sun: "Closed",
      },
      officialUrl: "https://ricardcamarena.com/servicio/ricard-camarena-lab/",
      sourcePhoto:
        "https://ricardcamarena.com/wp-content/uploads/2022/11/ricard-camarena-oxalis-huerta-valenciana.jpg",
      editorialUrls: [
        "https://ricardcamarena.com/en/",
        "https://guide.michelin.com/es/en/comunidad-valenciana/valencia/restaurant/ricard-camarena",
        "https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy/where-to-eat-restaurant-valencia",
      ],
    },
  ),
  stop(
    "valencia-dining-el-poblet",
    "El Poblet",
    [39.4697359, -0.3745085],
    "Chef Luis Valls interprets Valencia's landscape through a precise two-star tasting menu inside Quique Dacosta's city restaurant. Rice, preserved fish, citrus, and coastal ingredients appear as a coherent regional argument rather than a checklist.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["valencian", "creative", "tasting_menu"],
      price: "$$$$",
      priceSource: "Official reservation page / MICHELIN Guide",
      attributeTags: [
        "fine_dining",
        "tasting_menu",
        "date_night",
        "reservation_recommended",
      ],
      hours: {
        mon: "Closed",
        tue: "8:30 PM-12:30 AM",
        wed: "1:30 PM-5:30 PM; 8:30 PM-12:30 AM",
        thu: "1:30 PM-5:30 PM; 8:30 PM-12:30 AM",
        fri: "1:30 PM-5:30 PM; 8:30 PM-12:30 AM",
        sat: "1:30 PM-5:30 PM; 8:30 PM-12:30 AM",
        sun: "Closed",
      },
      officialUrl: "https://www.elpobletrestaurante.com/",
      sourcePhoto:
        "https://tinyurbankitchen.com/wp-content/uploads/2022/05/dsc05673-147.jpg",
      editorialUrls: [
        "https://experiencesvalencia.com/gastronomia-en-valencia/el-poblet-restaurante/",
        "https://guide.michelin.com/es/en/comunidad-valenciana/valencia/restaurant/el-poblet",
        "https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy/where-to-eat-restaurant-valencia",
      ],
    },
  ),
  stop(
    "valencia-dining-la-salita",
    "La Salita",
    [39.4624613, -0.3695473],
    "Begoña Rodrigo serves vegetable-led Valencian tasting menus in a restored mansion with a garden and distinct rooms. Her work with local seeds, pickles, and the region's coastal produce makes this a personal destination meal, not just a beautiful setting.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["valencian", "vegetable_forward", "tasting_menu"],
      price: "$$$$",
      priceSource: "Official restaurant and reservation pages",
      attributeTags: [
        "fine_dining",
        "tasting_menu",
        "garden",
        "reservation_recommended",
      ],
      hours: {
        default:
          "Mon-Sat kitchen 1:30 PM-3:30 PM and 8:30 PM-11:30 PM; closed Sunday. The official booking calendar controls holiday and private-event exceptions.",
      },
      officialUrl: "https://www.anarkiagroup.com/la-salita-restaurante",
      sourcePhoto:
        "https://images.squarespace-cdn.com/content/v1/5f7ed58ccc71095920c875f8/b029f988-cdd1-4fc6-862c-b14a48dfb619/PHOTO-2025-05-06-11-14-41+%283%29.jpg",
      editorialUrls: [
        "https://guide.michelin.com/es/en/comunidad-valenciana/valencia/restaurant/la-salita",
        "https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy/where-to-eat-restaurant-valencia",
      ],
    },
  ),
  stop(
    "valencia-dining-fierro",
    "Fierro",
    [39.4625922, -0.3727341],
    "Fierro is an intimate one-menu restaurant where Germán Carrizo and Carito Lourenço connect Argentine memory with Valencian ingredients, fermentation, and fire. The limited service makes advance booking part of the plan.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["creative", "argentine", "valencian"],
      price: "$$$$",
      priceSource: "Official reservation page",
      attributeTags: [
        "fine_dining",
        "intimate",
        "tasting_menu",
        "reservation_recommended",
      ],
      hours: {
        default:
          "Jun 1-Jul 31: Wed-Thu dinner at 9:00 PM; Fri-Sat lunch at 2:00 PM and dinner at 9:00 PM. Aug 30-May 31: Wed-Thu lunch at 2:00 PM; Fri-Sat lunch at 2:00 PM and dinner at 9:00 PM. Official calendar controls exceptions.",
      },
      officialUrl: "https://fierrovlc.com/",
      sourcePhoto:
        "https://fierrovlc.com/wp-content/uploads/2024/05/Fierro_web-ESCRITORIOpg-scaled.jpg",
      editorialUrls: [
        "https://guide.michelin.com/es/en/comunidad-valenciana/valencia/restaurant/fierro",
      ],
    },
  ),
  stop(
    "valencia-dining-riff",
    "Riff",
    [39.4656515, -0.3686797],
    "Bernd Knöller's independent dining room is strongest with market fish, rice, and direct Mediterranean flavors, often served with a less ceremonial rhythm than the city's grand tasting rooms. The chef's long Valencia tenure gives the menu local fluency without imitation.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["mediterranean", "seafood", "creative"],
      price: "$$$$",
      priceSource: "Official menu / MICHELIN Guide",
      attributeTags: [
        "fine_dining",
        "seafood",
        "date_night",
        "reservation_recommended",
      ],
      hours: {
        mon: "Closed",
        tue: "1:30 PM-3:30 PM and 8:30 PM-9:30 PM",
        wed: "1:30 PM-3:30 PM and 8:30 PM-9:30 PM",
        thu: "1:30 PM-3:30 PM and 8:30 PM-9:30 PM",
        fri: "1:30 PM-3:30 PM and 8:30 PM-9:30 PM",
        sat: "1:30 PM-3:30 PM and 8:30 PM-9:30 PM",
        sun: "Closed",
      },
      officialUrl: "https://restaurante-riff.com/",
      sourcePhoto:
        "https://freight.cargo.site/w/1000/i/U3092575344996223155247245566264/screenshot-2321018107.jpg",
      editorialUrls: [
        "https://guide.michelin.com/es/en/comunidad-valenciana/valencia/restaurant/riff",
      ],
    },
  ),
  stop(
    "valencia-dining-lienzo",
    "Lienzo",
    [39.4749868, -0.3696126],
    "María José Martínez builds a Michelin-starred menu around Valencian producers, honey, pollination, and the restaurant's work with local beekeepers. The bright gallery-like room keeps attention on ingredients rather than theatrics.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["valencian", "creative", "tasting_menu"],
      price: "$$$$",
      priceSource: "Official menu and booking page",
      attributeTags: [
        "fine_dining",
        "tasting_menu",
        "sustainable",
        "reservation_recommended",
      ],
      hours: {
        default:
          "Wed-Sun kitchen arrivals 1:45 PM-2:30 PM; Wed-Sat dinner arrivals 8:30 PM-9:30 PM; closed Mon-Tue and Sunday dinner. The official booking calendar controls exceptions.",
      },
      officialUrl: "https://restaurantelienzo.com/",
      sourcePhoto:
        "https://www.restaurantelienzo.com/web/wp-content/uploads/2022/04/Maria-Jose-Martinez-restaurantelienzo.jpg",
      editorialUrls: [
        "https://guide.michelin.com/es/en/comunidad-valenciana/valencia/restaurant/lienzo",
      ],
    },
  ),
  stop(
    "valencia-dining-kaido",
    "Kaido Sushi Bar",
    [39.4710922, -0.3552555],
    "Yoshikazu Yanome runs a tiny omakase counter where Edomae technique meets fish from the Mediterranean and Valencia's market network. Seats are scarce and the fixed progression rewards diners willing to hand over control.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["japanese", "sushi", "omakase"],
      price: "$$$$",
      priceSource: "Official omakase reservation page",
      attributeTags: [
        "fine_dining",
        "intimate",
        "tasting_menu",
        "reservation_recommended",
      ],
      hours: {
        default:
          "Tue-Wed dinner 8:30 PM-11:30 PM; Thu-Sat lunch 2:00 PM-4:30 PM and dinner 8:30 PM-11:30 PM; closed Sun-Mon. The official booking calendar controls released seatings.",
      },
      officialUrl: "https://kaidosushibar.com/",
      sourcePhoto:
        "https://www.guiarepsol.com/content/dam/repsol-guia/contenidos-imagenes/comer/nuestros-favoritos/kaido-valencia/gr-cms-media-featured_images-none-2d16db46-9f55-4591-86dc-b7fb8a7119a5-14-guiarepsol_kaido-1-29.jpg",
      editorialUrls: [
        "https://guide.michelin.com/es/en/comunidad-valenciana/valencia/restaurant/kaido-sushi-bar",
      ],
    },
  ),
  stop(
    "valencia-dining-casa-carmela",
    "Casa Carmela",
    [39.4822538, -0.3258216],
    "Casa Carmela has cooked rice over orange wood beside Malvarrosa since 1922. Order paella rather than a scatter of dishes, reserve the rice in advance, and treat this as a long lunch rather than a beachside dinner stop.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["valencian", "paella", "rice"],
      price: "$$$",
      priceSource: "Official menu and booking page",
      attributeTags: ["paella", "historic", "beach", "reservation_recommended"],
      hours: {
        mon: "Closed",
        tue: "1:00 PM-4:00 PM",
        wed: "1:00 PM-4:00 PM",
        thu: "1:00 PM-4:00 PM",
        fri: "1:00 PM-4:00 PM",
        sat: "1:00 PM-4:00 PM",
        sun: "1:00 PM-4:00 PM",
      },
      officialUrl: "https://www.casa-carmela.com/",
      sourcePhoto:
        "https://www.casa-carmela.com/es/wp-content/uploads/CASA-CARMELA-02__WEB.jpg",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy/what-to-eat/where-eat-paella-valencia",
      ],
    },
  ),
  stop(
    "valencia-dining-casa-montana",
    "Casa Montaña",
    [39.4714256, -0.3298449],
    "This 1836 Cabanyal bodega remains a serious wine cellar and tapas address, especially for anchovies, conserved fish, tomatoes, beans, and seasonal clóchinas. The rooms are atmospheric but compact, so book if the evening hinges on it.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["valencian", "tapas", "seafood"],
      price: "$$$",
      priceSource: "Official menu",
      attributeTags: [
        "historic",
        "wine",
        "local_favorite",
        "reservation_recommended",
      ],
      hours: {
        mon: "1:00 PM-4:00 PM and 7:30 PM-11:30 PM",
        tue: "1:00 PM-4:00 PM and 7:30 PM-11:30 PM",
        wed: "1:00 PM-4:00 PM and 7:30 PM-11:30 PM",
        thu: "1:00 PM-4:00 PM and 7:30 PM-11:30 PM",
        fri: "1:00 PM-4:00 PM and 7:30 PM-11:30 PM",
        sat: "12:30 PM-4:00 PM and 7:30 PM-11:30 PM",
        sun: "12:30 PM-4:00 PM; holiday hours follow the official contact page",
      },
      officialUrl: "https://www.emilianobodega.com/contacto/",
      sourcePhoto:
        "https://www.emilianobodega.com/wp-content/uploads/2026/06/7P8A0077_resultado.webp",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy/what-to-eat/tapas",
      ],
    },
  ),
  stop(
    "valencia-dining-anyora",
    "Bodega Anyora",
    [39.4658868, -0.3332812],
    "Anyora revives the direct cooking of a 1937 Cabanyal bodega through cured fish, stews, market vegetables, and local wine. It feels rooted without turning the neighborhood's maritime identity into décor alone.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["valencian", "tapas", "seafood"],
      price: "$$",
      priceSource: "Official menu",
      attributeTags: ["historic", "local_favorite", "casual", "wine"],
      hours: {
        mon: "Kitchen 1:00 PM-11:00 PM",
        tue: "Kitchen 1:00 PM-11:00 PM",
        wed: "Kitchen 1:00 PM-11:00 PM",
        thu: "Kitchen 1:00 PM-11:00 PM",
        fri: "Kitchen 1:00 PM-11:00 PM",
        sat: "Kitchen 1:00 PM-11:00 PM",
        sun: "Closed",
      },
      officialUrl: "https://anyora.es/",
      sourcePhoto: "https://anyora.es/wp-content/uploads/2023/11/IMG_1893.jpeg",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy/what-to-eat/tapas",
      ],
    },
  ),
];

const cheapEatStops: GuideStop[] = [
  stop(
    "valencia-cheap-central-bar",
    "Central Bar",
    [39.4731247, -0.3790624],
    "Ricard Camarena's counter inside Mercat Central turns market produce into sharp breakfasts, sandwiches, tortillas, and compact lunch plates. Go early, sit at the bar, and leave room to shop the surrounding stalls.",
    {
      venueKind: "food_drink",
      foodServiceType: "counter_service",
      cuisineTypes: ["valencian", "market", "sandwiches"],
      price: "$$",
      priceSource: "Official menu",
      attributeTags: ["market", "breakfast", "walk_in_friendly", "central"],
      hours: {
        mon: "9:00 AM-3:00 PM",
        tue: "9:00 AM-3:00 PM",
        wed: "9:00 AM-3:00 PM",
        thu: "9:00 AM-3:00 PM",
        fri: "9:00 AM-3:30 PM",
        sat: "9:00 AM-3:30 PM",
        sun: "Closed; also closed public holidays",
      },
      officialUrl: "https://m.centralbar.es/horario",
      sourcePhoto:
        "https://back.ww-cdn.com/superstatic/version/3051013/iphone/10/photo/sections_78903251_elements_1748937027872_cellBackgroundImage@web.jpg?v=1787562479&force_webp=1",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy/where-to-eat-restaurant-valencia",
      ],
    },
  ),
  stop(
    "valencia-cheap-cremaet",
    "Bar Cremaet",
    [39.4675629, -0.3589021],
    "Cremaet treats the Valencian esmorzaret as an all-day ritual: large bocadillos, olives, peanuts, beer, and the burnt-rum coffee that gives the bar its name. Portions are generous and the room gets loud at local breakfast time.",
    {
      venueKind: "food_drink",
      foodServiceType: "pub",
      cuisineTypes: ["valencian", "sandwiches", "breakfast"],
      price: "$$",
      priceSource: "Official menu",
      attributeTags: [
        "breakfast",
        "local_favorite",
        "group_friendly",
        "casual",
      ],
      hours: {
        default:
          "Daily 9:30 AM-12:30 AM; kitchen and holiday exceptions follow the official booking page.",
      },
      officialUrl: "https://barcremaet.com/regala/",
      sourcePhoto:
        "https://barcremaet.com/wp-content/uploads/2021/06/Cremaet_2_low-576x1024-700x1244.jpg",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy/what-to-eat/tapas",
      ],
    },
  ),
  stop(
    "valencia-cheap-pilareta",
    "La Pilareta",
    [39.4759319, -0.3805049],
    "La Pilareta is the tiled old-center bar for steamed clóchinas in season, shells piling onto the counter beside tapas and vermouth. Visit May through August for the local mussels, and expect a busy, no-frills room.",
    {
      venueKind: "food_drink",
      foodServiceType: "pub",
      cuisineTypes: ["valencian", "tapas", "seafood"],
      price: "$$",
      priceSource: "Official menu",
      attributeTags: ["historic", "seafood", "casual", "walk_in_friendly"],
      hours: {
        default:
          "Daily 12:30 PM-11:30 PM; seasonal clóchina availability follows the official menu and local harvest.",
      },
      officialUrl: "https://www.barlapilareta.es/en",
      sourcePhoto:
        "https://www.barlapilareta.es/wp-content/uploads/2013/07/FOTO-PORTADA-PILARETA.jpg",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy/what-to-eat/tapas",
      ],
    },
  ),
  stop(
    "valencia-cheap-pascuala",
    "Bodega La Pascuala",
    [39.4739468, -0.3275361],
    "Pascuala's oversized bocadillos are a Cabanyal institution and a full meal disguised as a sandwich. Come for esmorzaret, choose a house combination, and accept that speed matters more here than lingering.",
    {
      venueKind: "food_drink",
      foodServiceType: "counter_service",
      cuisineTypes: ["valencian", "sandwiches", "breakfast"],
      price: "$",
      priceSource: "Official menu",
      attributeTags: ["budget_food", "breakfast", "local_favorite", "casual"],
      hours: {
        mon: "9:00 AM-3:30 PM",
        tue: "9:00 AM-3:30 PM",
        wed: "9:00 AM-3:30 PM",
        thu: "9:00 AM-3:30 PM",
        fri: "9:00 AM-3:30 PM",
        sat: "9:00 AM-4:00 PM",
        sun: "Closed",
      },
      officialUrl: "https://bodegalapascuala.es/contacto/",
      sourcePhoto:
        "https://bodegalapascuala.es/wp-content/uploads/2020/04/fondo-home-1280x717.png",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy/what-to-eat/tapas",
      ],
    },
  ),
  stop(
    "valencia-cheap-bar-ricardo",
    "Bar Ricardo",
    [39.47564, -0.3922769],
    "Bar Ricardo has served straightforward tapas since 1947, with fried fish, cuttlefish, patatas bravas, and a crowd that still reads as neighborhood Valencia. It is a useful antidote to polished central dining.",
    {
      venueKind: "food_drink",
      foodServiceType: "pub",
      cuisineTypes: ["valencian", "tapas", "seafood"],
      price: "$$",
      priceSource: "Official menu",
      attributeTags: [
        "historic",
        "local_favorite",
        "casual",
        "walk_in_friendly",
      ],
      hours: {
        mon: "Closed",
        tue: "8:00 AM-12:00 AM",
        wed: "8:00 AM-12:00 AM",
        thu: "8:00 AM-12:00 AM",
        fri: "8:00 AM-12:00 AM",
        sat: "8:00 AM-12:00 AM",
        sun: "Closed",
      },
      officialUrl: "https://barricardo.com/",
      sourcePhoto:
        "https://barricardo.com/wp-content/uploads/2023/12/3-e1703756439756.png",
      editorialUrls: [
        "https://www.bars10.com/ES/Valencia/1575230672723825/Bar-Ricardo",
        "https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy/what-to-eat/tapas",
      ],
    },
  ),
  stop(
    "valencia-cheap-santa-catalina",
    "Horchatería Santa Catalina",
    [39.4738263, -0.3762568],
    "The historic tiled room is a central place to learn the pairing of cold tiger-nut horchata and warm fartons. It is popular and visitor-facing, but the ritual is specific enough to justify the stop.",
    {
      venueKind: "food_drink",
      foodServiceType: "cafe",
      cuisineTypes: ["valencian", "horchata", "pastries"],
      price: "$",
      priceSource: "Official menu",
      attributeTags: ["historic", "dessert", "family_friendly_food", "central"],
      hours: {
        default:
          "Daily 8:15 AM-9:30 PM; holiday exceptions follow the official site.",
      },
      officialUrl: "https://www.horchateriasantacatalina.com/en/",
      sourcePhoto:
        "https://www.horchateriasantacatalina.com/wp-content/uploads/1horchateria-santa-catalina-12.jpg",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy/what-to-eat/horchata",
      ],
    },
  ),
  stop(
    "valencia-cheap-daniel-colon",
    "Horchatería Daniel at Mercado de Colón",
    [39.4689513, -0.3683554],
    "Daniel brings the Alboraia horchata tradition into Mercado de Colón, making it an easy stop for horchata, fartons, and ice cream without leaving the center. The covered modernista market gives the snack a better setting than a takeaway cup.",
    {
      venueKind: "food_drink",
      foodServiceType: "cafe",
      cuisineTypes: ["valencian", "horchata", "desserts"],
      price: "$",
      priceSource: "Official menu",
      attributeTags: ["market", "dessert", "family_friendly_food", "central"],
      hours: {
        default:
          "Daily 10:00 AM-10:00 PM; seasonal and holiday changes follow the Mercado de Colón tenant page.",
      },
      officialUrl: "https://horchateria-daniel.es/",
      sourcePhoto:
        "https://mercadocolon.es/wp-content/uploads/2021/11/F1-DANIEL.jpg",
      editorialUrls: [
        "https://mercadocolon.es/comercio/horchateria-daniel/",
        "https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy/what-to-eat/horchata",
      ],
    },
  ),
  stop(
    "valencia-cheap-fila-labrador",
    "Bodega Fila El Labrador",
    [39.4710629, -0.3487834],
    "Fila El Labrador is a small Algirós bodega for bocadillos, tapas, vermouth, beer, and the kind of informal breakfast that keeps tables turning. The worn-in room matters as much as any single order.",
    {
      venueKind: "food_drink",
      foodServiceType: "pub",
      cuisineTypes: ["valencian", "sandwiches", "tapas"],
      price: "$",
      priceSource: "Current venue listing",
      attributeTags: [
        "budget_food",
        "local_favorite",
        "casual",
        "walk_in_friendly",
      ],
      hours: {
        mon: "9:00 AM-3:00 PM and 6:00 PM-11:30 PM",
        tue: "9:00 AM-3:00 PM and 6:00 PM-11:30 PM",
        wed: "9:00 AM-3:00 PM and 6:00 PM-11:30 PM",
        thu: "9:00 AM-3:00 PM and 6:00 PM-11:30 PM",
        fri: "9:00 AM-3:00 PM and 6:00 PM-11:30 PM",
        sat: "9:00 AM-3:00 PM and 6:00 PM-11:30 PM",
        sun: "Closed",
      },
      officialUrl: "https://maps.apple.com/place?place-id=IA52405E2D049C36B",
      sourcePhoto:
        "https://3.bp.blogspot.com/-7feDFruMw-Q/V08alwX5G7I/AAAAAAAAHGc/LF1-u34nUUU_6azx2WUzboD-SX8rFXboACLcB/s640/bodega-fila-01.JPG",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy/what-to-eat/tapas",
      ],
    },
  ),
  stop(
    "valencia-cheap-pelayo",
    "Pelayo Gastro Trinquet",
    [39.4672871, -0.3784839],
    "Eat Valencian rice, tapas, and esmorzaret inside the restored Pelayo trinquet while the city's pelota history remains visible around the dining room. It is both a meal and a practical introduction to a local sport.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["valencian", "rice", "tapas"],
      price: "$$",
      priceSource: "Official tourism listing / menu",
      attributeTags: ["historic", "local_culture", "group_friendly", "central"],
      hours: {
        default:
          "Daily 1:00 PM-midnight; match-day and private-event access follows the official venue calendar.",
      },
      officialUrl:
        "https://www.visitvalencia.com/que-hacer-valencia/gastronomia/restaurantes-valencia/pelayo-gastro-trinquet",
      sourcePhoto:
        "https://www.visitvalencia.com/sites/default/files/crm-images/GALERIA_Pelayo%20Gastro%20Trinquet_4.jpg",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy/where-to-eat-restaurant-valencia",
      ],
    },
  ),
  stop(
    "valencia-cheap-casa-baldo",
    "Casa Baldo 1915",
    [39.4682322, -0.3758904],
    "Casa Baldo's tiled spaces move from breakfast and vermouth to tapas and rice without losing the feel of a century-old central tavern. Its all-day schedule makes it a reliable fallback near Plaça de l'Ajuntament.",
    {
      venueKind: "food_drink",
      foodServiceType: "restaurant",
      cuisineTypes: ["valencian", "tapas", "rice"],
      price: "$$",
      priceSource: "Official tourism listing / menu",
      attributeTags: ["historic", "central", "all_day", "group_friendly"],
      hours: {
        default:
          "Daily 9:30 AM-1:00 AM; kitchen and holiday exceptions follow the official venue listing.",
      },
      officialUrl: "https://www.visitvalencia.com/en/node/89052",
      sourcePhoto:
        "https://www.visitvalencia.com/sites/default/files/media/media-images/images/GALERIA%202_CasaBaldo.jpg",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy/what-to-eat/tapas",
      ],
    },
  ),
];

const hotelStops: GuideStop[] = [
  stop(
    "valencia-hotel-caro",
    "Caro Hotel",
    [39.4759597, -0.3721665],
    "Caro folds Roman, Moorish, Gothic, and 19th-century fabric into a small luxury hotel near the cathedral. Original walls and archaeological fragments give individual rooms more character than a conventional palace conversion.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      price: "$$$$",
      priceSource: "Official property booking page",
      attributeTags: ["luxury", "historic", "design", "central"],
      hours: {
        default:
          "Hotel and front desk operate daily, 24 hours; the official property booking page controls check-in, check-out, breakfast, pool, and restaurant schedules.",
      },
      officialUrl: "https://www.carohotel.com/the-hotel/",
      bookingUrl: "https://www.booking.com/hotel/es/caro.html",
      sourcePhoto:
        "https://www.carohotel.com/wp-content/uploads/2026/07/home12-e1784308785380.jpg",
    },
  ),
  stop(
    "valencia-hotel-vallier",
    "Palacio Vallier",
    [39.4768547, -0.3760754],
    "This five-star MYR hotel occupies a 19th-century mansion at Plaça de Manises, with 31 rooms, polished period references, and a rooftop facing the old center. It suits a short first visit when walking access matters more than resort space.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      price: "$$$$",
      priceSource: "Official property booking page",
      attributeTags: ["luxury", "historic", "central", "rooftop"],
      hours: {
        default:
          "Hotel and reception operate daily, 24 hours; the official property booking page controls check-in, check-out, breakfast, restaurant, lounge, and rooftop schedules.",
      },
      officialUrl: "https://myrhotels.com/hoteles/hotel-palacio-vallier/",
      bookingUrl: "https://www.booking.com/hotel/es/palacio-vallier-5.html",
      sourcePhoto:
        "https://myrhotels.com/wp-content/uploads/2025/10/hotel-palacio-vallier-suite-lladro-1.jpg",
    },
  ),
  stop(
    "valencia-hotel-only-you",
    "Only YOU Hotel Valencia",
    [39.471361, -0.3749262],
    "Only YOU turns a central high-rise into a lively design hotel with restaurants, florist, barber, and social lobby spaces that draw locals as well as guests. Upper floors trade old-world intimacy for broad city views.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      price: "$$$$",
      priceSource: "Official property booking page",
      attributeTags: ["luxury", "design", "lively", "central"],
      hours: {
        default:
          "Hotel and reception operate daily, 24 hours; the official property page controls check-in, check-out, breakfast, restaurant, bar, and event schedules.",
      },
      officialUrl:
        "https://www.onlyyouhotels.com/en/hotels/only-you-hotel-valencia/",
      bookingUrl: "https://www.booking.com/hotel/es/only-you-valencia.html",
      sourcePhoto:
        "https://www.onlyyouhotels.com/content/imgsxml/galerias/panel_fullheader/1/cabeceradeskweb-lifestyle3540.jpg",
    },
  ),
  stop(
    "valencia-hotel-hospes",
    "Hospes Palau de la Mar",
    [39.470987, -0.3665897],
    "Hospes occupies two 19th-century townhouses beside the Turia Garden, balancing restored stone and timber with a calm courtyard and compact spa. The position works especially well for travelers who want both the old center and bike access east.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      price: "$$$$",
      priceSource: "Official Marriott property page",
      attributeTags: ["luxury", "wellness", "historic", "central"],
      hours: {
        default:
          "Hotel and front desk operate daily, 24 hours; the official property page controls check-in, check-out, spa, breakfast, restaurant, and courtyard service schedules.",
      },
      officialUrl:
        "https://www.marriott.com/en-us/hotels/vlcds-hospes-palau-de-la-mar-valencia-a-member-of-design-hotels/overview/",
      bookingUrl:
        "https://www.booking.com/hotel/es/hospes-palau-de-la-mar.html",
      sourcePhoto:
        "https://media.cntraveler.com/photos/53daf296dcd5888e145d807b/16%3A9/w_2560%2Cc_limit/hospes-palau-de-la-mar-valencia-spain-107342-1.jpg?mbid=social_retweet",
    },
  ),
  stop(
    "valencia-hotel-las-arenas",
    "Las Arenas Balneario Resort",
    [39.4675198, -0.3244885],
    "Las Arenas is Valencia's full resort stay: a restored seaside balneario with broad gardens, pools, spa facilities, and direct access to the urban beach. Choose it when sea air and downtime outrank nightly walks through Ciutat Vella.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      price: "$$$$",
      priceSource: "Official property booking page",
      attributeTags: ["luxury", "beach", "wellness", "family_friendly"],
      hours: {
        default:
          "Hotel and front desk operate daily, 24 hours; the official property page controls check-in, check-out, seasonal pools, spa, beach, breakfast, and restaurant schedules.",
      },
      officialUrl: "https://www.hotelvalencialasarenas.com/",
      bookingUrl: "https://www.booking.com/hotel/es/balneariolasarenas.html",
      sourcePhoto:
        "https://spainguides.com/wp-content/uploads/2023/09/Hotel-Las-Arenas-Balneario.jpg",
    },
  ),
  stop(
    "valencia-hotel-westin",
    "The Westin Valencia",
    [39.4729327, -0.3607578],
    "The Westin spreads through a modernista building near Mestalla, with larger rooms, a planted courtyard, spa, and indoor pool. It is less central than the boutique palaces but better for space, wellness, and east-side access.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      price: "$$$$",
      priceSource: "Official Marriott property page",
      attributeTags: ["luxury", "wellness", "historic", "garden"],
      hours: {
        default:
          "Hotel and front desk operate daily, 24 hours; the official property page controls check-in, check-out, spa, pool, breakfast, courtyard, and restaurant schedules.",
      },
      officialUrl:
        "https://www.marriott.com/en-us/hotels/vlcwi-the-westin-valencia/overview/",
      bookingUrl: "https://www.booking.com/hotel/es/the-westin-valencia.html",
      sourcePhoto:
        "https://cache.marriott.com/content/dam/marriott-renditions/VLCWI/vlcwi-exterior-3534-hor-wide.jpg?downsize=1336px%3A%2A&interpolation=progressive-bilinear&output-quality=70",
    },
  ),
  stop(
    "valencia-hotel-santa-clara",
    "Palacio Santa Clara, Autograph Collection",
    [39.4683861, -0.3741107],
    "Palacio Santa Clara preserves the exuberant lines of a 1916 modernista building while adding contemporary rooms and a small rooftop pool. The station-side location is efficient for rail arrivals without sacrificing the center.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      price: "$$$$",
      priceSource: "Official Marriott property page",
      attributeTags: ["luxury", "design", "historic", "central"],
      hours: {
        default:
          "Hotel and front desk operate daily, 24 hours; the official property page controls check-in, check-out, breakfast, restaurant, rooftop, and seasonal pool schedules.",
      },
      officialUrl:
        "https://www.marriott.com/en-us/hotels/vlcak-palacio-santa-clara-autograph-collection/overview/",
      bookingUrl:
        "https://www.booking.com/hotel/es/palacio-santa-clara-autograph-collection.html",
      sourcePhoto:
        "https://cache.marriott.com/is/image/marriotts7prod/vlcak-exterior-5133%3AClassic-Hor?fit=constrain&wid=856",
    },
  ),
  stop(
    "valencia-hotel-helen-berger",
    "Helen Berger Hotel",
    [39.4723403, -0.372617],
    "Helen Berger is a compact, design-conscious hotel near La Nau and the old center, with warm materials and a restaurant that keeps the ground floor active. It is a strong mid-size choice for travelers who value atmosphere over a pool or spa.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      price: "$$$",
      priceSource: "Official property booking page",
      attributeTags: ["design", "romantic", "central", "midrange"],
      hours: {
        default:
          "Hotel reception and guest assistance operate daily, 24 hours; the official property booking page controls check-in, check-out, breakfast, and restaurant schedules.",
      },
      officialUrl: "https://hotelhelenberger.com/en/",
      bookingUrl: "https://www.booking.com/hotel/es/helen-berger.html",
      sourcePhoto:
        "https://hotelhelenberger.com/wp-content/uploads/2025/03/1232x785_43.jpg",
    },
  ),
  stop(
    "valencia-hotel-estimar",
    "ESTIMAR Valencia",
    [39.4715724, -0.3724302],
    "ESTIMAR is a contemporary central hotel with bright rooms and a rooftop terrace near the Turia-side edge of Ciutat Vella. It favors clean modern comfort and location over the historical drama of a converted palace.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      price: "$$$",
      priceSource: "Official property booking page",
      attributeTags: ["design", "rooftop", "central", "midrange"],
      hours: {
        default:
          "Hotel and reception operate daily, 24 hours; the official property page controls check-in, check-out, breakfast, rooftop, pool, and restaurant schedules.",
      },
      officialUrl: "https://estimarhotels.com/en/valencia/estimar-valencia/",
      bookingUrl: "https://www.booking.com/hotel/es/estimar-valencia.html",
      sourcePhoto:
        "https://llorcagroup.com/wp-content/uploads/2024/06/FACHADA_4-1024x576.png",
    },
  ),
  stop(
    "valencia-hotel-one-shot",
    "One Shot Mercat 09",
    [39.4720856, -0.3780993],
    "One Shot Mercat 09 puts colorful contemporary rooms and a small seasonal rooftop pool a block from Mercat Central. The footprint is compact, but the location and relative price make it a practical design-led base.",
    {
      venueKind: "lodging",
      lodgingType: "hotel",
      price: "$$$",
      priceSource: "Official property booking page",
      attributeTags: ["design", "central", "midrange", "rooftop"],
      hours: {
        default:
          "Hotel and reception operate daily, 24 hours; the official property page controls check-in, check-out, breakfast, and seasonal rooftop-pool schedules.",
      },
      officialUrl:
        "https://www.oneshothotels.com/en/hotels/one-shot-mercat-09/",
      bookingUrl: "https://www.booking.com/hotel/es/one-shot-mercat-09.html",
      sourcePhoto:
        "https://www.kayak.co.uk/rimg/himg/d4/28/24/expedia_group-2906584-d832ee-220349.jpg?crop=true&height=607&width=836",
    },
  ),
];

const hostelStops: GuideStop[] = [
  stop(
    "valencia-hostel-home-youth",
    "Home Youth Hostel",
    [39.4744359, -0.3779944],
    "Home Youth is a small, sociable hostel in the old center with no bunk beds, a guest kitchen, and common spaces that make solo travel easy without a party-hostel scale. The location by the market is exceptionally walkable.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      price: "$",
      priceSource: "Current Hostelworld property page",
      attributeTags: ["budget", "social", "solo_friendly", "central"],
      hours: {
        default:
          "Guest access is daily; reception, check-in, check-out, and late-arrival windows follow the current Hostelworld property page.",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/17/home-youth-hostel-valencia-by-feetup-hostels/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/17/home-youth-hostel-valencia-by-feetup-hostels/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/1/17/mgrbrii92ojleun573hd.jpg",
      editorialUrls: [
        "https://www.hostelworld.com/hostels/europe/spain/valencia/",
      ],
    },
  ),
  stop(
    "valencia-hostel-central-house",
    "The Central House Valencia Mercado Central",
    [39.4733756, -0.3809331],
    "The Central House is a large new hostel beside Mercat Central, mixing dorms, private rooms, social areas, and a location built for first-time sightseeing. Its scale favors reliable facilities over intimate local character.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      price: "$$",
      priceSource: "Current Hostelworld property page",
      attributeTags: ["social", "central", "group_friendly", "design"],
      hours: {
        default:
          "Guest access is daily; reception, check-in, check-out, late-arrival windows, and newly opened facilities follow the current Hostelworld property page.",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/334697/the-central-house-valencia-mercado-central/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/334697/the-central-house-valencia-mercado-central/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/334697/y6uubdjtyqnym2rxzd5a.jpg",
      editorialUrls: [
        "https://www.hostelworld.com/hostels/europe/spain/valencia/",
      ],
    },
  ),
  stop(
    "valencia-hostel-river",
    "River Hostel",
    [39.4761162, -0.3707789],
    "River Hostel sits between the old center and Turia Garden, with a kitchen, bike-friendly position, and enough common space for a social stay. It is particularly practical for travelers planning to cross the city by bike.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      price: "$",
      priceSource: "Current Hostelworld property page",
      attributeTags: ["budget", "social", "central", "bike_friendly"],
      hours: {
        default:
          "Guest access is daily; reception, check-in, check-out, bicycle service, and late-arrival windows follow the current Hostelworld property page.",
      },
      officialUrl: "https://www.hostelworld.com/hostels/p/73821/river-hostel/",
      bookingUrl: "https://www.hostelworld.com/hostels/p/73821/river-hostel/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/7/73821/rdy9jv5tsylnum7zukpw.jpg",
      editorialUrls: [
        "https://www.hostelworld.com/hostels/europe/spain/valencia/",
      ],
    },
  ),
  stop(
    "valencia-hostel-purple-nest",
    "Purple Nest Hostel",
    [39.4746181, -0.3701021],
    "Purple Nest is an established social hostel with a bar, events, and a central position close to the Turia. Choose it for easy connections and meeting people, not for a silent boutique stay.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      price: "$",
      priceSource: "Current Hostelworld property page",
      attributeTags: ["budget", "social", "party", "central"],
      hours: {
        default:
          "Daily; check-in 3:00 PM-11:00 PM and check-out by 11:00 AM. Reception and late-arrival rules follow the current Hostelworld property page.",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/15116/purple-nest-hostel-valencia/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/15116/purple-nest-hostel-valencia/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/1/15116/llics0uzpwmc3tag2ijc.jpg",
      editorialUrls: [
        "https://www.hostelworld.com/hostels/europe/spain/valencia/",
      ],
    },
  ),
  stop(
    "valencia-hostel-colo-colo",
    "Colo Colo The Smart Hostel",
    [39.4607, -0.3707],
    "Colo Colo uses private sleeping pods and app-led access to offer more privacy than a conventional dorm. It suits independent travelers who value a controlled bed space and are comfortable with limited reception hours.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      price: "$$",
      priceSource: "Current Hostelworld property page",
      attributeTags: ["design", "quiet", "solo_friendly", "budget"],
      hours: {
        default:
          "Daily reception 10:00 AM-6:00 PM; check-in 2:00 PM-11:00 PM and check-out by 11:00 AM; property uses 24-hour video security. Late-arrival rules follow Hostelworld.",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/328970/colo-colo-the-smart-hostel-valencia/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/328970/colo-colo-the-smart-hostel-valencia/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/328970/z05pzvcubicabb6mnuqp.jpg",
      editorialUrls: [
        "https://www.hostelworld.com/hostels/europe/spain/valencia/",
      ],
    },
  ),
  stop(
    "valencia-hostel-room",
    "Room00 Valencia Hostel",
    [39.4776439, -0.3762185],
    "Room00 combines modern dorms and private rooms with a polished design near Torres de Serranos. It is a useful compromise for travelers who want hostel pricing and common spaces without a rough party aesthetic.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      price: "$$",
      priceSource: "Current Hostelworld property page",
      attributeTags: ["design", "social", "central", "solo_friendly"],
      hours: {
        default:
          "Daily with 24-hour reception; check-in 3:00 PM-11:00 PM and check-out by 11:00 AM. The current Hostelworld page controls late-arrival exceptions.",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/324736/room-valencia/",
      bookingUrl: "https://www.hostelworld.com/hostels/p/324736/room-valencia/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/324736/lycfv0xieosejuq7fyfs.jpg",
      editorialUrls: [
        "https://www.hostelworld.com/hostels/europe/spain/valencia/",
      ],
    },
  ),
  stop(
    "valencia-hostel-red-nest",
    "Red Nest Hostel",
    [39.4729724, -0.3718336],
    "Red Nest is the more openly social sibling in the Nest group, with bright dorms, a central location, and a rooftop common area. It works best for travelers who want planned activities and late conversation.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      price: "$",
      priceSource: "Current Hostelworld property page",
      attributeTags: ["budget", "social", "party", "central"],
      hours: {
        default:
          "Daily with 24-hour reception; check-in 3:00 PM-11:00 PM and check-out by 11:00 AM. Late-arrival and rooftop rules follow Hostelworld.",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/11274/red-nest-hostel-valencia/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/11274/red-nest-hostel-valencia/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/1/11274/emrpyny4yt4iwcxwexov.jpg",
      editorialUrls: [
        "https://www.hostelworld.com/hostels/europe/spain/valencia/",
      ],
    },
  ),
  stop(
    "valencia-hostel-cantagua",
    "Cantagua Hostel",
    [39.4579597, -0.3700386],
    "Cantagua is a smaller, calm hostel with a communal kitchen and neighborhood position south of Ruzafa. The atmosphere favors conversation and sleep over bar-led events, making it a good solo-traveler alternative to the center's party beds.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      price: "$",
      priceSource: "Current Hostelworld property page",
      attributeTags: ["quiet", "social", "solo_friendly", "budget"],
      hours: {
        default:
          "Daily reception 9:00 AM-9:00 PM; check-in 2:00 PM-9:00 PM and check-out by 11:00 AM. Arrivals outside the window require the property's Hostelworld instructions.",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/292385/cantagua-hostel/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/292385/cantagua-hostel/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/2/292385/f7xbu5h8rculwyes8lfi.jpg",
      editorialUrls: [
        "https://www.hostelworld.com/hostels/europe/spain/valencia/",
      ],
    },
  ),
  stop(
    "valencia-hostel-venue",
    "The Venue Hostel",
    [39.4633011, -0.3632454],
    "The Venue offers capsule-like bunks, a garden patio, and rail-station access between Ruzafa and the City of Arts axis. It is practical for short stays when privacy screens and transport logistics matter.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      price: "$",
      priceSource: "Current Hostelworld property page",
      attributeTags: ["budget", "garden", "solo_friendly", "transport_access"],
      hours: {
        default:
          "Daily; check-in 2:00 PM-11:00 PM and check-out by 10:00 AM. Reception and late-arrival requirements follow the current Hostelworld property page.",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/313293/the-venue-hostel/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/313293/the-venue-hostel/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/313293/phxnpju7bezahvnikzka.jpg",
      editorialUrls: [
        "https://www.hostelworld.com/hostels/europe/spain/valencia/",
      ],
    },
  ),
  stop(
    "valencia-hostel-unit",
    "U-nit Central Park",
    [39.4562, -0.377],
    "U-nit is a modern hostel beside Parque Central with clean dorms, common areas, and straightforward access from the main rail stations. The setting is less atmospheric than Ciutat Vella but better for arrivals, departures, and Ruzafa evenings.",
    {
      venueKind: "lodging",
      lodgingType: "hostel",
      price: "$",
      priceSource: "Current Hostelworld property page",
      attributeTags: ["budget", "social", "transport_access", "design"],
      hours: {
        default:
          "Daily with 24-hour reception; check-in 3:00 PM-11:00 PM and check-out by 11:00 AM. The current Hostelworld page controls late-arrival rules.",
      },
      officialUrl:
        "https://www.hostelworld.com/hostels/p/333069/u-nit-central-park/",
      bookingUrl:
        "https://www.hostelworld.com/hostels/p/333069/u-nit-central-park/",
      sourcePhoto:
        "https://a.hwstatic.com/image/upload/f_auto,q_auto,t_30/propertyimages/3/333069/olrdzxyjzcicaecem8gh.jpg",
      editorialUrls: [
        "https://www.hostelworld.com/hostels/europe/spain/valencia/",
      ],
    },
  ),
];

const pubStops: GuideStop[] = [
  stop(
    "valencia-pub-casa-montana",
    "Casa Montaña",
    [39.4714256, -0.3298449],
    "Casa Montaña works just as well as a wine-first evening as it does for dinner: order a bottle from the deep cellar, then build around anchovies, conserved fish, beans, and seasonal clóchinas. Its 1836 rooms carry real Cabanyal history.",
    {
      venueKind: "nightlife",
      nightlifeType: "wine_bar",
      cuisineTypes: ["valencian", "tapas"],
      price: "$$$",
      priceSource: "Official wine list and menu",
      attributeTags: [
        "historic",
        "wine",
        "local_favorite",
        "reservation_recommended",
      ],
      hours: {
        mon: "1:00 PM-4:00 PM and 7:30 PM-11:30 PM",
        tue: "1:00 PM-4:00 PM and 7:30 PM-11:30 PM",
        wed: "1:00 PM-4:00 PM and 7:30 PM-11:30 PM",
        thu: "1:00 PM-4:00 PM and 7:30 PM-11:30 PM",
        fri: "1:00 PM-4:00 PM and 7:30 PM-11:30 PM",
        sat: "12:30 PM-4:00 PM and 7:30 PM-11:30 PM",
        sun: "12:30 PM-4:00 PM; holiday hours follow the official page",
      },
      officialUrl: "https://www.emilianobodega.com/contacto/",
      sourcePhoto:
        "https://www.emilianobodega.com/wp-content/uploads/2026/06/7P8A0077_resultado.webp",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-do-valencia/valencia-by-night/pubs-and-discos-in-valencia",
      ],
    },
  ),
  stop(
    "valencia-pub-fila-labrador",
    "Bodega Fila El Labrador",
    [39.4710629, -0.3487834],
    "Fila El Labrador is a genuine neighborhood bodega where beer, vermouth, bocadillos, and small tapas matter more than a designed bar program. Come early enough to find space and let the worn room do the rest.",
    {
      venueKind: "nightlife",
      nightlifeType: "dive_bar",
      cuisineTypes: ["valencian", "tapas"],
      price: "$",
      priceSource: "Current venue listing",
      attributeTags: ["budget", "local_favorite", "casual", "walk_in_friendly"],
      hours: {
        mon: "9:00 AM-3:00 PM and 6:00 PM-11:30 PM",
        tue: "9:00 AM-3:00 PM and 6:00 PM-11:30 PM",
        wed: "9:00 AM-3:00 PM and 6:00 PM-11:30 PM",
        thu: "9:00 AM-3:00 PM and 6:00 PM-11:30 PM",
        fri: "9:00 AM-3:00 PM and 6:00 PM-11:30 PM",
        sat: "9:00 AM-3:00 PM and 6:00 PM-11:30 PM",
        sun: "Closed",
      },
      officialUrl: "https://maps.apple.com/place?place-id=IA52405E2D049C36B",
      sourcePhoto:
        "https://3.bp.blogspot.com/-7feDFruMw-Q/V08alwX5G7I/AAAAAAAAHGc/LF1-u34nUUU_6azx2WUzboD-SX8rFXboACLcB/s640/bodega-fila-01.JPG",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-do-valencia/valencia-by-night/pubs-and-discos-in-valencia",
      ],
    },
  ),
  stop(
    "valencia-pub-negrito",
    "Café Negrito",
    [39.475992, -0.377424],
    "Negrito's terrace on its namesake square is a long-running Valencia meeting point for beers, mixed drinks, and late conversation. It is busiest outdoors and makes more sense as a social plaza bar than as a destination for elaborate drinks.",
    {
      venueKind: "nightlife",
      nightlifeType: "dive_bar",
      price: "$$",
      priceSource: "Current venue menu and map listing",
      attributeTags: ["lively", "late_night", "outdoor_seating", "central"],
      hours: {
        mon: "4:00 PM-3:30 AM",
        tue: "4:00 PM-3:30 AM",
        wed: "4:00 PM-3:30 AM",
        thu: "4:00 PM-3:30 AM",
        fri: "4:00 PM-3:30 AM",
        sat: "3:00 PM-3:30 AM",
        sun: "3:00 PM-3:30 AM; holiday exceptions follow current venue posts",
      },
      officialUrl: "https://www.instagram.com/cafenegritovalencia/",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/2/26/Caf%C3%A9_Negrito.jpg",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-do-valencia/valencia-by-night/pubs-and-discos-in-valencia",
      ],
    },
  ),
  stop(
    "valencia-pub-radio-city",
    "Radio City",
    [39.4746839, -0.3813589],
    "Radio City is the old center's durable live-night address, moving between flamenco, jam sessions, DJs, exhibitions, and dancing. Check the program first: the reason to go changes with the night.",
    {
      venueKind: "nightlife",
      nightlifeType: "live_music_venue",
      musicGenres: ["flamenco", "jazz", "electronic", "world"],
      price: "$$",
      priceSource: "Official event calendar",
      attributeTags: ["live_music", "lively", "late_night", "central"],
      hours: {
        default:
          "Daily 10:00 PM-4:00 AM; Thu-Sat from 7:00 PM. Performances, entry times, and ticket conditions follow the official dated program.",
      },
      officialUrl: "https://radiocityvalencia.es/",
      timetableUrl: "https://radiocityvalencia.es/agenda/",
      sourcePhoto:
        "https://radiocityvalencia.es/wp-content/uploads/2023/02/CABECERA_THEOG.webp",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-do-valencia/valencia-by-night/pubs-and-discos-in-valencia",
      ],
    },
  ),
  stop(
    "valencia-pub-jimmy-glass",
    "Jimmy Glass Jazz Bar",
    [39.4775945, -0.3793261],
    "Jimmy Glass is Valencia's focused jazz room, booking touring players and local ensembles in a compact bar where listening takes priority over background music. Reserve ticketed nights and arrive before the set.",
    {
      venueKind: "nightlife",
      nightlifeType: "live_music_venue",
      musicGenres: ["jazz"],
      price: "$$",
      priceSource: "Official concert calendar",
      attributeTags: [
        "live_music",
        "intimate",
        "reservation_recommended",
        "central",
      ],
      hours: {
        default:
          "Open on nights listed in the official performance schedule; that dated schedule supplies doors, set times, ticketing, and closed dates.",
      },
      officialUrl: "https://www.jimmyglassjazz.net/horarios/",
      timetableUrl: "https://www.jimmyglassjazz.net/programacion/",
      sourcePhoto:
        "https://www.jimmyglassjazz.net/wp-content/uploads/2014/05/greg-osby-slide.jpg",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-do-valencia/valencia-by-night/pubs-and-discos-in-valencia",
      ],
    },
  ),
  stop(
    "valencia-pub-fabrica-hielo",
    "La Fábrica de Hielo",
    [39.4695092, -0.3250717],
    "A former ice factory near the beach now hosts live music, DJs, markets, talks, food, and drinks in a flexible industrial hall. The programming is eclectic enough that checking the calendar is essential.",
    {
      venueKind: "nightlife",
      nightlifeType: "live_music_venue",
      musicGenres: ["indie", "electronic", "world"],
      price: "$$",
      priceSource: "Official event and bar pages",
      attributeTags: ["live_music", "lively", "beach", "group_friendly"],
      hours: {
        mon: "Closed",
        tue: "5:00 PM-1:30 AM",
        wed: "5:00 PM-1:30 AM",
        thu: "5:00 PM-1:30 AM",
        fri: "5:00 PM-2:30 AM",
        sat: "Noon-2:30 AM",
        sun: "Noon-1:30 AM; event doors follow the official agenda",
      },
      officialUrl: "https://www.lafabricadehielo.net/contacto/",
      timetableUrl: "https://www.lafabricadehielo.net/agenda/",
      sourcePhoto:
        "https://www.lafabricadehielo.net/wp-content/uploads/2026/08/26-AGOSTO-1024x535.jpg",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-do-valencia/valencia-by-night/pubs-and-discos-in-valencia",
      ],
    },
  ),
  stop(
    "valencia-pub-ubik",
    "Ubik Café",
    [39.4604315, -0.3738813],
    "Ubik combines a bookshop, café, simple kitchen, exhibitions, and cultural events in Ruzafa. It is most useful as an unforced early-evening room where a drink can turn into a talk, reading, or small performance.",
    {
      venueKind: "nightlife",
      nightlifeType: "other",
      foodServiceType: "cafe",
      price: "$$",
      priceSource: "Official café page",
      attributeTags: ["books", "local_favorite", "casual", "work_friendly"],
      hours: {
        default:
          "Mon-Thu from 5:00 PM; Fri-Sun from 10:00 AM. Closing times, kitchen service, talks, exhibitions, and holiday changes follow the official venue posts.",
      },
      officialUrl: "https://ubikcafe.blogspot.com/p/cocina.html",
      sourcePhoto:
        "https://www.economiadigital.es/tendenciashoy/wp-content/uploads/2023/09/Foto-Ubik-Cafe.jpg",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-do-valencia/valencia-by-night/pubs-and-discos-in-valencia",
      ],
    },
  ),
  stop(
    "valencia-pub-olhops",
    "Olhöps Craft Beer House",
    [39.4623201, -0.3755798],
    "Olhöps is a serious craft-beer bar with a changing tap list and a bottle shop sensibility rather than generic pub branding. Staff guidance makes it accessible even if Spanish microbreweries are unfamiliar.",
    {
      venueKind: "nightlife",
      nightlifeType: "beer_bar",
      price: "$$",
      priceSource: "Official tap list",
      attributeTags: [
        "craft_beer",
        "casual",
        "local_favorite",
        "walk_in_friendly",
      ],
      hours: {
        mon: "6:30 PM-11:30 PM",
        tue: "6:30 PM-11:30 PM",
        wed: "6:30 PM-11:30 PM",
        thu: "6:30 PM-11:30 PM",
        fri: "6:30 PM-1:30 AM",
        sat: "6:30 PM-1:30 AM",
        sun: "6:30 PM-11:30 PM",
      },
      officialUrl: "https://olhops.com/",
      sourcePhoto:
        "https://www.visitvalencia.com/sites/default/files/media/media-images/images/Olhops-valencia-1.jpg",
      editorialUrls: [
        "https://www.visitvalencia.com/sites/default/files/media/media-images/images/Olhops-valencia-1.jpg",
      ],
    },
  ),
  stop(
    "valencia-pub-tyris",
    "Tyris On Tap",
    [39.4749163, -0.3790514],
    "Valencia brewer Tyris pours its own range and rotating beers in a central taproom built for tasting flights, pints, and uncomplicated food. It is an efficient introduction to the local craft-beer scene.",
    {
      venueKind: "nightlife",
      nightlifeType: "brewery",
      price: "$$",
      priceSource: "Official taproom page",
      attributeTags: ["craft_beer", "group_friendly", "casual", "central"],
      hours: {
        default:
          "Daily 6:30 PM-12:30 AM; tap changes, private events, and holiday exceptions follow the official brewery page.",
      },
      officialUrl: "https://cervezatyris.com/contacto/",
      sourcePhoto:
        "https://cervezatyris.com/wp-content/uploads/2025/03/hero-movil.png",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-do-valencia/valencia-by-night/pubs-and-discos-in-valencia",
      ],
    },
  ),
  stop(
    "valencia-pub-loco-club",
    "Loco Club",
    [39.4712044, -0.3870538],
    "Loco Club is a compact independent venue for rock, indie, soul, country, and touring bands, often followed by DJs. It is a calendar-driven night rather than a bar to visit blindly.",
    {
      venueKind: "nightlife",
      nightlifeType: "live_music_venue",
      musicGenres: ["rock", "indie", "soul", "country"],
      price: "$$",
      priceSource: "Official concert calendar",
      attributeTags: [
        "live_music",
        "late_night",
        "lively",
        "reservation_recommended",
      ],
      hours: {
        default:
          "Open on nights listed in the official event calendar; that dated calendar supplies doors, set times, after-show DJs, age rules, and closed dates.",
      },
      officialUrl: "https://lococlub.es/contacto/",
      timetableUrl: "https://lococlub.es/agenda/",
      sourcePhoto:
        "https://www.visitvalencia.com/sites/default/files/crm-images/GALERIA_Loco%20Club_1.jpg",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-do-valencia/valencia-by-night/pubs-and-discos-in-valencia",
      ],
    },
  ),
];

const cocktailStops: GuideStop[] = [
  stop(
    "valencia-cocktail-cafe-madrid",
    "Café Madrid",
    [39.472988, -0.375503],
    "Café Madrid revives the bar associated with the origin story of agua de Valencia, mixing that citrus-cava classic with contemporary cocktails in a handsome MYR hotel room. The small rooftop adds a quieter early-evening option.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      price: "$$$",
      priceSource: "Official cocktail menu",
      attributeTags: ["cocktails", "historic", "date_night", "central"],
      hours: {
        default:
          "Bar daily noon-1:30 AM; rooftop 4:00 PM-10:00 PM. Weather, private events, and holiday changes follow the official page.",
      },
      officialUrl: "https://myrhotels.com/coctelerias/cafe-madrid/",
      sourcePhoto:
        "https://myrhotels.com/wp-content/uploads/elementor/thumbs/cocteleria-cafe-madrid-2-rkee1u0t5tlfrx2w8o616praphpb8n5fhp7svk5oqw.jpg",
      editorialUrls: [
        "https://blog.visitvalencia.com/en/best-cocktail-bars-in-valencia",
      ],
    },
  ),
  stop(
    "valencia-cocktail-soul-rooftop",
    "The Rooftop at Soul of 1927",
    [39.4690759, -0.3759522],
    "Soul of 1927's rooftop pairs city views with polished cocktails and a full evening food menu. It is best booked around sunset, when the setting earns the higher hotel-bar prices.",
    {
      venueKind: "nightlife",
      nightlifeType: "rooftop_bar",
      price: "$$$",
      priceSource: "Official menu",
      attributeTags: [
        "rooftop",
        "scenic",
        "romantic",
        "reservation_recommended",
      ],
      hours: {
        default:
          "Daily 7:00 PM-1:00 AM; kitchen until 11:00 PM. Weather, private events, and seasonal changes follow the official rooftop page.",
      },
      officialUrl: "https://soulof1927.com/the-rooftop/",
      sourcePhoto:
        "https://soulof1927.com/wp-content/uploads/2025/08/TheRooftop_Soulof1927-scaled.png",
      editorialUrls: [
        "https://blog.visitvalencia.com/en/best-cocktail-bars-in-valencia",
      ],
    },
  ),
  stop(
    "valencia-cocktail-cafe-horas",
    "Café de las Horas",
    [39.4770689, -0.3755858],
    "Baroque décor, chandeliers, flowers, and agua de Valencia make Café de las Horas knowingly theatrical. It is more salon than laboratory, and that atmosphere is exactly the point.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      price: "$$",
      priceSource: "Official menu",
      attributeTags: ["cocktails", "historic", "romantic", "central"],
      hours: {
        default:
          "Daily from 10:00 AM until approximately 1:30 AM; dated events, holiday closings, and final service follow the official venue calendar.",
      },
      officialUrl: "https://cafedelashoras.com/",
      sourcePhoto:
        "https://commons.wikimedia.org/wiki/Special:FilePath/Caf%C3%A9%20de%20las%20Horas.jpg",
      editorialUrls: [
        "https://blog.visitvalencia.com/en/best-cocktail-bars-in-valencia",
      ],
    },
  ),
  stop(
    "valencia-cocktail-luna",
    "Luna de Valencia Rooftop",
    [39.4793563, -0.3766315],
    "Luna de Valencia sits above the old center with broad views, cocktails, and a relaxed lounge menu. Earlier hours work for architecture and sunset; later ones turn more social.",
    {
      venueKind: "nightlife",
      nightlifeType: "rooftop_bar",
      price: "$$$",
      priceSource: "Official rooftop menu",
      attributeTags: ["rooftop", "scenic", "lively", "central"],
      hours: {
        default:
          "Daily noon-midnight; weather closures, private events, food service, and seasonal changes follow the official rooftop page.",
      },
      officialUrl: "https://myrhotels.com/rooftops/luna-de-valencia/",
      sourcePhoto:
        "https://myrhotels.com/wp-content/uploads/elementor/thumbs/27052026-DSC07782-rq00yl7tk80c0g3pki76jtzpzqymj9forcngs79oqw.jpg",
      editorialUrls: [
        "https://blog.visitvalencia.com/en/best-cocktail-bars-in-valencia",
      ],
    },
  ),
  stop(
    "valencia-cocktail-lladro",
    "Lladró Lounge Bar",
    [39.4768547, -0.3760754],
    "Inside Palacio Vallier, Lladró Lounge Bar uses ceramics, soft lighting, and classic service for a calmer drink than the rooftop circuit. The adjoining terrace is useful before dinner or for a late central nightcap.",
    {
      venueKind: "nightlife",
      nightlifeType: "lounge",
      price: "$$$",
      priceSource: "Official cocktail menu",
      attributeTags: ["cocktails", "luxury", "date_night", "central"],
      hours: {
        default:
          "Lounge daily 11:00 AM-1:00 AM; rooftop service 11:00 AM-midnight. Private events and holiday changes follow the official page.",
      },
      officialUrl: "https://myrhotels.com/coctelerias/lladro-lounge-bar/",
      sourcePhoto:
        "https://myrhotels.com/wp-content/uploads/elementor/thumbs/galeria-lladro-lounge-bar-1-rkee1u0qui04w78drnes177he307kxoq8cf16baa34.jpg",
      editorialUrls: [
        "https://blog.visitvalencia.com/en/best-cocktail-bars-in-valencia",
      ],
    },
  ),
  stop(
    "valencia-cocktail-atenea",
    "Atenea Sky",
    [39.4707951, -0.3761495],
    "Atenea Sky is the large, high-energy rooftop above Plaça de l'Ajuntament, combining cocktails, dining, DJs, and a panoramic central view. Reserve for sunset and expect a more produced experience than a neighborhood bar.",
    {
      venueKind: "nightlife",
      nightlifeType: "rooftop_bar",
      price: "$$$",
      priceSource: "Official booking and menu pages",
      attributeTags: ["rooftop", "scenic", "party", "reservation_recommended"],
      hours: {
        default:
          "Daily noon-1:30 AM; DJs daily from 6:00 PM. Weather, ticketed sessions, table duration, and private events follow the official booking calendar.",
      },
      officialUrl: "https://ateneasky.com/",
      sourcePhoto:
        "https://ateneasky.com/wp-content/uploads/2024/07/12-500x650.jpg",
      editorialUrls: [
        "https://blog.visitvalencia.com/en/best-cocktail-bars-in-valencia",
      ],
    },
  ),
  stop(
    "valencia-cocktail-cooktl",
    "COOKTL",
    [39.4624613, -0.3695473],
    "COOKTL occupies the garden-level world of Begoña Rodrigo's Anarkia project, pairing culinary technique with cocktails in the same mansion as La Salita. Drinks lean ingredient-driven, so this is a destination bar rather than a casual drop-in.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      price: "$$$",
      priceSource: "Official bar and reservation pages",
      attributeTags: [
        "cocktails",
        "garden",
        "date_night",
        "reservation_recommended",
      ],
      hours: {
        mon: "6:00 PM-1:30 AM",
        tue: "6:00 PM-1:30 AM",
        wed: "Closed",
        thu: "6:00 PM-1:30 AM",
        fri: "6:00 PM-1:30 AM",
        sat: "6:00 PM-1:30 AM",
        sun: "Closed; food service ends at midnight",
      },
      officialUrl: "https://www.anarkiagroup.com/cooktl-2-2",
      sourcePhoto:
        "https://images.squarespace-cdn.com/content/v1/5f7ed58ccc71095920c875f8/b029f988-cdd1-4fc6-862c-b14a48dfb619/PHOTO-2025-05-06-11-14-41+%283%29.jpg",
      editorialUrls: [
        "https://blog.visitvalencia.com/en/best-cocktail-bars-in-valencia",
      ],
    },
  ),
  stop(
    "valencia-cocktail-lupin",
    "Piano Bar Lupin",
    [39.4689513, -0.3683554],
    "Lupin is a speakeasy-style piano bar inside Mercado de Colón, using live music and classic cocktails to create an unusually intimate night in the modernista market. Check the music program rather than assuming every visit has the same mood.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      musicGenres: ["piano", "jazz"],
      price: "$$$",
      priceSource: "Official menu and contact page",
      attributeTags: ["cocktails", "live_music", "intimate", "central"],
      hours: {
        mon: "5:00 PM-1:00 AM",
        tue: "5:00 PM-1:00 AM",
        wed: "5:00 PM-1:00 AM",
        thu: "6:00 PM-3:00 AM",
        fri: "6:00 PM-3:00 AM",
        sat: "6:00 PM-3:00 AM",
        sun: "Closed; performance times follow the official agenda",
      },
      officialUrl: "https://pianobarlupin.es/contacto/",
      sourcePhoto:
        "https://blog.visitvalencia.com/hs-fs/hubfs/piano-bar-lupin.webp?width=1500&height=1000&name=piano-bar-lupin.webp",
      editorialUrls: [
        "https://blog.visitvalencia.com/en/best-cocktail-bars-in-valencia",
      ],
    },
  ),
  stop(
    "valencia-cocktail-borgia",
    "Borgia Winebar & Spirits",
    [39.4767098, -0.37716],
    "Borgia bridges wine-bar depth and cocktail technique, with serious bottles, spirits, tasting events, and a central room that rewards asking the staff to guide the order. It works for both an aperitif and a longer drinks-led evening.",
    {
      venueKind: "nightlife",
      nightlifeType: "wine_bar",
      price: "$$$",
      priceSource: "Official menu and agenda",
      attributeTags: ["wine", "cocktails", "date_night", "central"],
      hours: {
        mon: "6:00 PM-midnight",
        tue: "6:00 PM-midnight",
        wed: "6:00 PM-midnight",
        thu: "5:30 PM-11:00 PM",
        fri: "9:00 AM-midnight",
        sat: "9:00 AM-midnight",
        sun: "6:00 PM-midnight; events follow the official agenda",
      },
      officialUrl: "https://www.borgiawinebar.com/",
      sourcePhoto:
        "https://www.borgiawinebar.com/wp-content/uploads/2026/03/borgia_winebar_5-1024x683.jpg",
      editorialUrls: [
        "https://blog.visitvalencia.com/en/best-cocktail-bars-in-valencia",
      ],
    },
  ),
  stop(
    "valencia-cocktail-lunin",
    "Lunin Cocktail Bar",
    [39.4620569, -0.3742043],
    "Lunin is a focused Ruzafa cocktail bar with a contemporary menu and enough technical ambition to justify ordering beyond standards. The room stays intimate while weekend hours stretch late.",
    {
      venueKind: "nightlife",
      nightlifeType: "cocktail_bar",
      price: "$$$",
      priceSource: "Official cocktail menu",
      attributeTags: ["cocktails", "intimate", "date_night", "late_night"],
      hours: {
        mon: "5:00 PM-1:00 AM",
        tue: "5:00 PM-1:00 AM",
        wed: "5:00 PM-1:00 AM",
        thu: "5:00 PM-1:00 AM",
        fri: "5:00 PM-2:00 AM",
        sat: "5:00 PM-2:00 AM",
        sun: "5:00 PM-1:00 AM",
      },
      officialUrl: "https://luninbar.com/",
      sourcePhoto: "https://luninbar.com/og-image.jpg",
      editorialUrls: [
        "https://blog.visitvalencia.com/en/best-cocktail-bars-in-valencia",
      ],
    },
  ),
];

const cultureStops: GuideStop[] = [
  stop(
    "valencia-culture-ivam",
    "IVAM Centre Julio González",
    [39.4801031, -0.3829748],
    "IVAM anchors Valencia's modern-art story through Julio González, Spanish abstraction, photography, design, and a changing international program. The medieval wall visible below the building adds an unexpected layer to the visit.",
    {
      venueKind: "culture",
      subcategory: "modern_art_museum",
      price: "$$",
      priceSource: "Official museum ticket page",
      attributeTags: ["museum", "art", "accessible", "central"],
      hours: {
        mon: "Closed",
        tue: "10:00 AM-7:00 PM",
        wed: "10:00 AM-7:00 PM",
        thu: "10:00 AM-7:00 PM",
        fri: "10:00 AM-7:00 PM",
        sat: "10:00 AM-7:00 PM",
        sun: "10:00 AM-7:00 PM; holiday exceptions follow the official visit page",
      },
      officialUrl: "https://ivam.es/es/visita/",
      sourcePhoto:
        "https://ivam.es/wp-content/uploads/visita_ivam/ivam-centre-julio-gonzalez/fotos-para-home-vlc-.jpg",
      editorialUrls: ["https://www.visitvalencia.com/en/what-to-see-valencia"],
    },
  ),
  stop(
    "valencia-culture-bellas-artes",
    "Museu de Belles Arts de València",
    [39.479289, -0.3710264],
    "One of Spain's strongest regional art collections runs from Gothic Valencian altarpieces through Ribera, Velázquez, Goya, and Sorolla. Free admission and a generous schedule make it easy to underestimate; allow real museum time.",
    {
      venueKind: "culture",
      subcategory: "art_museum",
      price: "$",
      priceSource: "Official museum admission page",
      attributeTags: ["museum", "art", "free_entry", "historic"],
      hours: {
        mon: "Closed",
        tue: "10:00 AM-8:00 PM",
        wed: "10:00 AM-8:00 PM",
        thu: "10:00 AM-8:00 PM",
        fri: "10:00 AM-8:00 PM",
        sat: "10:00 AM-8:00 PM",
        sun: "10:00 AM-8:00 PM; listed holiday closures follow the official page",
      },
      officialUrl: "https://museobellasartesvalencia.gva.es/",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/5/5a/Predela_con_ocho_escenas_de_la_Pasi%C3%B3n_de_Cristo_%28Museo_de_Bellas_Artes_de_Valencia%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      editorialUrls: ["https://www.visitvalencia.com/en/what-to-see-valencia"],
    },
  ),
  stop(
    "valencia-culture-ceramica",
    "Museo Nacional de Cerámica",
    [39.4725239, -0.3746678],
    "The rococo façade of the Palacio del Marqués de Dos Aguas is only the opening act: inside are furnished palace rooms, historic Valencian ceramics, tilework, and decorative arts. The compact museum explains how craft and status intertwined.",
    {
      venueKind: "culture",
      subcategory: "decorative_arts_museum",
      price: "$",
      priceSource: "Official national museum ticket page",
      attributeTags: ["museum", "design", "historic", "central"],
      hours: {
        mon: "Closed",
        tue: "10:00 AM-2:00 PM and 4:00 PM-8:00 PM",
        wed: "10:00 AM-2:00 PM and 4:00 PM-8:00 PM",
        thu: "10:00 AM-2:00 PM and 4:00 PM-8:00 PM",
        fri: "10:00 AM-2:00 PM and 4:00 PM-8:00 PM",
        sat: "10:00 AM-2:00 PM and 4:00 PM-8:00 PM",
        sun: "10:00 AM-2:00 PM; public holidays use Sunday hours unless listed closed",
      },
      officialUrl:
        "https://www.cultura.gob.es/mnceramica/visita-museo/informacion-general.html",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/e/e7/Valencia_-_Palacio_del_Marqu%C3%A9s_de_Dos_Aguas_14.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      editorialUrls: ["https://www.visitvalencia.com/en/what-to-see-valencia"],
    },
  ),
  stop(
    "valencia-culture-cccc",
    "Centre del Carme Cultura Contemporània",
    [39.479915, -0.3787496],
    "A former convent now holds free contemporary exhibitions, performances, workshops, and two historic cloisters. The program changes quickly, so browse the current agenda rather than going for one permanent masterpiece.",
    {
      venueKind: "culture",
      subcategory: "contemporary_art_center",
      price: "$",
      priceSource: "Official free-admission policy",
      attributeTags: ["art", "free_entry", "historic", "family_friendly"],
      hours: {
        mon: "Closed",
        tue: "10:00 AM-8:00 PM",
        wed: "10:00 AM-8:00 PM",
        thu: "10:00 AM-8:00 PM",
        fri: "10:00 AM-8:00 PM",
        sat: "10:00 AM-8:00 PM",
        sun: "10:00 AM-8:00 PM; major holiday closures follow the official calendar",
      },
      officialUrl:
        "https://www.consorcimuseus.gva.es/centro-del-carmen/?lang=es",
      timetableUrl:
        "https://www.consorcimuseus.gva.es/centro-del-carmen/agenda/",
      sourcePhoto:
        "https://www.consorcimuseus.gva.es/centro-del-carmen/wp-content/uploads/sites/2/2017/01/CCC_actualizado4-1.jpg",
      editorialUrls: ["https://www.visitvalencia.com/en/what-to-see-valencia"],
    },
  ),
  stop(
    "valencia-culture-letno",
    "L'ETNO",
    [39.4783529, -0.383332],
    "L'ETNO examines what it means to be Valencian through objects, domestic spaces, work, festivals, migration, and sharply designed displays rather than nostalgic folklore. It shares the Beneficència complex with the prehistoric museum.",
    {
      venueKind: "culture",
      subcategory: "ethnology_museum",
      price: "$",
      priceSource: "Official museum visitor page",
      attributeTags: ["museum", "history", "design", "family_friendly"],
      hours: {
        mon: "Closed",
        tue: "10:00 AM-8:00 PM",
        wed: "10:00 AM-8:00 PM",
        thu: "10:00 AM-8:00 PM",
        fri: "10:00 AM-8:00 PM",
        sat: "10:00 AM-8:00 PM",
        sun: "10:00 AM-8:00 PM; holiday exceptions follow the official page",
      },
      officialUrl: "https://letno.dival.es/es/visitanos/horarios-y-entradas",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/a/ac/Dones_a_l%27entrada_%2826789545085%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      editorialUrls: [
        "https://www.comunitatvalenciana.com/en/valencia/valencia/museums/l-etno-museu-valencia-d-etnologia",
      ],
    },
  ),
  stop(
    "valencia-culture-hortensia",
    "Centro de Arte Hortensia Herrero",
    [39.4739684, -0.373282],
    "A painstakingly restored 17th-century palace frames Hortensia Herrero's collection of contemporary art, with site-specific works by artists including Jaume Plensa and Sean Scully. The building and exposed archaeology are as important as the collection.",
    {
      venueKind: "culture",
      subcategory: "contemporary_art_museum",
      price: "$$",
      priceSource: "Official timed-ticket page",
      attributeTags: ["museum", "art", "historic", "ticketed"],
      hours: {
        mon: "Closed",
        tue: "10:00 AM-8:00 PM",
        wed: "10:00 AM-8:00 PM",
        thu: "10:00 AM-8:00 PM",
        fri: "10:00 AM-8:00 PM",
        sat: "10:00 AM-8:00 PM",
        sun: "10:00 AM-3:00 PM; last entries and holiday changes follow timed tickets",
      },
      officialUrl: "https://www.cahh.es/en/",
      sourcePhoto:
        "https://www.cahh.es/wp-content/uploads/2024/05/Fachada-CAHH-ok-819x1024.jpg",
      editorialUrls: ["https://www.visitvalencia.com/en/what-to-see-valencia"],
    },
  ),
  stop(
    "valencia-culture-bombas-gens",
    "Bombas Gens Centre d'Arts Digitals",
    [39.4854586, -0.3856387],
    "The Art Deco former hydraulic-pump factory now stages large digital and immersive exhibitions while preserving industrial architecture, a medieval cellar, and a Civil War shelter. Visit for the current production, not a fixed collection.",
    {
      venueKind: "culture",
      subcategory: "digital_art_center",
      price: "$$",
      priceSource: "Official dated ticket page",
      attributeTags: ["art", "digital", "historic", "family_friendly"],
      hours: {
        mon: "10:00 AM-9:00 PM",
        tue: "Closed",
        wed: "10:00 AM-9:00 PM",
        thu: "10:00 AM-9:00 PM",
        fri: "10:00 AM-9:00 PM",
        sat: "10:00 AM-9:00 PM",
        sun: "10:00 AM-9:00 PM; last exhibition session 7:00 PM",
      },
      officialUrl:
        "https://bombasgens.com/es/bombas-gens-centre-darts-digital/",
      sourcePhoto:
        "https://bombasgens.com/wp-content/uploads/2024/02/Dali-1024x505.jpeg",
      editorialUrls: ["https://www.visitvalencia.com/en/what-to-see-valencia"],
    },
  ),
  stop(
    "valencia-culture-lonja",
    "La Lonja de la Seda",
    [39.4744325, -0.3782604],
    "Valencia's UNESCO-listed silk exchange turns mercantile power into carved stone: twisted columns fill the Contract Hall, while the courtyard and Consulate rooms broaden the Gothic complex. The market across the street makes the medieval trading system tangible, but the carved details deserve time.",
    {
      venueKind: "culture",
      subcategory: "world_heritage_site",
      price: "$",
      priceSource: "Official monument ticket page",
      attributeTags: ["historic", "architecture", "world_heritage", "central"],
      hours: {
        mon: "10:00 AM-7:00 PM",
        tue: "10:00 AM-7:00 PM",
        wed: "10:00 AM-7:00 PM",
        thu: "10:00 AM-7:00 PM",
        fri: "10:00 AM-7:00 PM",
        sat: "10:00 AM-7:00 PM",
        sun: "10:00 AM-2:00 PM; public holidays use Sunday hours",
      },
      officialUrl: "https://lonjadelaseda.com/",
      sourcePhoto:
        "https://lonjadelaseda.com/wp-content/uploads/2026/07/lonja_exterior_opt.webp",
      editorialUrls: ["https://whc.unesco.org/en/list/782/"],
    },
  ),
  stop(
    "valencia-culture-history",
    "Museu d'Història de València",
    [39.4724822, -0.4082414],
    "Set inside the vaulted former city reservoir, the history museum traces Valencia from its Roman foundation through Islamic Balansiya, the medieval kingdom, industrial growth, and the modern city. The architecture makes the timeline unusually memorable.",
    {
      venueKind: "culture",
      subcategory: "history_museum",
      price: "$",
      priceSource: "Official municipal museum ticket page",
      attributeTags: ["museum", "history", "architecture", "family_friendly"],
      hours: {
        mon: "Closed",
        tue: "10:00 AM-7:00 PM",
        wed: "10:00 AM-7:00 PM",
        thu: "10:00 AM-7:00 PM",
        fri: "10:00 AM-7:00 PM",
        sat: "10:00 AM-7:00 PM",
        sun: "10:00 AM-2:00 PM; public holidays use Sunday hours",
      },
      officialUrl: "https://mhv.valencia.es/en/opening-hours",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/0/0f/Interior_del_Museo_de_Historia_de_Valencia_02.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      editorialUrls: ["https://www.visitvalencia.com/en/what-to-see-valencia"],
    },
  ),
  stop(
    "valencia-culture-silk-museum",
    "Museo de la Seda",
    [39.4706521, -0.3810829],
    "The former Colegio del Arte Mayor de la Seda explains the looms, guild rules, designs, and global trade behind Valencia's silk wealth. Restored frescoes and working machinery connect the craft directly to the city's grander monuments.",
    {
      venueKind: "culture",
      subcategory: "textile_museum",
      price: "$$",
      priceSource: "Official museum ticket page",
      attributeTags: ["museum", "craft", "historic", "central"],
      hours: {
        mon: "Closed",
        tue: "10:00 AM-7:00 PM",
        wed: "10:00 AM-7:00 PM",
        thu: "10:00 AM-7:00 PM",
        fri: "10:00 AM-7:00 PM",
        sat: "10:00 AM-7:00 PM",
        sun: "10:00 AM-2:30 PM; holiday exceptions follow the official page",
      },
      officialUrl: "https://www.museodelasedavalencia.com/",
      sourcePhoto:
        "https://www.museodelasedavalencia.com/wp-content/uploads/fondo.jpg",
      editorialUrls: ["https://www.visitvalencia.com/en/what-to-see-valencia"],
    },
  ),
];

const activityStops: GuideStop[] = [
  stop(
    "valencia-activity-central-market",
    "Mercat Central",
    [39.4734917, -0.3789053],
    "The immense modernista market is still a working pantry of fish, produce, rice, spices, cured meats, and everyday shopping. Arrive in the morning, respect transactions at busy stalls, and look up at the iron, tile, glass, and domes.",
    {
      venueKind: "retail",
      subcategory: "market",
      price: "$",
      priceSource: "Free entry / vendor pricing",
      attributeTags: ["market", "architecture", "free_entry", "central"],
      hours: {
        mon: "7:30 AM-3:00 PM",
        tue: "7:30 AM-3:00 PM",
        wed: "7:30 AM-3:00 PM",
        thu: "7:30 AM-3:00 PM",
        fri: "7:30 AM-3:00 PM",
        sat: "7:30 AM-3:00 PM",
        sun: "Closed; also closed public holidays",
      },
      officialUrl: "https://www.mercadocentralvalencia.es/",
      sourcePhoto:
        "https://www.visitvalencia.com/sites/default/files/media/media-images/images/MERCADO-CENTRAL-teaser.jpg",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-do-valencia/valencian-culture/monuments-in-valencia/central-market",
      ],
    },
  ),
  stop(
    "valencia-activity-lonja",
    "La Lonja de la Seda",
    [39.4744325, -0.3782604],
    "Step from the market into Valencia's UNESCO-listed silk exchange, where the spiraling columns of the Contract Hall embody the wealth and discipline of the medieval trading city. The courtyard and carved details reward a slower circuit.",
    {
      venueKind: "landmark",
      subcategory: "world_heritage_site",
      price: "$",
      priceSource: "Official monument ticket page",
      attributeTags: ["historic", "architecture", "world_heritage", "central"],
      hours: {
        mon: "10:00 AM-7:00 PM",
        tue: "10:00 AM-7:00 PM",
        wed: "10:00 AM-7:00 PM",
        thu: "10:00 AM-7:00 PM",
        fri: "10:00 AM-7:00 PM",
        sat: "10:00 AM-7:00 PM",
        sun: "10:00 AM-2:00 PM; public holidays use Sunday hours",
      },
      officialUrl: "https://lonjadelaseda.com/",
      sourcePhoto:
        "https://lonjadelaseda.com/wp-content/uploads/2026/07/lonja_exterior_opt.webp",
      editorialUrls: ["https://whc.unesco.org/en/list/782/"],
    },
  ),
  stop(
    "valencia-activity-cathedral",
    "Valencia Cathedral and El Miguelete",
    [39.475568, -0.3751126],
    "The cathedral layers Roman foundations, Islamic-era context, Gothic structure, baroque interventions, a claimed Holy Grail, and the Miguelete bell-tower climb. Visit around worship and decide in advance whether the 207-step view is part of the plan.",
    {
      venueKind: "landmark",
      subcategory: "cathedral",
      price: "$$",
      priceSource: "Official cathedral visitor ticket page",
      attributeTags: ["historic", "architecture", "scenic", "central"],
      hours: {
        default:
          "Cathedral visitor admission, museum access, Miguelete climbs, worship restrictions, and seasonal closures follow the exact dated schedule on the official cathedral visitor page.",
      },
      officialUrl: "https://catedraldevalencia.es/",
      sourcePhoto:
        "https://catedraldevalencia.es/wp-content/uploads/2019/10/ft-frontpage.jpg",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-see-valencia/must-sees",
      ],
    },
  ),
  stop(
    "valencia-activity-oceanografic",
    "Oceanogràfic València",
    [39.4530495, -0.3471814],
    "Europe's largest aquarium organizes marine habitats across dramatic architecture, with wetlands, sharks, belugas, penguins, and a long underwater tunnel. It is a half-day institution, not an hour squeezed between nearby buildings.",
    {
      venueKind: "culture",
      subcategory: "aquarium",
      price: "$$$",
      priceSource: "Official dated ticket page",
      attributeTags: [
        "family_friendly",
        "marine_life",
        "ticketed",
        "accessible",
      ],
      hours: {
        default:
          "Open daily; exact opening and seasonal closing times follow Oceanogràfic's dated official calendar, and the ticket office closes one hour before the aquarium.",
      },
      officialUrl:
        "https://www.oceanografic.org/va/planifica-tu-visita-al-oceanografic-de-valencia/tarifas-y-horarios/",
      sourcePhoto:
        "https://www.arquitecturacontemporanea.org/wp-content/uploads/2024/12/Loceanografic-valencia-2009_6.jpg",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-see-valencia/must-sees",
      ],
    },
  ),
  stop(
    "valencia-activity-science-museum",
    "Museu de les Ciències",
    [39.4548409, -0.3534144],
    "Calatrava's vast ribbed building is filled with hands-on science displays that work best for families and curious generalists rather than visitors seeking a traditional collection. Pair the interior with time to walk the surrounding pools and gardens.",
    {
      venueKind: "culture",
      subcategory: "science_museum",
      price: "$$",
      priceSource: "Official dated ticket page",
      attributeTags: [
        "museum",
        "family_friendly",
        "architecture",
        "interactive",
      ],
      hours: {
        default:
          "Opens daily at 10:00 AM; exact seasonal closing times follow the City of Arts and Sciences dated calendar—August 2026 dates list closing at 9:00 PM.",
      },
      officialUrl: "https://cac.es/en/rates/",
      sourcePhoto:
        "https://cdn-imgix.headout.com/media/images/040859c2a791a30506a811c5dd5a48fe-13673-valencia-skip-the-line-tickets-to-valencia-science-museum-11.jpg",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-see-valencia/must-sees",
      ],
    },
  ),
  stop(
    "valencia-activity-turia-bike",
    "Cycle the Turia Garden",
    [39.4816085, -0.3820149],
    "The former riverbed is Valencia's most useful cross-city route, carrying bikes and walkers through sports grounds, gardens, bridges, Gulliver Park, and toward the City of Arts and Sciences. Rent a bike and use it as transport, not merely a loop.",
    {
      venueKind: "outdoors",
      subcategory: "urban_cycle_route",
      price: "$",
      priceSource: "Public park; bicycle rental separate",
      attributeTags: [
        "nature",
        "bike_friendly",
        "free_entry",
        "family_friendly",
      ],
      hours: {
        default:
          "Open 24 hours daily without gates; bike-rental shops, sports facilities, and events follow their own official schedules.",
      },
      officialUrl:
        "https://www.visitvalencia.com/en/valencia-accesible/turia-garden",
      sourcePhoto:
        "https://www.visitvalencia.com/sites/default/files/media/media-images/images/Jardin-turia-bonita.jpg",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-see-valencia/must-sees",
      ],
    },
  ),
  stop(
    "valencia-activity-bioparc",
    "BIOPARC Valencia",
    [39.478332, -0.4112193],
    "BIOPARC uses immersive habitats to connect African savanna, equatorial forest, wetlands, and Madagascar species with fewer visible barriers than a traditional zoo. Welfare questions remain part of any zoo visit; the habitat design is nevertheless unusually coherent.",
    {
      venueKind: "culture",
      subcategory: "zoo",
      price: "$$$",
      priceSource: "Official dated ticket page",
      attributeTags: ["family_friendly", "wildlife", "outdoors", "ticketed"],
      hours: {
        default:
          "Open daily; exact closing time changes with daylight and follows the official date selector. Last admission is one hour before closing, with animal areas beginning to close earlier.",
      },
      officialUrl: "https://bioparcvalencia.es/en/prepara-tu-visita/",
      sourcePhoto:
        "https://bioparcvalencia.es/wp-content/uploads/2024/04/BIOPARC-Valencia-elefantes-recorriendo-la-Sabana.jpg",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-see-valencia/must-sees",
      ],
    },
  ),
  stop(
    "valencia-activity-albufera",
    "Albufera Natural Park and Boat Ride",
    [39.3054851, -0.3427387],
    "South of the city, the lagoon, rice fields, pine forest, and barraca landscape explain the ecology behind Valencian rice culture. A small boat near sunset gives scale to the wetland, but use authorized operators and leave time for El Palmar.",
    {
      venueKind: "outdoors",
      subcategory: "wetland_boat_trip",
      price: "$$",
      priceSource: "Public park; authorized boat trips priced separately",
      attributeTags: ["nature", "scenic", "boat", "family_friendly"],
      hours: {
        default:
          "The public landscape is accessible daily; visitor-center hours, authorized boat departures, rice-field access, hunting restrictions, and weather cancellations follow the official park and operator calendars.",
      },
      officialUrl:
        "https://www.visitvalencia.com/en/what-to-see-valencia/albufera-natural-park",
      sourcePhoto:
        "https://www.visitvalencia.com/sites/default/files/media/media-images/images/bici-embarcadero.jpg",
      editorialUrls: ["https://parquesnaturales.gva.es/es/web/pn-l-albufera"],
    },
  ),
  stop(
    "valencia-activity-malvarrosa",
    "Malvarrosa Beach",
    [39.4793904, -0.3237202],
    "Malvarrosa is Valencia's broad, easy urban beach, backed by a long promenade and straightforward tram access. It is best for an unplanned swim or sunset walk; quieter dunes and wilder landscape begin farther south at La Devesa.",
    {
      venueKind: "outdoors",
      subcategory: "urban_beach",
      price: "$",
      priceSource: "Free public beach",
      attributeTags: ["beach", "free_entry", "family_friendly", "accessible"],
      hours: {
        default:
          "Public beach and promenade are open daily; lifeguards, accessible bathing, toilets, rental services, and swimming flags operate on the exact seasonal municipal beach schedule.",
      },
      officialUrl:
        "https://www.visitvalencia.com/en/what-to-see-valencia/beaches-in-Valencia/city-beaches/la-malvarrosa-beach",
      sourcePhoto:
        "https://www.visitvalencia.com/sites/default/files/media/media-images/images/i/img_2187.jpg",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-see-valencia/beaches-in-valencia",
      ],
    },
  ),
  stop(
    "valencia-activity-les-arts",
    "Guided Visit to Palau de les Arts",
    [39.458032, -0.3559094],
    "An official tour opens the opera house's monumental interiors, performance halls, and backstage logic when rehearsals permit. The building is more intelligible from inside than from a quick photograph across the water.",
    {
      venueKind: "event_venue",
      subcategory: "opera_house_tour",
      price: "$$",
      priceSource: "Official guided-tour ticket page",
      attributeTags: ["architecture", "music", "guided_tour", "ticketed"],
      hours: {
        default:
          "Standard guided tours Mon-Sat at 1:00 PM, 3:30 PM, and 4:30 PM; Sun at 10:15 AM, 11:30 AM, and 1:00 PM. Performances and rehearsals can alter access, so the dated booking calendar controls.",
      },
      officialUrl: "https://www.lesarts.com/en/guided-tours.html",
      timetableUrl:
        "https://www.lesarts.com/en/programme/c/525-visita-guiada.html",
      sourcePhoto:
        "https://upload.wikimedia.org/wikipedia/commons/6/6c/20151119_044_Valencia_-_Palau_de_les_Arts_Reina_Sof%C3%ADa_%2822658475313%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
      editorialUrls: [
        "https://www.visitvalencia.com/en/what-to-see-valencia/must-sees",
      ],
    },
  ),
];

function guide(
  category: ListCategory,
  id: string,
  slug: string,
  seoSlug: string,
  title: string,
  description: string,
  stops: GuideStop[],
  overviews: ListSource[],
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
    photo: stops.find((item) => Boolean(item.photo))?.photo,
    url: maps(`${title} Valencia Spain`),
    category,
    location: valenciaLocation,
    creator: {
      id: `user-rguide-${category.toLowerCase()}`,
      name: `R ${category}`,
      avatar: avatar(category),
    },
    upvotes: 0,
    createdAt,
    stops,
    sources: guideSources(overviews, stops),
  };
}

export const valenciaCitywideGuides: MapList[] = [
  guide(
    "Food",
    "list-valencia-citywide-dining",
    "valencia-best-restaurants-citywide",
    "best-restaurants",
    "Valencia Restaurants Beyond the Paella Checklist",
    "Valencia's strongest dining connects the huerta, Mediterranean fish, rice culture, preserved seafood, ambitious tasting menus, and old Cabanyal bodegas. These ten restaurants show that range while making the reservation commitment and price difference clear.",
    diningStops,
    [
      source(
        "Visit Valencia restaurant guide",
        "https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy/where-to-eat-restaurant-valencia",
      ),
      source(
        "Visit Valencia paella guide",
        "https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy/what-to-eat/where-eat-paella-valencia",
      ),
      source(
        "MICHELIN Guide Valencia",
        "https://guide.michelin.com/es/en/comunidad-valenciana/valencia/restaurants",
      ),
    ],
    "Best Restaurants in Valencia for Paella, Tasting Menus, and Bodegas",
    "Source-backed Valencia restaurant guide covering Ricard Camarena, El Poblet, La Salita, Fierro, Riff, Lienzo, Kaido, Casa Carmela, Casa Montaña, and Anyora.",
  ),
  guide(
    "Food",
    "list-valencia-medium-cheap-eats",
    "valencia-best-cheap-eats-medium-budget",
    "best-cheap-eats",
    "Esmorzaret, Horchata, Markets, and Valencia's Everyday Tables",
    "Valencia's best affordable food is rooted in morning bocadillos, market counters, tiled bodegas, seasonal clóchinas, horchata, and reliable all-day taverns. The ten stops mix quick central bites with neighborhood institutions worth crossing town for.",
    cheapEatStops,
    [
      source(
        "Visit Valencia tapas guide",
        "https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy/what-to-eat/tapas",
      ),
      source(
        "Visit Valencia restaurant guide",
        "https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy/where-to-eat-restaurant-valencia",
      ),
      source(
        "Visit Valencia gastronomy guide",
        "https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy",
      ),
    ],
    "Best Cheap Eats in Valencia for Esmorzaret, Horchata, and Tapas",
    "Affordable Valencia food guide with Central Bar, Cremaet, La Pilareta, Pascuala, Bar Ricardo, Santa Catalina, Daniel, Fila El Labrador, Pelayo, and Casa Baldo.",
  ),
  guide(
    "Stay",
    "list-valencia-citywide-hotels",
    "valencia-best-hotels-citywide",
    "best-hotels",
    "Hotels for Palace History, Beach Time, and Smarter City Bases",
    "Valencia's hotel choices range from archaeological palace conversions and high-energy design rooms to a true beachfront resort. This hotel-only guide separates location, atmosphere, wellness, and scale so the nightly premium has a reason.",
    hotelStops,
    [
      source(
        "Visit Valencia accommodation guide",
        "https://www.visitvalencia.com/en/plan-your-trip-valencia/accommodation-valencia",
      ),
      source(
        "Booking.com Valencia hotels",
        "https://www.booking.com/city/es/valencia.html",
      ),
    ],
    "Best Hotels in Valencia for Luxury, Design, Beach, and Central Stays",
    "Hotel-only Valencia guide with Caro, Palacio Vallier, Only YOU, Hospes, Las Arenas, Westin, Palacio Santa Clara, Helen Berger, ESTIMAR, and One Shot Mercat.",
  ),
  guide(
    "Stay",
    "list-valencia-citywide-hostels",
    "valencia-best-hostels-citywide",
    "best-hostels",
    "Hostels for Solo Trips, Social Nights, and Quiet Sleep",
    "Valencia's hostels cover intimate kitchen-led stays, large social properties, privacy pods, garden rooms, and transport-first bases. Hotels are excluded so dorm layout, reception limits, security, guest kitchens, and actual traveler fit stay visible.",
    hostelStops,
    [
      source(
        "Hostelworld Valencia hostels",
        "https://www.hostelworld.com/hostels/europe/spain/valencia/",
      ),
      source(
        "Visit Valencia accommodation guide",
        "https://www.visitvalencia.com/en/plan-your-trip-valencia/accommodation-valencia",
      ),
    ],
    "Best Hostels in Valencia for Solo Travelers, Groups, and Budget Beds",
    "Hostel-only Valencia guide with Home Youth, Central House, River, Purple Nest, Colo Colo, Room00, Red Nest, Cantagua, The Venue, and U-nit Central Park.",
  ),
  guide(
    "Nightlife",
    "list-valencia-pubs-dive-bars",
    "valencia-best-pubs-dive-bars",
    "best-pubs-and-dive-bars",
    "Bodegas, Beer Rooms, and Live-Music Valencia",
    "Valencia's casual nightlife is strongest in old bodegas, plaza terraces, craft-beer rooms, cultural cafés, and compact music venues. These ten stops favor local texture, real programming, and an easy drink over velvet-rope theater.",
    pubStops,
    [
      source(
        "Visit Valencia nightlife guide",
        "https://www.visitvalencia.com/en/what-to-do-valencia/valencia-by-night/pubs-and-discos-in-valencia",
      ),
      source(
        "Visit Valencia tapas guide",
        "https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy/what-to-eat/tapas",
      ),
    ],
    "Best Pubs and Casual Bars in Valencia for Bodegas, Beer, and Live Music",
    "Valencia pub guide covering Casa Montaña, Fila El Labrador, Café Negrito, Radio City, Jimmy Glass, La Fábrica de Hielo, Ubik, Olhöps, Tyris, and Loco Club.",
  ),
  guide(
    "Nightlife",
    "list-valencia-cocktail-bars",
    "valencia-best-cocktail-bars",
    "best-cocktail-bars",
    "Cocktail Bars for Rooftops, Agua de Valencia, and Serious Technique",
    "Valencia cocktails move between the history of agua de Valencia, theatrical salons, modern rooftops, culinary experimentation, wine depth, and intimate Ruzafa bars. The list balances views with rooms where the drink itself still matters.",
    cocktailStops,
    [
      source(
        "Visit Valencia cocktail bars 2026",
        "https://blog.visitvalencia.com/en/best-cocktail-bars-in-valencia",
      ),
      source(
        "Visit Valencia nightlife guide",
        "https://www.visitvalencia.com/en/what-to-do-valencia/valencia-by-night/pubs-and-discos-in-valencia",
      ),
    ],
    "Best Cocktail Bars in Valencia for Rooftops and Agua de Valencia",
    "Source-backed Valencia cocktail guide with Café Madrid, Soul of 1927, Café de las Horas, Luna, Lladró, Atenea, COOKTL, Lupin, Borgia, and Lunin.",
  ),
  guide(
    "Culture",
    "list-valencia-citywide-culture",
    "valencia-best-culture-museums-landmarks-citywide",
    "best-culture",
    "Museums That Explain Valencia Through Art, Silk, and Daily Life",
    "Valencia's cultural institutions connect Gothic painting, ceramics, silk production, ethnology, contemporary art, industrial architecture, and the city's own layered history. These ten places favor interpretive depth over a parade of photogenic façades.",
    cultureStops,
    [
      source(
        "Visit Valencia cultural sights",
        "https://www.visitvalencia.com/en/what-to-see-valencia",
      ),
      source(
        "Visit Valencia must-sees",
        "https://www.visitvalencia.com/en/what-to-see-valencia/must-sees",
      ),
      source(
        "Valencian Community museums",
        "https://www.comunitatvalenciana.com/en/cultural-tourism/museums",
      ),
    ],
    "Best Museums and Culture in Valencia for Art, History, Silk, and Design",
    "Valencia culture guide with IVAM, Fine Arts, Ceramics, CCCC, L'ETNO, Hortensia Herrero, Bombas Gens, La Lonja, the History Museum, and Silk Museum.",
  ),
  guide(
    "Activities",
    "list-valencia-top-things-to-do",
    "valencia-top-things-to-do",
    "best-things-to-do",
    "Ten Stops That Make a First Valencia Trip Work",
    "A strong first Valencia trip needs the market and silk exchange, a cathedral climb, the City of Arts and Sciences, the Turia by bike, a beach, Albufera rice country, wildlife, and a look inside the opera house. These ten stops give the city range without frantic monument counting.",
    activityStops,
    [
      source(
        "Visit Valencia must-sees",
        "https://www.visitvalencia.com/en/what-to-see-valencia/must-sees",
      ),
      source(
        "Visit Valencia sights",
        "https://www.visitvalencia.com/en/what-to-see-valencia",
      ),
      source(
        "Visit Valencia beaches",
        "https://www.visitvalencia.com/en/what-to-see-valencia/beaches-in-valencia",
      ),
    ],
    "Top Things to Do in Valencia With 10 Essential Stops",
    "Ten source-backed Valencia activities: Mercat Central, La Lonja, the Cathedral, Oceanogràfic, Science Museum, Turia cycling, BIOPARC, Albufera, Malvarrosa, and Les Arts.",
  ),
];

valenciaCitywideGuides.push(
  buildNatureGuide({
    city: "Valencia",
    country: "Spain",
    continent: "Europe",
    id: "list-valencia-citywide-nature",
    slug: "valencia-wetlands-dunes-beaches-and-gardens",
    seoSlug: "best-parks-and-nature",
    seoTitle:
      "Best Parks and Nature in Valencia for Wetlands, Beaches, and Gardens",
    seoDescription:
      "Ten source-backed Valencia landscapes spanning the Turia, Albufera lagoon, coastal dunes, urban beaches, botanical collections, and neighborhood parks.",
    title: "Lagoon Light, Coastal Dunes & Gardens in the Riverbed",
    description:
      "Valencia's landscape runs from an urban garden reclaimed from a river to rice-field wetlands, Mediterranean dunes, formal gardens, botanical collections, and everyday neighborhood parks. These ten places show how water management and public green space shape the city.",
    createdAt,
    checkedAt,
    sources: [
      source(
        "Visit Valencia parks and gardens",
        "https://www.visitvalencia.com/que-hacer-valencia/naturaleza-en-valencia/parques-y-jardines",
      ),
      source(
        "Visit Valencia Albufera Natural Park",
        "https://www.visitvalencia.com/en/what-to-see-valencia/albufera-natural-park",
      ),
      source(
        "Visit Valencia beaches",
        "https://www.visitvalencia.com/en/what-to-see-valencia/beaches-in-valencia",
      ),
      source("Valencia municipal gardens", "https://jardins.valencia.es/es"),
    ],
    stops: [
      {
        id: "valencia-nature-turia",
        name: "Turia Garden",
        coordinates: [39.4816085, -0.3820149],
        description:
          "Nine kilometers of former riverbed form Valencia's great public commons: paths, sports grounds, orange trees, bridges, playgrounds, and a near-continuous bike route to the City of Arts and Sciences. Use it as both park and transport spine.",
        hours: {
          default:
            "Open 24 hours daily without gates; sports grounds, Gulliver Park, cafés, events, and rental services keep separate official schedules.",
        },
        officialUrl:
          "https://www.visitvalencia.com/en/valencia-accesible/turia-garden",
        photo:
          "https://www.visitvalencia.com/sites/default/files/media/media-images/images/Jardin-turia-bonita.jpg",
        attributeTags: [
          "nature",
          "bike_friendly",
          "free_entry",
          "family_friendly",
        ],
      },
      {
        id: "valencia-nature-albufera",
        name: "Albufera Natural Park",
        coordinates: [39.3054851, -0.3427387],
        description:
          "The coastal lagoon, rice paddies, reed beds, pine forest, and migration routes south of Valencia are the ecological foundation of the region's rice culture. Sunset is beautiful, but the wetland deserves more than a boat-trip backdrop.",
        hours: {
          default:
            "Public landscapes are accessible daily; visitor-center hours, authorized boat departures, birding access, rice-field work, hunting restrictions, and weather closures follow official park calendars.",
        },
        officialUrl:
          "https://www.visitvalencia.com/en/what-to-see-valencia/albufera-natural-park",
        photo:
          "https://www.visitvalencia.com/sites/default/files/media/media-images/images/bici-embarcadero.jpg",
        editorialUrls: ["https://parquesnaturales.gva.es/es/web/pn-l-albufera"],
        attributeTags: ["nature", "wetland", "birding", "scenic"],
      },
      {
        id: "valencia-nature-devesa",
        name: "La Devesa Beach and Dunes",
        coordinates: [39.3294389, -0.302635],
        description:
          "La Devesa protects a rarer sequence of beach, mobile dunes, dune slacks, pine woods, and lagoon edge inside Albufera Natural Park. Boardwalks and marked paths help visitors avoid trampling the fragile vegetation.",
        hours: {
          default:
            "Public beach and marked paths are accessible daily; lifeguards operate 10:00 AM-7:30 PM on the exact listed summer dates, while storms, fire risk, and conservation work can restrict access.",
        },
        officialUrl:
          "https://www.visitvalencia.com/en/what-to-see-valencia/beaches-in-Valencia/beaches-on-the-outskirts/la-devesa-beach",
        photo:
          "https://www.visitvalencia.com/sites/default/files/media/media-images/images/_/_mg_6794.jpg",
        attributeTags: ["nature", "beach", "dunes", "quiet"],
      },
      {
        id: "valencia-nature-malvarrosa",
        name: "Malvarrosa Beach",
        coordinates: [39.4793904, -0.3237202],
        description:
          "Malvarrosa is the city's broad, accessible Mediterranean beach, with a long promenade and enough space for swimming, walking, and an easy sunset. The value is convenience; for wild dunes, continue south to La Devesa.",
        hours: {
          default:
            "Public beach and promenade are open daily; lifeguards, accessible bathing, toilets, rentals, and swimming flags follow the exact seasonal municipal beach schedule.",
        },
        officialUrl:
          "https://www.visitvalencia.com/en/what-to-see-valencia/beaches-in-Valencia/city-beaches/la-malvarrosa-beach",
        photo:
          "https://www.visitvalencia.com/sites/default/files/media/media-images/images/i/img_2187.jpg",
        attributeTags: ["beach", "free_entry", "accessible", "family_friendly"],
      },
      {
        id: "valencia-nature-cabecera",
        name: "Parque de Cabecera",
        coordinates: [39.4773309, -0.4088082],
        description:
          "At the western head of the Turia, Parque de Cabecera reshapes the former river into wooded paths, lawns, a lake, and low hills. It feels less formal than the central garden and is useful for a picnic before or after BIOPARC.",
        hours: {
          default:
            "Open-access park available daily; lake activities, events, adjacent BIOPARC, and any weather or maintenance restrictions keep separate official schedules.",
        },
        officialUrl: "https://jardins.valencia.es/es/jardin/parque-de-cabecera",
        photo: "https://aumsa.es/wp-content/uploads/2019/10/pc2.jpg",
        attributeTags: ["nature", "picnic", "family_friendly", "free_entry"],
      },
      {
        id: "valencia-nature-central-park",
        name: "Parque Central",
        coordinates: [39.4575923, -0.3785426],
        description:
          "Parque Central converts former rail land into a contemporary garden of shaded walks, water, restored industrial buildings, playgrounds, and planting tied to Valencian landscapes. It is especially useful with children or while waiting for a train.",
        hours: {
          default:
            "Daily 8:00 AM-9:00 PM in spring and summer; daily 8:00 AM-7:00 PM in fall and winter. Seasonal changeover dates and exceptional closures follow the official park page.",
        },
        officialUrl:
          "https://www.visitvalencia.com/que-hacer-valencia/naturaleza-en-valencia/parques-y-jardines/parque-central",
        photo:
          "https://www.visitvalencia.com/sites/default/files/media/media-images/images/parquecentral2.jpg",
        attributeTags: ["nature", "design", "family_friendly", "accessible"],
      },
      {
        id: "valencia-nature-monforte",
        name: "Jardín de Monforte",
        coordinates: [39.477647, -0.3648339],
        description:
          "Monforte is a small 19th-century formal garden of clipped hedges, statues, magnolias, fountains, and quiet architectural axes. Its scale and controlled entrances preserve a calm that the open Turia cannot.",
        hours: {
          default:
            "Mar-Oct daily 10:00 AM-8:00 PM; Nov-Feb daily 10:00 AM-6:00 PM. Holiday exceptions and weather closures follow the municipal garden page.",
        },
        officialUrl: "https://jardins.valencia.es/es/jardin/jardin-de-monforte",
        photo:
          "https://www.uv.es/recursos/fatwirepub/ccurl/442/84/Web%20Jard%C3%AD%20Monforte%20imatge.jpg",
        attributeTags: ["nature", "historic", "quiet", "romantic"],
      },
      {
        id: "valencia-nature-botanical",
        name: "University Botanical Garden",
        coordinates: [39.4768614, -0.3867241],
        description:
          "The University of Valencia's botanical garden holds Mediterranean, tropical, desert, medicinal, and historic plant collections behind old walls near El Carme. Mature trees and glasshouses make it a compact lesson in both botany and urban refuge.",
        hours: {
          default:
            "Daily: Jan-Feb 10:00 AM-6:00 PM; Mar and Oct 10:00 AM-7:00 PM; Apr and Sep 10:00 AM-8:00 PM; May-Aug 10:00 AM-9:00 PM. Closed for strong wind or rain, Dec 25, and Jan 1.",
        },
        officialUrl:
          "https://www.jardibotanic.org/?apid=on_estem_horaris_i_contacte&idioma=_spa",
        photo:
          "https://www.visitvalencia.com/sites/default/files/media/media-images/images/jardin-botanico-valencia_3_H.jpg",
        attributeTags: ["nature", "botanical", "quiet", "educational"],
      },
      {
        id: "valencia-nature-viveros",
        name: "Jardines del Real (Viveros)",
        coordinates: [39.4804909, -0.3678096],
        description:
          "Viveros is a large, layered city garden with mature shade, rose beds, sculptures, playgrounds, and traces of the former royal palace. It works for a quiet reset after the Fine Arts Museum across the road.",
        hours: {
          default:
            "Mar-Oct daily 7:30 AM-9:30 PM; Nov-Feb daily 7:30 AM-8:30 PM. Exceptional closures follow the municipal garden page.",
        },
        officialUrl:
          "https://jardins.valencia.es/es/jardin/jardines-del-real-viveros",
        photo:
          "https://www.visitvalencia.com/sites/default/files/media/media-images/images/jardines-real.jpg",
        attributeTags: ["nature", "historic", "family_friendly", "free_entry"],
      },
      {
        id: "valencia-nature-marxalenes",
        name: "Parque de Marxalenes",
        coordinates: [39.4869503, -0.3817651],
        description:
          "Marxalenes preserves farmhouses, irrigation channels, and industrial traces inside a neighborhood park planted with Mediterranean species. It makes Valencia's relationship with the huerta legible without leaving the city.",
        hours: {
          default:
            "Mar-Oct daily 7:30 AM-9:30 PM; Nov-Feb daily 7:30 AM-8:30 PM. Exceptional closures follow the municipal garden page.",
        },
        officialUrl:
          "https://jardins.valencia.es/es/jardin/parque-de-marxalenes",
        photo:
          "https://image.jimcdn.com/app/cms/image/transf/dimension%3Dorigxorig%3Aformat%3Djpg/path/sf9f3fc00cba51ae4/image/i60e6a519773a4409/version/1635144736/una-de-las-acequias-en-el-parque-de-marxalenes-en-valencia-ciudad.jpg",
        editorialUrls: [
          "https://www.valencia.es/documents/20142/0/1011%2BTaula%2Bhoraris%2Bparcs%2Bi%2Bjardins.pdf/474c02e1-daaa-b07a-0996-ad2b1e32bc89?t=1602579135786",
        ],
        attributeTags: ["nature", "local_history", "quiet", "free_entry"],
      },
    ],
  }),
);
