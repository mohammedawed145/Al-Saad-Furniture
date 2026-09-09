import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { Branch } from '../models/Branch.js';
import { Message } from '../models/Message.js';

export async function getStats(_req, res, next) {
  try {
    const [products, categories, branches, messages, unread] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Branch.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ status: 'new' }),
    ]);
    res.json({ products, categories, branches, messages, unread });
  } catch (error) {
    next(error);
  }
}
