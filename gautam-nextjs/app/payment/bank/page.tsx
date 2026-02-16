'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { Building2, Copy, CheckCircle } from 'lucide-react';

function BankPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');

  const bankDetails = {
    bankName: 'Your Bank Name',
    accountName: 'Your Store Name',
    accountNumber: '1234567890',
    branchName: 'Main Branch',
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleSubmit = async () => {
    if (!transactionId.trim()) {
      alert('Please enter your transaction ID');
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
        alert('Thank you! Your payment details have been submitted. We will verify and process your order shortly.');
        router.push('/');
      } else {
        alert(data.message || 'Failed to submit payment details');
      }
    } catch (error) {
      console.error('Error submitting bank transfer:', error);
      alert('Failed to submit payment details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-10 h-10 text-blue-600" />
            <div>
              <h1 className="text-3xl font-playfair font-bold text-red-900">
                Bank Transfer
              </h1>
              <p className="text-sm text-gray-600">Order ID: {orderId}</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Bank Account Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
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
                <div className="flex justify-between items-center">
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
                <div className="flex justify-between items-center">
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
                <div className="flex justify-between items-center">
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

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-amber-900 mb-2">Instructions:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-amber-800">
                <li>Transfer the exact amount to the account above</li>
                <li>Keep your transaction receipt or ID</li>
                <li>Enter your transaction ID below</li>
                <li>We'll verify and process your order within 24 hours</li>
              </ol>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Transaction ID / Reference Number *
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                placeholder="Enter your transaction ID"
              />
              <p className="text-xs text-gray-500 mt-1">
                This is the reference number you received from your bank after making the transfer
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSubmit}
              disabled={loading || !transactionId.trim()}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Payment Details'}
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-white hover:bg-gray-100 text-red-900 border border-red-900 font-semibold py-3 rounded-lg transition-colors"
            >
              I'll Submit Later
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
