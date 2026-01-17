const express = require('express');
const Review = require('../models/Review');

const router = express.Router();

// GET all reviews (admin only)
router.get('/', async (req, res) => {
  try {
    const status = req.query.status;
    const reviews = await Review.getAll(req.db, status);
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET reviews by type (destination, trail, activity)
router.get('/type/:type/:typeId', async (req, res) => {
  try {
    const { type, typeId } = req.params;
    const reviews = await Review.getApproved(req.db, type, typeId);
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single review
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.getById(req.db, req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST new review
router.post('/', async (req, res) => {
  try {
    const { name, email, rating, title, review, destination_id, trail_id, activity_id } = req.body;
    
    // Validation
    if (!name || !email || !rating || !title || !review) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const result = await Review.create(req.db, {
      name,
      email,
      rating,
      title,
      review,
      destination_id,
      trail_id,
      activity_id
    });
    
    res.status(201).json({
      success: true,
      message: 'Review submitted successfully! It will be reviewed by our team.',
      id: result.insertId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update review status (admin)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    await Review.updateStatus(req.db, req.params.id, status);
    res.json({ success: true, message: 'Review status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE review
router.delete('/:id', async (req, res) => {
  try {
    await Review.delete(req.db, req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
