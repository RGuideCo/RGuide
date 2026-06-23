import type { ListCategory } from "@/types";

export const cityHighlightCategoryOrder: Array<{ label: string; category: ListCategory }> = [
  { label: "Food", category: "Food" },
  { label: "Nightlife", category: "Nightlife" },
  { label: "Culture", category: "Culture" },
  { label: "Stay", category: "Stay" },
  { label: "Routes", category: "Routes" },
  { label: "Essentials", category: "Essentials" },
  { label: "Vibe", category: "Activities" },
];

const cityHighlightThemes: Record<ListCategory, string[]> = {
  Food: ["Tapas", "Seafood", "Michelin"],
  Nightlife: ["Late", "Bars", "Cocktails"],
  Culture: ["Architecture", "Museums", "History"],
  Stay: ["Boutique", "Hostels", "Walkable"],
  Nature: ["Views", "Urban parks", "Waterfront"],
  Activities: ["Social", "Walkable", "Energy"],
  Routes: ["Walks", "Streets", "Loops"],
  Essentials: ["Transit", "Arrival", "Basics"],
};

export function getCityHighlightThemes(category: ListCategory, contextualFoodCuisineOptions: string[]) {
  if (category === "Food") {
    return contextualFoodCuisineOptions.slice(0, 3);
  }

  return cityHighlightThemes[category];
}

type CategoryDescriptionProfile = {
  city: string;
  food: string;
  foodDescription?: string;
  nightlife: string;
  culture: string;
  stay: string;
  nature: string;
  activities: string;
  routes?: string;
  essentials?: string;
};

function buildCategoryDescriptionOverride(profile: CategoryDescriptionProfile): Partial<Record<ListCategory, string>> {
  return {
    Food:
      profile.foodDescription ??
      `${profile.city} food works best when it is mapped by neighborhood and meal rhythm: ${profile.food}. Use it to choose a meal that fits the route instead of chasing a generic best-of list across town.`,
    Nightlife: `${profile.city} nightlife needs the right room for the night: ${profile.nightlife}. Use it to pick the energy level, crowd, and timing before the plan turns into a long transfer or queue.`,
    Culture: `${profile.city} culture is strongest when the route connects its layers: ${profile.culture}. Use it to build days around a few anchors, with streets, meals, and quieter stops carrying the gaps.`,
    Stay: `${profile.city} stays should match the trip shape: ${profile.stay}. Use it to choose a base by transit, sleep style, nightlife reach, and the neighborhoods you will actually revisit.`,
    Nature: `${profile.city} open-air time should give the trip room to breathe: ${profile.nature}. Use it for parks, waterfronts, viewpoints, beaches, gardens, or day edges that reset dense city routes.`,
    Activities: `${profile.city} activities work best as paced routes, not checklist piles: ${profile.activities}. Use it to connect food, culture, open-air breaks, stays, and nights without fighting the city geography.`,
    Routes: `${profile.city} routes should explain movement, not just dots on a map: ${profile.routes ?? profile.activities}. Use it for walking routes, major streets, transit hops, scenic loops, and route logic that makes the day feel coherent.`,
    Essentials: `${profile.city} essentials should make the trip easier before the day gets busy: ${profile.essentials ?? profile.routes ?? profile.stay}. Use it for arrival, transit, safety, money, connectivity, weather, and other practical decisions that shape the plan.`,
  };
}

export const categoryCityDescriptionProfiles: Record<string, CategoryDescriptionProfile> = {
  paris: {
    city: "Paris",
    food: "classic bistros, bakeries, wine-led rooms, market streets, modern reservations, and arrondissement-specific cafe routines",
    nightlife: "wine bars, hotel lounges, jazz rooms, cocktail bars, Pigalle nights, and late meals that depend heavily on the arrondissement",
    culture: "major museums, smaller house museums, literary streets, churches, fashion history, river walks, and neighborhood-scale galleries",
    stay: "Left Bank calm, Marais access, opera-and-shopping convenience, Pigalle edge, or quieter residential bases near useful Metro lines",
    nature: "the Seine, Luxembourg and Tuileries gardens, Buttes-Chaumont, cemeteries, canal walks, and easy day trips beyond the ring",
    activities: "museum mornings, bistro lunches, garden resets, river crossings, neighborhood shopping, wine bars, and slower evening walks",
  },
  london: {
    city: "London",
    food: "markets, pub dining, South Asian routes, modern British rooms, bakeries, Sunday roasts, and destination restaurants by transit line",
    nightlife: "pubs, cocktail rooms, clubs, live music, late Soho streets, theater-adjacent bars, and neighborhood nights south and east",
    culture: "national museums, royal sites, galleries, theaters, historic streets, music history, and village-like neighborhoods",
    stay: "West End access, museum-side calm, East London nightlife, South Bank views, or rail-friendly bases for a sprawling journey",
    nature: "royal parks, commons, canals, heaths, river walks, garden squares, and day trips that start from the right station",
    activities: "area-by-area days that combine museums, markets, pubs, theater, parks, and one realistic cross-town move at a time",
  },
  istanbul: {
    city: "Istanbul",
    food: "meyhanes, kebab rooms, bakeries, seafood, street food, breakfast spreads, and modern Turkish dining across both sides",
    nightlife: "Bosphorus rooftops, meyhane routes, Kadikoy bars, Beyoglu late rooms, hotel terraces, and music-led nights",
    culture: "Byzantine churches, Ottoman mosques and palaces, bazaars, ferries, contemporary galleries, and layered waterfront districts",
    stay: "Sultanahmet sightseeing, Beyoglu nightlife, Karakoy ferry access, Bosphorus calm, or Kadikoy food and bar routes",
    nature: "Bosphorus ferries, waterfront promenades, parks, islands, hill views, and breezy crossings between dense districts",
    activities: "ferry-linked days with markets, mosques, palace time, street food, old lanes, sunset views, and neighborhood dinners",
  },
  rome: {
    city: "Rome",
    food: "trattorias, pasta rooms, bakeries, market stops, aperitivo counters, wine bars, and reservation dinners by neighborhood",
    nightlife: "piazza drinks, enotecas, cocktail rooms, Trastevere crowds, Pigneto edge, and low-key late meals after long walks",
    culture: "ancient sites, churches, palazzi, fountains, museums, ruins, and street-level layers that make short walks feel dense",
    stay: "Centro convenience, Trastevere nights, Monti texture, Prati calm, or quieter bases that keep walking routes manageable",
    nature: "villa parks, river paths, hill views, the Appian Way, gardens, and open-air pauses between stone-heavy sightseeing",
    activities: "ancient anchors, church stops, piazza breaks, long lunches, gelato detours, wine bars, and evenings paced around walking",
  },
  barcelona: {
    city: "Barcelona",
    food: "Gothic taverns, Born seafood counters, Eixample tasting menus, Gracia market lunches, Poble-sec montaditos, and natural-wine rooms",
    nightlife: "cava counters, low-key bodegas, destination cocktail rooms, clubs, music venues, and Poble-sec pre-club stops",
    culture: "Roman fragments, medieval lanes, Born merchant history, Modernista houses, Gaudi landmarks, Montjuic museums, and design stops",
    stay: "old-city access, Eixample polish, Gracia calm, Poble-sec nights, beach edges, or hostels that trade quiet for social energy",
    nature: "Park Guell, Montjuic gardens, Ciutadella, hilltop viewpoints, waterfront walks, beaches, and neighborhood park breaks",
    activities: "Modernista mornings, counter meals, old-city history, beach or hill resets, neighborhood bars, and late-night finishes",
  },
  lisbon: {
    city: "Lisbon",
    food: "seafood rooms, tascas, bakeries, market halls, wine bars, modern Portuguese kitchens, and hillside neighborhood meals",
    nightlife: "fado rooms, Bairro Alto spillover, Cais do Sodre late bars, wine rooms, rooftops, and low-key plaza drinks",
    culture: "miradouros, tiled lanes, monasteries, museums, trams, old quarters, riverfront monuments, and fado context",
    stay: "Alfama atmosphere, Baixa convenience, Chiado polish, Bairro Alto nights, Principe Real calm, or flatter transit-friendly bases",
    nature: "viewpoints, riverfront paths, gardens, ferry rides, nearby beaches, and Sintra or Cascais routes that compete for time",
    activities: "hill climbs, tram rides, seafood lunches, tile-and-monastery stops, sunset viewpoints, fado nights, and river walks",
  },
  amsterdam: {
    city: "Amsterdam",
    food: "Indonesian meals, brown-cafe plates, bakeries, markets, natural-wine rooms, canal-side cafes, and reservation dinners",
    nightlife: "brown cafes, cocktail rooms, clubs, canal bars, Noord venues, music rooms, and relaxed late stops outside the busiest core",
    culture: "major museums, canal houses, design, maritime history, galleries, memorials, and neighborhood streets shaped by water",
    stay: "canal charm, museum access, tram convenience, Noord value, or quieter west and south bases away from peak old-center pressure",
    nature: "parks, canals, ferries, river edges, dunes, beaches, and day trips that make the city feel less compressed",
    activities: "museum anchors, canal walks, market meals, ferry hops, bikeable neighborhoods, park breaks, and brown-cafe evenings",
  },
  madrid: {
    city: "Madrid",
    food: "tapas streets, market halls, old taverns, modern Spanish rooms, vermouth stops, bakeries, and very late dinners",
    nightlife: "vermouth bars, cocktail rooms, Chueca nights, clubs, plaza drinks, flamenco rooms, and social streets that run late",
    culture: "Prado-triangle museums, royal sites, literary streets, galleries, plazas, markets, and neighborhood rituals",
    stay: "Gran Via access, Salamanca polish, Chueca nightlife, La Latina evenings, Chamberi calm, or Retiro-side breathing room",
    nature: "Retiro, Casa de Campo, Madrid Rio, garden walks, palace edges, and day trips that offset museum-heavy days",
    activities: "museum mornings, market lunches, plaza walks, Retiro resets, tapas crawls, vermouth pauses, and late dinners",
  },
  prague: {
    city: "Prague",
    food: "beer halls, Czech kitchens, cafes, bakeries, modern rooms, market stops, and meals that escape the old-town churn",
    nightlife: "pubs, beer gardens, cocktail rooms, clubs, jazz cellars, and Zizkov or Vinohrady nights beyond the busiest squares",
    culture: "castle routes, Jewish Quarter history, old-town lanes, museums, design stops, bridges, and Vltava viewpoints",
    stay: "Old Town access, Mala Strana charm, Vinohrady calm, Karlin practicality, or Letna views with better breathing room",
    nature: "Letna, Petrin, river islands, Vltava walks, hill views, beer gardens, and park routes between dense historic stops",
    activities: "castle mornings, bridge crossings, beer-hall meals, cafe pauses, gallery stops, river walks, and less crowded districts",
  },
  berlin: {
    city: "Berlin",
    food: "Turkish counters, modern German rooms, third-wave cafes, natural-wine bistros, market halls, bakeries, and currywurst stops",
    nightlife: "smoky kneipen, canal bars, queer dance floors, techno institutions, courtyard clubs, and low-key late rooms",
    culture: "Museum Island, Wall sites, memorials, Bauhaus traces, galleries, repurposed industrial spaces, and Cold War geography",
    stay: "Mitte museum access, Kreuzberg or Friedrichshain nightlife, Charlottenburg calm, Prenzlauer Berg apartments, or transit-first bases",
    nature: "Tiergarten, Tempelhofer Feld, canal paths, palace gardens, lakeside trips, Spree walks, and neighborhood park breaks",
    activities: "stitched districts with museums, Wall history, market halls, canal walks, park resets, galleries, dinner, and late bars",
  },
  "new-york-city": {
    city: "New York City",
    food: "borough-specific restaurants, bagel and slice stops, Chinatown counters, tasting menus, bakeries, diners, and late meals",
    nightlife: "cocktail rooms, dives, jazz clubs, dance floors, theater-adjacent bars, hotel lounges, and late food by subway line",
    culture: "major museums, theater, architecture, parks, galleries, street history, immigrant neighborhoods, and waterfront views",
    stay: "Manhattan convenience, Brooklyn nightlife, Queens food routes, downtown energy, uptown museum access, or transit-first value",
    nature: "Central Park, Prospect Park, waterfronts, islands, beaches, river paths, gardens, and skyline-facing promenades",
    activities: "landmark anchors, neighborhood walks, museum time, food detours, park resets, theater nights, and subway-linked plans",
  },
  miami: {
    city: "Miami",
    food: "Cuban counters, Caribbean rooms, seafood, hotel dining, chef-led restaurants, bakeries, late meals, and neighborhood cafes",
    nightlife: "clubs, rooftops, cocktail rooms, beach bars, hotel lounges, Wynwood nights, and Brickell rooms that run late",
    culture: "Art Deco streets, Little Havana, galleries, museums, design districts, street art, and waterfront city layers",
    stay: "South Beach access, Mid-Beach resort calm, Brickell towers, Wynwood energy, Coconut Grove quiet, or car-friendly bases",
    nature: "beaches, bayfront parks, islands, canals, Everglades edges, Keys routes, and outdoor resets between late nights",
    activities: "beach mornings, Cuban meals, gallery blocks, hotel pools, rooftop sunsets, late clubs, and day trips beyond the city",
  },
  "los-angeles": {
    city: "Los Angeles",
    food: "taco routes, Korean food, farmers market meals, sushi rooms, neighborhood cafes, tasting menus, and beachside stops",
    nightlife: "cocktail rooms, music venues, comedy clubs, hotel bars, dance floors, neighborhood dives, and late food corridors",
    culture: "film history, museums, architecture, galleries, music rooms, street scenes, studio context, and hillside landmarks",
    stay: "beach bases, Hollywood access, West Hollywood nights, Downtown arts, Beverly Hills polish, or traffic-aware neighborhood plans",
    nature: "beaches, canyon hikes, Griffith Park, coastal drives, gardens, hill views, and outdoor breaks between car-heavy routes",
    activities: "tight neighborhood clusters with beach time, tacos, museums, shopping streets, canyon resets, shows, and late bars",
  },
  orlando: {
    city: "Orlando",
    food: "park-adjacent meals, resort dining, Mills 50 rooms, Winter Park lunches, food halls, group-friendly stops, and late bites",
    nightlife: "resort bars, downtown rooms, breweries, cocktail spots, after-park lounges, and low-friction nights near the base",
    culture: "theme-park design, museums, gardens, performance venues, Winter Park context, and family-friendly indoor anchors",
    stay: "park access, resort style, convention convenience, rental-car time, pool days, or quieter neighborhoods for reset nights",
    nature: "lakes, springs, gardens, wetlands, shaded parks, and easy day trips that give park-heavy plans some air",
    activities: "ticketed days, resort breaks, local meals, outlet runs, lake time, cocktail stops, and plans before or after parks",
  },
  "san-francisco": {
    city: "San Francisco",
    food: "neighborhood restaurants, bakeries, seafood, Mission counters, dim sum, tasting menus, wine bars, and ferry-side meals",
    nightlife: "cocktail bars, dives, queer nightlife, music rooms, wine bars, hotel lounges, and neighborhood nights on steep streets",
    culture: "museums, architecture, waterfront history, Chinatown, Beat-era streets, murals, parks, and bay-facing landmarks",
    stay: "hill and transit tradeoffs, Union Square access, waterfront stays, neighborhood hotels, safety blocks, and Marin reach",
    nature: "Golden Gate Park, the Presidio, beaches, bay walks, hill viewpoints, ferry routes, and Marin day edges",
    activities: "compact walks with ferry views, park time, museums, neighborhood meals, cocktail rooms, and scenic climbs",
  },
  "las-vegas": {
    city: "Las Vegas",
    food: "casino dining, Chinatown rooms, buffets, celebrity restaurants, late meals, resort food halls, and off-Strip counters",
    nightlife: "clubs, lounges, cocktail bars, shows, downtown bars, pool parties, and reservation-heavy rooms with strict timing",
    culture: "shows, neon, museums, residencies, casino spectacle, downtown history, and desert-facing entertainment",
    stay: "Strip resort zones, downtown value, convention access, pool priorities, casino style, and budget or recovery needs",
    nature: "Red Rock, Valley of Fire, Hoover Dam, desert drives, canyon views, and early starts that beat heat and crowds",
    activities: "restaurant bookings, showtimes, pool blocks, casino walks, downtown nights, Chinatown meals, and desert resets",
  },
  "washington-dc": {
    city: "Washington, DC",
    food: "power dining, neighborhood restaurants, markets, Ethiopian and international corridors, bakeries, and museum-day meals",
    nightlife: "cocktail rooms, pubs, jazz, Adams Morgan and U Street energy, hotel bars, and post-museum social routes",
    culture: "Smithsonian museums, monuments, politics, Black history, galleries, memorials, embassies, and civic architecture",
    stay: "Metro access, museum reach, Georgetown charm, Dupont nightlife, Capitol Hill calm, or conference-friendly hotel zones",
    nature: "the National Mall, Rock Creek Park, waterfronts, gardens, river paths, and day trips that break up museum days",
    activities: "free museums, monument walks, neighborhood meals, market stops, jazz nights, waterfront breaks, and Metro-linked days",
  },
  chicago: {
    city: "Chicago",
    food: "neighborhood dining, taverns, tasting menus, Mexican food, bakeries, market halls, steakhouses, and deep-dish context",
    nightlife: "cocktail rooms, dives, blues and jazz clubs, breweries, rooftops, sports bars, and train-linked late neighborhoods",
    culture: "architecture, museums, public art, neighborhood history, theaters, music, riverfront landmarks, and lakefront identity",
    stay: "Loop convenience, River North nightlife, West Loop dining, lakefront access, neighborhood hotels, or train-first bases",
    nature: "the lakefront, beaches, parks, river walks, conservatories, skyline paths, and seasonal outdoor plans",
    activities: "architecture routes, museum blocks, lakefront time, neighborhood meals, sports nights, music rooms, and weather-aware days",
  },
  boston: {
    city: "Boston",
    food: "seafood, Italian rooms, bakeries, college-area meals, modern reservations, pubs, markets, and harbor-side stops",
    nightlife: "pubs, cocktail bars, sports nights, music rooms, Cambridge and Somerville bars, and compact after-dinner routes",
    culture: "Freedom Trail context, museums, universities, harbor history, literary sites, sports culture, and old neighborhood streets",
    stay: "Back Bay convenience, Beacon Hill charm, Seaport hotels, Cambridge access, North End evenings, or transit-first value",
    nature: "Boston Common, the Esplanade, harbor islands, river paths, gardens, coast trips, and campus green spaces",
    activities: "historic walks, seafood meals, museum time, campus detours, harbor views, pub nights, and compact transit-light days",
  },
  honolulu: {
    city: "Honolulu",
    food: "plate lunches, poke, Japanese and Hawaiian food, hotel dining, bakeries, Chinatown meals, and beach-day snacks",
    nightlife: "hotel bars, Chinatown rooms, beach drinks, live music, late food, resort lounges, and low-key island nights",
    culture: "Native Hawaiian history, palace sites, museums, surf culture, Chinatown, military context, and neighborhood markets",
    stay: "Waikiki convenience, quieter beach bases, Ala Moana access, Chinatown proximity, resort style, or car-friendly Oahu plans",
    nature: "beaches, hikes, lookouts, volcanic ridges, windward routes, North Shore drives, and oceanfront park breaks",
    activities: "surf time, plate lunches, hikes, palace context, beach resets, Chinatown nights, and weather-aware Oahu loops",
  },
  bangkok: {
    city: "Bangkok",
    food: "street food, noodles, markets, Thai fine dining, hotel rooms, mall food courts, river meals, and late-night bites",
    nightlife: "rooftops, cocktail bars, clubs, night markets, hotel lounges, Thonglor rooms, and Sukhumvit nights",
    culture: "temples, royal sites, canals, markets, shrines, contemporary art, river life, and old-city context",
    stay: "BTS/MRT access, riverside calm, Sukhumvit nightlife, Siam shopping, old-city sightseeing, or traffic-aware hotel bases",
    nature: "parks, river routes, canals, gardens, day trips, and shaded pauses that help with heat and traffic",
    activities: "temple mornings, market meals, mall breaks, river rides, rooftop sunsets, late food, and heat-aware pacing",
  },
  "hong-kong": {
    city: "Hong Kong",
    food: "dim sum, roast meats, dai pai dong, cha chaan teng, hotel dining, modern Cantonese rooms, and late Kowloon meals",
    nightlife: "cocktail bars, rooftops, live music, pub streets, hotel lounges, Central nights, and late Kowloon energy",
    culture: "temples, museums, markets, tram routes, ferries, colonial layers, Cantonese street life, and harbor history",
    stay: "Hong Kong Island access, Kowloon views, Central nightlife, Tsim Sha Tsui convenience, or MTR-first value",
    nature: "harborfronts, hikes, islands, beaches, peak views, country parks, and ferry-linked outdoor resets",
    activities: "ferry crossings, market walks, dim sum, tram rides, harbor views, hikes, cocktail rooms, and MTR-linked days",
  },
  macau: {
    city: "Macau",
    food: "Macanese kitchens, Portuguese rooms, bakeries, casino dining, street snacks, food streets, and old-town meals",
    nightlife: "casino lounges, shows, hotel bars, old-town drinks, Cotai spectacle, and low-friction late resort rooms",
    culture: "UNESCO streets, churches, temples, museums, Portuguese-Chinese layers, Senado Square, and compact old lanes",
    stay: "Cotai resorts, historic-core access, casino convenience, family suites, show logistics, or quieter Coloane edges",
    nature: "Coloane trails, beaches, hill walks, waterfronts, gardens, and open-air pauses beyond the casino floor",
    activities: "heritage walks, bakery stops, casino shows, Taipa meals, old-town wandering, and resort logistics",
  },
  dubai: {
    city: "Dubai",
    food: "hotel dining, global restaurants, Emirati context, mall meals, waterfront rooms, beach clubs, and late luxury tables",
    nightlife: "rooftops, beach clubs, lounges, hotel bars, booking-heavy clubs, marina rooms, and polished late nights",
    culture: "Al Fahidi, museums, mosques, galleries, souks, creek crossings, and old Dubai context beside the skyline",
    stay: "beach resorts, business towers, luxury malls, marina access, old Dubai texture, or drive-time-aware hotel bases",
    nature: "beaches, desert routes, creek rides, marinas, parks, mangroves, and heat-aware outdoor windows",
    activities: "mall breaks, beach time, desert evenings, heritage quarters, rooftop nights, marina walks, and booking-led days",
  },
  singapore: {
    city: "Singapore",
    food: "hawker centers, Peranakan rooms, modern dining, bakeries, hotel restaurants, neighborhood food streets, and late snacks",
    nightlife: "cocktail bars, rooftops, riverfront rooms, clubs, hotel lounges, speakeasy-style rooms, and compact late routes",
    culture: "heritage districts, museums, temples, mosques, civic architecture, shophouses, gardens, and waterfront spectacle",
    stay: "Marina Bay polish, Orchard shopping, Chinatown access, Kampong Glam texture, Sentosa resorts, or MRT-first convenience",
    nature: "Gardens by the Bay, Botanic Gardens, reservoirs, islands, waterfronts, park connectors, and humid-weather resets",
    activities: "hawker meals, heritage walks, garden time, museum stops, waterfront views, cocktail rooms, and climate-aware routing",
  },
  "kuala-lumpur": {
    city: "Kuala Lumpur",
    food: "nasi lemak, kopitiams, hawker streets, Malay, Chinese, and Indian routes, hotel dining, and modern rooms",
    nightlife: "rooftops, cocktail bars, clubs, hotel lounges, speakeasy-style rooms, and Bukit Bintang or Bangsar nights",
    culture: "mosques, temples, markets, museums, colonial streets, tower views, and layered Malay, Chinese, and Indian context",
    stay: "KLCC polish, Bukit Bintang shopping, Chinatown value, Bangsar evenings, transit access, or traffic-aware hotel bases",
    nature: "city parks, Batu Caves, gardens, hill views, day routes, and shaded breaks between malls and markets",
    activities: "tower views, hawker meals, market walks, cave trips, mall breaks, rooftop drinks, and heat-aware movement",
  },
  tokyo: {
    city: "Tokyo",
    food: "ramen counters, sushi rooms, izakaya, department-store food, neighborhood specialties, bakeries, and reservation meals",
    foodDescription:
      "Tokyo eating is station-by-station: ramen counters, sushi rooms, izakaya, depachika halls, bakeries, and reservation meals each fit a different moment. Pick the meal first, then the neighborhood.",
    nightlife: "cocktail bars, izakaya lanes, clubs, jazz rooms, karaoke, hotel bars, and late districts by train line",
    culture: "temples, museums, design, anime and game culture, gardens, craft streets, and traditional-modern contrasts",
    stay: "rail-line convenience, Shinjuku energy, Ginza polish, Asakusa texture, Shibuya shopping, or quieter neighborhood bases",
    nature: "gardens, rivers, parks, shrine groves, bayfronts, mountain day trips, and seasonal blossom or foliage routes",
    activities: "station-clustered days with counter meals, shopping streets, temples, museums, gardens, izakaya nights, and train logic",
  },
  seoul: {
    city: "Seoul",
    food: "barbecue, markets, bunsik, cafes, fine dining, late-night meals, bakeries, and neighborhood food alleys",
    nightlife: "Hongdae energy, Itaewon bars, Gangnam clubs, pocha streets, cocktail rooms, live music, and all-night food",
    culture: "palaces, hanok streets, museums, design districts, markets, pop-culture areas, and mountain-backed city views",
    stay: "subway access, Myeongdong shopping, Hongdae nights, Gangnam polish, palace-area calm, or food-led neighborhood bases",
    nature: "mountains, river parks, palace gardens, city walls, day hikes, streams, and outdoor resets between dense districts",
    activities: "subway-linked clusters with palace walks, cafes, markets, barbecue nights, shopping, river parks, and late food",
  },
  phuket: {
    city: "Phuket",
    food: "old-town Thai and Peranakan food, beach seafood, resort dining, markets, casual local rooms, and sunset meals",
    nightlife: "Patong intensity, beach bars, resort lounges, sunset rooms, old-town drinks, and quieter nights by beach base",
    culture: "old-town architecture, temples, markets, local festivals, shrines, and island history beyond the resort strip",
    stay: "Patong nightlife, Kata and Karon beach ease, Rawai food routes, Bang Tao resorts, or quieter transport-aware bases",
    nature: "beaches, islands, viewpoints, parks, boat days, snorkeling routes, and weather-season choices",
    activities: "beach time, old-town meals, boat trips, viewpoint stops, night markets, resort resets, and driving-aware plans",
  },
  mecca: {
    city: "Mecca",
    food: "practical group meals, hotel dining, food courts, regional Saudi options, late service, and routes near pilgrimage movement",
    nightlife: "evening tea, hotel lounges, family-friendly late meals, shopping corridors, and post-prayer logistics rather than bar culture",
    culture: "Islamic sites, mosque access, pilgrimage history, respectful religious context, museums, and crowd-aware movement",
    stay: "Al Haram proximity, mobility needs, group size, prayer access, crowd flow, hotel services, and quieter recovery time",
    nature: "mountain views, desert context, shaded routes, regional day edges, and open-air pauses that respect pilgrimage priorities",
    activities: "pilgrimage movement, rest windows, meals near the route, shopping corridors, hotel recovery, and respectful pacing",
  },
  cancun: {
    city: "Cancun",
    food: "resort dining, seafood, taco stops, downtown meals, group-friendly rooms, beach lunches, and hotel-zone convenience",
    nightlife: "clubs, beach bars, lounges, resort rooms, hotel-zone logistics, late shows, and group nights with clear transport",
    culture: "Maya museum context, markets, downtown streets, day-trip heritage sites, and resort-city layers beyond the beach",
    stay: "all-inclusive ease, downtown value, family resorts, nightlife access, beach quality, or ferry and day-trip logistics",
    nature: "beaches, cenotes, lagoon routes, islands, reefs, mangroves, and Riviera Maya day trips",
    activities: "resort days, seafood stops, club nights, cenote trips, island ferries, Maya sites, and beach recovery time",
  },
  cusco: {
    city: "Cusco",
    food: "Andean kitchens, markets, cafes, pisco rooms, tasting menus, bakeries, and trek-friendly meals at altitude",
    nightlife: "pisco bars, traveler rooms, live music, low-key late stops, and altitude-aware nights that do not overreach",
    culture: "Inca walls, colonial churches, museums, ruins, Indigenous craft context, plazas, and Sacred Valley gateways",
    stay: "altitude, stairs, train logistics, San Blas charm, historic-center access, and recovery time before bigger routes",
    nature: "ruins, viewpoints, valley routes, trekking, mountain passes, and acclimatization-friendly outdoor plans",
    activities: "slow first days, market meals, Inca sites, pisco stops, Sacred Valley links, and Machu Picchu logistics",
  },
  "mexico-city": {
    city: "Mexico City",
    food: "tacos, markets, bakeries, contemporary Mexican rooms, seafood, fine dining, cantinas, and neighborhood cafes",
    nightlife: "mezcal bars, cocktail rooms, cantinas, clubs, Roma and Juarez energy, hotel bars, and late street food",
    culture: "museums, murals, pre-Hispanic sites, architecture, plazas, markets, canals, and layered political history",
    stay: "Roma and Condesa ease, Centro history, Polanco polish, Juarez nightlife, Coyoacan charm, or transit-aware bases",
    nature: "Chapultepec, canals, parks, volcanic edges, plazas, gardens, and day trips that balance dense neighborhoods",
    activities: "museum blocks, taco routes, market mornings, park resets, mezcal nights, canal trips, and altitude-aware pacing",
  },
  "buenos-aires": {
    city: "Buenos Aires",
    food: "parrillas, bodegones, cafes, bakeries, wine rooms, modern Argentine dining, markets, and long late dinners",
    nightlife: "tango rooms, cocktail bars, wine bars, clubs, Palermo nights, San Telmo energy, and post-dinner social routes",
    culture: "cemeteries, theaters, bookstores, museums, street art, football context, plazas, and literary cafe culture",
    stay: "Palermo nightlife, Recoleta elegance, San Telmo texture, Microcentro access, or quieter leafy residential bases",
    nature: "parks, waterfronts, gardens, plazas, the ecological reserve, and delta day trips that loosen city days",
    activities: "slow mornings, cafe time, market walks, parrilla dinners, tango nights, bookstore stops, and barrio-by-barrio routes",
  },
  "rio-de-janeiro": {
    city: "Rio de Janeiro",
    food: "botecos, seafood, churrasco, bakeries, modern Brazilian rooms, beach meals, juice bars, and neighborhood lunches",
    nightlife: "samba, Lapa bars, beach kiosks, cocktail rooms, late clubs, live music, and nights shaped by safety and transport",
    culture: "music, museums, colonial streets, architecture, football, carnival context, and neighborhood history",
    stay: "Ipanema or Copacabana beach access, Leblon polish, Santa Teresa charm, Botafogo practicality, or safety-led bases",
    nature: "beaches, mountains, gardens, lagoons, viewpoints, forest routes, and weather-dependent outdoor windows",
    activities: "viewpoint mornings, beach time, boteco meals, samba nights, garden walks, museum stops, and safety-aware routing",
  },
  lima: {
    city: "Lima",
    food: "ceviche, Nikkei, criollo rooms, markets, tasting menus, bakeries, neighborhood seafood, and lunch-led planning",
    nightlife: "Barranco bars, cocktail rooms, live music, hotel lounges, late restaurants, and coastal neighborhood nights",
    culture: "pre-Columbian museums, colonial streets, galleries, coastal history, plazas, churches, and creative Barranco routes",
    stay: "Miraflores cliff access, Barranco nights, San Isidro business calm, historic-center reach, or dining-led hotel bases",
    nature: "malecon parks, beaches, wetlands, cliffs, surf edges, and desert or coast day trips",
    activities: "ceviche lunches, museum time, cliff walks, Barranco evenings, market stops, colonial routes, and coastal pacing",
  },
  medellin: {
    city: "Medellin",
    food: "Colombian kitchens, cafes, tasting menus, arepa and bakery stops, market meals, and El Poblado or Laureles rooms",
    nightlife: "Provenza bars, rooftops, salsa rooms, clubs, low-key local bars, and late plans shaped by safe transport",
    culture: "transformation stories, museums, public transport, street art, plazas, Comuna 13 context, and valley geography",
    stay: "El Poblado nightlife, Laureles calm, Envigado local rhythm, Provenza access, or mobility and safety-led bases",
    nature: "hill views, parks, cable cars, botanical gardens, mountain day trips, and open-air routes in spring weather",
    activities: "metro rides, cafe mornings, Comuna 13 context, park resets, Colombian meals, rooftop nights, and valley views",
  },
  quito: {
    city: "Quito",
    food: "Ecuadorian kitchens, markets, cafes, chocolate, modern rooms, view-led meals, and high-altitude comfort stops",
    nightlife: "La Mariscal bars, craft beer, cocktail rooms, cultural nights, hotel lounges, and quieter altitude-aware evenings",
    culture: "churches, plazas, museums, Indigenous context, colonial streets, equator routes, and volcano-backed history",
    stay: "Centro Historico texture, La Floresta food, Mariscal nightlife, La Carolina convenience, or altitude and safety-led bases",
    nature: "volcano views, parks, Teleferico, cloud forest edges, equator trips, and weather-aware mountain routes",
    activities: "historic walks, market meals, church interiors, viewpoint rides, chocolate stops, equator context, and altitude pacing",
  },
  "antigua-guatemala": {
    city: "Antigua Guatemala",
    food: "courtyard restaurants, Guatemalan kitchens, coffee, bakeries, rooftop meals, markets, and relaxed traveler-friendly rooms",
    nightlife: "rooftop bars, mezcal and cocktail rooms, traveler pubs, live music, quiet courtyards, and early starts for hikes",
    culture: "church ruins, textiles, markets, colonial streets, Spanish-school rhythm, coffee context, and volcano-framed plazas",
    stay: "walkable historic bases, courtyard hotels, volcano views, quiet streets, hostel social energy, or day-trip logistics",
    nature: "volcano hikes, viewpoints, coffee farms, Lake Atitlan routes, gardens, and weather-aware outdoor windows",
    activities: "cobblestone walks, coffee stops, ruin visits, market browsing, rooftop sunsets, volcano plans, and slow courtyard time",
  },
  bogota: {
    city: "Bogota",
    food: "Colombian regional rooms, markets, cafes, tasting menus, bakeries, coffee stops, and neighborhood restaurants",
    nightlife: "Chapinero bars, clubs, cocktail rooms, live music, Zona T social energy, and late plans shaped by traffic and safety",
    culture: "museums, colonial streets, street art, politics, mountain context, plazas, and La Candelaria history",
    stay: "La Candelaria culture, Chapinero bars, Zona G dining, Usaquen calm, Parque 93 polish, or commute-aware bases",
    nature: "Monserrate, parks, bike routes, mountain views, wetlands, and day trips that break up the high-altitude city",
    activities: "museum mornings, coffee stops, market meals, street-art walks, Monserrate views, Chapinero nights, and traffic-aware days",
  },
};

export const categoryCityDescriptionOverrides: Record<string, Partial<Record<ListCategory, string>>> = Object.fromEntries(
  Object.entries(categoryCityDescriptionProfiles).map(([cityId, profile]) => [
    cityId,
    buildCategoryDescriptionOverride(profile),
  ]),
);

export function buildScopedCategoryDescription(
  profile: CategoryDescriptionProfile | undefined,
  category: ListCategory | undefined,
  placeLabel: string,
  cityName: string,
) {
  if (!profile || !category) {
    return null;
  }

  const categoryAngles: Record<ListCategory, string> = {
    Food: profile.food,
    Nightlife: profile.nightlife,
    Culture: profile.culture,
    Stay: profile.stay,
    Nature: profile.nature,
    Activities: profile.activities,
    Routes: profile.routes ?? profile.activities,
    Essentials: profile.essentials ?? profile.routes ?? profile.stay,
  };

  return `${category} in ${placeLabel} should still feel specific to ${cityName}, not like a generic category filter. Use this view for ${categoryAngles[category]}, with stops close enough to work as a real neighborhood route.`;
}
