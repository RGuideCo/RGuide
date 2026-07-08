import Image from "next/image";
import Link from "next/link";
import { MapPinned } from "@/components/icons/MaterialSymbol";

import {
  getAllListsForCityRoute,
  getCanonicalGuidePath,
  getGuideSeoTitle,
} from "@/lib/deep-link-routes";
import { getCityHref } from "@/lib/routes";
import { formatNumber } from "@/lib/utils";
import type { City, Continent, ListCategory, MapList } from "@/types";

type ServerCityCard = City & {
  guideCount: number;
};

type HomeSeoLink = {
  label: string;
  href: string;
};

type HomeSeoCityLinkGroup = {
  city: ServerCityCard;
  links: HomeSeoLink[];
};

interface HomeServerContentProps {
  continents: Continent[];
  editorialGuides: MapList[];
}

const HOME_SEO_CITY_LIMIT = 40;
const HOME_SEO_CATEGORY_ORDER: ListCategory[] = ["Stay", "Food", "Nightlife", "Culture", "Activities", "Nature"];

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

function getFeaturedStayGuides(editorialGuides: MapList[]) {
  return editorialGuides
    .filter(
      (list) =>
        isGuideList(list) &&
        list.category === "Stay" &&
        list.location.scope === "city" &&
        Boolean(list.location.city) &&
        !list.location.neighborhood,
    )
    .slice()
    .sort((left, right) => {
      const leftHotelIntent = left.seoSlug === "best-hotels" ? 1 : 0;
      const rightHotelIntent = right.seoSlug === "best-hotels" ? 1 : 0;
      return rightHotelIntent - leftHotelIntent || right.stops.length - left.stops.length || left.title.localeCompare(right.title);
    })
    .slice(0, 6);
}

function getHomeSeoCityLinkGroups(continents: Continent[], editorialGuides: MapList[]): HomeSeoCityLinkGroup[] {
  return getCitiesFromContinents(continents, editorialGuides)
    .filter((city) => city.guideCount > 0)
    .sort((left, right) => right.guideCount - left.guideCount || left.name.localeCompare(right.name))
    .slice(0, HOME_SEO_CITY_LIMIT)
    .map((city) => {
      const links = HOME_SEO_CATEGORY_ORDER.flatMap((category): HomeSeoLink[] => {
        const categoryGuides = getAllListsForCityRoute(city, category, editorialGuides)
          .filter(isGuideList)
          .sort((left, right) => {
            const leftCityWide = left.location.neighborhood ? 0 : 1;
            const rightCityWide = right.location.neighborhood ? 0 : 1;
            const leftSlugMatch = left.seoSlug?.startsWith("best-") ? 1 : 0;
            const rightSlugMatch = right.seoSlug?.startsWith("best-") ? 1 : 0;
            return (
              rightCityWide - leftCityWide ||
              rightSlugMatch - leftSlugMatch ||
              right.upvotes - left.upvotes ||
              right.stops.length - left.stops.length ||
              left.title.localeCompare(right.title)
            );
          });
        const guide = categoryGuides[0];

        if (!guide) {
          return [];
        }

        const neighborhood = guide.location.neighborhood ? { name: guide.location.neighborhood } : undefined;
        return [
          {
            label: getGuideSeoTitle(guide, city, neighborhood),
            href: getCanonicalGuidePath(city, guide, neighborhood, editorialGuides),
          },
        ];
      });

      return {
        city,
        links: [
          { label: `${city.name} travel guides`, href: getCityHref(city) },
          ...links,
        ],
      };
    })
    .filter((group) => group.links.length > 1);
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

function StayGuideCard({ guide, guides }: { guide: MapList; guides: MapList[] }) {
  const city = { name: guide.location.city ?? "" };
  const href = getCanonicalGuidePath(city, guide, undefined, guides);
  const title = getGuideSeoTitle(guide, city);

  return (
    <article className="rounded-lg border border-cyan-900/20 bg-cyan-50/50 p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-900/70">
        <span>Where to stay</span>
        <span className="text-cyan-900/30">/</span>
        <span>{guide.location.city}</span>
      </div>
      <h3 className="mt-2 text-base font-semibold leading-6 text-slate-950">
        <Link href={href} className="hover:text-cyan-800">
          {title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{guide.description}</p>
      {guide.stops.length ? (
        <ul className="mt-3 grid gap-2 text-sm text-slate-700">
          {guide.stops.slice(0, 3).map((stop) => (
            <li key={stop.id} className="rounded-md bg-white px-3 py-2">
              <span className="font-medium text-slate-900">{stop.name}</span>
              <span className="mt-1 line-clamp-2 block text-xs leading-5 text-slate-600">{stop.description}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <Link href={href} className="mt-4 inline-flex rounded-md bg-cyan-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-900">
        View hotels and booking links
      </Link>
    </article>
  );
}

function HomeSeoCityIndex({ groups }: { groups: HomeSeoCityLinkGroup[] }) {
  if (!groups.length) {
    return null;
  }

  return (
    <div className="mt-10 border-t border-slate-200 pt-6">
      <div className="max-w-3xl">
        <h2 className="text-lg font-semibold text-slate-950">City guide index</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Fast routes into RGuide Travel destination pages for stays, restaurants, bars, culture, activities, and nature.
        </p>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {groups.map((group) => (
          <nav key={group.city.id} aria-label={`${group.city.name} guide links`} className="rounded-lg border border-slate-950/10 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-950">
              <Link href={getCityHref(group.city)} className="hover:text-orange-700">
                {group.city.name}
              </Link>
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-600 hover:text-orange-700">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </div>
  );
}

export function HomeServerContent({ continents, editorialGuides }: HomeServerContentProps) {
  const featuredCities = getFeaturedCities(continents, editorialGuides);
  const featuredStayGuides = getFeaturedStayGuides(editorialGuides);
  const featuredGuides = getFeaturedGuides(editorialGuides);
  const seoCityLinkGroups = getHomeSeoCityLinkGroups(continents, editorialGuides);

  return (
    <section className="page-shell py-8 sm:py-10" aria-labelledby="home-server-content-heading">
      <div className="surface overflow-hidden p-4 sm:p-6">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">RGuide Travel</p>
          <h1 id="home-server-content-heading" className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            RGuide Travel city guides for hotels, neighborhoods, food, and nightlife
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            RGuide Travel publishes independent destination guides for travelers choosing where to stay, where to eat, what to do, and which neighborhoods fit the trip. Start with accommodation-led guides for hotels, hostels, and practical city bases, then build the rest of the route around food, culture, nightlife, nature, and essentials.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
            <Link href="/category/stay" className="rounded-md bg-cyan-800 px-3 py-2 text-white hover:bg-cyan-900">
              Browse stay guides
            </Link>
            <Link href="/city/barcelona/stay/best-hotels" className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:border-cyan-200 hover:text-cyan-800">
              Best hotels in Barcelona
            </Link>
          </div>
        </div>

        {featuredStayGuides.length ? (
          <div className="mt-8 border-t border-slate-200 pt-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Where to stay</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Hotel and hostel guides organized by city, neighborhood fit, transit access, nightlife reach, and booking context.
                </p>
              </div>
              <Link href="/category/stay" className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-800 hover:text-cyan-900">
                All stay guides
              </Link>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredStayGuides.map((guide) => (
                <StayGuideCard key={guide.id} guide={guide} guides={editorialGuides} />
              ))}
            </div>
          </div>
        ) : null}

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

        <HomeSeoCityIndex groups={seoCityLinkGroups} />
      </div>
    </section>
  );
}
