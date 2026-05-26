# R2 Venue Media Ingestion

Use the **R2 Venue Media Ingestion** GitHub Actions workflow for bulk image migration. This avoids relying on a Codex shell session for long network-heavy jobs.

## Required GitHub Secrets

Add these in GitHub under **Settings -> Secrets and variables -> Actions**:

- `SUPABASE_DB_URL`
- `CLOUDFLARE_R2_BUCKET`
- `CLOUDFLARE_R2_ENDPOINT`
- `CLOUDFLARE_R2_ACCESS_KEY_ID`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- `CLOUDFLARE_R2_PUBLIC_BASE_URL`

`SUPABASE_DB_URL` should use the Supabase pooler, for example the session pooler host `aws-1-us-east-2.pooler.supabase.com` on port `5432`.

## Running The Workflow

1. Open GitHub Actions.
2. Select **R2 Venue Media Ingestion**.
3. Choose **Run workflow**.
4. Enter a comma-separated city list, such as `London,Rome,Amsterdam`.
5. Keep `openverse_fallback` enabled for normal runs.
6. Use `dry_run` first when testing new secrets.

Recommended first run:

```txt
cities: Amsterdam
limit: 5
openverse_fallback: true
dry_run: true
```

Recommended production retry:

```txt
cities: London,Rome,Amsterdam
limit: 1000
openverse_fallback: true
dry_run: false
```

The workflow runs cities sequentially to avoid spiking Supabase, R2, and source image hosts.
