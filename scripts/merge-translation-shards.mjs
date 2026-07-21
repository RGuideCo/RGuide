import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import {
  assertCompletedTranslation,
  assertSourceIdentity,
  hydrateTranslatedItem,
  readTranslationBatch,
  translationWorkload,
} from "./translation-batch-utils.mjs";

function parseOptions(argv) {
  const options = { batch: null, shards: 10, inputPrefix: null, output: null };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--batch") options.batch = argv[++index];
    else if (value === "--shards") options.shards = Number.parseInt(argv[++index], 10);
    else if (value === "--input-prefix") options.inputPrefix = argv[++index];
    else if (value === "--output") options.output = argv[++index];
    else throw new Error(`Unknown argument: ${value}`);
  }
  if (!options.batch) throw new Error("Set --batch.");
  if (!Number.isInteger(options.shards) || options.shards < 2 || options.shards > 10) {
    throw new Error("--shards must be between 2 and 10.");
  }
  options.inputPrefix ??= options.batch.replace(/\.json$/i, "");
  options.output ??= `${options.inputPrefix}-complete.json`;
  return options;
}

function shardPath(prefix, index, count) {
  return `${prefix}-shard-${String(index).padStart(2, "0")}-of-${String(count).padStart(2, "0")}.json`;
}

function main() {
  const options = parseOptions(process.argv.slice(2));
  const { batch } = readTranslationBatch(options.batch);
  const sourceItems = new Map(batch.items.map((item) => [item.jobId, item]));
  const translatedItems = new Map();
  for (let index = 1; index <= options.shards; index += 1) {
    const file = shardPath(options.inputPrefix, index, options.shards);
    const { batch: shard } = readTranslationBatch(file);
    if (shard.locale !== batch.locale) throw new Error(`${file} locale does not match the source batch.`);
    for (const item of shard.items) {
      if (translatedItems.has(item.jobId)) throw new Error(`Duplicate translated job ${item.jobId}.`);
      const sourceItem = sourceItems.get(item.jobId);
      if (!sourceItem) throw new Error(`Unknown translated job ${item.jobId}.`);
      assertSourceIdentity(sourceItem, item);
      const hydratedItem = hydrateTranslatedItem(sourceItem, item);
      assertCompletedTranslation(hydratedItem);
      translatedItems.set(item.jobId, hydratedItem);
    }
  }
  if (translatedItems.size !== batch.items.length) {
    throw new Error(`Expected ${batch.items.length} completed translations, found ${translatedItems.size}.`);
  }
  const merged = {
    ...batch,
    mergedAt: new Date().toISOString(),
    items: batch.items.map((sourceItem) => ({
      ...sourceItem,
      translation: translatedItems.get(sourceItem.jobId).translation,
    })),
  };
  fs.mkdirSync(path.dirname(path.resolve(options.output)), { recursive: true });
  fs.writeFileSync(options.output, `${JSON.stringify(merged, null, 2)}\n`);
  console.log(JSON.stringify({
    ok: true,
    output: options.output,
    items: merged.items.length,
    workload: merged.items.reduce((total, item) => total + translationWorkload(item), 0),
  }, null, 2));
}

main();
