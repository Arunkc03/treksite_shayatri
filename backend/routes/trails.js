const express = require('express');
const router = express.Router();

// GET all trails with optional filtering
router.get('/', async (req, res) => {
  try {
    const { difficulty, location, q } = req.query;
    let query = 'SELECT * FROM trails WHERE 1=1';
    const params = [];

    if (difficulty) {
      query += ' AND difficulty = ?';
      params.push(difficulty);
    }

    if (location) {
      query += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }

    if (q) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }

    const conn = await req.db.getConnection();
    const [trails] = await conn.query(query, params);
    conn.release();

    res.json({ 
      success: true, 
      trails: trails,
      total: trails.length 
    });
  } catch (error) {
    console.error('Error fetching trails:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch trails' });
  }
});

// GET single trail by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await req.db.getConnection();
    const [trail] = await conn.query('SELECT * FROM trails WHERE id = ?', [id]);
    conn.release();

    if (trail.length === 0) {
      return res.status(404).json({ success: false, error: 'Trail not found' });
    }

    res.json({ success: true, trail: trail[0] });
  } catch (error) {
    console.error('Error fetching trail:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch trail' });
  }
});

// POST create new trail
router.post('/', async (req, res) => {
  try {
    const {
      name,
      location,
      difficulty,
      length_km,
      description,
      image,
      price,
      contact,
      lat,
      lng
    } = req.body;

    // Validation
    if (!name || !location) {
      return res.status(400).json({ success: false, error: 'Missing required fields: name and location' });
    }

    const conn = await req.db.getConnection();
    const [result] = await conn.query(
      'INSERT INTO trails (name, location, difficulty, length_km, description, image, price, contact, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, location, difficulty || 'Moderate', length_km ? parseFloat(length_km) : null, description || '', image || '⛰️', price ? parseFloat(price) : null, contact || '', lat ? parseFloat(lat) : null, lng ? parseFloat(lng) : null]
    );
    conn.release();

    res.status(201).json({ 
      success: true, 
      trail: {
        id: result.insertId,
        name,
        location,
        difficulty: difficulty || 'Moderate',
        length_km: length_km ? parseFloat(length_km) : null,
        description: description || '',
        image: image || '⛰️',
        price: price ? parseFloat(price) : null,
        contact: contact || '',
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null
      }
    });
  } catch (error) {
    console.error('Error creating trail:', error);
    res.status(500).json({ success: false, error: 'Failed to create trail: ' + error.message });
  }
});

// PUT update trail
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      location,
      difficulty,
      length_km,
      description,
      image,
      price,
      contact,
      lat,
      lng
    } = req.body;

    const conn = await req.db.getConnection();
    const [result] = await conn.query(
      'UPDATE trails SET name = ?, location = ?, difficulty = ?, length_km = ?, description = ?, image = ?, price = ?, contact = ?, lat = ?, lng = ? WHERE id = ?',
      [name, location, difficulty || 'Moderate', length_km ? parseFloat(length_km) : null, description || '', image || '⛰️', price ? parseFloat(price) : null, contact || '', lat ? parseFloat(lat) : null, lng ? parseFloat(lng) : null, id]
    );
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Trail not found' });
    }

    res.json({ success: true, message: 'Trail updated successfully' });
  } catch (error) {
    console.error('Error updating trail:', error);
    res.status(500).json({ success: false, error: 'Failed to update trail: ' + error.message });
  }
});

// DELETE trail
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await req.db.getConnection();
    const [result] = await conn.query('DELETE FROM trails WHERE id = ?', [id]);
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Trail not found' });
    }

    res.json({ success: true, message: 'Trail deleted successfully' });
  } catch (error) {
    console.error('Error deleting trail:', error);
    res.status(500).json({ success: false, error: 'Failed to delete trail' });
  }
});

module.exports = router;
