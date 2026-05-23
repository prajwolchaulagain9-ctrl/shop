'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { useToast } from '@/lib/contexts/ToastContext';
import { Building2, Copy, CheckCircle } from 'lucide-react';

function BankPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const orderId = searchParams.get('orderId');
  
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');

  const bankDetails = {
    bankName: process.env.NEXT_PUBLIC_BANK_NAME || 'Configure bank name',
    accountName: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || 'Configure account name',
    accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || 'Configure account number',
    branchName: process.env.NEXT_PUBLIC_BANK_BRANCH || 'Configure branch',
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleSubmit = async () => {
    if (!orderId) {
      showToast('error', 'Order ID is missing');
      return;
    }

    if (!transactionId.trim()) {
      showToast('error', 'Please enter your transaction ID');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/payment/verify/bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          transactionId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast('success', 'Payment details submitted successfully! We will verify and process your order shortly.');
        router.push('/');
      } else {
        showToast('error', data.message || 'Failed to submit payment details');
      }
    } catch (error) {
      console.error('Error submitting bank transfer:', error);
      showToast('error', 'Failed to submit payment details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfaf7] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border border-red-950/10 bg-white p-5 shadow-xl sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-10 h-10 text-blue-600" />
            <div>
              <h1 className="font-playfair text-3xl font-bold text-red-950">
                Bank Transfer
              </h1>
              <p className="text-sm text-gray-600">Order ID: {orderId}</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Bank Account Details
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Bank Name</p>
                    <p className="font-semibold text-gray-900">{bankDetails.bankName}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(bankDetails.bankName, 'bankName')}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Copy"
                  >
                    {copied === 'bankName' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Account Name</p>
                    <p className="font-semibold text-gray-900">{bankDetails.accountName}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(bankDetails.accountName, 'accountName')}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Copy"
                  >
                    {copied === 'accountName' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Account Number</p>
                    <p className="font-semibold text-gray-900 text-lg">{bankDetails.accountNumber}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(bankDetails.accountNumber, 'accountNumber')}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Copy"
                  >
                    {copied === 'accountNumber' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Branch</p>
                    <p className="font-semibold text-gray-900">{bankDetails.branchName}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(bankDetails.branchName, 'branchName')}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Copy"
                  >
                    {copied === 'branchName' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h3 className="font-semibold text-amber-900 mb-2">Instructions:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-amber-800">
                <li>Transfer the exact amount to the account above</li>
                <li>Keep your transaction receipt or ID</li>
                <li>Enter your transaction ID below</li>
                <li>We&apos;ll verify and process your order within 24 hours</li>
              </ol>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Transaction ID / Reference Number *
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value.slice(0, 120))}
                className="w-full rounded-lg border border-stone-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-red-950"
                placeholder="Enter your transaction ID"
                autoComplete="off"
              />
              <p className="text-xs text-gray-500 mt-1">
                This is the reference number you received from your bank after making the transfer
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSubmit}
              disabled={loading || !transactionId.trim() || !orderId}
              className="w-full rounded-full bg-[#17653c] py-4 font-bold text-white transition-colors hover:bg-[#124f30] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Payment Details'}
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full rounded-full border border-red-950 bg-white py-3 font-bold text-red-950 transition-colors hover:bg-red-50"
            >
              I&apos;ll Submit Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BankPaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <BankPaymentContent />
    </Suspense>
  );
}
