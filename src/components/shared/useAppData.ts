"use client";

import { useEffect, useState } from "react";

import type { Continent, MapList } from "@/types";

export interface AppData {
  continents: Continent[];
  guides: MapList[];
}

let appDataPromise: Promise<AppData> | null = null;
let appDataSnapshot: AppData | null = null;

function seedAppData(initialData: AppData) {
  appDataSnapshot = initialData;
  appDataPromise = Promise.resolve(initialData);
}

function loadAppData(options: { forceRefresh?: boolean } = {}) {
  if (appDataSnapshot && !options.forceRefresh) {
    return Promise.resolve(appDataSnapshot);
  }

  if (!appDataPromise || options.forceRefresh) {
    appDataPromise = fetch("/api/app-data", {
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
      appDataSnapshot = nextData;
      return nextData;
    });
  }

  return appDataPromise;
}

export function useAppData(initialData?: AppData) {
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (initialData) {
      seedAppData(initialData);
      setData(initialData);
      setError(null);

      loadAppData({ forceRefresh: true })
        .then((nextData) => {
          if (isMounted) {
            setData(nextData);
          }
        })
        .catch((nextError: Error) => {
          appDataPromise = Promise.resolve(initialData);
          console.error(nextError);
          if (isMounted) {
            setError(nextError);
          }
        });

      return () => {
        isMounted = false;
      };
    }

    loadAppData()
      .then((nextData) => {
        if (isMounted) {
          setData(nextData);
        }
      })
      .catch((nextError: Error) => {
        appDataPromise = null;
        console.error(nextError);
        if (isMounted) {
          setError(nextError);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [initialData]);

  return { data, error };
}
