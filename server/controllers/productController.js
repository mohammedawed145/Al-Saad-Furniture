import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { deleteStoredImage, saveUploadedFiles } from '../services/media.js';
import { escapeRegex, parseStringList, requiredString } from '../utils/validate.js';

function parseExistingImages(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      return value.split(',').map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
}

export async function listProducts(req, res, next) {
  try {
    const { search = '', category, featured } = req.query;
    const filter = {};

    if (category) {
      if (mongoose.isValidObjectId(category)) {
        filter.category = category;
      } else {
        const found = await Category.findOne({ slug: String(category).toLowerCase() });
        if (found) filter.category = found._id;
        else filter.category = new mongoose.Types.ObjectId();
      }
    }

    if (featured === 'true') filter.featured = true;

    if (search) {
      const rx = new RegExp(escapeRegex(search), 'i');
      const matchingCategories = await Category.find({
        $or: [{ nameEn: rx }, { nameAr: rx }],
      }).select('_id');
      filter.$or = [
        { nameEn: rx },
        { nameAr: rx },
        { descriptionEn: rx },
        { descriptionAr: rx },
        { featuresEn: rx },
        { featuresAr: rx },
        { category: { $in: matchingCategories.map((item) => item._id) } },
      ];
    }

    const products = await Product.find(filter)
      .populate('category')
      .sort({ featured: -1, createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const nameEn = requiredString(req.body.nameEn, 'Name (EN)');
    const nameAr = requiredString(req.body.nameAr, 'Name (AR)');
    const category = requiredString(req.body.category, 'Category');
    const descriptionEn = requiredString(req.body.descriptionEn, 'Description (EN)');
    const descriptionAr = requiredString(req.body.descriptionAr, 'Description (AR)');
    const exists = await Category.findById(category);
    if (!exists) return res.status(400).json({ message: 'Invalid category' });

    const uploaded = await saveUploadedFiles(req.files || []);
    const existing = parseExistingImages(req.body.existingImages);
    const product = await Product.create({
      nameEn,
      nameAr,
      category,
      descriptionEn,
      descriptionAr,
      featuresEn: parseStringList(req.body.featuresEn),
      featuresAr: parseStringList(req.body.featuresAr),
      images: [...existing, ...uploaded],
      featured: req.body.featured === 'true' || req.body.featured === true,
    });
    const populated = await product.populate('category');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (req.body.nameEn) product.nameEn = requiredString(req.body.nameEn, 'Name (EN)');
    if (req.body.nameAr) product.nameAr = requiredString(req.body.nameAr, 'Name (AR)');
    if (req.body.descriptionEn) product.descriptionEn = requiredString(req.body.descriptionEn, 'Description (EN)');
    if (req.body.descriptionAr) product.descriptionAr = requiredString(req.body.descriptionAr, 'Description (AR)');
    if (req.body.category) {
      const exists = await Category.findById(req.body.category);
      if (!exists) return res.status(400).json({ message: 'Invalid category' });
      product.category = req.body.category;
    }
    if (req.body.featuresEn !== undefined) product.featuresEn = parseStringList(req.body.featuresEn);
    if (req.body.featuresAr !== undefined) product.featuresAr = parseStringList(req.body.featuresAr);
    if (req.body.featured !== undefined) {
      product.featured = req.body.featured === 'true' || req.body.featured === true;
    }

    const keep = parseExistingImages(req.body.existingImages);
    const uploaded = await saveUploadedFiles(req.files || []);
    const removed = product.images.filter((image) => !keep.includes(image));
    removed.forEach(deleteStoredImage);
    product.images = [...keep, ...uploaded];

    await product.save();
    const populated = await product.populate('category');
    res.json(populated);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.images.forEach(deleteStoredImage);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
}
