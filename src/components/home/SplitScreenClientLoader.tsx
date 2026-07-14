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
  const requestedCountryName = requestedScope?.countryName ?? null;
  const initialCityName = appDataScope?.cityName ?? null;
  const initialCountryName = appDataScope?.countryName ?? null;
  const initialDataForScope =
    requestedCityName === initialCityName && requestedCountryName === initialCountryName
      ? initialAppData
      : undefined;
  const { data } = useAppData(initialDataForScope, requestedScope);

  useEffect(() => {
    setRequestedScope(appDataScope);
  }, [appDataScope?.cityName, appDataScope?.countryName]);

  const handleGuideDataRequested = useCallback((scope: AppDataScope) => {
    const normalizedCityName = scope.cityName?.trim() ?? "";
    const normalizedCountryName = scope.countryName?.trim() ?? "";
    setRequestedScope((current) => {
      const currentCityName = current?.cityName?.trim() ?? "";
      const currentCountryName = current?.countryName?.trim() ?? "";
      if (currentCityName === normalizedCityName && currentCountryName === normalizedCountryName) {
        return current;
      }

      if (normalizedCityName) {
        return { cityName: normalizedCityName };
      }
      if (normalizedCountryName) {
        return { countryName: normalizedCountryName };
      }
      return {};
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
      onGuideDataRequested={handleGuideDataRequested}
    />
  );
}
