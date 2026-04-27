import { useMemo } from "react";

import {
  COUNTRY_INPUT_ALIASES,
  PlacesBeenEntry,
  PlacesBeenFilter,
  getLevenshteinDistance,
  normalizePlacesBeenToken,
  profileLeftRailOptions,
  toTitleCase,
} from "@/components/home/split-screen-config";
import { Continent, MapList, SelectionState, User } from "@/types";

type UsePlacesBeenDirectoryInput = {
  continents: Continent[];
  profileLists: MapList[];
  manualPlacesBeenCountries: string[];
  manualPlacesBeenCities: string[];
  manualPlacesBeenPlaces: string[];
  activePlacesBeenFilter: PlacesBeenFilter;
  focusedPlacesBeenStopIds: string[] | null;
  isProfileMode: boolean;
  activeProfileLeftRail: (typeof profileLeftRailOptions)[number]["id"] | null;
  currentUser: User | null;
};

function toPlacesBeenId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item";
}

export function usePlacesBeenDirectory({
  continents,
  profileLists,
  manualPlacesBeenCountries,
  manualPlacesBeenCities,
  manualPlacesBeenPlaces,
  activePlacesBeenFilter,
  focusedPlacesBeenStopIds,
  isProfileMode,
  activeProfileLeftRail,
  currentUser,
}: UsePlacesBeenDirectoryInput) {
  const cityCoordinateLookup = useMemo(() => {
    const lookup = new Map<string, [number, number]>();
    for (const continent of continents) {
      for (const country of continent.countries) {
        for (const city of country.cities) {
          lookup.set(`${country.name}::${city.name}`, city.coordinates);
        }
      }
    }
    return lookup;
  }, [continents]);

  const placesBeenCollator = useMemo(
    () =>
      new Intl.Collator(undefined, {
        sensitivity: "base",
        numeric: true,
      }),
    [],
  );

  const knownCountryNameLookup = useMemo(() => {
    const lookup = new Map<string, string>();
    for (const continent of continents) {
      for (const country of continent.countries) {
        const normalizedKey = normalizePlacesBeenToken(country.name);
        if (!lookup.has(normalizedKey)) {
          lookup.set(normalizedKey, country.name);
        }
      }
    }
    return lookup;
  }, [continents]);

  const knownCountryNameEntries = useMemo(
    () => Array.from(knownCountryNameLookup.entries()),
    [knownCountryNameLookup],
  );

  const countrySelectionLookup = useMemo(() => {
    const lookup = new Map<string, SelectionState>();
    for (const continent of continents) {
      for (const country of continent.countries) {
        lookup.set(normalizePlacesBeenToken(country.name), {
          continentId: continent.id,
          countryId: country.id,
        });
      }
    }
    return lookup;
  }, [continents]);

  const citySelectionLookup = useMemo(() => {
    const lookup = new Map<string, SelectionState>();
    for (const continent of continents) {
      for (const country of continent.countries) {
        for (const city of country.cities) {
          lookup.set(
            `${normalizePlacesBeenToken(country.name)}::${normalizePlacesBeenToken(city.name)}`,
            {
              continentId: continent.id,
              countryId: country.id,
              countrySubareaId: city.countrySubareaId,
              stateId: city.stateId,
              cityId: city.id,
            },
          );
        }
      }
    }
    return lookup;
  }, [continents]);

  const cityNameLookup = useMemo(() => {
    const lookup = new Map<
      string,
      {
        cityName: string;
        countryName: string;
        coordinates: [number, number];
      }
    >();
    for (const continent of continents) {
      for (const country of continent.countries) {
        for (const city of country.cities) {
          const normalizedCityName = normalizePlacesBeenToken(city.name);
          if (!normalizedCityName || lookup.has(normalizedCityName)) {
            continue;
          }
          lookup.set(normalizedCityName, {
            cityName: city.name,
            countryName: country.name,
            coordinates: city.coordinates,
          });
        }
      }
    }
    return lookup;
  }, [continents]);

  const countryCoordinateLookup = useMemo(() => {
    const lookup = new Map<string, [number, number]>();
    for (const continent of continents) {
      for (const country of continent.countries) {
        const [southWest, northEast] = country.bounds;
        lookup.set(country.name, [
          (southWest[0] + northEast[0]) / 2,
          (southWest[1] + northEast[1]) / 2,
        ]);
      }
    }
    return lookup;
  }, [continents]);

  const resolveKnownCountryName = useMemo(
    () => (rawValue: string) => {
      const trimmed = rawValue.trim();
      if (!trimmed) {
        return "";
      }
      const normalizedInput = normalizePlacesBeenToken(trimmed);
      if (!normalizedInput) {
        return "";
      }
      const aliasCanonicalName = COUNTRY_INPUT_ALIASES[normalizedInput];
      if (aliasCanonicalName) {
        const aliasMatch = knownCountryNameLookup.get(normalizePlacesBeenToken(aliasCanonicalName));
        if (aliasMatch) {
          return aliasMatch;
        }
      }
      const directMatch = knownCountryNameLookup.get(normalizedInput);
      if (directMatch) {
        return directMatch;
      }

      let bestMatch:
        | {
            normalized: string;
            name: string;
            distance: number;
          }
        | null = null;

      for (const [normalizedCountryName, canonicalCountryName] of knownCountryNameEntries) {
        const distance = getLevenshteinDistance(normalizedInput, normalizedCountryName);
        if (!bestMatch || distance < bestMatch.distance) {
          bestMatch = {
            normalized: normalizedCountryName,
            name: canonicalCountryName,
            distance,
          };
        }
      }

      if (bestMatch) {
        const maxDistance = Math.min(3, Math.max(1, Math.floor(bestMatch.normalized.length * 0.28) + 1));
        if (bestMatch.distance <= maxDistance) {
          return bestMatch.name;
        }
      }

      return toTitleCase(trimmed);
    },
    [knownCountryNameEntries, knownCountryNameLookup],
  );

  const countries = useMemo(() => {
    const countriesByKey = new Map<string, PlacesBeenEntry>();

    for (const list of profileLists) {
      const countryName = resolveKnownCountryName(list.location.country ?? "") || "Other";
      const key = normalizePlacesBeenToken(countryName);
      if (countriesByKey.has(key)) {
        continue;
      }
      countriesByKey.set(key, {
        id: toPlacesBeenId(countryName),
        name: countryName,
        country: countryName,
        kind: "countries",
        coordinates: countryCoordinateLookup.get(countryName),
      });
    }
    for (const countryNameRaw of manualPlacesBeenCountries) {
      const countryName = resolveKnownCountryName(countryNameRaw);
      if (!countryName) {
        continue;
      }
      const key = normalizePlacesBeenToken(countryName);
      if (countriesByKey.has(key)) {
        continue;
      }
      countriesByKey.set(key, {
        id: toPlacesBeenId(countryName),
        name: countryName,
        country: countryName,
        kind: "countries",
        coordinates: countryCoordinateLookup.get(countryName),
      });
    }

    return Array.from(countriesByKey.values()).sort((left, right) =>
      placesBeenCollator.compare(left.name, right.name),
    );
  }, [
    countryCoordinateLookup,
    manualPlacesBeenCountries,
    placesBeenCollator,
    profileLists,
    resolveKnownCountryName,
  ]);

  const countryIds = useMemo(
    () =>
      countries
        .map((entry) => countrySelectionLookup.get(normalizePlacesBeenToken(entry.country))?.countryId)
        .filter((countryId): countryId is string => Boolean(countryId)),
    [countries, countrySelectionLookup],
  );

  const cities = useMemo(() => {
    const citiesByKey = new Map<string, PlacesBeenEntry>();

    for (const list of profileLists) {
      const cityName = (list.location.city ?? "").trim();
      if (!cityName) {
        continue;
      }
      const countryName = (list.location.country ?? "").trim() || "Other";
      const key = `${countryName.toLowerCase()}::${cityName.toLowerCase()}`;
      if (citiesByKey.has(key)) {
        continue;
      }
      citiesByKey.set(key, {
        id: toPlacesBeenId(`${countryName}-${cityName}`),
        name: cityName,
        country: countryName,
        kind: "cities",
        coordinates: cityCoordinateLookup.get(`${countryName}::${cityName}`) ?? countryCoordinateLookup.get(countryName),
      });
    }
    for (const rawEntry of manualPlacesBeenCities) {
      const [rawCityName, ...countryBits] = rawEntry
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
      const cityInput = rawCityName ?? rawEntry.trim();
      if (!cityInput) {
        continue;
      }
      const matchedCity = cityNameLookup.get(normalizePlacesBeenToken(cityInput));
      const cityName = matchedCity?.cityName ?? toTitleCase(cityInput);
      const countryInput = countryBits.join(", ");
      const countryName = resolveKnownCountryName(countryInput) || matchedCity?.countryName || "Other";
      const key = `${countryName.toLowerCase()}::${cityName.toLowerCase()}`;
      if (citiesByKey.has(key)) {
        continue;
      }
      citiesByKey.set(key, {
        id: toPlacesBeenId(`${countryName}-${cityName}`),
        name: cityName,
        country: countryName,
        kind: "cities",
        coordinates:
          cityCoordinateLookup.get(`${countryName}::${cityName}`) ??
          matchedCity?.coordinates ??
          countryCoordinateLookup.get(countryName),
      });
    }

    return Array.from(citiesByKey.values()).sort((left, right) => {
      const countryOrder = placesBeenCollator.compare(left.country, right.country);
      if (countryOrder !== 0) {
        return countryOrder;
      }
      return placesBeenCollator.compare(left.name, right.name);
    });
  }, [
    cityCoordinateLookup,
    cityNameLookup,
    countryCoordinateLookup,
    manualPlacesBeenCities,
    placesBeenCollator,
    profileLists,
    resolveKnownCountryName,
  ]);

  const places = useMemo(() => {
    const placesByKey = new Map<string, PlacesBeenEntry>();

    for (const list of profileLists) {
      const countryName = (list.location.country ?? "").trim() || "Other";
      for (const stop of list.stops) {
        const stopName = (stop.name ?? "").trim();
        if (!stopName) {
          continue;
        }
        const coordKey = `${stop.coordinates[0].toFixed(5)},${stop.coordinates[1].toFixed(5)}`;
        const key = `${countryName.toLowerCase()}::${stopName.toLowerCase()}::${coordKey}`;
        if (placesByKey.has(key)) {
          continue;
        }
        placesByKey.set(key, {
          id: toPlacesBeenId(`${countryName}-${stopName}-${coordKey}`),
          name: stopName,
          country: countryName,
          kind: "places",
          coordinates: stop.coordinates,
        });
      }
    }
    for (const rawEntry of manualPlacesBeenPlaces) {
      const [rawPlaceName, ...countryBits] = rawEntry
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
      const placeName = rawPlaceName ?? rawEntry.trim();
      if (!placeName) {
        continue;
      }
      const countryName = resolveKnownCountryName(countryBits.join(", ")) || "Other";
      const key = `${countryName.toLowerCase()}::${placeName.toLowerCase()}::manual`;
      if (placesByKey.has(key)) {
        continue;
      }
      placesByKey.set(key, {
        id: toPlacesBeenId(`${countryName}-${placeName}-manual`),
        name: placeName,
        country: countryName,
        kind: "places",
        coordinates: countryCoordinateLookup.get(countryName),
      });
    }

    return Array.from(placesByKey.values()).sort((left, right) => {
      const countryOrder = placesBeenCollator.compare(left.country, right.country);
      if (countryOrder !== 0) {
        return countryOrder;
      }
      return placesBeenCollator.compare(left.name, right.name);
    });
  }, [countryCoordinateLookup, manualPlacesBeenPlaces, placesBeenCollator, profileLists, resolveKnownCountryName]);

  const entries = useMemo(() => {
    if (activePlacesBeenFilter === "countries") {
      return countries;
    }
    if (activePlacesBeenFilter === "cities") {
      return cities;
    }
    return places;
  }, [activePlacesBeenFilter, cities, countries, places]);

  const summary = useMemo(() => {
    const countryCount = new Set(entries.map((entry) => entry.country)).size;
    const itemCount = entries.length;
    if (activePlacesBeenFilter === "countries") {
      return `${itemCount} ${itemCount === 1 ? "country" : "countries"}`;
    }
    const singularLabel = activePlacesBeenFilter === "cities" ? "city" : "place";
    const pluralLabel = activePlacesBeenFilter === "cities" ? "cities" : "places";
    return `${countryCount} ${countryCount === 1 ? "country" : "countries"} • ${itemCount} ${
      itemCount === 1 ? singularLabel : pluralLabel
    }`;
  }, [activePlacesBeenFilter, entries]);

  const byCountry = useMemo(() => {
    const grouped = new Map<string, PlacesBeenEntry[]>();
    for (const entry of entries) {
      if (!grouped.has(entry.country)) {
        grouped.set(entry.country, []);
      }
      grouped.get(entry.country)?.push(entry);
    }
    return Array.from(grouped.entries())
      .sort((left, right) => placesBeenCollator.compare(left[0], right[0]))
      .map(([country, groupedEntries]) => ({
        country,
        entries: groupedEntries
          .slice()
          .sort((left, right) => placesBeenCollator.compare(left.name, right.name)),
      }));
  }, [entries, placesBeenCollator]);

  const mappableEntries = useMemo(
    () => entries.filter((entry): entry is PlacesBeenEntry & { coordinates: [number, number] } => Boolean(entry.coordinates)),
    [entries],
  );

  const stopIdsByCountry = useMemo(() => {
    const grouped = new Map<string, string[]>();
    for (const entry of mappableEntries) {
      const stopId = `places-been-${entry.kind}-${entry.id}`;
      if (!grouped.has(entry.country)) {
        grouped.set(entry.country, []);
      }
      grouped.get(entry.country)?.push(stopId);
    }
    return grouped;
  }, [mappableEntries]);

  const mapStops = useMemo(
    () =>
      mappableEntries.map((entry) => ({
        id: `places-been-${entry.kind}-${entry.id}`,
        name: entry.name,
        coordinates: entry.coordinates,
        description:
          entry.kind === "countries"
            ? `${entry.country} overview saved from your profile activity.`
            : `Saved ${entry.kind === "cities" ? "city" : "place"} in ${entry.country}.`,
      })),
    [mappableEntries],
  );

  const activeStops = useMemo(() => {
    if (!focusedPlacesBeenStopIds?.length) {
      return mapStops;
    }
    const focusedIds = new Set(focusedPlacesBeenStopIds);
    const focusedStops = mapStops.filter((stop) => focusedIds.has(stop.id));
    return focusedStops.length ? focusedStops : mapStops;
  }, [focusedPlacesBeenStopIds, mapStops]);

  const guide = useMemo<MapList | null>(() => {
    if (
      !isProfileMode ||
      activeProfileLeftRail !== "places-been" ||
      activePlacesBeenFilter === "countries" ||
      !currentUser ||
      !activeStops.length
    ) {
      return null;
    }
    return {
      id: `profile-places-been-${currentUser.id}`,
      slug: `profile-places-been-${currentUser.id}`,
      title: "Places Been",
      description: summary,
      url: "https://maps.google.com",
      category: "Activities",
      location: {
        continent: "Global",
        country: "Global",
        scope: "continent",
      },
      creator: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      upvotes: 0,
      createdAt: "2026-01-01T00:00:00.000Z",
      stops: activeStops,
    };
  }, [activePlacesBeenFilter, activeProfileLeftRail, activeStops, currentUser, isProfileMode, summary]);

  return {
    countries,
    countryIds,
    cities,
    places,
    entries,
    summary,
    byCountry,
    stopIdsByCountry,
    mapStops,
    guide,
    normalizePlacesBeenKey: normalizePlacesBeenToken,
    resolveKnownCountryName,
    countrySelectionLookup,
    citySelectionLookup,
  };
}
