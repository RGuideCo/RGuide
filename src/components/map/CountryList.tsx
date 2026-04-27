import {
  ChevronRight,
  MapPin,
} from "lucide-react";

import { StateShapeIcon } from "@/components/map/StateShapeIcon";
import { cn } from "@/lib/utils";
import { Country, SelectionState } from "@/types";

interface CountryListProps {
  country: Country;
  selection: SelectionState;
  expanded: boolean;
  hideHeader?: boolean;
  fillHeight?: boolean;
  framed?: boolean;
  mode?: "cities" | "regions" | "states";
  countrySubareas?: Country["subareas"];
  countryStates?: Country["states"];
  onToggleCountry: () => void;
  onSelectCity: (cityId: string, triggerEl?: HTMLButtonElement | null) => void;
  onSelectCountrySubarea?: (subareaId: string) => void;
  onSelectState?: (stateId: string, countrySubareaId: string, triggerEl?: HTMLButtonElement | null) => void;
}

export function CountryList({
  country,
  selection,
  expanded,
  hideHeader = false,
  fillHeight = false,
  framed = true,
  mode = "cities",
  countrySubareas = [],
  countryStates = [],
  onToggleCountry,
  onSelectCity,
  onSelectCountrySubarea,
  onSelectState,
}: CountryListProps) {
  const formatDisplayName = (value?: string | null) =>
    (value ?? "").replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s{2,}/g, " ").trim();
  const realCities = country.cities
    .filter((city) => !city.isPlaceholderRegion)
    .slice()
    .sort((left, right) => left.name.localeCompare(right.name));
  const showRegions = mode === "regions";
  const showStates = mode === "states";
  const sortedCountrySubareas = countrySubareas.slice().sort((left, right) => left.name.localeCompare(right.name));
  const sortedCountryStates = countryStates.slice().sort((left, right) => left.name.localeCompare(right.name));

  return (
    <div
      className={cn(
        fillHeight && "flex h-full min-h-0 flex-col",
        framed ? "rounded-2xl border border-slate-200 p-3" : "h-full",
      )}
    >
      {hideHeader ? null : (
        <button
          type="button"
          onClick={onToggleCountry}
          className="flex w-full items-center gap-3 text-left"
        >
          <div
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              selection.countryId === country.id ? "bg-orange-500" : "bg-slate-300",
            )}
          />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-slate-900">{country.name}</p>
          </div>
          <ChevronRight
            className={`h-4 w-4 text-slate-400 transition-transform ${expanded ? "rotate-90" : ""}`}
          />
        </button>
      )}

      {expanded &&
      (showRegions ? sortedCountrySubareas.length : showStates ? sortedCountryStates.length : realCities.length) ? (
        <div
          className={cn(
            "space-y-2",
            hideHeader ? "pt-0" : "mt-3 border-t border-slate-200 pt-3",
            fillHeight && "min-h-0 flex-1 overflow-y-auto",
          )}
        >
          {showStates
            ? sortedCountryStates.map((state) => (
                <button
                  key={state.id}
                  type="button"
                  title={state.name}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm",
                    selection.stateId === state.id
                      ? "bg-orange-50 text-orange-700"
                      : "text-slate-700 hover:bg-stone-100",
                  )}
                  onClick={(event) => onSelectState?.(state.id, state.countrySubareaId, event.currentTarget)}
                >
                  <StateShapeIcon countryId={country.id} stateId={state.id} />
                  <span data-morph-origin="label" className="inline-block">
                    {formatDisplayName(state.name)}
                  </span>
                </button>
              ))
            : showRegions
            ? sortedCountrySubareas.map((subarea) => (
                <button
                  key={subarea.id}
                  type="button"
                  title={subarea.name}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm",
                    selection.countrySubareaId === subarea.id
                      ? "bg-orange-50 text-orange-700"
                      : "text-slate-700 hover:bg-stone-100",
                  )}
                  onClick={() => onSelectCountrySubarea?.(subarea.id)}
                >
                  <MapPin className="h-4 w-4" />
                  {formatDisplayName(subarea.name)}
                </button>
              ))
            : realCities.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm",
                    selection.cityId === city.id
                      ? "bg-orange-50 text-orange-700"
                      : "text-slate-700 hover:bg-stone-100",
                  )}
                  onClick={(event) => onSelectCity(city.id, event.currentTarget)}
                >
                  <MapPin className="h-4 w-4" />
                  <span data-morph-origin="label" className="inline-block">
                    {city.name}
                  </span>
                </button>
              ))}
        </div>
      ) : null}
    </div>
  );
}
