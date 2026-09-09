import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import { connectDb } from './config/db.js';
import { authRouter } from './routes/auth.js';
import { productRouter } from './routes/products.js';
import { categoryRouter } from './routes/categories.js';
import { branchRouter } from './routes/branches.js';
import { messageRouter } from './routes/messages.js';
import { statsRouter } from './routes/stats.js';
import { errorHandler, notFound } from './middleware/error.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || origin === config.clientOrigin) {
        callback(null, true);
        return;
      }

      const isLocalDevelopment =
        process.env.NODE_ENV !== 'production' &&
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

      callback(null, isLocalDevelopment);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/branches', branchRouter);
app.use('/api/messages', messageRouter);
app.use('/api/stats', statsRouter);

app.use(notFound);
app.use(errorHandler);

connectDb()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Al-Saad Furniture API running on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  });
