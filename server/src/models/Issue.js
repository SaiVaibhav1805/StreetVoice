import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: String,
    enum: ['pothole', 'water_leakage', 'streetlight', 'garbage', 'sewage', 'road_damage', 'encroachment', 'other'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['reported', 'verified', 'assigned', 'in_progress', 'resolved'],
    default: 'reported'
  },

  // GeoJSON point for map queries
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: { type: String, default: '' },
    ward: { type: String, default: '' }
  },

  media: [{
    url: String,
    cloudinaryId: String,
    type: { type: String, enum: ['image', 'video'], default: 'image' }
  }],

  aiAnalysis: {
    category: String,
    severity: String,
    confidence: Number,
    summary: String,
    processedAt: Date
  },

  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  upvoteCount: {
    type: Number,
    default: 0
  },
  verificationCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  },

  estimatedResolution: { type: Date, default: null },
  resolvedAt: { type: Date, default: null },

}, { timestamps: true });

// Geo index for location-based queries
issueSchema.index({ location: '2dsphere' });
issueSchema.index({ status: 1 });
issueSchema.index({ category: 1 });

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;