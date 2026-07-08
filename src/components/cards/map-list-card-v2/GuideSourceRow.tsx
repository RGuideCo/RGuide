"use client";

import { ChevronDown } from "@/components/icons/MaterialSymbol";

import { getSourceSummary, getVariedGuideSources } from "./utils";
import type { GuideSource } from "./types";

interface GuideSourceRowProps {
  listId?: string;
  sources: GuideSource[];
  open?: boolean;
  onToggle?: () => void;
}

export function GuideSourceRow({ listId = "", sources, open = false, onToggle }: GuideSourceRowProps) {
  if (!sources.length) {
    return null;
  }

  const orderedSources = getVariedGuideSources(sources, listId);

  return (
    <div className="guide-content-cascade-item relative z-10 mt-3 border-t border-slate-200 px-4 pt-3">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 text-left"
        aria-expanded={open}
      >
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Sourced
        </span>
        <span className="h-px w-8 bg-slate-200" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-700">
          {getSourceSummary(orderedSources)}
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <ul className="mt-3 grid gap-2">
          {orderedSources.map((source) => (
            <li key={`${source.name}-${source.url}`}>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="block truncate rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:border-slate-300 hover:text-slate-950"
              >
                {source.name}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
