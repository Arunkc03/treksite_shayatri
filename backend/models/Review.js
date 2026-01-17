class Review {
  static async create(pool, data) {
    const { name, email, rating, title, review, destination_id, trail_id, activity_id } = data;
    const [result] = await pool.query(
      'INSERT INTO reviews (name, email, rating, title, review, destination_id, trail_id, activity_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, rating, title, review, destination_id || null, trail_id || null, activity_id || null]
    );
    return result;
  }

  static async getAll(pool, status = null) {
    let query = 'SELECT * FROM reviews';
    const params = [];
    
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    const [reviews] = await pool.query(query, params);
    return reviews;
  }

  static async getById(pool, id) {
    const [reviews] = await pool.query('SELECT * FROM reviews WHERE id = ?', [id]);
    return reviews[0];
  }

  static async updateStatus(pool, id, status) {
    const [result] = await pool.query('UPDATE reviews SET status = ? WHERE id = ?', [status, id]);
    return result;
  }

  static async delete(pool, id) {
    const [result] = await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
    return result;
  }

  static async getApproved(pool, type, typeId) {
    let query = 'SELECT * FROM reviews WHERE status = "approved"';
    const params = [];
    
    if (type === 'destination') {
      query += ' AND destination_id = ?';
      params.push(typeId);
    } else if (type === 'trail') {
      query += ' AND trail_id = ?';
      params.push(typeId);
    } else if (type === 'activity') {
      query += ' AND activity_id = ?';
      params.push(typeId);
    }
    
    query += ' ORDER BY created_at DESC';
    const [reviews] = await pool.query(query, params);
    return reviews;
  }
}

module.exports = Review;
