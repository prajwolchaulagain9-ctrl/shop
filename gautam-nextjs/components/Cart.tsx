'use client';

import { useCart } from '@/lib/contexts/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const router = useRouter();
  const {
    cart,
    cartCount,
    isCartOpen,
    loading,
    updateCartItem,
    removeFromCart,
    clearCart,
    closeCart,
  } = useCart();

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      // Extract number from price string (e.g., "NPR 1,200" -> 1200)
      const numericPrice = parseInt(item.price.replace(/[^\d]/g, '')) || 0;
      return total + numericPrice * item.quantity;
    }, 0);
  };

  const formatPrice = (price: number) => {
    return `NPR ${price.toLocaleString()}`;
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    closeCart();
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={closeCart}
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-red-900 text-white">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6" />
                <h2 className="text-2xl font-playfair font-bold">
                  Your Cart ({cartCount})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-red-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ShoppingBag className="w-24 h-24 mb-4 opacity-20" />
                  <p className="text-xl font-semibold">Your cart is empty</p>
                  <p className="text-sm mt-2">Add some products to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 bg-gray-50 p-4 rounded-lg shadow-sm"
                    >
                      {/* Product Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-playfair font-semibold text-red-900 text-lg mb-1 truncate">
                          {item.name}
                        </h3>
                        <p className="text-amber-600 font-semibold mb-3">
                          {item.price}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                updateCartItem(item.productId, item.quantity - 1)
                              }
                              disabled={loading || item.quantity <= 1}
                              className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-3 font-semibold min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateCartItem(item.productId, item.quantity + 1)
                              }
                              disabled={loading}
                              className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.productId)}
                            disabled={loading}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Remove from cart"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-xl font-semibold text-red-900">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Shipping calculated at checkout
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleCheckout}
                    disabled={loading || cart.length === 0}
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={clearCart}
                    disabled={loading}
                    className="w-full bg-white hover:bg-gray-100 text-red-600 border border-red-600 font-semibold py-3 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
