import { Dispatch, SetStateAction, useCallback, useEffect, useMemo } from "react";

import { normalizePlacesBeenToken } from "@/components/home/split-screen-config";
import { useAppStore } from "@/store/app-store";
import { User } from "@/types";

type PlacesBeenKey = "countries" | "cities" | "places";

type PersistedPlacesBeenState = {
  manualPlacesBeenCountries: string[];
  setManualPlacesBeenCountries: Dispatch<SetStateAction<string[]>>;
  manualPlacesBeenCities: string[];
  setManualPlacesBeenCities: Dispatch<SetStateAction<string[]>>;
  manualPlacesBeenPlaces: string[];
  setManualPlacesBeenPlaces: Dispatch<SetStateAction<string[]>>;
};

const EMPTY_PLACES_BEEN = {
  countries: [] as string[],
  cities: [] as string[],
  places: [] as string[],
};

function dedupePlacesBeenValues(values: string[]) {
  return Array.from(
    new Map(
      values
        .filter((value): value is string => typeof value === "string")
        .map((value) => [normalizePlacesBeenToken(value), value.trim()] as const)
        .filter(([key, value]) => Boolean(key) && Boolean(value)),
    ).values(),
  );
}

function readLegacyPlacesBeenList(userId: string, key: PlacesBeenKey) {
  const raw = window.localStorage.getItem(`rguide:places-been-${key}:${userId}`);
  if (!raw) {
    return [] as string[];
  }
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? dedupePlacesBeenValues(parsed) : [];
}

export function usePersistedPlacesBeen(currentUser: User | null): PersistedPlacesBeenState {
  const userId = currentUser?.id ?? null;
  const placesBeenByUserId = useAppStore((state) => state.placesBeenByUserId);
  const setPlacesBeenForUser = useAppStore((state) => state.setPlacesBeenForUser);

  const entries = userId ? placesBeenByUserId[userId] ?? EMPTY_PLACES_BEEN : EMPTY_PLACES_BEEN;

  useEffect(() => {
    if (typeof window === "undefined" || !userId) {
      return;
    }

    const current = placesBeenByUserId[userId] ?? EMPTY_PLACES_BEEN;
    if (current.countries.length || current.cities.length || current.places.length) {
      return;
    }

    try {
      const legacyEntries = {
        countries: readLegacyPlacesBeenList(userId, "countries"),
        cities: readLegacyPlacesBeenList(userId, "cities"),
        places: readLegacyPlacesBeenList(userId, "places"),
      };
      if (legacyEntries.countries.length || legacyEntries.cities.length || legacyEntries.places.length) {
        setPlacesBeenForUser(userId, legacyEntries);
      }
    } catch {
      // Ignore malformed legacy storage. The centralized store remains the source of truth.
    }
  }, [placesBeenByUserId, setPlacesBeenForUser, userId]);

  const setEntryList = useCallback(
    (key: PlacesBeenKey, nextValue: SetStateAction<string[]>) => {
      if (!userId) {
        return;
      }
      const current = placesBeenByUserId[userId] ?? EMPTY_PLACES_BEEN;
      const currentList = current[key];
      const nextList =
        typeof nextValue === "function"
          ? (nextValue as (currentValue: string[]) => string[])(currentList)
          : nextValue;
      setPlacesBeenForUser(userId, {
        [key]: dedupePlacesBeenValues(nextList),
      });
    },
    [placesBeenByUserId, setPlacesBeenForUser, userId],
  );

  return useMemo(
    () => ({
      manualPlacesBeenCountries: entries.countries,
      setManualPlacesBeenCountries: (nextValue) => setEntryList("countries", nextValue),
      manualPlacesBeenCities: entries.cities,
      setManualPlacesBeenCities: (nextValue) => setEntryList("cities", nextValue),
      manualPlacesBeenPlaces: entries.places,
      setManualPlacesBeenPlaces: (nextValue) => setEntryList("places", nextValue),
    }),
    [entries.cities, entries.countries, entries.places, setEntryList],
  );
}
