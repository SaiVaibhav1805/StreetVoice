import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema({
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    required: true
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  photo: {
    url: String,
    cloudinaryId: String
  },
  comment: {
    type: String,
    trim: true,
    default: ''
  },
  location: {
    coordinates: [Number] // [lng, lat] of verifier
  }
}, { timestamps: true });

// One verification per user per issue
verificationSchema.index({ issue: 1, verifiedBy: 1 }, { unique: true });

const Verification = mongoose.model('Verification', verificationSchema);
export default Verification;