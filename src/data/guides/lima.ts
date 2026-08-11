import type { ListSource } from "@/types";
import { buildPeruCityGuides, type PeruGuideInput, type PeruStopInput } from "@/data/guides/peru-guide-builder";

const checkedAt = "2026-08-10";
const mapsEditorial = (label: string, query: string): ListSource => ({ name: label, url: `https://www.google.com/maps/search/${encodeURIComponent(query + " Lima Peru")}` });

function food(id: string, name: string, coordinates: [number, number], description: string, officialUrl: string, hours: string, price: PeruStopInput["price"], cuisines: string[], tags: string[], service: PeruStopInput["foodServiceType"] = "restaurant"): PeruStopInput {
  return { id, name, coordinates, description, officialUrl, hours: { default: hours }, price, priceSource: `${name} official menu/reservation page`, venueKind: "food_drink", subcategory: cuisines[0], attributeTags: tags, foodServiceType: service, cuisineTypes: cuisines };
}
function stay(id: string, name: string, coordinates: [number, number], description: string, officialUrl: string, price: PeruStopInput["price"], lodgingType: "hotel" | "hostel", tags: string[]): PeruStopInput {
  return { id, name, coordinates, description, officialUrl, bookingUrl: officialUrl, hours: { default: "Front desk operates 24 hours daily; the official property booking page controls check-in, check-out, and late-arrival conditions." }, price, priceSource: `${name} official booking page`, venueKind: "lodging", lodgingType, subcategory: lodgingType, attributeTags: tags };
}
function bar(id: string, name: string, coordinates: [number, number], description: string, officialUrl: string, hours: string, price: PeruStopInput["price"], nightlifeType: NonNullable<PeruStopInput["nightlifeType"]>, tags: string[]): PeruStopInput {
  return { id, name, coordinates, description, officialUrl, hours: { default: hours }, price, priceSource: `${name} official menu or reservation page`, venueKind: "nightlife", nightlifeType, subcategory: nightlifeType, attributeTags: tags, musicGenres: nightlifeType === "live_music_venue" ? ["rock", "latin", "indie"] : [] };
}
function culture(id: string, name: string, coordinates: [number, number], description: string, officialUrl: string, hours: string, subcategory: string, tags: string[]): PeruStopInput {
  return { id, name, coordinates, description, officialUrl, hours: { default: hours }, venueKind: "culture", subcategory, attributeTags: tags };
}

const restaurants = [
  food("central", "Central", [-12.1528, -77.0236], "Virgilio Martínez maps Peruvian ecosystems by altitude through a long tasting menu in a Barranco research complex shared with Mater Iniciativa.", "https://centralrestaurante.com.pe/", "Dinner Tuesday–Saturday from 6:30 PM; lunch seatings follow the dated official reservation calendar.", "$$$$", ["peruvian", "tasting_menu"], ["reservation_required", "special_occasion", "barranco"]),
  food("maido", "Maido", [-12.1219, -77.0304], "Mitsuharu Tsumura’s Nikkei tasting menu moves between Japanese technique, Peruvian seafood, Amazonian ingredients, and a more flexible à la carte counter.", "https://maido.pe/", "Monday–Saturday 1:00 PM–10:00 PM; dated seatings are controlled by the official reservation calendar.", "$$$$", ["nikkei", "peruvian_japanese"], ["reservation_required", "tasting_menu", "miraflores"]),
  food("kjolle", "Kjolle", [-12.1529, -77.0237], "Pía León builds color-forward tasting menus from native grains, tubers, cacao, seafood, and highland plants inside the Casa Tupac complex.", "https://kjolle.com/", "Tuesday–Saturday lunch seatings 12:30 PM–1:30 PM and dinner seatings 7:00 PM–8:30 PM; exact availability follows the official reservation calendar.", "$$$$", ["contemporary_peruvian", "tasting_menu"], ["reservation_required", "barranco", "special_occasion"]),
  food("mayta", "Mayta", [-12.0982, -77.0365], "Jaime Pesaque’s tasting menu uses Peruvian biodiversity with polished modern technique, while the bar gives pisco and native botanicals equal attention.", "https://maytalima.com/", "Monday–Saturday 12:30 PM–11:00 PM; reservation availability follows the official booking page.", "$$$$", ["contemporary_peruvian"], ["reservation_recommended", "san_isidro", "cocktails"]),
  food("merito", "Mérito", [-12.1496, -77.0215], "Juan Luis Martínez and José Luis Saume fold Venezuelan memory into Peruvian produce at a compact Barranco room with close counter views.", "https://www.meritorestaurante.com/", "Monday–Saturday 12:30 PM–3:30 PM and 6:30 PM–11:00 PM; official reservations control holiday closures.", "$$$", ["peruvian_venezuelan", "contemporary"], ["reservation_required", "counter_seating", "barranco"]),
  food("rafael", "Rafael", [-12.1241, -77.0352], "Rafael Osterling’s Miraflores dining room mixes Peruvian seafood and Mediterranean instincts with contemporary art and one of Lima’s reliable restaurant bars.", "https://rafaelosterling.pe/", "Monday–Saturday 12:30 PM–12:00 AM; Sunday service follows the official reservation page.", "$$$", ["peruvian", "mediterranean"], ["art_filled", "late_dining", "miraflores"]),
  food("astrid-gaston", "Astrid y Gastón", [-12.0974, -77.0365], "Casa Moreyra gives Gastón Acurio’s modern Peruvian cooking a grand colonial setting, with tasting menus, à la carte plates, and Astrid Gutsche’s desserts.", "https://www.astridygaston.com/", "Monday–Saturday 1:00 PM–3:30 PM and 7:00 PM–11:00 PM; official reservations control exceptions.", "$$$$", ["peruvian", "fine_dining"], ["historic_house", "reservation_recommended", "san_isidro"]),
  { ...food("la-mar", "La Mar Cebichería Peruana", [-12.1132, -77.0452], "La Mar treats ceviche as lunch culture: sharp leche de tigre, tiraditos, whole fish, causas, and a busy room that does not need dinner service.", "https://lamarcebicheria.com/lima/", "Monday–Saturday 12:00 PM–5:30 PM; closed Sunday.", "$$$", ["peruvian", "seafood", "ceviche"], ["lunch_only", "walk_ins", "miraflores"]), photoUrl: "https://starwinelist.com/storage/images/venue/767/980x541/wRRSl9MD9o62laigawLFGInAJTDBYRYUEl90vaXV.jpeg?signature=a468d866295cd662116d7870515d71985e3ac03f2dabd260cd5b8efd0a819162" },
  food("osaka", "Osaka Pardo y Aliaga", [-12.0963, -77.0378], "Osaka’s Nikkei menu pairs precise sashimi and nigiri with tiraditos, robata cooking, and a polished cocktail program in San Isidro.", "https://osakanikkei.com/", "Monday–Saturday 12:30 PM–12:00 AM; Sunday 12:30 PM–5:00 PM.", "$$$", ["nikkei", "sushi"], ["cocktails", "group_dining", "san_isidro"]),
  food("isolina", "Isolina Taberna Peruana", [-12.1491, -77.0206], "José del Castillo serves generous criollo stews, offal, cau cau, and shareable home cooking in a restored Barranco tavern.", "https://isolina.pe/", "Monday–Saturday 12:00 PM–11:00 PM; Sunday 12:00 PM–6:00 PM.", "$$", ["criollo", "peruvian"], ["shareable", "historic_tavern", "barranco"]),
];

const cheapEats = [
  food("al-toke-pez", "Al Toke Pez", [-12.114, -77.0181], "Tomás Matsufuji works a tiny Surquillo counter where ceviche, fried seafood, and seafood rice arrive fast, hot, and without ceremony.", "https://www.instagram.com/altokepez/", "Monday–Saturday 12:00 PM–4:00 PM, or until the day’s seafood sells out; closed Sunday.", "$", ["peruvian", "seafood"], ["counter", "cash_friendly", "surquillo"], "counter_service"),
  food("la-lucha", "La Lucha Sanguchería Criolla", [-12.1208, -77.0298], "La Lucha stuffs crisp rolls with chicharrón, roast turkey, country ham, and butifarra, backed by fresh juices and thick fries.", "https://lalucha.com.pe/", "Daily 7:00 AM–1:00 AM; branch exceptions follow the official location page.", "$", ["peruvian", "sandwiches"], ["late_night", "quick_meal", "miraflores"], "counter_service"),
  food("el-chinito", "El Chinito", [-12.0469, -77.0314], "This old-school sandwich shop layers pork, sweet potato, onion relish, and house sauces into compact breakfast and lunch fuel.", "https://elchinito.com.pe/", "Daily 7:00 AM–10:00 PM; location-specific service follows the official branch page.", "$", ["peruvian", "sandwiches"], ["historic", "breakfast", "city_center"], "counter_service"),
  food("canta-rana", "Canta Rana", [-12.1484, -77.0218], "Football shirts crowd the walls while the kitchen sends out ceviche, tiradito, seafood rice, and cold beer in Barranco.", "https://www.facebook.com/CantaRanaBarranco/", "Monday–Saturday 12:00 PM–10:00 PM; Sunday 12:00 PM–6:00 PM.", "$$", ["peruvian", "seafood"], ["casual", "football", "barranco"]),
  food("tio-mario", "Tío Mario", [-12.1488, -77.0239], "Under Barranco’s Bridge of Sighs, Tío Mario grills anticuchos and picarones with the smoke, sweetness, and quick turnover the dishes demand.", "https://www.instagram.com/tiomarioanticuchos/", "Monday–Thursday 5:00 PM–12:00 AM; Friday–Sunday 12:00 PM–12:00 AM.", "$", ["peruvian", "anticuchos"], ["grill", "desserts", "barranco"]),
  food("chifa-wa-lok", "Chifa Wa Lok", [-12.0519, -77.0259], "Wa Lok’s large Chinatown dining room handles roast meats, dim sum, fried rice, and banquet-size Chifa plates efficiently.", "https://www.walok.com.pe/", "Daily 12:00 PM–11:00 PM; holiday hours follow the official restaurant page.", "$$", ["chifa", "cantonese_peruvian"], ["groups", "chinatown", "shareable"]),
  food("don-tito", "Don Tito", [-12.0919, -77.0006], "Don Tito’s charcoal chickens arrive with crisp skin, fries, salad, and the creamy ají sauces that define Lima’s pollería ritual.", "https://dontito.pe/", "Daily 12:00 PM–11:00 PM; branch service follows the official locations page.", "$", ["peruvian", "pollo_a_la_brasa"], ["family_friendly", "charcoal_grill", "local_chain"]),
  food("el-muelle", "El Muelle Cevichería", [-12.1458, -77.0196], "A Barranco neighborhood cevichería serving sharp ceviche, jalea, fish chicharrón, and seafood rice at gentler prices than Lima’s destination rooms.", "https://www.facebook.com/ElMuelleCevicheria/", "Daily 11:30 AM–5:00 PM; seafood availability may end service earlier.", "$", ["peruvian", "seafood"], ["lunch_only", "neighborhood", "barranco"]),
  food("rincon-chami", "Rincón Chami", [-12.1203, -77.0284], "Rincón Chami serves criollo standards—ají de gallina, tacu tacu, lomo saltado, and soups—in a plain Miraflores dining room.", "https://www.facebook.com/rinconchami/", "Monday–Saturday 12:00 PM–10:00 PM; Sunday 12:00 PM–6:00 PM.", "$", ["criollo", "peruvian"], ["set_lunch", "traditional", "miraflores"]),
  food("surquillo-market", "Mercado N.º 1 de Surquillo", [-12.1184, -77.0233], "Produce stalls, juice counters, ceviche vendors, and menu lunches turn Surquillo’s municipal market into a compact survey of everyday ingredients.", "https://munisurquillo.gob.pe/", "Daily 6:00 AM–6:00 PM; individual food stalls keep their own service windows within market hours.", "$", ["peruvian", "market_food"], ["market", "breakfast", "produce"], "stall"),
];

const hotels = [
  stay("miraflores-park", "Miraflores Park, A Belmond Hotel", [-12.1351, -77.0298], "Ocean-facing suites, rooftop pool, and discreet service make this clifftop property Lima’s polished base for uninterrupted Pacific views.", "https://www.belmond.com/hotels/south-america/peru/lima/belmond-miraflores-park/", "$$$$", "hotel", ["ocean_view", "rooftop_pool", "luxury"]),
  stay("hotel-b", "Hotel B", [-12.1482, -77.0213], "A restored Belle Époque mansion combines contemporary Peruvian art, high ceilings, a roof terrace, and Barranco’s galleries outside the door.", "https://hotelb.pe/", "$$$$", "hotel", ["boutique", "art", "barranco"]),
  stay("country-club", "Country Club Lima Hotel", [-12.0971, -77.0525], "This 1927 landmark pairs carved interiors and Peruvian art with golf-course views, a pool, and a celebrated pisco-sour bar.", "https://www.countryclublimahotel.com/", "$$$$", "hotel", ["historic", "golf", "san_isidro"]),
  stay("jw-marriott", "JW Marriott Hotel Lima", [-12.1311, -77.0308], "Rooms face either the Pacific or Miraflores, while Larcomar access, a spa, and executive facilities favor convenience over neighborhood intimacy.", "https://www.marriott.com/en-us/hotels/limdt-jw-marriott-hotel-lima/overview/", "$$$$", "hotel", ["ocean_view", "business", "miraflores"]),
  stay("westin", "The Westin Lima Hotel & Convention Center", [-12.0924, -77.0249], "Tall San Isidro rooms, a large spa, indoor pool, and serious meeting infrastructure suit travelers mixing business with destination dining.", "https://www.marriott.com/en-us/hotels/limwi-the-westin-lima-hotel-and-convention-center/overview/", "$$$", "hotel", ["spa", "business", "indoor_pool"]),
  stay("pullman", "Pullman Lima Miraflores", [-12.1268, -77.0289], "A rooftop pool, contemporary rooms, and short walks to Larcomar give this large hotel practical Miraflores positioning.", "https://all.accor.com/hotel/B4N0/index.en.shtml", "$$$", "hotel", ["rooftop_pool", "modern", "miraflores"]),
  stay("atemporal", "Atemporal", [-12.112, -77.043], "A converted 1940s house offers nine individually designed rooms, leafy common spaces, bicycles, and residential Miraflores calm.", "https://atemporal.pe/", "$$$", "hotel", ["boutique", "small_property", "design"]),
  stay("casa-republica", "Casa Republica Barranco", [-12.1437, -77.0217], "A republican-era mansion and garden annex deliver tiled courtyards, roof drinks, and immediate access to Barranco’s cultural streets.", "https://www.casarepublicabarranco.com/", "$$$", "hotel", ["historic_house", "barranco", "roof_terrace"]),
  stay("villa-barranco", "Villa Barranco by Ananay Hotels", [-12.151, -77.0226], "This compact villa uses terraces, local art, and individually styled rooms to keep the Barranco experience residential and quiet.", "https://www.ananayhotels.com/villa-barranco/", "$$$", "hotel", ["boutique", "quiet", "barranco"]),
  stay("souma", "SOUMA Hotel Lima", [-12.1286, -77.0309], "Floor-to-ceiling Pacific views, sculptural interiors, rooftop dining, and a pool define this contemporary Malecón hotel tower.", "https://www.soumahotel.com/", "$$$$", "hotel", ["ocean_view", "design", "rooftop"]),
];

const hostels = [
  stay("vvp-kokopelli", "Viajero Kokopelli Lima", [-12.1214, -77.0284], "A central Miraflores hostel mixes privacy-curtain dorms, courtyard social space, tours, and a bar for travelers prioritizing easy introductions.", "https://www.viajerohostels.com/destinations-peru/lima/", "$$", "hostel", ["social", "bar", "miraflores"]),
  stay("pariwana", "Pariwana Hostel Lima", [-12.1205, -77.028], "Pariwana centers its Miraflores property on a large courtyard, organized activities, dorms, and a late social bar.", "https://www.pariwana-hostel.com/", "$", "hostel", ["party", "courtyard", "miraflores"]),
  stay("black-llama", "Black Llama Hostel Miraflores", [-12.1189, -77.0315], "Pod-style dorm beds, murals, a rooftop bar, and regular social programming make Black Llama energetic rather than restful.", "https://www.blackllamahostels.com/en/miraflores", "$$", "hostel", ["rooftop_bar", "social", "pods"]),
  stay("kaclla", "KACLLA, The Healing Dog Hostel", [-12.124, -77.0311], "KACLLA brings a calmer guesthouse rhythm to Miraflores with breakfast, shared kitchen, courtyard, private rooms, and dorms.", "https://www.kacllahostel.com/", "$", "hostel", ["quiet", "kitchen", "breakfast"]),
  stay("1900-backpackers", "1900 Backpackers Hostel", [-12.06, -77.036], "Opposite the art museum, this historic-center hostel occupies an old mansion with high ceilings, a roof bar, and sociable common rooms.", "https://1900hostel.com/", "$", "hostel", ["historic_center", "roof_bar", "social"]),
  stay("alpes-lima", "Alpes Lima Kennedy Hostel", [-12.1233, -77.0332], "Alpes offers dorms, private rooms, a roof terrace, and quick Parque Kennedy access without committing to a full party-hostel atmosphere.", "https://www.alpeslima.com/", "$", "hostel", ["roof_terrace", "central", "miraflores"]),
  stay("dragonfly", "Dragonfly Hostels Miraflores", [-12.122, -77.0272], "A colorful rooftop and compact dorm/private-room mix suit travelers wanting nightlife access near Kennedy Park at a moderate price.", "https://dragonflyhostels.com/lima/", "$", "hostel", ["rooftop", "nightlife", "miraflores"]),
  { ...stay("lima-house", "Lima House Hostel", [-12.0614, -77.0372], "Lima House uses a restored central building for simple dorms, private rooms, balconies, and access to museums and historic streets.", "https://www.limahousehostel.com/", "$", "hostel", ["historic_center", "budget", "balcony"]), photoUrl: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/322904177.jpg?k=656f51dea939c087030c8ee83971a85ce0bb6217c86199920dff7f37468c2560&o=" },
  stay("tierras-viajeras", "Tierras Viajeras Hostel", [-12.1262, -77.0178], "This small Miraflores hostel emphasizes personal hosting, private rooms, shared facilities, and a quieter base away from the main bar blocks.", "https://www.instagram.com/hosteltierrasviajeraslima/", "$", "hostel", ["quiet", "small_property", "local_host"]),
  { ...stay("casa-porta", "Casa Porta", [-12.1247, -77.0323], "A modest Miraflores lodging with private rooms, shared social areas, and walkable access to the Malecón and Kennedy Park.", "https://www.casaporta.com.pe/", "$", "hostel", ["private_rooms", "quiet", "miraflores"]), photoUrl: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/331770084.jpg?k=4c8b49fc00bd771681b4bdcf7d67f6cda50731cd48f0f4f68ee931226586ea76&o=" },
];

const casualBars = [
  bar("juanito", "Juanito de Barranco", [-12.1492, -77.021], "An old Barranco bodega pours beer and pisco beside ham sandwiches, wooden shelves, and a mixed crowd that resists polished nightlife formulas.", "https://www.facebook.com/JuanitodeBarranco/", "Monday–Saturday 12:00 PM–2:00 AM; Sunday 12:00 PM–12:00 AM.", "$$", "dive_bar", ["historic", "sandwiches", "barranco"]),
  bar("cordano", "Bar Cordano", [-12.045, -77.0281], "Since 1905, Cordano has served pisco sours, butifarra sandwiches, and criollo plates across from Government Palace.", "https://www.facebook.com/BarCordanoOficial/", "Monday–Saturday 8:00 AM–8:00 PM; Sunday 9:00 AM–6:00 PM.", "$$", "dive_bar", ["historic", "city_center", "pisco"]),
  bar("ayahuasca", "Ayahuasca Restobar", [-12.1481, -77.0214], "A sprawling republican mansion divides pisco cocktails, beer, and DJ energy among vividly decorated rooms and courtyards.", "https://ayahuascarestobar.com/", "Monday–Saturday 8:00 PM–3:00 AM; closed Sunday.", "$$$", "lounge", ["mansion", "dj", "barranco"]),
  bar("la-noche", "La Noche de Barranco", [-12.1498, -77.0203], "La Noche programs Peruvian rock, jazz, folk, and indie acts in an intimate upstairs venue with a separate bar.", "https://lanoche.com.pe/", "Bar opens Tuesday–Sunday at 7:00 PM; performance and closing times follow the official show calendar.", "$$", "live_music_venue", ["live_music", "ticketed_shows", "barranco"]),
  bar("victoria", "Victoria Bar", [-12.1483, -77.0215], "Victoria fills a restored Barranco house with courtyard drinks, DJs, live sets, and casual food across several rooms.", "https://www.instagram.com/victoriabarlima/", "Wednesday–Saturday 7:00 PM–3:00 AM; event exceptions follow the official program.", "$$", "other", ["courtyard", "dj", "barranco"]),
  bar("piselli", "Bar Piselli", [-12.1467, -77.0207], "This century-old Barranco bar keeps the formula narrow: chilcanos, pisco sours, cold beer, sandwiches, and conversation at the wooden counter.", "https://www.facebook.com/BarPiselli/", "Monday–Saturday 12:00 PM–12:00 AM; Sunday 12:00 PM–8:00 PM.", "$$", "dive_bar", ["historic", "pisco", "barranco"]),
  bar("mollys", "Molly's Irish Bar & Restaurant", [-12.1206, -77.0292], "Molly’s handles football screens, pub food, draft beer, and a sociable expatriate crowd near Parque Kennedy.", "https://www.mollyslima.com/", "Daily 12:00 PM–2:00 AM; match-day openings follow the official event listings.", "$$", "sports_bar", ["sports", "pub_food", "miraflores"]),
  bar("barbarian", "BarBarian Miraflores", [-12.1187, -77.031], "A broad Peruvian craft-beer board and brewery-driven taps meet burgers, wings, and unapologetically loud group tables.", "https://barbarian.pe/", "Monday–Thursday 5:00 PM–12:00 AM; Friday–Saturday 5:00 PM–2:00 AM; Sunday 4:00 PM–11:00 PM.", "$$", "beer_bar", ["craft_beer", "groups", "miraflores"]),
  bar("cerveceria-valle", "Cervecería del Valle Lima", [-12.124, -77.034], "This Lima taproom pours Sacred Valley-brewed IPAs, lagers, and seasonal beer with a simple bar-food menu.", "https://cerveceriadelvalle.com/", "Tuesday–Thursday 5:00 PM–12:00 AM; Friday–Saturday 5:00 PM–2:00 AM; Sunday 4:00 PM–11:00 PM.", "$$", "brewery", ["craft_beer", "taproom", "miraflores"]),
  bar("wicks", "Wicks Brewpub", [-12.1457, -77.0215], "Wicks brews British-leaning ales and serves them with substantial pub plates in a convivial Barranco drinking room.", "https://www.wicksbrewpub.com/", "Tuesday–Thursday 5:00 PM–12:00 AM; Friday–Saturday 5:00 PM–2:00 AM; Sunday 1:00 PM–10:00 PM.", "$$", "brewery", ["brewpub", "british_ales", "barranco"]),
];

const cocktailBars = [
  bar("carnaval", "Carnaval Bar", [-12.0988, -77.0363], "Aaron Díaz turns ice, glassware, scent, and theatrical service into technically exact cocktails in San Isidro.", "https://carnavalbar.com/", "Tuesday–Saturday 7:00 PM–2:00 AM; reservations follow the official booking page.", "$$$", "cocktail_bar", ["reservation_recommended", "theatrical", "san_isidro"]),
  bar("lady-bee", "Lady Bee", [-12.1514, -77.022], "Native honey, Amazonian fruit, Peruvian spirits, and serious kitchen work make Lady Bee a compact Barranco bar worth reserving.", "https://ladybee.pe/", "Tuesday–Saturday 6:00 PM–1:00 AM; reservation seatings follow the official calendar.", "$$$", "cocktail_bar", ["native_ingredients", "reservation_required", "barranco"]),
  bar("sastreria", "Sastrería Martínez", [-12.1189, -77.0319], "Tailoring-room décor frames an ambitious cocktail menu that threads Peruvian ingredients through classics and high-concept signatures.", "https://www.sastreriamartinez.com/", "Tuesday–Saturday 7:00 PM–2:00 AM; closed Sunday and Monday.", "$$$", "cocktail_bar", ["concept_bar", "reservations", "miraflores"]),
  bar("parrot-shadow", "The Parrot Shadow", [-12.1475, -77.021], "A small Barranco room builds balanced tropical drinks around pisco, rum, local fruit, and attentive bartender conversation.", "https://www.instagram.com/theparrotshadow/", "Tuesday–Saturday 7:00 PM–2:00 AM; Sunday 6:00 PM–12:00 AM.", "$$", "cocktail_bar", ["intimate", "tropical", "barranco"]),
  bar("infusionista", "El Infusionista", [-12.1215, -77.0287], "House infusions, teas, herbs, and Peruvian spirits drive a playful Miraflores cocktail menu with unusually detailed presentation.", "https://www.instagram.com/elinfusionista/", "Tuesday–Saturday 7:00 PM–2:00 AM; official social listings control special events.", "$$", "cocktail_bar", ["infusions", "creative", "miraflores"]),
  bar("capitan-melendez", "Capitán Meléndez", [-12.1217, -77.0292], "This pisco-focused bar teaches the spirit through sours, chilcanos, tastings, and classic technique rather than nightclub volume.", "https://www.facebook.com/CapitanMelendez/", "Monday–Saturday 6:00 PM–1:00 AM; closed Sunday.", "$$", "cocktail_bar", ["pisco", "tastings", "miraflores"]),
  bar("bar-7", "Bar 7", [-12.1488, -77.0213], "Barranco’s Bar 7 keeps a concise cocktail list, neighborhood regulars, and a looser late-night posture than reservation-led rooms.", "https://www.instagram.com/bar7barranco/", "Tuesday–Saturday 7:00 PM–2:00 AM; Sunday 6:00 PM–12:00 AM.", "$$", "cocktail_bar", ["neighborhood", "late_night", "barranco"]),
  bar("tragaluz", "Tragaluz", [-12.1352, -77.0297], "Contemporary art, garden-facing seating, and polished pisco cocktails make the Miraflores Park bar suitable for a quieter drink.", "https://www.belmond.com/hotels/south-america/peru/lima/belmond-miraflores-park/dining", "Daily 12:00 PM–12:00 AM; hotel event hours follow the official dining page.", "$$$", "lounge", ["hotel_bar", "quiet", "art"]),
  bar("english-bar", "English Bar", [-12.0971, -77.0525], "Dark wood, club chairs, and a prize-winning pisco sour preserve the Country Club’s old-Lima hotel-bar ritual.", "https://www.countryclublimahotel.com/gastronomia/", "Daily 12:00 PM–1:00 AM; private events follow the hotel dining calendar.", "$$$", "lounge", ["historic", "hotel_bar", "pisco"]),
  bar("saha", "SAHA Rooftop", [-12.1226, -77.0276], "Local fruit, pisco, and approachable signatures move upstairs to a lively two-level Miraflores roof after dinner.", "https://www.sahaperu.com/en/", "Daily 8:00 AM–1:00 AM; cocktail-focused rooftop service begins at 6:00 PM.", "$$", "rooftop_bar", ["rooftop", "social", "miraflores"]),
];

const cultureStops = [
  culture("larco", "Museo Larco", [-12.0724, -77.0708], "A chronological pre-Columbian collection, visible storage, erotic pottery gallery, and flowering gardens make ancient Peru unusually legible.", "https://www.museolarco.org/", "Daily 9:00 AM–6:00 PM; ticket office closes before the final gallery exit.", "archaeology_museum", ["pre_columbian", "gardens", "visible_storage"]),
  culture("mali", "Museo de Arte de Lima (MALI)", [-12.06, -77.0362], "MALI surveys Peruvian art from pre-Columbian objects through colonial painting, republican art, photography, and modern work.", "https://mali.pe/es/visitas/", "Tuesday–Friday and Sunday 10:00 AM–6:00 PM; Saturday 10:00 AM–5:00 PM; closed Monday.", "art_museum", ["peruvian_art", "historic_building", "central"]),
  culture("pucllana", "Museo de Sitio Pucllana", [-12.111, -77.0333], "Guided circuits climb a monumental adobe pyramid and explain ancient Lima culture inside densely modern Miraflores.", "https://museos.cultura.pe/museos/museo-de-sitio-pucllana", "Day visits Wednesday–Monday 9:00 AM–5:00 PM; night visits Wednesday–Sunday 6:45 PM–9:00 PM by reservation; closed Tuesday.", "archaeological_site", ["guided_visit", "adobe_pyramid", "miraflores"]),
  culture("osma", "Museo Pedro de Osma", [-12.1534, -77.0217], "A Barranco mansion holds a focused collection of viceregal painting, silver, sculpture, furniture, and southern Andean art.", "https://museopedrodeosma.org/", "Tuesday–Sunday 10:00 AM–6:00 PM; closed Monday.", "colonial_art_museum", ["viceregal_art", "mansion", "barranco"]),
  culture("lum", "Lugar de la Memoria, la Tolerancia y la Inclusión Social", [-12.1094, -77.0545], "LUM confronts Peru’s 1980–2000 internal conflict through testimony, archives, art, and difficult questions about violence and memory.", "https://lum.cultura.pe/", "Tuesday–Sunday 10:00 AM–5:00 PM; closed Monday and official holidays.", "memory_museum", ["human_rights", "modern_history", "free_entry"]),
  culture("mac", "Museo de Arte Contemporáneo de Lima", [-12.1432, -77.0229], "MAC Lima presents changing contemporary exhibitions around a modern building, sculpture garden, pond, and Barranco parkland.", "https://maclima.pe/", "Tuesday–Sunday 10:00 AM–7:00 PM; closed Monday.", "contemporary_art_museum", ["contemporary_art", "garden", "barranco"]),
  culture("amano", "Museo Textil Precolombino Amano", [-12.1128, -77.0428], "Amano’s textiles reveal ancient weaving structures, dyes, fibers, and coastal iconography through exceptionally clear close viewing.", "https://museoamano.org/", "Monday–Sunday 10:00 AM–5:00 PM; guided visits follow the official reservation schedule.", "textile_museum", ["textiles", "pre_columbian", "guided_tours"]),
  culture("san-francisco", "Basílica y Convento de San Francisco de Lima", [-12.0453, -77.027], "A guided museum circuit crosses cloisters, library, religious paintings, tiled rooms, and the famous colonial catacombs.", "https://museocatacumbas.com/", "Daily 9:00 AM–6:00 PM; guided-entry intervals and religious closures follow the official ticket page.", "religious_museum", ["catacombs", "colonial", "guided_visit"]),
  culture("mate", "MATE Museo Mario Testino", [-12.1529, -77.0211], "Mario Testino’s photography shares a restored Barranco house with temporary exhibitions and a room devoted to Andean costume portraits.", "https://www.mate.pe/", "Tuesday–Sunday 10:00 AM–7:00 PM; closed Monday.", "photography_museum", ["photography", "fashion", "barranco"]),
  culture("magic-water", "Circuito Mágico del Agua", [-12.0703, -77.0337], "Thirteen illuminated fountains turn Parque de la Reserva into an evening spectacle, including timed music-and-projection shows.", "https://www.circuitomagicodelagua.com.pe/", "Tuesday–Sunday 3:00 PM–10:00 PM; main multimedia shows follow the dated official evening schedule.", "public_art_park", ["fountains", "night", "family_friendly"]),
];

const activityStops = [cultureStops[0], cultureStops[2], cultureStops[1], cultureStops[9],
  culture("historic-center", "Plaza Mayor and Historic Centre", [-12.0453, -77.0309], "The cathedral, government palace, arcaded square, churches, and republican streets compress Lima’s colonial power center into a walkable core.", "https://whc.unesco.org/en/list/500/", "Public streets and Plaza Mayor are open 24 hours daily; individual monuments follow their official admission schedules.", "historic_district", ["unesco", "architecture", "walking"]),
  culture("malecon", "Malecón de Miraflores", [-12.129, -77.039], "Clifftop parks link Pacific overlooks, public art, running paths, paragliding launch points, and sunset crowds above the Costa Verde.", "https://visitamiraflores.com/", "Public parks and paths are open 24 hours daily; temporary coastal closures follow municipal notices.", "coastal_walk", ["ocean_view", "walking", "sunset"]),
  culture("barranco-walk", "Barranco and Puente de los Suspiros", [-12.1493, -77.0236], "Murals, republican houses, galleries, bars, and the Bridge of Sighs reward a compact walk from the plaza to the sea.", "https://munibarranco.gob.pe/", "Public streets and bridge are open 24 hours daily; galleries and venues keep their own published schedules.", "neighborhood_walk", ["street_art", "architecture", "nightlife"]),
  culture("pachacamac", "Santuario Arqueológico de Pachacamac", [-12.2564, -76.9005], "A vast pilgrimage center layers Lima, Wari, Ychsma, and Inca architecture across desert terraces south of the city.", "https://pachacamac.cultura.pe/", "Tuesday–Saturday 9:00 AM–5:00 PM; Sunday 9:00 AM–4:00 PM; closed Monday.", "archaeological_site", ["desert", "museum", "day_trip"]),
  culture("palomino", "Islas Palomino Wildlife Boat Trip", [-12.0505, -77.164], "Boat trips leave Callao for seabird colonies and a cold-water swim near South American sea lions in open Pacific conditions.", "https://www.islaspalomino.com/", "Daily scheduled departure at 10:00 AM with return around 2:00 PM; the operator’s dated booking page, sea conditions, and port authority orders control cancellations.", "wildlife_boat", ["sea_lions", "boat", "weather_dependent"]),
  culture("surquillo-tour", "Surquillo Market Food Walk", [-12.1184, -77.0233], "A guided market walk decodes native fruit, potatoes, seafood, ceviche, and neighborhood lunch culture beyond Lima’s tasting menus.", "https://www.limacookingproject.com/", "Tours run at the exact start times shown on the official booking calendar; market access is daily 6:00 AM–6:00 PM.", "food_tour", ["market", "guided", "tasting"]),
];

const broadSources = {
  food: [
    { name: "Peru Travel - Cuisine of Lima", url: "https://www.peru.travel/gastronomy/en/peruvian-cuisine/cuisine-of-lima.html" },
    { name: "The World's 50 Best Restaurants - Lima", url: "https://www.theworlds50best.com/discovery/sitemap/peru/lima" },
    { name: "RestoLima 2026 food guide", url: "https://restolima.com/" },
    mapsEditorial("Google Maps - Lima restaurants", "best restaurants"),
  ],
  stay: [
    { name: "Visit Miraflores - where to stay", url: "https://visitamiraflores.com/en/where-to-stay/" },
    { name: "Booking.com - Lima", url: "https://www.booking.com/city/pe/lima.html" },
    { name: "Hostelworld - Lima", url: "https://www.hostelworld.com/hostels/Lima/Peru" },
    mapsEditorial("Google Maps - Lima lodging", "hotels hostels"),
  ],
  nightlife: [
    { name: "Peru Travel - Lima nightlife and pisco", url: "https://www.peru.travel/lafinalenlima/conoce-lima/imperdibles.html" },
    { name: "The World's 50 Best Bars discovery", url: "https://www.worlds50bestbars.com/discovery/sitemap/peru/lima" },
    { name: "Visit Miraflores entertainment", url: "https://visitamiraflores.com/" },
    mapsEditorial("Google Maps - Lima bars", "best bars"),
  ],
  culture: [
    { name: "Peru Ministry of Culture museums", url: "https://museos.cultura.pe/" },
    { name: "Peru Travel - Lima cultural activities", url: "https://www.peru.travel/lafinalenlima/conoce-lima/actividades-culturales-y-de-entretenimiento.html" },
    { name: "UNESCO Historic Centre of Lima", url: "https://whc.unesco.org/en/list/500/" },
    mapsEditorial("Google Maps - Lima culture", "museums culture"),
  ],
};

const guides: PeruGuideInput[] = [
  { category: "Food", key: "best-restaurants", seoSlug: "best-restaurants", title: "Lima's Great Tables, from Nikkei Precision to Criollo Memory", description: "Lima’s destination dining is not a single luxury style: it runs through biodiversity research, Nikkei technique, ceviche lunch culture, criollo tavern cooking, and serious restaurant bars. Reservations and lunch-only seafood schedules matter.", seoTitle: "Best Restaurants in Lima", seoDescription: "Ten source-backed Lima restaurants for tasting menus, Nikkei cooking, ceviche, criollo food, and modern Peruvian dining.", stops: restaurants, editorialSources: broadSources.food },
  { category: "Food", key: "best-cheap-eats", seoSlug: "best-cheap-eats", title: "Ceviche Counters, Chifa Tables, and Lima's Everyday Appetite", description: "Affordable Lima lives in seafood counters, pollerías, sandwich shops, Chinatown dining rooms, anticucho grills, and municipal markets. These places trade ceremony for speed, smoke, acidity, and portions built for sharing.", seoTitle: "Best Cheap Eats in Lima", seoDescription: "Ten affordable Lima stops for ceviche, sandwiches, chifa, anticuchos, pollo a la brasa, markets, and criollo lunches.", stops: cheapEats, editorialSources: broadSources.food },
  { category: "Stay", key: "best-hotels", seoSlug: "best-hotels", title: "Pacific Views, Barranco Mansions, and San Isidro Polish", description: "Lima’s strongest hotels divide between ocean-facing Miraflores towers, art-rich Barranco mansions, and business-minded San Isidro properties. The right choice depends on neighborhood evenings, traffic, views, and appetite for large-hotel infrastructure.", seoTitle: "Best Hotels in Lima", seoDescription: "Ten Lima hotels compared for Pacific views, Barranco character, San Isidro access, pools, design, and business facilities.", stops: hotels, editorialSources: broadSources.stay },
  { category: "Stay", key: "best-hostels", seoSlug: "best-hostels", title: "Social Roofs, Quiet Courtyards, and Lima on a Backpacker Budget", description: "These hostel-only stays separate Miraflores party energy from calmer kitchens and historic-center mansions. Dorm privacy, rooftop noise, late arrivals, and the distance to Barranco determine more than small price differences.", seoTitle: "Best Hostels in Lima", seoDescription: "Ten Lima hostels with social roofs, quiet courtyards, dorms, private rooms, central locations, and direct booking evidence.", stops: hostels, editorialSources: broadSources.stay },
  { category: "Nightlife", key: "best-casual-bars", seoSlug: "best-dive-bars", title: "Old Bodegas, Live Rooms, and Craft Beer without Ceremony", description: "Lima’s casual bar culture moves from century-old pisco counters to Barranco music rooms, brewery taps, football pubs, and multi-room mansions. Show calendars and late-week schedules shape the night.", seoTitle: "Best Dive Bars and Casual Pubs in Lima", seoDescription: "Ten source-backed Lima bodegas, pubs, live-music rooms, breweries, and casual bars with current schedules.", stops: casualBars, editorialSources: broadSources.nightlife },
  { category: "Nightlife", key: "best-cocktail-bars", seoSlug: "best-cocktail-bars", title: "Pisco, Native Botanicals, and Lima's Serious Cocktail Craft", description: "The city’s best cocktail bars treat pisco, Amazonian fruit, native honey, ice, and glassware as working ingredients rather than decoration. Reserve the smallest rooms and use hotel lounges when conversation matters more than spectacle.", seoTitle: "Best Cocktail Bars in Lima", seoDescription: "Ten Lima cocktail bars for pisco, native ingredients, theatrical service, intimate rooms, rooftops, and polished hotel lounges.", stops: cocktailBars, editorialSources: broadSources.nightlife },
  { category: "Culture", key: "best-culture", seoSlug: "best-culture", title: "Ancient Textiles, Colonial Power, and Peru's Difficult Modern Memory", description: "Lima’s museums and sites span adobe ceremonial centers, pre-Columbian ceramics and textiles, viceregal art, contemporary photography, political violence, and public spectacle. Several are closed Monday, so museum planning needs a calendar.", seoTitle: "Best Culture in Lima", seoDescription: "Ten Lima museums and cultural sites covering archaeology, art, textiles, memory, photography, catacombs, and public fountains.", stops: cultureStops, editorialSources: broadSources.culture },
  { category: "Activities", key: "best-things-to-do", seoSlug: "best-things-to-do", title: "Ten Ways into Lima, from Adobe Pyramids to Pacific Wildlife", description: "These experiences join Lima’s strongest museums with historic streets, coastal parks, Barranco, desert archaeology, a market tasting, and a weather-dependent wildlife trip. Traffic makes geographic clustering essential.", seoTitle: "Best Things to Do in Lima", seoDescription: "Ten source-backed Lima experiences spanning museums, Huaca Pucllana, historic streets, Barranco, coast walks, Pachacamac, food, and wildlife.", stops: activityStops, editorialSources: broadSources.culture },
];

const photoCandidates: Record<string, string> = {
  central: "https://framerusercontent.com/images/WoZWHaGN7aNgeS7gc3IiJRZmMm0.png",
  maido: "https://cdn.mesa247.io/archivos/webpages/1481-FotoPrincipal-1718404971.jpg",
  kjolle: "https://framerusercontent.com/images/WAcd4sh4oGjS1rpkNFXGQ5v4.png",
  merito: "https://static.wixstatic.com/media/bd5d02_e704f69753304e1c900063b87584b860~mv2.png",
  "astrid-gaston": "https://www.astridygaston.com/static/salon-conferencia-db918b3b220f570cc2739e83fe00063b.png",
  isolina: "https://cdn.mesa247.io/archivos/webpages/128-FotoPrincipal-0-1757112397.jpg",
  "la-lucha": "https://lalucha.com.pe/fondo.webp",
  "el-chinito": "https://img1.wsimg.com/isteam/ip/b0c4de75-e3bc-402b-af95-81b99bcfc857/el%20chinito.jpeg",
  "chifa-wa-lok": "https://cdn.mesa247.io/archivos/webpages/1822-SeccionExtraDerecha2FotoGrande-1723667713.jpg",
  "don-tito": "https://cdn.mesa247.io/archivos/webpages/1441-FotoPrincipal-0-1760106708.png",
  "miraflores-park": "https://img.belmond.com/f_auto/t_3200_ar_4_5/photos/vsm/vsm-cam-legend01.jpg",
  "hotel-b": "https://hotelb.pe/wp-content/uploads/2021/01/StayWithMe_slider1-2-scaled.jpg",
  "country-club": "https://prdunhcountryclubstorage.blob.core.windows.net/strapi/Luxury_Wedding_Country_01_d659896752.jpg",
  "villa-barranco": "https://ananayhotels.com/wp-content/uploads/2026/01/slide-5-scaled.jpg",
  souma: "https://symphony.cdn.tambourine.com/souma-hotel-lima/media/souma-homepage-groupsevents-img-69baea51b36a3.jpg",
  pariwana: "https://pariwana-hostel.com/webmedia/filer_public/ce/8f/ce8f3c75-03dc-484f-909a-db79a0a1eb62/11_bar_and_restaurant.webp",
  "black-llama": "https://www.blackllamahostels.com/videos/hero-poster-mobile.webp",
  kaclla: "https://kacllahostel.com/wp-content/uploads/2024/02/BH007-scaled.jpg",
  "1900-backpackers": "https://1900hostel.com/wp-content/uploads/2018/07/16.jpg",
  ayahuasca: "https://ayahuascarestobar.com/wp-content/uploads/2023/09/fondo-reservas_ayahuasca-restobar.jpeg",
  "cerveceria-valle": "https://cerveceriadelvalle.com/assets/images/horizontales-mesa-de-trabajo-1-copia-2-2576x1449.png",
  "english-bar": "https://prdunhcountryclubstorage.blob.core.windows.net/strapi/1_ade0de7628.jpg",
  saha: "https://www.sahaperu.com/wp-content/uploads/2023/06/saha-hero.jpg",
  larco: "https://www.museolarco.org/wp-content/uploads/2017/08/ppal1.jpg",
  mali: "https://mali.pe/es/wp-content/uploads/2025/06/DSC05112-scaled.jpg",
  pucllana: "https://museos.cultura.pe/sites/default/files/styles/cabecera_museo_full/public/museos/imagen/rnm_1765351427.jpg?itok=5xi45pVt",
  osma: "https://framerusercontent.com/images/btmzaSO2Tjxp6Jwwm1xIvtBzUo.jpg?width=6223&height=4153",
  malecon: "https://visitamiraflores.com/wp-content/uploads/2024/01/miraflores-hero-1-1.jpg",
  pachacamac: "https://pachacamac.cultura.pe/sites/default/files/styles/slider/public/slider/imagen/Slider_1.png?itok=cwJExxgF",
  mayta: "https://feastio.com/wp-content/uploads/2022/11/Mayta-Restaurant-entrance.jpg",
  rafael: "https://res.cloudinary.com/the-infatuation/image/upload/q_auto,f_auto/images/PR_RAFAEL_AGOSTO_20212955_fgypnf",
  "jw-marriott": "https://cache.marriott.com/content/dam/marriott-renditions/LIMDT/limdt-suite-6531-hor-clsc.jpg?downsize=1720px%3A%2A&interpolation=progressive-bilinear&output-quality=70",
  pullman: "https://www.ahstatic.com/photos/b464_rokgb_00_p_2048x1536.jpg",
  "casa-republica": "https://www.casarepublica.com/wp-content/uploads/2019/10/Frame-3-1.jpg",
  "al-toke-pez": "https://elcomercio.pe/resizer/v2/TKI4K4NUXFGVHABNTCDUKCMNDM.jpg?auth=f0b41ff07a472f0b33db772425f522896ac133399c5a833ba439ebbb98f38006&height=1067&quality=75&smart=true&width=1600",
  "canta-rana": "https://benchartoff.com/lima-y-sal/assets/img/canta-rana/interior.jpg",
  "tio-mario": "https://cloudfront-us-east-1.images.arcpublishing.com/elcomercio/UM2JWFXQEBAOPDWLZAYDSYAKMY.jpg",
  "el-muelle": "https://cdn.tasteatlas.com/images/restaurants/186f89d2a30244a39ad9401b00738fc0.jpg?m=facebook",
  juanito: "https://www.finedininglovers.lat/sites/default/files/places/juanito-barranco-chijb-10i-k3bzery-n5eyj4nhm-2.png",
  osaka: "https://trazzoweb.com/wp-content/uploads/2023/05/OSAKA-2.jpg",
  atemporal: "https://images.trvl-media.com/lodging/16000000/15960000/15956200/15956143/b7add4f8.jpg?h=800&impolicy=fcrop&quality=medium&w=1200",
  "rincon-chami": "https://jimenaagois.com/wp-content/uploads/2020/11/06A5794.jpg",
  "surquillo-market": "https://cloudfront-us-east-1.images.arcpublishing.com/elcomercio/OSLS6I5J4RF4XLMAC6JYMOD7QY.jpg",
  "vvp-kokopelli": "https://www.tangol.com/Fotos/Hospedaje/kokopelli-barranco_18301202105101613006.Mobile.JPG",
  "alpes-lima": "https://storage.googleapis.com/hostel-hop-storage/app%2Fprod%2Fproperty%2F1715153372194%2Flvxi17vh0001d456db2lj9wb.webp",
  dragonfly: "https://media.viajarsimple.com/vp/2025/07/dragonfly-hostels-tu-aventura-empiezan-aqui-1024x575.jpg",
  "tierras-viajeras": "https://d34ad2g4hirisc.cloudfront.net/volunteer_positions/photos/000/054/894/main/7303a3e9aeefaf94bf46d43ac94039fb.jpg",
  cordano: "https://images.musement.com/cover/0168/57/thumb_16756200_cover_header.jpg?auto=format&dpr=1&fit=crop&h=400&q=50&w=1024",
  victoria: "https://cdn.prod.website-files.com/5e335fe3b1bc007cda4bc853/6406273e6cef9e858ccb8176_victoria-bar-2.jpg",
  piselli: "https://img.restaurantguru.com/r98a-Bar-Piselli-bar-counter.jpg",
  mollys: "https://imgmedia.larepublica.pe/640x640/larepublica/original/2023/08/02/64cabd999fa59539bd7575f0.webp",
  barbarian: "https://thecitylane.com/wp-content/uploads/2018/08/IMG_8330.jpg",
  wicks: "https://assets.untappd.com/photos/2019_02_12/6b149d4622cb2a5442dfd6a14b502278_640x640.jpg",
  carnaval: "https://img.mesa247.pe/archivos/alma-del-bar-sac/carnaval-bar24-foto.jpg",
  "lady-bee": "https://imagenes2.eltiempo.com/files/image_1200_675/uploads/2025/05/29/6838e7d363794.jpeg",
  sastreria: "https://elcomercio.pe/resizer/v2/https%3A%2F%2Fcdn.jwplayer.com%2Fv2%2Fmedia%2FCr39NB4F%2Fposter.jpg?auth=1fdd309c1eff242f1fe48f9a0c1521173ed4b202ee12a432a92246e377da0057&height=528&quality=75&smart=true&width=980",
  "parrot-shadow": "https://arewabxlefttuhzucoxx.supabase.co/storage/v1/object/public/bar_attachments/333f1e6b-16fc-413f-9f28-ca07371c5064/parrot.jpg",
  infusionista: "https://img.restaurantguru.com/cb89-bar-counter-El-Infusionista.jpg",
  "capitan-melendez": "https://images.myguide-cdn.com/peru/companies/captain-melendez-bar/large/captain-melendez-bar-628523.jpg",
  "bar-7": "https://cosasbucket.s3.amazonaws.com/wp-content/uploads/2021/07/27222759/IMG-20191216-WA0013-1024x682-1.jpg",
  tragaluz: "https://media-cdn.tripadvisor.com/media/photo-m/1280/2a/d6/02/2d/tragaluz-barra.jpg",
  lum: "https://www.tvperu.gob.pe/sites/default/files/lum_ok_6.jpg",
  mac: "https://cosasbucket.s3.amazonaws.com/wp-content/uploads/2022/09/07172944/2020-04-26T21_51_29.094ZMuseo-de-Arte-Contempora%CC%81neo-de-Lima-MAC-Lima-expo-2.jpg",
  amano: "https://www.rumbosdelperu.com/wp-content/uploads/2017/11/Museo-Amano.jpg",
  "historic-center": "https://static.wixstatic.com/media/4c919a_625ee230944a4572b15927881e47c204~mv2.jpeg/v1/fill/w_1000%2Ch_562%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01/4c919a_625ee230944a4572b15927881e47c204~mv2.jpeg",
  "barranco-walk": "https://diariocorreo.pe/resizer/v2/WMMV5OAP4VFM7LIF6TRNQZOXNQ.jpg?auth=33b70d76ae1505ee47376cf82f7cf0524a1a9d24cb811b8d355bd9e967aefa08&height=800&quality=75&smart=true&width=1200",
  palomino: "https://www.anywhere.com/img-a/attraction/palamino-islands-island-peru/IMG_6696.jpg?q=75&type=jpeg&w=800",
  "surquillo-tour": "https://www.civitatis.com/f/peru/lima/galeria/taller-cocina-peruana7.jpg",
};

export const limaCitywideGuides = buildPeruCityGuides({ city: "Lima", cityId: "lima", createdAt: "2026-08-10T00:00:00.000Z", checkedAt, guides, photoCandidates });
