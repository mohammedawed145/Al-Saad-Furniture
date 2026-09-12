export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

export function requiredString(value, field, min = 1) {
  const text = String(value ?? '').trim();
  if (text.length < min) {
    const error = new Error(`${field} is required`);
    error.status = 400;
    throw error;
  }
  return text;
}

export function boundedString(value, field, max, min = 0) {
  const text = String(value ?? '').trim();
  if (text.length < min) {
    const error = new Error(`${field} is required`);
    error.status = 400;
    throw error;
  }
  if (text.length > max) {
    const error = new Error(`${field} must be ${max} characters or fewer`);
    error.status = 400;
    throw error;
  }
  return text;
}

export function isValidHttpsUrl(value) {
  if (!value) return true;
  try {
    return new URL(String(value).trim()).protocol === 'https:';
  } catch {
    return false;
  }
}

export function parseStringList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
