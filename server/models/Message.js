import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
    productName: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: ['new', 'read', 'contacted', 'closed'],
      default: 'new',
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const Message = mongoose.model('Message', messageSchema);
