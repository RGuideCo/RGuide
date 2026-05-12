import { ListCategory } from "@/types";

export const SITE_NAME = "RGuide";
export const SITE_SEARCH_NAME = "RGuide Travel";
export const SITE_ALTERNATE_NAMES = [
  "RGuide",
  "R Guide",
  "RGuide Travel",
  "R Guide Travel",
  "RGuide City Guides",
];
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rguide.co";
export const SITE_DESCRIPTION =
  "Independent travel guides for cities, neighborhoods, hotels, restaurants, bars, culture, and itineraries.";

export const CATEGORIES: ListCategory[] = [
  "Food",
  "Nightlife",
  "Nature",
  "Culture",
  "Stay",
  "Activities",
  "Routes",
  "Essentials",
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
  Routes: {
    badge: "bg-blue-100 text-blue-800",
    filterActive: "border-blue-600 bg-blue-600 text-white",
    stopNumber: "bg-blue-600 text-white",
    stopDot: "bg-blue-600",
    mapColor: "#2563eb",
    mapGlowColor: "#60a5fa",
    poiColor: "#1d4ed8",
  },
  Essentials: {
    badge: "bg-violet-100 text-violet-800",
    filterActive: "border-violet-600 bg-violet-600 text-white",
    stopNumber: "bg-violet-600 text-white",
    stopDot: "bg-violet-600",
    mapColor: "#7c3aed",
    mapGlowColor: "#a78bfa",
    poiColor: "#6d28d9",
  },
};

export const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Most Popular", value: "most-popular" },
  { label: "Most Upvoted", value: "most-upvoted" },
] as const;
