import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/env.js';
import { deleteLocalImage, toPublicPath, usesCloudinary } from '../middleware/upload.js';

if (usesCloudinary) {
  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  });
}

export function saveUploadedFile(file) {
  if (!usesCloudinary) return Promise.resolve(toPublicPath(file.filename));

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'al-saad-furniture', resource_type: 'image' },
      (error, result) => (error ? reject(error) : resolve(result.secure_url))
    );
    stream.end(file.buffer);
  });
}

export async function saveUploadedFiles(files = []) {
  return Promise.all(files.map(saveUploadedFile));
}

export function deleteStoredImage(imagePath) {
  if (!imagePath?.includes('res.cloudinary.com')) {
    deleteLocalImage(imagePath);
    return;
  }

  const match = imagePath.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
  if (match && usesCloudinary) {
    cloudinary.uploader.destroy(match[1], { resource_type: 'image' }).catch((error) => {
      console.error('Cloudinary image deletion failed:', error.message);
    });
  }
}
