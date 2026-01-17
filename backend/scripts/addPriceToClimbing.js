// Script to add price column to climbing table
const mysql = require('mysql2/promise');
require('dotenv').config();

async function addPriceToClimbing() {
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

    // Check if price column exists
    const [columns] = await connection.query(`
      SHOW COLUMNS FROM climbing WHERE Field = 'price'
    `);

    if (columns.length === 0) {
      // Add price column if it doesn't exist
      await connection.execute(`
        ALTER TABLE climbing 
        ADD COLUMN price DECIMAL(10, 2) DEFAULT 0
      `);
      console.log('✅ Added price column to climbing table');
    } else {
      console.log('✅ Price column already exists in climbing table');
      console.log('Column details:', columns[0]);
    }

    // Show all climbing records with their prices
    const [records] = await connection.query(`
      SELECT id, name, price FROM climbing
    `);
    
    console.log('\n📋 Current climbing records:');
    records.forEach(record => {
      console.log(`  ID: ${record.id}, Name: ${record.name}, Price: ${record.price}`);
    });

    console.log('\n🎉 Climbing table update complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addPriceToClimbing();
