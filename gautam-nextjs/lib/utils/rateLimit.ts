/**
 * Simple in-memory rate limiter
 * For production with multiple servers, consider using Redis-based solution like Upstash
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  /**
   * Identifier for the request (e.g., IP address, email)
   */
  identifier: string;
  
  /**
   * Namespace for the rate limit (e.g., 'login', 'register', 'send-otp')
   */
  namespace: string;
  
  /**
   * Maximum number of requests allowed
   */
  limit: number;
  
  /**
   * Time window in seconds
   */
  windowInSeconds: number;
}

export interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  allowed: boolean;
  
  /**
   * Number of requests remaining in current window
   */
  remaining: number;
  
  /**
   * Time until reset in seconds
   */
  resetIn?: number;
  
  /**
   * Total limit
   */
  limit: number;
}

/**
 * Check if a request should be rate limited
 */
export function checkRateLimit(options: RateLimitOptions): RateLimitResult {
  const { identifier, namespace, limit, windowInSeconds } = options;
  const key = `${namespace}:${identifier}`;
  const now = Date.now();
  const windowMs = windowInSeconds * 1000;
  
  const entry = store.get(key);
  
  // No entry exists, create new one
  if (!entry) {
    store.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    
    return {
      allowed: true,
      remaining: limit - 1,
      limit,
    };
  }
  
  // Entry exists but window has expired, reset
  if (entry.resetAt < now) {
    store.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    
    return {
      allowed: true,
      remaining: limit - 1,
      limit,
    };
  }
  
  // Entry exists and window is still valid
  const newCount = entry.count + 1;
  
  if (newCount > limit) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((entry.resetAt - now) / 1000),
      limit,
    };
  }
  
  // Update count
  entry.count = newCount;
  
  return {
    allowed: true,
    remaining: limit - newCount,
    limit,
  };
}

/**
 * Get client IP address from request
 */
export function getClientIp(request: Request): string {
  // Try to get IP from various headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  
  // Fallback to a default value (not ideal, but prevents errors)
  return 'unknown';
}

/**
 * Common rate limit presets
 */
export const RateLimitPresets = {
  /**
   * For login attempts: 5 attempts per 15 minutes
   */
  LOGIN: {
    limit: 5,
    windowInSeconds: 15 * 60, // 15 minutes
  },
  
  /**
   * For registration: 3 attempts per hour
   */
  REGISTER: {
    limit: 3,
    windowInSeconds: 60 * 60, // 1 hour
  },
  
  /**
   * For OTP sending: 3 OTPs per hour per email
   */
  SEND_OTP: {
    limit: 3,
    windowInSeconds: 60 * 60, // 1 hour
  },
  
  /**
   * For OTP verification: 5 attempts per 15 minutes
   */
  VERIFY_OTP: {
    limit: 5,
    windowInSeconds: 15 * 60, // 15 minutes
  },
  
  /**
   * For password reset: 3 attempts per hour
   */
  PASSWORD_RESET: {
    limit: 3,
    windowInSeconds: 60 * 60, // 1 hour
  },
  
  /**
   * General API: 60 requests per minute
   */
  API_GENERAL: {
    limit: 60,
    windowInSeconds: 60, // 1 minute
  },
};
