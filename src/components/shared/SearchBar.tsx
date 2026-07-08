"use client";

import clsx from "clsx";
import Link from "next/link";
import { Search } from "@/components/icons/MaterialSymbol";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cities } from "@/data";
import { getCityHref, getGuideHref } from "@/lib/routes";
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
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [dropdownRect, setDropdownRect] = useState<{ left: number; top: number; width: number } | null>(null);
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
        href: getGuideHref(list),
      }));

    return [...cityMatches, ...listMatches].slice(0, 6);
  }, [query, searchableLists]);

  const updateDropdownRect = useCallback(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const rect = root.getBoundingClientRect();
    setDropdownRect({
      left: rect.left,
      top: rect.bottom + (variant === "square" ? 8 : 12),
      width: rect.width,
    });
  }, [variant]);

  useEffect(() => {
    if (!results.length) {
      setDropdownRect(null);
      return;
    }

    updateDropdownRect();
    const root = rootRef.current;
    const resizeObserver =
      typeof ResizeObserver !== "undefined" && root
        ? new ResizeObserver(updateDropdownRect)
        : null;

    if (root) {
      resizeObserver?.observe(root);
    }
    window.addEventListener("resize", updateDropdownRect);
    window.addEventListener("scroll", updateDropdownRect, true);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateDropdownRect);
      window.removeEventListener("scroll", updateDropdownRect, true);
    };
  }, [results.length, updateDropdownRect]);

  const resultPanel =
    results.length && dropdownRect
      ? createPortal(
          <div
            className={clsx(
              "surface fixed z-[1000] p-2 shadow-xl",
              variant === "square" ? "rounded-lg" : "rounded-[1.4rem]",
            )}
            style={{
              left: dropdownRect.left,
              top: dropdownRect.top,
              width: dropdownRect.width,
            }}
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
          </div>,
          document.body,
        )
      : null;

  return (
    <div ref={rootRef} className={clsx("relative isolate z-[260] w-full max-w-xl", className)}>
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

      {resultPanel}
    </div>
  );
}
