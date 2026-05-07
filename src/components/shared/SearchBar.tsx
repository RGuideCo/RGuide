"use client";

import clsx from "clsx";
import Link from "next/link";
import { Search } from "lucide-react";
import { useId, useMemo, useState } from "react";

import { cities } from "@/data";
import { getCityHref, getListHref } from "@/lib/routes";
import { getEditorialLists, useAppStore } from "@/store/app-store";

interface SearchBarProps {
  className?: string;
  autoFocus?: boolean;
  onResultSelect?: () => void;
  compact?: boolean;
  variant?: "pill" | "square";
  size?: "sm" | "md" | "lg";
  embedded?: boolean;
}

export function SearchBar({
  className,
  autoFocus = false,
  onResultSelect,
  compact = false,
  variant = "pill",
  size,
  embedded = false,
}: SearchBarProps) {
  const editorialLists = useAppStore((state) => state.editorialLists);
  const [query, setQuery] = useState("");
  const searchId = useId();
  const searchableLists = useMemo(() => getEditorialLists(editorialLists), [editorialLists]);
  const resolvedSize = size ?? (compact ? "sm" : "lg");

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

    const listMatches = searchableLists
      .filter((list) => list.title.toLowerCase().includes(normalized))
      .slice(0, 4)
      .map((list) => ({
        id: list.id,
        title: list.title,
        subtitle: [list.location.city, list.location.country, list.category].filter(Boolean).join(" • "),
        href: getListHref(list),
      }));

    return [...cityMatches, ...listMatches].slice(0, 6);
  }, [query, searchableLists]);

  return (
    <div className={clsx("relative w-full max-w-xl", className)}>
      <label className="sr-only" htmlFor={searchId}>
        Search cities and lists
      </label>
      <div
        className={clsx(
          "flex items-center border",
          embedded
            ? "rounded-lg border-transparent bg-transparent shadow-none"
            : variant === "square"
            ? "rounded-lg border-slate-200 bg-white shadow-sm"
            : "rounded-full border-white/70 bg-white/90 shadow-soft",
          resolvedSize === "sm"
            ? "h-8 gap-2 px-2.5"
            : resolvedSize === "md"
              ? "h-10 gap-2.5 px-3"
              : "gap-3 px-4 py-3",
        )}
      >
        <Search className={clsx("text-slate-400", resolvedSize === "sm" ? "h-3.5 w-3.5" : "h-4 w-4")} />
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search cities, countries, or list titles"
          autoFocus={autoFocus}
          className={clsx(
            "w-full appearance-none border-0 bg-transparent p-0 text-slate-900 outline-none ring-0 shadow-none placeholder:text-slate-400 focus:border-0 focus:bg-transparent focus:outline-none focus:ring-0",
            resolvedSize === "sm" ? "text-xs" : "text-sm",
          )}
        />
      </div>

      {results.length ? (
        <div
          className={clsx(
            "surface absolute left-0 right-0 z-30 p-2",
            variant === "square" ? "top-[calc(100%+0.5rem)] rounded-lg" : "top-[calc(100%+0.75rem)]",
          )}
        >
          {results.map((result) => (
            <Link
              key={result.id}
              href={result.href}
              className={clsx("block px-4 py-3 hover:bg-stone-100", variant === "square" ? "rounded-md" : "rounded-2xl")}
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
