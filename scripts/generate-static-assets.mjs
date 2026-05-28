import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GEOGRAPHY_PATH = path.join(ROOT, "src/data/geography.ts");
const BOUNDARY_SOURCE_DIR = path.join(ROOT, "src/data/boundaries");
const PUBLIC_IMAGE_DIR = path.join(ROOT, "public/destination-images");
const PUBLIC_BOUNDARY_DIR = path.join(ROOT, "public/data/boundaries");

const WIDTH = 1200;
const HEIGHT = 630;

const titleOverrides = {
  "new-york-city": "New York City",
  "washington-dc": "Washington, DC",
  "hong-kong": "Hong Kong",
  macau: "Macau",
  "kuala-lumpur": "Kuala Lumpur",
  "sao-paulo": "Sao Paulo",
};

const cityImageSlugAliases = {
  littlerock: "little-rock",
  losangeles: "los-angeles",
  sanfrancisco: "san-francisco",
  newhaven: "new-haven",
  desmoines: "des-moines",
  neworleans: "new-orleans",
  portlandmaine: "portland-maine",
  washingtondc: "washington-dc",
  jacksonms: "jackson-mississippi",
  stlouis: "st-louis",
  lasvegas: "las-vegas",
  manchesternh: "manchester-new-hampshire",
  oklahomacity: "oklahoma-city",
  portlandoregon: "portland-oregon",
  charlestonsc: "charleston-south-carolina",
  siouxfalls: "sioux-falls",
  saltlakecity: "salt-lake-city",
  charlestonwv: "charleston-west-virginia",
  sanantonio: "san-antonio",
  sandiego: "san-diego",
  mexicocity: "mexico-city",
  saopaulo: "sao-paulo",
  buenosaires: "buenos-aires",
  capetown: "cape-town",
  chiangmai: "chiang-mai",
  kualalumpur: "kuala-lumpur",
  hongkong: "hong-kong",
  nyc: "new-york-city",
  rio: "rio-de-janeiro",
};

const palettes = [
  {
    background: "#f7efe4",
    ink: "#18212f",
    muted: "#6b5f53",
    accent: "#dd6b20",
    secondary: "#0f766e",
  },
  {
    background: "#e9f1ee",
    ink: "#14213d",
    muted: "#52636d",
    accent: "#c2410c",
    secondary: "#2563eb",
  },
  {
    background: "#f2efe8",
    ink: "#1f2937",
    muted: "#6b7280",
    accent: "#b45309",
    secondary: "#047857",
  },
  {
    background: "#edf2f7",
    ink: "#111827",
    muted: "#64748b",
    accent: "#dc2626",
    secondary: "#7c3aed",
  },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function slugify(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function hashString(value) {
  return value.split("").reduce((hash, character) => {
    return (hash * 31 + character.charCodeAt(0)) >>> 0;
  }, 2166136261);
}

function titleize(slug) {
  if (titleOverrides[slug]) {
    return titleOverrides[slug];
  }

  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function destinationSvg(slug, { includeTitle }) {
  const title = titleize(slug || "destination");
  const hash = hashString(slug);
  const palette = palettes[hash % palettes.length];
  const waypointX = 230 + (hash % 640);
  const waypointY = 170 + ((hash >>> 5) % 270);
  const fontSize = title.length > 24 ? 72 : 92;
  const titleMarkup = includeTitle
    ? `<text x="132" y="522" fill="${palette.ink}" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="800">${escapeXml(title)}</text>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${escapeXml(title)} destination guide">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.background}"/>
      <stop offset="48%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="${palette.secondary}" stop-opacity="0.13"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${palette.background}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect x="90" y="80" width="1020" height="470" rx="44" fill="none" stroke="${palette.ink}" stroke-opacity="0.09" stroke-width="2"/>
  <path d="M180 274 C310 162 410 318 532 206 C662 86 764 330 910 160 C962 100 1004 122 1032 98" fill="none" stroke="${palette.ink}" stroke-width="7" stroke-linecap="round" stroke-dasharray="2 22" opacity="0.62"/>
  <path d="M198 138 C318 206 368 104 492 168 C632 240 706 112 840 178 C914 214 966 196 1020 254" fill="none" stroke="${palette.secondary}" stroke-width="5" stroke-linecap="round" opacity="0.38"/>
  <circle cx="${waypointX + 52}" cy="${waypointY + 52}" r="52" fill="${palette.accent}"/>
  <circle cx="${waypointX + 52}" cy="${waypointY + 52}" r="42" fill="none" stroke="#ffffff" stroke-width="10"/>
  <circle cx="${waypointX + 52}" cy="${waypointY + 52}" r="15" fill="#ffffff"/>
  <text x="132" y="130" fill="${palette.muted}" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" letter-spacing="5">RGUIDE</text>
  <text x="300" y="130" fill="${palette.accent}" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" letter-spacing="5">DESTINATION GUIDE</text>
  ${titleMarkup}
</svg>
`;
}

function collectDestinationImageSlugs() {
  const source = fs.readFileSync(GEOGRAPHY_PATH, "utf8");
  const slugs = new Set(["destination"]);

  for (const match of source.matchAll(/cityImage\("([^"]+)"\)/g)) {
    const normalized = slugify(match[1]);
    slugs.add(cityImageSlugAliases[normalized] ?? normalized);
  }

  for (const match of source.matchAll(/\{\s*id:\s*"([^"]+)"/g)) {
    slugs.add(slugify(match[1]));
  }

  return [...slugs].filter(Boolean).sort();
}

function writeDestinationImages() {
  ensureDir(PUBLIC_IMAGE_DIR);
  const slugs = collectDestinationImageSlugs();

  for (const slug of slugs) {
    fs.writeFileSync(
      path.join(PUBLIC_IMAGE_DIR, `${slug}-v2.svg`),
      destinationSvg(slug, { includeTitle: false }),
      "utf8",
    );
    fs.writeFileSync(
      path.join(PUBLIC_IMAGE_DIR, `${slug}-v2-title.svg`),
      destinationSvg(slug, { includeTitle: true }),
      "utf8",
    );
  }

  return slugs.length * 2;
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

const imageCount = writeDestinationImages();
const boundaryCount = writeBoundarySnapshots();

console.log(JSON.stringify({ ok: true, destinationImages: imageCount, boundarySnapshots: boundaryCount }, null, 2));
