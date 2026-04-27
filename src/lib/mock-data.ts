import {
  cityLookup,
  continents,
  creatorLookup,
  hydratedCities,
  listLookup,
  mapLists,
  users,
} from "@/data";
import { CATEGORIES } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import { City, ListCategory } from "@/types";

export function getContinents() {
  return continents;
}

export function getAllCities() {
  return hydratedCities;
}

export function getAllLists() {
  return mapLists;
}

export function getCityBySlugPath(path: {
  continent: string;
  country: string;
  city: string;
}) {
  return cityLookup.get(`${path.continent}/${path.country}/${path.city}`);
}

export function getListsForCity(city: Pick<City, "name">) {
  return mapLists.filter((list) => list.location.scope === "city" && list.location.city === city.name);
}

export function getListsForCountry(path: Pick<City, "country" | "continent">) {
  return mapLists.filter(
    (list) =>
      list.location.scope === "country" &&
      list.location.country === path.country &&
      list.location.continent === path.continent,
  );
}

export function getListsForContinent(path: Pick<City, "continent">) {
  return mapLists.filter(
    (list) =>
      list.location.scope === "continent" &&
      list.location.continent === path.continent,
  );
}

export function getListsForCategory(categorySlug: string) {
  return mapLists.filter((list) => slugify(list.category) === categorySlug);
}

export function getCategoryLabel(categorySlug: string): ListCategory | undefined {
  return CATEGORIES.find((category) => slugify(category) === categorySlug);
}

export function getListBySlug(slug: string) {
  return listLookup.get(slug);
}

export function getListsByCreator(nameSlug: string) {
  const creator = creatorLookup.get(nameSlug);

  if (!creator) {
    return { creator: undefined, lists: [] };
  }

  return {
    creator,
    lists: mapLists.filter((list) => list.creator.id === creator.id),
  };
}

export function getUsers() {
  return users;
}
