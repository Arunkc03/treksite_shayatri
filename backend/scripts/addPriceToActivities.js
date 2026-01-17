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

async function addPriceColumnIfNotExists() {
  try {
    const conn = await pool.getConnection();

    // Check if price column exists
    const [columns] = await conn.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'activities' AND COLUMN_NAME = 'price'
    `);

    if (columns.length === 0) {
      // Add price column if it doesn't exist
      await conn.query(`
        ALTER TABLE activities ADD COLUMN price DECIMAL(10, 2) DEFAULT NULL
      `);
      console.log('✅ Price column added to activities table');
    } else {
      console.log('✅ Price column already exists in activities table');
    }

    conn.release();
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

addPriceColumnIfNotExists();
