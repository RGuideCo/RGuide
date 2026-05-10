import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SplitScreenClientLoader } from "@/components/home/SplitScreenClientLoader";
import { ProgressiveEnhancementShell } from "@/components/shared/ProgressiveEnhancementShell";
import { users } from "@/data";
import { getCreatorHref } from "@/lib/routes";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";
import { slugify } from "@/lib/utils";
import type { MapList, User } from "@/types";

interface CreatorPageProps {
  params: Promise<{
    name: string;
  }>;
}

function getCreatorProfile(nameSlug: string, guides: MapList[]): { creator?: User; lists: MapList[] } {
  const localCreator = users.find((user) => slugify(user.name) === nameSlug || slugify(user.id) === nameSlug);
  const lists = guides.filter(
    (list) =>
      slugify(list.creator.name) === nameSlug ||
      slugify(list.creator.id) === nameSlug ||
      list.creator.id === localCreator?.id,
  );
  const guideCreator = lists[0]?.creator;

  return {
    creator: localCreator ?? (
      guideCreator
        ? {
            ...guideCreator,
            bio: `Curated travel guides published by ${guideCreator.name}.`,
          }
        : undefined
    ),
    lists,
  };
}

function CreatorProfileFallback({
  creator,
  lists,
  stats,
}: {
  creator: User;
  lists: MapList[];
  stats: {
    yearsAsUser: number;
    favoritesCount: number;
    itineraryCount: number;
    placesBeenCount: number;
  };
}) {
  return (
    <section className="page-shell py-8 sm:py-10" aria-labelledby="creator-profile-heading">
      <div className="surface overflow-hidden p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <img
            src={creator.avatar}
            alt={creator.name}
            className="h-16 w-16 rounded-lg border border-slate-950/10 object-cover"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">Creator</p>
            <h1 id="creator-profile-heading" className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
              {creator.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{creator.bio}</p>
          </div>
        </div>

        <dl className="mt-6 grid gap-3 sm:grid-cols-4">
          {[
            ["Years", stats.yearsAsUser],
            ["Favorites", stats.favoritesCount],
            ["Guides", lists.length],
            ["Places", stats.placesBeenCount],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-slate-950/10 bg-white p-3">
              <dt className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{label}</dt>
              <dd className="mt-1 text-lg font-semibold text-slate-950">{value}</dd>
            </div>
          ))}
        </dl>

        {lists.length ? (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-950">Published guides</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {lists.slice(0, 8).map((list) => (
                <article key={list.id} className="rounded-lg border border-slate-950/15 bg-white p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {[list.category, list.location.city ?? list.location.country].filter(Boolean).join(" / ")}
                  </p>
                  <h3 className="mt-2 text-base font-semibold leading-6 text-slate-950">
                    <Link href={`/list/${list.slug}`} className="hover:text-orange-700">
                      {list.title}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{list.description}</p>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export async function generateMetadata({ params }: CreatorPageProps): Promise<Metadata> {
  const { name } = await params;
  const editorialGuides = await getServerEditorialGuides();
  const { creator } = getCreatorProfile(name, editorialGuides);

  if (!creator) {
    return { title: "Creator not found" };
  }

  return {
    title: creator.name,
    description: `Browse curated travel guides published by ${creator.name}.`,
    alternates: {
      canonical: getCreatorHref(creator),
    },
    openGraph: {
      title: creator.name,
      description: `Browse curated travel guides published by ${creator.name}.`,
      url: getCreatorHref(creator),
      images: [
        {
          url: creator.avatar,
          alt: creator.name,
        },
      ],
      type: "profile",
    },
  };
}

export default async function CreatorPage({ params }: CreatorPageProps) {
  const { name } = await params;
  const editorialGuides = await getServerEditorialGuides();
  const { creator, lists } = getCreatorProfile(name, editorialGuides);

  if (!creator) {
    notFound();
  }

  const itineraryCount = lists.filter(
    (list) =>
      list.submissionType === "itinerary" ||
      list.stops.length >= 3 ||
      /\bitinerary|route|day\s*\d+\b/i.test(`${list.title} ${list.description}`),
  ).length;
  const placesBeenCount = new Set(
    lists
      .flatMap((list) => [
        list.location.city ?? null,
        ...list.stops.map((stop) => stop.name),
      ])
      .filter((value): value is string => Boolean(value)),
  ).size;
  const favoritesCount = lists.reduce((total, list) => total + list.upvotes, 0);
  const joinedAtMs = Date.parse(creator.joinedAt ?? lists[lists.length - 1]?.createdAt ?? "");
  const yearsAsUser = Number.isFinite(joinedAtMs)
    ? Math.max(1, new Date().getFullYear() - new Date(joinedAtMs).getFullYear())
    : 1;

  const publicProfile = {
    creator,
    lists,
    stats: {
      yearsAsUser,
      favoritesCount,
      itineraryCount,
      placesBeenCount,
    },
  };

  return (
    <ProgressiveEnhancementShell
      fallback={<CreatorProfileFallback {...publicProfile} />}
    >
      <SplitScreenClientLoader publicProfile={publicProfile} />
    </ProgressiveEnhancementShell>
  );
}
