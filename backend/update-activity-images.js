const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateActivityImages() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'trek_api',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    const conn = await pool.getConnection();
    
    // Update all activities with NULL images to have default emoji
    const [result] = await conn.query(
      "UPDATE activities SET image = '🎯' WHERE image IS NULL OR image = ''"
    );

    console.log(`✅ Updated ${result.affectedRows} activities with default image`);

    // Get all activities to show
    const [activities] = await conn.query('SELECT id, name, image FROM activities');
    
    console.log('\n📋 All Activities:');
    activities.forEach(activity => {
      console.log(`  - ${activity.name}: ${activity.image}`);
    });

    conn.release();
    await pool.end();

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

updateActivityImages();
