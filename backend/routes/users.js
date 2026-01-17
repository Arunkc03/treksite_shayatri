const express = require('express');
const router = express.Router();

// GET user profile
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await req.db.getConnection();
    const [users] = await conn.query('SELECT id, name, email, bio, phone, location, created_at FROM users WHERE id = ?', [id]);
    conn.release();
    
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    res.json({ success: true, user: users[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

// PUT update user profile
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, bio, phone, location } = req.body;
    
    const conn = await req.db.getConnection();
    
    // Check if user exists
    const [check] = await conn.query('SELECT id FROM users WHERE id = ?', [id]);
    if (check.length === 0) {
      conn.release();
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    // Update user
    await conn.query(
      'UPDATE users SET name=?, email=?, bio=?, phone=?, location=? WHERE id=?',
      [name, email, bio || '', phone || '', location || '', id]
    );
    
    const [updated] = await conn.query('SELECT id, name, email, bio, phone, location FROM users WHERE id = ?', [id]);
    conn.release();
    
    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: updated[0]
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
});

// GET user's bookings
router.get('/:id/bookings', async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await req.db.getConnection();
    const [bookings] = await conn.query('SELECT * FROM bookings WHERE user_id = ?', [id]);
    conn.release();
    
    res.json({ 
      success: true, 
      bookings: bookings 
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
  }
});

module.exports = router;
