'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-24 h-24 text-green-600 mx-auto" />
        </div>
        <h1 className="text-3xl font-playfair font-bold text-red-900 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-2">
          Your order has been placed successfully.
        </p>
        {orderId && (
          <p className="text-gray-600 mb-6">
            Order ID: <span className="font-semibold">{orderId}</span>
          </p>
        )}
        <p className="text-sm text-gray-500 mb-6">
          Thank you for your purchase. We'll start processing your order right away.
        </p>
        <button
          onClick={() => router.push('/')}
          className="w-full bg-red-900 hover:bg-red-800 text-white font-semibold py-3 rounded-lg transition-colors mb-3"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => router.push(`/orders/${orderId}`)}
          className="w-full bg-white hover:bg-gray-100 text-red-900 border border-red-900 font-semibold py-3 rounded-lg transition-colors"
        >
          View Order Details
        </button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
