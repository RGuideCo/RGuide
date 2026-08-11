import type { ListSource } from "@/types";
import { buildPeruCityGuides, type PeruGuideInput, type PeruStopInput } from "@/data/guides/peru-guide-builder";

const checkedAt = "2026-08-10";
const mapsEditorial = (label: string, query: string): ListSource => ({ name: label, url: `https://www.google.com/maps/search/${encodeURIComponent(query + " Cusco Peru")}` });

function food(id: string, name: string, coordinates: [number, number], description: string, officialUrl: string, hours: string, price: PeruStopInput["price"], cuisines: string[], tags: string[], service: PeruStopInput["foodServiceType"] = "restaurant"): PeruStopInput {
  return { id, name, coordinates, description, officialUrl, hours: { default: hours }, price, priceSource: `${name} official menu/reservation page`, venueKind: "food_drink", subcategory: cuisines[0], attributeTags: tags, foodServiceType: service, cuisineTypes: cuisines };
}
function stay(id: string, name: string, coordinates: [number, number], description: string, officialUrl: string, price: PeruStopInput["price"], lodgingType: "hotel" | "hostel", tags: string[]): PeruStopInput {
  return { id, name, coordinates, description, officialUrl, bookingUrl: officialUrl, hours: { default: "Front desk operates 24 hours daily; the official property booking page controls check-in, check-out, luggage storage, oxygen support, and late-arrival conditions." }, price, priceSource: `${name} official booking page`, venueKind: "lodging", lodgingType, subcategory: lodgingType, attributeTags: tags };
}
function bar(id: string, name: string, coordinates: [number, number], description: string, officialUrl: string, hours: string, price: PeruStopInput["price"], nightlifeType: NonNullable<PeruStopInput["nightlifeType"]>, tags: string[], musicGenres: string[] = []): PeruStopInput {
  return { id, name, coordinates, description, officialUrl, hours: { default: hours }, price, priceSource: `${name} official menu or event page`, venueKind: "nightlife", nightlifeType, subcategory: nightlifeType, attributeTags: tags, musicGenres };
}
function culture(id: string, name: string, coordinates: [number, number], description: string, officialUrl: string, hours: string, subcategory: string, tags: string[]): PeruStopInput {
  return { id, name, coordinates, description, officialUrl, hours: { default: hours }, venueKind: "culture", subcategory, attributeTags: tags };
}

const restaurants = [
  food("cicciolina", "Cicciolina", [-13.5155, -71.9765], "A second-floor Cusco institution combining an open kitchen, tapas bar, charcuterie, Andean produce, and Mediterranean technique in intimate rooms.", "https://www.cicciolinacuzco.com/", "Daily 12:00 PM–3:00 PM and 6:00 PM–10:00 PM; official reservations control holiday exceptions.", "$$$", ["peruvian", "mediterranean"], ["tapas", "reservation_recommended", "historic_center"]),
  food("chicha", "Chicha por Gastón Acurio", [-13.5175, -71.9804], "Gastón Acurio’s Cusco room interprets regional potatoes, corn, guinea pig, trout, and chicha traditions from a balcony facing Plaza Regocijo.", "https://www.chicha.com.pe/", "Daily 12:00 PM–10:30 PM; reservation availability follows the official booking page.", "$$$", ["cusquena", "peruvian"], ["regional", "balcony", "historic_center"]),
  food("limo", "LIMO", [-13.516, -71.978], "Plaza de Armas views accompany Nikkei tiraditos, sushi, Peruvian-Japanese hot plates, and a pisco-heavy cocktail list.", "https://www.cuscorestaurants.com/limo/", "Daily 12:00 PM–11:00 PM; official reservations control private-event changes.", "$$$", ["nikkei", "sushi"], ["plaza_view", "cocktails", "reservation_recommended"]),
  food("map-cafe", "MAP Café", [-13.5152, -71.9768], "A glass dining cube inside the Pre-Columbian Art Museum serves contemporary Peruvian tasting and à la carte menus after gallery hours.", "https://www.mapcusco.pe/map-cafe/", "Daily lunch 12:00 PM–3:00 PM and dinner 6:00 PM–10:00 PM; museum events may alter service.", "$$$$", ["contemporary_peruvian"], ["museum_setting", "special_occasion", "reservation_required"]),
  food("uchu", "Uchu Peruvian Steakhouse", [-13.5154, -71.9769], "Hot volcanic stones carry alpaca, beef, trout, and Andean sides to the table in a compact courtyard dining room.", "https://www.cuscorestaurants.com/uchu/", "Daily 12:00 PM–10:30 PM; dated reservations follow the official restaurant page.", "$$$", ["peruvian", "steakhouse"], ["alpaca", "hot_stone", "courtyard"]),
  food("morena", "Morena Peruvian Kitchen", [-13.517, -71.979], "Morena brightens polished versions of lomo saltado, ceviche, causa, and Andean grains with an energetic open dining room.", "https://morenaperuviankitchen.com/", "Daily 12:00 PM–10:30 PM; the official reservation page controls exceptional closures.", "$$", ["peruvian", "contemporary"], ["groups", "central", "cocktails"]),
  food("pachapapa", "Pachapapa", [-13.5145, -71.9733], "A San Blas courtyard and clay oven frame cuy, pachamanca, soups, trout, and other highland comfort dishes.", "https://www.cuscorestaurants.com/pachapapa/", "Daily 12:00 PM–10:00 PM; courtyard seating depends on weather and the official reservation page.", "$$", ["cusquena", "andean"], ["courtyard", "clay_oven", "san_blas"]),
  food("kion", "KION Peruvian Chinese", [-13.5162, -71.9786], "KION treats chifa as a distinct Peruvian tradition through wok dishes, roast meats, dumplings, and polished shared plates.", "https://www.cuscorestaurants.com/kion/", "Daily 12:00 PM–10:30 PM; official reservations control holiday service.", "$$", ["chifa", "cantonese_peruvian"], ["shareable", "groups", "historic_center"]),
  food("greens", "Greens Organic", [-13.516, -71.9784], "Organic vegetables, Andean grains, trout, alpaca, and vegetarian dishes arrive in a light second-floor room overlooking central Cusco.", "https://www.cuscorestaurants.com/greens-organic/", "Daily 11:00 AM–10:00 PM; official venue notices control seasonal changes.", "$$", ["organic", "peruvian"], ["vegetarian_friendly", "local_produce", "plaza_view"]),
  food("yaku", "Yaku Restaurant", [-13.5178, -71.9798], "Yaku builds approachable Peruvian plates, ceviche, alpaca, and cocktails around a plant-filled courtyard near Plaza Regocijo.", "https://www.yakurestaurant.com/", "Daily 11:00 AM–10:30 PM; reservation times follow the official booking page.", "$$", ["peruvian", "andean"], ["courtyard", "central", "vegetarian_friendly"]),
];

const cheapEats = [
  food("san-pedro-market", "Mercado Central de San Pedro", [-13.5202, -71.9824], "Juice stalls, soup counters, roast pork, fruit, bread, and set lunches make Cusco’s main market a sensory first pass at regional food.", "https://www.municusco.gob.pe/", "Daily 6:00 AM–6:00 PM; individual food stalls keep shorter morning and lunch windows within market hours.", "$", ["peruvian", "market_food"], ["market", "breakfast", "local_life"], "stall"),
  food("san-blas-market", "Mercado de San Blas", [-13.5137, -71.9727], "A smaller neighborhood market serves juices, soups, vegetarian plates, and inexpensive menu lunches above the historic center.", "https://www.municusco.gob.pe/", "Daily 7:00 AM–5:00 PM; individual lunch counters may close after food sells out.", "$", ["peruvian", "market_food"], ["market", "budget", "san_blas"], "stall"),
  food("la-chomba", "La Chomba Ajha Wasi", [-13.522, -71.98], "A traditional picantería pours chicha and serves substantial soups, stews, baked guinea pig, and regional dishes to communal tables.", "https://www.facebook.com/LaChombaAjhaWasi/", "Daily 11:00 AM–6:00 PM; regional specials and music follow the official daily listings.", "$", ["cusquena", "picanteria"], ["traditional", "chicha", "communal"]),
  food("kushka", "Kushka", [-13.519, -71.9792], "A family-run kitchen serves home-style Peruvian stews, trout, alpaca, soups, and clearly marked vegetarian choices near the center.", "https://www.kushka.pe/", "Daily 12:00 PM–10:00 PM; official venue notices control holiday changes.", "$", ["peruvian", "home_cooking"], ["family_run", "vegetarian_friendly", "central"]),
  food("organika", "Organika", [-13.5149, -71.9791], "Produce from the restaurant’s Sacred Valley farm appears in salads, soups, alpaca, trout, fresh pasta, and house desserts.", "https://www.organika.pe/", "Daily 11:30 AM–10:00 PM; official reservations control exceptional closures.", "$$", ["organic", "peruvian"], ["farm_to_table", "small_room", "vegetarian_friendly"]),
  food("mr-soup", "Mr. Soup", [-13.517, -71.9793], "Generous bowls range from quinoa and Andean vegetable soups to ramen-inspired broths, useful when altitude suppresses a larger appetite.", "https://www.facebook.com/MrSoupCusco/", "Daily 11:00 AM–10:00 PM; official social listings control holiday service.", "$", ["soups", "peruvian"], ["altitude_friendly", "vegetarian_friendly", "budget"]),
  food("qura", "Qura", [-13.515, -71.9738], "Smoothie bowls, coffee, sandwiches, salads, and plant-forward plates answer breakfast and light-lunch needs in San Blas.", "https://www.instagram.com/quracusco/", "Daily 8:00 AM–9:00 PM; official social listings control seasonal changes.", "$", ["cafe", "healthy"], ["breakfast", "vegan_friendly", "san_blas"], "cafe"),
  food("jc-cafe", "JC's Café", [-13.5161, -71.9808], "A tiny upstairs café does strong coffee, filled sandwiches, crepes, breakfast plates, and fruit drinks at backpacker-friendly prices.", "https://www.facebook.com/JCsCafeCusco/", "Daily 8:00 AM–9:00 PM; venue notices control holiday changes.", "$", ["cafe", "sandwiches"], ["breakfast", "budget", "small_room"], "cafe"),
  food("papachos", "Papacho's Cusco", [-13.516, -71.9781], "Peruvian ingredients enter big burgers, crisp fries, milkshakes, and casual plates above the Plaza de Armas.", "https://www.papachos.com/", "Daily 12:00 PM–11:00 PM; location-specific service follows the official page.", "$$", ["burgers", "peruvian"], ["groups", "plaza_view", "casual"], "fast_casual"),
  food("cholos-grill", "Cholos Craft Beers Cusco", [-13.5155, -71.9761], "A relaxed San Blas-adjacent room pairs local craft beer with burgers, wings, sandwiches, and unfussy shared food.", "https://www.facebook.com/CholosCusco/", "Daily 12:00 PM–12:00 AM; kitchen last orders follow the official venue listing.", "$$", ["pub_food", "burgers"], ["craft_beer", "casual", "late_kitchen"], "pub"),
];

const hotels = [
  stay("monasterio", "Monasterio, A Belmond Hotel", [-13.5148, -71.9764], "A former seminary and monastery surrounds a cloister courtyard with colonial art, oxygen-enriched rooms, live music, and formal service.", "https://www.belmond.com/hotels/south-america/peru/cusco/belmond-hotel-monasterio/", "$$$$", "hotel", ["historic", "luxury", "oxygen_enriched"]),
  stay("palacio-nazarenas", "Palacio Nazarenas, A Belmond Hotel", [-13.5147, -71.9767], "All-suite rooms, personal butlers, a heated outdoor pool, and Inca-colonial masonry occupy a former convent beside Monasterio.", "https://www.belmond.com/hotels/south-america/peru/cusco/belmond-palacio-nazarenas/", "$$$$", "hotel", ["all_suite", "pool", "luxury"]),
  stay("jw-el-convento", "JW Marriott El Convento Cusco", [-13.5161, -71.9758], "A restored convent layers archaeological remains, a central courtyard, spa facilities, and oxygen-enriched rooms near Plaza de Armas.", "https://www.marriott.com/en-us/hotels/cuzmc-jw-marriott-el-convento-cusco/overview/", "$$$$", "hotel", ["historic", "spa", "oxygen_enriched"]),
  stay("palacio-del-inka", "Palacio del Inka, a Luxury Collection Hotel", [-13.5192, -71.9751], "Across from Qorikancha, this mansion combines colonial courtyards, carved interiors, a large spa, and easy archaeological access.", "https://www.marriott.com/en-us/hotels/cuzlc-palacio-del-inka-a-luxury-collection-hotel-cusco/overview/", "$$$$", "hotel", ["spa", "historic", "qorikancha"]),
  stay("inkaterra-casona", "Inkaterra La Casona", [-13.5147, -71.9768], "Eleven suites circle a quiet 16th-century courtyard with fireplaces, deep tubs, frescoes, and highly personal service.", "https://www.inkaterra.com/inkaterra/inkaterra-la-casona/", "$$$$", "hotel", ["small_property", "historic", "fireplace"]),
  stay("aranwa", "Aranwa Cusco Boutique Hotel", [-13.5187, -71.9807], "A museum-like colonial house displays religious art and antiques while oxygen systems and spa-minded rooms address altitude comfort.", "https://www.aranwahotels.com/en/hotels/aranwa-cusco-boutique-hotel/", "$$$$", "hotel", ["art_collection", "oxygen", "boutique"]),
  stay("antigua-casona", "Antigua Casona San Blas", [-13.5142, -71.9739], "Firelit courtyards, an on-site spa, yoga, and warm design make this San Blas property restorative after steep city walks.", "https://antiguacasonasanblas.com/", "$$$", "hotel", ["spa", "courtyard", "san_blas"]),
  stay("el-mercado", "El Mercado", [-13.5152, -71.9804], "Market-inspired interiors, open fires, sociable courtyards, and strong breakfasts animate a boutique property near Plaza San Francisco.", "https://www.elmercadocusco.com/", "$$$", "hotel", ["boutique", "courtyard", "breakfast"]),
  stay("manco-capac", "Quinta San Blas by Ananay Hotels", [-13.5138, -71.9734], "A compact colonial courtyard hotel gives San Blas character, quiet rooms, and short uphill access to workshops and viewpoints.", "https://www.ananayhotels.com/quinta-san-blas/", "$$$", "hotel", ["courtyard", "san_blas", "quiet"]),
  stay("casa-san-blas", "Casa San Blas Boutique Hotel", [-13.514, -71.9744], "Locally made textiles, apartment-style rooms, and a small scale suit travelers who want San Blas outside the largest heritage hotels.", "https://www.casasanblas.com/", "$$", "hotel", ["boutique", "local_design", "san_blas"]),
];

const hostels = [
  stay("viajero-kokopelli", "Viajero Kokopelli Cusco", [-13.5189, -71.981], "A colonial house mixes pod-like dorm beds, courtyards, a lively bar, tours, and enough scale for easy social contact.", "https://www.viajerohostels.com/destinations-peru/cusco/", "$$", "hostel", ["social", "bar", "courtyard"]),
  stay("pariwana", "Pariwana Hostel Cusco", [-13.5182, -71.9811], "Two courtyards, nightly activities, a bar, dorms, and private rooms make Pariwana a dependable high-energy backpacker base.", "https://www.pariwana-hostel.com/", "$", "hostel", ["party", "courtyard", "central"]),
  stay("wild-rover", "Wild Rover Cusco", [-13.5174, -71.9831], "Terrace views and a famously loud party bar suit travelers choosing organized nightlife over early sleep and quiet acclimatization.", "https://wildroverhostels.com/cusco/", "$$", "hostel", ["party", "views", "bar"]),
  stay("loki", "Loki Cusco", [-13.5152, -71.9835], "Loki’s large colonial property revolves around a social bar, events, dorms, and hillside views west of the main square.", "https://www.lokihostel.com/cusco/", "$$", "hostel", ["party", "events", "views"]),
  stay("black-llama", "Black Llama Hostel Cusco", [-13.516, -71.9801], "Privacy beds, contemporary design, social programming, and a craft-cocktail bar update the central Cusco hostel formula.", "https://www.blackllamahostels.com/en/cusco", "$$", "hostel", ["pods", "cocktail_bar", "social"]),
  stay("nao-victoria", "Nao Victoria Hostel", [-13.5168, -71.9793], "A polished central hostel offers curtain dorms, private rooms, breakfast, and a quieter historic-house atmosphere near Plaza de Armas.", "https://www.naovictoria.com/", "$$", "hostel", ["quiet", "privacy_curtains", "central"]),
  stay("supertramp", "Supertramp Hostel Cusco", [-13.5119, -71.9786], "A steep San Cristóbal location earns broad city views, a roof terrace, dorms, and a relaxed social rhythm.", "https://www.supertrampperu.com/", "$", "hostel", ["views", "roof_terrace", "steep_access"]),
  stay("intro", "Intro Hostels Cusco", [-13.5192, -71.9825], "Stone walls, fireplaces, a courtyard, and simple dorm/private inventory create a sociable base near San Francisco.", "https://www.introhostels.com/", "$", "hostel", ["courtyard", "fireplace", "central"]),
  stay("tucan", "Tucan Hostel Cusco", [-13.5165, -71.9833], "A garden, shared kitchen, dorms, and private rooms give budget travelers more breathing room than Cusco’s bar-led hostels.", "https://www.tucanhostelcusco.com/", "$", "hostel", ["garden", "kitchen", "quiet"]),
  stay("cuscopackers", "Cuscopackers Hostels", [-13.5165, -71.986], "Hillside terraces, city views, breakfast, luggage storage, and hot drinks support early tour departures at a low price.", "https://www.visitcusco.org/lodging-listings/", "$", "hostel", ["views", "breakfast", "luggage_storage"]),
];

const casualBars = [
  bar("paddys", "Paddy's Irish Pub", [-13.5161, -71.9783], "A famously high-altitude Irish pub serves draft beer, pub food, football, and balcony views directly over Plaza de Armas.", "https://www.paddysirishbarcusco.com/", "Daily 11:00 AM–2:00 AM; major match openings follow the official event listings.", "$$", "pub", ["sports", "balcony", "plaza_view"]),
  bar("norton-rats", "Norton Rat's Tavern", [-13.5163, -71.9788], "Motorcycle memorabilia, a Plaza balcony, pool tables, beer, and unfussy pub food keep this upstairs bar reliably casual.", "https://www.facebook.com/NortonRatsTavern/", "Daily 11:00 AM–2:00 AM; match and event changes follow official social listings.", "$$", "dive_bar", ["pool_table", "balcony", "sports"]),
  bar("ukukus", "Ukukus Bar", [-13.5169, -71.9789], "Murals and a compact stage host Andean fusion, reggae, rock, DJs, and late dancing near Plaza de Armas.", "https://www.facebook.com/UkukusBarCusco/", "Monday–Saturday 8:00 PM–5:00 AM; performance times follow the official event calendar.", "$$", "live_music_venue", ["live_music", "late_night", "dancing"], ["andean_fusion", "reggae", "rock"]),
  bar("km0", "KM 0", [-13.5144, -71.9733], "This San Blas bar programs nightly live bands, acoustic sets, and DJs in a small room with straightforward drinks.", "https://www.facebook.com/KM0Cusco/", "Daily 8:00 PM–2:00 AM; set times follow the official nightly program.", "$$", "live_music_venue", ["live_music", "san_blas", "small_room"], ["rock", "latin", "acoustic"]),
  bar("chango", "Chango Club Cusco", [-13.5167, -71.9789], "DJs, electronic music, Latin sets, and a tourist-heavy dance floor run deep into the morning near the main square.", "https://www.facebook.com/ChangoClubCusco/", "Wednesday–Saturday 10:00 PM–5:00 AM; event nights follow the official club calendar.", "$$", "club", ["dancing", "late_night", "dj"], ["electronic", "latin"]),
  bar("indigo", "Indigo Bar Restaurant", [-13.5161, -71.9787], "Low seating, board games, snacks, tea, cocktails, and relaxed music offer a softer alternative to Cusco’s club circuit.", "https://www.facebook.com/IndigoCusco/", "Daily 11:00 AM–1:00 AM; official social listings control event changes.", "$$", "lounge", ["board_games", "relaxed", "central"]),
  bar("cerveceria-valle", "Cervecería del Valle Sagrado Taproom Cusco", [-13.5165, -71.9794], "Sacred Valley IPAs, lagers, and seasonal beers reach the city at a central taproom built for tasting flights.", "https://cerveceriadelvalle.com/", "Monday–Saturday 4:00 PM–12:00 AM; Sunday 3:00 PM–10:00 PM.", "$$", "brewery", ["craft_beer", "tasting_flights", "central"]),
  bar("nuevo-mundo", "Nuevo Mundo Draft Bar Cusco", [-13.5166, -71.9792], "A rotating board of Peruvian craft beer, flights, burgers, and bar snacks works well for low-commitment group drinks.", "https://www.nuevomundodraftbar.com/", "Daily 4:00 PM–1:00 AM; tap changes and events follow official listings.", "$$", "beer_bar", ["craft_beer", "flights", "groups"]),
  bar("mythology", "Mythology Club", [-13.5162, -71.9785], "A central dance club runs salsa lessons before switching to reggaeton, Latin hits, and commercial dance music.", "https://www.facebook.com/MythologyCusco/", "Daily 9:00 PM–5:00 AM; lesson and event times follow the official program.", "$$", "club", ["salsa_lessons", "dancing", "late_night"], ["salsa", "reggaeton", "latin"]),
  bar("cholos", "Cholos Craft Beers Cusco", [-13.5155, -71.9761], "Local and Peruvian craft taps, burgers, and an easygoing crowd make Cholos useful before Cusco’s louder late-night rooms.", "https://www.facebook.com/CholosCusco/", "Daily 12:00 PM–12:00 AM; official listings control tap events.", "$$", "beer_bar", ["craft_beer", "casual", "food"]),
];

const cocktailBars = [
  bar("museo-pisco", "Museo del Pisco Cusco", [-13.5173, -71.9799], "Pisco flights, regional labels, sours, chilcanos, and bartender explanations make the national spirit easier to understand.", "https://museodelpisco.org/", "Daily 11:00 AM–1:00 AM; tasting sessions follow the official reservation calendar.", "$$", "cocktail_bar", ["pisco", "tastings", "educational"]),
  bar("republica-pisco", "República del Pisco Cusco", [-13.5164, -71.9788], "A broad pisco list, energetic cocktails, Peruvian food, and live music occupy a busy room near Plaza de Armas.", "https://republicadelpisco.com/", "Daily 12:00 PM–2:00 AM; live-music times follow the official program.", "$$", "cocktail_bar", ["pisco", "live_music", "central"]),
  bar("black-llama", "Black Llama Bar", [-13.516, -71.9801], "A hostel-based cocktail room uses pisco, local fruit, rooftop social events, and accessible pricing without abandoning technique.", "https://www.blackllamahostels.com/en/bar", "Daily 5:00 PM–1:00 AM; hosted events follow the official monthly calendar.", "$$", "cocktail_bar", ["social", "hostel_bar", "events"]),
  bar("divino", "Divino Pisco Bar", [-13.513, -71.978], "A quieter San Cristóbal room focuses on pisco, original cocktails, and sunset conversation above the historic center.", "https://www.restaurantcusco.com/divinopiscobar/", "Daily 5:00 PM–12:00 AM; private tastings follow the official booking page.", "$$", "cocktail_bar", ["pisco", "quiet", "sunset"]),
  bar("fallen-angel", "Fallen Angel", [-13.515, -71.9767], "Bathtub tables, mirrored art, bold interiors, and playful cocktails make Fallen Angel part restaurant, part theatrical lounge.", "https://www.fallenangelincusco.com/", "Daily 6:00 PM–1:00 AM; dinner reservations follow the official booking page.", "$$$", "lounge", ["art", "theatrical", "reservation_recommended"]),
  bar("limbus", "Limbus Restobar", [-13.5128, -71.973], "A steep climb reaches sweeping red-roof views, pisco cocktails, food, and a crowded sunset terrace above San Blas.", "https://limbusrestobar.com/", "Daily 11:00 AM–11:30 PM; terrace use depends on weather and official reservations.", "$$$", "rooftop_bar", ["views", "sunset", "san_blas"]),
  bar("calle-medio", "Calle del Medio", [-13.5165, -71.9786], "Balcony views, polished pisco drinks, and contemporary Peruvian food create a grown-up pause above Plaza de Armas.", "https://www.cuscorestaurants.com/calle-del-medio/", "Daily 12:00 PM–11:00 PM; balcony tables follow official reservations.", "$$$", "cocktail_bar", ["balcony", "plaza_view", "food"]),
  bar("nuna-raymi", "Nuna Raymi", [-13.5167, -71.9794], "Andean botanicals, fruit, pisco, and a broad regional menu make cocktails approachable for mixed dinner-and-drinks groups.", "https://www.nunaraymi.com/", "Daily 11:00 AM–11:00 PM; official reservations control special events.", "$$", "cocktail_bar", ["andean_ingredients", "groups", "food"]),
  bar("viewhouse", "ViewHouse Restobar", [-13.5125, -71.9754], "A hillside terrace emphasizes sunset, city lights, pisco drinks, and relaxed table service over late club energy.", "https://www.instagram.com/viewhousecusco/", "Daily 12:00 PM–11:00 PM; terrace service depends on weather and official event notices.", "$$", "rooftop_bar", ["views", "sunset", "terrace"]),
  bar("uru", "URU Bar", [-13.5147, -71.9767], "Palacio Nazarenas gives local botanicals and precise hotel service a calm courtyard setting for expensive, conversation-friendly drinks.", "https://www.belmond.com/hotels/south-america/peru/cusco/belmond-palacio-nazarenas/dining", "Daily 12:00 PM–11:00 PM; hotel events follow the official dining calendar.", "$$$", "lounge", ["hotel_bar", "quiet", "courtyard"]),
];

const cultureStops = [
  culture("saqsaywaman", "Saqsaywaman", [-13.5093, -71.9825], "Cyclopean limestone walls, terraces, and a broad ceremonial field reveal Inca engineering on the ridge above Cusco.", "https://www.culturacusco.gob.pe/", "Daily 7:00 AM–5:30 PM; Inti Raymi and conservation closures follow DDC Cusco notices and the official tourist-ticket schedule.", "archaeological_site", ["inca", "stonework", "views"]),
  culture("qorikancha", "Qorikancha and Santo Domingo", [-13.5196, -71.9751], "Fine Inca stone walls survive beneath and beside a Spanish convent, making conquest and architectural adaptation visible in one complex.", "https://www.culturacusco.gob.pe/", "Monday–Saturday 8:30 AM–5:30 PM; Sunday 2:00 PM–5:00 PM; religious services may restrict tourist access.", "temple_convent", ["inca", "colonial", "architecture"]),
  culture("map", "Museo de Arte Precolombino", [-13.5152, -71.9768], "Carefully lit galleries isolate masterworks in ceramic, gold, silver, shell, wood, and stone from ancient Peruvian cultures.", "https://mapcusco.pe/visita-2/", "Daily 8:00 AM–10:00 PM; final admission follows the official ticket page.", "art_museum", ["pre_columbian", "late_hours", "central"]),
  culture("museo-inka", "Museo Inka", [-13.5152, -71.9772], "UNSAAC’s museum traces Andean societies into the Inca period through ceramics, metalwork, textiles, mummies, and a colonial mansion.", "https://museo.unsaac.edu.pe/", "Monday–Friday 8:00 AM–6:00 PM; Saturday 9:00 AM–4:00 PM; closed Sunday.", "history_museum", ["inca", "university", "collections"]),
  culture("regional", "Museo Histórico Regional Casa del Inka Garcilaso", [-13.5176, -71.9806], "Garcilaso de la Vega’s house presents regional archaeology, colonial history, ethnography, and the writer’s cross-cultural legacy.", "https://museogarcilaso.culturacusco.gob.pe/english/visita.php", "Daily and holidays 8:00 AM–5:00 PM; final admission 30 minutes before closing.", "regional_museum", ["history", "garcilaso", "tourist_ticket"]),
  culture("cathedral", "Cusco Cathedral", [-13.5163, -71.9783], "The cathedral complex holds Cusco School paintings, carved choir stalls, silverwork, chapels, and the famous Andean Last Supper.", "https://www.catedraldelcusco.com/", "Monday–Saturday tourist visits 10:00 AM–6:00 PM; Sunday tourist access follows the official liturgical schedule.", "cathedral", ["cusco_school", "religious_art", "plaza"]),
  culture("casa-concha", "Museo Machupicchu Casa Concha", [-13.516, -71.9757], "Objects returned from Yale, excavation context, digital interpretation, and a colonial house connect Machu Picchu research to Cusco.", "https://museomachupicchu.com/", "Monday–Saturday 9:00 AM–5:00 PM; closed Sunday.", "archaeology_museum", ["machu_picchu", "research", "university"]),
  culture("cttc", "Centro de Textiles Tradicionales del Cusco", [-13.5195, -71.9746], "Weavers demonstrate backstrap techniques while the museum and shop explain regional patterns, natural dyes, and cooperative authorship.", "https://www.textilescusco.org/", "Monday–Saturday 8:00 AM–8:00 PM; Sunday 9:00 AM–5:00 PM.", "textile_center", ["weaving", "demonstrations", "fair_trade"]),
  culture("san-blas-temple", "Templo de San Blas", [-13.5143, -71.9734], "A modest parish church contains an extraordinarily intricate carved pulpit and Cusco School religious art above the city center.", "https://www.culturacusco.gob.pe/", "Monday–Saturday 8:00 AM–6:00 PM; Sunday access follows Mass and the official religious circuit schedule.", "church", ["woodcarving", "cusco_school", "san_blas"]),
  culture("popular-art", "Museo de Arte Popular", [-13.5185, -71.9788], "Masks, festival costumes, sculpture, pottery, and popular imagery foreground living regional traditions often eclipsed by Inca monuments.", "https://www.emufec.gob.pe/", "Monday–Saturday 9:00 AM–6:00 PM; Sunday 9:00 AM–1:00 PM; festival closures follow EMUFEC notices.", "folk_art_museum", ["folk_art", "festivals", "tourist_ticket"]),
];

const activityStops = [cultureStops[0], cultureStops[1], cultureStops[2], cultureStops[7],
  culture("san-pedro", "San Pedro Market Food Walk", [-13.5202, -71.9824], "A morning circuit through juice, bread, produce, soup, and medicinal-herb stalls introduces everyday Cusco before tour buses leave town.", "https://www.municusco.gob.pe/", "Market daily 6:00 AM–6:00 PM; guided tours follow the exact start times on their official booking calendar.", "market_walk", ["food", "market", "morning"]),
  culture("four-ruins", "Cusco Four Ruins Circuit", [-13.5067, -71.971], "Saqsaywaman, Q'enqo, Puka Pukara, and Tambomachay form a ridge route of masonry, ritual rock, military views, and water architecture.", "https://cosituc.gob.pe/", "Sites daily 7:00 AM–5:30 PM; admission and exceptional closures follow the official Boleto Turístico schedule.", "archaeological_route", ["inca", "hiking", "tourist_ticket"]),
  culture("planetarium", "Planetarium Cusco", [-13.4949, -71.986], "An evening program connects naked-eye constellations, Inca dark-cloud astronomy, storytelling, and telescope observation above city light.", "https://www.planetariumcusco.com/", "Daily evening program starts at 5:40 PM with scheduled transport; the official booking calendar and weather policy control telescope observation.", "astronomy", ["night", "guided", "weather_dependent"]),
  culture("cooking-class", "Cusco Culinary Cooking Class", [-13.5187, -71.9802], "Market ingredients become ceviche, lomo saltado, causa, and pisco sours through a practical small-group kitchen session.", "https://www.cuscoculinary.com/", "Classes run at the exact morning and afternoon start times shown on the official booking calendar.", "cooking_class", ["hands_on", "food", "booking_required"]),
  culture("inti-raymi", "Inti Raymi", [-13.5093, -71.9825], "Cusco’s June 24 Sun festival stages Quechua ceremony, music, and dance at Qorikancha, Plaza Mayor, and Saqsaywaman.", "https://www.emufec.gob.pe/", "Wednesday, June 24, 2026 performances begin at Qorikancha at 9:00 AM, continue at Plaza Mayor, and move to Saqsaywaman; exact ticket times follow the official EMUFEC program.", "festival", ["seasonal", "performance", "booking_required"]),
  culture("pisac", "Pisac Archaeological Park and Market", [-13.4097, -71.8467], "Terraces, hilltop masonry, tombs, and a valley market make Pisac a substantial Sacred Valley day trip rather than a souvenir stop.", "https://www.culturacusco.gob.pe/", "Archaeological park daily 7:00 AM–5:30 PM; market activity is strongest Sunday, Tuesday, and Thursday; official notices control closures.", "day_trip", ["sacred_valley", "market", "archaeology"]),
];

const broadSources = {
  food: [
    { name: "Cusco News - best restaurants 2026", url: "https://thecusco.com/news/best-restaurants-2026" },
    { name: "Cusco Spirit - restaurant guide 2026", url: "https://www.cusco-spirit.com/guides/best-restaurants-cusco/" },
    { name: "Peru Travel gastronomy", url: "https://www.peru.travel/gastronomy/en/" },
    mapsEditorial("Google Maps - Cusco food", "best restaurants cheap eats"),
  ],
  stay: [
    { name: "Visit Cusco lodging listings", url: "https://www.visitcusco.org/lodging-listings/" },
    { name: "Booking.com - Cusco", url: "https://www.booking.com/city/pe/cusco.html" },
    { name: "Hostelworld - Cusco", url: "https://www.hostelworld.com/hostels/Cusco/Peru" },
    mapsEditorial("Google Maps - Cusco lodging", "hotels hostels"),
  ],
  nightlife: [
    { name: "Open Travel Guide - Cusco nightlife 2026", url: "https://opentravelguide.com/peru/cusco/nightlife/" },
    { name: "Visit Cusco", url: "https://www.visitcusco.org/" },
    { name: "Cusco Pub Crawl", url: "https://www.cuscopubcrawl.com/" },
    mapsEditorial("Google Maps - Cusco nightlife", "best bars nightlife"),
  ],
  culture: [
    { name: "DDC Cusco official culture portal", url: "https://www.culturacusco.gob.pe/" },
    { name: "COSITUC tourist ticket", url: "https://cosituc.gob.pe/" },
    { name: "EMUFEC Cusco festivals", url: "https://www.emufec.gob.pe/" },
    { name: "UNESCO City of Cuzco", url: "https://whc.unesco.org/en/list/273/" },
    mapsEditorial("Google Maps - Cusco culture", "museums archaeological sites"),
  ],
};

const guides: PeruGuideInput[] = [
  { category: "Food", key: "best-restaurants", seoSlug: "best-restaurants", title: "Andean Produce, Courtyard Fire, and Cusco's Modern Kitchens", description: "Cusco’s strongest restaurants connect regional corn, potatoes, trout, alpaca, chicha, and clay-oven cooking with Nikkei, chifa, Mediterranean, and contemporary Peruvian technique. Altitude makes lighter first-night meals and measured tasting menus practical choices.", seoTitle: "Best Restaurants in Cusco", seoDescription: "Ten source-backed Cusco restaurants for Andean food, regional cooking, Nikkei, chifa, tasting menus, courtyards, and Plaza views.", stops: restaurants, editorialSources: broadSources.food },
  { category: "Food", key: "best-cheap-eats", seoSlug: "best-cheap-eats", title: "Market Soups, Picantería Tables, and Altitude-Friendly Meals", description: "Affordable Cusco eating is strongest at market counters, family kitchens, cafés, soup specialists, and craft-beer rooms with real food. The first day at 3,400 meters rewards broth, quinoa, and smaller plates over a heroic feast.", seoTitle: "Best Cheap Eats in Cusco", seoDescription: "Ten affordable Cusco stops for markets, soups, picantería cooking, cafés, organic plates, burgers, and local beer.", stops: cheapEats, editorialSources: broadSources.food },
  { category: "Stay", key: "best-hotels", seoSlug: "best-hotels", title: "Convent Courtyards, Oxygen Support, and San Blas Calm", description: "Cusco’s hotel strengths are architectural: former convents, colonial mansions, stone walls, art collections, and courtyards. Oxygen-enriched rooms, steep streets, spa access, and early-tour breakfasts matter more than abstract star ratings.", seoTitle: "Best Hotels in Cusco", seoDescription: "Ten Cusco hotels compared for historic architecture, courtyards, oxygen support, spas, San Blas access, and Plaza convenience.", stops: hotels, editorialSources: broadSources.stay },
  { category: "Stay", key: "best-hostels", seoSlug: "best-hostels", title: "Colonial Courtyards, Party Bars, and Quiet Beds above Cusco", description: "These hostel-only stays make their social posture clear: some build the night around a bar, while others offer privacy curtains, kitchens, gardens, and earlier sleep. Hill position and luggage storage matter for tour departures.", seoTitle: "Best Hostels in Cusco", seoDescription: "Ten Cusco hostels with social bars, quiet courtyards, privacy dorms, gardens, views, luggage storage, and direct booking evidence.", stops: hostels, editorialSources: broadSources.stay },
  { category: "Nightlife", key: "best-casual-bars", seoSlug: "best-dive-bars", title: "High-Altitude Pubs, Andean Rock, and Cusco after Dark", description: "Cusco’s casual nightlife combines Plaza balconies, craft-beer taps, small live rooms, salsa lessons, and tourist-heavy clubs. The best choice depends on whether tomorrow begins with a dawn pickup or a slow breakfast.", seoTitle: "Best Dive Bars and Casual Pubs in Cusco", seoDescription: "Ten source-backed Cusco pubs, craft-beer bars, live-music rooms, salsa venues, and casual late-night stops.", stops: casualBars, editorialSources: broadSources.nightlife },
  { category: "Nightlife", key: "best-cocktail-bars", seoSlug: "best-cocktail-bars", title: "Pisco Lessons, Andean Botanicals, and Rooftop Sunsets", description: "Cusco cocktail culture is strongest when it explains pisco, works with highland botanicals, or uses the city’s steep terrain for a real view. Reserve terraces at sunset and treat hostel bars as social rooms rather than quiet tastings.", seoTitle: "Best Cocktail Bars in Cusco", seoDescription: "Ten Cusco cocktail bars for pisco tastings, Andean botanicals, Plaza balconies, rooftops, hotel courtyards, and social drinks.", stops: cocktailBars, editorialSources: broadSources.nightlife },
  { category: "Culture", key: "best-culture", seoSlug: "best-culture", title: "Inca Masonry, Colonial Overlays, and Living Textile Knowledge", description: "Cusco’s cultural record survives in monumental stone, churches built over Inca foundations, pre-Columbian art, university collections, weaving cooperatives, and festival objects. Tourist-ticket rules and religious services shape access.", seoTitle: "Best Culture in Cusco", seoDescription: "Ten Cusco cultural sites covering Inca archaeology, colonial art, pre-Columbian collections, textiles, churches, and regional history.", stops: cultureStops, editorialSources: broadSources.culture },
  { category: "Activities", key: "best-things-to-do", seoSlug: "best-things-to-do", title: "Ten Ways to Read Cusco and the Sacred Valley Edge", description: "These experiences combine essential Inca and colonial sites with market food, weaving, astronomy, cooking, a four-site ridge route, Inti Raymi, and Pisac. Acclimatization, steep streets, weather, and ticket windows should set the pace.", seoTitle: "Best Things to Do in Cusco", seoDescription: "Ten source-backed Cusco experiences spanning Saqsaywaman, Qorikancha, museums, markets, textiles, astronomy, cooking, festivals, and Pisac.", stops: activityStops, editorialSources: broadSources.culture },
];

const photoCandidates: Record<string, string> = {
  cicciolina: "https://cicciolinacusco.com/imgs/og-home.jpg",
  yaku: "https://static.spotapps.co/website_images/ab_websites/573309_website_v1/video_poster.jpg",
  kushka: "https://static.wixstatic.com/media/27de75_97db7a5b1b5d4ada9b6c7ae15c9381ff~mv2.jpg",
  monasterio: "https://img.belmond.com/f_auto/t_3200_ar_4_5/photos/vsm/vsm-cam-legend01.jpg",
  "inkaterra-casona": "https://www.inkaterra.com/wp-content/uploads/2012/07/EXP_LC03_big.jpg",
  "manco-capac": "https://ananayhotels.com/wp-content/uploads/2026/01/slide-5-scaled.jpg",
  "casa-san-blas": "https://www.casasanblas.com/images/2024/12/casasanblas-2025-cusco-hotel-boutique.jpg",
  pariwana: "https://pariwana-hostel.com/webmedia/filer_public/ce/8f/ce8f3c75-03dc-484f-909a-db79a0a1eb62/11_bar_and_restaurant.webp",
  "wild-rover": "https://wildroverhostels.com/wp-content/uploads/2023/01/My-project-1-5-scaled.jpg",
  loki: "https://www.lokihostel.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6Mjc4NywicHVyIjoiYmxvYl9pZCJ9fQ==--2a6a234fc2b264324565e95f0242933529900111/LRM_20250312_132733.jpg",
  "black-llama": "https://www.blackllamahostels.com/videos/hero-poster-mobile.webp",
  "nao-victoria": "https://cdn.shopify.com/s/files/1/0419/1118/9653/files/NVYT_652a00da-467a-4c5a-a4e3-bc8938205fc6.png?v=1625053778",
  "cerveceria-valle": "https://cerveceriadelvalle.com/assets/images/horizontales-mesa-de-trabajo-1-copia-2-2576x1449.png",
  "museo-pisco": "https://museodelpisco.org/wp-content/uploads/2020/11/slide-1.jpg",
  divino: "https://www.restaurantcusco.com/divinopiscobar/wp-content/uploads/sites/3/2021/07/IMG_7226-min-scaled.jpg",
  map: "https://mapcusco.pe/wp-content/uploads/2018/07/visita-nuevo-3.jpg",
  regional: "https://museogarcilaso.culturacusco.gob.pe/english/images/visita/header.jpg",
  "casa-concha": "https://static.wixstatic.com/media/b8ee36_8122ff2049ab429896576951711fe510.jpg",
  cttc: "https://www.textilescusco.org/assets-web/img/0855db747aa3add6ea7b653fc0aaf85e.png",
  "four-ruins": "https://imagentravel.com/wp-content/uploads/2021/01/cuscoitravel-tour-operator-slider001.jpg",
  planetarium: "https://planetariumcusco.com/images/2025/12/Planetarium-Science-heritage.jpg",
  "cooking-class": "https://www.cuscoculinary.com/Recursos/Imagenes/Banner/Cusco_Culinario-162.JPG",
  "inti-raymi": "https://www.emufec.gob.pe/wp-content/uploads/IMG_4053-scaled.jpg",
  chicha: "https://www.salkantaytrekking.com/blog/wp-content/uploads/2021/02/Chicha-Restaurant-1024x576.jpg",
  limo: "https://ak-d.tripcdn.com/images/0105112000e13wy09DB7F_D_750_520_Q90.jpg?proc=autoorient",
  "map-cafe": "https://afar.brightspotcdn.com/dims4/default/2385caf/2147483647/strip/true/crop/800x400%2B0%2B50/resize/1440x720%21/quality/90/?url=https%3A%2F%2Fk3-prod-afar-media.s3.us-west-2.amazonaws.com%2Fbrightspot%2F09%2F71%2Ffb02d7f31523499287a32cba765b%2Foriginal-14-20map-20cafe-cc-81-20cortesi-cc-81as-20map.jpg",
  uchu: "https://dljlypekpjltljkzchal.supabase.co/storage/v1/object/public/blog-gallery/1736226990387.jpeg",
  morena: "https://tcdn.mindtrip.ai/images/88803/qvv814.png",
  pachapapa: "https://tcdn.mindtrip.ai/images/354579/2m1tb9.png",
  kion: "https://www.salkantaytrekking.com/blog/wp-content/uploads/2021/02/kion-restaurant.jpg",
  greens: "https://resizer.otstatic.com/v2/photos/large/1/53150072.jpg",
  "san-pedro-market": "https://f.rpp-noticias.io/2017/01/17/3285661jpg.jpg?quality=80&width=860",
  "san-blas-market": "https://www.peru.travel/Contenido/Uploads/mercado-san-blas_637812296642767103.jpg",
  "la-chomba": "https://sudamericahoy.com/wp-content/uploads/2014/07/La-chomba-restaurante-cusco.jpg",
  organika: "https://www.machupicchutrek.net/wp-content/uploads/2022/09/organika-cusco.jpg",
  "mr-soup": "https://media.evendo.com/locations-resized/RestaurantImages/900x650/f3a94c8b-0bb5-453e-b736-e1d5568284a4",
  qura: "https://www.justchasingsunsets.com/wp-content/uploads/2018/04/Cusco-Cafe-1024x768.jpg",
  "jc-cafe": "https://cdn.kimkim.com/files/a/images/c6d8cc2389b049060d7ad1b958051be1fd004c33/big-9aff878a7e3279f5cb3000182c7c1f30.jpg",
  papachos: "https://www.theonlyperuguide.com/wp-content/uploads/2014/02/Papachos-Cusco-1.jpg",
  "cholos-grill": "https://img.restaurantguru.com/cd8b-Pub-and-bar-Cholos-Craft-Beers-beer.jpg",
  "palacio-nazarenas": "https://www.celebrity-hotels.com/assets/images/hotels/palacio-nazarenas-a-belmond-hotel-cusco.jpg",
  "jw-el-convento": "https://cache.marriott.com/content/dam/marriott-digital/jw/cala/hws/c/cuzmc/en_us/photo/unlimited/assets/cuzmc-exterior-0110.jpg",
  "palacio-del-inka": "https://www.boletomachupicchu.com/gutblt/wp-content/uploads/2023/05/hotel-palacio-del-inca.jpg",
  aranwa: "https://hotevia.info/wp-content/uploads/2021/02/Aranwa-Cusco-Boutique-Hotel-fachada.jpg",
  "antigua-casona": "https://y.cdrst.com/foto/hotel-sf/120373be/granderesp/foto-hotel-12036914.jpg",
  "el-mercado": "https://trans-americas.com/wp-content/uploads/2018/08/El-Mercado-hotel-cusco.jpg",
  "viajero-kokopelli": "https://hostelgeeks.com/wp-content/uploads/2023/03/Viajero-Kokopelli-Cusco-Hostel-Common-Space.jpg",
  supertramp: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/280165300.jpg?k=c60a4ec867ba44ee777032877311f656c85c8cdeb25813c1760e0fa633cfa410&o=",
  intro: "https://intro-hostels.cuzco-hotels.com/data/Pics/OriginalPhoto/16580/1658087/1658087527/pic-intro-hostels-cusco-cusco-2.JPEG",
  tucan: "https://a.hwstatic.com/image/upload/f_auto%2Cq_auto%2Ct_40/propertyimages/2/295474/fxdcwinopjhrxvozlv43.jpg",
  cuscopackers: "https://www.hostelscentral.com/pics/19414/filepict-1389934914.jpg",
  paddys: "https://www.cuscoenportada.com/wp-content/uploads/2017/06/Ambientes-Paddys1.jpg",
  "norton-rats": "https://photos.smugmug.com/Motorcycles/MotoRaidIII/MRIIIPeru/i-CsWHzS4/0/L/2017-03-06%2019.03.41-L.jpg",
  ukukus: "https://esa-cdn.carta.menu/storage/media/company_gallery/119999654/conversions/contribution_gallery.jpg",
  km0: "https://www.amautaspanish.com/blog/wp-content/uploads/2024/06/nightlife-cusco-bar-km0.jpg",
  chango: "https://www.amautaspanish.com/blog/wp-content/uploads/2024/06/nightlife-cusco-bar-chango-club.jpg",
  indigo: "https://static.toiimg.com/thumb/58046527/Indigo-Bar-Cusco.jpg?height=900&width=1200",
  "nuevo-mundo": "https://img.restaurantguru.com/r761-Nuevo-Mundo-Craft-Beer-Bar-Cusco-alcohol.jpg",
  mythology: "https://e.radio-grpp.io/large/2017/07/25/213421_451565.jpg",
  cholos: "https://img.restaurantguru.com/cd8b-Pub-and-bar-Cholos-Craft-Beers-beer.jpg",
  "republica-pisco": "https://img.p.mapq.st/?q=75&url=https%3A%2F%2Fmedia-cdn.tripadvisor.com%2Fmedia%2Fphoto-o%2F2c%2Ff4%2Ff3%2F2c%2Fy-tu-esta-listo-para.jpg%3Fw%3D3840",
  "fallen-angel": "https://www.peruforless.com/images/blog/Fallen-Angel.jpg",
  limbus: "https://feelingperu.com/wp-content/uploads/2019/09/Limbus.jpg",
  "calle-medio": "https://ak-d.tripcdn.com/images/0106l12000e13tyiz5905_D_750_520_Q90.jpg?proc=autoorient",
  "nuna-raymi": "https://img02.restaurantguru.com/ca20-Nuna-Raymi-Cusco-interior-4.jpg",
  viewhouse: "https://static.where-e.com/Peru/Cuzco_Region/Viewhouse-Resto-Bar_ed6608f6fe10da4cf09e7bbc885dc38c.jpg",
  uru: "https://img.belmond.com/f_auto/t_480x417/photos/naz/naz-din-bar-senzo06.jpg",
  saqsaywaman: "https://machupicchuwayna.com/wp-content/uploads/2025/05/sacsayhuaman-city-tour.jpg",
  qorikancha: "https://i.blogs.es/565182/1098404238_a3fd63ddee_z/original.jpg",
  "museo-inka": "https://hotelrojascusco.com/wp-content/uploads/2023/02/museo-inka_portada.jpg",
  cathedral: "https://www.kuodatravel.com/wp-content/uploads/2019/04/The-Cusco-School-What-It-Is-and-Where-to-Find-The-Art-It-Left-Behind.jpg",
  "san-blas-temple": "https://cocatambo.com/sites/default/files/templo-san-blas-cusco-cocatambo_0.webp",
  "popular-art": "https://1.bp.blogspot.com/-3NV_QEXtaA0/TwFDrzwNaNI/AAAAAAAAAeQ/GWq96Dc41vc/s1600/Casa%2BLuis%2BJer%25C3%25B3nimo%2Bde%2BCabrera%2BCusco%2B01.png",
  "san-pedro": "https://images.squarespace-cdn.com/content/5420a43fe4b0394ddbf79799/1449243504674-PKJGTWRJ63X0AUX68N5Z/Enjoying%2Bsoup%2B%28caldo%29%2Bin%2BSan%2BPedro%2Bmarket%2C%2BCusco?content-type=image%2Fjpeg&format=1000w",
  pisac: "https://www.tirawa.com/upload/blog/Recits%20de%20voyages/PE%20Exp%C3%A9%20trek%20mag%20CJ/14%20juin/Pisac-13.jpg",
};

export const cuscoCitywideGuides = buildPeruCityGuides({ city: "Cusco", cityId: "cusco", createdAt: "2026-08-10T00:00:00.000Z", checkedAt, guides, photoCandidates });
