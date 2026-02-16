const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gautam-ecommerce';

async function createAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    const UserSchema = new mongoose.Schema({
      firstName: String,
      lastName: String,
      email: { type: String, unique: true },
      phone: String,
      password: String,
      isEmailVerified: { type: Boolean, default: false },
      role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    }, { timestamps: true });

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@gautamlady.com' });
    if (existingAdmin) {
      console.log('⚠ Admin user already exists');
      await mongoose.disconnect();
      return;
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcryptjs.hash('AdminPassword123!', 10);

    // Create admin user
    const admin = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@gautamlady.com',
      phone: '+977-9800000000',
      password: hashedPassword,
      isEmailVerified: true,
      role: 'admin',
    });

    await admin.save();
    console.log('\n✓ Admin user created successfully!\n');
    console.log('Login Credentials:');
    console.log('─'.repeat(40));
    console.log('Email:    admin@gautamlady.com');
    console.log('Password: AdminPassword123!');
    console.log('─'.repeat(40));
    console.log('\n⚠ IMPORTANT: Change this password immediately after first login!\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('✗ Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin();
