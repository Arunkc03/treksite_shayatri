/**
 * MySQL Database Seeding Script
 * Adds sample data for trails, activities, and destinations
 * Run: node seed-mysql.js
 */

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

async function seedDatabase() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('✅ Connected to MySQL database');

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await conn.query('DELETE FROM activities');
    await conn.query('DELETE FROM trails');
    await conn.query('DELETE FROM destinations');
    console.log('✅ Data cleared');

    // Seed Activities
    console.log('\n📝 Seeding Activities...');
    const activities = [
      {
        name: 'Mountain Hiking',
        description: 'Challenging mountain trek with scenic views and professional guides',
        difficulty: 'Moderate',
        duration: '4 hours',
        price: 2500,
        maxParticipants: 15,
        location: 'Kathmandu Valley',
        image: '⛰️',
        status: 'active'
      },
      {
        name: 'Rock Climbing',
        description: 'Expert rock climbing adventure with certified guides and all equipment',
        difficulty: 'Hard',
        duration: '6 hours',
        price: 4000,
        maxParticipants: 8,
        location: 'Pokhara',
        image: '🧗',
        status: 'active'
      },
      {
        name: 'Trekking Expedition',
        description: 'Multi-day trekking experience through mountain ranges and villages',
        difficulty: 'Hard',
        duration: '5 days',
        price: 8500,
        maxParticipants: 20,
        location: 'Himalayas',
        image: '🏕️',
        status: 'active'
      },
      {
        name: 'Paragliding Adventure',
        description: 'Thrilling paragliding experience with professional instructors',
        difficulty: 'Moderate',
        duration: '2 hours',
        price: 5000,
        maxParticipants: 10,
        location: 'Nagarkot',
        image: '🪂',
        status: 'active'
      },
      {
        name: 'Camping & Bonfire',
        description: 'Relaxing camping experience with bonfire and stargazing',
        difficulty: 'Easy',
        duration: '1 night',
        price: 1500,
        maxParticipants: 25,
        location: 'Chitwan',
        image: '🏕️',
        status: 'active'
      },
      {
        name: 'Wildlife Safari',
        description: 'Guided safari to spot wildlife and birds in natural habitat',
        difficulty: 'Easy',
        duration: '3 hours',
        price: 3000,
        maxParticipants: 12,
        location: 'Chitwan National Park',
        image: '🦁',
        status: 'active'
      }
    ];

    for (const activity of activities) {
      await conn.query(
        'INSERT INTO activities (name, description, difficulty, duration, price, maxParticipants, location, image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [activity.name, activity.description, activity.difficulty, activity.duration, activity.price, activity.maxParticipants, activity.location, activity.image, activity.status]
      );
      console.log(`  ✓ Added: ${activity.name}`);
    }
    console.log(`✅ ${activities.length} activities seeded`);

    // Seed Trails
    console.log('\n📝 Seeding Trails...');
    const trails = [
      {
        name: 'Annapurna Base Camp Trek',
        description: 'One of the most popular trekking routes in the world, offering stunning views of Annapurna mountains',
        difficulty: 'Hard',
        length_km: 73,
        duration_days: 7,
        best_season: 'October to November, March to May',
        price: 12000,
        maxParticipants: 20,
        location: 'Annapurna Region, Nepal',
        image: '⛰️',
        status: 'active'
      },
      {
        name: 'Mount Everest Base Camp',
        description: 'The ultimate trekking challenge leading to the base camp of the world\'s highest mountain',
        difficulty: 'Hard',
        length_km: 130,
        duration_days: 12,
        best_season: 'September to October, March to May',
        price: 18000,
        maxParticipants: 15,
        location: 'Everest Region, Nepal',
        image: '🏔️',
        status: 'active'
      },
      {
        name: 'Langtang Valley Trek',
        description: 'Beautiful trek through rhododendron forests and traditional Tamang villages',
        difficulty: 'Moderate',
        length_km: 50,
        duration_days: 5,
        best_season: 'October to November, March to May',
        price: 8000,
        maxParticipants: 25,
        location: 'Langtang Region, Nepal',
        image: '🌲',
        status: 'active'
      },
      {
        name: 'Manali to Leh Highway Trek',
        description: 'Scenic trek through Himalayas with breathtaking views and high altitude experience',
        difficulty: 'Hard',
        length_km: 485,
        duration_days: 14,
        best_season: 'June to September',
        price: 25000,
        maxParticipants: 12,
        location: 'Himachal Pradesh to Ladakh, India',
        image: '🏔️',
        status: 'active'
      },
      {
        name: 'Kailash Mansarovar Trek',
        description: 'Sacred pilgrimage trek circumambulating Mount Kailash',
        difficulty: 'Hard',
        length_km: 56,
        duration_days: 3,
        best_season: 'July to September',
        price: 20000,
        maxParticipants: 18,
        location: 'Tibet, China',
        image: '⛩️',
        status: 'active'
      },
      {
        name: 'Roopkund Lake Trek',
        description: 'Trek to a mysterious glacial lake surrounded by high altitude meadows',
        difficulty: 'Moderate',
        length_km: 42,
        duration_days: 4,
        best_season: 'May to October',
        price: 7000,
        maxParticipants: 20,
        location: 'Uttarakhand, India',
        image: '🏞️',
        status: 'active'
      }
    ];

    for (const trail of trails) {
      await conn.query(
        'INSERT INTO trails (name, description, difficulty, length_km, duration_days, best_season, price, maxParticipants, location, image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [trail.name, trail.description, trail.difficulty, trail.length_km, trail.duration_days, trail.best_season, trail.price, trail.maxParticipants, trail.location, trail.image, trail.status]
      );
      console.log(`  ✓ Added: ${trail.name}`);
    }
    console.log(`✅ ${trails.length} trails seeded`);

    // Seed Destinations
    console.log('\n📝 Seeding Destinations...');
    const destinations = [
      {
        name: 'Kathmandu',
        description: 'The capital city of Nepal, known for ancient temples, bustling markets, and rich culture',
        location: 'Kathmandu Valley, Nepal',
        best_season: 'October to November, February to March',
        image_url: '🏯'
      },
      {
        name: 'Pokhara',
        description: 'Gateway to trekking adventures, famous for its lakes and mountain views',
        location: 'Western Nepal',
        best_season: 'October to November, March to May',
        image_url: '🏞️'
      },
      {
        name: 'Everest Region',
        description: 'Home to the world\'s highest mountain, offering incredible trekking opportunities',
        location: 'Eastern Nepal',
        best_season: 'September to October, March to May',
        image_url: '🏔️'
      },
      {
        name: 'Himachal Pradesh',
        description: 'Adventure capital of India with mountains, valleys, and adventure sports',
        location: 'Northern India',
        best_season: 'June to September, October to November',
        image_url: '⛰️'
      },
      {
        name: 'Ladakh',
        description: 'High altitude desert region with stunning landscapes and Buddhist monasteries',
        location: 'Northern India',
        best_season: 'June to September',
        image_url: '🏜️'
      },
      {
        name: 'Uttarakhand',
        description: 'Land of gods with pilgrim sites, trekking routes, and natural beauty',
        location: 'Northern India',
        best_season: 'May to October',
        image_url: '⛩️'
      }
    ];

    for (const dest of destinations) {
      await conn.query(
        'INSERT INTO destinations (name, description, location, best_season, image_url) VALUES (?, ?, ?, ?, ?)',
        [dest.name, dest.description, dest.location, dest.best_season, dest.image_url]
      );
      console.log(`  ✓ Added: ${dest.name}`);
    }
    console.log(`✅ ${destinations.length} destinations seeded`);

    console.log('\n✨ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    if (conn) conn.release();
    await pool.end();
  }
}

seedDatabase();
