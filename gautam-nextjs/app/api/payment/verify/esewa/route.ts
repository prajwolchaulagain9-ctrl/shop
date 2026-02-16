import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Order from '@/lib/models/Order';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('q'); // su = success, fu = failure
    const orderId = searchParams.get('oid');
    const refId = searchParams.get('refId');

    if (!orderId) {
      return NextResponse.redirect(new URL('/payment/failed?reason=missing_order_id', req.url));
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.redirect(new URL('/payment/failed?reason=order_not_found', req.url));
    }

    if (status === 'su' && refId) {
      // Success - Verify with eSewa server
      const verifyUrl = 'https://uat.esewa.com.np/epay/transrec';
      const verifyParams = new URLSearchParams({
        amt: order.totalAmount.toString(),
        rid: refId,
        pid: orderId,
        scd: process.env.ESEWA_MERCHANT_CODE || 'EPAYTEST',
      });

      const verifyResponse = await fetch(`${verifyUrl}?${verifyParams.toString()}`);
      const verifyText = await verifyResponse.text();

      // eSewa returns XML with success/failure message
      if (verifyText.includes('Success')) {
        order.paymentStatus = 'verified';
        order.transactionId = refId;
        order.orderStatus = 'processing';
        await order.save();

        return NextResponse.redirect(new URL(`/payment/success?orderId=${orderId}`, req.url));
      } else {
        order.paymentStatus = 'failed';
        await order.save();

        return NextResponse.redirect(new URL('/payment/failed?reason=verification_failed', req.url));
      }
    } else {
      // Failure
      order.paymentStatus = 'failed';
      await order.save();

      return NextResponse.redirect(new URL('/payment/failed?reason=payment_cancelled', req.url));
    }
  } catch (error: unknown) {
    console.error('Error verifying eSewa payment:', error);
    return NextResponse.redirect(
      new URL('/payment/failed?reason=server_error', req.url)
    );
  }
}
