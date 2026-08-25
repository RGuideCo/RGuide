import {
  getCanonicalGuidePath,
  getIndexableListsForCityRoute,
  normalizeRouteNeighborhoodName,
  resolveCityDeepLink,
  type CityDeepLinkResolution,
} from "@/lib/deep-link-routes";
import { getAbsoluteHref } from "@/lib/routes";
import {
  DEFAULT_LOCALE,
  getCategoryFromLocalizedSlug,
  type AppLocale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  getLocalizedCityCategoryPath,
  getLocalizedCityNeighborhoodPath,
  getLocalizedCityPath,
  getLocalizedGuidePath,
} from "@/lib/i18n/paths";
import { slugify } from "@/lib/utils";
import type { DestinationRouteTranslation } from "@/lib/i18n/types";
import type { City, Continent, MapList } from "@/types";

function normalizePlaceLabel(value?: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase();
}

function getLocalizedGuideTitle(
  guide: MapList,
  cityName: string,
  neighborhoodName?: string,
) {
  const title = guide.seoTitle?.trim() || guide.title;
  const normalizedTitle = normalizePlaceLabel(title);
  const normalizedCity = normalizePlaceLabel(cityName);
  const normalizedNeighborhood = normalizePlaceLabel(neighborhoodName);

  if (normalizedCity && normalizedTitle.includes(normalizedCity)) {
    return title;
  }
  if (normalizedNeighborhood && normalizedTitle.includes(normalizedNeighborhood)) {
    return `${title}, ${cityName}`;
  }

  const placeLabel = neighborhoodName ? `${neighborhoodName}, ${cityName}` : cityName;
  return `${title} en ${placeLabel}`;
}

function normalizeLocalizedCitySegments(
  locale: AppLocale,
  rawSegments: string[],
  routeData: {
    continents?: Continent[];
    cities?: City[];
    destinationTranslations?: DestinationRouteTranslation[];
  },
) {
  if (locale === DEFAULT_LOCALE) {
    return rawSegments;
  }

  const segments = [...rawSegments];
  const translations = routeData.destinationTranslations ?? [];
  const cityTranslation = translations.find(
    (translation) => translation.scope === "city" && translation.slug === segments[0],
  );
  if (cityTranslation) segments[0] = slugify(cityTranslation.sourceName);

  const cities = routeData.cities ?? (routeData.continents ?? []).flatMap((continent) =>
    continent.countries.flatMap((country) => country.cities),
  );
  const city = cities.find((candidate) => slugify(candidate.name) === segments[0]);
  const neighborhoods = (city?.subareas ?? []).flatMap((subarea) => [subarea, ...(subarea.subareas ?? [])]);
  const neighborhoodTranslation = translations.find(
    (translation) =>
      translation.scope === "neighborhood" &&
      translation.slug === segments[1] &&
      neighborhoods.some(
        (neighborhood) =>
          neighborhood.id === translation.legacyId || neighborhood.name === translation.sourceName,
      ),
  );
  if (neighborhoodTranslation) segments[1] = slugify(neighborhoodTranslation.sourceName);

  const firstContentSegment = segments[1];
  const citywideCategory = firstContentSegment
    ? getCategoryFromLocalizedSlug(locale, firstContentSegment)
    : undefined;

  if (citywideCategory) {
    segments[1] = slugify(citywideCategory);
    return segments;
  }

  const neighborhoodCategory = segments[2]
    ? getCategoryFromLocalizedSlug(locale, segments[2])
    : undefined;
  if (neighborhoodCategory) {
    segments[2] = slugify(neighborhoodCategory);
  }

  return segments;
}

function localizedStructuredData(
  route: CityDeepLinkResolution,
  locale: AppLocale,
  localizedCityName?: string,
  localizedNeighborhoodName?: string,
) {
  const url = getAbsoluteHref(route.canonicalPath);
  const placeName = [
    localizedNeighborhoodName ?? route.neighborhood?.name,
    localizedCityName ?? route.city.name,
  ].filter(Boolean).join(", ");
  const page = {
    "@context": "https://schema.org",
    "@type": route.guide ? "Article" : "CollectionPage",
    "@id": `${url}#webpage`,
    url,
    name: route.title,
    headline: route.title,
    description: route.description,
    inLanguage: locale,
    about: {
      "@type": "Place",
      name: placeName,
    },
  };

  if (!route.guide) {
    return [page];
  }

  return [
    {
      ...page,
      datePublished: route.guide.createdAt,
      dateModified: route.guide.updatedAt ?? route.guide.createdAt,
      articleSection: route.guide.category,
      mainEntity: {
        "@type": "ItemList",
        name: route.guide.title,
        numberOfItems: route.guide.stops.length,
        itemListElement: route.guide.stops.map((stop, index) => ({
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
    },
  ];
}

function localizeResolution(
  route: CityDeepLinkResolution,
  locale: AppLocale,
  guides: MapList[],
  localizedCitySlug?: string,
  localizedNeighborhoodSlug?: string,
  localizedCityName?: string,
  localizedNeighborhoodName?: string,
): CityDeepLinkResolution {
  const dictionary = getDictionary(locale);
  const cityName = localizedCityName ?? route.city.name;
  const neighborhoodName =
    route.guide?.location.neighborhood ?? localizedNeighborhoodName ?? route.neighborhood?.name;
  const placeLabel = route.neighborhood
    ? `${neighborhoodName}, ${cityName}`
    : cityName;
  const matchingGuides = route.guide
    ? [route.guide]
    : guides.filter((guide) => {
        if (guide.location.city !== route.city.name) return false;
        if (route.category && guide.category !== route.category) return false;
        if (
          route.neighborhood &&
          normalizeRouteNeighborhoodName(guide.location.neighborhood) !==
            normalizeRouteNeighborhoodName(route.neighborhood.name)
        ) return false;
        return true;
      });
  const soleCategoryGuide = !route.guide && route.category && matchingGuides.length === 1
    ? matchingGuides[0]
    : undefined;
  const canonicalGuide = route.guide ?? soleCategoryGuide;
  const canonicalPath = canonicalGuide
    ? getLocalizedGuidePath(
        locale,
        route.city,
        canonicalGuide,
        route.neighborhood,
        localizedCitySlug,
        localizedNeighborhoodSlug,
      )
    : route.category
      ? getLocalizedCityCategoryPath(locale, route.city, route.category, route.neighborhood, localizedCitySlug, localizedNeighborhoodSlug)
      : route.neighborhood
        ? getLocalizedCityNeighborhoodPath(locale, route.city, route.neighborhood, localizedCitySlug, localizedNeighborhoodSlug)
        : getLocalizedCityPath(locale, route.city, localizedCitySlug);
  const guideCount = matchingGuides.length;
  const stopCount = matchingGuides.reduce((total, guide) => total + guide.stops.length, 0);
  const h1 = route.guide
    ? getLocalizedGuideTitle(route.guide, cityName, neighborhoodName)
    : route.category
      ? dictionary.categoryGuidesTitle(route.category, placeLabel)
      : route.neighborhood
        ? dictionary.neighborhoodGuidesTitle(
            neighborhoodName ?? route.neighborhood.name,
            cityName,
          )
        : dictionary.cityGuidesTitle(cityName);
  const intro = route.guide
    ? route.guide.seoDescription ?? route.guide.description
    : route.category || route.neighborhood
      ? dictionary.guideHubSummary(guideCount, stopCount, placeLabel)
      : route.city.description;
  const localized = {
    ...route,
    canonicalPath,
    title: h1,
    h1,
    description: intro,
    intro,
  };

  return {
    ...localized,
    structuredData: localizedStructuredData(
      localized,
      locale,
      localizedCityName,
      localizedNeighborhoodName,
    ),
  };
}

export function resolveLocalizedCityDeepLink(
  locale: AppLocale,
  rawSegments: string[],
  routeData: {
    continents?: Continent[];
    cities?: City[];
    guides?: MapList[];
    localizedCitySlug?: string;
    localizedNeighborhoodSlug?: string;
    localizedCityName?: string;
    localizedNeighborhoodName?: string;
    destinationTranslations?: DestinationRouteTranslation[];
  } = {},
) {
  const route = resolveCityDeepLink(normalizeLocalizedCitySegments(locale, rawSegments, routeData), routeData);
  return route
    ? localizeResolution(
        route,
        locale,
        routeData.guides ?? [],
        routeData.localizedCitySlug,
        routeData.localizedNeighborhoodSlug,
        routeData.localizedCityName,
        routeData.localizedNeighborhoodName,
      )
    : null;
}

export function getEnglishAlternateForLocalizedCityRoute(
  route: CityDeepLinkResolution,
  englishGuides: MapList[],
) {
  if (!route.guide) {
    if (route.category) {
      const categoryGuides = getIndexableListsForCityRoute(
        route.city,
        route.neighborhood,
        route.category,
        undefined,
        englishGuides,
      );
      if (categoryGuides.length === 1) {
        return getCanonicalGuidePath(route.city, categoryGuides[0], route.neighborhood, englishGuides);
      }
      return getLocalizedCityCategoryPath(DEFAULT_LOCALE, route.city, route.category, route.neighborhood);
    }
    if (route.neighborhood) {
      return getLocalizedCityNeighborhoodPath(DEFAULT_LOCALE, route.city, route.neighborhood);
    }
    return getLocalizedCityPath(DEFAULT_LOCALE, route.city);
  }

  const englishGuide = englishGuides.find((guide) => guide.id === route.guide?.id);
  return englishGuide
    ? getCanonicalGuidePath(route.city, englishGuide, route.neighborhood, englishGuides)
    : getLocalizedCityPath(DEFAULT_LOCALE, route.city);
}
