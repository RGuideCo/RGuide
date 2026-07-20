"use client";

import clsx from "clsx";
import Link from "next/link";
import { Search } from "@/components/icons/MaterialSymbol";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cities } from "@/data";
import { ROUTE_SEGMENTS, getLocalePrefix, type AppLocale } from "@/lib/i18n/config";
import { getLocalizedCityPath, getLocalizedGuidePath } from "@/lib/i18n/paths";
import type { DestinationRouteTranslation } from "@/lib/i18n/types";
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
  locale?: AppLocale;
  destinationTranslations?: DestinationRouteTranslation[];
}

export function SearchBar({
  className,
  autoFocus = false,
  onResultSelect,
  compact = false,
  variant = "pill",
  size,
  embedded = false,
  locale = "en",
  destinationTranslations = [],
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
    const getDestinationTranslation = (scope: string, sourceName: string, legacyId?: string) =>
      destinationTranslations.find(
        (translation) =>
          translation.scope === scope &&
          (translation.legacyId === legacyId || translation.sourceName === sourceName),
      );
    const cityMatches = cities
      .map((city) => ({ city, translation: getDestinationTranslation("city", city.name, city.id) }))
      .filter(({ city, translation }) =>
        [city.name, translation?.displayName].some((name) => name?.toLowerCase().includes(normalized)),
      )
      .slice(0, 4)
      .map(({ city, translation }) => ({
        id: city.id,
        title: translation?.displayName ?? city.name,
        subtitle: [
          getDestinationTranslation("country", city.country)?.displayName ?? city.country,
          getDestinationTranslation("continent", city.continent)?.displayName ?? city.continent,
        ].join(", "),
        href: locale === "en" ? getCityHref(city) : getLocalizedCityPath(locale, city, translation?.slug),
      }));

    const listMatches = searchableLists
      .filter((list) => list.title.toLowerCase().includes(normalized))
      .slice(0, 4)
      .map((list) => {
        const city = list.location.city
          ? cities.find((candidate) => candidate.name === list.location.city)
          : undefined;
        const cityTranslation = city
          ? getDestinationTranslation("city", city.name, city.id)
          : undefined;
        const neighborhood = city?.subareas
          ?.flatMap((subarea) => [subarea, ...(subarea.subareas ?? [])])
          .find((candidate) => candidate.name === list.location.neighborhood);
        const neighborhoodTranslation = neighborhood
          ? getDestinationTranslation("neighborhood", neighborhood.name, neighborhood.id)
          : undefined;
        const localizedHref = list.submissionType === "event"
          ? `${getLocalePrefix(locale)}/${ROUTE_SEGMENTS[locale].events}/${list.seoSlug ?? list.slug}`
          : city
            ? getLocalizedGuidePath(
                locale,
                city,
                list,
                neighborhood,
                cityTranslation?.slug,
                neighborhoodTranslation?.slug,
              )
            : getGuideHref(list);
        return {
          id: list.id,
          title: list.title,
          subtitle: [
            cityTranslation?.displayName ?? list.location.city,
            getDestinationTranslation("country", list.location.country)?.displayName ?? list.location.country,
            list.category,
          ].filter(Boolean).join(" • "),
          href: locale === "en" ? getGuideHref(list) : localizedHref,
        };
      });

    return [...cityMatches, ...listMatches].slice(0, 6);
  }, [destinationTranslations, locale, query, searchableLists]);

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
        {locale === "es" ? "Buscar ciudades y guías" : "Search cities and lists"}
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
          placeholder={locale === "es" ? "Buscar ciudades, países o guías" : "Search cities, countries, or list titles"}
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
