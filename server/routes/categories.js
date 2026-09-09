import { Router } from 'express';
import { listCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

export const categoryRouter = Router();
categoryRouter.get('/', listCategories);
categoryRouter.post('/', requireAuth, upload.single('image'), createCategory);
categoryRouter.put('/:id', requireAuth, upload.single('image'), updateCategory);
categoryRouter.delete('/:id', requireAuth, deleteCategory);
