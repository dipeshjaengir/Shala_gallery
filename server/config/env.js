import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PROJECT_ROOT = path.resolve(__dirname, '../..');
export const ROOT_ENV_PATH = path.join(PROJECT_ROOT, '.env');

// Explicitly load the root .env file regardless of current working directory
dotenv.config({ path: ROOT_ENV_PATH });

export const getEnv = () => ({
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI,
  DB_NAME: 'Shala_gallery',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'ieyxmxrp',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER || 'shala_gallery',
  CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET || 'shala_gallery',
  ADMIN_EMAIL: (process.env.ADMIN_EMAIL || 'dipeshjangir12@gmail.com').toLowerCase(),
  ADMIN_EMAILS: Array.from(
    new Set([
      (process.env.ADMIN_EMAIL || 'dipeshjangir12@gmail.com').trim().toLowerCase(),
      'shalagallery@gmail.com',
      ...(process.env.ADDITIONAL_ADMIN_EMAILS
        ? process.env.ADDITIONAL_ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase())
        : []),
    ])
  ),
  JWT_SECRET: process.env.JWT_SECRET || 'shala_gallery_jwt_secure_session_token_key_987654321',
});

export const isAuthorizedAdminEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const normalized = email.trim().toLowerCase();
  const { ADMIN_EMAILS } = getEnv();
  return ADMIN_EMAILS.includes(normalized);
};

export const validateMongoUri = (uri) => {
  if (!uri || !uri.trim()) {
    return {
      isValid: false,
      isPlaceholder: false,
      reason: 'MONGODB_URI is missing or empty in root .env file.',
    };
  }

  const trimmed = uri.trim();
  const isPlaceholder =
    trimmed.includes('REPLACE_WITH_') ||
    trimmed.includes('<password>') ||
    trimmed.includes('<username>') ||
    trimmed.includes('<cluster-url>');

  if (isPlaceholder) {
    return {
      isValid: false,
      isPlaceholder: true,
      reason: 'MONGODB_URI contains unconfigured placeholder tokens.',
    };
  }

  if (!trimmed.startsWith('mongodb://') && !trimmed.startsWith('mongodb+srv://')) {
    return {
      isValid: false,
      isPlaceholder: false,
      reason: "MONGODB_URI must begin with 'mongodb://' or 'mongodb+srv://'.",
    };
  }

  return { isValid: true, isPlaceholder: false };
};
