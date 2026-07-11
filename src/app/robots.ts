import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";
import { getAbsoluteHref } from "@/lib/routes";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: getAbsoluteHref("/sitemap.xml"),
    host: SITE_URL,
  };
}
