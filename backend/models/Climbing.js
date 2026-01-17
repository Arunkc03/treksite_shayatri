// Climbing Model
const db = require('../config/db');

class Climbing {
  // Get all climbing spots
  static async getAll(filters = {}) {
    let query = 'SELECT * FROM climbing WHERE 1=1';
    const params = [];

    if (filters.difficulty) {
      query += ' AND difficulty = ?';
      params.push(filters.difficulty);
    }

    if (filters.rockType) {
      query += ' AND rock_type = ?';
      params.push(filters.rockType);
    }

    if (filters.location) {
      query += ' AND location LIKE ?';
      params.push(`%${filters.location}%`);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.query(query, params);
    return rows;
  }

  // Get by ID
  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM climbing WHERE id = ?', [id]);
    return rows[0];
  }

  // Create new climbing spot
  static async create(data) {
    const query = `
      INSERT INTO climbing (
        name, location, difficulty, rock_type, height_meters, 
        routes_count, description, image, lat, lng, price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.query(query, [
      data.name,
      data.location,
      data.difficulty,
      data.rockType || data.rock_type,
      data.heightMeters || data.height_meters,
      data.routesCount || data.routes_count,
      data.description,
      data.image || '🧗',
      data.lat,
      data.lng,
      data.price ? parseFloat(data.price) : 0
    ]);

    return { id: result.insertId, ...data };
  }

  // Update climbing spot
  static async update(id, data) {
    const query = `
      UPDATE climbing SET 
        name = ?, 
        location = ?, 
        difficulty = ?, 
        rock_type = ?, 
        height_meters = ?, 
        routes_count = ?, 
        description = ?, 
        image = ?,
        lat = ?,
        lng = ?,
        price = ?
      WHERE id = ?
    `;

    await db.query(query, [
      data.name,
      data.location,
      data.difficulty,
      data.rockType || data.rock_type,
      data.heightMeters || data.height_meters,
      data.routesCount || data.routes_count,
      data.description,
      data.image,
      data.lat,
      data.lng,
      data.price ? parseFloat(data.price) : 0,
      id
    ]);

    return { id, ...data };
  }

  // Delete climbing spot
  static async delete(id) {
    await db.query('DELETE FROM climbing WHERE id = ?', [id]);
    return { success: true };
  }
}

module.exports = Climbing;
