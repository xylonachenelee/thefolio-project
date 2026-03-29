// backend/routes/auth.routes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');
const router = express.Router();

// Helper function — generates a JWT token that expires in 7 days
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── POST /api/auth/register ───────────────────────────────────
// ── POST /api/auth/register ───────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password, birthday, gender, accountType } = req.body; // ADD ALL FIELDS
  const normalizedEmail = email.toLowerCase();
  
  console.log('📝 Register attempt for:', normalizedEmail);
  console.log('Full request body:', req.body); // Log everything
  
  try {
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      console.log('❌ Email already exists:', normalizedEmail);
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Determine role based on accountType
    const role = accountType === 'admin' ? 'admin' : 'member';
    
    console.log('✅ Creating new user with fields:', {
      name, email, birthday, gender, accountType, role
    });

    const user = await User.create({ 
      name, 
      email: normalizedEmail, 
      password,
      birthday,
      gender,
      accountType,
      role
    });
    
    console.log('✅ User created with ID:', user._id);
    console.log('✅ User role set to:', user.role);

    const token = generateToken(user._id);
    console.log('✅ Token generated');

    res.status(201).json({
      token,
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        accountType: user.accountType,
        profilePic: user.profilePic 
      }
    });
    console.log('✅ Response sent');
  } catch (err) {
    console.error('🔥 Registration error:', err);
    console.error('Error details:', err.errors); // Show validation errors
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────
// In auth.routes.js, at the very top of your login route:
router.post('/login', async (req, res) => {
    console.log('🔐 LOGIN ROUTE HIT');
    console.log('Headers:', req.headers);
    console.log('req.body is:', req.body);
    console.log('req.body type:', typeof req.body);
    
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase(); // normalize for lookup
  console.log('🔐 Login attempt for:', normalizedEmail);
  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log('❌ User not found for email:', normalizedEmail);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (user.status === 'inactive') {
      console.log('❌ Account is inactive:', normalizedEmail);
      return res.status(403).json({ message: 'Your account is deactivated. Please contact the admin.' });
    }

    const match = await user.matchPassword(password);
    if (!match) {
      console.log('❌ Password mismatch for user:', normalizedEmail);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('✅ Login successful for:', normalizedEmail);
    res.json({
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, profilePic: user.profilePic }
    });
  } catch (err) {
    console.error('🔥 Login error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────
// Returns the currently logged-in user's data (requires token)
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('🔥 /me error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/auth/profile ─────────────────────────────────────
// Update name, bio, or upload a new profile picture
router.put('/profile', protect, upload.single('profilePic'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.name) user.name = req.body.name;
    if (req.body.bio) user.bio = req.body.bio;
    if (req.file) user.profilePic = req.file.filename;
    await user.save();
    const updated = await User.findById(user._id).select('-password');
    res.json(updated);
  } catch (err) {
    console.error('🔥 Profile update error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/auth/change-password ────────────────────────────
router.put('/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    const match = await user.matchPassword(currentPassword);
    if (!match) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    user.password = newPassword; // pre-save hook will hash this
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('🔥 Change password error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;