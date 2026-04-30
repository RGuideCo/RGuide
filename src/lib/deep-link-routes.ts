import { cities, continents, mapLists } from "@/data";
import { CATEGORIES } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import { City, ListCategory, MapList, SelectionState, SubArea } from "@/types";

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
  return "best things to do";
}

export function getGuideSeoSlug(guide: GuideSeoSeed) {
  return slugify(guide.seoSlug?.trim() || getGuideIntentLabel(guide));
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
) {
  const baseSlug = getGuideSeoSlug(guide);
  const neighborhoodKey = normalizeRouteText(neighborhood?.name);
  const duplicateCount = mapLists.filter(
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

  const suffix = guide.slug
    .replace(slugify(city.name), "")
    .replace(neighborhood ? slugify(neighborhood.name) : "", "")
    .replace(slugify(guide.category), "")
    .replace(baseSlug, "")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return `${baseSlug}-${suffix || slugify(guide.id)}`;
}

export function getCanonicalGuidePath(
  city: Pick<City, "name">,
  guide: GuideSeoSeed & Pick<MapList, "id">,
  neighborhood?: Pick<SubArea, "name">,
) {
  return `${getCanonicalCityCategoryPath(city, guide.category, neighborhood)}/${getGuideRouteSlug(city, guide, neighborhood)}`;
}

export function getCityBySimpleSlug(citySlug: string) {
  return cities.find((city) => slugify(city.name) === citySlug);
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

export function getPublishedServerGuides() {
  return mapLists;
}

export function normalizeRouteNeighborhoodName(value?: string | null) {
  return normalizeNeighborhoodName(value);
}

export function getListsForCityRoute(city: City, neighborhood?: Pick<SubArea, "name">, category?: ListCategory) {
  const neighborhoodKey = normalizeNeighborhoodName(neighborhood?.name);

  return getPublishedServerGuides().filter((list) => {
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

export function getAllListsForCityRoute(city: City, category?: ListCategory) {
  return getPublishedServerGuides().filter((list) => {
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
) {
  if (guide) {
    return [guide];
  }
  return neighborhood ? getListsForCityRoute(city, neighborhood, category) : getAllListsForCityRoute(city, category);
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

export function getCategoriesForCityRoute(city: City, neighborhood?: Pick<SubArea, "name">) {
  const lists = neighborhood ? getListsForCityRoute(city, neighborhood) : getAllListsForCityRoute(city);
  return CATEGORIES.filter((category) => lists.some((list) => list.category === category));
}

export function getRelatedCityRouteGuides(route: Pick<CityDeepLinkResolution, "city" | "neighborhood" | "category" | "guide">) {
  const sameScope = getListsForCityRoute(route.city, route.neighborhood, route.category)
    .filter((list) => list.id !== route.guide?.id)
    .sort((left, right) => right.upvotes - left.upvotes || left.title.localeCompare(right.title));

  if (sameScope.length >= 4 || !route.guide) {
    return sameScope;
  }

  const cityWide = getListsForCityRoute(route.city, undefined, route.guide.category)
    .filter((list) => list.id !== route.guide?.id && !sameScope.some((item) => item.id === list.id))
    .sort((left, right) => right.upvotes - left.upvotes || left.title.localeCompare(right.title));

  return [...sameScope, ...cityWide];
}

function buildSelection(city: City, neighborhood?: NeighborhoodMatch): SelectionState {
  const continent = continents.find((item) => item.name === city.continent);
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
      item: item.item,
    })),
  };
}

function buildItemListData(lists: MapList[], canonicalPath: string, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: canonicalPath,
    numberOfItems: lists.length,
    itemListElement: lists.slice(0, 20).map((list, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: getGuideSeoTitle(
        list,
        { name: list.location.city ?? "" },
        list.location.neighborhood ? { name: list.location.neighborhood } : undefined,
      ),
      url: getCanonicalGuidePath(
        { name: list.location.city ?? "" },
        list,
        list.location.neighborhood ? { name: list.location.neighborhood } : undefined,
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
    url: canonicalPath,
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
    })),
  };
}

export function resolveCityDeepLink(rawSegments: string[]): CityDeepLinkResolution | null {
  const segments = cleanSegments(rawSegments);
  const [citySlug, ...cityRest] = segments;
  let city = citySlug ? getCityBySimpleSlug(citySlug) : undefined;
  let rest = cityRest;

  if (!city && segments.length >= 3) {
    city = getCityBySimpleSlug(segments[2]);
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
      return null;
    }
    cursor += 1;
    category = categoryBySlug.get(rest[cursor] ?? "");
    if (category) {
      cursor += 1;
    }
  }

  if (rest[cursor]) {
    const guideSlug = rest[cursor];
    const candidateLists = getListsForCityRoute(city, neighborhoodMatch?.subarea, category);
    guide = candidateLists.find(
      (list) =>
        list.slug === guideSlug ||
        slugify(list.title) === guideSlug ||
        getGuideSeoSlug(list) === guideSlug ||
        getGuideRouteSlug(city, list, neighborhoodMatch?.subarea) === guideSlug,
    );
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
  const lists = getIndexableListsForCityRoute(city, neighborhood, category, guide);
  const canonicalPath = guide
    ? getCanonicalGuidePath(city, guide, neighborhood)
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
    ? `${guideSeoTitle}: ${guide.title}`
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
    selection: buildSelection(city, neighborhoodMatch),
    activeCategory: category,
    expandedGuideId: guide?.id,
    title,
    description,
    h1,
    intro,
    structuredData: [
      buildBreadcrumbData(city, canonicalPath, neighborhood, category, guide),
      guide ? buildGuideData(guide, canonicalPath) : buildItemListData(lists, canonicalPath, h1),
    ],
  };
}

export function getCityDeepLinkStaticParams() {
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

  for (const city of cities) {
    const cityLists = getListsForCityRoute(city);
    const cityNeighborhoods = getNeighborhoodsForCityRoute(city);
    if (cityLists.length || cityNeighborhoods.length) {
      addUniquePath(getCanonicalCityPath(city));
    }

    for (const category of getCategoriesForCityRoute(city)) {
      addUniquePath(getCanonicalCityCategoryPath(city, category));
    }

    for (const { neighborhood } of cityNeighborhoods) {
      const neighborhoodLists = getListsForCityRoute(city, neighborhood);
      if (!neighborhoodLists.length) {
        continue;
      }

      addUniquePath(getCanonicalCityNeighborhoodPath(city, neighborhood));
      for (const category of getCategoriesForCityRoute(city, neighborhood)) {
        addUniquePath(getCanonicalCityCategoryPath(city, category, neighborhood));
      }
      for (const guide of neighborhoodLists) {
        addUniquePath(getCanonicalGuidePath(city, guide, neighborhood));
      }
    }

    for (const guide of cityLists) {
      addUniquePath(getCanonicalGuidePath(city, guide));
    }
  }

  return params;
}
