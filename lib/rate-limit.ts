type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

// In-memory Map is fine here: this limiter guards a single admin-triggered
// internal endpoint, not user-facing traffic, so a reset on cold start is an
// acceptable tradeoff (no Redis/durable store needed).
const hits = new Map<string, number[]>();

export function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  const timestamps = (hits.get(key) ?? []).filter((timestamp) => timestamp > windowStart);

  if (timestamps.length >= limit) {
    const retryAfterMs = timestamps[0] + windowMs - now;
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
  }

  timestamps.push(now);
  hits.set(key, timestamps);

  return { allowed: true, retryAfterSeconds: 0 };
}
