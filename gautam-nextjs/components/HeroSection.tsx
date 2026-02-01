'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-r from-red-900 to-red-700 flex items-center justify-center overflow-hidden pt-20">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_1px)] bg-[length:20px_20px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="font-playfair text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Authentic Nepalese Craftsmanship
          </motion.h1>

          <motion.p
            className="text-lg md:text-2xl text-white/95 mb-10 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Discover the timeless beauty of traditional Nepalese slippers and clothing, handcrafted by skilled artisans in the heart of the Himalayas
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link href="/slippers">
              <motion.button
                className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 text-lg font-semibold rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Our Collection
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
