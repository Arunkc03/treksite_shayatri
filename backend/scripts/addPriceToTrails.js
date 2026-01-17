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

async function addPriceColumn() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    // Check if price column exists
    const [columns] = await conn.query(`SHOW COLUMNS FROM trails LIKE 'price'`);
    
    if (columns.length === 0) {
      // Add price column
      await conn.query(`
        ALTER TABLE trails 
        ADD COLUMN price DECIMAL(10, 2) DEFAULT 2500 AFTER elevation
      `);
      console.log('✅ Price column added to trails table with default price 2500');
    } else {
      console.log('✅ Price column already exists');
    }
    
    conn.release();
    pool.end();
  } catch (error) {
    console.error('❌ Error adding price column:', error.message);
    if (conn) conn.release();
    pool.end();
    process.exit(1);
  }
}

addPriceColumn();
