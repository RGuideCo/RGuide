import process from "node:process";

console.error(
  [
    "Legacy destination description push is disabled.",
    "Do not write public.destination_descriptions.",
    "Destination copy must write normalized destination_descriptions_v2 rows keyed by destination_id.",
  ].join("\n"),
);

process.exit(1);
