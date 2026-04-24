const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getCart, addToCart, updateCartQuantity, removeFromCart, clearCart } = require('../controllers/cartController');
const { auth } = require('../middleware/auth');

// Get User Cart
router.get('/', auth, getCart);

// Add To Cart
router.post(
  '/',
  auth,
  [
    body('product_id').isInt().withMessage('Product ID must be an integer'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  addToCart
);

// Update Cart Quantity
router.put(
  '/',
  auth,
  [
    body('product_id').isInt().withMessage('Product ID must be an integer'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  updateCartQuantity
);

// Remove From Cart
router.delete('/:product_id', auth, removeFromCart);

// Clear Cart
router.delete('/', auth, clearCart);

module.exports = router;
