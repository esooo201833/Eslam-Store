const { Pool } = require('pg');
require('dotenv').config();

// Use DATABASE_URL only - no fallback to individual env vars
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

let pool = null;

// Lazy initialization - create pool only when first query is made
function getPool() {
  if (!pool) {
    // Check if using Supabase (DATABASE_URL contains supabase)
    const isSupabase = connectionString.includes('supabase');
    
    pool = new Pool({
      connectionString,
      ssl: isSupabase ? { rejectUnauthorized: false } : (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false),
      connectionTimeoutMillis: 15000, // 15 second timeout
      idleTimeoutMillis: 30000, // 30 second idle timeout
      max: isSupabase ? 3 : 10, // Limit connections for serverless
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
  }
  return pool;
}

module.exports = getPool;
