import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryCard } from "@/components/cards/CategoryCard";
import { MapListCard } from "@/components/cards/MapListCard";
import { CATEGORIES } from "@/lib/constants";
import { getCategoryLabel, getListsForCategory } from "@/lib/mock-data";
import { mapLists } from "@/data";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const label = getCategoryLabel(category);

  if (!label) {
    return {
      title: "Category not found",
    };
  }

  return {
    title: `${label} Lists`,
    description: `Browse curated Google Maps ${label.toLowerCase()} lists across RGuide destinations.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const label = getCategoryLabel(category);

  if (!label) {
    notFound();
  }

  const lists = getListsForCategory(category);

  return (
    <div className="page-shell py-10">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">Category</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">{label}</h1>
        <p className="mt-3 text-slate-600">
          Clean, crawlable category landing page for future SEO scale and internal linking.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {CATEGORIES.map((item) => (
          <CategoryCard
            key={item}
            category={item}
            count={mapLists.filter((list) => list.category === item).length}
          />
        ))}
      </div>
      <div className="mt-8 space-y-4">
        {lists.map((list) => (
          <MapListCard key={list.id} list={list} />
        ))}
      </div>
    </div>
  );
}
