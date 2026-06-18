import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { SplitScreenClientLoader } from "@/components/home/SplitScreenClientLoader";
import { CityRouteSeoIndex } from "@/components/seo/CityRouteSeoIndex";
import { ProgressiveEnhancementShell } from "@/components/shared/ProgressiveEnhancementShell";
import { getContinentsWithDestinationDescriptions } from "@/lib/destination-descriptions";
import { getCityBySimpleSlug, getCityDeepLinkStaticParams, resolveCityDeepLink } from "@/lib/deep-link-routes";
import { getCitiesFromContinents } from "@/lib/geography-tree";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";

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

export async function generateMetadata({ params }: CityDeepLinkPageProps): Promise<Metadata> {
  const { segments } = await params;
  const continents = await getContinentsWithDestinationDescriptions();
  const cities = getCitiesFromContinents(continents);
  const requestedCityName = getRequestedCityName(segments, cities);
  const editorialGuides = await getServerEditorialGuides({
    cityName: requestedCityName,
  });
  const route = resolveCityDeepLink(segments, {
    continents,
    cities,
    guides: editorialGuides,
  });

  if (!route) {
    return { title: "City not found" };
  }

  const cityImageUrl = `${route.city.image}${route.city.image.includes("?") ? "&" : "?"}title=1`;

  return {
    title: route.title,
    description: route.description,
    alternates: {
      canonical: route.canonicalPath,
    },
    openGraph: {
      title: route.title,
      description: route.description,
      url: route.canonicalPath,
      type: "website",
      images: [
        {
          url: cityImageUrl,
          alt: route.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: route.title,
      description: route.description,
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
  });
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

  return (
    <>
      {route.structuredData.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
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
    </>
  );
}
