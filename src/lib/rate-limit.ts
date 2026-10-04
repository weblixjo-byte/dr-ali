interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const ipMap = new Map<string, RateLimitRecord>();

/**
 * Basic in-memory rate limiter for serverless environment.
 * Default: max 10 submissions per 10 minutes per IP.
 */
export function checkRateLimit(
  ip: string,
  maxRequests: number = 10,
  windowMs: number = 10 * 60 * 1000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = ipMap.get(ip);

  // Clean up expired records occasionally
  if (ipMap.size > 1000) {
    for (const [key, val] of ipMap.entries()) {
      if (val.resetAt < now) {
        ipMap.delete(key);
      }
    }
  }

  if (!record || record.resetAt < now) {
    ipMap.set(ip, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: maxRequests - record.count };
}
