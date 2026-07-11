"use client";

import type { ReactNode } from "react";

import { ChevronDown, Plus } from "@/components/icons/MaterialSymbol";

interface GuideStopHeaderProps {
  panelId: string;
  name: string;
  index: number;
  eventTime?: string;
  placeCount?: number;
  price?: string;
  priceSource?: string;
  showStopNumbers: boolean;
  isExpanded: boolean;
  isEditing: boolean;
  isAddActive: boolean;
  showAddAction: boolean;
  titleContent?: ReactNode;
  editActions?: ReactNode;
  onStopSelect?: () => void;
  onHeaderActivate?: () => void;
  onHoverChange?: (isHovered: boolean) => void;
  onAddStop?: () => void;
  onToggle?: () => void;
}

export function GuideStopHeader({
  panelId,
  name,
  index,
  eventTime,
  placeCount = 0,
  price,
  priceSource,
  showStopNumbers,
  isExpanded,
  isEditing,
  isAddActive,
  showAddAction,
  titleContent,
  editActions,
  onStopSelect,
  onHeaderActivate,
  onHoverChange,
  onAddStop,
  onToggle,
}: GuideStopHeaderProps) {
  const title = titleContent ?? <span className="block text-base font-semibold leading-5 text-slate-900">{name}</span>;
  const activateHeader = onHeaderActivate ?? onStopSelect;

  return (
    <div className="expanded-guide-stop-title-row flex w-full items-center gap-2 px-3 py-2.5 pl-4 text-left text-sm text-slate-700">
      <button
        type="button"
        onClick={onStopSelect}
        onFocus={() => onHoverChange?.(true)}
        onBlur={() => onHoverChange?.(false)}
        className={`expanded-guide-stop-number-button inline-flex shrink-0 items-center justify-center font-mono font-semibold text-white shadow-sm transition hover:brightness-95 focus-visible:ring-2 focus-visible:ring-slate-400/50 ${
          showStopNumbers ? "h-6 w-6 rounded-md text-xs" : "h-2.5 w-2.5 rounded-full"
        }`}
        style={{ backgroundColor: "var(--guide-accent, #64748b)" }}
        aria-label={`Select ${name} on map`}
        title={`Select ${name} on map`}
      >
        {showStopNumbers ? index + 1 : null}
      </button>
      {isEditing ? (
        <div className="expanded-guide-stop-name-control min-w-0 flex-1 select-text">
          {title}
          {eventTime ? (
            <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500">
              {eventTime}
            </span>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          onClick={activateHeader}
          onFocus={() => onHoverChange?.(true)}
          onBlur={() => onHoverChange?.(false)}
          className="expanded-guide-stop-name-control flex min-w-0 flex-1 cursor-pointer select-text items-center gap-2 text-left"
        >
          <span className="min-w-0 flex-1">
            {title}
            {eventTime ? (
              <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500">
                {eventTime}
              </span>
            ) : null}
          </span>
        </button>
      )}
      {placeCount ? (
        <span className="rounded-md bg-slate-950/[0.04] px-2 py-0.5 text-[10px] font-medium uppercase text-slate-600 ring-1 ring-slate-950/[0.04]">
          {placeCount} places
        </span>
      ) : null}
      {price ? (
        <span
          title={priceSource ? `Price source: ${priceSource}` : "Restaurant price tier"}
          className="expanded-guide-stop-price-button inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md bg-white/80 px-2 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-950/10"
        >
          {price}
        </span>
      ) : null}
      {editActions}
      {isExpanded && showAddAction ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onAddStop?.();
          }}
          className={`expanded-guide-stop-add-button inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium transition ${
            isAddActive
              ? "border-emerald-600 bg-emerald-600 text-white"
              : "border-slate-950/10 bg-white/80 text-slate-700 hover:border-slate-950/20 hover:text-slate-900"
          }`}
          aria-label="Add"
          title="Add"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      ) : null}
      <button
        type="button"
        onClick={onToggle}
        onFocus={() => onHoverChange?.(true)}
        onBlur={() => onHoverChange?.(false)}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        className="expanded-guide-stop-toggle-button inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-950/[0.04] hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-slate-300"
        aria-label={`${isExpanded ? "Collapse" : "Expand"} ${name}`}
        title={`${isExpanded ? "Collapse" : "Expand"} ${name}`}
      >
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
}
