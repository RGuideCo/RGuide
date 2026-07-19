import type { MetadataRoute } from "next";

import { users } from "@/data";
import { CATEGORIES } from "@/lib/constants";
import {
  getCityDeepLinkStaticParams,
  getLatestGuideLastModified,
  isIndexableEditorialGuide,
  resolveCityDeepLink,
  resolveContinentDeepLink,
  resolveCountryDeepLink,
} from "@/lib/deep-link-routes";
import { getCitiesFromContinents } from "@/lib/geography-tree";
import {
  getLocalizedCityCategoryPath,
  getLocalizedCityNeighborhoodPath,
  getLocalizedCityPath,
  getLocalizedCategoryIndexPath,
  getLocalizedContinentPath,
  getLocalizedCountryPath,
  getLocalizedGuidePath,
} from "@/lib/i18n/paths";
import {
  findDestinationRouteTranslation,
  getDestinationRouteTranslations,
  getLocalePublicationState,
  type DestinationRouteTranslation,
} from "@/lib/i18n/server";
import { getContinents } from "@/lib/mock-data";
import { getAbsoluteHref, getCategoryHref, getCreatorHref } from "@/lib/routes";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";
import { slugify } from "@/lib/utils";

// Guide publishing writes directly to Supabase, outside Next's cache lifecycle.
// Always build the sitemap from current published rows so new guides are
// discoverable on the next crawler request instead of up to a day later.
export const dynamic = "force-dynamic";
export const revalidate = 0;

function createSitemapEntry(
  path: string,
  lastModified?: string,
  languagePaths?: { en: string; es: string },
): MetadataRoute.Sitemap[number] {
  return {
    url: getAbsoluteHref(path),
    ...(lastModified ? { lastModified } : {}),
    ...(languagePaths
      ? {
          alternates: {
            languages: {
              en: getAbsoluteHref(languagePaths.en),
              es: getAbsoluteHref(languagePaths.es),
              "x-default": getAbsoluteHref(languagePaths.en),
            },
          },
        }
      : {}),
  };
}

function getSpanishCityRoutePath(
  route: NonNullable<ReturnType<typeof resolveCityDeepLink>>,
  spanishGuides: Awaited<ReturnType<typeof getServerEditorialGuides>>,
  destinationTranslations: DestinationRouteTranslation[],
) {
  const cityTranslation = findDestinationRouteTranslation(destinationTranslations, {
    id: route.city.id,
    name: route.city.name,
    scope: "city",
  });
  if (!cityTranslation) return null;
  const neighborhoodTranslation = route.neighborhood
    ? findDestinationRouteTranslation(destinationTranslations, {
        id: route.neighborhood.id,
        name: route.neighborhood.name,
        scope: "neighborhood",
      })
    : undefined;
  if (route.guide) {
    const guide = spanishGuides.find((candidate) => candidate.id === route.guide?.id);
    return guide
      ? getLocalizedGuidePath(
          "es",
          route.city,
          guide,
          route.neighborhood,
          cityTranslation.slug,
          neighborhoodTranslation?.slug,
        )
      : null;
  }
  if (route.category) {
    return getLocalizedCityCategoryPath(
      "es",
      route.city,
      route.category,
      route.neighborhood,
      cityTranslation.slug,
      neighborhoodTranslation?.slug,
    );
  }
  if (route.neighborhood) {
    return getLocalizedCityNeighborhoodPath(
      "es",
      route.city,
      route.neighborhood,
      cityTranslation.slug,
      neighborhoodTranslation?.slug,
    );
  }
  return getLocalizedCityPath("es", route.city, cityTranslation.slug);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const continents = getContinents();
  const [editorialGuides, spanishPublication, destinationTranslations] = await Promise.all([
    getServerEditorialGuides({ bypassCache: true }),
    getLocalePublicationState("es"),
    getDestinationRouteTranslations("es"),
  ]);
  const spanishGuides = spanishPublication.indexable
    ? await getServerEditorialGuides({ bypassCache: true, locale: "es" })
    : [];
  const cities = getCitiesFromContinents(continents);
  const indexableGuides = editorialGuides.filter(isIndexableEditorialGuide);
  const staticRoutes: MetadataRoute.Sitemap = [
    createSitemapEntry(
      "/",
      getLatestGuideLastModified(indexableGuides),
      spanishPublication.indexable ? { en: "/", es: "/es" } : undefined,
    ),
    ...(spanishPublication.indexable
      ? [createSitemapEntry("/es", getLatestGuideLastModified(spanishGuides), { en: "/", es: "/es" })]
      : []),
    createSitemapEntry("/about", undefined, spanishPublication.indexable ? { en: "/about", es: "/es/acerca-de" } : undefined),
    createSitemapEntry("/contact", undefined, spanishPublication.indexable ? { en: "/contact", es: "/es/contacto" } : undefined),
    createSitemapEntry("/privacy", undefined, spanishPublication.indexable ? { en: "/privacy", es: "/es/privacidad" } : undefined),
    createSitemapEntry("/terms", undefined, spanishPublication.indexable ? { en: "/terms", es: "/es/terminos" } : undefined),
    createSitemapEntry("/affiliate-disclosure", undefined, spanishPublication.indexable ? { en: "/affiliate-disclosure", es: "/es/divulgacion-afiliados" } : undefined),
    ...(spanishPublication.indexable
      ? [
          createSitemapEntry("/es/acerca-de", undefined, { en: "/about", es: "/es/acerca-de" }),
          createSitemapEntry("/es/contacto", undefined, { en: "/contact", es: "/es/contacto" }),
          createSitemapEntry("/es/privacidad", undefined, { en: "/privacy", es: "/es/privacidad" }),
          createSitemapEntry("/es/terminos", undefined, { en: "/terms", es: "/es/terminos" }),
          createSitemapEntry("/es/divulgacion-afiliados", undefined, { en: "/affiliate-disclosure", es: "/es/divulgacion-afiliados" }),
        ]
      : []),
  ];

  const cityRoutes = getCityDeepLinkStaticParams(editorialGuides, cities).flatMap(({ segments }) => {
    const route = resolveCityDeepLink(segments, {
      continents,
      cities,
      guides: editorialGuides,
    });

    if (!route?.indexable) return [];
    const spanishPath = spanishPublication.indexable
      ? getSpanishCityRoutePath(route, spanishGuides, destinationTranslations)
      : null;
    const languages = spanishPath ? { en: route.canonicalPath, es: spanishPath } : undefined;
    return [
      createSitemapEntry(route.canonicalPath, route.lastModified, languages),
      ...(spanishPath ? [createSitemapEntry(spanishPath, route.lastModified, languages)] : []),
    ];
  });

  const continentRoutes = continents.flatMap((continent) => {
    const route = resolveContinentDeepLink([slugify(continent.name)], {
      continents,
      guides: editorialGuides,
    });

    if (!route?.indexable) return [];
    const translation = findDestinationRouteTranslation(destinationTranslations, {
      id: continent.id,
      name: continent.name,
      scope: "continent",
    });
    const spanishPath = spanishPublication.indexable && translation
      ? getLocalizedContinentPath("es", continent, translation.slug)
      : null;
    const languages = spanishPath ? { en: route.canonicalPath, es: spanishPath } : undefined;
    return [
      createSitemapEntry(route.canonicalPath, route.lastModified, languages),
      ...(spanishPath ? [createSitemapEntry(spanishPath, route.lastModified, languages)] : []),
    ];
  });

  const countryRoutes = continents.flatMap((continent) =>
    continent.countries.flatMap((country) => {
      const route = resolveCountryDeepLink([slugify(country.name)], {
        continents,
        guides: editorialGuides,
      });

      if (!route?.indexable) return [];
      const translation = findDestinationRouteTranslation(destinationTranslations, {
        id: country.id,
        name: country.name,
        scope: "country",
      });
      const spanishPath = spanishPublication.indexable && translation
        ? getLocalizedCountryPath("es", country, translation.slug)
        : null;
      const languages = spanishPath ? { en: route.canonicalPath, es: spanishPath } : undefined;
      return [
        createSitemapEntry(route.canonicalPath, route.lastModified, languages),
        ...(spanishPath ? [createSitemapEntry(spanishPath, route.lastModified, languages)] : []),
      ];
    }),
  );

  const categoryRoutes = CATEGORIES.flatMap((category) => {
    const guides = indexableGuides.filter((guide) => guide.category === category);
    if (guides.length < 2) return [];
    const spanishCategoryGuides = spanishGuides.filter((guide) => guide.category === category);
    const spanishPath = spanishPublication.indexable && spanishCategoryGuides.length >= 2
      ? getLocalizedCategoryIndexPath("es", category)
      : null;
    const languages = spanishPath ? { en: getCategoryHref(category), es: spanishPath } : undefined;
    return [
      createSitemapEntry(getCategoryHref(category), getLatestGuideLastModified(guides), languages),
      ...(spanishPath
        ? [createSitemapEntry(spanishPath, getLatestGuideLastModified(spanishCategoryGuides), languages)]
        : []),
    ];
  });

  const creatorRoutes = users.flatMap((user) => {
    const creatorSlugs = new Set([slugify(user.id), slugify(user.name)]);
    const guides = indexableGuides.filter(
      (guide) => creatorSlugs.has(slugify(guide.creator.id)) || creatorSlugs.has(slugify(guide.creator.name)),
    );

    return guides.length
      ? [
          createSitemapEntry(
            getCreatorHref(user),
            getLatestGuideLastModified(guides),
          ),
        ]
      : [];
  });

  const entries = [...staticRoutes, ...continentRoutes, ...countryRoutes, ...cityRoutes, ...categoryRoutes, ...creatorRoutes];
  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}
