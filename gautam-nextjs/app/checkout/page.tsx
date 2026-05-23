'use client';

import { useCart } from '@/lib/contexts/CartContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useToast } from '@/lib/contexts/ToastContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Wallet, Building2, DollarSign, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import LocationPicker from '@/components/LocationPicker';
import 'leaflet/dist/leaflet.css';

interface Location {
  lat: number;
  lng: number;
  formattedAddress?: string;
}

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  location?: Location;
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState<'cod' | 'esewa' | 'khalti' | 'bank' | null>(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    email: '',
    phone: '',
    address: '',
    location: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      showToast('warning', 'Please login to proceed with checkout');
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router, showToast]);

  // Pre-fill customer details from user profile if available
  useEffect(() => {
    if (user) {
      setCustomerDetails(prev => ({
        ...prev,
        name: prev.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (cart.length === 0 && !orderSuccess) {
      router.push('/');
    }
  }, [cart, router, orderSuccess]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const numericPrice = parseInt(item.price.replace(/[^\d]/g, '')) || 0;
      return total + numericPrice * item.quantity;
    }, 0);
  };

  const formatPrice = (price: number) => {
    return `NPR ${price.toLocaleString()}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomerDetails({
      ...customerDetails,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!customerDetails.name.trim()) {
      showToast('error', 'Please enter your name');
      return false;
    }
    if (!customerDetails.phone.trim()) {
      showToast('error', 'Please enter your phone number');
      return false;
    }
    if (!customerDetails.address.trim()) {
      showToast('error', 'Please enter your delivery address');
      return false;
    }
    if (!selectedPayment) {
      showToast('error', 'Please select a payment method');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (selectedPayment === 'cod') {
        // Direct order for Cash on Delivery
        const response = await fetch('/api/orders/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cart,
            totalAmount: calculateTotal(),
            paymentMethod: 'cod',
            customerDetails,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setOrderId(data.order._id);
          setOrderSuccess(true);
          clearCart();
        } else {
          showToast('error', data.message || 'Failed to place order');
        }
      } else {
        // Online payment - create payment order
        const response = await fetch('/api/payment/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cart,
            totalAmount: calculateTotal(),
            paymentMethod: selectedPayment,
            customerDetails,
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Redirect to payment gateway
          if (data.paymentUrl) {
            window.location.href = data.paymentUrl;
          } else {
            showToast('error', 'Payment gateway URL not available');
          }
        } else {
          showToast('error', data.message || 'Failed to initiate payment');
        }
      }
    } catch (error) {
      console.error('Error placing order:', error);
      showToast('error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: DollarSign,
      description: 'Pay when you receive the product',
      iconClassName: 'text-green-700 bg-green-50',
    },
    {
      id: 'esewa',
      name: 'eSewa',
      icon: Wallet,
      description: 'Pay with eSewa wallet',
      iconClassName: 'text-green-700 bg-green-50',
    },
    {
      id: 'khalti',
      name: 'Khalti',
      icon: Wallet,
      description: 'Pay with Khalti wallet',
      iconClassName: 'text-purple-700 bg-purple-50',
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: Building2,
      description: 'Pay via online banking',
      iconClassName: 'text-blue-700 bg-blue-50',
    },
  ];

  if (orderSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfaf7] p-4">
        <div className="w-full max-w-md rounded-lg border border-red-950/10 bg-white p-8 text-center shadow-xl">
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto" />
          </div>
          <h1 className="mb-4 font-playfair text-3xl font-bold text-red-950">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-2">
            Your order ID: <span className="font-semibold">{orderId}</span>
          </p>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We&apos;ll process it shortly.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full rounded-full bg-red-950 py-3 font-bold text-white transition-colors hover:bg-red-900"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfaf7] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 rounded-full text-red-950 hover:text-red-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>
          <h1 className="font-playfair text-4xl font-bold text-red-950">Checkout</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-stone-600">
            <ShieldCheck className="h-4 w-4 text-green-700" aria-hidden="true" />
            Totals are verified on the server before the order is created.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Details */}
            <div className="rounded-lg border border-red-950/10 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-4 font-playfair text-2xl font-bold text-red-950">
                Delivery Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customerDetails.name}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-stone-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-red-950"
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerDetails.email}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-stone-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-red-950"
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerDetails.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-stone-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-red-950"
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    name="address"
                    value={customerDetails.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="mb-4 w-full rounded-lg border border-stone-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-red-950"
                    placeholder="Enter your complete delivery address (house/flat no, street, landmark)"
                    autoComplete="street-address"
                  />
                  
                  {/* Location Picker */}
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Location on Map
                    </label>
                    <LocationPicker
                      location={customerDetails.location || null}
                      onLocationChange={(location: Location) => {
                        setCustomerDetails({
                          ...customerDetails,
                          location,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="rounded-lg border border-red-950/10 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-4 font-playfair text-2xl font-bold text-red-950">
                Payment Method
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id as 'cod' | 'esewa' | 'khalti' | 'bank')}
                      className={`rounded-lg border-2 p-4 text-left transition-all ${
                        selectedPayment === method.id
                          ? 'border-red-950 bg-red-50 shadow-sm'
                          : 'border-stone-200 hover:border-red-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${method.iconClassName}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">{method.name}</h3>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg border border-red-950/10 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-4 font-playfair text-2xl font-bold text-red-950">
                Order Summary
              </h2>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {item.price} x {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 text-xl font-bold text-red-950">
                  <span>Total</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || !selectedPayment}
                className="mt-6 w-full rounded-full bg-[#17653c] py-4 font-bold text-white transition-colors hover:bg-[#124f30] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
