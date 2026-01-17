const mysql = require('mysql2/promise');
require('dotenv').config();

async function createBookingsTable() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'trek_api'
    });

    console.log('Connected to database');

    // Drop existing bookings table if it exists (optional - comment out if you want to preserve old data)
    console.log('Dropping existing bookings table if exists...');
    await connection.query('DROP TABLE IF EXISTS bookings');
    
    // Create new bookings table
    console.log('Creating bookings table...');
    await connection.query(`
      CREATE TABLE bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        trek_id INT,
        trek_name VARCHAR(255) NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        client_email VARCHAR(255) NOT NULL,
        client_phone VARCHAR(50),
        id_type VARCHAR(50) DEFAULT 'passport',
        id_number VARCHAR(100),
        id_document VARCHAR(500),
        participants INT DEFAULT 1,
        booking_date DATE NOT NULL,
        amount DECIMAL(10, 2) DEFAULT 0.00,
        payment_id VARCHAR(255),
        gateway VARCHAR(50) DEFAULT 'manual',
        status VARCHAR(50) DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_client_email (client_email),
        INDEX idx_booking_date (booking_date),
        INDEX idx_trek_name (trek_name),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✓ Bookings table created successfully');

    // Insert sample data (optional)
    console.log('Inserting sample booking...');
    await connection.query(`
      INSERT INTO bookings 
      (trek_name, client_name, client_email, client_phone, 
       id_type, id_number, participants, booking_date, amount, 
       payment_id, gateway, status)
      VALUES 
      ('Everest Base Camp Trek', 'John Doe', 'john@example.com', '+977-9841234567',
       'passport', 'P123456', 2, '2024-03-15', 1500.00,
       'PAY-12345', 'esewa', 'confirmed')
    `);

    console.log('✓ Sample data inserted');
    console.log('\nBookings table is ready to use!');

  } catch (error) {
    console.error('Error creating bookings table:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createBookingsTable();
