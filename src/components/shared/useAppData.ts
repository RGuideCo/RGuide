"use client";

import { useEffect, useState } from "react";

import type { Continent, MapList } from "@/types";
import type { AppLocale } from "@/lib/i18n/config";

export interface AppData {
  continents: Continent[];
  guides: MapList[];
  locale?: AppLocale;
}

export interface AppDataScope {
  cityName?: string | null;
  countryName?: string | null;
  continentName?: string | null;
  locale?: AppLocale;
}

const appDataPromises = new Map<string, Promise<AppData>>();
const appDataSnapshots = new Map<string, AppData>();

function getAppDataKey(scope: AppDataScope = {}) {
  const cityName = scope.cityName?.trim().toLowerCase();
  const countryName = scope.countryName?.trim().toLowerCase();
  const continentName = scope.continentName?.trim().toLowerCase();
  const locale = scope.locale ?? "en";
  if (cityName) return `${locale}:city:${cityName}`;
  if (countryName) return `${locale}:country:${countryName}`;
  if (continentName) return `${locale}:continent:${continentName}`;
  return `${locale}:all`;
}

function getAppDataUrl(scope: AppDataScope = {}) {
  const cityName = scope.cityName?.trim();
  const countryName = scope.countryName?.trim();
  const continentName = scope.continentName?.trim();
  const locale = scope.locale ?? "en";

  const params = new URLSearchParams();
  params.set("locale", locale);
  if (cityName) {
    params.set("city", cityName);
  } else if (countryName) {
    params.set("country", countryName);
  } else if (continentName) {
    params.set("continent", continentName);
  }
  return `/api/app-data?${params.toString()}`;
}

function seedAppData(initialData: AppData, scope: AppDataScope = {}) {
  const key = getAppDataKey(scope);
  if (initialData.guides.length === 0) {
    return;
  }
  appDataSnapshots.set(key, initialData);
}

function hasCompleteInitialData(initialData: AppData, scope: AppDataScope) {
  if (initialData.guides.length === 0) {
    return false;
  }

  if (!scope.cityName) {
    return true;
  }

  return initialData.guides.every((guide) =>
    guide.stops.length > 0 && guide.stops.every((stop) => Boolean(stop.photo?.trim())),
  );
}

function loadAppData(scope: AppDataScope = {}) {
  const key = getAppDataKey(scope);
  const isDestinationScoped = Boolean(scope.cityName || scope.countryName || scope.continentName);

  if (!appDataPromises.has(key)) {
    const promise = fetch(getAppDataUrl(scope), {
      cache: isDestinationScoped ? "no-store" : "default",
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
    }).finally(() => {
      appDataPromises.delete(key);
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
  const continentName = scope.continentName ?? null;
  const locale = scope.locale ?? "en";

  useEffect(() => {
    let isMounted = true;
    const requestScope = { cityName, countryName, continentName, locale };
    const key = getAppDataKey(requestScope);

    const initialDataIsComplete = initialData
      ? hasCompleteInitialData(initialData, requestScope)
      : false;
    const cachedData = appDataSnapshots.get(key);

    if (initialData) {
      setData(initialData);
      setError(null);

      if (initialDataIsComplete) {
        seedAppData(initialData, requestScope);
        return () => {
          isMounted = false;
        };
      }
    } else if (cachedData) {
      setData(cachedData);
      setError(null);
    }

    loadAppData(requestScope)
      .then((nextData) => {
        if (isMounted) {
          setData(nextData);
        }
      })
      .catch((nextError: Error) => {
        console.error(nextError);
        if (isMounted) {
          setError(nextError);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [initialData, cityName, countryName, continentName, locale]);

  return { data, error };
}
