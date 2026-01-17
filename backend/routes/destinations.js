const express = require('express');
const router = express.Router();

// GET all destinations
router.get('/', async (req, res) => {
  try {
    const [destinations] = await req.db.query(
      'SELECT * FROM destinations ORDER BY created_at DESC'
    );
    res.json(destinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

// GET single destination
router.get('/:id', async (req, res) => {
  try {
    const [destinations] = await req.db.query(
      'SELECT * FROM destinations WHERE id = ?',
      [req.params.id]
    );
    
    if (destinations.length === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    res.json(destinations[0]);
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({ error: 'Failed to fetch destination' });
  }
});

// POST create new destination
router.post('/', async (req, res) => {
  try {
    const { name, description, location, best_season, image_url, images, video_url, videos } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const [result] = await req.db.query(
      'INSERT INTO destinations (name, description, location, best_season, image_url, images, video_url, videos) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description || null, location || null, best_season || null, image_url || null, images || null, video_url || null, videos || null]
    );
    
    res.status(201).json({
      id: result.insertId,
      name,
      description,
      location,
      best_season,
      image_url,
      images,
      video_url,
      videos
    });
  } catch (error) {
    console.error('Error creating destination:', error);
    res.status(500).json({ error: 'Failed to create destination' });
  }
});

// PUT update destination
router.put('/:id', async (req, res) => {
  try {
    const { name, description, location, best_season, image_url, images, video_url, videos } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const [result] = await req.db.query(
      'UPDATE destinations SET name = ?, description = ?, location = ?, best_season = ?, image_url = ?, images = ?, video_url = ?, videos = ? WHERE id = ?',
      [name, description || null, location || null, best_season || null, image_url || null, images || null, video_url || null, videos || null, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    res.json({
      id: parseInt(req.params.id),
      name,
      description,
      location,
      best_season,
      image_url,
      images,
      video_url,
      videos
    });
  } catch (error) {
    console.error('Error updating destination:', error);
    res.status(500).json({ error: 'Failed to update destination' });
  }
});

// DELETE destination
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await req.db.query(
      'DELETE FROM destinations WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    res.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    console.error('Error deleting destination:', error);
    res.status(500).json({ error: 'Failed to delete destination' });
  }
});

module.exports = router;
