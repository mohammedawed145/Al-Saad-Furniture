import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createMessage, listMessages, updateMessage, deleteMessage } from '../controllers/messageController.js';
import { requireAuth } from '../middleware/auth.js';

const messageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many messages. Please try again later.' },
});

export const messageRouter = Router();
messageRouter.post('/', messageLimiter, createMessage);
messageRouter.get('/', requireAuth, listMessages);
messageRouter.put('/:id', requireAuth, updateMessage);
messageRouter.delete('/:id', requireAuth, deleteMessage);
