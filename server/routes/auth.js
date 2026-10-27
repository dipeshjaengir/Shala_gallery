import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { Admin } from '../models/Admin.js';
import { requireAdmin, signAdminToken } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { getEnv } from '../config/env.js';

const router = Router();
const { ADMIN_EMAIL } = getEnv();

// Helper to get or initialize the admin document in MongoDB
const getAdminDoc = async () => {
  let admin = await Admin.findOne({ email: ADMIN_EMAIL });
  if (!admin) {
    admin = await Admin.create({
      email: ADMIN_EMAIL,
      isConfigured: false,
    });
  }
  return admin;
};

// Timing-safe comparison to prevent side-channel timing attacks
function safeCompareHashes(hashA, hashB) {
  if (!hashA || !hashB || typeof hashA !== 'string' || typeof hashB !== 'string') return false;
  const bufA = Buffer.from(hashA, 'hex');
  const bufB = Buffer.from(hashB, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// Cookie options helper for both same-origin and cross-origin environments
const getSessionCookieOptions = (maxAgeMs = 7 * 24 * 60 * 60 * 1000) => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: maxAgeMs,
    path: '/',
  };
};

// GET /api/auth/setup-status
router.get('/setup-status', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        status: 'ok',
        isConfigured: false,
        adminEmail: ADMIN_EMAIL,
        databaseConnected: false,
      });
    }
    const admin = await getAdminDoc();
    res.json({
      status: 'ok',
      isConfigured: admin.isConfigured,
      adminEmail: ADMIN_EMAIL,
      databaseConnected: true,
    });
  } catch (error) {
    console.warn('[Auth Status Notice]', error.message);
    res.json({
      status: 'ok',
      isConfigured: false,
      adminEmail: ADMIN_EMAIL,
      databaseConnected: false,
    });
  }
});

// POST /api/auth/setup - One-time initial setup
router.post('/setup', loginLimiter, async (req, res) => {
  const { setupToken, password } = req.body;

  if (!setupToken || !password || typeof setupToken !== 'string' || typeof password !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'Setup token and password are required.',
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      status: 'error',
      message: 'Password must be at least 8 characters long.',
    });
  }

  try {
    const admin = await getAdminDoc();

    if (admin.isConfigured) {
      return res.status(403).json({
        status: 'error',
        message: 'Initial admin setup has already been completed. Use the login page instead.',
      });
    }

    if (!admin.setupTokenHash) {
      return res.status(400).json({
        status: 'error',
        message: 'No setup token has been generated. Run `node server/scripts/init-admin.js` on the server to generate a secure setup token.',
      });
    }

    if (admin.setupTokenExpires && admin.setupTokenExpires < new Date()) {
      return res.status(400).json({
        status: 'error',
        message: 'Setup token has expired. Please generate a new one via `node server/scripts/init-admin.js`.',
      });
    }

    // Verify token hash timing-safely
    const inputHash = crypto.createHash('sha256').update(setupToken.trim()).digest('hex');
    if (!safeCompareHashes(inputHash, admin.setupTokenHash)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid setup token.',
      });
    }

    // Hash password with bcrypt (12 rounds)
    const salt = await bcrypt.genSalt(12);
    admin.passwordHash = await bcrypt.hash(password, salt);
    admin.isConfigured = true;
    admin.setupTokenHash = null;
    admin.setupTokenExpires = null;
    await admin.save();

    console.log(`[Auth] Initial administrator configured successfully for ${ADMIN_EMAIL}`);

    // Issue session token
    const token = signAdminToken(admin.email);
    res.cookie('shala_admin_token', token, getSessionCookieOptions());

    res.json({
      status: 'ok',
      message: 'Administrator account configured successfully.',
      token,
      email: admin.email,
    });
  } catch (error) {
    console.error('[Setup Error]', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to configure administrator.' });
  }
});

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'Email and password are required.',
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail !== ADMIN_EMAIL) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid email or password.',
    });
  }

  try {
    const admin = await getAdminDoc();

    if (!admin.isConfigured || !admin.passwordHash) {
      return res.status(403).json({
        status: 'error',
        message: 'Administrator account has not been set up yet. Please complete initial setup.',
        requiresSetup: true,
      });
    }

    if (admin.isLocked()) {
      const minutesRemaining = Math.ceil((admin.lockUntil - Date.now()) / (60 * 1000));
      return res.status(429).json({
        status: 'error',
        message: `Account is temporarily locked due to failed attempts. Try again in ${minutesRemaining} minute(s).`,
      });
    }

    const isValid = await admin.comparePassword(password);

    if (!isValid) {
      admin.failedLoginAttempts += 1;
      if (admin.failedLoginAttempts >= 5) {
        admin.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        console.warn(`[Auth] Account locked due to 5 failed attempts: ${ADMIN_EMAIL}`);
      }
      await admin.save();

      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password.',
      });
    }

    // Reset failed attempts on success
    admin.failedLoginAttempts = 0;
    admin.lockUntil = null;
    admin.lastLoginAt = new Date();
    await admin.save();

    const token = signAdminToken(admin.email);
    res.cookie('shala_admin_token', token, getSessionCookieOptions());

    res.json({
      status: 'ok',
      message: 'Logged in successfully.',
      token,
      email: admin.email,
    });
  } catch (error) {
    console.error('[Login Error]', error.message);
    res.status(500).json({ status: 'error', message: 'An error occurred during login.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('shala_admin_token', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  });
  res.json({ status: 'ok', message: 'Logged out successfully.' });
});

// GET /api/auth/me - Verify current session
router.get('/me', requireAdmin, (req, res) => {
  res.json({
    status: 'ok',
    authenticated: true,
    email: req.admin.email,
  });
});

// GET /api/auth/verify-reset-token - Check if reset token is valid
router.get('/verify-reset-token', loginLimiter, async (req, res) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({
      status: 'error',
      valid: false,
      message: 'Token is required.',
    });
  }

  try {
    const admin = await getAdminDoc();
    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');

    if (!admin.resetTokenHash || !safeCompareHashes(admin.resetTokenHash, tokenHash)) {
      return res.status(400).json({
        status: 'error',
        valid: false,
        message: 'Invalid or already used password reset token.',
      });
    }

    if (admin.resetTokenExpires && admin.resetTokenExpires < new Date()) {
      return res.status(400).json({
        status: 'error',
        valid: false,
        message: 'Password reset token has expired.',
      });
    }

    res.json({
      status: 'ok',
      valid: true,
      email: admin.email,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', valid: false, message: 'Failed to verify reset token.' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', loginLimiter, async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword || typeof token !== 'string' || typeof newPassword !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'Token and new password are required.',
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      status: 'error',
      message: 'Password must be at least 8 characters long.',
    });
  }

  try {
    const admin = await getAdminDoc();
    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');

    if (!admin.resetTokenHash || !safeCompareHashes(admin.resetTokenHash, tokenHash)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired password reset token.',
      });
    }

    if (admin.resetTokenExpires && admin.resetTokenExpires < new Date()) {
      return res.status(400).json({
        status: 'error',
        message: 'Password reset token has expired.',
      });
    }

    const salt = await bcrypt.genSalt(12);
    admin.passwordHash = await bcrypt.hash(newPassword, salt);
    admin.isConfigured = true;
    admin.resetTokenHash = null;
    admin.resetTokenExpires = null;
    admin.failedLoginAttempts = 0;
    admin.lockUntil = null;
    await admin.save();

    // Issue session token
    const sessionToken = signAdminToken(admin.email);
    res.cookie('shala_admin_token', sessionToken, getSessionCookieOptions());

    res.json({
      status: 'ok',
      message: 'Password has been reset successfully. You are now logged in.',
      token: sessionToken,
      email: admin.email,
    });
  } catch (error) {
    console.error('[Reset Error]', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to reset password.' });
  }
});

export default router;
