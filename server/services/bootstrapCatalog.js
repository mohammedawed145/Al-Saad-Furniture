import { Branch } from '../models/Branch.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { config } from '../config/env.js';

const DEFAULT_CATEGORIES = [
  { slug: 'antiques', nameEn: 'Antiques', nameAr: 'التحف' },
  { slug: 'bedroom', nameEn: 'Bedroom', nameAr: 'غرف النوم' },
  { slug: 'chairs', nameEn: 'Chairs', nameAr: 'الكراسي' },
  { slug: 'dining-room', nameEn: 'Dining room', nameAr: 'غرف الطعام' },
  { slug: 'salon', nameEn: 'Salon', nameAr: 'الصالون' },
  { slug: 'seating-room', nameEn: 'Seating room', nameAr: 'غرف الجلوس' },
];

function legacyCategory(name = '') {
  const value = name.toLowerCase();
  if (value.includes('dining')) return 'dining-room';
  if (value.includes('chair')) return 'chairs';
  if (value.includes('antique')) return 'antiques';
  if (value.includes('seating') || value.includes('corner')) return 'seating-room';
  return 'salon';
}

// One-time, non-destructive setup for deployments that started with the old
// catalogue format. Real showroom data can subsequently be edited in Admin.
export async function bootstrapCatalog() {
  const [categoryCount, branchCount] = await Promise.all([
    Category.countDocuments(),
    Branch.countDocuments(),
  ]);

  let categories = [];
  if (categoryCount === 0) {
    try {
      categories = await Category.insertMany(DEFAULT_CATEGORIES);
    } catch (error) {
      if (error.code !== 11000) throw error;
      categories = await Category.find().select('_id slug');
    }
  } else {
    categories = await Category.find().select('_id slug');
  }

  if (branchCount === 0) {
    try {
      await Branch.create({
        nameEn: 'Al-Saad Furniture — Main Branch',
        nameAr: 'معرض السعد للأثاث — الفرع الرئيسي',
        addressEn: 'Al-Adlia, Damietta, Egypt',
        addressAr: 'العدلية، دمياط، مصر',
        phone: config.sitePhone,
        whatsapp: config.siteWhatsapp,
        email: config.siteEmail,
        openingHoursEn: 'Open 24 hours',
        openingHoursAr: 'مفتوح على مدار 24 ساعة',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Al-Adlia%2C%20Damietta%2C%20Egypt',
      });
    } catch (error) {
      if (error.code !== 11000) throw error;
    }
  }

  const bySlug = new Map(categories.map((category) => [category.slug, category._id]));
  const legacyProducts = await Product.collection
    .find({ $or: [{ category: { $exists: false } }, { category: null }] })
    .toArray();

  if (legacyProducts.length) {
    await Product.collection.bulkWrite(
      legacyProducts.map((product) => ({
        updateOne: {
          filter: { _id: product._id },
          update: { $set: { category: bySlug.get(legacyCategory(product.name)) } },
        },
      }))
    );
  }
}
