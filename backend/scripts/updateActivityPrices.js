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

async function updateActivitiesWithPrice() {
  try {
    const conn = await pool.getConnection();

    const activityPrices = [
      { name: 'Mountain Hiking', price: 2500 },
      { name: 'Rock Climbing', price: 3500 },
      { name: 'Paragliding', price: 5000 },
      { name: 'Camping', price: 1500 },
      { name: 'River Rafting', price: 2000 },
      { name: 'Forest Trekking', price: 1800 },
      { name: 'Mountain Riding', price: 2200 }
    ];

    for (const activity of activityPrices) {
      await conn.query(
        'UPDATE activities SET price = ? WHERE name = ?',
        [activity.price, activity.name]
      );
      console.log(`✅ Updated ${activity.name} with price ₨${activity.price}`);
    }

    // Verify the updates
    const [activities] = await conn.query('SELECT id, name, price FROM activities');
    console.log('\n📋 Current activities with prices:');
    activities.forEach(activity => {
      console.log(`  - ${activity.name}: ₨${activity.price || 'Not set'}`);
    });

    conn.release();
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

updateActivitiesWithPrice();
