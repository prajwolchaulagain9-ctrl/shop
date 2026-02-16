'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';
import { Suspense } from 'react';

function FailedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reason = searchParams.get('reason');

  const getErrorMessage = () => {
    switch (reason) {
      case 'missing_order_id':
        return 'Order ID is missing.';
      case 'order_not_found':
        return 'Order not found in our system.';
      case 'verification_failed':
        return 'Payment verification failed.';
      case 'payment_cancelled':
        return 'Payment was cancelled.';
      case 'server_error':
        return 'A server error occurred.';
      default:
        return 'An unknown error occurred.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <XCircle className="w-24 h-24 text-red-600 mx-auto" />
        </div>
        <h1 className="text-3xl font-playfair font-bold text-red-900 mb-4">
          Payment Failed
        </h1>
        <p className="text-gray-600 mb-6">
          {getErrorMessage()}
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Please try again or contact support if the problem persists.
        </p>
        <button
          onClick={() => router.push('/checkout')}
          className="w-full bg-red-900 hover:bg-red-800 text-white font-semibold py-3 rounded-lg transition-colors mb-3"
        >
          Try Again
        </button>
        <button
          onClick={() => router.push('/')}
          className="w-full bg-white hover:bg-gray-100 text-red-900 border border-red-900 font-semibold py-3 rounded-lg transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <FailedContent />
    </Suspense>
  );
}
