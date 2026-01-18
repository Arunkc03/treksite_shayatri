/**
 * Create Itineraries Table in MySQL
 * Run: node scripts/createItinerariesTable.js
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function createItinerariesTable() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'trek_api',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    const conn = await pool.getConnection();
    
    // Check if table exists
    const [tables] = await conn.query(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'itineraries'",
      [process.env.DB_NAME || 'trek_api']
    );

    if (tables.length > 0) {
      console.log('✅ Itineraries table already exists');
      conn.release();
      await pool.end();
      process.exit(0);
    }

    // Create itineraries table
    console.log('📝 Creating itineraries table...');
    await conn.query(`
      CREATE TABLE itineraries (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL UNIQUE,
        description LONGTEXT NOT NULL,
        duration_days INT NOT NULL,
        difficulty VARCHAR(50) DEFAULT 'Moderate',
        price DECIMAL(10, 2) NOT NULL,
        location VARCHAR(255) NOT NULL,
        best_season VARCHAR(255),
        image VARCHAR(255) DEFAULT '🗺️',
        highlights JSON DEFAULT '[]',
        dayByDayPlan JSON DEFAULT '[]',
        includes JSON DEFAULT '[]',
        excludes JSON DEFAULT '[]',
        status VARCHAR(50) DEFAULT 'active',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Itineraries table created successfully');
    conn.release();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating table:', error.message);
    process.exit(1);
  }
}

createItinerariesTable();
