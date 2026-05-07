import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SplitScreenSection } from "@/components/home/SplitScreenSection";
import { users } from "@/data";
import { getContinentsWithDestinationDescriptions } from "@/lib/destination-descriptions";
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
  };
}

export default async function CreatorPage({ params }: CreatorPageProps) {
  const { name } = await params;
  const [continents, editorialGuides] = await Promise.all([
    getContinentsWithDestinationDescriptions(),
    getServerEditorialGuides(),
  ]);
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

  return (
    <SplitScreenSection
      continents={continents}
      initialEditorialGuides={editorialGuides}
      publicProfile={{
        creator,
        lists,
        stats: {
          yearsAsUser,
          favoritesCount,
          itineraryCount,
          placesBeenCount,
        },
      }}
    />
  );
}
