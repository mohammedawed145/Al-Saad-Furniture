import { app } from '../server.js';
import { connectDb } from '../config/db.js';
import { bootstrapCatalog } from '../services/bootstrapCatalog.js';

let connectionPromise;

export default async function handler(req, res) {
  try {
    connectionPromise ||= connectDb().then(bootstrapCatalog);

    await connectionPromise;

    return app(req, res);
  } catch (error) {
    console.error('MongoDB connection error:', error);

    return res.status(500).json({
      message: 'Database connection failed',
    });
  }
}
