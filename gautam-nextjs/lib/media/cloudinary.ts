import 'server-only';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

export function configuredCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloudName || !apiKey || !apiSecret) throw new Error('Cloudinary is not configured. Add the server environment variables.');
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
  return cloudinary;
}

export async function uploadProductImage(buffer: Buffer) {
  const client = configuredCloudinary();
  return new Promise<UploadApiResponse>((resolve, reject) => {
    client.uploader.upload_stream({ folder: 'gautam/products', resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
      transformation: [{ width: 1800, height: 1800, crop: 'limit' }],
    }, (error, result) => error || !result ? reject(error || new Error('No upload result')) : resolve(result)).end(buffer);
  });
}
