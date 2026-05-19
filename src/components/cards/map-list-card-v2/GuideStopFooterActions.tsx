"use client";

import Link from "next/link";
import { CalendarCheck, Clock3, ExternalLink, Navigation, Plus } from "lucide-react";

import type { GuideStopItem } from "./types";

interface StayBookingDetails {
  href: string;
  platformLabel: string;
}

interface GuideStopFooterActionsProps {
  stop: GuideStopItem;
  resolvedStopHours?: string | null;
  isHistoricalGuide: boolean;
  weekdayLabel: string;
  showAddAction: boolean;
  isStopInItinerary: boolean;
  officialStopUrl?: string | null;
  timetableUrl?: string | null;
  directionsPickerOpen: boolean;
  stayBookingDetails?: StayBookingDetails | null;
  getDirectionsHref: (stop: GuideStopItem) => string;
  onAddStop: () => void;
  onToggleDirectionsPicker: () => void;
  onCloseDirectionsPicker: () => void;
}

export function GuideStopFooterActions({
  stop,
  resolvedStopHours,
  isHistoricalGuide,
  weekdayLabel,
  showAddAction,
  isStopInItinerary,
  officialStopUrl,
  timetableUrl,
  directionsPickerOpen,
  stayBookingDetails,
  getDirectionsHref,
  onAddStop,
  onToggleDirectionsPicker,
  onCloseDirectionsPicker,
}: GuideStopFooterActionsProps) {
  return (
    <div className="expanded-guide-stop-actions poi-footer-row mt-3 flex items-center justify-between gap-3 border-t border-slate-950/10 bg-white/80 py-2">
      <div className="min-w-0">
        {resolvedStopHours ? (
          <p className="text-xs leading-4 text-slate-500">
            <span className="font-medium text-slate-600">
              {isHistoricalGuide ? "Date:" : `Hours (${weekdayLabel}):`}
            </span>{" "}
            <span>{resolvedStopHours}</span>
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {stop.eventVenue ? (
          <span className="max-w-[11rem] truncate rounded-md border border-slate-950/10 bg-white/80 px-2 py-1.5 text-[11px] font-medium text-slate-600">
            {stop.eventVenue}
          </span>
        ) : null}
        {showAddAction ? (
          <button
            type="button"
            onClick={onAddStop}
            className={`inline-flex h-7 w-7 items-center justify-center rounded-md border text-[11px] font-medium transition ${
              isStopInItinerary
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-slate-950/10 bg-white/80 text-slate-700 hover:border-slate-950/20 hover:text-slate-900"
            }`}
            aria-label="Add"
            title="Add"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        ) : null}
        {officialStopUrl ? (
          <Link
            href={officialStopUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-950/10 bg-white/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-950/20 hover:text-slate-900"
            aria-label={`Official site for ${stop.name}`}
            title={`Official site for ${stop.name}`}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Official</span>
          </Link>
        ) : null}
        {timetableUrl ? (
          <Link
            href={timetableUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-950/10 bg-white/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-950/20 hover:text-slate-900"
            aria-label={`Timetables for ${stop.name}`}
            title={`Timetables for ${stop.name}`}
          >
            <Clock3 className="h-3.5 w-3.5" />
            <span>Timetables</span>
          </Link>
        ) : null}
        <div className="relative">
          {stop.places?.length ? (
            <button
              type="button"
              onClick={onToggleDirectionsPicker}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-950/10 bg-white/80 text-[11px] font-medium text-slate-700 hover:border-slate-950/20 hover:text-slate-900"
              aria-label="Directions"
              title="Directions"
            >
              <Navigation className="h-3.5 w-3.5" />
            </button>
          ) : (
            <Link
              href={getDirectionsHref(stop)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-950/10 bg-white/80 text-[11px] font-medium text-slate-700 hover:border-slate-950/20 hover:text-slate-900"
              aria-label="Directions"
              title="Directions"
            >
              <Navigation className="h-3.5 w-3.5" />
            </Link>
          )}
          {directionsPickerOpen ? (
            <div className="absolute bottom-full right-0 z-30 mb-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 text-left shadow-xl">
              <Link
                href={getDirectionsHref(stop)}
                target="_blank"
                rel="noreferrer"
                onClick={onCloseDirectionsPicker}
                className="block px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
              >
                {stop.name}
              </Link>
              {(stop.places ?? []).map((place) => (
                <Link
                  key={place.id}
                  href={getDirectionsHref(place)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={onCloseDirectionsPicker}
                  className="block border-t border-slate-100 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                  {place.name}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        {stayBookingDetails ? (
          <Link
            href={stayBookingDetails.href}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center gap-1.5 rounded-md border border-cyan-800 bg-cyan-800 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:border-cyan-900 hover:bg-cyan-900"
            aria-label={`Book ${stop.name} on ${stayBookingDetails.platformLabel}`}
            title={`Book ${stop.name} on ${stayBookingDetails.platformLabel}`}
          >
            <CalendarCheck className="h-3.5 w-3.5" />
            <span>Book</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
