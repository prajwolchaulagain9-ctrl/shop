'use client';

import ProductCard from '@/components/ProductCard';
import { clothing } from '@/src/data/products';
import { motion } from 'framer-motion';

export default function ClothingPage() {
  const sections = [
    { id: 'newar', title: 'Krishna and Radha Sets', products: clothing.krishnaRadha },
    { id: 'Pasni', title: 'Pasni Clothes', products: clothing.pasni },
    { id: 'Daura', title: 'Daura Suruwal', products: clothing.daura },
    { id: 'sada', title: 'Plain Kurta', products: clothing.plainKurta },
    { id: 'special', title: 'Chicken Kadai Kurta Set', products: clothing.specialKurta },
    { id: 'gunyo', title: 'Gunyu Choli & Girls Kurta', products: clothing.gunya },
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
              Traditional Clothing
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Authentic Nepalese garments celebrating our rich cultural heritage. Explore our complete collection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      {sections.map((section, sectionIdx) => (
        <section
          key={section.id}
          id={section.id}
          className={`py-24 px-6 ${sectionIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
        >
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
