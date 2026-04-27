"use client";

import { InteractiveMap } from "@/components/map/InteractiveMap";
import { Continent, MapList, SelectionState } from "@/types";

interface SubmitMapPanelProps {
  continents: Continent[];
  selection: SelectionState;
  activeGuide?: MapList | null;
}

export function SubmitMapPanel({ continents, selection, activeGuide = null }: SubmitMapPanelProps) {
  return (
    <div className="surface h-full overflow-hidden p-0">
      <div className="h-full min-h-[68vh] [&>div]:h-full [&>div]:min-h-0">
        <InteractiveMap
          continents={continents}
          selection={selection}
          activeGuide={activeGuide}
          onSelectContinent={() => {}}
          onSelectCountry={() => {}}
          onSelectCity={() => {}}
          onSelectSubarea={() => {}}
          onSelectState={() => {}}
        />
      </div>
    </div>
  );
}
