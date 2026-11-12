import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Product from '@/lib/models/Product';
import { requireAdmin, forbiddenResponse } from '@/lib/middleware/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return forbiddenResponse();

    const { id } = await params;

    await dbConnect();
    
    const data = await request.json();
    if (data.image !== undefined && (typeof data.image !== 'string' || !data.image.startsWith('https://res.cloudinary.com/dizmeykd8/'))) {
      return NextResponse.json({ success: false, message: 'Please upload the replacement image to Cloudinary.' }, { status: 400 });
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: unknown) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, message: (error instanceof Error ? error.message : '') || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return forbiddenResponse();

    const { id } = await params;

    await dbConnect();
    
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error: unknown) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, message: (error instanceof Error ? error.message : '') || 'Internal server error' },
      { status: 500 }
    );
  }
}
