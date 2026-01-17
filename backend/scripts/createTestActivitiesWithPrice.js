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

async function createTestActivitiesWithPrice() {
  try {
    const conn = await pool.getConnection();

    // Clear existing test activities except the ones we want
    await conn.query("DELETE FROM activities WHERE name NOT IN ('Mountain Hiking', 'Rock Climbing', 'Paragliding', 'Camping', 'River Rafting', 'Forest Trekking', 'Mountain Riding')");

    const activities = [
      { name: 'Mountain Hiking', location: 'Kathmandu Valley', difficulty: 'Easy', description: 'Enjoy scenic mountain trails with expert guides.', image: '🏔️', price: 2500 },
      { name: 'Rock Climbing', location: 'Nagarjun Forest', difficulty: 'Hard', description: 'Challenge yourself with rock climbing in beautiful natural settings.', image: '🧗', price: 3500 },
      { name: 'Paragliding', location: 'Pokhara', difficulty: 'Moderate', description: 'Experience the thrill of flying over scenic mountain landscapes.', image: '🪂', price: 5000 },
      { name: 'Camping', location: 'Ilam Hills', difficulty: 'Easy', description: 'Relax and unwind with camping under the stars.', image: '⛺', price: 1500 },
      { name: 'River Rafting', location: 'Bhote Koshi River', difficulty: 'Moderate', description: 'Navigate exciting river rapids with professional guidance.', image: '🏄', price: 2000 },
      { name: 'Forest Trekking', location: 'Shivapuri National Park', difficulty: 'Moderate', description: 'Explore pristine forests and discover wildlife.', image: '🌲', price: 1800 },
      { name: 'Mountain Riding', location: 'Chitwan Valley', difficulty: 'Hard', description: 'Experience adventure biking on mountain terrain.', image: '🎯', price: 2200 }
    ];

    let createdCount = 0;
    for (const activity of activities) {
      const [existing] = await conn.query('SELECT id FROM activities WHERE name = ?', [activity.name]);
      
      if (existing.length === 0) {
        await conn.query(
          'INSERT INTO activities (name, location, difficulty, description, image, price) VALUES (?, ?, ?, ?, ?, ?)',
          [activity.name, activity.location, activity.difficulty, activity.description, activity.image, activity.price]
        );
        createdCount++;
        console.log(`✅ Created: ${activity.name} - ₨${activity.price}`);
      } else {
        // Update price if activity exists
        await conn.query(
          'UPDATE activities SET price = ? WHERE name = ?',
          [activity.price, activity.name]
        );
        console.log(`🔄 Updated: ${activity.name} - ₨${activity.price}`);
      }
    }

    // Verify all activities
    const [allActivities] = await conn.query('SELECT id, name, price FROM activities ORDER BY id');
    console.log('\n📋 All activities in database:');
    allActivities.forEach(activity => {
      console.log(`  ID: ${activity.id} | ${activity.name} | Price: ₨${activity.price || 'Not set'}`);
    });

    console.log(`\n✅ Total: ${createdCount} new activities created`);

    conn.release();
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

createTestActivitiesWithPrice();
