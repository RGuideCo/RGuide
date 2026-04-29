import type { MetadataRoute } from "next";

import { getCityDeepLinkStaticParams } from "@/lib/deep-link-routes";
import { getCategoryHref, getCreatorHref, getListHref } from "@/lib/routes";
import { SITE_URL } from "@/lib/constants";
import { CATEGORIES } from "@/lib/constants";
import { mapLists, users } from "@/data";

function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/submit"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const cityRoutes = getCityDeepLinkStaticParams().map(({ segments }) => ({
    url: absoluteUrl(`/city/${segments.join("/")}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: segments.length >= 4 ? 0.75 : segments.length >= 3 ? 0.8 : 0.85,
  }));

  const categoryRoutes = CATEGORIES.map((category) => ({
    url: absoluteUrl(getCategoryHref(category)),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const guideRoutes = mapLists.map((list) => ({
    url: absoluteUrl(getListHref(list)),
    lastModified: new Date(list.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.55,
  }));

  const creatorRoutes = users.map((user) => ({
    url: absoluteUrl(getCreatorHref(user)),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.45,
  }));

  return [...staticRoutes, ...cityRoutes, ...categoryRoutes, ...guideRoutes, ...creatorRoutes];
}
