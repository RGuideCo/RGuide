import Image from "next/image";
import Link from "next/link";
import { MapPinned } from "lucide-react";

import {
  getCanonicalGuidePath,
  getGuideSeoTitle,
} from "@/lib/deep-link-routes";
import { getCityHref } from "@/lib/routes";
import { formatNumber } from "@/lib/utils";
import type { City, Continent, MapList } from "@/types";

type ServerCityCard = City & {
  guideCount: number;
};

interface HomeServerContentProps {
  continents: Continent[];
  editorialGuides: MapList[];
}

function isGuideList(list: MapList) {
  return !list.id.startsWith("event-");
}

function getCitiesFromContinents(continents: Continent[], editorialGuides: MapList[]) {
  const guideLists = editorialGuides.filter(isGuideList);

  return continents.flatMap((continent) =>
    continent.countries.flatMap((country) =>
      country.cities
        .filter((city) => !city.isPlaceholderRegion)
        .map((city) => ({
          ...city,
          guideCount: guideLists.filter((list) => list.location.scope === "city" && list.location.city === city.name).length,
        })),
    ),
  );
}

function getFeaturedCities(continents: Continent[], editorialGuides: MapList[]) {
  return getCitiesFromContinents(continents, editorialGuides)
    .filter((city) => city.guideCount > 0)
    .sort((left, right) => right.guideCount - left.guideCount || left.name.localeCompare(right.name))
    .slice(0, 9);
}

function getFeaturedGuides(editorialGuides: MapList[]) {
  return editorialGuides
    .filter((list) => isGuideList(list) && list.location.scope === "city" && Boolean(list.location.city))
    .slice()
    .sort((left, right) => right.upvotes - left.upvotes || left.title.localeCompare(right.title))
    .slice(0, 8);
}

function ServerCityCard({ city }: { city: ServerCityCard }) {
  return (
    <Link href={getCityHref(city)} className="group overflow-hidden rounded-lg border border-slate-950/15 bg-white shadow-sm">
      <div className="relative h-44 overflow-hidden">
        <Image
          src={city.image}
          alt={city.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h2 className="text-xl font-semibold leading-tight">{city.name}</h2>
          <p className="mt-1 text-sm text-white/85">{city.country}</p>
        </div>
      </div>
      <div className="p-4">
        <p className="line-clamp-4 text-sm leading-6 text-slate-600">{city.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3 text-xs font-medium text-slate-600">
          <span className="inline-flex items-center gap-2">
            <MapPinned className="h-4 w-4 text-orange-500" aria-hidden="true" />
            {formatNumber(city.guideCount)} guides
          </span>
          <span className="text-orange-700">Explore</span>
        </div>
      </div>
    </Link>
  );
}

function GuideSummaryCard({ guide, guides }: { guide: MapList; guides: MapList[] }) {
  const city = { name: guide.location.city ?? "" };
  const neighborhood = guide.location.neighborhood ? { name: guide.location.neighborhood } : undefined;
  const href = getCanonicalGuidePath(city, guide, neighborhood, guides);
  const title = getGuideSeoTitle(guide, city, neighborhood);

  return (
    <article className="rounded-lg border border-slate-950/15 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        <span>{guide.category}</span>
        <span className="text-slate-300">/</span>
        <span>{[guide.location.neighborhood, guide.location.city].filter(Boolean).join(", ")}</span>
      </div>
      <h3 className="mt-2 text-base font-semibold leading-6 text-slate-950">
        <Link href={href} className="hover:text-orange-700">
          {title}
        </Link>
      </h3>
      {guide.title !== title ? (
        <p className="mt-1 text-xs font-medium text-slate-500">Guide: {guide.title}</p>
      ) : null}
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{guide.description}</p>
      {guide.stops.length ? (
        <ul className="mt-3 grid gap-2 text-sm text-slate-700">
          {guide.stops.slice(0, 3).map((stop) => (
            <li key={stop.id} className="rounded-md bg-stone-50 px-3 py-2">
              <span className="font-medium text-slate-900">{stop.name}</span>
              <span className="mt-1 line-clamp-2 block text-xs leading-5 text-slate-600">{stop.description}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

export function HomeServerContent({ continents, editorialGuides }: HomeServerContentProps) {
  const featuredCities = getFeaturedCities(continents, editorialGuides);
  const featuredGuides = getFeaturedGuides(editorialGuides);

  return (
    <section className="page-shell py-8 sm:py-10" aria-labelledby="home-server-content-heading">
      <div className="surface overflow-hidden p-4 sm:p-6">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">RGuide</p>
          <h1 id="home-server-content-heading" className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Curated travel guides by city
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Browse city guides, neighborhood picks, food routes, stays, cultural stops, nightlife, nature, and practical essentials.
          </p>
        </div>

        {featuredCities.length ? (
          <div className="mt-8">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-lg font-semibold text-slate-950">Popular cities</h2>
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                {formatNumber(featuredCities.length)} destinations
              </span>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredCities.map((city) => (
                <ServerCityCard key={city.id} city={city} />
              ))}
            </div>
          </div>
        ) : null}

        {featuredGuides.length ? (
          <div className="mt-10 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-semibold text-slate-950">Featured guides</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {featuredGuides.map((guide) => (
                <GuideSummaryCard key={guide.id} guide={guide} guides={editorialGuides} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
