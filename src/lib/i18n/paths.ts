import {
  DEFAULT_LOCALE,
  getLocalePrefix,
  getLocalizedCategorySlug,
  ROUTE_SEGMENTS,
  type AppLocale,
} from "@/lib/i18n/config";
import { slugify } from "@/lib/utils";
import type { City, Continent, Country, MapList, SubArea } from "@/types";

function withLocale(locale: AppLocale, path: string) {
  return `${getLocalePrefix(locale)}${path}` || "/";
}

export function getLocalizedHomePath(locale: AppLocale) {
  return getLocalePrefix(locale) || "/";
}

export function getLocalizedCityPath(locale: AppLocale, city: Pick<City, "name">, localizedSlug?: string) {
  return withLocale(locale, `/${ROUTE_SEGMENTS[locale].city}/${localizedSlug ?? slugify(city.name)}`);
}

export function getLocalizedCategoryIndexPath(locale: AppLocale, category: MapList["category"]) {
  return withLocale(locale, `/${ROUTE_SEGMENTS[locale].category}/${getLocalizedCategorySlug(locale, category)}`);
}

export function getLocalizedCountryPath(locale: AppLocale, country: Pick<Country, "name">, localizedSlug?: string) {
  return withLocale(locale, `/${ROUTE_SEGMENTS[locale].country}/${localizedSlug ?? slugify(country.name)}`);
}

export function getLocalizedContinentPath(
  locale: AppLocale,
  continent: Pick<Continent, "name">,
  localizedSlug?: string,
) {
  return withLocale(locale, `/${ROUTE_SEGMENTS[locale].continent}/${localizedSlug ?? slugify(continent.name)}`);
}

export function getLocalizedCityNeighborhoodPath(
  locale: AppLocale,
  city: Pick<City, "name">,
  neighborhood: Pick<SubArea, "name">,
  localizedCitySlug?: string,
  localizedNeighborhoodSlug?: string,
) {
  return `${getLocalizedCityPath(locale, city, localizedCitySlug)}/${localizedNeighborhoodSlug ?? slugify(neighborhood.name)}`;
}

export function getLocalizedCityCategoryPath(
  locale: AppLocale,
  city: Pick<City, "name">,
  category: MapList["category"],
  neighborhood?: Pick<SubArea, "name">,
  localizedCitySlug?: string,
  localizedNeighborhoodSlug?: string,
) {
  const base = neighborhood
    ? getLocalizedCityNeighborhoodPath(locale, city, neighborhood, localizedCitySlug, localizedNeighborhoodSlug)
    : getLocalizedCityPath(locale, city, localizedCitySlug);
  return `${base}/${getLocalizedCategorySlug(locale, category)}`;
}

export function getLocalizedGuidePath(
  locale: AppLocale,
  city: Pick<City, "name">,
  guide: Pick<MapList, "category" | "seoSlug" | "slug">,
  neighborhood?: Pick<SubArea, "name">,
  localizedCitySlug?: string,
  localizedNeighborhoodSlug?: string,
) {
  return `${getLocalizedCityCategoryPath(locale, city, guide.category, neighborhood, localizedCitySlug, localizedNeighborhoodSlug)}/${guide.seoSlug ?? guide.slug}`;
}

export function getLocalizedStaticPath(locale: AppLocale, key: keyof (typeof ROUTE_SEGMENTS)["en"]) {
  if (locale === DEFAULT_LOCALE && key === "city") {
    return `/${ROUTE_SEGMENTS.en.city}`;
  }
  return withLocale(locale, `/${ROUTE_SEGMENTS[locale][key]}`);
}
