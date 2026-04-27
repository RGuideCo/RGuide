"use client";

import clsx from "clsx";
import Link from "next/link";
import { Search } from "lucide-react";
import { useId, useMemo, useState } from "react";

import { cities, mapLists } from "@/data";
import { getCityHref, getListHref } from "@/lib/routes";

interface SearchBarProps {
  className?: string;
  autoFocus?: boolean;
  onResultSelect?: () => void;
}

export function SearchBar({ className, autoFocus = false, onResultSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const searchId = useId();

  const results = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const normalized = query.toLowerCase();
    const cityMatches = cities
      .filter((city) => city.name.toLowerCase().includes(normalized))
      .slice(0, 4)
      .map((city) => ({
        id: city.id,
        title: city.name,
        subtitle: `${city.country}, ${city.continent}`,
        href: getCityHref(city),
      }));

    const listMatches = mapLists
      .filter((list) => list.title.toLowerCase().includes(normalized))
      .slice(0, 4)
      .map((list) => ({
        id: list.id,
        title: list.title,
        subtitle: [list.location.city, list.location.country, list.category].filter(Boolean).join(" • "),
        href: getListHref(list),
      }));

    return [...cityMatches, ...listMatches].slice(0, 6);
  }, [query]);

  return (
    <div className={clsx("relative w-full max-w-xl", className)}>
      <label className="sr-only" htmlFor={searchId}>
        Search cities and lists
      </label>
      <div className="flex items-center gap-3 rounded-full border border-white/70 bg-white/90 px-4 py-3 shadow-soft">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search cities, countries, or list titles"
          autoFocus={autoFocus}
          className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400"
        />
      </div>

      {results.length ? (
        <div className="surface absolute left-0 right-0 top-[calc(100%+0.75rem)] z-30 p-2">
          {results.map((result) => (
            <Link
              key={result.id}
              href={result.href}
              className="block rounded-2xl px-4 py-3 hover:bg-stone-100"
              onClick={() => {
                setQuery("");
                onResultSelect?.();
              }}
            >
              <p className="font-medium text-slate-900">{result.title}</p>
              <p className="text-sm text-slate-600">{result.subtitle}</p>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
