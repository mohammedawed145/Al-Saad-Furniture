import mongoose from 'mongoose';
import { config } from './env.js';

export async function connectDb() {
  mongoose.set('strictQuery', true);
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(config.mongodbUri);
  console.log('MongoDB connected');
}
