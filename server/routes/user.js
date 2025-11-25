import express from 'express';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get current user profile
router.get('/', authenticate, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      disabilityType: user.disabilityType
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update current user profile
router.put('/', authenticate, async (req, res) => {
  try {
    const { name, phone, email, disabilityType } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (disabilityType && req.user.role === 'user') {
      user.disabilityType = disabilityType;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        disabilityType: user.disabilityType
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user's applications
router.get('/applications', authenticate, requireRole('user'), async (req, res) => {
  try {
    const applications = await Application.find({ applicantUserId: req.user._id })
      .populate('jobId', 'title companyId')
      .populate({
        path: 'jobId',
        populate: {
          path: 'companyId',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Create application
router.post('/applications', authenticate, requireRole('user'), async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: 'Job ID required' });
    }

    // Check if user has CV saved
    if (!req.user.cvUrl) {
      return res.status(400).json({ error: 'CV not found. Please upload your CV in your profile.' });
    }

    // Check if job exists and is active
    const job = await Job.findById(jobId).populate('companyId');
    if (!job || job.status !== 'active') {
      return res.status(404).json({ error: 'Job not found or closed' });
    }

    if (job.companyId.approvalStatus !== 'approved' || job.approvalStatus !== 'approved') {
      return res.status(400).json({ error: 'Cannot apply to this job' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      jobId,
      applicantUserId: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'Already applied to this job' });
    }

    // Create application using saved CV
    const application = new Application({
      jobId,
      applicantUserId: req.user._id,
      applicantName: req.user.name,
      applicantPhone: req.user.phone,
      applicantDisabilityType: req.user.disabilityType,
      cvUrl: req.user.cvUrl, // Use saved CV from user profile
      status: 'submitted'
    });

    await application.save();

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

export default router;

