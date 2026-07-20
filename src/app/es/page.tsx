import type { Metadata } from "next";

import { LocalizedHomeServerContent } from "@/components/i18n/LocalizedHomeServerContent";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { SplitScreenClientLoader } from "@/components/home/SplitScreenClientLoader";
import { ProgressiveEnhancementShell } from "@/components/shared/ProgressiveEnhancementShell";
import { getContinentsWithDestinationDescriptions } from "@/lib/destination-descriptions";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import { getDestinationRouteTranslations, getLocalePublicationState } from "@/lib/i18n/server";
import { getAbsoluteHref } from "@/lib/routes";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";

export const revalidate = 21600;

export async function generateMetadata(): Promise<Metadata> {
  const publication = await getLocalePublicationState("es");
  return {
    title: "Guías de viaje urbanas seleccionadas",
    description: DICTIONARIES.es.siteDescription,
    alternates: {
      canonical: "/es",
      languages: { en: "/", es: "/es", "x-default": "/" },
    },
    robots: publication.indexable ? undefined : { index: false, follow: true },
    openGraph: {
      title: "RGuide | Guías de viaje urbanas seleccionadas",
      description: DICTIONARIES.es.siteDescription,
      url: "/es",
      locale: "es_ES",
      type: "website",
    },
  };
}

export default async function SpanishHomePage() {
  const [continents, editorialGuides, destinationTranslations] = await Promise.all([
    getContinentsWithDestinationDescriptions({ locale: "es" }),
    getServerEditorialGuides({ locale: "es" }),
    getDestinationRouteTranslations("es"),
  ]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${getAbsoluteHref("/es")}#webpage`,
    name: "RGuide - Guías de viaje urbanas seleccionadas",
    url: getAbsoluteHref("/es"),
    description: DICTIONARIES.es.siteDescription,
    inLanguage: "es",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProgressiveEnhancementShell
        fallback={
          <LocalizedHomeServerContent
            locale="es"
            continents={continents}
            editorialGuides={editorialGuides}
            destinationTranslations={destinationTranslations}
          />
        }
      >
        <SplitScreenClientLoader
          initialAppData={{ continents, guides: editorialGuides, locale: "es" }}
          appDataScope={{ locale: "es" }}
          destinationTranslations={destinationTranslations}
        />
      </ProgressiveEnhancementShell>
      <LocaleSwitcher locale="es" links={{ en: "/", es: "/es" }} />
    </>
  );
}
