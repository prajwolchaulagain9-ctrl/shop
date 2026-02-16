import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Order from '@/lib/models/Order';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

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

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid total amount' },
        { status: 400 }
      );
    }

    if (!['esewa', 'khalti', 'bank'].includes(paymentMethod)) {
      return NextResponse.json(
        { success: false, message: 'Invalid payment method for online payment' },
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

    // Create order with pending payment
    const order = new Order({
      sessionId,
      items,
      totalAmount,
      paymentMethod,
      paymentStatus: 'pending',
      customerDetails,
      orderStatus: 'pending',
    });

    await order.save();

    // Generate payment URL based on payment method
    let paymentUrl = '';
    const orderId = order._id.toString();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    if (paymentMethod === 'esewa') {
      // eSewa Integration
      const esewaConfig = {
        amt: totalAmount,
        psc: 0,
        pdc: 0,
        txAmt: 0,
        tAmt: totalAmount,
        pid: orderId,
        scd: process.env.ESEWA_MERCHANT_CODE || 'EPAYTEST',
        su: `${baseUrl}/api/payment/verify/esewa?q=su&oid=${orderId}`,
        fu: `${baseUrl}/api/payment/verify/esewa?q=fu&oid=${orderId}`,
      };

      const params = new URLSearchParams(esewaConfig as any).toString();
      paymentUrl = `https://uat.esewa.com.np/epay/main?${params}`;
      
    } else if (paymentMethod === 'khalti') {
      // Khalti Integration
      // Note: Khalti requires server-side API call first to get payment URL
      const khaltiResponse = await fetch('https://khalti.com/api/v2/payment/initiate/', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${process.env.KHALTI_SECRET_KEY || 'test_secret_key'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          return_url: `${baseUrl}/api/payment/verify/khalti`,
          website_url: baseUrl,
          amount: totalAmount * 100, // Amount in paisa
          purchase_order_id: orderId,
          purchase_order_name: 'Order Payment',
          customer_info: {
            name: customerDetails.name,
            email: customerDetails.email || 'customer@example.com',
            phone: customerDetails.phone,
          },
        }),
      });

      if (khaltiResponse.ok) {
        const khaltiData = await khaltiResponse.json();
        paymentUrl = khaltiData.payment_url;
      } else {
        throw new Error('Failed to initiate Khalti payment');
      }
      
    } else if (paymentMethod === 'bank') {
      // Bank Transfer - Show instructions page
      paymentUrl = `${baseUrl}/payment/bank?orderId=${orderId}`;
    }

    const response = NextResponse.json(
      { 
        success: true, 
        order,
        paymentUrl,
        message: 'Payment initiated successfully' 
      },
      { status: 200 }
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
    console.error('Error initiating payment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
