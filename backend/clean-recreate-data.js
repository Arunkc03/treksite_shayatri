const mysql = require('mysql2/promise');

async function cleanAndRecreateData() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'trek_api'
  });

  const conn = await pool.getConnection();

  // Delete all test data
  console.log('\n🗑️ Deleting old test data...');
  try {
    await conn.query('DELETE FROM itineraries WHERE title IN ("Everest Base Camp Trek", "Annapurna Base Camp Trek", "Langtang Valley Trek", "Manaslu Circuit Trek")');
    console.log('✅ Deleted itineraries');
    
    await conn.query('DELETE FROM activities WHERE name IN ("Paragliding", "Rock Climbing", "Rafting", "Mountain Biking", "Zip-lining", "Canyoning")');
    console.log('✅ Deleted activities');
    
    await conn.query('DELETE FROM destinations WHERE name IN ("Pokhara", "Kathmandu", "Chitwan", "Nagarkot", "Ilam", "Janakpur")');
    console.log('✅ Deleted destinations');
    
    await conn.query('DELETE FROM climbing WHERE name IN ("Mount Everest", "Cho Oyu", "Island Peak", "Kilimanjaro", "Mera Peak")');
    console.log('✅ Deleted climbing peaks');
    
    await conn.query('DELETE FROM reviews WHERE rating = 5 AND title IN ("Exceptional Trek!", "Amazing Adventure", "Highly Recommended", "Life Changing Experience", "Perfect Package")');
    console.log('✅ Deleted reviews');
  } catch (err) {
    console.log('⚠️ Delete error:', err.message);
  }

  // Image files available
  const idImages = [
    'id-1768378640227-465551986.jpg',
    'id-1768388171585-15665529.jpg',
    'id-1768399827852-533104367.jpg',
    'id-1768458823679-798623006.jpg',
    'id-1768482612297-774573960.png',
    'id-1768484144158-349889269.jpg'
  ];

  // New Activities with images
  const activities = [
    { name: 'Everest Summit Trek', description: 'Climb to the top of the world with expert guides', difficulty: 'Extreme', duration: 18, price: 95000, max_participants: 4, location: 'Sagarmatha', image: idImages[0] },
    { name: 'Annapurna Yoga Trek', description: 'Combine trekking with yoga and meditation', difficulty: 'Moderate', duration: 10, price: 35000, max_participants: 8, location: 'Annapurna', image: idImages[1] },
    { name: 'Langtang Wilderness', description: 'Experience pristine alpine valleys', difficulty: 'Easy', duration: 6, price: 18000, max_participants: 10, location: 'Langtang', image: idImages[2] },
    { name: 'Manaslu Challenge', description: 'Remote trek around Mount Manaslu', difficulty: 'Hard', duration: 20, price: 65000, max_participants: 6, location: 'Manaslu', image: idImages[3] },
    { name: 'Helicopter Mountain Tour', description: 'Aerial views of Himalayan peaks', difficulty: 'Easy', duration: 4, price: 28000, max_participants: 5, location: 'Kathmandu', image: idImages[4] },
    { name: 'Scenic Valley Camping', description: 'Camp under the stars in beautiful valleys', difficulty: 'Easy', duration: 5, price: 12000, max_participants: 12, location: 'Pokhara', image: idImages[5] }
  ];

  // New Destinations with images
  const destinations = [
    { name: 'Mount Kanchenjunga', location: 'Eastern Nepal', country: 'Nepal', description: 'Third highest mountain with pristine beauty and Himalayan wilderness', best_season: 'Sep-Oct, Mar-May', images: idImages[0], highlights: JSON.stringify(['Pristine Alpine Beauty', 'Mountain Views', 'Remote Trek']) },
    { name: 'Phewa Lake Pokhara', location: 'Western Nepal', country: 'Nepal', description: 'Serene lake surrounded by mountains and adventure activities', best_season: 'Oct-Nov, Feb-Apr', images: idImages[1], highlights: JSON.stringify(['Water Sports', 'Mountain Reflection', 'Paragliding']) },
    { name: 'Sagarmatha Base', location: 'Everest Region', country: 'Nepal', description: 'Base camp of the world\'s highest mountain with trekking trails', best_season: 'Sep-Oct, Mar-May', images: idImages[2], highlights: JSON.stringify(['Everest Views', 'Sherpa Culture', 'High Altitude']) },
    { name: 'Rara Lake', location: 'Far Western Nepal', country: 'Nepal', description: 'Nepal\'s largest and deepest lake with peaceful surroundings', best_season: 'Oct-Nov, Mar-May', images: idImages[3], highlights: JSON.stringify(['Pristine Lake', 'Fishing', 'Wildlife']) },
    { name: 'Panauti River', location: 'Central Nepal', country: 'Nepal', description: 'Historic river valley with cultural heritage and adventure', best_season: 'Oct-Dec', images: idImages[4], highlights: JSON.stringify(['Rafting', 'Historical Sites', 'Villages']) },
    { name: 'Karnali Gorge', location: 'Western Nepal', country: 'Nepal', description: 'Deep gorge with dramatic cliffs and river adventures', best_season: 'Sep-Nov', images: idImages[5], highlights: JSON.stringify(['Gorge Trekking', 'River Rafting', 'Wildlife']) }
  ];

  // New Climbing peaks with images
  const climbing = [
    { name: 'Ama Dablam', location: 'Everest Region', difficulty: 'Hard', height_meters: 6812, routes_count: 8, description: 'Stunning pyramid peak known as Matterhorn of Nepal', price: 42000, image: idImages[0], lat: 27.8458, lng: 86.8608 },
    { name: 'Lobuche Peak', location: 'Everest Region', difficulty: 'Moderate', height_meters: 6145, routes_count: 5, description: 'Popular climbing peak with excellent views', price: 22000, image: idImages[1], lat: 27.9639, lng: 86.9186 },
    { name: 'Thamserku', location: 'Everest Region', difficulty: 'Hard', height_meters: 6623, routes_count: 6, description: 'Dramatic peak with challenging routes', price: 38000, image: idImages[2], lat: 27.8042, lng: 87.0025 },
    { name: 'Baruntse', location: 'Everest Region', difficulty: 'Extreme', height_meters: 7129, routes_count: 4, description: 'Remote high altitude climbing challenge', price: 58000, image: idImages[3], lat: 27.8333, lng: 86.9167 },
    { name: 'Naya Kanga', location: 'Langtang Region', difficulty: 'Easy', height_meters: 5844, routes_count: 3, description: 'Perfect introductory mountaineering peak', price: 14000, image: idImages[4], lat: 28.2128, lng: 85.5236 }
  ];

  // New Itineraries with images
  const itineraries = [
    { title: 'Kanchenjunga Trek - 21 Days', description: 'Trek around the third highest mountain with pristine landscapes and local culture', duration_days: 21, difficulty: 'Hard', price: 72000, location: 'Kanchenjunga', best_season: 'Sep-Oct, Mar-May', image: idImages[0], highlights: JSON.stringify(['Remote Wilderness', 'Mountain Views', 'Sherpa Villages']), dayByDayPlan: JSON.stringify([{day: 1, place: 'Kathmandu', activity: 'Preparation'}, {day: 21, place: 'Return', activity: 'Complete'}]), includes: JSON.stringify(['Guide', 'Porter', 'Meals', 'Permits']), excludes: JSON.stringify(['Flight', 'Insurance']) },
    { title: 'Rara Lake Adventure - 8 Days', description: 'Journey to Nepal\'s largest lake with pristine nature and cultural immersion', duration_days: 8, difficulty: 'Moderate', price: 28000, location: 'Rara Lake', best_season: 'Oct-Nov, Mar-May', image: idImages[1], highlights: JSON.stringify(['Largest Lake', 'Alpine Views', 'Local Culture']), dayByDayPlan: JSON.stringify([{day: 1, place: 'Kathmandu', activity: 'Start'}, {day: 8, place: 'Return', activity: 'End'}]), includes: JSON.stringify(['Transport', 'Guide', 'Meals']), excludes: JSON.stringify(['Equipment']) },
    { title: 'Rolwaling Valley Escape - 12 Days', description: 'Hidden valley trek with glaciers, yak herds, and stunning Himalayan panoramas', duration_days: 12, difficulty: 'Moderate', price: 38000, location: 'Rolwaling', best_season: 'May-Jun, Sep-Oct', image: idImages[2], highlights: JSON.stringify(['Glaciers', 'Mountain Passes', 'Yak Herds']), dayByDayPlan: JSON.stringify([{day: 1, place: 'Start', activity: 'Begin Trek'}, {day: 12, place: 'End', activity: 'Complete'}]), includes: JSON.stringify(['Guide', 'Porter', 'All Meals']), excludes: JSON.stringify(['Personal Gear']) },
    { title: 'Makalu Base Camp - 16 Days', description: 'Trek to the fifth highest mountain with remote trails and breathtaking views', duration_days: 16, difficulty: 'Hard', price: 55000, location: 'Makalu', best_season: 'Sep-Oct, Mar-May', image: idImages[3], highlights: JSON.stringify(['High Altitude', 'Remote Trek', 'Peak Views']), dayByDayPlan: JSON.stringify([{day: 1, place: 'Trek Start', activity: 'Begin'}, {day: 16, place: 'Complete', activity: 'End Trek'}]), includes: JSON.stringify(['Expert Guide', 'Porter', 'Permits']), excludes: JSON.stringify(['Insurance']) }
  ];

  // New Reviews with 5/5 ratings
  const reviews = [
    { name: 'David Miller', email: 'david@example.com', rating: 5, title: 'Unforgettable Himalayan Adventure', review: 'The trek was absolutely incredible. Professional guides, breathtaking views, and perfectly organized.' },
    { name: 'Lisa Anderson', email: 'lisa@example.com', rating: 5, title: 'Best Travel Experience Ever', review: 'Exceeded all my expectations. Amazing mountain scenery and wonderful local guides.' },
    { name: 'Robert Taylor', email: 'robert@example.com', rating: 5, title: 'Highly Professional Service', review: 'Excellent organization, safety measures, and customer care. Highly recommended!' },
    { name: 'Jennifer Martinez', email: 'jenny@example.com', rating: 5, title: 'Life Changing Journey', review: 'This was the adventure of a lifetime. Stunning landscapes and genuine local experiences.' },
    { name: 'Christopher Lee', email: 'chris@example.com', rating: 5, title: 'Perfect Mountaineering Experience', review: 'Professional guides, proper acclimatization, and safe climbing practices. Perfect trip!' }
  ];

  // Insert new Activities
  console.log('\n📋 Adding new Activities...');
  for (const activity of activities) {
    try {
      await conn.query(
        'INSERT INTO activities (name, description, difficulty, duration, price, max_participants, location, image, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        [activity.name, activity.description, activity.difficulty, activity.duration, activity.price, activity.max_participants, activity.location, `uploads/ids/${activity.image}`]
      );
      console.log('✅ Added:', activity.name);
    } catch (err) {
      console.log('⚠️', activity.name, ':', err.message);
    }
  }

  // Insert new Destinations
  console.log('\n🌍 Adding new Destinations...');
  for (const dest of destinations) {
    try {
      await conn.query(
        'INSERT INTO destinations (name, location, country, description, best_season, images, highlights, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [dest.name, dest.location, dest.country, dest.description, dest.best_season, `uploads/ids/${dest.images}`, dest.highlights]
      );
      console.log('✅ Added:', dest.name);
    } catch (err) {
      console.log('⚠️', dest.name, ':', err.message);
    }
  }

  // Insert new Climbing Peaks
  console.log('\n🏔️ Adding new Climbing Peaks...');
  for (const peak of climbing) {
    try {
      await conn.query(
        'INSERT INTO climbing (name, location, difficulty, height_meters, routes_count, description, price, image, lat, lng, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [peak.name, peak.location, peak.difficulty, peak.height_meters, peak.routes_count, peak.description, peak.price, `uploads/ids/${peak.image}`, peak.lat, peak.lng]
      );
      console.log('✅ Added:', peak.name);
    } catch (err) {
      console.log('⚠️', peak.name, ':', err.message);
    }
  }

  // Insert new Itineraries
  console.log('\n✨ Adding new Itineraries...');
  for (const itin of itineraries) {
    try {
      await conn.query(
        'INSERT INTO itineraries (title, description, duration_days, difficulty, price, location, best_season, image, highlights, dayByDayPlan, includes, excludes, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [itin.title, itin.description, itin.duration_days, itin.difficulty, itin.price, itin.location, itin.best_season, `uploads/ids/${itin.image}`, itin.highlights, itin.dayByDayPlan, itin.includes, itin.excludes, 'active']
      );
      console.log('✅ Added:', itin.title);
    } catch (err) {
      console.log('⚠️', itin.title, ':', err.message);
    }
  }

  // Insert new Reviews
  console.log('\n⭐ Adding new Reviews (All 5/5)...');
  for (const review of reviews) {
    try {
      await conn.query(
        'INSERT INTO reviews (name, email, rating, title, review, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [review.name, review.email, review.rating, review.title, review.review, 'approved']
      );
      console.log('✅ Added:', review.title);
    } catch (err) {
      console.log('⚠️', review.title, ':', err.message);
    }
  }

  conn.release();
  await pool.end();
  console.log('\n✅ Database cleaned and new data created with images!');
  process.exit(0);
}

cleanAndRecreateData().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
