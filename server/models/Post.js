const pool = require('../config/database');

class Post {
    static async create(postData) {
        const { user_id, caption, image_url, latitude, longitude, location_name } = postData;
        
        const query = `
            INSERT INTO posts (user_id, caption, image_url, latitude, longitude, location_name)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        
        const result = await pool.query(query, [
            user_id, caption, image_url, latitude, longitude, location_name
        ]);
        return result.rows[0];
    }

    static async findByUserId(userId) {
        const query = `
          SELECT p.*, u.username 
          FROM posts p
          JOIN users u ON p.user_id = u.id
          WHERE p.user_id = $1
          ORDER BY p.created_at DESC
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    }

    static async findById(postId) {
        const query = `
          SELECT p.*, u.username 
          FROM posts p
          JOIN users u ON p.user_id = u.id
          WHERE p.id = $1
        `;
        const result = await pool.query(query, [postId]);
        return result.rows[0];
    }

    static async findNearbyPosts(latitude, longitude, radiusMeters = 10000, userId = null) {
        // Using the Haversine formula for distance calculation
        let query = `
          SELECT p.*, u.username,
            (6371000 * acos(
              cos(radians($1)) * 
              cos(radians(p.latitude)) * 
              cos(radians(p.longitude) - radians($2)) + 
              sin(radians($1)) * 
              sin(radians(p.latitude))
            )) AS distance
          FROM posts p
          JOIN users u ON p.user_id = u.id
          WHERE (6371000 * acos(
            cos(radians($1)) * 
            cos(radians(p.latitude)) * 
            cos(radians(p.longitude) - radians($2)) + 
            sin(radians($1)) * 
            sin(radians(p.latitude))
          )) <= $3
        `;
        const params = [latitude, longitude, radiusMeters];
    
    if (userId) {
      query += ` AND p.user_id != $4`;
      params.push(userId);
    }
    
    query += ` ORDER BY distance ASC`;
    
    const result = await pool.query(query, params);
    return result.rows;
  }
  
  static async delete(postId, userId) {
    const query = `
      DELETE FROM posts 
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [postId, userId]);
    return result.rows[0];
  }
}

module.exports = Post;
