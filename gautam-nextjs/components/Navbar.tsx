'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useCart } from '@/lib/contexts/CartContext';
import { ShoppingCart, LayoutDashboard, Menu, X } from 'lucide-react';

interface NavbarProps {
  onSidebarToggle?: () => void;
  onLoginClick?: () => void;
}

interface AuthUser {
  role?: string;
}

export default function Navbar({ onSidebarToggle, onLoginClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const { cartCount, toggleCart } = useCart();
  const authUser = user as AuthUser | null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed left-0 right-0 top-0 z-[1000] transition-all duration-300 ${
        isScrolled
          ? 'bg-[#3b0909]/96 shadow-lg shadow-black/10 backdrop-blur-xl'
          : 'bg-[#3b0909]/88 backdrop-blur-lg'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-3">
          {/* Sidebar Toggle - Left */}
          <motion.button
            onClick={onSidebarToggle}
            className="hidden rounded-full border border-white/10 bg-white/10 p-3 text-white transition-colors hover:bg-white/16 md:inline-flex"
            aria-label="Open category sidebar"
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </motion.button>

          {/* Logo */}
          <Link href="/" className="min-w-0 flex-shrink">
            <motion.h2
              className="truncate font-playfair text-xl font-bold tracking-normal text-white sm:text-2xl"
              whileHover={{ scale: 1.05 }}
            >
              Gautam Lady Shoes
            </motion.h2>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden items-center gap-8 list-none lg:flex">
            <li>
              <Link href="/" className="relative font-medium text-white transition-colors hover:text-amber-300 group">
                Home
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-amber-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link href="/slippers" className="relative font-medium text-white transition-colors hover:text-amber-300 group">
                Slippers
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-amber-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link href="/clothing" className="relative font-medium text-white transition-colors hover:text-amber-300 group">
                Clothing
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-amber-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link href="/collections" className="relative font-medium text-white transition-colors hover:text-amber-300 group">
                Collections
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-amber-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          </ul>

          {/* Buttons Group */}
          <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
            <motion.button
              onClick={() => setIsMenuOpen((open) => !open)}
              className="inline-flex rounded-full border border-white/10 bg-white/10 p-3 text-white transition-colors hover:bg-white/16 lg:hidden"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </motion.button>

            {/* Admin Dashboard Button */}
            {isAuthenticated && authUser?.role === 'admin' && (
              <motion.button
                onClick={() => window.location.href = '/admin'}
                className="relative rounded-full bg-purple-600 p-3 text-white transition-colors hover:bg-purple-700"
                aria-label="Admin Dashboard"
                whileTap={{ scale: 0.95 }}
                title="Admin Dashboard"
              >
                <LayoutDashboard className="h-5 w-5" />
              </motion.button>
            )}

            {/* Cart Button */}
            <motion.button
              onClick={toggleCart}
              className="relative rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/16"
              aria-label="Shopping cart"
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-400 px-1 text-xs font-bold text-red-950"
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </motion.span>
              )}
            </motion.button>

            {!isAuthenticated ? (
              <motion.button
                onClick={onLoginClick}
                className="hidden rounded-full bg-amber-400 px-5 py-2.5 font-bold text-red-950 transition-colors hover:bg-amber-300 sm:inline-flex"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
            ) : (
              <motion.button
                onClick={logout}
                className="hidden rounded-full bg-red-600 px-5 py-2.5 font-bold text-white transition-colors hover:bg-red-700 sm:inline-flex"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-[#2d0707]/98 pb-4 lg:hidden"
          >
            <ul className="flex flex-col gap-1 list-none pt-3">
              <li>
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 font-semibold text-white hover:bg-white/10"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/slippers"
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 font-semibold text-white hover:bg-white/10"
                >
                  Slippers
                </Link>
              </li>
              <li>
                <Link
                  href="/clothing"
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 font-semibold text-white hover:bg-white/10"
                >
                  Clothing
                </Link>
              </li>
              <li>
                <Link
                  href="/collections"
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 font-semibold text-white hover:bg-white/10"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 font-semibold text-white hover:bg-white/10"
                >
                  Contact
                </Link>
              </li>
              {isAuthenticated && authUser?.role === 'admin' && (
                <li className="px-4 pt-1">
                  <Link
                    href="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 w-full rounded-full bg-purple-600 px-5 py-3 font-bold text-white hover:bg-purple-700"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                </li>
              )}
              {!isAuthenticated ? (
                <li className="px-4 pt-2 sm:hidden">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onLoginClick?.();
                    }}
                    className="w-full rounded-full bg-amber-400 px-5 py-3 font-bold text-red-950 hover:bg-amber-300"
                  >
                    Login
                  </button>
                </li>
              ) : (
                <li className="px-4 pt-2">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                    className="w-full rounded-full bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
