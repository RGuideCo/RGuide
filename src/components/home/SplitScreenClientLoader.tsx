"use client";

import dynamic from "next/dynamic";

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
  const { data } = useAppData(initialAppData, appDataScope);

  if (!data) {
    return null;
  }

  return (
    <SplitScreenSection
      {...props}
      continents={data.continents}
      initialEditorialGuides={data.guides}
    />
  );
}
