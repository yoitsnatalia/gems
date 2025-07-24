const pool = require('./database');
const fs = require('fs');
const path = require('path');

const initializeDatabase = async () => {
  try {
    console.log('🔧 Initializing database...');
    
    // Read and execute schema
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'schema.sql'), 
      'utf8'
    );
    
    await pool.query(schemaSQL);
    console.log('✅ Database schema created successfully');
    
    // Optional: Add some test data
    const testUserQuery = `
      INSERT INTO users (username, email, password_hash) 
      VALUES ('testuser', 'test@example.com', 'temp_hash')
      ON CONFLICT (username) DO NOTHING
      RETURNING id;
    `;
    
    const result = await pool.query(testUserQuery);
    if (result.rows.length > 0) {
      console.log('✅ Test user created');
    } else {
      console.log('ℹ️  Test user already exists');
    }
    
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

module.exports = initializeDatabase;