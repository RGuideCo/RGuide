import type { City, Continent, Country, CountryState, SubArea } from "@/types";

export interface ClientGeographyScope {
  cityName?: string | null;
  countryName?: string | null;
  continentName?: string | null;
}

function normalizeScopeName(value?: string | null) {
  return value?.trim().toLocaleLowerCase() ?? "";
}

function compactSubarea(subarea: SubArea): SubArea {
  return {
    id: subarea.id,
    name: subarea.name,
    coordinates: subarea.coordinates,
    subareas: subarea.subareas?.map(compactSubarea),
  };
}

function compactState(state: CountryState): CountryState {
  return {
    ...compactSubarea(state),
    countrySubareaId: state.countrySubareaId,
  };
}

function compactCity(city: City, keepEditorialData: boolean): City {
  if (keepEditorialData) {
    return city;
  }

  return {
    id: city.id,
    name: city.name,
    country: city.country,
    continent: city.continent,
    coordinates: city.coordinates,
    countrySubareaId: city.countrySubareaId,
    stateId: city.stateId,
    isPlaceholderRegion: city.isPlaceholderRegion,
    regionKind: city.regionKind,
    subareas: city.subareas?.map(compactSubarea),
    image: city.image,
    listCount: city.listCount,
    description: "",
  };
}

function compactCountry(
  country: Country,
  options: {
    selectedCityName: string;
    selectedCountryName: string;
  },
): Country {
  const containsSelectedCity = country.cities.some(
    (city) => normalizeScopeName(city.name) === options.selectedCityName,
  );
  const isSelectedCountry =
    containsSelectedCity || normalizeScopeName(country.name) === options.selectedCountryName;

  return {
    id: country.id,
    name: country.name,
    continent: country.continent,
    description: isSelectedCountry ? country.description : "",
    image: country.image,
    cities: country.cities.map((city) =>
      compactCity(city, normalizeScopeName(city.name) === options.selectedCityName),
    ),
    subareas: isSelectedCountry ? country.subareas : country.subareas?.map(compactSubarea),
    states: isSelectedCountry ? country.states : country.states?.map(compactState),
    bounds: country.bounds,
  };
}

/**
 * Keep the full editorial geography for the active city and retain only the
 * navigation fields for other destinations. The active scope is reloaded when
 * a visitor changes destination, so unrelated city copy does not need to be
 * serialized into every route's React Server Component payload.
 */
export function getClientGeography(
  continents: Continent[],
  scope: ClientGeographyScope = {},
): Continent[] {
  const selectedCityName = normalizeScopeName(scope.cityName);
  const selectedCountryName = normalizeScopeName(scope.countryName);
  const selectedContinentName = normalizeScopeName(scope.continentName);

  return continents.map((continent) => {
    const isSelectedContinent =
      normalizeScopeName(continent.name) === selectedContinentName ||
      continent.countries.some(
        (country) =>
          normalizeScopeName(country.name) === selectedCountryName ||
          country.cities.some((city) => normalizeScopeName(city.name) === selectedCityName),
      );

    return {
      id: continent.id,
      name: continent.name,
      countries: continent.countries.map((country) =>
        compactCountry(country, { selectedCityName, selectedCountryName }),
      ),
      subareas: isSelectedContinent ? continent.subareas : continent.subareas?.map(compactSubarea),
      coordinates: continent.coordinates,
      bounds: continent.bounds,
      backgroundGradient: continent.backgroundGradient,
    };
  });
}
