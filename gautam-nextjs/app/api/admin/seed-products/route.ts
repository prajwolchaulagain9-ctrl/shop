import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Product from '@/lib/models/Product';
import { slippers, clothing, collections } from '@/src/data/products';

export async function GET() {
  try {
    await dbConnect();
    
    // Clear existing products if needed? Let's just add if the DB is empty or insert all.
    // For safety, let's clear all first, or just insert them.
    await Product.deleteMany({});
    
    const newProducts: any[] = [];
    
    // Process slippers
    for (const [subCategory, items] of Object.entries(slippers)) {
      for (const item of items) {
        newProducts.push({
          name: item.name,
          price: item.price,
          description: item.description,
          image: item.image,
          category: 'slippers',
          subCategory: subCategory,
          isAvailable: true,
        });
      }
    }
    
    // Process clothing
    for (const [subCategory, items] of Object.entries(clothing)) {
      for (const item of items) {
        newProducts.push({
          name: item.name,
          price: item.price,
          description: item.description,
          image: item.image,
          category: 'clothing',
          subCategory: subCategory,
          isAvailable: true,
        });
      }
    }
    
    // Process collections
    for (const item of collections) {
      newProducts.push({
        name: item.name,
        price: item.price,
        description: item.description,
        image: item.image,
        category: 'collections',
        subCategory: '',
        isAvailable: true,
      });
    }
    
    await Product.insertMany(newProducts);
    
    return NextResponse.json({ success: true, message: 'Products seeded successfully', count: newProducts.length });
  } catch (error: any) {
    console.error('Error seeding products:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
