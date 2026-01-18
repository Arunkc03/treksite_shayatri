const mysql = require('mysql2/promise');

async function addAllSampleData() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'trek_api'
  });

  const conn = await pool.getConnection();

  // ACTIVITIES DATA
  const activities = [
    { name: 'Paragliding', description: 'Experience thrilling paragliding with breathtaking Himalayan views from Pokhara', difficulty: 'Advanced', duration: 3, price: 5000, max_participants: 2, location: 'Pokhara', image: 'paragliding.jpg' },
    { name: 'Rock Climbing', description: 'Challenge yourself with guided rock climbing on pristine rock faces', difficulty: 'Hard', duration: 2, price: 8000, max_participants: 4, location: 'Kathmandu Valley', image: 'climbing.jpg' },
    { name: 'Rafting', description: 'White water rafting adventure through stunning gorges', difficulty: 'Moderate', duration: 4, price: 4000, max_participants: 8, location: 'Trishuli River', image: 'rafting.jpg' },
    { name: 'Mountain Biking', description: 'Explore trails through forests and villages on two wheels', difficulty: 'Easy', duration: 5, price: 3000, max_participants: 6, location: 'Kathmandu Valley', image: 'biking.jpg' },
    { name: 'Zip-lining', description: 'Soar through the air with panoramic views', difficulty: 'Easy', duration: 2, price: 2500, max_participants: 10, location: 'Pokhara', image: 'ziplining.jpg' },
    { name: 'Canyoning', description: 'Descend into scenic canyons with water adventures', difficulty: 'Hard', duration: 6, price: 6000, max_participants: 5, location: 'Bhote Koshi', image: 'canyoning.jpg' }
  ];

  // DESTINATIONS DATA
  const destinations = [
    { name: 'Pokhara', location: 'Western Nepal', country: 'Nepal', description: 'Beautiful lakeside city with stunning Annapurna views', best_season: 'Oct-Nov, Mar-Apr', images: 'pokhara.jpg', highlights: JSON.stringify(['Fewa Lake', 'Annapurna Views', 'Adventure Sports']) },
    { name: 'Kathmandu', location: 'Central Nepal', country: 'Nepal', description: 'Historic capital with ancient temples and vibrant culture', best_season: 'Sep-Nov, Mar-May', images: 'kathmandu.jpg', highlights: JSON.stringify(['Durbar Square', 'Pashupatinath', 'Buddhist Temples']) },
    { name: 'Chitwan', location: 'Southern Nepal', country: 'Nepal', description: 'National park with wildlife safaris and jungle adventures', best_season: 'Oct-Feb', images: 'chitwan.jpg', highlights: JSON.stringify(['Rhino Safari', 'Jungle Walks', 'Elephant Rides']) },
    { name: 'Nagarkot', location: 'Kathmandu Valley', country: 'Nepal', description: 'Hill station with sunrise views and Himalayan panoramas', best_season: 'Sep-May', images: 'nagarkot.jpg', highlights: JSON.stringify(['Sunrise Views', 'Himalayan Vista', 'Hiking Trails']) },
    { name: 'Ilam', location: 'Eastern Nepal', country: 'Nepal', description: 'Tea gardens and cultural hub in eastern Nepal', best_season: 'Oct-Dec', images: 'ilam.jpg', highlights: JSON.stringify(['Tea Plantations', 'Local Culture', 'Scenic Views']) },
    { name: 'Janakpur', location: 'Central Nepal', country: 'Nepal', description: 'Religious pilgrimage site and cultural heritage center', best_season: 'Oct-Feb', images: 'janakpur.jpg', highlights: JSON.stringify(['Janaki Mandir', 'Religious Site', 'Cultural Festivals']) }
  ];

  // CLIMBING DATA
  const climbing = [
    { name: 'Mount Everest', location: 'Sagarmatha', difficulty: 'Extreme', height_meters: 8848, routes_count: 15, description: 'World\'s highest peak - ultimate climbing challenge', price: 100000, image: 'everest.jpg', lat: 27.9881, lng: 86.9250 },
    { name: 'Cho Oyu', location: 'Makalu', difficulty: 'Hard', height_meters: 8188, routes_count: 8, description: 'Beautiful peak with moderate difficulty for serious climbers', price: 35000, image: 'choyu.jpg', lat: 27.8940, lng: 86.6686 },
    { name: 'Island Peak', location: 'Everest Region', difficulty: 'Moderate', height_meters: 6189, routes_count: 6, description: 'Popular beginner mountaineering peak', price: 15000, image: 'islandpeak.jpg', lat: 27.7700, lng: 86.9383 },
    { name: 'Kilimanjaro', location: 'Tanzania', difficulty: 'Moderate', height_meters: 5895, routes_count: 6, description: 'Africa\'s highest peak with stunning views', price: 20000, image: 'kilimanjaro.jpg', lat: -3.0674, lng: 37.3556 },
    { name: 'Mera Peak', location: 'Everest Region', difficulty: 'Moderate', height_meters: 6476, routes_count: 5, description: 'Spectacular peak for mountaineering enthusiasts', price: 18000, image: 'meapeak.jpg', lat: 27.6383, lng: 86.9850 }
  ];

  // Insert Activities
  console.log('\n📋 Adding Activities...');
  for (const activity of activities) {
    try {
      await conn.query(
        'INSERT INTO activities (name, description, difficulty, duration, price, max_participants, location, image, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        [activity.name, activity.description, activity.difficulty, activity.duration, activity.price, activity.max_participants, activity.location, activity.image]
      );
      console.log('✅ Added:', activity.name);
    } catch (err) {
      if (err.code !== 'ER_DUP_ENTRY') console.log('⚠️', activity.name, ':', err.message);
    }
  }

  // Insert Destinations
  console.log('\n🌍 Adding Destinations...');
  for (const dest of destinations) {
    try {
      await conn.query(
        'INSERT INTO destinations (name, location, country, description, best_season, images, highlights, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [dest.name, dest.location, dest.country, dest.description, dest.best_season, dest.images, dest.highlights]
      );
      console.log('✅ Added:', dest.name);
    } catch (err) {
      if (err.code !== 'ER_DUP_ENTRY') console.log('⚠️', dest.name, ':', err.message);
    }
  }

  // Insert Climbing Peaks
  console.log('\n🏔️ Adding Climbing Peaks...');
  for (const peak of climbing) {
    try {
      await conn.query(
        'INSERT INTO climbing (name, location, difficulty, height_meters, routes_count, description, price, image, lat, lng, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [peak.name, peak.location, peak.difficulty, peak.height_meters, peak.routes_count, peak.description, peak.price, peak.image, peak.lat, peak.lng]
      );
      console.log('✅ Added:', peak.name);
    } catch (err) {
      if (err.code !== 'ER_DUP_ENTRY') console.log('⚠️', peak.name, ':', err.message);
    }
  }

  // Insert Reviews with 5/5 ratings
  console.log('\n⭐ Adding Reviews (All 5/5 ratings)...');
  const reviews = [
    { name: 'John Doe', email: 'john@example.com', rating: 5, title: 'Exceptional Trek!', review: 'Best trekking experience ever. Guides were knowledgeable and professional.' },
    { name: 'Sarah Smith', email: 'sarah@example.com', rating: 5, title: 'Amazing Adventure', review: 'Exceeded all expectations. Stunning views and great service.' },
    { name: 'Michael Brown', email: 'michael@example.com', rating: 5, title: 'Highly Recommended', review: 'Worth every penny. Professional team and excellent organization.' },
    { name: 'Emma Wilson', email: 'emma@example.com', rating: 5, title: 'Life Changing Experience', review: 'One of the best adventures of my life. Incredible memories!' },
    { name: 'James Johnson', email: 'james@example.com', rating: 5, title: 'Perfect Package', review: 'Everything was perfect from start to finish. Highly satisfied!' }
  ];

  for (const review of reviews) {
    try {
      await conn.query(
        'INSERT INTO reviews (name, email, rating, title, review, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [review.name, review.email, review.rating, review.title, review.review, 'approved']
      );
      console.log('✅ Added:', review.title);
    } catch (err) {
      if (err.code !== 'ER_DUP_ENTRY') console.log('⚠️', review.title, ':', err.message);
    }
  }

  conn.release();
  await pool.end();
  console.log('\n✅ All sample data loaded successfully!');
  process.exit(0);
}

addAllSampleData().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
