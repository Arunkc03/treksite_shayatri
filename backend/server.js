const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

// Create MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'trek_api',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection()
  .then(conn => {
    console.log('✅ Connected to MySQL (trek_api database)');
    conn.release();
  })
  .catch(err => {
    console.error('❌ MySQL connection error:', err.message);
  });

// Make pool available to routes
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/trails', require('./routes/trails'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/climbing', require('./routes/climbing'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/destinations', require('./routes/destinations'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api', require('./routes/weather'));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.query('SELECT 1');
    conn.release();
    res.json({ 
      status: 'Server is running',
      database: 'Connected to MySQL (trek_api)',
      timestamp: new Date() 
    });
  } catch (err) {
    res.json({ 
      status: 'Server is running',
      database: 'MySQL connection failed',
      error: err.message,
      timestamp: new Date() 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🗄️  Database: MySQL (trek_api)`);
});

// Export pool for use in other modules
module.exports = { app, pool };
