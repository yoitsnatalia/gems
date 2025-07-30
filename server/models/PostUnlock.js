const pool = require('../config/database');

class PostUnlock {
  static async unlockPost(postId, userId) {
    const query = `
      INSERT INTO post_unlocks (post_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT (post_id, user_id) DO NOTHING
      RETURNING *
    `;
    
    const result = await pool.query(query, [postId, userId]);
    return result.rows[0];
  }
  
  static async checkUnlock(postId, userId) {
    const query = `
      SELECT * FROM post_unlocks 
      WHERE post_id = $1 AND user_id = $2
    `;
    
    const result = await pool.query(query, [postId, userId]);
    return result.rows[0];
  }
  
  static async getUserUnlocks(userId) {
    const query = `
      SELECT pu.*, p.*, u.username
      FROM post_unlocks pu
      JOIN posts p ON pu.post_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE pu.user_id = $1
      ORDER BY pu.unlocked_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}

module.exports = PostUnlock;