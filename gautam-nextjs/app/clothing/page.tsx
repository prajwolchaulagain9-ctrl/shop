'use client';

import ProductCard from '@/components/ProductCard';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ClothingPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products?category=clothing')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        }
      });
  }, []);

  const sections = [
    { id: 'krishna-radha', title: 'Krishna and Radha Sets', products: products.filter(p => p.subCategory === 'krishnaRadha') },
    { id: 'pasni', title: 'Pasni Clothes', products: products.filter(p => p.subCategory === 'pasni') },
    { id: 'daura', title: 'Daura Suruwal', products: products.filter(p => p.subCategory === 'daura') },
    { id: 'plain-kurta', title: 'Plain Kurta', products: products.filter(p => p.subCategory === 'plainKurta') },
    { id: 'chicken-kadai', title: 'Chicken Kadai Kurta Set', products: products.filter(p => p.subCategory === 'specialKurta') },
    { id: 'gunyu', title: 'Gunyu Choli & Girls Kurta', products: products.filter(p => p.subCategory === 'gunya') },
  ].filter(section => section.products.length > 0);

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
              Traditional Clothing
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-7 text-white/85 sm:text-xl">
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
          className={`px-4 py-16 sm:px-6 sm:py-24 lg:px-8 ${sectionIdx % 2 === 0 ? 'bg-[#fbfaf7]' : 'bg-white'}`}
        >
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.2 }}
              className="mb-10 text-center sm:mb-14"
            >
              <h2 className="mb-4 font-playfair text-3xl font-bold leading-tight text-red-950 sm:text-4xl">
                {section.title}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {section.products.map((product: any, idx: number) => (
                <ProductCard key={product._id || product.id} {...product} index={idx} id={product._id || product.id} />
              ))}
            </div>
          </div>
        </section>
      ))}
      
      {sections.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          Loading clothing... or no products found.
        </div>
      )}
    </main>
  );
}
