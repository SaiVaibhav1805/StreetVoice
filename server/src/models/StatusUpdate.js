import mongoose from 'mongoose';

const statusUpdateSchema = new mongoose.Schema({
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  previousStatus: {
    type: String,
    enum: ['reported', 'verified', 'assigned', 'in_progress', 'resolved'],
    required: true
  },
  newStatus: {
    type: String,
    enum: ['reported', 'verified', 'assigned', 'in_progress', 'resolved'],
    required: true
  },
  note: {
    type: String,
    trim: true,
    default: ''
  },
  estimatedResolution: {
    type: Date,
    default: null
  }
}, { timestamps: true });

const StatusUpdate = mongoose.model('StatusUpdate', statusUpdateSchema);
export default StatusUpdate;