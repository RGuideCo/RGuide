City guide source files live here so parallel city population work stays isolated.

- Edit an existing city in its own file, for example `barcelona.ts`.
- Add a new city as `<city-id>.ts`, then register it in `index.ts`.
- Keep `src/data/lists.ts` as the stable app-facing export.
- Push guide changes with a scoped normalized publish, for example
  `npm run push:editorial-guides -- --city Barcelona` or
  `npm run push:editorial-guides -- --id list-barcelona-citywide-hotels`.
