import process from "node:process";

console.error(
  [
    "Legacy weekly event SQL export is disabled.",
    "Do not regenerate supabase/weekly-event-guides.sql or write public.weekly_event_guides.",
    "Weekly event publishing must write normalized events, occurrences, sources, and weekly_event_publications.",
  ].join("\n"),
);

process.exit(1);
