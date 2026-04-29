import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { SplitScreenSection } from "@/components/home/SplitScreenSection";
import { CityRouteSeoIndex } from "@/components/seo/CityRouteSeoIndex";
import { getContinents } from "@/lib/mock-data";
import { getCityDeepLinkStaticParams, resolveCityDeepLink } from "@/lib/deep-link-routes";

interface CityDeepLinkPageProps {
  params: Promise<{
    segments: string[];
  }>;
}

export function generateStaticParams() {
  return getCityDeepLinkStaticParams();
}

export async function generateMetadata({ params }: CityDeepLinkPageProps): Promise<Metadata> {
  const { segments } = await params;
  const route = resolveCityDeepLink(segments);

  if (!route) {
    return { title: "City not found" };
  }

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
          url: route.city.image,
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
  const route = resolveCityDeepLink(segments);

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
      <SplitScreenSection
        continents={getContinents()}
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
      <CityRouteSeoIndex route={route} />
    </>
  );
}
