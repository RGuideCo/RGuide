import { City, Country, ListCategory, MapList, User } from "@/types";
import { SITE_URL } from "@/lib/constants";
import { slugify } from "@/lib/utils";

export function getAbsoluteHref(pathOrUrl: string) {
  return new URL(pathOrUrl, SITE_URL).toString();
}

export function getCityHref(city: Pick<City, "continent" | "country" | "name">) {
  return `/city/${slugify(city.name)}`;
}

export function getCountryHref(country: Pick<Country, "name">) {
  return `/country/${slugify(country.name)}`;
}

export function getCategoryHref(category: ListCategory) {
  return `/category/${slugify(category)}`;
}

export function getListHref(list: Pick<MapList, "slug">) {
  return `/list/${list.slug}`;
}

export function getEventHref(list: Pick<MapList, "slug">) {
  return `/events/${list.slug}`;
}

export function getVenueHref(venueId: string) {
  return `/venues/${encodeURIComponent(venueId)}`;
}

export function getGuideHref(list: Pick<MapList, "id" | "slug">) {
  return list.id.startsWith("event-") ? getEventHref(list) : getListHref(list);
}

export function getCreatorHref(user: Pick<User, "name">) {
  return `/creator/${slugify(user.name)}`;
}
