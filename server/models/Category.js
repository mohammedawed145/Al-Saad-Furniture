import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    nameEn: { type: String, required: true, trim: true },
    nameAr: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const Category = mongoose.model('Category', categorySchema);
