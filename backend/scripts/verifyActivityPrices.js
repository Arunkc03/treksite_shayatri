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

async function verifyActivityPrices() {
  try {
    const conn = await pool.getConnection();

    const [activities] = await conn.query('SELECT id, name, price FROM activities');
    console.log('📋 All activities with prices:');
    activities.forEach(activity => {
      console.log(`  ID: ${activity.id} | Name: ${activity.name} | Price: ${activity.price ? '₨' + activity.price : 'Not set'}`);
    });

    conn.release();
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

verifyActivityPrices();
