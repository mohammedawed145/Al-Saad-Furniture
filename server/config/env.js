import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
  port: Number(process.env.PORT) || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/al-saad-furniture',
  jwtSecret: process.env.JWT_SECRET || 'dev-only-change-me',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@alsaad.local',
  adminPassword: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
  sitePhone: process.env.SITE_PHONE || '+201064990995',
  siteWhatsapp: process.env.SITE_WHATSAPP || '201064990995',
  siteEmail: process.env.SITE_EMAIL || 'asaadfurniture19@gmail.com',
};
