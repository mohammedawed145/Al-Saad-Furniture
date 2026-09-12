import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
const defaultJwtSecret = 'dev-only-change-me';
const defaultAdminPassword = 'ChangeMe123!';

if (isProduction) {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_ORIGIN', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];
  const missing = required.filter((name) => !String(process.env[name] || '').trim());
  if (missing.length) {
    throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);
  }
  if (process.env.JWT_SECRET === defaultJwtSecret || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters and must not use the development default.');
  }
  if (process.env.ADMIN_PASSWORD === defaultAdminPassword || process.env.ADMIN_PASSWORD.length < 12) {
    throw new Error('ADMIN_PASSWORD must be at least 12 characters and must not use the development default.');
  }
  if (!/^https:\/\//.test(process.env.CLIENT_ORIGIN)) {
    throw new Error('CLIENT_ORIGIN must be an HTTPS URL in production.');
  }
}

export const config = {
  port: Number(process.env.PORT) || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/al-saad-furniture',
  jwtSecret: process.env.JWT_SECRET || defaultJwtSecret,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@alsaad.local',
  adminPassword: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
  sitePhone: process.env.SITE_PHONE || '+201064990995',
  siteWhatsapp: process.env.SITE_WHATSAPP || '201064990995',
  siteEmail: process.env.SITE_EMAIL || 'asaadfurniture19@gmail.com',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
  resendApiKey: process.env.RESEND_API_KEY || '',
  notificationEmail: process.env.NOTIFICATION_EMAIL || '',
};
