import { barcelonaWeeklyEventRun } from "@/data/weekly-event-runs/barcelona";
import { getBarcelonaWeeklyEventImage } from "@/data/weekly-event-runs/barcelona-images";
import type { WeeklyCityEventSourceRun } from "@/data/weekly-events";

export const cityWeeklyEventRuns: WeeklyCityEventSourceRun[] = [
  barcelonaWeeklyEventRun,
];

export function getWeeklyEventImage(title: string, cityId?: string) {
  if (cityId === "barcelona") {
    return getBarcelonaWeeklyEventImage(title);
  }

  return undefined;
}
