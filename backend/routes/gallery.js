const express = require('express')
const path = require('path')
const multer = require('multer')
const router = express.Router()

// Configure multer for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files allowed'))
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
})

// GET all photos
router.get('/', async (req, res) => {
  try {
    const connection = await req.db.getConnection()
    try {
      const [photos] = await connection.query(
        `SELECT g.*, u.name as user_name FROM gallery g 
         LEFT JOIN users u ON g.user_id = u.id 
         ORDER BY g.created_at DESC`
      )
      res.json({ photos })
    } finally {
      connection.release()
    }
  } catch (err) {
    console.error('Gallery GET error:', err)
    res.status(500).json({ error: 'Failed to fetch photos' })
  }
})

// POST - Upload new photo
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Photo file is required' })
    }

    const { description, user_id } = req.body

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' })
    }

    const photoUrl = `/uploads/${req.file.filename}`

    const connection = await req.db.getConnection()
    try {
      // Insert the photo
      const [result] = await connection.query(
        'INSERT INTO gallery (user_id, photo_url, description) VALUES (?, ?, ?)',
        [user_id, photoUrl, description || null]
      )

      res.status(201).json({
        id: result.insertId,
        user_id,
        photo_url: photoUrl,
        description,
        created_at: new Date(),
        success: true
      })
    } finally {
      connection.release()
    }
  } catch (err) {
    console.error('Gallery POST error:', err)
    res.status(500).json({ error: 'Failed to upload photo: ' + err.message })
  }
})

// DELETE - Remove photo (only owner or admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    const connection = await req.db.getConnection()
    try {
      // Check if photo exists and belongs to user
      const [photos] = await connection.query(
        'SELECT * FROM gallery WHERE id = ?',
        [id]
      )

      if (photos.length === 0) {
        return res.status(404).json({ error: 'Photo not found' })
      }

      if (photos[0].user_id !== userId) {
        return res.status(403).json({ error: 'Not authorized to delete this photo' })
      }

      // Delete the photo
      await connection.query('DELETE FROM gallery WHERE id = ?', [id])

      res.json({ success: true })
    } finally {
      connection.release()
    }
  } catch (err) {
    console.error('Gallery DELETE error:', err)
    res.status(500).json({ error: 'Failed to delete photo' })
  }
})

module.exports = router
