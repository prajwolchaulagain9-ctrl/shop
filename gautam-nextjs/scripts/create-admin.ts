import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gautam-ecommerce';

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.model('User', new mongoose.Schema({
      firstName: String,
      lastName: String,
      email: { type: String, unique: true },
      phone: String,
      password: String,
      isEmailVerified: { type: Boolean, default: false },
      role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    }, { timestamps: true }));

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@gautamlady.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      await mongoose.disconnect();
      return;
    }

    // Hash password
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
    console.log('✓ Admin user created successfully');
    console.log('Email: admin@gautamlady.com');
    console.log('Password: AdminPassword123!');
    console.log('\nIMPORTANT: Change this password immediately after first login!');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
