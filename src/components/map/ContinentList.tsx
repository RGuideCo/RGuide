"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

import { ContinentCard } from "@/components/map/ContinentCard";
import { CountryFlag } from "@/components/map/CountryFlag";
import { CountryList } from "@/components/map/CountryList";
import { Continent, SelectionState } from "@/types";

interface ContinentListProps {
  continents: Continent[];
  selection: SelectionState;
  continentRootRevealKey?: string;
  continentBrowseView?: "countries" | "regions";
  countryBrowseView?: "cities" | "regions";
  onSelectContinent: (continentId: string) => void;
  onSelectContinentSubarea?: (continentId: string, subareaId: string) => void;
  onSelectCountry: (continentId: string, countryId: string) => void;
  onSelectCountryFromContinentRoot?: (
    continentId: string,
    countryId: string,
    triggerEl?: HTMLButtonElement | null,
  ) => void;
  onSelectCountrySubarea: (continentId: string, countryId: string, subareaId: string) => void;
  onSelectState: (
    continentId: string,
    countryId: string,
    countrySubareaId: string,
    stateId: string,
    triggerEl?: HTMLButtonElement | null,
  ) => void;
  onSelectCity: (
    continentId: string,
    countryId: string,
    cityId: string,
    triggerEl?: HTMLButtonElement | null,
  ) => void;
}

export function ContinentList({
  continents,
  selection,
  continentRootRevealKey,
  continentBrowseView = "countries",
  countryBrowseView = "cities",
  onSelectContinent,
  onSelectContinentSubarea,
  onSelectCountry,
  onSelectCountryFromContinentRoot,
  onSelectCountrySubarea,
  onSelectState,
  onSelectCity,
}: ContinentListProps) {
  const formatDisplayName = (value?: string | null) =>
    (value ?? "").replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s{2,}/g, " ").trim();
  const [expandedContinents, setExpandedContinents] = useState<string[]>(["europe", "asia"]);
  const [expandedCountries, setExpandedCountries] = useState<string[]>(["france", "japan"]);
  const [countryCascadeEpoch, setCountryCascadeEpoch] = useState(0);
  const continentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const countryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const hasNestedSelection = Boolean(
    selection.countryId ||
      selection.continentSubareaId ||
      selection.countrySubareaId ||
      selection.stateId ||
      selection.cityId ||
      selection.subareaId,
  );

  const scrollSectionIntoView = (element: HTMLDivElement | null) => {
    if (!element) {
      return;
    }

    requestAnimationFrame(() => {
      const scroller = element.closest("[data-directory-scroll]");

      if (!(scroller instanceof HTMLElement)) {
        return;
      }

      const offsetTop = element.offsetTop - scroller.offsetTop;
      scroller.scrollTo({
        top: Math.max(0, offsetTop),
        behavior: "smooth",
      });
    });
  };

  const toggleContinent = (continentId: string) => {
    onSelectContinent(continentId);
    setExpandedContinents((current) =>
      current.includes(continentId)
        ? current.filter((id) => id !== continentId)
        : [...current, continentId],
    );
    scrollSectionIntoView(continentRefs.current[continentId] ?? null);
  };

  const toggleCountry = (continentId: string, countryId: string) => {
    onSelectCountry(continentId, countryId);
    setExpandedCountries((current) =>
      current.includes(countryId) ? current.filter((id) => id !== countryId) : [...current, countryId],
    );
    scrollSectionIntoView(countryRefs.current[countryId] ?? null);
  };

  const selectionExpansionKey = [
    selection.continentId ?? "",
    selection.continentSubareaId ?? "",
    selection.countryId ?? "",
    selection.countrySubareaId ?? "",
    selection.stateId ?? "",
    selection.cityId ?? "",
    selection.subareaId ?? "",
  ].join("|");

  useEffect(() => {
    if (selection.countryId) {
      setExpandedContinents(selection.continentId ? [selection.continentId] : []);
      setExpandedCountries([selection.countryId]);
      return;
    }

    if (selection.continentId) {
      setExpandedContinents([selection.continentId]);
      setExpandedCountries([]);
      return;
    }

    setExpandedContinents([]);
    setExpandedCountries([]);
  }, [selectionExpansionKey]);

  useEffect(() => {
    if (selection.continentId && !selection.countryId && continentBrowseView === "countries") {
      setCountryCascadeEpoch((current) => current + 1);
    }
  }, [continentBrowseView, continentRootRevealKey, selection.continentId, selection.countryId]);

  const selectedContinent = continents.find((continent) => continent.id === selection.continentId);
  const selectedCountry = selectedContinent?.countries.find((country) => country.id === selection.countryId);

  if (selectedContinent && !selectedCountry) {
    const showRegions = continentBrowseView === "regions";
    const sortedRegions = (selectedContinent.subareas ?? [])
      .slice()
      .sort((left, right) => left.name.localeCompare(right.name));
    const sortedCountries = selectedContinent.countries
      .slice()
      .sort((left, right) => left.name.localeCompare(right.name));

    return (
      <div className="h-full min-h-0">
        <div className="min-h-0 h-full overflow-y-auto space-y-2">
          {showRegions
            ? sortedRegions.map((region) => (
                <button
                  key={region.id}
                  type="button"
                  title={region.name}
                  className={`flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm transition ${
                    selection.continentSubareaId === region.id
                      ? "bg-orange-50 text-orange-700"
                      : "text-slate-700 hover:bg-stone-100"
                  }`}
                  onClick={() => onSelectContinentSubarea?.(selectedContinent.id, region.id)}
                >
                  <MapPin className="h-4 w-4" />
                  {formatDisplayName(region.name)}
                </button>
              ))
            : sortedCountries.map((country, index) => (
                <button
                  key={`${countryCascadeEpoch}-${country.id}`}
                  type="button"
                  className={`continent-country-cascade flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm transition ${
                    selection.countryId === country.id
                      ? "bg-orange-50 text-orange-700"
                      : "text-slate-700 hover:bg-stone-100"
                  }`}
                  style={{ animationDelay: `${Math.min(9, index) * 90}ms` }}
                  onClick={(event) =>
                    onSelectCountryFromContinentRoot
                      ? onSelectCountryFromContinentRoot(selectedContinent.id, country.id, event.currentTarget)
                      : onSelectCountry(selectedContinent.id, country.id)
                  }
                >
                  <CountryFlag countryName={country.name} />
                  <span data-morph-origin="label" className="inline-block">
                    {country.name}
                  </span>
                </button>
              ))}
        </div>
      </div>
    );
  }

  if (selectedContinent && selectedCountry) {
    const selectedCountryMode =
      selectedCountry.states?.length && countryBrowseView === "cities" ? "states" : countryBrowseView;
    return (
      <div className="h-full">
        <div
          ref={(node) => {
            countryRefs.current[selectedCountry.id] = node;
          }}
          className="h-full scroll-mt-[5.75rem]"
        >
          <CountryList
            country={selectedCountry}
            selection={selection}
            expanded
            fillHeight
            hideHeader
            framed={false}
            mode={selectedCountryMode}
            countrySubareas={selectedCountry.subareas}
            countryStates={selectedCountry.states}
            onToggleCountry={() => toggleCountry(selectedContinent.id, selectedCountry.id)}
            onSelectCountrySubarea={(subareaId) =>
              onSelectCountrySubarea(selectedContinent.id, selectedCountry.id, subareaId)
            }
            onSelectState={(stateId, countrySubareaId, triggerEl) =>
              onSelectState(selectedContinent.id, selectedCountry.id, countrySubareaId, stateId, triggerEl)
            }
            onSelectCity={(cityId, triggerEl) => {
              onSelectCity(selectedContinent.id, selectedCountry.id, cityId, triggerEl);
              scrollSectionIntoView(countryRefs.current[selectedCountry.id] ?? null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {continents.map((continent) => (
        <div
          key={continent.id}
          ref={(node) => {
            continentRefs.current[continent.id] = node;
          }}
          className="scroll-mt-2"
        >
          <ContinentCard
            continent={continent}
            isActive={selection.continentId === continent.id && !hasNestedSelection}
            isExpanded={expandedContinents.includes(continent.id)}
            hideHeader={selection.continentId === continent.id && !hasNestedSelection}
            onToggle={() => toggleContinent(continent.id)}
          >
            <div className="space-y-3">
              {continent.countries.map((country) => (
                selection.countryId === country.id ? null : (
                  <div
                    key={country.id}
                    ref={(node) => {
                      countryRefs.current[country.id] = node;
                    }}
                    className="scroll-mt-[5.75rem]"
                  >
                    <CountryList
                      country={country}
                      selection={selection}
                      expanded={expandedCountries.includes(country.id)}
                      countryStates={country.states}
                      onSelectCountrySubarea={(subareaId) =>
                        onSelectCountrySubarea(continent.id, country.id, subareaId)
                      }
                      onSelectState={(stateId, countrySubareaId, triggerEl) =>
                        onSelectState(continent.id, country.id, countrySubareaId, stateId, triggerEl)
                      }
                      onToggleCountry={() => toggleCountry(continent.id, country.id)}
                      onSelectCity={(cityId, triggerEl) => {
                        onSelectCity(continent.id, country.id, cityId, triggerEl);
                        scrollSectionIntoView(countryRefs.current[country.id] ?? null);
                      }}
                    />
                  </div>
                )
              ))}
            </div>
          </ContinentCard>
        </div>
      ))}
    </div>
  );
}
