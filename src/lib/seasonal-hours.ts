import { GuideStop } from "@/types";

type Season = "spring" | "summer" | "fall" | "winter";
type WeekdayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

function getSeasonForMonth(month: number, latitude: number): Season {
  const northernHemisphere = latitude >= 0;

  if (northernHemisphere) {
    if (month >= 2 && month <= 4) return "spring";
    if (month >= 5 && month <= 7) return "summer";
    if (month >= 8 && month <= 10) return "fall";
    return "winter";
  }

  if (month >= 2 && month <= 4) return "fall";
  if (month >= 5 && month <= 7) return "winter";
  if (month >= 8 && month <= 10) return "spring";
  return "summer";
}

export function resolveStopHours(stop: GuideStop, referenceDate: Date = new Date()): string | null {
  if (!stop.hours) {
    return null;
  }

  if (typeof stop.hours === "string") {
    return stop.hours;
  }

  const weekdayKeys: WeekdayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const weekdayKey = weekdayKeys[referenceDate.getDay()];
  const weekdayHours = stop.hours[weekdayKey];
  if (weekdayHours) {
    return weekdayHours;
  }

  const season = getSeasonForMonth(referenceDate.getMonth(), stop.coordinates[0]);

  return (
    stop.hours[season] ??
    stop.hours.default ??
    stop.hours.spring ??
    stop.hours.summer ??
    stop.hours.fall ??
    stop.hours.winter ??
    null
  );
}
