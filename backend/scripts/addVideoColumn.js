const mysql = require('mysql2/promise');

async function addVideoColumn() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'trek_api',
  });

  try {
    // Check if video column exists
    const [columns] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_NAME='destinations' AND COLUMN_NAME='video_url'`
    );

    if (columns.length === 0) {
      await connection.query(
        `ALTER TABLE destinations ADD COLUMN video_url VARCHAR(500) AFTER images`
      );
      console.log('✅ video_url column added to destinations table');
    } else {
      console.log('✅ video_url column already exists');
    }

    // Check for videos column (JSON array for multiple videos)
    const [videosColumns] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_NAME='destinations' AND COLUMN_NAME='videos'`
    );

    if (videosColumns.length === 0) {
      await connection.query(
        `ALTER TABLE destinations ADD COLUMN videos TEXT AFTER video_url`
      );
      console.log('✅ videos column (JSON array) added to destinations table');
    } else {
      console.log('✅ videos column already exists');
    }

    console.log('✅ Database updated successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

addVideoColumn();
