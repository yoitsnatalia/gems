const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const authenticateToken = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

// All routes require authentication
router.use(authenticateToken);

// Create a new post with image upload
router.post('/', 
    upload.single('image'), 
    handleUploadError, 
    postsController.createPost
);

// Get user's own posts
router.get('/my-posts', postsController.getUserPosts);

// Get nearby posts for discovery
router.get('/nearby', postsController.getNearbyPosts);

// Get user's unlocked posts
router.get('/unlocked', postsController.getUnlockedPosts);

// Check if user can unlock a specific post
router.get('/:postId/unlock-check', postsController.checkUnlockEligibility);

// Unlock a post
router.post('/:postId/unlock', postsController.unlockPost);

// Get specific post details
router.get('/:postId', postsController.getPostById);

module.exports = router;
