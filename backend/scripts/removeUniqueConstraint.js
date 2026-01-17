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

async function removeUniqueConstraint() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    // Drop the unique constraint if it exists
    try {
      await conn.query(`
        ALTER TABLE bookings 
        DROP KEY unique_user_trek
      `);
      console.log('✅ Removed unique constraint - Users can now book same trek multiple times');
    } catch (error) {
      if (error.message.includes('check that')) {
        console.log('✅ Constraint already removed or does not exist');
      } else {
        throw error;
      }
    }
    
    conn.release();
    pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (conn) conn.release();
    pool.end();
    process.exit(1);
  }
}

removeUniqueConstraint();
