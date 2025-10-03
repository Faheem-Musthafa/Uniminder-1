/**
 * In-memory rate limiter for API endpoints
 * Uses sliding window algorithm for accurate rate limiting
 * Note: For production with multiple servers, consider using Redis
 */

/**
 * Rate limit result interface
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * In-memory cache for rate limit timestamps
 * Maps identifier to array of request timestamps
 */
const rateLimit = new Map<string, number[]>();

/**
 * Clean up expired entries periodically to prevent memory leaks
 */
setInterval(() => {
  const now = Date.now();
  const oneHourAgo = now - (60 * 60 * 1000);
  
  for (const [key, timestamps] of rateLimit.entries()) {
    const filtered = timestamps.filter((t) => t > oneHourAgo);
    if (filtered.length === 0) {
      rateLimit.delete(key);
    } else {
      rateLimit.set(key, filtered);
    }
  }
}, 10 * 60 * 1000); // Clean every 10 minutes

/**
 * Rate limiter using sliding window algorithm
 * @param identifier - Unique identifier (user ID, IP, etc.)
 * @param limit - Maximum number of requests allowed in the window
 * @param window - Time window in milliseconds
 * @returns Rate limit result with allowed status and remaining requests
 */
export function rateLimiter(
  identifier: string,
  limit: number = 10,
  window: number = 60000
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - window;

  // Get existing requests for this identifier
  const requests = rateLimit.get(identifier) || [];
  
  // Filter to only include requests within the current window
  const recentRequests = requests.filter((timestamp) => timestamp > windowStart);

  // Check if rate limit exceeded
  if (recentRequests.length >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: Math.min(...recentRequests) + window,
    };
  }

  // Add current request timestamp
  recentRequests.push(now);
  rateLimit.set(identifier, recentRequests);

  return {
    allowed: true,
    remaining: limit - recentRequests.length,
    resetTime: now + window,
  };
}

/**
 * Common rate limit configurations
 */
export const RateLimits = {
  /** Strict limits for sensitive operations (10 requests/minute) */
  strict: { limit: 10, window: 60 * 1000 },
  
  /** Standard limits for normal API calls (50 requests/minute) */
  standard: { limit: 50, window: 60 * 1000 },
  
  /** Generous limits for read operations (100 requests/minute) */
  generous: { limit: 100, window: 60 * 1000 },
  
  /** Auth operations like login/signup (5 requests/15 minutes) */
  auth: { limit: 5, window: 15 * 60 * 1000 },
};

/**
 * Clear all rate limit records (useful for testing)
 */
export function clearRateLimits(): void {
  rateLimit.clear();
}

/**
 * Get current cache size (useful for monitoring)
 */
export function getRateLimitCacheSize(): number {
  return rateLimit.size;
}
