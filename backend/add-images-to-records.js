const mysql = require('mysql2/promise');

async function addImagesToRecords() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'trek_api'
  });

  const conn = await pool.getConnection();

  // Images mapping
  const images = {
    activities: [
      'id-1768378640227-465551986.jpg',
      'id-1768388171585-15665529.jpg',
      'id-1768399827852-533104367.jpg',
      'id-1768458823679-798623006.jpg',
      'id-1768482612297-774573960.png',
      'id-1768484144158-349889269.jpg'
    ],
    destinations: [
      'id-1768378640227-465551986.jpg',
      'id-1768388171585-15665529.jpg',
      'id-1768399827852-533104367.jpg',
      'id-1768458823679-798623006.jpg',
      'id-1768482612297-774573960.png',
      'id-1768484144158-349889269.jpg'
    ],
    climbing: [
      'id-1768378640227-465551986.jpg',
      'id-1768388171585-15665529.jpg',
      'id-1768399827852-533104367.jpg',
      'id-1768458823679-798623006.jpg',
      'id-1768482612297-774573960.png'
    ],
    itineraries: [
      'id-1768378640227-465551986.jpg',
      'id-1768388171585-15665529.jpg',
      'id-1768399827852-533104367.jpg',
      'id-1768458823679-798623006.jpg'
    ]
  };

  // Update Activities with images
  console.log('\n🖼️ Adding images to Activities...');
  const activities = await conn.query('SELECT id, name FROM activities LIMIT 6');
  for (let i = 0; i < activities[0].length; i++) {
    const activity = activities[0][i];
    const imagePath = `uploads/ids/${images.activities[i]}`;
    try {
      await conn.query('UPDATE activities SET image = ? WHERE id = ?', [imagePath, activity.id]);
      console.log(`✅ Updated: ${activity.name} with image`);
    } catch (err) {
      console.log(`❌ Error updating ${activity.name}:`, err.message);
    }
  }

  // Update Destinations with images
  console.log('\n🌍 Adding images to Destinations...');
  const destinations = await conn.query('SELECT id, name FROM destinations LIMIT 6');
  for (let i = 0; i < destinations[0].length; i++) {
    const dest = destinations[0][i];
    const imagePath = `uploads/ids/${images.destinations[i]}`;
    try {
      await conn.query('UPDATE destinations SET images = ? WHERE id = ?', [imagePath, dest.id]);
      console.log(`✅ Updated: ${dest.name} with image`);
    } catch (err) {
      console.log(`❌ Error updating ${dest.name}:`, err.message);
    }
  }

  // Update Climbing with images
  console.log('\n🏔️ Adding images to Climbing Peaks...');
  const climbing = await conn.query('SELECT id, name FROM climbing LIMIT 5');
  for (let i = 0; i < climbing[0].length; i++) {
    const peak = climbing[0][i];
    const imagePath = `uploads/ids/${images.climbing[i]}`;
    try {
      await conn.query('UPDATE climbing SET image = ? WHERE id = ?', [imagePath, peak.id]);
      console.log(`✅ Updated: ${peak.name} with image`);
    } catch (err) {
      console.log(`❌ Error updating ${peak.name}:`, err.message);
    }
  }

  // Update Itineraries with images
  console.log('\n✨ Adding images to Itineraries...');
  const itineraries = await conn.query('SELECT id, title FROM itineraries LIMIT 4');
  for (let i = 0; i < itineraries[0].length; i++) {
    const itin = itineraries[0][i];
    const imagePath = `uploads/ids/${images.itineraries[i]}`;
    try {
      await conn.query('UPDATE itineraries SET image = ? WHERE id = ?', [imagePath, itin.id]);
      console.log(`✅ Updated: ${itin.title} with image`);
    } catch (err) {
      console.log(`❌ Error updating ${itin.title}:`, err.message);
    }
  }

  conn.release();
  await pool.end();
  console.log('\n✅ All images added to records!');
  process.exit(0);
}

addImagesToRecords().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
