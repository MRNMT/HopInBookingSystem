import { Pool } from 'pg';
import dotenv from 'dotenv';

<<<<<<< HEAD
// Load environment variables (to read DATABASE_URL)
dotenv.config();

// Create a new pool using the connection string from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Export a helper function to run queries
// This will be used by your Services (e.g., AuthService, BookingService)
export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};

// Export the pool itself for testing connection health
export default pool;
=======
dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'hopin_booking',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const connectDB = async (): Promise<void> => {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL database');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

export { pool };
>>>>>>> 6c32ffdb2a419ea0a588bffb3057e53e47192f0d
