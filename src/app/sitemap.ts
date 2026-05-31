import type { MetadataRoute } from "next";

import { getCanonicalCountryPath, getCityDeepLinkStaticParams } from "@/lib/deep-link-routes";
import { getAbsoluteHref, getCategoryHref, getCreatorHref } from "@/lib/routes";
import { CATEGORIES } from "@/lib/constants";
import { users } from "@/data";
import { getContinentsWithDestinationDescriptions } from "@/lib/destination-descriptions";
import { getCitiesFromContinents } from "@/lib/geography-tree";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";

export const revalidate = 900;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [continents, editorialGuides] = await Promise.all([
    getContinentsWithDestinationDescriptions(),
    getServerEditorialGuides(),
  ]);
  const cities = getCitiesFromContinents(continents);
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: getAbsoluteHref("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: getAbsoluteHref("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: getAbsoluteHref("/contact"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: getAbsoluteHref("/privacy"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: getAbsoluteHref("/terms"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: getAbsoluteHref("/affiliate-disclosure"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const cityRoutes = getCityDeepLinkStaticParams(editorialGuides, cities).map(({ segments }) => ({
    url: getAbsoluteHref(`/city/${segments.join("/")}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: segments.length >= 4 ? 0.75 : segments.length >= 3 ? 0.8 : 0.85,
  }));

  const countryRoutes = continents.flatMap((continent) =>
    continent.countries.map((country) => ({
      url: getAbsoluteHref(getCanonicalCountryPath(country)),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  );

  const categoryRoutes = CATEGORIES.map((category) => ({
    url: getAbsoluteHref(getCategoryHref(category)),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const creatorRoutes = users.map((user) => ({
    url: getAbsoluteHref(getCreatorHref(user)),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.45,
  }));

  return [...staticRoutes, ...countryRoutes, ...cityRoutes, ...categoryRoutes, ...creatorRoutes];
}
