import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  workingHours: {
    type: String,
    required: true,
    trim: true
  },
  qualification: {
    type: String,
    required: true,
    trim: true
  },
  skills: {
    type: [String],
    default: []
  },
  minSalary: {
    type: Number,
    required: true
  },
  healthInsurance: {
    type: Boolean,
    default: false
  },
  disabilityTypes: {
    type: [String],
    default: []
    // Array of disability types this job targets
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  }
}, {
  timestamps: true
});

export default mongoose.model('Job', jobSchema);

