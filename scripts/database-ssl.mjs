import fs from "node:fs";

const bundledSupabaseCa = fs.readFileSync(
  new URL("../certificates/supabase-prod-ca-2021.crt", import.meta.url),
  "utf8",
);

export function getPgSslConfig(databaseUrl) {
  return databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
    ? false
    : {
        ca: process.env.SUPABASE_DB_CA_CERT?.replace(/\\n/g, "\n") || bundledSupabaseCa,
        rejectUnauthorized: true,
      };
}
