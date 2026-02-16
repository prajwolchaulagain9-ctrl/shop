'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useLogin } from './LoginContext';

interface CartItem {
  productId: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  isCartOpen: boolean;
  loading: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  fetchCart: () => void;
  confirmPurchase: () => Promise<boolean>;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shopping_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { openLogin } = useLogin();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Load cart from localStorage on mount
  useEffect(() => {
    fetchCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  const fetchCart = () => {
    try {
      if (typeof window !== 'undefined') {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      }
    } catch (error) {
      console.error('Error fetching cart from localStorage:', error);
    }
  };

  const addToCart = (
    item: Omit<CartItem, 'quantity'>,
    quantity: number = 1
  ) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      openLogin();
      return;
    }

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.productId === item.productId
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new item
        return [...prevCart, { ...item, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const updateCartItem = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  };

  const confirmPurchase = async (): Promise<boolean> => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return false;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/cart/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart }),
      });

      const data = await response.json();

      if (data.success) {
        // Clear local cart after successful confirmation
        clearCart();
        return true;
      } else {
        alert(data.message || 'Failed to confirm purchase');
        return false;
      }
    } catch (error) {
      console.error('Error confirming purchase:', error);
      alert('Failed to confirm purchase');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        isCartOpen,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchCart,
        confirmPurchase,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
