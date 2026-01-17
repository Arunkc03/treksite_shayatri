const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDestinationsTable() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'trek_api'
    });

    console.log('Connected to MySQL database');

    // Create destinations table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS destinations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(255),
        best_season VARCHAR(100),
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    await connection.execute(createTableQuery);
    console.log('✅ Destinations table created successfully');

    // Check if table has data
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM destinations');
    console.log(`📊 Current destinations count: ${rows[0].count}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

createDestinationsTable();
