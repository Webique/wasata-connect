import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  ownerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  mapsUrl: {
    type: String,
    required: true,
    trim: true
  },
  crNumber: {
    type: String,
    required: true,
    trim: true
  },
  crDocUrl: {
    type: String,
    required: true
  },
  mowaamaDocUrl: {
    type: String,
    default: null
  },
  location: {
    type: String,
    default: null
    // City/location in Saudi Arabia (e.g., 'riyadh', 'jeddah')
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export default mongoose.model('Company', companySchema);

