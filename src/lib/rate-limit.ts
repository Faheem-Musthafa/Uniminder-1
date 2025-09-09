// Rate limiting utility for API routes
const rateLimit = new Map();

export function rateLimiter(
  identifier: string,
  limit: number = 10,
  window: number = 60000
) {
  const now = Date.now();
  const windowStart = now - window;

  // Clean old entries
  for (const [key, timestamps] of rateLimit.entries()) {
    const filtered = timestamps.filter((t: number) => t > windowStart);
    if (filtered.length === 0) {
      rateLimit.delete(key);
    } else {
      rateLimit.set(key, filtered);
    }
  }

  // Check current identifier
  const requests = rateLimit.get(identifier) || [];
  const recentRequests = requests.filter((t: number) => t > windowStart);

  if (recentRequests.length >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: Math.min(...recentRequests) + window,
    };
  }

  recentRequests.push(now);
  rateLimit.set(identifier, recentRequests);

  return {
    allowed: true,
    remaining: limit - recentRequests.length,
    resetTime: now + window,
  };
}
