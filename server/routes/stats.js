import { Router } from 'express';
import { getStats } from '../controllers/statsController.js';
import { requireAuth } from '../middleware/auth.js';

export const statsRouter = Router();
statsRouter.get('/', requireAuth, getStats);
