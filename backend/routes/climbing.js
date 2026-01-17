// Climbing Routes
const express = require('express');
const router = express.Router();
// Note: Authentication middleware to be implemented later

// Get all climbing spots (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { difficulty, rockType, location } = req.query;
    let query = 'SELECT * FROM climbing WHERE 1=1';
    const params = [];

    if (difficulty) {
      query += ' AND difficulty = ?';
      params.push(difficulty);
    }

    if (rockType) {
      query += ' AND rock_type = ?';
      params.push(rockType);
    }

    if (location) {
      query += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }

    query += ' ORDER BY created_at DESC';

    const conn = await req.db.getConnection();
    const [spots] = await conn.query(query, params);
    conn.release();

    res.json({ success: true, climbing: spots });
  } catch (error) {
    console.error('Error fetching climbing spots:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single climbing spot by ID
router.get('/:id', async (req, res) => {
  try {
    const conn = await req.db.getConnection();
    const [spots] = await conn.query('SELECT * FROM climbing WHERE id = ?', [req.params.id]);
    conn.release();
    
    if (spots.length === 0) {
      return res.status(404).json({ success: false, message: 'Climbing spot not found' });
    }

    res.json({ success: true, climbing: spots[0] });
  } catch (error) {
    console.error('Error fetching climbing spot:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new climbing spot (admin only - auth to be implemented)
router.post('/', async (req, res) => {
  try {
    const { name, location, difficulty, rockType, heightMeters, routesCount, description, image, lat, lng, price } = req.body;
    
    const query = `
      INSERT INTO climbing (
        name, location, difficulty, rock_type, height_meters, 
        routes_count, description, image, lat, lng, price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const conn = await req.db.getConnection();
    const [result] = await conn.query(query, [
      name,
      location,
      difficulty,
      rockType,
      heightMeters,
      routesCount,
      description,
      image || '🧗',
      lat,
      lng,
      price ? parseFloat(price) : 0
    ]);

    // Fetch and return the created record
    const [created] = await conn.query('SELECT * FROM climbing WHERE id = ?', [result.insertId]);
    conn.release();

    res.status(201).json({ 
      success: true, 
      climbing: created[0]
    });
  } catch (error) {
    console.error('Error creating climbing spot:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update climbing spot (admin only - auth to be implemented)
router.put('/:id', async (req, res) => {
  try {
    const { name, location, difficulty, rockType, heightMeters, routesCount, description, image, lat, lng, price } = req.body;
    
    const query = `
      UPDATE climbing SET 
        name = ?, 
        location = ?, 
        difficulty = ?, 
        rock_type = ?, 
        height_meters = ?, 
        routes_count = ?, 
        description = ?, 
        image = ?,
        lat = ?,
        lng = ?,
        price = ?
      WHERE id = ?
    `;

    const conn = await req.db.getConnection();
    await conn.query(query, [
      name,
      location,
      difficulty,
      rockType,
      heightMeters,
      routesCount,
      description,
      image,
      lat,
      lng,
      price ? parseFloat(price) : 0,
      req.params.id
    ]);

    // Fetch and return the updated record
    const [updated] = await conn.query('SELECT * FROM climbing WHERE id = ?', [req.params.id]);
    conn.release();

    res.json({ success: true, climbing: updated[0] });
  } catch (error) {
    console.error('Error updating climbing spot:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete climbing spot (admin only - auth to be implemented)
router.delete('/:id', async (req, res) => {
  try {
    const conn = await req.db.getConnection();
    await conn.query('DELETE FROM climbing WHERE id = ?', [req.params.id]);
    conn.release();
    
    res.json({ success: true, message: 'Climbing spot deleted successfully' });
  } catch (error) {
    console.error('Error deleting climbing spot:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
