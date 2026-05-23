'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [registerStep, setRegisterStep] = useState<'form' | 'otp'>('form'); // OTP verification step
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [emailValidation, setEmailValidation] = useState<{ email: string; valid: boolean | null; checking: boolean }>({
    email: '',
    valid: null,
    checking: false,
  });
  // otpState is managed inside sendOTP/verifyOTP via closure over setRegistrationData
  const [otpExpiresAt, setOtpExpiresAt] = useState<number>(0);
  void otpExpiresAt; // used to track OTP expiry
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);

  const resetForm = () => {
    setErrors({});
    setMessage(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setEmailValidation({ email: '', valid: null, checking: false });
    setOtpExpiresAt(0);
    setRegistrationData(null);
    setRegisterStep('form');
  };

  const verifyEmail = async (email: string) => {
    setEmailValidation({ email, valid: null, checking: true });
    
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      setEmailValidation({ email, valid: data.valid === true, checking: false });
      
      if (!data.valid) {
        setErrors(prev => ({ ...prev, email: 'Email address does not exist or is not valid' }));
      } else {
        // Check if email is already registered
        const checkResponse = await fetch('/api/auth/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        
        const checkData = await checkResponse.json();
        
        if (checkData.exists) {
          setErrors(prev => ({ ...prev, email: 'This email is already registered. Please login instead.' }));
          setEmailValidation({ email, valid: false, checking: false });
        } else {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.email;
            return newErrors;
          });
        }
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setEmailValidation({ email, valid: null, checking: false });
    }
  };

  const sendOTP = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!data.success) {
        setMessage({ text: data.message || 'Failed to send OTP', type: 'error' });
        return false;
      }

      setOtpExpiresAt(Date.now() + (data.expiresIn * 1000));
      setMessage({ text: 'OTP sent to your email! Check your inbox.', type: 'info' });
      return true;
    } catch {
      setMessage({ text: 'Failed to send OTP. Please try again.', type: 'error' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!data.success) {
        setMessage({ text: data.message || 'Invalid OTP', type: 'error' });
        return false;
      }

      return true;
    } catch {
      setMessage({ text: 'Failed to verify OTP. Please try again.', type: 'error' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
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
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password);
      setMessage({ text: 'Login successful! Welcome back.', type: 'success' });
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error: unknown) {
      setMessage({ text: (error instanceof Error ? error.message : null) || 'Login failed', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
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
      newErrors.email = 'Please enter a valid email address format';
    }

    // Check if email validation passed
    if (emailValidation.valid === false) {
      newErrors.email = 'Email address does not exist. Please use a real email address.';
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
      setIsLoading(false);
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Check if email already exists before sending OTP
    try {
      const checkResponse = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const checkData = await checkResponse.json();

      if (checkData.exists) {
        setMessage({ text: 'This email is already registered. Please login instead.', type: 'error' });
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error('Email check error:', error);
      setMessage({ text: 'Failed to check email availability. Please try again.', type: 'error' });
      setIsLoading(false);
      return;
    }

    // Save registration data and send OTP
    setRegistrationData({
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
    });

    // Send OTP
    const otpSent = await sendOTP(email);
    if (otpSent) {
      setRegisterStep('otp');
    }
    setIsLoading(false);
  };

  const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const otp = (formData.get('otp') as string).trim();

    if (!otp || otp.length !== 6) {
      setMessage({ text: 'Please enter a valid 6-digit OTP', type: 'error' });
      setIsLoading(false);
      return;
    }

    // Verify OTP
    if (!registrationData) {
      setMessage({ text: 'Registration data missing. Please try again.', type: 'error' });
      setIsLoading(false);
      return;
    }

    const verified = await verifyOTP(registrationData.email, otp);
    if (!verified) {
      setIsLoading(false);
      return;
    }

    // Complete registration
    try {
      await register(registrationData);
      setMessage({ text: 'Account created successfully! Logging you in...', type: 'success' });
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error: unknown) {
      setMessage({ text: (error instanceof Error ? error.message : null) || 'Registration failed', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[2000] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900 font-playfair">Welcome Back</h2>
              <button
                onClick={handleClose}
                className="text-2xl text-gray-600 hover:text-gray-900 transition-colors w-8 h-8 flex items-center justify-center"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {/* Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mx-6 mt-4 p-3 rounded-lg text-sm font-medium ${
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

            {/* Tabs */}
            <div className="flex border-b px-6 mt-4">
              <button
                onClick={() => {
                  setActiveTab('login');
                  resetForm();
                }}
                className={`flex-1 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === 'login'
                    ? 'text-red-900 border-red-900'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setActiveTab('register');
                  resetForm();
                }}
                className={`flex-1 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === 'register'
                    ? 'text-red-900 border-red-900'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                Register
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Login Form */}
              {activeTab === 'login' && (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleLoginSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none transition-all"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none transition-all"
                        placeholder="••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xl"
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="remember" 
                        className="w-5 h-5 cursor-pointer"
                        style={{
                          accentColor: '#8b0000',
                          appearance: 'auto',
                          WebkitAppearance: 'checkbox',
                        }}
                      />
                      <span className="ml-2 text-sm text-gray-700">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-red-900 hover:text-red-800">
                      Forgot Password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-red-900 text-white font-medium rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>
                </motion.form>
              )}

              {/* Register Form */}
              {activeTab === 'register' && registerStep === 'form' && (
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none transition-all"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none transition-all"
                        placeholder="Doe"
                      />
                      {errors.last_name && <p className="text-red-600 text-xs mt-1">{errors.last_name}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        required
                        onChange={(e) => {
                          const email = e.target.value;
                          if (email.includes('@')) {
                            verifyEmail(email);
                          } else {
                            setEmailValidation({ email, valid: null, checking: false });
                          }
                        }}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                          emailValidation.valid === true
                            ? 'border-green-500 focus:ring-green-500'
                            : emailValidation.valid === false
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-red-900'
                        }`}
                        placeholder="you@example.com"
                      />
                      {emailValidation.checking && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-blue-600"
                          >
                            ⟳
                          </motion.div>
                        </span>
                      )}
                      {emailValidation.valid === true && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 text-lg">✓</span>
                      )}
                      {emailValidation.valid === false && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600 text-lg">✗</span>
                      )}
                    </div>
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none transition-all"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none transition-all"
                        placeholder="••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xl"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none transition-all"
                        placeholder="••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xl"
                      >
                        {showConfirmPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {errors.confirm_password && <p className="text-red-600 text-sm mt-1">{errors.confirm_password}</p>}
                  </div>

                  <label className="flex items-center cursor-pointer p-3 bg-gray-50 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">
                    <input 
                      type="checkbox" 
                      name="terms" 
                      required 
                      className="w-5 h-5 cursor-pointer" 
                      style={{
                        accentColor: '#8b0000',
                        appearance: 'auto',
                        WebkitAppearance: 'checkbox',
                      }}
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      I agree to the <a href="#" className="text-red-900 hover:text-red-800 font-semibold underline">Terms & Conditions</a>
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-red-900 text-white font-medium rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </motion.form>
              )}

              {/* OTP Verification Form */}
              {activeTab === 'register' && registerStep === 'otp' && (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleOTPSubmit}
                  className="space-y-4"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Verify Your Email</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      We sent a 6-digit OTP to <br />
                      <span className="font-medium">{registrationData?.email}</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                    <input
                      type="text"
                      name="otp"
                      maxLength={6}
                      required
                      className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none transition-all uppercase font-mono"
                      placeholder="000000"
                      autoComplete="off"
                    />
                    <p className="text-xs text-gray-500 text-center mt-2">OTP expires in 10 minutes</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-red-900 text-white font-medium rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegisterStep('form')}
                    className="w-full py-2 text-red-900 font-medium hover:bg-red-50 transition-colors rounded-lg"
                  >
                    Back to Registration
                  </button>
                </motion.form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
