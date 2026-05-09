import type { MetadataRoute } from "next";

import { getCityDeepLinkStaticParams } from "@/lib/deep-link-routes";
import { getCategoryHref, getCreatorHref, getGuideHref } from "@/lib/routes";
import { SITE_URL } from "@/lib/constants";
import { CATEGORIES } from "@/lib/constants";
import { users } from "@/data";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";

export const revalidate = 900;

function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const editorialGuides = await getServerEditorialGuides();
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
    {
      url: absoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/terms"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/affiliate-disclosure"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const cityRoutes = getCityDeepLinkStaticParams(editorialGuides).map(({ segments }) => ({
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

  const guideRoutes = editorialGuides.map((list) => ({
    url: absoluteUrl(getGuideHref(list)),
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
