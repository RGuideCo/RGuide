"use client";

import { useEffect, useState } from "react";

import type { Continent, MapList } from "@/types";

export interface AppData {
  continents: Continent[];
  guides: MapList[];
}

let appDataPromise: Promise<AppData> | null = null;

function loadAppData() {
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
    });
  }

  return appDataPromise;
}

export function useAppData() {
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
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
  }, []);

  return { data, error };
}
