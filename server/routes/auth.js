import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Company from '../models/Company.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is missing. Please set JWT_SECRET environment variable.');
  process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET;

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Register User (Job Seeker)
router.post('/register-user', async (req, res) => {
  try {
    const { name, phone, email, password, disabilityType, cvUrl, location } = req.body;

    if (!name || !phone || !password || !disabilityType || !cvUrl || !location) {
      return res.status(400).json({ error: 'Missing required fields (name, phone, password, disabilityType, cvUrl, location)' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    // Create user
    const user = new User({
      role: 'user',
      name,
      phone,
      email: email || null,
      passwordHash: password, // Will be hashed by pre-save hook
      disabilityType,
      cvUrl, // CV saved during registration
      location,
      status: 'active'
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        disabilityType: user.disabilityType,
        cvUrl: user.cvUrl
      }
    });
  } catch (error) {
    console.error('Register user error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Register Company
router.post('/register-company', async (req, res) => {
  try {
    const { 
      name, 
      phone, 
      email, 
      password, 
      crNumber, 
      crDocUrl, 
      mapsUrl, 
      mowaamaDocUrl,
      location
    } = req.body;

    if (!name || !phone || !email || !password || !crNumber || !crDocUrl || !mapsUrl || !location) {
      return res.status(400).json({ error: 'Missing required fields (including location)' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ phone }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Phone or email already registered' });
    }

    // Create user account for company
    const user = new User({
      role: 'company',
      name,
      phone,
      email,
      passwordHash: password,
      location,
      status: 'active'
    });

    await user.save();

    // Create company profile
    const company = new Company({
      ownerUserId: user._id,
      name,
      phone,
      email,
      crNumber,
      crDocUrl,
      mapsUrl,
      mowaamaDocUrl: mowaamaDocUrl || null,
      location,
      approvalStatus: 'pending'
    });

    await company.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Company registered successfully. Awaiting admin approval.',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role
      },
      company: {
        id: company._id,
        approvalStatus: company.approvalStatus
      }
    });
  } catch (error) {
    console.error('Register company error:', error);
    res.status(500).json({ error: 'Failed to register company' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { phone, email, password } = req.body;

    if (!password || (!phone && !email)) {
      return res.status(400).json({ error: 'Phone/email and password required' });
    }

    // Find user by phone or email
    const user = await User.findOne(
      phone ? { phone } : { email: email?.toLowerCase() }
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status !== 'active') {
      return res.status(401).json({ error: 'Account is disabled' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    // Get company info if role is company
    let company = null;
    if (user.role === 'company') {
      company = await Company.findOne({ ownerUserId: user._id });
    }

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        disabilityType: user.disabilityType,
        location: user.location,
        cvUrl: user.cvUrl
      },
      company: company ? {
        id: company._id,
        approvalStatus: company.approvalStatus
      } : null
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = req.user;
    let company = null;

    if (user.role === 'company') {
      company = await Company.findOne({ ownerUserId: user._id });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        disabilityType: user.disabilityType,
        location: user.location,
        cvUrl: user.cvUrl
      },
      company: company ? {
        id: company._id,
        name: company.name,
        approvalStatus: company.approvalStatus
      } : null
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

export default router;

