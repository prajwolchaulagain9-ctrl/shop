'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Facebook,
  Home,
  Instagram,
  Phone,
  Shirt,
  Sparkles,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const toggleSubmenu = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  const menuItems = [
    {
      icon: Home,
      label: 'Home',
      href: '/',
    },
    {
      icon: Sparkles,
      label: 'Slippers',
      href: '/slippers',
      submenu: [
        { label: 'Block Heel Slippers', href: '/slippers#block-heel' },
        { label: 'Flat Slippers', href: '/slippers#flat' },
        { label: 'Medium Heel Slippers', href: '/slippers#medium-heel' },
        { label: 'Small Heel Slippers', href: '/slippers#small-heel' },
      ],
    },
    {
      icon: Shirt,
      label: 'Clothing',
      href: '/clothing',
      submenu: [
        { label: 'Krishna & Radha Dress', href: '/clothing#krishna-radha' },
        { label: 'Pasni', href: '/clothing#pasni' },
        { label: 'Daura Suruwal', href: '/clothing#daura' },
        { label: 'Plain Kurta', href: '/clothing#plain-kurta' },
        { label: 'Chicken Kadai Kurta', href: '/clothing#chicken-kadai' },
        { label: 'Gunyu Choli', href: '/clothing#gunyu' },
      ],
    },
    {
      icon: Sparkles,
      label: 'Collections',
      href: '/collections',
    },
    {
      icon: Phone,
      label: 'About',
      href: '/#about',
    },
    {
      icon: Phone,
      label: 'Contact',
      href: '/#contact',
    },
  ];

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.nav
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className="fixed left-0 top-0 z-[1000] flex h-[100svh] w-[min(20rem,86vw)] flex-col bg-gradient-to-b from-red-950 to-red-900 shadow-2xl backdrop-blur-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div className="flex flex-col">
            <h2 className="font-playfair text-2xl font-bold text-amber-300">Gautam Lady</h2>
            <p className="text-xs text-amber-100/70">Shoes</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-3xl text-amber-300 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Menu */}
        <ul className="flex-1 overflow-y-auto px-4 py-6">
          {menuItems.map((item, index) => (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="mb-2"
            >
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-white transition-colors hover:bg-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-amber-300" aria-hidden="true" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <motion.span
                      animate={{ rotate: expandedMenu === item.label ? 180 : 0 }}
                      className="text-sm"
                    >
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    </motion.span>
                  </button>

                  {/* Submenu */}
                  <AnimatePresence>
                    {expandedMenu === item.label && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <ul className="ml-4 space-y-1 py-2 border-l-2 border-yellow-600/30">
                          {item.submenu.map((subitem) => (
                            <li key={subitem.label}>
                              <Link
                                href={subitem.href}
                                onClick={handleLinkClick}
                                className="block rounded px-4 py-2 text-sm text-white/78 transition-colors hover:bg-white/10 hover:text-amber-300"
                              >
                                {subitem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-white transition-colors hover:bg-white/10 hover:text-amber-300"
                >
                  <item.icon className="h-5 w-5 text-amber-300" aria-hidden="true" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )}
            </motion.li>
          ))}
        </ul>

        {/* Footer */}
        <div className="space-y-4 border-t border-white/10 p-4">
          <div className="flex justify-center gap-4">
            <a href="#" className="rounded-full p-2 text-white transition-colors hover:bg-white/10 hover:text-amber-300" aria-label="Facebook">
              <Facebook className="h-5 w-5" aria-hidden="true" />
            </a>
            <a href="#" className="rounded-full p-2 text-white transition-colors hover:bg-white/10 hover:text-amber-300" aria-label="Instagram">
              <Instagram className="h-5 w-5" aria-hidden="true" />
            </a>
            <a href="#" className="rounded-full p-2 text-white transition-colors hover:bg-white/10 hover:text-amber-300" aria-label="Phone">
              <Phone className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
          <p className="text-center text-xs text-white/60">Gautam Lady Shoes</p>
        </div>
      </motion.nav>
    </>
  );
};

export default Sidebar;
