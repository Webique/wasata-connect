import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

dotenv.config();

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing. Please set MONGODB_URI environment variable.');
  process.exit(1);
}

const MONGODB_URI = process.env.MONGODB_URI;

// Disability types in Arabic
const DISABILITY_TYPES = [
  'الإعاقة البصرية',
  'الإعاقة السمعية',
  'الإعاقة العقلية',
  'الإعاقة الجسمية والحركية',
  'اضطرابات النطق والكلام',
  'صعوبات التعلم',
  'الاضطرابات السلوكية والانفعالية',
  'التوحد',
  'الإعاقات المزدوجة والمتعددة'
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Company.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create Admin User
    console.log('👤 Creating admin user...');
    const admin = new User({
      role: 'admin',
      name: 'Admin User',
      phone: '0500000000',
      email: 'admin@wasata.com',
      passwordHash: 'admin123', // Will be hashed by pre-save hook
      status: 'active'
    });
    await admin.save();
    console.log('✅ Admin created - Email: admin@wasata.com, Password: admin123');

    // Create Test Users (Job Seekers)
    console.log('👥 Creating test users...');
    const users = [];
    for (let i = 1; i <= 3; i++) {
      const user = new User({
        role: 'user',
        name: `Job Seeker ${i}`,
        phone: `050000000${i}`,
        email: `seeker${i}@test.com`,
        passwordHash: 'password123',
        disabilityType: DISABILITY_TYPES[i % DISABILITY_TYPES.length],
        cvUrl: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME || 'dummy-cloud'}/raw/upload/v1/wasata-connect/dummy-cv-${i}.pdf`,
        status: 'active'
      });
      await user.save();
      users.push(user);
      console.log(`✅ User ${i} created - Phone: ${user.phone}, Email: ${user.email}, Password: password123`);
    }

    // Create Companies
    console.log('🏢 Creating companies...');
    
    // Approved Company
    const approvedCompanyOwner = new User({
      role: 'company',
      name: 'Approved Company Owner',
      phone: '0501000000',
      email: 'approved@company.com',
      passwordHash: 'password123',
      status: 'active'
    });
    await approvedCompanyOwner.save();

    const approvedCompany = new Company({
      ownerUserId: approvedCompanyOwner._id,
      name: 'شركة موافق عليها',
      phone: '0501000000',
      email: 'approved@company.com',
      mapsUrl: 'https://maps.google.com/?q=riyadh',
      crNumber: 'CR123456',
      crDocUrl: '/uploads/dummy-cr.pdf',
      mowaamaDocUrl: '/uploads/dummy-mowaama.pdf',
      approvalStatus: 'approved'
    });
    await approvedCompany.save();
    console.log('✅ Approved company created - Email: approved@company.com, Password: password123');

    // Pending Company
    const pendingCompanyOwner = new User({
      role: 'company',
      name: 'Pending Company Owner',
      phone: '0502000000',
      email: 'pending@company.com',
      passwordHash: 'password123',
      status: 'active'
    });
    await pendingCompanyOwner.save();

    const pendingCompany = new Company({
      ownerUserId: pendingCompanyOwner._id,
      name: 'شركة قيد الانتظار',
      phone: '0502000000',
      email: 'pending@company.com',
      mapsUrl: 'https://maps.google.com/?q=riyadh',
      crNumber: 'CR789012',
      crDocUrl: '/uploads/dummy-cr2.pdf',
      approvalStatus: 'pending'
    });
    await pendingCompany.save();
    console.log('✅ Pending company created - Email: pending@company.com, Password: password123');

    // Create Jobs for Approved Company
    console.log('💼 Creating jobs...');
    const jobs = [];
    const jobTitles = [
      'مطور برمجيات',
      'مصمم جرافيك',
      'كاتب محتوى',
      'محاسب',
      'مدير مشروع'
    ];

    // Create mix of approved and pending jobs
    for (let i = 0; i < 5; i++) {
      const job = new Job({
        companyId: approvedCompany._id,
        title: jobTitles[i],
        workingHours: '8 ساعات يومياً',
        qualification: 'بكالوريوس في مجال ذي صلة',
        skills: ['مهارات التواصل', 'العمل الجماعي', 'الالتزام بالمواعيد'],
        minSalary: 5000 + (i * 1000),
        healthInsurance: i % 2 === 0,
        disabilityTypes: [
          DISABILITY_TYPES[i % DISABILITY_TYPES.length],
          DISABILITY_TYPES[(i + 1) % DISABILITY_TYPES.length] // Add 2 disability types per job
        ],
        approvalStatus: i < 3 ? 'approved' : 'pending', // First 3 approved, last 2 pending
        status: 'active'
      });
      await job.save();
      jobs.push(job);
      console.log(`✅ Job ${i + 1} created: ${job.title} (${job.approvalStatus})`);
    }

    // Create Applications (only for approved jobs)
    console.log('📝 Creating applications...');
    const approvedJobs = jobs.filter(job => job.approvalStatus === 'approved');
    for (let i = 0; i < Math.min(3, approvedJobs.length); i++) {
      const application = new Application({
        jobId: approvedJobs[i]._id,
        applicantUserId: users[i]._id,
        applicantName: users[i].name,
        applicantPhone: users[i].phone,
        applicantDisabilityType: users[i].disabilityType,
        cvUrl: users[i].cvUrl, // Use saved CV from user profile
        status: i === 0 ? 'submitted' : i === 1 ? 'reviewed' : 'shortlisted'
      });
      await application.save();
      console.log(`✅ Application ${i + 1} created for job: ${approvedJobs[i].title}`);
    }

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('Admin: admin@wasata.com / admin123');
    console.log('User: 0500000001 / password123');
    console.log('Approved Company: approved@company.com / password123');
    console.log('Pending Company: pending@company.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();

