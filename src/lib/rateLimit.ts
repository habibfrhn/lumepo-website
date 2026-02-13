type Entry = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Entry>();

export function rateLimit(
  key: string,
  windowMs: number,
  max: number,
): { ok: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (entry.count >= max) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  buckets.set(key, entry);
  return { ok: true };
}
