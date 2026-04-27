export const FIX_CITY_PLAYBOOK_PROMPT = `
You are fixing one city end-to-end in the travel guide map app.

Goal:
- Cross-reference real neighborhoods for the target city.
- Fix neighborhood boundary geometry so map regions are accurate.
- Add or improve neighborhood descriptions.
- Double-check data quality before finishing.

Required workflow:
1. Locate the city in \`src/data/geography.ts\`.
2. Audit seeded neighborhoods (\`citySubareaSeeds\`) for naming quality and relevance.
2a. Use conservative replacement logic:
   - Keep existing neighborhoods when they are still accurate and useful.
   - Replace a neighborhood only when evidence shows it is incorrect, low relevance, or materially weaker than an alternative.
   - If uncertain, prefer keeping the current neighborhood and improving its boundary/description.
3. Audit current boundaries in \`src/data/neighborhood-boundaries.json\`.
4. If boundaries are missing or wrong, use authoritative sources in this order:
   - Official city/regional GIS open data
   - OpenStreetMap boundary relations / administrative polygons
   - Nominatim polygon results (only polygon or multipolygon, never point/line as final)
5. Add or update query mappings in \`scripts/fetch-city-neighborhoods.mjs\` and/or \`src/data/boundary-sources.json\`.
6. Regenerate boundaries for the city:
   - \`node scripts/fetch-city-neighborhoods.mjs --boundaries-only --city <city-id> --refresh-existing\`
7. If a neighborhood has multiple valid polygons, combine them with topological union.
   - Keep true shape fidelity (do not use rough envelopes/boxes).
8. Ensure each neighborhood has a custom, human-readable description in \`src/data/geography.ts\`.
9. Validate geometry output:
   - No \`Point\`, \`LineString\`, or \`MultiLineString\` for final neighborhood areas.
   - Final geometry should be \`Polygon\` or intentionally \`MultiPolygon\`.
10. Run QA:
   - \`npm run typecheck\`
   - Verify changed neighborhood keys and geometry types in \`src/data/neighborhood-boundaries.json\`.
11. Do independent cross-checking before finalizing:
   - Validate each kept/replaced neighborhood against at least two reliable references (official tourism/city data, official GIS, or high-quality map data).
   - Record why each replacement happened, or explicitly note that existing neighborhoods were retained.

Definition of done:
- Neighborhood list is curated and realistic for the city.
- Boundaries are map-accurate and render as areas.
- Descriptions exist for each neighborhood and read cleanly.
- Source metadata is preserved for maintainability.
- Typecheck passes.

Output format:
- Summarize what changed.
- List neighborhoods updated.
- List any known data limitations or unresolved boundary gaps.
`;

export function buildFixCityPrompt(cityName: string, cityId?: string) {
  const normalizedCity = cityName.trim();
  const normalizedCityId = cityId?.trim();

  return `${FIX_CITY_PLAYBOOK_PROMPT}

Target city:
- City name: ${normalizedCity || "<city-name>"}
- City id: ${normalizedCityId || "<city-id>"}
`;
}
