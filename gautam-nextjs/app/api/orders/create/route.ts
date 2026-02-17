import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Order from '@/lib/models/Order';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { calculateOrderTotal } from '@/lib/utils/pricing';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { items, totalAmount, paymentMethod, customerDetails } = await req.json();

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No items in order' },
        { status: 400 }
      );
    }

    // Calculate total server-side from actual product prices
    const calculation = calculateOrderTotal(items);
    
    if (!calculation.success) {
      return NextResponse.json(
        { success: false, message: calculation.error || 'Failed to calculate order total' },
        { status: 400 }
      );
    }
    
    // Verify client-sent total matches server calculation
    const serverTotal = calculation.total;
    const clientTotal = typeof totalAmount === 'number' ? totalAmount : 0;
    
    // Allow small rounding differences (1 NPR) but reject manipulated totals
    if (Math.abs(serverTotal - clientTotal) > 1) {
      console.warn('Price manipulation attempt detected:', {
        clientTotal,
        serverTotal,
        items: calculation.breakdown,
      });
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Order total mismatch. Please refresh and try again.',
          expectedTotal: serverTotal,
        },
        { status: 400 }
      );
    }
    
    // Use server-calculated total
    const validatedTotal = serverTotal;

    if (!paymentMethod) {
      return NextResponse.json(
        { success: false, message: 'Payment method is required' },
        { status: 400 }
      );
    }

    if (!customerDetails?.name || !customerDetails?.phone || !customerDetails?.address) {
      return NextResponse.json(
        { success: false, message: 'Customer details are incomplete' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    let sessionId = cookieStore.get('cart_session_id')?.value;

    if (!sessionId) {
      sessionId = uuidv4();
    }

    // Create order
    const order = new Order({
      sessionId,
      items,
      totalAmount: validatedTotal, // Use server-calculated total
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'verified' : 'pending',
      customerDetails,
      orderStatus: 'pending',
    });

    await order.save();

    const response = NextResponse.json(
      { 
        success: true, 
        order,
        message: `Order placed successfully with ${paymentMethod.toUpperCase()}` 
      },
      { status: 201 }
    );

    // Set session cookie if new
    if (!cookieStore.get('cart_session_id')?.value) {
      response.cookies.set('cart_session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    return response;
  } catch (error: unknown) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create order' },
      { status: 500 }
    );
  }
}
