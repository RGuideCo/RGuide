import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import { SplitScreenClientLoader } from "@/components/home/SplitScreenClientLoader";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { ProgressiveEnhancementShell } from "@/components/shared/ProgressiveEnhancementShell";
import { getContinentsWithDestinationDescriptions } from "@/lib/destination-descriptions";
import { getIndexableCountriesForContinent, resolveContinentDeepLink } from "@/lib/deep-link-routes";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocalizedContinentPath, getLocalizedCountryPath } from "@/lib/i18n/paths";
import {
  findDestinationRouteTranslation,
  getDestinationRouteTranslations,
  getLocalePublicationState,
} from "@/lib/i18n/server";
import { getAbsoluteHref } from "@/lib/routes";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";
import { serializeJsonForHtml } from "@/lib/serialize-json";
import { slugify } from "@/lib/utils";

interface SpanishContinentPageProps { params: Promise<{ segments: string[] }> }
export const revalidate = 300;

async function loadRoute(segments: string[]) {
  const [continents, guides, publication, destinationTranslations] = await Promise.all([
    getContinentsWithDestinationDescriptions({ locale: "es" }),
    getServerEditorialGuides({ locale: "es" }),
    getLocalePublicationState("es"),
    getDestinationRouteTranslations("es"),
  ]);
  const routeTranslation = destinationTranslations.find(
    (translation) => translation.scope === "continent" && translation.slug === segments[0],
  );
  const normalizedSegments = [...segments];
  if (routeTranslation) normalizedSegments[0] = slugify(routeTranslation.sourceName);
  const route = resolveContinentDeepLink(normalizedSegments, { continents, guides });
  const canonicalTranslation = route
    ? findDestinationRouteTranslation(destinationTranslations, { id: route.continent.id, name: route.continent.name, scope: "continent" })
    : undefined;
  return { continents, guides, publication, route, canonicalTranslation, destinationTranslations };
}

export async function generateMetadata({ params }: SpanishContinentPageProps): Promise<Metadata> {
  const { segments } = await params;
  const { route, guides, publication, canonicalTranslation } = await loadRoute(segments);
  if (!route) return { title: "Continente no encontrado", robots: { index: false, follow: true } };
  const canonical = getLocalizedContinentPath("es", route.continent, canonicalTranslation?.slug);
  const placeName = canonicalTranslation?.displayName ?? route.continent.name;
  const title = `Guías de viaje de ${placeName}`;
  return {
    title,
    description: route.description,
    alternates: { canonical, languages: { en: route.canonicalPath, es: canonical, "x-default": route.canonicalPath } },
    robots: publication.indexable && route.indexable && guides.length ? undefined : { index: false, follow: true },
    openGraph: { title, description: route.description, url: canonical, locale: "es_ES", type: "website" },
  };
}

export default async function SpanishContinentPage({ params }: SpanishContinentPageProps) {
  const { segments } = await params;
  const { continents, guides, route, canonicalTranslation, destinationTranslations } = await loadRoute(segments);
  if (!route) notFound();
  const canonical = getLocalizedContinentPath("es", route.continent, canonicalTranslation?.slug);
  if (`/es/continente/${segments.join("/")}` !== canonical) permanentRedirect(canonical);
  const dictionary = getDictionary("es");
  const placeName = canonicalTranslation?.displayName ?? route.continent.name;
  const title = `Guías de viaje de ${placeName}`;
  const jsonLd = { "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${getAbsoluteHref(canonical)}#webpage`, url: getAbsoluteHref(canonical), name: title, description: route.description, inLanguage: "es" };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonForHtml(jsonLd) }} />
      <ProgressiveEnhancementShell fallback={
        <main className="mx-auto max-w-5xl px-6 py-12">
          <p className="text-sm font-medium text-slate-500">{dictionary.continentEyebrow}</p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-950">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">{route.intro}</p>
          <section className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label={dictionary.countriesLabel(placeName)}>
            {getIndexableCountriesForContinent(route.continent, guides).map((country) => (
              <Link
                key={country.id}
                href={getLocalizedCountryPath(
                  "es",
                  country,
                  findDestinationRouteTranslation(destinationTranslations, { id: country.id, name: country.name, scope: "country" })?.slug,
                )}
                className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 hover:border-orange-300 hover:text-orange-700"
              >
                {findDestinationRouteTranslation(destinationTranslations, { id: country.id, name: country.name, scope: "country" })?.displayName ?? country.name}
              </Link>
            ))}
          </section>
        </main>
      }>
        <SplitScreenClientLoader initialAppData={{ continents, guides: [], locale: "es" }} appDataScope={{ continentName: route.continent.name, locale: "es" }} initialRouteState={{ selection: route.selection }} seoContent={{ h1: title, intro: route.intro }} destinationTranslations={destinationTranslations} />
      </ProgressiveEnhancementShell>
      <LocaleSwitcher locale="es" links={{ en: route.canonicalPath, es: canonical }} />
    </>
  );
}
