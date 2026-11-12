import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Product from '@/lib/models/Product';
import { categories, pageParams, catalogProjection } from '@/lib/catalog/query';

export async function GET(request: Request) {
  try {
    const { params, page, limit } = pageParams(request);
    const category = params.get('category');
    if (category && !categories.includes(category)) return NextResponse.json({ success: false, message: 'Unknown collection.' }, { status: 400 });
    await dbConnect();
    const filter: Record<string, unknown> = { isAvailable: true };
    if (category) filter.category = category;
    const subCategory = params.get('subCategory');
    if (subCategory) filter.subCategory = subCategory.slice(0, 60);
    const search = params.get('search')?.trim().slice(0, 100);
    if (search) filter.name = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    const [products, totalCount] = await Promise.all([
      Product.aggregate([{ $match: filter }, { $sort: { createdAt: -1, _id: -1 } }, { $skip: (page - 1) * limit }, { $limit: limit }, { $project: catalogProjection() }]),
      Product.countDocuments(filter),
    ]);
    return NextResponse.json({ success: true, products, page, totalCount, totalPages: Math.ceil(totalCount / limit) }, { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=15, stale-while-revalidate=30' } });
  } catch {
    return NextResponse.json(
      { success: false, message: 'The collection is temporarily unavailable. Please try again.' },
      { status: 503 }
    );
  }
}
