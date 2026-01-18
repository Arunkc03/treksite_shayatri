const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkTable() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'trek_api'
  });

  try {
    const conn = await pool.getConnection();
    
    const [tables] = await conn.query(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'itineraries'",
      [process.env.DB_NAME || 'trek_api']
    );

    if (tables.length > 0) {
      console.log('✅ Itineraries table EXISTS');
      const [columns] = await conn.query('DESC itineraries');
      console.log('\nColumns:');
      columns.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type}`);
      });
    } else {
      console.log('❌ Itineraries table DOES NOT exist');
      console.log('\nCreating itineraries table...');
      
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
      
      console.log('✅ Itineraries table created successfully!');
    }
    
    conn.release();
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkTable();
