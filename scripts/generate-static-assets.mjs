import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BOUNDARY_SOURCE_DIR = path.join(ROOT, "src/data/boundaries");
const PUBLIC_BOUNDARY_DIR = path.join(ROOT, "public/data/boundaries");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function isPolygonFeature(feature) {
  const geometryType = feature?.geometry?.type;
  return geometryType === "Polygon" || geometryType === "MultiPolygon";
}

function toFeatureCollection(boundaryMap) {
  return {
    type: "FeatureCollection",
    features: Object.entries(boundaryMap)
      .map(([key, feature]) => {
        if (!isPolygonFeature(feature)) {
          return null;
        }
        return {
          ...feature,
          id: feature.id ?? key,
          properties: {
            id: feature.properties?.id ?? key,
            name: feature.properties?.name ?? key.split("::").at(-1) ?? key,
            ...feature.properties,
          },
        };
      })
      .filter(Boolean),
  };
}

function writeBoundarySnapshots() {
  ensureDir(PUBLIC_BOUNDARY_DIR);
  const files = fs
    .readdirSync(BOUNDARY_SOURCE_DIR)
    .filter((file) => file.endsWith(".json"))
    .sort();

  for (const file of files) {
    const sourcePath = path.join(BOUNDARY_SOURCE_DIR, file);
    const boundaryMap = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
    const collection = toFeatureCollection(boundaryMap);
    const outputPath = path.join(PUBLIC_BOUNDARY_DIR, `${path.basename(file, ".json")}.geojson`);
    fs.writeFileSync(outputPath, `${JSON.stringify(collection)}\n`, "utf8");
  }

  return files.length;
}

const boundaryCount = writeBoundarySnapshots();

console.log(JSON.stringify({ ok: true, boundarySnapshots: boundaryCount }, null, 2));
