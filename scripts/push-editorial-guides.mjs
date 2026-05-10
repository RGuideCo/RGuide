import process from "node:process";

console.error(
  [
    "scripts/push-editorial-guides.mjs is deprecated.",
    "Editorial guide publishing must write normalized tables only:",
    "  entries, entry_stops, venues, sources, entity_sources, and entry_render_cache.",
    "",
    "Use:",
    "  npm run push:editorial-guides -- --id <guide-id>",
    "  npm run push:editorial-guides -- --slug <guide-slug>",
    "  npm run push:editorial-guides -- --city <city-name>",
    "",
    "The old public.editorial_guides blob table is archival/backfill input only.",
  ].join("\n"),
);

process.exit(1);
