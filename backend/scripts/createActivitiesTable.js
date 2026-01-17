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

async function createActivitiesTable() {
  try {
    const conn = await pool.getConnection();

    // Create activities table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description LONGTEXT,
        difficulty VARCHAR(50),
        duration VARCHAR(100),
        price DECIMAL(10, 2) DEFAULT 0,
        max_participants INT DEFAULT 10,
        current_participants INT DEFAULT 0,
        location VARCHAR(255),
        date DATE,
        image VARCHAR(255) DEFAULT '🏔️',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Activities table created successfully');
    conn.release();
  } catch (error) {
    console.error('❌ Error creating activities table:', error.message);
  } finally {
    await pool.end();
  }
}

createActivitiesTable();
