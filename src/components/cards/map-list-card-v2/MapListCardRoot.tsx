"use client";

import type { ReactNode } from "react";

import type { MapList } from "@/types";

import type { GuideCardStyle } from "./types";

interface MapListCardRootProps {
  list: MapList;
  fillPane: boolean;
  expanded: boolean;
  expandedChrome: boolean;
  preservingListChrome: boolean;
  guideAccentColor: string;
  children: ReactNode;
  onHoverStart?: (list: MapList) => void;
  onHoverEnd?: () => void;
  onStopHoverClear?: () => void;
  isExternallyHovered?: boolean;
}

export function MapListCardRoot({
  list,
  fillPane,
  expanded,
  expandedChrome,
  preservingListChrome,
  guideAccentColor,
  children,
  onHoverStart,
  onHoverEnd,
  onStopHoverClear,
  isExternallyHovered = false,
}: MapListCardRootProps) {
  return (
    <article
      className={`group surface relative overflow-hidden transition-[background-color,border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        fillPane && expanded
          ? "flex h-full max-h-full min-h-0 flex-col !rounded-tr-lg !rounded-l-none !rounded-b-none !border-0 !shadow-none lg:!rounded-l-none lg:!rounded-r-lg"
          : ""
      } ${
        expandedChrome
          ? preservingListChrome
            ? "border border-slate-300 !bg-slate-50 p-3"
            : "border border-slate-300 !bg-slate-50 px-3 pb-3 pt-0"
          : "collapsed-guide-card p-3 hover:border-slate-950/30 focus-within:border-slate-950/30"
      }`}
      data-external-hover={isExternallyHovered ? "true" : undefined}
      style={!expandedChrome ? ({ "--guide-accent": guideAccentColor, borderColor: guideAccentColor } as GuideCardStyle) : undefined}
      onMouseEnter={() => onHoverStart?.(list)}
      onMouseLeave={() => {
        onStopHoverClear?.();
        onHoverEnd?.();
      }}
      onFocus={() => onHoverStart?.(list)}
      onBlur={() => {
        onStopHoverClear?.();
        onHoverEnd?.();
      }}
    >
      {!expandedChrome ? (
        <div
          className="pointer-events-none absolute left-0 top-3 z-20 h-[calc(100%-1.5rem)] w-1 origin-left rounded-r-full opacity-75 transition-[width,opacity] duration-300 group-hover:w-1.5 group-hover:opacity-100 group-focus-within:w-1.5 group-focus-within:opacity-100"
          style={{ backgroundColor: guideAccentColor }}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </article>
  );
}
