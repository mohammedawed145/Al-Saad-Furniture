import { Branch } from '../models/Branch.js';
import { boundedString, isValidEmail, isValidHttpsUrl } from '../utils/validate.js';

export async function listBranches(_req, res, next) {
  try {
    const branches = await Branch.find().sort({ createdAt: 1 });
    res.json(branches);
  } catch (error) {
    next(error);
  }
}

export async function createBranch(req, res, next) {
  try {
    const data = {
      nameEn: boundedString(req.body.nameEn, 'Name (EN)', 120, 1),
      nameAr: boundedString(req.body.nameAr, 'Name (AR)', 120, 1),
      addressEn: boundedString(req.body.addressEn, 'Address (EN)', 300, 1),
      addressAr: boundedString(req.body.addressAr, 'Address (AR)', 300, 1),
      phone: boundedString(req.body.phone, 'Phone', 40, 1),
      whatsapp: boundedString(req.body.whatsapp || '', 'WhatsApp', 40),
      email: boundedString(req.body.email || '', 'Email', 254),
      openingHoursEn: boundedString(req.body.openingHoursEn || '', 'Opening hours (EN)', 300),
      openingHoursAr: boundedString(req.body.openingHoursAr || '', 'Opening hours (AR)', 300),
      googleMapsUrl: boundedString(req.body.googleMapsUrl || '', 'Google Maps URL', 1000),
    };
    if (data.email && !isValidEmail(data.email)) return res.status(400).json({ message: 'Invalid email address' });
    if (!isValidHttpsUrl(data.googleMapsUrl)) return res.status(400).json({ message: 'Google Maps URL must use HTTPS' });
    const branch = await Branch.create(data);
    res.status(201).json(branch);
  } catch (error) {
    next(error);
  }
}

export async function updateBranch(req, res, next) {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    const fields = [
      'nameEn',
      'nameAr',
      'addressEn',
      'addressAr',
      'phone',
      'whatsapp',
      'email',
      'openingHoursEn',
      'openingHoursAr',
      'googleMapsUrl',
    ];
    const limits = { nameEn: 120, nameAr: 120, addressEn: 300, addressAr: 300, phone: 40, whatsapp: 40, email: 254, openingHoursEn: 300, openingHoursAr: 300, googleMapsUrl: 1000 };
    fields.forEach((field) => {
      if (req.body[field] !== undefined) branch[field] = boundedString(req.body[field], field, limits[field]);
    });
    if (branch.email && !isValidEmail(branch.email)) return res.status(400).json({ message: 'Invalid email address' });
    if (!isValidHttpsUrl(branch.googleMapsUrl)) return res.status(400).json({ message: 'Google Maps URL must use HTTPS' });
    await branch.save();
    res.json(branch);
  } catch (error) {
    next(error);
  }
}

export async function deleteBranch(req, res, next) {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    res.json({ message: 'Branch deleted' });
  } catch (error) {
    next(error);
  }
}
