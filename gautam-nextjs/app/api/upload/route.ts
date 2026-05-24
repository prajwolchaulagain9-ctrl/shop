import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, forbiddenResponse } from '@/lib/middleware/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return forbiddenResponse();

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, '-')}`;
    
    let imageUrl = '';
    try {
      // Ensure upload directory exists
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {
        // Ignore if exists
      }

      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      imageUrl = `/uploads/${filename}`;
    } catch (writeError: any) {
      console.warn('Local filesystem write failed, falling back to base64 data URL:', writeError);
      const base64 = buffer.toString('base64');
      imageUrl = `data:${file.type || 'image/jpeg'};base64,${base64}`;
    }

    return NextResponse.json({ success: true, url: imageUrl });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
