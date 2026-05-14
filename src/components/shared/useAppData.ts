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

function loadAppData() {
  if (appDataSnapshot) {
    return Promise.resolve(appDataSnapshot);
  }

  if (!appDataPromise) {
    appDataPromise = fetch("/api/app-data", {
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
    if (initialData) {
      seedAppData(initialData);
      setData(initialData);
      setError(null);
      return;
    }

    let isMounted = true;

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
