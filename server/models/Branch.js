import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema(
  {
    nameEn: { type: String, required: true, trim: true },
    nameAr: { type: String, required: true, trim: true },
    addressEn: { type: String, required: true, trim: true },
    addressAr: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    whatsapp: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true },
    openingHoursEn: { type: String, default: '', trim: true },
    openingHoursAr: { type: String, default: '', trim: true },
    googleMapsUrl: { type: String, default: '', trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const Branch = mongoose.model('Branch', branchSchema);
