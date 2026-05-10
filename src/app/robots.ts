import type { MetadataRoute } from "next";

import { getAbsoluteHref } from "@/lib/routes";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: getAbsoluteHref("/sitemap.xml"),
  };
}
