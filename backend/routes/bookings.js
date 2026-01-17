const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads/ids directory exists
const idsDir = path.join(__dirname, '../uploads/ids');
if (!fs.existsSync(idsDir)) {
  fs.mkdirSync(idsDir, { recursive: true });
}

// Configure multer for ID document upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, idsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'id-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images and PDFs only!');
    }
  }
});

// POST create booking
router.post('/', upload.single('idDocument'), async (req, res) => {
  try {
    const {
      trekId,
      trekName,
      clientName,
      clientEmail,
      clientPhone,
      idType,
      idNumber,
      participants,
      bookingDate,
      amount,
      paymentId,
      gateway,
      status
    } = req.body;

    // Validate required fields
    if (!trekName || !clientName || !clientEmail || !bookingDate) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields (trekName, clientName, clientEmail, bookingDate)' 
      });
    }

    const idDocument = req.file ? `/uploads/ids/${req.file.filename}` : null;
    
    const conn = await req.db.getConnection();
    const [result] = await conn.query(
      `INSERT INTO bookings 
      (trek_id, trek_name, client_name, client_email, client_phone, 
       id_type, id_number, id_document, participants, booking_date, 
       amount, payment_id, gateway, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        trekId || null,
        trekName,
        clientName,
        clientEmail,
        clientPhone || null,
        idType || 'passport',
        idNumber || null,
        idDocument,
        participants || 1,
        bookingDate,
        amount || 0,
        paymentId || null,
        gateway || 'manual',
        status || 'confirmed'
      ]
    );
    conn.release();
    
    res.status(201).json({ 
      success: true, 
      message: 'Booking created successfully',
      bookingId: result.insertId
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, error: 'Failed to create booking: ' + error.message });
  }
});

// GET all bookings (for admin)
router.get('/', async (req, res) => {
  try {
    const conn = await req.db.getConnection();
    const [bookings] = await conn.query(
      `SELECT b.*, t.image as trek_image 
       FROM bookings b 
       LEFT JOIN trails t ON b.trek_name = t.name 
       ORDER BY b.created_at DESC`
    );
    conn.release();
    
    res.json({ 
      success: true, 
      bookings: bookings,
      total: bookings.length 
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
  }
});

// GET bookings by email
router.get('/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const conn = await req.db.getConnection();
    const [bookings] = await conn.query(
      'SELECT * FROM bookings WHERE client_email = ? ORDER BY created_at DESC', 
      [email]
    );
    conn.release();
    
    res.json({ 
      success: true, 
      bookings: bookings,
      total: bookings.length 
    });
  } catch (error) {
    console.error('Error fetching bookings by email:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
  }
});

// GET single booking
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await req.db.getConnection();
    const [booking] = await conn.query('SELECT * FROM bookings WHERE id = ?', [id]);
    conn.release();
    
    if (booking.length === 0) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    
    res.json({ success: true, booking: booking[0] });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch booking' });
  }
});

// DELETE cancel booking
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await req.db.getConnection();
    
    // Get booking first
    const [booking] = await conn.query('SELECT * FROM bookings WHERE id = ?', [id]);
    if (booking.length === 0) {
      conn.release();
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    
    // Delete booking
    await conn.query('DELETE FROM bookings WHERE id = ?', [id]);
    conn.release();
    
    res.json({ 
      success: true, 
      message: 'Booking cancelled',
      booking: booking[0]
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ success: false, error: 'Failed to delete booking' });
  }
});

module.exports = router;
