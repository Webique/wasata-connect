import express from 'express';
import Company from '../models/Company.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Audit from '../models/Audit.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireRole('admin'));

// Helper to create audit log
const createAuditLog = async (actorId, action, meta, ip) => {
  try {
    await Audit.create({ actorId, action, meta, ip });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
};

// Get all companies
router.get('/companies', async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { approvalStatus: status } : {};

    const companies = await Company.find(query)
      .populate('ownerUserId', 'name phone email')
      .sort({ createdAt: -1 });

    res.json(companies);
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Approve company
router.put('/companies/:id/approve', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    company.approvalStatus = 'approved';
    await company.save();

    await createAuditLog(
      req.user._id,
      'approve_company',
      { companyId: company._id, companyName: company.name },
      req.ip
    );

    res.json({
      message: 'Company approved successfully',
      company
    });
  } catch (error) {
    console.error('Approve company error:', error);
    res.status(500).json({ error: 'Failed to approve company' });
  }
});

// Reject company
router.put('/companies/:id/reject', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    company.approvalStatus = 'rejected';
    await company.save();

    await createAuditLog(
      req.user._id,
      'reject_company',
      { companyId: company._id, companyName: company.name },
      req.ip
    );

    res.json({
      message: 'Company rejected',
      company
    });
  } catch (error) {
    console.error('Reject company error:', error);
    res.status(500).json({ error: 'Failed to reject company' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { search, role } = req.query;
    const query = {};

    if (role) {
      query.role = role;
    }

    let users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.phone.includes(search) ||
        (user.email && user.email.toLowerCase().includes(searchLower))
      );
    }

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Delete/Disable user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ error: 'Cannot delete admin user' });
    }

    // Soft delete - set status to disabled
    user.status = 'disabled';
    await user.save();

    await createAuditLog(
      req.user._id,
      'disable_user',
      { userId: user._id, userName: user.name },
      req.ip
    );

    res.json({ message: 'User disabled successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to disable user' });
  }
});

// Get all jobs
router.get('/jobs', async (req, res) => {
  try {
    const { companyId, status, approvalStatus } = req.query;
    const query = {};

    if (companyId) query.companyId = companyId;
    if (status) query.status = status;
    if (approvalStatus) query.approvalStatus = approvalStatus;

    const jobs = await Job.find(query)
      .populate('companyId', 'name approvalStatus email phone')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Approve job
router.put('/jobs/:id/approve', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('companyId');
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    job.approvalStatus = 'approved';
    await job.save();

    await createAuditLog(
      req.user._id,
      'approve_job',
      { jobId: job._id, jobTitle: job.title, companyName: job.companyId.name },
      req.ip
    );

    res.json({
      message: 'Job approved successfully',
      job
    });
  } catch (error) {
    console.error('Approve job error:', error);
    res.status(500).json({ error: 'Failed to approve job' });
  }
});

// Reject job
router.put('/jobs/:id/reject', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('companyId');
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    job.approvalStatus = 'rejected';
    await job.save();

    await createAuditLog(
      req.user._id,
      'reject_job',
      { jobId: job._id, jobTitle: job.title, companyName: job.companyId.name },
      req.ip
    );

    res.json({
      message: 'Job rejected',
      job
    });
  } catch (error) {
    console.error('Reject job error:', error);
    res.status(500).json({ error: 'Failed to reject job' });
  }
});

// Delete job
router.delete('/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    await job.deleteOne();

    await createAuditLog(
      req.user._id,
      'delete_job',
      { jobId: job._id, jobTitle: job.title },
      req.ip
    );

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

// Get all applications
router.get('/applications', async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('jobId', 'title companyId')
      .populate({
        path: 'jobId',
        populate: {
          path: 'companyId',
          select: 'name'
        }
      })
      .populate('applicantUserId', 'name phone email')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Get audit logs
router.get('/audit', async (req, res) => {
  try {
    const logs = await Audit.find()
      .populate('actorId', 'name role')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

export default router;

