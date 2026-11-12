'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MotionConfig } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import LoginModal from '@/components/LoginModal';
import Cart from '@/components/Cart';
import ToastContainer from '@/components/ToastContainer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { CartProvider } from '@/lib/contexts/CartContext';
import { LoginProvider, useLogin } from '@/lib/contexts/LoginContext';
import { ToastProvider } from '@/lib/contexts/ToastContext';

interface RootLayoutClientProps {
  children: React.ReactNode;
}

function RootLayoutContent({ children }: RootLayoutClientProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoginOpen, openLogin, closeLogin } = useLogin();

  useEffect(() => {
    // Register PWA manifest
    if (!document.querySelector('link[rel="manifest"]')) {
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = '/manifest.json';
      document.head.appendChild(link);
    }

    // Register service worker for PWA capabilities
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
        // Service worker not available - graceful fallback
      });
    }

    // Optimize for mobile orientation changes
    const handleOrientationChange = () => {
      // Re-layout when orientation changes
      window.dispatchEvent(new Event('resize'));
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return (
    <>
      <ErrorBoundary>
        {!isAdmin && <><a className="skip-link" href="#main-content">Skip to content</a><Navbar onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} onLoginClick={openLogin} /></>}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
        <Cart />
        <ToastContainer />
        {children}
        {!isAdmin && <Footer />}
      </ErrorBoundary>
    </>
  );
}

export default function RootLayoutClient({ children }: RootLayoutClientProps) {
  return (
    <MotionConfig reducedMotion="user"><AuthProvider>
      <ToastProvider>
        <LoginProvider>
          <CartProvider>
            <RootLayoutContent>{children}</RootLayoutContent>
          </CartProvider>
        </LoginProvider>
      </ToastProvider>
    </AuthProvider></MotionConfig>
  );
}
