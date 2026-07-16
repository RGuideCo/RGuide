"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type WheelEvent as ReactWheelEvent } from "react";

import {
  MaterialAccountBalance,
  MaterialAutoAwesome,
  MaterialBed,
  MaterialInfo,
  MaterialNightlife,
  MaterialPark,
  MaterialRestaurant,
  MaterialSignpost,
  type MaterialSymbolIcon,
} from "@/components/icons/MaterialSymbol";
import type { GuideCrossLink } from "@/components/cards/GuideCrossLinks";
import { CATEGORY_STYLES } from "@/lib/constants";
import type { ListCategory } from "@/types";

const CATEGORY_ICONS: Record<ListCategory, MaterialSymbolIcon> = {
  Food: MaterialRestaurant,
  Nightlife: MaterialNightlife,
  Culture: MaterialAccountBalance,
  Stay: MaterialBed,
  Nature: MaterialPark,
  Activities: MaterialAutoAwesome,
  Routes: MaterialSignpost,
  Essentials: MaterialInfo,
};

type GuideQuickLinksProps = {
  guideId: string;
  placeName: string;
  links: GuideCrossLink[];
  onGuideSelect?: (guideId: string) => void;
};

export function GuideQuickLinks({ guideId, placeName, links, onGuideSelect }: GuideQuickLinksProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const revealTimeoutRef = useRef<number | null>(null);
  const [edgeFades, setEdgeFades] = useState({ left: false, right: false });

  const updateEdgeFades = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    setEdgeFades({
      left: scroller.scrollLeft > 2,
      right: scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 2,
    });
  }, []);

  const cancelReveal = useCallback(() => {
    if (revealTimeoutRef.current !== null) {
      window.clearTimeout(revealTimeoutRef.current);
      revealTimeoutRef.current = null;
    }
  }, []);

  const handleWheel = useCallback(
    (event: ReactWheelEvent<HTMLElement>) => {
      const scroller = scrollerRef.current;
      if (!scroller || scroller.scrollWidth <= scroller.clientWidth) {
        return;
      }

      const rawDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (!rawDelta) {
        return;
      }

      const deltaScale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? scroller.clientWidth : 1;
      const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
      const nextScrollLeft = Math.max(0, Math.min(maxScrollLeft, scroller.scrollLeft + rawDelta * deltaScale));

      if (Math.abs(nextScrollLeft - scroller.scrollLeft) < 0.5) {
        return;
      }

      event.preventDefault();
      scroller.scrollLeft = nextScrollLeft;
      updateEdgeFades();
    },
    [updateEdgeFades],
  );

  const queueChipReveal = useCallback(
    (chip: HTMLElement) => {
      cancelReveal();
      revealTimeoutRef.current = window.setTimeout(() => {
        const scroller = scrollerRef.current;
        if (!scroller) {
          return;
        }

        const scrollerRect = scroller.getBoundingClientRect();
        const chipRect = chip.getBoundingClientRect();
        const edgeInset = 10;
        let scrollOffset = 0;

        if (chipRect.right > scrollerRect.right - edgeInset) {
          scrollOffset = chipRect.right - scrollerRect.right + edgeInset;
        } else if (chipRect.left < scrollerRect.left + edgeInset) {
          scrollOffset = chipRect.left - scrollerRect.left - edgeInset;
        }

        if (scrollOffset) {
          scroller.scrollBy({ left: scrollOffset, behavior: "smooth" });
        }
        revealTimeoutRef.current = null;
      }, 320);
    },
    [cancelReveal],
  );

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(updateEdgeFades);
    const resizeObserver = new ResizeObserver(updateEdgeFades);
    resizeObserver.observe(scroller);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }
    scroller.addEventListener("scroll", updateEdgeFades, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      scroller.removeEventListener("scroll", updateEdgeFades);
      cancelReveal();
    };
  }, [cancelReveal, links.length, updateEdgeFades]);

  if (!links.length) {
    return null;
  }

  return (
    <nav
      id={`guide-quick-links-${guideId}`}
      data-guide-quick-links
      aria-label={`Explore more of ${placeName}`}
      className="guide-content-cascade-item relative z-10 -mx-3 bg-slate-800 px-3 py-2.5"
      style={{ animationDelay: "50ms" }}
      onClick={(event) => event.stopPropagation()}
      onWheel={handleWheel}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-[9px] font-semibold uppercase text-white">
          Explore more of {placeName}
        </p>
        <p className="shrink-0 text-[9px] font-medium text-white/65">
          {links.length} {links.length === 1 ? "guide" : "guides"}
        </p>
      </div>
      <div className="relative mt-2">
        <div
          ref={scrollerRef}
          className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div ref={contentRef} className="flex min-w-max items-center gap-1.5 pr-3">
            {links.map((link) => {
              const CategoryIcon = CATEGORY_ICONS[link.category];

              return (
                <Link
                  key={link.id}
                  href={link.href}
                  title={link.title}
                  onMouseEnter={(event) => queueChipReveal(event.currentTarget)}
                  onMouseLeave={cancelReveal}
                  onFocus={(event) => queueChipReveal(event.currentTarget)}
                  onBlur={cancelReveal}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (onGuideSelect) {
                      event.preventDefault();
                      onGuideSelect(link.id);
                    }
                  }}
                  className="group inline-flex h-7 w-max max-w-28 shrink-0 items-center gap-1 overflow-hidden rounded-md px-2 text-xs font-semibold text-white shadow-sm outline-none transition-[max-width,filter] duration-300 ease-out hover:max-w-lg hover:brightness-90 focus-visible:max-w-lg focus-visible:ring-2 focus-visible:ring-white/70"
                  style={{ backgroundColor: CATEGORY_STYLES[link.category].mapColor }}
                >
                  <CategoryIcon className="h-3.5 w-3.5" weight={500} />
                  <span className="min-w-0 overflow-hidden whitespace-nowrap [-webkit-mask-image:linear-gradient(to_right,#000_72%,transparent_100%)] [mask-image:linear-gradient(to_right,#000_72%,transparent_100%)] group-hover:[-webkit-mask-image:none] group-hover:[mask-image:none] group-focus-visible:[-webkit-mask-image:none] group-focus-visible:[mask-image:none]">
                    {link.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
        <span
          className={`pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-slate-800 to-transparent transition-opacity duration-200 ${
            edgeFades.left ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />
        <span
          className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-slate-800 to-transparent transition-opacity duration-200 ${
            edgeFades.right ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />
      </div>
    </nav>
  );
}
