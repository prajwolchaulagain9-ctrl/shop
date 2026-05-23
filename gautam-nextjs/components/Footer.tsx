'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Brand */}
          <motion.div variants={itemVariants}>
            <h3 className="font-playfair text-xl font-bold text-amber-400 mb-4">
              Gautam Lady Shoes
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Preserving Nepal&apos;s traditional craftsmanship for future generations.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-playfair font-bold text-amber-400 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/slippers" className="text-gray-400 hover:text-white transition-colors">
                  Traditional Slippers
                </Link>
              </li>
              <li>
                <Link href="/clothing" className="text-gray-400 hover:text-white transition-colors">
                  Traditional Clothing
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-gray-400 hover:text-white transition-colors">
                  Our Heritage
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Follow */}
          <motion.div variants={itemVariants}>
            <h4 className="font-playfair font-bold text-amber-400 mb-4">Follow Our Journey</h4>
            <p className="text-gray-400 text-sm">
              Stay connected with our latest collections and stories from Nepal&apos;s artisan communities.
            </p>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h4 className="font-playfair font-bold text-amber-400 mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <span className="block">Machindranath, Kathmandu</span>
                <span>Nepal 44600</span>
              </li>
              <li>
                <a href="tel:+9779851223736" className="hover:text-white transition-colors">
                  +977 9851223736
                </a>
              </li>
              <li>
                <a href="mailto:bharatgautam@gmail.com" className="hover:text-white transition-colors">
                  bharatgautam@gmail.com
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          className="border-t border-gray-800 pt-8"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-center text-gray-500 text-sm">
            &copy; 2025 Gautam Lady Shoes. All rights reserved. | Crafted with love in Nepal
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
