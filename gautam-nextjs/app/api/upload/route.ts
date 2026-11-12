import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, forbiddenResponse } from '@/lib/middleware/auth';
import { uploadProductImage } from '@/lib/media/cloudinary';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return forbiddenResponse();

    const data = await request.formData();
    const file = data.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) {
      return NextResponse.json({ success: false, message: 'Please choose a JPEG, PNG, WebP or AVIF image.' }, { status: 400 });
    }
    if (!file.size || file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: 'Choose an image smaller than 10 MB.' }, { status: 400 });
    }
    const uploaded = await uploadProductImage(Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ success: true, url: uploaded.secure_url, publicId: uploaded.public_id, width: uploaded.width, height: uploaded.height });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Image upload could not finish. Check the Cloudinary configuration and try again.' },
      { status: 502 }
    );
  }
}
