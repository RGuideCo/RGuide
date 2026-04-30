import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SplitScreenSection } from "@/components/home/SplitScreenSection";
import { continents } from "@/data";
import { getListsByCreator } from "@/lib/mock-data";

interface CreatorPageProps {
  params: Promise<{
    name: string;
  }>;
}

export async function generateMetadata({ params }: CreatorPageProps): Promise<Metadata> {
  const { name } = await params;
  const { creator } = getListsByCreator(name);

  if (!creator) {
    return { title: "Creator not found" };
  }

  return {
    title: creator.name,
    description: `Browse curated Google Maps lists published by ${creator.name}.`,
  };
}

export default async function CreatorPage({ params }: CreatorPageProps) {
  const { name } = await params;
  const { creator, lists } = getListsByCreator(name);

  if (!creator) {
    notFound();
  }

  const itineraryCount = lists.filter(
    (list) =>
      list.stops.length >= 3 || /\bitinerary|route|day\s*\d+\b/i.test(`${list.title} ${list.description}`),
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
