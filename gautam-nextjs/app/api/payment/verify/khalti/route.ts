import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Order from '@/lib/models/Order';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const pidx = searchParams.get('pidx');
    const txnId = searchParams.get('transaction_id');
    const amount = searchParams.get('amount');
    const status = searchParams.get('status');
    const purchaseOrderId = searchParams.get('purchase_order_id');

    if (!purchaseOrderId) {
      return NextResponse.redirect(new URL('/payment/failed?reason=missing_order_id', req.url));
    }

    const order = await Order.findById(purchaseOrderId);

    if (!order) {
      return NextResponse.redirect(new URL('/payment/failed?reason=order_not_found', req.url));
    }

    if (status === 'Completed' && pidx) {
      // Verify with Khalti server
      const verifyResponse = await fetch('https://khalti.com/api/v2/payment/verify/', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${process.env.KHALTI_SECRET_KEY || 'test_secret_key'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pidx }),
      });

      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();

        if (verifyData.status === 'Completed') {
          order.paymentStatus = 'verified';
          order.transactionId = txnId || pidx;
          order.orderStatus = 'processing';
          await order.save();

          return NextResponse.redirect(new URL(`/payment/success?orderId=${purchaseOrderId}`, req.url));
        }
      }

      // Verification failed
      order.paymentStatus = 'failed';
      await order.save();

      return NextResponse.redirect(new URL('/payment/failed?reason=verification_failed', req.url));
    } else {
      // Payment not completed
      order.paymentStatus = 'failed';
      await order.save();

      return NextResponse.redirect(new URL('/payment/failed?reason=payment_cancelled', req.url));
    }
  } catch (error: unknown) {
    console.error('Error verifying Khalti payment:', error);
    return NextResponse.redirect(
      new URL('/payment/failed?reason=server_error', req.url)
    );
  }
}
