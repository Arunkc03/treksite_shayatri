const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixDestinationsTable() {
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

    // Check current table structure
    const [columns] = await connection.execute('SHOW COLUMNS FROM destinations');
    console.log('Current columns:', columns.map(c => c.Field).join(', '));

    // Check if image_url exists
    const hasImageUrl = columns.some(col => col.Field === 'image_url');
    const hasImage = columns.some(col => col.Field === 'image');

    if (!hasImageUrl) {
      if (hasImage) {
        // Rename image to image_url
        console.log('Renaming "image" column to "image_url"...');
        await connection.execute('ALTER TABLE destinations CHANGE COLUMN image image_url VARCHAR(500)');
        console.log('✅ Column renamed successfully');
      } else {
        // Add image_url column
        console.log('Adding "image_url" column...');
        await connection.execute('ALTER TABLE destinations ADD COLUMN image_url VARCHAR(500)');
        console.log('✅ Column added successfully');
      }
    } else {
      console.log('✅ Table already has image_url column');
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

fixDestinationsTable();
