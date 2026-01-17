/**
 * Setup script - Creates initial admin user
 * Run once on first setup: node scripts/setupAdmin.js
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const ADMIN_EMAIL = 'akc338663@gmail.com';
const ADMIN_PASSWORD = 'Admin@123'; // Change this after first login!
const ADMIN_NAME = 'Admin';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'trek_api',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function setupAdmin() {
  try {
    const connection = await pool.getConnection();
    
    // Check if admin already exists
    const [existing] = await connection.query(
      'SELECT id, email, role FROM users WHERE email = ?',
      [ADMIN_EMAIL]
    );
    
    if (existing.length > 0) {
      const user = existing[0];
      if (user.role === 'admin') {
        console.log(`✅ Admin account already exists: ${ADMIN_EMAIL}`);
        console.log(`   Role: admin`);
      } else {
        // Promote existing user to admin
        await connection.query(
          'UPDATE users SET role = ? WHERE id = ?',
          ['admin', user.id]
        );
        console.log(`✅ User "${ADMIN_EMAIL}" promoted to admin`);
      }
      connection.release();
      await pool.end();
      process.exit(0);
    }
    
    // Create new admin user
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    
    const [result] = await connection.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [ADMIN_NAME, ADMIN_EMAIL, hashedPassword, 'admin']
    );
    
    console.log('✅ Admin account created successfully!');
    console.log(`\n📧 Email: ${ADMIN_EMAIL}`);
    console.log(`🔐 Password: ${ADMIN_PASSWORD}`);
    console.log(`👤 Name: ${ADMIN_NAME}`);
    console.log(`\n⚠️  Important: Change your password after first login!`);
    
    connection.release();
    await pool.end();
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupAdmin();
