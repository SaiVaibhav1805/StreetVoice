import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    trim: true,
    default: ''
  },
  role: {
    type: String,
    enum: ['citizen', 'authority', 'moderator'],
    default: 'citizen'
  },
  ward: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },

  // Gamification
  xp: {
    type: Number,
    default: 0
  },
  badges: [{
    type: String
  }],
  issuesReported: {
    type: Number,
    default: 0
  },
  issuesVerified: {
    type: Number,
    default: 0
  },

  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);