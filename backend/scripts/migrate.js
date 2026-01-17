const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'trek_api'
    });

    // Add role column if it doesn't exist
    await conn.query(`ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user'`).catch(e => {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ role column already exists');
      } else {
        throw e;
      }
    });

    console.log('✅ Database migration complete');
    conn.end();
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
})();
