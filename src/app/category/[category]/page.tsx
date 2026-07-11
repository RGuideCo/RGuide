import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CategoryCard } from "@/components/cards/CategoryCard";
import { CATEGORIES } from "@/lib/constants";
import { getCanonicalGuidePath, getGuideSeoTitle, isIndexableEditorialGuide } from "@/lib/deep-link-routes";
import { getCategoryLabel } from "@/lib/mock-data";
import { getAbsoluteHref, getCategoryHref, getGuideHref } from "@/lib/routes";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";
import type { ListCategory } from "@/types";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

const CATEGORY_INTROS: Record<ListCategory, string> = {
  Food:
    "Browse RGuide restaurant and food guides by city and neighborhood, from London fine dining and Shoreditch restaurants to market routes, casual counters, and destination meals worth planning around.",
  Nightlife:
    "Find bars, pubs, clubs, cocktail rooms, and nightlife guides organized by city, neighborhood, late-night energy, and the kind of night travelers are actually trying to build.",
  Nature:
    "Explore parks, gardens, waterfronts, viewpoints, and outdoor routes that help travelers balance museums, restaurants, nightlife, and city walking with real breathing room.",
  Culture:
    "Browse museum, gallery, landmark, theatre, design, and neighborhood culture guides with routes that make the city easier to understand, not just harder to schedule.",
  Stay:
    "Compare hotel and hostel guides by city and neighborhood, including Barcelona hostels, Madrid hotels, London hostels, and practical stay advice for transit, nightlife, value, and first-time trips.",
  Activities:
    "Plan things to do with city itineraries, weekend routes, one-day plans, and activity guides that connect restaurants, culture, parks, nightlife, and neighborhood pacing.",
  Routes:
    "Follow curated city routes and travel sequences built for practical movement through neighborhoods, sights, food stops, and places worth saving along the way.",
  Essentials:
    "Use essential city-planning guides for practical travel context, neighborhood fit, stay decisions, and the basic choices that shape the rest of a trip.",
};

const CATEGORY_META_TITLES: Record<ListCategory, string> = {
  Food: "Restaurant & Food Guides by City",
  Nightlife: "Bar & Nightlife Guides by City",
  Nature: "Park & Nature Guides by City",
  Culture: "Museum & Culture Guides by City",
  Stay: "Hotel & Hostel Guides by City",
  Activities: "Things to Do & City Itineraries",
  Routes: "Walking Routes & City Itineraries",
  Essentials: "City Travel Tips & Essentials",
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const label = getCategoryLabel(category);

  if (!label) {
    return {
      title: "Category not found",
    };
  }


  const editorialGuides = await getServerEditorialGuides();
  const indexableGuides = editorialGuides.filter(isIndexableEditorialGuide);
  const lists = indexableGuides.filter((list) => list.category === label);
  const title = CATEGORY_META_TITLES[label];
  const description = CATEGORY_INTROS[label];

  return {
    title,
    description,
    alternates: {
      canonical: getCategoryHref(label),
    },
    robots: lists.length >= 2
      ? undefined
      : {
          index: false,
          follow: true,
        },
    openGraph: {
      title,
      description,
      url: getCategoryHref(label),
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const label = getCategoryLabel(category);

  if (!label) {
    notFound();
  }

  const editorialGuides = await getServerEditorialGuides();
  const indexableGuides = editorialGuides.filter(isIndexableEditorialGuide);
  const lists = indexableGuides.filter((list) => list.category === label);
  const canonicalPath = getCategoryHref(label);
  const categoryJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${getAbsoluteHref(canonicalPath)}#webpage`,
    name: CATEGORY_META_TITLES[label],
    description: CATEGORY_INTROS[label],
    url: getAbsoluteHref(canonicalPath),
    isPartOf: {
      "@id": getAbsoluteHref("/#website"),
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: lists.length,
      itemListElement: lists.slice(0, 50).map((list, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: getGuideSeoTitle(
          list,
          { name: list.location.city ?? "" },
          list.location.neighborhood ? { name: list.location.neighborhood } : undefined,
        ),
        url: getAbsoluteHref(
          list.location.scope === "city" && list.location.city
            ? getCanonicalGuidePath(
                { name: list.location.city },
                list,
                list.location.neighborhood ? { name: list.location.neighborhood } : undefined,
                editorialGuides,
              )
            : getGuideHref(list),
        ),
      })),
    },
  };

  return (
    <div className="page-shell py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd) }}
      />
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">Category</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">{CATEGORY_META_TITLES[label]}</h1>
        <p className="mt-3 text-slate-600">{CATEGORY_INTROS[label]}</p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {CATEGORIES.map((item) => (
          <CategoryCard
            key={item}
            category={item}
            count={indexableGuides.filter((list) => list.category === item).length}
          />
        ))}
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {lists.map((list) => {
          const href =
            list.location.scope === "city" && list.location.city
              ? getCanonicalGuidePath(
                  { name: list.location.city },
                  list,
                  list.location.neighborhood ? { name: list.location.neighborhood } : undefined,
                  editorialGuides,
                )
              : getGuideHref(list);
          const title =
            list.location.scope === "city" && list.location.city
              ? getGuideSeoTitle(
                  list,
                  { name: list.location.city },
                  list.location.neighborhood ? { name: list.location.neighborhood } : undefined,
                )
              : list.title;

          return (
            <article key={list.id} className="rounded-lg border border-slate-950/10 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {[list.location.neighborhood, list.location.city, list.location.country].filter(Boolean).join(" / ")}
              </p>
              <h2 className="mt-2 text-lg font-semibold leading-6 text-slate-950">
                <Link href={href} className="hover:text-orange-700">
                  {title}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{list.description}</p>
              <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{list.stops.length} mapped stops</span>
                {list.stops.length ? (
                  <span> including {list.stops.slice(0, 3).map((stop) => stop.name).join(", ")}</span>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
