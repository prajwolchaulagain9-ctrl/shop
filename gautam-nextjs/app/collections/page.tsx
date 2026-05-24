'use client';

import ProductCard from '@/components/ProductCard';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CollectionsPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products?category=collections')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        }
      });
  }, []);

  return (
    <main className="min-h-screen bg-[#fbfaf7] pt-20">
      {/* Hero */}
      <section className="bg-red-950 px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="mb-4 font-playfair text-4xl font-bold leading-tight sm:text-6xl">
              Other Collections
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-7 text-white/85 sm:text-xl">
              Authentic Nepalese items celebrating our rich cultural heritage. Explore our complete collection of traditional accessories and ceremonial items.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="bg-[#fbfaf7] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="mb-10 text-center sm:mb-14"
          >
            <h2 className="mb-4 font-playfair text-3xl font-bold leading-tight text-red-950 sm:text-4xl">
              Featured Items
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
              Discover our selection of traditional accessories, ceremonial boards, traditional bags, and cultural items
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {products.map((product, idx) => (
              <ProductCard key={product._id || product.id} {...product} index={idx} id={product._id || product.id} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              Loading collections... or no products found.
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 font-playfair text-3xl font-bold text-red-950">
              Looking for something specific?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
              Contact us to learn about custom orders and special requests for traditional Nepalese items.
            </p>
            <motion.a
              href="tel:+9779849591758"
              className="inline-flex w-full items-center justify-center rounded-full bg-red-950 px-8 py-3.5 font-bold text-white transition-colors hover:bg-red-900 sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Call Us: +977 9849591758
            </motion.a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
