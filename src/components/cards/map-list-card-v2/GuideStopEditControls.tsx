"use client";

import { GripVertical, Minus } from "@/components/icons/MaterialSymbol";

interface GuideStopEditControlsProps {
  name: string;
  onDragStart: () => void;
  onDragEnd: () => void;
  onRemove: () => void;
}

export function GuideStopEditControls({ name, onDragStart, onDragEnd, onRemove }: GuideStopEditControlsProps) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        draggable
        onDragStart={(event) => {
          event.stopPropagation();
          onDragStart();
          event.dataTransfer.effectAllowed = "move";
        }}
        onDragEnd={onDragEnd}
        className="inline-flex h-7 w-7 cursor-grab items-center justify-center rounded-md border border-slate-950/10 bg-white/80 text-slate-500 transition hover:border-slate-950/20 hover:text-slate-800 active:cursor-grabbing"
        aria-label={`Reorder ${name}`}
        title="Drag to reorder"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onRemove();
        }}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-rose-200 bg-white/80 text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
        aria-label={`Remove ${name}`}
        title={`Remove ${name}`}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
