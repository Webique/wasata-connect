import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicantUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicantName: {
    type: String,
    required: true,
    trim: true
  },
  applicantPhone: {
    type: String,
    required: true,
    trim: true
  },
  applicantDisabilityType: {
    type: String,
    required: true
  },
  cvUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['submitted', 'reviewed', 'shortlisted', 'rejected'],
    default: 'submitted'
  }
}, {
  timestamps: true
});

// Index for efficient queries
applicationSchema.index({ jobId: 1, applicantUserId: 1 });

export default mongoose.model('Application', applicationSchema);

