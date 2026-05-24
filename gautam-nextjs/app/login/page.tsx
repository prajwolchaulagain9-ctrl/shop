'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const resetForm = () => {
    setErrors({});
    setMessage(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const newErrors: { [key: string]: string } = {};

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate login
    setMessage({ text: 'Login successful! Welcome back.', type: 'success' });
    setTimeout(() => {
      resetForm();
      setActiveTab('login');
    }, 1500);
  };

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const firstName = (formData.get('first_name') as string).trim();
    const lastName = (formData.get('last_name') as string).trim();
    const email = (formData.get('email') as string).trim();
    const phone = (formData.get('phone') as string).trim();
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm_password') as string;
    const terms = formData.get('terms');

    const newErrors: { [key: string]: string } = {};

    // Validation
    if (firstName.length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters';
    }
    if (lastName.length < 2) {
      newErrors.last_name = 'Last name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (phone && !/^(\+977-?)?[0-9]{10}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (password !== confirmPassword) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    if (!terms) {
      setMessage({ text: 'Please accept the Terms & Conditions', type: 'error' });
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate registration
    setMessage({ text: 'Account created successfully! Please login.', type: 'success' });
    setTimeout(() => {
      setActiveTab('login');
      resetForm();
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-32 pb-16">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-2">Authentication</h1>
          <p className="text-gray-600">Sign in to your account or create a new one</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => {
                setActiveTab('login');
                resetForm();
              }}
              className={`flex-1 py-4 font-medium transition-colors ${
                activeTab === 'login'
                  ? 'text-red-900 border-b-2 border-red-900 bg-red-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                resetForm();
              }}
              className={`flex-1 py-4 font-medium transition-colors ${
                activeTab === 'register'
                  ? 'text-red-900 border-b-2 border-red-900 bg-red-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Register
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-lg text-sm font-medium ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : message.type === 'error'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                }`}
              >
                {message.text}
              </motion.div>
            )}

            {/* Login Form */}
            {activeTab === 'login' && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleLoginSubmit}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none transition-all"
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none transition-all"
                      placeholder="••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xl hover:opacity-70 transition-opacity"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" name="remember" className="w-4 h-4 rounded accent-red-900" />
                    <span className="ml-2 text-sm text-gray-700">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-red-900 hover:text-red-800 font-medium">
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-red-900 text-white font-medium rounded-lg hover:bg-red-800 transition-colors"
                >
                  Sign In
                </button>
              </motion.form>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleRegisterSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none transition-all"
                      placeholder="John"
                    />
                    {errors.first_name && <p className="text-red-600 text-xs mt-1">{errors.first_name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none transition-all"
                      placeholder="Doe"
                    />
                    {errors.last_name && <p className="text-red-600 text-xs mt-1">{errors.last_name}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none transition-all"
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none transition-all"
                    placeholder="+977-9851234567"
                  />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none transition-all"
                      placeholder="••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xl hover:opacity-70 transition-opacity"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirm_password"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none transition-all"
                      placeholder="••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xl hover:opacity-70 transition-opacity"
                    >
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.confirm_password && <p className="text-red-600 text-sm mt-1">{errors.confirm_password}</p>}
                </div>

                <label className="flex items-start cursor-pointer">
                  <input type="checkbox" name="terms" required className="w-4 h-4 rounded accent-red-900 mt-1 cursor-pointer" />
                  <span className="ml-2 text-sm text-gray-700 select-none">
                    I agree to the{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-red-900 hover:text-red-800 font-semibold underline">
                      Terms & Conditions
                    </a>
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full py-3 bg-red-900 text-white font-medium rounded-lg hover:bg-red-800 transition-colors"
                >
                  Create Account
                </button>
              </motion.form>
            )}
          </div>
        </motion.div>

        {/* Info Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-sm text-gray-600 mt-8"
        >
          Traditional Nepalese craftsmanship at your fingertips
        </motion.p>
      </div>
    </main>
  );
}
