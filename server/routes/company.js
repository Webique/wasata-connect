import express from 'express';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get company profile
router.get('/me', authenticate, requireRole('company'), async (req, res) => {
  try {
    const company = await Company.findOne({ ownerUserId: req.user._id });
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ error: 'Failed to get company' });
  }
});

// Get company's jobs
router.get('/me/jobs', authenticate, requireRole('company'), async (req, res) => {
  try {
    const company = await Company.findOne({ ownerUserId: req.user._id });
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const jobs = await Job.find({ companyId: company._id })
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error('Get company jobs error:', error);
    res.status(500).json({ error: 'Failed to get jobs' });
  }
});

// Create job (only if approved)
router.post('/jobs', authenticate, requireRole('company'), async (req, res) => {
  try {
    const company = await Company.findOne({ ownerUserId: req.user._id });
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    if (company.approvalStatus !== 'approved') {
      return res.status(403).json({ 
        error: 'Company must be approved before posting jobs',
        approvalStatus: company.approvalStatus
      });
    }

    const { title, workingHours, qualification, skills, minSalary, healthInsurance } = req.body;

    if (!title || !workingHours || !qualification || !minSalary) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Convert skills string to array if needed
    const skillsArray = Array.isArray(skills) 
      ? skills 
      : typeof skills === 'string' 
        ? skills.split(',').map(s => s.trim()).filter(s => s)
        : [];

    const job = new Job({
      companyId: company._id,
      title,
      workingHours,
      qualification,
      skills: skillsArray,
      minSalary: Number(minSalary),
      healthInsurance: Boolean(healthInsurance),
      status: 'active'
    });

    await job.save();

    res.status(201).json({
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// Update job
router.put('/jobs/:id', authenticate, requireRole('company'), async (req, res) => {
  try {
    const company = await Company.findOne({ ownerUserId: req.user._id });
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this job' });
    }

    const { title, workingHours, qualification, skills, minSalary, healthInsurance, status } = req.body;

    if (title) job.title = title;
    if (workingHours) job.workingHours = workingHours;
    if (qualification) job.qualification = qualification;
    if (skills !== undefined) {
      job.skills = Array.isArray(skills) 
        ? skills 
        : typeof skills === 'string' 
          ? skills.split(',').map(s => s.trim()).filter(s => s)
          : [];
    }
    if (minSalary !== undefined) job.minSalary = Number(minSalary);
    if (healthInsurance !== undefined) job.healthInsurance = Boolean(healthInsurance);
    if (status) job.status = status;

    await job.save();

    res.json({
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// Delete job
router.delete('/jobs/:id', authenticate, requireRole('company'), async (req, res) => {
  try {
    const company = await Company.findOne({ ownerUserId: req.user._id });
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this job' });
    }

    await job.deleteOne();

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

// Get applicants for a job
router.get('/jobs/:id/applicants', authenticate, requireRole('company'), async (req, res) => {
  try {
    const company = await Company.findOne({ ownerUserId: req.user._id });
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to view applicants for this job' });
    }

    const applications = await Application.find({ jobId: job._id })
      .populate('applicantUserId', 'name phone email')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get applicants error:', error);
    res.status(500).json({ error: 'Failed to get applicants' });
  }
});

export default router;

