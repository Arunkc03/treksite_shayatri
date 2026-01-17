const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'trek_api',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function preventDuplicateBookings() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    // Check if unique constraint exists
    const [constraints] = await conn.query(`
      SELECT CONSTRAINT_NAME 
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_NAME = 'bookings' 
      AND COLUMN_NAME IN ('client_email', 'trek_id')
      AND CONSTRAINT_NAME != 'PRIMARY'
    `);
    
    if (constraints.length === 0) {
      // Add unique constraint to prevent same user booking same trek twice
      await conn.query(`
        ALTER TABLE bookings 
        ADD UNIQUE KEY unique_user_trek (client_email, trek_id)
      `);
      console.log('✅ Added unique constraint: client can only book each trek once');
    } else {
      console.log('✅ Unique constraint already exists');
    }
    
    conn.release();
    pool.end();
  } catch (error) {
    console.error('❌ Error adding constraint:', error.message);
    if (conn) conn.release();
    pool.end();
    process.exit(1);
  }
}

preventDuplicateBookings();
