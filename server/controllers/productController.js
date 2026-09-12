import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { deleteStoredImage, saveUploadedFiles } from '../services/media.js';
import { boundedString, escapeRegex, parseStringList } from '../utils/validate.js';

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

const LEGACY_PRODUCT_IMAGES = {
  'test sofa': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80',
  'comfort seating sofa': 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1600&q=80',
  'classic antique chair': 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1600&q=80',
  'wooden dining table': 'https://images.unsplash.com/photo-1617806118233-18e1de3d13c1?auto=format&fit=crop&w=1600&q=80',
};

// The production database may contain products created by an older version of
// the catalogue. Keep those records visible while the showroom replaces them
// through the admin area, rather than returning incomplete cards to visitors.
function presentProduct(product) {
  const item = typeof product.toObject === 'function' ? product.toObject() : product;
  const isLegacy = !item.nameEn && Boolean(item.name);
  let images = Array.isArray(item.images) && item.images.length
    ? item.images
    : item.image
      ? [item.image]
      : [];
  if (images.length && images.every((image) => String(image).startsWith('/images/'))) {
    images = [LEGACY_PRODUCT_IMAGES[String(item.name).toLowerCase()] || LEGACY_PRODUCT_IMAGES['test sofa']];
  }

  return {
    ...item,
    nameEn: item.nameEn || item.name || 'Furniture piece',
    nameAr: item.nameAr || item.name || 'قطعة أثاث',
    descriptionEn: item.descriptionEn || item.description || '',
    descriptionAr: item.descriptionAr || item.description || '',
    featuresEn: item.featuresEn || [],
    featuresAr: item.featuresAr || [],
    images,
    featured: Boolean(item.featured) || isLegacy,
  };
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
    const presented = products.map(presentProduct);
    res.json(featured === 'true' ? presented.filter((product) => product.featured) : presented);
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(presentProduct(product));
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const nameEn = boundedString(req.body.nameEn, 'Name (EN)', 160, 1);
    const nameAr = boundedString(req.body.nameAr, 'Name (AR)', 160, 1);
    const category = boundedString(req.body.category, 'Category', 100, 1);
    const descriptionEn = boundedString(req.body.descriptionEn, 'Description (EN)', 5000, 1);
    const descriptionAr = boundedString(req.body.descriptionAr, 'Description (AR)', 5000, 1);
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

    if (req.body.nameEn !== undefined) product.nameEn = boundedString(req.body.nameEn, 'Name (EN)', 160, 1);
    if (req.body.nameAr !== undefined) product.nameAr = boundedString(req.body.nameAr, 'Name (AR)', 160, 1);
    if (req.body.descriptionEn !== undefined) product.descriptionEn = boundedString(req.body.descriptionEn, 'Description (EN)', 5000, 1);
    if (req.body.descriptionAr !== undefined) product.descriptionAr = boundedString(req.body.descriptionAr, 'Description (AR)', 5000, 1);
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
