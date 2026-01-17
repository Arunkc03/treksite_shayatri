const mysql = require('mysql2/promise');

async function addContactToTrails() {
  let conn;
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

    conn = await pool.getConnection();
    
    console.log('🔍 Checking trails table structure...');
    
    // Check if contact column exists
    const [columns] = await conn.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'trails' AND TABLE_SCHEMA = DATABASE()
    `);
    
    const columnNames = columns.map(col => col.COLUMN_NAME);
    console.log('📋 Existing columns:', columnNames);
    
    // Add contact column if missing
    if (!columnNames.includes('contact')) {
      console.log('➕ Adding contact column');
      await conn.query(`ALTER TABLE trails ADD COLUMN contact VARCHAR(255)`);
      console.log('✅ Contact column added successfully');
    } else {
      console.log('⏭️  Contact column already exists');
    }
    
    console.log('\n✨ Database structure is up to date!');
    
    conn.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addContactToTrails();
