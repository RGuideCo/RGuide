import type { MapList } from "@/types";

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

export const barcelonaCoreGuides = withDiveBarChips([
  {
    "id": "list-barcelona-top-parks",
    "slug": "barcelona-top-parks-in-the-city",
    "seoSlug": "best-parks",
    "seoTitle": "Best Parks in Barcelona",
    "seoDescription": "Best parks in Barcelona for Gaudi architecture, hilltop views, historic gardens, Ciutadella lawns, Montjuic walks, and green spaces worth saving.",
    "title": "Green Escapes and Hilltop Views",
    "description": "Barcelona gives you stone, traffic, and spectacle in heavy doses; this guide is where the city exhales. Start with the tiled theater of Parc Guell or the civic sprawl of Ciutadella, then climb toward Montjuic, Horta's maze, Cervantes roses, or the Bunkers del Carmel when you want the whole city laid out under the sky.",
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
        "description": "Parc Guell is the nature guide's architecture-meets-viewpoint anchor, combining Gaudi's sculptural landscape, mosaic terraces, and hillside city views. Book the monumental zone when needed and treat the visit as a planned half-day stop rather than a casual park detour.",
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
        "description": "Parc de la Ciutadella gives the list its central, easy-access green space, with 19th-century exhibition history, the Cascada Monumental, lake boating, and broad lawns. Use it as the reset between El Born, the zoo edge, and the waterfront when the route needs open air without leaving the center.",
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
        "description": "Montjuic Park is the big hill-day pick, linking gardens, lookouts, museums, castle approaches, Olympic-era venues, and botanical spaces. It is best for travelers who want nature, culture, and views in one slower route rather than a single quick photo stop.",
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
        "description": "Parc del Laberint d'Horta brings a quieter garden experience to the guide, with an 18th-century cypress maze, neoclassical design, and romantic landscaping near Collserola. Use it when the city center feels too dense and the plan can support a more intentional trip north.",
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
        "description": "Parc de Cervantes earns its place through the rose collection, with thousands of bushes and peak blooms from late spring into summer. It is a seasonal, calmer Pedralbes stop that works best when the route is already leaning west or needs a quieter garden break.",
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
        "description": "Parc del Guinardo and the Bunkers del Carmel give the guide its strongest panoramic payoff, with Turo de la Rovira's former anti-aircraft battery remains and wide skyline views. Go for sunset or clear-weather views, but plan the climb and crowds instead of treating it like a simple neighborhood park.",
        "hours": {
          "default": "Park 24h; Bunkers ~8:30 AM-7:30 PM (night-restricted)."
        },
        "photo": "https://thirdeyetraveller.com/wp-content/uploads/Carmel-del-Bunkers-Barcelona-6.jpg"
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
    "description": "Barcelona airport transport is simple once you stop treating it as one option. Aerobus is the easiest city-center shuttle, the R2 Nord train is the cleanest rail move if Terminal 2 or Sants/Passeig de Gracia fit your route, and taxis or Uber make sense when luggage, late arrivals, or awkward addresses start to matter. Use this guide as the practical decision layer: where to stand, which direction the stops run, and which timetable link to trust before you move.",
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
            "description": "Airport-to-city buses use the Gran Via/Comte Borrell area; city-to-airport buses use Sepulveda - Comte d'Urgell. This is the stop to understand if you are staying in the lower Eixample or Sant Antoni.",
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
            "description": "This is the key city-to-airport stop between Placa Catalunya and Placa Espanya. Use it for A1 or A2 outbound if you are staying around Sant Antoni or the lower Eixample.",
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
        "description": "The R2 Nord is the airport train to know: it serves the Airport station at Terminal 2 and runs into Barcelona through El Prat, Bellvitge, Sants, Passeig de Gracia, and El Clot-Arago before continuing north. It is usually the best value if you are landing at T2 or connecting to Sants, but T1 passengers must first use the free terminal shuttle to reach the train. Timetables: https://rodalies.gencat.cat/en/horaris/index.html",
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
            "description": "A suburban stop before the train enters the central Barcelona rail corridor.",
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
            "description": "A practical stop for Clot, Poblenou-side transfers, and northeast Barcelona rather than the old city.",
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
            "description": "Taxi rank outside the T2A arrivals side. Follow taxi signage after baggage claim.",
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
    "description": "The Gothic Quarter is beautiful, crowded, and very good at selling mediocre dinners to tired people. This guide steers toward rooms with a point of view: La Sosenga and Capet for sharper Catalan cooking, Bar La Plata for the old counter feeling, Sensi Bistro and Bistrot Levante when the night wants something softer. Bar Oviso, Bar Lobo, Els Quatre Gats, and Milk keep it useful when the plan is casual but still needs a real address.",
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
        "description": "La Sosenga is the Gothic Quarter safeguard against old-town sameness: a small Catalan room where seasonal cooking and regional references matter more than medieval-lane atmosphere. It is best for diners who want a calmer, food-first reservation inside the busiest part of the city.",
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
        "description": "Eater's Old City coverage and Google Maps signals make Bistrot Levante useful as a modern counterpoint to the Gothic Quarter's traditional taverns. The draw is not landmark history; it is a compact bistro on Placeta de Manuel Ribé with Eastern Mediterranean flavors, good vegetable-forward plates, and a calmer room that works for lunch or dinner when nearby streets are packed.",
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
        "description": "Bar La Plata earns its spot through longevity, traveler-review consistency, and a menu that has stayed intentionally short since 1945. The value is the whole old-tavern package: fried fish, tomato salad, butifarra, house wine, fast counter service, and a room that still feels local despite being deep in the Gothic Quarter.",
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
        "description": "Capet is the small-room Gothic Quarter splurge for contemporary Catalan cooking without the full production of Barcelona's headline tasting menus. It works when the brief is intimate, chef-led, polished, and firmly dinner-focused.",
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
        "description": "Sensi Bistro is the polished, visitor-friendly creative tapas option near Plaça Reial, useful for groups that want composed sharing plates without gambling on the Gothic Quarter lanes. It is more international bistro-tapas than hidden local tavern, which is exactly why it works for an easy dinner.",
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
              "description": "Bar Oviso is the casual Gothic food-and-drink stop for tapas, beers, and a low-pressure old-city pause. It belongs in food more than nightlife when the plan needs something easy near Plaça Sant Jaume without turning into a formal dinner.",
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
              "description": "Bar Lobo is the roomy Gothic/Raval-edge option for Mediterranean plates, tapas, and a meal that can stretch into drinks. Use it when centrality, space, and broad appeal matter more than finding a tiny hidden tavern.",
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
              "description": "Els Quatre Gats is an art nouveau-style cafe, restaurant, and tavern opened in 1896, useful for travelers who want Barcelona art history with a meal. It is more heritage room than hidden food find, but that context is the reason to go.",
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
              "description": "Milk Bar & Bistro is the brunch-and-comfort-food pick in the Gothic Quarter, with bagels, eggs, cocktails, and an easy all-day feel near Plaça Reial. It works best when breakfast, brunch, or a relaxed meal matters more than tapas tradition.",
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
    "description": "El Born is at its best when the meal feels tangled up with the streets around it: stone lanes, museum crowds, cava glasses, and kitchens running hot behind narrow doors. Cal Pep and El Xampanyet bring the counter-and-cava Barcelona people come looking for, while Bar del Pla, Fismuler, Bar Brutal, and Cuines Santa Caterina make the neighborhood feel current rather than preserved. Bormuth and Casa Delfin keep the list grounded when you need something lively, easy, and close.",
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
        "description": "Cal Pep is the Born seafood-counter classic for travelers who want the room to move fast around them: clams, squid, fried fish, seasonal plates, and kitchen-led ordering from tight seats. It is a splurge for the format, but the point is the counter performance as much as the seafood.",
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
        "description": "Bar del Pla is the El Born dinner pick when tapas should feel contemporary and wine-led instead of interchangeable. Expect Catalan comfort, creative small plates, close tables, and enough neighborhood buzz to justify booking rather than wandering into the nearest old-city counter.",
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
        "description": "Fismuler is a stylish Born meal built around seasonal Mediterranean cooking, raw seafood, serious wine, and the cheesecake people keep talking about. It feels more like a destination dinner than a tapas stop, so save it for a longer night rather than a quick pre-bar bite.",
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
        "description": "Bar Brutal is famous first for wine: one of Barcelona's best-known natural-wine rooms, with low-intervention bottles driving the meal as much as the plates. Go for curious drinking, lively service, and salty snackable food in El Born; choose it when the wine list is the point, not just a side note.",
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
              "description": "Bormuth is the Born food fallback that still feels like the neighborhood: tapas, vermouth, and enough seating to turn a casual stop into dinner. It is useful when the group wants the Passeig del Born atmosphere without a delicate reservation plan.",
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
              "description": "Casa Delfín is a Born restaurant-and-tavern classic for tapas, rice, vermouth, and plaza-side people-watching near the market. It fits the food guide when the meal should be easy, central, and old-neighborhood in feel.",
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
        "description": "El Xampanyet is a short, loud Born classic: cava, anchovies, conservas, simple tapas, and a room that usually feels one order away from overflowing. Treat it as a salty pre-dinner or post-museum stop, not a slow meal.",
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
    "description": "Eixample is where Barcelona can afford to be polished without losing its appetite. Disfrutar is the obvious pilgrimage, but the guide also gives you Bar Mut's steak-and-wine confidence, Bodega Bonay's looser modern mood, and Paco Meralgo or Cerveceria Catalana when tapas need tempo. Bodega Joan and El Nacional are here for the big-table, no-mystery nights when logistics matter as much as taste.",
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
        "description": "Bar Mut is polished Eixample Barcelona: wine, seasonal Catalan plates, steakhouse-bistro comfort, and a room that feels classic without becoming formal. Use it for an expensive, grown-up meal near Passeig de Gràcia when a tasting menu would be too much.",
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
        "description": "Bodega Bonay is included because The Infatuation and reservation signals position it as one of Eixample's better modern restaurants. The draw is a stylish food-and-wine room built around Catalan natural wine, anchovies, cecina, pastas, and long lunches that feel social without requiring a tasting menu.",
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
        "description": "Paco Meralgo is the reliable mid-range tapas counter for Eixample, backed more by review volume and practical usefulness than by novelty. It works when diners want croquettes, bombas, seafood, and quick service in a polished room, especially when higher-profile reservations are unavailable.",
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
        "description": "Cervecería Catalana is not a secret and should not be sold as one; it is a high-volume Eixample tapas machine that still works when speed, choice, and counter energy matter. Go for montaditos, tortillas, seafood, and the busy-room rhythm, with the wait treated as part of the plan.",
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
              "description": "Bodega Joan is an Eixample food stop rather than a nightlife pick: homestyle Catalan tapas, charcuterie boards, paellas, sangria, and straightforward dining-room comfort. Use it when the group wants a filling, familiar meal instead of a cocktail-led night.",
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
    "description": "Gracia eats like a neighborhood that still believes in regulars, plazas, and taking your time. Bemba Smash Burger gives the guide a young, quick hit; Con Gracia and La Panxa del Bisbe bring the slower chef-led version; La Pubilla, Bar Canigo, and Bodega Quimet keep it tied to market food, vermouth, and the daily rhythm. Bar Salvatge, Gut, and Shoronpo round it out for nights when Gracia should feel more lived-in than scheduled.",
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
        "description": "Bemba is the casual Gràcia reset: a focused smash-burger counter that breaks up the parade of tapas, rice, and tasting menus. It belongs in the guide because it is quick, current, affordable, and genuinely useful on a longer Barcelona trip.",
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
        "description": "Con Gracia gives Gràcia a quiet special-occasion lane: tasting-menu pacing, wine pairing, and a more personal room than the plaza-bar circuit. It is the neighborhood choice for polish without going back down into Eixample.",
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
        "description": "La Pubilla is included for its market-facing Catalan cooking and sustained local/traveler review strength. The best use case is breakfast or lunch near Mercat de la Llibertat, where the food reads as daily neighborhood cooking rather than destination theatrics: stews, eggs, seasonal plates, and a room that turns over with regulars.",
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
              "description": "Bar Canigó is a Gràcia breakfast, lunch, tapas, and vermouth spot that earns its food-guide place through everyday usefulness. Go for a simple neighborhood meal or an early vermouth when the plan should feel local rather than curated.",
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
              "description": "Bodega Quimet is a Gràcia food-and-vermouth institution, with award-winning house vermouth, traditional tavern charm, and tapas built for conservas, cheeses, anchovies, and long grazing. It is a food stop first, even when the drink is the hook.",
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
              "description": "Bar Salvatge is the Gràcia natural-wine-and-food stop, pairing low-intervention bottles with local cuisine, cheeses, and snackable plates in a funky storefront. Use it when the wine list should shape dinner without becoming formal.",
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
        "description": "Gut is the lighter Gràcia option for Mediterranean-Asian plates, vegetables, and gluten-free or health-conscious flexibility. It is the room to choose when the group wants brightness and ease instead of another fried-and-wine-heavy night.",
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
        "description": "Shoronpo adds a non-tapas Gràcia hit with ramen, soup dumplings, tantanmen, and fried snacks in a busy, compact room. Use it when the city's Catalan-Spanish rhythm needs a sharp change without leaving the neighborhood.",
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
    "description": "Poble-sec is a hill, a theater district, a tapas crawl, and a very good excuse to let dinner turn into the night. Quimet & Quimet is the standing-room legend, Martinez gives you rice and a view, and Xemei adds Venetian-Catalan eccentricity that feels right below Montjuic. La Platilleria and Margarit keep the guide from floating away into special-occasion territory.",
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
        "description": "Quimet & Quimet is one of Poble-sec's most source-consistent food stops, supported by its own current hours, traveler reviews, and long-running editorial reputation. It is standing-room only, built around montaditos layered with smoked, preserved, and tinned ingredients, and works best as an early, focused stop with no expectation of lingering.",
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
        "description": "Martínez is a planned Montjuïc lunch, not a casual neighborhood fallback: terrace views, seafood rice, fideuà, Catalan wine, and a long meal above the port. Book it when setting and pacing matter as much as the paella pan.",
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
        "description": "Xemei gives Poble-sec a Venetian-Adriatic change of register instead of another tapas room: seafood, handmade pasta, offbeat Italian bottles, and a lively dining room that feels specific to this slope of the city. Use it when the group wants Barcelona energy with lagoon-city flavors rather than a generic seafood checklist.",
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
        "description": "La Platilleria is the warm small-plates choice for a Poble-sec dinner that does not need to become a full tasting-menu event. Review signals support it for approachable service, compact plates, and a location that works before theater, after Montjuïc, or as a calmer alternative to the busiest Carrer de Blai stops.",
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
        "description": "Margarit is a newer Poble-sec pick validated by Eater and social geo-tags, useful because it brings Mediterranean-Greek cooking and natural-wine energy to the Montjuïc slope. The appeal is dips, grilled vegetables, seafood, and a relaxed room that feels current without drifting into hype-only territory.",
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
    "description": "This is the cross-town list for meals that can carry a day instead of merely interrupting it. Disfrutar, Cal Pep, Quimet & Quimet, and Bar del Pla are the heavy anchors, but the guide also makes room for Bodega Bonay, La Sosenga, La Pubilla, and Capet, the places that make a neighborhood feel legible through the plate. Martinez, Bar Brutal, Bar La Plata, and Bemba keep the range honest: splurge, counter, wine, burger, repeat as needed.",
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
        "description": "Cal Pep earns a citywide slot because the Born counter still feels like a Barcelona meal in motion: seafood arrives quickly, the seats are tight, and the kitchen nudges the order toward what is best that day. It is not cheap, but it is memorable in a way a standard tapas crawl rarely is.",
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
        "description": "Quimet & Quimet is the classic Poble-sec stop that earns citywide placement because official hours, Time Out, traveler reviews, and long-running food-guide consensus all point to the same thing: a tiny standing-room bodega built around montaditos, conservas, beer, and vermouth. Go early and treat it as a focused pre-dinner stop, not a lingering restaurant.",
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
        "description": "Bar del Pla is the citywide pick for a real El Born dinner that still has tapas flexibility: creative Catalan plates, a wine-first mood, and enough buzz to feel current without becoming pure scene. Book it when the night should start with food and naturally roll toward drinks.",
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
        "description": "Disfrutar anchors the citywide list as the meal people plan trips around: global recognition, a long tasting-menu arc, and very little room for spontaneity. It should read as the special reservation, not one more Barcelona dinner idea.",
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
        "description": "Bodega Bonay gives the citywide list a stylish Eixample lunch or dinner that does not require tasting-menu money. The Infatuation's 2026 review and reservation signals frame it around Catalan natural wine, anchovies, cured meats, pastas, and a social long-lunch scene.",
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
        "description": "La Sosenga keeps the all-city list from over-indexing on famous counters. It is a calmer Gothic Quarter reservation for seasonal Catalan cooking, regional references, and a dining room that feels protected from the old-town tourist churn outside.",
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
        "description": "Bar La Plata is the cheap classic because its value is unusually clear: a short menu, fried fish, tomato salad, butifarra, house wine, and a Gothic Quarter room that has not inflated itself into a concept. Tripadvisor and Google Maps support it as a practical old-tavern stop when the plan needs something quick, local-feeling, and low-fuss.",
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
        "description": "La Pubilla is the Gràcia market-lunch pick, useful because it shows Barcelona's daily Catalan cooking away from the old-city circuit. The support is more practical than hype-driven: sustained review strength, Mercat de la Llibertat proximity, stews, eggs, seasonal plates, and daytime hours that make it best for breakfast or lunch.",
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
        "description": "Bemba is the casual pressure valve in a citywide food plan, useful precisely because it is not tapas, rice, or fine dining. The focused smash-burger counter gives Gràcia a quick, affordable stop that still feels chosen.",
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
        "description": "Bar Brutal belongs citywide because Barcelona natural-wine drinkers know it as a reference point. The food is snackable and lively, but the real reason to go is the low-intervention bottle list and the feeling that dinner is being led by the glass.",
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
        "description": "Capet is the all-city alternative for travelers who want a serious Gothic Quarter dinner without surrendering the whole evening to a famous tasting-menu machine. It is intimate, contemporary, Catalan, and better suited to a quieter splurge.",
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
    "description": "Barcelona tapas is less a checklist than a way of moving through the city: one counter for a bomba, another for fried fish, a glass of cava before the room fills, a vermouth bodega when Gràcia starts to loosen up. This guide leans into places with a reason to exist. La Cova Fumada, Bar La Plata, El Vaso de Oro, and Can Paixano keep the old rhythm alive; Quimet & Quimet, El Xampanyet, and Bodega Quimet cover the salty bottle-lined ritual; Bar Cañete, Bar del Pla, Paco Meralgo, and La Platilleria give the crawl enough polish to become dinner.",
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
        "description": "La Cova Fumada is the Barceloneta bar every tapas guide wants to sound casual about, but the place has earned the attention. No sign, odd hours, shared tables, a blackboard menu, and the famous bomba make it feel closer to a neighborhood inheritance than a restaurant concept. Go early, accept the wait, order from the board, and let the room do what it has done since 1944: feed whoever squeezes in.",
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
        "description": "Quimet & Quimet is the standing-room essential: tins, smoked fish, montaditos, beer, vermouth, and bottles stacked so tightly the room feels built out of appetite. It is too famous to be a secret and too singular to skip. Treat it as a short, high-impact Poble-sec stop, order decisively, and do not expect the meal to slow down for you.",
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
        "description": "El Xampanyet is the Born at full volume: cava, anchovies, conservas, tile walls, and a room that usually feels one order away from overflowing. It is best as a quick ritual before dinner or after the Picasso Museum, when the right move is one salty round, a glass in hand, and no fantasy that you will have the table to yourself.",
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
        "description": "Can Paixano is the cava-counter crush you plan around rather than stumble into: sparkling wine, sandwiches, simple tapas, bodies pressed into a narrow Barceloneta room, and a rule of motion that rewards arriving early. It is not delicate and does not need to be. Come for cheap bubbles and the old La Xampanyeria energy, then leave before the crowd turns the doorway into a negotiation.",
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
        "description": "El Vaso de Oro is Barceloneta standing-room theater: house beer pulled with precision, cooks moving fast, and the famous solomillo with foie giving the bar its richer edge. It looks simple until you watch how tightly the room operates. Use it when tapas should feel muscular, salty, and a little impatient, with beer doing as much work as the food.",
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
        "description": "Bar del Pla handles the guide’s modern full-meal slot, where small plates can become dinner without losing the looseness of tapas. The draw is creative Catalan cooking, a wine-first mood, and a Born room that feels current rather than preserved. Book it when the crawl needs to sit down, breathe, and eat properly.",
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
        "description": "Bodega Quimet gives the guide a Gràcia bodega that behaves like a neighborhood habit: vermouth, conservas, cheeses, anchovies, cured meats, and a room that still understands the pleasure of standing around with one more small plate. It is less trophy stop than texture, which is exactly why it belongs.",
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
        "description": "La Platilleria keeps Poble-sec from being reduced to one famous standing-room address. The room is calmer, the plates are compact and approachable, and the rhythm works before theater, after Montjuïc, or before an Apolo night. It is the kind of tapas stop that lets the neighborhood stay useful instead of turning every meal into a queue.",
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
    "description": "This guide is seafood without pretending every good fish in Barcelona has to come with a beach view. Cal Pep is the counter classic, Martinez gives rice and citywide panorama, and Fismuler brings a more polished, modern dining-room pace. Xemei, El Xampanyet, and El Nacional fill in the rest: Venetian edges, anchovy-cava simplicity, and a grander room when the night needs scale.",
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
        "description": "Cal Pep is the Born seafood-counter classic for travelers who want the room to move fast around them: clams, squid, fried fish, seasonal plates, and kitchen-led ordering from tight seats. It is a splurge for the format, but the point is the counter performance as much as the seafood.",
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
        "description": "Martínez is the seafood guide’s rice-with-a-view stop: paella, fideuà, terrace tables, and a Montjuïc perch over the port. It is seafood as a planned lunch, with the setting doing as much work as the pan.",
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
        "description": "Fismuler widens the seafood guide beyond old counters and paella terraces. The appeal is raw seafood, seasonal Mediterranean plates, wine, and a stylish Born room where the meal can stretch without feeling formal.",
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
        "description": "Xemei brings Adriatic seafood and pasta into the Barcelona seafood mix, which keeps the guide from becoming only rice and conservas. It is the Poble-sec pick for Venetian flavors, lively service, and a looser dinner mood.",
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
        "description": "El Xampanyet counts here through anchovies, conservas, and cava rather than grilled fish or seafood rice. It is the salty Born seafood snack stop: fast, crowded, and better for a round than a full dinner.",
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
        "description": "El Nacional is the seafood guide’s practical central option when a group needs choice under one roof. The seafood counter is the move, but the bigger value is late hours, central location, and a room that can absorb mixed appetites.",
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
    "description": "Catalan cooking can be quiet, seasonal, stubborn, and deeply satisfying when you stop chasing novelty. La Sosenga, La Pubilla, and Bar La Plata bring the tavern and market bones; Capet, Bar Mut, and Paco Meralgo make the tradition sharper and more urban. Bodega Bonay stretches the category just enough, letting wine, design, and familiar flavors sit at the same table.",
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
        "description": "La Sosenga is the Gothic Quarter safeguard against old-town sameness: a small Catalan room where seasonal cooking and regional references matter more than medieval-lane atmosphere. It is best for diners who want a calmer, food-first reservation inside the busiest part of the city.",
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
        "description": "La Pubilla is the Catalan market-lunch stop: stews, eggs, seasonal plates, and a room tied to Mercat de la Llibertat rather than to sightseeing traffic. Review strength and map signals make it especially useful for breakfast or lunch in Gràcia.",
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
        "description": "Capet gives the Catalan guide its refined Gothic Quarter lane: regional cooking interpreted through a small, chef-led room instead of a tavern format. It is the polished reservation when Catalan food should feel contemporary and controlled.",
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
        "description": "Bar Mut represents the polished Eixample side of Catalan eating: wine, seasonal plates, steakhouse-bistro comfort, and a classic room near Passeig de Gràcia. It is for a grown-up meal, not a tapas crawl.",
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
        "description": "Paco Meralgo gives the Catalan list a reliable mid-range tapas-counter format: croquettes, bombas, seafood, tortillas, and quick service. It is not the most obscure pick, but source and review volume make it useful when the goal is a solid Catalan meal without fine-dining cost.",
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
        "description": "Bodega Bonay represents current Catalan dining through natural wine, anchovies, cured meats, pastas, and a stylish room that works for a long lunch. The Infatuation and reservation signals make it a modern food-and-wine counterpoint to the old taverns.",
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
    "description": "These are the reservations that change the shape of the day around them. Disfrutar is the headline act, but Capet and Con Gracia give the city smaller rooms with ambition, while Martinez and Cal Pep prove that seafood can still feel like theater without a white tablecloth script. Bar Mut closes the loop with the kind of polished, carnivorous confidence that wants a long bottle and no rush.",
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
        "description": "Capet is the fine-dining pick for intimacy over spectacle. Choose it when you want contemporary Catalan cooking, reservation pacing, and a Gothic Quarter setting without the cost or theater of Barcelona’s headline tasting menus.",
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
        "description": "Con Gracia is the fine-dining choice for a quieter night in Gràcia: tasting-menu pacing, wine pairing, and a room that feels personal rather than grand. It is useful when the occasion calls for polish but not the city’s biggest-name reservations.",
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
        "description": "Bar Mut is the fine-dining list’s classic bistro option, with wine, seasonal Catalan plates, and Eixample polish in place of tasting-menu choreography. It is expensive and grown-up without being ceremonial.",
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
    "description": "The Gothic Quarter works best when you stop treating it like scenery and start reading the stones. Barcelona Cathedral, MUHBA Placa del Rei, and the Temple of Augustus put the Roman and medieval city back under your feet, while Placa de Sant Felip Neri makes the history intimate and bruised. Palau de la Generalitat adds the civic weight that keeps the quarter from becoming just a maze of pretty lanes.",
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
        "description": "Barcelona Cathedral is the Gothic Quarter's anchor because official tourism sources and visitor guides consistently use it to explain the neighborhood's medieval identity. The visit is not only the nave: the cloister, choir, rooftop, geese, and surrounding cathedral square make it the best single stop for understanding how religious architecture shapes the old-city street pattern.",
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
        "description": "MUHBA Plaça del Rei is included for its unusually clear layering of Roman Barcino and medieval Barcelona. Official museum material highlights the underground archaeological route, palace halls, and royal-city context, making this one of the strongest stops for travelers who want the Gothic Quarter to feel historically legible rather than just atmospheric.",
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
        "description": "The Temple of Augustus is a compact but high-value Roman stop, supported by Barcelona history sources because it reveals four surviving columns inside a medieval courtyard. It works best as a quick cultural detour: a small, quiet reminder that the Gothic Quarter's narrow lanes sit directly on top of the Roman city.",
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
        "description": "Plaça de Sant Felip Neri is here because guide sources repeatedly call out its emotional and architectural weight. The square combines Baroque stonework, schoolyard quiet, and visible Civil War damage, so it gives the old city a more reflective pause than the busier cathedral and Plaça Reial circuits.",
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
        "description": "Palau de la Generalitat belongs as a civic-history landmark rather than a casual museum stop. Official and tourism sources frame it as the seat of Catalonia's government, and viewing it from Plaça de Sant Jaume helps connect the Gothic Quarter's ceremonial architecture with present-day Catalan political life.",
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
    "description": "El Born is where Barcelona's culture feels compressed into a walkable afternoon: art, memory, music, and old merchant money packed into a few streets. Museu Picasso and Santa Maria del Mar give the neighborhood its spine, while El Born Centre de Cultura i Memoria turns ruins into a civic argument. Palau de la Musica Catalana and Moco pull the route toward performance and contemporary spectacle without losing the old-city charge.",
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
        "description": "Santa Maria del Mar is included as the neighborhood-made Gothic counterpoint to Barcelona Cathedral. Tourism and heritage sources highlight its Ribera guild origins, clean Catalan Gothic proportions, and soaring stone interior, making it one of the best places to feel El Born's medieval merchant history in architectural form.",
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
        "description": "El Born Centre de Cultura i Memòria is valuable because official sources position it as both a preserved market hall and an archaeological memory site. The exposed 1700s street remains make the consequences of 1714 and the transformation of the neighborhood easier to grasp than a standard museum panel would.",
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
        "description": "Palau de la Música Catalana appears in El Born-adjacent culture lists because official and UNESCO-linked sources consistently treat it as one of Barcelona's great Modernista interiors. The stained-glass skylight, ceramic columns, sculptural facade, and live-concert use make it worth seeing by tour or performance rather than only from the sidewalk.",
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
        "description": "Moco Museum is included as a contemporary counterweight to El Born's heavy historic circuit. Its source profile is more visitor-demand and modern-art driven than civic-history driven, with street art, immersive work, and recognizable names making it useful for travelers who want a lighter museum after Picasso or Santa Maria del Mar.",
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
    "description": "Eixample is not subtle, and that is the pleasure of it. Sagrada Familia, Casa Batllo, and La Pedrera turn the grid into a procession of stone, color, and impossible surfaces, while Casa Amatller reminds you that Gaudi was not the only genius in the room. Fundacio Antoni Tapies gives the walk a quieter, more intellectual stop when the facades start to blur.",
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
        "description": "Casa Batlló is included because official and guide sources treat it as one of the clearest examples of Gaudí turning a private house into a total artwork. The roofline, tiled facade, bone-like structure, light well, and immersive interpretation make it more than a photo stop on Passeig de Gràcia.",
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
        "description": "Casa Milà / La Pedrera belongs as the broader domestic-architecture lesson in Eixample. Official sources emphasize the undulating stone facade, attic structure, apartment design, and rooftop chimneys, so it works well for travelers who want to understand how Gaudí translated movement and natural forms into an inhabited building.",
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
        "description": "Fundació Antoni Tàpies is included because it combines a major Catalan artist with a Modernista industrial building, giving Eixample culture a modern-art layer beyond Gaudí. Source material highlights Tàpies' textured, material-heavy work and the building's distinctive rooftop sculpture, making it a focused stop for art-minded visitors.",
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
    "description": "Gracia is where the monumental city loosens its collar. Park Guell and Casa Vicens show Gaudi at two very different scales, but the guide matters because it also includes Cines Verdi, Placa del Sol, and Mercat de la Llibertat, the places that make the district feel lived in. Use it when culture should include a bench, a market errand, and the ordinary life around the landmark.",
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
        "description": "Casa Vicens is included because official sources identify it as Gaudí's first major house and an early statement of his style. Its ceramic surfaces, botanical motifs, Islamic-influenced geometry, and domestic scale make it one of the best ways to see Gaudí before the later, more monumental works.",
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
        "description": "Plaça del Sol is included because guide sources consistently describe Gràcia through its plazas, and this is the neighborhood's clearest social stage. The value is observational: terraces, evening gatherings, musicians, and local routines that explain the district's village identity better than a formal attraction would.",
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
        "description": "Mercat de la Llibertat gives the Gràcia list a daily-life anchor. City and tourism sources frame it as a restored 19th-century market hall, and it is best used for morning food culture, neighborhood pacing, and a quieter look at local shopping before the evening plaza scene takes over.",
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
    "description": "Montjuic turns culture into a climb, and that physical effort is part of the reward. MNAC and Fundacio Joan Miro give the hill its museum weight, CaixaForum adds a lower-slope pause, and Montjuic Castle reminds you the view has teeth. Poble Espanyol and Teatre Grec keep the day strange and theatrical, the way this side of the city should be.",
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
        "description": "MNAC is the Montjuïc heavyweight because official museum sources place major Catalan art history inside the Palau Nacional. Its Romanesque frescoes, Gothic work, modernisme, photography, and terrace views make it the strongest single museum stop for understanding Catalonia's visual culture at scale.",
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
        "description": "Fundació Joan Miró is included because official sources and guide coverage agree on the strength of both the collection and the building. The Sert-designed museum, sculpture terraces, works on paper, and Miró's color language make it a calmer, more focused Montjuïc alternative to MNAC's encyclopedic scale.",
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
        "description": "CaixaForum Barcelona earns its place as a flexible exhibition stop in a converted Modernista textile factory. Source material highlights the industrial architecture and rotating programming, so it is useful when travelers want a shorter culture visit near Plaça d'Espanya without committing to a large permanent collection.",
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
        "description": "Montjuïc Castle is included for its layered military and civic history as much as its views. Tourism sources connect it to the hill's defensive role, port control, and later political memory, making it a strong endpoint for a cable-car route, garden walk, or broader Montjuïc history day.",
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
        "description": "Teatre Grec belongs because it ties Poble-sec/Montjuïc to performance culture and summer festival life. Built into a former quarry, it is most meaningful during programmed events, but the amphitheater and gardens also make sense as part of a daytime walk through the hill's cultural landscape.",
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
        "description": "Hotel Neri is the Gothic Quarter stay for travelers who want historic texture without giving up boutique comfort. Hotel-guide and map signals support it for its restored palace setting beside Sant Felip Neri, quiet rooms, and intimate scale, making it better for a romantic old-city base than for resort-style amenities.",
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
        "description": "Mercer Hotel Barcelona is included as the luxury heritage stay in the Gothic core. Source coverage repeatedly points to the Roman wall fragments, medieval fabric, courtyard calm, and high-service positioning, so it is best for travelers who want the old city built into the property itself.",
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
        "description": "Kimpton Vividora is the polished lifestyle-hotel option near the cathedral, backed by hotel guides and Google Travel demand. Its value is central logistics, design-forward rooms, rooftop views, and a more contemporary service model for visitors who want the Gothic Quarter without staying in a small historic inn.",
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
        "description": "H10 Madison is included because hotel sources and map demand show it as a practical central stay with a strong rooftop setup. It works well for first-time visitors who want cathedral access, Palau de la Música proximity, Plaça Catalunya transit, and a hotel that is straightforward rather than overly precious.",
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
    "description": "El Born is the old-town base with a little more swagger and a little less claustrophobia than the deepest Gothic lanes. The Barcelona EDITION sets the polished tone, K+K Hotel Picasso and Park Hotel keep you close to Ciutadella and the station, and chic&basic Born gives the stay some design bite. Hostal Orleans is the reminder that location can still do most of the work.",
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
        "description": "K+K Hotel Picasso is included as a practical edge-of-Born hotel with park and museum access. Source signals support it for the rooftop pool, quieter location near Parc de la Ciutadella, and easy walks to the Picasso Museum, Estació de França, and Born restaurants.",
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
        "description": "Park Hotel Barcelona is a logistics-first Born stay: guides and map data support it for Estació de França, waterfront walks, and quick access into El Born. It is best for travelers who value transit and neighborhood dining over a high-design hotel experience.",
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
        "description": "chic&basic Born Boutique Hotel is included because it matches the neighborhood's design-shop personality better than a generic chain stay. Its 19th-century building, playful interiors, and central Born location make it useful for travelers who want style and walkability at a more moderate level than the EDITION.",
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
    "description": "Eixample is the base for travelers who want Barcelona to function smoothly: wider streets, better taxis, Modernista walks, and fewer old-city compromises. Casa Bonay and Almanac bring design and polish, Praktik Bakery adds a small daily pleasure right in the building, and The One gives the stay a luxury register.",
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
        "description": "Casa Bonay is the Eixample design-hotel anchor because travel guides and restaurant sources connect the rooms to a broader local ecosystem of coffee, natural wine, rooftop space, and dining. It works for travelers who want neighborhood life inside the hotel rather than a purely corporate base.",
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
        "description": "Almanac Barcelona is included as a polished luxury option near Passeig de Gràcia, supported by hotel-guide coverage and Google Travel demand. The draw is central positioning, contemporary rooms, rooftop views, and easy access to Eixample architecture without the density of the old city.",
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
        "description": "Praktik Bakery is useful because hotel sources consistently remember the concept: a boutique stay built around an actual bakery. It is a mid-range Eixample pick for travelers who care about morning routine, smell-of-bread atmosphere, and walkability more than big-lobby luxury.",
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
        "description": "The One Barcelona is the higher-end Eixample stay near La Pedrera, chosen for rooftop pool appeal, quiet luxury positioning, and proximity to Passeig de Gràcia. It is a good fit when the traveler wants architectural sightseeing access with a calmer hotel feel than the Gothic Quarter.",
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
        "description": "Sonder La Casa del Sol is included for its exact neighborhood fit: compact boutique lodging right by Plaça del Sol. It suits travelers who want to step directly into Gràcia's terrace culture, accept a smaller property format, and use the neighborhood itself as the main amenity.",
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
        "description": "Hotel Ronda Lesseps is a practical northern Gràcia base, supported by map and hotel-platform signals for value, metro access, and proximity to Park Güell. It is best for travelers who prefer quieter nights and do not need to sleep in the most central plaza zone.",
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
        "description": "Catalonia Park Güell is a value hotel for travelers using Gràcia as a quieter northern base. Source signals point to practical rooms, pool/value appeal, and metro reach, so it belongs for guests prioritizing price and Park Güell access over boutique-neighborhood charm.",
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
    "description": "Poble-sec is not the postcard base, which is exactly why it can work. Hotel Brummell gives the neighborhood a design-hotel pulse, INNSiDE Apolo keeps you close to Parallel and the late-night circuit, and Hotel Coronado stays simple and useful.",
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
        "description": "Hotel Brummell is Poble-sec's design-led stay, supported by hotel-guide attention for its calm local setting near Montjuïc, small scale, and stylish common spaces. It is the best fit when travelers want the neighborhood's food and theater access without staying in a large Paral·lel hotel.",
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
        "description": "INNSiDE by Meliá Barcelona Apolo is the practical large-hotel choice by Paral·lel and Sala Apolo. Source and map signals support it for nightlife access, metro convenience, conference-scale reliability, and easy walks toward the old town, port, and Poble-sec tapas streets.",
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
        "description": "Hotel Coronado is another no-frills Poble-sec option supported by map visibility and location utility. It works for short stays focused on tapas, shows, and transit, especially when the traveler wants to spend less on the room and stay close to Carrer de Blai.",
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
    "description": "Choosing a Barcelona hotel is really choosing the version of the city you want to wake up inside. Hotel Neri gives you old-stone intimacy, Chic & Basic Born puts nightlife and museum streets close, Almanac sharpens the Eixample option, and Hotel Casa Fuster makes Gracia feel grand. Hotel Brummell is the Poble-sec counterpoint: lower, looser, and better placed for Montjuic and late nights.",
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
        "description": "Hotel Neri is the citywide pick for travelers who want Gothic Quarter heritage without losing boutique comfort. Its restored palace setting, quieter Sant Felip Neri position, and intimate scale make it a stronger old-city base than a generic central hotel.",
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
        "description": "Chic & Basic Born Boutique Hotel is the El Born choice for travelers who want nightlife, museum streets, Ciutadella access, and boutique scale in one base. It fits visitors who plan to walk the old city at night but want a slightly softer edge than the Gothic core.",
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
        "description": "Almanac Barcelona gives the shortlist an Eixample design-hotel anchor near Passeig de Gracia. Use it when architecture walks, shopping, rooftop time, and polished rooms matter more than sleeping inside the oldest lanes.",
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
        "description": "Hotel Casa Fuster is the Gracia-edge grand hotel for travelers who want modernista architecture, Passeig de Gracia access, and a calmer village-side return at night. It is best when the hotel building itself is part of the Barcelona experience.",
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
        "description": "Hotel Brummell is the Poble-sec stay for travelers who want a smaller design hotel with Montjuic, tapas streets, and the port side nearby. Choose it when you want neighborhood texture and easy hill access rather than a big central lobby.",
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
    "description": "This hostel list is about social gravity, not just cheap beds. Kabul brings the Placa Reial party machine, 360 Hostel Borne gives old-town access with a slightly easier landing, and Yeah Barcelona Hostel is the clean Eixample workhorse. Casa Gracia and Onefam Paralelo pull the map into neighborhood life, whether you want plazas above Diagonal or late nights near Poble-sec.",
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
        "description": "Kabul is the citywide pick for travelers who want Barcelona's hostel scene to double as the nightlife plan. Hostelworld, Google Maps, and long-running backpacker coverage consistently support it for Plaça Reial location, organized social programming, rooftop/common-space energy, and fast access to the Gothic Quarter bar circuit; it is a strong fit for outgoing solo travelers, not for light sleepers.",
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
        "description": "360 Hostel Borne is the El Born/Arc de Triomf representative because it gives travelers a social base without placing the dorms directly on the loudest old-town streets. Hostel-platform and map signals point to shared meals, activities, kitchen/common-space usefulness, and easy walks to Ciutadella, El Born, and central transit.",
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
        "description": "Yeah Barcelona is the Eixample pick because it combines polished dorms, private rooms, and structured social programming in a location that works for Sagrada Familia, lower Gracia, and Eixample dining. Multiple hostel and map sources make it one of the safest all-around recommendations when travelers want social energy without sleeping in the Gothic core.",
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
        "description": "Casa Gracia is the Gracia pick because it bridges hostel, hotel, and neighborhood social hub better than a pure dorm property. Source signals support it for dorm/private flexibility, Diagonal transit, communal programming, and immediate access to Gracia's plaza-and-restaurant life, making it especially useful for travelers who want style and a less old-town-heavy base.",
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
        "description": "Onefam Paralelo is the Poble-sec pick for solo travelers who want staff-led activities and a built-in group dynamic near Carrer de Blai, Montjuic, and Sala Apolo. Hostelworld and map signals support it as a community-first stay rather than just a cheap bed, which makes it the strongest representative for the neighborhood.",
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
    "description": "The Gothic Quarter hostel choice is really a question of how much old-city intensity you want. Kabul is the party engine in Placa Reial, Itaca and Safestay Gothic keep things closer to the cathedral-and-lanes version of the neighborhood, and Hostel New York is the bare-bones central option. None of these are about retreat; they are about being in the middle of it.",
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
        "description": "Kabul is the Gothic Quarter pick when the hostel itself is part of the nightlife plan. Hostelworld and long-running traveler coverage consistently frame it around Plaça Reial location, organized social programming, rooftop/common-space energy, and fast access to late bars; it is better for outgoing backpackers than for quiet sleepers.",
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
        "description": "Itaca is the calmer cathedral-area counterweight to Kabul: small-scale, central, and practical for travelers who want Gothic lanes, Plaça Catalunya, and old-city walking routes without committing to a party-hostel atmosphere. Hostelworld and review signals support it for location and simple dorm/private value.",
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
        "description": "Safestay Barcelona Gothic sits between the Gothic Quarter and El Born, making it useful for travelers who want budget beds close to Jaume I, the Picasso Museum, and cathedral lanes. It is a chain hostel rather than a boutique stay, but the value is location, scale, and predictable dorm infrastructure.",
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
        "description": "Hostel New York is the no-frills old-city option: basic, cheap, and positioned for travelers who care more about being near the port, Barceloneta, and Gothic nightlife than about design or a heavy social program. Use it as the budget fallback in this neighborhood set.",
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
    "description": "El Born hostels give backpackers the old city without dropping them into the loudest part of it. 360 Hostel Borne and Born Barcelona Hostel keep Arc de Triomf, Ciutadella, and the museum streets close, while Arc House and Black Swan make transit and social energy easier. This is the softer old-town landing, still close enough to walk home late.",
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
        "description": "360 Hostel Borne is the strongest El Born/Arc de Triomf hostel for travelers who want a social base without sleeping directly on the loudest old-town streets. Hostelworld and hostel-listing signals point to organized activities, communal kitchen/common space, and easy walks to Ciutadella, El Born, and central transit.",
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
        "description": "Born Barcelona Hostel works as the quieter, smaller-format pick near Arc de Triomf and the upper edge of El Born. It suits travelers who want the neighborhood's museum and park access but prefer a practical bed-and-base setup over a party-hostel identity.",
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
        "description": "Arc House is included for budget travelers prioritizing Parc de la Ciutadella, Estacio del Nord, and fast walks into El Born. Source signals are more value-and-location driven than experience-led, so it belongs as a practical low-cost option rather than the most characterful stay.",
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
        "description": "Black Swan sits just west of El Born near Arc de Triomf, but it earns a spot because hostel sources consistently highlight the social setup, tours, shared meals, and central transit reach. It is best for solo travelers who want an activity-forward hostel close to the Born without old-town noise at the door.",
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
    "description": "Eixample hostels are for travelers who want the social parts of a hostel without the full old-town crush. Yeah Barcelona Hostel is the dependable anchor, Sant Jordi Rock Palace and Onefam Batllo bring stronger scene energy, and Barcelona Central Garden feels calmer and more grown-up. Primavera Hostel rounds it out for longer stays where transit and sleep both matter.",
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
        "description": "Sant Jordi Rock Palace is the music-themed Eixample option with stronger group energy: rooftop pool, themed interiors, and easy reach to Passeig de Gracia and late-night central bars. It is better for travelers who want a polished social hostel than for anyone seeking quiet minimalism.",
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
        "description": "Onefam Batllo is included for solo travelers who want structured social programming and a central Eixample base. Hostelworld signals tend to emphasize community, staff-led activities, and an easy walk to Casa Batllo and Passeig de Gracia, so it works as the social alternative to larger hostels.",
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
        "description": "Barcelona Central Garden is the calmer Eixample pick, useful for travelers who want a smaller hostel, terrace/garden feel, and central access without a party-hostel rhythm. It is a strong fit for couples, older backpackers, or first-time visitors who value sleep and walkability.",
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
    "description": "Gracia hostels are a different Barcelona proposition: less stumble-out-the-door sightseeing, more plaza life and Park Guell mornings. Casa Gracia is the hybrid social base, Rocket and Factory lean backpacker, and Yeah Barcelona Hostel sits close enough to borrow from Eixample. Pick this area when the trip needs a neighborhood rhythm instead of constant old-city acceleration.",
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
        "description": "Rocket Hostels Gracia is the pure backpacker pick for travelers who want Park Guell access and a smaller, less central sleep base. It makes most sense for budget travelers who prefer quiet hillside nights over old-town nightlife at the door.",
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
        "description": "Factory Hostels is included for Park Guell and upper-Gracia positioning plus a quieter hostel rhythm. It is less useful for late-night city-center bar hopping, but strong for travelers prioritizing price, views, and morning access to Gaudi routes.",
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
        "description": "Yeah Barcelona technically sits on the Eixample/Gracia edge, but it belongs in the Gracia hostel comparison because it is one of the strongest social hostels within easy walking distance of the neighborhood's lower plazas. Use it when social programming matters more than being deep inside Gracia.",
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
    "description": "Poble-sec is where a hostel can plug straight into the night without paying old-town prices. Onefam Paralelo, HelloBCN, and Pars Teatro keep the social current close to Blai, Parallel, and Apolo, while Hostal Apolo gives a simpler bed near the same orbit. It is practical, a little scruffy, and very good for travelers who plan to be out late.",
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
        "description": "Onefam Paralelo is the top Poble-sec hostel for solo travelers and people who want the hostel to organize the social side of the trip. Hostelworld signals consistently emphasize staff-led activities, community dinners, and the location near Carrer de Blai, Montjuic, and Sala Apolo.",
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
        "description": "HelloBCN is the practical Parallel base: bigger, straightforward, and well positioned for metro access, Poble-sec tapas, and Apolo nights. It works when travelers want price, lockers, and simple dorm infrastructure over boutique character.",
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
        "description": "Pars Teatro sits closer to the port and Parallel edge and brings a more character-heavy backpacker feel. Source signals support it for social common spaces and a theatrical interior, making it a good fit for travelers who want personality and old-town reach.",
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
        "description": "Hostal Apolo is not a classic party hostel, but it gives the Poble-sec set a low-cost private-room fallback beside Parallel and Sala Apolo. It is useful for travelers who want budget lodging and location but not a dorm-based social scene.",
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
    "description": "Eixample's low-key drinking hides in plain sight between the grand avenues. Morro Fi gives the vermouth-and-snack ritual, Bar Malasang keeps things casual, and Garage Beer Co. Universitat or BierCab move the night toward craft beer without turning it precious. Use this when you want a second stop after dinner, not a whole performance.",
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
        "description": "Morro Fi gives the Eixample route a precise vermouth counter: house vermouth, conservas, gildas, and a room that feels local without needing to be hidden. Use it before dinner or as a short aperitif stop when the grid needs something more casual than cocktails.",
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
        "description": "Bar Malasang keeps the Eixample list grounded with low lighting, vinyl energy, and a room that behaves more like a neighborhood hangout than a destination bar. It works best after dinner when you want one more drink without stepping into the city's polished cocktail circuit.",
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
        "description": "Garage Beer Co. Universitat keeps the craft-beer slot current with house beers, rotating releases, guest taps, and a casual room on Consell de Cent. It is the right replacement-style pick when the guide needs something open, useful, and beer-led rather than another vermouth or cocktail stop.",
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
    "description": "This is Eixample dressed for a proper night out. Dry Martini carries the old Barcelona cocktail ritual, Sips brings the global ranking heat, and Bobby's Free turns the speakeasy idea into something playful rather than dusty. The Alchemix and Ideal Cocktail Bar make the route feel less like a checklist and more like a crawl through the city's polished drinking history.",
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
        "description": "Founded in Barcelona in 1978, Dry Martini is the Eixample classic for cocktail tradition, polished service, and a proper martini served with ceremony. It belongs in the guide as a global benchmark for elegant, old-school drinking rather than a novelty bar.",
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
        "description": "Sips is the high-demand Eixample stop where the cocktail itself becomes the main event: precise, theatrical, and internationally recognized. Treat it as a planned reservation or queue-worthy destination, not a casual backup after dinner.",
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
        "description": "Bobby's Free gives the guide its playful speakeasy slot, with the barbershop entrance and premium cocktails doing more than simple neighborhood-bar work. It is best for a group that wants a reveal, a queue-tolerant late start, and a more animated Eixample night.",
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
        "description": "Ideal Cocktail Bar gives the Eixample set a classic room with old-school service, deep technique, and less spectacle than the newer destination bars. Use it for a calmer after-dinner plan when the drink quality matters but the night should not become a scene.",
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
    "description": "El Born can do low-key without going quiet. El Xampanyet and Bar del Pla keep the night tied to cava, plates, and conversation, while Bar Sauvage and La Vinya del Senyor pull it toward wine. Bormuth and Casa Delfin are the practical middle ground: lively, central, and easy to fold into a dinner route.",
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
        "description": "El Xampanyet is a short, loud Born classic: cava, anchovies, conservas, simple tapas, and a room that usually feels one order away from overflowing. Treat it as a salty pre-dinner or post-museum stop, not a slow meal.",
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
        "description": "Bar del Pla gives the Born bar guide a food-led room where wine and dinner overlap naturally. It is the move when the night needs real plates before drifting into louder cocktail or bar stops nearby.",
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
        "description": "Bar Sauvage adds a younger, design-forward cocktail pulse to the Born route without making the guide only about speakeasies. It works best later, when the old tapas counters start to feel too quiet and the group wants more movement.",
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
        "description": "Bormuth is the reliable tapas-and-vermouth stop near Passeig del Born, useful because it keeps steady all-day turnover without requiring a delicate plan. It fits the guide as a practical group option when you want the Born's energy with a little more seating and food support.",
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
        "description": "Casa Delfín gives the Born list a plaza-side classic for vermouth, tapas, and people-watching that can work from afternoon into night. Use it when the route needs an easy pause near the market and Santa Maria del Mar rather than a tightly timed cocktail booking.",
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
        "description": "La Vinya del Senyor is a wine-and-small-plates pause directly across from Santa Maria del Mar, ideal for a slower glass with tapas, cheese, conservas, and the basilica in view. Use it when the Born evening should stay elegant and conversational.",
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
    "description": "Born after dark is not subtle; it wants a door, a room, a story, and sometimes a wait. Paradiso is the headline, but Collage, Creps al Born, Dr. Stravinsky, Mariposa Negra, and Dux give the neighborhood more than one way to make cocktails feel like a main event. Use this when the night is meant to have a destination, not just a bar tab.",
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
        "description": "Paradiso is the Born's headline cocktail stop: a hidden-door room with theatrical drinks, global recognition, and enough demand that the visit should be treated as the night's main event rather than a quick drink between stops.",
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
        "description": "Collage Cocktail Bar gives the Born route a colorful craft-cocktail room that is easier to use with groups than the most in-demand trophy bars. It is a good later start when the night wants polish and energy without making the whole plan depend on one door.",
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
        "description": "Creps al Born is the lively Born staple for cocktails, crepes, and late-night looseness in one room. It works when the plan wants movement, music, and an easy social stop instead of a formal cocktail tasting.",
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
        "description": "Dr. Stravinsky gives the Born list a serious experimental-cocktail anchor, with in-house infusions, distillations, and signatures that reward attention. It works best for drinkers who want technique and flavor exploration more than a simple late-night crowd.",
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
        "description": "Mariposa Negra adds a moodier destination-cocktail option to the Born route, with dramatic interior styling and enough demand to create a line. Use it when the evening wants atmosphere and visual impact without leaving the neighborhood's compact nightlife core.",
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
        "description": "Dux is a Born gin-and-cocktail bar with a polished but busy neighborhood feel, useful when the night needs a stylish drink without becoming a high-concept tasting session. Keep it as a flexible late stop for gin tonics, classics, and easy momentum.",
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
    "description": "The Gothic Quarter is full of traps after dark, so the useful places are the ones with some scuff and a reason to exist. Bar La Plata and Bar Oviso keep the old-city counter feeling alive, Manchester and Nevermind bring the indie dive energy, and Bar Lobo is there when the group needs an easier landing. Els Quatre Gats adds the art-history glow without pretending the night is purely refined.",
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
        "description": "Bar La Plata is the Gothic Quarter's standing-bar anchor: short menu, fast service, and a vermouth rhythm that feels older than the surrounding tourist churn. Use it as a compact food-and-drink pause before the route turns toward darker late-night rooms.",
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
        "description": "Manchester Bar is the Gothic Quarter stop for indie-rock atmosphere, dark-room drinking, and a less polished old-city crowd. It is best when the night needs music-bar texture rather than another cocktail-room performance.",
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
        "description": "Bar Oviso works as a compact Gothic starter: low-key beers, easy conversation, and enough old-city location value to make the next stop simple. Use it before live music, clubs, or a Born crossover when the night needs a relaxed first room.",
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
        "description": "Bar Lobo gives the Gothic guide a larger all-day fallback where early dinner can roll naturally into drinks. It is useful for mixed groups that need space, food, and centrality before deciding whether the night becomes a bar crawl.",
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
        "description": "Nevermind is the Gothic Quarter's skate-and-grunge late stop, with loud music, casual drinks, and a rougher visual identity than the polished cocktail circuit. It fits when the night should feel young, noisy, and unfussy.",
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
    "description": "The Gothic Quarter's bigger nights orbit music, crowds, and rooms that have been collecting stories for years. Harlem Jazz Club and Jamboree give you live sound and Placa Reial gravity, while Pipa Club hides its speakeasy mood upstairs. Milk Bar & Bistro and Dow Jones Bar keep the guide loose enough for the kind of night that starts with a drink and becomes a plan.",
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
        "description": "Milk Bar & Bistro is a Gothic Quarter brunch-and-cocktail room that can start with eggs, bagels, and comfort food before sliding into drinks. It is useful near Plaça Reial when the plan needs food first and nightlife second.",
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
        "description": "Harlem Jazz Club gives the Gothic list a live-music anchor with jazz, funk, and touring sets in the old city core. Check the bill first, then use it when the night should be organized around a performance instead of another bar queue.",
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
        "id": "gothic-dow-jones",
        "name": "Dow Jones Bar",
        "coordinates": [
          41.3816,
          2.1752
        ],
        "description": "Dow Jones Bar adds a deliberately chaotic concept stop, with drink prices moving like a stock exchange ticker and the crowd reacting to the board. It is best for groups that want novelty and energy rather than a refined cocktail room.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://arewabxlefttuhzucoxx.supabase.co/storage/v1/object/public/bar_attachments/e968db8f-51bd-43a0-988d-8fba01def671/dow.png"
      },
      {
        "id": "gothic-pipa",
        "name": "Pipa Club",
        "coordinates": [
          41.381,
          2.1766
        ],
        "description": "Pipa Club is Barcelona's hidden speakeasy-style room for craft cocktails, live music, and a touch of 1920s elegance behind an unassuming entrance. Use it when the Gothic night should feel tucked away, stylish, and performance-friendly.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/1a/b5/10/20190617-004723-largejpg.jpg?w=1000&h=-1&s=1"
      },
      {
        "id": "gothic-jamboree",
        "name": "Jamboree",
        "coordinates": [
          41.3802,
          2.1757
        ],
        "description": "Jamboree belongs in the Gothic popular list as a Plaça Reial institution with decades of jazz, live music, and late club programming behind it. Check the night's format, because it can function as a concert stop or the final dance-floor move.",
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
    "description": "Gracia's casual bars feel best when you are not trying to conquer the night. Bar Canigo and Bodega Quimet bring vermouth, tapas, and neighborhood regularity, La Fourmi keeps the plaza-adjacent ease, and Bar Torpedo gives the route a sharper little jolt. Bar Salvatge pushes the list toward natural wine and cheese without losing the storefront funk.",
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
        "description": "Bar Canigó is a Gràcia all-day staple: breakfast and lunch early, then tapas, vermouth, and casual beers as the plaza rhythm takes over. It works because it feels like a neighborhood routine, not a destination cocktail room.",
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
        "description": "La Fourmi gives the route a softer social bar: relaxed service, low-pressure drinks, and enough neighborhood warmth to stretch a post-dinner stop into a longer conversation. It is useful when the group wants atmosphere without a big-night agenda.",
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
        "id": "gracia-torpedo",
        "name": "Bar Torpedo",
        "coordinates": [
          41.3998,
          2.1575
        ],
        "description": "Bar Torpedo is the compact late stop for when Gràcia's slower evening needs a little momentum. The appeal is not polish; it is tight-room energy, upbeat music, and a crowd that makes sense after plaza drinks or a casual dinner nearby.",
        "hours": {
          "mon": "6:00 PM-12:30 AM",
          "tue": "6:00 PM-12:30 AM",
          "wed": "6:00 PM-1:00 AM",
          "thu": "6:00 PM-1:30 AM",
          "fri": "6:00 PM-2:30 AM",
          "sat": "6:00 PM-2:30 AM",
          "sun": "6:00 PM-12:00 AM"
        },
        "photo": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAH2gLxqDDIj0w2gOq2-qTWlTsNkjVuH8S_dOUxk47ca8Kes_1pt6UBtuS36REJKIE0apo-Yusnm2s41n38UMWJg7EnUkBpMM3sN1bn8I0PDWiaAtlSBE5tM1VHJYad9yQuZ8hOS2phlF6tQ=w289-h312-n-k-no"
      },
            {
        "id": "gracia-salvatge",
        "name": "Bar Salvatge",
        "coordinates": [
          41.4021,
          2.1611
        ],
        "description": "Bar Salvatge is a funky, rustic-chic Gràcia storefront where natural wines meet local cuisine, cheeses, and snackable plates. It belongs in the guide for drinkers who want wine to lead the night without losing the food side.",
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
    "description": "Gracia's destination nights still feel smaller and more local than the center, which is the point. Sol de Nit and Heliogabal keep the plaza-and-music current alive, Bobby Gin and La Whiskeria make the drinks more deliberate, and Elephanta adds a neighborhood bar with its own following. The Original Old Fashioned gives the guide a speakeasy-styled finish without dragging you back downtown.",
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
        "description": "Sol de Nit anchors the Gràcia popular route with plaza energy, terrace spill, and a crowd that makes sense before the night moves indoors. Use it as the social first stop when the neighborhood's squares are part of the appeal.",
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
        "description": "Heliogàbal is the Gràcia music-room anchor, pairing independent programming with a bar scale that still feels neighborhood-specific. Check the schedule and use it when the night should revolve around a small live set rather than a generic drinks plan.",
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
        "id": "gracia-whiskeria",
        "name": "La Whiskeria",
        "coordinates": [
          41.4036,
          2.1585
        ],
        "description": "La Whiskeria is a cocktail bar with a whisky backbone: long-bar seating, classic mixed drinks, and a more deliberate drinking pace than the plaza bars nearby. Use it for spirits depth without giving up a proper cocktail-bar feel.",
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
        "id": "gracia-elephanta",
        "name": "Elephanta",
        "coordinates": [
          41.4028,
          2.1576
        ],
        "description": "Elephanta gives the Gràcia list a cozy gin-and-cocktail room with softer lighting and a strong neighborhood following. It is best for a slower destination drink when you want the area to feel local but still a little elevated.",
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
        "description": "The Original Old Fashioned is a tiny speakeasy-inspired Gràcia cocktail bar built around old-fashioneds, whisky, gin, and careful classics. Use it as a deliberate final drink rather than a loud crawl stop.",
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
    "description": "Poble-sec is built for the kind of night where dinner and drinking stop being separate categories. Bodega Salto, La Tasqueta de Blai, and Quimet & Quimet give you the bottles, montaditos, and standing-room momentum, while Abirradero brings beer into the mix. La Platilleria keeps the crawl from becoming pure grazing by giving it a proper small-plates anchor.",
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
        "description": "Bodega Saltó is the Poble-sec character anchor, with eccentric decor, old-bodega energy, and a room that feels more bohemian than polished. It works best before or after Carrer de Blai when the route needs personality, not just pintxos volume.",
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
        "description": "La Tasqueta de Blai is the practical pintxos stop for understanding why Carrer de Blai works as a crawl street. It is crowded and direct, so use it for quick bites and momentum rather than a lingering dinner.",
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
        "description": "Quimet & Quimet is the Poble-sec institution: standing-only, bottle-lined, and built around montaditos that justify the stop even on a short route. Go early, keep the visit compact, and let it launch the rest of the Blai or Paral·lel evening.",
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
        "description": "Abirradero broadens the Poble-sec crawl beyond vermouth and pintxos with craft beer, casual food, and a taproom pace. It is useful when the group wants a sit-down reset before deciding whether the night heads toward Apolo.",
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
        "description": "La Platilleria gives the Poble-sec set a warmer small-plates rhythm, where dinner can stay casual and still feel chosen. Use it when the group wants food, conversation, and a neighborhood room before the late-night options take over.",
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
    "description": "Poble-sec gets louder as you move toward Parallel, where the night can turn theatrical, queer, electronic, or just very late. La Federica gives the guide a warm neighborhood-bar entry, Sala Apolo is the big-room institution, and LAUT carries the clubbier underground edge. Tinta Roja and Plataforma add cabaret, performance, and dance-floor voltage to the Apolo orbit.",
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
        "description": "La Federica is a laid-back LGBTQ haunt for cocktails, tapas, music, and regular exhibitions by local artists. It works as a warm Poble-sec starter before the night moves toward clubs, cabaret, or Paral·lel.",
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
        "description": "Sala Apolo is the Poble-sec heavyweight: a multi-room club and concert institution with electronic, indie, and citywide programming pull. Check the lineup and use it as the final anchor, because it can define the whole night.",
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
        "description": "Tinta Roja is a 1920s-style theater cafe in a former dairy, with tango, Latin music, cabaret, and artistic events shaping the night. Check the schedule and use it when Poble-sec should mean performance, not just bar-hopping.",
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
        "description": "Plataforma gives the Poble-sec list a less polished late-club finish, with alternative, pop, rock, and throwback DJ nights above Paral·lel. Use it when the group wants dancing without the larger commitment or production scale of Apolo.",
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
    "seoDescription": "Best dive bars in Barcelona, pulling the strongest smaller bar picks from Eixample, El Born, the Gothic Quarter, Gràcia, and Poble-sec.",
    "title": "Cellars, Counters, and Late-Night Regulars",
    "description": "This is the Barcelona bar crawl for people who care more about character than polish. Bar Marsella brings absinthe history and old-room decay, El Xampanyet and Bar La Plata keep the counters salty and fast, and Bar Canigo gives the route a Gracia regular's pulse. Quimet & Quimet closes the circle with bottles, montaditos, and the beautiful inconvenience of standing up.",
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
        "description": "Bar Marsella is the Raval-edge pick because it brings the strongest old-Barcelona dive-bar identity in the citywide set: absinthe history, worn-in rooms, late-night traffic, and enough grit to counter polished cocktail Barcelona. Use it as a late, atmospheric stop when the citywide route needs texture rather than refinement.",
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
        "description": "El Xampanyet is not a dive in the rough-edged sense; it is the packed, salty, old-school cava counter that gives a bar route texture. The move is anchovies, conservas, a glass, and then back into the Born.",
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
        "description": "Bar La Plata is the Gothic Quarter pick for travelers who want an old-city bar that does not need a concept. The draw is a short historic menu, house wine/vermouth rhythm, fast service, and a room that still feels specific rather than generic despite its central location.",
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
        "description": "Bar Canigó is a Gràcia all-day staple: breakfast and lunch early, then tapas, vermouth, and casual beers as the plaza rhythm takes over. It works because it feels like a neighborhood routine, not a destination cocktail room.",
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
        "description": "Quimet & Quimet is the Poble-sec anchor because it is small, standing-only, and deeply tied to the neighborhood's bottle-and-montadito culture. It is more famous than hidden, but the format is still pure Barcelona: quick pours, tight space, exceptional tins, and a crowd that turns food into bar energy.",
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
    "description": "Barcelona destination nightlife is not one scene; it is a handful of rooms people willingly cross town for. Sips and Paradiso carry the cocktail-world spotlight, Jamboree brings the Placa Reial music pull, Heliogabal keeps Gracia's independent edge alive, and Sala Apolo is the late-night machine in Poble-sec. Use this when the night needs a plan, not just another open tab.",
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
        "description": "Paradiso is the Born's headline cocktail stop: a hidden-door room with theatrical drinks, global recognition, and enough demand that the visit should be treated as the night's main event rather than a quick drink between stops.",
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
        "description": "Jamboree is the Gothic Quarter representative because it turns Plaça Reial into a late-night music anchor. It belongs in a citywide guide for travelers who want Barcelona nightlife to include live sets, club programming, and a room with institutional memory.",
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
        "description": "Heliogàbal is the Gràcia pick because it brings independent music and neighborhood bar culture together in a way that feels specific to the district. It is smaller than the big old-city venues, but the event pull and local music identity make it a real destination.",
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
        "description": "Sala Apolo is the Poble-sec pick and the city's large-format nightlife anchor in this set. It works for club nights, concerts, and late plans that need more than a bar stool, especially when the evening is already moving along Paral·lel or Carrer de Blai.",
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
    "description": "This is the city's cultural spine, built for travelers who want the major chapters without treating Barcelona like a postcard rack. Barcelona Cathedral and Santa Maria del Mar hold the old city, Casa Batllo and Casa Vicens show Modernisme at different scales, and Fundacio Joan Miro sends the route up Montjuic for air and color. It is not everything, but it gives the city a readable shape.",
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
        "description": "Barcelona Cathedral is the Gothic Quarter's clearest cultural anchor because it makes the old city legible: medieval street pattern, cloister, choir, rooftop views, and a square organized around religious architecture. Use it early in the culture route so the surrounding lanes read as history, not just atmosphere.",
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
        "description": "Casa Batlló is the Eixample pick because it concentrates Barcelona's Modernista fantasy into one high-impact visit. It is tourist-heavy for good reason: facade, interiors, roofline, craft detail, and Passeig de Gràcia context make it one of the city's most useful architecture stops.",
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
        "description": "Casa Vicens is the Gràcia pick because it shows Gaudí before the monumental greatest-hits version. The domestic scale, ceramic surfaces, garden logic, and early stylistic experiments make it a more intimate architecture visit than the central icons.",
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
        "description": "Fundació Joan Miró is the Poble-sec/Montjuïc pick because it combines a focused artist collection with a building and hillside setting that feel inseparable from the visit. It gives the citywide list a quieter art stop after the dense architecture of the center.",
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
] satisfies MapList[]);

export const barcelonaItineraryGuides = withDiveBarChips([
  {
    "id": "list-barcelona-one-day-activities",
    "slug": "barcelona-one-day-itinerary",
    "seoSlug": "best-things-to-do",
    "seoTitle": "Best Things to Do in Barcelona in One Day",
    "seoDescription": "Best one-day Barcelona journey, combining one essential culture stop, one restaurant, one neighborhood walk, one low-key bar, and one destination nightlife option.",
    "title": "One Strong Day, No Filler",
    "description": "One day in Barcelona should not pretend to be a conquest. This route takes the hit of Casa Batllo, moves to Cal Pep for the pleasure of a counter lunch, then lets Santa Maria del Mar and El Xampanyet slow the afternoon into old-city rhythm. Paradiso is the final act: a cocktail room big enough to make the short trip feel like it had a proper ending.",
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
        "description": "Start with the culture category at Casa Batlló because one day in Barcelona needs a high-impact Modernista anchor. It gives first-time visitors architecture, craft, rooftop drama, and Passeig de Gràcia context without sending them across the city before lunch.",
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
        "description": "Use Cal Pep as the one-day food stop because the counter turns lunch into an event without sending the route far from El Born. Seafood tapas and quick pacing make it easy to move from architecture into the old-city afternoon.",
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
        "description": "Make Santa Maria del Mar the afternoon culture stop because it is close to lunch, short enough for a one-day route, and central to the Born's merchant history. It gives the journey a clear architectural pause before the evening shifts into cava counters and cocktail rooms.",
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
        "description": "Paradiso is the Born's headline cocktail stop: a hidden-door room with theatrical drinks, global recognition, and enough demand that the visit should be treated as the night's main event rather than a quick drink between stops.",
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
    "description": "A good Barcelona weekend needs contrast more than speed. Casa Gracia gives the base a neighborhood pulse, Casa Batllo and Bodega Bonay polish the first day, and Bar Marsella lets the night fray at the edges. Day two climbs toward Fundacio Joan Miro, drops into Quimet & Quimet, and finishes at Sala Apolo when the city is ready to get loud.",
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
        "description": "Use Casa Gracia as the stay-category anchor for the weekend because it splits the difference between hostel social energy, private-room flexibility, and easy transit. Starting from Gràcia keeps the route from becoming only an old-city weekend.",
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
        "description": "Casa Batlló handles the headline culture slot on day one because it is central, visually immediate, and easy to pair with an Eixample lunch or Passeig de Gràcia walk. Book it as the major architecture moment, then let the rest of the day loosen up.",
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
        "description": "Bodega Bonay is the weekend food stop when the plan needs a stylish but manageable meal rather than a tasting-menu commitment. It keeps the route in Eixample while adding natural wine, anchovies, pastas, and a lively restaurant-room setting.",
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
        "description": "Bar Marsella gives the weekend a dive-bar texture after the polished daytime stops. Its worn-in absinthe history and late-night feel work especially well before moving toward Gothic/Born nightlife.",
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
        "description": "Fundació Joan Miró anchors day two with Montjuïc culture, a focused museum visit, and a hillside setting that slows the pace after a late night. It gives the weekend route a calm art stop without making the day feel underbuilt.",
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
        "description": "Quimet & Quimet is the Poble-sec food-and-bar hybrid for the weekend route. Standing montaditos and bottles make it practical before Carrer de Blai or a club night while still feeling like a real Barcelona institution.",
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
        "description": "Sala Apolo is the popular-nightlife finish because weekends need at least one venue with citywide pull. Check the programming, then treat it as the big final stop rather than a casual bar-hop stop.",
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
    "description": "A week lets Barcelona stop behaving like a checklist. Start with Yeah Barcelona Hostel, Casa Vicens, and Bemba in the Gracia/Eixample orbit, then let Casa Batllo and Disfrutar take over a bigger, more deliberate day. MUHBA, Bar La Plata, Santa Maria del Mar, Paradiso, Fundacio Joan Miro, Quimet & Quimet, and Sala Apolo carry the trip from Roman stone to late-night Poble-sec without forcing everything into one heroic march.",
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
        "description": "Use Yeah Barcelona as the hostel-category base for a week because the location works for Eixample, Gràcia, and Sagrada Família while the social programming helps longer-stay travelers find plans. It is especially useful when the journey needs an affordable base that can create community without relying on random bar crawls.",
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
        "description": "Start the week in Gràcia with Casa Vicens so the architecture story begins before the giant Gaudí icons. It is smaller, more domestic, and gives the neighborhood's village rhythm a cultural anchor.",
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
        "description": "Bemba is useful on a weeklong journey because not every good meal should be a reservation. It gives the Gràcia day something quick, affordable, and current before the route returns to museums, bars, and bigger dinners.",
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
        "description": "Disfrutar belongs in the week plan because a longer trip can protect a full evening for one global fine-dining reservation. Build the day around the booking and let it be the special meal, not a flexible add-on.",
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
        "description": "MUHBA Plaça del Rei gives the old-city portion historical depth instead of letting the Gothic Quarter become only atmosphere. The underground Roman route and palace context make Barcelona's layers easier to read for the rest of the week.",
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
        "description": "Bar La Plata is the low-key Gothic bar stop for the week: simple, historic, fast, and food-adjacent. It is best used as a compact vermouth-and-bites pause before moving into the Born or waterfront.",
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
        "description": "Santa Maria del Mar anchors the El Born day with architecture that explains the neighborhood's medieval merchant identity. Pair it with the Picasso Museum area, Ciutadella, or a cava stop nearby.",
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
        "description": "Paradiso is the Born's headline cocktail stop: a hidden-door room with theatrical drinks, global recognition, and enough demand that the visit should be treated as the night's main event rather than a quick drink between stops.",
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
        "description": "Sala Apolo closes the week with the city's bigger nightlife energy: concerts, club programming, and a real reason to stay out late. It is the final category contrast after museums, restaurants, hostels, and small bars.",
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
