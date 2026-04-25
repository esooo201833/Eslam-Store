const { Pool } = require('pg');
require('dotenv').config();

// Use DATABASE_URL from Render or fallback to individual env vars
const connectionString = process.env.DATABASE_URL || 
  `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'eslam_store'}`;

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 10000, // 10 second timeout
  idleTimeoutMillis: 30000, // 30 second idle timeout
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  // Don't exit in serverless environments
  if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    process.exit(-1);
  }
});

module.exports = pool;
