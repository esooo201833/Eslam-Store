const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { auth, adminAuth } = require('../middleware/auth');

// Create Order
router.post(
  '/',
  auth,
  [
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('country').notEmpty().withMessage('Country is required'),
    body('governorate').notEmpty().withMessage('Governorate is required'),
    body('address').notEmpty().withMessage('Address is required')
  ],
  createOrder
);

// Get User Orders
router.get('/', auth, getUserOrders);

// Get Order By ID
router.get('/:id', auth, getOrderById);

// Get All Orders (Admin Only)
router.get('/admin/all', adminAuth, getAllOrders);

// Update Order Status (Admin Only)
router.put(
  '/:id/status',
  adminAuth,
  [
    body('status').notEmpty().withMessage('Status is required')
  ],
  updateOrderStatus
);

module.exports = router;
