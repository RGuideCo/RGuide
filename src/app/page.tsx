import type { Metadata } from "next";

import { HomeServerContent } from "@/components/home/HomeServerContent";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { SplitScreenClientLoader } from "@/components/home/SplitScreenClientLoader";
import { ProgressiveEnhancementShell } from "@/components/shared/ProgressiveEnhancementShell";
import { SITE_DESCRIPTION, SITE_SEARCH_NAME } from "@/lib/constants";
import { getContinentsWithDestinationDescriptions } from "@/lib/destination-descriptions";
import { getAbsoluteHref } from "@/lib/routes";
import { getLocalePublicationState } from "@/lib/i18n/server";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";
import { serializeJsonForHtml } from "@/lib/serialize-json";

export const revalidate = 21600;

export async function generateMetadata(): Promise<Metadata> {
  const spanish = await getLocalePublicationState("es");
  return {
    alternates: {
      canonical: "/",
      languages: spanish.indexable ? { en: "/", es: "/es", "x-default": "/" } : undefined,
    },
  };
}

const homePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": getAbsoluteHref("/#webpage"),
  name: `${SITE_SEARCH_NAME} - Curated City Travel Guides`,
  url: getAbsoluteHref("/"),
  description: SITE_DESCRIPTION,
  inLanguage: "en",
  isPartOf: {
    "@id": getAbsoluteHref("/#website"),
  },
  about: {
    "@id": getAbsoluteHref("/#organization"),
  },
  publisher: {
    "@id": getAbsoluteHref("/#organization"),
  },
};

export default async function HomePage() {
  const [continents, editorialGuides, spanish] = await Promise.all([
    getContinentsWithDestinationDescriptions(),
    getServerEditorialGuides(),
    getLocalePublicationState("es"),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonForHtml(homePageJsonLd) }}
      />
      <ProgressiveEnhancementShell
        fallback={<HomeServerContent continents={continents} editorialGuides={editorialGuides} />}
      >
        <SplitScreenClientLoader initialAppData={{ continents, guides: [] }} />
      </ProgressiveEnhancementShell>
      {spanish.indexable ? <LocaleSwitcher locale="en" links={{ en: "/", es: "/es" }} /> : null}
    </>
  );
}
