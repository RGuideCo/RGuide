import Link from "next/link";

import {
  CityDeepLinkResolution,
  getCanonicalCityCategoryPath,
  getCanonicalCityNeighborhoodPath,
  getCanonicalCityPath,
  getCanonicalGuidePath,
  getIndexableListsForCityRoute,
  getCategoriesForCityRoute,
  getListsForCityRoute,
  getNeighborhoodsForCityRoute,
  getRelatedCityRouteGuides,
} from "@/lib/deep-link-routes";
import { CATEGORIES } from "@/lib/constants";
import { MapList } from "@/types";

type CityRouteSeoIndexProps = {
  route: CityDeepLinkResolution;
};

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function GuidePreviewCard({ guide, priority = false }: { guide: MapList; priority?: boolean }) {
  const neighborhood = guide.location.neighborhood ? { name: guide.location.neighborhood } : undefined;
  const href = getCanonicalGuidePath({ name: guide.location.city ?? "" }, guide, neighborhood);
  const stops = guide.stops.slice(0, priority ? 6 : 3);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        <span>{guide.category}</span>
        {guide.location.neighborhood ? (
          <>
            <span className="text-slate-300">/</span>
            <span>{guide.location.neighborhood}</span>
          </>
        ) : null}
      </div>
      <h3 className="mt-2 text-base font-semibold text-slate-950">
        <Link href={href} className="hover:text-orange-700">
          {guide.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{guide.description}</p>
      {stops.length ? (
        <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          {stops.map((stop) => (
            <li key={stop.id} className="rounded-md bg-stone-50 px-3 py-2">
              <span className="font-medium text-slate-900">{stop.name}</span>
              {priority ? <span className="mt-1 block text-xs leading-5 text-slate-600">{stop.description}</span> : null}
            </li>
          ))}
        </ul>
      ) : null}
      {guide.sources?.length ? (
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {guide.sources.slice(0, 4).map((source) => (
            <a
              key={`${guide.id}-${source.url}`}
              href={source.url}
              className="rounded-full border border-slate-200 bg-stone-50 px-2.5 py-1 text-slate-600 hover:border-slate-300 hover:text-slate-950"
              rel="noreferrer"
            >
              {source.name}
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export function CityRouteSeoIndex({ route }: CityRouteSeoIndexProps) {
  const indexableGuides = getIndexableListsForCityRoute(route.city, route.neighborhood, route.category, route.guide)
    .sort((left, right) => right.upvotes - left.upvotes || left.title.localeCompare(right.title));
  const visibleGuides = indexableGuides.slice(0, route.guide ? 1 : 12);
  const relatedGuides = getRelatedCityRouteGuides(route).slice(0, 6);
  const neighborhoods = getNeighborhoodsForCityRoute(route.city)
    .filter(({ neighborhood }) => getListsForCityRoute(route.city, neighborhood).length > 0)
    .slice(0, 18);
  const categories = route.neighborhood
    ? getCategoriesForCityRoute(route.city, route.neighborhood)
    : CATEGORIES.filter((category) => getIndexableListsForCityRoute(route.city, undefined, category).length > 0);
  const placeName = route.neighborhood ? `${route.neighborhood.name}, ${route.city.name}` : route.city.name;
  const matchingGuideCount = indexableGuides.length;
  const matchingStopCount = indexableGuides.reduce((total, guide) => total + guide.stops.length, 0);

  return (
    <section className="page-shell py-8 sm:py-10" aria-labelledby="route-guide-index-heading">
      <div className="surface overflow-hidden p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
              {route.guide ? "Guide Details" : route.category ? `${route.category} Guide Index` : "Destination Guide Index"}
            </p>
            <h2 id="route-guide-index-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {route.h1}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{route.intro}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
              <span className="rounded-full bg-stone-100 px-3 py-1.5">{placeName}</span>
              <span className="rounded-full bg-stone-100 px-3 py-1.5">{pluralize(matchingGuideCount, "guide")}</span>
              <span className="rounded-full bg-stone-100 px-3 py-1.5">{pluralize(matchingStopCount, "mapped stop")}</span>
            </div>
          </div>

          <nav className="rounded-lg border border-slate-200 bg-stone-50 p-3" aria-label={`${placeName} guide links`}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Explore</p>
            <div className="mt-3 grid gap-2 text-sm">
              <Link href={getCanonicalCityPath(route.city)} className="text-slate-700 hover:text-orange-700">
                All {route.city.name} guides
              </Link>
              {route.neighborhood ? (
                <Link
                  href={getCanonicalCityNeighborhoodPath(route.city, route.neighborhood)}
                  className="text-slate-700 hover:text-orange-700"
                >
                  All {route.neighborhood.name} guides
                </Link>
              ) : null}
              {categories.map((category) => (
                <Link
                  key={category}
                  href={getCanonicalCityCategoryPath(route.city, category, route.neighborhood)}
                  className="text-slate-700 hover:text-orange-700"
                >
                  {category} in {placeName}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {visibleGuides.length ? (
          <div className="mt-7 grid gap-4">
            {visibleGuides.map((guide) => (
              <GuidePreviewCard key={guide.id} guide={guide} priority={Boolean(route.guide)} />
            ))}
          </div>
        ) : (
          <div className="mt-7 rounded-lg border border-dashed border-slate-300 bg-stone-50 p-5">
            <p className="text-sm font-medium text-slate-900">More guides are being added for this route.</p>
          </div>
        )}

        {!route.guide && neighborhoods.length ? (
          <div className="mt-8 border-t border-slate-200 pt-6">
            <h3 className="text-base font-semibold text-slate-950">Neighborhoods in {route.city.name}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {neighborhoods.map(({ neighborhood }) => (
                <Link
                  key={neighborhood.id}
                  href={getCanonicalCityNeighborhoodPath(route.city, neighborhood)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-orange-200 hover:text-orange-700"
                >
                  {neighborhood.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {relatedGuides.length ? (
          <div className="mt-8 border-t border-slate-200 pt-6">
            <h3 className="text-base font-semibold text-slate-950">
              {route.guide ? `More ${route.guide.category.toLowerCase()} guides near ${placeName}` : `More guides for ${placeName}`}
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedGuides.map((guide) => (
                <Link
                  key={guide.id}
                  href={getCanonicalGuidePath(
                    { name: guide.location.city ?? route.city.name },
                    guide,
                    guide.location.neighborhood ? { name: guide.location.neighborhood } : undefined,
                  )}
                  className="rounded-lg border border-slate-200 bg-white p-3 hover:border-orange-200"
                >
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {guide.category}
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-slate-950">{guide.title}</span>
                  <span className="mt-1 line-clamp-2 block text-xs leading-5 text-slate-600">{guide.description}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
