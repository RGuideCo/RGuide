import type { MetadataRoute } from "next";

import { users } from "@/data";
import { CATEGORIES } from "@/lib/constants";
import { getContinentsWithDestinationDescriptions } from "@/lib/destination-descriptions";
import {
  getCityDeepLinkStaticParams,
  getLatestGuideLastModified,
  isIndexableEditorialGuide,
  resolveCityDeepLink,
  resolveContinentDeepLink,
  resolveCountryDeepLink,
} from "@/lib/deep-link-routes";
import { getCitiesFromContinents } from "@/lib/geography-tree";
import { getAbsoluteHref, getCategoryHref, getCreatorHref } from "@/lib/routes";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";
import { slugify } from "@/lib/utils";

export const revalidate = 86400;

function createSitemapEntry(path: string, lastModified?: string): MetadataRoute.Sitemap[number] {
  return {
    url: getAbsoluteHref(path),
    ...(lastModified ? { lastModified } : {}),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [continents, editorialGuides] = await Promise.all([
    getContinentsWithDestinationDescriptions(),
    getServerEditorialGuides(),
  ]);
  const cities = getCitiesFromContinents(continents);
  const indexableGuides = editorialGuides.filter(isIndexableEditorialGuide);
  const staticRoutes: MetadataRoute.Sitemap = [
    createSitemapEntry("/", getLatestGuideLastModified(indexableGuides)),
    createSitemapEntry("/about"),
    createSitemapEntry("/contact"),
    createSitemapEntry("/privacy"),
    createSitemapEntry("/terms"),
    createSitemapEntry("/affiliate-disclosure"),
  ];

  const cityRoutes = getCityDeepLinkStaticParams(editorialGuides, cities).flatMap(({ segments }) => {
    const route = resolveCityDeepLink(segments, {
      continents,
      cities,
      guides: editorialGuides,
    });

    return route?.indexable ? [createSitemapEntry(route.canonicalPath, route.lastModified)] : [];
  });

  const continentRoutes = continents.flatMap((continent) => {
    const route = resolveContinentDeepLink([slugify(continent.name)], {
      continents,
      guides: editorialGuides,
    });

    return route?.indexable ? [createSitemapEntry(route.canonicalPath, route.lastModified)] : [];
  });

  const countryRoutes = continents.flatMap((continent) =>
    continent.countries.flatMap((country) => {
      const route = resolveCountryDeepLink([slugify(country.name)], {
        continents,
        guides: editorialGuides,
      });

      return route?.indexable ? [createSitemapEntry(route.canonicalPath, route.lastModified)] : [];
    }),
  );

  const categoryRoutes = CATEGORIES.flatMap((category) => {
    const guides = indexableGuides.filter((guide) => guide.category === category);
    return guides.length >= 2
      ? [createSitemapEntry(getCategoryHref(category), getLatestGuideLastModified(guides))]
      : [];
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

  return [...staticRoutes, ...continentRoutes, ...countryRoutes, ...cityRoutes, ...categoryRoutes, ...creatorRoutes];
}
