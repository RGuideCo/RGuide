import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

import { geoMercator, geoPath } from "d3-geo";

const require = createRequire(import.meta.url);
const usAtlas = require("us-atlas/states-10m.json");
const { feature } = require("topojson-client");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const outputDir = path.join(rootDir, "public", "assets", "us-states");

const toSlug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const stateFeatures = feature(usAtlas, usAtlas.objects.states).features;

await mkdir(outputDir, { recursive: true });

let written = 0;
for (const stateFeature of stateFeatures) {
  const name = stateFeature?.properties?.name;
  if (!name) {
    continue;
  }

  const slug = toSlug(name);
  const projection = geoMercator().fitExtent(
    [
      [6, 6],
      [122, 122],
    ],
    stateFeature,
  );
  const pathGenerator = geoPath(projection);
  const pathData = pathGenerator(stateFeature);

  if (!pathData) {
    continue;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none" aria-hidden="true"><path d="${pathData}" fill="currentColor"/></svg>\n`;
  await writeFile(path.join(outputDir, `${slug}.svg`), svg, "utf8");
  written += 1;
}

console.log(`Generated ${written} state/territory shape SVGs in ${outputDir}`);
