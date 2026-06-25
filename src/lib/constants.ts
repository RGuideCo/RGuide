import { ListCategory } from "@/types";

export const SITE_NAME = "RGuide";
export const SITE_SEARCH_NAME = "RGuide Travel";
export const SITE_EMAIL = "hello@rguide.co";
export const SITE_EDITORIAL_EMAIL = "editorial@rguide.co";
export const SITE_ALTERNATE_NAMES = [
  "RGuide",
  "R Guide",
  "RGuide Travel",
  "R Guide Travel",
  "RGuide city guides",
  "RGuide travel guides",
  "RGuide City Guides",
];
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rguide.co";
export const SITE_DESCRIPTION =
  "RGuide Travel is an independent city travel guide platform for hotels, hostels, restaurants, bars, culture, itineraries, and neighborhood-led trips.";
export const SITE_KNOWS_ABOUT = [
  "city travel guides",
  "hotel guides",
  "hostel guides",
  "restaurant guides",
  "bar guides",
  "neighborhood travel planning",
  "culture guides",
  "travel itineraries",
];

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
    poiColor: string;
  }
> = {
  Food: {
    badge: "bg-amber-100 text-amber-800",
    filterActive: "border-amber-500 bg-amber-500 text-white",
    stopNumber: "bg-amber-500 text-white",
    stopDot: "bg-amber-500",
    mapColor: "#f59e0b",
    poiColor: "#b45309",
  },
  Nightlife: {
    badge: "bg-indigo-100 text-indigo-800",
    filterActive: "border-indigo-500 bg-indigo-500 text-white",
    stopNumber: "bg-indigo-500 text-white",
    stopDot: "bg-indigo-500",
    mapColor: "#6366f1",
    poiColor: "#4338ca",
  },
  Culture: {
    badge: "bg-rose-100 text-rose-800",
    filterActive: "border-rose-500 bg-rose-500 text-white",
    stopNumber: "bg-rose-500 text-white",
    stopDot: "bg-rose-500",
    mapColor: "#f43f5e",
    poiColor: "#be123c",
  },
  Stay: {
    badge: "bg-cyan-100 text-cyan-800",
    filterActive: "border-cyan-600 bg-cyan-600 text-white",
    stopNumber: "bg-cyan-600 text-white",
    stopDot: "bg-cyan-600",
    mapColor: "#0891b2",
    poiColor: "#0e7490",
  },
  Nature: {
    badge: "bg-emerald-100 text-emerald-800",
    filterActive: "border-emerald-500 bg-emerald-500 text-white",
    stopNumber: "bg-emerald-500 text-white",
    stopDot: "bg-emerald-500",
    mapColor: "#10b981",
    poiColor: "#047857",
  },
  Activities: {
    badge: "bg-orange-100 text-orange-800",
    filterActive: "border-orange-500 bg-orange-500 text-white",
    stopNumber: "bg-orange-500 text-white",
    stopDot: "bg-orange-500",
    mapColor: "#f97316",
    poiColor: "#c2410c",
  },
  Routes: {
    badge: "bg-blue-100 text-blue-800",
    filterActive: "border-blue-600 bg-blue-600 text-white",
    stopNumber: "bg-blue-600 text-white",
    stopDot: "bg-blue-600",
    mapColor: "#2563eb",
    poiColor: "#1d4ed8",
  },
  Essentials: {
    badge: "bg-violet-100 text-violet-800",
    filterActive: "border-violet-600 bg-violet-600 text-white",
    stopNumber: "bg-violet-600 text-white",
    stopDot: "bg-violet-600",
    mapColor: "#7c3aed",
    poiColor: "#6d28d9",
  },
};

export const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Most Popular", value: "most-popular" },
  { label: "Most Upvoted", value: "most-upvoted" },
] as const;
