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
  const requestedContinentName = requestedScope?.continentName ?? null;
  const requestedLocale = requestedScope?.locale ?? "en";
  const initialCityName = appDataScope?.cityName ?? null;
  const initialCountryName = appDataScope?.countryName ?? null;
  const initialContinentName = appDataScope?.continentName ?? null;
  const initialLocale = appDataScope?.locale ?? "en";
  const initialDataForScope =
    requestedCityName === initialCityName &&
    requestedCountryName === initialCountryName &&
    requestedContinentName === initialContinentName &&
    requestedLocale === initialLocale
      ? initialAppData
      : undefined;
  const { data, isLoading } = useAppData(initialDataForScope, requestedScope);

  useEffect(() => {
    setRequestedScope(appDataScope);
  }, [appDataScope?.cityName, appDataScope?.countryName, appDataScope?.continentName, appDataScope?.locale]);

  const handleGuideDataRequested = useCallback((scope: AppDataScope) => {
    const normalizedCityName = scope.cityName?.trim() ?? "";
    const normalizedCountryName = scope.countryName?.trim() ?? "";
    const normalizedContinentName = scope.continentName?.trim() ?? "";
    setRequestedScope((current) => {
      const currentCityName = current?.cityName?.trim() ?? "";
      const currentCountryName = current?.countryName?.trim() ?? "";
      const currentContinentName = current?.continentName?.trim() ?? "";
      if (
        currentCityName === normalizedCityName &&
        currentCountryName === normalizedCountryName &&
        currentContinentName === normalizedContinentName
      ) {
        return current;
      }

      if (normalizedCityName) {
        return { cityName: normalizedCityName, locale: requestedLocale };
      }
      if (normalizedCountryName) {
        return { countryName: normalizedCountryName, locale: requestedLocale };
      }
      if (normalizedContinentName) {
        return { continentName: normalizedContinentName, locale: requestedLocale };
      }
      return { locale: requestedLocale };
    });
  }, [requestedLocale]);

  if (!data) {
    return null;
  }

  return (
    <SplitScreenSection
      {...props}
      locale={requestedLocale}
      continents={data.continents}
      initialEditorialGuides={data.guides}
      isGuideDataLoading={isLoading}
      onGuideDataRequested={handleGuideDataRequested}
    />
  );
}
