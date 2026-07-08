"use client";

import type { MouseEvent } from "react";
import { ChevronDown } from "@/components/icons/MaterialSymbol";

import type { GuideSource } from "./types";
import { getVariedGuideSources } from "./utils";

interface GuideSourceSummaryProps {
  listId: string;
  sources: GuideSource[];
  sourceSummary: string;
  getSourceIconUrl: (url: string) => string;
  variant: "collapsed" | "expanded-top";
  open?: boolean;
  onToggle?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export function GuideSourceSummary({
  listId,
  sources,
  sourceSummary,
  getSourceIconUrl,
  variant,
  open = false,
  onToggle,
}: GuideSourceSummaryProps) {
  const orderedSources = getVariedGuideSources(sources, listId);
  const sourcePreview = orderedSources.slice(0, 3);
  const collapsedRemainingSourceCount = Math.max(0, sources.length - sourcePreview.length);
  const collapsedSourceLabel =
    collapsedRemainingSourceCount > 0
      ? `+${collapsedRemainingSourceCount} Sources`
      : `${sources.length} ${sources.length === 1 ? "Source" : "Sources"}`;

  if (!sourceSummary) {
    return null;
  }

  if (variant === "collapsed") {
    return (
      <div
        className="relative z-10 mt-2 flex w-full items-center gap-2 border-t border-slate-950/15 pt-1.5 text-left"
        aria-label="Guide sources"
      >
        <span className="flex shrink-0 items-center gap-1">
          {sourcePreview.map((source, index) => (
            <span
              key={`${listId}-source-strip-${source.name}-${index}`}
              className="inline-flex h-5 w-5 items-center justify-center overflow-hidden bg-white ring-1 ring-slate-200"
              title={source.name}
            >
              <img
                src={getSourceIconUrl(source.url)}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-4 w-4"
              />
            </span>
          ))}
        </span>
        <span className="min-w-0 flex-1 truncate text-[11px] font-semibold leading-none text-slate-600">
          {collapsedSourceLabel}
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className="ml-auto flex max-w-[52%] items-center justify-end gap-2 text-right transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
      aria-label="Show guide sources"
      aria-expanded={open}
    >
      <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        Sourced
      </span>
      <span className="flex shrink-0 items-center gap-1">
        {sourcePreview.map((source, index) => (
          <span
            key={`${listId}-expanded-source-top-${source.name}-${index}`}
            className="inline-flex h-4 w-4 items-center justify-center overflow-hidden bg-white ring-1 ring-slate-200"
            title={source.name}
          >
            <img
              src={getSourceIconUrl(source.url)}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-3 w-3"
            />
          </span>
        ))}
      </span>
      <span className="min-w-0 truncate text-[11px] font-medium leading-none text-slate-600">
        {sourceSummary}
      </span>
      <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
  );
}
