import app from './app';
import pool from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

/**
 * Start the Server
 * We wrap this in a function to allow async operations (like DB connection)
 */
const startServer = async () => {
  try {
    // 1. Test Database Connection
    const dbTest = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully:', dbTest.rows[0].now);

    // 2. Start Listening
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation available at http://localhost:${PORT}/api/v1`);
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1); // Stop the process if DB is dead
  }
};

startServer();