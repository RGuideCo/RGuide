import type { ListCategory } from "@/types";

export const DEFAULT_LOCALE = "en" as const;
export const SUPPORTED_LOCALES = ["en", "es"] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export interface LocaleDefinition {
  code: AppLocale;
  hreflang: string;
  label: string;
  nativeLabel: string;
  direction: "ltr" | "rtl";
  pathPrefix: string;
}

export const LOCALES: Record<AppLocale, LocaleDefinition> = {
  en: {
    code: "en",
    hreflang: "en",
    label: "English",
    nativeLabel: "English",
    direction: "ltr",
    pathPrefix: "",
  },
  es: {
    code: "es",
    hreflang: "es",
    label: "Spanish",
    nativeLabel: "Español",
    direction: "ltr",
    pathPrefix: "/es",
  },
};

export const ROUTE_SEGMENTS = {
  en: {
    city: "city",
    country: "country",
    continent: "continent",
    category: "category",
    list: "list",
    events: "events",
    venues: "venues",
    about: "about",
    contact: "contact",
    privacy: "privacy",
    terms: "terms",
    affiliateDisclosure: "affiliate-disclosure",
  },
  es: {
    city: "ciudad",
    country: "pais",
    continent: "continente",
    category: "categoria",
    list: "lista",
    events: "eventos",
    venues: "lugares",
    about: "acerca-de",
    contact: "contacto",
    privacy: "privacidad",
    terms: "terminos",
    affiliateDisclosure: "divulgacion-afiliados",
  },
} as const satisfies Record<AppLocale, Record<string, string>>;

export const CATEGORY_SLUGS: Record<AppLocale, Record<ListCategory, string>> = {
  en: {
    Food: "food",
    Nightlife: "nightlife",
    Nature: "nature",
    Culture: "culture",
    Stay: "stay",
    Activities: "activities",
    Routes: "routes",
    Essentials: "essentials",
  },
  es: {
    Food: "comida",
    Nightlife: "vida-nocturna",
    Nature: "naturaleza",
    Culture: "cultura",
    Stay: "alojamiento",
    Activities: "actividades",
    Routes: "rutas",
    Essentials: "informacion-esencial",
  },
};

const CATEGORY_BY_LOCALIZED_SLUG = Object.fromEntries(
  SUPPORTED_LOCALES.map((locale) => [
    locale,
    new Map(Object.entries(CATEGORY_SLUGS[locale]).map(([category, slug]) => [slug, category as ListCategory])),
  ]),
) as Record<AppLocale, Map<string, ListCategory>>;

export function isSupportedLocale(value: string | null | undefined): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale);
}

export function normalizeLocale(value: string | null | undefined): AppLocale {
  return isSupportedLocale(value) ? value : DEFAULT_LOCALE;
}

export function getCategoryFromLocalizedSlug(locale: AppLocale, slug: string) {
  return CATEGORY_BY_LOCALIZED_SLUG[locale].get(slug);
}

export function getLocalizedCategorySlug(locale: AppLocale, category: ListCategory) {
  return CATEGORY_SLUGS[locale][category];
}

export function getLocalePrefix(locale: AppLocale) {
  return LOCALES[locale].pathPrefix;
}
