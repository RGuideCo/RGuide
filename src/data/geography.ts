import { getCountryCode, getCountryData } from "countries-list";
import capitalCoordinates from "@/data/capital-coordinates.json";
import fetchedCityNeighborhoods from "@/data/city-neighborhoods.json";
import destinationImageFallbacks from "@/data/destination-image-fallbacks.json";
import worldCountries from "@/data/world-countries.json";
import { slugify } from "@/lib/utils";
import { City, Continent, Country, CountryState, RegionKind, SubArea } from "@/types";

type WorldCountrySeed = {
  id: string;
  name: string;
  continentId: string;
  continentName: string;
  coordinates: [number, number];
  bounds: [[number, number], [number, number]];
};

const countryDisplayNameById: Record<string, string> = {
  "republic-of-serbia": "Serbia",
};

const worldCountrySeeds = (worldCountries as unknown as WorldCountrySeed[]).map((country) => ({
  ...country,
  name: countryDisplayNameById[country.id] ?? country.name,
}));
const supplementalWorldCountrySeeds: WorldCountrySeed[] = [
  {
    id: "hong-kong",
    name: "Hong Kong",
    continentId: "asia",
    continentName: "Asia",
    coordinates: [22.3193, 114.1694],
    bounds: [
      [22.14, 113.82],
      [22.57, 114.43],
    ],
  },
  {
    id: "macau",
    name: "Macau",
    continentId: "asia",
    continentName: "Asia",
    coordinates: [22.1987, 113.5439],
    bounds: [
      [22.11, 113.52],
      [22.23, 113.6],
    ],
  },
  {
    id: "singapore",
    name: "Singapore",
    continentId: "asia",
    continentName: "Asia",
    coordinates: [1.3521, 103.8198],
    bounds: [
      [1.16, 103.6],
      [1.48, 104.1],
    ],
  },
];
const capitalFeatures = capitalCoordinates as unknown as Array<{
  geometry?: { coordinates?: [number, number] };
  properties?: { capital?: string; country?: string };
}>;

function normalizePlaceName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

const countryCapitalLookup = new Map(
  capitalFeatures
    .filter((feature) => feature.properties?.country && feature.properties?.capital)
    .map((feature) => [
      normalizePlaceName(feature.properties!.country!),
      {
        capital: feature.properties!.capital!,
        coordinates: feature.geometry?.coordinates,
      },
    ]),
);

const cityImageSlugAliases: Record<string, string> = {
  littlerock: "little-rock",
  losangeles: "los-angeles",
  sanfrancisco: "san-francisco",
  newhaven: "new-haven",
  desmoines: "des-moines",
  neworleans: "new-orleans",
  portlandmaine: "portland-maine",
  washingtondc: "washington-dc",
  jacksonms: "jackson-mississippi",
  stlouis: "st-louis",
  lasvegas: "las-vegas",
  manchesternh: "manchester-new-hampshire",
  oklahomacity: "oklahoma-city",
  portlandoregon: "portland-oregon",
  charlestonsc: "charleston-south-carolina",
  siouxfalls: "sioux-falls",
  saltlakecity: "salt-lake-city",
  charlestonwv: "charleston-west-virginia",
  sanantonio: "san-antonio",
  sandiego: "san-diego",
  mexicocity: "mexico-city",
  saopaulo: "sao-paulo",
  buenosaires: "buenos-aires",
  capetown: "cape-town",
  chiangmai: "chiang-mai",
  kualalumpur: "kuala-lumpur",
  hongkong: "hong-kong",
  nyc: "new-york-city",
  rio: "rio-de-janeiro",
};

const cityImageOverrides = destinationImageFallbacks as Record<string, string>;

const cityImage = (query: string) => {
  const normalizedQuery = slugify(query);
  const slug = cityImageSlugAliases[normalizedQuery] ?? normalizedQuery;

  return cityImageOverrides[slug] ?? `/api/destination-image/${slug}-v2`;
};

const topCityDescriptionOverrides = new Map<string, string>([
  [
    "paris",
    "Paris rewards the traveler who stops counting monuments and starts reading districts (arrondissements). Use the city by appetite and angle: the Louvre for scale, the Marais for old streets and late rooms, Saint-Germain for cafe ritual, and canal edges when the polished postcard needs air.",
  ],
  [
    "london",
    "London is not one city but a set of villages stitched together by rail, weather, and appetite. Build days around a line and a mood: Soho for the night's first spark, South Bank for river culture, Shoreditch for warehouse rooms, and a pub when the city gets too grand.",
  ],
  [
    "istanbul",
    "Istanbul is a city of crossings: water, empire, prayer, smoke, ferry decks, and dinner tables that stretch late. Let each day earn its movement: Sultanahmet for imperial weight, Karakoy for the edge, Kadikoy for appetite, and a meyhane when the day needs to end at a table instead of another monument.",
  ],
  [
    "rome",
    "Rome is stone, heat, appetite, and argument layered on top of empire. Give the monuments room, then let the city become human again: Monti for old streets, Trastevere for late tables, Testaccio for the stomach, and Prati when Vatican days need a softer landing.",
  ],
  [
    "milan",
    "Milan is a design and fashion city that does not try to charm you first; it makes you notice cut, surface, ritual, and work. Use it through neighborhood logic: Brera for galleries, Navigli for aperitivo, Porta Garibaldi for the new city, Quadrilatero for fashion, and dinner when the polish finally loosens.",
  ],
  [
    "florence",
    "Florence is a small city carrying an impossible amount of beauty: chapel light, stone streets, market stalls, leather shops, and Renaissance rooms that can overwhelm if you rush them. Give the art space, then let the city breathe through Oltrarno, aperitivo, a trattoria table, and a walk across the Arno after dark.",
  ],
  [
    "barcelona",
    "Barcelona is a city that rewards appetite but punishes autopilot. Mornings belong to Modernista facades and hill views, afternoons to market counters, shaded plazas, and the sea's pull, and nights to vermouth, natural wine, cava, and narrow rooms that fill quickly. Build it by neighborhood: Eixample for architecture and serious dining, Gracia for village rhythm, Poble-sec for tapas before the hill, and the Gothic Quarter only when you know where the old stones still lead somewhere real.",
  ],
  [
    "lisbon",
    "Lisbon is built on appetite and incline: tiled alleys, river glare, grilled fish, fado rooms, and viewpoints that make you earn the view. Plan it by climb and recovery: Alfama for old stone, Cais do Sodre for late movement, Belem for ceremony, and a wine bar when the hills win.",
  ],
  [
    "amsterdam",
    "Amsterdam is best seen at water level, where canal houses, brown cafes, bicycles, and museum crowds all reveal different versions of order. Balance the old center with Jordaan, De Pijp, Noord, and park time; the city gets better when you stop chasing the busiest bridge.",
  ],
  [
    "madrid",
    "Madrid is a city that keeps its best hours late. Mornings belong to museum light and quiet stone, afternoons to market counters and long lunches, and nights to vermouth, sherry, crowded plazas, and rooms that feel older than the conversation inside them. Build the trip by neighborhood, not by checklist: Retiro for air after the Prado, La Latina for tavern life, Chueca for stylish late energy, and Sol only when you know which old doors are still worth opening.",
  ],
  [
    "prague",
    "Prague is a compact river city where castle routes, old-town lanes, beer halls, cafes, design stays, galleries, and Vltava walks can crowd the same day. It works best when the busiest squares become a starting point, not the whole plan.",
  ],
  [
    "munich",
    "Munich is polished until the beer garden reminds you it still belongs to Bavaria. Use it by ritual: Altstadt for royal rooms, Glockenbach for a softer night out, Schwabing for cafes and galleries, the English Garden for air, and a beer hall when the city needs less restraint.",
  ],
  [
    "berlin",
    "Berlin is a city of scars, space, and late decisions. Split it by district: Mitte for memory, Kreuzberg for canals and counterweight, Charlottenburg for old-west polish, Friedrichshain when the night gets louder, and parks or lakes when the concrete needs a pulse.",
  ],
  [
    "new-york-city",
    "New York is hunger, speed, and neighborhood weather. Use it by borough and by appetite: Manhattan for vertical pressure, Brooklyn for long walks and dinner plans, Queens when food is the reason, Harlem for rhythm and history, and the ferry or park when the city needs distance.",
  ],
  [
    "miami",
    "Miami runs on heat, salt, cafecito, and the feeling that the night is always about to start. Use it by temperature: South Beach for spectacle, Little Havana for pulse, Wynwood for color and churn, Coconut Grove for shade, and the Everglades when the city needs to feel less certain.",
  ],
  [
    "los-angeles",
    "Los Angeles rewards discipline more than ambition. Pick a side of town and let it breathe: tacos before traffic, canyons before heat, Koreatown after dark, Venice when the ocean is the point, and a museum or studio stop only when the drive does not eat the day alive.",
  ],
  [
    "orlando",
    "Orlando is built around anticipation, but the trip gets better when the ticketed day is not the whole story. Use the parks with strategy, then let Winter Park, Mills 50, lakes, resort bars, and late group dinners give the city a life before and after the gates.",
  ],
  [
    "san-francisco",
    "San Francisco looks small until the hills start charging interest. Build it by slope and weather: the Mission for appetite, North Beach and Chinatown for old rooms, the Presidio for air, the ferry for perspective, and a bar or bakery when the fog makes the city feel private.",
  ],
  [
    "las-vegas",
    "Las Vegas is honest about appetite: money, spectacle, air-conditioning, late rooms, and the desert waiting outside the glass. Choose your version early: Strip ceremony, Downtown neon, Chinatown dinner, pool recovery, or Red Rock when the whole machine starts to feel too loud.",
  ],
  [
    "washington-dc",
    "Washington, DC can feel ceremonial until you leave the marble and find the neighborhoods doing the living. Use the Mall for scale, then move toward Shaw, Dupont, U Street, Georgetown, or Capitol Hill, where museums give way to restaurants, row houses, parks, and a less official pulse.",
  ],
  [
    "chicago",
    "Chicago is a city of lake wind, steel, brick, taverns, and neighborhoods that do not need to flatter you. Give the Loop its architecture, then get out for the meal: West Loop for polish, Logan Square for the night, Pilsen for color and masa, and the lakefront when the weather allows mercy.",
  ],
  [
    "boston",
    "Boston is compact, opinionated, and better when history is allowed to share the table with seafood, pubs, bookstores, campuses, and the harbor. Walk the old streets, then choose your edge: North End for dinner, Cambridge for brains and bars, Fenway for noise, and the water when the city tightens up.",
  ],
  [
    "honolulu",
    "Honolulu is not just the beach below the hotel balcony. It is plate lunch, surf light, palace history, Chinatown drinks, ridge hikes, and the constant negotiation between city time and island weather. Use Waikiki for ease, then earn the wider Oahu day with an early start and a realistic drive.",
  ],
  [
    "bangkok",
    "Bangkok is heat, incense, traffic, river light, and food smoke curling out before you know where it starts. Plan by energy, not ambition: temples early, Chinatown after dark, Sukhumvit when the night stretches, the river when traffic wins, and the arctic chill of a 7-Eleven when the city gets too hot to argue with.",
  ],
  [
    "hong-kong",
    "Hong Kong is a city of vertical pressure and sudden escape: roast meat windows, harbor crossings, wet markets, glass towers, ridge trails, and neon stacked into the same day. Move by ferry, tram, MTR, and appetite; the city works best when dinner, view, and elevation all argue with each other.",
  ],
  [
    "macau",
    "Macau is a compact resort-and-heritage city where Portuguese-Chinese streets, casino hotels, bakeries, food lanes, shows, temples, churches, and Cotai scale sit close together. It works best when old-city wandering is paired with clear resort or ferry logistics.",
  ],
  [
    "dubai",
    "Dubai is heat, glass, ambition, and desert always waiting beyond the skyline. Decide the trip before the city decides for you: Deira for trade and texture, Jumeirah for beach light, Downtown for height, the Marina for spectacle, and the desert when the gloss needs silence.",
  ],
  [
    "singapore",
    "Singapore is order with steam rising through it. Move between hawker centers, gardens, temples, malls, and cocktail rooms by heat and hunger: Chinatown for layers, Little India for color, Marina Bay for spectacle, and a food court when the city's precision needs soul.",
  ],
  [
    "taipei",
    "Taipei is a city of rain, scooters, night markets, mountain edges, temple smoke, and meals that happen in small, bright rooms. Use it by appetite and weather: Dadaocheng for old streets, Ximending for youth and neon, Da'an for cafes, and a night market when the day needs a louder ending.",
  ],
  [
    "kuala-lumpur",
    "Kuala Lumpur is a city of towers, rain heat, malls, mosques, and meals that move between Malay, Chinese, and Indian traditions. Explore it by shade and neighborhood: Bukit Bintang for the polished rush, Chinatown for market lanes, Kampung Baru for Malay cooking, and Batu Caves when the skyline needs a different kind of scale.",
  ],
  [
    "athens",
    "Athens is ancient stone with a loud modern city wrapped around it: ruins, rooftops, tavernas, galleries, and streets that hold the heat. Start with the Acropolis and Plaka, let Psyrri carry the night, then head for the coast when you need a fresh breeze, turquoise water, and space.",
  ],
  [
    "tokyo",
    "Tokyo is a rail-connected city of exact rituals and private worlds stacked in public view. Build it by neighborhood and timing: Ginza for polish, Shinjuku after dark, Ueno for museums and market energy, Ebisu for dinner, and Nakameguro or Daikanyama when the city needs to soften around the edges.",
  ],
  [
    "osaka",
    "Osaka is where Japan loosens its collar and orders another plate. Build it around food and proximity: Dotonbori for takoyaki and late neon, Kuromon for market grazing, Shinsekai for kushikatsu and old color, Umeda for vertical city life, and Namba when dinner should turn into another stop.",
  ],
  [
    "kyoto",
    "Kyoto is a city of restraint, ritual, and beauty that needs slower timing than its reputation suggests. Move carefully: Higashiyama for early stone lanes, Nishiki for appetite, Arashiyama when the day needs trees and distance, Gion at dusk, and one quiet garden where silence gets more time than the camera.",
  ],
  [
    "seoul",
    "Seoul moves fast, eats late, and rarely lets one mood hold the day. Build it by subway stop and hunger: Jongno for palaces, Hongdae for youth and noise, Itaewon for the night's mixed signals, Gangnam for polish, and barbecue when the city needs heat at the table.",
  ],
  [
    "sydney",
    "Sydney is a city built around water, but the trip only works when the harbor is more than a photograph. Use it by edge and appetite: Circular Quay for the icons, Surry Hills for dinner, Bondi for the beach ritual, Newtown for a rougher night out, and the ferry when the city needs to open up.",
  ],
  [
    "melbourne",
    "Melbourne is a city that reveals itself slowly, usually over coffee, weather, and a table you almost walked past. Use the center for lanes and bars, Fitzroy for the sharper edge, Carlton for Italian old bones, St Kilda when the bay matters, and dinner when the day turns inward.",
  ],
  [
    "dublin",
    "Dublin is a compact capital where the day gets better as it moves from books and brick into whiskey, music, and pub light. Start with Trinity, the Liffey, and Georgian squares, then let the route bend toward the Liberties, live rooms, and pubs where the conversation carries the night.",
  ],
  [
    "vienna",
    "Vienna carries itself like a city that knows the room is listening. Use the Ring for imperial scale, coffeehouses for pause, Naschmarkt for appetite, Leopoldstadt when the center gets too formal, and a wine tavern when the polish needs a little looseness.",
  ],
  [
    "venice",
    "Venice is history, beauty, and spectacle compressed onto water, which is why the crowds can feel as much a part of the city as the palaces. Use San Marco for ceremony, Cannaregio for breathing room, Rialto for market life, and cicchetti bars when the day needs to come back down to earth.",
  ],
  [
    "toronto",
    "Toronto is a city you explore in layers: lakefront light, museum days, long food corridors, sports noise, and neighborhoods that change the language of dinner block by block. Start central, then follow the city outward: Kensington for market energy, Ossington for dinner and bars, Yorkville for polish, and Scarborough when the meal should be the reason.",
  ],
  [
    "shanghai",
    "Shanghai is a city of speed and surface, but the older rhythm is still there if you give the lanes time. Start with the Bund for the full theatrical skyline, move through the Former French Concession for trees and long meals, Jing'an for polish, and Huangpu after dark when the river turns ambition into light.",
  ],
  [
    "copenhagen",
    "Copenhagen is a city where good taste becomes infrastructure: bikes, bakeries, harbor baths, candlelit dining rooms, and design that makes daily life feel edited. Explore Indre By for first bearings, Vesterbro for dinner, Norrebro for edge, Christianshavn for canals, and the harbor when the day needs air.",
  ],
  [
    "zurich",
    "Zurich is precise, expensive, and quietly dramatic: lake light, clean trams, old guild houses, galleries, chocolate, and mountains close enough to keep the city honest. Explore Altstadt for old stone, Kreis 4 for a sharper night, the lake for pause, and the hills when the polish needs air.",
  ],
  [
    "phuket",
    "Phuket is an island destination where beach bases, old-town food, resort stays, nightlife strips, boat trips, viewpoints, markets, and weather-season tradeoffs shape the plan. It works best when the chosen beach, transport, and day-trip rhythm match the trip style.",
  ],
  [
    "mecca",
    "Mecca is a pilgrimage-first city where mosque access, hotel proximity, crowd flow, shopping corridors, food courts, regional meals, and rest windows shape every practical choice. It works best when movement, prayer timing, group needs, and recovery are planned respectfully.",
  ],
  [
    "cancun",
    "Cancun is a resort-zone city where beaches, clubs, malls, seafood, hotel dining, cenotes, Isla Mujeres ferries, and Riviera Maya day routes compete for time. It works best when resort ease, downtown value, nightlife, and day-trip transport are separated clearly.",
  ],
  [
    "cusco",
    "Cusco is a high-altitude Andean base where Inca walls, colonial churches, markets, cafes, pisco rooms, boutique stays, and Sacred Valley or Machu Picchu logistics shape the trip. It works best with acclimatization, stairs, train timing, and slower first days.",
  ],
  [
    "mexico-city",
    "Mexico City is a layered high-altitude capital where markets, museums, taco routes, design hotels, cocktail bars, parks, and Roma, Condesa, Centro, and Coyoacan shape the trip. It works best when altitude, traffic, and neighborhood scale guide the day.",
  ],
  [
    "buenos-aires",
    "Buenos Aires is a late-night city of parrillas, cafes, bookstores, tango rooms, leafy barrios, markets, wine bars, and long dinners that rarely reward rushing. The strongest routes let Palermo, Recoleta, San Telmo, and La Boca carry different moods.",
  ],
  [
    "rio-de-janeiro",
    "Rio de Janeiro is a beach-and-mountain city where viewpoints, samba nights, boteco food, design stays, museum stops, and Copacabana, Ipanema, Santa Teresa, and Lapa shape the trip. It works best when weather, safety, and transport are part of the route.",
  ],
  [
    "lima",
    "Lima is a Pacific-cliff capital where ceviche, Nikkei and criollo food, museums, colonial streets, design hotels, Barranco nights, and coastal parks shape the trip. It works best when lunch is treated as an anchor and cliffside neighborhoods pace the day.",
  ],
  [
    "medellin",
    "Medellin is a valley city where spring weather, metro and cable-car routes, El Poblado dining, Laureles cafes, Comuna 13 context, nightlife, and mountain views define the trip. It works best when mobility, safety, and neighborhood energy guide each route.",
  ],
  [
    "quito",
    "Quito is a high-altitude Andean capital where churches, plazas, markets, museums, volcano views, boutique stays, chocolate stops, and equator or cloud-forest day routes shape the visit. It works best when altitude, weather, and safety guide the pacing.",
  ],
  [
    "antigua-guatemala",
    "Antigua Guatemala is a colonial-grid base where volcano views, courtyard hotels, coffee, markets, church ruins, Spanish-school rhythm, and Lake Atitlan or volcano routes shape the trip. It works best with cobblestone pacing, weather windows, and slow courtyard time.",
  ],
  [
    "bogota",
    "Bogota is a high-altitude capital where coffee, museums, markets, contemporary restaurants, Chapinero bars, La Candelaria history, and mountain views create culture-heavy routes. It works best when altitude, traffic, safety, and neighborhood choice are planned together.",
  ],
]);

function withTopCityDescription<T extends { id: string; description: string }>(city: T): T {
  const description = topCityDescriptionOverrides.get(city.id);
  return description ? { ...city, description } : city;
}

type NeighborhoodAngle = {
  identity: string;
  route: string;
};

function withTerminalPeriod(value: string) {
  const trimmed = value.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

const specificNeighborhoodAngles = new Map<string, NeighborhoodAngle>([
  [
    "berlin|mitte",
    {
      identity: "Berlin's museum-and-memory center, where Museum Island, Brandenburg Gate, courtyards, galleries, and government landmarks sit inside the city's most practical transit grid",
      route: "It works best as a culture-heavy base, with big landmarks handled early and quieter courtyards, restaurants, or Spree walks used to soften the day",
    },
  ],
  [
    "berlin|friedrichshain",
    {
      identity: "Berlin's eastside pressure point, where the East Side Gallery, RAW-Gelande, river paths, clubs, and late bars keep history and nightlife close together",
      route: "It works best when the route starts loose and ends late, leaving room for Spree-side walks, casual food, and plans that change after dark",
    },
  ],
  [
    "berlin|kreuzberg",
    {
      identity: "Berlin's canal-and-counterculture district, shaped by Turkish food, street art, market halls, bars, and a stubbornly independent day-to-night rhythm",
      route: "It works best on foot, moving from Kottbusser Tor and the Landwehr Canal toward dinner, drinks, and small stops that feel more local than polished",
    },
  ],
  [
    "berlin|neukolln",
    {
      identity: "Berlin's southside collision of immigrant food cultures, municipal art spaces, canal edges, crowded bars, and rooftops that turn the skyline into part of the night",
      route: "It works best from late afternoon onward, with one cultural anchor, food at street level, and enough flexibility to let the right bar or roof decide how late the district runs",
    },
  ],
  [
    "berlin|charlottenburg",
    {
      identity: "Berlin's polished westside district, with palace gardens, old cinemas, Kurfurstendamm shopping, classic hotels, and calmer streets than the eastern nightlife zones",
      route: "It works best for slower museum, shopping, and dinner days, especially when the trip needs elegance, transit ease, and a break from late-night Berlin",
    },
  ],
  [
    "berlin|prenzlauer berg",
    {
      identity: "Berlin's restored northside neighborhood, where leafy squares, weekend markets, cafes, family life, and old apartment blocks make the city feel gentler",
      route: "It works best as a slow morning or early-evening route, with Kollwitzplatz, Mauerpark, and low-key restaurants setting the pace instead of landmarks",
    },
  ],
  [
    "berlin|tiergarten",
    {
      identity: "Berlin's central green reset, bordered by the Reichstag, embassy quarter, Kulturforum, Victory Column, and long paths through the city's largest park",
      route: "It works best between heavier museum or memorial stops, giving the day space to breathe before crossing back into Mitte or the westside districts",
    },
  ],
  [
    "san francisco|mission district",
    {
      identity: "San Francisco's mural-lined food and nightlife district, where taquerias, bakeries, Dolores Park, vintage shops, and late bars keep the city at street level",
      route: "It works best as a day-to-night walk, with one clear food anchor and enough room for alleys, park time, and a slower second stop",
    },
  ],
  [
    "san francisco|north beach",
    {
      identity: "San Francisco's Italian-heritage and Beat-era pocket, packed with cafes, old bars, City Lights, Washington Square, and steep routes toward Telegraph Hill",
      route: "It works best in the evening, when dinner, drinks, bookstores, and hilltop views can sit close together without much transit",
    },
  ],
  [
    "san francisco|hayes valley",
    {
      identity: "San Francisco's compact design-and-dining corridor, where boutiques, cocktail rooms, performing-arts venues, and Patricia's Green make a polished central route",
      route: "It works best for a tight afternoon or pre-show plan, with shopping, dinner, and a nearby bar doing more work than sightseeing",
    },
  ],
  [
    "san francisco|marina district",
    {
      identity: "San Francisco's bay-facing social district, where Chestnut Street, Fort Mason, waterfront paths, and Golden Gate views give the city a breezier rhythm",
      route: "It works best when paired with a walk toward the Presidio or Crissy Field, then brought back to food, drinks, and easy neighborhood streets",
    },
  ],
  [
    "san francisco|sunset district",
    {
      identity: "San Francisco's foggy westside grid, where Ocean Beach, Golden Gate Park, Asian bakeries, casual restaurants, and surf-town edges stretch the city outward",
      route: "It works best as a slower outer-neighborhood route, built around park time, beach weather, and a few food stops worth crossing town for",
    },
  ],
  [
    "los angeles|downtown la",
    {
      identity: "LA's most vertical neighborhood, where old theaters, museums, rooftops, Arts District edges, food halls, and transit lines create a denser city route",
      route: "It works best with a tight cluster, using one cultural anchor and one food or drink stop instead of trying to cross too much of the basin",
    },
  ],
  [
    "los angeles|silver lake",
    {
      identity: "LA's hillside creative district, where reservoir walks, indie shops, coffee, music rooms, and neighborhood restaurants make the city feel smaller",
      route: "It works best by car-light hopping along Sunset and nearby side streets, with enough time for browsing, dinner, and a late drink",
    },
  ],
  [
    "los angeles|koreatown",
    {
      identity: "LA's dense late-night food district, where Korean barbecue, spas, karaoke rooms, cocktail bars, and apartment-block street life run deep into the night",
      route: "It works best as a meal-led evening, with parking or rideshare sorted early and a second stop chosen before the table clears",
    },
  ],
  [
    "los angeles|venice",
    {
      identity: "LA's beachside collision of boardwalk energy, canals, Abbot Kinney shopping, wellness stops, and sunset walks along the Pacific",
      route: "It works best when the day is allowed to drift, but anchored by one beach walk, one meal, and a realistic plan for traffic",
    },
  ],
  [
    "los angeles|west hollywood",
    {
      identity: "LA's design, hotel, and nightlife strip, where the Sunset Strip, Santa Monica Boulevard, galleries, clubs, and destination restaurants stay close together",
      route: "It works best after dark, with reservations or tickets doing the organizing and short rides replacing long cross-town moves",
    },
  ],
  [
    "miami|wynwood",
    {
      identity: "Miami's mural-and-warehouse district, where galleries, breweries, design shops, clubs, and restaurant patios turn short blocks into a high-energy route",
      route: "It works best from late afternoon into night, with art handled early and food or drinks chosen before the crowds thicken",
    },
  ],
  [
    "miami|little havana",
    {
      identity: "Miami's Cuban cultural corridor, centered on Calle Ocho, ventanitas, domino tables, music rooms, cigar shops, and old-school cafes",
      route: "It works best as a food-and-culture walk, using a few specific counters, music stops, and side streets instead of treating it as a quick photo stop",
    },
  ],
  [
    "miami|coconut grove",
    {
      identity: "Miami's leafy bayfront village, where marina views, old tropical streets, cafes, gardens, and relaxed restaurants soften the city's harder edges",
      route: "It works best as a slower daytime route, with shade, waterfront time, and a meal carrying more weight than a checklist",
    },
  ],
  [
    "miami|brickell",
    {
      identity: "Miami's glossy high-rise district, where hotel bars, rooftop rooms, finance towers, river views, and fast dining make the city feel polished and vertical",
      route: "It works best for a compact night out or business-travel base, with views, dinner, and drinks kept within a few blocks",
    },
  ],
  [
    "miami|design district",
    {
      identity: "Miami's luxury design pocket, where fashion houses, galleries, public art, architecture, and polished restaurants make browsing feel curated",
      route: "It works best as a controlled afternoon, pairing shops and art with one strong meal instead of stretching the route too wide",
    },
  ],
  [
    "washington dc|georgetown",
    {
      identity: "DC's historic river-and-campus district, where brick sidewalks, rowhouses, canal paths, boutiques, and waterfront restaurants make the city feel older",
      route: "It works best on foot, with shopping or campus walks balanced by a canal, river, or dinner anchor",
    },
  ],
  [
    "washington dc|dupont circle",
    {
      identity: "DC's embassy-and-townhouse hub, where bookstores, galleries, cafes, hotels, and the circle itself create an easy central base",
      route: "It works best as a flexible route between museums, dinner, and drinks, especially when the day needs transit ease without feeling sterile",
    },
  ],
  [
    "washington dc|shaw",
    {
      identity: "DC's music-and-restaurant corridor, where U Street edges, historic theaters, cocktail bars, and rowhouse blocks carry strong night energy",
      route: "It works best after late afternoon, with one food anchor and enough time for music, drinks, or a short walk into nearby neighborhoods",
    },
  ],
  [
    "washington dc|adams morgan",
    {
      identity: "DC's steep, messy, late-running neighborhood, where global restaurants, bars, music rooms, and old apartment blocks keep the route lively",
      route: "It works best as an evening plan, with dinner first and room for a second stop once the street wakes up",
    },
  ],
  [
    "washington dc|capitol hill",
    {
      identity: "DC's civic-and-residential district, where the Capitol, Eastern Market, rowhouses, parks, and neighborhood restaurants sit in a calmer grid",
      route: "It works best as a morning or early evening walk, with market time or a meal softening the monument-heavy side of the city",
    },
  ],
  [
    "seattle|capitol hill",
    {
      identity: "Seattle's densest food, bar, and music neighborhood, where indie venues, queer nightlife, coffee, restaurants, and Volunteer Park shape the route",
      route: "It works best from late afternoon onward, using one meal or venue as the anchor and letting nearby bars or shops fill the gaps",
    },
  ],
  [
    "seattle|belltown",
    {
      identity: "Seattle's hotel-and-nightlife corridor, where bars, music rooms, restaurants, waterfront access, and downtown edges keep plans compact",
      route: "It works best as a central evening base, with dinner, drinks, and a waterfront or Pike Place detour kept close together",
    },
  ],
  [
    "seattle|ballard",
    {
      identity: "Seattle's maritime northside neighborhood, where breweries, Nordic history, music rooms, restaurants, and the locks give it a slower local pull",
      route: "It works best as a half-day route, moving from shops and food toward sunset water views or a low-key night out",
    },
  ],
  [
    "seattle|fremont",
    {
      identity: "Seattle's offbeat canal-side pocket, where public art, vintage shops, breweries, tech offices, and bridge views keep the mood informal",
      route: "It works best as a casual daytime-to-evening route, with browsing, beer, and a short walk doing most of the work",
    },
  ],
  [
    "seattle|pioneer square",
    {
      identity: "Seattle's oldest district, where brick warehouses, galleries, stadium crowds, underground-history tours, and cocktail bars create a rougher downtown texture",
      route: "It works best around an event, gallery stop, or early drink, with timing used carefully so the route feels intentional",
    },
  ],
  [
    "tokyo|shibuya",
    {
      identity: "Tokyo's high-volume youth and shopping district, where crossings, department stores, music bars, ramen counters, and backstreets keep the pace fast",
      route: "It works best after lunch into night, with one shopping or food anchor keeping the density from turning into pure drift",
    },
  ],
  [
    "tokyo|shinjuku",
    {
      identity: "Tokyo's vertical entertainment and transit machine, where neon alleys, department stores, hotel bars, gardens, and late food sit above one of the world's busiest stations",
      route: "It works best when split by mood: calm garden or shopping first, then a tighter evening route through food and drinks",
    },
  ],
  [
    "tokyo|ginza",
    {
      identity: "Tokyo's polished shopping and dining grid, where flagship stores, department basements, galleries, cocktail bars, and classic restaurants make luxury feel precise",
      route: "It works best as a controlled afternoon or evening, with browsing, one reservation, and nearby drinks carrying the plan",
    },
  ],
  [
    "tokyo|asakusa",
    {
      identity: "Tokyo's old-town visitor district, where Senso-ji, market streets, river views, and snack counters keep traditional city rhythms visible",
      route: "It works best early or near dusk, with temple time balanced by food streets and a short walk toward the Sumida",
    },
  ],
  [
    "tokyo|roppongi",
    {
      identity: "Tokyo's art, hotel, and nightlife district, where Mori Art Museum, design stops, embassies, restaurants, and late bars share the same hills",
      route: "It works best as an evening route, with museum or view time leading into dinner and a selective late-night plan",
    },
  ],
  [
    "boston|back bay",
    {
      identity: "Boston's brownstone-and-boulevard district, where Newbury Street, the Public Garden, Copley Square, hotels, and polished restaurants form a classic central route",
      route: "It works best as an easy walking base, with shopping, architecture, and dinner kept close instead of overloading the day",
    },
  ],
  [
    "boston|beacon hill",
    {
      identity: "Boston's steep historic pocket, where brick sidewalks, gas lamps, Acorn Street, State House views, and quiet residential lanes carry the atmosphere",
      route: "It works best as a short, careful walk, paired with the Common, a museum, or dinner nearby so it does not become just a photo detour",
    },
  ],
  [
    "boston|north end",
    {
      identity: "Boston's Italian-heritage and Revolutionary-history district, where pastry lines, red-sauce rooms, old churches, and harbor edges pack into tight streets",
      route: "It works best when dinner or a history stop is the anchor, leaving time for a slow walk rather than a rushed food crawl",
    },
  ],
  [
    "boston|south end",
    {
      identity: "Boston's restaurant-rich rowhouse district, where Victorian streets, galleries, wine bars, and pocket parks make a quieter counterpoint to the core",
      route: "It works best at dinner hour, with one reservation and enough walking time to let the streets do the atmospheric work",
    },
  ],
  [
    "boston|seaport district",
    {
      identity: "Boston's newer waterfront district, where harbor paths, glass towers, seafood rooms, event venues, and design hotels give the city a modern edge",
      route: "It works best when the weather cooperates, pairing a harbor walk with one restaurant, museum, or concert anchor",
    },
  ],
  [
    "milan|brera",
    {
      identity: "Milan's artful old-center quarter, where galleries, the Pinacoteca, boutiques, courtyards, aperitivo spots, and narrow streets keep the route elegant",
      route: "It works best as a late-afternoon route, with browsing and art sliding naturally into aperitivo or dinner nearby",
    },
  ],
  [
    "milan|navigli",
    {
      identity: "Milan's canal-side social district, where aperitivo terraces, vintage shops, restaurants, and late bars make the city loosen after work",
      route: "It works best in the evening, with canal walks and drinks timed before the busiest dinner stretch",
    },
  ],
  [
    "milan|porta venezia",
    {
      identity: "Milan's diverse eastside district, where Liberty architecture, gardens, queer nightlife, global food, and shopping corridors sit close together",
      route: "It works best as a flexible route between park time, dinner, and drinks, especially when the center feels too polished",
    },
  ],
  [
    "milan|isola",
    {
      identity: "Milan's northside design pocket, where new towers, old neighborhood streets, music rooms, restaurants, and creative studios meet around Garibaldi",
      route: "It works best from afternoon into night, with architecture views balanced by smaller food and bar stops",
    },
  ],
  [
    "milan|quadrilatero doro",
    {
      identity: "Milan's luxury fashion grid, where Via Montenapoleone, showrooms, historic palazzi, cafes, and high-end hotels turn shopping into the main architecture",
      route: "It works best as a precise browse, paired with one cafe, design stop, or nearby museum rather than a long wandering route",
    },
  ],
  [
    "vienna|innere stadt",
    {
      identity: "Vienna's imperial first district, where palaces, churches, museums, cafes, and shopping streets form the city's most concentrated historic loop",
      route: "It works best early or late, with one major cultural anchor and enough cafe time to keep the grandeur from feeling mechanical",
    },
  ],
  [
    "vienna|leopoldstadt",
    {
      identity: "Vienna's island district, where Prater park, canals, markets, Jewish history, and newer food scenes give the city a looser eastern edge",
      route: "It works best as a park-and-neighborhood route, especially when the center needs more air and less formality",
    },
  ],
  [
    "vienna|neubau",
    {
      identity: "Vienna's design-forward seventh district, where MuseumsQuartier edges, indie shops, cafes, bars, and small galleries make the city feel younger",
      route: "It works best from afternoon into evening, with browsing, museum time, and dinner kept within a tight grid",
    },
  ],
  [
    "vienna|mariahilf",
    {
      identity: "Vienna's shopping-and-side-street district, where Mariahilfer Strasse, courtyards, cafes, theaters, and Naschmarkt edges keep plans practical",
      route: "It works best as a flexible central route, using shopping or food as the anchor instead of chasing landmarks",
    },
  ],
  [
    "vienna|wieden",
    {
      identity: "Vienna's elegant fourth district, where Karlskirche, galleries, cafes, university edges, and quiet residential streets sit just below the Ring",
      route: "It works best as a calmer culture route, paired with Belvedere, Naschmarkt, or a nearby dinner",
    },
  ],
]);

const neighborhoodNameAngles = new Map<string, NeighborhoodAngle>([
  [
    "downtown",
    {
      identity: "the practical center, where transit, hotels, offices, landmark streets, and first-time routes tend to concentrate",
      route: "It works best as a base layer for the city, useful for orientation before the route branches into more specific food, culture, or nightlife districts",
    },
  ],
  [
    "old city",
    {
      identity: "the historic core, where older streets, landmark buildings, visitor routes, and compact cultural stops carry most of the first-pass context",
      route: "It works best on foot, with the main sights treated as a spine and meals or quieter side streets keeping the route from feeling dutiful",
    },
  ],
  [
    "museum district",
    {
      identity: "the culture-heavy district, where major institutions, broad civic streets, hotels, and slower daytime routes give the city an easy museum spine",
      route: "It works best when the day is paced around one or two anchors, leaving room for nearby food, parks, and short walks between stops",
    },
  ],
  [
    "arts district",
    {
      identity: "the creative district, where galleries, converted spaces, murals, studios, bars, and restaurants make the city feel more street-level",
      route: "It works best in the late afternoon into evening, when browsing, dinner, and drinks can sit close together without too much transit",
    },
  ],
  [
    "chinatown",
    {
      identity: "the food-and-market district, where restaurants, bakeries, groceries, late meals, and dense street life make the city feel more immediate",
      route: "It works best as a meal-led route, with a few specific counters or rooms chosen before wandering the surrounding blocks",
    },
  ],
  [
    "little italy",
    {
      identity: "the dining-forward district, where old immigrant identity, patios, bakeries, restaurants, and evening foot traffic give the neighborhood an easy social rhythm",
      route: "It works best when dinner is the anchor, with enough time on either side for coffee, drinks, waterfront walks, or nearby city-center stops",
    },
  ],
  [
    "west end",
    {
      identity: "the theater-and-nightlife district, where showtimes, restaurants, bars, hotels, and busy central streets shape the neighborhood's rhythm",
      route: "It works best when plans are timed around an evening anchor, leaving the afternoon for shopping, galleries, or a slower meal nearby",
    },
  ],
  [
    "soho",
    {
      identity: "the compact entertainment district, where dining rooms, bars, shops, theaters, and late foot traffic make the city feel dense and social",
      route: "It works best as an evening route, with a few reservations or saved bars keeping the energy focused instead of turning into aimless wandering",
    },
  ],
]);

const citySubareaSeeds = new Map<string, SubArea[]>([
  [
    "New York City|United States",
    [
      {
        id: "manhattan",
        name: "Manhattan",
        coordinates: [40.7831, -73.9712],
        subareas: [
          { id: "upper-east-side", name: "Upper East Side", coordinates: [40.7736, -73.9566] },
          { id: "greenwich-village", name: "Greenwich Village", coordinates: [40.7336, -74.0027] },
          { id: "soho", name: "SoHo", coordinates: [40.7233, -74.003] },
          { id: "lower-east-side", name: "Lower East Side", coordinates: [40.715, -73.9843] },
          { id: "harlem", name: "Harlem", coordinates: [40.8116, -73.9465] },
        ],
      },
      {
        id: "brooklyn",
        name: "Brooklyn",
        coordinates: [40.6782, -73.9442],
        subareas: [
          {
            id: "williamsburg",
            name: "Williamsburg",
            coordinates: [40.7081, -73.9571],
            description:
              "Brooklyn's best-known creative hub, packed with destination dining, nightlife, shopping, and East River skyline views.",
          },
          {
            id: "dumbo",
            name: "DUMBO",
            coordinates: [40.7033, -73.9881],
            description:
              "A waterfront district of cobblestone streets, converted warehouses, and some of New York's most iconic bridge and skyline views.",
          },
          {
            id: "brooklyn-heights",
            name: "Brooklyn Heights",
            coordinates: [40.6959, -73.9956],
            description:
              "Elegant brownstones, quiet tree-lined streets, and the Brooklyn Heights Promenade make this one of the borough's classic stroll neighborhoods.",
          },
          {
            id: "park-slope",
            name: "Park Slope",
            coordinates: [40.672, -73.9773],
            description:
              "A brownstone-heavy neighborhood next to Prospect Park, known for relaxed cafes, strong dining, and a polished local feel.",
          },
          {
            id: "greenpoint",
            name: "Greenpoint",
            coordinates: [40.7245, -73.9419],
            description:
              "A North Brooklyn neighborhood where Polish roots, low-key cool, waterfront views, and strong food and bar scenes all overlap.",
          },
        ],
      },
      {
        id: "queens",
        name: "Queens",
        coordinates: [40.7282, -73.7949],
        subareas: [
          { id: "astoria", name: "Astoria", coordinates: [40.7644, -73.9235] },
          { id: "long-island-city", name: "Long Island City", coordinates: [40.7447, -73.9485] },
          { id: "flushing", name: "Flushing", coordinates: [40.7654, -73.8174] },
          { id: "jackson-heights", name: "Jackson Heights", coordinates: [40.7557, -73.8831] },
          { id: "forest-hills", name: "Forest Hills", coordinates: [40.7181, -73.8448] },
        ],
      },
      {
        id: "bronx",
        name: "The Bronx",
        coordinates: [40.8448, -73.8648],
        subareas: [
          { id: "mott-haven", name: "Mott Haven", coordinates: [40.8091, -73.9229] },
          { id: "belmont", name: "Belmont", coordinates: [40.8579, -73.887] },
          { id: "riverdale", name: "Riverdale", coordinates: [40.9006, -73.9068] },
          { id: "fordham", name: "Fordham", coordinates: [40.8615, -73.8905] },
          { id: "south-bronx", name: "South Bronx", coordinates: [40.8163, -73.9179] },
        ],
      },
      {
        id: "staten-island",
        name: "Staten Island",
        coordinates: [40.5795, -74.1502],
        subareas: [
          { id: "st-george", name: "St. George", coordinates: [40.6443, -74.0779] },
          { id: "tompkinsville", name: "Tompkinsville", coordinates: [40.6365, -74.0751] },
          { id: "great-kills", name: "Great Kills", coordinates: [40.5543, -74.1515] },
          { id: "stapleton", name: "Stapleton", coordinates: [40.6273, -74.0723] },
          { id: "tottenville", name: "Tottenville", coordinates: [40.512, -74.2518] },
        ],
      },
    ],
  ],
  [
    "Los Angeles|United States",
    [
      { id: "downtown-la", name: "Downtown LA", coordinates: [34.0407, -118.2468] },
      { id: "silver-lake", name: "Silver Lake", coordinates: [34.086, -118.2707] },
      { id: "koreatown", name: "Koreatown", coordinates: [34.0617, -118.3068] },
      { id: "venice", name: "Venice", coordinates: [33.985, -118.4695] },
      { id: "west-hollywood", name: "West Hollywood", coordinates: [34.0903, -118.3617] },
    ],
  ],
  [
    "Chicago|United States",
    [
      {
        id: "the-loop",
        name: "The Loop",
        coordinates: [41.8837, -87.6325],
        description:
          "Chicago's downtown core, anchored by river architecture, major transit links, and dense cultural institutions.",
      },
      {
        id: "lincoln-park",
        name: "Lincoln Park",
        coordinates: [41.9214, -87.6513],
        description:
          "A northside favorite known for lakefront access, brownstone-lined streets, parks, and polished food-and-bar clusters.",
      },
      {
        id: "wicker-park",
        name: "Wicker Park",
        coordinates: [41.9088, -87.6796],
        description:
          "A trend-forward neighborhood with strong nightlife, indie retail, and a steady mix of local coffee, music, and dining spots.",
      },
      {
        id: "pilsen",
        name: "Pilsen",
        coordinates: [41.8575, -87.6568],
        description:
          "A culturally rich neighborhood known for mural-lined streets, Mexican heritage, destination food, and creative spaces.",
      },
      {
        id: "hyde-park",
        name: "Hyde Park",
        coordinates: [41.7943, -87.5907],
        description:
          "A lakefront South Side district with university energy, historic architecture, museums, and quieter residential blocks.",
      },
    ],
  ],
  [
    "Houston|United States",
    [
      { id: "montrose", name: "Montrose", coordinates: [29.7489, -95.3909] },
      { id: "the-heights", name: "The Heights", coordinates: [29.7983, -95.3988] },
      { id: "midtown", name: "Midtown", coordinates: [29.7364, -95.3761] },
      { id: "museum-district", name: "Museum District", coordinates: [29.7258, -95.3907] },
      { id: "eado", name: "EaDo", coordinates: [29.7493, -95.3534] },
    ],
  ],
  [
    "Phoenix|United States",
    [
      { id: "roosevelt-row", name: "Roosevelt Row", coordinates: [33.4587, -112.069] },
      { id: "arcadia", name: "Arcadia", coordinates: [33.4942, -111.9834] },
      { id: "melrose-district", name: "Melrose District", coordinates: [33.5096, -112.0881] },
      { id: "biltmore", name: "Biltmore", coordinates: [33.5091, -112.0306] },
      { id: "uptown", name: "Uptown", coordinates: [33.5337, -112.073] },
    ],
  ],
  [
    "Philadelphia|United States",
    [
      { id: "rittenhouse-square", name: "Rittenhouse Square", coordinates: [39.9489, -75.1719] },
      { id: "fishtown", name: "Fishtown", coordinates: [39.969, -75.1336] },
      { id: "old-city", name: "Old City", coordinates: [39.9526, -75.1438] },
      { id: "midtown-village", name: "Midtown Village", coordinates: [39.9474, -75.1637] },
      { id: "washington-square-west", name: "Washington Square West", coordinates: [39.9444, -75.1559] },
    ],
  ],
  [
    "San Antonio|United States",
    [
      { id: "downtown-river-walk", name: "Downtown River Walk", coordinates: [29.4246, -98.4936] },
      { id: "pearl", name: "Pearl", coordinates: [29.4425, -98.4798] },
      { id: "southtown", name: "Southtown", coordinates: [29.4092, -98.4958] },
      { id: "king-william", name: "King William", coordinates: [29.4148, -98.4931] },
      { id: "market-square", name: "Market Square", coordinates: [29.4242, -98.5002] },
    ],
  ],
  [
    "San Diego|United States",
    [
      { id: "little-italy", name: "Little Italy", coordinates: [32.7234, -117.1687] },
      { id: "north-park", name: "North Park", coordinates: [32.7412, -117.1294] },
      { id: "la-jolla", name: "La Jolla", coordinates: [32.8328, -117.2713] },
      { id: "pacific-beach", name: "Pacific Beach", coordinates: [32.7978, -117.2536] },
      { id: "ocean-beach", name: "Ocean Beach", coordinates: [32.7484, -117.2451] },
    ],
  ],
  [
    "Dallas|United States",
    [
      { id: "deep-ellum", name: "Deep Ellum", coordinates: [32.7843, -96.7816] },
      { id: "uptown", name: "Uptown", coordinates: [32.7973, -96.8016] },
      { id: "bishop-arts-district", name: "Bishop Arts District", coordinates: [32.7493, -96.8276] },
      { id: "lower-greenville", name: "Lower Greenville", coordinates: [32.8169, -96.7697] },
      { id: "knox-henderson", name: "Knox-Henderson", coordinates: [32.8201, -96.7877] },
    ],
  ],
  [
    "Jacksonville|United States",
    [
      { id: "riverside-avondale", name: "Riverside-Avondale", coordinates: [30.3144, -81.6889] },
      { id: "san-marco", name: "San Marco", coordinates: [30.3047, -81.6555] },
      { id: "springfield", name: "Springfield", coordinates: [30.3462, -81.6473] },
      { id: "jacksonville-beach", name: "Jacksonville Beach", coordinates: [30.2947, -81.3931] },
      { id: "murray-hill", name: "Murray Hill", coordinates: [30.3112, -81.7244] },
    ],
  ],
  [
    "Miami|United States",
    [
      { id: "wynwood", name: "Wynwood", coordinates: [25.8014, -80.1991] },
      { id: "little-havana", name: "Little Havana", coordinates: [25.7682, -80.2335] },
      { id: "coconut-grove", name: "Coconut Grove", coordinates: [25.7126, -80.257] },
      { id: "brickell", name: "Brickell", coordinates: [25.7601, -80.1937] },
      { id: "design-district", name: "Design District", coordinates: [25.8147, -80.1914] },
    ],
  ],
  [
    "Orlando|United States",
    [
      { id: "lake-eola-heights", name: "Lake Eola Heights", coordinates: [28.5482, -81.3734] },
      { id: "mills-50", name: "Mills 50", coordinates: [28.5637, -81.3659] },
      { id: "college-park", name: "College Park", coordinates: [28.5792, -81.3869] },
      { id: "winter-park", name: "Winter Park", coordinates: [28.6, -81.3392] },
      { id: "international-drive", name: "International Drive", coordinates: [28.4559, -81.4694] },
    ],
  ],
  [
    "San Francisco|United States",
    [
      { id: "mission-district", name: "Mission District", coordinates: [37.7599, -122.4148] },
      { id: "north-beach", name: "North Beach", coordinates: [37.8061, -122.4102] },
      { id: "hayes-valley", name: "Hayes Valley", coordinates: [37.7764, -122.4242] },
      { id: "marina-district", name: "Marina District", coordinates: [37.803, -122.4368] },
      { id: "sunset-district", name: "Sunset District", coordinates: [37.7534, -122.4941] },
    ],
  ],
  [
    "Washington, DC|United States",
    [
      { id: "georgetown", name: "Georgetown", coordinates: [38.9076, -77.0723] },
      { id: "dupont-circle", name: "Dupont Circle", coordinates: [38.9096, -77.0434] },
      { id: "shaw", name: "Shaw", coordinates: [38.9131, -77.0228] },
      { id: "adams-morgan", name: "Adams Morgan", coordinates: [38.9227, -77.0422] },
      { id: "capitol-hill", name: "Capitol Hill", coordinates: [38.8898, -76.9988] },
    ],
  ],
  [
    "Las Vegas|United States",
    [
      { id: "the-strip", name: "The Strip", coordinates: [36.1147, -115.1728] },
      { id: "arts-district", name: "Arts District", coordinates: [36.1617, -115.1535] },
      { id: "fremont-east", name: "Fremont East", coordinates: [36.1709, -115.1398] },
      { id: "summerlin", name: "Summerlin", coordinates: [36.1902, -115.3093] },
      { id: "chinatown", name: "Chinatown", coordinates: [36.1272, -115.1974] },
    ],
  ],
  [
    "Honolulu|United States",
    [
      { id: "waikiki", name: "Waikiki", coordinates: [21.2793, -157.8294] },
      { id: "kakaako", name: "Kakaako", coordinates: [21.2969, -157.8579] },
      { id: "chinatown-honolulu", name: "Chinatown", coordinates: [21.3114, -157.8629] },
      { id: "diamond-head", name: "Diamond Head", coordinates: [21.2619, -157.8055] },
      { id: "manoa", name: "Manoa", coordinates: [21.3248, -157.8099] },
    ],
  ],
  [
    "Nashville|United States",
    [
      { id: "the-gulch", name: "The Gulch", coordinates: [36.1538, -86.7836] },
      { id: "east-nashville", name: "East Nashville", coordinates: [36.1794, -86.7486] },
      { id: "12south", name: "12South", coordinates: [36.1227, -86.7901] },
      { id: "germantown-nashville", name: "Germantown", coordinates: [36.1804, -86.79] },
      { id: "sobro", name: "SoBro", coordinates: [36.1572, -86.7744] },
    ],
  ],
  [
    "Seattle|United States",
    [
      { id: "capitol-hill-seattle", name: "Capitol Hill", coordinates: [47.6253, -122.3222] },
      { id: "belltown", name: "Belltown", coordinates: [47.615, -122.3479] },
      { id: "ballard", name: "Ballard", coordinates: [47.6686, -122.3864] },
      { id: "fremont-seattle", name: "Fremont", coordinates: [47.6516, -122.3493] },
      { id: "pioneer-square-seattle", name: "Pioneer Square", coordinates: [47.6019, -122.3338] },
    ],
  ],
  [
    "New Orleans|United States",
    [
      {
        id: "french-quarter",
        name: "French Quarter",
        coordinates: [29.9584, -90.0644],
        description:
          "The city's historic core, packed with landmark streets, classic balconies, live music, and the high-energy bustle visitors expect from New Orleans.",
      },
      {
        id: "marigny",
        name: "Marigny",
        coordinates: [29.9652, -90.057],
        description:
          "Just beyond the Quarter, Marigny is one of New Orleans' best areas for live music, colorful homes, and a creative, neighborhood feel anchored by Frenchmen Street.",
      },
      {
        id: "garden-district",
        name: "Garden District",
        coordinates: [29.9295, -90.0899],
        description:
          "A leafy, elegant district known for mansion-lined streets, historic architecture, and easy strolling near Magazine Street and the St. Charles streetcar.",
      },
      {
        id: "warehouse-district",
        name: "Warehouse District",
        coordinates: [29.9445, -90.0702],
        description:
          "A polished arts-and-museum district with galleries, strong dining, and major cultural stops like the Ogden Museum and nearby convention-center corridor.",
      },
      {
        id: "treme",
        name: "Treme",
        coordinates: [29.9685, -90.0745],
        description:
          "One of the country's most important Black cultural neighborhoods, celebrated for deep musical roots, Creole history, and landmarks around Armstrong Park and Congo Square.",
      },
    ],
  ],
  [
    "Bangkok|Thailand",
    [
      {
        id: "rattanakosin",
        name: "Rattanakosin",
        coordinates: [13.751, 100.492],
        description:
          "Bangkok's old royal island, where the Grand Palace, Wat Pho, Wat Phra Kaew, river piers, and Khao San edges make temple-heavy days feel coherent. It works best early, before heat and crowds turn every golden surface into a test of patience.",
      },
      {
        id: "chinatown-yaowarat",
        name: "Chinatown & Yaowarat",
        coordinates: [13.739, 100.509],
        description:
          "Bangkok's night-food furnace, built around Yaowarat Road, market lanes, gold shops, seafood counters, noodle stops, and cocktail rooms that keep the area alive after dark. It works best as a focused evening route, not a quick detour between temples.",
      },
      {
        id: "sukhumvit",
        name: "Sukhumvit",
        coordinates: [13.737, 100.561],
        description:
          "Bangkok's long hotel, mall, restaurant, and nightlife corridor, held together by the BTS and a habit of stretching plans later than expected. It works best when convenience matters: dinner, bars, shopping, and a reliable route home.",
      },
      {
        id: "silom-sathorn",
        name: "Silom & Sathorn",
        coordinates: [13.724, 100.529],
        description:
          "A business-district pair with serious restaurants, cocktail rooms, old Bangkok lanes, Lumphini Park access, and enough polish to slow the city down. It works best for dinner-led nights, hotel bases, and heat breaks that still keep you central.",
      },
      {
        id: "riverside",
        name: "Riverside",
        coordinates: [13.728, 100.512],
        description:
          "The Chao Phraya side of Bangkok, where ferries, temple approaches, historic hotels, warehouse districts, and skyline bars make the city feel older and more theatrical. It works best when the boat is part of the plan, not just the view.",
      },
      {
        id: "ari",
        name: "Ari",
        coordinates: [13.78, 100.544],
        description:
          "Ari gives Bangkok a calmer neighborhood register: cafes, small restaurants, social hostels, local bars, and leafy side streets close enough to the BTS to stay useful. It works best when the day needs air without leaving the city.",
      },
    ],
  ],
  [
    "Istanbul|Turkey",
    [
      {
        id: "sultanahmet",
        name: "Sultanahmet",
        coordinates: [41.0085, 28.9802],
        description:
          "Istanbul's imperial core, where Hagia Sophia, the Blue Mosque, Topkapi, the cisterns, and old stone streets carry the city's heaviest history. It works best early, then needs a ferry, garden, or table before monument fatigue takes over.",
      },
      {
        id: "beyoglu",
        name: "Beyoglu",
        coordinates: [41.0369, 28.9847],
        description:
          "Beyoglu is Istanbul after dark and between eras: Istiklal, Pera hotels, music rooms, meyhanes, passages, galleries, and late bars all pulling in different directions. It works best when dinner, drinks, and a second room can stay close.",
      },
      {
        id: "karakoy-galata",
        name: "Karakoy & Galata",
        coordinates: [41.0257, 28.9745],
        description:
          "A steep harbor edge of ferries, banks, churches, boutiques, coffee, fish, cocktail rooms, and Galata Tower views. It works best as a hinge between old Istanbul, Beyoglu nights, and Bosphorus movement.",
      },
      {
        id: "kadikoy",
        name: "Kadikoy",
        coordinates: [40.9903, 29.0275],
        description:
          "The Asian-side answer to tourist Istanbul, with market streets, casual bars, rock rooms, ferries, meze tables, Moda walks, and a younger local rhythm. It works best when crossing the water is part of the pleasure.",
      },
      {
        id: "cihangir-cukurcuma",
        name: "Cihangir & Cukurcuma",
        coordinates: [41.031, 28.986],
        description:
          "A hillside pocket of cafes, antique shops, small galleries, cats on steps, wine bars, and apartment-window Istanbul. It works best for slower second drinks, daytime wandering, and a softer landing after Beyoglu.",
      },
      {
        id: "besiktas-ortakoy",
        name: "Besiktas & Ortakoy",
        coordinates: [41.043, 29.005],
        description:
          "A Bosphorus-facing stretch where ferry traffic, palace edges, university energy, breakfast streets, waterfront bars, and Ortakoy spectacle keep Istanbul social. It works best when the water is the route.",
      },
    ],
  ],
  [
    "Paris|France",
    [
      {
        id: "first-arrondissement",
        name: "1st Arrondissement",
        coordinates: [48.8624, 2.3368],
        description:
          "Royal Paris around the Louvre, Palais Royal, Tuileries, Sainte-Chapelle, covered passages, and Seine edges. It deserves its own route because museum weight, gardens, shopping arcades, and river walks can stay tightly linked.",
      },
      {
        id: "le-marais",
        name: "Le Marais",
        coordinates: [48.8576, 2.3622],
        description:
          "Historic central Paris across the 3rd and 4th arrondissements, where mansion museums, Place des Vosges, Jewish food streets, boutiques, queer nightlife, and bistros sit close enough to make a full saved-map route without leaving the old quarter.",
      },
      {
        id: "saint-germain-des-pres",
        name: "Saint-Germain-des-Pres",
        coordinates: [48.8546, 2.3339],
        description:
          "Classic Left Bank Paris with literary cafes, galleries, brasseries, polished shops, Luxembourg Garden access, and easy walks to Orsay or the river. It works best when cafe ritual, food, and culture are paced together.",
      },
      {
        id: "latin-quarter",
        name: "Latin Quarter",
        coordinates: [48.8494, 2.347],
        description:
          "An academic and historic Left Bank pocket around the Sorbonne, Pantheon, Cluny, bookshops, gardens, and older lanes. It deserves its own route because culture, cafes, and river walks can stay tightly clustered.",
      },
      {
        id: "montmartre",
        name: "Montmartre",
        coordinates: [48.8867, 2.3431],
        description:
          "A hilltop neighborhood where Sacre-Coeur views, artist mythology, old mills, Abbesses cafes, and village-like lanes need careful timing. It works best as a morning or golden-hour walk before Pigalle or a calmer dinner.",
      },
      {
        id: "canal-saint-martin",
        name: "Canal Saint-Martin",
        coordinates: [48.8721, 2.3648],
        description:
          "A younger-feeling canal district where bakery mornings, waterside paths, independent shops, casual restaurants, cocktail bars, and music rooms make compact routes. It is strongest when the plan stays near the locks.",
      },
      {
        id: "seventh-arrondissement",
        name: "7th Arrondissement",
        coordinates: [48.8563, 2.3126],
        description:
          "A prestigious riverside district where the Eiffel Tower, Orsay, Rodin, Invalides, Quai Branly, embassies, and broad avenues need context. It works best when monuments, museums, gardens, and river walks are linked.",
      },
    ],
  ],
  [
    "Dubai|United Arab Emirates",
    [
      { id: "downtown-dubai", name: "Downtown Dubai", coordinates: [25.1945, 55.2796] },
      { id: "dubai-marina", name: "Dubai Marina", coordinates: [25.0804, 55.1403] },
      { id: "jumeirah", name: "Jumeirah", coordinates: [25.2048, 55.2415] },
      { id: "deira", name: "Deira", coordinates: [25.2786, 55.3302] },
      { id: "business-bay", name: "Business Bay", coordinates: [25.1867, 55.2719] },
    ],
  ],
  [
    "Madrid|Spain",
    [
      {
        id: "sol-centro",
        name: "Sol & Centro",
        coordinates: [40.4169, -3.7036],
        description:
          "Madrid's kilometer-zero core, anchored by Puerta del Sol, Plaza Mayor, and fast access to major historic landmarks.",
      },
      {
        id: "barrio-de-las-letras",
        name: "Barrio de las Letras",
        coordinates: [40.4141, -3.6957],
        description:
          "The Literary Quarter with writer heritage, elegant streets, and ideal positioning between the city's major art museums.",
      },
      {
        id: "retiro",
        name: "Retiro",
        coordinates: [40.4153, -3.6844],
        description:
          "A refined district beside El Retiro Park, perfect for green-space afternoons, museums, and polished central strolls.",
      },
      {
        id: "malasana",
        name: "Malasana",
        coordinates: [40.4262, -3.7044],
        description:
          "A high-energy neighborhood known for vintage shops, indie cafes, and the nightlife legacy of Madrid's Movida scene.",
      },
      {
        id: "la-latina",
        name: "La Latina",
        coordinates: [40.4112, -3.7094],
        description:
          "One of old Madrid's most atmospheric quarters, famous for tapas streets and the Sunday El Rastro market.",
      },
      {
        id: "chueca",
        name: "Chueca",
        coordinates: [40.4238, -3.6975],
        description:
          "A vibrant, inclusive district with lively plazas, modern dining, and one of central Madrid's strongest night scenes.",
      },
    ],
  ],
  [
    "Tokyo|Japan",
    [
      { id: "shibuya", name: "Shibuya", coordinates: [35.6619, 139.7041] },
      { id: "shinjuku", name: "Shinjuku", coordinates: [35.6938, 139.7034] },
      { id: "ginza", name: "Ginza", coordinates: [35.6717, 139.765] },
      { id: "asakusa", name: "Asakusa", coordinates: [35.7148, 139.7967] },
      { id: "roppongi", name: "Roppongi", coordinates: [35.6628, 139.7314] },
      {
        id: "ueno",
        name: "Ueno",
        coordinates: [35.7138, 139.777],
        description:
          "Ueno is Tokyo's north-side museum, park, market, and rail hub, where Ueno Park, Ameyoko, Okachimachi, and old-school dining make a compact visitor base. It works especially well for culture-heavy days, value stays, casual food, and easy east-side routing.",
      },
    ],
  ],
  [
    "Hong Kong|Hong Kong",
    [
      {
        id: "central",
        name: "Central",
        coordinates: [22.2819, 114.1589],
        description:
          "Hong Kong's finance-tower core, where polished Cantonese rooms, hotel dining, cocktail bars, escalators, ferries, and colonial fragments sit in compressed vertical layers. It works best when food, bars, galleries, and harbor movement need to stay close.",
      },
      {
        id: "sheung-wan",
        name: "Sheung Wan",
        coordinates: [22.2854, 114.1501],
        description:
          "A textured west-of-Central district of dried seafood shops, temples, roast meat, tea, small restaurants, galleries, and quieter bars. It works best for food-led walks and second drinks that feel less glossy than Central.",
      },
      {
        id: "tsim-sha-tsui",
        name: "Tsim Sha Tsui",
        coordinates: [22.2976, 114.1722],
        description:
          "Kowloon's harbor-front showpiece, with classic hotels, museums, shopping streets, Cantonese dining, and skyline views facing Hong Kong Island. It works best when the harbor view is part of the plan, not the whole plan.",
      },
      {
        id: "wan-chai",
        name: "Wan Chai",
        coordinates: [22.277, 114.1733],
        description:
          "A dense island district where old streets, convention-center polish, bars, live music, noodles, and late practical meals overlap. It works best for nights that want to get louder without losing transit logic.",
      },
      {
        id: "causeway-bay",
        name: "Causeway Bay",
        coordinates: [22.2797, 114.185],
        description:
          "A retail-heavy district of malls, street food, bakeries, late dining, tram movement, and constant foot traffic. It works best when shopping, quick meals, and transport convenience matter more than calm.",
      },
      {
        id: "west-kowloon",
        name: "West Kowloon",
        coordinates: [22.3027, 114.1599],
        description:
          "Hong Kong's major cultural waterfront, anchored by M+, the Hong Kong Palace Museum, performance spaces, harbor lawns, and a wider Kowloon view. It works best as a museum-and-waterfront counterweight to Central.",
      },
      {
        id: "peak-mid-levels",
        name: "The Peak & Mid-Levels",
        coordinates: [22.2708, 114.1498],
        description:
          "The steep, view-driven Hong Kong above Central, shaped by escalators, hillside streets, tram routes, gardens, and skyline overlooks. It works best when the day needs elevation, air, and a sense of the city stacked below.",
      },
    ],
  ],
  [
    "Amsterdam|Netherlands",
    [
      {
        id: "centrum",
        name: "Centrum (Canal Ring)",
        coordinates: [52.3738, 4.891],
        description:
          "The UNESCO-listed canal-ring core with iconic townhouses, major landmarks, and Amsterdam's busiest walking routes.",
      },
      {
        id: "jordaan",
        name: "Jordaan",
        coordinates: [52.3759, 4.8807],
        description:
          "A canal-ring favorite with narrow streets, cozy brown cafes, independent shops, and some of Amsterdam's best local dining.",
      },
      {
        id: "de-pijp",
        name: "De Pijp",
        coordinates: [52.3547, 4.891],
        description:
          "A lively, multicultural district centered around the Albert Cuyp Market, known for cafes, bars, and all-day food culture.",
      },
      {
        id: "museum-quarter",
        name: "Museum Quarter",
        coordinates: [52.3584, 4.8811],
        description:
          "Home to the Rijksmuseum, Van Gogh Museum, and Stedelijk, with broad boulevards and direct access to Vondelpark.",
      },
      {
        id: "de-wallen",
        name: "De Wallen",
        coordinates: [52.3732, 4.8961],
        description:
          "The historic old-center district around the Red Light area, known for nightlife intensity, canals, and high visitor traffic.",
      },
      {
        id: "amsterdam-noord-ndsm",
        name: "Amsterdam Noord (NDSM)",
        coordinates: [52.4014, 4.8956],
        description:
          "A ferry-accessed northside district centered on NDSM Wharf, with industrial waterfront spaces, street art, and modern creative venues.",
      },
    ],
  ],
  [
    "Berlin|Germany",
    [
      {
        id: "mitte",
        name: "Mitte",
        coordinates: [52.5206, 13.3862],
        description:
          "Berlin's historic core with Brandenburg Gate, Museum Island, and many of the city's most visited landmarks.",
      },
      {
        id: "friedrichshain",
        name: "Friedrichshain",
        coordinates: [52.5158, 13.4543],
        description:
          "An energetic eastern district with the East Side Gallery, riverfront walks, and nightlife corridors around Warschauer Straße.",
      },
      {
        id: "kreuzberg",
        name: "Kreuzberg",
        coordinates: [52.4986, 13.4034],
        description:
          "Known for alternative culture, street art, and globally influenced food, with strong day-to-night energy.",
      },
      {
        id: "neukolln",
        name: "Neukolln",
        coordinates: [52.4815, 13.435],
        description:
          "A south Berlin district where canals, immigrant food culture, municipal arts spaces, neighborhood bars, and Tempelhofer Feld meet a fast-changing residential fabric.",
      },
      {
        id: "charlottenburg",
        name: "Charlottenburg",
        coordinates: [52.5165, 13.3041],
        description:
          "An elegant westside district with Charlottenburg Palace, grand shopping avenues, and classic Berlin architecture.",
      },
      {
        id: "prenzlauer-berg",
        name: "Prenzlauer Berg",
        coordinates: [52.5386, 13.4246],
        description:
          "A polished neighborhood of restored 19th-century blocks, leafy squares, cafes, and popular weekend markets.",
      },
      {
        id: "tiergarten",
        name: "Tiergarten",
        coordinates: [52.5145, 13.3501],
        description:
          "Berlin's central park district, bordered by major institutions and monuments including the Reichstag and Victory Column.",
      },
    ],
  ],
  [
    "Rome|Italy",
    [
      {
        id: "centro-storico",
        name: "Centro Storico",
        coordinates: [41.8988, 12.4731],
        description:
          "Postcard Rome centered on the Pantheon, Piazza Navona, and Trevi Fountain, with dense historic streets and landmarks.",
      },
      {
        id: "trastevere",
        name: "Trastevere",
        coordinates: [41.8897, 12.4708],
        description:
          "Across the river, this is Rome's most atmospheric neighborhood with ivy-covered walls and lively nightly trattorias.",
      },
      {
        id: "garbatella",
        name: "Garbatella",
        coordinates: [41.8603, 12.4796],
        description:
          "A character-rich residential quarter known for village-like streets, local food spots, and a more lived-in Roman feel.",
      },
      {
        id: "monti",
        name: "Monti",
        coordinates: [41.8957, 12.4932],
        description:
          "A trendy, bohemian pocket tucked right next to the Colosseum. It is full of vintage boutiques and craft beer bars.",
      },
      {
        id: "testaccio",
        name: "Testaccio",
        coordinates: [41.8766, 12.4778],
        description:
          'The "original" foodie neighborhood. It is less crowded and home to some of the best traditional Roman pasta dishes.',
      },
      {
        id: "prati",
        name: "Prati",
        coordinates: [41.9096, 12.4657],
        description:
          "The gateway to the Vatican. It is an elegant, orderly district ideal for visiting St. Peter's Basilica and the Vatican Museums.",
      },
      {
        id: "celio",
        name: "Celio",
        coordinates: [41.8894, 12.4964],
        description:
          "The neighborhood around the Colosseum and nearby ancient ruins, with elevated viewpoints and quieter residential pockets.",
      },
    ],
  ],
  [
    "Athens|Greece",
    [
      {
        id: "monastiraki",
        name: "Monastiraki",
        coordinates: [37.9763, 23.7253],
        description:
          "A bustling old-center district where market streets, Byzantine landmarks, and fast-moving cafe terraces meet beneath the Acropolis.",
      },
      {
        id: "makrygianni",
        name: "Makrygianni",
        coordinates: [37.9686, 23.7291],
        description:
          "An Acropolis-adjacent district linking museum corridors, pedestrian promenades, and dense historic-city routes into central Athens.",
      },
      {
        id: "kolonaki",
        name: "Kolonaki",
        coordinates: [37.9787, 23.7412],
        description:
          "An elegant central neighborhood known for boutiques, galleries, and polished cafes around the slopes of Lycabettus Hill.",
      },
      {
        id: "exarchia",
        name: "Exarchia",
        coordinates: [37.985, 23.733],
        description:
          "A politically and artistically charged district with independent bookstores, late-night bars, and strong alternative-city character.",
      },
      {
        id: "pangrati",
        name: "Pangrati",
        coordinates: [37.9688, 23.7475],
        description:
          "A lively residential-central blend with destination dining, all-day cafes, and quick access to museums and green spaces.",
      },
      {
        id: "mets",
        name: "Mets",
        coordinates: [37.9668, 23.7396],
        description:
          "A quieter hillside quarter south of the center, known for local tavernas, small cultural venues, and Acropolis-adjacent views.",
      },
    ],
  ],
  [
    "Barcelona|Spain",
    [
      {
        id: "gothic-quarter",
        name: "Gothic Quarter",
        coordinates: [41.3839, 2.1763],
        description:
          "The Gothic Quarter is Barcelona at its tightest: medieval lanes, cathedral squares, Roman fragments, and tourist pressure all packed into the old city. It works best when the route avoids aimless wandering, using a few historic anchors, quieter side streets, and selective food stops.",
      },
      {
        id: "el-born",
        name: "El Born",
        coordinates: [41.3852, 2.1823],
        description:
          "El Born is Barcelona's stylish old-town pocket, where Santa Maria del Mar, design shops, wine bars, narrow lanes, and the Picasso Museum sit close together. It works best from late afternoon into night, when browsing can turn into tapas, drinks, and slower nearby plaza time.",
      },
      {
        id: "eixample",
        name: "Eixample",
        coordinates: [41.3917, 2.1649],
        description:
          "Eixample is Barcelona's grand grid, where Modernista facades, Passeig de Gracia, polished hotels, and serious restaurants give the city its broadest rhythm. It works best for architecture-led days that need easy transit, strong dining, and room to reset between landmarks.",
      },
      {
        id: "gracia",
        name: "Gracia",
        coordinates: [41.4036, 2.1565],
        description:
          "Gracia is the village-feeling Barcelona neighborhood where small plazas, independent shops, cafes, and local bars make the city feel less managed. It works best as a slower route, with short walks between squares and enough time to let dinner or drinks choose the next stop.",
      },
      {
        id: "poble-sec",
        name: "Poble-sec",
        coordinates: [41.3745, 2.1648],
        description:
          "Poble-sec is Barcelona's Montjuic-edge neighborhood, where theaters, tapas bars, Carrer de Blai, and hillside streets turn a compact area into an evening route. It works best when paired with park or museum time above it, then allowed to slide downhill into dinner and drinks.",
      },
    ],
  ],
  [
    "London|United Kingdom",
    [
      {
        id: "westminster",
        name: "Westminster",
        coordinates: [51.4994, -0.1276],
        description:
          "Westminster is London's ceremonial core, where Parliament, Westminster Abbey, Whitehall, St James's Park, and state-procession streets sit in tight formation. It works best as a landmark-heavy route with pub lunches, river pauses, and short walks that keep the pageantry from becoming a checklist.",
      },
      {
        id: "soho",
        name: "Soho",
        coordinates: [51.5136, -0.1365],
        description:
          "Soho is central London at close quarters: theatres, jazz rooms, queer history, old pubs, counter restaurants, and late streets packed between Oxford Street and Chinatown. It works best from afternoon into night, when food, drinks, shows, and small galleries can stack without crossing town.",
      },
      {
        id: "covent-garden",
        name: "Covent Garden",
        coordinates: [51.5118, -0.1238],
        description:
          "Covent Garden turns central London into a compact stage set, with the Royal Opera House, piazza, covered market, Strand institutions, and West End theatres close together. It works best for pre-show meals, polished hotels, museum detours, and short walks that leave room for a late booking.",
      },
      {
        id: "south-bank",
        name: "South Bank",
        coordinates: [51.505, -0.116],
        description:
          "South Bank is London's riverfront culture line, running from the London Eye and National Theatre toward Tate Modern, Bankside, Borough Market, and London Bridge. It works best as a walking day, using the Thames path to connect art, views, food stalls, and an easy evening crossing.",
      },
      {
        id: "bloomsbury",
        name: "Bloomsbury",
        coordinates: [51.5226, -0.1257],
        description:
          "Bloomsbury is London's museum-and-square district, shaped by the British Museum, university blocks, bookish streets, garden squares, and Lamb's Conduit dining. It works best for slower central days, with cafes, wine rooms, and transit links making it calmer than the West End next door.",
      },
      {
        id: "marylebone",
        name: "Marylebone",
        coordinates: [51.5226, -0.1496],
        description:
          "Marylebone is the central village version of west London, where Marylebone High Street, Georgian blocks, medical streets, Regent's Park edges, and polished restaurants set the tone. It works best as a refined base, close to Oxford Street and Baker Street without feeling swallowed by either.",
      },
      {
        id: "camden",
        name: "Camden",
        coordinates: [51.5394, -0.1432],
        description:
          "Camden is north London's canal-and-music district, packed around Camden Market, the locks, the Roundhouse, late pubs, food stalls, and the Northern line. It works best as a loud half-day or gig-night route, with Regent's Canal and nearby Primrose Hill giving the area an exit ramp.",
      },
      {
        id: "shoreditch",
        name: "Shoreditch",
        coordinates: [51.5255, -0.0796],
        description:
          "Shoreditch is east London's restaurant, gallery, and nightlife knot, with Hoxton, Brick Lane, Spitalfields, warehouse rooms, and street-art corridors pulling in different directions. It works best from late morning to late night, when markets, dinner, cocktails, and clubs can stay in one tight orbit.",
      },
      {
        id: "hackney",
        name: "Hackney",
        coordinates: [51.545, -0.0553],
        description:
          "Hackney is east London beyond the Shoreditch shorthand, centered on Mare Street, Hackney Central, London Fields, railway arches, pubs, bakeries, and ambitious neighborhood restaurants. It works best when the day can loosen into parks, markets, canal edges, and a night that feels local rather than glossy.",
      },
      {
        id: "brixton",
        name: "Brixton",
        coordinates: [51.4613, -0.1156],
        description:
          "Brixton is south London's market-and-music anchor, shaped by Brixton Village, Electric Avenue, Caribbean food, late bars, murals, and the O2 Academy's gig traffic. It works best as an evening-led route, where market meals, pubs, and live music make the neighborhood feel distinct from central London.",
      },
    ],
  ],
  [
    "Sydney|Australia",
    [
      {
        id: "sydney-cbd",
        name: "Sydney CBD",
        coordinates: [-33.8688, 151.2093],
        description:
          "The city's central core around Circular Quay, major shopping streets, and dense transit links.",
      },
      {
        id: "the-rocks",
        name: "The Rocks",
        coordinates: [-33.8598, 151.209],
        description:
          "Sydney's historic harborside quarter with sandstone lanes, pub culture, and direct harbor views.",
      },
      {
        id: "surry-hills",
        name: "Surry Hills",
        coordinates: [-33.883, 151.211],
        description:
          "A highly walkable inner-city neighborhood known for cafes, dining, and independent retail.",
      },
      {
        id: "newtown-sydney",
        name: "Newtown",
        coordinates: [-33.8981, 151.1749],
        description:
          "A creative inner-west district with a strong nightlife strip, live music, and street-level character.",
      },
      {
        id: "paddington-sydney",
        name: "Paddington",
        coordinates: [-33.8842, 151.2288],
        description:
          "A terrace-lined neighborhood with boutique shopping, galleries, and easy links to the city center.",
      },
      {
        id: "bondi",
        name: "Bondi",
        coordinates: [-33.8915, 151.2767],
        description:
          "Sydney's most recognized beach district with coastal walks, surf culture, and all-day dining.",
      },
    ],
  ],
  [
    "Melbourne|Australia",
    [
      {
        id: "melbourne-cbd",
        name: "Melbourne CBD",
        coordinates: [-37.8136, 144.9631],
        description:
          "The central grid of laneways, flagship museums, and major transit that anchors most first-time visits.",
      },
      {
        id: "fitzroy",
        name: "Fitzroy",
        coordinates: [-37.7988, 144.9783],
        description:
          "A design-forward inner-city district known for bars, independent fashion, and live music venues.",
      },
      {
        id: "carlton",
        name: "Carlton",
        coordinates: [-37.8009, 144.9661],
        description:
          "A classic inner neighborhood with Italian heritage dining, leafy streets, and university energy.",
      },
      {
        id: "richmond-melbourne",
        name: "Richmond",
        coordinates: [-37.8237, 144.9984],
        description:
          "A large inner-east district with strong nightlife, food diversity, and direct access to sports precincts.",
      },
      {
        id: "south-yarra",
        name: "South Yarra",
        coordinates: [-37.839, 144.9928],
        description:
          "A polished neighborhood for shopping, dining, and river-adjacent urban routes.",
      },
      {
        id: "st-kilda",
        name: "St Kilda",
        coordinates: [-37.8676, 144.9809],
        description:
          "A bayside district with beach promenades, nightlife, and one of Melbourne's most visited local scenes.",
      },
    ],
  ],
  [
    "Mexico City|Mexico",
    [
      {
        id: "centro-historico",
        name: "Centro Historico",
        coordinates: [19.4323, -99.1333],
        description:
          "The historic core of CDMX, where major landmarks, colonial architecture, and busy plazas make it one of the city's highest-energy walking zones.",
      },
      {
        id: "roma-norte",
        name: "Roma Norte",
        coordinates: [19.4147, -99.1638],
        description:
          "A design-forward neighborhood known for cafes, galleries, nightlife, and leafy streets lined with restored early-20th-century buildings.",
      },
      {
        id: "la-condesa",
        name: "La Condesa",
        coordinates: [19.4118, -99.1712],
        description:
          "Park-centered and highly walkable, Condesa blends relaxed daytime cafe culture with destination dining and bars around Parque Mexico and Parque Espana.",
      },
      {
        id: "polanco",
        name: "Polanco",
        coordinates: [19.4333, -99.1956],
        description:
          "An upscale district with broad avenues, luxury shopping, and some of the city's top restaurants and museums, including easy access to Chapultepec.",
      },
      {
        id: "coyoacan",
        name: "Coyoacan",
        coordinates: [19.3467, -99.1617],
        description:
          "A slower-paced, historic southern district with plazas, markets, and strong local character, anchored by arts heritage and neighborhood street life.",
      },
      {
        id: "juarez",
        name: "Juarez",
        coordinates: [19.4254, -99.1595],
        description:
          "A central neighborhood near Reforma where historic mansions, embassy blocks, and a growing food-and-nightlife scene come together.",
      },
    ],
  ],
  [
    "Medellin|Colombia",
    [
      {
        id: "el-poblado",
        name: "El Poblado",
        coordinates: [6.2088, -75.5652],
        description:
          "Medellín's best-known visitor district, packed with polished dining, nightlife, hotels, and hillside views.",
      },
      {
        id: "laureles-estadio",
        name: "Laureles-Estadio",
        coordinates: [6.2518, -75.5945],
        description:
          "A flatter, more local-feeling district with tree-lined avenues, neighborhood restaurants, and a relaxed day-to-night pace.",
      },
      {
        id: "la-candelaria",
        name: "La Candelaria",
        coordinates: [6.2476, -75.5698],
        description:
          "The historic and civic center of Medellín, where plazas, transit hubs, and classic city landmarks converge.",
      },
      {
        id: "san-javier",
        name: "San Javier",
        coordinates: [6.2566, -75.6168],
        description:
          "A western district known for Comuna 13's murals, escalators, street performance, and community-led cultural energy.",
      },
      {
        id: "belen",
        name: "Belen",
        coordinates: [6.2313, -75.6014],
        description:
          "A broad residential zone with parks, sports spaces, and practical local routes beyond the core tourist corridor.",
      },
      {
        id: "buenos-aires-medellin",
        name: "Buenos Aires",
        coordinates: [6.2384, -75.5567],
        description:
          "An eastern Medellín district with strong local identity, hillside viewpoints, neighborhood eateries, and easy metro-cable access nearby.",
      },
    ],
  ],
  [
    "Boston|United States",
    [
      { id: "back-bay", name: "Back Bay", coordinates: [42.3503, -71.0809] },
      { id: "beacon-hill", name: "Beacon Hill", coordinates: [42.3588, -71.0707] },
      { id: "north-end", name: "North End", coordinates: [42.3647, -71.0542] },
      { id: "south-end", name: "South End", coordinates: [42.3398, -71.0765] },
      { id: "seaport-district", name: "Seaport District", coordinates: [42.3517, -71.0415] },
    ],
  ],
  [
    "Lisbon|Portugal",
    [
      {
        id: "alfama",
        name: "Alfama",
        coordinates: [38.7139, -9.1303],
        description:
          "Lisbon's oldest hillside quarter, known for narrow lanes, castle viewpoints, and traditional fado houses.",
      },
      {
        id: "chiado",
        name: "Chiado",
        coordinates: [38.7108, -9.1436],
        description:
          "A central historic district with classic cafes, bookshops, theaters, and one of the city's most walked shopping corridors.",
      },
      {
        id: "baixa",
        name: "Baixa",
        coordinates: [38.7119, -9.1399],
        description:
          "Lisbon's grand downtown grid rebuilt after the 1755 earthquake, with broad plazas, transit access, and landmark shopping streets.",
      },
      {
        id: "bairro-alto",
        name: "Bairro Alto",
        coordinates: [38.7143, -9.1468],
        description:
          "A compact nightlife-heavy neighborhood of tiled facades, bars, and late-evening street energy.",
      },
      {
        id: "principe-real",
        name: "Príncipe Real",
        coordinates: [38.7172, -9.1484],
        description:
          "A leafy, design-forward area with independent boutiques, gardens, and strong cafe-and-restaurant density.",
      },
    ],
  ],
  [
    "Porto|Portugal",
    [
      {
        id: "ribeira",
        name: "Ribeira",
        coordinates: [41.1407, -8.611],
        description:
          "Porto's riverfront quarter of narrow streets, historic facades, and postcard views over the Douro.",
      },
      {
        id: "cedofeita",
        name: "Cedofeita",
        coordinates: [41.1517, -8.6215],
        description:
          "A central district mixing galleries, independent shops, and local cafe streets just beyond the busiest core.",
      },
      {
        id: "baixa",
        name: "Baixa",
        coordinates: [41.1484, -8.6138],
        description:
          "Downtown Porto around Aliados and São Bento, with major transit links, classic shopping streets, and dense city energy.",
      },
      {
        id: "bonfim",
        name: "Bonfim",
        coordinates: [41.1498, -8.5959],
        description:
          "An east-of-center neighborhood with a more local pace, design spots, and a growing food-and-culture scene.",
      },
      {
        id: "foz-do-douro",
        name: "Foz do Douro",
        coordinates: [41.1512, -8.6745],
        description:
          "Porto's Atlantic-side waterfront district where river meets ocean, known for promenades, beaches, and sunset viewpoints.",
      },
    ],
  ],
  [
    "Milan|Italy",
    [
      { id: "brera", name: "Brera", coordinates: [45.4719, 9.1883] },
      { id: "navigli", name: "Navigli", coordinates: [45.4528, 9.1749] },
      { id: "porta-venezia", name: "Porta Venezia", coordinates: [45.4765, 9.2053] },
      { id: "isola", name: "Isola", coordinates: [45.4865, 9.1887] },
      { id: "quadrilatero-doro", name: "Quadrilatero d'Oro", coordinates: [45.4698, 9.1967] },
    ],
  ],
  [
    "Lyon|France",
    [
      { id: "vieux-lyon", name: "Vieux Lyon", coordinates: [45.7624, 4.8274] },
      { id: "presquile", name: "Presqu'ile", coordinates: [45.7605, 4.8357] },
      { id: "croix-rousse", name: "Croix-Rousse", coordinates: [45.7743, 4.8319] },
      { id: "confluence", name: "Confluence", coordinates: [45.7432, 4.8156] },
      { id: "guillotiere", name: "Guillotiere", coordinates: [45.7517, 4.8424] },
    ],
  ],
  [
    "Prague|Czech Republic",
    [
      { id: "stare-mesto", name: "Stare Mesto", coordinates: [50.0875, 14.4213] },
      { id: "mala-strana", name: "Mala Strana", coordinates: [50.087, 14.4046] },
      { id: "vinohrady", name: "Vinohrady", coordinates: [50.0755, 14.4478] },
      { id: "karlin", name: "Karlin", coordinates: [50.0928, 14.4519] },
      { id: "holesovice", name: "Holesovice", coordinates: [50.1031, 14.4444] },
    ],
  ],
  [
    "Vienna|Austria",
    [
      { id: "innere-stadt", name: "Innere Stadt", coordinates: [48.2084, 16.3738] },
      { id: "leopoldstadt", name: "Leopoldstadt", coordinates: [48.2167, 16.4011] },
      { id: "neubau", name: "Neubau", coordinates: [48.2036, 16.3499] },
      { id: "mariahilf", name: "Mariahilf", coordinates: [48.1963, 16.3493] },
      { id: "wieden", name: "Wieden", coordinates: [48.1928, 16.3678] },
    ],
  ],
]);

const usaRegionSeeds: SubArea[] = [
  {
    id: "northeast",
    name: "Northeast",
    coordinates: [42.5, -73.8],
    description:
      "A dense, historic corridor of major cities, rail-connected routes, and classic food, culture, and neighborhood variety.",
  },
  {
    id: "southeast",
    name: "Southeast",
    coordinates: [33.1, -84.5],
    description:
      "A warm-weather region blending coastal escapes, music-rich cities, and some of the strongest food scenes in the U.S.",
  },
  {
    id: "midwest",
    name: "Midwest",
    coordinates: [41.9, -89.4],
    description:
      "A broad heartland region with easy city layouts, lake and river corridors, and strong local culture beyond major metros.",
  },
  {
    id: "southwest",
    name: "Southwest",
    coordinates: [32.2, -105.7],
    description:
      "A high-contrast region of desert landscapes, road-trip cities, and distinctive architecture, cuisine, and outdoor access.",
  },
  {
    id: "west-coast",
    name: "West Coast",
    coordinates: [37.6, -122.1],
    description:
      "A high-demand Pacific corridor of major cities, creative neighborhoods, and coast-to-mountain weekend routes.",
  },
  {
    id: "pacific",
    name: "Pacific",
    coordinates: [21.5, -157.5],
    description:
      "Island-and-frontier routes shaped by ocean access, dramatic landscapes, and destination-style travel planning.",
  },
];

const mexicoRegionSeeds: SubArea[] = [
  {
    id: "north",
    name: "North",
    coordinates: [28.5, -106.5],
    description:
      "Mexico's northern belt with desert landscapes, border cities, and long overland routes across Baja, Sonora, Chihuahua, and Nuevo León.",
  },
  {
    id: "central",
    name: "Central",
    coordinates: [19.5, -99.5],
    description:
      "The country's cultural and political core centered on Mexico City, with highland cities, colonial towns, and dense museum-and-food scenes.",
  },
  {
    id: "west",
    name: "West",
    coordinates: [20.8, -103.8],
    description:
      "A Pacific-facing region anchored by Guadalajara and surrounding states, known for tequila routes, creative city culture, and coastal escapes.",
  },
  {
    id: "gulf-south",
    name: "Gulf & South",
    coordinates: [17.8, -94.5],
    description:
      "A humid, history-rich corridor from Veracruz to Oaxaca and Chiapas, with Gulf coasts, mountain interiors, and strong regional cuisines.",
  },
  {
    id: "yucatan-caribbean",
    name: "Yucatan & Caribbean",
    coordinates: [20.6, -88.8],
    description:
      "The peninsula and Caribbean side blending Maya archaeological routes, cenotes, colonial hubs, and resort-to-local beach towns.",
  },
];

const newZealandRegionSeeds: SubArea[] = [
  {
    id: "north-island",
    name: "North Island",
    coordinates: [-39.2, 175.2],
    description:
      "A warmer island of major cities, volcanic landscapes, coastal drives, and dense culture-and-food corridors.",
  },
  {
    id: "south-island",
    name: "South Island",
    coordinates: [-44.1, 170.5],
    description:
      "An alpine-and-lake-focused island with dramatic scenery, adventure routes, and road-trip-first itineraries.",
  },
];

type RegionSeed = {
  id: string;
  name: string;
  description: string;
  anchor?: [number, number];
};

const europeanTravelRegionSeedsByCountryId: Record<string, RegionSeed[]> = {
  italy: [
    { id: "tuscany-central", name: "Central Italy (Art & Wine Heartland)", description: "Renaissance heritage corridors, vineyard routes, and hill-town itineraries across central Italy.", anchor: [0.48, 0.45] },
    { id: "north-lakes-alps", name: "Northern Italy (Lakes & Alps)", description: "Alpine rail routes and lake districts with mountain access and polished city-region travel.", anchor: [0.74, 0.36] },
    { id: "rome-lazio", name: "Lazio (Historic Core)", description: "Ancient landmarks, museum-heavy routes, and short-break itineraries across the central-west corridor.", anchor: [0.43, 0.5] },
    { id: "south-amalfi-puglia", name: "Southern Italy (Coastal & Culinary South)", description: "Coastal drives, historic southern districts, and food-forward routes across the south.", anchor: [0.25, 0.6] },
    { id: "sicily-sardinia", name: "Italian Islands (Mediterranean Escape)", description: "Island travel with archaeological sites, beach circuits, and slower Mediterranean pacing.", anchor: [0.12, 0.4] },
  ],
  france: [
    { id: "paris-ile-de-france", name: "Ile-de-France (Royal & Museum Core)", description: "Museum-dense capital-region routes with palace towns and nearby heritage sites.", anchor: [0.62, 0.5] },
    { id: "provence-riviera", name: "Provence-Alpes-Cote d'Azur (Mediterranean Riviera)", description: "Lavender-country interiors and Mediterranean coastline with hill-town escapes.", anchor: [0.24, 0.76] },
    { id: "bordeaux-loire-wine", name: "Loire & Southwest France (Wine & Chateaux)", description: "Chateau routes, vineyard regions, and food-led regional breaks across western France.", anchor: [0.46, 0.25] },
    { id: "alps-east", name: "Eastern France (Alpine & Lakes)", description: "Alpine access, mountain routes, and elegant east-side regional travel corridors.", anchor: [0.55, 0.74] },
    { id: "normandy-brittany", name: "Normandy & Brittany (Atlantic Heritage Coast)", description: "Atlantic coastlines, port towns, and history-rich northern coastal itineraries.", anchor: [0.72, 0.12] },
  ],
  spain: [
    { id: "madrid-castile", name: "Central Spain (Imperial Inland)", description: "Capital-region routes with museum corridors and inland heritage itineraries.", anchor: [0.52, 0.5] },
    { id: "andalusia-south", name: "Andalusia (Sunbelt South)", description: "Sun-heavy southern routes with Moorish heritage, beaches, and food-forward circuits.", anchor: [0.26, 0.5] },
    { id: "catalonia-barcelona", name: "Catalonia (Mediterranean Creative Coast)", description: "Mediterranean city-and-coast routes with design, beach access, and regional culture.", anchor: [0.56, 0.82] },
    { id: "basque-north", name: "Basque Country & Green North (Atlantic Food Trail)", description: "Atlantic food regions, surf coastlines, and cooler northern landscapes.", anchor: [0.76, 0.34] },
    { id: "islands", name: "Balearic & Canary Islands (Island Escape)", description: "Island-focused travel for beach, cycling, and resort-to-local town itineraries.", anchor: [0.1, 0.7] },
  ],
  germany: [
    { id: "berlin-brandenburg-east", name: "Eastern Germany (Capital & History)", description: "Culture-led routes with historic corridors and lake-district excursions in the east.", anchor: [0.62, 0.72] },
    { id: "bavaria-south", name: "Bavaria (Alpine Tradition)", description: "Alpine villages, castle routes, and mountain access across southern Germany.", anchor: [0.22, 0.6] },
    { id: "rhine-west", name: "Western Germany (Rhine & Wine Corridor)", description: "River corridors, wine valleys, and major west-side urban hubs.", anchor: [0.52, 0.24] },
    { id: "hamburg-north-sea", name: "Northern Germany (North Sea & Baltic)", description: "Port-region energy and coastal routes across northern Germany.", anchor: [0.78, 0.44] },
  ],
  "united-kingdom": [
    { id: "london-southeast", name: "South East England (Capital Corridor)", description: "Capital-region travel with easy rail day trips to historic and coastal towns.", anchor: [0.46, 0.66] },
    { id: "southwest-cotswolds", name: "South West England (Countryside & Coast)", description: "Village-and-coast routes with national parks, heritage towns, and countryside stays.", anchor: [0.34, 0.28] },
    { id: "northern-england", name: "Northern England (Industrial Heritage & Lakes)", description: "Northern corridors with lake districts, moorland gateways, and strong local culture.", anchor: [0.72, 0.42] },
    { id: "scotland", name: "Scotland (Highlands & Islands)", description: "Scenic rail and road routes with Highlands, islands, and historic urban cores.", anchor: [0.84, 0.48] },
    { id: "wales-northern-ireland", name: "Wales & Northern Ireland (Celtic Coasts)", description: "Coastal drives, mountain national parks, and compact heritage itineraries.", anchor: [0.58, 0.16] },
  ],
  portugal: [
    { id: "lisbon-tagus", name: "Tagus Coast (Historic Hills & Coast)", description: "Capital-region routes, surf towns, and nearby heritage loops in central Atlantic Portugal.", anchor: [0.4, 0.4] },
    { id: "porto-north", name: "Norte Region (River Valley & Atlantic)", description: "Northern regional breaks with valley access and Atlantic coast drives.", anchor: [0.75, 0.45] },
    { id: "alentejo-algarve", name: "Alentejo & Algarve (Rural Plains & Beaches)", description: "Slow rural roads and beach-heavy southern itineraries across whitewashed towns and cliffs.", anchor: [0.2, 0.45] },
    { id: "madeira-azores", name: "Madeira & Azores (Volcanic Atlantic Islands)", description: "Island routes focused on hiking, volcanic landscapes, and Atlantic scenery.", anchor: [0.1, 0.25] },
  ],
  greece: [
    { id: "athens-attica", name: "Attica (Classical Capital Region)", description: "Classical landmarks, neighborhood-rich routes, and short coastal escapes.", anchor: [0.48, 0.6] },
    { id: "peloponnese-mainland-south", name: "Peloponnese & Southern Mainland (Historic Peninsula)", description: "Historic peninsula routes, seaside towns, and classical-site overland itineraries.", anchor: [0.28, 0.46] },
    { id: "northern-greece", name: "Northern Greece (Mountain & Crossroads)", description: "Mountain villages, food-forward cities, and Balkan-crossroads routes.", anchor: [0.74, 0.56] },
    { id: "aegean-islands", name: "Aegean Islands (Cycladic Island-Hopping)", description: "Island-hopping for beaches, ferries, and village-centered stays.", anchor: [0.42, 0.78] },
    { id: "ionian-crete", name: "Ionian Islands & Crete (Western & Southern Islands)", description: "Western island coasts and Cretan itineraries blending beaches, hiking, and food routes.", anchor: [0.2, 0.3] },
  ],
  netherlands: [
    { id: "randstad-west", name: "Randstad (Urban Cultural Core)", description: "High-density urban region with museums, design, nightlife, and easy rail transfers.", anchor: [0.52, 0.46] },
    { id: "north-friesland", name: "North Holland & Friesland (Coastal Dikes)", description: "Dike roads, island ferries, and quieter northern breaks.", anchor: [0.78, 0.4] },
    { id: "south-limburg", name: "Limburg & South Netherlands (Cross-Border Hills)", description: "Cross-border hills and slower southern routes with food and heritage focus.", anchor: [0.26, 0.62] },
    { id: "east-achterhoek", name: "Eastern Netherlands (Countryside & Cycling)", description: "Cycling-focused inland regions with smaller centers and village-based itineraries.", anchor: [0.5, 0.68] },
  ],
  switzerland: [
    { id: "zurich-north", name: "Northern Switzerland (Lakes & Old Towns)", description: "Business-culture regional routes with lakes and historic cores.", anchor: [0.62, 0.52] },
    { id: "geneva-lausanne-west", name: "Western Switzerland (Lake & Vineyard Belt)", description: "French-speaking lakeside regions with alpine and vineyard day routes.", anchor: [0.5, 0.2] },
    { id: "bern-central", name: "Central Switzerland (Rail & Mountain Gateways)", description: "Rail-linked central routes into mountain valleys and classic old towns.", anchor: [0.52, 0.42] },
    { id: "ticino-south", name: "Ticino (Southern Alps)", description: "Italian-speaking alpine-lake routes with Mediterranean edge and mountain access.", anchor: [0.24, 0.58] },
  ],
  austria: [
    { id: "vienna-lower-austria", name: "Lower Austria (Danube & Imperial Corridor)", description: "Danube valley routes with heritage towns and wine-country access.", anchor: [0.56, 0.66] },
    { id: "salzburg-tyrol", name: "Salzburg & Tyrol (Alpine Gateway)", description: "Alpine gateways for ski, hiking, and mountain-village itineraries.", anchor: [0.56, 0.26] },
    { id: "styria-carinthia", name: "Styria & Carinthia (Southern Lakes & Vineyards)", description: "Southern Austria with lakes, vineyards, and slower regional road routes.", anchor: [0.28, 0.52] },
  ],
  belgium: [
    { id: "brussels-central", name: "Brussels-Capital Region (Institutional Core)", description: "Institutional hub with food-and-beer routes and easy rail access.", anchor: [0.56, 0.5] },
    { id: "flanders-north", name: "Flanders (Canals & Gothic Cores)", description: "Historic Flemish urban loop with canals, plazas, and strong culinary routes.", anchor: [0.68, 0.48] },
    { id: "wallonia-south", name: "Wallonia (Ardennes & Castle Country)", description: "Southern castles, forested Ardennes routes, and French-speaking cultural breaks.", anchor: [0.32, 0.5] },
  ],
  ireland: [
    { id: "dublin-east", name: "East Coast (Capital & Wicklow Route)", description: "Capital-region routes, Wicklow escapes, and short east-coast breaks.", anchor: [0.56, 0.64] },
    { id: "wild-atlantic-west", name: "Wild Atlantic Way (Cliffs & Surf)", description: "Cliff, surf, and scenic-drive itineraries across Ireland's western seaboard.", anchor: [0.52, 0.24] },
    { id: "south-cork-kerry", name: "Southwest Ireland (Harbors & Peninsula Drives)", description: "Food-rich south coast with ring-road routes and harbor towns.", anchor: [0.24, 0.42] },
    { id: "northwest-midlands", name: "Northwest & Midlands (Lakes & Heritage)", description: "Quieter inland and northwest routes with lakes, heritage sites, and road-trip pacing.", anchor: [0.72, 0.42] },
  ],
  "czech-republic": [
    { id: "prague-bohemia", name: "Bohemia (Castles & Spa Towns)", description: "Capital-region routes with castle towns and spa-day itineraries.", anchor: [0.62, 0.4] },
    { id: "moravia-south", name: "Moravia (Wine & Folk Traditions)", description: "Wine villages and food-forward southeastern routes.", anchor: [0.32, 0.7] },
    { id: "northwest-bohemia", name: "Northwest Bohemia (Ore Mountains)", description: "Industrial-heritage districts and mountain-border routes.", anchor: [0.68, 0.22] },
  ],
  poland: [
    { id: "warsaw-central", name: "Central Poland (Capital & Rail Hub)", description: "Capital-centered routes and fast rail links across the country.", anchor: [0.58, 0.56] },
    { id: "krakow-south", name: "Southern Poland (Highlands & Heritage)", description: "Historic southern routes with mountain access and food-rich regional travel.", anchor: [0.24, 0.52] },
    { id: "gdansk-baltic", name: "Baltic Poland (Hanseatic Coast)", description: "Northern coast itineraries with ports, beaches, and old Hanseatic cores.", anchor: [0.78, 0.4] },
    { id: "poznan-wroclaw-west", name: "Western Poland (Historic Trade Corridor)", description: "Western urban corridor with design-forward weekends and rail-friendly routing.", anchor: [0.52, 0.24] },
  ],
  croatia: [
    { id: "istria-kvarner", name: "Istria & Kvarner (Northern Adriatic)", description: "Northern Adriatic peninsulas, island ferries, and seafood-heavy coastal routes.", anchor: [0.62, 0.26] },
    { id: "dalmatia-south", name: "Dalmatia (Island-Hopping Coast)", description: "Adriatic coastline routes with island-hopping and historic port heritage.", anchor: [0.36, 0.54] },
    { id: "zagreb-inland", name: "Continental Croatia (Inland Gateways)", description: "Inland routes with national parks and continental towns.", anchor: [0.72, 0.56] },
  ],
  norway: [
    { id: "oslo-southeast", name: "Southeastern Norway (Capital Gateway)", description: "Capital-region routes, fjord gateways, and easy regional rail loops.", anchor: [0.36, 0.56] },
    { id: "fjord-west", name: "Western Norway (Fjord Route)", description: "Iconic west-coast fjords, ferry corridors, and mountain-road itineraries.", anchor: [0.56, 0.24] },
    { id: "trondheim-mid", name: "Central Norway (Scenic Overland)", description: "Mid-country routes and scenic overland links between north and south.", anchor: [0.62, 0.42] },
    { id: "arctic-north", name: "Northern Norway (Arctic & Aurora)", description: "Northern lights routes and remote island/coast travel.", anchor: [0.82, 0.52] },
  ],
  sweden: [
    { id: "stockholm-east", name: "Eastern Sweden (Archipelago & Design)", description: "Capital-archipelago routes, design districts, and Baltic-facing breaks.", anchor: [0.54, 0.64] },
    { id: "gothenburg-west", name: "West Coast Sweden (Seafood & Ferries)", description: "Seafood coast, island ferries, and west-side cultural routes.", anchor: [0.44, 0.28] },
    { id: "southern-sweden", name: "Southern Sweden (Relaxed Coastal Belt)", description: "Relaxed coastal and countryside itineraries across the southern belt.", anchor: [0.22, 0.44] },
    { id: "lapland-north", name: "Swedish Lapland (Arctic Wilderness)", description: "Northern wilderness routes for aurora, hiking, and winter adventure travel.", anchor: [0.82, 0.5] },
  ],
  denmark: [
    { id: "copenhagen-zealand", name: "Zealand (Design & Dining Core)", description: "Capital-region itineraries with design, dining, and nearby historic towns.", anchor: [0.52, 0.64] },
    { id: "jutland", name: "Jutland (Dunes & Coastal Drives)", description: "Mainland Denmark road routes across dunes and coastal towns.", anchor: [0.56, 0.3] },
    { id: "fyn-islands", name: "Funen & Danish Islands (Cycling Archipelago)", description: "Cycling-friendly islands, harbor towns, and slower inter-island routes.", anchor: [0.44, 0.46] },
  ],
  finland: [
    { id: "helsinki-south", name: "Southern Finland (Archipelago Coast)", description: "Capital-region routes, archipelago ferries, and Baltic coastal breaks.", anchor: [0.34, 0.52] },
    { id: "lakes-central", name: "Lakeland (Sauna & Forest Belt)", description: "Forest-and-lake itineraries with sauna stays and summer road routes.", anchor: [0.56, 0.52] },
    { id: "lapland-north", name: "Finnish Lapland (Arctic Winter Routes)", description: "Aurora travel, winter resorts, and Arctic wilderness routes.", anchor: [0.82, 0.5] },
  ],
  iceland: [
    { id: "reykjavik-southwest", name: "Southwest Iceland (Golden Circle Gateway)", description: "Capital-region base with geothermal routes and classic loop access.", anchor: [0.46, 0.28] },
    { id: "south-coast", name: "South Iceland (Waterfalls & Black-Sand Coast)", description: "Waterfalls, black-sand beaches, and high-impact ring-road highlights.", anchor: [0.26, 0.52] },
    { id: "north-east", name: "North & East Iceland (Volcanic Frontier)", description: "Volcanic zones and quieter long-loop ring-road itineraries.", anchor: [0.74, 0.6] },
  ],
};

function projectPointWithinBounds(
  bounds: [[number, number], [number, number]],
  latRatio: number,
  lngRatio: number,
): [number, number] {
  const [south, west] = bounds[0];
  const [north, east] = bounds[1];

  return [south + (north - south) * latRatio, west + (east - west) * lngRatio];
}

function buildDefaultEuropeanRegionSeeds(country: WorldCountrySeed): SubArea[] {
  return [
    {
      id: "north",
      name: "North",
      coordinates: projectPointWithinBounds(country.bounds, 0.78, 0.5),
      description: `Northern ${country.name} routes with cooler climates, regional cities, and nature-forward travel pacing.`,
    },
    {
      id: "central",
      name: "Central",
      coordinates: projectPointWithinBounds(country.bounds, 0.5, 0.5),
      description: `Central ${country.name} blends major transport hubs, historic cores, and practical multi-stop itineraries.`,
    },
    {
      id: "south",
      name: "South",
      coordinates: projectPointWithinBounds(country.bounds, 0.22, 0.5),
      description: `Southern ${country.name} travel with food-focused routes, warmer coast or valley corridors, and slower scenic drives.`,
    },
  ];
}

function buildEuropeanRegionSeeds(country: WorldCountrySeed): SubArea[] {
  const curatedSeeds = europeanTravelRegionSeedsByCountryId[country.id];

  if (!curatedSeeds?.length) {
    return buildDefaultEuropeanRegionSeeds(country);
  }

  return curatedSeeds.map((seed, index) => {
    const fallbackAnchors: Array<[number, number]> = [
      [0.72, 0.32],
      [0.5, 0.5],
      [0.3, 0.68],
      [0.65, 0.7],
      [0.22, 0.3],
    ];
    const [latRatio, lngRatio] = seed.anchor ?? fallbackAnchors[index % fallbackAnchors.length];

    return {
      id: seed.id,
      name: seed.name,
      description: seed.description,
      coordinates: projectPointWithinBounds(country.bounds, latRatio, lngRatio),
    };
  });
}

const countrySubareaSeeds = new Map<string, SubArea[]>([
  ["United States", usaRegionSeeds],
  ["Mexico", mexicoRegionSeeds],
  ["New Zealand", newZealandRegionSeeds],
]);

const fetchedNeighborhoodMap = new Map(
  Object.entries(
    fetchedCityNeighborhoods as Record<string, Array<{ id: string; name: string; coordinates: number[] }>>,
  ).map(([key, neighborhoods]) => [
    key,
    neighborhoods.map((neighborhood) => ({
      id: neighborhood.id,
      name: neighborhood.name,
      coordinates: [neighborhood.coordinates[0], neighborhood.coordinates[1]] as [number, number],
    })),
  ]),
);

const usaStateSeeds: CountryState[] = [
  { id: "maine", name: "Maine", coordinates: [44.693947, -69.381927], countrySubareaId: "northeast" },
  { id: "new-hampshire", name: "New Hampshire", coordinates: [43.452492, -71.563896], countrySubareaId: "northeast" },
  { id: "vermont", name: "Vermont", coordinates: [44.045876, -72.710686], countrySubareaId: "northeast" },
  { id: "massachusetts", name: "Massachusetts", coordinates: [42.230171, -71.530106], countrySubareaId: "northeast" },
  { id: "rhode-island", name: "Rhode Island", coordinates: [41.680893, -71.51178], countrySubareaId: "northeast" },
  { id: "connecticut", name: "Connecticut", coordinates: [41.597782, -72.755371], countrySubareaId: "northeast" },
  { id: "new-york", name: "New York", coordinates: [42.165726, -74.948051], countrySubareaId: "northeast" },
  { id: "new-jersey", name: "New Jersey", coordinates: [40.298904, -74.521011], countrySubareaId: "northeast" },
  { id: "pennsylvania", name: "Pennsylvania", coordinates: [40.590752, -77.209755], countrySubareaId: "northeast" },
  { id: "delaware", name: "Delaware", coordinates: [39.318523, -75.507141], countrySubareaId: "southeast" },
  { id: "maryland", name: "Maryland", coordinates: [39.063946, -76.802101], countrySubareaId: "southeast" },
  { id: "district-of-columbia", name: "District of Columbia", coordinates: [38.9072, -77.0369], countrySubareaId: "northeast" },
  { id: "virginia", name: "Virginia", coordinates: [37.769337, -78.169968], countrySubareaId: "southeast" },
  { id: "west-virginia", name: "West Virginia", coordinates: [38.491226, -80.954453], countrySubareaId: "southeast" },
  { id: "north-carolina", name: "North Carolina", coordinates: [35.630066, -79.806419], countrySubareaId: "southeast" },
  { id: "south-carolina", name: "South Carolina", coordinates: [33.856892, -80.945007], countrySubareaId: "southeast" },
  { id: "georgia", name: "Georgia", coordinates: [33.040619, -83.643074], countrySubareaId: "southeast" },
  { id: "florida", name: "Florida", coordinates: [27.766279, -81.686783], countrySubareaId: "southeast" },
  { id: "kentucky", name: "Kentucky", coordinates: [37.66814, -84.670067], countrySubareaId: "southeast" },
  { id: "tennessee", name: "Tennessee", coordinates: [35.747845, -86.692345], countrySubareaId: "southeast" },
  { id: "alabama", name: "Alabama", coordinates: [32.806671, -86.79113], countrySubareaId: "southeast" },
  { id: "mississippi", name: "Mississippi", coordinates: [32.741646, -89.678696], countrySubareaId: "southeast" },
  { id: "arkansas", name: "Arkansas", coordinates: [34.969704, -92.373123], countrySubareaId: "southeast" },
  { id: "louisiana", name: "Louisiana", coordinates: [31.169546, -91.867805], countrySubareaId: "southeast" },
  { id: "ohio", name: "Ohio", coordinates: [40.388783, -82.764915], countrySubareaId: "midwest" },
  { id: "michigan", name: "Michigan", coordinates: [43.326618, -84.536095], countrySubareaId: "midwest" },
  { id: "indiana", name: "Indiana", coordinates: [39.849426, -86.258278], countrySubareaId: "midwest" },
  { id: "illinois", name: "Illinois", coordinates: [40.349457, -88.986137], countrySubareaId: "midwest" },
  { id: "wisconsin", name: "Wisconsin", coordinates: [44.268543, -89.616508], countrySubareaId: "midwest" },
  { id: "minnesota", name: "Minnesota", coordinates: [45.694454, -93.900192], countrySubareaId: "midwest" },
  { id: "iowa", name: "Iowa", coordinates: [42.011539, -93.210526], countrySubareaId: "midwest" },
  { id: "missouri", name: "Missouri", coordinates: [38.456085, -92.288368], countrySubareaId: "midwest" },
  { id: "north-dakota", name: "North Dakota", coordinates: [47.528912, -99.784012], countrySubareaId: "midwest" },
  { id: "south-dakota", name: "South Dakota", coordinates: [44.299782, -99.438828], countrySubareaId: "midwest" },
  { id: "nebraska", name: "Nebraska", coordinates: [41.12537, -98.268082], countrySubareaId: "midwest" },
  { id: "kansas", name: "Kansas", coordinates: [38.5266, -96.726486], countrySubareaId: "midwest" },
  { id: "texas", name: "Texas", coordinates: [31.054487, -97.563461], countrySubareaId: "southwest" },
  { id: "oklahoma", name: "Oklahoma", coordinates: [35.565342, -96.928917], countrySubareaId: "southwest" },
  { id: "new-mexico", name: "New Mexico", coordinates: [34.840515, -106.248482], countrySubareaId: "southwest" },
  { id: "arizona", name: "Arizona", coordinates: [33.729759, -111.431221], countrySubareaId: "southwest" },
  { id: "california", name: "California", coordinates: [36.116203, -119.681564], countrySubareaId: "west-coast" },
  { id: "oregon", name: "Oregon", coordinates: [44.572021, -122.070938], countrySubareaId: "west-coast" },
  { id: "washington", name: "Washington", coordinates: [47.400902, -121.490494], countrySubareaId: "west-coast" },
  { id: "alaska", name: "Alaska", coordinates: [61.370716, -152.404419], countrySubareaId: "pacific" },
  { id: "hawaii", name: "Hawaii", coordinates: [21.094318, -157.498337], countrySubareaId: "pacific" },
  { id: "colorado", name: "Colorado", coordinates: [39.059811, -105.311104], countrySubareaId: "southwest" },
  { id: "utah", name: "Utah", coordinates: [40.150032, -111.862434], countrySubareaId: "southwest" },
  { id: "nevada", name: "Nevada", coordinates: [38.313515, -117.055374], countrySubareaId: "southwest" },
  { id: "idaho", name: "Idaho", coordinates: [44.240459, -114.478828], countrySubareaId: "west-coast" },
  { id: "montana", name: "Montana", coordinates: [46.921925, -110.454353], countrySubareaId: "midwest" },
  { id: "wyoming", name: "Wyoming", coordinates: [42.755966, -107.30249], countrySubareaId: "midwest" },
];

const ukStateSeeds: CountryState[] = [
  {
    id: "england",
    name: "England",
    coordinates: [52.3555, -1.1743],
    countrySubareaId: "london-southeast",
    description:
      "England is a cluttered museum held together by red brick and commuter patience. Beyond the Midlands, the landscape dissolves into sodden fields and limestone ridges. Crowded horizons meet ancient silence, with the past tucked into every mossy wall.",
  },
  {
    id: "scotland",
    name: "Scotland",
    coordinates: [56.4907, -4.2026],
    countrySubareaId: "scotland",
    description:
      "Scotland blends Edinburgh and Glasgow city routes with Highlands landscapes, island ferries, and scenic rail travel.",
  },
  {
    id: "wales",
    name: "Wales",
    coordinates: [52.1307, -3.7837],
    countrySubareaId: "wales-northern-ireland",
    description:
      "Wales offers compact capital-city travel, dramatic coastlines, and mountain national park road routes.",
  },
  {
    id: "northern-ireland",
    name: "Northern Ireland",
    coordinates: [54.7877, -6.4923],
    countrySubareaId: "wales-northern-ireland",
    description:
      "Northern Ireland pairs Belfast city breaks with coastal drives, rugged cliffs, and heritage-rich small towns.",
  },
];

const usaStateDescriptionById: Record<string, string> = {
  maine: "Rocky Atlantic coastlines, lobster towns, and pine-forest drives define Maine's classic New England rhythm.",
  "new-hampshire":
    "A compact state where mountain routes, lake towns, and short coastal stretches make easy weekend itineraries.",
  vermont: "Leaf-peeping roads, small mountain towns, and farm-to-table culture give Vermont a slow scenic pace.",
  massachusetts:
    "Historic cities, Cape beaches, and college-town energy make Massachusetts one of the Northeast's most varied states.",
  "rhode-island":
    "A tiny but high-character coastal state with harbor towns, sailing culture, and easy city-to-shore movement.",
  connecticut:
    "A shoreline-and-woodland state blending New England villages, commuter cities, and polished coastal escapes.",
  "new-york":
    "From New York City to the Adirondacks and Finger Lakes, this state spans dense urban culture and major nature routes.",
  "new-jersey":
    "A high-density state with beach towns, suburban corridors, and strong access to major East Coast metros.",
  pennsylvania:
    "Historic cores, river valleys, and rolling countryside give Pennsylvania strong city-and-road-trip range.",
  delaware:
    "A small Mid-Atlantic state with beach resorts, tax-free shopping hubs, and easy Northeast corridor access.",
  maryland:
    "Chesapeake Bay shorelines, seafood towns, and close city links make Maryland highly route-flexible.",
  "district-of-columbia":
    "The U.S. capital district centered on museums, monuments, and walkable neighborhoods with year-round visitor demand.",
  virginia:
    "Colonial history, Blue Ridge mountain routes, and fast-growing metro corridors shape Virginia's travel mix.",
  "west-virginia":
    "A mountain-first state known for river gorges, scenic drives, and outdoor-heavy Appalachian itineraries.",
  "north-carolina":
    "A coast-to-mountain state with fast-growing cities, beach routes, and strong regional food culture.",
  "south-carolina":
    "Historic coastal cities, Lowcountry cuisine, and beach destinations anchor South Carolina's travel appeal.",
  georgia:
    "A major Southeast state balancing Atlanta's urban scale with marsh coastlines, islands, and mountain foothills.",
  florida:
    "A tourism powerhouse of beaches, nightlife cities, theme parks, and warm-weather routes across multiple coasts.",
  kentucky:
    "Horse country, bourbon trails, and music-rich cities give Kentucky a distinct Southern-Midwest character.",
  tennessee:
    "Music cities, Appalachian gateways, and strong barbecue-and-nightlife culture define Tennessee's identity.",
  alabama:
    "Civil rights history, Gulf Coast beaches, and growing food scenes shape Alabama's urban and regional routes.",
  mississippi:
    "Delta music heritage, Gulf shoreline stops, and river towns make Mississippi culturally rich and slower-paced.",
  arkansas:
    "A high-value outdoors state with mountain lakes, Ozark routes, and compact city hubs for base travel.",
  louisiana:
    "Creole-Cajun food culture, live music, and wetlands-to-city contrasts make Louisiana one of the South's most distinctive states.",
  ohio:
    "A lake-and-river state with major Midwest cities, sports culture, and practical road-trip positioning.",
  michigan:
    "Great Lakes coastlines, automotive heritage cities, and northern forest routes define Michigan's broad range.",
  indiana:
    "An accessible Midwest state with sports hubs, college towns, and easy regional-city connections.",
  illinois:
    "Chicago's global pull combines with prairie roads and Mississippi River towns across the rest of the state.",
  wisconsin:
    "Lakefront cities, beer-and-cheese traditions, and Northwoods cabin routes drive Wisconsin travel.",
  minnesota:
    "A water-rich state with twin-city culture, boundary lakes, and summer-winter outdoor itineraries.",
  iowa:
    "A calm, road-trip-friendly state with river towns, state fairs, and steadily improving small-city culture.",
  missouri:
    "A crossroads state where major river cities, Ozark escapes, and music-food traditions intersect.",
  "north-dakota":
    "Big-sky plains, energy-boom towns, and Badlands access shape North Dakota's frontier-style routes.",
  "south-dakota":
    "Black Hills drives, monument routes, and open prairie landscapes make South Dakota an iconic overland state.",
  nebraska:
    "A broad plains state with easy road logistics, Great Plains scenery, and compact city stopovers.",
  kansas:
    "A heartland road-trip state with prairie horizons, college towns, and practical central U.S. positioning.",
  texas:
    "A destination-scale state with major metros, strong regional food identities, and long-distance road networks.",
  oklahoma:
    "A central plains state where western heritage, Native history, and city growth corridors overlap.",
  "new-mexico":
    "High-desert landscapes, adobe architecture, and arts-driven towns make New Mexico visually distinct.",
  arizona:
    "Desert cities, canyon landmarks, and winter-sun travel demand make Arizona a top Southwest anchor.",
  california:
    "A coast-to-desert megastate with global cities, wine country, national parks, and year-round travel density.",
  oregon:
    "Volcanic peaks, forested coastlines, and food-forward cities give Oregon strong nature-meets-urban range.",
  washington:
    "A Pacific Northwest state balancing Seattle's urban pull with islands, mountains, and evergreen road routes.",
  alaska:
    "An immense, wilderness-first state of glaciers, fjords, and remote adventure routes anchored by a few key hubs.",
  hawaii:
    "An island chain state blending beach culture, volcano landscapes, and resort-to-local neighborhood contrasts.",
  colorado:
    "A mountain-centered state with high-demand ski routes, hiking towns, and strong urban base cities.",
  utah: "Red-rock parks, alpine ski regions, and clean-planned cities make Utah a top outdoor travel state.",
  nevada:
    "Entertainment-scale Las Vegas combines with desert road trips, alpine lake routes, and wide-open terrain.",
  idaho:
    "A fast-rising mountain state with river valleys, ski zones, and low-friction city gateways for outdoor trips.",
  montana:
    "Big-sky mountain country with national park access, ranch-town culture, and long scenic drive routes.",
  wyoming:
    "A low-density mountain state anchored by Yellowstone, Tetons, and classic western overland itineraries.",
};

const usaCitySeeds: Array<
  Omit<City, "listCount" | "country" | "continent"> & {
    stateId: string;
    countrySubareaId: string;
  }
> = [
  { id: "birmingham", name: "Birmingham", coordinates: [33.5186, -86.8104], stateId: "alabama", countrySubareaId: "southeast", image: cityImage("birmingham"), description: "Birmingham is a civil-rights and food-led Alabama anchor where historic districts, barbecue and meat-and-three stops, breweries, galleries, and Red Mountain day routes make a practical Southeast city base. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "anchorage", name: "Anchorage", coordinates: [61.2181, -149.9003], stateId: "alaska", countrySubareaId: "pacific", image: cityImage("anchorage"), description: "Anchorage is Alaska's main urban base for trips that need mountain views, local seafood, museums, breweries, coastal trails, and road access toward glaciers, wildlife routes, and wider south-central Alaska. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "phoenix", name: "Phoenix", coordinates: [33.4484, -112.074], stateId: "arizona", countrySubareaId: "southwest", image: cityImage("phoenix"), description: "Phoenix works as a desert metro base where resort stays, Sonoran food, cocktail bars, art districts, golf, trailheads, and Scottsdale or Tempe side routes shape a city-and-nature trip. The best days hinge on timing: start in the city, then let the season, drive, and landscape decide how far the route stretches." },
  { id: "little-rock", name: "Little Rock", coordinates: [34.7465, -92.2896], stateId: "arkansas", countrySubareaId: "southeast", image: cityImage("littlerock"), description: "Little Rock is a compact Arkansas river city where civil-rights history, breweries, neighborhood restaurants, market streets, and short outdoor routes make the capital useful for regional road trips. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "los-angeles", name: "Los Angeles", coordinates: [34.0522, -118.2437], stateId: "california", countrySubareaId: "west-coast", image: cityImage("losangeles"), description: "Los Angeles is a spread-out coastal city where beach days, studio history, design hotels, destination restaurants, taco routes, museums, nightlife, and canyon or freeway geography shape the trip by neighborhood. It rewards a point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "san-francisco", name: "San Francisco", coordinates: [37.7749, -122.4194], stateId: "california", countrySubareaId: "west-coast", image: cityImage("sanfrancisco"), description: "San Francisco is a compact bay city where steep neighborhoods, ferry and waterfront views, serious restaurants, park walks, museums, cocktail rooms, and quick Marin or wine-country routes fit into tight days. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "denver", name: "Denver", coordinates: [39.7392, -104.9903], stateId: "colorado", countrySubareaId: "southwest", image: cityImage("denver"), description: "Denver is a mountain-facing city base for brewery districts, RiNo art, Union Station hotels, sports nights, regional food, Red Rocks plans, and foothill or ski-country routes that start just beyond town. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "new-haven", name: "New Haven", coordinates: [41.3083, -72.9279], stateId: "connecticut", countrySubareaId: "northeast", image: cityImage("newhaven"), description: "New Haven is a walkable Northeast city where Yale museums, pizza institutions, compact bars, historic greens, waterfront pockets, and rail access make it useful for food and culture-focused short trips. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "wilmington", name: "Wilmington", coordinates: [39.7447, -75.5484], stateId: "delaware", countrySubareaId: "southeast", image: cityImage("wilmington"), description: "Wilmington is a compact Mid-Atlantic base where riverfront walks, DuPont-era estates, neighborhood dining, small museums, and easy rail or road links make Delaware browsing more than a pass-through. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "miami", name: "Miami", coordinates: [25.7617, -80.1918], stateId: "florida", countrySubareaId: "southeast", image: cityImage("miami"), description: "Miami is a coastal city where beach days, Cuban and Caribbean food, design hotels, art districts, late clubs, rooftop bars, and Everglades or Keys routes turn the trip into neighborhood choices. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "orlando", name: "Orlando", coordinates: [28.5383, -81.3792], stateId: "florida", countrySubareaId: "southeast", image: cityImage("orlando"), description: "Orlando is more than theme-park logistics, with resort stays, convention routes, Mills 50 and Winter Park food, cocktail bars, lakes, and day trips that make the city useful before and after parks. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "atlanta", name: "Atlanta", coordinates: [33.749, -84.388], stateId: "georgia", countrySubareaId: "southeast", image: cityImage("atlanta"), description: "Atlanta is a Southeast hub where civil-rights history, BeltLine neighborhoods, destination dining, music, sports, cocktail rooms, and tree-covered districts create practical food, culture, and nightlife routes. It rewards a point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "honolulu", name: "Honolulu", coordinates: [21.3069, -157.8583], stateId: "hawaii", countrySubareaId: "pacific", image: cityImage("honolulu"), description: "Honolulu is an island-city base where Waikiki stays, plate lunches, surf breaks, Chinatown bars, palace history, beach parks, and windward or North Shore routes connect city browsing with Oahu days. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "boise", name: "Boise", coordinates: [43.615, -116.2023], stateId: "idaho", countrySubareaId: "west-coast", image: cityImage("boise"), description: "Boise is a polished small-city base where river paths, Basque food, breweries, foothill trails, downtown hotels, and mountain or wine-country side trips make Idaho routes easy to build. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "chicago", name: "Chicago", coordinates: [41.8781, -87.6298], stateId: "illinois", countrySubareaId: "midwest", image: cityImage("chicago"), description: "Chicago is a lakefront city where architecture, neighborhood food, museums, sports, jazz and cocktail rooms, river walks, and train-connected districts make dense city routes feel clear by area. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "indianapolis", name: "Indianapolis", coordinates: [39.7684, -86.1581], stateId: "indiana", countrySubareaId: "midwest", image: cityImage("indianapolis"), description: "Indianapolis is an easy Midwest city base where sports venues, Mass Ave bars, museums, canal walks, breweries, race-week energy, hotel districts, and neighborhood restaurants shape short trips. It rewards a point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "des-moines", name: "Des Moines", coordinates: [41.5868, -93.625], stateId: "iowa", countrySubareaId: "midwest", image: cityImage("desmoines"), description: "Des Moines is a manageable capital city where East Village restaurants, breweries, public art, farmers markets, civic museums, and road-trip access make Iowa browsing feel practical and local. It works best on foot, with landmarks as the spine and meals or neighborhood detours keeping it from feeling dutiful." },
  { id: "wichita", name: "Wichita", coordinates: [37.6872, -97.3301], stateId: "kansas", countrySubareaId: "midwest", image: cityImage("wichita"), description: "Wichita is Kansas' main urban stop for river walks, aviation history, Old Town dining, breweries, museums, and regional road-trip planning across the plains. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for weather, too." },
  { id: "louisville", name: "Louisville", coordinates: [38.2527, -85.7585], stateId: "kentucky", countrySubareaId: "southeast", image: cityImage("louisville"), description: "Louisville is a river city where bourbon rooms, NuLu restaurants, live music, horse-racing history, museum stops, and neighborhood bars make a strong Kentucky city-and-region anchor. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather." },
  { id: "new-orleans", name: "New Orleans", coordinates: [29.9511, -90.0715], stateId: "louisiana", countrySubareaId: "southeast", image: cityImage("neworleans"), description: "New Orleans is a deeply distinctive city where Creole and Cajun food, live music, cocktail history, courtyard hotels, neighborhood walks, and late-night rooms shape trips beyond Bourbon Street. It works best on foot, with landmarks as the spine and meals or neighborhood detours keeping it from feeling dutiful." },
  { id: "portland-me", name: "Portland", coordinates: [43.6591, -70.2568], stateId: "maine", countrySubareaId: "northeast", image: cityImage("portlandmaine"), description: "Portland, Maine is a compact coastal city where seafood counters, bakeries, breweries, harbor walks, design-forward inns, and island or lighthouse routes make a tight New England food base. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "baltimore", name: "Baltimore", coordinates: [39.2904, -76.6122], stateId: "maryland", countrySubareaId: "southeast", image: cityImage("baltimore"), description: "Baltimore is a harbor city where rowhouse neighborhoods, crab houses, markets, museums, dive bars, art spaces, and waterfront walks give Mid-Atlantic routes a strong local edge. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather." },
  { id: "washington-dc", name: "Washington, DC", coordinates: [38.9072, -77.0369], stateId: "district-of-columbia", countrySubareaId: "northeast", image: cityImage("washingtondc"), description: "Washington, DC is a museum-and-monument capital where federal landmarks, neighborhood dining, cocktail corridors, hotel bases, parks, embassies, waterfront pockets, and easy transit make culture-heavy trips efficient. It rewards a point of view: tight geography, realistic pacing, and a few anchors worth the detour." },
  { id: "boston", name: "Boston", coordinates: [42.3601, -71.0589], stateId: "massachusetts", countrySubareaId: "northeast", image: cityImage("boston"), description: "Boston is a compact historic city where harbor walks, universities, sports bars, seafood, Italian dinners, museums, and Cambridge or North Shore side routes fit cleanly into walkable days. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "detroit", name: "Detroit", coordinates: [42.3314, -83.0458], stateId: "michigan", countrySubareaId: "midwest", image: cityImage("detroit"), description: "Detroit is a design and music city where downtown renewal, Eastern Market food, riverfront walks, architecture, galleries, cocktail rooms, and neighborhood history shape a strong Midwest route. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "minneapolis", name: "Minneapolis", coordinates: [44.9778, -93.265], stateId: "minnesota", countrySubareaId: "midwest", image: cityImage("minneapolis"), description: "Minneapolis is an outdoor-friendly city where lakes, river paths, theater, museums, breweries, Nordic-leaning dining, and neighborhood districts keep culture and nature close together. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "jackson", name: "Jackson", coordinates: [32.2988, -90.1848], stateId: "mississippi", countrySubareaId: "southeast", image: cityImage("jacksonms"), description: "Jackson is Mississippi's capital base for civil-rights history, blues and soul-food routes, museums, neighborhood restaurants, and wider Delta or Natchez Trace trip planning. It works best on foot, with landmarks as the spine and meals or neighborhood detours keeping it from feeling dutiful." },
  { id: "st-louis", name: "St. Louis", coordinates: [38.627, -90.1994], stateId: "missouri", countrySubareaId: "midwest", image: cityImage("stlouis"), description: "St. Louis is a Mississippi River city where Gateway Arch views, blues rooms, barbecue, Italian Hill dining, Forest Park museums, sports, and neighborhood bars make varied Midwest routes. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "billings", name: "Billings", coordinates: [45.7833, -108.5007], stateId: "montana", countrySubareaId: "midwest", image: cityImage("billings"), description: "Billings is a practical Montana hub where Rimrocks views, breweries, downtown food, Western history, and road access toward Yellowstone country help organize wider high-plains travel. The best days hinge on timing: start in the city, then let the season, drive, and landscape decide how far the route stretches." },
  { id: "omaha", name: "Omaha", coordinates: [41.2565, -95.9345], stateId: "nebraska", countrySubareaId: "midwest", image: cityImage("omaha"), description: "Omaha is a steady Midwest city where Old Market streets, riverfront paths, music rooms, steakhouses, coffee, museums, and neighborhood food make short routes easy to plan. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather." },
  { id: "las-vegas", name: "Las Vegas", coordinates: [36.1699, -115.1398], stateId: "nevada", countrySubareaId: "southwest", image: cityImage("lasvegas"), description: "Las Vegas is a destination city where Strip resorts, late restaurants, cocktail rooms, shows, Chinatown food, downtown bars, pools, and desert day trips make planning about pace and budget. The best days hinge on timing: start in the city, then let the season, drive, and landscape decide how far the route stretches." },
  { id: "manchester", name: "Manchester", coordinates: [42.9956, -71.4548], stateId: "new-hampshire", countrySubareaId: "northeast", image: cityImage("manchesternh"), description: "Manchester is a practical New Hampshire anchor where mill-district history, local restaurants, breweries, river walks, and White Mountains or seacoast routes keep city stops useful. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather." },
  { id: "newark", name: "Newark", coordinates: [40.7357, -74.1724], stateId: "new-jersey", countrySubareaId: "northeast", image: cityImage("newark"), description: "Newark is a transit-rich North Jersey base where Portuguese and Brazilian food, arts venues, parks, airport logistics, and rail links make metro-area routes more flexible. The eating and drinking land best when they feel rooted in place, with enough neighborhood logic to carry a full day." },
  { id: "albuquerque", name: "Albuquerque", coordinates: [35.0844, -106.6504], stateId: "new-mexico", countrySubareaId: "southwest", image: cityImage("albuquerque"), description: "Albuquerque is a high-desert city where Pueblo and Route 66 history, chile-heavy food, breweries, Sandia views, balloon events, and Santa Fe or desert road trips define the route. The best days hinge on timing: start in the city, then let the season, drive, and landscape decide how far the route stretches." },
  { id: "new-york-city", name: "New York City", coordinates: [40.7128, -74.006], stateId: "new-york", countrySubareaId: "northeast", subareas: citySubareaSeeds.get("New York City|United States"), image: cityImage("nyc"), description: "New York City is a dense five-borough city where neighborhood food, museums, theater, parks, cocktail rooms, hotels, and late transit make every guide choice about geography and pace. It works best on foot, with landmarks as the spine and meals or neighborhood detours keeping it from feeling dutiful." },
  { id: "charlotte", name: "Charlotte", coordinates: [35.2271, -80.8431], stateId: "north-carolina", countrySubareaId: "southeast", image: cityImage("charlotte"), description: "Charlotte is a fast-growing Southeast city where Uptown business travel, breweries, sports, barbecue, modern Southern dining, greenways, and neighborhood districts create practical weekend routes. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "fargo", name: "Fargo", coordinates: [46.8772, -96.7898], stateId: "north-dakota", countrySubareaId: "midwest", image: cityImage("fargo"), description: "Fargo is North Dakota's clearest urban stop, with downtown restaurants, breweries, arts spaces, river walks, and regional road-trip logistics giving the plains a local-feeling base. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather." },
  { id: "columbus", name: "Columbus", coordinates: [39.9612, -82.9988], stateId: "ohio", countrySubareaId: "midwest", image: cityImage("columbus"), description: "Columbus is a youthful Midwest city where campus energy, Short North dining, breweries, sports, markets, museums, and German Village walks make district-based routes easy. It works best on foot, with landmarks as the spine and meals or neighborhood detours keeping it from feeling dutiful." },
  { id: "oklahoma-city", name: "Oklahoma City", coordinates: [35.4676, -97.5164], stateId: "oklahoma", countrySubareaId: "southwest", image: cityImage("oklahomacity"), description: "Oklahoma City is a broad capital where Western heritage, the memorial district, Stockyards dining, breweries, Paseo arts, Scissortail Park, and road-trip pacing shape the visit. It works best on foot, with landmarks as the spine and meals or neighborhood detours keeping it from feeling dutiful." },
  { id: "portland-or", name: "Portland", coordinates: [45.5152, -122.6784], stateId: "oregon", countrySubareaId: "west-coast", image: cityImage("portlandoregon"), description: "Portland, Oregon is a neighborhood-led city where food carts, coffee, bookstores, breweries, cocktail bars, gardens, design hotels, and Columbia Gorge or coast routes fit naturally together. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "philadelphia", name: "Philadelphia", coordinates: [39.9526, -75.1652], stateId: "pennsylvania", countrySubareaId: "northeast", image: cityImage("philadelphia"), description: "Philadelphia is a compact historic city where old-city landmarks, serious restaurants, markets, museums, sports bars, riverfronts, and neighborhood taverns reward walking over rushing. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "providence", name: "Providence", coordinates: [41.824, -71.4128], stateId: "rhode-island", countrySubareaId: "northeast", image: cityImage("providence"), description: "Providence is a creative small city where Federal Hill food, RISD culture, river walks, cocktail bars, bakeries, and compact neighborhoods make tight New England routes feel full. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather." },
  { id: "charleston-sc", name: "Charleston", coordinates: [32.7765, -79.9311], stateId: "south-carolina", countrySubareaId: "southeast", image: cityImage("charlestonsc"), description: "Charleston is a polished Southern coastal city where historic streets, seafood, Lowcountry cooking, boutique stays, cocktail rooms, beaches, and plantation or harbor routes shape the trip. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "sioux-falls", name: "Sioux Falls", coordinates: [43.5446, -96.7311], stateId: "south-dakota", countrySubareaId: "midwest", image: cityImage("siouxfalls"), description: "Sioux Falls is South Dakota's clearest city base, with Falls Park, breweries, downtown dining, river paths, local museums, and regional stopover routes across the eastern plains. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather." },
  { id: "nashville", name: "Nashville", coordinates: [36.1627, -86.7816], stateId: "tennessee", countrySubareaId: "southeast", image: cityImage("nashville"), description: "Nashville is a music-first city where honky-tonks, songwriter rooms, hot chicken, boutique hotels, cocktail bars, museums, coffee stops, vintage shops, and fast-moving neighborhoods shape high-demand weekend trips. It rewards a point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "dallas", name: "Dallas", coordinates: [32.7767, -96.797], stateId: "texas", countrySubareaId: "southwest", image: cityImage("dallas"), description: "Dallas is a big, district-driven city where steakhouse and Tex-Mex meals, art museums, design shopping, hotel bars, sports, and Deep Ellum or Bishop Arts routes shape the visit. It works best on foot, with landmarks as the spine and meals or neighborhood detours keeping it from feeling dutiful." },
  { id: "salt-lake-city", name: "Salt Lake City", coordinates: [40.7608, -111.891], stateId: "utah", countrySubareaId: "southwest", image: cityImage("saltlakecity"), description: "Salt Lake City is a mountain-ringed base where downtown dining, breweries, temple history, ski logistics, trail access, and Great Salt Lake or canyon routes connect city and outdoors. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "burlington", name: "Burlington", coordinates: [44.4759, -73.2121], stateId: "vermont", countrySubareaId: "northeast", image: cityImage("burlington"), description: "Burlington is a small Lake Champlain city where farm-to-table food, breweries, college-town energy, waterfront paths, indie shops, and Green Mountain routes make Vermont browsing easy. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "richmond", name: "Richmond", coordinates: [37.5407, -77.436], stateId: "virginia", countrySubareaId: "southeast", image: cityImage("richmond"), description: "Richmond is a river city where murals, breweries, museums, historic districts, modern Southern food, design shops, and James River trails give Virginia routes a strong local center. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather." },
  { id: "seattle", name: "Seattle", coordinates: [47.6062, -122.3321], stateId: "washington", countrySubareaId: "west-coast", image: cityImage("seattle"), description: "Seattle is a water-and-mountain city where coffee, Pike Place, seafood, music history, cocktail rooms, ferries, parks, and island or national-park day trips shape neighborhood routes. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for." },
  { id: "charleston-wv", name: "Charleston", coordinates: [38.3498, -81.6326], stateId: "west-virginia", countrySubareaId: "southeast", image: cityImage("charlestonwv"), description: "Charleston, West Virginia is a compact capital base where riverfront walks, Appalachian food, state history, music, and mountain or New River routes keep statewide trips grounded. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather." },
  { id: "milwaukee", name: "Milwaukee", coordinates: [43.0389, -87.9065], stateId: "wisconsin", countrySubareaId: "midwest", image: cityImage("milwaukee"), description: "Milwaukee is a lakefront city where beer halls, markets, festivals, art museums, taverns, sports, and neighborhood food routes give Wisconsin trips a strong urban anchor. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather." },
  { id: "cheyenne", name: "Cheyenne", coordinates: [41.14, -104.8202], stateId: "wyoming", countrySubareaId: "midwest", image: cityImage("cheyenne"), description: "Cheyenne is a high-plains capital where railroad history, rodeo culture, state museums, downtown bars, and wider Wyoming road routes make it a practical western stop. It works best on foot, with landmarks as the spine and meals or neighborhood detours keeping it from feeling dutiful." },
];

function withSeededSubareas(city: Omit<City, "listCount">): Omit<City, "listCount"> {
  const nycBoroughNames = new Set(["Manhattan", "Brooklyn", "Queens", "The Bronx", "Staten Island"]);

  const buildNeighborhoodDescription = (
    subareaName: string,
    cityName: string,
    parentSubareaName?: string,
    existingDescription?: string,
  ) => {
    const normalizedName = normalizePlaceName(subareaName);
    const cityKey = `${normalizePlaceName(cityName)}|${normalizedName}`;
    const angle =
      specificNeighborhoodAngles.get(cityKey) ??
      neighborhoodNameAngles.get(normalizedName) ??
      [...neighborhoodNameAngles.entries()].find(([key]) => normalizedName.includes(key))?.[1];
    const baseDescription = angle
      ? withTerminalPeriod(`${subareaName} is ${angle.identity}`)
      : existingDescription?.trim() ??
        (parentSubareaName
          ? `${subareaName} is a ${parentSubareaName}, ${cityName} pocket that works better as a tight route than as part of a broad borough sweep.`
          : `${subareaName} is a ${cityName} neighborhood that works better as a tight route than as part of a broad citywide sweep.`);

    if (baseDescription.length >= 270) {
      return baseDescription;
    }

    const parentLabel = parentSubareaName
      ? nycBoroughNames.has(parentSubareaName)
        ? `${parentSubareaName} borough`
        : parentSubareaName
      : null;
    const routeSentence =
      (angle ? withTerminalPeriod(angle.route) : null) ??
      (parentLabel
        ? `It works best as a ${parentLabel} route when the picks name a real cluster, street edge, park, market, waterfront, or night strip instead of spreading across the map.`
        : `It works best when the picks name a real cluster, street edge, park, market, waterfront, or night strip instead of spreading across the map.`);
    const expanded = `${baseDescription} ${routeSentence}`;

    if (expanded.length <= 320) {
      return expanded;
    }

    const shorterRoute = parentLabel
      ? `It works best as a ${parentLabel} route with a clear cluster, realistic walking time, and concrete local anchors.`
      : "It works best with a clear cluster, realistic walking time, and concrete local anchors.";
    return `${baseDescription} ${shorterRoute}`;
  };

  const withSubareaDescriptions = (subareas: SubArea[], parentSubareaName?: string): SubArea[] =>
    subareas.map((subarea) => ({
      ...subarea,
      description:
        buildNeighborhoodDescription(subarea.name, city.name, parentSubareaName, subarea.description),
      subareas: subarea.subareas?.length
        ? withSubareaDescriptions(subarea.subareas, subarea.name)
        : undefined,
    }));

  if (city.subareas?.length) {
    return {
      ...city,
      subareas: withSubareaDescriptions(city.subareas),
    };
  }

  const seededSubareas = citySubareaSeeds.get(`${city.name}|${city.country}`);
  if (seededSubareas?.length) {
    return { ...city, subareas: withSubareaDescriptions(seededSubareas) };
  }

  const fetchedSubareas =
    fetchedNeighborhoodMap.get(city.id) ?? fetchedNeighborhoodMap.get(`${city.name}|${city.country}`);
  return fetchedSubareas?.length ? { ...city, subareas: withSubareaDescriptions(fetchedSubareas) } : city;
}

const curatedCitySeeds: Record<string, Omit<City, "listCount">[]> = {
  usa: [
    {
      id: "new-york-city",
      name: "New York City",
      country: "United States",
      continent: "North America",
      coordinates: [40.7128, -74.006],
      countrySubareaId: "northeast",
      subareas: citySubareaSeeds.get("New York City|United States"),
      image: cityImage("nyc"),
      description:
        "New York City is a dense, always-on city where museums, restaurants, cocktail bars, parks, hotels, shops, and subway-linked neighborhoods make the useful trip shift block by block. It works best on foot, with landmarks as the spine and meals or neighborhood detours keeping it from feeling dutiful.",
    },
    {
      id: "los-angeles",
      name: "Los Angeles",
      country: "United States",
      continent: "North America",
      coordinates: [34.0522, -118.2437],
      countrySubareaId: "west-coast",
      image: cityImage("losangeles"),
      description:
        "Los Angeles is sunlit sprawl where beach mornings, studio history, taco routes, design hotels, museums, canyon drives, shopping streets, and destination dining all coexist by neighborhood. It rewards a point of view: tight geography, realistic pacing, and a few anchors worth crossing town for.",
    },
    {
      id: "chicago",
      name: "Chicago",
      country: "United States",
      continent: "North America",
      coordinates: [41.8781, -87.6298],
      countrySubareaId: "midwest",
      image: cityImage("chicago"),
      description:
        "Chicago is a lakefront city where architecture, museums, neighborhood taverns, deep food traditions, sports, hotels, river walks, and summer beaches make routes work by season and train line. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for.",
    },
    {
      id: "houston",
      name: "Houston",
      country: "United States",
      continent: "North America",
      coordinates: [29.7604, -95.3698],
      countrySubareaId: "southwest",
      image: cityImage("houston"),
      description:
        "Houston is a huge, fast-growing city where global restaurants, museums, markets, cocktail bars, sports, hotel districts, parks, and sprawling local favorites make planning about neighborhoods and drive time. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for.",
    },
    {
      id: "phoenix",
      name: "Phoenix",
      country: "United States",
      continent: "North America",
      coordinates: [33.4484, -112.074],
      countrySubareaId: "southwest",
      image: cityImage("phoenix"),
      description:
        "Phoenix is a desert metro where resort pools, Sonoran food, cocktail bars, art districts, golf, trailheads, Scottsdale stops, and Tempe side routes make the city useful for urban and nature days. The best days hinge on timing: start in the city, then let the season, drive, and landscape set the route.",
    },
    {
      id: "philadelphia",
      name: "Philadelphia",
      country: "United States",
      continent: "North America",
      coordinates: [39.9526, -75.1652],
      countrySubareaId: "northeast",
      image: cityImage("philadelphia"),
      description:
        "Philadelphia is compact, historic, and neighborhood-driven, with museums, rowhouse streets, market food, restaurants, parks, bars, hotels, and walkable districts that keep the trip local after the landmark stops. It rewards a point of view: tight geography, realistic pacing, and a few anchors worth crossing town for.",
    },
    {
      id: "san-antonio",
      name: "San Antonio",
      country: "United States",
      continent: "North America",
      coordinates: [29.4241, -98.4936],
      countrySubareaId: "southwest",
      image: cityImage("sanantonio"),
      description:
        "San Antonio is a warm, fast-growing city where riverfront staples, missions, Tex-Mex institutions, cocktail bars, hotels, markets, Pearl-area dining, and relaxed local picks fit into easy days. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for.",
    },
    {
      id: "san-diego",
      name: "San Diego",
      country: "United States",
      continent: "North America",
      coordinates: [32.7157, -117.1611],
      countrySubareaId: "west-coast",
      image: cityImage("sandiego"),
      description:
        "San Diego is a beach-and-neighborhood city where tacos, breweries, surf breaks, parks, hotels, harbor walks, Balboa museums, and coastal day routes make slower lifestyle-led curation feel natural. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for.",
    },
    {
      id: "dallas",
      name: "Dallas",
      country: "United States",
      continent: "North America",
      coordinates: [32.7767, -96.797],
      countrySubareaId: "southwest",
      image: cityImage("dallas"),
      description:
        "Dallas is a big-scale city where steakhouses, design districts, museums, hotels, cocktail bars, retail corridors, sports, and quick side trips make guide routes work best by area and itinerary style. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for.",
    },
    {
      id: "jacksonville",
      name: "Jacksonville",
      country: "United States",
      continent: "North America",
      coordinates: [30.3322, -81.6557],
      countrySubareaId: "southeast",
      image: cityImage("jacksonville"),
      description:
        "Jacksonville is a broad river-and-coast city where beach time, breweries, seafood, arts districts, parks, hotels, St. Johns River views, and local favorites stretch across practical drive-based routes. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for.",
    },
    {
      id: "miami",
      name: "Miami",
      country: "United States",
      continent: "North America",
      coordinates: [25.7617, -80.1918],
      countrySubareaId: "southeast",
      image: cityImage("miami"),
      description:
        "Miami is a high-energy coastal city where beaches, Cuban and Caribbean food, art districts, design hotels, rooftop bars, late clubs, waterfront walks, and Keys or Everglades side routes define the trip. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for.",
    },
    {
      id: "orlando",
      name: "Orlando",
      country: "United States",
      continent: "North America",
      coordinates: [28.5383, -81.3792],
      countrySubareaId: "southeast",
      image: cityImage("orlando"),
      description:
        "Orlando is more than park logistics: resort stays, convention days, lakes, Winter Park afternoons, Mills 50 meals, outlet runs, food halls, and cocktail stops all change how the trip works. The useful route gives visitors something good before, between, and after the ticketed main event.",
    },
    {
      id: "las-vegas",
      name: "Las Vegas",
      country: "United States",
      continent: "North America",
      coordinates: [36.1699, -115.1398],
      countrySubareaId: "southwest",
      image: cityImage("lasvegas"),
      description:
        "Las Vegas is a destination-scale city where resorts, dining rooms, shows, clubs, spas, desert day trips, downtown bars, and off-Strip neighborhoods turn a dense guide market into very different trips. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for.",
    },
    {
      id: "san-francisco",
      name: "San Francisco",
      country: "United States",
      continent: "North America",
      coordinates: [37.7749, -122.4194],
      countrySubareaId: "west-coast",
      image: cityImage("sanfrancisco"),
      description:
        "San Francisco is a compact high-demand city where waterfront views, steep neighborhoods, ferry rides, parks, museums, restaurants, cocktail rooms, and quick Marin or wine-country routes fit into tight days. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for.",
    },
    {
      id: "washington-dc",
      name: "Washington, DC",
      country: "United States",
      continent: "North America",
      coordinates: [38.9072, -77.0369],
      countrySubareaId: "northeast",
      image: cityImage("washingtondc"),
      description:
        "Washington, DC is a monument-and-museum capital where federal landmarks, hotel bases, parks, embassies, restaurants, cocktail corridors, and transit-linked neighborhoods make culture-heavy trips efficient. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for.",
    },
    {
      id: "honolulu",
      name: "Honolulu",
      country: "United States",
      continent: "North America",
      coordinates: [21.3069, -157.8583],
      countrySubareaId: "pacific",
      image: cityImage("honolulu"),
      description:
        "Honolulu is an island city where beaches, surf breaks, hotels, food halls, hikes, historic sites, cocktail bars, and Oahu day routes make the useful guide balance resort ease with local neighborhoods. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for.",
    },
    {
      id: "boston",
      name: "Boston",
      country: "United States",
      continent: "North America",
      coordinates: [42.3601, -71.0589],
      countrySubareaId: "northeast",
      image: cityImage("boston"),
      description:
        "Boston is historic, walkable, and dense, with museums, universities, sports nights, seafood, hotels, harbor walks, neighborhood restaurants, and rail-friendly side trips packed into compact city days. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for.",
    },
    {
      id: "new-orleans",
      name: "New Orleans",
      country: "United States",
      continent: "North America",
      coordinates: [29.9511, -90.0715],
      countrySubareaId: "southeast",
      image: cityImage("neworleans"),
      description:
        "New Orleans is a deeply distinctive city where music, Creole cooking, cocktail history, courtyard hotels, streetcars, markets, and cemetery walks all pull beyond Bourbon Street. The best days move slowly on purpose, letting neighborhood texture carry the trip into late plans.",
    },
    {
      id: "nashville",
      name: "Nashville",
      country: "United States",
      continent: "North America",
      coordinates: [36.1627, -86.7816],
      countrySubareaId: "southeast",
      image: cityImage("nashville"),
      description:
        "Nashville is a music-first weekend city, but the best routes look past Broadway into songwriter rooms, hot chicken counters, vintage shops, hotel districts, and neighborhood bars. It rewards a tight plan that lets daytime browsing build naturally toward late shows and second stops.",
    },
    {
      id: "seattle",
      name: "Seattle",
      country: "United States",
      continent: "North America",
      coordinates: [47.6062, -122.3321],
      countrySubareaId: "west-coast",
      image: cityImage("seattle"),
      description:
        "Seattle is a water-and-hill city where coffee, markets, seafood, music rooms, design hotels, ferry views, museums, parks, and neighborhood micro-scenes make routes depend on weather and transit. It rewards a firm point of view: tight geography, realistic pacing, and a few anchors worth crossing town for.",
    },
  ],
  canada: [
    {
      id: "toronto",
      name: "Toronto",
      country: "Canada",
      continent: "North America",
      coordinates: [43.6532, -79.3832],
      image: cityImage("toronto"),
      description: topCityDescriptionOverrides.get("toronto")!,
    },
    {
      id: "vancouver",
      name: "Vancouver",
      country: "Canada",
      continent: "North America",
      coordinates: [49.2827, -123.1207],
      image: cityImage("vancouver"),
      description:
        "Vancouver is a mountain-and-water city where sushi, cafes, seawall walks, design hotels, beaches, cocktail rooms, and North Shore or island day trips keep city and nature close. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather.",
    },
  ],
  mexico: [
    {
      id: "mexico-city",
      name: "Mexico City",
      country: "Mexico",
      continent: "North America",
      coordinates: [19.4326, -99.1332],
      countrySubareaId: "central",
      image: cityImage("mexicocity"),
      description:
        "Mexico City is a layered high-altitude capital where markets, museums, taco routes, design hotels, cocktail bars, parks, and Roma, Condesa, Centro, and Coyoacan shape the trip. It works best on foot, with landmarks as the spine and meals or neighborhood detours keeping it from feeling dutiful.",
    },
    {
      id: "guadalajara",
      name: "Guadalajara",
      country: "Mexico",
      continent: "North America",
      coordinates: [20.6597, -103.3496],
      countrySubareaId: "west",
      image: cityImage("guadalajara"),
      description:
        "Guadalajara is a western Mexico hub where tequila-country day trips, mariachi history, modern dining, markets, design hotels, plazas, and late bars build a strong regional route. It works best on foot, with landmarks as the spine and meals or neighborhood detours keeping it from feeling dutiful.",
    },
    {
      id: "cancun",
      name: "Cancun",
      country: "Mexico",
      continent: "North America",
      coordinates: [21.1619, -86.8515],
      countrySubareaId: "south",
      image: cityImage("cancun"),
      description: topCityDescriptionOverrides.get("cancun")!,
    },
  ],
  brazil: [
    {
      id: "rio-de-janeiro",
      name: "Rio de Janeiro",
      country: "Brazil",
      continent: "South America",
      coordinates: [-22.9068, -43.1729],
      image: cityImage("rio"),
      description:
        "Rio de Janeiro is a beach-and-mountain city where viewpoints, samba nights, boteco food, design stays, museum stops, and Copacabana, Ipanema, Santa Teresa, and Lapa shape the trip. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather.",
    },
    {
      id: "sao-paulo",
      name: "Sao Paulo",
      country: "Brazil",
      continent: "South America",
      coordinates: [-23.5558, -46.6396],
      image: cityImage("saopaulo"),
      description:
        "Sao Paulo is a vast creative capital where the food, galleries, bars, and design hotels reward travelers who choose a few districts instead of chasing the whole map. The city feels strongest when Japanese, Italian, market, and late-night routes are planned with real pacing.",
    },
  ],
  argentina: [
    {
      id: "buenos-aires",
      name: "Buenos Aires",
      country: "Argentina",
      continent: "South America",
      coordinates: [-34.6037, -58.3816],
      image: cityImage("buenosaires"),
      description:
        "Buenos Aires is a late-night city of parrillas, cafes, bookstores, tango rooms, leafy barrios, markets, and long dinners that rarely reward rushing. The strongest routes let Palermo, Recoleta, San Telmo, and La Boca each carry a different mood from afternoon walks into drinks.",
    },
    {
      id: "mendoza",
      name: "Mendoza",
      country: "Argentina",
      continent: "South America",
      coordinates: [-32.8895, -68.8458],
      image: cityImage("mendoza"),
      description:
        "Mendoza is a wine-country gateway where sunny plazas, grill restaurants, vineyard lodges, Andes views, tasting rooms, and outdoor routes make the city a base for slower regional travel. The best days hinge on timing: start in the city, then let the season, drive, and landscape decide how far the route stretches.",
    },
  ],
  colombia: [
    {
      id: "bogota",
      name: "Bogota",
      country: "Colombia",
      continent: "South America",
      coordinates: [4.711, -74.0721],
      image: cityImage("bogota"),
      description:
        "Bogota is a high-altitude capital where coffee, museums, markets, contemporary restaurants, Chapinero bars, La Candelaria history, and mountain views create culture-heavy routes. The best days hinge on timing: start in the city, then let the season, drive, and landscape decide how far the route stretches.",
    },
    {
      id: "medellin",
      name: "Medellin",
      country: "Colombia",
      continent: "South America",
      coordinates: [6.2442, -75.5812],
      image: cityImage("medellin"),
      description:
        "Medellin is a valley city where spring weather, metro and cable-car routes, El Poblado dining, Laureles cafes, Comuna 13 tours, nightlife, and mountain views define the trip. The best days hinge on timing: start in the city, then let the season, drive, and landscape decide how far the route stretches.",
    },
  ],
  peru: [
    {
      id: "lima",
      name: "Lima",
      country: "Peru",
      continent: "South America",
      coordinates: [-12.0464, -77.0428],
      image: cityImage("lima"),
      description: topCityDescriptionOverrides.get("lima")!,
    },
    {
      id: "cusco",
      name: "Cusco",
      country: "Peru",
      continent: "South America",
      coordinates: [-13.5319, -71.9675],
      image: cityImage("cusco"),
      description: topCityDescriptionOverrides.get("cusco")!,
    },
  ],
  ecuador: [
    {
      id: "quito",
      name: "Quito",
      country: "Ecuador",
      continent: "South America",
      coordinates: [-0.1807, -78.4678],
      image: cityImage("quito"),
      description: topCityDescriptionOverrides.get("quito")!,
    },
  ],
  guatemala: [
    {
      id: "antigua-guatemala",
      name: "Antigua Guatemala",
      country: "Guatemala",
      continent: "North America",
      coordinates: [14.5586, -90.7295],
      image: cityImage("antigua"),
      description: topCityDescriptionOverrides.get("antigua-guatemala")!,
    },
  ],
  france: [
    {
      id: "paris",
      name: "Paris",
      country: "France",
      continent: "Europe",
      coordinates: [48.8566, 2.3522],
      image: cityImage("paris"),
      description:
        "Paris is a dense city of museums, bistros, wine bars, fashion streets, parks, hotels, and neighborhood routes where the useful trip shifts by arrondissement rather than landmark count. It works best on foot, with landmarks as the spine and meals or neighborhood detours keeping it from feeling dutiful.",
    },
    {
      id: "lyon",
      name: "Lyon",
      country: "France",
      continent: "Europe",
      coordinates: [45.764, 4.8357],
      image: cityImage("lyon"),
      description:
        "Lyon is a river city built for food-led travel, with bouchons, market halls, old-town lanes, traboules, wine bars, Roman history, and easy Beaujolais or Alpine side routes. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather.",
    },
  ],
  italy: [
    {
      id: "rome",
      name: "Rome",
      country: "Italy",
      continent: "Europe",
      coordinates: [41.9028, 12.4964],
      image: cityImage("rome"),
      description:
        "Rome is a layered capital where ancient sites, piazzas, trattorias, wine bars, churches, boutique stays, and neighborhood routes through Trastevere, Monti, Prati, and Centro Storico set the pace. It works best on foot, with landmarks as the spine and meals or neighborhood detours keeping it from feeling dutiful.",
    },
    {
      id: "milan",
      name: "Milan",
      country: "Italy",
      continent: "Europe",
      coordinates: [45.4642, 9.19],
      image: cityImage("milan"),
      description:
        "Milan is a design and fashion city where aperitivo, contemporary art, shopping streets, polished hotels, restaurants, canals, and rail links make a sharp northern Italy base. The eating and drinking land best when they feel rooted in place, with enough neighborhood logic to carry a full day.",
    },
    {
      id: "florence",
      name: "Florence",
      country: "Italy",
      continent: "Europe",
      coordinates: [43.7696, 11.2558],
      image: cityImage("florence"),
      description: topCityDescriptionOverrides.get("florence")!,
    },
    {
      id: "venice",
      name: "Venice",
      country: "Italy",
      continent: "Europe",
      coordinates: [45.4408, 12.3155],
      image: cityImage("venice"),
      description: topCityDescriptionOverrides.get("venice")!,
    },
  ],
  greece: [
    {
      id: "athens",
      name: "Athens",
      country: "Greece",
      continent: "Europe",
      coordinates: [37.9838, 23.7275],
      image: cityImage("athens"),
      description: topCityDescriptionOverrides.get("athens")!,
    },
  ],
  turkey: [
    {
      id: "istanbul",
      name: "Istanbul",
      country: "Turkey",
      continent: "Europe",
      coordinates: [41.0082, 28.9784],
      image: cityImage("istanbul"),
      description: topCityDescriptionOverrides.get("istanbul")!,
    },
  ],
  spain: [
    {
      id: "barcelona",
      name: "Barcelona",
      country: "Spain",
      continent: "Europe",
      coordinates: [41.3874, 2.1686],
      image: cityImage("barcelona"),
      description:
        "Barcelona is a dense Mediterranean city where Gothic lanes, Eixample's Modernista landmarks, late tapas dinners, natural-wine bars, design hotels, social hostels, hilltop parks, and beachside days all sit within a few metro stops. The trick is making that richness practical without flattening it into a checklist.",
    },
    {
      id: "madrid",
      name: "Madrid",
      country: "Spain",
      continent: "Europe",
      coordinates: [40.4168, -3.7038],
      image: cityImage("madrid"),
      description:
        "Madrid is a late-running capital where big museums, tapas streets, market halls, vermouth bars, Retiro walks, galleries, and generous plazas set an easy rhythm. The route works best when daytime culture has room to loosen into La Latina, Chueca, or Malasana after dark nights.",
    },
  ],
  portugal: [
    {
      id: "lisbon",
      name: "Lisbon",
      country: "Portugal",
      continent: "Europe",
      coordinates: [38.7223, -9.1393],
      image: cityImage("lisbon"),
      description:
        "Lisbon is a hillside Atlantic capital where miradouros, tiled lanes, seafood, wine bars, design stays, trams, fado rooms, and Belem, Alfama, Baixa, and Bairro Alto routes define the visit. It works best on foot, with landmarks as the spine and meals or neighborhood detours keeping it from feeling dutiful.",
    },
    {
      id: "porto",
      name: "Porto",
      country: "Portugal",
      continent: "Europe",
      coordinates: [41.1579, -8.6291],
      image: cityImage("porto"),
      description:
        "Porto is a compact Douro city where riverside walks, port lodges, tiled churches, taverns, design hotels, wine bars, and day trips into the valley keep routes tight and scenic. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather.",
    },
  ],
  "united-kingdom": [
    {
      id: "london",
      name: "London",
      country: "United Kingdom",
      continent: "Europe",
      coordinates: [51.5072, -0.1276],
      stateId: "england",
      countrySubareaId: "london-southeast",
      image: cityImage("london"),
      description:
        "London is a multi-center city where museums, pubs, markets, restaurants, theater, hotels, parks, and rail-linked neighborhoods make every guide work best by area and transit line. It works best on foot, with landmarks as the spine and meals or neighborhood detours keeping it from feeling dutiful.",
    },
    {
      id: "edinburgh",
      name: "Edinburgh",
      country: "United Kingdom",
      continent: "Europe",
      coordinates: [55.9533, -3.1883],
      stateId: "scotland",
      countrySubareaId: "scotland",
      image: cityImage("edinburgh"),
      description:
        "Edinburgh is a compact capital where castle views, Old Town closes, New Town streets, whisky bars, festival rooms, hill walks, and rail or coast routes fit into walkable days. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather.",
    },
    {
      id: "cardiff",
      name: "Cardiff",
      country: "United Kingdom",
      continent: "Europe",
      coordinates: [51.4816, -3.1791],
      stateId: "wales",
      countrySubareaId: "wales-northern-ireland",
      image: cityImage("cardiff"),
      description:
        "Cardiff is a Welsh capital where castle history, stadium nights, arcades, bay walks, pubs, food halls, and rail trips to coast or valleys make compact routes easy. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather.",
    },
    {
      id: "belfast",
      name: "Belfast",
      country: "United Kingdom",
      continent: "Europe",
      coordinates: [54.5973, -5.9301],
      stateId: "northern-ireland",
      countrySubareaId: "wales-northern-ireland",
      image: cityImage("belfast"),
      description:
        "Belfast is a compact Northern Ireland city where Titanic history, pubs, markets, murals, restaurants, Cathedral Quarter bars, and coast-road day trips make a strong city base. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather.",
    },
  ],
  netherlands: [
    {
      id: "amsterdam",
      name: "Amsterdam",
      country: "Netherlands",
      continent: "Europe",
      coordinates: [52.3676, 4.9041],
      image: cityImage("amsterdam"),
      description:
        "Amsterdam is a canal city where cycling streets, museums, brown cafes, design hotels, Indonesian meals, markets, parks, and neighborhood routes keep high-demand browsing practical. It works best on foot, with landmarks as the spine and meals or neighborhood detours keeping it from feeling dutiful.",
    },
  ],
  denmark: [
    {
      id: "copenhagen",
      name: "Copenhagen",
      country: "Denmark",
      continent: "Europe",
      coordinates: [55.6761, 12.5683],
      image: cityImage("copenhagen"),
      description: topCityDescriptionOverrides.get("copenhagen")!,
    },
  ],
  germany: [
    {
      id: "berlin",
      name: "Berlin",
      country: "Germany",
      continent: "Europe",
      coordinates: [52.52, 13.405],
      image: cityImage("berlin"),
      description:
        "Berlin is a spread-out capital where Cold War memory, museum corridors, canal neighborhoods, and club culture sit beside practical transit choices. It works best when the route is split by district, with parks, lakes, late rooms, and quiet wine bars giving each day its own temperature.",
    },
    {
      id: "munich",
      name: "Munich",
      country: "Germany",
      continent: "Europe",
      coordinates: [48.1351, 11.582],
      image: cityImage("munich"),
      description: topCityDescriptionOverrides.get("munich")!,
    },
  ],
  "czech-republic": [
    {
      id: "prague",
      name: "Prague",
      country: "Czech Republic",
      continent: "Europe",
      coordinates: [50.0755, 14.4378],
      image: cityImage("prague"),
      description:
        "Prague is a compact river city where castle routes, old-town lanes, beer halls, cafes, design stays, galleries, and Vltava walks help visitors move beyond the busiest squares. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather.",
    },
  ],
  austria: [
    {
      id: "vienna",
      name: "Vienna",
      country: "Austria",
      continent: "Europe",
      coordinates: [48.2082, 16.3738],
      image: cityImage("vienna"),
      description: topCityDescriptionOverrides.get("vienna")!,
    },
  ],
  switzerland: [
    {
      id: "zurich",
      name: "Zurich",
      country: "Switzerland",
      continent: "Europe",
      coordinates: [47.3769, 8.5417],
      image: cityImage("zurich"),
      description: topCityDescriptionOverrides.get("zurich")!,
    },
  ],
  ireland: [
    {
      id: "dublin",
      name: "Dublin",
      country: "Ireland",
      continent: "Europe",
      coordinates: [53.3498, -6.2603],
      image: cityImage("dublin"),
      description: topCityDescriptionOverrides.get("dublin")!,
    },
  ],
  morocco: [
    {
      id: "marrakesh",
      name: "Marrakesh",
      country: "Morocco",
      continent: "Africa",
      coordinates: [31.6295, -7.9811],
      image: cityImage("marrakesh"),
      description:
        "Marrakesh is a medina-and-garden city where riad stays, souks, rooftop meals, hammams, palace sites, cocktail courtyards, and Atlas or desert routes shape the trip. The best days hinge on timing: start in the city, then let the season, drive, and landscape decide how far the route stretches.",
    },
    {
      id: "casablanca",
      name: "Casablanca",
      country: "Morocco",
      continent: "Africa",
      coordinates: [33.5731, -7.5898],
      image: cityImage("casablanca"),
      description:
        "Casablanca is a coastal business city where Art Deco streets, Hassan II Mosque, cafes, seafood rooms, corniche walks, modern hotels, and rail links make a practical Moroccan base. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather.",
    },
  ],
  "south-africa": [
    {
      id: "cape-town",
      name: "Cape Town",
      country: "South Africa",
      continent: "Africa",
      coordinates: [-33.9249, 18.4241],
      image: cityImage("capetown"),
      description:
        "Cape Town is a mountain-and-ocean city where beaches, wine routes, Table Mountain, design hotels, markets, restaurants, history sites, and coastal drives define the trip. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather.",
    },
    {
      id: "johannesburg",
      name: "Johannesburg",
      country: "South Africa",
      continent: "Africa",
      coordinates: [-26.2041, 28.0473],
      image: cityImage("johannesburg"),
      description:
        "Johannesburg is a creative inland city where galleries, Apartheid Museum context, markets, restaurants, rooftop bars, design districts, and township or heritage routes need planned geography. It works best on foot, with landmarks as the spine and meals or neighborhood detours keeping it from feeling dutiful.",
    },
  ],
  kenya: [
    {
      id: "nairobi",
      name: "Nairobi",
      country: "Kenya",
      continent: "Africa",
      coordinates: [-1.2921, 36.8219],
      image: cityImage("nairobi"),
      description:
        "Nairobi is an urban safari gateway where cafes, design shops, national-park access, museums, markets, restaurants, and hotel bases connect city life with wider Kenya routes. The best days hinge on timing: start in the city, then let the season, drive, and landscape decide how far the route stretches.",
    },
  ],
  japan: [
    {
      id: "tokyo",
      name: "Tokyo",
      country: "Japan",
      continent: "Asia",
      coordinates: [35.6762, 139.6503],
      image: cityImage("tokyo"),
      description:
        "Tokyo is a vast rail-connected city where ramen counters, sushi rooms, cocktail bars, shopping streets, design hotels, museums, gardens, and neighborhood micro-routes reward precision. It works best on foot, with landmarks as the spine and meals or neighborhood detours keeping it from feeling dutiful.",
    },
    {
      id: "osaka",
      name: "Osaka",
      country: "Japan",
      continent: "Asia",
      coordinates: [34.6937, 135.5023],
      image: cityImage("osaka"),
      description: topCityDescriptionOverrides.get("osaka")!,
    },
    {
      id: "kyoto",
      name: "Kyoto",
      country: "Japan",
      continent: "Asia",
      coordinates: [35.0116, 135.7681],
      image: cityImage("kyoto"),
      description: topCityDescriptionOverrides.get("kyoto")!,
    },
  ],
  thailand: [
    {
      id: "bangkok",
      name: "Bangkok",
      country: "Thailand",
      continent: "Asia",
      coordinates: [13.7563, 100.5018],
      image: cityImage("bangkok"),
      description: topCityDescriptionOverrides.get("bangkok")!,
    },
    {
      id: "chiang-mai",
      name: "Chiang Mai",
      country: "Thailand",
      continent: "Asia",
      coordinates: [18.7883, 98.9853],
      image: cityImage("chiangmai"),
      description:
        "Chiang Mai is a northern Thai base where old-city temples, night markets, cafes, cooking classes, mountain routes, elephant sanctuaries, and relaxed stays support slower trips. The best days hinge on timing: start in the city, then let the season, drive, and landscape decide how far the route stretches.",
    },
    {
      id: "phuket",
      name: "Phuket",
      country: "Thailand",
      continent: "Asia",
      coordinates: [7.8804, 98.3923],
      image: cityImage("phuket"),
      description: topCityDescriptionOverrides.get("phuket")!,
    },
  ],
  "south-korea": [
    {
      id: "seoul",
      name: "Seoul",
      country: "South Korea",
      continent: "Asia",
      coordinates: [37.5665, 126.978],
      image: cityImage("seoul"),
      description:
        "Seoul is a fast, stylish city where palace grounds, barbecue nights, markets, cafes, design hotels, shopping districts, museums, and all-night food routes shift by subway stop. It works best on foot, with landmarks as the spine and meals or neighborhood detours keeping it from feeling dutiful.",
    },
    {
      id: "busan",
      name: "Busan",
      country: "South Korea",
      continent: "Asia",
      coordinates: [35.1796, 129.0756],
      image: cityImage("busan"),
      description:
        "Busan is a coastal Korean city where beaches, seafood markets, hillside villages, cafes, temples, harbor views, and nightlife around Seomyeon and Haeundae shape the trip. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather.",
    },
  ],
  uae: [
    {
      id: "dubai",
      name: "Dubai",
      country: "United Arab Emirates",
      continent: "Asia",
      coordinates: [25.2048, 55.2708],
      image: cityImage("dubai"),
      description:
        "Dubai is a high-gloss desert city where skyline hotels, malls, beaches, destination restaurants, rooftop bars, heritage quarters, and desert or marina experiences define planning. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather.",
    },
  ],
  malaysia: [
    {
      id: "kuala-lumpur",
      name: "Kuala Lumpur",
      country: "Malaysia",
      continent: "Asia",
      coordinates: [3.139, 101.6869],
      image: cityImage("kualalumpur"),
      description: topCityDescriptionOverrides.get("kuala-lumpur")!,
    },
  ],
  "saudi-arabia": [
    {
      id: "mecca",
      name: "Mecca",
      country: "Saudi Arabia",
      continent: "Asia",
      coordinates: [21.3891, 39.8579],
      image: cityImage("mecca"),
      description: topCityDescriptionOverrides.get("mecca")!,
    },
  ],
  "hong-kong": [
    {
      id: "hong-kong",
      name: "Hong Kong",
      country: "Hong Kong",
      continent: "Asia",
      coordinates: [22.3193, 114.1694],
      image: cityImage("hongkong"),
      description: topCityDescriptionOverrides.get("hong-kong")!,
    },
  ],
  macau: [
    {
      id: "macau",
      name: "Macau",
      country: "Macau",
      continent: "Asia",
      coordinates: [22.1987, 113.5439],
      image: cityImage("macau"),
      description: topCityDescriptionOverrides.get("macau")!,
    },
  ],
  singapore: [
    {
      id: "singapore",
      name: "Singapore",
      country: "Singapore",
      continent: "Asia",
      coordinates: [1.3521, 103.8198],
      image: cityImage("singapore"),
      description: topCityDescriptionOverrides.get("singapore")!,
    },
  ],
  taiwan: [
    {
      id: "taipei",
      name: "Taipei",
      country: "Taiwan",
      continent: "Asia",
      coordinates: [25.033, 121.5654],
      image: cityImage("taipei"),
      description: topCityDescriptionOverrides.get("taipei")!,
    },
  ],
  china: [
    {
      id: "shanghai",
      name: "Shanghai",
      country: "China",
      continent: "Asia",
      coordinates: [31.2304, 121.4737],
      image: cityImage("shanghai"),
      description: topCityDescriptionOverrides.get("shanghai")!,
    },
  ],
  australia: [
    {
      id: "sydney",
      name: "Sydney",
      country: "Australia",
      continent: "Oceania",
      coordinates: [-33.8688, 151.2093],
      image: cityImage("sydney"),
      description:
        "Sydney is a harbor-and-coast city where ferries, beaches, seafood, coffee, coastal walks, design hotels, museums, and neighborhood dining make outdoors-first routes easy. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather.",
    },
    {
      id: "melbourne",
      name: "Melbourne",
      country: "Australia",
      continent: "Oceania",
      coordinates: [-37.8136, 144.9631],
      image: cityImage("melbourne"),
      description:
        "Melbourne is a laneway city where coffee, markets, bars, galleries, live music, design hotels, trams, and neighborhood dining routes make culture feel local and repeatable. The strongest routes build toward evening, using daytime wandering as the setup instead of treating nightlife like a separate checklist.",
    },
  ],
  "new-zealand": [
    {
      id: "auckland",
      name: "Auckland",
      country: "New Zealand",
      continent: "Oceania",
      coordinates: [-36.8509, 174.7645],
      countrySubareaId: "north-island",
      image: cityImage("auckland"),
      description:
        "Auckland is a harbor city where island ferries, volcano walks, seafood, neighborhood dining, wine routes, design stays, and North Island road trips start close to town. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather.",
    },
    {
      id: "wellington",
      name: "Wellington",
      country: "New Zealand",
      continent: "Oceania",
      coordinates: [-41.2866, 174.7756],
      countrySubareaId: "north-island",
      image: cityImage("wellington-new-zealand"),
      description:
        "Wellington is a compact harbour capital where steep green hills, native wildlife, film craft, museums, serious coffee, breweries, and small dining rooms sit within a walkable centre. The strongest routes use the cable car and waterfront as a spine, then leave room for wind, ridge views, and neighbourhood nights.",
    },
    {
      id: "nelson",
      name: "Nelson",
      country: "New Zealand",
      continent: "Oceania",
      coordinates: [-41.2706, 173.284],
      countrySubareaId: "south-island",
      image: cityImage("nelson-new-zealand"),
      description:
        "Nelson is a sunny top-of-South base where beaches, galleries, breweries, markets, coastal walks, and Abel Tasman or wine-country routes make slower South Island browsing work. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather.",
    },
    {
      id: "queenstown",
      name: "Queenstown",
      country: "New Zealand",
      continent: "Oceania",
      coordinates: [-45.0312, 168.6626],
      countrySubareaId: "south-island",
      image: cityImage("queenstown"),
      description:
        "Queenstown is an alpine lake town where adventure operators, mountain views, wine routes, lodge stays, bars, scenic drives, and day trips shape a high-demand outdoors itinerary. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather.",
    },
  ],
  fiji: [
    {
      id: "nadi",
      name: "Nadi",
      country: "Fiji",
      continent: "Oceania",
      coordinates: [-17.7765, 177.435],
      image: cityImage("nadi"),
      description:
        "Nadi is Fiji's main arrival hub, useful for resort transfers, markets, temples, marina departures, island day trips, local food stops, and practical beach-route logistics. The payoff is pairing the view with a real plan: a useful base, a few strong anchors, and room for the weather.",
    },
  ],
};

const continentDefinitions = [
  {
    id: "north-america",
    name: "North America",
    coordinates: [38, -99] as [number, number],
    bounds: [
      [7, -168],
      [84, -52],
    ] as [[number, number], [number, number]],
    backgroundGradient: "from-cyan-500/20 via-sky-500/10 to-blue-500/20",
  },
  {
    id: "south-america",
    name: "South America",
    coordinates: [-15, -60] as [number, number],
    bounds: [
      [-56, -92],
      [15, -26],
    ] as [[number, number], [number, number]],
    backgroundGradient: "from-emerald-500/20 via-lime-500/10 to-teal-500/20",
  },
  {
    id: "europe",
    name: "Europe",
    coordinates: [52, 15] as [number, number],
    bounds: [
      [34, -25],
      [72, 45],
    ] as [[number, number], [number, number]],
    backgroundGradient: "from-rose-500/20 via-orange-500/10 to-amber-500/20",
  },
  {
    id: "africa",
    name: "Africa",
    coordinates: [2, 20] as [number, number],
    bounds: [
      [-35, -25],
      [38, 60],
    ] as [[number, number], [number, number]],
    backgroundGradient: "from-yellow-500/20 via-orange-500/10 to-red-500/20",
  },
  {
    id: "asia",
    name: "Asia",
    coordinates: [27, 95] as [number, number],
    bounds: [
      [-10, 25],
      [78, 180],
    ] as [[number, number], [number, number]],
    backgroundGradient: "from-fuchsia-500/20 via-pink-500/10 to-orange-500/20",
  },
  {
    id: "oceania",
    name: "Oceania",
    coordinates: [-24, 134] as [number, number],
    bounds: [
      [-50, 110],
      [10, 180],
    ] as [[number, number], [number, number]],
    backgroundGradient: "from-sky-500/20 via-teal-500/10 to-emerald-500/20",
  },
];

type ContinentRegionSeed = {
  id: string;
  name: string;
  description: string;
  anchor?: [number, number];
};

const continentRegionSeedsById: Record<string, ContinentRegionSeed[]> = {
  "north-america": [
    {
      id: "northern-north-america",
      name: "Northern North America",
      description: "High-latitude routes with wilderness, mountains, and long-distance overland planning.",
      anchor: [0.8, 0.45],
    },
    {
      id: "central-north-america",
      name: "Central North America",
      description: "Interior corridors with major transport hubs, plains, and mixed urban-rural routes.",
      anchor: [0.52, 0.48],
    },
    {
      id: "southern-north-america",
      name: "Southern North America",
      description: "Warmer coastal and inland belts with beach, food, and culture-focused itineraries.",
      anchor: [0.24, 0.48],
    },
  ],
  "south-america": [
    {
      id: "northern-south-america",
      name: "Northern South America",
      description: "Tropical and Caribbean-facing routes with rainforest access and coastal gateways.",
      anchor: [0.76, 0.5],
    },
    {
      id: "andean-south-america",
      name: "Andean South America",
      description: "Mountain corridors with altitude cities, heritage routes, and dramatic overland travel.",
      anchor: [0.5, 0.35],
    },
    {
      id: "southern-south-america",
      name: "Southern South America",
      description: "Cool-climate coasts, wine regions, and long-form road routes toward Patagonia.",
      anchor: [0.18, 0.5],
    },
  ],
  europe: [
    {
      id: "northern-europe",
      name: "Northern Europe",
      description: "Nordic and Baltic-focused routes with design capitals, nature access, and seasonal travel.",
      anchor: [0.78, 0.55],
    },
    {
      id: "western-europe",
      name: "Western Europe",
      description: "Dense rail-friendly corridors with major cultural capitals and short-hop itineraries.",
      anchor: [0.56, 0.32],
    },
    {
      id: "southern-europe",
      name: "Southern Europe",
      description: "Mediterranean coastlines, island routes, and food-led travel across warmer climates.",
      anchor: [0.3, 0.55],
    },
    {
      id: "eastern-europe",
      name: "Eastern Europe",
      description: "Historic inland routes with value-focused city breaks and expanding travel infrastructure.",
      anchor: [0.52, 0.78],
    },
  ],
  africa: [
    {
      id: "northern-africa",
      name: "Northern Africa",
      description: "Mediterranean-facing heritage routes, desert gateways, and historic urban circuits.",
      anchor: [0.78, 0.5],
    },
    {
      id: "sub-saharan-africa",
      name: "Sub-Saharan Africa",
      description: "Equatorial and savannah routes with wildlife regions, coastlines, and major city hubs.",
      anchor: [0.45, 0.52],
    },
    {
      id: "southern-africa",
      name: "Southern Africa",
      description: "Southern corridor travel with wine regions, coast drives, and landscape-heavy itineraries.",
      anchor: [0.2, 0.5],
    },
  ],
  asia: [
    {
      id: "east-asia",
      name: "East Asia",
      description: "High-density urban routes with strong rail links, food scenes, and cultural landmarks.",
      anchor: [0.58, 0.78],
    },
    {
      id: "south-asia",
      name: "South Asia",
      description: "Subcontinental routes blending heritage cities, mountain gateways, and regional diversity.",
      anchor: [0.34, 0.62],
    },
    {
      id: "southeast-asia",
      name: "Southeast Asia",
      description: "Island and mainland routes with beach circuits, nightlife, and high-frequency travel demand.",
      anchor: [0.2, 0.75],
    },
    {
      id: "west-central-asia",
      name: "West & Central Asia",
      description: "Desert, mountain, and steppe corridors with historic trade-route and modern hub cities.",
      anchor: [0.56, 0.4],
    },
  ],
  oceania: [
    {
      id: "australasia",
      name: "Australasia",
      description: "Large-country routes with urban hubs, coasts, and long-distance overland planning.",
      anchor: [0.3, 0.45],
    },
    {
      id: "pacific-islands",
      name: "Pacific Islands",
      description: "Island-focused travel with reef destinations, resort routes, and ocean-bound itineraries.",
      anchor: [0.52, 0.72],
    },
  ],
};

function buildContinentSubareas(continent: {
  id: string;
  bounds: [[number, number], [number, number]];
}): SubArea[] {
  const seeds = continentRegionSeedsById[continent.id] ?? [];
  const fallbackAnchors: Array<[number, number]> = [
    [0.78, 0.5],
    [0.5, 0.5],
    [0.22, 0.5],
  ];

  if (!seeds.length) {
    return [
      {
        id: "north",
        name: "North",
        description: "Northern continent routes with cooler climates and nature-forward planning.",
        coordinates: projectPointWithinBounds(continent.bounds, 0.78, 0.5),
      },
      {
        id: "central",
        name: "Central",
        description: "Central continent routes with major transport hubs and mixed travel styles.",
        coordinates: projectPointWithinBounds(continent.bounds, 0.5, 0.5),
      },
      {
        id: "south",
        name: "South",
        description: "Southern continent routes with warmer climates, coasts, and food-led travel.",
        coordinates: projectPointWithinBounds(continent.bounds, 0.22, 0.5),
      },
    ];
  }

  return seeds.map((seed, index) => {
    const [latRatio, lngRatio] = seed.anchor ?? fallbackAnchors[index % fallbackAnchors.length];
    return {
      id: seed.id,
      name: seed.name,
      description: seed.description,
      coordinates: projectPointWithinBounds(continent.bounds, latRatio, lngRatio),
    };
  });
}

const fallbackRegionKinds: RegionKind[] = ["north", "south", "east", "west", "central"];

function getRegionCoordinates(
  country: WorldCountrySeed,
  regionKind: RegionKind,
): [number, number] {
  const [[south, west], [north, east]] = country.bounds;
  const centerLat = (south + north) / 2;
  const centerLng = (west + east) / 2;
  const latOffset = (north - south) * 0.18;
  const lngOffset = (east - west) * 0.18;

  switch (regionKind) {
    case "north":
      return [centerLat + latOffset, centerLng];
    case "south":
      return [centerLat - latOffset, centerLng];
    case "east":
      return [centerLat, centerLng + lngOffset];
    case "west":
      return [centerLat, centerLng - lngOffset];
    case "central":
    default:
      return [centerLat, centerLng];
  }
}

function createDummyCity(country: WorldCountrySeed, regionKind: RegionKind): City {
  const shortRegionLabelByKind: Record<RegionKind, string> = {
    north: "North",
    south: "South",
    east: "East",
    west: "West",
    central: "Central",
  };
  const adjectivalRegionLabelByKind: Record<RegionKind, string> = {
    north: "Northern",
    south: "Southern",
    east: "Eastern",
    west: "Western",
    central: "Central",
  };
  const usesAdjectivalRegionLabel = /\s/.test(country.name);
  const regionLabel = usesAdjectivalRegionLabel
    ? adjectivalRegionLabelByKind[regionKind]
    : shortRegionLabelByKind[regionKind];

  return {
    id: slugify(`${country.id}-${regionKind}`),
    name: `${regionLabel} ${country.name}`,
    country: country.name,
    continent: country.continentName,
    coordinates: getRegionCoordinates(country, regionKind),
    isPlaceholderRegion: true,
    regionKind,
    image: cityImage(country.id),
    listCount: 0,
    description: `Placeholder regional guide data for ${regionLabel.toLowerCase()} ${country.name} while the full destination guide is being filled in.`,
  };
}

function createFallbackPrimaryCity(country: WorldCountrySeed): City {
  const countryCode = getCountryCode(country.name);
  const countryData = countryCode ? getCountryData(countryCode) : undefined;
  const capitalFeature = countryCapitalLookup.get(normalizePlaceName(country.name));
  const fallbackCityName =
    capitalNameOverrides[country.id] ?? capitalFeature?.capital ?? countryData?.capital ?? `${country.name} City`;
  const fallbackCoordinates =
    capitalCoordinateOverrides[country.id] ??
    (capitalFeature?.coordinates
      ? ([capitalFeature.coordinates[1], capitalFeature.coordinates[0]] as [number, number])
      : country.coordinates);

  return {
    id: slugify(`${country.id}-${fallbackCityName}`),
    name: fallbackCityName,
    country: country.name,
    continent: country.continentName,
    coordinates: fallbackCoordinates,
    image: cityImage(slugify(fallbackCityName)),
    listCount: 0,
    description: `${fallbackCityName} gives ${country.name}'s guide a practical city starting point, helping travelers orient around the capital before branching into the wider country.`,
  };
}

function getCountrySubareas(country: WorldCountrySeed): SubArea[] | undefined {
  if (country.continentId === "europe") {
    return buildEuropeanRegionSeeds(country);
  }

  return countrySubareaSeeds.get(country.name);
}

function assignCityToNearestSubarea(city: Omit<City, "listCount">, subareas?: SubArea[]) {
  if (city.countrySubareaId || !subareas?.length) {
    return city;
  }

  const [cityLat, cityLng] = city.coordinates;
  const nearestSubarea = subareas.reduce((best, candidate) => {
    const [candidateLat, candidateLng] = candidate.coordinates;
    const bestDistance = best
      ? (cityLat - best.coordinates[0]) ** 2 + (cityLng - best.coordinates[1]) ** 2
      : Number.POSITIVE_INFINITY;
    const candidateDistance = (cityLat - candidateLat) ** 2 + (cityLng - candidateLng) ** 2;
    return candidateDistance < bestDistance ? candidate : best;
  }, undefined as SubArea | undefined);

  return nearestSubarea ? { ...city, countrySubareaId: nearestSubarea.id } : city;
}

const europeanCountryDescriptions: Record<string, string> = {
  albania:
    "Albania mixes high limestone with clear water, where old ways still have a pulse. Concrete bunkers hide in hill grass and the air smells of grilled meat and mountain herbs. Fortified highland houses meet strong coffee and the salty rhythm of the coast.",
  austria:
    "Austria is a landscape of pine forests and limestone massifs where summer air still feels sharp. Beyond Vienna's coffee-scented streets, emerald valleys open into steep alpine meadows. Dark timber balconies and mountain lakes bind imperial history to rugged peaks.",
  belarus:
    "Belarus needs access checks before the route becomes practical. Minsk sets the urban scale with broad avenues and Soviet-era layers. Castles, forests, and regional towns can add context only when border rules and overland timing are clear.",
  belgium:
    "Belgium is a dense grid of medieval belfries and red-brick squares under an iron-gray sky. Beyond Brussels's glass, the rain-slick plains of Flanders rise toward Ardennes limestone. North Sea fog, fortified towns, and canals keep trade history quietly surreal.",
  "bosnia-and-herzegovina":
    "Bosnia and Herzegovina carries its history through streets, bridges, and mountain roads. Sarajevo and Mostar anchor the emotional core. River canyons, coffee culture, and smaller towns need enough time for context rather than scenery alone.",
  bulgaria:
    "Golden Orthodox domes and crushed rose petals rise from Bulgaria's gray-granite heights. Between Thracian tombs and Black Sea inlets, the terrain feels raw and layered. Sheep's milk and rakia meet Cyrillic script, brutalist blocks, and ancient vines.",
  croatia:
    "White limestone and pine resin define a coast where gray cliffs drop into a transparent, salt-heavy sea. From northern olive groves to bone-white pebble beaches, Croatia feels chiseled and dry. Sharp shadows and stone squares hold the slow heat of ancient coastal walls.",
  cyprus:
    "Cyprus is more layered than a beach base suggests. Coastal resort days and divided-city history sit near archaeological sites and Troodos village roads. The trip feels cleaner when car logistics and crossing rules are settled early.",
  "czech-republic":
    "Czechia is a landscape of sandstone towers and red-tiled spires cutting through morning haze. In Prague, the Charles Bridge anchors dark Gothic stone and narrow alleys. Bohemian forests and Moravian hills tie old coal-town grit to glasswork and bitter brewing.",
  denmark:
    "Denmark turns good infrastructure into an easy trip, but the best days still need focus. Copenhagen can lead with design, harbor swimming, and food. Jutland dunes or island ferries shift the mood toward coast, light, and slower movement.",
  estonia:
    "Estonia pairs medieval Tallinn with peat bogs, limestone cliffs, and world-leading digital infrastructure. Its startup pulse and e-residency fame sit beside ancient forests and island traditions, balancing high-tech Nordic resilience with maritime quiet.",
  finland:
    "Finland is a wild spread of damp moss and crushed-pine cold. From Helsinki's glass streets to the empty peat bogs of the north, the land feels raw and scoured by ice. Sauna heat and salty licorice sharpen a quiet grit forged in long winter blue.",
  france:
    "Beneath Paris's slate-gray avenues and the mist-shrouded Pyrenees, France asks for a slow, visceral lens. Ancient stone villages and saline marshes reveal local craft beside avant-garde grit. Wild topography, artisanal soul, and centuries of heritage keep the balance heavy-hitting.",
  germany:
    "Modern Berlin's industrial pulse meets the shadowed Black Forest, where folklore still feels tangible. Baltic coastlines and baroque riverside cities blend historic gravitas with contemporary art, while alpine power gives Germany its refined, artisanal soul.",
  greece:
    "Whitewashed villages spill down marble slopes toward a sea of ink and sapphire. Between Athens's chaos and the thyme-scented silence of the islands, Greece feels carved from light. Olive groves, weathered ruins, and the salty Meltemi cut the afternoon heat.",
  hungary:
    "Hungary is a landlocked basin of healing steam and paprika-stained kitchens. From Budapest's peeling spas to the dust-blown Puszta, it becomes a solitary island of Magyar logic. Cherry soup, Unicum, and tobacco-scented ruin bars keep empire echoing in the corners.",
  iceland:
    "Iceland is a cathedral of black sand and volcanic glass, where soil is still being born from fire. Glaciers push through clouds and steam rises from the ground in white plumes. Endless summer light and bitter winter storms make the landscape feel planetary.",
  ireland:
    "Sharp cliffs drop into a foaming Atlantic before the land gives way to hills of deep, sodden clover. Between Dublin's rowdy pubs and the gray silence of the Burren, Ireland feels ancient and alive. Rain polishes the emerald grit instead of dampening it.",
  italy:
    "Forget the tourist traps; Italy is a sun-baked mess of golden patina and ancient ego. From the Dolomites to Sicily's salt-sprayed coast, it becomes a heavy-hitting collision of baroque shadow and modern grit. Bitter espresso, old stone, and soul-deep heritage carry the feast.",
  kosovo:
    "Kosovo is compact, young, and better understood through its cities first. Pristina gives the contemporary pulse, while Prizren carries the old-town layer. Mountain access and cafe culture make short routes feel fuller than the map suggests.",
  latvia:
    "Latvia starts naturally in Riga, where Art Nouveau streets and market halls give the trip its urban weight. Jurmala adds a coastal reset without much friction. Forest routes and quieter towns help the plan move beyond the capital.",
  lithuania:
    "Ancient oak groves and black-water lakes spread under Lithuania's Baltic sky. Along the coast, the Curonian Spit protects the lagoon with shifting dunes and wind-bent trees. Amber shores, wood carving, and pagan-rooted folklore keep the seasons close.",
  luxembourg:
    "Luxembourg is small, but the terrain gives it more texture than a quick map glance. Fortified heights and valley walks make the capital feel layered. EU districts and rail links turn it into a focused short stay rather than filler.",
  macedonia:
    "Macedonia is best approached through lakes, mountains, and layered city streets. Skopje gives the modern reset before Ohrid slows the trip near the water. Overland routes need room for villages, meals, and border timing.",
  malta:
    "Malta compresses a lot into a small island map. Valletta and the Three Cities can carry the historic core, while limestone towns and swimming coves change the pace. Gozo days need heat and ferry timing planned rather than assumed.",
  moldova:
    "Moldova is a quiet wine-and-city trip rather than a broad sightseeing circuit. Chisinau sets the practical base before cellar visits or countryside roads enter the plan. Soviet-modern layers need local context and unhurried days.",
  montenegro:
    "Montenegro is a vertical world where black mountains drop into Adriatic salt water. Along the Bay of Kotor, medieval walls cling to limestone cliffs above deep-blue inlets. Karst plateaus and glacial lakes make tiny coastal villages feel both enclosed and immense.",
  netherlands:
    "The Netherlands offers a flat, engineered landscape of slate-gray water and brick. Past Amsterdam's neon hum, the country stretches into a disciplined sweep of polders and sky, where wind is constant and the soil feels hard-won from the sea.",
  "northern-cyprus":
    "Northern Cyprus needs a route that understands crossings and local context. Kyrenia and Famagusta can form the historic spine, with beaches or mountain roads added around transport. Political geography should be clear before the map fills in.",
  norway:
    "Norway is a brutal, vertical world of granite walls and cold fjords. From Oslo's steel-and-glass hum to the Arctic reaches, the landscape feels less like a country than a tectonic event. Thundering water and pine air meet a land that refuses to be tamed.",
  poland:
    "Poland is a raw, brick-heavy expanse where medieval spires pierce a sky heavy with industrial history. From Baltic sands to the Tatra summits, the land feels dense with memory. Woodsmoke and hidden courtyards power a new, steel-edged future.",
  portugal:
    "Portugal is a bright, honey-colored sanctuary where Atlantic air meets grilled sardines and citrus. From the Algarve's golden beaches to Porto's riverfront, vivid tiles and amber plazas turn meals toward the sea and give the country its generous pulse.",
  "republic-of-serbia":
    "Plum orchards roll across Serbia while grilled meat hangs over charcoal fires. In Belgrade, concrete grit meets the Danube as barges drift past the old fortress. Strong fruit brandy and loud coffee houses carry stubborn hospitality beneath rugged Balkan mountains.",
  romania:
    "Romania is a land of dark forests and beech smoke curling from clay stoves. In the Carpathians, horse carts still rattle over passes and the air carries fermented plums. Hand-carved gates and steep hillsides keep the farm rhythm close to another century.",
  russia:
    "Russia's scale makes access, politics, and distance central to any plan. Moscow and St. Petersburg frame the classic cultural route, but even that pairing needs current checks. Rail corridors beyond them require serious time.",
  slovakia:
    "Slovakia rises through timber forests and limestone gorges in the Carpathians. Beyond the Danube plains, high meadows and wooden churches sit beneath the Tatras. Stone fortresses and cold rivers keep mountain culture tied to weather-beaten interior terrain.",
  slovenia:
    "Slovenia is a collision of limestone Alps and the emerald Soca River. Subterranean caves under karst plateaus give way to beech forests, glacial lakes, and steep vineyards. Mount Triglav anchors a Central European efficiency softened by Mediterranean ease.",
  spain:
    "Experience Spain's soul from Catalonia's avant-garde architecture to wild Atlantic shores. Madrid's golden galleries and Andalusia's olive groves carry history and zest, while bold Riojas and ancient traditions make every sunset feel like a celebration.",
  sweden:
    "Deep timber forests and iron-colored lakes stretch across Sweden's northern wilderness. From Stockholm's island streets to the reindeer moss of the high north, the land studies minimalist beauty. Red cabins and birch-scented air give way to relentless golden summer.",
  switzerland:
    "High granite peaks cut thin Alpine air, broken by the metallic clank of cowbells. Below the glaciers, timber chalets huddle in valleys of damp pine and woodsmoke. Cold emerald lakes and punctual mountain passes make every train and clock feel like law.",
  ukraine:
    "Ukraine's black-soil plains and wheat fields stretch beneath an immense sky. Kyiv's tech hubs and golden domes meet the heavy industrial east, while the Carpathians and Black Sea ports shape a resilient crossroads culture of folk art and modern sovereignty.",
  "united-kingdom":
    "United Kingdom routes should be built by nation, rail line, or coast rather than by a single London orbit. England and Scotland change the scale quickly. Wales and Northern Ireland add their own lodging logic, landscape texture, and food routes.",
};

const countryDescriptionOverrides: Record<string, string> = {
  afghanistan:
    "Afghanistan belongs in a cautious specialist plan, not a casual circuit. Kabul or Herat can provide cultural context only when conditions allow. Mountain travel and heritage sites need trusted local guidance, narrow routing, and current security checks.",
  algeria:
    "Algeria opens through Algiers, then becomes a question of distance. The coast and Roman sites can sit in one northern route, while oasis towns or Sahara travel require heat-aware planning. Road time should shape the trip before the highlight list does.",
  angola:
    "Angola starts with Luanda's Atlantic city life, then changes once the road leaves the capital. Music and food give the urban opening its texture. Highland scenery or desert-coast routes need honest transfer days and a clear reason to move.",
  argentina:
    "Argentina runs from Iguazu's subtropical heat to Patagonia's blue glaciers. Between them sit endless pampas and the European-style chaos of Buenos Aires, a land of dramatic contrasts fueled by late steaks, red wine, and near-religious football.",
  armenia:
    "Armenia feels close on the map but dense on the ground. Yerevan works as the table-setting city, then monastery roads and canyon landscapes carry the deeper route. Wine villages and mountain views deserve pauses between short drives.",
  australia:
    "Australia joins rust-red deserts and ancient rock monoliths to sun-bleached coasts of white sand and surf. Northern rainforests, southern vineyards, unique wildlife, open horizons, coastal ease, and Indigenous heritage define the expansive island continent.",
  azerbaijan:
    "Azerbaijan makes sense when Baku comes first. The Caspian capital explains the country's modern energy before the route turns outward. Mud volcanoes, mountain villages, or Silk Road towns should follow terrain and drive time.",
  bangladesh:
    "Bangladesh is shaped by water, traffic, and density more than easy sightseeing. Dhaka is the intense starting point, not a city to rush through. Old capitals and tea country ask for one pace; river travel or mangrove edges need slow movement and local guidance.",
  belize:
    "Belize is small enough to link reef and jungle, but the trip still needs a first choice. Start with the cayes or an inland lodge, then let boat schedules and Maya-site access decide the rest. Garifuna coast time belongs as its own slower leg.",
  benin:
    "Benin carries heavy history inside a compact route. Cotonou and Ouidah can frame the coast before the trip turns toward Porto-Novo or Ganvie. Markets and northern roads need local context rather than a quick cultural sampler.",
  bermuda:
    "Bermuda is polished and compact, yet it still rewards loose days. Hamilton and St. George's give the heritage frame. Ferries and rail trails make short loops easy, while sheltered coves let weather decide when swimming or sailing takes the lead.",
  bhutan:
    "Bhutan is deliberately slow travel. Permits and etiquette matter as much as altitude and mountain roads, so the logistics are part of the experience rather than friction to remove. Paro and Thimphu act as anchors before valley days and monastery hikes set the tempo.",
  bolivia:
    "Bolivia is a dizzying high-altitude landscape where salt flats meet thin Andean air. From La Paz's cable-car basins to humid Amazon lowlands, raw beauty and fierce Indigenous identity shape a land of bowler hats and mountain-hardened independence.",
  botswana:
    "Botswana's safari logic begins with water and season. Decide between the Okavango and Chobe before filling the map; Kalahari or salt-pan routes need a different season. Transfer style and lodge budget will shape the trip as much as wildlife timing.",
  brazil:
    "The Amazon canopy and Iguazu's thunder meet Sao Paulo concrete and Rio's beach curves. From the marshy Pantanal to the red dust of the Northeast, Brazil moves at massive scale, driven by carnival energy, football obsession, and a deep rhythmic soul.",
  brunei:
    "Brunei suits a short Borneo stay with a quiet pace. Bandar Seri Begawan gives the cultural base, then mosque visits and water-village time can fill the city rhythm. Rainforest or river access depends on planned transport.",
  "burkina-faso":
    "Burkina Faso needs current safety context before the itinerary becomes responsible. If travel is viable, keep the route narrow and locally supported. Ouagadougou and Bobo-Dioulasso can frame music, craft, and Sahelian architecture.",
  burundi:
    "Burundi is compact without being automatic. Bujumbura and Lake Tanganyika can carry a focused trip before highland drives enter the plan. Tea landscapes and drum traditions need current access checks and careful transport.",
  cambodia:
    "Massive stone faces at Angkor peer through jungle canopies, anchoring Cambodia's flood-prone plains and Tonle Sap. Mekong riverbanks and remote forests hold silk weaving, resilient faith, and a youthful population balancing haunting history with forward motion.",
  cameroon:
    "Cameroon has enough climate and cultural range to punish loose planning. Douala or Yaounde can start the route, then one direction should lead. Volcanic mountains, beaches, and highland towns need local guidance and realistic road time.",
  canada:
    "Canada's boreal forests and deep blue lakes stretch from Atlantic cliffs to Pacific rainforests. Between Toronto's cosmopolitan streets and Quebec City's French-speaking charm lie prairies, tundra, winter outdoors culture, and a northern habit of polite hospitality.",
  "central-african-republic":
    "Central African Republic is not a conventional sightseeing surface. Bangui can sit inside a specialist plan with river corridors or forest reserves. Current safety checks, local contacts, and a narrow purpose should guide every move.",
  chad:
    "Chad is a specialist overland journey before it is a scenic one. N'Djamena can orient the trip, while Ennedi formations and desert lakes require permits. Heat planning and enough time for distance matter before rock art or remote landscapes.",
  chile:
    "Chile is a thin ribbon squeezed between Andes and Pacific, running from the world's driest desert to southern fjords. Fertile valleys and smog-framed Santiago sit between those extremes, shaped by poetry, crisp wine, and survivalist grit.",
  china:
    "China is a global titan of industrial zones, ancient trade routes, and massive infrastructure. From the Great Wall to high-speed rail, dynastic history meets urban density. Collective resilience, family legacy, and relentless modern drive shape the culture.",
  colombia:
    "Colombia carries emerald hills, roasting coffee, and cities that rarely sleep. Caribbean heat and chilly Andean peaks sit inside a complex, colorful history, while a work-hard, dance-harder energy makes the whole country feel alive.",
  "costa-rica":
    "Lush rainforests and smoking volcanoes frame sloths, toucans, and bright tree frogs. From Pacific surf to Caribbean mangroves, Costa Rica concentrates extraordinary biodiversity in a green sanctuary shaped by environmental stewardship and Pura Vida ease.",
  cuba:
    "Cuba feels like a mid-century fever dream of crumbling pastel facades, tail-finned Chevrolets, sea salt, and tobacco smoke. Beyond Havana, the limestone mogotes of Vinales and a slow Caribbean pulse reveal defiant resilience, rum, and constant percussion.",
  "democratic-republic-of-the-congo":
    "Democratic Republic of the Congo demands a narrow specialist plan. Kinshasa and the Congo River can frame the journey, but park or volcano travel depends on access. Safety logistics and expert support should decide what is realistic.",
  djibouti:
    "Djibouti turns heat, salt, and volcanic terrain into a tight Red Sea route. The city works as a reset between desert drives and lake stops. Whale-shark water or coast time needs season checks rather than casual wandering.",
  "dominican-republic":
    "Dominican Republic pairs tall mountain ranges with palm-fringed shores and some of the Caribbean's strongest sand. Santo Domingo's cobblestone heart and Samana's green peninsula mix old-world echoes with resort energy, merengue, baseball, and warm hospitality.",
  "east-timor":
    "East Timor rewards travelers who treat flexible transport as part of the trip. Dili gives the historical frame before reef days or coffee districts shift the pace. Mountain roads need local guidance and patient timing.",
  ecuador:
    "Andean markets and colonial plazas sit beneath snow-capped volcanoes. Ecuador can move from the equator to the Amazon in a day, then out to Galapagos wildlife, packing huge geography into a small country fueled by mountain soups and steady resilience.",
  egypt:
    "Egypt is strongest when the Nile becomes the spine and Cairo is more than a staging point. Monument days and museum time need their own space. Red Sea recovery or desert routes should be added only when heat and transfers still make sense.",
  "el-salvador":
    "El Salvador is compact enough to tempt daily movement. Surf towns and volcano routes can sit close together, but the day still needs a rhythm. Coffee hills and San Salvador culture should follow weather and safety context.",
  "equatorial-guinea":
    "Equatorial Guinea splits quickly between Bioko and the mainland. Malabo and Bata travel like different bases, so visas and local contacts matter early. Rainforest routes or island landscapes should be planned with that divide in mind.",
  eritrea:
    "Eritrea's appeal sits in the contrast between Asmara and Massawa. Highland modernism and Red Sea port history can form a focused heritage route. Permissions, current access, and local guidance decide how far it can extend.",
  ethiopia:
    "Ethiopia needs sequencing as much as curiosity. Addis Ababa can open the route before rock-hewn churches or ancient capitals deepen it. Coffee culture and mountain treks require altitude planning plus current security context.",
  "falkland-islands":
    "Falkland Islands travel follows wildlife and weather rather than speed. Stanley can orient the trip before walking days or farm stays. Birding and inter-island flights need buffers because the best days cannot be forced.",
  fiji:
    "Fiji needs arrival logistics separated from island time. Nadi and marina routes handle movement before reef days or village visits take over. Boats and flights should set the pace so beach recovery does not feel scheduled to death.",
  "french-guiana":
    "French Guiana is an Amazonian Atlantic trip with limited road logic. Cayenne and the space center can frame the visit before the route turns harder. River settlements and rainforest reserves need guided access planned honestly.",
  gabon:
    "Gabon is a nature-led trip that needs logistics before romance. Libreville can reset the route before rainforest parks or river travel begin. Wildlife coastlines depend on guides, season, and transfers more than a loose itinerary.",
  gambia:
    "Gambia is narrow and river-shaped, which makes it easy to overpack. Beach time and Banjul can form the opening rhythm. Birding routes and river lodges land better as short hops with community-led stops, especially when the river day is allowed to stay slow.",
  georgia:
    "Georgia is compact but layered enough to need a city-and-region rhythm. Tbilisi can set the first mood before wine villages or monastery roads take over. Highland routes should follow weather and border timing.",
  ghana:
    "Ghana should move from Accra with purpose rather than drift across the map. Cape Coast history and Kumasi market life deserve more than quick detours. Beach time or park days gain depth when inland travel time is respected.",
  greenland:
    "Greenland demands one region at a time. Weather-dependent flights and daylight set the scale before any wish list does. Icebergs and fjords need buffers, while small towns and hiking routes remind travelers that movement is part of the trip.",
  guatemala:
    "Mist-covered highlands and volcanic peaks overlook Mayan ruins hidden in rainforest. Chichicastenango markets and Antigua's cobblestones sit in a landscape rich with jade and volcanic soil, shaped by vibrant textiles, Indigenous traditions, and coffee-scented air.",
  guinea:
    "Guinea needs conservative routing around road time and local support. Conakry can orient the trip before the Fouta Djallon or Atlantic islands enter the plan. Transfers should be realistic before the route widens, with market time and mountain scenery paced separately.",
  "guinea-bissau":
    "Guinea Bissau is slow travel built around boats, cash, and patience. Bissau can carry the opening stretch before the Bijagos islands take over. Weather windows and local guidance should lead the plan, especially when island stays depend on tides and transfers.",
  guyana:
    "Guyana should be planned from the rainforest outward. Georgetown gives the cultural base, but Kaieteur Falls or savannah lodges change the logistics. Small flights and boats decide how wide the route can go, with guides shaping the days between them.",
  haiti:
    "Haiti's steep sun-scorched mountains and hidden azure coves vibrate with raw artistic energy. From the Citadelle to Port-au-Prince markets, the landscape matches a dramatic history shaped by revolutionary pride, Vodou traditions, and brilliant color.",
  honduras:
    "Honduras changes sharply between islands and inland routes. Copan and the Bay Islands ask for different logistics. Cloud forest or mountain roads can fit only when safety-aware transport sets the order, leaving the island downtime separate from inland ruins.",
  "hong-kong":
    "Hong Kong is easiest to understand through movement: up hills, across the harbor, and along MTR lines. Dense food streets and shopping districts need elevation-aware days. Ferries and ridge hikes keep the city from feeling only vertical.",
  india:
    "India spans Himalayan foothills, desert forts, river cities, and tropical coasts in a vast cultural mosaic. From Mumbai's finance towers to Varanasi's ghats and Bengaluru's tech corridors, it fuses ancient ritual, family legacy, and relentless modern drive.",
  indonesia:
    "Volcanic peaks tower over rainforest and coral-fringed shores across Indonesia's vast archipelago. From Bali's terraced slopes to Jakarta's urban heat, ethnic traditions and maritime trade roots meet a modern, resource-driven economic rise.",
  iran:
    "Iran rewards a focused corridor more than a sweeping survey. Tehran, Isfahan, and Shiraz can anchor a deep cultural route. Bazaars, garden cities, and desert towns need current access checks plus careful distance planning.",
  iraq:
    "Iraq requires current safety checks and local expertise before any route is sensible. Baghdad and the holy cities need a different plan from Erbil or mountain travel. Treat each region as its own access context.",
  israel:
    "Israel is compact, intense, and better paced by theme than by distance. Jerusalem and Tel Aviv pull the trip in different directions. Desert time, holy-site routes, and coast days need security context plus rest built in.",
  "ivory-coast":
    "Ivory Coast carries its strongest first impression through Abidjan. Food and music give the city its pulse before markets or beach towns widen the route. Local guidance and longer transfers should set the pace, especially when the route leaves the coast.",
  jamaica:
    "Jamaica is a lush emerald rock where jerk spice mingles with Blue Mountain mist. From Cockpit Country limestone to the north shore's turquoise shallows, the island moves to a bass-heavy rhythm shaped by music, sharp wit, and an out-of-many-one-people spirit.",
  japan:
    "Japan is a high-tech archipelago where Tokyo neon contrasts with Kyoto's wooden temples. Robotics, automotive exports, and omotenashi hospitality sit beside volcanic peaks, bullet trains, and a culture of precision that defines modern East Asian influence.",
  jordan:
    "Jordan has a clear road-trip spine, but the major moments need air between them. Amman can lead into Petra before Wadi Rum changes the scale. The Dead Sea works better when heat and drive buffers are protected, especially on shorter trips.",
  kazakhstan:
    "Kazakhstan is a big-distance country with a few strong anchors. Almaty and Astana should be linked by flights or rail before canyon drives enter the plan. Silk Road towns and nature days need room on either side, so the country does not become transit math.",
  kenya:
    "Kenya is easier to plan as separate city, safari, and coast chapters. Nairobi handles the practical side before wildlife timing takes over. Maasai Mara routes and Indian Ocean recovery need their own transfer rhythm, with downtime protected between long moves.",
  kuwait:
    "Kuwait is a short-stay Gulf route shaped by heat and private-car movement. Kuwait City carries souks, towers, and museum time before seafront evenings. Desert camps need opening hours and city-to-desert timing checked early.",
  kyrgyzstan:
    "Kyrgyzstan is a mountain trip before it is a city trip. Bishkek can orient the route before lake days and high passes take over. Yurt stays or horse routes need season checks and local guiding, with flexible road days kept open for weather.",
  laos:
    "Saffron-robed monks and French colonial shutters line Luang Prabang, where the Mekong cuts through jungle-clad mountains. Tiered waterfalls, limestone caves, silk weaving, sticky rice rituals, and slow Buddhist culture give Laos its quiet gravity.",
  lebanon:
    "Lebanon is compact on the map and complicated in motion. Beirut may sit close to mountains and ruins, but traffic changes the day quickly. Coast towns and village routes should follow current safety advice, with day trips planned more carefully than distance suggests.",
  lesotho:
    "Lesotho should be treated as a highland route rather than a quick add-on. Mountain passes and pony trekking need altitude at the center of the plan. Stone villages and regional road links should follow weather, with border timing checked before the drive begins.",
  liberia:
    "Liberia asks for patience with transport and a clear local support plan. Monrovia can frame the trip before surf beaches or rainforest parks enter the route. Coastal roads need flexibility rather than tight scheduling, especially when rain changes the day.",
  libya:
    "Libya remains a powerful but complicated heritage route. Tripoli and Roman sites should only enter planning with current safety checks. Sahara oases and Mediterranean coast towns require expert logistics, with access rules treated as the first itinerary layer.",
  macau:
    "Macau is a compact contrast between old streets and resort scale. Portuguese-Chinese lanes and casino hotels sit close together, but they serve different moods. Bakeries, temples, and ferry links make the route feel layered.",
  madagascar:
    "Madagascar is too slow-moving for a casual full-island loop. Choose one wildlife or landscape route first, then let Antananarivo handle the reset. Baobab roads and lemur parks need real transfer buffers, as do reef coasts that look close on a map.",
  malawi:
    "Malawi has a gentle rhythm when the lake becomes part of the route rather than a backdrop. Lilongwe can handle arrivals before tea estates or plateau hikes shift the mood. Safari parks need road distances balanced against slow stays.",
  malaysia:
    "Colonial shophouses and food-stall alleys sit beneath the Petronas Towers. Malaysia moves from Borneo jungle treks to tea-rich Cameron Highlands, Langkawi sands, and Penang's street kitchens, turning humid contrast into a sensory route.",
  mali:
    "Mali carries deep cultural weight, but access and safety define the trip before curiosity does. Bamako and the Niger River should stay inside a realistic plan. Desert music and mud architecture need specialist support, with the route kept narrow enough to be responsible.",
  mauritania:
    "Mauritania is a Sahara-and-Atlantic journey built around distance. Nouakchott can orient the plan before desert caravans or ancient ksour take over. Banc d'Arguin belongs in a clear coast-or-desert priority, with specialist logistics shaping the route.",
  mexico:
    "Mexico pairs turquoise coastlines with ancient stone pyramids tucked in tropical jungle. From high-altitude Mexico City to Oaxaca's colonial plazas, volcanic peaks and arid deserts frame vibrant festivals, world-famous cuisine, and deep Mesoamerican history.",
  mongolia:
    "Mongolia is a distance-and-weather trip before it is a checklist. Ulaanbaatar can start the route before ger camps or the Gobi take over. Steppe horizons and lake country need guides and drive days planned first.",
  morocco:
    "Morocco should be paced around city intensity and the reset that follows it. Marrakesh and Fes can lead with very different pressure. Atlas roads and desert nights feel better when souks and courtyard pauses stay balanced.",
  mozambique:
    "Mozambique is a long coastal route that rewards planning before beach dreaming. Maputo can open the trip before island archipelagos or reef days take over. Flights and roads need clarity early, with transfer buffers protected before the coast starts to feel relaxed.",
  myanmar:
    "Myanmar needs current safety checks and an ethics-aware route before any sightseeing plan. Yangon and Bagan should only be considered through access conditions. Mandalay or Inle Lake needs local guidance shaping any wider route.",
  namibia:
    "Namibia is a driving itinerary shaped by gravel, fuel, and sky. Windhoek handles the reset before Sossusvlei or Etosha take over. Skeleton Coast days need rental style and scenic drive time built into the route, with fuel planning treated seriously.",
  nepal:
    "Prayer flags flutter over high-altitude trails and ancient brick courtyards in the Kathmandu Valley. Nepal stretches from Terai plains to the world's tallest peaks, where Lumbini's meditation halls and Namche Bazaar's gear shops blend spiritual depth with mountain grit.",
  "new-caledonia":
    "New Caledonia blends French Pacific infrastructure with Kanak cultural context. Noumea can anchor the trip before lagoon days shift the pace. Reef beaches and outer-island time need car logistics considered early.",
  "new-zealand":
    "Glacial fjords and geothermal springs cut through New Zealand's alpine ridges and green pastures. North Island volcanic plateaus and South Island sounds frame forests, turquoise lakes, Maori tradition, and an outdoor culture shaped by distance and weather.",
  nicaragua:
    "Deep blue lakes and smoldering volcanoes dominate Nicaragua's colonial cathedrals and cloud forests. Pacific surf breaks and the Afro-Caribbean Corn Islands reveal raw terrain, revolutionary poetry, street-side fritangas, and an unpolished Central American charm.",
  niger:
    "Niger is a specialist Sahel-and-Sahara route. Niamey can orient the trip before desert or river travel enters the plan. Current safety checks and permits need to lead, with heat planning and local logistics shaping every longer move.",
  nigeria:
    "Nigeria should be planned through city energy and strong local support. Lagos gives the trip its force before Abuja or regional food routes widen the frame. Traffic and distance should keep the route realistic, with social plans built around local timing.",
  "north-korea":
    "North Korea can only be approached as a restricted organized itinerary. Pyongyang and official site visits belong inside access rules. Controlled transport and guided limits define the trip more than independent route planning.",
  oman:
    "Oman gives road trips a calmer Gulf rhythm when the driving plan is honest. Muscat can open the journey before wadis and forts take over. Mountain villages need heat, swim stops, and overnight settings coordinated.",
  pakistan:
    "Pakistan needs a route shaped by season and altitude as much as interest. Lahore or Karachi can anchor the city side before mountain valleys pull the trip north. Local support and realistic road timing matter early.",
  panama:
    "Tropical islands and cloud forests meet glass towers above the world's most famous shipping canal. From Bocas del Toro reefs to Boquete coffee farms, Panama bridges oceans and continents through maritime trade, salsa rhythms, and a diverse crossroads culture.",
  "papua-new-guinea":
    "Papua New Guinea is highly specialized travel, not a casual island hop. Port Moresby may frame the route before highland or reef travel begins. Expert local planning, buffered flights, and cultural respect are essential.",
  paraguay:
    "Paraguay rewards a slower inland rhythm. Asuncion can set the tone before mission ruins or river towns enter the plan. Chaco landscapes need heat and drive time kept practical, while river context gives the route more shape than distance alone.",
  peru:
    "Peru is a vertical assault on the senses, where Pacific desert crashes into the Andes before diving toward the Amazon. Beyond Machu Picchu, Lima's flavor-heavy grit and the sacred valleys reveal Incan scars, high-altitude silence, and world-beating culinary ambition.",
  philippines:
    "The Philippines is a chain of more than 7,000 islands shaped by volcanic terrain, coral shores, and Manila's urban density. Colonial history, family-centered culture, a global service economy, and a vast diaspora fuse island life with modern democratic drive.",
  "puerto-rico":
    "Puerto Rico gains depth when San Juan nights and island drives are paced separately. The old city deserves its own evening rhythm before beach days take over. Rainforest trails and lechon routes need room around rental-car timing.",
  qatar:
    "Qatar is a focused Gulf stop shaped by heat, bookings, and short distances. Doha can carry a compact city stay through museums and souqs. Desert dunes need tight timing so the day does not become a hot transfer, especially on a short layover-style route.",
  "republic-of-the-congo":
    "Republic of the Congo needs Brazzaville treated as the reset point for harder nature logistics. Rainforest parks or river routes require guides and permits first. Atlantic-side travel should follow transport reality, with long transfers kept visible from the start.",
  rwanda:
    "Rwanda is compact, orderly, and permit driven. Kigali grounds the trip before gorilla trekking or lake time begins. Memorial sites and conservation rules should be planned with road timing rather than added casually, especially on short stays.",
  "saudi-arabia":
    "Saudi Arabia needs purpose-led planning because each route asks for a different pace. Riyadh and Jeddah feel like separate trips, while AlUla changes the scale again. Heat, bookings, and travel context should shape the plan.",
  senegal:
    "Senegal comes alive when Dakar's energy is balanced with a slower coast or delta leg. Goree Island and Saint-Louis deserve context, not quick detours. Surf beaches and food routes need realistic north-south transfer time.",
  "sierra-leone":
    "Sierra Leone is a slow Atlantic route with serious road logistics. Freetown can anchor the trip before peninsula beaches or island time takes over. Rainforest hills need weather and local guidance, with flexible transfers kept in the plan.",
  singapore:
    "Man-made supertrees and colonial shophouses sit inside Singapore's dense, humid garden city. The island is a hyper-efficient crossroads where malls meet hawker centers, and Malay, Chinese, and Indian influences create a global food and finance hub.",
  "solomon-islands":
    "Solomon Islands travel is built around boats, flights, and quiet island time. Honiara can orient the trip before reef days or village stays take over. WWII sites and lagoons need weather buffers and cultural etiquette, with flight gaps treated as part of the plan.",
  somalia:
    "Somalia is not a normal tourism planning surface. Mogadishu and the Indian Ocean coast should only be considered with current safety checks. Port history or markets belong inside specialist support and a narrow purpose, not a casual sightseeing route.",
  somaliland:
    "Somaliland is a rare overland route that depends on local structure. Hargeisa can anchor the plan before Laas Geel or the Berbera coast enter the route. Permits and security checks matter, as do modest daily distances and trusted local drivers.",
  "south-africa":
    "South Africa needs city, safari, and coast treated as separate chapters. Cape Town and Johannesburg ask for different choices before wine routes or parks enter the plan. Safety awareness and car time should stay realistic.",
  "south-korea":
    "Neon-lit Seoul skyscrapers rise over ancient palaces in a country known for electronics, cars, and K-culture. South Korea balances high-pressure urban innovation with Buddhist mountain retreats, fusing rapid growth with a digital-first lifestyle.",
  "south-sudan":
    "South Sudan requires a narrow purpose and trusted local support. Juba or river-country travel should only be planned with current safety checks. Nile wetlands and cattle-camp culture depend on river-season timing, with access decisions made before any route expands.",
  "sri-lanka":
    "Mist-shrouded tea plantations and colonial forts dot Sri Lanka, where wild elephants roam near ancient Buddhist ruins. Southern surf beaches, Sigiriya's rock fortress, jungle roads, spicy curries, and warm hospitality create a compact island journey.",
  sudan:
    "Sudan remains a Nile-and-desert route for specialist planning. Khartoum and archaeological landscapes should only be approached with current safety checks. Pyramids or Red Sea access need permits and trusted local support.",
  suriname:
    "Suriname should let Paramaribo's heritage set up the river or rainforest leg. Dutch-Creole architecture gives the city its frame. Maroon communities and jungle lodges need logistics planned with boat routes, so the inland portion feels intentional.",
  swaziland:
    "Swaziland is a compact mountain-and-valley route that pairs naturally with regional road travel. Craft markets and wildlife reserves can fill a slower stay. Scenic drives and lodge time should not be treated as quick stops.",
  syria:
    "Syria carries extraordinary heritage, but travel planning must begin with current safety and access. Damascus and Aleppo should only be considered through expert local guidance. Palmyra or desert routes need even narrower planning.",
  taiwan:
    "Taiwan is easy to move through, which makes food and weather planning more important. Taipei can anchor the trip before night markets or temple streets set the rhythm. Hot springs and nature corridors should lead whole days.",
  tajikistan:
    "Tajikistan is a Pamir-and-valley route shaped by altitude and permits. Dushanbe can orient the trip before high mountain roads take over. Homestays and lakes need 4x4 logistics plus weather buffers, with spare days reserved for passes.",
  thailand:
    "Gilded temple spires and tangled night markets define Thailand, where rainforests meet emerald coasts. Misty northern mountains and southern limestone karsts frame a world-famous culinary scene, deep Buddhist traditions, and a warm, hospitable culture.",
  "the-bahamas":
    "The Bahamas spreads across more than seven hundred islands where clear water glows over white sand. Nassau's casinos and the Out Islands' pink-sand quiet show geography that is more ocean than earth, shaped by Junkanoo, conch salad, and maritime ease.",
  togo:
    "Togo is narrow enough for compact contrasts. Lome can frame the coast before mountain villages or heritage routes pull the trip inland. Border logistics and local guidance should be planned together.",
  "trinidad-and-tobago":
    "Trinidad and Tobago should be treated as two island rhythms. Carnival energy and doubles stalls belong to one pace, while Tobago reef time belongs to another. Keep the route distinct rather than generic.",
  tunisia:
    "Tunisia carries coast, city, and desert time close enough to tempt a rush. Tunis and Carthage can anchor the north before medinas or Roman sites widen the route. Oasis days need heat-aware timing.",
  turkey:
    "Turkey should be planned by region, season, and transport rather than by a giant landmark list. Istanbul can anchor the route before Cappadocia changes the pace. The Aegean or Black Sea towns need separate timing.",
  turkmenistan:
    "Turkmenistan is a controlled desert route where access rules shape the experience. Ashgabat can anchor the plan before Silk Road sites or gas-crater landscapes enter. Visas and guides come first, along with permits and fixed schedules.",
  uae:
    "United Arab Emirates needs purpose before polish. Dubai and Abu Dhabi serve different trips, while desert resorts or beaches change the day completely. Heat and drive time should separate museums, skyline dining, and coast time.",
  uganda:
    "Uganda is a nature-heavy route with city recovery built in. Kampala can reset the trip before gorilla trekking or Nile adventures take over. Crater lakes need permits, wildlife timing, and road transfers planned early.",
  "united-republic-of-tanzania":
    "United Republic of Tanzania is a split between safari, mountain, and coast. Arusha can start the wildlife plan before Serengeti routes or Kilimanjaro change the effort level. Zanzibar needs beach recovery sequenced clearly.",
  uruguay:
    "Uruguay rewards a relaxed Atlantic pace. Montevideo and Colonia can carry a compact route before beach towns or wine roads take over. Ferry logistics should leave room for seaside downtime.",
  uzbekistan:
    "Uzbekistan has a clear Silk Road spine, which keeps planning elegant if the train order is right. Tashkent can start the route before Samarkand, Bukhara, or Khiva slows the pace. Heat-aware timing and market pauses matter.",
  vanuatu:
    "Vanuatu is an adventure-led Pacific route that depends on island choice. Port Vila can open the trip before volcano visits or reef lagoons take over. Village culture needs weather, etiquette, and transfer buffers first.",
  venezuela:
    "Venezuela has extraordinary landscapes, but current safety and access must set the route. Caracas and Angel Falls should not be planned the same way as the islands or Andean towns. Local expertise and focused transport matter.",
  vietnam:
    "Vietnam's limestone peaks overlook turquoise waters while tiered rice paddies climb the northern highlands. From Hanoi's motorbike flow to Mekong canals, the terrain carries a history of grit. Coffee culture and industrial growth define its modern trajectory.",
  "west-bank":
    "West Bank travel needs local guidance and respectful pacing before any route is useful. Bethlehem and Ramallah need access rules kept visible, while Jericho or Nablus asks for heritage context. Daily movement should stay flexible.",
  "western-sahara":
    "Western Sahara is a desert Atlantic route shaped by distance and political context. Dakhla can anchor a focused plan before longer coastal roads enter the route. Access and permits should be checked before the map widens.",
  yemen:
    "Yemen holds extraordinary heritage, but severe access challenges define any responsible plan. Sana'a and Socotra should only be considered with current safety checks. Hadhramaut towns and mountain villages need specialist support.",
  zambia:
    "Zambia is a river-and-safari country where timing matters more than variety. Lusaka can handle the reset before Victoria Falls or Lower Zambezi enters the route. South Luangwa should be chosen around park season and transfers.",
  zimbabwe:
    "Zimbabwe needs heritage, safari, and waterfall time balanced rather than stacked. Harare can frame the trip before Victoria Falls or Hwange takes over. Great Zimbabwe and longer travel days need local guidance.",
};

const countryDescriptionLimit = 320;
const capitalNameOverrides: Record<string, string> = {
  "northern-cyprus": "North Nicosia",
  "republic-of-serbia": "Belgrade",
  somaliland: "Hargeisa",
  "the-bahamas": "Nassau",
  "united-republic-of-tanzania": "Dodoma",
  ukraine: "Kyiv",
  "west-bank": "Ramallah",
};

const capitalCoordinateOverrides: Record<string, [number, number]> = {
  "northern-cyprus": [35.1856, 33.3823],
  "republic-of-serbia": [44.7866, 20.4489],
  somaliland: [9.5624, 44.077],
  "the-bahamas": [25.0443, -77.3504],
  "united-republic-of-tanzania": [-6.163, 35.7516],
  ukraine: [50.4501, 30.5234],
  "west-bank": [31.9038, 35.2034],
};

function appendIfFits(base: string, addition: string, limit = countryDescriptionLimit): string {
  const normalized = `${base} ${addition}`.replace(/\s+/g, " ").trim();
  return normalized.length <= limit ? normalized : base;
}

function cityCoverageClause(country: WorldCountrySeed, capitalName: string | undefined, curatedCities: Array<Omit<City, "listCount">>) {
  const cityNames = curatedCities
    .map((city) => city.name)
    .filter((name, index, names) => names.indexOf(name) === index)
    .slice(0, 3);

  if (cityNames.length > 1) {
    const lastCity = cityNames[cityNames.length - 1];
    return `${cityNames.slice(0, -1).join(", ")} and ${lastCity}`;
  }

  return cityNames[0] ?? capitalName ?? country.name;
}

function buildCountryDescription(country: WorldCountrySeed): string {
  const capitalFeature = countryCapitalLookup.get(normalizePlaceName(country.name));
  const capitalName = capitalNameOverrides[country.id] ?? capitalFeature?.capital;
  const curatedCities = curatedCitySeeds[country.id] ?? [];
  const europeBase = europeanCountryDescriptions[country.id];
  const continentContext: Record<string, { base: string; route: string }> = {
    "North America": {
      base: "big-city routes, coastlines, road-trip corridors, and strong regional identities",
      route: "food, nightlife, nature, culture, stays, and activities across city and regional routes",
    },
    "South America": {
      base: "vibrant city culture, dramatic landscapes, late-night neighborhoods, and high-contrast regional trips",
      route: "food, music, nature, culture, stays, and activities across cities and scenic regions",
    },
    Europe: {
      base: "walkable historic centers, rail-friendly routing, regional food scenes, and dense cultural coverage",
      route: "food, nightlife, nature, culture, stays, and activities across city breaks and regional loops",
    },
    Africa: {
      base: "major city hubs, natural landmarks, heritage sites, and regionally distinct travel styles",
      route: "food, culture, nature, stays, nightlife, and activities across city and regional routes",
    },
    Asia: {
      base: "capital hubs, deep food culture, temples or heritage sites, and wide regional variety",
      route: "food, nightlife, nature, culture, stays, and activities across capitals and regional hubs",
    },
    Oceania: {
      base: "coastal cities, outdoors-first routes, island or road-trip travel, and destination-style itineraries",
      route: "food, nature, culture, stays, nightlife, and activities across cities and scenic routes",
    },
  };

  const context =
    continentContext[country.continentName] ?? {
      base: "city and regional travel routes with varied local character",
      route: "food, nightlife, nature, culture, stays, and activities across practical trip routes",
  };
  const coverage = cityCoverageClause(country, capitalName, curatedCities);

  if (europeBase) {
    return europeBase;
  }

  const descriptionOverride = countryDescriptionOverrides[country.id];

  if (descriptionOverride) {
    return descriptionOverride;
  }

  if (curatedCities.length) {
    return appendIfFits(
      `${country.name} should start with ${coverage}, then widen only when the route has room. ${context.base} can shape the next leg without turning the country into a checklist.`,
      "Regional routes can expand coverage as fuller guides are added.",
    );
  }

  return appendIfFits(
    `${country.name} currently starts with ${coverage} and seed regions rather than full guide depth. The description should help travelers read the map while fuller city and regional coverage is added.`,
    "Use current local context before treating those seeds as a fixed itinerary.",
  );
}

function createCountry(country: WorldCountrySeed): Country {
  if (country.id === "usa") {
    return {
      id: country.id,
      name: country.name,
      continent: country.continentName,
      description:
        "Steel-glass skyscrapers and suburban sprawl give way to carved canyons, golden wheat fields, Rockies peaks, and swampy Southern bayous. The United States offers endless regional variety, defined by cinematic ambition, local pride, and a constant drive for innovation.",
      subareas: usaRegionSeeds,
      states: usaStateSeeds.map((state) => ({
        ...state,
        description:
          usaStateDescriptionById[state.id] ??
          `${state.name} offers a mix of city hubs, regional routes, and local culture for U.S. trip planning.`,
      })),
      bounds: country.bounds,
      cities: usaCitySeeds.map((city) => ({
        ...withSeededSubareas({
          ...withTopCityDescription(city),
          country: country.name,
          continent: country.continentName,
        }),
        listCount: 0,
      })),
    };
  }

  if (country.id === "united-kingdom") {
    const subareas = getCountrySubareas(country);
    const curatedCities = curatedCitySeeds[country.id] ?? [];

    return {
      id: country.id,
      name: country.name,
      continent: country.continentName,
      description: buildCountryDescription(country),
      subareas,
      states: ukStateSeeds,
      bounds: country.bounds,
      cities: curatedCities.map((city) => ({
        ...withSeededSubareas(assignCityToNearestSubarea(withTopCityDescription(city), subareas)),
        listCount: 0,
      })),
    };
  }

  const subareas = getCountrySubareas(country);
  const curatedCities = curatedCitySeeds[country.id];
  const fallbackCities: City[] = [
    createFallbackPrimaryCity(country),
    ...fallbackRegionKinds.map((regionKind) => createDummyCity(country, regionKind)),
  ];
  const regionCities = fallbackRegionKinds.map((regionKind) => createDummyCity(country, regionKind));

  return {
    id: country.id,
    name: country.name,
    continent: country.continentName,
    description: buildCountryDescription(country),
    subareas,
    bounds: country.bounds,
    cities: (curatedCities ? [...curatedCities, ...regionCities] : fallbackCities).map((city) => ({
      ...withSeededSubareas(assignCityToNearestSubarea(withTopCityDescription(city), subareas)),
      listCount: 0,
    })),
  };
}

export const continents: Continent[] = continentDefinitions.map((continent) => ({
  ...continent,
  subareas: buildContinentSubareas(continent),
  countries: [...worldCountrySeeds, ...supplementalWorldCountrySeeds]
    .filter((country) => country.continentId === continent.id)
    .sort((left, right) => left.name.localeCompare(right.name))
    .map(createCountry),
}));

export const cities: City[] = continents.flatMap((continent) =>
  continent.countries.flatMap((country) => country.cities),
);
