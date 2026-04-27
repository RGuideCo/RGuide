"use client";

import { useMemo, useState } from "react";

import { MapListCard } from "@/components/cards/MapListCard";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { Continent, MapList, SelectionState } from "@/types";

interface ListGuideWorkspaceProps {
  list: MapList;
  continents: Continent[];
}

export function ListGuideWorkspace({ list, continents }: ListGuideWorkspaceProps) {
  const selection: SelectionState = useMemo(() => ({}), []);
  const [isGuideExpanded, setIsGuideExpanded] = useState(true);
  const [selectedGuideStopId, setSelectedGuideStopId] = useState<string | null>(null);
  const [selectedGuideStopNonce, setSelectedGuideStopNonce] = useState(0);

  const noopSelectContinent = () => {};
  const noopSelectCountry = () => {};
  const noopSelectCity = () => {};
  const noopSelectSubarea = () => {};
  const noopSelectState = () => {};
  const noopHoverGuideStop = () => {};
  const handleSelectGuideStop = (stopId: string) => {
    setIsGuideExpanded(true);
    setSelectedGuideStopId(stopId);
    setSelectedGuideStopNonce((current) => current + 1);
  };
  const handleGuideToggle = () => {
    setIsGuideExpanded((current) => !current);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(460px,1fr)]">
      <div className="surface overflow-hidden p-0">
        <div className="min-h-[68vh]">
          <InteractiveMap
            continents={continents}
            selection={selection}
            guideFocus={null}
            activeGuide={list}
            onHoverGuideStop={noopHoverGuideStop}
            onSelectGuideStop={handleSelectGuideStop}
            onSelectContinent={noopSelectContinent}
            onSelectCountry={noopSelectCountry}
            onSelectCity={noopSelectCity}
            onSelectSubarea={noopSelectSubarea}
            onSelectState={noopSelectState}
          />
        </div>
      </div>
      <div className="surface p-4 sm:p-5">
        <MapListCard
          list={list}
          expandable
          expanded={isGuideExpanded}
          onToggleExpand={handleGuideToggle}
          forceExpandStopId={selectedGuideStopId}
          forceExpandStopNonce={selectedGuideStopNonce}
        />
      </div>
    </div>
  );
}
