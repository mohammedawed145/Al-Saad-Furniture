import { Branch } from '../models/Branch.js';
import { requiredString } from '../utils/validate.js';

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
    const branch = await Branch.create({
      nameEn: requiredString(req.body.nameEn, 'Name (EN)'),
      nameAr: requiredString(req.body.nameAr, 'Name (AR)'),
      addressEn: requiredString(req.body.addressEn, 'Address (EN)'),
      addressAr: requiredString(req.body.addressAr, 'Address (AR)'),
      phone: requiredString(req.body.phone, 'Phone'),
      whatsapp: req.body.whatsapp || '',
      email: req.body.email || '',
      openingHoursEn: req.body.openingHoursEn || '',
      openingHoursAr: req.body.openingHoursAr || '',
      googleMapsUrl: req.body.googleMapsUrl || '',
    });
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
    fields.forEach((field) => {
      if (req.body[field] !== undefined) branch[field] = req.body[field];
    });
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
