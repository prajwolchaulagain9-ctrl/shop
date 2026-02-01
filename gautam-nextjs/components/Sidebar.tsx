'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
      icon: '🏠',
      label: 'Home',
      href: '/',
    },
    {
      icon: '👡',
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
      icon: '👗',
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
      icon: '✨',
      label: 'Collections',
      href: '/collections',
    },
    {
      icon: 'ℹ️',
      label: 'About',
      href: '/#about',
    },
    {
      icon: '📞',
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.nav
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className="fixed top-0 left-0 w-80 h-screen bg-gradient-to-b from-red-900 to-red-800 backdrop-blur-xl z-[1000] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="border-b border-yellow-600/30 p-6 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-yellow-500 font-playfair">Gautam Lady</h2>
            <p className="text-yellow-400 text-xs">Shoes</p>
          </div>
          <button
            onClick={onClose}
            className="text-yellow-500 text-3xl hover:text-yellow-400 transition-colors p-2 rounded-full hover:bg-yellow-500/10"
            aria-label="Close sidebar"
          >
            ×
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
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-white hover:bg-yellow-600/15 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <motion.span
                      animate={{ rotate: expandedMenu === item.label ? 180 : 0 }}
                      className="text-sm"
                    >
                      ▼
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
                                className="block px-4 py-2 text-sm text-white/80 hover:text-yellow-400 hover:bg-yellow-600/10 rounded transition-colors"
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
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-yellow-600/15 hover:text-yellow-400 transition-all group"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              )}
            </motion.li>
          ))}
        </ul>

        {/* Footer */}
        <div className="border-t border-yellow-600/30 p-4 space-y-4">
          <div className="flex justify-center gap-4">
            <a href="#" className="text-white hover:text-yellow-400 text-lg transition-colors" aria-label="Facebook">
              📘
            </a>
            <a href="#" className="text-white hover:text-yellow-400 text-lg transition-colors" aria-label="Instagram">
              📷
            </a>
            <a href="#" className="text-white hover:text-yellow-400 text-lg transition-colors" aria-label="Twitter">
              🐦
            </a>
          </div>
          <p className="text-center text-xs text-white/60">© 2024 Gautam Lady Shoes</p>
        </div>
      </motion.nav>
    </>
  );
};

export default Sidebar;
