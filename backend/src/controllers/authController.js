const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../database/db');
const { validationResult } = require('express-validator');
const { generateOTP, calculateOTPExpiry, isOTPExpired } = require('../utils/otp');
const { sendOTPEmail, sendWelcomeEmail } = require('../utils/email');

// Register User
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, full_name } = req.body;

    // Check if user already exists
    const userExists = await pool.query(
      'SELECT id, is_verified FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      const existingUser = userExists.rows[0];
      if (existingUser.is_verified) {
        return res.status(400).json({ message: 'User already exists and is verified' });
      } else {
        // User exists but not verified, resend OTP
        const otp = generateOTP();
        const otpExpiry = calculateOTPExpiry(parseInt(process.env.OTP_EXPIRY_MINUTES) || 5);

        await pool.query(
          'UPDATE users SET otp = $1, otp_expiry = $2 WHERE email = $3',
          [otp, otpExpiry, email]
        );

        await sendOTPEmail(email, otp, full_name);

        return res.status(200).json({
          message: 'Account already exists. New OTP sent to your email',
          requiresVerification: true,
          email
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = calculateOTPExpiry(parseInt(process.env.OTP_EXPIRY_MINUTES) || 5);

    // Create user with OTP (not verified yet)
    const result = await pool.query(
      'INSERT INTO users (email, password, full_name, otp, otp_expiry, is_verified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, full_name',
      [email, hashedPassword, full_name, otp, otpExpiry, false]
    );

    const user = result.rows[0];

    // Send OTP email
    await sendOTPEmail(email, otp, full_name);

    res.status(201).json({
      message: 'Registration successful. Please verify your email with the OTP sent to your email address',
      requiresVerification: true,
      email
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is verified
    if (!user.is_verified) {
      // Generate new OTP if expired
      const { isOTPExpired } = require('../utils/otp');
      if (!user.otp || isOTPExpired(user.otp_expiry)) {
        const otp = generateOTP();
        const otpExpiry = calculateOTPExpiry(parseInt(process.env.OTP_EXPIRY_MINUTES) || 5);

        await pool.query(
          'UPDATE users SET otp = $1, otp_expiry = $2 WHERE email = $3',
          [otp, otpExpiry, email]
        );

        await sendOTPEmail(email, otp, user.full_name);
      }

      return res.status(403).json({
        message: 'Please verify your email address before logging in',
        requiresVerification: true,
        email
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get User Profile
const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, full_name, role, is_verified, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;

    // Check if user exists
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    // Check if already verified
    if (user.is_verified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Check if OTP exists
    if (!user.otp) {
      return res.status(400).json({ message: 'No OTP found. Please request a new OTP' });
    }

    // Check if OTP is expired
    if (isOTPExpired(user.otp_expiry)) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new OTP' });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Verify user and clear OTP
    await pool.query(
      'UPDATE users SET is_verified = true, otp = NULL, otp_expiry = NULL WHERE email = $1',
      [email]
    );

    // Send welcome email
    await sendWelcomeEmail(email, user.full_name);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    // Check if user exists
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    // Check if already verified
    if (user.is_verified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = calculateOTPExpiry(parseInt(process.env.OTP_EXPIRY_MINUTES) || 5);

    // Update OTP in database
    await pool.query(
      'UPDATE users SET otp = $1, otp_expiry = $2 WHERE email = $3',
      [otp, otpExpiry, email]
    );

    // Send OTP email
    await sendOTPEmail(email, otp, user.full_name);

    res.json({
      message: 'New OTP sent to your email',
      email
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, getProfile, verifyOTP, resendOTP };
