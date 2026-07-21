import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { SplitScreenClientLoader } from "@/components/home/SplitScreenClientLoader";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { LocalizedCityRouteSeoIndex } from "@/components/i18n/LocalizedCityRouteSeoIndex";
import { ProgressiveEnhancementShell } from "@/components/shared/ProgressiveEnhancementShell";
import { getContinentsWithDestinationDescriptions } from "@/lib/destination-descriptions";
import { getCityBySimpleSlug } from "@/lib/deep-link-routes";
import {
  getEnglishAlternateForLocalizedCityRoute,
  resolveLocalizedCityDeepLink,
} from "@/lib/i18n/deep-link-routes";
import {
  findDestinationRouteTranslation,
  getDestinationRouteTranslations,
  getLocalePublicationState,
} from "@/lib/i18n/server";
import { getCitiesFromContinents } from "@/lib/geography-tree";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";
import { serializeJsonForHtml } from "@/lib/serialize-json";
import { slugify } from "@/lib/utils";
import type { City } from "@/types";

interface SpanishCityPageProps {
  params: Promise<{ segments: string[] }>;
}

export const revalidate = 300;

function getRequestedCityName(segments: string[], cities: ReturnType<typeof getCitiesFromContinents>) {
  return getCityBySimpleSlug(segments[0] ?? "", cities)?.name;
}

function getLocalizedNeighborhoodTranslation(
  city: City | undefined,
  slug: string | undefined,
  translations: Awaited<ReturnType<typeof getDestinationRouteTranslations>>,
) {
  if (!city || !slug) return undefined;
  const neighborhoods = (city.subareas ?? []).flatMap((subarea) => [subarea, ...(subarea.subareas ?? [])]);
  return translations.find(
    (translation) =>
      translation.scope === "neighborhood" &&
      translation.slug === slug &&
      neighborhoods.some(
        (neighborhood) =>
          neighborhood.id === translation.legacyId || neighborhood.name === translation.sourceName,
      ),
  );
}

async function loadRoute(segments: string[]) {
  const [continents, destinationTranslations] = await Promise.all([
    getContinentsWithDestinationDescriptions({ locale: "es" }),
    getDestinationRouteTranslations("es"),
  ]);
  const cities = getCitiesFromContinents(continents);
  const routeTranslation = destinationTranslations.find(
    (translation) => translation.scope === "city" && translation.slug === segments[0],
  );
  const normalizedSegments = [...segments];
  if (routeTranslation) normalizedSegments[0] = slugify(routeTranslation.sourceName);
  const cityName = routeTranslation?.sourceName ?? getRequestedCityName(normalizedSegments, cities);
  const city = cityName ? cities.find((candidate) => candidate.name === cityName) : undefined;
  const neighborhoodTranslation = getLocalizedNeighborhoodTranslation(city, segments[1], destinationTranslations);
  if (neighborhoodTranslation) normalizedSegments[1] = slugify(neighborhoodTranslation.sourceName);
  const [guides, englishGuides, publication] = await Promise.all([
    getServerEditorialGuides({ cityName, locale: "es" }),
    getServerEditorialGuides({ cityName, locale: "en" }),
    getLocalePublicationState("es"),
  ]);
  const canonicalTranslation = city
    ? findDestinationRouteTranslation(destinationTranslations, { id: city.id, name: city.name, scope: "city" })
    : undefined;
  const route = resolveLocalizedCityDeepLink("es", normalizedSegments, {
    continents,
    cities,
    guides,
    localizedCitySlug: canonicalTranslation?.slug,
    localizedNeighborhoodSlug: neighborhoodTranslation?.slug,
    localizedCityName: canonicalTranslation?.displayName,
    localizedNeighborhoodName: neighborhoodTranslation?.displayName,
    destinationTranslations,
  });
  return {
    continents,
    cities,
    cityName,
    guides,
    englishGuides,
    publication,
    route,
    canonicalTranslation,
    neighborhoodTranslation,
    destinationTranslations,
  };
}

export async function generateMetadata({ params }: SpanishCityPageProps): Promise<Metadata> {
  const { segments } = await params;
  const { route, guides, englishGuides, publication } = await loadRoute(segments);
  if (!route) return { title: "Ciudad no encontrada", robots: { index: false, follow: true } };
  const englishPath = getEnglishAlternateForLocalizedCityRoute(route, englishGuides);
  const socialImageSource = route.guide?.photo ?? route.guide?.stops.find((stop) => stop.photo)?.photo ?? route.city.image;
  const indexable = publication.indexable && route.indexable && guides.length > 0;
  return {
    title: route.title,
    description: route.description,
    alternates: {
      canonical: route.canonicalPath,
      languages: { en: englishPath, es: route.canonicalPath, "x-default": englishPath },
    },
    robots: indexable ? undefined : { index: false, follow: true },
    openGraph: {
      title: route.title,
      description: route.description,
      url: route.canonicalPath,
      locale: "es_ES",
      type: "website",
      images: socialImageSource ? [{ url: socialImageSource, alt: route.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: route.title,
      description: route.description,
      images: socialImageSource ? [socialImageSource] : undefined,
    },
  };
}

export default async function SpanishCityPage({ params }: SpanishCityPageProps) {
  const { segments } = await params;
  const {
    continents,
    cityName,
    guides,
    englishGuides,
    route,
    canonicalTranslation,
    neighborhoodTranslation,
    destinationTranslations,
  } = await loadRoute(segments);
  if (!route) notFound();
  const requestedPath = `/es/ciudad/${segments.join("/")}`;
  if (requestedPath !== route.canonicalPath) permanentRedirect(route.canonicalPath);
  const englishPath = getEnglishAlternateForLocalizedCityRoute(route, englishGuides);

  return (
    <>
      {route.structuredData.map((item, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonForHtml(item) }} />
      ))}
      <ProgressiveEnhancementShell
        fallback={(
          <LocalizedCityRouteSeoIndex
            locale="es"
            route={route}
            guides={guides}
            localizedCitySlug={canonicalTranslation?.slug}
            localizedNeighborhoodSlug={neighborhoodTranslation?.slug}
            destinationTranslations={destinationTranslations}
          />
        )}
      >
        <SplitScreenClientLoader
          initialAppData={{ continents, guides, locale: "es" }}
          appDataScope={{ cityName, locale: "es" }}
          initialRouteState={{
            selection: route.selection,
            activeCategory: route.activeCategory,
            expandedGuideId: route.expandedGuideId,
          }}
          seoContent={{ h1: route.h1, intro: route.intro }}
          destinationTranslations={destinationTranslations}
        />
      </ProgressiveEnhancementShell>
      <LocaleSwitcher locale="es" links={{ en: englishPath, es: route.canonicalPath }} />
    </>
  );
}
