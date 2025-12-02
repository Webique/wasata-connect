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

    const { title, workingHours, qualification, skills, minSalary, healthInsurance, natureOfWork, location, disabilityTypes } = req.body;

    if (!title || !workingHours || !qualification || !minSalary || !natureOfWork || !location || !disabilityTypes || disabilityTypes.length === 0) {
      return res.status(400).json({ error: 'Missing required fields (title, workingHours, qualification, minSalary, natureOfWork, location, disabilityTypes)' });
    }

    // Convert skills string to array if needed
    const skillsArray = Array.isArray(skills) 
      ? skills 
      : typeof skills === 'string' 
        ? skills.split(',').map(s => s.trim()).filter(s => s)
        : [];

    // Convert disabilityTypes to array if needed
    const disabilityTypesArray = Array.isArray(disabilityTypes)
      ? disabilityTypes
      : typeof disabilityTypes === 'string'
        ? disabilityTypes.split(',').map(d => d.trim()).filter(d => d)
        : [];

    const job = new Job({
      companyId: company._id,
      title,
      workingHours,
      qualification,
      skills: skillsArray,
      minSalary: Number(minSalary),
      healthInsurance: Boolean(healthInsurance),
      natureOfWork,
      location,
      disabilityTypes: disabilityTypesArray,
      approvalStatus: 'pending', // Jobs need admin approval
      status: 'active'
    });

    await job.save();

    res.status(201).json({
      message: 'Job created successfully. Awaiting admin approval.',
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

    const { title, workingHours, qualification, skills, minSalary, healthInsurance, natureOfWork, location, disabilityTypes, status } = req.body;

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
    if (natureOfWork) job.natureOfWork = natureOfWork;
    if (location) job.location = location;
    if (disabilityTypes !== undefined) {
      job.disabilityTypes = Array.isArray(disabilityTypes) 
        ? disabilityTypes 
        : typeof disabilityTypes === 'string'
          ? disabilityTypes.split(',').map(d => d.trim()).filter(d => d)
          : [];
    }
    if (status) job.status = status;
    
    // If job is being edited after rejection, reset approval status to pending
    if (job.approvalStatus === 'rejected') {
      job.approvalStatus = 'pending';
      job.rejectionReason = null;
    }

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

// Update application status
router.put('/applications/:id/status', authenticate, requireRole('company'), async (req, res) => {
  try {
    const company = await Company.findOne({ ownerUserId: req.user._id });
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const application = await Application.findById(req.params.id).populate('jobId');
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Verify the job belongs to the company
    if (application.jobId.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this application' });
    }

    const { status } = req.body;
    if (!status || !['submitted', 'reviewed', 'shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be one of: submitted, reviewed, shortlisted, rejected' });
    }

    application.status = status;
    await application.save();

    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

export default router;

