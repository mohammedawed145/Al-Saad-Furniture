import { Message } from '../models/Message.js';
import { Product } from '../models/Product.js';
import { boundedString, isValidEmail } from '../utils/validate.js';
import { notifyNewMessage } from '../services/notifications.js';

export async function createMessage(req, res, next) {
  try {
    const name = boundedString(req.body.name, 'Name', 100, 1);
    const email = boundedString(req.body.email, 'Email', 254, 3).toLowerCase();
    const phone = boundedString(req.body.phone, 'Phone', 40, 1);
    const message = boundedString(req.body.message, 'Message', 3000, 1);
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    let productName = boundedString(req.body.productName || '', 'Product name', 200);
    let productId = req.body.productId || null;
    if (productId) {
      const product = await Product.findById(productId);
      if (product) {
        productName = product.nameEn;
        productId = product._id;
      } else {
        productId = null;
      }
    }

    const saved = await Message.create({
      name,
      email,
      phone,
      message,
      productId,
      productName,
      status: 'new',
    });
    notifyNewMessage(saved).catch((error) => {
      console.error('Message notification failed:', error.message);
    });
    res.status(201).json({ message: 'Message received', id: saved._id });
  } catch (error) {
    next(error);
  }
}

export async function listMessages(_req, res, next) {
  try {
    const messages = await Message.find().populate('productId').sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
}

export async function updateMessage(req, res, next) {
  try {
    const allowed = ['new', 'read', 'contacted', 'closed'];
    const status = String(req.body.status || '').toLowerCase();
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const item = await Message.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Message not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function deleteMessage(req, res, next) {
  try {
    const item = await Message.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
}
