const mysql = require('mysql2/promise');

async function addColumnsToTrails() {
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
    
    // Check if columns exist
    const [columns] = await conn.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'trails' AND TABLE_SCHEMA = DATABASE()
    `);
    
    const columnNames = columns.map(col => col.COLUMN_NAME);
    console.log('📋 Existing columns:', columnNames);
    
    // Add missing columns
    const columnsToAdd = [
      { name: 'length_km', type: 'DECIMAL(10, 2)', exists: columnNames.includes('length_km') },
      { name: 'description', type: 'TEXT', exists: columnNames.includes('description') },
      { name: 'price', type: 'DECIMAL(10, 2)', exists: columnNames.includes('price') },
      { name: 'lat', type: 'DECIMAL(10, 8)', exists: columnNames.includes('lat') },
      { name: 'lng', type: 'DECIMAL(11, 8)', exists: columnNames.includes('lng') }
    ];
    
    for (const col of columnsToAdd) {
      if (!col.exists) {
        console.log(`➕ Adding column: ${col.name}`);
        await conn.query(`ALTER TABLE trails ADD COLUMN ${col.name} ${col.type}`);
        console.log(`✅ Column ${col.name} added successfully`);
      } else {
        console.log(`⏭️  Column ${col.name} already exists`);
      }
    }
    
    console.log('\n✨ All columns are now present in the trails table!');
    
    conn.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addColumnsToTrails();
