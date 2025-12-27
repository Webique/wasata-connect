import mongoose from 'mongoose';

const blockedSchema = new mongoose.Schema({
  phone: {
    type: String,
    default: null,
    trim: true
  },
  email: {
    type: String,
    default: null,
    trim: true,
    lowercase: true
  },
  reason: {
    type: String,
    default: 'Blocked by admin'
  },
  blockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blockedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster lookups
blockedSchema.index({ phone: 1 });
blockedSchema.index({ email: 1 });

export default mongoose.model('Blocked', blockedSchema);



