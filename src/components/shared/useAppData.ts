"use client";

import { useEffect, useState } from "react";

import type { Continent, MapList } from "@/types";

export interface AppData {
  continents: Continent[];
  guides: MapList[];
}

export interface AppDataScope {
  cityName?: string | null;
  countryName?: string | null;
}

const appDataPromises = new Map<string, Promise<AppData>>();
const appDataSnapshots = new Map<string, AppData>();

function getAppDataKey(scope: AppDataScope = {}) {
  const cityName = scope.cityName?.trim().toLowerCase();
  const countryName = scope.countryName?.trim().toLowerCase();
  if (cityName) return `city:${cityName}`;
  if (countryName) return `country:${countryName}`;
  return "all";
}

function getAppDataUrl(scope: AppDataScope = {}) {
  const cityName = scope.cityName?.trim();
  const countryName = scope.countryName?.trim();
  if (!cityName && !countryName) return "/api/app-data";

  const params = new URLSearchParams();
  if (cityName) {
    params.set("city", cityName);
  } else if (countryName) {
    params.set("country", countryName);
  }
  return `/api/app-data?${params.toString()}`;
}

function seedAppData(initialData: AppData, scope: AppDataScope = {}) {
  const key = getAppDataKey(scope);
  appDataSnapshots.set(key, initialData);
  appDataPromises.set(key, Promise.resolve(initialData));
}

function loadAppData(options: { forceRefresh?: boolean; scope?: AppDataScope } = {}) {
  const key = getAppDataKey(options.scope);
  const snapshot = appDataSnapshots.get(key);

  if (snapshot && !options.forceRefresh) {
    return Promise.resolve(snapshot);
  }

  if (!appDataPromises.has(key) || options.forceRefresh) {
    const promise = fetch(getAppDataUrl(options.scope), {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to load RGuide app data (${response.status})`);
      }

      return response.json() as Promise<AppData>;
    }).then((nextData) => {
      appDataSnapshots.set(key, nextData);
      return nextData;
    });

    appDataPromises.set(key, promise);
  }

  return appDataPromises.get(key) as Promise<AppData>;
}

export function useAppData(initialData?: AppData, scope: AppDataScope = {}) {
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const cityName = scope.cityName ?? null;
  const countryName = scope.countryName ?? null;

  useEffect(() => {
    let isMounted = true;
    const requestScope = { cityName, countryName };
    const key = getAppDataKey(requestScope);

    if (initialData) {
      seedAppData(initialData, requestScope);
      setData(initialData);
      setError(null);

      return () => {
        isMounted = false;
      };
    }

    loadAppData({ scope: requestScope })
      .then((nextData) => {
        if (isMounted) {
          setData(nextData);
        }
      })
      .catch((nextError: Error) => {
        appDataPromises.delete(key);
        console.error(nextError);
        if (isMounted) {
          setError(nextError);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [initialData, cityName, countryName]);

  return { data, error };
}
