'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import LoginModal from '@/components/LoginModal';
import Cart from '@/components/Cart';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { CartProvider } from '@/lib/contexts/CartContext';
import { LoginProvider, useLogin } from '@/lib/contexts/LoginContext';

interface RootLayoutClientProps {
  children: React.ReactNode;
}

function RootLayoutContent({ children }: RootLayoutClientProps) {
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
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
        // Service worker not available - graceful fallback
      });
    }

    // Prevent zoom on double-tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);

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
      <Navbar onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} onLoginClick={openLogin} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
      <Cart />
      {children}
      <Footer />
    </>
  );
}

export default function RootLayoutClient({ children }: RootLayoutClientProps) {
  return (
    <AuthProvider>
      <LoginProvider>
        <CartProvider>
          <RootLayoutContent>{children}</RootLayoutContent>
        </CartProvider>
      </LoginProvider>
    </AuthProvider>
  );
}
