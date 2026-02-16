'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
      suppressHydrationWarning
    >
      {/* Image Container */}
      <div 
        className="relative h-72 overflow-hidden bg-gray-100"
        suppressHydrationWarning
      >
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          priority={index === 0}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-6">
        <h3 className="font-playfair text-lg font-semibold text-red-900 mb-3">
          {name}
        </h3>

        {description && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
            {description}
          </p>
        )}

        <div className="text-xl font-semibold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
          {price}
        </div>

        {/* Add to Cart Button */}
        <button 
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          onClick={() => {
            addToCart({
              productId: id,
              name,
              price,
              image,
            });
          }}
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
