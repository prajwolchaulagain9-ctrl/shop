'use client';

import ProductCard from '@/components/ProductCard';
import { collections } from '@/src/data/products';
import { motion } from 'framer-motion';

export default function CollectionsPage() {
  return (
    <main className="min-h-screen pt-24">
      {/* Hero */}
      <section className="bg-gradient-to-r from-red-900 to-red-700 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-4">
              Other Collections
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Authentic Nepalese items celebrating our rich cultural heritage. Explore our complete collection of traditional accessories and ceremonial items.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="font-playfair text-4xl font-bold text-red-900 mb-4">
              Featured Items
            </h2>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-amber-700"></div>
            </div>
            <p className="text-lg text-gray-600">
              Discover our selection of traditional accessories, ceremonial boards, traditional bags, and cultural items
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((product, idx) => (
              <ProductCard key={product.id} {...product} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-playfair text-3xl font-bold text-red-900 mb-4">
              Looking for something specific?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Contact us to learn about custom orders and special requests for traditional Nepalese items.
            </p>
            <motion.a
              href="tel:+9779851223736"
              className="inline-block bg-red-900 hover:bg-red-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Call Us: +977 9851223736
            </motion.a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
