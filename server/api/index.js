import { app } from '../server.js';
import { connectDb } from '../config/db.js';

let connectionPromise;

export default async function handler(req, res) {
  connectionPromise ||= connectDb();
  await connectionPromise;
  return app(req, res);
}
