import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryCard } from "@/components/cards/CategoryCard";
import { MapListCard } from "@/components/cards/MapListCard";
import { CATEGORIES } from "@/lib/constants";
import { getCanonicalGuidePath, getGuideSeoTitle } from "@/lib/deep-link-routes";
import { getCategoryLabel } from "@/lib/mock-data";
import { getCategoryHref, getGuideHref } from "@/lib/routes";
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

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const label = getCategoryLabel(category);

  if (!label) {
    return {
      title: "Category not found",
    };
  }

  return {
    title: `${label} Guides`,
    description: `Browse curated ${label.toLowerCase()} travel guides across RGuide destinations.`,
    alternates: {
      canonical: getCategoryHref(label),
    },
    openGraph: {
      title: `${label} Guides`,
      description: `Browse curated ${label.toLowerCase()} travel guides across RGuide destinations.`,
      url: getCategoryHref(label),
      type: "website",
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
  const lists = editorialGuides.filter((list) => list.category === label);

  return (
    <div className="page-shell py-10">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">Category</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">{label}</h1>
        <p className="mt-3 text-slate-600">{CATEGORY_INTROS[label]}</p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {CATEGORIES.map((item) => (
          <CategoryCard
            key={item}
            category={item}
            count={editorialGuides.filter((list) => list.category === item).length}
          />
        ))}
      </div>
      <div className="mt-8 space-y-4">
        {lists.map((list) => (
          <article key={list.id} className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                <a
                  href={
                    list.location.scope === "city" && list.location.city
                      ? getCanonicalGuidePath(
                          { name: list.location.city },
                          list,
                          list.location.neighborhood ? { name: list.location.neighborhood } : undefined,
                          editorialGuides,
                        )
                      : getGuideHref(list)
                  }
                  className="hover:text-orange-700"
                >
                  {list.location.scope === "city" && list.location.city
                    ? getGuideSeoTitle(
                        list,
                        { name: list.location.city },
                        list.location.neighborhood ? { name: list.location.neighborhood } : undefined,
                      )
                    : list.title}
                </a>
              </h2>
              <p className="mt-1 text-sm text-slate-600">{list.description}</p>
            </div>
            <MapListCard list={list} />
          </article>
        ))}
      </div>
    </div>
  );
}
