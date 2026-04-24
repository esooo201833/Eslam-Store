const pool = require('../database/db');
const { validationResult } = require('express-validator');

// Get User Cart
const getCart = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id, c.quantity, p.id as product_id, p.name, p.description, p.price, p.image_url, p.stock, p.category
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [req.user.id]
    );

    // Calculate total
    const total = result.rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({ cart: result.rows, total });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add To Cart
const addToCart = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { product_id, quantity } = req.body;

    // Check if product exists and has enough stock
    const productResult = await pool.query(
      'SELECT stock FROM products WHERE id = $1',
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = productResult.rows[0];

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock' });
    }

    // Check if item already in cart
    const existingItem = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
      [req.user.id, product_id]
    );

    if (existingItem.rows.length > 0) {
      // Update quantity
      const newQuantity = existingItem.rows[0].quantity + quantity;
      
      if (newQuantity > product.stock) {
        return res.status(400).json({ message: 'Not enough stock' });
      }

      await pool.query(
        'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3',
        [newQuantity, req.user.id, product_id]
      );
    } else {
      // Add new item
      await pool.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)',
        [req.user.id, product_id, quantity]
      );
    }

    res.json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Cart Quantity
const updateCartQuantity = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Check product stock
    const productResult = await pool.query(
      'SELECT stock FROM products WHERE id = $1',
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = productResult.rows[0];

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock' });
    }

    // Update cart
    const result = await pool.query(
      'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
      [quantity, req.user.id, product_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item not in cart' });
    }

    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Update cart quantity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove From Cart
const removeFromCart = async (req, res) => {
  try {
    const { product_id } = req.params;

    const result = await pool.query(
      'DELETE FROM cart WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [req.user.id, product_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item not in cart' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear Cart
const clearCart = async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE user_id = $1', [req.user.id]);
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCart, addToCart, updateCartQuantity, removeFromCart, clearCart };
