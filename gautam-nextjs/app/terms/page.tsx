'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Shield, ShoppingBag, Truck, RefreshCw, Lock, Phone } from 'lucide-react';

const sections = [
  {
    icon: ShoppingBag,
    title: '1. Orders & Purchases',
    content: [
      'All orders are subject to product availability. We reserve the right to cancel or refuse any order at our discretion.',
      'Prices are listed in Nepalese Rupees (NPR) and are subject to change without prior notice.',
      'After placing an order, you will receive a confirmation. This does not guarantee the order has been accepted — we may contact you to verify details.',
      'For bulk or custom orders, please contact us directly before placing an order.',
    ],
  },
  {
    icon: Truck,
    title: '2. Delivery & Shipping',
    content: [
      'We currently deliver within Kathmandu Valley and select areas across Nepal.',
      'Delivery timelines are estimated and not guaranteed. Delays may occur due to festivals, weather, or high demand.',
      'Delivery charges (if any) will be communicated before order confirmation.',
      'Please ensure your delivery address and phone number are accurate. We are not responsible for failed deliveries due to incorrect information.',
    ],
  },
  {
    icon: RefreshCw,
    title: '3. Returns & Exchanges',
    content: [
      'Returns are accepted within 7 days of receiving the product, provided the item is unused, unwashed, and in its original condition.',
      'Items damaged during use, altered, or missing original tags are not eligible for return.',
      'Custom-made or specially ordered items are non-refundable unless they arrive defective.',
      'To initiate a return, contact us at +977 9849591758 or bharatgautam@gmail.com with your order details.',
      'Refunds (if applicable) will be processed within 7–14 business days.',
    ],
  },
  {
    icon: Lock,
    title: '4. Privacy & Data',
    content: [
      'We collect your name, email, phone number, and address solely for processing orders and communication.',
      'Your personal information is never sold or shared with third parties for marketing purposes.',
      'Payment details are processed securely through our payment partners (eSewa, Khalti). We do not store card or wallet credentials.',
      'By registering on our platform, you agree to receive order-related communications via email and SMS.',
    ],
  },
  {
    icon: Shield,
    title: '5. Product Authenticity',
    content: [
      'All products listed on our store are authentic, handcrafted Nepalese goods sourced directly from artisans.',
      'Product images are representative — slight color variations may occur due to lighting, dye batches, or screen calibration.',
      'We do not take responsibility for variations in handcrafted items, as these are natural characteristics of artisanal work.',
    ],
  },
  {
    icon: Phone,
    title: '6. Contact & Disputes',
    content: [
      'For any concerns, complaints, or queries, please contact us directly before pursuing any other action.',
      'Phone: +977 9849591758 (7AM – 8PM, every day)',
      'Email: bharatgautam@gmail.com',
      'We aim to resolve all disputes amicably and in good faith within 7 business days of being contacted.',
      'These terms are governed by the laws of Nepal.',
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf7] pt-20">
      {/* Hero */}
      <section className="bg-red-950 px-4 py-16 text-white sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-amber-300">
              Legal
            </p>
            <h1 className="mb-4 font-playfair text-4xl font-bold leading-tight sm:text-5xl">
              Terms & Conditions
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              Please read these terms carefully before placing an order or using our services.
              By shopping with us, you agree to the following terms.
            </p>
            <p className="mt-4 text-sm text-white/60">
              Last updated: May 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-red-950 hover:text-red-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </motion.div>

          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12 rounded-lg border border-amber-200 bg-amber-50 p-6"
          >
            <p className="text-base leading-7 text-stone-700">
              These Terms & Conditions govern your use of the Gautam Lady Shoes website and services.
              By accessing our website or placing an order, you confirm that you have read, understood,
              and agreed to these terms. If you disagree with any part of these terms, please do not use our services.
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="rounded-lg border border-red-950/10 bg-white p-6 shadow-sm sm:p-8"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-950 text-amber-300">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h2 className="font-playfair text-xl font-bold text-red-950 sm:text-2xl">
                      {section.title}
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((point, i) => (
                      <li key={i} className="flex gap-3 text-base leading-7 text-stone-600">
                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-600" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 rounded-lg bg-red-950 p-6 text-center text-white sm:p-8"
          >
            <h3 className="mb-2 font-playfair text-2xl font-bold text-amber-300">
              Questions about these terms?
            </h3>
            <p className="mb-6 text-white/80">
              We&apos;re always happy to clarify. Reach out before placing your order if you have any concerns.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="tel:+9779849591758"
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-red-950 hover:bg-amber-300 transition-colors"
              >
                <Phone className="h-4 w-4" />
                +977 9849591758
              </a>
              <a
                href="mailto:bharatgautam@gmail.com"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur hover:bg-white/20 transition-colors"
              >
                bharatgautam@gmail.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
