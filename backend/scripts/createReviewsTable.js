const mysql = require('mysql2/promise');
require('dotenv').config();

async function createReviewsTable() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'trek_api',
  });

  try {
    const conn = await pool.getConnection();
    
    console.log('📝 Creating reviews table...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title VARCHAR(200) NOT NULL,
        review TEXT NOT NULL,
        destination_id INT,
        trail_id INT,
        activity_id INT,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE SET NULL,
        FOREIGN KEY (trail_id) REFERENCES trails(id) ON DELETE SET NULL,
        FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE SET NULL
      )
    `);
    
    console.log('✅ Reviews table created successfully!');
    conn.release();
  } catch (error) {
    console.error('❌ Error creating reviews table:', error.message);
  } finally {
    await pool.end();
  }
}

createReviewsTable();
