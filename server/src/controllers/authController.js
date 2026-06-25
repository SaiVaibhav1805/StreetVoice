import admin from '../config/firebase.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Called after Firebase OTP is verified on client
// Client sends the Firebase idToken to us
export const verifyAndLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'idToken is required' });
    }

    // Verify token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const phone = decodedToken.phone_number;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number not found in token' });
    }

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
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
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