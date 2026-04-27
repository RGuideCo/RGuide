import { ChevronDown, Globe2 } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Continent } from "@/types";

interface ContinentCardProps {
  continent: Continent;
  isActive: boolean;
  isExpanded: boolean;
  hideHeader?: boolean;
  onToggle: () => void;
  children: ReactNode;
}

const continentIconById: Record<string, string> = {
  africa: "/assets/continents/africa.svg",
  asia: "/assets/continents/asia.svg",
  europe: "/assets/continents/europe.svg",
  "north-america": "/assets/continents/north-america.svg",
  "south-america": "/assets/continents/south-america.svg",
  oceania: "/assets/continents/oceania.svg",
};

export function ContinentCard({
  continent,
  isActive,
  isExpanded,
  hideHeader = false,
  onToggle,
  children,
}: ContinentCardProps) {
  const countryCount = continent.countries.length;
  const cityCount = continent.countries.reduce((total, country) => total + country.cities.length, 0);
  const continentIcon = continentIconById[continent.id];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.5rem] border bg-white transition",
        isActive ? "border-orange-300 shadow-soft" : "border-slate-200",
      )}
    >
      {hideHeader ? null : (
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center gap-4 p-5 text-left"
        >
          <div
            className={`flex h-12 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${continent.backgroundGradient}`}
          >
            {continentIcon ? (
              <img
                src={continentIcon}
                alt=""
                aria-hidden="true"
                className="h-9 w-auto max-w-none opacity-85"
              />
            ) : (
              <Globe2 className="h-5 w-5 text-slate-700" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900">{continent.name}</p>
            <p className="mt-1 text-sm text-slate-600">
              {countryCount} countries • {cityCount} cities
            </p>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      )}
      {isExpanded ? (
        <div className={cn("px-5 py-4", hideHeader ? "" : "border-t border-slate-200")}>{children}</div>
      ) : null}
    </div>
  );
}
