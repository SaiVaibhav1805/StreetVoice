import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true,
    unique: true
  },
  phone: {
    type: String,
    trim: true,
    sparse: true,
    unique: true
  },
  password: {
    type: String,
    select: false
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'phone_otp'],
    default: 'local'
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

// Compare password helper method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);