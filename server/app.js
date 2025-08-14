const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database initialization
const initializeDatabase = require('./config/initDB');

// Import routes
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const friendsRoutes = require('./routes/friends');

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000'//, // Development
    //'https://your-app-name.netlify.app' // Production (update this with your actual Netlify URL)
  ],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database on startup
initializeDatabase().catch(console.error);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/friends', friendsRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Ande backend is running!' });
});

// Database test route
app.get('/api/test-db', async (req, res) => {
  try {
    const pool = require('./config/database');
    const result = await pool.query('SELECT NOW() as current_time');
    res.json({
      message: 'Database connected!',
      time: result.rows[0].current_time
    });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// 404 handler
app.use('/', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;