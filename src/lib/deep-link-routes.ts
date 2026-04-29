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

export function getCanonicalGuidePath(
  city: Pick<City, "name">,
  guide: Pick<MapList, "slug" | "category">,
  neighborhood?: Pick<SubArea, "name">,
) {
  return `${getCanonicalCityCategoryPath(city, guide.category, neighborhood)}/${guide.slug}`;
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
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
    .toLowerCase();
}

function getListsForCityRoute(city: City, neighborhood?: SubArea, category?: ListCategory) {
  const neighborhoodKey = normalizeNeighborhoodName(neighborhood?.name);

  return mapLists.filter((list) => {
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
      name: list.title,
      url: getCanonicalGuidePath(
        { name: list.location.city ?? "" },
        list,
        list.location.neighborhood ? { name: list.location.neighborhood } : undefined,
      ),
    })),
  };
}

function buildGuideData(guide: MapList, canonicalPath: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: guide.title,
    description: guide.description,
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
    guide = candidateLists.find((list) => list.slug === guideSlug || slugify(list.title) === guideSlug);
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
  const lists = getListsForCityRoute(city, neighborhood, category);
  const canonicalPath = guide
    ? getCanonicalGuidePath(city, guide, neighborhood)
    : category
      ? getCanonicalCityCategoryPath(city, category, neighborhood)
      : neighborhood
        ? getCanonicalCityNeighborhoodPath(city, neighborhood)
        : getCanonicalCityPath(city);

  const placeLabel = neighborhood ? `${neighborhood.name}, ${city.name}` : city.name;
  const h1 = guide
    ? `${guide.title} in ${placeLabel}`
    : category
      ? `${category} in ${placeLabel}`
      : neighborhood
        ? `${neighborhood.name}, ${city.name}`
        : `${city.name} guides`;
  const title = guide
    ? `${guide.title} in ${placeLabel}`
    : category
      ? `${category} guides in ${placeLabel}`
      : neighborhood
        ? `${neighborhood.name}, ${city.name} guides`
        : `${city.name} travel guides`;
  const description = guide
    ? guide.description
    : category
      ? `Curated ${category.toLowerCase()} Google Maps lists for ${placeLabel}, including local favorites and places worth saving.`
      : neighborhood?.description
        ? `${neighborhood.description} Browse curated Google Maps lists for ${placeLabel}.`
        : `Browse curated Google Maps lists for ${placeLabel}, with guides for food, nightlife, culture, nature, stays, and activities.`;
  const intro = guide
    ? guide.description
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
