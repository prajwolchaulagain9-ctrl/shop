import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
dotenv.config({ path: '.env.local', quiet: true });
cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET, secure: true });
try {
  await cloudinary.api.ping();
  console.log('Cloudinary authentication verified.');
} catch (error) {
  const detail = error.error || error;
  console.log(JSON.stringify({ cloudinaryVerified: false, status: detail.http_code || detail.statusCode || null, reason: String(detail.message || 'Authentication failed').replaceAll(process.env.CLOUDINARY_API_KEY || '__missing__', '[redacted]').replaceAll(process.env.CLOUDINARY_API_SECRET || '__missing__', '[redacted]') }));
  process.exitCode = 1;
}
