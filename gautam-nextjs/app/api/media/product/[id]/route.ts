import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Product from '@/lib/models/Product';
import dbConnect from '@/lib/db/connect';
import { requireAdmin } from '@/lib/middleware/auth';
import { createHash } from 'node:crypto';

// Compatibility bridge while embedded originals are migrated to Cloudinary.
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return new NextResponse(null, { status: 404 });
  await dbConnect();
  const product = await Product.findById(id).select('image isAvailable').lean<{ image: string; isAvailable: boolean }>();
  if (!product || (!product.isAvailable && !await requireAdmin(request))) return new NextResponse(null, { status: 404 });
  if(product.image.startsWith('https://res.cloudinary.com/dizmeykd8/'))return NextResponse.redirect(product.image);
  const match = /^data:(image\/(?:jpeg|png|webp|avif));base64,([A-Za-z0-9+/=\s]+)$/.exec(product.image);
  if (!match) return new NextResponse(null, { status: 404 });
  const buffer = Buffer.from(match[2], 'base64');
  const etag = '"' + createHash('sha256').update(buffer).digest('hex').slice(0, 24) + '"';
  if (request.headers.get('if-none-match') === etag) return new NextResponse(null, { status: 304, headers: { ETag: etag } });
  return new NextResponse(buffer, { headers: { 'Content-Type': match[1], ETag: etag, 'Cache-Control': product.isAvailable ? 'public, max-age=300' : 'private, max-age=300', 'X-Content-Type-Options': 'nosniff' } });
}
