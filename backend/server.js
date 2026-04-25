const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Health Check FIRST - before any middleware or routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Also support /api/health for compatibility
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Eslam Store API', health: '/health' });
});

// DB Test route
const getPool = require('./src/database/db');
app.get('/db-test', async (req, res) => {
  try {
    const result = await getPool().query('SELECT NOW()');
    res.json({ 
      status: 'OK', 
      message: 'Database connected', 
      time: result.rows[0].now,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
        isVercel: !!process.env.VERCEL
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: error.message,
      stack: error.stack,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
        isVercel: !!process.env.VERCEL
      }
    });
  }
});

// Favicon - return 204 to prevent timeout
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});
app.get('/favicon.png', (req, res) => {
  res.status(204).end();
});

// Security Middleware - disable in serverless to prevent issues
if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false
  }));
}

// CORS Configuration
const allowedOrigins = [
  'http://localhost:4200',
  'https://eslam-store.vercel.app',
  'https://eslam-store-backend.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all origins for localtunnel testing
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files (Uploads) - only for local development
if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  app.use('/uploads', express.static('uploads'));
}

// Rate Limiting - disabled in serverless
const { apiLimiter } = require('./src/middleware/rateLimiter');
if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  app.use('/api/', apiLimiter);
}

// Routes - load AFTER health check
const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const cartRoutes = require('./src/routes/cart');
const orderRoutes = require('./src/routes/orders');
const paymentRoutes = require('./src/routes/payment');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start Server (only for local development)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
