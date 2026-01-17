const mysql = require('mysql2/promise');
require('dotenv').config();

async function testActivities() {
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
    
    // Check if activities table exists
    const [tables] = await conn.query(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'activities'",
      [process.env.DB_NAME || 'trek_api']
    );

    console.log('\n=== Activities Table Check ===');
    if (tables.length > 0) {
      console.log('✅ Activities table EXISTS');
      
      // Get table structure
      const [columns] = await conn.query('DESCRIBE activities');
      console.log('\n📋 Table Columns:');
      columns.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type}`);
      });

      // Get activities count
      const [rows] = await conn.query('SELECT COUNT(*) as count FROM activities');
      console.log(`\n📊 Total activities in database: ${rows[0].count}`);

      // Get sample data
      const [sample] = await conn.query('SELECT * FROM activities LIMIT 5');
      if (sample.length > 0) {
        console.log('\n📝 Sample activities:');
        sample.forEach(activity => {
          console.log(`  - ${activity.name} (${activity.location})`);
        });
      } else {
        console.log('\n⚠️  No activities in database yet');
      }
    } else {
      console.log('❌ Activities table DOES NOT EXIST');
    }

    conn.release();
    await pool.end();

    // Test API endpoint
    console.log('\n=== Testing API Endpoint ===');
    const response = await fetch('http://localhost:5000/api/activities');
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testActivities();
