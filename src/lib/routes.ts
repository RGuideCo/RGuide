import { City, ListCategory, MapList, User } from "@/types";
import { slugify } from "@/lib/utils";

export function getCityHref(city: Pick<City, "continent" | "country" | "name">) {
  return `/city/${slugify(city.continent)}/${slugify(city.country)}/${slugify(city.name)}`;
}

export function getCategoryHref(category: ListCategory) {
  return `/category/${slugify(category)}`;
}

export function getListHref(list: Pick<MapList, "slug">) {
  return `/list/${list.slug}`;
}

export function getCreatorHref(user: Pick<User, "name">) {
  return `/creator/${slugify(user.name)}`;
}
