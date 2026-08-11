import Link from "next/link";

import { GuideEditorialReview } from "@/components/cards/GuideEditorialReview";
import { CATEGORIES } from "@/lib/constants";
import { isIndexableEditorialGuide, type CityDeepLinkResolution } from "@/lib/deep-link-routes";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  getLocalizedCityCategoryPath,
  getLocalizedCityNeighborhoodPath,
  getLocalizedGuidePath,
} from "@/lib/i18n/paths";
import type { AppLocale } from "@/lib/i18n/config";
import type { DestinationRouteTranslation } from "@/lib/i18n/types";
import type { MapList } from "@/types";

interface LocalizedCityRouteSeoIndexProps {
  locale: AppLocale;
  route: CityDeepLinkResolution;
  guides: MapList[];
  localizedCitySlug?: string;
  localizedNeighborhoodSlug?: string;
  destinationTranslations?: DestinationRouteTranslation[];
}

export function LocalizedCityRouteSeoIndex({
  locale,
  route,
  guides,
  localizedCitySlug,
  localizedNeighborhoodSlug,
  destinationTranslations = [],
}: LocalizedCityRouteSeoIndexProps) {
  const dictionary = getDictionary(locale);
  const matchingGuides = guides
    .filter((guide) => {
      if (guide.location.city !== route.city.name) return false;
      if (route.category && guide.category !== route.category) return false;
      if (route.neighborhood && guide.location.neighborhood !== route.neighborhood.name) return false;
      if (route.guide && guide.id !== route.guide.id) return false;
      return isIndexableEditorialGuide(guide);
    })
    .sort((left, right) => right.upvotes - left.upvotes || left.title.localeCompare(right.title));
  const visibleGuides = matchingGuides.slice(0, route.guide ? 1 : 12);
  const categories = CATEGORIES.filter((category) =>
    guides.some((guide) => guide.location.city === route.city.name && guide.category === category),
  );
  const cityName = destinationTranslations.find(
    (translation) =>
      translation.scope === "city" &&
      (translation.legacyId === route.city.id || translation.sourceName === route.city.name),
  )?.displayName ?? route.city.name;
  const countryName = destinationTranslations.find(
    (translation) => translation.scope === "country" && translation.sourceName === route.city.country,
  )?.displayName ?? route.city.country;
  const neighborhoodName = route.neighborhood
    ? destinationTranslations.find(
        (translation) =>
          translation.scope === "neighborhood" &&
          (translation.legacyId === route.neighborhood?.id || translation.sourceName === route.neighborhood?.name),
      )?.displayName ?? route.neighborhood.name
    : undefined;
  const getGuideHref = (guide: MapList) => {
    const neighborhood = guide.location.neighborhood ? { name: guide.location.neighborhood } : undefined;
    const guideNeighborhoodTranslation = guide.location.neighborhood
      ? destinationTranslations.find(
          (candidate) =>
            candidate.scope === "neighborhood" &&
            candidate.sourceName === guide.location.neighborhood,
        )
      : undefined;

    return getLocalizedGuidePath(
      locale,
      route.city,
      guide,
      neighborhood,
      localizedCitySlug,
      guideNeighborhoodTranslation?.slug ?? localizedNeighborhoodSlug,
    );
  };

  return (
    <section className="page-shell py-8 sm:py-10" aria-labelledby="localized-city-heading">
      <div className="surface overflow-hidden p-4 sm:p-6">
        <p className="text-xs font-semibold uppercase text-orange-700">
          {[neighborhoodName, cityName, countryName].filter(Boolean).join(" / ")}
        </p>
        <h1 id="localized-city-heading" className="mt-2 text-3xl font-semibold text-slate-950 sm:text-4xl">{route.h1}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{route.intro}</p>

        {!route.guide ? (
          <nav className="mt-6 flex flex-wrap gap-2" aria-label="Categorias">
            {categories.map((category) => (
              <Link
                key={category}
                href={getLocalizedCityCategoryPath(
                  locale,
                  route.city,
                  category,
                  route.neighborhood,
                  localizedCitySlug,
                  localizedNeighborhoodSlug,
                )}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-orange-300 hover:text-orange-700"
              >
                {dictionary.categories[category]}
              </Link>
            ))}
          </nav>
        ) : null}

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {visibleGuides.map((guide) => {
            return (
              <article key={guide.id} className="rounded-md border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">{dictionary.categories[guide.category]}</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950">
                  <Link
                    href={getGuideHref(guide)}
                    className="hover:text-orange-700"
                  >
                    {guide.seoTitle ?? guide.title}
                  </Link>
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{guide.description}</p>
                <ol className="mt-4 space-y-3">
                  {guide.stops.slice(0, route.guide ? guide.stops.length : 4).map((stop, index) => (
                    <li key={stop.id} className="rounded-md bg-stone-50 px-3 py-2.5">
                      <p className="font-medium text-slate-950">{index + 1}. {stop.name}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{stop.description}</p>
                    </li>
                  ))}
                </ol>
                {route.guide ? (
                  <GuideEditorialReview
                    guide={guide}
                    locale={locale}
                    className="mt-4 border-t border-slate-200 pt-3"
                  />
                ) : null}
              </article>
            );
          })}
        </div>

        {!route.guide && matchingGuides.length ? (
          <nav className="mt-8 border-t border-slate-200 pt-5" aria-label={`Todas las guias de ${cityName}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-950">Todas las guias de {neighborhoodName ?? cityName}</h2>
              <span className="text-xs font-medium text-slate-500">{matchingGuides.length} guias</span>
            </div>
            <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {matchingGuides.map((guide) => (
                <Link
                  key={guide.id}
                  href={getGuideHref(guide)}
                  className="text-sm font-medium text-slate-700 hover:text-orange-700"
                >
                  {guide.seoTitle ?? guide.title}
                </Link>
              ))}
            </div>
          </nav>
        ) : null}

        {!route.neighborhood ? (
          <nav className="mt-8 border-t border-slate-200 pt-5" aria-label="Barrios">
            <h2 className="text-lg font-semibold text-slate-950">Barrios de {cityName}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {route.city.subareas?.slice(0, 24).map((neighborhood) => {
                const translation = destinationTranslations.find(
                  (candidate) =>
                    candidate.scope === "neighborhood" &&
                    (candidate.legacyId === neighborhood.id || candidate.sourceName === neighborhood.name),
                );
                return (
                  <Link
                    key={neighborhood.id}
                    href={getLocalizedCityNeighborhoodPath(locale, route.city, neighborhood, localizedCitySlug, translation?.slug)}
                    className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:text-orange-700"
                  >
                    {translation?.displayName ?? neighborhood.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        ) : null}
      </div>
    </section>
  );
}
