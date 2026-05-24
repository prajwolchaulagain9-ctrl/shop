import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Must import or define the model
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

import { slippers, clothing, collections } from '../src/data/products';

async function seed() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not found');

    await mongoose.connect(uri);
    console.log('Connected to DB');

    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    const newProducts: any[] = [];
    
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
    console.log(`Seeded ${newProducts.length} products`);
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();
