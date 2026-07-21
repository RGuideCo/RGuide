import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import {
  compactTranslationItem,
  readTranslationBatch,
  translationWorkload,
} from "./translation-batch-utils.mjs";

function parseOptions(argv) {
  const options = { batch: null, shards: 10, outputPrefix: null, compact: true };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--batch") options.batch = argv[++index];
    else if (value === "--shards") options.shards = Number.parseInt(argv[++index], 10);
    else if (value === "--output-prefix") options.outputPrefix = argv[++index];
    else if (value === "--full") options.compact = false;
    else throw new Error(`Unknown argument: ${value}`);
  }
  if (!options.batch) throw new Error("Set --batch.");
  if (!Number.isInteger(options.shards) || options.shards < 2 || options.shards > 10) {
    throw new Error("--shards must be between 2 and 10.");
  }
  options.outputPrefix ??= options.batch.replace(/\.json$/i, "");
  return options;
}

function shardPath(prefix, index, count) {
  return `${prefix}-shard-${String(index).padStart(2, "0")}-of-${String(count).padStart(2, "0")}.json`;
}

function main() {
  const options = parseOptions(process.argv.slice(2));
  const { batch } = readTranslationBatch(options.batch);
  if (options.shards > batch.items.length) throw new Error("Shard count cannot exceed batch item count.");
  const bins = Array.from({ length: options.shards }, (_, index) => ({ index, workload: 0, items: [] }));
  const rankedItems = batch.items
    .map((item, sourceIndex) => ({ item, sourceIndex, workload: translationWorkload(item) }))
    .sort((left, right) => right.workload - left.workload || left.sourceIndex - right.sourceIndex);
  for (const ranked of rankedItems) {
    const bin = [...bins].sort((left, right) => left.workload - right.workload || left.index - right.index)[0];
    bin.items.push(ranked.item);
    bin.workload += ranked.workload;
  }
  const outputs = bins.map((bin) => {
    const output = shardPath(options.outputPrefix, bin.index + 1, options.shards);
    fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
    fs.writeFileSync(output, `${JSON.stringify({
      ...batch,
      format: options.compact ? "compact-translation-shard-v1" : "full-translation-shard-v1",
      shard: { index: bin.index + 1, total: options.shards, workload: bin.workload },
      items: options.compact ? bin.items.map(compactTranslationItem) : bin.items,
    }, null, 2)}\n`);
    return { output, items: bin.items.length, workload: bin.workload };
  });
  console.log(JSON.stringify({ ok: true, batch: options.batch, shards: outputs }, null, 2));
}

main();
