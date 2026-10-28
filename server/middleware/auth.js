import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getEnv, isAuthorizedAdminEmail } from '../config/env.js';

dotenv.config();

const { JWT_SECRET } = getEnv();

export const requireAdmin = (req, res, next) => {
  // Check cookie first (HTTP-only), then Authorization header
  let token = req.cookies?.shala_admin_token;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required. Please log in as an administrator.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.email || !isAuthorizedAdminEmail(decoded.email)) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. You do not have administrator permissions.',
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Session expired or invalid token. Please log in again.',
    });
  }
};

export const signAdminToken = (email) => {
  return jwt.sign({ email, role: 'admin' }, JWT_SECRET, {
    expiresIn: '7d',
  });
};
