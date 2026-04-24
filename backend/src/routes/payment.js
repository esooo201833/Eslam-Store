const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmPayment, handleWebhook } = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

// Create Payment Intent
router.post('/create-intent', auth, createPaymentIntent);

// Confirm Payment
router.post('/confirm', auth, confirmPayment);

// Webhook Handler (no auth required)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
