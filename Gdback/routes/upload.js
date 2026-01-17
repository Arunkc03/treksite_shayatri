const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'trek-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedImageMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const allowedVideoMimes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    const isImage = allowedImageMimes.includes(file.mimetype);
    const isVideo = allowedVideoMimes.includes(file.mimetype);
    
    if (isImage || isVideo) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM, OGG) are allowed.'));
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for videos
  }
});

// POST upload image or video
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // Return full URL including the API base
    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      mimetype: req.file.mimetype
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
