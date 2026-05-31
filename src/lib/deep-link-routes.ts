import { cities, continents, mapLists } from "@/data";
import { CATEGORIES } from "@/lib/constants";
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

function cleanSegments(segments: string[]) {
  return segments.map((segment) => decodeURIComponent(segment).trim()).filter(Boolean);
}

export function getCanonicalCityPath(city: Pick<City, "name">) {
  return `/city/${slugify(city.name)}`;
}

export function getCanonicalCountryPath(country: Pick<Country, "name">) {
  return `/country/${slugify(country.name)}`;
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

  for (const subarea of city.subareas ?? []) {
    if (slugify(subarea.name) === neighborhoodSlug || subarea.id === neighborhoodSlug) {
      return { subarea };
    }

    const nested = subarea.subareas?.find(
      (nestedSubarea) => slugify(nestedSubarea.name) === neighborhoodSlug || nestedSubarea.id === neighborhoodSlug,
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
    return [guide];
  }
  return neighborhood
    ? getListsForCityRoute(city, neighborhood, category, guideSource)
    : getAllListsForCityRoute(city, category, guideSource);
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

export function getRelatedCityRouteGuides(
  route: Pick<CityDeepLinkResolution, "city" | "neighborhood" | "category" | "guide">,
  guideSource: MapList[] = mapLists,
) {
  const sameScope = getListsForCityRoute(route.city, route.neighborhood, route.category, guideSource)
    .filter((list) => list.id !== route.guide?.id)
    .sort((left, right) => right.upvotes - left.upvotes || left.title.localeCompare(right.title));

  if (sameScope.length >= 4 || !route.guide) {
    return sameScope;
  }

  const cityWide = getListsForCityRoute(route.city, undefined, route.guide.category, guideSource)
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
    { name: "Home", item: "/" },
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

function buildCountryItemListData(country: Country, canonicalPath: string) {
  const cityItems = country.cities
    .filter((city) => !city.isPlaceholderRegion)
    .map((city, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: city.name,
      url: getAbsoluteHref(getCanonicalCityPath(city)),
    }));

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `RGuide ${country.name} travel guides`,
    url: getAbsoluteHref(canonicalPath),
    itemListElement: cityItems,
  };
}

export function resolveCountryDeepLink(
  rawSegments: string[],
  routeData: {
    continents?: Continent[];
  } = {},
): CountryDeepLinkResolution | null {
  const continentSource = routeData.continents ?? continents;
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
  const cityCount = country.cities.filter((city) => !city.isPlaceholderRegion).length;
  const cityLabel = cityCount === 1 ? "city" : "cities";
  const title = `RGuide ${country.name} Travel Guide`;
  const description =
    country.description ||
    `Explore RGuide city guides, neighborhoods, restaurants, hotels, bars, culture, and things to do across ${country.name}.`;
  const h1 = country.name;
  const intro =
    country.description ||
    `Browse ${cityCount} ${cityLabel} in ${country.name}, then open city guides for restaurants, hotels, nightlife, culture, and things to do.`;

  return {
    selection: {
      continentId: continent.id,
      countryId: country.id,
    },
    continent,
    country,
    canonicalPath,
    title,
    description,
    h1,
    intro,
    structuredData: [
      buildCountryBreadcrumbData(country, canonicalPath),
      buildCountryItemListData(country, canonicalPath),
    ],
  };
}

function buildBreadcrumbData(city: City, canonicalPath: string, neighborhood?: SubArea, category?: ListCategory, guide?: MapList) {
  const items = [
    { name: "Home", item: "/" },
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
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: getAbsoluteHref(canonicalPath),
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
}

function buildGuideData(guide: MapList, canonicalPath: string) {
  const city = { name: guide.location.city ?? guide.location.country };
  const neighborhood = guide.location.neighborhood ? { name: guide.location.neighborhood } : undefined;
  const seoDescription = getGuideSeoDescription(guide, city, neighborhood);

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: getGuideSeoTitle(guide, city, neighborhood),
    alternateName: guide.title,
    description: seoDescription,
    url: getAbsoluteHref(canonicalPath),
    image: guide.photo,
    about: guide.category,
    author: {
      "@type": "Person",
      name: guide.creator.name,
    },
    itemListElement: guide.stops.map((stop, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: stop.name,
      description: stop.description,
      image: stop.photo,
    })),
  };
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
  const canonicalPath = guide
    ? getCanonicalGuidePath(city, guide, neighborhood, guideSource)
    : category
      ? getCanonicalCityCategoryPath(city, category, neighborhood)
      : neighborhood
        ? getCanonicalCityNeighborhoodPath(city, neighborhood)
        : getCanonicalCityPath(city);

  const placeLabel = neighborhood ? `${neighborhood.name}, ${city.name}` : city.name;
  const guideSeoTitle = guide ? getGuideSeoTitle(guide, city, neighborhood) : null;
  const h1 = guide
    ? guideSeoTitle!
    : category
      ? `${category} in ${placeLabel}`
      : neighborhood
        ? `${neighborhood.name}, ${city.name}`
        : `${city.name} guides`;
  const title = guide
    ? guideSeoTitle!
    : category
      ? `${category} guides in ${placeLabel}`
      : neighborhood
        ? `${neighborhood.name}, ${city.name} guides`
        : `${city.name} travel guides`;
  const description = guide
    ? getGuideSeoDescription(guide, city, neighborhood)
    : category
      ? `Curated ${category.toLowerCase()} travel guides for ${placeLabel}, including local favorites and places worth saving.`
      : neighborhood?.description
        ? `${neighborhood.description} Browse curated travel guides for ${placeLabel}.`
        : `Browse curated travel guides for ${placeLabel}, with picks for food, nightlife, culture, nature, stays, and activities.`;
  const intro = guide
    ? getGuideSeoDescription(guide, city, neighborhood)
    : category
      ? `Explore ${category.toLowerCase()} guides for ${placeLabel}, ranked and mapped so you can choose where to go next.`
      : neighborhood?.description ?? city.description;

  return {
    city,
    neighborhood,
    parentNeighborhood: neighborhoodMatch?.parent,
    category,
    guide,
    canonicalPath,
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
    const cityLists = getListsForCityRoute(city, undefined, undefined, guideSource);
    const cityNeighborhoods = getNeighborhoodsForCityRoute(city);
    if (cityLists.length || cityNeighborhoods.length) {
      addUniquePath(getCanonicalCityPath(city));
    }

    for (const category of getCategoriesForCityRoute(city, undefined, guideSource)) {
      addUniquePath(getCanonicalCityCategoryPath(city, category));
    }

    for (const { neighborhood } of cityNeighborhoods) {
      const neighborhoodLists = getListsForCityRoute(city, neighborhood, undefined, guideSource);
      if (!neighborhoodLists.length) {
        continue;
      }

      addUniquePath(getCanonicalCityNeighborhoodPath(city, neighborhood));
      for (const category of getCategoriesForCityRoute(city, neighborhood, guideSource)) {
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

export function getCountryDeepLinkStaticParams(continentSource: Continent[] = continents) {
  return continentSource.flatMap((continent) =>
    continent.countries.map((country) => ({
      segments: [slugify(country.name)],
    })),
  );
}
