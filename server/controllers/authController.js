import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { config } from '../config/env.js';
import { isValidEmail, requiredString } from '../utils/validate.js';

export async function login(req, res, next) {
  try {
    const email = requiredString(req.body.email, 'Email').toLowerCase();
    const password = requiredString(req.body.password, 'Password');
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: admin._id },
      config.jwtSecret,
      { expiresIn: '12h', issuer: 'al-saad-api', audience: 'al-saad-admin' }
    );
    res.json({ token, admin: admin.toSafeJSON() });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  res.json({ admin: req.admin.toSafeJSON() });
}
