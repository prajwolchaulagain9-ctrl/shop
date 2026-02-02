'use client';

import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import { slippers, clothing, collections } from '@/src/data/products';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />

      {/* Traditional Slippers Section */}
      <section id="slippers" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="font-playfair text-5xl font-bold text-red-900 mb-4">
              Traditional Slippers
            </h2>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-700"></div>
            </div>
            <p className="text-xl text-gray-600 italic">Handwoven comfort meets authentic Nepalese design</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {slippers.flat.slice(0, 3).map((product, idx) => (
              <ProductCard key={product.id} {...product} index={idx} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/slippers">
              <motion.button
                className="bg-red-900 hover:bg-red-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Slippers
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Traditional Clothing Section */}
      <section id="clothing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="font-playfair text-5xl font-bold text-red-900 mb-4">
              Traditional Clothing
            </h2>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-700"></div>
            </div>
            <p className="text-xl text-gray-600 italic">Authentic Nepalese garments celebrating our rich cultural heritage</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              clothing.daura[0],
              clothing.gunya[0],
              clothing.specialKurta[0],
            ].map((product, idx) => (
              <ProductCard key={product.id} {...product} index={idx} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/clothing">
              <motion.button
                className="bg-red-900 hover:bg-red-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Clothing
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Collections Section */}
      <section id="collections" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="font-playfair text-5xl font-bold text-red-900 mb-4">
              Other Collections
            </h2>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-700"></div>
            </div>
            <p className="text-xl text-gray-600 italic">Authentic Nepalese items celebrating our rich cultural heritage</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.slice(0, 3).map((product, idx) => (
              <ProductCard key={product.id} {...product} index={idx} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/collections">
              <motion.button
                className="bg-red-900 hover:bg-red-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Collections
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-r from-red-900 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="font-playfair text-4xl font-bold text-amber-400 mb-6">
                Preserving Nepal's Cultural Heritage
              </h2>
              <p className="text-lg leading-relaxed mb-4 opacity-95">
                For over three generations, our family has been dedicated to preserving the rich tradition of Nepalese craftsmanship. Based in the cultural heart of Kathmandu, we work directly with skilled artisans from different parts of the valley to bring you authentic, handcrafted products.
              </p>
              <p className="text-lg leading-relaxed mb-6 opacity-95">
                Every piece in our collection tells a story of Nepal's diverse cultural tapestry. Our traditional slippers are woven using techniques that reflects our distinct culture, while our clothing celebrates the vibrant heritage that makes Nepal unique.
              </p>

              {/* Features */}
              <div className="space-y-4">
                {[
                  {
                    title: 'Handcrafted Excellence',
                    desc: 'Each item is meticulously created by master craftspeople',
                  },
                  {
                    title: 'Authentic Materials',
                    desc: 'Only genuine, locally-sourced materials',
                  },
                  {
                    title: 'Cultural Heritage',
                    desc: 'Designs rooted in centuries-old Nepalese traditions',
                  },
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20"
                  >
                    <h4 className="font-playfair text-xl font-bold text-amber-400 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-white/90">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Image placeholder - using a sample image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.2 }}
              className="relative h-96 rounded-lg overflow-hidden shadow-2xl"
            >
              <img
                src="/gunyo.webp"
                alt="Nepalese Artisan at Work"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="font-playfair text-5xl font-bold text-red-900 mb-4">
              Connect With Us
            </h2>
            <div className="flex justify-center">
              <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-700"></div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '📍',
                title: 'Visit Our Store',
                content: ['Machindranath, Kathmandu', 'Nepal 44600'],
              },
              {
                icon: '📞',
                title: 'Get In Touch',
                content: [
                  'Phone: +977 9851223736',
                  'Email: bharatgautam@gmail.com',
                ],
              },
              {
                icon: '⏰',
                title: 'Store Hours',
                content: ['Anyday between', '7AM - 8PM'],
              },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-amber-500"
              >
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="font-playfair text-2xl font-bold text-red-900 mb-4">
                  {card.title}
                </h3>
                {card.content.map((line, i) => (
                  <p key={i} className="text-gray-600 text-lg">
                    {line}
                  </p>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map & Location Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="font-playfair text-5xl font-bold text-red-900 mb-4">
              Find Us On The Map
            </h2>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-700"></div>
            </div>
            <p className="text-xl text-gray-600 italic">Visit our store in the cultural heart of Kathmandu</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Map */}
            <div className="lg:col-span-2">
              <div className="rounded-lg overflow-hidden shadow-xl h-[600px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.3460636218306!2d85.30800907554054!3d27.706599476183023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb18ff0d2bba2f%3A0xfdcb522760296bf9!2sGautam%20Lady%20Shoes!5e0!3m2!1sen!2sus!4v1769972717913!5m2!1sen!2sus"
                  width="100%"
                  height="600"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Info Cards */}
            <div className="space-y-6">
              {/* Address Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-red-900 to-red-800 text-white p-6 rounded-lg shadow-lg border border-amber-500/30"
              >
                <h3 className="font-playfair text-2xl font-bold mb-4 text-amber-400">
                  📍 Our Location
                </h3>
                <p className="text-lg mb-2">Machindranath</p>
                <p className="text-lg mb-2">Kathmandu, Nepal 44600</p>
                <p className="text-sm opacity-90 mt-4">
                  Located in the historic Machindranath area, home to Nepal's rich cultural heritage
                </p>
              </motion.div>

              {/* Hours Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 rounded-lg shadow-lg"
              >
                <h3 className="font-playfair text-2xl font-bold mb-4">
                  ⏰ Store Hours
                </h3>
                <div className="space-y-2">
                  <p className="text-lg font-semibold">Monday - Friday</p>
                  <p className="text-base">7:00 AM - 8:00 PM</p>
                  <p className="text-lg font-semibold mt-3">Saturday - Sunday</p>
                  <p className="text-base">7:00 AM - 8:00 PM</p>
                </div>
              </motion.div>

              {/* Contact Info Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white border-2 border-red-900 p-6 rounded-lg shadow-lg"
              >
                <h3 className="font-playfair text-2xl font-bold text-red-900 mb-4">
                  📞 Contact Info
                </h3>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <span className="font-semibold">Phone:</span>
                    <br />
                    <a href="tel:+9779851223736" className="text-red-900 hover:text-red-700 font-medium">
                      +977 9851223736
                    </a>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Email:</span>
                    <br />
                    <a href="mailto:bharatgautam@gmail.com" className="text-red-900 hover:text-red-700 font-medium">
                      bharatgautam@gmail.com
                    </a>
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
