import { editorialGuideLists } from "@/data/guides";
import type { MapList } from "@/types";

// Keep this exported template as the canonical list structure for real data entry.
export const mapListStructureTemplate: MapList = {
  id: "list-template-id",
  slug: "list-template-slug",
  title: "List Title",
  description: "Short list description.",
  url: "https://www.google.com/maps",
  category: "Food",
  location: {
    city: "City Name",
    country: "Country Name",
    continent: "Continent Name",
    scope: "city",
  },
  creator: {
    id: "creator-id",
    name: "R Food",
    avatar: "/avatars/r-food.png",
  },
  upvotes: 0,
  createdAt: "2026-01-01T00:00:00.000Z",
  stops: [],
  sources: [],
};

export const mapLists: MapList[] = editorialGuideLists;
