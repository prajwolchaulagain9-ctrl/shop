'use client';

import ProductCard from '@/components/ProductCard';
import { slippers } from '@/src/data/products';
import { motion } from 'framer-motion';

export default function SlippersPage() {
  const sections = [
    { id: 'flat-slippers-section', title: 'Flat Slippers', products: slippers.flat },
    { id: 'block-heel-section', title: 'Block Heel Slippers', products: slippers.blockHeel },
    { id: 'medium-heel-section', title: 'Medium Heel Slippers', products: slippers.mediumHeel },
    { id: 'small-heel-section', title: 'Small Heel Slippers', products: slippers.smallHeel },
  ];

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
              Traditional Slippers
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Handwoven comfort meets authentic Nepalese design. Explore our complete collection of traditional slippers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      {sections.map((section, sectionIdx) => (
        <section key={section.id} id={section.id} className={`py-24 px-6 ${sectionIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="font-playfair text-4xl font-bold text-red-900 mb-4">
                {section.title}
              </h2>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-amber-700"></div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.products.map((product, idx) => (
                <ProductCard key={product.id} {...product} index={idx} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
