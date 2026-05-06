import fs from "fs";
import path from "path";

import {
  buildEditorialGuidesSql,
  loadEditorialGuideLists,
} from "./editorial-guides-data.mjs";

const ROOT = process.cwd();
const OUTPUT_PATH = path.join(ROOT, "supabase/editorial-guides.sql");

if (process.argv.length > 2) {
  throw new Error("export-editorial-guides-sql.mjs always writes the full canonical seed. Use push-editorial-guides.mjs for scoped pushes.");
}

const allGuides = loadEditorialGuideLists();
const sql = buildEditorialGuidesSql(allGuides);

fs.writeFileSync(OUTPUT_PATH, sql);
console.log(
  `Exported ${allGuides.length} editorial guides to ${path.relative(ROOT, OUTPUT_PATH)}`,
);
