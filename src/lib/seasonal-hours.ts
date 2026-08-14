import type { GuideStop } from "@/types";

type Season = "spring" | "summer" | "fall" | "winter";
type WeekdayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

const MONTH_INDEX_BY_NAME = new Map([
  ["jan", 0], ["january", 0],
  ["feb", 1], ["february", 1],
  ["mar", 2], ["march", 2],
  ["apr", 3], ["april", 3],
  ["may", 4],
  ["jun", 5], ["june", 5],
  ["jul", 6], ["july", 6],
  ["aug", 7], ["august", 7],
  ["sep", 8], ["sept", 8], ["september", 8],
  ["oct", 9], ["october", 9],
  ["nov", 10], ["november", 10],
  ["dec", 11], ["december", 11],
]);
const MONTH_NAME_PATTERN = "(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)";
const MONTH_SCHEDULE_PATTERN = new RegExp(
  `^(${MONTH_NAME_PATTERN}(?:\\s*(?:-|–|—|to|and|,)\\s*${MONTH_NAME_PATTERN})*)\\s+(daily\\b.*)$`,
  "i",
);
const MONTH_RANGE_PATTERN = new RegExp(
  `^(${MONTH_NAME_PATTERN})\\s*(?:-|–|—|to)\\s*(${MONTH_NAME_PATTERN})$`,
  "i",
);
const MONTH_NAME_GLOBAL_PATTERN = new RegExp(MONTH_NAME_PATTERN, "gi");

function getMonthIndex(value: string): number | null {
  return MONTH_INDEX_BY_NAME.get(value.toLowerCase()) ?? null;
}

function isMonthInRange(month: number, startMonth: number, endMonth: number) {
  return startMonth <= endMonth
    ? month >= startMonth && month <= endMonth
    : month >= startMonth || month <= endMonth;
}

function monthSpecificationIncludes(specification: string, month: number) {
  const rangeMatch = specification.match(MONTH_RANGE_PATTERN);
  if (rangeMatch) {
    const startMonth = getMonthIndex(rangeMatch[1]);
    const endMonth = getMonthIndex(rangeMatch[2]);
    return startMonth !== null && endMonth !== null && isMonthInRange(month, startMonth, endMonth);
  }

  const listedMonths = [...specification.matchAll(MONTH_NAME_GLOBAL_PATTERN)]
    .map((match) => getMonthIndex(match[0]))
    .filter((value): value is number => value !== null);
  return listedMonths.includes(month);
}

function resolveMonthlySummary(hours: string, month: number): string | null {
  const segments = hours.split(/\s*;\s*/).map((segment) => segment.trim()).filter(Boolean);
  if (segments.length < 2) {
    return null;
  }

  for (const segment of segments) {
    const match = segment.match(MONTH_SCHEDULE_PATTERN);
    if (!match || !monthSpecificationIncludes(match[1], month)) {
      continue;
    }

    const activeHours = match[2];
    return activeHours.charAt(0).toUpperCase() + activeHours.slice(1);
  }

  return null;
}

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
    return resolveMonthlySummary(stop.hours, referenceDate.getMonth()) ?? stop.hours;
  }

  const weekdayKeys: WeekdayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const weekdayKey = weekdayKeys[referenceDate.getDay()];
  const weekdayHours = stop.hours[weekdayKey];
  if (weekdayHours) {
    return weekdayHours;
  }

  const season = getSeasonForMonth(referenceDate.getMonth(), stop.coordinates[0]);

  const resolvedHours = (
    stop.hours[season] ??
    stop.hours.default ??
    stop.hours.spring ??
    stop.hours.summer ??
    stop.hours.fall ??
    stop.hours.winter ??
    null
  );

  return resolvedHours
    ? resolveMonthlySummary(resolvedHours, referenceDate.getMonth()) ?? resolvedHours
    : null;
}
