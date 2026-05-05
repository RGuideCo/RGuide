Neighborhood boundary data is split by city to avoid conflicts during parallel city work.

- Edit generated/imported shapes in the matching `<city-id>.json` file.
- Add reusable source metadata in `src/data/boundary-sources.json`.
- Run `node scripts/fetch-city-neighborhoods.mjs --boundaries-only --city <city-id> --refresh-existing` to refresh a city.
- The script updates the city JSON file and regenerates `index.ts`.
