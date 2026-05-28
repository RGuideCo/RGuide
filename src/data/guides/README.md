City guide source files live here so parallel city population work stays isolated.

New guide work must follow `docs/new-guide-population-runbook.md` before it is published. The task is not complete until the local guide data, normalized publish, R2 ingestion, and live rendered payload verification pass.

- Edit an existing city in its own file, for example `barcelona.ts`.
- Add a new city as `<city-id>.ts`, then register it in `index.ts`.
- Keep `src/data/lists.ts` as the stable app-facing export.
- Push guide changes with a scoped normalized publish, for example
  `npm run push:editorial-guides -- --city Barcelona` or
  `npm run push:editorial-guides -- --id list-barcelona-citywide-hotels`.
- Check a scoped publish without writing by adding `--dry-run` or `--check`, for example
  `npm run push:editorial-guides -- --city Paris --dry-run`.
- Verify new guide work with
  `npm run verify:guide-publish -- --city Paris --strict --local-only` before publishing, then
  `npm run verify:guide-publish -- --city Paris --strict --live` after R2 ingestion.
