// JavaScript version for direct execution with Node.js
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config();

// Also try to load .env.local if it exists
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  require('dotenv').config({ path: envLocalPath });
}

// MongoDB connection
async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: false },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, required: false },
  resetPasswordToken: { type: String, required: false },
  resetPasswordExpires: { type: Date, required: false },
}, {
  timestamps: true,
});

UserSchema.index({ email: 1 });
UserSchema.index({ verificationToken: 1 });
UserSchema.index({ resetPasswordToken: 1 });

// OTP Schema
const OTPSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  verified: { type: Boolean, default: false },
}, {
  timestamps: true,
});

OTPSchema.index({ email: 1 });
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Cart Schema
const CartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1, min: 1 },
}, { _id: false });

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: false },
  sessionId: { type: String, required: true },
  items: { type: [CartItemSchema], default: [] },
}, {
  timestamps: true,
});

CartSchema.index({ userId: 1 });
CartSchema.index({ sessionId: 1 });

// Order Schema
const OrderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1, min: 1 },
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: false },
  sessionId: { type: String, required: true },
  items: { type: [OrderItemSchema], default: [] },
  totalAmount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['cod', 'esewa', 'khalti', 'bank'],
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'verified', 'failed'],
    default: 'pending',
    required: true 
  },
  transactionId: { type: String, required: false },
  customerDetails: {
    name: { type: String, required: false },
    email: { type: String, required: false },
    phone: { type: String, required: false },
    address: { type: String, required: false },
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
    required: true
  },
}, {
  timestamps: true,
});

OrderSchema.index({ userId: 1 });
OrderSchema.index({ sessionId: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ createdAt: -1 });

// Create models
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const OTP = mongoose.models.OTP || mongoose.model('OTP', OTPSchema);
const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema);
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

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
    if (collections.length === 0) {
      console.log('   (No collections found)');
    } else {
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    }
    console.log('');

    // Ensure collections exist by creating indexes
    console.log('🔨 Creating/Ensuring collections and indexes...\n');

    // Helper function to safely create indexes
    async function safeCreateIndexes(model, collectionName) {
      try {
        await model.createIndexes();
        console.log(`   ✅ ${collectionName} collection and indexes created`);
      } catch (error) {
        if (error.code === 86) {
          // Index already exists with different specs - this is okay
          console.log(`   ℹ️  ${collectionName} indexes already exist (skipped)`);
        } else {
          throw error;
        }
      }
    }

    // User collection
    console.log('👤 User collection:');
    await safeCreateIndexes(User, 'Users');

    // OTP collection
    console.log('🔐 OTP collection:');
    await safeCreateIndexes(OTP, 'OTPs');

    // Cart collection
    console.log('🛒 Cart collection:');
    await safeCreateIndexes(Cart, 'Carts');

    // Order collection
    console.log('📦 Order collection:');
    await safeCreateIndexes(Order, 'Orders');

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
