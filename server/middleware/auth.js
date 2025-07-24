const { verifyToken } = require('../utils/auth');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
        return res.status(401).json({ message: 'Access token required' });
        }

        // Verify token
        const decoded = verifyToken(token);
        
        // Get user info
        const user = await User.findById(decoded.userId);
        if (!user) {
        return res.status(401).json({ message: 'User not found' });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token expired' });
        }
        
        console.error('Auth middleware error:', error);
        return res.status(500).json({ message: 'Authentication error' });
    }
};

module.exports = authenticateToken;
    