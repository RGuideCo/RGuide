import { getCountryCode, getCountryData } from "countries-list";
import capitalCoordinates from "@/data/capital-coordinates.json";
import fetchedCityNeighborhoods from "@/data/city-neighborhoods.json";
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

const worldCountrySeeds = worldCountries as unknown as WorldCountrySeed[];
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

const cityImage = (query: string) =>
  `https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80&${query}`;

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
    "Paris|France",
    [
      {
        id: "first-arrondissement",
        name: "1st Arrondissement",
        coordinates: [48.8624, 2.3368],
        description:
          "Royal Paris around the Louvre, Palais Royal, and Tuileries, with monument-density and classic central walks.",
      },
      {
        id: "le-marais",
        name: "Le Marais",
        coordinates: [48.8576, 2.3622],
        description:
          "A historic district of elegant streets, boutiques, museums, and lively cafe culture across the 3rd and 4th arrondissements.",
      },
      {
        id: "saint-germain-des-pres",
        name: "Saint-Germain-des-Pres",
        coordinates: [48.8546, 2.3339],
        description:
          "Classic Left Bank Paris with literary history, polished cafes, galleries, and easy walks to major riverfront landmarks.",
      },
      {
        id: "montmartre",
        name: "Montmartre",
        coordinates: [48.8867, 2.3431],
        description:
          "A hilltop neighborhood known for Sacré-Cœur, artist heritage, and village-like streets with strong views over the city.",
      },
      {
        id: "canal-saint-martin",
        name: "Canal Saint-Martin",
        coordinates: [48.8721, 2.3648],
        description:
          "A creative, younger-feeling area around the canal with waterside paths, independent shops, and strong casual dining and nightlife.",
      },
      {
        id: "latin-quarter",
        name: "Latin Quarter",
        coordinates: [48.8494, 2.347],
        description:
          "A busy academic and historic zone near the Sorbonne, with bookstores, classic bistros, and landmarks around the Panthéon.",
      },
      {
        id: "seventh-arrondissement",
        name: "7th Arrondissement",
        coordinates: [48.8563, 2.3126],
        description:
          "A prestigious riverside district anchored by the Eiffel Tower, broad avenues, embassies, and landmark museums like Musée d'Orsay.",
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
          "Barcelona's medieval core, full of narrow lanes, historic squares, and landmark architecture around the cathedral and old city center.",
      },
      {
        id: "el-born",
        name: "El Born",
        coordinates: [41.3852, 2.1823],
        description:
          "A stylish old-town quarter known for design shops, tapas bars, Santa Maria del Mar, and some of the city's best nighttime wandering.",
      },
      {
        id: "eixample",
        name: "Eixample",
        coordinates: [41.3917, 2.1649],
        description:
          "A grand, grid-planned district with Modernist landmarks, broad avenues, strong dining, and some of Barcelona's most polished city energy.",
      },
      {
        id: "gracia",
        name: "Gracia",
        coordinates: [41.4036, 2.1565],
        description:
          "A village-like neighborhood of plazas, cafes, and independent shops that feels more local, relaxed, and bohemian than the city center.",
      },
      {
        id: "poble-sec",
        name: "Poble-sec",
        coordinates: [41.3745, 2.1648],
        description:
          "A lively hillside neighborhood known for tapas, theaters, and a strong evening scene around Carrer de Blai and the foot of Montjuic.",
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
          "The ceremonial and historic heart with Big Ben, Westminster Abbey, and Buckingham Palace in one compact central zone.",
      },
      {
        id: "soho",
        name: "Soho",
        coordinates: [51.5136, -0.1365],
        description:
          "London's entertainment center for West End theaters, destination dining, and one of the city's busiest nightlife scenes.",
      },
      {
        id: "covent-garden",
        name: "Covent Garden",
        coordinates: [51.5118, -0.1238],
        description:
          "Known for its piazza, street performers, shopping lanes, and the Royal Opera House in the center of town.",
      },
      {
        id: "south-bank",
        name: "South Bank",
        coordinates: [51.505, -0.116],
        description:
          "A cultural riverside stretch with the London Eye, Tate Modern, and major performance venues along the Thames.",
      },
      {
        id: "bloomsbury",
        name: "Bloomsbury",
        coordinates: [51.5226, -0.1257],
        description:
          "An intellectual district of garden squares, classic institutions, and museum-heavy routes anchored by the British Museum.",
      },
      {
        id: "marylebone",
        name: "Marylebone",
        coordinates: [51.5226, -0.1496],
        description:
          "A village-feel central district with elegant streets, independent boutiques, and landmark attractions like Madame Tussauds.",
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
      "England combines global cities, heritage towns, countryside routes, and high-density rail-connected travel corridors.",
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
  { id: "birmingham", name: "Birmingham", coordinates: [33.5186, -86.8104], stateId: "alabama", countrySubareaId: "southeast", image: cityImage("birmingham"), description: "Alabama's best-known urban hub, with historic districts, food culture, and a growing creative scene." },
  { id: "anchorage", name: "Anchorage", coordinates: [61.2181, -149.9003], stateId: "alaska", countrySubareaId: "pacific", image: cityImage("anchorage"), description: "Alaska's main city base for mountain views, day trips, and practical northern itineraries." },
  { id: "phoenix", name: "Phoenix", coordinates: [33.4484, -112.074], stateId: "arizona", countrySubareaId: "southwest", image: cityImage("phoenix"), description: "Desert light, resort access, and a steadily improving urban core make Phoenix a major Southwest anchor." },
  { id: "little-rock", name: "Little Rock", coordinates: [34.7465, -92.2896], stateId: "arkansas", countrySubareaId: "southeast", image: cityImage("littlerock"), description: "A compact river city with approachable neighborhoods and a strong local-food backbone." },
  { id: "los-angeles", name: "Los Angeles", coordinates: [34.0522, -118.2437], stateId: "california", countrySubareaId: "west-coast", image: cityImage("losangeles"), description: "Sunlit sprawl where beach culture, design spots, and destination dining all coexist." },
  { id: "san-francisco", name: "San Francisco", coordinates: [37.7749, -122.4194], stateId: "california", countrySubareaId: "west-coast", image: cityImage("sanfrancisco"), description: "A compact, high-demand city with iconic waterfront views, dense neighborhoods, and strong food-and-culture pull." },
  { id: "denver", name: "Denver", coordinates: [39.7392, -104.9903], stateId: "colorado", countrySubareaId: "southwest", image: cityImage("denver"), description: "A strong urban base for mountain access, neighborhood food scenes, and polished city weekends." },
  { id: "new-haven", name: "New Haven", coordinates: [41.3083, -72.9279], stateId: "connecticut", countrySubareaId: "northeast", image: cityImage("newhaven"), description: "Walkable and culture-rich, with a strong food scene and easy Northeast connectivity." },
  { id: "wilmington", name: "Wilmington", coordinates: [39.7447, -75.5484], stateId: "delaware", countrySubareaId: "southeast", image: cityImage("wilmington"), description: "A compact Mid-Atlantic city suited to short cultural and dining-focused guide routes." },
  { id: "miami", name: "Miami", coordinates: [25.7617, -80.1918], stateId: "florida", countrySubareaId: "southeast", image: cityImage("miami"), description: "A high-energy coastal city where nightlife, design, and beach culture define the trip." },
  { id: "orlando", name: "Orlando", coordinates: [28.5383, -81.3792], stateId: "florida", countrySubareaId: "southeast", image: cityImage("orlando"), description: "A major U.S. leisure destination with year-round tourism demand, convention traffic, and fast-growing local neighborhoods." },
  { id: "atlanta", name: "Atlanta", coordinates: [33.749, -84.388], stateId: "georgia", countrySubareaId: "southeast", image: cityImage("atlanta"), description: "A major Southeast hub with strong food, music, and neighborhood-driven local discovery." },
  { id: "honolulu", name: "Honolulu", coordinates: [21.3069, -157.8583], stateId: "hawaii", countrySubareaId: "pacific", image: cityImage("honolulu"), description: "Island-city energy with beaches, dining, and easy access to classic Hawaii itineraries." },
  { id: "boise", name: "Boise", coordinates: [43.615, -116.2023], stateId: "idaho", countrySubareaId: "west-coast", image: cityImage("boise"), description: "An increasingly polished small city with river access, breweries, and mountain-day-trip appeal." },
  { id: "chicago", name: "Chicago", coordinates: [41.8781, -87.6298], stateId: "illinois", countrySubareaId: "midwest", image: cityImage("chicago"), description: "Lakefront energy, strong neighborhood identities, and one of the best food-and-culture combinations in the country." },
  { id: "indianapolis", name: "Indianapolis", coordinates: [39.7684, -86.1581], stateId: "indiana", countrySubareaId: "midwest", image: cityImage("indianapolis"), description: "A steady, easy-to-navigate Midwest city with sports, dining districts, and weekend-trip usability." },
  { id: "des-moines", name: "Des Moines", coordinates: [41.5868, -93.625], stateId: "iowa", countrySubareaId: "midwest", image: cityImage("desmoines"), description: "A manageable city with growing food, brewery, and civic-cultural offerings." },
  { id: "wichita", name: "Wichita", coordinates: [37.6872, -97.3301], stateId: "kansas", countrySubareaId: "midwest", image: cityImage("wichita"), description: "Kansas' main urban stop, useful for regional dining, arts, and road-trip planning." },
  { id: "louisville", name: "Louisville", coordinates: [38.2527, -85.7585], stateId: "kentucky", countrySubareaId: "southeast", image: cityImage("louisville"), description: "Bourbon, food, and riverfront culture make Louisville a strong anchor city for Kentucky." },
  { id: "new-orleans", name: "New Orleans", coordinates: [29.9511, -90.0715], stateId: "louisiana", countrySubareaId: "southeast", image: cityImage("neworleans"), description: "One of the country's most distinctive food, music, and nightlife cities." },
  { id: "portland-me", name: "Portland", coordinates: [43.6591, -70.2568], stateId: "maine", countrySubareaId: "northeast", image: cityImage("portlandmaine"), description: "A coastal favorite with standout seafood, walkability, and a polished small-city feel." },
  { id: "baltimore", name: "Baltimore", coordinates: [39.2904, -76.6122], stateId: "maryland", countrySubareaId: "southeast", image: cityImage("baltimore"), description: "Harbor views, strong local character, and neighborhood-specific routes make Baltimore a useful guide city." },
  { id: "washington-dc", name: "Washington, DC", coordinates: [38.9072, -77.0369], stateId: "district-of-columbia", countrySubareaId: "northeast", image: cityImage("washingtondc"), description: "A monument-and-museum capital with highly visited neighborhoods, late-night corridors, and year-round travel demand." },
  { id: "boston", name: "Boston", coordinates: [42.3601, -71.0589], stateId: "massachusetts", countrySubareaId: "northeast", image: cityImage("boston"), description: "Historic, walkable, and dense with food, sports, and day-trip-friendly neighborhoods." },
  { id: "detroit", name: "Detroit", coordinates: [42.3314, -83.0458], stateId: "michigan", countrySubareaId: "midwest", image: cityImage("detroit"), description: "Design, music, and strong neighborhood reinvention make Detroit a compelling urban guide city." },
  { id: "minneapolis", name: "Minneapolis", coordinates: [44.9778, -93.265], stateId: "minnesota", countrySubareaId: "midwest", image: cityImage("minneapolis"), description: "A thoughtful, outdoor-friendly city with strong dining and cultural infrastructure." },
  { id: "jackson", name: "Jackson", coordinates: [32.2988, -90.1848], stateId: "mississippi", countrySubareaId: "southeast", image: cityImage("jacksonms"), description: "Mississippi's primary city base for music history, local food, and regional itineraries." },
  { id: "st-louis", name: "St. Louis", coordinates: [38.627, -90.1994], stateId: "missouri", countrySubareaId: "midwest", image: cityImage("stlouis"), description: "A big-river city with deep sports, food, and landmark-driven local routes." },
  { id: "billings", name: "Billings", coordinates: [45.7833, -108.5007], stateId: "montana", countrySubareaId: "midwest", image: cityImage("billings"), description: "A practical Montana hub for outdoor access and broader regional route-building." },
  { id: "omaha", name: "Omaha", coordinates: [41.2565, -95.9345], stateId: "nebraska", countrySubareaId: "midwest", image: cityImage("omaha"), description: "A reliable Midwest city for food, music, and easy district-based exploration." },
  { id: "las-vegas", name: "Las Vegas", coordinates: [36.1699, -115.1398], stateId: "nevada", countrySubareaId: "southwest", image: cityImage("lasvegas"), description: "A destination-scale city that mixes nightlife, resorts, and day-trip access into one dense guide market." },
  { id: "manchester", name: "Manchester", coordinates: [42.9956, -71.4548], stateId: "new-hampshire", countrySubareaId: "northeast", image: cityImage("manchesternh"), description: "A practical New Hampshire anchor for urban stops and nearby mountain itineraries." },
  { id: "newark", name: "Newark", coordinates: [40.7357, -74.1724], stateId: "new-jersey", countrySubareaId: "northeast", image: cityImage("newark"), description: "A transit-connected city that works well as a North Jersey and metro-area guide base." },
  { id: "albuquerque", name: "Albuquerque", coordinates: [35.0844, -106.6504], stateId: "new-mexico", countrySubareaId: "southwest", image: cityImage("albuquerque"), description: "A strong Southwest anchor with desert landscapes, culture, and road-trip potential." },
  { id: "new-york-city", name: "New York City", coordinates: [40.7128, -74.006], stateId: "new-york", countrySubareaId: "northeast", subareas: citySubareaSeeds.get("New York City|United States"), image: cityImage("nyc"), description: "A dense, always-on city with world-class food, nightlife, and neighborhood-level discovery." },
  { id: "charlotte", name: "Charlotte", coordinates: [35.2271, -80.8431], stateId: "north-carolina", countrySubareaId: "southeast", image: cityImage("charlotte"), description: "A growing Southeast city with a polished core, strong dining, and practical base-city appeal." },
  { id: "fargo", name: "Fargo", coordinates: [46.8772, -96.7898], stateId: "north-dakota", countrySubareaId: "midwest", image: cityImage("fargo"), description: "North Dakota's main urban stop for a more curated, local-feeling Midwest guide layer." },
  { id: "columbus", name: "Columbus", coordinates: [39.9612, -82.9988], stateId: "ohio", countrySubareaId: "midwest", image: cityImage("columbus"), description: "A youthful, fast-growing city with food, sports, and district-driven exploration." },
  { id: "oklahoma-city", name: "Oklahoma City", coordinates: [35.4676, -97.5164], stateId: "oklahoma", countrySubareaId: "southwest", image: cityImage("oklahomacity"), description: "A broad, accessible city with strong Western identity and an improving urban core." },
  { id: "portland-or", name: "Portland", coordinates: [45.5152, -122.6784], stateId: "oregon", countrySubareaId: "west-coast", image: cityImage("portlandoregon"), description: "A favorite for food, coffee, and neighborhood-led local curation." },
  { id: "philadelphia", name: "Philadelphia", coordinates: [39.9526, -75.1652], stateId: "pennsylvania", countrySubareaId: "northeast", image: cityImage("philadelphia"), description: "Compact, historic, and neighborhood-driven, with excellent dining, walkability, and a strong sense of local texture." },
  { id: "providence", name: "Providence", coordinates: [41.824, -71.4128], stateId: "rhode-island", countrySubareaId: "northeast", image: cityImage("providence"), description: "A creative, food-friendly small city with just enough density for tight local guides." },
  { id: "charleston-sc", name: "Charleston", coordinates: [32.7765, -79.9311], stateId: "south-carolina", countrySubareaId: "southeast", image: cityImage("charlestonsc"), description: "One of the Southeast's strongest hospitality, food, and historic-city destinations." },
  { id: "sioux-falls", name: "Sioux Falls", coordinates: [43.5446, -96.7311], stateId: "south-dakota", countrySubareaId: "midwest", image: cityImage("siouxfalls"), description: "South Dakota's clearest city base for practical regional guides and stopovers." },
  { id: "nashville", name: "Nashville", coordinates: [36.1627, -86.7816], stateId: "tennessee", countrySubareaId: "southeast", image: cityImage("nashville"), description: "A high-visibility city for music, nightlife, and fast-moving weekend itineraries." },
  { id: "dallas", name: "Dallas", coordinates: [32.7767, -96.797], stateId: "texas", countrySubareaId: "southwest", image: cityImage("dallas"), description: "Big-city scale with strong dining, retail, and district-based exploration that works well across different trip styles." },
  { id: "salt-lake-city", name: "Salt Lake City", coordinates: [40.7608, -111.891], stateId: "utah", countrySubareaId: "southwest", image: cityImage("saltlakecity"), description: "A clean, mountain-ringed city that works well as both an urban and outdoors-oriented hub." },
  { id: "burlington", name: "Burlington", coordinates: [44.4759, -73.2121], stateId: "vermont", countrySubareaId: "northeast", image: cityImage("burlington"), description: "A small but beloved New England city with lake views, food, and easy local texture." },
  { id: "richmond", name: "Richmond", coordinates: [37.5407, -77.436], stateId: "virginia", countrySubareaId: "southeast", image: cityImage("richmond"), description: "A strong Southeast city for food, design, and river-linked neighborhood exploration." },
  { id: "seattle", name: "Seattle", coordinates: [47.6062, -122.3321], stateId: "washington", countrySubareaId: "west-coast", image: cityImage("seattle"), description: "Coffee, water views, tech polish, and neighborhood micro-scenes make Seattle list-friendly." },
  { id: "charleston-wv", name: "Charleston", coordinates: [38.3498, -81.6326], stateId: "west-virginia", countrySubareaId: "southeast", image: cityImage("charlestonwv"), description: "West Virginia's core city base for state-level discovery and practical itineraries." },
  { id: "milwaukee", name: "Milwaukee", coordinates: [43.0389, -87.9065], stateId: "wisconsin", countrySubareaId: "midwest", image: cityImage("milwaukee"), description: "Lakefront character, beer culture, and neighborhood grit give Milwaukee strong guide potential." },
  { id: "cheyenne", name: "Cheyenne", coordinates: [41.14, -104.8202], stateId: "wyoming", countrySubareaId: "midwest", image: cityImage("cheyenne"), description: "A practical Wyoming anchor for statewide travel routes and wider high-plains planning." },
];

function withSeededSubareas(city: Omit<City, "listCount">): Omit<City, "listCount"> {
  const nycBoroughNames = new Set(["Manhattan", "Brooklyn", "Queens", "The Bronx", "Staten Island"]);

  const buildNeighborhoodDescription = (
    subareaName: string,
    cityName: string,
    parentSubareaName?: string,
  ) => {
    if (parentSubareaName) {
      const parentLabel = nycBoroughNames.has(parentSubareaName)
        ? `${parentSubareaName} borough`
        : parentSubareaName;
      return `${subareaName} is a neighborhood in ${parentLabel}, ${cityName}, with a strong mix of local food, culture, and walkable streets.`;
    }

    return `${subareaName} is a key neighborhood in ${cityName}, with local character, everyday favorites, and strong guide-building potential.`;
  };

  const withSubareaDescriptions = (subareas: SubArea[], parentSubareaName?: string): SubArea[] =>
    subareas.map((subarea) => ({
      ...subarea,
      description:
        subarea.description ??
        buildNeighborhoodDescription(subarea.name, city.name, parentSubareaName),
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
        "A dense, always-on city with world-class food, nightlife, and neighborhood-level discovery.",
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
        "Sunlit sprawl where beach culture, design spots, and destination dining all coexist.",
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
        "Lakefront energy, strong neighborhood identities, and one of the best food-and-culture combinations in the country.",
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
        "A huge, fast-growing city where global food scenes, arts institutions, and sprawling local favorites all mix together.",
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
        "Desert light, resort escapes, and a growing urban core make Phoenix a useful base for both city and nature routes.",
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
        "Compact, historic, and neighborhood-driven, with excellent dining, walkability, and a strong sense of local texture.",
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
        "A warm, fast-growing city where riverfront staples, cultural sites, and laid-back local picks fit together easily.",
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
        "Beach access, easy weather, and polished neighborhoods make San Diego ideal for slower, lifestyle-led curation.",
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
        "Big-city scale with strong dining, retail, and district-based exploration that works well across different trip styles.",
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
        "A broad, river-and-coast city with enough space to mix urban neighborhoods, beach time, and local favorites into one route.",
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
        "A high-energy coastal city where nightlife, design, and beach culture define the trip.",
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
        "A major U.S. leisure destination with year-round tourism demand, convention traffic, and fast-growing local neighborhoods.",
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
        "A destination-scale city that mixes nightlife, resorts, and day-trip access into one dense guide market.",
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
        "A compact, high-demand city with iconic waterfront views, dense neighborhoods, and strong food-and-culture pull.",
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
        "A monument-and-museum capital with highly visited neighborhoods, late-night corridors, and year-round travel demand.",
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
        "Island-city energy with beaches, dining, and easy access to classic Hawaii itineraries.",
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
        "Historic, walkable, and dense with food, sports, and day-trip-friendly neighborhoods.",
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
        "One of the country's most distinctive food, music, and nightlife cities.",
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
        "A high-visibility city for music, nightlife, and fast-moving weekend itineraries.",
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
        "Coffee, water views, tech polish, and neighborhood micro-scenes make Seattle list-friendly.",
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
      description:
        "A multicultural city packed with polished neighborhoods, indie coffee shops, and late-night eats.",
    },
    {
      id: "vancouver",
      name: "Vancouver",
      country: "Canada",
      continent: "North America",
      coordinates: [49.2827, -123.1207],
      image: cityImage("vancouver"),
      description:
        "A mountain-framed city known for waterfront views, easy day trips, and strong brunch culture.",
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
        "Layered, creative, and endlessly walkable, with standout markets and neighborhoods full of character.",
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
        "A vibrant western hub balancing tequila country day trips with modern dining and nightlife.",
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
        "Beach-driven energy, iconic views, and neighborhoods where music, food, and nightlife spill into the streets.",
    },
    {
      id: "sao-paulo",
      name: "Sao Paulo",
      country: "Brazil",
      continent: "South America",
      coordinates: [-23.5558, -46.6396],
      image: cityImage("saopaulo"),
      description:
        "A massive creative capital with serious restaurant density and deep local scenes.",
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
        "Elegant and late-night friendly, with leafy barrios, classic cafes, and a strong arts identity.",
    },
    {
      id: "mendoza",
      name: "Mendoza",
      country: "Argentina",
      continent: "South America",
      coordinates: [-32.8895, -68.8458],
      image: cityImage("mendoza"),
      description:
        "Wine country gateway with sunny plazas, mountain views, and easy outdoor escapes.",
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
        "High-altitude capital filled with coffee, contemporary dining, and culture-rich districts.",
    },
    {
      id: "medellin",
      name: "Medellin",
      country: "Colombia",
      continent: "South America",
      coordinates: [6.2442, -75.5812],
      image: cityImage("medellin"),
      description:
        "Spring-like weather, hillside viewpoints, and a thriving creative and nightlife scene.",
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
        "Grand boulevards, cafe culture, and a dense spread of museums, wine bars, and neighborhood favorites.",
    },
    {
      id: "lyon",
      name: "Lyon",
      country: "France",
      continent: "Europe",
      coordinates: [45.764, 4.8357],
      image: cityImage("lyon"),
      description:
        "One of Europe's best food cities, anchored by riverside promenades and historic quarters.",
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
        "Ancient sites, lively piazzas, and deep neighborhood dining make Rome a list-friendly city.",
    },
    {
      id: "milan",
      name: "Milan",
      country: "Italy",
      continent: "Europe",
      coordinates: [45.4642, 9.19],
      image: cityImage("milan"),
      description:
        "Fashion-forward and efficient, with standout aperitivo culture and contemporary design spots.",
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
      description:
        "An ancient-meets-modern capital where archaeological landmarks, dense neighborhood dining, and lively nightlife overlap in a compact urban core.",
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
        "Barcelona is a dense Mediterranean city where Gothic lanes, Eixample's Modernista landmarks, late tapas dinners, natural-wine bars, design hotels, social hostels, hilltop parks, and beachside days all sit within a few metro stops.",
    },
    {
      id: "madrid",
      name: "Madrid",
      country: "Spain",
      continent: "Europe",
      coordinates: [40.4168, -3.7038],
      image: cityImage("madrid"),
      description:
        "Big museums, energetic nightlife, and generous plazas define the capital's pace.",
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
        "A hillside capital of miradouros, tiled streets, historic trams, and neighborhood scenes spanning Alfama, Baixa, and Bairro Alto.",
    },
    {
      id: "porto",
      name: "Porto",
      country: "Portugal",
      continent: "Europe",
      coordinates: [41.1579, -8.6291],
      image: cityImage("porto"),
      description:
        "Compact, scenic, and easy to navigate, with riverside walks and strong local tavern culture.",
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
        "A global city with layered history, museum density, and neighborhood scenes that shift block by block.",
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
        "A compact capital of castle views, festival energy, and walkable old-and-new-town contrasts.",
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
        "A waterfront-friendly Welsh capital with stadium culture, easy rail links, and quick coast-and-valley access.",
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
        "Northern Ireland's main city for food, nightlife, and day routes to coast roads and Giant's Causeway country.",
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
        "Canals, cycling streets, and high-quality food and design scenes make Amsterdam one of Europe's most browsed city breaks.",
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
        "A large, creative city with distinct neighborhood identities, nightlife depth, and strong museum and gallery coverage.",
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
        "A high-demand European city break with compact historic districts, river views, and strong cafe and nightlife zones.",
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
      description:
        "A polished cultural capital known for grand architecture, coffeehouse tradition, and highly walkable central districts.",
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
        "Historic riads, medina lanes, rooftop dining, and market-rich sensory overload.",
    },
    {
      id: "casablanca",
      name: "Casablanca",
      country: "Morocco",
      continent: "Africa",
      coordinates: [33.5731, -7.5898],
      image: cityImage("casablanca"),
      description:
        "A coastal city mixing Art Deco architecture, modern cafes, and fast-moving local life.",
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
        "Mountain-and-ocean drama with strong food, wine, and outdoor day-trip options.",
    },
    {
      id: "johannesburg",
      name: "Johannesburg",
      country: "South Africa",
      continent: "Africa",
      coordinates: [-26.2041, 28.0473],
      image: cityImage("johannesburg"),
      description:
        "A creative city with neighborhood reinvention, standout galleries, and modern dining.",
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
        "A fast-growing urban hub where cafes, design spaces, and safari gateways meet.",
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
        "Dense, efficient, and endlessly rewarding for food, nightlife, shopping, and neighborhood wandering.",
    },
    {
      id: "kyoto",
      name: "Kyoto",
      country: "Japan",
      continent: "Asia",
      coordinates: [35.0116, 135.7681],
      image: cityImage("kyoto"),
      description:
        "Temple walks, tea houses, and thoughtful design details make Kyoto ideal for curation.",
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
      description:
        "A high-energy city of temples, rooftop bars, malls, and legendary street food density.",
    },
    {
      id: "chiang-mai",
      name: "Chiang Mai",
      country: "Thailand",
      continent: "Asia",
      coordinates: [18.7883, 98.9853],
      image: cityImage("chiangmai"),
      description:
        "Laid-back northern city with night markets, cafe culture, and nearby nature routes.",
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
        "Fast, stylish, and layered with shopping districts, palace grounds, and all-night food scenes.",
    },
    {
      id: "busan",
      name: "Busan",
      country: "South Korea",
      continent: "Asia",
      coordinates: [35.1796, 129.0756],
      image: cityImage("busan"),
      description:
        "Coastal energy with seafood markets, beaches, hillside neighborhoods, and great cafe views.",
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
        "High-gloss skyline, destination dining, big retail, and desert-edge experiences.",
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
        "Harbor views, coastal walks, and polished neighborhoods with strong cafe culture.",
    },
    {
      id: "melbourne",
      name: "Melbourne",
      country: "Australia",
      continent: "Oceania",
      coordinates: [-37.8136, 144.9631],
      image: cityImage("melbourne"),
      description:
        "Laneway bars, coffee, markets, and a creative identity that rewards local guides.",
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
        "Harbor city with island day trips, neighborhood dining, and easy outdoors access.",
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
        "Sunny gateway city for the top of the South Island, with nearby national parks, beaches, and a relaxed local pace.",
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
        "Adventure-focused alpine town with lake views and a steady stream of activities.",
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
        "Island hub with resort gateways, local markets, and easy ocean adventures.",
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
  const fallbackCityName = capitalFeature?.capital || countryData?.capital || `${country.name} City`;
  const fallbackCoordinates = capitalFeature?.coordinates
    ? ([capitalFeature.coordinates[1], capitalFeature.coordinates[0]] as [number, number])
    : country.coordinates;

  return {
    id: slugify(`${country.id}-${fallbackCityName}`),
    name: fallbackCityName,
    country: country.name,
    continent: country.continentName,
    coordinates: fallbackCoordinates,
    image: cityImage(slugify(fallbackCityName)),
    listCount: 0,
    description: `Primary city guide seed for ${country.name}, used while fuller city coverage is being added.`,
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
    "A compact Adriatic country with mountain roads, Ottoman-era towns, and increasingly popular Riviera coast routes.",
  austria:
    "Alpine scenery, imperial cities, and efficient rail links make Austria ideal for balanced city-and-nature itineraries.",
  belarus:
    "A broad Eastern European landscape of forested regions, Soviet-era urban cores, and slower-paced overland routes.",
  belgium:
    "A dense, rail-friendly country where medieval cores, design-forward cities, and food culture sit close together.",
  "bosnia-and-herzegovina":
    "A mountainous Balkan destination with Ottoman-Austro layers, river valleys, and resilient city culture.",
  bulgaria:
    "A Black Sea-to-mountain country with historic old towns, ski terrain, and strong value city breaks.",
  croatia:
    "Adriatic coastlines, island ferries, and Roman-to-medieval urban cores define Croatia's highest-demand routes.",
  cyprus:
    "A Mediterranean island destination blending beach routes, archaeological sites, and mountain village escapes.",
  "czech-republic":
    "A highly walkable Central European destination with Gothic-Baroque cityscapes, beer culture, and regional spa towns.",
  denmark:
    "Design-led cities, bike-first urbanism, and coastal micro-trips make Denmark easy to navigate and plan.",
  estonia:
    "A compact Baltic country pairing medieval old-town character with modern digital-city culture and forested coastlines.",
  finland:
    "Nordic city life, lake-country routes, and seasonal light cycles shape Finland's urban and nature itineraries.",
  france:
    "A destination-scale country where major cities, wine regions, mountain ranges, and Atlantic-Mediterranean coasts all coexist.",
  germany:
    "A regionally diverse country with transit-efficient cities, industrial heritage, and strong culture-and-nightlife corridors.",
  greece:
    "Island-hopping coastlines, ancient landmarks, and lively urban districts make Greece a multi-style trip destination.",
  hungary:
    "A Danube-centered country with thermal-bath culture, grand historic architecture, and growing regional city scenes.",
  iceland:
    "An outdoors-first island destination of volcanic landscapes, ring-road travel, and compact city stopovers.",
  ireland:
    "A coastal-green destination with pub-and-music city culture, dramatic Atlantic drives, and approachable small towns.",
  italy:
    "A high-density cultural destination spanning art cities, food regions, mountain routes, and Mediterranean coasts.",
  kosovo:
    "A young Balkan destination with energetic city centers, mountain access, and fast-changing local hospitality scenes.",
  latvia:
    "A Baltic country where Art Nouveau city streets, forested coastlines, and slower regional routes intersect.",
  lithuania:
    "A compact Baltic destination with historic cores, modern city culture, and lake-and-forest weekend routes.",
  luxembourg:
    "A small but well-connected country of fortified old towns, EU-capital infrastructure, and valley hiking routes.",
  macedonia:
    "A lake-and-mountain Balkan destination with Ottoman-era city texture and strong overland travel potential.",
  malta:
    "A compact island destination of fortified historic cities, clear-water coves, and year-round shoulder-season appeal.",
  moldova:
    "An emerging Eastern European destination with vineyard regions, Soviet-modern layers, and low-friction city breaks.",
  montenegro:
    "A small Adriatic-mountain destination where bay towns, rugged peaks, and scenic road loops are tightly connected.",
  netherlands:
    "A bike-and-rail-friendly country with canal cities, coastal dunes, and strong neighborhood-level urban culture.",
  "northern-cyprus":
    "A Mediterranean region with beach towns, mountain backdrops, and layered Turkish-Cypriot historic routes.",
  norway:
    "A fjord-and-mountain destination with efficient urban hubs, scenic rail lines, and high-contrast seasonal travel.",
  poland:
    "A large Central European destination with rebuilt historic cores, dynamic cities, and growing regional food scenes.",
  portugal:
    "A compact Atlantic destination of tiled cities, wine-country interiors, and coast-driven road-trip routes.",
  "republic-of-serbia":
    "A Balkan crossroads with high-energy nightlife cities, riverfront routes, and layered imperial histories.",
  romania:
    "A Carpathian-to-Black-Sea destination with medieval towns, dynamic capitals, and strong regional contrasts.",
  russia:
    "A transcontinental destination where major cultural capitals, vast overland distances, and deep regional variation define planning.",
  slovakia:
    "A compact Central European country with mountain access, castle towns, and easy cross-border itineraries.",
  slovenia:
    "A small Alpine-Adriatic destination combining lake routes, cave systems, and highly efficient city-to-nature trips.",
  spain:
    "A high-variety destination of late-night cities, island routes, mountain interiors, and Atlantic-Mediterranean coasts.",
  sweden:
    "A Nordic destination of archipelago cities, design-forward urban life, and easy rail-and-ferry regional travel.",
  switzerland:
    "An Alpine transit-perfect destination where lakeside cities, mountain villages, and scenic rail routes interlock.",
  ukraine:
    "A broad Eastern European destination with major river cities, Black Sea routes, and strong regional identity.",
  "united-kingdom":
    "A multi-nation destination with global cities, coastal rail routes, and deep regional contrast across England, Scotland, Wales, and Northern Ireland.",
};

const countryDescriptionLimit = 320;
const capitalNameOverrides: Record<string, string> = {
  "united-republic-of-tanzania": "Dodoma",
  ukraine: "Kyiv",
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
    return appendIfFits(
      `${europeBase} Use ${country.name} for ${context.route}, anchored by ${coverage}.`,
      "Regional routes keep browsing useful as fuller guides are added.",
    );
  }

  if (curatedCities.length) {
    return appendIfFits(
      `${country.name} is a destination in ${country.continentName} shaped by ${context.base}. Use it for ${context.route}, anchored by ${coverage}.`,
      "Regional routes extend the trip beyond the anchor city.",
    );
  }

  return appendIfFits(
    `${country.name} is a destination in ${country.continentName} shaped by ${context.base}. Guide coverage starts with ${coverage}, then expands into seed regions for food, culture, nature, stays, nightlife, and activities.`,
    "Those seeds keep browsing useful while fuller guides are added.",
  );
}

function createCountry(country: WorldCountrySeed): Country {
  if (country.id === "usa") {
    return {
      id: country.id,
      name: country.name,
      continent: country.continentName,
      description:
        "The United States is a continent-scale destination where states, regions, and cities feel distinct, from dense East Coast corridors and Great Lakes culture to Pacific, desert, mountain, Gulf, and island routes for food, nightlife, nature, stays, culture, and activities.",
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
          ...city,
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
        ...withSeededSubareas(assignCityToNearestSubarea(city, subareas)),
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
      ...withSeededSubareas(assignCityToNearestSubarea(city, subareas)),
      listCount: 0,
    })),
  };
}

export const continents: Continent[] = continentDefinitions.map((continent) => ({
  ...continent,
  subareas: buildContinentSubareas(continent),
  countries: worldCountrySeeds
    .filter((country) => country.continentId === continent.id)
    .sort((left, right) => left.name.localeCompare(right.name))
    .map(createCountry),
}));

export const cities: City[] = continents.flatMap((continent) =>
  continent.countries.flatMap((country) => country.cities),
);
