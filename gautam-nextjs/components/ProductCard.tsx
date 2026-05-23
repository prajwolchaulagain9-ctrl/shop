'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/contexts/CartContext';
import { ShoppingCart, Sparkles } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  image: string;
  description?: string;
  index?: number;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  description,
  index = 0,
}: ProductCardProps) {
  const { addToCart } = useCart();
  return (
    <motion.article
      role="article"
      aria-label={`Product: ${name}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -5 }}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-red-950/10 bg-white shadow-[0_14px_40px_rgba(58,15,12,0.08)] transition-shadow duration-300 hover:shadow-[0_22px_56px_rgba(58,15,12,0.15)]"
      suppressHydrationWarning
    >
      {/* Image Container */}
      <div 
        className="relative aspect-[4/3] overflow-hidden bg-stone-100 sm:aspect-[5/4]"
        suppressHydrationWarning
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority={index === 0}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80" />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-3 py-1.5 text-xs font-bold text-red-950 shadow-sm backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
          Handmade
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="mb-2 font-playfair text-xl font-bold leading-snug text-red-950">
          {name}
        </h3>

        {description && (
          <p className="mb-4 line-clamp-3 flex-1 text-sm leading-6 text-stone-600">
            {description}
          </p>
        )}

        <div className="text-xl font-black text-red-900">
          {price}
        </div>

        {/* Add to Cart Button */}
        <button 
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#17653c] px-5 py-3.5 font-bold text-white shadow-md shadow-green-950/10 transition-colors duration-300 hover:bg-[#124f30]"
          onClick={() => {
            addToCart({
              productId: id,
              name,
              price,
              image,
            });
          }}
          aria-label={`Add ${name} to cart`}
        >
          <ShoppingCart className="w-5 h-5" aria-hidden="true" />
          Add to Cart
        </button>
      </div>
    </motion.article>
  );
}
