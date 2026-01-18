/**
 * Itinerary Model - Uses MySQL Database
 * Handles itinerary data without Mongoose
 */

class Itinerary {
  /**
   * Create a new itinerary
   */
  static async create(conn, data) {
    const {
      title,
      description,
      duration_days,
      difficulty,
      price,
      location,
      best_season,
      image,
      highlights,
      dayByDayPlan,
      includes,
      excludes,
      status
    } = data;

    const result = await conn.query(
      `INSERT INTO itineraries 
       (title, description, duration_days, difficulty, price, location, best_season, image, 
        highlights, dayByDayPlan, includes, excludes, status, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        title,
        description,
        duration_days,
        difficulty || 'Moderate',
        price,
        location,
        best_season,
        image || '🗺️',
        JSON.stringify(highlights || []),
        JSON.stringify(dayByDayPlan || []),
        JSON.stringify(includes || []),
        JSON.stringify(excludes || []),
        status || 'active'
      ]
    );

    return result[0].insertId;
  }

  /**
   * Get all itineraries
   */
  static async getAll(conn) {
    const [itineraries] = await conn.query(
      'SELECT * FROM itineraries ORDER BY createdAt DESC'
    );
    
    return itineraries.map(itinerary => this.parseData(itinerary));
  }

  /**
   * Get itinerary by ID
   */
  static async getById(conn, id) {
    const [itineraries] = await conn.query(
      'SELECT * FROM itineraries WHERE id = ?',
      [id]
    );
    
    if (itineraries.length === 0) {
      return null;
    }
    
    return this.parseData(itineraries[0]);
  }

  /**
   * Update itinerary
   */
  static async update(conn, id, data) {
    const fields = [];
    const values = [];

    const allowedFields = [
      'title', 'description', 'duration_days', 'difficulty', 'price',
      'location', 'best_season', 'image', 'highlights', 'dayByDayPlan',
      'includes', 'excludes', 'status'
    ];

    for (const field of allowedFields) {
      if (data.hasOwnProperty(field)) {
        fields.push(`${field} = ?`);
        let value = data[field];
        
        // Handle JSON fields
        if (['highlights', 'dayByDayPlan', 'includes', 'excludes'].includes(field)) {
          value = typeof value === 'string' ? value : JSON.stringify(value || []);
        }
        
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return false;
    }

    fields.push('updatedAt = NOW()');
    values.push(id);

    const query = `UPDATE itineraries SET ${fields.join(', ')} WHERE id = ?`;
    
    const result = await conn.query(query, values);
    return result[0].affectedRows > 0;
  }

  /**
   * Delete itinerary
   */
  static async delete(conn, id) {
    const result = await conn.query(
      'DELETE FROM itineraries WHERE id = ?',
      [id]
    );
    
    return result[0].affectedRows > 0;
  }

  /**
   * Search itineraries
   */
  static async search(conn, query) {
    const [itineraries] = await conn.query(
      `SELECT * FROM itineraries 
       WHERE title LIKE ? OR description LIKE ? OR location LIKE ?
       ORDER BY createdAt DESC`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    
    return itineraries.map(itinerary => this.parseData(itinerary));
  }

  /**
   * Parse JSON fields in itinerary data
   */
  static parseData(itinerary) {
    if (!itinerary) return null;

    return {
      ...itinerary,
      highlights: typeof itinerary.highlights === 'string' 
        ? JSON.parse(itinerary.highlights || '[]') 
        : itinerary.highlights || [],
      dayByDayPlan: typeof itinerary.dayByDayPlan === 'string'
        ? JSON.parse(itinerary.dayByDayPlan || '[]')
        : itinerary.dayByDayPlan || [],
      includes: typeof itinerary.includes === 'string'
        ? JSON.parse(itinerary.includes || '[]')
        : itinerary.includes || [],
      excludes: typeof itinerary.excludes === 'string'
        ? JSON.parse(itinerary.excludes || '[]')
        : itinerary.excludes || []
    };
  }
}

module.exports = Itinerary;
