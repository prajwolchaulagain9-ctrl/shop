/**
 * Product pricing utilities
 */

import { slippers, clothing, collections } from '@/src/data/products';

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

  // Add collections
  collections.forEach((item) => {
    productMap.set(item.id, { ...item, category: 'collections' });
  });
  
  return productMap;
}

/**
 * Parse price string to number
 * Examples: "NPR 1200" -> 1200, "NPR 1,300" -> 1300
 */
export function parsePrice(priceString: string): number {
  const match = priceString.match(/\d[\d,]*/);
  const numericString = match ? match[0].replace(/,/g, '') : '';
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
  id?: string;
  productId?: string;
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
      const productId = item.id ?? item.productId;

      if (!productId) {
        return {
          success: false,
          total: 0,
          error: 'Product ID missing from order item',
        };
      }

      // Validate quantity
      if (!item.quantity || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
        return {
          success: false,
          total: 0,
          error: `Invalid quantity for product ${productId}`,
        };
      }
      
      // Get product from catalog
      const product = products.get(productId);
      
      if (!product) {
        return {
          success: false,
          total: 0,
          error: `Product not found: ${productId}`,
        };
      }
      
      // Parse the actual price from catalog (not from client)
      const unitPrice = parsePrice(product.price);
      const subtotal = unitPrice * item.quantity;
      
      breakdown.push({
        productId,
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

/**
 * Build trusted order items from the server catalog.
 * Never persist client-supplied product names, prices, or image paths.
 */
export function buildValidatedOrderItems(items: OrderItem[]): {
  success: boolean;
  items: Array<{
    productId: string;
    name: string;
    price: string;
    image: string;
    quantity: number;
  }>;
  error?: string;
} {
  const products = getAllProducts();
  const validatedItems: Array<{
    productId: string;
    name: string;
    price: string;
    image: string;
    quantity: number;
  }> = [];

  for (const item of items) {
    const productId = item.id ?? item.productId;

    if (!productId) {
      return { success: false, items: [], error: 'Product ID missing from order item' };
    }

    if (!item.quantity || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
      return { success: false, items: [], error: `Invalid quantity for product ${productId}` };
    }

    const product = products.get(productId);

    if (!product) {
      return { success: false, items: [], error: `Product not found: ${productId}` };
    }

    validatedItems.push({
      productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: item.quantity,
    });
  }

  return { success: true, items: validatedItems };
}
