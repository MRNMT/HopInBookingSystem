import { Pool } from 'pg';
import dotenv from 'dotenv';

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
