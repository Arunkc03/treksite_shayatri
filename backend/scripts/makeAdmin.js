/**
 * Script to promote a user to admin role
 * Usage: node scripts/makeAdmin.js <email>
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email: node scripts/makeAdmin.js <email>');
  process.exit(1);
}

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'password',
  database: process.env.MYSQL_DATABASE || 'orophiletrek',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function makeAdmin() {
  try {
    const connection = await pool.getConnection();
    
    // Check if user exists
    const [users] = await connection.query(
      'SELECT id, name, email, role FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      console.error(`❌ User with email "${email}" not found`);
      connection.release();
      await pool.end();
      process.exit(1);
    }
    
    const user = users[0];
    
    // Check if already admin
    if (user.role === 'admin') {
      console.log(`⚠️  User "${email}" is already an admin`);
      connection.release();
      await pool.end();
      process.exit(0);
    }
    
    // Promote to admin
    await connection.query(
      'UPDATE users SET role = ? WHERE id = ?',
      ['admin', user.id]
    );
    
    console.log(`✅ Successfully promoted "${email}" to admin role`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: admin`);
    
    connection.release();
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

makeAdmin();
