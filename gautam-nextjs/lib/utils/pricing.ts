/**
 * Product pricing utilities
 */

import { slippers, clothing } from '@/src/data/products';

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  category?: string;
}

/**
 * Get all products from all categories
 */
export function getAllProducts(): Map<string, Product> {
  const productMap = new Map<string, Product>();
  
  // Add all slippers
  Object.entries(slippers).forEach(([category, items]) => {
    items.forEach((item) => {
      productMap.set(item.id, { ...item, category: `slippers-${category}` });
    });
  });
  
  // Add all clothing
  Object.entries(clothing).forEach(([category, items]) => {
    items.forEach((item) => {
      productMap.set(item.id, { ...item, category: `clothing-${category}` });
    });
  });
  
  return productMap;
}

/**
 * Parse price string to number
 * Examples: "NPR 1200" -> 1200, "NPR 1,300" -> 1300
 */
export function parsePrice(priceString: string): number {
  // Remove currency prefix, commas, and whitespace
  const numericString = priceString.replace(/[^\d]/g, '');
  const price = parseInt(numericString, 10);
  
  if (isNaN(price)) {
    throw new Error(`Invalid price format: ${priceString}`);
  }
  
  return price;
}

/**
 * Format number as price string
 */
export function formatPrice(price: number): string {
  return `NPR ${price.toLocaleString()}`;
}

/**
 * Get product by ID
 */
export function getProductById(productId: string): Product | null {
  const products = getAllProducts();
  return products.get(productId) || null;
}

/**
 * Calculate order total from items
 */
export interface OrderItem {
  id: string;
  name: string;
  price: string | number;
  quantity: number;
  image?: string;
}

export function calculateOrderTotal(items: OrderItem[]): {
  success: boolean;
  total: number;
  error?: string;
  breakdown?: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
} {
  try {
    const products = getAllProducts();
    let total = 0;
    const breakdown: Array<{
      productId: string;
      productName: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }> = [];
    
    for (const item of items) {
      // Validate quantity
      if (!item.quantity || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
        return {
          success: false,
          total: 0,
          error: `Invalid quantity for product ${item.id}`,
        };
      }
      
      // Get product from catalog
      const product = products.get(item.id);
      
      if (!product) {
        return {
          success: false,
          total: 0,
          error: `Product not found: ${item.id}`,
        };
      }
      
      // Parse the actual price from catalog (not from client)
      const unitPrice = parsePrice(product.price);
      const subtotal = unitPrice * item.quantity;
      
      breakdown.push({
        productId: item.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice,
        subtotal,
      });
      
      total += subtotal;
    }
    
    return {
      success: true,
      total,
      breakdown,
    };
  } catch (error) {
    return {
      success: false,
      total: 0,
      error: error instanceof Error ? error.message : 'Failed to calculate total',
    };
  }
}
