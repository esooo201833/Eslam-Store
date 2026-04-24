const pool = require('../database/db');
const { validationResult } = require('express-validator');

// Create Order
const createOrder = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ errors: errors.array() });
    }

    const { full_name, email, country, governorate, address, phone, payment_id } = req.body;

    // Get user cart
    const cartResult = await client.query(
      `SELECT c.quantity, p.id as product_id, p.price, p.stock
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [req.user.id]
    );

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Check stock availability
    for (const item of cartResult.rows) {
      if (item.stock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ 
          message: `Not enough stock for product ${item.product_id}` 
        });
      }
    }

    // Calculate total
    const total = cartResult.rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, full_name, email, country, governorate, address, phone, payment_id, status, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', 'paid')
       RETURNING *`,
      [req.user.id, total, full_name, email, country, governorate, address, phone, payment_id]
    );

    const order = orderResult.rows[0];

    // Create order items and update stock
    for (const item of cartResult.rows) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.product_id, item.quantity, item.price]
      );

      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await client.query('DELETE FROM cart WHERE user_id = $1', [req.user.id]);

    await client.query('COMMIT');

    res.status(201).json({ 
      message: 'Order created successfully', 
      order_id: order.id,
      total_amount: total
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
};

// Get User Orders
const getUserOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, 
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as items_count
       FROM orders o
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    res.json({ orders: result.rows });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Order By ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsResult = await pool.query(
      `SELECT oi.*, p.name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [id]
    );

    res.json({ order, items: itemsResult.rows });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Orders (Admin Only)
const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = `SELECT o.*, u.email as user_email 
                 FROM orders o
                 JOIN users u ON o.user_id = u.id`;
    const params = [];

    if (status) {
      query += ' WHERE o.status = $1';
      params.push(status);
    }

    query += ' ORDER BY o.created_at DESC';

    const result = await pool.query(query, params);
    res.json({ orders: result.rows });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Order Status (Admin Only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully', order: result.rows[0] });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus };
