const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database initialization
const initializeDatabase = require('./config/initDB');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database on startup
initializeDatabase().catch(console.error);

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;