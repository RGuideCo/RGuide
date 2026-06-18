"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

import { useAppData } from "@/components/shared/useAppData";
import type { AppData, AppDataScope } from "@/components/shared/useAppData";
import type { SplitScreenSectionProps } from "@/components/home/SplitScreenSection";

const SplitScreenSection = dynamic(
  () => import("@/components/home/SplitScreenSection").then((module) => module.SplitScreenSection),
  {
    ssr: false,
    loading: () => null,
  },
);

type SplitScreenClientLoaderProps = Omit<
  SplitScreenSectionProps,
  "continents" | "initialEditorialGuides"
> & {
  initialAppData?: AppData;
  appDataScope?: AppDataScope;
};

export function SplitScreenClientLoader({ initialAppData, appDataScope, ...props }: SplitScreenClientLoaderProps) {
  const [requestedScope, setRequestedScope] = useState<AppDataScope | undefined>(appDataScope);
  const requestedCityName = requestedScope?.cityName ?? null;
  const initialCityName = appDataScope?.cityName ?? null;
  const initialDataForScope = requestedCityName === initialCityName ? initialAppData : undefined;
  const { data } = useAppData(initialDataForScope, requestedScope);

  useEffect(() => {
    setRequestedScope(appDataScope);
  }, [appDataScope?.cityName]);

  const handleCityDataRequested = useCallback((cityName: string) => {
    const normalizedCityName = cityName.trim();
    if (!normalizedCityName) {
      return;
    }

    setRequestedScope((current) => {
      if (current?.cityName === normalizedCityName) {
        return current;
      }

      return { cityName: normalizedCityName };
    });
  }, []);

  if (!data) {
    return null;
  }

  return (
    <SplitScreenSection
      {...props}
      continents={data.continents}
      initialEditorialGuides={data.guides}
      onCityDataRequested={handleCityDataRequested}
    />
  );
}
