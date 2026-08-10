import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import { SplitScreenClientLoader } from "@/components/home/SplitScreenClientLoader";
import { ProgressiveEnhancementShell } from "@/components/shared/ProgressiveEnhancementShell";
import { getContinentsWithDestinationDescriptions } from "@/lib/destination-descriptions";
import {
  getCanonicalCityPath,
  getCountryDeepLinkStaticParams,
  getIndexableCitiesForCountry,
  resolveCountryDeepLink,
} from "@/lib/deep-link-routes";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";
import { serializeJsonForHtml } from "@/lib/serialize-json";
import { getLocalizedCountryPath } from "@/lib/i18n/paths";
import {
  findDestinationRouteTranslation,
  getDestinationRouteTranslations,
  getLocalePublicationState,
} from "@/lib/i18n/server";

interface CountryDeepLinkPageProps {
  params: Promise<{
    segments: string[];
  }>;
}

export const revalidate = 86400;

export async function generateStaticParams() {
  const [continents, editorialGuides] = await Promise.all([
    getContinentsWithDestinationDescriptions(),
    getServerEditorialGuides(),
  ]);
  return getCountryDeepLinkStaticParams(continents, editorialGuides);
}

export async function generateMetadata({ params }: CountryDeepLinkPageProps): Promise<Metadata> {
  const { segments } = await params;
  const [continents, editorialGuides, spanishPublication, destinationTranslations] = await Promise.all([
    getContinentsWithDestinationDescriptions(),
    getServerEditorialGuides(),
    getLocalePublicationState("es"),
    getDestinationRouteTranslations("es"),
  ]);
  const route = resolveCountryDeepLink(segments, { continents, guides: editorialGuides });

  if (!route) {
    return { title: "Country not found" };
  }

  const countryImageUrl = route.country.image
    ? `${route.country.image}${route.country.image.includes("?") ? "&" : "?"}title=1`
    : undefined;

  const countryTranslation = findDestinationRouteTranslation(destinationTranslations, {
    id: route.country.id,
    name: route.country.name,
    scope: "country",
  });
  const spanishPath = spanishPublication.indexable && countryTranslation
    ? getLocalizedCountryPath("es", route.country, countryTranslation.slug)
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
      images: countryImageUrl
        ? [
            {
              url: countryImageUrl,
              alt: route.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: route.title,
      description: route.description,
      images: countryImageUrl ? [countryImageUrl] : undefined,
    },
  };
}

export default async function CountryDeepLinkPage({ params }: CountryDeepLinkPageProps) {
  const { segments } = await params;
  const [continents, editorialGuides] = await Promise.all([
    getContinentsWithDestinationDescriptions(),
    getServerEditorialGuides(),
  ]);
  const route = resolveCountryDeepLink(segments, { continents, guides: editorialGuides });

  if (!route) {
    notFound();
  }

  const requestedPath = `/country/${segments.join("/")}`;
  if (requestedPath !== route.canonicalPath) {
    permanentRedirect(route.canonicalPath);
  }
  return (
    <>
      {route.structuredData.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonForHtml(item) }}
        />
      ))}
      <ProgressiveEnhancementShell
        fallback={
          <main className="mx-auto max-w-5xl px-6 py-12">
            <p className="text-sm font-medium text-slate-500">{route.continent.name}</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-950">{route.h1}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">{route.intro}</p>
            <section className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label={`${route.country.name} cities`}>
              {getIndexableCitiesForCountry(route.country, editorialGuides).map((city) => (
                  <Link
                    key={city.id}
                    href={getCanonicalCityPath(city)}
                    className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 hover:border-cyan-300 hover:text-cyan-800"
                  >
                    {city.name}
                  </Link>
                ))}
            </section>
          </main>
        }
      >
        <SplitScreenClientLoader
          initialAppData={{ continents, guides: [] }}
          appDataScope={{ countryName: route.country.name }}
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
    </>
  );
}
