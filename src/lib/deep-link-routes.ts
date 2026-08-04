import { cities, continents, mapLists } from "@/data";
import { CATEGORIES, SITE_DESCRIPTION, SITE_SEARCH_NAME } from "@/lib/constants";
import { getCitiesFromContinents } from "@/lib/geography-tree";
import { getAbsoluteHref } from "@/lib/routes";
import { slugify } from "@/lib/utils";
import { City, Continent, Country, ListCategory, MapList, SelectionState, SubArea } from "@/types";

export type CityDeepLinkState = {
  selection: SelectionState;
  activeCategory?: ListCategory;
  expandedGuideId?: string;
};

export type CityDeepLinkResolution = CityDeepLinkState & {
  city: City;
  neighborhood?: SubArea;
  parentNeighborhood?: SubArea;
  category?: ListCategory;
  guide?: MapList;
  canonicalPath: string;
  indexable: boolean;
  lastModified?: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  structuredData: object[];
};

export type CountryDeepLinkResolution = CityDeepLinkState & {
  continent: Continent;
  country: Country;
  canonicalPath: string;
  indexable: boolean;
  lastModified?: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  structuredData: object[];
};

export type ContinentDeepLinkResolution = CityDeepLinkState & {
  continent: Continent;
  canonicalPath: string;
  indexable: boolean;
  lastModified?: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  structuredData: object[];
};

type NeighborhoodMatch = {
  subarea: SubArea;
  parent?: SubArea;
};

const categoryBySlug = new Map(CATEGORIES.map((category) => [slugify(category), category] as const));
const PARIS_ARRONDISSEMENT_RE = /^(\d+)(?:st|nd|rd|th) Arrondissement$/i;
const websiteReference = {
  "@type": "WebSite",
  "@id": getAbsoluteHref("/#website"),
  name: SITE_SEARCH_NAME,
  url: getAbsoluteHref("/"),
  description: SITE_DESCRIPTION,
};
const organizationReference = {
  "@type": "Organization",
  "@id": getAbsoluteHref("/#organization"),
  name: SITE_SEARCH_NAME,
  url: getAbsoluteHref("/"),
};

const CATEGORY_SEARCH_TITLES: Record<ListCategory, string> = {
  Food: "Food & Restaurant Guides",
  Nightlife: "Bars & Nightlife Guides",
  Nature: "Parks & Nature Guides",
  Culture: "Museums & Culture Guides",
  Stay: "Hotels & Hostels Guides",
  Activities: "Things to Do",
  Routes: "Itineraries & Walking Routes",
  Essentials: "Travel Tips & Essentials",
};

const TITLE_LOWERCASE_WORDS = new Set(["a", "an", "and", "at", "for", "in", "of", "on", "or", "the", "to"]);

function parseEditorialDate(value?: string | null) {
  if (!value) {
    return null;
  }

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}

export function isIndexableEditorialGuide(guide: MapList) {
  return (
    !guide.id.startsWith("event-") &&
    guide.submissionType !== "event" &&
    guide.visibility !== "private" &&
    guide.visibility !== "followers" &&
    guide.stops.length >= 3
  );
}

export function getGuideLastModified(guide: Pick<MapList, "createdAt" | "updatedAt">) {
  return parseEditorialDate(guide.updatedAt) ?? parseEditorialDate(guide.createdAt) ?? undefined;
}

export function getLatestGuideLastModified(guides: Array<Pick<MapList, "createdAt" | "updatedAt">>) {
  return guides
    .map(getGuideLastModified)
    .filter((value): value is string => Boolean(value))
    .sort((left, right) => Date.parse(right) - Date.parse(left))[0];
}

function toMetadataDescription(value: string, maxLength = 165) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  const shortened = normalized.slice(0, maxLength + 1);
  const wordBoundary = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, wordBoundary > 110 ? wordBoundary : maxLength).replace(/[,:;\s]+$/, "")}.`;
}

function titleCaseSearchPhrase(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((word, index) => (index > 0 && TITLE_LOWERCASE_WORDS.has(word) ? word : `${word.charAt(0).toUpperCase()}${word.slice(1)}`))
    .join(" ");
}

function cleanSegments(segments: string[]) {
  return segments.map((segment) => decodeURIComponent(segment).trim()).filter(Boolean);
}

export function getCanonicalCityPath(city: Pick<City, "name">) {
  return `/city/${slugify(city.name)}`;
}

export function getCanonicalCountryPath(country: Pick<Country, "name">) {
  return `/country/${slugify(country.name)}`;
}

export function getCanonicalContinentPath(continent: Pick<Continent, "name">) {
  return `/continent/${slugify(continent.name)}`;
}

export function getCanonicalCityNeighborhoodPath(city: Pick<City, "name">, neighborhood: Pick<SubArea, "name">) {
  return `${getCanonicalCityPath(city)}/${slugify(neighborhood.name)}`;
}

export function getCanonicalCityCategoryPath(
  city: Pick<City, "name">,
  category: ListCategory,
  neighborhood?: Pick<SubArea, "name">,
) {
  const basePath = neighborhood
    ? getCanonicalCityNeighborhoodPath(city, neighborhood)
    : getCanonicalCityPath(city);
  return `${basePath}/${slugify(category)}`;
}

function normalizeRouteText(value?: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
    .toLowerCase();
}

function getParisDistrictNumber(city: Pick<City, "name">, neighborhood?: Pick<SubArea, "name"> | null) {
  if (slugify(city.name) !== "paris" || !neighborhood?.name) {
    return null;
  }

  const match = neighborhood.name.match(PARIS_ARRONDISSEMENT_RE);
  return match ? Number.parseInt(match[1], 10) : null;
}

function getParisDistrictRouteSlugs(city: Pick<City, "name">, neighborhood: Pick<SubArea, "name">) {
  const districtNumber = getParisDistrictNumber(city, neighborhood);
  if (!districtNumber) {
    return [];
  }

  const ordinal = neighborhood.name.split(" ")[0];
  const frenchOrdinal = districtNumber === 1 ? "1er" : `${districtNumber}e`;

  return [
    `${ordinal} district`,
    `paris ${ordinal} district`,
    `district ${districtNumber}`,
    `paris district ${districtNumber}`,
    `${districtNumber} district`,
    `paris ${districtNumber} district`,
    `${frenchOrdinal} arrondissement`,
    `paris ${frenchOrdinal} arrondissement`,
  ].map(slugify);
}

function getNeighborhoodRouteSlugs(city: City, subarea: SubArea) {
  return new Set([subarea.id, slugify(subarea.name), ...getParisDistrictRouteSlugs(city, subarea)]);
}

function getParisDistrictSeoLabel(city: Pick<City, "name">, neighborhood?: Pick<SubArea, "name"> | null) {
  const districtNumber = getParisDistrictNumber(city, neighborhood);
  if (!districtNumber || !neighborhood?.name) {
    return null;
  }

  const ordinal = neighborhood.name.split(" ")[0];
  return {
    ordinal,
    district: `${ordinal} district`,
    place: `${neighborhood.name}, ${city.name} (${ordinal} district)`,
  };
}

type GuideSeoSeed = Pick<MapList, "category" | "title" | "slug" | "description" | "seoSlug" | "seoTitle" | "seoDescription">;

function getGuideIntentLabel(guide: GuideSeoSeed) {
  if (guide.seoTitle?.trim()) {
    return guide.seoTitle.trim();
  }

  const text = `${guide.title} ${guide.slug} ${guide.description}`.toLowerCase();

  if (guide.category === "Nightlife") {
    if (/\bcocktail|speakeasy|martini|mixology\b/.test(text)) return "best cocktail bars";
    if (/\bdive|dives|dive-bars?\b/.test(text)) return "best dive bars";
    if (/\bclub|dance|late-night|nightclub\b/.test(text)) return "best clubs";
    if (/\bpopular|high volume|hits|busy|hype\b/.test(text)) return "popular bars";
    return "best bars";
  }

  if (guide.category === "Food") {
    if (/\btapas\b/.test(text)) return "best tapas";
    if (/\bcoffee|cafe|bakery|brunch\b/.test(text)) return "best cafes";
    if (/\bcheap|budget|casual\b/.test(text)) return "best casual restaurants";
    return "best restaurants";
  }

  if (guide.category === "Culture") return "best museums and cultural stops";
  if (guide.category === "Stay") return "best places to stay";
  if (guide.category === "Nature") return "best parks and nature spots";
  if (guide.category === "Routes") return "best routes and walking paths";
  if (guide.category === "Essentials") return "travel essentials and practical tips";
  return "best things to do";
}

export function getGuideSeoSlug(guide: GuideSeoSeed) {
  return slugify(guide.seoSlug?.trim() || getGuideIntentLabel(guide));
}

function getSeoTitleRouteSlug(
  guide: GuideSeoSeed,
  city: Pick<City, "name">,
  neighborhood?: Pick<SubArea, "name">,
) {
  const seoTitle = guide.seoTitle?.trim();
  if (!seoTitle) {
    return "";
  }

  let titleSlug = slugify(seoTitle);
  for (const place of [neighborhood?.name, city.name]) {
    const placeSlug = place ? slugify(place) : "";
    if (!placeSlug) {
      continue;
    }
    titleSlug = titleSlug
      .replace(new RegExp(`-(in|near|on)-${placeSlug}(?=-|$)`, "g"), "")
      .replace(new RegExp(`-${placeSlug}$`), "");
  }

  return titleSlug.replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");
}

export function getGuideSeoTitle(
  guide: GuideSeoSeed,
  city: Pick<City, "name">,
  neighborhood?: Pick<SubArea, "name">,
) {
  if (guide.seoTitle?.trim()) {
    return guide.seoTitle.trim();
  }

  const placeLabel = neighborhood ? `${neighborhood.name}, ${city.name}` : city.name;
  return `${getGuideIntentLabel(guide)} in ${placeLabel}`;
}

export function getGuideMetadataTitle(
  guide: GuideSeoSeed,
  city: Pick<City, "name">,
  neighborhood?: Pick<SubArea, "name">,
) {
  const editorialTitle = getGuideSeoTitle(guide, city, neighborhood);
  if (editorialTitle.length <= 62) {
    return editorialTitle;
  }

  const placeLabel = neighborhood ? `${neighborhood.name}, ${city.name}` : city.name;
  return `${titleCaseSearchPhrase(getGuideSeoSlug(guide))} in ${placeLabel}`;
}

export function getGuideSeoDescription(
  guide: GuideSeoSeed,
  city: Pick<City, "name">,
  neighborhood?: Pick<SubArea, "name">,
) {
  const seoTitle = getGuideSeoTitle(guide, city, neighborhood);
  return guide.seoDescription?.trim() || `${seoTitle}. ${guide.description}`;
}

export function getGuideRouteSlug(
  city: Pick<City, "name">,
  guide: GuideSeoSeed & Pick<MapList, "id">,
  neighborhood?: Pick<SubArea, "name">,
  guideSource: MapList[] = mapLists,
) {
  const baseSlug = getGuideSeoSlug(guide);
  const neighborhoodKey = normalizeRouteText(neighborhood?.name);
  const duplicateCount = guideSource.filter(
    (list) =>
      list.location.scope === "city" &&
      list.location.city === city.name &&
      list.category === guide.category &&
      normalizeRouteText(list.location.neighborhood) === neighborhoodKey &&
      getGuideSeoSlug(list) === baseSlug,
  ).length;

  if (duplicateCount <= 1) {
    return baseSlug;
  }

  const seoTitleSlug = getSeoTitleRouteSlug(guide, city, neighborhood);
  if (seoTitleSlug && seoTitleSlug !== baseSlug) {
    const seoTitleSlugDuplicateCount = guideSource.filter(
      (list) =>
        list.location.scope === "city" &&
        list.location.city === city.name &&
        list.category === guide.category &&
        normalizeRouteText(list.location.neighborhood) === neighborhoodKey &&
        getSeoTitleRouteSlug(list, city, neighborhood) === seoTitleSlug,
    ).length;

    if (seoTitleSlugDuplicateCount <= 1) {
      return seoTitleSlug;
    }
  }

  const suffix = guide.slug
    .replace(slugify(city.name), "")
    .replace(neighborhood ? slugify(neighborhood.name) : "", "")
    .replace(slugify(guide.category), "")
    .replace(baseSlug, "")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return `${baseSlug}-${suffix || slugify(guide.id)}`;
}

function getLegacyDuplicateGuideRouteSlug(
  city: Pick<City, "name">,
  guide: GuideSeoSeed & Pick<MapList, "id">,
  neighborhood?: Pick<SubArea, "name">,
) {
  const baseSlug = getGuideSeoSlug(guide);
  const suffix = guide.slug
    .replace(slugify(city.name), "")
    .replace(neighborhood ? slugify(neighborhood.name) : "", "")
    .replace(slugify(guide.category), "")
    .replace(baseSlug, "")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return `${baseSlug}-${suffix || slugify(guide.id)}`;
}

function findGuideForRouteSlug(
  city: City,
  guideSlug: string,
  neighborhood: Pick<SubArea, "name"> | undefined,
  category: ListCategory | undefined,
  guideSource: MapList[],
) {
  const candidateLists = getListsForCityRoute(city, neighborhood, category, guideSource);
  return candidateLists.find(
    (list) =>
      list.slug === guideSlug ||
      slugify(list.title) === guideSlug ||
      getGuideSeoSlug(list) === guideSlug ||
      getGuideRouteSlug(city, list, neighborhood, guideSource) === guideSlug ||
      getLegacyDuplicateGuideRouteSlug(city, list, neighborhood) === guideSlug,
  );
}

export function getCanonicalGuidePath(
  city: Pick<City, "name">,
  guide: GuideSeoSeed & Pick<MapList, "id">,
  neighborhood?: Pick<SubArea, "name">,
  guideSource: MapList[] = mapLists,
) {
  return `${getCanonicalCityCategoryPath(city, guide.category, neighborhood)}/${getGuideRouteSlug(city, guide, neighborhood, guideSource)}`;
}

export function getCityBySimpleSlug(citySlug: string, citySource: City[] = cities) {
  return citySource.find((city) => slugify(city.name) === citySlug);
}

export function getCountryBySimpleSlug(countrySlug: string, continentSource: Continent[] = continents) {
  for (const continent of continentSource) {
    const country = continent.countries.find((item) => slugify(item.name) === countrySlug);
    if (country) {
      return { continent, country };
    }
  }

  return undefined;
}

function findNeighborhood(city: City, neighborhoodSlug?: string): NeighborhoodMatch | undefined {
  if (!neighborhoodSlug) {
    return undefined;
  }

  const normalizedNeighborhoodSlug = slugify(neighborhoodSlug);

  for (const subarea of city.subareas ?? []) {
    if (getNeighborhoodRouteSlugs(city, subarea).has(normalizedNeighborhoodSlug)) {
      return { subarea };
    }

    const nested = subarea.subareas?.find(
      (nestedSubarea) => getNeighborhoodRouteSlugs(city, nestedSubarea).has(normalizedNeighborhoodSlug),
    );
    if (nested) {
      return { subarea: nested, parent: subarea };
    }
  }

  return undefined;
}

function normalizeNeighborhoodName(value?: string | null) {
  return normalizeRouteText(value);
}

export function getPublishedServerGuides(guideSource: MapList[] = mapLists) {
  return guideSource;
}

export function normalizeRouteNeighborhoodName(value?: string | null) {
  return normalizeNeighborhoodName(value);
}

export function getListsForCityRoute(
  city: City,
  neighborhood?: Pick<SubArea, "name">,
  category?: ListCategory,
  guideSource: MapList[] = mapLists,
) {
  const neighborhoodKey = normalizeNeighborhoodName(neighborhood?.name);

  return getPublishedServerGuides(guideSource).filter((list) => {
    if (list.location.scope !== "city" || list.location.city !== city.name) {
      return false;
    }
    if (neighborhoodKey && normalizeNeighborhoodName(list.location.neighborhood) !== neighborhoodKey) {
      return false;
    }
    if (!neighborhoodKey && normalizeNeighborhoodName(list.location.neighborhood)) {
      return false;
    }
    if (category && list.category !== category) {
      return false;
    }
    return true;
  });
}

export function getAllListsForCityRoute(
  city: City,
  category?: ListCategory,
  guideSource: MapList[] = mapLists,
) {
  return getPublishedServerGuides(guideSource).filter((list) => {
    if (list.location.scope !== "city" || list.location.city !== city.name) {
      return false;
    }
    if (category && list.category !== category) {
      return false;
    }
    return true;
  });
}

export function getIndexableListsForCityRoute(
  city: City,
  neighborhood?: Pick<SubArea, "name">,
  category?: ListCategory,
  guide?: MapList,
  guideSource: MapList[] = mapLists,
) {
  if (guide) {
    return isIndexableEditorialGuide(guide) ? [guide] : [];
  }
  const lists = neighborhood
    ? getListsForCityRoute(city, neighborhood, category, guideSource)
    : getAllListsForCityRoute(city, category, guideSource);

  return lists.filter(isIndexableEditorialGuide);
}

export function getPreferredCityCategoryPath(
  city: City,
  category: ListCategory,
  neighborhood?: Pick<SubArea, "name">,
  guideSource: MapList[] = mapLists,
) {
  const guides = getIndexableListsForCityRoute(city, neighborhood, category, undefined, guideSource);
  if (guides.length === 1) {
    return getCanonicalGuidePath(city, guides[0], neighborhood, guideSource);
  }

  return getCanonicalCityCategoryPath(city, category, neighborhood);
}

export function getPreferredCityNeighborhoodPath(
  city: City,
  neighborhood: Pick<SubArea, "name">,
  guideSource: MapList[] = mapLists,
) {
  const guides = getIndexableListsForCityRoute(city, neighborhood, undefined, undefined, guideSource);
  if (guides.length === 1) {
    return getCanonicalGuidePath(city, guides[0], neighborhood, guideSource);
  }

  return getCanonicalCityNeighborhoodPath(city, neighborhood);
}

export function getNeighborhoodsForCityRoute(city: City) {
  return (city.subareas ?? []).flatMap((subarea) => [
    { neighborhood: subarea, parentNeighborhood: undefined as SubArea | undefined },
    ...(subarea.subareas ?? []).map((nestedSubarea) => ({
      neighborhood: nestedSubarea,
      parentNeighborhood: subarea,
    })),
  ]);
}

export function getCategoriesForCityRoute(
  city: City,
  neighborhood?: Pick<SubArea, "name">,
  guideSource: MapList[] = mapLists,
) {
  const lists = neighborhood ? getListsForCityRoute(city, neighborhood, undefined, guideSource) : getAllListsForCityRoute(city, undefined, guideSource);
  return CATEGORIES.filter((category) => lists.some((list) => list.category === category));
}

export function getIndexableCategoriesForCityRoute(
  city: City,
  neighborhood?: Pick<SubArea, "name">,
  guideSource: MapList[] = mapLists,
) {
  const lists = neighborhood
    ? getListsForCityRoute(city, neighborhood, undefined, guideSource)
    : getAllListsForCityRoute(city, undefined, guideSource);
  const indexableLists = lists.filter(isIndexableEditorialGuide);

  return CATEGORIES.filter((category) => indexableLists.some((list) => list.category === category));
}

export function getRelatedCityRouteGuides(
  route: Pick<CityDeepLinkResolution, "city" | "neighborhood" | "category" | "guide">,
  guideSource: MapList[] = mapLists,
) {
  const sameScope = getListsForCityRoute(route.city, route.neighborhood, route.category, guideSource)
    .filter(isIndexableEditorialGuide)
    .filter((list) => list.id !== route.guide?.id)
    .sort((left, right) => right.upvotes - left.upvotes || left.title.localeCompare(right.title));

  if (sameScope.length >= 4 || !route.guide) {
    return sameScope;
  }

  const cityWide = getListsForCityRoute(route.city, undefined, route.guide.category, guideSource)
    .filter(isIndexableEditorialGuide)
    .filter((list) => list.id !== route.guide?.id && !sameScope.some((item) => item.id === list.id))
    .sort((left, right) => right.upvotes - left.upvotes || left.title.localeCompare(right.title));

  return [...sameScope, ...cityWide];
}

function buildSelection(city: City, neighborhood?: NeighborhoodMatch, continentSource: Continent[] = continents): SelectionState {
  const containingContinent = continentSource.find((continent) =>
    continent.countries.some((country) =>
      country.name === city.country && country.cities.some((item) => item.id === city.id),
    ),
  );
  const continent = containingContinent ?? continentSource.find((item) => item.name === city.continent);
  const country = continent?.countries.find((item) => item.name === city.country);

  return {
    continentId: continent?.id ?? slugify(city.continent),
    countryId: country?.id ?? slugify(city.country),
    countrySubareaId: city.countrySubareaId,
    stateId: city.stateId,
    cityId: city.id,
    subareaId: neighborhood?.parent ? neighborhood.parent.id : neighborhood?.subarea.id,
    nestedSubareaId: neighborhood?.parent ? neighborhood.subarea.id : undefined,
  };
}

function buildCountryBreadcrumbData(country: Country, canonicalPath: string) {
  const items = [
    { name: SITE_SEARCH_NAME, item: "/" },
    { name: country.name, item: canonicalPath },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getAbsoluteHref(item.item),
    })),
  };
}

export function getIndexableGuidesForCountry(country: Country, guideSource: MapList[] = mapLists) {
  const cityNames = new Set(country.cities.filter((city) => !city.isPlaceholderRegion).map((city) => city.name));

  return guideSource.filter(
    (guide) =>
      isIndexableEditorialGuide(guide) &&
      (guide.location.country === country.name || (guide.location.city ? cityNames.has(guide.location.city) : false)),
  );
}

export function getIndexableCitiesForCountry(country: Country, guideSource: MapList[] = mapLists) {
  const guideCityNames = new Set(
    getIndexableGuidesForCountry(country, guideSource)
      .map((guide) => guide.location.city)
      .filter((cityName): cityName is string => Boolean(cityName)),
  );

  return country.cities.filter((city) => !city.isPlaceholderRegion && guideCityNames.has(city.name));
}

export function getIndexableGuidesForContinent(continent: Continent, guideSource: MapList[] = mapLists) {
  const countryNames = new Set(continent.countries.map((country) => country.name));
  const cityNames = new Set(
    continent.countries.flatMap((country) =>
      country.cities.filter((city) => !city.isPlaceholderRegion).map((city) => city.name),
    ),
  );

  return guideSource.filter(
    (guide) =>
      isIndexableEditorialGuide(guide) &&
      (guide.location.continent === continent.name ||
        countryNames.has(guide.location.country) ||
        (guide.location.city ? cityNames.has(guide.location.city) : false)),
  );
}

export function getIndexableCountriesForContinent(continent: Continent, guideSource: MapList[] = mapLists) {
  return continent.countries.filter((country) => getIndexableGuidesForCountry(country, guideSource).length > 0);
}

function buildCountryItemListData(country: Country, canonicalPath: string, guideSource: MapList[]) {
  const url = getAbsoluteHref(canonicalPath);
  const cityItems = getIndexableCitiesForCountry(country, guideSource)
    .map((city, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: city.name,
      url: getAbsoluteHref(getCanonicalCityPath(city)),
    }));

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    name: `RGuide ${country.name} travel guides`,
    url,
    isPartOf: websiteReference,
    publisher: organizationReference,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: cityItems.length,
      itemListElement: cityItems,
    },
  };
}

function buildContinentBreadcrumbData(continent: Continent, canonicalPath: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: SITE_SEARCH_NAME,
        item: getAbsoluteHref("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: continent.name,
        item: getAbsoluteHref(canonicalPath),
      },
    ],
  };
}

function buildContinentItemListData(continent: Continent, canonicalPath: string, guideSource: MapList[]) {
  const url = getAbsoluteHref(canonicalPath);
  const countryItems = getIndexableCountriesForContinent(continent, guideSource).map((country, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: country.name,
    url: getAbsoluteHref(getCanonicalCountryPath(country)),
  }));

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    name: `RGuide ${continent.name} travel guides`,
    url,
    isPartOf: websiteReference,
    publisher: organizationReference,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: countryItems.length,
      itemListElement: countryItems,
    },
  };
}

export function resolveContinentDeepLink(
  rawSegments: string[],
  routeData: {
    continents?: Continent[];
    guides?: MapList[];
  } = {},
): ContinentDeepLinkResolution | null {
  const continentSource = routeData.continents ?? continents;
  const guideSource = routeData.guides ?? mapLists;
  const segments = cleanSegments(rawSegments);
  const [continentSlug, ...rest] = segments;

  if (!continentSlug || rest.length > 0) {
    return null;
  }

  const continent = continentSource.find((item) => slugify(item.name) === continentSlug || item.id === continentSlug);
  if (!continent) {
    return null;
  }

  const canonicalPath = getCanonicalContinentPath(continent);
  const indexableGuides = getIndexableGuidesForContinent(continent, guideSource);
  const indexableCountries = getIndexableCountriesForContinent(continent, guideSource);
  const cityCount = indexableCountries.reduce(
    (total, country) => total + getIndexableCitiesForCountry(country, guideSource).length,
    0,
  );
  const title = `${continent.name} Travel Guides`;
  const fullDescription = `Explore ${indexableGuides.length} curated RGuide Travel guides across ${continent.name}, covering ${cityCount} cities in ${indexableCountries.length} countries.`;
  const h1 = `${continent.name} Travel Guides`;
  const intro = `${fullDescription} Open a country or city to compare neighborhoods, hotels, restaurants, bars, culture, nature, and things to do.`;

  return {
    selection: {
      continentId: continent.id,
    },
    continent,
    canonicalPath,
    indexable: indexableGuides.length > 0,
    lastModified: getLatestGuideLastModified(indexableGuides),
    title,
    description: toMetadataDescription(fullDescription),
    h1,
    intro,
    structuredData: [
      buildContinentBreadcrumbData(continent, canonicalPath),
      buildContinentItemListData(continent, canonicalPath, guideSource),
    ],
  };
}

export function resolveCountryDeepLink(
  rawSegments: string[],
  routeData: {
    continents?: Continent[];
    guides?: MapList[];
  } = {},
): CountryDeepLinkResolution | null {
  const continentSource = routeData.continents ?? continents;
  const guideSource = routeData.guides ?? mapLists;
  const segments = cleanSegments(rawSegments);
  const [countrySlug, ...rest] = segments;

  if (!countrySlug || rest.length > 0) {
    return null;
  }

  const match = getCountryBySimpleSlug(countrySlug, continentSource);
  if (!match) {
    return null;
  }

  const { continent, country } = match;
  const canonicalPath = getCanonicalCountryPath(country);
  const indexableGuides = getIndexableGuidesForCountry(country, guideSource);
  const cityCount = getIndexableCitiesForCountry(country, guideSource).length;
  const cityLabel = cityCount === 1 ? "city" : "cities";
  const title = `${country.name} Travel Guides`;
  const editorialIntro =
    country.description ||
    `Explore RGuide city guides, neighborhoods, restaurants, hotels, bars, culture, and things to do across ${country.name}.`;
  const h1 = `${country.name} Travel Guides`;
  const intro = `${editorialIntro} Browse ${indexableGuides.length} curated guides across ${cityCount} ${cityLabel}.`;

  return {
    selection: {
      continentId: continent.id,
      countryId: country.id,
    },
    continent,
    country,
    canonicalPath,
    indexable: indexableGuides.length > 0,
    lastModified: getLatestGuideLastModified(indexableGuides),
    title,
    description: toMetadataDescription(intro),
    h1,
    intro,
    structuredData: [
      buildCountryBreadcrumbData(country, canonicalPath),
      buildCountryItemListData(country, canonicalPath, guideSource),
    ],
  };
}

function buildBreadcrumbData(city: City, canonicalPath: string, neighborhood?: SubArea, category?: ListCategory, guide?: MapList) {
  const items = [
    { name: SITE_SEARCH_NAME, item: "/" },
    { name: city.name, item: getCanonicalCityPath(city) },
    neighborhood ? { name: neighborhood.name, item: getCanonicalCityNeighborhoodPath(city, neighborhood) } : null,
    category ? { name: category, item: getCanonicalCityCategoryPath(city, category, neighborhood) } : null,
    guide ? { name: guide.title, item: canonicalPath } : null,
  ].filter((item): item is { name: string; item: string } => Boolean(item));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getAbsoluteHref(item.item),
    })),
  };
}

function buildItemListData(
  lists: MapList[],
  canonicalPath: string,
  name: string,
  guideSource: MapList[] = mapLists,
) {
  const url = getAbsoluteHref(canonicalPath);
  const itemList = {
    "@type": "ItemList",
    "@id": `${url}#guide-list`,
    name,
    numberOfItems: lists.length,
    itemListElement: lists.slice(0, 20).map((list, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: getGuideSeoTitle(
        list,
        { name: list.location.city ?? "" },
        list.location.neighborhood ? { name: list.location.neighborhood } : undefined,
      ),
      url: getAbsoluteHref(
        getCanonicalGuidePath(
          { name: list.location.city ?? "" },
          list,
          list.location.neighborhood ? { name: list.location.neighborhood } : undefined,
          guideSource,
        ),
      ),
    })),
  };

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    name,
    url,
    isPartOf: websiteReference,
    publisher: organizationReference,
    mainEntity: itemList,
  };
}

function buildGuideData(guide: MapList, canonicalPath: string) {
  const city = { name: guide.location.city ?? guide.location.country };
  const neighborhood = guide.location.neighborhood ? { name: guide.location.neighborhood } : undefined;
  const seoDescription = getGuideSeoDescription(guide, city, neighborhood);
  const url = getAbsoluteHref(canonicalPath);
  const image = guide.photo ?? guide.stops.find((stop) => Boolean(stop.photo))?.photo;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: getGuideSeoTitle(guide, city, neighborhood),
    alternativeHeadline: guide.title,
    description: seoDescription,
    url,
    image,
    datePublished: parseEditorialDate(guide.createdAt) ?? undefined,
    dateModified: getGuideLastModified(guide),
    articleSection: guide.category,
    about: [
      {
        "@type": "Place",
        name: [guide.location.neighborhood, guide.location.city, guide.location.country].filter(Boolean).join(", "),
      },
      {
        "@type": "Thing",
        name: guide.category,
      },
    ],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
    },
    isPartOf: websiteReference,
    publisher: organizationReference,
    author: organizationReference,
    citation: guide.sources?.map((source) => source.url),
    mainEntity: {
      "@type": "ItemList",
      "@id": `${url}#stops`,
      name: `${getGuideSeoTitle(guide, city, neighborhood)} stops`,
      numberOfItems: guide.stops.length,
      itemListElement: guide.stops.map((stop, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Place",
          name: stop.name,
          description: stop.description,
          image: stop.photo,
          url: stop.officialUrl,
        },
      })),
    },
  };
}

function getCategoryHubTitle(category: ListCategory, placeLabel: string) {
  if (category === "Activities") {
    return `Things to Do in ${placeLabel}`;
  }

  return `${CATEGORY_SEARCH_TITLES[category]} in ${placeLabel}`;
}

function getCityHubSummary(lists: MapList[], placeLabel: string, category?: ListCategory) {
  const guideCount = lists.length;
  const stopCount = lists.reduce((total, list) => total + list.stops.length, 0);
  const categoryNames = CATEGORIES.filter((item) => lists.some((list) => list.category === item));

  if (category) {
    return `Compare ${guideCount} curated ${CATEGORY_SEARCH_TITLES[category].toLowerCase()} for ${placeLabel}, with ${stopCount} mapped stops, neighborhood context, practical details, and source-backed picks.`;
  }

  const coverage = categoryNames.slice(0, 5).map((item) => item.toLowerCase()).join(", ");
  return `Explore ${guideCount} curated travel guides for ${placeLabel}, with ${stopCount} mapped stops${coverage ? ` across ${coverage}` : ""}. Compare neighborhoods and open a guide to plan the trip.`;
}

export function resolveCityDeepLink(
  rawSegments: string[],
  routeData: { continents?: Continent[]; cities?: City[]; guides?: MapList[] } = {},
): CityDeepLinkResolution | null {
  const continentSource = routeData.continents ?? continents;
  const citySource = routeData.cities ?? (routeData.continents ? getCitiesFromContinents(routeData.continents) : cities);
  const guideSource = routeData.guides ?? mapLists;
  const segments = cleanSegments(rawSegments);
  const [citySlug, ...cityRest] = segments;
  let city = citySlug ? getCityBySimpleSlug(citySlug, citySource) : undefined;
  let rest = cityRest;

  if (!city && segments.length >= 3) {
    city = getCityBySimpleSlug(segments[2], citySource);
    rest = segments.slice(3);
  }

  if (!city) {
    return null;
  }

  let neighborhoodMatch: NeighborhoodMatch | undefined;
  let category: ListCategory | undefined;
  let guide: MapList | undefined;
  let cursor = 0;

  const possibleCategory = categoryBySlug.get(rest[cursor] ?? "");
  if (possibleCategory) {
    category = possibleCategory;
    cursor += 1;
  } else if (rest[cursor]) {
    neighborhoodMatch = findNeighborhood(city, rest[cursor]);
    if (!neighborhoodMatch) {
      const citywideGuide = findGuideForRouteSlug(city, rest[cursor], undefined, undefined, guideSource);
      if (!citywideGuide) {
        return null;
      }
      guide = citywideGuide;
      category = citywideGuide.category;
      cursor += 1;
    } else {
      cursor += 1;
      category = categoryBySlug.get(rest[cursor] ?? "");
      if (category) {
        cursor += 1;
      }
    }
  }

  if (rest[cursor]) {
    const guideSlug = rest[cursor];
    guide = findGuideForRouteSlug(city, guideSlug, neighborhoodMatch?.subarea, category, guideSource);
    if (!guide) {
      return null;
    }
    category = guide.category;
    cursor += 1;
  }

  if (rest[cursor]) {
    return null;
  }

  const neighborhood = neighborhoodMatch?.subarea;
  const lists = getIndexableListsForCityRoute(city, neighborhood, category, guide, guideSource);
  const guideIsIndexable = guide ? isIndexableEditorialGuide(guide) : false;
  const indexable = guide
    ? guideIsIndexable
    : !category && !neighborhood
      ? lists.length > 0
      : lists.length >= 2;
  const routePath = guide
    ? getCanonicalGuidePath(city, guide, neighborhood, guideSource)
    : category
      ? getCanonicalCityCategoryPath(city, category, neighborhood)
      : neighborhood
        ? getCanonicalCityNeighborhoodPath(city, neighborhood)
        : getCanonicalCityPath(city);
  const soleCategoryGuide = !guide && category && lists.length === 1 ? lists[0] : undefined;
  const canonicalPath = soleCategoryGuide
    ? getCanonicalGuidePath(city, soleCategoryGuide, neighborhood, guideSource)
    : routePath;

  const placeLabel = neighborhood ? `${neighborhood.name}, ${city.name}` : city.name;
  const parisDistrictSeo = getParisDistrictSeoLabel(city, neighborhood);
  const seoPlaceLabel = parisDistrictSeo?.place ?? placeLabel;
  const guideSeoTitle = guide ? getGuideSeoTitle(guide, city, neighborhood) : null;
  const guideDescription = guide ? getGuideSeoDescription(guide, city, neighborhood) : null;
  const hubSummary = guide ? null : getCityHubSummary(lists, seoPlaceLabel, category);
  const h1 = guide
    ? guideSeoTitle!
    : category
      ? getCategoryHubTitle(category, placeLabel)
      : neighborhood
        ? `${neighborhood.name}, ${city.name} Travel Guides`
        : `${city.name} Travel Guides`;
  const title = guide
    ? getGuideMetadataTitle(guide, city, neighborhood)
    : category
      ? getCategoryHubTitle(category, seoPlaceLabel)
      : neighborhood
        ? parisDistrictSeo
          ? `${neighborhood.name}, ${city.name} district guides`
          : `${neighborhood.name}, ${city.name} Travel Guides`
        : `${city.name} Travel Guides`;
  const description = guide
    ? toMetadataDescription(guideDescription!)
    : toMetadataDescription(
        neighborhood?.description && !category
          ? `${neighborhood.description} ${hubSummary}`
          : city.description && !category && !neighborhood
            ? city.description
            : hubSummary!,
      );
  const intro = guide
    ? guideDescription!
    : neighborhood?.description && !category
      ? `${neighborhood.description} ${hubSummary}`
      : city.description && !category && !neighborhood
        ? city.description
        : hubSummary!;

  return {
    city,
    neighborhood,
    parentNeighborhood: neighborhoodMatch?.parent,
    category,
    guide,
    canonicalPath,
    indexable,
    lastModified: getLatestGuideLastModified(lists),
    selection: buildSelection(city, neighborhoodMatch, continentSource),
    activeCategory: category,
    expandedGuideId: guide?.id,
    title,
    description,
    h1,
    intro,
    structuredData: [
      buildBreadcrumbData(city, canonicalPath, neighborhood, category, guide),
      guide ? buildGuideData(guide, canonicalPath) : buildItemListData(lists, canonicalPath, h1, guideSource),
    ],
  };
}

export function getCityDeepLinkStaticParams(
  guideSource: MapList[] = mapLists,
  citySource: City[] = cities,
) {
  const params: Array<{ segments: string[] }> = [];
  const addPath = (path: string) => {
    const segments = path.split("/").filter(Boolean).slice(1);
    if (!segments.length) {
      return;
    }
    params.push({ segments });
  };

  const seen = new Set<string>();
  const addUniquePath = (path: string) => {
    if (seen.has(path)) {
      return;
    }
    seen.add(path);
    addPath(path);
  };

  for (const city of citySource) {
    const cityLists = getListsForCityRoute(city, undefined, undefined, guideSource).filter(isIndexableEditorialGuide);
    const cityNeighborhoods = getNeighborhoodsForCityRoute(city);
    const indexableNeighborhoods = cityNeighborhoods.filter(({ neighborhood }) =>
      getListsForCityRoute(city, neighborhood, undefined, guideSource).some(isIndexableEditorialGuide),
    );
    if (cityLists.length || indexableNeighborhoods.length) {
      addUniquePath(getCanonicalCityPath(city));
    }

    for (const category of getIndexableCategoriesForCityRoute(city, undefined, guideSource)) {
      addUniquePath(getCanonicalCityCategoryPath(city, category));
    }

    for (const { neighborhood } of indexableNeighborhoods) {
      const neighborhoodLists = getListsForCityRoute(city, neighborhood, undefined, guideSource).filter(
        isIndexableEditorialGuide,
      );
      if (!neighborhoodLists.length) {
        continue;
      }

      addUniquePath(getCanonicalCityNeighborhoodPath(city, neighborhood));
      for (const category of getIndexableCategoriesForCityRoute(city, neighborhood, guideSource)) {
        addUniquePath(getCanonicalCityCategoryPath(city, category, neighborhood));
      }
      for (const guide of neighborhoodLists) {
        addUniquePath(getCanonicalGuidePath(city, guide, neighborhood, guideSource));
      }
    }

    for (const guide of cityLists) {
      addUniquePath(getCanonicalGuidePath(city, guide, undefined, guideSource));
    }
  }

  return params;
}

export function getCountryDeepLinkStaticParams(
  continentSource: Continent[] = continents,
  guideSource: MapList[] = mapLists,
) {
  return continentSource.flatMap((continent) =>
    getIndexableCountriesForContinent(continent, guideSource).map((country) => ({ segments: [slugify(country.name)] })),
  );
}

export function getContinentDeepLinkStaticParams(
  continentSource: Continent[] = continents,
  guideSource: MapList[] = mapLists,
) {
  return continentSource
    .filter((continent) => getIndexableGuidesForContinent(continent, guideSource).length > 0)
    .map((continent) => ({ segments: [slugify(continent.name)] }));
}
