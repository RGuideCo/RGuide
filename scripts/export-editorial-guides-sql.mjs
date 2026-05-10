import process from "node:process";

console.error(
  [
    "Legacy editorial guide SQL export is disabled.",
    "Do not regenerate supabase/editorial-guides.sql or write public.editorial_guides.",
    "Use normalized publishing instead:",
    "  npm run push:editorial-guides -- --city <city-name>",
    "  npm run push:editorial-guides -- --id <guide-id>",
  ].join("\n"),
);

process.exit(1);
