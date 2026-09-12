import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDb } from './config/db.js';
import { config } from './config/env.js';
import { Admin } from './models/Admin.js';

function requiredEnvironmentValue(value, variableName) {
  if (
    !value ||
    value.startsWith('change-this') ||
    value.startsWith('use-a-unique-password') ||
    value === 'ChangeMe123!' ||
    value === 'admin@example.com' ||
    value.includes('<')
  ) {
    throw new Error(`${variableName} must be set to a secure value before resetting the admin account.`);
  }
  return value;
}

async function resetAdmin() {
  requiredEnvironmentValue(process.env.MONGODB_URI, 'MONGODB_URI');
  const email = requiredEnvironmentValue(config.adminEmail, 'ADMIN_EMAIL').toLowerCase();
  const password = requiredEnvironmentValue(config.adminPassword, 'ADMIN_PASSWORD');

  if (password.length < 12) {
    throw new Error('ADMIN_PASSWORD must contain at least 12 characters.');
  }

  await connectDb();
  const passwordHash = await bcrypt.hash(password, 12);

  await Admin.findOneAndUpdate(
    { email },
    { $set: { name: 'Showroom Admin', email, passwordHash } },
    { upsert: true, new: true, runValidators: true }
  );

  console.log(`Admin account reset successfully for ${email}.`);
}

resetAdmin()
  .catch((error) => {
    console.error(`Could not reset admin account: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
