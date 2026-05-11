import type { MapList } from "@/types";

export function formatAttributeTagLabel(tag: string) {
  return tag
    .replace(/_(food|nightlife|drinks)$/g, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getPoiAttributeTags(stop: MapList["stops"][number]) {
  return [...(stop.attributeTags ?? []), ...(stop.tags ?? [])]
    .filter(Boolean)
    .filter((tag, index, all) => all.findIndex((item) => item.toLowerCase() === tag.toLowerCase()) === index)
    .slice(0, 4)
    .map(formatAttributeTagLabel);
}
