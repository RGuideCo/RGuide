import { ListCategory } from "@/types";

export const SITE_NAME = "RGuide";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rguide.co";
export const SITE_DESCRIPTION =
  "Discover curated travel guides by continent, country, and city.";

export const CATEGORIES: ListCategory[] = [
  "Food",
  "Nightlife",
  "Nature",
  "Culture",
  "Stay",
  "Activities",
];

export const CATEGORY_STYLES: Record<
  ListCategory,
  {
    badge: string;
    filterActive: string;
    stopNumber: string;
    stopDot: string;
    mapColor: string;
    mapGlowColor: string;
    poiColor: string;
  }
> = {
  Food: {
    badge: "bg-amber-100 text-amber-800",
    filterActive: "border-amber-500 bg-amber-500 text-white",
    stopNumber: "bg-amber-500 text-white",
    stopDot: "bg-amber-500",
    mapColor: "#f59e0b",
    mapGlowColor: "#fbbf24",
    poiColor: "#b45309",
  },
  Nightlife: {
    badge: "bg-indigo-100 text-indigo-800",
    filterActive: "border-indigo-500 bg-indigo-500 text-white",
    stopNumber: "bg-indigo-500 text-white",
    stopDot: "bg-indigo-500",
    mapColor: "#6366f1",
    mapGlowColor: "#818cf8",
    poiColor: "#4338ca",
  },
  Culture: {
    badge: "bg-rose-100 text-rose-800",
    filterActive: "border-rose-500 bg-rose-500 text-white",
    stopNumber: "bg-rose-500 text-white",
    stopDot: "bg-rose-500",
    mapColor: "#f43f5e",
    mapGlowColor: "#fb7185",
    poiColor: "#be123c",
  },
  Stay: {
    badge: "bg-cyan-100 text-cyan-800",
    filterActive: "border-cyan-600 bg-cyan-600 text-white",
    stopNumber: "bg-cyan-600 text-white",
    stopDot: "bg-cyan-600",
    mapColor: "#0891b2",
    mapGlowColor: "#67e8f9",
    poiColor: "#0e7490",
  },
  Nature: {
    badge: "bg-emerald-100 text-emerald-800",
    filterActive: "border-emerald-500 bg-emerald-500 text-white",
    stopNumber: "bg-emerald-500 text-white",
    stopDot: "bg-emerald-500",
    mapColor: "#10b981",
    mapGlowColor: "#34d399",
    poiColor: "#047857",
  },
  Activities: {
    badge: "bg-orange-100 text-orange-800",
    filterActive: "border-orange-500 bg-orange-500 text-white",
    stopNumber: "bg-orange-500 text-white",
    stopDot: "bg-orange-500",
    mapColor: "#f97316",
    mapGlowColor: "#fb923c",
    poiColor: "#c2410c",
  },
};

export const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Most Popular", value: "most-popular" },
  { label: "Most Upvoted", value: "most-upvoted" },
] as const;
