import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Order from '@/lib/models/Order';
import { requireAdmin, forbiddenResponse } from '@/lib/middleware/auth';

export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await requireAdmin(req);
    if (!admin) {
      return forbiddenResponse();
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const filter: any = {};
    if (status) {
      filter.orderStatus = status;
    }

    const skip = (page - 1) * limit;
    const orders = await Order.find(filter)
      .sort({ [sortBy]: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Order.countDocuments(filter);

    return NextResponse.json({
      orders,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error('Orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await requireAdmin(req);
    if (!admin) {
      return forbiddenResponse();
    }

    await dbConnect();

    const { orderId, orderStatus, paymentStatus } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
