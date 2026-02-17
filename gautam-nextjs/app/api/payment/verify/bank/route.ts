import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Order from '@/lib/models/Order';
import { requireAdmin, forbiddenResponse, unauthorizedResponse } from '@/lib/middleware/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { orderId, transactionId, receiptImage } = await req.json();

    if (!orderId || !transactionId) {
      return NextResponse.json(
        { success: false, message: 'Order ID and transaction ID are required' },
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

    // Update order with transaction details
    // Payment status remains 'pending' until admin verifies
    order.transactionId = transactionId;
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
