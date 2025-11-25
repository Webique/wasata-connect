import express from 'express';
import Job from '../models/Job.js';
import Company from '../models/Company.js';

const router = express.Router();

// Get all active jobs (public)
router.get('/', async (req, res) => {
  try {
    const { search, companyId } = req.query;

    const query = { status: 'active' };

    if (companyId) {
      query.companyId = companyId;
    }

    let jobs = await Job.find(query)
      .populate('companyId', 'name approvalStatus')
      .sort({ createdAt: -1 });

    // Filter by company approval status
    jobs = jobs.filter(job => 
      job.companyId && job.companyId.approvalStatus === 'approved'
    );

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      jobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchLower) ||
        job.qualification.toLowerCase().includes(searchLower) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchLower))
      );
    }

    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Get single job (public)
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('companyId', 'name email phone mapsUrl approvalStatus');

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if company is approved
    if (job.companyId.approvalStatus !== 'approved') {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

export default router;

