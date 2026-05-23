'use client';

import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import { slippers, clothing, collections } from '@/src/data/products';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  Navigation,
  PackageCheck,
  Palette,
  Phone,
  ShieldCheck,
} from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fbfaf7]">
      <HeroSection />

      {/* Traditional Slippers Section */}
      <section id="slippers" className="bg-[#fbfaf7] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="mb-10 text-center sm:mb-14"
          >
            <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-amber-700">Best sellers</p>
            <h2 className="mb-4 font-playfair text-3xl font-bold leading-tight text-red-950 sm:text-5xl">
              Traditional Slippers
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">Handwoven comfort with festive detail, made for ceremonies, gifting, and daily wear.</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {slippers.flat.slice(0, 3).map((product, idx) => (
              <ProductCard key={product.id} {...product} index={idx} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-10 text-center sm:mt-12"
          >
            <Link href="/slippers">
              <motion.button
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-950 px-7 py-3.5 font-bold text-white transition-colors duration-300 hover:bg-red-900 sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Slippers
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Traditional Clothing Section */}
      <section id="clothing" className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="mb-10 text-center sm:mb-14"
          >
            <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-amber-700">Ceremony wear</p>
            <h2 className="mb-4 font-playfair text-3xl font-bold leading-tight text-red-950 sm:text-5xl">
              Traditional Clothing
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">Authentic Nepalese garments for pasni, festivals, and family occasions.</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
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
            className="mt-10 text-center sm:mt-12"
          >
            <Link href="/clothing">
              <motion.button
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-950 px-7 py-3.5 font-bold text-white transition-colors duration-300 hover:bg-red-900 sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Clothing
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Collections Section */}
      <section id="collections" className="bg-[#fbfaf7] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="mb-10 text-center sm:mb-14"
          >
            <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-amber-700">Cultural pieces</p>
            <h2 className="mb-4 font-playfair text-3xl font-bold leading-tight text-red-950 sm:text-5xl">
              Other Collections
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">Ceremonial boards, traditional bags, accessories, and gift-ready items.</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {collections.slice(0, 3).map((product, idx) => (
              <ProductCard key={product.id} {...product} index={idx} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-10 text-center sm:mt-12"
          >
            <Link href="/collections">
              <motion.button
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-950 px-7 py-3.5 font-bold text-white transition-colors duration-300 hover:bg-red-900 sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Collections
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-[#350808] py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-amber-300">Our standard</p>
              <h2 className="mb-6 font-playfair text-3xl font-bold leading-tight text-white sm:text-5xl">
                Preserving Nepal&apos;s Cultural Heritage
              </h2>
              <p className="mb-4 text-base leading-8 text-white/85 sm:text-lg">
                For over three generations, our family has been dedicated to preserving the rich tradition of Nepalese craftsmanship. Based in the cultural heart of Kathmandu, we work directly with skilled artisans from different parts of the valley to bring you authentic, handcrafted products.
              </p>
              <p className="mb-7 text-base leading-8 text-white/85 sm:text-lg">
                Every piece in our collection tells a story of Nepal&apos;s diverse cultural tapestry. Our traditional slippers are woven using techniques that reflects our distinct culture, while our clothing celebrates the vibrant heritage that makes Nepal unique.
              </p>

              {/* Features */}
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  {
                    icon: PackageCheck,
                    title: 'Handcrafted Excellence',
                    desc: 'Each item is meticulously created by master craftspeople',
                  },
                  {
                    icon: ShieldCheck,
                    title: 'Authentic Materials',
                    desc: 'Only genuine, locally-sourced materials',
                  },
                  {
                    icon: Palette,
                    title: 'Cultural Heritage',
                    desc: 'Designs rooted in centuries-old Nepalese traditions',
                  },
                ].map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur"
                    >
                      <Icon className="mb-3 h-5 w-5 text-amber-300" aria-hidden="true" />
                      <h4 className="mb-2 font-playfair text-lg font-bold text-white">
                        {feature.title}
                      </h4>
                      <p className="text-sm leading-6 text-white/76">{feature.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.2 }}
              className="relative min-h-[360px] overflow-hidden rounded-lg shadow-2xl shadow-black/25 sm:min-h-[520px]"
            >
              <Image
                src="/s6.jpg"
                alt="Nepalese Artisan at Work"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-white/20 bg-black/40 p-4 text-white backdrop-blur">
                <p className="font-playfair text-xl font-bold">Made for meaningful occasions</p>
                <p className="mt-1 text-sm text-white/78">Rich colors, finished details, and practical ordering support.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="mb-10 text-center sm:mb-14"
          >
            <h2 className="mb-4 font-playfair text-3xl font-bold leading-tight text-red-950 sm:text-5xl">
              Connect With Us
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">Visit the store, call for product availability, or confirm delivery details before ordering.</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {[
              {
                icon: MapPin,
                title: 'Visit Our Store',
                content: ['Machindranath, Kathmandu', 'Nepal 44600'],
              },
              {
                icon: Phone,
                title: 'Get In Touch',
                content: [
                  'Phone: +977 9851223736',
                  'Email: bharatgautam@gmail.com',
                ],
              },
              {
                icon: Clock,
                title: 'Store Hours',
                content: ['Anyday between', '7AM - 8PM'],
              },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-lg border border-red-950/10 bg-[#fbfaf7] p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg sm:p-8"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-red-950 text-amber-300">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mb-4 font-playfair text-2xl font-bold text-red-950">
                    {card.title}
                  </h3>
                  {card.content.map((line) => (
                    <p key={line} className="text-base leading-7 text-stone-600 sm:text-lg">
                      {line}
                    </p>
                  ))}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Map & Location Section */}
      <section className="bg-[#fbfaf7] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="mb-10 text-center sm:mb-14"
          >
            <h2 className="mb-4 font-playfair text-3xl font-bold leading-tight text-red-950 sm:text-5xl">
              Find Us On The Map
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">Visit our store in the cultural heart of Kathmandu.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8"
          >
            {/* Map */}
            <div className="lg:col-span-2 relative min-h-[360px] sm:min-h-[520px] lg:min-h-[600px] overflow-hidden rounded-lg border border-red-950/10 shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.3460636218306!2d85.30800907554054!3d27.706599476183023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb18ff0d2bba2f%3A0xfdcb522760296bf9!2sGautam%20Lady%20Shoes!5e0!3m2!1sen!2sus!4v1769972717913!5m2!1sen!2sus"
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Info Cards */}
            <div className="space-y-6">
              {/* Address Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                viewport={{ once: true }}
                className="rounded-lg border border-amber-300/30 bg-red-950 p-6 text-white shadow-lg"
              >
                <h3 className="mb-4 flex items-center gap-2 font-playfair text-2xl font-bold text-amber-300">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                  Our Location
                </h3>
                <p className="text-lg mb-2">Machindranath</p>
                <p className="text-lg mb-2">Kathmandu, Nepal 44600</p>
                <p className="text-sm opacity-90 mt-4">
                  Located in the historic Machindranath area, home to Nepal&apos;s rich cultural heritage
                </p>
              </motion.div>

              {/* Hours Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                viewport={{ once: true }}
                className="rounded-lg bg-amber-400 p-6 text-red-950 shadow-lg"
              >
                <h3 className="mb-4 flex items-center gap-2 font-playfair text-2xl font-bold">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                  Store Hours
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
                className="rounded-lg border border-red-950/15 bg-white p-6 shadow-lg"
              >
                <h3 className="mb-4 flex items-center gap-2 font-playfair text-2xl font-bold text-red-950">
                  <Navigation className="h-5 w-5" aria-hidden="true" />
                  Contact Info
                </h3>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <span className="inline-flex items-center gap-2 font-semibold"><Phone className="h-4 w-4" aria-hidden="true" /> Phone:</span>
                    <br />
                    <a href="tel:+9779851223736" className="font-medium text-red-950 hover:text-red-700">
                      +977 9851223736
                    </a>
                  </p>
                  <p className="text-gray-700">
                    <span className="inline-flex items-center gap-2 font-semibold"><Mail className="h-4 w-4" aria-hidden="true" /> Email:</span>
                    <br />
                    <a href="mailto:bharatgautam@gmail.com" className="font-medium text-red-950 hover:text-red-700">
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
