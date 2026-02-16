'use client';

import { useCart } from '@/lib/contexts/CartContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CreditCard, Wallet, Building2, DollarSign, ArrowLeft, CheckCircle } from 'lucide-react';
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
      alert('Please login to proceed with checkout');
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

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
      alert('Please enter your name');
      return false;
    }
    if (!customerDetails.phone.trim()) {
      alert('Please enter your phone number');
      return false;
    }
    if (!customerDetails.address.trim()) {
      alert('Please enter your delivery address');
      return false;
    }
    if (!selectedPayment) {
      alert('Please select a payment method');
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
          alert(data.message || 'Failed to place order');
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
            alert('Payment gateway URL not available');
          }
        } else {
          alert(data.message || 'Failed to initiate payment');
        }
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
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
      color: 'green',
    },
    {
      id: 'esewa',
      name: 'eSewa',
      icon: Wallet,
      description: 'Pay with eSewa wallet',
      color: 'green',
    },
    {
      id: 'khalti',
      name: 'Khalti',
      icon: Wallet,
      description: 'Pay with Khalti wallet',
      color: 'purple',
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: Building2,
      description: 'Pay via online banking',
      color: 'blue',
    },
  ];

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto" />
          </div>
          <h1 className="text-3xl font-playfair font-bold text-red-900 mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-2">
            Your order ID: <span className="font-semibold">{orderId}</span>
          </p>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We'll process it shortly.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-red-900 hover:bg-red-800 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-red-900 hover:text-red-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>
          <h1 className="text-4xl font-playfair font-bold text-red-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-playfair font-bold text-red-900 mb-4">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                    placeholder="Enter your full name"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                    placeholder="Enter your email"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                    placeholder="Enter your phone number"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent mb-4"
                    placeholder="Enter your complete delivery address (house/flat no, street, landmark)"
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
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-playfair font-bold text-red-900 mb-4">
                Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id as any)}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        selectedPayment === method.id
                          ? 'border-red-900 bg-red-50'
                          : 'border-gray-300 hover:border-red-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-6 h-6 flex-shrink-0 text-${method.color}-600`} />
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
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-2xl font-playfair font-bold text-red-900 mb-4">
                Order Summary
              </h2>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
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
                <div className="flex justify-between text-xl font-bold text-red-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || !selectedPayment}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
