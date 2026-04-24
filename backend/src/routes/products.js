const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { auth, adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get All Products (Public)
router.get('/', getAllProducts);

// Get Product By ID (Public)
router.get('/:id', getProductById);

// Create Product (Admin Only)
router.post(
  '/',
  adminAuth,
  upload.single('image'),
  [
    body('name').notEmpty().withMessage('Product name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('category').notEmpty().withMessage('Category is required')
  ],
  createProduct
);

// Update Product (Admin Only)
router.put(
  '/:id',
  adminAuth,
  upload.single('image'),
  [
    body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('category').optional().notEmpty().withMessage('Category cannot be empty')
  ],
  updateProduct
);

// Delete Product (Admin Only)
router.delete('/:id', adminAuth, deleteProduct);

module.exports = router;
