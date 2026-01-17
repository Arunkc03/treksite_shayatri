const mysql = require('mysql2/promise');
require('dotenv').config();

async function addImagesColumn() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'trek_api'
    });

    console.log('Connected to MySQL database');

    // Check if images column exists
    const [columns] = await connection.execute('SHOW COLUMNS FROM destinations');
    const hasImages = columns.some(col => col.Field === 'images');

    if (!hasImages) {
      console.log('Adding "images" column for multiple image support...');
      await connection.execute('ALTER TABLE destinations ADD COLUMN images TEXT AFTER image_url');
      console.log('✅ Images column added successfully');
    } else {
      console.log('✅ Table already has images column');
    }

    // Show final structure
    const [finalColumns] = await connection.execute('SHOW COLUMNS FROM destinations');
    console.log('\n📋 Final table structure:');
    finalColumns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed');
    }
  }
}

addImagesColumn();
