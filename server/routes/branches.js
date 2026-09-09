import { Router } from 'express';
import { listBranches, createBranch, updateBranch, deleteBranch } from '../controllers/branchController.js';
import { requireAuth } from '../middleware/auth.js';

export const branchRouter = Router();
branchRouter.get('/', listBranches);
branchRouter.post('/', requireAuth, createBranch);
branchRouter.put('/:id', requireAuth, updateBranch);
branchRouter.delete('/:id', requireAuth, deleteBranch);
