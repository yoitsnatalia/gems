const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friendsController');
const authenticateToken = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Add a friend by username
router.post('/add', friendsController.addFriend);

// Get user's friends list
router.get('/', friendsController.getFriends);

// Remove a friend
router.delete('/:friendId', friendsController.removeFriend);

// Get friends' posts within radius
router.get('/posts', friendsController.getFriendsPosts);

// Search users by username
router.get('/search', friendsController.searchUsers);

module.exports = router;