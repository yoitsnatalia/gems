const Post = require('../models/Post');
const PostUnlock = require('../models/PostUnlock');
const { uploadImage } = require('../config/cloudinary');
const { isValidCoordinate, canUnlockPost } = require('../utils/location');

// Create a new post
const createPost = async (req, res) => {
  try {
    const { caption, latitude, longitude, location_name } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!req.file) {
        return res.status(400).json({ message: 'Image is required' });
    }

    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Location coordinates are required' });
    }

    // Validate coordinates
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    
    if (!isValidCoordinate(lat, lon)) {
        return res.status(400).json({ message: 'Invalid coordinates' });
    }

    // Upload image to Cloudinary
    const uploadResult = await uploadImage(req.file.buffer, {
        public_id: `${userId}_${Date.now()}` // Unique identifier
    });

    // Create post in database
    const newPost = await Post.create({
        user_id: userId,
        caption: caption || '',
        image_url: uploadResult.secure_url,
        latitude: lat,
        longitude: lon,
        location_name: location_name || null
      });
  
      res.status(201).json({
        message: 'Post created successfully',
        post: newPost
      });
  
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ message: 'Failed to create post', error: error.message });
    }
};

// Get user's own posts
const getUserPosts = async (req, res) => {
    try {
        const userId = req.user.id;
        const posts = await Post.findByUserId(userId);
      
        res.json({
            posts: posts,
            count: posts.length
        });
    } catch (error) {
        console.error('Get user posts error:', error);
        res.status(500).json({ message: 'Failed to get posts' });
    }
};

// Get a specific post
const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
      
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
      
        res.json({ post });
    } catch (error) {
        console.error('Get post error:', error);
        res.status(500).json({ message: 'Failed to get post' });
    }
};

// Get nearby posts (for map discovery)
const getNearbyPosts = async (req, res) => {
    try {
        const { latitude, longitude, radius = 10000 } = req.query; // Default 10km radius
        const userId = req.user.id;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        if (!isValidCoordinate(lat, lon)) {
            return res.status(400).json({ message: 'Invalid coordinates' });
        }

        const nearbyPosts = await Post.findNearbyPosts(lat, lon, parseInt(radius), userId);

        res.json({
            posts: nearbyPosts,
            count: nearbyPosts.length,
            center: { latitude: lat, longitude: lon },
            radius: parseInt(radius)
        });
    } catch (error) {
        console.error('Get nearby posts error:', error);
        res.status(500).json({ message: 'Failed to get nearby posts' });
    }
};

// Check if user can unlock a post (proximity check)
const checkUnlockEligibility = async (req, res) => {
    try {
        const { postId } = req.params;
        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: 'Current location is required' });
        }
      
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const userLat = parseFloat(latitude);
        const userLon = parseFloat(longitude);
    
        if (!isValidCoordinate(userLat, userLon)) {
            return res.status(400).json({ message: 'Invalid coordinates' });
        }

        const canUnlock = canUnlockPost(userLat, userLon, post.latitude, post.longitude);

        res.json({
            canUnlock,
            post: canUnlock ? post : { id: post.id, latitude: post.latitude, longitude: post.longitude },
            distance: require('../utils/location').calculateDistance(userLat, userLon, post.latitude, post.longitude)
        });
    } catch (error) {
        console.error('Check unlock eligibility error:', error);
        res.status(500).json({ message: 'Failed to check unlock eligibility' });
    }
};

// Unlock a post when user is in proximity
const unlockPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const { latitude, longitude } = req.body;
      const userId = req.user.id;
      
      if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Current location is required' });
      }
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Check if user can unlock (within proximity)
      const userLat = parseFloat(latitude);
      const userLon = parseFloat(longitude);
      
      if (!isValidCoordinate(userLat, userLon)) {
        return res.status(400).json({ message: 'Invalid coordinates' });
      }
  
      const canUnlock = canUnlockPost(userLat, userLon, post.latitude, post.longitude);
      
      if (!canUnlock) {
        return res.status(400).json({ 
          message: 'You must be within 100 meters to unlock this post',
          distance: require('../utils/location').calculateDistance(userLat, userLon, post.latitude, post.longitude)
        });
      }
  
      // Unlock the post
      const unlock = await PostUnlock.unlockPost(postId, userId);
      
      res.json({
        message: 'Post unlocked successfully!',
        post: post,
        unlocked: true,
        unlock: unlock
      });
    } catch (error) {
      console.error('Unlock post error:', error);
      res.status(500).json({ message: 'Failed to unlock post' });
    }
  };
  
  // Get user's unlocked posts
  const getUnlockedPosts = async (req, res) => {
    try {
      const userId = req.user.id;
      const unlockedPosts = await PostUnlock.getUserUnlocks(userId);
      
      res.json({
        posts: unlockedPosts,
        count: unlockedPosts.length
      });
    } catch (error) {
      console.error('Get unlocked posts error:', error);
      res.status(500).json({ message: 'Failed to get unlocked posts' });
    }
  };
  
  module.exports = {
    createPost,
    getUserPosts,
    getPostById,
    getNearbyPosts,
    checkUnlockEligibility,
    unlockPost,
    getUnlockedPosts
  };