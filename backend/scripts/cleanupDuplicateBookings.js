const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'trek_api',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function cleanupDuplicateBookings() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    // Find and remove duplicate bookings (keep only the first one)
    const [duplicates] = await conn.query(`
      SELECT client_email, trek_id, COUNT(*) as count
      FROM bookings
      GROUP BY client_email, trek_id
      HAVING count > 1
    `);
    
    if (duplicates.length > 0) {
      console.log(`Found ${duplicates.length} users with duplicate bookings for same trek`);
      
      for (const dup of duplicates) {
        // Get all bookings for this user-trek combination, ordered by date
        const [bookings] = await conn.query(`
          SELECT id FROM bookings
          WHERE client_email = ? AND trek_id = ?
          ORDER BY created_at ASC
        `, [dup.client_email, dup.trek_id]);
        
        // Keep only the first one, delete the rest
        if (bookings.length > 1) {
          const idsToDelete = bookings.slice(1).map(row => row.id);
          const placeholders = idsToDelete.map(() => '?').join(',');
          await conn.query(
            `DELETE FROM bookings WHERE id IN (${placeholders})`,
            idsToDelete
          );
          console.log(`✅ Deleted ${idsToDelete.length} duplicate booking(s) for ${dup.client_email} - Trek ${dup.trek_id}`);
        }
      }
    }
    
    // Now add the unique constraint
    await conn.query(`
      ALTER TABLE bookings 
      ADD UNIQUE KEY unique_user_trek (client_email, trek_id)
    `);
    
    console.log('✅ Added unique constraint: One user = One booking per trek');
    
    conn.release();
    pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (conn) conn.release();
    pool.end();
    process.exit(1);
  }
}

cleanupDuplicateBookings();
