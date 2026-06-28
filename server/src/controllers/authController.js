import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// In-memory OTP storage
const otpStore = new Map();

// Helper to generate a random 6-digit OTP
const generateRandomOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// POST /api/auth/send-otp
export const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || phone.length < 10) {
      return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }

    const otp = generateRandomOTP();
    otpStore.set(phone, otp);

    console.log(`[AUTH] Mock OTP sent to phone number +91${phone}: ${otp}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully (Simulated)',
      otp // returned directly for easier development and testing
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

// POST /api/auth/verify
export const verifyAndLogin = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    const storedOtp = otpStore.get(phone);
    
    // Accept either the generated OTP or the master OTP '123456' for convenience
    if (otp !== '123456' && otp !== storedOtp) {
      return res.status(401).json({ success: false, message: 'Invalid OTP' });
    }

    otpStore.delete(phone);

    // Find or create user in our DB
    let user = await User.findOne({ phone });

    if (!user) {
      // First time login — create account
      user = await User.create({ phone });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Issue our own JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        ward: user.ward,
        xp: user.xp,
        badges: user.badges,
        isNewUser: !user.name  // flag to show profile setup screen
      }
    });

  } catch (error) {
    console.error('Auth verify error:', error);
    res.status(500).json({ success: false, message: 'Authentication verification failed' });
  }
};

// Update profile (name, ward) — called after first login
export const updateProfile = async (req, res) => {
  try {
    const { name, ward } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, ward },
      { new: true }
    );
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Profile update failed' });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-__v');
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};