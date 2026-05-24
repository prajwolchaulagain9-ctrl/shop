'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Truck, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

const DEFAULT_HERO_IMAGE = '/sano-thaili.jpg';

export default function HeroSection() {
  const [heroImage, setHeroImage] = useState(DEFAULT_HERO_IMAGE);

  useEffect(() => {
    fetch('/api/settings?key=hero_image')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.value) {
          setHeroImage(data.value);
        }
      })
      .catch(() => {}); // Silently fail, use default
  }, []);

  return (
    <section className="relative min-h-[92svh] overflow-hidden bg-[#220707] pt-20 text-white">
      <Image
        src={heroImage}
        alt="Traditional Nepalese handmade textile collection"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-[0.42]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,7,7,0.96)_0%,rgba(72,10,12,0.84)_48%,rgba(34,7,7,0.2)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#fbfaf7] to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[calc(92svh-5rem)] w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl py-10 text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/35 bg-white/10 px-4 py-2 text-sm font-semibold text-amber-100 backdrop-blur"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Handcrafted in Kathmandu
          </motion.div>

          <motion.h1
            className="mb-5 font-playfair text-4xl font-bold leading-[1.04] tracking-normal text-white drop-shadow-lg sm:text-5xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Authentic Nepalese Craftsmanship
          </motion.h1>

          <motion.p
            className="mb-8 max-w-2xl text-base leading-8 text-white/90 sm:text-lg lg:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Shop traditional slippers, ceremonial clothing, and cultural pieces made with rich fabric, detailed finishing, and everyday comfort.
          </motion.p>

          <motion.div
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link href="/slippers">
              <motion.button
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-7 py-4 text-base font-bold text-red-950 shadow-xl shadow-black/20 transition-colors duration-300 hover:bg-amber-300 sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Collection
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </motion.button>
            </Link>
            <Link href="/clothing">
              <motion.button
                className="inline-flex w-full items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur transition-colors duration-300 hover:bg-white/20 sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Clothing
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            className="mt-9 grid max-w-2xl grid-cols-1 gap-3 text-sm text-white/85 sm:grid-cols-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            {[
              { icon: Sparkles, label: 'Festival-ready designs' },
              { icon: Truck, label: 'Kathmandu delivery' },
              { icon: ShieldCheck, label: 'Verified orders' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-3 backdrop-blur">
                  <Icon className="h-4 w-4 text-amber-300" aria-hidden="true" />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
