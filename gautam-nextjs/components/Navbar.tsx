'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';

interface NavbarProps {
  onSidebarToggle: () => void;
  onLoginClick: () => void;
}

export default function Navbar({ onSidebarToggle, onLoginClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-1000 transition-all duration-300 ${
        isScrolled
          ? 'bg-red-900/98 backdrop-blur-lg shadow-lg'
          : 'bg-red-900/95 backdrop-blur-md'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Sidebar Toggle - Left */}
          <motion.button
            onClick={onSidebarToggle}
            className="text-white p-2 bg-red-800 rounded-lg hover:bg-red-700 transition-colors"
            aria-label="Toggle sidebar"
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <motion.h2
              className="font-playfair text-2xl font-bold text-white tracking-tight"
              whileHover={{ scale: 1.05 }}
            >
              Gautam Lady Shoes
            </motion.h2>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-12 list-none">
            <li>
              <Link href="/" className="text-white font-medium hover:text-amber-400 transition-colors relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
            <li>
              <Link href="/slippers" className="text-white font-medium hover:text-amber-400 transition-colors relative group">
                Slippers
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
            <li>
              <Link href="/clothing" className="text-white font-medium hover:text-amber-400 transition-colors relative group">
                Clothing
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
            <li>
              <Link href="/collections" className="text-white font-medium hover:text-amber-400 transition-colors relative group">
                Collections
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
          </ul>

          {/* Buttons Group */}
          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <motion.button
                onClick={onLoginClick}
                className="bg-amber-500 text-white px-6 py-2 rounded-full font-medium hover:bg-amber-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
            ) : (
              <motion.button
                onClick={logout}
                className="bg-red-600 text-white px-6 py-2 rounded-full font-medium hover:bg-red-700 transition-colors"
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
            className="md:hidden bg-red-950/90 pb-4"
          >
            <ul className="flex flex-col gap-2 list-none">
              <li>
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-white hover:bg-red-900 rounded"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/slippers"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-white hover:bg-red-900 rounded"
                >
                  Slippers
                </Link>
              </li>
              <li>
                <Link
                  href="/clothing"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-white hover:bg-red-900 rounded"
                >
                  Clothing
                </Link>
              </li>
              <li>
                <Link
                  href="/collections"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-white hover:bg-red-900 rounded"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-white hover:bg-red-900 rounded"
                >
                  Our Team
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
