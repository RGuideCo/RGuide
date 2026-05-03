import type { Continent } from "@/types";

export function getCitiesFromContinents(continents: Continent[]) {
  return continents.flatMap((continent) => continent.countries.flatMap((country) => country.cities));
}
