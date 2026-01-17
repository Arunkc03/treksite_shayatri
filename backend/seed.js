const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Activity = require('./models/Activity');
const Trail = require('./models/Trail');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trek_api', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Activity.deleteMany({});
    await Trail.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed Activities
    const activities = await Activity.insertMany([
      {
        name: 'Mountain Hiking',
        description: 'Challenging mountain trek with scenic views',
        difficulty: 'Moderate',
        duration: '4 hours',
        price: 79,
        maxParticipants: 15,
        currentParticipants: 0,
        location: 'Nepal',
        date: new Date('2026-02-15'),
        image: '⛰️',
        status: 'active'
      },
      {
        name: 'Rock Climbing',
        description: 'Expert rock climbing adventure with certified guides',
        difficulty: 'Hard',
        duration: '6 hours',
        price: 120,
        maxParticipants: 8,
        currentParticipants: 0,
        location: 'India',
        date: new Date('2026-02-20'),
        image: '🧗',
        status: 'active'
      },
      {
        name: 'Trekking Expedition',
        description: 'Multi-day trekking experience through mountain ranges',
        difficulty: 'Hard',
        duration: '5 days',
        price: 249,
        maxParticipants: 20,
        currentParticipants: 0,
        location: 'Himalayas',
        date: new Date('2026-03-01'),
        image: '🏕️',
        status: 'active'
      },
      {
        name: 'Paragliding Adventure',
        description: 'Thrilling paragliding experience with professional instructors',
        difficulty: 'Moderate',
        duration: '2 hours',
        price: 150,
        maxParticipants: 10,
        currentParticipants: 0,
        location: 'Himachal Pradesh',
        date: new Date('2026-02-18'),
        image: '🪂',
        status: 'active'
      },
      {
        name: 'Camping & Bonfire',
        description: 'Relaxing camping experience with bonfire and stargazing',
        difficulty: 'Easy',
        duration: '8 hours',
        price: 45,
        maxParticipants: 25,
        currentParticipants: 0,
        location: 'Uttarkhand',
        date: new Date('2026-02-22'),
        image: '🔥',
        status: 'active'
      },
      {
        name: 'Waterfall Trek',
        description: 'Scenic waterfall trekking through lush forests',
        difficulty: 'Easy',
        duration: '3 hours',
        price: 59,
        maxParticipants: 20,
        currentParticipants: 0,
        location: 'Western Ghats',
        date: new Date('2026-02-25'),
        image: '💧',
        status: 'active'
      }
    ]);
    console.log(`✅ Seeded ${activities.length} activities`);

    // Seed Trails
    const trails = await Trail.insertMany([
      {
        name: 'Everest Base Camp',
        location: 'Nepal',
        difficulty: 'Hard',
        length: 65,
        elevation: 5364,
        description: 'Trek to the base camp of Mount Everest with stunning Himalayan views',
        image: '🏔️',
        rating: 4.8,
        reviews: 324,
        status: 'open'
      },
      {
        name: 'Annapurna Circuit',
        location: 'Nepal',
        difficulty: 'Hard',
        length: 160,
        elevation: 4130,
        description: 'Complete circuit around Annapurna massif with diverse ecosystems',
        image: '⛰️',
        rating: 4.7,
        reviews: 256,
        status: 'open'
      },
      {
        name: 'Manali to Leh',
        location: 'India',
        difficulty: 'Moderate',
        length: 485,
        elevation: 5328,
        description: 'High altitude road trek through Ladakh with breathtaking landscapes',
        image: '🛣️',
        rating: 4.9,
        reviews: 412,
        status: 'open'
      },
      {
        name: 'Valley of Flowers',
        location: 'Uttarkhand',
        difficulty: 'Easy',
        length: 25,
        elevation: 3660,
        description: 'Colorful valley with thousands of alpine flowers during bloom season',
        image: '🌸',
        rating: 4.6,
        reviews: 189,
        status: 'open'
      }
    ]);
    console.log(`✅ Seeded ${trails.length} trails`);

    // Seed Sample Users
    const users = await User.insertMany([
      {
        name: 'John Adventurer',
        email: 'john@example.com',
        password: 'password123', // In production, these should be hashed
        bio: 'Adventure enthusiast and mountain lover',
        phone: '+91 98765 43210',
        location: 'Nepal',
        role: 'user'
      },
      {
        name: 'Sarah Explorer',
        email: 'sarah@example.com',
        password: 'password123',
        bio: 'Travel blogger and trekking guide',
        phone: '+91 98765 43211',
        location: 'Himachal Pradesh',
        role: 'user'
      }
    ]);
    console.log(`✅ Seeded ${users.length} users`);

    console.log('🌟 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
