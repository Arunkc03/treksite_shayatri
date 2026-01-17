// Migration script to create climbing table
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createClimbingTable() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'trek_api'
    });

    console.log('✅ Connected to MySQL database');

    // Create climbing table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS climbing (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        difficulty ENUM('Easy', 'Moderate', 'Hard') DEFAULT 'Moderate',
        rock_type VARCHAR(100),
        height_meters DECIMAL(10, 2),
        routes_count INT,
        description TEXT,
        image VARCHAR(500),
        price DECIMAL(10, 2) DEFAULT 0,
        lat DECIMAL(10, 7),
        lng DECIMAL(10, 7),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.execute(createTableQuery);
    console.log('✅ Climbing table created successfully');

    // Insert sample data
    const insertSampleData = `
      INSERT INTO climbing (name, location, difficulty, rock_type, height_meters, routes_count, description, image, lat, lng)
      VALUES 
        ('Eagles Nest Crag', 'Nagarjun Forest, Kathmandu', 'Moderate', 'Granite', 35.5, 12, 'Popular climbing spot with excellent granite routes. Well-bolted sport climbing with spectacular valley views.', '🧗', 27.7402, 85.2763),
        ('Hattiban Wall', 'Hattiban, Kathmandu', 'Hard', 'Limestone', 45.0, 18, 'Challenging limestone wall perfect for experienced climbers. Features overhangs and technical routes.', '🧗', 27.6588, 85.2896),
        ('Budhanilkantha Crag', 'Budhanilkantha, Kathmandu', 'Easy', 'Sandstone', 20.0, 8, 'Beginner-friendly climbing area with well-maintained routes. Great for learning and families.', '🧗', 27.7680, 85.3634)
      ON DUPLICATE KEY UPDATE id=id;
    `;

    await connection.execute(insertSampleData);
    console.log('✅ Sample climbing spots inserted');

    console.log('\n🎉 Climbing table setup complete!');
    console.log('📝 You can now manage climbing spots from the Admin dashboard');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n👋 Connection closed');
    }
  }
}

// Run the migration
createClimbingTable();
