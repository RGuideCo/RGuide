import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import polygonClipping from "polygon-clipping";

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter",
  "https://z.overpass-api.de/api/interpreter",
];
const NOMINATIM_ENDPOINT = "https://nominatim.openstreetmap.org/search";

const ROOT = process.cwd();
const SOURCE_PATH = path.join(ROOT, "src/data/geography.ts");
const OUTPUT_PATH = path.join(ROOT, "src/data/city-neighborhoods.json");
const BOUNDARY_OUTPUT_PATH = path.join(ROOT, "src/data/neighborhood-boundaries.json");
const FETCH_STATE_PATH = path.join(ROOT, "src/data/neighborhood-fetch-state.json");
const BOUNDARY_SOURCE_CONFIG_PATH = path.join(ROOT, "src/data/boundary-sources.json");
const REQUEST_HEADERS = {
  "User-Agent": "rGuide neighborhood boundary importer",
  Accept: "application/json",
};
const REQUEST_TIMEOUT_MS = 30_000;
const CITY_DELAY_MS = 4_000;
const BOUNDARY_DELAY_MS = 3_500;
const FAILURE_COOLDOWN_MS = 6 * 60 * 60 * 1000;
const RATE_LIMIT_COOLDOWN_MS = 12 * 60 * 60 * 1000;
const MAX_REQUEST_ATTEMPTS = 6;
const boundaryQueryOverrides = {
  "washington-dc::georgetown": ["Georgetown, Washington, District of Columbia, USA"],
  "washington-dc::dupont-circle": ["Dupont Circle, Washington, District of Columbia, USA"],
  "washington-dc::shaw": ["Shaw, Washington, District of Columbia, USA"],
  "washington-dc::adams-morgan": ["Adams Morgan, Washington, District of Columbia, USA"],
  "washington-dc::capitol-hill": ["Capitol Hill, Washington, District of Columbia, USA"],
  "san-francisco::mission-district": ["Mission District, San Francisco, California, USA"],
  "san-francisco::north-beach": ["North Beach, San Francisco, California, USA"],
  "san-francisco::hayes-valley": ["Hayes Valley, San Francisco, California, USA"],
  "san-francisco::marina-district": ["Marina District, San Francisco, California, USA"],
  "san-francisco::sunset-district": ["Sunset District, San Francisco, California, USA"],
  "orlando::lake-eola-heights": ["Lake Eola Heights, Orlando, Florida, USA"],
  "orlando::mills-50": ["Mills 50, Orlando, Florida, USA"],
  "orlando::college-park": ["College Park, Orlando, Florida, USA"],
  "orlando::winter-park": ["Winter Park, Florida, USA"],
  "orlando::international-drive": ["International Drive, Orlando, Florida, USA"],
  "las-vegas::the-strip": ["The Strip, Las Vegas, Nevada, USA"],
  "las-vegas::arts-district": ["Arts District, Las Vegas, Nevada, USA"],
  "las-vegas::fremont-east": ["Fremont East, Las Vegas, Nevada, USA"],
  "las-vegas::summerlin": ["Summerlin, Las Vegas, Nevada, USA"],
  "las-vegas::chinatown": ["Chinatown, Las Vegas, Nevada, USA"],
  "honolulu::waikiki": ["Waikiki, Honolulu, Hawaii, USA"],
  "honolulu::kakaako": ["Kakaako, Honolulu, Hawaii, USA"],
  "honolulu::chinatown-honolulu": ["Chinatown, Honolulu, Hawaii, USA"],
  "honolulu::diamond-head": ["Diamond Head, Honolulu, Hawaii, USA"],
  "honolulu::manoa": ["Manoa, Honolulu, Hawaii, USA"],
  "nashville::the-gulch": ["The Gulch, Nashville, Tennessee, USA"],
  "nashville::east-nashville": ["East Nashville, Nashville, Tennessee, USA"],
  "nashville::12south": ["12South, Nashville, Tennessee, USA"],
  "nashville::germantown-nashville": ["Germantown, Nashville, Tennessee, USA"],
  "nashville::sobro": ["SoBro, Nashville, Tennessee, USA"],
  "seattle::capitol-hill-seattle": ["Capitol Hill, Seattle, Washington, USA"],
  "seattle::belltown": ["Belltown, Seattle, Washington, USA"],
  "seattle::ballard": ["Ballard, Seattle, Washington, USA"],
  "seattle::fremont-seattle": ["Fremont, Seattle, Washington, USA"],
  "seattle::pioneer-square-seattle": ["Pioneer Square, Seattle, Washington, USA"],
  "barcelona::gothic-quarter": ["el Gotic, Barcelona, Spain", "el Gòtic, Barcelona, Spain"],
  "barcelona::el-born": [
    "Sant Pere Santa Caterina i la Ribera, Barcelona, Spain",
    "el Born, Barcelona, Spain",
  ],
  "barcelona::eixample": ["l'Eixample, Barcelona, Spain", "la Dreta de l'Eixample, Barcelona, Spain"],
  "barcelona::gracia": ["Gracia, Barcelona, Spain", "Gràcia, Barcelona, Spain"],
  "barcelona::poble-sec": ["el Poble-sec, Barcelona, Spain"],
  "prague::stare-mesto": ["Staré Město, Praha, Czech Republic", "Stare Mesto, Prague, Czech Republic"],
  "prague::mala-strana": ["Malá Strana, Praha, Czech Republic", "Mala Strana, Prague, Czech Republic"],
  "prague::vinohrady": ["Vinohrady, Praha, Czech Republic"],
  "prague::karlin": ["Karlín, Praha, Czech Republic", "Karlin, Prague, Czech Republic"],
  "prague::holesovice": ["Holešovice, Praha, Czech Republic", "Holesovice, Prague, Czech Republic"],
  "vienna::innere-stadt": ["Innere Stadt, Wien, Austria", "Innere Stadt, Vienna, Austria"],
  "vienna::leopoldstadt": ["Leopoldstadt, Wien, Austria", "Leopoldstadt, Vienna, Austria"],
  "vienna::neubau": ["Neubau, Wien, Austria", "Neubau, Vienna, Austria"],
  "vienna::mariahilf": ["Mariahilf, Wien, Austria", "Mariahilf, Vienna, Austria"],
  "vienna::wieden": ["Wieden, Wien, Austria", "Wieden, Vienna, Austria"],
  "london::westminster": ["City of Westminster, London, United Kingdom", "Westminster, London, United Kingdom"],
  "mexico-city::centro-historico": [
    "Centro, Cuauhtemoc, Ciudad de Mexico, Mexico",
    "Centro Histórico, Ciudad de México, Cuauhtémoc, México",
    "Centro Histórico, Ciudad de México, México",
  ],
  "mexico-city::roma-norte": [
    "Roma Norte, Ciudad de Mexico, Mexico",
    "Roma Norte, Ciudad de México, México",
  ],
  "mexico-city::la-condesa": [
    "Condesa, Ciudad de Mexico, Mexico",
    "La Condesa, Ciudad de México, México",
  ],
  "mexico-city::polanco": [
    "Colonia Polanco, Miguel Hidalgo, Ciudad de México, México",
    "Polanco, Ciudad de Mexico, Mexico",
    "Polanco, Ciudad de México, México",
  ],
  "mexico-city::coyoacan": ["Coyoacan, Ciudad de Mexico, Mexico", "Coyoacán, Ciudad de México, México"],
  "mexico-city::juarez": [
    "Colonia Juarez, Cuauhtemoc, Ciudad de Mexico, Mexico",
    "Colonia Juárez, Ciudad de México, Cuauhtémoc, México",
    "Juarez, Ciudad de Mexico, Mexico",
  ],
  "medellin::el-poblado": ["El Poblado, Medellin, Antioquia, Colombia", "El Poblado, Medellín, Antioquia, Colombia"],
  "medellin::laureles-estadio": [
    "Laureles-Estadio, Medellin, Antioquia, Colombia",
    "Laureles Estadio, Medellín, Antioquia, Colombia",
  ],
  "medellin::la-candelaria": [
    "La Candelaria, Medellin, Antioquia, Colombia",
    "La Candelaria, Medellín, Antioquia, Colombia",
  ],
  "medellin::san-javier": ["San Javier, Medellin, Antioquia, Colombia", "San Javier, Medellín, Antioquia, Colombia"],
  "medellin::belen": ["Belen, Medellin, Antioquia, Colombia", "Belén, Medellín, Antioquia, Colombia"],
  "medellin::buenos-aires-medellin": [
    "Comuna 9 - Buenos Aires, Medellín, Antioquia, Colombia",
    "Buenos Aires, Medellín, Antioquia, Colombia",
  ],
  "london::soho": ["Soho, London, United Kingdom"],
  "london::covent-garden": ["Covent Garden, London, United Kingdom"],
  "london::shoreditch": ["Shoreditch, London, United Kingdom"],
  "london::notting-hill": ["Notting Hill, London, United Kingdom"],
  "london::camden": ["Camden, London, United Kingdom"],
  "london::south-bank": ["South Bank, London, United Kingdom"],
  "london::bloomsbury": ["Bloomsbury, London, United Kingdom"],
  "london::marylebone": ["Marylebone, London, United Kingdom"],
  "lisbon::alfama": [
    "Santo Estevao, Santa Maria Maior, Lisboa, Portugal",
    "Alfama, Lisboa, Portugal",
  ],
  "lisbon::chiado": [
    "Sacramento, Santa Maria Maior, Lisboa, Portugal",
    "Chiado, Lisboa, Portugal",
  ],
  "lisbon::baixa": ["Baixa, Lisboa, Portugal"],
  "lisbon::bairro-alto": ["Bairro Alto, Lisboa, Portugal"],
  "lisbon::principe-real": [
    "Mercês, Misericórdia, Lisboa, Portugal",
    "Principe Real, Lisboa, Portugal",
    "Príncipe Real, Lisboa, Portugal",
  ],
  "lisbon::belem": ["Belem, Lisboa, Portugal", "Belém, Lisboa, Portugal"],
  "porto::ribeira": ["Ribeira, Porto, Portugal"],
  "porto::cedofeita": ["Cedofeita, Porto, Portugal"],
  "porto::baixa": ["Vitória, Porto, Portugal", "Sé, Porto, Portugal"],
  "porto::bonfim": ["Bonfim, Porto, Portugal"],
  "porto::foz-do-douro": ["Foz do Douro, Porto, Portugal"],
  "sydney::sydney-cbd": ["Sydney CBD, New South Wales, Australia", "Sydney, New South Wales, Australia"],
  "sydney::the-rocks": ["The Rocks, Sydney, New South Wales, Australia"],
  "sydney::surry-hills": ["Surry Hills, New South Wales, Australia"],
  "sydney::newtown-sydney": ["Newtown, New South Wales, Australia"],
  "sydney::paddington-sydney": ["Paddington, New South Wales, Australia"],
  "sydney::bondi": ["Bondi, New South Wales, Australia"],
  "melbourne::melbourne-cbd": ["Melbourne CBD, Victoria, Australia", "Melbourne, Victoria, Australia"],
  "melbourne::fitzroy": ["Fitzroy, Victoria, Australia"],
  "melbourne::carlton": ["Carlton, Victoria, Australia"],
  "melbourne::richmond-melbourne": ["Richmond, Victoria, Australia"],
  "melbourne::south-yarra": ["South Yarra, Victoria, Australia"],
  "melbourne::st-kilda": ["St Kilda, Victoria, Australia"],
  "paris::first-arrondissement": [
    "Paris 1er Arrondissement, Paris, France",
    "Paris 1er Arrondissement, France",
    "1er arrondissement, Paris, France",
  ],
  "paris::seventh-arrondissement": [
    "Paris 7e Arrondissement, France",
    "Paris 7e Arrondissement, Paris, France",
    "7e arrondissement, Paris, France",
    "7th arrondissement of Paris, France",
  ],
  "amsterdam::jordaan": ["Jordaan, Amsterdam, Netherlands"],
  "amsterdam::de-pijp": ["De Pijp, Amsterdam, Netherlands"],
  "amsterdam::centrum": ["Centrum, Amsterdam, Netherlands"],
  "amsterdam::museum-quarter": ["Museumkwartier, Amsterdam, Netherlands", "Museum Quarter, Amsterdam, Netherlands"],
  "amsterdam::de-wallen": [
    "De Wallen, Amsterdam, Netherlands",
    "Burgwallen Oude Zijde, Amsterdam, Netherlands",
  ],
  "amsterdam::amsterdam-noord-ndsm": ["NDSM, Amsterdam, Netherlands", "Amsterdam-Noord, Amsterdam, Netherlands"],
  "amsterdam::oud-west": ["Oud-West, Amsterdam, Netherlands"],
  "amsterdam::oost": ["Oost, Amsterdam, Netherlands", "Amsterdam-Oost, Amsterdam, Netherlands"],
  "berlin::mitte": ["Mitte, Berlin, Germany"],
  "berlin::friedrichshain": ["Friedrichshain, Berlin, Germany"],
  "berlin::kreuzberg": ["Kreuzberg, Berlin, Germany"],
  "berlin::neukolln": ["Neukolln, Berlin, Germany", "Neukölln, Berlin, Germany"],
  "berlin::prenzlauer-berg": ["Prenzlauer Berg, Berlin, Germany"],
  "berlin::charlottenburg": ["Charlottenburg, Berlin, Germany"],
  "berlin::tiergarten": ["Tiergarten, Berlin, Germany"],
  "madrid::sol-centro": ["Sol, Madrid, Spain", "Centro, Madrid, Spain"],
  "madrid::barrio-de-las-letras": ["Cortes, Madrid, Spain", "Barrio de las Letras, Madrid, Spain"],
  "madrid::retiro": ["Retiro, Madrid, Spain"],
  "rome::centro-storico": [
    "Municipio Roma I, Roma Capitale, Lazio, Italia",
    "Centro Storico, Roma, Italia",
    "Centro Storico, Rome, Italy",
  ],
  "rome::celio": ["Celio, Roma, Italia", "Celio, Rome, Italy"],
  "athens::monastiraki": ["Monastiraki, Athens, Greece"],
  "athens::makrygianni": ["Makrygianni, Athens, Greece", "Μακρυγιάννη, Αθήνα, Ελλάδα"],
  "athens::kolonaki": ["Συνοικία Κολωνακίου, Αθήνα, Ελλάδα", "Kolonaki, Athens, Greece"],
  "athens::exarchia": ["Exarchia, Athens, Greece"],
  "athens::pangrati": ["Συνοικία Παγκρατίου, Αθήνα, Ελλάδα", "Pangrati, Athens, Greece"],
  "athens::mets": ["Mets, Athens, Greece", "Μετς, Αθήνα, Ελλάδα"],
};

function parseArgs(argv) {
  const args = {
    cityIds: new Set(),
    boundaryKeys: new Set(),
    boundariesOnly: false,
    neighborhoodsOnly: false,
    includeFailures: false,
    refreshExisting: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (value === "--city" && argv[index + 1]) {
      args.cityIds.add(argv[index + 1]);
      index += 1;
      continue;
    }

    if (value === "--boundary" && argv[index + 1]) {
      args.boundaryKeys.add(argv[index + 1]);
      index += 1;
      continue;
    }

    if (value === "--boundaries-only") {
      args.boundariesOnly = true;
      continue;
    }

    if (value === "--neighborhoods-only") {
      args.neighborhoodsOnly = true;
      continue;
    }

    if (value === "--include-failures") {
      args.includeFailures = true;
      continue;
    }

    if (value === "--refresh-existing") {
      args.refreshExisting = true;
    }
  }

  return args;
}

function jitter(baseMs, spread = 0.2) {
  const variance = baseMs * spread;
  return Math.round(baseMs + (Math.random() * variance * 2 - variance));
}

function isRateLimitStatus(status) {
  return status === 429 || status === 504;
}

function isRateLimitError(error) {
  return /429|504|rate limit/i.test(String(error?.message ?? ""));
}

function createTimeoutSignal(timeoutMs) {
  return AbortSignal.timeout(timeoutMs);
}

async function readJsonFile(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

async function writeJsonFile(filePath, value) {
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function shouldRetryFailure(failureState, includeFailures) {
  if (includeFailures || !failureState) {
    return true;
  }

  const now = Date.now();
  const cooldown = failureState.reason === "rate-limit" ? RATE_LIMIT_COOLDOWN_MS : FAILURE_COOLDOWN_MS;
  return now - failureState.at >= cooldown;
}

function normalizeFetchState(value) {
  return {
    cities: value?.cities && typeof value.cities === "object" ? value.cities : {},
    boundaries: value?.boundaries && typeof value.boundaries === "object" ? value.boundaries : {},
  };
}

function recordFailure(state, key, error) {
  const nextState = { ...state };
  const previous = nextState[key];
  nextState[key] = {
    at: Date.now(),
    attempts: (previous?.attempts ?? 0) + 1,
    message: String(error?.message ?? error),
    reason: isRateLimitError(error) ? "rate-limit" : "fetch-error",
  };
  return nextState;
}

function clearFailure(state, key) {
  if (!(key in state)) {
    return state;
  }

  const nextState = { ...state };
  delete nextState[key];
  return nextState;
}

function normalizeBoundarySources(value) {
  return value && typeof value === "object" ? value : {};
}

async function fetchJsonWithRetries(url, init, options = {}) {
  const {
    label = "request",
    attempts = MAX_REQUEST_ATTEMPTS,
    retryStatuses = [429, 504],
    baseDelayMs = 4_000,
    timeoutMs = REQUEST_TIMEOUT_MS,
    parseText = false,
  } = options;

  let lastError = null;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...init,
        signal: createTimeoutSignal(timeoutMs),
      });

      if (retryStatuses.includes(response.status)) {
        lastError = new Error(`${label} ${response.status}`);
      } else if (!response.ok) {
        throw new Error(`${label} ${response.status}`);
      } else if (parseText) {
        const text = await response.text();
        return text ? JSON.parse(text) : null;
      } else {
        return await response.json();
      }
    } catch (error) {
      lastError = error;
    }

    if (attempt < attempts - 1) {
      await sleep(jitter(baseDelayMs * (attempt + 1)));
    }
  }

  throw lastError ?? new Error(`${label} failed`);
}

function parseCoordinates(raw) {
  const [lat, lng] = raw.split(",").map((part) => Number(part.trim()));
  return { lat, lng };
}

function uniqueBy(items, getKey) {
  const seen = new Set();
  const result = [];

  for (const item of items) {
    const key = getKey(item);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(item);
  }

  return result;
}

async function loadMajorCities() {
  const source = await fs.readFile(SOURCE_PATH, "utf8");
  const cities = [];

  const curatedStart = source.indexOf("const curatedCitySeeds");
  const curatedEnd = source.indexOf("const continentDefinitions");
  const curatedBlock = source.slice(curatedStart, curatedEnd);

  const curatedRegex =
    /\{\s*id: "([^"]+)",\s*name: "([^"]+)",\s*country: "([^"]+)",[\s\S]*?coordinates: \[([^\]]+)\]/g;
  for (const match of curatedBlock.matchAll(curatedRegex)) {
    cities.push({
      id: match[1],
      name: match[2],
      country: match[3],
      ...parseCoordinates(match[4]),
    });
  }

  return uniqueBy(cities, (city) => `${city.name}|${city.country}`);
}

async function loadCuratedNeighborhoodTargets() {
  const source = await fs.readFile(SOURCE_PATH, "utf8");
  const cities = await loadMajorCities();
  const cityLookup = new Map(cities.map((city) => [`${city.name}|${city.country}`, city]));

  const marker = "const citySubareaSeeds = new Map<string, SubArea[]>([";
  const start = source.indexOf(marker);

  if (start === -1) {
    return [];
  }

  const end = source.indexOf("\n]);", start);
  if (end === -1) {
    return [];
  }

  const expression = source
    .slice(start, end + 3)
    .replace(/^const citySubareaSeeds = /, "")
    .replace("new Map<string, SubArea[]>(", "new Map(")
    .trim();

  const citySubareaSeeds = vm.runInNewContext(expression);
  const targets = [];

  function visitSubareas(city, subareas, parentSubarea = null) {
    for (const subarea of subareas ?? []) {
      targets.push({
        boundaryKey: parentSubarea
          ? `${city.id}::${parentSubarea.id}::${subarea.id}`
          : `${city.id}::${subarea.id}`,
        cityId: city.id,
        cityName: city.name,
        country: city.country,
        subareaId: subarea.id,
        subareaName: subarea.name,
        parentSubareaName: parentSubarea?.name ?? null,
      });

      if (Array.isArray(subarea.subareas) && subarea.subareas.length) {
        visitSubareas(city, subarea.subareas, subarea);
      }
    }
  }

  for (const [cityKey, subareas] of citySubareaSeeds.entries()) {
    const city = cityLookup.get(cityKey);

    if (!city || !Array.isArray(subareas)) {
      continue;
    }

    visitSubareas(city, subareas);
  }

  return targets;
}

function geometryToMultiPolygonCoordinates(geometry) {
  if (!geometry) {
    return [];
  }

  if (geometry.type === "Polygon") {
    return [geometry.coordinates];
  }

  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates;
  }

  return [];
}

function ringSignedArea(ring) {
  let total = 0;
  for (let i = 0; i < ring.length; i += 1) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    total += x1 * y2 - x2 * y1;
  }
  return total / 2;
}

function polygonArea(polygon) {
  if (!Array.isArray(polygon) || polygon.length === 0) {
    return 0;
  }

  const [outerRing, ...holes] = polygon;
  const outerArea = Math.abs(ringSignedArea(outerRing));
  const holesArea = holes.reduce((sum, hole) => sum + Math.abs(ringSignedArea(hole)), 0);
  return Math.max(0, outerArea - holesArea);
}

function mergedLargestPolygonFromMultiPolygon(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    return [];
  }

  const merged = polygonClipping.union(...coordinates);
  const polygons = Array.isArray(merged) ? merged : [];
  if (polygons.length === 0) {
    return coordinates[0];
  }

  const [largest] = polygons
    .slice()
    .sort((left, right) => polygonArea(right) - polygonArea(left));
  return largest;
}

function normalizeNeighborhoodGeometry(geometry) {
  if (!geometry || (geometry.type !== "Polygon" && geometry.type !== "MultiPolygon")) {
    return geometry;
  }

  if (geometry.type === "Polygon") {
    return geometry;
  }

  const mergedLargestPolygon = mergedLargestPolygonFromMultiPolygon(geometry.coordinates);
  return { type: "Polygon", coordinates: mergedLargestPolygon };
}

async function fetchConfiguredBoundary(target, boundarySources, datasetCache) {
  const [overrideSourceId, overrideConfig] =
    Object.entries(boundarySources).find(([, config]) => config?.geometryByBoundaryKey?.[target.boundaryKey]) ?? [];

  if (overrideSourceId && overrideConfig) {
    return {
      type: "Feature",
      properties: {
        id: target.boundaryKey,
        cityId: target.cityId,
        city: target.cityName,
        country: target.country,
        name: target.subareaName,
        parentName: target.parentSubareaName,
        displayName: target.subareaName,
        source: {
          sourceId: overrideSourceId,
          provider: overrideConfig.provider,
          datasetUrl: overrideConfig.datasetUrl,
          datasetId: overrideConfig.datasetId,
          format: overrideConfig.format,
          matchField: overrideConfig.matchField ?? "manual",
          labels: [target.subareaName],
          notes: "manual geometry override",
        },
      },
      geometry: normalizeNeighborhoodGeometry(overrideConfig.geometryByBoundaryKey[target.boundaryKey]),
    };
  }

  const [sourceId, sourceConfig] =
    Object.entries(boundarySources).find(
      ([, config]) =>
        Array.isArray(config?.mappings?.[target.boundaryKey]) && config.mappings[target.boundaryKey].length > 0,
    ) ?? [];

  if (!sourceId || !sourceConfig) {
    return null;
  }

  if (!datasetCache.has(sourceId)) {
    const dataset = await fetchJsonWithRetries(
      sourceConfig.datasetUrl,
      { headers: REQUEST_HEADERS },
      { label: "Boundary source", baseDelayMs: 8_000 },
    );
    datasetCache.set(sourceId, dataset);
  }

  const sourceDataset = datasetCache.get(sourceId);
  const features = Array.isArray(sourceDataset?.features) ? sourceDataset.features : [];
  const matchField = sourceConfig.matchField;
  const sourceLabels = sourceConfig.mappings[target.boundaryKey];
  const matchedFeatures = sourceLabels
    .map((label) => features.find((feature) => feature?.properties?.[matchField] === label))
    .filter(Boolean);

  if (!matchedFeatures.length) {
    throw new Error(`Configured source missing labels for ${target.boundaryKey}`);
  }

  const coordinates = matchedFeatures.flatMap((feature) => geometryToMultiPolygonCoordinates(feature.geometry));
  const geometry =
    coordinates.length === 1
      ? { type: "Polygon", coordinates: coordinates[0] }
      : { type: "MultiPolygon", coordinates };

  return {
    type: "Feature",
    properties: {
      id: target.boundaryKey,
      cityId: target.cityId,
      city: target.cityName,
      country: target.country,
      name: target.subareaName,
      parentName: target.parentSubareaName,
      displayName: sourceLabels.join(", "),
      source: {
        sourceId,
        provider: sourceConfig.provider,
        datasetUrl: sourceConfig.datasetUrl,
        datasetId: sourceConfig.datasetId,
        format: sourceConfig.format,
        matchField,
        labels: sourceLabels,
      },
    },
    geometry: normalizeNeighborhoodGeometry(geometry),
  };
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchNeighborhoodsForCity(city) {
  const radius = city.country === "United States" ? 25000 : 20000;
  const query = `[out:json][timeout:25];(node["place"~"neighbourhood|quarter|suburb"](around:${radius},${city.lat},${city.lng});way["place"~"neighbourhood|quarter|suburb"](around:${radius},${city.lat},${city.lng});relation["place"~"neighbourhood|quarter|suburb"](around:${radius},${city.lat},${city.lng}););out center;`;
  const placeRank = { neighbourhood: 0, quarter: 1, suburb: 2 };

  for (let endpointIndex = 0; endpointIndex < OVERPASS_ENDPOINTS.length; endpointIndex += 1) {
    const endpoint = OVERPASS_ENDPOINTS[endpointIndex];

    try {
      const data = await fetchJsonWithRetries(
        endpoint,
        {
          method: "POST",
          headers: { "content-type": "text/plain" },
          body: query,
        },
        {
          label: "Overpass",
          attempts: 3,
          baseDelayMs: 6_000,
        },
      );

      const normalizedCityName = city.name.toLowerCase();
      const elements = Array.isArray(data.elements) ? data.elements : [];

      return uniqueBy(
        elements
          .map((element) => {
            const tags = element.tags ?? {};
            const name = tags["name:en"] || tags.name;
            const lat = element.lat ?? element.center?.lat;
            const lon = element.lon ?? element.center?.lon;
            const place = tags.place || "";

            if (!name || typeof lat !== "number" || typeof lon !== "number") {
              return null;
            }

            if (String(name).toLowerCase() === normalizedCityName) {
              return null;
            }

            return {
              id: `${city.id}-${name}`
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, ""),
              name,
              coordinates: [lat, lon],
              place,
            };
          })
          .filter(Boolean),
        (item) => item.name.toLowerCase(),
      )
        .sort((left, right) => {
          const placeDelta = (placeRank[left.place] ?? 9) - (placeRank[right.place] ?? 9);
          if (placeDelta !== 0) {
            return placeDelta;
          }

          return left.name.localeCompare(right.name);
        })
        .slice(0, 6)
        .map(({ id, name, coordinates }) => ({ id, name, coordinates }));
    } catch (error) {
      if (endpointIndex === OVERPASS_ENDPOINTS.length - 1) {
        throw error;
      }

      await sleep(jitter(7_000));
    }
  }

  return [];
}

function isLikelyNeighborhoodResult(result, targetName) {
  const type = String(result.type ?? "").toLowerCase();
  const category = String(result.category ?? "").toLowerCase();
  const addresstype = String(result.addresstype ?? "").toLowerCase();
  const displayName = String(result.display_name ?? "").toLowerCase();
  const normalizedTarget = targetName.toLowerCase();

  const relevantType =
    ["suburb", "quarter", "neighbourhood", "neighborhood", "city_district", "administrative"].includes(type) ||
    ["boundary", "place"].includes(category) ||
    ["suburb", "quarter", "neighbourhood", "neighborhood", "city_district", "administrative"].includes(addresstype);

  return relevantType && displayName.includes(normalizedTarget);
}

function hasAreaGeometry(result) {
  const geometryType = String(result?.geojson?.type ?? "");
  return geometryType === "Polygon" || geometryType === "MultiPolygon";
}

async function fetchBoundaryForNeighborhood(target, boundarySources, datasetCache) {
  const configuredBoundary = await fetchConfiguredBoundary(target, boundarySources, datasetCache);
  if (configuredBoundary) {
    return configuredBoundary;
  }

  const queries = boundaryQueryOverrides[target.boundaryKey] ?? (
    target.parentSubareaName
      ? [
          `${target.subareaName}, ${target.parentSubareaName}, ${target.cityName}, ${target.country}`,
          `${target.subareaName}, ${target.cityName}, ${target.country}`,
        ]
      : [`${target.subareaName}, ${target.cityName}, ${target.country}`]
  );

  for (const query of queries) {
    const url = new URL(NOMINATIM_ENDPOINT);
    url.searchParams.set("q", query);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("limit", "6");
    url.searchParams.set("polygon_geojson", "1");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("namedetails", "1");

    const results = await fetchJsonWithRetries(
      url,
      { headers: REQUEST_HEADERS },
      {
        label: "Nominatim",
        baseDelayMs: 8_000,
      },
    );
    const matches = Array.isArray(results) ? results : [];

    const bestMatch =
      matches.find((result) => isLikelyNeighborhoodResult(result, target.subareaName) && hasAreaGeometry(result)) ??
      matches.find((result) => hasAreaGeometry(result)) ??
      matches.find((result) => isLikelyNeighborhoodResult(result, target.subareaName) && result.geojson) ??
      matches.find((result) => result.geojson);

    if (bestMatch?.geojson) {
      return {
        type: "Feature",
        properties: {
          id: target.boundaryKey,
          cityId: target.cityId,
          city: target.cityName,
          country: target.country,
          name: target.subareaName,
          parentName: target.parentSubareaName,
          displayName: bestMatch.display_name,
          source: {
            provider: "Nominatim / OpenStreetMap",
            datasetUrl: NOMINATIM_ENDPOINT,
            query,
          },
        },
        geometry: normalizeNeighborhoodGeometry(bestMatch.geojson),
      };
    }
  }

  return null;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cities = await loadMajorCities();
  const curatedNeighborhoodTargets = await loadCuratedNeighborhoodTargets();
  const boundarySources = normalizeBoundarySources(await readJsonFile(BOUNDARY_SOURCE_CONFIG_PATH, {}));
  const datasetCache = new Map();
  const cityFailures = normalizeFetchState(await readJsonFile(FETCH_STATE_PATH, { cities: {}, boundaries: {} }));
  const results = await readJsonFile(OUTPUT_PATH, {});
  const boundaryResults = await readJsonFile(BOUNDARY_OUTPUT_PATH, {});

  const filteredCities = cities.filter((city) => args.cityIds.size === 0 || args.cityIds.has(city.id));
  const filteredTargets = curatedNeighborhoodTargets.filter((target) => {
    if (args.boundaryKeys.size > 0) {
      return args.boundaryKeys.has(target.boundaryKey);
    }

    if (args.cityIds.size > 0) {
      return args.cityIds.has(target.cityId);
    }

    return true;
  });

  if (!args.boundariesOnly) {
    for (const city of filteredCities) {
      const key = city.id;
      const legacyKey = `${city.name}|${city.country}`;

      if (!results[key]?.length && results[legacyKey]?.length) {
        results[key] = results[legacyKey];
        delete results[legacyKey];
        await writeJsonFile(OUTPUT_PATH, results);
      }

      if (results[key]?.length && !args.refreshExisting) {
        console.error(`${key}: cached ${results[key].length}`);
        continue;
      }

      if (!shouldRetryFailure(cityFailures.cities[key], args.includeFailures)) {
        console.error(`${key}: skipped recent failure`);
        continue;
      }

      try {
        const neighborhoods = await fetchNeighborhoodsForCity(city);
        if (neighborhoods.length) {
          results[key] = neighborhoods;
          cityFailures.cities = clearFailure(cityFailures.cities, key);
        }
        await writeJsonFile(OUTPUT_PATH, results);
        await writeJsonFile(FETCH_STATE_PATH, cityFailures);
        console.error(`${key}: ${neighborhoods.length}`);
      } catch (error) {
        cityFailures.cities = recordFailure(cityFailures.cities, key, error);
        await writeJsonFile(FETCH_STATE_PATH, cityFailures);
        console.error(`${key}: failed ${error.message}`);
      }

      await sleep(jitter(CITY_DELAY_MS));
    }
  }

  if (!args.neighborhoodsOnly) {
    for (const target of filteredTargets) {
      if (boundaryResults[target.boundaryKey]?.geometry && !args.refreshExisting) {
        console.error(`${target.boundaryKey}: cached boundary`);
        continue;
      }

      if (!shouldRetryFailure(cityFailures.boundaries[target.boundaryKey], args.includeFailures)) {
        console.error(`${target.boundaryKey}: skipped recent failure`);
        continue;
      }

      try {
        const feature = await fetchBoundaryForNeighborhood(target, boundarySources, datasetCache);
        if (feature) {
          boundaryResults[target.boundaryKey] = feature;
          cityFailures.boundaries = clearFailure(cityFailures.boundaries, target.boundaryKey);
          await writeJsonFile(BOUNDARY_OUTPUT_PATH, boundaryResults);
          console.error(`${target.boundaryKey}: boundary`);
        } else {
          cityFailures.boundaries = recordFailure(
            cityFailures.boundaries,
            target.boundaryKey,
            new Error("no boundary"),
          );
          console.error(`${target.boundaryKey}: no boundary`);
        }
      } catch (error) {
        cityFailures.boundaries = recordFailure(cityFailures.boundaries, target.boundaryKey, error);
        console.error(`${target.boundaryKey}: boundary failed ${error.message}`);
      }

      await writeJsonFile(FETCH_STATE_PATH, cityFailures);
      await sleep(jitter(BOUNDARY_DELAY_MS));
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
