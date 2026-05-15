import type { ListCategory, MapList } from "@/types";

export function formatAttributeTagLabel(tag: string) {
  return tag
    .replace(/_(food|nightlife|drinks)$/g, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function valuesFromMaybeArray(value?: string | string[]) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function inferPoiAttributeTags(stop: MapList["stops"][number], fallbackCategory?: ListCategory) {
  const category = stop.category ?? fallbackCategory;
  const searchable = `${stop.id} ${stop.name}`.toLowerCase();
  const tags = [
    ...valuesFromMaybeArray(stop.subcategories),
    ...valuesFromMaybeArray(stop.subcategory),
    ...valuesFromMaybeArray(stop.lodgingType),
    ...valuesFromMaybeArray(stop.foodServiceType),
    ...valuesFromMaybeArray(stop.nightlifeType),
    ...valuesFromMaybeArray(stop.venueKind),
  ];

  if (category === "Stay") {
    tags.push(searchable.includes("hostel") ? "hostel" : "hotel");
    if (stop.price === "$") tags.push("budget");
    if (stop.price === "$$$") tags.push("luxury");
  } else if (category === "Food") {
    if (searchable.includes("market")) {
      tags.push("market");
    } else if (searchable.includes("cafe") || searchable.includes("coffee")) {
      tags.push("cafe");
    } else {
      tags.push("restaurant");
    }
    if (stop.price === "$") tags.push("budget_food");
    if (stop.price === "$$$") tags.push("splurge_food");
  } else if (category === "Nightlife") {
    if (searchable.includes("pub")) {
      tags.push("pub");
    } else if (searchable.includes("club")) {
      tags.push("club");
    } else if (searchable.includes("theatre") || searchable.includes("music")) {
      tags.push("live_music");
    } else {
      tags.push("bar");
    }
  } else if (category === "Culture") {
    if (searchable.includes("museum")) tags.push("museum");
    else if (searchable.includes("gallery")) tags.push("gallery");
    else if (searchable.includes("theatre") || searchable.includes("opera")) tags.push("theatre_show");
    else if (searchable.includes("market")) tags.push("market");
    else tags.push("landmark");
  } else if (category === "Nature") {
    if (searchable.includes("canal")) tags.push("waterfront");
    else if (searchable.includes("garden")) tags.push("garden");
    else tags.push("park");
  }

  return tags;
}

export function getPoiAttributeTags(stop: MapList["stops"][number], fallbackCategory?: ListCategory) {
  return [...(stop.attributeTags ?? []), ...(stop.tags ?? []), ...inferPoiAttributeTags(stop, fallbackCategory)]
    .filter(Boolean)
    .filter((tag, index, all) => all.findIndex((item) => item.toLowerCase() === tag.toLowerCase()) === index)
    .slice(0, 4)
    .map(formatAttributeTagLabel);
}
