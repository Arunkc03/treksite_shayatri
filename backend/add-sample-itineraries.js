const mysql = require('mysql2/promise');

async function addSampleItineraries() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'trek_api'
  });

  const conn = await pool.getConnection();
  
  const itineraries = [
    {
      title: 'Everest Base Camp Trek',
      description: 'Trek to the base camp of the world\'s highest mountain with stunning Himalayan views',
      duration_days: 14,
      difficulty: 'Moderate',
      price: 45000,
      location: 'Sagarmatha',
      best_season: 'Sep - May',
      image: '🏔️',
      highlights: JSON.stringify(['Visit Kala Pathar viewpoint for sunrise', 'Acclimatization in Namche Bazaar', 'Experience Sherpa culture', 'Trek through alpine forests', 'Stay in authentic teahouses']),
      dayByDayPlan: JSON.stringify([
        {day: 1, place: 'Kathmandu', activity: 'Arrival and orientation'},
        {day: 2, place: 'Kathmandu to Phakding', activity: 'Trek begins through Dudh Kosi valley'},
        {day: 3, place: 'Phakding to Namche', activity: 'Steep climb with Everest views'},
        {day: 4, place: 'Namche Bazaar', activity: 'Acclimatization day'},
        {day: 14, place: 'Return to Kathmandu', activity: 'End of trek'}
      ]),
      includes: JSON.stringify(['Expert guide', 'Porter', 'Meals', 'Accommodation', 'Permits', 'Transfer']),
      excludes: JSON.stringify(['Flights', 'Insurance', 'Personal gear', 'Tips']),
      status: 'active'
    },
    {
      title: 'Annapurna Base Camp Trek',
      description: 'Experience stunning views of Annapurna massif with diverse landscapes',
      duration_days: 7,
      difficulty: 'Moderate',
      price: 25000,
      location: 'Annapurna',
      best_season: 'Oct - Nov, Mar - Apr',
      image: '⛰️',
      highlights: JSON.stringify(['Base Camp at 4,130m', 'Panoramic views', 'Diverse zones', 'Local villages', 'Great for most trekkers']),
      dayByDayPlan: JSON.stringify([
        {day: 1, place: 'Kathmandu to Pokhara', activity: 'Travel'},
        {day: 7, place: 'Return', activity: 'Descend'}
      ]),
      includes: JSON.stringify(['Guide', 'Porter', 'Accommodation', 'Meals', 'Permits']),
      excludes: JSON.stringify(['Equipment', 'Insurance']),
      status: 'active'
    },
    {
      title: 'Langtang Valley Trek',
      description: 'Alpine valley with pristine forests and authentic Tamang villages',
      duration_days: 5,
      difficulty: 'Easy',
      price: 15000,
      location: 'Langtang',
      best_season: 'Mar - May, Sep - Nov',
      image: '🗻',
      highlights: JSON.stringify(['Beautiful valley', 'Kyanjin Gompa', 'Yak cheese', 'Diverse flora', 'Close to Kathmandu']),
      dayByDayPlan: JSON.stringify([
        {day: 1, place: 'Kathmandu to Syabru', activity: 'Trek start'},
        {day: 5, place: 'Return', activity: 'Complete'}
      ]),
      includes: JSON.stringify(['Guide', 'Meals', 'Accommodation']),
      excludes: JSON.stringify(['Equipment']),
      status: 'active'
    },
    {
      title: 'Manaslu Circuit Trek',
      description: 'Remote trek around Mount Manaslu with pristine wilderness',
      duration_days: 18,
      difficulty: 'Hard',
      price: 55000,
      location: 'Manaslu',
      best_season: 'Sep - Oct, Mar - May',
      image: '🏔️',
      highlights: JSON.stringify(['Larkya La pass', 'Remote villages', 'Heritage sites', 'Diverse landscapes', 'Off beaten path']),
      dayByDayPlan: JSON.stringify([
        {day: 1, place: 'Sotikhola', activity: 'Trek start'},
        {day: 18, place: 'Complete', activity: 'Circuit done'}
      ]),
      includes: JSON.stringify(['Expert guide', 'Porter', 'Meals', 'Permits']),
      excludes: JSON.stringify(['Equipment', 'Insurance']),
      status: 'active'
    }
  ];

  for (const itin of itineraries) {
    try {
      await conn.query(
        'INSERT INTO itineraries (title, description, duration_days, difficulty, price, location, best_season, image, highlights, dayByDayPlan, includes, excludes, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [itin.title, itin.description, itin.duration_days, itin.difficulty, itin.price, itin.location, itin.best_season, itin.image, itin.highlights, itin.dayByDayPlan, itin.includes, itin.excludes, itin.status]
      );
      console.log('✅ Added:', itin.title);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.log('⚠️ Already exists:', itin.title);
      } else {
        console.log('❌ Error:', err.message);
      }
    }
  }
  
  conn.release();
  await pool.end();
  console.log('\n✅ All sample itineraries loaded!');
  process.exit(0);
}

addSampleItineraries().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
