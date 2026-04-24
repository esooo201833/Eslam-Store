const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getProfile } = require('../controllers/authController');
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

module.exports = router;
