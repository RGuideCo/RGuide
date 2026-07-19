import process from "node:process";

import { createDatabaseClient, loadProjectEnv, parseArgs } from "./i18n-utils.mjs";
import { getTranslationVerificationReport } from "./translation-verification.mjs";

async function main() {
  loadProjectEnv();
  const options = parseArgs(process.argv.slice(2));
  const client = createDatabaseClient();
  await client.connect();
  try {
    const report = await getTranslationVerificationReport(client, options.locale);
    console.log(JSON.stringify(report, null, 2));
    if (!report.ok) process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}

main().catch((error) => {
  console.error("TRANSLATION_VERIFICATION_FAILED");
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exitCode = 1;
});
