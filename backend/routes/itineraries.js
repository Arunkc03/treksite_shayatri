const express = require('express');
const router = express.Router();
const Itinerary = require('../models/Itinerary');

// Get all itineraries
router.get('/', async (req, res) => {
  try {
    const conn = await req.db.getConnection();
    const itineraries = await Itinerary.getAll(conn);
    conn.release();
    res.json({ success: true, itineraries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single itinerary
router.get('/:id', async (req, res) => {
  try {
    const conn = await req.db.getConnection();
    const itinerary = await Itinerary.getById(conn, req.params.id);
    conn.release();
    
    if (!itinerary) {
      return res.status(404).json({ success: false, error: 'Itinerary not found' });
    }
    res.json({ success: true, itinerary });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create itinerary (admin only)
router.post('/', async (req, res) => {
  try {
    const { title, description, duration_days, difficulty, price, location, best_season, image, highlights, dayByDayPlan, includes, excludes } = req.body;

    // Validation
    if (!title || !description || !duration_days || !price || !location || !best_season) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const conn = await req.db.getConnection();
    const id = await Itinerary.create(conn, {
      title,
      description,
      duration_days,
      difficulty: difficulty || 'Moderate',
      price,
      location,
      best_season,
      image: image || '🗺️',
      highlights: highlights || [],
      dayByDayPlan: dayByDayPlan || [],
      includes: includes || [],
      excludes: excludes || [],
      status: 'active'
    });

    const itinerary = await Itinerary.getById(conn, id);
    conn.release();
    res.status(201).json({ success: true, itinerary });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update itinerary (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { title, description, duration_days, difficulty, price, location, best_season, image, highlights, dayByDayPlan, includes, excludes, status } = req.body;

    const conn = await req.db.getConnection();
    const itinerary = await Itinerary.getById(conn, req.params.id);
    
    if (!itinerary) {
      conn.release();
      return res.status(404).json({ success: false, error: 'Itinerary not found' });
    }

    const updated = await Itinerary.update(conn, req.params.id, {
      title,
      description,
      duration_days,
      difficulty,
      price,
      location,
      best_season,
      image,
      highlights,
      dayByDayPlan,
      includes,
      excludes,
      status
    });

    if (updated) {
      const updatedItinerary = await Itinerary.getById(conn, req.params.id);
      conn.release();
      res.json({ success: true, itinerary: updatedItinerary });
    } else {
      conn.release();
      res.status(400).json({ success: false, error: 'Failed to update itinerary' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete itinerary (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const conn = await req.db.getConnection();
    const deleted = await Itinerary.delete(conn, req.params.id);
    conn.release();
    
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Itinerary not found' });
    }
    res.json({ success: true, message: 'Itinerary deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Search itineraries
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const conn = await req.db.getConnection();
    const itineraries = await Itinerary.search(conn, query);
    conn.release();
    res.json({ success: true, itineraries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
