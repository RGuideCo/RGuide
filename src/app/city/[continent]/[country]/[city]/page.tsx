import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CategorySection } from "@/components/city/CategorySection";
import { CityToolbar } from "@/components/city/CityToolbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { CATEGORIES } from "@/lib/constants";
import { getCategoryHref } from "@/lib/routes";
import { getCityBySlugPath, getListsForCity } from "@/lib/mock-data";

interface CityPageProps {
  params: Promise<{
    continent: string;
    country: string;
    city: string;
  }>;
  searchParams: Promise<{
    sort?: string;
    category?: string;
  }>;
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const slugPath = await params;
  const city = getCityBySlugPath(slugPath);

  if (!city) {
    return { title: "City not found" };
  }

  return {
    title: `${city.name}, ${city.country}`,
    description: `Curated Google Maps lists for ${city.name}, grouped by category for food, drinks, culture, shopping, and more.`,
    alternates: {
      canonical: `/city/${slugPath.continent}/${slugPath.country}/${slugPath.city}`,
    },
    openGraph: {
      title: `${city.name}, ${city.country} guides`,
      description: `Curated Google Maps lists for ${city.name}, including food, nightlife, culture, scenic spots, and activities.`,
      url: `/city/${slugPath.continent}/${slugPath.country}/${slugPath.city}`,
      images: [
        {
          url: city.image,
          alt: `${city.name}, ${city.country}`,
        },
      ],
    },
  };
}

export default async function CityPage({ params, searchParams }: CityPageProps) {
  const slugPath = await params;
  const query = await searchParams;
  const city = getCityBySlugPath(slugPath);

  if (!city) {
    notFound();
  }

  const allLists = getListsForCity(city);
  const activeCategory = query.category;
  const sortedLists = [...allLists].sort((a, b) => {
    if (query.sort === "most-upvoted" || query.sort === "most-popular") {
      return b.upvotes - a.upvotes;
    }

    return +new Date(b.createdAt) - +new Date(a.createdAt);
  });

  const visibleLists = activeCategory
    ? sortedLists.filter((list) => list.category.toLowerCase() === activeCategory.toLowerCase())
    : sortedLists;

  const groupedLists = CATEGORIES.map((category) => ({
    category,
    lists: visibleLists.filter((list) => list.category === category),
  }));
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: city.continent, item: "/" },
      { "@type": "ListItem", position: 3, name: city.country, item: "/" },
      {
        "@type": "ListItem",
        position: 4,
        name: city.name,
        item: `/city/${slugPath.continent}/${slugPath.country}/${slugPath.city}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="page-shell py-5 sm:py-6">
        <div className="surface relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={city.image}
              alt={city.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/58" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/88 via-white/35 to-white/20" />
          </div>
          <div className="relative p-4 sm:p-5 lg:p-6">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-orange-600">City Guide</p>
              <h1 className="mt-1.5 text-3xl font-semibold text-slate-900 sm:text-4xl">
                {city.name}, {city.country}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700 sm:text-base">
                {city.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/70 bg-white/80 px-3 py-1.5 text-xs text-slate-700">
                  {city.continent}
                </span>
                <span className="rounded-full border border-white/70 bg-white/80 px-3 py-1.5 text-xs text-slate-700">
                  {allLists.length} map lists
                </span>
              </div>
            </div>
            <div className="mt-4 max-w-3xl">
              <CityToolbar activeSort={query.sort ?? "newest"} activeCategory={activeCategory} />
            </div>
          </div>
        </div>
      </section>

      <div className="page-shell space-y-6 pb-10">
        <section className="surface p-4 sm:p-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-orange-600">Browse by category</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">Indexable category paths</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <Link
                  key={category}
                  href={getCategoryHref(category)}
                  className="rounded-full border border-slate-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-slate-700"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {visibleLists.length ? (
          groupedLists.map((group) => (
            <CategorySection key={group.category} category={group.category} lists={group.lists} />
          ))
        ) : (
          <EmptyState
            title="No lists match this filter"
            description="Try another category or clear the filter to browse all curated Google Maps lists for this city."
          />
        )}
      </div>
    </>
  );
}
