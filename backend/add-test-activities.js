const mysql = require('mysql2/promise');
require('dotenv').config();

async function addTestActivities() {
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

    const conn = await pool.getConnection();
    
    const activities = [
      ['Mountain Hiking', 'Nepal', 'Moderate', 'Trek through pristine mountain landscapes with experienced guides', '🏔️'],
      ['Rock Climbing', 'Pokhara', 'Hard', 'Challenge yourself on thrilling rock faces with safety equipment', '🧗'],
      ['Paragliding Adventure', 'Himachal Pradesh', 'Easy', 'Soar through the skies with breathtaking views of the Himalayas', '🪂'],
      ['Camping & Bonfire', 'Uttarakhand', 'Easy', 'Experience the wilderness with camping under starry skies', '⛺'],
      ['River Rafting', 'Rishikesh', 'Moderate', 'Navigate exciting rapids and enjoy scenic river views', '🏄'],
      ['Forest Trekking', 'Manali', 'Moderate', 'Walk through dense forests and discover hidden waterfalls', '🌲'],
    ];

    for (const [name, location, difficulty, description, image] of activities) {
      await conn.query(
        'INSERT INTO activities (name, location, difficulty, description, image) VALUES (?, ?, ?, ?, ?)',
        [name, location, difficulty, description, image]
      );
    }

    console.log(`✅ Added ${activities.length} test activities`);

    // Get all activities to show
    const [allActivities] = await conn.query('SELECT id, name, location, difficulty, image FROM activities');
    
    console.log('\n📋 All Activities:');
    allActivities.forEach(activity => {
      console.log(`  ${activity.image} ${activity.name} - ${activity.location} (${activity.difficulty})`);
    });

    conn.release();
    await pool.end();

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

addTestActivities();
