import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Product from '@/lib/models/Product';
import { requireAdmin, forbiddenResponse } from '@/lib/middleware/auth';
import { categories, pageParams, catalogProjection } from '@/lib/catalog/query';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return forbiddenResponse();
    const { params, page, limit } = pageParams(request, 12);
    const filter: Record<string, unknown> = {};
    const category = params.get('category');
    if (category && categories.includes(category)) filter.category = category;
    const search = params.get('search')?.trim().slice(0, 100);
    if (search) filter.name = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    await dbConnect();
    const [products, totalCount] = await Promise.all([
      Product.aggregate([{ $match: filter }, { $sort: { createdAt: -1, _id: -1 } }, { $skip: (page-1)*limit }, { $limit: limit }, { $project: catalogProjection() }]),
      Product.countDocuments(filter),
    ]);
    return NextResponse.json({ success: true, products, totalCount, page, totalPages: Math.ceil(totalCount / limit) }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error: unknown) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: (error instanceof Error ? error.message : '') || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return forbiddenResponse();

    await dbConnect();

    
    const data = await request.json();
    if (typeof data.image !== 'string' || !data.image.startsWith('https://res.cloudinary.com/dizmeykd8/')) {
      return NextResponse.json({ success: false, message: 'Please upload the product image to Cloudinary first.' }, { status: 400 });
    }
    const newProduct = await Product.create(data);
    
    return NextResponse.json(
      { success: true, product: newProduct },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: (error instanceof Error ? error.message : '') || 'Internal server error' },
      { status: 500 }
    );
  }
}
