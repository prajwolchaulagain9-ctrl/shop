'use client';

import { useEffect, useState } from 'react';
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Package,
  TrendingUp,
  Users,
  ShoppingCart,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
} from 'lucide-react';
import StatCard from './admin/StatCard';
import OrdersTable from './admin/OrdersTable';
import RevenueChart from './admin/RevenueChart';
import ProductsTable from './admin/ProductsTable';
import SiteSettingsPanel from './admin/SiteSettingsPanel';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  verifiedUsers: number;
  ordersByStatus: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
  };
  paymentMethods: Array<{
    _id: string;
    count: number;
    revenue: number;
  }>;
  monthlyRevenue: number;
  dailyRevenue: Array<{
    _id: string;
    revenue: number;
    orders: number;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-red-600">Failed to load dashboard</div>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here&apos;s your business overview.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'orders'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'products'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'settings'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Site Settings
          </button>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Revenue"
                value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
                change="+12.5%"
                icon={TrendingUp}
                color="blue"
              />
              <StatCard
                title="Total Orders"
                value={stats.totalOrders.toString()}
                change="+8.2%"
                icon={ShoppingCart}
                color="green"
              />
              <StatCard
                title="Total Users"
                value={stats.totalUsers.toString()}
                subtitle={`${stats.verifiedUsers} verified`}
                icon={Users}
                color="purple"
              />
              <StatCard
                title="This Month"
                value={`Rs. ${stats.monthlyRevenue.toLocaleString()}`}
                change="+5.3%"
                icon={Package}
                color="orange"
              />
            </div>

            {/* Order Status Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Order Status Breakdown
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-6 h-6 text-blue-600" />
                      <span className="text-gray-700">Pending</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {stats.ordersByStatus.pending}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-6 h-6 text-yellow-600" />
                      <span className="text-gray-700">Processing</span>
                    </div>
                    <span className="text-2xl font-bold text-yellow-600">
                      {stats.ordersByStatus.processing}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Truck className="w-6 h-6 text-purple-600" />
                      <span className="text-gray-700">Shipped</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">
                      {stats.ordersByStatus.shipped}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span className="text-gray-700">Delivered</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {stats.ordersByStatus.delivered}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Payment Methods
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.paymentMethods}
                      dataKey="count"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {stats.paymentMethods.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {stats.paymentMethods.map((method, index) => (
                    <div key={method._id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-gray-700 capitalize">{method._id}</span>
                      </div>
                      <span className="text-gray-900 font-semibold">
                        {method.count} orders
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Revenue Charts */}
            <RevenueChart data={stats.dailyRevenue} />
          </>
        )}

        {activeTab === 'orders' && <OrdersTable />}
        {activeTab === 'products' && <ProductsTable />}
        {activeTab === 'settings' && <SiteSettingsPanel />}
      </div>
    </div>
  );
}
