import "server-only";

const POSTGRES_PROTOCOLS = new Set(["postgres:", "postgresql:"]);

export function isPostgresDatabaseUrl(value: string | null | undefined) {
  const candidate = value?.trim();
  if (!candidate) {
    return false;
  }

  try {
    const parsed = new URL(candidate);
    return (
      POSTGRES_PROTOCOLS.has(parsed.protocol) &&
      Boolean(parsed.hostname) &&
      parsed.hostname.toLowerCase() !== "base"
    );
  } catch {
    return false;
  }
}

export function getServerDatabaseUrl() {
  const candidate = [
    process.env.SUPABASE_DB_URL,
    process.env.SUPABASE_DATABASE_URL,
    process.env.DATABASE_URL,
  ].find(isPostgresDatabaseUrl);

  return candidate?.trim() ?? null;
}
