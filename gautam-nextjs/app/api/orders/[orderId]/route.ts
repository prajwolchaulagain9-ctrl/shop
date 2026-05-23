import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Order from '@/lib/models/Order';
import { requireAdmin, requireAuth } from '@/lib/middleware/auth';
import { cookies } from 'next/headers';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    const [auth, admin] = await Promise.all([
      requireAuth(req),
      requireAdmin(req),
    ]);

    if (!auth && !admin) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    if (!admin) {
      const cookieStore = await cookies();
      const sessionId = cookieStore.get('cart_session_id')?.value;
      const ownsOrder = order.userId
        ? order.userId === auth?.userId
        : Boolean(sessionId && order.sessionId === sessionId);

      if (!ownsOrder) {
        return NextResponse.json(
          { success: false, message: 'Order not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        order: {
          _id: order._id,
          items: order.items,
          totalAmount: order.totalAmount,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          customerDetails: order.customerDetails,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
