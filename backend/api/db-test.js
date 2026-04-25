// Database connection test
const getPool = require('../src/database/db');

module.exports = async (req, res) => {
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
};
