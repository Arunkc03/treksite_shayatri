const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'trek_api'
  });

  const alter = async (sql) => {
    try {
      await conn.query(sql);
      console.log('Applied:', sql);
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('Already exists:', sql);
      } else {
        throw e;
      }
    }
  };

  await alter('ALTER TABLE trails ADD COLUMN lat DECIMAL(10,6) NULL');
  await alter('ALTER TABLE trails ADD COLUMN lng DECIMAL(10,6) NULL');

  await conn.end();
  console.log('✅ lat/lng columns ensured');
})();
