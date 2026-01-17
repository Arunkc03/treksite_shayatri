const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'trek_api',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function setupGallery() {
  try {
    const connection = await pool.getConnection();
    
    console.log('✅ Connected to database');

    // Create gallery table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS gallery (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        photo_url VARCHAR(500) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    console.log('✅ Gallery table created successfully');

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Uploads directory created');
    } else {
      console.log('✅ Uploads directory already exists');
    }

    connection.release();
    console.log('✅ Gallery setup complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Setup error:', err.message);
    process.exit(1);
  }
}

setupGallery();
