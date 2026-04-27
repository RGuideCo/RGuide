import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MapListCard } from "@/components/cards/MapListCard";
import { ListGuideWorkspace } from "@/components/list/ListGuideWorkspace";
import { continents } from "@/data";
import { getCategoryHref, getCityHref, getListHref } from "@/lib/routes";
import { getAllLists, getListBySlug } from "@/lib/mock-data";

interface ListDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ListDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const list = getListBySlug(slug);

  if (!list) {
    return { title: "List not found" };
  }

  const locationLabel = list.location.city
    ? `${list.location.city}, ${list.location.country}`
    : `${list.location.country}, ${list.location.continent}`;

  return {
    title: `${list.title} (${locationLabel})`,
    description: list.description,
    alternates: {
      canonical: `/list/${list.slug}`,
    },
    openGraph: {
      title: `${list.title} | ${locationLabel}`,
      description: list.description,
      url: `/list/${list.slug}`,
      images: [
        {
          url: list.creator.avatar,
          alt: `${list.title} cover image`,
        },
      ],
    },
  };
}

export default async function ListDetailPage({ params }: ListDetailPageProps) {
  const { slug } = await params;
  const list = getListBySlug(slug);

  if (!list) {
    notFound();
  }

  const relatedLists = getAllLists()
    .filter((item) => {
      if (item.id === list.id) {
        return false;
      }

      if (list.location.scope === "city") {
        return item.location.city === list.location.city;
      }

      if (list.location.scope === "country") {
        return item.location.country === list.location.country;
      }

      return item.location.continent === list.location.continent;
    })
    .slice(0, 3);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: list.location.city ? `${list.location.city}, ${list.location.country}` : list.location.country,
        item: list.location.city
          ? getCityHref({
              continent: list.location.continent,
              country: list.location.country,
              name: list.location.city,
            })
          : "/",
      },
      { "@type": "ListItem", position: 3, name: list.title, item: getListHref(list) },
    ],
  };
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: list.title,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: list.stops.length,
    itemListElement: list.stops.map((stop, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: stop.name,
      description: stop.description,
    })),
  };

  return (
    <div className="page-shell py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {list.stops.length ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      ) : null}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <article className="surface p-6 sm:p-8">
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <li>
                  <Link href="/" className="hover:text-slate-700">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                {list.location.city ? (
                  <>
                    <li>
                      <Link
                        href={getCityHref({
                          continent: list.location.continent,
                          country: list.location.country,
                          name: list.location.city,
                        })}
                        className="hover:text-slate-700"
                      >
                        {list.location.city}
                      </Link>
                    </li>
                    <li aria-hidden="true">/</li>
                  </>
                ) : null}
                <li className="text-slate-700">{list.title}</li>
              </ol>
            </nav>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">Map List</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-900">{list.title}</h1>
            <p className="mt-4 max-w-3xl text-slate-600">{list.description}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
              <Link href={getCategoryHref(list.category)} className="rounded-full bg-stone-100 px-4 py-2">
                {list.category}
              </Link>
              {list.location.city ? (
                <Link
                  href={getCityHref({
                    continent: list.location.continent,
                    country: list.location.country,
                    name: list.location.city,
                  })}
                  className="rounded-full bg-stone-100 px-4 py-2"
                >
                  {list.location.city}, {list.location.country}
                </Link>
              ) : (
                <span className="rounded-full bg-stone-100 px-4 py-2">
                  {[list.location.country, list.location.continent].filter(Boolean).join(", ")}
                </span>
              )}
            </div>
          </article>

          <section className="surface p-6 sm:p-8" aria-labelledby="guide-content-heading">
            <h2 id="guide-content-heading" className="text-2xl font-semibold text-slate-900">
              {list.title}: places, highlights, and practical notes
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              This guide is fully rendered in the page HTML for indexing. Expand/collapse is optional interaction on top
              of readable server content.
            </p>
            {list.stops.length ? (
              <ol className="mt-5 space-y-3">
                {list.stops.map((stop, index) => (
                  <li key={stop.id}>
                    <article className="rounded-2xl border border-slate-200 bg-white p-4">
                      <h3 className="text-base font-semibold text-slate-900">
                        {index + 1}. {stop.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">{stop.description}</p>
                    </article>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 text-sm text-slate-600">No place entries available for this guide yet.</p>
            )}
          </section>

          <ListGuideWorkspace list={list} continents={continents} />

          <section className="space-y-4" aria-labelledby="related-guides-heading">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">Related</p>
              <h2 id="related-guides-heading" className="mt-2 text-2xl font-semibold text-slate-900">
                More from {list.location.city ?? list.location.country ?? list.location.continent}
              </h2>
            </div>
            {relatedLists.length ? (
              <ul className="space-y-4">
                {relatedLists.map((item) => (
                  <li key={item.id}>
                    <MapListCard list={item} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-600">No related guides available yet.</p>
            )}
          </section>
        </div>

        <aside className="space-y-6" />
      </div>
    </div>
  );
}
