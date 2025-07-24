const User = require('../models/User');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');
const { validateRegistration, validateLogin } = require('../utils/validation');

// Register new user
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input data
        const validation = validateRegistration({ username, email, password });
        if (!validation.isValid) {
        return res.status(400).json({ 
            message: 'Validation failed', 
            errors: validation.errors 
        });
        }

        // Check if user already exists
        const existingUserByEmail = await User.findByEmail(email);
        if (existingUserByEmail) {
        return res.status(400).json({ message: 'Email already registered' });
        }

        const existingUserByUsername = await User.findByUsername(username);
        if (existingUserByUsername) {
        return res.status(400).json({ message: 'Username already taken' });
        }

        // Hash password
        const password_hash = await hashPassword(password);

        // Create user
        const newUser = await User.create({
        username,
        email,
        password_hash
        });

        // Generate token
        const token = generateToken(newUser.id);

        res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
        },
        token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        // Validate input
        const validation = validateLogin({ email, password });
        if (!validation.isValid) {
            return res.status(400).json({ 
            message: 'Validation failed', 
            errors: validation.errors 
            });
        }

        // Find user by email
        const user = await User.findByEmail(email);
        if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isPasswordValid = await comparePassword(password, user.password_hash);
        if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user.id);

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            token
        }); 

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

// Get current user profile
const getProfile = async (req, res) => {
    try {
        // User is attached to req by auth middleware
        const user = req.user;
        
        res.json({
            user: {
            id: user.id,
            username: user.username,
            email: user.email,
            profile_image: user.profile_image,
            created_at: user.created_at
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Failed to get profile' });
    }
};

module.exports = {
    register,
    login,
    getProfile
};
    




