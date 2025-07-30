const Friend = require('../models/Friend');
const User = require('../models/User');

// Add a friend by username
const addFriend = async (req, res) => {
  try {
    const { username } = req.body;
    const currentUserId = req.user.id;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Find user by username
    const friendUser = await User.findByUsername(username);
    if (!friendUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if trying to add themselves
    if (friendUser.id === currentUserId) {
      return res.status(400).json({ message: 'You cannot add yourself as a friend' });
    }

    // Check if already friends
    const existingFriendship = await Friend.checkFriendship(currentUserId, friendUser.id);
    if (existingFriendship) {
      return res.status(400).json({ message: 'Already friends with this user' });
    }

    // Add friendship
    const friendship = await Friend.addFriend(currentUserId, friendUser.id);

    res.status(201).json({
      message: 'Friend added successfully',
      friend: {
        id: friendUser.id,
        username: friendUser.username,
        email: friendUser.email
      }
    });

  } catch (error) {
    console.error('Add friend error:', error);
    res.status(500).json({ message: 'Failed to add friend' });
  }
};

// Get user's friends list
const getFriends = async (req, res) => {
  try {
    const userId = req.user.id;
    const friends = await Friend.getFriends(userId);

    res.json({
      friends: friends,
      count: friends.length
    });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ message: 'Failed to get friends' });
  }
};

// Remove a friend
const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const currentUserId = req.user.id;

    const removedFriendship = await Friend.removeFriend(currentUserId, parseInt(friendId));
    
    if (!removedFriendship) {
      return res.status(404).json({ message: 'Friendship not found' });
    }

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ message: 'Failed to remove friend' });
  }
};

// Get friends' posts within radius
const getFriendsPosts = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10000 } = req.query;
    const userId = req.user.id;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }

    const friendsPosts = await Friend.getFriendsPosts(userId, lat, lon, parseInt(radius));
    
    res.json({
      posts: friendsPosts,
      count: friendsPosts.length,
      center: { latitude: lat, longitude: lon },
      radius: parseInt(radius)
    });
  } catch (error) {
    console.error('Get friends posts error:', error);
    res.status(500).json({ message: 'Failed to get friends posts' });
  }
};

// Search users by username
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const currentUserId = req.user.id;

    if (!q || q.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const query = `
      SELECT id, username, email, profile_image, created_at
      FROM users 
      WHERE username ILIKE $1 AND id != $2
      LIMIT 10
    `;
    
    const pool = require('../config/database');
    const result = await pool.query(query, [`%${q}%`, currentUserId]);
    
    // Check friendship status for each user
    const usersWithFriendshipStatus = await Promise.all(
      result.rows.map(async (user) => {
        const friendship = await Friend.checkFriendship(currentUserId, user.id);
        return {
          ...user,
          isFriend: !!friendship
        };
      })
    );

    res.json({
      users: usersWithFriendshipStatus,
      count: usersWithFriendshipStatus.length
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
};

module.exports = {
  addFriend,
  getFriends,
  removeFriend,
  getFriendsPosts,
  searchUsers
};