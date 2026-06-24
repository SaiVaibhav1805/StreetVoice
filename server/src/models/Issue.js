import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'in progress', 'resolved', 'rejected'],
      default: 'pending',
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    ward: {
      type: Number,
    },
    images: [
      {
        type: String,
      },
    ],
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    upvotesCount: {
      type: Number,
      default: 0,
    },
    verifications: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['verified', 'rejected'] },
        comments: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    verificationsCount: {
      type: Number,
      default: 0,
    },
    aiAnalysis: {
      category: String,
      severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
      spamLikelihood: Number,
      isDuplicate: Boolean,
      confidence: Number,
    },
    history: [
      {
        status: String,
        comments: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Geo-spatial Indexing for quick nearby map queries
IssueSchema.index({ location: '2dsphere' });

const Issue = mongoose.model('Issue', IssueSchema);
export default Issue;
