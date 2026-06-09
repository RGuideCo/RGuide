import type { WeeklyCityEventSourceRun } from "@/data/weekly-events";

export const barcelonaWeeklyEventRun: WeeklyCityEventSourceRun = {
  cityId: "barcelona",
  cityName: "Barcelona",
  weekLabel: "No active local seed",
  sourcedAt: "2026-06-09",
  timezone: "Europe/Madrid",
  refreshCadence: "weekly",
  sourceStrategy: [
    "Barcelona weekly events now come from normalized Supabase event tables.",
    "Keep local seed empty so stale event data cannot appear as fallback content.",
  ],
  events: [],
};
