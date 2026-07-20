import process from "node:process";

import { createDatabaseClient, loadProjectEnv, parseArgs } from "./i18n-utils.mjs";
import { getTranslationVerificationReport } from "./translation-verification.mjs";

async function main() {
  loadProjectEnv();
  const options = parseArgs(process.argv.slice(2));
  const disable = options.disable;
  const client = createDatabaseClient();
  await client.connect();
  try {
    if (!disable) {
      const report = await getTranslationVerificationReport(client, options.locale);
      if (!report.ok) {
        console.error(JSON.stringify(report, null, 2));
        throw new Error(`Refusing to index ${options.locale}: translation verification failed.`);
      }
    }
    await client.query(
      "update public.content_locales set is_indexable=$2, updated_at=now() where code=$1 and not is_default",
      [options.locale, !disable],
    );
    console.log(JSON.stringify({ ok: true, locale: options.locale, indexable: !disable }, null, 2));
  } finally {
    await client.end().catch(() => {});
  }
}

main().catch((error) => {
  console.error("LOCALE_PUBLICATION_FAILED");
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exitCode = 1;
});
