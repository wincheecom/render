const { Pool } = require('pg');
require('dotenv').config();

// Database configuration from environment variables or defaults
const dbConfig = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DATABASE || 'funseek',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres'
};

const pool = new Pool(dbConfig);

async function clearDemoData() {
  try {
    console.log('Connecting to database...');
    
    // Begin transaction
    await pool.query('BEGIN');
    
    // Clear all data from tables
    await pool.query('DELETE FROM activities');
    await pool.query('DELETE FROM history');
    await pool.query('DELETE FROM tasks');
    await pool.query('DELETE FROM products');
    
    console.log('All demo data cleared successfully!');
    
    // Commit transaction
    await pool.query('COMMIT');
    console.log('Transaction committed.');
    
  } catch (err) {
    console.error('Error clearing data:', err.message);
    try {
      await pool.query('ROLLBACK');
      console.log('Transaction rolled back.');
    } catch (rollbackErr) {
      console.error('Rollback failed:', rollbackErr.message);
    }
  } finally {
    await pool.end();
    console.log('Database connection closed.');
  }
}

// Run the function
clearDemoData();