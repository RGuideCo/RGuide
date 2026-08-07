import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { SplitScreenClientLoader } from "@/components/home/SplitScreenClientLoader";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { CityRouteSeoIndex } from "@/components/seo/CityRouteSeoIndex";
import { ProgressiveEnhancementShell } from "@/components/shared/ProgressiveEnhancementShell";
import { getContinentsWithDestinationDescriptions } from "@/lib/destination-descriptions";
import { getCityBySimpleSlug, getCityDeepLinkStaticParams, resolveCityDeepLink } from "@/lib/deep-link-routes";
import { getCitiesFromContinents } from "@/lib/geography-tree";
import {
  getLocalizedCityCategoryPath,
  getLocalizedCityNeighborhoodPath,
  getLocalizedCityPath,
  getLocalizedGuidePath,
} from "@/lib/i18n/paths";
import {
  findDestinationRouteTranslation,
  getDestinationRouteTranslations,
  getLocalePublicationState,
} from "@/lib/i18n/server";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";
import { serializeJsonForHtml } from "@/lib/serialize-json";

interface CityDeepLinkPageProps {
  params: Promise<{
    segments: string[];
  }>;
}

export const revalidate = 86400;

export function generateStaticParams() {
  return getCityDeepLinkStaticParams();
}

function getRequestedCityName(segments: string[], cities: ReturnType<typeof getCitiesFromContinents>) {
  const citySlug = segments[0];
  const nestedCitySlug = segments.length >= 3 ? segments[2] : undefined;
  return (
    (citySlug ? getCityBySimpleSlug(citySlug, cities) : undefined) ??
    (nestedCitySlug ? getCityBySimpleSlug(nestedCitySlug, cities) : undefined)
  )?.name;
}

function getSpanishAlternatePath(
  route: NonNullable<ReturnType<typeof resolveCityDeepLink>>,
  spanishGuides: Awaited<ReturnType<typeof getServerEditorialGuides>>,
  localizedCitySlug?: string,
) {
  if (route.guide) {
    const translatedGuide = spanishGuides.find((guide) => guide.id === route.guide?.id);
    return translatedGuide
      ? getLocalizedGuidePath("es", route.city, translatedGuide, route.neighborhood, localizedCitySlug)
      : null;
  }
  if (route.category) return getLocalizedCityCategoryPath("es", route.city, route.category, route.neighborhood, localizedCitySlug);
  if (route.neighborhood) return getLocalizedCityNeighborhoodPath("es", route.city, route.neighborhood, localizedCitySlug);
  return getLocalizedCityPath("es", route.city, localizedCitySlug);
}

export async function generateMetadata({ params }: CityDeepLinkPageProps): Promise<Metadata> {
  const { segments } = await params;
  const continents = await getContinentsWithDestinationDescriptions();
  const cities = getCitiesFromContinents(continents);
  const requestedCityName = getRequestedCityName(segments, cities);
  const editorialGuides = await getServerEditorialGuides({
    cityName: requestedCityName,
    bypassCache: true,
  });
  const [spanishGuides, spanishPublication, destinationTranslations] = await Promise.all([
    getServerEditorialGuides({ cityName: requestedCityName, locale: "es", bypassCache: true }),
    getLocalePublicationState("es"),
    getDestinationRouteTranslations("es"),
  ]);
  const route = resolveCityDeepLink(segments, {
    continents,
    cities,
    guides: editorialGuides,
  });

  if (!route) {
    return { title: "City not found" };
  }

  const socialImageSource =
    route.guide?.photo ?? route.guide?.stops.find((stop) => Boolean(stop.photo))?.photo ?? route.city.image;
  const socialImageUrl = `${socialImageSource}${socialImageSource.includes("?") ? "&" : "?"}title=1`;
  const cityTranslation = findDestinationRouteTranslation(destinationTranslations, {
    id: route.city.id,
    name: route.city.name,
    scope: "city",
  });
  const spanishPath = spanishPublication.indexable
    ? getSpanishAlternatePath(route, spanishGuides, cityTranslation?.slug)
    : null;

  return {
    title: route.title,
    description: route.description,
    alternates: {
      canonical: route.canonicalPath,
      languages: spanishPath
        ? { en: route.canonicalPath, es: spanishPath, "x-default": route.canonicalPath }
        : undefined,
    },
    robots: route.indexable
      ? undefined
      : {
          index: false,
          follow: true,
        },
    openGraph: {
      title: route.title,
      description: route.description,
      url: route.canonicalPath,
      type: "website",
      images: [
        {
          url: socialImageUrl,
          alt: route.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: route.title,
      description: route.description,
      images: [socialImageUrl],
    },
  };
}

export default async function CityDeepLinkPage({ params }: CityDeepLinkPageProps) {
  const { segments } = await params;
  const continents = await getContinentsWithDestinationDescriptions();
  const cities = getCitiesFromContinents(continents);
  const requestedCityName = getRequestedCityName(segments, cities);
  const editorialGuides = await getServerEditorialGuides({
    cityName: requestedCityName,
    bypassCache: true,
  });
  const [spanishGuides, spanishPublication, destinationTranslations] = await Promise.all([
    getServerEditorialGuides({ cityName: requestedCityName, locale: "es", bypassCache: true }),
    getLocalePublicationState("es"),
    getDestinationRouteTranslations("es"),
  ]);
  const route = resolveCityDeepLink(segments, {
    continents,
    cities,
    guides: editorialGuides,
  });

  if (!route) {
    notFound();
  }

  const requestedPath = `/city/${segments.join("/")}`;
  if (requestedPath !== route.canonicalPath) {
    permanentRedirect(route.canonicalPath);
  }
  const cityTranslation = findDestinationRouteTranslation(destinationTranslations, {
    id: route.city.id,
    name: route.city.name,
    scope: "city",
  });
  const spanishPath = spanishPublication.indexable
    ? getSpanishAlternatePath(route, spanishGuides, cityTranslation?.slug)
    : null;

  return (
    <>
      {route.structuredData.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonForHtml(item) }}
        />
      ))}
      <ProgressiveEnhancementShell fallback={<CityRouteSeoIndex route={route} guides={editorialGuides} />}>
        <SplitScreenClientLoader
          initialAppData={{ continents, guides: editorialGuides }}
          appDataScope={{ cityName: requestedCityName }}
          initialRouteState={{
            selection: route.selection,
            activeCategory: route.activeCategory,
            expandedGuideId: route.expandedGuideId,
          }}
          seoContent={{
            h1: route.h1,
            intro: route.intro,
          }}
        />
      </ProgressiveEnhancementShell>
      {spanishPath ? (
        <LocaleSwitcher locale="en" links={{ en: route.canonicalPath, es: spanishPath }} />
      ) : null}
    </>
  );
}
