import mongoose from 'mongoose';
import connectDB from '../lib/db/connect';
import User from '../lib/models/User';
import OTP from '../lib/models/OTP';
import Cart from '../lib/models/Cart';
import Order from '../lib/models/Order';

async function initializeDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Get database instance
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    // List existing collections
    console.log('📋 Existing collections:');
    const collections = await db.listCollections().toArray();
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    console.log('');

    // Ensure collections exist by creating indexes
    console.log('🔨 Creating/Ensuring collections and indexes...\n');

    // User collection
    console.log('👤 User collection:');
    await User.createIndexes();
    console.log('   ✅ Users collection and indexes created');

    // OTP collection
    console.log('🔐 OTP collection:');
    await OTP.createIndexes();
    console.log('   ✅ OTPs collection and indexes created');

    // Cart collection
    console.log('🛒 Cart collection:');
    await Cart.createIndexes();
    console.log('   ✅ Carts collection and indexes created');

    // Order collection
    console.log('📦 Order collection:');
    await Order.createIndexes();
    console.log('   ✅ Orders collection and indexes created');

    // Display collection stats
    console.log('\n📊 Collection Statistics:');
    
    const userCount = await User.countDocuments();
    console.log(`   Users: ${userCount} document(s)`);
    
    const otpCount = await OTP.countDocuments();
    console.log(`   OTPs: ${otpCount} document(s)`);
    
    const cartCount = await Cart.countDocuments();
    console.log(`   Carts: ${cartCount} document(s)`);
    
    const orderCount = await Order.countDocuments();
    console.log(`   Orders: ${orderCount} document(s)`);

    // List all collections after initialization
    console.log('\n📋 All collections in database:');
    const updatedCollections = await db.listCollections().toArray();
    updatedCollections.forEach(col => {
      console.log(`   - ${col.name}`);
    });

    console.log('\n✅ Database initialization completed successfully!');
    console.log('🎉 All collections and indexes are ready to use.\n');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run initialization
initializeDatabase();
