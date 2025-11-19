import app from './app';
import pool from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {

    const dbTest = await pool.query('SELECT NOW()');
    console.log(' Database connected successfully:', dbTest.rows[0].now);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`API Documentation available at http://localhost:${PORT}/api/v1`);
    });

  } catch (error) {
    console.error(' Database connection failed:', error);
    process.exit(1); 
  }
};

startServer();
