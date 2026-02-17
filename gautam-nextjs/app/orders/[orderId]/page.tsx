'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/lib/contexts/ToastContext';
import Image from 'next/image';
import { Package, CheckCircle, Clock, XCircle, ArrowLeft } from 'lucide-react';

interface OrderItem {
  productId: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  transactionId?: string;
  customerDetails: {
    name: string;
    email?: string;
    phone: string;
    address: string;
  };
  createdAt: string;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.order);
      } else {
        showToast('error', 'Order not found');
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      showToast('error', 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'pending':
      case 'processing':
        return <Clock className="w-6 h-6 text-amber-600" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Package className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'processing':
        return 'bg-amber-100 text-amber-800';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return `NPR ${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-red-900 hover:text-red-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-200">
            <div>
              <h1 className="text-3xl font-playfair font-bold text-red-900 mb-2">
                Order Details
              </h1>
              <p className="text-gray-600">Order ID: {order._id}</p>
              <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(order.orderStatus)}
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="mb-6">
            <h2 className="text-xl font-playfair font-bold text-red-900 mb-4">
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{order.customerDetails.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{order.customerDetails.phone}</p>
              </div>
              {order.customerDetails.email && (
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{order.customerDetails.email}</p>
                </div>
              )}
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Delivery Address</p>
                <p className="font-semibold">{order.customerDetails.address}</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mb-6">
            <h2 className="text-xl font-playfair font-bold text-red-900 mb-4">
              Payment Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-semibold uppercase">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Status</p>
                <span className={`inline-block px-2 py-1 rounded text-sm font-semibold ${getStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </div>
              {order.transactionId && (
                <div>
                  <p className="text-sm text-gray-600">Transaction ID</p>
                  <p className="font-semibold">{order.transactionId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h2 className="text-xl font-playfair font-bold text-red-900 mb-4">
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-amber-600 font-semibold">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center text-2xl font-bold text-red-900">
              <span>Total Amount</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
