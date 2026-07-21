import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import { SplitScreenClientLoader } from "@/components/home/SplitScreenClientLoader";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { ProgressiveEnhancementShell } from "@/components/shared/ProgressiveEnhancementShell";
import { getContinentsWithDestinationDescriptions } from "@/lib/destination-descriptions";
import { getIndexableCitiesForCountry, resolveCountryDeepLink } from "@/lib/deep-link-routes";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocalizedCityPath, getLocalizedCountryPath } from "@/lib/i18n/paths";
import {
  findDestinationRouteTranslation,
  getDestinationRouteTranslations,
  getLocalePublicationState,
} from "@/lib/i18n/server";
import { getAbsoluteHref } from "@/lib/routes";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";
import { slugify } from "@/lib/utils";

interface SpanishCountryPageProps { params: Promise<{ segments: string[] }> }
export const revalidate = 300;

async function loadRoute(segments: string[]) {
  const [continents, guides, publication, destinationTranslations] = await Promise.all([
    getContinentsWithDestinationDescriptions({ locale: "es" }),
    getServerEditorialGuides({ locale: "es" }),
    getLocalePublicationState("es"),
    getDestinationRouteTranslations("es"),
  ]);
  const routeTranslation = destinationTranslations.find(
    (translation) => translation.scope === "country" && translation.slug === segments[0],
  );
  const normalizedSegments = [...segments];
  if (routeTranslation) normalizedSegments[0] = slugify(routeTranslation.sourceName);
  const route = resolveCountryDeepLink(normalizedSegments, { continents, guides });
  const canonicalTranslation = route
    ? findDestinationRouteTranslation(destinationTranslations, { id: route.country.id, name: route.country.name, scope: "country" })
    : undefined;
  return { continents, guides, publication, route, canonicalTranslation, destinationTranslations };
}

export async function generateMetadata({ params }: SpanishCountryPageProps): Promise<Metadata> {
  const { segments } = await params;
  const { route, guides, publication, canonicalTranslation } = await loadRoute(segments);
  if (!route) return { title: "País no encontrado", robots: { index: false, follow: true } };
  const canonical = getLocalizedCountryPath("es", route.country, canonicalTranslation?.slug);
  const placeName = canonicalTranslation?.displayName ?? route.country.name;
  const title = `Guías de viaje de ${placeName}`;
  const description = route.country.description;
  return {
    title,
    description,
    alternates: { canonical, languages: { en: route.canonicalPath, es: canonical, "x-default": route.canonicalPath } },
    robots: publication.indexable && route.indexable && guides.length ? undefined : { index: false, follow: true },
    openGraph: { title, description, url: canonical, locale: "es_ES", type: "website" },
  };
}

export default async function SpanishCountryPage({ params }: SpanishCountryPageProps) {
  const { segments } = await params;
  const { continents, guides, route, canonicalTranslation, destinationTranslations } = await loadRoute(segments);
  if (!route) notFound();
  const canonical = getLocalizedCountryPath("es", route.country, canonicalTranslation?.slug);
  if (`/es/pais/${segments.join("/")}` !== canonical) permanentRedirect(canonical);
  const dictionary = getDictionary("es");
  const placeName = canonicalTranslation?.displayName ?? route.country.name;
  const continentName = findDestinationRouteTranslation(destinationTranslations, {
    id: route.continent.id,
    name: route.continent.name,
    scope: "continent",
  })?.displayName ?? route.continent.name;
  const title = `Guías de viaje de ${placeName}`;
  const jsonLd = { "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${getAbsoluteHref(canonical)}#webpage`, url: getAbsoluteHref(canonical), name: title, description: route.country.description, inLanguage: "es" };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProgressiveEnhancementShell fallback={
        <main className="mx-auto max-w-5xl px-6 py-12">
          <p className="text-sm font-medium text-slate-500">{continentName}</p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-950">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">{route.country.description}</p>
          <section className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label={dictionary.citiesLabel(placeName)}>
            {getIndexableCitiesForCountry(route.country, guides).map((city) => (
              <Link
                key={city.id}
                href={getLocalizedCityPath(
                  "es",
                  city,
                  findDestinationRouteTranslation(destinationTranslations, { id: city.id, name: city.name, scope: "city" })?.slug,
                )}
                className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 hover:border-orange-300 hover:text-orange-700"
              >
                {findDestinationRouteTranslation(destinationTranslations, { id: city.id, name: city.name, scope: "city" })?.displayName ?? city.name}
              </Link>
            ))}
          </section>
        </main>
      }>
        <SplitScreenClientLoader initialAppData={{ continents, guides: [], locale: "es" }} appDataScope={{ countryName: route.country.name, locale: "es" }} initialRouteState={{ selection: route.selection }} seoContent={{ h1: title, intro: route.country.description }} destinationTranslations={destinationTranslations} />
      </ProgressiveEnhancementShell>
      <LocaleSwitcher locale="es" links={{ en: route.canonicalPath, es: canonical }} />
    </>
  );
}
