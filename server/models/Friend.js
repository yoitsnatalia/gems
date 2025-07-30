const pool = require('../config/database');

class Friend {
  static async addFriend(user1Id, user2Id) {
    // Ensure consistent ordering (lower ID first)
    const [smallerId, largerId] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];
    
    const query = `
      INSERT INTO friendships (user1_id, user2_id, status)
      VALUES ($1, $2, 'accepted')
      ON CONFLICT (user1_id, user2_id) DO NOTHING
      RETURNING *
    `;
    
    const result = await pool.query(query, [smallerId, largerId]);
    return result.rows[0];
  }
  
  static async getFriends(userId) {
    const query = `
      SELECT 
        u.id, u.username, u.email, u.profile_image, u.created_at,
        f.created_at as friendship_date
      FROM friendships f
      JOIN users u ON (
        CASE 
          WHEN f.user1_id = $1 THEN u.id = f.user2_id
          WHEN f.user2_id = $1 THEN u.id = f.user1_id
        END
      )
      WHERE (f.user1_id = $1 OR f.user2_id = $1) AND f.status = 'accepted'
      ORDER BY f.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
  
  static async checkFriendship(user1Id, user2Id) {
    const [smallerId, largerId] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];
    
    const query = `
      SELECT * FROM friendships 
      WHERE user1_id = $1 AND user2_id = $2 AND status = 'accepted'
    `;
    
    const result = await pool.query(query, [smallerId, largerId]);
    return result.rows[0];
  }
  
  static async removeFriend(user1Id, user2Id) {
    const [smallerId, largerId] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];
    
    const query = `
      DELETE FROM friendships 
      WHERE user1_id = $1 AND user2_id = $2
      RETURNING *
    `;
    
    const result = await pool.query(query, [smallerId, largerId]);
    return result.rows[0];
  }
  
  static async getFriendsPosts(userId, latitude, longitude, radiusMeters = 10000) {
    const query = `
      SELECT p.*, u.username,
        (6371000 * acos(
          cos(radians($2)) * 
          cos(radians(p.latitude)) * 
          cos(radians(p.longitude) - radians($3)) + 
          sin(radians($2)) * 
          sin(radians(p.latitude))
        )) AS distance
      FROM posts p
      JOIN users u ON p.user_id = u.id
      JOIN friendships f ON (
        (f.user1_id = $1 AND f.user2_id = p.user_id) OR
        (f.user2_id = $1 AND f.user1_id = p.user_id)
      )
      WHERE f.status = 'accepted'
      AND p.user_id != $1
      AND (6371000 * acos(
        cos(radians($2)) * 
        cos(radians(p.latitude)) * 
        cos(radians(p.longitude) - radians($3)) + 
        sin(radians($2)) * 
        sin(radians(p.latitude))
      )) <= $4
      ORDER BY distance ASC
    `;
    
    const result = await pool.query(query, [userId, latitude, longitude, radiusMeters]);
    return result.rows;
  }
}

module.exports = Friend;