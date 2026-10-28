import { rateLimit, ipKeyGenerator } from 'express-rate-limit';

/**
 * Normalizes client IP using express-rate-limit's built-in IPv6 subnet helper.
 */
const getNormalizedIp = (req) => {
  const rawIp = req.ip || req.socket?.remoteAddress || '127.0.0.1';
  return ipKeyGenerator(rawIp);
};

/**
 * Per-account login limiter.
 * Partitions limits by client IP and normalized email address.
 *
 * Requirements satisfied:
 * - skipSuccessfulRequests: true ensures legitimate successful logins do NOT consume rate-limit quota.
 * - Partitioned by IP + email so failed attempts on one administrator account
 *   do not penalize or lock out other administrator accounts.
 * - Allows 10 failed attempts within a 15-minute window per IP + account pair.
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // 10 failed attempts per 15-minute window per (IP + email)
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Only failed attempts (status >= 400) count against the limit
  keyGenerator: (req) => {
    const ip = getNormalizedIp(req);
    const email = (req.body?.email && typeof req.body.email === 'string')
      ? req.body.email.trim().toLowerCase()
      : '';
    return email ? `${ip}_${email}` : ip;
  },
  handler: (req, res, _next, options) => {
    return res.status(options.statusCode).json({
      status: 'error',
      message: 'Too many failed login attempts. Please wait 15 minutes before trying again.',
    });
  },
});

/**
 * IP-level brute-force guard.
 * Prevents a single IP from spraying many different email accounts (credential stuffing).
 * Allows 30 failed attempts per 15 minutes across all accounts combined.
 */
export const loginIpGuard = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 30, // 30 failed attempts total across all accounts from this IP
  standardHeaders: false, // Let loginLimiter handle the primary rate-limit response headers
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Successful logins never count against the IP quota
  keyGenerator: (req) => getNormalizedIp(req),
  handler: (req, res, _next, options) => {
    return res.status(options.statusCode).json({
      status: 'error',
      message: 'Too many failed login attempts from this network. Please wait 15 minutes before trying again.',
    });
  },
});

/**
 * Resets the in-memory login rate limit for the given request and email upon successful authentication.
 */
export const resetLoginRateLimit = async (req, email) => {
  try {
    const ip = getNormalizedIp(req);
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (normalizedEmail) {
      await loginLimiter.resetKey(`${ip}_${normalizedEmail}`);
    }
    await loginLimiter.resetKey(ip);
    await loginIpGuard.resetKey(ip);
  } catch (err) {
    console.warn('[RateLimiter] Error resetting login rate limit:', err?.message || err);
  }
};

/**
 * Inquiries submission limiter to protect contact forms from spam.
 */
export const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getNormalizedIp(req),
  handler: (req, res, _next, options) => {
    return res.status(options.statusCode).json({
      status: 'error',
      message: 'Submission limit reached. Please wait a while before submitting another inquiry, or email shalagallery@gmail.com directly.',
    });
  },
});
