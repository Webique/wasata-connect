import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wasata-connect';

async function updateAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find admin user (by role - should find the existing one)
    let admin = await User.findOne({ role: 'admin' });

    if (!admin) {
      console.log('❌ No admin user found. Creating new admin...');
      admin = new User({
        role: 'admin',
        name: 'Admin User',
        phone: '0500000000',
        email: 'm3aqjob@gmail.com',
        passwordHash: 'Watyn05534', // Will be hashed by pre-save hook
        location: 'riyadh',
        status: 'active'
      });
      await admin.save();
      console.log('✅ New admin created');
    } else {
      console.log('👤 Found admin user:', admin.name);
      console.log('📧 Current email:', admin.email);
      
      // Update email and password
      admin.email = 'm3aqjob@gmail.com';
      admin.passwordHash = 'Watyn05534'; // Will be hashed by pre-save hook
      admin.role = 'admin'; // Ensure role is admin
      admin.status = 'active'; // Ensure status is active
      
      // Mark password as modified to trigger hashing
      admin.markModified('passwordHash');
      
      await admin.save();
      console.log('✅ Admin updated successfully!');
    }
    
    console.log('📧 Email: m3aqjob@gmail.com');
    console.log('🔑 Password: Watyn05534');
    console.log('ℹ️  All other data remains unchanged');

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateAdmin();

