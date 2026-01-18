const express = require('express');
const router = express.Router();

// Global search across all content types
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.json({ 
        success: true, 
        trails: [], 
        activities: [], 
        destinations: [],
        itineraries: []
      });
    }

    const searchQuery = `%${q}%`;
    const conn = await req.db.getConnection();

    // Search trails
    const [trails] = await conn.query(
      'SELECT id, name, description, difficulty, length_km, location, price, image FROM trails WHERE name LIKE ? OR description LIKE ? OR location LIKE ? LIMIT 8',
      [searchQuery, searchQuery, searchQuery]
    );

    // Search activities
    const [activities] = await conn.query(
      'SELECT id, name, description, difficulty, location, price, image FROM activities WHERE name LIKE ? OR description LIKE ? OR location LIKE ? LIMIT 8',
      [searchQuery, searchQuery, searchQuery]
    );

    // Search destinations
    const [destinations] = await conn.query(
      'SELECT id, name, description, location, best_season, image_url FROM destinations WHERE name LIKE ? OR description LIKE ? OR location LIKE ? LIMIT 8',
      [searchQuery, searchQuery, searchQuery]
    );

    // Search itineraries
    const [itineraries] = await conn.query(
      'SELECT id, title, description, location, best_season, image FROM itineraries WHERE title LIKE ? OR description LIKE ? OR location LIKE ? LIMIT 8',
      [searchQuery, searchQuery, searchQuery]
    );

    conn.release();

    res.json({
      success: true,
      query: q,
      trails,
      activities,
      destinations,
      itineraries,
      totalResults: trails.length + activities.length + destinations.length + itineraries.length
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, error: 'Search failed' });
  }
});

module.exports = router;
