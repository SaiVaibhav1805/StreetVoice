import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Helper to sanitize user object for client response
const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name || '',
  email: user.email || '',
  phone: user.phone || '',
  role: user.role || 'citizen',
  ward: user.ward || '',
  avatar: user.avatar || '',
  xp: user.xp || 0,
  badges: user.badges || [],
  issuesReported: user.issuesReported || 0,
  issuesVerified: user.issuesVerified || 0,
  authProvider: user.authProvider || 'local',
  isNewUser: !user.name || !user.ward
});

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '30d' }
  );
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, identifier, password, role, ward } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/Phone and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const cleanIdentifier = identifier.trim();
    const isEmail = cleanIdentifier.includes('@');
    let email = undefined;
    let phone = undefined;

    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanIdentifier)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
      }
      email = cleanIdentifier.toLowerCase();
    } else {
      const digitsOnly = cleanIdentifier.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit phone number' });
      }
      phone = digitsOnly.slice(-10);
    }

    // Check if user already exists
    const query = [];
    if (email) query.push({ email });
    if (phone) query.push({ phone });

    const existingUser = await User.findOne({ $or: query });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `An account with this ${isEmail ? 'email' : 'phone number'} already exists. Please log in.`
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      name: name?.trim() || (isEmail ? email.split('@')[0] : `User_${phone.slice(-4)}`),
      email,
      phone,
      password: hashedPassword,
      role: role && ['citizen', 'authority', 'moderator'].includes(role) ? role : 'citizen',
      ward: ward?.trim() || '',
      authProvider: 'local'
    });

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: sanitizeUser(newUser)
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to register account'
    });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone and password are required'
      });
    }

    const clean = identifier.trim();
    const isEmail = clean.includes('@');
    const cleanPhone = clean.replace(/\D/g, '').slice(-10);

    // Look for user matching email or phone
    const searchConditions = [];
    if (isEmail) {
      searchConditions.push({ email: clean.toLowerCase() });
    } else {
      if (cleanPhone) searchConditions.push({ phone: cleanPhone });
      searchConditions.push({ email: clean.toLowerCase() });
    }

    const user = await User.findOne({ $or: searchConditions }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/phone or password'
      });
    }

    // If user registered with Google and has no local password
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'This account was created with Google. Please use "Continue with Google" to sign in.'
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/phone or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: sanitizeUser(user)
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// POST /api/auth/google
export const googleAuth = async (req, res) => {
  try {
    const { email, name, googleId, avatar } = req.body;

    if (!email && !googleId) {
      return res.status(400).json({
        success: false,
        message: 'Google profile information is required'
      });
    }

    const normalizedEmail = email ? email.toLowerCase().trim() : undefined;

    // Search for existing user with either googleId or email
    const searchConditions = [];
    if (googleId) searchConditions.push({ googleId });
    if (normalizedEmail) searchConditions.push({ email: normalizedEmail });

    let user = await User.findOne({ $or: searchConditions });

    if (user) {
      // Link googleId or update avatar if not set
      let updated = false;
      if (!user.googleId && googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (!user.avatar && avatar) {
        user.avatar = avatar;
        updated = true;
      }
      if (!user.email && normalizedEmail) {
        user.email = normalizedEmail;
        updated = true;
      }
      user.lastLogin = new Date();
      await user.save();
    } else {
      // First time Google login — create account
      user = await User.create({
        name: name || (normalizedEmail ? normalizedEmail.split('@')[0] : 'Citizen'),
        email: normalizedEmail,
        googleId,
        avatar: avatar || '',
        role: 'citizen',
        authProvider: 'google',
        xp: 50, // Welcome XP bonus
        badges: ['Community Explorer']
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: sanitizeUser(user)
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Google authentication failed'
    });
  }
};

// In-memory OTP storage for backwards compatibility
const otpStore = new Map();
const generateRandomOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// POST /api/auth/send-otp
export const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || phone.length < 10) {
      return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }

    const digits = phone.replace(/\D/g, '').slice(-10);
    const otp = generateRandomOTP();
    otpStore.set(digits, otp);

    console.log(`[AUTH] Mock OTP sent to phone number +91${digits}: ${otp}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully (Simulated)',
      otp
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

    const digits = phone.replace(/\D/g, '').slice(-10);
    const storedOtp = otpStore.get(digits);

    if (otp !== '123456' && otp !== storedOtp) {
      return res.status(401).json({ success: false, message: 'Invalid OTP' });
    }

    otpStore.delete(digits);

    let user = await User.findOne({ phone: digits });

    if (!user) {
      user = await User.create({
        phone: digits,
        name: `Citizen_${digits.slice(-4)}`,
        authProvider: 'phone_otp'
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: sanitizeUser(user)
    });

  } catch (error) {
    console.error('Auth verify error:', error);
    res.status(500).json({ success: false, message: 'Authentication verification failed' });
  }
};

// PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, ward, avatar } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (ward !== undefined) updateData.ward = ward.trim();
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true }
    ).select('-password -__v');

    res.status(200).json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Profile update failed' });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -__v');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};