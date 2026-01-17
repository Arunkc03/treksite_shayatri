const express = require('express');
const router = express.Router();

// GET all activities with optional filtering
router.get('/', async (req, res) => {
  try {
    console.log('🔹 GET /api/activities called');
    const { difficulty, location, q } = req.query;
    let query = 'SELECT * FROM activities WHERE 1=1';
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
    const [activities] = await conn.query(query, params);
    conn.release();

    console.log(`✅ Found ${activities.length} activities`);
    res.json({ 
      success: true, 
      activities: activities,
      total: activities.length 
    });
  } catch (error) {
    console.error('❌ Error fetching activities:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch activities' });
  }
});

// GET single activity by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await req.db.getConnection();
    const [activity] = await conn.query('SELECT * FROM activities WHERE id = ?', [id]);
    conn.release();

    if (activity.length === 0) {
      return res.status(404).json({ success: false, error: 'Activity not found' });
    }

    res.json({ success: true, activity: activity[0] });
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch activity' });
  }
});

// POST create new activity
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      difficulty,
      location,
      image,
      price
    } = req.body;

    console.log('🔹 POST /api/activities - Creating activity with data:', { name, description, difficulty, location, image, price });

    // Validation
    if (!name || !location) {
      console.error('Validation failed - Missing fields');
      return res.status(400).json({ success: false, error: 'Missing required fields: name and location' });
    }

    const conn = await req.db.getConnection();
    const [result] = await conn.query(
      'INSERT INTO activities (name, description, difficulty, location, image, price) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description || '', difficulty || 'Moderate', location, image || '🎯', price || null]
    );
    conn.release();

    console.log('✅ Activity created successfully with ID:', result.insertId);

    res.status(201).json({ 
      success: true, 
      activity: {
        id: result.insertId,
        name,
        description: description || '',
        difficulty: difficulty || 'Moderate',
        location,
        image: image || '🎯',
        price: price || null
      }
    });
  } catch (error) {
    console.error('❌ Error creating activity:', error.message);
    res.status(500).json({ success: false, error: error.message || 'Failed to create activity' });
  }
});

// PUT update activity
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      difficulty,
      location,
      image,
      price
    } = req.body;

    console.log('🔹 PUT /api/activities/:id - Updating activity:', { id, name, difficulty, location, image, price });

    if (!name || !location) {
      return res.status(400).json({ success: false, error: 'Missing required fields: name and location' });
    }

    const conn = await req.db.getConnection();
    const [result] = await conn.query(
      'UPDATE activities SET name = ?, description = ?, difficulty = ?, location = ?, image = ?, price = ? WHERE id = ?',
      [name, description || '', difficulty || 'Moderate', location, image || '🎯', price || null, id]
    );
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Activity not found' });
    }

    console.log('✅ Activity updated successfully');

    res.json({ 
      success: true, 
      message: 'Activity updated successfully',
      activity: {
        id,
        name,
        description: description || '',
        difficulty: difficulty || 'Moderate',
        location,
        image: image || '🎯',
        price: price || null
      }
    });
  } catch (error) {
    console.error('❌ Error updating activity:', error);
    res.status(500).json({ success: false, error: 'Failed to update activity' });
  }
});

// DELETE activity
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await req.db.getConnection();
    const [result] = await conn.query('DELETE FROM activities WHERE id = ?', [id]);
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Activity not found' });
    }

    res.json({ success: true, message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ success: false, error: 'Failed to delete activity' });
  }
});

module.exports = router;
