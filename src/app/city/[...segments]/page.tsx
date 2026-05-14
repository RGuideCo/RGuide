import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { SplitScreenClientLoader } from "@/components/home/SplitScreenClientLoader";
import { CityRouteSeoIndex } from "@/components/seo/CityRouteSeoIndex";
import { ProgressiveEnhancementShell } from "@/components/shared/ProgressiveEnhancementShell";
import { getContinentsWithDestinationDescriptions } from "@/lib/destination-descriptions";
import { getCityDeepLinkStaticParams, resolveCityDeepLink } from "@/lib/deep-link-routes";
import { getCitiesFromContinents } from "@/lib/geography-tree";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";

interface CityDeepLinkPageProps {
  params: Promise<{
    segments: string[];
  }>;
}

export const revalidate = 900;

export function generateStaticParams() {
  return getCityDeepLinkStaticParams();
}

export async function generateMetadata({ params }: CityDeepLinkPageProps): Promise<Metadata> {
  const { segments } = await params;
  const [continents, editorialGuides] = await Promise.all([
    getContinentsWithDestinationDescriptions(),
    getServerEditorialGuides(),
  ]);
  const route = resolveCityDeepLink(segments, {
    continents,
    cities: getCitiesFromContinents(continents),
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
  const [continents, editorialGuides] = await Promise.all([
    getContinentsWithDestinationDescriptions(),
    getServerEditorialGuides(),
  ]);
  const route = resolveCityDeepLink(segments, {
    continents,
    cities: getCitiesFromContinents(continents),
    guides: editorialGuides,
  });

  if (!route) {
    notFound();
  }

  const requestedPath = `/city/${segments.join("/")}`;
  if (route.guide && requestedPath !== route.canonicalPath) {
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
