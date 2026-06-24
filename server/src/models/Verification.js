import mongoose from 'mongoose';

const VerificationSchema = new mongoose.Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['verified', 'rejected'],
      required: true,
    },
    comments: {
      type: String,
      trim: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude] of where verification was submitted (to verify GPS match)
    },
    isGPSTrusted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Verification = mongoose.model('Verification', VerificationSchema);
export default Verification;
