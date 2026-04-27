import fs from "node:fs/promises";
import polygonClipping from "polygon-clipping";

const INPUT_PATH = "src/data/nyc-neighborhood-boundaries.json";

function ringSignedArea(ring) {
  let total = 0;
  for (let i = 0; i < ring.length; i += 1) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    total += x1 * y2 - x2 * y1;
  }
  return total / 2;
}

function polygonArea(polygon) {
  if (!Array.isArray(polygon) || polygon.length === 0) {
    return 0;
  }
  const [outerRing, ...holes] = polygon;
  const outerArea = Math.abs(ringSignedArea(outerRing));
  const holesArea = holes.reduce((sum, hole) => sum + Math.abs(ringSignedArea(hole)), 0);
  return Math.max(0, outerArea - holesArea);
}

function mergedLargestPolygonFromMultiPolygon(coordinates) {
  const merged = polygonClipping.union(...coordinates);
  const polygons = Array.isArray(merged) ? merged : [];
  if (polygons.length === 0) {
    return coordinates[0];
  }
  const [largest] = polygons
    .slice()
    .sort((left, right) => polygonArea(right) - polygonArea(left));
  return largest;
}

async function run() {
  const raw = await fs.readFile(INPUT_PATH, "utf8");
  const boundaries = JSON.parse(raw);
  let converted = 0;

  for (const [boundaryKey, feature] of Object.entries(boundaries)) {
    const geometry = feature?.geometry;
    if (!geometry || geometry.type !== "MultiPolygon") {
      continue;
    }

    const mergedLargestPolygon = mergedLargestPolygonFromMultiPolygon(geometry.coordinates);
    feature.geometry = { type: "Polygon", coordinates: mergedLargestPolygon };
    feature.properties = {
      ...(feature.properties ?? {}),
      source: {
        ...(feature.properties?.source ?? {}),
        mergeMethod: "topological-union-largest-part",
      },
    };
    converted += 1;

    if (!Array.isArray(mergedLargestPolygon) || mergedLargestPolygon.length === 0) {
      throw new Error(`Failed to convert ${boundaryKey} into a valid Polygon geometry.`);
    }
  }

  await fs.writeFile(INPUT_PATH, `${JSON.stringify(boundaries, null, 2)}\n`, "utf8");
  console.log(`Converted NYC neighborhoods to Polygon: ${converted}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
