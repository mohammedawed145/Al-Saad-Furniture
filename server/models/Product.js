import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    nameEn: { type: String, required: true, trim: true },
    nameAr: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    descriptionEn: { type: String, required: true, trim: true },
    descriptionAr: { type: String, required: true, trim: true },
    featuresEn: { type: [String], default: [] },
    featuresAr: { type: [String], default: [] },
    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ nameEn: 'text', nameAr: 'text', descriptionEn: 'text', descriptionAr: 'text' });

export const Product = mongoose.model('Product', productSchema);
