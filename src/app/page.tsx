import { HomeServerContent } from "@/components/home/HomeServerContent";
import { SplitScreenClientLoader } from "@/components/home/SplitScreenClientLoader";
import { ProgressiveEnhancementShell } from "@/components/shared/ProgressiveEnhancementShell";
import { SITE_DESCRIPTION, SITE_SEARCH_NAME } from "@/lib/constants";
import { getContinentsWithDestinationDescriptions } from "@/lib/destination-descriptions";
import { getAbsoluteHref } from "@/lib/routes";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";

export const revalidate = 21600;

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
  const [continents, editorialGuides] = await Promise.all([
    getContinentsWithDestinationDescriptions(),
    getServerEditorialGuides(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageJsonLd) }}
      />
      <ProgressiveEnhancementShell
        fallback={<HomeServerContent continents={continents} editorialGuides={editorialGuides} />}
      >
        <SplitScreenClientLoader initialAppData={{ continents, guides: [] }} />
      </ProgressiveEnhancementShell>
    </>
  );
}
