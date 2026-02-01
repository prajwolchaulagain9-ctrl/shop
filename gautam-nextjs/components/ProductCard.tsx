'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';

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
  const { isAuthenticated } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full relative"
    >
      {/* Image Container */}
      <div className={`relative h-72 overflow-hidden bg-gray-100 ${!isAuthenticated ? 'blur-sm' : ''}`}>
        <motion.img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
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

        <div className={`text-xl font-semibold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent ${!isAuthenticated ? 'blur-sm' : ''}`}>
          {isAuthenticated ? price : '••••'}
        </div>
      </div>

      {/* Login Overlay for Non-Authenticated Users */}
      {!isAuthenticated && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
          <p className="text-white font-semibold text-center text-lg bg-black/60 px-4 py-2 rounded">
            Login to View
          </p>
        </div>
      )}
    </motion.div>
  );
}
