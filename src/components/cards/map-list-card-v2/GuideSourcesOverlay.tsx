"use client";

import Link from "next/link";
import { ChevronDown } from "@/components/icons/MaterialSymbol";

import type { GuideSource } from "./types";
import { getVariedGuideSources } from "./utils";

interface GuideSourcesOverlayProps {
  listId: string;
  sources: GuideSource[];
  open: boolean;
  getSourceIconUrl: (url: string) => string;
  onClose: () => void;
}

export function GuideSourcesOverlay({
  listId,
  sources,
  open,
  getSourceIconUrl,
  onClose,
}: GuideSourcesOverlayProps) {
  const orderedSources = getVariedGuideSources(sources, listId);

  return (
    <div
      className={`absolute inset-0 z-30 flex flex-col bg-white/95 p-3 backdrop-blur-sm transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{
        transform: open ? "translateY(0%)" : "translateY(100%)",
      }}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        className="mb-2 flex w-full items-center justify-between border-b border-slate-200 pb-2 text-left"
        aria-label="Collapse sources"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Sources
        </p>
        <span className="rounded-full p-1 text-slate-500 transition hover:bg-stone-100 hover:text-slate-700">
          <ChevronDown className="h-4 w-4 rotate-180" />
        </span>
      </button>
      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {orderedSources.map((source) => (
          <Link
            key={`${listId}-source-${source.name}`}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs text-slate-700 hover:bg-stone-100 hover:text-slate-900"
          >
            <img
              src={getSourceIconUrl(source.url)}
              alt={source.name}
              loading="lazy"
              decoding="async"
              className="h-4 w-4 rounded-full"
            />
            <span className="min-w-0 flex-1 truncate">{source.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
