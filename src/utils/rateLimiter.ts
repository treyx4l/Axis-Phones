/**
 * Rate Limiter Utility
 * 
 * Implements a token bucket algorithm for rate limiting system operations
 * Prevents abuse and excessive API calls across the application
 */

// Rate limit configurations for different operations
export const RATE_LIMIT_CONFIGS = {
  // Cart operations
  ADD_TO_CART: {
    maxRequests: 20,
    windowMs: 60 * 1000, // 1 minute
  },
  
  // Checkout operations
  CHECKOUT: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  
  // Order creation
  CREATE_ORDER: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  
  // Admin product operations
  ADMIN_ADD_PRODUCT: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  
  ADMIN_UPDATE_PRODUCT: {
    maxRequests: 20,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  
  ADMIN_DELETE_PRODUCT: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  
  // Authentication operations
  SIGN_IN: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  
  // Notifications
  NOTIFICATION: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
}

interface RateLimitConfig {
  maxRequests: number // Maximum number of requests allowed
  windowMs: number // Time window in milliseconds
  identifier?: string // Optional identifier for different rate limit buckets
}

interface RateLimitBucket {
  tokens: number
  lastRefill: number
  requests: number[]
}

// In-memory store for rate limit buckets
// In production, consider using Redis or a database for distributed systems
const rateLimitStore = new Map<string, RateLimitBucket>()

/**
 * Check if a request should be rate limited
 * @param config Rate limit configuration
 * @returns Object with allowed status and remaining requests
 */
export const checkRateLimit = (config: RateLimitConfig): {
  allowed: boolean
  remaining: number
  resetTime: number
} => {
  const key = config.identifier || 'default'
  const now = Date.now()
  
  // Get or create bucket
  let bucket = rateLimitStore.get(key)
  
  if (!bucket) {
    bucket = {
      tokens: config.maxRequests,
      lastRefill: now,
      requests: [],
    }
    rateLimitStore.set(key, bucket)
  }
  
  // Refill tokens based on elapsed time
  const elapsed = now - bucket.lastRefill
  const tokensToAdd = Math.floor((elapsed / config.windowMs) * config.maxRequests)
  
  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(config.maxRequests, bucket.tokens + tokensToAdd)
    bucket.lastRefill = now
    
    // Clean up old requests outside the window
    bucket.requests = bucket.requests.filter(
      timestamp => now - timestamp < config.windowMs
    )
  }
  
  // Check if we have tokens available
  const hasToken = bucket.tokens >= 1
  const withinWindow = bucket.requests.length < config.maxRequests
  
  if (hasToken && withinWindow) {
    // Consume a token
    bucket.tokens -= 1
    bucket.requests.push(now)
    
    // Calculate reset time (when next token will be available)
    const oldestRequest = bucket.requests[0]
    const resetTime = oldestRequest ? oldestRequest + config.windowMs : now + config.windowMs
    
    return {
      allowed: true,
      remaining: Math.max(0, config.maxRequests - bucket.requests.length),
      resetTime,
    }
  }
  
  // Rate limit exceeded
  const oldestRequest = bucket.requests[0]
  const resetTime = oldestRequest ? oldestRequest + config.windowMs : now + config.windowMs
  
  return {
    allowed: false,
    remaining: 0,
    resetTime,
  }
}

/**
 * Reset rate limit for a specific identifier
 */
export const resetRateLimit = (identifier: string): void => {
  rateLimitStore.delete(identifier)
}

/**
 * Clear all rate limit buckets (useful for testing)
 */
export const clearAllRateLimits = (): void => {
  rateLimitStore.clear()
}

/**
 * Get current rate limit status
 */
export const getRateLimitStatus = (identifier: string): {
  tokens: number
  requests: number
  maxRequests: number
} | null => {
  const bucket = rateLimitStore.get(identifier)
  if (!bucket) return null
  
  return {
    tokens: bucket.tokens,
    requests: bucket.requests.length,
    maxRequests: bucket.requests.length + bucket.tokens,
  }
}

