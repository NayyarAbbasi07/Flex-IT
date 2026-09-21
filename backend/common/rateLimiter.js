/**
 * Simple in-memory rate limiter (no extra dependency).
 * Suitable for single-process local/dev; use Redis-backed limiter in multi-instance prod if needed.
 */
function createRateLimiter({ windowMs = 15 * 60 * 1000, max = 40 } = {}) {
  const hits = new Map();

  return function rateLimiter(req, res, next) {
    const key = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const now = Date.now();
    let entry = hits.get(key);
    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }
    entry.count += 1;
    if (entry.count > max) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests, please try again later',
      });
    }
    next();
  };
}

module.exports = { createRateLimiter };
