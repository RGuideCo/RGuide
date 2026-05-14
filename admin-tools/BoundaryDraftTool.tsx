"use client";

import { useMemo, useState } from "react";
import type { Feature, Polygon } from "geojson";

type BoundaryDraftToolProps = {
  destinationId: string;
  destinationName: string;
  points: Array<[number, number]>;
  isDrawing: boolean;
  onToggleDrawing: () => void;
  onUndoPoint: () => void;
  onClearPoints: () => void;
};

export function createDraftBoundaryFeature({
  destinationId,
  destinationName,
  points,
}: {
  destinationId: string;
  destinationName: string;
  points: Array<[number, number]>;
}): Feature<Polygon> | null {
  if (points.length < 3) {
    return null;
  }

  return {
    type: "Feature",
    properties: {
      id: destinationId,
      name: destinationName,
      sourceId: "user-drawn-boundary-draft",
      provider: "RGuide local boundary draft tool",
      format: "manual-draft",
      notes: "User-drawn draft export for review; not official neighborhood boundary data.",
    },
    geometry: {
      type: "Polygon",
      coordinates: [[...points, points[0]]],
    },
  };
}

export function BoundaryDraftTool({
  destinationId,
  destinationName,
  points,
  isDrawing,
  onToggleDrawing,
  onUndoPoint,
  onClearPoints,
}: BoundaryDraftToolProps) {
  const [copied, setCopied] = useState(false);
  const draftFeature = useMemo(
    () => createDraftBoundaryFeature({ destinationId, destinationName, points }),
    [destinationId, destinationName, points],
  );

  const copyDraftBoundary = async () => {
    if (!draftFeature) {
      return;
    }

    await navigator.clipboard.writeText(JSON.stringify(draftFeature, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="rounded-md border border-slate-200 bg-white/95 p-3 text-xs text-slate-700 shadow-lg backdrop-blur">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-950">{destinationName} boundary draft</div>
          <div className="mt-1 leading-5 text-slate-600">
            Click the map to add points. Export is manual draft data, not an official source.
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-orange-100 px-2 py-1 font-medium text-orange-800">
          {points.length} pts
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-md bg-slate-950 px-3 py-1.5 font-medium text-white"
          onClick={onToggleDrawing}
        >
          {isDrawing ? "Pause" : "Draw"}
        </button>
        <button
          type="button"
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-800 disabled:cursor-not-allowed disabled:text-slate-400"
          disabled={points.length === 0}
          onClick={onUndoPoint}
        >
          Undo
        </button>
        <button
          type="button"
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-800 disabled:cursor-not-allowed disabled:text-slate-400"
          disabled={points.length === 0}
          onClick={onClearPoints}
        >
          Clear
        </button>
        <button
          type="button"
          className="rounded-md border border-orange-300 bg-orange-50 px-3 py-1.5 font-medium text-orange-800 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
          disabled={!draftFeature}
          onClick={copyDraftBoundary}
        >
          {copied ? "Copied" : "Copy GeoJSON"}
        </button>
      </div>
    </div>
  );
}
