import { Router } from 'express';
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

export const productRouter = Router();
productRouter.get('/', listProducts);
productRouter.get('/:id', getProduct);
productRouter.post('/', requireAuth, upload.array('images', 10), createProduct);
productRouter.put('/:id', requireAuth, upload.array('images', 10), updateProduct);
productRouter.delete('/:id', requireAuth, deleteProduct);
