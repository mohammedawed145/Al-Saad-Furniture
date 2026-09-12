import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { deleteStoredImage, saveUploadedFile } from '../services/media.js';
import { boundedString } from '../utils/validate.js';

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export async function listCategories(_req, res, next) {
  try {
    const categories = await Category.find().sort({ nameEn: 1 });
    res.json(categories);
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const nameEn = boundedString(req.body.nameEn, 'Name (EN)', 120, 1);
    const nameAr = boundedString(req.body.nameAr, 'Name (AR)', 120, 1);
    let image = req.body.image || '';
    if (req.file) image = await saveUploadedFile(req.file);
    const slug = slugify(req.body.slug || nameEn) || `category-${Date.now()}`;
    const category = await Category.create({ nameEn, nameAr, image, slug });
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      error.status = 400;
      error.message = 'A category with this name already exists';
    }
    next(error);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (req.body.nameEn !== undefined) category.nameEn = boundedString(req.body.nameEn, 'Name (EN)', 120, 1);
    if (req.body.nameAr !== undefined) category.nameAr = boundedString(req.body.nameAr, 'Name (AR)', 120, 1);
    if (req.body.slug) category.slug = slugify(req.body.slug);
    if (req.file) {
      deleteStoredImage(category.image);
      category.image = await saveUploadedFile(req.file);
    } else if (typeof req.body.image === 'string') {
      category.image = req.body.image;
    }
    await category.save();
    res.json(category);
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const used = await Product.countDocuments({ category: req.params.id });
    if (used > 0) {
      return res.status(400).json({ message: 'Cannot delete a category that has products' });
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    deleteStoredImage(category.image);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
}
