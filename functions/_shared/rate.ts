/**
 * Fixed-window rate limiting backed by D1.
 *
 * Cloudflare's own rate limiting rules would be the better long-term home, but
 * the PRD requires the limit to live in the function and the volume is tiny, so
 * one row per bucket is enough. Returns true when the request is allowed.
 */

export async function rateLimit(
  db: D1Database,
  bucket: string,
  limit: number,
  windowSeconds = 60,
): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const cutoff = now - windowSeconds;

  const row = await db
    .prepare(
      `INSERT INTO rate_limits (bucket, hits, window_start) VALUES (?1, 1, ?2)
       ON CONFLICT (bucket) DO UPDATE SET
         hits = CASE WHEN rate_limits.window_start <= ?3 THEN 1 ELSE rate_limits.hits + 1 END,
         window_start = CASE WHEN rate_limits.window_start <= ?3 THEN ?2 ELSE rate_limits.window_start END
       RETURNING hits`,
    )
    .bind(bucket, now, cutoff)
    .first<{ hits: number }>();

  return (row?.hits ?? 1) <= limit;
}

/** Old buckets are deleted by the weekly retention job, not on every request. */
export async function pruneRateLimits(db: D1Database, olderThanSeconds = 86_400): Promise<void> {
  const cutoff = Math.floor(Date.now() / 1000) - olderThanSeconds;
  await db.prepare('DELETE FROM rate_limits WHERE window_start < ?').bind(cutoff).run();
}
