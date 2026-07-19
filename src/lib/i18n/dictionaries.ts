import type { AppLocale } from "@/lib/i18n/config";
import type { ListCategory } from "@/types";

interface SiteDictionary {
  siteDescription: string;
  curatedTravelGuides: string;
  continentEyebrow: string;
  countriesLabel: (continent: string) => string;
  citiesLabel: (country: string) => string;
  cityGuidesTitle: (city: string) => string;
  neighborhoodGuidesTitle: (neighborhood: string, city: string) => string;
  categoryGuidesTitle: (category: ListCategory, place: string) => string;
  guideHubSummary: (guideCount: number, stopCount: number, place: string) => string;
  language: string;
  viewInLanguage: (language: string) => string;
  notFound: {
    city: string;
    country: string;
    continent: string;
  };
  categories: Record<ListCategory, string>;
  browse: {
    categories: string;
    allGuides: string;
    all: string;
    rGuides: string;
    userGuides: string;
    user: string;
    favorites: string;
    favorite: string;
    guides: string;
    guide: string;
    events: string;
    journeys: string;
    journey: string;
    entries: string;
    world: string;
    selectContinent: string;
    browseDestinations: string;
    selectCountry: string;
    allCountries: string;
    selectRegion: string;
    allRegions: string;
    selectState: string;
    allStates: string;
    selectCity: string;
    allCities: string;
    selectNeighborhood: string;
    allNeighborhoods: string;
    returnToGlobalView: string;
    globalView: string;
    menuBar: string;
    guideSource: string;
    entryType: string;
    search: string;
    openSearch: string;
    closeSearch: string;
    createGuide: string;
    createGuideUnavailable: string;
  };
}

const CATEGORY_LABELS: Record<AppLocale, Record<ListCategory, string>> = {
  en: {
    Food: "Food",
    Nightlife: "Nightlife",
    Nature: "Nature",
    Culture: "Culture",
    Stay: "Stay",
    Activities: "Activities",
    Routes: "Routes",
    Essentials: "Essentials",
  },
  es: {
    Food: "Comida",
    Nightlife: "Vida nocturna",
    Nature: "Naturaleza",
    Culture: "Cultura",
    Stay: "Alojamiento",
    Activities: "Actividades",
    Routes: "Rutas",
    Essentials: "Información esencial",
  },
};

export const DICTIONARIES: Record<AppLocale, SiteDictionary> = {
  en: {
    siteDescription: "Curated city travel guides with mapped local recommendations, practical details, and source-backed editorial picks.",
    curatedTravelGuides: "Curated city travel guides",
    continentEyebrow: "RGuide continent",
    countriesLabel: (continent) => `${continent} countries`,
    citiesLabel: (country) => `${country} cities`,
    cityGuidesTitle: (city) => `${city} Travel Guides`,
    neighborhoodGuidesTitle: (neighborhood, city) => `${neighborhood}, ${city} Travel Guides`,
    categoryGuidesTitle: (category, place) => `${CATEGORY_LABELS.en[category]} guides in ${place}`,
    guideHubSummary: (guideCount, stopCount, place) =>
      `Explore ${guideCount} curated travel guides for ${place}, with ${stopCount} mapped stops, neighborhood context, practical details, and source-backed recommendations.`,
    language: "Language",
    viewInLanguage: (language) => `View in ${language}`,
    notFound: { city: "City not found", country: "Country not found", continent: "Continent not found" },
    categories: CATEGORY_LABELS.en,
    browse: {
      categories: "Categories",
      allGuides: "All guides",
      all: "All",
      rGuides: "R guides",
      userGuides: "User guides",
      user: "User",
      favorites: "Favorites",
      favorite: "Favorite",
      guides: "Guides",
      guide: "Guide",
      events: "Events",
      journeys: "Journeys",
      journey: "Journey",
      entries: "Entries",
      world: "World",
      selectContinent: "Select continent",
      browseDestinations: "Browse destinations",
      selectCountry: "Select country",
      allCountries: "All countries",
      selectRegion: "Select region",
      allRegions: "All regions",
      selectState: "Select state",
      allStates: "All states",
      selectCity: "Select city",
      allCities: "All cities",
      selectNeighborhood: "Select neighborhood",
      allNeighborhoods: "All neighborhoods",
      returnToGlobalView: "Return to global view",
      globalView: "Global view",
      menuBar: "Menu bar",
      guideSource: "Guide source",
      entryType: "Entry type",
      search: "Search",
      openSearch: "Open search",
      closeSearch: "Close search",
      createGuide: "Create guide",
      createGuideUnavailable: "Create guide unavailable",
    },
  },
  es: {
    siteDescription: "Guías de viaje urbanas seleccionadas con recomendaciones locales en el mapa, detalles prácticos y criterios editoriales respaldados por fuentes.",
    curatedTravelGuides: "Guías de viaje urbanas seleccionadas",
    continentEyebrow: "Continente en RGuide",
    countriesLabel: (continent) => `Países de ${continent}`,
    citiesLabel: (country) => `Ciudades de ${country}`,
    cityGuidesTitle: (city) => `Guías de viaje de ${city}`,
    neighborhoodGuidesTitle: (neighborhood, city) => `Guías de ${neighborhood}, ${city}`,
    categoryGuidesTitle: (category, place) => `Guías de ${CATEGORY_LABELS.es[category].toLowerCase()} en ${place}`,
    guideHubSummary: (guideCount, stopCount, place) =>
      `Explora ${guideCount} guías de viaje seleccionadas de ${place}, con ${stopCount} lugares en el mapa, contexto de barrios, detalles prácticos y recomendaciones respaldadas por fuentes.`,
    language: "Idioma",
    viewInLanguage: (language) => `Ver en ${language}`,
    notFound: { city: "Ciudad no encontrada", country: "País no encontrado", continent: "Continente no encontrado" },
    categories: CATEGORY_LABELS.es,
    browse: {
      categories: "Categorías",
      allGuides: "Todas las guías",
      all: "Todas",
      rGuides: "Guías de RGuide",
      userGuides: "Guías de usuarios",
      user: "Usuario",
      favorites: "Favoritos",
      favorite: "Favorito",
      guides: "Guías",
      guide: "Guía",
      events: "Eventos",
      journeys: "Viajes",
      journey: "Viaje",
      entries: "Entradas",
      world: "Mundo",
      selectContinent: "Seleccionar continente",
      browseDestinations: "Explorar destinos",
      selectCountry: "Seleccionar país",
      allCountries: "Todos los países",
      selectRegion: "Seleccionar región",
      allRegions: "Todas las regiones",
      selectState: "Seleccionar estado",
      allStates: "Todos los estados",
      selectCity: "Seleccionar ciudad",
      allCities: "Todas las ciudades",
      selectNeighborhood: "Seleccionar barrio",
      allNeighborhoods: "Todos los barrios",
      returnToGlobalView: "Volver a la vista mundial",
      globalView: "Vista mundial",
      menuBar: "Barra de menú",
      guideSource: "Fuente de la guía",
      entryType: "Tipo de entrada",
      search: "Buscar",
      openSearch: "Abrir búsqueda",
      closeSearch: "Cerrar búsqueda",
      createGuide: "Crear guía",
      createGuideUnavailable: "No se puede crear una guía",
    },
  },
};

export function getDictionary(locale: AppLocale) {
  return DICTIONARIES[locale];
}
