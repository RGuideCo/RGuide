import fs from "fs";
import path from "path";

import {
  buildWeeklyEventGuidesSql,
  filterWeeklyEventRecords,
  hasWeeklyEventFilters,
  loadWeeklyEventGuideRecords,
  parseWeeklyEventArgs,
} from "./weekly-events-data.mjs";

const ROOT = process.cwd();
const OUTPUT_PATH = path.join(ROOT, "supabase/weekly-event-guides.sql");

const filters = parseWeeklyEventArgs(process.argv.slice(2));
const allRecords = loadWeeklyEventGuideRecords();
const selectedRecords = hasWeeklyEventFilters(filters)
  ? filterWeeklyEventRecords(allRecords, filters)
  : allRecords;
const sql = buildWeeklyEventGuidesSql(selectedRecords);

fs.writeFileSync(OUTPUT_PATH, sql);
console.log(
  `Exported ${selectedRecords.length} weekly event guides to ${path.relative(ROOT, OUTPUT_PATH)}`,
);
