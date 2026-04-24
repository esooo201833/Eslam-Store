const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getProfile, verifyOTP, resendOTP } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Register
router.post(
  '/register',
  authLimiter,
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('full_name').notEmpty().withMessage('Full name is required')
  ],
  register
);

// Login
router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  login
);

// Get Profile
router.get('/profile', auth, getProfile);

// Verify OTP
router.post(
  '/verify-otp',
  authLimiter,
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
  ],
  verifyOTP
);

// Resend OTP
router.post(
  '/resend-otp',
  authLimiter,
  [
    body('email').isEmail().withMessage('Please enter a valid email')
  ],
  resendOTP
);

module.exports = router;
