import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Order from '@/lib/models/Order';
import { requireAdmin, requireAuth, forbiddenResponse } from '@/lib/middleware/auth';
import { checkRateLimit, getClientIp, RateLimitPresets } from '@/lib/utils/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const ip = getClientIp(req);
    const rateLimitResult = checkRateLimit({
      identifier: `${ip}:${auth.userId}`,
      namespace: 'bank-transfer-submit',
      ...RateLimitPresets.API_GENERAL,
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { success: false, message: `Too many requests. Try again in ${rateLimitResult.resetIn} seconds.` },
        { status: 429 }
      );
    }

    await connectDB();

    const { orderId, transactionId } = await req.json();

    if (!orderId || typeof transactionId !== 'string' || !transactionId.trim()) {
      return NextResponse.json(
        { success: false, message: 'Order ID and transaction ID are required' },
        { status: 400 }
      );
    }

    const normalizedTransactionId = transactionId.trim().slice(0, 120);

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.userId !== auth.userId) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.paymentMethod !== 'bank') {
      return NextResponse.json(
        { success: false, message: 'Invalid payment method for this endpoint' },
        { status: 400 }
      );
    }

    // Update order with transaction details
    // Payment status remains 'pending' until admin verifies
    order.transactionId = normalizedTransactionId;
    order.orderStatus = 'pending'; // Wait for admin verification
    await order.save();

    return NextResponse.json(
      { 
        success: true, 
        message: 'Bank transfer details submitted. We will verify and process your order shortly.',
        order 
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error submitting bank transfer:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit bank transfer details' },
      { status: 500 }
    );
  }
}

// Admin endpoint to verify bank transfer
export async function PUT(req: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await requireAdmin(req);
    if (!admin) {
      return forbiddenResponse('Admin access required to verify payments');
    }
    
    await connectDB();

    const { orderId, verified } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.paymentMethod !== 'bank') {
      return NextResponse.json(
        { success: false, message: 'Invalid payment method for this endpoint' },
        { status: 400 }
      );
    }

    // Update payment status based on admin verification
    order.paymentStatus = verified ? 'verified' : 'failed';
    order.orderStatus = verified ? 'processing' : 'cancelled';
    await order.save();

    return NextResponse.json(
      { 
        success: true, 
        message: `Order ${verified ? 'verified' : 'rejected'} successfully`,
        order 
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error verifying bank transfer:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify bank transfer' },
      { status: 500 }
    );
  }
}
