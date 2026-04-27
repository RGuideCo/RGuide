import { continents, cities } from "@/data/geography";
import { mapLists } from "@/data/lists";
import { users } from "@/data/users";
import { slugify } from "@/lib/utils";

export { continents, cities, mapLists, users };

export const popularCities = [...cities]
  .map((city) => ({
    ...city,
    listCount: mapLists.filter((list) => list.location.city === city.name).length,
  }))
  .sort((a, b) => b.listCount - a.listCount || a.name.localeCompare(b.name))
  .slice(0, 10);

export const trendingLists = [...mapLists]
  .sort((a, b) => b.upvotes - a.upvotes)
  .slice(0, 6);

export const hydratedCities = cities.map((city) => ({
  ...city,
  listCount: mapLists.filter((list) => list.location.city === city.name).length,
}));

export const cityLookup = new Map(
  hydratedCities.map((city) => [
    `${slugify(city.continent)}/${slugify(city.country)}/${slugify(city.name)}`,
    city,
  ]),
);

export const listLookup = new Map(mapLists.map((list) => [list.slug, list]));
export const creatorLookup = new Map(users.map((user) => [slugify(user.name), user]));
