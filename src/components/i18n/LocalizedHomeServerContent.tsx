import Image from "next/image";
import Link from "next/link";

import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocalizedCityPath, getLocalizedGuidePath } from "@/lib/i18n/paths";
import type { AppLocale } from "@/lib/i18n/config";
import {
  findDestinationRouteTranslation,
  type DestinationRouteTranslation,
} from "@/lib/i18n/server";
import type { City, Continent, MapList } from "@/types";

interface LocalizedHomeServerContentProps {
  locale: AppLocale;
  continents: Continent[];
  editorialGuides: MapList[];
  destinationTranslations?: DestinationRouteTranslation[];
}

export function LocalizedHomeServerContent({
  locale,
  continents,
  editorialGuides,
  destinationTranslations = [],
}: LocalizedHomeServerContentProps) {
  const dictionary = getDictionary(locale);
  const cities = continents.flatMap((continent) =>
    continent.countries.flatMap((country) => country.cities),
  );
  const guidesByCity = new Map<string, MapList[]>();
  for (const guide of editorialGuides) {
    if (!guide.location.city || guide.location.neighborhood) continue;
    guidesByCity.set(guide.location.city, [...(guidesByCity.get(guide.location.city) ?? []), guide]);
  }
  const featuredCities = cities
    .map((city) => ({ city, guides: guidesByCity.get(city.name) ?? [] }))
    .filter((item) => item.guides.length)
    .sort((left, right) => right.guides.length - left.guides.length || left.city.name.localeCompare(right.city.name))
    .slice(0, 12);

  return (
    <section className="page-shell py-8 sm:py-10" aria-labelledby="localized-home-heading">
      <div className="surface overflow-hidden p-4 sm:p-6">
        <p className="text-xs font-semibold uppercase text-orange-700">RGuide Travel</p>
        <h1 id="localized-home-heading" className="mt-2 max-w-4xl text-3xl font-semibold text-slate-950 sm:text-4xl">
          {dictionary.curatedTravelGuides}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{dictionary.siteDescription}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCities.map(({ city, guides }) => (
            <article key={city.id} className="overflow-hidden rounded-md border border-slate-200 bg-white">
              {(() => {
                const cityTranslation = findDestinationRouteTranslation(destinationTranslations, {
                  id: city.id,
                  name: city.name,
                  scope: "city",
                });
                return (
                  <>
              <Link
                href={getLocalizedCityPath(locale, city, cityTranslation?.slug)}
                className="group block"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  <Image src={city.image} alt={city.name} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-slate-950">
                    {cityTranslation?.displayName ?? city.name}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{city.description}</p>
                  <p className="mt-3 text-xs font-semibold text-orange-700">{guides.length} guías</p>
                </div>
              </Link>
              <ul className="border-t border-slate-100 px-4 py-3 text-sm">
                {guides.slice(0, 3).map((guide) => (
                  <li key={guide.id}>
                    <Link
                      href={getLocalizedGuidePath(locale, city as City, guide, undefined, cityTranslation?.slug)}
                      className="block py-1.5 text-slate-600 hover:text-orange-700"
                    >
                      {guide.seoTitle ?? guide.title}
                    </Link>
                  </li>
                ))}
              </ul>
                  </>
                );
              })()}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
